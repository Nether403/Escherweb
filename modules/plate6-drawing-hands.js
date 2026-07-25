/* PLATE VI — "Drawing Hands"  window.EscherPlate6  slug: drawing-hands
   Left panel: live source of this module via mount.toString() — the hand that
   writes. Right panel: bounded recursive miniature, depth-capped at MAX_DEPTH=3.
   Typewriter reveals pre-highlighted chunks by opacity sequence, never re-parses.
   Recursion guarded by explicit depth counter; hard-stops with ink block + label. */

window.EscherPlate6 = { id: 'drawing-hands' };

window.EscherPlate6.css = `
.plate--drawing-hands{background:var(--paper);font-family:var(--font-body);position:relative;overflow:hidden}
.pl6-header{display:flex;align-items:baseline;gap:1.6em;padding:1.2rem 2rem .5rem;border-bottom:.5px solid var(--paper-3)}
.pl6-num{font-family:var(--font-display);font-size:.65rem;letter-spacing:.22em;color:var(--bistre);text-transform:uppercase}
.pl6-title{font-family:var(--font-display);font-size:1.05rem;letter-spacing:.06em;color:var(--ink)}
.pl6-anno{font-size:.58rem;letter-spacing:.18em;color:var(--ink-2);text-transform:uppercase;margin-left:auto;font-family:var(--font-mono)}
.pl6-frame{display:flex;border:.5px solid var(--paper-3);margin:1.4rem 2rem;background:var(--paper-2);box-shadow:2px 3px 18px color-mix(in srgb,var(--ink) 18%,transparent)}
.pl6-panel{flex:1 1 50%;min-width:0;display:flex;flex-direction:column}
.pl6-panel-label{font-family:var(--font-mono);font-size:.52rem;letter-spacing:.18em;color:var(--ink-2);padding:.45rem .9rem .3rem;border-bottom:.5px solid var(--paper-3);background:var(--paper-2);text-transform:uppercase;opacity:.75;user-select:none}
.pl6-code-wrap{flex:1 1 auto;overflow:auto;background:var(--paper);max-height:420px;min-height:220px}
.pl6-code-wrap:focus{outline:1.5px solid var(--vermilion);outline-offset:-1.5px}
.pl6-code{display:block;padding:.7rem 1rem .7rem 3rem;margin:0;font-family:var(--font-mono);font-size:11px;line-height:1.65;color:var(--ink);white-space:pre;min-width:max-content}
.pl6-ln{display:inline-block;position:absolute;left:0;width:2.4rem;text-align:right;padding-right:.5rem;color:var(--ink-2);opacity:.38;user-select:none;pointer-events:none;font-size:10px}
.pl6-hl-yah{background:color-mix(in srgb,var(--teal) 18%,transparent);border-left:2px solid var(--teal)}
.pl6-render-wrap{flex:1 1 auto;overflow:hidden;background:var(--paper-2);max-height:420px;min-height:220px;display:flex}
.pl6-render-inner{flex:1;overflow:hidden;position:relative}
.pl6-divider{width:1px;background:var(--paper-3);flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.pl6-controls{display:flex;gap:1rem;padding:.5rem 2rem .6rem;border-top:.5px solid var(--paper-3);flex-wrap:wrap}
.pl6-btn{font-family:var(--font-mono);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;padding:.35rem .9rem;border:1px solid var(--ink-2);background:transparent;color:var(--ink);cursor:pointer;transition:background .12s,color .12s}
.pl6-btn:hover{background:var(--ink);color:var(--paper)}
.pl6-btn:focus-visible{outline:1.5px solid var(--vermilion);outline-offset:2px}
.pl6-caption{padding:.4rem 2rem .9rem;font-size:.75rem;color:var(--ink-2);max-width:58ch;line-height:1.55;font-style:italic}
.pl6-neither{display:block;margin-top:.3em;font-family:var(--font-mono);font-size:.55rem;letter-spacing:.15em;color:var(--bistre);text-transform:uppercase;font-style:normal}
.pl6-rplate{width:100%;height:100%;background:var(--paper);display:flex;flex-direction:column;overflow:hidden}
.pl6-rpanels{display:flex;flex:1;overflow:hidden}
.pl6-rpanel{flex:1;overflow:hidden;background:var(--paper-2)}
.pl6-rlabel{font-family:var(--font-mono);font-size:8px;letter-spacing:.1em;color:var(--ink-2);padding:3px 5px;border-bottom:.5px solid var(--paper-3);opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl6-rcode{padding:4px 6px;font-family:var(--font-mono);font-size:7px;line-height:1.5;color:var(--ink);white-space:pre;overflow:hidden;opacity:.82}
.pl6-dlimit{display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:var(--paper-3);flex-direction:column;gap:6px}
.pl6-dlabel{font-family:var(--font-mono);font-size:8px;letter-spacing:.14em;color:var(--ink-2);text-transform:uppercase;opacity:.7}
.pl6-dblock{width:32px;height:20px;background:var(--ink);opacity:.85}
.pl6-rdiv{width:1px;background:var(--paper-3);flex-shrink:0}
.pl6-kw{color:var(--teal)}.pl6-str{color:var(--bistre)}.pl6-cmt{color:var(--ink-2);opacity:.7;font-style:italic}.pl6-num{color:var(--vermilion)}
@media(max-width:600px){.pl6-frame{flex-direction:column;margin:1rem .8rem}.pl6-divider{width:100%;height:1px;flex-direction:row}.pl6-cuff-svg{transform:rotate(90deg)}.pl6-panel-label{font-size:.48rem}.pl6-code{font-size:10px}}
`;

