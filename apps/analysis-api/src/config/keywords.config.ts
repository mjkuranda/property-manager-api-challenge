import { KeywordCategory } from '../types';

export const keywordCategories: KeywordCategory[] = [
    {
        keywords: [
            'burst', 'flood', 'leak', 'water', 'sewage', 'spark', 'fire', 'smoke',
            'gas', 'electric', 'shock', 'exposed wire', 'broken window', 'roof',
            'structural', 'collapse', 'frozen pipe', 'no heat', 'emergency'
        ],
        score: 1.0
    },
    {
        keywords: [
            'broken', 'appliance', 'stuck', 'door', 'noise', 'loud', 'malfunction',
            'not working', 'repair', 'fix', 'maintenance'
        ],
        score: 0.6
    },
    {
        keywords: [
            'paint', 'cosmetic', 'aesthetic', 'squeaky', 'hinge', 'minor',
            'replace', 'lightbulb', 'clean', 'routine'
        ],
        score: 0.3
    }
];