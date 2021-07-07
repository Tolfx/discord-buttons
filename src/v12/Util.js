const { MessageButtonStyles, MessageButtonStylesAliases, MessageComponentTypes } = require('./Constants.js');

class Util extends null {
  static resolveStyle(style) {
    if (!style || style === undefined || style === null) throw new TypeError('NO_BUTTON_STYLE: Please provide button style');

    if (style === 'gray') style = 'grey';

    if (!MessageButtonStyles[style] && !MessageButtonStylesAliases[style])
      throw new TypeError('INVALID_BUTTON_STYLE: An invalid button styles was provided');

    return typeof style === 'string' ? MessageButtonStyles[style] || MessageButtonStylesAliases[style] : style;
  }

  static resolveButton(data) {
    if (data.type !== MessageComponentTypes.BUTTON) throw new TypeError('INVALID_BUTTON_TYPE: Invalid type');

    if (!data.style) throw new TypeError('NO_BUTTON_STYLE: Please provide button style');

    if (!data.label && !data.emoji) throw new TypeError('NO_BUTTON_LABEL_AND_EMOJI: Please provide button label and/or emoji');

    if ('disabled' in data && typeof data.disabled !== 'boolean')
      throw new TypeError('BUTTON_DISABLED: The button disabled option must be boolean (true/false)');

    if (data.style === MessageButtonStyles['url'] && !data.url) throw new TypeError('NO_BUTTON_URL: You provided url style, you must provide an URL');

    if (data.style !== MessageButtonStyles['url'] && data.url)
      throw new TypeError('BOTH_URL_CUSTOM_ID: A custom id and url cannot both be specified');

    if (data.style === MessageButtonStyles['url'] && data.custom_id)
      throw new TypeError('BOTH_URL_CUSTOM_ID: A custom id and url cannot both be specified');

    if (data.style !== MessageButtonStyles['url'] && !data.custom_id) throw new TypeError('NO_BUTTON_ID: Please provide button id');

    return {
      style: data.style,
      label: data.label,
      emoji: data.emoji,
      disabled: data.disabled,
      url: data.url,
      custom_id: data.custom_id,
      type: MessageComponentTypes.BUTTON,
    };
  }

  static resolveMenu(data) {
    if (data.type !== MessageComponentTypes.SELECT_MENU) throw new TypeError('INVALID_MENU_TYPE: Invalid type');

    if (data.placeholder && typeof data.placeholder !== 'string')
      throw new Error('INVALID_MENU_PLACEHOLDER: The given menu placeholder is not string');

    if (!data.custom_id) throw new Error('NO_MENU_ID: Please provide menu id');

    let options = this.resolveMenuOptions(data.options);

    if (options.length < 1) throw new Error('NO_BUTTON_OPTIONS: Please provide at least one menu option');

    let maxValues = this.resolveMaxValues(data.max_values);
    let minValues = this.resolveMinValues(data.min_values);

    return {
      type: MessageComponentTypes.SELECT_MENU,
      placeholder: data.placeholder,
      custom_id: data.custom_id,
      options: options,
      max_values: maxValues,
      min_values: minValues,
    };
  }

  static resolveMenuOptions(data) {
    if (!Array.isArray(data)) throw new Error('INVALID_OPTIONS: The select menu options must be an array');

    let options = [];
    data.map((d) => {
      if (!d.value) throw new Error('VALUE_MISSING: Please provide a value for this option');

      if (!d.label) throw new Error('MISSING_LABEL: Please provide label for this option');

      options.push({
        label: d.label,
        value: d.value,
        emoji: d.emoji,
        description: d.description,
      });
    });

    return options;
  }

  static resolveType(type) {
    return typeof type === 'string' ? MessageComponentTypes[type] : type;
  }

  static resolveMaxValues(m1, m2) {
    return m1 || m2;
  }

  static resolveMinValues(m1, m2) {
    return m1 || m2;
  }

  static parseEmoji(emoji, animated) {
    if (emoji.includes('%')) emoji = decodeURIComponent(text);
    if (!emoji.includes(':')) return { animated: typeof animated === 'boolean' ? animated : false, name: emoji, id: null };
    const match = emoji.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
    return match && { animated: typeof animated === 'boolean' ? animated : Boolean(match[1]), name: match[2], id: match[3] || null };
  }

  static resolveEmoji(emoji, animated) {
    if (!emoji) return {};
    if (typeof emoji === 'string')
      return /^\d{17,19}$/.test(emoji) ? { id: emoji, animated: typeof animated === 'boolean' ? animated : false } : this.parseEmoji(emoji, animated);
    if (!emoji.id && !emoji.name) return null;
    if (typeof animated === 'boolean') emoji.animated = animated;
    return emoji;
  }

  static verifyString(data, allowEmpty = true, errorMessage = `Expected a string, got ${data} instead.`, error = Error) {
    if (typeof data !== 'string') throw new error(errorMessage);
    if (!allowEmpty && data.length === 0) throw new error(errorMessage);
    return data;
  }
}

module.exports = Util;
