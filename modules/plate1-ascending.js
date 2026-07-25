/* PLATE I — "Ascending and Descending" | window.EscherPlate1
   The hero / overture. A closed Penrose staircase — one continuous stepped ribbon —
   turning four corners around a sunken light-well on a monastery tower, two files of
   figures walking it forever, and the site title woven through the top steps.

   THE CLOSED IMPOSSIBLE CIRCUIT  (construction, not a picture of one)
   ------------------------------------------------------------------
   Dimetric ground basis: two screen axes A=(HW,HH) and B=(-HW,HH). We walk a
   quadrilateral plan — four flights joined by four corner LANDINGS. Each ordinary
   step advances one ground unit along its flight's travel axis (±A / ±B) AND is
   lifted by a fixed screen amount. THREE flights use a gentle rise (+RISE); the
   FOURTH — the "impossible" flight — uses -3*RISE. Landings are level (lift 0).
   Summing the loop: the ground displacements cancel (a closed quadrilateral) and the
   lifts cancel exactly because 3*(PER*RISE) + PER*(-3*RISE) = 0. The walk returns to
   its start PIXEL-EXACT — the loop closes — yet every flight, read with its risers,
   climbs. The whole accumulated height is folded into the one steep flight whose drop
   is swallowed where the tower mass occludes it. Follow any run and it is sound
   carpentry; follow the circuit and you have risen forever and come home.

   ONE UNBROKEN RIBBON
   -------------------
   Every step is a SOLID block: a top tread (a parallelogram aligned to the flight's
   travel axis), two side faces, and a front riser — all extruded down by DEPTH so
   consecutive blocks abut and occlude, reading as one band, not floating plates. The
   tread of step N+1 shares step N's forward edge, offset up by exactly the step's
   lift, so the front riser bridges the gap with no seam. The band rests on a tower
   mass: a light stone roof (the convex footprint of the band) with two wall faces
   (lit + hatched-shadow) dropping to a level base; the back flights pass BEHIND the
   tower silhouette. A sunken, cross-hatched light-well is recessed at the centre.

   THE WOVEN TITLE
   ---------------
   The title is typeset TWICE. One copy sits UNDER the staircase group, so the top-back
   steps paint over it. A second identical copy sits OVER the staircase but is clipped
   to alternating top-back treads: the glyphs crossing those treads re-emerge in FRONT
   while the runs between stay BEHIND. Same glyph run, two depths.
*/
window.EscherPlate1 = { id: 'ascending' };

