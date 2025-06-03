import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AnalysisResponse, AnalyzeRequestMessage, AnalyzeRequestResponse } from './types';
import { ExternalAnalyzerError } from '../../errors';
import { AxiosError } from 'axios';
import { LoggerService } from '../logger/logger.service';
import { ContextString } from '../logger/logger.types';

@Injectable()
export class AnalysisApiService {

    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly loggerService: LoggerService
    ) {
        this.baseUrl = this.configService.get<string>('analysisApi.url') as string;
    }

    async analyze(analyzeRequestMessage: AnalyzeRequestMessage): Promise<AnalysisResponse> {
        const context: ContextString = 'AnalysisApiService/analyze';
        const url = `${this.baseUrl}/analyze`;
        const payload = { message: analyzeRequestMessage };

        try {
            const response = await lastValueFrom(this.httpService.post<AnalyzeRequestResponse>(url, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }));
            const { data: analysis } = response.data;

            this.loggerService.info(context, `Received a new analysis for message: "${analyzeRequestMessage}".`);

            return analysis;
        } catch (error: any) {
            if (error instanceof AxiosError) {
                this.loggerService.error(context, error.message);

                throw new ExternalAnalyzerError(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
            }

            this.loggerService.error(context, error.message);

            throw new ExternalAnalyzerError(`Unexpected error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
