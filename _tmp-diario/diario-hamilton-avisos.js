/* =====================================================================================================================
   DIARIO · AVISOS DE HAMILTON (23-nov-2026, Iago)
   «Que a mi Diario le llegue una notificación por cada alumno que termine el test de Hamilton, con su puntuación y con la
   textura de Hamilton.» Diseño aprobado: DISENO/tarjeta-hamilton-v4 (Dropbox ENCARGO-23-NOV-hamilton).
   · Un aviso por alumno que entrega: a la izquierda la miniatura de la vela (la textura de Hamilton); «Hamilton» en oro, el
     alumno y su grupo; debajo «Test de HAMILTON · <camino> · hace N min»; a la derecha su nota (verde ≥7, ámbar ≥5, rojo <5).
   · Lo de las cuentas Tester/Protester y de prácticas NO llega (Iago, 20-nov: «es puro ruido»).
   · Tocar el aviso: queda leído (suite_campana_vistos_marcar, sincronizado ordenador/iPad/móvil).
   · Va aparte de suite-campana.js (no lo toca), igual que diario-carrusel-avisos.js: suma sus avisos sin leer al globo y los
     mete en «Actividad de los alumnos». Datos: suite_listar_pendientes_v3(p_secreto) → 'hamilton' (ya existía desde el 22-oct).
   Lo carga config.js (lo cargan las tres páginas). Deshacer: quitar de config.js sus 3 líneas (las de diario-hamilton-avisos)
   y este fichero.
   ===================================================================================================================== */
