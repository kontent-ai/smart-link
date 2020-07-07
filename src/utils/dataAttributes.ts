export const DataAttribute = {
  ElementCodename: 'data-kontent-element-codename',
  ItemId: 'data-kontent-item-id',
  LanguageCodename: 'data-kontent-language-codename',
  ProjectId: 'data-kontent-project-id',
};

export function dataToDatasetAttributeName(dataAttributeName: string): string {
  return dataAttributeName.replace(/^data-/, '').replace(/-./g, (x: string) => x.toUpperCase()[1]);
}

export function getDataAttributesFromEventPath(event: Event): Map<string, string> {
  const path = event.composedPath();
  const parsed: Map<string, string> = new Map();

  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue;

    for (const [, attrName] of Object.entries(DataAttribute)) {
      const datasetAttrName = dataToDatasetAttributeName(attrName);
      const datasetAttr = node.dataset[datasetAttrName];

      if (datasetAttr && !parsed.has(attrName)) {
        parsed.set(attrName, datasetAttr);
      }
    }
  }

  return parsed;
}
