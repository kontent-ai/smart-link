import type { ElementPositionOffset } from "../../web-components/abstract/KSLPositionedElement";
import { DataAttribute, MetadataAttribute } from "./attributes";

export const createEnvironmentDataAttribute = (
  environmentId: string,
): Readonly<{ [DataAttribute.EnvironmentId]: string }> => ({
  [DataAttribute.EnvironmentId]: environmentId,
});

export const createLanguageDataAttribute = (
  languageCodename: string,
): Readonly<{ [DataAttribute.LanguageCodename]: string }> => ({
  [DataAttribute.LanguageCodename]: languageCodename,
});

export const createItemDataAttribute = (
  itemId: string,
): Readonly<{ [DataAttribute.ItemId]: string }> => ({
  [DataAttribute.ItemId]: itemId,
});

export const createComponentDataAttribute = (
  componentId: string,
): Readonly<{ [DataAttribute.ComponentId]: string }> => ({
  [DataAttribute.ComponentId]: componentId,
});

export const createElementCodenameDataAttribute = (
  elementCodename: string,
): Readonly<{ [DataAttribute.ElementCodename]: string }> => ({
  [DataAttribute.ElementCodename]: elementCodename,
});

export const createDisableFeaturesDataAttribute = (): Readonly<{
  [MetadataAttribute.DisableFeatures]: "highlight";
}> => ({
  [MetadataAttribute.DisableFeatures]: "highlight",
});

export const createFixedAddButtonDataAttributes = (
  position: "start" | "end",
  renderPosition?: ElementPositionOffset,
): Readonly<{
  [MetadataAttribute.AddButton]: true;
  [DataAttribute.AddButtonInsertPosition]: "start" | "end";
  [MetadataAttribute.AddButtonRenderPosition]?: ElementPositionOffset;
}> => ({
  [MetadataAttribute.AddButton]: true,
  [DataAttribute.AddButtonInsertPosition]: position,
  ...(renderPosition === undefined
    ? { [MetadataAttribute.AddButtonRenderPosition]: renderPosition }
    : {}),
});

export const createRelativeAddButtonSmartLink = (
  position: "before" | "after",
  target: {
    type: "item" | "component";
    id: string;
  },
  renderPosition?: ElementPositionOffset,
): Readonly<{
  [MetadataAttribute.AddButton]: true;
  [DataAttribute.AddButtonInsertPosition]: "before" | "after";
  [MetadataAttribute.AddButtonRenderPosition]?: ElementPositionOffset;
}> => ({
  [MetadataAttribute.AddButton]: true,
  [DataAttribute.AddButtonInsertPosition]: position,
  ...(renderPosition ? { [MetadataAttribute.AddButtonRenderPosition]: renderPosition } : {}),
  ...(target.type === "item"
    ? { [DataAttribute.ItemId]: target.id }
    : { [DataAttribute.ComponentId]: target.id }),
});
