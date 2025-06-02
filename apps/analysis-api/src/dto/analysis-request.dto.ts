import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AnalysisRequestDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {
        message: 'Message must be at least 3 characters long'
    })
    @MaxLength(256, {
        message: 'Message cannot be longer than 256 characters'
    })
    @Transform(({ value }) => value.trim())
        message!: string;
}