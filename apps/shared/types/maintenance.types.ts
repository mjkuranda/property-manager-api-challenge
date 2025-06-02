// Priority level enum
export enum PriorityLevel {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
}

// Request status enum
export enum RequestStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

// Analysis service types
export interface AnalysisRequest {
    message: string;
}

export interface AnalysisResponse {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}

// The analyzed factors structure as per technical requirements
export interface AnalyzedFactors {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}

export interface MaintenanceRequest {
    id: string;
    tenantId: string;
    message: string;
    priority: PriorityLevel;
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
    resolved: boolean;
    analyzedFactors: AnalyzedFactors;
}

export interface CreateMaintenanceRequestResponse {
    requestId: string;
    priority: string; // As per API spec, this should be a string
    analyzedFactors: AnalyzedFactors;
}

export interface GetMaintenanceRequestsResponse {
    requests: MaintenanceRequest[];
}