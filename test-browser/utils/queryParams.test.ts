import { describe, it, expect, afterEach } from 'vitest';
import { isQueryParamPresent, watchQueryParamPresence } from '../../src/utils/queryParams';

describe('QueryParamPresenceWatcher.ts', () => {
  function setQueryStringWithoutReload(query: string) {
    window.history.pushState(null, '', window.location.pathname + query);
  }

  describe('isQueryParamPresent', () => {
    afterEach(() => {
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

  describe('watch', () => {
    let unwatch: () => void;

    afterEach(() => {
      unwatch?.();
    });

    it('should trigger callback if query param changes', () =>
      new Promise<void>((done) => {
        setQueryStringWithoutReload('?testData');

        unwatch = watchQueryParamPresence('testData', (isPresent: boolean) => {
          expect(isPresent).toBe(true);
          done();
        });
      }));
  });
});
