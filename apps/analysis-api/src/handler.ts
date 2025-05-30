import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const highPriorityKeywords = ['leak', 'flood', 'burst', 'sewage', 'sparking', 'power outage', 'exposed wires', 'broken window', 'roof leak', 'gas leak', 'smoke detector', 'no heat', 'frozen pipes'];
const mediumPriorityKeywords = ['broken appliance', 'stuck door', 'noisy equipment'];
const lowPriorityKeywords = ['cosmetic repair', 'paint touch-up', 'squeaky hinge'];

interface AnalysisResult {
    keywords: string[];
    urgencyIndicators: number;
    priorityScore: number;
    priority: 'high' | 'medium' | 'low';
}

function analyzeMessage(message: string): AnalysisResult {
    const lowerMsg = message.toLowerCase();
    let urgencyIndicators = 0;
    const detectedKeywords: string[] = [];

    for (const keyword of highPriorityKeywords) {
        if (lowerMsg.includes(keyword)) {
            urgencyIndicators += 3;
            detectedKeywords.push(keyword);
        }
    }
    for (const keyword of mediumPriorityKeywords) {
        if (lowerMsg.includes(keyword)) {
            urgencyIndicators += 2;
            detectedKeywords.push(keyword);
        }
    }
    for (const keyword of lowPriorityKeywords) {
        if (lowerMsg.includes(keyword)) {
            urgencyIndicators += 1;
            detectedKeywords.push(keyword);
        }
    }

    // Simple priority score between 0 and 1
    const priorityScore = Math.min(urgencyIndicators / 10, 1);

    let priority: AnalysisResult['priority'] = 'low';
    if (priorityScore >= 0.7) priority = 'high';
    else if (priorityScore >= 0.3) priority = 'medium';

    return {
        keywords: detectedKeywords,
        urgencyIndicators,
        priorityScore,
        priority,
    };
}

export const analyzeHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing request body' }),
        };
    }

    const { message } = JSON.parse(event.body);

    if (!message || typeof message !== 'string') {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid or missing message' }),
        };
    }

    const analysis = analyzeMessage(message);

    return {
        statusCode: 200,
        body: JSON.stringify(analysis),
        headers: {
            'Content-Type': 'application/json',
        },
    };
};
