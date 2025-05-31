export interface MaintenanceRequest {
    id: string;
    tenantId: string;
    message: string;
    priority: PriorityLevel;
    createdAt: Date;
    resolved: boolean;
    analyzedFactors: {
        keywords: string[];
        priorityScore: number;
    };
}

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface CreateRequestDto {
    tenantId: string;
    message: string;
    timestamp: string;
}

export interface RequestResponse {
    requestId: string;
    priority: PriorityLevel;
    analyzedFactors: {
        keywords: string[];
        priorityScore: number;
    };
}

export interface ListRequestsResponse {
    requests: MaintenanceRequest[];
}

export interface AnalysisServiceResponse {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}