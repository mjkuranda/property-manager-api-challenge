import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceRequestService } from './maintenance-request.service';
import { MaintenanceRequestRepository } from '../maintenance-request.repository';
import { AnalysisApiService } from '../../analysis-api/analysis-api.service';
import { MaintenanceRequestPriorityService } from './maintenance-request-priority.service';
import { CreateMaintenanceRequestDto } from '../dtos/create-maintenance-request.dto';
import { PriorityLevel } from '../types';
import { MaintenanceRequestCreationError } from '../../../errors';
import { v4 as uuidv4 } from 'uuid';

describe('MaintenanceRequestService', () => {
    let service: MaintenanceRequestService;
    let repository: MaintenanceRequestRepository;
    let priorityService: MaintenanceRequestPriorityService;
    let analysisService: AnalysisApiService;

    const mockRepository = {
        create: jest.fn(),
        findByPriority: jest.fn(),
    };

    const mockPriorityService = {
        determinePriority: jest.fn(),
    };

    const mockAnalysisService = {
        analyze: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MaintenanceRequestService,
                {
                    provide: MaintenanceRequestRepository,
                    useValue: mockRepository,
                },
                {
                    provide: MaintenanceRequestPriorityService,
                    useValue: mockPriorityService,
                },
                {
                    provide: AnalysisApiService,
                    useValue: mockAnalysisService,
                },
            ],
        }).compile();

        service = module.get<MaintenanceRequestService>(MaintenanceRequestService);
        repository = module.get<MaintenanceRequestRepository>(MaintenanceRequestRepository);
        priorityService = module.get<MaintenanceRequestPriorityService>(MaintenanceRequestPriorityService);
        analysisService = module.get<AnalysisApiService>(AnalysisApiService);
    });

    describe('createRequest', () => {
        const createRequestDto: CreateMaintenanceRequestDto = {
            tenantId: uuidv4(),
            message: 'Bathroom pipe burst, water everywhere!',
            timestamp: new Date().toISOString(),
        };

        const mockAnalysis = {
            keywords: ['burst', 'water', 'emergency'],
            urgencyIndicators: 2,
            priorityScore: 0.85,
        };

        const mockNewRequest = {
            id: uuidv4(),
            tenantId: createRequestDto.tenantId,
            message: createRequestDto.message,
            priority: PriorityLevel.HIGH,
            status: 'PENDING',
            createdAt: createRequestDto.timestamp,
            updatedAt: createRequestDto.timestamp,
            resolved: false,
            analyzedFactors: mockAnalysis,
        };

        it('should successfully create a maintenance request', async () => {
            mockAnalysisService.analyze.mockResolvedValue(mockAnalysis);
            mockPriorityService.determinePriority.mockReturnValue(PriorityLevel.HIGH);
            mockRepository.create.mockResolvedValue(mockNewRequest);

            const result = await service.createRequest(createRequestDto);

            expect(result).toEqual({
                requestId: mockNewRequest.id,
                priority: PriorityLevel.HIGH.toLowerCase(),
                analyzedFactors: mockNewRequest.analyzedFactors,
            });

            expect(analysisService.analyze).toHaveBeenCalledWith(createRequestDto.message);
            expect(priorityService.determinePriority).toHaveBeenCalledWith(mockAnalysis);
            expect(repository.create).toHaveBeenCalledWith(createRequestDto, mockAnalysis, PriorityLevel.HIGH);
        });

        it('should throw MaintenanceRequestCreationError when repository creation fails', async () => {
            mockAnalysisService.analyze.mockResolvedValue(mockAnalysis);
            mockPriorityService.determinePriority.mockReturnValue(PriorityLevel.HIGH);
            mockRepository.create.mockRejectedValue(new Error('Database error'));

            await expect(service.createRequest(createRequestDto))
                .rejects
                .toThrow(MaintenanceRequestCreationError);
        });

        it('should propagate analysis service errors', async () => {
            const error = new Error('Analysis service error');
            mockAnalysisService.analyze.mockRejectedValue(error);

            await expect(service.createRequest(createRequestDto))
                .rejects
                .toThrow(error);
        });
    });

    describe('getRequestsByPriority', () => {
        it('should return requests filtered by priority', async () => {
            const mockRequests = [
                {
                    id: uuidv4(),
                    priority: PriorityLevel.HIGH,
                    message: 'Emergency request',
                    createdAt: new Date().toISOString(),
                },
                {
                    id: uuidv4(),
                    priority: PriorityLevel.HIGH,
                    message: 'Another emergency',
                    createdAt: new Date().toISOString(),
                },
            ];

            mockRepository.findByPriority.mockResolvedValue(mockRequests);

            const result = await service.getRequestsByPriority(PriorityLevel.HIGH);

            expect(result).toEqual(mockRequests);
            expect(repository.findByPriority).toHaveBeenCalledWith(PriorityLevel.HIGH);
        });

        it('should return empty array when no requests found', async () => {
            mockRepository.findByPriority.mockResolvedValue([]);

            const result = await service.getRequestsByPriority(PriorityLevel.LOW);

            expect(result).toEqual([]);
            expect(repository.findByPriority).toHaveBeenCalledWith(PriorityLevel.LOW);
        });

        it('should propagate repository errors', async () => {
            const error = new Error('Database error');
            mockRepository.findByPriority.mockRejectedValue(error);

            await expect(service.getRequestsByPriority(PriorityLevel.MEDIUM))
                .rejects
                .toThrow(error);
        });
    });
}); 