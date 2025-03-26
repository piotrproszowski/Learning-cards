import { Card, CardCreateDTO, CardUpdateDTO } from '../models/card';
import { Deck, DeckCreateDTO, DeckUpdateDTO } from '../models/deck';
import { User, UserCreateDTO, UserUpdateDTO } from '../models/user';

export class ApiService {
    private static instance: ApiService;
    private baseUrl: string;
    private token: string | null = null;

    private constructor() {
        this.baseUrl = process.env.API_URL || 'http://localhost:3000/api';
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    public setToken(token: string): void {
        this.token = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
            ...options.headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    // Card endpoints
    public async getCards(): Promise<Card[]> {
        return this.request<Card[]>('/cards');
    }

    public async getCard(id: string): Promise<Card> {
        return this.request<Card>(`/cards/${id}`);
    }

    public async createCard(card: CardCreateDTO): Promise<Card> {
        return this.request<Card>('/cards', {
            method: 'POST',
            body: JSON.stringify(card),
        });
    }

    public async updateCard(id: string, card: CardUpdateDTO): Promise<Card> {
        return this.request<Card>(`/cards/${id}`, {
            method: 'PUT',
            body: JSON.stringify(card),
        });
    }

    public async deleteCard(id: string): Promise<void> {
        return this.request<void>(`/cards/${id}`, {
            method: 'DELETE',
        });
    }

    // Deck endpoints
    public async getDecks(): Promise<Deck[]> {
        return this.request<Deck[]>('/decks');
    }

    public async getDeck(id: string): Promise<Deck> {
        return this.request<Deck>(`/decks/${id}`);
    }

    public async createDeck(deck: DeckCreateDTO): Promise<Deck> {
        return this.request<Deck>('/decks', {
            method: 'POST',
            body: JSON.stringify(deck),
        });
    }

    public async updateDeck(id: string, deck: DeckUpdateDTO): Promise<Deck> {
        return this.request<Deck>(`/decks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(deck),
        });
    }

    public async deleteDeck(id: string): Promise<void> {
        return this.request<void>(`/decks/${id}`, {
            method: 'DELETE',
        });
    }

    // User endpoints
    public async login(email: string, password: string): Promise<{ token: string; user: User }> {
        return this.request<{ token: string; user: User }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    public async register(user: UserCreateDTO): Promise<User> {
        return this.request<User>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(user),
        });
    }

    public async updateUser(id: string, user: UserUpdateDTO): Promise<User> {
        return this.request<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
        });
    }
} 