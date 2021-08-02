const discord = require('discord.js');
const client = new discord.Client({ intents: discord.Intents.ALL });
const client2 = new discord.Client({ intents: discord.Intents.ALL });
const disbut = require('./src/index');
disbut(client);
const fetch = require('node-fetch');
const { InteractionReplyTypes } = require('./src/v12/Constants');

client.on('ready', () => {
    console.log(client.user.tag);
});

client2.on('ready', () => console.log('2 ready'))

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('o')) {

        const embed = new discord.MessageEmbed().setDescription(`${discord.version}`);

        let option = new disbut.MessageMenuOption()
            .setLabel('op')
            .setValue('hi')
            .setDescription('ss');

        let reload = new disbut.MessageMenuOption()
            .setLabel('reload')
            .setEmoji('780988312172101682')
            .setValue('reload')
        // .setDefault();

        let xo = new disbut.MessageMenuOption()
            .setEmoji('❌')
            .setLabel('Sheesh')
            .setValue('xoption')
        // .setDefault();

        let opt = new disbut.MessageMenuOption()
            .setLabel('OPTION!!!')
            .setValue('FUCKING_OPTION');

        let select = new disbut.MessageMenu()
            .setID('hey')
            .addOptions(option, reload, xo, opt)
            .setPlaceholder('Select me!')
            .setMaxValues(1);

        // console.log(select)

        let row2 = new disbut.MessageActionRow()
            .addComponents(select);

        let btn = new disbut.MessageButton()
            .setLabel(' ')
            .setID('id')
            .setStyle('blurple')
            .setEmoji('❌');

        let m = await message.channel.send({ description: 'testing obj embed' });

        /*let collector = m.createMenuCollector((b) => b, { time: 10000 });

        collector.on('collect', (b) => {
            console.log(b.id);
            b.reply.defer();
        });

        collector.on('end', (b) => console.log('end'));*/
    }
});

client.on('clickButton', async (button) => {

    let btn = new disbut.MessageButton()
        .setLabel('.')
        .setID('idd')
        .setStyle('gray');

    let m = await button.reply.send({ content: 'hey', button: btn }).then(r => r.fetch());

    let filter = (b) => b;
    let collector = m.createButtonCollector(filter, { time: 15 * 1000 });

    collector.on('collect', async (b) => {
        console.log(b.discordID);
    });
});

client.on('clickMenu', async (menu) => {
    menu.message.components[1].components[0].setDisabled(false);

    console.log(menu.message.components.map(x => x.toJSON()));
    if (menu.values[0] === 'reload') {
        menu.message.update('hey', { components: menu.message.components.map(x => x.toJSON()) })
    }
});

client.login('');

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
