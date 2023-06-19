export type EventDescriptor<TPayload = void> = {
  readonly payload: TPayload;
};

export type EventMap = {
  readonly [k: string]: EventDescriptor<any>;
};

export type EventPayload<T extends EventDescriptor> = T['payload'];
export type EventListener<T extends EventDescriptor> = (payload: EventPayload<T>) => void;

export interface IEventEmitter<T extends EventMap> {
  addListener<E extends keyof T>(type: E, listener: EventListener<T[E]>): void;
  emit<E extends keyof T>(type: E, payload: EventPayload<T[E]>): void;
  hasListener(type: keyof T): boolean;
  removeAllListeners(): void;
  removeListener<E extends keyof T>(type: E, listener: EventListener<T[E]>): void;
}

export class EventEmitter<T extends EventMap> implements IEventEmitter<T> {
  private listeners = new Map<keyof T, Set<EventListener<T[any]>>>();

  public addListener<E extends keyof T>(type: E, listener: EventListener<T[E]>): void {
    const newListeners = this.listeners.get(type)?.add(listener) ?? new Set([listener]);
    this.listeners.set(type, newListeners);
  }

  public emit<E extends keyof T>(type: E, payload: EventPayload<T[E]>): void {
    const listeners = this.listeners.get(type);
    listeners?.forEach((callback) => callback(payload));
  }

  public hasListener(type: keyof T): boolean {
    return !!this.listeners.get(type)?.size;
  }

  public removeAllListeners(): void {
    this.listeners.clear();
  }

  public removeListener<E extends keyof T>(type: E, listener: EventListener<T[E]>): void {
    this.listeners.get(type)?.delete(listener);
  }
}
