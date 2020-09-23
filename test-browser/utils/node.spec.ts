import { createHtmlFixture } from '../test-helpers/createHtmlFixture';
import { getParentForHighlight } from '../../src/utils/node';

describe('node.ts', () => {
  describe('getParentForHighlight', () => {
    const fixture = createHtmlFixture();

    it('should return the closest parent with relative position', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="a" style="position: relative">
            <div id="b" style="position: absolute">
                <div id="c" style="position: relative">
                    <div id="d">
                        <div id="e" style="position: static">
                            <div id="target"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('#target') as HTMLElement;
      const [element, metadata] = getParentForHighlight(target);
      expect(element?.id).toEqual('c');
      expect(metadata).toEqual({
        hasRelativePosition: true,
        hasRestrictedOverflow: false,
      });
    });

    it('should return the closest parent with restricted overflow', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="a" style="position: relative">
            <div id="b" style="position: absolute">
                <div id="c" style="overflow: scroll">
                    <div id="d">
                        <div id="e" style="position: static">
                            <div id="target"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('#target') as HTMLElement;
      const [element, metadata] = getParentForHighlight(target);
      expect(element?.id).toEqual('c');
      expect(metadata).toEqual({
        hasRelativePosition: false,
        hasRestrictedOverflow: true,
      });
    });
  });
});
