import { APIGatewayProxyResult } from 'aws-lambda';
import { BodyRequiredError, InvalidJsonError, ValidationDtoError } from './errors';
import { ErrorResponse, SuccessResponse } from './types';

function createResponse<Body extends { isSuccess: boolean }>(code: number, body: Body): APIGatewayProxyResult {
    return {
        statusCode: code,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}

export function createSuccessResponse<Body extends object>(body: Body): APIGatewayProxyResult {
    return createResponse<SuccessResponse<Body>>(200, { data: body, isSuccess: true });
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

    const message = error instanceof Error ? error.message : String(error);

    return createErrorResponse(500, `Internal server error caused by: ${message}`);
}