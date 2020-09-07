import { getRelativeParent } from '../../src/utils/node';
import { createHtmlFixture } from '../test-helpers/createHtmlFixture';

describe('node.ts', () => {
  describe('getRelativeParent', () => {
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
      expect(getRelativeParent(target)?.id).toEqual('c');
    });

    it('should return null when none of the ancestors have relative position', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="a">
            <div id="b" style="position: absolute">
                <div id="c" style="position: static">
                    <div id="d">
                        <div id="target"></div>
                    </div>
                </div>
            </div>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('#target') as HTMLElement;
      expect(getRelativeParent(target)).toEqual(null);
    });
  });
});
