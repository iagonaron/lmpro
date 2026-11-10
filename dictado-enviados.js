/* =====================================================================================================================
   DICTADO ANIMADO GP · «¿QUIÉN HA ENVIADO YA SU DICTADO?» (Iago, 10-nov-2026) · piloto «solo saca la foto»
   Fichero NUEVO y PURAMENTE AÑADIDO. Quitando su <script> de index.html, el dictado animado es el de siempre.

   «En la pantalla de clase, que estará con el final del dictado animado, que aparezcan los alumnos de ese grupo, el
   nombre y la primera letra del apellido con un punto, cada uno con su recuadrito en una fila, de izquierda a derecha,
   con una X por si quiero quitarlo [los que no han venido], y cada alumno que haya enviado el dictado, que se ponga en
   verde [también los que corrijo yo, con foto o a mano]… un contador como «10 de 12»… y cuando estén todos, un sonidito
   o un tic verde, y ya le puedo dar a ver la solución.» La idea: no enseñar la solución hasta que todas las fotos estén
   dentro, para que nadie retoque su dictado después de verla. «Corregir» sigue pudiéndose pulsar siempre.

   · SOLO con la cuenta Protester (la de la pantalla del aula). A los alumnos no les cambia nada ni se les pide nada.
   · Sale al llegar al FIN del dictado, encima de la barra de abajo. El grupo es el que tiene clase a esa hora
     (horario_clases, hora de Madrid); tocando «Grupo C/F» se cambia a mano.
   · Verde = hay un dictado de hoy de ese alumno en «dictados» (lo mandó él, o Iago desde «Corrección manual GP» con
     foto o con rúbrica). Se mira cada 4 s. La ✕ quita a quien no ha venido (solo de esta pantalla; se recuerda ese día);
     «↺ n» los devuelve.
   · Cada alumno que pasa a verde suena («plin»). Con todos en verde: «N de N ✓», tres notas y «✔ Corregir» late.
     Hasta entonces, no late. Mientras la fila está a la vista, un «aliento» inaudible mantiene despierto el altavoz.
   · (v3) «Una vez que estén todos en verde, que se revele el dictado solución automáticamente, sin que yo le pulse»:
     a los 3 s de completarse se pulsa sola «✔ Corregir» (sale el rótulo naranja «Solución en 3 s…»). Solo si la fila
     se ha visto incompleta antes en ese final (si al llegar ya estaban todos, no se abre sola: late y la pulsa Iago).
     Si en esos 3 s deja de estar completa (↺), se anula. Una vez por final.
   · (v4, 10-nov noche) «Prefiero que aparezca en el centro, en plan revelar dictado en 3, 2, 1, y que ya aparezca»:
     el rótulo de la esquina se cambia por una cuenta atrás grande en el CENTRO de la pantalla («REVELAR DICTADO EN» 3 · 2 · 1,
     un número por segundo, sin animaciones). Tocar el rótulo cancela esa apertura (queda «✔ Corregir» para pulsarla a mano).
   · Pantalla del aula (Chrome 94, pocos fotogramas): sin movimientos; los cambios, de golpe. JS y CSS sencillos.
   ===================================================================================================================== */
