export type SdkConfiguration = {
  queryParam: string;
  forceWebSpotlightMode: boolean;
};

export const DefaultSdkConfigurationWithWs: SdkConfiguration = {
  queryParam: "kontent-smart-link-enabled",
  forceWebSpotlightMode: true,
};

export const DefaultSdkConfigurationWithoutWs: SdkConfiguration = {
  queryParam: "kontent-smart-link-enabled",
  forceWebSpotlightMode: false,
};
