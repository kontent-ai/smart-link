export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Replace<T, NewValues extends { [key in keyof T]?: unknown }> = T extends any
  ? Omit<T, keyof NewValues> & Readonly<NewValues>
  : never;

export type NonEmptyArray<T> = [T, ...T[]];
