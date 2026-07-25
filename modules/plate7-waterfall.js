/* PLATE VII — "Waterfall" | window.EscherPlate7
   Penrose tribar + perpetual water circuit — genuine extruded carpentry.

   CONSTRUCTION (30°-rotated isometric, all in screen space)
   Three unit screen vectors 120° apart (the projected 3D axes X,Y,Z): e0,e1,e2
   with e0+e1+e2 = 0. A centreline walking Lc·e0, Lc·e1, Lc·e2 returns to its
   start PIXEL-EXACT — that vanishing sum IS the illusion. In 3D those moves
   climb a staircase and never close; only the projection folds the ends home.

   Each arm is a real square-section bar. Every vertex is a combination
   i·e0+j·e1+k·e2, so faces meet with ZERO slivers by construction — no
   half-plane clip-paths anywhere. Both endpoints of each bar are shifted back by
   one half-width (−h) along its axis; that single translation laps each bar over
   its neighbour with clean flush joints. Visible faces follow from the projection
   (its null axis is (1,1,1); the camera is on the +(1,1,1) side, so the +X,+Y,+Z
   faces show) and a fixed light gives +Z → --paper, +Y → --bistre-2,
   +X → --bistre + engraved hatch, under an --ink outline.

   CYCLIC OCCLUSION (A→B→C→A) is pure PAINT ORDER + one repainted end-cap: draw
   bodies A, B, C (B laps A at the right joint, C laps B at the left), then
   repaint arm A's far end-cap over C at the top joint. The explicitly computed
   cap lands exactly on the crossing bar's edges. Each corner alone is honest;
   the loop as a whole cannot exist.

   Water rides two invisible paths (getPointAtLength): a triangular top-channel
   loop and a vertical fall onto the mill wheel, which is phase-locked to the
   flow and fed by a splash burst — so the causal loop reads as continuous.
*/
window.EscherPlate7 = { id: 'waterfall' };

window.EscherPlate7.css = `
.plate--waterfall{position:relative;background:var(--paper);display:flex;flex-direction:column;align-items:center;padding:2.2rem 1rem 1.6rem;overflow:hidden;font-family:var(--font-body)}
.plate--waterfall .pl7-stage{position:relative;width:660px;max-width:100%}
.plate--waterfall .pl7-svg{display:block;width:100%;height:auto;overflow:visible}
.plate--waterfall .pl7-canvas{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}
.plate--waterfall .pl7-face{stroke:var(--ink);stroke-linejoin:miter;vector-effect:non-scaling-stroke}
.plate--waterfall .pl7-ann{font-family:var(--font-mono);font-size:9.5px;fill:var(--ink-2);letter-spacing:.12em}
.plate--waterfall .pl7-ann-h{fill:var(--ink)}
.plate--waterfall .pl7-verm{fill:var(--vermilion)}
.plate--waterfall .pl7-btn{margin-top:1.3rem;font-family:var(--font-mono);font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;background:none;border:1px solid var(--ink);color:var(--ink);padding:.5em 1.2em;cursor:pointer;outline-offset:3px}
.plate--waterfall .pl7-btn:focus-visible{outline:2px solid var(--teal)}
.plate--waterfall .pl7-btn:hover{background:var(--paper-2)}
.plate--waterfall .pl7-btn[disabled]{opacity:.5;cursor:default}
.plate--waterfall .pl7-lbl{margin-top:1rem;max-width:440px;text-align:center;font-size:.82rem;color:var(--ink-2);line-height:1.62}
.plate--waterfall .pl7-lbl em{font-style:italic;color:var(--ink)}
.plate--waterfall .pl7-note{font-family:var(--font-mono);font-size:.58rem;color:var(--ink-2);letter-spacing:.12em;text-align:center;margin:.6rem 0 0}
.plate--waterfall .pl7-hl{opacity:0;transition:opacity .35s}
.plate--waterfall .pl7-hl.on{opacity:1}
`;

