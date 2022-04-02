const f = (val) => Math.fround(val);

const arg = require('arg');
let document;
const {JSDOM}  = require('jsdom');
const https = require('https');
const fetch = require('node-fetch');

const { servants, NAServants, classList, classRelation, attributeRelation, passiveSkillSet, maxNAServant } = require('../assets/assets.js');
const { nicknames, freeQuests } = require('../assets/assets.js');
const { helpPages } = require('../assets/constants.js');
const emojiArray = require('../assets/emojis.json');

let emojis = [];

async function test (restArgs) {

	let argStr, servant, reply;

	try {
		[servant, argStr] = restArgs;

		if (servant == undefined) {

			reply = { content: 'haha :WoahWheeze:' };

		}
		else {

			let matches;

			restArgs = restArgs.slice(1).join(' ').split('#')[0].replace(/\/\*[\s\S]*?(\*\/)/g, '');

			matches = restArgs.match(/([bqax]|(np)){3}/g);

			argStr = restArgs.replace(/\|/g, '').replace(/([A-z])(-?\d)/g, '$1=$2').replace(/([a-z]+)/gi, '--$1');

			let servantId = (+servant === +servant) ? +servant : Object.keys(nicknames).find(id => nicknames[id].includes(servant));

			if (argStr.includes('--enemy=')) {

				reply = multiEnemy(servant, argStr, servantId, matches);

			}
			else {

				if (typeof servantId === 'undefined') reply = { content: `No match found for ${servant}` };
				else if (matches != null) reply = chain(servantId, argStr.toLowerCase(), servant, matches[0]);
				else reply = calc(servantId, argStr.toLowerCase(), servant);

			}
		}

	}
	catch (err) {
		console.log(err);
		reply = { content: err.toString() };
	}

	return reply;

}

async function freeQuestsCalc (restArgs) {

	let argStr, servant, fq, reply;

	try {

		[fq, servant, argStr] = restArgs;

		if (fq == undefined || servant == undefined) {

			reply = 'haha noob :WoahWheeze:';

		}
		else {

			let matches;

			restArgs = restArgs.slice(2).join(' ').split('#')[0].replace(/\/\*[\s\S]*?(\*\/)/g, '');

			matches = restArgs.match(/([bqa]|(np)){3}/g);

			argStr = restArgs.replace(/\|/g, '').replace(/([A-z])(-?\d)/g, '$1=$2').replace(/([a-z]+)/gi, '--$1');

			let servantId = (+servant === +servant) ? +servant : Object.keys(nicknames).find(id => nicknames[id].includes(servant));
			let war = Object.keys(freeQuests).find(section => Object.keys(freeQuests[section]).includes(fq));

			if (typeof war === 'undefined') return reply = ({ content: `${fq} not found (try using html id)`});

			let quest = freeQuests[war][fq];
			let enemyStr = '';
			let baseStr, enemyStrs;

			argStr = argStr.replace(/--wave=/g, '* --wave=') + ' * ';

			let waveCmdStr = (' ' + argStr).split(/\s*(?=--wave=\d+)/g).slice(1).join(' ');
			let waveCmds = argStr.match(/--wave=\d+[^*]*(?=\s+\*)/g) ?? [];

			argStr = argStr.replace(waveCmdStr, '');
			[baseStr, ...enemyStrs] = (' ' + argStr).split(/\s*(?=--enemy=\d+)/g);
			enemyStrs = enemyStrs.reduce((acc, val) => acc + ' ' + val, '');

			let tmpAry = Array.from(waveCmds);

			waveCmds = Array(3).fill().map(()=>({command: ''}));

			for (let wave of tmpAry) {

				waveCmds[wave.split('wave=')[1].split(' ')[0] - 1].command = wave.split(/wave=\d+\s+/g)[1];

			}

			let enemy;

			if ((enemy = quest.phases[0][0])) enemyStr += ` --enemy=3 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[0].command.replace(/--fr=\d+/g, '')} `;
			if ((enemy = quest.phases[0][1])) enemyStr += ` --enemy=2 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[0].command.replace(/--fr=\d+/g, '')} `;
			if ((enemy = quest.phases[0][2])) enemyStr += ` --enemy=1 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[0].command} `;
			if ((enemy = quest.phases[1][0])) enemyStr += ` --enemy=6 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[1].command.replace(/--fr=\d+/g, '')} `;
			if ((enemy = quest.phases[1][1])) enemyStr += ` --enemy=5 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[1].command.replace(/--fr=\d+/g, '')} `;
			if ((enemy = quest.phases[1][2])) enemyStr += ` --enemy=4 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[1].command} `;
			if ((enemy = quest.phases[2][0])) enemyStr += ` --enemy=9 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[2].command.replace(/--fr=\d+/g, '')} `;
			if ((enemy = quest.phases[2][1])) enemyStr += ` --enemy=8 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[2].command.replace(/--fr=\d+/g, '')} `;
			if ((enemy = quest.phases[2][2])) enemyStr += ` --enemy=7 --${enemy.attribute} --${enemy.class} --name=${enemy.name} --hp=${enemy.hp} ${waveCmds[2].command} `;

			reply = await multiEnemy(servant,baseStr + ' ' + enemyStr + ' ' + enemyStrs, servantId, matches);
		}

	}
	catch (err) {
		console.log(err);
		reply = { content: err };
	}

	return reply;

}

async function xmas (restArgs) {

	let argStr, servant, reply;

	try {
		[servant, argStr] = restArgs;

		if (servant == undefined) {

			reply = 'haha noob :WoahWheeze:';

		}
		else {

			let matches;

			restArgs = restArgs.slice().join(' ').split('#')[0].replace(/\/\*[\s\S]*?(\*\/)/g, '');
			matches = restArgs.match(/([bqa]|(np)){3}/g);
			argStr = restArgs.replace(/\|/g, '').replace(/([A-z])(-?\d)/g, '$1=$2').replace(/([a-z]+)/gi, '--$1');

			let servantId = (+servant === +servant) ? +servant : Object.keys(nicknames).find(id => nicknames[id].includes(servant));
			let enemyStr = '';
			let baseStr, enemyStrs;

			argStr = argStr.replace(/--wave=/g, '* --wave=') + ' * ';

			let waveCmdStr = (' ' + argStr).split(/\s*(?=--wave=\d+)/g).slice(1).join(' ');
			let waveCmds = argStr.match(/--wave=\d+[^*]*(?=\s+\*)/g) ?? [];

			argStr = argStr.replace(waveCmdStr, '');
			[baseStr, ...enemyStrs] = (' ' + argStr).split(/\s*(?=--enemy=\d+)/g);
			enemyStrs = enemyStrs.reduce((acc, val) => acc + ' ' + val, '');

			let tmpAry = Array.from(waveCmds);

			waveCmds = Array(3).fill().map(()=>({command: ''}));

			for (let wave of tmpAry) {

				waveCmds[wave.split('wave=')[1].split(' ')[0] - 1].command = wave.split(/wave=\d+\s+/g)[1];

			}

			enemyStr += ` --enemy=1 --sky --lancer --name=Snowman --hp=24945 ${waveCmds[0].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=2 --sky --lancer --name=Big Snowman --hp=33371 ${waveCmds[0].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=3 --sky --lancer --name=Snowman --hp=24526 ${waveCmds[0].command} `;
			enemyStr += ` --enemy=4 --sky --lancer --name=Santa-Hunting Creature --hp=92001 ${waveCmds[1].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=5 --sky --lancer --name=Big Snowman --hp=34015  ${waveCmds[1].command} `;
			enemyStr += ` --enemy=6 --sky --lancer --name=Snowman --hp=27176 ${waveCmds[1].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=7 --sky --lancer --name=Snowman --hp=31308 ${waveCmds[2].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=8 --sky --lancer --name=I Love Santa Claus --hp=151215 ${waveCmds[2].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=9 --sky --lancer --name=Snowman --hp=31869 ${waveCmds[2].command} `;

			reply = await multiEnemy(servant, baseStr + ' ' + enemyStr + ' ' + enemyStrs, servantId, matches);
		}

	}
	catch (err) {
		console.log(err);
		reply = { content: err };
	}

	return reply;

}

async function gf2Final (restArgs) {

	let argStr, servant, reply;

	try {
		[servant, argStr] = restArgs;

		if (servant == undefined) {

			reply = 'haha noob :WoahWheeze:';

		}
		else {

			let matches;

			restArgs = restArgs.slice(1).join(' ').split('#')[0].replace(/\/\*[\s\S]*?(\*\/)/g, '');
			matches = restArgs.match(/([bqa]|(np)){3}/g);
			argStr = restArgs.replace(/\|/g, '').replace(/([A-z])(-?\d)/g, '$1=$2').replace(/([a-z]+)/gi, '--$1');

			let servantId = (+servant === +servant) ? +servant : Object.keys(nicknames).find(id => nicknames[id].includes(servant));
			let enemyStr = '';
			let baseStr, enemyStrs;

			argStr = argStr.replace(/--wave=/g, '* --wave=') + ' * ';

			let waveCmdStr = (' ' + argStr).split(/\s*(?=--wave=\d+)/g).slice(1).join(' ');
			let waveCmds = argStr.match(/--wave=\d+[^*]*(?=\s+\*)/g) ?? [];

			argStr = argStr.replace(waveCmdStr, '');

			[baseStr, ...enemyStrs] = (' ' + argStr).split(/\s*(?=--enemy=\d+)/g);
			enemyStrs = enemyStrs.reduce((acc, val) => acc + ' ' + val, '');

			let tmpAry = Array.from(waveCmds);

			waveCmds = Array(3).fill().map(()=>({command: ''}));

			for (let wave of tmpAry) {

				waveCmds[wave.split('wave=')[1].split(' ')[0] - 1].command = wave.split(/wave=\d+\s+/g)[1];

			}

			enemyStr += ` --enemy=1 --sky --saber --name=Shaking Ghost --hp=20845 ${waveCmds[0].command} `;
			enemyStr += ` --enemy=2 --sky --saber --name=Absent-Minded Ghost --hp=11026 ${waveCmds[0].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=3 --sky --saber --name=Absent-Minded Ghost --hp=11026 ${waveCmds[0].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=4 --sky --saber --name=Shaking Ghost --hp=24788 ${waveCmds[1].command} `;
			enemyStr += ` --enemy=5 --sky --saber --name=Shaking Ghost --hp=24788 ${waveCmds[1].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=6 --earth --saber --name=Glasses God --hp=65100 ${waveCmds[1].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=7 --earth --saber --name=Siegfried Megane --hp=140976 ${waveCmds[2].command} `;
			enemyStr += ` --enemy=8 --earth --saber --name=Sigurd Megane --hp=81360 ${waveCmds[2].command.replace(/--fr=\d+/g, '')} `;
			enemyStr += ` --enemy=9 --man --saber --name=Gilles Saber --hp=76290 ${waveCmds[2].command.replace(/--fr=\d+/g, '')} `;
			reply = await multiEnemy(servant, baseStr + ' ' + enemyStr + ' ' + enemyStrs, servantId, matches);
		}

	}
	catch (err) {
		console.log(err);
		reply = { content: err };
	}

	return reply;

}

