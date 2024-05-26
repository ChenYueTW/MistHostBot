const { EmbedBuilder } = require("discord.js")

module.exports = (title, message) => {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(message)
        .setFooter({
            text: `MistHost．託管系統`
        })
        .setTimestamp(new Date());
    return embed;
}