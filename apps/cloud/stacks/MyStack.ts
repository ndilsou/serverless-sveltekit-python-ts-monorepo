import path from "path";
import { StackContext, Api } from "sst/constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
export function API({ stack }: StackContext) {
  // const imagePath = path.join(__dirname, "../../../projects/apigw");
  // console.log("imagePath", imagePath)
  const fn = new lambda.DockerImageFunction(stack, "TaskAPIFn", {
    code: lambda.DockerImageCode.fromImageAsset(fromRoot("projects/apigw")),
    functionName: "task-api-fn",
    architecture: lambda.Architecture.X86_64,
  });

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
  });
}

export const normalize = (name: string) => name.replaceAll("/", "-");

export const fromRoot = (p: string): string =>
  path.join("../../",  p);
