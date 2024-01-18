import { Elements } from '@kontent-ai/delivery-sdk';
import { ElementType } from '@kontent-ai/delivery-sdk/dist/cjs/elements/element-type';

type ElementUpdateDataTemplate<TElement, TType extends ElementType> = {
  readonly type: TType;
  readonly data: Omit<TElement, 'type' | 'name'>;
};

export type AssetElementUpdateData = ElementUpdateDataTemplate<Elements.AssetsElement, ElementType.Asset>;
export type CustomElementUpdateData = ElementUpdateDataTemplate<Elements.CustomElement<any>, ElementType.Custom>;
export type DatetimeElementUpdateData = ElementUpdateDataTemplate<Elements.DateTimeElement, ElementType.DateTime>;
export type LinkedItemsElementUpdateData = ElementUpdateDataTemplate<
  Elements.LinkedItemsElement,
  ElementType.ModularContent
>;
export type MultipleChoiceElementUpdateData = ElementUpdateDataTemplate<
  Elements.MultipleChoiceElement,
  ElementType.MultipleChoice
>;
export type NumberElementUpdateData = ElementUpdateDataTemplate<Elements.NumberElement, ElementType.Number>;
export type RichTextElementUpdateData = ElementUpdateDataTemplate<Elements.RichTextElement, ElementType.RichText>;
export type TaxonomyElementUpdateData = ElementUpdateDataTemplate<Elements.TaxonomyElement, ElementType.Taxonomy>;
export type TextElementUpdateData = ElementUpdateDataTemplate<Elements.TextElement, ElementType.Text>;
export type UrlSlugElementUpdateData = ElementUpdateDataTemplate<Elements.UrlSlugElement, ElementType.UrlSlug>;

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
