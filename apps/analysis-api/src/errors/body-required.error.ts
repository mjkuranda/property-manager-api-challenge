import { AbstractError } from './abstract.error';

export class BodyRequiredError extends AbstractError {

    constructor() {
        super('Missing message in your request body', 400);
        this.name = 'BodyRequiredError';
    }
}