import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {
    CreateMaintenanceRequestInput,
    MaintenanceRequest,
    RequestStatus
} from './maintenance-request.types';
import { Injectable } from '@nestjs/common';
import { DynamodbService } from '../database/dynamodb/dynamodb.service';
import { DYNAMODB_TABLES, DynamoDBTableName } from '../database/dynamodb/tables.config';

@Injectable()
export class MaintenanceRequestRepository {
    private readonly dynamodb: DynamoDB.DocumentClient;
    private readonly tableName: DynamoDBTableName;

    constructor(private readonly dynamodbService: DynamodbService) {
        this.dynamodb = this.dynamodbService.getClient();
        this.tableName = DYNAMODB_TABLES.MAINTENANCE_REQUESTS;
    }

    async create(input: CreateMaintenanceRequestInput): Promise<MaintenanceRequest> {
        const now = new Date().toISOString();
        const request: MaintenanceRequest = {
            id: uuidv4(),
            ...input,
            status: RequestStatus.PENDING,
            createdAt: now,
            updatedAt: now,
        };

        await this.dynamodb.put({
            TableName: this.tableName,
            Item: request,
        }).promise();

        return request;
    }

    async findByPriority(priority: string): Promise<MaintenanceRequest[]> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            IndexName: 'PriorityIndex',
            KeyConditionExpression: 'priority = :priority',
            ExpressionAttributeValues: {
                ':priority': priority,
            },
        }).promise();

        return (result.Items as MaintenanceRequest[]) || [];
    }

}