import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AnalysisService } from './services/analysis.service';
import { ValidationService } from './services/validation.service';
import { createSuccessResponse, handleError } from './utils';
import { AnalysisResponse } from './types';

const analysisService = new AnalysisService();
const validationService = new ValidationService();

/**
 * AWS Lambda function handler for the /analyze endpoint
 * This function is triggered by HTTP POST requests to /analyze
 * It validates the request body and performs maintenance request analysis
 *
 * @param event - The API Gateway event containing the request data
 * @returns A promise resolving to an API Gateway response
 */
export const analyze = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const validatedData = await validationService.validate(event.body);
        const analysis = analysisService.analyze(validatedData);

        return createSuccessResponse<AnalysisResponse>(analysis);
    } catch (error: unknown) {
        return handleError(error);
    }
};
