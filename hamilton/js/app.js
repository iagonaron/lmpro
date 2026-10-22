/* Hamilton · portal de 2.º GP · LM at home · 22-oct-2026 · C1
   Caminos: «Análisis de Altozano» (YouTube a 1×, entero) o «Hamilton exprés». Después, test de 15 preguntas
   corregido en el servidor (suite_hamilton_entregar) que deja la nota en el Diario como «Ficha Hamilton». */
(function () {
  "use strict";
  // Iconos en SVG (los caracteres ▶ ◀ 🔊 se ven como emoji en el iPad)
  var ICO = (function () {
    var i = function (d) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    return {
      play: i("M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.4-6.8c.6-.4.6-1.4 0-1.8L9.6 4.3C8.9 3.9 8 4.4 8 5.2z"),
      pausa: i("M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"),
      stop: i("M7 7h10v10H7z"),
      otra: i("M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"),
      atras: i("M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"),
      vol: i("M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"),
      mudo: i("M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"),
      pantalla: i("M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z")
    };
  })();
  var CFG = {
    SB_URL: "https://woiptkyrxkbpnvioypit.supabase.co",
    SB_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA",
    YT_ID: "MploZ2urlwo",
    UMBRAL: 0.97,            // parte del vídeo que hay que ver a 1× para darlo por visto
    GUARDA_VIDEO_S: 120      // cada cuánto se guarda el avance del vídeo en el servidor
  };
  CFG.MEDIA_FN = CFG.SB_URL + "/functions/v1/hamilton-media";

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var ls = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  var st = { cuenta: null, previa: false, est: null, urls: {}, resp: {}, qi: 0, yt: null };

  /* ── Cuenta ─────────────────────────────────────── */
  function leerCuenta() {
    var h = new URLSearchParams(location.hash.slice(1));
    var c = h.get("cu") || h.get("c");
    if (c) {
      try { sessionStorage.setItem("ham_cuenta", c); } catch (e) {}
      history.replaceState(null, "", location.pathname + location.search);
    } else { try { c = sessionStorage.getItem("ham_cuenta"); } catch (e) {} }
    return c && /^[0-9a-f-]{36}$/i.test(c) ? c : null;
  }
  function k(n) { return "ham_" + (st.cuenta || "previa") + "_" + n; }

  /* ── Servidor (o vista previa local) ────────────── */
  function rpc(fn, args) {
    return fetch(CFG.SB_URL + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: CFG.SB_ANON, Authorization: "Bearer " + CFG.SB_ANON },
      body: JSON.stringify(args)
    }).then(function (r) { return r.json(); });
  }
  var PREVIA = {
    datos: function () { return ls.get("ham_previa_estado", { camino: null, progreso: {}, completado: false, entregado: false, nota: null, detalle: null }); },
    guardar: function (d) { ls.set("ham_previa_estado", d); },
    estado: function () {
      var d = this.datos();
      return Promise.resolve({ ok: true, tester: true, abierta: true, cerrada: false,
        abre_en: "2026-12-03T07:00:00Z", cierra_en: "2026-12-10T18:00:00Z", soluciones_desde: "2026-12-10T18:00:00Z",
        camino: d.camino, progreso: d.progreso, completado: d.completado, entregado: d.entregado, nota: d.nota,
        detalle: d.detalle, soluciones: window.HAM_PREVIA_CLAVE || null, explicaciones: window.HAM_PREVIA_EXPLICA || null });
    },
    progreso: function (camino, prog, comp) {
      var d = this.datos();
      if (!d.camino) d.camino = camino;
      for (var x in prog) d.progreso[x] = prog[x];
      if (comp) d.completado = true;
      this.guardar(d); return Promise.resolve({ ok: true, completado: d.completado });
    },
    entregar: function (resp) {
      var clave = window.HAM_PREVIA_CLAVE || {}, pts = 0, tot = 0, det = {};
      Object.keys(clave).forEach(function (q) {
        tot += 1; var c = clave[q];
        if (typeof c === "string") { var ok = resp[q] === c; pts += ok ? 1 : 0; det[q] = { ok: ok, resp: resp[q] }; }
        else { var n = 0, b = 0; for (var f in c) { n++; if (((resp[q] || {})[f] || "").toLowerCase() === c[f]) b++; } pts += b / n; det[q] = { aciertos: b, de: n, resp: resp[q] }; }
      });
      var d = this.datos(); d.entregado = true; d.nota = Math.round(pts * 1000 / Math.max(tot, 1)) / 100; d.detalle = det; this.guardar(d);
      return Promise.resolve({ ok: true, nota: d.nota, puntos: pts, total: tot });
    }
  };
  function pedirEstado() { return st.previa ? PREVIA.estado() : rpc("suite_hamilton_estado", { p_cuenta_id: st.cuenta }); }
  function guardar(camino, prog, comp) {
    var p = st.previa ? PREVIA.progreso(camino, prog, comp)
                      : rpc("suite_hamilton_progreso", { p_cuenta_id: st.cuenta, p_camino: camino, p_progreso: prog, p_completado: !!comp });
    return p.then(function (r) {
      if (r && r.ok) { st.est.camino = st.est.camino || camino; for (var x in prog) st.est.progreso[x] = prog[x]; if (r.completado) st.est.completado = true; }
      return r;
    }).catch(function () { aviso("No se ha podido guardar tu avance. Revisa la conexión; lo vuelvo a intentar más tarde."); });
  }
  function cargarMedia(rutas) {
    rutas = rutas.filter(function (r) { return r && !st.urls[r]; });
    if (!rutas.length) return Promise.resolve();
    if (st.previa) { rutas.forEach(function (r) { st.urls[r] = "media/" + r; }); return Promise.resolve(); }
    var lotes = [];
    for (var i = 0; i < rutas.length; i += 100) lotes.push(rutas.slice(i, i + 100));
    return Promise.all(lotes.map(function (l) {
      return fetch(CFG.MEDIA_FN, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cuenta: st.cuenta, rutas: l }) })
        .then(function (r) { return r.json(); })
        .then(function (r) { if (r.ok) for (var x in r.urls) st.urls[x] = r.urls[x]; });
    })).catch(function () { aviso("No se han podido cargar los audios y vídeos. Recarga la página."); });
  }
  function u(r) { return st.urls[r] || ""; }

  /* ── Utilidades de interfaz ─────────────────────── */
  var tAviso;
  function aviso(t) {
    var el = $("#toast"); el.textContent = t; el.hidden = false;
    clearTimeout(tAviso); tAviso = setTimeout(function () { el.hidden = true; }, 4200);
  }
  function fecha(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Madrid" }).replace(",", "") +
             " a las " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });
    } catch (e) { return iso; }
  }
  function ver(id, fondo) {
    document.querySelectorAll(".vista").forEach(function (v) { v.classList.toggle("activa", v.id === id); });
    document.body.className = fondo ? "f-" + fondo : "";
    pararTodo(); window.scrollTo(0, 0);
    if (id !== "v-portada") cartaPara();
    musicaVista(id);
  }
  function pararTodo() { document.querySelectorAll("video,audio").forEach(function (m) { try { m.pause(); } catch (e) {} }); }
  function barajar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ── Pantalla de carga: una barra que avanza mientras se prepara un camino o el test ── */
  var CG = { tick: null, obj: 0, vis: 0, abierta: false };
  function pantallaCarga(txt) {
    var o = $("#cargando");
    if (!CG.abierta) { CG.obj = 0.1; CG.vis = 0; $("#cargando-b").style.width = "0%"; }
    CG.abierta = true; $("#cargando-txt").textContent = txt; o.hidden = false; o.classList.remove("sale");
    clearInterval(CG.tick);
    CG.tick = setInterval(function () {
      if (CG.obj < 0.9) CG.obj = Math.min(0.9, CG.obj + 0.005);   // sola avanza despacio hasta el 90 %
      CG.vis += (CG.obj - CG.vis) * 0.14;
      $("#cargando-b").style.width = (100 * CG.vis).toFixed(1) + "%";
    }, 50);
  }
  function cargaAvanza(x) { CG.obj = Math.max(CG.obj, x); }
  function cargaFin() {
    if (!CG.abierta) return; CG.abierta = false; CG.obj = 1;
    setTimeout(function () {
      if (CG.abierta) return;
      $("#cargando").classList.add("sale");
      setTimeout(function () { if (CG.abierta) return; clearInterval(CG.tick); $("#cargando").hidden = true; }, 400);
    }, 420);
  }
  // Espera a que los vídeos y audios de un bloque tengan algo cargado (como mucho «ms»: el iPad no precarga)
  function esperaMedios(cont, ms) {
    var ms_ = [].slice.call((cont || document).querySelectorAll("video,audio"));
    if (!ms_.length) return Promise.resolve();
    return new Promise(function (ok) {
      var t0 = Date.now(), iv = setInterval(function () {
        var listos = ms_.filter(function (m) { return m.readyState >= 2; }).length;
        cargaAvanza(0.55 + 0.4 * listos / ms_.length);
        if (listos === ms_.length || Date.now() - t0 > ms) { clearInterval(iv); ok(); }
      }, 100);
    });
  }

  /* ── Portada: «Elige tu camino» ─────────────────── */
  function portada() {
    var e = st.est, p = e.progreso || {};
    var secs = Object.keys(p.secciones || {}).length, n = window.HAM_EXPRES.length;
    var vist = p.video_vistos || 0;
    $("#cam-video").classList.toggle("hecho", e.completado && e.camino === "video");
    $("#cam-expres").classList.toggle("hecho", e.completado && e.camino === "expres");
    $("#sello-video").outerHTML = '<span id="sello-video">' + (e.completado && e.camino === "video" ? '<span class="sello ok">Visto</span>' : vist > 30 ? '<span class="sello cur">' + Math.round(100 * vist / 1976) + ' % visto</span>' : "") + "</span>";
    $("#sello-expres").outerHTML = '<span id="sello-expres">' + (e.completado && e.camino === "expres" ? '<span class="sello ok">Hecho</span>' : secs ? '<span class="sello cur">' + secs + " de " + n + " actos</span>" : "") + "</span>";
    var bloq = e.completado && !e.entregado ? false : true;
    var ft = $("#final-test");
    if (e.entregado) ft.innerHTML = '<p>Ya has entregado el test.</p><button class="btn lleno" type="button" data-ir="resultado">Ver mi nota</button>';
    else if (e.completado) ft.innerHTML = '<p><b>¡Camino terminado!</b> Te espera el tipo test: 15 preguntas, con la misma puntuación que una ficha.</p><button class="btn lleno" type="button" data-ir="test-intro">Ir al test</button>';
    else ft.innerHTML = '<p>Al terminar tu camino se abre el <b>tipo test</b>: 15 preguntas, con la misma puntuación que una ficha.</p><span class="aviso">Piénsalo bien: una vez elegido, no se puede cambiar.</span>';
    ft.dataset.bloq = bloq;
    cartaPrepara(!!ls.get(k("intro_leida"), false));
    $("#plazo-grande").innerHTML = "<b>Plazo: hasta el " + esc(fecha(e.cierra_en)) + ", antes de tu próxima clase.</b><br>Pasado el plazo, se considerará no entrega, con las mismas consecuencias que una ficha no entregada.";
    ver("v-portada");
  }

  /* ── Camino 1: vídeo de Jaime Altozano ──────────── */
  // Solo se reproduce a velocidad normal (sin los controles de YouTube) y no se puede saltar hacia delante.
  // Se puede dejar a medias: al volver, sigue donde se dejó.
  var V = { mapa: null, ultimo: -1, tick: null, guardadoEn: 0, pos: 0, dur: 1976 };
  function mapaDesde(b64, n) {
    var m = new Uint8Array(n);
    if (b64) { try { var s = atob(b64); for (var i = 0; i < n; i++) m[i] = (s.charCodeAt(i >> 3) >> (i & 7)) & 1; } catch (e) {} }
    return m;
  }
  function mapaA64(m) {
    var bytes = new Uint8Array(Math.ceil(m.length / 8));
    for (var i = 0; i < m.length; i++) if (m[i]) bytes[i >> 3] |= 1 << (i & 7);
    var s = ""; bytes.forEach(function (b) { s += String.fromCharCode(b); }); return btoa(s);
  }
  function vistos() { var c = 0; for (var i = 0; i < V.mapa.length; i++) c += V.mapa[i]; return c; }
  function lejos() { for (var i = V.mapa.length - 1; i >= 0; i--) if (V.mapa[i]) return i; return 0; }
  function mmss(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function pintaVideo() {
    var n = V.mapa.length, c = vistos(), pct = Math.min(100, Math.round(100 * c / n));
    $("#vid-barra").style.width = pct + "%";
    $("#vid-cuenta").textContent = "Visto: " + mmss(c) + " de " + mmss(n) + " (" + pct + " %)";
    var hecho = st.est.completado && st.est.camino === "video";
    $("#vid-fin").hidden = !(hecho || c >= n * CFG.UMBRAL);
    var vv = $("#v-vista");
    if (vv) { vv.style.width = (100 * lejos() / n) + "%"; $("#v-pos").style.left = (100 * V.pos / n) + "%"; $("#v-tiempo").textContent = mmss(V.pos) + " / " + mmss(n); }
  }
  function caminoVideo() {
    ver("v-video", "proscenio");
    var n = V.dur, p = st.est.progreso || {};
    var local = ls.get(k("video_mapa"), null);
    V.mapa = mapaDesde(p.video_mapa, n);
    if (local) { var m2 = mapaDesde(local, n); for (var i = 0; i < n; i++) V.mapa[i] = V.mapa[i] | m2[i]; }
    V.pos = Math.max(+(p.video_pos || 0), +(ls.get(k("video_pos"), 0) || 0));
    if (V.pos >= n - 5) V.pos = 0;
    $("#vid-fin").innerHTML = '<div class="fin-camino">' + finHTML() + "</div>";
    pintaVideo();
    if (st.yt) { cargaFin(); return; }
    var cont = $("#yt");
    pantallaCarga("Preparando el vídeo"); setTimeout(cargaFin, 6000);
    if (st.previa && !/lmathome\.es$/.test(location.hostname)) {
      cont.innerHTML = '<div class="sin-yt"><div><h3>Aquí va el vídeo de Jaime Altozano</h3><p>La vista previa no puede incrustar YouTube. En el portal de verdad el vídeo se ve aquí mismo, con controles propios: reproducir, volver 10 segundos, la barra para volver a lo ya visto, el volumen y la pantalla completa.</p><button class="btn" type="button" id="sim-video">Simular que lo he visto entero</button></div></div>';
      $("#sim-video").onclick = function () { for (var i = 0; i < n; i++) V.mapa[i] = 1; pintaVideo(); guardaVideo(true); };
      cargaFin(); return;
    }
    var s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = function () {
      st.yt = new YT.Player("yt-player", {
        videoId: CFG.YT_ID,
        playerVars: { controls: 0, disablekb: 1, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3, fs: 0, cc_load_policy: 0, cc_lang_pref: "es", start: Math.floor(V.pos) },
        events: {
          onReady: function (ev) { cargaFin(); controlesVideo(ev); },
          onPlaybackRateChange: function (ev) { if (ev.data !== 1) st.yt.setPlaybackRate(1); },
          onStateChange: function (ev) {
            clearInterval(V.tick);
            $("#v-play").innerHTML = ev.data === 1 ? ICO.pausa : ICO.play;
            if (ev.data === 1) sinSubtitulos();
            if (ev.data === 1) { musica("off"); V.ultimo = Math.floor(st.yt.getCurrentTime()); V.tick = setInterval(tickVideo, 1000); }
            else guardaVideo(false);
          }
        }
      });
    };
    s.onerror = function () { cont.innerHTML = '<div class="sin-yt">No se ha podido cargar el vídeo. Comprueba la conexión y recarga la página.</div>'; };
    document.head.appendChild(s);
  }
  // Sin subtítulos automáticos (YouTube los activa solo en algunos dispositivos)
  function sinSubtitulos() {
    var p = st.yt; if (!p) return;
    try { p.setOption("captions", "track", {}); } catch (e) {}
    try { p.unloadModule("captions"); } catch (e) {}
    try { p.unloadModule("cc"); } catch (e) {}
  }
  function controlesVideo() {
    var p = st.yt;
    $("#v-play").onclick = function () { if (p.getPlayerState() === 1) p.pauseVideo(); else p.playVideo(); };
    $("#v-atras").onclick = function () { var t = Math.max(0, p.getCurrentTime() - 10); p.seekTo(t, true); V.ultimo = Math.floor(t); V.pos = t; pintaVideo(); };
    $("#v-vol").onclick = function () { if (p.isMuted()) { p.unMute(); this.innerHTML = ICO.vol; } else { p.mute(); this.innerHTML = ICO.mudo; } };
    $("#v-full").onclick = function () { var m = $("#yt"), f = m.requestFullscreen || m.webkitRequestFullscreen; if (document.fullscreenElement) document.exitFullscreen(); else if (f) f.call(m); };
    $("#v-barra").onclick = function (ev) {
      var r = this.getBoundingClientRect(), t = Math.floor(V.dur * (ev.clientX - r.left) / r.width);
      if (t > lejos() + 2) { aviso("Puedes volver a lo que ya has visto, pero no saltar hacia delante."); return; }
      p.seekTo(t, true); V.ultimo = t; V.pos = t; pintaVideo();
    };
  }
  function tickVideo() {
    var p = st.yt; if (!p || !p.getCurrentTime) return;
    if (p.getPlaybackRate() !== 1) { p.setPlaybackRate(1); return; }
    var t = Math.floor(p.getCurrentTime());
    if (t - V.ultimo >= 0 && t - V.ultimo <= 2) { for (var i = Math.max(0, V.ultimo); i <= t && i < V.mapa.length; i++) V.mapa[i] = 1; }
    else if (t > lejos() + 2) { p.seekTo(V.ultimo, true); return; }
    V.ultimo = t; V.pos = t;
    ls.set(k("video_mapa"), mapaA64(V.mapa)); ls.set(k("video_pos"), t);
    pintaVideo();
    var fin = vistos() >= V.mapa.length * CFG.UMBRAL;
    if (fin && !st.est.completado) guardaVideo(true);
    else if (Date.now() - V.guardadoEn > CFG.GUARDA_VIDEO_S * 1000) guardaVideo(false);
  }
  function guardaVideo(fin) {
    if (!V.mapa) return;
    V.guardadoEn = Date.now();
    guardar("video", { video_vistos: vistos(), video_mapa: mapaA64(V.mapa), video_pos: Math.floor(V.pos) }, !!fin).then(function () { pintaVideo(); });
  }

  /* ── Camino 2: Hamilton exprés · un único visor dorado ──────── */
  // Cada parte es una sucesión de pasos (una frase con su momento musical, una lectura breve o una actividad)
  // (sin «Quédate con…» desde el 22-oct 14:05). «Siguiente» se abre cuando el paso está hecho; se puede volver atrás.
  // Se guarda el paso en el que va el alumno y se retoma ahí.
  var X = { pasos: [], i: 0, max: 0 };
  function construyePasos() {
    X.pasos = [];
    window.HAM_EXPRES.forEach(function (parte, p) {
      parte.pasos.forEach(function (s) { X.pasos.push({ p: p, s: s }); });
    });
  }
  function primerPaso(p) { for (var i = 0; i < X.pasos.length; i++) if (X.pasos[i].p === p) return i; return X.pasos.length; }
  function rutasExpres() {
    var r = [], F = window.HAM_FIG || {};
    for (var f in F) r.push(F[f]);
    window.HAM_EXPRES.forEach(function (parte) {
      parte.pasos.forEach(function (s) {
        if (s.src) r.push(s.src);
        (s.cartas || []).forEach(function (c) { if (c.img) r.push(c.img); });
        (s.fichas || []).forEach(function (x) { r.push(x.img); });
        var a = s.a; if (!a) return;
        [a.img, a.audio, a.video].forEach(function (x) { if (x) r.push(x); });
        (a.opciones || []).forEach(function (o) { if (o.img) r.push(o.img); });
        (a.items || []).forEach(function (it) { if (it && it.src) r.push(it.src); if (Array.isArray(it) && it[2]) r.push(it[2]); });
      });
    });
    return r.filter(function (x, i, arr) { return x && arr.indexOf(x) === i; });
  }
  function caminoExpres() {
    ver("v-expres");
    construyePasos();
    var p = st.est.progreso || {}, loc = ls.get(k("expres"), null) || {}, ult = X.pasos.length - 1;
    X.max = Math.min(ult, Math.max(+p.expres_max || 0, +loc.max || 0));
    if (st.est.completado) X.max = ult;
    X.i = Math.min(X.max, Math.max(+p.expres_i || 0, +loc.i || 0));
    $("#expres-cuerpo").innerHTML = "";
    pantallaCarga("Preparando el exprés");
    cargarMedia(rutasExpres()).then(function () {
      cargaAvanza(0.55); pintaPaso(false);
      return esperaMedios($("#vo-cuerpo"), 3500);
    }).then(cargaFin, cargaFin);
  }
  function guardaExpres(fin) {
    ls.set(k("expres"), { i: X.i, max: X.max });
    return guardar("expres", { expres_i: X.i, expres_max: X.max }, !!fin);
  }
  function pintaPartes() {
    var S = window.HAM_EXPRES, cur = X.pasos[X.i].p;
    $("#actos").innerHTML = S.map(function (s, p) {
      var abierta = primerPaso(p) <= X.max, hecha = st.est.completado || primerPaso(p + 1) - 1 < X.max;
      return '<button type="button" class="paso' + (p === cur ? " actual" : "") + (hecha ? " hecho" : "") + '" data-parte="' + p + '"' + (abierta ? "" : " disabled") +
        ' title="' + esc(s.titulo) + '" aria-label="Parte ' + (p + 1) + ": " + esc(s.titulo) + '">' + (p + 1) + "</button>";
    }).join("");
  }
  function pintaPaso(auto) {
    pararTodo(); pintaPartes();
    var P = X.pasos[X.i], parte = window.HAM_EXPRES[P.p], s = P.s;
    var ini = primerPaso(P.p), tot = primerPaso(P.p + 1) - ini;
    var ultimo = X.i === X.pasos.length - 1, finParte = !ultimo && X.pasos[X.i + 1].p !== P.p;
    var hecho = X.i < X.max || st.est.completado;
    $("#expres-cuerpo").innerHTML = '<div class="vo" id="vo">' +
      '<div class="vo-cab"><span class="vo-parte"><b>' + (P.p + 1) + "</b>" + esc(parte.titulo) + '</span><span class="vo-cuenta">' + (X.i - ini + 1) + " / " + tot + "</span></div>" +
      '<div class="vo-cuerpo" id="vo-cuerpo"></div>' +
      '<div class="vo-pie"><button class="btn icono" type="button" id="vo-ant" aria-label="Paso anterior" title="Paso anterior"' + (X.i ? "" : " disabled") + ">" + ICO.atras + "</button>" +
      '<span class="vo-estado" id="vo-estado"></span>' +
      '<button class="btn lleno" type="button" id="vo-sig">' + (ultimo ? "Terminar" : finParte ? "Parte " + (P.p + 2) : "Siguiente") + "</button></div></div>";
    var cuerpo = $("#vo-cuerpo"), sig = $("#vo-sig"), estado = $("#vo-estado");
    var bloquea = function (t) { sig.disabled = true; estado.textContent = t; };
    var listo = function () { sig.disabled = false; estado.textContent = ""; };
    if (s.t === "texto") { cuerpo.innerHTML = textoHTML(s); listo(); if (s.cartel) $("#vo").classList.add("con-cartel"); }
    else if (s.t === "clip") { bloquea("Escúchalo entero para seguir"); pasoClip(cuerpo, s, auto, listo); if (hecho) listo(); }
    else if (s.t === "act") { bloquea(s.a.tipo === "ordena" ? "Ordénalas bien para seguir" : "Haz la actividad para seguir"); actividad(s.a, cuerpo, listo, auto); if (hecho) listo(); }
    $("#vo-ant").onclick = function () { if (X.i) { X.i--; guardaExpres(false); pintaPaso(false); } };
    sig.onclick = function () {
      if (sig.disabled) return;
      if (ultimo) {
        sig.disabled = true; X.max = X.pasos.length - 1;
        guardaExpres(true).then(function (r) { if (r && r.ok) { st.est.completado = true; finCamino(); } else sig.disabled = false; });
        return;
      }
      X.i++; X.max = Math.max(X.max, X.i); guardaExpres(false); pintaPaso(true);
      var vo = $("#vo"); if (vo && vo.getBoundingClientRect().top < 0) vo.scrollIntoView({ block: "start" });
    };
  }
  function textoHTML(s) {
    var F = window.HAM_FIG || {};
    if (s.cartel) return '<div class="vo-cartel"><span class="sello-t">Aviso</span><h3>' + esc(s.h) + '</h3><p class="sub">' + esc(s.sub) + "</p>" +
      s.txt.map(function (t) { return "<p>" + t + "</p>"; }).join("") + "</div>";
    if (s.txt) return '<div class="vo-solo">' + (s.fig && F[s.fig] ? '<img alt="" src="' + esc(u(F[s.fig])) + '">' : "") + "<p>" + s.txt + "</p></div>";
    var h = '<h3 class="vo-h">' + esc(s.h) + "</h3>";
    if (s.cartas) h += '<div class="vo-cartas' + (s.flujo ? " flujo" : "") + '">' + s.cartas.map(function (c) {
      return '<div class="vo-carta' + (c.img ? " con-img" : "") + '">' + (c.img ? '<img alt="" src="' + esc(u(c.img)) + '">' : "") + "<div><b>" + esc(c.k) + "</b><span>" + esc(c.t) + "</span></div></div>";
    }).join("") + "</div>";
    if (s.fichas) h += '<div class="vo-fichas">' + s.fichas.map(function (f) {
      return '<div class="vo-ficha"><img alt="" src="' + esc(u(f.img)) + '"><b>' + esc(f.n) + "</b><span>" + esc(f.t) + "</span></div>";
    }).join("") + "</div>";
    if (s.nota) h += '<p class="vo-nota">' + esc(s.nota) + "</p>";
    return h;
  }
  function intenta(m) { pararTodo(); var p = m.play(); if (p && p.catch) p.catch(function () {}); }
  // Reproductor propio: sin barra para saltar; cuenta lo escuchado de verdad
  function controlVideo(v, b, alAcabar) {
    var oido = 0, ult = 0, barra = v.parentNode.querySelector(".vo-barra b");
    var pinta = function () { b.hidden = !v.paused; b.innerHTML = v.ended ? ICO.otra + " Otra vez" : (b.dataset.txt ? ICO.play + " " + esc(b.dataset.txt) : ICO.play); };
    b.onclick = function () { if (v.ended) { v.currentTime = 0; ult = 0; } intenta(v); };
    v.onclick = function () { if (v.paused) intenta(v); else v.pause(); };
    v.onplay = v.onpause = pinta;
    v.ontimeupdate = function () {
      var t = v.currentTime; if (t > ult && t - ult < 1.5 * (v.playbackRate || 1)) oido += t - ult; ult = t;
      if (barra && v.duration) barra.style.width = (100 * t / v.duration) + "%";
    };
    v.onended = function () { pinta(); if (oido >= (v.duration || 0) * 0.8) alAcabar(); };
    pinta();
  }
  function videoHTML(src, txtBoton, peq) {
    return '<div class="vo-video' + (peq ? " peq" : "") + '"><video playsinline preload="auto" src="' + esc(u(src)) + '"></video>' +
      '<button type="button" class="vo-play' + (txtBoton ? "" : " solo") + '" data-txt="' + esc(txtBoton || "") + '" aria-label="' + esc(txtBoton || "Reproducir") + '">' + (txtBoton ? ICO.play + " " + esc(txtBoton) : ICO.play) + '</button><i class="vo-barra"><b></b></i><div class="vo-atras" hidden></div></div>';
  }
  function pasoClip(el, s, auto, listo) {
    var F = window.HAM_FIG || {};
    el.innerHTML = '<p class="vo-txt">' + (s.fig && F[s.fig] ? '<img class="vo-fig" alt="" src="' + esc(u(F[s.fig])) + '">' : "") + "<span>" + s.txt + "</span></p>" + videoHTML(s.src);
    var v = el.querySelector("video");
    controlVideo(v, el.querySelector(".vo-play"), listo);
    if (auto) intenta(v);
  }

  /* Actividades del exprés (no puntúan: se completan haciéndolas) */
  function actividad(a, el, listo, auto) {
    if (a.tipo === "empareja") empareja(a, el, listo);
    if (a.tipo === "oido") oido(a, el, listo, auto);
    if (a.tipo === "pulsa") pulsa(a, el, listo);
    if (a.tipo === "preguntas") preguntas(a, el, listo);
    if (a.tipo === "ordena") ordena(a, el, listo);
  }
  function empareja(a, el, listo) {
    var dcha = barajar(a.items.map(function (x) { return x[1]; })), sel = {};
    el.innerHTML = '<p class="vo-consigna">' + a.consigna + '</p><div class="empareja">' + a.items.map(function (x, i) {
      var img = x[2] || a.img;
      return '<div class="fila-e"><div class="izq">' + (img ? '<img alt="" src="' + esc(u(img)) + '">' : "") + "<span>" + esc(x[0]) + '</span></div><div class="chips" style="--n:' + (dcha.length > 3 ? 2 : dcha.length) + '" data-i="' + i + '">' +
        dcha.map(function (d) { return '<button type="button" class="chip-op" data-v="' + esc(d) + '">' + esc(d) + "</button>"; }).join("") + "</div></div>";
    }).join("") + '</div><div class="botonera"><span class="vo-feed" id="e-res"></span><button class="btn lleno" type="button" id="e-comp">Comprobar</button></div>';
    el.querySelectorAll(".chips").forEach(function (c) {
      c.onclick = function (ev) { var b = ev.target.closest(".chip-op"); if (!b) return; c.querySelectorAll(".chip-op").forEach(function (x) { x.classList.remove("sel", "bien", "mal"); }); b.classList.add("sel"); sel[c.dataset.i] = b.dataset.v; };
    });
    $("#e-comp", el).onclick = function () {
      if (Object.keys(sel).length < a.items.length) { aviso("Te falta unir alguno."); return; }
      var b = 0;
      el.querySelectorAll(".chips").forEach(function (c) { var i = c.dataset.i, ok = sel[i] === a.items[i][1]; if (ok) b++; var x = c.querySelector(".chip-op.sel"); if (x) x.classList.add(ok ? "bien" : "mal"); });
      var r = $("#e-res", el); r.className = "vo-feed " + (b === a.items.length ? "bien" : "mal");
      r.textContent = b === a.items.length ? "¡Perfecto! Todo bien." : "Llevas " + b + " de " + a.items.length + ". Las verdes están bien; corrige las rojas si quieres.";
      listo();
    };
  }
  // «¿Quién canta?»: letra sin personaje; se contesta cuando se sepa. Al acabar el fragmento, 5 s para decidir.
  function oido(a, el, listo, auto) {
    var i = 0, bien = 0, reloj = null, pasa = null;
    function item(play) {
      clearInterval(reloj); clearTimeout(pasa);
      var it = a.items[i], contestado = false;
      // los personajes, grandes, a los lados del vídeo; los botones, solo con el nombre
      var fig = function (o, lado) { return '<button type="button" class="quien-fig ' + lado + '" data-o="' + esc(o.n) + '" aria-label="' + esc(o.n) + '"><img alt="" src="' + esc(u(o.img)) + '"></button>'; };
      el.innerHTML = '<p class="vo-consigna">' + a.consigna + "</p>" +
        '<div class="oido-escena">' + fig(a.opciones[0], "izq") + videoHTML(it.src, "Escuchar", true) + fig(a.opciones[1], "dcha") + "</div>" +
        '<div class="quien">' + a.opciones.map(function (o) { return '<button type="button" class="quien-op" data-o="' + esc(o.n) + '">' + esc(o.n) + "</button>"; }).join("") + "</div>" +
        '<p class="vo-feed" id="o-feed">' + (i + 1) + " de " + a.items.length + "</p>";
      var v = el.querySelector("video"), atras = el.querySelector(".vo-atras"), feed = $("#o-feed", el);
      controlVideo(v, el.querySelector(".vo-play"), function () {});
      v.addEventListener("ended", function () {
        if (contestado) return;
        var n = 5; atras.hidden = false; atras.textContent = n;
        reloj = setInterval(function () { n--; if (n <= 0) responde(null); else atras.textContent = n; }, 1000);
      });
      el.onclick = function (ev) { var b = ev.target.closest(".quien-op, .quien-fig"); if (b && !contestado) responde(b.dataset.o); };
      function responde(o) {
        contestado = true; clearInterval(reloj); atras.hidden = true;
        var ok = o === it.ok; if (ok) bien++;
        el.querySelectorAll(".quien-op, .quien-fig").forEach(function (x) { x.disabled = true; if (x.dataset.o === it.ok) x.classList.add("bien"); else { x.classList.add("apaga"); if (x.dataset.o === o) x.classList.add("mal"); } });
        feed.className = "vo-feed " + (ok ? "bien" : "mal");
        feed.innerHTML = (o === null ? "Se acabó el tiempo: era <b>" + esc(it.ok) + "</b>. " : ok ? "✓ ¡Bien! " : "Era <b>" + esc(it.ok) + "</b>. ") + it.pie +
          '<i class="espera" style="animation-duration:' + (ok ? 3.5 : 4.5) + 's"></i>';
        pasa = setTimeout(function () { v.pause(); i++; if (i < a.items.length) item(true); else final(); }, ok ? 3500 : 4500);
      }
      if (play) intenta(v);
    }
    function final() {
      el.innerHTML = '<div class="vo-final"><p class="vo-h">Has acertado ' + bien + " de " + a.items.length + "</p><p>" +
        (bien === a.items.length ? "¡Qué oído!" : "Tranquilo: en el musical vuelven una y otra vez y los irás reconociendo.") + "</p></div>";
      listo();
    }
    item(!!auto);
  }
  // «¡Ahora!»: el fragmento empieza con música; vale desde que entra el coro hasta que termina la frase.
  function pulsa(a, el, listo) {
    el.innerHTML = '<p class="vo-consigna">' + a.consigna + "</p>" +
      '<div class="pulsa"><button type="button" class="btn lleno" id="p-play">' + ICO.play + ' Escuchar</button><button type="button" class="pulsa-ya" id="p-ya" disabled>¡Ahora!</button></div>' +
      '<i class="vo-barra suelta"><b id="p-b"></b></i><p class="vo-feed" id="p-feed"></p><div id="p-ver"></div>' +
      '<audio id="p-au" preload="auto" src="' + esc(u(a.audio)) + '"></audio>';
    var au = $("#p-au", el), pl = $("#p-play", el), ya = $("#p-ya", el), feed = $("#p-feed", el), marcado = false;
    var seg = function (t) { return String(Math.round(t * 10) / 10).replace(".", ","); };
    au.ontimeupdate = function () { $("#p-b", el).style.width = (100 * au.currentTime / (au.duration || 1)) + "%"; };
    pl.onclick = function () {
      marcado = false; $("#p-ver", el).innerHTML = ""; au.currentTime = 0; intenta(au);
      ya.disabled = false; pl.innerHTML = ICO.otra + " Otra vez"; feed.className = "vo-feed"; feed.textContent = "Escucha… y pulsa «¡Ahora!» cuando entre el coro.";
    };
    ya.onclick = function () {
      if (marcado) return; marcado = true; ya.disabled = true;
      var t = au.currentTime, w = a.ventana, ok = t >= w[0] && t <= w[1]; au.pause();
      feed.className = "vo-feed " + (ok ? "bien" : "mal");
      feed.textContent = ok ? "✓ ¡Justo! Lo has marcado en el segundo " + seg(t) + ": ahí está el coro." :
        (t < w[0] ? "Un poco pronto (segundo " + seg(t) + "): el coro entra en el segundo " + a.entra + ". Prueba otra vez si quieres." :
                    "Un poco tarde (segundo " + seg(t) + "): el coro entra en el segundo " + a.entra + ". Prueba otra vez si quieres.");
      revela(); listo();
    };
    au.onended = function () {
      ya.disabled = true;
      if (!marcado) { feed.className = "vo-feed mal"; feed.textContent = "Se ha terminado sin que pulsaras. El coro entra en el segundo " + a.entra + ": prueba otra vez."; revela(); listo(); }
    };
    function revela() {
      $("#p-ver", el).innerHTML = '<p class="vo-txt"><span>' + a.pie + " Míralo ahora con la letra:</span></p>" + videoHTML(a.video, "", true);
      var v = $("#p-ver video", el); controlVideo(v, $("#p-ver .vo-play", el), function () {});
    }
  }
  function preguntas(a, el, listo) {
    var dadas = 0;
    el.innerHTML = '<p class="vo-consigna">' + a.consigna + "</p>" + a.items.map(function (q, i) {
      return '<div class="vo-preg"><p>' + esc(q.q) + '</p><div class="chips" data-i="' + i + '">' + q.o.map(function (o, j) { return '<button type="button" class="chip-op" data-j="' + j + '">' + esc(o) + "</button>"; }).join("") + "</div></div>";
    }).join("");
    el.querySelectorAll(".chips").forEach(function (c) {
      c.onclick = function (ev) {
        var b = ev.target.closest(".chip-op"); if (!b || c.dataset.hecho) return; c.dataset.hecho = 1;
        var q = a.items[c.dataset.i], ok = +b.dataset.j === q.ok;
        b.classList.add(ok ? "bien" : "mal"); if (!ok) c.querySelectorAll(".chip-op")[q.ok].classList.add("bien");
        dadas++; if (dadas === a.items.length) listo();
      };
    });
  }
  // Ordenar arrastrando (ratón o dedo). Con el teclado: flechas arriba y abajo.
  function ordena(a, el, listo) {
    var orden = a.items.map(function (x, i) { return i; });
    while (orden.every(function (x, i) { return x === i; })) orden = barajar(orden);
    el.innerHTML = '<p class="vo-consigna">' + a.consigna + '</p><ol class="arrastra" id="o-lista"></ol>' +
      '<div class="botonera"><span class="vo-feed" id="o-res"></span><button class="btn lleno" type="button" id="o-comp">Comprobar</button></div>';
    var lista = $("#o-lista", el), arr = null;
    function pinta(marcar) {
      lista.innerHTML = orden.map(function (kk, pos) {
        var it = a.items[kk], cls = marcar ? (kk === pos ? " bien" : " mal") : "";
        return '<li class="tarjeta' + cls + '" data-k="' + kk + '" tabindex="0" aria-label="' + esc(it[0] + ", " + it[1]) + '"><span class="asa" aria-hidden="true">⠿</span><b>' + esc(it[0]) + "</b><span>" + esc(it[1]) + "</span></li>";
      }).join("");
    }
    function leeOrden() { orden = [].map.call(lista.children, function (x) { return +x.dataset.k; }); }
    pinta(false);
    lista.addEventListener("pointerdown", function (ev) {
      var li = ev.target.closest("li"); if (!li || ev.button > 0) return;
      ev.preventDefault();
      lista.querySelectorAll("li").forEach(function (x) { x.classList.remove("bien", "mal"); });
      arr = { li: li, y0: ev.clientY }; li.classList.add("arrastrando");
      document.addEventListener("pointermove", mueve); document.addEventListener("pointerup", suelta); document.addEventListener("pointercancel", suelta);
    });
    function mueve(ev) {
      if (!arr) return;
      var li = arr.li, antes = null, hs = [].slice.call(lista.children);
      for (var j = 0; j < hs.length; j++) { if (hs[j] === li) continue; var r = hs[j].getBoundingClientRect(); if (ev.clientY < r.top + r.height / 2) { antes = hs[j]; break; } }
      if (antes !== li.nextElementSibling && antes !== li) {
        var r0 = li.getBoundingClientRect().top; li.style.transform = "";
        lista.insertBefore(li, antes);
        arr.y0 += li.getBoundingClientRect().top - r0;
      }
      li.style.transform = "translateY(" + (ev.clientY - arr.y0) + "px)";
    }
    function suelta() {
      if (!arr) return;
      arr.li.style.transform = ""; arr.li.classList.remove("arrastrando"); arr = null; leeOrden();
      document.removeEventListener("pointermove", mueve); document.removeEventListener("pointerup", suelta); document.removeEventListener("pointercancel", suelta);
    }
    lista.addEventListener("keydown", function (ev) {
      var li = ev.target.closest("li"); if (!li || (ev.key !== "ArrowUp" && ev.key !== "ArrowDown")) return;
      ev.preventDefault();
      if (ev.key === "ArrowUp" && li.previousElementSibling) lista.insertBefore(li, li.previousElementSibling);
      if (ev.key === "ArrowDown" && li.nextElementSibling) lista.insertBefore(li.nextElementSibling, li);
      li.focus(); leeOrden();
    });
    $("#o-comp", el).onclick = function () {
      var b = orden.filter(function (kk, pos) { return kk === pos; }).length;
      if (b === orden.length) return resumen();
      pinta(true); var r = $("#o-res", el); r.className = "vo-feed mal";
      r.textContent = b + " de " + orden.length + " en su sitio. Mueve las rojas y vuelve a comprobar.";
    };
    function resumen() {
      el.innerHTML = '<h3 class="vo-h">¡Así fue su vida!</h3><div class="linea-tiempo">' + a.items.map(function (it, j) {
        return '<div class="cartel" style="--d:' + (0.2 + j * 0.55).toFixed(2) + 's"><b>' + esc(it[0]) + "</b><span>" + esc(it[1]) + "</span></div>";
      }).join("") + "</div>";
      setTimeout(listo, 400 + a.items.length * 550);
    }
  }

  /* ── Final del camino: al test ──────────────────── */
  function partesFecha(iso) {
    try {
      var d = new Date(iso);
      return { dia: d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Madrid" }).replace(",", ""),
               hora: d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }) };
    } catch (e) { return { dia: iso, hora: "" }; }
  }
  function finHTML() {
    var f = partesFecha(st.est.cierra_en);
    return '<p class="rotulo">Camino terminado</p><h2 class="fin-h">¡Ahora, el tipo test!</h2>' +
      "<p>15 preguntas, con la misma puntuación que una ficha.</p>" +
      '<p class="recordatorio">Recuerda hacerlo antes del <b>' + esc(f.dia) + "</b>, al comienzo de tu clase (<b>a las " + esc(f.hora) + "</b>).</p>" +
      '<div class="botonera centro"><button class="btn lleno" type="button" data-ir="test-intro">Ir al test</button></div>';
  }
  function finCamino() {
    if (st.est.entregado) return resultado(false);
    $("#fin-cuerpo").innerHTML = '<div class="fin-camino">' + finHTML() + '</div><p class="aviso" style="text-align:center;margin-top:18px"><button class="enlace" type="button" data-ir="camino">' +
      (st.est.camino === "video" ? "Volver al vídeo" : "Repasar el exprés") + "</button></p>";
    ver("v-fin", "escritorio");
  }

  /* ── Test ───────────────────────────────────────── */
  // Se contesta una pregunta tras otra, sin volver atrás. Cada respuesta se guarda al pasar a la siguiente:
  // si el alumno sale, retoma en la primera que le queda. Al acabar se entrega y se ve todo corregido.
  var T = window.HAM_TEST;
  function rutasTest() { var r = []; T.forEach(function (q) { var m = q.media || {}; [m.img, m.audio, m.video].forEach(function (x) { if (x) r.push(x); }); (m.figuras || []).forEach(function (f) { r.push(f); }); }); return r; }
  function cargaResp() {
    var srv = (st.est.progreso || {}).test_resp || {}, loc = ls.get(k("resp"), {}) || {};
    st.resp = {}; for (var x in srv) st.resp[x] = srv[x]; for (var y in loc) if (loc[y]) st.resp[y] = loc[y];
  }
  function respondida(q) {
    var r = st.resp[q.id];
    if (q.tipo === "emparejar") return !!r && q.media.figuras.every(function (f) { return r[f.split("/").pop().split(".")[0]]; });
    return !!r;
  }
  function primeraSinResponder() { for (var i = 0; i < T.length; i++) if (!respondida(T[i])) return i; return T.length; }
  function testIntro() {
    if (st.est.entregado) return resultado(false);
    if (!st.est.completado) { aviso("Primero termina tu camino."); return abrirCamino(); }
    cargaResp();
    var n = primeraSinResponder();
    $("#plazo-test").textContent = "hasta el " + fecha(st.est.cierra_en);
    $("#t-empezar").textContent = n ? (n >= T.length ? "Entregar el test" : "Seguir por la pregunta " + (n + 1)) : "Empezar el test";
    ver("v-test-intro", "escritorio");
  }
  function empiezaTest() {
    cargaResp();
    st.qi = primeraSinResponder();
    if (st.qi >= T.length) return entregar();
    $("#test-cuerpo").innerHTML = "";
    ver("v-test", "escritorio");
    pantallaCarga("Preparando el test");
    cargarMedia(rutasTest()).then(function () { cargaAvanza(0.55); pintaPregunta(); return esperaMedios($("#test-cuerpo"), 3000); }).then(cargaFin, cargaFin);
  }
  function pintaPregunta() {
    pararTodo(); window.scrollTo(0, 0);
    var q = T[st.qi], m = q.media || {}, sel = null, par = {}, esc_ = "", cuerpo = "";
    if (q.tipo === "img") esc_ = '<img class="figura" alt="Personaje del musical" src="' + esc(u(m.img)) + '">';
    else if (q.tipo === "aud") esc_ = '<div class="reproductor"><button type="button" class="play-grande" id="t-play" aria-label="Escuchar el fragmento">' + ICO.play + '</button><div class="ondas" id="t-ondas">' + "<i></i>".repeat(14) + '</div><span class="aviso">Puedes escucharlo las veces que quieras</span><audio id="t-audio" preload="auto" src="' + esc(u(m.audio)) + '"></audio></div>';
    else if (q.tipo === "vid") esc_ = '<div class="t-video">' + videoHTML(m.video, "Escuchar") + "</div>";
    else if (q.tipo === "emparejar") esc_ = '<div class="tira">' + m.figuras.map(function (f, i) { return '<figure><img alt="Figura ' + (i + 1) + '" src="' + esc(u(f)) + '"><figcaption>' + (i + 1) + "</figcaption></figure>"; }).join("") + "</div>";
    else esc_ = '<div class="num-grande">' + q.n + "</div>";
    if (q.tipo === "emparejar") {
      cuerpo = '<div class="parejas">' + m.figuras.map(function (f, i) {
        var key = f.split("/").pop().split(".")[0];
        return '<div><label for="sel-' + key + '">Figura ' + (i + 1) + '</label><select id="sel-' + key + '" data-f="' + key + '"><option value="">—</option>' + q.nombres.map(function (nm) { return '<option value="' + nm.toLowerCase() + '">' + esc(nm) + "</option>"; }).join("") + "</select></div>";
      }).join("") + "</div>";
    } else {
      cuerpo = '<div class="opciones">' + q.opciones.map(function (o, i) {
        return '<button type="button" class="opcion" data-id="' + o.id + '"><span class="letra">' + "abcd"[i] + "</span><span>" + esc(o.t) + "</span></button>";
      }).join("") + "</div>";
    }
    var ultimo = st.qi === T.length - 1;
    $("#test-cuerpo").innerHTML =
      '<div class="test-marco"><div class="escena' + (q.tipo === "ide" ? " escritorio" : "") + (q.tipo === "vid" ? " con-video" : "") + '">' + esc_ + "</div>" +
      '<div class="pregunta"><div class="t-cab"><p class="rotulo">Pregunta ' + q.n + " de " + T.length + '</p><i class="t-progreso"><b style="width:' + (100 * st.qi / T.length) + '%"></b></i></div>' +
      '<p class="enun">' + esc(q.texto) + "</p>" + cuerpo +
      '<div class="botonera t-pie"><span class="aviso">Al pasar a la siguiente, esta respuesta queda guardada.</span><button class="btn lleno" type="button" id="t-sig" disabled>' + (ultimo ? "Entregar el test" : "Siguiente") + "</button></div></div></div>";
    if (q.tipo === "ide") $(".escena").style.backgroundImage = 'url("img/fondos/03-escritorio-1776.webp")';
    var sig = $("#t-sig");
    if (q.tipo === "emparejar") {
      var sels = [].slice.call(document.querySelectorAll(".parejas select"));
      sels.forEach(function (s) {
        s.onchange = function () {
          // si el nombre ya estaba en otra figura, se intercambian (no se borra ninguna)
          var antes = par[s.dataset.f] || "", v = s.value;
          sels.forEach(function (o) { if (o !== s && v && o.value === v) { o.value = antes; par[o.dataset.f] = antes; } });
          par[s.dataset.f] = v;
          sig.disabled = !sels.every(function (o) { return o.value; });
        };
      });
    } else {
      $(".opciones").onclick = function (ev) {
        var b = ev.target.closest(".opcion"); if (!b) return;
        document.querySelectorAll(".opcion").forEach(function (x) { x.classList.remove("sel"); }); b.classList.add("sel");
        sel = b.dataset.id; sig.disabled = false;
      };
    }
    if (q.tipo === "aud") {
      var au = $("#t-audio"), pl = $("#t-play"), on = $("#t-ondas");
      pl.onclick = function () { if (au.paused) { au.currentTime = 0; intenta(au); } else au.pause(); };
      au.onplay = function () { pl.classList.add("sonando"); pl.innerHTML = ICO.stop; on.classList.add("on"); };
      au.onpause = au.onended = function () { pl.classList.remove("sonando"); pl.innerHTML = ICO.play; on.classList.remove("on"); };
    }
    if (q.tipo === "vid") controlVideo($(".t-video video"), $(".t-video .vo-play"), function () {});
    sig.onclick = function () {
      if (sig.disabled) return;
      st.resp[q.id] = q.tipo === "emparejar" ? par : sel;
      ls.set(k("resp"), st.resp);
      guardar(st.est.camino, { test_resp: st.resp }, false);
      if (ultimo) entregar(); else { st.qi++; pintaPregunta(); }
    };
  }

  /* Entrega con sobre lacrado: se va, se corrige y vuelve con la nota */
  var REDUCIDO = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function espera(ms) { return new Promise(function (r) { setTimeout(r, REDUCIDO ? 0 : ms); }); }
  function correoHTML(txt) {
    return '<div class="correo" id="correo"><div class="escena-correo">' +
      '<div class="sobre"><div class="sobre-fondo"></div><div class="hoja"><b>Test de Hamilton</b><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="sobre-frente"></div><div class="solapa"></div><div class="lacre">H</div></div></div>' +
      '<p class="correo-txt" id="correo-txt">' + txt + "</p></div>";
  }
  function fase(c) { var e = $("#correo"); if (e) e.className = "correo " + c; }
  function entregar() {
    pararTodo();
    $("#resultado-cuerpo").innerHTML = correoHTML("Metiendo tus respuestas en el sobre…");
    ver("v-resultado", "escritorio");
    var envio = espera(150).then(function () { fase("mete"); return espera(1100); })
      .then(function () { fase("mete cierra"); return espera(550); })
      .then(function () { fase("mete cierra sella"); $("#correo-txt").textContent = "Enviando…"; return espera(650); })
      .then(function () { fase("mete cierra sella vuela"); return espera(900); });
    var p = st.previa ? PREVIA.entregar(st.resp) : rpc("suite_hamilton_entregar", { p_cuenta_id: st.cuenta, p_respuestas: st.resp });
    Promise.all([p, envio]).then(function (res) {
      var r = res[0];
      if (!r || !r.ok) {
        if (r && r.error === "ya_entregado") return pedirEstado().then(function (e) { if (e && e.ok) st.est = e; resultado(false); });
        var msg = { fuera_de_plazo: "El plazo ya ha terminado.", falta_camino: "Antes tienes que terminar uno de los dos caminos.", aun_no_abierta: "El test todavía no está abierto." }[r && r.error] || "No se ha podido entregar. Revisa la conexión e inténtalo otra vez: tus respuestas están guardadas.";
        $("#resultado-cuerpo").innerHTML = '<div class="pregunta" style="text-align:center"><p>' + esc(msg) + '</p><div class="botonera centro"><button class="btn lleno" type="button" data-ir="entregar">Volver a intentarlo</button></div></div>';
        return;
      }
      st.est.entregado = true; st.est.nota = r.nota;
      fase("llega"); $("#correo-txt").textContent = "¡Corregido! Aquí llega tu nota…";
      return pedirEstado().then(function (e) { if (e && e.ok) { st.est = e; st.est.progreso = e.progreso || {}; } })
        .then(function () { return espera(950); })
        .then(function () { fase("llega abre"); return espera(700); })
        .then(function () { fase("llega abre sale"); return espera(1000); })
        .then(function () { resultado(true); });
    }).catch(function () {
      $("#resultado-cuerpo").innerHTML = '<div class="pregunta" style="text-align:center"><p>No se ha podido entregar. Revisa la conexión e inténtalo otra vez: tus respuestas están guardadas.</p><div class="botonera centro"><button class="btn lleno" type="button" data-ir="entregar">Volver a intentarlo</button></div></div>';
    });
  }
  function fmtNota(n) { return Number(n).toLocaleString("es-ES", { maximumFractionDigits: 2 }); }
  function resultado(animado) {
    var e = st.est, n = Number(e.nota || 0), cls = n >= 7 ? "v" : n >= 5 ? "a" : "r";
    var html = '<article class="hoja-nota' + (animado ? " entra" : "") + '"><p class="rotulo">Tu nota del test de Hamilton</p>' +
      '<div class="nota-final ' + cls + '" id="nota-num">' + (animado && !REDUCIDO ? "0" : fmtNota(n)) + "</div><p class=\"sub\">Cuenta como una ficha de teoría.</p>";
    if (e.soluciones && e.detalle) html += solucionesHTML(e);
    else html += '<p class="aviso">Las respuestas explicadas aparecerán aquí en cuanto se registre tu entrega. Recarga la página en un momento.</p>';
    html += '<audio id="r-au" preload="none"></audio></article>';
    $("#resultado-cuerpo").innerHTML = html;
    if (!$("#v-resultado").classList.contains("activa")) ver("v-resultado", "escritorio");
    else window.scrollTo(0, 0);
    if (animado && !REDUCIDO) {
      var el = $("#nota-num"), t0 = performance.now(), D = 1500;
      (function paso(t) {
        var x = Math.min(1, (t - t0) / D), y = 1 - Math.pow(1 - x, 3);
        el.textContent = fmtNota(Math.round(n * y * 100) / 100);
        if (x < 1) requestAnimationFrame(paso); else { el.textContent = fmtNota(n); el.classList.add("pum"); }
      })(t0);
    }
    var au = $("#r-au");
    $("#resultado-cuerpo").onclick = function (ev) {
      var b = ev.target.closest(".mini-play"); if (!b) return;
      if (!au.paused && au.dataset.src === b.dataset.src) { au.pause(); return; }
      document.querySelectorAll(".mini-play").forEach(function (x) { x.innerHTML = ICO.play; });
      au.dataset.src = b.dataset.src; au.src = u(b.dataset.src); intenta(au); b.innerHTML = ICO.stop;
      au.onended = au.onpause = function () { b.innerHTML = ICO.play; };
    };
    cargarMedia(rutasTest());
  }
  function solucionesHTML(e) {
    var ex = e.explicaciones || {};
    return '<h3 class="sol-tit">Tus respuestas, corregidas</h3><div class="sols">' + T.map(function (q) {
      var d = e.detalle[q.id] || {}, sol = e.soluciones[q.id], m = q.media || {}, h, ok;
      var medio = m.audio || m.video;
      if (q.tipo === "emparejar") {
        var resp = d.resp || {}; ok = (d.aciertos || 0) === (d.de || 5);
        h = '<div class="sol-figs">' + m.figuras.map(function (f, i) {
          var key = f.split("/").pop().split(".")[0], buena = sol && sol[key] ? sol[key] : "", tuya = (resp[key] || "").toLowerCase();
          return '<figure class="' + (tuya === buena ? "ok" : "ko") + '"><img alt="" src="' + esc(u(f)) + '"><figcaption>' + (i + 1) + " · " + esc(buena.charAt(0).toUpperCase() + buena.slice(1)) +
            (tuya && tuya !== buena ? '<small>pusiste ' + esc(tuya.charAt(0).toUpperCase() + tuya.slice(1)) + "</small>" : "") + "</figcaption></figure>";
        }).join("") + '</div><p class="sol-linea">Acertaste ' + (d.aciertos || 0) + " de " + (d.de || 5) + ".</p>";
      } else {
        ok = !!d.ok;
        var buena = (q.opciones || []).filter(function (x) { return x.id === sol; })[0], tuya = (q.opciones || []).filter(function (x) { return x.id === d.resp; })[0];
        h = ok ? '<p class="sol-bien">✓ ' + esc(buena ? buena.t : "") + "</p>"
               : '<p class="sol-mal">✗ ' + (tuya ? "Tu respuesta: " + esc(tuya.t) : "Sin contestar") + '</p><p class="sol-bien">✓ ' + esc(buena ? buena.t : "") + "</p>";
      }
      return '<div class="sol ' + (ok ? "ok" : "ko") + '"><div class="sol-cab"><span class="sol-n">' + q.n + "</span><b>" + esc(q.texto) + "</b>" +
        (medio ? '<button type="button" class="mini-play" data-src="' + esc(medio) + '" aria-label="Volver a escuchar">' + ICO.play + '</button>' : "") + "</div>" + h +
        (ex[q.id] ? '<p class="sol-ex">' + esc(ex[q.id]) + "</p>" : "") + "</div>";
    }).join("") + "</div>";
  }

  /* ── Música de ambiente ─────────────────────────── */
  // Portada: «Alexander Hamilton» (instrumental). Después se alternan «Who Lives, Who Dies…» y «Hurricane».
  // Vídeo de Jaime: se corta al empezar el vídeo. Exprés: de fondo, moderado-bajo; se retira con un fundido
  // cuando suena un clip y vuelve al acabar. Test: en silencio (hay preguntas de escuchar).
  // (22-oct, Iago desde el iPad) El volumen va por Web Audio (un «gain»): en el iPad el volumen de un <audio> no se puede
  // cambiar, y sin esto la música no bajaba al hablar. Bajo la voz, la música se queda muy por debajo.
  var M = { el: null, i: 0, nivel: "off", fade: null, listo: false, arrancada: false, vol: 0,
    pistas: ["expres/musica/m1-intro.mp3", "expres/musica/m2.mp3", "expres/musica/m3.mp3"],
    VOL: { portada: 0.8, fondo: 0.2, voz: 0.18, off: 0 }, silencio: !!ls.get("ham_musica_off", false), voz: false,
    t0: 0, tPlay: 0, alSonar: null, ctx: null, gain: null };
  function ponVol(v) { M.vol = v; if (M.gain) M.gain.gain.value = v; else if (M.el) M.el.volume = v; }
  function fundir(v, ms) {
    if (!M.el || !M.arrancada) return;
    clearInterval(M.fade);
    if (v > 0 && M.el.paused) { var pr = M.el.play(); if (pr && pr.catch) pr.catch(function () {}); }
    var desde = M.vol, t0 = Date.now();
    M.fade = setInterval(function () {
      var x = Math.min(1, (Date.now() - t0) / ms);
      ponVol(Math.max(0, Math.min(1, desde + (v - desde) * x)));
      if (x >= 1) { clearInterval(M.fade); if (v === 0) M.el.pause(); }
    }, 30);
  }
  function suenaAlgo() { return [].some.call(document.querySelectorAll("video,audio"), function (m) { return !m.paused && !m.ended; }); }
  function musica(nivel) {
    M.nivel = nivel;
    if (!M.el || !M.arrancada) return;
    var v = M.silencio ? 0 : (M.VOL[nivel] || 0);
    if (v > 0 && suenaAlgo()) v = 0;
    if (v > 0 && M.voz) v = Math.min(v, M.VOL.voz);     // mientras habla Iago, la música muy por debajo
    fundir(v, M.voz ? 600 : (v > 0 ? 2500 : 1000));
  }
  function musicaVista(id) {
    var n = { "v-portada": "portada", "v-video": "portada", "v-expres": "off", "v-fin": "fondo", "v-test-intro": "fondo", "v-resultado": "fondo" }[id] || "off";
    musica(n);
  }
  // Se prepara (y empieza a descargarse) antes del telón; solo suena al pulsar «Que se abra el telón»
  function preparaMusica() {
    if (M.el) return M.el;
    M.el = new Audio(); M.el.preload = "auto"; M.el.crossOrigin = "anonymous";
    M.el.addEventListener("ended", function () {
      M.i = M.i === 1 ? 2 : 1; M.el.src = u(M.pistas[M.i]);
      if (!M.silencio && M.nivel !== "off") { var pr = M.el.play(); if (pr && pr.catch) pr.catch(function () {}); }
    });
    M.el.addEventListener("playing", function () {
      if (M.tPlay) return; M.tPlay = Date.now();
      var f = M.alSonar; M.alSonar = null; if (f) f();
    });
    M.i = 0; M.el.src = u(M.pistas[0]); try { M.el.load(); } catch (e) {}
    return M.el;
  }
  function arrancaMusica() {
    if (M.arrancada) return; M.arrancada = true;
    preparaMusica();
    try {                                                  // dentro del gesto del alumno
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC && !M.ctx) {
        M.ctx = new AC(); M.gain = M.ctx.createGain(); M.gain.gain.value = 0;
        M.ctx.createMediaElementSource(M.el).connect(M.gain); M.gain.connect(M.ctx.destination); M.el.volume = 1;
      }
      if (M.ctx && M.ctx.state === "suspended") M.ctx.resume();
    } catch (e) { M.ctx = null; M.gain = null; }
    ponVol(0);
    var pr = M.el.play(); if (pr && pr.catch) pr.catch(function () {});
    M.t0 = Date.now();
    if (M.nivel === "portada" && !M.silencio) fundir(M.VOL.portada, 250);   // la entrada, con toda su fuerza
    else musica(M.nivel);
  }
  // Cuando suena un clip o un audio de la página, la música se retira; al acabar, vuelve.
  document.addEventListener("play", function (ev) {
    var t = ev.target; if (!M.el || t === M.el || !/^(VIDEO|AUDIO)$/.test(t.tagName)) return;
    fundir(0, 1000);
  }, true);
  ["pause", "ended"].forEach(function (tipo) {
    document.addEventListener(tipo, function (ev) {
      var t = ev.target; if (!M.el || t === M.el || !/^(VIDEO|AUDIO)$/.test(t.tagName)) return;
      setTimeout(function () { if (!suenaAlgo()) musica(M.nivel); }, 500);
    }, true);
  });
  function botonMusica() {
    var b = $("#musica-btn"); if (!b) return;
    b.classList.toggle("off", M.silencio);
    b.title = M.silencio ? "Activar la música" : "Silenciar la música"; b.setAttribute("aria-label", b.title);
    b.onclick = function () { M.silencio = !M.silencio; ls.set("ham_musica_off", M.silencio); botonMusica(); musica(M.nivel); };
  }
  // Telón con barra de carga: avanza mientras se comprueba la cuenta, se firman los enlaces y se descargan la música
  // y la voz; cuando está todo, aparece «Que se abra el telón».
  var CARGA = { obj: 0, vis: 0, tick: null };
  function carga(obj) {
    CARGA.obj = Math.max(CARGA.obj, obj);
    if (CARGA.tick) return;
    CARGA.tick = setInterval(function () {
      var hueco = CARGA.obj - CARGA.vis;
      CARGA.vis += hueco > 0 ? Math.max(0.15, hueco * 0.07) : 0;
      if (CARGA.vis > CARGA.obj) CARGA.vis = CARGA.obj;
      var b = $("#carga-b"); if (b) b.style.width = CARGA.vis.toFixed(1) + "%";
      var c = $("#carga"); if (c) c.setAttribute("aria-valuenow", Math.round(CARGA.vis));
      if (CARGA.vis >= 100) { clearInterval(CARGA.tick); CARGA.tick = null; }
    }, 40);
  }
  function abrirTelon() {
    var t = $("#telon"), e = $("#entrar");
    t.hidden = false; e.hidden = true; carga(45);
    cargarMedia(M.pistas).then(function () {
      carga(60);
      var m = preparaMusica(), v = CARTA.pendiente ? cartaPrecarga() : null, t0 = Date.now();
      var lista = function (x) { return !x || x.readyState >= 4; };
      var parte = function (x) { if (!x) return 1; if (x.readyState >= 4) return 1; try { if (x.duration && x.buffered.length) return Math.min(1, x.buffered.end(x.buffered.length - 1) / Math.min(x.duration, 30)); } catch (er) {} return 0; };
      var mira = setInterval(function () {
        var p = (parte(m) + parte(v)) / 2, dt = Date.now() - t0;
        carga(60 + 38 * p);
        var nada = dt > 1500 && m.readyState === 0 && (!v || v.readyState === 0);   // iPad: no descarga hasta pulsar
        if ((lista(m) && lista(v)) || nada || dt > 8000) { clearInterval(mira); listo(); }
      }, 120);
    });
    function listo() {
      carga(100);
      setTimeout(function () { $("#carga").classList.add("hecha"); e.hidden = false; $("#telon-aviso").hidden = false; e.focus(); }, 500);
    }
    e.onclick = function () {
      arrancaMusica();
      t.classList.add("abre"); setTimeout(function () { t.hidden = true; }, 900);
      if (CARTA.pendiente && $("#v-portada").classList.contains("activa")) cartaVoz();
    };
  }



  /* ── La carta de Iago: su voz lee la introducción y en la tarjeta va saliendo, en grande, el párrafo que dice ── */
  // Primera vez (y hasta que la escuche entera): tras los ~4 s intensos del principio de «Alexander Hamilton», la música
  // baja mucho y entra la voz. Un párrafo cada vez, que se funde con el siguiente; abajo, una línea con lo que lleva.
  // Al decir «No desperdicies tu oportunidad», la música vuelve a subir y aparece «Continuar»: lleva a los dos caminos.
  // Las veces siguientes se va directo a los caminos.
  var CARTA = { voz: "voz-intro-v5.mp3", entra: 3.8, audio: null,   // la voz de Iago va con el portal (no es material de terceros)
    cues: [0.0,  15.05,  27.49,  38.51,  53.94,  65.6,  80.55,  91.22,  101.62,  106.12], fin: 108.9,
    el: null, t: null, ult: -1, pendiente: false, subida: false };
  function cartaPrecarga() {
    if (!CARTA.audio) { CARTA.audio = new Audio(); CARTA.audio.preload = "auto"; CARTA.audio.src = CARTA.voz; try { CARTA.audio.load(); } catch (e) {} }
    return CARTA.audio;
  }
  // Todos los párrafos con la MISMA letra: la más grande con la que cabe el más largo (los cortos, centrados)
  function ajustaCarta() {
    var papel = $("#misiva-papel"); if (!papel || !papel.clientHeight) return;
    var alto = papel.clientHeight - 110, ps = [].slice.call(document.querySelectorAll(".mis-p")), fs = 46;
    var cabe = function () { return ps.every(function (p) { return p.offsetHeight <= alto; }); };
    papel.style.setProperty("--fs", fs + "px");
    while (fs > 17 && !cabe()) { fs -= 1; papel.style.setProperty("--fs", fs + "px"); }
  }
  window.addEventListener("resize", function () { clearTimeout(CARTA.rz); CARTA.rz = setTimeout(ajustaCarta, 150); });
  function portadaFase(f) {
    var por = $("#v-portada"); por.classList.toggle("fase-carta", f === "carta"); por.classList.toggle("fase-caminos", f === "caminos");
    $("#portada-h").textContent = f === "carta" ? "Antes de empezar" : "Elige tu camino";
    if (f === "carta") requestAnimationFrame(ajustaCarta);
  }
  function cartaMuestra(i) {
    var ps = [].slice.call(document.querySelectorAll(".mis-p")), firma = $(".mis-firma");
    ps.forEach(function (p, j) { p.classList.toggle("actual", j === i); });
    firma.classList.toggle("ya", i === ps.length - 1);
  }
  function cartaPrepara(leido) {
    var mis = $("#misiva"); if (!mis) return;
    $("#mis-sigue").onclick = function () { cartaPara(); portadaFase("caminos"); window.scrollTo(0, 0); };
    $("#mis-pausa").onclick = function () {
      var a = CARTA.el; if (!a) return;
      if (a.paused) { var pr = a.play(); if (pr && pr.catch) pr.catch(function () {}); this.classList.remove("pausado"); this.title = "Pausa"; this.setAttribute("aria-label", "Pausa"); $("#mis-estado").textContent = ""; }
      else { a.pause(); this.classList.add("pausado"); this.title = "Seguir"; this.setAttribute("aria-label", "Seguir"); }
    };
    if (leido) { CARTA.pendiente = false; portadaFase("caminos"); return; }
    portadaFase("carta");
    if (CARTA.el && !CARTA.el.paused) return;                  // ya está sonando
    mis.classList.remove("leida"); mis.classList.add("espera");
    cartaMuestra(-1);
    $("#mis-sigue").hidden = true; $("#mis-estado").textContent = "";
    CARTA.pendiente = true;
    if (M.el && $("#telon").hidden) cartaVoz();                // el telón ya estaba abierto: empieza ya
  }
  function cartaVoz() {
    CARTA.pendiente = false; clearTimeout(CARTA.t);
    if (CARTA.el) { try { CARTA.el.pause(); } catch (e) {} }
    var a = CARTA.el = cartaPrecarga(), mis = $("#misiva");
    try { a.currentTime = 0; } catch (e) {}
    a.preload = "auto"; CARTA.ult = -1; CARTA.subida = false;
    mis.classList.remove("espera"); mis.classList.add("leyendo");
    cartaMuestra(-1); ajustaCarta();
    $("#mis-sigue").hidden = true; $("#mis-pausa").hidden = false; $("#mis-pausa").classList.remove("pausado"); $("#mis-prog").hidden = false;
    var marca = function (i) {
      if (i === CARTA.ult) return; CARTA.ult = i;
      cartaMuestra(i);
      var p = document.querySelectorAll(".mis-p")[i];
      if (p && p.dataset.plazo) { var pg = $("#plazo-grande"); pg.classList.remove("pulso"); void pg.offsetWidth; pg.classList.add("pulso"); }
    };
    var termina = function () {
      if (CARTA.subida) return; CARTA.subida = true;
      M.voz = false; musica(M.nivel);                          // «No desperdicies tu oportunidad»: sube la música
      ls.set(k("intro_leida"), true);
      cartaMuestra(CARTA.cues.length - 1); $("#mis-prog-b").style.width = "100%";
      mis.classList.remove("leyendo"); mis.classList.add("leida");
      $("#mis-pausa").hidden = true; $("#mis-estado").textContent = ""; $("#mis-sigue").hidden = false;
    };
    // cada párrafo entra justo cuando Iago empieza a decirlo (se mira en cada fotograma, no 4 veces por segundo)
    a.ontimeupdate = function () {
      if (a.paused && !a.ended) return;                        // la tarjeta sigue vacía hasta que Iago empieza a hablar
      var t = a.currentTime, i = -1; $("#mis-prog-b").style.width = Math.min(100, 100 * t / CARTA.fin) + "%";
      for (var j = 0; j < CARTA.cues.length; j++) if (t >= CARTA.cues[j] - 0.15) i = j;
      if (i >= 0) marca(i);
      if (t >= CARTA.fin) termina();
    };
    var sigue = function () { if (CARTA.el !== a || CARTA.subida) return; if (!a.paused) a.ontimeupdate(); requestAnimationFrame(sigue); };
    a.onplaying = function () { requestAnimationFrame(sigue); };
    a.onended = termina;
    a.onerror = function () { termina(); };                   // si la voz no carga, que nada se bloquee
    // primero baja la música (los chasquidos ya no tapan) y medio segundo después entra la voz
    var empieza = function () {
      M.voz = true; musica(M.nivel);
      CARTA.t = setTimeout(function () {
        var pr = a.play();
        if (pr && pr.catch) pr.catch(function () { M.voz = false; musica(M.nivel); $("#mis-pausa").classList.add("pausado"); $("#mis-estado").textContent = "Pulsa el sello para escuchar la carta"; });
      }, 550);
    };
    var cuenta = function () {                               // desde que la música suena de verdad
      var desde = M.tPlay || Date.now();
      CARTA.t = setTimeout(empieza, Math.max(0, (CARTA.entra - 0.55) * 1000 - (Date.now() - desde)));
    };
    if (M.silencio || !M.arrancada) CARTA.t = setTimeout(empieza, 300);
    else if (M.tPlay) cuenta();
    else { M.alSonar = cuenta; CARTA.t = setTimeout(function () { if (M.alSonar) { M.alSonar = null; empieza(); } }, 8000); }
  }
  function cartaPara() { clearTimeout(CARTA.t); if (CARTA.el) { try { CARTA.el.pause(); } catch (e) {} } if (M.voz) { M.voz = false; musica(M.nivel); } }

  /* Solo cuentas de prueba (Protester…): botón para empezar Hamilton de cero. Pulsar dos veces. */
  function botonReiniciar() {
    var b = $("#reiniciar-btn"); if (!b) return;
    b.hidden = !(st.est && st.est.tester) || st.previa;
    var listo = false, t = null;
    b.onclick = function () {
      if (!listo) { listo = true; b.classList.add("confirma"); aviso("Pulsa otra vez para borrar tu avance de Hamilton y empezar de cero."); t = setTimeout(function () { listo = false; b.classList.remove("confirma"); }, 4000); return; }
      clearTimeout(t); b.disabled = true; pantallaCarga("Reiniciando");
      rpc("suite_hamilton_reiniciar", { p_cuenta_id: st.cuenta }).then(function (r) {
        if (!r || !r.ok) { cargaFin(); b.disabled = false; aviso("No se ha podido reiniciar."); return; }
        try { Object.keys(localStorage).forEach(function (x) { if (x.indexOf(k("")) === 0) localStorage.removeItem(x); }); } catch (e) {}
        location.reload();
      }).catch(function () { cargaFin(); b.disabled = false; aviso("No se ha podido reiniciar. Revisa la conexión."); });
    };
  }

  /* Elegir camino: una sola vez y para siempre */
  function abrirCamino() { if (st.est.camino === "video") caminoVideo(); else if (st.est.camino === "expres") caminoExpres(); else portada(); }
  function elegirCamino(c, btn) {
    if (st.est.camino) return abrirCamino();
    var pie = btn.closest(".pie"); if (!pie) return;
    pie.dataset.orig = pie.innerHTML;
    pie.innerHTML = '<span class="aviso">Una vez elegido, no se puede cambiar.</span><span class="botonera"><button class="btn" type="button" data-cancela="1">No</button><button class="btn lleno" type="button" data-elige="' + c + '">Sí, este camino</button></span>';
  }
  document.addEventListener("click", function (ev) {
    var ca = ev.target.closest("[data-cancela]");
    if (ca) { var pie = ca.closest(".pie"); if (pie && pie.dataset.orig) pie.innerHTML = pie.dataset.orig; return; }
    var el = ev.target.closest("[data-elige]"); if (!el) return;
    el.disabled = true; var c = el.dataset.elige;
    pantallaCarga(c === "video" ? "Preparando el vídeo" : "Preparando el exprés");
    guardar(c, { elegido: c }, false).then(function (r) { if (r && r.ok) { st.est.camino = st.est.camino || c; abrirCamino(); } else { el.disabled = false; cargaFin(); } });
  });

  /* ── Arranque ───────────────────────────────────── */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-ir]"); if (!b) return;
    var d = b.dataset.ir;
    if (d === "portada") portada();
    if (d === "video" || d === "expres") elegirCamino(d, b);
    if (d === "camino") abrirCamino();
    if (d === "test-intro") testIntro();
    if (d === "test") empiezaTest();
    if (d === "resultado") resultado(false);
    if (d === "fin") finCamino();
    if (d === "entregar") entregar();
  });
  document.addEventListener("click", function (ev) { var a = ev.target.closest("[data-parte]"); if (a && !a.disabled) { X.i = primerPaso(+a.dataset.parte); guardaExpres(false); pintaPaso(false); } });

  function arranca() {
    try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustaCarta); } catch (e) {}
    st.cuenta = leerCuenta();
    st.previa = !st.cuenta && !/lmathome\.es$/.test(location.hostname);
    if (st.previa) {
      window.__hamMusica = M; window.__hamCarta = function () { return CARTA.el; };   // solo vista previa: para comprobar música y carta
      $("#banda-previa").hidden = false;
      $("#reiniciar-previa").onclick = function () { try { Object.keys(localStorage).forEach(function (x) { if (x.indexOf("ham_") === 0) localStorage.removeItem(x); }); } catch (e) {} location.reload(); };
    }
    var sinTelon = function () { $("#telon").hidden = true; };
    carga(30);
    if (!st.cuenta && !st.previa) {
      sinTelon();
      $("#cerrado-txt").innerHTML = "Entra desde tu portal de <b>LM at home</b>, pulsando la medalla de Hamilton.";
      return ver("v-cerrado");
    }
    pedirEstado().then(function (e) {
      if (!e || !e.ok || !e.abierta || (e.cerrada && !e.entregado)) sinTelon();
      if (!e || !e.ok) { $("#cerrado-txt").textContent = "No he podido comprobar tu cuenta. Entra de nuevo desde tu portal de LM at home."; return ver("v-cerrado"); }
      st.est = e; st.est.progreso = e.progreso || {};
      $("#plazo").textContent = "Plazo: hasta el " + fecha(e.cierra_en);
      if (!e.abierta) { $("#cerrado-txt").innerHTML = "Hamilton se abre el <b>" + esc(fecha(e.abre_en)) + "</b>."; return ver("v-cerrado"); }
      if (e.cerrada && !e.entregado) { $("#cerrado-txt").innerHTML = "El plazo terminó el <b>" + esc(fecha(e.cierra_en)) + "</b>."; return ver("v-cerrado"); }
      botonMusica(); botonReiniciar(); abrirTelon();
      if (e.entregado) return resultado(false);
      if (e.completado) return finCamino();
      if (e.camino) return abrirCamino();
      portada();
    }).catch(function () { sinTelon(); $("#cerrado-txt").textContent = "No hay conexión con el servidor. Comprueba Internet y recarga la página."; ver("v-cerrado"); });
    if (window.matchMedia("(max-width: 600px) and (pointer: coarse)").matches) aviso("Optimizado para ordenador y tablet.");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arranca); else arranca();
})();
