const MessageButton = require('./MessageButton');
const MessageMenu = require('./MessageMenu');
const { MessageComponentTypes } = require('../Constants');
const Util = require('../Util');

class MessageActionRow {
  constructor(data = {}) {
    if (!data.type) return {};
    this.hasMenu = false;
    this.setup(data);
  }

  setup(data) {

    this.components = [];
    if ('component' in data) {
      if (data.type === MessageComponentTypes.BUTTON) {
        Util.checkButton(data);
        this.components.push(new MessageButton(data));

      } else if (data.type === MessageComponentTypes.SELECT_MENU) {

        if (this.components.length > 0)
          throw new Error('TOO_MUCH_COMPONENTS: You can use 1 select menu per row, without other components.');

        Util.checkMenu(data);
        this.components.push(new MessageMenu(data));
        this.hasMenu = true;

      }
    }

    if ('components' in data) {
      this.components.push(data.components.map((c) => {
        if (c.type === MessageComponentTypes.BUTTON) {

          if (this.hasMenu)
            throw new Error('TOO_MUCH_COMPONENTS: You can use 1 select menu per row, without other components.');

          if (this.components.length > 5)
            throw new Error('TOO_MUCH_COMPONENTS: You can provide 5 buttons per row');

          Util.checkButton(c);
          return new MessageButton(c);

        } else if (c.type === MessageComponentTypes.SELECT_MENU) {

          if (this.components.length > 0)
            throw new Error('TOO_MUCH_COMPONENTS: You can use 1 select menu per row, without other components.');

          Util.checkMenu(c);
          return new MessageMenu(c);

        }
      }));
    }

    return this;
  }

  addComponents(...components) {
    this.components.push(...components.flat(Infinity).map((c) => {
      if (c.type === MessageComponentTypes.BUTTON) {

        if (this.hasMenu)
          throw new Error('TOO_MUCH_COMPONENTS: You can use 1 select menu per row, without other components.');

        if (this.components.length > 5)
          throw new Error('TOO_MUCH_COMPONENTS: You can provide 5 buttons per row');

        Util.checkButton(c);
        return new MessageButton(c);

      } else if (c.type === MessageComponentTypes.SELECT_MENU) {

        if (this.components.length > 0)
          throw new Error('TOO_MUCH_COMPONENTS: You can use 1 select menu per row, without other components.');

        Util.checkMenu(c);
        return new MessageMenu(c);

      }
    }));
    return this;
  }

  addComponent(data) {
    if (data.type === MessageComponentTypes.BUTTON) {

      if (this.hasMenu)
        throw new Error('TOO_MUCH_COMPONENTS: You can use 1 select menu per row, without other components.');

      if (this.components.length > 5)
        throw new Error('TOO_MUCH_COMPONENTS: You can provide 5 buttons per row');

      Util.checkButton(data);
      this.components.push(new MessageButton(data));

    } else if (data.type === MessageComponentTypes.SELECT_MENU) {

      if (this.components.length > 0)
        throw new Error('TOO_MUCH_COMPONENTS: You can use 1 select menu per row, without other components.');

      Util.checkMenu(data);
      this.components.push(new MessageMenu(data));
      this.hasMenu = true;

    }
    return this;
  }

  removeComponents(index, deleteCount) {
    this.components.splice(index, deleteCount);
    return this;
  }

  toJSON() {
    return {
      components: this.components
        ? this.components.map((c) => {
            if (c instanceof MessageButton || c instanceof MessageMenu) {
              return c;
            } else {
              switch (c.type) {
                case MessageComponentTypes.BUTTON:
                  return new MessageButton(c);
                case MessageComponentTypes.SELECT_MENU:
                  return new MessageMenu(c);
              }
            }
          })
        : [],
      type: MessageComponentTypes.ACTION_ROW,
    };
  }
}

module.exports = MessageActionRow;
