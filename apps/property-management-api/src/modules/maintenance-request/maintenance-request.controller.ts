import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { MaintenanceRequestService } from './services/maintenance-request.service';
import { CreateMaintenanceRequestDto } from './dtos/create-maintenance-request.dto';
import { CreateMaintenanceRequestResponse, GetMaintenanceRequestsResponse, PriorityLevel } from './types';
import { DtoValidationPipe, PriorityValidationPipe } from '../../pipes';

@Controller('requests')
export class MaintenanceRequestController {

    constructor(private readonly maintenanceService: MaintenanceRequestService) {}

    @Post()
    async createRequest(
        @Body(DtoValidationPipe) createRequestDto: CreateMaintenanceRequestDto
    ): Promise<CreateMaintenanceRequestResponse> {
        return this.maintenanceService.createRequest(createRequestDto);
    }

    @Get()
    async getRequests(
        @Query('priority', new PriorityValidationPipe()) priority: PriorityLevel
    ): Promise<GetMaintenanceRequestsResponse> {
        const requests = await this.maintenanceService.getRequestsByPriority(priority);

        return { requests };
    }
}