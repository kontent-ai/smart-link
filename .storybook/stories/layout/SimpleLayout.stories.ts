export const SingleSmartLink = () => `
  <button 
    type="button" 
    class="btn btn-info"
    data-kontent-project-id="p"
    data-kontent-language-codename="l"
    data-kontent-item-id="i"
    data-kontent-component-id="c"
    data-kontent-element-codename="e"
  >
    Button with smart link
  </button>
`;

SingleSmartLink.storyName = 'single smart link';

export const MultipleSmartLinks = () => `
  <nav
      class="navbar navbar-expand-lg navbar-light bg-light"
      data-kontent-project-id="p"
      data-kontent-language-codename="l"
      data-kontent-item-id="i"
      data-kontent-element-codename="e"
  >
    <a class="navbar-brand" href="#" data-kontent-item-id="i" data-kontent-element-codename="e">Navbar</a>
    <ul
        class="navbar-nav mr-auto"
        data-kontent-item-id="i"
        data-kontent-component-id="c"
    >
      <li class="nav-item active" data-kontent-element-codename="e">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item" data-kontent-element-codename="e">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item" data-kontent-element-codename="e">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
    <form
        class="form-inline my-2 my-lg-0"
        data-kontent-item-id="i"
        data-kontent-component-id="c"
    >
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button
          type="button"
          class="btn btn-info my-2"
          data-kontent-element-codename="e"
      >
        Button with smart link
      </button>
    </form>
  </nav>
`;

MultipleSmartLinks.storyName = 'multiple nested smart links';

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

LongElement.storyName = 'long element with smart link';

export default {
  title: '/layout/simple',
};
