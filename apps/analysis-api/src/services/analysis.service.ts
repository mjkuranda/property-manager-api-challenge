import { keywordCategories } from '../config/keywords.config';
import { AnalysisRequest, AnalysisResponse, KeywordCategory } from '../types';

export class AnalysisService {

    public analyze(request: AnalysisRequest): AnalysisResponse {
        const message = request.message.trim().toLowerCase();
        const { keywords, maxScore, urgencyCount } = this.detectKeywords(message, keywordCategories);

        const finalScore = keywords.length === 0
            ? this.calculatePriorityScore(0.1, 0)
            : this.calculatePriorityScore(maxScore, urgencyCount);

        return {
            keywords,
            urgencyIndicators: urgencyCount,
            priorityScore: finalScore
        };
    }

    // TODO: Create a separate service
    private detectKeywords(
        message: string,
        categories: KeywordCategory[]
    ): { keywords: string[], maxScore: number, urgencyCount: number } {
        const detectedKeywords: string[] = [];
        let maxScore = 0;
        let urgencyCount = 0;

        for (const category of categories) {
            for (const keyword of category.keywords) {
                if (message.includes(keyword.toLowerCase())) {
                    detectedKeywords.push(keyword);
                    maxScore = Math.max(maxScore, category.score);
                    urgencyCount++;
                }
            }
        }

        return { keywords: detectedKeywords, maxScore, urgencyCount };
    }

    private calculatePriorityScore(maxScore: number, urgencyCount: number): number {
        return Math.min(1.0, maxScore * (1 + urgencyCount * 0.1));
    }

}