import { createStorage, IStorage } from '../../src/utils/storage';
import { generateRandomString } from '../test-helpers/generateRandomString';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

interface IStoredObject {
  readonly value: string;
}

describe('storage.ts', () => {
  describe('createStorage', () => {
    let storage: IStorage<IStoredObject>;

    beforeEach(() => {
      const key = generateRandomString();
      storage = createStorage<IStoredObject>(key);
    });

    afterEach(() => {
      storage.remove();
    });

    it('should save object to a storage and get it', () => {
      const testData = { value: 'set-get-test' };
      storage.set(testData);
      expect(storage.get()).toEqual({ value: 'set-get-test' });

      const updatedTestData = { value: 'set-get-test-updated' };
      storage.set(updatedTestData);
      expect(storage.get()).toEqual({ value: 'set-get-test-updated' });
    });

    it('should save object to a storage and remove it', () => {
      const testData = { value: 'set-remove-test' };
      storage.set(testData);
      expect(storage.get()).toEqual({ value: 'set-remove-test' });

      storage.remove();
      expect(storage.get()).toBe(null);
    });
  });
});
