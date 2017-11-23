# Dropdownizer

Convert HTML `select` elements into customizable dropdowns.

This project...

- Is lightweight and dependency free.
- Includes support for native mobile dropdowns.
- Keeps original `select` elements in sync.
- Properly resizes the dropdown to match longest line.
- Works with a standard `change` event and proprietary `change` method.

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

Pass in a `string` to quickly bind to the *first found*  element.

```
new Dropdownizer("#my-dd");
```

Pass in an `array` to quickly bind to the *first found* elements.

```
new Dropdownizer(["#my-dd", ".dropdown"]);
```

Pass in an `DOM element` to bind to the returned element(s).

```
new Dropdownizer(document.querySelectorAll("select"));
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

See [examples](http://grafluxe.com/o/doc/dropdownizer/example).

## Notes

- Styles applied directly to the `select` element and/or its `id` are not copied to the dropdownizer instance. Use classes if you want sync styles.
- The `change` event and proprietary `change` method differ in what's returned.
  - The `change` event is dispatched from the original element while the `change` method belongs to the dropdownizer instance.

## License

Copyright (c) 2015, 2017 Leandro Silva (http://grafluxe.com)

Released under the MIT License.

See LICENSE.md for entire terms.
