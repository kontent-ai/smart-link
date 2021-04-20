export function AssertionError(message: string): Error {
  const error = new Error(message);
  error.name = 'AssertionError';

  return error;
}

export function NotImplementedError(message: string): Error {
  const error = new Error(message);
  error.name = 'NotImplementedError';

  return error;
}

export function InvalidEnvironmentError(message: string): Error {
  const error = new Error(message);
  error.name = 'InvalidEnvironmentError';

  return error;
}

export function NotInitializedError(message: string): Error {
  const error = new Error(message);
  error.name = 'NotInitializedError';

  return error;
}
