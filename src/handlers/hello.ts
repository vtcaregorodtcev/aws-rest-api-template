import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { HttpResponse } from "../helpers/HttpResponse";
import { Logger } from "../helpers/Logger";
import { TestProvider } from "../providers";
import { TEST_TABLE_NAME } from "../constants";

const logger = new Logger("Create Bookmark");

const db = new DynamoDB();
const testProvider = new TestProvider(db, TEST_TABLE_NAME);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    logger.log("Event", JSON.stringify(event));

    await testProvider.create({});

    return HttpResponse.success(await testProvider.scan());
  } catch (e) {
    logger.err("Error", e);
    return HttpResponse.serverError(e);
  }
};
