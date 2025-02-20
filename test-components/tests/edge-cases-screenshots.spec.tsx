import { expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { test } from '../helpers/withQueryTest';
import { SeparateNodeAddition } from '../components/edge-cases/SeparateNodeAddition';
import { SmartLinkInitializer } from '../components/SmartLinkInitializer';
import { LongElement } from '../components/edge-cases/LongElement';

(
  [
    ['initialize node after smartlink', <SeparateNodeAddition />, 'edge-case-initialize-node-after-smartlink.png'],
    ['Long element', <LongElement />, 'edge-case-long-element.png'],
  ] as const
).forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount }) => {
    const mountedComponent = await mount(<SmartLinkInitializer>{component}</SmartLinkInitializer>);
    await expect(mountedComponent).toHaveScreenshot(screenshotName);
  });
});
