import { APIGatewayProxyResult } from 'aws-lambda';
import { BodyRequiredError, InvalidJsonError } from './errors';
import { ValidationDtoError } from './errors/validation-dto.error';
import { ErrorResponse, SuccessResponse } from './types';

function createResponse<Body extends object>(code: number, body: Body): APIGatewayProxyResult {
    return {
        statusCode: code,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}

export function createSuccessResponse<Body>(body: Body): APIGatewayProxyResult {
    return createResponse<SuccessResponse<Body>>(200, body);
}

export function createErrorResponse(code: number, message: string): APIGatewayProxyResult {
    return createResponse<ErrorResponse>(code, { error: { code, message }, isSuccess: false });
}

export function handleError(error: unknown): APIGatewayProxyResult {
    if (
        error instanceof BodyRequiredError
        || error instanceof InvalidJsonError
        || error instanceof ValidationDtoError
    ) {
        return error.toResponse();
    }

    return createErrorResponse(500, `Internal server error caused by: ${error.message}`);
}