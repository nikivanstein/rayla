/*
 * SPELL DATA
 * -----------------------------------------------------------------------
 * This is the file to edit when your prepared spells change.
 *
 * Each level has:
 *   perDay       - your max spell slots of that level per day
 *   prepared     - spells actually marked prepared right now
 *   alternatives - other spells you know (per "Known: All") but haven't
 *                  prepared; shown collapsed on the page
 *
 * To prepare a spell that's currently an alternative: cut its object out
 * of `alternatives` and paste it into `prepared` (add a `qty` field, e.g.
 * qty: 1). To swap a prepared spell out: do the reverse. The page re-
 * renders straight from this file, so no other changes are needed.
 *
 * Spell fields: name, qty (prepared only), dc, save, cast, duration,
 * range, effect (include the source book in parentheses at the end).
 */

const SPELL_DATA = {
  0: {
    label: "Cantrips",
    perDay: 6,
    prepared: [
      { name: "Create Water", qty: 1, dc: 15, save: "None", cast: "1 Action", duration: "Instantaneous", range: "Close (25+5/2 lvl)", effect: "Creates up to 2 gallons of clean, drinkable water per caster level, filling any open container in range. (PH215)" },
      { name: "Cure Minor Wounds", qty: 1, dc: 15, save: "Will Half", cast: "1 Action", duration: "Instantaneous", range: "Touch", effect: "Touch cures 1 point of damage. (PH216)" },
      { name: "Detect Magic", qty: 2, dc: 14, save: "None", cast: "1 Action", duration: "Conc., up to 1 min/lvl (D)", range: "60 ft.", effect: "Detects magical auras in a cone; with 3 rounds of concentration you learn the number and power of auras, then their school. (PH219)" },
      { name: "Mending", qty: 1, dc: 14, save: "Will Neg. (Harmless, Object)", cast: "1 Action", duration: "Instantaneous", range: "10 ft.", effect: "Repairs a small break or tear in an object (up to 1 lb.); doesn't restore magic to a broken item. (PH253)" },
      { name: "Purify Food and Drink", qty: 1, dc: 14, save: "Will Neg. (Object)", cast: "1 Action", duration: "Instantaneous", range: "10 ft.", effect: "Makes 1 cu.ft./lvl of spoiled, poisoned, or contaminated food and water pure and safe. (PH267)" },
    ],
    alternatives: [
      { name: "Guidance", dc: 14, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "1 min. or until discharged", range: "Touch", effect: "Grants a +1 competence bonus on a single attack roll, save, or skill check made before it ends. (PH237)" },
      { name: "Resistance", dc: 14, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "1 minute", range: "Touch", effect: "Grants a +1 resistance bonus on saving throws. (PH272)" },
      { name: "Detect Poison", dc: 14, save: "None", cast: "1 Action", duration: "Instantaneous", range: "Close (25+5/2 lvl)", effect: "Determines whether a creature, object, or area is poisoned or poisonous, and its type on a Wisdom check. (PH219)" },
    ],
  },

  1: {
    label: "Level 1",
    perDay: 6,
    prepared: [
      { name: "Beget Bogun", qty: 1, dc: 16, save: "None", cast: "1 Action", duration: "Instantaneous", range: "Touch", effect: "Infuses a small mannequin of vegetable matter with living magic, animating it as a loyal bogun servant. (SpC26)" },
      { name: "Camouflage", qty: 3, dc: 15, save: "None", cast: "1 Action", duration: "10 min/lvl", range: "Personal", effect: "Your coloration instantly shifts to match your surroundings, granting a strong bonus on Hide checks. (SpC43)" },
      { name: "Entangle", qty: 1, dc: 15, save: "Reflex Partial", cast: "1 Action", duration: "1 min/lvl", range: "Long (400+40/lvl)", effect: "Grasses and vines grow to entwine everyone in a Long-range area (-4 to attack; Reflex or be unable to move at all). (PH227)" },
      { name: "Shillelagh", qty: 1, dc: 15, save: "Will Neg. (Object)", cast: "1 Action", duration: "1 min/lvl", range: "Touch", effect: "Turns your quarterstaff/cudgel into a +1 weapon that deals damage as if one size larger (1d10). (PH278)" },
      { name: "Thunderhead", qty: 1, dc: 15, save: "Reflex Neg.; see text", cast: "1 Action", duration: "1 round/lvl", range: "Close (25+5/2 lvl)", effect: "A black mist rises near the target and joins a small storm cloud that follows and harasses it. (SpC219)" },
    ],
    alternatives: [
      { name: "Faerie Fire", dc: 15, save: "None", cast: "1 Action", duration: "1 min/lvl (D)", range: "Long (400+40/lvl)", effect: "Outlines every creature in the area in light, negating concealment (blur, invisibility, etc.) and any miss chance against them. (PH229)" },
      { name: "Goodberry", dc: 15, save: "None", cast: "1 Action", duration: "1 day/lvl", range: "Touch", effect: "Turns 2d4 berries into food; each cures 1 hp and is a full meal (max 8 berries' worth of healing per day). (PH237)" },
      { name: "Longstrider", dc: 15, save: "None", cast: "1 Action", duration: "1 hour/lvl (D)", range: "Personal", effect: "Increases your base land speed by 10 ft. for the duration. (PH249)" },
      { name: "Pass without Trace", dc: 15, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "1 hour/lvl (D)", range: "Touch", effect: "You and up to one ally/level leave no tracks or scent \u2014 nearly impossible to follow. (PH259)" },
    ],
  },

  2: {
    label: "Level 2",
    perDay: 6,
    prepared: [
      { name: "Animate Fire", qty: 1, dc: 16, save: "None", cast: "1 Round", duration: "Conc., up to 1 rd/lvl", range: "Close (25+5/2 lvl)", effect: "Turns a Small or smaller quantity of open flame into a fire creature that fights for you. (OA97)" },
      { name: "Barkskin", qty: 1, dc: 16, save: "None (harmless)", cast: "1 Action", duration: "10 min/lvl", range: "Touch", effect: "Toughens skin like bark: +2 enhancement bonus to natural armor (up to +5 at higher caster levels). (PH203)" },
      { name: "Bear's Endurance", qty: 1, dc: 16, save: "Will Negates", cast: "1 Action", duration: "1 min/lvl", range: "Touch", effect: "Grants a +4 enhancement bonus to Constitution for the duration. (PH203)" },
      { name: "Creeping Cold", qty: 2, dc: 16, save: "Fortitude Half", cast: "1 Action", duration: "3 rounds", range: "Close (25+5/2 lvl)", effect: "Freezes the sweat on the target's skin, dealing cold damage as ice crystals cut into flesh. (MOTW86)" },
      { name: "Restoration, Lesser", qty: 1, dc: 17, save: "Will Neg. (Harmless)", cast: "3 Rounds", duration: "Instantaneous", range: "Touch", effect: "Touch dispels a magical ability penalty on the subject, or repairs 1d4 points of ability damage. (PH272)" },
      { name: "Snake's Swiftness, Mass", qty: 1, dc: 16, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "Instantaneous", range: "Medium (100+10/lvl)", effect: "Each target creature can instantly draw and fire or throw a ranged weapon without using an action. (SpC193)" },
      { name: "Wood Shape", qty: 1, dc: 16, save: "Will Neg. (Object)", cast: "1 Action", duration: "Instantaneous", range: "Touch", effect: "Rearranges wooden objects (doors, beams, planks) into a useful shape, as if they were soft clay. (PH303)" },
    ],
    alternatives: [
      { name: "Owl's Wisdom", dc: 16, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "1 min/lvl", range: "Touch", effect: "Grants a +4 enhancement bonus to Wisdom for the duration. (PH259)" },
      { name: "Spider Climb", dc: 16, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "10 min/lvl", range: "Touch", effect: "Lets the subject climb (and hang from) walls and ceilings as easily as walking, no check needed. (PH283)" },
      { name: "Gust of Wind", dc: 16, save: "Fortitude Negates", cast: "1 Action", duration: "1 round", range: "60 ft.", effect: "A severe 50-mph blast of wind blows away or knocks down smaller creatures, disperses fog/gas, and snuffs torches along its length. (PH238)" },
      { name: "Blinding Spittle", dc: 16, save: "None", cast: "1 Action", duration: "Instantaneous", range: "Close (25+5/2 lvl)", effect: "A ranged touch attack (-4 penalty) spits caustic saliva into the target's eyes, blinding it with no saving throw allowed. (SpC32)" },
      { name: "Halo of Sand", dc: 16, save: "None", cast: "1 Action", duration: "10 min/lvl", range: "Personal", effect: "Swirling sand grants a +1 deflection bonus to AC per 3 caster levels \u2014 stacks with Barkskin and armor. (Sand117)" },
      { name: "Nature's Favor", dc: 16, save: "Will Neg. (Harmless)", cast: "1 Swift", duration: "1 minute", range: "Touch", effect: "As a swift action, grants an ally or your animal companion a luck bonus on attack and damage rolls. (SpC146)" },
    ],
  },

  3: {
    label: "Level 3",
    perDay: 5,
    prepared: [
      { name: "Blindsight", qty: 1, dc: 17, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "1 min/lvl", range: "Touch", effect: "Grants blindsight (sense nearby creatures without needing sight) out to 30 ft. (PGtoFR100)" },
      { name: "Call Lightning", qty: 1, dc: 17, save: "Reflex Half", cast: "1 Round", duration: "1 min/lvl", range: "Medium (100+10/lvl)", effect: "Calls a 5-ft.-wide lightning bolt from the sky once/round, 3d6 electricity damage; can repeat each round for the duration. (PH207)" },
      { name: "Poison", qty: 1, dc: 17, save: "Fortitude Neg.; see text", cast: "1 Action", duration: "Instant.; see text", range: "Touch", effect: "Touch attack forces a Fortitude save or 1d10 Con damage now, with a second dose 1 minute later. (PH262)" },
      { name: "Stone Shape", qty: 1, dc: 17, save: "None", cast: "1 Action", duration: "Instantaneous", range: "Touch", effect: "Sculpts one piece of stone (up to 10 cu.ft. + 1 cu.ft./lvl) into virtually any shape. (PH284)" },
      { name: "Venomfire", qty: 1, dc: 17, save: "Fortitude Neg. (Harmless)", cast: "1 Action", duration: "1 hour/lvl", range: "Touch", effect: "Makes the subject's venom caustic, adding 1d6 acid damage per caster level to its next poison attack. (WotC-SK158)" },
    ],
    alternatives: [
      { name: "Neutralize Poison", dc: 18, save: "Will Neg. (Harmless, Object)", cast: "1 Action", duration: "10 min/lvl", range: "Touch", effect: "Detoxifies venom in or on the target; a poisoned creature suffers no further effects and is immune to poison for the duration. (PH257)" },
      { name: "Protection from Energy", dc: 17, save: "Fort. Neg. (Harmless)", cast: "1 Action", duration: "10 min/lvl (D)", range: "Touch", effect: "Absorbs the next 12 points/caster level (max 120) of damage from one chosen energy type. (PH266)" },
      { name: "Spike Growth", dc: 17, save: "Reflex Partial", cast: "1 Action", duration: "1 hour/lvl (D)", range: "Medium (100+10/lvl)", effect: "Hides spikes in the ground over a large area; anyone walking through takes 1d4 damage per 5 ft. moved and risks a lasting speed penalty. (PH283)" },
      { name: "Magic Fang, Greater", dc: 17, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "1 hour/lvl", range: "Close (25+5/2 lvl)", effect: "One natural weapon (or all of an animal's) gains +1 per four caster levels (max +5) to attack and damage. (PH250)" },
    ],
  },

  4: {
    label: "Level 4",
    perDay: 5,
    prepared: [
      { name: "Arc of Lightning", qty: 2, dc: 19, save: "Reflex Half", cast: "1 Action", duration: "Instantaneous", range: "Close (25+5/2 lvl)", effect: "A line of lightning between you and the target deals 1d6/lvl (max 15d6) electricity damage to both the target and anything between you. (SpC15)" },
      { name: "Flame Strike", qty: 1, dc: 18, save: "Reflex Half", cast: "1 Action", duration: "Instantaneous", range: "Medium (100+10/lvl)", effect: "A column of divine fire roars down, dealing 1d6/caster level (max 15d6) fire damage in the area. (PH231)" },
      { name: "Luminous Armor, Greater", qty: 1, dc: 18, save: "None", cast: "1 Action", duration: "1 hour/lvl (D)", range: "Touch", effect: "Wreathes the target in light: +8 armor bonus, dispels magical darkness nearby, -4 penalty on foes' melee attacks against it. (BoED)" },
      { name: "Moon Bolt", qty: 1, dc: 18, save: "Fort. Half (living) / Will Neg. (undead)", cast: "1 Action", duration: "Instantaneous", range: "Long (400+40/lvl)", effect: "A bolt of pale light strikes unerringly, damaging any living or undead creature in range regardless of cover. (SpC143)" },
      { name: "Scrying", qty: 1, dc: 18, save: "Will Negates", cast: "1 Hour", duration: "1 min/lvl", range: "Special", effect: "Creates an invisible sensor letting you see/hear a known subject at a distance, given a likeness or personal item. (PH274)" },
    ],
    alternatives: [
      { name: "Freedom of Movement", dc: 18, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "10 min/lvl", range: "Personal or touch", effect: "You (or the target) move and attack normally even under paralysis, grapples, solid fog, or water. (PH233)" },
      { name: "Air Walk", dc: 18, save: "None", cast: "1 Action", duration: "10 min/lvl", range: "Touch", effect: "Lets the subject walk on air as if solid ground, climbing or descending at up to a 45-degree angle. (PH196)" },
      { name: "Dispel Magic", dc: 18, save: "None", cast: "1 Action", duration: "Instantaneous", range: "Medium (100+10/lvl)", effect: "Ends one ongoing spell, suppresses an item's magic, or counters a spell being cast. (PH223)" },
      { name: "Boreal Wind", dc: 18, save: "Fortitude Negates", cast: "1 Action", duration: "1 round +1 round/2 lvl", range: "Long (400+40/lvl)", effect: "A gust of freezing wind blasts down a long line: 1d4 cold damage per caster level and knocks creatures back. (Frstbn89)" },
    ],
  },

  5: {
    label: "Level 5",
    perDay: 3,
    prepared: [
      { name: "Baleful Polymorph", qty: 1, dc: 19, save: "Fort. Neg., Will Partial; see text", cast: "1 Action", duration: "Permanent", range: "Close (25+5/2 lvl)", effect: "Permanently turns the target into a Small or smaller, 1-HD-or-less animal (e.g. a toad); an unwilling target that also fails its Will save thinks like the animal too. (PH202)" },
      { name: "Blizzard", qty: 1, dc: 19, save: "Fortitude Partial", cast: "1 Round", duration: "1 round/lvl", range: "Long (400+40/lvl)", effect: "Summons a driving blizzard over a huge area: temperature plummets, visibility drops to zero, cold damage each round. (Frstbn89)" },
      { name: "Control Winds", qty: 1, dc: 19, save: "Fortitude Negates", cast: "1 Action", duration: "10 min/lvl", range: "40 ft./lvl", effect: "Lets you strengthen, weaken, or redirect the wind throughout a large area for the duration. (PH214)" },
    ],
    alternatives: [
      { name: "Stoneskin", dc: 19, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "10 min/lvl or until discharged", range: "Touch", effect: "Grants DR 10/adamantine until it has absorbed 10 points of damage per caster level (max 150). (PH284)" },
      { name: "Death Ward", dc: 19, save: "Will Negates", cast: "1 Action", duration: "1 min/lvl", range: "Touch", effect: "Grants immunity to death spells/effects, energy drain, and ability drain from negative energy. (PH217)" },
      { name: "Commune with Nature", dc: 19, save: "None", cast: "10 Minutes", duration: "Instantaneous", range: "Personal", effect: "You learn up to 3 facts of your choice (terrain, plants, minerals, water, people, animals, dangerous creatures) within 1 mile/lvl outdoors (100 ft./lvl underground). (PH186)" },
      { name: "Animal Growth", dc: 19, save: "None", cast: "1 Action", duration: "1 min/lvl", range: "Medium (100+10/lvl)", effect: "Up to one animal per two levels doubles in size (+8 Str, +4 Con, -2 Dex) \u2014 great for buffing an animal companion before a fight. (PH198)" },
      { name: "Owl's Insight", dc: 19, save: "Fortitude Negates", cast: "1 Action", duration: "Up to 1 hour", range: "Touch", effect: "Grants an enhancement bonus to Wisdom equal to half your caster level (about +6 for you) \u2014 a big, if brief, boost to your save DCs. (MagFR111)" },
    ],
  },

  6: {
    label: "Level 6",
    perDay: 2,
    prepared: [
      { name: "Cometfall", qty: 2, dc: 21, save: "Reflex Half", cast: "1 Action", duration: "Instantaneous", range: "Medium (100+10/lvl)", effect: "Conjures a small comet that crashes into the target point, damaging everything in the area. (SpC50)" },
      { name: "Spellstaff", qty: 1, dc: 20, save: "Will Neg. (Object)", cast: "10 Minutes", duration: "Permanent until discharged (D)", range: "Touch", effect: "Permanently stores one prepared spell (up to 6th level) in your quarterstaff, triggerable later without using a slot. (PH282)" },
    ],
    alternatives: [
      { name: "Antilife Shell", dc: 20, save: "None", cast: "1 Round", duration: "10 min/lvl (D)", range: "10 ft.", effect: "A mobile 10-ft. hemisphere centered on you blocks nearly all living creatures from entering; defensive use only. (PH199)" },
      { name: "Dispel Magic, Greater", dc: 20, save: "None", cast: "1 Action", duration: "Instantaneous", range: "Medium (100+10/lvl)", effect: "As dispel magic, but the caster level check can reach +20 and it can end more kinds of effects. (PH223)" },
      { name: "Find the Path", dc: 20, save: "None or Will Neg. (Harmless)", cast: "3 Rounds", duration: "10 min/lvl", range: "Personal or touch", effect: "Reveals the shortest, most direct route to a destination you name on your plane, bypassing traps and even a maze spell. (PH230)" },
    ],
  },

  7: {
    label: "Level 7",
    perDay: 1,
    prepared: [
      { name: "True Seeing", qty: 1, dc: 21, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "1 min/lvl", range: "Touch", effect: "Lets you see all things as they truly are \u2014 through illusions, transmutations, darkness, and invisibility \u2014 out to 120 ft. (PH296)" },
    ],
    alternatives: [
      { name: "Heal", dc: 22, save: "Will Neg. (Harmless)", cast: "1 Action", duration: "Instantaneous", range: "Touch", effect: "Instantly cures 10 hp/caster level (max 150) and ends blindness, disease, exhaustion, poison, and most other debilitating conditions with one touch. (PH239)" },
      { name: "Fire Storm", dc: 21, save: "Reflex Half", cast: "1 Round", duration: "Instantaneous", range: "Medium (100+10/lvl)", effect: "Sheets of flame tear through a large area for 1d6/caster level (max 20d6) fire damage; you may exclude natural vegetation and chosen plant creatures. (PH231)" },
    ],
  },
};
