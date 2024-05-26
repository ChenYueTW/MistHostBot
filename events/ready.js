const { GUILD_ID, ROLES_CHANNEL_ID, MESSAGE_ID, COMPONENTS } = require('../config.json');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

class ReadyRobot {
    constructor(client) {
        this.client = client;
    }
    handleReady() {
        console.log(`Logged in as ${this.client.user.tag}`);

        const guild = this.client.guilds.cache.get(GUILD_ID);
        const rolesChannel = guild.channels.cache.get(ROLES_CHANNEL_ID);

        if (rolesChannel) {
            const row = new ActionRowBuilder()
            for (let components of COMPONENTS) {
                row.addComponents(
                    new ButtonBuilder()
                    .setCustomId(components["Custom_ID"])
                    .setLabel(components["Label"])
                    .setStyle(ButtonStyle.Success)
                );
            }
            this.sendOrUpdateMessage(rolesChannel, MESSAGE_ID, '點擊按鈕獲取身分組。', [row]);
        }
    }
    async sendOrUpdateMessage(channel, messageId, content, components) {
        if (messageId) {
            // 如果有上次的訊息 ID，編輯該訊息
            try {
                const message = await channel.messages.fetch(messageId);
                if (message && message.edit) {
                    // 檢查 components 是否存在並且是一個陣列
                    if (components && Array.isArray(components)) {
                        // 將 components 直接設定為 MessageActionRow[]
                        await message.edit({ content, components });
                    } else {
                        // 如果 components 為空或不是陣列，則不傳遞 components
                        await message.edit({ content });
                    }
                    return;
                }
            } catch (error) {
                console.error(error);
            }
        }
    
        // 如果沒有上次的訊息 ID，發送新訊息
        channel.send({ content, components })
            .then(message => {
                messageId = message.id;
            })
            .catch(console.error);
    }
}
module.exports = ReadyRobot;