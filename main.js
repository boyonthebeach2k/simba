require('dotenv').config();

const client = new (require('discord.js')).Client({ intents: 32265, partials: ['CHANNEL', 'MESSAGE'] });//[Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES] });
const { messageCreateHandler } = require('./commands/handlers');
const TOKEN = (process.argv[2].toLowerCase() === 'dev') ? process.env.DEV_TOKEN : process.env.BOT_TOKEN;

client.on('ready', () => {

	console.info(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('!help', {
		type: 'WATCHING',
	});
});

client.on('messageCreate', messageCreateHandler);
client.login(TOKEN);