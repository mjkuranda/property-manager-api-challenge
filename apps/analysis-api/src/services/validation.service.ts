import { BodyRequiredError, InvalidJsonError } from '../errors';
import { AnalysisRequestDto } from '../dto/analysis-request.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationErrorDetails } from '../types';
import { ValidationDtoError } from '../errors/validation-dto.error';

export class ValidationService {

    public async validate(analysisRequestDto: string) {
        if (!analysisRequestDto) {
            throw new BodyRequiredError();
        }

        let requestData;

        try {
            requestData = JSON.parse(analysisRequestDto);
        } catch (error) {
            throw new InvalidJsonError();
        }

        const instance = plainToInstance(AnalysisRequestDto, requestData);
        const errors = await validate(instance);

        if (errors.length > 0) {
            const details: ValidationErrorDetails[] = errors.map(error => ({
                property: error.property,
                constraints: error.constraints || {}
            }));

            throw new ValidationDtoError(details);
        }

        return instance;
    }

}