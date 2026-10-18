/* ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
   LM at home · SELECCIONADOR DE VOLUNTARIOS · lm-voluntarios.js · v1 (14-oct-2026, Claude para Iago)

   Lo que pidió Iago (14-oct-2026): «solo para Iago González Protester… arriba a la derecha, en la esquina de pantalla completa
   y demás, a continuación hacia la izquierda, un botón “Voluntarios”… que solo esté activo en los horarios de los grupos que
   tengo… al pulsar, una ruleta de alumnos de ese grupo… aleatorio… y que puedas darlo otra vez». «La animación, unos 5 segundos,
   que dé algo hype… en todos los portales, incluidos los futuros… con la misma estética que el propio portal.» «Cada vez que la
   ruleta aleatoriza, el nombre que sale se banea [hasta que salga el resto]: será el que ha hecho de voluntario o el que ha
   rechazado serlo.» Respuestas a las preguntas: gira sola al pulsar · icono + «Voluntarios» · solo la hora exacta de clase.

   Cómo funciona
   · La cuenta: el medallero del portal GP (lmpro) abre cada portal con «#c=<cuenta>» SOLO si la sesión es la de pruebas
     (Protester). El portal la guarda en su localStorage («lm_vol_cuenta») y la quita de la dirección. Este fichero solo se carga
     si hay cuenta guardada (ver el cargador de cada portal), así que a los alumnos no les llega nada.
   · Supabase decide todo (funciones suite_voluntarios_estado / suite_voluntarios_tira, migración voluntarios_gp_20261014):
     si la cuenta no es Protester, no devuelve nada y aquí se olvida la cuenta y no sale el botón. Si hay clase ahora mismo
     (horario_clases, hora exacta, hora de Madrid), el sorteo se hace en el servidor: saca a uno al azar entre los que no han
     salido en la ronda de su grupo, lo apunta y devuelve el bombo y cuál salió. La ruleta solo lo anima.
   · El botón: icono + «Voluntarios», apagado fuera de la hora de clase (al pulsarlo, dice cuándo es la próxima).
   · Tres estéticas («temas»), una por portal: «museo» (Atonalidad: la rueda del candado del capítulo 3, de latón, con la luz
     azul de la noche), «radio» (Acústica · La cabaña: la radio de la cabaña, el dial que sintoniza el nombre, con su ojo mágico)
     y «disco» (Fonógrafo: el disco que gira y la aguja que cae en un nombre). (17-oct-2026) Y «cinta» (Magnetófono: los nombres
     escritos en la cinta, que rebobina, frena y deja uno bajo el cabezal de reproducir). Un portal nuevo = un tema nuevo aquí.

   Uso en un portal (ver LEEME):
     <script> cargador: si hay #c= o lm_vol_cuenta, carga https://gp.lmathome.es/voluntarios/lm-voluntarios.js y llama a
     LMVoluntarios.monta({ portal:'atonalidad', tema:'museo', boton:{ padre, antes, id, clase }, alAbrir, alCerrar, sonidos }) </script>
   Quitarlo de un portal: borrar su cargador. Quitarlo de todos: borrar este fichero (los portales siguen igual, sin botón).
   ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.LMVoluntarios) return;
  const VERSION = 2;   // (17-oct-2026) v2: el tema «cinta» del Magnetófono
  const SB = 'https://woiptkyrxkbpnvioypit.supabase.co';
  const CLAVE_PUB = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  const CLAVE = 'lm_vol_cuenta';
  const DIAS = ['', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const T_GIRO = 5.0;                     // segundos de ruleta, desde que arranca hasta que se para en el nombre

  /* ───────── utilidades ───────── */
  const el = (tag, cls, padre, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (padre) padre.appendChild(e); return e; };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const eio = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;          // suave al salir y al llegar
  const eo = (u, p) => 1 - Math.pow(1 - clamp(u, 0, 1), p || 3);
  const fract = x => x - Math.floor(x);
  function rr(g, x, y, w, h, r) {                // rectángulo redondeado (r: número o [arriba-izq, arriba-dcha, abajo-dcha, abajo-izq])
    const [a, b, c, d] = Array.isArray(r) ? r : [r, r, r, r];
    g.beginPath(); g.moveTo(x + a, y); g.lineTo(x + w - b, y); g.quadraticCurveTo(x + w, y, x + w, y + b); g.lineTo(x + w, y + h - c);
    g.quadraticCurveTo(x + w, y + h, x + w - c, y + h); g.lineTo(x + d, y + h); g.quadraticCurveTo(x, y + h, x, y + h - d); g.lineTo(x, y + a);
    g.quadraticCurveTo(x, y, x + a, y); g.closePath();
  }
  // texto que cabe: reduce la anchura si hace falta (sin cambiar la altura)
  function textoCabe(g, t, x, y, ancho) { const w = g.measureText(t).width; if (w <= ancho) { g.fillText(t, x, y); return; } g.save(); g.translate(x, y); g.scale(ancho / w, 1); g.fillText(t, 0, 0); g.restore(); }

  /* ───────── la cuenta ───────── */
  function leeCuenta() {
    let c = null;
    try {
      const m = /(?:^#|&)c=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i.exec(location.hash || '');
      if (m) { c = m[1].toLowerCase(); localStorage.setItem(CLAVE, c); limpiaHash(); }
    } catch (e) {}
    if (!c) { try { c = localStorage.getItem(CLAVE); } catch (e) {} }
    return /^[0-9a-f-]{36}$/i.test(c || '') ? c : null;
  }
  function limpiaHash() {
    try {
      const h = (location.hash || '').replace(/^#/, '').split('&').filter(p => p && !/^c=/.test(p)).join('&');
      history.replaceState(history.state, '', location.pathname + location.search + (h ? '#' + h : ''));
    } catch (e) {}
  }
  function olvida() { try { localStorage.removeItem(CLAVE); } catch (e) {} }

  /* ───────── Supabase ───────── */
  async function rpc(fn, args) {
    const ctl = typeof AbortController === 'function' ? new AbortController() : null, t = ctl && setTimeout(() => ctl.abort(), 12000);
    try {
      const r = await fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', cache: 'no-store', signal: ctl && ctl.signal,
        headers: { apikey: CLAVE_PUB, Authorization: 'Bearer ' + CLAVE_PUB, 'Content-Type': 'application/json' }, body: JSON.stringify(args) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally { if (t) clearTimeout(t); }
  }

  /* ───────── la hora de Madrid y el horario ───────── */
  function ahora() {
    const p = {};
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(x => { p[x.type] = x.value; });
    } catch (e) { const d = new Date(); return { d: d.getDay() || 7, m: d.getHours() * 60 + d.getMinutes() }; }
    const d = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[p.weekday] || 1;
    return { d, m: (+p.hour % 24) * 60 + (+p.minute) };
  }
  const aMin = s => { const [h, m] = String(s).split(':').map(Number); return h * 60 + (m || 0); };
  function franja(horario) { const a = ahora(); return (horario || []).find(h => h.d === a.d && a.m >= aMin(h.i) && a.m < aMin(h.f)) || null; }
  function proxima(horario) {
    const a = ahora(), hs = (horario || []).slice().sort((x, y) => x.d - y.d || aMin(x.i) - aMin(y.i));
    for (let k = 0; k <= 7; k++) {
      const d = ((a.d - 1 + k) % 7) + 1;
      const h = hs.find(x => x.d === d && (k > 0 || aMin(x.i) > a.m));
      if (h) return (k === 0 ? 'hoy' : k === 1 ? 'mañana' : 'el ' + DIAS[d]) + ' a las ' + h.i + ' (' + h.g + ')';
    }
    return null;
  }

  /* ───────── el sonido (un contexto propio: suena aunque el portal esté en pausa) ───────── */
  const A = {
    ac: null, sal: null, rev: null, cache: new Map(), _ruido: null,
    crea() {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      if (!this.ac) {
        const ac = this.ac = new AC();
        const comp = ac.createDynamicsCompressor(); comp.threshold.value = -12; comp.knee.value = 8; comp.ratio.value = 3.5; comp.attack.value = .003; comp.release.value = .22;
        this.sal = ac.createGain(); this.sal.gain.value = .92; this.sal.connect(comp); comp.connect(ac.destination);
        const cv = ac.createConvolver(); cv.normalize = true; cv.buffer = this.ir(2.4, .38);
        const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 180;
        this.rev = ac.createGain(); this.rev.gain.value = .55; this.rev.connect(hp); hp.connect(cv); cv.connect(this.sal);
      }
      if (this.ac.state === 'suspended') this.ac.resume().catch(() => {});
      return this.ac;
    },
    ir(seg, brillo) {
      const ac = this.ac, n = Math.floor(seg * ac.sampleRate), b = ac.createBuffer(2, n, ac.sampleRate);
      for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let lp = 0;
        for (let i = 0; i < n; i++) { const t = i / ac.sampleRate; lp += (Math.random() * 2 - 1 - lp) * brillo * (1 - .7 * t / seg); d[i] = lp * Math.exp(-6.9 * t / seg) * (t < .01 ? t / .01 : 1); } }
      return b;
    },
    ruido() {
      if (this._ruido) return this._ruido;
      const ac = this.ac, n = ac.sampleRate * 2, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      return (this._ruido = b);
    },
    // una salida con su volumen, su paneo y su envío a la reverb
    via(gan = 1, wet = 0, pan = 0) {
      const ac = this.ac, g = ac.createGain(); g.gain.value = gan;
      let n = g; if (pan && ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = pan; g.connect(p); n = p; }
      n.connect(this.sal); if (wet) { const w = ac.createGain(); w.gain.value = wet; n.connect(w); w.connect(this.rev); }
      return g;
    },
    async carga(url) {
      if (!url || !this.ac) return null;
      if (!this.cache.has(url)) this.cache.set(url, fetch(url).then(r => r.ok ? r.arrayBuffer() : null).then(b => b ? new Promise(ok => this.ac.decodeAudioData(b, ok, () => ok(null))) : null).catch(() => null));
      return this.cache.get(url);
    },
    muestra(buf, o = {}) {
      if (!buf || !this.ac) return false;
      const ac = this.ac, s = ac.createBufferSource(); s.buffer = buf; s.playbackRate.value = o.vel || 1;
      s.connect(this.via(o.gan == null ? 1 : o.gan, o.wet || 0, o.pan || 0)); s.start(ac.currentTime + (o.t || 0)); return true;
    },
    // un clic seco (lengüeta, trinquete…): ruido muy corto por un filtro de banda
    clic(o = {}) {
      const ac = this.ac; if (!ac) return; const t = ac.currentTime + (o.t || 0);
      const s = ac.createBufferSource(); s.buffer = this.ruido(); const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = o.f || 3000; f.Q.value = o.q || 2.5;
      const g = ac.createGain(); const d = o.dur || .028; g.gain.setValueAtTime(o.gan || .4, t); g.gain.exponentialRampToValueAtTime(.0008, t + d);
      s.connect(f); f.connect(g); g.connect(this.via(1, o.wet || 0, o.pan || 0)); s.start(t, Math.random() * 1.5, d + .02);
    },
    // una nota (oscilador con envolvente)
    nota(f, o = {}) {
      const ac = this.ac; if (!ac) return; const t = ac.currentTime + (o.t || 0), dur = o.dur || .5;
      const os = ac.createOscillator(); os.type = o.tipo || 'sine'; os.frequency.setValueAtTime(f, t);
      if (o.desliza) os.frequency.exponentialRampToValueAtTime(o.desliza, t + dur);
      const g = ac.createGain(), at = o.ataque || .006, v = o.gan == null ? .2 : o.gan;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + at); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
      let n = os; if (o.filtro) { const fl = ac.createBiquadFilter(); fl.type = o.filtro.tipo || 'lowpass'; fl.frequency.value = o.filtro.f; fl.Q.value = o.filtro.q || .7; os.connect(fl); n = fl; }
      n.connect(g); g.connect(o.destino || this.via(1, o.wet || 0, o.pan || 0)); os.start(t); os.stop(t + dur + .05);
    },
    // ruido filtrado continuo (zumbido de la rueda, estática de la radio, crepitar del disco): devuelve sus mandos
    continuo(o = {}) {
      const ac = this.ac; if (!ac) return null;
      const s = ac.createBufferSource(); s.buffer = this.ruido(); s.loop = true;
      const f = ac.createBiquadFilter(); f.type = o.tipo || 'bandpass'; f.frequency.value = o.f || 1200; f.Q.value = o.q || .8;
      const g = ac.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(this.via(1, o.wet || 0, o.pan || 0)); s.start();
      return { f, g, para: (seg = .3) => { try { const t = ac.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + seg); s.stop(t + seg + .05); } catch (e) {} } };
    },
    pon(param, v, seg = .05) { const t = this.ac.currentTime; param.cancelScheduledValues(t); param.setValueAtTime(param.value, t); param.linearRampToValueAtTime(v, t + seg); }
  };

  /* ───────── un lienzo de dibujo a la resolución de la pantalla (coordenadas siempre de 1920×1080) ───────── */
  function lienzo(padre) {
    const c = el('canvas', null, padre), g = c.getContext('2d');
    const L = { c, g, k: 0,
      ajusta(s) { const k = clamp(s * (window.devicePixelRatio || 1), .5, 2.2); if (Math.abs(k - L.k) < .02) return false; L.k = k; c.width = Math.round(1920 * k); c.height = Math.round(1080 * k); return true; },
      borra() { g.setTransform(L.k, 0, 0, L.k, 0, 0); g.clearRect(0, 0, 1920, 1080); } };
    return L;
  }
  // una capa ya pintada (lo que no se mueve), a la misma resolución
  function capaFija(k, fn, x = 0, y = 0, w = 1920, h = 1080) {
    const c = document.createElement('canvas'); c.width = Math.ceil(w * k); c.height = Math.ceil(h * k);
    const g = c.getContext('2d'); g.setTransform(k, 0, 0, k, -x * k, -y * k); fn(g);
    return { c, x, y, w, h };
  }
  const ponCapa = (g, capa) => g.drawImage(capa.c, capa.x, capa.y, capa.w, capa.h);

  /* ───────── el recorrido de una ruleta: un amago hacia atrás, un arranque rapidísimo y una frenada larga ─────────
     d(t) = lo que queda por recorrer = D·(1 − t/T)^p  →  con p ≈ 2,5 los últimos 1,5 s pasan solo los últimos 3 o 4 nombres */
  function recorrido(p0, p1, o = {}) {
    const T = o.T || T_GIRO, AM = o.amago == null ? .32 : o.amago, R = o.rebote == null ? .22 : o.rebote, p = o.p || 2.5, ret = o.retro == null ? .35 : o.retro;
    const sobra = o.sobra == null ? .1 : o.sobra, ini = p0 - ret, D = (p1 + sobra) - ini, Tg = T - AM - R;
    const f = t => {
      if (t <= 0) return p0;
      if (t < AM) return p0 - ret * eio(t / AM);
      if (t < AM + Tg) { const u = (t - AM) / Tg; return ini + D * (1 - Math.pow(1 - u, p)); }
      if (t < T) return p1 + sobra * (1 - eio((t - AM - Tg) / R));
      return p1;
    };
    f.T = T; f.fin = AM + Tg;
    return f;
  }

  /* ════════════════════════════════════ LOS TEMAS ════════════════════════════════════ */
  const TEMAS = {};

  /* ── «museo» · Atonalidad: la rueda del candado del capítulo 3 ──
     Un candado de latón (el del capítulo 3, con su arco de acero) con una sola rueda grande en la que van grabados los nombres.
     La rueda gira con su «tic» de candado y su eco de museo de noche; frena; encaja; y el candado se abre en el nombre. */
  TEMAS.museo = {
    fuentes: ['700 64px Lora', '400 112px Lora', '600 24px Poppins'],
    css: `
.lmv-t-museo .lmv-velo{background:radial-gradient(ellipse at 50% 40%,rgba(26,34,48,.975) 0%,rgba(11,15,21,.985) 55%,rgba(5,6,8,.99) 100%)}
.lmv-t-museo .lmv-cab{top:40px}
.lmv-t-museo .lmv-ceja{font:600 24px/1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;letter-spacing:.42em;text-transform:uppercase;color:#e8b77a;text-shadow:0 2px 14px rgba(0,0,0,.9)}
.lmv-t-museo .lmv-grupo{margin-top:12px;font:500 24px/1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:rgba(240,232,218,.6)}
.lmv-t-museo .lmv-nombre{top:752px;font:400 108px/1.12 Lora,Georgia,"Times New Roman",serif;color:#f4ecdc;text-shadow:0 0 38px rgba(89,216,255,.55),0 0 90px rgba(89,216,255,.25),0 6px 30px rgba(0,0,0,.9)}
.lmv-t-museo .lmv-nota{top:892px;font:italic 400 28px/1.3 Lora,Georgia,serif;color:#cdbfa8}
.lmv-t-museo .lmv-pie{bottom:44px}
.lmv-t-museo .lmv-b{display:inline-flex;align-items:center;gap:14px;padding:18px 36px;border-radius:16px;border:2px solid #c4945c;background:rgba(14,12,18,.82);color:#f0e8da;font:600 28px/1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;transition:background .2s,transform .15s}
.lmv-t-museo .lmv-b:hover{background:rgba(40,30,22,.92);transform:translateY(-2px)}
.lmv-t-museo .lmv-b.lmv-otra{background:#c4945c;color:#17120c}
.lmv-t-museo .lmv-b.lmv-otra:hover{background:#d8a76c}
.lmv-t-museo .lmv-cargando{color:#9fdcff}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g;
      const CX = 960, SEL = 520, WX = 690, WY = 405, WW = 540, WH = 230, BX = 620, BY = 345, BW = 680, BH = 390, R = 160, DA = .46;
      const st = { items: [], pos: 0, vel: 0, abre: 0, luz: 0, rayos: 0, elegido: null, t: 0, polvo: [] };
      for (let i = 0; i < 70; i++) st.polvo.push({ x: Math.random() * 1920, y: Math.random() * 1080, r: .6 + Math.random() * 1.8, v: 4 + Math.random() * 10, f: Math.random() * 6.3 });
      let fijo = null, raf = 0, vivo = true;
      // lo que no se mueve: el cuerpo del candado (latón) con su ventana, sus remaches y el ojo de la llave
      function pintaCuerpo(g) {
        g.save();
        // sombra
        g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 60; g.shadowOffsetY = 26; rr(g, BX, BY, BW, BH, 54); g.fillStyle = '#5a4220'; g.fill(); g.shadowColor = 'transparent';
        // latón
        let gr = g.createLinearGradient(BX, BY, BX + BW, BY + BH);
        gr.addColorStop(0, '#d9b66c'); gr.addColorStop(.28, '#a7803e'); gr.addColorStop(.55, '#c9a45a'); gr.addColorStop(.8, '#7d5c28'); gr.addColorStop(1, '#5c4219');
        rr(g, BX, BY, BW, BH, 54); g.fillStyle = gr; g.fill();
        // grano del metal
        g.save(); rr(g, BX, BY, BW, BH, 54); g.clip();
        for (let i = 0; i < 900; i++) { const x = BX + Math.random() * BW, y = BY + Math.random() * BH; g.fillStyle = Math.random() < .5 ? 'rgba(255,240,200,.06)' : 'rgba(40,25,5,.08)'; g.fillRect(x, y, 1 + Math.random() * 14, 1); }
        // la luz azul de la noche por la izquierda y el foco cálido arriba
        gr = g.createLinearGradient(BX, 0, BX + 260, 0); gr.addColorStop(0, 'rgba(127,208,255,.28)'); gr.addColorStop(1, 'rgba(127,208,255,0)'); g.fillStyle = gr; g.fillRect(BX, BY, 260, BH);
        gr = g.createRadialGradient(CX + 120, BY + 10, 10, CX + 120, BY + 10, 520); gr.addColorStop(0, 'rgba(255,226,184,.35)'); gr.addColorStop(1, 'rgba(255,226,184,0)'); g.fillStyle = gr; g.fillRect(BX, BY, BW, BH);
        g.restore();
        // bisel
        rr(g, BX + 3, BY + 3, BW - 6, BH - 6, 51); g.lineWidth = 3; g.strokeStyle = 'rgba(255,236,190,.45)'; g.stroke();
        rr(g, BX + 22, BY + 22, BW - 44, BH - 44, 38); g.lineWidth = 2; g.strokeStyle = 'rgba(60,38,10,.55)'; g.stroke();
        rr(g, BX + 24, BY + 24, BW - 48, BH - 48, 36); g.lineWidth = 1.5; g.strokeStyle = 'rgba(255,236,190,.25)'; g.stroke();
        // remaches
        [[BX + 52, BY + 52], [BX + BW - 52, BY + 52], [BX + 52, BY + BH - 52], [BX + BW - 52, BY + BH - 52]].forEach(([x, y]) => {
          const r = g.createRadialGradient(x - 4, y - 5, 1, x, y, 13); r.addColorStop(0, '#fff3cf'); r.addColorStop(.4, '#c9a45a'); r.addColorStop(1, '#4a3311');
          g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fillStyle = r; g.fill(); });
        // el ojo de la llave
        g.fillStyle = '#1a120a'; g.beginPath(); g.arc(CX, 676, 13, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(CX - 7, 680); g.lineTo(CX + 7, 680); g.lineTo(CX + 4, 712); g.lineTo(CX - 4, 712); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(255,236,190,.4)'; g.lineWidth = 1.5; g.beginPath(); g.arc(CX, 676, 15, .3, 2.8); g.stroke();
        // marco de la ventana (hundido)
        rr(g, WX - 14, WY - 14, WW + 28, WH + 28, 24); g.fillStyle = '#3b2a12'; g.fill();
        rr(g, WX - 14, WY - 14, WW + 28, WH + 28, 24); g.lineWidth = 2; g.strokeStyle = 'rgba(255,236,190,.35)'; g.stroke();
        rr(g, WX - 4, WY - 4, WW + 8, WH + 8, 16); g.fillStyle = '#0e0a06'; g.fill();
        // las flechas que marcan el nombre
        [[WX - 30, 1], [WX + WW + 30, -1]].forEach(([x, s]) => { g.beginPath(); g.moveTo(x, SEL - 16); g.lineTo(x + 20 * s, SEL); g.lineTo(x, SEL + 16); g.closePath();
          const r = g.createLinearGradient(x, SEL - 16, x, SEL + 16); r.addColorStop(0, '#fff0c4'); r.addColorStop(1, '#a37a32'); g.fillStyle = r; g.fill(); });
        g.restore();
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) fijo = capaFija(L.k, pintaCuerpo, BX - 80, BY - 60, BW + 160, BH + 140); }
      // el arco (acero): sube y gira sobre la pata derecha al abrirse
      function pintaArco(a) {
        g.save();
        const sube = 72 * eo(clamp(a * 1.6, 0, 1), 3), gira = -.42 * eo(clamp((a - .35) / .65, 0, 1), 2);
        g.translate(1145, 335 - sube); g.rotate(gira); g.translate(-1145, -335);
        g.lineCap = 'round';
        g.lineWidth = 50; g.strokeStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.moveTo(775 + 10, 372); g.lineTo(775 + 10, 335); g.arc(960 + 10, 335, 185, Math.PI, 0); g.lineTo(1145 + 10, 460); g.stroke();
        const gr = g.createLinearGradient(740, 0, 1180, 0); gr.addColorStop(0, '#5e6670'); gr.addColorStop(.18, '#dfe5ea'); gr.addColorStop(.35, '#8d959e'); gr.addColorStop(.62, '#c4cbd2'); gr.addColorStop(.85, '#6d747c'); gr.addColorStop(1, '#a9b0b8');
        g.lineWidth = 44; g.strokeStyle = gr; g.beginPath(); g.moveTo(775, 372); g.lineTo(775, 335); g.arc(960, 335, 185, Math.PI, 0); g.lineTo(1145, 460); g.stroke();
        g.lineWidth = 6; g.strokeStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(960, 335, 198, Math.PI * 1.08, Math.PI * 1.6); g.stroke();
        g.lineWidth = 3; g.strokeStyle = 'rgba(127,208,255,.45)'; g.beginPath(); g.arc(960, 335, 202, Math.PI * 1.02, Math.PI * 1.3); g.stroke();
        g.restore();
      }
      // la rueda: los nombres van en una tira sin fin (el bombo repetido) que se ve sobre un cilindro
      function pintaRueda() {
        g.save(); rr(g, WX, WY, WW, WH, 12); g.clip();
        let gr = g.createLinearGradient(0, WY, 0, WY + WH); gr.addColorStop(0, '#2a2117'); gr.addColorStop(.22, '#9c8656'); gr.addColorStop(.5, '#e3cf9a'); gr.addColorStop(.78, '#9c8656'); gr.addColorStop(1, '#2a2117');
        g.fillStyle = '#c9b27a'; g.fillRect(WX, WY, WW, WH); g.globalAlpha = .9; g.fillStyle = gr; g.fillRect(WX, WY, WW, WH); g.globalAlpha = 1;
        const n = st.items.length, v = Math.abs(st.vel), copias = v > 4 ? Math.min(8, 1 + Math.floor(v / 3)) : 1, peso = k => copias > 1 ? Math.pow(1 - k / copias, 1.6) * 2.4 / copias : 1;
        g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 62px Lora, Georgia, serif';
        const i0 = Math.floor(st.pos) - 4, i1 = Math.floor(st.pos) + 5;
        for (let i = i0; i <= i1; i++) {
          // las juntas entre nombres
          const tj = (i - .5 - st.pos) * DA; if (Math.abs(tj) < 1.4) { const yj = SEL + R * Math.sin(tj), c = Math.cos(tj);
            g.fillStyle = `rgba(40,28,10,${.55 * c})`; g.fillRect(WX, yj - 1.5, WW, 3); g.fillStyle = `rgba(255,245,215,${.28 * c})`; g.fillRect(WX, yj + 1.5, WW, 1.5); }
          if (!n) continue;
          const nom = st.items[((i % n) + n) % n];
          for (let k = 0; k < copias; k++) {
            const pp = st.pos - (copias > 1 ? (k / copias) * st.vel / 60 : 0), th = (i - pp) * DA;
            if (Math.abs(th) > 1.25) continue;
            const y = SEL + R * Math.sin(th), c = Math.cos(th), a = Math.min(1, peso(k)) * clamp(c * 1.25 - .15, 0, 1);
            g.save(); g.translate(CX, y); g.scale(1, c);
            const elegido = st.elegido != null && i === st.elegido;
            g.globalAlpha = a * .4; g.fillStyle = 'rgba(255,245,215,1)'; textoCabe(g, nom, 2, 4, WW - 60);
            g.globalAlpha = a; g.fillStyle = elegido && st.luz > 0 ? `rgb(${lerp(33, 10, st.luz)},${lerp(24, 60, st.luz)},${lerp(12, 90, st.luz)})` : '#21180c';
            textoCabe(g, nom, 0, 0, WW - 60);
            g.restore();
          }
        }
        // sombra del cilindro, brillo y cristal
        gr = g.createLinearGradient(0, WY, 0, WY + WH); gr.addColorStop(0, 'rgba(8,6,3,.82)'); gr.addColorStop(.3, 'rgba(8,6,3,0)'); gr.addColorStop(.7, 'rgba(8,6,3,0)'); gr.addColorStop(1, 'rgba(8,6,3,.85)');
        g.fillStyle = gr; g.fillRect(WX, WY, WW, WH);
        gr = g.createLinearGradient(0, SEL - 70, 0, SEL - 30); gr.addColorStop(0, 'rgba(255,250,235,0)'); gr.addColorStop(.6, 'rgba(255,250,235,.18)'); gr.addColorStop(1, 'rgba(255,250,235,0)');
        g.fillStyle = gr; g.fillRect(WX, SEL - 70, WW, 40);
        if (st.luz > 0) { gr = g.createRadialGradient(CX, SEL, 20, CX, SEL, 360); gr.addColorStop(0, `rgba(120,225,255,${.42 * st.luz})`); gr.addColorStop(1, 'rgba(120,225,255,0)'); g.fillStyle = gr; g.fillRect(WX, WY, WW, WH); }
        gr = g.createLinearGradient(0, WY, 0, WY + WH * .5); gr.addColorStop(0, 'rgba(255,255,255,.13)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(WX, WY, WW, WH * .5);
        g.restore();
      }
      function pintaRayos() {
        if (st.rayos <= 0) return;
        g.save(); g.globalCompositeOperation = 'lighter'; g.translate(CX, SEL);
        const a = st.rayos * (st.tRayos ? lerp(1, .42, clamp((st.t - st.tRayos - .5) / 1.6, 0, 1)) : 1), giro = st.t * .25;
        for (let i = 0; i < 18; i++) {
          const ang = giro + i * Math.PI * 2 / 18, w = .05 + .03 * Math.sin(i * 7.1), col = i % 3 ? '89,216,255' : '232,183,122';
          const gr = g.createRadialGradient(0, 0, 40, 0, 0, 980); gr.addColorStop(0, `rgba(${col},${.32 * a})`); gr.addColorStop(1, `rgba(${col},0)`);
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 980, ang - w, ang + w); g.closePath(); g.fill();
        }
        g.restore();
      }
      function pintaPolvo(dt) {
        g.save(); g.globalCompositeOperation = 'lighter';
        st.polvo.forEach(p => { p.y -= p.v * dt; p.x += Math.sin(st.t * .6 + p.f) * 6 * dt; if (p.y < -10) { p.y = 1090; p.x = Math.random() * 1920; }
          const a = .16 + .14 * Math.sin(st.t * 1.3 + p.f) + .3 * st.rayos; g.fillStyle = `rgba(160,220,255,${clamp(a, 0, .6)})`; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill(); });
        g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra(); pintaRayos(); pintaPolvo(dt);
        // el resplandor detrás del candado
        const gr = g.createRadialGradient(CX, 520, 60, CX, 520, 620); gr.addColorStop(0, `rgba(80,140,200,${.16 + .2 * st.luz})`); gr.addColorStop(1, 'rgba(80,140,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        pintaArco(st.abre); if (fijo) ponCapa(g, fijo); pintaRueda();
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      // los sonidos del candado del juego (si el portal los da) y, si no, unos sintéticos
      const son = {}; const S = o.sonidos || {};
      Promise.all([(S.tic || []).map(u => A.carga(u)), A.carga(S.encaja), A.carga(S.abre)].flat()).then(bs => { son.tic = bs.slice(0, (S.tic || []).length).filter(Boolean); son.encaja = bs[(S.tic || []).length]; son.abre = bs[(S.tic || []).length + 1]; });
      let nTic = 0, tTic = 0;
      function tic(vel) {
        const ac = A.ac; if (!ac) return; const t = ac.currentTime; if (t - tTic < .034) return; tTic = t;
        const gan = clamp(.28 + .04 * Math.min(vel, 12), .25, .7);
        if (son.tic && son.tic.length) A.muestra(son.tic[nTic++ % son.tic.length], { gan: gan * 1.6, vel: .92 + Math.random() * .16, wet: .42 });
        else A.clic({ f: 2600 + Math.random() * 900, gan, wet: .42, dur: .03 });
      }
      return {
        ajusta,
        espera() { st.items = st.items.length ? st.items : ['· · ·']; st.vel = 0; },
        async gira(bombo, k) {
          const n = bombo.length; st.items = bombo.slice(); st.abre = 0; st.luz = 0; st.rayos = 0; st.tRayos = 0; st.elegido = null;
          // de dónde a dónde: unas 34–40 posiciones más allá (tres o cuatro vueltas al bombo), y que caiga en el elegido
          const p0 = Math.round(st.pos); let p1 = p0 + 34; p1 += ((k - p1) % n + n) % n;           // p1 ≡ k (mód. n)
          st.pos = p0; st.elegido = p1;
          const f = recorrido(p0, p1, { p: 2.45 });
          const ac = A.crea(), zumbido = A.continuo({ f: 900, q: .7, wet: .3 });
          // el golpe de arranque y un dron grave que crece
          if (ac) {
            A.nota(55, { tipo: 'sawtooth', dur: 4.9, gan: .07, ataque: 1.2, filtro: { f: 320 }, wet: .5 });
            A.nota(82.4, { tipo: 'sawtooth', dur: 4.9, gan: .05, ataque: 1.6, filtro: { f: 420 }, wet: .5, t: .1 });
            A.nota(116.5, { tipo: 'triangle', dur: 4.8, gan: .045, ataque: 2.2, filtro: { f: 900 }, wet: .6, t: .2 });
            A.nota(60, { tipo: 'sine', t: .32, dur: .5, gan: .5, desliza: 38 });
          }
          await new Promise(ok => {
            const t0 = performance.now(); let ult = Math.floor(p0 + .5), antes = p0;
            (function paso() {
              const t = (performance.now() - t0) / 1000, p = f(Math.min(t, f.T));
              st.vel = (p - antes) * 60; antes = p; st.pos = p;
              const cel = Math.floor(p + .5); if (cel !== ult) { ult = cel; tic(Math.abs(st.vel)); }
              if (zumbido) { A.pon(zumbido.g.gain, clamp(Math.abs(st.vel) / 26, 0, 1) * .16, .05); A.pon(zumbido.f.frequency, 500 + 90 * Math.abs(st.vel), .05); }
              if (t < f.T) requestAnimationFrame(paso); else { st.pos = p1; st.vel = 0; if (zumbido) zumbido.para(.2); ok(); }
            })();
          });
          // encaja… y el candado se abre en el nombre
          if (son.encaja) A.muestra(son.encaja, { gan: 1, wet: .5 }); else A.clic({ f: 1400, q: 1.2, gan: .8, dur: .09, wet: .5 });
          await new Promise(ok => setTimeout(ok, 260));
          if (son.abre) A.muestra(son.abre, { gan: 1.1, wet: .6 }); else { A.clic({ f: 900, q: 1, gan: .9, dur: .14, wet: .6 }); }
          if (A.ac) { A.nota(41, { tipo: 'sine', dur: 1.6, gan: .55, desliza: 30, wet: .3 }); [1318.5, 1760, 2349.3, 3136].forEach((fq, i) => A.nota(fq, { tipo: 'triangle', t: .05 + i * .07, dur: 2.2, gan: .05, wet: .9 })); }
          st.tRayos = st.t;
          await new Promise(ok => { const t0 = performance.now(); (function paso() { const u = (performance.now() - t0) / 700; st.abre = clamp(u, 0, 1); st.luz = eo(u, 2); st.rayos = clamp(u * 1.4, 0, 1); if (u < 1) requestAnimationFrame(paso); else ok(); })(); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «radio» · Acústica · La cabaña: la radio de la cabaña ──
     Una radio de madera de los años 40, con el dial iluminado en ámbar, los nombres apuntados como emisoras, la aguja roja, el
     ojo mágico verde y dos mandos. La aguja busca de un lado a otro entre la estática (cada emisora suena un instante al pasar),
     se pasa, vuelve… y sintoniza: la estática se va, el ojo mágico se cierra y suena la sintonía. */
  TEMAS.radio = {
    fuentes: ['300 22px Jost', '500 24px Jost', '200 110px Jost'],
    css: `
.lmv-t-radio .lmv-velo{background:radial-gradient(ellipse at 50% 55%,rgba(36,26,16,.96) 0%,rgba(12,9,6,.985) 60%,rgba(4,3,2,.995) 100%)}
.lmv-t-radio .lmv-cab{top:52px}
.lmv-t-radio .lmv-ceja{font:300 20px/1 Jost,system-ui,sans-serif;letter-spacing:.5em;text-transform:uppercase;color:rgba(255,246,222,.78)}
.lmv-t-radio .lmv-grupo{margin-top:12px;font:300 18px/1 Jost,system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:rgba(255,246,222,.48)}
.lmv-t-radio .lmv-nombre{top:104px;font:200 104px/1.12 Jost,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fff;text-shadow:0 0 40px rgba(255,190,96,.55),0 4px 24px rgba(0,0,0,.9)}
.lmv-t-radio .lmv-nota{top:902px;font:300 20px/1.3 Jost,system-ui,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,246,222,.62)}
.lmv-t-radio .lmv-pie{bottom:46px}
.lmv-t-radio .lmv-b{display:inline-flex;align-items:center;gap:.8em;padding:20px 34px;border-radius:9px;border:1px solid rgba(255,255,255,.72);background:rgba(8,12,14,.46);color:#fff;font:300 22px/1 Jost,system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;transition:background .15s,border-color .15s}
.lmv-t-radio .lmv-b:hover{background:rgba(255,255,255,.16);border-color:#fff}
.lmv-t-radio .lmv-b.lmv-otra{background:#ffbe60;border-color:#ffbe60;color:#201608;font-weight:400}
.lmv-t-radio .lmv-b.lmv-otra:hover{background:#ffd08a}
.lmv-t-radio .lmv-cargando{color:#ffbe60}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g;
      const CX = 960, KX = 330, KY = 250, KW = 1260, KH = 610;            // la caja
      const DX = 440, DY = 322, DW = 1040, DH = 218;                       // el dial
      const SX0 = DX + 40, SX1 = DX + DW - 40;                             // dónde van las emisoras
      const st = { items: [], x: SX0, sint: 0, sen: 0, t: 0, elegido: -1, brillo: 0, mando: 0 };
      let fijo = null, raf = 0, vivo = true;
      const posDe = i => SX0 + (i + .5) * (SX1 - SX0) / Math.max(1, st.items.length);
      function pintaCaja(g) {
        g.save();
        // sombra y caja de nogal, con el techo redondeado
        g.shadowColor = 'rgba(0,0,0,.75)'; g.shadowBlur = 70; g.shadowOffsetY = 30;
        rr(g, KX, KY, KW, KH, [150, 150, 28, 28]); g.fillStyle = '#3b2414'; g.fill(); g.shadowColor = 'transparent';
        let gr = g.createLinearGradient(0, KY, 0, KY + KH); gr.addColorStop(0, '#6e4627'); gr.addColorStop(.45, '#4c2f19'); gr.addColorStop(1, '#2b190c');
        rr(g, KX, KY, KW, KH, [150, 150, 28, 28]); g.fillStyle = gr; g.fill();
        // vetas
        g.save(); rr(g, KX, KY, KW, KH, [150, 150, 28, 28]); g.clip();
        for (let j = 0; j < 120; j++) {
          const y0 = KY + Math.random() * KH, amp = 2 + Math.random() * 9, fr = .004 + Math.random() * .01, ph = Math.random() * 6;
          g.strokeStyle = Math.random() < .5 ? `rgba(20,10,4,${.1 + Math.random() * .18})` : `rgba(160,110,60,${.05 + Math.random() * .1})`;
          g.lineWidth = .6 + Math.random() * 2.2; g.beginPath();
          for (let x = KX; x <= KX + KW; x += 12) { const y = y0 + Math.sin(x * fr + ph) * amp + Math.sin(x * fr * 3.7 + ph * 2) * amp * .3; if (x === KX) g.moveTo(x, y); else g.lineTo(x, y); }
          g.stroke();
        }
        // luz cálida de la lámpara, arriba a la izquierda
        gr = g.createRadialGradient(KX + 300, KY + 60, 20, KX + 300, KY + 60, 900); gr.addColorStop(0, 'rgba(255,200,130,.22)'); gr.addColorStop(1, 'rgba(255,200,130,0)'); g.fillStyle = gr; g.fillRect(KX, KY, KW, KH);
        g.restore();
        // filos
        rr(g, KX + 2, KY + 2, KW - 4, KH - 4, [148, 148, 26, 26]); g.lineWidth = 3; g.strokeStyle = 'rgba(255,214,160,.28)'; g.stroke();
        rr(g, KX + 34, KY + 34, KW - 68, KH - 68, [120, 120, 14, 14]); g.lineWidth = 2; g.strokeStyle = 'rgba(15,8,3,.55)'; g.stroke();
        // marco del dial
        rr(g, DX - 18, DY - 18, DW + 36, DH + 36, 30); g.fillStyle = '#20130a'; g.fill();
        rr(g, DX - 18, DY - 18, DW + 36, DH + 36, 30); g.lineWidth = 3; gr = g.createLinearGradient(0, DY - 18, 0, DY + DH + 18); gr.addColorStop(0, '#e8c27a'); gr.addColorStop(1, '#7a5420'); g.strokeStyle = gr; g.stroke();
        // la rejilla del altavoz (tela) con sus listones
        const GX = 540, GY = 650, GW = 840, GH = 168;
        rr(g, GX, GY, GW, GH, 18); g.fillStyle = '#5b4a35'; g.fill();
        g.save(); rr(g, GX, GY, GW, GH, 18); g.clip();
        for (let y = GY; y < GY + GH; y += 4) { g.fillStyle = 'rgba(30,20,10,.35)'; g.fillRect(GX, y, GW, 1.6); }
        for (let x = GX; x < GX + GW; x += 4) { g.fillStyle = 'rgba(200,170,120,.10)'; g.fillRect(x, GY, 1.6, GH); }
        gr = g.createLinearGradient(0, GY, 0, GY + GH); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = gr; g.fillRect(GX, GY, GW, GH);
        g.restore();
        for (let i = 1; i < 6; i++) { const x = GX + i * GW / 6; rr(g, x - 9, GY - 6, 18, GH + 12, 8); gr = g.createLinearGradient(x - 9, 0, x + 9, 0); gr.addColorStop(0, '#2b190c'); gr.addColorStop(.5, '#6e4627'); gr.addColorStop(1, '#2b190c'); g.fillStyle = gr; g.fill(); }
        rr(g, GX, GY, GW, GH, 18); g.lineWidth = 3; g.strokeStyle = 'rgba(15,8,3,.7)'; g.stroke();
        // la placa de latón
        rr(g, CX - 170, 832, 340, 34, 7); gr = g.createLinearGradient(0, 832, 0, 866); gr.addColorStop(0, '#f0d58e'); gr.addColorStop(1, '#9a6e2a'); g.fillStyle = gr; g.fill();
        g.fillStyle = '#3a2208'; g.font = '500 15px Jost, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        textoCabe(g, 'L A   C A B A Ñ A   ·   A C Ú S T I C A', CX, 849.5, 310);
        g.restore();
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) fijo = capaFija(L.k, pintaCaja, KX - 100, KY - 90, KW + 200, KH + 200); }
      function pintaDial() {
        g.save(); rr(g, DX, DY, DW, DH, 18); g.clip();
        const b = .78 + .22 * st.brillo;
        let gr = g.createRadialGradient(CX, DY + DH * .55, 40, CX, DY + DH * .55, DW * .62);
        gr.addColorStop(0, `rgba(255,${Math.round(226 * b + 20)},${Math.round(160 * b)},1)`); gr.addColorStop(.6, `rgba(${Math.round(240 * b)},${Math.round(172 * b)},${Math.round(84 * b)},1)`); gr.addColorStop(1, '#7a4a1a');
        g.fillStyle = gr; g.fillRect(DX, DY, DW, DH);
        // la escala
        g.strokeStyle = 'rgba(58,35,16,.85)'; g.fillStyle = 'rgba(58,35,16,.88)'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(SX0 - 10, DY + 162); g.lineTo(SX1 + 10, DY + 162); g.stroke();
        for (let x = SX0, k = 0; x <= SX1 + .1; x += (SX1 - SX0) / 60, k++) { const l = k % 10 === 0 ? 16 : k % 5 === 0 ? 11 : 6; g.lineWidth = k % 10 === 0 ? 2 : 1.2; g.beginPath(); g.moveTo(x, DY + 162); g.lineTo(x, DY + 162 + l); g.stroke(); }
        g.font = '300 17px Jost, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
        ['530', '600', '700', '800', '1000', '1200', '1600'].forEach((t, i) => g.fillText(t, SX0 + i * (SX1 - SX0) / 6, DY + 204));
        g.font = '400 13px Jost, system-ui, sans-serif'; g.fillText('kHz', SX1 + 2, DY + 150);
        // las emisoras (los nombres), en dos filas
        g.font = '500 23px Jost, system-ui, sans-serif'; g.textBaseline = 'middle';
        const n = st.items.length, ancho = (SX1 - SX0) / Math.max(1, n) * 2 - 14;
        st.items.forEach((nom, i) => {
          const x = posDe(i), y = i % 2 ? DY + 112 : DY + 62, cerca = clamp(1 - Math.abs(st.x - x) / 26, 0, 1);
          const sint = i === st.elegido ? st.sint : 0;
          g.save(); g.translate(x, y);
          if (sint > 0 || cerca > 0) { g.shadowColor = `rgba(255,255,230,${.9 * Math.max(sint, cerca * .7)})`; g.shadowBlur = 18; }
          g.fillStyle = sint > 0 ? `rgba(${lerp(58, 140, sint)},${lerp(35, 20, sint)},${lerp(16, 10, sint)},1)` : 'rgba(58,35,16,.88)';
          g.font = `${sint > 0 ? 600 : 500} ${Math.round(23 + 5 * sint)}px Jost, system-ui, sans-serif`;
          textoCabe(g, nom.toUpperCase(), 0, 0, Math.max(60, ancho));
          g.restore();
          g.fillStyle = 'rgba(58,35,16,.7)'; g.fillRect(x - 1, i % 2 ? DY + 128 : DY + 80, 2, i % 2 ? 30 : 78);
        });
        // cristal
        gr = g.createLinearGradient(0, DY, 0, DY + DH); gr.addColorStop(0, 'rgba(255,255,255,.22)'); gr.addColorStop(.35, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.18)'); g.fillStyle = gr; g.fillRect(DX, DY, DW, DH);
        // la aguja
        g.fillStyle = 'rgba(40,10,5,.35)'; g.fillRect(st.x + 3, DY + 8, 4, DH - 16);
        gr = g.createLinearGradient(st.x - 2, 0, st.x + 2, 0); gr.addColorStop(0, '#7a1410'); gr.addColorStop(.5, '#e0473a'); gr.addColorStop(1, '#7a1410');
        g.fillStyle = gr; g.fillRect(st.x - 2, DY + 6, 4, DH - 12); g.fillStyle = '#5a0e0a'; rr(g, st.x - 7, DY + 2, 14, 12, 3); g.fill();
        g.restore();
        // el resplandor del dial sobre la madera
        g.save(); rr(g, KX, KY, KW, KH, [150, 150, 28, 28]); g.clip(); g.globalCompositeOperation = 'lighter'; gr = g.createRadialGradient(CX, DY + DH / 2, 100, CX, DY + DH / 2, 760); gr.addColorStop(0, `rgba(255,170,70,${.10 + .12 * st.brillo})`); gr.addColorStop(1, 'rgba(255,170,70,0)'); g.fillStyle = gr; g.fillRect(KX, KY, KW, KH); g.restore();
      }
      function pintaOjo() {                                // el ojo mágico: se cierra cuanto más cerca de una emisora
        const x = CX, y = 598, r = 30, abre = lerp(1.9, .08, clamp(st.sen, 0, 1));
        g.save(); g.beginPath(); g.arc(x, y, r + 7, 0, 6.283); g.fillStyle = '#1a1008'; g.fill();
        g.lineWidth = 3; g.strokeStyle = '#b8873c'; g.stroke();
        let gr = g.createRadialGradient(x, y, 2, x, y, r); gr.addColorStop(0, '#d9ffd0'); gr.addColorStop(.35, '#59f07a'); gr.addColorStop(1, '#0e5a24');
        g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fillStyle = gr; g.fill();
        g.beginPath(); g.moveTo(x, y); g.arc(x, y, r + 1, -Math.PI / 2 - abre / 2, -Math.PI / 2 + abre / 2); g.closePath(); g.fillStyle = '#062010'; g.fill();
        g.beginPath(); g.arc(x, y, 6, 0, 6.283); g.fillStyle = '#0b2a14'; g.fill();
        g.globalCompositeOperation = 'lighter'; gr = g.createRadialGradient(x, y, r, x, y, r * 3); gr.addColorStop(0, `rgba(90,255,120,${.18 + .25 * st.sen})`); gr.addColorStop(1, 'rgba(90,255,120,0)'); g.fillStyle = gr; g.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
        g.restore();
      }
      function pintaMando(x, y, ang) {
        g.save(); g.translate(x, y);
        g.beginPath(); g.arc(4, 8, 54, 0, 6.283); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill();
        let gr = g.createRadialGradient(-14, -16, 4, 0, 0, 54); gr.addColorStop(0, '#8a5a32'); gr.addColorStop(.6, '#3d2412'); gr.addColorStop(1, '#1c0f06');
        g.beginPath(); g.arc(0, 0, 50, 0, 6.283); g.fillStyle = gr; g.fill();
        g.rotate(ang);
        for (let i = 0; i < 24; i++) { g.rotate(Math.PI / 12); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(44, -2, 7, 4); }
        gr = g.createLinearGradient(0, -30, 0, 30); gr.addColorStop(0, '#f0d58e'); gr.addColorStop(1, '#8a5f22');
        g.beginPath(); g.arc(0, 0, 30, 0, 6.283); g.fillStyle = gr; g.fill(); g.fillStyle = '#3a2208'; g.fillRect(-3, -28, 6, 18);
        g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra(); if (fijo) ponCapa(g, fijo); pintaDial(); pintaOjo();
        pintaMando(KX + 120, 735, -.9 + st.sint * .5); pintaMando(KX + KW - 120, 735, (st.x - SX0) / 60);
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      return {
        ajusta,
        espera() { if (!st.items.length) st.items = ['···']; },
        async gira(bombo, k) {
          const n = bombo.length; st.items = bombo.slice(); st.elegido = -1; st.sint = 0; st.brillo = 0;
          const paso = (SX1 - SX0) / n, xt = posDe(k);
          // el camino de la aguja: barre el dial hasta un extremo, vuelve hasta el otro (el más lejano del elegido), se acerca,
          // se pasa (una emisora y media), vuelve pasándose un poco… y sintoniza. Cada emisora suena un instante al pasar.
          const e2 = xt < CX ? SX1 - 24 : SX0 + 24, e1 = xt < CX ? SX0 + 6 : SX1 - 6, dir = Math.sign(xt - e2) || 1, x0 = st.x;
          const pts = [[0, x0], [.3, x0 - 20 * (Math.sign(e1 - x0) || 1)], [1.35, e1], [2.4, e2],
            [3.4, clamp(xt + dir * Math.min(1.6 * paso, 150), SX0, SX1)], [4.1, clamp(xt - dir * Math.min(.7 * paso, 70), SX0, SX1)], [4.65, xt + dir * 7], [5.0, xt]];
          const ac = A.crea(), estatica = A.continuo({ f: 1900, q: .6, wet: .05 }), emisora = ac ? ac.createGain() : null;
          let oscs = [];
          if (ac) {
            A.pon(estatica.g.gain, .2, .3);
            // lo que se oye de las emisoras al pasar: un acorde distinto en cada una, como música lejana
            emisora.gain.value = 0; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = .9; emisora.connect(bp); bp.connect(A.via(1, .25));
            oscs = [0, 1, 2].map(j => { const os = ac.createOscillator(); os.type = j ? 'triangle' : 'sawtooth'; os.frequency.value = 220; os.connect(emisora); os.start(); return os; });
            A.nota(140, { tipo: 'sine', dur: .25, gan: .25, t: .02 });       // el «clac» del mando
          }
          const ACORDES = [[261.6, 329.6, 392], [293.7, 370, 440], [246.9, 311.1, 370], [349.2, 440, 523.3], [196, 246.9, 293.7], [329.6, 415.3, 493.9]];
          let antesEmisora = -1, crep = 0;
          await new Promise(ok => {
            const t0 = performance.now(); let antes = st.x;
            (function paso_() {
              const t = Math.min(T_GIRO, (performance.now() - t0) / 1000);
              let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
              const [ta, xa] = pts[i], [tb, xb] = pts[i + 1], u = clamp((t - ta) / (tb - ta), 0, 1);
              st.x = lerp(xa, xb, eio(u));
              const vel = Math.abs(st.x - antes) * 60; antes = st.x; st.mando += vel;
              // la señal: la emisora más cercana
              let mejor = -1, d = 1e9; for (let j = 0; j < n; j++) { const dd = Math.abs(st.x - posDe(j)); if (dd < d) { d = dd; mejor = j; } }
              const sen = clamp(1 - d / 26, 0, 1); st.sen = sen;
              if (ac) {
                A.pon(estatica.g.gain, .05 + .18 * (1 - sen) + (Math.random() < .04 ? .15 : 0), .03);
                A.pon(emisora.gain, .14 * sen, .03);
                if (mejor !== antesEmisora && sen > .2) { antesEmisora = mejor; const c = ACORDES[mejor % ACORDES.length]; oscs.forEach((os, j) => os.frequency.setTargetAtTime(c[j] * (mejor % 2 ? 1 : 2), ac.currentTime, .01)); }
                if (++crep % 7 === 0 && Math.random() < .5) A.clic({ f: 3000 + Math.random() * 3000, gan: .06 + Math.random() * .08, dur: .01 });
              }
              if (t < T_GIRO) requestAnimationFrame(paso_); else ok();
            })();
          });
          st.x = xt; st.elegido = k;
          // sintonizado: se va la estática, se cierra el ojo y suena la sintonía
          if (ac) {
            estatica.para(.6); A.pon(emisora.gain, 0, .25); setTimeout(() => oscs.forEach(os => { try { os.stop(); } catch (e) {} }), 600);
            const mel = [[783.99, 0], [659.25, .16], [523.25, .32], [659.25, .48], [783.99, .64], [1046.5, .82]];
            mel.forEach(([f, t]) => { A.nota(f, { tipo: 'triangle', t: .12 + t, dur: .9, gan: .11, wet: .45 }); A.nota(f * 2, { tipo: 'sine', t: .12 + t, dur: .5, gan: .03, wet: .45 }); });
            [261.63, 329.63, 392, 523.25].forEach(f => A.nota(f, { tipo: 'sine', t: .95, dur: 2.4, gan: .06, ataque: .05, wet: .6 }));
          }
          await new Promise(ok => { const t0 = performance.now(); (function p_() { const u = (performance.now() - t0) / 650; st.sint = eo(u, 2); st.brillo = st.sint; st.sen = 1; if (u < 1) requestAnimationFrame(p_); else ok(); })(); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «disco» · Fonógrafo: el disco que gira y la aguja que cae en un nombre ──
     Un disco de pizarra negra con los nombres en sectores (como una ruleta), su etiqueta dorada y el brazo de latón con el diafragma.
     Se da cuerda (trinquete), el disco arranca con su crepitar, cada sector golpea la aguja al pasar, frena… y la aguja cae en el
     nombre: suena una fanfarria «de cilindro», con su crepitar. El nombre sale en una placa de latón. */
  TEMAS.disco = {
    fuentes: ['500 30px Jost', '400 96px "Bodoni 72"'],
    css: `
.lmv-t-disco .lmv-velo{background:radial-gradient(ellipse at 40% 50%,rgba(34,24,14,.965) 0%,rgba(20,16,12,.985) 55%,rgba(8,6,4,.995) 100%)}
.lmv-t-disco .lmv-cab{top:250px;left:1150px;right:60px}
.lmv-t-disco .lmv-ceja{font:400 22px/1 Jost,"Iowan Old Style",Palatino,Georgia,serif;letter-spacing:.5em;text-transform:uppercase;color:#C9A24A}
.lmv-t-disco .lmv-grupo{margin-top:14px;font:300 18px/1 Jost,"Iowan Old Style",Palatino,Georgia,serif;letter-spacing:.3em;text-transform:uppercase;color:#9C8E77}
.lmv-t-disco .lmv-nombre{top:470px;left:1150px;right:60px;font:italic 400 92px/1.1 "Bodoni 72","Bodoni MT",Didot,"Playfair Display",Georgia,serif;color:#F2D793;text-shadow:0 0 30px rgba(240,184,96,.45),0 4px 18px rgba(0,0,0,.9)}
.lmv-t-disco .lmv-nota{top:640px;left:1150px;right:60px;font:italic 400 24px/1.35 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;color:#DCCDB0}
.lmv-t-disco .lmv-pie{left:1150px;right:60px;bottom:auto;top:760px}
.lmv-t-disco .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:16px 30px;border-radius:6px;border:1px solid rgba(201,162,74,.6);background:rgba(20,14,9,.7);color:#DCCDB0;font:400 20px/1 Jost,Georgia,serif;letter-spacing:.24em;text-transform:uppercase;transition:color .25s,border-color .25s,background .25s}
.lmv-t-disco .lmv-b:hover{color:#F0B860;border-color:#C9A24A}
.lmv-t-disco .lmv-b.lmv-otra{background:linear-gradient(#F2D793,#C9A24A 55%,#8a6a2a);border-color:#F2D793;color:#2A1E0A;font-weight:500}
.lmv-t-disco .lmv-b.lmv-otra:hover{color:#000}
.lmv-t-disco .lmv-cargando{color:#F0B860}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g;
      const CX = 640, CY = 540, R = 400, RL = 112;
      const st = { items: [], sec: 0, ang: 0, vel: 0, aguja: 0, luz: -1, brillo: 0, t: 0, elegido: -1 };
      let surcos = null, raf = 0, vivo = true;
      function pintaSurcos(g) {           // lo que no gira a la vista: el plato, los surcos y sus brillos
        g.save();
        g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 50; g.shadowOffsetY = 20; g.beginPath(); g.arc(CX, CY, R + 14, 0, 6.283); g.fillStyle = '#2a2016'; g.fill(); g.shadowColor = 'transparent';
        let gr = g.createRadialGradient(CX, CY, R, CX, CY, R + 14); gr.addColorStop(0, '#6d5a3a'); gr.addColorStop(1, '#2a2016'); g.beginPath(); g.arc(CX, CY, R + 14, 0, 6.283); g.fillStyle = gr; g.fill();
        g.restore();
      }
      function ajusta(s) { if (L.ajusta(s) || !surcos) surcos = capaFija(L.k, pintaSurcos, CX - R - 60, CY - R - 60, 2 * R + 120, 2 * R + 120); }
      function pintaDisco() {
        const n = st.sec, a0 = st.ang;
        g.save(); g.translate(CX, CY);
        // sectores
        for (let j = 0; j < n; j++) {
          const a = a0 + j * 2 * Math.PI / n, b = a + 2 * Math.PI / n;
          g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a, b); g.closePath();
          g.fillStyle = j % 2 ? '#1c140e' : '#120d09'; g.fill();
        }
        // los surcos
        g.lineWidth = 1;
        for (let r = RL + 14; r < R - 4; r += 5) { g.strokeStyle = `rgba(255,240,210,${.025 + .02 * Math.sin(r * .7)})`; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.stroke(); }
        // brillos fijos (la luz no gira con el disco)
        g.save(); g.rotate(-st.ang); g.rotate(-.6);
        for (const sgn of [0, Math.PI]) { const gr = g.createRadialGradient(0, 0, RL, 0, 0, R); gr.addColorStop(0, 'rgba(255,230,190,0)'); gr.addColorStop(.5, 'rgba(255,230,190,.10)'); gr.addColorStop(1, 'rgba(255,230,190,0)');
          g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, sgn - .22, sgn + .22); g.closePath(); g.fill(); }
        g.restore();
        // las divisiones y los nombres
        const vel = Math.abs(st.vel), copias = vel > 3 ? Math.min(9, 1 + Math.floor(vel / 2.2)) : 1, peso = c => copias > 1 ? Math.pow(1 - c / copias, 1.7) * 2.6 / copias : 1;
        g.font = `500 ${n > 14 ? 24 : n > 10 ? 28 : 31}px Jost, "Iowan Old Style", Georgia, serif`; g.textAlign = 'right'; g.textBaseline = 'middle';
        for (let j = 0; j < n; j++) {
          const a = a0 + j * 2 * Math.PI / n;
          g.save(); g.rotate(a); g.strokeStyle = 'rgba(201,162,74,.75)'; g.lineWidth = 2; g.beginPath(); g.moveTo(RL + 6, 0); g.lineTo(R - 2, 0); g.stroke(); g.restore();
          const nom = st.items[j % st.items.length] || '';
          for (let c = 0; c < copias; c++) {
            const aa = a + Math.PI / n - (copias > 1 ? (c / copias) * st.vel / 60 : 0);
            g.save(); g.rotate(aa); g.globalAlpha = Math.min(1, peso(c));
            const luz = st.luz === j ? st.brillo : 0;
            g.fillStyle = luz > 0 ? `rgb(${lerp(220, 255, luz)},${lerp(205, 215, luz)},${lerp(176, 140, luz)})` : '#DCCDB0';
            if (luz > 0) { g.shadowColor = `rgba(240,184,96,${luz})`; g.shadowBlur = 24; }
            textoCabe(g, nom.toUpperCase(), R - 26, 0, R - RL - 50);
            g.restore();
          }
        }
        // la etiqueta del centro
        let gr = g.createRadialGradient(-20, -26, 6, 0, 0, RL); gr.addColorStop(0, '#f2d793'); gr.addColorStop(.7, '#c9a24a'); gr.addColorStop(1, '#8a6a2a');
        g.beginPath(); g.arc(0, 0, RL, 0, 6.283); g.fillStyle = gr; g.fill();
        g.lineWidth = 2; g.strokeStyle = 'rgba(60,40,10,.6)'; g.beginPath(); g.arc(0, 0, RL - 10, 0, 6.283); g.stroke();
        g.save(); g.rotate(a0); g.fillStyle = '#2A1E0A'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = '500 15px Jost, Georgia, serif'; g.fillText('LM AT HOME', 0, -46);
        g.font = 'italic 400 30px "Bodoni 72", "Bodoni MT", Didot, Georgia, serif'; g.fillText('Fonógrafo', 0, -8);
        g.font = '400 13px Jost, Georgia, serif'; g.fillText('2.º GP · VOLUNTARIOS', 0, 30);
        g.restore();
        g.beginPath(); g.arc(0, 0, 9, 0, 6.283); g.fillStyle = '#0c0805'; g.fill(); g.beginPath(); g.arc(-2, -2, 4, 0, 6.283); g.fillStyle = '#c8c8c8'; g.fill();
        // la luz del nombre elegido
        if (st.luz >= 0 && st.brillo > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const a = a0 + st.luz * 2 * Math.PI / n;
          const gr2 = g.createRadialGradient(R * .7, 0, 10, R * .7, 0, R * .55); gr2.addColorStop(0, `rgba(240,184,96,${.28 * st.brillo})`); gr2.addColorStop(1, 'rgba(240,184,96,0)');
          g.rotate(a + Math.PI / n); g.fillStyle = gr2; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, -Math.PI / n, Math.PI / n); g.closePath(); g.fill(); g.restore(); }
        g.restore();
      }
      function pintaBrazo() {             // el brazo de latón (cuello de cisne) y el diafragma, con la aguja a las tres en punto
        const sube = 1 - st.aguja, bx = 1112, by = 150, nx = CX + R - 14, ny = CY, sx = 1066, sy = 488 - 8 * sube;
        const camino = (dx, dy) => { g.beginPath(); g.moveTo(bx + dx, by + dy); g.bezierCurveTo(bx + 18 + dx, by + 170 + dy, 1100 + dx, 372 + dy - 6 * sube, sx + 12 + dx, sy - 40 + dy); g.lineTo(sx + dx, sy + dy); };
        g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
        // sombra (más lejos cuanto más levantada)
        g.filter = 'blur(6px)'; g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 24; camino(10 + 14 * sube, 14 + 14 * sube); g.stroke();
        g.beginPath(); g.arc(sx + 12 + 14 * sube, sy + 16 + 14 * sube, 44, 0, 6.283); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill(); g.filter = 'none';
        // la base
        let gr = g.createRadialGradient(bx - 14, by - 14, 4, bx, by, 60); gr.addColorStop(0, '#fff0c4'); gr.addColorStop(.5, '#c9a24a'); gr.addColorStop(1, '#5c4219');
        g.beginPath(); g.arc(bx, by, 56, 0, 6.283); g.fillStyle = gr; g.fill();
        g.lineWidth = 2; g.strokeStyle = 'rgba(60,40,10,.6)'; g.beginPath(); g.arc(bx, by, 40, 0, 6.283); g.stroke();
        gr = g.createRadialGradient(bx - 6, by - 6, 2, bx, by, 22); gr.addColorStop(0, '#f6e2a8'); gr.addColorStop(1, '#6b4c1c'); g.beginPath(); g.arc(bx, by, 22, 0, 6.283); g.fillStyle = gr; g.fill();
        // el brazo: tubo de latón con su brillo
        gr = g.createLinearGradient(1080, 0, 1140, 0); gr.addColorStop(0, '#7a5a1e'); gr.addColorStop(.4, '#f2d793'); gr.addColorStop(.7, '#c9a24a'); gr.addColorStop(1, '#6b4c1c');
        g.strokeStyle = gr; g.lineWidth = 22; camino(0, 0); g.stroke();
        g.strokeStyle = 'rgba(255,248,220,.55)'; g.lineWidth = 4; camino(-5, 0); g.stroke();
        // el diafragma (la cajita con la mica) y la aguja
        g.translate(sx, sy); g.scale(1 + .05 * sube, 1 + .05 * sube);
        gr = g.createRadialGradient(-12, -14, 4, 0, 0, 48); gr.addColorStop(0, '#fff3cf'); gr.addColorStop(.45, '#c9a24a'); gr.addColorStop(1, '#4a3311');
        g.beginPath(); g.arc(0, 0, 44, 0, 6.283); g.fillStyle = gr; g.fill();
        gr = g.createRadialGradient(-6, -8, 2, 0, 0, 30); gr.addColorStop(0, 'rgba(250,245,230,.95)'); gr.addColorStop(1, 'rgba(190,175,150,.85)');
        g.beginPath(); g.arc(0, 0, 29, 0, 6.283); g.fillStyle = gr; g.fill(); g.lineWidth = 2; g.strokeStyle = 'rgba(60,40,10,.55)'; g.stroke();
        for (let r = 8; r < 29; r += 6) { g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.strokeStyle = 'rgba(120,100,70,.25)'; g.lineWidth = 1; g.stroke(); }
        g.beginPath(); g.arc(0, 0, 4, 0, 6.283); g.fillStyle = '#5c4219'; g.fill();
        g.setTransform(L.k, 0, 0, L.k, 0, 0);
        g.strokeStyle = '#d9d9d9'; g.lineWidth = 3; g.beginPath(); g.moveTo(sx - 26, sy + 30); g.lineTo(nx, ny - 2 - 12 * sube); g.stroke();
        g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(nx, ny - 2 - 12 * sube, 2.5, 0, 6.283); g.fill();
        g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra();
        let gr = g.createRadialGradient(CX - 140, CY - 260, 40, CX, CY, 1100); gr.addColorStop(0, 'rgba(240,184,96,.10)'); gr.addColorStop(1, 'rgba(240,184,96,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        if (surcos) ponCapa(g, surcos); if (st.sec) pintaDisco(); pintaBrazo();
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      return {
        ajusta,
        espera() { if (!st.sec) { st.items = ['· · ·']; st.sec = 8; } },
        async gira(bombo, k) {
          const n = bombo.length, rep = n < 8 ? Math.ceil(8 / n) : 1, S = n * rep;
          st.items = bombo.slice(); st.sec = S; st.luz = -1; st.brillo = 0; st.aguja = 0;
          const paso = 2 * Math.PI / S, kk = k + n * Math.floor(Math.random() * rep);     // en qué sector (si el bombo va repetido)
          // ángulo final: el centro del sector kk a las tres en punto (ángulo 0); unas cuatro vueltas y media en el sentido de las agujas
          const a0 = st.ang; let a1 = -(kk + .5) * paso; while (a1 < a0 + 4.5 * 2 * Math.PI) a1 += 2 * Math.PI;
          const f = recorrido(a0 / paso, a1 / paso, { p: 2.4, retro: .25, sobra: .06 });
          const ac = A.crea(); let crepita = null;
          if (ac) {
            for (let i = 0; i < 7; i++) A.clic({ t: i * .045, f: 1800 + i * 120, q: 4, gan: .25, dur: .02 });        // la cuerda (trinquete)
            crepita = A.continuo({ tipo: 'highpass', f: 2400, q: .5, wet: .1 });
          }
          await new Promise(ok => {
            const t0 = performance.now(); let antes = a0 / paso, ult = Math.floor(a0 / paso);
            (function p_() {
              const t = Math.min(f.T, (performance.now() - t0) / 1000), q = f(t);
              st.vel = (q - antes) * paso * 60; antes = q; st.ang = q * paso;
              const c = Math.floor(q); if (c !== ult) { ult = c; if (A.ac) A.clic({ f: 1200 + 60 * Math.min(20, Math.abs(st.vel) * 3), q: 2, gan: .32, dur: .025, wet: .15 }); }
              if (crepita) { A.pon(crepita.g.gain, .03 + clamp(Math.abs(st.vel) / 12, 0, 1) * .05 + (Math.random() < .08 ? .06 : 0), .02); }
              if (t < f.T) requestAnimationFrame(p_); else ok();
            })();
          });
          st.ang = a1; st.vel = 0; st.luz = kk;
          // cae la aguja… y suena la fanfarria, como en un cilindro de cera
          if (ac) {
            A.nota(70, { tipo: 'sine', dur: .25, gan: .45, desliza: 45 }); A.clic({ f: 900, q: .8, gan: .4, dur: .06 });
            const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1300; bp.Q.value = .6; bp.connect(A.via(1, .35));
            const v = ac.createGain(); v.gain.value = .9; v.connect(bp);
            [[392, .28], [523.25, .4], [659.25, .52], [783.99, .64]].forEach(([fq, t]) => A.nota(fq, { tipo: 'sawtooth', t, dur: .35, gan: .09, destino: v }));
            [523.25, 659.25, 783.99, 1046.5].forEach(fq => A.nota(fq, { tipo: 'sawtooth', t: .8, dur: 1.6, gan: .07, ataque: .02, destino: v }));
            setTimeout(() => { if (crepita) crepita.para(1.2); }, 1800);
          }
          await new Promise(ok => { const t0 = performance.now(); (function p_() { const u = (performance.now() - t0) / 500; st.aguja = eo(u, 2); st.brillo = eo(u, 2); if (u < 1) requestAnimationFrame(p_); else ok(); })(); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «cinta» · Magnetófono: el magnetófono de la caja de Alemania (17-oct-2026, guion v4.5, VOLUNTARIOS) ──
     Visto desde arriba: dos bobinas de aluminio, la cinta marrón que pasa por los tres cabezales (borrar, grabar y reproducir)
     y los nombres de la clase escritos en la propia cinta, separados por empalmes en diagonal. Al tirar se baja la tecla de
     rebobinar y la cinta corre hacia la izquierda a toda velocidad (MicroTapeRewind_SFXB.4110); frena (el trinquete de
     FF_JO_foley_metal_crank_slowdown); y el nombre que queda bajo el cabezal de reproducir se ilumina, con el clic de la tecla
     de reproducir, el ojo mágico que se abre y la cinta que arranca. Sin muestras, suena un silbido sintético que sigue a la cinta. */
  TEMAS.cinta = {
    fuentes: ['700 30px "Courier Prime"', '400 30px "Courier Prime"', '900 96px "Bodoni Moda"'],
    css: `
.lmv-t-cinta .lmv-velo{background:radial-gradient(ellipse at 34% 50%,rgba(38,30,22,.965) 0%,rgba(22,17,12,.985) 55%,rgba(8,6,4,.995) 100%)}
.lmv-t-cinta .lmv-cab{top:250px;left:1150px;right:60px}
.lmv-t-cinta .lmv-ceja{font:700 22px/1 "Courier Prime","Courier New",Courier,monospace;letter-spacing:.32em;text-transform:uppercase;color:#e5483b;text-shadow:0 0 14px rgba(229,72,59,.45)}
.lmv-t-cinta .lmv-grupo{margin-top:16px;font:400 19px/1 "Courier Prime","Courier New",Courier,monospace;letter-spacing:.1em;text-transform:uppercase;color:#b9ad95}
.lmv-t-cinta .lmv-nombre{top:440px;left:1150px;right:60px;font:900 88px/1.1 "Bodoni Moda","Bodoni 72","Bodoni MT",Didot,Georgia,serif;letter-spacing:.01em;color:#f3ead6;text-shadow:0 0 34px rgba(255,214,150,.32),0 4px 18px rgba(0,0,0,.9)}
.lmv-t-cinta .lmv-nota{top:620px;left:1150px;right:60px;font:400 22px/1.4 "Courier Prime","Courier New",Courier,monospace;color:#d8ccb2}
.lmv-t-cinta .lmv-pie{left:1150px;right:60px;bottom:auto;top:760px}
.lmv-t-cinta .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:16px 30px;border-radius:4px;border:1px solid rgba(239,229,207,.6);background:rgba(22,17,12,.72);color:#efe5cf;font:700 20px/1 "Courier Prime","Courier New",Courier,monospace;letter-spacing:.08em;text-transform:uppercase;transition:color .25s,border-color .25s,background .25s}
.lmv-t-cinta .lmv-b:hover{border-color:#efe5cf;background:rgba(239,229,207,.12)}
.lmv-t-cinta .lmv-b.lmv-otra{background:linear-gradient(#f4ecd8,#e2d3b2);border-color:#f4ecd8;color:#1e1a16}
.lmv-t-cinta .lmv-b.lmv-otra:hover{background:#fff6e2;color:#000}
.lmv-t-cinta .lmv-cargando{color:#e5483b}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g;
      const CU = '"Courier Prime","Courier New",Courier,monospace', BO = '"Bodoni Moda","Bodoni 72","Bodoni MT",Didot,Georgia,serif';
      const RL = { x: 330, y: 372 }, RR = { x: 830, y: 372 }, RF = 196;      // las bobinas: centro y radio del plato
      const TY = 708, TH = 52, X0 = 158, X1 = 1002;                            // la cinta por los cabezales (de poste a poste)
      const HX = [452, 590, 760], HN = ['BORRAR', 'GRABAR', 'REPRODUCIR'], PH = HX[2];
      const KY = 842, KX = [226, 336, 446, 556], KN = ['◀◀', '■', '▶', '●'];   // las teclas: rebobinar, parar, reproducir, grabar
      const st = { items: [], p: 0, vel: 0, aL: 0, aR: 0, luz: 0, ojo: .25, rew: 0, play: 0, t: 0, SW: 300, n: 0 };
      let fijo = null, raf = 0, vivo = true;
      const pack = (c) => { const k = Math.cos(st.p * .018); return c === 'L' ? 128 - 26 * k : 128 + 26 * k; };
      const metal = (g, x0, y0, x1, y1, a, b, c) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, a); gr.addColorStop(.5, b); gr.addColorStop(1, c); return gr; };
      function tornillo(g, x, y) {
        const gr = g.createRadialGradient(x - 2, y - 2, 1, x, y, 9); gr.addColorStop(0, '#e6e1d6'); gr.addColorStop(1, '#5b564d');
        g.beginPath(); g.arc(x, y, 8, 0, 6.283); g.fillStyle = gr; g.fill();
        g.strokeStyle = 'rgba(30,26,22,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 5, y + 2); g.lineTo(x + 5, y - 2); g.stroke();
      }
      function pintaFijo(g) {            // el chasis, la placa, los postes, las teclas (su hueco) y el marco del ojo mágico
        g.save();
        g.shadowColor = 'rgba(0,0,0,.75)'; g.shadowBlur = 60; g.shadowOffsetY = 24;
        rr(g, 80, 96, 1000, 900, 26); g.fillStyle = '#3a342c'; g.fill(); g.shadowColor = 'transparent';
        rr(g, 92, 108, 976, 876, 20); g.fillStyle = metal(g, 92, 108, 1068, 984, '#a39d92', '#8b857a', '#6f6a60'); g.fill();
        // cepillado del aluminio
        g.globalAlpha = .07; g.strokeStyle = '#fff'; g.lineWidth = 1;
        for (let y = 112; y < 980; y += 3) { g.beginPath(); g.moveTo(96, y + Math.sin(y * 1.7) * .8); g.lineTo(1064, y); g.stroke(); }
        g.globalAlpha = 1;
        [[118, 134], [1042, 134], [118, 958], [1042, 958]].forEach(([x, y]) => tornillo(g, x, y));
        // los huecos de las bobinas
        [RL, RR].forEach(c => { const gr = g.createRadialGradient(c.x, c.y, RF - 40, c.x, c.y, RF + 16); gr.addColorStop(0, '#24201b'); gr.addColorStop(1, '#4b453c');
          g.beginPath(); g.arc(c.x, c.y, RF + 12, 0, 6.283); g.fillStyle = gr; g.fill(); });
        // la placa de los cabezales (debajo de la cinta)
        rr(g, X0 - 40, TY - 92, X1 - X0 + 80, 176, 14); g.fillStyle = '#2b2620'; g.fill();
        rr(g, X0 - 34, TY - 86, X1 - X0 + 68, 164, 11); g.fillStyle = metal(g, 0, TY - 86, 0, TY + 78, '#4d463d', '#3a342d', '#2c2721'); g.fill();
        // la etiqueta crema, escrita a máquina
        g.save(); g.translate(796, 846); g.rotate(-.012);
        g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
        g.fillStyle = '#efe5cf'; g.fillRect(-150, -46, 300, 92); g.shadowColor = 'transparent';
        g.strokeStyle = 'rgba(120,96,60,.35)'; g.lineWidth = 1.5; g.strokeRect(-144, -40, 288, 80);
        g.fillStyle = '#1e1a16'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = `700 15px ${CU}`; g.fillText('LM AT HOME · 2.º GP', 0, -20);
        g.font = `900 30px ${BO}`; g.fillText('Magnetófono', 0, 6);
        g.font = `400 14px ${CU}`; g.fillStyle = '#c83a2c'; g.fillText('VOLUNTARIOS', 0, 30);
        g.restore();
        // el hueco de las teclas
        rr(g, KX[0] - 66, KY - 50, KX[3] - KX[0] + 132, 104, 10); g.fillStyle = '#26221d'; g.fill();
        // el marco del ojo mágico
        g.beginPath(); g.arc(1006, 846, 36, 0, 6.283); g.fillStyle = metal(g, 970, 810, 1042, 882, '#d8d2c6', '#8d877c', '#4e4942'); g.fill();
        g.beginPath(); g.arc(1006, 846, 27, 0, 6.283); g.fillStyle = '#0b120c'; g.fill();
        g.restore();
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) fijo = capaFija(L.k, pintaFijo); }
      function bobina(c, ang, rp) {
        g.save(); g.translate(c.x, c.y);
        // la cinta enrollada
        let gr = g.createRadialGradient(0, 0, 40, 0, 0, rp); gr.addColorStop(0, '#3b2414'); gr.addColorStop(.85, '#5c3a22'); gr.addColorStop(1, '#2e1c10');
        g.beginPath(); g.arc(0, 0, rp, 0, 6.283); g.fillStyle = gr; g.fill();
        g.strokeStyle = 'rgba(255,220,180,.06)'; g.lineWidth = 1; for (let r = 52; r < rp; r += 4) { g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.stroke(); }
        g.rotate(ang);
        // el plato de aluminio: el aro, tres radios anchos y el buje (por las ventanas se ve la cinta)
        const al = metal(g, -RF, -RF, RF, RF, '#e9e6df', '#a9a49a', '#6d685f');
        g.beginPath(); g.arc(0, 0, RF, 0, 6.283); g.arc(0, 0, RF - 16, 2 * Math.PI, 0, true); g.fillStyle = al; g.fill();
        for (let i = 0; i < 3; i++) {
          const a = i * 2.0944;
          g.beginPath(); g.arc(0, 0, RF - 12, a - .3, a + .3); g.arc(0, 0, 50, a + .62, a - .62, true); g.closePath(); g.fillStyle = al; g.fill();
          g.strokeStyle = 'rgba(40,36,30,.35)'; g.lineWidth = 2; g.stroke();
          // un agujero pequeño en cada radio
          g.beginPath(); g.arc(Math.cos(a) * (RF - 62), Math.sin(a) * (RF - 62), 13, 0, 6.283); g.fillStyle = 'rgba(30,22,16,.85)'; g.fill();
        }
        g.beginPath(); g.arc(0, 0, 52, 0, 6.283); g.fillStyle = metal(g, -52, -52, 52, 52, '#f2efe8', '#b3aea4', '#77726a'); g.fill();
        g.beginPath(); g.arc(0, 0, 18, 0, 6.283); g.fillStyle = '#2a2621'; g.fill();
        g.fillStyle = '#c9c4ba'; for (let i = 0; i < 3; i++) { g.save(); g.rotate(i * 2.0944); g.fillRect(-4, -18, 8, 9); g.restore(); }
        g.restore();
        // el brillo, que no gira
        g.save(); g.globalCompositeOperation = 'lighter';
        gr = g.createLinearGradient(c.x - RF, c.y - RF, c.x + RF, c.y + RF); gr.addColorStop(.35, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,.10)'); gr.addColorStop(.65, 'rgba(255,255,255,0)');
        g.beginPath(); g.arc(c.x, c.y, RF, 0, 6.283); g.fillStyle = gr; g.fill(); g.restore();
      }
      function cinta() {
        const rl = pack('L'), rr_ = pack('R');
        // del poste izquierdo a la bobina izquierda y del derecho a la derecha (por debajo de los platos)
        g.save(); g.lineCap = 'butt'; g.strokeStyle = '#4a2e1b'; g.lineWidth = 20;
        g.beginPath(); g.moveTo(X0, TY); g.lineTo(RL.x - rl * .96, RL.y + rl * .28); g.stroke();
        g.beginPath(); g.moveTo(X1, TY); g.lineTo(RR.x + rr_ * .96, RR.y + rr_ * .28); g.stroke();
        g.restore();
        // la cinta por los cabezales: la banda donde van los nombres
        g.save();
        let gr = g.createLinearGradient(0, TY - TH / 2, 0, TY + TH / 2); gr.addColorStop(0, '#3a2414'); gr.addColorStop(.25, '#5e3c23'); gr.addColorStop(.75, '#55361f'); gr.addColorStop(1, '#2f1d10');
        g.fillStyle = gr; g.fillRect(X0, TY - TH / 2, X1 - X0, TH);
        g.beginPath(); g.rect(X0, TY - TH / 2, X1 - X0, TH); g.clip();
        const n = st.n || 1, SW = st.SW, vel = Math.abs(st.vel), copias = vel > .05 ? Math.min(8, 1 + Math.floor(vel * 9)) : 1;
        const j0 = Math.floor(st.p - (PH - X0) / SW) - 1, j1 = Math.ceil(st.p + (X1 - PH) / SW) + 1;
        g.font = `700 ${n > 18 ? 26 : 29}px ${CU}`; g.textAlign = 'center'; g.textBaseline = 'middle';
        for (let j = j0; j <= j1; j++) {
          const x = PH + (j - st.p) * SW, nom = (st.items[((j % n) + n) % n] || '').toUpperCase();
          // el empalme en diagonal entre un nombre y el siguiente
          g.strokeStyle = 'rgba(239,229,207,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - SW / 2 - 9, TY + TH / 2); g.lineTo(x - SW / 2 + 9, TY - TH / 2); g.stroke();
          const elegido = st.luz > 0 && Math.abs(x - PH) < 2;
          for (let c = 0; c < copias; c++) {
            g.save(); g.globalAlpha = copias > 1 ? Math.pow(1 - c / copias, 1.6) * 2.2 / copias : 1;
            g.fillStyle = elegido ? `rgb(255,${Math.round(lerp(229, 244, st.luz))},${Math.round(lerp(207, 214, st.luz))})` : '#e9dfc6';
            if (elegido) { g.shadowColor = `rgba(255,214,150,${.9 * st.luz})`; g.shadowBlur = 26; }
            textoCabe(g, nom, x + c * Math.sign(st.vel || 1) * 14, TY + 1, SW - 46);
            g.restore();
          }
        }
        g.restore();
        // el brillo de la cinta
        g.fillStyle = 'rgba(255,230,200,.07)'; g.fillRect(X0, TY - TH / 2 + 5, X1 - X0, 6);
        // los postes de guía
        [X0, X1].forEach(x => { const gr2 = g.createRadialGradient(x - 5, TY - 6, 2, x, TY, 26); gr2.addColorStop(0, '#f5f2ec'); gr2.addColorStop(1, '#6a655d');
          g.beginPath(); g.arc(x, TY, 24, 0, 6.283); g.fillStyle = gr2; g.fill(); g.beginPath(); g.arc(x, TY, 7, 0, 6.283); g.fillStyle = '#3a352f'; g.fill(); });
      }
      function cabezales() {
        HX.forEach((x, i) => {
          const y0 = TY - TH / 2 - 74, w = 76, juega = i === 2 ? st.luz : 0;
          g.save();
          g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 12; g.shadowOffsetY = 5;
          rr(g, x - w / 2, y0, w, 78, [10, 10, 4, 4]); g.fillStyle = metal(g, x - w / 2, 0, x + w / 2, 0, '#5f594f', '#c9c3b7', '#5a544b'); g.fill();
          g.shadowColor = 'transparent';
          // la ranura del cabezal, que toca la cinta
          g.fillStyle = '#1a1714'; g.fillRect(x - 2, y0 + 50, 4, 28);
          if (juega > 0) { g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, TY - TH / 2, 2, x, TY - TH / 2, 90);
            gr.addColorStop(0, `rgba(255,190,110,${.55 * juega})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(x - 100, TY - TH / 2 - 90, 200, 180); g.globalCompositeOperation = 'source-over'; }
          g.fillStyle = i === 2 ? (juega > 0 ? '#ffd9a0' : '#efe5cf') : '#cfc4ad'; g.font = `700 ${i === 2 ? 17 : 15}px ${CU}`; g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText(HN[i], x, TY + TH / 2 + 30);
          g.restore();
        });
        // la flecha que marca el cabezal de reproducir
        g.fillStyle = st.luz > 0 ? '#ff4b3a' : '#e5483b'; g.beginPath(); g.moveTo(PH - 9, TY + TH / 2 + 50); g.lineTo(PH + 9, TY + TH / 2 + 50); g.lineTo(PH, TY + TH / 2 + 40); g.closePath(); g.fill();
      }
      function teclas() {
        KX.forEach((x, i) => {
          const baja = i === 0 ? st.rew : i === 2 ? st.play : 0, y = KY - 34 + 8 * baja;
          g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 10 * (1 - baja) + 2; g.shadowOffsetY = 6 * (1 - baja) + 1;
          rr(g, x - 50, y, 100, 68, 7); g.fillStyle = metal(g, 0, y, 0, y + 68, '#f6f0e1', '#e5dac0', '#c9bb9b'); g.fill(); g.shadowColor = 'transparent';
          g.fillStyle = i === 3 ? '#c83a2c' : '#2a2520'; g.font = `700 ${i === 0 ? 24 : 26}px ${CU}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(KN[i], x, y + 35);
          g.restore();
        });
      }
      function ojo() {                    // el ojo mágico: un abanico verde que se abre cuando suena
        const a = .25 + .75 * st.ojo;
        g.save(); g.translate(1006, 846);
        const gr = g.createRadialGradient(0, 0, 3, 0, 0, 27); gr.addColorStop(0, `rgba(170,255,170,${.9 * a})`); gr.addColorStop(1, `rgba(40,160,70,${.75 * a})`);
        g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 25, -Math.PI / 2 + (1 - st.ojo) * 1.1, -Math.PI / 2 + 2 * Math.PI - (1 - st.ojo) * 1.1); g.closePath(); g.fill();
        g.beginPath(); g.arc(0, 0, 7, 0, 6.283); g.fillStyle = '#0b120c'; g.fill();
        if (st.ojo > .6) { g.globalCompositeOperation = 'lighter'; const gr2 = g.createRadialGradient(0, 0, 10, 0, 0, 90); gr2.addColorStop(0, `rgba(90,255,120,${.25 * (st.ojo - .6) / .4})`); gr2.addColorStop(1, 'rgba(90,255,120,0)'); g.fillStyle = gr2; g.fillRect(-90, -90, 180, 180); }
        g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        // las bobinas giran con la cinta (hacia la izquierda: las dos, al revés que las agujas del reloj)
        const v = st.vel * st.SW * 60;                     // px por segundo
        st.aL -= v * dt / pack('L'); st.aR -= v * dt / pack('R');
        L.borra();
        const gr = g.createRadialGradient(560, 300, 40, 560, 540, 1100); gr.addColorStop(0, 'rgba(255,214,150,.07)'); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        if (fijo) ponCapa(g, fijo);
        cinta(); bobina(RL, st.aL, pack('L')); bobina(RR, st.aR, pack('R')); cabezales(); teclas(); ojo();
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      // los sonidos (si el portal los da) y, si no, sintéticos
      const son = {}, S = o.sonidos || {};
      Promise.all([A.carga(S.rebobina), A.carga(S.frena), A.carga(S.tecla)]).then(([a, b, c]) => { son.rebobina = a; son.frena = b; son.tecla = c; });
      function muestra(buf, t, gan, fuera) {          // una muestra con su volumen y, si se pide, un fundido de salida
        const ac = A.ac; if (!ac || !buf) return false;
        const s = ac.createBufferSource(); s.buffer = buf; const v = A.via(1, .18); const g2 = ac.createGain(); s.connect(g2); g2.connect(v);
        const t0 = ac.currentTime + t; g2.gain.setValueAtTime(gan, t0);
        if (fuera) { g2.gain.setValueAtTime(gan, t0 + fuera[0]); g2.gain.linearRampToValueAtTime(.0001, t0 + fuera[0] + fuera[1]); }
        s.start(t0); return true;
      }
      const tecla = (t, gan = .9) => { if (!muestra(son.tecla, t, gan)) A.clic({ t, f: 1500, q: 1.4, gan: .55, dur: .05, wet: .1 }); };
      return {
        ajusta,
        espera() { if (!st.n) { st.items = ['· · ·']; st.n = 1; } },
        async gira(bombo, k) {
          const n = bombo.length; st.items = bombo.slice(); st.n = n; st.luz = 0; st.play = 0; st.ojo = .25;
          // el ancho de cada nombre en la cinta: el del más largo, con aire (entre 240 y 380 px)
          g.save(); g.font = `700 29px ${CU}`; const w = Math.max(...bombo.map(s => g.measureText(String(s).toUpperCase()).width)); g.restore();
          st.SW = clamp(w + 70, 240, 380);
          // unas 30–36 posiciones más allá (dos o tres vueltas al bombo), y que caiga en el elegido
          const p0 = Math.round(st.p); let p1 = p0 + 30; p1 += ((k - p1) % n + n) % n;
          st.p = p0;
          const f = recorrido(p0, p1, { p: 2.45 });
          const ac = A.crea();
          let silbido = null;
          if (ac) {
            tecla(0, 1);
            if (!muestra(son.rebobina, .3, .95, [2.15, .55])) silbido = A.continuo({ f: 1800, q: 4, wet: .15 });
            muestra(son.frena, 2.55, .8);
            A.nota(98, { tipo: 'triangle', t: .3, dur: 2.6, gan: .05, ataque: .5, filtro: { f: 600 }, wet: .3 });      // el motor
          }
          // la tecla de rebobinar baja
          await new Promise(ok => { const t0 = performance.now(); (function p_() { const u = (performance.now() - t0) / 160; st.rew = eo(u, 2); if (u < 1) requestAnimationFrame(p_); else ok(); })(); });
          await new Promise(ok => {
            const t0 = performance.now(); let antes = p0;
            (function p_() {
              const t = Math.min(f.T, (performance.now() - t0) / 1000), q = f(t);
              st.vel = q - antes; antes = q; st.p = q;
              if (silbido) { A.pon(silbido.g.gain, clamp(Math.abs(st.vel) * 1.4, 0, 1) * .12, .04); A.pon(silbido.f.frequency, 400 + 9000 * clamp(Math.abs(st.vel), 0, .6), .04); }
              if (t > f.T - .9) st.rew = 1 - eo((t - (f.T - .9)) / .5, 2);       // la tecla de rebobinar sube al frenar
              if (t < f.T) requestAnimationFrame(p_); else ok();
            })();
          });
          st.p = p1; st.vel = 0; if (silbido) silbido.para(.15);
          // clic de la tecla de reproducir; el ojo mágico se abre y la cinta arranca (un acorde que sube a su altura, como la cinta al coger velocidad)
          tecla(0, 1);
          if (ac) {
            const v = ac.createGain(); v.gain.value = .85; const bp = ac.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.value = 2600; v.connect(bp); bp.connect(A.via(1, .3));
            [261.63, 329.63, 392, 523.25].forEach((fq, i) => { A.nota(fq * .5, { tipo: 'sawtooth', t: .06 + i * .015, dur: .38, gan: .06, desliza: fq, destino: v }); A.nota(fq, { tipo: 'sawtooth', t: .44, dur: 1.7, gan: .055, ataque: .03, destino: v }); });
          }
          await new Promise(ok => { const t0 = performance.now(); (function p_() { const u = (performance.now() - t0) / 520; st.play = eo(u * 3, 2); st.luz = eo(u, 2); st.ojo = .25 + .75 * eo(u, 2); if (u < 1) requestAnimationFrame(p_); else ok(); })(); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ═════════════════════════ LA PARTE COMÚN: estilos, el botón, la capa y el sorteo ═════════════════════════ */
  const CSS = `
.lmv-boton{display:inline-flex;align-items:center;justify-content:center;gap:.55em;white-space:nowrap;cursor:pointer;user-select:none;-webkit-user-select:none}
.lmv-boton .lmv-ico{flex:none;width:1.25em;height:1.25em;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.lmv-boton.lmv-apagado{opacity:.4!important;cursor:default}
.lmv-boton.lmv-apagado:hover{transform:none!important}
.lmv-capa{position:fixed;inset:0;z-index:2147483000;opacity:0;transition:opacity .35s ease;font-synthesis:none;-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none}
.lmv-capa.ve{opacity:1}
.lmv-velo{position:absolute;inset:0}
.lmv-lienzo{position:absolute;left:50%;top:50%;width:1920px;height:1080px;transform-origin:50% 50%}
.lmv-escena{position:absolute;inset:0}
.lmv-escena canvas{position:absolute;left:0;top:0;width:1920px;height:1080px}
.lmv-cab{position:absolute;left:0;right:0;text-align:center;pointer-events:none}
.lmv-ceja,.lmv-grupo,.lmv-nota{margin:0}
.lmv-nombre{position:absolute;left:0;right:0;text-align:center;opacity:0;pointer-events:none;white-space:nowrap}
.lmv-nombre.ve{animation:lmv-aparece .75s cubic-bezier(.2,.9,.25,1.15) forwards}
@keyframes lmv-aparece{0%{opacity:0;transform:scale(.55) translateY(24px);filter:blur(10px)}60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:none;filter:none}}
.lmv-nota{position:absolute;left:0;right:0;text-align:center;opacity:0;transition:opacity .4s}
.lmv-nota.ve{opacity:1}
.lmv-pie{position:absolute;left:0;right:0;display:flex;justify-content:center;gap:26px;opacity:0;transition:opacity .4s;pointer-events:none}
.lmv-pie.ve{opacity:1;pointer-events:auto}
.lmv-b{cursor:pointer;-webkit-appearance:none;appearance:none;outline:none}
.lmv-b:focus-visible{outline:2px solid currentColor;outline-offset:3px}
.lmv-aviso{position:fixed;z-index:2147483001;max-width:420px;padding:12px 16px;border-radius:10px;background:rgba(14,12,18,.94);color:#f4efe6;border:1px solid rgba(255,255,255,.28);
  font:500 15px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5);opacity:0;transform:translateY(-6px);transition:opacity .25s,transform .25s;pointer-events:none}
.lmv-aviso.ve{opacity:1;transform:none}
.lmv-aviso.lmv-av-museo{font:500 16px/1.4 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;border:2px solid #c4945c;background:rgba(14,12,18,.94);color:#f0e8da;border-radius:12px}
.lmv-aviso.lmv-av-radio{font:300 15px/1.45 Jost,system-ui,sans-serif;letter-spacing:.06em;border:1px solid rgba(255,255,255,.72);background:rgba(8,12,14,.86);color:#fff;border-radius:9px}
.lmv-aviso.lmv-av-disco{font:400 14px/1.45 Jost,"Iowan Old Style",Georgia,serif;letter-spacing:.06em;border:1px solid rgba(201,162,74,.6);background:rgba(20,14,9,.92);color:#DCCDB0;border-radius:8px}
.lmv-aviso.lmv-av-cinta{font:400 15px/1.45 "Courier Prime","Courier New",Courier,monospace;border:1px solid rgba(239,229,207,.6);background:rgba(22,17,12,.94);color:#efe5cf;border-radius:4px}`;
  const ICONO = '<svg class="lmv-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13.2" r="8.3"/><circle cx="12" cy="13.2" r="1.7"/><path d="M12 4.9v6.6M12 14.9v6.6M3.7 13.2h6.6M13.7 13.2h6.6M9.6 1.9h4.8L12 4.6z"/></svg>';
  function css(id, txt) { if (document.getElementById(id)) return; const s = el('style', null, document.head, null); s.id = id; s.textContent = txt; }

  let avisoT = 0;
  function aviso(b, txt, tema) {
    let a = document.querySelector('.lmv-aviso'); if (!a) a = el('div', 'lmv-aviso', document.body);
    a.className = 'lmv-aviso' + (tema ? ' lmv-av-' + tema : '');
    a.textContent = txt; const r = b.getBoundingClientRect();
    a.style.top = Math.round(r.bottom + 10) + 'px'; a.style.right = Math.max(10, Math.round(innerWidth - r.right)) + 'px'; a.style.left = 'auto';
    requestAnimationFrame(() => a.classList.add('ve')); clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove('ve'), 4200);
  }

  function monta(o) {
    try {
      o = o || {};
      const id = leeCuenta(); if (!id) return null;
      const tema = TEMAS[o.tema] || TEMAS.museo, nomTema = TEMAS[o.tema] ? o.tema : 'museo';
      css('lmv-css', CSS); css('lmv-css-' + nomTema, tema.css);
      const bo = o.boton || {};
      const padre = (typeof bo.padre === 'string' ? document.querySelector(bo.padre) : bo.padre) || document.body;
      const antes = typeof bo.antes === 'string' ? document.querySelector(bo.antes) : bo.antes;
      const b = document.createElement('button'); b.type = 'button'; b.id = bo.id || 'bVoluntarios';
      b.className = ((bo.clase || '') + ' lmv-boton lmv-apagado').trim(); b.setAttribute('aria-disabled', 'true');
      b.innerHTML = ICONO + '<span>' + (bo.texto || 'Voluntarios') + '</span>'; b.title = 'Voluntarios · conectando…';
      if (antes && antes.parentNode) { if (bo.despues) antes.after(b); else antes.before(b); } else padre.appendChild(b);
      let est = null, clave = null, abierta = null;
      const pinta = () => {
        const f = est && est.horario ? franja(est.horario) : null;
        b.classList.toggle('lmv-apagado', !f); b.setAttribute('aria-disabled', f ? 'false' : 'true');
        b.title = f ? 'Elegir un voluntario de ' + f.g + ' al azar' : (est && est.horario ? 'Voluntarios · solo en la hora de clase' + (proxima(est.horario) ? ' · la próxima: ' + proxima(est.horario) : '') : 'Voluntarios · conectando…');
      };
      async function refresca() {
        try { est = await rpc('suite_voluntarios_estado', { p_cuenta_id: id }); }
        catch (e) { pinta(); return; }
        if (!est || est.ok === false) { olvida(); b.remove(); clearInterval(iv); return; }
        pinta();
      }
      const iv = setInterval(() => { const f = est && est.horario ? franja(est.horario) : null, k = f ? f.g + f.d + f.i : '-'; if (k !== clave) { clave = k; refresca(); } else pinta(); }, 15000);
      b.addEventListener('click', ev => {
        ev.preventDefault(); ev.stopPropagation(); A.crea();
        if (abierta) return;
        if (!est) { aviso(b, 'Conectando con el portal… vuelve a pulsar en un momento.', nomTema); refresca(); return; }
        if (!franja(est.horario)) { const p = proxima(est.horario); aviso(b, 'Ahora no hay clase de ninguno de tus grupos.' + (p ? ' La próxima: ' + p + '.' : ''), nomTema); return; }
        abierta = abre(o, tema, nomTema, id, () => { abierta = null; refresca(); });
      });
      ['pointerdown', 'mousedown', 'touchstart'].forEach(t => b.addEventListener(t, ev => ev.stopPropagation()));
      refresca();
      return { boton: b, refresca };
    } catch (e) { try { console.warn('LMVoluntarios', e); } catch (_) {} return null; }
  }

  // la capa de la ruleta: tapa todo el portal (y se ve también en pantalla completa)
  function abre(o, tema, nomTema, id, alCerrar) {
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    const host = fs && fs !== document.documentElement && fs !== document.body ? fs : document.body;
    const capa = el('div', 'lmv-capa lmv-t-' + nomTema, host);
    capa.innerHTML = '<div class="lmv-velo"></div><div class="lmv-lienzo"><div class="lmv-escena"></div><header class="lmv-cab"><p class="lmv-ceja">Voluntario</p><p class="lmv-grupo"></p></header>'
      + '<div class="lmv-nombre" aria-live="polite"></div><p class="lmv-nota"></p><div class="lmv-pie"><button type="button" class="lmv-b lmv-otra"><span>Otra vez</span></button><button type="button" class="lmv-b lmv-cerrar"><span>Cerrar</span></button></div></div>';
    const $ = s => capa.querySelector(s), lz = $('.lmv-lienzo'), nombre = $('.lmv-nombre'), nota = $('.lmv-nota'), pie = $('.lmv-pie'), grupo = $('.lmv-grupo');
    let vista = null, ocupado = false, cerrada = false;
    try { if (document.fonts && document.fonts.load) (tema.fuentes || []).forEach(f => document.fonts.load(f).catch(() => {})); } catch (e) {}
    try { vista = tema.crea($('.lmv-escena'), o); } catch (e) { console.warn('LMVoluntarios tema', e); }
    const escala = () => { const s = Math.min(innerWidth / 1920, innerHeight / 1080); lz.style.transform = 'translate(-50%,-50%) scale(' + s + ')'; if (vista && vista.ajusta) vista.ajusta(s); };
    escala(); addEventListener('resize', escala);
    const teclas = ev => { if (cerrada) return; ev.stopPropagation(); if (ev.type !== 'keydown') return; if (ev.key === 'Escape') { ev.preventDefault(); cierra(); } else if ((ev.key === 'Enter') && pie.classList.contains('ve')) { ev.preventDefault(); tira(); } else if (ev.key === ' ' || String(ev.key || '').startsWith('Arrow')) ev.preventDefault(); };
    ['keydown', 'keyup', 'keypress'].forEach(t => window.addEventListener(t, teclas, true));
    ['click', 'pointerdown', 'mousedown', 'touchstart', 'wheel'].forEach(t => capa.addEventListener(t, ev => ev.stopPropagation()));
    $('.lmv-otra').addEventListener('click', () => tira());
    $('.lmv-cerrar').addEventListener('click', () => cierra());
    requestAnimationFrame(() => capa.classList.add('ve'));
    try { if (o.alAbrir) o.alAbrir(); } catch (e) {}
    function cierra() {
      if (cerrada) return; cerrada = true;
      ['keydown', 'keyup', 'keypress'].forEach(t => window.removeEventListener(t, teclas, true)); removeEventListener('resize', escala);
      capa.classList.remove('ve'); setTimeout(() => { if (vista && vista.quita) vista.quita(); capa.remove(); }, 400);
      try { if (o.alCerrar) o.alCerrar(); } catch (e) {}
      alCerrar();
    }
    async function tira() {
      if (ocupado || cerrada) return; ocupado = true;
      pie.classList.remove('ve'); nota.classList.remove('ve'); nombre.classList.remove('ve'); nombre.textContent = '';
      grupo.textContent = 'Barajando…'; grupo.classList.add('lmv-cargando');
      if (vista && vista.espera) vista.espera();
      let r = null, error = null;
      try { r = await rpc('suite_voluntarios_tira', { p_cuenta_id: id, p_portal: o.portal || null }); } catch (e) { error = e; }
      grupo.classList.remove('lmv-cargando');
      const falla = txt => { grupo.textContent = ''; nota.textContent = txt; nota.classList.add('ve'); $('.lmv-otra span').textContent = 'Reintentar'; pie.classList.add('ve'); ocupado = false; };
      if (error || !r) return falla('No se ha podido conectar. Comprueba la conexión y vuelve a intentarlo.');
      if (r.ok === false) { olvida(); return falla('Esta cuenta no puede usar el seleccionador de voluntarios.'); }
      if (!r.activo) return falla('Ahora mismo no hay clase de ninguno de tus grupos.');
      if (r.vacio || !r.bombo || !r.bombo.length) return falla('No hay alumnos en la lista de ' + (r.grupo || 'este grupo') + '.');
      $('.lmv-otra span').textContent = 'Otra vez';
      grupo.textContent = r.grupo + ' · ' + r.bombo.length + (r.bombo.length === 1 ? ' en el bombo' : ' en el bombo');
      try { if (vista) await vista.gira(r.bombo, r.elegido, r); } catch (e) { console.warn('LMVoluntarios giro', e); }
      if (cerrada) return;
      nombre.textContent = r.bombo[r.elegido]; nombre.classList.add('ve');
      grupo.textContent = r.grupo + ' · ' + (r.quedan ? 'quedan ' + r.quedan + ' de ' + r.total + ' en esta ronda' : 'ronda completa');
      nota.textContent = r.nueva_ronda ? 'Ronda nueva: ya habían salido todos.' : (!r.quedan ? 'Era el último: en la próxima, vuelven a entrar todos.' : '');
      if (nota.textContent) setTimeout(() => nota.classList.add('ve'), 350);
      setTimeout(() => { pie.classList.add('ve'); ocupado = false; try { $('.lmv-otra').focus({ preventScroll: true }); } catch (e) {} }, 700);
    }
    tira();
    return { cierra };
  }

  window.LMVoluntarios = { version: VERSION, monta, temas: Object.keys(TEMAS), _TEMAS: TEMAS, _recorrido: recorrido, _A: A };
})();
