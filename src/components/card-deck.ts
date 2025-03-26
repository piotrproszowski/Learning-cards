import { Card } from "../models/card";

export class CardDeck extends HTMLElement {
  private _cards: Card[] = [];
  private _currentIndex: number = 0;

  private shadow: ShadowRoot;
}
