import { assert } from '../../src/utils/assert';

describe('assert.ts', () => {
  it('should throw error if condition is falsy', () => {
    spyOn(console, 'error');

    expect(() => {
      assert(false, 'error-message');
    }).toThrowError();

    expect(console.error).toHaveBeenCalled();
  });
});
