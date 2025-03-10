import { expect, it, describe, beforeEach, afterEach } from 'vitest';
import { KontentSmartLink } from '../src';

describe('plugin.ts', () => {
  describe('PluginWrapper', () => {
    let pluginWrapper: KontentSmartLink;

    beforeEach(() => {
      pluginWrapper = KontentSmartLink.initialize();
    });

    afterEach(() => {
      pluginWrapper.destroy();
    });

    it('should have only one instance', () => {
      const newPluginWrapper = KontentSmartLink.initialize();
      expect(newPluginWrapper).toBe(pluginWrapper);
    });

    it('should destroy plugin instance when destroy is called', () => {
      pluginWrapper.destroy();
      expect(pluginWrapper.setConfiguration).toThrowError();
    });
  });
});
