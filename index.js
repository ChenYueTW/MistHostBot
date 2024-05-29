const { Client, GatewayIntentBits } = require('discord.js');
const { TOKEN, WAIT_TIME, LOCAL_MESSAGES } = require('./config.json');
const DeployCommand = require('./deploy-commands');
const ReadyRobot = require('./events/ready');
const InteractionCreateRobot = require('./events/InteractionCreate');
const WelcomeFunction = require('./utils/welcome');
const Earthquake = require('./utils/earthquake');
const LocalMessage = require('./utils/localMessage');
const TimeoutJson = require('./utils/timeout');
const pingCommand = require('./commands/ping');
const setIntervalCommand = require('./commands/setInterval');
const serverCommand = require('./commands/serverInfo');
const dashUserInfoCommand = require('./commands/dashUserInfo');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences
    ],
});

// 創建System物件
const deployCommands = new DeployCommand();
const readySystem = new ReadyRobot(client);
const welcomeSystem = new WelcomeFunction(client);
const earthquakeSystem = new Earthquake(client);
const localMessageSystem = new LocalMessage(client, readySystem);
const timeoutJsonSystem = new TimeoutJson(client);
const interactionSystem = new InteractionCreateRobot(client);

// 載入Slash Commands
(async () => {
    try {
        await deployCommands.deploy();
    } catch (error) {
        console.error('Error deploying commands or logging in bot:', error);
    }
})();

client.once('ready', () => {
    global.minutes = WAIT_TIME;
    readySystem.handleReady();
    localMessageSystem.createButton();
    client.user.setActivity('MistHost．託管服務 !');
    client.user.setPresence({
        status: 'online'
    });
    earthquakeSystem.isEarthquake();
    earthquakeSystem.setInterval(global.minutes);
    timeoutJsonSystem.setInterval();
})

client.on('guildMemberAdd', member => {
    welcomeSystem.handleGuildMemberAdd(member);
})

client.on('guildMemberRemove', member => {
    welcomeSystem.handleGuildMemberRemove(member);
})

client.on('interactionCreate', async interaction => {
    interactionSystem.handleInteractionCreate(interaction);
    
    if (interaction.isButton()) {
        for (let customId of LOCAL_MESSAGES) {
            if (interaction.customId == customId["Custom_ID"]) {
                localMessageSystem.replyMessage(interaction, customId);
            }
        }
    }

    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    if (commandName === 'ping') {
        await pingCommand.execute(interaction, client);
    } else if (commandName === 'setinterval') {
        await setIntervalCommand.execute(interaction);
    } else if (commandName == 'serverinfo') {
        await serverCommand.execute(interaction);
    } else if (commandName == 'dashuserinfo') {
        await dashUserInfoCommand.searchUserInfo(interaction, client);
    }
})

client.login(TOKEN);