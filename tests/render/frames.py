#!/usr/bin/env python3
"""For each of the three gravity frames, render the stage rotated so that frame
is upright, then crop tightly on the figures that BELONG to that frame — they
should read as standing people. Also render the same figures in a non-upright
frame to confirm they hang sideways (that contrast is the plate)."""
import json, os, re, math
from PIL import Image
from raster import render, PALETTE, hex2rgb, rot

HERE=os.path.dirname(os.path.abspath(__file__))
elems=json.load(open(os.path.join(HERE,'geom.json')))
VB=700

# 6 ink bodies, in module order:
# 0,1 -> z=0 floor (upright at rot 0 / frame I)
# 2,3 -> x=0 wall  (upright at rot 240 / frame III)
# 4,5 -> y=0 wall  (upright at rot 120 / frame II)
bodies=[x for x in elems if x['tag']=='path' and x['attrs'].get('fill')=='var(--ink)']
def centroid(b):
    xs=[];ys=[]
    for m in re.finditer(r'(-?\d+\.?\d*),(-?\d+\.?\d*)', b['attrs']['d']):
        xs.append(float(m.group(1)));ys.append(float(m.group(2)))
    return (sum(xs)/len(xs), sum(ys)/len(ys))
cents=[centroid(b) for b in bodies]

FRAME_ROT=[0,120,240]
# which body indices belong to each frame
belong={0:[0,1], 1:[4,5], 2:[2,3]}
cx=cy=VB/2

def crop_upright(img, idxs, ang):
    SC=img.width/VB
    pts=[]
    for i in idxs:
        p=cents[i]
        if ang: p=rot(p,ang,cx,cy)
        pts.append(p)
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
    minx,maxx=min(xs),max(xs); miny,maxy=min(ys),max(ys)
    padx=70; pady=70
    box=(int((minx-padx)*SC),int((miny-pady*1.3)*SC),int((maxx+padx)*SC),int((maxy+pady*0.7)*SC))
    return img.crop(box)

for fi,ang in enumerate(FRAME_ROT):
    img=render(elems, ang)
    tile=crop_upright(img, belong[fi], ang)
    tile.save(os.path.join(HERE, f'frame{fi+1}_upright_figs.png'))
    print(f'frame {fi+1} (rot {ang}) upright-figures crop: {tile.size}')
print('done')
