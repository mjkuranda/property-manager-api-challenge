import { HttpStatus } from '@nestjs/common';

export abstract class AbstractError extends Error {

    protected constructor(message: string, private readonly code: HttpStatus, name: string) {
        super(message);
        this.name = name;
    }

    get statusCode(): HttpStatus {
        return this.code;
    }

}