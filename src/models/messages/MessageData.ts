import { AddButtonAction, AddButtonElementType, AddButtonPermission, AddButtonPermissionCheckResult } from './MessageEnums';

export interface IAddButtonPermissionsServerModel {
  readonly elementType: AddButtonElementType;
  readonly isParentPublished: boolean;
  readonly permissions: ReadonlyMap<AddButtonPermission, AddButtonPermissionCheckResult>;
}

export interface ISmartLinkSDKSupportedFeatures {
  readonly refreshHandler: boolean;
}

export interface IInitializedMessageData {
  readonly enabled: boolean;
  readonly languageCodename: string | null;
  readonly projectId: string | null;
  readonly supportedFeatures?: ISmartLinkSDKSupportedFeatures;
}

export interface IMessageBaseData {
  readonly itemId: string;
  readonly languageCodename: string;
  readonly projectId: string;
}

export interface IAddButtonInitialMessageData extends IMessageBaseData {
  readonly contentComponentId?: string;
  readonly elementCodename: string;
  readonly insertPosition: InsertPosition;
}

export interface IAddButtonActionMessageData extends IAddButtonInitialMessageData {
  readonly action: AddButtonAction;
}

export type IEditButtonContentItemClickedMessageData = IMessageBaseData;

export interface IEditButtonContentComponentClickedMessageData extends IEditButtonContentItemClickedMessageData {
  readonly contentComponentId: string;
}

export interface IEditButtonElementClickedMessageData extends IEditButtonContentItemClickedMessageData {
  readonly contentComponentId?: string;
  readonly elementCodename: string;
}

export interface IReloadPreviewMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly updatedItemCodename: string;
}

export interface IHighlightStatusMessageData {
  readonly enabled: boolean;
}
