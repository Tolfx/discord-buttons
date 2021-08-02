const { MessageComponentTypes, MessageButtonStyles, MessageButtonStylesAliases } = require('../Constants.js');
const { resolveString } = require('discord.js').Util;
const Util = require('../Util');

class MessageButton {
    constructor(data = {}, turnit) {
        this.setup(data, turnit);
    }

    setup(data, turnit = false) {
        this.type = MessageComponentTypes.BUTTON;

        this.style = 'style' in data ? Util.resolveStyle(data.style, turnit) : undefined;

        this.label = 'label' in data && data.label ? Util.verifyString(data.label) : undefined;

        this.disabled = 'disabled' in data ? data.disabled : false;

        if (turnit) this.hash = data.hash;

        if (data.emoji) this.setEmoji(data.emoji);

        if ('url' in data && data.url) this.url = Util.verifyString(data.url);
        else this.url = undefined;

        let id;
        if (data.id || data.custom_id) id = data.id || data.custom_id;

        turnit ? (this.id = id) : (this.custom_id = id);

        return this;
    }

    setStyle(style) {
        style = Util.resolveStyle(style);
        this.style = style;
        return this;
    }

    setLabel(label) {
        label = Util.verifyString(label);
        this.label = label;
        return this;
    }

    setDisabled(disabled) {
        if (disabled === false) this.disabled = false;
        else this.disabled = true;
        return this;
    }

    setURL(url) {
        this.url = Util.verifyString(url);
        return this;
    }

    setID(id) {
        this.custom_id = Util.verifyString(id);
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
        if (this.url)
            this.style = MessageButtonStyles["url"];

        if (typeof this.style === "string")
            this.style = MessageButtonStyles[this.style] ? MessageButtonStyles[this.style] : MessageButtonStylesAliases[this.style];

        return {
            type: MessageComponentTypes.BUTTON,
            style: this.style,
            label: this.label,
            emoji: this.emoji,
            disabled: this.disabled,
            url: this.url,
            custom_id: this.custom_id,
        };
    }
}

module.exports = MessageButton;