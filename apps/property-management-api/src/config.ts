export interface AppConfig {
    port: number;
    analysisApi?: {
        url: string;
    };
}

export function loadConfig(): AppConfig {
    return {
        port: Number(process.env.PORT) || 4000,
        analysisApi: {
            url: process.env.ANALYSIS_API_URL || 'http://localhost:4001/'
        }
    };
}