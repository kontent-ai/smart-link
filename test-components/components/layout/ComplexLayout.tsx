import React from 'react';
import { useScroll, ScrollOffsets } from '../../helpers/useScroll';

type ComplexLayoutProps = {
  containerStyle?: React.CSSProperties;
  scrollOffset: ScrollOffsets;
};

export const ComplexLayout: React.FC<ComplexLayoutProps> = ({ containerStyle, scrollOffset }) => {
  useScroll(scrollOffset);
  return (
    <div
      id="container"
      style={containerStyle}
      data-kontent-environment-id="project-id"
      data-kontent-language-codename="en"
    >
      <div
        data-kontent-item-id="page-id"
        className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm"
      >
        <h5
          className="my-0 mr-md-auto font-weight-normal"
          data-kontent-item-id="brand-details-id"
          data-kontent-element-codename="name"
        >
          Company name
        </h5>
        <nav
          className="my-2 my-md-0 mr-md-3"
          data-kontent-element-codename="navigation"
          data-kontent-add-button=""
          data-kontent-add-button-insert-position="end"
          data-kontent-add-button-render-position="right"
        >
          <a className="p-2 text-dark" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">
            Features
          </a>
          <a className="p-2 text-dark" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">
            Enterprise
          </a>
          <a className="p-2 text-dark" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">
            Support
          </a>
          <a className="p-2 text-dark" href="#" data-kontent-item-id="item-id" data-kontent-element-codename="name">
            Pricing
          </a>
        </nav>
        <a className="btn btn-outline-primary" href="#">
          Sign up
        </a>
      </div>

      <div
        className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center"
        data-kontent-item-id="item-id"
        data-kontent-disable-features="random-value,random-value-2"
      >
        <h1
          className="display-4"
          data-kontent-element-codename="title"
          data-kontent-disable-features="random-value,random-value-2"
        >
          Pricing
        </h1>
        <p className="lead" data-kontent-element-codename="description">
          Quickly build an effective pricing table for your potential customers with this Bootstrap example. It's built
          with default Bootstrap components and utilities with little customization.
        </p>
      </div>

      <div
        className="container"
        data-kontent-item-id="item-id"
        data-kontent-element-codename="pricing"
        data-kontent-disable-features="highlight,random-value,random-value-2"
      >
        <div className="card-deck mb-3 text-center">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="card mb-4 shadow-sm"
              data-kontent-component-id="component-id"
              data-kontent-add-button=""
              data-kontent-add-button-render-position="left"
              data-kontent-add-button-insert-position="before"
            >
              <div className="card-header" data-kontent-element-codename="title">
                <h4 className="my-0 font-weight-normal">Free</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title" data-kontent-element-codename="price">
                  $0
                  <small className="text-muted">/ mo</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4" data-kontent-element-codename="description">
                  <li>10 users included</li>
                  <li>2 GB of storage</li>
                  <li>Email support</li>
                  <li>Help center access</li>
                </ul>
                <button
                  type="button"
                  data-kontent-element-codename="cta"
                  className="btn btn-lg btn-block btn-outline-primary"
                >
                  Sign up for free
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer
          className="pt-4 my-md-5 pt-md-5 border-top text-center"
          data-kontent-item-id="item-id"
          data-kontent-component-id="component-id"
        >
          <div className="row">
            <div className="col-6 col-md">
              <h5>Features</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Cool stuff
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Random feature
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Team feature
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Stuff for developers
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Another one
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Last time
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5>Resources</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Resource
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Resource name
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Another resource
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Final resource
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md">
              <h5>About</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Locations
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted"
                    href="#"
                    data-kontent-item-id="item-id"
                    data-kontent-element-codename="name"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
