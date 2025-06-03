import { Injectable } from '@nestjs/common';
import { MaintenanceRequestRepository } from '../maintenance-request.repository';
import { AnalysisApiService } from '../../analysis-api/analysis-api.service';
import { MaintenanceRequestPriorityService } from './maintenance-request-priority.service';
import { CreateMaintenanceRequestDto } from '../dtos/create-maintenance-request.dto';
import { CreateMaintenanceRequestResponse, MaintenanceRequest, PriorityLevel } from '../types';
import { DatabaseError, MaintenanceRequestCreationError } from '../../../errors';
import { LoggerService } from '../../logger/logger.service';
import { ContextString } from '../../logger/logger.types';

@Injectable()
export class MaintenanceRequestService {

    constructor(
        private readonly maintenanceRequestRepository: MaintenanceRequestRepository,
        private readonly maintenanceRequestPriorityService: MaintenanceRequestPriorityService,
        private readonly analysisApiService: AnalysisApiService,
        private readonly loggerService: LoggerService
    ) {}

    async createRequest(createRequestDto: CreateMaintenanceRequestDto): Promise<CreateMaintenanceRequestResponse> {
        const context: ContextString = 'MaintenanceRequestService/createRequest';

        const analysis = await this.analysisApiService.analyze(createRequestDto.message);
        const priority = this.maintenanceRequestPriorityService.determinePriority(analysis);

        try {
            const newRequest = await this.maintenanceRequestRepository.create(createRequestDto, analysis, priority);

            this.loggerService.info(context, `Created a new maintenance request with "${newRequest.id}" id.`);

            return {
                requestId: newRequest.id,
                priority: priority.toLowerCase(),
                analyzedFactors: newRequest.analyzedFactors
            };
        } catch (error: any) {
            if (error instanceof DatabaseError) {
                throw error;
            }

            this.loggerService.error(context, error.message);

            throw new MaintenanceRequestCreationError(error.message);
        }
    }

    async getRequestsByPriority(priority: PriorityLevel): Promise<MaintenanceRequest[]> {
        const requests = await this.maintenanceRequestRepository.findByPriority(priority);
        const requestString = requests.length === 1 ? 'request' : 'requests';

        this.loggerService.info(
            'MaintenanceRequestService/getRequestsByPriority',
            `Received ${requests.length} ${requestString} for ${priority} priority.`
        );

        return requests;
    }
}