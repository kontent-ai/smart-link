export type AsyncCustomEventDetail<TEventData, TResolveData, TRejectReason> = {
  readonly eventData: TEventData;
  readonly onResolve: (data: TResolveData) => void;
  readonly onReject: (reason: TRejectReason) => void;
};

export type AsyncCustomEvent<TEventData, TResolveData, TRejectReason> = CustomEvent<
  AsyncCustomEventDetail<TEventData, TResolveData, TRejectReason>
>;

export type Callback<TData = undefined, TMetadata = undefined> = (data?: TData, metadata?: TMetadata) => void;

export type EventHandler<TEventData = undefined, TEventMetadata = undefined, TEventCallback = undefined> = (
  data: TEventData,
  metadata: TEventMetadata,
  callback: TEventCallback
) => void;

type EventMap = Record<string, (...args: any[]) => void>;

export type EventListeners<Events extends EventMap> = Map<keyof Events, Set<Events[any]>>;

/**
 * Adds an event listener for a given event. This function is not pure as it modifies the provided eventListeners map.
 */
export const addListener = <Events extends EventMap, E extends keyof Events>(
  eventListeners: EventListeners<Events>,
  event: E,
  listener: Events[E]
): void => {
  const newListeners = eventListeners.get(event)?.add(listener) ?? new Set([listener]);
  eventListeners.set(event, newListeners);
};

/**
 * Removes an event listener for a given event. This function is not pure as it modifies the provided eventListeners map.
 */
export const removeListener = <Events extends EventMap, E extends keyof Events>(
  eventListeners: EventListeners<Events>,
  event: E,
  listener: Events[E]
): void => {
  eventListeners.get(event)?.delete(listener);
};

/**
 * Emits an event, calling all registered listeners for that event with the provided arguments.
 * This function is not pure, though it only reads from the eventListeners map, its core purpose is to trigger side effects (the listeners).
 */
export const emitEvents = <Events extends EventMap, E extends keyof Events>(
  eventListeners: EventListeners<Events>,
  event: E,
  ...args: Parameters<Events[E]>
): void => {
  const actualEventListeners = eventListeners.get(event);
  if (actualEventListeners && actualEventListeners.size > 0) {
    actualEventListeners.forEach((callback: Events[E]) => {
      callback(...args);
    });
  }
};