window.EscherPlate1.css = `.plate--ascending{position:relative;min-height:100vh;background:var(--paper);color:var(--ink);display:flex;flex-direction:column;justify-content:center;align-items:center;overflow:hidden;font-family:var(--font-body);padding:3rem 1rem 4rem}
/* The stage is sized against the VIEWPORT, not a fixed pixel cap, so the overture fills the
   screen it is given instead of floating on dead paper. min() keeps it from overflowing a
   narrow window; the vh term stops a short-and-wide window from scaling it past the fold. */
.plate--ascending .pl1-stage{position:relative;width:min(96vw, 168vh, 1560px);max-width:100%;margin:0 auto}
.plate--ascending .pl1-svg{display:block;width:100%;height:auto;overflow:visible;
  /* the impression the press leaves: the object sits IN the sheet, not on top of it */
  filter:drop-shadow(0 18px 26px color-mix(in srgb, var(--ink) 13%, transparent))}
/* Vignette — the light falls off toward the deckle edges of the paper. Behind everything. */
.plate--ascending .pl1-vig{position:absolute;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(120% 85% at 50% 42%, transparent 52%, color-mix(in srgb, var(--ink) 9%, transparent) 100%)}
.plate--ascending .pl1-stage,.plate--ascending .pl1-caption{position:relative;z-index:1}
.plate--ascending .pl1-tread{fill:var(--paper);stroke:var(--ink);stroke-width:1.1;stroke-linejoin:miter}
.plate--ascending .pl1-landing{fill:var(--paper-2)}
.plate--ascending .pl1-riser{fill:var(--paper-3);stroke:var(--ink);stroke-width:1;stroke-linejoin:miter}
.plate--ascending .pl1-side{fill:var(--bistre-2);stroke:var(--ink);stroke-width:1;stroke-linejoin:miter}
.plate--ascending .pl1-side-dk{fill:var(--bistre);stroke:var(--ink);stroke-width:1;stroke-linejoin:miter}
.plate--ascending .pl1-boxTop{fill:var(--paper-3);stroke:var(--ink);stroke-width:1.5;stroke-linejoin:miter}
.plate--ascending .pl1-boxL{fill:var(--bistre);stroke:var(--ink);stroke-width:1.5;stroke-linejoin:miter}
.plate--ascending .pl1-boxR{fill:var(--paper-2);stroke:var(--ink);stroke-width:1.5;stroke-linejoin:miter}
.plate--ascending .pl1-well{fill:var(--bistre);stroke:var(--ink);stroke-width:1;stroke-linejoin:miter}
.plate--ascending .pl1-fig{fill:var(--ink);stroke:none}
.plate--ascending .pl1-title-glyph{font-family:var(--font-display);font-weight:700;fill:var(--ink);letter-spacing:.015em}
.plate--ascending .pl1-byline-glyph{font-family:var(--font-mono);fill:var(--ink-2);letter-spacing:.36em}
.plate--ascending .pl1-title-under{opacity:.9}
.plate--ascending .pl1-scroll{position:absolute;left:50%;bottom:1.1rem;transform:translateX(-50%);font-family:var(--font-mono);font-size:.62rem;letter-spacing:.26em;text-transform:uppercase;color:var(--ink-2);text-align:center;line-height:1.9;opacity:.8}
.plate--ascending .pl1-scroll .pl1-arrow{display:block;font-size:.8rem;margin-top:.3em;opacity:.7;
  animation:pl1-breathe 3.4s ease-in-out infinite}
@keyframes pl1-breathe{0%,100%{transform:translateY(0);opacity:.45}50%{transform:translateY(4px);opacity:.9}}
@media (prefers-reduced-motion:reduce){.plate--ascending .pl1-scroll .pl1-arrow{animation:none;opacity:.7}}
.plate--ascending .pl1-ann{position:absolute;top:1.4rem;left:1.4rem;font-family:var(--font-mono);font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);line-height:1.85;opacity:.72;max-width:12rem}
.plate--ascending .pl1-ann p{margin:0}
.plate--ascending .pl1-ann .pl1-rule{width:2.2rem;border-top:.5px solid var(--ink-2);margin:.5em 0}
.plate--ascending .pl1-caption{margin-top:1.8rem;max-width:34rem;text-align:center;font-size:.82rem;line-height:1.65;color:var(--ink-2)}
.plate--ascending .pl1-caption .pl1-num{font-family:var(--font-display);letter-spacing:.14em;color:var(--ink);text-transform:uppercase}
.plate--ascending .pl1-caption em{font-style:italic;color:var(--ink)}
.plate--ascending .pl1-reg{position:absolute;width:15px;height:15px;pointer-events:none;opacity:.32}
.plate--ascending .pl1-reg.tl{top:.7rem;left:.7rem}.plate--ascending .pl1-reg.tr{top:.7rem;right:.7rem}
.plate--ascending .pl1-reg.bl{bottom:.7rem;left:.7rem}.plate--ascending .pl1-reg.br{bottom:.7rem;right:.7rem}
@media (max-width:480px){.plate--ascending{padding:2.4rem .6rem 3.4rem;min-height:auto}
.plate--ascending .pl1-stage{width:100%}
.plate--ascending .pl1-ann{font-size:.5rem;max-width:8.5rem;top:.9rem;left:.9rem}
.plate--ascending .pl1-caption{font-size:.74rem}}
`;

