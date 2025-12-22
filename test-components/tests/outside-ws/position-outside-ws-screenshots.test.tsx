import { expect } from "@playwright/experimental-ct-react";
import { DefaultSdkConfigurationWithoutWs } from "../../components/config";
import { PositionComponent } from "../../components/position/PositionComponent";
import { SmartLinkInitializer } from "../../components/SmartLinkInitializer";
import { ElementPositionOffset, PositionProperty } from "../../helpers/types";
import { test } from "../../helpers/withQueryTest";

const testCases = [
  [
    "Absolute smart link inside absolute container",
    <PositionComponent
      key="position-absolute-inside-absolute-no-ws"
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-absolute-inside-absolute-no-ws.png",
  ],
  [
    "Absolute smart link inside fixed container",
    <PositionComponent
      key="position-absolute-inside-fixed-no-ws"
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-absolute-inside-fixed-no-ws.png",
  ],
  [
    "Absolute smart link inside relative container",
    <PositionComponent
      key="position-absolute-inside-relative-no-ws"
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-absolute-inside-relative-no-ws.png",
  ],
  [
    "Absolute smart link inside static container",
    <PositionComponent
      key="position-absolute-inside-static-no-ws"
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Absolute}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-absolute-inside-static-no-ws.png",
  ],
  [
    "Fixed smart link inside absolute container",
    <PositionComponent
      key="position-fixed-inside-absolute-no-ws"
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-fixed-inside-absolute-no-ws.png",
  ],
  [
    "Fixed smart link inside fixed container",
    <PositionComponent
      key="position-fixed-inside-fixed-no-ws"
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-fixed-inside-fixed-no-ws.png",
  ],
  [
    "Fixed smart link inside relative container",
    <PositionComponent
      key="position-fixed-inside-relative-no-ws"
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-fixed-inside-relative-no-ws.png",
  ],
  [
    "Fixed smart link inside static container",
    <PositionComponent
      key="position-fixed-inside-static-no-ws"
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Fixed}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-fixed-inside-static-no-ws.png",
  ],
  [
    "Relative smart link inside absolute container",
    <PositionComponent
      key="position-relative-inside-absolute-no-ws"
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-relative-inside-absolute-no-ws.png",
  ],
  [
    "Relative smart link inside fixed container",
    <PositionComponent
      key="position-relative-inside-fixed-no-ws"
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-relative-inside-fixed-no-ws.png",
  ],
  [
    "Relative smart link inside relative container",
    <PositionComponent
      key="position-relative-inside-relative-no-ws"
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-relative-inside-relative-no-ws.png",
  ],
  [
    "Relative smart link inside static container",
    <PositionComponent
      key="position-relative-inside-static-no-ws"
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Relative}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-relative-inside-static-no-ws.png",
  ],
  [
    "Static smart link inside absolute container",
    <PositionComponent
      key="position-static-inside-absolute-no-ws"
      containerPosition={PositionProperty.Absolute}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-static-inside-absolute-no-ws.png",
  ],
  [
    "Static smart link inside fixed container",
    <PositionComponent
      key="position-static-inside-fixed-no-ws"
      containerPosition={PositionProperty.Fixed}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-static-inside-fixed-no-ws.png",
  ],
  [
    "Static smart link inside relative container",
    <PositionComponent
      key="position-static-inside-relative-no-ws"
      containerPosition={PositionProperty.Relative}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-static-inside-relative-no-ws.png",
  ],
  [
    "Static smart link inside static container",
    <PositionComponent
      key="position-static-inside-static-no-ws"
      containerPosition={PositionProperty.Static}
      nestedPosition={PositionProperty.Static}
      buttonPosition={ElementPositionOffset.Bottom}
    />,
    "position-static-inside-static-no-ws.png",
  ],
] as const;

testCases.forEach(([name, component, screenshotName]) => {
  test(name, async ({ mount, page }) => {
    await mount(
      <SmartLinkInitializer configuration={DefaultSdkConfigurationWithoutWs}>
        {component}
      </SmartLinkInitializer>,
    );
    await expect(page).toHaveScreenshot(screenshotName);
  });
});
