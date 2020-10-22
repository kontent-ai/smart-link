import { createHtmlFixture } from '../test-helpers/createHtmlFixture';
import { getParentForHighlight, getTotalScrollOffset } from '../../src/utils/node';

describe('node.ts', () => {
  describe('getParentForHighlight', () => {
    const fixture = createHtmlFixture();

    it('should return [null, null] when there is no suitable parent', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="a">
            <div id="c">
                <div id="b">
                    <div id="d">
                        <div id="e">
                            <div id="target"></div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                body {
                    overflow: visible !important;
                    position: static !important;
                }
            </style>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('#target') as HTMLElement;
      const result = getParentForHighlight(target);
      expect(result).toEqual([null, null]);
    });

    it('should return the positioned parent', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="a" style="position: relative">
            <div id="c" style="position: relative">
                <div id="b" style="position: absolute">
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
      expect(element?.id).toEqual('b');
      expect(metadata).toEqual({
        isPositioned: true,
        isContentClipped: false,
      });
    });

    it('should return the parent with clipped content', () => {
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
        isPositioned: false,
        isContentClipped: true,
      });
    });

    it('should return the closest parent which is positioned or has clipped content', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="a" style="position: relative">
            <div id="b" style="position: static">
                <div id="c" style="overflow: scroll">
                    <div id="d">
                        <div id="e" style="position: static">
                            <div id="targetA"></div>
                        </div>
                    </div>
                </div>
                <div id="targetB"></div>
            </div>
        </div>
      `);
      // </editor-fold>

      const targetA = fixture.querySelector('#targetA') as HTMLElement;
      const targetB = fixture.querySelector('#targetB') as HTMLElement;

      const resultA = getParentForHighlight(targetA);
      const resultB = getParentForHighlight(targetB);

      expect(resultA?.[0]?.id).toEqual('c');
      expect(resultB?.[0]?.id).toEqual('a');
    });

    it('should ignore table elements when they are not positioned', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="a" style="position: relative">
            <table id="b" style="overflow: hidden">
                <tbody id="c">
                    <tr id="d">
                        <td id="e" style="overflow: hidden; max-width: 10px;">
                            <div id="target" style="min-height: 100px;"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('#target') as HTMLElement;
      const [element] = getParentForHighlight(target);
      expect(element?.id).toEqual('a');
    });

    it('should acknowledge table elements when they are positioned', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="a" style="position: relative">
            <table id="b" style="overflow: hidden; position: relative;">
                <tbody id="c">
                    <tr id="d">
                        <td id="e" style="overflow: scroll; max-width: 10px;">
                            <div id="target" style="min-height: 100px;"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('#target') as HTMLElement;
      const [element] = getParentForHighlight(target);
      expect(element?.id).toEqual('b');
    });
  });

  describe('getTotalScrollOffset', () => {
    const fixture = createHtmlFixture();

    it('should return [0, 0] when no node provided', () => {
      expect(getTotalScrollOffset(null)).toEqual([0, 0]);
    });

    it('should return [0, 0] when element has no offsetParent', () => {
      expect(getTotalScrollOffset(document.body)).toEqual([0, 0]);
    });

    it('should return total scroll offset', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="container" style="position: relative">
            <div id="a" style="max-height: 30px; max-width: 30px; overflow: scroll;">
                <div id="b" style="min-height: 200px; min-width: 200px;">
                    <div id="c" style="max-height: 80px; max-width: 80px; overflow: scroll;">
                        <div id="d" style="min-height: 200px; min-width: 200px;">
                            <div id="target"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `);
      // </editor-fold>

      const divA = fixture.querySelector('#a') as HTMLElement;
      const divC = fixture.querySelector('#c') as HTMLElement;
      const target = fixture.querySelector('#target') as HTMLElement;

      divA.scrollTop = 10;
      divA.scrollLeft = 20;

      divC.scrollTop = 30;
      divC.scrollLeft = 40;

      const [scrollTop, scrollLeft] = getTotalScrollOffset(target);

      expect(Math.ceil(scrollTop)).toEqual(40);
      expect(Math.ceil(scrollLeft)).toEqual(60);
    });

    it('should not include scroll offset of the offsetParent', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="container" style="position: relative; max-height: 20px; max-width: 20px; overflow: scroll;">
            <div id="a" style="min-height: 200px; min-width: 200px;">
                <div id="b" style="max-height: 30px; max-width: 30px; overflow: scroll;">
                    <div id="c" style="min-height: 200px; min-width: 200px;">
                        <div id="d" style="max-height: 80px; max-width: 80px; overflow: scroll;">
                            <div id="e" style="min-height: 200px; min-width: 200px;">
                                <div id="target"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `);
      // </editor-fold>

      const offsetParent = fixture.querySelector('#container') as HTMLElement;
      const divB = fixture.querySelector('#b') as HTMLElement;
      const divD = fixture.querySelector('#d') as HTMLElement;
      const target = fixture.querySelector('#target') as HTMLElement;

      offsetParent.scrollTop = 10;
      offsetParent.scrollLeft = 20;

      divB.scrollTop = 30;
      divB.scrollLeft = 40;

      divD.scrollTop = 50;
      divD.scrollLeft = 60;

      const [scrollTop, scrollLeft] = getTotalScrollOffset(target);

      expect(Math.ceil(scrollTop)).toEqual(80);
      expect(Math.ceil(scrollLeft)).toEqual(100);
    });
  });
});
