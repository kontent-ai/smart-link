import { useEffect, useState } from "react";

export const SeparateNodeAddition: React.FC = () => {
  const [isButtonMounted, setIsButtonMounted] = useState(false);

  useEffect(() => {
    setIsButtonMounted(true);
  }, []);

  return (
    <div id="test-html-container">
      {isButtonMounted ? (
        <button
          type="button"
          className="btn btn-info"
          data-kontent-environment-id="p"
          data-kontent-language-codename="l"
          data-kontent-item-id="i"
          data-kontent-element-codename="e"
        >
          Button with smart link
        </button>
      ) : null}
    </div>
  );
};

SeparateNodeAddition.displayName = "SeparateNodeAddition";
