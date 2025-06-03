import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { PriorityLevel } from '../src/modules/maintenance-request/types';
import { AnalysisApiService } from '../src/modules/analysis-api/analysis-api.service';
import { MaintenanceRequestRepository } from '../src/modules/maintenance-request/maintenance-request.repository';
import { MaintenanceRequestModule } from '../src/modules/maintenance-request/maintenance-request.module';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from '../src/config';
import { HttpModule } from '@nestjs/axios';
import { GlobalExceptionFilter } from '../src/filters';
import { DatabaseError } from '../src/errors';

describe('MaintenanceRequest (e2e)', () => {
    let app: INestApplication;
    let analysisService: AnalysisApiService;
    let repository: MaintenanceRequestRepository;

    const mockAnalysis = {
        keywords: ['burst', 'water', 'emergency'],
        urgencyIndicators: 2,
        priorityScore: 0.85,
    };

    const mockRepository = {
        create: jest.fn(),
        findByPriority: jest.fn(),
    };

    const mockAnalysisService = {
        analyze: jest.fn().mockResolvedValue(mockAnalysis),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                MaintenanceRequestModule,
                HttpModule,
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [loadConfig]
                })
            ],
        })
            .overrideProvider(AnalysisApiService)
            .useValue(mockAnalysisService)
            .overrideProvider(MaintenanceRequestRepository)
            .useValue(mockRepository)
            .compile();

        app = moduleFixture.createNestApplication();

        app.setGlobalPrefix('api');
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: '1'
        });

        app.useGlobalFilters(new GlobalExceptionFilter());

        analysisService = moduleFixture.get<AnalysisApiService>(AnalysisApiService);
        repository = moduleFixture.get<MaintenanceRequestRepository>(MaintenanceRequestRepository);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/v1/requests', () => {
        const validRequest = {
            tenantId: uuidv4(),
            message: 'Bathroom pipe burst, water everywhere!',
            timestamp: new Date().toISOString(),
        };

        const mockCreatedRequest = {
            id: uuidv4(),
            ...validRequest,
            priority: PriorityLevel.HIGH,
            status: 'PENDING',
            createdAt: validRequest.timestamp,
            updatedAt: validRequest.timestamp,
            resolved: false,
            analyzedFactors: mockAnalysis,
        };

        beforeEach(() => {
            jest.clearAllMocks();
            mockRepository.create.mockResolvedValue(mockCreatedRequest);
        });

        it('should create a maintenance request', () => {
            return request(app.getHttpServer())
                .post('/api/v1/requests')
                .send(validRequest)
                .expect(201)
                .expect((response) => {
                    expect(response.body).toEqual({
                        requestId: mockCreatedRequest.id,
                        priority: PriorityLevel.HIGH.toLowerCase(),
                        analyzedFactors: mockAnalysis,
                    });

                    expect(mockAnalysisService.analyze).toHaveBeenCalledWith(validRequest.message);
                    expect(mockRepository.create).toHaveBeenCalled();
                });
        });

        it('should validate request body', () => {
            const invalidRequest = {
                message: '', // Empty message
                // Missing tenantId and timestamp
            };

            return request(app.getHttpServer())
                .post('/api/v1/requests')
                .send(invalidRequest)
                .expect(400)
                .expect((response) => {
                    expect(response.body.message).toContain('tenantId');
                    expect(response.body.message).toContain('timestamp');
                    expect(response.body.message).toContain('message');
                });
        });

        it('should validate UUID format', () => {
            const invalidUuidRequest = {
                ...validRequest,
                tenantId: 'not-a-uuid',
            };

            return request(app.getHttpServer())
                .post('/api/v1/requests')
                .send(invalidUuidRequest)
                .expect(400)
                .expect((response) => {
                    expect(response.body.message).toContain('tenantId');
                    expect(response.body.message).toContain('UUID');
                });
        });

        it('should handle internal server errors', () => {
            mockRepository.create.mockRejectedValue(new DatabaseError('Database error'));

            return request(app.getHttpServer())
                .post('/api/v1/requests')
                .send(validRequest)
                .expect(500);
        });
    });

    describe('GET /api/v1/requests', () => {
        const mockRequests = [
            {
                id: uuidv4(),
                tenantId: uuidv4(),
                message: 'Emergency request',
                priority: PriorityLevel.HIGH,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                resolved: false,
                analyzedFactors: {
                    keywords: ['emergency'],
                    urgencyIndicators: 1,
                    priorityScore: 0.75,
                },
            },
            {
                id: uuidv4(),
                tenantId: uuidv4(),
                message: 'Another emergency',
                priority: PriorityLevel.HIGH,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                resolved: false,
                analyzedFactors: {
                    keywords: ['emergency'],
                    urgencyIndicators: 1,
                    priorityScore: 0.8,
                },
            },
        ];

        beforeEach(() => {
            jest.clearAllMocks();
            mockRepository.findByPriority.mockResolvedValue(mockRequests);
        });

        it('should get requests by priority', () => {
            return request(app.getHttpServer())
                .get('/api/v1/requests')
                .query({ priority: 'high' })
                .expect(200)
                .expect((response) => {
                    expect(response.body).toEqual({ requests: mockRequests });
                    expect(mockRepository.findByPriority).toHaveBeenCalledWith(PriorityLevel.HIGH);
                });
        });

        it('should validate priority query parameter', () => {
            return request(app.getHttpServer())
                .get('/api/v1/requests')
                .query({ priority: 'invalid-priority' })
                .expect(400)
                .expect((response) => {
                    expect(response.body.message).toContain('Invalid');
                });
        });

        it('should handle empty results', () => {
            mockRepository.findByPriority.mockResolvedValue([]);

            return request(app.getHttpServer())
                .get('/api/v1/requests')
                .query({ priority: PriorityLevel.LOW })
                .expect(200)
                .expect((response) => {
                    expect(response.body).toEqual({ requests: [] });
                });
        });

        it('should handle internal server errors', () => {
            mockRepository.findByPriority.mockRejectedValue(new DatabaseError('Database error'));

            return request(app.getHttpServer())
                .get('/api/v1/requests')
                .query({ priority: PriorityLevel.HIGH })
                .expect(500);
        });
    });
});