import { InvalidEnvironmentError } from '../utils/errors';
import { CleanUpFunction, IParentCommunicationAPI, MessageEventHandler } from './IParentCommunicationAPI';

export class ParentWindowCommunicationAPI implements IParentCommunicationAPI {
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
      throw InvalidEnvironmentError('ParentWindowCommunicationAPI.postMessageToParent can only be called inside an iframe.');
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
