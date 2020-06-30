# kontent-smart-link

![licence](https://img.shields.io/github/license/Kentico/kontent-smart-link)
![npm](https://img.shields.io/npm/v/@kentico/kontent-smart-link)
![downloads](https://img.shields.io/npm/dt/kontent-smart-link)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@kentico/kontent-smart-link)
![snyk](https://img.shields.io/snyk/vulnerabilities/github/Kentico/kontent-smart-link)

Html element decorator allowing to inject [smart links](https://docs.kontent.ai/tutorials/develop-apps/build-strong-foundation/set-up-editing-from-preview#a-using-smart-links) to Kentico Kontent according to specified [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp).

## ⚠ Disclaimer

This project/repository is a work in progress and is not ready for production use yet. The features and APIs might be (and probably will be) changed.

## Installation

You can install this library using `npm` or you can use global CDNs such as `jsdelivr` directly.

### npm

```
npm i @kentico/kontent-smart-link
```

### UMD Bundles

When using UMD bundle and including this library in `script` tag on your `html` page, you can find it under the `KontentSmartLink` global variable.

Bundles are distributed in `dist` folder and there are several options that you can choose from.

<!-- TODO: decide if we need a legacy variant of the plugin -->
- Use `kontent-smart-link.legacy.umd.min.js` if you need to support legacy browsers
- Else use `kontent-smart-link.umd.min.js`

#### CDN

##### kontent-smart-link.legacy.umd.min

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.legacy.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.min.js
```

##### kontent-smart-link.umd.min

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.legacy.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.min.js
```

## Usage

### Configuration

You can pass the configuration object as a first argument of the `initialize` and `initializeOnLoad` methods.

|Attribute|Default|Description|
|---------|-------|-----------|
|projectId|null|Can be used instead of the data-kk-project-id attribute to set project ID globally.|
|languageCodename|null|Can be used instead of the data-kk-language-codename attribute to set language codename globally.|
|queryParam|'kk-plugin-enabled'|Name of the query parameter that must be present in the URL to turn the highlighting on.|


### Data-attributes

In order for the plugin to work correctly, several specific data-attributes need to be present in your HTML.

The plugin supports hierarchical inheritance of data-attributes, that means that you don't
have to put all of those data-attributes on the same item. Usually you will put `data-kk-project-id` and `data-kk-language-codename`
attributes on a body node, so that the project id and language codename values are the same for all elements inside of the body.
Next you will put `data-kk-item-id` attributes on all HTML nodes that represent a Kontent item.
Then inside of those nodes you will find all child nodes that represent elements of the Kontent item and put `data-kk-element-codename` attribute on them.
The plugin will then find all elements that have `data-kk-element-codename` attribute, highlight them and make those elements interactive (handle clicks/redirect to Kontent/send iframe message to Kontent app/etc.). 

|Attribute|Alternative|Description|
|---------|-----------|---------- |
| data-kk-project-id| Can be set globally using the `projectId` attribute of the first argument of `initialize` or `initializeOnLoad` methods. If both are used, data-attribute will have a higher priority.  | Specifies ID of a project in Kentico Kontent.|
| data-kk-language-codename| Can be set globally using the `languageCodename` attribute of the first argument of `initialize` or `initializeOnLoad` methods. If both are used, data-attribute will have a higher priority.  | Specifies codename of a language in Kentico Kontent.  |
| data-kk-item-id| - | Specifies ID of an item in Kentico Kontent.|
| data-kk-element-codename| - | Specifies codename of an element in Kentico Kontent.|

### Examples

#### HTML & UMD & CDN
```html
<html>
    <head>
        <title>Kontent Smart Link - HTML example</title>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.styles.css"/>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.min.js" />
        <script type="text/javascript">
            KontentSmartLink.initializeOnLoad({
                // Or you can specify project id as a `data-kk-project-id` attribute on some element at the top of the DOM hierarchy
                projectId: '1d50a0f7-9033-48f3-a96e-7771c73f9683',
                // Or you can specify language codename as a `data-kk-language-codename` attribute on some element at the top of the DOM hierarchy
                languageCodename: 'default',
                // Name of the query parameter that should be present in the URL to turn the highlighting on
                queryParam: 'preview',
            });
        </script>
    </head>
    <body>
        <div class="home" data-kk-item-id="af858748-f48a-4169-9b35-b10c9d3984ef">
            <img class="home__banner" data-kk-element-codename="image" />
        </div>
    </body>
</html>
```

#### ES6
```js
import KontentSmartLink from '@kentico/kontent-smart-link';
import '@kentico/kontent-smart-link/dist/kontent-smart-link.styles.css';

const plugin = KontentSmartLink.initializeOnLoad({
    projectId: '1d50a0f7-9033-48f3-a96e-7771c73f9683',
    languageCodename: 'default',
    queryParam: 'preview',
});
```

#### Next.js

In order to use the plugin with the Next.js framework you can either initialize it separately on each page or initialize it once for the whole application
using the `_app.jsx` file. Do not forget to `destroy()` plugin for it to work properly.

```js
// _app.jsx
import KontentSmartLink from '@kentico/kontent-smart-link';
import '@kentico/kontent-smart-link/dist/kontent-smart-link.styles.css';

const MyApp = ({
  Component,
  pageProps,
}) => {
  useEffect(() => {
    const plugin = KontentSmartLink.initialize({
      queryParam: 'preview-mode'    
    });
    return () => {
      plugin.destroy();
    }; 
  });
 
  return <Component {...pageProps} />;
};
```

### Gatsby

You can either initialize the plugin on every page or use a layout to initialize the plugin while using Gatsby. Do not forget to `destroy()` plugin for it to work properly.

```js
// src/components/layout.js
import KontentSmartLink from '@kentico/kontent-smart-link';
import '@kentico/kontent-smart-link/dist/kontent-smart-link.styles.css';

export default function Layout({ children }) {
    useEffect(() => {
        const plugin = KontentSmartLink.initialize({
          queryParam: 'preview-mode'    
        });
        return () => {
          plugin.destroy();
        }; 
    });

    return (
      <div class="layout">{children}</div>
  );
}
```

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/kontent-smart-link?pixel)
