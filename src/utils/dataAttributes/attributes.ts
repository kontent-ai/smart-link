/**
 * Data-attributes are used to get some Kontent related data from DOM.
 * Data from data-attributes is used to generate smart links or iframe messages to Kontent.
 * However, this data can also be used in rendering (e.g. HTML elements with element codename attribute
 * have highlights).
 */
export enum DataAttribute {
  AddButtonInsertPosition = "data-kontent-add-button-insert-position",
  ElementCodename = "data-kontent-element-codename",
  ComponentId = "data-kontent-component-id",
  ItemId = "data-kontent-item-id",
  LanguageCodename = "data-kontent-language-codename",
  EnvironmentId = "data-kontent-environment-id",
}

/**
 * Metadata-attributes are used to get some metadata about some of the SDK features.
 * Metadata is used for SDK inner logic (such as rendering, event handling, etc.).
 */
export enum MetadataAttribute {
  AddButton = "data-kontent-add-button",
  AddButtonRenderPosition = "data-kontent-add-button-render-position",
  DisableFeatures = "data-kontent-disable-features",
}

/**
 * Valid values of the MetadataAttribute.DisableFeatures attribute.
 * Those values can be used to disable certain features for the selected node.
 */
export enum DisableableFeature {
  Highlight = "highlight",
}
