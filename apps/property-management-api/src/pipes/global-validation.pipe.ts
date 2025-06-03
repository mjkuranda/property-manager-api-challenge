import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { InvalidDtoError } from '../errors';

@Injectable()
export class GlobalValidationPipe implements PipeTransform {

    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;

        if (!metatype) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true
        });

        if (errors.length > 0) {
            const messages = errors
                .map((err) => Object.values(err.constraints || {}).join(', '))
                .join('; ');

            throw new InvalidDtoError(messages);
        }

        return object;
    }

}
