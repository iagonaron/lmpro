"""mxcheck.py <NNN>…: compara las notas de lotes/4ge-NNN/NNN.json con el MusicXML del libro (alturas y figuras, compás a compás)."""
import sys, json, re, glob, xml.etree.ElementTree as ET
MX='/mnt/user-data/uploads/MATERIALES/4GE MATERIALES/RITMO/RITMO 4 XLM´s/Lección %d.musicxml'
PC={'c':0,'d':2,'e':4,'f':5,'g':7,'a':9,'b':11}
TYPE={'whole':'1','half':'2','quarter':'4','eighth':'8','16th':'16','32nd':'32'}
def mx_notes(n):
    t=ET.parse(MX%n).getroot(); part=t.find('part'); out=[]
    for m in part.findall('measure'):
        seq=[]
        for no in m.findall('note'):
            if no.find('chord') is not None or no.find('grace') is not None: continue
            ty=no.find('type'); d=TYPE.get(ty.text if ty is not None else '', '?')+'.'*len(no.findall('dot'))
            if no.find('rest') is not None: seq.append(('r',d)); continue
            p=no.find('pitch'); st=p.find('step').text.lower(); alt=int(float(p.find('alter').text)) if p.find('alter') is not None else 0; oc=int(p.find('octave').text)
            seq.append((12*(oc+1)+PC[st]+alt,d))
        out.append((m.get('number'),seq))
    return [x for x in out if x[1]]
def js_notes(n):
    J=json.load(open(glob.glob('/home/claude/lotes/4ge-%03d/%03d.json'%(n,n))[0])); out=[]
    for c in J['compases']:
        seq=[]
        for tk in re.findall(r'(\d+\.*):([a-g][#b]*\d|r)',c['m']):
            d,p=tk
            if p=='r': seq.append(('r',d)); continue
            mm=re.match(r'([a-g])([#b]*)(\d)',p); acc=mm.group(2).count('#')-mm.group(2).count('b')
            seq.append((12*(int(mm.group(3))+1)+PC[mm.group(1)]+acc,d))
        out.append((c['c'],seq))
    return out
for a in sys.argv[1:]:
    n=int(a); X=mx_notes(n); Jn=js_notes(n)
    fx=[e for _,s in X for e in s]; fj=[e for _,s in Jn for e in s]
    dif=[]
    import difflib
    sm=difflib.SequenceMatcher(a=fx,b=fj,autojunk=False)
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op!='equal': dif.append((op,fx[i1:i2][:6],fj[j1:j2][:6],j1))
    # posición -> compás del JSON
    pos=[]; [pos.extend([c]*len(s)) for c,s in Jn]
    print('%03d'%n, 'notas mx',len(fx),'json',len(fj),'diferencias',len(dif))
    for op,a1,b1,j in dif[:12]: print('   ',op,'compás',pos[j] if j<len(pos) else '?','libro',a1,'copia',b1)
