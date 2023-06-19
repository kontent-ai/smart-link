import { InvalidEnvironmentError } from '../utils/errors';

export type MessageEventHandler = (event: MessageEvent) => void;
export type CleanUpFunction = () => void;

export interface IParentWindowCommunicationAPI {
  get isEmbedded(): boolean;
  postMessageToParent(message: unknown): void;
  onMessageReceived(handler: MessageEventHandler): CleanUpFunction;
}

export class ParentWindowCommunicationAPI implements IParentWindowCommunicationAPI {
  public get isEmbedded(): boolean {
    return this.window.self !== this.window.top;
  }

  constructor(private readonly window: Window) {
    if (typeof window === 'undefined') {
      throw InvalidEnvironmentError('ParentWindowCommunicationAPI can only be initialized in a browser environment.');
    }
  }

  public postMessageToParent(message: unknown): void {
    if (!this.isEmbedded) {
      throw InvalidEnvironmentError(
        'ParentWindowCommunicationAPI.postMessageToParent cant only be called inside an iframe.'
      );
    }

    this.window.parent.postMessage(message, '*');
  }

  public onMessageReceived(handler: MessageEventHandler): CleanUpFunction {
    this.window.addEventListener('message', handler, true);

    return () => {
      this.window.removeEventListener('message', handler, true);
    };
  }
}
