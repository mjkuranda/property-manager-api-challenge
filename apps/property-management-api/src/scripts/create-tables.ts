const { DynamoDB } = require('aws-sdk');
const { DYNAMODB_TABLES } = require('../database/dynamodb/tables.config');

require('dotenv').config();

interface DynamoDBError extends Error {
    code?: string;
}

async function createTables() {
    const dynamodb = new DynamoDB({
        region: process.env.AWS_REGION || 'us-east-1',
        endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local'
    });

    const tables = [
        {
            TableName: DYNAMODB_TABLES.MAINTENANCE_REQUESTS,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' },
                { AttributeName: 'priority', AttributeType: 'S' }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'PriorityIndex',
                    KeySchema: [
                        { AttributeName: 'priority', KeyType: 'HASH' }
                    ],
                    Projection: {
                        ProjectionType: 'ALL'
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    }
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    ];

    for (const tableDefinition of tables) {
        try {
            console.log(`Creating table: ${tableDefinition.TableName}`);
            await dynamodb.createTable(tableDefinition).promise();
            console.log(`Table created successfully: ${tableDefinition.TableName}`);
        } catch (error) {
            const dynamoError = error as DynamoDBError;
            if (dynamoError.code === 'ResourceInUseException') {
                console.log(`Table already exists: ${tableDefinition.TableName}`);
            } else {
                console.error(`Error creating table ${tableDefinition.TableName}:`, dynamoError);
            }
        }
    }
}

// Run if this file is executed directly
if (require.main === module) {
    createTables()
        .then(() => console.log('Tables creation completed'))
        .catch(error => console.error('Error creating tables:', error));
}