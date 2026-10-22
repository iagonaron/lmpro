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

   v3 (18-oct-2026, Iago: «Nada de botón arriba: que SURJA SOLO al abrir con Protester EN HORARIO DE CLASE. Al “Empezar el día N”
   (cuando ya ha cargado lo que tenga que cargar, o tras “permitir micrófono”), un botón en el MEDIO de la pantalla, “Seleccionar
   voluntario”, y ya con ese grupo. En casa, fuera de hora, no sale.» · «El del Fonógrafo NO puede ser un disco: es de CILINDRO
   DE CERA»). Ya no hay botón arriba: al pulsar el botón de empezar del portal (#cEmpezar en Acústica y Atonalidad, #mcEmpezar en
   el montaje del Fonógrafo; el día 1 del Fonógrafo, el vídeo, no lleva) o cuando el portal llama a LMVoluntarios.ofrece(), si hay
   clase ahora mismo sale en el medio «Seleccionar voluntario» (con su grupo) y «Ahora no»; el portal espera y empieza después.

   v4 (20-oct-2026, Iago, portal Blues): cuatro temas nuevos, uno por acto: «telegrafo» (acto 1, el telégrafo de órdenes de la sala de
   máquinas del vapor), «tabla» (acto 2, la tabla de lavar de los músicos callejeros), «marquesina» (acto 3, la marquesina art déco de
   Harlem) y «album» (acto 4, el álbum de fotos de John). Y `ofrece({ tema })` elige la estética de ESA oferta (un portal con varios
   actos usa un tema distinto en cada uno); sin `tema`, la de `monta`.

   v5 (22-oct-2026, Iago: «que cada día de un portal… tenga su propia animación de aleatoriedad de alumnos»): monta({ temaDe })
   — una función del portal que dice qué tema toca en esa oferta (recibe lo que se pasa a ofrece(), p. ej. { dia: n }); si
   ofrece({ tema }) trae tema, manda ese. Temas nuevos: «cordon» y «dado» (Atonalidad, capítulos 1 y 2; el 3 sigue con
   «museo»), «caza» y «maquina» (Magnetófono, bobinas 2 y 3; la 1 sigue con «cinta»), «arbol» y «sinte» (Acústica, días 1 y
   3; el 2 sigue con «radio») y «taller» (Fonógrafo, el montaje; la grabación, con el cilindro «disco»).
   ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.LMVoluntarios) return;
  const VERSION = 5;   // (22-oct-2026) v5: una animación por día, capítulo o bobina (temaDe) · (17-oct-2026) v2: el tema «cinta» del Magnetófono · (18-oct-2026) v3: el cilindro del Fonógrafo y el botón que surge al empezar · (20-oct-2026) v4: los temas del Blues y un tema por oferta
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
    // (v4) un trozo de una muestra: desde `desde` (s) durante `dur` (s), con fundido de salida
    trozo(buf, o = {}) {
      if (!buf || !this.ac) return false;
      const ac = this.ac, s = ac.createBufferSource(); s.buffer = buf; s.playbackRate.value = o.vel || 1;
      const g = ac.createGain(), t = ac.currentTime + (o.t || 0), gan = o.gan == null ? 1 : o.gan, dur = Math.min(o.dur || buf.duration, buf.duration - (o.desde || 0)), fade = Math.min(o.fade == null ? .12 : o.fade, dur);
      g.gain.setValueAtTime(gan, t); g.gain.setValueAtTime(gan, t + dur - fade); g.gain.linearRampToValueAtTime(.0001, t + dur);
      s.connect(g); g.connect(this.via(1, o.wet || 0, o.pan || 0)); s.start(t, o.desde || 0); s.stop(t + dur + .05); return true;
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

  /* ───────── (v4) ayudas de los temas del Blues ───────── */
  const reducido = () => { try { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } };
  // un azar con semilla (para lo que se pinta una vez y no debe cambiar si se vuelve a pintar)
  function semilla(s) { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  // vaivén entre 0 y m: sube, baja, sube… (la palanca, el dedal)
  const vaiven = (p, m) => { if (m <= 0) return 0; const q = ((p % (2 * m)) + 2 * m) % (2 * m); return q <= m ? q : 2 * m - q; };
  // dónde acaba un vaivén que parte de p0 y debe pararse en `sl` (de 0 a m), tras recorrer al menos `dmin`
  function destinoVaiven(p0, m, sl, dmin) {
    let c1 = null;
    for (let q = 0; q < 12 && c1 == null; q++) for (const c of [q * 2 * m + sl, (q + 1) * 2 * m - sl]) if (c >= p0 + dmin && (c1 == null || c < c1)) c1 = c;
    return c1 == null ? p0 + dmin : c1;
  }
  // reparte un texto en líneas de como mucho `max` caracteres (por palabras; una palabra más larga se parte por un guion o, si no hay, a lo bruto)
  function lineas(txt, max, filas) {
    const pal = [];
    String(txt).trim().split(/\s+/).forEach(w => {
      while (w.length > max) { let c = w.lastIndexOf('-', max - 1); c = c < 1 ? max : c + 1; pal.push(w.slice(0, c)); w = w.slice(c); }
      if (w) pal.push(w);
    });
    const out = []; let cur = '';
    pal.forEach(w => { if (!cur) cur = w; else { const sep = cur.endsWith('-') ? '' : ' '; if ((cur + sep + w).length <= max) cur += sep + w; else { out.push(cur); cur = w; } } });
    if (cur) out.push(cur);
    return filas && out.length > filas ? out.slice(0, filas - 1).concat(out.slice(filas - 1).join(' ')) : out;
  }
  // un texto que cabe en `ancho` (y `alto` si se da): la letra más grande entre mx y mn; en dos líneas si así sale más grande; si ni al mínimo cabe, se estrecha
  function rotula(g, fuente, txt, ancho, alto, mx, mn, dos) {
    const medida = (t, px) => { g.font = fuente(px); return g.measureText(t).width; };
    const cabe = (t, tope) => { const w1 = medida(t, 100) / 100; return Math.min(tope, ancho / (w1 || 1)); };
    let px = cabe(txt, mx), res = { lineas: [txt], px: Math.floor(px) };
    if (dos !== false && px < mx * .8) {
      const pal = txt.split(' ');
      if (pal.length > 1) {
        let mejor = null;
        for (let i = 1; i < pal.length; i++) { const a = pal.slice(0, i).join(' '), b = pal.slice(i).join(' '); const m = Math.max(medida(a, 100), medida(b, 100)); if (!mejor || m < mejor.m) mejor = { a, b, m }; }
        let p2 = Math.min(mx, ancho / (mejor.m / 100)); if (alto) p2 = Math.min(p2, alto / 2.15);
        if (p2 > px * 1.18) res = { lineas: [mejor.a, mejor.b], px: Math.floor(p2) };
      }
    }
    if (alto && res.lineas.length === 1) res.px = Math.min(res.px, Math.floor(alto / 1.1));
    if (res.px < mn) res.px = mn;
    return res;
  }
  // cuando las letras del tema ya están cargadas, vuelve a pintar lo que se pintó con otra letra
  function tras(fuentes, cb) { try { if (document.fonts && document.fonts.load) Promise.all((fuentes || []).map(f => document.fonts.load(f).catch(() => []))).then(() => { try { cb(); } catch (e) {} }); } catch (e) {} }
  // espera (como mucho `ms`) a que se hayan cargado las muestras de sonido, para que suenen ya en el primer giro
  const esperaMuestras = (pr, ms) => Promise.race([pr, new Promise(r => setTimeout(r, ms || 700))]);
  const espaciado = (g, px) => { if ('letterSpacing' in g) g.letterSpacing = px + 'px'; };

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

  /* ── «disco» (= «cilindro») · Fonógrafo: el cilindro de cera (18-oct-2026, V2 de Iago: «el del Fonógrafo NO puede ser un disco:
     el fonógrafo es de CILINDRO DE CERA») ──
     El fonógrafo visto de frente: el cilindro de cera marrón en su mandril de latón, sobre la base de madera, con el diafragma
     y su bocina encima. Los nombres van escritos alrededor del cilindro (cada uno, una franja de la vuelta), y al girar suben
     por la cara que se ve, encogiéndose hacia los bordes, como en un cilindro de verdad. Frena; el nombre que queda delante, a
     la altura de la aguja de latón, se ilumina, y suena la fanfarria de cera. (Se llama «disco» para que el Fonógrafo, que ya
     pide ese tema, no tenga que cambiar nada; «cilindro» es lo mismo.) */
  TEMAS.disco = {
    fuentes: ['500 30px Jost', '400 96px "Bodoni 72"'],
    css: `
.lmv-t-disco .lmv-velo{background:radial-gradient(ellipse at 34% 50%,rgba(34,24,14,.965) 0%,rgba(20,16,12,.985) 55%,rgba(8,6,4,.995) 100%)}
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
      const XL = 170, XR = 1010, CY = 520, RC = 232, CAP = 30;            // el cilindro: de XL a XR, eje en CY, radio RC (y sus tapas)
      const XM = (XL + XR) / 2;
      const st = { items: [], sec: 0, ang: 0, vel: 0, luz: -1, brillo: 0, t: 0, aguja: 0 };
      let fijo = null, raf = 0, vivo = true;
      const laton = (g, x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, '#5c4219'); gr.addColorStop(.35, '#f2d793'); gr.addColorStop(.6, '#c9a24a'); gr.addColorStop(1, '#4a3311'); return gr; };
      function pintaFijo(g) {            // lo que no se mueve: la base de madera, los soportes, el mandril y su volante
        g.save();
        // la base de madera, con su moldura y la placa
        g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 50; g.shadowOffsetY = 22;
        rr(g, 80, 820, 1020, 150, 14); g.fillStyle = '#3b2412'; g.fill(); g.shadowColor = 'transparent';
        let gr = g.createLinearGradient(0, 820, 0, 970); gr.addColorStop(0, '#7a4a24'); gr.addColorStop(.12, '#5a341a'); gr.addColorStop(.7, '#40250f'); gr.addColorStop(1, '#24140a');
        rr(g, 80, 820, 1020, 150, 14); g.fillStyle = gr; g.fill();
        g.globalAlpha = .18; for (let k = 0; k < 26; k++) { g.strokeStyle = k % 2 ? '#2a170a' : '#8a5a30'; g.lineWidth = 1 + (k % 3); g.beginPath();
          const y = 840 + k * 5; g.moveTo(90, y); g.bezierCurveTo(400, y + 6 * Math.sin(k), 700, y - 5 * Math.cos(k), 1090, y + 2); g.stroke(); } g.globalAlpha = 1;
        g.strokeStyle = 'rgba(255,214,150,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(96, 824); g.lineTo(1084, 824); g.stroke();
        rr(g, 370, 880, 440, 46, 6); g.fillStyle = laton(g, 370, 880, 810, 926); g.fill();
        g.strokeStyle = 'rgba(60,40,10,.7)'; g.lineWidth = 2; rr(g, 376, 886, 428, 34, 4); g.stroke();
        g.fillStyle = '#2A1E0A'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '500 15px Jost, Georgia, serif'; textoCabe(g, 'LM AT HOME · FONÓGRAFO · VOLUNTARIOS', 590, 903, 400);
        // los dos soportes del mandril (hierro negro, con su perfil)
        for (const x of [XL - 70, XR + 70]) {
          gr = g.createLinearGradient(x - 26, 0, x + 26, 0); gr.addColorStop(0, '#0d0b09'); gr.addColorStop(.45, '#4a4440'); gr.addColorStop(1, '#0d0b09');
          g.beginPath(); g.moveTo(x - 22, 822); g.lineTo(x - 13, CY + 20); g.lineTo(x + 13, CY + 20); g.lineTo(x + 22, 822); g.closePath(); g.fillStyle = gr; g.fill();
          gr = g.createRadialGradient(x - 8, CY - 8, 3, x, CY, 34); gr.addColorStop(0, '#6a625a'); gr.addColorStop(1, '#141210');
          g.beginPath(); g.arc(x, CY, 32, 0, 6.283); g.fillStyle = gr; g.fill();
        }
        // el eje de latón, de soporte a soporte (por detrás del cilindro asoma por los dos lados)
        g.fillStyle = laton(g, 0, CY - 14, 0, CY + 14); g.fillRect(XL - 72, CY - 13, (XR + 72) - (XL - 72), 26);
        // el volante (a la izquierda, fuera)
        gr = g.createRadialGradient(XL - 70 - 6, CY - 10, 4, XL - 70, CY, 60); gr.addColorStop(0, '#fff0c4'); gr.addColorStop(.5, '#c9a24a'); gr.addColorStop(1, '#4a3311');
        g.beginPath(); g.ellipse(XL - 112, CY, 18, 92, 0, 0, 6.283); g.fillStyle = gr; g.fill(); g.strokeStyle = 'rgba(40,26,8,.7)'; g.lineWidth = 3; g.stroke();
        g.restore();
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) fijo = capaFija(L.k, pintaFijo, 0, 0, 1920, 1080); }
      // y = altura en pantalla de un punto del cilindro a la vuelta «a» (0: delante; positivo: hacia arriba)
      const yDe = a => CY - RC * Math.sin(a);
      function pintaCilindro() {
        const n = st.sec, paso = n ? 2 * Math.PI / n : 1;
        g.save();
        // la cera: marrón oscuro, con su luz (más clara por delante y arriba, oscura en los bordes)
        let gr = g.createLinearGradient(0, CY - RC, 0, CY + RC);
        gr.addColorStop(0, '#120a05'); gr.addColorStop(.18, '#4a2e15'); gr.addColorStop(.36, '#8a5a2c'); gr.addColorStop(.46, '#6e4520');
        gr.addColorStop(.62, '#4a2d14'); gr.addColorStop(.86, '#2a180b'); gr.addColorStop(1, '#0c0703');
        g.fillStyle = gr; g.fillRect(XL, CY - RC, XR - XL, 2 * RC);
        // los surcos (cada uno da la vuelta: de frente se ven como rayitas verticales finísimas)
        g.lineWidth = 1;
        for (let x = XL + 8; x < XR - 6; x += 5) { g.strokeStyle = `rgba(255,236,200,${.035 + .02 * Math.sin(x * .9)})`; g.beginPath(); g.moveTo(x, CY - RC + 6); g.lineTo(x, CY + RC - 6); g.stroke(); }
        // los nombres, alrededor (los que caen en la cara de delante); con estela si va deprisa
        if (n) {
          const vel = Math.abs(st.vel), copias = vel > 3 ? Math.min(8, 1 + Math.floor(vel / 2.4)) : 1;
          g.textAlign = 'center'; g.textBaseline = 'middle';
          for (let j = 0; j < n; j++) {
            for (let c = 0; c < copias; c++) {
              const a = st.ang + (j + .5) * paso - (copias > 1 ? (c / copias) * st.vel / 60 : 0);
              const aa = Math.atan2(Math.sin(a), Math.cos(a));                         // en (−π, π]
              if (Math.abs(aa) > 1.45) continue;
              const k = Math.cos(aa), y = yDe(aa), peso = copias > 1 ? Math.pow(1 - c / copias, 1.7) * 2.4 / copias : 1;
              const luz = st.luz === j ? st.brillo : 0;
              g.save(); g.translate(XM, y); g.scale(1, Math.max(.05, k)); g.globalAlpha = Math.min(1, peso) * Math.pow(k, .7);
              g.font = `500 ${n > 14 ? 34 : 40}px Jost, "Iowan Old Style", Georgia, serif`;
              g.fillStyle = luz > 0 ? `rgb(${lerp(226, 255, luz)},${lerp(206, 222, luz)},${lerp(170, 140, luz)})` : '#E2CEAA';
              if (luz > 0) { g.shadowColor = `rgba(240,184,96,${luz})`; g.shadowBlur = 26; }
              textoCabe(g, (st.items[j % st.items.length] || '').toUpperCase(), 0, 0, (XR - XL) - 120);
              g.restore();
            }
            // la raya entre nombre y nombre (rayada en la cera)
            const b = Math.atan2(Math.sin(st.ang + j * paso), Math.cos(st.ang + j * paso));
            if (Math.abs(b) < 1.5) { const k = Math.cos(b); g.strokeStyle = `rgba(201,162,74,${.55 * k})`; g.lineWidth = 2 * Math.max(.3, k); g.beginPath(); g.moveTo(XL + 14, yDe(b)); g.lineTo(XR - 14, yDe(b)); g.stroke(); }
          }
        }
        // el brillo de la cera (quieto: la luz no gira con el cilindro)
        gr = g.createLinearGradient(0, CY - RC, 0, CY + RC); gr.addColorStop(0, 'rgba(255,230,190,0)'); gr.addColorStop(.3, 'rgba(255,230,190,.16)');
        gr.addColorStop(.36, 'rgba(255,240,210,.22)'); gr.addColorStop(.44, 'rgba(255,230,190,0)'); g.fillStyle = gr; g.fillRect(XL, CY - RC, XR - XL, 2 * RC);
        // la luz del nombre elegido, delante
        if (st.luz >= 0 && st.brillo > 0) { g.save(); g.globalCompositeOperation = 'lighter';
          gr = g.createRadialGradient(XM, CY, 10, XM, CY, (XR - XL) * .55); gr.addColorStop(0, `rgba(240,184,96,${.26 * st.brillo})`); gr.addColorStop(1, 'rgba(240,184,96,0)');
          g.fillStyle = gr; g.fillRect(XL, CY - RC * .5, XR - XL, RC); g.restore(); }
        // las tapas (el canto del cilindro, en perspectiva) y el mandril que asoma
        for (const [x, s] of [[XL, -1], [XR, 1]]) {
          gr = g.createLinearGradient(0, CY - RC, 0, CY + RC); gr.addColorStop(0, '#0c0703'); gr.addColorStop(.4, '#5a3a1c'); gr.addColorStop(1, '#0c0703');
          g.beginPath(); g.ellipse(x, CY, CAP, RC, 0, s < 0 ? Math.PI / 2 : -Math.PI / 2, s < 0 ? 3 * Math.PI / 2 : Math.PI / 2); g.fillStyle = gr; g.fill();
          g.beginPath(); g.ellipse(x + s * 6, CY, 12, 46, 0, 0, 6.283); g.fillStyle = laton(g, 0, CY - 46, 0, CY + 46); g.fill();
        }
        g.restore();
      }
      function pintaDiafragma() {         // el diafragma (sobre el cilindro, con su aguja) y la bocina de latón
        const sube = 1 - st.aguja, dx = 760, dy = CY - RC - 64 - 10 * sube;
        g.save();
        // la bocina: un cono grande hacia arriba a la derecha
        let gr = g.createLinearGradient(820, 120, 1100, 420); gr.addColorStop(0, '#f6e2a8'); gr.addColorStop(.35, '#c9a24a'); gr.addColorStop(.8, '#7a5a1e'); gr.addColorStop(1, '#4a3311');
        g.beginPath(); g.moveTo(dx + 18, dy - 24); g.quadraticCurveTo(930, 200, 1010, 40); g.lineTo(1150, 120); g.quadraticCurveTo(1020, 220, dx + 30, dy - 6); g.closePath(); g.fillStyle = gr; g.fill();
        g.beginPath(); g.ellipse(1080, 80, 80, 26, -.5, 0, 6.283); g.fillStyle = '#2a1e0a'; g.fill(); g.strokeStyle = laton(g, 1000, 60, 1160, 100); g.lineWidth = 7; g.stroke();
        // el brazo y la caja del diafragma
        g.fillStyle = laton(g, 0, dy - 22, 0, dy + 22); g.fillRect(300, dy - 8, dx - 300, 16);
        gr = g.createRadialGradient(dx - 12, dy - 12, 4, dx, dy, 52); gr.addColorStop(0, '#fff3cf'); gr.addColorStop(.45, '#c9a24a'); gr.addColorStop(1, '#4a3311');
        g.beginPath(); g.ellipse(dx, dy, 54, 30, 0, 0, 6.283); g.fillStyle = gr; g.fill(); g.strokeStyle = 'rgba(60,40,10,.6)'; g.lineWidth = 2; g.stroke();
        g.beginPath(); g.ellipse(dx, dy - 2, 34, 17, 0, 0, 6.283); g.fillStyle = 'rgba(235,228,210,.85)'; g.fill();
        // la aguja, que baja hasta la cera
        g.strokeStyle = '#d9d9d9'; g.lineWidth = 3; g.beginPath(); g.moveTo(dx, dy + 26); g.lineTo(dx, CY - RC + 2 - 14 * sube); g.stroke();
        g.restore();
        // el fiel de latón, delante a la izquierda: señala el nombre que suena
        g.save(); gr = g.createLinearGradient(XL - 60, 0, XL - 4, 0); gr.addColorStop(0, '#4a3311'); gr.addColorStop(.5, '#f2d793'); gr.addColorStop(1, '#8a6a2a');
        g.beginPath(); g.moveTo(XL - 66, CY - 16); g.lineTo(XL - 4, CY); g.lineTo(XL - 66, CY + 16); g.closePath(); g.fillStyle = gr; g.fill(); g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra();
        const gr = g.createRadialGradient(XM - 120, CY - 300, 40, XM, CY, 1100); gr.addColorStop(0, 'rgba(240,184,96,.10)'); gr.addColorStop(1, 'rgba(240,184,96,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        if (fijo) ponCapa(g, fijo); pintaCilindro(); pintaDiafragma();
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      return {
        ajusta,
        espera() { if (!st.sec) { st.items = ['· · ·']; st.sec = 10; } },
        async gira(bombo, k) {
          const n = bombo.length, rep = n < 10 ? Math.ceil(10 / n) : 1, S = n * rep;
          st.items = bombo.slice(); st.sec = S; st.luz = -1; st.brillo = 0; st.aguja = 0;
          const paso = 2 * Math.PI / S, kk = k + n * Math.floor(Math.random() * rep);
          // al final, el centro de la franja kk, delante (ángulo 0); unas cuatro vueltas y media
          const a0 = st.ang; let a1 = -(kk + .5) * paso; while (a1 < a0 + 4.5 * 2 * Math.PI) a1 += 2 * Math.PI;
          const f = recorrido(a0 / paso, a1 / paso, { p: 2.4, retro: .25, sobra: .06 });
          const ac = A.crea(); let zumba = null;
          if (ac) {
            for (let i = 0; i < 6; i++) A.clic({ t: i * .05, f: 1500 + i * 110, q: 4, gan: .22, dur: .02 });        // se da cuerda (el trinquete)
            zumba = A.continuo({ tipo: 'bandpass', f: 520, q: .9, wet: .08 });                                       // el regulador que zumba
          }
          await new Promise(ok => {
            const t0 = performance.now(); let antes = a0 / paso, ult = Math.floor(a0 / paso);
            (function p_() {
              const t = Math.min(f.T, (performance.now() - t0) / 1000), q = f(t);
              st.vel = (q - antes) * paso * 60; antes = q; st.ang = q * paso;
              const c = Math.floor(q); if (c !== ult) { ult = c; if (A.ac) A.clic({ f: 900 + 50 * Math.min(20, Math.abs(st.vel) * 3), q: 2, gan: .26, dur: .025, wet: .15 }); }
              if (zumba) { A.pon(zumba.g.gain, clamp(Math.abs(st.vel) / 14, 0, 1) * .07, .03); A.pon(zumba.f.frequency, 360 + clamp(Math.abs(st.vel), 0, 14) * 40, .03); }
              if (t < f.T) requestAnimationFrame(p_); else ok();
            })();
          });
          st.ang = a1; st.vel = 0; st.luz = kk;
          if (zumba) zumba.para(.4);
          // la aguja baja a la cera… y suena la fanfarria, por la bocina
          if (ac) {
            A.nota(70, { tipo: 'sine', dur: .25, gan: .45, desliza: 45 }); A.clic({ f: 900, q: .8, gan: .4, dur: .06 });
            const crepita = A.continuo({ tipo: 'highpass', f: 2600, q: .5, wet: .1 }); if (crepita) A.pon(crepita.g.gain, .05, .05);
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

  /* ── «telegrafo» · Blues, acto 1 «La nana de Xan» (el vapor de 1928): el telégrafo de órdenes de la sala de máquinas ──
     Una esfera grande de latón con la cara crema y la palanca de latón, en la sala de máquinas de noche (azul acero, el brillo de las
     calderas al fondo). Con pocos nombres, cada uno va escrito en su sector, como una orden (AVANTE, PARE, ATRÁS…), y la palanca va y
     viene de un tope a otro, frena y se para en el elegido. Con muchos (9 o más), la esfera gira como un tambor tras una ventana fija
     donde espera la aguja (un «tic» de trinquete por nombre). Al parar: doble campanazo y el sector se ilumina. */
  TEMAS.telegrafo = {
    fuentes: ['400 80px Limelight', '600 30px Jost', '500 24px Jost', 'italic 400 28px "Cormorant Garamond"'],
    nombreFit: { min: 40 },
    css: `
.lmv-t-telegrafo .lmv-velo{background:radial-gradient(ellipse at 36% 52%,rgba(66,100,130,.975) 0%,rgba(44,70,94,.985) 52%,rgba(14,24,36,.995) 100%)}
.lmv-t-telegrafo .lmv-cab{top:238px;left:1214px;right:94px}
.lmv-t-telegrafo .lmv-ceja{font:400 60px/1 Limelight,"Poiret One",Georgia,serif;letter-spacing:.08em;color:#E9D299;text-shadow:0 0 26px rgba(233,210,153,.35),0 3px 10px rgba(0,0,0,.8)}
.lmv-t-telegrafo .lmv-grupo{margin-top:20px;font:500 23px/1 Jost,"Avenir Next",system-ui,sans-serif;letter-spacing:.1em;white-space:nowrap;color:rgba(243,230,200,.78)}
.lmv-t-telegrafo .lmv-nombre{top:380px;left:1214px;right:94px;height:262px;display:flex;align-items:center;justify-content:center;white-space:normal;font:400 104px/1.06 Limelight,"Poiret One",Georgia,serif;color:#F3E6C8;text-shadow:0 0 34px rgba(255,205,110,.5),0 4px 16px rgba(0,0,0,.85)}
.lmv-t-telegrafo .lmv-nota{top:652px;left:1214px;right:94px;font:italic 400 28px/1.3 "Cormorant Garamond",Georgia,serif;color:#DCCBA4}
.lmv-t-telegrafo .lmv-pie{left:1214px;right:94px;bottom:auto;top:744px;gap:22px}
.lmv-t-telegrafo .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:16px 34px;border-radius:6px;border:2px solid #C9A45C;background:rgba(18,30,42,.82);color:#F3E6C8;font:500 22px/1 Jost,"Avenir Next",system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;transition:background .2s,color .2s,transform .15s}
.lmv-t-telegrafo .lmv-b:hover{background:rgba(201,164,92,.22);transform:translateY(-2px)}
.lmv-t-telegrafo .lmv-b.lmv-otra{background:linear-gradient(#EAD18F,#C9A45C 55%,#9A7430);border-color:#EAD18F;color:#2B1B0C}
.lmv-t-telegrafo .lmv-b.lmv-otra:hover{background:linear-gradient(#F6E3A8,#D9B76C 55%,#A98339)}
.lmv-t-telegrafo .lmv-cargando{color:#E9D299}
@media (prefers-reduced-motion:reduce){.lmv-t-telegrafo .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const JO = px => `600 ${px}px Jost,"Avenir Next",system-ui,sans-serif`;
      const DX = 660, DY = 536, RB = 430, RA = 398, RF = 358, RH = 122, rA = 148, rB = 322, rm = (rA + rB) / 2, LB = rB - rA - 8;
      const ORD = ['ATRÁS TODA', 'ATRÁS MEDIA', 'ATRÁS LENTO', 'DESPACIO', 'PARE', 'DESPACIO', 'AVANTE LENTO', 'AVANTE MEDIA', 'AVANTE TODA'];
      const rad = d => d * Math.PI / 180;
      const st = { items: [], n: 0, modo: 'sector', S: 6, slotDe: [], p: 0, u: 2.5, rot: 0, sel: -1, luz: 0, t: 0, vel: 0, fm: [], chisp: [], bruma: [], sacude: 0, fin: 0 };
      let fijo = null, casco = null, centro = null, cara = null, raf = 0, vivo = true;
      const thSlot = u => -135 + 270 * (u + .5) / st.S;
      const angNombre = j => st.modo === 'sector' ? thSlot(st.slotDe[j]) : j * 360 / st.n + st.rot;
      const angPalanca = () => st.modo === 'sector' ? thSlot(st.u) : 90;
      const laton = (g, x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, '#F4E0A4'); gr.addColorStop(.26, '#CBA65E'); gr.addColorStop(.5, '#E8D08C'); gr.addColorStop(.76, '#92702F'); gr.addColorStop(1, '#5E4519'); return gr; };
      const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.283); };
      function anillo(g, r1, r2) { g.beginPath(); g.arc(0, 0, r2, 0, 6.283); g.arc(0, 0, r1, 6.283, 0, true); }

      /* lo que no se mueve: la sala de máquinas, la placa de la derecha y el pie del telégrafo */
      function tuboH(g, x0, x1, y, h, bridas) {
        const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#16222d'); gr.addColorStop(.16, '#62809a'); gr.addColorStop(.36, '#aac2d4'); gr.addColorStop(.62, '#587489'); gr.addColorStop(1, '#121d27');
        g.fillStyle = gr; g.fillRect(x0, y, x1 - x0, h);
        bridas.forEach(x => {
          const b = g.createLinearGradient(0, y - 9, 0, y + h + 9); b.addColorStop(0, '#1b2a37'); b.addColorStop(.25, '#8aa5ba'); b.addColorStop(.5, '#4d677c'); b.addColorStop(1, '#101a23');
          g.fillStyle = b; g.fillRect(x - 12, y - 9, 24, h + 18);
          for (let i = 0; i < 3; i++) { g.fillStyle = '#d3e2ee'; circ(g, x, y + 7 + i * (h - 14) / 2, 2.6); g.fill(); }
        });
      }
      function manometro(g, x, y, r, sem) {
        const b = laton(g, x - r, y - r, x + r, y + r); g.fillStyle = b; circ(g, x, y, r); g.fill();
        g.fillStyle = '#0f1822'; circ(g, x, y, r - 7); g.fill();
        const cr = g.createRadialGradient(x - 8, y - 10, 2, x, y, r - 8); cr.addColorStop(0, '#f6efdb'); cr.addColorStop(1, '#cdbf9c'); g.fillStyle = cr; circ(g, x, y, r - 9); g.fill();
        g.strokeStyle = '#2a1d0e'; g.lineWidth = 1.6;
        for (let i = 0; i <= 10; i++) { const a = rad(-135 + i * 27); g.beginPath(); g.moveTo(x + Math.sin(a) * (r - 14), y - Math.cos(a) * (r - 14)); g.lineTo(x + Math.sin(a) * (r - (i % 5 ? 20 : 25)), y - Math.cos(a) * (r - (i % 5 ? 20 : 25))); g.stroke(); }
        g.strokeStyle = '#b3261e'; g.lineWidth = 4; g.beginPath(); g.arc(x, y, r - 17, rad(-135 + 8 * 27) - Math.PI / 2, rad(-135 + 10 * 27) - Math.PI / 2); g.stroke();
        g.fillStyle = '#2a1d0e'; g.font = `600 ${Math.round(r * .2)}px Jost,system-ui,sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(sem ? 'VAPOR' : 'AGUA', x, y + r * .42);
      }
      function pintaFijo(g) {
        const r = semilla(11);
        // el mamparo: planchas de acero con sus costuras y remaches
        for (let x = 0; x < 1920; x += 240) {
          const gr = g.createLinearGradient(x, 0, x + 240, 0); gr.addColorStop(0, 'rgba(8,16,26,.40)'); gr.addColorStop(.045, 'rgba(150,190,220,.11)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.28)');
          g.fillStyle = gr; g.fillRect(x, 0, 240, 1080);
          for (let y = 30; y < 1080; y += 52) { g.fillStyle = 'rgba(6,14,22,.6)'; circ(g, x + 13, y, 4.6); g.fill(); g.fillStyle = 'rgba(196,224,248,.32)'; circ(g, x + 11.6, y - 1.5, 2); g.fill(); }
        }
        // humedad y óxido que gotea por las planchas
        for (let i = 0; i < 26; i++) { const x = r() * 1920, y = r() * 600, w = 6 + r() * 26, h = 90 + r() * 360; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, 'rgba(120,80,40,0)'); gr.addColorStop(.3, 'rgba(120,80,40,.08)'); gr.addColorStop(1, 'rgba(120,80,40,0)'); g.fillStyle = gr; g.fillRect(x, y, w, h); }
        tuboH(g, 0, 1920, 50, 46, [190, 760, 1330, 1810]);
        tuboH(g, 0, 1920, 112, 26, [420, 1050, 1620]);
        g.save(); g.translate(112, 0); g.rotate(Math.PI / 2); g.translate(0, 0); tuboH(g, 120, 1020, 0, 50, [260, 520, 780]); g.restore();
        manometro(g, 170, 270, 56, true); manometro(g, 170, 790, 56, false);
        // las calderas, al fondo: el frente de hierro con sus puertas
        const cg = g.createLinearGradient(0, 930, 0, 1080); cg.addColorStop(0, '#0e161e'); cg.addColorStop(.12, '#27343f'); cg.addColorStop(1, '#0a1016');
        g.fillStyle = cg; g.fillRect(0, 930, 1920, 150);
        g.fillStyle = 'rgba(180,210,235,.14)'; g.fillRect(0, 930, 1920, 3);
        for (let x = 40; x < 1920; x += 120) { g.fillStyle = 'rgba(160,190,215,.12)'; g.fillRect(x, 936, 3, 144); }
        [[1260, 150], [1500, 150], [1740, 150], [262, 130]].forEach(([x, w]) => {
          const y = 960;
          g.fillStyle = '#05080b'; rr(g, x - w / 2 - 8, y - 8, w + 16, 130, [w / 2 + 8, w / 2 + 8, 0, 0]); g.fill();
          g.fillStyle = '#1b252e'; rr(g, x - w / 2, y, w, 120, [w / 2, w / 2, 0, 0]); g.fill();
          g.strokeStyle = 'rgba(190,215,235,.18)'; g.lineWidth = 2; rr(g, x - w / 2 + 8, y + 8, w - 16, 104, [w / 2 - 8, w / 2 - 8, 0, 0]); g.stroke();
          g.fillStyle = '#e2c27a'; for (let i = 0; i < 2; i++) { circ(g, x - w / 2 + 16, y + 60 + i * 36, 4); g.fill(); circ(g, x + w / 2 - 16, y + 60 + i * 36, 4); g.fill(); }
        });
        // la placa de la derecha, donde sale el nombre
        const PX = 1176, PY = 196, PW = 664, PH = 700;
        g.save(); g.shadowColor = 'rgba(0,0,0,.65)'; g.shadowBlur = 40; g.shadowOffsetY = 18; rr(g, PX, PY, PW, PH, 22); g.fillStyle = '#4a3513'; g.fill(); g.restore();
        rr(g, PX, PY, PW, PH, 22); g.fillStyle = laton(g, PX, PY, PX + PW, PY + PH); g.fill();
        rr(g, PX + 14, PY + 14, PW - 28, PH - 28, 14); const pg = g.createLinearGradient(0, PY, 0, PY + PH); pg.addColorStop(0, '#2c4458'); pg.addColorStop(1, '#16273a'); g.fillStyle = pg; g.fill();
        g.strokeStyle = 'rgba(233,210,153,.55)'; g.lineWidth = 2; rr(g, PX + 26, PY + 26, PW - 52, PH - 52, 8); g.stroke();
        g.strokeStyle = 'rgba(233,210,153,.28)'; g.lineWidth = 1; rr(g, PX + 32, PY + 32, PW - 64, PH - 64, 5); g.stroke();
        [[PX + 40, PY + 40], [PX + PW - 40, PY + 40], [PX + 40, PY + PH - 40], [PX + PW - 40, PY + PH - 40]].forEach(([x, y]) => { const rg = g.createRadialGradient(x - 3, y - 3, 1, x, y, 11); rg.addColorStop(0, '#fff3cf'); rg.addColorStop(.45, '#c9a45a'); rg.addColorStop(1, '#4a3311'); g.fillStyle = rg; circ(g, x, y, 10); g.fill(); });
        // filetes art déco: sobre el grupo y bajo el nombre
        [372, 690].forEach(y => {
          const cx = PX + PW / 2; g.strokeStyle = 'rgba(233,210,153,.6)'; g.lineWidth = 2;
          g.beginPath(); g.moveTo(PX + 70, y); g.lineTo(cx - 26, y); g.moveTo(cx + 26, y); g.lineTo(PX + PW - 70, y); g.stroke();
          g.fillStyle = '#E9D299'; g.beginPath(); g.moveTo(cx, y - 11); g.lineTo(cx + 11, y); g.lineTo(cx, y + 11); g.lineTo(cx - 11, y); g.closePath(); g.fill();
          g.fillStyle = 'rgba(233,210,153,.6)'; circ(g, cx - 40, y, 3); g.fill(); circ(g, cx + 40, y, 3); g.fill();
        });
        // el pie del telégrafo: la columna y su base
        const cx = DX; g.save();
        const cl = g.createLinearGradient(cx - 92, 0, cx + 92, 0); cl.addColorStop(0, '#6B4F1E'); cl.addColorStop(.3, '#EAD18F'); cl.addColorStop(.55, '#C39B50'); cl.addColorStop(1, '#4F3813');
        g.fillStyle = cl; g.fillRect(cx - 78, DY + RB - 30, 156, 150);
        [DY + RB + 30, DY + RB + 84].forEach(y => { const bl = g.createLinearGradient(cx - 124, 0, cx + 124, 0); bl.addColorStop(0, '#5C4418'); bl.addColorStop(.3, '#F0DAA0'); bl.addColorStop(.6, '#B58E48'); bl.addColorStop(1, '#4A3412'); g.fillStyle = bl; rr(g, cx - 116, y, 232, 28, 10); g.fill(); });
        g.restore();
        // sombra del telégrafo sobre el mamparo
        g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 60; g.shadowOffsetY = 26; circ(g, DX, DY, RB); g.fillStyle = '#3d2c10'; g.fill(); g.restore();
      }

      /* el telégrafo: la cara crema (que gira con el tambor), el aro de latón con las órdenes grabadas y el centro */
      function pintaCara(g) {
        g.save(); g.translate(DX, DY);
        let gr = g.createRadialGradient(-70, -90, 20, 0, 0, RF); gr.addColorStop(0, '#FCF2D9'); gr.addColorStop(.7, '#F2E3BD'); gr.addColorStop(1, '#DDC690');
        circ(g, 0, 0, RF); g.fillStyle = gr; g.fill();
        g.save(); circ(g, 0, 0, RF); g.clip();
        const r = semilla(5);
        for (let i = 0; i < 700; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * RF; g.fillStyle = r() < .5 ? 'rgba(110,70,25,.06)' : 'rgba(255,255,240,.18)'; circ(g, Math.cos(a) * d, Math.sin(a) * d, .6 + r() * 1.8); g.fill(); }
        for (let i = 0; i < 7; i++) { const a = r() * 6.283, d = 120 + r() * 200; const sg = g.createRadialGradient(Math.cos(a) * d, Math.sin(a) * d, 2, Math.cos(a) * d, Math.sin(a) * d, 40 + r() * 50); sg.addColorStop(0, 'rgba(140,100,40,.10)'); sg.addColorStop(1, 'rgba(140,100,40,0)'); g.fillStyle = sg; g.fillRect(-RF, -RF, RF * 2, RF * 2); }
        g.restore();
        // los filetes grabados y las marcas de la cara
        g.strokeStyle = 'rgba(52,32,12,.75)'; g.lineWidth = 2.6; circ(g, 0, 0, RF - 10); g.stroke(); circ(g, 0, 0, rB + 14); g.stroke();
        g.lineWidth = 1.2; circ(g, 0, 0, RF - 16); g.stroke(); circ(g, 0, 0, rB + 20); g.stroke(); circ(g, 0, 0, rA - 12); g.stroke(); circ(g, 0, 0, rA - 18); g.stroke();
        g.lineWidth = 1.4;
        for (let d = 0; d < 360; d += 3) { const a = rad(d), l = d % 15 === 0 ? 12 : 6; g.beginPath(); g.moveTo(Math.sin(a) * (rB + 22), -Math.cos(a) * (rB + 22)); g.lineTo(Math.sin(a) * (rB + 22 + l), -Math.cos(a) * (rB + 22 + l)); g.stroke(); }
        g.restore();
      }
      function arcoTexto(g, txt, r, thC, flip) {
        const ws = [...txt].map(c => g.measureText(c).width), A_ = ws.reduce((a, b) => a + b, 0) / r;
        let ang = flip ? thC + A_ / 2 : thC - A_ / 2;
        [...txt].forEach((c, i) => {
          const w = ws[i] / r, mid = flip ? ang - w / 2 : ang + w / 2; ang = flip ? ang - w : ang + w;
          g.save(); g.rotate(mid + (flip ? Math.PI : 0)); g.translate(0, flip ? r : -r); g.fillText(c, 0, 0); g.restore();
        });
      }
      function pintaCasco(g) {
        g.save(); g.translate(DX, DY);
        // el aro exterior de latón
        anillo(g, RA, RB); g.fillStyle = laton(g, -RB, -RB, RB, RB); g.fill();
        g.lineWidth = 2; g.strokeStyle = 'rgba(255,244,205,.7)'; circ(g, 0, 0, RB - 1.5); g.stroke();
        g.strokeStyle = 'rgba(60,38,10,.65)'; circ(g, 0, 0, RB - 9); g.stroke(); circ(g, 0, 0, RA + 5); g.stroke();
        g.strokeStyle = 'rgba(255,244,205,.4)'; circ(g, 0, 0, RB - 11); g.stroke(); circ(g, 0, 0, RA + 7); g.stroke();
        for (let i = 0; i < 8; i++) { const a = rad(22.5 + i * 45), x = Math.sin(a) * (RA + RB) / 2, y = -Math.cos(a) * (RA + RB) / 2;
          const rg = g.createRadialGradient(x - 3, y - 3, 1, x, y, 12); rg.addColorStop(0, '#fff6d6'); rg.addColorStop(.5, '#B8923F'); rg.addColorStop(1, '#4a3311'); g.fillStyle = rg; circ(g, x, y, 10); g.fill();
          g.strokeStyle = 'rgba(40,26,8,.85)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x - 6 * Math.cos(a * 2.3), y - 6 * Math.sin(a * 2.3)); g.lineTo(x + 6 * Math.cos(a * 2.3), y + 6 * Math.sin(a * 2.3)); g.stroke(); }
        // el aro grabado con las órdenes
        anillo(g, RF, RA - 2); const eg = g.createLinearGradient(-RA, -RA, RA, RA); eg.addColorStop(0, '#D9BE80'); eg.addColorStop(.5, '#B8944E'); eg.addColorStop(1, '#8E6D2E'); g.fillStyle = eg; g.fill();
        g.fillStyle = '#2C1D0C'; g.font = JO(17); g.textAlign = 'center'; g.textBaseline = 'middle'; espaciado(g, 1.2);
        ORD.forEach((t, i) => { const th = rad(-135 + i * 33.75), flip = Math.abs(-135 + i * 33.75) > 90; arcoTexto(g, t, (RF + RA) / 2 + (flip ? -1 : 1), th, flip); });
        espaciado(g, 0);
        g.fillStyle = 'rgba(44,29,12,.8)'; for (let d = -135; d <= 135; d += 33.75 / 2) { if ((d + 135) % 33.75 === 0) continue; const a = rad(d); circ(g, Math.sin(a) * (RF + 6), -Math.cos(a) * (RF + 6), 2); g.fill(); }
        // la cara queda hundida: sombra en su borde
        const sg = g.createRadialGradient(0, 0, RF - 20, 0, 0, RF); sg.addColorStop(0, 'rgba(60,35,10,0)'); sg.addColorStop(1, 'rgba(60,35,10,.5)'); g.fillStyle = sg; circ(g, 0, 0, RF); g.fill();
        g.strokeStyle = 'rgba(40,26,8,.9)'; g.lineWidth = 3; circ(g, 0, 0, RF); g.stroke();
        g.restore();
      }
      function pintaCentro(g) {
        g.save(); g.translate(DX, DY);
        circ(g, 0, 0, RH); g.fillStyle = laton(g, -RH, -RH, RH, RH); g.fill();
        g.strokeStyle = 'rgba(52,32,10,.6)'; g.lineWidth = 1.6; for (let r = 28; r < RH; r += 9) { circ(g, 0, 0, r); g.stroke(); }
        g.strokeStyle = 'rgba(255,244,205,.35)'; g.lineWidth = 1; for (let r = 32; r < RH; r += 9) { circ(g, 0, 0, r); g.stroke(); }
        g.lineWidth = 3; g.strokeStyle = 'rgba(52,32,10,.85)'; circ(g, 0, 0, RH); g.stroke();
        g.restore();
      }
      function rehaz() {
        const k = L.k || 1;
        fijo = capaFija(k, pintaFijo); casco = capaFija(k, pintaCasco, DX - RB - 6, DY - RB - 6, 2 * RB + 12, 2 * RB + 12);
        centro = capaFija(k, pintaCentro, DX - RH - 4, DY - RH - 4, 2 * RH + 8, 2 * RH + 8); cara = capaFija(k, pintaCara, DX - RF - 3, DY - RF - 3, 2 * RF + 6, 2 * RF + 6);
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) rehaz(); }

      /* la palanca: de latón, con su cola de contrapeso y el puño fuera del aro */
      function palanca(a, desde, hasta) {
        g.save(); g.translate(DX, DY); g.rotate(rad(a - 90));
        g.beginPath(); g.rect(desde, -70, hasta - desde, 140); g.clip();
        const bg = g.createLinearGradient(0, -22, 0, 22); bg.addColorStop(0, '#6E5220'); bg.addColorStop(.2, '#F2DC9C'); bg.addColorStop(.42, '#C9A45C'); bg.addColorStop(.7, '#E4CC88'); bg.addColorStop(1, '#5A4218');
        g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 14; g.shadowOffsetX = 5; g.shadowOffsetY = 9;
        g.fillStyle = bg;
        g.beginPath(); g.moveTo(-6, -19); g.lineTo(150, -15); g.lineTo(370, -7); g.lineTo(372, 7); g.lineTo(150, 15); g.lineTo(-6, 19); g.closePath(); g.fill();        // la hoja
        g.fillRect(366, -8, 78, 16);                                                                                                                                  // la varilla
        rr(g, 436, -20, 62, 40, 16); g.fill();                                                                                                                         // el puño
        g.fillRect(-84, -9, 82, 18); circ(g, -90, 0, 24); g.fill();                                                                                                    // la cola y su contrapeso
        g.shadowColor = 'transparent';
        // el filete rojo de la hoja, que marca el sector
        g.strokeStyle = '#B3261E'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(60, 0); g.lineTo(346, 0); g.stroke();
        g.fillStyle = '#B3261E'; g.beginPath(); g.moveTo(346, -9); g.lineTo(366, 0); g.lineTo(346, 9); g.closePath(); g.fill();
        // las estrías del puño y el brillo
        g.strokeStyle = 'rgba(52,32,10,.55)'; g.lineWidth = 2; for (let x = 450; x < 492; x += 8) { g.beginPath(); g.moveTo(x, -18); g.lineTo(x, 18); g.stroke(); }
        g.strokeStyle = 'rgba(255,248,220,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(14, -10); g.lineTo(140, -8); g.moveTo(444, -5); g.lineTo(492, -5); g.stroke();
        g.restore();
      }
      function cubo() {                   // el cubo de la palanca, sobre el centro
        g.save(); g.translate(DX, DY);
        g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 10; g.shadowOffsetY = 6;
        circ(g, 0, 0, 46); g.fillStyle = laton(g, -46, -46, 46, 46); g.fill(); g.shadowColor = 'transparent';
        g.strokeStyle = 'rgba(52,32,10,.7)'; g.lineWidth = 2; circ(g, 0, 0, 40); g.stroke(); circ(g, 0, 0, 22); g.stroke();
        g.strokeStyle = 'rgba(255,244,205,.55)'; g.lineWidth = 1.4; circ(g, 0, 0, 42); g.stroke();
        circ(g, 0, 0, 13); const rg = g.createRadialGradient(-3, -4, 1, 0, 0, 14); rg.addColorStop(0, '#fff6d6'); rg.addColorStop(1, '#6a4d1a'); g.fillStyle = rg; g.fill();
        g.strokeStyle = 'rgba(30,20,6,.9)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-7, 3); g.lineTo(7, -3); g.stroke();
        g.restore();
      }

      /* los nombres, escritos a lo largo del radio (en la mitad izquierda, boca abajo se leería mal: se giran para leerse hacia dentro) */
      function prepara(bombo) {
        const n = bombo.length; st.items = bombo.slice(); st.n = n; st.modo = n >= 9 ? 'tambor' : 'sector';
        if (st.modo === 'sector') { st.S = Math.max(6, n); st.slotDe = bombo.map((_, j) => n >= st.S ? j : Math.floor((j + .5) * st.S / n)); st.u = clamp(st.u, 0, st.S - 1); }
        else { st.S = n; st.slotDe = []; st.p = ((st.p % n) + n) % n; }
        const paso = st.modo === 'sector' ? 270 / st.S : 360 / n, H = rA * rad(paso) * (st.modo === 'sector' ? .8 : .74);
        st.fm = bombo.map(nom => rotula(g, JO, String(nom).toUpperCase(), LB, H, st.modo === 'sector' ? 36 : 30, st.modo === 'sector' ? 17 : 13, true));
      }
      function pintaTexto(j, a, alfa, lit) {
        const f = st.fm[j]; if (!f) return;
        const flip = Math.sin(rad(a)) < -0.001;
        g.save(); g.translate(DX, DY); g.rotate(rad(a) - Math.PI / 2 + (flip ? Math.PI : 0));
        g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = JO(f.px); g.globalAlpha = alfa;
        g.fillStyle = lit ? '#5A1308' : '#2B1B0E';
        const x = flip ? -rm : rm, lh = f.px * 1.08, y0 = -(f.lineas.length - 1) * lh / 2;
        f.lineas.forEach((ln, i) => textoCabe(g, ln, x, y0 + i * lh + f.px * .04, LB));
        g.restore();
      }
      function pintaEsfera() {
        const tambor = st.modo === 'tambor', n = st.n;
        // la cara (gira en el tambor)
        g.save(); g.translate(DX, DY); if (tambor) g.rotate(rad(st.rot)); g.drawImage(cara.c, -RF - 3, -RF - 3, 2 * RF + 6, 2 * RF + 6); g.restore();
        ponCapa(g, centro);
        // el sector del elegido, encendido
        const mitad = tambor ? 180 / n : 135 / st.S;
        if (st.sel >= 0 && st.luz > 0) {
          const a = angNombre(st.sel), a0 = rad(a - mitad) - Math.PI / 2, a1 = rad(a + mitad) - Math.PI / 2;
          g.save(); g.translate(DX, DY); g.beginPath(); g.arc(0, 0, rB + 12, a0, a1); g.arc(0, 0, rA - 10, a1, a0, true); g.closePath();
          const gr = g.createRadialGradient(0, 0, rA - 10, 0, 0, rB + 12); gr.addColorStop(0, `rgba(255,214,120,${.78 * st.luz})`); gr.addColorStop(1, `rgba(255,190,80,${.66 * st.luz})`);
          g.fillStyle = gr; g.fill(); g.lineWidth = 3; g.strokeStyle = `rgba(255,250,215,${.9 * st.luz})`; g.stroke(); g.restore();
        }
        // las rayas entre sectores
        g.save(); g.translate(DX, DY); g.strokeStyle = 'rgba(52,32,12,.5)'; g.lineWidth = 1.6;
        const nraya = tambor ? n : st.S + 1;
        for (let j = 0; j < nraya; j++) { const th = tambor ? j * 360 / n + st.rot - 180 / n : -135 + 270 * j / st.S, a = rad(th), ex = (!tambor && (j === 0 || j === st.S)); if (ex) { g.lineWidth = 4; g.strokeStyle = 'rgba(52,32,12,.8)'; }
          g.beginPath(); g.moveTo(Math.sin(a) * (rA - 12), -Math.cos(a) * (rA - 12)); g.lineTo(Math.sin(a) * (rB + 12), -Math.cos(a) * (rB + 12)); g.stroke(); if (ex) { g.lineWidth = 1.6; g.strokeStyle = 'rgba(52,32,12,.5)'; } }
        g.restore();
        // los sectores sin nombre (si hay menos nombres que sectores): un rombo grabado
        if (!tambor) { g.save(); g.translate(DX, DY); g.fillStyle = 'rgba(52,32,12,.32)'; for (let sI = 0; sI < st.S; sI++) { if (st.slotDe.indexOf(sI) >= 0) continue; const a = rad(thSlot(sI)); g.save(); g.rotate(a); g.beginPath(); g.moveTo(0, -rm - 9); g.lineTo(7, -rm); g.lineTo(0, -rm + 9); g.lineTo(-7, -rm); g.closePath(); g.fill(); g.restore(); } g.restore(); }
        // la palanca (su hoja va debajo de los nombres, que están escritos sobre el cristal)
        palanca(angPalanca() + mov * Math.sin(st.t * 53) * .22 * (1 - Math.min(1, Math.abs(st.vel) / 4)) + st.sacude * Math.sin(st.t * 70) * 1.4, -100, RF + 2);
        // los nombres
        const v = Math.abs(st.vel), copias = tambor && v > 6 ? Math.min(5, 1 + Math.floor(v / 8)) : 1;
        for (let j = 0; j < n; j++) {
          if (!tambor && st.sel >= 0 && j === st.sel && st.luz > 0) { pintaTexto(j, angNombre(j), 1, true); continue; }
          for (let c = 0; c < copias; c++) {
            const a = angNombre(j) + (copias > 1 ? c * Math.sign(st.vel || 1) * v * .02 : 0);
            pintaTexto(j, a, copias > 1 ? Math.pow(1 - c / copias, 1.5) * 2.1 / copias : 1, tambor && st.sel === j && st.luz > 0);
          }
        }
        // en el tambor: todo lo que no está en la ventana queda más oscuro, y la ventana lleva su marco de latón
        if (tambor) {
          const w = 180 / n + 1.2, a1 = rad(90 + w) - Math.PI / 2, a2 = rad(90 - w + 360) - Math.PI / 2;
          g.save(); g.translate(DX, DY); g.beginPath(); g.arc(0, 0, RF - 1, a1, a2); g.arc(0, 0, RH, a2, a1, true); g.closePath(); g.fillStyle = 'rgba(70,44,14,.30)'; g.fill();
          [90 - w, 90 + w].forEach(d => { const a = rad(d); g.save(); g.rotate(a - Math.PI / 2); g.fillStyle = laton(g, RH, -4, RF, 4); g.fillRect(RH, -4, RF - RH, 8); g.restore(); });
          g.restore();
        }
        ponCapa(g, casco);
        palanca(angPalanca() + mov * Math.sin(st.t * 53) * .22 * (1 - Math.min(1, Math.abs(st.vel) / 4)) + st.sacude * Math.sin(st.t * 70) * 1.4, RF + 2, 540);
        cubo();
        // el brillo del cristal
        g.save(); circ(g, DX, DY, RF - 1); g.clip();
        let gr = g.createLinearGradient(DX - RF, DY - RF, DX + 40, DY + 60); gr.addColorStop(0, 'rgba(255,255,255,.17)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.beginPath(); g.ellipse(DX - 110, DY - 170, 250, 128, -.62, 0, 6.283); g.fill();
        g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 5; g.beginPath(); g.arc(DX, DY, RF - 14, Math.PI * 1.08, Math.PI * 1.42); g.stroke();
        g.restore();
      }

      /* el ambiente: el brillo de las calderas, el vapor, las chispas y los manómetros */
      function pintaAmbiente(dt) {
        const fl = .5 + .5 * Math.sin(st.t * 3.1) * mov * .5 + (mov ? .12 * Math.sin(st.t * 11.7 + 1) : 0);
        g.save(); g.globalCompositeOperation = 'lighter';
        let gr = g.createLinearGradient(0, 1080, 0, 640); gr.addColorStop(0, `rgba(255,130,40,${.30 * fl})`); gr.addColorStop(1, 'rgba(255,130,40,0)'); g.fillStyle = gr; g.fillRect(0, 640, 1920, 440);
        [[1260, 150], [1500, 150], [1740, 150], [262, 130]].forEach(([x, w], i) => {
          const f2 = .7 + .3 * Math.sin(st.t * (4.2 + i) + i * 2) * mov;
          gr = g.createRadialGradient(x, 1030, 6, x, 1030, 380); gr.addColorStop(0, `rgba(255,170,70,${.42 * f2})`); gr.addColorStop(.35, `rgba(255,110,30,${.18 * f2})`); gr.addColorStop(1, 'rgba(255,110,30,0)'); g.fillStyle = gr; g.fillRect(x - 380, 650, 760, 430);
          gr = g.createLinearGradient(0, 976, 0, 1076); gr.addColorStop(0, `rgba(255,200,110,${.55 * f2})`); gr.addColorStop(1, `rgba(255,90,20,${.35 * f2})`); g.fillStyle = gr; rr(g, x - w / 2 + 12, 972, w - 24, 104, [w / 2 - 12, w / 2 - 12, 0, 0]); g.fill();
        });
        g.restore();
        // los manómetros: la aguja tiembla con la máquina
        [[170, 270, .62], [170, 790, .3]].forEach(([x, y, base], i) => {
          const a = rad(-135 + 270 * clamp(base + .04 * Math.sin(st.t * (2.3 + i)) * mov + .012 * Math.sin(st.t * 31) * mov + .22 * Math.min(1, Math.abs(st.vel) / 10) * (i ? 0 : 1), 0, 1));
          g.save(); g.translate(x, y); g.rotate(a); g.strokeStyle = '#7a1510'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 8); g.lineTo(0, -42); g.stroke(); g.fillStyle = '#2a1d0e'; circ(g, 0, 0, 5); g.fill(); g.restore();
        });
        if (!mov) return;
        // chispas que suben de las calderas y vapor que sale de las tuberías
        if (st.chisp.length < 34 && Math.random() < .5) st.chisp.push({ x: 120 + Math.random() * 1700, y: 1040 + Math.random() * 30, vy: 40 + Math.random() * 70, vx: (Math.random() - .5) * 20, r: .8 + Math.random() * 1.8, v: 1.4 + Math.random() * 1.8, f: Math.random() * 6 });
        g.save(); g.globalCompositeOperation = 'lighter';
        st.chisp = st.chisp.filter(c => { c.y -= c.vy * dt; c.x += (c.vx + Math.sin(st.t * 2 + c.f) * 14) * dt; c.v -= dt; if (c.v <= 0 || c.y < 620) return false;
          g.fillStyle = `rgba(255,${150 + Math.round(60 * c.v / 3)},60,${clamp(c.v / 1.6, 0, .85)})`; circ(g, c.x, c.y, c.r); g.fill(); return true; });
        g.restore();
        if (Math.random() < dt * 0.9 && st.bruma.length < 26) st.bruma.push({ x: [190, 760, 1330][Math.floor(Math.random() * 3)] + (Math.random() - .5) * 10, y: 100, r: 10, vy: 34 + Math.random() * 20, v: 3.6, vx: 6 + Math.random() * 12 });
        st.bruma = st.bruma.filter(b => { b.y += b.vy * dt * .4; b.x += b.vx * dt; b.r += 22 * dt; b.v -= dt; if (b.v <= 0) return false;
          g.fillStyle = `rgba(214,230,242,${clamp(b.v / 3.6, 0, 1) * .11})`; circ(g, b.x, b.y, b.r); g.fill(); return true; });
      }
      function pintaFin() {                  // al parar: el aro de luz, el vapor y las estrellitas en el sector
        if (st.luz <= 0 || st.sel < 0) return;
        const a = rad(angNombre(st.sel)), x = DX + Math.sin(a) * rm, y = DY - Math.cos(a) * rm, f = st.fin;
        g.save(); g.globalCompositeOperation = 'lighter';
        let gr = g.createRadialGradient(x, y, 10, x, y, 300); gr.addColorStop(0, `rgba(255,214,130,${.38 * st.luz})`); gr.addColorStop(1, 'rgba(255,214,130,0)'); g.fillStyle = gr; g.fillRect(x - 300, y - 300, 600, 600);
        if (f > 0 && f < 1) { g.strokeStyle = `rgba(255,236,170,${.7 * (1 - f)})`; g.lineWidth = 5; g.beginPath(); g.arc(DX, DY, RB + 6 + f * 70, 0, 6.283); g.stroke(); }
        const sx = DX + Math.sin(a) * (rB + 30), sy = DY - Math.cos(a) * (rB + 30);
        for (let i = 0; i < 4; i++) { const ph = st.t * 1.4 + i * 1.7, s = (.5 + .5 * Math.sin(ph * 3)) * st.luz * (28 + i * 6), ox = Math.cos(i * 2.1) * (50 + i * 24), oy = Math.sin(i * 2.7) * (50 + i * 20);
          g.fillStyle = 'rgba(255,244,200,.9)'; g.beginPath(); g.moveTo(sx + ox, sy + oy - s); g.quadraticCurveTo(sx + ox, sy + oy, sx + ox + s, sy + oy); g.quadraticCurveTo(sx + ox, sy + oy, sx + ox, sy + oy + s); g.quadraticCurveTo(sx + ox, sy + oy, sx + ox - s, sy + oy); g.quadraticCurveTo(sx + ox, sy + oy, sx + ox, sy + oy - s); g.fill(); }
        g.restore();
      }

      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt; st.sacude = Math.max(0, st.sacude - dt * 3);
        if (st.fin > 0 && st.fin < 1) st.fin = Math.min(1, st.fin + dt * 1.1);
        L.borra();
        if (fijo) { ponCapa(g, fijo); pintaAmbiente(dt); if (cara && casco && centro) pintaEsfera(); pintaFin(); }
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.telegrafo.fuentes, () => { if (!vivo) return; rehaz(); if (st.n) prepara(st.items); });

      /* los sonidos: la campana del barco (si el portal la da) y, si no, una de latón sintética; el trinquete y los topes, sintéticos */
      const son = {}, S = o.sonidos || {};
      A.carga(S.campana).then(b => { son.campana = b; });
      let tTic = 0;
      function tic(v) {
        const ac = A.ac; if (!ac) return; const t = ac.currentTime; if (t - tTic < .03) return; tTic = t;
        const gan = clamp(.22 + .03 * Math.min(v, 14), .2, .6);
        A.clic({ f: 2400 + Math.random() * 700, q: 3, gan, dur: .02, wet: .25 }); A.clic({ f: 760, q: 1.4, gan: gan * .7, dur: .035, wet: .2, t: .004 });
      }
      function tope(v) {
        if (!A.ac) return; const gan = clamp(.35 + v * .05, .35, .85);
        A.clic({ f: 1050, q: 1.6, gan, dur: .09, wet: .35 }); A.nota(420, { tipo: 'triangle', dur: .35, gan: gan * .22, wet: .35 }); A.nota(190, { tipo: 'sine', dur: .25, gan: gan * .5, desliza: 120 });
      }
      function campanazo() {
        if (!A.ac) return;
        if (son.campana) { A.trozo(son.campana, { gan: .95, dur: 1.05, fade: .3, wet: .3 }); A.trozo(son.campana, { t: .56, gan: 1, dur: 2.5, fade: 1.3, wet: .45 }); }
        else [0, .56].forEach((t, i) => [622, 1244, 1866, 2490].forEach((fq, q) => A.nota(fq * (q ? 1.002 : 1), { tipo: 'sine', t, dur: i ? 2.4 : 1.1, gan: [.3, .17, .09, .05][q], wet: .5 })));
      }

      return {
        ajusta,
        espera() { if (!st.n) prepara(['· · ·']); },
        async gira(bombo, k) {
          prepara(bombo); const n = bombo.length;
          st.luz = 0; st.sel = -1; st.fin = 0;
          const ac = A.crea(), T = RM ? 1.7 : T_GIRO, sector = st.modo === 'sector';
          let f, p0, p1, m = 0, paso = 360 / n;
          if (sector) {
            m = st.S - 1; p0 = clamp(st.u, 0, m); p1 = destinoVaiven(p0, m, st.slotDe[k], (RM ? 1.2 : 3.2) * m + 1);
          } else { p0 = Math.round(st.p); p1 = p0 + n * Math.ceil((RM ? 7 : 34) / n); p1 += ((k - p1) % n + n) % n; }
          f = recorrido(p0, p1, { T, p: 2.45 });
          // el arranque: el golpe de la palanca al soltarse, el vapor y el ruido de la máquina que sube
          let sil = null;
          if (ac) {
            A.nota(70, { tipo: 'sine', dur: .4, gan: .55, desliza: 38 }); A.clic({ f: 900, q: 1.2, gan: .8, dur: .12, wet: .4 });
            if (!RM) { A.nota(48, { tipo: 'sawtooth', dur: 4.9, gan: .06, ataque: 1.2, filtro: { f: 240 }, wet: .4 }); A.nota(72, { tipo: 'triangle', dur: 4.8, gan: .045, ataque: 1.6, filtro: { f: 420 }, wet: .5, t: .1 }); }
            sil = A.continuo({ f: 3200, q: .6, wet: .2 });
          }
          await new Promise(ok => {
            const t0 = performance.now(); let ult = Math.floor((sector ? p0 : p0) + .5), antes = p0, dirAnt = 0, uAnt = st.u;
            (function paso_() {
              const t = (performance.now() - t0) / 1000, p = f(Math.min(t, f.T));
              st.vel = (p - antes) * 60; antes = p;
              if (sector) {
                const u = vaiven(p, m), du = u - uAnt; st.u = u; uAnt = u;
                const d = Math.abs(du) > 1e-5 ? Math.sign(du) : 0;
                if (d && dirAnt && d !== dirAnt && (u < 1.2 || u > m - 1.2)) { tope(Math.abs(st.vel) * .5); st.sacude = .5; }
                if (d) dirAnt = d;
                const cel = Math.floor(u + .5); if (cel !== ult) { ult = cel; tic(Math.abs(st.vel)); }
              } else {
                st.p = p; st.rot = 90 - p * paso;
                const cel = Math.floor(p + .5); if (cel !== ult) { ult = cel; tic(Math.abs(st.vel) * .5); }
              }
              if (sil) { A.pon(sil.g.gain, clamp(Math.abs(st.vel) / (sector ? 12 : 30), 0, 1) * .05, .05); A.pon(sil.f.frequency, 2200 + 130 * Math.abs(st.vel), .05); }
              if (t < f.T) requestAnimationFrame(paso_); else { if (sector) st.u = vaiven(p1, m); else { st.p = ((p1 % n) + n) % n; st.rot = 90 - p1 * paso; } st.vel = 0; if (sil) sil.para(.4); ok(); }
            })();
          });
          // para en el elegido: doble campanazo, el sector se ilumina y sale el vapor
          st.sel = k; st.fin = RM ? 1 : .001; st.sacude = RM ? 0 : .9;
          campanazo(); A.clic({ f: 700, q: 1, gan: .7, dur: .16, wet: .4 });
          if (ac && !RM) A.clic({ f: 5200, q: .5, gan: .5, dur: .5, wet: .3, t: .1 });
          if (!RM) for (let i = 0; i < 10; i++) { const a = rad(angNombre(k)); st.bruma.push({ x: DX + Math.sin(a) * (RB + 4) + (Math.random() - .5) * 40, y: DY - Math.cos(a) * (RB + 4) + (Math.random() - .5) * 40, r: 14, vy: -60 - Math.random() * 50, v: 2.6, vx: (Math.random() - .5) * 40 }); }
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 520; (function p_() { const u = (performance.now() - t0) / d; st.luz = eo(u, 2); if (u < 1) requestAnimationFrame(p_); else { st.luz = 1; ok(); } })(); });
          await new Promise(ok => setTimeout(ok, RM ? 200 : 520));
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «tabla» · Blues, acto 2 «Músicos callejeros» (Nueva Orleans): la tabla de lavar de la banda callejera ──
     Una tabla de lavar vertical, con su marco de madera y su chapa ondulada, en una calle de noche con farolas de gas. Los nombres están
     pintados sobre las ondas, uno por franja, y un dedal de metal las recorre raspando (el raspar de la tabla, ola a ola), de arriba
     abajo y de abajo arriba, cada vez más despacio, y se queda en la onda de uno. Brilla la franja y el nombre salta. */
  TEMAS.tabla = {
    fuentes: ['600 40px Jost', '600 40px "Cormorant Garamond"', '500 24px Jost'],
    nombreFit: { min: 40 },
    css: `
.lmv-t-tabla .lmv-velo{background:radial-gradient(ellipse at 32% 50%,rgba(40,26,20,.965) 0%,rgba(20,13,12,.985) 58%,rgba(7,5,7,.995) 100%)}
.lmv-t-tabla .lmv-cab{top:196px;left:930px;right:90px}
.lmv-t-tabla .lmv-ceja{font:600 46px/1 "Cormorant Garamond",Georgia,serif;letter-spacing:.34em;text-transform:uppercase;color:#F0C77A;text-shadow:0 0 22px rgba(240,170,70,.4),0 3px 10px rgba(0,0,0,.85)}
.lmv-t-tabla .lmv-grupo{margin-top:18px;font:500 23px/1 Jost,"Avenir Next",system-ui,sans-serif;letter-spacing:.1em;white-space:nowrap;color:rgba(240,222,184,.78)}
.lmv-t-tabla .lmv-nombre{top:318px;left:930px;right:90px;height:300px;display:flex;align-items:center;justify-content:center;white-space:normal;font:600 124px/1.02 "Cormorant Garamond",Georgia,serif;color:#FFE5B0;text-shadow:0 0 36px rgba(255,170,60,.55),0 0 90px rgba(255,150,40,.25),0 5px 18px rgba(0,0,0,.9)}
.lmv-t-tabla .lmv-nombre.ve{animation:lmv-salta .95s cubic-bezier(.2,.8,.3,1) forwards}
@keyframes lmv-salta{0%{opacity:0;transform:translateY(90px) scale(.7);filter:blur(8px)}30%{opacity:1;transform:translateY(-38px) scale(1.08);filter:blur(0)}50%{transform:translateY(10px) scale(.99)}68%{transform:translateY(-12px)}84%{transform:translateY(3px)}100%{opacity:1;transform:none;filter:none}}
.lmv-t-tabla .lmv-nota{top:640px;left:930px;right:90px;font:italic 500 28px/1.3 "Cormorant Garamond",Georgia,serif;color:#E8D3A6}
.lmv-t-tabla .lmv-pie{left:930px;right:90px;bottom:auto;top:728px;gap:22px}
.lmv-t-tabla .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:16px 34px;border-radius:5px;border:2px solid #D9A24C;background:rgba(26,16,10,.82);color:#F6E6C4;font:600 21px/1 Jost,"Avenir Next",system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;transition:background .2s,transform .15s}
.lmv-t-tabla .lmv-b:hover{background:rgba(217,162,76,.25);transform:translateY(-2px)}
.lmv-t-tabla .lmv-b.lmv-otra{background:linear-gradient(#C48E42,#9A6A2E 58%,#6E4A1B);border-color:#E8BE72;color:#FFF3D8}
.lmv-t-tabla .lmv-b.lmv-otra:hover{background:linear-gradient(#D49F50,#AC7835 58%,#7C5421)}
.lmv-t-tabla .lmv-cargando{color:#F0C77A}
@media (prefers-reduced-motion:reduce){.lmv-t-tabla .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const JO = px => `600 ${px}px Jost,"Avenir Next",system-ui,sans-serif`, CG = (px, w) => `${w || 600} ${px}px "Cormorant Garamond",Georgia,serif`;
      const BX = 250, BY = 64, BW = 560, BH = 966, PX0 = 300, PX1 = 760, PY0 = 232, PY1 = 934, LX = 724, TXC = 498, TXW = 372;
      const st = { items: [], n: 0, V: 7, band: [], bandH: 100, rb: 7, fm: [], u: 0, vel: 0, sel: -1, luz: 0, t: 0, golpe: 0, notas: [], chisp: [] };
      let fijo = null, tablero = null, raf = 0, vivo = true;
      const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.283); };
      const yDe = u => PY0 + (u + .5) * st.bandH;

      function madera(g, x, y, w, h, vert, sem) {
        const r = semilla(sem), gr = vert ? g.createLinearGradient(x, 0, x + w, 0) : g.createLinearGradient(0, y, 0, y + h);
        gr.addColorStop(0, '#4a2f16'); gr.addColorStop(.5, '#7a4f27'); gr.addColorStop(1, '#46290f'); g.fillStyle = gr; g.fillRect(x, y, w, h);
        g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
        const n = Math.round(w * h / 700);
        for (let i = 0; i < n; i++) { const px = x + r() * w, py = y + r() * h, l = 40 + r() * 170; g.strokeStyle = r() < .55 ? `rgba(20,10,2,${.07 + r() * .11})` : `rgba(255,214,150,${.03 + r() * .07})`; g.lineWidth = .6 + r() * 1.5;
          g.beginPath(); g.moveTo(px, py); if (vert) g.lineTo(px + (r() - .5) * 4, py + l); else g.lineTo(px + l, py + (r() - .5) * 4); g.stroke(); }
        for (let i = 0; i < 2; i++) { const px = x + 8 + r() * (w - 16), py = y + 8 + r() * (h - 16); g.strokeStyle = 'rgba(25,12,3,.35)'; g.lineWidth = 2; g.beginPath(); g.ellipse(px, py, vert ? 4 : 9, vert ? 9 : 4, 0, 0, 6.283); g.stroke(); g.beginPath(); g.ellipse(px, py, vert ? 8 : 16, vert ? 16 : 8, 0, 0, 6.283); g.stroke(); }
        g.restore();
        g.strokeStyle = 'rgba(255,224,170,.25)'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2);
      }
      function clavo(g, x, y) { const rg = g.createRadialGradient(x - 1.5, y - 1.5, .5, x, y, 6); rg.addColorStop(0, '#d8c9a8'); rg.addColorStop(1, '#3d3426'); g.fillStyle = rg; circ(g, x, y, 5); g.fill(); }

      /* la calle de noche: la fachada de ladrillo, las ventanas, los balcones, las farolas de gas y el empedrado */
      function ventana(g, x, y, w, h, enc) {
        g.fillStyle = '#25180f'; rr(g, x - 16, y - 16, w + 32, h + 32, [w / 2 + 16, w / 2 + 16, 4, 4]); g.fill();
        const gr = g.createLinearGradient(0, y, 0, y + h); if (enc) { gr.addColorStop(0, '#f0b55a'); gr.addColorStop(1, '#a85f22'); } else { gr.addColorStop(0, '#1d2a3a'); gr.addColorStop(1, '#0c141e'); }
        g.fillStyle = gr; rr(g, x, y, w, h, [w / 2, w / 2, 0, 0]); g.fill();
        g.strokeStyle = '#1a0f08'; g.lineWidth = 5; g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); g.moveTo(x, y + h * .38); g.lineTo(x + w, y + h * .38); g.stroke();
        // las contraventanas abiertas, con sus lamas
        [[x - w * .5 - 20, 1], [x + w + 20, 1]].forEach(([sx]) => { g.fillStyle = '#26382d'; g.fillRect(sx, y - 6, w * .5, h + 12);
          g.strokeStyle = 'rgba(8,16,10,.7)'; g.lineWidth = 2; for (let yy = y + 4; yy < y + h + 4; yy += 11) { g.beginPath(); g.moveTo(sx + 3, yy); g.lineTo(sx + w * .5 - 3, yy); g.stroke(); }
          g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(sx, y - 6, 4, h + 12); });
        g.fillStyle = '#6b5a47'; g.fillRect(x - 24, y + h + 8, w + 48, 12);
      }
      function balcon(g, x0, x1, y) {
        g.fillStyle = '#17110d'; g.fillRect(x0, y, x1 - x0, 14);
        g.fillStyle = 'rgba(255,214,160,.14)'; g.fillRect(x0, y, x1 - x0, 2);
        g.strokeStyle = '#120d0a'; g.lineWidth = 3;
        g.beginPath(); g.moveTo(x0, y - 70); g.lineTo(x1, y - 70); g.stroke();
        for (let x = x0 + 8; x < x1; x += 24) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 70); g.stroke(); }
        g.lineWidth = 2.4; for (let x = x0 + 20; x < x1 - 12; x += 48) { circ(g, x, y - 36, 12); g.stroke(); circ(g, x + 24, y - 36, 12); g.stroke(); }
      }
      function farola(g, x, y) {
        g.fillStyle = '#0e0a09'; g.fillRect(x - 6, y + 70, 12, 700); g.fillRect(x - 18, y + 520, 36, 18); g.fillRect(x - 24, y + 760, 48, 14);
        g.beginPath(); g.moveTo(x - 36, y + 12); g.lineTo(x + 36, y + 12); g.lineTo(x + 24, y + 78); g.lineTo(x - 24, y + 78); g.closePath(); g.fillStyle = '#1b1411'; g.fill();
        const gr = g.createLinearGradient(0, y + 16, 0, y + 74); gr.addColorStop(0, '#fff0b8'); gr.addColorStop(1, '#f0a23c'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 30, y + 18); g.lineTo(x + 30, y + 18); g.lineTo(x + 20, y + 72); g.lineTo(x - 20, y + 72); g.closePath(); g.fill();
        g.strokeStyle = '#0e0a09'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y + 18); g.lineTo(x, y + 72); g.stroke();
        g.fillStyle = '#0e0a09'; g.beginPath(); g.moveTo(x - 44, y + 12); g.lineTo(x, y - 26); g.lineTo(x + 44, y + 12); g.closePath(); g.fill(); circ(g, x, y - 32, 6); g.fill();
      }
      function pintaFijo(g) {
        const r = semilla(23);
        let gr = g.createLinearGradient(0, 0, 0, 150); gr.addColorStop(0, '#0f0b19'); gr.addColorStop(1, '#2d1d2c'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 160);
        for (let i = 0; i < 46; i++) { g.fillStyle = `rgba(255,236,200,${.2 + r() * .5})`; circ(g, r() * 1920, r() * 90, .6 + r() * 1.2); g.fill(); }
        g.fillStyle = '#100b10'; g.beginPath(); g.moveTo(0, 150); g.lineTo(0, 118); g.lineTo(330, 118); g.lineTo(330, 96); g.lineTo(380, 96); g.lineTo(380, 118); g.lineTo(980, 118); g.lineTo(980, 104); g.lineTo(1012, 104); g.lineTo(1012, 118); g.lineTo(1500, 118); g.lineTo(1500, 90); g.lineTo(1556, 90); g.lineTo(1556, 118); g.lineTo(1920, 118); g.lineTo(1920, 150); g.closePath(); g.fill();
        // la fachada
        g.fillStyle = '#3c2619'; g.fillRect(0, 118, 1920, 870);
        for (let y = 124, fila = 0; y < 988; y += 22, fila++) for (let x = (fila % 2 ? -32 : 0); x < 1920; x += 64) {
          const s = r(), c = Math.round(68 + s * 30); g.fillStyle = `rgb(${c},${Math.round(c * .58)},${Math.round(c * .42)})`; g.fillRect(x + 1.5, y + 1.5, 61, 19);
          if (r() < .12) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 1.5, y + 1.5, 61, 19); } }
        g.fillStyle = '#2a1b12'; g.fillRect(0, 118, 1920, 18); g.fillStyle = 'rgba(255,214,160,.12)'; g.fillRect(0, 118, 1920, 2);
        ventana(g, 96, 330, 92, 270, true); ventana(g, 1000, 270, 130, 320, false); ventana(g, 1340, 270, 130, 320, true); ventana(g, 1680, 270, 130, 320, false);
        balcon(g, 880, 1920, 676); balcon(g, 0, 300, 720);
        // el suelo: empedrado con charcos
        gr = g.createLinearGradient(0, 972, 0, 1080); gr.addColorStop(0, '#201712'); gr.addColorStop(1, '#0d0907'); g.fillStyle = gr; g.fillRect(0, 972, 1920, 108);
        for (let f = 0; f < 5; f++) { const y = 976 + f * 21 + f * f * 1.2, h = 14 + f * 3.4, w = 38 + f * 12; for (let x = (f % 2 ? -w / 2 : 0) - r() * 10; x < 1920; x += w + 3) { const c = Math.round(44 + r() * 30); g.fillStyle = `rgb(${c},${Math.round(c * .82)},${Math.round(c * .68)})`; rr(g, x, y, w, h, h / 3); g.fill(); g.fillStyle = 'rgba(255,220,170,.07)'; g.fillRect(x + 4, y + 1, w - 8, 2); } }
        g.fillStyle = 'rgba(8,6,10,.9)'; g.fillRect(0, 970, 1920, 4);
        // la sombra donde cae el texto, para que se lea: la pared se oscurece a la derecha
        gr = g.createLinearGradient(820, 0, 1180, 0); gr.addColorStop(0, 'rgba(8,5,9,0)'); gr.addColorStop(1, 'rgba(8,5,9,.62)'); g.fillStyle = gr; g.fillRect(820, 118, 1100, 854);
        gr = g.createRadialGradient(960, 560, 300, 960, 560, 1250); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        farola(g, 150, 214); farola(g, 1856, 214);
        // la sombra de la tabla en el suelo
        g.save(); g.translate(BX + BW / 2, 1036); g.scale(1, .1); const sg = g.createRadialGradient(0, 0, 10, 0, 0, BW / 2 + 60); sg.addColorStop(0, 'rgba(0,0,0,.65)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sg; circ(g, 0, 0, BW / 2 + 60); g.fill(); g.restore();
      }

      /* la tabla: marco de madera, chapa ondulada y los nombres pintados en las franjas */
      function prepara(bombo) {
        const n = bombo.length; st.items = bombo.slice(); st.n = n; st.V = Math.max(7, n);
        st.bandH = (PY1 - PY0) / st.V; st.rb = Math.max(3, Math.round(st.bandH / 10.5));
        st.band = bombo.map((_, j) => n >= st.V ? j : Math.floor((j + .5) * st.V / n));
        st.u = clamp(st.u, 0, st.V - 1);
        st.fm = bombo.map(nom => rotula(g, JO, String(nom).toUpperCase(), TXW, st.bandH * .8, 42, 11, true));
      }
      function pintaNombreBanda(g, j, relleno, sombra) {
        const f = st.fm[j]; if (!f) return; const cy = yDe(st.band[j]), lh = f.px * 1.06, y0 = cy - (f.lineas.length - 1) * lh / 2;
        g.font = JO(f.px); g.textAlign = 'center'; g.textBaseline = 'middle';
        f.lineas.forEach((ln, i) => { if (sombra) { g.fillStyle = sombra; textoCabe(g, ln, TXC + 1.4, y0 + i * lh + 2, TXW); } g.fillStyle = relleno; textoCabe(g, ln, TXC, y0 + i * lh + f.px * .03, TXW); });
      }
      function pintaTablero(g) {
        // sombra
        g.save(); g.shadowColor = 'rgba(0,0,0,.75)'; g.shadowBlur = 50; g.shadowOffsetX = 16; g.shadowOffsetY = 20; rr(g, BX, BY, BW, BH, 34); g.fillStyle = '#2a1708'; g.fill(); g.restore();
        // la chapa, entre los montantes
        g.save(); g.beginPath(); g.rect(PX0, 214, PX1 - PX0, 736); g.clip();
        g.fillStyle = '#6b685b'; g.fillRect(PX0, 214, PX1 - PX0, 736);
        const rb = st.rb, P = st.bandH / rb, nr = st.V * rb;
        const rg = g.createLinearGradient(0, 0, 0, P), mez = (a, b, t) => a.map((c, i) => Math.round(c + (b[i] - c) * t));
        for (let i = 0; i <= 10; i++) { const t = i / 10, l = .5 + .5 * Math.sin(6.283 * (t - .05)), c = mez([66, 64, 55], [238, 234, 218], Math.pow(l, 1.15)); rg.addColorStop(t, `rgb(${c[0]},${c[1]},${c[2]})`); }
        const sh = g.createLinearGradient(0, 0, 0, P); sh.addColorStop(0, 'rgba(255,255,255,.05)'); sh.addColorStop(.4, 'rgba(255,255,255,0)'); sh.addColorStop(.7, 'rgba(0,0,0,.10)'); sh.addColorStop(1, 'rgba(0,0,0,.22)');
        for (let i = 0; i < nr; i++) { g.save(); g.translate(0, PY0 + i * P); g.fillStyle = rg; g.fillRect(PX0, 0, PX1 - PX0, P + .6); g.restore(); }
        // el brillo de las farolas y el cinc desgastado
        let lg = g.createLinearGradient(PX0, 0, PX1, 0); lg.addColorStop(0, 'rgba(230,150,60,.22)'); lg.addColorStop(.5, 'rgba(230,150,60,.04)'); lg.addColorStop(1, 'rgba(230,150,60,.14)'); g.fillStyle = lg; g.fillRect(PX0, 214, PX1 - PX0, 736);
        const r = semilla(41); for (let i = 0; i < 260; i++) { g.fillStyle = r() < .5 ? 'rgba(60,40,20,.10)' : 'rgba(255,255,240,.10)'; g.fillRect(PX0 + r() * (PX1 - PX0), 214 + r() * 736, 1 + r() * 9, 1 + r() * 2); }
        // el carril del dedal, pulido por el uso
        lg = g.createLinearGradient(LX - 34, 0, LX + 34, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.5, 'rgba(255,250,235,.2)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = lg; g.fillRect(LX - 34, 214, 68, 736);
        // los nombres, pintados en crema
        for (let j = 0; j < st.n; j++) pintaNombreBanda(g, j, '#2A1709', 'rgba(255,252,236,.42)');
        g.fillStyle = 'rgba(42,23,9,.45)'; for (let b = 0; b < st.V; b++) { if (st.band.indexOf(b) >= 0) continue; const cy = yDe(b); g.beginPath(); g.moveTo(TXC, cy - 7); g.lineTo(TXC + 6, cy); g.lineTo(TXC, cy + 7); g.lineTo(TXC - 6, cy); g.closePath(); g.fill(); }
        // y las ondas, por encima, para que la pintura se vea sobre el metal ondulado
        for (let i = 0; i < nr; i++) { g.save(); g.translate(0, PY0 + i * P); g.fillStyle = sh; g.fillRect(PX0, 0, PX1 - PX0, P + .6); g.restore(); }
        // la chapa se hunde junto al marco
        let e = g.createLinearGradient(PX0, 0, PX0 + 18, 0); e.addColorStop(0, 'rgba(0,0,0,.5)'); e.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = e; g.fillRect(PX0, 214, 18, 736);
        e = g.createLinearGradient(PX1, 0, PX1 - 18, 0); e.addColorStop(0, 'rgba(0,0,0,.5)'); e.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = e; g.fillRect(PX1 - 18, 214, 18, 736);
        const e1 = g.createLinearGradient(0, 214, 0, 244); e1.addColorStop(0, 'rgba(0,0,0,.55)'); e1.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = e1; g.fillRect(PX0, 214, PX1 - PX0, 30);
        const e2 = g.createLinearGradient(0, 950, 0, 920); e2.addColorStop(0, 'rgba(0,0,0,.55)'); e2.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = e2; g.fillRect(PX0, 920, PX1 - PX0, 30);
        g.restore();
        // el marco: montantes, travesaño de abajo y la cabecera
        madera(g, BX, 205, 50, 760, true, 3); madera(g, BX + BW - 50, 205, 50, 760, true, 4);
        madera(g, BX - 6, 948, BW + 12, 82, false, 5);
        g.save(); rr(g, BX, BY, BW, 150, [42, 42, 6, 6]); g.clip(); madera(g, BX, BY, BW, 150, false, 6); g.restore();
        g.strokeStyle = 'rgba(20,10,2,.6)'; g.lineWidth = 3; rr(g, BX, BY, BW, 150, [42, 42, 6, 6]); g.stroke();
        // la cabecera: un asa, dos remates y el letrero pintado
        g.fillStyle = '#1a0e05'; g.beginPath(); g.ellipse(BX + BW / 2, BY + 36, 46, 15, 0, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(255,224,170,.25)'; g.lineWidth = 2; g.stroke();
        [BX + 34, BX + BW - 34].forEach(x => { const kg = g.createRadialGradient(x - 5, BY - 4, 2, x, BY + 2, 22); kg.addColorStop(0, '#a8773f'); kg.addColorStop(1, '#4a2c12'); g.fillStyle = kg; circ(g, x, BY + 4, 20); g.fill(); });
        g.save(); g.translate(BX + BW / 2, BY + 104); g.rotate(-.008); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 8; g.shadowOffsetY = 3; g.fillStyle = '#E9D9AE'; g.fillRect(-150, -34, 300, 68); g.shadowColor = 'transparent';
        g.strokeStyle = 'rgba(100,60,20,.55)'; g.lineWidth = 1.6; g.strokeRect(-143, -28, 286, 56); g.fillStyle = '#3b2210'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = CG(30, 600); g.fillText('LA LAVANDERA', 0, -6); g.font = `500 14px Jost,system-ui,sans-serif`; espaciado(g, 3); g.fillText('NUEVA ORLEANS · 1928', 0, 19); espaciado(g, 0); g.restore();
        [[BX + 25, 230], [BX + 25, 940], [BX + BW - 25, 230], [BX + BW - 25, 940], [BX + 30, 990], [BX + BW - 30, 990], [BX + 25, 586], [BX + BW - 25, 586]].forEach(([x, y]) => clavo(g, x, y));
      }
      function rehaz() { const k = L.k || 1; fijo = capaFija(k, pintaFijo); tablero = capaFija(k, pintaTablero, BX - 60, BY - 60, BW + 140, BH + 150); }
      function ajusta(s) { if (L.ajusta(s) || !fijo) rehaz(); }

      /* el dedal de metal, con sus hoyuelos */
      function dedal(x, y, v) {
        const hund = st.golpe * 5, a = clamp(v / 14, -1, 1) * .12;
        g.save(); g.translate(x, y + hund); g.rotate(a);
        g.fillStyle = 'rgba(0,0,0,.34)'; g.beginPath(); g.ellipse(9, 12, 31, 11, 0, 0, 6.283); g.fill();
        const gr = g.createLinearGradient(-32, 0, 32, 0); gr.addColorStop(0, '#454b52'); gr.addColorStop(.26, '#f1f4f6'); gr.addColorStop(.5, '#b3bbc2'); gr.addColorStop(.8, '#656c73'); gr.addColorStop(1, '#2d3237');
        g.fillStyle = gr; g.beginPath(); g.moveTo(-29, 6); g.bezierCurveTo(-32, -28, -17, -56, 0, -56); g.bezierCurveTo(17, -56, 32, -28, 29, 6); g.closePath(); g.fill();
        g.fillStyle = '#7f8890'; rr(g, -32, -3, 64, 14, 6); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-29, -2, 58, 2);
        g.fillStyle = 'rgba(30,34,40,.55)'; for (let fila = 0; fila < 4; fila++) { const yy = -14 - fila * 11, n = 5 - (fila > 2 ? 2 : fila > 0 ? 1 : 0), ex = 24 - fila * 5; for (let i = 0; i < n; i++) { const xx = -ex + (n === 1 ? ex : i * 2 * ex / (n - 1)); g.beginPath(); g.ellipse(xx * .86, yy, 2.4, 2, 0, 0, 6.283); g.fill(); } }
        g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(-13, -34, 4, 14, .3, 0, 6.283); g.fill();
        g.restore();
      }
      function nota(g, x, y, s, rot, col) {
        g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.strokeStyle = col; g.lineWidth = 3.2 * s;
        g.beginPath(); g.ellipse(0, 0, 10 * s, 7.4 * s, -.4, 0, 6.283); g.fill();
        g.beginPath(); g.moveTo(8.4 * s, -2 * s); g.lineTo(8.4 * s, -34 * s); g.quadraticCurveTo(10 * s, -22 * s, 22 * s, -20 * s); g.stroke(); g.restore();
      }

      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt; st.golpe = Math.max(0, st.golpe - dt * 5);
        L.borra();
        if (fijo) {
          ponCapa(g, fijo);
          // el brillo de las farolas de gas, que parpadea
          g.save(); g.globalCompositeOperation = 'lighter';
          [[150, 296], [1856, 296]].forEach(([x, y], i) => { const f = .85 + .15 * Math.sin(st.t * (5.3 + i * 1.7) + i * 2) * mov + .06 * Math.sin(st.t * 23 + i) * mov;
            const gr = g.createRadialGradient(x, y, 8, x, y, 560); gr.addColorStop(0, `rgba(255,190,100,${.40 * f})`); gr.addColorStop(.25, `rgba(255,150,60,${.16 * f})`); gr.addColorStop(1, 'rgba(255,140,50,0)'); g.fillStyle = gr; g.fillRect(x - 560, y - 560, 1120, 1120);
            const gp = g.createRadialGradient(x, 1024, 4, x, 1024, 300); gp.addColorStop(0, `rgba(255,190,100,${.28 * f})`); gp.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = gp; g.fillRect(x - 300, 960, 600, 120); });
          g.restore();
        }
        if (tablero) {
          ponCapa(g, tablero);
          const y = yDe(st.u), v = Math.abs(st.vel);
          // la luz que corre sobre las ondas con el dedal, y la franja del elegido, encendida
          g.save(); g.beginPath(); g.rect(PX0, 214, PX1 - PX0, 736); g.clip(); g.globalCompositeOperation = 'lighter';
          const a = .08 + .20 * Math.min(1, v / 10); let gr = g.createLinearGradient(0, y - 60, 0, y + 60); gr.addColorStop(0, 'rgba(255,214,150,0)'); gr.addColorStop(.5, `rgba(255,214,150,${a})`); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.fillRect(PX0, y - 60, PX1 - PX0, 120);
          if (st.sel >= 0 && st.luz > 0) {
            const b = st.band[st.sel], y0 = PY0 + b * st.bandH, pulso = .75 + .25 * Math.sin(st.t * 5) * mov;
            gr = g.createLinearGradient(PX0, 0, PX1, 0); gr.addColorStop(0, 'rgba(255,196,96,0)'); gr.addColorStop(.18, `rgba(255,196,96,${.5 * st.luz * pulso})`); gr.addColorStop(.82, `rgba(255,196,96,${.5 * st.luz * pulso})`); gr.addColorStop(1, 'rgba(255,196,96,0)');
            g.fillStyle = gr; g.fillRect(PX0, y0, PX1 - PX0, st.bandH);
          }
          g.restore();
          if (st.sel >= 0 && st.luz > 0) { g.save(); g.globalAlpha = st.luz; pintaNombreBanda(g, st.sel, '#3A1204', null); g.restore(); }
          dedal(LX, y, st.vel);
        }
        // las notas que saltan de la tabla
        if (st.notas.length) { g.save(); g.globalCompositeOperation = 'lighter';
          st.notas = st.notas.filter(n => { n.v -= dt; if (n.v <= 0) return false; n.vy += 520 * dt; n.x += n.vx * dt; n.y += n.vy * dt; n.rot += n.w * dt;
            nota(g, n.x, n.y, n.s, n.rot, `rgba(255,${190 + Math.round(40 * Math.sin(n.rot))},100,${clamp(n.v / 1.1, 0, 1) * .9})`); return true; });
          g.restore(); }
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.tabla.fuentes, () => { if (!vivo) return; if (st.n) prepara(st.items); rehaz(); });

      /* los sonidos: la raspa (abajo y arriba) y el golpe de la tabla, si el portal los da; el raspar ola a ola, sintético */
      const son = { raspa: [] }, S = o.sonidos || {};
      const listo = Promise.all([...(S.raspa || []).map(u => A.carga(u)), A.carga(S.golpe)]).then(bs => { const nr = (S.raspa || []).length; son.raspa = bs.slice(0, nr).filter(Boolean); son.golpe = bs[nr]; });
      let tR = 0;
      function ola(v) { const ac = A.ac; if (!ac) return; const t = ac.currentTime; if (t - tR < .024) return; tR = t; A.clic({ f: 3200 + Math.random() * 2600, q: 5, gan: clamp(.06 + v * .006, .06, .24), dur: .014, wet: .1, pan: .25 }); }
      function raspa(dir, v) { const b = son.raspa.length ? son.raspa[(dir > 0 ? 0 : 1) % son.raspa.length] : null; if (b) A.muestra(b, { gan: clamp(.5 + v * .05, .5, 1), vel: clamp(.75 + v * .035, .75, 1.5), wet: .15 }); else A.clic({ f: 2400, q: 1, gan: .35, dur: .22, wet: .15 }); }
      function golpe(gan) { if (son.golpe) A.muestra(son.golpe, { gan, wet: .25 }); else { A.clic({ f: 650, q: 1.2, gan: gan * .8, dur: .1, wet: .25 }); A.nota(240, { tipo: 'sine', dur: .2, gan: gan * .5, desliza: 140 }); } }

      return {
        ajusta,
        espera() { if (!st.n) { prepara(['· · ·']); rehaz(); } },
        async gira(bombo, k) {
          prepara(bombo); rehaz(); const n = bombo.length; await esperaMuestras(listo);
          st.luz = 0; st.sel = -1; st.notas = [];
          const ac = A.crea(), T = RM ? 1.7 : T_GIRO, m = st.V - 1, p0 = clamp(st.u, 0, m);
          const p1 = destinoVaiven(p0, m, st.band[k], (RM ? 1.2 : 3.1) * m + 1), f = recorrido(p0, p1, { T, p: 2.45 });
          let ras = null;
          if (ac) { golpe(.8); if (!RM) A.nota(110, { tipo: 'sawtooth', t: .1, dur: 4.4, gan: .025, ataque: 1.5, filtro: { f: 360 }, wet: .3 }); ras = A.continuo({ tipo: 'bandpass', f: 2800, q: 1.1, wet: .1 }); }
          await new Promise(ok => {
            const t0 = performance.now(); let antes = p0, uAnt = st.u, dirAnt = 0, ridAnt = Math.floor((yDe(st.u) - PY0) / (st.bandH / st.rb)), tPrev = t0;
            (function paso() {
              const now = performance.now(), t = (now - t0) / 1000, p = f(Math.min(t, f.T)), dtp = Math.max(.001, (now - tPrev) / 1000); tPrev = now;
              const u = vaiven(p, m); st.u = u; st.vel = (p - antes) * 60; antes = p;
              const du = u - uAnt; uAnt = u; const d = Math.abs(du) > 1e-5 ? Math.sign(du) : 0, v = Math.abs(du) / dtp;
              if (d && d !== dirAnt) { if (dirAnt) raspa(d, v); dirAnt = d; }
              const rid = Math.floor((yDe(u) - PY0) / (st.bandH / st.rb)); if (rid !== ridAnt) { ridAnt = rid; ola(v); }
              if (ras) { A.pon(ras.g.gain, clamp(v / 24, 0, 1) * .11, .04); A.pon(ras.f.frequency, 1800 + 160 * v, .04); }
              if (t < f.T) requestAnimationFrame(paso); else { st.u = vaiven(p1, m); st.vel = 0; if (ras) ras.para(.2); ok(); }
            })();
          });
          // se queda en la onda del elegido: el golpe del dedal, el tintineo y la franja que brilla
          st.sel = k; st.golpe = 1; golpe(1);
          if (ac) { A.nota(1318.5, { tipo: 'triangle', dur: .9, gan: .09, wet: .5 }); [196, 246.94, 293.66, 392, 493.88].forEach((fq, i) => A.nota(fq, { tipo: 'triangle', t: .06 + i * .055, dur: .9, gan: .07, filtro: { f: 1800 }, wet: .35 })); if (!RM) A.clic({ f: 6200, q: .5, gan: .35, dur: .35, wet: .3, t: .05 }); }
          if (!RM) { const y = yDe(st.band[k]); for (let i = 0; i < 12; i++) st.notas.push({ x: 560 + Math.random() * 120, y: y + (Math.random() - .5) * 18, vx: 210 + Math.random() * 360, vy: -520 - Math.random() * 360, rot: Math.random() * 6, w: (Math.random() - .5) * 6, s: .8 + Math.random() * .7, v: 1.2 + Math.random() * .9 }); }
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 480; (function p_() { const u = (performance.now() - t0) / d; st.luz = eo(u, 2); if (u < 1) requestAnimationFrame(p_); else { st.luz = 1; ok(); } })(); });
          await new Promise(ok => setTimeout(ok, RM ? 150 : 260));
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «marquesina» · Blues, acto 3 «Glamour y decepción» (Harlem, el club de jazz): la marquesina del teatro art déco ──
     Rojo y oro, con el borde de bombillas que corren. En el cartel, las letras se dan la vuelta (como un panel de tablillas, con su
     «tecla» al cambiar): los nombres pasan rápido, van frenando y queda uno, con todas las bombillas parpadeando, un foco que lo
     busca, los metales y el aplauso. Con pocos nombres, entre ellos pasan también carteles de la casa (LA GRAN NOCHE…). */
  TEMAS.marquesina = {
    fuentes: ['400 80px Limelight', '500 24px Jost', '400 40px "Poiret One"'],
    nombreFit: { min: 40 },
    css: `
.lmv-t-marquesina .lmv-velo{background:radial-gradient(ellipse at 50% 42%,rgba(48,14,22,.97) 0%,rgba(24,7,12,.985) 58%,rgba(8,3,5,.995) 100%)}
.lmv-t-marquesina .lmv-cab{top:34px}
.lmv-t-marquesina .lmv-ceja{font:400 66px/1 Limelight,"Poiret One",Georgia,serif;letter-spacing:.16em;text-transform:uppercase;color:#F6DA86;text-shadow:0 0 26px rgba(246,200,90,.55),0 0 60px rgba(230,60,60,.3),0 3px 10px rgba(0,0,0,.85)}
.lmv-t-marquesina .lmv-grupo{margin-top:12px;font:500 24px/1 Jost,"Avenir Next",system-ui,sans-serif;letter-spacing:.12em;white-space:nowrap;color:rgba(248,228,170,.82)}
.lmv-t-marquesina .lmv-nombre{opacity:0!important;animation:none!important;pointer-events:none}
.lmv-t-marquesina .lmv-nota{top:112px;font:italic 400 26px/1.3 "Cormorant Garamond",Georgia,serif;color:#F0DAA2}
.lmv-t-marquesina .lmv-pie{bottom:34px;gap:26px}
.lmv-t-marquesina .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:15px 36px;border-radius:5px;border:3px solid #E6C25A;background:rgba(40,8,14,.9);color:#F7E3A0;font:400 25px/1 Limelight,"Poiret One",Georgia,serif;letter-spacing:.06em;transition:background .2s,transform .15s}
.lmv-t-marquesina .lmv-b:hover{background:rgba(140,30,38,.95);transform:translateY(-2px)}
.lmv-t-marquesina .lmv-b.lmv-otra{background:linear-gradient(#B02A34,#8C1E26 60%,#5E1219);color:#FFF0BE}
.lmv-t-marquesina .lmv-b.lmv-otra:hover{background:linear-gradient(#C23540,#9C2630 60%,#6A161E)}
.lmv-t-marquesina .lmv-cargando{color:#F6DA86}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const LI = px => `400 ${px}px Limelight,"Poiret One",Georgia,serif`;
      const FX = 190, FY = 170, FW = 1540, FH = 620;                 // el marco de la marquesina
      const BX0 = 266, BY0 = 296, BW = 1388, BH = 382;               // el cartel
      const C = 20, R = 3, CW = 64, CH = 112, GX = 3, GY = 8, GX0 = 960 - (C * CW + (C - 1) * GX) / 2, GY0 = BY0 + (BH - (R * CH + (R - 1) * GY)) / 2;
      const DEC = ['LA GRAN NOCHE', 'JAZZ EN VIVO', 'ENTRADA LIBRE', 'HOY SIN FALTA', 'GRAN ESTRENO', 'LLENO TOTAL'];
      const st = { sec: [], m: 0, p: 0, t: 0, luz: 0, flash: 0, fin: 0, vel: 0, chasq: 4, bombas: [], conf: [], haz: 0 };
      const celdas = []; for (let i = 0; i < C * R; i++) celdas.push({ de: ' ', a: ' ', ph: 0, flip: false, quiere: ' ', delay: 0 });
      let fijo = null, raf = 0, vivo = true, sprite = null;
      const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.283); };
      const oro = (g, x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, '#FBE9A6'); gr.addColorStop(.3, '#E6C25A'); gr.addColorStop(.55, '#F4D67C'); gr.addColorStop(.8, '#B98A28'); gr.addColorStop(1, '#7A5A14'); return gr; };

      // las bombillas: el borde de la marquesina, el marco del cartel y la cenefa de abajo
      function anilloB(x0, y0, x1, y1, paso) {
        const out = [], nx = Math.round((x1 - x0) / paso), ny = Math.round((y1 - y0) / paso);
        for (let i = 0; i < nx; i++) out.push({ x: x0 + (x1 - x0) * i / nx, y: y0 }); for (let i = 0; i < ny; i++) out.push({ x: x1, y: y0 + (y1 - y0) * i / ny });
        for (let i = 0; i < nx; i++) out.push({ x: x1 - (x1 - x0) * i / nx, y: y1 }); for (let i = 0; i < ny; i++) out.push({ x: x0, y: y1 - (y1 - y0) * i / ny });
        return out;
      }
      const B1 = anilloB(FX + 12, FY + 12, FX + FW - 12, FY + FH - 12, 49.5), B2 = anilloB(BX0 - 17, BY0 - 17, BX0 + BW + 17, BY0 + BH + 17, 32);
      const B3 = []; for (let i = 0; i < 31; i++) B3.push({ x: FX + 30 + i * (FW - 60) / 30, y: FY + FH + 52 + (i % 2 ? 0 : -12) });

      function pintaFijo(g) {
        const r = semilla(17);
        // la pared del teatro: piedra oscura con acanalados y la corona escalonada
        let gr = g.createLinearGradient(0, 0, 0, 1080); gr.addColorStop(0, '#1b0a10'); gr.addColorStop(1, '#0f0509'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        g.strokeStyle = 'rgba(230,194,90,.07)'; g.lineWidth = 2; for (let x = 0; x < 1920; x += 38) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1080); g.stroke(); }
        // el abanico art déco sobre la marquesina
        g.save(); g.translate(960, FY + 4);
        for (let i = 0; i < 26; i++) { const a0 = Math.PI + i * Math.PI / 26, a1 = a0 + Math.PI / 26; g.fillStyle = i % 2 ? 'rgba(230,194,90,.13)' : 'rgba(160,30,40,.16)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 160, a0, a1); g.closePath(); g.fill(); }
        g.strokeStyle = 'rgba(230,194,90,.45)'; g.lineWidth = 2.4; [60, 110, 160].forEach(rr_ => { g.beginPath(); g.arc(0, 0, rr_, Math.PI, 0); g.stroke(); });
        g.restore();
        // las pilastras de los lados, con sus apliques
        [[24, 150], [1746, 150]].forEach(([x, w]) => { const pg = g.createLinearGradient(x, 0, x + w, 0); pg.addColorStop(0, '#2a0f16'); pg.addColorStop(.5, '#3c1620'); pg.addColorStop(1, '#1c0910'); g.fillStyle = pg; g.fillRect(x, 0, w, 1080);
          g.strokeStyle = 'rgba(230,194,90,.5)'; g.lineWidth = 3; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(x + 14 + i * 30, 0); g.lineTo(x + 14 + i * 30, 1080); g.stroke(); }
          g.fillStyle = oro(g, x, 0, x + w, 0); g.fillRect(x - 6, 0, w + 12, 22); g.fillRect(x - 6, 1040, w + 12, 40); });
        // la sombra de la marquesina sobre la pared
        g.save(); g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 60; g.shadowOffsetY = 30; rr(g, FX, FY, FW, FH, 16); g.fillStyle = '#2a0a10'; g.fill(); g.restore();
        // el marco dorado
        rr(g, FX, FY, FW, FH, 16); g.fillStyle = oro(g, FX, FY, FX + FW, FY + FH); g.fill();
        g.strokeStyle = 'rgba(70,40,5,.7)'; g.lineWidth = 3; rr(g, FX + 3, FY + 3, FW - 6, FH - 6, 14); g.stroke(); g.strokeStyle = 'rgba(255,246,200,.6)'; g.lineWidth = 2; rr(g, FX + 1, FY + 1, FW - 2, FH - 2, 15); g.stroke();
        // el panel rojo
        const PX = FX + 24, PY = FY + 24, PW = FW - 48, PH = FH - 48;
        gr = g.createLinearGradient(0, PY, 0, PY + PH); gr.addColorStop(0, '#A5252E'); gr.addColorStop(.5, '#8C1E26'); gr.addColorStop(1, '#6A141B'); rr(g, PX, PY, PW, PH, 8); g.fillStyle = gr; g.fill();
        g.save(); rr(g, PX, PY, PW, PH, 8); g.clip(); g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 3; for (let x = PX; x < PX + PW; x += 24) { g.beginPath(); g.moveTo(x, PY); g.lineTo(x, PY + PH); g.stroke(); }
        // abanicos en las esquinas
        [[PX, PY, 0], [PX + PW, PY, Math.PI / 2], [PX + PW, PY + PH, Math.PI], [PX, PY + PH, -Math.PI / 2]].forEach(([x, y, a]) => { g.save(); g.translate(x, y); g.rotate(a); g.strokeStyle = 'rgba(244,214,124,.55)'; g.lineWidth = 2; for (let rr_ = 30; rr_ <= 90; rr_ += 20) { g.beginPath(); g.arc(0, 0, rr_, 0, Math.PI / 2); g.stroke(); } for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(i * Math.PI / 12) * 90, Math.sin(i * Math.PI / 12) * 90); g.stroke(); } g.restore(); });
        g.restore();
        g.strokeStyle = 'rgba(244,214,124,.85)'; g.lineWidth = 3; rr(g, PX + 12, PY + 12, PW - 24, PH - 24, 5); g.stroke(); g.lineWidth = 1.4; rr(g, PX + 19, PY + 19, PW - 38, PH - 38, 3); g.stroke();
        // el rótulo de arriba
        g.fillStyle = '#F6DA86'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = LI(40); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 6; g.shadowOffsetY = 2; espaciado(g, 8); g.fillText('ESTA NOCHE', 960, 252); espaciado(g, 0); g.shadowColor = 'transparent';
        [[-1], [1]].forEach(([sg]) => { const x0 = 960 + sg * 250; g.strokeStyle = 'rgba(244,214,124,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, 252); g.lineTo(x0 + sg * 360, 252); g.stroke();
          g.fillStyle = '#F6DA86'; g.beginPath(); g.moveTo(x0 + sg * 372, 252 - 9); g.lineTo(x0 + sg * 381, 252); g.lineTo(x0 + sg * 372, 252 + 9); g.lineTo(x0 + sg * 363, 252); g.closePath(); g.fill(); });
        // el cartel: un hueco oscuro con su marco dorado
        rr(g, BX0 - 6, BY0 - 6, BW + 12, BH + 12, 10); g.fillStyle = oro(g, BX0, BY0, BX0 + BW, BY0 + BH); g.fill();
        rr(g, BX0, BY0, BW, BH, 6); g.fillStyle = '#12060a'; g.fill();
        // el pie del panel
        g.fillStyle = '#F6DA86'; g.font = LI(30); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 5; espaciado(g, 6); g.fillText('HARLEM · 1928', 960, 716); espaciado(g, 0); g.shadowColor = 'transparent';
        [[-1], [1]].forEach(([sg]) => { for (let i = 0; i < 3; i++) { const x = 960 + sg * (230 + i * 40); g.beginPath(); g.moveTo(x, 716 - 9); g.lineTo(x + sg * 14, 716); g.lineTo(x, 716 + 9); g.closePath(); g.fillStyle = `rgba(244,214,124,${.9 - i * .25})`; g.fill(); } });
        // la cenefa de abajo y la entrada
        g.fillStyle = '#6A141B'; g.beginPath(); g.moveTo(FX + 10, FY + FH); for (let i = 0; i <= 30; i++) { const x = FX + 30 + i * (FW - 60) / 30; g.lineTo(x, FY + FH + 52 + (i % 2 ? 0 : -12)); } g.lineTo(FX + FW - 10, FY + FH); g.closePath(); g.fill();
        g.strokeStyle = oro(g, FX, 0, FX + FW, 0); g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 30; i++) { const x = FX + 30 + i * (FW - 60) / 30, y = FY + FH + 52 + (i % 2 ? 0 : -12) + (i % 2 ? 0 : 0); if (!i) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke();
        // la puerta: dos hojas con cristal de luz cálida, marco dorado, barras de latón y alfombra roja
        const dX = 740, dY = 874, dW = 440, dH = 206;
        g.fillStyle = oro(g, dX - 18, dY - 18, dX + dW + 18, dY); rr(g, dX - 18, dY - 18, dW + 36, dH + 18, [22, 22, 0, 0]); g.fill();
        g.fillStyle = '#1c0709'; rr(g, dX - 6, dY - 6, dW + 12, dH + 6, [14, 14, 0, 0]); g.fill();
        [dX, dX + dW / 2 + 3].forEach(x => { const w = dW / 2 - 3;
          g.fillStyle = '#3b0d13'; g.fillRect(x, dY, w, dH);
          const cg = g.createLinearGradient(0, dY + 12, 0, dY + dH); cg.addColorStop(0, '#e9a64e'); cg.addColorStop(.6, '#9a5522'); cg.addColorStop(1, '#4b200c'); g.fillStyle = cg; g.fillRect(x + 12, dY + 12, w - 24, dH - 12);
          const hg = g.createLinearGradient(x + 12, 0, x + w - 12, 0); hg.addColorStop(0, 'rgba(255,240,200,.28)'); hg.addColorStop(.35, 'rgba(255,240,200,0)'); g.fillStyle = hg; g.fillRect(x + 12, dY + 12, w - 24, dH - 12);
          g.strokeStyle = 'rgba(60,18,8,.8)'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + w / 2, dY + 12); g.lineTo(x + w / 2, dY + dH); g.stroke();
          g.fillStyle = oro(g, x, dY + 120, x + w, dY + 134); rr(g, x + 20, dY + 112, w - 40, 12, 6); g.fill(); });
        const el = g.createRadialGradient(960, 1040, 10, 960, 1040, 520); el.addColorStop(0, 'rgba(255,190,100,.22)'); el.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = el; g.fillRect(400, 800, 1120, 280);
        gr = g.createLinearGradient(dX, 0, dX + dW, 0); gr.addColorStop(0, '#5E1219'); gr.addColorStop(.5, '#A5252E'); gr.addColorStop(1, '#5E1219'); g.fillStyle = gr; g.beginPath(); g.moveTo(dX + 90, dY + dH); g.lineTo(dX + dW - 90, dY + dH); g.lineTo(dX + dW + 150, 1080); g.lineTo(dX - 150, 1080); g.closePath(); g.fill();
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 1056, 1920, 24);
        // los marcos de las bombillas: casquillos apagados
        B1.concat(B2, B3).forEach((b, i) => { const rad = i < B1.length ? 8.5 : i < B1.length + B2.length ? 5.6 : 6.4; g.fillStyle = '#4b3510'; circ(g, b.x, b.y, rad + 2.4); g.fill(); g.fillStyle = 'rgba(255,214,140,.28)'; circ(g, b.x, b.y, rad); g.fill(); });
      }
      function rehaz() { fijo = capaFija(L.k || 1, pintaFijo); }
      function ajusta(s) { if (L.ajusta(s) || !fijo) rehaz(); }
      // el brillo de una bombilla, pintado una vez
      (function () { const c = document.createElement('canvas'); c.width = c.height = 96; const x = c.getContext('2d'), gr = x.createRadialGradient(48, 48, 2, 48, 48, 48); gr.addColorStop(0, 'rgba(255,252,220,1)'); gr.addColorStop(.2, 'rgba(255,226,140,.85)'); gr.addColorStop(.5, 'rgba(255,170,60,.28)'); gr.addColorStop(1, 'rgba(255,150,40,0)'); x.fillStyle = gr; x.fillRect(0, 0, 96, 96); sprite = c; })();

      /* el cartel de tablillas */
      function rejilla(txt) {
        const out = new Array(R * C).fill(' '), ls = lineas(String(txt).toUpperCase(), C, R), filas = ls.length === 1 ? [1] : ls.length === 2 ? [0, 1] : [0, 1, 2];
        ls.forEach((l, i) => { l = l.slice(0, C); const ini = Math.floor((C - l.length) / 2); for (let c = 0; c < l.length; c++) out[filas[i] * C + ini + c] = l[c]; });
        return out;
      }
      function ponTexto(txt, inmediato) {
        const rj = rejilla(txt);
        celdas.forEach((c, i) => {
          c.quiere = rj[i];
          if (inmediato || RM) { c.de = c.a = c.quiere; c.flip = false; c.ph = 0; return; }
          if (!c.flip && c.quiere !== c.de) { c.flip = true; c.a = c.quiere; c.ph = 0; c.delay = Math.random() * .07 + (i % C) * .0025; }
        });
      }
      function mueve(dt) {
        celdas.forEach(c => {
          if (!c.flip) return; if (c.delay > 0) { c.delay -= dt; return; }
          c.ph += dt / .13; if (c.ph >= 1) { c.de = c.a; c.flip = false; c.ph = 0; if (c.quiere !== c.de) { c.flip = true; c.a = c.quiere; c.delay = 0; } }
        });
      }
      function media(x, y, w, h, ch, arriba, sy, lit) {
        const hy = y + h / 2;
        g.save(); g.translate(0, hy); g.scale(1, Math.max(.001, sy)); g.translate(0, -hy);
        g.beginPath(); g.rect(x - 1, arriba ? y - 1 : hy - .5, w + 2, h / 2 + 1.5); g.clip();
        const gr = g.createLinearGradient(0, arriba ? y : hy, 0, arriba ? hy : y + h);
        if (arriba) { gr.addColorStop(0, lit ? '#9C2A34' : '#7C1D26'); gr.addColorStop(1, lit ? '#80202A' : '#5E1620'); } else { gr.addColorStop(0, lit ? '#6A1820' : '#4F1119'); gr.addColorStop(1, lit ? '#4A1016' : '#38090F'); }
        rr(g, x, y, w, h, 7); g.fillStyle = gr; g.fill();
        if (ch !== ' ') {
          g.font = LI(96); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = lit ? '#FFF3B8' : '#F2CF6E';
          if (lit) { g.shadowColor = 'rgba(255,214,110,.9)'; g.shadowBlur = 22; }
          textoCabe(g, ch, x + w / 2, y + h / 2 + 5, w - 14);
        }
        g.restore();
      }
      function pintaCartel() {
        for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
          const cel = celdas[r * C + c], x = GX0 + c * (CW + GX), y = GY0 + r * (CH + GY), lit = st.luz > 0 && cel.de !== ' ' && !cel.flip;
          if (!cel.flip || cel.delay > 0) { media(x, y, CW, CH, cel.de, true, 1, lit); media(x, y, CW, CH, cel.de, false, 1, lit); }
          else {
            const ph = cel.ph;
            media(x, y, CW, CH, cel.a, true, 1, false);            // arriba: ya la nueva
            media(x, y, CW, CH, cel.de, false, 1, false);          // abajo: aún la vieja
            if (ph < .5) media(x, y, CW, CH, cel.de, true, Math.cos(ph * Math.PI), false);
            else media(x, y, CW, CH, cel.a, false, -Math.cos(ph * Math.PI), false);
          }
          // la bisagra
          g.fillStyle = 'rgba(0,0,0,.65)'; g.fillRect(x, y + CH / 2 - 1.5, CW, 3); g.fillStyle = 'rgba(255,230,170,.10)'; g.fillRect(x, y + CH / 2 + 1.5, CW, 1);
        }
      }

      let tAnt = performance.now(), acB = 0;
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt; acB += dt * st.chasq * mov;
        mueve(dt); if (st.flash > 0) st.flash = Math.max(0, st.flash - dt * 1.6);
        L.borra();
        if (fijo) {
          ponCapa(g, fijo);
          // los focos que buscan en el cielo
          g.save(); g.globalCompositeOperation = 'lighter';
          [[110, 1080, -1], [1810, 1080, 1]].forEach(([x, y, s], i) => {
            const ang = st.fin ? (s * (.5 - .5 * Math.abs(Math.sin(st.t * 1.3))) * .5) : s * (.35 + .22 * Math.sin(st.t * .6 * mov + i * 2)) ;
            g.save(); g.translate(x, y); g.rotate(ang); const gr = g.createLinearGradient(0, 0, 0, -1300); gr.addColorStop(0, 'rgba(255,240,200,.22)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
            g.fillStyle = gr; g.beginPath(); g.moveTo(-14, 0); g.lineTo(14, 0); g.lineTo(150, -1300); g.lineTo(-150, -1300); g.closePath(); g.fill(); g.restore(); });
          g.restore();
          pintaCartel();
          // las bombillas
          g.save(); g.globalCompositeOperation = 'lighter';
          const blink = st.fin ? (Math.floor(st.t * 3.4) % 2) : -1, base = RM ? .55 : 0;
          const luzB = (i, dir, ring) => {
            if (st.fin) { const on = ((i + (ring ? 1 : 0)) % 2) === blink; return RM ? 1 : (on ? 1 : .18); }
            if (RM) return base; const ph = ((i - dir * Math.floor(acB)) % 3 + 3) % 3; return ph === 0 ? 1 : .1;
          };
          const dib = (b, v, s) => { if (v < .15) return; g.globalAlpha = Math.min(1, v); g.drawImage(sprite, b.x - s, b.y - s, 2 * s, 2 * s); };
          B1.forEach((b, i) => dib(b, luzB(i, 1, 0), 40)); B2.forEach((b, i) => dib(b, luzB(i, -1, 1), 24)); B3.forEach((b, i) => dib(b, luzB(i, 1, i % 2), 28));
          g.globalAlpha = 1;
          // el brillo del cartel al acabar
          if (st.luz > 0) { const a = st.luz * (.16 + (RM ? 0 : .08 * Math.sin(st.t * 10))); const gr = g.createRadialGradient(960, 487, 40, 960, 487, 760); gr.addColorStop(0, `rgba(255,214,120,${a})`); gr.addColorStop(1, 'rgba(255,214,120,0)'); g.fillStyle = gr; g.fillRect(BX0 - 100, BY0 - 100, BW + 200, BH + 200); }
          if (st.flash > 0) { g.fillStyle = `rgba(255,244,210,${.55 * st.flash})`; g.fillRect(BX0, BY0, BW, BH); }
          g.restore();
          // las luces de los apliques de las pilastras
          g.save(); g.globalCompositeOperation = 'lighter';
          [[99, 330], [99, 700], [1821, 330], [1821, 700]].forEach(([x, y], i) => { const f = .8 + .2 * Math.sin(st.t * (3 + i) + i) * mov; const gr = g.createRadialGradient(x, y, 4, x, y, 150); gr.addColorStop(0, `rgba(255,200,110,${.32 * f})`); gr.addColorStop(1, 'rgba(255,200,110,0)'); g.fillStyle = gr; g.fillRect(x - 150, y - 150, 300, 300); });
          g.restore();
          [[99, 330], [99, 700], [1821, 330], [1821, 700]].forEach(([x, y]) => { g.fillStyle = '#4b3510'; circ(g, x, y, 15); g.fill(); g.fillStyle = '#FFE9A8'; circ(g, x, y, 9); g.fill(); });
          // confeti
          if (st.conf.length) { st.conf = st.conf.filter(c => { c.y += c.vy * dt; c.x += Math.sin(st.t * 2 + c.f) * 40 * dt + c.vx * dt; c.rot += c.w * dt; if (c.y > 1100) return false;
            g.save(); g.translate(c.x, c.y); g.rotate(c.rot); g.scale(1, Math.abs(Math.sin(st.t * 4 + c.f))); g.fillStyle = c.col; g.fillRect(-c.s, -c.s * .5, c.s * 2, c.s); g.restore(); return true; }); }
        }
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.marquesina.fuentes, () => { if (!vivo) return; rehaz(); });
      ponTexto('TELÓN ARRIBA', true);

      /* los sonidos: la tecla de cada cambio, el aplauso (si el portal los da) y unos metales sintéticos */
      const son = {}, S = o.sonidos || {};
      const listo = Promise.all([A.carga(S.tecla), A.carga(S.aplauso)]).then(([t, a]) => { son.tecla = t; son.aplauso = a; });
      let tTec = 0;
      function tecla(v) {
        const ac = A.ac; if (!ac) return; const t = ac.currentTime; if (t - tTec < .045) return; tTec = t;
        const gan = clamp(.35 + v * .03, .35, .8);
        if (son.tecla) A.muestra(son.tecla, { gan, vel: .9 + Math.random() * .3, wet: .15, pan: (Math.random() - .5) * .4 }); else A.clic({ f: 1500, q: 1.4, gan: .5, dur: .05, wet: .1 });
        for (let i = 0; i < 4; i++) A.clic({ f: 1800 + Math.random() * 2600, q: 3, gan: gan * .35, dur: .014, t: .01 + Math.random() * .1, wet: .1, pan: (Math.random() - .5) * .8 });
      }
      function metales() {
        if (!A.ac) return;
        const lp = A.ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.connect(A.via(1, .35));
        const acorde = (t, notas, dur, gan) => notas.forEach(fq => { A.nota(fq, { tipo: 'sawtooth', t, dur, gan, ataque: .02, destino: lp }); A.nota(fq * 2.005, { tipo: 'sawtooth', t, dur: dur * .8, gan: gan * .4, ataque: .02, destino: lp }); });
        acorde(0, [233.08, 293.66, 349.23, 466.16], .55, .05); acorde(.3, [261.63, 329.63, 392, 523.25], 1.6, .06);
        A.nota(116.5, { tipo: 'triangle', dur: 1.8, gan: .3, wet: .2 }); A.clic({ f: 5800, q: .5, gan: .4, dur: .5, wet: .3, t: .3 });
      }

      return {
        ajusta,
        espera() { st.chasq = 4; st.fin = 0; st.luz = 0; },
        async gira(bombo, k) {
          const n = bombo.length; st.fin = 0; st.luz = 0; st.flash = 0; st.conf = []; await esperaMuestras(listo);
          // el carrusel de carteles: los nombres y, si son pocos, carteles de la casa entre ellos
          const sec = bombo.slice(); for (let i = 0; sec.length < 7; i++) sec.push(DEC[i % DEC.length]); st.sec = sec; const m = sec.length, ac = A.crea(), T = RM ? 1.7 : T_GIRO;
          const p0 = Math.round(st.p);
          const dest = (() => { let q = p0 + m * Math.ceil((RM ? 7 : 27) / m); q += ((k - q) % m + m) % m; return q; })(), f = recorrido(p0, dest, { T, p: 2.35, amago: .2, rebote: .12, retro: 0, sobra: 0 });
          st.chasq = RM ? 0 : 14;
          if (ac && !RM) { A.nota(98, { tipo: 'triangle', dur: 4.8, gan: .05, ataque: 1.5, filtro: { f: 500 }, wet: .3 }); }
          await new Promise(ok => {
            const t0 = performance.now(); let ult = null, antes = p0;
            (function paso() {
              const t = (performance.now() - t0) / 1000, p = f(Math.min(t, f.T)); st.vel = (p - antes) * 60; antes = p; st.p = p;
              const idx = ((Math.round(p) % m) + m) % m;
              if (idx !== ult) { ult = idx; ponTexto(sec[idx]); tecla(Math.abs(st.vel)); }
              st.chasq = RM ? 0 : clamp(3 + Math.abs(st.vel) * 1.4, 3, 16);
              if (t < f.T) requestAnimationFrame(paso); else { st.p = dest; ok(); }
            })();
          });
          ponTexto(sec[((dest % m) + m) % m]);
          // el remate: todas las bombillas, el destello, los metales y el aplauso
          await new Promise(ok => setTimeout(ok, RM ? 60 : 380));
          st.fin = 1; st.flash = RM ? 0 : 1; st.chasq = 0; tecla(8);
          if (ac) { metales(); if (son.aplauso) A.muestra(son.aplauso, { gan: .95, t: .45, wet: .2 }); else for (let i = 0; i < 40; i++) A.clic({ f: 1200 + Math.random() * 3000, q: 1, gan: .3, dur: .03, t: .5 + Math.random() * 1.8, wet: .2, pan: (Math.random() - .5) * 1.4 }); }
          if (!RM) for (let i = 0; i < 90; i++) st.conf.push({ x: 300 + Math.random() * 1320, y: -20 - Math.random() * 500, vy: 130 + Math.random() * 190, vx: (Math.random() - .5) * 60, f: Math.random() * 6, rot: Math.random() * 6, w: (Math.random() - .5) * 8, s: 5 + Math.random() * 7, col: ['#F6DA86', '#E6C25A', '#C23540', '#FFF0C0', '#B98A28'][i % 5] });
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 520; (function p_() { const u = (performance.now() - t0) / d; st.luz = eo(u, 2); if (u < 1) requestAnimationFrame(p_); else { st.luz = 1; ok(); } })(); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «album» · Blues, acto 4 «El blues de John» (Brooklyn, otoño): el álbum de fotos de John ──
     Un álbum de cuero abierto sobre una mesa de nogal, con una lámpara cálida. Las páginas pasan (el crujir del papel) con fotos en
     sepia sujetas por esquineras y, bajo cada foto, un nombre escrito a mano. Las páginas pasan cada vez más despacio y se queda
     abierto por la del elegido, que se ilumina suavemente. Con un número impar de nombres, una página lleva una hoja de otoño
     prensada en vez de nombre. */
  TEMAS.album = {
    fuentes: ['italic 500 52px "Cormorant Garamond"', '600 40px "Cormorant Garamond"', 'italic 600 100px "Cormorant Garamond"', '400 22px "Cormorant Garamond"'],
    nombreFit: { min: 44 },
    css: `
.lmv-t-album .lmv-velo{background:radial-gradient(ellipse at 32% 30%,rgba(78,46,20,.965) 0%,rgba(34,19,9,.985) 60%,rgba(10,6,3,.995) 100%)}
.lmv-t-album .lmv-cab{top:20px;display:flex;justify-content:center;align-items:baseline;gap:34px}
.lmv-t-album .lmv-ceja{font:600 40px/1 "Cormorant Garamond",Georgia,serif;letter-spacing:.34em;text-transform:uppercase;color:#EDB763;text-shadow:0 0 22px rgba(237,160,70,.4),0 3px 10px rgba(0,0,0,.85)}
.lmv-t-album .lmv-grupo{margin:0;font:italic 500 28px/1 "Cormorant Garamond",Georgia,serif;letter-spacing:.04em;white-space:nowrap;color:rgba(244,220,170,.88)}
.lmv-t-album .lmv-nombre{top:850px;left:150px;right:150px;height:124px;display:flex;align-items:center;justify-content:center;white-space:nowrap;font:italic 600 104px/1.1 "Cormorant Garamond",Georgia,serif;color:#FBE3B0;text-shadow:0 0 32px rgba(255,170,60,.5),0 4px 14px rgba(0,0,0,.9)}
.lmv-t-album .lmv-nota{top:66px;font:italic 500 26px/1.2 "Cormorant Garamond",Georgia,serif;color:#E8CFA0}
.lmv-t-album .lmv-pie{bottom:28px;gap:26px}
.lmv-t-album .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:12px 38px;border-radius:5px;border:2px solid #D8A455;background:rgba(40,22,10,.9);color:#F7E6C4;font:italic 600 30px/1 "Cormorant Garamond",Georgia,serif;letter-spacing:.03em;transition:background .2s,transform .15s}
.lmv-t-album .lmv-b:hover{background:rgba(120,70,30,.95);transform:translateY(-2px)}
.lmv-t-album .lmv-b.lmv-otra{background:linear-gradient(#8A5528,#6A3F1B 60%,#472710);border-color:#E8BE72;color:#FFF0D0}
.lmv-t-album .lmv-b.lmv-otra:hover{background:linear-gradient(#9C6330,#7A4A22 60%,#52301A)}
.lmv-t-album .lmv-cargando{color:#EDB763}
@media (prefers-reduced-motion:reduce){.lmv-t-album .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const CG = (px, w, it) => `${it ? 'italic ' : ''}${w || 500} ${px}px "Cormorant Garamond",Georgia,serif`;
      const SPX = 960, PW = 700, PH = 670, PY = 132, CX0 = 150, CY0 = 96, CW = 1620, CHH = 742;
      const LEGEND = ['Brooklyn, otoño de 1928', 'La calle Atlantic', 'El puente, al atardecer', 'El porche de los Hobbs', 'El tren elevado', 'John, en Fulton Street'];
      const st = { items: [], n: 0, M: 2, p: 0, W: 1, vs: 0, t: 0, luz: 0, lado: '', hojas: [], motas: [] };
      const pag = {};
      let fijo = null, raf = 0, vivo = true;
      const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.283); };
      const nomDe = P => { const q = ((P % st.M) + st.M) % st.M; return q < st.n ? q : -1; };

      /* la hoja de arce (para la mesa y para la página de la hoja prensada) */
      function hoja(g, x, y, s, rot, col) {
        const P = [[0, -1], [.14, -.62], [.4, -.78], [.36, -.36], [.8, -.42], [.62, -.12], [.92, .08], [.5, .14], [.46, .44], [.12, .3], [.06, .72], [-.06, .72], [-.12, .3], [-.46, .44], [-.5, .14], [-.92, .08], [-.62, -.12], [-.8, -.42], [-.36, -.36], [-.4, -.78], [-.14, -.62]];
        g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.beginPath(); P.forEach(([a, b], i) => i ? g.lineTo(a, b) : g.moveTo(a, b)); g.closePath(); g.fillStyle = col; g.fill();
        g.strokeStyle = 'rgba(60,20,5,.45)'; g.lineWidth = 1 / s * 1.4; g.beginPath(); g.moveTo(0, .8); g.lineTo(0, -.6); g.moveTo(0, .1); g.lineTo(.6, -.28); g.moveTo(0, .1); g.lineTo(-.6, -.28); g.stroke(); g.restore();
      }

      /* la mesa de nogal y el álbum: cubierta de cuero con su costura y sus esquineras de latón */
      function pintaFijo(g) {
        const r = semilla(31);
        for (let y = 0, i = 0; y < 1080; y += 135, i++) { const c = 50 + Math.round(r() * 22); g.fillStyle = `rgb(${c},${Math.round(c * .6)},${Math.round(c * .36)})`; g.fillRect(0, y, 1920, 135);
          g.strokeStyle = 'rgba(8,3,0,.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, y); g.lineTo(1920, y); g.stroke();
          for (let j = 0; j < 90; j++) { const x = r() * 1920, yy = y + 6 + r() * 120, l = 80 + r() * 380; g.strokeStyle = r() < .5 ? `rgba(15,6,1,${.06 + r() * .1})` : `rgba(255,200,130,${.02 + r() * .05})`; g.lineWidth = .8 + r() * 1.6; g.beginPath(); g.moveTo(x, yy); g.lineTo(x + l, yy + (r() - .5) * 5); g.stroke(); } }
        // la sombra del álbum
        g.save(); g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 60; g.shadowOffsetX = 14; g.shadowOffsetY = 26; rr(g, CX0, CY0, CW, CHH, 22); g.fillStyle = '#1c0f06'; g.fill(); g.restore();
        // el cuero
        let gr = g.createLinearGradient(CX0, CY0, CX0 + CW, CY0 + CHH); gr.addColorStop(0, '#5c3920'); gr.addColorStop(.5, '#432612'); gr.addColorStop(1, '#2e1a0b'); rr(g, CX0, CY0, CW, CHH, 22); g.fillStyle = gr; g.fill();
        g.save(); rr(g, CX0, CY0, CW, CHH, 22); g.clip();
        for (let i = 0; i < 5200; i++) { g.fillStyle = r() < .55 ? 'rgba(10,4,0,.16)' : 'rgba(255,205,140,.07)'; circ(g, CX0 + r() * CW, CY0 + r() * CHH, .5 + r() * 1.6); g.fill(); }
        for (let i = 0; i < 40; i++) { g.strokeStyle = 'rgba(10,4,0,.10)'; g.lineWidth = 1; const x = CX0 + r() * CW, y = CY0 + r() * CHH; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30 + r() * 60, y + (r() - .5) * 60, x + 60 + r() * 100, y + (r() - .5) * 40); g.stroke(); }
        gr = g.createRadialGradient(CX0 + 340, CY0 + 80, 40, CX0 + 340, CY0 + 80, 1100); gr.addColorStop(0, 'rgba(255,200,130,.22)'); gr.addColorStop(1, 'rgba(255,200,130,0)'); g.fillStyle = gr; g.fillRect(CX0, CY0, CW, CHH);
        g.restore();
        g.strokeStyle = 'rgba(255,214,150,.32)'; g.lineWidth = 2.5; rr(g, CX0 + 3, CY0 + 3, CW - 6, CHH - 6, 20); g.stroke();
        g.setLineDash([10, 8]); g.strokeStyle = 'rgba(236,190,120,.6)'; g.lineWidth = 2.6; rr(g, CX0 + 24, CY0 + 24, CW - 48, CHH - 48, 12); g.stroke(); g.setLineDash([]);
        // las esquineras de latón
        [[CX0, CY0, 0], [CX0 + CW, CY0, 1], [CX0 + CW, CY0 + CHH, 2], [CX0, CY0 + CHH, 3]].forEach(([x, y, q]) => { g.save(); g.translate(x, y); g.rotate(q * Math.PI / 2);
          const bg = g.createLinearGradient(0, 0, 90, 90); bg.addColorStop(0, '#F4DE9C'); bg.addColorStop(.4, '#C9A04C'); bg.addColorStop(1, '#6E5218'); g.fillStyle = bg;
          g.beginPath(); g.moveTo(0, 20); g.quadraticCurveTo(0, 0, 20, 0); g.lineTo(92, 0); g.lineTo(0, 92); g.closePath(); g.fill(); g.strokeStyle = 'rgba(60,38,6,.7)'; g.lineWidth = 2; g.stroke();
          g.fillStyle = 'rgba(60,38,6,.7)'; circ(g, 26, 26, 5); g.fill(); g.restore(); });
        // el canto de las hojas, a los lados de las páginas
        for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#d9c697' : '#c9b583'; g.fillRect(SPX - PW - 10 + i * 1.1, PY + 6 + i * .5, 1.1, PH - 12 - i); g.fillRect(SPX + PW + 9 - i * 1.1, PY + 6 + i * .5, 1.1, PH - 12 - i); }
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(SPX - PW - 10, PY + PH - 4, PW * 2 + 20, 6);
        // hojas de otoño sobre la mesa
        [[70, 250, .9, .5, '#B5521A'], [112, 700, 1.2, -.8, '#D8832A'], [1850, 190, 1.1, 1.2, '#8C2F14'], [1830, 760, .95, -.3, '#E0A23C'], [1790, 960, 1.2, .7, '#B5521A'], [200, 1000, 1, 2.2, '#8C2F14'], [980, 1020, .8, .3, '#D8832A']].forEach(([x, y, s, a, c]) => hoja(g, x, y, 40 * s, a, c));
      }
      function rehaz() { fijo = capaFija(L.k || 1, pintaFijo); }

      /* las fotos de John, en sepia: seis escenas de Brooklyn en otoño */
      const SEP = { cielo0: '#ecdcb9', cielo1: '#bfa379', med: '#8d6e48', osc: '#3d2b1a', negro: '#1f140b', luz: '#f2e2bb' };
      function escena(g, w, h, tipo, r) {
        const fondo = (a, b) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, w, h); };
        const arbol = (x, y, s, col) => { g.fillStyle = col; for (let i = 0; i < 36; i++) { circ(g, x + (r() - .5) * 90 * s, y - 40 * s + (r() - .5) * 70 * s, (6 + r() * 12) * s); g.fill(); } g.fillStyle = SEP.negro; g.fillRect(x - 3 * s, y, 6 * s, 90 * s); };
        if (tipo === 0) {                       // las casas de piedra rojiza
          fondo(SEP.cielo0, SEP.cielo1);
          for (let i = 0; i < 4; i++) { const x = 14 + i * 108, top = 66 + (i % 2) * 26 + r() * 12; g.fillStyle = i % 2 ? '#4a3524' : '#5d4430'; g.fillRect(x, top, 100, h - top - 34);
            g.fillStyle = '#2f2014'; g.fillRect(x - 4, top - 10, 108, 12);
            for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) { g.fillStyle = r() < .4 ? SEP.luz : '#241609'; g.fillRect(x + 14 + b * 44, top + 22 + a * 52, 26, 36); g.strokeStyle = '#1a0f07'; g.lineWidth = 2; g.strokeRect(x + 14 + b * 44, top + 22 + a * 52, 26, 36); }
            g.fillStyle = '#1b1109'; g.fillRect(x + 36, h - 34 - 50, 28, 50); g.fillStyle = '#6b523a'; for (let s = 0; s < 5; s++) g.fillRect(x + 28 - s * 3, h - 34 - s * 9, 44 + s * 6, 9); }
          g.fillStyle = '#2a1c10'; g.fillRect(0, h - 34, w, 34); arbol(w - 40, h - 40, 1.3, '#6e4f2d'); g.fillStyle = SEP.negro; g.fillRect(26, 70, 4, h - 110); g.beginPath(); g.arc(28, 66, 9, 0, 6.283); g.fill(); g.fillStyle = SEP.luz; g.beginPath(); g.arc(28, 66, 5, 0, 6.283); g.fill();
        } else if (tipo === 1) {                // el puente de Brooklyn
          fondo('#e9d3a8', '#b5946a'); g.fillStyle = '#a58660'; for (let i = 0; i < 16; i++) { const x = i * 30 + r() * 10, hh = 30 + r() * 50; g.fillRect(x, h * .55 - hh, 26, hh); }
          g.fillStyle = '#6e5538'; g.fillRect(0, h * .55, w, h * .45);
          for (let i = 0; i < 40; i++) { g.strokeStyle = 'rgba(240,222,180,.25)'; g.lineWidth = 2; const x = r() * w, y = h * .58 + r() * h * .38; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 26 + r() * 40, y); g.stroke(); }
          const tx = [w * .3, w * .78]; tx.forEach(x => { g.fillStyle = '#3b2a1a'; g.fillRect(x - 28, 56, 56, h * .55 - 56 + 20); g.fillStyle = '#d9c39a'; g.beginPath(); g.moveTo(x - 14, h * .55 + 20); g.lineTo(x - 14, 130); g.arc(x, 130, 14, Math.PI, 0); g.lineTo(x + 14, h * .55 + 20); g.fill(); g.beginPath(); g.moveTo(x - 14, 190); g.lineTo(x - 14, 160); g.arc(x, 160, 14, Math.PI, 0); g.lineTo(x + 14, 190); g.fill(); g.fillStyle = '#3b2a1a'; g.beginPath(); g.moveTo(x - 32, 56); g.lineTo(x, 28); g.lineTo(x + 32, 56); g.closePath(); g.fill(); });
          g.strokeStyle = '#2a1b0e'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-10, h * .5); g.quadraticCurveTo(tx[0] * .5, h * .56, tx[0], 62); g.quadraticCurveTo((tx[0] + tx[1]) / 2, h * .56, tx[1], 62); g.quadraticCurveTo(w - (w - tx[1]) * .5, h * .56, w + 10, h * .5); g.stroke();
          g.lineWidth = 1; for (let x = 10; x < w; x += 12) { const t = x; let yy = null; if (x < tx[0]) yy = h * .5 - (h * .5 - 62) * Math.pow((x - 0) / tx[0], 1.9); else if (x > tx[1]) yy = h * .5 - (h * .5 - 62) * Math.pow((w - x) / (w - tx[1]), 1.9); else { const u = (x - tx[0]) / (tx[1] - tx[0]); yy = 62 + (h * .56 - 62 + 40) * 4 * u * (1 - u) * .7; } g.beginPath(); g.moveTo(t, yy); g.lineTo(t, h * .55); g.stroke(); }
          g.fillStyle = '#1f140b'; g.fillRect(0, h * .55 - 4, w, 8);
        } else if (tipo === 2) {                // el porche con la mecedora
          fondo('#d9c196', '#9c7d52'); g.fillStyle = '#6a5036'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 22) { g.strokeStyle = 'rgba(20,10,3,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h - 60); g.stroke(); }
          g.fillStyle = '#2a1b0e'; g.fillRect(0, 0, w, 40); g.fillStyle = '#4a3522'; g.fillRect(0, h - 60, w, 60); g.strokeStyle = 'rgba(15,8,2,.5)'; g.lineWidth = 2; for (let x = 0; x < w; x += 34) { g.beginPath(); g.moveTo(x, h - 60); g.lineTo(x + 8, h); g.stroke(); }
          g.fillStyle = '#d9c39a'; g.fillRect(24, 30, 18, h - 90); g.fillRect(w - 42, 30, 18, h - 90);
          g.fillStyle = '#251709'; g.fillRect(150, 70, 90, 130); g.fillStyle = SEP.luz; g.fillRect(156, 76, 78, 118); g.strokeStyle = '#251709'; g.lineWidth = 4; g.beginPath(); g.moveTo(195, 76); g.lineTo(195, 194); g.moveTo(156, 135); g.lineTo(234, 135); g.stroke();
          g.strokeStyle = SEP.negro; g.lineCap = 'round'; g.lineWidth = 7; g.beginPath(); g.moveTo(300, 120); g.lineTo(318, 236); g.lineTo(394, 240); g.stroke();       // la mecedora: respaldo, asiento
          g.lineWidth = 4; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(303 + i * 3.2, 138 + i * 22); g.lineTo(327 + i * 3.2, 138 + i * 22); g.stroke(); }
          g.lineWidth = 6; g.beginPath(); g.moveTo(340, 176); g.lineTo(388, 196); g.lineTo(392, 240); g.moveTo(320, 238); g.lineTo(312, 296); g.moveTo(388, 242); g.lineTo(396, 296); g.stroke();   // brazo y patas
          g.lineWidth = 6; g.beginPath(); g.moveTo(276, 304); g.quadraticCurveTo(346, 330, 418, 302); g.stroke();                                                                              // los balancines
          g.strokeStyle = '#1f140b'; g.lineWidth = 2; g.beginPath(); g.moveTo(w - 100, 40); g.lineTo(w - 100, 96); g.stroke(); g.fillStyle = SEP.luz; g.fillRect(w - 112, 96, 24, 34); g.strokeRect(w - 112, 96, 24, 34);
          g.fillStyle = '#b8742c'; [[80, h - 40, 24], [116, h - 34, 20], [60, h - 24, 16]].forEach(([x, y, s]) => { g.beginPath(); g.ellipse(x, y, s, s * .8, 0, 0, 6.283); g.fill(); });
        } else if (tipo === 3) {                // la avenida con árboles de otoño
          fondo('#e6d2a6', '#b09068'); const vx = w * .5, vy = h * .46; g.fillStyle = '#4b3722'; g.beginPath(); g.moveTo(0, h); g.lineTo(w, h); g.lineTo(vx + 14, vy); g.lineTo(vx - 14, vy); g.closePath(); g.fill();
          g.strokeStyle = 'rgba(240,222,180,.35)'; g.lineWidth = 3; g.setLineDash([16, 14]); g.beginPath(); g.moveTo(vx, vy); g.lineTo(vx, h); g.stroke(); g.setLineDash([]);
          for (let i = 0; i < 5; i++) { const t = i / 5, s = .4 + Math.pow(1 - t, 1.2) * 1.5; [[-1], [1]].forEach(([sg]) => { const x = vx + sg * (40 + (1 - t) * 190), y = vy + 90 * (1 - t) + 40; arbol(x, y + 30 * s, s * .75, i % 2 ? '#6e4f2d' : '#4f3a22'); }); }
          g.fillStyle = SEP.negro; g.fillRect(vx + 70, vy - 10, 4, 100); g.beginPath(); g.arc(vx + 72, vy - 14, 7, 0, 6.283); g.fill();
          for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(80,50,20,.6)'; g.beginPath(); g.ellipse(r() * w, vy + 30 + r() * (h - vy - 30), 4, 2.4, r() * 3, 0, 6.283); g.fill(); }
        } else if (tipo === 4) {                // el tren elevado
          fondo('#ddc79c', '#a8895f'); g.fillStyle = '#9a7c55'; for (let i = 0; i < 12; i++) g.fillRect(i * 40, h * .6 - (20 + r() * 50), 34, 80);
          g.fillStyle = '#2c1d10'; g.fillRect(0, 138, w, 16); g.fillRect(0, 154, w, 4);
          for (let x = 24; x < w; x += 90) { g.fillRect(x, 154, 10, h - 190); g.strokeStyle = '#2c1d10'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 5, 160); g.lineTo(x + 90, h - 60); g.moveTo(x + 95, 160); g.lineTo(x + 5, h - 60); g.stroke(); }
          for (let c = 0; c < 3; c++) { const x = 40 + c * 128; g.fillStyle = '#3a291a'; rr(g, x, 82, 120, 56, 6); g.fill(); g.fillStyle = SEP.luz; for (let wv = 0; wv < 4; wv++) g.fillRect(x + 10 + wv * 27, 92, 18, 22); g.fillStyle = '#1f140b'; g.fillRect(x + 4, 130, 112, 8); }
          g.fillStyle = 'rgba(210,190,150,.5)'; for (let i = 0; i < 6; i++) { circ(g, 20 + i * 20, 62 - i * 6, 14 + i * 4); g.fill(); }
          g.fillStyle = '#2a1c10'; g.fillRect(0, h - 40, w, 40); g.fillStyle = SEP.negro; g.fillRect(w * .4, h - 100, 8, 70); g.beginPath(); g.arc(w * .4 + 4, h - 74 - 40, 9, 0, 6.283); g.fill(); g.fillRect(w * .4 - 4, h - 70, 16, 38);
        } else {                                // el retrato de John, con sombrero y armónica
          fondo('#cdb184', '#8a6c46'); const gr = g.createRadialGradient(w / 2, h * .42, 20, w / 2, h * .42, h * .7); gr.addColorStop(0, 'rgba(255,238,200,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
          g.fillStyle = '#2a1c10'; g.beginPath(); g.moveTo(w / 2 - 150, h); g.quadraticCurveTo(w / 2 - 140, h * .66, w / 2 - 40, h * .62); g.lineTo(w / 2 + 40, h * .62); g.quadraticCurveTo(w / 2 + 140, h * .66, w / 2 + 150, h); g.closePath(); g.fill();
          g.fillStyle = '#e3d1a8'; g.beginPath(); g.moveTo(w / 2 - 34, h * .62); g.lineTo(w / 2, h * .8); g.lineTo(w / 2 + 34, h * .62); g.closePath(); g.fill(); g.fillStyle = '#4a2c18'; g.beginPath(); g.moveTo(w / 2 - 8, h * .66); g.lineTo(w / 2 + 8, h * .66); g.lineTo(w / 2 + 12, h * .86); g.lineTo(w / 2, h * .9); g.lineTo(w / 2 - 12, h * .86); g.closePath(); g.fill();
          g.fillStyle = '#7a5736'; g.beginPath(); g.ellipse(w / 2, h * .42, 54, 68, 0, 0, 6.283); g.fill(); g.fillStyle = '#6a4a2e'; g.fillRect(w / 2 - 22, h * .56, 44, 40);
          g.fillStyle = '#251709'; g.beginPath(); g.ellipse(w / 2, h * .325, 100, 20, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(w / 2 - 56, h * .33); g.quadraticCurveTo(w / 2 - 50, h * .16, w / 2, h * .17); g.quadraticCurveTo(w / 2 + 50, h * .16, w / 2 + 56, h * .33); g.closePath(); g.fill(); g.fillStyle = '#6b4a2b'; g.fillRect(w / 2 - 56, h * .3, 112, 9);
          g.fillStyle = '#1f140b'; circ(g, w / 2 - 20, h * .42, 4.5); g.fill(); circ(g, w / 2 + 20, h * .42, 4.5); g.fill();
          g.strokeStyle = '#1f140b'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2 - 14, h * .52); g.quadraticCurveTo(w / 2, h * .535, w / 2 + 14, h * .52); g.stroke();
        }
      }
      function pintaFoto(g, tipo, sem) {
        const W = 452, Hh = 324, r = semilla(sem * 977 + tipo * 131);
        g.save(); g.beginPath(); g.rect(0, 0, W, Hh); g.clip(); escena(g, W, Hh, tipo, r);
        g.fillStyle = 'rgba(175,120,62,.26)'; g.globalCompositeOperation = 'multiply'; g.fillRect(0, 0, W, Hh); g.globalCompositeOperation = 'source-over';
        const gr = g.createRadialGradient(W / 2, Hh / 2, 90, W / 2, Hh / 2, W * .66); gr.addColorStop(0, 'rgba(255,225,170,.0)'); gr.addColorStop(1, 'rgba(20,8,0,.62)'); g.fillStyle = gr; g.fillRect(0, 0, W, Hh);
        for (let i = 0; i < 1100; i++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.09)' : 'rgba(255,240,205,.10)'; g.fillRect(r() * W, r() * Hh, 1 + r() * 1.5, 1 + r() * 1.5); }
        for (let i = 0; i < 4; i++) { g.strokeStyle = 'rgba(255,240,210,.13)'; g.lineWidth = 1; const x = r() * W; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (r() - .5) * 20, Hh); g.stroke(); }
        g.restore();
      }

      /* una página: el papel, la foto con sus esquineras y el nombre a mano */
      function pintaPagina(g, P) {
        const q = ((P % st.M) + st.M) % st.M, ix = q < st.n ? q : -1, r = semilla(q * 53 + 7), tipo = ((q % 6) + 6) % 6;
        let gr = g.createLinearGradient(0, 0, PW, 0); const izq = P % 2 !== 0;
        gr.addColorStop(0, '#E9DAB1'); gr.addColorStop(1, '#E1CF9F'); g.fillStyle = gr; g.fillRect(0, 0, PW, PH);
        for (let i = 0; i < 1500; i++) { g.fillStyle = r() < .5 ? 'rgba(120,84,36,.06)' : 'rgba(255,250,225,.16)'; g.fillRect(r() * PW, r() * PH, 1 + r() * 4, 1); }
        for (let i = 0; i < 5; i++) { const x = r() * PW, y = r() * PH, rg = g.createRadialGradient(x, y, 2, x, y, 40 + r() * 60); rg.addColorStop(0, 'rgba(140,96,40,.10)'); rg.addColorStop(1, 'rgba(140,96,40,0)'); g.fillStyle = rg; g.fillRect(0, 0, PW, PH); }
        // el pliegue junto al lomo y el borde envejecido
        gr = g.createLinearGradient(izq ? PW : 0, 0, izq ? PW - 90 : 90, 0); gr.addColorStop(0, 'rgba(60,30,6,.40)'); gr.addColorStop(1, 'rgba(60,30,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, PW, PH);
        gr = g.createLinearGradient(izq ? 0 : PW, 0, izq ? 26 : PW - 26, 0); gr.addColorStop(0, 'rgba(110,70,20,.30)'); gr.addColorStop(1, 'rgba(110,70,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, PW, PH);
        const cx = PW / 2 + (izq ? -12 : 12);
        if (ix >= 0) {
          // la foto: marco blanco, esquineras negras y una ligera inclinación
          g.save(); g.translate(cx, 232); g.rotate((r() - .5) * .045);
          g.shadowColor = 'rgba(40,22,6,.45)'; g.shadowBlur = 14; g.shadowOffsetY = 6; g.fillStyle = '#f3ead0'; g.fillRect(-240, -178, 480, 356); g.shadowColor = 'transparent';
          g.save(); g.translate(-226, -164); pintaFoto(g, tipo, q); g.restore();
          g.strokeStyle = 'rgba(70,45,20,.5)'; g.lineWidth = 1.4; g.strokeRect(-226, -164, 452, 324);
          [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { const x = sx * 240, y = sy * 178; g.fillStyle = '#2a1c11'; g.beginPath(); g.moveTo(x, y); g.lineTo(x - sx * 50, y); g.lineTo(x, y - sy * 50); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,230,190,.25)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - sx * 50, y); g.lineTo(x, y - sy * 50); g.stroke(); });
          g.restore();
          // el nombre, escrito a mano
          const f = rotula(g, px => CG(px, 500, true), String(st.items[ix]), 580, 120, 66, 26, true);
          g.save(); g.translate(cx, 482); g.rotate(-.014); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#2a170a'; g.font = CG(f.px, 500, true);
          const lh = f.px * 1.0, y0 = -(f.lineas.length - 1) * lh / 2; f.lineas.forEach((ln, i) => textoCabe(g, ln, 0, y0 + i * lh, 580));
          const yy = y0 + (f.lineas.length - 1) * lh + f.px * .62; g.strokeStyle = 'rgba(42,23,10,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-170, yy + 6); g.bezierCurveTo(-90, yy - 2, 60, yy + 12, 176, yy + 2); g.stroke(); g.restore();
          g.fillStyle = 'rgba(70,44,20,.78)'; g.font = CG(27, 500, true); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(LEGEND[tipo], cx, 566);
        } else {                                  // la hoja de otoño prensada, sin nombre
          g.save(); g.translate(cx, 250); g.rotate(-.25); hoja(g, 0, 0, 150, 0, '#B5521A'); g.restore();
          g.fillStyle = 'rgba(230,214,170,.7)'; g.save(); g.translate(cx - 60, 120); g.rotate(-.5); g.fillRect(-30, -9, 60, 18); g.restore(); g.save(); g.translate(cx + 80, 360); g.rotate(.6); g.fillRect(-30, -9, 60, 18); g.restore();
          g.fillStyle = '#2a170a'; g.font = CG(50, 500, true); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Brooklyn, otoño', cx, 482); g.fillStyle = 'rgba(70,44,20,.78)'; g.font = CG(27, 500, true); g.fillText('una hoja del parque, 1928', cx, 566);
        }
        g.fillStyle = 'rgba(70,44,20,.6)'; g.font = CG(24, 500, true); g.textAlign = 'center'; g.fillText('— ' + (q + 1) + ' —', cx, PH - 36);
      }
      const imagen = P => { const q = ((P % st.M) + st.M) % st.M; if (!pag[q]) pag[q] = capaFija(L.k || 1, g_ => pintaPagina(g_, q), 0, 0, PW, PH); return pag[q]; };
      function prepara(bombo) {
        st.items = bombo.slice(); st.n = bombo.length; st.M = st.n + (st.n % 2); for (const k_ in pag) delete pag[k_];
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) { rehaz(); for (const k_ in pag) delete pag[k_]; } }

      /* las páginas: la de la izquierda, la de la derecha y las hojas en el aire (en tiras, para que se curven al pasar) */
      function hojaVolando(m, p, W) {
        const fr = clamp((p - m) / W, 0, 1); if (fr <= 0 || fr >= 1) return;
        const th = Math.PI * (fr * fr * (3 - 2 * fr)), N = 18, sw = PW / N, imF = imagen(2 * m), imB = imagen(2 * m + 1), k = L.k || 1, sn = Math.sin(th);
        let xs = SPX;
        for (let i = 0; i < N; i++) {
          const thi = th - .6 * sn * (i / N), c = Math.cos(thi), dx = sw * c, sv = 1 + .05 * Math.sin(thi) * (i / N), hh = PH * sv, yT = PY + PH / 2 - hh / 2, u0 = i / N, u1 = (i + 1) / N;
          if (c >= 0) g.drawImage(imF.c, u0 * PW * k, 0, sw * k, PH * k, xs, yT, dx + .7, hh);
          else g.drawImage(imB.c, (1 - u1) * PW * k, 0, sw * k, PH * k, xs + dx, yT, -dx + .7, hh);
          g.fillStyle = `rgba(30,14,4,${.05 + .34 * (1 - Math.abs(c))})`; g.fillRect(Math.min(xs, xs + dx), yT, Math.abs(dx) + .7, hh);
          xs += dx;
        }
        // la sombra que echa en la página de debajo
        const dir = Math.cos(th) >= 0 ? 1 : -1, sg = g.createLinearGradient(xs, 0, xs + dir * 70, 0); sg.addColorStop(0, `rgba(20,8,0,${.30 * sn})`); sg.addColorStop(1, 'rgba(20,8,0,0)'); g.fillStyle = sg; g.fillRect(Math.min(xs, xs + dir * 70), PY, 70, PH);
      }
      function pintaPaginas() {
        const p = st.p, W = st.W, mL = Math.floor(p - W + 1e-6), mR = Math.ceil(p - 1e-6);
        const iL = imagen(2 * mL + 1), iR = imagen(2 * mR);
        g.drawImage(iL.c, SPX - PW, PY, PW, PH); g.drawImage(iR.c, SPX, PY, PW, PH);
        for (let m = mL + 1; m <= mR - 1; m++) hojaVolando(m, p, W);
        // la sombra del lomo
        const gr = g.createLinearGradient(SPX - 44, 0, SPX + 44, 0); gr.addColorStop(0, 'rgba(25,10,2,0)'); gr.addColorStop(.5, 'rgba(25,10,2,.55)'); gr.addColorStop(1, 'rgba(25,10,2,0)'); g.fillStyle = gr; g.fillRect(SPX - 44, PY, 88, PH);
        // la página del elegido, encendida
        if (st.lado && st.luz > 0) {
          const x = st.lado === 'L' ? SPX - PW : SPX, a = st.luz * (.30 + (RM ? 0 : .06 * Math.sin(st.t * 3)));
          g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(x + PW / 2, PY + 250, 30, x + PW / 2, PY + 300, 560); rg.addColorStop(0, `rgba(255,198,110,${a})`); rg.addColorStop(1, 'rgba(255,198,110,0)'); g.fillStyle = rg; g.fillRect(x, PY, PW, PH);
          g.strokeStyle = `rgba(255,214,140,${.55 * st.luz})`; g.lineWidth = 4; g.strokeRect(x + 6, PY + 6, PW - 12, PH - 12); g.restore();
          // la otra página, algo más oscura
          const x2 = st.lado === 'L' ? SPX : SPX - PW; g.fillStyle = `rgba(20,8,0,${.32 * st.luz})`; g.fillRect(x2, PY, PW, PH);
        }
      }

      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra();
        if (fijo) {
          ponCapa(g, fijo);
          // la luz de la lámpara y las motas de polvo
          g.save(); g.globalCompositeOperation = 'lighter';
          let gr = g.createRadialGradient(330, 120, 30, 330, 120, 1100); gr.addColorStop(0, `rgba(255,190,100,${.20 + .02 * Math.sin(st.t * 2.1) * mov})`); gr.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
          g.restore();
          pintaPaginas();
          if (mov) {
            while (st.motas.length < 40) st.motas.push({ x: 200 + Math.random() * 1500, y: 100 + Math.random() * 800, r: .6 + Math.random() * 1.6, v: 3 + Math.random() * 8, f: Math.random() * 6 });
            g.save(); g.globalCompositeOperation = 'lighter';
            st.motas.forEach(m => { m.y -= m.v * dt; m.x += Math.sin(st.t * .5 + m.f) * 8 * dt; if (m.y < 80) { m.y = 900; m.x = 200 + Math.random() * 1500; } g.fillStyle = `rgba(255,224,170,${.16 + .12 * Math.sin(st.t * 1.4 + m.f)})`; circ(g, m.x, m.y, m.r); g.fill(); });
            st.hojas = st.hojas.filter(h => { h.v -= dt; if (h.v <= 0) return false; h.y += h.vy * dt; h.x += Math.sin(st.t * 2 + h.f) * 60 * dt + h.vx * dt; h.rot += h.w * dt; g.globalAlpha = clamp(h.v / .8, 0, 1); hoja(g, h.x, h.y, h.s, h.rot, h.col); g.globalAlpha = 1; return true; });
            g.restore();
          }
        }
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.album.fuentes, () => { if (!vivo) return; rehaz(); for (const k_ in pag) delete pag[k_]; });

      /* los sonidos: el crujir del papel y el pasar de página (si el portal los da) y, si no, unos sintéticos */
      const son = {}, S = o.sonidos || {};
      const listo = Promise.all([A.carga(S.pagina), A.carga(S.papel)]).then(([a, b]) => { son.pagina = a; son.papel = b; });
      let tPg = 0;
      function pasa(v) {
        const ac = A.ac; if (!ac) return; const t = ac.currentTime; if (t - tPg < .085) return; tPg = t;
        if (son.pagina && v < 6) A.trozo(son.pagina, { desde: Math.random() < .5 ? 0 : .38, dur: .5, fade: .2, gan: clamp(.35 + v * .05, .35, .7), vel: .95 + Math.random() * .3, wet: .2 });
        A.clic({ f: 1600 + Math.random() * 900, q: .7, gan: clamp(.10 + v * .02, .1, .26), dur: .11, wet: .15, pan: (Math.random() - .5) * .5 });
      }

      return {
        ajusta,
        espera() { if (!st.n) { prepara(['· · ·']); st.p = 0; } },
        async gira(bombo, k) {
          prepara(bombo); st.luz = 0; st.lado = ''; st.W = 1; st.vs = 0; await esperaMuestras(listo);
          const ac = A.ac || A.crea(), T = RM ? 1.7 : T_GIRO, p0 = Math.round(st.p);
          let s1 = Math.ceil(p0 + (RM ? 3 : 12)); for (let i = 0; i < 2 * st.M + 6; i++, s1++) if (nomDe(2 * s1) === k || nomDe(2 * s1 - 1) === k) break;
          const f = recorrido(p0, s1, { T, p: 2.3, amago: .12, retro: 0, sobra: 0, rebote: .1 });
          if (ac && son.papel && !RM) A.trozo(son.papel, { gan: .55, dur: 3.4, fade: 1.6, wet: .25 });
          await new Promise(ok => {
            const t0 = performance.now(); let antes = p0, ult = Math.floor(p0);
            (function paso() {
              const t = (performance.now() - t0) / 1000, p = f(Math.min(t, f.T)), v = Math.abs(p - antes) * 60; antes = p; st.p = p;
              st.vs += (v - st.vs) * .2; st.W = RM ? 1 : 1 + 2.2 * clamp(st.vs / 7, 0, 1) * clamp((f.T - t) / .7, 0, 1);
              const fl = Math.floor(p); if (fl !== ult) { ult = fl; pasa(v); }
              if (t < f.T) requestAnimationFrame(paso); else { st.p = s1; st.W = 1; st.vs = 0; ok(); }
            })();
          });
          // se queda en la página del elegido: ese lado se ilumina, con una hoja de otoño que cae
          st.lado = nomDe(2 * s1) === k ? 'R' : 'L';
          if (ac) { if (son.pagina) A.trozo(son.pagina, { desde: 0, dur: .9, fade: .4, gan: .55, wet: .3 }); [659.25, 783.99, 987.77, 1318.5].forEach((fq, i) => A.nota(fq, { tipo: 'sine', t: .05 + i * .11, dur: 1.8, gan: .07, wet: .85 })); A.nota(196, { tipo: 'triangle', dur: 1.6, gan: .06, filtro: { f: 700 }, wet: .5 }); }
          if (!RM) for (let i = 0; i < 9; i++) st.hojas.push({ x: 300 + Math.random() * 1320, y: 60 - Math.random() * 240, vy: 90 + Math.random() * 120, vx: (Math.random() - .5) * 40, f: Math.random() * 6, rot: Math.random() * 6, w: (Math.random() - .5) * 3, s: 16 + Math.random() * 16, col: ['#B5521A', '#D8832A', '#8C2F14', '#E0A23C'][i % 4], v: 6 });
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 600; (function p_() { const u = (performance.now() - t0) / d; st.luz = eo(u, 2); if (u < 1) requestAnimationFrame(p_); else { st.luz = 1; ok(); } })(); });
          await new Promise(ok => setTimeout(ok, RM ? 100 : 200));
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «cordon» · Atonalidad · Capítulo 1 «La visita» (de día): el cordón del museo ──
     (22-oct-2026, v5) El vestíbulo dorado del museo por la mañana: pared de damasco granate, cuadros con marco dorado, zócalo
     de nogal y la alfombra roja. Delante, la fila de postes de latón con sus cordones de terciopelo; en lo alto de cada poste,
     su cartela con un nombre. La fila pasa (como si fuéramos andando por la sala), frena con un poste justo bajo el foco y los
     dos cordones de ese poste se descuelgan: el elegido queda libre, iluminado, «pasa». Gramófono al final. */
  TEMAS.cordon = {
    fuentes: ['700 54px Lora', '600 24px Poppins', '500 22px Poppins', 'italic 400 26px Lora'],
    nombreFit: { min: 48 },
    css: `
.lmv-t-cordon .lmv-velo{background:radial-gradient(ellipse at 50% 32%,rgba(82,32,22,.975) 0%,rgba(36,13,8,.988) 58%,rgba(12,5,3,.995) 100%)}
.lmv-t-cordon .lmv-cab{top:30px}
.lmv-t-cordon .lmv-ceja{font:600 24px/1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;letter-spacing:.42em;text-transform:uppercase;color:#ecc581;text-shadow:0 2px 14px rgba(0,0,0,.9)}
.lmv-t-cordon .lmv-grupo{margin-top:10px;font:500 22px/1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:rgba(246,230,204,.72)}
.lmv-t-cordon .lmv-nombre{top:772px;left:160px;right:160px;height:126px;display:flex;align-items:center;justify-content:center;font:700 100px/1.1 Lora,Georgia,"Times New Roman",serif;color:#fff2da;text-shadow:0 0 36px rgba(255,196,96,.55),0 0 90px rgba(255,170,60,.22),0 6px 26px rgba(0,0,0,.9)}
.lmv-t-cordon .lmv-nota{top:908px;font:italic 400 26px/1.3 Lora,Georgia,serif;color:#e8d1a6}
.lmv-t-cordon .lmv-pie{bottom:40px}
.lmv-t-cordon .lmv-b{display:inline-flex;align-items:center;gap:14px;padding:16px 36px;border-radius:12px;border:2px solid #d9b066;background:rgba(32,13,8,.86);color:#f7e8ce;font:600 27px/1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;transition:background .2s,transform .15s}
.lmv-t-cordon .lmv-b:hover{background:rgba(70,28,16,.92);transform:translateY(-2px)}
.lmv-t-cordon .lmv-b.lmv-otra{background:linear-gradient(#ebc87e,#c99a42 60%,#9b7228);border-color:#f3d796;color:#2a1606}
.lmv-t-cordon .lmv-b.lmv-otra:hover{background:linear-gradient(#f3d48c,#d4a54c 60%,#a87c30)}
.lmv-t-cordon .lmv-cargando{color:#ecc581}
.lmv-of-cordon .lmv-ob{font-family:Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;font-weight:600;border:2px solid #d9b066;border-radius:12px;background:rgba(44,15,10,.95);color:#f7e8ce;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 40px rgba(217,176,102,.22)}
.lmv-of-cordon .lmv-og,.lmv-of-cordon .lmv-no{font-family:Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;color:#efd9b0}
@media (prefers-reduced-motion:reduce){.lmv-t-cordon .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const D = 400, CX = 960, SUELO = 722, POSTE_ARR = 468, ARO = 566, COMBA = 70, CW = 300, CH = 132, CY = 324;   // la cartela: de CY a CY+CH
      const LORA = px => `700 ${px}px Lora, Georgia, "Times New Roman", serif`;
      const st = { items: [], n: 0, p: 0, vel: 0, t: 0, foco: .55, luz: 0, suelta: 0, brillo: -1, elegido: null, motas: [] };
      let fijo = null, poste = null, raf = 0, vivo = true;
      const cartelas = new Map();
      const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.283); };

      /* lo que no se mueve: la pared de damasco, los cuadros, el zócalo, el parqué y la alfombra */
      function pintaFijo(g) {
        const r = semilla(17);
        let gr = g.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, '#4c1a14'); gr.addColorStop(.7, '#5e231a'); gr.addColorStop(1, '#3a120c');
        g.fillStyle = gr; g.fillRect(0, 0, 1920, 640);
        // el damasco: un motivo dorado muy tenue, repetido
        g.save(); g.globalAlpha = .07; g.fillStyle = '#e9c27a';
        for (let y = 40, f = 0; y < 640; y += 150, f++) for (let x = (f % 2) * 80 - 40; x < 1960; x += 160) {
          g.save(); g.translate(x, y); g.beginPath(); g.moveTo(0, -46); g.bezierCurveTo(26, -30, 30, -6, 0, 18); g.bezierCurveTo(-30, -6, -26, -30, 0, -46); g.fill();
          g.beginPath(); g.ellipse(0, 30, 10, 16, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-28, 4); g.quadraticCurveTo(-48, 30, -24, 44); g.quadraticCurveTo(-30, 24, -28, 4); g.fill();
          g.beginPath(); g.moveTo(28, 4); g.quadraticCurveTo(48, 30, 24, 44); g.quadraticCurveTo(30, 24, 28, 4); g.fill(); g.restore(); }
        g.restore();
        // dos cuadros con marco dorado (un retrato en sepia, desenfocado por la distancia)
        [[60, 120, 330, 400], [1530, 140, 330, 380]].forEach(([x, y, w, h], q) => {
          g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 30; g.shadowOffsetY = 14; g.fillStyle = '#2a1a08'; g.fillRect(x, y, w, h); g.restore();
          const mg = g.createLinearGradient(x, y, x + w, y + h); mg.addColorStop(0, '#f0d58e'); mg.addColorStop(.35, '#a77a2e'); mg.addColorStop(.6, '#e2c06e'); mg.addColorStop(1, '#6e4c16');
          g.fillStyle = mg; g.fillRect(x, y, w, h); g.fillStyle = '#3b2610'; g.fillRect(x + 24, y + 24, w - 48, h - 48);
          const lg = g.createRadialGradient(x + w / 2, y + h * .38, 10, x + w / 2, y + h * .45, w * .7); lg.addColorStop(0, q ? '#7a6244' : '#806648'); lg.addColorStop(1, '#2c1d0e');
          g.fillStyle = lg; g.fillRect(x + 30, y + 30, w - 60, h - 60);
          g.fillStyle = 'rgba(30,18,8,.75)'; circ(g, x + w / 2, y + h * .4, 46); g.fill();
          g.beginPath(); g.ellipse(x + w / 2, y + h - 36, 110, 90, 0, Math.PI, 0); g.fill();
          g.strokeStyle = 'rgba(255,236,190,.35)'; g.lineWidth = 2; g.strokeRect(x + 6, y + 6, w - 12, h - 12); });
        // la moldura y el zócalo de nogal (la moldura, más arriba que los cordones, para que no parezca otro cordón)
        gr = g.createLinearGradient(0, 512, 0, 722); gr.addColorStop(0, '#3a1d10'); gr.addColorStop(1, '#22110a'); g.fillStyle = gr; g.fillRect(0, 512, 1920, 210);
        for (let x = 20; x < 1920; x += 240) { g.strokeStyle = 'rgba(214,160,92,.16)'; g.lineWidth = 2; rr(g, x, 536, 200, 168, 4); g.stroke(); g.fillStyle = 'rgba(0,0,0,.16)'; rr(g, x + 8, 544, 184, 152, 3); g.fill(); }
        gr = g.createLinearGradient(0, 504, 0, 516); gr.addColorStop(0, '#b38a48'); gr.addColorStop(.5, '#6a4a1c'); gr.addColorStop(1, '#2a180a'); g.fillStyle = gr; g.fillRect(0, 504, 1920, 12);
        // el parqué, encerado, en perspectiva
        gr = g.createLinearGradient(0, SUELO, 0, 1080); gr.addColorStop(0, '#3e2412'); gr.addColorStop(1, '#170c05'); g.fillStyle = gr; g.fillRect(0, SUELO, 1920, 1080 - SUELO);
        for (let i = -16; i <= 16; i++) { g.strokeStyle = `rgba(0,0,0,${.22 + r() * .1})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(CX + i * 60, SUELO); g.lineTo(CX + i * 190, 1080); g.stroke(); }
        for (let y = SUELO + 18, k = 1; y < 1080; y += 14 + k * 6, k++) { g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, y); g.lineTo(1920, y); g.stroke(); }
        // la alfombra roja con su cenefa dorada
        g.beginPath(); g.moveTo(380, SUELO + 6); g.lineTo(1540, SUELO + 6); g.lineTo(2060, 1080); g.lineTo(-140, 1080); g.closePath();
        gr = g.createLinearGradient(0, SUELO, 0, 1080); gr.addColorStop(0, '#6e1212'); gr.addColorStop(1, '#3a0707'); g.fillStyle = gr; g.fill();
        g.strokeStyle = 'rgba(232,190,110,.55)'; g.lineWidth = 4; g.beginPath(); g.moveTo(420, SUELO + 12); g.lineTo(1500, SUELO + 12); g.lineTo(1990, 1080); g.moveTo(420, SUELO + 12); g.lineTo(-70, 1080); g.stroke();
        // reflejo de los ventanales en la pared (luz de día)
        g.save(); g.globalCompositeOperation = 'lighter';
        gr = g.createLinearGradient(0, 0, 1920, 0); gr.addColorStop(0, 'rgba(255,214,150,.10)'); gr.addColorStop(.5, 'rgba(255,214,150,0)'); gr.addColorStop(1, 'rgba(255,214,150,.08)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 600);
        g.restore();
        // viñeta
        gr = g.createRadialGradient(CX, 520, 300, CX, 520, 1150); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
      }

      /* el poste de latón (sin la cartela): el pie, la barra, el collar y los aros del cordón */
      function pintaPoste(g) {
        const x = 40;                                    // el poste, centrado en x = 40 de su capa (80 de ancho)
        g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(x, SUELO + 6, 52, 11, 0, 0, 6.283); g.fill();
        let gr = g.createLinearGradient(x - 46, 0, x + 46, 0); gr.addColorStop(0, '#5d4116'); gr.addColorStop(.3, '#f6df9c'); gr.addColorStop(.55, '#b88e3a'); gr.addColorStop(1, '#4e3510');
        g.fillStyle = gr; g.beginPath(); g.ellipse(x, SUELO - 4, 44, 12, 0, 0, 6.283); g.fill(); g.fillRect(x - 44, SUELO - 14, 88, 10); g.beginPath(); g.ellipse(x, SUELO - 14, 44, 12, 0, 0, 6.283); g.fill();
        gr = g.createLinearGradient(x - 26, 0, x + 26, 0); gr.addColorStop(0, '#6a4a18'); gr.addColorStop(.35, '#fbe7ab'); gr.addColorStop(.6, '#c39a46'); gr.addColorStop(1, '#5a3f12');
        g.fillStyle = gr; g.beginPath(); g.moveTo(x - 24, SUELO - 16); g.quadraticCurveTo(x - 10, SUELO - 40, x - 10, SUELO - 70); g.lineTo(x + 10, SUELO - 70); g.quadraticCurveTo(x + 10, SUELO - 40, x + 24, SUELO - 16); g.closePath(); g.fill();
        gr = g.createLinearGradient(x - 10, 0, x + 10, 0); gr.addColorStop(0, '#6a4a18'); gr.addColorStop(.4, '#fff0bb'); gr.addColorStop(.65, '#c49b47'); gr.addColorStop(1, '#5a3f12');
        g.fillStyle = gr; g.fillRect(x - 9, POSTE_ARR, 18, SUELO - 70 - POSTE_ARR);
        [ARO - 14, POSTE_ARR + 4].forEach(y => { g.fillStyle = gr; rr(g, x - 15, y - 7, 30, 14, 5); g.fill(); g.strokeStyle = 'rgba(70,45,10,.55)'; g.lineWidth = 1.2; g.stroke(); });
        // los aros, a los dos lados
        [-1, 1].forEach(s => { g.strokeStyle = '#d9b468'; g.lineWidth = 4; g.beginPath(); g.ellipse(x + s * 16, ARO, 7, 9, 0, 0, 6.283); g.stroke(); });
      }

      /* la cartela de un nombre: marco de bronce, placa de latón cepillado y el nombre grabado */
      function cartela(nom) {
        const k = L.k || 1, clave = nom + '|' + k;
        if (cartelas.has(clave)) return cartelas.get(clave);
        const c = capaFija(k, g => {
          const x = 10, y = 10, w = CW, h = CH;
          g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 18; g.shadowOffsetY = 8; rr(g, x, y, w, h, 12); g.fillStyle = '#3a250b'; g.fill(); g.restore();
          let gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, '#6b4a18'); gr.addColorStop(.5, '#3a250b'); gr.addColorStop(1, '#22160a'); rr(g, x, y, w, h, 12); g.fillStyle = gr; g.fill();
          gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, '#f7e2a4'); gr.addColorStop(.32, '#d2a95a'); gr.addColorStop(.6, '#f0d48e'); gr.addColorStop(1, '#a37a30');
          rr(g, x + 11, y + 11, w - 22, h - 22, 6); g.fillStyle = gr; g.fill();
          g.save(); rr(g, x + 11, y + 11, w - 22, h - 22, 6); g.clip(); const rn = semilla(nom.length * 131 + 7);
          for (let i = 0; i < 160; i++) { g.fillStyle = rn() < .5 ? 'rgba(255,248,220,.10)' : 'rgba(90,60,15,.10)'; g.fillRect(x + 11 + rn() * (w - 22), y + 11 + rn() * (h - 22), 6 + rn() * 50, .9); }
          g.restore();
          g.strokeStyle = 'rgba(90,60,15,.45)'; g.lineWidth = 1.5; rr(g, x + 20, y + 20, w - 40, h - 40, 3); g.stroke();
          [[x + 26, y + 26], [x + w - 26, y + 26], [x + 26, y + h - 26], [x + w - 26, y + h - 26]].forEach(([a, b]) => { const rg = g.createRadialGradient(a - 1.5, b - 1.5, .5, a, b, 5); rg.addColorStop(0, '#fff6d6'); rg.addColorStop(1, '#6b4a18'); g.fillStyle = rg; circ(g, a, b, 4.2); g.fill(); });
          // el nombre, grabado (una línea más clara por debajo, como el bisel del grabado)
          const R = rotula(g, LORA, nom, w - 76, h - 48, 54, 26, true), lh = R.px * 1.06, y0 = y + h / 2 - (R.lineas.length - 1) * lh / 2 + R.px * .05;
          g.font = LORA(R.px); g.textAlign = 'center'; g.textBaseline = 'middle';
          R.lineas.forEach((t, i) => { g.fillStyle = 'rgba(255,246,214,.55)'; textoCabe(g, t, x + w / 2, y0 + i * lh + 1.6, w - 70); g.fillStyle = '#3a2309'; textoCabe(g, t, x + w / 2, y0 + i * lh, w - 70); });
        }, 0, 0, CW + 20, CH + 20);
        cartelas.set(clave, c); return c;
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) { fijo = capaFija(L.k, pintaFijo); poste = capaFija(L.k, pintaPoste, 0, 0, 80, 1080); cartelas.clear(); } }

      /* un cordón de terciopelo entre (x1,y1) y (x2,y2), con su comba (o con el punto de control que se dé) */
      function cordon(x1, y1, x2, y2, comba, a, cx, cy) {
        const mx = cx == null ? (x1 + x2) / 2 : cx, my = cy == null ? (y1 + y2) / 2 + comba * 2 : cy;
        g.save(); g.globalAlpha = a == null ? 1 : a; g.lineCap = 'round';
        g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 24; g.beginPath(); g.moveTo(x1, y1 + 6); g.quadraticCurveTo(mx, my + 6, x2, y2 + 6); g.stroke();
        g.strokeStyle = '#6d0b14'; g.lineWidth = 22; g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo(mx, my, x2, y2); g.stroke();
        g.strokeStyle = 'rgba(214,64,78,.55)'; g.lineWidth = 7; g.beginPath(); g.moveTo(x1, y1 - 5); g.quadraticCurveTo(mx, my - 5, x2, y2 - 5); g.stroke();
        g.strokeStyle = 'rgba(255,170,170,.22)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x1, y1 - 7); g.quadraticCurveTo(mx, my - 7, x2, y2 - 7); g.stroke();
        // los ganchos de latón de los extremos
        [[x1, y1], [x2, y2]].forEach(([a_, b_]) => { const rg = g.createRadialGradient(a_ - 2, b_ - 2, 1, a_, b_, 10); rg.addColorStop(0, '#fff3c8'); rg.addColorStop(1, '#8a6422'); g.fillStyle = rg; circ(g, a_, b_, 9); g.fill(); });
        g.restore();
      }
      const xPoste = j => CX + (j - st.p) * D;
      const nomDe = j => st.n ? st.items[((j % st.n) + st.n) % st.n] : '';

      function pintaFoco() {
        const a = st.foco * (1 + (mov ? .04 * Math.sin(st.t * 1.7) : 0));
        g.save(); g.globalCompositeOperation = 'lighter';
        let gr = g.createLinearGradient(0, -60, 0, SUELO);
        gr.addColorStop(0, `rgba(255,226,170,${.26 * a})`); gr.addColorStop(1, `rgba(255,214,150,${.08 * a})`);
        g.fillStyle = gr; g.beginPath(); g.moveTo(CX - 70, -60); g.lineTo(CX + 70, -60); g.lineTo(CX + 270, SUELO + 10); g.lineTo(CX - 270, SUELO + 10); g.closePath(); g.fill();
        gr = g.createRadialGradient(CX, SUELO + 8, 10, CX, SUELO + 8, 300); gr.addColorStop(0, `rgba(255,220,160,${.42 * a})`); gr.addColorStop(1, 'rgba(255,220,160,0)');
        g.save(); g.translate(CX, SUELO + 8); g.scale(1, .16); g.translate(-CX, -(SUELO + 8)); g.fillStyle = gr; circ(g, CX, SUELO + 8, 300); g.fill(); g.restore();
        if (st.luz > 0) { gr = g.createRadialGradient(CX, CY + CH / 2, 20, CX, CY + CH / 2, 420); gr.addColorStop(0, `rgba(255,214,140,${.38 * st.luz})`); gr.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gr; g.fillRect(CX - 420, CY - 300, 840, 840); }
        g.restore();
      }
      function pintaMotas(dt) {
        if (!mov) return;
        while (st.motas.length < 46) st.motas.push({ x: CX + (Math.random() - .5) * 360, y: Math.random() * SUELO, r: .6 + Math.random() * 1.7, v: 6 + Math.random() * 14, f: Math.random() * 6.3 });
        g.save(); g.globalCompositeOperation = 'lighter';
        st.motas.forEach(m => { m.y += m.v * dt * .4; m.x += Math.sin(st.t * .7 + m.f) * 10 * dt; if (m.y > SUELO) { m.y = -10; m.x = CX + (Math.random() - .5) * 300; }
          const ancho = 70 + 200 * (m.y + 60) / (SUELO + 60), den = Math.abs(m.x - CX) < ancho ? 1 : .15;
          g.fillStyle = `rgba(255,232,180,${clamp((.18 + .14 * Math.sin(st.t * 1.5 + m.f)) * den * (st.foco + st.luz * .6), 0, .7)})`; circ(g, m.x, m.y, m.r); g.fill(); });
        g.restore();
      }
      function pintaFila() {
        if (!poste) return;
        const j0 = Math.floor(st.p) - 3, j1 = Math.floor(st.p) + 3, v = Math.abs(st.vel), copias = v > 3 && mov ? Math.min(6, 1 + Math.floor(v / 3)) : 1;
        // primero los cordones (por detrás de los postes)
        for (let j = j0; j <= j1; j++) {
          const xa = xPoste(j) + 16, xb = xPoste(j + 1) - 16;
          if (st.elegido != null && (j === st.elegido || j + 1 === st.elegido) && st.suelta > 0) continue;
          cordon(xa, ARO, xb, ARO, COMBA);
        }
        // los cordones que se descuelgan: el gancho del poste elegido se suelta y el cordón cae al suelo, colgando del poste de al
        // lado (cae con su peso, rebota un poco y se queda tendido en la alfombra)
        if (st.elegido != null && st.suelta > 0) {
          const u = st.suelta, xe = xPoste(st.elegido);
          const cae = u < .42 ? Math.pow(u / .42, 2) : 1 - .07 * Math.sin(Math.PI * clamp((u - .42) / .22, 0, 1)) * (u < .64 ? 1 : 0);   // la caída y un botecito
          const lado = eo(u / .8, 2);
          [-1, 1].forEach(s => {
            const xf = xe + s * (D - 16), x0 = xe + s * 16, x1 = xf - s * 160;
            const x2 = lerp(x0, x1, lado), y2 = lerp(ARO, SUELO - 8, cae);
            const cx = lerp((xf + x0) / 2, xf - s * 26, lado), cy = lerp(ARO + 2 * COMBA, SUELO + 16, lado);
            cordon(xf, ARO, x2, y2, 0, 1, cx, cy);
          });
        }
        // los postes y sus cartelas
        for (let j = j0; j <= j1 + 1; j++) {
          const x = xPoste(j); if (x < -200 || x > 2120) continue;
          ponCapa(g, { c: poste.c, x: x - 40, y: 0, w: 80, h: 1080 });
          const nom = nomDe(j); if (!nom) continue;
          const cc = cartela(nom), elegido = st.elegido != null && j === st.elegido;
          for (let q = 0; q < copias; q++) {
            const dx = copias > 1 ? (q / copias) * st.vel * D / 60 * 1.6 : 0, a = copias > 1 ? Math.pow(1 - q / copias, 1.5) * 1.7 / copias : 1;
            g.save(); g.globalAlpha = Math.min(1, a); g.drawImage(cc.c, x - CW / 2 - 10 + dx, CY - 10, CW + 20, CH + 20); g.restore();
          }
          // el soporte de la cartela (dos patas cortas hasta el collar)
          g.fillStyle = '#6a4a18'; g.fillRect(x - 3, CY + CH - 2, 6, POSTE_ARR - (CY + CH) + 4);
          if (elegido && st.brillo >= 0 && st.brillo <= 1) {            // un destello que cruza la placa
            g.save(); rr(g, x - CW / 2 + 11, CY + 11, CW - 22, CH - 22, 6); g.clip(); g.globalCompositeOperation = 'lighter';
            const bx = x - CW / 2 - 80 + (CW + 160) * st.brillo, gr = g.createLinearGradient(bx - 60, 0, bx + 60, 0); gr.addColorStop(0, 'rgba(255,250,220,0)'); gr.addColorStop(.5, 'rgba(255,250,220,.55)'); gr.addColorStop(1, 'rgba(255,250,220,0)');
            g.fillStyle = gr; g.fillRect(bx - 60, CY, 120, CH); g.restore();
          }
          if (elegido && st.luz > 0) { g.save(); g.strokeStyle = `rgba(255,226,150,${.75 * st.luz})`; g.lineWidth = 3; g.shadowColor = 'rgba(255,200,110,.9)'; g.shadowBlur = 24 * st.luz; rr(g, x - CW / 2 - 2, CY - 2, CW + 4, CH + 4, 13); g.stroke(); g.restore(); }
        }
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra(); if (fijo) ponCapa(g, fijo);
        pintaFoco(); pintaFila();
        // el foco también da en el poste del medio (encima, muy suave)
        g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(CX, 470, 30, CX, 470, 330);
        gr.addColorStop(0, `rgba(255,220,160,${.10 * st.foco + .08 * st.luz})`); gr.addColorStop(1, 'rgba(255,220,160,0)'); g.fillStyle = gr; g.fillRect(CX - 340, 130, 680, 680); g.restore();
        pintaMotas(dt);
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.cordon.fuentes, () => { if (!vivo) return; cartelas.clear(); });

      /* los sonidos: el «tin» del latón al pasar cada poste, el golpe al parar, el gancho que se suelta y el gramófono */
      let tTin = 0;
      function tin(v) {
        const ac = A.ac; if (!ac) return; const t = ac.currentTime; if (t - tTin < .05) return; tTin = t;
        const f = 2300 + Math.random() * 900, gan = clamp(.05 + v * .006, .05, .11);
        A.nota(f, { tipo: 'triangle', dur: .35, gan, wet: .55 }); A.nota(f * 2.76, { tipo: 'sine', dur: .18, gan: gan * .5, wet: .5 });
        A.clic({ f: 4200, q: 3, gan: .12, dur: .02, wet: .3 });
      }
      function gramofono() {
        if (!A.ac) return;
        const cr = A.continuo({ f: 3200, q: .6, wet: .1 }); if (cr) { A.pon(cr.g.gain, .035, .05); setTimeout(() => cr.para(.8), 2200); }
        [[523.25, 0], [659.25, .14], [783.99, .28], [1046.5, .42]].forEach(([f, t]) => A.nota(f, { tipo: 'sawtooth', t, dur: 1.4 - t * .6, gan: .05, filtro: { tipo: 'bandpass', f: 1500, q: 1.1 }, wet: .6 }));
        [261.63, 329.63, 392].forEach(f => A.nota(f, { tipo: 'sawtooth', t: .42, dur: 1.9, gan: .035, filtro: { tipo: 'bandpass', f: 1100, q: .9 }, wet: .7 }));
      }

      return {
        ajusta,
        espera() { if (!st.n) { st.items = ['· · ·']; st.n = 1; } st.elegido = null; st.suelta = 0; st.luz = 0; st.brillo = -1; },
        async gira(bombo, k) {
          st.gen = (st.gen || 0) + 1;
          st.items = bombo.slice(); st.n = bombo.length; st.elegido = null; st.suelta = 0; st.luz = 0; st.brillo = -1; st.foco = .55;
          const n = st.n, p0 = Math.round(st.p); let p1 = p0 + (RM ? 6 : 26); p1 += ((k - p1) % n + n) % n;          // p1 ≡ k (mód. n)
          const f = recorrido(p0, p1, RM ? { T: 1.6, amago: .08, retro: 0, sobra: 0, rebote: .1, p: 2.2 } : { p: 2.4, amago: .3, retro: .3, sobra: .08, rebote: .24 });
          const ac = A.crea(), sala = ac ? A.continuo({ f: 260, q: .5, wet: .4 }) : null;
          if (ac) { A.nota(98, { tipo: 'sine', dur: 4.6, gan: .06, ataque: 1, wet: .5 }); A.nota(146.8, { tipo: 'triangle', dur: 4.4, gan: .03, ataque: 1.4, filtro: { f: 600 }, wet: .6, t: .2 }); }
          await new Promise(ok => {
            const t0 = performance.now(); let ult = Math.floor(p0 + .5), antes = p0;
            (function paso() {
              const t = (performance.now() - t0) / 1000, p = f(Math.min(t, f.T));
              st.vel = (p - antes) * 60; antes = p; st.p = p;
              const cel = Math.floor(p + .5); if (cel !== ult) { ult = cel; tin(Math.abs(st.vel)); }
              if (sala) { A.pon(sala.g.gain, clamp(Math.abs(st.vel) / 30, 0, 1) * .09, .05); A.pon(sala.f.frequency, 200 + 40 * Math.abs(st.vel), .05); }
              if (t < f.T) requestAnimationFrame(paso); else { st.p = p1; st.vel = 0; if (sala) sala.para(.3); ok(); }
            })();
          });
          // bajo el foco: el destello, y los dos cordones del elegido se sueltan
          st.elegido = p1;
          if (A.ac) { A.nota(70, { tipo: 'sine', dur: .5, gan: .35, desliza: 48 }); A.clic({ f: 900, q: 1.2, gan: .4, dur: .06, wet: .4 }); }
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 520; (function p_() { const u = clamp((performance.now() - t0) / d, 0, 1); st.foco = lerp(.55, 1, eo(u, 2)); st.brillo = u; if (u < 1) requestAnimationFrame(p_); else { st.brillo = -1; ok(); } })(); });
          if (A.ac) { [2637, 3520].forEach((fq, i) => A.nota(fq, { tipo: 'triangle', t: i * .09, dur: .5, gan: .09, wet: .6 })); A.clic({ f: 2000, q: 2, gan: .3, dur: .04, t: .02, wet: .5 }); }
          gramofono();
          // los cordones caen solos (sigue en el bucle); el nombre sale mientras caen
          const t0s = performance.now(), ds = RM ? 1 : 1500, gen = st.gen;
          (function p_() { if (!vivo || gen !== st.gen) return; const u = clamp((performance.now() - t0s) / ds, 0, 1); st.suelta = RM ? 1 : u; st.luz = eo(u * 2.2, 2); if (u < 1) requestAnimationFrame(p_); else st.luz = 1; })();
          await new Promise(ok => setTimeout(ok, RM ? 80 : 420));
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «dado» · Atonalidad · Capítulo 2 «Las puertas ALEATORIO y LIBRE» (de noche): el dado ──
     (22-oct-2026, v5) «La otra realidad: el mismo museo, por debajo»: paredes oscuras con grafitis de neón rosa y verde, suelo
     de damero que los refleja. Un dado de oro, con un nombre en cada cara, se lanza, rebota, rueda y se para con el elegido
     de cara; las caras que no se ven cambian de nombre mientras rueda. Al pararse, zumbido de neón y unas notas al azar. */
  TEMAS.dado = {
    fuentes: ['700 60px Poppins', '700 120px Poppins', '500 22px Poppins', '400 46px "A Dripping Marker"'],
    nombreFit: { min: 54 },
    css: `
.lmv-t-dado .lmv-velo{background:radial-gradient(ellipse at 50% 40%,rgba(12,22,26,.975) 0%,rgba(6,11,14,.988) 60%,rgba(2,4,6,.995) 100%)}
.lmv-t-dado .lmv-cab{top:30px}
.lmv-t-dado .lmv-ceja{font:400 46px/1 "A Dripping Marker",Poppins,sans-serif;letter-spacing:.08em;text-transform:none;color:#d4ffa0;text-shadow:0 0 8px rgba(150,255,80,.95),0 0 24px rgba(120,255,60,.6),0 0 50px rgba(120,255,60,.3)}
.lmv-t-dado .lmv-grupo{margin-top:6px;font:500 22px/1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:rgba(232,240,244,.7)}
.lmv-t-dado .lmv-nombre{top:786px;left:150px;right:150px;height:140px;display:flex;align-items:center;justify-content:center;font:700 112px/1.1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;letter-spacing:.01em;color:#ffe9f8;text-shadow:0 0 6px #ff4fd0,0 0 18px #ff2fc0,0 0 44px rgba(255,40,190,.75),0 0 90px rgba(255,40,190,.35)}
.lmv-t-dado .lmv-nota{top:940px;font:500 24px/1.3 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;color:#d8f7c4}
.lmv-t-dado .lmv-pie{bottom:38px}
.lmv-t-dado .lmv-b{display:inline-flex;align-items:center;gap:14px;padding:16px 36px;border-radius:12px;border:2px solid #ff5fd2;background:rgba(10,14,18,.86);color:#ffe9f8;font:600 27px/1 Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;box-shadow:0 0 18px rgba(255,60,200,.35);transition:background .2s,transform .15s}
.lmv-t-dado .lmv-b:hover{background:rgba(60,14,48,.9);transform:translateY(-2px)}
.lmv-t-dado .lmv-b.lmv-otra{border-color:#9dff4f;color:#0c1408;background:linear-gradient(#c7ff8a,#8de04a 60%,#5aa82a);box-shadow:0 0 22px rgba(140,255,70,.45)}
.lmv-t-dado .lmv-b.lmv-otra:hover{background:linear-gradient(#d6ffa4,#9ced58 60%,#68b834)}
.lmv-t-dado .lmv-cargando{color:#b6ff6a}
.lmv-of-dado .lmv-ob{font-family:Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;font-weight:600;border:2px solid #ff5fd2;border-radius:12px;background:rgba(10,14,18,.95);color:#ffe9f8;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 30px rgba(255,60,200,.45)}
.lmv-of-dado .lmv-og{font-family:Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;color:#c9ff96;text-shadow:0 0 10px rgba(140,255,70,.5)}
.lmv-of-dado .lmv-no{font-family:Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;color:rgba(255,220,245,.8)}
@media (prefers-reduced-motion:reduce){.lmv-t-dado .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const PO = (px, w) => `${w || 700} ${px}px Poppins, "Avenir Next", "Segoe UI", system-ui, sans-serif`;
      const H = 152, SUELO = 738, CX = 960, FP = 1900;       // medio lado del dado, línea del suelo, centro, focal
      const ROSA = '255,63,200', VERDE = '141,255,58';
      const st = { t: 0, items: [], n: 0, x: CX, alto: 0, R: [1, 0, 0, 0, 1, 0, 0, 0, 1], noms: ['· · ·', '· · ·', '· · ·', '· · ·', '· · ·', '· · ·'], neon: .5, flash: 0, gen: 0, chispas: [] };
      let fijo = null, raf = 0, vivo = true;
      const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.283); };

      /* las seis caras: esquinas (en el orden en que se lee: arriba-izq, arriba-dcha, abajo-dcha, abajo-izq) y su normal.
         La 0 es la de delante (la que mira a la cámara al acabar); la cámara mira hacia +z */
      const CARAS = [
        { c: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]], n: [0, 0, -1] },
        { c: [[1, -1, -1], [1, -1, 1], [1, 1, 1], [1, 1, -1]], n: [1, 0, 0] },
        { c: [[1, -1, 1], [-1, -1, 1], [-1, 1, 1], [1, 1, 1]], n: [0, 0, 1] },
        { c: [[-1, -1, 1], [-1, -1, -1], [-1, 1, -1], [-1, 1, 1]], n: [-1, 0, 0] },
        { c: [[-1, -1, 1], [1, -1, 1], [1, -1, -1], [-1, -1, -1]], n: [0, -1, 0] },
        { c: [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]], n: [0, 1, 0] }];
      const rota = (R, v) => [R[0] * v[0] + R[1] * v[1] + R[2] * v[2], R[3] * v[0] + R[4] * v[1] + R[5] * v[2], R[6] * v[0] + R[7] * v[1] + R[8] * v[2]];
      function eje(a, th) {                     // matriz de giro de th alrededor del eje unitario a (Rodrigues)
        const [x, y, z] = a, c = Math.cos(th), s = Math.sin(th), C = 1 - c;
        return [c + x * x * C, x * y * C - z * s, x * z * C + y * s, y * x * C + z * s, c + y * y * C, y * z * C - x * s, z * x * C - y * s, z * y * C + x * s, c + z * z * C];
      }
      const mult = (A, B) => [0, 1, 2].flatMap(i => [0, 1, 2].map(j => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
      const proy = (p, cx, cy) => { const s = FP / (FP + p[2]); return [CX + (cx - CX + p[0]) * s, cy + p[1] * s, s]; };
      const visible = (R, i) => rota(R, CARAS[i].n)[2] < -.02;

      /* lo que no se mueve: la pared con sus marcos apagados, los grafitis de neón y el damero */
      function pintaFijo(g) {
        const r = semilla(23);
        let gr = g.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, '#081114'); gr.addColorStop(1, '#0d1a1d'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 640);
        // marcos dorados apagados en la pared (la sala del museo, de noche)
        [[110, 120, 260, 330], [520, 150, 200, 260], [1200, 150, 200, 260], [1550, 120, 260, 330]].forEach(([x, y, w, h]) => {
          g.strokeStyle = 'rgba(160,130,70,.35)'; g.lineWidth = 14; g.strokeRect(x, y, w, h); g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 2; g.strokeRect(x + 9, y + 9, w - 18, h - 18);
          g.fillStyle = 'rgba(20,34,38,.9)'; g.fillRect(x + 10, y + 10, w - 20, h - 20); });
        // los grafitis: manchas de neón con sus chorretones
        const mancha = (x, y, s, col) => {
          g.save(); g.shadowColor = `rgba(${col},.9)`; g.shadowBlur = 26; g.fillStyle = `rgba(${col},.85)`;
          for (let i = 0; i < 14; i++) { circ(g, x + (r() - .5) * 120 * s, y + (r() - .5) * 70 * s, (8 + r() * 26) * s); g.fill(); }
          for (let i = 0; i < 7; i++) { const dx = x + (r() - .5) * 120 * s, l = (40 + r() * 170) * s, w = (3 + r() * 6) * s; g.fillRect(dx - w / 2, y, w, l); circ(g, dx, y + l, w * .9); g.fill(); }
          for (let i = 0; i < 26; i++) { circ(g, x + (r() - .5) * 300 * s, y + (r() - .5) * 200 * s, 1.5 + r() * 5 * s); g.fill(); }
          g.restore(); };
        mancha(330, 230, 1.1, ROSA); mancha(1660, 300, 1.2, VERDE); mancha(560, 470, .5, VERDE); mancha(1290, 470, .7, ROSA); mancha(120, 520, .55, VERDE);
        // flechas pintadas, como las del museo
        g.save(); g.shadowColor = `rgba(${VERDE},.9)`; g.shadowBlur = 18; g.strokeStyle = `rgba(${VERDE},.85)`; g.lineWidth = 10; g.lineCap = 'round';
        [[1470, 200], [1800, 140]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y + 120); g.lineTo(x, y); g.moveTo(x - 30, y + 34); g.lineTo(x, y); g.lineTo(x + 30, y + 34); g.stroke(); }); g.restore();
        // el zócalo
        g.fillStyle = '#05090b'; g.fillRect(0, 610, 1920, 34); g.fillStyle = 'rgba(180,150,90,.25)'; g.fillRect(0, 608, 1920, 3);
        // el damero en perspectiva (punto de fuga en el centro)
        const VY = 380, Y0 = 644;
        const xEn = (c, y) => CX + c * 120 * (y - VY) / (Y0 - VY) * .62;
        const filas = [Y0]; for (let k = 1, y = Y0; y < 1080; k++) { y += 10 + k * 9; filas.push(Math.min(y, 1080)); }
        for (let fi = 0; fi < filas.length - 1; fi++) for (let c = -40; c < 40; c++) {
          const y1 = filas[fi], y2 = filas[fi + 1], blanco = (fi + c) % 2 === 0;
          g.beginPath(); g.moveTo(xEn(c, y1), y1); g.lineTo(xEn(c + 1, y1), y1); g.lineTo(xEn(c + 1, y2), y2); g.lineTo(xEn(c, y2), y2); g.closePath();
          g.fillStyle = blanco ? '#c9cfd2' : '#0b0d10'; g.fill(); }
        gr = g.createLinearGradient(0, Y0, 0, 1080); gr.addColorStop(0, 'rgba(4,8,10,.82)'); gr.addColorStop(1, 'rgba(4,8,10,.45)'); g.fillStyle = gr; g.fillRect(0, Y0, 1920, 1080 - Y0);
        // reflejos del neón en el suelo
        g.save(); g.globalCompositeOperation = 'lighter';
        [[330, ROSA, .2], [1660, VERDE, .18], [1260, ROSA, .12]].forEach(([x, col, a]) => { const rg = g.createRadialGradient(x, 760, 10, x, 760, 380); rg.addColorStop(0, `rgba(${col},${a})`); rg.addColorStop(1, `rgba(${col},0)`);
          g.save(); g.translate(x, 760); g.scale(.6, 1); g.translate(-x, -760); g.fillStyle = rg; g.fillRect(x - 640, 640, 1280, 440); g.restore(); });
        g.restore();
        gr = g.createRadialGradient(CX, 560, 300, CX, 560, 1150); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.7)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) fijo = capaFija(L.k, pintaFijo); }

      /* el dado: sombra en el suelo, caras de oro (luz de arriba y reflejos de neón a los lados), aristas y el nombre de cada cara */
      function pintaDado() {
        const cy = SUELO - H - st.alto, R = st.R;
        // la sombra
        const sa = clamp(1 - st.alto / 700, .15, 1); g.save(); g.fillStyle = `rgba(0,0,0,${.55 * sa})`; g.beginPath(); g.ellipse(st.x, SUELO + 4, 190 * (.6 + .4 * sa), 30 * (.6 + .4 * sa), 0, 0, 6.283); g.fill(); g.restore();
        const lista = [];
        for (let i = 0; i < 6; i++) {
          const nr = rota(R, CARAS[i].n); if (nr[2] >= -.02) continue;
          const pts = CARAS[i].c.map(v => proy(rota(R, v.map(q => q * H)), st.x, cy));
          lista.push({ i, nr, pts });
        }
        lista.sort((a, b) => b.nr[2] - a.nr[2]);
        const luz = [.35, .75, .56];             // hacia dónde va la luz: viene de arriba, de la izquierda y de delante
        lista.forEach(({ i, nr, pts }) => {
          const dif = clamp(-(nr[0] * luz[0] + nr[1] * luz[1] + nr[2] * luz[2]), 0, 1), b = .42 + .62 * dif;
          g.save();
          g.beginPath(); pts.forEach((p, q) => q ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath();
          const gr = g.createLinearGradient(pts[0][0], pts[0][1], pts[2][0], pts[2][1]);
          gr.addColorStop(0, `rgb(${Math.round(255 * b)},${Math.round(222 * b)},${Math.round(140 * b)})`);
          gr.addColorStop(.55, `rgb(${Math.round(214 * b)},${Math.round(164 * b)},${Math.round(70 * b)})`);
          gr.addColorStop(1, `rgb(${Math.round(150 * b)},${Math.round(104 * b)},${Math.round(30 * b)})`);
          g.fillStyle = gr; g.fill(); g.clip();
          // reflejos de neón: rosa desde la izquierda, verde desde la derecha
          if (nr[0] < 0) { g.fillStyle = `rgba(${ROSA},${.28 * -nr[0] * st.neon})`; g.fill(); }
          if (nr[0] > 0) { g.fillStyle = `rgba(${VERDE},${.24 * nr[0] * st.neon})`; g.fill(); }
          // el nombre, en el plano de la cara (con sus cuatro puntos de dado en las esquinas)
          const [o_, a_, , d_] = pts, ex = [(a_[0] - o_[0]) / (2 * H), (a_[1] - o_[1]) / (2 * H)], ey = [(d_[0] - o_[0]) / (2 * H), (d_[1] - o_[1]) / (2 * H)], k = L.k || 1;
          g.setTransform(k * ex[0], k * ex[1], k * ey[0], k * ey[1], k * o_[0], k * o_[1]);
          g.fillStyle = 'rgba(30,18,4,.85)'; [[52, 52], [2 * H - 52, 52], [52, 2 * H - 52], [2 * H - 52, 2 * H - 52]].forEach(([x, y]) => { circ(g, x, y, 15); g.fill(); });
          const nom = st.noms[i] || '', Rt = rotula(g, PO, nom, 2 * H - 64, 2 * H - 120, 64, 30, true), lh = Rt.px * 1.04, y0 = H - (Rt.lineas.length - 1) * lh / 2 + Rt.px * .04;
          g.font = PO(Rt.px); g.textAlign = 'center'; g.textBaseline = 'middle';
          Rt.lineas.forEach((t, q) => { g.fillStyle = 'rgba(255,240,190,.45)'; textoCabe(g, t, H, y0 + q * lh + 2, 2 * H - 50); g.fillStyle = '#21160a'; textoCabe(g, t, H, y0 + q * lh, 2 * H - 50); });
          g.restore(); g.setTransform(k, 0, 0, k, 0, 0);
          // la arista
          g.beginPath(); pts.forEach((p, q) => q ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.lineJoin = 'round';
          g.strokeStyle = `rgba(255,236,180,${.35 + .4 * dif})`; g.lineWidth = 3; g.stroke();
        });
        // el destello al pararse
        if (st.flash > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const rg = g.createRadialGradient(st.x, cy, 20, st.x, cy, 520); rg.addColorStop(0, `rgba(${ROSA},${.45 * st.flash})`); rg.addColorStop(.5, `rgba(${VERDE},${.12 * st.flash})`); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(st.x - 520, cy - 520, 1040, 1040); g.restore(); }
      }
      function pintaChispas(dt) {
        if (!st.chispas.length) return;
        g.save(); g.globalCompositeOperation = 'lighter';
        st.chispas = st.chispas.filter(c => { c.v -= dt; if (c.v <= 0) return false; c.x += c.vx * dt; c.y += c.vy * dt; c.vy += 900 * dt; g.fillStyle = `rgba(${c.col},${clamp(c.v / .6, 0, 1)})`; circ(g, c.x, c.y, c.r); g.fill(); return true; });
        g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra(); if (fijo) ponCapa(g, fijo);
        // el neón de la pared parpadea un poco
        if (mov) { const p = .5 + .5 * Math.sin(st.t * 23) * Math.sin(st.t * 1.7); if (p > .97) { g.save(); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, 0, 1920, 640); g.restore(); } }
        pintaDado(); pintaChispas(dt);
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.dado.fuentes, () => {});

      /* los sonidos: el golpe del dado en el suelo, el rodar, el zumbido del neón y unas notas al azar (ALEATORIO) */
      function golpe(f) {
        if (!A.ac) return;
        A.clic({ f: 1100 + Math.random() * 500, q: 1.4, gan: .5 * f, dur: .05, wet: .35 });
        A.nota(130 + Math.random() * 40, { tipo: 'sine', dur: .16, gan: .4 * f, desliza: 70 });
        A.clic({ f: 3400, q: 3, gan: .16 * f, dur: .02, t: .03, wet: .3 });
      }
      function azar() {
        if (!A.ac) return;
        const zum = A.continuo({ f: 120, q: 2.5, tipo: 'bandpass', wet: .1 }); if (zum) { A.pon(zum.g.gain, .05, .03); setTimeout(() => zum.para(.6), 1400); }
        A.clic({ f: 5000, q: .8, gan: .3, dur: .05, wet: .4 });
        const usadas = new Set(); for (let i = 0; i < 6; i++) { let m; do { m = Math.floor(Math.random() * 12); } while (usadas.has(m) && usadas.size < 12); usadas.add(m);
          const f = 523.25 * Math.pow(2, (m + (i % 2 ? 12 : 0)) / 12) / (i < 3 ? 1 : 2); A.nota(f, { tipo: 'triangle', t: .06 + i * .13 + Math.random() * .04, dur: 1.4, gan: .06, wet: .8 }); A.nota(f * 4, { tipo: 'sine', t: .06 + i * .13, dur: .5, gan: .02, wet: .8 }); }
      }

      return {
        ajusta,
        espera() { st.flash = 0; },
        async gira(bombo, k) {
          const gen = ++st.gen; st.items = bombo.slice(); st.n = bombo.length; st.flash = 0; st.neon = .5;
          const n = st.n, T = RM ? 1.6 : T_GIRO, A0 = 520, X1 = 1560;
          // (vueltas enteras: empieza y acaba con la cara 0 de frente y derecha)
          const ejeG = (() => { const v = [.42, .62, .66], m = Math.hypot(...v); return v.map(q => q / m); })(), TH = RM ? 2 * Math.PI : 10 * Math.PI;
          const x0 = st.x;
          // dónde está el dado en cada momento: un salto hacia atrás, y luego la caída con botes hasta el centro
          const salto = RM ? 0 : .38;
          const pos = t => {
            if (t < salto) { const u = eo(t / salto, 2); return { x: lerp(x0, X1, u), alto: A0 * u, th: TH * .02 * u }; }
            const u = clamp((t - salto) / (T - salto), 0, 1), v = Math.pow(u, 1.4);
            const alto = RM ? 0 : A0 * Math.pow(1 - u, 2) * Math.abs(Math.sin(Math.PI * (v * 3.5 + .5)));
            return { x: lerp(X1, CX, 1 - Math.pow(1 - u, 2.2)), alto, th: TH * (.02 + .98 * (1 - Math.pow(1 - u, 2.3))) };
          };
          // qué cara se ve en cada momento → qué nombre lleva cada una (cambia cuando no se ve; la de delante acaba con el elegido)
          const Rde = th => eje(ejeG, TH - th);
          const pasos = [], DT = 1 / 120; for (let t = 0; t <= T + 1e-6; t += DT) pasos.push(Rde(pos(t).th));
          // la última vez que la cara 0 deja de verse: a partir de ahí lleva el nombre del elegido (y así vuelve a salir de frente)
          let ultOculta0 = -1; for (let s = 1; s < pasos.length; s++) if (visible(pasos[s - 1], 0) && !visible(pasos[s], 0)) ultOculta0 = s;
          let sig = Math.floor(Math.random() * n); const otro = () => { let q = 0, x; do { x = sig++ % n; } while (n > 1 && x === k && ++q < 3); return bombo[x]; };
          const plan = [0, 1, 2, 3, 4, 5].map(i => ({ i, veia: visible(pasos[0], i) }));
          st.noms = [0, 1, 2, 3, 4, 5].map(i => i === 0 ? (ultOculta0 < 0 ? bombo[k] : st.noms[0]) : otro());
          const ac = A.crea(), rueda = ac ? A.continuo({ f: 380, q: .9, wet: .25 }) : null;
          await new Promise(ok => {
            const t0 = performance.now(); let ultAlto = 0, baja = false, antesX = st.x;
            (function paso() {
              if (gen !== st.gen || !vivo) { if (rueda) rueda.para(.1); return ok(); }
              const t = Math.min((performance.now() - t0) / 1000, T), p = pos(t), s = Math.min(pasos.length - 1, Math.round(t / DT));
              st.x = p.x; st.alto = p.alto; st.R = pasos[s];
              plan.forEach(q => { const ve = visible(st.R, q.i); if (q.veia && !ve) st.noms[q.i] = (q.i === 0 && s >= ultOculta0) ? bombo[k] : otro(); q.veia = ve; });
              if (ultOculta0 >= 0 && s >= ultOculta0 && !visible(st.R, 0)) st.noms[0] = bombo[k];   // por si un fotograma se saltó el cambio
              // un golpe cada vez que toca el suelo
              if (t > salto) { if (p.alto < ultAlto) baja = true; else if (baja && p.alto > ultAlto) { baja = false; golpe(clamp(ultAlto + 60, 0, 500) / 500 + .25); } }
              if (t > salto && p.alto < 4 && ultAlto >= 4) golpe(.35);
              ultAlto = p.alto;
              if (rueda) { const v = Math.abs(st.x - antesX) * 60; A.pon(rueda.g.gain, (p.alto < 10 ? 1 : .25) * clamp(v / 900, 0, 1) * .14, .04); }
              antesX = st.x;
              if (t < T) requestAnimationFrame(paso); else { st.R = [1, 0, 0, 0, 1, 0, 0, 0, 1]; st.x = CX; st.alto = 0; st.noms[0] = bombo[k]; if (rueda) rueda.para(.15); ok(); }
            })();
          });
          if (gen !== st.gen) return;
          // se para: un pequeño vaivén sobre la arista, el destello, chispas de neón y las notas al azar
          golpe(.5); azar();
          if (!RM) for (let i = 0; i < 46; i++) { const a = Math.random() * 6.283, v = 300 + Math.random() * 700; st.chispas.push({ x: CX, y: SUELO - H, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 400, r: 1.5 + Math.random() * 3, v: .4 + Math.random() * .6, col: i % 2 ? ROSA : VERDE }); }
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 650; (function p_() { if (gen !== st.gen) return ok(); const u = clamp((performance.now() - t0) / d, 0, 1);
            st.R = RM ? st.R : eje([0, 0, 1], .09 * Math.exp(-5 * u) * Math.sin(u * 18)); st.flash = Math.sin(Math.PI * Math.min(1, u * 1.6)) * (1 - u * .4); st.neon = lerp(.5, 1.4, eo(u, 2));
            if (u < 1) requestAnimationFrame(p_); else { st.R = [1, 0, 0, 0, 1, 0, 0, 0, 1]; st.flash = .25; ok(); } })(); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «caza» · Magnetófono · Bobina 2 «A la caza de sonidos»: el plano del metro de París ──
     (22-oct-2026, v5) Odile sale a cazar sonidos por París (la estación de Saint-Lazare, Les Halles, un café de Saint-Germain,
     los muelles del Sena). Un plano del metro de 1948, en papel crema, con el Sena y esos cuatro sitios; los nombres son las
     estaciones de una línea circular. El vagón da vueltas, frena y se para en una: se enciende «● REC» y salen las ondas del
     sonido cazado. */
  TEMAS.caza = {
    fuentes: ['700 30px "Courier Prime"', '400 22px "Courier Prime"', '900 46px "Bodoni Moda"', '600 26px "Bodoni Moda"'],
    nombreFit: { min: 46 },
    css: `
.lmv-t-caza .lmv-velo{background:radial-gradient(ellipse at 50% 42%,rgba(40,32,24,.975) 0%,rgba(22,17,12,.988) 60%,rgba(8,6,4,.995) 100%)}
.lmv-t-caza .lmv-cab{top:26px}
.lmv-t-caza .lmv-ceja{font:900 40px/1 "Bodoni Moda","Didot",Georgia,serif;letter-spacing:.24em;text-transform:uppercase;color:#f3e7cd;text-shadow:0 2px 12px rgba(0,0,0,.85)}
.lmv-t-caza .lmv-grupo{margin-top:8px;font:400 22px/1 "Courier Prime","Courier New",Courier,monospace;letter-spacing:.06em;color:rgba(239,229,207,.75)}
.lmv-t-caza .lmv-nombre{top:820px;left:150px;right:150px;height:124px;display:flex;align-items:center;justify-content:center;font:700 100px/1.1 "Courier Prime","Courier New",Courier,monospace;color:#fff4dc;text-shadow:0 0 30px rgba(230,70,50,.45),0 5px 22px rgba(0,0,0,.9)}
.lmv-t-caza .lmv-nota{top:948px;font:italic 400 24px/1.3 "Courier Prime","Courier New",Courier,monospace;color:#efe5cf}
.lmv-t-caza .lmv-pie{bottom:30px}
.lmv-t-caza .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:14px 34px;border-radius:4px;border:2px solid #efe5cf;background:rgba(22,17,12,.88);color:#f4ecd8;font:700 26px/1 "Courier Prime","Courier New",Courier,monospace;letter-spacing:.06em;text-transform:uppercase;transition:background .2s,transform .15s}
.lmv-t-caza .lmv-b:hover{background:rgba(60,40,26,.92);transform:translateY(-2px)}
.lmv-t-caza .lmv-b.lmv-otra{background:linear-gradient(#f4ecd8,#e2d3b2);color:#1e1a16;border-color:#f4ecd8}
.lmv-t-caza .lmv-b.lmv-otra:hover{background:linear-gradient(#fff6e2,#eadcbc)}
.lmv-t-caza .lmv-cargando{color:#ff8a70}
.lmv-of-caza .lmv-ob{font-family:"Courier Prime","Courier New",Courier,monospace;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:2px solid #b8322a;border-radius:4px;background:linear-gradient(#f4ecd8,#e2d3b2);color:#1e1a16;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 0 4px rgba(184,50,42,.35)}
.lmv-of-caza .lmv-og,.lmv-of-caza .lmv-no{font-family:"Courier Prime","Courier New",Courier,monospace;color:#efe5cf}
@media (prefers-reduced-motion:reduce){.lmv-t-caza .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const CP = (px, w) => `${w || 700} ${px}px "Courier Prime", "Courier New", Courier, monospace`;
      const BO = (px, w, it) => `${it ? 'italic ' : ''}${w || 600} ${px}px "Bodoni Moda", Didot, Georgia, serif`;
      const PX = 150, PY = 104, PW = 1620, PH = 686;                 // la hoja del plano
      const CX = 960, CY = 446, RX = 560, RY = 236;                    // la línea circular
      const LINEA = '#b8322a', TINTA = '#1e1a16', PAPEL = '#efe5cf';
      const st = { items: [], n: 0, s: 0, vel: 0, t: 0, rec: 0, ondas: [], elegido: null, gen: 0 };
      let fijo = null, raf = 0, vivo = true;
      const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.283); };

      /* la elipse, recorrida a velocidad constante: tabla de longitud de arco */
      const TAB = (() => { const M = 720, a = [0]; let px = CX + RX, py = CY, l = 0; for (let i = 1; i <= M; i++) { const th = i / M * 6.2832, x = CX + RX * Math.cos(th), y = CY + RY * Math.sin(th); l += Math.hypot(x - px, y - py); a.push(l); px = x; py = y; } return { a, M, P: l }; })();
      function punto(fr) {                       // fr: fracción de vuelta (0..1) → x, y, ángulo de la tangente
        fr = ((fr % 1) + 1) % 1; const l = fr * TAB.P; let lo = 0, hi = TAB.M; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (TAB.a[m] < l) lo = m; else hi = m; }
        const u = (l - TAB.a[lo]) / ((TAB.a[hi] - TAB.a[lo]) || 1), th = (lo + u) / TAB.M * 6.2832;
        return { x: CX + RX * Math.cos(th), y: CY + RY * Math.sin(th), a: Math.atan2(RY * Math.cos(th), -RX * Math.sin(th)), th };
      }
      const OFF = .25;                            // la estación 0, abajo en el centro (un cuarto de vuelta)
      const estacion = i => punto(OFF + i / Math.max(1, st.n));

      /* el plano: papel, el Sena con sus puentes, calles, los cuatro sitios de la bobina y la rosa de los vientos */
      function pintaFijo(g) {
        const r = semilla(48);
        g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 50; g.shadowOffsetY = 20; g.fillStyle = PAPEL; g.fillRect(PX, PY, PW, PH); g.restore();
        let gr = g.createRadialGradient(CX, CY, 100, CX, CY, 1100); gr.addColorStop(0, '#f3ead6'); gr.addColorStop(1, '#d9c9a5'); g.fillStyle = gr; g.fillRect(PX, PY, PW, PH);
        g.save(); g.beginPath(); g.rect(PX, PY, PW, PH); g.clip();
        for (let i = 0; i < 2600; i++) { g.fillStyle = r() < .5 ? 'rgba(120,90,50,.06)' : 'rgba(255,255,255,.08)'; g.fillRect(PX + r() * PW, PY + r() * PH, 1 + r() * 2, 1 + r() * 2); }
        // las calles (líneas finas)
        g.strokeStyle = 'rgba(90,70,45,.13)'; g.lineWidth = 1.2;
        for (let i = 0; i < 46; i++) { const x = PX + r() * PW, y = PY + r() * PH, a = r() * 3.14, l = 160 + r() * 520; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
        // el Sena: una curva azul grisácea que cruza el plano, con sus puentes
        g.lineCap = 'round'; g.strokeStyle = '#9fb4c0'; g.lineWidth = 42;
        g.beginPath(); g.moveTo(PX - 20, PY + 520); g.bezierCurveTo(PX + 420, PY + 640, PX + 640, PY + 300, CX, PY + 380); g.bezierCurveTo(CX + 380, PY + 450, CX + 520, PY + 640, PX + PW + 20, PY + 560); g.stroke();
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.setLineDash([18, 22]); g.stroke(); g.setLineDash([]);
        [[PX + 300, PY + 572], [PX + 600, PY + 410], [CX + 210, PY + 412], [CX + 470, PY + 570]].forEach(([x, y]) => { g.fillStyle = '#d8c9a8'; g.fillRect(x - 6, y - 34, 12, 68); g.strokeStyle = 'rgba(80,60,40,.5)'; g.lineWidth = 1.5; g.strokeRect(x - 6, y - 34, 12, 68); });
        g.font = BO(22, 400, true); g.fillStyle = 'rgba(70,95,110,.85)'; g.textAlign = 'center'; g.fillText('la Seine', PX + 470, PY + 548);
        // los cuatro sitios de la bobina, con un dibujito
        const sitio = (x, y, txt, dib) => { g.save(); g.translate(x, y); g.strokeStyle = 'rgba(60,44,28,.75)'; g.fillStyle = 'rgba(60,44,28,.12)'; g.lineWidth = 2; dib(); g.restore();
          g.font = BO(19, 600, true); g.fillStyle = 'rgba(60,44,28,.8)'; g.textAlign = 'center'; g.fillText(txt, x, y + 44); };
        sitio(PX + 170, PY + 86, 'Gare Saint-Lazare', () => { g.beginPath(); g.rect(-40, -16, 80, 30); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-40, -16); g.lineTo(0, -34); g.lineTo(40, -16); g.stroke(); circ(g, 0, -2, 7); g.stroke(); });
        sitio(PX + PW - 190, PY + 80, 'Les Halles', () => { g.beginPath(); g.moveTo(-46, 14); g.lineTo(-46, -8); g.quadraticCurveTo(0, -38, 46, -8); g.lineTo(46, 14); g.closePath(); g.fill(); g.stroke(); for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 18, 14); g.lineTo(i * 18, -10 + Math.abs(i) * 4); g.stroke(); } });
        sitio(PX + 190, PY + PH - 98, 'Saint-Germain', () => { g.beginPath(); g.rect(-16, -30, 32, 44); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-16, -30); g.lineTo(0, -52); g.lineTo(16, -30); g.stroke(); });
        sitio(PX + PW - 200, PY + PH - 92, 'Les quais', () => { g.beginPath(); g.moveTo(-44, 6); g.lineTo(44, 6); g.lineTo(32, 18); g.lineTo(-32, 18); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0, 6); g.lineTo(0, -28); g.lineTo(22, -6); g.closePath(); g.stroke(); });
        // el título del plano
        g.font = BO(18, 600, true); g.fillStyle = 'rgba(60,44,28,.7)'; g.textAlign = 'left'; g.fillText('Métropolitain · Paris 1948', PX + 26, PY + PH - 20);
        g.restore();
        g.strokeStyle = 'rgba(60,44,28,.35)'; g.lineWidth = 2; g.strokeRect(PX + 10, PY + 10, PW - 20, PH - 20);
        // la línea circular, con su borde blanco
        g.lineWidth = 22; g.strokeStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.ellipse(CX, CY, RX, RY, 0, 0, 6.2832); g.stroke();
        g.lineWidth = 14; g.strokeStyle = LINEA; g.beginPath(); g.ellipse(CX, CY, RX, RY, 0, 0, 6.2832); g.stroke();
        // en el centro, el cartel art nouveau del Métropolitain
        g.save(); g.translate(CX, CY); g.fillStyle = 'rgba(46,74,58,.88)'; rr(g, -190, -44, 380, 88, 44); g.fill(); g.strokeStyle = '#d8c48e'; g.lineWidth = 3; rr(g, -182, -36, 364, 72, 36); g.stroke();
        g.font = BO(38, 600, true); g.fillStyle = '#f1dfa8'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Métropolitain', 0, 2); g.restore();
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) fijo = capaFija(L.k, pintaFijo); }

      /* las estaciones y sus rótulos (los de dentro y fuera alternan si hay muchas) */
      function pintaEstaciones() {
        const n = st.n; if (!n) return;
        const px = n > 16 ? 26 : n > 12 ? 30 : 34, dos = n > 14;
        for (let i = 0; i < n; i++) {
          const e = estacion(i), elegido = st.elegido === i, cerca = Math.max(0, 1 - Math.abs(((st.s - i) % n + n + n / 2) % n - n / 2) * 1.6);
          let ux = (e.x - CX) / (RX * RX), uy = (e.y - CY) / (RY * RY); const m = Math.hypot(ux, uy); ux /= m; uy /= m;
          const fuera = !dos || i % 2 === 0, sg = fuera ? 1 : -1, d = fuera ? 40 : 34;
          // el punto de la estación
          circ(g, e.x, e.y, 13); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 4; g.strokeStyle = TINTA; g.stroke();
          if (cerca > 0) { circ(g, e.x, e.y, 13 + 6 * cerca); g.strokeStyle = `rgba(184,50,42,${.8 * cerca})`; g.lineWidth = 3; g.stroke(); }
          // el rótulo
          const nom = st.items[i]; g.font = CP(px); const lin = (dos && nom.length > 11 && nom.includes(' ')) ? lineas(nom, Math.ceil(nom.length / 2) + 2, 2) : [nom];
          const w = Math.max(...lin.map(t => g.measureText(t).width)) + 22, h = lin.length * px * 1.08 + 12;
          let ax = e.x + ux * sg * d, ay = e.y + uy * sg * d;
          const bx = ax + (ux * sg > .35 ? 0 : ux * sg < -.35 ? -w : -w / 2), by = ay + (uy * sg > .35 ? 0 : uy * sg < -.35 ? -h : -h / 2);
          const luz = elegido ? st.rec : 0;
          g.save(); g.shadowColor = 'rgba(0,0,0,.25)'; g.shadowBlur = 6; g.shadowOffsetY = 2; rr(g, bx, by, w, h, 6);
          g.fillStyle = luz > 0 ? `rgb(${Math.round(lerp(255, 184, luz))},${Math.round(lerp(252, 50, luz))},${Math.round(lerp(244, 42, luz))})` : 'rgba(255,252,244,.96)'; g.fill(); g.restore();
          rr(g, bx, by, w, h, 6); g.lineWidth = 2; g.strokeStyle = luz > 0 ? '#7a1a14' : 'rgba(30,26,22,.55)'; g.stroke();
          g.fillStyle = luz > .5 ? '#fff6e6' : TINTA; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = CP(px);
          lin.forEach((t, q) => g.fillText(t, bx + w / 2, by + 6 + px * .56 + q * px * 1.08));
        }
      }
      /* el vagón (un Sprague verde y crema de los de entonces), mirando hacia donde va */
      function pintaVagon() {
        if (!st.n) return;
        const p = punto(OFF + st.s / st.n);
        g.save(); g.translate(p.x, p.y); g.rotate(p.a + (st.dir < 0 ? Math.PI : 0)); g.scale(1.25, 1.25);
        g.fillStyle = 'rgba(0,0,0,.3)'; rr(g, -40, -14, 84, 34, 9); g.fill();
        rr(g, -42, -18, 84, 34, 9); g.fillStyle = '#3f6b4c'; g.fill(); g.lineWidth = 2.5; g.strokeStyle = '#1d3326'; g.stroke();
        g.fillStyle = '#e8dcb8'; g.fillRect(-42, -2, 84, 6);
        g.fillStyle = '#cfe3e8'; [-30, -12, 6].forEach(x => { rr(g, x, -13, 13, 9, 2); g.fill(); });
        g.fillStyle = '#ffe9a0'; circ(g, 38, 0, 4.5); g.fill();
        if (mov && Math.abs(st.vel) > .3) { g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(52, 0, 2, 52, 0, 60); gr.addColorStop(0, 'rgba(255,230,160,.35)'); gr.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = gr; g.fillRect(40, -40, 80, 80); }
        g.restore();
      }
      function pintaRec(dt) {
        if (st.elegido == null || st.rec <= 0) return;
        const e = estacion(st.elegido);
        // las ondas del sonido cazado
        if (mov && st.rec > .5 && Math.random() < dt * 5) st.ondas.push({ r: 16, v: 1 });
        g.save(); st.ondas = st.ondas.filter(o => { o.r += 160 * dt; o.v -= dt * .9; if (o.v <= 0) return false; g.strokeStyle = `rgba(184,50,42,${.6 * o.v})`; g.lineWidth = 3; circ(g, e.x, e.y, o.r); g.stroke(); return true; });
        // «● REC», junto al punto
        const parp = RM ? 1 : (Math.sin(st.t * 6) > -.2 ? 1 : .35);
        g.globalAlpha = st.rec; g.fillStyle = 'rgba(30,26,22,.92)'; rr(g, CX - 64, CY + 64, 128, 44, 6); g.fill();
        g.fillStyle = `rgba(230,40,30,${parp})`; circ(g, CX - 34, CY + 86, 9); g.fill(); g.font = CP(26); g.fillStyle = '#f4ecd8'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('REC', CX - 16, CY + 87);
        g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra(); if (fijo) ponCapa(g, fijo);
        pintaRec(dt); pintaEstaciones(); pintaVagon();
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.caza.fuentes, () => { if (vivo) fijo = capaFija(L.k || 1, pintaFijo); });

      /* los sonidos: el «ding-dong» de las puertas, el motor que silba con la velocidad, las juntas de los raíles, el freno y el REC */
      function motor() {
        const ac = A.ac; if (!ac) return null;
        const os = ac.createOscillator(), os2 = ac.createOscillator(), fl = ac.createBiquadFilter(), gn = ac.createGain();
        os.type = 'sawtooth'; os2.type = 'square'; fl.type = 'bandpass'; fl.Q.value = 4; fl.frequency.value = 600; gn.gain.value = 0;
        os.connect(fl); os2.connect(fl); fl.connect(gn); gn.connect(A.via(1, .2)); os.start(); os2.start();
        return { pon(v) { const w = clamp(v, 0, 40); A.pon(os.frequency, 80 + w * 9, .06); A.pon(os2.frequency, 161 + w * 18, .06); A.pon(fl.frequency, 420 + w * 45, .06); A.pon(gn.gain, clamp(v / 10, 0, 1) * .05, .08); },
          para() { try { const t = ac.currentTime; gn.gain.cancelScheduledValues(t); gn.gain.setValueAtTime(gn.gain.value, t); gn.gain.linearRampToValueAtTime(0, t + .3); os.stop(t + .35); os2.stop(t + .35); } catch (e) {} } };
      }
      let tJ = 0;
      function junta(v) { const ac = A.ac; if (!ac) return; const t = ac.currentTime; if (t - tJ < .045) return; tJ = t; const g_ = clamp(.15 + v * .02, .15, .4); A.clic({ f: 900, q: 1.5, gan: g_, dur: .03 }); A.clic({ f: 700, q: 1.5, gan: g_ * .8, dur: .03, t: .07 }); }

      return {
        ajusta,
        espera() { if (!st.n) { st.items = ['· · ·']; st.n = 1; } },
        async gira(bombo, k) {
          const gen = ++st.gen; st.items = bombo.slice(); st.n = bombo.length; st.elegido = null; st.rec = 0; st.ondas = []; st.dir = 1;
          const n = st.n, s0 = Math.round(st.s);
          let s1 = s0 + (RM ? n : Math.max(2 * n, 18)); s1 += ((k - s1) % n + n) % n;
          const f = recorrido(s0, s1, RM ? { T: 1.6, amago: .08, retro: 0, sobra: 0, rebote: .1, p: 2.2 } : { p: 2.5, amago: .28, retro: .18, sobra: .05, rebote: .22 });
          const ac = A.crea(), mo = motor();
          if (ac) { A.nota(659.25, { tipo: 'triangle', dur: .5, gan: .1, wet: .4 }); A.nota(523.25, { tipo: 'triangle', t: .28, dur: .7, gan: .1, wet: .4 }); }
          await new Promise(ok => {
            const t0 = performance.now(); let ult = Math.floor(s0), antes = s0;
            (function paso() {
              if (gen !== st.gen || !vivo) { if (mo) mo.para(); return ok(); }
              const t = (performance.now() - t0) / 1000, s = f(Math.min(t, f.T)); st.vel = (s - antes) * 60; antes = s; st.s = s;
              const cel = Math.floor(s); if (cel !== ult) { ult = cel; junta(Math.abs(st.vel)); }
              if (mo) mo.pon(Math.abs(st.vel));
              if (t > f.T - 1.1 && !st.freno && ac) { st.freno = 1; A.nota(2300, { tipo: 'sine', dur: 1.1, gan: .035, desliza: 1500, wet: .3 }); A.nota(2900, { tipo: 'sine', dur: .9, gan: .02, desliza: 2100, t: .1, wet: .3 }); }
              if (t < f.T) requestAnimationFrame(paso); else { st.s = s1; st.vel = 0; st.freno = 0; if (mo) mo.para(); ok(); }
            })();
          });
          if (gen !== st.gen) return;
          // se para: las puertas («pschhh»), el REC que se enciende y las ondas
          st.elegido = ((s1 % n) + n) % n;
          if (A.ac) { const c = A.continuo({ f: 5200, q: .5, tipo: 'highpass', wet: .2 }); if (c) { A.pon(c.g.gain, .09, .02); setTimeout(() => c.para(.5), 260); }
            A.clic({ f: 1600, q: 2, gan: .45, dur: .05, t: .55 }); A.nota(1046.5, { tipo: 'square', t: .6, dur: .18, gan: .04, filtro: { f: 2400 } }); A.nota(1568, { tipo: 'square', t: .78, dur: .3, gan: .04, filtro: { f: 2600 } }); }
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 700; (function p_() { if (gen !== st.gen) return ok(); const u = clamp((performance.now() - t0) / d, 0, 1); st.rec = eo(u, 2); if (u < 1) requestAnimationFrame(p_); else ok(); })(); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «maquina» · Magnetófono · Bobina 3 «Concierto de ruidos»: la máquina de escribir de la radio ──
     (22-oct-2026, v5) El estudio de la radio, de noche: el guion de la emisión del «Concierto de ruidos» en una máquina de
     escribir. Teclea nombres a toda prisa, línea tras línea (con su «ding» y su retorno de carro), cada vez más despacio; el
     último lo escribe letra a letra, en tinta roja, y lo subraya. Se enciende «EN ANTENA». */
  TEMAS.maquina = {
    fuentes: ['700 44px "Courier Prime"', '400 24px "Courier Prime"', 'italic 400 24px "Courier Prime"', '900 34px "Bodoni Moda"', '600 28px "Bodoni Moda"'],
    nombreFit: { min: 46 },
    css: `
.lmv-t-maquina .lmv-velo{background:radial-gradient(ellipse at 50% 40%,rgba(36,26,18,.975) 0%,rgba(18,12,8,.988) 60%,rgba(6,4,3,.995) 100%)}
.lmv-t-maquina .lmv-cab{top:24px;display:flex;justify-content:center;align-items:baseline;gap:28px}
.lmv-t-maquina .lmv-ceja{font:900 34px/1 "Bodoni Moda","Didot",Georgia,serif;letter-spacing:.26em;text-transform:uppercase;color:#f3e7cd;text-shadow:0 2px 12px rgba(0,0,0,.85)}
.lmv-t-maquina .lmv-grupo{margin:0;font:400 22px/1 "Courier Prime","Courier New",Courier,monospace;letter-spacing:.06em;color:rgba(239,229,207,.75)}
.lmv-t-maquina .lmv-nombre{top:812px;left:150px;right:150px;height:124px;display:flex;align-items:center;justify-content:center;font:700 100px/1.1 "Courier Prime","Courier New",Courier,monospace;color:#fff1e2;text-shadow:0 0 28px rgba(220,40,30,.55),0 5px 22px rgba(0,0,0,.9)}
.lmv-t-maquina .lmv-nota{top:942px;font:italic 400 24px/1.3 "Courier Prime","Courier New",Courier,monospace;color:#efe5cf}
.lmv-t-maquina .lmv-pie{bottom:30px}
.lmv-t-maquina .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:14px 34px;border-radius:4px;border:2px solid #efe5cf;background:rgba(22,17,12,.88);color:#f4ecd8;font:700 26px/1 "Courier Prime","Courier New",Courier,monospace;letter-spacing:.06em;text-transform:uppercase;transition:background .2s,transform .15s}
.lmv-t-maquina .lmv-b:hover{background:rgba(60,40,26,.92);transform:translateY(-2px)}
.lmv-t-maquina .lmv-b.lmv-otra{background:#b3241c;border-color:#e2584c;color:#fff1e2}
.lmv-t-maquina .lmv-b.lmv-otra:hover{background:#c63026}
.lmv-t-maquina .lmv-cargando{color:#ff8a70}
.lmv-of-maquina .lmv-ob{font-family:"Courier Prime","Courier New",Courier,monospace;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:2px solid #e2584c;border-radius:4px;background:linear-gradient(#f4ecd8,#e2d3b2);color:#1e1a16;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 30px rgba(220,40,30,.3)}
.lmv-of-maquina .lmv-og,.lmv-of-maquina .lmv-no{font-family:"Courier Prime","Courier New",Courier,monospace;color:#efe5cf}
@media (prefers-reduced-motion:reduce){.lmv-t-maquina .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const CP = (px, w, it) => `${it ? 'italic ' : ''}${w || 700} ${px}px "Courier Prime", "Courier New", Courier, monospace`;
      const BO = (px, w) => `${w || 600} ${px}px "Bodoni Moda", Didot, Georgia, serif`;
      const SX = 540, SW = 840, MX = 620, YT = 500, LH = 56, PXN = 44;            // la hoja, el margen, la línea que se teclea
      const TINTA = '#1d1915', ROJO = '#b3241c';
      const CAB = [['RADIODIFFUSION FRANÇAISE', BO(28, 600), 46], ["Club d'Essai · 5 octobre 1948", CP(22, 400), 38], ['CONCERT DE BRUITS', BO(34, 900), 56], ['Al micrófono, para el concierto:', CP(24, 400, true), 60]];
      const st = { t: 0, lineas: [], scroll: 0, cabeza: MX, antena: 0, gen: 0, golpe: 0 };
      let fijo = null, raf = 0, vivo = true;
      const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.283); };

      /* la mesa de nogal con la luz del flexo, y la máquina (que no se mueve) */
      function pintaFijo(g) {
        const r = semilla(61);
        let gr = g.createLinearGradient(0, 0, 0, 1080); gr.addColorStop(0, '#2a1a10'); gr.addColorStop(1, '#140c07'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        for (let i = 0; i < 160; i++) { const y = r() * 1080, l = 200 + r() * 900, x = r() * 1920; g.strokeStyle = r() < .5 ? 'rgba(0,0,0,.18)' : 'rgba(255,200,140,.035)'; g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + l * .3, y + 6, x + l * .6, y - 6, x + l, y + (r() - .5) * 10); g.stroke(); }
        g.save(); g.globalCompositeOperation = 'lighter'; gr = g.createRadialGradient(780, 300, 40, 780, 300, 980); gr.addColorStop(0, 'rgba(255,190,110,.22)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080); g.restore();
        // bobinas y una taza en la mesa (sombras sugeridas)
        [[230, 760, 120], [1700, 330, 100]].forEach(([x, y, R]) => { g.fillStyle = 'rgba(0,0,0,.35)'; circ(g, x + 10, y + 14, R); g.fill(); gr = g.createRadialGradient(x - 30, y - 30, 10, x, y, R); gr.addColorStop(0, '#c9ccd0'); gr.addColorStop(1, '#55595e'); g.fillStyle = gr; circ(g, x, y, R); g.fill();
          g.fillStyle = '#2a1e16'; circ(g, x, y, R * .82); g.fill(); g.fillStyle = '#6b6f74'; circ(g, x, y, R * .3); g.fill(); g.fillStyle = '#20160f'; for (let i = 0; i < 3; i++) { const a = i * 2.094; circ(g, x + Math.cos(a) * R * .18, y + Math.sin(a) * R * .18, R * .07); g.fill(); } });
        g.fillStyle = 'rgba(0,0,0,.35)'; circ(g, 1690, 820, 74); g.fill(); g.fillStyle = '#e9e1cf'; circ(g, 1680, 806, 66); g.fill(); g.fillStyle = '#3b2414'; circ(g, 1680, 806, 52); g.fill();
        // la máquina de escribir, de frente: el rodillo, la cesta de las barras y el teclado
        const MY = 560;
        g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 40; g.shadowOffsetY = 18;
        g.beginPath(); g.moveTo(560, MY + 40); g.lineTo(1360, MY + 40); g.lineTo(1430, MY + 226); g.lineTo(490, MY + 226); g.closePath(); g.fillStyle = '#121214'; g.fill(); g.restore();
        gr = g.createLinearGradient(0, MY + 40, 0, MY + 226); gr.addColorStop(0, '#2a2b30'); gr.addColorStop(.5, '#141518'); gr.addColorStop(1, '#0c0c0e'); g.beginPath(); g.moveTo(560, MY + 40); g.lineTo(1360, MY + 40); g.lineTo(1430, MY + 226); g.lineTo(490, MY + 226); g.closePath(); g.fillStyle = gr; g.fill();
        g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.stroke();
        // la cesta de las barras (un abanico fino detrás de la guía)
        g.save(); g.translate(960, MY + 112); for (let i = -22; i <= 22; i++) { const a = -Math.PI / 2 + i * .055; g.strokeStyle = 'rgba(200,204,210,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(Math.cos(a) * 70, Math.sin(a) * 70); g.lineTo(Math.cos(a) * 100, Math.sin(a) * 100); g.stroke(); } g.restore();
        // el teclado: cuatro filas de teclas redondas con aro cromado
        const FIL = ['1234567890', 'AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN,;:'];
        FIL.forEach((f, fi) => { const y = MY + 150 + fi * 22, n = f.length, w = 640 + fi * 34, x0 = 960 - w / 2;
          for (let i = 0; i < n; i++) { const x = x0 + (i + .5) * w / n; g.fillStyle = '#9aa0a8'; circ(g, x, y, 11); g.fill(); g.fillStyle = '#0d0d10'; circ(g, x, y, 8.5); g.fill(); g.fillStyle = '#e8e2d2'; g.font = CP(10); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(f[i], x, y + .5); } });
        g.fillStyle = '#9aa0a8'; rr(g, 820, MY + 236 - 18, 280, 14, 7); g.fill();
        g.fillStyle = 'rgba(216,190,120,.8)'; g.font = BO(16, 600); g.textAlign = 'center'; g.fillText("STUDIO D'ESSAI", 960, MY + 132);
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) fijo = capaFija(L.k, pintaFijo); }

      /* la hoja (con el membrete de la emisión) y las líneas tecleadas; el rodillo y la guía, por delante */
      function pintaHoja() {
        const n = st.lineas.length, sc = st.scroll;
        // la hoja: sube con las líneas; arriba se pierde en la sombra
        const yBase = YT - sc * LH;              // dónde va la línea 0 de nombres
        // el membrete acaba una línea por encima de la primera de nombres
        let yCab = yBase - LH; for (let i = CAB.length - 1; i >= 0; i--) yCab -= CAB[i][2];
        const TOPE = 132, top = Math.max(TOPE, Math.min(yCab - 30, YT));
        g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 26; g.shadowOffsetY = 10; g.fillStyle = '#f2ead6'; g.fillRect(SX, top, SW, YT + 70 - top); g.restore();
        g.save(); g.beginPath(); g.rect(SX, TOPE, SW, YT + 70 - TOPE); g.clip();
        let gr = g.createLinearGradient(SX, 0, SX + SW, 0); gr.addColorStop(0, 'rgba(120,90,50,.10)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(120,90,50,.12)'); g.fillStyle = gr; g.fillRect(SX, top, SW, YT + 70 - top);
        // el membrete
        let y = yCab; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
        CAB.forEach(([t, f, h], i) => { y += h; g.font = f; g.fillStyle = i === 3 ? '#4a3f33' : TINTA; if (i === 3) { g.textAlign = 'left'; g.fillText(t, MX, y); g.textAlign = 'center'; } else g.fillText(t, SX + SW / 2, y); if (i === 2) { g.fillStyle = TINTA; g.fillRect(SX + SW / 2 - 150, y + 12, 300, 2); } });
        // las líneas tecleadas (la tinta, un poco irregular: cada letra con su peso)
        g.textAlign = 'left'; g.font = CP(PXN);
        st.lineas.forEach((ln, j) => {
          const yy = yBase + j * LH; if (yy < TOPE - 10 || yy > YT + 40) return;
          for (let c = 0; c < ln.hechas; c++) { const x = MX + c * PXN * .6; g.fillStyle = ln.rojo ? ROJO : TINTA; g.globalAlpha = ln.peso[c]; g.fillText(ln.txt[c], x, yy); }
          g.globalAlpha = 1;
          if (ln.sub > 0) { g.fillStyle = ROJO; for (let c = 0; c < ln.sub; c++) g.fillRect(MX + c * PXN * .6 + 1, yy + 10, PXN * .6 - 2, 3); }
        });
        // la sombra de arriba
        gr = g.createLinearGradient(0, TOPE, 0, TOPE + 170); gr.addColorStop(0, 'rgba(20,13,8,.96)'); gr.addColorStop(1, 'rgba(20,13,8,0)'); g.fillStyle = gr; g.fillRect(SX, TOPE, SW, 170);
        g.restore();
        // el rodillo, la barra del papel y la guía (que se mueve con lo que se teclea)
        gr = g.createLinearGradient(0, YT + 34, 0, YT + 86); gr.addColorStop(0, '#3a3b40'); gr.addColorStop(.45, '#0d0d0f'); gr.addColorStop(1, '#232428'); g.fillStyle = gr; rr(g, SX - 70, YT + 34, SW + 140, 52, 24); g.fill();
        [[SX - 96, 30], [SX + SW + 66, 30]].forEach(([x, w]) => { const kg = g.createLinearGradient(x, 0, x + w, 0); kg.addColorStop(0, '#6d7279'); kg.addColorStop(.5, '#e4e8ec'); kg.addColorStop(1, '#5d6268'); g.fillStyle = kg; rr(g, x, YT + 30, w, 60, 8); g.fill(); });
        g.fillStyle = '#c9ced4'; rr(g, SX - 40, YT + 22, SW + 80, 8, 4); g.fill();
        const hx = st.cabeza; g.fillStyle = '#d8dce0'; g.beginPath(); g.moveTo(hx - 12, YT + 92); g.lineTo(hx + 12, YT + 92); g.lineTo(hx, YT + 66); g.closePath(); g.fill();
        if (st.golpe > 0) { g.save(); g.globalAlpha = st.golpe * .8; g.fillStyle = 'rgba(230,234,240,.9)'; g.fillRect(hx - 2, YT + 18, 4, 34); g.restore(); }   // la barra que golpea
      }
      function pintaAntena() {
        const x = 1500, y = 110, w = 250, h = 72, a = st.antena, parp = RM ? 1 : .85 + .15 * Math.sin(st.t * 9);
        g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 20; rr(g, x, y, w, h, 10); g.fillStyle = '#1b1210'; g.fill(); g.restore();
        rr(g, x + 8, y + 8, w - 16, h - 16, 6); g.fillStyle = a > 0 ? `rgba(${Math.round(lerp(70, 230, a * parp))},${Math.round(lerp(20, 40, a))},${Math.round(lerp(18, 30, a))},1)` : '#3e1612'; g.fill();
        g.font = CP(28); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = a > .3 ? '#fff0e0' : 'rgba(255,220,200,.25)'; g.fillText('EN ANTENA', x + w / 2, y + h / 2 + 1);
        if (a > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, 260); gr.addColorStop(0, `rgba(255,60,40,${.35 * a * parp})`); gr.addColorStop(1, 'rgba(255,60,40,0)'); g.fillStyle = gr; g.fillRect(x - 160, y - 160, w + 320, h + 320); g.restore(); }
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt; st.golpe = Math.max(0, st.golpe - dt * 9);
        L.borra(); if (fijo) ponCapa(g, fijo);
        pintaHoja(); pintaAntena();
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.maquina.fuentes, () => { if (vivo) fijo = capaFija(L.k || 1, pintaFijo); });

      /* los sonidos: cada tecla, el retorno del carro con su campanilla, la tinta roja y la sintonía de la radio */
      let tTec = 0;
      function tecla(rapido) {
        const ac = A.ac; if (!ac) return; const t = ac.currentTime; if (t - tTec < (rapido ? .028 : .01)) return; tTec = t;
        A.clic({ f: 2000 + Math.random() * 1400, q: .9, gan: rapido ? .22 : .38, dur: .03, wet: .25, pan: (Math.random() - .5) * .3 });
        if (!rapido) A.nota(110 + Math.random() * 30, { tipo: 'sine', dur: .06, gan: .25 });
      }
      function carro(con) {
        if (!A.ac) return;
        const c = A.continuo({ f: 1400, q: 1.2, wet: .2 }); if (c) { A.pon(c.g.gain, .08, .02); A.pon(c.f.frequency, 700, .16); setTimeout(() => c.para(.08), 150); }
        if (con) A.nota(2093, { tipo: 'sine', dur: 1.3, gan: .07, wet: .5 });
      }

      return {
        ajusta,
        espera() { st.antena = 0; },
        async gira(bombo, k) {
          const gen = ++st.gen; st.antena = 0;
          const n = bombo.length, otros = []; for (let i = 0; i < n; i++) if (i !== k) otros.push(i);
          for (let i = otros.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [otros[i], otros[j]] = [otros[j], otros[i]]; }
          const lista = otros.slice(0, RM ? 1 : 7).map(i => bombo[i]).concat([bombo[k]]);
          // la velocidad de cada línea: deprisa al principio, despacio al final (el último, letra a letra); ajustada a ~4,6 s
          const m = lista.length - 1, cps0 = lista.map((t, j) => lerp(70, 6.5, Math.pow(m ? j / m : 1, 2.1)));
          const crDe = c => clamp(2.4 / c, .05, .28), TOT = RM ? 1.5 : 4.6;
          const base = lista.reduce((s, t, j) => s + t.length / cps0[j], 0), crT = cps0.reduce((s, c) => s + crDe(c), 0);
          const lam = clamp(base / Math.max(.6, TOT - crT), .4, 4), cps = cps0.map(c => c * lam);
          // la hoja: lo de antes sube una línea en blanco y se empieza
          const off = st.lineas.length ? st.lineas.length + 1 : 0;
          const nuevas = lista.map((t, j) => ({ txt: Array.from(t), hechas: 0, rojo: j === m, peso: Array.from(t).map(() => .78 + Math.random() * .22), sub: 0 }));
          if (st.lineas.length) st.lineas.push({ txt: [], hechas: 0, peso: [], sub: 0 });
          st.lineas = st.lineas.concat(nuevas);
          const ac = A.crea();
          await new Promise(ok => {
            // si ya había algo escrito, primero un retorno de carro hasta la línea nueva (j = -1 → 0)
            let j = off ? -1 : 0, c = 0, fase = off ? 'carro' : 'teclea', tF = performance.now(), sc0 = st.scroll, cab0 = st.cabeza;
            const linea = () => st.lineas[off + j];
            (function paso() {
              if (gen !== st.gen || !vivo) return ok();
              const ahora = performance.now();
              if (fase === 'teclea') {
                const ln = linea(), dtc = 1000 / cps[j];
                while (c < ln.txt.length && ahora - tF >= dtc) { tF += dtc; c++; ln.hechas = c; st.cabeza = MX + c * PXN * .6; st.golpe = 1; if (ln.txt[c - 1] !== ' ') tecla(cps[j] > 30); }
                if (c >= ln.txt.length) {
                  if (j >= m) { ok(); return; }
                  fase = 'carro'; tF = ahora; sc0 = st.scroll; cab0 = st.cabeza; carro(j >= m - 2 || Math.random() < .3);
                }
              } else {
                const d = (j < 0 ? .3 : crDe(cps[j])) * 1000, u = clamp((ahora - tF) / d, 0, 1);
                st.scroll = sc0 + (off + j + 1 - sc0) * eo(u, 2); st.cabeza = lerp(cab0, MX, eo(u, 3));
                if (u >= 1) { j++; c = 0; fase = 'teclea'; tF = ahora; if (j === m && A.ac) A.clic({ f: 800, q: 2, gan: .35, dur: .05 }); }   // la cinta roja
              }
              requestAnimationFrame(paso);
            })();
          });
          if (gen !== st.gen) return;
          // el subrayado, en rojo, y «EN ANTENA» con la sintonía
          const ln = st.lineas[off + m], nn = ln.txt.length;
          if (A.ac) { A.nota(2093, { tipo: 'sine', dur: 1.4, gan: .08, wet: .5 }); [[523.25, 0], [659.25, .16], [783.99, .32], [1046.5, .5]].forEach(([f, t]) => { A.nota(f, { tipo: 'square', t: t + .1, dur: .55, gan: .035, filtro: { f: 1800 }, wet: .5 }); A.nota(f / 2, { tipo: 'triangle', t: t + .1, dur: .6, gan: .05, wet: .5 }); }); }
          const t0 = performance.now(), dSub = RM ? 1 : 420, dAnt = RM ? 1 : 600;
          (function p_() { if (gen !== st.gen || !vivo) return; const u = clamp((performance.now() - t0) / dSub, 0, 1), v = clamp((performance.now() - t0) / dAnt, 0, 1);
            const s_ = Math.floor(u * nn); if (s_ > ln.sub) { ln.sub = s_; st.cabeza = MX + s_ * PXN * .6; st.golpe = .6; tecla(true); } st.antena = eo(v, 2);
            if (u < 1 || v < 1) requestAnimationFrame(p_); else { ln.sub = nn; st.antena = 1; } })();
          await new Promise(ok => setTimeout(ok, RM ? 60 : 380));
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «arbol» · Acústica · Día 1 «El silencio»: el árbol que cae ──
     (22-oct-2026, v5) El lago de la cabaña al amanecer: la niebla, las montañas nevadas, el bosque y el sol bajo. En la orilla
     de enfrente, un pino por alumno, con su nombre en una tablilla de madera al borde del agua. Una ráfaga de viento recorre
     la orilla de un lado a otro (cada pino se mece cuando le llega y su tablilla se enciende), vuelve, frena y se queda en uno:
     ese pino cruje, se parte y cae al lago, con su salpicadura, sus ondas y los pájaros que salen volando. Y luego, silencio
     («si un árbol cae en el bosque y nadie lo oye…»). */
  TEMAS.arbol = {
    fuentes: ['200 112px Jost', '300 22px Jost', '500 26px Jost'],
    nombreFit: { min: 54 },
    css: `
.lmv-t-arbol .lmv-velo{background:linear-gradient(#141d33,#0e1422 55%,#070a12)}
.lmv-t-arbol .lmv-cab{top:38px}
.lmv-t-arbol .lmv-ceja{font:300 20px/1 Jost,system-ui,sans-serif;letter-spacing:.5em;text-transform:uppercase;color:rgba(255,246,222,.88);text-shadow:0 2px 10px rgba(0,0,0,.55)}
.lmv-t-arbol .lmv-grupo{margin-top:12px;font:300 18px/1 Jost,system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:rgba(255,246,222,.62);text-shadow:0 2px 10px rgba(0,0,0,.55)}
.lmv-t-arbol .lmv-nombre{top:100px;left:100px;right:100px;height:176px;display:flex;align-items:center;justify-content:center;font:200 112px/1.1 Jost,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#fff;text-shadow:0 0 38px rgba(255,190,110,.55),0 4px 24px rgba(8,10,20,.85)}
.lmv-t-arbol .lmv-nota{top:900px;font:300 20px/1.3 Jost,system-ui,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,246,222,.78);text-shadow:0 2px 10px rgba(0,0,0,.8)}
.lmv-t-arbol .lmv-pie{bottom:44px}
.lmv-t-arbol .lmv-b{display:inline-flex;align-items:center;gap:.8em;padding:20px 34px;border-radius:9px;border:1px solid rgba(255,246,222,.75);background:rgba(10,16,28,.55);color:#fff6de;font:300 22px/1 Jost,system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;transition:background .15s,border-color .15s}
.lmv-t-arbol .lmv-b:hover{background:rgba(255,246,222,.16);border-color:#fff}
.lmv-t-arbol .lmv-b.lmv-otra{background:#ffbe60;border-color:#ffbe60;color:#201608;font-weight:400}
.lmv-t-arbol .lmv-b.lmv-otra:hover{background:#ffd08a}
.lmv-t-arbol .lmv-cargando{color:#ffbe60}
.lmv-of-arbol .lmv-ob{font-family:Jost,system-ui,sans-serif;font-weight:300;letter-spacing:.08em;border:1px solid rgba(255,214,150,.85);border-radius:9px;background:linear-gradient(rgba(24,32,54,.94),rgba(12,18,32,.94));color:#fff6de;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 46px rgba(255,190,96,.18)}
.lmv-of-arbol .lmv-og,.lmv-of-arbol .lmv-no{font-family:Jost,system-ui,sans-serif;color:#fff1d8}
@media (prefers-reduced-motion:reduce){.lmv-t-arbol .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const JO = (px, w) => `${w || 500} ${px}px Jost, system-ui, sans-serif`;
      const WL = 646, YB = WL - 12, X0 = 150, X1 = 1770, SOL = { x: 430, y: 468 };
      const P = .55, ALFA = .7, TH_F = 1.62;   // el lago, visto un poco desde arriba · la caída, casi de lado · tumbado (≈ 94°)
      const st = { items: [], n: 0, arb: [], s: -1.6, v: 0, t: 0, gen: 0, elegido: -1, caido: null, empuje: null, luzFin: 0,
        part: [], ondas: [], gotas: [], pajaros: [], bruma: null };
      let fijo = null, lago = null, niebla = null, raf = 0, vivo = true;
      const paso = () => (X1 - X0) / Math.max(1, st.n);
      const xDe = s => X0 + (s + .5) * paso();
      const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
      const mezcla = (a, b, u) => { const p = hex(a), q = hex(b); return 'rgb(' + p.map((v, i) => Math.round(lerp(v, q[i], clamp(u, 0, 1)))).join(',') + ')'; };

      /* ── el paisaje (lo que no se mueve): cielo, sol, montañas, bosque, la orilla y el lago ── */
      function cresta(sem, base, picos, hmin, hmax, wmin, wmax) {
        const r = semilla(sem), ps = [];
        for (let j = 0; j < picos; j++) ps.push({ x: -120 + r() * 2160, h: hmin + r() * (hmax - hmin), w: wmin + r() * (wmax - wmin), q: 1 + r() * .7 });
        const pts = []; let ru = 0;
        for (let x = -24; x <= 1944; x += 6) {
          let h = 18 + 10 * Math.sin(x * .011 + sem);
          ps.forEach(p => { const d = Math.abs(x - p.x) / p.w; if (d < 1) h = Math.max(h, p.h * Math.pow(1 - d, p.q)); });
          ru = ru * .65 + (r() - .5) * 8; pts.push([x, base - h - ru * clamp(h / hmax, .15, 1)]);
        }
        pts.picos = ps;
        return pts;
      }
      const silueta = (g, pts, base) => { g.beginPath(); g.moveTo(-30, base + 60); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(1950, base + 60); g.closePath(); };
      function monte(g, pts, base, c0, c1, nieve, T) {
        silueta(g, pts, base); let gr = g.createLinearGradient(0, base - 280, 0, base); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fill();
        g.save(); silueta(g, pts, base); g.clip();
        if (nieve) {
          const r = semilla(base | 0);
          g.beginPath(); pts.forEach(([x, y], j) => j ? g.lineTo(x, y) : g.moveTo(x, y));
          for (let j = pts.length - 1; j >= 0; j--) { const [x, y] = pts[j]; g.lineTo(x, y + Math.max(0, base - y - T) * .55 * (.7 + r() * .6)); }
          g.closePath(); gr = g.createLinearGradient(0, 0, 1920, 0); gr.addColorStop(0, '#fff0dc'); gr.addColorStop(.35, '#f2ece6'); gr.addColorStop(1, '#c9cfdf'); g.fillStyle = gr; g.fill();
        }
        // cada pico: la cara que mira al sol (a la izquierda), más cálida; la otra, en sombra
        pts.picos.forEach((p, n_) => {
          let ap = null; pts.forEach(q => { if (Math.abs(q[0] - p.x) < p.w * .25 && (!ap || q[1] < ap[1])) ap = q; });
          if (!ap || base - ap[1] < 34) return;
          const r = semilla(n_ * 31 + 7), cara = sg => {
            g.beginPath(); g.moveTo(ap[0], ap[1]); let hondo = ap[1], xf = ap[0];
            const lado = pts.filter(q => sg > 0 ? q[0] > ap[0] && q[0] < ap[0] + p.w : q[0] < ap[0] && q[0] > ap[0] - p.w);
            if (sg < 0) lado.reverse();
            for (const q of lado) { if (q[1] < hondo - 10) break; hondo = Math.max(hondo, q[1]); g.lineTo(q[0], q[1]); xf = q[0]; }
            g.lineTo(xf, base + 60); const xb = ap[0] + sg * p.w * (.1 + r() * .1); g.lineTo(xb, base + 60);
            for (let j = 1; j <= 9; j++) { const u = j / 9; g.lineTo(lerp(xb, ap[0], u) + (r() - .5) * 10 * (1 - u), lerp(base + 60, ap[1], u)); }
            g.closePath();
          };
          cara(1); g.fillStyle = 'rgba(30,32,62,.3)'; g.fill();
          cara(-1); g.fillStyle = 'rgba(255,204,150,.12)'; g.fill();
        });
        g.restore();
      }
      function bosque(g, pts, base, sem, col, dens) {
        const r = semilla(sem);
        pts.forEach(([x, y]) => {
          for (let yy = y + 8 + r() * 10; yy < base + 24; yy += 7 + r() * 6) {
            if (r() > dens) continue;
            const h = 11 + r() * 14 + (yy - y) * .04, w = h * .42, xx = x + (r() - .5) * 6;
            g.fillStyle = col; g.beginPath(); g.moveTo(xx, yy - h); g.lineTo(xx + w / 2, yy); g.lineTo(xx - w / 2, yy); g.closePath(); g.fill();
          }
        });
      }
      const LEJOS = cresta(7, 566, 9, 110, 268, 170, 360), CERCA = cresta(19, 604, 11, 50, 150, 120, 300);
      function pintaFijo(g) {
        const r = semilla(61);
        // el cielo del amanecer y el sol
        let gr = g.createLinearGradient(0, 0, 0, WL);
        gr.addColorStop(0, '#141e36'); gr.addColorStop(.3, '#2d3c60'); gr.addColorStop(.58, '#7a6c86'); gr.addColorStop(.8, '#d5986e'); gr.addColorStop(1, '#f5cf95');
        g.fillStyle = gr; g.fillRect(0, 0, 1920, WL);
        gr = g.createRadialGradient(SOL.x, SOL.y, 4, SOL.x, SOL.y, 640); gr.addColorStop(0, 'rgba(255,248,226,.98)'); gr.addColorStop(.05, 'rgba(255,228,176,.8)'); gr.addColorStop(.22, 'rgba(255,192,122,.3)'); gr.addColorStop(1, 'rgba(255,170,100,0)');
        g.fillStyle = gr; g.fillRect(0, 0, 1920, WL);
        for (let j = 0; j < 10; j++) {         // nubes finas, encendidas por debajo
          const x = r() * 1920, y = 190 + r() * 210, w = 240 + r() * 520, h = 7 + r() * 12;
          g.save(); g.translate(x, y); g.scale(1, h / w * 2); gr = g.createRadialGradient(0, 0, 0, 0, 0, w / 2);
          gr.addColorStop(0, `rgba(255,${200 + Math.round(r() * 30)},160,${.16 + r() * .12})`); gr.addColorStop(1, 'rgba(255,214,170,0)'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, w / 2, 0, 6.283); g.fill(); g.restore();
        }
        // las montañas: las nevadas, lejos; las del bosque, más cerca; la bruma entre ellas
        monte(g, LEJOS, 566, '#9aa0bb', '#6d7590', true, 158);
        gr = g.createLinearGradient(0, 430, 0, 600); gr.addColorStop(0, 'rgba(255,222,186,0)'); gr.addColorStop(1, 'rgba(255,220,182,.42)'); g.fillStyle = gr; g.fillRect(0, 430, 1920, 170);
        monte(g, CERCA, 604, '#566079', '#343e52', false, 0);
        g.save(); silueta(g, CERCA, 604); g.clip(); bosque(g, CERCA, 604, 23, 'rgba(24,36,34,.85)', .8); g.restore();
        gr = g.createLinearGradient(0, 520, 0, 640); gr.addColorStop(0, 'rgba(255,226,190,0)'); gr.addColorStop(.7, 'rgba(255,224,186,.36)'); gr.addColorStop(1, 'rgba(255,232,200,.2)'); g.fillStyle = gr; g.fillRect(0, 520, 1920, 120);
        // el bosque de la orilla de enfrente (detrás de los pinos con nombre)
        for (let x = -10; x < 1930; x += 7 + r() * 5) {
          const h = 30 + r() * 58, y = 632 + r() * 6, w = h * .4;
          g.fillStyle = `rgba(${18 + Math.round(r() * 10)},${30 + Math.round(r() * 10)},${26 + Math.round(r() * 8)},.96)`;
          g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + w / 2, y); g.lineTo(x - w / 2, y); g.closePath(); g.fill();
          g.strokeStyle = 'rgba(255,200,130,.22)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x - w / 2, y); g.stroke();
        }
        // la orilla
        gr = g.createLinearGradient(0, 624, 0, WL); gr.addColorStop(0, '#2a3020'); gr.addColorStop(1, '#151a12'); g.fillStyle = gr; g.fillRect(0, 624, 1920, WL - 624 + 1);
        g.fillStyle = 'rgba(255,206,140,.22)'; g.fillRect(0, 624, 1920, 1.5);
        // el lago: el cielo al revés, las montañas reflejadas y la columna de luz del sol
        gr = g.createLinearGradient(0, WL, 0, 1080); gr.addColorStop(0, '#e2b68a'); gr.addColorStop(.17, '#b08a7e'); gr.addColorStop(.42, '#5d6584'); gr.addColorStop(1, '#10182a');
        g.fillStyle = gr; g.fillRect(0, WL, 1920, 1080 - WL);
        g.save(); g.beginPath(); g.rect(0, WL, 1920, 1080 - WL); g.clip(); g.translate(0, 2 * WL + 20); g.scale(1, -1);
        g.globalAlpha = .3; monte(g, LEJOS, 566, '#9aa0bb', '#6d7590', true, 158); g.globalAlpha = .42; monte(g, CERCA, 604, '#4a5470', '#2c3446', false, 0); g.restore();
        gr = g.createRadialGradient(SOL.x, WL, 10, SOL.x, WL, 420); gr.addColorStop(0, 'rgba(255,226,170,.55)'); gr.addColorStop(1, 'rgba(255,214,160,0)');
        g.save(); g.translate(SOL.x, WL); g.scale(.42, 1); g.translate(-SOL.x, -WL); g.fillStyle = gr; g.fillRect(SOL.x - 420, WL, 840, 440); g.restore();
        // en primer plano, en las esquinas: piedras, hierba y pinos pequeños, a contraluz
        const esquina = (x0, x1, sg) => {
          for (let j = 0; j < 7; j++) { const x = x0 + r() * (x1 - x0), y = 1010 + r() * 60, w = 70 + r() * 150, h = 34 + r() * 60;
            g.fillStyle = `rgba(${10 + Math.round(r() * 8)},${13 + Math.round(r() * 8)},${16 + Math.round(r() * 8)},.97)`; g.beginPath(); g.ellipse(x, y, w / 2, h / 2, (r() - .5) * .3, Math.PI, 0); g.lineTo(x + w / 2, 1090); g.lineTo(x - w / 2, 1090); g.closePath(); g.fill();
            g.strokeStyle = 'rgba(255,196,130,.16)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, w / 2, h / 2, 0, Math.PI * 1.05, Math.PI * 1.55); g.stroke(); }
          for (let j = 0; j < 5; j++) { const x = x0 + r() * (x1 - x0), h = 70 + r() * 150, y = 1050 + r() * 30, w = h * .42;
            g.fillStyle = '#0a0f0c'; for (let q = 0; q < 5; q++) { const yy = y - q * h / 5.5, ww = w * (1 - q / 5.5); g.beginPath(); g.moveTo(x, yy - h / 3.4); g.lineTo(x + ww / 2, yy); g.lineTo(x - ww / 2, yy); g.closePath(); g.fill(); } }
          g.strokeStyle = 'rgba(14,18,14,.95)'; g.lineWidth = 2;
          for (let j = 0; j < 70; j++) { const x = x0 + r() * (x1 - x0), y = 1080, h = 20 + r() * 50; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + sg * 6, y - h * .6, x + sg * (4 + r() * 16), y - h); g.stroke(); }
        };
        esquina(-40, 380, 1); esquina(1540, 1960, -1);
      }
      // el agua: rayas de luz que rompen los reflejos, y más oscura cuanto más cerca
      function pintaLago(g) {
        const r = semilla(83);
        for (let j = 0; j < 260; j++) {
          const y = WL + 4 + Math.pow(r(), 1.7) * (1080 - WL), x = r() * 1920, w = 30 + r() * 320 * (1 - (y - WL) / 700), cl = r() < .7;
          g.fillStyle = cl ? `rgba(255,240,214,${.05 + r() * .09})` : `rgba(18,22,40,${.06 + r() * .1})`; g.fillRect(x, y, w, 1 + r() * 1.6 + (y - WL) / 260);
        }
        const gr = g.createLinearGradient(0, WL, 0, 1080); gr.addColorStop(0, 'rgba(12,16,30,0)'); gr.addColorStop(1, 'rgba(10,14,26,.42)'); g.fillStyle = gr; g.fillRect(0, WL, 1920, 1080 - WL);
      }
      // la niebla: una banda de algodón que se pinta una vez y se mueve despacio
      function pintaNiebla() {
        const k = L.k || 1, c = document.createElement('canvas'); c.width = Math.ceil(2400 * k); c.height = Math.ceil(220 * k);
        const gg = c.getContext('2d'), r = semilla(5); gg.setTransform(k, 0, 0, k, 0, 0);
        for (let j = 0; j < 90; j++) {
          const x = r() * 2400, y = 70 + r() * 90, rx = 90 + r() * 260, ry = 22 + r() * 40;
          gg.save(); gg.translate(x, y); gg.scale(1, ry / rx); const gr = gg.createRadialGradient(0, 0, 0, 0, 0, rx);
          gr.addColorStop(0, `rgba(255,${238 + Math.round(r() * 14)},${218 + Math.round(r() * 20)},${.07 + r() * .08})`); gr.addColorStop(1, 'rgba(255,240,220,0)'); gg.fillStyle = gr; gg.fillRect(-rx, -rx, rx * 2, rx * 2); gg.restore();
        }
        return { c, x: 0, y: 0, w: 2400, h: 220 };
      }

      /* ── los pinos con nombre: cada uno, una imagen hecha una vez (se mece inclinándola; al caer, se gira en 3D) ── */
      function pintaPino(g, H, W, r) {
        g.fillStyle = '#24170f'; g.fillRect(-W * .04, -H * .12, W * .08, H * .12 + 3);
        const T = 8 + Math.floor(r() * 5), tono = r(), perfil = .82 + r() * .32, gr = g.createLinearGradient(-W * .55, -H * .62, W * .55, -H * .3);
        gr.addColorStop(0, mezcla('#6d7745', '#5f7a5a', tono)); gr.addColorStop(.28, mezcla('#36523b', '#2c4b44', tono)); gr.addColorStop(.62, mezcla('#1c3127', '#173029', tono)); gr.addColorStop(1, '#0e1a14');
        for (let j = 0; j < T; j++) {
          const u = j / T, yb = -H * (.07 + .84 * u), w = W * Math.pow(1 - u, perfil) * (.9 + r() * .2) + 6, hh = H * (.17 - .05 * u) * (10 / T) + 6, m = Math.max(5, Math.round(w / 8));
          g.beginPath(); g.moveTo(-w / 2, yb - 2);
          for (let q = 1; q <= m; q++) { const x = -w / 2 + q * w / m; g.lineTo(x - w / m * .5, yb + 3 + r() * 7 * (1 - u * .5)); g.lineTo(x, yb + r() * 2 - (q === m ? 2 : 0)); }
          g.quadraticCurveTo(w * .1, yb - hh * .5, 0, yb - hh); g.quadraticCurveTo(-w * .1, yb - hh * .5, -w / 2, yb - 2); g.closePath();
          g.fillStyle = gr; g.fill();
          g.strokeStyle = 'rgba(255,202,132,.45)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-w / 2, yb - 2); g.quadraticCurveTo(-w * .1, yb - hh * .5, 0, yb - hh); g.stroke();
        }
        g.strokeStyle = '#1a2a20'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, -H * .92); g.lineTo(0, -H); g.stroke();
      }
      function sprite(a) {
        const k = L.k || 1, pad = 18, w = a.W + pad * 2, h = a.H + pad * 2, c = document.createElement('canvas');
        c.width = Math.ceil(w * k); c.height = Math.ceil(h * k);
        const gg = c.getContext('2d'); gg.setTransform(k, 0, 0, k, (a.W / 2 + pad) * k, (a.H + pad - 6) * k); pintaPino(gg, a.H, a.W, semilla(a.sem));
        return { c, ox: a.W / 2 + pad, oy: a.H + pad - 6, w, h };
      }
      function monta(items) {
        const n = items.length, igual = n === st.n && st.arb.length === n;
        st.items = items.slice(); st.n = n;
        if (!igual) {
          const p = paso();
          st.arb = items.map((_, i) => { const r = semilla(1000 + i * 77 + n * 3), H = 252 + r() * 70 + (i % 2 ? 0 : 12), W = clamp(p * 1.3, 104, 186) * (.9 + r() * .2);
            return { x: X0 + (i + .5) * p, H, W, sem: 500 + i * 13 + n, spr: null, ang: 0, vel: 0, luz: 0, al: 0, rot: null }; });
          if (L.k) st.arb.forEach(a => { a.spr = sprite(a); });
        }
        rotulos();
      }
      function rotulos() {
        const n = st.n, p = paso(), dos = n > 8;
        st.arb.forEach((a, i) => {
          const nom = st.items[i] || '', ancho = Math.min(290, dos ? p * 2 - 18 : p - 14) - 24;
          const R = rotula(g, px => JO(px, 500), nom, ancho, 48, 28, 16, true);
          g.font = JO(R.px, 500); const tw = Math.max(...R.lineas.map(t => g.measureText(t).width));
          const r = semilla(300 + i);
          a.rot = { lineas: R.lineas, px: R.px, w: Math.max(64, Math.min(ancho + 24, tw + 28)), h: R.lineas.length * R.px * 1.1 + 15, y: dos ? (i % 2 ? 726 : 670) : 676, vetas: [r(), r(), r()] };
        });
      }
      function ajusta(s) {
        if (L.ajusta(s) || !fijo) {
          fijo = capaFija(L.k, pintaFijo); lago = capaFija(L.k, pintaLago, 0, WL, 1920, 1080 - WL); niebla = pintaNiebla();
          st.arb.forEach(a => { a.spr = sprite(a); });
        }
      }

      /* ── el pino que cae: los ejes del pino en pantalla según lo tumbado que esté (th) y su reflejo en el agua ── */
      function ejes(c) {
        const s = Math.sin(c.th), co = Math.cos(c.th), U = { x: s * Math.sin(ALFA) * c.lado, y: -co + s * Math.cos(ALFA) * P };
        const m = Math.hypot(U.x, U.y) || 1, Ur = { x: U.x, y: co + s * Math.cos(ALFA) * P }, mr = Math.hypot(Ur.x, Ur.y) || 1;
        return { U, W: { x: -U.y / m, y: U.x / m }, Ur, Wr: { x: Ur.y / mr, y: -Ur.x / mr } };
      }
      function punto(a, c, f, lat) { const e = ejes(c); return { x: a.x + e.U.x * a.H * f + e.W.x * lat, y: YB + e.U.y * a.H * f + e.W.y * lat }; }
      const thVisto = c => c.th + (c.tImp != null ? -.075 * Math.sin(Math.min(1, (st.t - c.tImp) / .55) * Math.PI) * Math.exp(-(st.t - c.tImp) * 2) : 0);

      /* ── cada fotograma ── */
      function fisica(dt) {
        const vs = clamp(Math.abs(st.v) / 10, 0, 1), sg = Math.sign(st.v) || 0;
        st.arb.forEach((a, i) => {
          a.al = Math.min(1, a.al + dt * 2.2);
          const d = i - st.s;
          a.luz = Math.max(clamp(1 - Math.abs(d) / .6, 0, 1), a.luz - dt * 2.6);
          if (st.caido && st.caido.i === i) return;
          let F = mov * (.32 * Math.sin(st.t * 1.1 + i * 1.7) + .2 * Math.sin(st.t * 2.3 + i));
          F += mov * 12 * vs * sg * Math.exp(-d * d / .8);
          if (st.empuje && st.empuje.i === i) F += st.empuje.F;
          for (let q = 0; q < 2; q++) { const h = dt / 2; a.vel += (-46 * a.ang - 2.4 * a.vel + F) * h; a.ang += a.vel * h; }
          a.ang = clamp(a.ang, -.32, .32);
        });
        if (mov && vs > .12 && st.n) {
          const xg = xDe(st.s);
          if (Math.random() < vs * dt * 55) st.part.push({ tipo: 0, x: xg - sg * 40 + (Math.random() - .5) * 180, y: 330 + Math.random() * 290, vx: sg * (900 + Math.random() * 700) * vs, vy: (Math.random() - .5) * 40, l: 90 + Math.random() * 170, vida: .45 + Math.random() * .35, t: 0 });
          if (Math.random() < vs * dt * 70) st.part.push({ tipo: 1, x: xg + (Math.random() - .5) * 150, y: 360 + Math.random() * 250, vx: sg * (420 + Math.random() * 560) * vs, vy: -50 + Math.random() * 110, a: Math.random() * 6.28, va: (Math.random() - .5) * 18, vida: .8 + Math.random() * .7, t: 0 });
        }
        if (st.part.length > 220) st.part.splice(0, st.part.length - 220);
      }
      function pintaRafaga() {
        const vs = clamp(Math.abs(st.v) / 10, 0, 1); if (!mov || vs < .05 || !st.n) return;
        const xg = xDe(st.s), sg = Math.sign(st.v);
        g.save(); g.translate(xg - sg * 30, 606); g.scale(1, .3); let gr = g.createRadialGradient(0, 0, 0, 0, 0, 230); gr.addColorStop(0, `rgba(255,244,226,${.32 * vs})`); gr.addColorStop(1, 'rgba(255,244,226,0)'); g.fillStyle = gr; g.fillRect(-230, -230, 460, 460); g.restore();
        g.save(); g.globalCompositeOperation = 'lighter'; g.translate(xg, 470); g.scale(1, 1.6); gr = g.createRadialGradient(0, 0, 0, 0, 0, 120); gr.addColorStop(0, `rgba(255,214,150,${.1 * vs})`); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.fillRect(-120, -120, 240, 240); g.restore();
      }
      function pintaArboles() {
        // el resplandor detrás del pino al que le llega la ráfaga
        st.arb.forEach((a, i) => {
          const luz = Math.max(a.luz * .8, i === st.elegido ? st.luzFin : 0); if (luz < .03 || (st.caido && st.caido.i === i)) return;
          const gr = g.createRadialGradient(a.x, YB - a.H * .5, 10, a.x, YB - a.H * .5, a.H * .62); gr.addColorStop(0, `rgba(255,206,130,${.3 * luz})`); gr.addColorStop(1, 'rgba(255,206,130,0)');
          g.fillStyle = gr; g.fillRect(a.x - a.H * .62, YB - a.H * 1.12, a.H * 1.24, a.H * 1.24);
        });
        st.arb.forEach((a, i) => {
          if (!a.spr || (st.caido && st.caido.i === i)) return;
          g.save(); g.globalAlpha = a.al; g.setTransform(L.k, 0, -L.k * Math.tan(a.ang), L.k * Math.cos(a.ang), L.k * a.x, L.k * YB);
          g.drawImage(a.spr.c, -a.spr.ox, -a.spr.oy, a.spr.w, a.spr.h); g.restore();
        });
      }
      function pintaReflejos() {
        g.save(); g.beginPath(); g.rect(0, WL, 1920, 1080 - WL); g.clip();
        st.arb.forEach((a, i) => {
          if (!a.spr) return;
          g.globalAlpha = .34 * a.al;
          if (st.caido && st.caido.i === i) { const c = st.caido, e = ejes({ th: thVisto(c), lado: c.lado }); g.setTransform(L.k * e.Wr.x, L.k * e.Wr.y, -L.k * e.Ur.x, -L.k * e.Ur.y, L.k * a.x, L.k * (2 * WL - YB)); }
          else g.setTransform(L.k, 0, -L.k * Math.tan(a.ang), -L.k * Math.cos(a.ang) * .96, L.k * a.x, L.k * (2 * WL - YB));
          g.drawImage(a.spr.c, -a.spr.ox, -a.spr.oy, a.spr.w, a.spr.h);
        });
        g.restore();
      }
      function pintaCaido() {
        const c = st.caido; if (!c) return; const a = st.arb[c.i]; if (!a || !a.spr) return;
        // el tocón que queda en pie, astillado
        g.save(); g.translate(a.x, YB); g.fillStyle = '#2a1b10'; g.beginPath(); g.moveTo(-7, 3); g.lineTo(-7, -17); g.lineTo(-3, -23); g.lineTo(0, -18); g.lineTo(3, -26); g.lineTo(7, -16); g.lineTo(7, 3); g.closePath(); g.fill();
        g.fillStyle = '#d8b585'; g.beginPath(); g.moveTo(-6, -17); g.lineTo(-3, -22); g.lineTo(0, -17); g.lineTo(3, -25); g.lineTo(6, -16); g.lineTo(2, -14); g.lineTo(-2, -15); g.closePath(); g.fill(); g.restore();
        const e = ejes({ th: thVisto(c), lado: c.lado });
        g.save(); g.setTransform(L.k * e.W.x, L.k * e.W.y, -L.k * e.U.x, -L.k * e.U.y, L.k * a.x, L.k * YB);
        g.drawImage(a.spr.c, -a.spr.ox, -a.spr.oy, a.spr.w, a.spr.h); g.restore();
      }
      function pintaTablillas(cuales) {
        st.arb.forEach((a, i) => {
          const r = a.rot; if (!r || !cuales(i)) return;
          const fin = i === st.elegido ? st.luzFin : 0, luz = Math.max(a.luz * .9, fin), x = a.x - r.w / 2, y = r.y - r.h / 2;
          g.save(); g.globalAlpha = a.al;
          g.fillStyle = 'rgba(14,10,6,.7)'; g.fillRect(a.x - 3, y + r.h - 2, 6, 16);
          if (luz > .02) { g.shadowColor = `rgba(255,190,96,${.9 * luz})`; g.shadowBlur = 30 * luz; }
          rr(g, x, y, r.w, r.h, 5); const gr = g.createLinearGradient(0, y, 0, y + r.h);
          gr.addColorStop(0, mezcla('#d6b07a', '#ffdb94', luz)); gr.addColorStop(1, mezcla('#98703f', '#f2a73e', luz)); g.fillStyle = gr; g.fill();
          g.shadowColor = 'transparent'; g.shadowBlur = 0;
          g.strokeStyle = `rgba(90,58,26,${.22 * (1 - luz * .6)})`; g.lineWidth = 1;
          r.vetas.forEach((v, q) => { const yy = y + 5 + (q + v) * (r.h - 10) / 3; g.beginPath(); g.moveTo(x + 6, yy); g.bezierCurveTo(x + r.w * .3, yy - 2, x + r.w * .7, yy + 2, x + r.w - 6, yy); g.stroke(); });
          rr(g, x, y, r.w, r.h, 5); g.lineWidth = 1.5; g.strokeStyle = 'rgba(40,24,10,.7)'; g.stroke();
          g.fillStyle = 'rgba(40,26,12,.75)'; g.beginPath(); g.arc(x + 7, y + r.h / 2, 1.8, 0, 6.283); g.arc(x + r.w - 7, y + r.h / 2, 1.8, 0, 6.283); g.fill();
          g.fillStyle = '#2b1b0c'; g.font = JO(r.px, 500); g.textAlign = 'center'; g.textBaseline = 'middle';
          r.lineas.forEach((t, q) => g.fillText(t, a.x, r.y + (q - (r.lineas.length - 1) / 2) * r.px * 1.1 + 1));
          g.restore();
        });
      }
      const DEST = (() => { const r = semilla(9); return Array.from({ length: 54 }, () => { const y = WL + 6 + Math.pow(r(), 1.5) * 380; return { x: SOL.x + (r() - .5) * (40 + (y - WL) * .55), y, w: 6 + r() * 20 + (y - WL) * .04, f: 1 + r() * 3, ph: r() * 6.28 }; }); })();
      function pintaDestellos() {
        g.save(); g.globalCompositeOperation = 'lighter';
        DEST.forEach(d => { const a = mov ? .5 + .5 * Math.sin(st.t * d.f * 2 + d.ph) : .6; if (a < .25) return; g.fillStyle = `rgba(255,222,168,${.32 * a})`; g.fillRect(d.x - d.w / 2, d.y, d.w, 1.4 + (d.y - WL) / 220); });
        g.restore();
      }
      function pintaOndas(dt) {
        g.save(); g.lineWidth = 2;
        st.ondas = st.ondas.filter(o => {
          o.t += dt; if (o.t < 0) return true; o.r += o.v * dt; o.v *= (1 - dt * .5); const al = o.al * (1 - o.t / 2.4); if (al <= 0) return false;
          g.strokeStyle = `rgba(255,238,212,${al})`; g.beginPath(); g.ellipse(o.x, o.y, o.r, o.r * .2, 0, 0, 6.283); g.stroke();
          g.strokeStyle = `rgba(20,24,40,${al * .5})`; g.beginPath(); g.ellipse(o.x, o.y + 3, o.r * .94, o.r * .19, 0, 0, 6.283); g.stroke(); return true;
        });
        g.restore();
      }
      function pintaParticulas(dt) {
        g.save(); g.lineCap = 'round';
        st.part = st.part.filter(p => {
          p.t += dt; if (p.t > p.vida) return false; p.x += p.vx * dt; p.y += p.vy * dt; const u = p.t / p.vida, al = Math.sin(Math.PI * u);
          if (p.tipo === 0) { g.strokeStyle = `rgba(255,246,230,${.42 * al})`; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x, p.y); g.quadraticCurveTo(p.x - Math.sign(p.vx) * p.l * .5, p.y - 6, p.x - Math.sign(p.vx) * p.l, p.y + 3); g.stroke(); }
          else { p.vy += 120 * dt; p.a += p.va * dt; g.strokeStyle = p.tipo === 2 ? `rgba(60,82,52,${.9 * al})` : `rgba(38,56,40,${.85 * al})`; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x - Math.cos(p.a) * 5, p.y - Math.sin(p.a) * 5); g.lineTo(p.x + Math.cos(p.a) * 5, p.y + Math.sin(p.a) * 5); g.stroke(); }
          return true;
        });
        st.gotas = st.gotas.filter(d => {
          d.t += dt; d.vy += 1500 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
          if (d.vy > 0 && d.y > d.y0) { if (Math.random() < .3) st.ondas.push({ x: d.x, y: d.y0, r: 2, v: 70, al: .3, t: 0 }); return false; }
          g.fillStyle = 'rgba(255,246,232,.85)'; g.beginPath(); g.ellipse(d.x, d.y, d.r, d.r * 1.5, 0, 0, 6.283); g.fill(); return true;
        });
        if (st.bruma) {
          const b = st.bruma; b.t += dt; const u = b.t / 1.8;
          if (u >= 1) st.bruma = null;
          else { const rx = 90 + 240 * eo(u, 2), gr = g.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, `rgba(255,246,232,${.42 * (1 - u)})`); gr.addColorStop(1, 'rgba(255,246,232,0)');
            g.translate(b.x, b.y - 20); g.scale(1, .42); g.fillStyle = gr; g.fillRect(-rx, -rx, rx * 2, rx * 2); }
        }
        g.restore();
      }
      function pintaPajaros(dt) {
        g.save(); g.strokeStyle = '#15161f'; g.lineWidth = 2.2; g.lineCap = 'round'; g.lineJoin = 'round';
        st.pajaros = st.pajaros.filter(b => {
          b.t += dt; if (b.t < 0) return true; if (b.t > 3.6) return false;
          b.x += b.vx * dt; b.y += b.vy * dt; b.vy *= (1 - dt * .25);
          const s = b.s * (1 - b.t * .08), al = b.t > 2.7 ? 1 - (b.t - 2.7) / .9 : 1, ala = Math.sin(b.t * b.f * 6.283 + b.ph);
          g.globalAlpha = clamp(al, 0, 1); g.beginPath(); g.moveTo(b.x - s, b.y - s * .55 * ala); g.quadraticCurveTo(b.x - s * .45, b.y - s * .3, b.x, b.y); g.quadraticCurveTo(b.x + s * .45, b.y - s * .3, b.x + s, b.y - s * .55 * ala); g.stroke();
          return true;
        });
        g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        fisica(dt);
        L.borra(); if (fijo) ponCapa(g, fijo);
        if (niebla) { g.save(); g.globalAlpha = .9; g.drawImage(niebla.c, -240 + 90 * Math.sin(st.t * .06) * mov, 470, 2400, 220); g.restore(); }
        pintaReflejos(); if (lago) ponCapa(g, lago); pintaDestellos(); pintaOndas(dt);
        if (niebla) { g.save(); g.globalAlpha = .45; g.drawImage(niebla.c, -120 - 50 * Math.sin(st.t * .05) * mov, 680, 2400, 160); g.restore(); }
        // el pino caído, delante de las tablillas de al lado (cae hacia aquí); la suya, encima
        pintaArboles(); pintaRafaga(); pintaTablillas(i => !st.caido || i !== st.caido.i); pintaCaido(); if (st.caido) pintaTablillas(i => i === st.caido.i);
        pintaParticulas(dt); pintaPajaros(dt);
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.arbol.fuentes, () => { if (vivo && st.n) rotulos(); });

      /* ── el sonido: el viento, el roce de las ramas, el crujido, el chasquido, la caída, el agua, los pájaros y la calma ── */
      const son = { viento: null, hojas: null };
      function vientoOn() { if (!A.ac || son.viento) return; son.viento = A.continuo({ tipo: 'bandpass', f: 380, q: .6, wet: .35 }); son.hojas = A.continuo({ tipo: 'highpass', f: 3800, q: .4, wet: .15 }); }
      function vientoPon(vs) {
        if (son.viento) { A.pon(son.viento.g.gain, .05 + .32 * vs, .06); A.pon(son.viento.f.frequency, 280 + 900 * vs, .08); }
        if (son.hojas) A.pon(son.hojas.g.gain, .012 + .06 * vs, .05);
      }
      function vientoOff(seg) { if (son.viento) son.viento.para(seg); if (son.hojas) son.hojas.para(seg); son.viento = son.hojas = null; }
      function crujido(t, dur, f0, f1, pan) {
        const ac = A.ac; if (!ac) return; const t0 = ac.currentTime + t;
        const os = ac.createOscillator(); os.type = 'sawtooth'; os.frequency.setValueAtTime(f0, t0); os.frequency.linearRampToValueAtTime(f1, t0 + dur * .6); os.frequency.linearRampToValueAtTime(f0 * .9, t0 + dur);
        const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 6;
        const pk = ac.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 2300; pk.gain.value = 8; pk.Q.value = 3;
        const am = ac.createGain(); am.gain.value = .5; const lfo = ac.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 17 + Math.random() * 9; const lg = ac.createGain(); lg.gain.value = .5; lfo.connect(lg); lg.connect(am.gain);
        const gn = ac.createGain(); gn.gain.setValueAtTime(0, t0); gn.gain.linearRampToValueAtTime(.26, t0 + dur * .25); gn.gain.linearRampToValueAtTime(.18, t0 + dur * .7); gn.gain.linearRampToValueAtTime(0, t0 + dur);
        os.connect(bp); bp.connect(pk); pk.connect(am); am.connect(gn); gn.connect(A.via(1, .3, pan || 0)); os.start(t0); lfo.start(t0); os.stop(t0 + dur + .05); lfo.stop(t0 + dur + .05);
      }
      function chasquido(pan) {
        A.clic({ f: 2600, q: .6, gan: .9, dur: .045, pan }); A.clic({ f: 1400, q: .8, gan: .7, dur: .08, t: .02, pan }); A.clic({ f: 3900, q: 1, gan: .5, dur: .03, t: .06, pan });
        A.nota(110, { tipo: 'sine', dur: .3, gan: .3, desliza: 55 });
      }
      function chapuzon(pan) {
        const c = A.continuo({ tipo: 'lowpass', f: 4200, q: .7, wet: .5, pan });
        if (c) { A.pon(c.g.gain, .55, .02); setTimeout(() => { if (A.ac) { A.pon(c.f.frequency, 340, 1.1); A.pon(c.g.gain, 0, 1.3); } }, 70); setTimeout(() => c.para(.1), 1500); }
        A.nota(62, { tipo: 'sine', dur: .7, gan: .45, desliza: 38 }); A.clic({ f: 900, q: .5, gan: .6, dur: .12, pan });
        for (let j = 0; j < 9; j++) { const t = .25 + j * .13 + Math.random() * .12, f = 700 + Math.random() * 900; A.nota(f, { tipo: 'sine', t, dur: .07, gan: .05, desliza: f * 1.9, wet: .4, pan }); }
      }
      function calma() {
        [[.35, 3300, 4700], [.48, 3600, 5000], [.82, 3000, 4300], [.94, 3400, 4900]].forEach(([t, f0, f1]) => A.nota(f0, { tipo: 'sine', t, dur: .08, gan: .028, desliza: f1, wet: .45, pan: -.3 }));
        [196, 293.66, 392, 493.88, 587.33].forEach((f, j) => A.nota(f, { tipo: 'sine', t: 1.1 + j * .06, dur: 3.6, gan: .04, ataque: .7, wet: .75 }));
      }
      const rampa = (gen, ms, fn) => new Promise(ok => { const t0 = performance.now(); (function p_() { if (gen !== st.gen || !vivo) return ok(); const tt = (performance.now() - t0) / 1000, u = clamp(tt * 1000 / ms, 0, 1); fn(u, tt); if (u < 1) requestAnimationFrame(p_); else ok(); })(); });

      return {
        ajusta,
        espera() {},
        async gira(bombo, k) {
          const gen = ++st.gen;
          if (st.caido) { const a = st.arb[st.caido.i]; if (a) { a.al = 0; a.ang = 0; a.vel = 0; } st.caido = null; }   // otra vez: el pino caído vuelve a estar en pie
          monta(bombo);
          const n = st.n; st.elegido = -1; st.luzFin = 0; st.empuje = null; st.s = clamp(st.s, -1.6, n + .6);
          // la ráfaga: barre la orilla hasta el extremo más lejano (y, si el elegido queda cerca de ese extremo, vuelve hasta el
          // otro), viene hacia él desde lejos, se pasa, vuelve y se queda
          const iz = -.6, de = n - .4, E1 = Math.abs(st.s - iz) > Math.abs(st.s - de) ? iz : de, E2 = E1 === iz ? de : iz;
          const way = Math.abs(k - E1) < Math.abs(k - E2) ? [E1, E2] : [E1], dir = Math.sign(k - way[way.length - 1]) || 1;
          const pts = [[0, st.s]]; let T = 0, prev = st.s;
          way.forEach(w => { T += RM ? .35 : clamp(Math.abs(w - prev) / 16, .42, 1); pts.push([T, w]); prev = w; });
          T += RM ? .4 : clamp(Math.abs(k + dir * 1.35 - prev) / 12, .55, 1.05); pts.push([T, k + dir * 1.35]);
          [[k - dir * .42, .55], [k, .5]].forEach(([w, d]) => { T += RM ? d * .45 : d; pts.push([T, w]); });
          const ac = A.crea(); if (ac && mov) vientoOn();
          await new Promise(ok => {
            const t0 = performance.now(); let antes = st.s, tA = t0, cel = Math.round(st.s);
            (function paso_() {
              if (gen !== st.gen || !vivo) { vientoOff(.3); return ok(); }
              const ahora = performance.now(), t = Math.min(T, (ahora - t0) / 1000);
              let j = 0; while (j < pts.length - 2 && t > pts[j + 1][0]) j++;
              const [ta, sa] = pts[j], [tb, sb] = pts[j + 1], u = clamp((t - ta) / ((tb - ta) || 1), 0, 1), s = lerp(sa, sb, eio(u));
              st.v = (s - antes) / Math.max(.008, (ahora - tA) / 1000); antes = s; tA = ahora; st.s = s;
              if (ac && mov) {
                const vs = clamp(Math.abs(st.v) / 10, 0, 1); vientoPon(vs);
                const c = Math.round(s); if (c !== cel && c >= 0 && c < n) { cel = c; A.clic({ f: 2400 + Math.random() * 2600, q: .6, gan: .04 + .12 * vs, dur: .1, wet: .2, pan: clamp((xDe(c) - 960) / 1100, -.8, .8) }); }
              }
              if (t < T) requestAnimationFrame(paso_); else { st.s = k; st.v = 0; ok(); }
            })();
          });
          if (gen !== st.gen) return;
          st.elegido = k; const a = st.arb[k], pan = a ? clamp((a.x - 960) / 1100, -.8, .8) : 0;
          if (RM || !a) {            // sin movimiento: se enciende su tablilla y ya
            if (ac) calma(); vientoOff(.4);
            await rampa(gen, 500, u => { st.luzFin = eo(u, 2); });
            return;
          }
          // 1) cruje: se mece cada vez más, hacia el lado del lago abierto
          const lado = a.x < 960 ? 1 : -1;
          if (ac) { vientoPon(.14); crujido(.04, .34, 46, 74, pan); crujido(.38, .3, 55, 88, pan); }
          await rampa(gen, 640, (u, tt) => { st.empuje = { i: k, F: (5 + 16 * u) * Math.sin(tt * 6.283 * 1.7) + 8 * lado * u * u }; });
          st.empuje = null; if (gen !== st.gen) return;
          // 2) se parte y cae: el chasquido, el aire, las agujas que se sueltan
          if (ac) chasquido(pan);
          const th0 = clamp(a.ang * lado, 0, .25), c = st.caido = { i: k, lado, th: th0, tImp: null };
          const silba = ac ? A.continuo({ tipo: 'bandpass', f: 260, q: .9, wet: .3, pan }) : null; if (silba) { A.pon(silba.g.gain, .28, .6); A.pon(silba.f.frequency, 1500, .7); }
          await rampa(gen, 700, u => {
            c.th = th0 + (TH_F - th0) * Math.pow(u, 2.1);
            if (Math.random() < .55) { const p = punto(a, c, .3 + Math.random() * .7, (Math.random() - .5) * a.W * .5); st.part.push({ tipo: 2, x: p.x, y: p.y, vx: (Math.random() - .5) * 120 - lado * 60, vy: -40 + Math.random() * 60, a: Math.random() * 6.28, va: (Math.random() - .5) * 14, vida: 1 + Math.random() * .6, t: 0 }); }
          });
          if (silba) silba.para(.12);
          if (gen !== st.gen) return;
          // 3) al agua: la salpicadura, las ondas, la bruma y los pájaros; el viento se calla
          c.th = TH_F; c.tImp = st.t; if (ac) { chapuzon(pan); calma(); } vientoOff(1.4);
          for (let j = 0; j < 48; j++) { const f = .3 + Math.random() * .7, p = punto(a, c, f, (Math.random() - .5) * a.W * (1 - f) * .8);
            st.gotas.push({ x: p.x, y: p.y, y0: p.y + 4, vx: (Math.random() - .5) * 280, vy: -(260 + Math.random() * 520) * (1.1 - f * .4), r: 1.5 + Math.random() * 2.4, t: 0 }); }
          [.45, .7, .93].forEach((f, q) => { const p = punto(a, c, f, 0); st.ondas.push({ x: p.x, y: p.y + 8, r: 12, v: 240 + q * 40, al: .55, t: -q * .08 }, { x: p.x, y: p.y + 8, r: 4, v: 150, al: .42, t: -.24 - q * .05 }); });
          const pb = punto(a, c, .72, 0); st.bruma = { x: pb.x, y: pb.y, t: 0 };
          for (let j = 0; j < 7; j++) st.pajaros.push({ x: a.x - lado * 60 + (Math.random() - .5) * 260, y: YB - a.H * (.45 + Math.random() * .4), vx: -lado * (60 + Math.random() * 120) * (Math.random() < .8 ? 1 : -1), vy: -(80 + Math.random() * 90), f: 7 + Math.random() * 3, s: 9 + Math.random() * 5, t: -.05 - j * .07, ph: Math.random() * 6 });
          await rampa(gen, 300, u => { st.luzFin = eo(u, 2); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); vientoOff(.2); }
      };
    }
  };

  /* ── «sinte» · Acústica · Día 3 «Timbre y síntesis»: el sintetizador modular de la cabaña ──
     (22-oct-2026, v5) El rincón de la cabaña de noche, con la lámpara encendida: el sintetizador modular en su caja de madera,
     con sus módulos (oscilador, filtro, envolvente, LFO, osciloscopio y salida) y, abajo, el panel de conexiones: una toma
     por alumno, con su nombre escrito a mano en un trozo de cinta de carrocero. El cable coral sale del oscilador y salta de
     toma en toma: cada toma suena con un timbre distinto (siempre la misma nota, un La: seno, triángulo, sierra, cuadrada,
     campana FM, filtro, órgano, coro), el oscilador marca cuál es y el osciloscopio dibuja su onda. Frena, se enchufa en una,
     se enciende su luz y suena el acorde con ese timbre. */
  TEMAS.sinte = {
    fuentes: ['200 100px Jost', '300 20px Jost', '500 13px Jost', '400 30px Mano'],
    nombreFit: { min: 50 },
    css: `
.lmv-t-sinte .lmv-velo{background:radial-gradient(ellipse at 70% 30%,rgba(60,36,20,.97) 0%,rgba(26,16,10,.985) 60%,rgba(8,5,3,.995) 100%)}
.lmv-t-sinte .lmv-cab{top:26px}
.lmv-t-sinte .lmv-ceja{font:300 19px/1 Jost,system-ui,sans-serif;letter-spacing:.5em;text-transform:uppercase;color:rgba(255,240,224,.88);text-shadow:0 2px 10px rgba(0,0,0,.7)}
.lmv-t-sinte .lmv-grupo{margin-top:10px;font:300 17px/1 Jost,system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:rgba(255,240,224,.6);text-shadow:0 2px 10px rgba(0,0,0,.7)}
.lmv-t-sinte .lmv-nombre{top:82px;left:250px;right:250px;height:150px;display:flex;align-items:center;justify-content:center;font:200 100px/1.1 Jost,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#fff;text-shadow:0 0 34px rgba(255,112,88,.6),0 4px 22px rgba(0,0,0,.9)}
.lmv-t-sinte .lmv-nota{top:930px;font:300 18px/1.3 Jost,system-ui,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,240,224,.8);text-shadow:0 2px 10px rgba(0,0,0,.85)}
.lmv-t-sinte .lmv-pie{bottom:22px}
.lmv-t-sinte .lmv-b{display:inline-flex;align-items:center;gap:.8em;padding:18px 32px;border-radius:9px;border:1px solid rgba(255,240,224,.72);background:rgba(16,10,8,.6);color:#fff3e6;font:300 21px/1 Jost,system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;transition:background .15s,border-color .15s}
.lmv-t-sinte .lmv-b:hover{background:rgba(255,240,224,.16);border-color:#fff}
.lmv-t-sinte .lmv-b.lmv-otra{background:#ff7a5f;border-color:#ff7a5f;color:#1f0d08;font-weight:400}
.lmv-t-sinte .lmv-b.lmv-otra:hover{background:#ff9a84}
.lmv-t-sinte .lmv-cargando{color:#ff8f75}
.lmv-of-sinte .lmv-ob{font-family:Jost,system-ui,sans-serif;font-weight:300;letter-spacing:.08em;border:1px solid #ff8a70;border-radius:9px;background:linear-gradient(rgba(30,22,20,.95),rgba(14,10,9,.95));color:#fff3e6;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 0 4px rgba(255,122,95,.16)}
.lmv-of-sinte .lmv-og,.lmv-of-sinte .lmv-no{font-family:Jost,system-ui,sans-serif;color:#ffeadc}
@media (prefers-reduced-motion:reduce){.lmv-t-sinte .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const JO = (px, w) => `${w || 500} ${px}px Jost, system-ui, sans-serif`;
      const MA = px => `400 ${px}px Mano, "Segoe Print", "Bradley Hand", cursive`;
      const CX0 = 236, CX1 = 1684, CY0 = 236, CY1 = 918, IX0 = 280, IX1 = 1640, RA0 = 258, RA1 = 548, RB0 = 572, RB1 = 896;
      const OUT = { x: 372, y: 504 };                       // la salida del oscilador, de donde sale el cable coral
      const CORAL = '#ff6a52', TIMBRES = ['SENO', 'TRIÁNGULO', 'SIERRA', 'CUADRADA', 'CAMPANA FM', 'FILTRO', 'ÓRGANO', 'CORO'];
      const tiDe = j => (j * 3 + 1) % 8;                    // el timbre de cada toma (dos seguidas, nunca igual)
      const st = { items: [], n: 0, tomas: [], s: 0, t: 0, gen: 0, elegido: -1, dentro: -1, tipo: 1, nivel: 0, vu: 0, luzFin: 0, fin: 0, latido: 0 };
      let fijo = null, etiq = null, raf = 0, vivo = true;

      /* ── piezas ── */
      function tornillo(g, x, y) { g.fillStyle = '#a3a39c'; g.beginPath(); g.arc(x, y, 4.2, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 3, y - 1); g.lineTo(x + 3, y + 1); g.stroke(); }
      function toma(g, x, y, r) {
        r = r || 14; g.save(); g.translate(x, y);
        g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.arc(1.5, 2.5, r + 1.5, 0, 6.283); g.fill();
        const gr = g.createLinearGradient(-r, -r, r, r); gr.addColorStop(0, '#f4f4f0'); gr.addColorStop(.5, '#aaaaa4'); gr.addColorStop(1, '#5c5c58');
        g.fillStyle = gr; g.beginPath(); for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3 + Math.PI / 6; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill();
        g.fillStyle = '#dcdcd6'; g.beginPath(); g.arc(0, 0, r * .64, 0, 6.283); g.fill();
        g.fillStyle = '#09090a'; g.beginPath(); g.arc(0, 0, r * .42, 0, 6.283); g.fill(); g.restore();
      }
      function perilla(g, x, y, r, ang, claro) {
        g.save(); g.translate(x, y);
        g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.arc(2, 4, r + 2, 0, 6.283); g.fill();
        const gr = g.createRadialGradient(-r * .3, -r * .4, 2, 0, 0, r);
        if (claro) { gr.addColorStop(0, '#fbf6ea'); gr.addColorStop(1, '#b4ad9c'); } else { gr.addColorStop(0, '#505054'); gr.addColorStop(1, '#121214'); }
        g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill();
        g.strokeStyle = claro ? 'rgba(60,50,40,.3)' : 'rgba(255,255,255,.12)'; g.lineWidth = 1; g.beginPath(); g.arc(0, 0, r * .72, 0, 6.283); g.stroke();
        g.rotate(ang); g.strokeStyle = claro ? '#2a241c' : '#f4f1ea'; g.lineWidth = Math.max(2, r * .09); g.lineCap = 'round'; g.beginPath(); g.moveTo(0, -r * .2); g.lineTo(0, -r * .86); g.stroke();
        g.restore();
      }
      function marcas(g, x, y, r, col) { g.strokeStyle = col; g.lineWidth = 1.4; for (let j = 0; j <= 10; j++) { const a = (-135 + j * 27) * Math.PI / 180 - Math.PI / 2, l = j % 5 ? 8 : 12; g.beginPath(); g.moveTo(x + Math.cos(a) * (r + 5), y + Math.sin(a) * (r + 5)); g.lineTo(x + Math.cos(a) * (r + 5 + l), y + Math.sin(a) * (r + 5 + l)); g.stroke(); } }
      function luz(g, x, y, on, col, r) {
        r = r || 4.4; g.save(); g.fillStyle = '#160b09'; g.beginPath(); g.arc(x, y, r + 1.4, 0, 6.283); g.fill();
        if (on > .02) { g.shadowColor = `rgba(${col},${on})`; g.shadowBlur = 16 * on; g.fillStyle = `rgba(${col},${.3 + .7 * on})`; }
        else g.fillStyle = `rgba(${col},.16)`;
        g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.restore();
      }
      function rotulo(g, t, x, y, px, col, al) { g.font = JO(px, 500); g.fillStyle = col; g.textAlign = al || 'center'; g.textBaseline = 'middle'; espaciado(g, px * .14); g.fillText(t, x, y); espaciado(g, 0); }
      function modulo(g, x0, x1, tit, claro) {
        const y0 = RA0, y1 = RA1;
        let gr = g.createLinearGradient(0, y0, 0, y1);
        if (claro) { gr.addColorStop(0, '#d9d8d1'); gr.addColorStop(1, '#b5b4ac'); } else { gr.addColorStop(0, '#2a2c30'); gr.addColorStop(1, '#1b1c1f'); }
        g.fillStyle = gr; g.fillRect(x0 + 1, y0, x1 - x0 - 2, y1 - y0);
        if (claro) { g.save(); g.beginPath(); g.rect(x0 + 1, y0, x1 - x0 - 2, y1 - y0); g.clip(); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; for (let y = y0; y < y1; y += 3) { g.beginPath(); g.moveTo(x0, y + .5); g.lineTo(x1, y + .5); g.stroke(); } g.restore(); }
        g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1.5; g.strokeRect(x0 + 1.5, y0 + .5, x1 - x0 - 3, y1 - y0 - 1);
        tornillo(g, x0 + 12, y0 + 10); tornillo(g, x1 - 12, y0 + 10); tornillo(g, x0 + 12, y1 - 10); tornillo(g, x1 - 12, y1 - 10);
        rotulo(g, tit, (x0 + x1) / 2, y0 + 30, 14, claro ? '#1f1d1a' : '#f1ece2');
        g.fillStyle = claro ? 'rgba(30,28,24,.5)' : 'rgba(255,255,255,.22)'; g.fillRect(x0 + 18, y0 + 44, x1 - x0 - 36, 1.2);
      }
      function cable(g, x0, y0, x1, y1, col, ancho, cuelga) {
        const c1 = { x: x0, y: Math.max(y0, y1) + cuelga }, c2 = { x: x1, y: Math.max(y0, y1) + cuelga * .9 };
        const traza = () => { g.beginPath(); g.moveTo(x0, y0); g.bezierCurveTo(lerp(x0, x1, .12), c1.y, lerp(x0, x1, .88), c2.y, x1, y1); };
        g.save(); g.lineCap = 'round';
        g.translate(5, 9); traza(); g.strokeStyle = 'rgba(0,0,0,.32)'; g.lineWidth = ancho + 4; g.stroke(); g.translate(-5, -9);
        traza(); g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = ancho + 3; g.stroke();
        traza(); g.strokeStyle = col; g.lineWidth = ancho; g.stroke();
        g.translate(-1.2, -1.6); traza(); g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = Math.max(1.4, ancho * .28); g.stroke();
        g.restore();
      }
      function clavija(g, x, y, col, alza) {
        const s = 1 + .16 * alza; g.save(); g.translate(x, y);
        g.fillStyle = `rgba(0,0,0,${.35 + .15 * alza})`; g.beginPath(); g.arc(4 + 10 * alza, 6 + 16 * alza, 17 * s, 0, 6.283); g.fill();
        g.scale(s, s);
        const gr = g.createRadialGradient(-5, -6, 2, 0, 0, 17); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.25, col); gr.addColorStop(1, '#7a2418');
        g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 16, 0, 6.283); g.fill();
        g.strokeStyle = 'rgba(60,14,8,.55)'; g.lineWidth = 1; for (let j = 0; j < 18; j++) { const a = j * 6.283 / 18; g.beginPath(); g.moveTo(Math.cos(a) * 12, Math.sin(a) * 12); g.lineTo(Math.cos(a) * 15.6, Math.sin(a) * 15.6); g.stroke(); }
        g.fillStyle = '#1a0c09'; g.beginPath(); g.arc(0, 0, 7, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.arc(-2, -2.5, 2.2, 0, 6.283); g.fill();
        g.restore();
      }

      /* ── lo que no se mueve: la cabaña, la caja, los módulos, los cables de adorno ── */
      function pintaFijo(g) {
        const r = semilla(37);
        // la pared de troncos, con la luz de la lámpara arriba a la derecha
        for (let y = -20, q = 0; y < 1080; y += 62, q++) {
          const gr = g.createLinearGradient(0, y, 0, y + 62); gr.addColorStop(0, '#2a170c'); gr.addColorStop(.12, '#7a4d2b'); gr.addColorStop(.45, '#6a4224'); gr.addColorStop(.85, '#3d2413'); gr.addColorStop(1, '#1c0f07');
          g.fillStyle = gr; g.fillRect(0, y, 1920, 62);
          g.strokeStyle = 'rgba(30,16,8,.35)'; g.lineWidth = 1;
          for (let j = 0; j < 7; j++) { const yy = y + 12 + r() * 40, x0 = r() * 1920, w = 120 + r() * 400; g.beginPath(); g.moveTo(x0, yy); g.bezierCurveTo(x0 + w * .3, yy - 2, x0 + w * .6, yy + 2, x0 + w, yy); g.stroke(); }
          for (let j = 0; j < 2; j++) { const x = ((q * 383 + j * 911) % 1800) + 60; g.fillStyle = 'rgba(30,16,8,.45)'; g.beginPath(); g.ellipse(x, y + 31, 9, 6, 0, 0, 6.283); g.fill(); }
        }
        let gr = g.createRadialGradient(1790, 170, 20, 1790, 170, 1300); gr.addColorStop(0, 'rgba(255,196,120,.42)'); gr.addColorStop(.35, 'rgba(255,170,90,.14)'); gr.addColorStop(1, 'rgba(0,0,0,.45)');
        g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        // la ventana, a la izquierda: el lago y las montañas al anochecer
        g.save(); g.fillStyle = '#26150a'; g.fillRect(14, 120, 196, 450);
        g.beginPath(); g.rect(30, 136, 164, 418); g.clip();
        gr = g.createLinearGradient(0, 136, 0, 554); gr.addColorStop(0, '#3a3e66'); gr.addColorStop(.45, '#c9786a'); gr.addColorStop(.62, '#f0a46a'); gr.addColorStop(1, '#2b2f4a'); g.fillStyle = gr; g.fillRect(30, 136, 164, 418);
        g.fillStyle = '#4b4d6e'; g.beginPath(); g.moveTo(30, 380); g.lineTo(70, 330); g.lineTo(98, 352); g.lineTo(140, 300); g.lineTo(194, 372); g.lineTo(194, 420); g.lineTo(30, 420); g.closePath(); g.fill();
        g.fillStyle = '#f2f2f6'; g.beginPath(); g.moveTo(140, 300); g.lineTo(128, 316); g.lineTo(140, 312); g.lineTo(150, 318); g.closePath(); g.fill();
        g.fillStyle = '#1b2a26'; for (let x = 30; x < 196; x += 9) { const h = 20 + r() * 34; g.beginPath(); g.moveTo(x, 420 - h); g.lineTo(x + 5, 422); g.lineTo(x - 5, 422); g.closePath(); g.fill(); }
        gr = g.createLinearGradient(0, 420, 0, 554); gr.addColorStop(0, '#d98d6a'); gr.addColorStop(1, '#262a44'); g.fillStyle = gr; g.fillRect(30, 421, 164, 134);
        g.restore();
        g.fillStyle = '#26150a'; g.fillRect(106, 136, 10, 418); g.fillRect(30, 340, 164, 10);
        g.strokeStyle = 'rgba(255,200,140,.25)'; g.lineWidth = 2; g.strokeRect(30, 136, 164, 418);
        // a la derecha, en la pared: el violín y el clarinete; y la lámpara
        g.save(); g.translate(1800, 520); g.rotate(-.08);
        gr = g.createRadialGradient(-12, -20, 6, 0, 0, 80); gr.addColorStop(0, '#c9772e'); gr.addColorStop(1, '#5b2a0e'); g.fillStyle = gr;
        g.beginPath(); g.ellipse(0, 46, 52, 62, 0, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(0, -46, 42, 52, 0, 0, 6.283); g.fill(); g.fillRect(-30, -20, 60, 50);
        g.fillStyle = '#1a0e08'; g.fillRect(-7, -190, 14, 170); g.beginPath(); g.ellipse(0, -196, 11, 16, 0, 0, 6.283); g.fill();
        g.strokeStyle = 'rgba(255,230,190,.55)'; g.lineWidth = 1; for (let j = -2; j <= 2; j++) { g.beginPath(); g.moveTo(j * 2.4, -186); g.lineTo(j * 2.8, 80); g.stroke(); }
        g.fillStyle = '#20110a'; g.beginPath(); g.moveTo(-14, 5); g.quadraticCurveTo(-24, 10, -12, 20); g.lineTo(-10, 18); g.quadraticCurveTo(-18, 10, -10, 7); g.fill(); g.beginPath(); g.moveTo(14, 5); g.quadraticCurveTo(24, 10, 12, 20); g.lineTo(10, 18); g.quadraticCurveTo(18, 10, 10, 7); g.fill();
        g.restore();
        g.save(); g.translate(1736, 260); g.fillStyle = '#121214'; rr(g, -7, 0, 14, 300, 6); g.fill(); g.beginPath(); g.moveTo(-7, 290); g.lineTo(-20, 340); g.lineTo(20, 340); g.lineTo(7, 290); g.fill();
        g.fillStyle = '#c8c8c0'; for (let j = 0; j < 9; j++) g.fillRect(-9, 40 + j * 26, 18, 3); g.restore();
        g.save(); g.translate(1820, 150); gr = g.createRadialGradient(0, 30, 4, 0, 30, 170); gr.addColorStop(0, 'rgba(255,214,150,.75)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(-170, -140, 340, 340);
        gr = g.createLinearGradient(-60, 0, 60, 0); gr.addColorStop(0, '#c48a4a'); gr.addColorStop(.5, '#f6d39a'); gr.addColorStop(1, '#a8703a'); g.fillStyle = gr; g.beginPath(); g.moveTo(-34, -40); g.lineTo(34, -40); g.lineTo(62, 26); g.lineTo(-62, 26); g.closePath(); g.fill(); g.restore();
        // la mesa
        gr = g.createLinearGradient(0, CY1 - 6, 0, 1080); gr.addColorStop(0, '#6e4628'); gr.addColorStop(.12, '#4c2e18'); gr.addColorStop(1, '#22130a'); g.fillStyle = gr; g.fillRect(0, CY1 - 6, 1920, 1080 - CY1 + 6);
        g.fillStyle = 'rgba(255,214,160,.25)'; g.fillRect(0, CY1 - 6, 1920, 2);
        // la caja: sombra, costados de nogal y raíles
        g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 50; g.shadowOffsetY = 22; g.fillStyle = '#1a1009'; g.fillRect(CX0, CY0, CX1 - CX0, CY1 - CY0); g.restore();
        [[CX0, IX0], [IX1, CX1]].forEach(([a, b]) => { gr = g.createLinearGradient(a, 0, b, 0); gr.addColorStop(0, '#3c200f'); gr.addColorStop(.5, '#8a5630'); gr.addColorStop(1, '#3c200f'); g.fillStyle = gr; g.fillRect(a, CY0 - 14, b - a, CY1 - CY0 + 20);
          g.strokeStyle = 'rgba(30,14,6,.4)'; g.lineWidth = 1; for (let j = 0; j < 12; j++) { const x = a + 4 + r() * (b - a - 8); g.beginPath(); g.moveTo(x, CY0 - 14); g.bezierCurveTo(x + 4, CY0 + 200, x - 4, CY1 - 200, x + 2, CY1 + 6); g.stroke(); } });
        g.fillStyle = '#0d0d0e'; g.fillRect(IX0, CY0, IX1 - IX0, CY1 - CY0);
        [[CY0, RA0], [RA1, RB0], [RB1, CY1]].forEach(([a, b]) => { gr = g.createLinearGradient(0, a, 0, b); gr.addColorStop(0, '#e9e9e4'); gr.addColorStop(.5, '#9d9d97'); gr.addColorStop(1, '#5d5d58'); g.fillStyle = gr; g.fillRect(IX0, a, IX1 - IX0, b - a);
          g.fillStyle = 'rgba(0,0,0,.35)'; for (let x = IX0 + 20; x < IX1; x += 46) { rr(g, x, (a + b) / 2 - 2.5, 14, 5, 2.5); g.fill(); } });
        // los módulos de arriba
        modulo(g, IX0, 568, 'OSCILADOR'); modulo(g, 568, 772, 'FILTRO', true); modulo(g, 772, 968, 'ENVOLVENTE'); modulo(g, 968, 1088, 'LFO');
        modulo(g, 1088, 1448, 'OSCILOSCOPIO'); modulo(g, 1448, IX1, 'SALIDA', true);
        // oscilador: el tono (un La), la lista de timbres (sus luces, en vivo) y la salida
        marcas(g, 372, 352, 44, 'rgba(240,234,220,.55)'); rotulo(g, 'TONO · LA', 372, 428, 12, '#d8d2c4');
        TIMBRES.forEach((t, j) => rotulo(g, t, 458, 322 + j * 24.5, 11.5, '#e8e2d6', 'left'));
        rotulo(g, 'SALIDA', OUT.x, 470, 11.5, '#d8d2c4'); toma(g, OUT.x, OUT.y, 15);
        // filtro
        marcas(g, 670, 346, 40, 'rgba(30,28,24,.55)'); rotulo(g, 'CORTE', 670, 418, 12, '#2a2620');
        rotulo(g, 'RESONANCIA', 622, 512, 10, '#2a2620'); rotulo(g, 'ENTRA', 708, 488, 10, '#2a2620'); rotulo(g, 'SALE', 750, 488, 10, '#2a2620');
        toma(g, 708, 514, 12); toma(g, 750, 514, 12);
        // envolvente: A D S R
        [['A', .25], ['D', .55], ['S', .72], ['R', .4]].forEach(([t, v], j) => { const x = 812 + j * 42; g.fillStyle = '#070708'; rr(g, x - 4, 318, 8, 132, 4); g.fill();
          for (let q = 0; q <= 6; q++) { g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 9, 320 + q * 21.3, 6, 1.2); }
          const y = 320 + (1 - v) * 128; gr = g.createLinearGradient(0, y - 9, 0, y + 9); gr.addColorStop(0, '#f2efe6'); gr.addColorStop(1, '#9c978a'); g.fillStyle = gr; rr(g, x - 13, y - 9, 26, 18, 3); g.fill(); g.fillStyle = '#1a1a1a'; g.fillRect(x - 10, y - 1, 20, 2);
          rotulo(g, t, x, 470, 13, '#e8e2d6'); });
        toma(g, 870, 514, 13);
        // LFO
        marcas(g, 1028, 344, 26, 'rgba(240,234,220,.45)'); perilla(g, 1028, 344, 26, .9, true); rotulo(g, 'VELOCIDAD', 1028, 392, 10, '#d8d2c4'); toma(g, 1028, 512, 13);
        // osciloscopio: el marco y la cuadrícula (la onda se pinta en vivo)
        rr(g, 1106, 280, 324, 196, 16); g.fillStyle = '#0a0b0b'; g.fill(); rr(g, 1116, 290, 304, 176, 12); gr = g.createRadialGradient(1268, 378, 20, 1268, 378, 200); gr.addColorStop(0, '#0f2a1c'); gr.addColorStop(1, '#04100a'); g.fillStyle = gr; g.fill();
        g.save(); rr(g, 1116, 290, 304, 176, 12); g.clip(); g.strokeStyle = 'rgba(110,255,170,.12)'; g.lineWidth = 1;
        for (let x = 1116; x < 1420; x += 30.4) { g.beginPath(); g.moveTo(x, 290); g.lineTo(x, 466); g.stroke(); } for (let y = 290; y < 466; y += 29.3) { g.beginPath(); g.moveTo(1116, y); g.lineTo(1420, y); g.stroke(); }
        g.strokeStyle = 'rgba(110,255,170,.24)'; g.beginPath(); g.moveTo(1116, 378); g.lineTo(1420, 378); g.stroke(); g.restore();
        perilla(g, 1170, 512, 13, -.6); perilla(g, 1236, 512, 13, .4); rotulo(g, 'ENTRADA', 1352, 490, 10, '#d8d2c4'); toma(g, 1404, 512, 13);
        // salida: el vúmetro (la aguja, en vivo), el volumen y los auriculares
        rr(g, 1468, 312, 152, 104, 8); g.fillStyle = '#1a1a1a'; g.fill(); rr(g, 1474, 318, 140, 92, 6); gr = g.createLinearGradient(0, 318, 0, 410); gr.addColorStop(0, '#fbf2d8'); gr.addColorStop(1, '#e8d7a8'); g.fillStyle = gr; g.fill();
        g.strokeStyle = '#2a2418'; g.lineWidth = 1.4; g.beginPath(); g.arc(1544, 412, 70, -Math.PI * .78, -Math.PI * .22); g.stroke();
        g.strokeStyle = '#c0392b'; g.lineWidth = 3; g.beginPath(); g.arc(1544, 412, 70, -Math.PI * .33, -Math.PI * .22); g.stroke();
        for (let j = 0; j <= 10; j++) { const a = -Math.PI * .78 + j * Math.PI * .056; g.strokeStyle = j > 8 ? '#c0392b' : '#2a2418'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(1544 + Math.cos(a) * 70, 412 + Math.sin(a) * 70); g.lineTo(1544 + Math.cos(a) * (j % 5 ? 62 : 58), 412 + Math.sin(a) * (j % 5 ? 62 : 58)); g.stroke(); }
        rotulo(g, 'VU', 1544, 390, 12, '#2a2418');
        marcas(g, 1510, 470, 24, 'rgba(30,28,24,.55)'); perilla(g, 1510, 470, 24, .7); rotulo(g, 'VOLUMEN', 1510, 520, 10, '#2a2620'); rotulo(g, 'AURIC.', 1598, 488, 9.5, '#2a2620'); toma(g, 1598, 514, 12);
        // el panel de conexiones
        gr = g.createLinearGradient(0, RB0, 0, RB1); gr.addColorStop(0, '#202226'); gr.addColorStop(1, '#16171a'); g.fillStyle = gr; g.fillRect(IX0 + 1, RB0, IX1 - IX0 - 2, RB1 - RB0);
        g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 1.5; g.strokeRect(IX0 + 1.5, RB0 + .5, IX1 - IX0 - 3, RB1 - RB0 - 1);
        tornillo(g, IX0 + 12, RB0 + 10); tornillo(g, IX1 - 12, RB0 + 10); tornillo(g, IX0 + 12, RB1 - 10); tornillo(g, IX1 - 12, RB1 - 10);
        rotulo(g, 'CONEXIONES', IX0 + 30, RB0 + 24, 13, '#f1ece2', 'left'); rotulo(g, 'UNA TOMA POR ALUMNO · LA MISMA NOTA, OTRO TIMBRE', IX1 - 30, RB0 + 24, 10.5, 'rgba(241,236,226,.55)', 'right');
        // cables de adorno (ya enchufados): la envolvente al filtro, el LFO al osciloscopio
        cable(g, 870, 514, 708, 514, '#f2c14e', 7, 40); clavija(g, 870, 514, '#f2c14e', 0); clavija(g, 708, 514, '#f2c14e', 0);
        cable(g, 1028, 512, 1404, 512, '#d8443a', 7, 44); clavija(g, 1028, 512, '#d8443a', 0); clavija(g, 1404, 512, '#d8443a', 0);
        cable(g, 750, 514, 1598, 514, '#5aa6d6', 6, 62); clavija(g, 750, 514, '#5aa6d6', 0); clavija(g, 1598, 514, '#5aa6d6', 0);
      }
      // las tomas de los alumnos, con su cinta y su nombre a mano (se pinta cada vez que cambia el bombo)
      function sitios() {
        const n = st.n, dos = n > 8, c = dos ? Math.ceil(n / 2) : n, w = (IX1 - IX0 - 60) / Math.max(1, c);
        st.tomas = st.items.map((nom, i) => {
          const fila = dos && i >= c ? 1 : 0, col = fila ? c - 1 - (i - c) : i;
          return { x: IX0 + 30 + (col + .5) * w, y: dos ? (fila ? 840 : 708) : 800, ti: tiDe(i), cw: w };
        });
        st.tomas.forEach((t, i) => {
          const R = rotula(g, MA, st.items[i] || '', Math.min(t.cw - 30, 190) - 18, 58, 30, 17, true);
          g.font = MA(R.px); const tw = Math.max(...R.lineas.map(x => g.measureText(x).width));
          t.cinta = { lineas: R.lineas, px: R.px, w: Math.max(70, Math.min(t.cw - 26, tw + 30)), h: R.lineas.length * R.px * 1.08 + 16, rot: (semilla(70 + i)() - .5) * .07 };
        });
      }
      function pintaTomas(g) {
        st.tomas.forEach((t, i) => {
          const c = t.cinta; if (!c) return;
          toma(g, t.x, t.y, 15);
          // la cinta: un trozo de cinta de carrocero, un poco torcido, con los bordes rotos
          const r = semilla(90 + i), y = t.y - 26 - c.h / 2;
          g.save(); g.translate(t.x, y); g.rotate(c.rot);
          g.beginPath(); g.moveTo(-c.w / 2, -c.h / 2);
          g.lineTo(c.w / 2, -c.h / 2); for (let q = 0; q <= 6; q++) g.lineTo(c.w / 2 + (r() - .5) * 5, -c.h / 2 + q * c.h / 6);
          g.lineTo(-c.w / 2, c.h / 2); for (let q = 6; q >= 0; q--) g.lineTo(-c.w / 2 + (r() - .5) * 5, -c.h / 2 + q * c.h / 6);
          g.closePath(); g.fillStyle = 'rgba(0,0,0,.35)'; g.save(); g.translate(1.5, 2.5); g.fill(); g.restore();
          const gr = g.createLinearGradient(0, -c.h / 2, 0, c.h / 2); gr.addColorStop(0, '#f1e6c8'); gr.addColorStop(1, '#ddcda4'); g.fillStyle = gr; g.fill();
          g.fillStyle = 'rgba(120,100,60,.08)'; for (let q = 0; q < 40; q++) g.fillRect(-c.w / 2 + r() * c.w, -c.h / 2 + r() * c.h, 1 + r() * 3, 1);
          g.fillStyle = '#25211c'; g.font = MA(c.px); g.textAlign = 'center'; g.textBaseline = 'middle';
          c.lineas.forEach((x, q) => g.fillText(x, 0, (q - (c.lineas.length - 1) / 2) * c.px * 1.08 + 2));
          g.restore();
        });
      }
      function ajusta(s) { if (L.ajusta(s) || !fijo) { fijo = capaFija(L.k, pintaFijo); if (st.n) etiq = capaFija(L.k, pintaTomas, IX0, RB0, IX1 - IX0, RB1 - RB0); } }
      function monta(items) { st.items = items.slice(); st.n = items.length; sitios(); if (L.k) etiq = capaFija(L.k, pintaTomas, IX0, RB0, IX1 - IX0, RB1 - RB0); }

      /* ── cada fotograma ── */
      const onda = (ti, x, t) => {
        const p = 6.2832 * x, sw = u => 2 * (u - Math.floor(u + .5));
        switch (ti) {
          case 0: return Math.sin(p);
          case 1: return 2 / Math.PI * Math.asin(Math.sin(p));
          case 2: return sw(x);
          case 3: return Math.tanh(Math.sin(p) * 9) * .92;
          case 4: return Math.sin(p + 2.2 * Math.sin(3 * p) * (.6 + .4 * Math.cos(t * 2)));
          case 5: { let s = 0; for (let h = 1; h <= 9; h++) s += Math.sin(h * p) / h * (h === 5 ? 3.2 : 1); return s * .45; }
          case 6: return (Math.sin(p) + .5 * Math.sin(2 * p) + .33 * Math.sin(3 * p) + .25 * Math.sin(4 * p)) * .62;
          case 7: return (sw(x) + sw(x * 1.012 + t * .3) + sw(x * .988 - t * .25)) * .36;
          default: return (Math.sin(p) + Math.sin(p * 1.25) + Math.sin(p * 1.5) + Math.sin(p * 2)) * .3;     // el acorde
        }
      };
      function pintaVivo(dt) {
        // la luz del timbre que suena, en la lista del oscilador
        TIMBRES.forEach((_, j) => luz(g, 446, 322 + j * 24.5, j === st.tipo ? clamp(.35 + st.nivel, 0, 1) : 0, '255,110,80', 4));
        perilla(g, 372, 352, 44, -.5 + .08 * Math.sin(st.t * .7) * mov, true);
        perilla(g, 670, 346, 40, st.tipo === 5 ? -1.6 + 2.6 * st.nivel : -.3 + .1 * Math.sin(st.t) * mov);
        perilla(g, 622, 466, 24, st.tipo === 5 ? 1.6 : .2, true);
        luz(g, 1028, 440, mov ? .5 + .5 * Math.sin(st.t * 6.283 * 1.8) : .6, '255,70,50', 5);
        // el osciloscopio
        g.save(); rr(g, 1116, 290, 304, 176, 12); g.clip(); g.globalCompositeOperation = 'lighter';
        const ti = st.fin ? 8 : st.tipo, A_ = 58 * (.55 + .45 * Math.max(st.nivel, st.fin)), fase = st.t * .6 * mov, pts = [];
        for (let x = 0; x <= 304; x += 2) pts.push([1116 + x, 378 - A_ * onda(ti, x / 120 + fase, st.t)]);
        const traza = () => { g.beginPath(); pts.forEach(([x, y], j) => j ? g.lineTo(x, y) : g.moveTo(x, y)); };
        traza(); g.strokeStyle = 'rgba(80,255,150,.18)'; g.lineWidth = 9; g.stroke(); traza(); g.strokeStyle = 'rgba(150,255,190,.9)'; g.lineWidth = 2.2; g.stroke();
        g.restore();
        rotulo(g, st.fin ? 'ACORDE · ' + TIMBRES[st.tipo] : TIMBRES[st.tipo], 1268, 455, 11, 'rgba(150,255,190,.75)');
        // el vúmetro
        st.vu += (st.nivel - st.vu) * Math.min(1, dt * 14);
        const a = -Math.PI * .76 + Math.PI * .52 * clamp(st.vu * .9 + .04, 0, 1);
        g.save(); g.beginPath(); rr(g, 1474, 318, 140, 92, 6); g.clip(); g.strokeStyle = '#1a1612'; g.lineWidth = 2; g.beginPath(); g.moveTo(1544, 412); g.lineTo(1544 + Math.cos(a) * 76, 412 + Math.sin(a) * 76); g.stroke(); g.restore();
        luz(g, 1612, 290, 1, '255,60,40', 4);
        // las luces de las tomas: la que tiene el cable, y la elegida
        st.tomas.forEach((t, i) => {
          const on = Math.max(i === st.dentro ? .5 + .5 * st.nivel : 0, i === st.elegido ? st.luzFin : 0);
          luz(g, t.x + 26, t.y - 2, on, '255,170,70', 4.4);
          if (i === st.elegido && st.luzFin > .02) {
            const c = t.cinta, y = t.y - 26 - c.h / 2, pul = .8 + .2 * Math.sin(st.t * 4) * mov;
            g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(t.x, y, 10, t.x, y, c.w * .9); gr.addColorStop(0, `rgba(255,150,90,${.32 * st.luzFin * pul})`); gr.addColorStop(1, 'rgba(255,150,90,0)'); g.fillStyle = gr; g.fillRect(t.x - c.w, y - c.w, c.w * 2, c.w * 2); g.restore();
            g.save(); g.translate(t.x, y); g.rotate(c.rot); rr(g, -c.w / 2 - 5, -c.h / 2 - 5, c.w + 10, c.h + 10, 6); g.strokeStyle = `rgba(255,122,95,${st.luzFin})`; g.lineWidth = 2.5; g.stroke(); g.restore();
          }
        });
        st.nivel = Math.max(0, st.nivel - dt * 2.2);
      }
      // el cable coral: de la salida del oscilador a la clavija, que salta de toma en toma
      function sitioClavija() {
        const n = st.n; if (!n) return null;
        const b = Math.floor(st.s), u = st.s - b, q = eio(clamp((u - .3) / .4, 0, 1)), A_ = st.tomas[((b % n) + n) % n], B_ = st.tomas[(((b + 1) % n) + n) % n];
        if (!A_ || !B_) return null;
        const d = Math.hypot(B_.x - A_.x, B_.y - A_.y), alza = Math.sin(Math.PI * q);
        return { x: lerp(A_.x, B_.x, q), y: lerp(A_.y, B_.y, q) - alza * (26 + d * .12), alza, dentro: q === 0 ? ((b % n) + n) % n : q === 1 ? (((b + 1) % n) + n) % n : -1 };
      }
      function pintaCable() {
        clavija(g, OUT.x, OUT.y, CORAL, 0);
        const p = sitioClavija(); if (!p) return;
        const d = Math.abs(p.x - OUT.x), cuelga = 150 + clamp(d * .1, 0, 110) + 6 * Math.sin(st.t * 3.1) * st.latido;
        cable(g, OUT.x, OUT.y + 10, p.x, p.y + 10, CORAL, 8, cuelga);
        clavija(g, p.x, p.y, CORAL, p.alza);
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt; st.latido = Math.max(0, st.latido - dt * 1.5);
        L.borra(); if (fijo) ponCapa(g, fijo); if (etiq) ponCapa(g, etiq);
        pintaVivo(dt); pintaCable();
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.sinte.fuentes, () => { if (!vivo) return; fijo = capaFija(L.k || 1, pintaFijo); if (st.n) { sitios(); etiq = capaFija(L.k || 1, pintaTomas, IX0, RB0, IX1 - IX0, RB1 - RB0); } });

      /* ── el sonido: la misma nota (La) con el timbre de cada toma; el clic de la clavija; el acorde final ── */
      function fm(f, t, dur, gan, pan, wet) {
        const ac = A.ac, t0 = ac.currentTime + t, c = ac.createOscillator(), m = ac.createOscillator(), mg = ac.createGain(), g_ = ac.createGain();
        c.frequency.value = f; m.frequency.value = f * 3.5; mg.gain.setValueAtTime(f * 2.5, t0); mg.gain.exponentialRampToValueAtTime(f * .08, t0 + dur);
        m.connect(mg); mg.connect(c.frequency); g_.gain.setValueAtTime(0, t0); g_.gain.linearRampToValueAtTime(gan * 1.1, t0 + .005); g_.gain.exponentialRampToValueAtTime(.0005, t0 + dur);
        c.connect(g_); g_.connect(A.via(1, wet, pan)); c.start(t0); m.start(t0); c.stop(t0 + dur + .05); m.stop(t0 + dur + .05);
      }
      function filtrada(f, t, dur, gan, pan, wet) {
        const ac = A.ac, t0 = ac.currentTime + t, os = ac.createOscillator(), lp = ac.createBiquadFilter(), g_ = ac.createGain();
        os.type = 'sawtooth'; os.frequency.value = f; lp.type = 'lowpass'; lp.Q.value = 13; lp.frequency.setValueAtTime(f * 1.2, t0); lp.frequency.exponentialRampToValueAtTime(Math.min(9000, f * 14), t0 + dur * .35); lp.frequency.exponentialRampToValueAtTime(f * 2, t0 + dur);
        g_.gain.setValueAtTime(0, t0); g_.gain.linearRampToValueAtTime(gan * .5, t0 + .008); g_.gain.exponentialRampToValueAtTime(.0005, t0 + dur);
        os.connect(lp); lp.connect(g_); g_.connect(A.via(1, wet, pan)); os.start(t0); os.stop(t0 + dur + .05);
      }
      function suena(ti, f, o) {
        if (!A.ac) return; const t = o.t || 0, dur = o.dur || .3, gan = o.gan || .1, pan = o.pan || 0, wet = o.wet == null ? .3 : o.wet;
        if (ti === 0) A.nota(f, { tipo: 'sine', t, dur, gan: gan * 1.25, wet, pan });
        else if (ti === 1) A.nota(f, { tipo: 'triangle', t, dur, gan: gan * 1.15, wet, pan });
        else if (ti === 2) A.nota(f, { tipo: 'sawtooth', t, dur, gan: gan * .5, wet, pan, filtro: { f: 6000 } });
        else if (ti === 3) A.nota(f, { tipo: 'square', t, dur, gan: gan * .42, wet, pan, filtro: { f: 5000 } });
        else if (ti === 4) fm(f, t, dur, gan, pan, wet);
        else if (ti === 5) filtrada(f, t, dur, gan, pan, wet);
        else if (ti === 6) [1, 2, 3, 4, 6].forEach((h, j) => A.nota(f * h, { tipo: 'sine', t, dur, gan: gan * [.9, .45, .3, .2, .12][j], wet, pan, ataque: .015 }));
        else [-9, 0, 8].forEach(c => A.nota(f * Math.pow(2, c / 1200), { tipo: 'sawtooth', t, dur, gan: gan * .22, wet: wet + .1, pan, ataque: .03, filtro: { f: 2400 } }));
      }

      return {
        ajusta,
        espera() {},
        async gira(bombo, k) {
          const gen = ++st.gen; monta(bombo);
          const n = st.n; st.elegido = -1; st.luzFin = 0; st.fin = 0;
          const s0 = Math.round(st.s); let s1 = s0 + (RM ? n : Math.max(2 * n, 18)); s1 += ((k - s1) % n + n) % n;
          const f = recorrido(s0, s1, RM ? { T: 1.6, amago: .08, retro: 0, sobra: 0, rebote: .1, p: 2.2 } : { p: 2.6, amago: .3, retro: .2, sobra: .04, rebote: .2 });
          const ac = A.crea(); let tNota = 0;
          await new Promise(ok => {
            const t0 = performance.now(); let antes = -2, sAnt = s0, tA = t0;
            (function paso() {
              if (gen !== st.gen || !vivo) return ok();
              const ahora = performance.now(), t = Math.min(f.T, (ahora - t0) / 1000), s = f(t), vel = Math.abs(s - sAnt) / Math.max(.008, (ahora - tA) / 1000); sAnt = s; tA = ahora; st.s = s;
              const p = sitioClavija();
              if (p && p.dentro !== antes) {
                if (p.dentro >= 0) {
                  const tm = st.tomas[p.dentro]; st.dentro = p.dentro; st.tipo = tm.ti; st.nivel = 1; st.latido = 1;
                  if (ac && ahora - tNota > 45) { tNota = ahora; const pan = clamp((tm.x - 960) / 1000, -.8, .8);
                    A.clic({ f: 2300, q: 3, gan: .22, dur: .02, pan }); suena(tm.ti, 220, { dur: clamp(.16 + .9 / (vel + 1), .16, .7), gan: .085, pan }); }
                } else { st.dentro = -1; if (ac && vel < 9) A.clic({ f: 3400, q: 4, gan: .08, dur: .012 }); }
                antes = p.dentro;
              }
              if (t < f.T) requestAnimationFrame(paso); else { st.s = s1; ok(); }
            })();
          });
          if (gen !== st.gen) return;
          // enchufado: su luz, su cinta y el acorde con su timbre
          const tm = st.tomas[k]; st.elegido = k; st.dentro = k; st.tipo = tm.ti; st.fin = 1; st.nivel = 1;
          if (ac) { const pan = clamp((tm.x - 960) / 1000, -.6, .6); A.clic({ f: 1900, q: 3, gan: .35, dur: .025, pan });
            [220, 277.18, 329.63, 440].forEach((fr, j) => suena(tm.ti, fr, { t: .06 + j * .07, dur: 2.6, gan: .075, wet: .5, pan: pan * .5 }));
            suena(tm.ti, 659.25, { t: .42, dur: 2.2, gan: .05, wet: .6 }); }
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 600; (function p_() { if (gen !== st.gen) return ok(); const u = clamp((performance.now() - t0) / d, 0, 1); st.luzFin = eo(u, 2); st.nivel = Math.max(st.nivel, .8); if (u < 1) requestAnimationFrame(p_); else ok(); })(); });
        },
        quita() { vivo = false; cancelAnimationFrame(raf); }
      };
    }
  };

  /* ── «taller» · Fonógrafo · el montaje: la mesa del taller y la lupa ──
     (22-oct-2026, v5) La mesa del despacho donde se monta el fonógrafo, a la luz de gas, con su tapete verde: las piezas de
     latón (ruedas dentadas, la manivela, el cabezal con su mica, la bocina, un muelle, los tornillos y el cilindro de cera),
     cada una con su etiqueta de cartón atada con un hilo y un nombre escrito. Una lupa de latón recorre las etiquetas (lo que
     pasa por debajo se ve grande), frena, se para en una, se acerca un poco más… y esa es. Sin campanitas: el roce de la lupa
     sobre el tapete, el papel de cada etiqueta y, al final, el «clac» de una pieza que encaja. (La grabación, con el cilindro.) */
  TEMAS.taller = {
    fuentes: ['400 20px Jost', '300 17px Jost', 'italic 400 96px "Bodoni 72"'],
    nombreFit: { min: 50 },
    css: `
.lmv-t-taller .lmv-velo{background:radial-gradient(ellipse at 30% 20%,rgba(46,30,16,.97) 0%,rgba(22,15,9,.985) 60%,rgba(8,6,4,.995) 100%)}
.lmv-t-taller .lmv-cab{top:28px}
.lmv-t-taller .lmv-ceja{font:400 20px/1 Jost,"Iowan Old Style",Palatino,Georgia,serif;letter-spacing:.5em;text-transform:uppercase;color:#C9A24A;text-shadow:0 2px 10px rgba(0,0,0,.8)}
.lmv-t-taller .lmv-grupo{margin-top:12px;font:300 17px/1 Jost,"Iowan Old Style",Palatino,Georgia,serif;letter-spacing:.3em;text-transform:uppercase;color:#BCAF97;text-shadow:0 2px 10px rgba(0,0,0,.8)}
.lmv-t-taller .lmv-nombre{top:86px;left:280px;right:280px;height:160px;display:flex;align-items:center;justify-content:center;font:italic 400 96px/1.1 "Bodoni 72","Bodoni MT",Didot,"Playfair Display",Georgia,serif;color:#F2D793;text-shadow:0 0 30px rgba(240,184,96,.5),0 4px 18px rgba(0,0,0,.9)}
.lmv-t-taller .lmv-nota{top:944px;font:italic 400 22px/1.35 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;color:#DCCDB0;text-shadow:0 2px 10px rgba(0,0,0,.9)}
.lmv-t-taller .lmv-pie{bottom:26px}
.lmv-t-taller .lmv-b{display:inline-flex;align-items:center;gap:12px;padding:16px 30px;border-radius:6px;border:1px solid rgba(201,162,74,.7);background:rgba(20,14,9,.78);color:#DCCDB0;font:400 20px/1 Jost,Georgia,serif;letter-spacing:.24em;text-transform:uppercase;transition:color .25s,border-color .25s,background .25s}
.lmv-t-taller .lmv-b:hover{color:#F0B860;border-color:#C9A24A}
.lmv-t-taller .lmv-b.lmv-otra{background:linear-gradient(#F2D793,#C9A24A 55%,#8a6a2a);border-color:#F2D793;color:#2A1E0A;font-weight:500}
.lmv-t-taller .lmv-b.lmv-otra:hover{color:#000}
.lmv-t-taller .lmv-cargando{color:#F0B860}
.lmv-of-taller .lmv-ob{font-family:"Bodoni 72","Bodoni MT",Didot,"Playfair Display",Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(24px,2.6vw,36px);letter-spacing:.02em;border:2px solid #C9A24A;border-radius:6px;background:linear-gradient(#3c2816,#22160c);color:#F2D793;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 40px rgba(240,184,96,.18)}
.lmv-of-taller .lmv-og,.lmv-of-taller .lmv-no{font-family:Jost,Georgia,serif;color:#DCCDB0}
@media (prefers-reduced-motion:reduce){.lmv-t-taller .lmv-nombre.ve{animation:none;opacity:1}}`,
    crea(esc, o) {
      const L = lienzo(esc), g = L.g, RM = reducido(), mov = RM ? 0 : 1;
      const BO = px => `italic 400 ${px}px "Bodoni 72", "Bodoni MT", Didot, "Playfair Display", Georgia, serif`;
      const JO = (px, w) => `${w || 400} ${px}px Jost, "Iowan Old Style", Palatino, Georgia, serif`;
      const TX0 = 236, TX1 = 1684, TY0 = 288, TY1 = 928;                 // el tapete
      const ZX0 = 270, ZX1 = 1650, ZY0 = 318, ZY1 = 902;                 // donde van las etiquetas
      const RL = 126, MAG = 1.6;                                          // la lupa
      const LATON = ['#fbe7a6', '#d9b45c', '#a17a2c', '#5e4214'];
      const st = { items: [], n: 0, et: [], s: 0, t: 0, gen: 0, elegido: -1, luzFin: 0, alza: 0, zoom: MAG, vel: 0, cerca: -1 };
      let fondo = null, mesa = null, raf = 0, vivo = true;
      const laton = (g, x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, LATON[0]); gr.addColorStop(.35, LATON[1]); gr.addColorStop(.75, LATON[2]); gr.addColorStop(1, LATON[3]); return gr; };

      /* ── las piezas (vistas desde arriba, a la luz de gas, que viene de arriba a la izquierda) ── */
      function rueda(g, r, dientes, rayos) {
        g.beginPath(); for (let j = 0; j < dientes * 2; j++) { const a = j * Math.PI / dientes, rr_ = j % 2 ? r : r * .86, a2 = a + Math.PI / dientes; g.lineTo(Math.cos(a) * rr_, Math.sin(a) * rr_); g.lineTo(Math.cos(a2 - .08) * rr_, Math.sin(a2 - .08) * rr_); }
        g.closePath(); g.fillStyle = laton(g, -r, -r, r, r); g.fill(); g.strokeStyle = 'rgba(60,40,10,.6)'; g.lineWidth = 1; g.stroke();
        g.beginPath(); g.arc(0, 0, r * .72, 0, 6.283); g.strokeStyle = 'rgba(80,56,16,.5)'; g.lineWidth = 1.4; g.stroke();
        if (rayos) { g.fillStyle = 'rgba(28,30,24,.9)'; for (let j = 0; j < rayos; j++) { const a = j * 6.283 / rayos + .3; g.beginPath(); g.moveTo(Math.cos(a - .32) * r * .26, Math.sin(a - .32) * r * .26); g.arc(0, 0, r * .66, a - .4, a + .4); g.lineTo(Math.cos(a + .32) * r * .26, Math.sin(a + .32) * r * .26); g.closePath(); g.fill(); } }
        g.beginPath(); g.arc(0, 0, r * .2, 0, 6.283); g.fillStyle = laton(g, -r * .2, -r * .2, r * .2, r * .2); g.fill(); g.beginPath(); g.arc(0, 0, r * .08, 0, 6.283); g.fillStyle = '#1b1c18'; g.fill();
      }
      function pieza(g, p) {
        g.save(); g.translate(p.x, p.y); g.rotate(p.a); const r = p.r;
        g.save(); g.translate(6, 9); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(0, 0, r * 1.05, r * (p.tipo === 1 || p.tipo === 4 ? .6 : 1), 0, 0, 6.283); g.fill(); g.restore();
        if (p.tipo === 0) rueda(g, r, 18, 5);
        else if (p.tipo === 1) {                                     // el cilindro de cera
          const w = r * 2.1, h = r * 1.1, gr = g.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, '#a8784a'); gr.addColorStop(.3, '#7c5230'); gr.addColorStop(1, '#3e2614');
          rr(g, -w / 2, -h / 2, w, h, h * .2); g.fillStyle = gr; g.fill(); g.strokeStyle = 'rgba(30,18,8,.35)'; g.lineWidth = .8; for (let x = -w / 2 + 6; x < w / 2 - 4; x += 3.2) { g.beginPath(); g.moveTo(x, -h / 2 + 2); g.lineTo(x, h / 2 - 2); g.stroke(); }
          g.fillStyle = 'rgba(255,230,190,.25)'; g.fillRect(-w / 2 + 4, -h / 2 + h * .18, w - 8, h * .12);
          g.beginPath(); g.ellipse(w / 2, 0, h * .18, h / 2, 0, 0, 6.283); g.fillStyle = '#5a381c'; g.fill(); g.beginPath(); g.ellipse(w / 2, 0, h * .08, h * .26, 0, 0, 6.283); g.fillStyle = '#20140a'; g.fill();
        } else if (p.tipo === 2) {                                   // la bocina
          g.beginPath(); g.moveTo(-r * 1.2, -r * .14); g.lineTo(r * .7, -r * .78); g.lineTo(r * .7, r * .78); g.lineTo(-r * 1.2, r * .14); g.closePath(); g.fillStyle = laton(g, -r, -r, r, r); g.fill();
          g.strokeStyle = 'rgba(80,56,16,.35)'; g.lineWidth = 1; for (let j = 1; j < 5; j++) { const x = -r * 1.2 + j * r * .38; g.beginPath(); g.moveTo(x, -r * (.14 + j * .128)); g.lineTo(x, r * (.14 + j * .128)); g.stroke(); }
          g.beginPath(); g.ellipse(r * .7, 0, r * .22, r * .82, 0, 0, 6.283); g.fillStyle = laton(g, r * .5, -r, r, r); g.fill(); g.beginPath(); g.ellipse(r * .72, 0, r * .13, r * .66, 0, 0, 6.283); g.fillStyle = '#2a1c08'; g.fill();
        } else if (p.tipo === 3) {                                   // el cabezal: el aro de latón, la mica y la aguja
          g.beginPath(); g.arc(0, 0, r * .9, 0, 6.283); g.fillStyle = laton(g, -r, -r, r, r); g.fill();
          g.beginPath(); g.arc(0, 0, r * .66, 0, 6.283); const gr = g.createRadialGradient(-r * .2, -r * .25, 2, 0, 0, r * .66); gr.addColorStop(0, 'rgba(255,250,236,.85)'); gr.addColorStop(1, 'rgba(160,150,120,.6)'); g.fillStyle = gr; g.fill();
          for (let j = 0; j < 6; j++) { const a = j * 1.047; g.beginPath(); g.arc(Math.cos(a) * r * .78, Math.sin(a) * r * .78, 2.2, 0, 6.283); g.fillStyle = '#5e4214'; g.fill(); }
          g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(r * .5, r * .52); g.stroke();
        } else if (p.tipo === 4) {                                   // la manivela
          g.lineCap = 'round'; g.strokeStyle = laton(g, -r, 0, r, 0); g.lineWidth = r * .2; g.beginPath(); g.moveTo(-r * 1.1, 0); g.lineTo(r * .6, 0); g.lineTo(r * .6, -r * .55); g.stroke();
          g.beginPath(); g.ellipse(r * .6, -r * .78, r * .16, r * .3, 0, 0, 6.283); g.fillStyle = '#2b1a0c'; g.fill(); g.beginPath(); g.arc(-r * 1.1, 0, r * .2, 0, 6.283); g.fillStyle = laton(g, -r * 1.3, -r * .2, -r * .9, r * .2); g.fill();
        } else if (p.tipo === 5) {                                   // el muelle
          g.strokeStyle = laton(g, -r, -r, r, r); g.lineWidth = 2.6; g.beginPath(); for (let j = 0; j <= 60; j++) { const u = j / 60, a = u * 6.283 * 4.5, rr_ = r * (.2 + .78 * u); g.lineTo(Math.cos(a) * rr_, Math.sin(a) * rr_); } g.stroke();
        } else if (p.tipo === 6) {                                   // tornillos
          [[-r * .5, -r * .3], [r * .4, -r * .1], [-r * .1, r * .45]].forEach(([x, y], j) => { g.save(); g.translate(x, y); g.rotate(j); g.fillStyle = laton(g, -8, -8, 8, 8); g.beginPath(); g.arc(0, 0, r * .26, 0, 6.283); g.fill(); g.strokeStyle = '#3a2808'; g.lineWidth = 2; g.beginPath(); g.moveTo(-r * .18, 0); g.lineTo(r * .18, 0); g.stroke(); g.restore(); });
        } else rueda(g, r * .8, 12, 0);
        g.restore();
      }
      // la etiqueta de cartón, con su ojal, el hilo hasta la pieza y el nombre
      function etiqueta(g, e) {
        g.save(); g.strokeStyle = 'rgba(214,196,150,.9)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(e.ox, e.oy); g.bezierCurveTo(e.ox - 30, e.oy + 18, e.p.x + 30, e.p.y + 20, e.p.x + e.p.r * .3, e.p.y); g.stroke(); g.restore();
        g.save(); g.translate(e.x, e.y); g.rotate(e.a);
        const w = e.w, h = e.h, c = h * .3;
        const forma = () => { g.beginPath(); g.moveTo(-w / 2 + c, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(w / 2, h / 2); g.lineTo(-w / 2 + c, h / 2); g.lineTo(-w / 2, h / 2 - c); g.lineTo(-w / 2, -h / 2 + c); g.closePath(); };
        g.save(); g.translate(4, 6); forma(); g.fillStyle = 'rgba(0,0,0,.4)'; g.fill(); g.restore();
        forma(); const gr = g.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, '#f1e7cc'); gr.addColorStop(1, '#d9c9a2'); g.fillStyle = gr; g.fill();
        g.strokeStyle = 'rgba(120,96,50,.45)'; g.lineWidth = 1; g.stroke();
        g.beginPath(); g.arc(-w / 2 + h * .32, 0, h * .14, 0, 6.283); g.fillStyle = laton(g, -w / 2, -h * .2, -w / 2 + h * .5, h * .2); g.fill(); g.beginPath(); g.arc(-w / 2 + h * .32, 0, h * .07, 0, 6.283); g.fillStyle = '#20301f'; g.fill();
        g.fillStyle = '#2a1d0c'; g.font = BO(e.px); g.textAlign = 'center'; g.textBaseline = 'middle';
        e.lineas.forEach((t, q) => g.fillText(t, h * .2, (q - (e.lineas.length - 1) / 2) * e.px * 1.06 + 2));
        g.restore();
      }

      /* ── la mesa (lo que no se mueve): madera, tapete, la luz de gas y lo que hay alrededor ── */
      function pintaFondo(g) {
        const r = semilla(17);
        for (let y = 0, q = 0; y < 1080; y += 120, q++) {
          const gr = g.createLinearGradient(0, y, 0, y + 120); gr.addColorStop(0, '#4a2e16'); gr.addColorStop(.5, '#5c3a1c'); gr.addColorStop(1, '#3a2210'); g.fillStyle = gr; g.fillRect(0, y, 1920, 120);
          g.fillStyle = 'rgba(16,8,3,.6)'; g.fillRect(0, y + 118, 1920, 2);
          g.strokeStyle = 'rgba(24,12,4,.28)'; g.lineWidth = 1; for (let j = 0; j < 14; j++) { const yy = y + 8 + r() * 104, x0 = r() * 1920, w = 200 + r() * 700, a = r() * 6; g.beginPath(); g.moveTo(x0, yy); for (let x = 0; x <= w; x += 20) g.lineTo(x0 + x, yy + Math.sin(x * .01 + a) * 3); g.stroke(); }
        }
        // el tapete verde con sus esquineras de latón
        g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 24; g.shadowOffsetY = 8; rr(g, TX0, TY0, TX1 - TX0, TY1 - TY0, 10); g.fillStyle = '#1f3a2b'; g.fill(); g.restore();
        let gr = g.createRadialGradient(700, 420, 60, 760, 520, 1100); gr.addColorStop(0, '#2f5640'); gr.addColorStop(1, '#14271d'); rr(g, TX0, TY0, TX1 - TX0, TY1 - TY0, 10); g.fillStyle = gr; g.fill();
        g.save(); rr(g, TX0, TY0, TX1 - TX0, TY1 - TY0, 10); g.clip(); for (let j = 0; j < 9000; j++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.06)' : 'rgba(160,220,180,.04)'; g.fillRect(TX0 + r() * (TX1 - TX0), TY0 + r() * (TY1 - TY0), 1.5, 1.5); } g.restore();
        rr(g, TX0 + 8, TY0 + 8, TX1 - TX0 - 16, TY1 - TY0 - 16, 6); g.strokeStyle = 'rgba(214,190,120,.18)'; g.lineWidth = 1.5; g.stroke();
        [[TX0, TY0, 1, 1], [TX1, TY0, -1, 1], [TX0, TY1, 1, -1], [TX1, TY1, -1, -1]].forEach(([x, y, sx, sy]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x + sx * 46, y); g.lineTo(x, y + sy * 46); g.closePath(); g.fillStyle = laton(g, x, y, x + sx * 46, y + sy * 46); g.fill(); });
        // a la izquierda: el pie de la lámpara de gas y el tintero; a la derecha: el destornillador, los alicates y la aceitera
        g.save(); g.translate(118, 168); gr = g.createRadialGradient(-10, -12, 4, 0, 0, 70); gr.addColorStop(0, '#fbe7a6'); gr.addColorStop(.5, '#b98d3c'); gr.addColorStop(1, '#4a3310'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 66, 0, 6.283); g.fill();
        g.beginPath(); g.arc(0, 0, 40, 0, 6.283); g.strokeStyle = 'rgba(70,48,12,.6)'; g.lineWidth = 2; g.stroke(); g.beginPath(); g.arc(0, 0, 18, 0, 6.283); g.fillStyle = '#d9b45c'; g.fill(); g.restore();
        g.save(); g.translate(120, 860); g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.arc(6, 8, 46, 0, 6.283); g.fill(); gr = g.createRadialGradient(-12, -14, 4, 0, 0, 46); gr.addColorStop(0, '#5a6a78'); gr.addColorStop(1, '#141a20'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 44, 0, 6.283); g.fill();
        g.beginPath(); g.arc(0, 0, 16, 0, 6.283); g.fillStyle = '#05070a'; g.fill(); g.strokeStyle = '#efe6d2'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(4, -4); g.quadraticCurveTo(50, -80, 96, -170); g.stroke();
        g.strokeStyle = 'rgba(239,230,210,.5)'; g.lineWidth = 1; for (let j = 0; j < 14; j++) { const u = .45 + j * .04, x = lerp(4, 96, u), y = lerp(-4, -170, u); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 16 + j * .5, y - 4); g.stroke(); } g.restore();
        g.save(); g.translate(1800, 420); g.rotate(1.1); g.fillStyle = 'rgba(0,0,0,.35)'; rr(g, -88, -10, 220, 26, 8); g.fill(); gr = g.createLinearGradient(0, -14, 0, 14); gr.addColorStop(0, '#9a5a2a'); gr.addColorStop(1, '#4a240c'); g.fillStyle = gr; rr(g, -96, -14, 110, 28, 12); g.fill();
        g.fillStyle = laton(g, 14, -8, 30, 8); g.fillRect(14, -9, 16, 18); gr = g.createLinearGradient(0, -5, 0, 5); gr.addColorStop(0, '#e8e8e8'); gr.addColorStop(1, '#7a7a7a'); g.fillStyle = gr; g.fillRect(30, -4, 96, 8); g.restore();
        g.save(); g.translate(1806, 780); g.rotate(-.5); g.strokeStyle = '#2c2c30'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(-70, -16); g.quadraticCurveTo(0, -4, 60, 4); g.moveTo(-70, 16); g.quadraticCurveTo(0, 4, 60, -4); g.stroke();
        g.fillStyle = '#6e1f18'; rr(g, -122, -24, 60, 16, 6); g.fill(); rr(g, -122, 8, 60, 16, 6); g.fill(); g.restore();
        g.save(); g.translate(1806, 200); g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.arc(8, 10, 52, 0, 6.283); g.fill(); g.fillStyle = laton(g, -50, -50, 50, 50); g.beginPath(); g.arc(0, 0, 50, 0, 6.283); g.fill(); g.beginPath(); g.arc(0, 0, 14, 0, 6.283); g.fillStyle = '#3a2808'; g.fill();
        g.strokeStyle = 'rgba(80,56,16,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 34, 0, 6.283); g.stroke(); g.restore();
        // la luz de gas, desde arriba a la izquierda, y las esquinas en penumbra
        gr = g.createRadialGradient(330, 140, 40, 520, 360, 1500); gr.addColorStop(0, 'rgba(255,206,130,.3)'); gr.addColorStop(.45, 'rgba(240,184,96,.08)'); gr.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
        gr = g.createLinearGradient(0, 0, 0, 270); gr.addColorStop(0, 'rgba(8,5,2,.55)'); gr.addColorStop(1, 'rgba(8,5,2,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1920, 270);
      }
      function pintaMesa(g) { st.et.forEach(e => pieza(g, e.p)); st.et.forEach(e => etiqueta(g, e)); }
      function coloca() {
        const n = st.n, filas = n <= 6 ? 2 : n <= 12 ? 3 : 4, cols = Math.ceil(n / filas), cw = (ZX1 - ZX0) / cols, ch = (ZY1 - ZY0) / filas;
        const tw = Math.min(260, cw * .64), th = Math.min(88, ch * .5), pr = clamp(Math.min(cw, ch) * .22, 22, 46);
        st.et = st.items.map((nom, i) => {
          const r = semilla(400 + i * 17 + n), fila = Math.floor(i / cols), j = i % cols, col = fila % 2 ? cols - 1 - j : j;
          const cx = ZX0 + (col + .5) * cw + (r() - .5) * cw * .1, cy = ZY0 + (fila + .5) * ch + (r() - .5) * ch * .16, a = (r() - .5) * .2;
          const x = cx + pr * .55, y = cy, ox = x - Math.cos(a) * (tw / 2 - th * .32), oy = y - Math.sin(a) * (tw / 2 - th * .32);
          const R_ = rotula(g, BO, nom, tw - th * .55 - 18, th - 14, 40, 17, true);
          return { i, x, y, a, w: tw, h: th, ox, oy, lineas: R_.lineas, px: R_.px, p: { x: x - tw / 2 - pr - 16, y: y + (r() - .5) * th * .5, r: pr, a: r() * 6.283, tipo: (i * 5 + 3) % 8 } };
        });
      }
      function ajusta(s) { if (L.ajusta(s) || !fondo) { fondo = capaFija(L.k, pintaFondo); if (st.n) mesa = capaFija(L.k, pintaMesa); } }
      function monta(items) { st.items = items.slice(); st.n = items.length; coloca(); if (L.k) mesa = capaFija(L.k, pintaMesa); }

      /* ── la lupa ── */
      function enS(s) {
        const n = st.n, b = Math.floor(s), u0 = s - b, u = u0 - .55 * Math.sin(6.2832 * u0) / 6.2832, P = j => st.et[((j % n) + n) % n];
        const p0 = P(b - 1), p1 = P(b), p2 = P(b + 1), p3 = P(b + 2);
        const cr = (a, b_, c, d) => .5 * (2 * b_ + (-a + c) * u + (2 * a - 5 * b_ + 4 * c - d) * u * u + (-a + 3 * b_ - 3 * c + d) * u * u * u);
        return { x: cr(p0.x, p1.x, p2.x, p3.x), y: cr(p0.y, p1.y, p2.y, p3.y) };
      }
      function pintaLupa() {
        if (!st.n) return;
        const c = enS(st.s), al = st.alza, r = RL * (1 + .05 * al), z = st.zoom, ha = .78;
        const hx = c.x + Math.cos(ha) * (r + 14), hy = c.y + Math.sin(ha) * (r + 14);
        // la sombra en el tapete (la luz viene de arriba a la izquierda)
        g.save(); g.fillStyle = `rgba(0,0,0,${.34 - .08 * al})`; const dx = 24 + 26 * al, dy = 30 + 30 * al;
        g.beginPath(); g.arc(c.x + dx, c.y + dy, r + 14, 0, 6.283); g.fill(); g.lineCap = 'round'; g.strokeStyle = `rgba(0,0,0,${.3 - .08 * al})`; g.lineWidth = 30; g.beginPath(); g.moveTo(hx + dx, hy + dy); g.lineTo(hx + dx + Math.cos(ha) * 200, hy + dy + Math.sin(ha) * 200); g.stroke(); g.restore();
        // el mango: el casquillo de latón y la madera
        g.save(); g.translate(hx, hy); g.rotate(ha); g.fillStyle = laton(g, 0, -12, 0, 12); rr(g, -4, -11, 46, 22, 5); g.fill();
        let gr = g.createLinearGradient(0, -15, 0, 15); gr.addColorStop(0, '#7a4524'); gr.addColorStop(.4, '#5a2f16'); gr.addColorStop(1, '#2a1408'); g.fillStyle = gr; rr(g, 40, -15, 168, 30, 15); g.fill();
        g.fillStyle = 'rgba(255,220,170,.18)'; rr(g, 46, -11, 150, 6, 3); g.fill(); g.restore();
        // lo que se ve dentro del cristal: la mesa, más grande
        g.save(); g.beginPath(); g.arc(c.x, c.y, r, 0, 6.283); g.clip();
        g.translate(c.x, c.y); g.scale(z, z); g.translate(-c.x, -c.y);
        if (fondo) ponCapa(g, fondo);
        const lim = r / z + 220;
        st.et.forEach(e => { if (Math.abs(e.x - c.x) < lim + 120 && Math.abs(e.y - c.y) < lim) pieza(g, e.p); });
        st.et.forEach((e, i) => {
          if (!(Math.abs(e.x - c.x) < lim + 120 && Math.abs(e.y - c.y) < lim)) return;
          const brilla = Math.max(i === st.cerca ? .55 : 0, i === st.elegido ? st.luzFin : 0);
          if (brilla > .02) { const gr2 = g.createRadialGradient(e.x, e.y, 8, e.x, e.y, e.w * .75); gr2.addColorStop(0, `rgba(255,214,140,${.4 * brilla})`); gr2.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gr2; g.fillRect(e.x - e.w, e.y - e.w, e.w * 2, e.w * 2); }
          etiqueta(g, e);
        });
        g.restore();
        // el cristal: los bordes más oscuros, el reflejo de la lámpara y un tinte cálido
        g.save(); g.beginPath(); g.arc(c.x, c.y, r, 0, 6.283); g.clip();
        gr = g.createRadialGradient(c.x, c.y, r * .55, c.x, c.y, r); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(20,12,4,.38)'); g.fillStyle = gr; g.fillRect(c.x - r, c.y - r, r * 2, r * 2);
        g.globalCompositeOperation = 'lighter'; gr = g.createRadialGradient(c.x - r * .42, c.y - r * .46, 2, c.x - r * .42, c.y - r * .46, r * .55); gr.addColorStop(0, 'rgba(255,240,210,.32)'); gr.addColorStop(1, 'rgba(255,240,210,0)'); g.fillStyle = gr; g.fillRect(c.x - r, c.y - r, r * 2, r * 2);
        g.strokeStyle = 'rgba(255,246,226,.35)'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.arc(c.x, c.y, r * .84, Math.PI * 1.08, Math.PI * 1.42); g.stroke();
        if (st.luzFin > .02) { g.strokeStyle = `rgba(255,220,150,${.5 * st.luzFin})`; g.lineWidth = 3; const a0 = st.t * 2.4; g.beginPath(); g.arc(c.x, c.y, r * .92, a0, a0 + .5); g.stroke(); }
        g.restore();
        // el aro de latón
        g.save(); g.beginPath(); g.arc(c.x, c.y, r + 14, 0, 6.283); g.moveTo(c.x + r, c.y); g.arc(c.x, c.y, r, 0, 6.283); g.fillStyle = laton(g, c.x - r, c.y - r, c.x + r, c.y + r); g.fill('evenodd');
        g.strokeStyle = 'rgba(60,40,10,.7)'; g.lineWidth = 1.5; g.beginPath(); g.arc(c.x, c.y, r + 14, 0, 6.283); g.stroke(); g.beginPath(); g.arc(c.x, c.y, r, 0, 6.283); g.stroke();
        g.strokeStyle = 'rgba(255,244,210,.55)'; g.lineWidth = 2; g.beginPath(); g.arc(c.x, c.y, r + 8, Math.PI * 1.05, Math.PI * 1.6); g.stroke(); g.restore();
      }
      let tAnt = performance.now();
      function bucle(ahora) {
        if (!vivo) return;
        const dt = Math.min(.05, (ahora - tAnt) / 1000); tAnt = ahora; st.t += dt;
        L.borra(); if (fondo) ponCapa(g, fondo); if (mesa) ponCapa(g, mesa);
        // la llama de gas respira un poco
        if (mov) { const fl = .5 + .5 * Math.sin(st.t * 1.7) * Math.sin(st.t * 2.9 + 1); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(330, 140, 30, 330, 140, 900); gr.addColorStop(0, `rgba(255,190,110,${.05 + .03 * fl + .08 * st.luzFin})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1300, 1000); g.restore(); }
        pintaLupa();
        raf = requestAnimationFrame(bucle);
      }
      raf = requestAnimationFrame(bucle);
      tras(TEMAS.taller.fuentes, () => { if (vivo && st.n) { coloca(); mesa = capaFija(L.k || 1, pintaMesa); } });

      /* ── el sonido: el roce de la lupa, el papel de cada etiqueta, el «clac» de la pieza que encaja y un acorde cálido ── */
      function clac(t, f) { A.clic({ f: f || 900, q: 2, gan: .55, dur: .05, t }); A.nota(120, { tipo: 'sine', t, dur: .18, gan: .28, desliza: 70 }); A.clic({ f: 2400, q: 9, gan: .26, dur: .12, t: t + .015 }); }
      return {
        ajusta,
        espera() {},
        async gira(bombo, k) {
          const gen = ++st.gen; monta(bombo);
          const n = st.n; st.elegido = -1; st.luzFin = 0; st.alza = 0; st.zoom = MAG; st.cerca = -1;
          const s0 = Math.round(st.s); let s1 = s0 + (RM ? n : Math.max(2 * n, 16)); s1 += ((k - s1) % n + n) % n;
          const f = recorrido(s0, s1, RM ? { T: 1.6, amago: .08, retro: 0, sobra: 0, rebote: .1, p: 2.2 } : { p: 2.6, amago: .3, retro: .2, sobra: .06, rebote: .24 });
          const ac = A.crea(), roce = ac && mov ? A.continuo({ tipo: 'bandpass', f: 420, q: .7, wet: .08 }) : null;
          await new Promise(ok => {
            const t0 = performance.now(); let sAnt = s0, tA = t0;
            (function paso() {
              if (gen !== st.gen || !vivo) { if (roce) roce.para(.2); return ok(); }
              const ahora = performance.now(), t = Math.min(f.T, (ahora - t0) / 1000), s = f(t), vel = Math.abs(s - sAnt) / Math.max(.008, (ahora - tA) / 1000); sAnt = s; tA = ahora; st.s = s;
              const c = ((Math.round(s) % n) + n) % n;
              if (c !== st.cerca) { st.cerca = c; if (ac) A.clic({ f: 3200 + Math.random() * 1800, q: 1.2, gan: .05 + .1 * clamp(vel / 10, 0, 1), dur: .03, pan: clamp((st.et[c].x - 960) / 1000, -.7, .7) }); }
              if (roce) { const vs = clamp(vel / 12, 0, 1); A.pon(roce.g.gain, .015 + .14 * vs, .05); A.pon(roce.f.frequency, 300 + 700 * vs, .06); }
              if (t < f.T) requestAnimationFrame(paso); else { st.s = s1; ok(); }
            })();
          });
          if (roce) roce.para(.25);
          if (gen !== st.gen) return;
          // esa es: la lupa se acerca un poco más, la etiqueta brilla y la pieza encaja (clac, clac)
          st.elegido = k; st.cerca = k;
          if (ac) { clac(.02, 900); clac(.17, 1100); [196, 246.94, 293.66, 392].forEach((fr, j) => A.nota(fr, { tipo: 'triangle', t: .32 + j * .04, dur: 1.9, gan: .055, ataque: .08, wet: .45 })); A.nota(98, { tipo: 'sine', t: .3, dur: 1.6, gan: .07, ataque: .06 }); }
          await new Promise(ok => { const t0 = performance.now(), d = RM ? 1 : 620; (function p_() { if (gen !== st.gen) return ok(); const u = clamp((performance.now() - t0) / d, 0, 1), e = eo(u, 2); st.luzFin = e; st.alza = mov * Math.sin(Math.PI * u) * .9; st.zoom = MAG + (RM ? 0 : .32) * e; if (u < 1) requestAnimationFrame(p_); else ok(); })(); });
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
.lmv-aviso.lmv-av-cinta{font:400 15px/1.45 "Courier Prime","Courier New",Courier,monospace;border:1px solid rgba(239,229,207,.6);background:rgba(22,17,12,.94);color:#efe5cf;border-radius:4px}
.lmv-oferta{position:fixed;inset:0;z-index:2147482999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:rgba(6,5,4,.74);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);opacity:0;transition:opacity .35s ease;font-synthesis:none;-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none}
.lmv-oferta.ve{opacity:1}
.lmv-ob{display:inline-flex;align-items:center;gap:.6em;padding:22px 44px;cursor:pointer;-webkit-appearance:none;appearance:none;border:2px solid rgba(255,255,255,.85);border-radius:14px;background:rgba(14,12,18,.92);color:#fff;font:600 clamp(20px,2.2vw,30px)/1 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.6);transition:transform .2s,filter .2s}
.lmv-ob:hover{transform:translateY(-2px);filter:brightness(1.08)}
.lmv-ob:focus-visible{outline:3px solid #fff;outline-offset:4px}
.lmv-ob .lmv-ico{flex:none;width:1.3em;height:1.3em;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.lmv-og{margin:0;font:500 clamp(14px,1.3vw,20px)/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.82);text-shadow:0 2px 8px rgba(0,0,0,.8)}
.lmv-no{cursor:pointer;-webkit-appearance:none;appearance:none;background:none;border:none;padding:8px 14px;color:rgba(255,255,255,.72);font:500 clamp(14px,1.2vw,18px)/1 system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:underline;text-underline-offset:4px}
.lmv-no:hover{color:#fff}
.lmv-of-museo .lmv-ob{font-family:Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif;border-color:#c4945c;color:#f0e8da;background:rgba(14,12,18,.94)}
.lmv-of-museo .lmv-og,.lmv-of-museo .lmv-no{font-family:Poppins,"Avenir Next","Segoe UI",system-ui,sans-serif}
.lmv-of-radio .lmv-ob{font-family:Jost,system-ui,sans-serif;font-weight:300;letter-spacing:.08em;border:1px solid rgba(255,255,255,.72);border-radius:9px;background:rgba(8,12,14,.86)}
.lmv-of-radio .lmv-og,.lmv-of-radio .lmv-no{font-family:Jost,system-ui,sans-serif}
.lmv-of-disco .lmv-ob{font-family:Jost,"Iowan Old Style",Georgia,serif;font-weight:500;letter-spacing:.22em;text-transform:uppercase;border:1px solid #F2D793;border-radius:6px;background:linear-gradient(#F2D793,#C9A24A 55%,#8a6a2a);color:#2A1E0A}
.lmv-of-disco .lmv-og{font-family:Jost,Georgia,serif;color:#DCCDB0}.lmv-of-disco .lmv-no{font-family:Jost,Georgia,serif;color:rgba(220,205,176,.8)}
.lmv-of-cinta .lmv-ob{font-family:"Courier Prime","Courier New",Courier,monospace;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:1px solid #f4ecd8;border-radius:4px;background:linear-gradient(#f4ecd8,#e2d3b2);color:#1e1a16}
.lmv-of-cinta .lmv-og,.lmv-of-cinta .lmv-no{font-family:"Courier Prime","Courier New",Courier,monospace;color:#efe5cf}
.lmv-of-telegrafo .lmv-ob{font-family:Limelight,"Poiret One",Georgia,serif;font-weight:400;letter-spacing:.06em;border:2px solid #EAD18F;border-radius:8px;background:linear-gradient(#EAD18F,#C9A45C 55%,#9A7430);color:#2B1B0C;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 40px rgba(201,164,92,.25)}
.lmv-of-telegrafo .lmv-og,.lmv-of-telegrafo .lmv-no{font-family:Jost,"Avenir Next",system-ui,sans-serif;color:#E8DDC0}
.lmv-of-tabla .lmv-ob{font-family:Jost,"Avenir Next",system-ui,sans-serif;font-weight:600;letter-spacing:.14em;text-transform:uppercase;border:2px solid #E2B666;border-radius:6px;background:linear-gradient(#B98238,#9A6A2E 55%,#6E4A1B);color:#FFF1D4;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 40px rgba(226,182,102,.22)}
.lmv-of-tabla .lmv-og,.lmv-of-tabla .lmv-no{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:500;letter-spacing:.08em;text-transform:none;color:#EBD4A4}
.lmv-of-marquesina .lmv-ob{font-family:Limelight,"Poiret One",Georgia,serif;font-weight:400;letter-spacing:.05em;border:3px solid #E6C25A;border-radius:6px;background:linear-gradient(#A8262F,#8C1E26 60%,#5E1219);color:#F7E3A0;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 0 4px rgba(140,30,38,.5),0 0 44px rgba(230,194,90,.28)}
.lmv-of-marquesina .lmv-og,.lmv-of-marquesina .lmv-no{font-family:Jost,"Avenir Next",system-ui,sans-serif;color:#F0DDA8}
.lmv-of-album .lmv-ob{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:600;letter-spacing:.03em;font-size:clamp(24px,2.6vw,38px);border:2px solid #D8A455;border-radius:6px;background:linear-gradient(#7A4A22,#5A3416 60%,#3E2310);color:#F7E6C4;box-shadow:0 18px 50px rgba(0,0,0,.6),0 0 40px rgba(216,164,85,.2)}
.lmv-of-album .lmv-og,.lmv-of-album .lmv-no{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:500;letter-spacing:.06em;text-transform:none;color:#EBD5A8}`;
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

  /* v3: sin botón arriba. Al empezar (el botón de empezar del portal, o LMVoluntarios.ofrece()), si hay clase ahora mismo, el
     botón «Seleccionar voluntario» en el medio; resuelve cuando se ha cerrado la ruleta (true) o con «Ahora no» (false). */
  const EMPEZAR = ['#cEmpezar', '#mcEmpezar', '[data-lmv-empezar]'];
  let MONTADO = null;
  function monta(o) {
    try {
      o = o || {};
      const id = leeCuenta(); if (!id) return null;
      if (MONTADO) return MONTADO;
      const tema = TEMAS[o.tema] || TEMAS.museo, nomTema = TEMAS[o.tema] ? o.tema : 'museo';
      css('lmv-css', CSS); css('lmv-css-' + nomTema, tema.css);
      let est = null, clave = null, oferta = null, pasa = false, vivo = true;
      async function refresca() {
        try { est = await rpc('suite_voluntarios_estado', { p_cuenta_id: id }); }
        catch (e) { return; }
        if (!est || est.ok === false) { olvida(); est = null; vivo = false; clearInterval(iv); document.removeEventListener('click', engancha, true); }
      }
      const iv = setInterval(() => { const f = est && est.horario ? franja(est.horario) : null, k = f ? f.g + f.d + f.i : '-'; if (k !== clave) { clave = k; refresca(); } }, 30000);
      function ofrece(op) {
        op = op || {};
        if (oferta) return oferta;
        oferta = (async () => {
          // (18-oct, tarde) primero, si hay clase ahora; fuera de hora no se espera a nada (ni al permiso del micro: el portal
          // empieza ya, como antes). En hora de clase, sí: la oferta sale cuando se ha contestado al permiso (op.tras).
          if (!vivo) return false;
          if (!est) await refresca();
          if (!(est && est.horario && franja(est.horario))) return false;
          if (op.tras) { try { await op.tras; } catch (e) {} }
          if (!vivo) return false;
          const f = est && est.horario ? franja(est.horario) : null;
          if (!f) return false;
          // (v4) la estética de ESTA oferta: la que pide `ofrece({ tema })` si existe; si no, (v5) la que diga el portal con
          // `temaDe(op)` (su día, capítulo o bobina) y, si no, la de `monta`
          let pide = op.tema;
          if (!TEMAS[pide] && typeof o.temaDe === 'function') { try { pide = o.temaDe(op); } catch (e) { pide = null; } }
          const tN = TEMAS[pide] ? pide : nomTema, tT = TEMAS[tN];
          css('lmv-css-' + tN, tT.css);
          return await new Promise(ok => {
            const fs = document.fullscreenElement || document.webkitFullscreenElement;
            const host = fs && fs !== document.documentElement && fs !== document.body ? fs : document.body;
            const c = el('div', 'lmv-oferta lmv-of-' + tN, host);
            c.innerHTML = '<button type="button" class="lmv-ob">' + ICONO + '<span>Seleccionar voluntario</span></button><p class="lmv-og"></p><button type="button" class="lmv-no">Ahora no</button>';
            c.querySelector('.lmv-og').textContent = f.g + ' · en clase ahora';
            const bOk = c.querySelector('.lmv-ob'), bNo = c.querySelector('.lmv-no');
            let hecho = false;
            const quita = () => { ['keydown', 'keyup', 'keypress'].forEach(t => window.removeEventListener(t, teclas, true)); c.classList.remove('ve'); setTimeout(() => c.remove(), 350); };
            const no = () => { if (hecho) return; hecho = true; quita(); ok(false); };
            const si = () => { if (hecho) return; hecho = true; A.crea(); quita(); abre(o, tT, tN, id, () => { refresca(); ok(true); }); };
            const teclas = ev => { ev.stopPropagation(); if (ev.type !== 'keydown') return; if (ev.key === 'Escape') { ev.preventDefault(); no(); } else if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); si(); } };
            ['keydown', 'keyup', 'keypress'].forEach(t => window.addEventListener(t, teclas, true));
            ['click', 'pointerdown', 'mousedown', 'touchstart', 'wheel'].forEach(t => c.addEventListener(t, ev => ev.stopPropagation()));
            bOk.addEventListener('click', si); bNo.addEventListener('click', no);
            requestAnimationFrame(() => { c.classList.add('ve'); try { bOk.focus({ preventScroll: true }); } catch (e) {} });
          });
        })();
        return oferta.then(r => { oferta = null; return r; }, () => { oferta = null; return false; });
      }
      // el botón de empezar del portal: si hay clase, primero la oferta y luego (al cerrarla) se pulsa de verdad
      function engancha(ev) {
        if (pasa || !vivo) return;
        const b = ev.target && ev.target.closest ? ev.target.closest((o.empezar || EMPEZAR).join(',')) : null;
        if (!b) return;
        const f = est && est.horario ? franja(est.horario) : null;
        if (!f) return;                                       // fuera de hora (o aún sin saberlo): el portal sigue como siempre
        ev.preventDefault(); ev.stopImmediatePropagation(); ev.stopPropagation();
        ofrece({}).then(() => { pasa = true; try { b.click(); } finally { pasa = false; } });
      }
      if (o.engancha !== false) document.addEventListener('click', engancha, true);
      refresca();
      MONTADO = { ofrece, refresca };
      return MONTADO;
    } catch (e) { try { console.warn('LMVoluntarios', e); } catch (_) {} return null; }
  }
  function ofrece(op) { return MONTADO ? MONTADO.ofrece(op) : Promise.resolve(false); }

  // (v4) el nombre final cabe en su caja: si el tema lo pide (`nombreFit: { min }`), se reduce la letra hasta que ni se sale ni se corta
  function cabeNombre(n, tema) {
    if (!tema || !tema.nombreFit) return;
    try {
      n.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(n).fontSize) || 60; const min = tema.nombreFit.min || 28, rg = document.createRange();
      for (let i = 0; i < 80 && fs > min; i++) {
        rg.selectNodeContents(n); const a = rg.getBoundingClientRect(), b = n.getBoundingClientRect(), k = (n.offsetHeight ? b.height / n.offsetHeight : 1) || 1;
        if (!(a.width / k > n.offsetWidth + 1 || a.height / k > n.offsetHeight + 1)) break;
        fs -= 3; n.style.fontSize = fs + 'px';
      }
    } catch (e) {}
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
      nombre.textContent = r.bombo[r.elegido]; cabeNombre(nombre, tema); nombre.classList.add('ve');
      grupo.textContent = r.grupo + ' · ' + (r.quedan ? 'quedan ' + r.quedan + ' de ' + r.total + ' en esta ronda' : 'ronda completa');
      nota.textContent = r.nueva_ronda ? 'Ronda nueva: ya habían salido todos.' : (!r.quedan ? 'Era el último: en la próxima, vuelven a entrar todos.' : '');
      if (nota.textContent) setTimeout(() => nota.classList.add('ve'), 350);
      setTimeout(() => { pie.classList.add('ve'); ocupado = false; try { $('.lmv-otra').focus({ preventScroll: true }); } catch (e) {} }, 700);
    }
    tira();
    return { cierra };
  }

  window.LMVoluntarios = { version: VERSION, monta, ofrece, temas: Object.keys(TEMAS), _TEMAS: TEMAS, _recorrido: recorrido, _A: A, _abre: abre };
})();
