import { logWarn } from "../lib/Logger";

const LocalStorageNotAvailable =
  "Local storage is not available or access to local storage is denied for the current document. It may affect the proper work of the SDK.";

export interface IStorage<T> {
  readonly get: () => T | null;
  readonly set: (data: T) => void;
  readonly remove: () => void;
}

export function createStorage<T extends Record<string, unknown>>(key: string): IStorage<T> {
  return {
    get(): T | null {
      try {
        const value = window.localStorage.getItem(key);
        return value !== null ? (JSON.parse(value) as T) : null;
      } catch {
        logWarn(LocalStorageNotAvailable);
        return null;
      }
    },
    set(data: T): void {
      try {
        const json = JSON.stringify(data);
        window.localStorage.setItem(key, json);
      } catch {
        logWarn(LocalStorageNotAvailable);
      }
    },
    remove(): void {
      try {
        window.localStorage.removeItem(key);
      } catch {
        logWarn(LocalStorageNotAvailable);
      }
    },
  };
}