(function () {
  'use strict';
  var D = document, W = window;

  function ses() { try { return JSON.parse(localStorage.getItem('lmpro_session') || 'null') || W.__LM_SES || null; } catch (e) { return W.__LM_SES || null; } }
  function sinTildes(t) { return String(t == null ? '' : t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  function esProtester() { var s = ses(); return !!(s && s.estado === 'validado' && /protester/.test(sinTildes(s.nombre))); }
  function cfg() { var c = W.DIARIO_CONFIG || {}; return (c.SUPABASE_URL && c.SUPABASE_ANON) ? c : null; }

  var GRUPOS = ['2GpC', '2GpF'];
  var CADA = 4000;
  var caja = null, grupo = null, manualHasta = 0, lista = [], hechos = {}, quitados = {}, mirando = null, vigia = null, sonado = false, cargando = false, listaDe = null, fallo = '', primera = true, vistoFaltar = false, revelado = false, autoT = null;
  var ESPERA_AUTO = 3000;                               // ms entre «ya están todos» y abrir la solución sola (cuenta atrás 3-2-1 en el centro)

  var st = D.createElement('style');
  st.textContent =
    '#dcEnv{flex-shrink:0;display:none;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 22px 2px;font-family:inherit}' +
    '#dcEnv.on{display:flex}' +
    '#dcEnv .e-n{padding:8px 14px;border-radius:10px;background:#1f2937;color:#fff;font-size:22px;font-weight:900;white-space:nowrap;border:2px solid #475569}' +
    '#dcEnv.todos .e-n{background:#22c55e;border-color:#22c55e;color:#06210f}' +
    '#dcEnv .e-g{padding:8px 10px;border-radius:10px;background:none;border:2px solid #475569;color:#cbd5e1;font:inherit;font-size:14px;font-weight:800;cursor:pointer;white-space:nowrap}' +
    '#dcEnv .e-a{display:flex;align-items:center;gap:6px;padding:6px 7px 6px 10px;border-radius:10px;background:#1f2937;border:2px solid #475569;color:#fff;font-size:18px;font-weight:800;white-space:nowrap}' +
    '#dcEnv .e-a.ok{background:#22c55e;border-color:#22c55e;color:#06210f;padding-right:12px}' +
    '#dcEnv .e-a button{width:26px;height:26px;border:0;border-radius:7px;background:#475569;color:#fff;font:inherit;font-size:14px;font-weight:900;line-height:1;cursor:pointer;padding:0}' +
    '#dcEnv .e-r{padding:7px 10px;border-radius:10px;background:none;border:2px dashed #475569;color:#cbd5e1;font:inherit;font-size:14px;font-weight:800;cursor:pointer}' +
    '#dcEnv .e-x{color:#fbbf24;font-size:14px;font-weight:700}' +
    '#dcEnvCuenta{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;pointer-events:none;font-family:inherit}' +
    '#dcEnvCuenta .c-caja{pointer-events:auto;cursor:pointer;text-align:center;padding:26px 60px 20px;border-radius:28px;background:rgba(6,10,18,.92);border:2px solid rgba(255,255,255,.16);box-shadow:0 20px 80px rgba(0,0,0,.55);color:#fff}' +
    '#dcEnvCuenta .c-t{font-size:clamp(22px,3.2vw,46px);font-weight:900;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap}' +
    '#dcEnvCuenta .c-n{font-size:clamp(120px,22vw,300px);font-weight:900;line-height:1.05;color:#f97316;font-variant-numeric:tabular-nums}' +
    '#dcEnvCuenta .c-x{font-size:14px;font-weight:700;color:#94a3b8}' +
    '#dcOverlay.dcenv-espera .dc-ver-res.fin{animation:none}' +
    '#dcOverlay.dcenv-todos .dc-ver-res{animation:dcCorregirFin 1.6s ease-in-out infinite}';
  D.head.appendChild(st);

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- hora de Madrid ---------- */
  function madrid() {
    var d = new Date(), o = {};
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' })
        .formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
      var dias = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
      return { dia: dias[o.weekday] || 0, min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10), fecha: o.year + '-' + o.month + '-' + o.day };
    } catch (e) {
      return { dia: d.getDay() || 7, min: d.getHours() * 60 + d.getMinutes(), fecha: d.toISOString().slice(0, 10) };
    }
  }
  function aMin(h) { var m = /^(\d{1,2}):(\d{2})/.exec(String(h || '')); return m ? (+m[1]) * 60 + (+m[2]) : null; }

  /* ---------- Supabase (lectura, con la clave pública del portal) ---------- */
  async function lee(ruta) {
    var c = cfg(); if (!c) throw new Error('sin configuración');
    var r = await fetch(c.SUPABASE_URL + '/rest/v1/' + ruta, { cache: 'no-store', headers: { apikey: c.SUPABASE_ANON, Authorization: 'Bearer ' + c.SUPABASE_ANON } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  }

  async function grupoDeAhora() {
    var a = madrid(), filas = [];
    try { filas = await lee('horario_clases?select=grupo,dia_iso,hora_ini,hora_fin&grupo=in.(' + GRUPOS.join(',') + ')'); } catch (e) {}
    var hoy = (filas || []).filter(function (f) { return +f.dia_iso === a.dia && aMin(f.hora_ini) != null && aMin(f.hora_fin) != null; });
    var mejor = null, dist = 1e9;
    hoy.forEach(function (f) {
      var i = aMin(f.hora_ini), fn = aMin(f.hora_fin), d = (a.min >= i && a.min < fn) ? 0 : Math.min(Math.abs(a.min - i), Math.abs(a.min - fn));
      if (d < dist) { dist = d; mejor = f.grupo; }
    });
    return mejor || GRUPOS[0];
  }

  async function cargaLista(g) {
    var filas = await lee('vw_dictados_gp_canon?select=alumno_canon_id,nombre,apellidos,alumno_orden,app_id&grupo_codigo=eq.' + encodeURIComponent(g));
    var por = {}, orden = [];
    (filas || []).forEach(function (f) {
      if (/tester/.test(sinTildes(f.nombre + ' ' + f.apellidos))) return;          // las cuentas de prueba de Iago no son alumnos
      var a = por[f.alumno_canon_id];
      if (!a) { a = por[f.alumno_canon_id] = { id: f.alumno_canon_id, nombre: String(f.nombre || '').trim(), apellidos: String(f.apellidos || '').trim(), orden: f.alumno_orden, apps: {} }; orden.push(a); }
      if (f.app_id != null && f.app_id !== '') a.apps[String(f.app_id)] = 1;
    });
    orden.sort(function (x, y) { return (x.orden == null ? 999 : x.orden) - (y.orden == null ? 999 : y.orden) || sinTildes(x.apellidos).localeCompare(sinTildes(y.apellidos)); });
    /* «Nombre A.»; si dos coinciden, se alarga la inicial hasta distinguirlos */
    orden.forEach(function (a) { a.n1 = sinTildes(a.nombre); a.ap1 = sinTildes(a.apellidos).split(' ')[0] || ''; });
    orden.forEach(function (a) {
      var k = 1, rot;
      do {
        rot = a.nombre + (a.apellidos ? ' ' + a.apellidos.slice(0, k) + '.' : '');
        var choca = orden.some(function (b) { return b !== a && b.nombre + (b.apellidos ? ' ' + b.apellidos.slice(0, k) + '.' : '') === rot; });
        k++;
      } while (choca && k <= a.apellidos.length);
      a.rotulo = rot;
    });
    return orden;
  }

  async function miraDictados() {
    /* la fecha la ponen las apps con la fecha UTC del aparato; en horario de clase coincide con la de Madrid. Se piden las dos. */
    var f1 = madrid().fecha, f2 = new Date().toISOString().slice(0, 10), fechas = f1 === f2 ? [f1] : [f1, f2];
    var filas = await lee('dictados?select=alumno_id,alumnos(nombre,apellido)&fecha_dictado=in.(' + fechas.join(',') + ')');
    var nuevo = {};
    (filas || []).forEach(function (d) {
      var id = String(d.alumno_id), al = d.alumnos || {}, n = sinTildes(al.nombre), ap = sinTildes(al.apellido).split(' ')[0] || '';
      var quien = null;
      lista.forEach(function (a) { if (!quien && a.apps[id]) quien = a; });
      if (!quien && n) {                                             // cuenta de la app sin enlazar: por nombre (y apellido, si lo puso)
        var cand = lista.filter(function (a) { return a.n1 === n || a.n1.split(' ')[0] === n.split(' ')[0]; });
        if (ap) cand = cand.filter(function (a) { return a.ap1 === ap || a.ap1.indexOf(ap) === 0 || ap.indexOf(a.ap1) === 0; });
        if (cand.length === 1) quien = cand[0];
      }
      if (quien) nuevo[quien.id] = 1;
    });
    return nuevo;
  }

  /* ---------- lo quitado a mano (no ha venido): se recuerda ese día y ese grupo, en este aparato ---------- */
  function claveQ() { return 'lm_dcenv_q_' + madrid().fecha + '_' + grupo; }
  function leeQ() { try { quitados = JSON.parse(localStorage.getItem(claveQ()) || '{}') || {}; } catch (e) { quitados = {}; } }
  function guardaQ() { try { localStorage.setItem(claveQ(), JSON.stringify(quitados)); } catch (e) {} }

  /* ---------- sonido ----------
     (10-nov-2026, Iago) «que haga un sonidito cuando se ponga en verde… a veces mi altavoz suena un poquito más tarde,
     como que no pilla los ataques si está un rato en silencio… si no, el primer alumno que lo envíe no va a sonar».
     Mientras la fila está a la vista suena un «aliento» inaudible (60 Hz, casi a cero) que mantiene abierto el canal de
     audio —el mismo truco que usa el dictado antes de la primera nota—, y cada sonido lleva además 0,12 s de margen. */
  var ac = null, aliento = null, sonidos = 0;
  function audio() {
    try {
      var AC = W.AudioContext || W.webkitAudioContext; if (!AC) return null;
      if (!ac || ac.state === 'closed') ac = new AC();
      if (ac.state === 'suspended' && ac.resume) ac.resume();
      return ac;
    } catch (e) { return null; }
  }
  function despierta() {
    var c = audio(); if (!c || aliento) return;
    try {
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = 60; g.gain.value = 0.002;
      o.connect(g); g.connect(c.destination); o.start();
      aliento = { o: o, g: g };
    } catch (e) { aliento = null; }
  }
  function duerme() {
    try { if (aliento) { aliento.o.stop(); aliento.o.disconnect(); aliento.g.disconnect(); } } catch (e) {}
    aliento = null;
    try { if (ac && ac.state !== 'closed') ac.close(); } catch (e) {}
    ac = null;
  }
  function toca(notas, vol, dura) {
    var c = audio(); if (!c) return;
    try {
      var t = c.currentTime + 0.12;
      notas.forEach(function (n) {
        var o = c.createOscillator(), g = c.createGain();
        o.type = 'sine'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t + n[1]); g.gain.exponentialRampToValueAtTime(vol, t + n[1] + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + n[1] + dura);
        o.connect(g); g.connect(c.destination); o.start(t + n[1]); o.stop(t + n[1] + dura + 0.05);
      });
      sonidos++;
    } catch (e) {}
  }
  function suenaUno(cuantos) {                       // un alumno más en verde: «plin» corto (hasta 3 seguidos si llegan varios a la vez)
    var notas = [], k = Math.max(1, Math.min(3, cuantos || 1));
    for (var i = 0; i < k; i++) notas.push([1046.5, i * 0.13]);
    toca(notas, 0.2, 0.22);
  }
  function aviso() { toca([[880, 0], [1108.7, 0.15], [1318.5, 0.30]], 0.24, 0.55); }   // todos: tres notas hacia arriba

  /* (v3) todos en verde → la solución se abre sola: se pulsa «✔ Corregir» (lo mismo que haría Iago), una vez por final */
  /* (v4) la espera se ve en el CENTRO de la pantalla: «Revelar dictado en 3 · 2 · 1» y se abre. Tocar el rótulo la cancela (queda el botón de siempre). */
  var cuenta = null, quedan = 0;
  function anulaAuto() {
    if (autoT) { clearInterval(autoT); autoT = null; }
    if (cuenta && cuenta.parentNode) cuenta.parentNode.removeChild(cuenta);
    cuenta = null; quedan = 0;
  }
  function programaAuto() {
    if (autoT) return;
    var ov0 = D.getElementById('dcOverlay'); if (!ov0) return;
    quedan = Math.max(1, Math.round(ESPERA_AUTO / 1000));
    cuenta = D.createElement('div'); cuenta.id = 'dcEnvCuenta';
    cuenta.innerHTML = '<div class="c-caja" title="Tocar para cancelar"><div class="c-t">Revelar dictado en</div><div class="c-n">' + quedan + '</div><div class="c-x">toca para cancelar</div></div>';
    cuenta.firstChild.addEventListener('click', function (e) { e.stopPropagation(); revelado = true; anulaAuto(); pinta(); });
    ov0.appendChild(cuenta);
    autoT = setInterval(function () {
      quedan--;
      if (quedan > 0) {
        var n = cuenta && cuenta.querySelector('.c-n');
        if (n) n.textContent = quedan;
        return;
      }
      anulaAuto();
      var ov = D.getElementById('dcOverlay'), vr = D.getElementById('dcVerRes');
      var sigue = encendido && caja && caja.classList.contains('todos') && ov && ov.classList.contains('abierto') && vr && vr.classList.contains('fin');
      if (sigue && !revelado) { revelado = true; autos++; try { vr.click(); } catch (e) {} }
      pinta();
    }, 1000);
  }

  function pinta() {
    var ov = D.getElementById('dcOverlay'); if (!caja || !ov) return;
    var vivos = lista.filter(function (a) { return !quitados[a.id]; });
    var ok = vivos.filter(function (a) { return hechos[a.id]; }).length, tot = vivos.length;
    var nq = lista.length - tot, todos = tot > 0 && ok === tot;
    var letra = String(grupo || '').replace(/^2Gp/, '');
    var h = '<span class="e-n">' + ok + ' de ' + tot + (todos ? ' ✓' : '') + '</span>' +
            '<button type="button" class="e-g" data-e="grupo" title="Cambiar de grupo">Grupo ' + esc(letra) + '</button>';
    vivos.forEach(function (a) {
      h += hechos[a.id] ? '<span class="e-a ok">✓ ' + esc(a.rotulo) + '</span>'
                        : '<span class="e-a">' + esc(a.rotulo) + '<button type="button" data-e="quita" data-id="' + esc(a.id) + '" title="No ha venido: quitarlo">✕</button></span>';
    });
    if (nq) h += '<button type="button" class="e-r" data-e="vuelve" title="Volver a poner a los quitados">↺ ' + nq + '</button>';
    if (fallo) h += '<span class="e-x">' + esc(fallo) + '</span>';
    if (todos && !sonado && vistoFaltar && !revelado) programaAuto();     // antes de pintar, para que salga el rótulo
    if (!todos) { anulaAuto(); if (tot > 0 && primera === false) vistoFaltar = true; }   // «faltar» de verdad: ya mirado en Supabase
    if (caja.innerHTML !== h) caja.innerHTML = h;
    caja.classList.toggle('todos', todos);
    ov.classList.toggle('dcenv-todos', todos);
    ov.classList.toggle('dcenv-espera', !todos);
    if (todos && !sonado) { sonado = true; aviso(); }
    if (!todos) sonado = false;
  }

  async function ronda() {
    if (cargando || !grupo) return;
    cargando = true;
    try {
      if (listaDe !== grupo) { lista = await cargaLista(grupo); listaDe = grupo; leeQ(); hechos = {}; sonado = false; primera = true; vistoFaltar = false; anulaAuto(); }
      var antes = hechos, despues = await miraDictados(), nuevos = 0;
      lista.forEach(function (a) { if (despues[a.id] && !antes[a.id] && !quitados[a.id]) nuevos++; });
      hechos = despues;
      if (nuevos && primera === false) suenaUno(nuevos);      // la primera vez que se mira no suena: son los que ya estaban
      primera = false;
      fallo = '';
    } catch (e) { fallo = 'Sin conexión: no puedo ver quién ha enviado'; }
    cargando = false;
    pinta();
  }

  function monta(ov) {
    caja = D.createElement('div'); caja.id = 'dcEnv';
    var abajo = ov.querySelector('.dc-bottom');
    if (abajo && abajo.parentNode === ov) ov.insertBefore(caja, abajo); else ov.appendChild(caja);
    caja.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-e]') : null; if (!b) return;
      var q = b.getAttribute('data-e');
      if (q === 'quita') { quitados[b.getAttribute('data-id')] = 1; guardaQ(); pinta(); }
      else if (q === 'vuelve') { quitados = {}; guardaQ(); pinta(); }
      else if (q === 'grupo') { manualHasta = Date.now() + 45 * 60000; grupo = GRUPOS[(GRUPOS.indexOf(grupo) + 1) % GRUPOS.length]; lista = []; hechos = {}; listaDe = null; pinta(); ronda(); }
    });
  }

  async function enciende(ov) {
    if (!caja || !caja.isConnected) monta(ov);
    caja.classList.add('on');
    primera = true; despierta();
    /* el grupo, el de la hora, cada vez que se llega al final (a las 18 el C, a las 19 el F); si Iago lo cambió a mano, se respeta 45 min */
    if (!grupo || Date.now() > manualHasta) { var g = await grupoDeAhora(); if (g !== grupo) { grupo = g; lista = []; hechos = {}; listaDe = null; } }
    pinta();
    await ronda();
    if (!mirando) mirando = setInterval(ronda, CADA);
  }
  function apaga() {
    if (mirando) { clearInterval(mirando); mirando = null; }
    if (caja) caja.classList.remove('on', 'todos');
    var ov = D.getElementById('dcOverlay'); if (ov) ov.classList.remove('dcenv-todos', 'dcenv-espera');
    sonado = false; vistoFaltar = false; revelado = false; anulaAuto();
    duerme();
  }

  /* el dictado ha llegado al final cuando «✔ Corregir» se enciende (clase «fin»); se mira cada poco, sin tocar DictadoClase */
  var encendido = false, autos = 0;
  function mira() {
    var ov = D.getElementById('dcOverlay'), vr = D.getElementById('dcVerRes');
    var toca = !!(ov && ov.classList.contains('abierto') && vr && vr.classList.contains('fin') && esProtester() && cfg());
    if (toca && !encendido) {
      encendido = true;
      enciende(ov);
    } else if (!toca && encendido) { encendido = false; apaga(); }
  }
  function arranca() { if (!vigia) vigia = setInterval(mira, 700); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', arranca); else arranca();

  W.LMDictadoEnviados = { estado: function () { return { grupo: grupo, lista: lista.length, hechos: Object.keys(hechos).length, quitados: Object.keys(quitados).length, encendido: encendido, sonidos: sonidos, aliento: !!aliento, auto: !!autoT, quedan: quedan, autos: autos, revelado: revelado }; } };
})();
