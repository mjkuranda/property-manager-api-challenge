import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { AbstractError } from '../errors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const timestamp = new Date().toISOString();
        const path = ctx.getRequest().url;

        if (exception instanceof AbstractError) {
            const { statusCode, message, name } = exception;

            response
                .status(statusCode)
                .json({
                    statusCode,
                    timestamp,
                    path,
                    error: name,
                    message
                });
        }

        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(statusCode).json({
            statusCode,
            timestamp,
            path,
            error: 'UnknownError',
            message: 'Internal server error',
        });
    }

}