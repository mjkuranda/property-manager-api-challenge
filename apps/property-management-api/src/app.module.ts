import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from './config';
// TODO: import { RequestsModule } from './requests/requests.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [loadConfig],
        }),
        // TODO: RequestsModule
    ],
})
export class AppModule {}
