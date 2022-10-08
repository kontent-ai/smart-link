import { IQueryParamWatcherService, QueryParamWatcherService } from '../../src/services/QueryParamWatcherService';

describe('QueryParamWatcherService.ts', () => {
  function setQueryStringWithoutReload(query: string) {
    window.history.pushState(null, '', window.location.pathname + query);
  }

  describe('isQueryParamPresent', () => {
    afterEach(() => {
      window.history.pushState(null, '', window.location.pathname);
    });

    it('should return true when specified query parameter is present', () => {
      setQueryStringWithoutReload('?testData=true&preview');
      expect(QueryParamWatcherService.isQueryParamPresent('testData')).toBe(true);
    });

    it('should return true when specified query parameter is present without value', () => {
      setQueryStringWithoutReload('?testData&preview=true&test_mode=1');
      expect(QueryParamWatcherService.isQueryParamPresent('testData')).toBe(true);
    });

    it('should return true when specified query parameter is last and without value', () => {
      setQueryStringWithoutReload('?preview=true&test_mode=1&testData');
      expect(QueryParamWatcherService.isQueryParamPresent('testData')).toBe(true);
    });

    it('should return false when specified query parameter is missing', () => {
      setQueryStringWithoutReload('?preview=true&test_mode=1');
      expect(QueryParamWatcherService.isQueryParamPresent('testData')).toBe(false);
    });

    it('should return false when query string is empty', () => {
      setQueryStringWithoutReload('');
      expect(QueryParamWatcherService.isQueryParamPresent('testData')).toBe(false);
    });
  });

  describe('watch', () => {
    let queryParamWatcherService: IQueryParamWatcherService | null;

    afterEach(() => {
      queryParamWatcherService?.unwatchAll();
      queryParamWatcherService = null;
    });

    it('should trigger callback if query param changes', (done: DoneFn) => {
      setQueryStringWithoutReload('?testData');

      queryParamWatcherService = new QueryParamWatcherService();

      queryParamWatcherService.watch('testData', (isPresent: boolean) => {
        expect(isPresent).toBe(true);
        done();
      });
    });
  });
});
