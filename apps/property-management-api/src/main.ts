import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';
import { GlobalExceptionFilter } from './filters';
import { GlobalValidationPipe } from './pipes';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get<ConfigService<AppConfig>>(ConfigService);
    const port = configService.get('port');

    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1'
    });

    app.useGlobalPipes(new GlobalValidationPipe());
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.listen(port);

    console.log(`App running on ${port} port number`);
}

bootstrap();
