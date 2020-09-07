import PluginWrapper from '../src';

describe('plugin.ts', () => {
  describe('PluginWrapper', () => {
    let pluginWrapper: PluginWrapper;

    beforeEach(() => {
      pluginWrapper = PluginWrapper.initialize();
    });

    afterEach(() => {
      pluginWrapper.destroy();
    });

    it('should have only one instance', () => {
      const newPluginWrapper = PluginWrapper.initialize();
      expect(newPluginWrapper).toBe(pluginWrapper);
    });

    it('should destroy plugin instance when destroy is called', () => {
      pluginWrapper.destroy();
      expect(pluginWrapper.setConfiguration).toThrowError();
    });
  });
});
