import { AbstractError } from './abstract.error';
import { HttpStatus } from '@nestjs/common';

export class MaintenanceRequestCreationError extends AbstractError {

    constructor(cause: string) {
        super(`Error occurred while creating a new maintenance request: ${cause}`, HttpStatus.BAD_REQUEST, 'MaintenanceRequestCreationError');
    }

}