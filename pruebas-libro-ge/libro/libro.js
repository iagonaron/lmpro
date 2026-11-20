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
      ".libro-orig-btn{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.libro-orig-btn.on{background:#2563eb;border-color:#2563eb}.libro-orig{pointer-events:none;position:fixed;inset:0;z-index:99995;background:rgba(6,9,18,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px}"+
      ".libro-orig img{max-width:96vw;max-height:84vh;background:#fff;border-radius:8px}"+
      "body.libro-modo #rpReloj{display:none!important}"+
      "body.libro-modo footer{display:none!important}"+
      "body.libro-ge .anot-pt{display:none!important}"+
      "body.libro-modo .libro-recuerda{display:block}"+
      "body.libro-modo:not(.rp-estudio) #score.libro-papel svg{width:100%!important;height:auto!important;max-height:calc(100vh - 170px);display:block;margin:0 auto}"+
      "body.libro-modo #exBtn,body.libro-modo #exEdit{display:none!important}"+
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
    if(txt==='C|'||txt==='¢') return {time:'2/2', num:'2', den:'2', extra:null, simbolo:'C|'};
    if(txt==='C') return {time:'4/4', num:'4', den:'4', extra:null, simbolo:'C'};
    var ad=/^(\d+(?:\+\d+)+)\/(\d+)$/.exec(txt);   /* «3+3+2/8»: se dibuja así y dura la suma */
    if(ad){ var sum=ad[1].split('+').reduce(function(x,y){ return x+(+y); },0); return {time:sum+'/'+ad[2], num:ad[1], den:ad[2], extra:null, aditivo:true}; }
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
      return {c:+m[1], n1:+m[2]-1, n2:+m[4]-1, num:+rr[1], den:+rr[2], cifra:(typeof t==='string'||t.cifra!==false), abajo:(typeof t!=='string' && !!t.abajo), arriba:(typeof t!=='string' && !!t.arriba), ratio:(typeof t!=='string' && !!t.ratio)}; }).filter(Boolean);
    J._uni=(J.uniones||[]).map(function(t){ var m=/^(\d+)\.(\d+)-(\d+)\.(\d+)(?:\s+(arriba|abajo))?$/.exec(String(t).trim()); return m?{c1:+m[1],n1:+m[2]-1,c2:+m[3],n2:+m[4]-1,arriba:m[5]==='arriba',abajo:m[5]==='abajo'}:null; }).filter(Boolean);
    var medidas=J.compases.map(function(c){
      if(c.compas) compasAct=compasDe(c.compas);
      var notes=[], beams=[], stems=[]; var total16=0;
      c.m.split('|').forEach(function(g){
        var tk=g.trim().split(/\s+/); var stem=0;
        if(tk[0]==='^'){ stem=1; tk.shift(); } else if(tk[0]==='v'){ stem=-1; tk.shift(); }
        var idx=[];
        tk.forEach(function(t){ var p=t.split(':'); var esSil=/^r/.test(p[1]); var suf=(/[-!>~'^]+$/.exec(p[1])||[''])[0]; if(suf) p[1]=p[1].slice(0,-suf.length);
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
      m._libro={c:c.c, stems:stems, compas:compasAct, cambia:!!c.compas && !compasAct.libre, aire:(c.aire!=null?+c.aire:null), sinBarra:!!c.sin_barra, barraIni:c.barra_ini||null, barraFin:c.barra_fin||null, claveDesde:(c.clave_desde&&c.clave_desde.n)?{n:+c.clave_desde.n, clave:c.clave_desde.clave||'treble'}:null};
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
    L._cor=(J.corchetes||[]).map(function(t){ var m=/^(\d+)\.(\d+)-(\d+)\.(\d+)(?:\s+(arriba|abajo))?$/.exec(t.trim()); return m?{c1:+m[1],n1:+m[2]-1,c2:+m[3],n2:+m[4]-1,arriba:m[5]==='arriba'}:null; }).filter(Boolean);
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
      var ph=L.phrases[si]; ph._claveAct=null; var yTop=U(sis.y)-40;   /* línea superior del pentagrama a sis.y */
      var xs=[sis.x0].concat(sis.barras);
      sis.compases.forEach(function(k,j){
        var m=ph.measures[j], lb=m._libro;
        var x=U(xs[j]), w=U(xs[j+1]-xs[j]);
        var stave=new VF.Stave(x,yTop,w,{left_bar:j===0});
        if(j===0){ stave.addClef(ph.clef).addKeySignature(ph.keysig); }
        var conCifra = lb.cambia;
        if(conCifra) stave.addTimeSignature(lb.compas.simbolo||(lb.compas.num+'/'+lb.compas.den));
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
        var cdz=lb.claveDesde; var clefDe=function(ni){ return (cdz && ni+1>=cdz.n)?cdz.clave:(ph._claveAct||ph.clef); };
        var vf=m.notes.map(function(n,ni){
          var sd=lb.stems[ni];
          if(n.rest){ var rr=new VF.StaveNote({clef:clefDe(ni),keys:[clefDe(ni)==='bass'?'d/3':'b/4'],duration:durBase(n.dur)+'r'}); for(var dr=0;dr<durDots(n.dur);dr++) VF.Dot.buildAndAttach([rr]);
            if(n._art && n._art.indexOf('~')>=0){ try{ var fr=new VF.Articulation('a@a'); fr.setPosition(VF.ModifierPosition.ABOVE); rr.addModifier(fr,0); }catch(e){} }
            vfDe[lb.c+'.'+ni]=rr; return rr; }
          var x2 = (typeof RHYTHM_XHEADS!=='undefined' && RHYTHM_XHEADS);
          var sn=new VF.StaveNote({clef:clefDe(ni),keys:[x2?(n.key+'/x2'):n.key],duration:durBase(n.dur),stem_direction:sd||1,auto_stem:!sd});
          for(var di=0;di<durDots(n.dur);di++) VF.Dot.buildAndAttach([sn]);
          if(n._art){ var pos=(sd||1)===1?VF.ModifierPosition.BELOW:VF.ModifierPosition.ABOVE;
            [['-','a-'],['!','a.'],['>','a>'],["'",'av'],['^','a^']].forEach(function(z){ if(n._art.indexOf(z[0])>=0){ try{ var ar=new VF.Articulation(z[1]); ar.setPosition(pos); sn.addModifier(ar,0); }catch(e){} } });
            if(n._art.indexOf('~')>=0){ try{ var fe=new VF.Articulation('a@a'); fe.setPosition(VF.ModifierPosition.ABOVE); sn.addModifier(fe,0); }catch(e){} } }
          if(!x2){ var mm=String(n.key).match(/^([a-g])(#|b)?\/(\d)/); if(mm){ var kk=mm[1]+mm[3], want=mm[2]||'n', inKey=(KEY_ACCIDENTALS[ph.keysig]||{})[mm[1]]||'n';
            var cur=(kk in acc)?acc[kk]:inKey; acc[kk]=want; var prec=(J.precauciones||[]).some(function(t){ return String(t).split(/\s+/)[0]===lb.c+'.'+(ni+1); }); if(want!==cur || prec) sn.addModifier(new VF.Accidental(want),0); } }
          vfDe[lb.c+'.'+ni]=sn; return sn; });
        var beams=(m.beams||[]).map(function(g){ return new VF.Beam(g.map(function(k){ return vf[k]; }),false); });
        var tups=(m.tuplets||[]).map(function(t,ti){ var tl=(J._tres||[]).filter(function(x){ return x.c===lb.c; })[ti]||{};
          try{ var op={num_notes:t.group.ratioNum,notes_occupied:t.group.ratioDen,ratioed:!!tl.ratio}; if(tl.abajo || (!tl.arriba && (lb.stems[t.idx[0]]||1)===-1)) op.location=-1; if(tl.cifra===false){ op.bracketed=false; } var tu=new VF.Tuplet(t.idx.map(function(k){ return vf[k]; }),op); if(tl.cifra===false){ tu.draw=function(){}; } return tu; }catch(e){ return null; } }).filter(Boolean);
        var voice=voiceOf(m); if(cdz && vf[cdz.n-1]){ var tk=vf.slice(); try{ tk.splice(cdz.n-1,0,new VF.ClefNote(cdz.clave,'small')); }catch(e){} voice.addTickables(tk); } else voice.addTickables(vf);
        /* como en el libro: tras la última figura queda el aire de lo que dura (una corchea con puntillo deja más hueco) */
        var _d=measureNoteBeats(m), _cap=meterCapQ(m.time), _ult=_d[_d.length-1]||0;
        var izq=stave.getNoteStartX()-x; var bruto=w-izq; var ancho=bruto-Math.max(U(18), (lb.aire!=null)?bruto*lb.aire:bruto*(_ult/_cap)*0.55);
        new VF.Formatter().joinVoices([voice]).format([voice],Math.max(40,ancho));
        voice.draw(ctx,stave); if(cdz) ph._claveAct=cdz.clave;
        beams.forEach(function(b){ b.setContext(ctx).draw(); });
        tups.forEach(function(t){ try{ t.setContext(ctx).draw(); }catch(e){} });
        (J._uni||[]).forEach(function(u){ if(u.c1===lb.c && u.c2===lb.c && vf[u.n1] && vf[u.n2]){ try{ var tdir=(u.arriba!=null && u.abajo)?1:(u.arriba?-1:((lb.stems[u.n1]||1)===1?1:-1)); new VF.StaveTie({first_note:vf[u.n1],last_note:vf[u.n2],first_indices:[0],last_indices:[0]}).setDirection(tdir).setContext(ctx).draw(); }catch(e){} } });
        try{ if(typeof drawPulseTicks==='function' && !m.groupInfo) drawPulseTicks(ctx,m,vf,stave); }catch(e){}
        m.notes.forEach(function(n,k){ if(n.rest) return; var sn=vf[k]; var cx=stave.getNoteStartX(), cy=yTop+60, rad=8;
          try{ var bx=sn.getNoteHeadBeginX(), ex=sn.getNoteHeadEndX(); cx=(bx+ex)/2; var ys=sn.getYs(); if(ys&&ys.length) cy=ys[0]; rad=Math.max(7,(ex-bx)/2+2.5); }catch(e){}
          XHEAD_POS.push({cx:cx,cy:cy,rad:rad}); });
      });
      var sigS=J.sistemas[si+1], sigClave=sigS?(sigS.clave||J.clave||'treble'):null;
      if(sigS && sigClave!==(ph._claveAct||ph.clef)){ try{ var ulS=estaves[sis.compases[sis.compases.length-1]]; var gl={treble:'gClef',bass:'fClef'}[sigClave];
        if(ulS && gl){ var gx=ulS.getX()+ulS.getWidth()-U(34); var gy=sigClave==='bass'?ulS.getYForLine(1):ulS.getYForLine(3); VF.Glyph.renderGlyph(ctx,gx,gy,30,gl,{category:'clefNote'}); } }catch(e){} }
      /* compás de cortesía tras la doble barra (como en el libro: el pentagrama sigue hasta el margen) */
      if(sis.cortesia){
        var x1=U(sis.barras[sis.barras.length-1]), x2=U(sis.cortesia.x1);
        var cst=new VF.Stave(x1,yTop,x2-x1,{left_bar:false}); cst.setBegBarType(VF.Barline.type.NONE); cst.setEndBarType(VF.Barline.type.NONE);
        var cc=compasDe(sis.cortesia.compas);
        cst.addTimeSignature(cc.simbolo||(cc.num+'/'+cc.den)); cst.setContext(ctx).draw();
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
      try{ var st=nn.getStave(), x=nn.getNoteHeadBeginX(), y=Math.min(st.getYForLine(4)+U(38), Math.max.apply(null,nn.getYs())+U(30)); y=Math.max(y, st.getYForLine(4)+U(30)); if(P && P.alto) y=Math.min(y,U(P.alto)-U(6)); ctx.save(); ctx.setFont('"Times New Roman", Times, serif', U(21).toFixed(2)+'px','bold','italic'); ctx.fillText(m[3],x-U(4),y); ctx.restore(); }catch(e){} });
    /* ligaduras de expresión */
    (L._lig||[]).forEach(function(g){ var a=vfDe[g.c1+'.'+g.n1], b=vfDe[g.c2+'.'+g.n2]; if(!a||!b) return;
      var sa=a.getStave(), sb=b.getStave();
      if(sa && sb && Math.abs(sa.getY()-sb.getY())>1){ ligaduraPartida(ctx,a,b,g.arriba,S,estaves,L); } else ligadura(ctx,a,b,g.arriba,S); });
    /* corchetes discontinuos bajo grupos de notas (como en el libro) */
    (L._cor||[]).forEach(function(g){ var a=vfDe[g.c1+'.'+g.n1], b=vfDe[g.c2+'.'+g.n2]; if(!a||!b) return;
      try{ var x0=a.getNoteHeadBeginX()-U(4), x1=b.getNoteHeadEndX()+U(4), yb=0;
        [a,b].forEach(function(n){ var e=n.getStemExtents?n.getStemExtents():null; var ys=n.getYs(); yb=Math.max(yb, ys[0]+U(14), e?Math.max(e.baseY,e.topY)+U(6):0); });
        var st=a.getStave(); yb=Math.max(yb, st.getYForLine(4)+U(22));
        if(g.arriba){ yb=1e9; [a,b].forEach(function(n){ var e=n.getStemExtents?n.getStemExtents():null; var ys=n.getYs(); yb=Math.min(yb, ys[0]-U(14), e?Math.min(e.baseY,e.topY)-U(6):1e9); }); yb=Math.min(yb, st.getYForLine(0)-U(22)); }
        ctx.save(); ctx.setStrokeStyle('#111'); ctx.setLineWidth(U(1.6)); try{ ctx.setLineDash([U(9),U(7)]); }catch(e){}
        ctx.beginPath(); ctx.moveTo(x0,yb); ctx.lineTo(x1,yb); ctx.stroke(); try{ ctx.setLineDash([]); }catch(e){}
        var gch=g.arriba?U(7):-U(7); ctx.beginPath(); ctx.moveTo(x0,yb+gch); ctx.lineTo(x0,yb); ctx.moveTo(x1,yb+gch); ctx.lineTo(x1,yb); ctx.stroke(); ctx.restore(); }catch(e){} });
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
  function mide(txt,size,fam,peso){ try{ if(!_cv) _cv=document.createElement('canvas').getContext('2d'); _cv.font=(peso||'')+' '+size+'px '+fam; return _cv.measureText(txt).width; }catch(e){ return txt.length*size*0.5; } }
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

  /* el texto del libro no puede pasar de su sitio aunque la fuente del equipo sea más ancha (se revisa también cuando cargan las fuentes) */
  function ajustaTexto(el){ try{ var w=+el.getAttribute('data-libro-w'), T=+el.getAttribute('data-libro-t'); if(!w||!T||!el.getBBox) return;
      el.style.fontSize=T.toFixed(2)+'px'; var bw=el.getBBox().width; if(bw>w*1.01){ el.style.fontSize=(T*w/bw).toFixed(2)+'px'; } }catch(e){} }
  function ajustaTextos(){ Array.prototype.forEach.call(document.querySelectorAll('#score text[data-libro-w]'),ajustaTexto); }
  try{ if(document.fonts && document.fonts.ready) document.fonts.ready.then(ajustaTextos); }catch(e){}
  window.addEventListener('load',function(){ setTimeout(ajustaTextos,300); setTimeout(ajustaTextos,1500); });
  function notaLibro(ctx, nb, U){
    ctx.save(); ctx.setFillStyle('#2b2b2b'); ctx.setStrokeStyle('#2b2b2b');
    var F='"Helvetica Neue", Helvetica, Arial, sans-serif';
    nb.lineas.forEach(function(li){
      var piezasDe=function(T){ return li.partes.map(function(p){
        var pe=li.negrita?'bold':''; if(typeof p==='string') return {t:p, w:mide(p,T,F,pe)};
        if(p.it) return {t:p.it, it:true, w:mide(p.it,T,F,'italic '+pe)};
        if(p.frac) return {frac:p.frac, apilada:!!p.apilada, w:(p.apilada?0.75:1.15)*T};
        if(p.figura) return {fig:p.figura, w:1.9*T}; return {t:'',w:0}; }); };
      var T=U(17), piezas=piezasDe(T), tot=piezas.reduce(function(a,p){ return a+p.w; },0);
      if(li.x0!=null && li.x1!=null && tot>0){ T=T*U(li.x1-li.x0)/tot; piezas=piezasDe(T); tot=U(li.x1-li.x0); }
      var x=(li.x0!=null)?U(li.x0):(li.alinear==='derecha'?U(li.x||0)-tot:U(li.x||0)), y=U(li.y||0), k=T/17;   /* k: px del libro → unidades a este tamaño */
      piezas.forEach(function(p){
        if(p.t!=null){ ctx.setFont(F,T.toFixed(2)+'px',li.negrita?'bold':'normal',p.it?'italic':'normal'); ctx.fillText(String(p.t).replace(/^ +| +$/g,function(m){ return m.replace(/ /g,'\u00a0'); }),x,y);
          try{ var el=ctx.parent&&ctx.parent.lastChild; if(el && el.tagName==='text'){ el.setAttribute('data-libro-w',p.w.toFixed(2)); el.setAttribute('data-libro-t',T.toFixed(2)); ajustaTexto(el); } }catch(e){} }
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
    (nb.rayas||[]).forEach(function(r){ ctx.setLineWidth(U(1.3)); ctx.beginPath(); ctx.moveTo(U(r[0]),U(r[2])); ctx.lineTo(U(r[1]),U(r[2])); ctx.stroke(); });
    /* figuras rítmicas sueltas (sin pentagrama): {figs:"8 16r 16 8", xs:[cabezas], y:línea de las cabezas, yb:altura de la barra} */
    (nb.ritmos||[]).forEach(function(r){ var f=String(r.figs).trim().split(/\s+/), y=U(r.y), yb=U(r.yb!=null?r.yb:r.y-41), sx=[], dur=[];
      var solo=f.filter(function(t){ return !/r$/.test(t); }).length===1;
      f.forEach(function(t,i){ var x=U(r.xs[i]), sil=/r$/.test(t), d=parseInt(t,10), pto=/\./.test(t); dur.push(sil?0:d);
        if(sil){ try{ VF.Glyph.renderGlyph(ctx,x-U(6),y-U(12),U(34),d===16?'rest16th':'rest8th',{category:'restNote'}); }catch(e){} sx.push(null); return; }
        ctx.beginPath(); for(var a=0;a<=24;a++){ var th=a/24*Math.PI*2, ex=U(6.4)*Math.cos(th), ey=U(4.6)*Math.sin(th), cr=Math.cos(-0.35), sr=Math.sin(-0.35), px=x+ex*cr-ey*sr, py=y+ex*sr+ey*cr; if(a===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); } ctx.closePath(); if(d===2||d===1){ ctx.setLineWidth(U(1.6)); ctx.stroke(); } else ctx.fill();
        if(pto){ ctx.beginPath(); ctx.arc(x+U(11),y,U(2),0,Math.PI*2); ctx.fill(); }
        if(d===1){ sx.push(null); return; }
        var stx=x+U(5.6); ctx.fillRect(stx-U(0.7),yb,U(1.4),y-yb-U(1)); sx.push(stx);
        if((solo || !f.every(function(t){ return /r$/.test(t) || parseInt(t,10)>=8; })) && d>=8){ for(var fl=0; fl<(d===16?2:1); fl++){ var fy=yb+fl*U(7); ctx.beginPath(); ctx.moveTo(stx,fy); ctx.bezierCurveTo(stx+U(2),fy+U(9),stx+U(11),fy+U(11),stx+U(8),fy+U(22)); ctx.bezierCurveTo(stx+U(9),fy+U(13),stx+U(3),fy+U(11),stx,fy+U(5)); ctx.fill(); } } });
      if(solo) dur=dur.map(function(){ return 0; });
      var vis=sx.filter(function(v){ return v!=null; }), conBarra=f.every(function(t){ return /r$/.test(t) || parseInt(t,10)>=8; }); if(vis.length>1 && conBarra) ctx.fillRect(vis[0]-U(0.7),yb,vis[vis.length-1]-vis[0]+U(1.4),U(4.2));
      for(var i=0;i<f.length;i++){ if(dur[i]!==16) continue; var j=i; while(j+1<f.length && dur[j+1]===16) j++;
        var y2=yb+U(7.5); if(j>i) ctx.fillRect(sx[i]-U(0.7),y2,sx[j]-sx[i]+U(1.4),U(4.2)); else ctx.fillRect(sx[i]-U(9),y2,U(9.7),U(4.2)); i=j; } });
    if(nb.flecha){ var f=nb.flecha.map(U); ctx.setLineWidth(U(1.2)); ctx.beginPath(); ctx.moveTo(f[0],f[1]); ctx.lineTo(f[2],f[3]); ctx.stroke();
      var ang=Math.atan2(f[3]-f[1],f[2]-f[0]), L2=U(13);
      ctx.beginPath(); ctx.moveTo(f[2]-L2*Math.cos(ang-0.38),f[3]-L2*Math.sin(ang-0.38)); ctx.lineTo(f[2],f[3]); ctx.lineTo(f[2]-L2*Math.cos(ang+0.38),f[3]-L2*Math.sin(ang+0.38)); ctx.stroke(); }
    ctx.restore();
  }

  /* ---------------- 4. ENGANCHE CON LA APP ---------------- */
  var _render=window.renderLesson;
  window.renderLesson=function(container,L){ if(L && L.libro){ var r=dibujaLibro(container,L); try{ requestAnimationFrame(ajustaTextos); setTimeout(ajustaTextos,400); }catch(e){} return r; } return _render.apply(this,arguments); };
  var LEC=null;
  var _gen=window.generateLesson;
  window.generateLesson=function(){ if(LEC){ if(typeof studyMode!=='undefined' && studyMode) closeStudy(); currentLesson=LEC; renderCurrent(); return; } return _gen.apply(this,arguments); };

  function botonOriginal(J){
    var b=document.createElement('button'); b.className='libro-orig-btn'; b.setAttribute('data-tip','Mantén pulsado para ver la lección en el libro'); b.title='';
    b.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>';
    /* (20-nov 13:01, Iago) se ve MIENTRAS se mantiene pulsado; al soltar, vuelve la lección */
    var ov=null;
    function ver(e){ try{ e.preventDefault(); if(e.pointerId!=null && b.setPointerCapture) b.setPointerCapture(e.pointerId); }catch(x){} if(ov) return;
      ov=document.createElement('div'); ov.className='libro-orig'; ov.innerHTML='<img alt="Lección '+J.n+' en el libro" src="'+J.captura+'">'; document.body.appendChild(ov); b.classList.add('on'); }
    function quitar(){ if(ov){ ov.remove(); ov=null; } b.classList.remove('on'); }
    b.addEventListener('pointerdown',ver); ['pointerup','pointercancel','lostpointercapture'].forEach(function(ev){ b.addEventListener(ev,quitar); });
    b.addEventListener('contextmenu',function(e){ e.preventDefault(); });
    b.addEventListener('keydown',function(e){ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); ver(e); } }); b.addEventListener('keyup',quitar); b.addEventListener('blur',quitar);
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
   +'.cv .cv-f.cv-dest{border:1.5px solid #f59e0b;background:rgba(245,158,11,.12)}.cv .cv-dest .cv-tx{font-size:14.5px;color:#fde68a}.cv .cv-dest .cv-tx b{color:#fff}'
   +'.cv .cv-mano{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:10px;background:rgba(245,158,11,.18);color:#fbbf24}'
   +'.rp-cartel .phase-banner.cv{border-color:var(--cvc)!important;box-shadow:inset 4px 0 0 var(--cvc)!important;background:rgba(10,16,28,.96)!important}'
   +'.rp-cartel .phase-banner.cv .pb-t{color:#fff!important}.rp-cartel .phase-banner.cv .pb-k{color:var(--cvc)!important}'
   +'.rp-cartel .phase-banner.cv .pb-go{background:var(--cvc)!important;color:#fff!important;box-shadow:none!important;border:0!important}'
   +'.rp-cartel .phase-banner.cv-ritmo{--cvc:#16a34a}.rp-cartel .phase-banner.cv-ent{--cvc:#2563eb}'
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
  var CARTELES_VISUALES=true;    /* (20-nov) se enciende cuando Iago dé el visto bueno; para verlos antes: &cv=1 */
  function cvFila(v,t){ return '<div class="cv-f"><div class="cv-v">'+v+'</div><div class="cv-tx">'+t+'</div></div>'; }
  var CV_VEL='Abajo, en la barra de <b>Velocidad</b>, vas <b>más lento</b> o <b>más rápido</b>. La que elijas se mantiene hasta el final, salvo que la cambies.';
  function cvContenido(tipo){
    var tactil=false; try{ tactil=isTouchDevice(); }catch(e){}
    var notas='Tus <b>anotaciones</b> siguen ahí, y se <b>guardan en este dispositivo</b> para otro día.';
    if(tipo==='ritmo') return {lead:'<b>Percute</b> el ritmo de la lección. <b>Aquí no hay tiempo</b>: pasa a la siguiente fase cuando quieras.', filas:[
      cvFila(tactil?'<span class="cv-pad"></span><span class="cv-pad"></span>':'<span class="cv-key">espacio</span>', tactil?'Toca el ritmo con los <b>pads verdes</b> (abajo, a los lados). Si mantienes el dedo, el sonido se mantiene.':'Toca el ritmo con la <b>barra espaciadora</b>. Si la mantienes pulsada, el sonido se mantiene.'),
      cvFila(cvPentagrama(['#111','#16a34a','#111','#111']), 'Las figuras y los silencios <b>se iluminan</b> al sonar. Por defecto suena la <b>subdivisión en corcheas</b>.'),
      cvFila(cvAnotar(), 'Con las <b>columnas de los lados</b> anotas en la partitura: escribir, subrayar, '+(GE?'':'patrones △/U, ')+'alertas e <b>intervalos</b>. Lo que escribas se queda en las <b>fases siguientes</b> y en <b>este dispositivo</b> para otro día.'),
      cvFila('<span class="cv-b" style="background:#16a34a;border-color:#16a34a;color:#fff">1. Percusión</span><span class="cv-b">2</span><span class="cv-b">3</span><span class="cv-b">4</span>', 'Pasas de una fase a otra pulsando los <b>números</b> de arriba, cuando quieras.'),
      cvFila(cvVelocidad(), CV_VEL)]};
    if(tipo==='lectura'){ var f=[
      '<div class="cv-f cv-dest"><div class="cv-v"><span class="cv-mano"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/></svg></span></div><div class="cv-tx">'
        +(GE?'Recuerda usar el <b>pulso con la mano</b> cada vez que practiques.':'Recuerda utilizar <b>la mano</b>, ya sea marcando <b>subdivisión</b> o <b>pulso</b>, según cómo trabajemos en clase cada dificultad.')+'</div></div>',
      cvFila(cvPentagrama(['#111','#111','#111','#111'])+'<span class="cv-ok" style="color:#4ade80">do · mi · re…</span>', 'Ponle <b>nombre a las notas</b> que percutías: <b>solfeando, sin cantar</b>.'),
      cvFila('<span class="cv-b" style="border-color:rgba(34,197,94,.6);background:#0f2a1c">♩ pulso</span>', 'Aquí no suena la subdivisión: <b>solo el pulso</b>.')];
      var disp=false; try{ disp=!GE && rpTieneDispares(); }catch(e){}
      if(disp) f.push(cvFila('<span class="cv-b" style="border-color:rgba(34,197,94,.6);background:#0f2a1c">△ U</span><span class="cv-b" style="border-color:rgba(34,197,94,.6);background:#0f2a1c">Revelar patrón</span>', 'Si te atascas con los compases dispares, pulsa <b>Revelar patrón</b>: verás cada pulso de 3 corcheas (△) y de 2 (U).'));
      f.push(cvFila(cvAnotar(), notas)); f.push(cvFila(cvVelocidad(), CV_VEL));
      return {lead:'Lee la lección <b>con la mano</b>. <b>Aquí no hay tiempo</b>: pasa a la siguiente fase cuando quieras.', filas:f}; }
    if(tipo==='entonacion') return {lead:(GE?'Esta fase es <b>opcional</b>. ':'')+'Practica la <b>entonación</b>, sin prisa: <b>aquí no hay tiempo</b>. El <b>micrófono</b> llega en la realización final.', filas:[
      cvFila('<span class="cv-seg"><span>Tónica</span><span>Escala</span><span>Arpegio</span></span>', 'Pulsa <b>Tónica</b>, <b>Escala</b> o <b>Arpegio</b> cuando quieras para situar el oído.'),
      cvFila('<span class="cv-b">Pistas<i>3</i></span>'+cvPentagrama(['#111','#2563eb','#111'],{altos:[1,3,2]}), 'Pulsa <b>Pistas</b>: <b>todas las notas parpadean</b>. Toca hasta <b>3</b>: se quedan en <b>azul</b> y suenan <b>siempre que las pulses</b>.'),
      cvFila('<span class="cv-seg"><span>Sin ayuda</span><span class="on">Pentagrama</span><span>Compás</span></span><span class="cv-b az sq">▶</span>', 'Arriba eliges la <b>ayuda del piano</b>: sin ayuda, la primera nota de <b>cada pentagrama</b> o la de <b>cada compás</b> (se ven en <b>azul</b>). Con <b>▶</b> suenan el <b>acompañamiento</b> y esa ayuda. Pasas de fase con los <b>números</b> de arriba.'),
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
    card.classList.add('cv', (tipo==='ritmo'||tipo==='lectura')?'cv-ritmo':'cv-ent');
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

  /* ================= (20-nov 13:02–13:07, Iago) AJUSTES DEL ESTUDIO EN EL VISOR =================
     · percusión SIN valoración (ni «Casi», ni 2.ª ronda sin verde)  · se cambia de fase pulsando 1·2·3·4 (sin «Pasar a la siguiente fase»)
     · al acabar una vuelta de la fase 2: ¿qué tal ha ido? (solo para ti) + dificultad 0–10 (Tester/Protester) + otra vez / entonación
     · dificultad: sin botón; se pide al pasar a la fase 3 y el número queda arriba · claqueta: en 9/8 no hay golpe de más
     · intervalos: trazo recto */
  var DIF=null, CARA=null;
  var CARAS=[['😣','Fatal'],['🙁','Regular tirando a mal'],['😐','Regular'],['🙂','Bien'],['😄','Muy bien']];
  var AJ_CSS='.rp-ayudasel.lb-arriba{margin-right:8px;align-items:center}.rp-ayudasel.lb-arriba .seg-l{display:inline-block!important;font:400 12px/1.1 "Helvetica Neue",Arial,sans-serif!important;color:rgba(255,255,255,.6)!important;margin-right:8px;text-transform:none!important;letter-spacing:0!important;max-width:60px;white-space:normal}'
    +'@media (max-width:1280px){.rp-ayudasel.lb-arriba .seg-l{display:none!important}#phaseTop .rp-ayudasel .rp-ay,#rpEntTools button{padding:0 9px!important;font-size:12.5px!important}.lb-resumen{margin-left:8px}}'
    +'@media (max-height:760px){#rpAnotBar .rpv-col-in{gap:3px!important}#rpAnotBar .rpv-b{height:34px!important;min-height:34px!important}}@media (max-height:640px){#rpAnotBar .rpv-b{height:29px!important;min-height:29px!important;font-size:11px!important}}'
    +'html body.libro-modo{overflow-x:hidden}'
    +'.lb-resumen{display:inline-flex;align-items:center;gap:6px;margin-left:14px;font:400 13px/1 "Helvetica Neue",Arial,sans-serif;color:rgba(255,255,255,.78);cursor:pointer;white-space:nowrap}.lb-resumen b{color:#fff;font-weight:800}.lb-resumen .cara{font-size:18px}#rpEntTools{margin-right:8px}#phaseNextTop{display:none!important}#rpDif{display:none!important}'
    +'#phaseSteps .rp-paso{cursor:pointer}#phaseSteps .rp-paso:hover{filter:brightness(1.25)}'
    +'.lb-dif-chip{display:inline-flex;align-items:center;gap:7px;height:40px;box-sizing:border-box;padding:0 13px;border-radius:10px;border:1px solid rgba(255,255,255,.35);color:#fff;font:800 14px/1 "Helvetica Neue",Helvetica,Arial,sans-serif;margin-right:8px;cursor:pointer;background:transparent}'
    +'.lb-fin{position:fixed;inset:0;z-index:2147480001;display:flex;align-items:center;justify-content:center;background:rgba(6,10,18,.82);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}'
    +'.lb-fin .c{width:min(600px,92vw);box-sizing:border-box;padding:22px 24px;border-radius:14px;background:rgba(10,16,28,.97);border:1px solid var(--lbc,#16a34a);box-shadow:inset 4px 0 0 var(--lbc,#16a34a),0 18px 60px rgba(0,0,0,.5);color:#e2e8f0;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}'
    +'.lb-fin .k{margin:0 0 4px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--lbc,#16a34a)}.lb-fin .t{margin:0 0 14px;font-size:21px;font-weight:800;color:#fff}'
    +'.lb-fin .sec{margin:0 0 16px}.lb-fin .lab{font-size:13px;color:#cbd5e1;margin:0 0 8px}.lb-fin .lab b{color:#fff}'
    +'.lb-fin .caras{display:flex;gap:8px}.lb-fin .caras button{flex:1;height:52px;font-size:26px;border-radius:10px;border:1px solid rgba(148,163,184,.3);background:rgba(15,23,42,.6);cursor:pointer}'
    +'.lb-fin .caras button.on{border-color:var(--lbc,#16a34a);background:rgba(22,163,74,.22)}'
    +'.lb-fin .esc{display:grid;grid-template-columns:repeat(11,1fr);gap:5px}.lb-fin .esc button{height:36px;border-radius:8px;border:1px solid rgba(148,163,184,.3);background:rgba(15,23,42,.6);color:#fff;font:700 14px/1 inherit;cursor:pointer}'
    +'.lb-fin .esc button.on{background:var(--lbc,#16a34a);border-color:var(--lbc,#16a34a)}.lb-fin .ley{display:flex;justify-content:space-between;font-size:11px;color:#94a3b8;margin-top:5px}'
    +'.lb-fin .lb-res .score{font-size:46px;font-weight:900;margin:0 0 6px;color:#fff}.lb-fin .lb-res .score.good{color:#22c55e}.lb-fin .lb-res .score.mid{color:#f59e0b}.lb-fin .lb-res .score.low{color:#ef4444}.lb-fin .lb-res p{margin:0 0 6px;font-size:13.5px;line-height:1.45;color:#cbd5e1}.lb-fin .lb-res .rp-estim{font-size:12px;color:#94a3b8}'
    +'.lb-fin .acc{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:6px}.lb-fin .acc button{height:42px;padding:0 18px;border-radius:10px;font:800 14px/1 inherit;cursor:pointer}'
    +'.lb-fin .b2{background:transparent;border:1px solid rgba(255,255,255,.35);color:#fff}.lb-fin .b1{background:#2563eb;border:0;color:#fff}.lb-fin .b1.verde{background:#16a34a}';
  function esTester(){ try{ return typeof rpEsTesterCuenta==='function' && rpEsTesterCuenta(); }catch(e){ return false; } }
  function difChip(){ var ch0=document.getElementById('lbDifChip'); if(ch0) ch0.remove(); return;   /* (13:08, Iago) arriba nada de dificultad: se pregunta antes de la fase 3 y al final */
    var cl=document.getElementById('phaseClose'); var ch=document.getElementById('lbDifChip');
    if(DIF==null || !studyMode || !cl){ if(ch) ch.remove(); return; }
    if(!ch){ ch=document.createElement('button'); ch.type='button'; ch.id='lbDifChip'; ch.className='lb-dif-chip'; ch.title='Dificultad que marcaste (solo en pantalla, no se guarda). Pulsa para cambiarla.'; ch.onclick=function(){ abreFin({soloDif:true}); }; }
    ch.innerHTML=(typeof RP_DIF_ICO!=='undefined'?RP_DIF_ICO:'')+'<span>Dificultad '+DIF+'</span>';
    if(ch.nextSibling!==cl) cl.parentNode.insertBefore(ch,cl); }
  /* (13:32, Iago) arriba, en el hueco tras los números: lo que marcaste (dificultad y carita), discreto */
  function resumen(){ var cont=document.getElementById('phaseSteps'); if(!cont) return; var r=document.getElementById('lbResumen');
    if(DIF==null && CARA==null){ if(r) r.remove(); return; }
    if(!r){ r=document.createElement('span'); r.id='lbResumen'; r.className='lb-resumen'; }
    r.innerHTML=(DIF!=null?'Dificultad <b>'+DIF+'</b>':'')+(DIF!=null&&CARA!=null?' · ':'')+(CARA!=null?'<span class="cara" title="'+CARAS[CARA][1]+'">'+CARAS[CARA][0]+'</span>':'');
    r.title='Lo que marcaste (solo en pantalla, no se guarda). Púlsalo para cambiarlo.'; r.onclick=function(){ abreFin({soloDif:true}); };
    if(r.parentNode!==cont || r!==cont.lastChild) cont.appendChild(r); }
  function irAFase(i){ try{ stopPlayer(); }catch(e){}
    if(i>=phaseList.length){ if(typeof rpEntrarPrueba==='function') rpEntrarPrueba('fases'); return; }
    if(typeof PR!=='undefined' && PR.on && typeof rpSalirPrueba==='function') rpSalirPrueba();
    phaseIdx=i; showPhase(); }
  /* tarjeta: fin de vuelta (fase 2) o solo dificultad (al pasar a la 3) */
  function abreFin(op){ op=op||{}; document.querySelectorAll('.lb-fin').forEach(function(x){ x.remove(); });
    var tester=esTester();
    var sc=document.createElement('div'); sc.className='lb-fin'; var c=document.createElement('div'); c.className='c'; if(op.final) sc.style.setProperty('--lbc','#2563eb');
    var h='<p class="k">'+(op.soloDif?'Antes de la entonación':op.final?'Realización final':'Fase 2 · Ritmo con la mano')+'</p><p class="t">'+(op.final?'Tu resultado':'¿Qué tal ha ido?')+'</p>';
    if(op.final && op.res) h+='<div class="sec lb-res">'+op.res.pct+op.res.txt+'</div>';
    if(!op.final) h+='<div class="sec"><p class="lab">Elige tu carita: <b>solo la ves tú</b>, no se guarda.</p><div class="caras">'+CARAS.map(function(x,i){ return '<button type="button" data-i="'+i+'" title="'+x[1]+'" class="'+(CARA===i?'on':'')+'">'+x[0]+'</button>'; }).join('')+'</div></div>';
    if(tester) h+='<div class="sec"><p class="lab">Dificultad de la lección, de <b>0</b> a <b>10</b> (solo en pantalla, no se guarda)</p><div class="esc">'+[0,1,2,3,4,5,6,7,8,9,10].map(function(i){ return '<button type="button" data-d="'+i+'" class="'+(DIF===i?'on':'')+'">'+i+'</button>'; }).join('')+'</div><div class="ley"><span>muy fácil</span><span>intermedio</span><span>muy difícil</span></div></div>';
    var ent=(phaseList[2]&&phaseList[2].kind==='entonacion');
    h+='<div class="acc">'+(op.soloDif?'<button type="button" class="b1" data-a="seguir">Seguir</button>'
        :op.final?'<button type="button" class="b2" data-a="ver">Ver la partitura</button><button type="button" class="b1" data-a="repetir">↻ Repetir</button>'
        :'<button type="button" class="b2" data-a="otra">↻ Otra vez</button>'+(ent?'<button type="button" class="b1" data-a="ent">Pasar a la entonación'+(GE?' · opcional':'')+'</button>':''))+'</div>';
    if(!op.soloDif && !op.final) h='<p class="lab" style="margin:-6px 0 14px">Hazlo <b>otra vez</b> si quieres, o pasa a la <b>entonación</b>'+(GE?', que es <b>opcional</b>':'')+'.</p>'.replace(/^/,'')+h.replace(/^([\s\S]*?<\/p><p class="t">[\s\S]*?<\/p>)/,'$1');
    c.innerHTML=h;
    /* el texto «Hazlo otra vez…» va justo debajo del título */
    if(!op.soloDif && !op.final){ var t=c.querySelector('.t'), l=c.querySelector('p.lab'); if(t&&l) t.parentNode.insertBefore(l,t.nextSibling); }
    c.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return;
      if(b.dataset.i!=null){ CARA=+b.dataset.i; c.querySelectorAll('.caras button').forEach(function(x){ x.classList.toggle('on',x===b); }); resumen(); return; }
      if(b.dataset.d!=null){ DIF=+b.dataset.d; try{ rpDifPulsado=true; }catch(x){} c.querySelectorAll('.esc button').forEach(function(x){ x.classList.toggle('on',x===b); }); difChip(); resumen(); if(op.soloDif && op.cerrarAlElegir){ sc.remove(); if(op.luego) op.luego(); } return; }
      var a=b.dataset.a; sc.remove();
      if(a==='repetir'){ try{ if(typeof rpEmpezar==='function') rpEmpezar(); }catch(x){} }
      if(a==='otra'){ try{ if(typeof phasePlay==='function') phasePlay(); }catch(x){} }
      if(a==='ent'){ irAFase(2); }
      if(a==='seguir' && op.luego) op.luego(); });
    sc.appendChild(c); document.body.appendChild(sc); }
  function ajustesEstudio(){
    var st=document.createElement('style'); st.textContent=AJ_CSS; document.head.appendChild(st);
    /* percusión sin valoración ni 2.ª ronda */
    if(typeof window.showTapFeedback==='function') window.showTapFeedback=function(){ try{ tapRound=1; }catch(e){} };
    /* dificultad: sin botón */
    if(typeof window.rpDifBtn==='function'){ window.rpDifBtn=function(){ var b=document.getElementById('rpDif'); if(b) b.remove(); difChip(); }; }
    if(typeof window.rpDifAbrir==='function'){ window.rpDifAbrir=function(){ abreFin({soloDif:true}); }; }
    /* fases: los números se pulsan */
    if(typeof window.renderPhaseSteps==='function'){ var _r=window.renderPhaseSteps; window.renderPhaseSteps=function(){ _r.apply(this,arguments);
        Array.prototype.forEach.call(document.querySelectorAll('#phaseSteps .rp-paso'),function(b,i){ b.setAttribute('role','button'); b.tabIndex=0;
          b.onclick=function(){ var cur=(typeof PR!=='undefined'&&PR.on)?phaseList.length:phaseIdx; if(i===cur) return;
            if(i>=2 && cur<2 && ((DIF==null && esTester()) || CARA==null)){ abreFin({soloDif:true, luego:function(){ irAFase(i); }}); return; }
            irAFase(i); }; });
        difChip(); resumen(); }; }
    if(typeof window.nextPhase==='function'){ var _n=window.nextPhase; window.nextPhase=function(){ var cur=phaseIdx;
        if(cur===1 && ((DIF==null && esTester()) || CARA==null) && !(typeof PR!=='undefined'&&PR.on)){ abreFin({soloDif:true, luego:function(){ _n(); }}); return; } return _n.apply(this,arguments); }; }
    /* fin de una vuelta en la fase 2 */
    if(typeof window.play==='function'){ var _p=window.play; window.play=function(opts){
        try{ var ph=studyMode && phaseList[phaseIdx]; if(ph && ph.kind==='lectura' && opts && !(typeof PR!=='undefined'&&PR.on)){ var oe=opts.onEnd; opts.onEnd=function(){ if(oe) oe.apply(this,arguments); setTimeout(function(){ if(studyMode && phaseList[phaseIdx] && phaseList[phaseIdx].kind==='lectura') abreFin({}); },350); }; } }catch(e){}
        return _p.apply(this,arguments); }; }
    /* claqueta en 9/8, 6/8…: solo los pulsos (sin el golpe de más que corresponde al compás fraccionario) */
    if(typeof window.subClicks==='function'){ var _sc=window.subClicks; window.subClicks=function(sched){ var out=_sc.apply(this,arguments);
        try{ if(subStepQ()!=null || !sched || !sched.measInfo) return out;
          var quitar=[]; sched.measInfo.forEach(function(mm){ if(mm.noMeter) return; var frac=Math.abs(mm.cap*2-Math.round(mm.cap*2))>1e-6; if(frac) return;
            out.forEach(function(o){ if(o.sub && o.q>=mm.q-1e-6 && o.q<mm.q+mm.cap-1e-6) quitar.push(o); }); });
          if(quitar.length) out=out.filter(function(o){ return quitar.indexOf(o)<0; }); }catch(e){}
        return out; }; }
    /* fase 3: arriba, de izquierda a derecha, ayuda del piano · Pistas · Tónica/Escala/Arpegio · ▶ */
    if(typeof window.showPhase==='function'){ var _sp=window.showPhase; window.showPhase=function(){ var r=_sp.apply(this,arguments);
        try{ var ph=phaseList[phaseIdx]; if(studyMode && ph && ph.kind==='entonacion' && !(typeof PR!=='undefined'&&PR.on)){ var top=document.getElementById('phaseTop'), play=document.getElementById('phasePlayTop'),
            ay=document.querySelector('#phaseControls .rp-ayudasel'), et=document.getElementById('rpEntTools');
          if(top && play){ Array.prototype.forEach.call(top.querySelectorAll('.rp-ayudasel'),function(x){ if(x!==ay) x.remove(); }); if(ay){ ay.classList.add('lb-arriba'); top.insertBefore(ay,play); } if(et){ var pi=et.querySelector('.rp-pistas'), oi=et.querySelector('.rp-oido'); if(pi&&oi) et.insertBefore(pi,oi); top.insertBefore(et,play); } }
          if(typeof rpEncaja==='function') setTimeout(rpEncaja,0); } }catch(e){}
        difChip(); return r; }; }
    /* al acabar la realización final: una sola ventana con la carita y la dificultad */
    if(typeof window.rpFin==='function'){ var _rf=window.rpFin; window.rpFin=function(cortada,abandonada){ try{ rpDifPulsado=true; }catch(e){} var r=_rf.apply(this,arguments);
        /* (13:13, Iago) UNA sola ventana: el % (con su texto y la ayuda de piano) + la dificultad + volver a hacerlo */
        try{ var rc=document.querySelector('#phaseBannerHost .tap-fb.rp-res'); if(rc && !abandonada){ var res={};
            var sc0=rc.querySelector('.score'); res.pct=sc0?sc0.outerHTML:''; var ps=rc.querySelectorAll('p'); res.txt=''; ps.forEach(function(p0){ if(!p0.classList.contains('fb-step')) res.txt+=p0.outerHTML; });
            rc.remove(); abreFin({final:true, res:res}); } }catch(e){}
        return r; }; }
    /* (13:32, Iago) el arpegio, con el mismo pulso que la escala: sin quedarse parado en la nota aguda */
    if(typeof window.rpOido==='function'){ var _ro=window.rpOido; window.rpOido=function(o){ if(o!=='a') return _ro.apply(this,arguments);
        try{ if(!currentLesson) return; stopPlayer(); ensurePiano(); var c=ac(); if(!c) return; var L=currentLesson, base=rpTonicaBase(), isMin=L.modo!=='mayor', st=0.4, t=c.currentTime+0.12;
          (isMin?[0,3,7,12,7,3,0]:[0,4,7,12,7,4,0]).forEach(function(x,i,arr){ pianoHit(base+x,t,(i===arr.length-1?st*1.6:st*0.9),0.12); t+=st; }); }catch(e){ return _ro.apply(this,arguments); } }; }
    /* intervalos: trazo recto (del punto de partida al de llegada) */
    document.addEventListener('pointermove',function(){ try{ var stt=RP_ANOT.get(currentLesson); if(!stt) return;
        Object.keys(stt.pages||{}).forEach(function(k){ var L=stt.pages[k].strokes||[], sk=L[L.length-1]; if(sk && sk.i && sk.p && sk.p.length>2) sk.p.splice(1, sk.p.length-2); }); }catch(e){} }, true);
    document.addEventListener('pointerup',function(){ setTimeout(function(){ try{ var stt=RP_ANOT.get(currentLesson); if(!stt) return; var cambio=false;
        Object.keys(stt.pages||{}).forEach(function(k){ (stt.pages[k].strokes||[]).forEach(function(sk){ if(sk.i && sk.p && sk.p.length>2){ sk.p.splice(1, sk.p.length-2); cambio=true; } }); });
        if(cambio && RP_ANOT_CTL && RP_ANOT_CTL.refit) RP_ANOT_CTL.refit(); }catch(e){} },0); }, true);
  }

  /* ================= (20-nov 13:11, Iago) OCTAVA ALTA / BAJA para anotar (para todos) =================
     Dos botones bajo las alertas. Toque = «8va↑» (o «8va↓»); pulsar y arrastrar = «8va↑» + línea discontinua horizontal
     hasta donde sueltes + «loco» en diagonal (vuelta a la normalidad). Se guarda con lo anotado (store.oct). */
  var OCT={on:null, ultimo:null};
  var OCT_CSS='.lb-oct-capa{position:absolute;inset:0;pointer-events:none;z-index:6}.lb-oct-capa span{position:absolute;white-space:nowrap;font-family:"Times New Roman",Times,serif;font-style:italic;font-weight:700;color:#0b3a8f;line-height:1}'
    +'.lb-oct-capa i{position:absolute;border-top:2px dashed #0b3a8f;height:0}.lb-oct-capa .loco{transform-origin:left bottom;transform:rotate(-32deg)}'
    +'#rpAnotBar .lb-oct{font:800 12px/1 "Helvetica Neue",Arial,sans-serif;color:#e2e8f0}#rpAnotBar .lb-oct.on{background:#16a34a!important;color:#fff}';
  function octStore(){ try{ var st=RP_ANOT.get(currentLesson); if(!st) return null; if(!st.oct) st.oct=[]; return st.oct; }catch(e){ return null; } }
  function octCapa(){ var sc=document.getElementById('score'); if(!sc) return null; if(getComputedStyle(sc).position==='static') sc.style.position='relative';
    var c=sc.querySelector(':scope > .lb-oct-capa'); if(!c){ c=document.createElement('div'); c.className='lb-oct-capa'; sc.appendChild(c); } return c; }
  function octPinta(prev){ var c=octCapa(), L=octStore(); if(!c||!L) return; var sc=document.getElementById('score'); var W=sc.clientWidth||1000, fs=Math.max(11,Math.min(22,W*0.016));
    var h=''; L.concat(prev?[prev]:[]).forEach(function(m){ var txt=m.t==='a'?'8va↑':'8va↓';
      h+='<span style="left:'+(m.x0*100)+'%;top:'+(m.y*100)+'%;font-size:'+fs+'px;transform:translateY(-50%)">'+txt+'</span>';
      if(m.x1!=null && m.x1>m.x0+0.005){ var xs=m.x0+(fs*2.6)/W; h+='<i style="left:'+(xs*100)+'%;width:'+Math.max(0,(m.x1-xs)*100)+'%;top:'+(m.y*100)+'%"></i>';
        if(!m.vivo) h+='<span class="loco" style="left:'+(m.x1*100)+'%;top:'+(m.y*100)+'%;font-size:'+(fs*0.95)+'px;margin-top:-'+(fs*0.9)+'px">loco</span>'; } });
    c.innerHTML=h; }
  function octBotones(){ var bar=document.getElementById('rpAnotBar'); if(!bar || bar.querySelector('.lb-oct')) return;
    var ar=bar.querySelector('[data-t="ar"]'); if(!ar) return;
    [['b','8va↓','Octava baja · toca: «8va↓» · arrastra: línea hasta donde vuelve a «loco»'],['a','8va↑','Octava alta · toca: «8va↑» · arrastra: línea hasta donde vuelve a «loco»']].forEach(function(o){
      var b=document.createElement('button'); b.type='button'; b.className='rpv-b lb-oct'; b.dataset.oct=o[0]; b.title=o[2]; b.setAttribute('aria-label',o[2]); b.innerHTML=o[1];
      b.onclick=function(e){ e.stopPropagation(); var ya=(OCT.on===o[0]); OCT.on=ya?null:o[0];
        bar.querySelectorAll('.lb-oct').forEach(function(x){ x.classList.toggle('on', x.dataset.oct===OCT.on); });
        if(OCT.on) bar.querySelectorAll('.anot-b.on').forEach(function(x){ x.classList.remove('on'); }); };
      ar.parentNode.insertBefore(b, ar.nextSibling); });
    bar.addEventListener('click',function(e){ var b=e.target.closest('.anot-b'); if(!b) return; OCT.on=null; bar.querySelectorAll('.lb-oct').forEach(function(x){ x.classList.remove('on'); });
      var t=b.getAttribute('data-t');
      if(t==='undo' && OCT.ultimo==='oct'){ var L=octStore(); if(L&&L.length){ L.pop(); octPinta(); } OCT.ultimo=null; e.stopImmediatePropagation(); e.preventDefault(); }
      if(t==='clear'){ setTimeout(function(){ try{ var st=RP_ANOT.get(currentLesson), vacio=Object.keys(st.pages||{}).every(function(k){ return !(st.pages[k].strokes||[]).length; }); if(vacio && st.oct && st.oct.length){ st.oct.length=0; octPinta(); } }catch(x){} },80); }
    }, true);
  }
  function octArranca(){
    var st=document.createElement('style'); st.textContent=OCT_CSS; document.head.appendChild(st);
    if(typeof window.rpAnotarMontar_==='function'){ var _m=window.rpAnotarMontar_; window.rpAnotarMontar_=function(){ var r=_m.apply(this,arguments); try{ OCT.on=null; octBotones(); octPinta(); }catch(e){} return r; }; }
    var _rl=window.renderLesson; window.renderLesson=function(){ var r=_rl.apply(this,arguments); setTimeout(function(){ try{ octPinta(); }catch(e){} },30); return r; };
    window.addEventListener('resize',function(){ setTimeout(function(){ try{ octPinta(); }catch(e){} },250); });
    var vivo=null;
    document.addEventListener('pointerdown',function(e){ var sc=document.getElementById('score'); if(!sc || !sc.contains(e.target)) return;
      var r=sc.getBoundingClientRect(), nx=(e.clientX-r.left)/r.width, ny=(e.clientY-r.top)/r.height;
      var goma=document.querySelector('#rpAnotBar .anot-b.on[data-t="goma"]');
      if(goma && !OCT.on){ var L=octStore(); if(L){ var antes=L.length; for(var i=L.length-1;i>=0;i--){ var m=L[i], x1=(m.x1!=null?m.x1:m.x0+0.05);
            if(Math.abs(ny-m.y)<0.03 && nx>=m.x0-0.01 && nx<=x1+0.04) L.splice(i,1); } if(L.length!==antes) octPinta(); } return; }
      if(!OCT.on) { OCT.ultimo='eng'; return; }
      e.stopPropagation(); e.preventDefault();
      vivo={t:OCT.on, x0:Math.max(0,Math.min(1,nx)), y:Math.max(0,Math.min(1,ny)), sx:e.clientX, vivo:true}; octPinta(vivo);
      var mover=function(ev){ if(!vivo) return; ev.preventDefault(); if(Math.abs(ev.clientX-vivo.sx)>8){ vivo.x1=Math.max(vivo.x0,Math.min(1,(ev.clientX-r.left)/r.width)); } octPinta(vivo); };
      var soltar=function(ev){ document.removeEventListener('pointermove',mover,true); document.removeEventListener('pointerup',soltar,true); document.removeEventListener('pointercancel',soltar,true);
        if(!vivo) return; var m={t:vivo.t, x0:+vivo.x0.toFixed(4), y:+vivo.y.toFixed(4)}; if(vivo.x1!=null && vivo.x1>vivo.x0+0.01) m.x1=+vivo.x1.toFixed(4); vivo=null;
        if(ev.type!=='pointercancel'){ var L=octStore(); if(L){ L.push(m); OCT.ultimo='oct'; } } octPinta(); };
      document.addEventListener('pointermove',mover,true); document.addEventListener('pointerup',soltar,true); document.addEventListener('pointercancel',soltar,true);
    }, true);
  }
  /* (20-nov 13:11, Iago) acompañamiento: como mínimo un acorde que SUENE en cada compás (el que se mantiene se vuelve a atacar en la parte fuerte) */
  function acompArranca(){ if(typeof window.buildAccompaniment!=='function') return; var _ba=window.buildAccompaniment;
    window.buildAccompaniment=function(L){ var r=_ba.apply(this,arguments);
      try{ var ini=[], q=0; L.phrases.forEach(function(ph){ ph.measures.forEach(function(m){ ini.push(q); q+=meterCapQ(m.time); }); });
        var out=[]; (r.chords||[]).forEach(function(c){ var cortes=ini.filter(function(x){ return x>c.startQ+1e-6 && x<c.endQ-1e-6; }); var a=c.startQ;
          cortes.concat([c.endQ]).forEach(function(b){ out.push(Object.assign({},c,{startQ:a,endQ:b,midis:c.midis.slice()})); a=b; }); });
        r.chords=out; }catch(e){ console.warn('[libro] acompañamiento',e); }
      return r; }; }

  function adaptaEstudio(J){
    GE=(J.grado==='ge'); if(GE) document.body.classList.add('libro-ge');
    try{ if(typeof RP_LIM!=='undefined'){ RP_LIM.perc=RP_LIM.ritmo=RP_LIM.ent=1e9; } }catch(e){}
    /* (20-nov 12:32, Iago) tiempo validado: sin cortesías y sin el rato de los carteles (el motor ya no cuenta el cartel abierto).
       Aquí no hay cuentas atrás en pantalla, pero lo que se valida NO pasa de lo que darían las de Ritmo entonado at home (3′ · 2′ · 3′) */
    if(typeof window.vtCalc==='function'){ var _vc=window.vtCalc; window.vtCalc=function(){ var g={perc:RP_LIM.perc,ritmo:RP_LIM.ritmo,ent:RP_LIM.ent};
      RP_LIM.perc=180; RP_LIM.ritmo=120; RP_LIM.ent=180; try{ return _vc.apply(this,arguments); } finally{ RP_LIM.perc=g.perc; RP_LIM.ritmo=g.ritmo; RP_LIM.ent=g.ent; } }; }
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
      adaptaEstudio(J); try{ ajustesEstudio(); octArranca(); acompArranca(); }catch(e){ console.warn('[libro] ajustes',e); } try{ if(CARTELES_VISUALES || /[?&]cv=1/.test(location.search)) cvArranca(); }catch(e){ console.warn('[libro] carteles',e); }
      try{ document.querySelectorAll('p,div').forEach(function(e){ if(e.children.length===0 && /generado proceduralmente/i.test(e.textContent)) e.style.display='none'; }); }catch(e){}
      /* (20-nov 13:00, Iago) pantalla de entrada: «Iniciar estudio» y las columnas de anotar ya a los lados (lo escrito pasa al estudio) */
      try{ var sb=document.getElementById('studyBtn'); if(sb){ var svg=sb.querySelector('svg'); sb.innerHTML=''; if(svg) sb.appendChild(svg); sb.appendChild(document.createTextNode(' Iniciar estudio')); } }catch(e){}
      /* la lección, ya desde la entrada, al tamaño de la pantalla como en la fase 1 (mismo ajuste que el estudio) */
      var encajaEntrada=function(){ try{ if(typeof studyMode==='undefined' || studyMode || typeof rpEncaja!=='function') return; studyMode=true; try{ rpEncaja(); }finally{ studyMode=false; } document.body.classList.add('libro-entrada'); }catch(e){} };
      var anotFuera=function(){ try{ if(typeof studyMode!=='undefined' && studyMode) return; if(typeof rpAnotarMontar_==='function') rpAnotarMontar_(); encajaEntrada(); }catch(e){} };
      window.addEventListener('resize',function(){ clearTimeout(encajaEntrada._t); encajaEntrada._t=setTimeout(encajaEntrada,200); });
      setTimeout(anotFuera,60);
      if(typeof window.closeStudy==='function'){ var _cs=window.closeStudy; window.closeStudy=function(){ var r=_cs.apply(this,arguments); setTimeout(anotFuera,60); return r; }; }
    }).catch(function(e){ console.error('[libro] no se pudo abrir la lección',e);
      var s=document.getElementById('score'); if(s) s.innerHTML='<div style="padding:30px;text-align:center;color:#7a1407">No se pudo abrir la lección '+NUM+'.</div>'; });
  }
  if(document.readyState==='complete') setTimeout(arranca,0); else window.addEventListener('load',function(){ setTimeout(arranca,50); });
})();
