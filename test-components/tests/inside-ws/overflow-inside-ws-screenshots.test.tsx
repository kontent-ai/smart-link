import { expect } from "@playwright/experimental-ct-react";
import { ElementPositionOffset } from "../../../src/web-components/abstract/KSLPositionedElement";
import { DefaultSdkConfigurationWithWs } from "../../components/config";
import { OverflowComponent } from "../../components/overflow/OverflowComponent";
import { SmartLinkInitializer } from "../../components/SmartLinkInitializer";
import { OverflowProperty, PositionProperty } from "../../helpers/types";
import { test } from "../../helpers/withQueryTest";

const testCases = [
  [
    "Fixed container with hidden overflow",
    <OverflowComponent
      key="overflow-fixed-hidden-ws"
      position={PositionProperty.Fixed}
      overflow={OverflowProperty.Hidden}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-fixed-hidden.png",
  ],
  [
    "Fixed container with scrollbars",
    <OverflowComponent
      key="overflow-fixed-scroll-ws"
      position={PositionProperty.Fixed}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-fixed-scroll.png",
  ],
  [
    "Fixed container with scrollbars with offset",
    <OverflowComponent
      key="overflow-fixed-scroll-offset-ws"
      position={PositionProperty.Fixed}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [150, 800] }}
    />,
    "overflow-fixed-scroll-offset.png",
  ],
  [
    "Fixed container with visible overflow",
    <OverflowComponent
      key="overflow-fixed-visible-ws"
      position={PositionProperty.Fixed}
      overflow={OverflowProperty.Visible}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-fixed-visible.png",
  ],
  [
    "Relative container with hidden overflow",
    <OverflowComponent
      key="overflow-relative-hidden-ws"
      position={PositionProperty.Relative}
      overflow={OverflowProperty.Hidden}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-relative-hidden.png",
  ],
  [
    "Relative container with scrollbars",
    <OverflowComponent
      key="overflow-relative-scroll-ws"
      position={PositionProperty.Relative}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-relative-scroll.png",
  ],
  [
    "Relative container with scrollbars with offset",
    <OverflowComponent
      key="overflow-relative-scroll-offset-ws"
      position={PositionProperty.Relative}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [150, 800] }}
    />,
    "overflow-relative-scroll-offset.png",
  ],
  [
    "Relative container with visible overflow",
    <OverflowComponent
      key="overflow-relative-visible-ws"
      position={PositionProperty.Relative}
      overflow={OverflowProperty.Visible}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-relative-visible.png",
  ],
  [
    "Static container with hidden overflow",
    <OverflowComponent
      key="overflow-static-hidden-ws"
      position={PositionProperty.Static}
      overflow={OverflowProperty.Hidden}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-static-hidden.png",
  ],
  [
    "Static container with scrollbars",
    <OverflowComponent
      key="overflow-static-scroll-ws"
      position={PositionProperty.Static}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-static-scroll.png",
  ],
  [
    "Static container with scrollbars with offset",
    <OverflowComponent
      key="overflow-static-scroll-offset-ws"
      position={PositionProperty.Static}
      overflow={OverflowProperty.Scroll}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{ container: [150, 800] }}
    />,
    "overflow-static-scroll-offset.png",
  ],
  [
    "Static container with visible overflow",
    <OverflowComponent
      key="overflow-static-visible-ws"
      position={PositionProperty.Static}
      overflow={OverflowProperty.Visible}
      buttonPosition={ElementPositionOffset.Bottom}
      scrollOffsets={{}}
    />,
    "overflow-static-visible.png",
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
