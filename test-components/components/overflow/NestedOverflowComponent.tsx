import React from 'react';
import { OverflowProperty, PositionProperty } from '../../../.storybook/types';
import { ElementPositionOffset } from '../../../src/web-components/abstract/KSLPositionedElement';

type NestedOverflowProps = {
  containerOverflow: OverflowProperty;
  containerPosition: PositionProperty;
  nestedOverflow: OverflowProperty;
  nestedPosition: PositionProperty;
  buttonPosition: ElementPositionOffset;
};

type OverflowTextProps = {
  buttonPosition: ElementPositionOffset;
};

const OverflowText: React.FC<OverflowTextProps> = ({ buttonPosition }) => (
  <div
    data-kontent-element-codename="e"
    style={{ width: '800px' }}
    data-kontent-add-button="true"
    data-kontent-add-button-render-position={buttonPosition}
  >
    {Array(10)
      .fill(
        'This text node overflows its parent. This text node overflows its parent. This text node overflows its parent. '
      )
      .join('')}
  </div>
);

export const NestedOverflowComponent: React.FC<NestedOverflowProps> = ({
  containerOverflow,
  containerPosition,
  nestedOverflow,
  nestedPosition,
  buttonPosition,
}) => {
  return (
    <div
      id="container"
      className="bg-light p-3 border border-secondary"
      style={{
        position: containerPosition,
        overflow: containerOverflow,
        maxHeight: '390px',
        maxWidth: '390px',
      }}
      data-kontent-project-id="p"
      data-kontent-language-codename="l"
      data-kontent-item-id="i"
    >
      <div
        id="nested"
        className="bg-white p-3 border border-info"
        data-kontent-component-id="c"
        style={{
          position: nestedPosition,
          overflow: nestedOverflow,
          maxHeight: '400px',
        }}
      >
        <OverflowText buttonPosition={buttonPosition} />
        <OverflowText buttonPosition={buttonPosition} />
      </div>
      <OverflowText buttonPosition={buttonPosition} />
    </div>
  );
};

export default NestedOverflowComponent;
