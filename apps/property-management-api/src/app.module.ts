import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { loadConfig } from './config';
import { MaintenanceRequestModule } from './modules/maintenance-request/maintenance-request.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [loadConfig]
        }),
        HttpModule,
        MaintenanceRequestModule,
        LoggerModule
    ]
})
export class AppModule {}
