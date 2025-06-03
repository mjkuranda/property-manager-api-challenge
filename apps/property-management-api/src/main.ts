import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';
import { GlobalExceptionFilter } from './filters';
import { LoggerService } from './modules/logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const loggerService = app.get(LoggerService);
    const configService = app.get<ConfigService<AppConfig>>(ConfigService);
    const port = configService.get('port');

    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1'
    });

    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.listen(port);

    loggerService.info('main/bootstrap', `App running on ${port} port number`);
}

bootstrap();
