import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MaintenanceRequestRepository } from './maintenance-request.repository';
import {
    MaintenanceRequest,
    CreateMaintenanceRequestDto,
    CreateMaintenanceRequestResponse,
    RequestStatus,
    AnalyzedFactors, PriorityLevel,
} from './maintenance-request.types';
import { AnalysisApiService } from '../analysis-api/analysis-api.service';
import { MaintenanceRequestPriorityService } from './maintenance-request-priority.service';

@Injectable()
export class MaintenanceRequestService {

    constructor(
        private readonly maintenanceRequestRepository: MaintenanceRequestRepository,
        private readonly maintenanceRequestPriorityService: MaintenanceRequestPriorityService,
        private readonly analysisApiService: AnalysisApiService
    ) {}

    async createRequest(createRequestDto: CreateMaintenanceRequestDto): Promise<CreateMaintenanceRequestResponse> {
        const analysis = await this.analysisApiService.analyze(createRequestDto.message);
        const priority = this.maintenanceRequestPriorityService.determinePriority(analysis);

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

        await this.maintenanceRequestRepository.create(request);

        return {
            requestId,
            priority: priority.toLowerCase(),
            analyzedFactors
        };
    }

    async getRequestsByPriority(priority: PriorityLevel): Promise<MaintenanceRequest[]> {
        return await this.maintenanceRequestRepository.findByPriority(priority);
    }

}