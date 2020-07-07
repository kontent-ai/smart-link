import { IElementClickMessageData } from '../lib/IFrameCommunicator';

export function validateElementClickMessageData(
  data: Partial<IElementClickMessageData>
): data is IElementClickMessageData {
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

  if (!data.elementCodename) {
    errors.push('Warning: element codename is required to handle element click.');
  }

  errors.forEach((error: string) => {
    console.error(error);
  });

  return errors.length === 0;
}
