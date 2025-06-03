import { Module } from '@nestjs/common';
import { MaintenanceRequestController } from './maintenance-request.controller';
import { MaintenanceRequestService } from './services/maintenance-request.service';
import { MaintenanceRequestRepository } from './maintenance-request.repository';
import { MaintenanceRequestPriorityService } from './services/maintenance-request-priority.service';
import { AnalysisApiModule } from '../analysis-api/analysis-api.module';
import { DynamoDBModule } from '../database/dynamodb/dynamodb.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [AnalysisApiModule, DynamoDBModule, LoggerModule],
    controllers: [MaintenanceRequestController],
    providers: [
        MaintenanceRequestService,
        MaintenanceRequestPriorityService,
        MaintenanceRequestRepository
    ]
})
export class MaintenanceRequestModule {}