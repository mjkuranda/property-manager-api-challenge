import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { loadConfig } from './config';
// TODO: import { RequestsModule } from './requests/requests.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [loadConfig],
        }),
        HttpModule,
        // TODO: RequestsModule
    ]
})
export class AppModule {}
