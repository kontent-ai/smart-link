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

/**
 * Parse data-attributes from event path.
 *
 * @param {Event} event
 * @returns {ReadonlyMap<string, string>}
 */
export function getDataAttributesFromEventPath(event: Event): ReadonlyMap<string, string> {
  const path = event.composedPath();
  const elements = path.filter((eventTarget: EventTarget) => eventTarget instanceof HTMLElement) as HTMLElement[];
  return getDataAttributesFromElementsList(elements);
}

/**
 * Parse data-attributes from element ancestors.
 *
 * @param {HTMLElement} element
 * @returns {ReadonlyMap<string, string>}
 */
export function getDataAttributesFromElementAncestors(element: HTMLElement): ReadonlyMap<string, string> {
  const elements = [element, ...getElementAncestors(element)];
  return getDataAttributesFromElementsList(elements);
}

/**
 * Get all element ancestors.
 * @param element
 */
function getElementAncestors(element: HTMLElement): ReadonlyArray<HTMLElement> {
  const ancestors = [];

  let parent = element.parentElement;
  while (parent !== null) {
    ancestors.push(parent);
    parent = parent.parentElement;
  }

  return ancestors;
}

function getDataAttributesFromElementsList(elements: HTMLElement[]): ReadonlyMap<string, string> {
  const parsed: Map<string, string> = new Map();

  for (const element of elements) {
    if (!(element instanceof HTMLElement)) continue;

    for (const attributeName of DataAttributeParsingOrder) {
      const datasetAttributeName = dataToDatasetAttributeName(attributeName);
      const datasetAttributeValue = element.dataset[datasetAttributeName];
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

/**
 * Get data attributes that are higher in the hierarchy.
 *
 * @param {string} attributeName
 * @returns {ReadonlyArray<string>}
 */
function getHigherDataAttributes(attributeName: string): ReadonlyArray<string> {
  const attributeIndex = DataAttributeHierarchy.indexOf(attributeName);
  return DataAttributeHierarchy.slice(0, attributeIndex);
}

/**
 * Turn data-attribute name into dataset attribute name.
 * For example: 'data-kontent-item-id' -> 'kontentItemId'.
 *
 * @param {string} dataAttributeName
 * @returns {string}
 */
function dataToDatasetAttributeName(dataAttributeName: string): string {
  return dataAttributeName.replace(/^data-/, '').replace(/-./g, (x: string) => x.toUpperCase()[1]);
}
