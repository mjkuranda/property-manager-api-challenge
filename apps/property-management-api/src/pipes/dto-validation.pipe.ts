import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { InvalidDtoError } from '../errors';

@Injectable()
export class DtoValidationPipe implements PipeTransform {

    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;

        if (!metatype || !this.toValidate(metatype)) {
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

    private toValidate(metatype: any): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const types = [String, Boolean, Number, Array, Object];

        return !types.includes(metatype);
    }

}
