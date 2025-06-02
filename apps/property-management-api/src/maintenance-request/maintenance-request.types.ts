import { AnalyzeRequestResponse } from '../analysis-api/analysis-api.types';

export enum RequestPriority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
}

export interface MaintenanceRequest {
    id: string;
    tenantId: string;
    title: string;
    description: string;
    priority: RequestPriority;
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
}

export enum RequestStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export type CreateMaintenanceRequestInput = Pick<MaintenanceRequest, 'tenantId' | 'title' | 'description' | 'priority'>;

export interface GetMaintenanceRequestsResponse {
    requests: MaintenanceRequest[];
}

export type CreateMaintenanceRequestResponse = Pick<MaintenanceRequest, 'id' | 'priority'> & {
    analyzedFactors: AnalyzeRequestResponse;
};