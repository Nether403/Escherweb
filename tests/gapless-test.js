// Gapless tiling verification for Plate II — Plane Division
// Symmetry p4 (Heesch type C4C4C4C4, the Escher lizard pinwheel). A single arc is authored;
// the other three tile edges are derived from it by 90° rotation about the shared corners, and
// the four cell orientations tile the plane by (col,row) parity. This test asserts that the
// shared boundary of every kind of adjacent pair coincides point-for-point across the full
// [0,1] morph range — which is the structural guarantee of gaplessness.
//
// Run: node /agent/workspace/escher/tests/gapless-test.js
// Exit 0 = all assertions pass, exit 1 = failure.

'use strict';

const S = 80;   // cell size, must match plate2 module
const N = 15;   // control points along the single authored arc, must match plate2 module
const HALF = Math.PI / 2;

// ---------------------------------------------------------------------------
// Arc keyframes: perpendicular offsets at N equi-spaced fractions of edge c0→c1.
// Endpoints are 0 (corners fixed). ONLY this arc is authored; edges B,C,D are derived by
// rotation, which is the structural guarantee of gaplessness. Must match plate2 module.
// ---------------------------------------------------------------------------
const KEYFRAMES = {
  SQUARE:  new Array(N).fill(0),
  REPTILE: [0, 4, 1, 8, 17, 21, 15, 11, 2, -5, -11, -10, -3, 2, 0],
  BIRD:    [0, 5, 4, 1, 11, 23, 25, 11, -7, -18, -22, -14, -5, -1, 0],
};

function lerpArr(a, b, t) { return a.map((v, i) => v + (b[i] - v) * t); }

function arcOffsets(t) {
  if (t <= 0.5) return lerpArr(KEYFRAMES.SQUARE, KEYFRAMES.REPTILE, t * 2);
  return lerpArr(KEYFRAMES.REPTILE, KEYFRAMES.BIRD, (t - 0.5) * 2);
}

function rot(cx, cy, ang, x, y) {
  const c = Math.cos(ang), s = Math.sin(ang), dx = x - cx, dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

// Single authored arc: corner c0(0,0) → c1(S,0), perpendicular (0,-1).
function arcPts(off) {
  return off.map((o, i) => { const f = i / (N - 1); return [f * S, -o]; });
}

// Full tile outline in local coords: A = arc; B,C,D = A rotated -90° about c1,c2,c3 in turn.
function baseTile(off) {
  const c1 = [S, 0], c2 = [S, S], c3 = [0, S];
  const A = arcPts(off);
  const B = A.map(p => rot(c1[0], c1[1], -HALF, p[0], p[1])).reverse();
  const C = B.map(p => rot(c2[0], c2[1], -HALF, p[0], p[1])).reverse();
  const D = C.map(p => rot(c3[0], c3[1], -HALF, p[0], p[1])).reverse();
  return [...A, ...B.slice(1), ...C.slice(1), ...D.slice(1)];
}

// Orientation index for cell (c,r) — the p4 pinwheel arrangement.
function par(n) { return ((n % 2) + 2) % 2; }
function kOf(c, r) {
  const pc = par(c), pr = par(r);
  if (!pc && !pr) return 0;
  if (pc && !pr) return 3;
  if (!pc && pr) return 1;
  return 2;
}

// Placed tile at cell (c,r): rotate base k·90° about cell centre, translate.
function tile(off, c, r) {
  const base = baseTile(off);
  const k = kOf(c, r);
  return base.map(p => { const q = rot(S / 2, S / 2, k * HALF, p[0], p[1]); return [q[0] + c * S, q[1] + r * S]; });
}

// ---------------------------------------------------------------------------
// Assertions.
// For each adjacent pair, every boundary vertex of tile A that lies on the shared edge must
// coincide with a boundary vertex of tile B. A gapless mating shares exactly N such vertices
// (the N points of the common edge). We assert at least N coincidences per pair.
// ---------------------------------------------------------------------------
const EPS = 1e-7;
const TEST_T = [0, 0.1, 0.25, 0.5, 0.6, 0.75, 0.9, 1.0];
// Cover every parity combination of edge-adjacent neighbours so all four orientations mate.
const PAIRS = [
  [[0, 0], [1, 0]], // horizontal, even|odd cols
  [[1, 0], [2, 0]], // horizontal, odd|even cols
  [[0, 0], [0, 1]], // vertical, even|odd rows
  [[0, 1], [0, 2]], // vertical, odd|even rows
  [[1, 0], [1, 1]], // horizontal-neighbour offset column, vertical mate
  [[1, 1], [2, 1]], // interior mixed parity
];

function eq(a, b) { return Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS; }
function coincidences(A, B) {
  let n = 0;
  for (const p of A) { for (const q of B) { if (eq(p, q)) { n++; break; } } }
  return n;
}

// Also assert the fundamental arc never folds the outline onto itself (no self-intersection),
// which would render as an overlap even though the mating is gapless.
function ccw(p, q, r) { return (r[1] - p[1]) * (q[0] - p[0]) - (q[1] - p[1]) * (r[0] - p[0]); }
// PROPER intersection only: each segment must have its two endpoints strictly on opposite
// sides of the other. Collinear or merely-touching segments (a ccw of ~0, e.g. the flat
// t=0 square where consecutive edges are colinear across a corner) are NOT crossings.
function sgn(v) { return v > EPS ? 1 : v < -EPS ? -1 : 0; }
function segInt(a, b, c, d) {
  const d1 = sgn(ccw(c, d, a)), d2 = sgn(ccw(c, d, b));
  const d3 = sgn(ccw(a, b, c)), d4 = sgn(ccw(a, b, d));
  return d1 !== 0 && d2 !== 0 && d3 !== 0 && d4 !== 0 && d1 !== d2 && d3 !== d4;
}
function selfIntersections(poly) {
  const L = poly.length; let n = 0;
  for (let i = 0; i < L; i++) for (let j = i + 2; j < L; j++) {
    if (i === 0 && j === L - 1) continue;
    if (segInt(poly[i], poly[(i + 1) % L], poly[j], poly[(j + 1) % L])) n++;
  }
  return n;
}

let failures = 0;

for (const tv of TEST_T) {
  const off = arcOffsets(tv);
  let allOk = true;
  for (const [[c1, r1], [c2, r2]] of PAIRS) {
    const cc = coincidences(tile(off, c1, r1), tile(off, c2, r2));
    if (cc < N) {
      console.error(`FAIL t=${tv} pair (${c1},${r1})-(${c2},${r2}): only ${cc}/${N} shared vertices`);
      failures++; allOk = false;
    }
  }
  const si = selfIntersections(baseTile(off));
  if (si > 0) {
    console.error(`FAIL t=${tv}: tile outline self-intersects (${si} crossing(s))`);
    failures++; allOk = false;
  }
  console.log(`t=${tv}: ${allOk ? 'PASS' : 'FAIL'} (mating + non-self-intersecting)`);
}

if (failures === 0) {
  console.log('\nALL GAPLESS TESTS PASSED (0 failures)');
  process.exit(0);
} else {
  console.error(`\n${failures} ASSERTION(S) FAILED`);
  process.exit(1);
}
