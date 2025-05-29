import { describe, it, expect, vi } from 'vitest';
import { assert } from '../../src/utils/assert';

// Mock the logError function
vi.mock('../../src/lib/Logger', () => ({
  logError: vi.fn(),
}));

import { logError } from '../../src/lib/Logger';

describe('assert.ts', () => {
  it('should throw error if condition is falsy', () => {
    expect(() => {
      assert(false, 'error-message');
    }).toThrowError();

    expect(logError).toHaveBeenCalled();
  });
});
