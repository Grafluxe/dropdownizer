/**
 * @author Leandro Silva
 * @copyright 2015, 2017 Leandro Silva (http://grafluxe.com)
 * @license MIT
 *
 * @desc   Creates a new Dropdownizer instance.
 * @throws {TypeError}          Throws if an unexpected argument was passed in.
 * @throws {ReferenceError}     Throws if no such element exists in the DOM.
 * @throws {ReferenceError}     Throws if your element has already been dropdownized.
 * @throws {ReferenceError}     Throws if your element already has the reserved class name 'dropdownizer.'
 * @param  {String|HTMLElement} el The element(s) to dropdownize.
 */
class Dropdownizer {
  constructor(el) {
    let dds = [];

    if (typeof el === "string") {
      el = document.querySelectorAll(el);
    } else if (el && el.nodeType) {
      el = [el];
    }

    if (!el || !el.forEach || el.length === 0) {
      throw new ReferenceError("No such element exists.");
    }

    el.forEach(element => dds.push(new Dropdownize(element)));
    this._dropdowns = Object.freeze(dds);
  }

  /**
   * Programmatically select list items.
   * @throws  {Error}         Throws if your search returns multiple matches.
   * @throws  {RangeError}    Throws if the index is out of bounds.
   * @param   {Number|String} at The list items index or name. Note that if using a
   *                             string, letter case is ignored
   * @returns {Dropdownizer}  The Dropdownizer instance.
   */
  selectItem(index) {
    this._dropdowns.forEach(dropdown => dropdown.selectItem(index));
    return this;
  }

  /**
   * Gets information about the currently selected list item(s).
   * @type {Array|Object}
   */
  get selectedItem() {
    let selectedItems = this._dropdowns.map(dropdown => dropdown.selectedItem);

    return (selectedItems.length > 1 ? selectedItems : selectedItems[0]);
  }

  /**
   * Listens for change events.
   * @param   {Function}     callback The callback function to execute when a list item changes.
   * @returns {Dropdownizer} The Dropdownizer instance.
   */
  change(callback) {
    this._dropdowns.forEach(dropdown => dropdown.change(callback));
    return this;
  }

  /**
   * Listens for open events.
   * @param   {Function}    callback The callback function to execute when a dropdown is opened.
   * @returns {Dropdownizer} The Dropdownizer instance.
   */
  onOpen(callback) {
    this._dropdowns.forEach(dropdown => dropdown.onOpen(callback));
    return this;
  }

  /**
   * Listens for close events.
   * @param   {Function}    callback The callback function to execute when a dropdown is closed.
   * @returns {Dropdownizer} The Dropdownizer instance.
   */
  onClose(callback) {
    this._dropdowns.forEach(dropdown => dropdown.onClose(callback));
    return this;
  }

  /**
   * Removes all listeners.
   * @returns {Dropdownizer} The Dropdownizer instance.
   */
  removeListeners() {
    this._dropdowns.forEach(dropdown => dropdown.removeListeners());
    return this;
  }

  /**
   * Enables the disabled dropdowns.
   * @returns {Dropdownizer} The Dropdownizer instance.
   */
  enable() {
    this._dropdowns.forEach(dropdown => dropdown.enable());
    return this;
  }

  /**
   * Disables the dropdowns.
   * @returns {Dropdownizer} The Dropdownizer instance.
   */
  disable() {
    this._dropdowns.forEach(dropdown => dropdown.disable());
    return this;
  }

  /**
   * Removes listeners and destroys the dropdownizer instances.
   * @param   {Boolean}      resetOriginalElement=false Whether to reset the original 'select' elements.
   * @returns {Dropdownizer} The Dropdownizer instance.
   */
  destroy(resetOriginalElement = false) {
    this._dropdowns.forEach(dropdown => dropdown.destroy(resetOriginalElement));
    return this;
  }

  /**
   * Gets all dropdowns.
   */
  get dropdowns() {
    return this._dropdowns;
  }

  /**
   * Prevents native mobile dropdowns. If prevented, dropdowns on mobile/touchable devices will work as
   * they do on desktops.
   */
  static preventNative() {
    Dropdownize._preventNative = true;
  }

}

