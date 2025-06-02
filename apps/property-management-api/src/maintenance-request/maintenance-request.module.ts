import { Module } from '@nestjs/common';
import { MaintenanceRequestController } from './maintenance-request.controller';
import { MaintenanceRequestService } from './maintenance-request.service';
import { MaintenanceRequestRepository } from './maintenance-request.repository';
import { AnalysisApiModule } from '../analysis-api/analysis-api.module';

@Module({
    imports: [AnalysisApiModule],
    controllers: [MaintenanceRequestController],
    providers: [
        MaintenanceRequestService,
        MaintenanceRequestRepository
    ],
})
export class MaintenanceRequestModule {}