export interface KeywordCategory {
    keywords: string[];
    score: number;
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

export interface AnalysisRequest {
    message: string;
}

export interface AnalysisResponse {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}

export interface AnalyzedFactors {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}