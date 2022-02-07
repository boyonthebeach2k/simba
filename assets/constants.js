const testArgs = `__General arguments__:
\t**level/lvl/l**: servant level (default: ungrailed level cap)
\t**nplevel/np**: (1 to 5, default: np5)
\t**str**: np strengthening (1 for str, 0 for not; default: na availability. str1 for astarte quick NP and faelot buster NP)
\t**getnp/list/l**: lists nps for the given servant ID
\t**setnp/snp: set np (e.g. snp1 for astarte buster) (like a more flexible str)
\t**atkmod/a/atk**: atk up/down (put - in front of down values)
\t**defmod/d**: def up/down
\t**npmod/n**: np dmg up/down
\t**cardmod/cm/m**: quick/arts/buster performance up/down (does not affect extra card; only em/extramod affects extra card)
\t**flatdamage/fd/ad**: flat dmg up (e.g. waver s3, saberlot oc)
\t**semod/se/s**: supereffective np dmg increase (e.g. 150 at oc1 for gilgamesh)
\t**pmod/p**: powermod for trait damage (e.g. jack oc, raiko s3) or event modifiers
\t**specialdefensemod/sdm**: special defense up/down (e.g. gawain's damage reduction in camelot)
\t**ce/c**: ce attack stat (default: 0)
\t**fou/f**: fou attack stat (default: 1k)
\t**totalattack/ta**: sets total attack stat, overrides fou and ce atk
\t**cardvalue/cmv**: override cardtype multiplier (1.5/1/0.8 for buster/arts/quick)
\t**cardrefundvalue/crv**: override card's np gain value
\t**npvalue/npv**: manually input np scaling (e.g. arash overcharge)
\t**classoverride/cao**: override
\t**zerk** (for example): enemy class
\t**man** (for example): enemy attribute`;
const cardArgs = `__Additional card arguments__:
\t**arts/buster/quick/extra**: calc single card
\t**artsmod/am, bustermod/bm, quickmod/qm, extramod/em**: arts-/buster-/quick-/extra- mod
\t**npba** (for example): specify whole chain
\t**first/second/third/extra**: facecard position
\t**qf/af/bf**: quick/arts/buster first bonus (automatically applied in bravechain calcs)
\t**card1/card2/card3/card4**: place before arguments that only apply to that one card
\t	example- \`!test bride ng45 a40 sg50 p30 | a20 | bnpa zerk sky | card1 m50 | card3 d-20 card4 d-20 #bride/merlin\`
\t**critical/crit**: set facecards to crit
\t**brave**: forces ecm3.5
\t**extracardmodifier/ecm**: set extracardmodifier in damage calc; usually no need to use this manually
\t**critdamage/cd**: critical strength up/down
\t**busterchainmod/bc**: buster chain bonus`;
const nonDmgArgs = `__Non-damage arguments__:
\t**hp**: enemy hp (including this triggers refund output)
\t**npgain/npgen/ng**: np generation up/down
\t**flatrefund/flatgain/fr/fg**: add the specified flat refund to result (e.g. DVR's NP)
\t**enemyservermod/sm/esm**: override enemyservermod for refund calcs; usually no reason to set it manually
\t**stars**: trigger stargen info (largely redundant, usually only used with nonverbose option)
\t**serverrate/srr/sr**: enemyservermod, but for star generation
\t**stargen/sg**: star generation up/down
\t**verbose/v**: verbose levels [v or vv]
\t**nonverbose/nv**: reduce output verbosity`;
const waveArgs = `__Additional enemy-specific arguments__:
\t**enemyX**: place before arguments that only apply to that one enemy
\t**enemy0**: calc the same command for 3 identical enemies
\t	example- \`!test nero a44 sky enemy1 lancer hp9938 enemy2 zerk hp21780 enemy3 lancer man hp24440\`
\t**waveX**: place before arguments that apply to a whole wave (applicable for !fq only) [do not use enemyX and waveX together]
\t	example- \`!fq charlotte zerklot m100 wave3 d-60\``;
const shorthands = `__Shorthands__:
\t**superbg/sbg**: ce2400 n80
\t**superad**: ce2000 n10 m10 [m10 only applies for buster]
\t**supersumo**: ce2000 a15
\t**superhns**: ce2000 n15
\t**superscope/sscope**: ce2000
\t**superfondant/sf**: ce2000 p30 - use it wisely, shounen.
\t**supered/super**: level100 fou2000
\t**supergrail/hyper/superer**: level120 fou2000
__Other__:
\t**#**: note/comment - anything that follows this will be ignored
\t**/\\*...\\*/**: anything between these will be ignored (can be used inline)`;

const helpPages = { testArgs, cardArgs, nonDmgArgs, waveArgs, shorthands };
const prefix = '!';
const aaPrefix = '.';

module.exports = exports = { helpPages, prefix, aaPrefix };