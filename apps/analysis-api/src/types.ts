export interface AnalysisRequest {
    message: string;
}

export interface AnalysisResponse {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface KeywordCategory {
    keywords: string[];
    score: number;
    priority: PriorityLevel;
}

export interface ValidationErrorDetails {
    property: string;
    constraints: {[p: string]: string};
}

export interface SuccessResponse<Data extends object> {
    isSuccess: true;
    data: Data
}

export interface ErrorResponse {
    isSuccess: false;
    error: {
        code: number;
        message: string;
    }
}