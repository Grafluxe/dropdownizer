"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @author Leandro Silva
* @copyright 2015, 2017 Leandro Silva (http://grafluxe.com)
* @license MIT
*/

var Dropdownizer = function () {
  /**
   * Creates a new Dropdownizer instance.
   * @throws {ReferenceError}     Throws if no such element exists in the DOM.
   * @throws {TypeError}          Throws if an unexpected argument is passed in.
   * @param  {String|HTMLElement} el The element to dropdownize.
   * @example
   * new Dropdownizer("select");
   * new Dropdownizer(document.querySelector("#my-dd");
   */
  function Dropdownizer(el) {
    _classCallCheck(this, Dropdownizer);

    var dds = [];

    if (typeof el === "string") {
      el = document.querySelectorAll(el);
    }

    if (!el || el.length === 0) {
      throw new ReferenceError("No such element exists.");
    }

    try {
      if (el.nodeType) {
        dds.push(new Dropdownize(el));
      } else {
        el.forEach(function (element) {
          dds.push(new Dropdownize(element));
        });
      }

      this._dropdowns = Object.freeze(dds);
    } catch (err) {
      throw new TypeError("Unexpected argument.");
    }
  }

  /**
   * Programmatically select list items.
   * @throws  {Error}        Throws if the index if out of bounds.
   * @param   {Number}       index The list items index.
   * @returns {Dropdownizer} The Dropdownizer instance.
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
     * Listens for change events.
     * @param   {Function}     callback The callback function to execute when a list item changes.
     * @returns {Dropdownizer} The Dropdownizer instance.
     */

  }, {
    key: "change",
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
   * @throws {ReferenceError} Throws if the element already has the reserved class name 'dropdownizer.'
   * @param  {HTMLElement}    el The element to dropdownize.
   */
  function Dropdownize(el) {
    _classCallCheck(this, Dropdownize);

    this._el = el;

    if (el.classList.contains("dropdownizer")) {
      throw new ReferenceError("The class name 'dropdownizer' is reserved. Please choose a different class name.");
    }

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
      this._bindFromOriginalElement();
      this._ui.btn.addEventListener("click", this._onClickBtn);
      this._ui.btn.innerHTML = this._options[this._lastSelectedIndex].label;
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
      this._ui.div.dropdownizer = this;
      this._ui.div.style.width = this._el.offsetWidth + "px";
      this._ui.div.classList = this._el.classList;
      this._ui.div.classList.add("dropdownizer");

      this._ui.div.appendChild(this._ui.btn);
      this._ui.div.appendChild(this._ui.ul);
    }
  }, {
    key: "_addListItemsListeners",
    value: function _addListItemsListeners() {
      var _this3 = this;

      this._listItems.forEach(function (listItem) {
        listItem.addEventListener("click", _this3._onClickListItem);
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
      this._el.classList = "dd-x";
    }

    /**
     * Programmatically select a list item.
     * @throws  {RangeError}  Throws if the index if out of bounds.
     * @param   {Number}      index The list items index.
     * @returns {Dropdownize} The Dropdownize instance.
     */

  }, {
    key: "selectItem",
    value: function selectItem(index) {
      var listItem = this._listItems[index];

      if (!listItem) {
        throw new RangeError("Your index is out of bounds.");
      }

      if (listItem === this._listItems[this._lastSelectedIndex]) {
        return;
      }

      this._listItems[this._lastSelectedIndex].removeAttribute("data-selected");
      this._lastSelectedIndex = index;

      this._ui.btn.innerHTML = listItem.innerHTML;
      listItem.setAttribute("data-selected", true);

      this._el.selectedIndex = this._lastSelectedIndex;

      if (this._changeCallback) {
        var data = Object.assign({}, listItem.dataset);

        delete data.selected;

        this._changeCallback({
          type: "change",
          target: this._ui.div,
          selectedTarget: listItem,
          data: data
        });
      }

      if (!this._changeFromOriginalElement) {
        this._el.dispatchEvent(new Event("change"));
      }

      this._changeFromOriginalElement = false;
      return this;
    }

    /**
     * Listens for change events.
     * @param   {Function}    callback The callback function to execute when a list item changes.
     * @returns {Dropdownize} The Dropdownize instance.
     */

  }, {
    key: "change",
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
      var _this4 = this;

      this._ui.btn.removeEventListener("click", this._onClickBtn);
      this._ui.div.removeEventListener("mouseleave", this._onMouseLeave);
      this._ui.div.removeEventListener("mouseover", this._onMouseOver);
      this._el.removeEventListener("change", this._onChange);
      document.removeEventListener("click", this._onDocClick);

      this._listItems.forEach(function (listItem) {
        listItem.removeEventListener("click", _this4._onClickListItem);
      });

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
  }]);

  return Dropdownize;
}();

// Support CJS/Node


if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
  module.exports = Dropdownizer;
}