(function () {
  'use strict';
  if (window.__diarioHamilton) return; window.__diarioHamilton = 1;
  var SECRETO = null;
  async function secreto() {
    if (SECRETO != null) return SECRETO;
    try { var sc = document.querySelector('script[src*="suite-campana.js"]'); var t = await (await fetch(sc ? sc.src : '/suite-campana.js')).text();
      var m = t.match(/const SECRETO\s*=\s*['"]([^'"]+)['"]/); SECRETO = m ? m[1] : ''; } catch (e) { SECRETO = ''; }
    return SECRETO;
  }
  var LISTA = [], VISTOS = new Set(), NUEVOS = 0, OK = false, PREVIA = false;
  var CLAVE = function (h) { return 'ham:' + h.id; };
  var VELA = 'https://gp.lmathome.es/hitos/hamilton-1.webp';
  function sb() { return window.sb || window.supabaseClient || null; }
  async function rpc(fn, args) { var c = sb(); if (!c) return null; try { var r = await c.rpc(fn, args || {}); return r.error ? null : r.data; } catch (e) { return null; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hace(iso) {
    var ms = Date.now() - new Date(iso).getTime(), m = Math.round(ms / 6e4);
    if (m < 1) return 'ahora mismo'; if (m < 60) return 'hace ' + m + ' min';
    var h = Math.round(m / 60); if (h < 24) return 'hace ' + h + ' h';
    var d = new Date(iso), hoy = new Date(); hoy.setHours(0, 0, 0, 0); var d0 = new Date(d); d0.setHours(0, 0, 0, 0);
    var n = Math.round((hoy - d0) / 864e5); if (n === 1) return 'ayer';
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' });
  }
  function camino(c) { return c === 'video' ? 'el vídeo' : (c === 'expres' ? 'Hamilton exprés' : 'sin camino'); }
  function notaTxt(n) { var x = Number(n); return isFinite(x) ? x.toFixed(2).replace('.', ',') : '—'; }
  function notaCol(n) { var x = Number(n); return !isFinite(x) ? '#cbd5e1' : (x >= 7 ? '#4ade80' : (x >= 5 ? '#fbbf24' : '#f87171')); }

  async function cargar() {
    if (PREVIA) return;
    var r = await rpc('suite_listar_pendientes_v3', { p_secreto: await secreto() }); if (!(r && r.ok)) return;
    LISTA = (Array.isArray(r.hamilton) ? r.hamilton : []).filter(function (h) { return h && !h.prueba && !h.practicas; }); OK = true;
    var v = await rpc('suite_campana_vistos_listar', { p_secreto: await secreto() });
    if (v && v.ok) { var arr = v.leidos || []; VISTOS = new Set(arr.map(function (x) { return typeof x === 'string' ? x : (x && x.id); }).filter(Boolean)); }
    contar();
  }
  function sinLeer(h) { return !VISTOS.has(CLAVE(h)); }
  async function marcarLeido(h) { if (VISTOS.has(CLAVE(h))) return; VISTOS.add(CLAVE(h)); contar(); if (!PREVIA) await rpc('suite_campana_vistos_marcar', { p_secreto: await secreto(), p_tipo: 'leido', p_ids: [CLAVE(h)] }); }

  /* ---- el globo. diario-carrusel-avisos.js ya intercepta el número que pone la campana; aquí se ENCADENA con él (no se
     sustituye): a lo que llegue se le suman los avisos de Hamilton sin leer y se le pasa al de antes (el del carrusel, o el
     nativo si no lo hay). ---- */
  var NAT = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  var BASE = null, G = null, S = null;
  function num(v) { return String(v) === '99+' ? 99 : (parseInt(v, 10) || 0); }
  function contar() { NUEVOS = LISTA.filter(sinLeer).length; ponGlobo(); }
  function ponGlobo() {
    var b = document.getElementById('suite-campana-badge'); if (!b || !S || BASE == null) return;
    S(String(BASE + NUEVOS));
    if (num(NAT.get.call(b)) > 0) b.classList.remove('hidden');
    var btn = document.getElementById('suite-campana-btn'); if (btn && NUEVOS > 0) btn.classList.add('hay-pendientes');
  }
  /* El número de la campana llega por badge.textContent = n. Este interceptor va ENCIMA del del carrusel (o del nativo): guarda
     n, le suma los de Hamilton y se lo pasa al de debajo, que le suma los suyos. Hasta la siguiente vez que la campana ponga su
     número (lo hace al recargar), no se toca nada: así nunca se cuenta dos veces lo del carrusel. */
  function vigilaGlobo() {
    var b = document.getElementById('suite-campana-badge'); if (!b || b.__ham) return;
    if (!b.__carr && (vigilaGlobo.n = (vigilaGlobo.n || 0) + 1) < 7) return;   /* espera ~10 s al interceptor del carrusel */
    b.__ham = 1;
    var d = Object.getOwnPropertyDescriptor(b, 'textContent') || NAT;
    G = function () { return d.get.call(b); }; S = function (v) { d.set.call(b, v); };
    Object.defineProperty(b, 'textContent', { configurable: true, get: G,
      set: function (v) { BASE = num(v); S(String(BASE + NUEVOS)); } });
    new MutationObserver(function () { if (NUEVOS > 0 && b.classList.contains('hidden')) b.classList.remove('hidden'); }).observe(b, { attributes: true, attributeFilter: ['class'] });
    try { if (NUEVOS > 0 && window.SuiteCampana && typeof window.SuiteCampana.refrescar === 'function') window.SuiteCampana.refrescar(); } catch (e) {}
  }

  function css() {
    if (document.getElementById('diario-ham-css')) return;
    var s = document.createElement('style'); s.id = 'diario-ham-css';
    s.textContent =
      '@font-face{font-family:"LM Fell";src:url(https://gp.lmathome.es/hitos/f-fell.woff2) format("woff2");font-display:swap}' +
      '.dha-item .scampana-tipo.dha-tipo{color:#e3bf6d;font-family:"LM Fell","IM Fell English",Georgia,serif;letter-spacing:.12em;text-transform:uppercase}' +
      '.dha-item .scv-tile.dha-tile{background:#170d05 url(' + VELA + ') 74% 18%/auto 190% no-repeat;border-color:#e3bf6d!important;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}' +
      '.dha-item .scv-tile.dha-tile::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at 74% 30%,rgba(255,186,92,.38),rgba(255,170,70,0) 55%);mix-blend-mode:screen;animation:dhaVela 3.2s linear infinite;pointer-events:none}' +
      '@keyframes dhaVela{0%{opacity:.7}12%{opacity:1}22%{opacity:.55}35%{opacity:.95}50%{opacity:.7}64%{opacity:1}80%{opacity:.62}100%{opacity:.7}}' +
      '.dha-item .scv-tile.dha-tile{position:relative;overflow:hidden}' +
      '.dha-item .dha-grupo{display:inline-block;margin-left:7px;padding:1px 6px;border-radius:5px;border:1px solid rgba(227,191,109,.55);color:#f3d999;font-size:11px;font-weight:800;vertical-align:1px}' +
      '.dha-item .dha-nota{flex:none;align-self:center;margin-left:10px;min-width:52px;text-align:right;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums}' +
      '.dha-item .dha-ham{font-family:"LM Fell","IM Fell English",Georgia,serif;letter-spacing:.08em}' +
      '@media (prefers-reduced-motion:reduce){.dha-item .scv-tile.dha-tile::after{animation:none}}';
    document.head.appendChild(s);
  }
  function itemEl(h) {
    var d = document.createElement('div'), leido = !sinLeer(h);
    d.className = 'scampana-item scampana-tocable scv dha-item' + (leido ? ' scampana-leida' : '');
    d.dataset.ham = h.id; d.dataset.t = String(new Date(h.creado_en).getTime()); d.style.setProperty('--scv', '#e3bf6d');
    d.innerHTML = '<div class="scv-lead"><span class="scv-tile dha-tile" title="Hamilton"></span></div>' +
      '<div class="scampana-item-main"><div class="scampana-fila1"><span class="scampana-tipo dha-tipo">Hamilton</span><div class="scampana-item-nombre"><span class="scv-nom">' + esc(h.alumno) + '</span>' + (h.grupo ? '<span class="dha-grupo">' + esc(h.grupo) + '</span>' : '') + '</div></div>' +
      '<div class="scampana-item-sub"><span class="scv-sub-txt">Test de <span class="dha-ham">HAMILTON</span> · ' + esc(camino(h.camino)) + ' · ' + esc(hace(h.creado_en)) + '</span></div></div>' +
      '<div class="dha-nota" style="color:' + notaCol(h.nota) + '">' + esc(notaTxt(h.nota)) + '</div>';
    d.addEventListener('click', async function (ev) { ev.stopPropagation(); await marcarLeido(h); repinta(); });
    return d;
  }
  var DIA = function (t) { var d = new Date(Number(t)); return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); };
  function etiquetaDia(t) {
    var d = new Date(Number(t)), hoy = new Date(); hoy.setHours(0, 0, 0, 0); var d0 = new Date(d); d0.setHours(0, 0, 0, 0);
    var n = Math.round((hoy - d0) / 864e5); if (n === 0) return 'Hoy'; if (n === 1) return 'Ayer';
    var w = d.toLocaleDateString('es-ES', { weekday: 'long' }); return w.charAt(0).toUpperCase() + w.slice(1) + ' ' + String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
  }
  /* como el carrusel: arriba lo nuevo por días; debajo lo visto («Vistas · …»); cada aviso en su sitio por fecha */
  function meter(feed, el, nueva) {
    var t = Number(el.dataset.t), hijos = [].slice.call(feed.children), k, b = hijos.length;
    var esItem = function (x) { return x && x.classList.contains('scampana-item'); }, esSep = function (x) { return x && x.classList.contains('scv-dia'); };
    for (k = 0; k < hijos.length; k++) { if (esItem(hijos[k]) && hijos[k].classList.contains('scampana-leida')) { b = (k > 0 && esSep(hijos[k - 1])) ? k - 1 : k; break; } }
    var desde = nueva ? 0 : b, hasta = nueva ? b : hijos.length, ref = null;
    for (k = desde; k < hasta; k++) { if (esItem(hijos[k]) && Number(hijos[k].dataset.t || 0) < t) { ref = hijos[k]; break; } }
    if (!ref && hasta < hijos.length) ref = hijos[hasta];
    if (esItem(ref) && DIA(ref.dataset.t) !== DIA(t) && esSep(ref.previousElementSibling)) ref = ref.previousElementSibling;
    var cur = ref ? ref.previousElementSibling : (hijos.length ? hijos[hijos.length - 1] : null);
    while (cur && !esSep(cur)) cur = cur.previousElementSibling;
    var dentro = cur && [].indexOf.call(feed.children, cur) >= desde && (nueva ? [].indexOf.call(feed.children, cur) < hasta + 1 : true);
    var lab = etiquetaDia(t);
    if (!(dentro && cur.textContent.replace(/^Vistas · /, '') === lab)) {
      var sep = document.createElement('div'); sep.className = 'scv-dia dha-dia';
      sep.textContent = (!nueva && !dentro ? 'Vistas · ' : '') + lab; feed.insertBefore(sep, ref);
    }
    feed.insertBefore(el, ref);
  }
  function cargandoPanel(body) { return body.children.length <= 1 && !!body.querySelector('.scampana-cargando'); }
  function repinta() {
    var body = document.getElementById('suite-notif-body'); if (!body) return;
    body.querySelectorAll('.dha-item,.dha-dia').forEach(function (x) { x.remove(); });
    if (!LISTA.length) return;
    if (cargandoPanel(body)) return;
    var sec = body.querySelector('.scampana-seccion-actividad'), feed = sec && sec.querySelector('.scampana-feed');
    if (!feed) {
      sec = document.createElement('section'); sec.className = 'scampana-seccion scampana-seccion-actividad dha-propia';
      sec.innerHTML = '<div class="scampana-seccion-head"><h3>Actividad de los alumnos</h3><span class="scampana-chip">0</span></div><div class="scampana-feed"></div>';
      body.insertBefore(sec, body.firstChild); feed = sec.querySelector('.scampana-feed');
    }
    LISTA.slice().sort(function (a, b) { return new Date(a.creado_en) - new Date(b.creado_en); })
      .forEach(function (h) { meter(feed, itemEl(h), sinLeer(h)); });
    var chip = sec.querySelector('.scampana-seccion-head .scampana-chip');
    if (chip) { if (chip.dataset.baseHam == null) chip.dataset.baseHam = String(parseInt(chip.textContent, 10) || 0); chip.textContent = String((parseInt(chip.dataset.baseHam, 10) || 0) + LISTA.filter(sinLeer).length); }
    try { if (window.SuiteCampana && window.SuiteCampana.sinVer) window.SuiteCampana.sinVer(); } catch (e) {}
  }
  function vigilaPanel() {
    var body = document.getElementById('suite-notif-body'); if (!body || body.__ham) return; body.__ham = 1;
    new MutationObserver(function () { if (LISTA.length && !body.querySelector('.dha-item') && !cargandoPanel(body)) { (PREVIA ? Promise.resolve() : cargar()).then(repinta); } }).observe(body, { childList: true });
  }
  function arranca() { css(); vigilaGlobo(); vigilaPanel(); if (!OK) cargar(); }
  setInterval(function () { if (document.getElementById('suite-campana-badge') && sb()) arranca(); }, 1500);
  setInterval(function () { if (!document.hidden && sb()) cargar(); }, 60000);
  window.DiarioHamilton = { recargar: function () { return cargar().then(repinta); }, _lista: function () { return LISTA; },
    _previa: function (l) { PREVIA = true; LISTA = l; OK = true; css(); contar(); repinta(); } };
})();
