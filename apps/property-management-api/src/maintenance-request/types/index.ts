export interface AnalyzedFactors {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}

export enum PriorityLevel {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
}

export enum RequestStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
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
    priority: string;
    analyzedFactors: AnalyzedFactors;
}

export interface GetMaintenanceRequestsResponse {
    requests: MaintenanceRequest[];
}