async function help (_, message) {

	const embedMessage = await message.channel.send({
		embeds: [{
			title: '__Arguments List__',
			description: helpPages.testArgs
		}],
		components: [
			{
				type: 1,
				components: [
					{ type: 2, label: 'General', style: 2, custom_id: 'testArgs' },
					{ type: 2, label: 'Cards', style: 2, custom_id: 'cardArgs' },
					{ type: 2, label: 'Waves', style: 2, custom_id: 'waveArgs' },
					{ type: 2, label: 'Aux', style: 2, custom_id: 'nonDmgArgs' },
					{ type: 2, label: 'Shorthands', style: 2, custom_id: 'shorthands' }
				]
	
			}
		]
	});

	const collector = embedMessage.createMessageComponentCollector({
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

		await interaction.update({embeds: [{ title: '__Arguments List__', description: helpPages[interaction.customId] }] });

	});

}

async function getnps (restArgs) {
	let servant = restArgs[0], title = `No matches found for ${servant}!`, description = '';
	let nps;

	if (+servant === +servant) {

		title = `NPs for ${servant}:`;
		nps = servants.find(s=>(s.collectionNo===parseInt(servant) && ('noblePhantasms' in s))).noblePhantasms;

		for (let [setnp, np] of nps.entries()) {

			description += `\n**snp${setnp}:**\n`;

			for (const npFn in np.functions) {
				if (np.functions[npFn].funcType.includes('damageNp')) {
					description += emojis.find(e=>e.name===np.card);
					np.functions[npFn].svals.forEach(e=>description+=(+e.Value/10)+'% ');
					description += '\n';
					break;
				}
			}
		}
	}
	else {

		description = 'Enter servant ID!';

	}

	const reply = {
		embeds: [{
			title,
			description
		}],
		name: 'getnps'
	};

	return reply;

}

async function getnames (restArgs) {

	let servant = restArgs[0], title = `No matches found for ${servant}!`, description = '';

	if (+servant === +servant) {

		if (nicknames[servant] && nicknames[servant].length > 0) {

			title = `Nicknames for Servant #${servant}:`;
			description = nicknames[servant].join('\n');

		}
	}
	else {
		let id = Object.keys(nicknames).find(id => nicknames[id].includes(servant));
		let names = nicknames[id];

		if (names) {

			title = `Nicknames for ${servant} (ID #${id}):`;
			description = names.join('\n');

		}
	}

	const reply = {
		embeds: [{
			title,
			description
		}],
		name: 'getnames'
	};

	return reply;

}

async function addname (restArgs, message) {

	let reply;

	if (process.env.AUTH_USERS.includes(message.author.id)) {

		let [id, ...nickname] = restArgs;
		nickname = nickname.join(' ');
		console.log(id, nickname, id in nicknames);

		if (id in nicknames) {
			if (!nicknames[id].includes(nickname)) {
				nicknames[id].push(nickname);
				require('fs').writeFileSync('./assets/nicknames.json', JSON.stringify(nicknames, null, 2));
				reply = { content: `Set ${id}: ${nickname}` };
			}
		}
	}

	return reply;

}

