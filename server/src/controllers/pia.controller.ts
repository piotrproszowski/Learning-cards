import { Request, Response } from "express";
import { PIARequest, PIAResponse } from "../../src/services/pia.service";
import { CardService } from "../services/card.service";
import { DeckService } from "../services/deck.service";
import { UserService } from "../services/user.service";
import { LLMService } from "../services/llm.service";

export class PIAController {
  private static instance: PIAController;
  private llmService: LLMService;
  private cardService: CardService;
  private deckService: DeckService;
  private userService: UserService;

  private constructor() {
    this.llmService = LLMService.getInstance();
    this.cardService = CardService.getInstance();
    this.deckService = DeckService.getInstance();
    this.userService = UserService.getInstance();
  }

  public static getInstance(): PIAController {
    if (!PIAController.instance) {
      PIAController.instance = new PIAController();
    }
    return PIAController.instance;
  }

  public async handleQuestion(req: Request, res: Response): Promise<void> {
    try {
      const request: PIARequest = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Get user's learning context
      const userProgress = await this.userService.getUserProgress(userId);
      const currentDeck = request.context?.currentDeck
        ? await this.deckService.getDeck(request.context.currentDeck.id)
        : null;
      const currentCard = request.context?.currentCard
        ? await this.cardService.getCard(request.context.currentCard.id)
        : null;

      // Prepare context for LLM
      const context = {
        userProgress,
        currentDeck,
        currentCard,
        prompt: request.prompt,
      };

      // Get response from LLM
      const response = await this.llmService.generateResponse(context);

      // Process response and get related cards
      const relatedCards = await this.getRelatedCards(
        response,
        currentCard?.id,
      );

      const piaResponse: PIAResponse = {
        answer: response.answer,
        suggestions: response.suggestions,
        relatedCards,
        confidence: response.confidence,
      };

      res.json(piaResponse);
    } catch (error) {
      console.error("Error in PIA controller:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const context = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const suggestions = await this.llmService.generateSuggestions(context);
      res.json(suggestions);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async getRelatedCards(
    response: any,
    currentCardId?: string,
  ): Promise<string[]> {
    try {
      if (!response.relatedTopics || !response.relatedTopics.length) {
        return [];
      }

      const relatedCards = await this.cardService.findCardsByTopics(
        response.relatedTopics,
        currentCardId,
      );

      return relatedCards.map((card) => card.id);
    } catch (error) {
      console.error("Error getting related cards:", error);
      return [];
    }
  }
}
