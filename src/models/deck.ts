import { Card } from './card';

export interface Deck {
    id: string;
    name: string;
    description: string;
    cards: Card[];
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    isPublic: boolean;
    authorId: string;
}

export interface DeckCreateDTO {
    name: string;
    description: string;
    tags?: string[];
    isPublic?: boolean;
}

export interface DeckUpdateDTO {
    name?: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
}

export interface DeckStats {
    totalCards: number;
    reviewedCards: number;
    averageDifficulty: number;
    lastReviewed?: Date;
} 