import { AnalysisRequest, AnalysisResponse } from '../types';
import { KeywordService } from './keyword.service';

export class AnalysisService {

    constructor(private readonly keywordService: KeywordService) {}

    public analyze(request: AnalysisRequest): AnalysisResponse {
        const message = request.message.trim().toLowerCase();
        const { keywords, priorityScore, urgencyCount } = this.keywordService.detectKeywords(message);

        return {
            keywords,
            urgencyIndicators: urgencyCount,
            priorityScore
        };
    }

}