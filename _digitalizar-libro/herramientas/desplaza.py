"""desplaza.py <carpeta> <dy>: usa src_libro.png como nueva captura (lección completa del libro) y desplaza en y lo medido."""
import sys, os, json, shutil
from PIL import Image
d, dy = sys.argv[1], int(sys.argv[2]); n=os.path.basename(d).split('-')[1]; g=os.path.basename(d).split('-')[0]
if not os.path.exists(os.path.join(d,'src_captura.png')): shutil.copy(os.path.join(d,'src.png'), os.path.join(d,'src_captura.png'))
shutil.copy(os.path.join(d,'src_libro.png'), os.path.join(d,'src.png'))
W,H=Image.open(os.path.join(d,'src.png')).size
p=os.path.join(d,n+'.json'); J=json.load(open(p))
for s in J['sistemas']: s['y']=s['y']+dy
if 'titulo_estilo' in J and 'y' in J['titulo_estilo']: J['titulo_estilo']['y']+=dy
for nb in J.get('notas_libro',[]):
    for li in nb.get('lineas',[]):
        if 'y' in li: li['y']+=dy
    if nb.get('flecha'): f=nb['flecha']; nb['flecha']=[f[0],f[1]+dy,f[2],f[3]+dy]
    for r in nb.get('ritmos',[]):
        r['y']+=dy
        if 'yb' in r: r['yb']+=dy
    nb['rayas']=[[r[0],r[1],r[2]+dy] for r in nb.get('rayas',[])]
    if not nb['rayas']: nb.pop('rayas')
J['pagina']['alto']=H; J['pagina']['ancho']=W
J['captura']='libro/capturas/'+g+'/'+n+'.png'
json.dump(J,open(p,'w'),ensure_ascii=False,indent=1); print('ok',n,W,H)
