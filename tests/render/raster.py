#!/usr/bin/env python3
"""Rasterize the captured plate-3 SVG geometry with PIL.
Faithful: we draw exactly the polygons/paths the module emitted.
Renders the stage at the three frame rotations so we can eyeball
'this frame upright vs the others sideways', plus a zoom on the key pair.
"""
import json, math, re, os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
VB = 700
SS = 3                      # supersample factor for crisp edges
W = VB * SS

PALETTE = {
    'paper':'#EAE2CF','paper-2':'#DFD5BE','paper-3':'#D2C6AB',
    'ink':'#17140F','ink-2':'#3A332A','bistre':'#7A5330','bistre-2':'#A97F52',
    'vermilion':'#B4301D','teal':'#1D6A68','gold':'#A8862B',
}
def col(v, default=None):
    if v is None or v=='none': return None
    v=v.strip()
    m=re.match(r'var\(--([a-z0-9-]+)\)', v)
    if m: return PALETTE.get(m.group(1), default)
    if v.startswith('#'): return v
    return default

def hex2rgb(h):
    h=h.lstrip('#')
    return tuple(int(h[i:i+2],16) for i in (0,2,4))

def flatten_quad(p0,p1,p2,n=18):
    pts=[]
    for i in range(1,n+1):
        t=i/n
        mt=1-t
        x=mt*mt*p0[0]+2*mt*t*p1[0]+t*t*p2[0]
        y=mt*mt*p0[1]+2*mt*t*p1[1]+t*t*p2[1]
        pts.append((x,y))
    return pts

def flatten_cubic(p0,p1,p2,p3,n=20):
    pts=[]
    for i in range(1,n+1):
        t=i/n; mt=1-t
        x=mt**3*p0[0]+3*mt*mt*t*p1[0]+3*mt*t*t*p2[0]+t**3*p3[0]
        y=mt**3*p0[1]+3*mt*mt*t*p1[1]+3*mt*t*t*p2[1]+t**3*p3[1]
        pts.append((x,y))
    return pts

TOKEN=re.compile(r'[MLQCZmlqcz]|-?\d*\.?\d+(?:e-?\d+)?')
def parse_path(d):
    """Return list of subpaths, each a list of (x,y). Absolute cmds only (our
    module emits absolute M/L/Q). Handles Z."""
    toks=TOKEN.findall(d)
    i=0; cur=None; start=None; subs=[]; sub=[]
    def num():
        nonlocal i
        val=float(toks[i]); i+=1; return val
    while i<len(toks):
        t=toks[i]
        if t=='M':
            i+=1
            if sub: subs.append(sub); sub=[]
            cur=(num(),num()); start=cur; sub=[cur]
        elif t=='L':
            i+=1; cur=(num(),num()); sub.append(cur)
        elif t=='Q':
            i+=1; c=(num(),num()); e=(num(),num())
            sub.extend(flatten_quad(cur,c,e)); cur=e
        elif t=='C':
            i+=1; c1=(num(),num()); c2=(num(),num()); e=(num(),num())
            sub.extend(flatten_cubic(cur,c1,c2,e)); cur=e
        elif t in 'Zz':
            i+=1
            if sub: sub.append(start); subs.append(sub); sub=[]
            cur=start
        else:
            i+=1  # skip stray
    if sub: subs.append(sub)
    return subs

def rot(pt, ang_deg, cx, cy):
    a=math.radians(ang_deg)
    x,y=pt[0]-cx, pt[1]-cy
    return (cx + x*math.cos(a)-y*math.sin(a), cy + x*math.sin(a)+y*math.cos(a))

def render(elems, angle=0.0, bg='paper'):
    img=Image.new('RGB',(W,W),hex2rgb(PALETTE[bg]))
    dr=ImageDraw.Draw(img,'RGBA')
    cx=cy=VB/2*SS
    def T(p):
        p=(p[0]*SS,p[1]*SS)
        if angle: p=rot(p,angle,cx,cy)
        return p
    for e in elems:
        tag=e['tag']; a=e['attrs']
        fill=col(a.get('fill'))
        stroke=col(a.get('stroke'))
        op=float(a.get('opacity',1))
        sw=float(a.get('stroke-width',1))*SS
        def rgba(hexc):
            r,g,b=hex2rgb(hexc); return (r,g,b,int(round(op*255)))
        if tag=='path':
            for sub in parse_path(a['d']):
                pts=[T(p) for p in sub]
                if len(pts)<2: continue
                if fill: dr.polygon(pts, fill=rgba(fill))
                if stroke and sw>0: dr.line(pts, fill=rgba(stroke), width=max(1,int(round(sw))))
        elif tag=='polygon':
            pts=[T(tuple(map(float,pr.split(',')))) for pr in a['points'].split()]
            if fill: dr.polygon(pts, fill=rgba(fill))
            if stroke and sw>0: dr.line(pts+[pts[0]], fill=rgba(stroke), width=max(1,int(round(sw))))
        elif tag=='line':
            p1=T((float(a['x1']),float(a['y1']))); p2=T((float(a['x2']),float(a['y2'])))
            if stroke and sw>0: dr.line([p1,p2], fill=rgba(stroke), width=max(1,int(round(sw))))
        elif tag=='circle':
            c=T((float(a['cx']),float(a['cy']))); r=float(a.get('r',2))*SS
            if fill: dr.ellipse([c[0]-r,c[1]-r,c[0]+r,c[1]+r], fill=rgba(fill))
    return img.resize((VB*2,VB*2), Image.LANCZOS)

def main():
    elems=json.load(open(os.path.join(HERE,'geom.json')))
    # three frame rotations (module FRAME_ROT = [0,120,240])
    for name,ang in [('frameI',0),('frameII',120),('frameIII',240)]:
        render(elems, ang).save(os.path.join(HERE, f'stage_{name}.png'))
    # zoom on key pair region (upright frame I). Crop center-ish.
    full=render(elems,0)
    # crop a window around the key figures then upscale
    box=(int(full.width*0.30),int(full.height*0.28),int(full.width*0.78),int(full.height*0.82))
    full.crop(box).resize((760,760),Image.LANCZOS).save(os.path.join(HERE,'zoom_keypair.png'))
    print('rendered stage_frameI/II/III.png + zoom_keypair.png')

if __name__=='__main__':
    main()
