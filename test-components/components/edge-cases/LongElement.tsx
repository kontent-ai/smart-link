import React from 'react';

export const LongElement: React.FC = () => {
  const longText = Array(20).fill('This is a very long element that has a smart link rendered around it. ').join('');

  return (
    <div
      className="border border-secondary bg-light"
      data-kontent-project-id="p"
      data-kontent-language-codename="l"
      data-kontent-item-id="i"
    >
      <div className="p-4" data-kontent-component-id="c">
        <div data-kontent-element-codename="e">{longText}</div>
      </div>
    </div>
  );
};

LongElement.displayName = 'LongElement';
