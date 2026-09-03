/*
 * BUFF LIBRARY
 * -----------------------------------------------------------------------
 * A curated set of Rayla's self-buff spells that grant a clean, numeric
 * bonus to a stat shown on the sheet (ability score, AC, a save, or
 * speed). Toggling one on in the Session panel applies its effect live
 * to the Overview / Ability Scores / Combat panels — it does not edit
 * data/character.js, so it never touches the "on paper" sheet.
 *
 * Each bonus carries a D&D 3.5 bonus type (enhancement, deflection,
 * armor, resistance...). Two active bonuses of the *same* type to the
 * same thing don't stack — only the higher counts — which the app
 * computes automatically; bonuses of different types do stack.
 *
 * Only a handful of her known spells have effects simple enough to
 * model this way (most — damage, utility, save-or-suck — don't reduce
 * to a sheet number). Everything else stays exactly as printed on the
 * spell tables below.
 */

const BUFF_LIBRARY = [
  {
    id: "barkskin",
    name: "Barkskin",
    note: "+2 enhancement bonus to natural armor (PH203)",
    effects: [{ target: "ac", component: "natural", bonusType: "enhancement", amount: 2 }],
  },
  {
    id: "halo-of-sand",
    name: "Halo of Sand",
    note: "+4 deflection bonus to AC at caster level 13 (+1/3 levels) (Sand117)",
    effects: [{ target: "ac", component: "deflection", bonusType: "deflection", amount: 4 }],
  },
  {
    id: "luminous-armor-greater",
    name: "Luminous Armor, Greater",
    note: "+8 armor bonus to AC — doesn't stack with worn armor, only the higher counts (BoED)",
    effects: [{ target: "ac", component: "armor", bonusType: "armor", amount: 8 }],
  },
  {
    id: "bears-endurance",
    name: "Bear's Endurance",
    note: "+4 enhancement bonus to Constitution (PH203)",
    effects: [{ target: "ability", ability: "CON", bonusType: "enhancement", amount: 4 }],
  },
  {
    id: "owls-wisdom",
    name: "Owl's Wisdom",
    note: "+4 enhancement bonus to Wisdom (PH259)",
    effects: [{ target: "ability", ability: "WIS", bonusType: "enhancement", amount: 4 }],
  },
  {
    id: "owls-insight",
    name: "Owl's Insight",
    note: "+1/2 caster level enhancement bonus to Wisdom — +6 at caster level 13 (MagFR111)",
    effects: [{ target: "ability", ability: "WIS", bonusType: "enhancement", amount: 6 }],
  },
  {
    id: "longstrider",
    name: "Longstrider",
    note: "+10 ft. enhancement bonus to base land speed (PH249)",
    effects: [{ target: "speed", bonusType: "enhancement", amount: 10 }],
  },
  {
    id: "resistance",
    name: "Resistance",
    note: "+1 resistance bonus on all saving throws (PH272)",
    effects: [{ target: "save", save: "all", bonusType: "resistance", amount: 1 }],
  },
];
