import path from "path";
import { Api, StackContext } from "sst/constructs";
import { Queue } from "sst/constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";

export function API({ stack }: StackContext) {
  const queue = new Queue(stack, "Queue", {
    consumer: {
      function: {
        functionName: "task-processor",
        handler: fromRoot("apps/functions/src/processor.handler"),
        runtime: "nodejs18.x",
      },
    },
    cdk: { queue: { queueName: "task-queue" } },
  });

  const fn = new lambda.DockerImageFunction(stack, "TaskAPIFn", {
    code: lambda.DockerImageCode.fromImageAsset(fromRoot("projects/apigw")),
    functionName: "task-api-fn",
    architecture: lambda.Architecture.X86_64,
  });

  fn.addEnvironment("QUEUE_URL", queue.queueUrl);
  queue.cdk.queue.grantSendMessages(fn);

  const api = new Api(stack, "Api", {
    routes: {
      "GET /tasks": {
        cdk: {
          function: fn,
        },
      },
      "POST /tasks": {
        cdk: {
          function: fn,
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    QueueName: queue.queueName,
  });
}

export const normalize = (name: string) => name.replaceAll("/", "-");

export const fromRoot = (p: string): string => path.join("../../", p);
