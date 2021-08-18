const { prefix, aaPrefix } = require('../assets/constants.js');
const commands = require('../commands/commands.js')();
const emojis = require('../assets/emojis.json');

async function messageCreateHandler (message) {

	let _prefix = prefix;

	if (message.author.bot) return;

	if (message.guild?.id === '502554574423457812')
		_prefix = aaPrefix;
	else
		_prefix = prefix;

	if (!message.content.startsWith(_prefix))
		return;
	
	let commandBody = message.content.slice(_prefix.length), reply, command, restArgs;

	if (commandBody.length == 0) return;

	[command, ...restArgs] = commandBody.toLowerCase().split(/\s+/);
	command = command.toLowerCase();

	reply = await commands.get(command)(restArgs, message);

	if (reply) {

		if ((!Array.isArray(reply)) &&  (typeof(reply.embeds) === 'undefined')) {

			message.channel.send(reply);
			return;

		}
		if (Array.isArray(reply)) {

			if ((reply[0].total === reply[0].minrollTotal) && (reply[0].maxrollTotal === reply[0].minrollTotal) && (reply[0].total === 0)) {

				message.channel.send({ content: reply[0].embeds[0].title });
				return;

			}
			if (Math.floor(Math.random() * 10) >= 8)
				if (reply[0].hasOwnProperty('embeds'))
					reply[0].embeds[0].title = emojis.find(e=>e.name==='gateofsnekked').toString();

			let embeds = [];

			for (let i = 0; i < reply.length; i++)
				embeds.push(...reply[i].embeds);

			reply.embeds = embeds;

		}
		else if (reply.embeds != undefined) {

			if (Math.floor(Math.random() * 100) >= 92)
				if (reply.hasOwnProperty('embeds'))
					reply.embeds[0].title = emojis.find(e=>e.name==='gateofsnekked').toString();

		}

		if (['nonverbose', 'chain', 'multi-enemy'].includes(reply.name)) {

			message.channel.send(reply);
			return;

		}

		const replyEmbed = await message.channel.send({
			embeds: reply.damageEmbed.embeds,
			components: [
				{
					type: 1,
					components: [
						{ type: 2, label: "Damage", style: 2, custom_id: "damageEmbed" },
						...(reply.refund ? [{ type: 2, label: "NP Refund", style: 2, custom_id: "npGainEmbed" }, { type: 2, label: "Stars Dropped", style: 2, custom_id: "starGenEmbed" }] : []),
						{ type: 2, label: "Verbose Calc", style: 2, custom_id: "verboseEmbed" }
					]
		
				}
			]
		});

		const collector = replyEmbed.createMessageComponentCollector({
			filter: function filter (i) {
				if (i.user.id !== message.author.id) {
					i.reply({content: `haha nooob ${emojis.find(e=>e.name==='coronasnekfacethatiyoinkedfromga')}`, ephemeral: true });
					return false;
				}
				return true;
			},
			time: 30000
		});

		collector.on('collect', async interaction => {

			await interaction.update({embeds: reply[interaction.customId].embeds });
	
		});
	}
}


module.exports = exports = { messageCreateHandler };