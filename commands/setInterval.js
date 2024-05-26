const { SlashCommandBuilder } = require('discord.js');
const { COMMAND_CHANNEL_ID } = require('../config.json');
const earthquake = require('../utils/earthquake');
const earthquakeSystem = new earthquake();

class setInterval {
    constructor(client) {
        this.data = new SlashCommandBuilder()
            .setName('setinterval')
            .setDescription('設定偵測地震時間間隔')
            .addStringOption(option =>
                option.setName('minutes')
                    .setDescription('設定間隔(分鐘)')
                    .setRequired(true)
            );
        this.client = client;
    }
    async execute(interaction) {
        if (!interaction.channelId == COMMAND_CHANNEL_ID) {
            await interaction.reply(`不能在此頻道使用！`);
            return;
        }
        global.minutes = interaction.options.getString('minutes');
        if (global.minutes == 0) {
            interaction.reply(`時間不能為 0 分鐘！`);
        } else {
            await interaction.reply(`偵測時間間隔更改為 **${global.minutes}** 分鐘！`);
            earthquakeSystem.setInterval(global.minutes);
        }
    }
}
module.exports = new setInterval();