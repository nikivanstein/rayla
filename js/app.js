/*
 * APP.JS
 * -----------------------------------------------------------------------
 * Renders the whole page from CHARACTER / SPELL_DATA / WILDSHAPE_DATA.
 * Nothing about a spell or a wild shape form is hard-coded in the HTML —
 * edit the files in /data and reload to see the change.
 */

(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, attrs, children) => {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k.startsWith("on") && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
        else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach((c) => {
      if (c == null) return;
      node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    });
    return node;
  };
  const modStr = (n) => (n >= 0 ? `+${n}` : `${n}`);

  /* ---------------------------------------------------------------- *
   * Local-storage helpers (small wrappers so a bad browser setting
   * never breaks rendering).
   * ---------------------------------------------------------------- */
  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  const OVERRIDES_KEY = "rayla:spellOverrides:v1";
  const SLOTS_KEY = "rayla:slotsUsed:v1";
  const THEME_KEY = "rayla:theme:v1";
  const SESSION_KEY = "rayla:session:v1";

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  /* ================================================================
   * SESSION STATE (current HP, companion HP, wild shape uses, money,
   * active buffs, conditions, notes) — all local-storage only, never
   * written back to /data.
   * ================================================================ */
  function readSession() {
    const s = readStore(SESSION_KEY, {});
    return {
      currentHP: s.currentHP != null ? s.currentHP : CHARACTER.hp.total,
      companionHP: s.companionHP != null ? s.companionHP : CHARACTER.animalCompanion.hp,
      wildShapeUsed: Array.isArray(s.wildShapeUsed) && s.wildShapeUsed.length === 4 ? s.wildShapeUsed : [false, false, false, false],
      money: s.money || Object.assign({}, CHARACTER.money),
      activeBuffs: Array.isArray(s.activeBuffs) ? s.activeBuffs : [],
      conditions: s.conditions || "",
      notes: s.notes || "",
      spellstaffContents: s.spellstaffContents || "",
    };
  }
  function writeSession(patch) {
    const current = readStore(SESSION_KEY, {});
    writeStore(SESSION_KEY, Object.assign({}, current, patch));
  }

  /* ---------------------------------------------------------------- *
   * Active-buff bonus math (D&D 3.5 stacking: same bonus type to the
   * same thing doesn't stack — only the higher counts; different
   * types do stack).
   * ---------------------------------------------------------------- */
  function getBuffTotals() {
    const activeIds = readSession().activeBuffs;
    const groups = {};
    (typeof BUFF_LIBRARY !== "undefined" ? BUFF_LIBRARY : []).forEach((b) => {
      if (activeIds.indexOf(b.id) === -1) return;
      b.effects.forEach((e) => {
        let key = null;
        if (e.target === "ability") key = `ability:${e.ability}:${e.bonusType}`;
        else if (e.target === "ac") key = `ac:${e.component}:${e.bonusType}`;
        else if (e.target === "save") key = `save:${e.save}:${e.bonusType}`;
        else if (e.target === "speed") key = `speed:${e.bonusType}`;
        if (!key) return;
        groups[key] = Math.max(groups[key] || 0, e.amount);
      });
    });
    const totals = { abilities: {}, ac: { natural: 0, deflection: 0, armor: 0 }, saves: { fort: 0, reflex: 0, will: 0 }, speed: 0 };
    Object.keys(groups).forEach((key) => {
      const parts = key.split(":");
      const kind = parts[0], a = parts[1];
      const amt = groups[key];
      if (kind === "ability") totals.abilities[a] = (totals.abilities[a] || 0) + amt;
      else if (kind === "ac") totals.ac[a] = (totals.ac[a] || 0) + amt;
      else if (kind === "save") {
        if (a === "all") { totals.saves.fort += amt; totals.saves.reflex += amt; totals.saves.will += amt; }
        else totals.saves[a] = (totals.saves[a] || 0) + amt;
      } else if (kind === "speed") totals.speed += amt;
    });
    return totals;
  }

  function getEffectiveAbilities(buffTotals) {
    const eff = {};
    Object.entries(CHARACTER.abilities).forEach(([name, a]) => {
      const bonus = buffTotals.abilities[name] || 0;
      const score = a.score + bonus;
      eff[name] = { score, mod: Math.floor((score - 10) / 2), bonus };
    });
    return eff;
  }

  function getEffectiveAC(buffTotals) {
    const c = CHARACTER;
    // "Armor" type bonuses don't stack with worn armor — only the higher counts.
    const armor = Math.max(c.ac.armor, buffTotals.ac.armor);
    const natural = c.ac.natural + buffTotals.ac.natural;
    const deflection = buffTotals.ac.deflection;
    const total = 10 + armor + c.ac.shield + c.ac.dex + c.ac.size + natural + deflection + c.ac.misc;
    const touch = 10 + c.ac.dex + c.ac.size + deflection + c.ac.misc;
    const flatFooted = total - c.ac.dex;
    return { total, touch, flatFooted, armor, natural, deflection };
  }

  function getEffectiveSaves(buffTotals, eff) {
    const c = CHARACTER;
    function calc(save, abilityKey) {
      const base = c.saves[save].base;
      const abilityMod = eff[abilityKey].mod;
      const resist = buffTotals.saves[save] || 0;
      return { base, abilityMod, resist, total: base + abilityMod + resist };
    }
    return { fort: calc("fort", "CON"), reflex: calc("reflex", "DEX"), will: calc("will", "WIS") };
  }

  // A Constitution change retroactively adjusts hit points by (new mod -
  // base mod) per Hit Die (PH84) — Rayla's Hit Dice count is baked into
  // her "13d8" hitDice string, so we read the level from that rather
  // than duplicating it in the data file.
  function getEffectiveMaxHP(abilities) {
    const level = parseInt(CHARACTER.hp.hitDice, 10) || 1;
    const conDelta = abilities.CON.mod - CHARACTER.abilities.CON.mod;
    return CHARACTER.hp.total + conDelta * level;
  }

  function getEffectiveStats() {
    const buffTotals = getBuffTotals();
    const abilities = getEffectiveAbilities(buffTotals);
    return {
      buffTotals,
      abilities,
      ac: getEffectiveAC(buffTotals),
      saves: getEffectiveSaves(buffTotals, abilities),
      speed: CHARACTER.speed.value + buffTotals.speed,
      maxHP: getEffectiveMaxHP(abilities),
    };
  }

  /* ================================================================
   * THEME TOGGLE (e-ink mode)
   * ================================================================ */
  function setupTheme() {
    const btn = $("#themeToggle");
    if (!btn) return;
    const label = $(".theme-toggle__label", btn);
    const icon = $(".theme-toggle__icon", btn);

    function apply(isEink) {
      document.documentElement.setAttribute("data-theme", isEink ? "eink" : "default");
      btn.setAttribute("aria-pressed", String(isEink));
      label.textContent = isEink ? "E-ink mode: on" : "E-ink mode";
      icon.textContent = isEink ? "☀️" : "📖";
    }

    apply(document.documentElement.getAttribute("data-theme") === "eink");

    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") !== "eink";
      apply(next);
      try { localStorage.setItem(THEME_KEY, next ? "eink" : "default"); } catch (e) { /* ignore */ }
    });

    const printBtn = $("#printBtn");
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    setupPrintExpand();
  }

  /* ---------------------------------------------------------------- *
   * Modern Chromium renders a closed <details> element's content
   * through an internal content-visibility mechanism that a plain CSS
   * "display: block !important" override can't defeat. So instead of
   * fighting that in CSS, actually open the feats/class-features
   * <details> right before printing (and put them back after), which
   * uses the browser's real mechanism for revealing them.
   * ---------------------------------------------------------------- */
  function setupPrintExpand() {
    let openedByUs = [];
    window.addEventListener("beforeprint", () => {
      openedByUs = Array.from(document.querySelectorAll(".feat-item:not([open])"));
      openedByUs.forEach((d) => d.setAttribute("open", ""));
    });
    window.addEventListener("afterprint", () => {
      openedByUs.forEach((d) => d.removeAttribute("open"));
      openedByUs = [];
    });
  }

  /* ================================================================
   * SESSION TRACKER
   * ================================================================ */
  function refreshAfterSessionChange() {
    renderOverview();
    renderAbilities();
    renderCombat();
    renderSkills();
    renderHpPanel();
    renderSpells();
  }

  function hpTrackerPanel(opts) {
    // opts: { title, max, sub, current, onChange }
    const panel = el("div", {}, [el("h3", {}, [opts.title])]);
    const display = el("div", { class: "hp-tracker__current" }, [String(opts.current)]);
    const input = el("input", {
      type: "number", class: "hp-tracker__input", value: String(opts.current),
      "aria-label": `Current ${opts.title}`,
      onchange: (e) => {
        const v = clamp(parseInt(e.target.value, 10) || 0, -opts.max, opts.max);
        e.target.value = String(v);
        display.textContent = String(v);
        opts.onChange(v);
      },
    });
    const step = (delta) => () => {
      const v = clamp((parseInt(input.value, 10) || 0) + delta, -opts.max, opts.max);
      input.value = String(v);
      display.textContent = String(v);
      opts.onChange(v);
    };
    panel.appendChild(el("div", { class: "hp-tracker" }, [
      el("div", { class: "hp-tracker__btns" }, [
        el("button", { type: "button", class: "hp-btn", onclick: step(-5) }, ["−5"]),
        el("button", { type: "button", class: "hp-btn", onclick: step(-1) }, ["−1"]),
      ]),
      input,
      el("span", { class: "hp-tracker__max" }, [`/ ${opts.max} max`]),
      el("div", { class: "hp-tracker__btns" }, [
        el("button", { type: "button", class: "hp-btn", onclick: step(1) }, ["+1"]),
        el("button", { type: "button", class: "hp-btn", onclick: step(5) }, ["+5"]),
      ]),
    ]));
    if (opts.sub) panel.appendChild(el("p", { class: "session-panel__sub" }, [opts.sub]));
    panel.appendChild(el("button", {
      type: "button", class: "session-reset",
      onclick: () => { input.value = String(opts.max); display.textContent = String(opts.max); opts.onChange(opts.max); },
    }, ["Full heal / reset to max"]));
    return panel;
  }

  function renderHpPanel() {
    const session = readSession();
    const stats = getEffectiveStats();
    const conDelta = stats.maxHP - CHARACTER.hp.total;
    const panel = $("#hpPanel");
    panel.innerHTML = "";
    panel.appendChild(hpTrackerPanel({
      title: "Rayla's Hit Points",
      max: stats.maxHP,
      current: session.currentHP,
      sub: CHARACTER.hp.hitDice + (conDelta ? ` — max is ${modStr(conDelta)} from buffed Constitution (base ${CHARACTER.hp.total})` : ""),
      onChange: (v) => { writeSession({ currentHP: v }); renderOverview(); },
    }));
  }

  function renderCompanionHpPanel() {
    const session = readSession();
    const panel = $("#companionHpPanel");
    panel.innerHTML = "";
    panel.appendChild(hpTrackerPanel({
      title: `${CHARACTER.animalCompanion.name}'s Hit Points`,
      max: CHARACTER.animalCompanion.hp,
      current: session.companionHP,
      onChange: (v) => { writeSession({ companionHP: v }); },
    }));
  }

  function renderWildshapeUsesPanel() {
    const session = readSession();
    const panel = $("#wildshapeUsesPanel");
    panel.innerHTML = "";
    panel.appendChild(el("h3", {}, ["Wild Shape Uses Today"]));
    const usedCount = session.wildShapeUsed.filter(Boolean).length;
    const boxesWrap = el("div", { class: "slot-boxes" }, [
      el("span", { class: "slot-count" }, [`${usedCount}/4`]),
    ]);
    session.wildShapeUsed.forEach((used, i) => {
      boxesWrap.appendChild(el("button", {
        type: "button",
        class: "slot-box" + (used ? " used" : ""),
        "aria-label": `Wild shape use ${i + 1} ${used ? "used" : "unused"}`,
        onclick: () => {
          const s = readSession();
          const arr = s.wildShapeUsed.slice();
          arr[i] = !arr[i];
          writeSession({ wildShapeUsed: arr });
          renderWildshapeUsesPanel();
        },
      }));
    });
    boxesWrap.appendChild(el("button", {
      type: "button", class: "slot-reset",
      onclick: () => { writeSession({ wildShapeUsed: [false, false, false, false] }); renderWildshapeUsesPanel(); },
    }, ["reset"]));
    panel.appendChild(boxesWrap);
    panel.appendChild(el("p", { class: "session-panel__sub" }, ["4/day — Tiny to Large, and Plant."]));
  }

  function renderMoneyTrackerPanel() {
    const session = readSession();
    const panel = $("#moneyTrackerPanel");
    panel.innerHTML = "";
    panel.appendChild(el("h3", {}, ["Money"]));
    const grid = el("div", { class: "money-grid" });
    ["pp", "gp", "sp", "cp"].forEach((coin) => {
      const input = el("input", {
        type: "number", class: "money-input", value: String(session.money[coin]),
        "aria-label": coin.toUpperCase(),
        onchange: (e) => {
          const v = Math.max(0, parseInt(e.target.value, 10) || 0);
          e.target.value = String(v);
          const s = readSession();
          writeSession({ money: Object.assign({}, s.money, { [coin]: v }) });
        },
      });
      grid.appendChild(el("label", { class: "money-field" }, [
        el("span", {}, [coin.toUpperCase()]),
        input,
      ]));
    });
    panel.appendChild(grid);
    panel.appendChild(el("button", {
      type: "button", class: "session-reset",
      onclick: () => { writeSession({ money: Object.assign({}, CHARACTER.money) }); renderMoneyTrackerPanel(); },
    }, ["Reset to sheet"]));
  }

  function renderBuffsPanel() {
    const session = readSession();
    const panel = $("#buffsPanel");
    panel.innerHTML = "";
    panel.appendChild(el("h3", {}, ["Active Buffs"]));
    panel.appendChild(el("p", { class: "section__note" }, ["Toggle a spell on while it's in effect — Ability Scores, AC, Saves, and Speed above update live. Same-type bonuses don't stack (3.5 rules); different types do."]));
    const list = el("div", { class: "buff-list" });
    (typeof BUFF_LIBRARY !== "undefined" ? BUFF_LIBRARY : []).forEach((b) => {
      const active = session.activeBuffs.indexOf(b.id) !== -1;
      const id = `buff-${b.id}`;
      const checkbox = el("input", {
        type: "checkbox", id, class: "buff-check",
        onchange: (e) => {
          const s = readSession();
          const set = s.activeBuffs.slice();
          const idx = set.indexOf(b.id);
          if (e.target.checked && idx === -1) set.push(b.id);
          else if (!e.target.checked && idx !== -1) set.splice(idx, 1);
          writeSession({ activeBuffs: set });
          refreshAfterSessionChange();
        },
      });
      checkbox.checked = active;
      list.appendChild(el("label", { class: "buff-item" + (active ? " is-active" : ""), for: id }, [
        checkbox,
        el("span", { class: "buff-item__body" }, [
          el("span", { class: "buff-item__name" }, [b.name]),
          el("span", { class: "buff-item__note" }, [b.note]),
        ]),
      ]));
    });
    panel.appendChild(list);
  }

  function renderConditionsPanel() {
    const session = readSession();
    const panel = $("#conditionsPanel");
    panel.innerHTML = "";
    panel.appendChild(el("h3", {}, ["Other Conditions"]));
    panel.appendChild(el("p", { class: "session-panel__sub" }, ["Anything not covered above — shaken, prone, grappled, an ally's buff, whatever's live right now."]));
    panel.appendChild(el("textarea", {
      class: "session-textarea session-textarea--small",
      rows: "3",
      placeholder: "e.g. Shaken (2 rounds), standing in difficult terrain…",
      oninput: (e) => writeSession({ conditions: e.target.value }),
    }, [session.conditions]));
  }

  function renderNotesPanel() {
    const session = readSession();
    const panel = $("#notesPanel");
    panel.innerHTML = "";
    panel.appendChild(el("h3", {}, ["Session Notes"]));
    panel.appendChild(el("textarea", {
      class: "session-textarea",
      rows: "3",
      placeholder: "Scratch notes for this session— loot, NPC names, plot threads…",
      oninput: (e) => writeSession({ notes: e.target.value }),
    }, [session.notes]));
  }

  function renderSession() {
    renderHpPanel();
    renderCompanionHpPanel();
    renderWildshapeUsesPanel();
    renderMoneyTrackerPanel();
    renderBuffsPanel();
    renderConditionsPanel();
    renderNotesPanel();
  }

  /* ================================================================
   * HERO / OVERVIEW
   * ================================================================ */
  function renderOverview() {
    const c = CHARACTER;
    const session = readSession();
    const stats = getEffectiveStats();
    $("#f-player").textContent = c.player;
    $("#f-size").textContent = c.size;
    $("#f-age").textContent = c.age;
    $("#f-height").textContent = c.height;
    $("#f-weight").textContent = c.weight;
    $("#f-eyes").textContent = c.eyes;
    $("#f-hair").textContent = c.hair;
    $("#f-languages").textContent = c.languages.join(", ");

    const speedNote = stats.speed !== c.speed.value ? `base ${c.speed.value} + buffs` : "base 30";
    const hpSub = stats.maxHP !== c.hp.total ? `${c.hp.hitDice}, base max ${c.hp.total}` : c.hp.hitDice;
    const vitals = [
      { label: "Hit Points", value: `${session.currentHP} / ${stats.maxHP}`, sub: hpSub },
      { label: "Armor Class", value: stats.ac.total, sub: `touch ${stats.ac.touch} / flat ${stats.ac.flatFooted}` },
      { label: "Speed", value: `${stats.speed} ft.`, sub: speedNote },
      { label: "Initiative", value: modStr(c.initiative), sub: "" },
      { label: "Base Attack", value: c.bab, sub: `grapple ${c.grapple}` },
    ];
    const strip = $("#vitalsStrip");
    strip.innerHTML = "";
    vitals.forEach((v) => {
      strip.appendChild(el("div", { class: "vital" }, [
        el("div", { class: "vital__label" }, [v.label]),
        el("div", { class: "vital__value" }, [v.value, v.sub ? el("small", {}, [" " + v.sub]) : null]),
      ]));
    });
  }

  /* ================================================================
   * ABILITY SCORES
   * ================================================================ */
  function renderAbilities() {
    const stats = getEffectiveStats();
    const grid = $("#abilityGrid");
    grid.innerHTML = "";
    Object.entries(CHARACTER.abilities).forEach(([name]) => {
      const eff = stats.abilities[name];
      grid.appendChild(el("div", { class: "ability-card" + (eff.bonus ? " is-buffed" : "") }, [
        el("div", { class: "ability-card__name" }, [name]),
        el("div", { class: "ability-card__score" }, [String(eff.score)]),
        el("div", { class: "ability-card__mod" }, [modStr(eff.mod)]),
        eff.bonus ? el("div", { class: "ability-card__buff" }, [`${modStr(eff.bonus)} buff`]) : null,
      ]));
    });
  }

  /* ================================================================
   * COMBAT
   * ================================================================ */
  function renderCombat() {
    const c = CHARACTER;
    const stats = getEffectiveStats();
    const ac = stats.ac;
    const saves = stats.saves;

    const acPanel = $("#acPanel");
    acPanel.innerHTML = "";
    acPanel.appendChild(el("h3", {}, ["Armor Class"]));
    acPanel.appendChild(el("div", { class: "kv-list" }, [
      row("Total", `${ac.total} (flat ${ac.flatFooted}, touch ${ac.touch})`),
      row("Base + Armor + Dex", `10 + ${ac.armor} + ${c.ac.dex}`),
      row("Armor worn", `${c.armorWorn.name} (${c.armorWorn.type})`),
      ac.natural ? row("Natural armor (buffed)", modStr(ac.natural)) : null,
      ac.deflection ? row("Deflection (buffed)", modStr(ac.deflection)) : null,
      row("Max Dex bonus", modStr(c.armorWorn.maxDex)),
      row("Armor check penalty", modStr(c.armorWorn.checkPenalty)),
      row("Arcane spell failure", `${c.armorWorn.spellFailure}%`),
    ]));

    const savesPanel = $("#savesPanel");
    savesPanel.innerHTML = "";
    savesPanel.appendChild(el("h3", {}, ["Saving Throws"]));
    savesPanel.appendChild(el("div", { class: "kv-list" }, [
      row("Fortitude (Con)", `${modStr(saves.fort.total)}  (${saves.fort.base} base ${modStr(saves.fort.abilityMod)}${saves.fort.resist ? ` ${modStr(saves.fort.resist)} resist` : ""})`),
      row("Reflex (Dex)", `${modStr(saves.reflex.total)}  (${saves.reflex.base} base ${modStr(saves.reflex.abilityMod)}${saves.reflex.resist ? ` ${modStr(saves.reflex.resist)} resist` : ""})`),
      row("Will (Wis)", `${modStr(saves.will.total)}  (${saves.will.base} base ${modStr(saves.will.abilityMod)}${saves.will.resist ? ` ${modStr(saves.will.resist)} resist` : ""})`),
      row("Melee / Ranged", `${c.melee} / ${c.ranged}`),
    ]));

    const attacksPanel = $("#attacksPanel");
    attacksPanel.innerHTML = "";
    attacksPanel.appendChild(el("h3", {}, ["Attacks"]));
    c.attacks.forEach((a) => {
      attacksPanel.appendChild(el("div", { class: "attack-item" }, [
        el("div", { class: "attack-item__name" }, [a.name]),
        el("div", { class: "attack-item__stats" }, [`${a.bonus} melee \u2014 ${a.damage} (${a.critical}) ${a.type}, ${a.weight}`]),
      ]));
    });

    function row(label, value) {
      return el("div", { class: "kv-row" }, [el("span", {}, [label]), el("span", {}, [value])]);
    }
  }

  /* ================================================================
   * SKILLS
   * ================================================================ */
  // Recomputes each skill's ability modifier (and total) against the
  // currently active buffs \u2014 ranks and misc bonuses never change mid-session.
  function getEffectiveSkills(stats) {
    return CHARACTER.skills.map((s) => {
      const eff = stats.abilities[s.ability.toUpperCase()];
      const abilityMod = eff ? eff.mod : s.abilityMod;
      const total = s.ranks + abilityMod + s.misc;
      return Object.assign({}, s, { abilityMod, total, buffed: !!(eff && eff.bonus) });
    });
  }

  function skillTable(skills) {
    const table = el("table", {}, [
      el("thead", {}, [el("tr", {}, [
        el("th", {}, ["Skill"]), el("th", {}, ["Key"]),
        el("th", { class: "num" }, ["Total"]), el("th", { class: "num" }, ["Ranks"]),
        el("th", { class: "num" }, ["Ability"]), el("th", { class: "num" }, ["Misc"]),
      ])]),
    ]);
    const tbody = el("tbody");
    skills.forEach((s) => {
      tbody.appendChild(el("tr", { class: s.buffed ? "is-buffed" : "" }, [
        el("td", {}, [s.name, s.buffed ? el("small", { class: "buffed-tag" }, [" (buffed)"]) : null]),
        el("td", {}, [s.ability]),
        el("td", { class: "num" }, [modStr(s.total)]),
        el("td", { class: "num" }, [String(s.ranks)]),
        el("td", { class: "num" }, [modStr(s.abilityMod)]),
        el("td", { class: "num" }, [s.misc ? modStr(s.misc) : "\u2014"]),
      ]));
    });
    table.appendChild(tbody);
    return table;
  }

  function renderSkills() {
    const stats = getEffectiveStats();
    const all = getEffectiveSkills(stats).sort((a, b) => b.total - a.total);
    const trained = all.filter((s) => s.ranks > 0);
    $("#skillsTrained").innerHTML = "";
    $("#skillsTrained").appendChild(skillTable(trained));
    $("#skillsAllCount").textContent = all.length;
    $("#skillsAll").innerHTML = "";
    $("#skillsAll").appendChild(skillTable(all));
  }

  /* ================================================================
   * FEATS / QUALITIES / FEATURES
   * ================================================================ */
  function fillTagList(id, items) {
    const list = $(id);
    list.innerHTML = "";
    items.forEach((item) => list.appendChild(el("li", {}, [item])));
  }
  function fillFeatList(id, feats) {
    const list = $(id);
    list.innerHTML = "";
    feats.forEach((feat) => {
      const details = el("details", { class: "feat-item" }, [
        el("summary", { class: "feat-item__summary" }, [feat.name]),
        el("p", { class: "feat-item__desc" }, [feat.description]),
      ]);
      list.appendChild(el("li", { class: "feat-item-wrap" }, [details]));
    });
  }
  function renderFeats() {
    fillFeatList("#featsList", CHARACTER.feats);
    fillTagList("#qualitiesList", CHARACTER.specialQualities);
    fillFeatList("#featuresList", CHARACTER.classFeatures);
  }

  /* ================================================================
   * EQUIPMENT
   * ================================================================ */
  function renderEquipment() {
    const wrap = $("#equipmentTable");
    wrap.innerHTML = "";
    wrap.className = "equip-table";
    const table = el("table", {}, [
      el("thead", {}, [el("tr", {}, [
        el("th", {}, ["Item"]), el("th", {}, ["Qty"]), el("th", {}, ["Cost"]), el("th", {}, ["Weight"]),
      ])]),
    ]);
    const tbody = el("tbody");
    CHARACTER.equipment.forEach((it) => {
      tbody.appendChild(el("tr", {}, [
        el("td", {}, [it.name, it.magic ? el("span", { class: "magic-note" }, [it.magic]) : null]),
        el("td", {}, [String(it.qty)]),
        el("td", {}, [it.cost || "\u2014"]),
        el("td", {}, [it.weight || "\u2014"]),
      ]));
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    const money = $("#moneyPanel");
    money.innerHTML = "";
    money.appendChild(el("h3", {}, ["Money & Load"]));
    const m = CHARACTER.money;
    money.appendChild(el("div", { class: "kv-list" }, [
      kv("Platinum", m.pp), kv("Gold", m.gp), kv("Silver", m.sp), kv("Copper", m.cp),
      kv("Weight carried", CHARACTER.weightCarried),
    ]));
    function kv(label, value) {
      return el("div", { class: "kv-row" }, [el("span", {}, [label]), el("span", {}, [String(value)])]);
    }
  }

  /* ================================================================
   * ANIMAL COMPANION
   * ================================================================ */
  function renderCompanion() {
    const ac = CHARACTER.animalCompanion;
    const card = $("#companionCard");
    card.innerHTML = "";
    const wrap = el("div", { class: "companion-card" }, [
      el("h3", { class: "companion-card__name" }, [ac.name]),
      el("p", { class: "companion-card__note" }, [ac.note]),
    ]);

    const abilities = el("div", { class: "companion-abilities" });
    Object.entries(ac.abilities).forEach(([k, v]) => {
      abilities.appendChild(el("div", {}, [el("div", { class: "lab" }, [k]), el("div", { class: "val" }, [String(v)])]));
    });
    wrap.appendChild(abilities);

    wrap.appendChild(el("div", { class: "kv-list" }, [
      kv("HP / Speed / Init", `${ac.hp} hp, ${ac.speed} ft., init ${modStr(ac.initiative)}`),
      kv("AC", `${ac.ac.base} (flat ${ac.ac.flatFooted}, touch ${ac.ac.touch})`),
      kv("Saves", `Fort ${modStr(ac.saves.fort)}, Ref ${modStr(ac.saves.reflex)}, Will ${modStr(ac.saves.will)}`),
      kv("Attacks", ac.attacks.map((a) => `${a.name} ${a.bonus} (${a.damage}, ${a.critical})`).join("; ")),
      kv("Feats", ac.feats.join(", ")),
      kv("Skills", ac.skills),
      kv("Features", ac.features.join(", ")),
      kv("Special", ac.special.join(", ")),
    ]));

    card.appendChild(wrap);
    function kv(label, value) {
      return el("div", { class: "kv-row" }, [el("span", {}, [label]), el("span", {}, [value])]);
    }
  }

  /* ================================================================
   * SPELLS
   * ================================================================ */
  function spellId(level, name) { return `${level}:${name}`; }

  function getEffectiveLevel(levelKey) {
    const raw = SPELL_DATA[levelKey];
    const overrides = readStore(OVERRIDES_KEY, {});
    const prepared = [];
    const alternatives = [];

    raw.prepared.forEach((s) => {
      if (overrides[spellId(levelKey, s.name)] === "alternative") alternatives.push(s);
      else prepared.push(s);
    });
    raw.alternatives.forEach((s) => {
      if (overrides[spellId(levelKey, s.name)] === "prepared") prepared.push(Object.assign({ qty: 1 }, s));
      else alternatives.push(s);
    });
    return { prepared, alternatives, perDay: raw.perDay, label: raw.label };
  }

  function toggleSpellPrep(levelKey, name, makePrepared) {
    const overrides = readStore(OVERRIDES_KEY, {});
    const id = spellId(levelKey, name);
    const raw = SPELL_DATA[levelKey];
    const originallyPrepared = raw.prepared.some((s) => s.name === name);
    const wantsOverride = makePrepared !== originallyPrepared;
    if (wantsOverride) overrides[id] = makePrepared ? "prepared" : "alternative";
    else delete overrides[id];
    writeStore(OVERRIDES_KEY, overrides);
    renderSpells();
  }

  function spellTableEl(levelKey, spells, opts) {
    const isAlt = !!opts.alt;
    const wisDelta = opts.wisDelta || 0;
    const table = el("table", { class: "spell-table" + (isAlt ? " is-alt" : "") }, [
      el("thead", {}, [el("tr", {}, [
        el("th", {}, ["Spell"]), el("th", {}, ["Qty"]), el("th", {}, ["DC"]),
        el("th", {}, ["Save"]), el("th", {}, ["Cast Time"]), el("th", {}, ["Duration"]),
        el("th", {}, ["Range"]), el("th", {}, ["Effect"]),
      ])]),
    ]);
    const tbody = el("tbody");
    spells.forEach((s) => {
      const btn = el("button", {
        class: "prep-btn",
        title: isAlt ? "Mark as prepared" : "Move to alternatives",
        onclick: () => toggleSpellPrep(levelKey, s.name, isAlt),
      }, [isAlt ? "+ prepare" : "\u2212 unprepare"]);

      // Every spell's printed DC already bakes in her base Wisdom mod (and
      // any fixed bonus like Spell Focus), so a Wisdom buff just shifts it
      // by the same delta \u2014 no per-spell school/ability data needed.
      const dc = s.dc + wisDelta;
      const effectCell = el("td", {}, [s.effect]);
      if (s.name === "Spellstaff") {
        const session = readSession();
        effectCell.appendChild(el("div", { class: "spellstaff-field" }, [
          el("label", {}, ["Currently holds:"]),
          el("input", {
            type: "text", class: "spellstaff-input",
            value: session.spellstaffContents,
            placeholder: "e.g. Flame Strike",
            oninput: (e) => writeSession({ spellstaffContents: e.target.value }),
          }),
        ]));
      }
      tbody.appendChild(el("tr", {}, [
        el("td", {}, [s.name, btn]),
        el("td", { class: "num" + (s.qty > 1 ? " qty-multi" : "") }, [isAlt ? "\u2014" : String(s.qty)]),
        el("td", { class: "num" + (wisDelta ? " is-buffed" : "") }, [
          String(dc),
          wisDelta ? el("small", { class: "dc-delta" }, [` (${modStr(wisDelta)})`]) : null,
        ]),
        el("td", {}, [s.save]),
        el("td", {}, [s.cast]),
        el("td", {}, [s.duration]),
        el("td", {}, [s.range]),
        effectCell,
      ]));
    });
    table.appendChild(tbody);
    return el("div", { class: "spell-table-wrap" }, [table]);
  }

  function renderSpellSummary() {
    const wrap = $("#spellSummary");
    wrap.innerHTML = "";
    const slots = readStore(SLOTS_KEY, {});

    const table = el("table", {}, [
      el("thead", {}, [el("tr", {}, [
        el("th", {}, ["Spell Level"]), el("th", {}, ["Per Day"]), el("th", {}, ["Prepared"]),
        el("th", {}, ["Slots used today"]),
      ])]),
    ]);
    const tbody = el("tbody");

    Object.keys(SPELL_DATA).forEach((levelKey) => {
      const lvl = getEffectiveLevel(levelKey);
      const used = slots[levelKey] || new Array(lvl.perDay).fill(false);
      const usedCount = used.filter(Boolean).length;

      const boxesWrap = el("span", { class: "slot-boxes" });
      boxesWrap.appendChild(el("span", { class: "slot-count" }, [`${usedCount}/${lvl.perDay}`]));
      for (let i = 0; i < lvl.perDay; i++) {
        const isUsed = !!used[i];
        boxesWrap.appendChild(el("button", {
          class: "slot-box" + (isUsed ? " used" : ""),
          "aria-label": `Slot ${i + 1} ${isUsed ? "used" : "unused"}`,
          onclick: () => {
            const s = readStore(SLOTS_KEY, {});
            const arr = s[levelKey] || new Array(lvl.perDay).fill(false);
            arr[i] = !arr[i];
            s[levelKey] = arr;
            writeStore(SLOTS_KEY, s);
            renderSpellSummary();
          },
        }));
      }
      boxesWrap.appendChild(el("button", {
        class: "slot-reset",
        onclick: () => {
          const s = readStore(SLOTS_KEY, {});
          s[levelKey] = new Array(lvl.perDay).fill(false);
          writeStore(SLOTS_KEY, s);
          renderSpellSummary();
        },
      }, ["reset"]));

      tbody.appendChild(el("tr", {}, [
        el("td", { class: "summary-row__level", style: `color: var(--lvl-${levelKey})` }, [lvl.label]),
        el("td", { class: "num" }, [String(lvl.perDay)]),
        el("td", { class: "num" }, [String(lvl.prepared.length)]),
        el("td", {}, [boxesWrap]),
      ]));
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    wrap.appendChild(el("p", { class: "summary-footnote" }, ["Click a box to tick off a casting; it's saved in this browser until you hit reset."]));
  }

  function renderSpellLevels() {
    const container = $("#spellLevels");
    container.innerHTML = "";
    const stats = getEffectiveStats();
    const wisDelta = stats.abilities.WIS.mod - CHARACTER.abilities.WIS.mod;

    Object.keys(SPELL_DATA).forEach((levelKey) => {
      const lvl = getEffectiveLevel(levelKey);
      const totalSlots = lvl.prepared.reduce((sum, s) => sum + (s.qty || 1), 0);

      const block = el("div", { class: "level-block", style: `--lvl-c: var(--lvl-${levelKey})` });
      block.appendChild(el("div", { class: "level-heading" }, [
        el("span", { class: "level-heading__title" }, [lvl.label]),
        el("span", { class: "level-heading__meta" }, [
          `${lvl.prepared.length} spell${lvl.prepared.length !== 1 ? "s" : ""} prepared (${totalSlots} slot${totalSlots !== 1 ? "s" : ""} of ${lvl.perDay}/day)`,
        ]),
      ]));

      block.appendChild(spellTableEl(levelKey, lvl.prepared, { alt: false, wisDelta }));

      if (lvl.alternatives.length) {
        const details = el("details", { class: "alt-toggle-wrap" });
        details.appendChild(el("summary", { class: "alt-toggle" }, [
          `Other options you know but haven't prepared (${lvl.alternatives.length})`,
        ]));
        details.appendChild(el("div", { class: "alt-table-wrap" }, [spellTableEl(levelKey, lvl.alternatives, { alt: true, wisDelta })]));
        block.appendChild(details);
      }

      container.appendChild(block);
    });
  }

  function renderSpells() {
    renderSpellSummary();
    renderSpellLevels();
  }

  /* ================================================================
   * WILD SHAPE
   * ================================================================ */
  function renderWildshape() {
    const list = $("#wildshapeList");
    list.innerHTML = "";

    WILDSHAPE_DATA.forEach((ws, idx) => {
      const details = el("details", { class: "ws-card", style: `--ws-c: ${ws.color}` });
      details.appendChild(el("summary", { class: "ws-card__summary" }, [
        el("span", { class: "ws-card__name" }, [ws.name]),
        el("span", { class: "ws-card__sub" }, [ws.subtitle]),
        el("span", { class: "ws-card__chevron" }, ["\u25B8"]),
      ]));

      const body = el("div", { class: "ws-card__body" });

      body.appendChild(el("div", { class: "ws-stat-row" }, [
        statRow("Hit Dice", ws.hitDice),
        statRow("AC", ws.ac),
        statRow("Saves", ws.saves),
        statRow("Speed", ws.speed),
      ]));

      const abilities = el("div", { class: "ws-abilities" });
      Object.entries(ws.abilities).forEach(([k, v]) => {
        abilities.appendChild(el("div", {}, [el("div", { class: "lab" }, [k]), el("div", { class: "val" }, [String(v)])]));
      });
      body.appendChild(abilities);

      body.appendChild(el("div", { class: "ws-stat-row" }, [
        statRow("Attack", ws.attack),
        ws.fullAttack ? statRow("Full Attack", ws.fullAttack) : null,
        ws.specialAttacks ? statRow("Special Attacks", ws.specialAttacks) : null,
        statRow("Special Qualities", ws.specialQualities),
        statRow("Feats", ws.feats),
        statRow("Skills", ws.skills),
      ]));

      if (ws.breathWeapon) {
        body.appendChild(el("div", { class: "ws-block" }, [
          el("h4", {}, ["Breath Weapon (Su)"]),
          el("p", {}, [ws.breathWeapon]),
        ]));
      }

      if (ws.abilitiesText && ws.abilitiesText.length) {
        const b = el("div", { class: "ws-block" }, [el("h4", {}, ["Special Ability Details"])]);
        ws.abilitiesText.forEach((a) => {
          b.appendChild(el("p", { class: "ws-ability-detail" }, [el("b", {}, [a.name + ": "]), a.desc]));
        });
        body.appendChild(b);
      }

      if (ws.notes) body.appendChild(el("p", { class: "ws-notes" }, [ws.notes]));
      body.appendChild(el("p", { class: "ws-source" }, ["Source: " + ws.source]));

      details.appendChild(body);
      if (idx === 0) details.setAttribute("open", "");
      list.appendChild(details);
    });

    function statRow(label, value) {
      if (!value) return null;
      return el("div", { class: "row" }, [el("span", { class: "lab" }, [label]), el("span", { class: "val" }, [value])]);
    }
  }

  /* ================================================================
   * NAV: mobile toggle + scroll-spy
   * ================================================================ */
  function setupNav() {
    const toggle = $("#navToggle");
    const nav = $("#sideNav");
    const scrim = $("#navScrim");
    const closeNav = () => { nav.classList.remove("open"); document.body.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); };
    const openNav = () => { nav.classList.add("open"); document.body.classList.add("nav-open"); toggle.setAttribute("aria-expanded", "true"); };
    toggle.addEventListener("click", () => (nav.classList.contains("open") ? closeNav() : openNav()));
    scrim.addEventListener("click", closeNav);
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

    const links = Array.from(document.querySelectorAll(".side-nav__list a"));
    const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.remove("active"));
          const link = links.find((a) => a.getAttribute("href") === "#" + entry.target.id);
          if (link) link.classList.add("active");
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      sections.forEach((s) => obs.observe(s));
    }
  }

  /* ================================================================
   * INIT
   * ================================================================ */
  function init() {
    setupTheme();
    renderSession();
    renderOverview();
    renderAbilities();
    renderCombat();
    renderSkills();
    renderFeats();
    renderEquipment();
    renderCompanion();
    renderSpells();
    renderWildshape();
    setupNav();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
