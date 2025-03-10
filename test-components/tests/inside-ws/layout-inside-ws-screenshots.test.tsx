import { expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { test } from '../../helpers/withQueryTest';
import { SmartLinkInitializer } from '../../components/SmartLinkInitializer';
import { DefaultSdkConfigurationWithWs } from '../../components/config';
import { SingleSmartLink } from '../../components/layout/SingleSmartLink';
import { MultipleSmartLinks } from '../../components/layout/MultipleSmartLinks';
import { ComplexLayout } from '../../components/layout/ComplexLayout';

const testCases = [
  ['Single smart link', <SingleSmartLink />, 'layout-single-smart-link.png'],
  ['Multiple smart links', <MultipleSmartLinks />, 'layout-multiple-smart-links.png'],
  ['Complex layout', <ComplexLayout scrollOffset={{}} />, 'layout-complex.png', { width: 1366, height: 1200 }],
  [
    'Complex layout with scrollbar',
    <ComplexLayout
      scrollOffset={{ container: [200, 0] }}
      containerStyle={{ maxHeight: '100vh', overflow: 'scroll', border: '1px solid black' }}
    />,
    'layout-complex-with-scrollbar.png',
  ],
] as const;

testCases.forEach(([name, component, screenshotName, viewport]) => {
  test(name, async ({ mount, page }) => {
    if (viewport) {
      await page.setViewportSize(viewport);
    }

    await mount(<SmartLinkInitializer configuration={DefaultSdkConfigurationWithWs}>{component}</SmartLinkInitializer>);
    await expect(page.getByTestId('root')).toHaveScreenshot(screenshotName);
  });
});
