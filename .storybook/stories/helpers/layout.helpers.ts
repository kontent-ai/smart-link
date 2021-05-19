import { withScrollOffsets } from '../../decorators/withScrollOffsets';

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

SingleSmartLink.storyName = 'Single smart link';

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

MultipleSmartLinks.storyName = 'Multiple nested smart links';

interface IComplexTemplate {
  readonly containerStyle: string;
}

const ComplexTemplate = ({ containerStyle }: IComplexTemplate) => `
  <div
    id="container"
    style="${containerStyle}"
    data-kontent-project-id="project-id"
    data-kontent-language-codename="en"
  >
    <div
      data-kontent-item-id="page-id"
      class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm"
    >
      <h5 class="my-0 mr-md-auto font-weight-normal" data-kontent-item-id="brand-details-id"
          data-kontent-element-codename="name">
        Company name
      </h5>
      <nav
        class="my-2 my-md-0 mr-md-3"
        data-kontent-element-codename="navigation"
        data-kontent-add-button
        data-kontent-add-button-insert-position="end"
        data-kontent-add-button-render-position="right"
      >
        <a class="p-2 text-dark" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Features</a>
        <a class="p-2 text-dark" href="#" data-kontent-item-id="item-id"
           data-kontent-element-codename="name">Enterprise</a>
        <a class="p-2 text-dark" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Support</a>
        <a class="p-2 text-dark" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Pricing</a>
      </nav>
      <a class="btn btn-outline-primary" href="#">Sign up</a>
    </div>
    <div 
      class="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center" 
      data-kontent-item-id="item-id" 
      data-kontent-disable-features="random-value,random-value-2"
    >
      <h1 
        class="display-4" 
        data-kontent-element-codename="title"
        data-kontent-disable-features="random-value,random-value-2"
      >Pricing</h1>
      <p class="lead" data-kontent-element-codename="description">
        Quickly build an effective pricing table for your potential customers with this Bootstrap example.
        It’s built with default Bootstrap components and utilities with little customization.
      </p>
    </div>
    <div 
      class="container" 
      data-kontent-item-id="item-id" 
      data-kontent-element-codename="pricing" 
      data-kontent-disable-features="highlight,random-value,random-value-2"
    >
      <div class="card-deck mb-3 text-center">
        <div
          class="card mb-4 shadow-sm"
          data-kontent-component-id="component-id"
          data-kontent-add-button
          data-kontent-add-button-render-position="left"
          data-kontent-add-button-insert-position="before"
        >
          <div class="card-header" data-kontent-element-codename="title" data-kontent-disable-features="random-value,highlight,random-value-2">
            <h4 class="my-0 font-weight-normal">Free</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title" data-kontent-element-codename="price">
              $0
              <small class="text-muted">/ mo</small>
            </h1>
            <ul class="list-unstyled mt-3 mb-4" data-kontent-element-codename="description">
              <li>10 users included</li>
              <li>2 GB of storage</li>
              <li>Email support</li>
              <li>Help center access</li>
            </ul>
            <button type="button" data-kontent-element-codename="cta" class="btn btn-lg btn-block btn-outline-primary">
              Sign up for free
            </button>
          </div>
        </div>
  
        <div
          class="card mb-4 shadow-sm"
          data-kontent-component-id="component-id"
          data-kontent-add-button
          data-kontent-add-button-render-position="left"
          data-kontent-add-button-insert-position="before"
        >
          <div class="card-header" data-kontent-element-codename="title">
            <h4 class="my-0 font-weight-normal">Free</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title" data-kontent-element-codename="price">
              $0
              <small class="text-muted">/ mo</small>
            </h1>
            <ul class="list-unstyled mt-3 mb-4" data-kontent-element-codename="description">
              <li>10 users included</li>
              <li>2 GB of storage</li>
              <li>Email support</li>
              <li>Help center access</li>
            </ul>
            <button type="button" data-kontent-element-codename="cta" class="btn btn-lg btn-block btn-outline-primary">
              Sign up for free
            </button>
          </div>
        </div>
  
        <div
          class="card mb-4 shadow-sm"
          data-kontent-component-id="component-id"
          data-kontent-add-button
          data-kontent-add-button-render-position="left"
          data-kontent-add-button-insert-position="before"
        >
          <div class="card-header" data-kontent-element-codename="title">
            <h4 class="my-0 font-weight-normal">Free</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title" data-kontent-element-codename="price">
              $0
              <small class="text-muted">/ mo</small>
            </h1>
            <ul class="list-unstyled mt-3 mb-4" data-kontent-element-codename="description">
              <li>10 users included</li>
              <li>2 GB of storage</li>
              <li>Email support</li>
              <li>Help center access</li>
            </ul>
            <button type="button" data-kontent-element-codename="cta" class="btn btn-lg btn-block btn-outline-primary">
              Sign up for free
            </button>
          </div>
        </div>
      </div>
  
      <footer class="pt-4 my-md-5 pt-md-5 border-top text-center" data-kontent-item-id="item-id"
              data-kontent-component-id="component-id">
        <div class="row">
          <div class="col-6 col-md">
            <h5>Features</h5>
            <ul class="list-unstyled text-small">
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Cool
                stuff</a></li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Random
                feature</a></li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Team
                feature</a></li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Stuff
                for developers</a></li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Another
                one</a></li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Last
                time</a></li>
            </ul>
          </div>
          <div class="col-6 col-md">
            <h5>Resources</h5>
            <ul class="list-unstyled text-small">
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Resource</a>
              </li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Resource
                name</a></li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Another
                resource</a></li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Final
                resource</a></li>
            </ul>
          </div>
          <div class="col-6 col-md">
            <h5>About</h5>
            <ul class="list-unstyled text-small">
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id"
                     data-kontent-element-codename="name">Team</a></li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Locations</a>
              </li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">Privacy</a>
              </li>
              <li><a class="text-muted" href="#" data-kontent-item-id="item-id"
                     data-kontent-element-codename="name">Terms</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  </div>
`;

export const ComplexLayout = ComplexTemplate.bind({});
ComplexLayout.storyName = 'Complex';

export const ComplexLayoutWithScrollbar = ComplexTemplate.bind({});
ComplexLayoutWithScrollbar.storyName = 'Complex with scrollbar';
ComplexLayoutWithScrollbar.args = { containerStyle: 'max-height: 100vh; overflow: scroll; border: 1px solid black;' };
ComplexLayoutWithScrollbar.decorators = [withScrollOffsets({ container: [200, 0] })];
