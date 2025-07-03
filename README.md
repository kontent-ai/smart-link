# Kontent.ai Smart Link SDK

![licence](https://img.shields.io/github/license/kontent-ai/smart-link)
![npm](https://img.shields.io/npm/v/@kontent-ai/smart-link)
![downloads](https://img.shields.io/npm/dt/@kontent-ai/smart-link)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/@kontent-ai/smart-link)

###### [Contributing](https://github.com/kontent-ai/.github/blob/main/CONTRIBUTING.md) | [Troubleshooting](https://github.com/kontent-ai/smart-link/blob/master/TROUBLESHOOTING.md) | [Breaking changes](https://github.com/kontent-ai/smart-link/blob/master/BREAKING.md) | [Release guide](https://github.com/kontent-ai/smart-link/wiki/How-to-release-a-new-version-of-Smart-Link-SDK)

Kontent.ai Smart Link SDK simplifies and enhances the process of editing and managing web content in [Live Preview](https://kontent.ai/features/live-preview/) by embedding "smart links" into your web pages. These smart links, defined by specific [HTML data attributes](https://www.w3schools.com/tags/att_data-.asp) you set,
create a direct bridge to the Kontent.ai CMS. This allows content creators and editors to quickly navigate from the preview website to the corresponding content in the Kontent.ai platform.

> [!WARNING] 
> **Important note:** Kontent.ai Smart Link SDK is **a browser-only SDK**. Make sure to always initialize the Smart Link SDK in a browser context.

## Features

- ✏️ **Edit Smart Links:** Quickly navigate from your website's preview to the corresponding content in Kontent.ai.
- ➕ **Add Smart Links:** Simplify the addition of modular content directly from your preview.
- 🔄️ **Automatic Reloads/Rebuilds:** Set up the automatic webpages reloads when your content is ready in the Delivery Preview API, ensuring your preview always reflects the latest saved changes.
- 👀 **Live Preview:** Experience real-time content changes even before they're saved.

## Table of Contents

* [Installation](#installation)
* [Quickstart](#quickstart)
* [Data attributes](#data-attributes)
    * [Available data attributes](#available-data-attributes)
    * [Data attributes hierarchy](#data-attributes-hierarchy)
    * [Smart Links](#smart-links)
* [SDK initialization](#sdk-initialization)
    * [Configuration](#configuration)
    * [Preview autorefresh in Live Preview](#preview-autorefresh-in-web-spotlight)
    * [Live preview in Live Preview](#live-preview-in-web-spotlight)
    * [Combining autorefresh and live preview](#combining-autorefresh-and-live-preview)
    * [Customization](#customization)
* [Known issues](#known-issues)
    * [Nested iframes](#nested-iframes)
    * [SameSite cookie in Next.js app](#samesite-cookie-in-nextjs-app)
* [Examples](#examples)
    * [HTML & UMD & CDN](#html--umd--cdn)
    * [React](#react)
    * [Triggering SSG rebuilds with custom refresh logic](#triggering-ssg-rebuilds-with-custom-refresh-logic)
* [Tests](#tests)
    * [Unit tests](#unit-tests)
    * [Visual regression tests](#visual-regression-tests)
    * [Updating Visual Regression Tests](#updating-visual-regression-tests)

## Installation

You can install this library using `npm` or using global CDNs such as `jsdelivr`.

### npm

```
npm i @kontent-ai/smart-link --save
```

### jsdelivr

When you include the UMD bundle of this library in the `script` tag of your HTML page, an SDK becomes available under the `kontentSmartLink` global variable.

- `dist/bundles/kontent-smart-link.min.js`

##### kontent-smart-link.min.js
![Gzip browser bundle](https://img.badgesize.io/https://app.unpkg.com/@kontent-ai/smart-link@4.0.3/files/dist/bundles/kontent-smart-link.min.js?compression=gzip)

```html
<script type='text/javascript'
        src='https://cdn.jsdelivr.net/npm/@kontent-ai/smart-link@latest/dist/bundles/kontent-smart-link.min.js'></script>
```

> [!NOTE] 
> To prevent potential issues from arising due to breaking changes, it is recommended to replace `@latest` with a specific version number.

## Quickstart

To integrate the Kontent.ai Smart Link SDK into your web project and enable smart link injection, follow these steps:

1. **Include SDK:** Add the SDK to your project.
2. **Specify HTML data attributes:** Define the HTML data attributes on your webpage elements where you want the smart links to appear. Detailed guidance on setting these attributes can be found [here](#data-attributes).
    ```html
    <main data-kontent-environment-id='00000000-0000-0000-0000-000000000000' data-kontent-language-codename='default'>
      <div data-kontent-item-id='00000000-0000-0000-0000-000000000000'>
        <div data-kontent-element-codename='title'>Title</div>
      </div>
    </main>
   ```
3. **Initialization:** Initialize the SDK in your code to create the smart link to Kontent.ai. You can read more about
   SDK initialization [here](#sdk-initialization).
    ```ts
   const instance = KontentSmartLink.initialize();
   ```

For more complex examples, check the [Examples](#examples) section.

## Data attributes

The Kontent.ai Smart Link SDK relies on manually specified data attributes in your HTML markup. These attributes are essential for the SDK to identify where and how to integrate smart links into your content. They also enable the SDK to access necessary information, such as the Kontent.ai environment ID and element codenames.

> [!NOTE] 
> **It's important to note that the SDK does not automatically insert these data attributes into your HTML. You are responsible for adding them manually.**

### Available data attributes

<details>
<summary>View complete data attributes reference</summary>

| Attribute                                 |                                                                                                     Value                                                                                                      | Description                                                                                                                                                 |
|-------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data-kontent-environment-id`                 |                                                                                                      guid                                                                                                      | Kontent.ai environment ID.                                                                                                                                  |
| `data-kontent-language-codename`          |                                                                                                     string                                                                                                     | Kontent.ai language codename.                                                                                                                               |
| `data-kontent-item-id`                    |                                                                                                      guid                                                                                                      | Content item ID.                                                                                                                                            |
| `data-kontent-component-id`               |                                                                                                      guid                                                                                                      | [Content component](https://kontent.ai/learn/tutorials/write-and-collaborate/structure-your-content/structure-your-content#a-create-single-use-content) ID. |
| `data-kontent-element-codename`           |                                                                                                     string                                                                                                     | Content type element codename.                                                                                                                              |
| `data-kontent-add-button`                 |                                                                                                       -                                                                                                        | Specifies that node should have add-button rendered near it.                                                                                                |
| `data-kontent-add-button-insert-position` |                                                                              `start` &#124; `before` &#124; `after` &#124; `end`                                                                               | Specifies the insert position of an item/content component added using add button.                                                                          |
| `data-kontent-add-button-render-position` | `bottom-start` &#124; `bottom` &#124; `bottom-end` &#124; `left-start` &#124; `left` &#124; `left-end` &#124; `top-start` &#124; `top` &#124; `top-end` &#124; `right-start` &#124; `right` &#124; `right-end` | Specifies visual location of add button.                                                                                                                    |
| `data-kontent-disable-features`           |                                                                                                  `highlight`                                                                                                   | Specifies that the selected node should not have highlight (which includes edit smart links). Useful when there are too many smart links on your page.      |

</details>

### Data attributes hierarchy

The SDK processes data attributes in a hierarchical structure. While the SDK internally parses these attributes from the most nested (bottom) to the least nested (top), we recommend implementing them in your HTML from top to bottom. This means starting with the highest-level container elements and working your way down to the most specific elements. Here's how:

- **Environment-Level Attributes:** Begin by assigning the `data-kontent-environment-id` attribute to a high-level element, such as the `<body>` tag. Similarly, assign the `data-kontent-language-codename` alongside the environment id ID to establish the language context for all contained elements.

> [!NOTE] 
> The environment ID and language codename values can be configured during SDK initialization. See the [Configuration section](#configuration) for details on setting these values programmatically.

- **Content-Specific Attributes:** After setting environment attributes, mark your content items and their elements:
  - Use `data-kontent-item-id` on elements that represent entire content items
  - Use `data-kontent-element-codename` on elements that represent specific fields within those items 
  - Use `data-kontent-component-id` on elements that represent content components within rich text elements

  This mapping allows the SDK to connect your HTML elements directly to their corresponding content in Kontent.ai.

- **Nested Content:** For rich text or linked items containing additional content:
  - For linked items: Mark nested content with `data-kontent-item-id` to represent each nested item
  - For rich text: Mark content components with `data-kontent-component-id` to represent reusable components within the rich text
  - Continue this pattern for any deeper nesting levels

> [!NOTE]
> The Smart Link SDK provides helper functions to simplify the creation of data attributes. For more information, see the [data attribute helper functions](./src/utils/dataAttributes/helpers.ts).


### Smart Links

Smart links create clickable overlays on your content that connect directly to Kontent.ai's editing interface. Think of them as "edit buttons" or "add buttons" that appear when you hover over content elements.

| Smart Link Type | Purpose | Works Outside Live Preview? | Key Attributes |
|----------------|---------|---------------------------|---------------|
| **Element Edit** | Edit specific content elements | ✅ Yes | `data-kontent-element-codename` |
| **Item Edit** | Edit content items | ✅ Yes | `data-kontent-item-id` |
| **Component Edit** | Edit content components | ❌ Live Preview only | `data-kontent-component-id` |
| **Add Content** | Add new content/components | ❌ Live Preview only | `data-kontent-add-button` |

**What happens when clicked:**
- **Outside Live Preview:** Redirects to Kontent.ai item editor
- **Inside Live Preview:** Opens in-context editor for that specific field

---

#### Smart Links Guide

1. **Set up your page context**
Every smart link needs to know which project and language it's working with:

```html
<!-- Set these once at a high level (like <body> or main container) -->
<main data-kontent-environment-id='1d50a0f7-9033-48f3-a96e-7771c73f9683' 
      data-kontent-language-codename='default'>
  <!-- Your content goes here -->
</main>
```

2. **Make a text field editable**
The most common use case - clicking text to edit it:

```html
<main data-kontent-environment-id='1d50a0f7-9033-48f3-a96e-7771c73f9683' 
      data-kontent-language-codename='default'>
  <!-- Edit Button on content item with specified ID -->
  <article data-kontent-item-id='af858748-f48a-4169-9b35-b10c9d3984ef'>
    <!-- Edit Button on "title" element -->
    <h1 data-kontent-element-codename='title'>How to Use Smart Links</h1>
    <!-- Edit Button on "content" element -->
    <div data-kontent-element-codename='content'>
      Smart links make editing content incredibly easy...
    </div>
  </article>
</main>
```

#### Content Components

Content components are reusable pieces within rich text. Each needs its own ID:

```html
<main data-kontent-environment-id='1d50a0f7-9033-48f3-a96e-7771c73f9683' 
      data-kontent-language-codename='default'>
      
  <article data-kontent-item-id='af858748-f48a-4169-9b35-b10c9d3984ef'>
    
    <!-- Edit button on rich text element -->
    <div data-kontent-element-codename='article_content'>
      
      <!-- Edit button on component with that ID -->
      <blockquote data-kontent-component-id='51a90561-9084-4d32-9e34-80da7c88c202'>
        <!-- Edit button on "quote_text" element inside component -->
        <p data-kontent-element-codename='quote_text'>
          "Smart links revolutionized our content workflow."
        </p>
      </blockquote>
      
      <!-- Another content component -->
      <figure data-kontent-component-id='23e657d2-e4ce-4878-a77d-365db46c956d'>
        <img data-kontent-element-codename='image' src="..." alt="...">
      </figure>
    </div>
  </article>
</main>
```

---

#### Adding New Modular Content

Add buttons let editors insert new linked items/components directly in the preview:

**Adding to the end of a list:**
```html
<!-- Navigation menu that editors can extend -->
<nav data-kontent-item-id='6ea11626-336d-47e5-9f35-2d44fa1ad6d6'>
  <ul data-kontent-element-codename='navigation_items'
      data-kontent-add-button
      data-kontent-add-button-render-position='bottom'
      data-kontent-add-button-insert-position='end'>
    
    <li data-kontent-component-id='036acd8f-5e6d-4023-b0f8-a4b8e0b573b1'>
      <a data-kontent-element-codename='link_text'>Home</a>
    </li>
    <li data-kontent-component-id='f539f1bc-9dc4-4df5-8876-dbb1de5ae6eb'>
      <a data-kontent-element-codename='link_text'>About</a>
    </li>
    
    <!-- Add button appears here -->
  </ul>
</nav>
```

**Adding before/after specific linked items:**
```html
<!-- Article sections where editors can insert new linked item sections -->
<article data-kontent-item-id='af858748-f48a-4169-9b35-b10c9d3984ef'>
  <div data-kontent-element-codename='article_sections'>
    
    <!-- Existing linked item section with "add before" button -->
    <section data-kontent-item-id='12345678-1234-1234-1234-123456789012'
             data-kontent-add-button
             data-kontent-add-button-render-position='top-start'
             data-kontent-add-button-insert-position='before'>
      <h2 data-kontent-element-codename='section_title'>Introduction</h2>
      <p data-kontent-element-codename='section_content'>...</p>
    </section>
    
    <!-- Another linked item section with "add after" button -->
    <section data-kontent-item-id='87654321-4321-4321-4321-210987654321'
             data-kontent-add-button
             data-kontent-add-button-render-position='bottom-end'
             data-kontent-add-button-insert-position='after'>
      <h2 data-kontent-element-codename='section_title'>Conclusion</h2>
      <p data-kontent-element-codename='section_content'>...</p>
    </section>
  </div>
</article>
```

> [!NOTE]
> For a demonstration of Smart Link buttons, check out the [samples/smartlink.html](./samples/smartlink.html) file in this repository which showcases different button types and positions.

## SDK initialization

To activate the Kontent.ai Smart Link SDK on your website, you need to initialize it after setting up all required data attributes. The SDK offers two methods for initialization:

- `initialize`: Instantly initializes the SDK, making it ready to use. This method is ideal when your webpage is fully loaded or when SDK initialization occurs after the document's `DOMContentLoaded` event.
    ```ts
    const instance = KontentSmartLink.initialize({ queryParam: "preview" });
    ```
- `initializeOnLoad`: Delays SDK initialization until the entire page has loaded. This approach is particularly useful for including the SDK in the `<head>` of your webpage, ensuring that all page elements are fully loaded before
  initialization begins.
    ```ts
    KontentSmartLink.initializeOnLoad().then(instance => {
      // SDK is fully initialized and ready to use
    });
    ```

Both methods return an SDK instance, with `initializeOnLoad` returning a promise that resolves to an instance. It is important to manage this instance appropriately:

- **Accessing the SDK instance:** Store the returned instance if you need to access SDK methods after initialization.

- **Resource management:** The SDK leverages event listeners, timeouts, and observers to function properly. To prevent memory leaks or unintended behavior always invoke the `.destroy()` method on the SDK instance before re-initializing the SDK.
    ```ts
    useEffect(() => {
      const instance = KontentSmartLink.initialize();
      return () => instance.destroy(); 
    })
    ```

The Kontent.ai Smart Link SDK adapts its behavior based on where it's running to provide the optimal content management experience:

#### Outside Live Preview

When used outside of Live Preview, the SDK leverages URL query parameters to manage the activation of smart links. By default, it looks for the `ksl-enabled` parameter in the webpage URL. However, this parameter can be customized using the `queryParam` option during SDK initialization. The features that could be used outside of Live Preview are limited.

#### Inside Live Preview

If the SDK detects that it is run inside an iframe, it attempts to connect to Live Preview through iframe messages early during initialization. Upon successful communication with Live Preview, the SDK disables query parameter
reliance and activates additional functionalities designed for in-context editing and preview.


### Configuration

Customize how the SDK operate on your preview website with optional configuration arguments passed during initialization. Configuration can be adjusted post-initialization using the `setConfiguration` method.

<details>
<summary>View all configuration options</summary>

| Attribute             |                           Default                           | Description                                                                                                                                                                                                                                                                                                                                                    |
|-----------------------|:-----------------------------------------------------------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| debug                 |                            false                            | Set to `true` to enable detailed logging, aiding in development and troubleshooting.                                                                                                                                                                                         
| defaultDataAttributes | ```{ environmentId: undefined, languageCodename: undefined }``` | Define default values for essential data attributes to streamline setup.                                                                                                                                                                                                                                                                                       |
| queryParam            |                        `ksl-enabled`                        | Name of the query parameter that must be present in the URL to turn the smart link injection on. Only the presence of this query parameter is checked. Query parameter is only used outside Live Preview. |

</details>


### Preview autorefresh in Live Preview

Maintaining an up-to-date preview is essential when editing content in Live Preview using the in-context editor. The Kontent.ai Smart Link SDK introduces a preview autorefresh feature from version 2.2.0 onwards, ensuring your preview automatically updates after your changes are saved without manual refreshes.

#### Prerequisites for autorefresh

To enable autorefresh in your preview web app, ensure:

1. **SDK Version:** Your application is using version 2.2.0 or higher of the Smart Link SDK.
2. **API Header:** The `X-KC-Wait-For-Loading-New-Content` header is set to `true` for requests to the Delivery Preview API.

#### Implementing a custom refresh handler

There are scenarios where a full page refresh may not be ideal, such as when using a static site generator or when aiming to update only a portion of the page. To accommodate diverse needs, the Smart Link SDK offers the capability to define a custom refresh handler.

This custom handler overrides the default refresh behavior, allowing for tailored refresh logic based on your specific requirements. Implement it as follows:

```ts
import KontentSmartLink, { IRefreshMessageData } from '@kontent-ai/smart-link';

const sdk = KontentSmartLink.initialize();

sdk.on(KontentSmartLinkEvent.Refresh, (data, metadata, originalRefresh) => {
  // Implement your custom refresh logic here
});
```

You can then unregister the custom handler using the `.off` method.

For more complex example, check the [Examples](#examples) section.


### Live reload in Live Preview

As of version 3.2.0, the Kontent.ai Smart Link SDK introduces support for live reload within Live Preview. This feature enhances the content editing experience by providing real-time updates within your preview environment through iframe communication immediately after edits are made in the in-context editor.

> [!NOTE]
> The live reload requires manual integration to function. Your preview website will not automatically update with changes; it is your responsibility to implement how these updates are processed and displayed in your application.

#### Implementing live reload in your application

To set up live reload, listen for update events from the SDK. These events are triggered after content is edited in Kontent.ai, providing you with the updated data. 
In a typical SPA, you would fetch the data from the Delivery API and store them in memory. When the SDK triggers an update event, you would then update the stored items in memory to display the latest content. 
To easily apply the updates on you items, SDKs provide you wtih helper functions:
  - `applyUpdateOnItem` - A function that applies the update data directly to a content item, modifying its elements, content components, and existing linked items according to the changes made in the editor.

  - `applyUpdateOnItemAndLoadLinkedItems` - A function that applies updates to the content item and attempts to load newly added linked items using the provided callback function. The callback function should handle loading the items from the Delivery API, including any polling logic needed since newly added items may not be immediately available.

```ts
import KontentSmartLink, { KontentSmartLinkEvent, applyUpdateOnItem, applyUpdateOnItemAndLoadLinkedItems } from '@kontent-ai/smart-link';

const setItems = (items: ...) => {} // setItems logic

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

### Combining autorefresh and live reload

While autorefresh ensures that content updates are accurately reflected post-save, live reload offers the advantage of immediate visual feedback before changes are saved. To maximize content management efficiency, we recommend using live reload for instant editing feedback and relying on autorefresh to confirm that all changes are correctly saved
and displayed. This combination provides a seamless editing experience, allowing content editors to preview changes in real-time and ensuring that the final content displayed is up-to-date with the Delivery Preview API.

#### Customization

The following [custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) can be used to customize the
visuals of the SDK output.

<details>
<summary>View CSS customization options</summary>

| Custom property | Default | Description |
|-----------------|---------|-------------|
| --ksl-color-background-default | `rgba(255, 255, 255, 1)` | Default background color used in toolbar and popover. |
| --ksl-color-background-default-disabled | `rgba(223, 223, 223, 1)` | Disabled background color for buttons inside toolbar and popover. |
| --ksl-color-background-default-hover | `rgba(21, 21, 21, 0.1)` | Hover background color for buttons inside toolbar and popover. |
| --ksl-color-background-default-selected | `rgba(255, 240, 239, 1)` | Selected background color for buttons inside toolbar and popover. |
| --ksl-color-background-secondary | `rgba(20, 22, 25, 1)` | Secondary background color used in tooltips. |
| --ksl-color-primary | `rgba(219, 60, 0, 1)` | Primary color used as a hover border color in highlights and as a background color in add buttons. |
| --ksl-color-primary-hover | `rgba(149, 48, 0, 1)` | Primary color used as a hover background color in add buttons. |
| --ksl-color-primary-transparent | `rgba(219, 60, 0, 0.5)` | Primary color with transparency used as a default border color in highlights. |
| --ksl-color-text-default | `rgba(255, 255, 255, 1)` | Text color used on a default background (buttons inside toolbar and popover). |
| --ksl-color-text-default-disabled | `rgba(140, 140, 140, 1)` | Disabled text color used on a default background. |
| --ksl-color-text-secondary | `rgba(21, 21, 21, 1)` | Text color used inside tooltips and add buttons. |
| --ksl-shadow-default | `0 8px 32px rgba(16, 33, 60, 0.24), 0 0 8px rgba(0, 0, 0, 0.03)` | Default shadow for toolbar. |
| --ksl-shadow-primary | `0 8px 10px rgba(219, 60, 0, 0.2), 0 6px 20px rgba(219, 60, 0, 0.12), 0 8px 14px rgba(219, 60, 0, 0.14)` | Shadow for add buttons. |
| --ksl-z-index | `9000` | Base value of z-index used for calculation of individual values for each ksl-element type |

</details>

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

## Known issues

### Nested iframes

In scenarios where your content is displayed within nested iframes (e.g. to simulate different device resolutions, or to handle redirects to the right preview website based on the item), the SDK's initialization messages may not reach the top-level Live Preview iframe directly, affecting functionality. To address this, follow the guidance provided
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

## Examples

### HTML & UMD & CDN

<details>
<summary>View HTML/CDN implementation example</summary>

This example demonstrates how to quickly integrate the Kontent.ai Smart Link SDK into a webpage using a CDN. It's ideal for static sites or projects without a build process, allowing you to enhance your preview with smart link capabilities using straightforward HTML and JavaScript.

```html
<html>
  <head>
    <title>Kontent.ai Smart Link - HTML example</title>
    <!-- Include the SDK from a CDN -->
    <script type='text/javascript'
            src='https://cdn.jsdelivr.net/npm/@kontent-ai/smart-link@latest/dist/bundles/kontent-smart-link.min.js'></script>
    <script type='text/javascript'>
      // Initialize the SDK upon page load
      kontentSmartLink.KontentSmartLink.initializeOnLoad({ queryParam: 'preview' }).then((sdk) => {
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
  <body data-kontent-enviroment-id='1d50a0f7-9033-48f3-a96e-7771c73f9683' data-kontent-language-codename='en-US'>
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

</details>

### React

<details>
<summary>View React implementation examples</summary>

In a React application, we recommend utilizing React's Context API to create a centralized store for the SDK instance, ensuring easy access and management of smart links within your component tree. This advanced example demonstrates setting up a SmartLinkContext to provide a Kontent.ai Smart Link SDK instance throughout your React application.

#### Creating the SmartLink context

```tsx
// src/contexts/SmartLink.tsx
import React, { type PropsWithChildren, useContext, useState, useMemo, useEffect, createContext } from 'react';
import KontentSmartLink, { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import KontentSmartLink, {
  KontentSmartLinkEvent,
  type IRefreshMessageData,
  type IRefreshMessageMetadata,
  type IUpdateMessageData,
} from '@kontent-ai/smart-link';

type SmartLinkContextValue = {
  readonly smartLink?: KontentSmartLink | null;
}

const defaultContextValue: SmartLinkContextValue = {
  smartLink: undefined,
};

const SmartLinkContext = createContext<SmartLinkContextValue>(defaultContextValue);

export const SmartLinkProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [smartLink, setSmartLink] = useState<KontentSmartLink | null>(null);

  useEffect(() => {
    const instance = KontentSmartLink.initialize({
      queryParam: 'preview',
      defaultDataAttributes: {
        environmentId: 'your-envrionment-id',
        languageCodename: 'your-language-codename',
      },
    });

    setSmartLink(instance);

    // Cleanup on component unmount
    return () => instance.destroy();
  }, []);

  const value = useMemo(() => ({ smartLink }), [smartLink]);

  return (
    <SmartLinkContext.Provider value={value}>
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

      return () => smartLink.off(KontentSmartLinkEvent.Refresh, callback);
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

      return () => smartLink.off(KontentSmartLinkEvent.Update, callback);
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

Using the custom refresh handler and the `useCustomRefresh` hook we defined in the previous example. It is possible to only update a small portion of the UI without reloading the entire page when your changes are available on Delivery Preview API.

The following example showcases an efficient approach to handling such content updates within a React application.

```tsx
import React, { useState, useCallback } from 'react';
import { useCustomRefresh } from '../context/SmartLink'; // Ensure correct import path
import type { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link';

const YourComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const fetchData = useCallback((environmentId, languageCodename, itemCodename) => {
    // Your data fetching logic here using a delivery-sdk or request to Delivery API endpoint
  }, []);

  // Define the custom refresh logic.
  const onRefresh = useCallback((data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
    // Check if the refresh was triggered manually and perform a full refresh if so.
    if (metadata.manualRefresh) {
      originalRefresh();
    } else {
      // For automatic refreshes, refetch data for the updated item only.
      const { environmentId, languageCodename, updatedItemCodename } = data;
      fetchData(environmentId, languageCodename, updatedItemCodename);
    }
  }, [fetchData]);

  // Use the custom refresh hook with the defined logic.
  useCustomRefresh(onRefresh);

  return <div>{data}</div>;
};
```
f
#### Live Preview in Your Application

Using the `useLivePreview` hook we defined in the previous example, you can enhance your application with real-time
content updates during the editing process. This hook listens for live update messages from the Kontent.ai Smart Link
SDK and applies those updates directly to the content item being displayed.

This example demonstrates setting up a `useLivePreview` hook within a React component to dynamically update content
items as changes are made in the in-context editor.

```tsx
import { useState, useCallback, useEffect } from 'react';
import { useLivePreview } from '../contexts/SmartLinkContext'; // Adjust the import path as needed
import { type IUpdateMessageData, applyUpdateOnItem, applyUpdateOnItemAndLoadLinkedItems } from "@kontent-ai/smart-link"
import type { IContentItem } from '@kontent-ai/delivery-sdk/lib/models/item-models';

const useContentItem = (codename: string) => {
  const [item, setItem] = useState<IContentItem | null>(null);
  // Assume useDeliveryClient is a custom hook to obtain a configured delivery client instance
  const deliveryClient = useDeliveryClient();

  const handleLiveUpdate = useCallback((data: IUpdateMessageData) => {
    if (item) {
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
      <h2>{item?.elements.name}</h2>
      {/* More render logic */}
    </div>
  );
};
```

</details>

### Triggering SSG rebuilds with custom refresh logic

<details>
<summary>View SSG rebuild implementation example</summary>

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

</details>

## Tests

### Unit tests

Since this SDK highly depends on browser APIs, the unit tests are run by [Vitest Browser](https://vitest.dev/guide/browser/) inside Chrome
browser. To run all tests in a watch mode you can use the `npm run test:unit` command. To run all tests only once you
can use the `npm run test:unit:ci` command. All unit tests are located in the `test-browser` folder.

### Visual regression tests

Visual regression testing is implemented using [Playwright Components](https://playwright.dev/docs/test-components). Pre-built components are available into which Smart-Link loads. After the component is mounted, Playwright performs a screenshot test of the component. 

To run Visual Regression tests use `npm run test:visual` command. Or you can use
the `npm run test:visual:ci` to start tests in a UI mode.

> [!NOTE]
> Visual regression tests use the built version of SDK, so before running them make sure you rebuild the SDK after the last changes you made.

### Updating Visual Regression Tests

Rendering differences across operating systems can lead to variations in screenshots. In our GitHub Action workflow for visual tests, reference screenshots are generated using the `ubuntu-latest` environment. To ensure consistency, a dedicated workflow produces an artifact with the updated screenshots.

Follow these steps if you need to update the screenshots:

1. Navigate to the **Actions** tab in your GitHub repository.
2. Locate and select the **Update Snapshots** workflow.
3. Manually trigger the workflow on your branch.
4. Once the workflow completes, download the generated artifact containing the updated screenshots.
5. Copy the updated screenshots into the repository.

