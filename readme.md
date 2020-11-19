# Commons

![Build Status](https://github.com/NextThought/nti.web.commons/workflows/Project%20Health/badge.svg)


##### File naming conventions:
- Mixins/Partials and utility files: `lower-case-hyphenated.js` (in a sub-directory grouping related ones together)
- Classes and Components files: `PascalNameCase.js(x)`

This package should not contain ANY Special-Meaning files: Actions.js, Api.js, Constants.js, Store.js -- these files are special.

Example directory structure:
```
module-dir:
 ├ components
 │  ├ assets
 │  │  └ ...png
 │  ├ some-useful-directory-grouping-of-components
 │  │  ├ assets
 │  │  │  └ ...png
 │  │  └ ...jsx
 │  ├ SomeComponent.jsx
 │  ├ SomeComponent.scss
 │  └ index.js
 ├ constants
 ├ mixins
 ├ ...
 └ index.js (if its intended to be exported, it must be exported in here)
```

Modules should not contain sub-modules. They can however inter-depend.
