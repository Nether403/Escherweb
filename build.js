#!/usr/bin/env node
/* Assemble the eight plates + shell into one self-contained HTML file.
   Each module is wrapped in an IIFE so the eight independently-authored
   files cannot collide in the global scope. */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const MODULES = [
  ['I',    'ascending',      'plate1-ascending.js',       'Ascending and Descending',
   'A closed circuit of stairs on a monastery roof. Every step climbs; the flight returns to its own first tread. Two files of figures pass each other forever, arriving nowhere.'],
  ['II',   'plane-division', 'plate2-plane-division.js',  'Regular Division of the Plane',
   'A square lattice deforms into reptiles, then into birds, and never opens a gap. Mated edges guarantee the tiling: deform one edge and its opposite is bound to follow.'],
  ['III',  'relativity',     'plate3-relativity.js',      'Relativity',
   'One building, three gravities. Each population stands upright in its own frame and walks on what the others call a wall. Choose a frame; the floor obeys you and betrays everyone else.'],
  ['IV',   'print-gallery',  'plate4-print-gallery.js',   'Print Gallery',
   'A gallery containing the print that contains the gallery. Enter it and you descend forever at a scale factor of one third, folded at the recursion period so no seam is ever visible.'],
  ['V',    'day-and-night',  'plate5-day-and-night.js',   'Day and Night',
   'Polder fields rise into birds. The white flock is the black flock’s empty space, and the reverse. There is no background here — only the other bird. The press inverts from this plate.'],
  ['VI',   'drawing-hands',  'plate6-drawing-hands.js',   'Drawing Hands',
   'The left panel is this plate’s own source, read at runtime. The right panel is what that source draws — which is this plate. Neither hand is the author.'],
  ['VII',  'waterfall',      'plate7-waterfall.js',       'Waterfall',
   'Water falls, drives the wheel, and returns along an aqueduct to the top of the fall it just left. Three beams, three locally honest joints, one impossible closure.'],
  ['VIII', 'circle-limit',   'plate8-circle-limit.js',    'Circle Limit',
   'A {6,4} tiling of the hyperbolic plane. In its own metric every figure is the same size; only our Euclidean eyes see them shrink. Travel as far as you like — the rim stays infinitely far away.']
];

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ---- plate sections ----
const sections = MODULES.map(([n, slug, , label, caption], i) => {
  const idx = i + 1;
  return `  <section class="plate plate--sec" id="plate-${idx}" aria-labelledby="h-${slug}">
    <span class="reg reg--tl"></span><span class="reg reg--tr"></span>
    <span class="reg reg--bl"></span><span class="reg reg--br"></span>
    <div class="plate__frame">
      <h2 id="h-${slug}" class="vh">Plate ${n} — ${esc(label)}</h2>
      <div class="plate__mount" id="mount-${slug}"></div>
      <p class="plate__cap">${esc(caption)}</p>
    </div>
  </section>
${i < MODULES.length - 1 ? `  <div class="seam" aria-hidden="true">
    <span class="seam__line"></span>
    <svg class="seam__mark" width="52" height="13" viewBox="0 0 52 13" fill="none"><path d="M0 6.5h11M41 6.5h11" stroke="currentColor" stroke-width=".8"/><path d="M20 1l6 5.5-6 5.5-6-5.5z" stroke="currentColor" stroke-width=".8" fill="none"/><path d="M32 1l6 5.5-6 5.5-6-5.5z" stroke="currentColor" stroke-width=".8" fill="none"/></svg>
    <span class="seam__line"></span>
  </div>
` : ''}`;
}).join('\n');

// ---- module scripts, each sealed in an IIFE ----
const scripts = MODULES.map(([n, , file]) => {
  const src = fs.readFileSync(path.join(DIR, 'modules', file), 'utf8');
  return `<!-- Plate ${n} : ${file} -->\n<script>\n(function(){\n${src}\n})();\n<\/script>`;
}).join('\n');

// ---- caption + mount styles the sections rely on ----
const sectionCss = `
.plate__mount{position:relative}
.plate__cap{
  font-family:var(--font-body);font-style:italic;font-size:.93rem;line-height:1.6;
  color:var(--ink-2);max-width:var(--measure);margin:1.5rem 0 0;
}
.plate--sec:first-of-type .plate__cap{margin-top:1.1rem}
`;

let html = fs.readFileSync(path.join(DIR, 'shell.html'), 'utf8');
html = html.replace('<!--PLATE_SECTIONS-->', sections);
html = html.replace('/*MODULE_CSS*/', sectionCss);
html = html.replace('<!--MODULES-->', scripts);

// Modules must be defined before the shell runtime executes, so move the
// shell's own <script> block to the very end of body.
const shellStart = html.indexOf('<script>\n/* ====');
const shellEnd = html.indexOf('<\/script>', shellStart) + '<\/script>'.length;
if (shellStart === -1) { console.error('FATAL: shell runtime block not found'); process.exit(1); }
const shellBlock = html.slice(shellStart, shellEnd);
html = html.slice(0, shellStart) + html.slice(shellEnd);
html = html.replace('</body>', shellBlock + '\n</body>');

const out = path.join(DIR, 'index.html');
fs.writeFileSync(out, html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log('built -> ' + out);
console.log('size  -> ' + kb + ' KB');
console.log('mount points: ' + (html.match(/id="mount-/g) || []).length);
console.log('module scripts: ' + (html.match(/<!-- Plate /g) || []).length);
console.log('unresolved placeholders: ' +
  (['<!--PLATE_SECTIONS-->', '/*MODULE_CSS*/', '<!--MODULES-->'].filter(p => html.includes(p)).join(', ') || 'none'));
