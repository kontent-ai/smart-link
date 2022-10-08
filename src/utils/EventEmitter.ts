export interface IEventDescriptor<TPayload = void> {
  readonly payload: TPayload;
}

export type EventMap = {
  readonly [k: string]: IEventDescriptor<any>;
};

export type EventPayload<TEvent extends IEventDescriptor> = TEvent['payload'];
export type EventListener<TEvent extends IEventDescriptor> = (payload: EventPayload<TEvent>) => void;

export interface IEventEmitter<TEvents extends EventMap> {
  readonly addListener: <E extends keyof TEvents>(type: E, listener: EventListener<TEvents[E]>) => void;
  readonly hasListener: (type: keyof TEvents) => boolean;
  readonly emit: <E extends keyof TEvents>(type: E, payload: EventPayload<TEvents[E]>) => void;
  readonly removeListener: <E extends keyof TEvents>(type: E, listener: EventListener<TEvents[E]>) => void;
  readonly removeAllListeners: () => void;
}

export class EventEmitter<TEvents extends EventMap> implements IEventEmitter<TEvents> {
  private listeners = new Map<keyof TEvents, Set<EventListener<TEvents[any]>>>();

  public addListener<E extends keyof TEvents>(type: E, listener: EventListener<TEvents[E]>): void {
    const newListeners = this.listeners.get(type)?.add(listener) ?? new Set([listener]);
    this.listeners.set(type, newListeners);
  }

  public hasListener(type: keyof TEvents): boolean {
    return !!this.listeners.get(type)?.size;
  }

  public removeListener<E extends keyof TEvents>(type: E, listener: EventListener<TEvents[E]>): void {
    this.listeners.get(type)?.delete(listener);
  }

  public emit<E extends keyof TEvents>(type: E, payload: EventPayload<TEvents[E]>): void {
    const listeners = this.listeners.get(type);
    listeners?.forEach((callback: EventListener<TEvents[E]>) => callback(payload));
  }

  public removeAllListeners(): void {
    this.listeners = new Map();
  }
}
