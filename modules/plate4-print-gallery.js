/* =============================================================================
   PLATE IV — "Print Gallery"
   window.EscherPlate4  ·  slug: print-gallery

   Escher's Print Gallery (1956): a man looks at a print that IS the gallery he
   stands in. Here it is built as a genuinely self-containing SVG: a scene is
   authored ONCE in a normalised 1000x1000 viewBox; inside it a "hanging print"
   occupies a sub-rectangle. Re-using the scene inside that sub-rectangle, over
   and over, produces true recursion converging on a topological singularity.

   The self-similar map is  M(p) = k*p + c  (uniform scale k, translation c).
   Its fixed point is  f = c / (1 - k)  — the point the recursion collapses to.
   The camera flies in by scaling about f by k^(-zoom). Because M^d is just a
   scale by k^d ABOUT f, the whole figure is invariant under "apply M, relabel
   depth d -> d+1". So the view at zoom=1 is pixel-identical to zoom=0 one level
   deeper, and resetting zoom via (zoom % 1) never shows a seam. You fall
   forever and never arrive.
   ========================================================================== */

window.EscherPlate4 = {
  id: 'print-gallery',

  mount(root, api) {
    // ---- self-similarity constants ---------------------------------------
    const VB = 1000;                 // viewBox is 0 0 1000 1000
    const k  = 1 / 3;                // scale factor of the hanging print
    // Top-left of the hanging print in scene coords == translation c of M.
    const cx = 500, cy = 260;
    // Fixed point f = c / (1 - k). With k=1/3 -> f = 1.5 * c.
    const fx = cx / (1 - k);         // 750
    const fy = cy / (1 - k);         // 390
    const DEPTH = 7;                 // explicit nesting depth (past this = sub-pixel)

    // ---- scaffold ---------------------------------------------------------
    root.classList.add('plate--print-gallery');
    root.innerHTML = `
      <figure class="pl4-figure">
        <div class="pl4-plate">
          <div class="pl4-mat">
            <div class="pl4-window" id="pl4-window">
              <div class="pl4-readout" id="pl4-readout" aria-hidden="true">LEVEL 0 / &#8734;</div>
            </div>
          </div>
          <button type="button" class="pl4-enter" id="pl4-enter"
                  aria-label="Enter the print: begin a seamless infinite zoom into the recursive gallery">
            ENTER THE PRINT
          </button>
        </div>
        <figcaption class="pl4-label">
          <span class="pl4-num">PLATE IV</span>
          <span class="pl4-title">Print Gallery</span>
          <span class="pl4-meta">Conformal Droste recursion &#183; ink on bone paper &#183; k = 1&#8260;3</span>
        </figcaption>
      </figure>`;

    const winEl   = root.querySelector('#pl4-window');
    const readout = root.querySelector('#pl4-readout');
    const enterBtn= root.querySelector('#pl4-enter');

    // ---- build the SVG ----------------------------------------------------
    const svg = api.svg('svg', {
      viewBox: `0 0 ${VB} ${VB}`,
      preserveAspectRatio: 'xMidYMid slice',
      class: 'pl4-svg',
      'aria-hidden': 'true'
    }, winEl);

    // <defs> holds ONE authored scene symbol + hatch patterns.
    const defs = api.svg('defs', {}, svg);

    // Diagonal hatch pattern (engraved shading — never a digital gradient).
    const hatch = api.svg('pattern', {
      id: 'pl4-hatch', width: 6, height: 6, patternUnits: 'userSpaceOnUse',
      patternTransform: 'rotate(38)'
    }, defs);
    api.svg('rect', { width: 6, height: 6, fill: 'var(--paper-2)' }, hatch);
    api.svg('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: 'var(--bistre)', 'stroke-width': 0.8 }, hatch);

    // Cross-hatch for the deep well of the plinth / shadow side.
    const cross = api.svg('pattern', {
      id: 'pl4-cross', width: 5, height: 5, patternUnits: 'userSpaceOnUse'
    }, defs);
    api.svg('rect', { width: 5, height: 5, fill: 'none' }, cross);
    api.svg('path', { d: 'M0 5 L5 0 M-1 1 L1 -1 M4 6 L6 4', stroke: 'var(--bistre)', 'stroke-width': 0.5 }, cross);

    // The authored scene, drawn once inside a <symbol>. A 1950s gallery
    // interior in etched line: floor, back wall, the hanging print, a plinth,
    // and a viewer's silhouette. All original line work, not a tracing.
    const scene = api.svg('symbol', {
      id: 'pl4-scene', viewBox: `0 0 ${VB} ${VB}`, overflow: 'visible'
    }, defs);
    buildScene(scene, api, { cx, cy, k, VB });

    // ---- explicit recursive nesting --------------------------------------
    // SVG <use> may not self-recurse, so we generate the tower by hand: level d
    // is the scene with a nested tower-of-(d-1) painted into its print window.
    // We build depth from the inside out and stamp it into the live viewBox.
    const tower = api.svg('g', { id: 'pl4-tower' }, svg);
    const levelEls = [];             // levelEls[d] = the <g> introduced at depth d
    let inner = null;
    for (let d = DEPTH; d >= 0; d--) {
      // Parent to `tower` on creation (a real node), then re-parent by nesting;
      // appendChild MOVES the node, so nothing is left duplicated in tower.
      const g = api.svg('g', { class: 'pl4-level' }, tower);
      // Paint the authored scene at this level.
      api.svg('use', { href: '#pl4-scene', 'xlink:href': '#pl4-scene' }, g);
      // Nest the previously-built (deeper) tower into the hanging-print window.
      if (inner) {
        const nest = api.svg('g', { transform: `translate(${cx} ${cy}) scale(${k})` }, g);
        nest.appendChild(inner);   // moves `inner` out of tower, into this level
      }
      levelEls[d] = g;
      inner = g;
    }
    tower.appendChild(inner);        // inner is now depth-0 (outermost, only child)

    // A hairline lens vignette so the singularity reads as recession into paper.
    api.svg('rect', {
      x: 0, y: 0, width: VB, height: VB, fill: 'none',
      stroke: 'var(--ink)', 'stroke-width': 1.5, class: 'pl4-scene-edge'
    }, svg);

    // ---- zoom state -------------------------------------------------------
    // `zoom` is a continuous scalar in [0,1); `descended` counts total levels
    // crossed so the readout can climb past absurdity. Camera = scale by
    // k^(-zoom) about the fixed point f.
    let zoom = 0;
    let descended = 0;
    let dir = 1;                     // flight direction (+1 = inward)
    let flying = false;

    const applyCamera = () => {
      const s = Math.pow(k, -zoom);  // >= 1, grows toward 1/k as zoom->1
      // scale about f: translate(f) scale(s) translate(-f)
      tower.setAttribute(
        'transform',
        `translate(${fx} ${fy}) scale(${s}) translate(${-fx} ${-fy})`
      );
      // Fade the innermost authored levels toward the singularity so the
      // truncation dissolves into atmosphere rather than a hard edge.
      const faded = zoom;            // 0..1 within the current period
      if (levelEls[DEPTH])   levelEls[DEPTH].style.opacity   = String(0.18 * (1 - faded) + 0.04);
      if (levelEls[DEPTH-1]) levelEls[DEPTH-1].style.opacity = String(0.55 - 0.35 * faded);
      readout.innerHTML = `LEVEL ${descended} / &#8734;`;
    };

    // Seamless wrap: whenever zoom leaves [0,1) we fold it back with zoom % 1
    // and bump the descended counter. The fold happens at the exact recursion
    // period, where the picture is congruent to itself, so there is no jump.
    const wrap = () => {
      while (zoom >= 1) { zoom -= 1; descended += 1; }
      while (zoom <  0) { zoom += 1; descended = Math.max(0, descended - 1); }
    };

    const setZoom = (z) => { zoom = z; wrap(); applyCamera(); };

    // ---- reduced motion: static recursion, step control ------------------
    if (api.reducedMotion) {
      enterBtn.textContent = 'DESCEND ONE LEVEL';
      enterBtn.setAttribute('aria-label',
        'Descend one recursion level deeper into the static print');
      applyCamera();
      const onStep = () => { setZoom(zoom + 1); };  // wrap keeps it congruent
      enterBtn.addEventListener('click', onStep);
      return {
        destroy() { enterBtn.removeEventListener('click', onStep); }
      };
    }

    // ---- animated flight --------------------------------------------------
    const SPEED = 0.32;              // recursion-periods per second
    const loop = api.raf((dt) => {
      zoom += dir * SPEED * (dt / 1000);
      wrap();
      applyCamera();
    });

    let visible = false;
    const setFlying = (on) => {
      flying = on;
      enterBtn.textContent = on ? 'STOP' : 'ENTER THE PRINT';
      enterBtn.classList.toggle('is-flying', on);
      if (on && visible) loop.start(); else loop.stop();
    };

    enterBtn.addEventListener('click', () => setFlying(!flying));

    // Only tick while the plate is on screen (contract: pause offscreen).
    api.onVisible(root,
      () => { visible = true;  if (flying) loop.start(); },
      () => { visible = false; loop.stop(); }
    );

    // ---- manual scrub: wheel + drag --------------------------------------
    // Wheel scrubs zoom. It only swallows the page scroll when the pointer is
    // over the plate AND a flight is engaged — otherwise the reader scrolls
    // straight past, untrapped. Listener is non-passive so we may preventDefault
    // conditionally; we guard every early-return path.
    const onWheel = (e) => {
      if (!flying) return;           // do not hijack normal reading scroll
      e.preventDefault();
      loop.stop();                   // manual takes over from autoplay
      setZoom(zoom + (e.deltaY > 0 ? 1 : -1) * 0.06);
    };
    winEl.addEventListener('wheel', onWheel, { passive: false });

    // Pointer drag scrubs continuously; vertical drag maps to zoom.
    let dragging = false, lastY = 0;
    const onDown = (e) => {
      dragging = true; lastY = e.clientY;
      loop.stop();
      winEl.setPointerCapture && winEl.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dy = e.clientY - lastY; lastY = e.clientY;
      setZoom(zoom + dy * 0.0016);
    };
    const onUp = (e) => {
      dragging = false;
      winEl.releasePointerCapture && winEl.releasePointerCapture(e.pointerId);
      if (flying && visible) loop.start();   // hand control back to the flight
    };
    winEl.addEventListener('pointerdown', onDown);
    winEl.addEventListener('pointermove', onMove);
    winEl.addEventListener('pointerup', onUp);
    winEl.addEventListener('pointercancel', onUp);

    applyCamera();                   // paint initial frame

    return {
      destroy() {
        loop.stop();
        winEl.removeEventListener('wheel', onWheel);
        winEl.removeEventListener('pointerdown', onDown);
        winEl.removeEventListener('pointermove', onMove);
        winEl.removeEventListener('pointerup', onUp);
        winEl.removeEventListener('pointercancel', onUp);
      }
    };
  }
};

/* -----------------------------------------------------------------------------
   buildScene — authors the 1950s gallery interior ONCE, in engraved line work.
   The hanging print is an empty framed rectangle at [cx,cy] of size k*1000; the
   recursion tower fills it, so we draw only its frame here (never its contents).
   -------------------------------------------------------------------------- */
function buildScene(parent, api, cfg) {
  const { cx, cy, k, VB } = cfg;
  const pw = k * VB;                 // hanging-print width == height (333.33)
  const S = (t, a) => api.svg(t, Object.assign({ 'vector-effect': 'non-scaling-stroke' }, a), parent);

  // Paper ground of the scene (bone). No stroke, so vector-effect is inert.
  S('rect', { x: 0, y: 0, width: VB, height: VB, fill: 'var(--paper)' });

  // --- architecture: back wall, floor, cornice --------------------------
  const floorY = 720;
  // Floor plane with a single vanishing perspective, floorboards in fine line.
  S('rect', { x: 0, y: floorY, width: VB, height: VB - floorY, fill: 'var(--paper-2)' });
  for (let i = 1; i < 9; i++) {
    const x = (i / 9) * VB;
    // Floorboards converge toward a vanishing point high on the back wall.
    S('line', { x1: x, y1: VB, x2: 380 + (x - 380) * 0.28, y2: floorY, stroke: 'var(--ink-2)', 'stroke-width': 0.5 });
  }
  for (let j = 1; j < 4; j++) {
    const y = floorY + (j / 4) * (VB - floorY);
    S('line', { x1: 0, y1: y, x2: VB, y2: y, stroke: 'var(--ink-2)', 'stroke-width': 0.5 });
  }
  // Cornice / ceiling line.
  S('line', { x1: 0, y1: 96, x2: VB, y2: 96, stroke: 'var(--ink)', 'stroke-width': 1 });
  S('line', { x1: 0, y1: 108, x2: VB, y2: 108, stroke: 'var(--ink-2)', 'stroke-width': 0.5 });

  // Back-wall skirting where wall meets floor.
  S('line', { x1: 0, y1: floorY, x2: VB, y2: floorY, stroke: 'var(--ink)', 'stroke-width': 1 });

  // A pilaster on the right, hatched, giving the room architectural weight.
  S('rect', { x: 902, y: 108, width: 78, height: floorY - 108, fill: 'url(#pl4-hatch)' });
  S('rect', { x: 902, y: 108, width: 78, height: floorY - 108, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1 });
  S('line', { x1: 902, y1: 108, x2: 902, y2: floorY, stroke: 'var(--ink)', 'stroke-width': 1 });

  // A window/arch on the left wall to break the plane, drawn in thin line.
  S('rect', { x: 70, y: 200, width: 150, height: 300, fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 0.75 });
  S('line', { x1: 145, y1: 200, x2: 145, y2: 500, stroke: 'var(--ink-2)', 'stroke-width': 0.5 });
  S('line', { x1: 70, y1: 350, x2: 220, y2: 350, stroke: 'var(--ink-2)', 'stroke-width': 0.5 });

  // --- the plinth (foreground sculpture stand), cross-hatched shadow side --
  S('rect', { x: 250, y: 640, width: 150, height: 150, fill: 'var(--paper-2)' });
  S('rect', { x: 250, y: 640, width: 150, height: 150, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1 });
  S('rect', { x: 340, y: 640, width: 60, height: 150, fill: 'url(#pl4-cross)' }); // shadow face
  S('rect', { x: 250, y: 628, width: 150, height: 16, fill: 'var(--paper)', stroke: 'var(--ink)', 'stroke-width': 1 }); // cap

  // --- the viewer's silhouette (the man looking at the print) -------------
  // One touch of vermilion, per contract — the single figure carries the accent.
  const fig = api.svg('g', { fill: 'var(--vermilion)', stroke: 'var(--ink)', 'stroke-width': 0.75 }, parent);
  api.svg('circle', { cx: 470, cy: 500, r: 26, 'vector-effect': 'non-scaling-stroke' }, fig);            // head
  api.svg('path', {                                                                                       // body/coat
    d: 'M 438 528 Q 470 516 502 528 L 512 690 Q 470 704 428 690 Z',
    'vector-effect': 'non-scaling-stroke'
  }, fig);
  api.svg('line', { x1: 470, y1: 690, x2: 452, y2: 780, 'vector-effect': 'non-scaling-stroke' }, fig);    // legs
  api.svg('line', { x1: 470, y1: 690, x2: 490, y2: 780, 'vector-effect': 'non-scaling-stroke' }, fig);
  // Raised arm gesturing toward the hanging print.
  api.svg('line', { x1: 500, y1: 560, x2: 560, y2: 500, stroke: 'var(--ink)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' }, fig);

  // --- the HANGING PRINT: only its frame + mat + wire. Its interior is left
  //     empty so the recursion tower shows through and the gallery re-appears.
  const G = (t, a) => api.svg(t, Object.assign({ 'vector-effect': 'non-scaling-stroke' }, a), parent);
  // hanging wire to the cornice
  G('line', { x1: cx + pw / 2, y1: 110, x2: cx + pw / 2, y2: cy, stroke: 'var(--ink-2)', 'stroke-width': 0.5 });
  // plate shadow cast down-right
  G('rect', { x: cx + 8, y: cy + 8, width: pw, height: pw, fill: 'var(--paper-3)', stroke: 'none' });
  // outer frame
  G('rect', { x: cx - 10, y: cy - 10, width: pw + 20, height: pw + 20, fill: 'var(--paper)', stroke: 'var(--ink)', 'stroke-width': 1.5 });
  // mat bevel
  G('rect', { x: cx - 3, y: cy - 3, width: pw + 6, height: pw + 6, fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 0.5 });
  // the print aperture (its content is the nested tower — drawn empty here)
  G('rect', { x: cx, y: cy, width: pw, height: pw, fill: 'var(--paper)', stroke: 'var(--ink)', 'stroke-width': 1 });
  // a tiny edition mark under the hanging print, in the print grammar
  G('line', { x1: cx, y1: cy + pw + 10, x2: cx + pw, y2: cy + pw + 10, stroke: 'var(--ink-2)', 'stroke-width': 0.5 });
}

/* ============================== SCOPED CSS ============================== */
window.EscherPlate4.css = `
.plate--print-gallery{
  display:flex; justify-content:center; padding:2rem 1rem;
}
.plate--print-gallery .pl4-figure{ margin:0; max-width:560px; width:100%; }

/* plate well — paper shadow + hairline edge */
.plate--print-gallery .pl4-plate{
  background:var(--paper-2);
  border:1px solid var(--paper-3);
  box-shadow: 0 1px 0 var(--paper), inset 0 0 0 6px var(--paper-2),
              6px 8px 0 -2px var(--paper-3);
  padding:1.2rem 1.2rem 1.4rem;
}

/* the mat around the framed plate */
.plate--print-gallery .pl4-mat{
  background:var(--paper);
  border:1px solid var(--ink);
  padding:14px;
  box-shadow: inset 0 0 0 1px var(--paper-3), inset 3px 3px 10px -6px var(--ink);
}

/* the viewport that clips the infinite scene */
.plate--print-gallery .pl4-window{
  position:relative;
  aspect-ratio:1/1;
  overflow:hidden;
  background:var(--paper);
  border:1px solid var(--ink);
  cursor:grab;
  touch-action:none;
}
.plate--print-gallery .pl4-window:active{ cursor:grabbing; }

.plate--print-gallery .pl4-svg{ display:block; width:100%; height:100%; }
.plate--print-gallery .pl4-level{ transition:opacity .12s linear; }
.plate--print-gallery .pl4-scene-edge{ pointer-events:none; }

/* live depth readout */
.plate--print-gallery .pl4-readout{
  position:absolute; left:8px; bottom:8px; z-index:2;
  font-family:var(--font-mono); font-size:11px; letter-spacing:.18em;
  color:var(--ink); background:color-mix(in srgb, var(--paper) 78%, transparent);
  padding:2px 8px; border:1px solid var(--ink-2); text-transform:uppercase;
  pointer-events:none;
}

/* ENTER THE PRINT button */
.plate--print-gallery .pl4-enter{
  display:block; width:100%; margin-top:1rem;
  font-family:var(--font-mono); font-size:12px; letter-spacing:.18em;
  text-transform:uppercase; color:var(--paper); background:var(--ink);
  border:1px solid var(--ink); padding:.7rem 1rem; cursor:pointer;
  transition:background .15s, color .15s;
}
.plate--print-gallery .pl4-enter:hover{ background:var(--bistre); border-color:var(--bistre); }
.plate--print-gallery .pl4-enter.is-flying{ background:var(--vermilion); border-color:var(--vermilion); }
.plate--print-gallery .pl4-enter:focus-visible{
  outline:2px solid var(--vermilion); outline-offset:3px;
}

/* museum label */
.plate--print-gallery .pl4-label{
  margin-top:1rem; display:grid; gap:2px;
  border-top:1px solid var(--ink-2); padding-top:.7rem;
}
.plate--print-gallery .pl4-num{
  font-family:var(--font-mono); font-size:11px; letter-spacing:.22em;
  color:var(--bistre); text-transform:uppercase;
}
.plate--print-gallery .pl4-title{
  font-family:var(--font-display); font-size:1.6rem; line-height:1.05;
  color:var(--ink); font-style:italic;
}
.plate--print-gallery .pl4-meta{
  font-family:var(--font-body); font-size:.85rem; color:var(--ink-2);
}
@media (prefers-reduced-motion: reduce){
  .plate--print-gallery .pl4-level{ transition:none; }
}
`;
