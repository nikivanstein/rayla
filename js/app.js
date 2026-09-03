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
  }

  /* ================================================================
   * HERO / OVERVIEW
   * ================================================================ */
  function renderOverview() {
    const c = CHARACTER;
    $("#f-player").textContent = c.player;
    $("#f-size").textContent = c.size;
    $("#f-age").textContent = c.age;
    $("#f-height").textContent = c.height;
    $("#f-weight").textContent = c.weight;
    $("#f-eyes").textContent = c.eyes;
    $("#f-hair").textContent = c.hair;
    $("#f-languages").textContent = c.languages.join(", ");

    const vitals = [
      { label: "Hit Points", value: c.hp.total, sub: c.hp.hitDice },
      { label: "Armor Class", value: c.ac.total, sub: `touch ${c.ac.touch} / flat ${c.ac.flatFooted}` },
      { label: "Speed", value: `${c.speed.value} ft.`, sub: "base 30" },
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
    const grid = $("#abilityGrid");
    grid.innerHTML = "";
    Object.entries(CHARACTER.abilities).forEach(([name, a]) => {
      grid.appendChild(el("div", { class: "ability-card" }, [
        el("div", { class: "ability-card__name" }, [name]),
        el("div", { class: "ability-card__score" }, [String(a.score)]),
        el("div", { class: "ability-card__mod" }, [modStr(a.mod)]),
      ]));
    });
  }

  /* ================================================================
   * COMBAT
   * ================================================================ */
  function renderCombat() {
    const c = CHARACTER;

    const acPanel = $("#acPanel");
    acPanel.innerHTML = "";
    acPanel.appendChild(el("h3", {}, ["Armor Class"]));
    acPanel.appendChild(el("div", { class: "kv-list" }, [
      row("Total", `${c.ac.total} (flat ${c.ac.flatFooted}, touch ${c.ac.touch})`),
      row("Base + Armor + Dex", `10 + ${c.ac.armor} + ${c.ac.dex}`),
      row("Armor worn", `${c.armorWorn.name} (${c.armorWorn.type})`),
      row("Max Dex bonus", modStr(c.armorWorn.maxDex)),
      row("Armor check penalty", modStr(c.armorWorn.checkPenalty)),
      row("Arcane spell failure", `${c.armorWorn.spellFailure}%`),
    ]));

    const savesPanel = $("#savesPanel");
    savesPanel.innerHTML = "";
    savesPanel.appendChild(el("h3", {}, ["Saving Throws"]));
    savesPanel.appendChild(el("div", { class: "kv-list" }, [
      row("Fortitude (Con)", `${modStr(c.saves.fort.total)}  (${c.saves.fort.base} base ${modStr(c.saves.fort.abilityMod)})`),
      row("Reflex (Dex)", `${modStr(c.saves.reflex.total)}  (${c.saves.reflex.base} base ${modStr(c.saves.reflex.abilityMod)})`),
      row("Will (Wis)", `${modStr(c.saves.will.total)}  (${c.saves.will.base} base ${modStr(c.saves.will.abilityMod)})`),
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
      tbody.appendChild(el("tr", {}, [
        el("td", {}, [s.name]),
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
    const all = CHARACTER.skills.slice().sort((a, b) => b.total - a.total);
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
    fillTagList("#featuresList", CHARACTER.classFeatures);
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

      tbody.appendChild(el("tr", {}, [
        el("td", {}, [s.name, btn]),
        el("td", { class: "num" + (s.qty > 1 ? " qty-multi" : "") }, [isAlt ? "\u2014" : String(s.qty)]),
        el("td", { class: "num" }, [String(s.dc)]),
        el("td", {}, [s.save]),
        el("td", {}, [s.cast]),
        el("td", {}, [s.duration]),
        el("td", {}, [s.range]),
        el("td", {}, [s.effect]),
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

      block.appendChild(spellTableEl(levelKey, lvl.prepared, { alt: false }));

      if (lvl.alternatives.length) {
        const details = el("details", { class: "alt-toggle-wrap" });
        details.appendChild(el("summary", { class: "alt-toggle" }, [
          `Other options you know but haven't prepared (${lvl.alternatives.length})`,
        ]));
        details.appendChild(el("div", { class: "alt-table-wrap" }, [spellTableEl(levelKey, lvl.alternatives, { alt: true })]));
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
