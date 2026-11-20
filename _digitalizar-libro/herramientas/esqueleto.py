"""Uso: esqueleto.py <png> <carpeta_salida>
Detecta sistemas (pentagramas) y barras de compás; guarda esqueleto.json, recortes por compás (×2) y debug.png."""
import sys, json, os
import numpy as np
from PIL import Image, ImageDraw
png, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
im = Image.open(png).convert('L'); a = np.array(im) < 120; H, W = a.shape
rowfrac = a.mean(axis=1)
TH=float(sys.argv[3]) if len(sys.argv)>3 else 0.45
cand = np.where(rowfrac > TH)[0]
# agrupar filas contiguas en líneas
lines = []
for y in cand:
    if lines and y - lines[-1][-1] <= 2: lines[-1].append(y)
    else: lines.append([y])
lc = [int(np.mean(l)) for l in lines]
# agrupar líneas en pentagramas de 5 con separación regular
sis = []; i = 0
while i + 4 < len(lc):
    g = lc[i:i+5]; d = np.diff(g)
    if d.min() > 6 and d.max() - d.min() <= 4 and d.mean() < 30:
        sis.append(g); i += 5
    else: i += 1
res = {'ancho': W, 'alto': H, 'sistemas': []}
dbg = Image.open(png).convert('RGB'); dr = ImageDraw.Draw(dbg)
for g in sis:
    top, bot = g[0], g[-1]; sp = (bot - top) / 4
    col = a[top:bot+1].mean(axis=0)
    xs = np.where(col > 0.80)[0]
    cl = []
    for x in xs:
        if cl and x - cl[-1][-1] <= 3: cl[-1].append(x)
        else: cl.append([x])
    barras = []
    for c in cl:
        x0, x1 = c[0], c[-1]
        if x1 - x0 > 14: continue
        # una barra no sobresale del pentagrama (las plicas sí): mirar 5–10 px por fuera, columna a columna
        def fuera(y0, y1): 
            y0, y1 = max(0, y0), min(H, y1)
            if y1 <= y0: return 0
            return a[y0:y1, x0:x1+1].any(axis=1).mean()
        if fuera(top - 11, top - 4) > 0.6 or fuera(bot + 4, bot + 11) > 0.6: continue
        barras.append(int((x0 + x1) / 2))
    # inicio del pentagrama: primera columna con las 5 líneas
    filas = np.array([a[max(0,y-1):y+2, :].any(axis=0) for y in g]); todas = filas.all(axis=0); inicio = None
    for x in range(W - 60):
        if todas[x:x+60].mean() > 0.9: inicio = x; break
    # quitar la barra inicial pegada al inicio
    barras = [b for b in barras if b - (inicio or 0) > 30]
    res['sistemas'].append({'y': int(top), 'interlinea': round(float(sp), 2), 'x0': int(inicio or 0), 'barras': barras})
    for y in g: dr.line([(0, y), (W, y)], fill=(255, 0, 0), width=1)
    for b in barras: dr.line([(b, top - 20), (b, bot + 20)], fill=(0, 0, 255), width=3)
    dr.line([(inicio, top - 20), (inicio, bot + 20)], fill=(0, 160, 0), width=3)
dbg.save(os.path.join(out, 'debug.png'))
# recortes por compás
src = Image.open(png); k = 1
for s in res['sistemas']:
    xs = [s['x0']] + s['barras']; sp = s['interlinea']
    y0 = int(max(0, s['y'] - sp * 5)); y1 = int(min(H, s['y'] + sp * 9))
    s['compases'] = []
    for j in range(len(xs) - 1):
        x0 = max(0, xs[j] - 20); x1 = min(W, xs[j+1] + 20)
        src.crop((x0, y0, x1, y1)).resize(((x1 - x0) * 2, (y1 - y0) * 2), Image.LANCZOS).save(os.path.join(out, f'm{k:02d}.png'))
        s['compases'].append(k); k += 1
json.dump(res, open(os.path.join(out, 'esqueleto.json'), 'w'), indent=1)
print(json.dumps({'sistemas': [(s['y'], s['interlinea'], s['x0'], s['barras']) for s in res['sistemas']], 'compases': k - 1}))
