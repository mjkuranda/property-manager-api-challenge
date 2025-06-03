import { AbstractError } from './abstract.error';
import { HttpStatus } from '@nestjs/common';

export class DatabaseError extends AbstractError {

    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'DatabaseError');
    }

}