#!/usr/bin/env python3
"""Render ONLY the figure elements (ink body, ink-2 hem, fold line, pale face),
each isolated and zoomed, so we can judge whether the silhouette reads as a
robed person independent of the architecture behind it."""
import json, os
from PIL import Image
from raster import render, PALETTE, hex2rgb

HERE=os.path.dirname(os.path.abspath(__file__))
elems=json.load(open(os.path.join(HERE,'geom.json')))

# The figure elements: 6 groups of 4 (body ink, hem ink-2, fold line ink-2, face paper-2).
# Identify them: bodies are the 6 var(--ink) paths; group siblings follow immediately.
# Easiest: figures are the LAST big block before the corner tint (bistre/teal/vermilion).
# We isolate by fill signature.
fig_elems=[]
for x in elems:
    a=x['attrs']; f=a.get('fill'); s=a.get('stroke')
    if x['tag']=='path' and f in ('var(--ink)','var(--paper-2)'):
        fig_elems.append(x)
    if x['tag']=='path' and f=='var(--ink-2)':
        fig_elems.append(x)
    if x['tag']=='line' and s=='var(--ink-2)':
        fig_elems.append(x)

# Group into 6 figures by proximity of first body coord. Instead, just render all
# figure elements over the floor color, full frame, no rotation, then crop each.
img=render(fig_elems, angle=0, bg='paper')
img.save(os.path.join(HERE,'figures_all.png'))

# crop each of the 6 figures using the 6 ink-body M coords
import re
bodies=[x for x in elems if x['tag']=='path' and x['attrs'].get('fill')=='var(--ink)']
centers=[]
for b in bodies:
    xs=[]; ys=[]
    for m in re.finditer(r'(-?\d+\.?\d*),(-?\d+\.?\d*)', b['attrs']['d']):
        xs.append(float(m.group(1))); ys.append(float(m.group(2)))
    centers.append((sum(xs)/len(xs), sum(ys)/len(ys), min(xs),max(xs),min(ys),max(ys)))

# figures_all is rendered at img.width px from 700 viewBox
SC=img.width/700.0
tiles=[]
for i,(cx,cy,x0,x1,y0,y1) in enumerate(centers):
    pad=46
    box=(int((cx-pad)*SC),int((cy-pad*1.35)*SC),int((cx+pad)*SC),int((cy+pad*0.4)*SC))
    tile=img.crop(box).resize((240,300),Image.LANCZOS)
    tiles.append(tile)

# montage 3x2
M=Image.new('RGB',(240*3,300*2),hex2rgb(PALETTE['paper-3']))
for i,t in enumerate(tiles):
    M.paste(t,((i%3)*240,(i//3)*300))
M.save(os.path.join(HERE,'figures_montage.png'))
print('wrote figures_all.png and figures_montage.png; centers:')
for c in centers: print('  ',[round(v,1) for v in c])
