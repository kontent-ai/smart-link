import { expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { test } from '../../helpers/withQueryTest';
import { SmartLinkInitializer } from '../../components/SmartLinkInitializer';
import { NestedOverflowComponent } from '../../components/overflow/NestedOverflowComponent';
import { DefaultSdkConfigurationWithoutWs } from '../../components/config';
import { OverflowProperty, PositionProperty } from '../../../.storybook/types';
import { ElementPositionOffset } from '../../../src/web-components/abstract/KSLPositionedElement';

const testCases = [
  [
    'Relative container with relative scrollable inside',
    <NestedOverflowComponent
      containerPosition={PositionProperty.Relative}
      containerOverflow={OverflowProperty.Scroll}
      nestedPosition={PositionProperty.Relative}
      nestedOverflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [140, 0], nested: [550, 0] }}
    />,
    'nested-overflow-relative-relative.png',
  ],
  [
    'Relative container with static scrollable inside',
    <NestedOverflowComponent
      containerPosition={PositionProperty.Relative}
      containerOverflow={OverflowProperty.Scroll}
      nestedPosition={PositionProperty.Static}
      nestedOverflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [140, 0], nested: [550, 0] }}
    />,
    'nested-overflow-relative-static.png',
  ],
  [
    'Static container with relative scrollable inside',
    <NestedOverflowComponent
      containerPosition={PositionProperty.Static}
      containerOverflow={OverflowProperty.Scroll}
      nestedPosition={PositionProperty.Relative}
      nestedOverflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [140, 0], nested: [550, 0] }}
    />,
    'nested-overflow-static-relative.png',
  ],
  [
    'Static container with static scrollable inside',
    <NestedOverflowComponent
      containerPosition={PositionProperty.Static}
      containerOverflow={OverflowProperty.Scroll}
      nestedPosition={PositionProperty.Static}
      nestedOverflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [140, 0], nested: [650, 0] }}
    />,
    'nested-overflow-static-static.png',
  ],
] as const;

testCases.forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount, page }) => {
    await mount(
      <SmartLinkInitializer configuration={DefaultSdkConfigurationWithoutWs}>{component}</SmartLinkInitializer>
    );

    await expect(page).toHaveScreenshot(screenshotName);
  });
});
