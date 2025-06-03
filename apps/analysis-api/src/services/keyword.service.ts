import { DetectedInformation } from '../types';
import { keywordObjects } from '../config/keywords.config';

export class KeywordService {

    detectKeywords(message: string): DetectedInformation {
        const detectedKeywords: string[] = [];
        let urgencyIndicators = 0;

        for (const { keyword, isUrgent } of keywordObjects) {
            if (message.includes(keyword.toLowerCase())) {
                detectedKeywords.push(keyword);

                if (isUrgent) {
                    urgencyIndicators++;
                }
            }
        }

        const priorityScore = this.calculatePriorityScore(urgencyIndicators);

        return {
            keywords: detectedKeywords,
            priorityScore,
            urgencyIndicators
        };
    }

    calculatePriorityScore(urgencyIndicators: number): number {
        const baseScore = 0.1;
        const maxScore = 1;

        return Math.min(maxScore, baseScore + (urgencyIndicators * 0.3));
    }
}