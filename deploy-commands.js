const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { CLIENT_ID, GUILD_ID, TOKEN } = require('./config.json');
const fs = require('fs');
const path = require('path');

class deployCommands {
	constructor() {}
	async deploy() {
		const commands = [];
		const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(path.join(__dirname, 'commands', file));
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: '10' }).setToken(TOKEN);

		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');

				await rest.put(
					Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
					{ body: commands },
				);

				console.log('Successfully reloaded application (/) commands.');
			} catch (error) {
				console.error(error);
			}
		})();
	}
}
module.exports = deployCommands;