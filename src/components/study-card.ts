import { Difficulty } from "@/models/card";
import { StateManager } from "@/services/state-manager";

/**
 * Web Component for displaying and interacting with study cards
 * @example
 * <study-card
 *   question="What is the capital of France?"
 *   answer="Paris"
 *   difficulty="MEDIUM"
 *   tags="geography,europe"
 * ></study-card>
 */
export class StudyCard extends HTMLElement {
  public static readonly TAG_NAME = "study-card";

  private question: string = "";
  private answer: string = "";
  private isAnswerVisible: boolean = false;
  private difficulty: Difficulty = Difficulty.MEDIUM;
  private tags: string[] = [];

  private readonly shadow: ShadowRoot;
  private readonly stateManager: StateManager;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.stateManager = StateManager.getInstance();
    this.setupEventListeners();
    this.render();
  }

  connectedCallback(): void {
    this.setupAccessibility();
    this.validateAttributes();
  }

  disconnectedCallback(): void {
    this.cleanupEventListeners();
  }

  static get observedAttributes(): string[] {
    return ["question", "answer", "difficulty", "tags"];
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;

    try {
      switch (name) {
        case "question":
          this.validateQuestion(newValue);
          this.question = newValue || "";
          break;
        case "answer":
          this.validateAnswer(newValue);
          this.answer = newValue || "";
          break;
        case "difficulty":
          this.validateDifficulty(newValue);
          this.difficulty = (newValue as Difficulty) || Difficulty.MEDIUM;
          break;
        case "tags":
          this.validateTags(newValue);
          this.tags = newValue ? JSON.parse(newValue) : [];
          break;
      }
      this.render();
    } catch (error) {
      console.error(`Error updating ${name}:`, error);
      this.dispatchEvent(
        new CustomEvent("error", {
          detail: { message: `Invalid ${name} value` },
        }),
      );
    }
  }

  private setupEventListeners(): void {
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeydown);
  }

  private cleanupEventListeners(): void {
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeydown);
  }

  private setupAccessibility(): void {
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("aria-label", "Study card");
    this.setAttribute("aria-live", "polite");
  }

  private validateAttributes(): void {
    if (!this.question) {
      this.setAttribute("aria-invalid", "true");
      this.setAttribute("aria-errormessage", "question-error");
      throw new Error("Question attribute is required");
    }
    if (!this.answer) {
      this.setAttribute("aria-invalid", "true");
      this.setAttribute("aria-errormessage", "answer-error");
      throw new Error("Answer attribute is required");
    }
  }

  private validateQuestion(value: string | null): void {
    if (!value || value.trim().length === 0) {
      throw new Error("Question cannot be empty");
    }
  }

  private validateAnswer(value: string | null): void {
    if (!value || value.trim().length === 0) {
      throw new Error("Answer cannot be empty");
    }
  }

  private validateDifficulty(value: string | null): void {
    if (value && !Object.values(Difficulty).includes(value as Difficulty)) {
      throw new Error("Invalid difficulty value");
    }
  }

  private validateTags(value: string | null): void {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error("Tags must be an array");
        }
      } catch {
        throw new Error("Invalid tags format");
      }
    }
  }

  private handleClick = (): void => {
    this.toggleAnswer();
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        this.toggleAnswer();
        break;
      case "Escape":
        if (this.isAnswerVisible) {
          this.toggleAnswer();
        }
        break;
    }
  };

  private toggleAnswer(): void {
    this.isAnswerVisible = !this.isAnswerVisible;
    this.setAttribute("aria-expanded", String(this.isAnswerVisible));
    this.render();

    // Announce the state change
    const announcement = this.isAnswerVisible
      ? "Answer shown"
      : "Answer hidden";
    this.setAttribute("aria-label", `Study card: ${announcement}`);

    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { isVisible: this.isAnswerVisible },
      }),
    );
  }

  private render(): void {
    const styles = `
            :host {
                display: block;
                font-family: var(--font-family-base);
                background-color: var(--surface-color);
                border-radius: var(--border-radius-md);
                padding: var(--spacing-md);
                box-shadow: var(--shadow-md);
                cursor: pointer;
                transition: transform var(--transition-normal),
                           box-shadow var(--transition-normal);
                min-height: 150px;
                position: relative;
            }
            
            :host(:hover) {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            
            .card-content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                text-align: center;
            }
            
            .question {
                font-size: var(--font-size-lg);
                font-weight: bold;
                margin-bottom: var(--spacing-md);
                color: var(--text-color);
            }
            
            .answer {
                font-size: var(--font-size-md);
                color: var(--text-secondary-color);
                transform: scaleY(0);
                height: 0;
                overflow: hidden;
                transition: all var(--transition-normal);
            }
            
            .answer.visible {
                transform: scaleY(1);
                height: auto;
                margin-top: var(--spacing-md);
            }
            
            .difficulty-badge {
                position: absolute;
                top: var(--spacing-sm);
                right: var(--spacing-sm);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-full);
                font-size: var(--font-size-sm);
                background-color: var(--primary-color);
                color: var(--contrast-text-color);
            }
            
            .tags {
                display: flex;
                gap: var(--spacing-xs);
                flex-wrap: wrap;
                margin-top: var(--spacing-sm);
            }
            
            .tag {
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--border-radius-sm);
                background-color: var(--secondary-color);
                color: var(--contrast-text-color);
                font-size: var(--font-size-sm);
            }
        `;

    this.shadow.innerHTML = `
            <style>${styles}</style>
            <div class="card-content">
                ${this.difficulty ? `<span class="difficulty-badge" aria-hidden="true">${this.difficulty}</span>` : ""}
                <div class="question" id="question-${this.id}">${this.question}</div>
                <div 
                    class="answer ${this.isAnswerVisible ? "visible" : ""}"
                    id="answer-${this.id}"
                    aria-labelledby="question-${this.id}"
                    aria-hidden="${!this.isAnswerVisible}"
                >${this.answer}</div>
                ${
                  this.tags.length
                    ? `
                    <div class="tags" aria-hidden="true">
                        ${this.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `;
  }
}

customElements.define(StudyCard.TAG_NAME, StudyCard);
