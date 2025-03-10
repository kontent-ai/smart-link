import { expect } from '@playwright/experimental-ct-react';
import React from 'react';
import { test } from '../helpers/withQueryTest';
import { SmartLinkInitializer } from '../components/SmartLinkInitializer';
import { SmartLinkOnTable } from '../components/table/SmartLinkOnTable';
import { DefaultSdkConfigurationWithWs } from '../components/config';

(
  [
    ['Smart link on table', <SmartLinkOnTable tableSmartLink={true} />, 'table-smart-link-on-table.png'],
    ['Smart link on table cell', <SmartLinkOnTable tableCellSmartLink={true} />, 'table-smart-link-on-table-cell.png'],
    [
      'Smart link inside table cell',
      <SmartLinkOnTable tableCellContentSmartLink={true} />,
      'table-smart-link-inside-table-cell.png',
    ],
    [
      'Multiple smart links inside table',
      <SmartLinkOnTable tableCellContentSmartLink={true} tableCellSmartLink={true} tableSmartLink={true} />,
      'table-multiple-smart-links.png',
    ],
  ] as const
).forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount, page }) => {
    await mount(<SmartLinkInitializer configuration={DefaultSdkConfigurationWithWs}>{component}</SmartLinkInitializer>);
    await expect(page.getByTestId('root')).toHaveScreenshot(screenshotName);
  });
});
