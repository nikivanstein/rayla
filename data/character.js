/*
 * CHARACTER DATA
 * -----------------------------------------------------------------------
 * Core stat-block facts for Rayla. This file rarely changes — level-up
 * is really the only reason to touch it. Spell and wild-shape data live
 * in their own files (spells.js, wildshape.js) since those change often.
 */

const CHARACTER = {
  name: "Rayla",
  player: "Niki",
  classLevel: "Druid 13",
  race: "Elf (Star)",
  alignment: "Chaotic Neutral",
  deity: "Corellon Larethian",
  size: "Medium",
  age: 134,
  gender: "Female",
  height: "5'9\"",
  weight: "139 lbs.",
  eyes: "Golden",
  hair: "Blue/purple",

  xp: { current: 86800, nextLevel: 91000, remaining: 4200 },

  languages: ["Druidic", "Elven", "Common", "Draconic"],

  abilities: {
    STR: { score: 8, mod: -1 },
    DEX: { score: 10, mod: 0 },
    CON: { score: 12, mod: 1 },
    INT: { score: 14, mod: 2 },
    WIS: { score: 19, mod: 4 },
    CHA: { score: 14, mod: 2 },
  },

  hp: { total: 83, hitDice: "13d8" },
  speed: { value: 20, note: "Base 30 ft., reduced by medium armor" },
  initiative: 0,

  ac: {
    total: 13, flatFooted: 13, touch: 10,
    base: 10, armor: 3, shield: 0, dex: 0, size: 0, natural: 0, misc: 0,
    maxDex: 4, armorCheckPenalty: -3, spellFailure: 20,
  },

  saves: {
    fort: { total: 9, base: 8, abilityMod: 1, ability: "Con" },
    reflex: { total: 4, base: 4, abilityMod: 0, ability: "Dex" },
    will: { total: 12, base: 8, abilityMod: 4, ability: "Wis" },
  },

  bab: "+9/+4",
  melee: "+8/+3",
  ranged: "+9/+4",
  grapple: "+8",

  attacks: [
    { name: "Quarterstaff", bonus: "+8/+3", damage: "1d6-1", critical: "x2", type: "Bludgeoning", weight: "4 lbs." },
    { name: "Unarmed strike", bonus: "+4/-1", damage: "1d3-1", critical: "x2", type: "Bludgeoning", weight: "0 lbs." },
  ],

  armorWorn: { name: "Hide", type: "Medium", armorBonus: 3, maxDex: 4, checkPenalty: -3, spellFailure: 20, speed: 20, weight: 25 },

  feats: [
    {
      name: "Armor Proficiency (light)",
      description: "Proficient with light armor: its armor check penalty applies only to Balance, Climb, Escape Artist, Hide, Jump, Move Silently, and Tumble checks, instead of to attack rolls and all Strength- and Dexterity-based checks. (PHB)",
    },
    {
      name: "Armor Proficiency (medium)",
      description: "As Armor Proficiency (light), but for medium armor — without it, a medium armor's check penalty applies to attack rolls and all movement-based skill checks as well. (PHB)",
    },
    {
      name: "Shield Proficiency",
      description: "Proficient with shields (but not tower shields): a proficient shield's armor check penalty applies only to Balance, Climb, Escape Artist, Hide, Jump, Move Silently, and Tumble checks. (PHB)",
    },
    {
      name: "Augment Summoning",
      description: "Prerequisite: Spell Focus (Conjuration). Each creature you conjure with a summon spell gains a +4 enhancement bonus to Strength and a +4 enhancement bonus to Constitution for the duration of the spell that summoned it. (PHB)",
    },
    {
      name: "Spell Focus: Conjuration",
      description: "Adds +1 to the Difficulty Class for all saving throws against your conjuration spells. (PHB)",
    },
    {
      name: "Natural Spell",
      description: "Prerequisites: Wis 13, wild shape class feature. Lets you complete the verbal and somatic components of a spell while in wild shape, substituting noises and gestures, and use material components or foci even if they're melded into your new form. Doesn't grant the ability to speak or to use magic items your form couldn't normally use. (Complete Divine)",
    },
    {
      name: "Assume Supernatural Ability",
      description: "Prerequisite: Wis 13, ability to assume a new form magically (such as wild shape). Lets you use one supernatural ability of the creature whose form you've assumed; the save DC is based on your own ability scores and Hit Dice rather than the base creature's. (Savage Species)",
    },
    {
      name: "Dragon Wild Shape",
      description: "Prerequisites: Wis 19, Knowledge (nature) 15 ranks, wild shape class feature. Lets you use wild shape to become a true dragon, gaining its Extraordinary and Supernatural abilities — but not its spells or spell-like abilities. (Draconomicon)",
    },
  ],

  specialQualities: [
    "+2 racial bonus on saves vs. enchantment spells and effects",
    "Extraplanar (Su)",
    "Immunity to sleep effects (Ex)",
    "Low-light vision (Ex)",
    "Otherworldly touch (Su)",
  ],

  classFeatures: [
    {
      name: "A Thousand Faces",
      description: "At 13th level, a druid gains the supernatural ability to change her appearance at will, as if using disguise self, but only while in her normal form. (PH36)",
    },
    {
      name: "Animal companion",
      description: "A druid may begin play with an animal companion selected from a druid-specific list (badger, camel, dire rat, dog, eagle, hawk, horse, owl, pony, snake, wolf...). The companion is superior to a normal animal of its kind and gains bonus HD, skill points, feats, and special abilities as the druid advances in level (PH35, Table: Druid Animal Companions). It obeys the druid's orders as well as any well-trained animal.",
    },
    {
      name: "Druidic weapon proficiency",
      description: "Druids are proficient with the club, dagger, dart, quarterstaff, scimitar, sickle, shortspear, sling, and spear, and with all their natural weapons in any form assumed with wild shape — but no others. A druid who wears prohibited armor (metal) or carries a metal shield or weapon is unable to cast spells or use any supernatural or spell-like class ability while doing so, and for 24 hours afterward. (PH35)",
    },
    {
      name: "Nature sense",
      description: "A druid gains a +2 bonus on Knowledge (nature) and Survival checks. (PH35)",
    },
    {
      name: "Resist nature's lure",
      description: "Starting at 4th level, a druid gains a +4 bonus on saving throws against the spell-like abilities of fey. (PH36)",
    },
    {
      name: "Secret language: Druidic",
      description: "Druids know a secret language, Druidic, taught only to other druids and never to outsiders; it doesn't count against a druid's normal languages known. Druidic has its own alphabet and can be used to leave hidden trail markers or messages that only another druid will spot; a rogue (only) can use Use Magic Device to decipher such a message, DC 20. (PH35)",
    },
    {
      name: "Spontaneous casting (summon nature's ally)",
      description: "A druid can channel stored spell energy into summoning spells she hasn't prepared. She can \"lose\" any prepared spell that isn't a domain spell in order to cast any summon nature's ally spell of the same level or lower. (PH35)",
    },
    {
      name: "Trackless step",
      description: "Starting at 3rd level, a druid leaves no trail in natural surroundings and cannot be tracked, though she may choose to leave a trail if she wishes. (PH36)",
    },
    {
      name: "Venom immunity",
      description: "At 9th level, a druid gains immunity to all poisons. (PH36)",
    },
    {
      name: "Wild empathy (+15)",
      description: "A druid can use body language, vocalizations, and demeanor to improve the attitude of an animal, working like a Diplomacy check to improve another creature's attitude. She rolls 1d20 + druid level + Charisma modifier against a DC set by the animal's starting attitude (usually indifferent for domesticated animals, unfriendly for wild ones); both druid and animal must be within 30 ft. of each other, and it takes about 1 minute (as influencing an NPC would). She can also try this on a magical beast with Intelligence 1–2, at a −4 penalty. (PH35)",
    },
    {
      name: "Wild shape 4/day — Tiny to Large size, and Plant",
      description: "A druid can turn herself into any Small or Medium animal and back again, gaining new size categories and creature types (including plant, as noted here) and more uses per day as she gains levels (PH36–37). In animal form she retains her own mind, alignment, and personality; loses her natural attacks/movement/senses in favor of the new form's, but keeps extraordinary special attacks of the new form (not supernatural or spell-like ones). Changing shape (in either direction) is a standard action that doesn't provoke an attack of opportunity, and reverting to her normal form early is a free action.",
    },
    {
      name: "Woodland stride",
      description: "Starting at 2nd level, a druid may move through natural thorns, briars, overgrown areas, and similar terrain at her normal speed, without taking damage or suffering any other impairment. Terrain that has been magically manipulated to impede motion still affects her normally. (PH36)",
    },
  ],

  // Skills as shown on the sheet. `ranks` is what's actually invested;
  // everything else is derived (ability mod + misc bonuses).
  skills: [
    { name: "Appraise", ability: "Int", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Balance*", ability: "Dex", ranks: 0, abilityMod: 0, misc: -3, total: -3 },
    { name: "Bluff", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Climb*", ability: "Str", ranks: 1, abilityMod: -1, misc: -3, total: -3 },
    { name: "Concentration", ability: "Con", ranks: 16, abilityMod: 1, misc: 0, total: 17 },
    { name: "Control Shape", ability: "Wis", ranks: 0, abilityMod: 4, misc: 0, total: 4 },
    { name: "Craft (\u2014)", ability: "Int", ranks: 0, abilityMod: 2, misc: -2, total: 0 },
    { name: "Diplomacy", ability: "Cha", ranks: 8, abilityMod: 2, misc: 0, total: 10 },
    { name: "Disguise", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Escape Artist*", ability: "Dex", ranks: 0, abilityMod: 0, misc: -3, total: -3 },
    { name: "Forgery", ability: "Int", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Gather Information", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Handle Animal", ability: "Cha", ranks: 4, abilityMod: 2, misc: 0, total: 6 },
    { name: "Heal", ability: "Wis", ranks: 2, abilityMod: 4, misc: 0, total: 6 },
    { name: "Hide*", ability: "Dex", ranks: 0, abilityMod: 0, misc: -3, total: -3 },
    { name: "Intimidate", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Jump*", ability: "Str", ranks: 0, abilityMod: -1, misc: -9, total: -10 },
    { name: "Knowledge (Arcana)", ability: "Int", ranks: 1, abilityMod: 2, misc: 0, total: 3 },
    { name: "Knowledge (Dungeoneering)", ability: "Int", ranks: 1, abilityMod: 2, misc: 0, total: 3 },
    { name: "Knowledge (History)", ability: "Int", ranks: 1, abilityMod: 2, misc: 0, total: 3 },
    { name: "Knowledge (Local \u2014 Elf, Sun)", ability: "Int", ranks: 1, abilityMod: 2, misc: 0, total: 3 },
    { name: "Knowledge (Nature)", ability: "Int", ranks: 3, abilityMod: 2, misc: 4, total: 9 },
    { name: "Knowledge (Psionics)", ability: "Int", ranks: 1, abilityMod: 2, misc: 0, total: 3 },
    { name: "Knowledge (The Planes)", ability: "Int", ranks: 1, abilityMod: 2, misc: 0, total: 3 },
    { name: "Listen", ability: "Wis", ranks: 2, abilityMod: 4, misc: 2, total: 8 },
    { name: "Move Silently*", ability: "Dex", ranks: 0, abilityMod: 0, misc: -3, total: -3 },
    { name: "Perform (Act)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (Comedy)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (Dance)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (Keyboard Instruments)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (Oratory)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (Percussion)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (Sing)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (String Instruments)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (Weapon Drill)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Perform (Wind Instruments)", ability: "Cha", ranks: 0, abilityMod: 2, misc: 0, total: 2 },
    { name: "Profession (Apothecary)", ability: "Wis", ranks: 1, abilityMod: 4, misc: 0, total: 5 },
    { name: "Profession (Astrologer)", ability: "Wis", ranks: 1, abilityMod: 4, misc: 0, total: 5 },
    { name: "Profession (Herbalist)", ability: "Wis", ranks: 1, abilityMod: 4, misc: 0, total: 5 },
    { name: "Ride", ability: "Dex", ranks: 5, abilityMod: 0, misc: 0, total: 5 },
    { name: "Search", ability: "Int", ranks: 0, abilityMod: 2, misc: 2, total: 4 },
    { name: "Sense Motive", ability: "Wis", ranks: 0, abilityMod: 4, misc: 0, total: 4 },
    { name: "Spellcraft", ability: "Int", ranks: 13, abilityMod: 2, misc: 0, total: 15 },
    { name: "Spot", ability: "Wis", ranks: 9, abilityMod: 4, misc: 2, total: 15 },
    { name: "Survival", ability: "Wis", ranks: 10, abilityMod: 4, misc: 2, total: 16 },
    { name: "Swim*", ability: "Str", ranks: 3, abilityMod: -1, misc: -6, total: -4 },
    { name: "Use Magic Device", ability: "Cha", ranks: 2, abilityMod: 2, misc: 0, total: 4 },
    { name: "Use Rope", ability: "Dex", ranks: 0, abilityMod: 0, misc: 0, total: 0 },
  ],

  equipment: [
    { name: "Bracers of Armor +1", qty: 1, cost: "1000 gp", weight: "1 lb.", magic: "Grants a +1 armor bonus to AC. (DMG 250)" },
    { name: "Robe of Stars", qty: 1, cost: "58000 gp", weight: "1 lb.", magic: "Lets the wearer travel physically to the Astral Plane, grants a +1 luck bonus on all saving throws, and up to 6 of its embroidered stars can be used as +5 shuriken (one use each). (DMG 265)" },
    { name: "Amulet of the Monkey God", qty: 1, cost: "120000 gp", weight: "0 lb.", magic: "Allows the wearer to plane shift to the Monkey god's domain, (similar as Astral plane). (DMG 247)" },
    { name: "Emeril Horizon Glass", qty: 1, cost: "\u2014", weight: "\u2014", magic: "While holding this stone, your touch spells become short-range spells instead (30 ft.). Usable 3/day." },
    { name: "Emeril of the Stretched Horizon", qty: 1, cost: "\u2014", weight: "\u2014", magic: "While holding this stone, spells you cast gain increased range, as the Enlarge Spell metamagic feat. Usable 3/day." },
    { name: "Quarterstaff", qty: 1, cost: "\u2014", weight: "4 lbs." },
    { name: "Alchemist's tools", qty: 1, cost: "5 gp", weight: "5 lbs." },
    { name: "Animal Training Kit", qty: 1, cost: "75 gp", weight: "15 lbs." },
    { name: "Elven Harp, Hand", qty: 1, cost: "150 gp", weight: "2 lbs." },
    { name: "Bedroll", qty: 1, cost: "1 sp", weight: "5 lbs." },
    { name: "Candle, 12 hour", qty: 1, cost: "5 sp", weight: "0.25 lb." },
    { name: "Holly and mistletoe", qty: 1, cost: "\u2014", weight: "\u2014" },
    { name: "Nightshirt, Silk", qty: 1, cost: "6 gp", weight: "\u2014" },
    { name: "Rope, Elven", qty: 1, cost: "50 gp", weight: "5 lbs." },
    { name: "Waterskin (full)", qty: 1, cost: "1 gp", weight: "4 lbs." },
  ],

  money: { cp: 0, sp: 0, gp: 11985, pp: 500 },
  weightCarried: "40 lbs. (light load)",

  animalCompanion: {
    name: "Rayla's Bait",
    note: "Celestial-Lion \u2014 Smite Evil, energy resistances, and spell resistance all point to the Celestial template.",
    abilities: { STR: 23, DEX: 19, CON: 15, INT: 3, WIS: 12, CHA: 6 },
    saves: { fort: 8, reflex: 10, will: 4 },
    hp: 58,
    speed: 40,
    initiative: 4,
    ac: { base: 20, flatFooted: 16, touch: 13 },
    attacks: [
      { name: "2 Claws", bonus: "+11", damage: "1d4+6", critical: "20/x2" },
      { name: "Bite", bonus: "+6", damage: "1d8+3", critical: "20/x2" },
    ],
    features: ["Bonus Tricks (3)", "Link (Ex)", "Share Spells", "Evasion", "Devotion (Ex)"],
    special: [
      "Pounce (Ex)", "Improved Grab (Ex)", "Rake (Ex)", "Smite Evil (Su)", "Scent (Ex)",
      "Low-light Vision (Ex)", "Resistance to Electricity 5 (Ex)", "Resistance to Cold 5 (Ex)",
      "Darkvision 60 ft. (Ex)", "Spell Resistance 9 + 5 (Ex)", "DR 5/Magic (Su)", "Resistance to Acid 5 (Ex)",
    ],
    feats: ["Run", "Alertness"],
    skills: "Spot +5, Hide +4, Listen +5, Jump +10, Move Silently +12, Balance +8",
  },
};
