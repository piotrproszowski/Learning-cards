import { BehaviorSubject, Observable } from "rxjs";
import { Card } from "../models/card";
import { Deck } from "../models/deck";
import { User } from "../models/user";

interface AppState {
  user: User | null;
  currentDeck: Deck | null;
  currentCard: Card | null;
  decks: Deck[];
  cards: Card[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  user: null,
  currentDeck: null,
  currentCard: null,
  decks: [],
  cards: [],
  isLoading: false,
  error: null,
};

export class StateManager {
  private static instance: StateManager;
  private state: BehaviorSubject<AppState>;
  private state$: Observable<AppState>;

  private constructor() {
    this.state = new BehaviorSubject<AppState>(initialState);
    this.state$ = this.state.asObservable();
  }

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  public getState(): Observable<AppState> {
    return this.state$;
  }

  public getCurrentState(): AppState {
    return this.state.getValue();
  }

  public setUser(user: User | null): void {
    this.updateState({ user });
  }

  public setCurrentDeck(deck: Deck | null): void {
    this.updateState({ currentDeck: deck });
  }

  public setCurrentCard(card: Card | null): void {
    this.updateState({ currentCard: card });
  }

  public setDecks(decks: Deck[]): void {
    this.updateState({ decks });
  }

  public setCards(cards: Card[]): void {
    this.updateState({ cards });
  }

  public setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  public setError(error: string | null): void {
    this.updateState({ error });
  }

  public resetState(): void {
    this.state.next(initialState);
  }

  private updateState(partialState: Partial<AppState>): void {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      ...partialState,
    });
  }
}
