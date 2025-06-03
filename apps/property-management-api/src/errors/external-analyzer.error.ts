import { AbstractError } from './abstract.error';
import { HttpStatus } from '@nestjs/common';

export class ExternalAnalyzerError extends AbstractError {

    constructor(message: string, code: HttpStatus) {
        super(message, code, 'ExternalAnalyzerError');
    }

}