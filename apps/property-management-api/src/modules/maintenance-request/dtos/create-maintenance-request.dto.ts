import { IsString, IsUUID, IsISO8601, IsNotEmpty, Length } from 'class-validator';

export class CreateMaintenanceRequestDto {
    @IsUUID()
        tenantId: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 256, { message: 'Message char length should be between 3 and 256 chars' })
        message: string;

    @IsISO8601({ strict: true }, { message: 'Timestamp must be a valid ISO 8601 date string' })
        timestamp: string;
}
