# Regular Division of the Plane

**Eight plates in impossible geometry.** A single-page site presented as a portfolio of engraved
plates by M.C. Escher, reimagined as a web designer — a Penrose staircase that closes on itself,
a verified-gapless `p4` tessellation, a print that contains the print that contains the print,
and a true `{6,4}` tiling of the hyperbolic plane you can travel through forever.

No libraries. No network requests. No images. Every stair, tile, tribar and disc is **computed**
in hand-written SVG and Canvas 2D.

---

## The one rule

> **Every illusion is constructed geometry, never a picture of an illusion.**

Escher's actual prints are still in copyright (© The M.C. Escher heritage, Baarn) and copying them
would have missed the point anyway. Nothing here is traced, embedded, or reproduced. The plates are
new work in his *grammar*: the mathematics is implemented, and where it can be proven, it is
proven by a test.

---

## The plates

| # | Plate | The lie | The construction |
|---|---|---|---|
| I | **Ascending and Descending** | A stair that rises at every step and returns to its own first tread | Four flights on a rectangular plan. Three rise `+RISE`, the fourth drops `−3·RISE`. `Σ lift = 0`, so the walk closes pixel-exact; the accumulated height hides in the one steep flight behind the tower silhouette |
| II | **Regular Division of the Plane** | A square lattice becomes lizards, then birds, and never opens a gap | `p4` rotational mating (Heesch type `C4C4C4C4`). One edge arc is authored; the other three are *derived* by 90° rotation about shared corners, so gaplessness is structural rather than eyeballed |
| III | **Relativity** | One house, three gravities, nobody wrong | Three world axes projecting 120° apart. Choosing a frame applies one planar rotation to the stage — nothing is counter-rotated, which is exactly why your floor becomes someone else's wall |
| IV | **Print Gallery** | A gallery containing the print that contains the gallery | Scale factor `k = 1/3`, camera scaling about the **true fixed point** `c/(1−k) = (750, 390)` — not the frame centre. Folding `zoom % 1` at the recursion period makes the loop pixel-identical (congruence error ~4×10⁻¹³) |
| V | **Day and Night** | The white flock is the black flock's empty space | Mated cell edges (`bottom = −reverse(top)`) so figure and ground are literally the same shape. This plate carries the press: its switch inverts the entire site |
| VI | **Drawing Hands** | Neither hand is the author | The left panel is the module's own source, read at runtime via `Function.prototype.toString`. The right panel renders the plate that renders it, hard-stopped at a depth limit |
| VII | **Waterfall** | Water falls forever and returns uphill | Three unit vectors 120° apart where `e₀ + e₁ + e₂ = 0` — the centreline closes on screen while the 3D path never does. Cyclic occlusion `A→B→C→A` via computed joint polygons; every corner alone is honest carpentry |
| VIII | **Circle Limit** | Infinity, held in a finite frame | A true `{6,4}` Poincaré disk (`1/6 + 1/4 < 1/2`). Möbius isometries verified `\|a\|² − \|c\|² = 1`; geodesics drawn as real circular arcs orthogonal to the boundary |

### Paradoxical navigation

- **Möbius band nav** — the plate diametrically opposite the one you're reading hangs upside down.
  Signed cyclic distance drives `rotateX`, so the band has neither a first entry nor a last.
- **Penrose scroll meter** — climbs steps as you descend the page, and reads `∞ / ∞` at every height.
- **Ascend / Descend** — two buttons in the colophon. Both open on the same landing.
- **Day / Night** — Plate V's switch inverts every colour token on the page; the flock swaps
  light for dark, the towns invert, the whole press changes state.

---

## The proofs

The interesting claims are tested rather than asserted. `node tests/<file>` — no test runner, no deps.

```bash
node tests/gapless-test.js         # Plate II: tiles mate exactly; no gaps at any morph value
node tests/hyperbolic-math.test.js # Plate VIII: Möbius transforms + the congruence proof
node tests/module-smoke.test.js    # Plate VIII mounts, renders, travels, recentres
```

**`hyperbolic-math.test.js` is the one worth reading.** It verifies, to ~1e-13:

- every generated transform preserves the unit disc (`|a|² − |c|² = 1`)
- **the congruence proof** — the fundamental edge keeps *exactly* the same hyperbolic length under
  all ~4000 generated isometries. That invariance is what proves every tile is the same size in the
  hyperbolic metric, and that the shrinking toward the rim is only an artefact of Euclidean eyes
- each edge mirror fixes its edge pointwise (exact tile mating)
- a 20,000-step travel simulation keeps the view matrix conditioned, so travel is genuinely unbounded