/**
 * @ignore
 */
class Dropdownize {
  /**
   * Creates a new Dropdownize instance.
   * @throws {TypeError}          Throws if an unexpected argument was passed in.
   * @throws {ReferenceError}     Throws if no such element exists in the DOM.
   * @throws {ReferenceError}     Throws if your element has already been dropdownized.
   * @throws {ReferenceError}     Throws if your element already has the reserved class name 'dropdownizer.'
   * @param  {String|HTMLElement} el The element to dropdownize.
   */
  constructor(el) {
    if (typeof el === "string") {
      el = document.querySelector(el);
    }

    if (!el || el.length === 0) {
      throw new ReferenceError("No such element exists.");
    }

    if (!el.nodeType) {
      throw new TypeError("An unexpected argument was passed in.");
    }

    if (el.hasOwnProperty("dropdownized") || el.hasOwnProperty("dropdownizer")) {
      throw new ReferenceError("Your element has already been dropdownized.");
    }

    if (el.classList.contains("dropdownizer")) {
      throw new ReferenceError("The class name 'dropdownizer' is reserved. Please choose a different class name.");
    }

    this._el = el;

    this._createElements();
    this._bindEvents();
    this._convertOptionsToListItems();
    this._setBtn();
    this._setDropdown();
    this._addListItemsListeners();
    this._addToDOM();
  }

  _createElements() {
    this._ui = {
      div: document.createElement("div"),
      btn: document.createElement("button"),
      ul: document.createElement("ul")
    };
  }

  _bindEvents() {
    this._onClickBtn = this._openList.bind(this);
    this._onMouseOver = this._mouseOver.bind(this);
    this._onMouseLeave = this._mouseLeave.bind(this);
    this._onChange = this._syncDropdowns.bind(this);
    this._onClickListItem = this._listSelect.bind(this);
    this._onDocClick = this._preventNativeClick.bind(this);
  }

  _mouseLeave() {
    this._leaveTimer = setTimeout(this._closeList.bind(this), 250);
    this._ui.div.addEventListener("mouseover", this._onMouseOver);
  }

  _mouseOver() {
    this._ui.div.removeEventListener("mouseover", this._onMouseOver);
    clearTimeout(this._leaveTimer);
  }

  _convertOptionsToListItems() {
    this._listItems = [];
    this._lastSelectedIndex = 0;
    this._options = this._el.querySelectorAll("option");
    this._longestLine = 0;

    this._options.forEach((option, i) => {
      let listItem = document.createElement("li");

      this._setAttributes(listItem, option, i);
      listItem.innerHTML = option.label;

      if (option.label.length > this._longestLine) {
        this._longestLine = option.label.length;
      }

      this._listItems.push(listItem);
      this._ui.ul.appendChild(listItem);
    });

    this._listItems[this._lastSelectedIndex].setAttribute("data-selected", true);
  }

  _setAttributes(listItem, option, i) {
    listItem.setAttribute("data-value", option.value);

    Array.from(option.attributes).forEach(attr => {
      if (attr.name === "selected") {
        this._lastSelectedIndex = i;
      } else {
        listItem.setAttribute("data-" + attr.name, attr.value || true);
      }
    });
  }

  _setBtn() {
    this._touchable = window.hasOwnProperty("ontouchstart") || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    this._copySelectElementAttributes();
    this._bindFromOriginalElement();
    this._ui.btn.addEventListener("click", this._onClickBtn);
    this._ui.btn.innerHTML = this._options[this._lastSelectedIndex].label;
  }

  _copySelectElementAttributes() {
    let supportedInDivSpec = [
      "accesskey", "class", "contenteditable", "contextmenu", "id", "dir",
      "draggable", "dropzone", "hidden", "id", "itemid", "itemprop", "itemref",
      "itemscope", "itemtype", "lang", "slot", "name", "spellcheck", "style",
      "tabindex", "title", "translate"
    ];

    Array.from(this._el.attributes).forEach(attr => {
      let dataTag = "";

      if (!supportedInDivSpec.includes(attr.name) && attr.name.slice(0, 5) !== "data-") {
        dataTag = "data-";
      }

      this._ui.div.setAttribute(dataTag + attr.name, attr.value || true);
    });
  }

