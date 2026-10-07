/* =========================================================================
   LM at home · COLOCADOR AUTOMÁTICO DE FOTOS DE DICTADOS   (coloca-foto.js)
   7-oct-2026 · Iago: «no tienes forma de mejorar en la app corrección
   dictados profesional de presentarme mejor las fotos de los alumnos? Casi
   nunca me aparece bien colocada y tengo que andar rotando y ampliando. No
   tienes técnicas de predicción mejor? Como coger de referencias claves de
   sol que estén pintadas, por ejemplo?»

   QUÉ HACE
   Mira una foto de un dictado musical (pentagramas escritos a mano,
   fotografiados con el móvil) y dice cómo hay que GIRARLA, ENDEREZARLA y
   ENCUADRARLA para verla bien. Visión por computador clásica, sin redes
   neuronales, sin dependencias, sin red: todo ocurre en el navegador.

   API
     LMColoca.analiza(pixeles, ancho, alto, opciones?)      -> resultado (síncrono)
         pixeles: Uint8ClampedArray RGBA (lo que da getImageData), ya reducido
         (lo ideal: ~1024 px de lado mayor; con 512 también funciona).
     LMColoca.analizaImagen(img|canvas|bitmap|blob, opciones?) -> Promise<resultado>
         reduce la imagen con un canvas y llama a la anterior. Nunca rechaza:
         si algo falla devuelve { ok:false, motivo }.
     LMColoca.pinta(canvasDestino, fuente, resultado, opciones?)
         dibuja la foto ya girada, enderezada y recortada a la caja.
     LMColoca.decide(resultado, opciones?)  -> { giro, inclinacion, caja, seguro, motivo }
         la política recomendada: qué aplicar y qué no según las confianzas.
     LMColoca.esquinasCaja(resultado, W, H) -> las 4 esquinas de la caja en la foto original.
     LMColoca.matriz(resultado, W, H) -> matriz (como la de CSS/canvas) foto original -> foto colocada.
     LMColoca.libera()  -> suelta la memoria que se guarda entre foto y foto.
     LMColoca.CFG   -> todos los umbrales y pesos, documentados, para calibrar.

   RESULTADO
     { ok, giro: 0|90|180|270      giro HORARIO que hay que aplicar a la foto,
       inclinacion: grados         giro horario fino que hay que AÑADIR al anterior
                                   (rotate(giro + inclinacion) deja la música derecha),
       caja: {x,y,w,h}             0..1 en la foto YA girada y enderezada (marco =
                                   el de la foto girada 'giro', mismo centro),
       confianza: { lineas, arriba, caja }   0..1 cada una,
       pistas: {...}               lo que midió cada pista (para depurar/calibrar),
       ms }
   Quien lo use debe dejar la foto como está si la confianza es baja: es mucho
   peor girar mal una foto que estaba bien que no tocarla.

   CÓMO DECIDE (resumen; el detalle está en INFORME.md)
     Fase 1 (a ~384 px): tinta = «sombrero de copa negro» (quita luz desigual y
       sombras) -> transformada de Radon -> direcciones candidatas de líneas ->
       zona de la foto donde hay pentagramas.
     Fase 2 (zona enderezada, a más resolución): perfiles por tiras -> separación
       entre líneas -> peine de 5 líneas -> pentagramas (trayectoria, extremos) ->
       tinta manuscrita de cada pentagrama (se restan las líneas impresas).
     Arriba/abajo: varias pistas con pesos (regresión logística) -> probabilidad:
       clave de sol al principio, tinta al principio/final, hueco al final del último
       sistema, pentagramas vacíos por debajo, título por encima, clave alta arriba.
     Caja: pentagramas con música + margen.

   IMPORTANTE AL INTEGRARLO
     · Pásale a analizaImagen el MISMO <img> que se enseña (así ve la foto con la
       orientación EXIF ya aplicada por el navegador, igual que el usuario).
     · El resultado se puede guardar por foto: es determinista.
   ========================================================================= */
