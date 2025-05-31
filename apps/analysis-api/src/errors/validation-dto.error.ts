import { AbstractError } from './abstract.error';
import { ValidationErrorDetails } from '../types';

export class ValidationDtoError extends AbstractError {

    constructor(details: ValidationErrorDetails[]) {
        super(
            `DTO validation failed. Error caused by: ${details
                .map(detail => `Property ${detail.property} ${JSON.stringify(detail.constraints)}`)
                .join(', ')
            }`, 400);
        this.name = 'ValidationDtoError';
    }

}