const {
  MessageButtonStyles,
  MessageButtonStylesAliases,
  MessageComponentTypes
} = require('./Constants');

module.exports = {
  resolveStyle(style) {
    if (!style) throw new TypeError('NO_BUTTON_STYLE: Please provide a button style.');

    if((!MessageButtonStyles[style]) && (!MessageButtonStylesAliases[style])) throw new TypeError('INVALID_BUTTON_STYLE: An invalid button style was provided.');

    return MessageButtonStyles[style] ? MessageButtonStyles[style] : MessageButtonStylesAliases[style];
  },
  resolveButton(data) {
    if (data.type !== MessageComponentTypes.BUTTON) throw new TypeError('INVALID_BUTTON_TYPE: Invalid type.');
    
    if(data.url && data.style !== MessageButtonStyles["url"])
      data.style = MessageButtonStyles["url"];

    if (!data.style) throw new TypeError('NO_BUTTON_STYLE: Please provide a button style.');

    if (!data.label && !data.emoji) throw new TypeError('NO_BUTTON_LABEL_AND_EMOJI: Please provide a button label and/or an emoji.');

    if ('disabled' in data && typeof data.disabled !== 'boolean')
      throw new TypeError('BUTTON_DISABLED: The button disabled option must be a boolean type. (true/false)');

    if (data.style === MessageButtonStyles['url'] && !data.url) throw new TypeError('NO_BUTTON_URL: You provided a url style, but did not provide a URL.');

    if (data.style === MessageButtonStyles['url'] && data.custom_id)
      throw new TypeError('BOTH_URL_CUSTOM_ID: A custom id and url cannot both be specified.');

    if (data.style !== MessageButtonStyles['url'] && !data.custom_id) throw new TypeError('NO_BUTTON_ID: Please provide a button id');
  },
  checkMenu(data) {
    if (data.type !== MessageComponentTypes.SELECT_MENU)
      throw new TypeError('INVALID_MENU_TYPE: Invalid type.');

    if (data.emoji && data.emoji.name && this.isEmoji(data.emoji.name) === false)
      throw new TypeError('INCORRECT_EMOJI_NAME: Please provide a valid emoji');

    return {
      style: data.style,
      label: data.label,
      emoji: data.emoji,
      disabled: data.disabled,
      url: data.url,
      custom_id: data.custom_id,
      type: MessageComponentTypes.BUTTON,
    };
  },
  resolveMenu(data) {
    if (data.type !== MessageComponentTypes.SELECT_MENU) throw new TypeError('INVALID_MENU_TYPE: Invalid type.');

    if (data.placeholder && typeof data.placeholder !== 'string')
      throw new Error('INVALID_MENU_PLACEHOLDER: The given menu placeholder is not string.');

    if (!data.custom_id) throw new Error('NO_MENU_ID: Please provide a menu id.');

    if (typeof (data.placeholder) != 'string')
      throw new Error(`INVALID_MENU_PLACEHOLDER: The typeof MessageMenu.placeholder must be a string, received ${typeof (data.placeholder)} instead.`);

    if (options.length < 1) throw new Error('NO_BUTTON_OPTIONS: Please provide at least one menu option.');

    if (data.min_values && typeof (data.min_values) != 'number')
      throw new Error(`INVALID_MENU_MIN_VALUES: The typeof MessageMenu.minValues must be a number, received ${typeof (data.min_values)} instead.`);

    let disabled = typeof data.disabled === 'boolean' ? data.disabled : false;

    return {
      type: MessageComponentTypes.SELECT_MENU,
      custom_id: data.custom_id,
      options: options,
      placeholder: data.placeholder,
      min_values: minValues,
      max_values: maxValues,
      disabled: disabled
    };
  },
  resolveMenuOptions(data) {
    if (!Array.isArray(data)) throw new Error('INVALID_OPTIONS: The select menu options must be an array.');

    if (typeof (data.disabled) != 'boolean')
      throw new Error(`INVALID_MENU_DISABLED_OPTION: The typeof MessageMenu.disabled must be boolean, received ${typeof (data.disabled)} instead.`);

    this.checkMenuOptions(data.options);

    return true;
  },
  checkMenuOptions(data) {
    if (!Array.isArray(data)) throw new Error('INVALID_OPTIONS: The select menu options must be an array.');

    if (data.length < 1)
      throw new Error('TOO_LITTLE_MENU_OPTIONS: Please provide at least one MessageMenu option.');

    if (data.length > 25)
      throw new Error(`TOO_MUCH_MENU_OPTIONS: The limit of MessageMenu.options is 25, you provided ${options.length} options.`);

    let hasDefault = false;
    data.map((d) => {
      if (!d.value) throw new Error('VALUE_MISSING: Please provide a value for this option.');

      if (!d.label) throw new Error('MISSING_LABEL: Please provide label for this option.');

      options.push({
        label: d.label,
        value: d.value,
        description: d.description,
        emoji: d.emoji,
        default: d.default
      });
    });

    return true;
  },

  resolveType(type) {
    return typeof type === 'string' ? MessageComponentTypes[type] : type;
  },

  resolveMaxValues(m1, m2) {
    return m1 || m2;
  },

  resolveMinValues(m1, m2) {
    return m1 || m2;
  },

  resolveEmoji(emoji, animated) {
    if (!emoji) return {};
    if (typeof emoji === 'string')
      return /^\d{17,19}$/.test(emoji) ? { id: emoji, animated: typeof animated === 'boolean' ? animated : false } : this.parseEmoji(emoji, animated);
    if (!emoji.id && !emoji.name) return null;
    if (typeof animated === 'boolean') emoji.animated = animated;
    return emoji;
  },

  parseEmoji(emoji, animated) {
    if (emoji.includes('%')) emoji = decodeURIComponent(text);
    if (!emoji.includes(':')) return { animated: typeof animated === 'boolean' ? animated : false, name: emoji, id: null };
    const match = emoji.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
    return match && { animated: typeof animated === 'boolean' ? animated : Boolean(match[1]), name: match[2], id: match[3] || null };
  },

  verifyString(data, allowEmpty = true, errorMessage = `Expected a string, got ${data} instead.`, error = Error) {
    if (typeof data !== 'string') throw new error(errorMessage);
    if (!allowEmpty && data.length === 0) throw new error(errorMessage);
    return data;
  }
}

module.exports = Util;
