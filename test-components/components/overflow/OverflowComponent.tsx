import type { ElementPositionOffset } from "../../../src/web-components/abstract/KSLPositionedElement";
import type { OverflowProperty, PositionProperty } from "../../helpers/types";
import { type ScrollOffsets, useScroll } from "../../helpers/useScroll";

type OverflowProps = {
  overflow: OverflowProperty;
  position: PositionProperty;
  buttonPosition: ElementPositionOffset;
  scrollOffsets: ScrollOffsets;
};

type OverflowTextProps = {
  buttonPosition: ElementPositionOffset;
};

const OverflowText: React.FC<OverflowTextProps> = ({ buttonPosition }) => (
  <div
    data-kontent-element-codename="e"
    style={{ width: "800px" }}
    data-kontent-add-button="true"
    data-kontent-add-button-render-position={buttonPosition}
  >
    {Array(10)
      .fill(
        "This text node overflows its parent. This text node overflows its parent. This text node overflows its parent. ",
      )
      .join("")}
  </div>
);

export const OverflowComponent: React.FC<OverflowProps> = ({
  overflow,
  position,
  buttonPosition,
  scrollOffsets = {},
}) => {
  useScroll(scrollOffsets);
  return (
    <div
      id="container"
      className="bg-light p-3 border border-secondary"
      style={{
        position,
        overflow,
        maxHeight: "390px",
        maxWidth: "390px",
      }}
      data-kontent-environment-id="p"
      data-kontent-language-codename="l"
      data-kontent-item-id="i"
      data-kontent-component-id="c"
    >
      <OverflowText buttonPosition={buttonPosition} />
      <OverflowText buttonPosition={buttonPosition} />
    </div>
  );
};

export default OverflowComponent;
