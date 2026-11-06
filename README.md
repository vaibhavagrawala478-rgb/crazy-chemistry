# Crazy Chemistry

A pixel chemistry lab in the browser. Mix, melt, shock and bottle 100+ elements, and unlock new compounds by mixing them.

- Falling-sand simulation with heat, phase changes, fire, explosions and electricity
- 135 elements including 30 metals (alkali, alkaline earth, transition, post-transition) and 8 alloys, and about 190 reactions
- A CRAZY tab: nuke, black hole, antimatter, uranium meltdown, gray goo, chaos juice, philosopher's stone, cloner, fireworks, elephant toothpaste, mentos geysers, storm/acid/lava clouds, plasma, plus meteor strikes and a CHAOS mode that rains disasters on the lab
- Movie chemistry: Hollywood acid that dissolves vaults and floors but ignores glass, gold, water and plants; hair-trigger explosives that go off if they land or are tapped; a Serum Lab to brew custom serums (antidote, growth, repair, super strength, flight, invisibility, cryo, pyro, mutation)
- 188 plant species (Abelia to ZZ Plant) with their own look and growth habit: trees, shrubs, flowers, grasses, cacti, vines, crops
- Household and industrial chemicals: salt, baking soda, vinegar, bleach, lye, acids, ethanol, peroxide, chalk, Epsom salt, ammonia, acetone, methanol, toluene and more
- A Codex of 38 discoverable compounds and a Herbarium that tracks which plants you have grown
- Vial rack for storing and pouring chemicals
- 29 ready-made experiments, including an alkali metal race, a greenhouse, fireworks, a nuke and a black hole

## Run

Open `index.html` in a browser. No install needed.

## Build

`index.html` is generated from `src/` (elements, plants, colours, engine, UI, styles). After editing:

```
python build.py
```

## Font

The UI uses **04B_30** by Yuji Oshimoto (04.jp.org), which is freeware. It is embedded in `index.html` and kept in `src/04B_30.ttf`. See the font's own terms before using it commercially.

Controls: Space pause, `[` `]` brush size, T thermal view, H fume hood, C clear, X codex, M mute.
