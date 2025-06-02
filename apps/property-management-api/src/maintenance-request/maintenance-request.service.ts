import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MaintenanceRequestRepository } from './maintenance-request.repository';
import { CreateMaintenanceRequestResponse, MaintenanceRequest } from './maintenance-request.types';
import { CreateMaintenanceRequestDto } from './maintenance-request.dto';
import { AnalysisApiService } from '../analysis-api/analysis-api.service';

@Injectable()
export class MaintenanceRequestService {

    constructor(
        private readonly maintenanceRequestRepository: MaintenanceRequestRepository,
        private readonly analysisApiService: AnalysisApiService
    ) {}

    async createRequest(createRequestDto: CreateMaintenanceRequestDto): Promise<CreateMaintenanceRequestResponse> {
        const requestId = `REQ${uuidv4()}`;
        const priority = this.analyzePriority(createRequestDto.message);
        const analyzedFactors = this.analyzeRequest(createRequestDto.message);

        const request: MaintenanceRequest = {
            id: requestId,
            tenantId: createRequestDto.tenantId,
            message: createRequestDto.message,
            priority,
            createdAt: createRequestDto.timestamp,
            resolved: false,
            analyzedFactors
        };

        await this.maintenanceRequestRepository.create(request);

        return {
            requestId,
            priority,
            analyzedFactors
        };
    }

    async getRequestsByPriority(priority: string): Promise<MaintenanceRequest[]> {
        return this.maintenanceRequestRepository.findByPriority(priority);
    }
}