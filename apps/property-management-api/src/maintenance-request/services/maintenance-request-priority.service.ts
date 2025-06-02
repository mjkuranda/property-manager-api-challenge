import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PriorityLevel } from '../types';
import { AnalysisResponse } from '../../analysis-api/types';

@Injectable()
export class MaintenanceRequestPriorityService {

    private readonly priorityThresholds: { high: number; medium: number };

    constructor(
        private readonly configService: ConfigService
    ) {
        this.priorityThresholds = {
            high: this.configService.get<number>('maintenance.priorityThreshold.high') as number,
            medium: this.configService.get<number>('maintenance.priorityThreshold.medium') as number
        };
    }

    public determinePriority(analysis: AnalysisResponse): PriorityLevel {
        const { priorityScore, urgencyIndicators, keywords } = analysis;

        if (urgencyIndicators >= 2 || priorityScore >= this.priorityThresholds.high) {
            return PriorityLevel.HIGH;
        }

        if (priorityScore >= this.priorityThresholds.medium) {
            return PriorityLevel.MEDIUM;
        }

        return PriorityLevel.LOW;
    }

}