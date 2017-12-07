"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Dropdownizer = function () {
  function Dropdownizer(el) {
    _classCallCheck(this, Dropdownizer);

    var dds = [];

    if (typeof el === "string") {
      el = document.querySelectorAll(el);
    } else if (el && el.nodeType) {
      el = [el];
    }

    if (!el || !el.forEach || el.length === 0) {
      throw new ReferenceError("No such element exists.");
    }

    el.forEach(function (element) {
      return dds.push(new Dropdownize(element));
    });
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


  _createClass(Dropdownizer, [{
    key: "selectItem",
    value: function selectItem(index) {
      this._dropdowns.forEach(function (dropdown) {
        return dropdown.selectItem(index);
      });
      return this;
    }

    /**
     * Gets information about the currently selected list item(s).
     * @type {Array|Object}
     */

  }, {
    key: "change",


    /**
     * Listens for change events.
     * @param   {Function}     callback The callback function to execute when a list item changes.
     * @returns {Dropdownizer} The Dropdownizer instance.
     */
    value: function change(callback) {
      this._dropdowns.forEach(function (dropdown) {
        return dropdown.change(callback);
      });
      return this;
    }

    /**
     * Removes all listeners.
     * @returns {Dropdownizer} The Dropdownizer instance.
     */

  }, {
    key: "removeListeners",
    value: function removeListeners() {
      this._dropdowns.forEach(function (dropdown) {
        return dropdown.removeListeners();
      });
      return this;
    }

    /**
     * Enables the disabled dropdowns.
     * @returns {Dropdownizer} The Dropdownizer instance.
     */

  }, {
    key: "enable",
    value: function enable() {
      this._dropdowns.forEach(function (dropdown) {
        return dropdown.enable();
      });
      return this;
    }

    /**
     * Disables the dropdowns.
     * @returns {Dropdownizer} The Dropdownizer instance.
     */

  }, {
    key: "disable",
    value: function disable() {
      this._dropdowns.forEach(function (dropdown) {
        return dropdown.disable();
      });
      return this;
    }

    /**
     * Removes listeners and destroys the dropdownizer instances.
     * @param   {Boolean}      resetOriginalElement=false Whether to reset the original 'select' elements.
     * @returns {Dropdownizer} The Dropdownizer instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var resetOriginalElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this._dropdowns.forEach(function (dropdown) {
        return dropdown.destroy(resetOriginalElement);
      });
      return this;
    }

    /**
     * Gets all dropdowns.
     */

  }, {
    key: "selectedItem",
    get: function get() {
      var selectedItems = this._dropdowns.map(function (dropdown) {
        return dropdown.selectedItem;
      });

      return selectedItems.length > 1 ? selectedItems : selectedItems[0];
    }
  }, {
    key: "dropdowns",
    get: function get() {
      return this._dropdowns;
    }

    /**
     * Prevents native mobile dropdowns. If prevented, dropdowns on mobile/touchable devices will work as
     * they do on desktops.
     */

  }], [{
    key: "preventNative",
    value: function preventNative() {
      Dropdownize._preventNative = true;
    }
  }]);

  return Dropdownizer;
}();

/**
 * @ignore
 */


