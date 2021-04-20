# Kontent Smart Link SDK

![licence](https://img.shields.io/github/license/Kentico/kontent-smart-link)
![npm](https://img.shields.io/npm/v/@kentico/kontent-smart-link)
![downloads](https://img.shields.io/npm/dt/@kentico/kontent-smart-link)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@kentico/kontent-smart-link)
![snyk](https://img.shields.io/snyk/vulnerabilities/github/Kentico/kontent-smart-link)

>Kontent Smart Link SDK can be used to automatically inject smart links 
>to Kentico Kontent according to manually specified [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp) 
>on your website. It also lets you connect your website with Web Spotlight (for faster editing and preview of your content).

## Installation

You can install this library using `npm` or you can use global CDNs such as `jsdelivr` directly.

### npm

```
npm i @kentico/kontent-smart-link
```

### UMD Bundles

When using UMD bundle and including this library in `script` tag on your `html` page, you can find it under the `KontentSmartLink` global variable.
JS bundle and its minified version are distributed in `dist` folder.

- `kontent-smart-link.umd.min.js`
- `kontent-smart-link.umd.js`

#### CDN

#### kontent-smart-link.umd.js

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.js
```

##### kontent-smart-link.umd.min.js

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.min.js
```

## Usage

Kontent Smart Link SDK uses [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp) to find elements that represent some content items/content components/elements from Kentico Kontent.
Then it automatically injects [smart links](https://docs.kontent.ai/tutorials/develop-apps/build-strong-foundation/set-up-editing-from-preview#a-using-smart-links) for all of those elements.
Injecting smart links to Kontent means that all elements that are marked with special data attributes will be highlighted and made interactive (handle clicks/redirect to Kontent/navigates from the preview in Web Spotlight/etc.).

In order to initialize the Kontent Smart Link SDK on your website, you have to call its `initialize` or `initializeOnLoad` method. Both of the previously mentioned methods return an instance of the initialized SDK (`initializeOnLoad` returns a Promise resolving to instance) that has two methods:
- `setConfiguration(config)`;
- `destroy()`.

The main difference between the two methods is that the `initializeOnLoad` method will add an event listener to the window `load` event, and initialize the Kontent Smart Link SDK only when everything on the page has been loaded.
That is why it wraps an instance of the SDK into a Promise. Therefore, if you want to initialize the Kontent Smart Link SDK inside the `head` tag when the page may not be loaded yet, you should probably use `initializeOnLoad` method.

The SDK uses a query parameter to enable/disable smart link injection. That is why, when the SDK is initialized, it starts listening to query parameters in the URL.
The name of the query parameter defaults to `ksl-enabled`, but can be changed using the configuration argument of the `initialize` or `initializeOnLoad` methods or using the `setConfiguration` method.
Only the presence of the query parameter is checked and its value is ignored, so all of the following options are valid: `?ksl-enabled=true`, `?ksl-enabled`, `?ksl-enabled=1`, etc.

### Configuration

You can pass the configuration object as a first argument of the `initialize`, `initializeOnLoad` or `setConfiguration` methods.

|Attribute|Default|Description|
|---------|-------|-----------|
|debug|false|When it's set to `true`, enables all debug logs. Can be useful to get more information about how the SDK works inside.
|defaultDataAttributes|```{ projectId: undefined, languageCodename: undefined }```|Default values for data attributes, which are only used when those data attributes are not found in DOM during data attributes parsing process.|
|queryParam|'kontent-smart-link-enabled'|Name of the query parameter that must be present in the URL to turn the smart link injection on. It is not necessary for query parameter to have a truthy value (just the presence of this query parameter is checked). If set to falsy value ('', null), the smart link injection will always be enabled. Query parameter is only used outside Web Spotlight.|

### Data attributes

The Kontent Smart Link SDK highly depends on the data attributes in your HTML markup and it won't work as expected without them. The SDK won't add
those data attributes to your HTML, you must add all of those attributes yourself. The SDK will then use those attributes as a source
of data (project id, element codename, etc.) when injecting the smart links.

|Attribute|Alternative|Required|Description|
|---------|-----------|----------|----------|
| data-kontent-project-id | Can be set globally using the `projectId` attribute of the first argument of `initialize` or `initializeOnLoad` methods. If both are used, data-attribute will have a higher priority.  | ✔ | Specifies ID of a project in Kentico Kontent.|
| data-kontent-language-codename | Can be set globally using the `languageCodename` attribute of the first argument of `initialize` or `initializeOnLoad` methods. If both are used, data-attribute will have a higher priority.  | ✔ | Specifies codename of a language in Kentico Kontent.  |
| data-kontent-item-id | ❌ | ✔ | Specifies ID of an item in Kentico Kontent.|
| data-kontent-component-id | ❌ | ❌ | Specifies ID of a [content component](https://docs.kontent.ai/tutorials/write-and-collaborate/structure-your-content/structure-your-content#a-create-single-use-content) in Kentico Kontent. |
| data-kontent-element-codename | ❌ | ✔ | Specifies codename of an element in Kentico Kontent.|

The SDK supports the hierarchical inheritance of data attributes, which means that you don't have to put all of those data attributes
on the same item. The parsing process starts with the `data-kontent-element-codename` attribute and goes up the list trying to find 
other attributes on the same node or on all of its ancestors (up to the body element). 

Usually, you will put `data-kontent-project-id` and `data-kontent-language-codename` attributes on a body node
so that the project id and language codename values are the same for all elements inside of the body. Next, you will put 
`data-kontent-item-id` attributes on all HTML nodes that represent a Kontent item. Then inside of those nodes, you will find
all child nodes that represent elements of the Kontent item and put `data-kontent-element-codename` attribute on them. The SDK will then find all
elements that have `data-kontent-element-codename` attribute, highlight them and make those elements
interactive (handle clicks/redirect to Kontent/navigates from the preview in Web Spotlight/etc.). 

[//]: # (TODO: add information about data attributes hierarchy)

#### Content components

[Content component](https://docs.kontent.ai/tutorials/write-and-collaborate/structure-your-content/structure-your-content#a-create-single-use-content) is a single-use content, 
that is also sometimes referred to as one-off, channel-specific, or non-reusable.
Content components exist only within a specific rich text element in your content items and become
their integral part. This means you won't find components in your list of items in Content Inventory in Kontent.

You should use `data-kontent-component-id` attribute to specify that something represents a content component
in your HTML, so that the SDK knows that this item has no separate page in the Kontent and must be opened
in the context of its parent content item.

### iFrame Communication

When running inside an iframe element, the Kontent Smart Link SDK will send iframe messages to the parent window instead of redirecting user to the Kontent page.
This is needed for the SDK to work properly inside Web Spotlight.

|Message|Data|Origin|Description|
|---|---|---|---|
|kontent-smart-link:initialized|<code>{ projectId: string &#124; null, languageCodename: string &#124; null, enabled: boolean }</code>|SDK|This event is fired by the SDK when it is initialized.|
|kontent-smart-link:status|<code>{ enabled: boolean }</code>|Client|You can send this event to turn on/off the SDK.|
|kontent-smart-link:element:clicked|<code>{ projectId: string, languageCodename: string, itemId: string, elementCodename: string }</code>|SDK|This message is sent by the SDK when element with `data-kontent-element-codename` attribute is clicked.|

[//]: # (TODO: add new iframe messages)

### Customization

The following custom CSS properties can be used to customize the visuals of the SDK output.

|Custom property|Description|Default|
|---|---|---|
|--ksl-highlight-border-color-selected|Selected (hovered) highlight border color.|rgba(219, 60, 0, 1)|
|--ksl-highlight-border-color|Highlight border color.|rgba(219,60,0,0.5)|
|--ksl-highlight-border-radius|Highlight border radius.|5px|
|--ksl-highlight-border-style|Highlight border style.|dashed|
|--ksl-highlight-border-width|Highlight border width.|2px|
|--ksl-tooltip-background-color|Tooltip background color.|#141619|
|--ksl-tooltip-color|Tooltip text color.|#fff|

[//]: # (TODO: add more customization options)

### Examples

#### HTML & UMD & CDN
```html
<html>
    <head>
        <title>Kontent Smart Link - HTML example</title>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@2.0.0/dist/kontent-smart-link.umd.min.js"></script>
        <script type="text/javascript">
            KontentSmartLink.initializeOnLoad({queryParam: 'preview'});
        </script>
    </head>
    <body data-kontent-project-id="1d50a0f7-9033-48f3-a96e-7771c73f9683" data-kontent-language-codename="default">
        <div class="home" data-kontent-item-id="af858748-f48a-4169-9b35-b10c9d3984ef">
            <img class="home__banner" data-kontent-element-codename="image" />
            <h1 data-kontent-element-codename="text">...</h1>
        </div>
    </body>
</html>
```

#### ES6
```js
import KontentSmartLink from '@kentico/kontent-smart-link';

const kontentSmartLink = KontentSmartLink.initializeOnLoad({
    projectId: '1d50a0f7-9033-48f3-a96e-7771c73f9683',
    languageCodename: 'default',
    queryParam: 'preview',
});
```

#### Next.js

In order to use the SDK with the Next.js framework you can either initialize it separately on each page or initialize it once for the whole application
using the `_app.jsx` file. Do not forget to `destroy()` SDK for it to work properly.

```js
// _app.jsx
import KontentSmartLink from '@kentico/kontent-smart-link';

const MyApp = ({
  Component,
  pageProps,
}) => {
  useEffect(() => {
    const kontentSmartLink = KontentSmartLink.initialize({
      queryParam: 'preview-mode'    
    });
    return () => {
      kontentSmartLink.destroy();
    }; 
  });
 
  return <Component {...pageProps} />;
};
```

### Gatsby

You can either initialize the SDK on every page or use a layout to initialize the SDK while using Gatsby. Do not forget to `destroy()` SDK for it to work properly.

```js
// src/components/layout.jsx
import KontentSmartLink from '@kentico/kontent-smart-link';

export default function Layout({ children }) {
    useEffect(() => {
        const kontentSmartLink = KontentSmartLink.initialize({
          queryParam: 'preview-mode'    
        });
        return () => {
          kontentSmartLink.destroy();
        }; 
    });

    return (
      <div class="layout">{children}</div>
  );
}
```

## Tests

### Unit tests

Since this SDK highly depends on browser APIs, the unit tests are run by Karma test runner (+ Jasmine) inside Chrome browser.
To run all tests in a watch mode you can use the `npm run test:unit` command. To run all tests only once you can use
the `npm run test:unit:ci` command. All unit tests are located in the `test-browser` folder.

### Visual regression tests

Visual regression testing is implemented using Storybook and Loki. Each story in Storybook represents a test case, which is 
then used by Loki to generate screenshots. In order to run visual regression tests you need to start Storybook using
the `npm run storybook` command and then start loki testing using the `npm run test:visual` command. Or you can use
the `npm run test:visual:ci` command to automatically start the Storybook server in a CI mode and run visual tests. 

Visual regression tests use the built version of SDK, so before running them make sure you rebuild the SDK
after the last change you made. You can this using the `npm run build` command or using the `npm run dev` command to
start build in a watch mode.

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.

