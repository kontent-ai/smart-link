import { AssertionError } from './errors';
import { Logger } from '../lib/Logger';

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    const error = AssertionError(message);
    Logger.error(error);
    throw error;
  }
}
