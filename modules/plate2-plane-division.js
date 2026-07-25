// PLATE II — Regular Division of the Plane
// A live morphing tessellation: square lattice → interlocking reptiles → wheeling birds.
//
// SYMMETRY p4 (Heesch type C4C4C4C4 — the classic Escher lizard "pinwheel").
// The fundamental domain is a square whose FOUR boundary edges are all congruent: a single
// authored arc A (a set of perpendicular offsets along corner c0→c1) is copied to the other
// three edges by successive 90° rotations about the shared corners (c1, c2, c3). Because every
// edge is the same curve pivoted at a lattice corner, four tiles meeting at any corner interlock
// as a pinwheel with NO gap, at every value of the morph t. The four cell orientations
// (0/90/180/270°) tile the plane on the square lattice by parity of (col,row).
// Deform the arc however you like — gaplessness is structural, guaranteed by the rotation rule.

window.EscherPlate2 = { id: 'plane-division' };

// ─── CSS ────────────────────────────────────────────────────────────────────
window.EscherPlate2.css = `
.plate--plane-division{background:var(--paper-2);border-top:1px solid var(--paper-3);border-bottom:1px solid var(--paper-3);font-family:var(--font-mono);position:relative;overflow:hidden}
.pl2-header{display:flex;align-items:baseline;gap:1.8em;padding:1.4rem 2rem .6rem;border-bottom:.5px solid var(--ink-2);opacity:.72}
.pl2-plate-num{font-family:var(--font-display);font-size:.65rem;letter-spacing:.22em;color:var(--bistre);text-transform:uppercase}
.pl2-title{font-family:var(--font-display);font-size:1rem;letter-spacing:.06em;color:var(--ink)}
.pl2-symmetry{font-size:.6rem;letter-spacing:.18em;color:var(--ink-2);text-transform:uppercase;margin-left:auto}
.pl2-field{display:block;width:100%;aspect-ratio:3/1;min-height:220px;max-height:420px}
.pl2-field svg{display:block;width:100%;height:100%}
.pl2-controls{display:flex;align-items:center;gap:1.2em;padding:.7rem 2rem .5rem;border-top:.5px solid var(--ink-2);opacity:.82}
.pl2-stage-label{font-size:.58rem;letter-spacing:.18em;color:var(--bistre);text-transform:uppercase;min-width:11em}
.pl2-slider{-webkit-appearance:none;appearance:none;flex:1;height:2px;background:var(--paper-3);outline:none;cursor:pointer;border-radius:0;accent-color:var(--ink)}
.pl2-slider:focus-visible{outline:1.5px solid var(--vermilion);outline-offset:4px}
.pl2-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:10px;height:18px;background:var(--ink);cursor:pointer;border-radius:0}
.pl2-slider::-moz-range-thumb{width:10px;height:18px;background:var(--ink);cursor:pointer;border-radius:0;border:none}
.pl2-annotations{display:flex;gap:2.4em;padding:.3rem 2rem .8rem;font-size:.52rem;letter-spacing:.18em;color:var(--ink-2);opacity:.6;text-transform:uppercase}
.pl2-reg-mark{position:absolute;top:.4rem;right:2rem;width:14px;height:14px;pointer-events:none;opacity:.28}
`;

