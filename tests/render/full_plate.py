#!/usr/bin/env python3
"""Composite preview of the whole plate viewport: rasterized SVG stage + the
three corner frame-marks (HTML/CSS in the module) drawn as rotated mono text.
Approximates the real layout closely enough to judge the ghost-text fix:
do the marks sit in empty corners and read as quiet marginalia, not smears?"""
import json, os, re, math
from PIL import Image, ImageDraw, ImageFont
from raster import render, PALETTE, hex2rgb

HERE=os.path.dirname(os.path.abspath(__file__))
elems=json.load(open(os.path.join(HERE,'geom.json')))
MONO='/usr/share/fonts/liberation-mono/LiberationMono-Regular.ttf'

def tint(hexc, op):
    return tuple(list(hex2rgb(hexc))+[int(op*255)])

def draw_mark(base, roman, vec, angle, corner, live):
    """Render one corner mark onto its own RGBA tile then rotate+paste."""
    W=base.width
    f_tag=ImageFont.truetype(MONO, int(W*0.020))
    f_vec=ImageFont.truetype(MONO, int(W*0.017))
    op=0.72 if live else 0.42
    # build tile
    tile=Image.new('RGBA',(int(W*0.22),int(W*0.10)),(0,0,0,0))
    d=ImageDraw.Draw(tile)
    d.text((0,0),('Frame '+roman).upper(),font=f_tag,fill=tint(PALETTE['bistre'],op))
    d.line((0,int(W*0.032),int(W*0.05),int(W*0.032)),fill=tint(PALETTE['bistre'],op*0.7),width=2)
    d.text((0,int(W*0.045)),vec,font=f_vec,fill=tint(PALETTE['ink-2'],op))
    tile=tile.rotate(-angle, expand=True, resample=Image.BICUBIC)
    # position by corner dict (percent)
    x=corner.get('left'); r=corner.get('right')
    t=corner.get('top'); b=corner.get('bottom')
    px = int(x/100*W) if x is not None else W-tile.width-int(r/100*W)
    py = int(t/100*W) if t is not None else W-tile.height-int(b/100*W)
    base.alpha_composite(tile,(px,py))

def main():
    for fi,ang in [(0,0),(1,120),(2,240)]:
        stage=render(elems, ang).convert('RGBA')
        # ASCII-safe vectors for the preview font (subscripts/minus won't render)
        vecs=['g1=(0,0,-1)','g2=(0,-1,0)','g3=(-1,0,0)']
        romans=['I','II','III']
        corners=[{'bottom':2.5,'left':2},{'bottom':2.5,'right':2},{'top':2.5,'right':2}]
        for n in range(3):
            draw_mark(stage, romans[n], vecs[n], [0,120,240][n], corners[n], live=(n==fi))
        stage.convert('RGB').save(os.path.join(HERE, f'plate_frame{fi+1}.png'))
        print('wrote plate_frame%d.png'%(fi+1))

if __name__=='__main__':
    main()
