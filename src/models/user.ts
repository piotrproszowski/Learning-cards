import { Deck } from './deck';

export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    decks: Deck[];
    preferences: UserPreferences;
}

export interface UserPreferences {
    theme: Theme;
    language: Language;
    dailyGoal: number;
    notifications: NotificationSettings;
}

export enum Theme {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
    SYSTEM = 'SYSTEM'
}

export enum Language {
    ENGLISH = 'ENGLISH',
    POLISH = 'POLISH'
}

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
    reminderTime?: string;
}

export interface UserCreateDTO {
    email: string;
    username: string;
    password: string;
}

export interface UserUpdateDTO {
    email?: string;
    username?: string;
    preferences?: Partial<UserPreferences>;
} 