import * as SecureStore from "expo-secure-store";

/**
 * Centralized keys to prevent "magic string" bugs.
 */
export enum StorageKeys {
  ACCESS_TOKEN = "auth_access_token",
  REFRESH_TOKEN = "auth_refresh_token",
  USER_DATA = "auth_user_data",
  THEME = "settings_theme",
}

export class StorageHelper {
  /**
   * Saves data to secure hardware storage.
   * Handles strings and objects automatically.
   */
  static async save(key: StorageKeys, value: any): Promise<void> {
    try {
      const valueToStore =
        typeof value === "string" ? value : JSON.stringify(value);
      await SecureStore.setItemAsync(key, valueToStore);
    } catch (error) {
      console.error(`[StorageHelper] Failed to save ${key}:`, error);
    }
  }

  /**
   * Retrieves and automatically parses data.
   * Returns null if key doesn't exist.
   */
  static async get<T>(key: StorageKeys): Promise<T | null> {
    try {
      const result = await SecureStore.getItemAsync(key);
      if (!result) return null;

      // Attempt to parse as JSON if it looks like an object or array
      if (result.startsWith("{") || result.startsWith("[")) {
        return JSON.parse(result) as T;
      }

      return result as unknown as T;
    } catch (error) {
      console.error(`[StorageHelper] Failed to fetch ${key}:`, error);
      return null;
    }
  }

  /**
   * Deletes a specific item.
   */
  static async removeItem(key: StorageKeys): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[StorageHelper] Failed to remove ${key}:`, error);
    }
  }

  /**
   * Clears all auth-related items.
   */
  static async clearAuthSession(): Promise<void> {
    await Promise.all([
      this.removeItem(StorageKeys.ACCESS_TOKEN),
      this.removeItem(StorageKeys.REFRESH_TOKEN),
      this.removeItem(StorageKeys.USER_DATA),
    ]);
  }
}
