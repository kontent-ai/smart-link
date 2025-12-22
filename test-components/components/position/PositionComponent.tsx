import type { ElementPositionOffset, PositionProperty } from "../../helpers/types";

export type PositionComponentProps = {
  containerPosition: PositionProperty;
  nestedPosition: PositionProperty;
  buttonPosition: ElementPositionOffset;
};

export const PositionComponent: React.FC<PositionComponentProps> = ({
  containerPosition,
  nestedPosition,
  buttonPosition,
}) => {
  return (
    <div
      className="bg-secondary"
      style={{
        position: containerPosition,
        top: "20px",
        left: "20px",
        width: "400px",
        height: "400px",
      }}
      data-kontent-environment-id="p"
      data-kontent-language-codename="l"
    >
      <div
        data-kontent-item-id="i"
        data-kontent-component-id="c"
        className="bg-light p-4"
        style={{
          position: nestedPosition,
          top: "40px",
          left: "40px",
          width: "300px",
          height: "300px",
        }}
      >
        <div
          data-kontent-element-codename="e"
          data-kontent-add-button="true"
          data-kontent-add-button-render-position={buttonPosition}
        >
          This text block has 'position: {nestedPosition}' and it is located inside an element with
          '{containerPosition}' position.
        </div>
      </div>
    </div>
  );
};