  _openList(evt) {
    evt.preventDefault();

    if (this._ui.div.hasAttribute("disabled") || this._el.hasAttribute("disabled")) {
      return;
    }

    if (this._touchable && !Dropdownize._preventNative) {
      this._el.classList.remove("dd-x");
      this._el.focus();
      this._el.classList.add("dd-x");
    } else {
      if (this._ui.div.classList.contains("dd-open")) {
        this._closeList();
      } else {
        this._ui.div.classList.add("dd-open");

        if (Dropdownize._preventNative) {
          document.addEventListener("click", this._onDocClick);
        } else {
          this._ui.div.addEventListener("mouseleave", this._onMouseLeave);
        }
      }
    }

    if (this._openCallback && this._ui.div.classList.contains("dd-open")) {
      this._openCallback({
        target: this._ui.div,
        type: "open"
      });
    }
  }

  _preventNativeClick(evt) {
    if (evt.target.parentNode !== this._ui.div) {
      document.removeEventListener("click", this._onDocClick);
      this._closeList();
    }
  }

  _closeList() {
    if (this._ui.div.classList.contains("dd-open")) {
      this._ui.div.classList.remove("dd-open");

      if (this._closeCallback) {
        this._closeCallback({
          target: this._ui.div,
          type: "close"
        });
      }
    }
  }

  _bindFromOriginalElement() {
    this._el.addEventListener("change", this._onChange);
  }

  _syncDropdowns(evt) {
    let selectedListItem = this._listItems[evt.target.options.selectedIndex];

    this._changeFromOriginalElement = true;

    selectedListItem.click();
    selectedListItem.focus();
  }

  _setDropdown() {
    let computedStyles = window.getComputedStyle(this._el),
        divWidth = this._el.offsetWidth;

    if (this._touchable && computedStyles.minWidth === "0px") {
      divWidth += 9;
    }

    this._ui.div.dropdownizer = this;
    this._ui.div.style.minWidth = divWidth + "px";
    this._ui.div.classList = this._el.classList;
    this._ui.div.classList.add("dropdownizer");

    this._ui.div.appendChild(this._ui.btn);
    this._ui.div.appendChild(this._ui.ul);

    if (this._el.offsetWidth === 0) {
      // Reestimate width if 'offsetWidth' is 0. Added since invisible items have a 0 'offsetWidth'.
      setTimeout(() => {
        let btnComputedStyles = window.getComputedStyle(this._ui.btn),
            padding = parseInt(btnComputedStyles.paddingLeft) + parseInt(btnComputedStyles.paddingRight),
            fontSize = Math.max(parseInt(computedStyles.fontSize), parseInt(btnComputedStyles.fontSize));

        divWidth = Math.ceil((fontSize / 2) * this._longestLine + padding);

        this._ui.div.style.minWidth = divWidth + "px";
      }, 0);
    }
  }

  _addListItemsListeners() {
    this._listItems.forEach(listItem => {
      listItem.addEventListener("click", this._onClickListItem);
    });
  }

  _listSelect(evt) {
    if (evt.target.dataset.disabled) {
      return;
    }

    this.selectItem(this._listItems.indexOf(evt.target));
    this._closeList();
  }

  _addToDOM() {
    this._el.parentNode.insertBefore(this._ui.div, this._el.nextSibling);

    if (this._el.id) {
      this._origId = this._el.id;

      this._ui.div.id = this._el.id;
      this._el.id = "__" + this._el.id;
    }

    this._origClasses = this._el.classList.toString();
    this._el.dropdownized = true;
    this._el.classList = "dd-x";
  }

