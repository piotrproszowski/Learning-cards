import {
  LitElement,
  html,
  css,
  customElement,
  property,
  state,
} from "lit-element";
import { PIAService, PIARequest, PIAResponse } from "../services/pia.service";

@customElement("pia-assistant")
export class PIAAssistant extends LitElement {
  @property({ type: Object }) currentCard: any = null;
  @property({ type: Object }) currentDeck: any = null;
  @property({ type: Object }) userProgress: any = null;

  @state() private messages: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];
  @state() private isLoading = false;
  @state() private inputValue = "";
  @state() private suggestions: string[] = [];

  private piaService = PIAService.getInstance();

  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }

    .chat-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      height: 400px;
      display: flex;
      flex-direction: column;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .message {
      margin-bottom: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      max-width: 80%;
    }

    .user-message {
      background-color: #e3f2fd;
      margin-left: auto;
    }

    .assistant-message {
      background-color: #f5f5f5;
    }

    .input-container {
      display: flex;
      padding: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-right: 0.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background-color: #bdbdbd;
      cursor: not-allowed;
    }

    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .suggestion {
      background-color: #e3f2fd;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .suggestion:hover {
      background-color: #bbdefb;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .loading::after {
      content: "";
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #2196f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  private async handleSubmit() {
    if (!this.inputValue.trim() || this.isLoading) return;

    const userMessage = this.inputValue.trim();
    this.messages = [...this.messages, { role: "user", content: userMessage }];
    this.inputValue = "";
    this.isLoading = true;

    try {
      const request: PIARequest = {
        prompt: userMessage,
        context: {
          currentCard: this.currentCard,
          currentDeck: this.currentDeck,
          userProgress: this.userProgress,
        },
      };

      const response = await this.piaService.askQuestion(request).toPromise();

      if (response) {
        this.messages = [
          ...this.messages,
          {
            role: "assistant",
            content: response.answer,
          },
        ];

        if (response.suggestions) {
          this.suggestions = response.suggestions;
        }
      }
    } catch (error) {
      console.error("Error getting PIA response:", error);
      this.messages = [
        ...this.messages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ];
    } finally {
      this.isLoading = false;
    }
  }

  private handleSuggestionClick(suggestion: string) {
    this.inputValue = suggestion;
    this.suggestions = [];
    this.handleSubmit();
  }

  render() {
    return html`
      <div class="chat-container">
        <div class="messages">
          ${this.messages.map(
            (msg) => html`
              <div class="message ${msg.role}-message">${msg.content}</div>
            `,
          )}
          ${this.isLoading ? html` <div class="loading"></div> ` : ""}
        </div>
        ${this.suggestions.length > 0
          ? html`
              <div class="suggestions">
                ${this.suggestions.map(
                  (suggestion) => html`
                    <div
                      class="suggestion"
                      @click=${() => this.handleSuggestionClick(suggestion)}
                    >
                      ${suggestion}
                    </div>
                  `,
                )}
              </div>
            `
          : ""}
        <div class="input-container">
          <input
            type="text"
            .value=${this.inputValue}
            @input=${(e: Event) =>
              (this.inputValue = (e.target as HTMLInputElement).value)}
            @keyup=${(e: KeyboardEvent) =>
              e.key === "Enter" && this.handleSubmit()}
            placeholder="Ask me anything about your learning..."
            ?disabled=${this.isLoading}
          />
          <button
            @click=${this.handleSubmit}
            ?disabled=${this.isLoading || !this.inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    `;
  }
}
