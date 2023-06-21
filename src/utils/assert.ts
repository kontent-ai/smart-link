import { AssertionError } from './errors';

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    const error = AssertionError(message);
    console.error(error);
    throw error;
  }
}
