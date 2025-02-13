import { describe, it, expect, vi } from 'vitest';
import { assert } from '../../src/utils/assert';
import { Logger } from '../../src/lib/Logger';

describe('assert.ts', () => {
  it('should throw error if condition is falsy', () => {
    vi.spyOn(Logger, 'error');

    expect(() => {
      assert(false, 'error-message');
    }).toThrowError();

    expect(Logger.error).toHaveBeenCalled();
  });
});
