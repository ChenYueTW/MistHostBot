const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COMMAND_CHANNEL_ID } = require('../config.json');
const moment = require('moment');

class serverInfo {
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('查看伺服器資訊')
    }
    async execute(interaction) {
        if (!COMMAND_CHANNEL_ID == "" & !interaction.channelId == COMMAND_CHANNEL_ID) {
            await interaction.reply('不能在此頻道使用！');
            return;
        }
        let createdAt = moment(interaction.guild.createdAt);
        let dateFormat = createdAt.format('YY/MM/DD') + `\n\`(${createdAt.fromNow()})\``;

        const embed = new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({ text: `MistHost．託管服務` })
            .setColor('#00ffff')
            .addFields(
                { name: `擁有者ID`, value: `${interaction.guild.ownerId}`, inline: true },
                { name: `創建時間`, value: `${dateFormat}`, inline: true },
                { name: `伺服器ID`, value: `${interaction.guild.id}`, inline: true },
                { name: `Boost等級`, value: `${interaction.guild.premiumTier}`, inline: true },
                { name: `人數`, value: `\`${interaction.guild.memberCount}\``, inline: true },
                { name: `頻道數`, value: `${interaction.guild.channels.cache.size}`, inline: true }
            );
        await interaction.reply({ embeds: [embed] });
    }
}
module.exports = new serverInfo();