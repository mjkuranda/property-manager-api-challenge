export interface AppConfig {
    port: number;
    analysisApi?: {
        url: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
    };
    dynamodbEndpoint: string;
    maintenance: {
        priorityThreshold: {
            high: number;
            medium: number;
        };
    };
}

export function loadConfig(): AppConfig {
    return {
        port: Number(process.env.PORT) || 4000,
        analysisApi: {
            url: process.env.ANALYSIS_API_URL || 'http://localhost:4001/'
        },
        aws: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
            region: process.env.AWS_REGION || 'us-east-1'
        },
        dynamodbEndpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
        maintenance:{
            priorityThreshold :{
                high: process.env.MAINTENANCE_HIGH_PRIORITY_THRESHOLD || 0.8,
                medium: process.env.MAINTENANCE_MEDIUM_PRIORITY_THRESHOLD || 0.5
            }
        }
    };
}