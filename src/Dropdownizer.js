/**
* @author Leandro Silva
* @copyright 2015, 2017 Leandro Silva (http://grafluxe.com)
* @license MIT
*/

class Dropdownizer{

  constructor(el) {
    let dds = [];

    if (typeof el === "string") {
      el = document.querySelector(el);
    } else if(el instanceof Array) {
      el = el.map(element => document.querySelector(element));
    }

    if (!el) {
      throw new Error("No such element exists.");
    }

    if (el.nodeType) {
      dds.push(new Dropdownize(el));
    } else {
      el.forEach(element => {
        dds.push(new Dropdownize(element));
      });
    }

    this.dropdowns = Object.freeze(dds);
  }

  selectItem(index) {
    this.dropdowns.forEach(dropdown => dropdown.selectItem(index));
    return this;
  }

  change(callback) {
    this.dropdowns.forEach(dropdown => dropdown.change(callback));
    return this;
  }

  removeListeners() {
    this.dropdowns.forEach(dropdown => dropdown.removeListeners());
    return this;
  }

  destroy(resetOriginalElement = false) {
    this.dropdowns.forEach(dropdown => dropdown.destroy(resetOriginalElement));
    return this;
  }

  static preventNative() {
    Dropdownize._preventNative = true;
  }

}

class Dropdownize {

  constructor(el) {
    this._el = el;

    if (el.classList.contains("dropdownizer")) {
      throw new Error("The class name 'dropdownizer' is reserved. Please choose a different class name.");
    }

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

    this._options.forEach((option, i) => {
      let listItem = document.createElement("li");

      this._setAttributes(listItem, option, i);
      listItem.innerHTML = option.label;

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
    this._bindFromOriginalElement();
    this._ui.btn.addEventListener("click", this._onClickBtn);
    this._ui.btn.innerHTML = this._options[this._lastSelectedIndex].label;
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
  }

  _preventNativeClick(evt) {
    if (evt.target.parentNode !== this._ui.div) {
      document.removeEventListener("click", this._onDocClick);
      this._closeList();
    }
  }

  _closeList() {
    this._ui.div.classList.remove("dd-open");
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
    this._ui.div.dropdownizer = this;
    this._ui.div.style.width = this._el.offsetWidth + "px";
    this._ui.div.classList = this._el.classList;
    this._ui.div.classList.add("dropdownizer");

    this._ui.div.appendChild(this._ui.btn);
    this._ui.div.appendChild(this._ui.ul);
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

  selectItem(index) {
    let listItem = this._listItems[index];

    if (!listItem) {
      throw new Error("Your index is out of bounds.");
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
      let data = Object.assign({}, listItem.dataset);

      delete data.selected;

      this._changeCallback({
        type: "change",
        target: this._ui.div,
        selectedTarget: listItem,
        data
      });
    }

    if (!this._changeFromOriginalElement) {
      this._el.dispatchEvent(new Event("change"));
    }

    this._changeFromOriginalElement = false;
    return this;
  }

  _addToDOM() {
    this._el.parentNode.insertBefore(this._ui.div, this._el.nextSibling);

    if (this._el.id) {
      this._origId = this._el.id;

      this._ui.div.id = this._el.id;
      this._el.id = "__" + this._el.id;
    }

    this._origClasses = this._el.classList.toString();
    this._el.classList = "dd-x";
  }

  change(callback) {
    this._changeCallback = callback;
    return this;
  }

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
