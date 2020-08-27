export const DataAttribute = {
  ElementCodename: 'data-kontent-element-codename',
  ComponentId: 'data-kontent-component-id',
  ItemId: 'data-kontent-item-id',
  LanguageCodename: 'data-kontent-language-codename',
  ProjectId: 'data-kontent-project-id',
};

const DataAttributeHierarchy = [
  DataAttribute.ProjectId,
  DataAttribute.LanguageCodename,
  DataAttribute.ItemId,
  DataAttribute.ComponentId,
  DataAttribute.ElementCodename,
];

const DataAttributeParsingOrder = DataAttributeHierarchy.slice().reverse();
const OptionalDataAttributes = [DataAttribute.ComponentId];

function getHigherDataAttributes(attributeName: string): ReadonlyArray<string> {
  const attributeIndex = DataAttributeHierarchy.indexOf(attributeName);
  return DataAttributeHierarchy.slice(0, attributeIndex);
}

export function dataToDatasetAttributeName(dataAttributeName: string): string {
  return dataAttributeName.replace(/^data-/, '').replace(/-./g, (x: string) => x.toUpperCase()[1]);
}

export function getDataAttributesFromEventPath(event: Event): ReadonlyMap<string, string> {
  const path = event.composedPath();
  const parsed: Map<string, string> = new Map();

  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue;

    for (const attributeName of DataAttributeParsingOrder) {
      const datasetAttributeName = dataToDatasetAttributeName(attributeName);
      const datasetAttributeValue = node.dataset[datasetAttributeName];
      const isAttributeOptional = OptionalDataAttributes.includes(attributeName);

      if (!datasetAttributeValue || parsed.has(attributeName)) continue;

      // Higher attributes are attributes that are placed higher in the hierarchy, for example,
      // for component id attribute those will be item id, language codename and project id.
      const higherDataAttributes = getHigherDataAttributes(attributeName);
      const areSomeHigherAttributesSet = higherDataAttributes.some((attr) => parsed.has(attr));

      // If some higher attributes have already been parsed, it can mean two things:
      // a) Current data attribute is optional and is not related to the current scope.
      //    In that case it will be ignored.
      //      Example:
      //        <body data-kontent-project-id data-kontent-language-codename>
      //          <div data-kontent-item-id data-kontent-component-id data-kontent-element-codename>
      //            <!-- when parser comes to this element itemId and elementCodename are already parsed
      //                 data-kontent-component-id is not related to them, so it should be ignored -->
      //            <div data-kontent-item-id data-kontent-element-codename></div>
      //          </div>
      //        </body>
      // b) Parsed data is related to some lower scope (or invalid) and should be cleared.
      //      Example:
      //        <body data-kontent-project-id data-kontent-language-codename>
      //          <div data-kontent-item-id data-kontent-element-codename>
      //            <div data-kontent-item-id>
      //               <!-- if you click on this element, item id will be parsed, but it is not related to the
      //                  data-kontent-element-codename above it, and this value must be cleared -->
      //            </div>
      //          </div>
      //        </body>
      if (areSomeHigherAttributesSet) {
        if (isAttributeOptional) continue;

        for (const attr of higherDataAttributes) {
          parsed.delete(attr);
        }
      }

      parsed.set(attributeName, datasetAttributeValue);
    }
  }

  return parsed;
}
