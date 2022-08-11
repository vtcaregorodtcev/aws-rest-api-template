import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";
import { Test } from "../types/test";

export class TestProvider {
  constructor(private readonly db: DynamoDB, private readonly table: string) {}

  async create(test: Test): Promise<Test> {
    const item = { ...test, id: v4() };

    await this.db
      .putItem({
        TableName: this.table,
        Item: DynamoDB.Converter.marshall(item),
        ConditionExpression: "attribute_not_exists(id)",
      })
      .promise();

    return item as Test;
  }

  async update(test: Test): Promise<Test> {
    await this.db
      .putItem({
        TableName: this.table,
        Item: DynamoDB.Converter.marshall(test),
      })
      .promise();

    return test;
  }

  async scan(): Promise<Test[]> {
    const { Items = [] } = await this.db
      .scan({
        TableName: this.table,
      })
      .promise();

    return (Items || []).map(TestProvider.unmarshall) as Test[];
  }

  private static unmarshall(
    item?: AWS.DynamoDB.AttributeMap | null
  ): Test | null {
    if (item == null) {
      return null;
    }
    return DynamoDB.Converter.unmarshall(item) as Test;
  }
}
