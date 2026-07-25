/* =============================================================================
   PLATE III — "Relativity"  ·  window.EscherPlate3  ·  slug: relativity
   One building, three mutually perpendicular gravities.

   CONSTRUCTION. One isometric shell via iso(x,y,z). The three gravity vectors
   ARE the three iso axes, which land exactly 120° apart on screen — so making
   frame n upright is a single planar rotation of the stage by FRAME_ROT[n]. The
   active passage lives in a sidebar panel OUTSIDE the rotating stage (always
   upright, never over the architecture); quiet mono frame-marks sit in the empty
   viewport corners as marginalia. The KEY figure pair (one on the z=0 floor, one
   on the x=0 wall) makes the inversion legible: one's floor is the other's wall.
   ========================================================================== */
window.EscherPlate3 = { id: 'relativity' };

window.EscherPlate3.css = `
.plate--relativity{position:relative;background:var(--paper);border-top:1px solid var(--paper-3);border-bottom:1px solid var(--paper-3);font-family:var(--font-body);overflow:hidden;padding:2.4rem 1rem 2rem}
.plate--relativity .pl3-head{display:flex;align-items:baseline;gap:1.4em;flex-wrap:wrap;max-width:1000px;margin:0 auto .8rem;padding:0 .4rem}
.plate--relativity .pl3-num{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.22em;color:var(--bistre);text-transform:uppercase}
.plate--relativity .pl3-ttl{font-family:var(--font-display);font-size:1.5rem;letter-spacing:.02em;color:var(--ink);line-height:1}
.plate--relativity .pl3-sub{font-family:var(--font-mono);font-size:.56rem;letter-spacing:.18em;color:var(--ink-2);text-transform:uppercase;margin-left:auto;opacity:.8}
/* Two-column: architecture left, active text right */
.plate--relativity .pl3-body{display:grid;grid-template-columns:1fr 22rem;gap:2.4rem;align-items:start;max-width:1000px;margin:0 auto;padding:0 .4rem}
.plate--relativity .pl3-arch-col{position:relative}
.plate--relativity .pl3-viewport{position:relative;width:100%;aspect-ratio:1/1;max-width:600px;margin:0 auto}
.plate--relativity .pl3-stage{position:absolute;inset:0;transform-origin:50% 50%;transform:rotate(0deg);will-change:transform}
.plate--relativity .pl3-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
/* Corner frame-marks — quiet mono marginalia in the empty corners the iso
   footprint leaves blank. NOT prose over the architecture: a printer's note. */
.plate--relativity .pl3-clusters{position:absolute;inset:0;pointer-events:none}
.plate--relativity .pl3-cluster{position:absolute;display:flex;flex-direction:column;gap:.15em;transform-origin:50% 50%;opacity:.42;transition:opacity .5s ease}
.plate--relativity .pl3-cluster.is-live{opacity:.72}
.plate--relativity .pl3-cluster .pl3-c-tag{font-family:var(--font-mono);font-size:.52rem;letter-spacing:.2em;color:var(--bistre);text-transform:uppercase;line-height:1}
.plate--relativity .pl3-cluster .pl3-c-vec{font-family:var(--font-mono);font-size:.46rem;letter-spacing:.1em;color:var(--ink-2);line-height:1}
.plate--relativity .pl3-cluster .pl3-c-tick{width:1.6em;height:0;border-top:1px solid var(--bistre);opacity:.7}
/* Annotation row below viewport */
.plate--relativity .pl3-margin{margin-top:.6rem;font-family:var(--font-mono);font-size:.5rem;letter-spacing:.15em;color:var(--ink-2);text-transform:uppercase;opacity:.65}
.plate--relativity .pl3-margin b{color:var(--bistre);font-weight:400}
/* Right column */
.plate--relativity .pl3-text-col{display:flex;flex-direction:column;gap:1.4rem;padding-top:.2rem}
/* Active passage panel — always upright, clear paper, vermilion accent */
.plate--relativity .pl3-panel{border-left:2px solid var(--vermilion);padding-left:1.1rem}
.plate--relativity .pl3-panel .pl3-panel-tag{display:block;font-family:var(--font-mono);font-size:.54rem;letter-spacing:.2em;color:var(--vermilion);text-transform:uppercase;margin-bottom:.5em}
.plate--relativity .pl3-panel p{margin:0;font-size:.88rem;line-height:1.65;color:var(--ink)}
.plate--relativity .pl3-panel .pl3-panel-voice{display:block;margin-top:.7em;font-family:var(--font-mono);font-size:.46rem;letter-spacing:.13em;color:var(--ink-2);text-transform:uppercase;opacity:.68;line-height:1.4}
/* Frame controls */
.plate--relativity .pl3-controls{display:flex;flex-direction:column;gap:.5rem}
.plate--relativity .pl3-btn{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;background:none;border:1px solid var(--ink-2);color:var(--ink-2);padding:.5em .9em;cursor:pointer;outline-offset:3px;line-height:1.2;text-align:left;display:flex;align-items:baseline;gap:.6em}
.plate--relativity .pl3-btn:hover{background:var(--paper-2);color:var(--ink)}
.plate--relativity .pl3-btn:focus-visible{outline:2px solid var(--vermilion)}
.plate--relativity .pl3-btn[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.plate--relativity .pl3-btn .pl3-vec{font-size:.52rem;letter-spacing:.12em;opacity:.7}
/* Narrow-width ghost indicators (replace stage clusters) */
.plate--relativity .pl3-ghost-row{display:none;gap:1rem;margin-top:.5rem;justify-content:center}
.plate--relativity .pl3-ghost-badge{font-family:var(--font-mono);font-size:.48rem;letter-spacing:.14em;color:var(--ink-2);text-transform:uppercase;opacity:.5;border:1px solid var(--paper-3);padding:.3em .55em}
/* Polite live region */
.plate--relativity .pl3-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* Caption */
.plate--relativity .pl3-caption{max-width:1000px;margin:1.2rem auto 0;padding:0 .4rem;font-family:var(--font-body);font-size:.82rem;line-height:1.6;color:var(--ink-2)}
.plate--relativity .pl3-caption em{font-style:italic;color:var(--ink)}
/* Reduced-motion stacked fallback */
.plate--relativity .pl3-stack{max-width:760px;margin:1.4rem auto 0;display:grid;gap:1.4rem}
.plate--relativity .pl3-stack article{border-left:2px solid var(--paper-3);padding-left:1rem}
.plate--relativity .pl3-stack article.is-active{border-left-color:var(--vermilion)}
.plate--relativity .pl3-stack h3{font-family:var(--font-mono);font-size:.58rem;letter-spacing:.2em;color:var(--bistre);text-transform:uppercase;margin:0 0 .4em}
.plate--relativity .pl3-stack p{margin:0;font-size:.86rem;line-height:1.6;color:var(--ink-2)}
.plate--relativity .pl3-note{max-width:640px;margin:.6rem auto 0;text-align:center;font-family:var(--font-mono);font-size:.56rem;letter-spacing:.12em;color:var(--ink-2);text-transform:uppercase}
/* Intermediate: stack columns */
@media (max-width:840px){
  .plate--relativity .pl3-body{grid-template-columns:1fr;gap:1.4rem}
  .plate--relativity .pl3-viewport{max-width:480px}
  .plate--relativity .pl3-controls{flex-direction:row;flex-wrap:wrap;gap:.5rem}
}
/* Narrow: single column, hide ghost clusters, show badges */
@media (max-width:560px){
  .plate--relativity{padding:2rem .7rem 1.6rem}
  .plate--relativity .pl3-viewport{max-width:100%}
  .plate--relativity .pl3-cluster{display:none}
  .plate--relativity .pl3-ghost-row{display:flex}
  .plate--relativity .pl3-panel p{font-size:.84rem}
  .plate--relativity .pl3-margin{display:none}
  .plate--relativity .pl3-controls{flex-direction:column}
}
`;

