import { IElementClickedMessageData } from '../lib/IFrameCommunicatorTypes';

function buildItemLink(projectId: string, languageCodename: string, itemId: string): string {
  return `https://app.kontent.ai/goto/edit-item/project/${projectId}/variant-codename/${languageCodename}/item/${itemId}`;
}

export function buildElementLink(
  projectId: string,
  languageCodename: string,
  itemId: string,
  elementCodename: string
): string {
  return `${buildItemLink(projectId, languageCodename, itemId)}/element/${elementCodename}`;
}

export function buildComponentElementLink(
  projectId: string,
  languageCodename: string,
  itemId: string,
  contentComponentId: string,
  componentElementCodename: string
): string {
  return `${buildItemLink(
    projectId,
    languageCodename,
    itemId
  )}/component/${contentComponentId}/element/${componentElementCodename}`;
}

export function buildKontentLink(data: IElementClickedMessageData): string {
  if (data.contentComponentId) {
    return buildComponentElementLink(
      data.projectId,
      data.languageCodename,
      data.itemId,
      data.contentComponentId,
      data.elementCodename
    );
  } else {
    return buildElementLink(data.projectId, data.languageCodename, data.itemId, data.elementCodename);
  }
}
