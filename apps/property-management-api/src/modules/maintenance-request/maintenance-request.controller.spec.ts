import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { MaintenanceRequestController } from './maintenance-request.controller';
import { MaintenanceRequestService } from './services/maintenance-request.service';
import { CreateMaintenanceRequestDto } from './dtos/create-maintenance-request.dto';
import { PriorityLevel } from './types';
import { v4 as uuidv4 } from 'uuid';

describe('MaintenanceRequestController', () => {
    let controller: MaintenanceRequestController;
    let service: MaintenanceRequestService;
    let validationPipe: ValidationPipe;

    const mockMaintenanceService = {
        createRequest: jest.fn(),
        getRequestsByPriority: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MaintenanceRequestController],
            providers: [
                {
                    provide: MaintenanceRequestService,
                    useValue: mockMaintenanceService,
                }
            ],
        }).compile();

        controller = module.get<MaintenanceRequestController>(MaintenanceRequestController);
        service = module.get<MaintenanceRequestService>(MaintenanceRequestService);
        validationPipe = new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        });
    });

    describe('POST /requests', () => {
        it('should create a new maintenance request and return priority information', async () => {
            const requestId = uuidv4();
            const createRequestDto: CreateMaintenanceRequestDto = {
                tenantId: uuidv4(),
                message: 'Bathroom pipe burst, water everywhere!',
                timestamp: new Date().toISOString(),
            };

            const expectedResponse = {
                requestId,
                priority: PriorityLevel.HIGH.toLowerCase(),
                analyzedFactors: {
                    keywords: ['burst', 'water', 'emergency'],
                    urgencyIndicators: 2,
                    priorityScore: 0.85,
                },
            };

            mockMaintenanceService.createRequest.mockResolvedValue(expectedResponse);

            // Validate and transform the DTO first
            const validatedDto = await validationPipe.transform(createRequestDto, {
                type: 'body',
                metatype: CreateMaintenanceRequestDto
            });

            const result = await controller.createRequest(validatedDto);

            expect(result).toEqual(expectedResponse);
            expect(service.createRequest).toHaveBeenCalledWith(validatedDto);
            expect(service.createRequest).toHaveBeenCalledTimes(1);
        });

        // Test error scenarios
        it('should throw validation error for missing required fields', async () => {
            const invalidDto = {
                message: '', // Empty message
                // Missing tenantId and timestamp
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: 'body',
                    metatype: CreateMaintenanceRequestDto
                })
            ).rejects.toThrow();
        });

        it('should throw validation error for invalid UUID format', async () => {
            const invalidDto = {
                tenantId: 'not-a-uuid',
                message: 'Valid message',
                timestamp: new Date().toISOString()
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: 'body',
                    metatype: CreateMaintenanceRequestDto
                })
            ).rejects.toThrow();
        });

        it('should throw validation error for invalid timestamp format', async () => {
            const invalidDto = {
                tenantId: uuidv4(),
                message: 'Valid message',
                timestamp: 'not-a-timestamp'
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: 'body',
                    metatype: CreateMaintenanceRequestDto
                })
            ).rejects.toThrow();
        });

        it('should throw validation error for message length constraints', async () => {
            const invalidDto = {
                tenantId: uuidv4(),
                message: 'ab', // Too short (min length is 3)
                timestamp: new Date().toISOString()
            };

            await expect(
                validationPipe.transform(invalidDto, {
                    type: 'body',
                    metatype: CreateMaintenanceRequestDto
                })
            ).rejects.toThrow();
        });
    });
});