async function calc (servantId, argStr, servantName) {

	let args, warnMessage = '';

	try {
		args = arg({

			/* eslint-disable no-dupe-keys */

			//Variables
			'--atkmod'				:	[Number],
			'--npmod'				:	[Number],
			'--nplevel'				:	Number,
			'--npvalue'				:	Number,
			'--level'				:	Number,
			'--cardmod'				:	[Number],
			'--artsmod'				:	[Number],
			'--bustermod'			:	[Number],
			'--quickmod'			:	[Number],
			'--extramod'			:	[Number],
			'--str'					:	Number,
			'--setnp'				:	Number,
			'--ce'					:	Number,
			'--fou'					:	Number,
			'--foupaw'				:	[Number],
			'--totalattack'			:	Number,
			'--cardvalue'			:	Number,
			'--npval'				:	Number,
			'--npgen'				:	[Number],
			'--defmod'				:	[Number],
			'--flatdamage'			:	[Number],
			'--flatrefund'			:	[Number],
			'--semod'				:	[Number],
			'--pmod'				:	[Number],
			'--specialdefensemod'	:	[Number],
			'--specialattackmod'	:	[Number],
			'--critdamage'			:	[Number],
			'--artscritdamage'		:	[Number],
			'--bustercritdamage'	:	[Number],
			'--quickcritdamage'		:	[Number],
			'--arts'				:	Boolean,
			'--quick'				:	Boolean,
			'--buster'				:	Boolean,
			'--critical'			:	Boolean,
			'--busterfirst'			:	Boolean,
			'--nobusterfirst'		:	Boolean,
			'--artsfirst'			:	Boolean,
			'--quickfirst'			:	Boolean,
			'--first'				:	Boolean,
			'--second'				:	Boolean,
			'--third'				:	Boolean,
			'--extra'				:	Boolean,
			'--extracardmodifier'	:	Number,
			'--enemyservermod'		:	Number,
			'--serverrate'			:	Number,
			'--stargen'				:	[Number],
			'--stars'				:	Boolean,
			'--cardrefundvalue'		:	Number,
			'--classoverride'		:	Number,
			'--enemyhp'				:	Number,
			'--bc'					:	Boolean,
			'--brave'				:	Boolean,
			'--nonverbose'			:	Boolean,
			'--verbose'				:	arg.COUNT,
			'--superbg'				:	Boolean,
			'--superad'				:	Boolean,
			'--supersumo'			:	Boolean,
			'--superhns'			:	Boolean,
			'--superscope'			:	Boolean,
			'--superfondant'		:	Boolean,
			'--supered'				:	Boolean,
			'--supergrail'			:	Boolean,

			//Aliases
			'--v'					:	'--verbose',
			'--nv'					:	'--nonverbose',
			'--a'					:	'--atkmod',
			'--atk'					:	'--atkmod',
			'--n'					:	'--npmod',
			'--np'					:	'--nplevel',
			'--npv'					:	'--npvalue',
			'--npval'				:	'--npvalue',
			'--npo'					:	'--npvalue',
			'--npoverride'			:	'--npvalue',
			'--lvl'					:	'--level',
			'--l'					:	'--level',
			'--npgain'				:	'--npgen',
			'--ng'					:	'--npgen',
			'--sg'					:	'--stargen',
			'--m'					:	'--cardmod',
			'--am'					:	'--artsmod',
			'--bm'					:	'--bustermod',
			'--qm'					:	'--quickmod',
			'--em'					:	'--extramod',
			'--hp'					:	'--enemyhp',
			'--c'					:	'--ce',
			'--cm'					:	'--cardmod',
			'--f'					:	'--fou',
			'--fp'					:	'--foupaw',
			'--cmv'					:	'--cardvalue',
			'--npv'					:	'--npvalue',
			'--d'					:	'--defmod',
			'--def'					:	'--defmod',
			'--fd'					:	'--flatdamage',
			'--ad'					:	'--flatdamage',
			'--flatgain'			:	'--flatrefund',
			'--fr'					:	'--flatrefund',
			'--fg'					:	'--flatrefund',
			'--se'					:	'--semod',
			'--s'					:	'--semod',
			'--p'					:	'--pmod',
			'--sdm'					:	'--specialdefensemod',
			'--dr'					:	'--specialdefensemod',
			'--sam'	 	 	 	 	:	'--specialattackmod',
			'--attackspecialdamage'	:	'--specialattackmod',
			'--crit'				:	'--critical',
			'--bf'					:	'--busterfirst',
			'--busterchainmod'		:	'--bc',
			'--nobf'				:	'--nobusterfirst',
			'--crv'					:	'--cardrefundvalue',
			'--af'					:	'--artsfirst',
			'--qf'					:	'--quickfirst',
			'--sm'					:	'--enemyservermod',
			'--esm'					:	'--enemyservermod',
			'--sm'					:	'--enemyservermod',
			'--srr'					:	'--serverrate',
			'--sr'					:	'--serverrate',
			'--srv'					:	'--serverrate',
			'--ecm'					:	'--extracardmodifier',
			'--cao'					:	'--classoverride',
			'--man'					:	'--human',
			'--zerk'				:	'--berserker',
			'--zerker'				:	'--berserker',
			'--ae'					:	'--alterego',
			'--cd'					:	'--critdamage',
			'--acd'					:	'--artscritdamage',
			'--bcd'					:	'--bustercritdamage',
			'--qcd'					:	'--quickcritdamage',
			'--ta'					:	'--totalattack',
			'--sbg'					:	'--superbg',
			'--sf'					:	'--superfondant',
			'--sscope'				:	'--superscope',
			'--super'				:	'--supered',
			'--superer'				:	'--supergrail',
			'--hyper'				:	'--supergrail',
			'--snp'					:	'--setnp',
			'--esp'					:	'--extracardpower',

			//Debug and internal
			'--dump'				:	Boolean,
			'--reducedhp'			:	Number,
			'--maxreducedhp'		:	Number,

			//Enemy classes
			'--saber'				:	Boolean,
			'--archer'				:	Boolean,
			'--lancer'				:	Boolean,
			'--rider'				:	Boolean,
			'--caster'				:	Boolean,
			'--assassin'			:	Boolean,
			'--berserker'			:	Boolean,
			'--shielder'			:	Boolean,
			'--ruler'				:	Boolean,
			'--alterego'			:	Boolean,
			'--avenger'				:	Boolean,
			'--demongodpillar'		:	Boolean,
			'--beastii'				:	Boolean,
			'--beasti'				:	Boolean,
			'--mooncancer'			:	Boolean,
			'--beastiiir'			:	Boolean,
			'--beastiiil'			:	Boolean,
			'--foreigner'			:	Boolean,
			'--beastunknown'		:	Boolean,
			'--pretender'			:	Boolean,
			'--cccfinaleemiyaalter'	:	Boolean,

			//Enemy attributes
			'--human'				:	Boolean,
			'--sky'					:	Boolean,
			'--earth'				:	Boolean,
			'--star'				:	Boolean,
			'--beast'				:	Boolean

		}, {
			argv: argStr.split(/\s+/g),
			permissive: true
		});} catch(err) {
		if (err.code === 'ARG_UNKNOWN_OPTION') warnMessage +=  err.message.split('--').join('') + '\n';
		else return { content: `${err}`.replace(/--/g, '') };
	}

	if (args._.length > 0 && args._.indexOf('') !== 0) warnMessage = `Unrecognised option: ${args['_'][0]}!\n`;

	for (const key of Object.keys(args)) {
		if (key !== '_') {
			Object.defineProperty(args, key.substring(2), Object.getOwnPropertyDescriptor(args, key));
		}
		delete args[key];
	}

	let servant;

	for (const key of Object.keys(servants)) {

		if (servants[key].collectionNo !== parseInt(servantId)) continue;
		else if ((!('noblePhantasms' in servants[key])) && (servant.collectionNo !== 336)) continue;
		else servant = servants[key];

		if (args.npLevel > 4) {
			warnMessage += 'NP Level cannot be greater than 5. Setting NP level to 5.\n';
			args.npLevel = 4;
		}

		if (args.fou < 0 || args.fou > 2000) {
			warnMessage += 'Fou value cannot be lesser than 0 or greater than 2000. Setting Fou value to 1000.\n';
			args.fou = 1000;
		}

		if (args.level < 1) {
			warnMessage += 'Servant level cannot be lesser than 0. Setting Servant level to max (ungrailed).\n';
			args.level = 0;
		}

		if (servant.collectionNo === 336)
			servant.noblePhantasms = [await (await fetch('https://api.atlasacademy.io/nice/JP/NP/1001150')).json()];

		let nps = Object.keys(servant.noblePhantasms), np, cardType;

		if (parseInt(servantId) <= parseInt(maxNAServant)) {

			nps = Object.keys(NAServants[Object.keys(NAServants).find(x => ((NAServants[x].collectionNo === parseInt(servantId)) && ('noblePhantasms' in NAServants[x])))].noblePhantasms);
			servantName = NAServants[Object.keys(NAServants).find(x=>NAServants[x].collectionNo === parseInt(servantId))].name;

		}

		servantName = servantName[0].toUpperCase() + servantName.slice(1);

		np = nps[nps.length - 1];

		nps = Object.keys(servants[Object.keys(servants).find(x => ((servants[x].collectionNo === parseInt(servantId)) && 'noblePhantasms' in servants[x]))].noblePhantasms);

		if (parseInt(servantId) === 268 || parseInt(servantId) === 312) np = nps[0];

		if (args.str != null) {
			if (args.str > 0) np = nps[nps.length - 1];
			else np = nps[0];
		}

		if (args.setnp != null) {
			np = nps[args.setnp];
		}

		switch (servant.noblePhantasms[np].card) {
		case 'buster': cardType = 1.5; break;
		case 'arts:': cardType = 1; break;
		case 'quick': cardType = 0.8; break;
		default: cardType = 1;
		}

		let enemyClass = '', enemyAttribute = '';

		for (const element of Object.keys(classList)) {
			if (args[element.toLowerCase()]) {
				enemyClass = element;
			}
		}

		for (const attrib of Object.keys(attributeRelation)) {
			if (args[attrib.toLowerCase()]) {
				enemyAttribute = attrib;
			}
		}

		enemyClass = enemyClass || 'shielder';
		enemyAttribute = enemyAttribute || servant.attribute;

		if (args.supered) {

			args.level = 100;
			args.fou = 2000;

		}
		if (args.supergrail) {
			args.level = 120;
			args.fou = 2000;
		}

		let servantClassRate = f(classList[servant.className]/f(1000));
		let atk = (args.level ? servant.atkGrowth[args.level - 1] : servant.atkMax) + (args.fou ?? 1000) + (args.ce ?? 0);

		atk = args.totalattack ?? atk;

		let advantage = f(classRelation[servant.className][enemyClass]/f(1000));
		let cardMod = args.extra ? f(0) : f(args.cardmod?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let critDamage = f(args.critdamage?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let npLevel = (args.nplevel ?? 5) - 1;
		let atkMod = f(args.atkmod?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let defMod = f(args.defmod?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let specialDefMod = f(args.specialdefensemod?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let specialAtkMod = f(args.specialattackmod?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let npMod = f(args.npmod?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let attributeAdvantage = attributeRelation[servant.attribute][enemyAttribute]/f(1000);
		let npMulti = 0;
		let npFns = servant.noblePhantasms[np].functions;

		if (servant.collectionNo === 1) {

			atk = (args.level ? servant.atkGrowth[args.level - 1] : servant.atkGrowth[79]) + (args.fou ?? 1000) + (args.ce ?? 0);

		}

		if (npLevel > 4) {

			warnMessage += 'NP Level cannot be greater than 5, setting to 5 (default).\n';
			npLevel = 4;

		} else if (npLevel < 0) {

			warnMessage += 'NP Level cannot be lesser than 1, setting to 1.\n';
			npLevel = 0;

		}

		for (const npFn in npFns) {
			if (npFns[npFn].funcType.includes('damageNp')) {
				npMulti = f(npFns[npFn].svals[npLevel].Value)/f(10);
				break;
			}
		}

		npMulti = f(args.npvalue ?? npMulti)/f(100);

		let faceCard = (args.extra || args.buster || args.arts || args.quick) ? true : false;
		let extraCardModifier = 1;
		let busterChainMod = (args.bc ? (0.2 * atk) : 0);
		let firstCardBonus = 0;

		if (npMulti === 0 && !faceCard)
			return [{
				embeds: [{
					title: `**${servantName}** NP does not deal damage!`,
					description: '0 (0 to 0)'
				}],
				total: 0,
				minrollTotal: 0,
				maxrollTotal: 0
			}];

		if (args.defmod) {

			if (defMod < -1) {

				warnMessage += 'Defense (de)buffs cannot exceed the range [-100%, 100%]!\n';
				defMod = -1;

			}
			else if (defMod > 1) {


				warnMessage += 'Defense (de)buffs cannot exceed the range [-100%, 100%]!\n';
				defMod = 1;

			}
		}

		let passiveSkills = passiveSkillSet[servantId];
		let flatDamage = f(args.flatdamage?.reduce((acc, val) => acc + val) ?? 0);
		let starGen =  f(args.stargen?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let npGen = f(args.npgen?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let seMod = f(((args.semod?.reduce((acc, val) => acc + val)) ?? 100) - 100)/f(100);
		let pMod = (args.pmod?.reduce((acc, val) => acc + val) ?? 0)/f(100);
		let foupaw = (args.foupaw?.reduce((acc, val) => acc + val) ?? 0);
		let hits;

		if (enemyClass === 'ruler' && servantId === '167') {
			advantage = f(classRelation[servant.className]['assassin']/f(1000));
		}

		if (args.classoverride) {

			advantage = f(args.classoverride);

		}

		if (args.buster) {cardType = 1.5; hits = servant.hitsDistribution['buster'];}
		else if (args.arts) {cardType = 1; hits = servant.hitsDistribution['arts'];}
		else if (args.quick) {cardType = 0.8; hits = servant.hitsDistribution['quick'];}
		else if (args.extra) {cardType = 1; hits = servant.hitsDistribution['extra'];}
		else hits = servant.noblePhantasms[np].npDistribution;

		let isCrit = ((faceCard && args.critical) && !args.extra) ? true : false;
		let total = 0;
		let cardValue = cardType;

		if (typeof args.cardvalue !== 'undefined') {
			cardValue = parseFloat(args.cardvalue);
		}
		else {
			cardValue = (args.npvalue != null) ? cardType : cardValue;
		}
		if (faceCard) {
			if ((args.bc && !args.extra) || args.buster || (busterChainMod && !args.extra)) {
				cardValue = 1.5;
			}
			if (args.second) {
				cardValue += (cardType * 0.2);
			}
			if (args.third) {
				cardValue += (cardType * 0.4);
			}
		}

		if (args.buster && !(args.second || args.third)) firstCardBonus = 0.5;

		if (args.extra) {faceCard = true; extraCardModifier = 2;}

		if ((args.bc || args.busterfirst) && faceCard) {
			firstCardBonus = 0.5;

			if (args.bc && args.extra) extraCardModifier = 3.5;
		}

		if (firstCardBonus === 0.5 && args.nobusterfirst)
			firstCardBonus = 0;

		extraCardModifier = args.extracardmodifier ?? extraCardModifier;
		firstCardBonus = faceCard ? firstCardBonus : 0;
		npMulti = faceCard ? 1 : npMulti;
		atk += faceCard ? foupaw ?? 0 : 0;

		if (args.quick || (servant.noblePhantasms[np].card === 'quick' && !faceCard)) {
			critDamage += f(parseFloat(passiveSkills.critdamage?.quick ?? 0))/f(100);
			cardMod +=  f(parseFloat(passiveSkills.cardmod?.quick ?? 0))/f(100);
		}
		else if (args.arts || (servant.noblePhantasms[np].card === 'arts' && !faceCard)) {
			critDamage += f(parseFloat(passiveSkills.critdamage?.arts ?? 0))/f(100);
			cardMod += f(parseFloat(passiveSkills.cardmod?.arts ?? 0))/f(100);
		}
		else if (args.buster || (servant.noblePhantasms[np].card === 'buster' && !faceCard)) {
			critDamage += f(parseFloat(passiveSkills.critdamage?.buster ?? 0))/f(100);
			cardMod += f(parseFloat(passiveSkills.cardmod?.buster ?? 0))/f(100);
		}

		flatDamage += f(parseFloat(passiveSkills.flatdamage?.value ?? 0));
		npGen += f(parseFloat(passiveSkills.npgen?.value ?? 0))/f(100);
		starGen += f(parseFloat(passiveSkills.stargen?.value ?? 0))/f(100);
		npMod += f(parseFloat(passiveSkills.npmod?.value ?? 0))/f(100);

		if (args.arts) critDamage += (args.artscritdamage?.reduce((acc, val) => acc + val) ?? 0)/100;
		if (args.buster) critDamage += (args.bustercritdamage?.reduce((acc, val) => acc + val) ?? 0)/100;
		if (args.quick) critDamage += (args.quickcritdamage?.reduce((acc, val) => acc + val) ?? 0)/100;

		if (isCrit && faceCard) pMod += critDamage;

		if (critDamage > 5) {
			warnMessage += 'Critdamage buffs cannot go above 500%, setting to 500%\n';
			pMod -= (critDamage - 5);
		}

		if (args.superbg || args.superscope || args.supersumo || args.superad || args.superhns || args.superfondant) atk += (args.totalattack) ? 0 : 2000;

		if (args.superbg) {

			atk += (args.totalattack) ? 0 : 400;
			npMod += 0.8;

		}

		if (args.superad) {

			if (args.buster || (servant.noblePhantasms[np].card === 'buster' && !faceCard)) cardMod += 0.1;

			npMod += 0.1;

		}

		if (args.superhns) {

			if (isCrit && faceCard) pMod += 0.15;

			npMod += 0.15;
		}

		if (args.supersumo) {

			atkMod += 0.15;

		}

		if (args.superfondant) {

			pMod += 0.3;

		}

		if (args.arts || (servant.noblePhantasms[np].card === 'arts' && !faceCard)) cardMod += (args.artsmod?.reduce((acc, val) => acc + val) ?? 0)/100;
		if (args.buster || (servant.noblePhantasms[np].card === 'buster' && !faceCard)) cardMod += (args.bustermod?.reduce((acc, val) => acc + val) ?? 0)/100;
		if (args.quick || (servant.noblePhantasms[np].card === 'quick' && !faceCard)) cardMod += (args.quickmod?.reduce((acc, val) => acc + val) ?? 0)/100;
		if (args.extra) cardMod += (args.extramod?.reduce((acc, val) => acc + val) ?? 0)/100;

		let val = 0;
		let fD = f(flatDamage);
		let npGainEmbed = null;
		let starGenEmbed = null;

		if (faceCard) fD += f((args.extra ? 0 : 1) * atk * (args.bc ? 0.2 : 0));

		val = f(f(atk) * f(servantClassRate) * f(advantage) * f(firstCardBonus + f(cardValue) * f(Math.max(f(1 + cardMod), 0))) * f(attributeAdvantage) * f(0.23) * f(npMulti) * (1 + (+isCrit))
			* f(extraCardModifier) * f(Math.max(f(1 + atkMod - defMod), 0)) * f(Math.max(f(1 - specialDefMod), 0)) * f(Math.max(f(1 + specialAtkMod), 0.001)) * f(Math.max(f(1 + pMod + (npMod * +(!faceCard))), 0.001)) * f(1 + seMod * +(!faceCard)) + fD);

		if (args.arts) faceCard = 'Arts';
		else if (args.quick) faceCard = 'Quick';
		else if (args.extra) faceCard = 'Extra';
		else if (args.buster) faceCard = 'Buster';
		else faceCard = 'NP';

		for (const hit of hits.slice(0, hits.length - 1)) {

			total += val * f(f(f(hit)/f(100))); //add until second-to-last, then add the difference

		}

		total += f((val - total));
		total = Math.floor(total);

		if (args.enemyhp != null) {

			let enemyHp = f(args.enemyhp), reducedHp = 0, maxReducedHp = 0, isMaxOverkill = 0, isOverkill = 0, serverRate, totalGuaranteedStars = 0, totalMaxGuaranteedStars = 0, dropChance = 0;
			let overkillNo = 0, maxOverkillNo = 0, minrollTotalVal = f(0.9 * f(total - fD) + fD), maxrollTotalVal = f(1.099 * f(total - fD) + fD);
			let starFields, verboseFields;
			let descriptionString = '```\n|Hit | Damage |Enemy HP| Stars |\n';
			let currEnemyHp = enemyHp - reducedHp;

			let cardStarValue = f((args.quick || (servant.noblePhantasms[np].card === 'quick')) ? 0.8 : 0);
			cardStarValue = f((args.buster || servant.noblePhantasms[np].card === 'buster') ? 0.1 : cardStarValue);
			if (args.second && faceCard) cardStarValue += f(0.05 * (args.quick ? 10 : 1));
			else if (args.third && faceCard) cardStarValue += f(0.05 * (args.quick ? 20 : 2));

			switch (enemyClass) {
			case 'archer': serverRate = 0.05; break;
			case 'lancer': serverRate = -0.05; break;
			case 'rider': serverRate = 0.01; break;
			case 'assassin':
			case 'avenger':
			case 'pretender': serverRate = -0.01; break;
			default: serverRate = 0; break;
			}

			serverRate = args.serverrate ?? serverRate;

			for (let i = 0; i < hits.length; i++) {

				let hit = hits[i], thisHitMinDamage = f(minrollTotalVal * f(hit) / f(100)), thisHitMaxDamage = Math.floor(f(maxrollTotalVal * f(hit) / f(100)));

				reducedHp += thisHitMinDamage;
				maxReducedHp += thisHitMaxDamage;
				isOverkill = f(+(reducedHp > enemyHp));
				isMaxOverkill = f(+(maxReducedHp > enemyHp));
				overkillNo += isOverkill;
				maxOverkillNo += isMaxOverkill;

				dropChance = Math.min(f(f(servant.starGen/1000) + f((args.quickfirst &&  (faceCard !== 'NP')) ? 0.2 : 0) + f(cardStarValue * f(1 + cardMod)) + f(serverRate) + f(starGen) + f(0.2 * +(isCrit)) + f(0.3 * +(isOverkill))), 3);
				totalGuaranteedStars += Math.floor(Math.min(f(f(servant.starGen/1000) + f((args.quickfirst &&  (faceCard !== 'NP')) ? 0.2 : 0) + f(cardStarValue * f(1 + cardMod)) + f(serverRate) + f(starGen) + f(0.2 * +(isCrit)) + f(0.3 * +(isOverkill))), 3));
				totalMaxGuaranteedStars += Math.floor(Math.min(f(f(servant.starGen/1000) + f((args.quickfirst && (faceCard !== 'NP')) ? 0.2 : 0) + f(cardStarValue * f(1 + cardMod)) + f(serverRate) + f(starGen) + f(0.2 * +(isCrit)) + f(0.3 * +(isMaxOverkill))), 3));

				descriptionString += '| ' + ((i+1)+'   ').substring(0, 3) + '| ' +(Math.floor(thisHitMinDamage)+' '.repeat(7)).substring(0, 7) + '|' + (Math.floor(currEnemyHp-reducedHp)+' '.repeat(8)).substring(0, 8) + '| ' + (totalGuaranteedStars+' '.repeat(6)).substring(0, 6) + '|\n';

			}

			let minrollTotalMinStars = totalGuaranteedStars;
			let minrollTotalMaxStars = totalGuaranteedStars + hits.length * +!!(dropChance - Math.floor(dropChance));
			let maxrollTotalMinStars = totalMaxGuaranteedStars;
			let maxrollTotalMaxStars = totalMaxGuaranteedStars + hits.length * +!!(dropChance - Math.floor(dropChance));
			let minrollAvgStars = Math.floor((minrollTotalMinStars + minrollTotalMaxStars)/2);
			let maxrollAvgStars = Math.floor((maxrollTotalMinStars + maxrollTotalMaxStars)/2);

			verboseFields = [
				{name: 'Star Gen', value: `${emojis.find(e=>e.name==='instinct')} ${(servant.starGen/10).toFixed(2)}%`, inline: true},
				{name: 'Quick First', value: `${emojis.find(e=>e.name==='quickfirst')} ${!!args.quickfirst}`, inline: true},
				{name: 'Critical', value: `${emojis.find(e=>e.name==='crit')} ${isCrit}`, inline: true},
				{name: 'Cardmod', value: `${emojis.find(e=>e.name==='avatar')} ${cardMod.toFixed(2)}`, inline: true},
				{name: 'Server Rate Mod', value: `${emojis.find(e=>e.name==='berserker')} ${serverRate.toFixed(2)}`, inline: true},
				{name: 'Star Gen Mod', value: `${emojis.find(e=>e.name==='stargen')} ${starGen.toFixed(2)}`, inline: true},
				{name: 'Card Star Value', value: `${emojis.find(e=>e.name==='starrateup')} ${cardStarValue.toFixed(2)}`, inline: true},
				{name: 'Drop Chance (Final Hit)', value: `${emojis.find(e=>e.name==='starrateup')} ${dropChance.toFixed(2)}`, inline: true}
			];

			starFields = [
				{name: 'Minroll Stars Gained', value: `${emojis.find(e=>e.name==='instinct')} **${minrollAvgStars}** (${minrollTotalMinStars} - ${minrollTotalMaxStars}) [${overkillNo} OKH]`},
				{name: 'Maxroll Stars Gained', value: `${emojis.find(e=>e.name==='instinct')} **${maxrollAvgStars}** (${maxrollTotalMinStars} - ${maxrollTotalMaxStars}) [${maxOverkillNo} OKH]`}
			];

			let embedFields = [...(args.nonverbose ? [] : verboseFields), ...starFields];

			starGenEmbed = {
				embeds: [{
					title: 'Stars Gained',
					fields: embedFields
				}],
				name: 'stars',
				minrollTotalMinStars,
				minrollTotalMaxStars,
				maxrollTotalMinStars,
				maxrollTotalMaxStars,
				minrollAvgStars,
				maxrollAvgStars,
				overkillNo,
				maxOverkillNo,
				perHitDescription: descriptionString + '\n\n'
			};

		}

		if (args.enemyhp != null) {

			let servantNpGain = f(servant.noblePhantasms[np].npGain[faceCard.toLowerCase()][npLevel]), minNPRegen = 0, reducedHp = 0, maxReducedHp = 0, maxNPRegen = 0, enemyHp = f(args.enemyhp ?? 0);
			let descriptionString = '';
			let cardNpValue = 0,enemyServerMod = 0, artsFirst = f((args.artsfirst) ? 1 : 0);
			let isOverkill = 0, isMaxOverkill = 0, baseNPGain = 0, minrollTotalVal = f(0.9 * f(total - fD) + fD), maxrollTotalVal = f(1.099 * f(total - fD) + fD), overkillNo = 0, maxOverkillNo = 0, currEnemyHp = 0;

			if (args.reducedhp) reducedHp = args.reducedhp;
			if (args.maxreducedhp) maxReducedHp = args.maxreducedhp;

			currEnemyHp = enemyHp - reducedHp;

			switch (`${(faceCard === 'NP') ? servant.noblePhantasms[np].card : faceCard.toLowerCase()}`) {
			case 'arts': cardNpValue = 3; break;
			case 'quick': cardNpValue = 1; break;
			case 'buster': cardNpValue = 0; break;
			case 'extra': cardNpValue = 1; break;
			default: cardNpValue = 1; break;
			}

			cardNpValue = args.cardrefundvalue ?? cardNpValue;

			if (args.second && (faceCard !== 'NP')) cardNpValue *= 1.5;
			if (args.third && (faceCard !== 'NP')) cardNpValue *= 2;

			switch (enemyClass) {
			case 'rider': enemyServerMod = 1.1; break;
			case 'caster': enemyServerMod = 1.2; break;
			case 'assassin': enemyServerMod = 0.9; break;
			case 'berserker': enemyServerMod = 0.8; break;
			case 'moonCancer': enemyServerMod = 1.2; break;
			default: enemyServerMod = 1; break;
			}

			if ((cardNpValue === 3 &&  !(args.second || args.third)) || args.artsfirst) artsFirst = 1;
			if (faceCard === 'NP') artsFirst = 0;

			enemyServerMod = f(args.enemyservermod ?? enemyServerMod);

			let verboseFields = [
				{name: 'NP Gain', value: `${emojis.find(e=>e.name==='npgen')} ${servantNpGain/100}`, inline: true},
				{name: 'Arts First', value: `${emojis.find(e=>e.name==='artsfirst')} ${!!artsFirst}`, inline: true},
				{name: 'Critical', value: `${emojis.find(e=>e.name==='crit')} ${isCrit}`, inline: true},
				{name: 'Cardmod', value: `${emojis.find(e=>e.name==='avatar')} ${cardMod}`, inline: true},
				{name: 'Enemy Server Mod', value: `${emojis.find(e=>e.name==='berserker')} ${enemyServerMod}`, inline: true},
				{name: 'NP Gain Mod', value: `${emojis.find(e=>e.name==='npgen')} ${npGen}`, inline: true},
				{name: 'Card Attack Multiplier', value: `${(faceCard === 'NP') ? emojis.find(e=>e.name===servant.noblePhantasms[np].card) : emojis.find(e=>e.name===faceCard.toLowerCase())} ${cardValue}x`, inline: true},
				{name: 'Card Refund Value', value: `${emojis.find(e=>e.name==='npbattery')} ${cardNpValue}`, inline: true}
			];

			descriptionString = '```\n|Hit | Damage |Enemy HP| Refund |\n';

			for (let i = 0; i < hits.length; i++) {

				let hit = hits[i], thisHitMinDamage = Math.floor(f(minrollTotalVal * f(hit) / f(100))), thisHitMaxDamage = Math.floor(f(maxrollTotalVal * f(hit) / f(100)));

				reducedHp += thisHitMinDamage;
				maxReducedHp += thisHitMaxDamage;
				isOverkill = +(reducedHp >= currEnemyHp);
				isMaxOverkill = +(maxReducedHp >= currEnemyHp);
				overkillNo += isOverkill;
				maxOverkillNo += isMaxOverkill;

				baseNPGain = f(f(servantNpGain) * f(f((artsFirst && faceCard !== 'NP') ? 1 : 0) +  f(f(cardNpValue) * f(1 + (args.extra ? 0 : cardMod))))
						* f(enemyServerMod) * f(1 + npGen));

				minNPRegen += Math.floor(Math.floor(baseNPGain * f(1 + (+isCrit))) * f((2 + isOverkill)/2)) / 100;
				maxNPRegen += Math.floor(Math.floor(baseNPGain * f(1 + (+isCrit))) * f((2 + isMaxOverkill)/2)) / 100;

				descriptionString += '| ' + ((i+1)+'   ').substring(0, 3) + '| ' +(Math.floor(thisHitMinDamage)+' '.repeat(7)).substring(0, 7) + '|' + (Math.floor(currEnemyHp-reducedHp)+' '.repeat(8)).substring(0, 8) + '| ' + (minNPRegen.toFixed(2)+'%'+' '.repeat(7)).substring(0, 7) + '|\n';

			}

			if (args.flatrefund != null) {

				args.flatrefund.forEach(fr => {
					minNPRegen += +(fr);
					maxNPRegen += +(fr);
				});

			}

			descriptionString += '```';

			let npFields = [];
			npFields.push({name: 'Refund', value: descriptionString, inline: false});
			npFields.push({name: 'Total Minroll Refund', value: `**${minNPRegen.toFixed(2)}%** ${emojis.find(e=>e.name==='npbattery')} (${overkillNo} overkill hits)`, inline: false});
			npFields.push({name: 'Total Maxroll Refund', value: `**${maxNPRegen.toFixed(2)}%** ${emojis.find(e=>e.name==='npbattery')} (${maxOverkillNo} overkill hits)`, inline: false});

			let embedFields = [...(args.nonverbose ? [] : verboseFields), ...npFields];

			npGainEmbed = {
				embeds: [{
					title: 'NP Refunded',
					fields: embedFields
				}],
				name: 'refund',
				overkillNo,
				maxOverkillNo,
				minNPRegen,
				maxNPRegen,
				reducedHp,
				maxReducedHp,
				currEnemyHp,
				enemyHp
			};

		}

		let minrollTotal = (Math.floor(f(0.9 * (total - fD) + fD)));
		let maxrollTotal = (Math.floor(f(1.099 * (total - fD) + fD)));

		const replyEmbed = {
			embeds: [{
				title: `${(faceCard === 'NP')?emojis.find(e=>e.name==='nplewd'):emojis.find(e=>e.name===faceCard.toLowerCase())} DMG for ${emojis.find(e=>e.name===servant.className.toLowerCase())} ${servantName}`,
				url: `https://apps.atlasacademy.io/db/${servantId <= maxNAServant ? 'NA' : 'JP'}/servant/${servantId}`,
				thumbnail: {
					url: servant.extraAssets.faces.ascension[Object.keys(servant.extraAssets.faces.ascension).length]
				},
				description: `${emojis.find(e=>e.name==='hits')} **${total.toLocaleString()}** (${minrollTotal.toLocaleString()} to ${maxrollTotal.toLocaleString()})`
			}],
			total: total,
			minrollTotal: minrollTotal,
			maxrollTotal: maxrollTotal,
			enemyClass,
			enemyAttribute,
			enemyClassEmoji: `${emojis.find(e=>e.name===enemyClass.toLowerCase())}`
		};

		if (warnMessage) {

			if (!('fields' in replyEmbed.embeds[0])) replyEmbed.embeds[0].fields = [];

			replyEmbed.embeds[0].fields.push({
				name: 'Warnings',
				value: warnMessage
			});

			replyEmbed.warnings = warnMessage;
		}

		let reply = [replyEmbed];

		if (args.enemyhp != undefined) reply = [replyEmbed, npGainEmbed, starGenEmbed];

		if (args.nonverbose) {

			let desc = '';

			const nonVerboseEmbed = {
				embeds: [{
					title: `${faceCard} damage for ${emojis.find(e=>e.name===servant.className.toLowerCase())} ${servantName}:`,
					fields: [],
					description: ''
				}],
				name: 'nonverbose'
			};

			if (args.enemyhp != null) {

				desc += `\n${emojis.find(e=>e.name==='npbattery')} **${npGainEmbed.minNPRegen.toFixed(2)}%** - **${npGainEmbed.maxNPRegen.toFixed(2)}%**`;

				if (args.stars) {

					desc += `\n${emojis.find(e=>e.name==='instinct')} **${starGenEmbed.minrollAvgStars}** (${starGenEmbed.minrollTotalMinStars} - ${starGenEmbed.minrollTotalMaxStars}) [minroll]`;
					desc += `\n${emojis.find(e=>e.name==='instinct')} **${starGenEmbed.maxrollAvgStars}** (${starGenEmbed.maxrollTotalMinStars} - ${starGenEmbed.maxrollTotalMaxStars}) [maxroll]`;

				}

			}

			nonVerboseEmbed.embeds[0].fields = [...((args.enemyhp != null) ? [npGainEmbed.embeds[0].fields[0]] : []), ...nonVerboseEmbed.embeds[0].fields];
			nonVerboseEmbed.embeds[0].description += desc;

			return nonVerboseEmbed;

		}

		const verboseEmbed = {
			embeds: [{
				title: `${faceCard} damage for ${emojis.find(e=>e.name===servant.className.toLowerCase())} ${servantName} using:`,
				fields: []
			}],
			name: 'verbose'
		};

		let newfields = [
			{name: 'Base Attack', value: `${atk - (args.fou ?? 1000) - (args.ce ?? 0)}`, inline: true},
			{name: 'Fou Attack', value: `${(args.fou ?? 1000)}`, inline: true},
			{name: 'Level', value: `${(args.level ?? servant.lvMax)}`, inline: true},
			{name: 'Strengthen', value: `${(+np) ? emojis.find(e=>e.name==='nplewd') : emojis.find(e=>e.name==='nolewd')} ${!!+np}`, inline: true},
			{name: 'CE Attack', value: `${(args.ce ?? 0)}`, inline: true},
			{name: 'Class Attack Mod', value: `${emojis.find(e=>e.name===servant.className.toLowerCase())} ${+(classList[servant.className]/1000).toFixed(2)}x`, inline: true},
			{name: 'Class Advantage', value: `${advantage}x`, inline: true},
			{name: 'Card Attack Multiplier', value: `${(faceCard === 'NP') ? emojis.find(e=>e.name===servant.noblePhantasms[np].card) : emojis.find(e=>e.name===faceCard.toLowerCase())} ${cardValue}x`, inline: true},
			{name: 'CardMod', value: `${(faceCard === 'NP') ? emojis.find(e=>e.name===servant.noblePhantasms[np].card+'mod') : emojis.find(e=>e.name===faceCard.toLowerCase()+'mod')} ${cardMod*100}%`, inline: true},
			{name: 'Attribute Advantage', value: `${attributeAdvantage}x`, inline: true},
			{name: 'Damage %', value: `${(faceCard === 'NP') ? emojis.find(e=>e.name===servant.noblePhantasms[np].card) : emojis.find(e=>e.name===faceCard.toLowerCase())} ${((faceCard !== 'NP') ? cardValue : npMulti)*100}%`, inline: true},
		];

		newfields.push({name: 'ATKMod', value: `${emojis.find(e=>e.name==='charisma')} ${atkMod*100}%`, inline: true});
		newfields.push({name: 'DEFMod', value: `${emojis.find(e=>e.name==='defup')} ${defMod*100}%`, inline: true});
		newfields.push({name: 'NP Mod', value: `${emojis.find(e=>e.name==='npmod')} ${npMod*100}%`, inline: true});
		newfields.push({name: 'Supereffective Mod', value: `${emojis.find(e=>e.name==='overcharge')} ${(1 + seMod)}x`, inline: true});
		newfields.push({name: 'Power/Crit Mod', value: `${emojis.find(e=>e.name==='pmod')}${emojis.find(e=>e.name==='crit')}  ${pMod*100}%`, inline: true});
		newfields.push({name: 'Flat Damage', value: `${emojis.find(e=>e.name==='divinity')} ${(fD.toFixed(1) ?? 0)}`, inline: true});
		newfields.push({name: 'NP Gain', value: `${emojis.find(e=>e.name==='npgen')} ${(args.npgain ?? 0)}%`, inline: true});
		newfields.push({name: 'Damage', value: replyEmbed.embeds[0].description, inline: false});
		verboseEmbed.embeds[0].fields = newfields;

		reply = [...reply, verboseEmbed];
		reply.damageEmbed = replyEmbed;
		reply.npGainEmbed = npGainEmbed;
		reply.starGenEmbed = starGenEmbed;
		reply.verboseEmbed = verboseEmbed;
		reply.refund = (args.enemyhp != undefined);

		return reply;

	}
}

async function chain (servantId, argStr, servantName, match) {

	let cards = match.match(/([bqax]|(np))/g), attache = '', totalDamage = 0, minrollTotal = 0, maxrollTotal = 0, description = '', title = '', thumbnail = '', servant, chain = [{}, {}, {}];
	let minEnemyHp, maxEnemyHp, refund = false, minrollTotalRefund = 0, maxrollTotalRefund = 0, accReducedHp = 0, maxAccReducedHp = 0, warnings = '', debugDesc = '';
	let minrollTotalMinStars = 0, minrollTotalMaxStars = 0, maxrollTotalMinStars = 0, maxrollTotalMaxStars = 0, overkillNo = 0, minrollAvgStars = 0, maxrollAvgStars = 0, maxOverkillNo = 0, overkillStarsNo = 0, maxOverkillStarsNo = 0;

	for (const key of Object.keys(servants)) {

		if (servants[key].collectionNo !== parseInt(servantId)) continue;
		else if (!('noblePhantasms' in servants[key])) continue;
		else servant = servants[key];

	}

	if (servant == undefined) return 'Error: Bad servant.';

	for (let i = 0; i < 3; i++) {

		if (cards[i] === 'np') {
			chain[i].name = servant.noblePhantasms[0].card.toLowerCase();
			chain[i].np = true;
		}
		else {
			switch (cards[i]) {
			case 'b':
				chain[i].name = 'buster'; break;
			case 'q':
				chain[i].name = 'quick'; break;
			case 'a':
				chain[i].name = 'arts'; break;
			case 'x':
				chain[i].name = 'skip'; break;
			default:
				break;
			}

			chain[i].np = false;

			switch (i) {
			case 0:
				chain[i].position = 'first'; break;
			case 1:
				chain[i].position = 'second'; break;
			case 2:
				chain[i].position = 'third'; break;
			}
		}
	}

	if (chain[0].name === 'buster') attache += '--bf ';
	else if (chain[0].name === 'arts') attache += '--af ';
	else if (chain[0].name === 'quick') attache += '--qf ';


	if (chain.every((val, i, a) => (val.name === a[0].name) && (val.name === 'buster'))) attache += '--bc ';

	if (chain.every((val, i, a) => (val.name === a[0].name) && (val.name === 'arts'))) {

		minrollTotalRefund += 20;
		maxrollTotalRefund += 20;

	}

	if (chain.every((val, i, a) => (val.name === a[0].name) && (val.name === 'quick'))) {

		minrollTotalMinStars += 10;
		minrollTotalMaxStars += 10;
		maxrollTotalMinStars += 10;
		maxrollTotalMaxStars += 10;
		minrollAvgStars += 10;
		maxrollAvgStars += 10;

	}

	chain = [...chain, {name: 'extra', np: false}];

	if (cards.includes('x')) chain.pop();

	argStr = attache + argStr;

	let [baseStr, ...commands] = argStr.split(' --card=');

	baseStr = baseStr.replace(/--([bqax]|(np)){3}/g, '');

	for (const command of commands) {

		let cardNo = command[0] - 1;

		chain[cardNo].command = '';

	}

	for (const command of commands) {

		let cardNo = command[0] - 1;

		chain[cardNo].command += command.slice(2) + ' ';

	}

	if ((chain[0].name === chain[1].name) && (chain[1].name === chain[2].name) && (!cards.includes('x'))) chain[3].command = ' --ecm=3.5 ' + (chain[3].command ?? '');

	if ((minEnemyHp = baseStr.match(/\s+--hp=\d+/g)) != null) {

		refund = true;
		minEnemyHp = parseInt(minEnemyHp[0].split('=')[1]);
		maxEnemyHp = parseInt(baseStr.match(/\s+--hp=\d+/g)[0].split('=')[1]);
		baseStr = baseStr.replace(/\s+--hp=\d+/g, '');

	}

	let enemyAttribute, enemyClass, enemyClassEmoji;

	for (let i = 0; i < chain.length; i++) {

		let testReply, testEmbed, card = chain[i], maxAttache, maxTestReply;

		if (card.name === 'skip') continue;

		attache = (card.np ? '' : '--' + card.name)  + (card.position ? ' --' + card.position : '') + (refund ? ` --hp=${minEnemyHp} --reducedhp=${accReducedHp} --maxreducedhp=${maxAccReducedHp} ` : ' ');
		maxAttache = (card.np ? '' : '--' + card.name)  + (card.position ? ' --' + card.position : '') + (refund ? ` --hp=${maxEnemyHp} --reducedhp=${accReducedHp} --maxreducedhp=${maxAccReducedHp} ` : ' ');
		testReply = await calc(servantId, attache + baseStr + ' ' + (chain[i].command ?? ''), servantName);
		maxTestReply = await calc(servantId, maxAttache + baseStr + ' ' + (chain[i].command ?? ''), servantName);

		let damageVals;

		if (Array.isArray(testReply)) {

			testEmbed = testReply[0].embeds[0];

			if (testReply[0].warnings) warnings += `${testReply[0].warnings}\n`;

			damageVals = [testReply[0].total, testReply[0].minrollTotal, testReply[0].maxrollTotal];

		}
		else {

			testEmbed = testReply.embeds[0];
			damageVals = [testReply.total, testReply.minrollTotal, testReply.maxrollTotal];

			if (testReply.warnings) warnings += `${testReply.warnings}\n`;
		}

		if (card.np) {

			minrollTotalRefund = 0;
			maxrollTotalRefund = 0;
			overkillNo = maxOverkillNo = 0;
		}

		overkillNo += (testReply[1]?.overkillNo ?? 0);
		maxOverkillNo += (maxTestReply[1]?.maxOverkillNo ?? 0);
		overkillStarsNo += (testReply[1]?.overkillNo ?? 0);
		maxOverkillStarsNo += (maxTestReply[1]?.maxOverkillNo ?? 0);
		minrollTotalRefund += (testReply[1]?.minNPRegen ?? 0);
		maxrollTotalRefund += (maxTestReply[1]?.maxNPRegen ?? 0);
		accReducedHp = (testReply[1]?.reducedHp ?? 0);
		maxAccReducedHp = (maxTestReply[1]?.maxReducedHp ?? 0);

		if (chain[i+1]?.np !== false) {

			minEnemyHp -= accReducedHp;
			maxEnemyHp -= maxAccReducedHp;
			accReducedHp = 0;
			maxAccReducedHp = 0;

		}

		enemyAttribute = testReply[0].enemyAttribute;
		enemyClass = testReply[0].enemyClass;

		enemyClassEmoji = testReply[0].enemyClassEmoji;

		debugDesc +=  `command str: ${attache + baseStr + ' ' + (chain[i].command ?? '')},\n`
		+ `accReducedHp: ${accReducedHp},\n[enemyHp-accReducedHp]: ${minEnemyHp-accReducedHp},\n`
		+`[accReducedHp > (enemyHp-accReducedHp)]?: ${accReducedHp > (minEnemyHp-accReducedHp)},`
		+`\noverkillNo: ${overkillNo},\nnext card NP: ${chain[i+1]?.np === true}\n\n`;

		if (testReply[2]?.name === 'stars') {

			minrollTotalMinStars += testReply[2].minrollTotalMinStars;
			minrollTotalMaxStars += testReply[2].minrollTotalMaxStars;
			maxrollTotalMinStars += testReply[2].maxrollTotalMinStars;
			maxrollTotalMaxStars += testReply[2].maxrollTotalMaxStars;
			minrollAvgStars += Math.floor((testReply[2].minrollTotalMinStars + testReply[2].minrollTotalMaxStars)/2);
			maxrollAvgStars += Math.floor((testReply[2].maxrollTotalMinStars + testReply[2].maxrollTotalMaxStars)/2);
			debugDesc += testReply[2].perHitDescription.replace('```', '');

		}

		totalDamage += damageVals[0];
		minrollTotal += damageVals[1];
		maxrollTotal += damageVals[2];
		title = emojis.find(e=>e.name==='gateofsnekked').toString() + ' DMG ' + testEmbed.title.split(' ').slice(2).join(' ') + ':';
		thumbnail = testEmbed.thumbnail;
		description += `${card.np ? emojis.find(e=>e.name==='nplewd') : emojis.find(e=>e.name===card.name)} **${damageVals[0].toLocaleString()}** (${damageVals[1].toLocaleString()} - ${damageVals[2].toLocaleString()})\n`;

	}

	if (argStr.includes('--dump')) {

		return '```' + debugDesc + '```';

	}

	const replyEmbed = {
		embeds: [{
			title,
			url: `https://apps.atlasacademy.io/db/${servantId <= maxNAServant ? 'NA' : 'JP'}/servant/${servantId}`,
			thumbnail,
			description
		}],
		name: 'chain',
		enemyAttribute,
		enemyClass,
		enemyClassEmoji,
		total: totalDamage,
		minrollTotal,
		maxrollTotal,
		minrollTotalRefund,
		maxrollTotalRefund,
		minrollTotalMinStars,
		minrollTotalMaxStars,
		maxrollTotalMinStars,
		maxrollTotalMaxStars,
		minrollAvgStars,
		maxrollAvgStars,
		overkillNo,
		maxOverkillNo,
		overkillStarsNo,
		maxOverkillStarsNo
	};

	replyEmbed.embeds[0].fields = [{name: 'Total Damage', value: `**${totalDamage.toLocaleString()}** (${minrollTotal.toLocaleString()} to ${maxrollTotal.toLocaleString()})`}];

	if (refund) {

		replyEmbed.embeds[0].fields = [
			...replyEmbed.embeds[0].fields,
			{name: 'Total Minroll Refund', value: `${emojis.find(e=>e.name==='npbattery')} **${minrollTotalRefund.toFixed(2)}%** (${overkillNo} OKH)`, inline: true},
			{name: 'Total Maxroll Refund', value: `${emojis.find(e=>e.name==='npbattery')} **${maxrollTotalRefund.toFixed(2)}%** (${maxOverkillNo} OKH)`, inline: true},
			{name: '\u200B', value: '\u200B'},
			{name: 'Minroll Stars', value: `${emojis.find(e=>e.name==='instinct')} **${minrollAvgStars}** (${minrollTotalMinStars} - ${minrollTotalMaxStars}) (${overkillStarsNo} OKH)`, inline: true},
			{name: 'Maxroll Stars', value: `${emojis.find(e=>e.name==='instinct')} **${maxrollAvgStars}** (${maxrollTotalMinStars} - ${maxrollTotalMaxStars}) (${maxOverkillStarsNo} OKH)`, inline: true},
		];
	}

	if (warnings) {

		replyEmbed.warnings = warnings;
		replyEmbed.embeds[0].fields.push({name: 'Warnings', value: warnings});
	}

	return replyEmbed;

}

async function multiEnemy (servant, argStr, servantId, matches) {

	let baseStr, enemyCmds, reply, refund = false, replyEmbed = {fields: []}, warnings = '';
	let enemyFields = [], showEnemyFields = false;
	let waves = [];

	/*
	 * Convoluted way to ensure baseStr contains the part of argStr prior to `--card=`,
	 * cardCmd contains the part of the string after `--card=` and before `--enemy=`,
	 * and enemyCmds contain the enemy-specific args
	 */
	argStr = argStr.toLowerCase();
	baseStr = argStr.split('--enemy=')[0].split('--card=')[0];
	argStr = ` ${argStr}`;
	[, ...enemyCmds] = argStr.split(/\s*(?=--enemy=\d+\s*)/);

	let enemies = Array(9).fill().map(() => ({command: `${baseStr} `, count: false}));

	if (argStr.includes('--enemy=0')) {

		if (argStr.match(/--enemy=[1-9]/g)) {

			enemies = [{command: `${baseStr} ${enemyCmds[1]}`, count: true, wave: 0}, {command: `${baseStr} ${enemyCmds[0]}`, count: true, wave: 0}, {command: `${baseStr} ${enemyCmds[0]}`, count: true, wave: 0}];

		}
		else {

			enemies[0] = {command: `${baseStr} ${enemyCmds[0]}`, count: true, wave: 0};
			enemies[1] = {command: `${baseStr} ${enemyCmds[0]}`, count: true, wave: 0};
			enemies[2] = {command: `${baseStr} ${enemyCmds[0]}`, count: true, wave: 0};

		}
	}
	else {

		for (let enemyCmd of enemyCmds) {

			let enemyNo = +enemyCmd.split(/--enemy=/)[1].split(/\s+/)[0] - 1;

			enemies[enemyNo].command += `${enemyCmd}`;
			enemies[enemyNo].count = true;
			enemies[enemyNo].wave = Math.floor(enemyNo/3);

		}
	}

	if (argStr.includes('--v') || argStr.includes('--verbose') || baseStr.includes('--v') || baseStr.includes('--verbose')) {
		showEnemyFields = true;
	}

	enemies.forEach(enemy => enemy.command = enemy.command.replace(/--enemy=\d+/g, ''));

	let npCmds = '';

	for (let i = 0; i < enemies.length; i++) {

		let enemy = enemies[i];
		let name = (enemy.command.match(/--name=.+(?=\s+--)/g) ?? ' ')[0].split('=')[1];

		if (enemy.count === false) continue;

		if (Math.floor(Math.abs(i)/3) !== Math.floor((Math.abs(i)-1)/3)) npCmds = ''; //reset npCmds for subsequent wave

		let testReply, testDamage, thisAvgStars = 0, value;

		if (typeof servantId === 'undefined') return reply = `No match found for ${servant}`;

		let [, ...cardCmds] = enemy.command.split(/\s+(?=--card)/g);
		cardCmds = cardCmds.join(' ');

		/*
		* If np card in a chain has specific buffs, they need to be applied to all the enemies
		*/
		if ((matches = enemy.command.match(/([xbqa]|(np)){3}/g)) != null && matches[0].includes('np') && (i % 3 == 0)) {

			let npPosn = matches[0].indexOf('np') + 1;
			let pattern = new RegExp(`--card=${npPosn}`, 'g');

			npCmds = cardCmds.split(pattern)[1] ?? '' ; //discarding everything before the card=npPosn part
			npCmds = npCmds.split('--card=')[0]; //discarding everything after the np card buffs

		}

		if (matches != null && i % 3 == 0) {

			testReply = [await chain(servantId, enemy.command + ' ' + cardCmds, servant, matches[0])];
			testDamage = [testReply[0].total, testReply[0].minrollTotal, testReply[0].maxrollTotal];

			if (enemy.command.match(/\s+--hp=\d+/g) != null) {

				refund = true;

				enemy.minrollMinStars = testReply[0].minrollTotalMinStars;
				enemy.maxrollMaxStars = testReply[0].maxrollTotalMaxStars;
				enemy.minrollRefund = testReply[0].minrollTotalRefund;
				enemy.maxrollRefund = testReply[0].maxrollTotalRefund;

				thisAvgStars = Math.floor((enemy.minrollMinStars + enemy.maxrollMaxStars)/2);

				value = `\nRefund: **${enemy.minrollRefund.toFixed(2)}%** to **${enemy.maxrollRefund.toFixed(2)}%**\nStars: **${thisAvgStars}** (${enemy.minrollMinStars} - ${enemy.maxrollMaxStars})`;

			}

			enemy.totalDamage = testDamage[0];
			enemy.minrollTotalDamage = testDamage[1];
			enemy.maxrollTotalDamage = testDamage[2];

		}
		else {

			enemy.command = enemy.command.replace(/--([xbqa]|(np)){3}/g, '');
			testReply = await calc(servantId, enemy.command + ' ' + npCmds, servant);
			testDamage = [testReply[0].total, testReply[0].minrollTotal, testReply[0].maxrollTotal];

			if (enemy.command.match(/\s+--hp=\d+/g) != null) {

				refund = true;
				enemy.hp = +enemy.command.match(/\s+--hp=\d+/g)[0].split('=')[1];
				enemy.MinRemHp = enemy.hp - testDamage[1];
				enemy.remHp = enemy.hp - testDamage[0];
				enemy.maxRemHp = enemy.hp - testDamage[2];
				enemy.minrollRefund = testReply[1].minNPRegen;
				enemy.maxrollRefund = testReply[1].maxNPRegen;
				enemy.minrollMinStars = testReply[2].minrollTotalMinStars;
				enemy.maxrollMaxStars = testReply[2].maxrollTotalMaxStars;

				thisAvgStars = Math.floor((enemy.minrollMinStars + enemy.maxrollMaxStars)/2);

				value = `\nRefund: **${enemy.minrollRefund.toFixed(2)}%** to **${enemy.maxrollRefund.toFixed(2)}%**\nStars: **${thisAvgStars}** (${enemy.minrollMinStars} - ${enemy.maxrollMaxStars})`;

			}

			enemy.totalDamage = testDamage[0];
			enemy.minrollTotalDamage = testDamage[1];
			enemy.maxrollTotalDamage = testDamage[2];

		}

		replyEmbed.thumbnail = testReply[0].embeds[0].thumbnail;
		replyEmbed.url = testReply[0].embeds[0].url;

		if (testReply[0].warnings)
			warnings += testReply[0].warnings + '\n';

		let testTitle = testReply[0].embeds[0].title.slice(testReply[0].embeds[0].title.indexOf('DMG')); //case-insensitive

		testTitle = testTitle[0].toUpperCase() + testTitle.slice(1);
		replyEmbed.title = emojis.find(e=>e.name==='gateofsnekked').toString() + ' ' + testTitle;
		enemyFields.push({name: `${name || 'Enemy ' + (i+1)} ${testReply[0].enemyClassEmoji + ' ' + testReply[0].enemyAttribute[0].toUpperCase() + testReply[0].enemyAttribute.slice(1)}`, value: `Damage: **${testDamage[0].toLocaleString()}** (${testDamage[1].toLocaleString()} - ${testDamage[2].toLocaleString()})${value ?? ''}`, inline: true, wave: enemy.wave});

	}

	let waveLength = 0, totalField = {name: 'Total', value: ''};

	for (let enemy of enemies) {

		if (enemy.count !== true) continue;

		if (typeof(waves[enemy.wave]) === 'undefined')
			waves[enemy.wave] = {
				totalDamage: 0,
				minrollTotalDamage: 0,
				maxrollTotalDamage: 0,
				minrollTotalRefund: 0,
				maxrollTotalRefund: 0,
				minrollTotalStars: 0,
				maxrollTotalStars: 0,
				count: false
			};

		waves[enemy.wave].totalDamage += enemy.totalDamage;
		waves[enemy.wave].minrollTotalDamage += enemy.minrollTotalDamage;
		waves[enemy.wave].maxrollTotalDamage += enemy.maxrollTotalDamage;
		waves[enemy.wave].minrollTotalRefund += enemy.minrollRefund;
		waves[enemy.wave].maxrollTotalRefund += enemy.maxrollRefund;
		waves[enemy.wave].minrollTotalStars += enemy.minrollMinStars;
		waves[enemy.wave].maxrollTotalStars += enemy.maxrollMaxStars;
		waves[enemy.wave].count = true;

		waveLength = enemy.wave + 1;

	}

	for (let i = 0; i < waves.length; i++) {

		if (waves[i].count !== true) continue;

		totalField.value += `__**Wave ${i+1}**__:\n${emojis.find(e=>e.name==='hits')} **${waves[i].totalDamage.toLocaleString()}** (${waves[i].minrollTotalDamage.toLocaleString()} - ${waves[i].maxrollTotalDamage.toLocaleString()})`;

		if (refund) {

			totalField.value += `\n${emojis.find(e=>e.name==='npbattery')} **${waves[i].minrollTotalRefund.toFixed(2)}%** - **${waves[i].maxrollTotalRefund.toFixed(2)}%**`;
			totalField.value += `\t${emojis.find(e=>e.name==='instinct')} **${Math.floor((waves[i].minrollTotalStars + waves[i].maxrollTotalStars)/2)}** (${waves[i].minrollTotalStars} - ${waves[i].maxrollTotalStars})`;

		}

		totalField.value += '\n';

	}

	if (showEnemyFields || waveLength <= 1) replyEmbed.fields = [...replyEmbed.fields, ...enemyFields];

	replyEmbed.fields.push(totalField);
	replyEmbed.footer = {text: `Enemies: ${enemies.filter(e=>e.count).length} | Waves: ${waveLength}`};

	reply = {
		embeds:	[replyEmbed],
		name: 'multi-enemy',
		waves
	};

	if (warnings) {

		reply.warnings = warnings;
		reply.embeds[0].fields.push({name: 'Warnings', value: warnings});

	}

	return reply;

}

async function wikia (search) {

	search = search.join(' ');

	return new Promise((resolve) => {

		https.get('https://www.google.com/search?q=site%3Afategrandorder.fandom.com+' + search.replace(/ /g, '+'), function(res) {

			let data = '';

			res.on('data', function (chunk) {

				data += chunk;

			});

			res.on('end', () => {

				document = (new JSDOM(data, {pretendToBeVisual: true})).window.document;

				let reply = '';

				try {

					reply = '<' + decodeURI(decodeURI(document.querySelector('a[href^="/url?q=https://fategrandorder.fandom.com/wiki/"]').href.slice(7).split('&')[0])) + '>';
					resolve(reply);

				} catch(err) {

					resolve('Error finding result for <https://www.google.com/search?q=site%3Afategrandorder.fandom.com+' + search.replace(/ /g, '+') + '>');

				}

			});
		});


	});
}

async function lolwiki (search) {

	search = search.join(' ');

	return new Promise((resolve) => {

		https.get('https://www.google.com/search?q=site%3Aleagueoflegends.fandom.com/+' + search.replace(/ /g, '+'), function(res) {

			let data = '';

			res.on('data', function (chunk) {

				data += chunk;

			});

			res.on('end', () => {

				document = (new JSDOM(data, {pretendToBeVisual: true})).window.document;

				let reply = '';

				try {

					reply = '<' + decodeURI(decodeURI(document.querySelector('a[href^="/url?q=https://leagueoflegends.fandom.com/wiki/"]').href.slice(7).split('&')[0])) + '>';
					resolve(reply);

				} catch(err) {

					resolve('Error finding result for <https://www.google.com/search?q=site%3Aleagueoflegends.fandom.com/+' + search.replace(/ /g, '+') + '>');

				}

			});
		});


	});
}

async function bing (search) {

	search = search.join(' ');

	return new Promise((resolve) => {

		https.get('https://www.bing.com/search?q=' + search.replace(/ /g, '+'), function(res) {

			let data = '';

			res.on('data', function (chunk) {

				data += chunk;

			});

			res.on('end', () => {

				({document} = (new JSDOM(data, {pretendToBeVisual: true})).window);

				let reply = '';

				try {
					reply = '<' + decodeURI(decodeURI(document.querySelector('main[aria-label="Search Results"] h2 a').href)) + '>';
					resolve(reply);

				} catch(err) {

					resolve('Error finding result for <https://www.bing.com/search?q=' + search.replace(/ /g, '+') + '>');

				}

			});
		});
	});
}

async function parseCalculationString(s) {
	// --- Parse a calculation string into an array of numbers and operators
	var calculation = [],
		current = '';
	for (var i = 0, ch; (ch = s.charAt(i)); i++) {
		if ('^*/+-%'.indexOf(ch) > -1) {
			if (current == '' && ch == '-') {
				current = '-';
			} else {
				calculation.push(parseFloat(current), ch);
				current = '';
			}
		} else {
			current += s.charAt(i);
		}
	}
	if (current != '') {
		calculation.push(parseFloat(current));
	}
	return calculation;
}

async function calculate(s) {

	let calc = await parseCalculationString(s.join(''));

	// --- Perform a calculation expressed as an array of operators and numbers
	var ops = [{'^': (a, b) => Math.pow(a, b), '%': (a, b) => a % b},
			{'*': (a, b) => a * b, '/': (a, b) => a / b},
			{'+': (a, b) => a + b, '-': (a, b) => a - b}],
		newCalc = [],
		currentOp;
	for (var i = 0; i < ops.length; i++) {
		for (var j = 0; j < calc.length; j++) {
			if (ops[i][calc[j]]) {
				currentOp = ops[i][calc[j]];
			} else if (currentOp) {
				newCalc[newCalc.length - 1] = 
					currentOp(newCalc[newCalc.length - 1], calc[j]);
				currentOp = null;
			} else {
				newCalc.push(calc[j]);
			}
		}
		calc = newCalc;
		newCalc = [];
	}
	if (calc.length > 1) {
		console.log('Error: unable to resolve calculation: ' + calc);
		return calc;
	} else {
		console.log(calc[0]);
		return `${calc[0]}`;
	}
}

/*
 * The above two functions (viz. `parseCalculationString` and `calculate`) have been taken and slightly modified from https://stackoverflow.com/a/32292728, written by 'Stuart'.
 */

// eslint-disable-next-line no-unused-vars
async function star_gen_table(star_drop_chance, hits) {

	const guaranteed_stars = Math.floor(star_drop_chance);
	const extra_star_chance = star_drop_chance - guaranteed_stars;

	const prob_distribution_table = Array(hits).fill(0).map(() => Array(hits * 3 + 1).fill(0));

	prob_distribution_table[0, guaranteed_stars] = 1 - extra_star_chance;
	prob_distribution_table[0, guaranteed_stars + 1] = extra_star_chance;

	for (let i = 1; i < hits; i++) {

		for (let j = 0; j < i + 1; j++) {

			const base_chance = prob_distribution_table[i-1, guaranteed_stars * i + j] * (1-extra_star_chance);
			const extra_chance = prob_distribution_table[i-1, guaranteed_stars * i + j] * (extra_star_chance);

			prob_distribution_table[i, guaranteed_stars * (i+1) + j] += base_chance;
			prob_distribution_table[i, guaranteed_stars * (i+1) + j + 1] += extra_chance;

		}
	}

	console.log(prob_distribution_table);
	return prob_distribution_table;

}

/*
 * Credits for the above function (`star_gen_table`) to キューティーキツネ#9634 (discord).
 */

/*function starTable (starChance, hits) {

	const guaranteedStars = Math.floor(starChance);
	const extraChance = starChance - guaranteedStars;
	const dist = Array(hits).fill().map(- => Array(hits * 3 + 1).fill(0));
	const base = guaranteedStars;

	dist[0, base] = 1 - 

}*/

// eslint-disable-next-line no-unused-vars
async function starTable (starChance, hits) {

	const guaranteedStars = Math.floor(starChance);
	const extraChance = starChance - guaranteedStars;
	const table = Array(hits * 3 + 1).fill(0); //e.g. Jack has 5 hits so 16 different outcomes (0..15 stars)
	console.log(starChance, guaranteedStars, extraChance);
	for (let i = 1; i <= hits; i++) {

		let baseStars = i * guaranteedStars;

		//extra stars
		for (let j = 0; j <= i; j++) {

			let iCr = factorial(i)/(factorial(j) * factorial(i-j));
			let chance = iCr * (extraChance ** j) * ((1 - extraChance) ** (i - j));

			table[baseStars+j] = chance;

		}
	}

	let retStr = '';

	for (let i = 0; i < hits * 3 + 1; i++) {

		if (table[i] !== 0)
			retStr += `${i} stars (${(table[i]*100).toFixed(2)}%) | `;

		retStr += '\n';

	}

	console.log(table.length);
	return retStr;

}

let facts = [];

async function factorial (n) {

	if (n === 0 || n === 1)
		return 1;

	if (facts[n] > 0)
		return facts[n];

	return facts[n] = factorial(n-1) * n;

}

module.exports = exports = function commandMap () {

	emojis = emojiArray.map(emoji => ({name: emoji.name, id: emoji.id, toString() { return `<:${this.name}:${this.id}>`;}}));

	return new Map()
		.set('test', test)
		.set('t', test)
		.set('chain', chain)
		.set('multiEnemy', multiEnemy)
		.set('fq', freeQuestsCalc)
		.set('f', freeQuestsCalc)
		.set('xmas', xmas)
		.set('x', xmas)
		.set('gf2', gf2Final)
		.set('wikia', wikia)
		.set('w', wikia)
		.set('lolwiki', lolwiki)
		.set('lw', lolwiki)
		.set('google', bing)
		.set('bing', bing)
		.set('search', bing)
		.set('math', calculate)
		.set('m', calculate)
		.set('calc', calculate)
		.set('c', calculate)
		.set('chargers', async () => ({ content: '<https://docs.google.com/spreadsheets/d/14enWHBWAjGS4t-ChoGOTpdRSjXmeW0UgvMtEQMTsr_I>' }))
		.set('help', help)
		.set('h', help)
		.set('list', getnps)
		.set('l', getnps)
		.set('getnps', getnps)
		.set('getnp', getnps)
		.set('getnames', getnames)
		.set('g', getnames)
		.set('addname', addname)
		.set('a', addname)
		.set('starz', async () => ({ content: '<https://fategrandorder.fandom.com/wiki/Wolfgang_Amadeus_Mozart>' }))
		.set('refund', async () => ({ content: 'https://imgur.com/lO1UGGU' }))
		.set('junao', async () => ({
			embeds : [{
				title: 'Junao/Waver',
				description: 'https://imgur.com/IAYH9Vb',
			},
			{
				title: 'Junao/Merlin',
				description: 'https://imgur.com/eA0YLIQ',
			}],
			name: 'junao'
		}))
		.set('commands', async () => {
			
			let replyDesc = `\\* test (t)		: test servant damage
		\\* fq (f)		: test servants on free quests
		\\* chargers	: view servants with on-demand np gauge
		\\* help (h)	: help for !test
		\\* getnames (g)	: get nicknames for a servant
		\\* getnps (list, l)	: get nps for a servant
		\\* math(m)/calc(c)	: \`+ - * / ^ %\` (no parens)
		\\* wikia (w)	: search wikia using google
		\\* google (bing, search)	: search query with bing
		\\* junao	: bring up np1/np5 junao+waver|merlin calc
		\\* xmas (x)	: calc xmas final gold tag lotto node (example !x nero wave3 a30)
		\\* gf2	: calc gf2 final garden node (example !g nero wave3 a30)
		\\* commands	: haha recursion
		\\* [no prefix needed in DMs]`;

			let reply = {
				embeds: [{
					title: '__Commands__',
					description: replyDesc
				}],
				name: 'commands'
			};

			return reply;

		});
};
