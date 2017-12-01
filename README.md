# Dropdownizer

Converts HTML `select` elements into customizable dropdowns.

This project...

- Is lightweight and dependency free.
- Includes support for native mobile dropdowns.
- Keeps original `select` elements in sync.
- Properly resizes the dropdown to match the longest line.
- Works with standard `change` events and a proprietary `change` method.

## Usage

`npm i dropdownizer`

### Node

```
let Dropdownizer = require("dropdownizer");
```

Minified version:

```
let Dropdownizer = require("dropdownizer/dist/Dropdownizer.min");
```

### Browser

```
import Dropdownizer from "dropdownizer";
```

Minified version:

```
import Dropdownizer from "dropdownizer/dist/Dropdownizer.min";
```

Script tag:

```
<script src="node_modules/dropdownizer/dist/Dropdownizer.min.js"></script>
```

## Stylesheet

```
<link rel="stylesheet" href="node_modules/dropdownizer/style/dropdownizer.css">
```

## Documentation

See the [documentation](http://grafluxe.com/o/doc/dropdownizer/Dropdownizer.html).

## Examples

Pass in a `string` to bind to the matching element(s).

```
new Dropdownizer("select");
```

Pass in an `HTMLElement` to bind to the matching element(s).

```
new Dropdownizer(document.querySelector("select"));
```

Use the `change` method.

```
new Dropdownizer("#my-dd").change(evt => {
  console.log(evt.data.value);
});
```

Listen to a `change` event.

```
let dropdown = document.querySelector("#my-dd");

dropdown.addEventListener("change", evt => {
  console.log(evt.target.value);
});

new Dropdownizer(dropdown);
```

See [live examples](http://grafluxe.com/o/doc/dropdownizer/example).

## Notes

- Styles applied directly to the `select` element and/or its `id` are not copied to the dropdownizer instance. Use classes if you want sync styles.
- The `change` event and proprietary `change` method differ in what's returned.
  - The `change` event is dispatched from the original element while the `change` method belongs to the dropdownizer instance.

## Changelog

### 1.1.0

- Add the ability to programmatically select a list item by its names (via the `selectItem` method).
  - String searches are not case-sensitive.
- Add `selectedItem` getter.
- Improve error catching.

### 1.0.0

- Initial Release

## License

Copyright (c) 2015, 2017 Leandro Silva (http://grafluxe.com)

Released under the MIT License.

See LICENSE.md for entire terms.
