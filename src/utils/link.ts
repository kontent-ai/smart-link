export function buildItemLink(projectId: string, languageCodename: string, itemId: string): string {
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
