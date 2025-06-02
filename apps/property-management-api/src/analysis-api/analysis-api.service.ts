import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AnalyzeRequestMessage, AnalyzeRequestResponse } from './analysis-api.types';

@Injectable()
export class AnalysisApiService {

    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get<string>('analysisApi.url');
    }

    async analyze(analyzeRequestDto: AnalyzeRequestMessage): Promise<AnalyzeRequestResponse> {
        const url = `${this.baseUrl}/analyze`;
        const response = await lastValueFrom(this.httpService.post(url, analyzeRequestDto));

        return response.data;
    }

}
