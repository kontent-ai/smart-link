function AssertionError(message: string): Error {
  const error = new Error(message);
  error.name = 'AssertionError';

  return error;
}

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    const error = AssertionError(message);
    console.error(error);
    throw error;
  }
}
