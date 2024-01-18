# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Dependency on @kontent-ai/delivery-sdk for types.
- New iframe message ("update") added to iframe communication.
- Support for custom real-time feedback handler implementation.

## [3.1.0] - 2023-08-15

### Added

- Ability to get currently displayed preview URL from the iframe.
- New iframe messages added to iframe communication.
- New message handler.

## [3.0.0] - 2022-09-23

- Package renamed to `@kontent-ai/smart-link`.

## [2.3.1] - 2022-01-20

### Fixed

- Edit element highlight is now included in elements affected by custom z-index.

## [2.3.0] - 2022-01-17

### Added

- Z-index of smart link elements can now be customized using CSS property.

## [2.2.1] - 2021-11-29

### Fixed

- Better error messages when trying to initialize the Smart Link SDK outside the browser environment to make it clear that it is a browser-only SDK.

## [2.2.0] - 2021-11-10

### Added

- Refresh preview page from the inside, using a new iframe message to keep the position of a scrollbar after the refresh.
- Add support for custom refresh handler implementation.

## [2.1.0] - 2021-07-01

### Added

- Colors used in SDK can now be customized using CSS properties.

### Fixed

- The highlighted element now has hover effect when its edit button is hovered.

## [2.0.1] - 2021-06-08

### Fixed

- Fixed the problem with infinite loading when data attributes required for add button were missing.
- Fixed highlights blinking when iframe communication is initialized.

## [2.0.0] - 2021-06-02

### Added

- Smart links are now rendered using Web Components.
- Changes in smart link rendering algorithm for better performance.
- New data attributes related to add button have been added to SDK (`data-kontent-add-button`, `data-kontent-add-button-insert-position`, `data-kontent-add-button-render-position`).
- New data attribute to disable features (highlights) has been added to SDK (`data-kontent-disable-features`).
- Edit buttons now support content components and content items.
- New iframe messages added to iframe communication.

### Fixed

- Better error handling (e.g. local storage access rights).
- Improve rendering algorithm for better performance.

### Changed

- Setting query parameter to a falsy value (null, "") results in SDK being always enabled.
- IFrame communication is only used when inside Web Spotlight iframe.
- Configuration object has been changed:
    - New debug property can be set to true to enable additional debug logs.
    - Default project ID and language codename have been moved under `defaultDataAttributes` property.
    - Default query parameter name has been changed from `kontent-smart-link-enabled` to `ksl-enabled`.

### Removed

- Removed SCSS files and external CSS files that must be imported to use the SDK.

## [1.3.0] - 2021-03-30

### Changed

- Changed default smart link styles.

## [1.2.2] - 2021-01-26

### Fixed

- Fixed first load smart links rendering [bug](https://github.com/kontent-ai/smart-link/issues/21).

## [1.2.1] - 2020-10-26

### Fixed

- Fixed the positioning of the highlights inside body on pages with scrollbars by improving the rendering algorithm.
- Fixed the positioning of the highlights inside table elements by improving the rendering algorithm.

## [1.2.0] - 2020-10-07

### Added

- A new `metadata` property to the element clicked iframe message which contains element rect.

## [1.1.1] - 2020-10-01

### Added

- Unit tests for utilities.

### Fixed

- Fixed the problem when big elements were not highlighted properly by improving the rendering algorithm.

## [1.1.0] - 2020-09-01

### Added

- A new `data-kontent-component-id` attribute to support [content components](https://docs.kontent.ai/tutorials/write-and-collaborate/structure-your-content/structure-your-content#a-create-single-use-content).
- A new `buildComponentElementLink` helper to generate Kontent smart link for a content component.
- CHANGELOG.md

### Changed

- Improved data attributes parsing logic to avoid problems with some edge cases.

## [1.0.0] - 2020-08-19

### Added

- First public release of SDK

[unreleased]: https://github.com/kontent-ai/smart-link/compare/v3.1.0...HEAD
[3.1.0]: https://github.com/kontent-ai/smart-link/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/kontent-ai/smart-link/compare/v2.3.1...v3.0.0
[2.3.1]: https://github.com/kontent-ai/smart-link/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/kontent-ai/smart-link/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/kontent-ai/smart-link/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/kontent-ai/smart-link/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/kontent-ai/smart-link/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/kontent-ai/smart-link/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/kontent-ai/smart-link/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/kontent-ai/smart-link/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/kontent-ai/smart-link/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/kontent-ai/smart-link/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/kontent-ai/smart-link/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/kontent-ai/smart-link/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/kontent-ai/smart-link/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/kontent-ai/smart-link/releases/tag/v1.0.0
