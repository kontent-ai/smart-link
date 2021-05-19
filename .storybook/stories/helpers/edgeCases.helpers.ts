import { useEffect } from '@storybook/client-api';

export const SeparateNodeAddition = () => {
  useEffect(() => {
    const container = document.querySelector('#test-html-container');
    if (container) {
      const element = document.createElement('button');
      element.type = 'button';
      element.classList.add('btn');
      element.classList.add('btn-info');
      element.setAttribute('data-kontent-project-id', 'p');
      element.setAttribute('data-kontent-language-codename', 'l');
      element.setAttribute('data-kontent-item-id', 'i');
      element.setAttribute('data-kontent-element-codename', 'e');
      element.innerText = 'Button with smart link';

      container.appendChild(element);
    }
  }, []);

  return `<div id='test-html-container'></div>`;
};

SeparateNodeAddition.storyName = 'Node added after SDK is initialized';

export const LongElement = () => `
  <div
      class="border border-secondary bg-light"
      data-kontent-project-id="p"
      data-kontent-language-codename="l"
      data-kontent-item-id="i"
  >
    <div class="p-4" data-kontent-component-id="c">
      <div data-kontent-element-codename="e">
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
        This is a very long element that has a smart link rendered around it. This is a very long element that has a smart
        link rendered around it. This is a very long element that has a smart link rendered around it. This is a very long
        element that has a smart link rendered around it. This is a very long element that has a smart link rendered
        around it. This is a very long element that has a smart link rendered around it. This is a very long element that
        has a smart link rendered around it. This is a very long element that has a smart link rendered around it.
      </div>
    </div>
  </div>
`;

LongElement.storyName = 'Long element with smart link';
