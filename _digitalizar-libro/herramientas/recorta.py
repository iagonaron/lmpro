"""recorta.py <carpeta_lote> <pagina> <arriba_px> <abajo_px> [izq_px]: re-recorta la lección desde la página completa del libro
(misma escala y mismas x que la captura vieja) con margen extra arriba/abajo. Guarda src_libro.png y imprime el desplazamiento en y."""
import sys, os, subprocess, json
import numpy as np, cv2
d, pg, top, bot = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]); izq=int(sys.argv[5]) if len(sys.argv)>5 else 0
PDF=os.environ.get('LIBRO_PDF','/mnt/user-data/uploads/MATERIALES/2GP MATERIALES/RITMO/Ritmo 6 - Tordesillas.pdf')
hi=f'/tmp/r6hi/p{pg:03d}-300.png'
if not os.path.exists(hi):
    subprocess.run(['pdftoppm','-r','300','-f',str(pg),'-l',str(pg),'-png','-singlefile',PDF,hi[:-4]],check=True)
P=cv2.imread(hi,cv2.IMREAD_GRAYSCALE); C=cv2.imread(os.path.join(d,'src.png'),cv2.IMREAD_GRAYSCALE)
best=None
for f in np.arange(1.0,1.6,0.01):   # página a escala de la captura: P/f
    Ps=cv2.resize(P,(int(P.shape[1]/f/4),int(P.shape[0]/f/4)),interpolation=cv2.INTER_AREA); Cs=cv2.resize(C,(C.shape[1]//4,C.shape[0]//4),interpolation=cv2.INTER_AREA)
    if Cs.shape[0]>Ps.shape[0] or Cs.shape[1]>Ps.shape[1]: continue
    r=cv2.matchTemplate(Ps,Cs,cv2.TM_CCOEFF_NORMED); _,mx,_,loc=cv2.minMaxLoc(r)
    if best is None or mx>best[0]: best=(mx,f,loc)
mx,f,loc=best
for f2 in np.arange(f-0.012,f+0.012,0.002):
    Ps=cv2.resize(P,(int(P.shape[1]/f2),int(P.shape[0]/f2)),interpolation=cv2.INTER_AREA)
    x0=max(0,loc[0]*4-40); y0=max(0,loc[1]*4-40); sub=Ps[y0:y0+C.shape[0]+80, x0:x0+C.shape[1]+80]
    if sub.shape[0]<C.shape[0] or sub.shape[1]<C.shape[1]: continue
    r=cv2.matchTemplate(sub,C,cv2.TM_CCOEFF_NORMED); _,m2,_,l2=cv2.minMaxLoc(r)
    if m2>best[0]: best=(m2,f2,(x0+l2[0],y0+l2[1]),True)
mx,f=best[0],best[1]; ox,oy=best[2] if len(best)>3 else (loc[0]*4,loc[1]*4)
Ps=cv2.resize(P,(int(P.shape[1]/f),int(P.shape[0]/f)),interpolation=cv2.INTER_AREA)
def hueco(y, paso, lim):   # busca, desde y, la primera franja en blanco de 30 filas (máx. lim píxeles)
    filas=0
    for k in range(lim):
        yy=y+paso*k
        if yy<0 or yy>=Ps.shape[0]: return yy-paso
        fila=Ps[yy, ox:ox+C.shape[1]]
        if (fila<120).sum()<6: filas+=1
        else: filas=0
        if filas>=70: return yy-paso*50
    return y+paso*lim
y0=max(0,oy-top) if top>=0 else max(0,hueco(oy,-1,-top))
y1=min(Ps.shape[0],oy+C.shape[0]+bot) if bot>=0 else min(Ps.shape[0],hueco(oy+C.shape[0]-1,1,-bot))
x0=max(0,ox-izq)
N=Ps[y0:y1, x0:ox+C.shape[1]]
cv2.imwrite(os.path.join(d,'src_libro.png'),N)
print(json.dumps({'parecido':round(float(mx),3),'escala':round(float(f),4),'dy':oy-y0,'dx':ox-x0,'tam':[int(N.shape[1]),int(N.shape[0])]}))
