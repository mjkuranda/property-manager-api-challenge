import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnalysisApiService } from './analysis-api.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [HttpModule, LoggerModule],
    providers: [AnalysisApiService],
    exports: [AnalysisApiService]
})
export class AnalysisApiModule {}
