import { AbstractError } from './abstract.error';

export class InvalidJsonError extends AbstractError {

    constructor() {
        super('Invalid JSON string to parse', 400);
        this.name = 'InvalidJsonError';
    }

}