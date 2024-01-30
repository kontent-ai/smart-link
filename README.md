# Kontent.ai Smart Link SDK

![licence](https://img.shields.io/github/license/kontent-ai/smart-link)
![npm](https://img.shields.io/npm/v/@kontent-ai/smart-link)
![downloads](https://img.shields.io/npm/dt/@kontent-ai/smart-link)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@kontent-ai/smart-link)

###### [Usage](#usage) | [Contributing](https://github.com/kontent-ai/.github/blob/main/CONTRIBUTING.md) | [Troubleshooting](https://github.com/kontent-ai/smart-link/blob/master/TROUBLESHOOTING.md) | [Breaking changes](https://github.com/kontent-ai/smart-link/blob/master/BREAKING.md) | [Prerelease (@next)](https://github.com/kontent-ai/smart-link/tree/next)

> Kontent.ai Smart Link SDK can be used to automatically inject smart links
> to Kontent.ai according to manually specified [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp)
> on your website. It also lets you connect your website with Web Spotlight for faster editing and preview of your content.
> 
> :warning: Kontent.ai Smart Link SDK is **a browser-only SDK**, which means that the Node.js environment is not currently supported. Make sure to always initialize
> the Smart Link SDK in a browser context.

## Installation

You can install this library using `npm` or using global CDNs such as `jsdelivr`.

### npm

```
npm i @kontent-ai/smart-link
```

### UMD Bundles

When using the UMD bundle and including this library inside the `script` tag of your HTML page, you can then find an SDK
instance under the `KontentSmartLink` global variable. JS bundle and its minified version are distributed in `dist`
folder.

- `kontent-smart-link.umd.min.js`
- `kontent-smart-link.umd.js`

#### CDN

#### kontent-smart-link.umd.js

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kontent-ai/smart-link@latest/dist/kontent-smart-link.umd.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kontent-ai/smart-link@latest/dist/kontent-smart-link.umd.js
```

##### kontent-smart-link.umd.min.js

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kontent-ai/smart-link@latest/dist/kontent-smart-link.umd.min.js?compression=gzip)

```
https://cdn.jsdelivr.net/npm/@kontent-ai/smart-link@latest/dist/kontent-smart-link.umd.min.js
```

## Usage

Kontent.ai Smart Link SDK parses manually specified [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp) on
your webpage and automatically injects
[smart links](https://kontent.ai/learn/tutorials/develop-apps/build-strong-foundation/set-up-editing-from-preview#a-automatically-create-edit-links-in-web-apps)
to Kontent.ai. Injecting smart links to Kontent.ai means that all elements marked with special data attributes will
become interactive (handle clicks/redirect to Kontent.ai/navigate from the preview in Web Spotlight/etc.). The type of
injected smart link depends on used data attributes, their hierarchy, and context (Web Spotlight).

### Data attributes

Kontent.ai Smart Link SDK highly depends on a set of manually specified data attributes in your HTML markup. That is why it
won't work properly without those attributes. **The SDK won't add the data attributes to your HTML, you must add them
yourself so that SDK will then be able to use them as a source of data (e.g. Kontent.ai project ID, element code name,
etc.) when injecting the smart links.**

#### Available data attributes

|Attribute|Value| Description                                                                                                                                                 |
|---------|:----------:|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data-kontent-project-id` | guid | Kontent.ai project/environment ID.                                                                                                                          |
| `data-kontent-language-codename` | string | Kontent.ai language codename.                                                                                                                               |
| `data-kontent-item-id` | guid | Content item ID.                                                                                                                                            |
| `data-kontent-component-id` |  guid | [Content component](https://kontent.ai/learn/tutorials/write-and-collaborate/structure-your-content/structure-your-content#a-create-single-use-content) ID. |
| `data-kontent-element-codename` | string | Content type element codename.                                                                                                                              |
| `data-kontent-add-button` | - | Specifies that node should have add-button rendered near it.                                                                                                |
| `data-kontent-add-button-insert-position` | `start` &#124; `before` &#124; `after` &#124; `end` | Specifies the insert position of an item/content component added using add button.                                                                          |
| `data-kontent-add-button-render-position` | `bottom-start` &#124; `bottom` &#124; `bottom-end` &#124; `left-start` &#124; `left` &#124; `left-end` &#124; `top-start` &#124; `top` &#124; `top-end` &#124; `right-start` &#124; `right` &#124; `right-end` | Specifies visual location of add button.                                                                                                                    |
| `data-kontent-disable-features` | `highlight` | Specifies that the selected node should not have highlight (which includes edit buttons). Useful when there are too many smart links on your page.          |

#### Data attributes hierarchy

Although it is possible to put all previously specified data attributes on the same DOM node, you don't have to do it.
We recommend you set data attributes hierarchically so that you don't have to duplicate the same attributes.

For example, your webpage probably represents one specific project in Kontent.ai, which means that you can place
`data-kontent-project-id` attribute on your `<body>` element or another wrapping DOM node so that all descendant nodes
inherit this project ID. The same could be true for a language code name. If your page uses only 1 language variant at a
time, you could place your `data-kontent-language-codename` attribute next to your `data-kontent-project-id` from a
previous step. But remember, that since language variant is relevant to some specific
project, `data-kontent-language-codename` attribute should always be on the same element as `data-kontent-project-id`
attribute or on some of its descendants. After that, you can find all DOM nodes that represent Kontent.ai items and
place `data-kontent-item-id` attribute on them. Then inside those nodes, you can find all descendants that represent
some element of the Kontent.ai item and put `data-kontent-element-codename`
attribute on them. In the case of Rich Text elements and Linked Items elements, there could be other content items or
content components inside them, which have their own elements and so on.

#### Content components

[Content component](https://kontent.ai/learn/tutorials/write-and-collaborate/structure-your-content/structure-your-content#a-create-single-use-content)
is single-use content, that is also sometimes referred to as one-off, channel-specific, or non-reusable. Content
components exist only within a specific rich text element in your content items and become their integral part. This
means you won't find components in your list of items in Content Inventory in Kontent.ai.

You should use `data-kontent-component-id` attribute to specify that something represents a content component in your
HTML so that the SDK knows that this item has no separate page in the Kontent.ai and must be opened in the context of its
parent content item.

### Smart link types

Currently, there are 4 types of smart links supported by Kontent.ai Smart Link SDK. All of them require certain data
attributes to be specified in HTML markup of your webpage. Please note, that most of those smart link types are only
available and visible inside Web Spotlight preview iframe.

#### Edit element button

Edit element button allows you to edit a specific element of a content item by clicking on it in preview. Inside Web
Spotlight, this will lead to In-Context editor being opened, and the selected element will be scrolled into view.
Outside Web Spotlight, you will be redirected to Kontent.ai item editor.

**Data attributes:** `data-kontent-project-id` → `data-kontent-language-codename` → `data-kontent-item-id`
→ `data-kontent-component-id?` → `data-kontent-element-codename`.

**Environment:** This feature is available both inside and outside Web Spotlight.

#### Edit content component button

Edit content component button allows you to edit a specific content component by clicking on it in preview. This will
lead to In-Context editor being opened, and the selected content component scrolled into view.

**Data attributes:** `data-kontent-project-id` → `data-kontent-language-codename` → `data-kontent-item-id`
→ `data-kontent-component-id`.

**Environment:** This feature is only available inside Web Spotlight.

#### Edit content item button

Edit content item button allows you to edit a specific content item by clicking on it in preview. This will lead to
In-Context editor being opened.

**Data attributes:** `data-kontent-project-id` → `data-kontent-language-codename` → `data-kontent-item-id`.

**Environment:** This feature is only available inside Web Spotlight.

#### Add button

Add button allows you to add content to your page right from your preview. It supports both Linked items elements and
Rich Text elements.

**Environment:** This feature is only available inside Web Spotlight.

##### Fixed add button

**Data attributes:** `data-kontent-project-id` → `data-kontent-language-codename` → `data-kontent-item-id`
→ `data-kontent-component-id?` → `data-kontent-element-codename`(RTE or LIE) → `data-kontent-add-button`
& `data-kontent-add-button-render-position?` & `data-kontent-add-button-insert-position=start|end` .

##### Relative add button

Relative add button allows you to add content relatively to some existing content in your Rich Text element or Linked
item element. For example, you can insert a new content component after or before the existing content component in RTE.
To turn add button into a relative add button, you need to set insert position to `before` or `after` and provide target
id on the same node using `data-kontent-item-id` or `data-kontent-component-id` attribute.

**Data attributes:** `data-kontent-project-id` → `data-kontent-language-codename` → `data-kontent-item-id`
→ `data-kontent-component-id?` → `data-kontent-element-codename`(RTE or LIE)
→ `data-kontent-item-id|data-kontent-component-id`(target item) & `data-kontent-add-button`
& `data-kontent-add-button-render-position?` & `data-kontent-add-button-insert-position=before|after`.

### SDK Initialization

After all data attributes have been set, you can initialize Kontent.ai Smart Link SDK on your website. You can use
`initialize` or `initializeOnLoad` method in order to do it. Both of the previously mentioned methods return an instance
of initialized SDK (`initializeOnLoad` returns a Promise resolving to an instance). The main difference between the two
methods is that the `initializedOnLoad` method will wait for the page to load before initializing the SDK. This can be
useful when you want to initialize the SDK in the `head` section of your webpage when the page has not been fully loaded
yet.

Kontent.ai Smart Link SDK uses multiple event listeners, timeouts, observers to track the position of the relevant
elements, so please always call `.destroy()` method to dispose all of those side effects before trying to initialize the
SDK again (e.g. inside `useEffect` cleanup function) to avoid memory leaks.

### Configuration

Both initialization methods take an optional configuration argument, that you can use to configure the SDK. You can also
use instance `setConfiguration` method to update configuration of initialized SDK.

|Attribute|Default|Description|
|---------|:-------:|-----------|
|debug|false|When it's set to `true`, enables all debug logs. Can be useful to get more information about how the SDK works inside, but can affect performance.
|defaultDataAttributes|```{ projectId: undefined, languageCodename: undefined }```|Default values for data attributes, which are only used when those data attributes are not found in DOM during data attributes parsing process. For now, only `projectId` and `languageCodename` attributes are supported. |
|queryParam|`ksl-enabled`|Name of the query parameter that must be present in the URL to turn the smart link injection on. It is not necessary for query parameter to have a truthy value (just the presence of this query parameter is checked). If set to falsy value ('', null), the smart link injection will always be enabled. Query parameter is only used outside Web Spotlight.|

### Customization

The following [custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) can be used to customize the
visuals of the SDK output.

|Custom property|Default|Description|
|---|:---:|---|
|--ksl-color-background-default|`rgba(255, 255, 255, 1)`|Default background color used in toolbar and popover.|
|--ksl-color-background-default-disabled|`rgba(223, 223, 223, 1)`|Disabled background color for buttons inside toolbar and popover.|
|--ksl-color-background-default-hover|`rgba(21, 21, 21, 0.1)`|Hover background color for buttons inside toolbar and popover.|
|--ksl-color-background-default-selected|`rgba(255, 240, 239, 1)`|Selected background color for buttons inside toolbar and popover.|
|--ksl-color-background-secondary|`rgba(20, 22, 25, 1)`|Secondary background color used in tooltips.|
|--ksl-color-primary|`rgba(219, 60, 0, 1)`|Primary color used as a hover border color in highlights and as a background color in add buttons.|
|--ksl-color-primary-hover|`rgba(149, 48, 0, 1)`|Primary color used as a hover background color in add buttons.|
|--ksl-color-primary-transparent|`rgba(219, 60, 0, 0.5)`|Primary color with transparency used as a default border color in highlights.|
|--ksl-color-text-default|`rgba(255, 255, 255, 1)`|Text color used on a default background (buttons inside toolbar and popover).|
|--ksl-color-text-default-disabled|`rgba(140, 140, 140, 1)`|Disabled text color used on a default background.|
|--ksl-color-text-secondary|`rgba(21, 21, 21, 1)`|Text color used inside tooltips and add buttons.|
|--ksl-shadow-default|`0 8px 32px rgba(16, 33, 60, 0.24), 0 0 8px rgba(0, 0, 0, 0.03)`|Default shadow for toolbar.|
|--ksl-shadow-primary|`0 8px 10px rgba(219, 60, 0, 0.2), 0 6px 20px rgba(219, 60, 0, 0.12), 0 8px 14px rgba(219, 60, 0, 0.14)`|Shadow for add buttons.|
|--ksl-z-index|`9000`|Base value of z-index used for calculation of individual values for each ksl-element type|

For example, if you want to override all SDK colors and shadows for all SDK elements on the page, you can do it by
changing the values of all available custom properties of a `:root` element in your CSS or inside a new `<style>` tag on
your page.

```css
:root {
    --ksl-color-background-default: rgba(4, 102, 200, 1);
    --ksl-color-background-default-disabled: rgba(2, 62, 125, 1);
    --ksl-color-background-default-hover: rgba(0, 40, 85, 0.1);
    --ksl-color-background-secondary: rgba(2, 62, 125, 1);
    --ksl-color-background-default-selected: rgba(3, 83, 164, .1);
    --ksl-color-primary: rgba(4, 102, 200, 1);
    --ksl-color-primary-transparent: rgba(4, 102, 200, 0.5);
    --ksl-color-primary-hover: rgba(2, 62, 125, 1);
    --ksl-color-text-default: rgba(255, 255, 255, 1);
    --ksl-color-text-default-disabled: rgba(51, 65, 92, 1);
    --ksl-color-text-secondary: rgba(255, 255, 255, 1);
    --ksl-shadow-default: 0 8px 32px rgba(0, 24, 69, 0.24), 0 0 8px rgba(0, 0, 0, 0.03);
    --ksl-shadow-primary: 0 8px 10px rgba(4, 102, 200, 0.2), 0 6px 20px rgba(4, 102, 200, 0.12), 0 8px 14px rgba(4, 102, 200, 0.14);
    --ksl-z-index: 9000;
}
```

### Preview autorefresh in Web Spotlight

When working with the in-context editor in Web Spotlight, it is good to keep the content of your preview fresh without
having to refresh it manually after every change. Starting from version 2.2.0, the Smart Link SDK supports the preview
autorefresh feature in Web Spotlight.

For your web apps to support the preview autorefresh feature, make sure that your preview environment:

1. Uses the latest version of the Smart Link SDK.
2. Has the `X-KC-Wait-For-Loading-New-Content` header set to `true` when fetching data from Delivery Preview API.

If both previously mentioned conditions are met, Web Spotlight will wait for your changes to be ready via the Delivery
Preview API, and after that, the preview will be refreshed automatically.

#### Implementing custom refresh handler

In some cases, simply refreshing the page might not be enough. For example, if you use a static site generator for your
preview, you need to trigger the rebuild of the page before refreshing it. Or maybe you don't want to refresh the entire
page when a single item has been updated and would rather re-render only the affected place in the UI. In some cases,
simply refreshing the preview page after the change in Web Spotlight is not enough.

That's why the Smart Link SDK supports the custom refresh handler, which allows you to specify how your web page reacts
to refresh events received from Web Spotlight. If you register a custom refresh handler, it will be called instead of a
default handler every time when refresh is triggered in Web Spotlight (both manually and automatically).

You can implement a custom refresh handler using
the `.on(KontentSmartLinkEvent.Refresh, (data, metadata, originalRefresh) => {})` method on the SDK instance:

```ts
import KontentSmartLink, { KontentSmartLinkEvent } from '@kontent-ai/smart-link';

const sdk = KontentSmartLink.initialize({ ... });

sdk.on(KontentSmartLinkEvent.Refresh, (data, metadata, originalRefresh) => {
  // your custom refresh logic
});
```

A custom refresh handler takes three arguments:

|Argument|Type|Description|
|---|---|---|
|Data| { projectId: string, languageCodename: string, updatedItemCodename: string } &#124; undefined | Information about updated item, that caused autorefresh. It is only available when refresh is triggered automatically. |
|Metadata| { manualRefresh: boolean } | Manual refresh is set to `true` when the refresh is triggered by user. |
|Original refresh| () => void | Default refresh handler.|

You can then unregister the custom refresh handler using the `.off` method on the SDK instance.

##### Examples

###### Re-fetching item data without fully refreshing in React

It is possible to only update the affected place of the UI by re-fetching page data instead of refreshing the whole
page. The following code sample shows how this could be implemented in a React application.

```ts
import KontentSmartLink, { KontentSmartLinkEvent } from '@kontent-ai/smart-link';

const PageContent: React.FC = () => {
  const [data, setData] = useState(null);
  const fetchData = useCallback((projectId, languageCodename, itemCodename) => {...}, []);

  useEffect(() => {
    const sdk = KontentSmartLink.initialize();

    // register custom refresh handler to avoid full refresh in some cases
    sdk.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      // if user triggered the refresh manually, just refresh the page
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        // refetch data for the updated item, instead of refreshing the whole page
        const { projectId, languageCodename, updatedItemCodename } = data;
        fetchData(projectId, languageCodename, updatedItemCodename);
      }
    });

    return () => {
      sdk.destroy();
    };
  }, [fetchData]);

  return (...);
};
```

###### Sending request to rebuild the SSG page before refreshing it (Netlify + Gatsby)

When using static site generators, you have to rebuild your website in order to apply your changes. The following
example shows how this could be done using a custom refresh handler. In this example, we used Gatsby deployed to
Netlify, but the solution for other SSG frameworks should be similar.

The `deploy-status` function is a custom Netlify function used to get the status of the last deploy, so that we can
check if the deployment is finished and the page can be refreshed.

```ts
// ./.netlify/functions/deploy-status.js
import fetch from 'node-fetch';

const siteId = process.env.NETLIFY_SITE_ID;
const token = process.env.NETLIFY_TOKEN;

const handler = async event => {
  try {
    const endpoint = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
    const result = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await result.json();

    // first entry is last deploy
    const deploy = {
      state: data[0].state,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(deploy),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}

module.exports = { handler };
```

We trigger rebuild process inside our custom refresh handler and wait for the deployment process to finish.
After that the page can be refreshed using the `originalRefresh` callback.

```ts
// inside a component used as a wrapper for all pages

// This function triggers the build hook defined on Netlify, which
// starts deployment process on Netlify. This is required to get new data
// to preview.
//
// This is just the PoC. In a real app, we need to kill the previous active deploy, before
// starting a new one.
const triggerRebuildOnNetlifyAndWaitForDeploy = useCallback(() => {
  fetch('https://api.netlify.com/build_hooks/{HOOK_ID}?trigger_title=autorefresh', {
    method: 'POST',
  }).then(() => {
    async function checkDeployStatus() {
      // 'deploy-status' is a custom Netlify function that returns status of the last deploy
      const buildReq = await fetch('/.netlify/functions/deploy-status');
      const buildData = await buildReq.json();

      // display a loader to users to let them know rebuild is in progress
      setRebuildInProgress(buildData.state !== 'ready');

      if (buildData.state === 'ready') {
        resolve();
      } else {
        setTimeout(checkDeployStatus, 3000);
      }
    }

    checkDeployStatus();
  })
}, []);

useEffect(() => {
  const plugin = KontentSmartLink.initialize({
    queryParam: 'preview-mode',
  });

  // custom refresh handler
  plugin.on('refresh', (data, metadata, originalReload) => {
    // You can trigger the rebuild of the page, wait for it to finish and refresh the page after that.
    // Please consider displaying some sort of loader to your users, in case rebuild process takes time, to let them
    // know that the refresh is in progress.
    triggerRebuildOnNetlifyAndWaitForDeploy().then(originalReload)
  });

  return () => {
    plugin.destroy();
  }
}, [triggerRebuildOnNetlifyAndWaitForDeploy]);
```

For even better experience, you can combine the previous two methods and re-fetch content from Delivery Preview API
on the client-side to update affected placed while waiting for the rebuild process to finish.

### Live preview in Web Spotlight

> :warning: **Warning:** This feature is in early access meaning that the API is subject to change.

Starting from version 3.2.0-next.0, Smart Link SDK support live preview in Web Spotlight. If your preview website 
uses the supported SDK version, Kontent.ai will send the updated elements to your website via the iframe communication 
right after you update them in the in-context editor. 

**Please note, that your preview website won't update automatically, and it is up to you to decide how to handle this new event in your application.**

#### Setting up live preview in your app

```ts
import KontentSmartLink, { KontentSmartLinkEvent  } from '@kontent-ai/smart-link';

const sdk = KontentSmartLink.initialize({ ... });

sdk.on(KontentSmartLink.Update, (data: IUpdateMessageData) => {
  // update the state of your app with the new data here
});
```

#### Data contract

The update event handler receive data of type IUpdateMessageData which contains all necessary information about the element
changed by user in the Kontent.ai app.

```ts
interface IUpdateMessageData {
  projectId: string;
  variant: {
    id: string;
    codename: string;
  };
  item: {
    id: string;
    codename: string;
  };
  elements: ReadonlyArray<{
    element: {
      id: string;
      codename: string;
    };
    type: ElementType,
    data: Omit<Element, 'type' | 'name'>
  }>;
}
```

You can find [ElementType](https://github.com/kontent-ai/delivery-sdk-js/blob/v14.6.0/lib/elements/element-type.ts) and [Element](https://github.com/kontent-ai/delivery-sdk-js/blob/v14.6.0/lib/elements/elements.ts) definition in @kontent-ai/delivery-sdk repository.

#### Current limitations

Since the live preview feature is currently in early access, there are some limitations:
- Kontent.ai doesn't notify SDK about the changes in a linked item element or a subpages element.
- Kontent.ai doesn't notify SDK about the changes in a rich-text element if:
  - this rich-text element contains a linked item or a content component
  - this rich-text element contains a link to a linked item with a URL slug.

### Using SDK inside and outside Web Spotlight

When Kontent.ai Smart Link SDK is used outside Web Spotlight, it listens to the query parameters in the URL to toggle smart
link injection. The name of the query parameter defaults to `ksl-enabled`, but can be changed using the `queryParam`
configuration argument of the `initialize` or `initializeOnLoad` methods. Only the presence of the query parameter is
checked and its value is ignored, so all the following options are valid: `?ksl-enabled=true`, `?ksl-enabled=false`
, `?ksl-enabled`, etc.

If you set the query parameter to a false value (null, ""), then the SDK will always be enabled.

If the SDK detects it is run inside an iframe at the beginning of the initialization process, it will try to connect to
the Web Spotlight by sending an iframe message to the parent window. If Web Spotlight response is received, query
parameter detection will be turned off and additional features (more in the smart link types section) will be enabled.
Else the SDK will continue to work as if it was outside Web Spotlight (query parameters detection, redirects to Kontent.ai,
etc.)

#### IFrame Communication

When running inside Web Spotlight preview iframe, Kontent.ai Smart Link SDK enables several additional features and sends
iframe messages instead of redirecting user to Kontent.ai page. All message types are listed below.

|Message|Data|Origin|Description|
|---|:---:|:---:|---|
|kontent-smart-link:initialized|<code>{ projectId: string &#124; null, languageCodename: string &#124; null, enabled: boolean }</code>|SDK|This message is sent by the SDK when it is initialized.|
|kontent-smart-link:initialized:response|-|Host|This message is sent by the host as a response to initialized message.|
|kontent-smart-link:status|<code>{ enabled: boolean }</code>|Host|This message is used to toggle the SDK features.|
|kontent-smart-link:element:clicked|<code>{ projectId: string, languageCodename: string, itemId: string, contentComponentId?: string, elementCodename: string }</code>|SDK|This message is sent by the SDK when element with `data-kontent-element-codename` attribute is clicked.|
|kontent-smart-link:content-component:clicked|<code>{ projectId: string, languageCodename: string, itemId: string, contentComponentId: string }</code>|SDK|This message is sent by the SDK when element with `data-kontent-component-id` attribute is clicked.|
|kontent-smart-link:content-item:clicked|<code>{ projectId: string, languageCodename: string, itemId: string }</code>|SDK|This message is sent by the SDK when element with `data-kontent-item-id` attribute is clicked.|
|kontent-smart-link:add:initial|<code>{ projectId: string, languageCodename: string, itemId: string, contentComponentId?: string, elementCodename: string, insertPosition: { targetId?: string, placement: 'start' &#124; 'end' &#124; 'before' &#124; 'after', } }</code>|SDK|This message is sent by the SDK when add button is clicked.|
|kontent-smart-link:add:initial:response|<code>{ elementType: 'LinkedItems' &#124; 'RichText' &#124; 'Unknown', isParentPublished: boolean, permissions: Map<string,string> }</code>|Host|This message is sent by the host as a response to initial add button click.|
|kontent-smart-link:add:action|<code>{ projectId: string, languageCodename: string, itemId: string, contentComponentId?: string, elementCodename: string, action: string, insertPosition: { targetId?: string, placement: 'start' &#124; 'end' &#124; 'before' &#124; 'after', } }</code> |SDK|This message is sent by the SDK when add button action is clicked.|
|kontent-smart-link:preview:refresh|<code>{ projectId: string, languageCodename: string, updatedItemCodename: string }</code> &#124; undefined|Host|This message is sent when preview has to be refreshed.|
|kontent-smart-link:preview:current-url|-|Host|This message is sent by host as a request to get URL of current iframe.|
|kontent-smart-link:preview:current-url:response|<code>{ previewUrl: string }</code>|SDK|This message is sent by SDK as a response on the `kontent-smart-link:preview:current-url` message.|

#### Nested iframes

There may be some cases when you would want to put your page into another iframe (e.g. to simulate a mobile device
resolution). But if you then load your nested iframe page inside Web Spotlight preview tab, it would act as if it wasn't
inside Web Spotlight. This happens because the initialization message sent from SDK to Kontent.ai gets lost in the parent
iframe. You can use the following workaround to fix the issue: https://github.com/kontent-ai/smart-link/issues/16.

### Examples

#### HTML & UMD & CDN

```html

<html>
  <head>
    <title>Kontent.ai Smart Link - HTML example</title>
    <script type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/@kontent-ai/smart-link@2.0.0/dist/kontent-smart-link.umd.min.js"></script>
    <script type="text/javascript">
      KontentSmartLink.initializeOnLoad({ queryParam: "preview" });
    </script>
  </head>
  <body data-kontent-project-id="1d50a0f7-9033-48f3-a96e-7771c73f9683" data-kontent-language-codename="en-US">
    <nav class="navigation" data-kontent-item-id="6ea11626-336d-47e5-9f35-2d44fa1ad6d6">
      <img class="navigation__logo" data-kontent-element-codename="logo" />
      <ul
        class="navigation__list"
        data-kontent-element-codename="navigation"
        data-kontent-add-button
        data-kontent-render-position="left"
        data-kontent-insert-position="start"
      >
        <li class="navigation__list-item" data-kontent-component-id="036acd8f-5e6d-4023-b0f8-a4b8e0b573b1">
          <span data-kontent-element-codename="title">Home</span>
        </li>
        <li class="navigation__list-item" data-kontent-component-id="f539f1bc-9dc4-4df5-8876-dbb1de5ae6eb">
          <span data-kontent-element-codename="title">About us</span>
        </li>
      </ul>
    </nav>
    <div
      class="page"
      data-kontent-item-id="af858748-f48a-4169-9b35-b10c9d3984ef"
      data-kontent-element-codename="page_content"
    >
      <div
        class="section"
        data-kontent-component-id="51a90561-9084-4d32-9e34-80da7c88c202"
        data-kontent-add-button
        data-kontent-add-button-render-position="bottom"
        data-kontent-add-button-insert-position="after"
      >
        <img class="home__banner" data-kontent-element-codename="image" />
        <h1 data-kontent-element-codename="title">Home page</h1>
      </div>
      <div
        class="section"
        data-kontent-component-id="23e657d2-e4ce-4878-a77d-365db46c956d"
        data-kontent-add-button
        data-kontent-add-button-render-position="bottom"
        data-kontent-add-button-insert-position="after"
      >
        <p data-kontent-element-codename="text">...</p>
      </div>
    </div>
  </body>
</html>
```

#### ES6

```js
import KontentSmartLink from "@kontent-ai/smart-link";

// This is just an example of SDK initialization inside ES6 module.
// HTML markup should still contain all necessary data-attributes.
const kontentSmartLink = KontentSmartLink.initializeOnLoad({
  debug: true,
  defaultDataAttributes: {
    projectId: "1d50a0f7-9033-48f3-a96e-7771c73f9683",
    languageCodename: "default",
  },
  queryParam: "ksl-preview"
});
```

#### Next.js

In order to use the SDK with the Next.js framework you can either initialize it separately on each page or initialize it
once for the whole application using the `_app.jsx` file. Do not forget to `destroy()` SDK for it to work properly.

```js
// _app.jsx
import KontentSmartLink from "@kontent-ai/smart-link";

const MyApp = ({
  Component,
  pageProps
}) => {
  useEffect(() => {
    // This is just an example of SDK initialization inside ES6 module.
    // HTML markup should still contain all necessary data-attributes (e.g. PageSection component).
    const kontentSmartLink = KontentSmartLink.initialize({
      defaultDataAttributes: {
        projectId: "1d50a0f7-9033-48f3-a96e-7771c73f9683",
        languageCodename: "default",
      },
      queryParam: "preview-mode"
    });

    return () => {
      kontentSmartLink.destroy();
    };
  });

  return (
    <PageSection>
      <Component {...pageProps} />
    </PageSection>
  );
};

const PageSection = (props) => {
  return (
    <div data-kontent-item-id="3fdbc5a0-13e6-4516-82c3-50bf4db43644">
      <div data-kontent-element-codename="page_section__content">
        {props.children}
      </div>
    </div>
  );
};
```

Additionally, you may encounter an issue with `SameSite` cookies not being set correctly. This can be solved by utilizing the code snippet below in your [API route handling preview](https://nextjs.org/docs/advanced-features/preview-mode) file to replace `SameSite=Lax` to `SameSite=None; Secure;` right after `res.setPreviewData` call.

```js
const setCookieSameSite = (res, value) => {
    const cookies = res.getHeader("Set-Cookie");
    const updatedCookies = cookies?.map((cookie) =>
        cookie.replace(
            "SameSite=Lax",
            `SameSite=${value}; Secure;`
        )
    )
    res.setHeader(
        "Set-Cookie",
        updatedCookies
    );
};
export default function handler(req, res) {
    // ...
    res.setPreviewData({})

    // THIS NEEDED TO BE ADDED
    setCookieSameSite(res, "None");
    // ...
}
```

### Gatsby

You can either initialize the SDK on every page or use a layout to initialize the SDK while using Gatsby. Do not forget
to `destroy()` SDK for it to work properly.

```js
// src/components/layout.jsx
import KontentSmartLink from "@kontent-ai/smart-link";

export default function Layout({ children }) {
  useEffect(() => {
    // This is just an example of SDK initialization inside ES6 module.
    // HTML markup should still contain all necessary data-attributes (e.g. .layout element).
    const kontentSmartLink = KontentSmartLink.initialize({
      queryParam: "enable-ksl-sdk"
    });
    return () => {
      kontentSmartLink.destroy();
    };
  });

  return (
    <div
      class="layout"
      data-kontent-project-id="1d50a0f7-9033-48f3-a96e-7771c73f9683"
      data-kontent-language-codename="en-US"
    >
      {children}
    </div>
  );
}
```

## Tests

### Unit tests

Since this SDK highly depends on browser APIs, the unit tests are run by Karma test runner (+ Jasmine) inside Chrome
browser. To run all tests in a watch mode you can use the `npm run test:unit` command. To run all tests only once you
can use the `npm run test:unit:ci` command. All unit tests are located in the `test-browser` folder.

### Visual regression tests

Visual regression testing is implemented using Storybook and Loki. Each story in Storybook represents a test case, which
is then used by Loki to generate screenshots. In order to run visual regression tests you need to start Storybook using
the `npm run storybook` command and then start loki testing using the `npm run test:visual` command. Or you can use
the `npm run test:visual:ci` command to automatically start the Storybook server in a CI mode and run visual tests.

Visual regression tests use the built version of SDK, so before running them make sure you rebuild the SDK after the
last change you made. You can this using the `npm run build` command or using the `npm run dev` command to start build
in a watch mode.

Please note that the reference screenshots for visual regression tests are created on the `ubuntu-latest` environment,
which is utilized in our GitHub Action workflow for visual tests. It means tests could (and probably will) fail on
Windows. In case the visual regression tests fail during a pull request, and you need to update reference screenshots,
you can locate the new screenshots in the failed GitHub Action run. Navigate to the Artifacts section (`.loki/current`)
of the failed run to find the updated screenshots.

## Breaking changes

All breaking changes can be found in [a separate markdown file](BREAKING.md).

## Feedback & Contribution

Feedback & Contributions are welcomed. Feel free to take/start an issue & submit PR.

