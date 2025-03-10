import React from 'react';
import { ElementPositionOffset } from '../../../src/web-components/abstract/KSLPositionedElement';
import { ScrollOffsets, useScroll } from '../../helpers/useScroll';
import { OverflowProperty, PositionProperty } from '../../helpers/types';

type NestedOverflowProps = {
  containerOverflow: OverflowProperty;
  containerPosition: PositionProperty;
  nestedOverflow: OverflowProperty;
  nestedPosition: PositionProperty;
  buttonPosition: ElementPositionOffset;
  scrollOffsets: ScrollOffsets;
};

export const NestedOverflowComponent: React.FC<NestedOverflowProps> = ({
  containerOverflow,
  containerPosition,
  nestedOverflow,
  nestedPosition,
  buttonPosition,
  scrollOffsets = {},
}) => {
  useScroll(scrollOffsets);
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
      data-testid="container"
      data-kontent-item-id="i"
    >
      <div
        id="nested"
        data-testid="nested"
        className="bg-white p-3 border border-info"
        data-kontent-component-id="c"
        style={{
          position: nestedPosition,
          overflow: nestedOverflow,
          maxHeight: '400px',
        }}
      >
        <div
          data-kontent-element-codename="e"
          data-kontent-add-button="true"
          data-kontent-add-button-render-position={buttonPosition}
          style={{ width: '100%' }}
        >
          {`This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.`}
        </div>
        <div
          data-kontent-element-codename="e"
          data-kontent-add-button="true"
          data-kontent-add-button-render-position={buttonPosition}
        >
          {`This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.`}
        </div>
      </div>
      <div
        data-kontent-element-codename="e"
        data-kontent-add-button="true"
        data-kontent-add-button-render-position={buttonPosition}
      >
        {`This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
          This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.`}
      </div>
    </div>
  );
};

export default NestedOverflowComponent;
