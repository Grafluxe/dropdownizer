# Dropdownizer

Converts HTML `select` elements into customizable dropdowns.

This project...

- Is lightweight and dependency free.
- Includes support for native mobile dropdowns.
- Keeps original `select` elements in sync.
- Properly resizes the dropdown to match the longest line.
- Works with standard `change` events and a proprietary `onChange` method.

## Usage

`npm i dropdownizer`

### Node

```javascript
let Dropdownizer = require("dropdownizer");
```

Minified version:

```javascript
let Dropdownizer = require("dropdownizer/dist/Dropdownizer.min");
```

### Browser

```javascript
import Dropdownizer from "dropdownizer";
```

Minified version:

```javascript
import Dropdownizer from "dropdownizer/dist/Dropdownizer.min";
```

Script tag:

```html
<script src="node_modules/dropdownizer/dist/Dropdownizer.min.js"></script>
```

## Stylesheet

```html
<link rel="stylesheet" href="node_modules/dropdownizer/style/dropdownizer.css">
```

## Documentation

See the [documentation](http://grafluxe.com/o/doc/dropdownizer/Dropdownizer.html).

## Examples

Pass in a `string` to bind to the matching element(s).

```javascript
new Dropdownizer("select");
```

Pass in an `HTMLElement` to bind to the matching element(s).

```javascript
new Dropdownizer(document.querySelector("select"));
```

Use the `onChange` method.

```javascript
new Dropdownizer("#my-dd").onChange(evt => {
  console.log(evt.data.value);
});
```

Listen to a `change` event.

```javascript
let dropdown = document.querySelector("#my-dd");

dropdown.addEventListener("change", evt => {
  console.log(evt.target.value);
});

new Dropdownizer(dropdown);
```

Use the `onOpen` and `onClose` methods.

```javascript
new Dropdownizer("#my-dd").onOpen(evt => {
  console.log("opened", evt.target);
}).onClose(evt => {
  console.log("closed", evt.target);
});
```

See [live examples](http://grafluxe.com/o/doc/dropdownizer/example).

## Notes

- Non-inline styles applied directly to the `select` element and/or its `id` are not copied to the dropdownizer instance. Use classes if you want sync styles.
- The `change` event and proprietary `onChange` method differ in what's returned.
  - The `change` event is dispatched from the original element while the `onChange` method belongs to the dropdownizer instance.
- Auto-size logic is not 100% accurate when a dropdown is initially invisible. Please test accordingly if your dropdown starts off in a hidden state.

## Changelog

See the [changelog here](CHANGELOG.md).

## License

Copyright (c) 2015, 2017-2018 Leandro Silva (http://grafluxe.com)

Released under the MIT License.

See LICENSE.md for entire terms.
