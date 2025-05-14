import { expect, it, describe } from 'vitest';
import {
  validateContentItemClickEditMessageData,
  validateElementClickMessageData,
  validateContentComponentClickMessageData,
  validateAddInitialMessageData,
  validateAddActionMessageData,
} from '../../src/utils/validation';
import {
  AddButtonAction,
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  IContentComponentClickedMessageData,
  IAddButtonInitialMessageData,
  IAddActionMessageData,
  InsertPositionPlacement,
} from '../../src/lib/IFrameCommunicatorTypes';

describe('validateContentItemClickEditMessageData', () => {
  it('should return true for valid data', () => {
    const validData: Partial<IContentItemClickedMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
      itemId: 'test-item',
    };

    expect(validateContentItemClickEditMessageData(validData)).toBe(true);
  });

  it('should return false for invalid data', () => {
    const invalidData: Partial<IContentItemClickedMessageData> = {
      projectId: 'test-project',
    };

    expect(validateContentItemClickEditMessageData(invalidData)).toBe(false);
  });
});

describe('validateElementClickMessageData', () => {
  it('should return true for valid data', () => {
    const validData: Partial<IElementClickedMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
      itemId: 'test-item',
      elementCodename: 'test-element',
    };

    expect(validateElementClickMessageData(validData)).toBe(true);
  });

  it('should return false when elementCodename is missing', () => {
    const invalidData: Partial<IElementClickedMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
      itemId: 'test-item',
    };

    expect(validateElementClickMessageData(invalidData)).toBe(false);
  });
});

describe('validateContentComponentClickMessageData', () => {
  it('should return true for valid data', () => {
    const validData: Partial<IContentComponentClickedMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
      itemId: 'test-item',
      contentComponentId: 'test-component',
    };

    expect(validateContentComponentClickMessageData(validData)).toBe(true);
  });

  it('should return false when contentComponentId is missing', () => {
    const invalidData: Partial<IContentComponentClickedMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
      itemId: 'test-item',
    };

    expect(validateContentComponentClickMessageData(invalidData)).toBe(false);
  });
});

describe('validateAddInitialMessageData', () => {
  it('should return true for valid data', () => {
    const validData: Partial<IAddButtonInitialMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
      itemId: 'test-item',
      elementCodename: 'test-element',
      insertPosition: {
        placement: InsertPositionPlacement.After,
        targetId: 'target-1',
      },
    };

    expect(validateAddInitialMessageData(validData)).toBe(true);
  });

  it('should return false when required fields are missing', () => {
    const invalidData: Partial<IAddButtonInitialMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
    };

    expect(validateAddInitialMessageData(invalidData)).toBe(false);
  });
});

describe('validateAddActionMessageData', () => {
  it('should return true for valid data', () => {
    const validData: Partial<IAddActionMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
      itemId: 'test-item',
      elementCodename: 'test-element',
      insertPosition: {
        placement: InsertPositionPlacement.After,
        targetId: 'target-1',
      },
      action: AddButtonAction.CreateComponent,
    };

    expect(validateAddActionMessageData(validData)).toBe(true);
  });

  it('should return false when action is missing', () => {
    const invalidData: Partial<IAddActionMessageData> = {
      projectId: 'test-project',
      languageCodename: 'en-US',
      itemId: 'test-item',
      elementCodename: 'test-element',
      insertPosition: {
        placement: InsertPositionPlacement.After,
        targetId: 'target-1',
      },
    };

    expect(validateAddActionMessageData(invalidData)).toBe(false);
  });
});
