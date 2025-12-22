export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
    Object.setPrototypeOf(this, AssertionError.prototype);
  }
}

export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotImplementedError";
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}

export class InvalidEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEnvironmentError";
    Object.setPrototypeOf(this, InvalidEnvironmentError.prototype);
  }
}

export class NotInitializedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotInitializedError";
    Object.setPrototypeOf(this, NotInitializedError.prototype);
  }
}

export function throwError(message: string): never {
  throw new Error(message);
}
