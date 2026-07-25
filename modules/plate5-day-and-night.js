// PLATE V — Day and Night   (1938 woodcut)
// Dutch polder fields rise up the plate and morph into two interlocking flocks:
// night on the left (light birds on dark ground), day on the right (dark on light).
//
// GAPLESS INTERLOCK — mated-edge tiling (the Plate II technique).
//   Each cell is a square whose TOP and RIGHT edges are freely deformed by a
//   perpendicular-offset array; the BOTTOM and LEFT edges are DERIVED as the
//   point-reflected conjugates  bottom = -reverse(top),  left = -reverse(right).
//   Under that rule a cell's bottom edge is *identical* to the top edge of the
//   cell below it (and right == left of the cell to its right), so the p1
//   translational tiling closes with zero gaps and zero overlaps at EVERY value
//   of the morph parameter. Colouring the lattice as a checkerboard makes each
//   bird the exact negative space of its four neighbours — figure = ground.
// MORPH — the offset arrays are lerped componentwise from a near-rectangular
//   polder parcel (t=0, bottom of plate) to the bird silhouette (t=1, top),
//   driven by row index. Because the mating rule holds for the lerped arrays
//   too, the land tessellates as tightly as the birds do.
// TOGGLE — a small emblem on the day/night seam flips documentElement.dataset
//   .state; the plate reveals a pre-rendered inverted layer with a vertical
//   clip-path wipe travelling along the morph direction.

window.EscherPlate5 = { id: 'day-and-night' };

window.EscherPlate5.css = `
.plate--day-and-night{background:var(--paper-2);border-top:1px solid var(--paper-3);border-bottom:1px solid var(--paper-3);font-family:var(--font-mono);position:relative;overflow:hidden}
.pl5-hdr{display:flex;align-items:baseline;gap:1.6em;padding:1.4rem 2rem .5rem;border-bottom:.5px solid var(--ink-2);opacity:.72}
.pl5-pnum{font-family:var(--font-display);font-size:.65rem;letter-spacing:.22em;color:var(--bistre);text-transform:uppercase}
.pl5-ttl{font-family:var(--font-display);font-size:1rem;letter-spacing:.06em;color:var(--ink)}
.pl5-yr{font-size:.58rem;letter-spacing:.18em;color:var(--ink-2);text-transform:uppercase;margin-left:auto}
.pl5-field{position:relative;width:100%;aspect-ratio:16/9;min-height:240px;max-height:520px;overflow:hidden}
.pl5-field svg.pl5-layer{display:block;position:absolute;top:0;left:0;width:100%;height:100%}
.pl5-base{z-index:1}
.pl5-wipe{z-index:2;clip-path:inset(0 0 100% 0)}
.pl5-wipe.pl5-going{transition:clip-path 780ms cubic-bezier(.76,0,.24,1)}
/* the seam emblem — the day/night switch, sat on the vertical centre line */
.pl5-switch{position:absolute;z-index:4;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:.5rem}
.pl5-seamlabels{display:flex;align-items:center;gap:.7em;font-size:.54rem;letter-spacing:.2em;text-transform:uppercase;user-select:none;pointer-events:none;
  /* printed on its own paper chip so the label never fights the flock behind it */
  background:var(--paper);padding:.22rem .55rem;border:1px solid var(--rule-2);border-radius:1px}
.pl5-lbl{color:var(--ink-2);opacity:.5;transition:opacity .3s ease,color .3s ease}
.pl5-lbl.on{color:var(--ink);opacity:1}
.pl5-btn{width:54px;height:54px;padding:0;margin:0;border:1px solid var(--ink);background:transparent;border-radius:50%;cursor:pointer;outline:none;display:block;box-shadow:0 1px 6px color-mix(in srgb, var(--ink) 34%, transparent);overflow:hidden}
.pl5-btn:focus-visible{outline:2px solid var(--vermilion);outline-offset:3px}
.pl5-btn svg{display:block;width:52px;height:52px}
.pl5-ann{display:flex;gap:2em;flex-wrap:wrap;padding:.7rem 2rem .3rem;font-size:.52rem;letter-spacing:.18em;color:var(--ink-2);opacity:.58;text-transform:uppercase;border-top:.5px solid var(--ink-2)}
.pl5-cap{font-family:var(--font-body);font-size:.68rem;font-style:italic;color:var(--ink-2);padding:.2rem 2rem .9rem;opacity:.7;line-height:1.55;max-width:46rem}
.pl5-reg{position:absolute;top:.5rem;right:2rem;width:14px;height:14px;pointer-events:none;opacity:.28;z-index:3}
@media (max-width:640px){
  .pl5-hdr{gap:1em;padding:1.1rem 1.1rem .4rem}
  .pl5-ann,.pl5-cap{padding-left:1.1rem;padding-right:1.1rem}
  .pl5-field{aspect-ratio:4/3;max-height:440px}
  .pl5-reg{right:1.1rem}
}
`;

