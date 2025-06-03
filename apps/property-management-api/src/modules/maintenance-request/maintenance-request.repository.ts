import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { DynamodbService } from '../database/dynamodb/dynamodb.service';
import { CreateMaintenanceRequestDto } from './dtos/create-maintenance-request.dto';
import { AnalyzedFactors, MaintenanceRequest, PriorityLevel, RequestStatus } from './types';
import { AnalysisResponse } from '../analysis-api/types';
import { DYNAMODB_TABLES, DynamoDBTableName } from '../database/dynamodb/tables.config';
import { DatabaseError } from '../../errors';
import { LoggerService } from '../logger/logger.service';
import { ContextString } from '../logger/logger.types';

@Injectable()
export class MaintenanceRequestRepository {

    private readonly dynamodb: DynamoDB.DocumentClient;
    private readonly tableName: DynamoDBTableName;

    constructor(
        private readonly dynamodbService: DynamodbService,
        private readonly loggerService: LoggerService
    ) {
        this.dynamodb = this.dynamodbService.getClient();
        this.tableName = DYNAMODB_TABLES.MAINTENANCE_REQUESTS;
    }

    async create(createRequestDto: CreateMaintenanceRequestDto, analysis: AnalysisResponse, priority: PriorityLevel): Promise<MaintenanceRequest> {
        const context: ContextString = 'MaintenanceRequestRepository/create';

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

        try {
            await this.dynamodb.put({
                TableName: this.tableName,
                Item: request,
            }).promise();

            this.loggerService.info(context, 'Added a new maintenance request to the database.');
        } catch (error: any) {
            this.loggerService.error(context, error.message);

            throw new DatabaseError(error.message);
        }

        return request;
    }

    async findByPriority(priority: PriorityLevel): Promise<MaintenanceRequest[]> {
        const context: ContextString = 'MaintenanceRequestRepository/findByPriority';

        let result;

        try {
            result = await this.dynamodb.query({
                TableName: this.tableName,
                IndexName: 'PriorityIndex',
                KeyConditionExpression: 'priority = :priority',
                ExpressionAttributeValues: {
                    ':priority': priority,
                },
            }).promise();
        } catch (error: any) {
            this.loggerService.error(context, error.message);

            throw new DatabaseError(error.message);
        }

        return (result.Items as MaintenanceRequest[]) || [];
    }

}