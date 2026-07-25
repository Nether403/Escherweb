// Headless smoke test for the module itself: stub a 2D context + the api,
// mount the plate, and assert the behaviour that matters — tiles render, the
// hyperbolic-distance readout climbs after travel, the rim stays ∞, and
// return-to-centre zeroes the distance. No browser required.
'use strict';

// ---- minimal DOM / canvas / window stubs --------------------------
let arcCalls = 0, fillCalls = 0;
function makeCtx() {
  return new Proxy({}, {
    get(_t, k) {
      if (k === 'getContext') return () => makeCtx();
      if (k === 'arc') return () => { arcCalls++; };
      if (k === 'fill') return () => { fillCalls++; };
      // every other 2D method is a no-op; properties read/write freely
      return typeof k === 'string' && /^[a-z]/.test(k) ? () => {} : undefined;
    },
    set() { return true; }
  });
}
function makeEl(tag) {
  const listeners = {};
  const el = {
    tagName: tag, children: [], style: {}, dataset: {}, _text: '',
    classList: { add() {}, remove() {} },
    setAttribute() {}, getAttribute() { return null; },
    setPointerCapture() {}, releasePointerCapture() {},
    addEventListener(t, cb) { (listeners[t] = listeners[t] || []).push(cb); },
    removeEventListener(t, cb) { if (listeners[t]) listeners[t] = listeners[t].filter((f) => f !== cb); },
    dispatch(t, e) { (listeners[t] || []).forEach((f) => f(e)); },
    getBoundingClientRect() { return { width: 640, height: 640, left: 0, top: 0 }; },
    getContext() { return makeCtx(); },
    focus() {},
    set innerHTML(v) { this._html = v; this._index(); },
    get innerHTML() { return this._html || ''; },
    set textContent(v) { this._text = String(v); },
    get textContent() { return this._text; },
    _index() {
      // register the ids the module looks up so querySelector can find them
      const ids = (this._html.match(/id="([^"]+)"/g) || []).map((s) => s.slice(4, -1));
      this._byId = {};
      for (const id of ids) this._byId[id] = makeEl('stub');
    },
    querySelector(sel) {
      const m = sel.match(/#([\w-]+)/);
      if (m && this._byId && this._byId[m[1]]) return this._byId[m[1]];
      return makeEl('stub');
    }
  };
  return el;
}

const rafCbs = [];
global.window = {
  devicePixelRatio: 2,
  ResizeObserver: function (cb) { return { observe() {}, disconnect() {} }; },
  addEventListener() {}, removeEventListener() {},
  requestAnimationFrame(cb) { rafCbs.push(cb); return rafCbs.length; },
  cancelAnimationFrame() {}
};
global.getComputedStyle = function () {
  return { getPropertyValue(name) {
    // return distinct fake colours per palette var so 4-colouring is exercised
    return { '--ink': '#17140F', '--bistre': '#7A5330', '--teal': '#1D6A68',
             '--paper-2': '#DFD5BE', '--paper': '#EAE2CF' }[name.trim()] || '#000';
  } };
};

// ---- fake api per the contract ------------------------------------
function makeApi(reduced) {
  return {
    reducedMotion: !!reduced,
    state: 'day',
    onVisible(el, onEnter /*, onExit */) { onEnter(); }, // simulate becoming visible
    onStateChange() { return function () {}; },
    reduceLabel() {},
    raf(tick) {
      // synchronous: run one tick immediately when started
      return { start() { tick(16); }, stop() {} };
    },
    svg() { return makeEl('svg'); }
  };
}

// ---- load the module ----------------------------------------------
require('../modules/plate8-circle-limit.js');
const P = global.window.EscherPlate8;

function assert(cond, msg) {
  if (!cond) { console.error('FAIL: ' + msg); process.exitCode = 1; }
  else console.log('ok   - ' + msg);
}

assert(P && P.id === 'circle-limit', "global window.EscherPlate8 with id 'circle-limit'");
assert(typeof P.css === 'string' && P.css.indexOf('.plate--circle-limit') === 0,
  'exposes .css scoped under .plate--circle-limit');

// mount (interactive / motion-allowed)
const root = makeEl('div');
const api = makeApi(false);
arcCalls = 0; fillCalls = 0;
const inst = P.mount(root, api);
assert(inst && typeof inst.destroy === 'function', 'mount() returns an object with destroy()');
assert(arcCalls > 200, 'render drew many geodesic arcs (arc calls=' + arcCalls + ')');

const distEl = root._byId['pl8-dist'];
const tilesEl = root._byId['pl8-tiles'];
const stage = root._byId['pl8-stage'];
assert(Number(tilesEl.textContent) > 100, 'reports > 100 tiles drawn (' + tilesEl.textContent + ')');
assert(distEl.textContent === '0.000', 'distance starts at 0.000 (' + distEl.textContent + ')');

// travel via keyboard (ArrowRight) and confirm distance climbs
const before = Number(distEl.textContent);
stage.dispatch('keydown', { key: 'ArrowRight', preventDefault() {} });
const after1 = Number(distEl.textContent);
assert(after1 > before, 'hyperbolic distance climbs after one step (' + after1 + ' > ' + before + ')');

// keep travelling — distance must keep growing without bound-ish
stage.dispatch('keydown', { key: 'ArrowRight', preventDefault() {} });
stage.dispatch('keydown', { key: 'ArrowRight', preventDefault() {} });
stage.dispatch('keydown', { key: 'ArrowRight', preventDefault() {} });
const after4 = Number(distEl.textContent);
assert(after4 > after1, 'distance keeps climbing over successive steps (' + after4 + ' > ' + after1 + ')');

// travel FAR: the disc must stay full of tiles (regeneration at the horizon) and the
// distance must keep climbing without bound — never NaN, never emptying out.
for (let i = 0; i < 60; i++) stage.dispatch('keydown', { key: i % 2 ? 'ArrowRight' : 'ArrowUp', preventDefault() {} });
const farDist = Number(distEl.textContent);
const farTiles = Number(tilesEl.textContent);
assert(isFinite(farDist) && farDist > after4, 'distance still climbing after 60 steps, no NaN (' + farDist + ')');
assert(farTiles > 1000, 'disc stays full of tiles after deep travel — infinity regenerates (' + farTiles + ')');

// return to centre zeroes it
stage.dispatch('keydown', { key: 'Home', preventDefault() {} });
assert(distEl.textContent === '0.000', 'Home key returns distance to 0.000 (' + distEl.textContent + ')');

// the rim never changes: it is the literal ∞ glyph, not derived from distance.
assert(P.css.indexOf('pl8-rim') !== -1, 'rim readout element is styled (constant ∞ in markup)');
assert(root.innerHTML.indexOf('&#8734;') !== -1, 'markup hardcodes DISTANCE TO RIM = ∞ (never recomputed)');

// reduced-motion mount must not throw and must still render a static tiling
const root2 = makeEl('div');
arcCalls = 0;
const inst2 = P.mount(root2, makeApi(true));
assert(arcCalls > 200, 'reduced-motion still renders a static tiling (arc calls=' + arcCalls + ')');
inst2.destroy();

inst.destroy();
console.log(process.exitCode ? '\nSMOKE: FAILURES' : '\nSMOKE: ALL OK');
