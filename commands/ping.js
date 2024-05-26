const { SlashCommandBuilder } = require('discord.js');
const { COMMAND_CHANNEL_ID } = require('../config.json');

class ping {
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('ping')
            .setDescription('一個Ping指令');
    }
    async execute(interaction, client) {
        if (!COMMAND_CHANNEL_ID == "" & !interaction.channelId == COMMAND_CHANNEL_ID) {
            await interaction.reply('不能在此頻道使用！');
            return;
        }
        const msg = await interaction.reply({
            content: "正在計算延遲...",
            fetchReply: true
        });
        const ping = msg.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong !\n機器人延遲：**${ping}** ms\nAPI延遲：**${client.ws.ping}** ms`);
    }
}
module.exports = new ping();