window.EscherPlate3.mount = function mount(root, api) {
  root.classList.add('plate--relativity');
  var NS = 'http://www.w3.org/2000/svg';
  var VB = 700, sq3 = Math.sqrt(3);

  /* Isometric projection. S = world scale. Origin at (CX, CY). */
  var CX = VB/2, CY = VB/2+30, S = 108;
  function iso(x, y, z) {
    return { x: CX + (x-y)*sq3*0.5*S, y: CY + (x+y)*0.5*S - z*S };
  }

  /* Three frames. FRAME_ROT[n] = stage° that makes frame n's gravity point down.
     -Z screen dir=+90° → rot 0; -Y screen dir=-30° → rot 120; -X → rot 240. */
  var FRAME_ROT   = [0, 120, 240];
  var FRAME_VEC   = ['g₁ = (0, 0, −1)', 'g₂ = (0, −1, 0)', 'g₃ = (−1, 0, 0)'];
  var FRAME_ROMAN = ['I', 'II', 'III'];

  var PASSAGES = [
    'A single vanishing point is the politest of lies. It tells you there is one place to stand, one horizon, one honest view, and that everything else is error. I have drawn buildings that refuse the courtesy. Three gravities hold this house at once. None is false. Each merely declines to be the only one.',
    'The plane is two dimensions and will not be argued into three. I do not resent the limit; I require it. Constraint is not the enemy of invention, it is its instrument. Give me an edge that must meet its opposite and I will find a beast that fits the gap exactly. Freedom draws nothing.',
    'I do not finish a print. I stop, and hand you the remainder. You choose a frame, and in choosing you decide which figures are standing and which are hung from the ceiling like patient bats. Turn the page and the verdict reverses. The work is not on the paper. It is in the tilt of your head.'
  ];

  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function poly(pts, attrs, parent) {
    return mk('polygon', Object.assign(
      { points: pts.map(function(p){ return p.x.toFixed(1)+','+p.y.toFixed(1); }).join(' ') },
      attrs), parent);
  }
  function line3(a, b, attrs, parent) {
    var p=iso(a[0],a[1],a[2]), q=iso(b[0],b[1],b[2]);
    return mk('line', Object.assign({ x1:p.x.toFixed(1),y1:p.y.toFixed(1),x2:q.x.toFixed(1),y2:q.y.toFixed(1) }, attrs), parent);
  }

  function div(cls){ var d=document.createElement('div'); if(cls) d.className=cls; return d; }

  /* ── DOM scaffold ───────────────────────────────────────────────────────── */
  root.innerHTML =
    '<div class="pl3-head" aria-hidden="true">'+
      '<span class="pl3-num">Plate III</span>'+
      '<span class="pl3-ttl">Relativity</span>'+
      '<span class="pl3-sub">Three gravities · one architecture</span>'+
    '</div>';

  var body = div('pl3-body');
  var archCol = div('pl3-arch-col');
  var viewport = div('pl3-viewport');
  var stage = div('pl3-stage');
  viewport.appendChild(stage);

  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class','pl3-svg');
  svg.setAttribute('viewBox','0 0 '+VB+' '+VB);
  svg.setAttribute('aria-hidden','true');
  stage.appendChild(svg);

  /* ── SVG defs: four hatch patterns, one per surface + stair risers ───── */
  var defs = mk('defs', {}, svg);
  function hatch(id, angle, spacing, sw, op) {
    var p = mk('pattern', { id:id, patternUnits:'userSpaceOnUse', width:String(spacing), height:String(spacing), patternTransform:'rotate('+angle+')' }, defs);
    mk('line', { x1:'0',y1:'0',x2:'0',y2:String(spacing), stroke:'var(--bistre)', 'stroke-width':String(sw), opacity:String(op) }, p);
  }
  hatch('pl3-hatchA', 30,  6, 0.7, 0.50);  // Y-Z wall (x=0)
  hatch('pl3-hatchB', -30, 6, 0.7, 0.38);  // X-Z wall (y=0)
  hatch('pl3-hatchC', 90,  5, 0.7, 0.28);  // X-Y floor (z=0)
  hatch('pl3-hatchD', 45,  4, 0.6, 0.45);  // stair risers

  var edge = { stroke:'var(--ink)', 'stroke-linejoin':'miter', 'vector-effect':'non-scaling-stroke' };
  var shell = mk('g', {}, svg);
  var E = 2.4;   // world-unit extent of the three planes

  /* Three interior planes — a distinct hatch each, so the gravities read. */
  [
    { f:'var(--paper-2)', h:'pl3-hatchA', pts:[[0,0,0],[0,E,0],[0,E,E],[0,0,E]] },
    { f:'var(--paper-3)', h:'pl3-hatchB', pts:[[0,0,0],[E,0,0],[E,0,E],[0,0,E]] },
    { f:'var(--paper-2)', h:'pl3-hatchC', pts:[[0,0,0],[E,0,0],[E,E,0],[0,E,0]] }
  ].forEach(function(pl) {
    var scr = pl.pts.map(function(p){ return iso(p[0],p[1],p[2]); });
    poly(scr, Object.assign({ fill:pl.f, 'stroke-width':'1' }, edge), shell);
    poly(scr, { fill:'url(#'+pl.h+')', stroke:'none' }, shell);
  });

  /* Grid seams on all three surfaces */
  var seams = mk('g', { fill:'none','stroke-width':'0.5',opacity:'0.65' }, shell);
  for (var i=1; i < Math.floor(E); i++) {
    line3([i,0,0],[i,E,0], edge, seams); line3([0,i,0],[E,i,0], edge, seams);
    line3([0,i,0],[0,i,E], edge, seams); line3([0,0,i],[0,E,i], edge, seams);
    line3([i,0,0],[i,0,E], edge, seams); line3([0,0,i],[E,0,i], edge, seams);
  }
  /* Half-unit sub-grid on the z=0 floor for density */
  for (var ih=1; ih*0.5<E; ih++) {
    var v=ih*0.5, eOpts={ stroke:'var(--ink)','vector-effect':'non-scaling-stroke','stroke-width':'0.3',opacity:'0.28' };
    mk('line', Object.assign({ x1:iso(v,0,0).x.toFixed(1),y1:iso(v,0,0).y.toFixed(1),x2:iso(v,E,0).x.toFixed(1),y2:iso(v,E,0).y.toFixed(1) }, eOpts), seams);
    mk('line', Object.assign({ x1:iso(0,v,0).x.toFixed(1),y1:iso(0,v,0).y.toFixed(1),x2:iso(E,v,0).x.toFixed(1),y2:iso(E,v,0).y.toFixed(1) }, eOpts), seams);
  }

  /* Stair run: 5 steps climbing X and Z together */
  function stepBox(x0, z0, w) {
    var g=mk('g',{},shell), d=0.38, y0=0.1, y1=y0+w;
    poly([iso(x0,y0,z0+d),iso(x0+d,y0,z0+d),iso(x0+d,y1,z0+d),iso(x0,y1,z0+d)], Object.assign({fill:'var(--paper)','stroke-width':'0.75'},edge), g);
    poly([iso(x0,y0,z0),iso(x0,y1,z0),iso(x0,y1,z0+d),iso(x0,y0,z0+d)], Object.assign({fill:'var(--paper-3)','stroke-width':'0.75'},edge), g);
    poly([iso(x0,y0,z0),iso(x0,y1,z0),iso(x0,y1,z0+d),iso(x0,y0,z0+d)], {fill:'url(#pl3-hatchD)',stroke:'none'}, g);
    poly([iso(x0,y1,z0),iso(x0+d,y1,z0),iso(x0+d,y1,z0+d),iso(x0,y1,z0+d)], Object.assign({fill:'var(--paper-2)','stroke-width':'0.6'},edge), g);
    return d;
  }
  var sx=0.18, sz=0.0;
  for (var st=0; st<5; st++) { var dd=stepBox(sx,sz,0.8); sx+=0.38; sz+=dd; }

  /* Arched doorways on both walls (two each) */
  function archway(base3, uAxis, vAxis, w, h, hid) {
    var o=iso(base3[0],base3[1],base3[2]);
    var u={x:iso(uAxis[0],uAxis[1],uAxis[2]).x-CX,y:iso(uAxis[0],uAxis[1],uAxis[2]).y-CY};
    var v={x:iso(vAxis[0],vAxis[1],vAxis[2]).x-CX,y:iso(vAxis[0],vAxis[1],vAxis[2]).y-CY};
    function P(a,b){ return {x:o.x+u.x*a+v.x*b, y:o.y+u.y*a+v.y*b}; }
    var g=mk('g',{},shell), bl=P(0,0),br=P(w,0),sL=P(0,h),sR=P(w,h),ap=P(w/2,h+w/2);
    var ds='M'+bl.x.toFixed(1)+','+bl.y.toFixed(1)+' L'+br.x.toFixed(1)+','+br.y.toFixed(1)+
           ' L'+sR.x.toFixed(1)+','+sR.y.toFixed(1)+' Q'+ap.x.toFixed(1)+','+ap.y.toFixed(1)+' '+sL.x.toFixed(1)+','+sL.y.toFixed(1)+' Z';
    mk('path', Object.assign({d:ds,fill:'var(--paper-2)','stroke-width':'0.9'},edge), g);
    mk('path', {d:ds,fill:'url(#'+hid+')',stroke:'none',opacity:'0.8'}, g);
  }
  archway([0,0.3,0], [0,1,0],[0,0,1], 0.6,0.85,'pl3-hatchA');
  archway([1.1,0,0], [1,0,0],[0,0,1], 0.6,0.85,'pl3-hatchB');
  archway([0,1.2,1.0],[0,1,0],[0,0,1], 0.5,0.55,'pl3-hatchA');
  archway([0.8,0,1.0],[1,0,0],[0,0,1], 0.5,0.55,'pl3-hatchB');

  /* Robed inhabitants. Local 2-D frame: a = fraction of body height H (0 feet →
     1 crown) along this frame's projected "up" axis (ux,uy); c = multiple of
     half-width W laterally; faceSign flips c. The up-axis is the gravity plane's
     axis through iso(), so ONE routine stands a person on z=0, x=0 or y=0, each
     along its own gravity. Robe + a separate rounded head keep it a person (not
     a wedge) at any rotation, down to ~390px. KEY PAIR: fig[0] on the z=0 floor
     and fig[2] on the x=0 wall share a Y — one's floor is the other's wall. */
  function figure(base3, upAxis, faceSign, scale, parent) {
    var o=iso(base3[0],base3[1],base3[2]);
    var ua=iso(upAxis[0],upAxis[1],upAxis[2]);
    var ux=ua.x-CX, uy=ua.y-CY, ul=Math.hypot(ux,uy)||1; ux/=ul; uy/=ul;
    var px=-uy, py=ux, sf=faceSign, H=64*scale, W=12*scale;
    function X(a,c){ return o.x+ux*a*H+px*c*W*sf; }
    function Y(a,c){ return o.y+uy*a*H+py*c*W*sf; }
    function P(a,c){ return X(a,c).toFixed(1)+','+Y(a,c).toFixed(1); }
    function Q(a,c,a2,c2){ return 'Q'+X(a,c).toFixed(1)+','+Y(a,c).toFixed(1)+' '+X(a2,c2).toFixed(1)+','+Y(a2,c2).toFixed(1)+' '; }
    // Closed oval (centre a0,c0; radii ra up, rc lateral) from four quadratics.
    // Rotation-safe — reads as a rounded mass from any angle, never a spike.
    function oval(a0,c0,ra,rc){
      var k=1.20;   // control reach for a near-circular arc
      return 'M'+P(a0+ra,c0)+' '+
        Q(a0+ra, c0+rc*k, a0, c0+rc)+Q(a0-ra*k, c0+rc, a0-ra, c0)+
        Q(a0-ra*k, c0-rc, a0, c0-rc)+Q(a0+ra, c0-rc*k, a0+ra, c0)+'Z';
    }
    var g=mk('g',{},parent);
    // ROBE — hem → waist → shoulders → neck. Head is a separate mass (below) so
    // foreshortening can't fuse a hood-tip into a wedge; body ends at shoulders.
    var body='M'+P(0.00, 1.42)+' '+                 // hem, right corner
      'L'+P(0.08, 1.35)+' '+                         // hem band step
      Q(0.34, 1.04, 0.50, 0.74)+                     // robe taper to waist
      Q(0.58, 0.70, 0.64, 1.02)+                     // flare out to right shoulder
      Q(0.70, 0.92, 0.72, 0.30)+                     // shoulder slope to neck (R)
      Q(0.74, 0.20, 0.76, 0.24)+                     // neck (right)
      'L'+P(0.76,-0.24)+' '+                         // across the neck
      Q(0.74,-0.20, 0.72,-0.30)+                     // neck (left)
      Q(0.70,-0.92, 0.64,-1.02)+                     // left shoulder
      Q(0.58,-0.70, 0.50,-0.74)+                     // waist (left)
      Q(0.34,-1.04, 0.08,-1.35)+                     // taper back to hem (left)
      'L'+P(0.00,-1.42)+' Z';                        // hem, left corner
    mk('path',{d:body,fill:'var(--ink)'},g);
    // Cowl/shoulder yoke — a soft ink-2 mantle so the top isn't a flat blob.
    mk('path',{d:'M'+P(0.64,1.02)+' '+Q(0.70,0.92,0.72,0.30)+'L'+P(0.72,-0.30)+' '+
      Q(0.70,-0.92,0.64,-1.02)+Q(0.60,-0.72,0.62,-0.55)+
      Q(0.66,-0.30,0.66,0.0)+Q(0.66,0.30,0.62,0.55)+Q(0.60,0.72,0.64,1.02)+'Z',
      fill:'var(--ink-2)',opacity:'0.9'},g);
    // HEAD — a hooded oval sitting on the neck. Ink, slightly taller than wide.
    mk('path',{d:oval(0.90, 0.0, 0.145, 0.62),fill:'var(--ink)'},g);
    // FACE — concentric with the head (same 0.90 centre, no lateral offset) and well inside
    // its radii. Any offset here reads as a detached pale disc once the figure is strongly
    // foreshortened on a wall, because the projection squashes one axis to near zero.
    mk('path',{d:oval(0.90, 0.0, 0.070, 0.26),fill:'var(--paper-2)',stroke:'none',opacity:'0.85'},g);
    // Central drape fold — hairline in softer ink from hem to chest.
    mk('line',{x1:X(0.10,0).toFixed(1),y1:Y(0.10,0).toFixed(1),x2:X(0.56,0).toFixed(1),y2:Y(0.56,0).toFixed(1),
      stroke:'var(--ink-2)','stroke-width':(1.1*scale).toFixed(2),'stroke-linecap':'round','vector-effect':'non-scaling-stroke'},g);
    // Hem band — a darker step across the bottom so the robe sits on the plane.
    mk('path',{d:'M'+P(0.08,1.35)+' L'+P(0.00,1.42)+' L'+P(0.00,-1.42)+' L'+P(0.08,-1.35)+' Z',
      fill:'var(--ink-2)'},g);
    return g;
  }
  /* Corner colour tints mark the three gravity axes at the origin. Drawn BEFORE
     the figures so the inhabitants always sit on top of it, and kept quiet so it
     reads as a small keyed corner, not an object floating in the room. */
  var tg=mk('g',{opacity:'0.32'},svg);
  var c0=iso(0,0,0),cX=iso(E*.12,0,0),cY=iso(0,E*.12,0),cZ=iso(0,0,E*.12);
  function triPts(a,b,c){ return [a,b,c].map(function(p){return p.x.toFixed(1)+','+p.y.toFixed(1);}).join(' '); }
  mk('polygon',{points:triPts(c0,cY,cZ),fill:'var(--bistre)',stroke:'none'},tg);
  mk('polygon',{points:triPts(c0,cX,cZ),fill:'var(--bistre-2)',stroke:'none'},tg);
  mk('polygon',{points:triPts(c0,cX,cY),fill:'var(--teal)',stroke:'none',opacity:'0.3'},tg);
  mk('circle',{cx:c0.x.toFixed(1),cy:c0.y.toFixed(1),r:'3',fill:'var(--vermilion)',opacity:'0.85'},svg);

  /* Robed inhabitants, painted last so they read clearly over floor and tints. */
  var figG = mk('g',{opacity:'0.95'},svg);
  figure([1.02,1.28,0],  [0,0,1],  1,   1.00, figG);  // z=0 floor walker  (KEY)
  figure([1.74,0.66,0],  [0,0,1], -1,   0.90, figG);  // z=0 floor walker
  figure([0,1.30,1.14],  [1,0,0],  1,   0.98, figG);  // x=0 wall, same Y as fig[0] (KEY)
  figure([0,0.58,0.80],  [1,0,0], -1,   0.86, figG);  // x=0 wall
  figure([0.66,0,0.46],  [0,1,0],  1,   0.90, figG);  // y=0 wall
  figure([1.30,0,1.04],  [0,1,0], -1,   0.84, figG);  // y=0 wall

  /* Corner frame-marks. The iso footprint is a hexagon, so the square corners
     are empty paper. Three small mono marks (numeral, gravity vector, a tick),
     each tilted to its frame's angle, sit there as margin notes. They live in
     the VIEWPORT (not the stage), so they never rotate with or smear across the
     architecture. aria-hidden: panel + controls carry this to assistive tech. */
  var clustersWrap = div('pl3-clusters');
  clustersWrap.setAttribute('aria-hidden','true');
  // Top-right, bottom-left, bottom-right corners are clear; top-left is under the cube.
  // Inset enough that the tilt below cannot swing a mark past the plate edge.
  var cornerPos = [
    { bottom:'6%', left:'5%'  },  // frame I   · bottom-left
    { bottom:'6%', right:'5%' },  // frame II  · bottom-right
    { top:'6%',    right:'5%' }   // frame III · top-right
  ];
  var clusterEls = [];
  cornerPos.forEach(function(pos,n){
    var c=div('pl3-cluster');
    for (var k in pos) c.style[k]=pos[k];
    // Tilt is a nod to the frame's angle, not the full rotation: a full 120°/240° turn threw
    // the mark's bounding box outside the plate. A shallow lean keeps it as marginalia.
    c.style.transform='rotate('+(FRAME_ROT[n] * 0.12).toFixed(2)+'deg)';
    c.innerHTML='<span class="pl3-c-tag">Frame '+FRAME_ROMAN[n]+'</span>'+
                '<span class="pl3-c-tick"></span>'+
                '<span class="pl3-c-vec">'+FRAME_VEC[n]+'</span>';
    clustersWrap.appendChild(c); clusterEls.push(c);
  });
  viewport.appendChild(clustersWrap);

  archCol.appendChild(viewport);
  var margin=div('pl3-margin'); margin.setAttribute('aria-hidden','true');
  margin.innerHTML='GRAVITY VECTORS &nbsp;<b>'+FRAME_VEC[0]+'</b> &nbsp;<b>'+FRAME_VEC[1]+'</b> &nbsp;<b>'+FRAME_VEC[2]+'</b> &nbsp;ISO 30° · ×3';
  archCol.appendChild(margin);
  body.appendChild(archCol);

  /* Right column: always-upright passage panel + controls */
  var textCol=div('pl3-text-col');
  var panel=div('pl3-panel');
  panel.innerHTML='<span class="pl3-panel-tag" id="pl3-panel-tag">Frame '+FRAME_ROMAN[0]+' · '+FRAME_VEC[0]+'</span>'+
                  '<p id="pl3-panel-text">'+PASSAGES[0]+'</p>'+
                  '<span class="pl3-panel-voice">The plate, in the first person — invented for this portfolio, not a documented quotation.</span>';
  textCol.appendChild(panel);

  /* ── State + tween engine ───────────────────────────────────────────────── */
  var RM=api.reducedMotion, current=0, visible=false, anim=null, stackArts=null, buttons=[];
  function easeInOut(u){ return u<0.5 ? 4*u*u*u : 1-Math.pow(-2*u+2,3)/2; }
  function applyAngle(a){ stage.style.transform='rotate('+a.toFixed(2)+'deg)'; }
  function norm(a){ return ((a%360)+360)%360; }
  function shortestTo(from,goal){ return from+(((goal-from+540)%360)-180); }

  function markActive(n) {
    buttons.forEach(function(btn,i){ btn.setAttribute('aria-pressed',i===n?'true':'false'); });
    if(stackArts) stackArts.forEach(function(a,i){ a.classList.toggle('is-active',i===n); });
    clusterEls.forEach(function(c,i){ c.classList.toggle('is-live',i===n); });
    var tag=panel.querySelector('#pl3-panel-tag'), txt=panel.querySelector('#pl3-panel-text');
    if(tag) tag.textContent='Frame '+FRAME_ROMAN[n]+' · '+FRAME_VEC[n];
    if(txt) txt.textContent=PASSAGES[n];
  }

  var loop=api.raf(function tick(){
    if(!anim) return;
    var u=Math.min(1,(performance.now()-anim.t0)/anim.dur);
    applyAngle(anim.from+(anim.to-anim.from)*easeInOut(u));
    if(u>=1){ current=norm(anim.to); applyAngle(current); anim=null; loop.stop(); }
  });

  function setFrame(n){
    markActive(n);
    live.textContent='Frame '+FRAME_ROMAN[n]+' is now upright. Gravity '+FRAME_VEC[n]+'. The other two frames are turned aside.';
    var to=shortestTo(current,FRAME_ROT[n]);
    if(RM||!visible){ current=norm(to); applyAngle(current); return; }
    anim={from:current,to:to,t0:performance.now(),dur:820};
    loop.start();
  }

  /* Controls */
  var controls=div('pl3-controls');
  controls.setAttribute('role','group');
  controls.setAttribute('aria-label','Choose which gravity frame is upright');
  for(var b=0;b<3;b++){
    (function(n){
      var btn=document.createElement('button');
      btn.type='button'; btn.className='pl3-btn';
      btn.setAttribute('aria-pressed',n===0?'true':'false');
      btn.setAttribute('aria-label','Frame '+FRAME_ROMAN[n]+', gravity '+FRAME_VEC[n]+'. Rotate so this frame is upright.');
      btn.innerHTML='Frame '+FRAME_ROMAN[n]+'<span class="pl3-vec">'+FRAME_VEC[n]+'</span>';
      btn.addEventListener('click',function(){ setFrame(n); });
      controls.appendChild(btn); buttons.push(btn);
    })(b);
  }
  textCol.appendChild(controls);

  /* Frame badges for narrow viewports (corner marks hide there) */
  var ghostRow=div('pl3-ghost-row'); ghostRow.setAttribute('aria-hidden','true');
  FRAME_ROMAN.forEach(function(roman,n){
    var badge=document.createElement('span'); badge.className='pl3-ghost-badge';
    badge.textContent='Frame '+roman; badge.style.transform='rotate('+FRAME_ROT[n]+'deg)';
    ghostRow.appendChild(badge);
  });
  textCol.appendChild(ghostRow);
  body.appendChild(textCol);
  root.appendChild(body);

  var live=div('pl3-live'); live.setAttribute('aria-live','polite');
  root.appendChild(live);

  var caption=document.createElement('p'); caption.className='pl3-caption';
  caption.innerHTML='PLATE III — <em>Relativity</em>. One house, three gravities, '+
    'each population upright in its own frame and walking on what another calls a wall. '+
    'Choose a frame; the building obeys, and a floor becomes a ceiling. No point of view is the true one.';
  root.appendChild(caption);

  /* Reduced-motion stacked fallback */
  if(RM){
    var stack=div('pl3-stack');
    PASSAGES.forEach(function(text,n){
      var art=document.createElement('article');
      if(n===0) art.className='is-active';
      art.innerHTML='<h3>Frame '+FRAME_ROMAN[n]+' · '+FRAME_VEC[n]+'</h3><p>'+text+'</p>';
      stack.appendChild(art);
    });
    root.insertBefore(stack,caption);
    stackArts=Array.prototype.slice.call(stack.querySelectorAll('article'));
    var note=document.createElement('p'); note.className='pl3-note';
    note.textContent='Rotation suppressed — reduced-motion enabled. All three frames shown upright below.';
    root.insertBefore(note,stack);
  }

  applyAngle(0); markActive(0);
  api.onVisible(root,
    function onEnter(){ visible=true; if(anim) loop.start(); },
    function onExit(){  visible=false; loop.stop(); }
  );
  return { destroy: function(){ loop.stop(); } };
};
