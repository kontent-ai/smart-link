import { expect } from "@playwright/experimental-ct-react";
import { DefaultSdkConfigurationWithWs } from "../../components/config";
import { ComplexLayout } from "../../components/layout/ComplexLayout";
import { MultipleSmartLinks } from "../../components/layout/MultipleSmartLinks";
import { SingleSmartLink } from "../../components/layout/SingleSmartLink";
import { SmartLinkInitializer } from "../../components/SmartLinkInitializer";
import { test } from "../../helpers/withQueryTest";

const testCases = [
  [
    "Single smart link",
    <SingleSmartLink key="single-smart-link-ws" />,
    "layout-single-smart-link.png",
  ],
  [
    "Multiple smart links",
    <MultipleSmartLinks key="multiple-smart-links-ws" />,
    "layout-multiple-smart-links.png",
  ],
  [
    "Complex layout",
    <ComplexLayout key="complex-layout-ws" scrollOffset={{}} />,
    "layout-complex.png",
    { width: 1366, height: 1200 },
  ],
  [
    "Complex layout with scrollbar",
    <ComplexLayout
      key="complex-layout-with-scrollbar-ws"
      scrollOffset={{ container: [200, 0] }}
      containerStyle={{ maxHeight: "100vh", overflow: "scroll", border: "1px solid black" }}
    />,
    "layout-complex-with-scrollbar.png",
  ],
] as const;

testCases.forEach(([name, component, screenshotName, viewport]) => {
  test(name, async ({ mount, page }) => {
    if (viewport) {
      await page.setViewportSize(viewport);
    }

    await mount(
      <SmartLinkInitializer configuration={DefaultSdkConfigurationWithWs}>
        {component}
      </SmartLinkInitializer>,
    );
    await expect(page.getByTestId("root")).toHaveScreenshot(screenshotName);
  });
});
