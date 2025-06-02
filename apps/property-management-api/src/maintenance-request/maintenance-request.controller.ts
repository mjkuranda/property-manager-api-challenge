import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { MaintenanceRequestService } from './maintenance-request.service';
import { CreateMaintenanceRequestDto } from './maintenance-request.dto';
import { CreateMaintenanceRequestResponse, GetMaintenanceRequestsResponse } from './maintenance-request.types';

@Controller('requests')
export class MaintenanceRequestController {

    constructor(private readonly maintenanceService: MaintenanceRequestService) {}

    @Post()
    async createRequest(@Body() createRequestDto: CreateMaintenanceRequestDto): Promise<CreateMaintenanceRequestResponse> {
        return this.maintenanceService.createRequest(createRequestDto);
    }

    @Get()
    async getRequests(@Query('priority') priority: RequestPriority): Promise<GetMaintenanceRequestsResponse> {
        const requests = await this.maintenanceService.getRequestsByPriority(priority);

        return { requests };
    }
}