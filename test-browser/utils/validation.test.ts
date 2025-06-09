import { expect, it, describe } from 'vitest';
import { validateAddInitialMessageData, validateEditButtonMessageData } from '../../src/utils/messageValidation';
import { InsertPositionPlacement } from '../../src/lib/IFrameCommunicatorTypes';
import { ParseResult } from '../../src/utils/dataAttributes/parser';

// Helper to create mock ParseResult objects
const createMockParseResult = (parsed: Partial<ParseResult['parsed']>): ParseResult => ({
  parsed,
  debugData: [],
});

// Helper to create mock configuration
const mockConfig = {
  languageCodename: 'en-US',
  environmentId: '  test-project',
};

describe('validateEditButtonMessageData', () => {
  it('should return contentItem type for valid content item data', () => {
    const data = createMockParseResult({
      itemId: 'test-item',
      languageCodename: 'en-US',
      environmentId: 'test-project',
    });

    const result = validateEditButtonMessageData(data, mockConfig);

    expect(result.type).toBe('contentItem');
    if (result.type === 'contentItem') {
      expect(result.data.itemId).toBe('test-item');
      expect(result.data.languageCodename).toBe('en-US');
      expect(result.data.projectId).toBe('test-project');
    }
  });

  it('should return element type for valid element data', () => {
    const data = createMockParseResult({
      itemId: 'test-item',
      elementCodename: 'test-element',
      languageCodename: 'en-US',
      environmentId: 'test-project',
    });

    const result = validateEditButtonMessageData(data, mockConfig);

    expect(result.type).toBe('element');
    if (result.type === 'element') {
      expect(result.data.itemId).toBe('test-item');
      expect(result.data.elementCodename).toBe('test-element');
      expect(result.data.languageCodename).toBe('en-US');
      expect(result.data.projectId).toBe('test-project');
    }
  });

  it('should return contentComponent type for valid content component data', () => {
    const data = createMockParseResult({
      itemId: 'test-item',
      contentComponentId: 'test-component',
      languageCodename: 'en-US',
      environmentId: 'test-project',
    });

    const result = validateEditButtonMessageData(data, mockConfig);

    expect(result.type).toBe('contentComponent');
    if (result.type === 'contentComponent') {
      expect(result.data.itemId).toBe('test-item');
      expect(result.data.contentComponentId).toBe('test-component');
      expect(result.data.languageCodename).toBe('en-US');
      expect(result.data.projectId).toBe('test-project');
    }
  });

  it('should return error type for missing required data', () => {
    const data = createMockParseResult({
      languageCodename: 'en-US',
    });

    const result = validateEditButtonMessageData(data, mockConfig);

    expect(result.type).toBe('error');
    if (result.type === 'error') {
      expect(result.missing).toContain('itemId');
    }
  });

  it('should use configuration defaults when data attributes are missing', () => {
    const data = createMockParseResult({
      itemId: 'test-item',
    });

    const config = {
      languageCodename: 'default-lang',
      environmentId: 'default-env',
    };

    const result = validateEditButtonMessageData(data, config);

    expect(result.type).toBe('contentItem');
    if (result.type === 'contentItem') {
      expect(result.data.languageCodename).toBe('default-lang');
      expect(result.data.projectId).toBe('default-env');
      expect(result.data.itemId).toBe('test-item');
    }
  });
});

describe('validateAddInitialMessageData', () => {
  it('should return success for valid data with placement after', () => {
    const data = createMockParseResult({
      itemId: 'test-item',
      elementCodename: 'test-element',
      placement: 'after',
      targetId: 'target-1',
      languageCodename: 'en-US',
      environmentId: 'test-project',
    });

    const result = validateAddInitialMessageData(data, mockConfig);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.itemId).toBe('test-item');
      expect(result.data.elementCodename).toBe('test-element');
      expect(result.data.insertPosition.placement).toBe(InsertPositionPlacement.After);
      if ('targetId' in result.data.insertPosition) {
        expect(result.data.insertPosition.targetId).toBe('target-1');
      }
    }
  });

  it('should return success for valid data with placement end', () => {
    const data = createMockParseResult({
      itemId: 'test-item',
      elementCodename: 'test-element',
      placement: 'end',
      languageCodename: 'en-US',
      environmentId: 'test-project',
    });

    const result = validateAddInitialMessageData(data, mockConfig);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.insertPosition.placement).toBe(InsertPositionPlacement.End);
    }
  });

  it('should return failure when required fields are missing', () => {
    const data = createMockParseResult({
      languageCodename: 'en-US',
      environmentId: 'test-project',
    });

    const result = validateAddInitialMessageData(data, mockConfig);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.missing).toContain('itemId');
      expect(result.missing).toContain('elementCodename');
    }
  });

  it('should return failure when targetId is missing for after/before placement', () => {
    const data = createMockParseResult({
      itemId: 'test-item',
      elementCodename: 'test-element',
      placement: 'after',
      languageCodename: 'en-US',
      environmentId: 'test-project',
    });

    const result = validateAddInitialMessageData(data, mockConfig);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.missing).toContain('targetId');
    }
  });

  it('should include contentComponentId when provided', () => {
    const data = createMockParseResult({
      itemId: 'test-item',
      elementCodename: 'test-element',
      contentComponentId: 'test-component',
      placement: 'end',
      languageCodename: 'en-US',
      environmentId: 'test-project',
    });

    const result = validateAddInitialMessageData(data, mockConfig);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.contentComponentId).toBe('test-component');
    }
  });
});
