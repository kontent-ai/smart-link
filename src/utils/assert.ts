import { logError } from "../lib/Logger";
import { AssertionError } from "./errors";

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    const error = new AssertionError(message);
    logError(error);
    throw error;
  }
}
