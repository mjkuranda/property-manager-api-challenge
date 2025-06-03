import { KeywordObject } from '../types';

const urgentKeywords: string[] = [
    'burst', 'flood', 'leak', 'water', 'sewage', 'spark', 'fire', 'smoke',
    'gas', 'electric', 'shock', 'exposed wire', 'broken window', 'roof',
    'structural', 'collapse', 'frozen pipe', 'no heat', 'emergency'
];

const otherKeywords: string[] = [
    'broken', 'appliance', 'stuck', 'door', 'noise', 'loud', 'malfunction',
    'not working', 'repair', 'fix', 'maintenance',
    'paint', 'cosmetic', 'aesthetic', 'squeaky', 'hinge', 'minor',
    'replace', 'lightbulb', 'clean', 'routine'
];

export const keywordObjects: KeywordObject[] = [
    ...urgentKeywords.map(keyword => ({ keyword, isUrgent: true })),
    ...otherKeywords.map(keyword => ({ keyword }))
];