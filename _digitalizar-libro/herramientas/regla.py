"""regla.py <carpeta>: con src.png y esqueleto.json, crea sNN-a.png / sNN-b.png (mitades ×2 de cada pentagrama con regla de x en px del original)."""
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
d=sys.argv[1]; src=Image.open(os.path.join(d,'src.png')).convert('RGB'); W,H=src.size
E=json.load(open(os.path.join(d,'esqueleto.json')))
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
for i,s in enumerate(E['sistemas'],1):
    sp=s['interlinea']; y0=int(max(0,s['y']-sp*6)); y1=int(min(H,s['y']+sp*10))
    for half,(x0,x1) in zip('ab',[(0,W//2+40),(W//2-40,W)]):
        c=src.crop((x0,y0,x1,y1)); Z=2; c=c.resize(((x1-x0)*Z,(y1-y0)*Z),Image.LANCZOS)
        canvas=Image.new('RGB',(c.width,c.height+40),'white'); canvas.paste(c,(0,40)); dr=ImageDraw.Draw(canvas)
        for x in range((x0//25)*25,x1,25):
            X=(x-x0)*Z
            if X<0: continue
            big=(x%100==0); dr.line([(X,40 if not big else 22),(X,canvas.height)],fill=(255,170,170) if not big else (255,110,110),width=1)
            if big: dr.text((X+3,2),str(x),fill=(200,0,0),font=f)
        canvas.save(os.path.join(d,f's{i:02d}-{half}.png'))
print('ok', d, len(E['sistemas']))
