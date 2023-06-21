import { assert } from '../../src/utils/assert';

describe('assert.ts', () => {
  it('should throw error if condition is falsy', () => {
    spyOn(console, 'error');

    expect(() => {
      assert(false, 'This should throw!');
    }).toThrowError();

    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('should not throw if condition is truthy', () => {
    expect(() => {
      assert(true, 'This should not throw!');
    }).not.toThrow();
  });
});
