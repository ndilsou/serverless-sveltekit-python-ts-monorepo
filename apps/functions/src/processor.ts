import { SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (event) => {
    console.log("Message processed!", event);
    return {batchItemFailures: []};
  }