window.EscherPlate1.mount = function mount(root, api) {
  root.classList.add('plate--ascending');
  root.innerHTML = '';
  var NS = 'http://www.w3.org/2000/svg';

  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function poly(pts, attrs, parent) {
    return mk('polygon', Object.assign(
      { points: pts.map(function (p) { return p.x.toFixed(2) + ',' + p.y.toFixed(2); }).join(' ') },
      attrs || {}), parent);
  }
  var va = function (a, b) { return { x: a.x + b.x, y: a.y + b.y }; };
  var vs = function (a, b) { return { x: a.x - b.x, y: a.y - b.y }; };
  var vm = function (a, s) { return { x: a.x * s, y: a.y * s }; };

  // ── GEOMETRY (verified: loop closes on (0,0); 3*RISE + (-3*RISE) per flight = 0) ──
  var PER = 4;                          // ordinary steps per flight
  var HW = 46, HH = 23;                 // ground-unit screen half-width / half-height (dimetric)
  var RISE = 11;                        // gentle screen lift per step
  var STEEP = -3 * RISE;                // impossible-flight lift → the four lifts cancel
  var STEEP_SIDE = 2;                   // which flight carries the fold
  var DEPTH = 34;                       // drawn block height (tread → riser/side base)
  var BASE = 78;                        // tower wall height below the band's low edge
  var CORNER_W = 1.35;                  // landing treads are wider so the turn reads
  var A = { x: HW, y: HH }, B = { x: -HW, y: HH };
  // travel per flight: +A, +B, -A, -B (a closed quadrilateral in the ground plane)
  var dirs = [{ x: HW, y: HH }, { x: -HW, y: HH }, { x: -HW, y: -HH }, { x: HW, y: -HH }];

  // Walk the loop. Each flight is preceded by a level corner landing.
  var seq = [], f, k;
  for (f = 0; f < 4; f++) { seq.push({ t: 'corner', f: f }); for (k = 0; k < PER; k++) seq.push({ t: 'step', f: f, k: k }); }
  var nodes = [], P = { x: 0, y: 0 };
  seq.forEach(function (s) {
    var lift = s.t === 'corner' ? 0 : (s.f === STEEP_SIDE ? STEEP : RISE);
    nodes.push({ x: P.x, y: P.y, f: s.f, t: s.t, k: s.k, lift: lift, steep: s.f === STEEP_SIDE });
    var d = dirs[s.f]; P = { x: P.x + d.x, y: P.y + d.y - lift };
  });
  var CLOSE_ERR = Math.hypot(P.x, P.y);           // 0 by construction; annotation stays honest
  var N = nodes.length;                           // 20 (16 steps + 4 landings)

  // A step's top parallelogram + solid block (dropped by DEPTH). Tread is aligned to the
  // flight's travel axis; width runs along the OTHER ground axis (so treads abut cleanly).
  function widthAxis(fi) { return (fi === 0 || fi === 2) ? B : A; }
  function faces(n) {
    var tv = dirs[n.f], wv = widthAxis(n.f);
    var half = vm(wv, (n.t === 'corner' ? CORNER_W : 1) / 2);
    var nd = { x: n.x, y: n.y };
    var bL = vs(nd, half), bR = va(nd, half);
    var fL = vs(va(nd, tv), half), fR = va(va(nd, tv), half);
    return { bL: bL, bR: bR, fL: fL, fR: fR, top: [bL, bR, fR, fL], n: n, tv: tv };
  }
  var S = nodes.map(faces);
  // painter order: far (small y) → near (large y) by tread centroid
  function cenY(s) { return (s.bL.y + s.bR.y + s.fR.y + s.fL.y) / 4; }
  function cenX(s) { return (s.bL.x + s.bR.x + s.fR.x + s.fL.x) / 4; }
  var order = S.map(function (s, i) { return i; }).sort(function (a, b) { return cenY(S[a]) - cenY(S[b]); });

  // convex hull of all tread vertices → the tower's roof footprint
  function hull(ps) {
    var pts = ps.slice().sort(function (a, b) { return a.x - b.x || a.y - b.y; });
    var cr = function (o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); };
    var lo = [], hi = [], i, j;
    for (i = 0; i < pts.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pts[i]) <= 0) lo.pop(); lo.push(pts[i]); }
    for (j = pts.length - 1; j >= 0; j--) { while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], pts[j]) <= 0) hi.pop(); hi.push(pts[j]); }
    lo.pop(); hi.pop(); return lo.concat(hi);
  }
  var allV = []; S.forEach(function (s) { allV.push(s.bL, s.bR, s.fL, s.fR); });
  var H = hull(allV);
  var baseY = Math.max.apply(null, H.map(function (p) { return p.y; })) + BASE;

  // ── figure bounds → viewBox (title headroom folded in once titleSize is known) ──
  var xs = [], ys = [];
  S.forEach(function (s) { [s.bL, s.bR, s.fR, s.fL].forEach(function (p) { xs.push(p.x); ys.push(p.y + DEPTH); }); });
  H.forEach(function (p) { xs.push(p.x); }); ys.push(baseY);
  var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
  var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
  var CX = (minX + maxX) / 2, figW = maxX - minX;

  // title metrics (depend only on figure width)
  var TITLE = 'REGULAR DIVISION OF THE PLANE';
  var BYLINE = 'M.C. ESCHER';
  var titleSize = Math.max(26, figW * 0.049);
  var bylineSize = titleSize * 0.30;
  var titleCX = CX;
  // The title clears the architecture. Measured: at baseline = minY - 0.10*titleSize only ONE
  // step-top enters the cap band, and the tower's roof HULL — which rises above every step —
  // cuts straight through the middle words. There is nothing worth weaving through up there,
  // so the honest move is to lift the type off the building entirely and let the woven effect
  // come from the one element that genuinely crosses it: the near roof ridge, handled by the
  // ridge-weave clip below.
  var titleCY = minY - titleSize * 0.62;

  var padX = 40;
  var padTop = titleSize * 2.9;                  // room for woven title + byline above it
  var padBot = 30;
  var vbX = minX - padX, vbY = minY - padTop;
  var vbW = figW + padX * 2, vbH = (maxY - minY) + padTop + padBot;

  var vig = document.createElement('div');
  vig.className = 'pl1-vig';
  vig.setAttribute('aria-hidden', 'true');
  root.appendChild(vig);

  var stage = document.createElement('div');
  stage.className = 'pl1-stage';
  var svg = mk('svg', {
    'class': 'pl1-svg', 'aria-hidden': 'true',
    viewBox: [vbX.toFixed(1), vbY.toFixed(1), vbW.toFixed(1), vbH.toFixed(1)].join(' '),
    preserveAspectRatio: 'xMidYMid meet', xmlns: NS
  }, stage);
  root.appendChild(stage);

  var defs = mk('defs', {}, svg);
  var hp = mk('pattern', { id: 'pl1-hatch', patternUnits: 'userSpaceOnUse', width: '5', height: '5', patternTransform: 'rotate(45)' }, defs);
  mk('line', { x1: '0', y1: '0', x2: '0', y2: '5', stroke: 'var(--ink)', 'stroke-width': '0.6', opacity: '0.5' }, hp);

  // byline sits ABOVE the title (clear of the staircase); title weaves through steps
  var titleLayers = [];
  function makeByline() {
    var g = mk('g', {}, svg);
    var b = mk('text', {
      x: titleCX.toFixed(1), y: (titleCY - titleSize * 1.02).toFixed(1), 'text-anchor': 'middle',
      'class': 'pl1-byline-glyph', 'font-size': bylineSize.toFixed(1)
    }, g);
    b.textContent = BYLINE;
    titleLayers.push(g);
  }
  function makeTitleText(cls) {
    var gEl = mk('g', {}, svg);
    var t = mk('text', {
      x: titleCX.toFixed(1), y: titleCY.toFixed(1), 'text-anchor': 'middle',
      'class': 'pl1-title-glyph ' + cls, 'font-size': titleSize.toFixed(1)
    }, gEl);
    t.textContent = TITLE;
    if (cls === 'pl1-title-under') titleLayers.push(gEl);
    return gEl;
  }
  // NB: NEITHER the byline nor the UNDER title is painted here. The tower mass below is an
  // opaque silhouette, and drawing type before it let the roof slice the artist's signature
  // to "M.C. E" and swallow whole words of the title. Both go down *after* the tower:
  // the byline entirely on top (a signature is never occluded), the title between tower and
  // ribbon so the individual treads — not the whole roof — are what weave through it.

  // ── TOWER MASS (drawn first, behind the band) ──
  // Roof = the hull (light stone). Two wall faces drop straight to a level base from the
  // band's viewer-facing lower boundary; the near corner splits shadow (hatched) / lit.
  var blockG = mk('g', {}, svg);
  var leftP = H.reduce(function (a, b) { return b.x < a.x ? b : a; });
  var rightP = H.reduce(function (a, b) { return b.x > a.x ? b : a; });
  var bottomP = H.reduce(function (a, b) { return b.y > a.y ? b : a; });
  var nH = H.length;
  function chain(iS, iE, st) { var arr = [], i = iS, g = 0; while (true) { arr.push(H[i]); if (i === iE) break; i = (i + st + nH) % nH; if (++g > 4 * nH) break; } return arr; }
  var iL = H.indexOf(leftP), iR = H.indexOf(rightP);
  var f1 = chain(iL, iR, 1), f2 = chain(iL, iR, -1);
  var front = (f1.indexOf(bottomP) >= 0) ? f1 : f2;   // the lower, viewer-facing hull boundary
  poly(H, { 'class': 'pl1-boxTop' }, blockG);          // stone roof top
  var bi = front.indexOf(bottomP); if (bi < 0) bi = Math.floor(front.length / 2);
  function wall(ch, cls, hatch) {
    if (ch.length < 2) return;
    var pts = ch.concat(ch.slice().reverse().map(function (p) { return { x: p.x, y: baseY }; }));
    poly(pts, { 'class': cls }, blockG);
    if (hatch) poly(pts, { fill: 'url(#pl1-hatch)', stroke: 'none' }, blockG);
  }
  wall(front.slice(0, bi + 1), 'pl1-boxL', true);      // shadow wall (hatched)
  wall(front.slice(bi), 'pl1-boxR', false);            // lit wall
  mk('line', { x1: bottomP.x.toFixed(1), y1: bottomP.y.toFixed(1), x2: bottomP.x.toFixed(1), y2: baseY.toFixed(1), stroke: 'var(--ink)', 'stroke-width': '1.5' }, blockG);

  // ── SUNKEN LIGHT-WELL (recessed, cross-hatched) at the centre of the ring ──
  var wellG = mk('g', {}, svg);
  var gc = { x: H.reduce(function (a, p) { return a + p.x; }, 0) / H.length, y: H.reduce(function (a, p) { return a + p.y; }, 0) / H.length };
  function innerOf(i) {
    var r = [S[i].bL, S[i].bR, S[i].fL, S[i].fR], best = r[0], bd = Infinity;
    r.forEach(function (p) { var d = (p.x - gc.x) * (p.x - gc.x) + (p.y - gc.y) * (p.y - gc.y); if (d < bd) { bd = d; best = p; } });
    return best;
  }
  var midK = Math.floor(PER / 2), wellPts = [];
  nodes.forEach(function (n, i) { if (n.t === 'step' && n.k === midK) wellPts.push(innerOf(i)); });
  var wc = { x: wellPts.reduce(function (a, p) { return a + p.x; }, 0) / wellPts.length, y: wellPts.reduce(function (a, p) { return a + p.y; }, 0) / wellPts.length };
  wellPts.sort(function (a, b) { return Math.atan2(a.y - wc.y, a.x - wc.x) - Math.atan2(b.y - wc.y, b.x - wc.x); });
  poly(wellPts, { 'class': 'pl1-well' }, wellG);
  poly(wellPts, { fill: 'url(#pl1-hatch)', stroke: 'none', opacity: '0.55' }, wellG);

  // (1) UNDER copy of the title — sits above the opaque tower, below the stair blocks,
  // so the individual treads (not the whole roof) are what occlude the glyphs.
  makeTitleText('pl1-title-under');
  // (byline is painted at the very end of the build — after the ribbon and the figures —
  //  because anything drawn later would slice it. A signature is never occluded.)

  // ── STAIR RIBBON (painter order back→front; each step a solid block) ──
  var stairG = mk('g', {}, svg);
  order.forEach(function (i) {
    var s = S[i], n = s.n, dn = function (p) { return { x: p.x, y: p.y + DEPTH }; };
    var frontR = [s.fL, s.fR, dn(s.fR), dn(s.fL)];   // viewer-facing riser
    var sideR = [s.bR, s.fR, dn(s.fR), dn(s.bR)];    // right side wall
    var sideL = [s.bL, s.fL, dn(s.fL), dn(s.bL)];    // left side wall
    var shade = (n.f === 0 || n.f === 3);            // two flights read as the shadow side
    var scls = shade ? 'pl1-side-dk' : 'pl1-side';
    poly(sideR, { 'class': scls }, stairG);
    poly(sideL, { 'class': scls }, stairG);
    if (shade) {
      poly(sideR, { fill: 'url(#pl1-hatch)', stroke: 'none', opacity: '0.4' }, stairG);
      poly(sideL, { fill: 'url(#pl1-hatch)', stroke: 'none', opacity: '0.4' }, stairG);
    }
    poly(frontR, { 'class': 'pl1-riser' }, stairG);
    poly(s.top, { 'class': 'pl1-tread' + (n.t === 'corner' ? ' pl1-landing' : '') }, stairG);
  });

  // ── OVER copy of the title, clipped to ALTERNATING top-back treads → weave ──
  // Find the top-back steps (smallest tread-centre y) the lowered title actually crosses,
  // then clip the OVER title to every other one so the glyph line dips behind / before.
  // Select the steps whose tread actually intersects the title's cap-height band, ordered
  // left→right, then reveal the OVER copy on every other one. Picking by depth order (the
  // previous approach) could miss the treads sitting on the middle words, so whole runs of
  // glyphs stayed buried — this way the weave alternates across the entire title and no
  // stretch of the line is ever fully lost.
  // The element that genuinely crosses the lifted title is the roof HULL (its apex rises
  // above every step). So the weave is cut against the hull: the OVER copy is revealed only
  // OUTSIDE the hull silhouette, which makes the glyphs pass BEHIND the roof where they meet
  // it and sit IN FRONT of the paper either side. Two windows, left and right of the apex,
  // built from the hull's own bounding geometry — no magic numbers, no empty clip.
  var hullXs = H.map(function (p) { return p.x; });
  var apexX = H.reduce(function (a, b) { return b.y < a.y ? b : a; }).x;
  var padOut = titleSize * 3.2;
  var clip = mk('clipPath', { id: 'pl1-weave-clip', clipPathUnits: 'userSpaceOnUse' }, defs);
  var bandT = titleCY - titleSize * 1.1, bandB = titleCY + titleSize * 0.4;
  // left window: from well outside the plate up to the apex
  poly([{ x: Math.min.apply(null, hullXs) - padOut, y: bandT }, { x: apexX - titleSize * 0.75, y: bandT },
        { x: apexX - titleSize * 0.75, y: bandB }, { x: Math.min.apply(null, hullXs) - padOut, y: bandB }], {}, clip);
  // right window: from the apex out past the other edge
  poly([{ x: apexX + titleSize * 0.75, y: bandT }, { x: Math.max.apply(null, hullXs) + padOut, y: bandT },
        { x: Math.max.apply(null, hullXs) + padOut, y: bandB }, { x: apexX + titleSize * 0.75, y: bandB }], {}, clip);
  var overTitle = makeTitleText('pl1-title-over');
  overTitle.setAttribute('clip-path', 'url(#pl1-weave-clip)');
  titleLayers.push(overTitle);   // both title copies + the byline fade in together, last

  // ── FIGURES: two files of hooded monks, placed by the SAME loop ──
  // Original silhouette: pointed cowl, robe tapering to a slightly flared hem, a
  // suggestion of a bowed head. Anchored at the feet (y = 0). ~28 tall.
  // A robed figure with real anatomy in the silhouette: hooded head, a shoulder line that
  // breaks outward, the robe pulled in at the waist and flaring to a hem that sits on the
  // tread. Height 34 so the shoulder break survives at hero scale; the old 28-tall blob had
  // no shoulders at all and read as a lozenge.
  function figureRobe() {
    return 'M0,-34 C-2.6,-34 -4.3,-32.2 -4.5,-29.6 ' +   // cowl, left side of the hood
           'C-4.6,-27.8 -4.1,-26.6 -3.6,-25.8 ' +         // hood meets the neck
           'C-6.0,-24.6 -7.2,-22.4 -7.4,-19.6 ' +         // SHOULDER breaks outward
           'C-7.6,-16.0 -6.9,-12.6 -6.4,-9.4 ' +          // upper arm / robe body
           'C-6.2,-7.2 -6.6,-4.0 -7.6,-1.4 ' +            // robe flares
           'C-8.0,-0.4 -7.4,0 -6.6,0 ' +                  // hem, left foot corner
           'L6.6,0 C7.4,0 8.0,-0.4 7.6,-1.4 ' +           // hem across the tread
           'C6.6,-4.0 6.2,-7.2 6.4,-9.4 ' +
           'C6.9,-12.6 7.6,-16.0 7.4,-19.6 ' +
           'C7.2,-22.4 6.0,-24.6 3.6,-25.8 ' +            // right shoulder
           'C4.1,-26.6 4.6,-27.8 4.5,-29.6 ' +
           'C4.3,-32.2 2.6,-34 0,-34 Z';
  }
  var FIG_UP = 6, FIG_DN = 6;
  var figLayer = mk('g', {}, svg);
  var figs = [];
  function makeFig(dir, offset) {
    var gp = mk('g', { 'class': 'pl1-fig' }, figLayer);
    mk('path', { d: figureRobe() }, gp);
    // shadowed face inside the cowl — a void, not a highlight: the hood is empty
    mk('path', { d: 'M-2.8,-30.4 C-1.2,-31.7 1.2,-31.7 2.8,-30.4 C1.4,-28.7 -1.4,-28.7 -2.8,-30.4 Z',
                 fill: 'var(--paper)', stroke: 'none', opacity: '0.62' }, gp);
    // hem band + centre fold: two hairlines that stop the robe reading as a flat fill
    mk('path', { d: 'M-6.9,-2.4 L6.9,-2.4', stroke: 'var(--paper)', 'stroke-width': '0.7',
                 fill: 'none', opacity: '0.30' }, gp);
    mk('path', { d: 'M0,-24.4 L0,-3.6', stroke: 'var(--paper)', 'stroke-width': '0.55',
                 fill: 'none', opacity: '0.20' }, gp);
    figs.push({ el: gp, dir: dir, offset: offset, y: 0 });
  }
  for (k = 0; k < FIG_UP; k++) makeFig(1, k / FIG_UP);
  for (k = 0; k < FIG_DN; k++) makeFig(-1, (k + 0.5) / FIG_DN);

  // position on a tread top-face centre at loop parameter u∈[0,1)
  function figXY(u) {
    u = ((u % 1) + 1) % 1;
    var fi = u * N, i0 = Math.floor(fi) % N, frac = fi - Math.floor(fi);
    var a = S[i0], b = S[(i0 + 1) % N];
    var wrap = (i0 === N - 1);                     // don't streak across the hidden seam
    var ca = { x: (a.bL.x + a.fR.x) / 2, y: (a.bL.y + a.fR.y) / 2 };
    var cb = { x: (b.bL.x + b.fR.x) / 2, y: (b.bL.y + b.fR.y) / 2 };
    return { x: wrap ? ca.x : ca.x + (cb.x - ca.x) * frac, y: wrap ? ca.y : ca.y + (cb.y - ca.y) * frac };
  }
  function layoutFigures(phase) {
    figs.forEach(function (fg) {
      // Each file runs on its own clock: climbers slower than descenders.
      var sp = fg.dir === 1 ? SPEED_UP : SPEED_DN;
      var u = fg.dir === 1 ? (phase * sp + fg.offset) : (-phase * sp + fg.offset);
      var p = figXY(u);
      fg.y = p.y;
      // The trudge: a small vertical hitch and a breath of scale, on each figure's own seed.
      // Climbers get the full amplitude (labour); descenders barely register it (ease).
      var g = (fg.seed || 0) * 6.2831853 + phase * sp * 6.2831853 * N;
      var hitch = Math.abs(Math.sin(g)) * 1.15 * (fg.trudge || 0);
      var lean = Math.sin(g) * 0.9 * (fg.trudge || 0) * (fg.dir === 1 ? 1 : -1);
      fg.el.setAttribute('transform',
        'translate(' + p.x.toFixed(1) + ',' + (p.y - hitch).toFixed(1) + ') ' +
        'rotate(' + lean.toFixed(2) + ') scale(0.9)');
    });
    figs.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (fg) { figLayer.appendChild(fg.el); });
  }

  // The signature goes down LAST, on top of tower, ribbon and figures alike. Painted any
  // earlier and a later layer slices it — the roof took "M.C. ESCHER" down to "M.C. E",
  // then the top treads took it to "M.C. ESC".
  makeByline();

  // ── registration marks (hairline printer's crosses) ──
  var regEls = [];
  function regMark(cls) {
    var r = document.createElementNS(NS, 'svg');
    r.setAttribute('class', 'pl1-reg ' + cls);
    r.setAttribute('viewBox', '0 0 15 15');
    r.setAttribute('aria-hidden', 'true');
    r.innerHTML = '<line x1="7.5" y1="0" x2="7.5" y2="15" stroke="var(--ink)" stroke-width="0.5"/>' +
      '<line x1="0" y1="7.5" x2="15" y2="7.5" stroke="var(--ink)" stroke-width="0.5"/>' +
      '<circle cx="7.5" cy="7.5" r="3.4" fill="none" stroke="var(--ink)" stroke-width="0.5"/>';
    root.appendChild(r);
    regEls.push(r);
  }
  regMark('tl'); regMark('tr'); regMark('bl'); regMark('br');
  // The four crosses act as one unit in the reveal — they are the first thing on the sheet.
  function setRegOpacity(v) { regEls.forEach(function (r) { r.style.opacity = v; }); }

  // ── margin annotation block ──
  var ann = document.createElement('div');
  ann.className = 'pl1-ann';
  ann.setAttribute('aria-hidden', 'true');
  ann.innerHTML =
    '<p>PLATE I</p><div class="pl1-rule"></div>' +
    '<p>PROJ. DIMETRIC</p>' +
    '<p>e&#8339; (' + HW + ', ' + HH + ')</p>' +
    '<p>e&#8340; (&#8722;' + HW + ', ' + HH + ')</p>' +
    '<p>STEPS: ' + (PER * 4) + '</p>' +
    '<p>FLIGHTS: 4</p>' +
    '<p>&#931; LIFT = 0</p>' +
    '<div class="pl1-rule"></div>' +
    '<p>RISE PER STEP: 0 mm</p>';
  root.appendChild(ann);

  // ── scroll invitation (descent = ascent) ──
  var scroll = document.createElement('div');
  scroll.className = 'pl1-scroll';
  scroll.setAttribute('aria-hidden', 'true');
  scroll.innerHTML = 'DESCEND &mdash; IT IS THE SAME AS ASCENDING<span class="pl1-arrow">&#8595;</span>';
  root.appendChild(scroll);

  // ── museum caption ──
  var cap = document.createElement('p');
  cap.className = 'pl1-caption';
  cap.innerHTML = '<span class="pl1-num">Plate I &middot; Ascending and Descending</span><br>' +
    'A closed quadrilateral stair on a monastery roof. One file climbs, one descends; ' +
    'neither arrives. Built on the <em>Penrose staircase</em> &mdash; every flight is sound ' +
    'carpentry, the whole circuit is not. Height gained over one full loop: nil.';
  root.appendChild(cap);

  // ── ANIMATION ──
  // Two gaits. Climbing is laboured: the ascending file moves slower and each figure carries
  // a per-figure trudge — a small forward-and-check oscillation on its own phase, so the file
  // never marches in lockstep. Descending is easier: faster, smoother, barely any hitch.
  var phase = 0;
  var SPEED_UP = 0.0125, SPEED_DN = 0.0186;
  figs.forEach(function (fg, i) {
    fg.seed = (i * 0.618033) % 1;                    // golden-ratio stagger: no visible pairing
    fg.trudge = fg.dir === 1 ? 1 : 0.28;             // climbers labour, descenders glide
  });
  function frame(dt) {
    phase = (phase + (dt / 1000)) % 1000;
    layoutFigures(phase);
    if (drift) drift(dt);
  }

  // ── THE PLATE-PULLING REVEAL ──
  // Staged like an impression coming off the press: registration marks, then the tower mass,
  // then the stair ribbon flight by flight as the ink takes, then the figures step onto the
  // circuit, and the title weaves through the treads last.
  // Driven by accumulated dt against absolute cue times — NOT chained timeouts — so a dropped
  // frame or a backgrounded tab can never strand the plate half-drawn.
  var revealT = 0, revealDone = false;
  var STEP_IN = 62;                                  // ms between successive step blocks
  var stepEls = [];
  Array.prototype.forEach.call(stairG.childNodes, function (n) { stepEls.push(n); });
  var TOTAL = 900 + stepEls.length * STEP_IN;

  function setReveal(ms) {
    // registration marks + tower
    var a1 = ms < 120 ? 0 : Math.min(1, (ms - 120) / 420);
    setRegOpacity(String(Math.min(1, ms / 200)));
    blockG.style.opacity = String(a1);
    wellG.style.opacity = String(a1);
    // ribbon, block by block
    for (var i = 0; i < stepEls.length; i++) {
      var st = 380 + i * STEP_IN;
      var a = ms < st ? 0 : Math.min(1, (ms - st) / 260);
      if (stepEls[i].style) stepEls[i].style.opacity = String(a);
    }
    // figures, then the title last
    var figStart = 380 + stepEls.length * STEP_IN * 0.55;
    figLayer.style.opacity = String(ms < figStart ? 0 : Math.min(1, (ms - figStart) / 460));
    var titStart = 300 + stepEls.length * STEP_IN * 0.72;
    var ta = ms < titStart ? 0 : Math.min(1, (ms - titStart) / 620);
    titleLayers.forEach(function (t) { if (t && t.style) t.style.opacity = String(ta); });
  }
  function finishReveal() {                          // fail-safe: assert the finished plate
    revealDone = true;
    setRegOpacity('');
    blockG.style.opacity = ''; wellG.style.opacity = '';
    stepEls.forEach(function (n) { if (n.style) n.style.opacity = ''; });
    figLayer.style.opacity = '';
    titleLayers.forEach(function (t) { if (t && t.style) t.style.opacity = ''; });
  }

  // ── ambient camera drift + pointer parallax ──
  // A few pixels, slow. The paper should breathe, not sway.
  var pnx = 0, pny = 0, tnx = 0, tny = 0, driftT = 0;
  function drift(dt) {
    driftT += dt;
    pnx += (tnx - pnx) * 0.045;                      // ease toward the pointer, never snap
    pny += (tny - pny) * 0.045;
    var bx = Math.sin(driftT / 5200) * 3.4;          // ambient: two incommensurate periods
    var by = Math.cos(driftT / 6900) * 2.2;
    var x = bx + pnx * 13, y = by + pny * 8.5, rot = pnx * 0.5;
    svg.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) rotate(' + rot.toFixed(3) + 'deg)';
  }
  function onPointer(ev) {
    var r = stage.getBoundingClientRect();
    if (!r.width) return;
    tnx = (ev.clientX - r.left) / r.width - 0.5;
    tny = (ev.clientY - r.top) / r.height - 0.5;
  }

  layoutFigures(0);

  if (api.reducedMotion) {
    finishReveal();                                  // the whole plate, at rest, immediately
    return { destroy: function () {} };
  }

  setReveal(0);                                      // hold the blank sheet until it is seen
  var loop = api.raf(function (dt) {
    if (!revealDone) {
      revealT += dt;
      if (revealT >= TOTAL) finishReveal(); else setReveal(revealT);
    }
    frame(dt);
  });
  stage.addEventListener('pointermove', onPointer, { passive: true });
  stage.addEventListener('pointerleave', function () { tnx = 0; tny = 0; }, { passive: true });

  // The reveal must play on ARRIVAL, not while the hero sits offscreen.
  api.onVisible(root,
    function () { loop.start(); },
    function () { loop.stop(); }
  );
  // Safety net: if the tab is hidden through the whole sequence, don't leave it half-pulled.
  var vis = function () { if (document.hidden && !revealDone) finishReveal(); };
  document.addEventListener('visibilitychange', vis);

  return {
    destroy: function () {
      loop.stop();
      stage.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', vis);
    }
  };
};
