/**
* @author Leandro Silva
* @copyright 2015, 2017 Leandro Silva (http://grafluxe.com)
* @license MIT
*/

const CLASS_NAME = "dropdownizer";

class Dropdownizer{

  constructor(el) {
    try {
      if (typeof el === "string") {
        el = document.querySelector(el);
      } else if(el instanceof Array) {
        el = el.map(element => document.querySelector(element));
      }

      if (el.nodeType) {
        new Dropdownize(el).change(this._onChangeProxy.bind(this));
      } else {
        el.forEach(element => {
          new Dropdownize(element).change(this._onChangeProxy.bind(this));
        });
      }
    } catch (err) {
      throw new Error("No such element exists");
    }
  }

  _onChangeProxy(evt) {
    if(this._onChange) {
      this._onChange(evt);
    }
  }

  change(callback) {
    this._onChange = callback;
  }

}

class Dropdownize {

  constructor(el) {
    this._el = el;

    this._createElements();
    this._convertOptionsToListItems();
    this._setBtn();
    this._setDropdown();
    this._configureListItems();
    this._addToDOM();
  }

  _createElements() {
    this._ui = {
      div: document.createElement("div"),
      btn: document.createElement("button"),
      ul: document.createElement("ul")
    };
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
    let touchable = window.hasOwnProperty("ontouchstart") || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    this._closeList = () => {
      this._ui.div.classList.remove("dd-open");
      this._ui.div.removeEventListener("mouseleave", this._closeList);
    };

    this._bindFromOriginalElement();

    this._ui.btn.addEventListener("click", evt => {
      evt.preventDefault();

      if (this._ui.div.hasAttribute("disabled") || this._el.hasAttribute("disabled")) {
        return;
      }

      if (!touchable) {
        if (this._ui.div.classList.contains("dd-open")) {
          this._closeList();
        } else {
          this._ui.div.classList.add("dd-open");
          this._ui.div.addEventListener("mouseleave", () => setTimeout(this._closeList, 250));
        }
      } else {
        this._el.focus();
      }
    });

    this._ui.btn.innerHTML = this._options[this._lastSelectedIndex].label;
  }

  _bindFromOriginalElement() {
    this._el.addEventListener("change", evt => {
      let selectedListItem = this._listItems[evt.target.options.selectedIndex];

      this._changeFromOriginalElement = true;

      selectedListItem.click();
      selectedListItem.focus();
    });
  }

  _setDropdown() {
    this._ui.div.dropdownizer = this;
    this._ui.div.style.width = this._el.offsetWidth + "px";
    this._ui.div.classList = this._el.classList;
    this._ui.div.classList.add(CLASS_NAME);

    this._ui.div.appendChild(this._ui.btn);
    this._ui.div.appendChild(this._ui.ul);
  }

  _configureListItems() {
    this._listItems.forEach(listItem => {
      listItem.addEventListener("click", () => {
        if (listItem.dataset.disabled) {
          return;
        }

        this.selectItem(this._listItems.indexOf(listItem));
        this._closeList();
      });
    });
  }

  selectItem(index) {
    let listItem = this._listItems[index];

    if (!listItem) {
      console.error("Your index is out of bounds");
      return;
    }

    if (listItem === this._listItems[this._lastSelectedIndex]) {
      return;
    }

    this._listItems[this._lastSelectedIndex].removeAttribute("data-selected");
    this._lastSelectedIndex = index;

    this._ui.btn.innerHTML = listItem.innerHTML;
    listItem.setAttribute("data-selected", true);

    this._el.selectedIndex = this._lastSelectedIndex;

    if (this._onChange) {
      let data = Object.assign({}, listItem.dataset);

      delete data.selected;

      this._onChange({
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
  }

  _addToDOM() {
    this._el.parentNode.insertBefore(this._ui.div, this._el.nextSibling);

    if (this._el.id) {
      this._ui.div.id = this._el.id;
      this._el.id = "__" + this._el.id;
    }

    this._el.classList = "dd-x";
  }

  change(callback) {
    this._onChange = callback;
  }

}

// Support CJS/Node
if (typeof module === "object" && module.exports) {
  module.exports = Dropdownizer;
}
