import { DetectedInformation } from '../types';
import { keywordObjects } from '../config/keywords.config';

export class KeywordService {

    detectKeywords(message: string): DetectedInformation {
        const detectedKeywords: string[] = [];
        let urgencyIndicators = 0;
        let mediumIndicators = 0;

        for (const { keyword, isUrgent, isMedium } of keywordObjects) {
            if (message.includes(keyword.toLowerCase())) {
                detectedKeywords.push(keyword);

                if (isUrgent) {
                    urgencyIndicators++;

                    continue;
                }

                if (isMedium) {
                    mediumIndicators++;
                }
            }
        }

        const priorityScore = this.calculatePriorityScore(urgencyIndicators, mediumIndicators);

        return {
            keywords: detectedKeywords,
            priorityScore,
            urgencyIndicators
        };
    }

    calculatePriorityScore(urgencyIndicators: number, mediumIndicators: number): number {
        const baseScore = 0.2;
        const maxScore = 1;

        const value = Math.min(maxScore, baseScore + (urgencyIndicators * 0.3) + (mediumIndicators * 0.2));

        return parseFloat(value.toFixed(2));
    }
}