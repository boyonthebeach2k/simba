const servants = require('./nice_servant_jp.json');
const nicknames = require('./nicknames.json');
const NAServants = require('./nice_servant.json');
const classList = require('./class-attack-rate.json');
const classRelation = require('./class-relation.json');
const attributeRelation = require('./attribute-relation.json');
const passiveSkillSet = require('./skills-passive.json');
const freeQuests = require('./free_quests.json');
const maxNAServant = Math.max.apply(null, Object.keys(passiveSkillSet).filter(x => NAServants[x]), NAServants.map(s => s.collectionNo));

module.exports = exports = { servants, nicknames, NAServants, classList, classRelation, attributeRelation, passiveSkillSet, freeQuests, maxNAServant };