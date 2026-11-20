/* =====================================================================================
   LECCIONES DEL LIBRO EN DIGITAL · Ritmo entonado PRO (20-nov-2026, Iago · piloto: lección 57 de 2.º GP)
   -------------------------------------------------------------------------------------
   Abre una lección del libro (ya transcrita en libro/2gp/NNN.json) con el MOTOR de Ritmo entonado:
   mismas fases, audio, acompañamiento y anotación que una lección generada. Solo cambia el DIBUJO:
   se pinta como en el libro (misma disposición, «57» de título, números de compás, ligaduras, nota
   del libro) sobre papel blanco, en las mismas coordenadas que la captura (1680 × 1055).

   Uso: index.html?libro=57   (opcional &grado=2gp, por defecto 2gp)
   No toca nada si la dirección no lleva ?libro=. Para quitarlo: borrar la línea <script src="libro/libro.js">.
   ===================================================================================== */
(function(){
  'use strict';
  var qs = new URLSearchParams(location.search);
  var NUM = qs.get('libro');
  if(!NUM || !/^\d{1,3}[ab]?$/i.test(NUM)) return;
  var GRADO = (qs.get('grado')||'2gp').toLowerCase().replace(/[^a-z0-9]/g,'');
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/libro\.js(\?.*)?$/,'') : 'libro/';
  var FICHERO = BASE + GRADO + '/' + ('00'+NUM).slice(-3).toLowerCase() + '.json';

  /* ---------------- fuentes del libro (solo cifras: título y números de compás) ---------------- */
  try{
    var st=document.createElement('style');
    st.textContent =
      "@font-face{font-family:'LibroCifras';src:url('"+BASE+"fuentes/schola-bold-cifras.woff') format('woff');font-weight:700}"+
      "@font-face{font-family:'LibroCompas';src:url('"+BASE+"fuentes/termes-italic-cifras.woff') format('woff');font-style:italic}"+
      "#score.libro-papel{background:#fff;border-radius:6px;padding:10px 6px}"+
      "#score.libro-papel svg{max-width:100%!important}"+
      ".libro-orig-btn{position:fixed;right:14px;bottom:14px;z-index:99990;width:38px;height:38px;border-radius:9px;border:1px solid rgba(255,255,255,.28);background:rgba(10,16,30,.72);color:#e9edf5;font:600 12px 'Helvetica Neue',Arial,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center}"+
      ".libro-orig-btn:hover::after{content:attr(data-tip);position:absolute;right:46px;white-space:nowrap;background:rgba(10,16,30,.9);padding:6px 9px;border-radius:7px}"+
      ".libro-orig{position:fixed;inset:0;z-index:99995;background:rgba(6,9,18,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px}"+
      ".libro-orig img{max-width:96vw;max-height:84vh;background:#fff;border-radius:8px}"+
      "body.libro-modo #rpReloj{display:none!important}"+
      "body.libro-modo footer{display:none!important}"+
      "body.libro-ge .anot-pt{display:none!important}"+
      "body.libro-modo .libro-recuerda{display:block}"+
      "body.libro-modo:not(.rp-estudio) #score.libro-papel svg{height:calc(100vh - 250px)!important;min-height:300px;width:100%!important}"+
      ".libro-recuerda{margin:12px 0 0;padding:10px 12px;border:1px solid rgba(110,231,160,.55);border-radius:10px;background:rgba(22,163,74,.14);font-size:.95em;line-height:1.4;text-align:left}"+
      ".libro-recuerda b{color:#6ee7a0}"+
      ".libro-orig button{margin-top:14px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#e9edf5;border-radius:9px;padding:9px 18px;font:700 13px 'Helvetica Neue',Arial;cursor:pointer}";
    document.head.appendChild(st);
  }catch(e){}

  /* ---------------- 1. leer la transcripción y montar la lección con el formato del motor ---------------- */
  var NOMBRE_NOTA={c:0,d:2,e:4,f:5,g:7,a:9,b:11};
  function midiDe(p){ var m=/^([a-g])(#{1,2}|b{1,2}|n)?(-?\d)$/.exec(p); if(!m) throw new Error('altura '+p);
    var alt=m[2]==='#'?1:m[2]==='##'?2:m[2]==='b'?-1:m[2]==='bb'?-2:0; return 12*(+m[3]+1)+NOMBRE_NOTA[m[1]]+alt; }
  function keyDe(p){ var m=/^([a-g])(#{1,2}|b{1,2}|n)?(-?\d)$/.exec(p); return m[1]+(m[2]&&m[2]!=='n'?m[2]:'')+'/'+m[3]; }
  function durDe(f){ var dot=/\.$/.test(f); var b=f.replace('.',''); var mapa={'1':'w','2':'h','4':'q','8':'8','16':'16','32':'32'}; return mapa[b]+(dot?'d':''); }
  function dur16(f){ var dot=/\.$/.test(f); var b=+f.replace('.',''); var d=16/b; return dot?d*1.5:d; }
  function compasDe(txt){ /* «2/4+1/4» → time 9/16, fracSig ['2/4','+¼'] · «3/4» → 3/4 · «libre» → sin compás */
    if(txt==='libre') return {libre:true, time:'4/4', num:'', den:'', extra:null};
    var m=/^(\d+)\/(\d+)(?:([+\-])(\d+)\/(\d+))?$/.exec(txt); if(!m) throw new Error('compás '+txt);
    var n=+m[1], d=+m[2]; if(!m[3]) return {time:n+'/'+d, num:String(n), den:String(d), extra:null};
    var en=+m[4], ed=+m[5]; /* fracción de la unidad: (n ± en/ed)/d */
    var tot=(n*ed+(m[3]==='+'?1:-1)*en), den=d*ed; /* en dieciseisavos si d=4, ed=4 */
    var VULG={'1/4':'¼','3/4':'¾','1/2':'½','1/3':'⅓','2/3':'⅔','1/8':'⅛','3/8':'⅜'};
    return {time:tot+'/'+den, num:String(n), den:String(d), extra:(m[3]==='+'?'+':'−')+en+'/'+ed,
            fracSig:[n+'/'+d,(m[3]==='+'?'+':'−')+(VULG[en+'/'+ed]||(en+'/'+ed))]};
  }
  function parseLigadura(s){ var m=/^(\d+)\.(\d+)-(\d+)\.(\d+)\s+(arriba|abajo)$/.exec(s.trim()); if(!m) throw new Error('ligadura '+s);
    return {c1:+m[1],n1:+m[2]-1,c2:+m[3],n2:+m[4]-1,arriba:m[5]==='arriba'}; }

  try{ if(typeof groupRealBeats==='function' && !groupRealBeats._libro){ var _grb=groupRealBeats; window.groupRealBeats=function(g){ return (g&&g._real)?g._real.slice():_grb(g); }; window.groupRealBeats._libro=1; } }catch(e){}
  function montaLeccion(J){
    var compasAct=null; var porCompas={};
    J._tres=(J.tresillos||[]).map(function(t){ var s0=(typeof t==='string')?t:t.notas; var r=(typeof t==='string')?'3:2':(t.r||'3:2');
      var m=/^(\d+)\.(\d+)-(\d+)\.(\d+)$/.exec(String(s0).trim()); var rr=/^(\d+):(\d+)$/.exec(r); if(!m||!rr) return null;
      return {c:+m[1], n1:+m[2]-1, n2:+m[4]-1, num:+rr[1], den:+rr[2], cifra:(typeof t==='string'||t.cifra!==false)?(rr[1]+(r==='3:2'?'':':'+rr[2])):null}; }).filter(Boolean);
    J._uni=(J.uniones||[]).map(function(t){ var m=/^(\d+)\.(\d+)-(\d+)\.(\d+)(?:\s+(arriba|abajo))?$/.exec(String(t).trim()); return m?{c1:+m[1],n1:+m[2]-1,c2:+m[3],n2:+m[4]-1,arriba:m[5]==='arriba',abajo:m[5]==='abajo'}:null; }).filter(Boolean);
    var medidas=J.compases.map(function(c){
      if(c.compas) compasAct=compasDe(c.compas);
      var notes=[], beams=[], stems=[]; var total16=0;
      c.m.split('|').forEach(function(g){
        var tk=g.trim().split(/\s+/); var stem=0;
        if(tk[0]==='^'){ stem=1; tk.shift(); } else if(tk[0]==='v'){ stem=-1; tk.shift(); }
        var idx=[];
        tk.forEach(function(t){ var p=t.split(':'); var esSil=/^r/.test(p[1]); var suf=(/[-!>~]+$/.exec(p[1])||[''])[0]; if(suf) p[1]=p[1].slice(0,-suf.length);
          var n={dur:durDe(p[0])}; if(esSil){ n.rest=true; } else { n.midi=midiDe(p[1]); n.key=keyDe(p[1]); }
          if(suf){ n._art=suf; if(suf.indexOf('-')>=0) n._ten=true; }
          idx.push(notes.length); notes.push(n); stems.push(stem); total16+=dur16(p[0]); });
        if(idx.length>1) beams.push(idx);
      });
      /* valoraciones especiales: lo que dura de verdad cada nota del grupo */
      var tres=(J._tres||[]).filter(function(t){ return t.c===c.c; }), realDe={};
      tres.forEach(function(t){ for(var q=t.n1;q<=t.n2;q++){ if(notes[q]){ var d16=dur16(notes[q].dur); realDe[q]=d16*t.den/t.num; total16+=realDe[q]-d16; } } });
      total16=Math.round(total16*1e6)/1e6;
      var cap16 = (function(){ var t=compasAct.time.split('/'); return (+t[0])*16/(+t[1]); })();
      var incompleto=!!(c.anacrusa||c.incompleto||compasAct.libre);   /* anacrusa / último compás que la completa: dura lo que suman sus figuras */
      if(!incompleto && Math.abs(cap16-total16)>1e-6) console.warn('[libro] compás '+c.c+': suma '+total16+' semicorcheas, el compás pide '+cap16);
      var tIncompleto=(function(){ var n=Math.round(total16*2), d=32; while(n%2===0&&d>4){ n/=2; d/=2; } return n+'/'+d; })();
      var m={time:incompleto?tIncompleto:compasAct.time, notes:notes, beams:beams, cap:(incompleto?total16:cap16)/4};
      if(compasAct.fracSig && !incompleto) m.fracSig=compasAct.fracSig.slice();
      m._libro={c:c.c, stems:stems, compas:compasAct, cambia:!!c.compas && !compasAct.libre, aire:(c.aire!=null?+c.aire:null), sinBarra:!!c.sin_barra, barraIni:c.barra_ini||null, barraFin:c.barra_fin||null};
      /* tresillos y otros grupos (5:6…): una sola valoración especial por compás para el motor (misma proporción) */
      if(tres.length){ var idx=[], wr=[], re=[], occ=0; m.tuplets=[];
        tres.forEach(function(t){ var ii=[]; for(var q=t.n1;q<=t.n2;q++){ if(!notes[q]) continue; ii.push(q); idx.push(q); wr.push(notes[q].dur); re.push(realDe[q]/4); occ+=realDe[q]/4; }
          m.tuplets.push({idx:ii, group:{ratioNum:t.num, ratioDen:t.den}}); });
        m.groupInfo={idx:idx, written:wr, occ:occ, ratioNum:tres[0].num, ratioDen:tres[0].den, label:'grupo', gid:'libro', _real:re}; }
      /* ligaduras de unión dentro del compás: la segunda no se vuelve a atacar */
      (J._uni||[]).forEach(function(u){ if(u.c1===c.c && u.c2===c.c && notes[u.n1] && notes[u.n2]){ notes[u.n2].tieFrom=u.n1; } });
      porCompas[c.c]=m; return m;
    });
    var phrases=J.sistemas.map(function(s){
      var ms=s.compases.map(function(k){ return porCompas[k]; });
      return {clef:s.clave||J.clave||'treble', keysig:J.armadura, time:ms[0].time, measures:ms, nMeasures:ms.length, valid:true, dense:false};
    });
    /* tónica: en mayor, la de la armadura (G → g); en menor, su relativa (C → a, G → e, F → d…) */
    var MAYOR={'C':'c','G':'g','D':'d','A':'a','E':'e','B':'b','F#':'f#','Db':'c#','F':'f','Bb':'bb','Eb':'eb','Ab':'ab'};
    var MENOR={'C':'a','G':'e','D':'b','A':'f#','E':'c#','B':'ab','F':'d','Bb':'g','Eb':'c','Ab':'f','Db':'bb','F#':'eb'};
    var esMenor=(J.modo==='menor');
    var tonic=(esMenor?MENOR:MAYOR)[J.armadura||'C']||'c';
    var L={trimKey:'gp1', worldId:'m1', cards:['c1_9'], keysig:J.armadura, tonic:tonic, modo:esMenor?'menor_armonica':'mayor', phrases:phrases,
           timeA:phrases[0].time, timeB:phrases[phrases.length-1].time, switchIdx:phrases.length, gp1:true,
           simpleSlow5:false, mixSlow:false, fusaN:false, conjunctM4:false, noMeter:false, roles:null, combine:false,
           valid:true, libro:J};
    L._lig=(J.ligaduras||[]).map(parseLigadura);
    L._cor=(J.corchetes||[]).map(function(t){ var m=/^(\d+)\.(\d+)-(\d+)\.(\d+)$/.exec(t.trim()); return m?{c1:+m[1],n1:+m[2]-1,c2:+m[3],n2:+m[4]-1}:null; }).filter(Boolean);
    try{ armoniza(L); }catch(e){ console.warn('[libro] armonía',e); }
    return L;
  }

  /* ---------------- 2. ARMONÍA para el acompañamiento («acordes del motor») ----------------
     Por pulso: acordes diatónicos que contienen la nota que cae en el pulso (como exige el motor) y,
     entre ellos, el camino más lógico (programación dinámica): progresiones tonales, el acorde se
     mantiene si sirve en el pulso siguiente, dominante → tónica al final y en los finales de línea. */
  var GRADOS=['I','ii','iii','IV','V','vi'];
  var TRANS={ I:{I:0,ii:1.2,iii:2.2,IV:0.6,V:0.6,vi:1.0},
              ii:{I:2.5,ii:0,iii:3,IV:2,V:0.4,vi:2.5},
              iii:{I:2,ii:2,iii:0,IV:0.9,V:2,vi:0.8},
              IV:{I:0.9,ii:1.2,iii:3,IV:0,V:0.5,vi:2},
              V:{I:0.3,ii:3,iii:2.5,IV:2.2,V:0,vi:1.0},
              vi:{I:1.6,ii:0.6,iii:2.5,IV:0.7,V:1.4,vi:0} };
  function armoniza(L){
    var pcsDe=function(r){ return triadPCs(L,r); };
    L.phrases.forEach(function(ph,pi){
      var pulsos=[];
      ph.measures.forEach(function(m,mi){
        var pons=pulseOnsetsQ(m), cap=meterCapQ(m.time), durs=measureNoteBeats(m);
        var ons=[], o=0; m.notes.forEach(function(n,k){ ons.push({on:o,d:durs[k],pc:n.rest?null:((n.midi%12)+12)%12}); o+=durs[k]; });
        pons.forEach(function(q0,k){ var q1=k+1<pons.length?pons[k+1]:cap;
          var dentro=ons.filter(function(x){ return x.on<q1-1e-9 && x.on+x.d>q0+1e-9 && x.pc!=null; });
          var prim=null; for(var z=ons.length-1;z>=0;z--){ if(ons[z].on<=q0+1e-9 && ons[z].pc!=null){ prim=ons[z]; break; } }
          pulsos.push({mi:mi,q0:q0,q1:q1,prim:prim?prim.pc:null,dentro:dentro.map(function(x){ return {pc:x.pc,d:Math.min(x.on+x.d,q1)-Math.max(x.on,q0)}; })});
        });
      });
      var ultimaFrase=(pi===L.phrases.length-1);
      var N=pulsos.length, coste=[], de=[];
      for(var i=0;i<N;i++){ coste.push({}); de.push({});
        GRADOS.forEach(function(r){ var pcs=pcsDe(r), p=pulsos[i];
          if(p.prim!=null && pcs.indexOf(p.prim)<0){ coste[i][r]=Infinity; return; }
          var tot=0,dentro=0; p.dentro.forEach(function(x){ tot+=x.d; if(pcs.indexOf(x.pc)>=0) dentro+=x.d; });
          var c=(tot?(1-dentro/tot)*2.2:0) + ({I:0,IV:0.15,V:0.15,vi:0.35,ii:0.35,iii:0.8})[r];
          if(i===0 && pi===0 && r!=='I') c+=3;               /* empieza en tónica */
          if(i===N-1){ if(ultimaFrase){ if(r!=='I') c+=6; } else if(r!=='V' && r!=='I') c+=1.2; }
          if(i===N-2 && ultimaFrase && r!=='V') c+=1.5;      /* cadencia perfecta al final */
          if(i===0){ coste[i][r]=c; return; }
          var mejor=Infinity, arg=null;
          GRADOS.forEach(function(r0){ var v=coste[i-1][r0]; if(!isFinite(v)) return;
            var t=TRANS[r0][r]; if(pulsos[i].q0>0 && r0!==r) t+=0.25;   /* cambio en pulso débil: un poco menos natural */
            if(v+t<mejor){ mejor=v+t; arg=r0; } });
          coste[i][r]=c+mejor; de[i][r]=arg; });
      }
      var fin=null, best=Infinity; GRADOS.forEach(function(r){ if(coste[N-1][r]<best){ best=coste[N-1][r]; fin=r; } });
      if(fin==null){ ph.spans=[]; ph.harmony=[]; return; }
      var cam=[fin]; for(var j=N-1;j>0;j--){ cam.unshift(de[j][cam[0]]||cam[0]); }
      var spans=[]; cam.forEach(function(r,i){ var p=pulsos[i];
        var sev = (r==='V') && p.dentro.some(function(x){ return x.pc===pcsDe('IV')[0]; }); /* la 7.ª (4.º grado) suena en el pulso */
        var prev=spans[spans.length-1];
        if(prev && prev.mi===p.mi && prev.roman===r && prev.seventh===sev){ prev.q1=p.q1; return; }
        spans.push({mi:p.mi,q0:p.q0,q1:p.q1,roman:r,seventh:sev}); });
      ph.spans=spans; ph.harmony=spans.map(function(s){ return s.roman; });
      ph.cadence = ultimaFrase ? 'autentica' : (cam[N-1]==='V'?'semicadencia':'reposo');
    });
  }

  /* ---------------- 3. DIBUJO COMO EL LIBRO ---------------- */
  function dibujaLibro(container, L){
    var J=L.libro, P=J.pagina, S=P.interlinea/10;            /* 1 unidad VexFlow = S píxeles del libro */
    var U=function(px){ return px/S; };
    container.innerHTML=''; container.classList.add('libro-papel');
    XHEAD_POS=[]; BARLINE_POS=[];
    var r=new VF.Renderer(container,VF.Renderer.Backends.SVG); r.resize(U(P.ancho),U(P.alto)); var ctx=r.getContext();
    var TINTA='#111';
    ctx.setFillStyle(TINTA); ctx.setStrokeStyle(TINTA);
    var vfDe={};   /* «c.n» → StaveNote, para las ligaduras */
    var estaves={};
    J.sistemas.forEach(function(sis,si){
      var ph=L.phrases[si]; var yTop=U(sis.y)-40;   /* línea superior del pentagrama a sis.y */
      var xs=[sis.x0].concat(sis.barras);
      sis.compases.forEach(function(k,j){
        var m=ph.measures[j], lb=m._libro;
        var x=U(xs[j]), w=U(xs[j+1]-xs[j]);
        var stave=new VF.Stave(x,yTop,w,{left_bar:j===0});
        if(j===0){ stave.addClef(ph.clef).addKeySignature(ph.keysig); }
        var conCifra = lb.cambia;
        if(conCifra) stave.addTimeSignature(lb.compas.num+'/'+lb.compas.den);
        if(lb.sinBarra) stave.setEndBarType(VF.Barline.type.NONE);
        if(lb.barraIni==='repeticion') stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
        if(lb.barraFin==='repeticion') stave.setEndBarType(VF.Barline.type.REPEAT_END);
        if(lb.barraFin==='doble') stave.setEndBarType(VF.Barline.type.DOUBLE);
        if(j>0 && ph.measures[j-1]._libro.sinBarra) stave.setBegBarType(VF.Barline.type.NONE);
        if(j===sis.compases.length-1){
          if(sis.final==='doble') stave.setEndBarType(VF.Barline.type.DOUBLE);
          if(sis.final==='fin') stave.setEndBarType(VF.Barline.type.END);
        }
        if(conCifra && lb.compas.extra){ try{ stave.setNoteStartX(stave.getNoteStartX()+U(30)); }catch(e){} }
        stave.setContext(ctx).draw();
        estaves[lb.c]=stave;
        if(conCifra && lb.compas.extra){ var bc=bordeCifra(stave); fraccionCompas(ctx, bc!=null?bc:stave.getNoteStartX()-U(42), stave.getYForLine(0), lb.compas.extra, S); }
        try{ BARLINE_POS.push({x:stave.getX(), yTop:stave.getYForLine(0)-8, yBot:stave.getYForLine(4)+8}); }catch(e){ BARLINE_POS.push({x:x,yTop:yTop,yBot:yTop+80}); }
        /* notas */
        var acc={};
        var vf=m.notes.map(function(n,ni){
          var sd=lb.stems[ni];
          if(n.rest){ var rr=new VF.StaveNote({clef:ph.clef,keys:[ph.clef==='bass'?'d/3':'b/4'],duration:durBase(n.dur)+'r'}); for(var dr=0;dr<durDots(n.dur);dr++) VF.Dot.buildAndAttach([rr]);
            if(n._art && n._art.indexOf('~')>=0){ try{ var fr=new VF.Articulation('a@a'); fr.setPosition(VF.ModifierPosition.ABOVE); rr.addModifier(fr,0); }catch(e){} }
            vfDe[lb.c+'.'+ni]=rr; return rr; }
          var x2 = (typeof RHYTHM_XHEADS!=='undefined' && RHYTHM_XHEADS);
          var sn=new VF.StaveNote({clef:ph.clef,keys:[x2?(n.key+'/x2'):n.key],duration:durBase(n.dur),stem_direction:sd||1,auto_stem:!sd});
          for(var di=0;di<durDots(n.dur);di++) VF.Dot.buildAndAttach([sn]);
          if(n._art){ var pos=(sd||1)===1?VF.ModifierPosition.BELOW:VF.ModifierPosition.ABOVE;
            [['-','a-'],['!','a.'],['>','a>']].forEach(function(z){ if(n._art.indexOf(z[0])>=0){ try{ var ar=new VF.Articulation(z[1]); ar.setPosition(pos); sn.addModifier(ar,0); }catch(e){} } });
            if(n._art.indexOf('~')>=0){ try{ var fe=new VF.Articulation('a@a'); fe.setPosition(VF.ModifierPosition.ABOVE); sn.addModifier(fe,0); }catch(e){} } }
          if(!x2){ var mm=String(n.key).match(/^([a-g])(#|b)?\/(\d)/); if(mm){ var kk=mm[1]+mm[3], want=mm[2]||'n', inKey=(KEY_ACCIDENTALS[ph.keysig]||{})[mm[1]]||'n';
            var cur=(kk in acc)?acc[kk]:inKey; acc[kk]=want; if(want!==cur) sn.addModifier(new VF.Accidental(want),0); } }
          vfDe[lb.c+'.'+ni]=sn; return sn; });
        var beams=(m.beams||[]).map(function(g){ return new VF.Beam(g.map(function(k){ return vf[k]; }),false); });
        var tups=(m.tuplets||[]).map(function(t,ti){ var tl=(J._tres||[]).filter(function(x){ return x.c===lb.c; })[ti]||{};
          try{ return new VF.Tuplet(t.idx.map(function(k){ return vf[k]; }),{num_notes:t.group.ratioNum,notes_occupied:t.group.ratioDen,ratioed:false}); }catch(e){ return null; } }).filter(Boolean);
        var voice=voiceOf(m); voice.addTickables(vf);
        /* como en el libro: tras la última figura queda el aire de lo que dura (una corchea con puntillo deja más hueco) */
        var _d=measureNoteBeats(m), _cap=meterCapQ(m.time), _ult=_d[_d.length-1]||0;
        var izq=stave.getNoteStartX()-x; var bruto=w-izq; var ancho=bruto-Math.max(U(18), (lb.aire!=null)?bruto*lb.aire:bruto*(_ult/_cap)*0.55);
        new VF.Formatter().joinVoices([voice]).format([voice],Math.max(40,ancho));
        voice.draw(ctx,stave);
        beams.forEach(function(b){ b.setContext(ctx).draw(); });
        tups.forEach(function(t){ try{ t.setContext(ctx).draw(); }catch(e){} });
        (J._uni||[]).forEach(function(u){ if(u.c1===lb.c && u.c2===lb.c && vf[u.n1] && vf[u.n2]){ try{ var tdir=(u.arriba!=null && u.abajo)?1:(u.arriba?-1:((lb.stems[u.n1]||1)===1?1:-1)); new VF.StaveTie({first_note:vf[u.n1],last_note:vf[u.n2],first_indices:[0],last_indices:[0]}).setDirection(tdir).setContext(ctx).draw(); }catch(e){} } });
        try{ if(typeof drawPulseTicks==='function' && !m.groupInfo) drawPulseTicks(ctx,m,vf,stave); }catch(e){}
        m.notes.forEach(function(n,k){ if(n.rest) return; var sn=vf[k]; var cx=stave.getNoteStartX(), cy=yTop+60, rad=8;
          try{ var bx=sn.getNoteHeadBeginX(), ex=sn.getNoteHeadEndX(); cx=(bx+ex)/2; var ys=sn.getYs(); if(ys&&ys.length) cy=ys[0]; rad=Math.max(7,(ex-bx)/2+2.5); }catch(e){}
          XHEAD_POS.push({cx:cx,cy:cy,rad:rad}); });
      });
      var sigS=J.sistemas[si+1], sigClave=sigS?(sigS.clave||J.clave||'treble'):null;
      if(sigS && sigClave!==ph.clef){ try{ var ulS=estaves[sis.compases[sis.compases.length-1]]; var gl={treble:'gClef',bass:'fClef'}[sigClave];
        if(ulS && gl){ var gx=ulS.getX()+ulS.getWidth()-U(34); var gy=sigClave==='bass'?ulS.getYForLine(1):ulS.getYForLine(3); VF.Glyph.renderGlyph(ctx,gx,gy,30,gl,{category:'clefNote'}); } }catch(e){} }
      /* compás de cortesía tras la doble barra (como en el libro: el pentagrama sigue hasta el margen) */
      if(sis.cortesia){
        var x1=U(sis.barras[sis.barras.length-1]), x2=U(sis.cortesia.x1);
        var cst=new VF.Stave(x1,yTop,x2-x1,{left_bar:false}); cst.setBegBarType(VF.Barline.type.NONE); cst.setEndBarType(VF.Barline.type.NONE);
        var cc=compasDe(sis.cortesia.compas);
        cst.addTimeSignature(cc.num+'/'+cc.den); cst.setContext(ctx).draw();
        if(cc.extra){ var bc2=bordeCifra(cst); fraccionCompas(ctx, bc2!=null?bc2:cst.getNoteStartX()+U(2), cst.getYForLine(0), cc.extra, S); }
      }
      /* número de compás (italic) sobre la clave, salvo el primer sistema; título en el primero */
      ctx.save();
      var TE=J.titulo_estilo||{};
      if(si===0){ if(TE.fuente==='sans') ctx.setFont('"Helvetica Neue", Helvetica, Arial, sans-serif', U(TE.px||42).toFixed(2)+'px', 'bold');
        else ctx.setFont('LibroCifras, "TeX Gyre Schola", "Century Schoolbook", Georgia, serif', U(TE.px||45).toFixed(2)+'px', 'bold');
        ctx.fillText(J.titulo, U(TE.x!=null?TE.x:83), TE.y!=null?U(TE.y):U(sis.y)+U(53)); }
      else { ctx.setFont('LibroCompas, "TeX Gyre Termes", "Times New Roman", Times, serif', U(27).toFixed(2)+'px', '', 'italic');
        if(sis.numero!==null && sis.numero!=='' && !(J.sin_numeros)) ctx.fillText(String(sis.numero!=null?sis.numero:sis.compases[0]), U(J.numeros_x!=null?J.numeros_x:63), U(sis.y)-U(29)); }
      ctx.restore();
    });
    /* casillas de repetición (1. / 2.) */
    (J.casillas||[]).forEach(function(cs){ try{ var cc=cs.compases||[]; var a=estaves[cc[0]], b=estaves[cc[cc.length-1]]; if(!a||!b) return;
      var x0=a.getX()+U(4), x1=b.getX()+b.getWidth()-U(6), y=a.getYForLine(0)-U(44);
      ctx.save(); ctx.setStrokeStyle('#111'); ctx.setLineWidth(U(1.4)); ctx.beginPath(); ctx.moveTo(x0,y+U(18)); ctx.lineTo(x0,y); ctx.lineTo(x1,y); if(cs.cerrada!==false) ctx.lineTo(x1,y+U(18)); ctx.stroke();
      ctx.setFont('"Times New Roman", Times, serif', U(18).toFixed(2)+'px','bold'); ctx.fillText(cs.texto||'',x0+U(6),y+U(18)); ctx.restore(); }catch(e){} });
    /* ligaduras de unión que cruzan la barra (dibujo) */
    (J._uni||[]).forEach(function(u){ if(u.c1===u.c2) return; var a=vfDe[u.c1+'.'+u.n1], b=vfDe[u.c2+'.'+u.n2];
      if(a&&b){ try{ var td=u.abajo?1:(u.arriba?-1:(a.getStemDirection()===1?1:-1)); new VF.StaveTie({first_note:a,last_note:b,first_indices:[0],last_indices:[0]}).setDirection(td).setContext(ctx).draw(); }catch(e){} } });
    /* matices (fz, sfz, p…) bajo la nota */
    (J.matices||[]).forEach(function(t){ var m=/^(\d+)\.(\d+)\s+(\S+)/.exec(String(t).trim()); if(!m) return; var nn=vfDe[m[1]+'.'+(m[2]-1)]; if(!nn) return;
      try{ var st=nn.getStave(), x=nn.getNoteHeadBeginX(), y=st.getYForLine(4)+U(52); ctx.save(); ctx.setFont('"Times New Roman", Times, serif', U(21).toFixed(2)+'px','bold','italic'); ctx.fillText(m[3],x-U(4),y); ctx.restore(); }catch(e){} });
    /* ligaduras de expresión */
    (L._lig||[]).forEach(function(g){ var a=vfDe[g.c1+'.'+g.n1], b=vfDe[g.c2+'.'+g.n2]; if(!a||!b) return;
      var sa=a.getStave(), sb=b.getStave();
      if(sa && sb && Math.abs(sa.getY()-sb.getY())>1){ ligaduraPartida(ctx,a,b,g.arriba,S,estaves,L); } else ligadura(ctx,a,b,g.arriba,S); });
    /* corchetes discontinuos bajo grupos de notas (como en el libro) */
    (L._cor||[]).forEach(function(g){ var a=vfDe[g.c1+'.'+g.n1], b=vfDe[g.c2+'.'+g.n2]; if(!a||!b) return;
      try{ var x0=a.getNoteHeadBeginX()-U(4), x1=b.getNoteHeadEndX()+U(4), yb=0;
        [a,b].forEach(function(n){ var e=n.getStemExtents?n.getStemExtents():null; var ys=n.getYs(); yb=Math.max(yb, ys[0]+U(14), e?Math.max(e.baseY,e.topY)+U(6):0); });
        var st=a.getStave(); yb=Math.max(yb, st.getYForLine(4)+U(22));
        ctx.save(); ctx.setStrokeStyle('#111'); ctx.setLineWidth(U(1.6)); try{ ctx.setLineDash([U(9),U(7)]); }catch(e){}
        ctx.beginPath(); ctx.moveTo(x0,yb); ctx.lineTo(x1,yb); ctx.stroke(); try{ ctx.setLineDash([]); }catch(e){}
        ctx.beginPath(); ctx.moveTo(x0,yb-U(7)); ctx.lineTo(x0,yb); ctx.moveTo(x1,yb-U(7)); ctx.lineTo(x1,yb); ctx.stroke(); ctx.restore(); }catch(e){} });
    /* notas del libro (texto + flecha) */
    (J.notas_libro||[]).forEach(function(nb){ notaLibro(ctx,nb,U); });
    /* encaje en la tarjeta: viewBox con las medidas del libro escaladas */
    var svg=container.querySelector('svg');
    if(svg){ var W=U(P.ancho), H=U(P.alto); svg.setAttribute('viewBox','0 0 '+W+' '+H); svg.setAttribute('preserveAspectRatio','xMidYMin meet');
      svg.removeAttribute('width'); svg.removeAttribute('height'); svg.style.width='100%'; svg.style.height='auto'; svg.style.display='block'; svg.style.margin='0 auto'; }
  }

  /* «+1/4» pequeño junto al numerador, como en el libro (medidas tomadas de la captura, en px del libro) */
  function bordeCifra(stave){ try{ var ms=stave.getModifiers(VF.StaveModifierPosition.BEGIN); for(var i=0;i<ms.length;i++){ var m=ms[i];
      if(m.getCategory && /timesignature/i.test(m.getCategory())) return m.getX()+m.getWidth(); } }catch(e){} return null; }
  function fraccionCompas(ctx, x, yLinea0, extra, S){
    var m=/^([+\-−])(\d+)\/(\d+)$/.exec(extra); if(!m) return;
    var u=function(px){ return px/S; }, FN='LibroCifras, "TeX Gyre Schola", Georgia, serif';
    ctx.save(); ctx.setFillStyle('#111'); ctx.setStrokeStyle('#111');
    ctx.setFont(FN, u(19).toFixed(2)+'px', 'bold'); ctx.fillText(m[1]==='-'?'−':m[1], x+u(4), yLinea0+u(14));
    ctx.setFont(FN, u(18).toFixed(2)+'px', 'bold'); ctx.fillText(m[2], x+u(16), yLinea0+u(15));
    ctx.setLineWidth(u(1.7)); ctx.beginPath(); ctx.moveTo(x+u(19),yLinea0+u(29)); ctx.lineTo(x+u(31),yLinea0+u(3)); ctx.stroke();
    ctx.fillText(m[3], x+u(24), yLinea0+u(29));
    ctx.restore();
  }

  /* ligadura de expresión: arco afinado en las puntas (relleno entre dos curvas) */
  function ligadura(ctx, a, b, arriba, S){
    function punto(n, esIni){
      var bx=n.getNoteHeadBeginX(), ex=n.getNoteHeadEndX(), cx=(bx+ex)/2, y=n.getYs()[0];
      var up=n.getStemDirection()===1, ext=n.getStemExtents ? n.getStemExtents() : null;
      var tipY = ext ? (up?ext.topY:ext.baseY) : y;
      var sx=up?ex:bx;
      if(arriba){ if(up){ return {x:sx+(esIni?1:-1)*0, y:Math.min(tipY,y)-4}; } return {x:cx, y:y-8}; }
      else { if(!up){ return {x:sx, y:Math.max(tipY,y)+4}; } return {x:cx, y:y+8}; }
    }
    var p=punto(a,true), q=punto(b,false);
    var dx=q.x-p.x; var h=Math.min(22, 6+dx*0.12); var s=arriba?-1:1;
    var c1x=p.x+dx*0.25, c2x=p.x+dx*0.75, base=arriba?Math.min(p.y,q.y):Math.max(p.y,q.y);
    var c1y=base+s*h, c2y=base+s*h, g=1.6;
    ctx.save(); ctx.setFillStyle('#111'); ctx.beginPath();
    ctx.moveTo(p.x,p.y); ctx.bezierCurveTo(c1x,c1y,c2x,c2y,q.x,q.y);
    ctx.bezierCurveTo(c2x,c2y-s*g,c1x,c1y-s*g,p.x,p.y); ctx.fill(); ctx.restore();
  }

  var _cv=null;
  function mide(txt,size,fam){ try{ if(!_cv) _cv=document.createElement('canvas').getContext('2d'); _cv.font=size+'px '+fam; return _cv.measureText(txt).width; }catch(e){ return txt.length*size*0.5; } }
  /* ligadura que salta de pentagrama: hasta el final del primero y desde el principio del segundo */
  function ligaduraPartida(ctx,a,b,arriba,S,estaves,L){
    function fin(n){ var st=n.getStave(); var lastX=0, ultSt=st; Object.keys(estaves).forEach(function(k){ var e=estaves[k]; if(Math.abs(e.getY()-st.getY())<1 && e.getX()+e.getWidth()>lastX){ lastX=e.getX()+e.getWidth(); ultSt=e; } }); return {x:lastX-4/S, y:n.getYs()[0]}; }
    function ini(n){ var st=n.getStave(), firstSt=st, fx=1e9; Object.keys(estaves).forEach(function(k){ var e=estaves[k]; if(Math.abs(e.getY()-st.getY())<1 && e.getX()<fx){ fx=e.getX(); firstSt=e; } }); return {x:firstSt.getNoteStartX()-12/S, y:n.getYs()[0]}; }
    var pa=fin(a), pb=ini(b), s=arriba?-1:1;
    function arco(x0,y0,x1,y1){ var dx=x1-x0, h=Math.min(18,5+dx*0.12), base=arriba?Math.min(y0,y1)-8:Math.max(y0,y1)+8;
      ctx.save(); ctx.setFillStyle('#111'); ctx.beginPath(); ctx.moveTo(x0,y0); ctx.bezierCurveTo(x0+dx*0.3,base+s*h,x0+dx*0.7,base+s*h,x1,y1); ctx.bezierCurveTo(x0+dx*0.7,base+s*h-s*1.6,x0+dx*0.3,base+s*h-s*1.6,x0,y0); ctx.fill(); ctx.restore(); }
    try{ var ya=a.getYs()[0]+(arriba?-8:8); arco(a.getNoteHeadEndX(), ya, pa.x, ya+(arriba?-4:4)); }catch(e){}
    try{ var yb=b.getYs()[0]+(arriba?-8:8); arco(pb.x, yb+(arriba?-4:4), b.getNoteHeadBeginX(), yb); }catch(e){}
  }

  function notaLibro(ctx, nb, U){
    ctx.save(); ctx.setFillStyle('#2b2b2b'); ctx.setStrokeStyle('#2b2b2b');
    var F='"Helvetica Neue", Helvetica, Arial, sans-serif';
    nb.lineas.forEach(function(li){
      var piezasDe=function(T){ return li.partes.map(function(p){
        if(typeof p==='string') return {t:p, w:mide(p,T,F)};
        if(p.it) return {t:p.it, it:true, w:mide(p.it,T,F)};
        if(p.frac) return {frac:p.frac, apilada:!!p.apilada, w:(p.apilada?0.75:1.15)*T};
        if(p.figura) return {fig:p.figura, w:1.9*T}; return {t:'',w:0}; }); };
      var T=U(17), piezas=piezasDe(T), tot=piezas.reduce(function(a,p){ return a+p.w; },0);
      if(li.x0!=null && li.x1!=null && tot>0){ T=T*U(li.x1-li.x0)/tot; piezas=piezasDe(T); tot=U(li.x1-li.x0); }
      var x=(li.x0!=null)?U(li.x0):(li.alinear==='derecha'?U(li.x||0)-tot:U(li.x||0)), y=U(li.y||0), k=T/17;   /* k: px del libro → unidades a este tamaño */
      piezas.forEach(function(p){
        if(p.t!=null){ ctx.setFont(F,T.toFixed(2)+'px','normal',p.it?'italic':'normal'); ctx.fillText(p.t,x,y); }
        else if(p.frac){ var nd=p.frac.split('/'); ctx.setFont(F,(T*0.72).toFixed(2)+'px','normal');
          if(p.apilada){ ctx.fillText(nd[0],x+3*k,y-9*k); ctx.setLineWidth(1*k); ctx.beginPath(); ctx.moveTo(x+1*k,y-6*k); ctx.lineTo(x+11*k,y-6*k); ctx.stroke(); ctx.fillText(nd[1],x+3*k,y+5*k); }
          else { ctx.fillText(nd[0],x+1*k,y-6*k); ctx.setLineWidth(1*k); ctx.beginPath(); ctx.moveTo(x+5*k,y+1*k); ctx.lineTo(x+11*k,y-12*k); ctx.stroke(); ctx.fillText(nd[1],x+10*k,y+1*k); } }
        else if(p.fig){ /* tres semicorcheas unidas, en pequeño */
          var hx=[x+5*k,x+15*k,x+25*k], hy=y-1*k;
          hx.forEach(function(cx){ ctx.beginPath(); ctx.arc(cx,hy,2.6*k,0,Math.PI*2); ctx.fill(); ctx.fillRect(cx+2*k,hy-14*k,1*k,14*k); });
          ctx.fillRect(hx[0]+2*k,hy-14*k,hx[2]-hx[0]+1*k,2*k);
          ctx.fillRect(hx[0]+2*k,hy-10.5*k,hx[2]-hx[0]+1*k,2*k); }
        x+=p.w; });
    });
    if(nb.flecha){ var f=nb.flecha.map(U); ctx.setLineWidth(U(1.2)); ctx.beginPath(); ctx.moveTo(f[0],f[1]); ctx.lineTo(f[2],f[3]); ctx.stroke();
      var ang=Math.atan2(f[3]-f[1],f[2]-f[0]), L2=U(13);
      ctx.beginPath(); ctx.moveTo(f[2]-L2*Math.cos(ang-0.38),f[3]-L2*Math.sin(ang-0.38)); ctx.lineTo(f[2],f[3]); ctx.lineTo(f[2]-L2*Math.cos(ang+0.38),f[3]-L2*Math.sin(ang+0.38)); ctx.stroke(); }
    ctx.restore();
  }

  /* ---------------- 4. ENGANCHE CON LA APP ---------------- */
  var _render=window.renderLesson;
  window.renderLesson=function(container,L){ if(L && L.libro) return dibujaLibro(container,L); return _render.apply(this,arguments); };
  var LEC=null;
  var _gen=window.generateLesson;
  window.generateLesson=function(){ if(LEC){ if(typeof studyMode!=='undefined' && studyMode) closeStudy(); currentLesson=LEC; renderCurrent(); return; } return _gen.apply(this,arguments); };

  function botonOriginal(J){
    var b=document.createElement('button'); b.className='libro-orig-btn'; b.setAttribute('data-tip','Ver la lección en el libro'); b.title='';
    b.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>';
    b.onclick=function(){ var ov=document.createElement('div'); ov.className='libro-orig';
      ov.innerHTML='<img alt="Lección '+J.n+' en el libro" src="'+J.captura+'"><button>Cerrar</button>';
      ov.onclick=function(e){ if(e.target.tagName!=='IMG') ov.remove(); }; document.body.appendChild(ov); };
    document.body.appendChild(b);
  }

  /* ================= ESTUDIO POR FASES (el de Ritmo entonado PRO, 20-nov-2026) SIN TIEMPO =================
     Iago: en el visor de lecciones NO hay tiempos ni reloj; se pasa de fase con «Pasar a la siguiente fase».
     GE: sin patrones △/U, fases 3 y 4 «opcional». Lo anotado se guarda en este dispositivo (por alumno y lección). */
  var GE=false, CLAVE_ANOT='';
  /* los textos de los carteles son los de Ritmo entonado PRO (mismas palabras, misma barra de Velocidad), quitando los tiempos */
  function sinTiempo(t, ph){
    t=String(t||'');
    t=t.replace(/Puedes estar aquí hasta \d+ minutos? y pasar a la siguiente fase cuando quieras\./,'<b>Aquí no hay tiempo</b>: pasa a la siguiente fase cuando quieras.');
    t=t.replace(/Ahora tienes \d+ minutos? para /i,'Ahora vas a ');
    t=t.replace(/Tienes <b>\d+ minutos?<\/b> para practicar la entonación\./i,'Practica la <b>entonación</b>, sin prisa: <b>aquí no hay tiempo</b>.');
    t=t.replace(/Tienes \d+ minutos?[^.]*\./i,'');
    t=t.replace(/Cuando termine el tiempo[^.]*\./i,'Cuando quieras, pasa a la <b>realización final</b>.');
    if(GE){ t=t.replace(/patrones △\/U, /,'').replace(/ Si te atascas con los compases dispares[^.]*\.[^.]*\./,'');
      if(ph && ph.kind==='entonacion') t='Esta fase es <b>opcional</b>. '+t; }
    return t;
  }
  /* ================= CARTELES VISUALES (20-nov-2026, Iago: «como los de Entonación at home») =================
     Cada cartel de fase: título + una frase + filas con el control EN MINIATURA a la izquierda y qué hace a la derecha. */
  var CV_CSS='.rp-cartel .phase-banner.cv{max-width:760px!important;max-height:calc(100vh - 40px);overflow:auto}'
   +'.cv .cv-lead{margin:2px 0 12px;font-size:15px;line-height:1.5;color:#cbd5e1}.cv .cv-lead b,.cv .cv-tx b{color:#fff}'
   +'.cv .cv-f{display:grid;grid-template-columns:262px 1fr;gap:16px;align-items:center;padding:11px 14px;margin:0 0 8px;border:1px solid rgba(148,163,184,.2);border-radius:10px;background:rgba(15,23,42,.55)}'
   +'.cv .cv-v{display:flex;align-items:center;gap:6px;flex-wrap:nowrap}.cv .cv-tx{font-size:13.5px;line-height:1.45;color:#cbd5e1}'
   +'.cv .cv-b{display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:30px;padding:0 10px;border-radius:8px;border:1px solid rgba(96,165,250,.55);background:#13203a;color:#e2e8f0;font:600 13px/1 Inter,system-ui,sans-serif;white-space:nowrap}'
   +'.cv .cv-b.sq{padding:0;width:30px;min-width:30px}.cv .cv-b.az{background:#2563eb;border-color:#2563eb;color:#fff}.cv .cv-b i{font-style:normal;color:#60a5fa;margin-left:7px}'
   +'.cv .cv-seg{display:inline-flex;border:1px solid rgba(96,165,250,.55);border-radius:8px;overflow:hidden}.cv .cv-seg span{padding:9px 8px;white-space:nowrap;font:600 11.5px/1 Inter,system-ui,sans-serif;color:#e2e8f0;background:#13203a;border-left:1px solid rgba(96,165,250,.35)}.cv .cv-seg span:first-child{border-left:0}.cv .cv-seg span.on{background:#1d4ed8;color:#fff}'
   +'.cv .cv-pz{background:#fff;border-radius:7px;padding:3px 6px;display:inline-flex}.cv .cv-pz svg{display:block}'
   +'.cv .cv-key{display:inline-flex;align-items:center;justify-content:center;width:150px;height:30px;border-radius:7px;background:#e2e8f0;color:#0f172a;font:600 12px/1 Inter,system-ui,sans-serif;box-shadow:0 3px 0 #94a3b8}'
   +'.cv .cv-pad{width:44px;height:30px;border-radius:8px;background:#16a34a;box-shadow:0 3px 0 #14532d}'
   +'.cv .cv-mic{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:8px;border:1px solid rgba(96,165,250,.6);color:#93c5fd;font:600 12.5px/1 Inter,system-ui,sans-serif}.cv .cv-mic u{display:inline-block;width:46px;height:5px;border-radius:3px;background:linear-gradient(90deg,#3b82f6 70%,#334155 70%)}'
   +'.cv .cv-f .rp-va-bar{margin:0}.cv .cv-ok{display:inline-flex;align-items:center;gap:6px;color:#93c5fd;font:600 13px/1 Inter,system-ui,sans-serif}'
   +'@media (max-width:620px){.cv .cv-f{grid-template-columns:1fr;gap:8px}}';
  function cvPentagrama(cols, opts){ /* cols: colores de cada nota (negro por defecto) · opts.altos: alturas */
    opts=opts||{}; var n=cols.length, w=28+n*26, al=opts.altos||[3,1,2,0,2,1].slice(0,n), s='<svg width="'+w+'" height="34" viewBox="0 0 '+w+' 34">';
    for(var i=0;i<5;i++) s+='<line x1="4" x2="'+(w-4)+'" y1="'+(7+i*5)+'" y2="'+(7+i*5)+'" stroke="#9ca3af" stroke-width="1"/>';
    cols.forEach(function(c,i){ var x=20+i*26, y=27-al[i%al.length]*5; c=c||'#111';
      s+='<ellipse cx="'+x+'" cy="'+y+'" rx="4.6" ry="3.5" transform="rotate(-20 '+x+' '+y+')" fill="'+c+'"/><line x1="'+(x+4.2)+'" x2="'+(x+4.2)+'" y1="'+y+'" y2="'+(y-17)+'" stroke="'+c+'" stroke-width="1.5"/>'; });
    return '<span class="cv-pz">'+s+'</svg></span>'; }
  function cvVelocidad(){ var d=''; var lv=0; try{ lv=velLevel; }catch(e){} for(var i=-2;i<=2;i++) d+='<i'+(i===lv?' class="on"':'')+'></i>';
    return '<span class="rp-va-bar"><span class="rp-va-e">🐢</span>'+d+'<span class="rp-va-e">🐇</span></span>'; }
  function cvAnotar(){ return '<span class="cv-b sq" style="border-color:#475569"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 20l4-1 11-11-3-3L5 16z"/></svg></span>'
      +'<span class="cv-b sq" style="border-color:#475569"><span style="width:14px;height:14px;border-radius:3px;background:#50e68c;display:block"></span></span>'
      +(GE?'':'<span class="cv-b sq" style="border-color:#475569;color:#e2e8f0">△</span>')
      +'<span class="cv-b sq" style="border-color:#475569">⚠️</span><span class="cv-b sq" style="background:#2563eb;border-color:#2563eb;color:#fff;font-size:11px">4J</span><span class="cv-b sq" style="background:#15803d;border-color:#15803d;color:#fff;font-size:11px">3m</span>'; }
  var CARTELES_VISUALES=false;   /* (20-nov) se enciende cuando Iago dé el visto bueno; para verlos antes: &cv=1 */
  function cvFila(v,t){ return '<div class="cv-f"><div class="cv-v">'+v+'</div><div class="cv-tx">'+t+'</div></div>'; }
  var CV_VEL='Abajo, en la barra de <b>Velocidad</b>, vas <b>más lento</b> o <b>más rápido</b>. La que elijas se mantiene hasta el final, salvo que la cambies.';
  function cvContenido(tipo){
    var tactil=false; try{ tactil=isTouchDevice(); }catch(e){}
    var notas='Tus <b>anotaciones</b> siguen ahí, y se <b>guardan en este dispositivo</b> para otro día.';
    if(tipo==='ritmo') return {lead:'<b>Percute</b> el ritmo de la lección. <b>Aquí no hay tiempo</b>: pasa a la siguiente fase cuando quieras.', filas:[
      cvFila(tactil?'<span class="cv-pad"></span><span class="cv-pad"></span>':'<span class="cv-key">espacio</span>', tactil?'Toca el ritmo con los <b>pads verdes</b> (abajo, a los lados). Si mantienes el dedo, el sonido se mantiene.':'Toca el ritmo con la <b>barra espaciadora</b>. Si la mantienes pulsada, el sonido se mantiene.'),
      cvFila(cvPentagrama(['#111','#2563eb','#111','#111']), 'Las figuras y los silencios <b>se iluminan</b> al sonar. Por defecto suena la <b>subdivisión en corcheas</b>.'),
      cvFila(cvAnotar(), 'Con las <b>columnas de los lados</b> anotas en la partitura: escribir, subrayar, '+(GE?'':'patrones △/U, ')+'alertas e <b>intervalos</b>. Lo que escribas se queda en las <b>fases siguientes</b> y en <b>este dispositivo</b> para otro día.'),
      cvFila(cvVelocidad(), CV_VEL)]};
    if(tipo==='lectura'){ var f=[
      cvFila(cvPentagrama(['#111','#111','#111','#111'])+'<span class="cv-ok">do · mi · re…</span>', 'Ponle <b>nombre a las notas</b> que percutías, <b>solfeando sin cantar</b>, marcando el <b>pulso con la mano</b> o como lo trabajamos en clase.'),
      cvFila('<span class="cv-b">♩ pulso</span>', 'Aquí no suena la subdivisión: <b>solo el pulso</b>.')];
      var disp=false; try{ disp=!GE && rpTieneDispares(); }catch(e){}
      if(disp) f.push(cvFila('<span class="cv-b">△ U</span><span class="cv-b">Revelar patrón</span>', 'Si te atascas con los compases dispares, pulsa <b>Revelar patrón</b>: verás cada pulso de 3 corcheas (△) y de 2 (U).'));
      f.push(cvFila(cvAnotar(), notas)); f.push(cvFila(cvVelocidad(), CV_VEL));
      return {lead:'Lee la lección <b>con la mano</b>. <b>Aquí no hay tiempo</b>: pasa a la siguiente fase cuando quieras.', filas:f}; }
    if(tipo==='entonacion') return {lead:(GE?'Esta fase es <b>opcional</b>. ':'')+'Practica la <b>entonación</b>, sin prisa: <b>aquí no hay tiempo</b>. El <b>micrófono</b> llega en la realización final.', filas:[
      cvFila('<span class="cv-seg"><span>Tónica</span><span>Escala</span><span>Arpegio</span></span>', 'Pulsa <b>Tónica</b>, <b>Escala</b> o <b>Arpegio</b> cuando quieras para situar el oído.'),
      cvFila('<span class="cv-b">Pistas<i>3</i></span>'+cvPentagrama(['#111','#2563eb','#111'],{altos:[1,3,2]}), 'Pulsa <b>Pistas</b>: <b>todas las notas parpadean</b>. Toca hasta <b>3</b>: se quedan en <b>azul</b> y suenan <b>siempre que las pulses</b>.'),
      cvFila('<span class="cv-b az sq">▶</span><span class="cv-seg"><span>Sin ayuda</span><span class="on">Pentagrama</span><span>Compás</span></span>', 'Con <b>▶</b> suenan el <b>acompañamiento</b> y la <b>ayuda del piano</b> que elijas abajo: sin ayuda, la primera nota de <b>cada pentagrama</b> o la de <b>cada compás</b>. Las notas que tocará el piano se ven en <b>azul</b>.'),
      cvFila(cvAnotar(), notas),
      cvFila(cvVelocidad(), CV_VEL)]};
    if(tipo==='final') return {lead:(GE?'Esta fase es <b>opcional</b>. ':'')+'Canta la lección con el <b>acompañamiento</b>: el <b>micrófono</b> te escucha. Canta en la <b>octava</b> que te sea cómoda.', filas:[
      cvFila('<span class="cv-b az sq">▶</span>', 'Pulsa el <b>botón azul</b>'+(tactil?'':' (o la <b>barra espaciadora</b>)')+' para empezar: al principio solo suena la <b>tónica</b>. Si se pone <b>rojo</b>, al pulsarlo paras.'),
      cvFila('<span class="cv-mic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>Micrófono listo<u></u></span>', 'Abajo ves si el <b>micrófono</b> te oye: la barrita se mueve cuando cantas.'),
      cvFila(cvPentagrama(['#111','#2563eb','#111','#111']), 'Se <b>ilumina en azul</b> la figura que toca cantar. Sin pistas ni notas marcadas: el piano <b>se adapta</b>. Si vas bien, te deja solo; si te cuesta, te da notas.'),
      cvFila(cvPentagrama(['#16a34a','#f59e0b','#dc2626','#16a34a']), 'Al final, cada nota en <b>verde</b> (afinada), <b>ámbar</b> (cerca) o <b>rojo</b>, y tu <b>% de acierto</b>: es una <b>estimación</b>, no cuenta para tus notas de clase.'),
      cvFila(cvVelocidad(), CV_VEL)]};
    return null;
  }
  function cvVisualiza(scrim){
    if(scrim._cv) return; scrim._cv=1;
    var card=scrim.querySelector('.phase-banner'); if(!card) return;
    var tt=(card.querySelector('.pb-t')||{}).textContent||'', tipo=null;
    if(/Realizaci/i.test(tt)) tipo='final';
    else { try{ var ph=phaseList[phaseIdx]; if(ph && !(currentLesson&&currentLesson.fusaN)) tipo=ph.kind; }catch(e){} }
    var c=tipo && cvContenido(tipo); if(!c) return;
    card.classList.add('cv');
    var ok=card.querySelector('.pb-ok'), kk=card.querySelector('.pb-k'), t=card.querySelector('.pb-t');
    Array.prototype.slice.call(card.children).forEach(function(el){ if(el!==ok && el!==kk && el!==t) el.remove(); });
    var lead=document.createElement('p'); lead.className='cv-lead'; lead.innerHTML=c.lead;
    var box=document.createElement('div'); box.innerHTML=c.filas.join('');
    if(ok){ card.insertBefore(lead,ok); card.insertBefore(box,ok); } else { card.appendChild(lead); card.appendChild(box); }
  }
  function cvArranca(){
    var st=document.createElement('style'); st.textContent=CV_CSS; document.head.appendChild(st);
    new MutationObserver(function(ms){ ms.forEach(function(m){ Array.prototype.forEach.call(m.addedNodes,function(n){
      if(n.nodeType===1 && n.classList && n.classList.contains('rp-cartel')) cvVisualiza(n); }); }); }).observe(document.body,{childList:true,subtree:true});
  }

  function adaptaEstudio(J){
    GE=(J.grado==='ge'); if(GE) document.body.classList.add('libro-ge');
    try{ if(typeof RP_LIM!=='undefined'){ RP_LIM.perc=RP_LIM.ritmo=RP_LIM.ent=1e9; } }catch(e){}
    if(typeof window.rpTextoFase==='function'){ var _rtf=window.rpTextoFase; window.rpTextoFase=function(ph){ return sinTiempo(_rtf.apply(this,arguments), ph); }; }
    if(GE && typeof window.rpPatronBtn==='function'){ window.rpPatronBtn=function(){ var b=document.getElementById('rpPatron'); if(b) b.remove(); }; }   /* GE: sin «Revelar patrón» */
    if(typeof window.renderPhaseSteps==='function'){ var _rps=window.renderPhaseSteps;
      window.renderPhaseSteps=function(){ _rps.apply(this,arguments); if(!GE) return;
        document.querySelectorAll('#phaseSteps .phase-step').forEach(function(b,i){ if(i>=2){ b.title=(b.title||'')+' · opcional'; if(b.classList.contains('cur')) b.textContent+=' · opcional'; } }); }; }
    /* la barra de abajo (velocidad, subdivisión) siempre a la vista: si no cabe, la lección encoge */
    if(typeof window.rpEncaja==='function'){ var _enc=window.rpEncaja;
      window.rpEncaja=function(){ _enc.apply(this,arguments);
        try{ if(!studyMode) return; var sw=document.getElementById('scoreWrap'), pc=document.getElementById('phaseControls'); if(!sw||!pc||pc.style.display==='none') return;
          var sobra=pc.getBoundingClientRect().bottom+10-window.innerHeight; if(sobra<=2) return;
          var r=sw.getBoundingClientRect(), f=Math.max(0.45,(r.height-sobra)/r.height);
          sw.style.maxWidth=Math.floor(r.width*f)+'px'; sw.style.marginLeft='auto'; sw.style.marginRight='auto';
          if(typeof RP_ANOT_CTL!=='undefined' && RP_ANOT_CTL && RP_ANOT_CTL.refit) requestAnimationFrame(function(){ RP_ANOT_CTL && RP_ANOT_CTL.refit && RP_ANOT_CTL.refit(); });
        }catch(e){} }; }
    /* GE: el título de la app */
    if(GE){ try{ var h=document.getElementById('goRitmoHome'); if(h){ var rt=h.querySelector('.rt'); if(rt) rt.style.display='none'; } }catch(e){} }
    /* anotaciones guardadas en el dispositivo */
    try{ var cta=new URLSearchParams(location.search).get('cuenta')||'local';
      CLAVE_ANOT='lm_libro_anot_'+(J.grado||'gp')+'_'+J.n+'_'+cta;
      if(typeof RP_ANOT!=='undefined'){ var guard=null; try{ guard=JSON.parse(localStorage.getItem(CLAVE_ANOT)||'null'); }catch(e){}
        var store=(guard&&guard.pages)?guard:{pages:{},ton:null}; RP_ANOT.set(LEC,store);
        var ult=JSON.stringify(store);
        var graba=function(){ try{ var t=JSON.stringify(store); if(t!==ult){ localStorage.setItem(CLAVE_ANOT,t); ult=t; } }catch(e){} };
        setInterval(graba,2000); window.addEventListener('pagehide',graba); document.addEventListener('visibilitychange',graba); }
    }catch(e){ console.warn('[libro] anotaciones',e); }
  }

  function arranca(){
    fetch(FICHERO,{cache:'no-cache'}).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); }).then(function(J){
      LEC=montaLeccion(J); window.__LIBRO=LEC;
      currentCourse='gp1'; gp1WorldId='m1'; gp1ActiveCards=['c1_9']; gp1Mode='uno';
      try{ document.getElementById('gp1Step').style.display='none'; }catch(e){}
      try{ document.getElementById('entry').style.display='none'; document.getElementById('app').style.display='block'; }catch(e){}
      try{ var tr=document.querySelector('#app .tabs'); if(tr) tr.style.display='none'; }catch(e){}
      try{ applyTrimUI(); }catch(e){}
      /* (20-nov-2026, Iago) en las lecciones del libro no hay «Prueba directa»: o se estudia por fases o se lee directamente en pantalla */
      ['genBtn','gp1ChangeBtn','accompBtn'].forEach(function(id){ var e=document.getElementById(id); if(e){ e.style.display='none'; e.setAttribute('data-libro-oculto','1'); } });
      try{ var h=document.getElementById('goRitmoHome'); if(h){ h.removeAttribute('href'); h.onclick=function(e){ e.preventDefault(); }; h.style.pointerEvents='none'; var bk=h.querySelector('.back'); if(bk) bk.style.display='none'; } }catch(e){}
      document.title='Lección '+J.n+' · Ritmo entonado';
      currentLesson=LEC; renderCurrent();
      try{ var tg=document.getElementById('lessonTags'); if(tg) tg.innerHTML='<span>Lección '+J.n+'</span><span>'+J.tonalidad+'</span><span>'+J.compases.length+' compases</span>'; }catch(e){}
      botonOriginal(J);
      document.body.classList.add('libro-modo');
      adaptaEstudio(J); try{ if(CARTELES_VISUALES || /[?&]cv=1/.test(location.search)) cvArranca(); }catch(e){ console.warn('[libro] carteles',e); }
      try{ document.querySelectorAll('p,div').forEach(function(e){ if(e.children.length===0 && /generado proceduralmente/i.test(e.textContent)) e.style.display='none'; }); }catch(e){}
    }).catch(function(e){ console.error('[libro] no se pudo abrir la lección',e);
      var s=document.getElementById('score'); if(s) s.innerHTML='<div style="padding:30px;text-align:center;color:#7a1407">No se pudo abrir la lección '+NUM+'.</div>'; });
  }
  if(document.readyState==='complete') setTimeout(arranca,0); else window.addEventListener('load',function(){ setTimeout(arranca,50); });
})();
