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
      "body.libro-modo #phaseControls{position:sticky;bottom:8px;z-index:60;background:rgba(22,15,4,.94);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}"+
      "body.libro-modo #score.libro-papel svg{height:calc(100vh - 250px)!important;min-height:300px;width:100%!important}"+
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
  function compasDe(txt){ /* «2/4+1/4» → time 9/16, fracSig ['2/4','+¼'] · «3/4» → 3/4 */
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

  function montaLeccion(J){
    var compasAct=null; var porCompas={};
    var medidas=J.compases.map(function(c){
      if(c.compas) compasAct=compasDe(c.compas);
      var notes=[], beams=[], stems=[]; var total16=0;
      c.m.split('|').forEach(function(g){
        var tk=g.trim().split(/\s+/); var stem=0;
        if(tk[0]==='^'){ stem=1; tk.shift(); } else if(tk[0]==='v'){ stem=-1; tk.shift(); }
        var idx=[];
        tk.forEach(function(t){ var p=t.split(':'); var esSil=/^r/.test(p[1]);
          var n={dur:durDe(p[0])}; if(esSil){ n.rest=true; } else { n.midi=midiDe(p[1]); n.key=keyDe(p[1]); }
          idx.push(notes.length); notes.push(n); stems.push(stem); total16+=dur16(p[0]); });
        if(idx.length>1) beams.push(idx);
      });
      var cap16 = (function(){ var t=compasAct.time.split('/'); return (+t[0])*16/(+t[1]); })();
      if(Math.abs(cap16-total16)>1e-6) console.warn('[libro] compás '+c.c+': suma '+total16+' semicorcheas, el compás pide '+cap16);
      var m={time:compasAct.time, notes:notes, beams:beams, cap:cap16/4};
      if(compasAct.fracSig) m.fracSig=compasAct.fracSig.slice();
      m._libro={c:c.c, stems:stems, compas:compasAct, cambia:!!c.compas, aire:(c.aire!=null?+c.aire:null)};
      porCompas[c.c]=m; return m;
    });
    var phrases=J.sistemas.map(function(s){
      var ms=s.compases.map(function(k){ return porCompas[k]; });
      return {clef:J.clave||'treble', keysig:J.armadura, time:ms[0].time, measures:ms, nMeasures:ms.length, valid:true, dense:false};
    });
    var tonic=(J.armadura||'C').toLowerCase(); /* armadura = tónica en mayor (G → g) */
    var L={trimKey:'gp1', worldId:'m1', cards:['c1_9'], keysig:J.armadura, tonic:tonic, modo:'mayor', phrases:phrases,
           timeA:phrases[0].time, timeB:phrases[phrases.length-1].time, switchIdx:phrases.length, gp1:true,
           simpleSlow5:false, mixSlow:false, fusaN:false, conjunctM4:false, noMeter:false, roles:null, combine:false,
           valid:true, libro:J};
    L._lig=(J.ligaduras||[]).map(parseLigadura);
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
          if(n.rest){ return new VF.StaveNote({clef:ph.clef,keys:['b/4'],duration:durBase(n.dur)+'r'}); }
          var x2 = (typeof RHYTHM_XHEADS!=='undefined' && RHYTHM_XHEADS);
          var sn=new VF.StaveNote({clef:ph.clef,keys:[x2?(n.key+'/x2'):n.key],duration:durBase(n.dur),stem_direction:sd||1,auto_stem:!sd});
          for(var di=0;di<durDots(n.dur);di++) VF.Dot.buildAndAttach([sn]);
          if(!x2){ var mm=String(n.key).match(/^([a-g])(#|b)?\/(\d)/); if(mm){ var kk=mm[1]+mm[3], want=mm[2]||'n', inKey=(KEY_ACCIDENTALS[ph.keysig]||{})[mm[1]]||'n';
            var cur=(kk in acc)?acc[kk]:inKey; acc[kk]=want; if(want!==cur) sn.addModifier(new VF.Accidental(want),0); } }
          vfDe[lb.c+'.'+ni]=sn; return sn; });
        var beams=(m.beams||[]).map(function(g){ return new VF.Beam(g.map(function(k){ return vf[k]; }),false); });
        var voice=voiceOf(m); voice.addTickables(vf);
        /* como en el libro: tras la última figura queda el aire de lo que dura (una corchea con puntillo deja más hueco) */
        var _d=measureNoteBeats(m), _cap=meterCapQ(m.time), _ult=_d[_d.length-1]||0;
        var izq=stave.getNoteStartX()-x; var bruto=w-izq; var ancho=bruto-Math.max(U(18), (lb.aire!=null)?bruto*lb.aire:bruto*(_ult/_cap)*0.55);
        new VF.Formatter().joinVoices([voice]).format([voice],Math.max(40,ancho));
        voice.draw(ctx,stave);
        beams.forEach(function(b){ b.setContext(ctx).draw(); });
        try{ if(typeof drawPulseTicks==='function') drawPulseTicks(ctx,m,vf,stave); }catch(e){}
        m.notes.forEach(function(n,k){ if(n.rest) return; var sn=vf[k]; var cx=stave.getNoteStartX(), cy=yTop+60, rad=8;
          try{ var bx=sn.getNoteHeadBeginX(), ex=sn.getNoteHeadEndX(); cx=(bx+ex)/2; var ys=sn.getYs(); if(ys&&ys.length) cy=ys[0]; rad=Math.max(7,(ex-bx)/2+2.5); }catch(e){}
          XHEAD_POS.push({cx:cx,cy:cy,rad:rad}); });
      });
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
      if(si===0){ ctx.setFont('LibroCifras, "TeX Gyre Schola", "Century Schoolbook", Georgia, serif', U(45).toFixed(2)+'px', 'bold');
        ctx.fillText(J.titulo, U(83), U(sis.y)+U(53)); }
      else { ctx.setFont('LibroCompas, "TeX Gyre Termes", "Times New Roman", Times, serif', U(27).toFixed(2)+'px', '', 'italic');
        ctx.fillText(String(sis.compases[0]), U(63), U(sis.y)-U(29)); }
      ctx.restore();
    });
    /* ligaduras de expresión */
    (L._lig||[]).forEach(function(g){ var a=vfDe[g.c1+'.'+g.n1], b=vfDe[g.c2+'.'+g.n2]; if(a&&b) ligadura(ctx,a,b,g.arriba,S); });
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
  function notaLibro(ctx, nb, U){
    ctx.save(); ctx.setFillStyle('#2b2b2b'); ctx.setStrokeStyle('#2b2b2b');
    var F='"Helvetica Neue", Helvetica, Arial, sans-serif';
    nb.lineas.forEach(function(li){
      var piezasDe=function(T){ return li.partes.map(function(p){
        if(typeof p==='string') return {t:p, w:mide(p,T,F)};
        if(p.frac) return {frac:p.frac, apilada:!!p.apilada, w:(p.apilada?0.75:1.15)*T};
        if(p.figura) return {fig:p.figura, w:1.9*T}; return {t:'',w:0}; }); };
      var T=U(17), piezas=piezasDe(T), tot=piezas.reduce(function(a,p){ return a+p.w; },0);
      if(li.x0!=null && li.x1!=null && tot>0){ T=T*U(li.x1-li.x0)/tot; piezas=piezasDe(T); tot=U(li.x1-li.x0); }
      var x=(li.x0!=null)?U(li.x0):(li.alinear==='derecha'?U(li.x)-tot:U(li.x)), y=U(li.y), k=T/17;   /* k: px del libro → unidades a este tamaño */
      piezas.forEach(function(p){
        if(p.t!=null){ ctx.setFont(F,T.toFixed(2)+'px','normal'); ctx.fillText(p.t,x,y); }
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

  /* (20-nov-2026, Iago) en el cartel de la FASE 1 se remarca que abajo se ajusta la velocidad y, en la entonación, la ayuda */
  var RECUERDA='<b>Recuerda:</b> abajo puedes ajustar la velocidad, de la tortuga a la liebre. Ponla a la que te resulte cómoda. '+
               'Y en la entonación podrás elegir cuánta ayuda necesitas. Aquí no hay tiempo: tómate el que haga falta.';
  function recordatorioFase1(){
    var mo=new MutationObserver(function(){
      if(typeof studyMode==='undefined' || !studyMode || phaseIdx!==0) return;
      document.querySelectorAll('.phase-banner, .rp-cartel').forEach(function(card){
        if(card.querySelector('.libro-recuerda')) return;
        var p=document.createElement('p'); p.className='libro-recuerda'; p.innerHTML=RECUERDA;
        var ok=card.querySelector('.pb-ok, .rp-cartel-ok'); if(ok) card.insertBefore(p,ok); else card.appendChild(p);
      });
    });
    mo.observe(document.body,{childList:true,subtree:true});
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
      recordatorioFase1();
      try{ document.querySelectorAll('p,div').forEach(function(e){ if(e.children.length===0 && /generado proceduralmente/i.test(e.textContent)) e.style.display='none'; }); }catch(e){}
    }).catch(function(e){ console.error('[libro] no se pudo abrir la lección',e);
      var s=document.getElementById('score'); if(s) s.innerHTML='<div style="padding:30px;text-align:center;color:#7a1407">No se pudo abrir la lección '+NUM+'.</div>'; });
  }
  if(document.readyState==='complete') setTimeout(arranca,0); else window.addEventListener('load',function(){ setTimeout(arranca,50); });
})();
