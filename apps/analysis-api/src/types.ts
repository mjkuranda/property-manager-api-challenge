export interface KeywordObject {
    keyword: string;
    isUrgent?: boolean;
}

export interface DetectedInformation {
    keywords: string[],
    priorityScore: number,
    urgencyIndicators: number
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

export type AnalysisResponse = DetectedInformation;