/** biome-ignore-all lint/a11y/useValidAnchor: Using # for test cases */

export const MultipleSmartLinks: React.FC = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      data-kontent-environment-id="p"
      data-kontent-language-codename="l"
      data-kontent-item-id="i"
      data-kontent-element-codename="e"
    >
      <a
        className="navbar-brand"
        href="#"
        data-kontent-item-id="i"
        data-kontent-element-codename="e"
      >
        Navbar
      </a>
      <ul className="navbar-nav mr-auto" data-kontent-item-id="i" data-kontent-component-id="c">
        <li className="nav-item active" data-kontent-element-codename="e">
          <a className="nav-link" href="#">
            Home <span className="sr-only">(current)</span>
          </a>
        </li>
        <li className="nav-item" data-kontent-element-codename="e">
          <a className="nav-link" href="#">
            Link
          </a>
        </li>
        <li className="nav-item" data-kontent-element-codename="e">
          <a className="nav-link disabled" href="#">
            Disabled
          </a>
        </li>
      </ul>
      <form
        className="form-inline my-2 my-lg-0"
        data-kontent-item-id="i"
        data-kontent-component-id="c"
      >
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button type="button" className="btn btn-info my-2" data-kontent-element-codename="e">
          Button with smart link
        </button>
      </form>
    </nav>
  );
};
