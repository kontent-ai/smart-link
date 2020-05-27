# kontent-smart-link

Html element decorator allowing to inject [smart links](https://docs.kontent.ai/tutorials/develop-apps/build-strong-foundation/set-up-editing-from-preview#a-using-smart-links) to Kentico Kontent according to specified [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp).

## ⚠ Disclaimer

This project/repository in a work in progress and is not ready for production use yet. The features and APIs might be (and probably will be) changed.

## Installation

You can install this library using `npm` or you can use global CDNs such as `jsdelivr` directly.

### npm

```
npm i @kentico/kontent-smart-link
```

### UMD Bundles

When using UMD bundle and including this library in `script` tag on your `html` page, you can find it under the `KontentSmartLink` global variable.

Bundles are distributed in `dist` folder and there are several options that you can choose from.

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

In order for the plugin to work correctly, several specific data-attributes need to be present in your HTML.

### Supported data-attributes

|Attribute|Alternative|Description|
|---------|-----------|---------- |
| data-kk-project-id| Can be set globally using the `projectId` attribute of the first argument of `initialize` or `initializeOnLoad` methods. If both are used, data-attribute will have a higher priority.  | Specifies ID of a project in Kentico Kontent.|
| data-kk-language-codename| Can be set globally using the `languageCodename` attribute of the first argument of `initialize` or `initializeOnLoad` methods. If both are used, data-attribute will have a higher priority.  | Specifies codename of a language in Kentico Kontent.  |
| data-kk-item-id| - | Specifies ID of an item in Kentico Kontent.|
| data-kk-element-codename| - | Specifies codename of an element in Kentico Kontent.|

The plugin supports hierarchical inheritance of data-attributes, that means that you don't
have to put all of those data-attributes on the same item. Usually you will put `data-kk-project-id` and `data-kk-language-codename`
attributes on a body node, so that the project id and language codename values are the same for all elements inside of the body.
Next you will put `data-kk-item-id` attributes on all HTML nodes that represent a Kontent item.
Then inside of those nodes you will find all child nodes that represent elements of the Kontent item and put `data-kk-element-codename` attribute on them.
The plugin will then find all elements that have `data-kk-element-codename` attribute, highlight them and make those elements interactive (handle clicks/redirect to Kontent/send iframe message to Kontent app/etc.). 

### Example
```html
<html>
    <head>
        <title>Example page</title>
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

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.