  /**
   * Programmatically select a list item.
   * @throws  {Error}         Throws if your search returns multiple matches.
   * @throws  {RangeError}    Throws if the index is out of bounds.
   * @param   {Number|String} at The list items index or name. Note that if using a
   *                             string, letter case is ignored.
   * @returns {Dropdownize}   The Dropdownize instance.
   */
  selectItem(at) {
    if (typeof at === "string") {
      at = this._convertToIndex(at);
    }

    let listItem = this._listItems[at];

    if (!listItem) {
      throw new RangeError("Your index is out of bounds.");
    }

    if (listItem === this._listItems[this._lastSelectedIndex]) {
      return;
    }

    this._listItems[this._lastSelectedIndex].removeAttribute("data-selected");
    this._lastSelectedIndex = at;

    this._ui.btn.innerHTML = listItem.innerHTML;
    listItem.setAttribute("data-selected", true);

    this._el.selectedIndex = this._lastSelectedIndex;

    if (this._changeCallback) {
      this._changeCallback(this._callbackArgs(listItem, "change"));
    }

    if (!this._changeFromOriginalElement) {
      this._el.dispatchEvent(new Event("change"));
    }

    this._changeFromOriginalElement = false;
    return this;
  }

  _convertToIndex(at) {
    at = at.toLowerCase();

    let match = this._listItems.filter(li => {
      let val = li.dataset.label || li.dataset.value;

      return val.toLowerCase() === at;
    });

    if (match.length > 1) {
      throw new Error("Your search returns multiple matches. Use an index instead.");
    }

    return this._listItems.indexOf(match[0]);
  }

  _callbackArgs(listItem, type) {
    let data = Object.assign({index: this._lastSelectedIndex}, listItem.dataset),
        out;

    delete data.selected;

    out = {
      target: this._ui.div,
      selectedTarget: listItem,
      data
    };

    if (type) {
      out.type = type;
    }

    return out;
  }

  /**
   * Gets information about the currently selected list item.
   * @type {Object}
   */
  get selectedItem() {
    return this._callbackArgs(this._listItems[this._lastSelectedIndex]);
  }

  /**
   * Listens for change events.
   * @param   {Function}    callback The callback function to execute when a list item changes.
   * @returns {Dropdownize} The Dropdownize instance.
   */
  change(callback) {
    this._changeCallback = callback;
    return this;
  }

  /**
   * Listens for an open event.
   * @param   {Function}    callback The callback function to execute when a dropdown is opened.
   * @returns {Dropdownize} The Dropdownize instance.
   */
  onOpen(callback) {
    this._openCallback = callback;
    return this;
  }

  /**
   * Listens for a close event.
   * @param   {Function}    callback The callback function to execute when a dropdown is closed.
   * @returns {Dropdownize} The Dropdownize instance.
   */
  onClose(callback) {
    this._closeCallback = callback;
    return this;
  }

  /**
   * Removes all listeners.
   * @returns {Dropdownize} The Dropdownize instance.
   */
  removeListeners() {
    this._ui.btn.removeEventListener("click", this._onClickBtn);
    this._ui.div.removeEventListener("mouseleave", this._onMouseLeave);
    this._ui.div.removeEventListener("mouseover", this._onMouseOver);
    this._el.removeEventListener("change", this._onChange);
    document.removeEventListener("click", this._onDocClick);

    this._listItems.forEach(listItem => {
      listItem.removeEventListener("click", this._onClickListItem);
    });

    return this;
  }

  /**
   * Enables a disabled dropdown.
   * @returns {Dropdownize} The Dropdownize instance.
   */
  enable() {
    this._el.removeAttribute("disabled");
    this._ui.div.removeAttribute("data-disabled");

    return this;
  }

  /**
   * Disables the dropdown.
   * @returns {Dropdownize} The Dropdownize instance.
   */
  disable() {
    this._el.setAttribute("disabled", "true");
    this._ui.div.setAttribute("data-disabled", "true");

    return this;
  }

  /**
   * Removes listeners and destroys the dropdownizer instance.
   * @param   {Boolean}     resetOriginalElement=false Whether to reset the original 'select' element.
   * @returns {Dropdownize} The Dropdownize instance.
   */
  destroy(resetOriginalElement = false) {
    if (!this._destroyed) {
      this._destroyed = true;

      this.removeListeners();
      this._el.parentNode.removeChild(this._ui.div);

      if (resetOriginalElement) {
        if (this._origId) {
          this._el.id = this._origId;
        }

        this._el.classList = this._origClasses;
      }
    }

    return this;
  }

}

// Support CJS/Node
if (typeof module === "object" && module.exports) {
  module.exports = Dropdownizer;
}
