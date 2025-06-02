export type AnalyzeRequestMessage = string;

export interface AnalyzeRequestResponse {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
}