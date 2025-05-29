import { AssertionError } from './errors';
import { logError } from '../lib/Logger';

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    const error = AssertionError(message);
    logError(error);
    throw error;
  }
}
