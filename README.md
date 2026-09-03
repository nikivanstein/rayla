# Rayla \u2014 Character Sheet

An interactive character sheet, spellbook, and wild shape reference for
Rayla (Elf Druid 13, D&D 3.5), built as a static site with no build step.
Open `index.html` in a browser, or host it for free on GitHub Pages.

## Hosting it on GitHub Pages

1. Create a new GitHub repository (public, or private if you're on a
   paid plan) and push everything in this folder to it:

   ```bash
   git init
   git add .
   git commit -m "Rayla character sheet"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. On GitHub, go to **Settings \u2192 Pages**.
3. Under **Build and deployment \u2192 Source**, choose **Deploy from a
   branch**, pick the `main` branch and the `/ (root)` folder, then
   **Save**.
4. GitHub gives you a URL like
   `https://<your-username>.github.io/<repo-name>/` within a minute or
   two. Bookmark it \u2014 that's your live character sheet.

Any time you push a change (e.g. edit `data/spells.js`), the live page
updates automatically within a minute.

### Viewing it locally without GitHub

Double-clicking `index.html` works in most browsers. If your browser
blocks anything when opened directly from disk, run a tiny local
server from this folder instead and visit the printed address:

```bash
python3 -m http.server 8000        # then open http://localhost:8000
```

## How the site is put together

```
index.html       Page structure only \u2014 no character data lives here
css/style.css    All visual styling
js/app.js        Reads the data files and renders every section
data/
  character.js   Stats, skills, feats, equipment, animal companion
  spells.js      Prepared spells + known alternatives, per level
  wildshape.js   Wild shape / Dragon Wild Shape stat blocks
```

`app.js` builds the whole page from the three files in `data/` \u2014
nothing about a spell or a stat block is hard-coded in the HTML. That
means updating your character is a data edit, not a web-design task.

## Changing your prepared spells

Two ways to do this, depending on whether the change is for tonight's
session or permanent:

**On the page (quick, temporary by default):** every spell row has a
small button \u2014 `+ prepare` on spells you haven't prepared, or
`\u2212 unprepare` on ones you have. Clicking it moves the spell between
the two tables immediately. This is saved in your browser's
`localStorage`, so it'll still be there next time you open the page on
the same device/browser, but it won't show up for anyone else loading
the page, and clearing site data resets it back to whatever's in
`data/spells.js`.

**In the data file (permanent, for everyone who loads the page):**
open `data/spells.js`. Each spell level looks like this:

```js
1: {
  label: "Level 1",
  perDay: 6,
  prepared: [
    { name: "Entangle", qty: 1, dc: 15, save: "Reflex Partial",
      cast: "1 Action", duration: "1 min/lvl", range: "Long (400+40/lvl)",
      effect: "Grasses and vines grow to entwine everyone..." },
    // ...
  ],
  alternatives: [
    { name: "Faerie Fire", dc: 15, save: "None",
      cast: "1 Action", duration: "1 min/lvl (D)", range: "Long (400+40/lvl)",
      effect: "Outlines every creature in the area in light..." },
    // ...
  ],
},
```

- To **prepare** a spell that's currently an alternative: cut its
  object out of `alternatives` and paste it into `prepared`, adding a
  `qty` field (how many castings, usually `1`).
- To **unprepare** a spell: do the reverse \u2014 remove `qty` and move it
  back into `alternatives`.
- To **add a brand new spell** you've just learned: copy the shape of
  an existing entry into whichever array fits, filling in `dc`,
  `save`, `cast`, `duration`, `range`, and `effect`.
- `perDay` is your spell-slot maximum for that level \u2014 change it when
  you level up or gain bonus slots.

Save the file, refresh the page (or push to GitHub), and the summary
table, the per-level tables, and the slot counts all update
automatically \u2014 nothing else needs to change.

## Adding a wild shape form

Open `data/wildshape.js` and copy an existing creature object, then
edit its fields. A new entry shows up automatically as a new
collapsible card, in whatever order you place it in the array. The
`color` field is a hex color used for that card's accent \u2014 pick
something with enough contrast against a dark background (avoid very
dark colors; that's the one thing to watch for since the whole page
uses a dark theme).

## Tracking spell slots during a session

The **Slots Used Today** row in the spell summary table is a set of
tick-boxes, one per daily slot at that level. Click a box to mark a
casting used; click it again to undo. This is saved per-browser via
`localStorage`, so it persists if you close the tab mid-session, but
it does **not** reset automatically \u2014 hit the **reset** button next
to a level's boxes at the start of a new day (or after a long rest).

## Notes on the data

- Spell and wild-shape stats were sourced from the D&D 3.5 SRD and
  Rayla's original character sheet (a few non-core spells cite the
  Spell Compendium, Frostburn, and similar sourcebooks; page/source
  references are included at the end of each effect description).
- The Young Gold Dragon stat block is reconstructed from the two
  neighboring published age categories using the standard 3.5 dragon
  formulas (see its Notes in the Wild Shape section for how) since no
  single published source had that exact age category cleanly \u2014
  worth a quick sanity check against a physical Monster Manual if
  you have one.
- This is a personal reference tool, not affiliated with or endorsed
  by Wizards of the Coast.
