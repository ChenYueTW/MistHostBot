const { COMPONENTS } = require('../config.json');

class InteractionCreateRobot {
    constructor(client) {
        this.client = client;
    }
    handleInteractionCreate(interaction) {
        if (!interaction.isButton()) return;

        for (let components of COMPONENTS) {
            if (interaction.customId == components['Custom_ID']) {
                const member = interaction.member;
                const role = interaction.guild.roles.cache.get(components['Role_ID']);

                if (role) {
                    if (member.roles.cache.has(components['Role_ID'])) {
                        member.roles.remove(components['Role_ID']);
                        interaction.reply({ content: '已刪除您的' + components['Label'] + '身分組', ephemeral: true });
                        console.log(`刪除 ${member.user.username} 的 ${role.name}`);
                    } else {
                        member.roles.add(components['Role_ID']);
                        interaction.reply({ content: '已新增您的' + components['Label'] + '身分組', ephemeral: true });
                        console.log(`新增 ${member.user.username} 的 ${role.name}`);
                    }
                } else {
                    interaction.reply({ content: '出現錯誤', ephemeral: true });
                }
            }
        }
    }
}
module.exports = InteractionCreateRobot;