// ─── MODULE ─────────────────────────────────────────────────────────────────
window.EscherPlate2.mount = function mount(root, api) {
  const S = 80;         // cell size in SVG units
  const N = 15;         // control points along the single authored arc
  const HALF = Math.PI / 2;

  // 4-colouring by (col,row) parity so no edge-adjacent pair shares a colour.
  const COLOURS = ['var(--paper)', 'var(--paper-2)', 'var(--bistre-2)', 'var(--teal)'];
  const par = n => ((n % 2) + 2) % 2;
  function tileColour(col, row) { return COLOURS[(par(row) * 2 + par(col)) % 4]; }

  // Orientation index k∈{0,1,2,3} for cell (c,r): the p4 pinwheel arrangement.
  function kOf(c, r) {
    const pc = par(c), pr = par(r);
    if (!pc && !pr) return 0;
    if (pc && !pr) return 3;
    if (!pc && pr) return 1;
    return 2;
  }

  // ── Arc keyframes: perpendicular offsets at N equi-spaced fractions of edge c0→c1 ──
  // Endpoints are 0 (corners are fixed lattice points). Only THIS arc is authored; the
  // other three tile edges are derived from it by 90° rotation (see baseTile). Positive
  // offset = outward (away from the cell). Shapes chosen so the pinwheel reads as an animal:
  //   REPTILE — one broad rounded LIMB lobe (peak ≈ ⅓ along) + a splayed foot, then a long
  //             concave neck-tuck (¾ along) into which the neighbouring lizard's head nestles.
  //   BIRD    — an asymmetric SWEPT WING: convex leading ramp to a sharp tip, then a deep
  //             concave trailing scoop; four of them wheel like a flock in flight.
  const KF = {
    S: new Array(N).fill(0),                                        // square (flat)
    R: [0, 4, 1, 8, 17, 21, 15, 11, 2, -5, -11, -10, -3, 2, 0],    // reptile limb + neck tuck
    B: [0, 5, 4, 1, 11, 23, 25, 11, -7, -18, -22, -14, -5, -1, 0], // bird swept wing
  };

  function lerpArr(a, b, t) { return a.map((v, i) => v + (b[i] - v) * t); }
  // Square→Reptile on [0,.5], Reptile→Bird on [.5,1].
  function arcOffsets(t) {
    if (t <= 0.5) return lerpArr(KF.S, KF.R, t * 2);
    return lerpArr(KF.R, KF.B, (t - 0.5) * 2);
  }

  function rot(cx, cy, ang, x, y) {
    const c = Math.cos(ang), s = Math.sin(ang), dx = x - cx, dy = y - cy;
    return [cx + dx * c - dy * s, cy + dx * s + dy * c];
  }

  // The single authored arc, corner c0(0,0) → c1(S,0), perpendicular (0,-1) = outward/up.
  function arcPts(off) {
    return off.map((o, i) => { const f = i / (N - 1); return [f * S, -o]; });
  }

  // Full tile outline in LOCAL coords (cell 0..S). Edge A = arc; B,C,D are A rotated −90°
  // about c1,c2,c3 in turn. Each rotation is reversed so the boundary stays a single loop.
  function baseTile(off) {
    const c1 = [S, 0], c2 = [S, S], c3 = [0, S];
    const A = arcPts(off);
    const B = A.map(p => rot(c1[0], c1[1], -HALF, p[0], p[1])).reverse();
    const C = B.map(p => rot(c2[0], c2[1], -HALF, p[0], p[1])).reverse();
    const D = C.map(p => rot(c3[0], c3[1], -HALF, p[0], p[1])).reverse();
    return [...A, ...B.slice(1), ...C.slice(1), ...D.slice(1)];
  }

  // Place a tile at cell (c,r): rotate the base outline k·90° about the cell centre, translate.
  function tilePath(off, tx, ty, k) {
    const base = baseTile(off);
    const pts = base.map(p => {
      const q = rot(S / 2, S / 2, k * HALF, p[0], p[1]);
      return [q[0] + tx, q[1] + ty];
    });
    return 'M' + pts.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' L') + ' Z';
  }

  // ── Interior engraving: authored in the LOCAL base frame, rotated with the tile, faded
  //    in with the morph. Reptile detail lives on the top-edge limb (its "head"); bird detail
  //    traces the leading wing. These tip an ambiguous silhouette into a recognisable animal.
  function detailPath(tx, ty, t, k) {
    if (t < 0.14) return '';
    const map = ([x, y]) => { const q = rot(S / 2, S / 2, k * HALF, x, y); return [q[0] + tx, q[1] + ty]; };
    const seg = arr => 'M' + arr.map(map).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
    const dot = (x, y, rd) => { const [cx, cy] = map([x, y]); return `M${(cx - rd).toFixed(1)},${cy.toFixed(1)} a${rd},${rd} 0 1,0 ${(rd * 2).toFixed(1)},0 a${rd},${rd} 0 1,0 ${(-rd * 2).toFixed(1)},0`; };
    const parts = [];
    // Reptile marks strongest around t=.5, birds around t=1; blend the two sets.
    const repFade = t <= 0.5 ? (t - 0.14) / 0.36 : 1 - (t - 0.5) * 2;
    const birdFade = t > 0.5 ? (t - 0.5) * 2 : 0;
    if (repFade > 0.12) {
      parts.push(dot(S * 0.36, S * 0.15, 2.2));                                   // eye
      parts.push(seg([[S * 0.29, S * 0.20], [S * 0.40, S * 0.05]]));              // snout / jaw
      parts.push(seg([[S * 0.44, S * 0.30], [S * 0.55, S * 0.50], [S * 0.49, S * 0.66]])); // backbone
      parts.push(seg([[S * 0.60, S * 0.42], [S * 0.72, S * 0.31]]));              // foreleg crease
    }
    if (birdFade > 0.12) {
      parts.push(dot(S * 0.52, S * 0.13, 1.9));                                   // eye near head
      parts.push(seg([[S * 0.40, S * 0.28], [S * 0.56, S * 0.09]]));              // leading wing bone
      parts.push(seg([[S * 0.46, S * 0.48], [S * 0.30, S * 0.38]]));              // trailing wing bone
    }
    return parts.join(' ');
  }

  // ── SVG element factory ───────────────────────────────────────────────────
  function svgel(tag, attrs, parent) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    if (parent) parent.appendChild(el);
    return el;
  }

  // ── DOM build ─────────────────────────────────────────────────────────────
  root.innerHTML = '';

  const hdr = document.createElement('div');
  hdr.className = 'pl2-header';
  hdr.setAttribute('aria-hidden', 'true');
  hdr.innerHTML = `
    <span class="pl2-plate-num">Plate II</span>
    <span class="pl2-title">Regular Division of the Plane</span>
    <span class="pl2-symmetry">Symmetry p4 · Cell 80² · t = <span id="pl2-t-readout">0.00</span></span>`;
  root.appendChild(hdr);

  const reg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  reg.setAttribute('class', 'pl2-reg-mark');
  reg.setAttribute('viewBox', '0 0 14 14');
  reg.setAttribute('aria-hidden', 'true');
  reg.innerHTML = '<line x1="7" y1="0" x2="7" y2="14" stroke="var(--ink)" stroke-width="0.5"/><line x1="0" y1="7" x2="14" y2="7" stroke="var(--ink)" stroke-width="0.5"/><circle cx="7" cy="7" r="3" fill="none" stroke="var(--ink)" stroke-width="0.5"/>';
  root.appendChild(reg);

  const field = document.createElement('div');
  field.className = 'pl2-field';
  root.appendChild(field);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  field.appendChild(svg);

  const ctrl = document.createElement('div');
  ctrl.className = 'pl2-controls';
  const lbl = document.createElement('label');
  lbl.className = 'pl2-stage-label';
  lbl.setAttribute('for', 'pl2-slider');
  lbl.textContent = 'LATTICE';
  ctrl.appendChild(lbl);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = 'pl2-slider';
  slider.className = 'pl2-slider';
  slider.min = '0';
  slider.max = '1000';
  slider.value = '0';
  slider.step = '1';
  slider.setAttribute('aria-label', 'Morph from square lattice through reptile to bird');
  ctrl.appendChild(slider);
  root.appendChild(ctrl);

  const ann = document.createElement('div');
  ann.className = 'pl2-annotations';
  ann.setAttribute('aria-hidden', 'true');
  ann.innerHTML = `
    <span>b₁ = (80, 0)</span>
    <span>b₂ = (0, 80)</span>
    <span id="pl2-ann-tiles">tiles: —</span>
    <span>area: 6400 u²</span>
    <span>p4 · 90° rotation</span>`;
  root.appendChild(ann);

  // ── Render state ──────────────────────────────────────────────────────────
  let currentT = api.reducedMotion ? 0.5 : 0;
  if (api.reducedMotion) slider.value = '500';

  const tReadout = hdr.querySelector('#pl2-t-readout');
  const annTiles = ann.querySelector('#pl2-ann-tiles');

  const tileGroup = svgel('g', {}, svg);
  const detailGroup = svgel('g', {
    fill: 'none', stroke: 'var(--ink)', 'stroke-width': '0.75',
    opacity: '0.55', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }, svg);

  const tilePaths = [];   // fill path els
  const detailPaths = []; // engraving path els
  let cols = 0, rows = 0;

  function stageLabel(t) {
    if (t < 0.08) return 'LATTICE';
    if (t < 0.42) return 'LATTICE → REPTILE';
    if (t < 0.58) return 'REPTILE';
    if (t < 0.92) return 'REPTILE → BIRD';
    return 'BIRD';
  }

  function resize() {
    const W = field.clientWidth || 800;
    const H = field.clientHeight || 260;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    cols = Math.ceil(W / S) + 2;
    rows = Math.ceil(H / S) + 2;
    const needed = cols * rows;
    while (tilePaths.length < needed) {
      const p = svgel('path', { stroke: 'var(--ink)', 'stroke-width': '0.5', 'stroke-linejoin': 'miter', 'vector-effect': 'non-scaling-stroke' }, tileGroup);
      tilePaths.push(p);
      detailPaths.push(svgel('path', {}, detailGroup));
    }
    annTiles.textContent = 'tiles: ' + (cols * rows);
    draw(currentT);
  }

  function draw(t) {
    const off = arcOffsets(t);
    const ox = -S, oy = -S;   // start one cell off-screen so the field bleeds to the edges
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tx = ox + c * S, ty = oy + r * S;
        const k = kOf(c, r);
        const el = tilePaths[idx];
        el.setAttribute('d', tilePath(off, tx, ty, k));
        el.setAttribute('fill', tileColour(c, r));
        detailPaths[idx].setAttribute('d', detailPath(tx, ty, t, k));
        idx++;
      }
    }
    while (idx < tilePaths.length) {
      tilePaths[idx].setAttribute('d', '');
      detailPaths[idx].setAttribute('d', '');
      idx++;
    }
    currentT = t;
    tReadout.textContent = t.toFixed(2);
    lbl.textContent = stageLabel(t);
  }

  // ── Reduced motion: static reptile state, slider still explorable ─────────
  if (api.reducedMotion) {
    resize();
    draw(0.5);
    slider.addEventListener('input', () => draw(parseInt(slider.value, 10) / 1000));
    window.addEventListener('resize', resize, { passive: true });
    return { destroy() { window.removeEventListener('resize', resize); } };
  }

  // ── Scroll-driven animation ───────────────────────────────────────────────
  let scrollT = 0;
  let sliderOverride = false;

  function getScrollT() {
    const rect = root.getBoundingClientRect();
    const vh = window.innerHeight;
    const entered = vh - rect.top;
    const total = rect.height + vh;
    return Math.max(0, Math.min(1, entered / total));
  }

  function tick() {
    if (!sliderOverride) {
      const st = getScrollT();
      if (Math.abs(st - scrollT) > 0.0005) { scrollT = st; draw(scrollT); }
    }
  }

  slider.addEventListener('input', () => {
    sliderOverride = true;
    draw(parseInt(slider.value, 10) / 1000);
  });
  window.addEventListener('scroll', () => { if (sliderOverride) sliderOverride = false; }, { passive: true });

  resize();
  window.addEventListener('resize', resize, { passive: true });

  let loop = null;
  api.onVisible(root,
    function onEnter() { loop = api.raf(tick); loop.start(); },
    function onExit() { if (loop) loop.stop(); }
  );

  return {
    destroy() {
      if (loop) loop.stop();
      window.removeEventListener('resize', resize);
    }
  };
};
