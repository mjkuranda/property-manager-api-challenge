import { APIGatewayProxyResult } from 'aws-lambda';

export abstract class AbstractError extends Error {

    protected constructor(
        message: string,
        private readonly code: number = 500
    ) {
        super(message);
    }

    toResponse(): APIGatewayProxyResult {
        return {
            statusCode: this.code,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: this.code,
                message: this.message
            })
        };
    }
}