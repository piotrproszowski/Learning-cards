import { Observable, from } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ApiService } from "./api.service";

export interface PIARequest {
  prompt: string;
  context?: {
    currentCard?: any;
    currentDeck?: any;
    userProgress?: any;
  };
}

export interface PIAResponse {
  answer: string;
  suggestions?: string[];
  relatedCards?: string[];
  confidence: number;
}

export class PIAService {
  private static instance: PIAService;
  private readonly API_ENDPOINT = "/api/pia";

  private constructor(private apiService: ApiService) {}

  public static getInstance(): PIAService {
    if (!PIAService.instance) {
      PIAService.instance = new PIAService(ApiService.getInstance());
    }
    return PIAService.instance;
  }

  public askQuestion(request: PIARequest): Observable<PIAResponse> {
    return from(
      this.apiService.post<PIAResponse>(this.API_ENDPOINT, request),
    ).pipe(
      map((response) => response),
      catchError((error) => {
        console.error("Error in PIA service:", error);
        throw new Error("Failed to get response from PIA");
      }),
    );
  }

  public getSuggestions(context: PIARequest["context"]): Observable<string[]> {
    return from(
      this.apiService.post<string[]>(`${this.API_ENDPOINT}/suggestions`, {
        context,
      }),
    ).pipe(
      map((response) => response),
      catchError((error) => {
        console.error("Error getting suggestions:", error);
        throw new Error("Failed to get suggestions from PIA");
      }),
    );
  }

  public getRelatedCards(cardId: string): Observable<string[]> {
    return from(
      this.apiService.get<string[]>(
        `${this.API_ENDPOINT}/related-cards/${cardId}`,
      ),
    ).pipe(
      map((response) => response),
      catchError((error) => {
        console.error("Error getting related cards:", error);
        throw new Error("Failed to get related cards from PIA");
      }),
    );
  }
}
