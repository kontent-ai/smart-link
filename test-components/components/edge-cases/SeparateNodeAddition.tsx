import React, { useEffect, useState } from 'react';

export const SeparateNodeAddition: React.FC = () => {
  const [isButtonMounted, setIsButtonMounted] = useState(false);

  useEffect(() => {
    setIsButtonMounted(true);
  }, []);

  return (
    <div id="test-html-container">
      {isButtonMounted && (
        <button
          className="btn btn-info"
          data-kontent-project-id="p"
          data-kontent-language-codename="l"
          data-kontent-item-id="i"
          data-kontent-element-codename="e"
        >
          Button with smart link
        </button>
      )}
    </div>
  );
};

SeparateNodeAddition.displayName = 'SeparateNodeAddition';
