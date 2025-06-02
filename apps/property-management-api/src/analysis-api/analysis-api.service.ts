import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AnalysisResponse, AnalyzeRequestMessage, AnalyzeRequestResponse } from './types';

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
        const response = await lastValueFrom(this.httpService.post<AnalyzeRequestResponse>(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        }));
        const { data: analysis } = response.data;

        return analysis;
    }

}
