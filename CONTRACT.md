# REGULAR DIVISION OF THE PLANE — Module Contract

A single-page site presented as a portfolio of numbered **plates** by M.C. Escher,
reimagined as a web designer. Ink-on-paper print-room register. Every illusion must be
**constructed geometry**, never a picture of an illusion, and never a reproduction of
Escher's actual (still-copyrighted) prints.

---

## 1. NON-NEGOTIABLES

1. **No external libraries.** No GSAP, no D3, no three.js. Vanilla JS, SVG, Canvas 2D, CSS only.
2. **No ES modules, no `import`/`export`.** Each module is a plain `<script>` body that
   attaches itself to `window`. It will be concatenated into ONE html file.
3. **No network requests.** No image URLs, no fetch, no CDN. All geometry authored in code.
4. **No reproductions.** Do not embed or trace Escher's actual prints. Author original
   tiles, stairs, triangles, discs in his *grammar*.
5. **Respect `prefers-reduced-motion`.** Every module receives `api.reducedMotion` (boolean).
   When true: render the final/most legible static state, run no rAF loop, no autoplay.
6. **Pause when offscreen.** Never run a rAF loop for a plate that is not visible.
   Use the provided `api.onVisible(el, cb)` helper.
7. **Keyboard + a11y.** Any interactive control is a real `<button>`/`<a>` with a visible
   focus ring and an `aria-label`. Decorative SVG gets `aria-hidden="true"`.
8. **No fabricated provenance.** No invented museums, exhibitions, prices, endorsements.

---

## 2. PALETTE (CSS custom properties — use these names, never raw hex)

```
--paper        #EAE2CF   bone laid paper (page ground)
--paper-2      #DFD5BE   deeper paper, plate wells
--paper-3      #D2C6AB   paper shadow / plate edge
--ink          #17140F   litho black (text, line work)
--ink-2        #3A332A   softer ink, secondary text
--bistre       #7A5330   warm etching brown (hatching, second plate colour)
--bistre-2     #A97F52   light bistre
--vermilion    #B4301D   woodcut red — ACCENT, use sparingly (one per plate max)
--teal         #1D6A68   Circle Limit teal — second accent
--gold         #A8862B   edition marks, rare
```

Night state (the *Day and Night* inversion) is achieved by `:root[data-state="night"]`
swapping these same variables. **Never hardcode a hex.** If you need a mid tone use
`color-mix(in srgb, var(--ink) 40%, var(--paper))`.

Line work reads as engraving: stroke widths `0.5 / 0.75 / 1 / 1.5`, `stroke-linejoin:
miter`, `vector-effect: non-scaling-stroke` on structural SVG lines.

## 3. TYPE

- `--font-display: 'Bodoni Moda', serif` — plate titles, numerals. High contrast, tight.
- `--font-body: 'Spectral', Georgia, serif` — museum-label body copy.
- `--font-mono: 'Space Mono', monospace` — annotations, coordinates, edition marks,
  uppercase with `letter-spacing: .18em`.

Plate numbers are always Roman: PLATE I … PLATE VIII.

---

## 4. MODULE API — the exact shape

Every module file defines ONE global, named `EscherPlate<N>` (e.g. `EscherPlate2`):

```js
window.EscherPlate2 = {
  id: 'plane-division',
  mount(root, api) {
    // root: the HTMLElement you own completely. Build your DOM inside it.
    // Return an object with an optional destroy().
    return { destroy() {} };
  }
};
```

`api` provides:

```js
api.reducedMotion   // boolean, already resolved
api.onVisible(el, onEnter, onExit)  // IntersectionObserver wrapper, handles cleanup
api.raf(tickFn)     // returns {start(), stop()}. rAF loop with dt in ms, auto-capped.
api.state           // 'day' | 'night'
api.onStateChange(cb)  // cb('night') when the inversion switch flips
api.reduceLabel(el) // no-op helper, ignore if unused
api.svg(tag, attrs, parent)  // tiny SVG element factory. attrs are set verbatim.
```

Assume `api` exists. Do NOT polyfill it, do NOT re-implement it, do NOT check for it.
Write defensively only around browser APIs (e.g. `getContext('2d')` returning null).

## 5. WHAT YOU OWN

You own only the inside of `root`. Do not:
- touch `document.body`, `<head>`, or any element outside `root`
- register global keyboard listeners (except via `root` or with a documented reason)
- define CSS outside your own scoped block
- use `id` attributes that aren't prefixed with your plate slug (`pl2-…`)

## 6. CSS DELIVERY

Put your CSS in a template string on the global: `EscherPlate2.css = \`...\``.
Scope every selector under `.plate--plane-division` (your root gets that class).
The shell injects it. Do not use `<style>` tags inside your module.

## 7. FILE OUTPUT

Write exactly one file: `/agent/workspace/escher/modules/plateN-slug.js`.
Plain script body (no wrapper IIFE needed, but an IIFE is fine).
Target **under 400 lines**. Dense, commented where the math is non-obvious.

## 8. THE TEST

Before you report done, run a syntax check:
`node --check /agent/workspace/escher/modules/<yourfile>.js`
and fix anything it reports. Report the file path, the global name, and 2–3 sentences
on how the illusion is *constructed* (the actual math/technique). Do not paste the code.
