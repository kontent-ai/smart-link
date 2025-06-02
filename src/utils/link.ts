import { IElementClickedMessageData } from '../lib/IFrameCommunicatorTypes';

export function buildItemLink(environmentId: string, languageCodename: string, itemId: string): string {
  return `https://app.kontent.ai/goto/edit-item/project/${environmentId}/variant-codename/${languageCodename}/item/${itemId}`;
}

export function buildElementLink(
  environmentId: string,
  languageCodename: string,
  itemId: string,
  elementCodename: string
): string {
  return `${buildItemLink(environmentId, languageCodename, itemId)}/element/${elementCodename}`;
}

export function buildComponentElementLink(
  environmentId: string,
  languageCodename: string,
  itemId: string,
  contentComponentId: string,
  componentElementCodename: string
): string {
  return `${buildItemLink(
    environmentId,
    languageCodename,
    itemId
  )}/component/${contentComponentId}/element/${componentElementCodename}`;
}

export function buildKontentLink(data: IElementClickedMessageData): string {
  return data.contentComponentId
    ? buildComponentElementLink(
        data.projectId,
        data.languageCodename,
        data.itemId,
        data.contentComponentId,
        data.elementCodename
      )
    : buildElementLink(data.projectId, data.languageCodename, data.itemId, data.elementCodename);
}
