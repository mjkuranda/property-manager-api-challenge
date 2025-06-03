import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AnalysisResponse, AnalyzeRequestMessage, AnalyzeRequestResponse } from './types';
import { ExternalAnalyzerError } from '../../errors';
import { AxiosError } from 'axios';

@Injectable()
export class AnalysisApiService {

    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get<string>('analysisApi.url') as string;
    }

    async analyze(analyzeRequestMessage: AnalyzeRequestMessage): Promise<AnalysisResponse> {
        const url = `${this.baseUrl}/analyze`;
        const payload = { message: analyzeRequestMessage };

        try {
            const response = await lastValueFrom(this.httpService.post<AnalyzeRequestResponse>(url, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }));
            const { data: analysis } = response.data;

            return analysis;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new ExternalAnalyzerError(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
            }

            throw new ExternalAnalyzerError(`Unexpected error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
