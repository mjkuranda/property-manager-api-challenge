import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { loadConfig } from './config';
import { MaintenanceRequestModule } from './maintenance-request/maintenance-request.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [loadConfig]
        }),
        HttpModule,
        MaintenanceRequestModule,
    ]
})
export class AppModule {}