(function (raiz, fabrica) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.LMColoca = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* =======================================================================
     CFG · TODOS LOS UMBRALES Y PESOS (se pueden cambiar desde la consola:
     LMColoca.CFG.xxx = valor). Las longitudes van en píxeles de la escala
     indicada o, casi siempre, en unidades de «d» = separación entre dos
     líneas del pentagrama, para que no dependan del tamaño de la foto.
     ======================================================================= */
  var CFG = {
    /* ---- tamaños de trabajo ---- */
    ladoEntrada: 1024,     // analizaImagen reduce la foto a este lado mayor (px)
    ladoTrabajo: 384,      // la fase 1 (dirección y zona) trabaja a este lado mayor
    maxPixFase2: 300000,   // presupuesto de píxeles de la zona enderezada (fase 2)
    maxPixSegunda: 800000, // presupuesto de la «segunda oportunidad» (solo si no se encontró nada; 0 = no usarla)
    dCanon: 6.0,           // separación entre líneas que se busca tener en la fase 2 (px)
    repiteGrande: 1.6,     // si d sale mayor que esto × dCanon, la fase 2 se repite reducida
    repitePequeno: 4.6,    // si d sale menor que esto (px) y la zona se puede apretar, se repite más de cerca

    /* ---- tinta (normalización de la luz) ---- */
    mezclaMin: 0.5,        // 0 = luminancia; 1 = canal mínimo (resalta el boli azul/rojo)
    ventanaTinta1: 7,      // ventana (px, impar) del cierre morfológico en la fase 1
    ventanaTintaD: 1.7,    // en la fase 2 la ventana es este factor × d ...
    ventanaTintaMin: 7,    // ... acotada entre estos dos valores (px, impares)
    ventanaTintaMax: 15,
    sigmasRuido: 2.2,      // sigmas de ruido que se restan a la tinta (quita el grano)
    pisoFondo: 24,         // el fondo no baja de este nivel al normalizar (evita ÷ casi 0)
    topeTinta1: 3.0,       // en la fase 1 la tinta se recorta a esto × su mediana (que el boli no tape las líneas flojas)
    umbralPolaridad: 0.07, // > esto: los trazos son CLAROS sobre fondo oscuro (pizarra verde)
    polaridadDuda: [-0.12, 0.25], // entre estos valores el índice no es de fiar: se prueban las dos polaridades
    polaridadCoherencia: 0.5,     // (fuera - líneas)/(espacios - líneas) mínimo para dar por buena la polaridad (≈1 buena, ≈0 negativo)

    /* ---- fase 1: dirección de las líneas (Radon) ---- */
    radonPasoGrueso: 2.0,  // paso angular de la búsqueda gruesa (grados)
    radonPasoFino: 0.4,    // paso de la búsqueda fina (grados) ...
    radonAbanicoFino: 3.2, // ... en ± estos grados alrededor de cada candidata
    radonCandidatas: 3,    // nº máximo de direcciones candidatas que se examinan
    radonSeparacion: 9.0,  // separación mínima entre candidatas (grados)
    radonAlisado: 5,       // radio (bins) del paso-alto del perfil de proyección
    radonBasta: 0.45,      // si la 1ª candidata da confianza de líneas ≥ esto, no se prueban más

    /* ---- fase 1: zona con pentagramas ---- */
    celda: 24,             // tamaño de celda (px a escala de trabajo, múltiplo de 4) para localizar la zona
    celdaUmbral: 0.10,     // una celda «tiene líneas» (fuerte) si su energía ≥ esto × energía de referencia
    celdaDebil: 0.015,     // ... y la zona crece hacia arriba/abajo por filas de celdas con energía ≥ esto × la referencia ...
    celdaFilaMin: 0.5,     // ... si al menos esta fracción de las celdas de la fila (a lo ancho de la zona) lo cumple
    celdaGrupoMin: 0.04,   // un grupo suelto de celdas entra en la zona si pesa al menos esto × el grupo mayor
    zonaBrilloMin: 0.35,   // una celda solo cuenta si su fondo es al menos esto × el fondo más claro de la foto (papel)
    zonaMargen: 0.05,      // margen que se añade alrededor de la zona (fracción de su tamaño)
    zonaMargenMin: 10,     // ... y mínimo en px a escala de trabajo
    zonaAbanico: 9.0,      // el ángulo se afina con la tinta de la zona en ± estos grados (0 = no afinar) ...
    zonaAbanicoPaso: 1.0,  // ... con este paso grueso (después, fino con radonPasoFino)

    /* ---- fase 2: pentagramas ---- */
    dMin: 2.2,             // separación mínima entre líneas detectable (px de la fase 2)
    dMax: 34,              // separación máxima
    tiraAncho: 24,         // ancho (px de la fase 2) de las tiras verticales donde se buscan las cinco líneas
    tiraPercentil: 0.40,   // percentil de la tinta de cada fila dentro de la tira (robusto a notas y plicas)
    peinePesoMin: 0.75,    // peso de la línea MÁS FLOJA de las cinco (1 = solo cuenta la peor; 0 = la media)
    peineCalidadMin: 0.30, // calidad mínima del peine (0..1) para aceptar un pentagrama en una tira
    peineRelMin: 0.15,     // respuesta mínima relativa a la respuesta típica de la foto
    peineFlanco: 1.0,      // penalización si hay una 6ª línea al lado (papel rayado, no pentagrama)
    barridoSiMenos: 1.0,   // si la mejor d por autocorrelación da menos candidatos que esto × nº de tiras, se barre d con el peine
    curvaturaMaxD: 3.0,    // flecha máxima (en d) de la trayectoria de un pentagrama a lo largo de su tramo
    pendienteMax: 0.10,    // diferencia máxima entre la pendiente de un pentagrama y la general de la zona (rad)
    sextaLineaFrac: 0.6,   // si en más de esta fracción del largo hay una 6ª línea a un lado, no es un pentagrama (papel rayado)
    perspectivaMin: 0.012, // cambio mínimo del modelo (pendiente en rad + d relativa) para repetir la detección con perspectiva
    enlaceTol: 0.45,       // tolerancia vertical al enlazar tiras vecinas (en d)
    enlaceHuecos: 2,       // tiras seguidas sin pentagrama que se pueden saltar
    pentMinTiras: 3,       // nº mínimo de tiras para aceptar un pentagrama
    pentMinLargoD: 14,     // largo mínimo de un pentagrama (en d)
    cizallaMax: 0.08,      // pendiente residual máxima que se busca en la zona (≈ ±4,6°) ...
    cizallaPaso: 0.005,    // ... con este paso
    cizallaMitades: true,  // medirla por separado arriba y abajo (perspectiva: las líneas convergen)
    presenciaVentanaD: 4,  // ventana (en d) con la que se comprueba que las cinco líneas siguen
    presenciaPercentil: 0.40, // dentro de la ventana, percentil de la tinta de cada fila de línea
    presenciaUmbral: 0.38, // las líneas «siguen» si ese percentil ≥ esto × su valor típico
    presenciaEspacio: 0.70,// ... y los espacios no están tan llenos como las líneas (si no, es una textura)
    presenciaPuenteD: 4,   // hueco máximo (en d) sin líneas que se salta (un objeto encima) ...
    presenciaReanudaD: 5,  // ... siempre que después las líneas sigan al menos este tramo (en d)
    cortadoD: 2.0,         // un extremo a menos de esto (en d) del borde de la foto se da por cortado
    cortadoLejosD: 12.0,   // ... y también si el borde está a menos de esto y las líneas siguen hasta él (tapadas por algo)
    margenTolD: 1.5,       // tolerancia (en d) al alinear los extremos con el margen común de la hoja

    /* ---- tinta manuscrita de cada pentagrama ---- */
    lineaVentanaD: 10,     // ventana (en d) de la mediana deslizante que estima la línea impresa
    lineaFactor: 1.15,     // la línea impresa se resta multiplicada por esto (margen)
    lineaLargoMaxD: 6,     // un resto horizontal más largo que esto (en d) en una misma fila se borra: es línea, no nota
    tintaSuelo: 0.012,     // tinta mínima para contar como trazo
    zonaAltoD: 5.0,        // altura (en d) por encima/debajo de la 3ª línea que se mira (5 = 3 d fuera del pentagrama)
    columnaAbs: 0.20,      // masa mínima de una columna (suma de tinta en d/4 de ancho) para contar como tinta
    columnaUmbral: 0.30,   // ... y ≥ esto × la masa típica de las columnas con tinta de la foto
    escritoMinD: 12,       // un pentagrama está ESCRITO si tiene tinta en al menos estos tramos de 1 d ...
    escritoRel: 0.30,      // ... y al menos esta fracción de los del pentagrama más escrito
    escritoDensRel: 0.25,  // ... y con una densidad de tinta de al menos esta fracción de la del más escrito
    escritoVecinoD: 6,     // ... o al menos estos tramos si el pentagrama de al lado está escrito (voz con pocas notas)
    sueloGrano: 1.6,       // el suelo de tinta sube a esto × el grano medido en los espacios (papel rugoso, JPEG)
    sostenidoD: 7,         // ventana (en d) para decidir dónde empieza y acaba lo escrito ...
    sostenidoMin: 0.28,    // ... fracción mínima de tramos con tinta dentro de esa ventana

    /* ---- pistas de arriba/abajo ---- */
    extremoD: 5.0,         // ventana (en d) al principio/final del pentagrama donde se busca la clave
    extremoFueraD: 1.0,    // y hacia fuera del pentagrama (llave, corchete)
    extremoTope: 2.5,      // tope de masa por columna (en masas típicas): un borrón no manda
    extremoPiso: 0.6,      // suaviza la pista del extremo cuando hay poca tinta (en masas típicas)
    claveAnchoD: 1.5,      // ancho (en d) de la ventana donde se busca el trazo de una clave de sol ...
    claveHastaD: 6.0,      // ... dentro de los primeros/últimos tantos d del pentagrama
    claveMasa: 0.35,       // tinta mínima en CADA zona (encima, los 4 espacios, debajo), en masas típicas de columna, para clave segura
    claveLejos: 0.6,       // si a más de 2 d del pentagrama hay más tinta que esto × lo anterior, no es clave: es la llave o la barra del sistema
    clavePanzaD: 1.4,      // ancho mínimo (en d) de la tinta en los dos espacios de abajo (la espiral de la clave)
    claveMin: 0.5,         // puntuación de clave (0..1) por debajo de la cual un pentagrama no opina
    clavePiso: 0.6,        // suaviza la pista de la clave cuando solo la apoya un pentagrama
    huecoMinD: 3.0,        // diferencia mínima (en d) entre el hueco del final y el del principio para que cuente (menos es maquetación)
    huecoD: 10.0,          // escala (en d) de la pista del hueco final (por pentagrama)
    huecoGanancia: 1.5,    // ganancia al sumar los huecos de todos los pentagramas escritos
    tituloPapel: 0.8,      // la franja del título solo cuenta donde el gris es al menos esto × el del papel del pentagrama
    tituloLleno: 0.30,     // ... y si tiene tinta en más de esta fracción de su superficie no es un título (es la mesa)
    tituloDesdeD: 3.5,     // la franja de «título» va de aquí ...
    tituloHastaD: 10.0,    // ... hasta aquí (en d) por fuera del primer/último pentagrama escrito
    /* pesos de la regresión logística (positivo = la foto enderezada está «de pie»).
       AJUSTADOS con los conjuntos sintéticos de desarrollo (dev + lleno, 760 fotos; eval/calibra.js):
       hay que recalibrarlos con fotos reales (eval/calibra.js, o el botón «Calibrar pesos» de demo.html).
       «perspectiva» se mide pero no pesa: de qué lado se inclina el móvil no dice dónde es arriba. */
    pesos: { clave: 3.0, extremo: 2.0, alto: 1.1, hueco: 3.1, vacios: 2.8, titulo: 0.7, pareja: 1.5, perspectiva: 0.0 },
    previo: { 0: 0, 90: 0, 180: 0, 270: 0 },   // log-odds a priori de cada giro (0 = sin preferencia)

    /* ---- confianzas ---- */
    dConfianzaPlena: 3.2,  // con d (px de la fase 2) ≥ esto la evidencia de arriba/abajo cuenta entera ...
    dConfianzaCero: 2.3,   // ... y se va descontando hasta casi nada con d ≤ esto (no se distingue la escritura)
    calidadCero: 0.55,     // calidad del peine por debajo de la cual un pentagrama no cuenta para la confianza de líneas ...
    calidadPlena: 0.75,    // ... y a partir de la cual cuenta entero
    confLineasEscala: 45,  // «largo útil» (en d, ponderado por calidad) que da confianza media de líneas
    inclinacionMax: 15,    // por encima de esta inclinación residual (grados) la confianza baja
    cajaMargenD: 2.0,      // margen de la caja alrededor de lo escrito (en d) ...
    cajaMargenRel: 0.02,   // ... más esta fracción del tamaño de la caja
    cajaArribaD: 3.2,      // alto mínimo (en d) que se deja sobre la 1ª línea y bajo la 5ª

    /* ---- política recomendada (LMColoca.decide) ---- */
    umbralSeguro: 0.9,     // confianza mínima (líneas y arriba) para aplicar giro + enderezado + caja
    umbralLineas: 0.9,     // confianza mínima de líneas para fiarse de «la foto está tumbada» (con 0,6 se estropeaban 4 de 328 fotos buenas en validación)
    umbralCaja: 0.5,       // confianza mínima de la caja para encuadrar

    tiempoMaxMs: 0,        // (0 = sin límite) si se supera, no se prueba la polaridad contraria (OJO: deja de ser determinista)

    /* ---- memoria y velocidad ---- */
    cierreMitad: true,     // el cierre morfológico de la tinta se hace a media resolución (4 veces menos trabajo, mismo fondo)
    banco: true,           // reutilizar las matrices grandes de una foto a otra (false = pedirlas nuevas cada vez; solo para depurar)
    bancoMaxMB: 32         // memoria máxima que el banco guarda entre fotos (LMColoca.libera() la suelta)
  };

  var VERSION = '1.0 (7-oct-2026)';
  var PI = Math.PI;
  var ahora = (typeof performance !== 'undefined' && performance.now) ?
    function () { return performance.now(); } : function () { return Date.now(); };

  /* =======================================================================
     UTILIDADES DE IMAGEN
     ======================================================================= */

  /** Memoria temporal reutilizable entre llamadas (evita pedir y soltar megas cada vez).
   *  Es de usar y tirar DENTRO de una función: la siguiente que pida el mismo nombre la pisa.
   *  Puede venir más larga de lo pedido y con restos de antes (no está a cero). */
  var TMP = {};
  function tmp(nombre, n) {
    var a = TMP[nombre];
    if (!a || a.length < n) a = TMP[nombre] = new Float32Array(n);
    return a;
  }

  /* -----------------------------------------------------------------------
     BANCO DE MEMORIA. Las matrices grandes que viven más que una función (el gris de la foto,
     la zona enderezada, los mapas de tinta, los pentagramas «estirados»…) se piden con toma()
     en vez de con «new»: al empezar cada análisis vuelven todas al banco y la foto siguiente
     las reutiliza. Pedir megas nuevos en cada foto cuesta más de lo que parece (el sistema los
     entrega a cero, página a página) y da trabajo al recolector de basura: en un móvil es la
     diferencia entre ir fluido o a tirones. El banco no pasa de CFG.bancoMaxMB;
     LMColoca.libera() lo vacía (p. ej. al cerrar el panel).
     OJO: lo que devuelve toma() NO está a cero salvo que se pida (aCero).
     ----------------------------------------------------------------------- */
  var BANCO = [];                                         // bloques { a: Float32Array, libre: bool }
  function toma(n, aCero) {
    if (n < 8192 || !CFG.banco) return new Float32Array(n);    // lo pequeño no merece la pena
    var i, b, mej = -1, total = 0, v;
    for (i = 0; i < BANCO.length; i++) {
      b = BANCO[i]; total += b.a.length;
      if (b.libre && b.a.length >= n && (mej < 0 || b.a.length < BANCO[mej].a.length)) mej = i;
    }
    if (mej >= 0 && BANCO[mej].a.length <= 2 * n + 16384) {    // (no gastar un bloque enorme en algo pequeño)
      b = BANCO[mej]; b.libre = false;
      v = b.a.length === n ? b.a : b.a.subarray(0, n);
      if (aCero) v.fill(0);
      return v;
    }
    // no hay bloque libre que sirva: uno nuevo (redondeado hacia arriba, para que valga para tamaños parecidos)
    var cap = Math.ceil(n / 16384) * 16384, tope = CFG.bancoMaxMB * 262144;
    for (i = BANCO.length - 1; i >= 0 && total + cap > tope; i--) {
      if (BANCO[i].libre) { total -= BANCO[i].a.length; BANCO.splice(i, 1); }   // se hace sitio soltando libres
    }
    if (total + cap > tope) return new Float32Array(n);        // no cabe: matriz corriente (se la lleva el recolector)
    b = { a: new Float32Array(cap), libre: false }; BANCO.push(b);
    return cap === n ? b.a : b.a.subarray(0, n);               // (recién creada: ya está a cero)
  }
  /** Devuelve al banco una matriz pedida con toma() (si no es del banco, no pasa nada). */
  function deja(v) {
    if (!v || v.length < 8192) return;
    for (var i = 0; i < BANCO.length; i++) if (BANCO[i].a.buffer === v.buffer) { BANCO[i].libre = true; return; }
  }
  function bancoLibre() { for (var i = 0; i < BANCO.length; i++) BANCO[i].libre = true; }
  /** Suelta toda la memoria que la librería guarda entre fotos. */
  function libera() { BANCO = []; TMP = {}; }

  /** RGBA -> gris (Float32). mezcla: 0 luminancia … 1 canal mínimo (o máximo si clara=true).
   *  Con clara=true devuelve el negativo, para que los trazos sean siempre oscuros. */
  function gris(pix, w, h, mezcla, clara) {
    var n = w * h, g = toma(n), i, j, r, gg, b, lum, ex, a, v;
    for (i = 0, j = 0; i < n; i++, j += 4) {
      r = pix[j]; gg = pix[j + 1]; b = pix[j + 2];
      lum = 0.299 * r + 0.587 * gg + 0.114 * b;
      if (clara) ex = r > gg ? (r > b ? r : b) : (gg > b ? gg : b);
      else ex = r < gg ? (r < b ? r : b) : (gg < b ? gg : b);
      v = lum + mezcla * (ex - lum);
      a = pix[j + 3];
      if (a < 255) v = (v * a + 255 * (255 - a)) / 255;     // transparente = papel blanco
      g[i] = clara ? 255 - v : v;
    }
    return g;
  }

  /** Reducción por promedio de área (separable). No amplía. */
  function reduceArea(src, sw, sh, dw, dh) {
    if (dw >= sw && dh >= sh) return src;
    var inter = tmp('ra_i', dw * sh), dst = toma(dw * dh);     // (las dos se escriben enteras)
    var fx = sw / dw, fy = sh / dh, x, y, i, a, b, i0, i1, acc, p, q, w0, w1;
    var c0 = new Int32Array(Math.max(dw, dh)), c1 = new Int32Array(Math.max(dw, dh));
    var p0 = new Float32Array(Math.max(dw, dh)), p1 = new Float32Array(Math.max(dw, dh));
    for (x = 0; x < dw; x++) {
      a = x * fx; b = (x + 1) * fx; if (b > sw) b = sw;
      i0 = Math.floor(a); i1 = Math.ceil(b) - 1; if (i1 >= sw) i1 = sw - 1; if (i1 < i0) i1 = i0;
      c0[x] = i0; c1[x] = i1; p0[x] = (i0 + 1) - a; p1[x] = b - i1;
    }
    for (y = 0; y < sh; y++) {
      p = y * sw; q = y * dw;
      for (x = 0; x < dw; x++) {
        i0 = c0[x]; i1 = c1[x];
        if (i0 === i1) { inter[q + x] = src[p + i0]; continue; }
        w0 = p0[x]; w1 = p1[x];
        acc = src[p + i0] * w0 + src[p + i1] * w1;
        for (i = i0 + 1; i < i1; i++) acc += src[p + i];
        inter[q + x] = acc / (w0 + w1 + (i1 - i0 - 1));
      }
    }
    for (y = 0; y < dh; y++) {
      a = y * fy; b = (y + 1) * fy; if (b > sh) b = sh;
      i0 = Math.floor(a); i1 = Math.ceil(b) - 1; if (i1 >= sh) i1 = sh - 1; if (i1 < i0) i1 = i0;
      c0[y] = i0; c1[y] = i1; p0[y] = (i0 + 1) - a; p1[y] = b - i1;
    }
    for (y = 0; y < dh; y++) {
      i0 = c0[y]; i1 = c1[y]; w0 = p0[y]; w1 = p1[y]; q = y * dw;
      if (i0 === i1) { p = i0 * dw; for (x = 0; x < dw; x++) dst[q + x] = inter[p + x]; continue; }
      var den = 1 / (w0 + w1 + (i1 - i0 - 1)), pa = i0 * dw, pb = i1 * dw;
      for (x = 0; x < dw; x++) dst[q + x] = inter[pa + x] * w0 + inter[pb + x] * w1;
      for (i = i0 + 1; i < i1; i++) { p = i * dw; for (x = 0; x < dw; x++) dst[q + x] += inter[p + x]; }
      for (x = 0; x < dw; x++) dst[q + x] *= den;
    }
    return dst;
  }

  /** Suavizado 1-2-1 separable (bordes repetidos). Escribe en dst. */
  function suave121(src, w, h, dst) {
    var t = tmp('s121', w * h), x, y, p, a, c;
    for (y = 0; y < h; y++) {
      p = y * w;
      t[p] = (3 * src[p] + src[p + 1]) * 0.25;
      for (x = 1; x < w - 1; x++) t[p + x] = (src[p + x - 1] + 2 * src[p + x] + src[p + x + 1]) * 0.25;
      t[p + w - 1] = (3 * src[p + w - 1] + src[p + w - 2]) * 0.25;
    }
    for (y = 0; y < h; y++) {
      p = y * w; a = (y > 0 ? y - 1 : 0) * w; c = (y < h - 1 ? y + 1 : h - 1) * w;
      for (x = 0; x < w; x++) dst[p + x] = (t[a + x] + 2 * t[p + x] + t[c + x]) * 0.25;
    }
    return dst;
  }

  /**
   * Filtro de máximo (signo=+1) o de mínimo (signo=-1) k×k, k impar, con el algoritmo de
   * van Herk / Gil-Werman (coste independiente de k). Escribe en dst (puede ser src).
   */
  function filtroExtremo(src, w, h, k, signo, dst) {
    var r = k >> 1, x, y, p, v, a, b, n, q, o, m, x0, x1, xa, xb;
    var t = tmp('fx_t', w * h), G = tmp('fx_g', w * h), Hh = tmp('fx_h', w * h);
    var g = tmp('fx_g1', Math.max(w, h)), hh = tmp('fx_h1', Math.max(w, h));
    var esMax = signo > 0;
    // ---- por filas: extremo acumulado por bloques de k hacia delante (g) y hacia atrás (hh);
    //      el extremo de la ventana [x-r, x+r] es el de hh[x-r] y g[x+r]. Sin módulos en el bucle.
    n = w;
    var bloqueFin = ((n - 1) / k) | 0, gFin;
    xa = r < n ? r : n; xb = n - r > xa ? n - r : xa;         // [xa, xb) = columnas con la ventana entera dentro
    for (y = 0; y < h; y++) {
      p = y * w;
      if (esMax) {
        for (x0 = 0; x0 < n; x0 += k) {
          x1 = x0 + k; if (x1 > n) x1 = n;
          m = src[p + x0]; g[x0] = m;
          for (x = x0 + 1; x < x1; x++) { v = src[p + x]; if (v > m) m = v; g[x] = m; }
          m = src[p + x1 - 1]; hh[x1 - 1] = m;
          for (x = x1 - 2; x >= x0; x--) { v = src[p + x]; if (v > m) m = v; hh[x] = m; }
        }
        gFin = g[n - 1];
        for (x = 0; x < xa; x++) { b = x + r; t[p + x] = g[b < n ? b : n - 1]; }
        for (x = xa; x < xb; x++) { a = hh[x - r]; b = g[x + r]; t[p + x] = a > b ? a : b; }
        for (x = xb; x < n; x++) { a = x - r; v = hh[a]; t[p + x] = (((a / k) | 0) === bloqueFin) ? v : (v > gFin ? v : gFin); }
      } else {
        for (x0 = 0; x0 < n; x0 += k) {
          x1 = x0 + k; if (x1 > n) x1 = n;
          m = src[p + x0]; g[x0] = m;
          for (x = x0 + 1; x < x1; x++) { v = src[p + x]; if (v < m) m = v; g[x] = m; }
          m = src[p + x1 - 1]; hh[x1 - 1] = m;
          for (x = x1 - 2; x >= x0; x--) { v = src[p + x]; if (v < m) m = v; hh[x] = m; }
        }
        gFin = g[n - 1];
        for (x = 0; x < xa; x++) { b = x + r; t[p + x] = g[b < n ? b : n - 1]; }
        for (x = xa; x < xb; x++) { a = hh[x - r]; b = g[x + r]; t[p + x] = a < b ? a : b; }
        for (x = xb; x < n; x++) { a = x - r; v = hh[a]; t[p + x] = (((a / k) | 0) === bloqueFin) ? v : (v < gFin ? v : gFin); }
      }
    }
    // ---- por columnas (se recorre por filas para aprovechar la caché)
    n = h;
    for (y = 0; y < n; y++) {
      p = y * w; q = p - w;
      if (y % k === 0) for (x = 0; x < w; x++) G[p + x] = t[p + x];
      else if (esMax) for (x = 0; x < w; x++) { v = t[p + x]; o = G[q + x]; G[p + x] = o > v ? o : v; }
      else for (x = 0; x < w; x++) { v = t[p + x]; o = G[q + x]; G[p + x] = o < v ? o : v; }
    }
    for (y = n - 1; y >= 0; y--) {
      p = y * w; q = p + w;
      if ((y + 1) % k === 0 || y === n - 1) for (x = 0; x < w; x++) Hh[p + x] = t[p + x];
      else if (esMax) for (x = 0; x < w; x++) { v = t[p + x]; o = Hh[q + x]; Hh[p + x] = o > v ? o : v; }
      else for (x = 0; x < w; x++) { v = t[p + x]; o = Hh[q + x]; Hh[p + x] = o < v ? o : v; }
    }
    var ult = (n - 1) * w, bloqueUlt = ((n - 1) / k) | 0, pa, pb;
    for (y = 0; y < n; y++) {
      p = y * w; a = y - r; b = y + r;
      if (a < 0) { pb = (b < n ? b : n - 1) * w; for (x = 0; x < w; x++) dst[p + x] = G[pb + x]; }
      else if (b > n - 1) {
        pa = a * w;
        if (((a / k) | 0) === bloqueUlt) for (x = 0; x < w; x++) dst[p + x] = Hh[pa + x];
        else if (esMax) for (x = 0; x < w; x++) dst[p + x] = Hh[pa + x] > G[ult + x] ? Hh[pa + x] : G[ult + x];
        else for (x = 0; x < w; x++) dst[p + x] = Hh[pa + x] < G[ult + x] ? Hh[pa + x] : G[ult + x];
      } else {
        pa = a * w; pb = b * w;
        if (esMax) for (x = 0; x < w; x++) dst[p + x] = Hh[pa + x] > G[pb + x] ? Hh[pa + x] : G[pb + x];
        else for (x = 0; x < w; x++) dst[p + x] = Hh[pa + x] < G[pb + x] ? Hh[pa + x] : G[pb + x];
      }
    }
    return dst;
  }

  /** Mediana aproximada de |a-b| (histograma de 0,25 en 0,25 hasta 40). */
  function medianaDif(a, b, n) {
    var hist = new Int32Array(161), i, d, paso = n > 60000 ? 3 : 1, cuenta = 0;
    for (i = 0; i < n; i += paso) {
      d = a[i] - b[i]; if (d < 0) d = -d;
      d = (d * 4) | 0; if (d > 160) d = 160;
      hist[d]++; cuenta++;
    }
    var mitad = cuenta / 2, ac = 0;
    for (i = 0; i <= 160; i++) { ac += hist[i]; if (ac >= mitad) return (i + 0.5) / 4; }
    return 40;
  }

  /**
   * MAPA DE TINTA: «sombrero de copa negro» relativo.
   *   fondo = cierre morfológico (máximo y luego mínimo en ventana k×k) del gris suavizado;
   *   tinta = (fondo - gris - ruido) / fondo, entre 0 y 1.
   * El cierre borra los trazos finos y deja intactos los escalones (bordes de sombra,
   * borde del papel), así que la luz desigual y las sombras duras casi no dejan rastro.
   * Con CFG.cierreMitad el cierre se hace a media resolución (máximo por bloques de 2×2, que ya
   * es media dilatación, y después máximo y mínimo con media ventana): sale el mismo fondo —el
   * papel es liso— con la cuarta parte del trabajo. La media ventana se redondea hacia ARRIBA:
   * tiene que borrar por lo menos lo mismo que la ventana entera (con 7 -> 3 se quedaban sin
   * rellenar los pentagramas pequeños, que a la escala de la fase 1 son una banda de 6-7 px).
   * Devuelve { tinta, sigma, fondo:{a,w,h,f} } (el fondo solo si conFondo; f = su reducción).
   */
  function mapaTinta(g, w, h, k, conFondo) {
    var n = w * h, sv = suave121(g, w, h, tmp('mt_s', n));
    var sigma = 1.4826 * medianaDif(g, sv, n) * 1.15; // ruido estimado
    var t = CFG.sigmasRuido * sigma, piso = CFG.pisoFondo, out = toma(n), f, v, x, y, p, q, cl, fondo = null;
    if (CFG.cierreMitad && w >= 8 && h >= 8) {
      var w2 = (w + 1) >> 1, h2 = (h + 1) >> 1, n2 = w2 * h2, m = tmp('mt_m', n2), a, b, o, wPar = w & ~1, k2 = Math.ceil(k / 2) | 1;      // media ventana, impar y hacia arriba: 7->5, 9->5, 11->7, 13->7, 15->9
      for (y = 0; y < h2; y++) {
        p = 2 * y * w; q = (2 * y + 1 < h) ? p + w : p; o = y * w2;          // (fila o columna impar final: se repite)
        for (x = 0; x < wPar; x += 2) {
          a = sv[p + x]; b = sv[p + x + 1]; if (b > a) a = b;
          b = sv[q + x]; if (b > a) a = b; b = sv[q + x + 1]; if (b > a) a = b;
          m[o + (x >> 1)] = a;
        }
        if (wPar < w) { a = sv[p + wPar]; b = sv[q + wPar]; m[o + w2 - 1] = b > a ? b : a; }
      }
      var mx = filtroExtremo(m, w2, h2, k2, +1, tmp('mt_mx', n2));
      cl = filtroExtremo(mx, w2, h2, k2, -1, conFondo ? toma(n2) : tmp('mt_cl', n2));   // cierre = mínimo(máximo)
      for (y = 0; y < h; y++) {
        p = y * w; q = (y >> 1) * w2;
        for (x = 0; x < w; x++) {
          f = cl[q + (x >> 1)];
          v = f - g[p + x] - t;
          if (v > 0) { if (f < piso) f = piso; v = v / f; out[p + x] = v > 1 ? 1 : v; } else out[p + x] = 0;
        }
      }
      if (conFondo) fondo = { a: cl, w: w2, h: h2, f: 2 };
    } else {
      var mx1 = filtroExtremo(sv, w, h, k, +1, tmp('mt_mx', n));
      cl = filtroExtremo(mx1, w, h, k, -1, conFondo ? toma(n) : tmp('mt_cl', n));
      for (x = 0; x < n; x++) {
        f = cl[x];
        v = f - g[x] - t;
        if (v > 0) { if (f < piso) f = piso; v = v / f; out[x] = v > 1 ? 1 : v; } else out[x] = 0;
      }
      if (conFondo) fondo = { a: cl, w: w, h: h, f: 1 };
    }
    return { tinta: out, sigma: sigma, fondo: fondo };
  }

  /** ¿Trazos claros sobre fondo oscuro? (pizarra verde con tiza). Devuelve un índice -1..1:
   *  negativo = trazos oscuros sobre claro (papel), positivo = claros sobre oscuro. */
  function indicePolaridad(g, w, h) {
    var T = 16, hist = new Int32Array(64), tx, ty, x, y, k, suma = 0, peso = 0, p10, p50, p90, c, ac, p, v;
    for (ty = 0; ty + T <= h; ty += T) {
      for (tx = 0; tx + T <= w; tx += T) {
        for (k = 0; k < 64; k++) hist[k] = 0;
        for (y = 0; y < T; y++) { p = (ty + y) * w + tx; for (x = 0; x < T; x++) { v = g[p + x] >> 2; hist[v < 0 ? 0 : (v > 63 ? 63 : v)]++; } }
        ac = 0; p10 = -1; p50 = -1; p90 = 63;
        for (k = 0; k < 64; k++) {
          ac += hist[k];
          if (p10 < 0 && ac >= 26) p10 = k;
          if (p50 < 0 && ac >= 128) p50 = k;
          if (ac >= 231) { p90 = k; break; }
        }
        c = (p90 - p10) * 4;
        if (c > 10) { suma += (p90 + p10 - 2 * p50) * 4; peso += c; }
      }
    }
    return peso > 0 ? suma / peso : 0;
  }

  /* =======================================================================
     FASE 1 · DIRECCIÓN DE LAS LÍNEAS (transformada de Radon por ángulos)
     ======================================================================= */

  /** Lista de píxeles con tinta (coordenadas centradas) para proyectar rápido. */
  function listaTinta(t, w, h, umbral, maxN, topeRel) {
    var n = w * h, i, c = 0, tope = 2;
    for (i = 0; i < n; i++) if (t[i] > umbral) c++;
    if (topeRel) {
      // tope de tinta = topeRel × la mediana de la tinta presente: así un boli oscuro no pesa
      // cien veces más que las líneas impresas flojas (que son las que marcan la dirección y la zona)
      var hist = new Int32Array(101), ac = 0;
      for (i = 0; i < n; i++) if (t[i] > umbral) hist[(t[i] * 100) | 0]++;
      for (i = 0; i <= 100; i++) { ac += hist[i]; if (ac >= c / 2) break; }
      tope = Math.max(0.06, topeRel * (i + 0.5) / 100);
    }
    var paso = 1;
    if (maxN && c > maxN) paso = Math.ceil(c / maxN);
    var nL = Math.ceil(c / paso) + 1, xs = toma(nL), ys = toma(nL), vs = toma(nL);
    var k = 0, m = 0, x, y, cx = w / 2, cy = h / 2;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      i = y * w + x;
      if (t[i] > umbral) { if (m % paso === 0) { xs[k] = x + 0.5 - cx; ys[k] = y + 0.5 - cy; vs[k] = t[i] > tope ? tope : t[i]; k++; } m++; }
    }
    return { xs: xs, ys: ys, vs: vs, n: k, tope: tope };
  }

  /** Una de cada tantas entradas de una lista de tinta, para que no pase de maxN. */
  function submuestra(L, maxN) {
    if (L.n <= maxN) return L;
    var paso = Math.ceil(L.n / maxN), n = Math.ceil(L.n / paso), xs = toma(n), ys = toma(n), vs = toma(n), i, k = 0;
    for (i = 0; i < L.n; i += paso) { xs[k] = L.xs[i]; ys[k] = L.ys[i]; vs[k] = L.vs[i]; k++; }
    return { xs: xs, ys: ys, vs: vs, n: k, tope: L.tope };
  }
  function dejaLista(L) { if (L) { deja(L.xs); deja(L.ys); deja(L.vs); } }

  /** Energía (paso-alto) del perfil de proyección para cada ángulo de la lista (radianes).
   *  Un ángulo es la dirección de las líneas: se proyecta a lo largo de él. */
  function energiaRadon(L, radio, angulos) {
    var nb = 2 * Math.ceil(radio) + 6, off = nb / 2, perf = new Float32Array(nb), sua = new Float32Array(nb);
    var E = new Float32Array(angulos.length), a, i, cs, sn, rho, i0, f, v, n = L.n, xs = L.xs, ys = L.ys, vs = L.vs;
    var R = CFG.radonAlisado, acc, e, j, cnt;
    for (a = 0; a < angulos.length; a++) {
      cs = Math.cos(angulos[a]); sn = Math.sin(angulos[a]);
      for (i = 0; i < nb; i++) perf[i] = 0;
      for (i = 0; i < n; i++) {
        rho = -xs[i] * sn + ys[i] * cs + off;
        i0 = rho | 0; f = rho - i0; v = vs[i];
        perf[i0] += v * (1 - f); perf[i0 + 1] += v * f;
      }
      for (i = 1; i < nb - 1; i++) sua[i] = 0.25 * perf[i - 1] + 0.5 * perf[i] + 0.25 * perf[i + 1];
      sua[0] = sua[1]; sua[nb - 1] = sua[nb - 2];
      // paso-alto: perfil menos su media móvil de radio R
      acc = 0; cnt = 0; e = 0;
      for (j = 0; j <= R && j < nb; j++) { acc += sua[j]; cnt++; }
      for (i = 0; i < nb; i++) {
        v = sua[i] - acc / cnt; e += v * v;
        j = i + R + 1; if (j < nb) { acc += sua[j]; cnt++; }
        j = i - R; if (j >= 0) { acc -= sua[j]; cnt--; }
      }
      E[a] = e;
    }
    return E;
  }

  /** Máximo con interpolación parabólica alrededor del índice i (devuelve desplazamiento -0.5..0.5). */
  function parabola(ym, y0, yp) {
    var den = ym - 2 * y0 + yp;
    if (den >= -1e-12) return 0;
    var d = 0.5 * (ym - yp) / den;
    return d < -0.5 ? -0.5 : (d > 0.5 ? 0.5 : d);
  }

  /** Direcciones candidatas de las líneas (radianes en [0, π)), de más a menos energía. */
  function direccionesCandidatas(tinta, w, h) {
    // búsqueda gruesa a 1/4 de resolución
    var f = Math.max(1, Math.round(Math.max(w, h) / 128));
    var w4 = Math.max(8, Math.round(w / f)), h4 = Math.max(8, Math.round(h / f));
    var t4 = reduceArea(tinta, w, h, w4, h4);
    var L4 = listaTinta(t4, w4, h4, 0.004, 0);
    var paso = CFG.radonPasoGrueso * PI / 180, n = Math.round(PI / paso), angs = new Float32Array(n), i, j;
    for (i = 0; i < n; i++) angs[i] = i * paso;
    var E = energiaRadon(L4, Math.hypot(w4, h4) / 2, angs);
    dejaLista(L4); if (t4 !== tinta) deja(t4);
    var S = new Float32Array(n), med = [];
    for (i = 0; i < n; i++) { S[i] = 0.25 * E[(i + n - 1) % n] + 0.5 * E[i] + 0.25 * E[(i + 1) % n]; med.push(S[i]); }
    med.sort(function (a, b) { return a - b; });
    var mediana = med[n >> 1] + 1e-9;
    var picos = [];
    for (i = 0; i < n; i++) {
      if (S[i] >= S[(i + n - 1) % n] && S[i] > S[(i + 1) % n]) {
        picos.push({ ang: (i + parabola(S[(i + n - 1) % n], S[i], S[(i + 1) % n])) * paso, e: S[i], rel: S[i] / mediana });
      }
    }
    picos.sort(function (a, b) { return b.e - a.e; });
    var sep = CFG.radonSeparacion * PI / 180, cand = [], d, ok;
    for (i = 0; i < picos.length && cand.length < CFG.radonCandidatas; i++) {
      ok = true;
      for (j = 0; j < cand.length; j++) {
        d = Math.abs(picos[i].ang - cand[j].ang); if (d > PI / 2) d = PI - d;
        if (d < sep) { ok = false; break; }
      }
      if (ok) cand.push(picos[i]);
    }
    return { cand: cand, energia: E, paso: paso, mediana: mediana };
  }

  /** Afina el ángulo de una candidata a resolución completa de trabajo. */
  function afinaAngulo(L, radio, ang) {
    var paso = CFG.radonPasoFino * PI / 180, m = Math.round(CFG.radonAbanicoFino / CFG.radonPasoFino);
    var n = 2 * m + 1, angs = new Float32Array(n), i, mej = 0;
    for (i = 0; i < n; i++) angs[i] = ang + (i - m) * paso;
    var E = energiaRadon(L, radio, angs);
    for (i = 1; i < n; i++) if (E[i] > E[mej]) mej = i;
    var d = (mej > 0 && mej < n - 1) ? parabola(E[mej - 1], E[mej], E[mej + 1]) : 0;
    var a = angs[mej] + d * paso;
    a = a % PI; if (a < 0) a += PI;
    return a;
  }

  /**
   * Afina el ángulo con la tinta de DENTRO de la zona de pentagramas, en un abanico ancho.
   * En la foto entera puede mandar otra familia de «líneas» casi paralela a la hoja —el teclado
   * del piano, las tablas o las vetas de la mesa, un mantel de rayas— y entonces el máximo de
   * Radon es el suyo, no el de los pentagramas (la hoja suele ponerse alineada con la mesa…).
   * Dentro de la zona (papel claro con líneas) solo quedan los pentagramas.
   */
  function afinaEnZona(L, zona, ang, radio) {
    var c = Math.cos(ang), s = Math.sin(ang), n = L.n, i, u, v, k = 0, cuenta = 0, paso;
    for (i = 0; i < n; i++) {
      u = L.xs[i] * c + L.ys[i] * s; v = -L.xs[i] * s + L.ys[i] * c;
      if (u >= zona.u0 && u <= zona.u1 && v >= zona.v0 && v <= zona.v1) cuenta++;
    }
    if (cuenta < 200) return ang;
    paso = Math.ceil(cuenta / 8000);
    var m = Math.ceil(cuenta / paso), xs = tmp('az_x', m), ys = tmp('az_y', m), vs = tmp('az_v', m), j = 0;
    for (i = 0; i < n; i++) {
      u = L.xs[i] * c + L.ys[i] * s; v = -L.xs[i] * s + L.ys[i] * c;
      if (u >= zona.u0 && u <= zona.u1 && v >= zona.v0 && v <= zona.v1) { if (j % paso === 0) { xs[k] = L.xs[i]; ys[k] = L.ys[i]; vs[k] = L.vs[i]; k++; } j++; }
    }
    var Lz = { xs: xs, ys: ys, vs: vs, n: k };
    // abanico grueso y después fino alrededor del mejor
    var pg = CFG.zonaAbanicoPaso * PI / 180, mg = Math.round(CFG.zonaAbanico / CFG.zonaAbanicoPaso), ng = 2 * mg + 1, angs = new Float32Array(ng), mej = 0;
    for (i = 0; i < ng; i++) angs[i] = ang + (i - mg) * pg;
    var E = energiaRadon(Lz, radio, angs);
    for (i = 1; i < ng; i++) if (E[i] > E[mej]) mej = i;
    if (mej === 0 || mej === ng - 1) return ang;            // en el borde del abanico: no es de fiar
    var a0 = angs[mej], pf = CFG.radonPasoFino * PI / 180, mf = Math.ceil(CFG.zonaAbanicoPaso / CFG.radonPasoFino), nf = 2 * mf + 1, af = new Float32Array(nf);
    for (i = 0; i < nf; i++) af[i] = a0 + (i - mf) * pf;
    E = energiaRadon(Lz, radio, af); mej = 0;
    for (i = 1; i < nf; i++) if (E[i] > E[mej]) mej = i;
    var d = (mej > 0 && mej < nf - 1) ? parabola(E[mej - 1], E[mej], E[mej + 1]) : 0, a = af[mej] + d * pf;
    a = a % PI; if (a < 0) a += PI;
    return a;
  }

  /* =======================================================================
     FASE 1 · ZONA DE LA FOTO DONDE HAY PENTAGRAMAS (para una dirección dada)
     ======================================================================= */
  /**
   * Divide la foto (girada 'ang') en celdas y mira en cuáles hay líneas largas en esa dirección.
   * Cada celda se parte en 4 subtiras a lo largo de las líneas: una línea impresa está en todas;
   * una nota o una plica, solo en una o dos. Con el 2.º valor más pequeño de las 4 subtiras por
   * fila queda un perfil «solo de líneas», igual de fuerte en un pentagrama vacío que en uno
   * lleno de notas a boli. La zona es la caja de las celdas con energía (paso-alto) suficiente.
   */
  function zonaPentagramas(L, w, h, ang, fondo, depura) {
    var c = Math.cos(ang), s = Math.sin(ang), R = Math.hypot(w, h) / 2;
    var C = CFG.celda, SUB = C / 4, NU = Math.ceil(2 * R / C) + 1, NS = NU * 4, NV = 2 * Math.ceil(R) + 4, offV = NV / 2, offU = NU * C / 2;
    var acc = tmp('zp_acc', NS * NV), i, u, v, su, i0, f, val, n = L.n, xs = L.xs, ys = L.ys, vs = L.vs;
    for (i = NS * NV - 1; i >= 0; i--) acc[i] = 0;
    for (i = 0; i < n; i++) {
      u = xs[i] * c + ys[i] * s + offU; v = -xs[i] * s + ys[i] * c + offV;
      su = (u / SUB) | 0; i0 = v | 0; f = v - i0; val = vs[i];
      acc[su * NV + i0] += val * (1 - f); acc[su * NV + i0 + 1] += val * f;
    }
    // perfil robusto por celda: 2.º menor de las 4 subtiras; después paso-alto y energía por celdas
    var NC = Math.ceil(NV / C), en = new Float32Array(NU * NC), perf = new Float32Array(NV);
    var RA = 7, j, a2, cnt, p, lista = [], cu, a, b, d, e, t, m1, m2, k;
    for (cu = 0; cu < NU; cu++) {
      p = cu * 4 * NV;
      for (i = 0; i < NV; i++) {
        // cada subtira, con ±1 fila de tolerancia (las líneas pueden ir algo inclinadas dentro de la celda)
        j = i > 0 ? i - 1 : 0; k = i < NV - 1 ? i + 1 : NV - 1;
        a = acc[p + i]; if (acc[p + j] > a) a = acc[p + j]; if (acc[p + k] > a) a = acc[p + k];
        b = acc[p + NV + i]; if (acc[p + NV + j] > b) b = acc[p + NV + j]; if (acc[p + NV + k] > b) b = acc[p + NV + k];
        d = acc[p + 2 * NV + i]; if (acc[p + 2 * NV + j] > d) d = acc[p + 2 * NV + j]; if (acc[p + 2 * NV + k] > d) d = acc[p + 2 * NV + k];
        e = acc[p + 3 * NV + i]; if (acc[p + 3 * NV + j] > e) e = acc[p + 3 * NV + j]; if (acc[p + 3 * NV + k] > e) e = acc[p + 3 * NV + k];
        // dos menores de cuatro
        if (a > b) { t = a; a = b; b = t; }
        if (d > e) { t = d; d = e; e = t; }
        m1 = a < d ? a : d; m2 = a < d ? (b < d ? b : d) : (a < e ? a : e);
        perf[i] = m2 > 0 ? m2 : 0; if (m1 < 0) perf[i] = 0;
      }
      a2 = 0; cnt = 0;
      for (j = 0; j <= RA; j++) { a2 += perf[j]; cnt++; }
      for (i = 0; i < NV; i++) {
        v = perf[i] - a2 / cnt;
        en[cu * NC + ((i / C) | 0)] += v * v;
        j = i + RA + 1; if (j < NV) { a2 += perf[j]; cnt++; }
        j = i - RA; if (j >= 0) { a2 -= perf[j]; cnt--; }
      }
    }
    // brillo del fondo por celda: los pentagramas están sobre lo claro (el papel); una mesa oscura
    // con vetas, un mantel de cuadros o las teclas de un piano tienen «líneas» pero no son papel
    if (fondo) {
      var bs = new Float32Array(NU * NC), bn = new Int32Array(NU * NC), hist = new Int32Array(256), x, y, tot = 0, cx = w / 2, cy = h / 2, fv, xx, yy;
      var fa2 = fondo.a, fw = fondo.w, fh = fondo.h, ff = fondo.f, salto = ff > 1 ? 2 : 3, medio = ff / 2;
      // (una muestra del fondo cada ~3-4 px de trabajo; el fondo puede venir a media resolución)
      for (y = ff > 1 ? 0 : 1; y < fh; y += salto) for (x = ff > 1 ? 0 : 1; x < fw; x += salto) {
        fv = fa2[y * fw + x]; xx = x * ff + medio - cx; yy = y * ff + medio - cy;
        u = xx * c + yy * s + offU; v = -xx * s + yy * c + offV;
        k = ((u / C) | 0) * NC + ((v / C) | 0);
        bs[k] += fv; bn[k]++; hist[fv < 0 ? 0 : (fv > 255 ? 255 : fv | 0)]++; tot++;
      }
      var acum = 0, b95 = 255;
      for (i = 255; i >= 0; i--) { acum += hist[i]; if (acum >= 0.05 * tot) { b95 = i; break; } }
      var minimoB = CFG.zonaBrilloMin * b95;
      for (i = 0; i < en.length; i++) if (bn[i] > 3 && bs[i] / bn[i] < minimoB) en[i] = 0;
    }
    for (i = 0; i < en.length; i++) if (en[i] > 0) lista.push(en[i]);
    if (lista.length < 2) return null;
    lista.sort(function (x2, y2) { return x2 - y2; });
    var ref = lista[Math.min(lista.length - 1, Math.floor(lista.length * 0.9))];
    var thr = CFG.celdaUmbral * ref, thrDebil = CFG.celdaDebil * ref;
    // componentes conexas de celdas FUERTES (8 vecinos)
    var marca = new Int32Array(NU * NC), comps = [], pila = [], cv, q, du, dv, qu, qv;
    for (i = 0; i < en.length; i++) {
      if (en[i] < thr || marca[i]) continue;
      var comp = { e: 0, u0: 1e9, u1: -1, v0: 1e9, v1: -1, n: 0 };
      pila.push(i); marca[i] = comps.length + 1;
      while (pila.length) {
        k = pila.pop(); cu = (k / NC) | 0; cv = k % NC;
        comp.e += en[k]; comp.n++;
        if (cu < comp.u0) comp.u0 = cu; if (cu > comp.u1) comp.u1 = cu;
        if (cv < comp.v0) comp.v0 = cv; if (cv > comp.v1) comp.v1 = cv;
        for (du = -1; du <= 1; du++) for (dv = -1; dv <= 1; dv++) {
          qu = cu + du; qv = cv + dv;
          if ((du || dv) && qu >= 0 && qu < NU && qv >= 0 && qv < NC) { q = qu * NC + qv; if (!marca[q] && en[q] >= thr) { marca[q] = comps.length + 1; pila.push(q); } }
        }
      }
      comps.push(comp);
    }
    if (!comps.length) return null;
    comps.sort(function (x2, y2) { return y2.e - x2.e; });
    var z = { u0: comps[0].u0, u1: comps[0].u1, v0: comps[0].v0, v1: comps[0].v1, e: comps[0].e };
    for (i = 1; i < comps.length; i++) {
      // se añaden los grupos de celdas con algo de peso (otro sistema separado del primero)
      if (comps[i].e >= CFG.celdaGrupoMin * comps[0].e && comps[i].n >= 2) {
        z.u0 = Math.min(z.u0, comps[i].u0); z.u1 = Math.max(z.u1, comps[i].u1);
        z.v0 = Math.min(z.v0, comps[i].v0); z.v1 = Math.max(z.v1, comps[i].v1); z.e += comps[i].e;
      }
    }
    // crecimiento hacia arriba y hacia abajo por filas de celdas DÉBILES: los pentagramas vacíos, de
    // líneas flojas o en sombra, cruzan todo el ancho de la hoja igual que los escritos. (Hacia los
    // lados no se crece: una mesa con vetas inundaría la zona.)
    function filaConLineas(fv) {
      var cuenta = 0, total = 0, x2;
      for (x2 = z.u0; x2 <= z.u1; x2++) { total++; if (en[x2 * NC + fv] >= thrDebil) cuenta++; }
      return cuenta >= CFG.celdaFilaMin * total;
    }
    var fallos = 0, fv;
    for (fv = z.v0 - 1; fv >= 0 && fallos < 2; fv--) { if (filaConLineas(fv)) { z.v0 = fv; fallos = 0; } else fallos++; }
    fallos = 0;
    for (fv = z.v1 + 1; fv < NC && fallos < 2; fv++) { if (filaConLineas(fv)) { z.v1 = fv; fallos = 0; } else fallos++; }
    // a coordenadas centradas (px de trabajo) con margen
    var U0 = z.u0 * C - offU, U1 = (z.u1 + 1) * C - offU, V0 = z.v0 * C - offV, V1 = (z.v1 + 1) * C - offV;
    var mu = Math.max(CFG.zonaMargenMin, CFG.zonaMargen * (U1 - U0)), mv = Math.max(CFG.zonaMargenMin, CFG.zonaMargen * (V1 - V0));
    var sal = { u0: U0 - mu, u1: U1 + mu, v0: V0 - mv, v1: V1 + mv, energia: z.e, celdas: comps[0].n };
    if (depura) sal.dep = { en: en, NU: NU, NC: NC, thr: thr, thrDebil: thrDebil, fuerte: [comps[0].u0, comps[0].u1, comps[0].v0, comps[0].v1], final: [z.u0, z.u1, z.v0, z.v1] };
    return sal;
  }

  /* =======================================================================
     FASE 2 · ZONA ENDEREZADA A MÁS RESOLUCIÓN
     ======================================================================= */

  /**
   * Corta de la imagen de entrada la zona [u0,u1]×[v0,v1] (coordenadas centradas y giradas
   * 'ang', en px de ENTRADA) y la devuelve con las líneas horizontales, a escala s2
   * (px de la zona por px de entrada). Elige la fuente (entrada o imagen de trabajo)
   * según la resolución que haga falta.
   */
  function endereza(ctx, ang, z, s2) {
    var c = Math.cos(ang), s = Math.sin(ang);
    var W2 = Math.max(8, Math.round((z.u1 - z.u0) * s2)), H2 = Math.max(8, Math.round((z.v1 - z.v0) * s2));
    var out = toma(W2 * H2), izq = new Int32Array(H2), der = new Int32Array(H2);     // (out se escribe entera)
    var paso = 1 / s2;                                   // px de entrada por px de zona
    var src, sw, sh, esc;                                // fuente y su escala respecto a la entrada
    if (ctx.fa > 1.01 && paso >= ctx.fa * 0.85) { src = ctx.A; sw = ctx.wa; sh = ctx.ha; esc = 1 / ctx.fa; }
    else { src = ctx.g0; sw = ctx.W; sh = ctx.H; esc = 1; }
    // si se reduce de forma apreciable, dos muestras por píxel separadas a lo ALTO (perpendicular a
    // las líneas): es donde una línea fina se perdería entre dos muestras
    var super2 = (paso * esc) > 1.35;
    var W = ctx.W, H = ctx.H, i, j, U, V, x, y, x0, y0, dx = c * paso, dy = s * paso, p, a, b, lo, hi, t;
    var q = super2 ? 0.25 * paso : 0, sx, sy, xi, yi, fx, fy, acc, o;
    var ex = -q * s * esc, ey = q * c * esc;             // desplazamiento de ±1/4 de píxel de zona, a lo alto
    var mxX = sw - 1.001, mxY = sh - 1.001, dxe = dx * esc, dye = dy * esc;
    for (j = 0; j < H2; j++) {
      V = z.v0 + (j + 0.5) * paso; U = z.u0 + 0.5 * paso;
      x0 = W / 2 + U * c - V * s; y0 = H / 2 + U * s + V * c;
      // intervalo de i con (x,y) dentro de la foto
      lo = 0; hi = W2 - 1;
      if (Math.abs(dx) > 1e-9) { a = (0.5 - x0) / dx; b = (W - 0.5 - x0) / dx; if (a > b) { t = a; a = b; b = t; } if (a > lo) lo = a; if (b < hi) hi = b; }
      else if (x0 < 0.5 || x0 > W - 0.5) { lo = 1; hi = 0; }
      if (Math.abs(dy) > 1e-9) { a = (0.5 - y0) / dy; b = (H - 0.5 - y0) / dy; if (a > b) { t = a; a = b; b = t; } if (a > lo) lo = a; if (b < hi) hi = b; }
      else if (y0 < 0.5 || y0 > H - 0.5) { lo = 1; hi = 0; }
      izq[j] = Math.ceil(lo); der[j] = Math.floor(hi);
      p = j * W2; x = x0 * esc - 0.5; y = y0 * esc - 0.5;
      if (!super2) {
        for (i = 0; i < W2; i++) {
          sx = x + i * dxe; sy = y + i * dye;
          if (sx < 0) sx = 0; else if (sx > mxX) sx = mxX;
          if (sy < 0) sy = 0; else if (sy > mxY) sy = mxY;
          xi = sx | 0; yi = sy | 0; fx = sx - xi; fy = sy - yi; o = yi * sw + xi;
          out[p + i] = (src[o] * (1 - fx) + src[o + 1] * fx) * (1 - fy) + (src[o + sw] * (1 - fx) + src[o + sw + 1] * fx) * fy;
        }
      } else {
        for (i = 0; i < W2; i++) {
          sx = x + i * dxe + ex; sy = y + i * dye + ey;
          if (sx < 0) sx = 0; else if (sx > mxX) sx = mxX;
          if (sy < 0) sy = 0; else if (sy > mxY) sy = mxY;
          xi = sx | 0; yi = sy | 0; fx = sx - xi; fy = sy - yi; o = yi * sw + xi;
          acc = (src[o] * (1 - fx) + src[o + 1] * fx) * (1 - fy) + (src[o + sw] * (1 - fx) + src[o + sw + 1] * fx) * fy;
          sx = x + i * dxe - ex; sy = y + i * dye - ey;
          if (sx < 0) sx = 0; else if (sx > mxX) sx = mxX;
          if (sy < 0) sy = 0; else if (sy > mxY) sy = mxY;
          xi = sx | 0; yi = sy | 0; fx = sx - xi; fy = sy - yi; o = yi * sw + xi;
          out[p + i] = 0.5 * (acc + (src[o] * (1 - fx) + src[o + 1] * fx) * (1 - fy) + (src[o + sw] * (1 - fx) + src[o + sw + 1] * fx) * fy);
        }
      }
    }
    return { img: out, W2: W2, H2: H2, izq: izq, der: der, c: c, s: s, ang: ang, s2: s2, u0: z.u0, v0: z.v0 };
  }

  /** Punto de la zona enderezada -> píxel de la imagen de entrada. */
  function zonaAEntrada(R, ctx, i, j) {
    var U = R.u0 + i / R.s2, V = R.v0 + j / R.s2;
    return [ctx.W / 2 + U * R.c - V * R.s, ctx.H / 2 + U * R.s + V * R.c];
  }

  /**
   * Pendiente residual de las líneas en la zona (dv/du): la que hace más NÍTIDO el perfil de
   * proyección cizallado. Corrige el error del ángulo de la fase 1 antes de sacar los perfiles
   * por tiras. Se mide por separado en la mitad de arriba y en la de abajo de la zona: con la
   * foto hecha en escorzo las líneas no son paralelas (convergen), y la pendiente cambia con
   * la altura. Devuelve el modelo { p0, p1 }: pendiente = p0 + p1·(v - H2/2).
   */
  function pendientePorMitades(J, R) {
    var L = listaTinta(J, R.W2, R.H2, 0.015, 14000), sal = { p0: 0, p1: 0 };
    if (L.n < 60) { dejaLista(L); return sal; }
    var nb = R.H2 + 8, off = nb / 2, M = Math.round(CFG.cizallaMax / CFG.cizallaPaso), paso = CFG.cizallaPaso, nk = 2 * M + 1;
    var pa = new Float32Array(nb), pb = new Float32Array(nb), Ea = new Float32Array(nk), Eb = new Float32Array(nk);
    var k, i, m, r, i0, f, v, e, n = L.n, xs = L.xs, ys = L.ys, vs = L.vs, na = 0, nbb = 0;
    for (i = 0; i < n; i++) if (ys[i] < 0) na++; else nbb++;
    for (k = -M; k <= M; k++) {
      m = k * paso;
      for (i = 0; i < nb; i++) { pa[i] = 0; pb[i] = 0; }
      for (i = 0; i < n; i++) {
        r = ys[i] - m * xs[i] + off;
        if (r < 1 || r > nb - 2) continue;
        i0 = r | 0; f = r - i0; v = vs[i];
        if (ys[i] < 0) { pa[i0] += v * (1 - f); pa[i0 + 1] += v * f; } else { pb[i0] += v * (1 - f); pb[i0 + 1] += v * f; }
      }
      e = 0; for (i = 1; i < nb; i++) { v = pa[i] - pa[i - 1]; e += v * v; } Ea[k + M] = e;
      e = 0; for (i = 1; i < nb; i++) { v = pb[i] - pb[i - 1]; e += v * v; } Eb[k + M] = e;
    }
    dejaLista(L);
    // mejor cizalla de cada mitad; si el máximo cae en el borde del abanico no son las líneas del
    // pentagrama (un mantel de rayas, las vetas de la mesa…): esa mitad no opina
    function mejorDe(E) {
      var mej = 0, j;
      for (j = 1; j < nk; j++) if (E[j] > E[mej]) mej = j;
      if (mej === 0 || mej === nk - 1 || !(E[mej] > 0)) return null;
      return (mej - M + parabola(E[mej - 1], E[mej], E[mej + 1])) * paso;
    }
    var ma = na >= 40 ? mejorDe(Ea) : null, mb = nbb >= 40 ? mejorDe(Eb) : null;
    // con las dos mitades sumadas (la pendiente «global» de siempre)
    for (k = 0; k < nk; k++) Ea[k] += Eb[k];
    var mg = mejorDe(Ea);
    if (ma !== null && mb !== null && CFG.cizallaMitades) {
      // cada mitad mide la pendiente a un cuarto de la altura por encima/debajo del centro
      sal.p0 = (ma + mb) / 2; sal.p1 = (mb - ma) / (R.H2 / 2);
    } else if (mg !== null) sal.p0 = mg;
    else if (ma !== null) sal.p0 = ma; else if (mb !== null) sal.p0 = mb;
    return sal;
  }

  /**
   * Perfiles de tinta por tiras verticales: P[t*H2 + v] = PERCENTIL (CFG.tiraPercentil) de la tinta
   * de la fila v dentro de la tira t (siguiendo la pendiente del modelo 'mod'). Una línea impresa cruza toda
   * la tira, así que su percentil es la tinta de la línea; las notas y plicas ocupan solo una parte
   * de la fila y desaparecen. (Con la media, un boli oscuro sobre líneas flojas tapaba el pentagrama.)
   */
  function perfilesTiras(J, R, ancho, mod) {
    var W2 = R.W2, H2 = R.H2, nt = Math.max(1, Math.floor(W2 / ancho)), P = toma(nt * H2, true), ok = new Uint8Array(nt * H2);
    var t, v, a, b, x, y, n, m, k, i, j, val, uc, sl, minimo = Math.max(3, Math.floor(ancho * 0.6)), q = CFG.tiraPercentil;
    var buf = new Float32Array(2 * ancho + 4), izq = R.izq, der = R.der, p0 = mod.p0, p1 = mod.p1, vc = mod.vc;
    var salto = ancho >= 16 ? 2 : 1;                      // con tiras anchas basta una columna de cada dos
    minimo = Math.max(3, Math.floor(ancho * 0.6 / salto));
    for (t = 0; t < nt; t++) {
      a = t * ancho; b = (t === nt - 1) ? W2 : a + ancho; uc = (a + b) / 2 - 0.5;
      for (v = 0; v < H2; v++) {
        sl = p0 + p1 * (v - vc);                          // pendiente de las líneas a esta altura
        n = 0; m = 0;
        for (x = a + (v & (salto - 1)); x < b; x += salto) {
          y = Math.round(v + sl * (x - uc));
          if (y < 0 || y >= H2 || x < izq[y] || x > der[y]) continue;
          n++; val = J[y * W2 + x]; if (val > 0) buf[m++] = val;
        }
        if (n < minimo) continue;
        ok[t * H2 + v] = 1;
        k = Math.floor(q * n) - (n - m);                 // índice del percentil entre los no nulos
        if (k < 0) continue;                              // el percentil cae en los ceros
        for (i = 1; i < m; i++) { val = buf[i]; for (j = i - 1; j >= 0 && buf[j] > val; j--) buf[j + 1] = buf[j]; buf[j + 1] = val; }
        P[t * H2 + v] = buf[k < m ? k : m - 1];
      }
    }
    return { P: P, ok: ok, nt: nt, ancho: ancho };
  }

  /** Autocorrelación (suma sobre tiras) de la DERIVADA de los perfiles: la derivada resalta las
   *  líneas finas a cualquier escala y quita la envolvente (la «banda» del pentagrama). */
  function autocorrelacionTiras(T, H2, lmax) {
    var ac = new Float32Array(lmax + 2), hp = new Float32Array(H2), t, v, l, p, s, fin;
    for (t = 0; t < T.nt; t++) {
      p = t * H2; hp[0] = 0;
      for (v = 1; v < H2; v++) hp[v] = (T.ok[p + v] && T.ok[p + v - 1]) ? T.P[p + v] - T.P[p + v - 1] : 0;
      for (l = 0; l <= lmax + 1; l++) { s = 0; fin = H2 - l; for (v = 0; v < fin; v++) s += hp[v] * hp[v + l]; ac[l] += s; }
    }
    return ac;
  }

  /** Máximos locales de una autocorrelación en [lmin, lmax], de mayor a menor (retardo con decimales). */
  function picosAutocorrelacion(ac, lmin, lmax, cuantos) {
    var l, L = [];
    if (!(ac[0] > 0)) return L;
    for (l = Math.max(2, lmin); l < lmax; l++) {
      if (ac[l] > ac[l - 1] && ac[l] >= ac[l + 1] && ac[l] > 0.04 * ac[0]) L.push({ d: l + parabola(ac[l - 1], ac[l], ac[l + 1]), v: ac[l] / ac[0] });
    }
    L.sort(function (x, y) { return y.v - x.v; });
    return L.slice(0, cuantos);
  }

  /**
   * PEINE DE CINCO LÍNEAS. Para cada tira y cada fila v (centro = 3ª línea) mide
   *   líneas  = tinta en v-2d, v-d, v, v+d, v+2d      (media y mínimo)
   *   espacios= tinta en los cuatro huecos intermedios
   *   flancos = tinta donde estaría una 6ª línea (v±3d; el MENOR de los dos lados: una barra de
   *             corcheas cae a un lado; el papel rayado, a los dos)
   *   respuesta = peinePesoMin·mín + (1-peinePesoMin)·media - espacios - peineFlanco·max(0, flancos - espacios)
   * Devuelve los máximos locales por tira (candidatos a pentagrama) y el mapa de respuestas.
   */
  function peine(T, H2, mod, conMapa) {
    var P = T.P, ok = T.ok, nt = T.nt, cands = [], t, v, k, p, y, val, mn, sm, es, fl, r, q, a, g, yy, d;
    var resp = new Float32Array(H2), cal = new Float32Array(H2), sexta = new Uint8Array(H2), todos = [], sx;
    var dMaxZ = Math.max(mod.d0 + Math.abs(mod.d1) * mod.vc, mod.d0), m = Math.ceil(3 * dMaxZ) + 1;
    var mapa = conMapa ? new Float32Array(nt * H2) : null;
    var rad, b, esMax, kf = CFG.peineFlanco, qmin = CFG.peineCalidadMin, km = CFG.peinePesoMin, d0 = mod.d0, d1 = mod.d1, vc = mod.vc;
    var saltoT = T.salto || 1;
    for (t = 0; t < nt; t += saltoT) {
      p = t * H2;
      for (v = 0; v < H2; v++) { resp[v] = 0; cal[v] = 0; }
      for (v = m; v < H2 - m - 1; v++) {
        d = d0 + d1 * (v - vc);
        if (!(P[p + v] > 0)) continue;                      // sin tinta en la 3ª línea no hay nada que medir (lo más frecuente)
        if (!ok[p + v] || !ok[p + ((v - 2 * d) | 0)] || !ok[p + ((v + 2 * d) | 0)]) continue;
        mn = 1e9; sm = 0;
        for (k = -2; k <= 2; k++) { yy = v + k * d; a = yy | 0; g = yy - a; val = P[p + a] * (1 - g) + P[p + a + 1] * g; if (!(val > 0)) { mn = 0; break; } sm += val; if (val < mn) mn = val; }
        if (mn <= 0) continue;
        sm /= 5;
        es = 0;
        for (k = -2; k < 2; k++) { yy = v + (k + 0.5) * d; a = yy | 0; g = yy - a; es += P[p + a] * (1 - g) + P[p + a + 1] * g; }
        es /= 4;
        yy = v - 3 * d; a = yy | 0; g = yy - a; fl = P[p + a] * (1 - g) + P[p + a + 1] * g;
        yy = v + 3 * d; a = yy | 0; g = yy - a; val = P[p + a] * (1 - g) + P[p + a + 1] * g;
        // una 6ª línea a un solo lado puede ser una barra de corcheas; a los dos lados es papel rayado o una textura
        sx = (fl > 0.5 * sm ? 1 : 0) | (val > 0.5 * sm ? 2 : 0);
        if (val < fl) fl = val;
        r = km * mn + (1 - km) * sm - es - kf * (fl > es ? fl - es : 0);
        if (r > 0) { resp[v] = r; cal[v] = r / (sm + 1e-6); sexta[v] = sx; }
      }
      if (mapa) for (v = 0; v < H2; v++) mapa[p + v] = resp[v];
      // máximos locales separados al menos 2,5 d
      for (v = m; v < H2 - m - 1; v++) {
        r = resp[v];
        if (r <= 0 || cal[v] < qmin) continue;
        rad = Math.max(2, Math.round(2.5 * (d0 + d1 * (v - vc))));
        a = v - rad < 0 ? 0 : v - rad; b = v + rad > H2 - 1 ? H2 - 1 : v + rad; esMax = true;
        for (y = a; y <= b; y++) if (resp[y] > r || (resp[y] === r && y < v)) { esMax = false; break; }
        if (!esMax) continue;
        q = parabola(resp[v - 1], r, resp[v + 1]);
        cands.push({ t: t, v: v + q, r: r, q: cal[v], sexta: sexta[v], usado: false });
        todos.push(r);
      }
    }
    todos.sort(function (x, y2) { return x - y2; });
    var ref = todos.length ? todos[Math.floor(todos.length * 0.8)] : 0;
    var fin = [];
    for (k = 0; k < cands.length; k++) if (cands[k].r >= CFG.peineRelMin * ref) fin.push(cands[k]);
    return { cands: fin, ref: ref, mapa: mapa };
  }

  /** Respuesta del peine en un punto (tira t, fila v) para una separación d. */
  function respuestaPeine(T, H2, t, v, d) {
    var P = T.P, p = t * H2, k, yy, a, g, val, mn = 1e9, sm = 0, es = 0;
    if (v - 3 * d < 1 || v + 3 * d > H2 - 2) return 0;
    for (k = -2; k <= 2; k++) { yy = v + k * d; a = yy | 0; g = yy - a; val = P[p + a] * (1 - g) + P[p + a + 1] * g; sm += val; if (val < mn) mn = val; }
    for (k = -2; k < 2; k++) { yy = v + (k + 0.5) * d; a = yy | 0; g = yy - a; es += P[p + a] * (1 - g) + P[p + a + 1] * g; }
    return CFG.peinePesoMin * mn + (1 - CFG.peinePesoMin) * sm / 5 - es / 4;
  }

  /** Enlaza los candidatos de tiras vecinas en pentagramas (de izquierda a derecha).
   *  La pendiente esperada (px por tira) sale del modelo: con perspectiva cambia con la altura. */
  function enlaza(cands, nt, d, mod, ancho) {
    var porTira = [], i, t;
    for (t = 0; t < nt; t++) porTira.push([]);
    for (i = 0; i < cands.length; i++) porTira[cands[i].t].push(cands[i]);
    var orden = cands.slice().sort(function (a, b) { return b.r - a.r; });
    var tol = CFG.enlaceTol * d, pents = [];
    function busca(tt, vpred) {
      var L = porTira[tt], mej = null, md = tol, k, dd;
      for (k = 0; k < L.length; k++) {
        if (L[k].usado) continue;
        dd = Math.abs(L[k].v - vpred);
        if (dd < md) { md = dd; mej = L[k]; }
      }
      return mej;
    }
    function extiende(pts, sentido) {
      var ult = sentido > 0 ? pts[pts.length - 1] : pts[0], pen = (mod.p0 + mod.p1 * (ult.v - mod.vc)) * ancho, n = pts.length, huecos = 0, tt, c, vp;
      if (n >= 2) {
        var o = sentido > 0 ? pts[Math.max(0, n - 4)] : pts[Math.min(n - 1, 3)];
        if (o !== ult) pen = (ult.v - o.v) / (ult.t - o.t);
      }
      tt = ult.t + sentido;
      while (tt >= 0 && tt < nt && huecos <= CFG.enlaceHuecos) {
        vp = ult.v + pen * (tt - ult.t);
        c = busca(tt, vp);
        if (c) {
          c.usado = true;
          if (sentido > 0) pts.push(c); else pts.unshift(c);
          var m = pts.length, a = sentido > 0 ? pts[Math.max(0, m - 4)] : pts[Math.min(m - 1, 3)];
          if (a !== c) pen = 0.5 * pen + 0.5 * (c.v - a.v) / (c.t - a.t);
          ult = c; huecos = 0;
        } else huecos++;
        tt += sentido;
      }
    }
    for (i = 0; i < orden.length; i++) {
      var c0 = orden[i];
      if (c0.usado) continue;
      c0.usado = true;
      var pts = [c0];
      extiende(pts, 1); extiende(pts, -1); extiende(pts, 1);
      if (pts.length >= CFG.pentMinTiras) pents.push(pts);
      else for (t = 0; t < pts.length; t++) if (pts[t] !== c0) pts[t].usado = false;
    }
    return pents;
  }

  /** Ajuste por mínimos cuadrados v = a + b·u (+ c·u² si grado=2 y hay puntos de sobra). Robusto: 2 pasadas. */
  function ajustaCurva(us, vs, ws, grado) {
    var n = us.length, pasada, i, coef = [0, 0, 0], usa = [];
    for (i = 0; i < n; i++) usa.push(true);
    for (pasada = 0; pasada < 2; pasada++) {
      var S = [0, 0, 0, 0, 0], B = [0, 0, 0], w, u, v, u2, m = 0, um = 0;
      for (i = 0; i < n; i++) if (usa[i]) { um += us[i]; m++; }
      um = m ? um / m : 0;
      for (i = 0; i < n; i++) {
        if (!usa[i]) continue;
        w = ws ? ws[i] : 1; u = us[i] - um; v = vs[i]; u2 = u * u;
        S[0] += w; S[1] += w * u; S[2] += w * u2; S[3] += w * u2 * u; S[4] += w * u2 * u2;
        B[0] += w * v; B[1] += w * v * u; B[2] += w * v * u2;
      }
      var g = (grado >= 2 && m >= 7) ? 2 : (m >= 2 ? 1 : 0), a = 0, b = 0, c2 = 0;
      if (g === 2) {
        var D = S[0] * (S[2] * S[4] - S[3] * S[3]) - S[1] * (S[1] * S[4] - S[3] * S[2]) + S[2] * (S[1] * S[3] - S[2] * S[2]);
        if (Math.abs(D) < 1e-9) g = 1;
        else {
          a = (B[0] * (S[2] * S[4] - S[3] * S[3]) - S[1] * (B[1] * S[4] - S[3] * B[2]) + S[2] * (B[1] * S[3] - S[2] * B[2])) / D;
          b = (S[0] * (B[1] * S[4] - B[2] * S[3]) - B[0] * (S[1] * S[4] - S[3] * S[2]) + S[2] * (S[1] * B[2] - B[1] * S[2])) / D;
          c2 = (S[0] * (S[2] * B[2] - S[3] * B[1]) - S[1] * (S[1] * B[2] - S[2] * B[1]) + B[0] * (S[1] * S[3] - S[2] * S[2])) / D;
        }
      }
      if (g === 1) {
        var D1 = S[0] * S[2] - S[1] * S[1];
        if (Math.abs(D1) < 1e-9) g = 0; else { a = (B[0] * S[2] - B[1] * S[1]) / D1; b = (S[0] * B[1] - S[1] * B[0]) / D1; c2 = 0; }
      }
      if (g === 0) { a = S[0] ? B[0] / S[0] : 0; b = 0; c2 = 0; }
      coef = [a - b * um + c2 * um * um, b - 2 * c2 * um, c2];      // deshace el centrado
      if (pasada === 0 && n >= 4) {
        var res = [], r;
        for (i = 0; i < n; i++) { r = Math.abs(vs[i] - (coef[0] + coef[1] * us[i] + coef[2] * us[i] * us[i])); res.push(r); }
        var ord = res.slice().sort(function (x, y) { return x - y; }), lim = Math.max(0.6, 3 * ord[n >> 1]);
        for (i = 0; i < n; i++) usa[i] = res[i] <= lim;
      }
    }
    return coef;
  }

  /** Muestra bilineal de la tinta de la zona (0 fuera). */
  function tintaEn(J, R, x, y) {
    if (x < 0 || y < 0 || x > R.W2 - 1.001 || y > R.H2 - 1.001) return 0;
    var xi = x | 0, yi = y | 0, fx = x - xi, fy = y - yi, o = yi * R.W2 + xi;
    return (J[o] * (1 - fx) + J[o + 1] * fx) * (1 - fy) + (J[o + R.W2] * (1 - fx) + J[o + R.W2 + 1] * fx) * fy;
  }

  /** ¿El punto (x,y) de la zona cae dentro de la foto? */
  function dentro(R, x, y) {
    var j = Math.round(y);
    if (j < 0 || j >= R.H2) return false;
    return x >= R.izq[j] && x <= R.der[j];
  }

  function vDe(p, u) { return p.coef[0] + p.coef[1] * u + p.coef[2] * u * u; }

  /** Separación entre líneas del pentagrama p (interpolada entre su mitad izquierda y derecha). */
  function dEn(p, u) {
    if (!(p.uD > p.uI)) return p.d;
    var f = (u - p.uI) / (p.uD - p.uI);
    if (f < -0.5) f = -0.5; else if (f > 1.5) f = 1.5;
    return p.dI + (p.dD - p.dI) * f;
  }

  /**
   * Con unos perfiles T y un modelo (pendiente y separación de líneas que pueden variar con la
   * altura: perspectiva) saca los candidatos del peine, los enlaza y ajusta cada pentagrama.
   */
  function detecta(T, H2, mod, ancho) {
    var pr = peine(T, H2, mod, true), nt = T.nt, pents = [], i, k, total = 0;
    if (!pr.cands.length) return { pents: pents, total: 0, ref: pr.ref };
    var dc = mod.d0, cadenas = enlaza(pr.cands, nt, dc, mod, ancho);
    for (i = 0; i < cadenas.length; i++) {
      var pts = cadenas[i], us = [], vs = [], ws = [], ts = [], sq = 0, sr = 0, tiene = new Uint8Array(nt), nArr = 0, nAba = 0;
      for (k = 0; k < pts.length; k++) {
        us.push((pts[k].t + 0.5) * ancho); vs.push(pts[k].v); ws.push(pts[k].r); ts.push(pts[k].t);
        sq += pts[k].q; sr += pts[k].r; tiene[pts[k].t] = 1;
        if (pts[k].sexta & 1) nArr++; if (pts[k].sexta & 2) nAba++;
      }
      // una 6ª línea a lo largo de casi todo un lado: no es un pentagrama, es el borde de un papel rayado
      if (Math.max(nArr, nAba) > CFG.sextaLineaFrac * pts.length) continue;
      var media = sr / pts.length, coef = ajustaCurva(us, vs, ws, pts.length >= 7 ? 2 : 1);
      var dAqui = mod.d0 + mod.d1 * (vs[vs.length >> 1] - mod.vc);
      // completar con respuestas débiles del peine en las tiras donde no hubo candidato (hacia fuera)
      var sentido, t, fallos, vp, v0, v1, v, mejV, mejR, rr, lin, n2, anadidos = 0;
      for (sentido = -1; sentido <= 1; sentido += 2) {
        t = sentido > 0 ? pts[pts.length - 1].t + 1 : pts[0].t - 1; fallos = 0;
        while (t >= 0 && t < nt && fallos < 3) {
          if (!tiene[t]) {
            n2 = us.length; lin = ajustaCurva(sentido > 0 ? us.slice(Math.max(0, n2 - 4)) : us.slice(0, 4), sentido > 0 ? vs.slice(Math.max(0, n2 - 4)) : vs.slice(0, 4), null, 1);
            vp = lin[0] + lin[1] * (t + 0.5) * ancho;
            v0 = Math.max(1, Math.round(vp - 0.45 * dAqui)); v1 = Math.min(H2 - 2, Math.round(vp + 0.45 * dAqui)); mejV = -1; mejR = 0;
            for (v = v0; v <= v1; v++) { rr = pr.mapa[t * H2 + v]; if (rr > mejR) { mejR = rr; mejV = v; } }
            if (mejV > 0 && mejR >= 0.25 * media) {
              if (sentido > 0) { us.push((t + 0.5) * ancho); vs.push(mejV); ws.push(mejR); ts.push(t); } else { us.unshift((t + 0.5) * ancho); vs.unshift(mejV); ws.unshift(mejR); ts.unshift(t); }
              tiene[t] = 1; fallos = 0; anadidos++;
            } else fallos++;
          }
          t += sentido;
        }
      }
      if (anadidos) coef = ajustaCurva(us, vs, ws, us.length >= 7 ? 2 : 1);
      // separación entre líneas propia de este pentagrama (la perspectiva la cambia de uno a otro)
      var facs = [0.88, 0.92, 0.96, 1.0, 1.04, 1.08, 1.12], fi, mejF = 3, punt = [], sp;
      for (fi = 0; fi < facs.length; fi++) {
        sp = 0;
        for (k = 0; k < us.length; k++) sp += respuestaPeine(T, H2, ts[k], vs[k], dAqui * facs[fi]);
        punt.push(sp); if (sp > punt[mejF]) mejF = fi;
      }
      // cordura: un pentagrama es casi recto y casi paralelo a la pendiente general de la zona
      var largoCad = us[us.length - 1] - us[0], flecha = Math.abs(coef[2]) * largoCad * largoCad / 4, umCad = (us[0] + us[us.length - 1]) / 2;
      var pendLocal = mod.p0 + mod.p1 * ((coef[0] + coef[1] * umCad + coef[2] * umCad * umCad) - mod.vc);
      if (flecha > CFG.curvaturaMaxD * dAqui || Math.abs(coef[1] + 2 * coef[2] * umCad - pendLocal) > CFG.pendienteMax) continue;
      var dProp = dAqui * facs[mejF];
      if (mejF > 0 && mejF < facs.length - 1) dProp = dAqui * (facs[mejF] + 0.04 * parabola(punt[mejF - 1], punt[mejF], punt[mejF + 1]));
      var um = (us[0] + us[us.length - 1]) / 2;
      pents.push({ coef: coef, d: dProp, n: pts.length, calidad: sq / pts.length, fuerza: media,
        uA: us[0] - ancho / 2, uB: us[us.length - 1] + ancho / 2, vMed: coef[0] + coef[1] * um + coef[2] * um * um, pendMed: coef[1] + 2 * coef[2] * um });
      total += pts.length * (sq / pts.length);
    }
    return { pents: pents, total: total, ref: pr.ref };
  }

  /**
   * Detecta los pentagramas de la zona enderezada: separación entre líneas (autocorrelación +
   * peine), candidatos por tira, enlace entre tiras y trayectoria ajustada de cada pentagrama.
   * Si los pentagramas encontrados muestran perspectiva (la pendiente o la separación cambian
   * con la altura), repite la detección con ese modelo para alcanzar los más lejanos.
   * Devuelve { pents:[...], d, ancho } o null.
   */
  function buscaPentagramas(J, R, dEsperada) {
    var W2 = R.W2, H2 = R.H2, i;
    var pend = pendientePorMitades(J, R);
    var ancho = CFG.tiraAncho;
    if (ancho > W2 / 4) ancho = Math.max(6, Math.floor(W2 / 4));
    var mod = { p0: pend.p0, p1: pend.p1, d0: 0, d1: 0, vc: H2 / 2 };
    var T = perfilesTiras(J, R, ancho, mod);
    // --- separación entre líneas: candidatas por autocorrelación, comprobadas con el peine
    var lmax = Math.min(Math.floor(H2 / 5), Math.ceil(CFG.dMax) + 2);
    if (lmax < 4) { deja(T.P); return null; }
    var ac = autocorrelacionTiras(T, H2, lmax);
    var picos = picosAutocorrelacion(ac, Math.floor(CFG.dMin), lmax, 4), probar = [];
    for (i = 0; i < picos.length; i++) if (picos[i].d >= CFG.dMin && picos[i].d <= CFG.dMax) probar.push(picos[i].d);
    if (dEsperada && dEsperada >= CFG.dMin && dEsperada <= CFG.dMax) {
      var cerca = false;
      for (i = 0; i < probar.length; i++) if (Math.abs(probar[i] - dEsperada) < 0.10 * dEsperada) cerca = true;
      if (!cerca) probar.push(dEsperada);
    }
    if (!probar.length) { deja(T.P); return null; }
    function totalDe(TT, dd) {
      var pr = peine(TT, H2, { d0: dd, d1: 0, vc: mod.vc }, false), tot = 0, sq = 0, kk;
      for (kk = 0; kk < pr.cands.length; kk++) { tot += pr.cands[kk].r * pr.cands[kk].q; sq += pr.cands[kk].q; }
      return { tot: tot, d: dd, n: pr.cands.length, q: pr.cands.length ? sq / pr.cands.length : 0 };
    }
    function total(dd) { return totalDe(T, dd); }
    var mejor = null, cur;
    for (i = 0; i < probar.length; i++) { cur = total(probar[i]); if (!mejor || cur.tot > mejor.tot) mejor = cur; }
    // si ninguna candidata convence (pocas tiras con pentagrama, o calidad baja) puede que otra
    // periodicidad —un mantel de rayas, baldosas— tape la de las líneas: barrido directo de d con el peine
    if (!mejor || mejor.n < CFG.barridoSiMenos * T.nt || mejor.q < 0.55) {
      var dd, T3 = { P: T.P, ok: T.ok, nt: T.nt, ancho: T.ancho, salto: 3 }, mejB = null;
      for (dd = CFG.dMin * 1.05; dd <= Math.min(CFG.dMax, lmax); dd *= 1.07) {
        cur = totalDe(T3, dd);
        if (!mejB || cur.tot > mejB.tot) mejB = cur;
      }
      if (mejB && (!mejor || mejB.tot * 3 > mejor.tot * 1.3)) { cur = total(mejB.d); if (!mejor || cur.tot > mejor.tot) mejor = cur; }
    }
    if (!mejor || !(mejor.tot > 0)) { deja(T.P); return null; }
    // afinar d alrededor de la mejor (±5 %); cada pentagrama afina luego la suya
    var base = mejor.d, facs = [0.95, 1.05], fi;
    for (fi = 0; fi < facs.length; fi++) { cur = total(base * facs[fi]); if (cur.tot > mejor.tot) mejor = cur; }
    mod.d0 = mejor.d;
    var det = detecta(T, H2, mod, ancho), vueltas = 0;
    if (!det.pents.length) { deja(T.P); return null; }
    // --- PERSPECTIVA: con ≥3 pentagramas, modelo lineal de pendiente y de d según la altura
    while (vueltas < 2 && det.pents.length >= 3) {
      var vs = [], ps = [], ds = [], ws = [], P = det.pents;
      for (i = 0; i < P.length; i++) { vs.push(P[i].vMed - mod.vc); ps.push(P[i].pendMed); ds.push(P[i].d); ws.push(P[i].n); }
      var cp = ajustaCurva(vs, ps, ws, 1), cd = ajustaCurva(vs, ds, ws, 1);
      var mod2 = { p0: cp[0], p1: cp[1], d0: cd[0], d1: cd[1], vc: mod.vc };
      // límites de cordura: que d no cambie más de ×2,5 entre los extremos de la zona
      var dArr = mod2.d0 - mod2.d1 * mod2.vc, dAba = mod2.d0 + mod2.d1 * (H2 - mod2.vc);
      if (!(dArr > CFG.dMin * 0.8) || !(dAba > CFG.dMin * 0.8) || Math.max(dArr, dAba) > 2.5 * Math.min(dArr, dAba)) break;
      var cambio = Math.abs(mod2.p1 - mod.p1) * H2 + Math.abs(mod2.p0 - mod.p0) + (Math.abs(mod2.d1 - mod.d1) * H2 + Math.abs(mod2.d0 - mod.d0)) / mod.d0;
      if (cambio < CFG.perspectivaMin) break;
      var T2 = perfilesTiras(J, R, ancho, mod2), det2 = detecta(T2, H2, mod2, ancho);
      vueltas++;
      if (det2.total > det.total * 1.02) { deja(T.P); det = det2; mod = mod2; T = T2; } else { deja(T2.P); break; }
    }
    deja(T.P);
    return { pents: det.pents, d: mod.d0, ancho: ancho, ref: det.ref, pend: mod.p0, modelo: mod, vueltas: vueltas };
  }

  /** Mejor d para el tramo [ua,ub] del pentagrama p: maximiza líneas - espacios. */
  function dLocal(J, R, p, ua, ub, d) {
    var facs = [0.90, 0.94, 0.97, 1.0, 1.03, 1.06, 1.10], mej = d, mv = -1e9, fi, u, k, s, dd, y, n = 0;
    var paso = Math.max(1, (ub - ua) / 40), puntuas = [];
    for (fi = 0; fi < facs.length; fi++) {
      dd = d * facs[fi]; s = 0;
      for (u = ua + paso / 2; u < ub; u += paso) {
        y = vDe(p, u);
        for (k = -2; k <= 2; k++) s += tintaEn(J, R, u, y + k * dd);
        for (k = -2; k < 2; k++) s -= 1.25 * tintaEn(J, R, u, y + (k + 0.5) * dd);
      }
      puntuas.push(s);
      if (s > mv) { mv = s; mej = dd; n = fi; }
    }
    if (n > 0 && n < facs.length - 1) {
      var q = parabola(puntuas[n - 1], puntuas[n], puntuas[n + 1]);
      mej = d * (facs[n] + q * (q > 0 ? facs[n + 1] - facs[n] : facs[n] - facs[n - 1]));
    }
    return mej;
  }

  /* =======================================================================
     PENTAGRAMA «ESTIRADO» (en unidades de d): extremos y tinta manuscrita
     ======================================================================= */
  var Q = 4;            // muestras por d (horizontal y vertical)

  /**
   * Muestrea el pentagrama p a lo largo de TODA la zona: columnas cada d/4 siguiendo su
   * trayectoria, filas cada d/4 alrededor de la 3ª línea (hasta ±zonaAltoD).
   * Las líneas quedan en las filas -8,-4,0,4,8; los espacios en -6,-2,2,6.
   */
  function muestrea(J, R, p) {
    var RN = Math.round(CFG.zonaAltoD * Q), paso = p.d / Q, nc = Math.max(8, Math.floor(R.W2 / paso)), nf = 2 * RN + 1;
    var T = toma(nc * nf, true), valido = new Uint8Array(nc), c, r, u, y, dl, x, yy, xi, yi, fx, fy, o, W2 = R.W2, mxX = W2 - 1.001, mxY = R.H2 - 1.001;
    for (c = 0; c < nc; c++) {
      u = (c + 0.5) * paso; y = vDe(p, u); dl = dEn(p, u) / Q;
      if (!dentro(R, u, y)) continue;
      valido[c] = 1;
      x = u - 0.5; if (x < 0) x = 0; else if (x > mxX) x = mxX;
      xi = x | 0; fx = x - xi;
      for (r = -RN; r <= RN; r++) {
        yy = y + r * dl - 0.5;
        if (yy < 0 || yy > mxY) continue;
        yi = yy | 0; fy = yy - yi; o = yi * W2 + xi;
        T[(r + RN) * nc + c] = (J[o] * (1 - fx) + J[o + 1] * fx) * (1 - fy) + (J[o + W2] * (1 - fx) + J[o + W2 + 1] * fx) * fy;
      }
    }
    return { T: T, nc: nc, nf: nf, RN: RN, valido: valido, paso: paso };
  }

  /**
   * Extremos reales de las líneas del pentagrama (columnas cIni, cFin del estirado).
   * Ventanas deslizantes de presenciaVentanaD: «hay pentagrama» si el percentil de la tinta en
   * las cinco filas de línea es alto (las líneas son continuas; la escritura no) y los espacios
   * no están igual de llenos (eso sería una textura: madera, tela…). Desde el tramo enlazado se
   * extiende hacia fuera saltando huecos de hasta presenciaPuenteD (un objeto encima).
   */
  function extremosDe(p, E) {
    var nc = E.nc, T = E.T, RN = E.RN, w = Math.max(6, Math.round(CFG.presenciaVentanaD * Q)), salto = 2, nW = Math.floor((nc - w) / salto) + 1;
    if (nW < 3) return false;
    var filasL = [-8, -4, 0, 4, 8], filasS = [-6, -2, 2, 6], filasF = [-12, 12], q = CFG.presenciaPercentil;
    var j, k, c, n, i, m, val, f0, fm, fp, buf = new Float32Array(w);
    // valor de cada fila de línea por columna (con ±1 fila de tolerancia)
    var VL = new Float32Array(5 * nc);
    for (k = 0; k < 5; k++) {
      f0 = (filasL[k] + RN) * nc; fm = f0 - nc; fp = f0 + nc;
      for (c = 0; c < nc; c++) { val = T[f0 + c]; if (T[fm + c] > val) val = T[fm + c]; if (T[fp + c] > val) val = T[fp + c]; VL[k * nc + c] = val; }
    }
    // --- tinta típica de las líneas: percentil exacto en unas cuantas ventanas del tramo enlazado
    var cA = Math.max(0, Math.floor(p.uA / E.paso)), cB = Math.min(nc, Math.ceil(p.uB / E.paso));
    var jA = Math.ceil(cA / salto), jB = Math.floor((cB - w) / salto);
    if (jB < jA) { jA = jB = Math.max(0, Math.min(nW - 1, Math.round(((cA + cB) / 2 - w / 2) / salto))); }
    if (jB > nW - 1) jB = nW - 1; if (jA < 0) jA = 0;
    var lista = [], pasoJ = Math.max(1, Math.floor((jB - jA + 1) / 12)), mn;
    for (j = jA; j <= jB; j += pasoJ) {
      mn = 1e9;
      for (k = 0; k < 5; k++) {
        n = 0;
        for (c = j * salto; c < j * salto + w; c++) if (E.valido[c]) buf[n++] = VL[k * nc + c];
        if (n < 0.7 * w) { mn = -1; break; }
        for (i = 1; i < n; i++) { val = buf[i]; for (m = i - 1; m >= 0 && buf[m] > val; m--) buf[m + 1] = buf[m]; buf[m + 1] = val; }
        val = buf[Math.floor(q * n)]; if (val < mn) mn = val;
      }
      if (mn >= 0) lista.push(mn);
    }
    if (lista.length < 1) return false;
    lista.sort(function (x, y) { return x - y; });
    var tip = lista[lista.length >> 1];
    if (!(tip > 0)) return false;
    // --- por conteo: «el percentil q de la fila supera el umbral» = «más del (1-q) de sus columnas lo supera».
    // Sumas acumuladas por fila: cuántas columnas válidas superan el umbral hasta cada columna.
    var thr = CFG.presenciaUmbral * tip, thrE = CFG.presenciaEspacio * tip;
    var acV = new Int32Array(nc + 1), acL = new Int32Array(5 * (nc + 1)), acS = new Int32Array(4 * (nc + 1)), acF = new Int32Array(2 * (nc + 1));
    for (c = 0; c < nc; c++) acV[c + 1] = acV[c] + (E.valido[c] ? 1 : 0);
    for (k = 0; k < 5; k++) { n = k * (nc + 1); for (c = 0; c < nc; c++) acL[n + c + 1] = acL[n + c] + ((E.valido[c] && VL[k * nc + c] >= thr) ? 1 : 0); }
    for (k = 0; k < 4; k++) { n = k * (nc + 1); f0 = (filasS[k] + RN) * nc; for (c = 0; c < nc; c++) acS[n + c + 1] = acS[n + c] + ((E.valido[c] && T[f0 + c] > thrE) ? 1 : 0); }
    for (k = 0; k < 2; k++) {
      n = k * (nc + 1); f0 = (filasF[k] + RN) * nc; fm = f0 - nc; fp = f0 + nc;
      for (c = 0; c < nc; c++) acF[n + c + 1] = acF[n + c] + ((E.valido[c] && (T[f0 + c] > thrE || T[fm + c] > thrE || T[fp + c] > thrE)) ? 1 : 0);
    }
    // estado de cada ventana: 2 = fuera de la foto, 1 = hay pentagrama, 0 = no
    var est = new Uint8Array(nW), c0, c1, nv, min1 = 1 - q, llenos;
    for (j = 0; j < nW; j++) {
      c0 = j * salto; c1 = c0 + w; nv = acV[c1] - acV[c0];
      if (nv < 0.7 * w) { est[j] = 2; continue; }
      val = 1;
      for (k = 0; k < 5 && val; k++) { n = k * (nc + 1); if (acL[n + c1] - acL[n + c0] < min1 * nv) val = 0; }   // las cinco líneas siguen
      if (val) {
        // si donde estaría una 6ª línea hay tinta seguida A LOS DOS LADOS, es papel rayado o una textura
        // (a un solo lado puede ser una barra de corcheas); y si además los cuatro espacios están llenos, un objeto
        llenos = 0;
        for (k = 0; k < 2; k++) { n = k * (nc + 1); if (acF[n + c1] - acF[n + c0] >= min1 * nv) llenos++; }
        if (llenos === 2) val = 0;
        if (val) {
          llenos = 0;
          for (k = 0; k < 4; k++) { n = k * (nc + 1); if (acS[n + c1] - acS[n + c0] >= min1 * nv) llenos++; }
          if (llenos === 4) val = 0;
        }
      }
      est[j] = val;
    }
    var puente = Math.round(CFG.presenciaPuenteD * Q / salto), reanuda = Math.round(CFG.presenciaReanudaD * Q / salto);
    // tras un hueco solo se sigue si las líneas vuelven «de verdad» (no un trazo suelto ni otra hoja)
    function vuelve(jj, sentido) {
      var cuenta = 0, total = 0, x;
      for (x = jj; total < reanuda && x >= 0 && x < nW; x += sentido) { if (est[x] === 2) break; total++; if (est[x] === 1) cuenta++; }
      return total >= reanuda * 0.6 && cuenta >= 0.7 * total;
    }
    var ini = jA, fin = jB, falt = 0, cortI = false, cortF = false;
    // «cortado» = las líneas llegan hasta el borde (de la foto o de la zona) sin haberse acabado antes:
    // si ya había al menos 1 d sin líneas cuando se llega al borde, el pentagrama terminó ahí
    for (j = jA - 1; ; j--) {
      if (j < 0 || est[j] === 2) { cortI = falt < 2; break; }
      if (est[j] === 1) { if (falt >= 2 && !vuelve(j, -1)) break; ini = j; falt = 0; } else if (++falt > puente) break;
    }
    falt = 0;
    for (j = jB + 1; ; j++) {
      if (j > nW - 1 || est[j] === 2) { cortF = falt < 2; break; }
      if (est[j] === 1) { if (falt >= 2 && !vuelve(j, 1)) break; fin = j; falt = 0; } else if (++falt > puente) break;
    }
    // una ventana pasa cuando al menos el (1-q) de sus columnas tiene línea: de ahí el ajuste fino
    var cIni = Math.round(ini * salto + q * w - salto / 2), cFin = Math.round(fin * salto + (1 - q) * w + salto / 2);
    // si la extensión llegó al borde con ventanas buenas, el extremo es el propio borde
    if (cortI && ini <= 1) cIni = ini * salto;
    if (cortF && fin >= nW - 2) cFin = Math.min(nc, fin * salto + w);
    while (cIni < nc - 1 && !E.valido[cIni]) cIni++;
    while (cFin > 1 && !E.valido[cFin - 1]) cFin--;
    // ... o si el extremo queda a menos de cortadoD del borde de la FOTO
    var lim = Math.round(CFG.cortadoD * Q);
    p.cortadoIni = cortI || (cIni - lim >= 0 && !E.valido[cIni - lim]) || (cIni - lim < 0 && !E.valido[0]);
    p.cortadoFin = cortF || (cFin + lim < nc && !E.valido[cFin + lim]) || (cFin + lim >= nc && !E.valido[nc - 1]);
    // ... o si, con el borde de la foto cerca, las líneas siguen hasta él aunque el tramo no pasara
    // la prueba de presencia (las tapa una clave impresa, una sombra, un objeto): tampoco es el final
    function sigueHastaElBorde(desde, sentido) {
      var tope = Math.round(CFG.cortadoLejosD * Q), cc, nn = 0, con = 0, kk, cuantas;
      for (cc = desde; nn < tope; cc += sentido) {
        if (cc < 0 || cc >= nc || !E.valido[cc]) return nn >= Q && con >= 0.5 * nn;      // llegó al borde
        cuantas = 0;
        for (kk = 0; kk < 5; kk++) if (VL[kk * nc + cc] >= thr) cuantas++;
        nn++; if (cuantas >= 3) con++;
      }
      return false;                                         // el borde queda lejos: es un final de verdad
    }
    if (!p.cortadoIni && sigueHastaElBorde(cIni - 1, -1)) p.cortadoIni = true;
    if (!p.cortadoFin && sigueHastaElBorde(cFin, 1)) p.cortadoFin = true;
    E.cIni = cIni; E.cFin = cFin; p.tintaLinea = tip;
    return cFin - cIni >= CFG.pentMinLargoD * Q;
  }

  /**
   * Comprueba, por bloques de 2 d a lo largo de todo el estirado, a qué altura caen de verdad las
   * cinco líneas (desplazamiento que maximiza líneas - espacios). Si en algún tramo se apartan de
   * la trayectoria más de un cuarto de d, reajusta la curva con esos puntos y devuelve true.
   */
  function reajustaTrayectoria(p, E) {
    var nc = E.nc, T = E.T, RN = E.RN, B = 2 * Q, nb = Math.floor(nc / B), D = 4, us = [], vs = [], ws = [], b, c, k, dl, s, mej, mv, n, maxDesv = 0;
    var fila = new Float32Array(2 * RN + 1), r, puntos = [];
    for (b = 0; b < nb; b++) {
      n = 0;
      for (r = 0; r <= 2 * RN; r++) fila[r] = 0;
      for (c = b * B; c < (b + 1) * B; c++) { if (!E.valido[c]) continue; n++; for (r = 0; r <= 2 * RN; r++) fila[r] += T[r * nc + c]; }
      if (n < B / 2) continue;
      mej = 0; mv = -1e9;
      for (dl = -D; dl <= D; dl++) {
        s = 0;
        for (k = -2; k <= 2; k++) s += fila[RN + 4 * k + dl];
        for (k = -2; k < 2; k++) s -= 1.25 * fila[RN + 4 * k + 2 + dl];
        s -= 0.5 * (fila[RN - 12 + dl] + fila[RN + 12 + dl]);
        if (s > mv) { mv = s; mej = dl; }
      }
      if (mv > 0) puntos.push({ c: (b + 0.5) * B, dl: mej, w: mv / n });
    }
    if (puntos.length < 6) return false;
    // solo los bloques con respuesta decente (donde de verdad hay pentagrama)
    var orden = puntos.map(function (q) { return q.w; }).sort(function (x, y) { return x - y; }), medW = orden[orden.length >> 1];
    for (k = 0; k < puntos.length; k++) {
      if (puntos[k].w < 0.4 * medW) continue;
      var u = puntos[k].c * E.paso;
      us.push(u); vs.push(vDe(p, u) + puntos[k].dl * dEn(p, u) / Q); ws.push(puntos[k].w);
      if (Math.abs(puntos[k].dl) > maxDesv) maxDesv = Math.abs(puntos[k].dl);
    }
    if (us.length < 6 || maxDesv < 2) return false;           // todo dentro de ±1/4 d: está bien
    p.coef = ajustaCurva(us, vs, ws, 2);
    p.reajustado = true;
    return true;
  }

  /** Recta robusta u = a + b·v que pasa por los extremos de la mayoría de los pentagramas
   *  (las líneas impresas de una hoja empiezan y acaban alineadas). */
  function consensoExtremos(pents, cual, tol) {
    var pts = [], i, j, k, p, u, v;
    for (i = 0; i < pents.length; i++) {
      p = pents[i];
      if (cual === 'ini' ? p.cortadoIni : p.cortadoFin) continue;
      u = cual === 'ini' ? p.uIni : p.uFin;
      pts.push({ u: u, v: vDe(p, u), i: i });
    }
    if (pts.length < 3) return null;
    var mej = null, a, b, n;
    for (i = 0; i < pts.length; i++) for (j = i + 1; j < pts.length; j++) {
      if (Math.abs(pts[j].v - pts[i].v) < 1e-6) continue;
      b = (pts[j].u - pts[i].u) / (pts[j].v - pts[i].v);
      if (Math.abs(b) > 0.6) continue;                       // los márgenes son casi perpendiculares a las líneas
      a = pts[i].u - b * pts[i].v; n = 0;
      for (k = 0; k < pts.length; k++) if (Math.abs(pts[k].u - a - b * pts[k].v) <= tol) n++;
      if (!mej || n > mej.n) mej = { a: a, b: b, n: n };
    }
    if (!mej || mej.n < Math.max(3, Math.ceil(0.5 * pts.length))) return null;
    // reajuste por mínimos cuadrados con los que están de acuerdo
    var us = [], vs = [];
    for (k = 0; k < pts.length; k++) if (Math.abs(pts[k].u - mej.a - mej.b * pts[k].v) <= tol) { us.push(pts[k].v); vs.push(pts[k].u); }
    var cf = ajustaCurva(us, vs, null, 1);
    return { a: cf[0], b: cf[1], n: mej.n };
  }

  /**
   * Afina cada pentagrama: separación d propia (izquierda/derecha, por la perspectiva),
   * estirado, extremos reales de las líneas y si están cortados por el borde de la foto.
   * Quita duplicados y alinea los extremos discordantes con el margen común de la hoja.
   */
  function afinaPentagramas(J, R, res) {
    var pents = res.pents, d = res.d, i, k, W2 = R.W2, buenos = [], p;
    // primero, quitar trayectorias duplicadas (dos cadenas del mismo pentagrama)
    pents.sort(function (a, c) { return (c.n * c.calidad) - (a.n * a.calidad); });
    var unicos = [];
    for (i = 0; i < pents.length; i++) {
      var dup = false;
      for (k = 0; k < unicos.length; k++) {
        var uc = ((pents[i].uA + pents[i].uB) / 2 + (unicos[k].uA + unicos[k].uB) / 2) / 2;
        if (Math.abs(vDe(pents[i], uc) - vDe(unicos[k], uc)) < 3.2 * d) { dup = true; break; }
      }
      if (!dup) unicos.push(pents[i]);
    }
    for (i = 0; i < unicos.length; i++) {
      p = unicos[i];
      var um = (p.uA + p.uB) / 2, dI = dLocal(J, R, p, p.uA, um, p.d), dD = dLocal(J, R, p, um, p.uB, p.d);
      p.dI = dI; p.dD = dD; p.uI = (p.uA + um) / 2; p.uD = (um + p.uB) / 2;
      p.d = (dI + dD) / 2;
      p.E = muestrea(J, R, p);
      if (!extremosDe(p, p.E)) { deja(p.E.T); p.E = null; continue; }
      // si la trayectoria ajustada se desvía de las líneas en algún tramo (el ajuste salió de pocas
      // tiras y se extrapoló), se corrige con el propio estirado y se vuelve a medir
      if (reajustaTrayectoria(p, p.E)) {
        deja(p.E.T);
        p.E = muestrea(J, R, p);
        if (!extremosDe(p, p.E)) { deja(p.E.T); p.E = null; continue; }
      }
      p.uIni = p.E.cIni * p.E.paso; p.uFin = p.E.cFin * p.E.paso;
      buenos.push(p);
    }
    // márgenes comunes: los extremos que se salen de la recta de la mayoría se llevan a ella
    var lados = ['ini', 'fin'], l, tol = CFG.margenTolD * d;
    for (l = 0; l < 2 && buenos.length >= 3; l++) {
      var cs = consensoExtremos(buenos, lados[l], tol);
      if (!cs) continue;
      for (i = 0; i < buenos.length; i++) {
        p = buenos[i];
        var uAct = lados[l] === 'ini' ? p.uIni : p.uFin, uNue = cs.a + cs.b * vDe(p, uAct);
        uNue = cs.a + cs.b * vDe(p, uNue);
        if (Math.abs(uNue - uAct) <= tol) continue;
        var cort = lados[l] === 'ini' ? p.cortadoIni : p.cortadoFin;
        // un extremo «cortado» solo se corrige hacia dentro (el margen común cae antes del corte)
        if (cort && (lados[l] === 'ini' ? uNue < uAct : uNue > uAct)) continue;
        if (!dentro(R, uNue, vDe(p, uNue))) continue;
        var cN = Math.max(0, Math.min(p.E.nc, Math.round(uNue / p.E.paso)));
        if (lados[l] === 'ini') { p.uIni = uNue; p.E.cIni = cN; p.cortadoIni = false; } else { p.uFin = uNue; p.E.cFin = cN; p.cortadoFin = false; }
        p.alineado = true;
      }
    }
    var fin2 = [];
    for (i = 0; i < buenos.length; i++) {
      p = buenos[i]; p.largo = p.uFin - p.uIni;
      if (p.largo >= CFG.pentMinLargoD * p.d && p.E.cFin - p.E.cIni >= 8) fin2.push(p);
      else { deja(p.E.T); p.E = null; }
    }
    fin2.sort(function (a, c) { var u0 = W2 / 2; return vDe(a, u0) - vDe(c, u0); });
    res.pents = fin2;
    return res;
  }

  /**
   * Resta la línea impresa en el estirado de p: mediana deslizante a lo largo del pentagrama
   * (lo largo y constante es línea; lo corto es escritura). Deja el RESIDUO en E.M (sin umbral)
   * y devuelve el nivel de «grano» (percentil 80 del residuo en las filas de los espacios).
   */
  function restaLineas(p, arribaD, abajoD) {
    var E = p.E, nc = E.nc, nf = E.nf, RN = E.RN, T = E.T, valido = E.valido, cIni = E.cIni, cFin = E.cFin;
    var rArr = Math.min(RN, Math.max(2 * Q + 2, Math.round(arribaD * Q))), rAba = Math.min(RN, Math.max(2 * Q + 2, Math.round(abajoD * Q)));
    var M = toma(nc * nf, true), NB = 100, hist = new Int32Array(NB), semi = Math.round(CFG.lineaVentanaD * Q / 2), bin = new Uint8Array(nc);
    var r, c, fila, v, n, k, acum, med, a, b, i, fac = CFG.lineaFactor, na, nb2, grano = [], esEspacio, rr;
    for (r = -rArr; r <= rAba; r++) {
      fila = (r + RN) * nc;
      for (c = cIni; c < cFin; c++) { v = (T[fila + c] * NB) | 0; bin[c] = v >= NB ? NB - 1 : v; }
      for (k = 0; k < NB; k++) hist[k] = 0;
      n = 0; a = cIni; b = cIni - 1;
      rr = r < 0 ? -r : r; esEspacio = (rr % 4 === 2) || rr > 9;
      for (c = cIni; c < cFin; c++) {
        na = c - semi < cIni ? cIni : c - semi; nb2 = c + semi > cFin - 1 ? cFin - 1 : c + semi;
        while (b < nb2) { b++; if (valido[b]) { hist[bin[b]]++; n++; } }
        while (a < na) { if (valido[a]) { hist[bin[a]]--; n--; } a++; }
        if (!valido[c]) continue;
        med = 0;
        if (n > 4) { acum = 0; i = n >> 1; for (k = 0; k < NB; k++) { acum += hist[k]; if (acum > i) break; } med = k === 0 ? 0 : (k + 1) / NB; }
        v = T[fila + c] - fac * med;
        M[fila + c] = v;
        if (esEspacio && (c & 3) === 0) grano.push(v > 0 ? v : 0);
      }
      // fuera de las líneas impresas (más allá de los extremos) no hay línea que restar
      for (c = 0; c < cIni; c++) if (valido[c]) M[fila + c] = T[fila + c];
      for (c = cFin; c < nc; c++) if (valido[c]) M[fila + c] = T[fila + c];
    }
    E.M = M; E.rArr = rArr; E.rAba = rAba;
    if (grano.length < 20) return 0;
    grano.sort(function (x, y) { return x - y; });
    return grano[Math.floor(grano.length * 0.8)];
  }

  /** Aplica el suelo de tinta al residuo, borra los restos horizontales largos y suma las masas. */
  function tintaManuscrita(p, suelo) {
    var E = p.E, nc = E.nc, nf = E.nf, RN = E.RN, M = E.M, cIni = E.cIni, cFin = E.cFin, rArr = E.rArr, rAba = E.rAba;
    var largoMax = Math.round(CFG.lineaLargoMaxD * Q), r, c, fila, v, ini, hueco, b, k;
    for (r = -rArr; r <= rAba; r++) {
      fila = (r + RN) * nc;
      for (c = 0; c < nc; c++) { v = M[fila + c] - suelo; M[fila + c] = v > 0 ? v : 0; }
      // un tramo horizontal muy largo en una misma fila es resto de línea impresa (o el canto de un
      // lápiz, una regla…): ninguna nota hace una raya horizontal de más de lineaLargoMaxD
      ini = -1; hueco = 0;
      for (c = cIni; c <= cFin; c++) {
        if (c < cFin && M[fila + c] > 0) { if (ini < 0) ini = c; hueco = 0; }
        else if (ini >= 0) {
          hueco++;
          if (hueco > 1 || c === cFin) { b = c - hueco; if (b - ini + 1 > largoMax) for (k = ini; k <= b; k++) M[fila + k] = 0; ini = -1; hueco = 0; }
        }
      }
    }
    // masas por columna: banda (entre la 1ª y la 5ª línea ± medio d), encima y debajo
    var mB = new Float32Array(nc), mU = new Float32Array(nc), mD = new Float32Array(nc), lim = 2 * Q + 2;
    for (r = -rArr; r <= rAba; r++) {
      fila = (r + RN) * nc;
      if (r < -lim) for (c = 0; c < nc; c++) mU[c] += M[fila + c];
      else if (r > lim) for (c = 0; c < nc; c++) mD[c] += M[fila + c];
      else for (c = 0; c < nc; c++) mB[c] += M[fila + c];
    }
    var masaFila = new Float32Array(nf);
    for (r = -rArr; r <= rAba; r++) { fila = (r + RN) * nc; v = 0; for (c = cIni; c < cFin; c++) v += M[fila + c]; masaFila[r + RN] = v / Math.max(1, cFin - cIni); }
    E.mB = mB; E.mU = mU; E.mD = mD; E.masaFila = masaFila;
  }

  /* =======================================================================
     ANÁLISIS COMPLETO DE UNA DIRECCIÓN CANDIDATA
     ======================================================================= */
  /** Devuelve al banco la memoria de una pasada o de una dirección descartada. */
  function sueltaCandidata(m) {
    if (!m) return;
    var i;
    if (m.R) deja(m.R.img);
    deja(m.J);
    for (i = 0; m.pents && i < m.pents.length; i++) if (m.pents[i].E) { deja(m.pents[i].E.T); deja(m.pents[i].E.M); }
  }

  function analizaDireccion(ctx, ang, depura, maxPix) {
    var zona = zonaPentagramas(ctx.L1, ctx.wa, ctx.ha, ang, ctx.fondo1);
    if (!zona) return null;
    // el ángulo se afina con la tinta de la propia zona; si cambia, la zona se vuelve a sacar con él
    if (CFG.zonaAbanico > 0) {
      var ang2 = afinaEnZona(ctx.L1, zona, ang, Math.hypot(ctx.wa, ctx.ha) / 2), dif = Math.abs(ang2 - ang);
      if (dif > PI / 2) dif = PI - dif;
      if (dif > 0.3 * PI / 180) {
        var zona2 = zonaPentagramas(ctx.L1, ctx.wa, ctx.ha, ang2, ctx.fondo1);
        if (zona2) { zona = zona2; ang = ang2; }
      }
    }
    var fa = ctx.fa;
    // zona en px de ENTRADA (centrados)
    var z = { u0: zona.u0 * fa, u1: zona.u1 * fa, v0: zona.v0 * fa, v1: zona.v1 * fa };
    // recortarla a lo que de verdad cae dentro de la foto (caja de la foto girada)
    var c = Math.cos(ang), s = Math.sin(ang), hw = ctx.W / 2, hh = ctx.H / 2;
    var eu = Math.abs(hw * c) + Math.abs(hh * s), ev = Math.abs(hw * s) + Math.abs(hh * c);
    if (z.u0 < -eu) z.u0 = -eu; if (z.u1 > eu) z.u1 = eu; if (z.v0 < -ev) z.v0 = -ev; if (z.v1 > ev) z.v1 = ev;
    if (z.u1 - z.u0 < 24 || z.v1 - z.v0 < 24) return null;
    // escala de la fase 2: primero la máxima resolución que cabe en el presupuesto. Se repite
    // (como mucho dos veces más) si la separación entre líneas sale muy grande —se reduce a
    // d ≈ dCanon— o si los pentagramas son pequeños y ocupan mucho menos que la zona —mesa con
    // vetas, hoja pequeña: se recorta y se mira más de cerca—. Se queda con la mejor pasada.
    var presupuesto = maxPix || CFG.maxPixFase2;
    var area = (z.u1 - z.u0) * (z.v1 - z.v0), s2 = Math.min(1, Math.sqrt(presupuesto / area));
    var R = null, J = null, res = null, k = 0, pasada, dEsp = 0, i, j, p, mt, recortada = false, pasadas = 0, mejor = null, punt;
    for (pasada = 0; pasada < 3; pasada++) {
      R = endereza(ctx, ang, z, s2);
      k = Math.round(CFG.ventanaTintaD * (dEsp || 5.5)); if (k % 2 === 0) k++;
      k = Math.max(CFG.ventanaTintaMin, Math.min(CFG.ventanaTintaMax, k));
      mt = mapaTinta(R.img, R.W2, R.H2, k); J = mt.tinta;
      for (j = 0; j < R.H2; j++) {                          // fuera de la foto no hay tinta
        p = j * R.W2;
        for (i = 0; i < Math.min(R.W2, R.izq[j] + 1); i++) J[p + i] = 0;
        for (i = Math.max(0, R.der[j]); i < R.W2; i++) J[p + i] = 0;
      }
      pasadas++;
      res = buscaPentagramas(J, R, dEsp);
      if (!res) {
        if (!mejor) mejor = { R: R, J: J, pents: [], puntuacion: 0, d: 0, ventana: k }; else sueltaCandidata({ R: R, J: J });
        break;
      }
      afinaPentagramas(J, R, res);
      punt = 0;
      for (i = 0; i < res.pents.length; i++) punt += (res.pents[i].largo / res.pents[i].d) * pesoCalidad(res.pents[i].calidad);
      if (!mejor || punt >= mejor.puntuacion * 0.9) { sueltaCandidata(mejor); mejor = { R: R, J: J, pents: res.pents, puntuacion: punt, d: res.d, ventana: k, pend: res.pend }; }
      else { sueltaCandidata({ R: R, J: J, pents: res.pents }); break; }   // la pasada nueva salió peor: vale la anterior
      if (!res.pents.length || pasada === 2) break;
      // caja de los pentagramas encontrados (px de la zona). Margen generoso por arriba y por
      // abajo —dos pentagramas y medio— por si quedó alguno sin detectar (los escritos son los difíciles)
      var b0 = 1e9, b1 = -1e9, c0 = 1e9, c1 = -1e9, pp, va, vb, mgU = 9 * res.d, mgV = 8 * res.d, centros = [];
      for (i = 0; i < res.pents.length; i++) {
        pp = res.pents[i]; va = vDe(pp, pp.uIni); vb = vDe(pp, pp.uFin); centros.push((va + vb) / 2);
        if (pp.uIni < b0) b0 = pp.uIni; if (pp.uFin > b1) b1 = pp.uFin;
        if (Math.min(va, vb) < c0) c0 = Math.min(va, vb); if (Math.max(va, vb) > c1) c1 = Math.max(va, vb);
      }
      if (centros.length >= 2) {
        var difs = [];
        for (i = 1; i < centros.length; i++) difs.push(Math.abs(centros[i] - centros[i - 1]));
        difs.sort(function (x, y) { return x - y; });
        mgV = Math.max(mgV, 2.5 * difs[difs.length >> 1]);
      } else mgV = 30 * res.d;
      b0 = Math.max(0, b0 - mgU); b1 = Math.min(R.W2, b1 + mgU); c0 = Math.max(0, c0 - mgV); c1 = Math.min(R.H2, c1 + mgV);
      var areaCaja = (b1 - b0) * (c1 - c0) / (s2 * s2);      // en px de entrada
      var s2Nueva = Math.min(1, Math.sqrt(presupuesto / areaCaja), s2 * CFG.dCanon / res.d);
      var grande = res.d > CFG.repiteGrande * CFG.dCanon;
      var apretar = !recortada && res.d < CFG.repitePequeno && s2Nueva > 1.25 * s2 && areaCaja < 0.6 * area;
      if (!grande && !apretar) break;
      if (areaCaja < 0.8 * area) {
        z = { u0: z.u0 + b0 / s2, u1: z.u0 + b1 / s2, v0: z.v0 + c0 / s2, v1: z.v0 + c1 / s2 };
        recortada = true;
      } else if (grande) {
        // pentagramas grandes: el margen de la zona (pensado en px) se queda corto en d; se amplía
        var dEnt = res.d / s2;
        z = { u0: Math.max(-eu, z.u0 - 7 * dEnt), u1: Math.min(eu, z.u1 + 7 * dEnt), v0: Math.max(-ev, z.v0 - 6 * dEnt), v1: Math.min(ev, z.v1 + 6 * dEnt) };
      }
      area = (z.u1 - z.u0) * (z.v1 - z.v0);
      s2Nueva = Math.min(1, Math.sqrt(presupuesto / area), s2 * CFG.dCanon / res.d);
      dEsp = res.d * s2Nueva / s2; s2 = s2Nueva;
    }
    if (!(mejor.pents.length || depura)) { deja(mejor.J); mejor.J = null; }
    return { ang: ang, zona: zona, R: mejor.R, J: mejor.J, pents: mejor.pents, puntuacion: mejor.puntuacion,
      d: mejor.d, ventana: mejor.ventana, pend: mejor.pend, pasadas: pasadas, escalaIni: Math.min(1, Math.sqrt(presupuesto / ((zona.u1 - zona.u0) * (zona.v1 - zona.v0) * fa * fa))) };
  }

  /* =======================================================================
     PISTAS DE ARRIBA/ABAJO, CAJA Y RESULTADO
     ======================================================================= */
  function sigmoide(z) { return 1 / (1 + Math.exp(-z)); }

  function percentilDe(a, q) {
    if (!a.length) return 0;
    var b = Array.prototype.slice.call(a).sort(function (x, y) { return x - y; });
    return b[Math.min(b.length - 1, Math.floor(q * b.length))];
  }

  /**
   * CLAVE DE SOL en un tramo [ca, cb) del pentagrama estirado. Es un trazo que, en una ventana
   * estrecha (claveAnchoD), tiene tinta
   *   · en los cuatro espacios,
   *   · por ENCIMA de la 1ª línea y por DEBAJO de la 5ª, de 0,75 d para fuera (una barra de
   *     compás hecha a mano se pasa medio d; la clave, más),
   *   · pero NO sigue hasta el pentagrama de al lado (la llave o la barra que une los dos
   *     pentagramas de un sistema sí siguen: tienen tinta también «lejos»),
   *   · y tiene «panza»: en los dos espacios de abajo la tinta ocupa al menos clavePanzaD de
   *     ancho (la espiral de la clave); una doble barra final es más estrecha.
   * Una nota con su plica no llega a tanto (unos 3,5 d de alto). Devuelve 0..1 (0 = no hay clave
   * o no se puede saber: sin sitio para mirar por fuera, pentagramas muy juntos).
   */
  var ZONAS_CLAVE = [[-15, -11], [-7, -5], [-3, -1], [1, 3], [5, 7], [11, 15]];   // filas (d/4) respecto a la 3ª línea
  function claveEn(E, ca, cb, ref) {
    var nc = E.nc, RN = E.RN, M = E.M, w = Math.max(3, Math.round(CFG.claveAnchoD * Q)), k, j, r, v, mn, mej = 0, m, c;
    var la = Math.min(E.rArr, 19), lb = Math.min(E.rAba, 19);
    if (la < 17 || lb < 17) return 0;                       // sin sitio para ver si sobresale y si sigue de largo
    var margen = 2 * Q;                                     // columnas de más a cada lado, para medir la panza
    var c0 = ca - margen, c1 = cb + margen;
    if (c0 < 0) c0 = 0; if (c1 > nc) c1 = nc; if (ca < 0) ca = 0; if (cb > nc) cb = nc;
    m = c1 - c0; if (cb - ca < w) return 0;
    // sumas acumuladas por columna: 6 zonas, lejos-arriba, lejos-abajo; y la panza sin acumular
    var pre = tmp('clave', 8 * (m + 1)), panza = tmp('clavep', m), o, fila, r0, r1;
    for (k = 0; k < 8; k++) {
      o = k * (m + 1); pre[o] = 0;
      if (k < 6) { r0 = ZONAS_CLAVE[k][0]; r1 = ZONAS_CLAVE[k][1]; } else if (k === 6) { r0 = -la; r1 = -la + 1; } else { r0 = lb - 1; r1 = lb; }
      for (j = 0; j < m; j++) {
        v = 0;
        if (E.valido[c0 + j]) for (r = r0; r <= r1; r++) { fila = (r + RN) * nc; v += M[fila + c0 + j]; }
        pre[o + j + 1] = pre[o + j] + v;
      }
    }
    for (j = 0; j < m; j++) panza[j] = (pre[3 * (m + 1) + j + 1] - pre[3 * (m + 1) + j]) + (pre[4 * (m + 1) + j + 1] - pre[4 * (m + 1) + j]);
    var umbralLejos = CFG.claveLejos * CFG.claveMasa * ref, umbralPanza = 0.04 * ref, anchoMin = Math.round(CFG.clavePanzaD * Q);
    var ja = ca - c0, jb = cb - c0, run, hueco, a2, b2, ini, mejorRun;
    for (j = ja; j + w <= jb; j++) {
      mn = 1e9;
      for (k = 0; k < 6; k++) { o = k * (m + 1); v = pre[o + j + w] - pre[o + j]; if (v < mn) mn = v; }
      if (mn <= mej) continue;
      // ¿sigue hacia el otro pentagrama? -> llave o barra del sistema
      if (Math.max(pre[6 * (m + 1) + j + w] - pre[6 * (m + 1) + j], pre[7 * (m + 1) + j + w] - pre[7 * (m + 1) + j]) > umbralLejos) continue;
      // panza: tramo seguido más largo con tinta en los espacios de abajo que toca la ventana (se salta 1 columna)
      a2 = j - margen < 0 ? 0 : j - margen; b2 = j + w + margen > m ? m : j + w + margen; ini = -1; hueco = 0; mejorRun = 0;
      for (c = a2; c <= b2; c++) {
        if (c < b2 && panza[c] > umbralPanza) { if (ini < 0) ini = c; hueco = 0; }
        else if (ini >= 0) {
          hueco++;
          if (hueco > 1 || c === b2) { run = c - hueco + 1 - ini; if (ini < j + w && c - hueco >= j && run > mejorRun) mejorRun = run; ini = -1; hueco = 0; }
        }
      }
      if (mejorRun < anchoMin) continue;
      mej = mn;
    }
    v = mej / (CFG.claveMasa * ref);
    return v > 1 ? 1 : v;
  }

  /**
   * Mide en cada pentagrama su tinta manuscrita y calcula las pistas.
   * Todo se expresa como si la zona enderezada estuviera «de pie» (lectura hacia +u);
   * cada pista es positiva si apoya eso y negativa si apoya que está del revés.
   */
  function midePistas(D) {
    var J = D.J, R = D.R, pents = D.pents, n = pents.length, i, c, p, e, k;
    var P = { nPent: n, nEscritos: 0, masaRef: 0, clave: 0, extremo: 0, alto: 0, hueco: 0, vacios: 0, titulo: 0, pareja: 0, perspectiva: 0, detalle: [] };
    if (!n) return P;
    var uc = R.W2 / 2;
    // --- restar las líneas impresas de cada pentagrama (zona propia: hasta medio camino del vecino)
    var granos = [];
    for (i = 0; i < n; i++) {
      p = pents[i];
      var arr = CFG.zonaAltoD, aba = CFG.zonaAltoD, um = (p.uIni + p.uFin) / 2;
      if (i > 0) arr = Math.min(arr, (vDe(p, um) - vDe(pents[i - 1], um)) / (2 * p.d));
      if (i < n - 1) aba = Math.min(aba, (vDe(pents[i + 1], um) - vDe(p, um)) / (2 * p.d));
      p.arribaD = arr; p.abajoD = aba;
      granos.push(restaLineas(p, arr, aba));
    }
    // --- suelo de tinta adaptado al grano de la foto (papel rugoso, ruido, JPEG)
    var suelo = Math.max(CFG.tintaSuelo, CFG.sueloGrano * percentilDe(granos, 0.5));
    P.suelo = suelo;
    for (i = 0; i < n; i++) tintaManuscrita(pents[i], suelo);
    // --- masa de cada columna y niveles de referencia de la foto
    //   ruido = lo que hay donde no hay nada (percentil 30 del pentagrama más limpio)
    //   ref   = masa de una columna «con trazo» (percentil 70 de las columnas con tinta; mediana entre pentagramas)
    var ruido = 1e9, ref = 0, lista, suma, conTinta, refs = [], pesoTotal = 0, densMax = 0, todo, mm;
    for (i = 0; i < n; i++) {
      p = pents[i]; e = p.E;
      var col = new Float32Array(e.nc);
      for (c = 0; c < e.nc; c++) col[c] = e.mB[c] + e.mU[c] + e.mD[c];
      e.col = col;
      lista = []; conTinta = []; todo = 0; mm = 0;
      for (c = e.cIni; c < e.cFin; c++) if (e.valido[c]) { lista.push(col[c]); todo += col[c]; mm++; if (col[c] >= CFG.columnaAbs) conTinta.push(col[c]); }
      p.densidad = mm ? todo / mm : 0;                       // masa media por columna
      if (p.densidad > densMax) densMax = p.densidad;
      p.refPropia = 0; p.nTinta = conTinta.length;
      if (lista.length < 8) continue;
      lista.sort(function (x, y) { return x - y; });
      p.p30 = lista[Math.floor(lista.length * 0.3)];
      if (p.p30 < ruido) ruido = p.p30;
      if (conTinta.length >= 12) { conTinta.sort(function (x, y) { return x - y; }); p.refPropia = conTinta[Math.floor(conTinta.length * 0.7)]; }
    }
    // la referencia sale de los pentagramas con tinta «de verdad» (densidad comparable al más escrito):
    // mediana ponderada por nº de columnas con tinta (un objeto que cruza tiene pocas columnas, muy negras)
    for (i = 0; i < n; i++) {
      p = pents[i];
      if (p.refPropia > 0 && p.densidad >= CFG.escritoDensRel * densMax) { refs.push({ r: p.refPropia, w: p.nTinta }); pesoTotal += p.nTinta; }
    }
    refs.sort(function (x, y) { return x.r - y.r; });
    for (i = 0, suma = 0; i < refs.length; i++) { suma += refs[i].w; if (suma >= 0.5 * pesoTotal) { ref = refs[i].r; break; } }
    if (ruido > 1e8) ruido = 0;
    var thrC = Math.max(CFG.columnaAbs, CFG.columnaUmbral * ref, 3 * ruido + 0.03), refU = ref > CFG.columnaAbs ? ref : 1;
    P.masaRef = ref; P.ruido = ruido; P.umbralColumna = thrC;
    // --- tramos de 1 d con tinta, pentagrama «escrito» y extensión sostenida de lo escrito
    var maxTramos = 0, nEsc = 0, semiS = Math.floor(CFG.sostenidoD / 2);
    for (i = 0; i < n; i++) {
      p = pents[i]; e = p.E;
      var nt = Math.max(1, Math.floor((e.cFin - e.cIni) / Q)), tr = new Uint8Array(nt), b2, cuenta = 0, mx, s2, m2, k2;
      for (b2 = 0; b2 < nt; b2++) {
        mx = 0;
        for (c = e.cIni + b2 * Q; c < e.cIni + (b2 + 1) * Q; c++) if (e.col[c] > mx) mx = e.col[c];
        if (mx >= thrC) { tr[b2] = 1; cuenta++; }
      }
      p.tramos = cuenta; p.nTramos = nt; if (cuenta > maxTramos) maxTramos = cuenta;
      var t0 = -1, t1 = -1;
      for (b2 = 0; b2 < nt; b2++) {
        if (!tr[b2]) continue;
        s2 = 0; m2 = 0;
        for (k2 = b2 - semiS; k2 <= b2 + semiS; k2++) if (k2 >= 0 && k2 < nt) { s2 += tr[k2]; m2++; }
        if (s2 / Math.max(m2, CFG.sostenidoD - 1) >= CFG.sostenidoMin) { if (t0 < 0) t0 = b2; t1 = b2; }
      }
      p.t0 = t0; p.t1 = t1;
      p.tintaIni = t0 < 0 ? null : (e.cIni + t0 * Q) * e.paso; p.tintaFin = t1 < 0 ? null : (e.cIni + (t1 + 1) * Q) * e.paso;
      // huecos al principio y al final, hasta donde lo escrito es «sostenido». (Se probó a medirlos hasta
      // la primera/última tinta no aislada y la pista salió peor: lo sostenido también recoge que el
      // principio —clave, armadura, compás— es más denso que el final.)
      p.huecoIni = t0 < 0 ? 0 : t0; p.huecoFin = t1 < 0 ? 0 : (nt - 1 - t1);
    }
    for (i = 0; i < n; i++) {
      p = pents[i];
      p.escrito = ref > CFG.columnaAbs && p.tramos >= CFG.escritoMinD && p.tramos >= CFG.escritoRel * maxTramos && p.t0 >= 0 &&
        p.densidad >= CFG.escritoDensRel * densMax;
    }
    // bloque principal de lo escrito: los pentagramas escritos van seguidos (como mucho con dos vacíos
    // en medio). Uno suelto, lejos y con poca tinta, suele ser un objeto que cruza (un lápiz, un móvil)
    var grupos = [], gAct = null, ultI = -10;
    for (i = 0; i < n; i++) {
      if (!pents[i].escrito) continue;
      if (!gAct || i - ultI - 1 > 2) { gAct = { idx: [], peso: 0 }; grupos.push(gAct); }
      gAct.idx.push(i); gAct.peso += pents[i].tramos; ultI = i;
    }
    grupos.sort(function (x, y) { return y.peso - x.peso; });
    for (k = 1; k < grupos.length; k++) for (i = 0; i < grupos[k].idx.length; i++) {
      p = pents[grupos[k].idx[i]];
      if (p.tramos < 0.5 * maxTramos) { p.escrito = false; p.aislado = true; }
    }
    for (i = 0; i < n; i++) pents[i].fuerte = pents[i].escrito;       // los que cuentan para las pistas
    // la otra voz del sistema puede tener muy pocas notas: vale con menos tramos si el pentagrama de al
    // lado está escrito (cuenta para la caja, no para las pistas)
    var vecinos = [];
    for (i = 0; i < n; i++) {
      p = pents[i];
      if (!p.escrito && !p.aislado && ref > CFG.columnaAbs && p.tramos >= CFG.escritoVecinoD && p.t0 >= 0 &&
          ((i > 0 && pents[i - 1].escrito) || (i < n - 1 && pents[i + 1].escrito))) vecinos.push(p);
    }
    for (i = 0; i < vecinos.length; i++) { vecinos[i].escrito = true; vecinos[i].porVecino = true; }
    for (i = 0; i < n; i++) if (pents[i].escrito) nEsc++;
    P.nEscritos = nEsc;
    // --- por pentagrama: masas en las ventanas de los extremos (en masas típicas de columna)
    var numE = 0, denE = 0, numA = 0, denA = 0, numC = 0, denC = 0, maxHI = 0, maxHF = 0, sumH = 0, we = Math.round(CFG.extremoD * Q), wf = Math.round(CFG.extremoFueraD * Q);
    var tope = CFG.extremoTope * refU, W = we + wf, v;
    for (i = 0; i < n; i++) {
      p = pents[i]; e = p.E;
      var mI = 0, mF = 0, aI = 0, aF = 0, nI = 0, nF = 0;
      for (c = e.cIni - wf; c < e.cIni + we; c++) if (c >= 0 && c < e.nc && e.valido[c]) { v = e.col[c]; mI += v > tope ? tope : v; v = e.mU[c] + e.mD[c]; aI += v > tope ? tope : v; nI++; }
      for (c = e.cFin - we; c < e.cFin + wf; c++) if (c >= 0 && c < e.nc && e.valido[c]) { v = e.col[c]; mF += v > tope ? tope : v; v = e.mU[c] + e.mD[c]; aF += v > tope ? tope : v; nF++; }
      mI /= refU * W; mF /= refU * W; aI /= refU * W; aF /= refU * W;
      // extremo cortado por el borde de la foto: no se sabe; se pone el valor neutro del propio pentagrama
      var neutro = p.fuerte ? Math.min(1.5, p.densidad / refU) : 0, neutroA = neutro * 0.35;
      if (p.cortadoIni || nI < W * 0.6) { mI = neutro; aI = neutroA; }
      if (p.cortadoFin || nF < W * 0.6) { mF = neutro; aF = neutroA; }
      p.extIni = mI; p.extFin = mF; p.altoIni = aI; p.altoFin = aF;
      numE += mI - mF; denE += mI + mF; numA += aI - aF; denA += aI + aF;
      if (p.fuerte) {
        if (p.huecoIni > maxHI) maxHI = p.huecoIni; if (p.huecoFin > maxHF) maxHF = p.huecoFin;
        // cada pentagrama escrito opina con su hueco (fin - principio); pesa según cuánto tiene escrito.
        // Una diferencia pequeña no es orden de lectura, es maquetación (la clave no empieza justo en el
        // margen, la barra final no llega justo al borde): por debajo de huecoMinD no cuenta
        // Y si un extremo está cortado por el borde de la foto (o se pierde en una sombra), lo que hay
        // vacío junto a él no es «el final»: puede ser un compás en blanco y seguir la música fuera
        var gh = (p.cortadoFin ? 0 : p.huecoFin) - (p.cortadoIni ? 0 : p.huecoIni), ah = Math.abs(gh) - CFG.huecoMinD;
        if (ah > 0) sumH += Math.min(1, p.tramos / (0.5 * maxTramos)) * Math.tanh(ah / CFG.huecoD) * (gh > 0 ? 1 : -1);
      }
      // clave de sol al principio (o, si la foto está del revés, al «final»)
      // (también en un extremo cortado por el borde de la foto: si la clave se ve, se ve)
      var sI = !p.fuerte ? 0 : claveEn(e, e.cIni - Q, e.cIni + Math.round(CFG.claveHastaD * Q), refU);
      var sF = !p.fuerte ? 0 : claveEn(e, e.cFin - Math.round(CFG.claveHastaD * Q), e.cFin + Q, refU);
      p.claveIni = sI; p.claveFin = sF;
      // solo cuentan las claves claras: una puntuación floja sale igual de fácil en el principio que en el final
      sI = sI > CFG.claveMin ? (sI - CFG.claveMin) / (1 - CFG.claveMin) : 0; sF = sF > CFG.claveMin ? (sF - CFG.claveMin) / (1 - CFG.claveMin) : 0;
      numC += sI - sF; denC += sI + sF;
    }
    P.clave = numC / (denC + CFG.clavePiso);
    var piso = CFG.extremoPiso;
    P.extremo = numE / (denE + piso * Math.max(1, nEsc));
    P.alto = numA / (denA + 0.4 * piso * Math.max(1, nEsc));
    P.hueco = Math.tanh(CFG.huecoGanancia * sumH);
    P.huecoIni = maxHI; P.huecoFin = maxHF;
    // --- pentagramas vacíos por debajo / por encima de lo escrito
    var pri = -1, ult = -1;
    for (i = 0; i < n; i++) if (pents[i].escrito) { if (pri < 0) pri = i; ult = i; }
    if (pri >= 0) P.vacios = Math.tanh(((n - 1 - ult) - pri) / 2);
    P.vaciosArriba = pri < 0 ? 0 : pri; P.vaciosAbajo = pri < 0 ? 0 : n - 1 - ult;
    // --- «título»: tinta por fuera del primer y del último pentagrama escrito
    if (pri >= 0) {
      var tA = franjaTinta(J, R, pents[pri], -1, pri > 0 ? pents[pri - 1] : null);
      var tB = franjaTinta(J, R, pents[ult], +1, ult < n - 1 ? pents[ult + 1] : null);
      P.tituloArriba = tA; P.tituloAbajo = tB;
      P.titulo = (tA - tB) / (tA + tB + 0.02);
    }
    // --- pareja: en un sistema de dos pentagramas la clave «alta» (sol, sobresale) va en el de arriba
    var numP = 0, denP = 0;
    i = 0;
    while (i < n - 1) {
      if (pents[i].fuerte && pents[i + 1].fuerte) {
        var a = pents[i].altoIni + pents[i].altoFin, b = pents[i + 1].altoIni + pents[i + 1].altoFin;
        numP += a - b; denP += a + b; i += 2;
      } else i++;
    }
    P.pareja = denP > 0 ? numP / (denP + 0.3) : 0;
    // --- perspectiva (solo informativa): ¿los pentagramas de arriba son más pequeños?
    if (n >= 3) {
      var xs = [], ys = [];
      for (i = 0; i < n; i++) { xs.push(vDe(pents[i], uc)); ys.push(Math.log(pents[i].d)); }
      var cf = ajustaCurva(xs, ys, null, 1);
      P.perspectiva = Math.tanh(cf[1] * (xs[n - 1] - xs[0]) * 4);   // >0: abajo más grande (lo de arriba está más lejos)
    }
    for (i = 0; i < n; i++) {
      p = pents[i];
      P.detalle.push({ escrito: p.escrito, fuerte: !!p.fuerte, tramos: p.tramos, densidad: +p.densidad.toFixed(3), d: +p.d.toFixed(2), calidad: +p.calidad.toFixed(2),
        largoD: +(p.largo / p.d).toFixed(1), cortado: [!!p.cortadoIni, !!p.cortadoFin], alineado: !!p.alineado,
        clave: [+p.claveIni.toFixed(2), +p.claveFin.toFixed(2)],
        extremo: [+p.extIni.toFixed(2), +p.extFin.toFixed(2)], alto: [+p.altoIni.toFixed(2), +p.altoFin.toFixed(2)],
        hueco: [+p.huecoIni.toFixed(1), +p.huecoFin.toFixed(1)] });
    }
    return P;
  }

  /** Tinta media en la franja por fuera de un pentagrama (lado=-1 encima, +1 debajo),
   *  entre tituloDesdeD y tituloHastaD; si hay otro pentagrama en medio, hasta él.
   *  Solo cuenta lo que cae sobre PAPEL (gris parecido al del propio pentagrama): si el
   *  pentagrama es el último de la hoja, la franja cae en la mesa y su textura no es un título. */
  function franjaTinta(J, R, p, lado, vecino) {
    var d = p.d, a = CFG.tituloDesdeD + 2, b = CFG.tituloHastaD + 2, um = (p.uIni + p.uFin) / 2;
    if (vecino) { var dist = Math.abs(vDe(vecino, um) - vDe(p, um)) / d - 2.8; if (dist < b) b = dist; }
    if (b - a < 1.5) return 0;
    var s = 0, m = 0, total = 0, u, r, y, yy, paso = Math.max(1, d / 2), G = R.img, W2 = R.W2, gp = 0, ng = 0, k, g;
    // gris del papel: en los espacios del propio pentagrama
    for (u = p.uIni; u < p.uFin; u += 2 * paso) {
      y = vDe(p, u);
      for (k = -1.5; k <= 1.5; k += 1) { yy = y + k * d; if (dentro(R, u, yy)) { gp += G[Math.round(yy) * W2 + Math.round(u)]; ng++; } }
    }
    if (ng < 10) return 0;
    gp = CFG.tituloPapel * gp / ng;
    var conTinta = 0, t;
    for (u = p.uIni; u < p.uFin; u += paso) {
      y = vDe(p, u);
      for (r = a; r <= b; r += 0.5) {
        yy = y + lado * r * d; total++;
        if (!dentro(R, u, yy)) continue;
        g = G[Math.round(yy) * W2 + Math.round(u)]; t = tintaEn(J, R, u, yy);
        if (g < gp && t < 0.02) continue;                   // oscuro sin ser trazo: no es papel (mesa, sombra dura)
        s += t; m++; if (t > 0.02) conTinta++;
      }
    }
    // tiene que ser casi toda papel, y un título ocupa poco: si hay «tinta» por todas partes es una textura (mesa, mantel)
    return (m > 20 && m >= 0.6 * total && conTinta <= CFG.tituloLleno * m) ? s / m : 0;
  }

  /** Combina las pistas con los pesos de CFG -> probabilidad de que la zona esté «de pie». */
  function combinaPistas(P) {
    var w = CFG.pesos, z = 0, k, aporta = {};
    for (k in w) if (w.hasOwnProperty(k) && typeof P[k] === 'number') { aporta[k] = +(w[k] * P[k]).toFixed(3); z += w[k] * P[k]; }
    return { z: z, aporta: aporta };
  }

  /**
   * Caja de lo escrito en la zona enderezada: lista de puntos (zona) que la delimitan.
   */
  function puntosCaja(D) {
    var pents = D.pents, pts = [], i, p, e, r, hay = false;
    for (i = 0; i < pents.length; i++) {
      p = pents[i]; if (!p.escrito) continue;
      e = p.E; hay = true;
      var ua = p.tintaIni === null ? p.uIni : p.tintaIni, ub = p.tintaFin === null ? p.uFin : p.tintaFin;
      // si la tinta empieza casi al principio de las líneas, la caja empieza donde las líneas
      if (ua - p.uIni < 3 * p.d) ua = Math.min(ua, p.uIni);
      // extensión vertical de la tinta de este pentagrama
      var thr = 0.004, arr = 2, aba = 2;
      for (r = -e.rArr; r <= -2 * Q; r++) if (e.masaFila[r + e.RN] > thr) { arr = -r / Q; break; }
      for (r = e.rAba; r >= 2 * Q; r--) if (e.masaFila[r + e.RN] > thr) { aba = r / Q; break; }
      arr = Math.max(arr, CFG.cajaArribaD); aba = Math.max(aba, CFG.cajaArribaD);
      var us = [ua, (ua + ub) / 2, ub], k, u, y, dl;
      for (k = 0; k < 3; k++) { u = us[k]; y = vDe(p, u); dl = dEn(p, u); pts.push([u, y - arr * dl]); pts.push([u, y + aba * dl]); }
    }
    return hay ? pts : null;
  }

  /* =======================================================================
     analiza(): TODO JUNTO
     ======================================================================= */
  function vacio(motivo, t0) {
    return { ok: false, motivo: motivo, giro: 0, inclinacion: 0, caja: { x: 0, y: 0, w: 1, h: 1 },
      confianza: { lineas: 0, arriba: 0, caja: 0 }, pistas: {}, ms: +(ahora() - t0).toFixed(1) };
  }

  function analiza(pix, W, H, opciones) {
    var t0 = ahora();
    try {
      return analizaSeguro(pix, W, H, opciones || {}, t0);
    } catch (err) {
      var r = vacio('error: ' + (err && err.message ? err.message : String(err)), t0);
      return r;
    }
  }

  function preparaContexto(pix, W, H, clara) {
    var g0 = gris(pix, W, H, CFG.mezclaMin, clara);
    var fa = Math.max(W, H) / CFG.ladoTrabajo; if (fa < 1.15) fa = 1;
    var wa = fa === 1 ? W : Math.max(8, Math.round(W / fa)), ha = fa === 1 ? H : Math.max(8, Math.round(H / fa));
    var A = fa === 1 ? g0 : reduceArea(g0, W, H, wa, ha);
    return { W: W, H: H, g0: g0, fa: fa === 1 ? 1 : W / wa, wa: wa, ha: ha, A: A, clara: !!clara };
  }

  function analizaPolaridad(ctx, opciones, tiempos) {
    var t = ahora();
    var k1 = CFG.ventanaTinta1 | 1;
    var mt = mapaTinta(ctx.A, ctx.wa, ctx.ha, k1, true);
    ctx.tinta1 = mt.tinta; ctx.sigma1 = mt.sigma; ctx.fondo1 = mt.fondo;
    ctx.L1 = listaTinta(mt.tinta, ctx.wa, ctx.ha, 0.02, 40000, CFG.topeTinta1);
    ctx.L1f = submuestra(ctx.L1, 14000);                    // con menos puntos basta para afinar el ángulo
    tiempos.tinta = (tiempos.tinta || 0) + ahora() - t; t = ahora();
    // la búsqueda gruesa de direcciones también se hace con la tinta recortada
    var nT = ctx.wa * ctx.ha, tT = tmp('tintaTope', nT), tope = ctx.L1.tope, iT;
    for (iT = 0; iT < nT; iT++) tT[iT] = mt.tinta[iT] > tope ? tope : mt.tinta[iT];
    var dc = direccionesCandidatas(tT, ctx.wa, ctx.ha), radio = Math.hypot(ctx.wa, ctx.ha) / 2;
    tiempos.radon = (tiempos.radon || 0) + ahora() - t; t = ahora();
    var mejor = null, i, probadas = [], angs = [];
    for (i = 0; i < dc.cand.length; i++) {
      var ang = afinaAngulo(ctx.L1f, radio, dc.cand[i].ang);
      angs.push(ang);
      var D = analizaDireccion(ctx, ang, opciones.depura);
      probadas.push({ ang: +(ang * 180 / PI).toFixed(2), rel: +dc.cand[i].rel.toFixed(2), puntuacion: D ? +D.puntuacion.toFixed(1) : 0,
        nPent: D ? D.pents.length : 0, afinado: D ? +(D.ang * 180 / PI).toFixed(2) : null, zona: D ? [D.R.W2, D.R.H2] : null, escala: D ? +D.R.s2.toFixed(2) : null });
      if (D && (!mejor || D.puntuacion > mejor.puntuacion)) { sueltaCandidata(mejor); mejor = D; } else sueltaCandidata(D);
      if (mejor && confLineas(mejor) >= CFG.radonBasta) break;
    }
    // SEGUNDA OPORTUNIDAD: si no salió nada claro y la zona se miró reducida (hoja pequeña sobre
    // un fondo con «líneas»), se repiten las dos primeras direcciones a toda la resolución
    if (confLineas(mejor) < 0.25 && CFG.maxPixSegunda > CFG.maxPixFase2) {
      for (i = 0; i < Math.min(2, angs.length); i++) {
        var D2 = analizaDireccion(ctx, angs[i], opciones.depura, CFG.maxPixSegunda);
        probadas.push({ ang: +(angs[i] * 180 / PI).toFixed(2), segunda: true, puntuacion: D2 ? +D2.puntuacion.toFixed(1) : 0, nPent: D2 ? D2.pents.length : 0,
          afinado: D2 ? +(D2.ang * 180 / PI).toFixed(2) : null, zona: D2 ? [D2.R.W2, D2.R.H2] : null, escala: D2 ? +D2.R.s2.toFixed(2) : null });
        if (D2 && (!mejor || D2.puntuacion > mejor.puntuacion)) { sueltaCandidata(mejor); mejor = D2; } else sueltaCandidata(D2);
        if (mejor && confLineas(mejor) >= CFG.radonBasta) break;
      }
    }
    tiempos.fase2 = (tiempos.fase2 || 0) + ahora() - t;
    // lo que solo hacía falta para buscar (gris, listas de tinta, fondo) vuelve al banco
    deja(ctx.g0); if (ctx.A !== ctx.g0) deja(ctx.A); ctx.g0 = ctx.A = null;
    dejaLista(ctx.L1); if (ctx.L1f !== ctx.L1) dejaLista(ctx.L1f); ctx.L1 = ctx.L1f = null;
    if (ctx.fondo1) deja(ctx.fondo1.a); ctx.fondo1 = null;
    if (!opciones.depura) { deja(ctx.tinta1); ctx.tinta1 = null; }
    return { mejor: mejor, probadas: probadas };
  }

  /** Cuánto cuenta un pentagrama según la calidad de su peine: los de verdad andan por 0,7-0,9;
   *  lo que sale de una textura periódica (mantel, baldosas), por 0,5. */
  function pesoCalidad(q) {
    var f = (q - CFG.calidadCero) / (CFG.calidadPlena - CFG.calidadCero);
    return f < 0 ? 0 : (f > 1 ? 1 : f);
  }

  /** Confianza de que la dirección de las líneas es buena: 0..1. */
  function confLineas(D) {
    if (!D || !D.pents.length) return 0;
    return 1 - Math.exp(-D.puntuacion / CFG.confLineasEscala);
  }

  /**
   * ¿Se analizó con la polaridad buena? Si una foto de papel se mira «en negativo», lo que el
   * peine toma por líneas son los HUECOS entre las líneas de verdad, y los pentagramas salen
   * igual de rectos y de largos (la dirección está bien), pero todo lo demás —la tinta, las
   * pistas de arriba/abajo— es basura. Se nota en el gris de fuera del pentagrama: con la
   * polaridad buena, el papel de fuera es como los ESPACIOS (claro); con la mala, es como
   * las «líneas». Devuelve q = (fuera - líneas) / (espacios - líneas), mediana entre
   * pentagramas: ≥ 1 con la polaridad buena, ≤ 0 con la mala; null si no se puede medir.
   */
  function coherenciaPolaridad(D) {
    if (!D || !D.pents || !D.pents.length) return null;
    var R = D.R, G = R.img, W2 = R.W2, qs = [], i, p, u, y, dl, k, yy, nL, nS, nO, sL, sS, sO, Lu, Su, Ou, paso, mL, mS, mO;
    function mediana(a) { a.sort(function (x, z) { return x - z; }); return a[a.length >> 1]; }
    for (i = 0; i < D.pents.length; i++) {
      p = D.pents[i]; Lu = []; Su = []; Ou = []; paso = Math.max(1, p.d);
      for (u = p.uIni + paso; u < p.uFin - paso; u += paso) {
        y = vDe(p, u); dl = dEn(p, u); sL = sS = sO = 0; nL = nS = nO = 0;
        for (k = -2; k <= 2; k++) { yy = y + k * dl; if (dentro(R, u, yy)) { sL += G[Math.round(yy) * W2 + Math.round(u)]; nL++; } }
        for (k = -1.5; k <= 1.5; k += 1) { yy = y + k * dl; if (dentro(R, u, yy)) { sS += G[Math.round(yy) * W2 + Math.round(u)]; nS++; } }
        for (k = -3.25; k <= 3.25; k += 6.5) { yy = y + k * dl; if (dentro(R, u, yy)) { sO += G[Math.round(yy) * W2 + Math.round(u)]; nO++; } }
        if (nL === 5 && nS === 4 && nO >= 1) { Lu.push(sL / 5); Su.push(sS / 4); Ou.push(sO / nO); }
      }
      if (Lu.length < 8) continue;
      mL = mediana(Lu); mS = mediana(Su); mO = mediana(Ou);
      if (Math.abs(mS - mL) < 1.5) continue;                 // sin contraste entre líneas y espacios no se puede decir nada
      qs.push((mO - mL) / (mS - mL));
    }
    return qs.length ? mediana(qs) : null;
  }

  function analizaSeguro(pix, W, H, opciones, t0) {
    if (!pix || !(W > 15) || !(H > 15) || pix.length < W * H * 4) return vacio('imagen-vacia-o-demasiado-pequena', t0);
    var tiempos = {}, t = ahora(), pistas2 = false;
    bancoLibre();                                           // toda la memoria del análisis anterior queda disponible
    var ctx = preparaContexto(pix, W, H, false);
    var ip = indicePolaridad(ctx.A, ctx.wa, ctx.ha), clara = ip > CFG.umbralPolaridad;
    if (opciones.polaridad === 'clara') clara = true; else if (opciones.polaridad === 'oscura') clara = false;
    if (clara) { deja(ctx.g0); deja(ctx.A); ctx = preparaContexto(pix, W, H, true); }
    tiempos.gris = ahora() - t;
    var r1 = analizaPolaridad(ctx, opciones, tiempos), D = r1.mejor, probadas = r1.probadas, polaridadFinal = clara;
    // la polaridad contraria (trazos claros <-> oscuros) se prueba también si el índice es ambiguo
    // (manteles de rayas, pizarras con poca tiza…) o si no salieron pentagramas claros; gana la de más puntuación
    var ambiguo = ip > CFG.polaridadDuda[0] && ip < CFG.polaridadDuda[1];
    // comprobación directa de la polaridad en los pentagramas encontrados (ver coherenciaPolaridad)
    var q1 = coherenciaPolaridad(D), mala1 = q1 !== null && q1 < CFG.polaridadCoherencia;
    if ((ambiguo || confLineas(D) < 0.25 || mala1) && !opciones.polaridad && !(CFG.tiempoMaxMs > 0 && ahora() - t0 > CFG.tiempoMaxMs)) {
      var ctx2 = preparaContexto(pix, W, H, !clara), r2 = analizaPolaridad(ctx2, opciones, tiempos);
      var q2 = coherenciaPolaridad(r2.mejor), mala2 = q2 !== null && q2 < CFG.polaridadCoherencia, cambia;
      if (!r2.mejor || !r2.mejor.pents.length) cambia = false;
      else if (!D || !D.pents.length) cambia = !mala2 && (ambiguo || confLineas(r2.mejor) >= 0.6);
      else if (mala1 !== mala2) cambia = mala1;              // una de las dos es un negativo: gana la otra
      // las dos pasan (o fallan) la comprobación: gana la de más puntuación; fuera de la zona de duda,
      // la polaridad contraria solo se acepta si es muy convincente
      else cambia = r2.mejor.puntuacion > D.puntuacion * 1.15 && (ambiguo || confLineas(r2.mejor) >= 0.6);
      if (cambia) {
        sueltaCandidata(D); deja(ctx.tinta1);
        D = r2.mejor; ctx = ctx2; probadas = r2.probadas; polaridadFinal = !clara; q1 = q2; mala1 = mala2;
      } else { sueltaCandidata(r2.mejor); deja(ctx2.tinta1); }
      pistas2 = true;
    }
    var out = vacio('', t0);
    out.ok = true; delete out.motivo;
    var pistas = { version: VERSION, entrada: [W, H], trabajo: [ctx.wa, ctx.ha], polaridad: polaridadFinal ? 'clara' : 'oscura',
      indicePolaridad: +ip.toFixed(3), dosPolaridades: pistas2, direcciones: probadas };
    out.pistas = pistas;
    if (!D || !D.pents.length) {
      pistas.motivo = 'sin-pentagramas';
      out.ms = +(ahora() - t0).toFixed(1); pistas.tiempos = redondea(tiempos);
      if (opciones.depura && D) out.depura = { R: D.R, J: D.J, pents: [], ctx: { wa: ctx.wa, ha: ctx.ha, tinta1: ctx.tinta1, fa: ctx.fa } };
      return out;
    }
    t = ahora();
    var R = D.R, pents = D.pents, n = pents.length, i, p;
    var P = midePistas(D);
    // --- inclinación fina: pendiente media de los pentagramas (los escritos, si los hay)
    var sp = 0, sw = 0, um, pe, peso;
    for (i = 0; i < n; i++) {
      p = pents[i]; um = (p.uIni + p.uFin) / 2; pe = p.coef[1] + 2 * p.coef[2] * um;
      peso = p.largo * p.calidad * (P.nEscritos ? (p.escrito ? 1 : 0.15) : 1);
      sp += pe * peso; sw += peso;
    }
    var delta = sw > 0 ? Math.atan(sp / sw) : 0;            // rad, pendiente dv/du en la zona
    var angLineas = D.ang + delta;                           // dirección de las líneas en la foto (rad, horaria)
    // --- arriba/abajo
    var comb = combinaPistas(P), z = comb.z;
    // a priori por giro: comparar el giro resultante de «de pie» con el de «del revés»
    var totalPie = -angLineas * 180 / PI, giroPie = ((Math.round(totalPie / 90) * 90) % 360 + 360) % 360, giroRev = (giroPie + 180) % 360;
    z += (CFG.previo[giroPie] || 0) - (CFG.previo[giroRev] || 0);
    // con las líneas muy juntas la escritura apenas se ve: la evidencia vale menos
    var fd = (D.d - CFG.dConfianzaCero) / (CFG.dConfianzaPlena - CFG.dConfianzaCero);
    fd = fd < 0.2 ? 0.2 : (fd > 1 ? 1 : fd);
    z *= fd;
    var pPie = sigmoide(z), dePie = pPie >= 0.5;
    var total = dePie ? totalPie : totalPie + 180;
    total = ((total % 360) + 360) % 360;
    var giro = ((Math.round(total / 90) * 90) % 360 + 360) % 360;
    var incl = total - Math.round(total / 90) * 90;
    // --- confianzas
    var cl = confLineas(D);
    if (Math.abs(incl) > CFG.inclinacionMax) cl *= 0.5;
    var ca = Math.abs(2 * pPie - 1);
    // si los pentagramas se vieron «en negativo», las pistas no valen nada (la dirección de las líneas sí)
    if (mala1) ca = 0;
    // --- caja
    var pts = puntosCaja(D), cajaConf = 0, caja = { x: 0, y: 0, w: 1, h: 1 }, cajaJusta = null;
    var Wp = (giro === 0 || giro === 180) ? W : H, Hp = (giro === 0 || giro === 180) ? H : W;
    var ar = total * PI / 180, cr = Math.cos(ar), sr = Math.sin(ar);
    function aColocada(q) {                                  // punto de la zona -> foto colocada (px)
      var e = zonaAEntrada(R, ctx, q[0], q[1]), X = e[0] - W / 2, Y = e[1] - H / 2;
      return [X * cr - Y * sr + Wp / 2, X * sr + Y * cr + Hp / 2];
    }
    if (!pts) {
      // sin pentagramas escritos claros: caja de todos los pentagramas detectados
      pts = [];
      for (i = 0; i < n; i++) { p = pents[i]; pts.push([p.uIni, vDe(p, p.uIni) - 4 * p.d], [p.uFin, vDe(p, p.uFin) - 4 * p.d], [p.uIni, vDe(p, p.uIni) + 4 * p.d], [p.uFin, vDe(p, p.uFin) + 4 * p.d]); }
    }
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, q;
    for (i = 0; i < pts.length; i++) { q = aColocada(pts[i]); if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
    cajaJusta = { x: x0 / Wp, y: y0 / Hp, w: (x1 - x0) / Wp, h: (y1 - y0) / Hp };
    var dPx = D.d / R.s2, mg = CFG.cajaMargenD * dPx;
    var mx = mg + CFG.cajaMargenRel * (x1 - x0), my = mg + CFG.cajaMargenRel * (y1 - y0);
    x0 = Math.max(0, x0 - mx); y0 = Math.max(0, y0 - my); x1 = Math.min(Wp, x1 + mx); y1 = Math.min(Hp, y1 + my);
    if (x1 - x0 > 8 && y1 - y0 > 8) caja = { x: x0 / Wp, y: y0 / Hp, w: (x1 - x0) / Wp, h: (y1 - y0) / Hp };
    cajaConf = cl * (P.nEscritos ? Math.min(1, 0.5 + 0.5 * Math.min(1, P.masaRef / 0.6)) : 0.3);
    // --- salida
    out.giro = giro; out.inclinacion = +incl.toFixed(2); out.caja = redondeaCaja(caja);
    out.confianza = { lineas: +cl.toFixed(3), arriba: +ca.toFixed(3), caja: +cajaConf.toFixed(3) };
    tiempos.pistas = ahora() - t;
    pistas.anguloLineas = +(((angLineas * 180 / PI) % 180 + 180) % 180).toFixed(2);
    pistas.d = +(D.d / R.s2).toFixed(2);                    // separación entre líneas en px de la imagen analizada
    pistas.dFase2 = +D.d.toFixed(2); pistas.escalaFase2 = +R.s2.toFixed(3); pistas.zona = [R.W2, R.H2]; pistas.pasadasFase2 = D.pasadas;
    pistas.puntuacionLineas = +D.puntuacion.toFixed(1);
    pistas.nPentagramas = n; pistas.nEscritos = P.nEscritos;
    pistas.pArriba = +pPie.toFixed(4); pistas.z = +z.toFixed(3); pistas.dePie = dePie; pistas.descuentoD = +fd.toFixed(2);
    pistas.coherenciaPolaridad = q1 === null ? null : +q1.toFixed(2); pistas.polaridadDudosa = mala1;
    pistas.valores = { clave: +P.clave.toFixed(3), extremo: +P.extremo.toFixed(3), alto: +P.alto.toFixed(3), hueco: +P.hueco.toFixed(3), vacios: +P.vacios.toFixed(3),
      titulo: +P.titulo.toFixed(3), pareja: +P.pareja.toFixed(3), perspectiva: +P.perspectiva.toFixed(3) };
    pistas.aporta = comb.aporta;
    pistas.huecos = [+(P.huecoIni || 0).toFixed(1), +(P.huecoFin || 0).toFixed(1)];
    pistas.vaciosArribaAbajo = [P.vaciosArriba || 0, P.vaciosAbajo || 0];
    pistas.masaRef = +P.masaRef.toFixed(3);
    pistas.cajaJusta = redondeaCaja(cajaJusta);
    pistas.pentagramas = [];
    for (i = 0; i < n; i++) {
      p = pents[i];
      var a = zonaAEntrada(R, ctx, p.uIni, vDe(p, p.uIni)), b = zonaAEntrada(R, ctx, p.uFin, vDe(p, p.uFin));
      var dd = P.detalle[i];
      dd.linea = [+(a[0] / W).toFixed(4), +(a[1] / H).toFixed(4), +(b[0] / W).toFixed(4), +(b[1] / H).toFixed(4)];   // 3ª línea, 0..1 en la foto original
      dd.dRel = +(p.d / R.s2 / Math.max(W, H)).toFixed(5);
      pistas.pentagramas.push(dd);
    }
    pistas.tiempos = redondea(tiempos);
    if (opciones.depura) out.depura = { R: R, J: D.J, pents: pents, ctx: { wa: ctx.wa, ha: ctx.ha, tinta1: ctx.tinta1, fa: ctx.fa } };
    out.ms = +(ahora() - t0).toFixed(1);
    return out;
  }

  function redondea(o) { var r = {}, k; for (k in o) if (o.hasOwnProperty(k)) r[k] = +o[k].toFixed(1); return r; }
  function redondeaCaja(c) { return { x: +c.x.toFixed(4), y: +c.y.toFixed(4), w: +c.w.toFixed(4), h: +c.h.toFixed(4) }; }

  /* =======================================================================
     analizaImagen(): reduce con un canvas y llama a analiza()
     ======================================================================= */
  /** Lienzo de w×h con su contexto 2D: { c, g }. Primero fuera de pantalla (no toca el DOM); si el
   *  navegador no lo tiene o no le da contexto 2D (Safari antiguo), un <canvas> corriente. */
  function creaLienzo(w, h, lectura) {
    var c, g = null, op = lectura ? { willReadFrequently: true } : undefined;
    if (typeof OffscreenCanvas !== 'undefined') {
      try { c = new OffscreenCanvas(w, h); g = c.getContext('2d', op); } catch (e) { g = null; }
    }
    if (!g && typeof document !== 'undefined') {
      try { c = document.createElement('canvas'); c.width = w; c.height = h; g = c.getContext('2d', op); } catch (e2) { g = null; }
    }
    if (!g) return null;
    g.imageSmoothingEnabled = true;
    try { g.imageSmoothingQuality = 'high'; } catch (e3) { /* da igual */ }
    return { c: c, g: g };
  }

  function tamanoDe(f) {
    var w = f.naturalWidth || f.videoWidth || f.displayWidth || f.width, h = f.naturalHeight || f.videoHeight || f.displayHeight || f.height;
    return [w | 0, h | 0];
  }

  /** Dibuja la fuente reducida a 'lado' px de lado mayor, bajando a mitades para no crear muaré. */
  function reduceConCanvas(fuente, lado) {
    var tm = tamanoDe(fuente), w = tm[0], h = tm[1];
    if (!(w > 0 && h > 0)) return null;
    var f = Math.min(1, lado / Math.max(w, h)), dw = Math.max(1, Math.round(w * f)), dh = Math.max(1, Math.round(h * f));
    var act = fuente, aw = w, ah = h, l;
    while (aw > 2 * dw) {
      var nw = Math.max(dw, Math.ceil(aw / 2)), nh = Math.max(dh, Math.ceil(ah / 2));
      l = creaLienzo(nw, nh, false); if (!l) return null;
      l.g.drawImage(act, 0, 0, aw, ah, 0, 0, nw, nh);
      act = l.c; aw = nw; ah = nh;
    }
    l = creaLienzo(dw, dh, true); if (!l) return null;
    l.g.drawImage(act, 0, 0, aw, ah, 0, 0, dw, dh);
    return { lienzo: l.c, ctx: l.g, w: dw, h: dh, wOrig: w, hOrig: h };
  }

  function analizaImagen(fuente, opciones) {
    opciones = opciones || {};
    var t0 = ahora();
    return new Promise(function (resuelve) {
      function fallo(m) { resuelve(vacio(m, t0)); }
      function sigue(f) {
        try {
          if (typeof ImageData !== 'undefined' && f instanceof ImageData) {
            var r0 = analiza(f.data, f.width, f.height, opciones); r0.ms = +(ahora() - t0).toFixed(1); return resuelve(r0);
          }
          var red = reduceConCanvas(f, opciones.lado || CFG.ladoEntrada);
          if (!red) return fallo('no-se-pudo-leer-la-imagen');
          var datos;
          try { datos = red.ctx.getImageData(0, 0, red.w, red.h); }
          catch (e) { return fallo('canvas-manchado-por-CORS'); }
          var r = analiza(datos.data, red.w, red.h, opciones);
          r.pistas = r.pistas || {}; r.pistas.original = [red.wOrig, red.hOrig];
          r.pistas.msAnaliza = r.ms;                        // lo que tardó analiza(); r.ms pasa a incluir la reducción con el canvas
          r.ms = +(ahora() - t0).toFixed(1);
          resuelve(r);
        } catch (e) { fallo('error: ' + (e && e.message ? e.message : String(e))); }
      }
      try {
        if (!fuente) return fallo('sin-imagen');
        if (typeof Blob !== 'undefined' && fuente instanceof Blob) {
          if (typeof createImageBitmap !== 'function') return fallo('este-navegador-no-lee-blobs');
          // que respete la orientación EXIF, igual que un <img> (hay navegadores antiguos que no admiten la opción)
          var listo = function (bm) { sigue(bm); if (bm.close) bm.close(); }, ilegible = function () { fallo('imagen-ilegible'); };
          var sinOpcion = function () { try { createImageBitmap(fuente).then(listo, ilegible); } catch (e) { ilegible(); } };
          try { createImageBitmap(fuente, { imageOrientation: 'from-image' }).then(listo, sinOpcion); } catch (e) { sinOpcion(); }
          return;
        }
        if (typeof HTMLImageElement !== 'undefined' && fuente instanceof HTMLImageElement && !fuente.complete) {
          fuente.addEventListener('load', function () { sigue(fuente); }, { once: true });
          fuente.addEventListener('error', function () { fallo('imagen-ilegible'); }, { once: true });
          return;
        }
        sigue(fuente);
      } catch (e) { fallo('error: ' + (e && e.message ? e.message : String(e))); }
    });
  }

  /* =======================================================================
     pinta(): dibuja la foto ya colocada (girada, enderezada y encuadrada)
     ======================================================================= */
  /**
   * @param destino  canvas donde se pinta (se le cambia el tamaño)
   * @param fuente   img / canvas / bitmap con la foto ORIGINAL (cualquier tamaño)
   * @param res      resultado de analiza()
   * @param op       { recorta:true, maxLado:1400, giro, inclinacion, caja }  (los tres últimos sustituyen a los de res)
   */
  function pinta(destino, fuente, res, op) {
    op = op || {};
    var tm = tamanoDe(fuente), W = tm[0], H = tm[1];
    var giro = op.giro != null ? op.giro : res.giro, incl = op.inclinacion != null ? op.inclinacion : res.inclinacion;
    var caja = op.recorta === false ? { x: 0, y: 0, w: 1, h: 1 } : (op.caja || res.caja);
    var Wp = (giro === 0 || giro === 180) ? W : H, Hp = (giro === 0 || giro === 180) ? H : W;
    var cw = caja.w * Wp, ch = caja.h * Hp, maxLado = op.maxLado || 1400, e = Math.min(1, maxLado / Math.max(cw, ch));
    destino.width = Math.max(1, Math.round(cw * e)); destino.height = Math.max(1, Math.round(ch * e));
    var g = destino.getContext('2d');
    g.imageSmoothingEnabled = true; try { g.imageSmoothingQuality = 'high'; } catch (x) { /* da igual */ }
    g.fillStyle = op.fondo || '#0d1624'; g.fillRect(0, 0, destino.width, destino.height);
    g.save();
    g.scale(e, e);
    g.translate(-caja.x * Wp, -caja.y * Hp);
    g.translate(Wp / 2, Hp / 2);
    g.rotate((giro + incl) * PI / 180);
    g.drawImage(fuente, -W / 2, -H / 2);
    g.restore();
    return destino;
  }

  /** Esquinas de la caja (o de la que se pase) en píxeles de la foto ORIGINAL de W×H:
   *  [arriba-izq, arriba-der, abajo-der, abajo-izq] vistas ya con la foto colocada. */
  function esquinasCaja(res, W, H, caja) {
    caja = caja || res.caja;
    var giro = res.giro, a = (res.giro + res.inclinacion) * PI / 180, c = Math.cos(a), s = Math.sin(a);
    var Wp = (giro === 0 || giro === 180) ? W : H, Hp = (giro === 0 || giro === 180) ? H : W;
    var e = [[caja.x, caja.y], [caja.x + caja.w, caja.y], [caja.x + caja.w, caja.y + caja.h], [caja.x, caja.y + caja.h]], out = [], i, X, Y;
    for (i = 0; i < 4; i++) { X = e[i][0] * Wp - Wp / 2; Y = e[i][1] * Hp - Hp / 2; out.push([X * c + Y * s + W / 2, -X * s + Y * c + H / 2]); }
    return out;
  }

  /**
   * POLÍTICA RECOMENDADA: qué hacer con la foto según las confianzas. Devuelve
   *   { giro, inclinacion, caja, seguro, motivo }
   * · seguro=true  -> aplicar giro + inclinación + caja (las tres cosas son de fiar).
   * · seguro=false -> giro es lo ÚNICO que se propone aplicar:
   *      0   si no hay pentagramas claros o si las líneas ya están horizontales (no se sabe si
   *          está del revés: mejor no tocar una foto que puede estar bien);
   *      90/270 si las líneas están verticales con confianza ≥ umbralLineas (la foto está tumbada;
   *          se gira hacia el lado más probable, que puede quedar del revés: no peor que tumbada).
   * Los umbrales salen de CFG.umbralSeguro / CFG.umbralLineas (o de 'op').
   */
  function decide(res, op) {
    op = op || {};
    var uS = op.umbralSeguro != null ? op.umbralSeguro : CFG.umbralSeguro, uL = op.umbralLineas != null ? op.umbralLineas : CFG.umbralLineas;
    var uC = op.umbralCaja != null ? op.umbralCaja : CFG.umbralCaja, todo = { x: 0, y: 0, w: 1, h: 1 };
    if (!res || !res.ok || !res.confianza || res.confianza.lineas < uL)
      return { giro: 0, inclinacion: 0, caja: todo, seguro: false, motivo: 'sin-pentagramas-claros' };
    if (res.confianza.arriba >= uS && res.confianza.lineas >= uS)
      return { giro: res.giro, inclinacion: res.inclinacion, caja: res.confianza.caja >= uC ? res.caja : todo, seguro: true, motivo: 'seguro' };
    if (res.giro === 90 || res.giro === 270)
      return { giro: res.giro, inclinacion: 0, caja: todo, seguro: false, motivo: 'tumbada-lado-dudoso' };
    return { giro: 0, inclinacion: 0, caja: todo, seguro: false, motivo: 'arriba-dudoso' };
  }

  /** Matriz [a,b,c,d,e,f] (como la de canvas/CSS matrix()) que lleva un píxel de la foto
   *  original (ancho W, alto H) a la foto colocada (antes de recortar la caja). */
  function matriz(res, W, H) {
    var giro = res.giro, a = (res.giro + res.inclinacion) * PI / 180, c = Math.cos(a), s = Math.sin(a);
    var Wp = (giro === 0 || giro === 180) ? W : H, Hp = (giro === 0 || giro === 180) ? H : W;
    return { m: [c, s, -s, c, Wp / 2 - (W / 2) * c + (H / 2) * s, Hp / 2 - (W / 2) * s - (H / 2) * c], ancho: Wp, alto: Hp };
  }

  return { CFG: CFG, VERSION: VERSION, analiza: analiza, analizaImagen: analizaImagen, pinta: pinta, matriz: matriz,
    esquinasCaja: esquinasCaja, decide: decide, libera: libera,
    _interno: { gris: gris, reduceArea: reduceArea, mapaTinta: mapaTinta, filtroExtremo: filtroExtremo, zonaAEntrada: zonaAEntrada, vDe: vDe, dEn: dEn,
      preparaContexto: preparaContexto, listaTinta: listaTinta, analizaDireccion: analizaDireccion, zonaPentagramas: zonaPentagramas,
      endereza: endereza, perfilesTiras: perfilesTiras, peine: peine, pendientePorMitades: pendientePorMitades, autocorrelacionTiras: autocorrelacionTiras,
      picosAutocorrelacion: picosAutocorrelacion, buscaPentagramas: buscaPentagramas, direccionesCandidatas: direccionesCandidatas } };
});
