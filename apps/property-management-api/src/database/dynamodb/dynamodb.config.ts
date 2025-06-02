import { DynamoDB } from 'aws-sdk';

export interface DynamoDBConfig {
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface DynamoDBModuleOptions {
  config: DynamoDBConfig;
}

export const createDynamoDBClient = (config: DynamoDBConfig): DynamoDB.DocumentClient => {
  return new DynamoDB.DocumentClient({
    region: config.region || process.env.AWS_REGION || 'us-east-1',
    endpoint: config.endpoint || process.env.DYNAMODB_ENDPOINT,
    credentials: config.accessKeyId && config.secretAccessKey
      ? {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        }
      : undefined,
  });
}; 