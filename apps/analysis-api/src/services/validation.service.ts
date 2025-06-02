import { BodyRequiredError, InvalidJsonError, ValidationDtoError } from '../errors';
import { AnalysisRequestDto } from '../dto/analysis-request.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AnalysisRequest, ValidationErrorDetails } from '../types';

export class ValidationService {

    public async validate(message: string | null): Promise<AnalysisRequestDto> {
        if (!message) {
            throw new BodyRequiredError();
        }

        let requestData: AnalysisRequest;

        try {
            requestData = JSON.parse(message);
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