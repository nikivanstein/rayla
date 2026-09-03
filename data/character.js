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
    "Armor Proficiency (light)",
    "Armor Proficiency (medium)",
    "Shield Proficiency",
    "Augment Summoning",
    "Spell Focus: Conjuration",
    "Natural Spell",
    "Assume Supernatural Ability",
    "Dragon Wild Shape",
  ],

  specialQualities: [
    "+2 racial bonus on saves vs. enchantment spells and effects",
    "Extraplanar (Su)",
    "Immunity to sleep effects (Ex)",
    "Low-light vision (Ex)",
    "Otherworldly touch (Su)",
  ],

  classFeatures: [
    "A Thousand Faces",
    "Animal companion",
    "Druidic weapon proficiency",
    "Nature sense",
    "Resist nature's lure",
    "Secret language: Druidic",
    "Spontaneous casting (summon nature's ally)",
    "Trackless step",
    "Venom immunity",
    "Wild empathy (+15)",
    "Wild shape 4/day — Tiny to Large size, and Plant",
    "Woodland stride",
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
    { name: "Amulet of the Planes", qty: 1, cost: "120000 gp", weight: "0 lb.", magic: "Allows the wearer to plane shift, as the spell. (DMG 247)" },
    { name: "Quarterstaff", qty: 1, cost: "\u2014", weight: "4 lbs." },
    { name: "Hide armor", qty: 1, cost: "15 gp", weight: "25 lbs." },
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
    note: "Celestial-templated big cat \u2014 Smite Evil, energy resistances, and spell resistance all point to the Celestial template.",
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
