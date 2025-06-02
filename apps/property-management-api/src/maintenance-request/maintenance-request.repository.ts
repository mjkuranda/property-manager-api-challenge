import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {
    AnalysisResponse,
    AnalyzedFactors,
    MaintenanceRequest, PriorityLevel,
    RequestStatus
} from './maintenance-request.types';
import { Injectable } from '@nestjs/common';
import { DynamodbService } from '../database/dynamodb/dynamodb.service';
import { DYNAMODB_TABLES, DynamoDBTableName } from '../database/dynamodb/tables.config';
import { CreateMaintenanceRequestDto } from './dtos/create-maintenance-request.dto';

@Injectable()
export class MaintenanceRequestRepository {

    private readonly dynamodb: DynamoDB.DocumentClient;
    private readonly tableName: DynamoDBTableName;

    constructor(private readonly dynamodbService: DynamodbService) {
        this.dynamodb = this.dynamodbService.getClient();
        this.tableName = DYNAMODB_TABLES.MAINTENANCE_REQUESTS;
    }

    async create(createRequestDto: CreateMaintenanceRequestDto, analysis: AnalysisResponse, priority: PriorityLevel): Promise<MaintenanceRequest> {
        const requestId = uuidv4();
        const now = new Date().toISOString();

        const analyzedFactors: AnalyzedFactors = {
            keywords: analysis.keywords,
            urgencyIndicators: analysis.urgencyIndicators,
            priorityScore: analysis.priorityScore
        };

        const request: MaintenanceRequest = {
            id: requestId,
            tenantId: createRequestDto.tenantId,
            message: createRequestDto.message,
            priority,
            status: RequestStatus.PENDING,
            createdAt: createRequestDto.timestamp || now,
            updatedAt: now,
            resolved: false,
            analyzedFactors
        };

        await this.dynamodb.put({
            TableName: this.tableName,
            Item: request,
        }).promise();

        return request;
    }

    async findByPriority(priority: PriorityLevel): Promise<MaintenanceRequest[]> {
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