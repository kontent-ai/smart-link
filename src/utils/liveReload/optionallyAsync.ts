import { IContentItem } from '@kontent-ai/delivery-sdk';

export type OptionallyAsync<T> = Readonly<{
  optionallyAsyncFnc: (
    fetchItems?: (codenames: ReadonlyArray<string>) => Promise<ReadonlyArray<IContentItem>>
  ) => T | Promise<T>;
}>;

export const createOptionallyAsync = <T>(
  fnc: (fetchItems?: (codenames: ReadonlyArray<string>) => Promise<ReadonlyArray<IContentItem>>) => T | Promise<T>
): OptionallyAsync<T> => ({
  optionallyAsyncFnc: fnc,
});

export const applyOnOptionallyAsync = <Input, Output>(
  fnc: OptionallyAsync<Input>,
  transformer: (input: Input) => Output
): OptionallyAsync<Output> => ({
  optionallyAsyncFnc: (fetchItems) => {
    const input = fnc.optionallyAsyncFnc(fetchItems);

    return input instanceof Promise ? input.then(transformer) : transformer(input);
  },
});

export const chainOptionallyAsync = <Input, Output>(
  fnc: OptionallyAsync<Input>,
  chainCall: (input: Input) => OptionallyAsync<Output>
): OptionallyAsync<Output> => flattenOptionallyAsync(applyOnOptionallyAsync(fnc, chainCall));

const flattenOptionallyAsync = <Value>(nested: OptionallyAsync<OptionallyAsync<Value>>): OptionallyAsync<Value> => ({
  optionallyAsyncFnc: (fetchItems) => {
    const outerResult = nested.optionallyAsyncFnc(fetchItems);

    const innerResult =
      outerResult instanceof Promise
        ? outerResult.then((res) => res.optionallyAsyncFnc(fetchItems))
        : outerResult.optionallyAsyncFnc(fetchItems);

    return innerResult;
  },
});

export const mergeOptionalAsyncs = <T>(asyncs: ReadonlyArray<OptionallyAsync<T>>): OptionallyAsync<T[]> => ({
  optionallyAsyncFnc: (fetchItems) => {
    const evaluated = asyncs.map((as) => as.optionallyAsyncFnc(fetchItems));

    const nonPromises = evaluated.filter(<T>(e: T | Promise<T>): e is T => !(e instanceof Promise));

    return nonPromises.length === evaluated.length
      ? nonPromises
      : Promise.all(evaluated.map((e) => (e instanceof Promise ? e : Promise.resolve(e))));
  },
});

export function evaluateOptionallyAsync<T>(
  fnc: OptionallyAsync<T>,
  fetchItems: (codenames: ReadonlyArray<string>) => Promise<ReadonlyArray<IContentItem>>
): Promise<T>;
export function evaluateOptionallyAsync<T>(fnc: OptionallyAsync<T>, fetchItems: null): T;
export function evaluateOptionallyAsync<T>(
  fnc: OptionallyAsync<T>,
  fetchItems: null | ((codenames: ReadonlyArray<string>) => Promise<ReadonlyArray<IContentItem>>)
): T | Promise<T> {
  return fnc.optionallyAsyncFnc(fetchItems ?? undefined);
}
