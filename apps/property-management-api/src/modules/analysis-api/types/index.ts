export interface AnalysisRequest {
    message: string;
}

export interface AnalysisResponse {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}

export type AnalyzeRequestMessage = AnalysisRequest['message'];

export interface AnalyzeRequestResponse {
    isSuccess: true;
    data: AnalysisResponse;
}