const DYNAMODB_TABLES = {
    MAINTENANCE_REQUESTS: 'maintenance-requests',
} as const;

type DynamoDBTableName = typeof DYNAMODB_TABLES[keyof typeof DYNAMODB_TABLES];

module.exports = {
    DYNAMODB_TABLES,
    DynamoDBTableName
};