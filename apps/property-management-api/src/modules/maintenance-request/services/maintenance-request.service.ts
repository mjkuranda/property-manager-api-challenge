import { Injectable } from '@nestjs/common';
import { MaintenanceRequestRepository } from '../maintenance-request.repository';
import { AnalysisApiService } from '../../analysis-api/analysis-api.service';
import { MaintenanceRequestPriorityService } from './maintenance-request-priority.service';
import { CreateMaintenanceRequestDto } from '../dtos/create-maintenance-request.dto';
import { CreateMaintenanceRequestResponse, MaintenanceRequest, PriorityLevel } from '../types';
import { MaintenanceRequestCreationError } from '../../../errors';

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

        try {
            const newRequest = await this.maintenanceRequestRepository.create(createRequestDto, analysis, priority);

            return {
                requestId: newRequest.id,
                priority: priority.toLowerCase(),
                analyzedFactors: newRequest.analyzedFactors
            };
        } catch (error: any) {
            throw new MaintenanceRequestCreationError(error.message);
        }
    }

    async getRequestsByPriority(priority: PriorityLevel): Promise<MaintenanceRequest[]> {
        return await this.maintenanceRequestRepository.findByPriority(priority);
    }
}