window.EscherPlate7.mount = function (root, api) {
  root.classList.add('plate--waterfall');
  var NS = 'http://www.w3.org/2000/svg';
  var sq3 = Math.sqrt(3);

  /* ── projection: 30°-rotated isometric ── */
  var VBW = 600, VBH = 500;
  var Lc = 4;              // centreline arm length (lattice cells)
  var h = 0.55;           // section half-width
  var SC = 66;            // px per lattice unit
  var ROT = 30 * Math.PI / 180, cR = Math.cos(ROT), sR = Math.sin(ROT);
  var E0 = [{ x: sq3 / 2, y: 0.5 }, { x: -sq3 / 2, y: 0.5 }, { x: 0, y: -1 }];
  var E = E0.map(function (e) { return { x: e.x * cR - e.y * sR, y: e.x * sR + e.y * cR }; });
  // centre the ring: its screen bbox centroid is roughly at Lc/... compute + centre.
  var OX = VBW / 2, OY = VBH / 2 + 8;   // fine-tuned after measuring centroid
  function P(c) {
    return {
      x: OX + (c[0] * E[0].x + c[1] * E[1].x + c[2] * E[2].x) * SC,
      y: OY + (c[0] * E[0].y + c[1] * E[1].y + c[2] * E[2].y) * SC
    };
  }
  function ac(a, b, s) { return [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]; }
  var U = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  // viewer direction: the projection's null axis is (1,1,1) (moving along it
  // yields no screen displacement); the camera sits on the +(1,1,1) side, so a
  // face is visible iff its outward normal · (1,1,1) > 0 → the +X, +Y, +Z faces.
  var toV = [1, 1, 1];
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  /* centreline corners; centre the whole ring on the centroid of the 3 corners */
  var C0 = [0, 0, 0], C1 = ac(C0, U[0], Lc), C2 = ac(C1, U[1], Lc);
  (function () {
    var pc = [C0, C1, C2].map(P);
    var cx = (pc[0].x + pc[1].x + pc[2].x) / 3, cy = (pc[0].y + pc[1].y + pc[2].y) / 3;
    OX += VBW / 2 - cx; OY += VBH / 2 - cy;
  })();

  /* ── SVG scaffold ── */
  var STAGE = document.createElement('div');
  STAGE.className = 'pl7-stage';
  var svgEl = document.createElementNS(NS, 'svg');
  svgEl.setAttribute('viewBox', '0 0 ' + VBW + ' ' + VBH);
  svgEl.setAttribute('class', 'pl7-svg');
  svgEl.setAttribute('aria-hidden', 'true');
  STAGE.appendChild(svgEl);

  function mk(tag, attrs, par) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (par) par.appendChild(e);
    return e;
  }
  function poly(pts, attrs, par) {
    var s = pts.map(function (c) { var p = P(c); return p.x.toFixed(2) + ',' + p.y.toFixed(2); }).join(' ');
    return mk('polygon', Object.assign({ points: s, 'class': 'pl7-face' }, attrs), par);
  }

  /* hatch pattern for the +X shadow faces */
  var defs = mk('defs', {}, svgEl);
  var hpn = mk('pattern', { id: 'pl7-hp', patternUnits: 'userSpaceOnUse', width: '6', height: '6', patternTransform: 'rotate(18)' }, defs);
  mk('line', { x1: '0', y1: '0', x2: '0', y2: '6', stroke: 'var(--bistre-2)', 'stroke-width': '0.9', opacity: '0.6' }, hpn);

  /* ── fixed-light face shading by outward-normal axis ──
     The three visible face orientations are +Z (top), +Y and +X (the two near
     sides). A single fixed light gives a clean light→mid→dark ramp so every bar
     reads as a solid square-section bar and any pairing has contrast:
       +Z top   → --paper   (lightest)
       +Y side  → --bistre-2 (mid, light bistre)
       +X side  → --bistre    (deep shadow, carries the engraved hatch). */
  function faceFill(ax) {                     // ax: which 3D axis the normal is on
    if (ax === 2) return 'var(--paper)';      // +Z top
    if (ax === 1) return 'var(--bistre-2)';   // +Y side — mid
    return 'var(--bistre)';                   // +X side — deep shadow + hatch
  }
  function isShadow(ax) { return ax === 0; }  // +X faces get the cross-hatch

  /* Build one bar along axis a between centre-line corners ca0→cb0.
     Both corner endpoints are shifted back by one half-width (−h) along the
     bar's axis. That single translation is what interlocks the three bars into
     the tribar: each bar's near end overshoots its corner to lap over the arm
     arriving there, while its far end pulls in to tuck under the arm leaving —
     giving clean flush joints with no slivers or stray flaps.
     Returns visible face polygons (as coord arrays) + both end caps. */
  function bar(a, ca0, cb0) {
    var ca = ac(ca0, U[a], -h), cb = ac(cb0, U[a], -h);
    var others = [0, 1, 2].filter(function (i) { return i !== a; });
    var p = others[0], q = others[1];
    function cn(base, sp, sqv) { return ac(ac(base, U[p], sp * h), U[q], sqv * h); }
    var specs = [[p, 1], [p, -1], [q, 1], [q, -1]];
    var faces = [];
    specs.forEach(function (sp) {
      var ax = sp[0], sg = sp[1];
      var n = U[ax].map(function (v) { return v * sg; });
      if (dot(n, toV) <= 1e-9) return;
      var pts;
      if (ax === p) pts = [cn(ca, sg, 1), cn(cb, sg, 1), cn(cb, sg, -1), cn(ca, sg, -1)];
      else pts = [cn(ca, 1, sg), cn(cb, 1, sg), cn(cb, -1, sg), cn(ca, -1, sg)];
      faces.push({ ax: ax, pts: pts });
    });
    return {
      faces: faces,
      capA: [cn(ca, 1, 1), cn(ca, 1, -1), cn(ca, -1, -1), cn(ca, -1, 1)],
      capB: [cn(cb, 1, 1), cn(cb, 1, -1), cn(cb, -1, -1), cn(cb, -1, 1)]
    };
  }
  var barA = bar(0, C0, C1), barB = bar(1, C1, C2), barC = bar(2, C2, C0);

  function drawBar(b, g) {
    b.faces.forEach(function (f) {
      poly(f.pts, { fill: faceFill(f.ax), 'stroke-width': '1.5' }, g);
      if (isShadow(f.ax)) poly(f.pts, { fill: 'url(#pl7-hp)', stroke: 'none' }, g);
    });
  }
  function drawCap(pts, g) {
    poly(pts, { fill: 'var(--paper)', 'stroke-width': '1.5' }, g);
  }

  /* ── PAINT ORDER for the cyclic occlusion ──
     Draw the three bodies in order A, B, C. Drawing B after A closes the
     right-hand joint with B lapping A; drawing C after B closes the left-hand
     joint with C lapping B. Both are honest, depth-consistent laps. The single
     impossible override is then to repaint arm A's far end-cap ON TOP of C at
     the top joint, so A laps C there too — completing the 3-cycle (A→B→C→A)
     that no real solid can satisfy. Each corner examined alone is sound. */
  var gA = mk('g', {}, svgEl); drawBar(barA, gA);
  var gB = mk('g', {}, svgEl); drawBar(barB, gB);
  var gC = mk('g', {}, svgEl); drawBar(barC, gC);
  var gAcap = mk('g', {}, svgEl); drawCap(barA.capB, gAcap);   // A laps C (override)

  /* corner screen coords for water / wheel / highlights */
  var T0 = P(C0), T1 = P(C1), T2 = P(C2);   // T0 top, T1 lower-right, T2 lower-left

  /* ── Water circuit ──
     Invisible triangular loop through the three bar top-faces (corners lifted to
     z+h). Particles ride it via getPointAtLength — water descending along every
     arm yet closing on itself: the impossible circuit. */
  function chan(cn) { return P(ac(cn, U[2], h)); }
  var kT0 = chan(C0), kT1 = chan(C1), kT2 = chan(C2);
  var circuitD = ['M', kT0.x, kT0.y, 'L', kT1.x, kT1.y, 'L', kT2.x, kT2.y, 'Z'].join(' ');
  var circuitEl = mk('path', { d: circuitD, fill: 'none', stroke: 'none' }, svgEl);

  /* ── The fall + mill wheel in the inner void: the top corner spills straight
     down the open throat onto a wheel phase-locked to the flow. ── */
  var WR = 34;
  var WC = { x: T0.x, y: (T0.y + (T1.y + T2.y) / 2) / 2 + 46 };  // low in the void
  var fallX = kT0.x, fallTop = kT0.y + 4, fallBot = WC.y - WR - 4, splashY = fallBot + 2;

  var pathLen = 1;
  function getLen() { try { pathLen = circuitEl.getTotalLength() || 1; } catch (e) { pathLen = 1; } }

  // faint engraved guide for the fall
  mk('line', { x1: fallX, y1: fallTop, x2: fallX, y2: fallBot, stroke: 'var(--ink)', 'stroke-width': '0.5', 'stroke-dasharray': '4 3', opacity: '.45' }, svgEl);

  /* ── Mill wheel (phase-locked to the flow) ── */
  var wheelG = mk('g', {}, svgEl);
  mk('circle', { cx: WC.x, cy: WC.y, r: WR, fill: 'var(--paper-2)', stroke: 'var(--ink)', 'stroke-width': '1.5' }, wheelG);
  mk('circle', { cx: WC.x, cy: WC.y, r: WR + 4, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '0.75', opacity: '.5' }, wheelG);
  mk('circle', { cx: WC.x, cy: WC.y, r: '3.5', fill: 'var(--ink)' }, wheelG);
  var spokes = mk('g', {}, wheelG);
  for (var s = 0; s < 8; s++) {
    var ang = s * Math.PI / 4;
    mk('line', { x1: WC.x, y1: WC.y, x2: (WC.x + Math.cos(ang) * WR * .8).toFixed(2), y2: (WC.y + Math.sin(ang) * WR * .8).toFixed(2), stroke: 'var(--ink)', 'stroke-width': '1' }, spokes);
    var tx = WC.x + Math.cos(ang) * WR * .88, ty = WC.y + Math.sin(ang) * WR * .88, pp = ang + Math.PI / 2;
    mk('line', {
      x1: (tx + Math.cos(pp) * 8).toFixed(2), y1: (ty + Math.sin(pp) * 8).toFixed(2),
      x2: (tx - Math.cos(pp) * 8).toFixed(2), y2: (ty - Math.sin(pp) * 8).toFixed(2),
      stroke: 'var(--bistre)', 'stroke-width': '2.2'
    }, spokes);
  }

  /* ── Joint highlight rings ("spot the lie") ── */
  var hlEls = [T0, T1, T2].map(function (pp) {
    var g = mk('g', { 'class': 'pl7-hl' }, svgEl);
    mk('circle', { cx: pp.x, cy: pp.y, r: '36', fill: 'none', stroke: 'var(--vermilion)', 'stroke-width': '1.75', 'stroke-dasharray': '5 4' }, g);
    var t = mk('text', { x: (pp.x + 40).toFixed(1), y: (pp.y - 26).toFixed(1), 'class': 'pl7-verm', 'font-family': 'var(--font-mono)', 'font-size': '11', 'letter-spacing': '1' }, g);
    t.textContent = 'LIE?';
    return g;
  });

  /* ── Annotations (mono, anchored in the SVG margins near the object) ── */
  var annG = mk('g', { 'class': 'pl7-ann' }, svgEl);
  function annLine(x, y, txt, head) {
    var t = mk('text', { x: x, y: y, 'class': head ? 'pl7-ann pl7-ann-h' : 'pl7-ann' }, annG);
    t.textContent = txt; return t;
  }
  annLine(14, 26, '→ X  (√3/2, 1/2)');
  annLine(14, 42, '← Y  (-√3/2, 1/2)');
  annLine(14, 58, '↑ Z  (0, -1)');
  annLine(14, 78, 'Σ e = 0', true);
  annLine(VBW - 132, 30, 'PERPETUAL', true);
  annLine(VBW - 132, 45, 'MOTION');
  annLine(VBW - 132, 65, 'η = ∞', true);

  /* ── Canvas for water particles ── */
  var canvas = document.createElement('canvas');
  canvas.className = 'pl7-canvas';
  STAGE.appendChild(canvas);
  var ctx = null, canW = VBW, dpr = Math.max(1, window.devicePixelRatio || 1);
  function scaleF() { return canW / VBW; }
  function resizeCan() {
    var r = STAGE.getBoundingClientRect(), w = r.width || VBW;
    canW = w;
    var hpx = VBH * (w / VBW);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(hpx * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = hpx + 'px';
  }

  var TEAL = '29,106,104';   // = --teal (#1D6A68); canvas 2D cannot read CSS vars
  // circuit particles ride the triangular top-channel loop
  var POOL = 120;
  var parts = Array.from({ length: POOL }, function () {
    return { u: Math.random(), speed: .05 + Math.random() * .028, jitter: (Math.random() - .5) * 4.2, alpha: .4 + Math.random() * .45, len: 5 + Math.random() * 5 };
  });
  // fall particles stream straight down the throat, then respawn at the top
  var FALL = 26;
  var fall = Array.from({ length: FALL }, function () {
    return { v: Math.random(), speed: .5 + Math.random() * .35, off: (Math.random() - .5) * 5, alpha: .4 + Math.random() * .5, len: 6 + Math.random() * 7 };
  });
  var SDROP = 28;
  var drops = Array.from({ length: SDROP }, function () { return { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1 }; });
  var splashT = 0;

  function onCircuit(u) {
    try { var p = circuitEl.getPointAtLength((((u % 1) + 1) % 1) * pathLen); var f = scaleF(); return { x: p.x * f, y: p.y * f }; }
    catch (e) { return { x: VBW / 2 * scaleF(), y: VBH / 2 * scaleF() }; }
  }
  function spawnDrop() {
    for (var d = 0; d < SDROP; d++) if (!drops[d].active) {
      var f = scaleF();
      drops[d] = { active: true, x: fallX * f, y: splashY * f, vx: (Math.random() - .5) * 2.6, vy: -Math.random() * 3.4, life: 0, maxLife: .5 + Math.random() * .5 };
      break;
    }
  }

  var wheelAngle = 0;
  function drawFrame(dt) {
    if (!ctx) return;
    var dtS = Math.min(dt / 1000, .05), f = scaleF();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';

    /* circuit: short directional engraved strokes tangent to the loop */
    parts.forEach(function (p) {
      p.u = (p.u + p.speed * dtS) % 1;
      var pos = onCircuit(p.u), nxt = onCircuit(p.u + .006);
      var dx = nxt.x - pos.x, dy = nxt.y - pos.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / L, ny = dx / L;
      var px = pos.x + nx * p.jitter, py = pos.y + ny * p.jitter;
      ctx.beginPath();
      ctx.moveTo(px - dx * p.len / L, py - dy * p.len / L);
      ctx.lineTo(px + dx * (p.len * .5) / L, py + dy * (p.len * .5) / L);
      ctx.strokeStyle = 'rgba(' + TEAL + ',' + p.alpha + ')';
      ctx.lineWidth = 1.5; ctx.stroke();
    });

    /* the fall: vertical directional strokes down the throat */
    var fTop = fallTop * f, fBot = splashY * f, fX = fallX * f;
    fall.forEach(function (p) {
      p.v += p.speed * dtS; if (p.v > 1) p.v -= 1;
      var y = fTop + (fBot - fTop) * p.v, x = fX + p.off;
      ctx.beginPath();
      ctx.moveTo(x, y - p.len); ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(' + TEAL + ',' + p.alpha + ')';
      ctx.lineWidth = 1.6; ctx.stroke();
    });

    /* splash burst where the fall meets the wheel */
    splashT -= dtS;
    if (splashT < 0) { spawnDrop(); splashT = .04 + Math.random() * .05; }
    drops.forEach(function (d) {
      if (!d.active) return;
      d.vy += 7 * dtS; d.x += d.vx; d.y += d.vy; d.life += dtS;
      if (d.life >= d.maxLife) { d.active = false; return; }
      var a = (1 - d.life / d.maxLife) * .8;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.vx * .8, d.y - d.vy * .8);
      ctx.strokeStyle = 'rgba(' + TEAL + ',' + a + ')'; ctx.lineWidth = 1.6; ctx.stroke();
    });

    wheelAngle -= 2.6 * dtS;   // phase-locked to the downward flow
    spokes.setAttribute('transform', 'rotate(' + (wheelAngle * 180 / Math.PI).toFixed(2) + ' ' + WC.x + ' ' + WC.y + ')');
  }

  function arrowHead(p1, ux, uy) {
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p1.x - ux * 7 + uy * 3.5, p1.y - uy * 7 - ux * 3.5);
    ctx.lineTo(p1.x - ux * 7 - uy * 3.5, p1.y - uy * 7 + ux * 3.5);
    ctx.closePath(); ctx.fillStyle = 'rgba(' + TEAL + ',.6)'; ctx.fill();
  }
  function drawStatic() {   // reduced-motion: static loop + fall with flow arrows
    if (!ctx) return;
    var f = scaleF();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    for (var k = 0; k < 60; k++) {
      var p0 = onCircuit(k / 60), p1 = onCircuit((k + .5) / 60);
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = 'rgba(' + TEAL + ',.5)'; ctx.lineWidth = 1.6; ctx.stroke();
      if (k % 10 === 4) {
        var dx = p1.x - p0.x, dy = p1.y - p0.y, dl = Math.sqrt(dx * dx + dy * dy) || 1;
        arrowHead(p1, dx / dl, dy / dl);
      }
    }
    // the fall as a dashed descending stroke with a downward arrow
    ctx.beginPath(); ctx.moveTo(fallX * f, fallTop * f); ctx.lineTo(fallX * f, splashY * f);
    ctx.strokeStyle = 'rgba(' + TEAL + ',.5)'; ctx.lineWidth = 1.8; ctx.stroke();
    arrowHead({ x: fallX * f, y: splashY * f }, 0, 1);
  }

  /* ── "Trace the circuit" button ── */
  var btn = document.createElement('button');
  btn.className = 'pl7-btn';
  btn.textContent = 'TRACE THE CIRCUIT';
  btn.setAttribute('aria-label', 'Trace the impossible water circuit and reveal the three impossible joints');
  var tracing = false;
  btn.addEventListener('click', function () {
    if (tracing) return; tracing = true; btn.setAttribute('disabled', '');
    // trace the closed loop then the fall, revealing the three joints
    var traceD = ['M', kT0.x, kT0.y, 'L', kT1.x, kT1.y, 'L', kT2.x, kT2.y, 'Z',
      'M', fallX, fallTop, 'L', fallX, fallBot].join(' ');
    var tp = mk('path', { d: traceD, fill: 'none', stroke: 'var(--vermilion)', 'stroke-width': '3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svgEl);
    var tl = 1; try { tl = tp.getTotalLength() || 1; } catch (e) { tl = 1; }
    tp.setAttribute('stroke-dasharray', String(tl));
    tp.setAttribute('stroke-dashoffset', String(tl));
    tp.setAttribute('opacity', '.9');
    var t0 = null, dur = 2400;
    function stepT(ts) {
      if (!t0) t0 = ts;
      var pr = Math.min((ts - t0) / dur, 1);
      tp.setAttribute('stroke-dashoffset', String(tl * (1 - pr)));
      if (pr < 1) { requestAnimationFrame(stepT); return; }
      hlEls.forEach(function (e) { e.classList.add('on'); });
      setTimeout(function () {
        hlEls.forEach(function (e) { e.classList.remove('on'); });
        setTimeout(function () { if (tp.parentNode) svgEl.removeChild(tp); tracing = false; btn.removeAttribute('disabled'); }, 700);
      }, 2200);
    }
    requestAnimationFrame(stepT);
  });

  /* ── Museum label ── */
  var lbl = document.createElement('p');
  lbl.className = 'pl7-lbl';
  lbl.innerHTML = 'PLATE VII &mdash; <em>Waterfall</em>. A Penrose tribar supports a closed aqueduct. ' +
    'Water descends at every point and yet returns to its source; the mill wheel turns without end. ' +
    'Efficiency: &#951;&thinsp;=&thinsp;&#x221E;. Inspect each corner alone &mdash; all is honest carpentry.';

  /* ── Assemble ── */
  root.appendChild(STAGE);
  root.appendChild(btn);
  root.appendChild(lbl);

  /* ── Init ── */
  getLen();
  ctx = canvas.getContext('2d');
  resizeCan();

  var ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(function () { resizeCan(); if (api.reducedMotion) drawStatic(); });
    ro.observe(STAGE);
  }

  if (api.reducedMotion) {
    drawStatic();
    var note = document.createElement('p');
    note.className = 'pl7-note';
    note.textContent = 'MOTION SUPPRESSED — REDUCED-MOTION ENABLED';
    root.appendChild(note);
  }

  var loop = api.raf(function (dt) { drawFrame(dt); });
  api.onVisible(root,
    function () { if (!api.reducedMotion) { getLen(); resizeCan(); loop.start(); } },
    function () { loop.stop(); }
  );

  return { destroy: function () { loop.stop(); if (ro) ro.disconnect(); } };
};
