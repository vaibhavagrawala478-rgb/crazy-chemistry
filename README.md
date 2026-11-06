# Crazy Chemistry

A pixel chemistry lab in the browser. Mix, melt, shock and bottle 100+ elements, and unlock new compounds by mixing them.

- Falling-sand simulation with heat, phase changes, fire, explosions and electricity
- 114 elements, 17 metals, about 130 reactions
- A Codex of 36 discoverable compounds: alloys, precipitates, acids, explosives, plants
- Vial rack for storing and pouring chemicals
- 12 ready-made experiments

## Run

Open `index.html` in a browser. No install needed.

## Build

`index.html` is generated from `src/` (data, engine, UI, styles). After editing:

```
python build.py
```

## Font

The UI uses **04B_30** by Yuji Oshimoto (04.jp.org), which is freeware. It is embedded in `index.html` and kept in `src/04B_30.ttf`. See the font's own terms before using it commercially.

Controls: Space pause, `[` `]` brush size, T thermal view, H fume hood, C clear, X codex, M mute.
