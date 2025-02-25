import { expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { test } from '../../helpers/withQueryTest';
import { SmartLinkInitializer } from '../../components/SmartLinkInitializer';
import { OverflowComponent } from '../../components/overflow/OverflowComponent';
import { DefaultSdkConfigurationWithoutWs } from '../../components/config';
import { ElementPositionOffset } from '../../../src/web-components/abstract/KSLPositionedElement';
import { PositionProperty, OverflowProperty } from '../../helpers/types';

const testCases = [
  [
    'Fixed container with hidden overflow',
    <OverflowComponent
      position={PositionProperty.Fixed}
      overflow={OverflowProperty.Hidden}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-fixed-hidden.png',
  ],
  [
    'Fixed container with scrollbars',
    <OverflowComponent
      position={PositionProperty.Fixed}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-fixed-scroll.png',
  ],
  [
    'Fixed container with scrollbars with offset',
    <OverflowComponent
      position={PositionProperty.Fixed}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [150, 800] }}
    />,
    'overflow-fixed-scroll-offset.png',
  ],
  [
    'Fixed container with visible overflow',
    <OverflowComponent
      position={PositionProperty.Fixed}
      overflow={OverflowProperty.Visible}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-fixed-visible.png',
  ],
  [
    'Relative container with hidden overflow',
    <OverflowComponent
      position={PositionProperty.Relative}
      overflow={OverflowProperty.Hidden}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-relative-hidden.png',
  ],
  [
    'Relative container with scrollbars',
    <OverflowComponent
      position={PositionProperty.Relative}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-relative-scroll.png',
  ],
  [
    'Relative container with scrollbars with offset',
    <OverflowComponent
      position={PositionProperty.Relative}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [150, 800] }}
    />,
    'overflow-relative-scroll-offset.png',
  ],
  [
    'Relative container with visible overflow',
    <OverflowComponent
      position={PositionProperty.Relative}
      overflow={OverflowProperty.Visible}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-relative-visible.png',
  ],
  [
    'Static container with hidden overflow',
    <OverflowComponent
      position={PositionProperty.Static}
      overflow={OverflowProperty.Hidden}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-static-hidden.png',
  ],
  [
    'Static container with scrollbars',
    <OverflowComponent
      position={PositionProperty.Static}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-static-scroll.png',
  ],
  [
    'Static container with scrollbars with offset',
    <OverflowComponent
      position={PositionProperty.Static}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [150, 800] }}
    />,
    'overflow-static-scroll-offset.png',
  ],
  [
    'Static container with visible overflow',
    <OverflowComponent
      position={PositionProperty.Static}
      overflow={OverflowProperty.Visible}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    'overflow-static-visible.png',
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
