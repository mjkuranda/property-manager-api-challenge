import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnalysisApiService } from './analysis-api.service';

@Module({
    imports: [HttpModule],
    providers: [AnalysisApiService],
    exports: [AnalysisApiService]
})
export class AnalysisApiModule {}
