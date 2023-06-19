import { ParentWindowCommunicationAPI } from '../../src/helpers/ParentWindowCommunicationAPI';

describe('ParentWindowCommunicationAPI', () => {
  type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  let parentWindowCommunicationAPI: ParentWindowCommunicationAPI;
  let window: jasmine.SpyObj<Writable<Window>>;

  beforeEach(() => {
    window = jasmine.createSpyObj('Window', ['self', 'top', 'addEventListener', 'removeEventListener', 'parent']);
    window.parent.postMessage = jasmine.createSpy();
    parentWindowCommunicationAPI = new ParentWindowCommunicationAPI(window);
  });

  describe('postMessageToParent', () => {
    it('should throw when called on the top level', () => {
      window.top = window;
      window.self = window as unknown as Window & typeof globalThis;

      expect(() => parentWindowCommunicationAPI.postMessageToParent({})).toThrowError(/inside an iframe/);
    });

    it('should post message to parent when called inside an iframe', () => {
      parentWindowCommunicationAPI.postMessageToParent({});
      expect(window.parent.postMessage).toHaveBeenCalled();
    });
  });
});
