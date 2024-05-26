const { GUILD_ID, LOCAL_MESSAGE_ID, LOCAL_MESSAGE_CHANNEL_ID, LOCAL_MESSAGES } = require('../config.json');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

class localMessage {
    constructor(client, readySystem) {
        this.client = client;
        this.readySystem = readySystem;
    }
    createButton() {
        if (LOCAL_MESSAGE_CHANNEL_ID == '') return;
        const guild = this.client.guilds.cache.get(GUILD_ID);
        const localChannel = guild.channels.cache.get(LOCAL_MESSAGE_CHANNEL_ID);

        if (localChannel) {
            const row = new ActionRowBuilder()
            for (let messages of LOCAL_MESSAGES) {
                row.addComponents(
                    new ButtonBuilder()
                    .setCustomId(messages["Custom_ID"])
                    .setLabel(messages["Label"])
                    .setStyle(ButtonStyle.Success)
                );
            }
            this.readySystem.sendOrUpdateMessage(localChannel, LOCAL_MESSAGE_ID, '點擊按鈕私訊訊息！', [row]);
        }
    }
    replyMessage(interaction, localMessage) {
        const user = interaction.user;
        try {
            interaction.reply({ content: `You clicked ID: ${localMessage["Custom_ID"]}`, ephemeral: true })
            user.send(`You have clicked ${localMessage["Message"]}`);
        } catch (error) {
            console.error(`無法向用戶發送私訊：${error}`);
        }
    }
}
module.exports = localMessage;