const { prefix, aaPrefix } = require('../assets/constants.js');
const commands = require('../commands/commands.js')();

let emojis = require('../assets/emojis.json');

emojis = [emojis.find(e=>e.name==='gateofsnekked'), emojis.find(e=>e.name==='coronasnekfacethatiyoinkedfromga')]
	.map(emoji => ({ name: emoji.name, id: emoji.id, toString () { return `<:${this.name}:${this.id}>`; } }));

async function messageCreateHandler (message) {

	let _prefix = prefix;

	if (message.author.bot) return;

	if (message.guild?.id === '502554574423457812')
		_prefix = aaPrefix;
	else
		_prefix = prefix;

	if (message.content === '<@!820986412898713630>') {

		message.channel.send('<@!820986412898713630> is NOOB');
		return;

	}

	if ((!message.content.startsWith(_prefix)) && !(message.channel.id === '893112799771897906' || message.guild === null))
		return;
	
	let commandBody, reply, command, restArgs;

	if (!(message.channel.id === '893112799771897906' || (message.guild === null)))
		commandBody =  message.content.slice(_prefix.length).trim();
	else
		commandBody = message.content.startsWith(_prefix) ? message.content.slice(_prefix.length).trim() : message.content;

	if (commandBody.length == 0) return;

	[command, ...restArgs] = commandBody.toLowerCase().split(/\s+/);
	command = command.toLowerCase();

	if (commands.has(command)) {

		try {

			reply = await commands.get(command)(restArgs, message);

		}
		catch (e) {

			reply = {content: 'Error: Malformed command.'};

		}

	}
	else {

		if (_prefix.startsWith('.')) return;
		if (message.channel.id === '893112799771897906') return;

		reply = { content: `"${command}" not recognised!` };

	}

	if (message.content.includes('noob'))
		reply = { content: `no u ${emojis.find(e=>e.name==='coronasnekfacethatiyoinkedfromga')}` };

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
				if (Object.prototype.hasOwnProperty.call(reply[0],'embeds'))
					reply[0].embeds[0].title = emojis.find(e=>e.name==='gateofsnekked').toString();

			let embeds = [];

			for (let i = 0; i < reply.length; i++)
				embeds.push(...reply[i].embeds);

			reply.embeds = embeds;

		}
		else if (reply.embeds != undefined) {

			if (Math.floor(Math.random() * 100) >= 92)
				if (Object.prototype.hasOwnProperty.call(reply,'embeds'))
					reply.embeds[0].title = emojis.find(e=>e.name==='gateofsnekked').toString();

		}

		if (['nonverbose', 'chain', 'multi-enemy', 'getnames', 'junao', 'commands', 'getnps'].includes(reply.name)) {

			message.channel.send(reply);
			return;

		}

		let embeds = [];

		embeds = (restArgs.some(word => /hp\d+/g.test(word)) && reply.npGainEmbed) ? reply.npGainEmbed.embeds : reply.damageEmbed.embeds;
		embeds = (restArgs.includes('v') && reply.verboseEmbed) ? reply.verboseEmbed.embeds : embeds;

		const replyEmbed = await message.channel.send({
			embeds,
			components: [
				{
					type: 1,
					components: [
						{ type: 2, label: 'Damage', style: 2, custom_id: 'damageEmbed' },
						...(reply.refund ? [{ type: 2, label: 'NP Refund', style: 2, custom_id: 'npGainEmbed' }, { type: 2, label: 'Stars Dropped', style: 2, custom_id: 'starGenEmbed' }] : []),
						{ type: 2, label: 'Verbose Calc', style: 2, custom_id: 'verboseEmbed' }
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
			time: 300000
		});

		setTimeout(() => replyEmbed.edit({ components: [{type:1,components:replyEmbed.components[0].components.map(c=>{c.disabled=true;return c;})}]}), 300000);

		collector.on('collect', async interaction => {

			await interaction.update({embeds: reply[interaction.customId].embeds });
	
		});
	}
}

module.exports = exports = { messageCreateHandler };