interface IHtmlFixture {
  readonly querySelector: (selectors: string) => Element | null;
  readonly setHtml: (html: string) => void;
}

export function createHtmlFixture(): IHtmlFixture {
  let sandbox: HTMLElement;

  beforeAll(() => {
    sandbox = document.createElement('div');
    sandbox.id = 'html-fixture-sandbox';
    document.body.appendChild(sandbox);
  });

  afterEach(() => {
    sandbox.innerHTML = '';
  });

  afterAll(() => {
    sandbox.remove();
  });

  return {
    querySelector: (selectors: string): Element | null => {
      return sandbox.querySelector(selectors);
    },
    setHtml: (html: string): void => {
      sandbox.innerHTML = html;
    },
  };
}
