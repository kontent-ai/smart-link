import { afterEach } from "vitest";

type EventListenerData = [
  string,
  EventListenerOrEventListenerObject,
  AddEventListenerOptions | boolean | undefined,
];

interface ITestEventManager {
  readonly addEventListenerForCurrentTest: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ) => void;
}

export function createTestEventManager(target: EventTarget): ITestEventManager {
  const eventListenersData: Set<EventListenerData> = new Set<EventListenerData>();

  afterEach(() => {
    // remove all event listeners after each test
    eventListenersData.forEach(([type, listener, options]) => {
      target.removeEventListener(type, listener, options);
    });
    eventListenersData.clear();
  });

  return {
    addEventListenerForCurrentTest: (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: AddEventListenerOptions | boolean,
    ): void => {
      target.addEventListener(type, listener, options);
      eventListenersData.add([type, listener, options]);
    },
  };
}
