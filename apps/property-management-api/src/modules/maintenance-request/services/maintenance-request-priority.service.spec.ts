import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MaintenanceRequestPriorityService } from './maintenance-request-priority.service';
import { PriorityLevel } from '../types';
import { AnalysisResponse } from '../../analysis-api/types';

describe('MaintenanceRequestPriorityService', () => {
    let service: MaintenanceRequestPriorityService;

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === 'maintenance.priorityThreshold.high') return 0.7;
            if (key === 'maintenance.priorityThreshold.medium') return 0.4;

            return null;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MaintenanceRequestPriorityService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<MaintenanceRequestPriorityService>(MaintenanceRequestPriorityService);
    });

    describe('determinePriority', () => {
        it('should return HIGH priority for emergency situations', () => {
            const analysis: AnalysisResponse = {
                keywords: ['leak', 'flood', 'urgent'],
                urgencyIndicators: 3,
                priorityScore: 0.85
            };

            expect(service.determinePriority(analysis)).toBe(PriorityLevel.HIGH);
        });

        it('should return HIGH priority when urgencyIndicators >= 2 regardless of score', () => {
            const analysis: AnalysisResponse = {
                keywords: ['broken', 'urgent'],
                urgencyIndicators: 2,
                priorityScore: 0.5 // Below high threshold but has 2 urgency indicators
            };

            expect(service.determinePriority(analysis)).toBe(PriorityLevel.HIGH);
        });

        it('should return MEDIUM priority for non-emergency but important issues', () => {
            const analysis: AnalysisResponse = {
                keywords: ['broken', 'appliance'],
                urgencyIndicators: 1,
                priorityScore: 0.5
            };

            expect(service.determinePriority(analysis)).toBe(PriorityLevel.MEDIUM);
        });

        it('should return LOW priority for routine maintenance', () => {
            const analysis: AnalysisResponse = {
                keywords: ['paint', 'squeaky'],
                urgencyIndicators: 0,
                priorityScore: 0.2
            };

            expect(service.determinePriority(analysis)).toBe(PriorityLevel.LOW);
        });
    });
});