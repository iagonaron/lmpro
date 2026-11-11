#!/usr/bin/env python3
# recorta.py — (11-nov-2026) recortes «sistema a sistema» de un dictado de 2.º GP.
# Uso: python3 recorta.py FOTO SOLUCION 'ESQUINAS_JSON' SALIDA_DIR
#   ESQUINAS_JSON = [[[x,y],[x,y],[x,y],[x,y]], ...] un cuadrilátero por sistema, en px de la foto ORIGINAL:
#   arriba-izq = inicio de la 1.ª línea (la de arriba) del pentagrama de clave de sol
#   arriba-dcha = final de esa línea en la última barra del sistema
#   abajo-dcha = final de la 5.ª línea (la de abajo) del pentagrama de clave de fa
#   abajo-izq = inicio de esa línea
# Escribe en SALIDA_DIR: sol-1.png, sol-2.png…, alu-1.jpg, alu-2.jpg…, vista.png (intercalado, para revisar) y control.json
import sys, json, os
import cv2, numpy as np
PAD = 70
def sistemas_solucion(sol):
    h, w = sol.shape
    filas = (sol < 200).sum(1) > 3
    tramos = []; st = None
    for y in range(h + 1):
        v = filas[y] if y < h else False
        if v and st is None: st = y
        if not v and st is not None:
            tramos.append([st, y]); st = None
    # unir tramos separados por menos de 40 px (los dos pentagramas de un sistema van juntos)
    uni = []
    for t in tramos:
        if uni and t[0] - uni[-1][1] < 40: uni[-1][1] = t[1]
        else: uni.append(t)
    uni = [t for t in uni if t[1] - t[0] > 120]
    # cortar por la mitad de los huecos
    cortes = [0] + [(uni[i][1] + uni[i + 1][0]) // 2 for i in range(len(uni) - 1)] + [h]
    return [(cortes[i], cortes[i + 1]) for i in range(len(uni))]
def pauta(g):
    d = (g < 235).mean(1)
    rows = [i for i, v in enumerate(d) if v > 0.3]
    if len(rows) < 8: return None
    t, b = rows[0], rows[-1]
    xs = np.where(g[t] < 235)[0]
    return t, b, int(xs[0]), int(xs[-1])
def limpia(g):
    bg = cv2.GaussianBlur(g, (0, 0), 25); n = cv2.divide(g, bg, scale=255)
    lo, hi = np.percentile(n, 1), np.percentile(n, 60)
    n = np.clip((n.astype(float) - lo) * 255 / (hi - lo + 1e-6), 0, 255)
    n = (255 * ((n / 255.0) ** 1.8)).astype(np.uint8)
    n[n > 215] = 255
    return n
def control(a, t, b, w):
    # ¿hay líneas de pentagrama donde tienen que estar? (arriba y abajo, a la izquierda y a la derecha)
    res = {}
    for nom, x0, x1 in (('izq', .08, .18), ('dcha', .82, .92)):
        d = (a[:, int(w * x0):int(w * x1)] < 150).mean(1)
        def cerca(y):
            y = int(round(y)); v = d[max(0, y - 6):y + 7]
            return float(v.max()) if len(v) else 0.0
        res[nom] = [round(cerca(t), 2), round(cerca(b), 2)]
    res['ok'] = all(min(v) > 0.45 for v in (res['izq'], res['dcha']))
    return res
def main():
    foto, solp, esq, out = sys.argv[1], sys.argv[2], json.loads(sys.argv[3]), sys.argv[4]
    os.makedirs(out, exist_ok=True)
    im = cv2.imread(foto, cv2.IMREAD_GRAYSCALE)
    sol = cv2.imread(solp, cv2.IMREAD_GRAYSCALE)
    if im is None or sol is None: print(json.dumps({'error': 'no se pudo leer la foto o la solución'})); sys.exit(2)
    sol = cv2.copyMakeBorder(sol, 0, 0, PAD, PAD, cv2.BORDER_CONSTANT, value=255)
    W = sol.shape[1]
    sis = sistemas_solucion(sol)
    rep = {'sistemas_solucion': len(sis), 'sistemas_marcados': len(esq), 'control': []}
    if len(sis) != len(esq):
        rep['error'] = 'la solución tiene %d sistemas y se han marcado %d' % (len(sis), len(esq))
        print(json.dumps(rep)); sys.exit(3)
    vista = []
    for k, ((y0, y1), q) in enumerate(zip(sis, esq)):
        S = sol[y0:y1]; p = pauta(S)
        if not p: rep['error'] = 'no encuentro el pentagrama de la solución %d' % (k + 1); print(json.dumps(rep)); sys.exit(4)
        t, b, x0, x1 = p
        h = S.shape[0]
        M = cv2.getPerspectiveTransform(np.float32(q), np.float32([(x0, t), (x1, t), (x1, b), (x0, b)]))
        a = limpia(cv2.warpPerspective(im, M, (W, h), flags=cv2.INTER_CUBIC, borderValue=255))
        rep['control'].append(control(a, t, b, W))
        cv2.imwrite(os.path.join(out, 'sol-%d.png' % (k + 1)), S)
        cv2.imwrite(os.path.join(out, 'alu-%d.jpg' % (k + 1)), a, [cv2.IMWRITE_JPEG_QUALITY, 82])
        vista += [S, np.full((8, W), 255, np.uint8), a, np.full((40, W), 160, np.uint8)]
    cv2.imwrite(os.path.join(out, 'vista.png'), cv2.resize(np.vstack(vista[:-1]), None, fx=.5, fy=.5, interpolation=cv2.INTER_AREA))
    rep['ok'] = all(c['ok'] for c in rep['control'])
    json.dump(rep, open(os.path.join(out, 'control.json'), 'w'))
    print(json.dumps(rep))
main()
