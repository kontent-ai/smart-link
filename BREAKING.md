# Breaking Changes

This is a list of the breaking changes introduced in the major version of Kontent Smart Link SDK.

## Versions

- [Version 2.x](#version-2x)

## Version 2.x

- [Configuration](#configuration)
    * [Default data attributes](#default-data-attributes)
    * [Query parameter](#query-parameter)
- [CSS](#css)

### Configuration

SDK configuration format has been changed a little in v2.0.0.

#### Default data attributes

All default data attribute values have been moved under the `defaultDataAttributes` property.

**Before**

```js
KontentSmartLink.initialize({
  projectId: '1d50a0f7-9033-48f3-a96e-7771c73f9683',
  languageCodename: 'default',
});
```

**After**

```js
KontentSmartLink.initialize({
  defaultDataAttributes: {
    projectId: '1d50a0f7-9033-48f3-a96e-7771c73f9683',
    languageCodename: 'default',
  },
});
```

#### Query parameter

Default value for query parameter has been changed from `kontent-smart-link-enabled` to `ksl-enabled`.
When a false value (`null`, `""`) is provided for query parameter during initialization, SDK will always be enabled.

**Before**

```js
KontentSmartLink.initialize({
  queryParam: 'kontent-smart-link-enabled',
});
```

**After**

```js
KontentSmartLink.initialize({
  queryParam: 'ksl-enabled',
});
```

### CSS

CSS files have been removed from SDK. So there is no need to import any CSS file for SDK to work now.