window.EscherPlate6.mount = function mount(root, api) {
  const S = 'pl6';
  const MAX_DEPTH = 3;
  root.classList.add('plate--drawing-hands');

  root.innerHTML = `
    <div class="${S}-header">
      <span class="${S}-num">PLATE VI</span>
      <span class="${S}-title">Drawing Hands</span>
      <span class="${S}-anno">SELF-REFERENCE / DEPTH ${MAX_DEPTH}</span>
    </div>
    <div class="${S}-frame" role="group" aria-label="Two panels: source code left, rendered output right">
      <div class="${S}-panel">
        <div class="${S}-panel-label" aria-hidden="true">LEFT HAND — THE CODE THAT DRAWS</div>
        <div class="${S}-code-wrap" id="${S}-cw" tabindex="0" role="region"
             aria-label="Source code of this plate (syntax-highlighted; keyboard-scrollable)">
          <pre class="${S}-code" id="${S}-pre" aria-hidden="true" style="position:relative"></pre>
          <span class="sr-only">Source code of Plate VI, Drawing Hands — the same code that produced this display.</span>
        </div>
      </div>
      <div class="${S}-divider" aria-hidden="true">
        <svg class="${S}-cuff-svg" id="${S}-svg" width="44" height="340"
             viewBox="0 0 44 340" aria-hidden="true" focusable="false" style="overflow:visible"></svg>
      </div>
      <div class="${S}-panel">
        <div class="${S}-panel-label" aria-hidden="true">RIGHT HAND — THE DRAWING DRAWN</div>
        <div class="${S}-render-wrap">
          <div class="${S}-render-inner" id="${S}-ri"></div>
        </div>
      </div>
    </div>
    <div class="${S}-controls">
      <button type="button" class="${S}-btn" id="${S}-redraw"
              aria-label="Redraw: restart the typewriter writing pass">REDRAW</button>
      <button type="button" class="${S}-btn" id="${S}-vs"
              aria-label="View source — you are already viewing the source. This plate IS its own source code.">VIEW SOURCE</button>
    </div>
    <p class="${S}-caption">Neither panel is the original. The left hand writes the right; the right hand is the left.
      The code that draws itself cannot precede itself in authorship.
      <span class="${S}-neither">Hofstadter would have words. Escher had none. Both were right.</span></p>`;

  const pre     = root.querySelector(`#${S}-pre`);
  const cw      = root.querySelector(`#${S}-cw`);
  const ri      = root.querySelector(`#${S}-ri`);
  const cuffSvg = root.querySelector(`#${S}-svg`);

  // Real self-reference: read this function's own text at runtime
  const src = window.EscherPlate6.mount.toString();

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Highlight once, cache. HTML-escape first to prevent source injection.
  const KW = /\b(const|let|var|function|return|if|else|for|while|new|this|null|undefined|true|false|typeof|instanceof|in|of|switch|case|break|default)\b/g;
  const highlightedHtml = src.split('\n').map((raw, i) => {
    let h = esc(raw);
    h = h.replace(/(\/\/[^\n]*)/g, '<span class="pl6-cmt">$1</span>');
    h = h.replace(KW, '<span class="pl6-kw">$1</span>');
    h = h.replace(/\b(\d+\.?\d*)\b/g, '<span class="pl6-num">$1</span>');
    return `<span class="${S}-line" data-ln="${i+1}"><span class="${S}-ln" aria-hidden="true">${i+1}</span>${h}</span>`;
  }).join('\n');

  // Cuff SVG: two sleeve/hand silhouettes facing the center seam
  function drawCuffs(el) {
    el.innerHTML = '';
    const ns = 'http://www.w3.org/2000/svg';
    const H = 340, MID = H / 2;
    const mk = (tag, a) => { const e = document.createElementNS(ns,tag); Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v)); el.appendChild(e); return e; };
    const ln = (x1,y1,x2,y2,sw,c) => mk('line',{x1,y1,x2,y2,stroke:c||'var(--ink)','stroke-width':sw||.75,'vector-effect':'non-scaling-stroke'});
    const pt = (d,sw,c) => mk('path',{d,fill:'none',stroke:c||'var(--ink)','stroke-width':sw||.75,'stroke-linejoin':'miter','vector-effect':'non-scaling-stroke'});
    // Upper sleeve (points down, pencil toward center)
    const U = MID - 14;
    pt(`M 8 0 L 6 ${U-60} Q 12 ${U-10} 22 ${U} Q 32 ${U-10} 38 ${U-60} L 36 0`, 1);
    pt(`M 5 ${U-68} Q 22 ${U-58} 39 ${U-68}`, .75, 'var(--bistre)');
    pt(`M 6 ${U-74} Q 22 ${U-64} 38 ${U-74}`, .5, 'var(--bistre)');
    for (let y = 20; y < U-68; y += 9) ln(7,y,37,y+6,.5,'var(--ink-2)');
    pt(`M 18 ${U-4} L 16 ${U+20} L 20 ${U+28} L 24 ${U+20} L 22 ${U-4}`, .75);
    pt(`M 20 ${U+28} L 20 ${U+38}`, 1);
    [14,16,24,26].forEach((x,j) => ln(x,U+2+(j%2)*2, x+6, U+10+(j%2)*2, .5,'var(--bistre)'));
    // Lower sleeve (points up, graver toward center)
    const D = MID + 14;
    pt(`M 8 ${H} L 6 ${D+60} Q 12 ${D+10} 22 ${D} Q 32 ${D+10} 38 ${D+60} L 36 ${H}`, 1);
    pt(`M 5 ${D+68} Q 22 ${D+58} 39 ${D+68}`, .75, 'var(--bistre)');
    pt(`M 6 ${D+74} Q 22 ${D+64} 38 ${D+74}`, .5, 'var(--bistre)');
    for (let y = D+70; y < H-10; y += 9) ln(7,y,37,y+6,.5,'var(--ink-2)');
    pt(`M 18 ${D+4} L 16 ${D-20} L 20 ${D-28} L 24 ${D-20} L 22 ${D+4}`, .75);
    pt(`M 20 ${D-28} L 20 ${D-38}`, 1);
    [14,16,24,26].forEach((x,j) => ln(x,D-2-(j%2)*2, x+6, D-10-(j%2)*2, .5,'var(--bistre)'));
    // Vermilion center seam
    ln(22, MID-10, 22, MID+10, 1, 'var(--vermilion)');
  }
  drawCuffs(cuffSvg);

  // Recursive miniature builder — hard-capped at MAX_DEPTH
  function buildLevel(container, depth) {
    if (depth >= MAX_DEPTH) {
      const lim = document.createElement('div');
      lim.className = `${S}-dlimit`;
      lim.innerHTML = `<div class="${S}-dblock" aria-hidden="true"></div><span class="${S}-dlabel">DEPTH LIMIT</span>`;
      container.appendChild(lim);
      return;
    }
    const plate = document.createElement('div'); plate.className = `${S}-rplate`;
    const panels = document.createElement('div'); panels.className = `${S}-rpanels`;
    const lp = document.createElement('div'); lp.className = `${S}-rpanel`;
    const ll = document.createElement('div'); ll.className = `${S}-rlabel`; ll.textContent = `CODE / DEPTH ${depth+1}`;
    const lc = document.createElement('pre'); lc.className = `${S}-rcode`; lc.setAttribute('aria-hidden','true');
    lc.textContent = src.split('\n').slice(0, Math.max(6, 14 - depth * 4)).join('\n');
    lp.append(ll, lc);
    const dv = document.createElement('div'); dv.className = `${S}-rdiv`; dv.setAttribute('aria-hidden','true');
    const rp = document.createElement('div'); rp.className = `${S}-rpanel`;
    const rl = document.createElement('div'); rl.className = `${S}-rlabel`; rl.textContent = `RENDER / DEPTH ${depth+1}`;
    rp.appendChild(rl);
    buildLevel(rp, depth + 1);  // guarded by depth >= MAX_DEPTH above
    panels.append(lp, dv, rp);
    plate.appendChild(panels);
    container.appendChild(plate);
  }
  buildLevel(ri, 0);

  // Typewriter pass: reveal pre-highlighted chunks by opacity sequence
  let active = false, tids = [];
  const CHUNK = 8;
  const lineSpans = highlightedHtml.split('\n');
  const chunks = [];
  for (let i = 0; i < lineSpans.length; i += CHUNK)
    chunks.push(lineSpans.slice(i, i+CHUNK).join('\n'));

  function showAll() { pre.innerHTML = highlightedHtml; }

  // Find the line in the source that calls buildLevel(ri, 0)
  const yLine = (() => {
    const ls = src.split('\n');
    for (let i = 0; i < ls.length; i++)
      if (ls[i].includes('buildLevel') && ls[i].includes('ri,')) return i + 1;
    return -1;
  })();

  function startPass() {
    if (active) return;
    tids.forEach(clearTimeout); tids = [];
    pre.innerHTML = ''; active = true;
    if (api.reducedMotion) { showAll(); active = false; return; }
    const frag = document.createDocumentFragment();
    const els = chunks.map((html, i) => {
      const sp = document.createElement('span');
      sp.innerHTML = html + (i < chunks.length-1 ? '\n' : '');
      sp.style.cssText = 'opacity:0;transition:opacity 0.08s';
      frag.appendChild(sp); return sp;
    });
    pre.appendChild(frag);
    els.forEach((sp, i) => {
      const t = setTimeout(() => {
        sp.style.opacity = '1';
        const s0 = i*8+1, s1 = s0+7;
        if (yLine >= s0 && yLine <= s1) {
          const yt = setTimeout(() => {
            const tgt = pre.querySelector(`[data-ln="${yLine}"]`);
            if (tgt) {
              tgt.classList.add(`${S}-hl-yah`);
              cw.scrollTo({ top: tgt.offsetTop - 40, behavior: 'smooth' });
              const rt = setTimeout(() => tgt.classList.remove(`${S}-hl-yah`), 2500);
              tids.push(rt);
            }
          }, 400);
          tids.push(yt);
        }
        if (i === els.length-1) active = false;
      }, i * 38);
      tids.push(t);
    });
  }

  let played = false;
  if (api.reducedMotion) { showAll(); played = true; }

  api.onVisible(root, () => {
    if (!played) { played = true; const t = setTimeout(startPass, 180); tids.push(t); }
  });

  root.querySelector(`#${S}-redraw`).addEventListener('click', () => {
    tids.forEach(clearTimeout); tids = []; active = false; played = false;
    startPass(); played = true;
  });

  root.querySelector(`#${S}-vs`).addEventListener('click', () => {
    cw.focus(); cw.scrollTo({ top: 0, behavior: 'smooth' });
  });

  api.onStateChange(() => drawCuffs(cuffSvg));

  return { destroy() { tids.forEach(clearTimeout); tids = []; } };
};