var Dropdownize = function () {
  /**
   * Creates a new Dropdownize instance.
   * @throws {TypeError}          Throws if an unexpected argument was passed in.
   * @throws {ReferenceError}     Throws if no such element exists in the DOM.
   * @throws {ReferenceError}     Throws if your element has already been dropdownized.
   * @throws {ReferenceError}     Throws if your element already has the reserved class name 'dropdownizer.'
   * @param  {String|HTMLElement} el The element to dropdownize.
   */
  function Dropdownize(el) {
    _classCallCheck(this, Dropdownize);

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

  _createClass(Dropdownize, [{
    key: "_createElements",
    value: function _createElements() {
      this._ui = {
        div: document.createElement("div"),
        btn: document.createElement("button"),
        ul: document.createElement("ul")
      };
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      this._onClickBtn = this._openList.bind(this);
      this._onMouseOver = this._mouseOver.bind(this);
      this._onMouseLeave = this._mouseLeave.bind(this);
      this._onChange = this._syncDropdowns.bind(this);
      this._onClickListItem = this._listSelect.bind(this);
      this._onDocClick = this._preventNativeClick.bind(this);
    }
  }, {
    key: "_mouseLeave",
    value: function _mouseLeave() {
      this._leaveTimer = setTimeout(this._closeList.bind(this), 250);
      this._ui.div.addEventListener("mouseover", this._onMouseOver);
    }
  }, {
    key: "_mouseOver",
    value: function _mouseOver() {
      this._ui.div.removeEventListener("mouseover", this._onMouseOver);
      clearTimeout(this._leaveTimer);
    }
  }, {
    key: "_convertOptionsToListItems",
    value: function _convertOptionsToListItems() {
      var _this = this;

      this._listItems = [];
      this._lastSelectedIndex = 0;
      this._options = this._el.querySelectorAll("option");

      this._options.forEach(function (option, i) {
        var listItem = document.createElement("li");

        _this._setAttributes(listItem, option, i);
        listItem.innerHTML = option.label;

        _this._listItems.push(listItem);
        _this._ui.ul.appendChild(listItem);
      });

      this._listItems[this._lastSelectedIndex].setAttribute("data-selected", true);
    }
  }, {
    key: "_setAttributes",
    value: function _setAttributes(listItem, option, i) {
      var _this2 = this;

      listItem.setAttribute("data-value", option.value);

      Array.from(option.attributes).forEach(function (attr) {
        if (attr.name === "selected") {
          _this2._lastSelectedIndex = i;
        } else {
          listItem.setAttribute("data-" + attr.name, attr.value || true);
        }
      });
    }
  }, {
    key: "_setBtn",
    value: function _setBtn() {
      this._touchable = window.hasOwnProperty("ontouchstart") || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      this._copySelectElementAttributes();
      this._bindFromOriginalElement();
      this._ui.btn.addEventListener("click", this._onClickBtn);
      this._ui.btn.innerHTML = this._options[this._lastSelectedIndex].label;
    }
  }, {
    key: "_copySelectElementAttributes",
    value: function _copySelectElementAttributes() {
      var _this3 = this;

      var supportedInDivSpec = ["accesskey", "class", "contenteditable", "contextmenu", "id", "dir", "draggable", "dropzone", "hidden", "id", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "lang", "slot", "name", "spellcheck", "style", "tabindex", "title", "translate"];

      Array.from(this._el.attributes).forEach(function (attr) {
        var dataTag = "";

        if (!supportedInDivSpec.includes(attr.name) && attr.name.slice(0, 5) !== "data-") {
          dataTag = "data-";
        }

        _this3._ui.div.setAttribute(dataTag + attr.name, attr.value || true);
      });
    }
  }, {
    key: "_openList",
    value: function _openList(evt) {
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
    }
  }, {
    key: "_preventNativeClick",
    value: function _preventNativeClick(evt) {
      if (evt.target.parentNode !== this._ui.div) {
        document.removeEventListener("click", this._onDocClick);
        this._closeList();
      }
    }
  }, {
    key: "_closeList",
    value: function _closeList() {
      this._ui.div.classList.remove("dd-open");
    }
  }, {
    key: "_bindFromOriginalElement",
    value: function _bindFromOriginalElement() {
      this._el.addEventListener("change", this._onChange);
    }
  }, {
    key: "_syncDropdowns",
    value: function _syncDropdowns(evt) {
      var selectedListItem = this._listItems[evt.target.options.selectedIndex];

      this._changeFromOriginalElement = true;

      selectedListItem.click();
      selectedListItem.focus();
    }
  }, {
    key: "_setDropdown",
    value: function _setDropdown() {
      var pad = 0;

      if (this._touchable && window.getComputedStyle(this._el)["min-width"] === "0px") {
        pad = 9;
      }

      this._ui.div.dropdownizer = this;
      this._ui.div.style.width = this._el.offsetWidth + pad + "px";
      this._ui.div.classList = this._el.classList;
      this._ui.div.classList.add("dropdownizer");

      this._ui.div.appendChild(this._ui.btn);
      this._ui.div.appendChild(this._ui.ul);
    }
  }, {
    key: "_addListItemsListeners",
    value: function _addListItemsListeners() {
      var _this4 = this;

      this._listItems.forEach(function (listItem) {
        listItem.addEventListener("click", _this4._onClickListItem);
      });
    }
  }, {
    key: "_listSelect",
    value: function _listSelect(evt) {
      if (evt.target.dataset.disabled) {
        return;
      }

      this.selectItem(this._listItems.indexOf(evt.target));
      this._closeList();
    }
  }, {
    key: "_addToDOM",
    value: function _addToDOM() {
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

  }, {
    key: "selectItem",
    value: function selectItem(at) {
      if (typeof at === "string") {
        at = this._convertToIndex(at);
      }

      var listItem = this._listItems[at];

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
  }, {
    key: "_convertToIndex",
    value: function _convertToIndex(at) {
      at = at.toLowerCase();

      var match = this._listItems.filter(function (li) {
        var val = li.dataset.label || li.dataset.value;

        return val.toLowerCase() === at;
      });

      if (match.length > 1) {
        throw new Error("Your search returns multiple matches. Use an index instead.");
      }

      return this._listItems.indexOf(match[0]);
    }
  }, {
    key: "_callbackArgs",
    value: function _callbackArgs(listItem, type) {
      var data = Object.assign({ index: this._lastSelectedIndex }, listItem.dataset),
          out = void 0;

      delete data.selected;

      out = {
        target: this._ui.div,
        selectedTarget: listItem,
        data: data
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

  }, {
    key: "change",


    /**
     * Listens for change events.
     * @param   {Function}    callback The callback function to execute when a list item changes.
     * @returns {Dropdownize} The Dropdownize instance.
     */
    value: function change(callback) {
      this._changeCallback = callback;
      return this;
    }

    /**
     * Removes all listeners.
     * @returns {Dropdownize} The Dropdownize instance.
     */

  }, {
    key: "removeListeners",
    value: function removeListeners() {
      var _this5 = this;

      this._ui.btn.removeEventListener("click", this._onClickBtn);
      this._ui.div.removeEventListener("mouseleave", this._onMouseLeave);
      this._ui.div.removeEventListener("mouseover", this._onMouseOver);
      this._el.removeEventListener("change", this._onChange);
      document.removeEventListener("click", this._onDocClick);

      this._listItems.forEach(function (listItem) {
        listItem.removeEventListener("click", _this5._onClickListItem);
      });

      return this;
    }

    /**
     * Enables a disabled dropdown.
     * @returns {Dropdownize} The Dropdownize instance.
     */

  }, {
    key: "enable",
    value: function enable() {
      this._el.removeAttribute("disabled");
      this._ui.div.removeAttribute("data-disabled");

      return this;
    }

    /**
     * Disables the dropdown.
     * @returns {Dropdownize} The Dropdownize instance.
     */

  }, {
    key: "disable",
    value: function disable() {
      this._el.setAttribute("disabled", "true");
      this._ui.div.setAttribute("data-disabled", "true");

      return this;
    }

    /**
     * Removes listeners and destroys the dropdownizer instance.
     * @param   {Boolean}     resetOriginalElement=false Whether to reset the original 'select' element.
     * @returns {Dropdownize} The Dropdownize instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var resetOriginalElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

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
  }, {
    key: "selectedItem",
    get: function get() {
      return this._callbackArgs(this._listItems[this._lastSelectedIndex]);
    }
  }]);

  return Dropdownize;
}();

// Support CJS/Node


if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
  module.exports = Dropdownizer;
}
