import { expect } from "@playwright/experimental-ct-react";
import { DefaultSdkConfigurationWithWs } from "../components/config";
import { LongElement } from "../components/edge-cases/LongElement";
import { SeparateNodeAddition } from "../components/edge-cases/SeparateNodeAddition";
import { SmartLinkInitializer } from "../components/SmartLinkInitializer";
import { test } from "../helpers/withQueryTest";

(
  [
    [
      "initialize node after smartlink",
      <SeparateNodeAddition key="initialize-node-after-smartlink" />,
      "edge-case-initialize-node-after-smartlink.png",
    ],
    ["Long element", <LongElement key="long-element" />, "edge-case-long-element.png"],
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
