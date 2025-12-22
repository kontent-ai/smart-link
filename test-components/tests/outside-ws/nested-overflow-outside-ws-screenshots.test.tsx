import { expect } from "@playwright/experimental-ct-react";
import { ElementPositionOffset } from "../../../src/web-components/abstract/KSLPositionedElement";
import { DefaultSdkConfigurationWithoutWs } from "../../components/config";
import { NestedOverflowComponent } from "../../components/overflow/NestedOverflowComponent";
import { SmartLinkInitializer } from "../../components/SmartLinkInitializer";
import { OverflowProperty, PositionProperty } from "../../helpers/types";
import { test } from "../../helpers/withQueryTest";

const testCases = [
  [
    "Relative container with relative scrollable inside",
    <NestedOverflowComponent
      key="nested-overflow-relative-relative-no-ws"
      containerPosition={PositionProperty.Relative}
      containerOverflow={OverflowProperty.Scroll}
      nestedPosition={PositionProperty.Relative}
      nestedOverflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [140, 0], nested: [550, 0] }}
    />,
    "nested-overflow-relative-relative.png",
  ],
  [
    "Relative container with static scrollable inside",
    <NestedOverflowComponent
      key="nested-overflow-relative-static-no-ws"
      containerPosition={PositionProperty.Relative}
      containerOverflow={OverflowProperty.Scroll}
      nestedPosition={PositionProperty.Static}
      nestedOverflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [140, 0], nested: [550, 0] }}
    />,
    "nested-overflow-relative-static.png",
  ],
  [
    "Static container with relative scrollable inside",
    <NestedOverflowComponent
      key="nested-overflow-static-relative-no-ws"
      containerPosition={PositionProperty.Static}
      containerOverflow={OverflowProperty.Scroll}
      nestedPosition={PositionProperty.Relative}
      nestedOverflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [140, 0], nested: [550, 0] }}
    />,
    "nested-overflow-static-relative.png",
  ],
  [
    "Static container with static scrollable inside",
    <NestedOverflowComponent
      key="nested-overflow-static-static-no-ws"
      containerPosition={PositionProperty.Static}
      containerOverflow={OverflowProperty.Scroll}
      nestedPosition={PositionProperty.Static}
      nestedOverflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [140, 0], nested: [650, 0] }}
    />,
    "nested-overflow-static-static.png",
  ],
] as const;

testCases.forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount, page }) => {
    await mount(
      <SmartLinkInitializer configuration={DefaultSdkConfigurationWithoutWs}>
        {component}
      </SmartLinkInitializer>,
    );

    await expect(page.getByTestId("root")).toHaveScreenshot(screenshotName);
  });
});
