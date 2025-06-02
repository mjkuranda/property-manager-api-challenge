import { Controller, Post, Get, Body, Query, ValidationPipe, ParseEnumPipe } from '@nestjs/common';
import { MaintenanceRequestService } from './services/maintenance-request.service';
import { CreateMaintenanceRequestDto } from './dtos/create-maintenance-request.dto';
import { CreateMaintenanceRequestResponse, GetMaintenanceRequestsResponse, PriorityLevel } from './types';

@Controller('requests')
export class MaintenanceRequestController {

    constructor(private readonly maintenanceService: MaintenanceRequestService) {}

    @Post()
    async createRequest(
        @Body(ValidationPipe) createRequestDto: CreateMaintenanceRequestDto
    ): Promise<CreateMaintenanceRequestResponse> {
        return this.maintenanceService.createRequest(createRequestDto);
    }

    @Get()
    async getRequests(
        @Query('priority', new ParseEnumPipe(PriorityLevel)) priority: PriorityLevel
    ): Promise<GetMaintenanceRequestsResponse> {
        const requests = await this.maintenanceService.getRequestsByPriority(priority);

        return { requests };
    }
}