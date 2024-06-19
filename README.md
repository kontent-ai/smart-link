# Kontent.ai Smart Link SDK

![licence](https://img.shields.io/github/license/kontent-ai/smart-link)
![npm](https://img.shields.io/npm/v/@kontent-ai/smart-link)
![downloads](https://img.shields.io/npm/dt/@kontent-ai/smart-link)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@kontent-ai/smart-link)

###### [Usage](#usage) | [Contributing](https://github.com/kontent-ai/.github/blob/main/CONTRIBUTING.md) | [Troubleshooting](https://github.com/kontent-ai/smart-link/blob/master/TROUBLESHOOTING.md) | [Breaking changes](https://github.com/kontent-ai/smart-link/blob/master/BREAKING.md)

Kontent.ai Smart Link SDK simplifies and enhances the process of editing and managing web content
in [Web Spotlight](https://kontent.ai/features/webspotlight/) by embedding "smart links" into your web pages.
These smart links, defined by specific [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp) you set,
create a direct bridge to the Kontent.ai CMS. This allows content creators and editors to quickly navigate
from the preview website to the corresponding content in the Kontent.ai platform for editing or previewing.

:warning: **Important note:** Kontent.ai Smart Link SDK is **a browser-only SDK**, which means that the Node.js
environment is not currently supported. Make sure to always initialize the Smart Link SDK in a browser context.

## Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
    * [Quickstart](#quickstart)
    * [Data attributes](#data-attributes)
    * [Smart links](#smart-links)
    * [SDK initialization](#sdk-initialization)
        * [Configuration](#configuration)
        * [Customization](#customization)
    * [Preview autorefresh in Web Spotlight](#preview-autorefresh-in-web-spotlight)
    * [Live preview in Web Spotlight](#live-preview-in-web-spotlight)
    * [Outside Web Spotlight](#outside-web-spotlight)
    * [Inside Web Spotlight](#inside-web-spotlight)
* [Examples](#examples)
    * [HTML & UMD & CDN](#html--umd--cdn)
    * [ES6](#es6)
    * [React](#react)
        * [Creating the SmartLink context](#creating-the-smartlink-context)
        * [Optimizing content updates in React with custom refresh logic](#optimizing-content-updates-in-react-with-custom-refresh-logic)
        * [Triggering SSG rebuilds with custom refresh logic](#triggering-ssg-rebuilds-with-custom-refresh-logic)
        * [Live Preview in Your Application](#live-preview-in-your-application)
* [Known issues](#known-issues)
    * [Nested iframes](#nested-iframes)
    * [SameSite cookie in Next.js app](#samesite-cookie-in-nextjs-app)
* [Tests](#tests)
    * [Unit tests](#unit-tests)
    * [Visual regression tests](#visual-regression-tests)
* [Breaking changes](#breaking-changes)
* [Feedback & Contribution](#feedback--contribution)

## Features

- ✏️ **Edit Smart Links:** Quickly navigate from your website's preview to the corresponding content in Kontent.ai,
  making content editing seamless and efficient.
- ➕ **Add Smart Links:** Simplify the addition of modular content directly from your preview, enhancing content
  management without leaving the web context.
- 🔄️ **Automatic Reloads/Rebuilds:** Set up the automatic webpages reloads when your content is ready in the Delivery
  Preview API, ensuring your preview always reflects the latest saved changes.
- 👀 **Live Preview:** Experience real-time content changes even before they're saved, enabling a dynamic editing process
  that boosts productivity.

## Installation

You can install this library using `npm` or using global CDNs such as `jsdelivr`.

### npm

```
npm i @kontent-ai/smart-link
```

### jsdelivr

When you include the UMD bundle of this library in the `script` tag of your HTML page, an SDK becomes available
under the `KontentSmartLink` global variable. Both the JS bundle and its minified version can be found
in the `dist` folder.

- `dist/kontent-smart-link.umd.min.js`
- `dist/kontent-smart-link.umd.js`

#### kontent-smart-link.umd.js

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kontent-ai/smart-link@latest/dist/kontent-smart-link.umd.js?compression=gzip)

```html

<script type='text/javascript'
        src='https://cdn.jsdelivr.net/npm/@kontent-ai/smart-link@latest/dist/kontent-smart-link.umd.js'></script>
```

##### kontent-smart-link.umd.min.js

![Gzip browser bundle](https://img.badgesize.io/https://unpkg.com/@kontent-ai/smart-link@latest/dist/kontent-smart-link.umd.min.js?compression=gzip)

```html

<script type='text/javascript'
        src='https://cdn.jsdelivr.net/npm/@kontent-ai/smart-link@latest/dist/kontent-smart-link.umd.min.js'></script>
```

To prevent potential issues from arising due to breaking changes, it is recommended to replace `@latest` with a specific
version number.

## Usage

### Quickstart

To integrate the Kontent.ai Smart Link SDK into your web project and enable smart link injection, follow these steps:

1. **Include SDK:** Add the SDK to your project. You can do this by installing it from npm or embedding
   the UMD bundle in the `script` tag of your HTML page.
2. **Specify HTML data attributes:** Define the HTML data attributes on your webpage elements where you want
   the smart links to appear. Detailed guidance on setting these attributes can be found [here](#data-attributes).
    ```html
    <main data-kontent-project-id='00000000-0000-0000-0000-000000000000' data-kontent-language-codename='default'>
      <div data-kontent-item-id='00000000-0000-0000-0000-000000000000'>
        <div data-kontent-element-codename='title'>Title</div>
      </div>
    </main>
   ```
3. **Initialization:** Initialize the SDK in your code to create the smart link to Kontent.ai. You can read more about
   SDK initialization [here](#sdk-initialization).
    ```ts
   const instance = KontentSmartLink.initialize({
      defaultDataAttributes: {
        projectId: '00000000-0000-0000-0000-000000000000',
        languageCodename: 'default', 
      },
   });
   ```
4. **Set up the custom autorefresh behavior (optional):** The automatic page refresh feature after content is available
   on Delivery Preview API is enabled out of the box. However, in some situations you may need to define some custom
   behavior. You can read more about it [here](#preview-autorefresh-in-web-spotlight).
5. **Set up the live preview (optional):** Make sure your website know how to react to the live preview messages from
   Kontent.ai. You can read more about live preview [here](#live-preview-in-web-spotlight).

For more complex examples, check the [Examples](#examples) section.

### Data attributes

The Kontent.ai Smart Link SDK relies heavily on manually specified data attributes in your HTML markup to function
properly. These attributes are essential for the SDK to identify where and how to integrate smart links into
your content, they also enable the SDK to access necessary information, such as the Kontent.ai project ID and element
codenames. **It's important to note that the SDK does not automatically insert these data attributes into your HTML.
You are responsible for adding them manually.**

#### Available data attributes

| Attribute                                 |                                                                                                     Value                                                                                                      | Description                                                                                                                                                 |
|-------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data-kontent-project-id`                 |                                                                                                      guid                                                                                                      | Kontent.ai environment ID.                                                                                                                                  |
| `data-kontent-language-codename`          |                                                                                                     string                                                                                                     | Kontent.ai language codename.                                                                                                                               |
| `data-kontent-item-id`                    |                                                                                                      guid                                                                                                      | Content item ID.                                                                                                                                            |
| `data-kontent-component-id`               |                                                                                                      guid                                                                                                      | [Content component](https://kontent.ai/learn/tutorials/write-and-collaborate/structure-your-content/structure-your-content#a-create-single-use-content) ID. |
| `data-kontent-element-codename`           |                                                                                                     string                                                                                                     | Content type element codename.                                                                                                                              |
| `data-kontent-add-button`                 |                                                                                                       -                                                                                                        | Specifies that node should have add-button rendered near it.                                                                                                |
| `data-kontent-add-button-insert-position` |                                                                              `start` &#124; `before` &#124; `after` &#124; `end`                                                                               | Specifies the insert position of an item/content component added using add button.                                                                          |
| `data-kontent-add-button-render-position` | `bottom-start` &#124; `bottom` &#124; `bottom-end` &#124; `left-start` &#124; `left` &#124; `left-end` &#124; `top-start` &#124; `top` &#124; `top-end` &#124; `right-start` &#124; `right` &#124; `right-end` | Specifies visual location of add button.                                                                                                                    |
| `data-kontent-disable-features`           |                                                                                                  `highlight`                                                                                                   | Specifies that the selected node should not have highlight (which includes edit smart links). Useful when there are too many smart links on your page.      |

#### Data attributes hierarchy

Setting up data attributes in a hierarchical structure is a strategic approach to simplify your integration
with the Kontent.ai Smart Link SDK. This method eliminates the need to repeat attributes across multiple elements,
making your code cleaner and more maintainable.

##### Hierarchical setup explained:

- **Project-Level Attributes:** Begin by assigning the `data-kontent-project-id` attribute to a high-level element,
  such as the `<body>` tag. That approach ensures that all elements within the body inherit this project identifier,
  linking them to your specific Kontent.ai project. Similarly, if your content is published in a single language,
  assign the `data-kontent-language-codename` alongside the project ID to establish the language context for all
  contained elements.
- **Content-Specific Attributes:** Next, identify elements representing individual content items or components within
  your webpage. Assign each a `data-kontent-item-id`, making these elements recognizable to the SDK as distinct
  pieces of content. For elements corresponding to specific fields or components within these elements, use
  the `data-kontent-element-codename` to map each directly to its counterpart in Kontent.ai.
- **Nested Content:** In scenarios involving rich text or linked items that contain additional content elements,
  continue this hierarchical assignment. Place relevant item or component IDs on their respective container elements.
- **[Content Components](https://kontent.ai/learn/create/add-structure-to-your-content/single-use-content-no-problem):**
  Unlike standard content items, content components are designed to be used within a specific rich text element
  and do not appear as standalone items in you Content Inventory. To effectively integrate these content components
  with the Kontent.ai Smart Link SDK, it's essential to mark them with the `data-kontent-component-id` attribute
  within your HTML, ensuring it's correctly linked to its parent content item in the CMS.

### Smart links

The Kontent.ai Smart Link SDK supports four distinct types of smart links, each designed to enhance
your content editing workflow. These smart links are powered by the data attributes from the previous section and
primarily function within the Web Spotlight preview iframe.

#### Edit element smart link

This smart link enables direct editing of a content item's specific element within the preview. When clicked:

- **Inside Web Spotlight:** Opens the In-Context editor, focusing on the selected element.
- **Outside Web Spotlight:** Redirects to the corresponding item in the Kontent.ai editor.

**Data Attributes:** `data-kontent-project-id`, `data-kontent-language-codename`, `data-kontent-item-id`,
`data-kontent-component-id?` (optional), and `data-kontent-element-codename`.

```html

<div data-kontent-project-id='00000000-0000-0000-0000-000000000000' data-kontent-language-codename='default'>
  <section data-kontent-item-id='00000000-0000-0000-0000-000000000000'>
    <div data-kontent-element-codename='codename'>Content</div>
  </section>
</div>
```

#### Edit content component smart link

This smart link enables direct editing of content components within the preview. It triggers the In-Context editor
and brings the component into view.

**Availability:** Exclusive to the Web Spotlight environment.

**Data attributes:** `data-kontent-project-id`, `data-kontent-language-codename`, `data-kontent-item-id`,
and `data-kontent-component-id`.

```html

<div data-kontent-project-id='00000000-0000-0000-0000-000000000000' data-kontent-language-codename='default'>
  <section data-kontent-item-id='00000000-0000-0000-0000-000000000000'>
    <div data-kontent-component-id='00000000-0000-0000-0000-000000000000'>
      <div>Article</div>
      <div>Content</div>
    </div>
  </section>
</div>
```

#### Edit content item smart link

This smart link enables the editing of entire content items through a preview click, opening the In-Context editor.

**Availability:** Exclusive to the Web Spotlight environment.

**Data attributes:** `data-kontent-project-id`, `data-kontent-language-codename`, and `data-kontent-item-id`.

```html

<div data-kontent-project-id='00000000-0000-0000-0000-000000000000' data-kontent-language-codename='default'>
  <section data-kontent-item-id='00000000-0000-0000-0000-000000000000'>
    <div>Article</div>
    <div>Content</div>
  </section>
</div>
```

#### Add content smart link

This smart link enables the addition of new modular content directly within your page's preview,
supporting both rich-text and linked item elements.

**Availability:** Exclusive to the Web Spotlight environment.

##### Fixed add content smart link

Fixed add content smart link positions new content at predetermined points of
the target rich-text or linked items (`start` or `end`).

**Data attributes:** `data-kontent-project-id`, `data-kontent-language-codename`, `data-kontent-item-id`,
`data-kontent-component-id?` (optional),
`data-kontent-element-codename` (codename of the rich-text or linked items element),
`data-kontent-add-button`, `data-kontent-add-button-render-position?`, `data-kontent-add-button-insert-position=start|end`.

```html

<div data-kontent-project-id='00000000-0000-0000-0000-000000000000' data-kontent-language-codename='default'>
  <section data-kontent-item-id='00000000-0000-0000-0000-000000000000'>
    <div
      data-kontent-element-codename='rich-text-element-codename'
      data-kontent-add-button
      data-kontent-render-position='bottom'
      data-kontent-insert-position='end'
    >
      ...
    </div>
  </section>
</div>
```

##### Relative add content smart link

Relative add content smart link allows new content to be placed relative to existing elements (`before` or `after`).
For example, you can insert a new content component before or after the existing content component in rich-text element.
To turn add content smart link into a relative one, you need to set `data-kontent-insert-position`
to `before` or `after` and provide target id on the same node
using `data-kontent-item-id` or `data-kontent-component-id` attribute.

**Data attributes:** `data-kontent-project-id`, `data-kontent-language-codename`, `data-kontent-item-id`,
`data-kontent-component-id?` (optional),
`data-kontent-element-codename` (codename of the rich-text or linked items element),
`data-kontent-item-id|data-kontent-component-id` (target item), `data-kontent-add-button`,
`data-kontent-add-button-render-position?`, `data-kontent-add-button-insert-position=before|after`.

```html

<div data-kontent-project-id='00000000-0000-0000-0000-000000000000' data-kontent-language-codename='default'>
  <section data-kontent-item-id='00000000-0000-0000-0000-000000000000'>
    <div data-kontent-element-codename='rich-text-element-codename'>
      <div
        data-kontent-component-id='00000000-0000-0000-0000-000000000000'
        data-kontent-add-button
        data-kontent-render-position='start'
        data-kontent-insert-position='before'
      >...
      </div>
    </div>
  </section>
</div>
```

### SDK initialization

To activate the Kontent.ai Smart Link SDK on your website, you need to initialize it after setting up all required
data attributes. The SDK offers two methods for initialization:

- `initialize`: Instantly initializes the SDK, making it ready to use. This method is ideal when your webpage
  is fully loaded or when SDK initialization occurs after the document's `DOMContentLoaded` event.
    ```ts
    const instance = KontentSmartLink.initialize({ queryParam: "preview" });
    ```
- `initializeOnLoad`: Delays SDK initialization until the entire page has loaded. This approach is particularly useful
  for including the SDK in the `<head>` of your webpage, ensuring that all page elements are fully loaded before
  initialization begins.
    ```ts
    KontentSmartLink.initializeOnLoad().then(instance => {
      // SDK is fully initialized and ready to use
    });
    ```

Both methods return an SDK instance, with `initializeOnLoad` returning a promise that resolves to an instance.
It is important to manage this instance appropriately:

- **Accessing the SDK instance:** Store the returned instance if you need to access SDK methods after initialization.
- **Resource management:** The SDK leverages event listeners, timeouts, and observers to function properly. To prevent
  memory leaks or unintended behavior always invoke the `.destroy()` method on the SDK instance before re-initializing
  the SDK. This is crucial in single-page applications or dynamic webpages where content might be loaded multiple
  times without a full page refresh.
    ```ts
    useEffect(() => {
      const instance = KontentSmartLink.initialize();
      return () => instance.destroy(); 
    })
    ```

#### Configuration

Customize how the SDK operated on your preview website with optional configuration arguments passed during
initialization. Configuration can be adjusted post-initialization using the `setConfiguration` method.

| Attribute             |                           Default                           | Description                                                                                                                                                                                                                                                                                                                                                    |
|-----------------------|:-----------------------------------------------------------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| debug                 |                            false                            | Set to `true` to enable detailed logging, aiding in development and troubleshooting. Note: This may impact performance.                                                                                                                                                                                                                                        
| defaultDataAttributes | ```{ projectId: undefined, languageCodename: undefined }``` | Define default values for essential data attributes to streamline setup.                                                                                                                                                                                                                                                                                       |
| queryParam            |                        `ksl-enabled`                        | Name of the query parameter that must be present in the URL to turn the smart link injection on. It is not necessary for query parameter to have a truthy value (just the presence of this query parameter is checked). If set to falsy value ('', null), the smart link injection will always be enabled. Query parameter is only used outside Web Spotlight. |

#### Customization

The following [custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) can be used to customize the
visuals of the SDK output.

| Custom property                         |                                                 Default                                                  | Description                                                                                        |
|-----------------------------------------|:--------------------------------------------------------------------------------------------------------:|----------------------------------------------------------------------------------------------------|
| --ksl-color-background-default          |                                         `rgba(255, 255, 255, 1)`                                         | Default background color used in toolbar and popover.                                              |
| --ksl-color-background-default-disabled |                                         `rgba(223, 223, 223, 1)`                                         | Disabled background color for buttons inside toolbar and popover.                                  |
| --ksl-color-background-default-hover    |                                         `rgba(21, 21, 21, 0.1)`                                          | Hover background color for buttons inside toolbar and popover.                                     |
| --ksl-color-background-default-selected |                                         `rgba(255, 240, 239, 1)`                                         | Selected background color for buttons inside toolbar and popover.                                  |
| --ksl-color-background-secondary        |                                          `rgba(20, 22, 25, 1)`                                           | Secondary background color used in tooltips.                                                       |
| --ksl-color-primary                     |                                          `rgba(219, 60, 0, 1)`                                           | Primary color used as a hover border color in highlights and as a background color in add buttons. |
| --ksl-color-primary-hover               |                                          `rgba(149, 48, 0, 1)`                                           | Primary color used as a hover background color in add buttons.                                     |
| --ksl-color-primary-transparent         |                                         `rgba(219, 60, 0, 0.5)`                                          | Primary color with transparency used as a default border color in highlights.                      |
| --ksl-color-text-default                |                                         `rgba(255, 255, 255, 1)`                                         | Text color used on a default background (buttons inside toolbar and popover).                      |
| --ksl-color-text-default-disabled       |                                         `rgba(140, 140, 140, 1)`                                         | Disabled text color used on a default background.                                                  |
| --ksl-color-text-secondary              |                                          `rgba(21, 21, 21, 1)`                                           | Text color used inside tooltips and add buttons.                                                   |
| --ksl-shadow-default                    |                     `0 8px 32px rgba(16, 33, 60, 0.24), 0 0 8px rgba(0, 0, 0, 0.03)`                     | Default shadow for toolbar.                                                                        |
| --ksl-shadow-primary                    | `0 8px 10px rgba(219, 60, 0, 0.2), 0 6px 20px rgba(219, 60, 0, 0.12), 0 8px 14px rgba(219, 60, 0, 0.14)` | Shadow for add buttons.                                                                            |
| --ksl-z-index                           |                                                  `9000`                                                  | Base value of z-index used for calculation of individual values for each ksl-element type          |

These styles can be applied globally using the :root selector or scoped to specific elements for more precise theming.

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

Maintaining an up-to-date preview is essential when editing content in Web Spotlight using the in-context editor.
The Kontent.ai Smart Link SDK introduces a preview autorefresh feature from version 2.2.0 onwards, ensuring your preview
automatically updates after your changes are saved without manual refreshes.

#### Prerequisites for autorefresh

To enable autorefresh in your preview web app, ensure:

1. **SDK Version:** Your application is using the latest version of the Smart Link SDK.
2. **API Header:** The `X-KC-Wait-For-Loading-New-Content` header is set to `true` for requests to the Delivery
   Preview API.

With these conditions met, Web Spotlight automatically refreshes the preview once your changes are ready on Delivery
Preview API, streamlining the editing process.

#### Advanced: Implementing a custom refresh handler

There are scenarios where a full page refresh may not be ideal, such as when using a static site generator or when
aiming to update only a portion of the page. To accommodate diverse needs, the Smart Link SDK offers the capability
to define a custom refresh handler.

This custom handler overrides the default refresh behavior, allowing for tailored refresh logic based on your
specific requirements. Implement it as follows:

```ts
import { IRefreshMessageData } from './IFrameCommunicatorTypes';

const sdk = KontentSmartLink.initialize();

sdk.on(KontentSmartLinkEvent.Refresh, (data, metadata, originalRefresh) => {
  // Implement your custom refresh logic here
});
```

You can then unregister the custom handler using the `.off` method.

For more complex example, check the [Examples](#examples) section.

##### Parameters for the custom refresh handler

| Argument         | Type                                                                                          | Description                                                                                                                 |
|------------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Data             | { projectId: string, languageCodename: string, updatedItemCodename: string } &#124; undefined | Provides details on the updated item that caused autorefresh. It is only available when refresh is triggered automatically. |
| Metadata         | { manualRefresh: boolean }                                                                    | Manual refresh is set to `true` when the refresh was user-initiated.                                                        |
| Original refresh | () => void                                                                                    | The SDK's default refresh function.                                                                                         |

### Live preview in Web Spotlight

As of version 3.2.0, the Kontent.ai Smart Link SDK introduces support for live preview within Web Spotlight.
This feature enhances the content editing experience by providing real-time updates within your preview environment
through iframe communication immediately after edits are made in the in-context editor.

**Note:** The live preview requires manual integration to function. Your preview website will not automatically
update with changes; it is your responsibility to implement how these updates are processed and displayed in your
application.

#### Implementing live preview in your application

To set up live preview, listen for update events from the SDK. These events are triggered after content is
edited in Kontent.ai, providing you with the updated data. 
In a typical application, you would fetch the data from the Delivery API and store them in memory.
When the SDK triggers an update event, you would then update the stored items in memory to display the latest content.
To easily apply the updates on you items, you can use `applyUpdateOnItem` or `applyUpdateOnItemAndLoadLinkedItems` functions from the SDK.

```ts
import KontentSmartLink, { KontentSmartLinkEvent, applyUpdateOnItem, applyUpdateOnItemAndLoadLinkedItems } from '@kontent-ai/smart-link';

// Initialize the SDK
const sdk = KontentSmartLink.initialize({ ... });

const fetchItemsFromDeliveryApi = (itemCodenames: ReadonlyArray<string>) => client.items().inFilter(system.codename, items).toAllPromise().then(res => res.data.items);

// Listen for updates and apply them to your application
sdk.on(KontentSmartLinkEvent.Update, (data: IUpdateMessageData) => {
  // Use this data to update your application state or UI as needed e.g.:
  setItems((items) => items.map(item => applyUpdateOnItem(item, data)));
  // or
  Promise.all(items.map(item => applyUpdateOnItemAndLoadLinkedItems(item, data, fetchItemsFromDeliveryApi)))
    .then(setItems);
});
```

For more complex example, check the [Examples](#examples) section.

#### Data contract

The `Update` event delivers data of type `IUpdateMessageData`, containing detailed information about the updated
content elements:

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

You can find [ElementType](https://github.com/kontent-ai/delivery-sdk-js/blob/v14.6.0/lib/elements/element-type.ts)
and [Element](https://github.com/kontent-ai/delivery-sdk-js/blob/v14.6.0/lib/elements/elements.ts) definition in
@kontent-ai/delivery-sdk repository.

##### Modular content in live preview

Live preview updates for content items that include linked items only provide the codenames of these linked items.
To fully update your application with changes to these linked items, you may need to fetch their full details from the
Delivery Preview API after receiving the live update message. This ensures that all parts of your content are up-to-date.
You can use the `applyUpdateOnItemAndLoadLinkedItems` function to simplify this process.
The function uses the provided loader to load any items added in the update message and applies the update to the item.

Content components within rich text elements, however, are directly included in the live update messages. This means
changes to these components are immediately reflected in the live preview, without needing additional fetches.

#### Combining autorefresh and live preview

While autorefresh ensures that content updates are accurately reflected post-save, live preview offers the advantage
of immediate visual feedback before changes are saved. To maximize content management efficiency, we recommend using
live preview for instant editing feedback and relying on autorefresh to confirm that all changes are correctly saved
and displayed. This combination provides a seamless editing experience, allowing content editors to preview changes
in real-time and ensuring that the final content displayed is up-to-date with the Delivery Preview API.

### Outside Web Spotlight

When used outside of Web Spotlight, the SDK leverages URL query parameters to manage the activation of smart links.
By default, it looks for the `ksl-enabled` parameter in the webpage URL. However, this parameter can be customized
using the `queryParam` option during SDK initialization.

The SDK only checks for the presence of this query parameter, disregarding its value. As such, any of the following
configurations are considered valid:

- `?ksl-enabled=true`
- `?ksl-enabled=false`
- `?ksl-enabled`

The features that could be used outside of Web Spotlight are limited.
For detailed information about the types of smart links that are supported in this context,
please refer to the [Smart Links](#smart-links) section.

### Inside Web Spotlight

If the SDK detects that it is run inside an iframe, it attempts to connect to Web Spotlight through iframe messages
early during initialization. Upon successful communication with Web Spotlight, the SDK disables query parameter
reliance and activates additional functionalities designed for in-context editing and preview.

#### Iframe communication

The SDK and Web Spotlight exchange a series of messages for various interactions, from initialization to content
editing and refresh requests. All message types are listed below.

| Message                                         |                                                                                                                            Data                                                                                                                            | Origin | Description                                                                                             |
|-------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------:|---------------------------------------------------------------------------------------------------------|
| kontent-smart-link:initialized                  |                                                                           <code>{ projectId: string &#124; null, languageCodename: string &#124; null, enabled: boolean }</code>                                                                           |  SDK   | This message is sent by the SDK when it is initialized.                                                 |
| kontent-smart-link:initialized:response         |                                                                                                                             -                                                                                                                              |  Host  | This message is sent by the host as a response to initialized message.                                  |
| kontent-smart-link:status                       |                                                                                                             <code>{ enabled: boolean }</code>                                                                                                              |  Host  | This message is used to toggle the SDK features.                                                        |
| kontent-smart-link:element:clicked              |                                                             <code>{ projectId: string, languageCodename: string, itemId: string, contentComponentId?: string, elementCodename: string }</code>                                                             |  SDK   | This message is sent by the SDK when element with `data-kontent-element-codename` attribute is clicked. |
| kontent-smart-link:content-component:clicked    |                                                                          <code>{ projectId: string, languageCodename: string, itemId: string, contentComponentId: string }</code>                                                                          |  SDK   | This message is sent by the SDK when element with `data-kontent-component-id` attribute is clicked.     |
| kontent-smart-link:content-item:clicked         |                                                                                        <code>{ projectId: string, languageCodename: string, itemId: string }</code>                                                                                        |  SDK   | This message is sent by the SDK when element with `data-kontent-item-id` attribute is clicked.          |
| kontent-smart-link:add:initial                  |         <code>{ projectId: string, languageCodename: string, itemId: string, contentComponentId?: string, elementCodename: string, insertPosition: { targetId?: string, placement: 'start' &#124; 'end' &#124; 'before' &#124; 'after', } }</code>         |  SDK   | This message is sent by the SDK when add button is clicked.                                             |
| kontent-smart-link:add:initial:response         |                                                        <code>{ elementType: 'LinkedItems' &#124; 'RichText' &#124; 'Unknown', isParentPublished: boolean, permissions: Map<string,string> }</code>                                                         |  Host  | This message is sent by the host as a response to initial add button click.                             |
| kontent-smart-link:add:action                   | <code>{ projectId: string, languageCodename: string, itemId: string, contentComponentId?: string, elementCodename: string, action: string, insertPosition: { targetId?: string, placement: 'start' &#124; 'end' &#124; 'before' &#124; 'after', } }</code> |  SDK   | This message is sent by the SDK when add button action is clicked.                                      |
| kontent-smart-link:preview:refresh              |                                                                         <code>{ projectId: string, languageCodename: string, updatedItemCodename: string }</code> &#124; undefined                                                                         |  Host  | This message is sent when preview has to be refreshed.                                                  |
| kontent-smart-link:preview:current-url          |                                                                                                                             -                                                                                                                              |  Host  | This message is sent by host as a request to get URL of current iframe.                                 |
| kontent-smart-link:preview:current-url:response |                                                                                                            <code>{ previewUrl: string }</code>                                                                                                             |  SDK   | This message is sent by SDK as a response on the `kontent-smart-link:preview:current-url` message.      |
| kontent-smart-link:preview:update               |                                                                                                              [Data contract](#data-contract)                                                                                                               |  Host  | This message is sent by host when an element value has been changed in the in-context editor.           |

## Examples

### HTML & UMD & CDN

This example demonstrates how to quickly integrate the Kontent.ai Smart Link SDK into a webpage using a CDN. It's
ideal for static sites or projects without a build process, allowing you to enhance your preview with smart link
capabilities using straightforward HTML and JavaScript.

```html

<html>
  <head>
    <title>Kontent.ai Smart Link - HTML example</title>
    <!-- Include the SDK from a CDN -->
    <script type='text/javascript'
            src='https://cdn.jsdelivr.net/npm/@kontent-ai/smart-link@3.2.0/dist/kontent-smart-link.umd.min.js'></script>
    <script type='text/javascript'>
      // Initialize the SDK upon page load
      KontentSmartLink.initializeOnLoad({ queryParam: 'preview' }).then((sdk) => {
        // NOTE: this is just an example of what your live preview implementation may look like
        sdk.on("update", (data) => {
          data.elements.forEach((i) => {
            const codename = i.element.codename;
            const domElement = document.querySelector(`[data-kontent-element-codename=${codename}]`);
            
            if (domElement) {
              domElement.innerHTML = i.data.value;
            }
          });
        });
      });
    </script>
  </head>
  <body data-kontent-project-id='1d50a0f7-9033-48f3-a96e-7771c73f9683' data-kontent-language-codename='en-US'>
    <!-- Example content with data attributes for smart link injection -->
    <nav class='navigation' data-kontent-item-id='6ea11626-336d-47e5-9f35-2d44fa1ad6d6'>
      <img class='navigation__logo' data-kontent-element-codename='logo' />
      <ul
        class='navigation__list'
        data-kontent-element-codename='navigation'
        data-kontent-add-button
        data-kontent-render-position='left'
        data-kontent-insert-position='start'
      >
        <li class='navigation__list-item' data-kontent-component-id='036acd8f-5e6d-4023-b0f8-a4b8e0b573b1'>
          <span data-kontent-element-codename='title'>Home</span>
        </li>
        <li class='navigation__list-item' data-kontent-component-id='f539f1bc-9dc4-4df5-8876-dbb1de5ae6eb'>
          <span data-kontent-element-codename='title'>About us</span>
        </li>
      </ul>
    </nav>
    <div
      class='page'
      data-kontent-item-id='af858748-f48a-4169-9b35-b10c9d3984ef'
      data-kontent-element-codename='page_content'
    >
      <div
        class='section'
        data-kontent-component-id='51a90561-9084-4d32-9e34-80da7c88c202'
        data-kontent-add-button
        data-kontent-add-button-render-position='bottom'
        data-kontent-add-button-insert-position='after'
      >
        <img class='home__banner' data-kontent-element-codename='image' />
        <h1 data-kontent-element-codename='title'>Home page</h1>
      </div>
      <div
        class='section'
        data-kontent-component-id='23e657d2-e4ce-4878-a77d-365db46c956d'
        data-kontent-add-button
        data-kontent-add-button-render-position='bottom'
        data-kontent-add-button-insert-position='after'
      >
        <p data-kontent-element-codename='text'>...</p>
      </div>
    </div>
  </body>
</html>
```

**Note:** Make sure to replace `@3.2.0` with the latest SDK version for improved features and fixes.

### ES6

For projects using modern JavaScript frameworks or build systems, this example illustrates how to import and initialize
the Kontent.ai Smart Link SDK within an ES6 module. This approach is well-suited for applications built with tools
like Webpack, Rollup, or when working within SPA frameworks like React, Vue, or Angular.

```js
import KontentSmartLink, { KontentSmartLinkEvent } from "@kontent-ai/smart-link";

// This is just an example of SDK initialization inside ES6 module.
// HTML markup should still contain all necessary data-attributes.
const kontentSmartLink = KontentSmartLink.initialize({
  debug: true,
  defaultDataAttributes: {
    projectId: "1d50a0f7-9033-48f3-a96e-7771c73f9683",
    languageCodename: "default",
  },
  queryParam: "ksl-preview"
});

kontentSmartLink.on(KontentSmartLinkEvent.Update, (data) => {
  // Update content of the page using data
});
```

**Tip:** Adjust `defaultDataAttributes` according to your Kontent.ai project's ID and language codename.

### React

In a React application, we recommend utilizing React's Context API to create a centralized store for the SDK instance,
ensuring easy access and management of smart links within your component tree. This advanced example demonstrates
setting up a SmartLinkContext to provide a Kontent.ai Smart Link SDK instance throughout your React application.

#### Creating the SmartLink context

```tsx
// src/contexts/SmartLink.tsx
import React, { PropsWithChildren, useContext, useState, useMemo, useEffect } from 'react';
import KontentSmartLink, { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import {
  IRefreshMessageData,
  IRefreshMessageMetadata,
  IUpdateMessageData,
} from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';

interface SmartLinkContextValue {
  readonly smartLink?: KontentSmartLink | null;
}

const defaultContextValue: SmartLinkContextValue = {
  smartLink: undefined,
};

const SmartLinkContext = createContext<SmartLinkContextValue>(defaultContextValue);

export const SmartLinkProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [smartLink, setSmartLink] = useState<KontentSmartLink>(null);

  useEffect(() => {
    const instance = KontentSmartLink.initialize({
      queryParam: 'preview',
      defaultDataAttributes: {
        projectId: 'your-project-id', // Replace 'your-project-id' with your actual project ID
        languageCodename: 'your-language-codename', // Replace 'your-language-codename' with your actual language codename
      },
    });

    setSmartLink(instance);

    // Cleanup on component unmount
    return () => instance.destroy();
  }, []);

  const value = useMemo(() => ({ smartLink }), [smartLink]);

  return (
    <SmartLinkContext.Provider>
      {children}
    </SmartLinkContext.Provider>
  );
};

// Custom hook for easy access to the SmartLink instance
export const useSmartLink = (): KontentSmartLink | null => {
  const { smartLink } = useContext(SmartLinkContext);

  if (typeof smartLink === 'undefined') {
    throw new Error('You need to place SmartLinkProvider to one of the parent components to use useSmartLink.');
  }

  return smartLink;
};

// Custom hook for easy setup of a custom refresh handler
export const useCustomRefresh = (callback: (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => void): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Refresh, callback);

      return smartLink.off(KontentSmartLinkEvent.Refresh, callback);
    }

    return;
  }, [smartLink, callback]);
};

// Custom hook for easy access of live preview
export const useLivePreview = (callback: (data: IUpdateMessageData) => void): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Update, callback);

      return smartLink.off(KontentSmartLinkEvent.Update, callback);
    }

    return;
  }, [smartLink, callback]);
};
```

Using the SmartLink provider in your app:

```tsx
// src/App.tsx
import React from 'react';
import { SmartLinkProvider } from './contexts/SmartLink';

const App: React.FC = () => {
  return (
    <SmartLinkProvider>
      {/* Your app components go here, now with smart link support */}
    </SmartLinkProvider>
  );
};
```

#### Optimizing content updates in React with custom refresh logic

Using the custom refresh handler and the `useCustomRefresh` hook we defined in the previous example. It is possible
to only update a small portion of the UI without reloading the entire page when your changes are available on
Delivery Preview API.

The following example showcases an efficient approach to handling such content updates within a React application.

```tsx
import React, { useState, useCallback, useContext } from 'react';
import { useCustomRefresh } from '../context/SmartLink'; // Ensure correct import path
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';

const YourComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const fetchData = useCallback((projectId, languageCodename, itemCodename) => {
    // Your data fetching logic here using a delivery-sdk or request to Delivery API endpoint
  }, []);

  // Define the custom refresh logic.
  const onRefresh = useCallback((data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
    // Check if the refresh was triggered manually and perform a full refresh if so.
    if (metadata.manualRefresh) {
      originalRefresh();
    } else {
      // For automatic refreshes, refetch data for the updated item only.
      const { projectId, languageCodename, updatedItemCodename } = data;
      fetchData(projectId, languageCodename, updatedItemCodename);
    }
  }, [fetchData]);

  // Use the custom refresh hook with the defined logic.
  useCustomRefresh(onRefresh);

  return <div>{data}</div>;
};
```

#### Triggering SSG rebuilds with custom refresh logic

For websites built with static site generators, applying content updates typically requires triggering
a rebuild of the site. The following example shows how you can initiate a rebuild with
the custom refresh handler, ensuring that your site reflects the latest content changes.

This example uses Gatsby deployed to Netlify, but the solution for other SSG
frameworks should be similar.

The following Netlify serverless function, `deploy-status`, checks the status of the latest deployment, enabling
your application to wait for a rebuild to complete before refreshing the content.

```js
// ./.netlify/functions/deploy-status.js
import fetch from 'node-fetch';

// Environment variables for Netlify site ID and access token
const siteId = process.env.NETLIFY_SITE_ID;
const token = process.env.NETLIFY_TOKEN;

// Handler to check the status of the last deployment
const handler = async event => {
  try {
    const endpoint = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
    const result = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
    const data = await result.json();

    // Assuming the first entry is the latest deployment
    const deploy = { state: data[0].state };

    return { statusCode: 200, body: JSON.stringify(deploy) };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
```

We can then trigger the rebuild process inside our custom refresh handler and wait for the deployment process to finish.
After that the page can be refreshed using the `originalRefresh` callback.

```tsx
import React, { useCallback, useEffect } from 'react';
import { useCustomRefresh } from '../context/SmartLinkContext'; // Adjust the import path as needed

const triggerRebuildOnNetlifyAndWaitForDeploy = useCallback(() => {
  // Trigger the Netlify build hook
  fetch('https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID?trigger_title=autorefresh', { method: 'POST' })
    .then(async () => {
      // Check the deployment status repeatedly until it's 'ready'
      const checkDeployStatus = async () => {
        const response = await fetch('/.netlify/functions/deploy-status');
        const { state } = await response.json();
        if (state !== 'ready') {
          setTimeout(checkDeployStatus, 3000); // Check again after 3 seconds
        }
      };

      await checkDeployStatus();
    });
}, []);

const PageWithAutoRefresh = () => {
  useCustomRefresh((data, metadata, originalRefresh) => {
    if (!metadata.manualRefresh) {
      triggerRebuildOnNetlifyAndWaitForDeploy().then(originalRefresh);
    } else {
      originalRefresh();
    }
  });

  // Page content goes here
  return <div>Page Content</div>;
};

export default PageWithAutoRefresh;
```

#### Live Preview in Your Application

Using the `useLivePreview` hook we defined in the previous example, you can enhance your application with real-time
content updates during the editing process. This hook listens for live update messages from the Kontent.ai Smart Link
SDK and applies those updates directly to the content item being displayed.

This example demonstrates setting up a `useLivePreview` hook within a React component to dynamically update content
items as changes are made in the in-context editor.

```tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useLivePreview } from '../contexts/SmartLinkContext'; // Adjust the import path as needed
import { IContentItem } from '@kontent-ai/delivery-sdk/lib/models/item-models';
import { IUpdateMessageData } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';

const useContentItem = (codename: string) => {
  const [item, setItem] = useState<IContentItem | null>(null);
  // Assume useDeliveryClient is a custom hook to obtain a configured delivery client instance
  const deliveryClient = useDeliveryClient();

  const handleLiveUpdate = useCallback((data: IUpdateMessageData) => {
    if (item && data.item.codename === codename) {
      setItem(applyUpdateOnItem(item, data));
      // or use applyUpdateOnItemAndLoadLinkedItems to load added linked items
      applyUpdateOnItemAndLoadLinkedItems(item, data, codenamesToFetch => deliveryClient.items(codenamesToFetch).toAllPromise())
        .then(setItem);
    }
  }, [codename, item]);

  useEffect(() => {
    // Fetch the content item initially and upon codename changes
    deliveryClient.item<IContentItem>(codename)
      .toPromise()
      .then(res => setItem(res.item));
  }, [codename, deliveryClient]);

  useLivePreview(handleLiveUpdate);

  return item;
};

// Example component using the useContentItem hook
export const ContentItemComponent = ({ codename }) => {
  const item = useContentItem(codename);

  // Render logic for the content item
  return (
    <div>
      {/* Render your content item here */}
      <h2>{item?.name}</h2>
      {/* More render logic */}
    </div>
  );
};
```

## Known issues

### Nested iframes

In scenarios where your content is displayed within nested iframes (e.g. to simulate different device resolutions, or
to handle redirects to the right preview website based on the item), the SDK's initialization messages may not reach
the top-level Web Spotlight iframe directly, affecting functionality. To address this, follow the guidance provided
in [this issue](https://github.com/kontent-ai/smart-link/issues/16).

### SameSite cookie in Next.js app

Next.js developers may encounter an issue with `SameSite` cookies not being set correctly. This can be solved by
utilizing the code snippet below in
your [API route handling preview](https://nextjs.org/docs/advanced-features/preview-mode) file to replace `SameSite=Lax`
to `SameSite=None; Secure;` right after `res.setPreviewData` call.

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

