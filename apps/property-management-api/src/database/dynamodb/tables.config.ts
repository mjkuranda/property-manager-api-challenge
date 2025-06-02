export const DYNAMODB_TABLES = {
    MAINTENANCE_REQUESTS: 'maintenance-requests',
} as const;

export type DynamoDBTableName = typeof DYNAMODB_TABLES[keyof typeof DYNAMODB_TABLES];