export interface EventMap {
  readonly [k: string]: (...args: any[]) => void;
}

export interface IEventEmitter<TEvents extends EventMap> {
  readonly addListener: <E extends keyof TEvents>(eventType: E, listener: TEvents[E]) => void;
  readonly hasListener: (eventType: keyof TEvents) => boolean;
  readonly emit: <E extends keyof TEvents>(eventType: E, ...args: Parameters<TEvents[E]>) => void;
  readonly removeListener: <E extends keyof TEvents>(eventType: E, listener: TEvents[E]) => void;
  readonly removeAllListeners: () => void;
}

export class EventEmitter<TEvents extends EventMap> implements IEventEmitter<TEvents> {
  private listeners = new Map<keyof TEvents, Set<TEvents[any]>>();

  public addListener = <E extends keyof TEvents>(eventType: E, listener: TEvents[E]): void => {
    const newListeners = this.listeners.get(eventType)?.add(listener) ?? new Set([listener]);
    this.listeners.set(eventType, newListeners);
  };

  public hasListener = (eventType: keyof TEvents): boolean => this.listeners.has(eventType);

  public removeListener = <E extends keyof TEvents>(eventType: E, listener: TEvents[E]): void => {
    this.listeners.get(eventType)?.delete(listener);
  };

  public emit = <E extends keyof TEvents>(eventType: E, ...args: Parameters<TEvents[E]>): void => {
    const listeners = this.listeners.get(eventType);
    listeners?.forEach((callback: TEvents[E]) => callback(...args));
  };

  public removeAllListeners = (): void => {
    this.listeners = new Map();
  };
}
