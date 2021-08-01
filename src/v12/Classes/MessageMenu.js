const { MessageComponentTypes } = require('../Constants.js');
const Util = require('../Util');
const MessageMenuOption = require('./MessageMenuOption');

class MessageMenu {
  constructor(data = {}) {
    this.setup(data);
  }

  setup(data) {
    this.placeholder = 'placeholder' in data ? data.placeholder : null;

    this.max_values = 'maxValues' in data || 'max_values' in data ? Util.resolveMaxValues(data.maxValues, data.max_values) : undefined;

    this.min_values = 'minValues' in data || 'min_values' in data ? Util.resolveMinValues(data.minValues, data.min_values) : undefined;

    this.disabled = 'disabled' in data && typeof data.disabled === 'boolean' ? data.disabled : false;

    this.disabled = (('disabled' in data) && (typeof data.disabled === 'boolean')) ? data.disabled : false;

    this.options = [];
    if ('option' in data) {
      data.option.type = 'SELECT_MENU_OPTION';
      this.options.push(BaseMessageComponent.create(data.option));
    }

    if ('options' in data) {
      data.options.map((c) => {
        this.options.push(new MessageMenuOption(c).toJSON());
      });
    }

    if (('id' in data && data.id) || ('custom_id' in data && data.custom_id)) this.custom_id = data.id || data.custom_id;
    else this.custom_id = undefined;

    return this;
  }

  setPlaceholder(label) {
    this.placeholder = label;
    return this;
  }

  setID(id) {
    this.custom_id = id;
    return this;
  }

  setMaxValues(number) {
    this.max_values = resolveMaxValues(number);
    return this;
  }

  setMinValues(number) {
    this.min_values = resolveMinValues(number);
    return this;
  }

  setDisabled(disable = true) {
    this.disabled = typeof disable === 'boolean' ? disable : true;
    return this;
  }

  addOption(option) {
    option.type = 'SELECT_MENU_OPTION';
    this.options.push(BaseMessageComponent.create(option));
    return this;
  }

  addOptions(...options) {
    this.options.push(...options.flat(Infinity).map((c) => new MessageMenuOption(c).toJSON()));
    return this;
  }

  removeOptions(index, deleteCount, ...options) {
    this.components.splice(index, deleteCount, ...options.flat(Infinity).map((c) => new MessageMenuOption(c).toJSON()));
    return this;
  }
  
  setDisabled(disable = true) {
    this.disabled = typeof disable === 'boolean' ? disable : true;
    return this;
  }

  toJSON() {
    return {
      type: MessageComponentTypes.SELECT_MENU,
      placeholder: this.placeholder,
      custom_id: this.custom_id,
      max_values: this.max_values,
      min_values: this.min_values,
      options: this.options,
      disabled: this.disabled
    };
  }
}

module.exports = MessageMenu;
