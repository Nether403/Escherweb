/* Run the real module against a stub DOM, capture every SVG element the module
   creates (tag + attrs), and dump as JSON. This renders EXACTLY the geometry
   the browser will draw — same iso(), same figure() curves — so the PNG we
   rasterize from it is faithful, not an approximation. */
const fs = require('fs');
const path = require('path');

const NS = 'http://www.w3.org/2000/svg';
const created = [];            // flat list of {tag, attrs, parentIdx}
let idCounter = 0;

function makeEl(tag, ns) {
  const el = {
    __idx: idCounter++,
    tag: tag,
    ns: ns || null,
    attrs: {},
    children: [],
    style: {},
    classList: { add(){}, toggle(){}, remove(){} },
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return this.attrs[k]; },
    appendChild(c) { this.children.push(c); c.__parent = this; return c; },
    insertBefore(c) { this.children.push(c); c.__parent = this; return c; },
    addEventListener() {},
    querySelector() { return makeEl('span'); },
    querySelectorAll() { return []; },
    set innerHTML(_) {}, get innerHTML() { return ''; },
    set textContent(_) {}, get textContent() { return ''; },
  };
  return el;
}

const root = makeEl('div');

global.window = {};
global.performance = { now: () => 0 };
global.document = {
  createElementNS(ns, tag) { return makeEl(tag, ns); },
  createElement(tag) { return makeEl(tag); },
};
global.IntersectionObserver = function(){ return { observe(){}, disconnect(){} }; };

// Minimal api per CONTRACT.
const api = {
  reducedMotion: false,
  state: 'day',
  onVisible() {},
  onStateChange() {},
  reduceLabel() {},
  raf() { return { start(){}, stop(){} }; },
  svg(tag, attrs, parent) {
    const e = makeEl(tag, NS);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  },
};

// Load & eval the module (it attaches EscherPlate3 to window).
const src = fs.readFileSync(path.join(__dirname, '../../modules/plate3-relativity.js'), 'utf8');
eval(src);
window.EscherPlate3.mount(root, api);

// Walk the tree, collect every SVG-namespaced element with geometry.
function walk(el, out) {
  if (el.ns === NS && el.tag !== 'svg' && el.tag !== 'defs' && el.tag !== 'g' &&
      el.tag !== 'pattern') {
    out.push({ tag: el.tag, attrs: el.attrs });
  }
  el.children.forEach(c => walk(c, out));
}
const flat = [];
walk(root, flat);
fs.writeFileSync(path.join(__dirname, 'geom.json'), JSON.stringify(flat, null, 0));
console.log('captured', flat.length, 'svg geometry elements');
