type AnyFunction = (...args: any[]) => unknown;

export function debounce(fn: AnyFunction, delayMs: number): AnyFunction {
  let timeoutId: number | undefined;
  return function (...args: any[]): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delayMs);
  };
}

export function debounced(delayMs: number): (...args: any[]) => TypedPropertyDescriptor<AnyFunction> {
  return function decorator(
    _target: Record<string, unknown>,
    _key: string | symbol,
    descriptor: TypedPropertyDescriptor<AnyFunction>
  ): TypedPropertyDescriptor<AnyFunction> {
    const value = descriptor.value;

    if (typeof value !== 'function') {
      throw new TypeError('Debounce decorator can only be used on methods.');
    }

    descriptor.value = debounce(value, delayMs);
    return descriptor;
  };
}
