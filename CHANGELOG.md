# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Fixed first load smart links rendering [bug](https://github.com/Kentico/kontent-smart-link/issues/21).

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

[unreleased]: https://github.com/Kentico/kontent-smart-link/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/Kentico/kontent-smart-link/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/Kentico/kontent-smart-link/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/Kentico/kontent-smart-link/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Kentico/kontent-smart-link/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Kentico/kontent-smart-link/releases/tag/v1.0.0
