import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnalysisResponse, PriorityLevel } from '../../../../shared/types/maintenance.types';

@Injectable()
export class MaintenanceRequestPriorityService {

    private readonly priorityThresholds: { high: number; medium: number };

    constructor(
        private readonly configService: ConfigService
    ) {
        this.priorityThresholds = {
            high: this.configService.get<number>('maintenance.priorityThreshold.high'),
            medium: this.configService.get<number>('maintenance.priorityThreshold.medium')
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