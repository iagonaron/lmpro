#!/usr/bin/env python3
# rejilla.py — (11-nov-2026) ayuda para marcar esquinas: la foto con una rejilla de coordenadas.
# Uso: python3 rejilla.py FOTO SALIDA.png                      → la foto entera, rejilla cada 100 px (rojo = cada 500)
#      python3 rejilla.py FOTO SALIDA.png x,y [x,y …]          → ampliaciones de 240×240 px alrededor de cada punto,
#                                                                 rejilla cada 20 px con su coordenada ABSOLUTA escrita
import sys
from PIL import Image, ImageDraw
foto, sal, pts = sys.argv[1], sys.argv[2], sys.argv[3:]
im = Image.open(foto).convert('RGB')
W, H = im.size
if not pts:
    d = ImageDraw.Draw(im)
    for x in range(0, W, 100):
        d.line([(x, 0), (x, H)], fill=(255, 0, 0) if x % 500 == 0 else (255, 150, 150), width=3 if x % 500 == 0 else 1)
        d.text((x + 4, 4), str(x), fill=(200, 0, 0))
    for y in range(0, H, 100):
        d.line([(0, y), (W, y)], fill=(0, 0, 255) if y % 500 == 0 else (150, 150, 255), width=3 if y % 500 == 0 else 1)
        d.text((4, y + 4), str(y), fill=(0, 0, 200))
    f = 1400 / max(W, H)
    im.resize((int(W * f), int(H * f))).save(sal)
else:
    Z, E = 240, 1.6
    tiles = []
    for p in pts:
        cx, cy = [int(float(v)) for v in p.split(',')]
        x0, y0 = cx - Z // 2, cy - Z // 2
        c = Image.new('RGB', (Z, Z), 'white'); c.paste(im.crop((x0, y0, x0 + Z, y0 + Z)), (0, 0))
        c = c.resize((int(Z * E), int(Z * E)), Image.LANCZOS); d = ImageDraw.Draw(c)
        for v in range((x0 // 20 + 1) * 20, x0 + Z, 20):
            X = (v - x0) * E; d.line([(X, 0), (X, Z * E)], fill=(255, 0, 0) if v % 100 == 0 else (255, 170, 170))
            if v % 40 == 0: d.text((X + 2, 2), str(v), fill=(200, 0, 0))
        for v in range((y0 // 20 + 1) * 20, y0 + Z, 20):
            Y = (v - y0) * E; d.line([(0, Y), (Z * E, Y)], fill=(0, 0, 255) if v % 100 == 0 else (170, 170, 255))
            if v % 40 == 0: d.text((2, Y + 2), str(v), fill=(0, 0, 200))
        tiles.append(c)
    T = int(Z * E)
    out = Image.new('RGB', ((T + 12) * len(tiles), T), 'white')
    for i, t in enumerate(tiles): out.paste(t, (i * (T + 12), 0))
    out.save(sal)
