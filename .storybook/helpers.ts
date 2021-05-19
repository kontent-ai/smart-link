export function getEnumValues<TEnum extends Record<string, string>>(e: TEnum): string[] {
  return Object.keys(e)
    .filter(key => typeof e[key] !== 'number')
    .map(key => e[key]);
}

