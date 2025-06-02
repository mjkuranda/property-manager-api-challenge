import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config';
import { DynamoDB } from 'aws-sdk';

@Injectable()
export class DynamodbService {

    private readonly dynamodb: DynamoDB.DocumentClient;

    constructor(private readonly configService: ConfigService<AppConfig>) {
        const awsConfig = this.configService.get<AppConfig['aws']>('aws') as AppConfig['aws'];
        const endpoint = this.configService.get('dynamodbEndpoint') as string;
        const { region, accessKeyId, secretAccessKey } = awsConfig;

        this.dynamodb = new DynamoDB.DocumentClient({
            region,
            endpoint,
            accessKeyId,
            secretAccessKey,
        });
    }

    getClient(): DynamoDB.DocumentClient {
        return this.dynamodb;
    }

}
