import { expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { test } from '../helpers/withQueryTest';
import { SeparateNodeAddition } from '../components/edge-cases/SeparateNodeAddition';
import { SmartLinkInitializer } from '../components/SmartLinkInitializer';
import { LongElement } from '../components/edge-cases/LongElement';
import { DefaultSdkConfigurationWithWs } from '../components/config';

(
  [
    ['initialize node after smartlink', <SeparateNodeAddition />, 'edge-case-initialize-node-after-smartlink.png'],
    ['Long element', <LongElement />, 'edge-case-long-element.png'],
  ] as const
).forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount, page }) => {
    await mount(<SmartLinkInitializer configuration={DefaultSdkConfigurationWithWs}>{component}</SmartLinkInitializer>);
    await expect(page.getByTestId('root')).toHaveScreenshot(screenshotName);
  });
});
