export type BuildItemLinkParams = {
  environmentId: string;
  languageCodename: string;
  itemId: string;
};

export type BuildElementLinkParams = {
  environmentId: string;
  languageCodename: string;
  itemId: string;
  elementCodename: string;
};

export type BuildComponentElementLinkParams = {
  environmentId: string;
  languageCodename: string;
  itemId: string;
  contentComponentId: string;
  componentElementCodename: string;
};

export type BuildKontentElementLinkParams = BuildElementLinkParams | BuildComponentElementLinkParams;

/**
 * Builds a URL that opens the specified content item in the Kontent.ai web application editor.
 */
export function buildKontentItemLink(params: BuildItemLinkParams): string {
  return `https://app.kontent.ai/goto/edit-item/project/${params.environmentId}/variant-codename/${params.languageCodename}/item/${params.itemId}`;
}

function buildElementLink(params: BuildElementLinkParams): string {
  return `${buildKontentItemLink({ environmentId: params.environmentId, languageCodename: params.languageCodename, itemId: params.itemId })}/element/${params.elementCodename}`;
}

function buildComponentElementLink(params: BuildComponentElementLinkParams): string {
  return `${buildKontentItemLink({
    environmentId: params.environmentId,
    languageCodename: params.languageCodename,
    itemId: params.itemId,
  })}/component/${params.contentComponentId}/element/${params.componentElementCodename}`;
}

/**
 * Builds a URL that opens a specific element within a content item in the Kontent.ai web application editor.
 * This function can handle both regular content elements and elements within content components.
 * If an element is within a component, 'contentComponentId' must be provided.
 */
export function buildKontentElementLink(data: BuildKontentElementLinkParams): string {
  return 'contentComponentId' in data
    ? buildComponentElementLink({
        environmentId: data.environmentId,
        languageCodename: data.languageCodename,
        itemId: data.itemId,
        contentComponentId: data.contentComponentId,
        componentElementCodename: data.componentElementCodename,
      })
    : buildElementLink({
        environmentId: data.environmentId,
        languageCodename: data.languageCodename,
        itemId: data.itemId,
        elementCodename: data.elementCodename,
      });
}
