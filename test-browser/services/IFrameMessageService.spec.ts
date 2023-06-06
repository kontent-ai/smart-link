import { IParentCommunicationAPI } from '../../src/api/IParentCommunicationAPI';
import { IFrameMessageService } from '../../src/services/IFrameMessageService';

describe('IFrameMessageService', () => {
  let iFrameMessageService: IFrameMessageService;
  let parentCommunicationAPI: jasmine.SpyObj<IParentCommunicationAPI>;

  beforeEach(() => {
    parentCommunicationAPI = jasmine.createSpyObj('ParentWindowCommunicationAPI', [
      'isEmbedded',
      'postMessageToParent',
      'onMessageReceived',
    ]);

    iFrameMessageService = new IFrameMessageService(parentCommunicationAPI);
  });

  // describe('sendMessageWithResponse', () => {
  //   it('should return promise and resolve it when response is received', () => {
  //     iFrameMessageService.listen();
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
