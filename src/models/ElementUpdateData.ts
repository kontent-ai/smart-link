import { Elements } from '@kontent-ai/delivery-sdk';
import { ElementType as DeliverElementType } from '@kontent-ai/delivery-sdk/dist/cjs/elements/element-type';

type ElementUpdateDataTemplate<TElement, TType extends DeliverElementType> = {
  readonly type: TType;
  readonly data: Omit<TElement, 'type' | 'name'>;
};

export type AssetElementUpdateData = ElementUpdateDataTemplate<Elements.AssetsElement, DeliverElementType.Asset>;
export type CustomElementUpdateData = ElementUpdateDataTemplate<Elements.CustomElement<any>, DeliverElementType.Custom>;
export type DatetimeElementUpdateData = ElementUpdateDataTemplate<
  Elements.DateTimeElement,
  DeliverElementType.DateTime
>;
export type LinkedItemsElementUpdateData = ElementUpdateDataTemplate<
  Elements.LinkedItemsElement,
  DeliverElementType.ModularContent
>;
export type MultipleChoiceElementUpdateData = ElementUpdateDataTemplate<
  Elements.MultipleChoiceElement,
  DeliverElementType.MultipleChoice
>;
export type NumberElementUpdateData = ElementUpdateDataTemplate<Elements.NumberElement, DeliverElementType.Number>;
export type RichTextElementUpdateData = ElementUpdateDataTemplate<
  Elements.RichTextElement,
  DeliverElementType.RichText
>;
export type TaxonomyElementUpdateData = ElementUpdateDataTemplate<
  Elements.TaxonomyElement,
  DeliverElementType.Taxonomy
>;
export type TextElementUpdateData = ElementUpdateDataTemplate<Elements.TextElement, DeliverElementType.Text>;
export type UrlSlugElementUpdateData = ElementUpdateDataTemplate<Elements.UrlSlugElement, DeliverElementType.UrlSlug>;

export type ElementUpdateData =
  | AssetElementUpdateData
  | CustomElementUpdateData
  | DatetimeElementUpdateData
  | LinkedItemsElementUpdateData
  | MultipleChoiceElementUpdateData
  | NumberElementUpdateData
  | RichTextElementUpdateData
  | TaxonomyElementUpdateData
  | TextElementUpdateData
  | UrlSlugElementUpdateData;
