export interface IStorage<T> {
  readonly get: () => T | null;
  readonly set: (data: T) => void;
  readonly remove: () => void;
}

export function createStorage<T extends Record<string, any>>(key: string): IStorage<T> {
  return {
    get(): T | null {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },
    set(data: T): void {
      const json = JSON.stringify(data);
      window.localStorage.setItem(key, json);
    },
    remove(): void {
      window.localStorage.removeItem(key);
    },
  };
}
