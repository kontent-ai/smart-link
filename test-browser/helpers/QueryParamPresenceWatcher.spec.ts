import { QueryParamPresenceWatcher } from '../../src/helpers/QueryParamPresenceWatcher';

describe('QueryParamPresenceWatcher', () => {
  let presenceWatcher: QueryParamPresenceWatcher;
  let windowMock: jasmine.SpyObj<Window>;

  beforeEach(() => {
    windowMock = jasmine.createSpyObj<Window>('window', ['setTimeout', 'location', 'clearTimeout']);
    windowMock.location = jasmine.createSpyObj<Location>('location', ['search']);
    windowMock.location.search = '';
    presenceWatcher = new QueryParamPresenceWatcher(windowMock);
  });

  describe('watch', () => {
    it('should invoke onChange with correct parameter if query param is present', () => {
      const onChangeMock = jasmine.createSpy('onChange');
      windowMock.location.search = '?param=value';
      presenceWatcher.watch('param', onChangeMock);
      expect(onChangeMock).toHaveBeenCalledWith(true);
    });

    it('should invoke onChange with correct parameter if query param is not present', () => {
      const onChangeMock = jasmine.createSpy('onChange');
      windowMock.location.search = '?other=value';
      presenceWatcher.watch('param', onChangeMock);
      expect(onChangeMock).toHaveBeenCalledWith(false);
    });

    it('should not invoke onChange when the query param value changes', () => {
      const onChangeMock = jasmine.createSpy('onChange');
      windowMock.location.search = '?query=test&novalue&param=value1';
      presenceWatcher.watch('param', onChangeMock);

      expect(onChangeMock).toHaveBeenCalledWith(true);
      onChangeMock.calls.reset();

      windowMock.location.search = '?param=value2';
      presenceWatcher.watch('param', onChangeMock);

      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('should invoke onChange when the query param presence changes', () => {
      const onChangeMock = jasmine.createSpy('onChange');
      windowMock.location.search = '?query=test&novalue&param';
      presenceWatcher.watch('param', onChangeMock);

      expect(onChangeMock).toHaveBeenCalledWith(true);
      onChangeMock.calls.reset();

      windowMock.location.search = '?argument=test&query=test&novalue';
      presenceWatcher.watch('param', onChangeMock);

      expect(onChangeMock).toHaveBeenCalledWith(false);
    });

    it('should set a timer for the next watch', () => {
      const onChangeMock = jasmine.createSpy('onChange');
      presenceWatcher.watch('param', onChangeMock);

      expect(windowMock.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
    });
  });

  describe('unwatchAll', () => {
    it('should clear all timers', () => {
      const onChangeMock = jasmine.createSpy('onChange');
      presenceWatcher.watch('param1', onChangeMock);
      presenceWatcher.watch('param2', onChangeMock);

      presenceWatcher.unwatchAll();

      expect(windowMock.clearTimeout).toHaveBeenCalledTimes(2);
    });

    it('should clear all timers and reset timers map', () => {
      const timerId1 = 123;
      const timerId2 = 456;
      presenceWatcher['timers'].set('param1', timerId1);
      presenceWatcher['timers'].set('param2', timerId2);
      presenceWatcher.unwatchAll();
      expect(presenceWatcher['timers'].size).toBe(0);
    });
  });
});
