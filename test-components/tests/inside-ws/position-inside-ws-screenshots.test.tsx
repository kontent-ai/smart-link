import { expect } from "@playwright/experimental-ct-react";
import { DefaultSdkConfigurationWithWs } from "../../components/config";
import { PositionComponent } from "../../components/position/PositionComponent";
import { SmartLinkInitializer } from "../../components/SmartLinkInitializer";
import { ElementPositionOffset, PositionProperty } from "../../helpers/types";
import { test } from "../../helpers/withQueryTest";

const testCases = [
  [
    "Absolute smart link inside absolute container",
    <PositionComponent
      key="position-absolute-inside-absolute-ws"
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-absolute-inside-absolute.png",
  ],
  [
    "Absolute smart link inside fixed container",
    <PositionComponent
      key="position-absolute-inside-fixed-ws"
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-absolute-inside-fixed.png",
  ],
  [
    "Absolute smart link inside relative container",
    <PositionComponent
      key="position-absolute-inside-relative-ws"
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-absolute-inside-relative.png",
  ],
  [
    "Absolute smart link inside static container",
    <PositionComponent
      key="position-absolute-inside-static-ws"
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-absolute-inside-static.png",
  ],
  [
    "Fixed smart link inside absolute container",
    <PositionComponent
      key="position-fixed-inside-absolute-ws"
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-fixed-inside-absolute.png",
  ],
  [
    "Fixed smart link inside fixed container",
    <PositionComponent
      key="position-fixed-inside-fixed-ws"
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-fixed-inside-fixed.png",
  ],
  [
    "Fixed smart link inside relative container",
    <PositionComponent
      key="position-fixed-inside-relative-ws"
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-fixed-inside-relative.png",
  ],
  [
    "Fixed smart link inside static container",
    <PositionComponent
      key="position-fixed-inside-static-ws"
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-fixed-inside-static.png",
  ],
  [
    "Relative smart link inside absolute container",
    <PositionComponent
      key="position-relative-inside-absolute-ws"
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-relative-inside-absolute.png",
  ],
  [
    "Relative smart link inside fixed container",
    <PositionComponent
      key="position-relative-inside-fixed-ws"
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-relative-inside-fixed.png",
  ],
  [
    "Relative smart link inside relative container",
    <PositionComponent
      key="position-relative-inside-relative-ws"
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-relative-inside-relative.png",
  ],
  [
    "Relative smart link inside static container",
    <PositionComponent
      key="position-relative-inside-static-ws"
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-relative-inside-static.png",
  ],
  [
    "Static smart link inside absolute container",
    <PositionComponent
      key="position-static-inside-absolute-ws"
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-static-inside-absolute.png",
  ],
  [
    "Static smart link inside fixed container",
    <PositionComponent
      key="position-static-inside-fixed-ws"
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-static-inside-fixed.png",
  ],
  [
    "Static smart link inside relative container",
    <PositionComponent
      key="position-static-inside-relative-ws"
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-static-inside-relative.png",
  ],
  [
    "Static smart link inside static container",
    <PositionComponent
      key="position-static-inside-static-ws"
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-static-inside-static.png",
  ],
] as const;

testCases.forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount, page }) => {
    await mount(
      <SmartLinkInitializer configuration={DefaultSdkConfigurationWithWs}>
        {component}
      </SmartLinkInitializer>,
    );
    await expect(page).toHaveScreenshot(screenshotName);
  });
});
