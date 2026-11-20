"""verifica.py <carpeta_lote> : copia NNN.json al banco, superpone con la captura, puntúa cada compás y prueba fases+anotaciones."""
import sys, os, json, glob, shutil
import numpy as np
from PIL import Image, ImageFilter
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/tools'); from dump import route
d=sys.argv[1]; js=[f for f in glob.glob(os.path.join(d,'[0-9][0-9][0-9].json'))][0]
J=json.load(open(js)); n=J['n']; grado='4ge' if J.get('grado')=='ge' or J.get('curso')=='4Ge' else '2gp'
dst=f'/home/claude/l57/libro/{grado}/{n:03d}.json'; os.makedirs(os.path.dirname(dst),exist_ok=True); shutil.copy(js,dst)
page='index-ge.html' if grado=='4ge' else 'index.html'
URL=f'http://localhost:8822/{page}?libro={n}&grado={grado}'
res={'n':n,'grado':grado}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg=b.new_page(viewport={'width':1900,'height':1300}); avisos=[]
    pg.on('pageerror', lambda e: avisos.append('ERR '+str(e)[:200])); pg.on('console', lambda m: avisos.append(m.text[:200]) if ('[libro]' in m.text or m.type=='error') and '404' not in m.text else None)
    pg.route('**/*', route); pg.goto(URL); pg.wait_for_timeout(2500)
    ok=pg.evaluate("()=>!!window.__LIBRO")
    if not ok: print(json.dumps({'n':n,'fallo':'no carga','avisos':avisos})); sys.exit(0)
    pg.evaluate("""()=>{ const s=document.getElementById('score'); s.style.cssText='width:1680px;max-width:none;padding:0;margin:0;border-radius:0;background:#fff'; renderCurrent(); const v=document.querySelector('#score svg'); v.style.setProperty('height','auto','important'); }""")
    pg.wait_for_timeout(600); pg.query_selector('#score svg').screenshot(path=os.path.join(d,'copia.png'))
    # fases + anotar
    pg2=b.new_page(viewport={'width':1366,'height':800}); pg2.route('**/*', route); pg2.goto(URL+'&cuenta=verif'); pg2.wait_for_timeout(2300)
    pg2.click('#studyBtn'); pg2.wait_for_timeout(800); pg2.click('.rp-cartel .pb-go'); pg2.wait_for_timeout(500)
    pg2.click('#rpAnotBar [data-t="k"]'); pg2.wait_for_timeout(200)
    bx=pg2.query_selector('#score svg').bounding_box(); x0=bx['x']+bx['width']*0.35; y0=bx['y']+bx['height']*0.25
    pg2.mouse.move(x0,y0); pg2.mouse.down(); pg2.mouse.move(x0+90,y0+25,steps=6); pg2.mouse.up(); pg2.wait_for_timeout(400)
    traz=[]
    for k in range(3):
        traz.append(pg2.evaluate("()=>{const s=RP_ANOT.get(window.__LIBRO); let n=0; if(s) Object.values(s.pages||{}).forEach(pg=>{ if(pg&&pg.strokes) n+=pg.strokes.length; else if(Array.isArray(pg)) n+=pg.length; else if(pg) n+=JSON.stringify(pg).length>20?1:0; }); return n;}"))
        if k<2:
            pg2.evaluate("(k)=>{ const st=document.querySelectorAll('#phaseSteps .rp-paso'); if(st[k+1]) st[k+1].click(); else nextPhase(); }", k); pg2.wait_for_timeout(700)
            if pg2.is_visible('.lb-fin [data-a="seguir"]'): pg2.click('.lb-fin [data-a="seguir"]'); pg2.wait_for_timeout(500)
            if pg2.is_visible('.rp-cartel .pb-go'): pg2.click('.rp-cartel .pb-go'); pg2.wait_for_timeout(600)
    pg2.screenshot(path=os.path.join(d,'fase3.png'))
    res['trazo_por_fase']=traz; res['fases']=pg2.evaluate("()=>[...document.querySelectorAll('#phaseSteps .phase-step')].map(x=>x.textContent).join('|')")
    res['notas']=pg.evaluate("()=>buildSchedule(window.__LIBRO).notes.length")
    b.close()
res['avisos']=avisos
src=Image.open(os.path.join(d,'src.png')).convert('L'); cp=Image.open(os.path.join(d,'copia.png')).convert('L').resize(src.size)
A=np.array(src)<120; B=np.array(cp)<120
def sin_lineas(M):
    M=M.copy(); filas=M.mean(axis=1)>0.35
    for y in np.where(filas)[0]: M[max(0,y-1):y+2,:]=False
    return M
from scipy import ndimage
A=sin_lineas(A); B=sin_lineas(B)
ES=np.ones((5,31),bool)   # tolerancia: 15 px en horizontal (espaciado), 2 px en vertical (altura de la nota)
Ad=ndimage.binary_dilation(A,structure=ES); Bd=ndimage.binary_dilation(B,structure=ES)
Image.merge('RGB',(cp,Image.fromarray(np.minimum(np.array(src),np.array(cp))),src)).save(os.path.join(d,'superpuesta.png'))
malos=[]
for s in J['sistemas']:
    sp=J['pagina']['interlinea']; y0=int(s['y']-sp*4); y1=int(s['y']+sp*8); xs=[s['x0']]+s['barras']
    for j,c in enumerate(s['compases']):
        a=A[y0:y1,xs[j]:xs[j+1]]; bb=B[y0:y1,xs[j]:xs[j+1]]
        fa=(a & ~Bd[y0:y1,xs[j]:xs[j+1]]).sum()/max(1,a.sum()); fb=(bb & ~Ad[y0:y1,xs[j]:xs[j+1]]).sum()/max(1,bb.sum())
        if fa>0.4 or fb>0.4: malos.append((c,round(float(fa),2),round(float(fb),2)))
res['compases_a_revisar']=malos
# láminas lado a lado por pentagrama (libro arriba, copia abajo), para revisar compás a compás
srcC=Image.open(os.path.join(d,'src.png')).convert('RGB'); cpC=Image.open(os.path.join(d,'copia.png')).convert('RGB').resize(srcC.size)
for i,s in enumerate(J['sistemas'],1):
    sp=J['pagina']['interlinea']; y0=int(max(0,s['y']-sp*6)); y1=int(min(srcC.height,s['y']+sp*10))
    for half,(x0,x1) in zip('ab',[(0,srcC.width//2+40),(srcC.width//2-40,srcC.width)]):
        a=srcC.crop((x0,y0,x1,y1)); c=cpC.crop((x0,y0,x1,y1)); Z=1.6
        a=a.resize((int(a.width*Z),int(a.height*Z))); c=c.resize((int(c.width*Z),int(c.height*Z)))
        L=Image.new('RGB',(a.width,a.height*2+12),(230,60,60)); L.paste(a,(0,0)); L.paste(c,(0,a.height+12)); L.save(os.path.join(d,f'lado-s{i:02d}-{half}.png'))
print(json.dumps(res))
