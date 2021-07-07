const { resolveString } = require('discord.js').Util;
const Util = require('../Util');

class MessageMenuOption {
  constructor(data = {}) {
    this.setup(data);
  }

  setup(data) {
    this.label = 'label' in data && data.label ? resolveString(data.label) : undefined;

    this.value = 'value' in data && data.value ? resolveString(data.value) : undefined;

    if (data.emoji) this.setEmoji(data.emoji);

    this.description = 'description' in data ? data.description : undefined;

    return this;
  }

  setLabel(label) {
    this.label = resolveString(label);
    return this;
  }

  setValue(value) {
    this.value = resolveString(value);
    return this;
  }

  setDescription(value) {
    this.description = resolveString(value);
    return this;
  }

  setDefault(def = true) {
    this.default = def;
    return this;
  }

  setEmoji(emoji, animated) {
    this.emoji = Util.resolveEmoji(emoji, animated);
    return this;
  }

  toJSON() {
    return {
      label: this.label,
      value: this.value,
      default: this.default,
      emoji: this.emoji,
      description: this.description,
    };
  }
}

module.exports = MessageMenuOption;