Plate I's closure identity (`Σ lift = 0`, the property that makes the staircase close) is re-asserted
after every change to the hero.

---

## Build

One command, no dependencies, no install step. Node ≥ 18 (developed on v24).

```bash
node build.js      # → index.html
```

`build.js` concatenates the shell and the eight plate modules into a single self-contained
`index.html` (~200 KB), wrapping each module in an IIFE so eight independently-authored files
cannot collide in the global scope. The output is **deterministic** — same input, same bytes.

Then open `index.html` in a browser. That's it. There is no server, no bundler, and no `node_modules`.

### Layout

```
├── build.js                 # assembles shell + modules → index.html
├── shell.html               # page chrome: palette, type, Möbius nav, meter, colophon,
│                            #   and the `api` runtime the plates are handed
├── CONTRACT.md              # the binding module contract (read this first)
├── index.html               # BUILD OUTPUT — generated, committed for convenience
├── modules/
│   ├── plate1-ascending.js       …  plate8-circle-limit.js
└── tests/
    ├── gapless-test.js
    ├── hyperbolic-math.test.js
    ├── module-smoke.test.js
    └── render/               # offline SVG rasteriser used to eyeball plates without a browser
```

---

## Architecture

`CONTRACT.md` is the real specification. The short version:

Each plate is a plain `<script>` body that attaches one global:

```js
window.EscherPlate2 = {
  id: 'plane-division',
  css: `...`,                    // scoped under .plate--plane-division
  mount(root, api) {
    // owns everything inside `root`
    return { destroy() {} };
  }
};
```

The shell hands every plate the same small `api`:

| | |
|---|---|
| `api.svg(tag, attrs, parent)` | SVG element factory; attributes set verbatim |
| `api.raf(tick)` | rAF loop → `{start(), stop()}`; `tick(dt)` with `dt` capped at 64 ms so a backgrounded tab can't lurch |
| `api.onVisible(el, onEnter, onExit)` | IntersectionObserver wrapper — no plate animates offscreen |
| `api.reducedMotion` | resolved boolean |
| `api.state` / `api.onStateChange(cb)` | `'day'` \| `'night'`; returns an unsubscribe |

**Order matters in the shell:** scoped CSS is injected *before* mounting, because plates that size
a canvas measure their host on mount and would otherwise read zero. Modules are defined before the
shell runtime executes.

### Design system

All colour flows through custom properties so the Day/Night inversion can repaint the entire press
by flipping one attribute on `<html>`. **No module ever hardcodes a hex.**

```
--paper #EAE2CF   bone laid paper      --ink    #17140F   litho black
--bistre #7A5330  warm etching brown   --vermilion #B4301D  woodcut red (sparingly)
--teal  #1D6A68   Circle Limit teal    --gold   #A8862B   edition marks
```

Type: **Bodoni Moda** (plate titles), **Spectral** (museum labels), **Space Mono** (annotations,
edition marks). Paper grain is a single inline `feTurbulence` data URI — no image request.

---

## Accessibility

The impossibility is a game, never a trap.

- Real `<a>` anchors under every piece of navigational trickery; the Möbius twist is decoration
  over working links, and hover/focus brings any inverted label upright
- Every control is a real `<button>` with a descriptive `aria-label`; decorative SVG is `aria-hidden`
- A skip link to the colophon — always a way out of the loop
- **`prefers-reduced-motion` is honoured by all eight plates**: the reveal is skipped, ambient drift
  and parallax are removed, and each plate renders its most legible static state. The reduced-motion
  path shows the *finished* work, never a degraded one
- Plate I's reveal is fail-safe: driven by accumulated `dt` against absolute cue times (not chained
  timeouts), with a hard force-finish and a `visibilitychange` guard, so a dropped frame or a
  backgrounded tab can never strand the plate half-drawn

---

## Provenance and honesty

- **No reproductions.** No print of Escher's is copied, traced or embedded.
- **No invented provenance.** No fabricated museums, exhibitions, prices or endorsements.
- Quotations in the colophon are real and attributed. Plate III's first-person passage is labelled
  in the plate as *invented for this portfolio, not a documented quotation*.
- Biographical facts (Leeuwarden 1898–1972; woodcut/etching under Samuel Jessurun de Mesquita at
  Haarlem until 1922; the Penrose stairs; the hyperbolic tiling that reached him via a diagram from
  the geometer H.S.M. Coxeter) are drawn from published sources.

Built as an exercise in impersonating an artist's *method* rather than his output.

> “Are you really sure that a floor cannot also be a ceiling?”
> — M.C. Escher
