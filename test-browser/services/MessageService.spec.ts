import { MessageService } from '../../src/services/MessageService';
import { IParentWindowCommunicationAPI } from '../../src/helpers/ParentWindowCommunicationAPI';
import { ClientMessageType, ISdkInitializedClientMessage } from '../../src/models/clientMessages';
import { createUuid } from '../../src/utils/createUuid';
import { HostMessageType, ISdkStatusHostMessage } from '../../src/models/hostMessages';
import { InvalidEnvironmentError } from '../../src/utils/errors';

describe('MessageService', () => {
  let messageService: MessageService;
  let parentCommunicationAPI: jasmine.SpyObj<IParentWindowCommunicationAPI>;

  beforeEach(() => {
    parentCommunicationAPI = jasmine.createSpyObj('ParentWindowCommunicationAPI', [
      'isEmbedded',
      'postMessageToParent',
      'onMessageReceived',
    ]);

    messageService = new MessageService(parentCommunicationAPI);
  });

  describe('sendMessage', () => {
    it('should send message to parent window', () => {
      const message = createTestClientMessage();
      messageService.sendMessage(message);

      expect(parentCommunicationAPI.postMessageToParent).toHaveBeenCalledWith(message);
    });
  });

  describe('sendMessageWithResponse', () => {
    it('should return promise and resolve it when response is received', async () => {
      const message = createTestClientMessage();
      const response = { type: HostMessageType.InitializedResponse, requestId: message.requestId };
      const promise = messageService.sendMessageWithResponse(message);

      messageService.listen();
      parentCommunicationAPI.onMessageReceived.calls
        .mostRecent()
        .args[0](new MessageEvent(response.type, { data: response }));

      const result = await promise;
      expect(result.type).toBe(response.type);
    });

    it('should return promise and reject it when sending fails', async () => {
      const message = createTestClientMessage();
      parentCommunicationAPI.postMessageToParent.and.throwError(InvalidEnvironmentError('test'));

      try {
        await messageService.sendMessageWithResponse(message);
        fail('Promise was resolved but expected it to be rejected.');
      } catch (e) {
        expect(e.name).toContain('InvalidEnvironmentError');
      }
    });
  });

  describe('listen', () => {
    it('should react to incoming messages after listen is called', () => {
      const spy = jasmine.createSpy();
      messageService.addListener(HostMessageType.Status, spy);
      messageService.listen();

      const message = createTestHostMessage();
      parentCommunicationAPI.onMessageReceived.calls
        .mostRecent()
        .args[0](new MessageEvent(message.type, { data: message }));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('unlisten', () => {
    it('should not react to further messages after unlisten is called', () => {
      const spy = jasmine.createSpy();
      messageService.addListener(HostMessageType.Status, spy);

      messageService.listen();
      messageService.unlisten();

      const message = createTestHostMessage();
      parentCommunicationAPI.onMessageReceived.calls
        .mostRecent()
        .args[0](new MessageEvent(message.type, { data: message }));

      expect(spy).not.toHaveBeenCalled();
    });
  });

  const createTestClientMessage = (): ISdkInitializedClientMessage => ({
    requestId: createUuid(),
    type: ClientMessageType.Initialized,
    data: { projectId: '', languageCodename: '', enabled: true },
  });

  const createTestHostMessage = (): ISdkStatusHostMessage => ({
    type: HostMessageType.Status,
    data: { enabled: false },
  });
});
