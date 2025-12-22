import { expect } from "@playwright/experimental-ct-react";
import { DefaultSdkConfigurationWithWs } from "../components/config";
import { SmartLinkInitializer } from "../components/SmartLinkInitializer";
import { SmartLinkOnTable } from "../components/table/SmartLinkOnTable";
import { test } from "../helpers/withQueryTest";

(
  [
    [
      "Smart link on table",
      <SmartLinkOnTable key="smart-link-on-table" tableSmartLink={true} />,
      "table-smart-link-on-table.png",
    ],
    [
      "Smart link on table cell",
      <SmartLinkOnTable key="smart-link-on-table-cell" tableCellSmartLink={true} />,
      "table-smart-link-on-table-cell.png",
    ],
    [
      "Smart link inside table cell",
      <SmartLinkOnTable key="smart-link-inside-table-cell" tableCellContentSmartLink={true} />,
      "table-smart-link-inside-table-cell.png",
    ],
    [
      "Multiple smart links inside table",
      <SmartLinkOnTable
        key="multiple-smart-links-inside-table"
        tableCellContentSmartLink={true}
        tableCellSmartLink={true}
        tableSmartLink={true}
      />,
      "table-multiple-smart-links.png",
    ],
  ] as const
).forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount, page }) => {
    await mount(
      <SmartLinkInitializer configuration={DefaultSdkConfigurationWithWs}>
        {component}
      </SmartLinkInitializer>,
    );
    await expect(page.getByTestId("root")).toHaveScreenshot(screenshotName);
  });
});
