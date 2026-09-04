/*
 * SUMMON NATURE'S ALLY DATA
 * -----------------------------------------------------------------------
 * Recommended options per spell level, adapted from the community druid
 * handbook (minmaxforum). Grouped exactly like SPELL_DATA (keyed by
 * spell level, colored to match) and rendered as collapsible stat-block
 * cards exactly like WILDSHAPE_DATA.
 *
 * Every creature's Strength and Constitution already have the permanent
 * +4/+4 enhancement bonus from the Augment Summoning feat baked in — see
 * data/character.js for the feat text. A flat +4 to any ability score
 * always shifts its modifier by exactly +2, so for every creature here:
 *   - Str mod and Con mod are each +2 over the printed base stat block
 *   - HP = base HP + 2 x Hit Dice
 *   - Attack rolls (to-hit) = base + 2 (full Str mod applies to hit,
 *     whether the natural weapon is primary or secondary)
 *   - Damage = base + 2 on primary natural weapons, base + 1 on
 *     secondary natural weapons (secondary attacks only add half the
 *     Str bonus, rounded down)
 *   - Fortitude save = base + 2
 *   - Str-based skills (Climb, Jump, Swim) = base + 2
 * Placeholder — filled in from verified 3.5 SRD/sourcebook stat blocks.
 */

const SUMMON_DATA = {};
