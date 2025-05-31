import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AnalysisRequestDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5, {
        message: 'Message must be at least 5 characters long'
    })
    @MaxLength(1000, {
        message: 'Message cannot be longer than 1000 characters'
    })
    @Transform(({ value }) => value.trim())
        message!: string;
}