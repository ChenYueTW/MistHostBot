const axios = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const api = require('../config.json').HOST_API;
const { COMMAND_CHANNEL_ID } = require('../config.json');
const url = "https://helia.misthost.net/api/userInfo?id=";

class dashuserinfo {
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('dashuserinfo')
            .setDescription('查看面板使用者資訊')
            .addUserOption((input) => input.setName('user').setDescription("選擇要查看的使用者").setRequired(true));
    }
    async searchUserInfo(interaction, client) {
        if (!COMMAND_CHANNEL_ID == "" & !interaction.channelId == COMMAND_CHANNEL_ID) {
            await interaction.reply('不能在此頻道使用！');
            return;
        }
        const userId = interaction.options.getUser('user').id;
        let response = await axios.get(url + userId, {
            headers: {
                'Authorization': `Bearer ${api}`
            }
        });

        response = response.data;

        if (response.status == 'success') {
            const attributes = response.userinfo.attributes;
            const resources = {
                cpu: response.package.cpu + response.extra.cpu,
                ram: response.package.ram + response.extra.ram,
                disk: response.package.disk + response.extra.disk,
                servers: response.package.servers + response.extra.servers
            }
            const userAvatarURL = client.users.cache.get(response.userId).displayAvatarURL();
            const userName = `${attributes.first_name} ${attributes.last_name}`;
            const embed = new EmbedBuilder()
                .setTitle(userName)
                .setThumbnail(userAvatarURL)
                .setColor('#00ffff')
                .addFields(
                    { name: '資源', value: `\`\`\`CPU: ${resources.cpu / 100} 核心\nRam: ${resources.ram / 1024} GB\nDisk: ${resources.disk / 1024} GB\nServers: ${resources.servers} 個\`\`\`` }
                );
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply('請求失敗!');
        }
    }
}

module.exports = new dashuserinfo();