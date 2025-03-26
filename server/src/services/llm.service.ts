import { Configuration, OpenAIApi } from "openai";
import { config } from "../config";

interface LLMContext {
  userProgress: any;
  currentDeck: any;
  currentCard: any;
  prompt: string;
}

interface LLMResponse {
  answer: string;
  suggestions: string[];
  relatedTopics: string[];
  confidence: number;
}

export class LLMService {
  private static instance: LLMService;
  private openai: OpenAIApi;

  private constructor() {
    const configuration = new Configuration({
      apiKey: config.openai.apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  public async generateResponse(context: LLMContext): Promise<LLMResponse> {
    try {
      const prompt = this.buildPrompt(context);
      const completion = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful learning assistant. Your goal is to help users understand their study materials better and provide relevant suggestions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.data.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from LLM");
      }

      return this.parseResponse(response);
    } catch (error) {
      console.error("Error generating LLM response:", error);
      throw error;
    }
  }

  public async generateSuggestions(context: any): Promise<string[]> {
    try {
      const prompt = this.buildSuggestionsPrompt(context);
      const completion = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Generate relevant learning suggestions based on the user's context.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const response = completion.data.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from LLM");
      }

      return this.parseSuggestions(response);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      throw error;
    }
  }

  private buildPrompt(context: LLMContext): string {
    const { userProgress, currentDeck, currentCard, prompt } = context;

    let contextString = "";

    if (currentCard) {
      contextString += `Current card: ${currentCard.front}\n`;
    }

    if (currentDeck) {
      contextString += `Current deck: ${currentDeck.name}\n`;
    }

    if (userProgress) {
      contextString += `User progress: ${JSON.stringify(userProgress)}\n`;
    }

    return `
Context:
${contextString}

User question: ${prompt}

Please provide:
1. A helpful answer to the user's question
2. Related topics that might be helpful
3. Confidence level in your response (0-1)
4. Follow-up suggestions for learning
`;
  }

  private buildSuggestionsPrompt(context: any): string {
    return `
Based on the following context, generate relevant learning suggestions:

${JSON.stringify(context, null, 2)}

Please provide 3-5 specific suggestions that would help the user learn more effectively.
`;
  }

  private parseResponse(response: string): LLMResponse {
    // Simple parsing logic - in production, you might want to use more robust parsing
    const lines = response.split("\n");
    let answer = "";
    let suggestions: string[] = [];
    let relatedTopics: string[] = [];
    let confidence = 0.5; // default

    for (const line of lines) {
      if (line.startsWith("Answer:")) {
        answer = line.replace("Answer:", "").trim();
      } else if (line.startsWith("Related topics:")) {
        relatedTopics = line
          .replace("Related topics:", "")
          .trim()
          .split(",")
          .map((t) => t.trim());
      } else if (line.startsWith("Confidence:")) {
        confidence = parseFloat(line.replace("Confidence:", "").trim());
      } else if (line.startsWith("Suggestions:")) {
        suggestions = line
          .replace("Suggestions:", "")
          .trim()
          .split("\n")
          .map((s) => s.trim());
      }
    }

    return {
      answer,
      suggestions,
      relatedTopics,
      confidence,
    };
  }

  private parseSuggestions(response: string): string[] {
    return response
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("-") && !line.startsWith("*"))
      .slice(0, 5);
  }
}
