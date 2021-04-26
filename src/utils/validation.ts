import { IContentItemClickedMessageData, IElementClickedMessageData } from '../lib/IFrameCommunicatorTypes';

const displayErrorsInConsole = (errors: string[]): void => {
  errors.forEach((error: string) => {
    console.error(error);
  });
};

export function validateContentItemClickEditMessageData(
  data: Partial<IContentItemClickedMessageData>
): data is IContentItemClickedMessageData {
  const errors: string[] = [];

  if (!data.projectId) {
    errors.push('Warning: project ID is required to handle element click.');
  }

  if (!data.languageCodename) {
    errors.push('Warning: language codename is required to handle element click.');
  }

  if (!data.itemId) {
    errors.push('Warning: item ID is required to handle element click.');
  }

  displayErrorsInConsole(errors);

  return errors.length === 0;
}

export function validateElementClickMessageData(
  data: Partial<IElementClickedMessageData>
): data is IElementClickedMessageData {
  if (!data.elementCodename) {
    console.error('Warning: element codename is required to handle element click.');
    return false;
  }

  return validateContentItemClickEditMessageData(data);
}

export function validateDummyElementMessageData(data: any): any {
  const errors: string[] = [];

  if (!data) {
    errors.push('Data missing');
  }

  return errors.length === 0;
}
