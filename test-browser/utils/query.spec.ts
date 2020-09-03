import { isQueryParamPresent } from '../../src/utils/query';

describe('query.ts', () => {
  describe('isQueryParamPresent', () => {
    function setQueryStringWithoutReload(query: string) {
      window.history.pushState(null, '', window.location.pathname + query);
    }

    afterEach(() => {
      // clear query string without reload
      window.history.pushState(null, '', window.location.pathname);
    });

    it('should return true when specified query parameter is present', () => {
      setQueryStringWithoutReload('?testData=true&preview');
      expect(isQueryParamPresent('testData')).toBe(true);
    });

    it('should return true when specified query parameter is present without value', () => {
      setQueryStringWithoutReload('?testData&preview=true&test_mode=1');
      expect(isQueryParamPresent('testData')).toBe(true);
    });

    it('should return true when specified query parameter is last and without value', () => {
      setQueryStringWithoutReload('?preview=true&test_mode=1&testData');
      expect(isQueryParamPresent('testData')).toBe(true);
    });

    it('should return false when specified query parameter is missing', () => {
      setQueryStringWithoutReload('?preview=true&test_mode=1');
      expect(isQueryParamPresent('testData')).toBe(false);
    });

    it('should return false when query string is empty', () => {
      setQueryStringWithoutReload('');
      expect(isQueryParamPresent('testData')).toBe(false);
    });
  });
});
