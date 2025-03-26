export class Validators {
  public static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static isPasswordStrong(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  public static isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  public static isMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  public static isMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  public static isNumber(value: string): boolean {
    return !isNaN(Number(value));
  }

  public static isPositiveNumber(value: number): boolean {
    return value > 0;
  }

  public static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  public static isURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public static isDate(date: string): boolean {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  }

  public static isFutureDate(date: string): boolean {
    return this.isDate(date) && new Date(date) > new Date();
  }

  public static isPastDate(date: string): boolean {
    return this.isDate(date) && new Date(date) < new Date();
  }

  public static isPhoneNumber(phone: string): boolean {
    // Basic international phone number format
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  public static isUsername(username: string): boolean {
    // Alphanumeric with underscores, 3-20 characters
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  public static isHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }

  public static isJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  public static isUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
