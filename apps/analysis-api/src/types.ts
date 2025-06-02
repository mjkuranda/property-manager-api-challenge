import { AnalysisRequest, AnalysisResponse, PriorityLevel } from '../../shared/types/maintenance.types';

export { AnalysisRequest, AnalysisResponse, PriorityLevel };

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