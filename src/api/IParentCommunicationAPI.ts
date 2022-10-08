export type MessageEventHandler = (event: MessageEvent) => void;
export type CleanUpFunction = () => void;

export interface IParentCommunicationAPI {
  get isEmbedded(): boolean;
  postMessageToParent(message: unknown): void;
  onMessageReceived(event: MessageEventHandler): CleanUpFunction;
}
