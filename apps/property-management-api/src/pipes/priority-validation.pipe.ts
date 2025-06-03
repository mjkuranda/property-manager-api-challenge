import { PipeTransform, Injectable } from '@nestjs/common';
import { PriorityLevel } from '../modules/maintenance-request/types';
import { InvalidDtoError } from '../errors';

@Injectable()
export class PriorityValidationPipe implements PipeTransform {

    transform(value: string) {
        const lowered: string = value.toLowerCase();
        const values: string[] = Object.values(PriorityLevel);

        if (!values.includes(lowered)) {
            throw new InvalidDtoError('Invalid priority value');
        }

        return lowered;
    }
}
