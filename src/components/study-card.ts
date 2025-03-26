export class StudyCard extends HTMLElement {
  private _question: string = "";
  private _answer: string = "";
  private _showAnswer: boolean = false;

  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this.addEventListener("click", this.toggleAnswer);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.toggleAnswer);
  }

  static get observedAttributes() {
    return ["question", "answer"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case "question":
        this._question = newValue;
        break;
      case "answer":
        this._answer = newValue;
        break;
    }

    this.render();
  }

  get question() {
    return this._question;
  }

  set question(value: string) {
    this.setAttribute("question", value);
  }

  get answer() {
    return this._answer;
  }

  set answer(value: string) {
    this.setAttribute("answer", value);
  }

  toggleAnswer = () => {
    this._showAnswer = !this._showAnswer;
    this.render();
  };

  render() {
    const styles = `
      :host {
        display: block;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.3s ease;
        min-height: 150px;
        position: relative;
      }
        
      :host(:hover) {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 16px;
      }
      
      .answer {
        font-size: 1.1rem;
        color: #4a4a4a;
        transform: scaleY(0);
        height: 0;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .answer.visible {
        transform: scaleY(1);
        height: auto;
        margin-top: 16px;
      }
      
      .hint {
        position: absolute;
        bottom: 8px;
        right: 8px;
        font-size: 0.8rem;
        color: #999;
      }
    `;

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="card-content">
        <div class="question">${this._question}</div>
        <div class="answer ${this._showAnswer ? "visible" : ""}">${this._answer}</div>
        <div class="hint">${this._showAnswer ? "Show Answer" : "Show Hint"}</div>
      </div>
    `;
  }
}

customElements.define("study-card", StudyCard);
