import { expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { test } from '../../helpers/withQueryTest';
import { SmartLinkInitializer } from '../../components/SmartLinkInitializer';
import { PositionComponent } from '../../components/position/PositionComponent';
import { DefaultSdkConfigurationWithWs } from '../../components/config';
import { PositionProperty, ElementPositionOffset } from '../../helpers/types';

const testCases = [
  [
    'Absolute smart link inside absolute container',
    <PositionComponent
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-absolute-inside-absolute.png',
  ],
  [
    'Absolute smart link inside fixed container',
    <PositionComponent
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-absolute-inside-fixed.png',
  ],
  [
    'Absolute smart link inside relative container',
    <PositionComponent
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-absolute-inside-relative.png',
  ],
  [
    'Absolute smart link inside static container',
    <PositionComponent
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-absolute-inside-static.png',
  ],
  [
    'Fixed smart link inside absolute container',
    <PositionComponent
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-fixed-inside-absolute.png',
  ],
  [
    'Fixed smart link inside fixed container',
    <PositionComponent
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-fixed-inside-fixed.png',
  ],
  [
    'Fixed smart link inside relative container',
    <PositionComponent
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-fixed-inside-relative.png',
  ],
  [
    'Fixed smart link inside static container',
    <PositionComponent
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-fixed-inside-static.png',
  ],
  [
    'Relative smart link inside absolute container',
    <PositionComponent
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-relative-inside-absolute.png',
  ],
  [
    'Relative smart link inside fixed container',
    <PositionComponent
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-relative-inside-fixed.png',
  ],
  [
    'Relative smart link inside relative container',
    <PositionComponent
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-relative-inside-relative.png',
  ],
  [
    'Relative smart link inside static container',
    <PositionComponent
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-relative-inside-static.png',
  ],
  [
    'Static smart link inside absolute container',
    <PositionComponent
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-static-inside-absolute.png',
  ],
  [
    'Static smart link inside fixed container',
    <PositionComponent
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-static-inside-fixed.png',
  ],
  [
    'Static smart link inside relative container',
    <PositionComponent
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-static-inside-relative.png',
  ],
  [
    'Static smart link inside static container',
    <PositionComponent
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-static-inside-static.png',
  ],
] as const;

testCases.forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount, page }) => {
    await mount(<SmartLinkInitializer configuration={DefaultSdkConfigurationWithWs}>{component}</SmartLinkInitializer>);
    await expect(page).toHaveScreenshot(screenshotName);
  });
});
