export class StorageService {
  private static instance: StorageService;
  private readonly prefix: string = "learning_cards_";

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }

  public clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  public hasItem(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}