window.EscherPlate5.mount = function mount(root, api) {

  // ── Geometry constants ──────────────────────────────────────────────────
  const VW = 640, VH = 360;          // SVG user-space (viewBox)
  const S  = 64;                     // cell size
  const N  = 9;                      // control points per edge (corners pinned)
  const COLS = Math.ceil(VW / S) + 2;
  const ROWS = Math.ceil(VH / S) + 2;
  const OX = -S, OY = -S;            // lattice origin (start off-canvas)
  const FLOCK_TOP = 0.10 * VH;       // above → pure birds (t=1)
  const FIELD_BOT = 0.74 * VH;       // below → pure fields (t=0)
  const RIVER_Y   = 0.86 * VH;

  // ── Mated-edge tile ─────────────────────────────────────────────────────
  // Only TOP and RIGHT offsets are authored, at two keyframes (field, bird).
  // Positive offset = along the outward normal. Corner samples are 0 so the
  // cell corners stay pinned to the lattice (required for the mating identity).
  //
  // BIRD keyframe: right-gliding silhouette — swept wing on top, head lobe &
  // beak on the upper-right, tapering to a tail. The DERIVED bottom/left edges
  // become the complementary wing/tail that the neighbouring bird nests into.
  const TOP_BIRD   = [0,  -6, -18, -28, -20, -6,  4,  6, 0];
  const RIGHT_BIRD = [0,  22,  32,  16,  -8, -18, -10,  8, 0];
  // FIELD keyframe: an almost-rectangular polder parcel with a slight,
  // irregular wobble so the farmland reads hand-cut, not machined.
  const TOP_FIELD   = [0,  2, -2,  1, -1,  2, -1,  1, 0];
  const RIGHT_FIELD = [0, -1,  2, -1,  1, -2,  1, -1, 0];

  function rev(a){ return a.slice().reverse().map(v => -v); }
  function lerpArr(a, b, t){ return a.map((v, i) => v + (b[i] - v) * t); }

  // cell-centre y → morph parameter (0 field … 1 bird)
  function morphT(oy){
    const cy = oy + S * 0.5;
    if (cy <= FLOCK_TOP) return 1;
    if (cy >= FIELD_BOT) return 0;
    const u = 1 - (cy - FLOCK_TOP) / (FIELD_BOT - FLOCK_TOP);
    return u * u * (3 - 2 * u);       // smoothstep for a graceful rise
  }

  // sample N points along one parameterised edge
  function edgePts(x0, y0, dx, dy, px, py, offs){
    return offs.map((o, i) => {
      const f = i / (N - 1);
      return [x0 + f * dx + o * px, y0 + f * dy + o * py];
    });
  }
  // outline path for a cell at pixel offset (tx,ty) and morph t
  function cellPath(tx, ty, t){
    const tOff = lerpArr(TOP_FIELD,   TOP_BIRD,   t);
    const rOff = lerpArr(RIGHT_FIELD, RIGHT_BIRD, t);
    const bOff = rev(tOff), lOff = rev(rOff);
    const top    = edgePts(tx,     ty,     S,  0,  0, -1, tOff);
    const right  = edgePts(tx + S, ty,     0,  S,  1,  0, rOff);
    const bottom = edgePts(tx + S, ty + S,-S,  0,  0,  1, bOff);
    const left   = edgePts(tx,     ty + S, 0, -S, -1,  0, lOff);
    const pts = [...top, ...right.slice(1), ...bottom.slice(1), ...left.slice(1)];
    return 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z';
  }
  // the bird's eye: a small disc near the head lobe, in cell-local coords.
  // Fades in only once the cell is mostly a bird (t high).
  function eyePath(tx, ty, t){
    if (t < 0.55) return '';
    const r = 3.4 + 1.2 * t;
    const ex = tx + S * 0.70, ey = ty + S * 0.28;
    return `M${(ex - r).toFixed(1)},${ey.toFixed(1)} a${r},${r} 0 1,0 ${(2*r).toFixed(1)},0 a${r},${r} 0 1,0 ${(-2*r).toFixed(1)},0Z`;
  }

  function svgel(tag, attrs, parent){
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (const k of Object.keys(attrs)) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  // ── DOM ──────────────────────────────────────────────────────────────────
  root.innerHTML = '';

  const hdr = document.createElement('div');
  hdr.className = 'pl5-hdr'; hdr.setAttribute('aria-hidden', 'true');
  hdr.innerHTML = '<span class="pl5-pnum">Plate V</span><span class="pl5-ttl">Day and Night</span><span class="pl5-yr">Woodcut · 1938</span>';
  root.appendChild(hdr);

  // registration mark — SVG class set via setAttribute + explicit width/height
  const reg = svgel('svg', { class: 'pl5-reg', viewBox: '0 0 14 14', width: '14', height: '14', 'aria-hidden': 'true' }, root);
  svgel('line', { x1: 7, y1: 0, x2: 7, y2: 14, stroke: 'var(--ink)', 'stroke-width': '0.5' }, reg);
  svgel('line', { x1: 0, y1: 7, x2: 14, y2: 7, stroke: 'var(--ink)', 'stroke-width': '0.5' }, reg);
  svgel('circle', { cx: 7, cy: 7, r: 3, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '0.5' }, reg);

  const field = document.createElement('div');
  field.className = 'pl5-field';
  root.appendChild(field);

  function makeLayer(extra){
    return svgel('svg', {
      class: 'pl5-layer ' + extra,
      viewBox: `0 0 ${VW} ${VH}`,
      width: VW, height: VH,
      preserveAspectRatio: 'xMidYMid slice',
      'aria-hidden': 'true'
    }, field);
  }
  const svgBase = makeLayer('pl5-base');
  const svgWipe = makeLayer('pl5-wipe');

  // the switch (seam emblem)
  const sw = document.createElement('div');
  sw.className = 'pl5-switch';
  const btn = document.createElement('button');
  btn.className = 'pl5-btn';
  btn.type = 'button';
  const labels = document.createElement('div');
  labels.className = 'pl5-seamlabels'; labels.setAttribute('aria-hidden', 'true');
  const lblDay = document.createElement('span'); lblDay.className = 'pl5-lbl'; lblDay.textContent = 'DAY';
  const lblNight = document.createElement('span'); lblNight.className = 'pl5-lbl'; lblNight.textContent = 'NIGHT';
  labels.appendChild(lblDay); labels.appendChild(lblNight);
  sw.appendChild(btn); sw.appendChild(labels);
  field.appendChild(sw);

  // emblem art: a disc, one half paper + one half ink, with a small bird in each
  // half rendered in the opposite colour — a diegetic day/night token.
  const emb = svgel('svg', { viewBox: '0 0 52 52', width: '52', height: '52', 'aria-hidden': 'true' }, btn);
  svgel('circle', { cx: 26, cy: 26, r: 25, fill: 'var(--paper)' }, emb);
  // right (day) half filled ink so left=paper/right=ink reads as the seam
  svgel('path', { d: 'M26,1 A25,25 0 0 1 26,51 Z', fill: 'var(--ink)' }, emb);
  // small mated bird in each half, opposite colour, ~14px — same silhouette, scaled
  function embBird(cx, cy, fill){
    const g = svgel('g', { transform: `translate(${cx},${cy}) scale(0.22)` }, emb);
    svgel('path', { d: cellPath(-S / 2, -S / 2, 1), fill: fill, stroke: 'none' }, g);
  }
  embBird(15, 25, 'var(--ink)');     // dark bird on the light (day-left) half
  embBird(37, 27, 'var(--paper)');   // light bird on the dark half
  svgel('circle', { cx: 26, cy: 26, r: 25, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '1' }, emb);

  const ann = document.createElement('div');
  ann.className = 'pl5-ann'; ann.setAttribute('aria-hidden', 'true');
  ann.innerHTML = '<span>LATTICE 64²</span><span>MATED EDGES · p1</span><span>FIGURE = GROUND</span><span>FIELD → FLOCK</span>';
  root.appendChild(ann);

  const cap = document.createElement('p');
  cap.className = 'pl5-cap';
  cap.textContent = 'Polder fields deform upward into two flocks. Each light bird is the exact void between four dark birds, and the reverse — mated cell edges guarantee the tiling never opens a gap. The seam token inverts the whole press.';
  root.appendChild(cap);

  // ── Scene builder ─────────────────────────────────────────────────────────
  // isNight flips which half is dark. Left half is the "night side", right the
  // "day side"; the global state swaps both together (same plate, opposite press).
  function buildScene(svgEl, isNight){
    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

    const darkLeft  = isNight ? 'var(--ink)'  : 'var(--paper)';
    const darkRight = isNight ? 'var(--paper)' : 'var(--ink)';
    // ground halves — the sky/ground each flock flies against
    svgel('rect', { x: 0,      y: 0, width: VW / 2, height: VH, fill: darkLeft  }, svgEl);
    svgel('rect', { x: VW / 2, y: 0, width: VW / 2, height: VH, fill: darkRight }, svgEl);

    // separate layers so eyes/furrows always paint over the filled cells
    const cellG   = svgel('g', {}, svgEl);
    const furrowG = svgel('g', { fill: 'none', stroke: 'var(--bistre)', 'stroke-width': '0.7', opacity: '0.30', 'vector-effect': 'non-scaling-stroke', 'stroke-linecap': 'round' }, svgEl);
    const eyeG    = svgel('g', {}, svgEl);
    // warm earth palette for the polder parcels (woodcut farmland)
    const LAND = ['var(--paper-2)', 'var(--paper-3)', 'var(--bistre-2)', 'var(--paper-3)', 'var(--bistre)'];

    // EVERY cell is drawn and filled across all t — the land morphs continuously
    // into the flock with no empty band. Land cells wear earth tones; bird cells
    // wear the stark ink/paper checkerboard that makes figure = ground.
    for (let row = -1; row < ROWS; row++){
      for (let col = -1; col < COLS; col++){
        const tx = OX + col * S, ty = OY + row * S;
        if (tx + S < 0 || tx > VW || ty + S < 0 || ty > VH) continue;
        const t = morphT(ty);
        const d = cellPath(tx, ty, t);

        const parity = (col + row) & 1;
        const onLeft = (tx + S / 2) < VW / 2;
        // ink/paper assignment, colour-mirrored across the seam and swapped at night
        let dark;
        if (onLeft) dark = parity ? (isNight ? false : true) : (isNight ? true : false);
        else        dark = parity ? (isNight ? true : false) : (isNight ? false : true);

        let fill;
        if (t < 0.45){
          // polder parcel — pick an earth tone by a stable per-cell hash
          const h = (((col * 7 + row * 13) % LAND.length) + LAND.length) % LAND.length;
          fill = LAND[h];
          // a couple of furrow lines running along the parcel's long axis
          const fy1 = ty + S * 0.36, fy2 = ty + S * 0.64;
          furrowG.appendChild(svgel('path', { d: `M${tx + 4},${fy1.toFixed(1)} L${tx + S - 4},${fy1.toFixed(1)}` }));
          furrowG.appendChild(svgel('path', { d: `M${tx + 4},${fy2.toFixed(1)} L${tx + S - 4},${fy2.toFixed(1)}` }));
        } else {
          fill = dark ? 'var(--ink)' : 'var(--paper)';
        }

        cellG.appendChild(svgel('path', { d, fill, stroke: 'var(--bistre)', 'stroke-width': t < 0.45 ? '0.6' : '0', 'stroke-opacity': t < 0.45 ? '0.35' : '0', 'vector-effect': 'non-scaling-stroke' }));

        const ed = eyePath(tx, ty, t);
        if (ed) eyeG.appendChild(svgel('path', { d: ed, fill: dark ? 'var(--paper)' : 'var(--ink)', stroke: 'none' }));
      }
    }

    // river + towns sit on top of the land band
    svgel('rect', { x: 0, y: RIVER_Y - 6, width: VW, height: 13, fill: 'var(--bistre)', opacity: '0.34' }, svgEl);
    svgel('rect', { x: 0, y: RIVER_Y - 1, width: VW, height: 3,  fill: 'var(--bistre-2)', opacity: '0.24' }, svgEl);
    const bldgs = [[0, 0, 15, 26], [17, 7, 11, 19], [30, 0, 18, 26], [50, 4, 13, 22], [65, 0, 16, 26]];
    [{ x: 74, left: true }, { x: VW - 74 - 81, left: false }].forEach(tw => {
      const f  = tw.left ? (isNight ? 'var(--ink)' : 'var(--ink-2)') : (isNight ? 'var(--paper)' : 'var(--paper-3)');
      const g = svgel('g', { transform: `translate(${tw.x},${RIVER_Y - 26})`, fill: f, stroke: 'var(--bistre)', 'stroke-width': '0.6', 'stroke-opacity': '0.5', 'vector-effect': 'non-scaling-stroke' }, svgEl);
      for (const [bx, by, bw, bh] of bldgs){
        svgel('rect', { x: bx, y: by, width: bw, height: bh }, g);
        svgel('polygon', { points: `${bx},${by} ${bx + bw / 2},${by - 7} ${bx + bw},${by}` }, g);
      }
    });

    // the day/night seam — a clean hairline where the two presses meet
    svgel('line', { x1: VW / 2, y1: 0, x2: VW / 2, y2: VH, stroke: 'var(--ink-2)', 'stroke-width': '0.6', opacity: '0.3', 'vector-effect': 'non-scaling-stroke' }, svgEl);
  }

  // ── State + wipe ────────────────────────────────────────────────────────
  let cur = api.state || 'day', wiping = false;

  function paintBtn(state){
    const n = state === 'night';
    btn.setAttribute('aria-pressed', n ? 'true' : 'false');
    btn.setAttribute('aria-label', n
      ? 'Day and Night switch: currently night. Activate to return the whole plate to day.'
      : 'Day and Night switch: currently day. Activate to invert the whole plate to night.');
    lblDay.classList.toggle('on', !n);
    lblNight.classList.toggle('on', n);
  }

  function applyState(state, animate){
    buildScene(svgWipe, state === 'night');       // the incoming press
    if (!animate || api.reducedMotion){
      buildScene(svgBase, state === 'night');
      svgWipe.classList.remove('pl5-going');
      svgWipe.style.clipPath = 'inset(0 0 100% 0)';
      paintBtn(state); cur = state; wiping = false;
      rebuildFliers();
      return;
    }
    wiping = true;
    svgWipe.classList.remove('pl5-going');
    svgWipe.style.clipPath = 'inset(0 0 100% 0)';   // hidden (revealed from top)
    void svgWipe.offsetWidth;                        // force reflow
    svgWipe.classList.add('pl5-going');
    svgWipe.style.clipPath = 'inset(0 0 0 0)';       // wipe downward along the morph
    svgWipe.addEventListener('transitionend', function settle(){
      svgWipe.removeEventListener('transitionend', settle);
      buildScene(svgBase, state === 'night');
      svgWipe.classList.remove('pl5-going');
      svgWipe.style.clipPath = 'inset(0 0 100% 0)';
      paintBtn(state); cur = state; wiping = false;
      rebuildFliers();
    }, { once: true });
  }

  // ── Fliers: a few birds detaching from the top band and gliding ───────────
  const FLIERS = [
    { x: 0.16, y: 0.10, sp: 0.9,  amp: 8 },
    { x: 0.34, y: 0.05, sp: 1.15, amp: 6 },
    { x: 0.70, y: 0.09, sp: 0.8,  amp: 9 },
    { x: 0.86, y: 0.05, sp: 1.05, amp: 7 },
  ];
  let flierG = null, flierEls = [];
  function rebuildFliers(){
    if (api.reducedMotion) return;
    if (flierG && flierG.parentNode) flierG.parentNode.removeChild(flierG);
    flierG = svgel('g', { 'aria-hidden': 'true' }, svgBase);
    flierEls = FLIERS.map(f => {
      const dark = (f.x < 0.5) ? (cur === 'night' ? false : true) : (cur === 'night' ? true : false);
      return { ...f, el: svgel('path', { fill: dark ? 'var(--ink)' : 'var(--paper)', stroke: 'none', opacity: '0.9' }, flierG) };
    });
  }
  function tickFliers(){
    if (api.reducedMotion || !flierEls.length) return;
    const now = performance.now() / 1000;
    for (const f of flierEls){
      const drift = (now * f.sp * 14) % (VW + 2 * S) - S;   // glide rightward, wrap
      const bob = Math.sin(now * f.sp * 1.6 + f.x * 9) * f.amp;
      const bx = f.x * VW + drift * 0.15;
      const by = f.y * VH + bob;
      f.el.setAttribute('d', cellPath(bx - S / 2, by - S / 2, 1));
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  buildScene(svgBase, cur === 'night');
  svgWipe.style.clipPath = 'inset(0 0 100% 0)';
  paintBtn(cur);
  rebuildFliers();

  btn.addEventListener('click', function(){
    if (wiping) return;                              // html attribute is the source of truth;
    document.documentElement.dataset.state = (cur === 'day') ? 'night' : 'day';
  });

  api.onStateChange(function(state){
    if (state === cur) return;
    applyState(state, true);
  });

  let loop = null;
  if (!api.reducedMotion){
    loop = api.raf(function(){ tickFliers(); });
    api.onVisible(root, function(){ loop.start(); }, function(){ loop.stop(); });
  }

  return { destroy(){ if (loop) loop.stop(); } };
};
