export interface Card {
    id: string;
    front: string;
    back: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    lastReviewed?: Date;
    difficulty: Difficulty;
    reviewCount: number;
}

export enum Difficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD'
}

export interface CardCreateDTO {
    front: string;
    back: string;
    tags?: string[];
}

export interface CardUpdateDTO {
    front?: string;
    back?: string;
    tags?: string[];
    difficulty?: Difficulty;
} 