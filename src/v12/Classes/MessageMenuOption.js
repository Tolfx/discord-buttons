const Util = require('../Util');

class MessageMenuOption {
  constructor(data = {}) {
    this.setup(data);
  }

  setup(data) {
    this.label = 'label' in data && data.label ? Util.verifyString(data.label) : undefined;

    this.value = 'value' in data && data.value ? Util.verifyString(data.value) : undefined;

    if (data.emoji) this.setEmoji(data.emoji);

    this.description = 'description' in data ? data.description : undefined;

    this.default = typeof data.default === 'boolean' ? data.default : false;

    return this;
  }

  setLabel(label) {
    this.label = Util.verifyString(label);
    return this;
  }

  setValue(value) {
    this.value = Util.verifyString(value);
    return this;
  }

  setDescription(value) {
    this.description = Util.verifyString(value);
    return this;
  }

  setDefault(def = true) {
    this.default = def;
    return this;
  }

  setEmoji(emoji, animated) {
    if (!emoji) throw new Error('MISSING_EMOJI: `.setEmoji` was used without a provided emoji.');

    this.emoji = {
      id: undefined,
      name: undefined,
    };

    if (!isNaN(emoji)) this.emoji.id = emoji;
    if (!isNaN(emoji.id)) this.emoji.id = emoji.id;
    if (emoji.name) this.emoji.name = emoji.name;

    if (!this.emoji.id && !this.emoji.name) this.emoji.name = emoji;

    if (typeof animated === 'boolean') this.emoji.animated = animated;

    return this;
  }

  toJSON() {
    return {
      label: this.label,
      value: this.value,
      default: this.default || false,
      emoji: this.emoji,
      description: this.description,
    };
  }
}

module.exports = MessageMenuOption;
