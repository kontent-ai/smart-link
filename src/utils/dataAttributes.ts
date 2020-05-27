export const DataAttribute = {
  ElementCodename: 'data-kk-element-codename',
  ItemId: 'data-kk-item-id',
  LanguageCodename: 'data-kk-language-codename',
  ProjectId: 'data-kk-project-id',
  // TODO: [NOT FOR ETP] add attributes for page-item-id and page-language-codename.
  // TODO: [NOT FOR ETP] maybe add some attribute to show that item does not have elements inside and must be processed as a node with data-kk-element-codename attribute.
};

export function dataToDatasetAttributeName(dataAttributeName: string): string {
  return dataAttributeName.replace('data-', '').replace(/-./g, (x: string) => x.toUpperCase()[1]);
}

export function getDataAttributesFromEventPath(event: Event): Map<string, string> {
  const path = event.composedPath();
  const parsed: Map<string, string> = new Map();

  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue;

    for (const [, attrName] of Object.entries(DataAttribute)) {
      const datasetAttrName = dataToDatasetAttributeName(attrName);
      const datasetAttr = node.dataset[datasetAttrName];

      if (datasetAttr && !parsed.has(datasetAttrName)) {
        parsed.set(attrName, datasetAttr);
      }
    }
  }

  return parsed;
}
