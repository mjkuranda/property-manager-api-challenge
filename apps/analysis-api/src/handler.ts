import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AnalysisService } from './services/analysis.service';
import { RequestError, ValidationError, ServerError } from './errors';
import { ValidationService } from './services/validation.service';

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

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: analysis
            })
        };
    } catch (error) {
        console.error('Error processing request:', error);

        if (error instanceof ValidationError ||
            error instanceof RequestError ||
            error instanceof ServerError) {
            return error.toResponse();
        }

        return ServerError.fromError(error).toResponse();
    }
};
