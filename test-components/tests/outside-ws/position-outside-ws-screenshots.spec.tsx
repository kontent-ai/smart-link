import { expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { test } from '../../helpers/withQueryTest';
import { SmartLinkInitializer } from '../../components/SmartLinkInitializer';
import { PositionComponent } from '../../components/position/PositionComponent';
import { DefaultSdkConfigurationWithoutWs } from '../../components/config';
import { PositionProperty, ElementPositionOffset } from '../../helpers/types';

const testCases = [
  [
    'Absolute smart link inside absolute container',
    <PositionComponent
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-absolute-inside-absolute-no-ws.png',
  ],
  [
    'Absolute smart link inside fixed container',
    <PositionComponent
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-absolute-inside-fixed-no-ws.png',
  ],
  [
    'Absolute smart link inside relative container',
    <PositionComponent
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-absolute-inside-relative-no-ws.png',
  ],
  [
    'Absolute smart link inside static container',
    <PositionComponent
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-absolute-inside-static-no-ws.png',
  ],
  [
    'Fixed smart link inside absolute container',
    <PositionComponent
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-fixed-inside-absolute-no-ws.png',
  ],
  [
    'Fixed smart link inside fixed container',
    <PositionComponent
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-fixed-inside-fixed-no-ws.png',
  ],
  [
    'Fixed smart link inside relative container',
    <PositionComponent
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-fixed-inside-relative-no-ws.png',
  ],
  [
    'Fixed smart link inside static container',
    <PositionComponent
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-fixed-inside-static-no-ws.png',
  ],
  [
    'Relative smart link inside absolute container',
    <PositionComponent
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-relative-inside-absolute-no-ws.png',
  ],
  [
    'Relative smart link inside fixed container',
    <PositionComponent
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-relative-inside-fixed-no-ws.png',
  ],
  [
    'Relative smart link inside relative container',
    <PositionComponent
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-relative-inside-relative-no-ws.png',
  ],
  [
    'Relative smart link inside static container',
    <PositionComponent
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-relative-inside-static-no-ws.png',
  ],
  [
    'Static smart link inside absolute container',
    <PositionComponent
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-static-inside-absolute-no-ws.png',
  ],
  [
    'Static smart link inside fixed container',
    <PositionComponent
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-static-inside-fixed-no-ws.png',
  ],
  [
    'Static smart link inside relative container',
    <PositionComponent
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-static-inside-relative-no-ws.png',
  ],
  [
    'Static smart link inside static container',
    <PositionComponent
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    'position-static-inside-static-no-ws.png',
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
