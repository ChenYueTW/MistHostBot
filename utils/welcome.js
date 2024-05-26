const { WELCOME_CHANNEL_ID, LEAVE_CHANNEL_ID, CONSOLE_CHANNEL_ID, NEW_MEMBER_ROLE_ID } = require('../config.json');
const { EmbedBuilder } = require('discord.js');

class WelcomeFunction {
    constructor(client) {
        this.client = client;
    }
    handleGuildMemberAdd(member) {
        const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
        const consoleChannel = member.guild.channels.cache.get(CONSOLE_CHANNEL_ID);

        if (welcomeChannel) {
            const welcomeEmbed = new EmbedBuilder()
                .setAuthor({
                    name: '加入訊息！'
                })
                .setColor(0x00ffff)
                .setDescription(`歡迎 <@${member.user.id}> 來到了 **${member.guild.name}**\n請先閱讀<#1231428929491832944>\n可到<#1230004319940640868>領取身分組~`)
                .setFooter({
                    text: 'GuGa System'
                });

            welcomeChannel.send({ embeds: [welcomeEmbed] });

            // 將新成員加入特定身分組
            const newMemberRole = member.guild.roles.cache.get(NEW_MEMBER_ROLE_ID);
            if (newMemberRole) {
                member.roles.add(newMemberRole);
            }
        }
        if (consoleChannel) {
            const newMemberRole = member.guild.roles.cache.get(NEW_MEMBER_ROLE_ID);
            consoleChannel.send(`成員加入: <@${member.user.id}>\n給予了 \`${newMemberRole.name}\``);
        }
    }
    handleGuildMemberRemove(member) {
        const leaveChannel = member.guild.channels.cache.get(LEAVE_CHANNEL_ID);
        const consoleChannel = member.guild.channels.cache.get(CONSOLE_CHANNEL_ID);

        if (leaveChannel) {
            const leaveEmbed = new EmbedBuilder()
                .setAuthor({
                    name: '離開訊息'
                })
                .setColor(0x00ffff)
                .setDescription(`<@${member.user.id}> 離開了`)
                .setFooter({
                    text: 'GuGa System'
                });

            leaveChannel.send({ embeds: [leaveEmbed] });
        }
        if (consoleChannel) {
            consoleChannel.send(`成員離開: <@${member.user.id}>`)
        }
    }
}
module.exports = WelcomeFunction;