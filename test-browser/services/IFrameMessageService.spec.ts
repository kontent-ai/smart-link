import { IParentCommunicationAPI } from '../../src/api/IParentCommunicationAPI';
import { IFrameMessageService } from '../../src/services/IFrameMessageService';
import { ClientMessageType } from '../../src/models/messages/MessageEnums';
import { IEditButtonContentItemClickClientMessage } from '../../src/models/messages/EditButtonClientMessage';

describe('IFrameMessageService', () => {
  let messageService: IFrameMessageService;
  let parentCommunicationAPI: jasmine.SpyObj<IParentCommunicationAPI>;

  beforeEach(() => {
    parentCommunicationAPI = jasmine.createSpyObj('ParentWindowCommunicationAPI', [
      'isEmbedded',
      'postMessageToParent',
      'onMessageReceived',
    ]);

    messageService = new IFrameMessageService(parentCommunicationAPI);
  });

  describe('sendMessage', () => {
    it('should send message to parent window', () => {
      const tempMessage: IEditButtonContentItemClickClientMessage = {
        type: ClientMessageType.EditContentItemClicked,
        data: { projectId: '', languageCodename: '', itemId: '' },
        metadata: { elementRect: new DOMRect() },
      };

      messageService.sendMessage(tempMessage);

      expect(parentCommunicationAPI.postMessageToParent).toHaveBeenCalledWith(tempMessage);
    });
  });

  // describe('sendMessageWithResponse', () => {
  //   it('should return promise and resolve it when response is received', () => {
  //     messageService.listen();
  //   });
  //
  //   it('should return promise and reject it if sending fails', () => {});
  // });
  //
  // describe('listen', () => {
  //   it('should listen to messages only if listen was called', () => {});
  // });
  //
  // describe('unlisten', () => {
  //   it('should stop listening to messages after unlisten is called', () => {});
  // });
});
