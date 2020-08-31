interface IContentItemSystemAttributes {
  readonly [key: string]: any;
  readonly id: string;
  readonly name: string;
  readonly codename: string;
}

interface IContentItem {
  readonly [key: string]: any;
  readonly system: IContentItemSystemAttributes;
}

function getContentComponentCodename(id: string): string {
  const firstCharIsDigit = id[0] >= '0' && id[0] <= '9';
  return `${firstCharIsDigit ? 'n' : ''}${id.replace(/-/g, '_')}`;
}

export function isContentComponent(data: IContentItem): boolean {
  // There is no flag that the item is content component, so we have to detect it based on the observed conventions between id, name and codename
  return data.system.id === data.system.name && data.system.codename === getContentComponentCodename(data.system.id);
}
