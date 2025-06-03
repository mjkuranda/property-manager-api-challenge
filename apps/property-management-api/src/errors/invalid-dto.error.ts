import { AbstractError } from './abstract.error';
import { HttpStatus } from '@nestjs/common';

export class InvalidDtoError extends AbstractError {

    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST, 'InvalidDtoError');
    }

}