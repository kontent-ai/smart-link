# Kontent Smart Link SDK

![licence](https://img.shields.io/github/license/Kentico/kontent-smart-link)
![npm](https://img.shields.io/npm/v/@kentico/kontent-smart-link)
![downloads](https://img.shields.io/npm/dt/kontent-smart-link)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@kentico/kontent-smart-link)
![snyk](https://img.shields.io/snyk/vulnerabilities/github/Kentico/kontent-smart-link)

KontentSmartLink plugin allowing to automatically inject [smart links](https://docs.kontent.ai/tutorials/develop-apps/build-strong-foundation/set-up-editing-from-preview#a-using-smart-links) to Kentico Kontent according to specified [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp).

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
JS bundle and its minified version are distributed in `dist` folder.

- `kontent-smart-link.umd.min.js`
- `kontent-smart-link.umd.js`

### CSS

The plugin has one CSS file that contains styles needed for the plugin to work properly.
This CSS file is located next to the UMD bundle in the `dist` folder.

- `kontent-smart-link.styles.css`

#### CDN

##### kontent-smart-link.umd.min.js

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.umd.min.js
```

##### kontent-smart-link.styles.css


![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.styles.css?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kentico/kontent-smart-link@latest/dist/kontent-smart-link.styles.css
```

## Usage

The KontentSmartLink plugin uses data-attributes to find HTML elements that represent some content item from the Kentico Kontent on your page and automatically injects [smart links](https://docs.kontent.ai/tutorials/develop-apps/build-strong-foundation/set-up-editing-from-preview#a-using-smart-links).
Injecting smart links to Kontent means that all elements that are marked with special data-attributes will be highlighted and made interactive (handle clicks/redirect to Kontent/navigates from preview in Web Spotlight/etc.).

In order to initialize the KontentSmartLink plugin on your website, you have to call its `initialize` or `initializeOnLoad` method. Both of the previously mentioned methods return an instance of the initialized KontentSmartLink plugin (`initializeOnLoad` returns a Promise resolving to instance) that has two methods:
- `setConfiguration(config)`;
- `destroy()`.

The main difference between the two methods is that the `initializeOnLoad` method will add an event listener to the window `load` event, and initialize the KontentSmartLink plugin only when everything on the page has been loaded.
That is why it wraps an instance of the plugin into a Promise. Therefore, if you want to initialize the KontentSmartLink plugin inside the `head` tag when the page may not be loaded yet, you should probably use `initializeOnLoad` method.

The plugin uses a query parameter to enable/disable smart link injection. That is why, when the plugin is initialized, it starts listening to query parameters in the URL.
The name of the query parameter defaults to `kontent-smart-link-enabled`, but can be changed using the configuration argument of the `initialize` or `initializeOnLoad` methods or using the `setConfiguration` method.
Only the presence of the query parameter is checked and its value is ignored, so all of the following options are valid: `?kontent-smart-link-enabled=true`, `?kontent-smart-link-enabled`, `?kontent-smart-link-enabled=1`, etc.

### Configuration

You can pass the configuration object as a first argument of the `initialize`, `initializeOnLoad` or `setConfiguration` methods.

|Attribute|Default|Description|
|---------|-------|-----------|
|projectId|null|Can be used instead of the data-kontent-project-id attribute to set project ID globally.|
|languageCodename|null|Can be used instead of the data-kontent-language-codename attribute to set language codename globally.|
|queryParam|'kontent-smart-link-enabled'|Name of the query parameter that must be present in the URL to turn the smart link injection on. It is not necessary for query parameter to have a truthy value (just the presence is checked).|

### Data-attributes

In order for the plugin to work correctly, several specific data-attributes need to be present in your HTML.

The plugin supports hierarchical inheritance of data-attributes, that means that you don't
have to put all of those data-attributes on the same item. Usually you will put `data-kontent-project-id` and `data-kontent-language-codename`
attributes on a body node, so that the project id and language codename values are the same for all elements inside of the body.
Next you will put `data-kontent-item-id` attributes on all HTML nodes that represent a Kontent item.
Then inside of those nodes you will find all child nodes that represent elements of the Kontent item and put `data-kontent-element-codename` attribute on them.
The plugin will then find all elements that have `data-kontent-element-codename` attribute, highlight them and make those elements interactive (handle clicks/redirect to Kontent/navigates from preview in Web Spotlight/etc.). 

|Attribute|Alternative|Description|
|---------|-----------|---------- |
| data-kontent-project-id| Can be set globally using the `projectId` attribute of the first argument of `initialize` or `initializeOnLoad` methods. If both are used, data-attribute will have a higher priority.  | Specifies ID of a project in Kentico Kontent.|
| data-kontent-language-codename| Can be set globally using the `languageCodename` attribute of the first argument of `initialize` or `initializeOnLoad` methods. If both are used, data-attribute will have a higher priority.  | Specifies codename of a language in Kentico Kontent.  |
| data-kontent-item-id| - | Specifies ID of an item in Kentico Kontent.|
| data-kontent-element-codename| - | Specifies codename of an element in Kentico Kontent.|

### iFrame Communication

When run inside an iframe element, the KontentSmartLink plugin will send iframe messages to the parent window instead of redirecting user to the Kontent page.
This is needed for the plugin to work properly inside Web Spotlight.

|Message|Data|Origin|Description|
|---|---|---|---|
|kontent-smart-link:initialized|<code>{ projectId: string &#124; null, languageCodename: string &#124; null, enabled: boolean }</code>|Plugin|This event is fired by the KontentSmartLink plugin when it is initialized.|
|kontent-smart-link:status|<code>{ enabled: boolean }</code>|Client|You can send this event to turn on/off the plugin.|
|kontent-smart-link:element:clicked|<code>{ projectId: string, languageCodename: string, itemId: string, elementCodename: string }</code>|Plugin|This message is sent by the KontentSmartLink plugin when element with `data-kontent-element-codename` attribute is clicked.|

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
                queryParam: 'preview',
            });
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
