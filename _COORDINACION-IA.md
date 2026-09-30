# Coordinación entre conversaciones de Claude · lmpro (portal GP)

Iago tiene varias conversaciones de Claude subiendo cambios a este portal a la vez. Este fichero es el punto de
encuentro (empieza por «_» para que la web no lo publique). Antes de subir nada: mira el último commit de `main`, lee
esto, apunta abajo fecha, quién eres, qué vas a tocar y «EN CURSO» (en un commit solo con este fichero), edita
SIEMPRE sobre la versión del último commit y, al acabar, cambia tu línea a «HECHO · commit xxxxxxx».

## Registro (lo más reciente arriba · hora de Galicia)
- 30-sep 18:10 · Fichas y rediseño · HECHO · commit fe73195 (PredictCarrusel, anterior 81c4bd4) · sonido al aparecer el compás
  en el rítmico (el mismo que la clave y la armadura del melódico). guiado.js e index.html (?v=7). Comprobado en vivo. Deshacer: revertir fe73195.
- 30-sep 17:40 · Fichas y rediseño · HECHO · commit 81c4bd4 (PredictCarrusel, anterior a7fba77) · armónico más guiado: acorde 1
  con títulos «Acorde» (blanco→morado al sonar) y «Ar-pe-gio» (sílaba a sílaba), solución con solo la opción buena; acorde 2
  con «Siguiente parte · Acorde 2», «Escribe la nota dada» y paso a paso (el acorde, la de abajo con flecha ↓, la de arriba
  con flecha ↑, comprobar), «Ve escribiendo» abajo y lo que no suena casi transparente. Final de cada ejercicio: los 5
  últimos segundos del reloj pasan al centro con tic-tac (−5 s por ejercicio). Música de fondo en el minuto de preparación
  (120, dos pulsos por segundo). Máximo medido: 11:12. guiado.js/css e index.html (?v=6). Comprobado en vivo. Deshacer: revertir 81c4bd4.
- 30-sep 16:10 · Fichas y rediseño · HECHO · commit a7fba77 (PredictCarrusel, anterior 3cb14cb) · en el acorde 2, «tiple» y
  «bajo» en rectángulos morados traslúcidos encima y debajo de la nota escrita (sin «aguda/central/grave» ni «?»); alteración
  de la nota dada, oscura. guiado.js/css e index.html (?v=5). Comprobado en vivo. Deshacer: revertir a7fba77.
- 30-sep 15:50 · Fichas y rediseño · HECHO · commit 3cb14cb (PredictCarrusel, anterior 0be3760) · carrusel guiado, tercera ronda
  del aula: soniditos del Carrusel PRO (cambio de pantalla al entrar en cada apartado; suaves al empezar, al escribir y con
  los textos; uno por solución en TonCom), cuenta atrás con claqueta y claqueta durante el rítmico, portadas solo con el
  nombre, TonCom presentado entero, textos del armónico en el recuadro no activo (sin pantalla completa, tarjeta más arriba),
  bonus con ligaduras, marco ajustado y «¿A qué te suena?» nuevo, «Fin del carrusel en…» y confeti. Máximo medido: 11:18.
  guiado.js/css e index.html (?v=4). Comprobado en vivo. Deshacer: revertir 3cb14cb.
- 30-sep 14:47 · Fichas y rediseño · HECHO · commit 0be3760 (PredictCarrusel, anterior b7b5813) · solo guiado.js: unos
  segundos menos de espera (transiciones, guías del armónico, corrección del rítmico en 3/4) para que ningún carrusel pase
  de 11:20 con el minuto de preparación (el más largo de 500 semillas, medido: 11:19). Deshacer: revertir 0be3760.
- 30-sep 14:31 · Fichas y rediseño · HECHO · commit b7b5813 (PredictCarrusel, anterior 5404920) · carrusel guiado, segunda
  ronda de lo pedido desde el aula: sonido al entrar en cada apartado y sin campanita; «Pantalla completa» arriba a la
  derecha y «Duración total» junto a «♪ piano listo» en la portada; nube del rítmico con los ritmos típicos (bolitas desde
  «Piensa»); melódico con flechas azules y solución más lenta; TonCom y Armónico guiados paso a paso (corrección del acorde
  2 con la nota del bajo que viaja); Bonus extra · Cadencias con «¿A qué te suena?». Recortes de aire: el carrusel entero,
  con el minuto de preparación, ≤ 11:20. guiado.js/css e index.html (?v=3). Comprobado en vivo. Deshacer: revertir b7b5813.
- 30-sep 13:09 · Fichas y rediseño · HECHO · commit 5404920 (PredictCarrusel, anterior 59b38d4) · carrusel guiado, lo que Iago pidió
  desde el aula: minuto «El carrusel empezará en…» al pulsar Empezar; «Pausa» y «Pantalla completa» siempre a la vista;
  5·4·3·2·1 verde liso con «✎ Escribe»; melódico con 3·2·1, avisos que no tapan la tonalidad y 35 s de corrección; TonCom
  con guía, más aire y casillas destacadas (corrección 10 s); Armónico con opciones en una línea que parpadean, grave/
  central/aguda pegadas al acorde; bonus sin campanita; sin el trazo negro de VexFlow en los textos; remolino y bioma en
  lienzos pequeños + modo ligero automático. guiado.js/css e index.html (?v=2). Comprobado en vivo. Deshacer: revertir 5404920.
- 30-sep 12:18 · Fichas y rediseño · HECHO · commit 27aafe2 (LMEAVathome, anterior cebace6) y 8dbb99c (lmpro, anterior 4005171) ·
  index.html de GE y GP: el INVITADO ya no vuelve a ver la puerta ni la contraseña al volver de una app a la portada en la
  misma pestaña (marca GATE_DENTRO en sessionStorage; «cerrar sesión» la borra). Al abrir el portal de nuevo, la puerta
  sale como siempre. Comprobado en vivo. Deshacer: revertir 27aafe2 y 8dbb99c.
- 30-sep 10:53 · Fichas y rediseño · HECHO · commit 59b38d4 (PredictCarrusel, anterior 1cbfc54) · Carrusel Elemental GUIADO en la
  pantalla de clase (?pantalla=1, la espiral de Tester): guiado.js y guiado.css NUEVOS (portada, 4 ejercicios guiados, bonus de
  cadencia y créditos); index.html: botón «Generar carrusel», enlace a guiado.css/js y PCGuiado.abrir() al principio de
  abrirPantalla(); en el iPad, esquina con la cadencia del bonus. Deshacer: revertir 59b38d4. Copia en Dropbox (LEEME).
- 30-sep 09:28 · Fichas y rediseño · HECHO · Diario deploy 6abcb9f3f2fe8b616bcc2854 (anterior 6abc1771…) · ipad.html:
  «Ir al diario» en la cuenta atrás de la escaleta (el Diario se abre ENCIMA, en un marco, con una ventana flotante del
  tiempo que queda; bloque nuevo al final «ir-diario» + una línea window.__escaleta) y «Siguiente: tareas» con solo
  «tareas» en amarillo; index.html: el filo amarillo de las tarjetas 4Ge/2Gp de la portada, quieto (<style
  id="tarjetas-fijas"> antes de </head>). Copia en Dropbox: _SUBIDA-30-SEP-ir-al-diario (deploy 6abcb9f3).
- 29-sep 21:53 · Fichas y rediseño · HECHO · Diario deploy 6abc1771c1a8d8c8750d0907 (anterior 6abc1373…) · PLAN DE RITMO
  ENTONADO 2.º GP (diario-progresion.js, PLAN_GP): 1.2 → 10·11, 1.4 → solo la 18 (C1 y C2), 1.7 → 21·22, 3.3 → 135·149;
  index.html solo sube a diario-progresion.js?v=r20. Lección 90 de 2Gp: full y thumb ya son la completa del libro (copia
  de las viejas en libros_lecciones/2Gp/ritmo_entonado/_antes-29sep-2026/). Semana 42 de 2Gp: carta 1.4, solo la 18.
- 29-sep 21:33 · Fichas y rediseño · HECHO · Diario deploy 6abc13733055c31a9fa78bc0 (anterior 6abc0101…) · CAMPANA
  (suite-campana.js): lo que marcas como visto ya no vuelve a contar al cerrar (el recuento del globo pisaba el «visto»
  recién mandado) y el globo baja en el acto. index.html, ipad.html e iphone.html solo cambian a suite-campana.js?v=s30.
- 29-sep 20:13 · Fichas y rediseño · HECHO · commit 8972d4a (lmpro) y cebace6 (LMEAVathome), Diario deploy 6abc0101ef5f4d1ae1934071 · index.html de GP (lmpro) y de GE (LMEAVathome) · dictado animado:
  piano con paso alto a 110 Hz y bus 6.5→6.0 (GP) / 5.0→4.6 (GE y reproductor «ver»), mismo volumen audible y menos
  grave profundo (distorsionaba el altavoz al subir el volumen). Solo esas líneas, marcadas «(29-sep-2026, Iago)». Lo
  mismo está en ipad.html del Diario (deploy 6abc0101).
- 29-sep 18:53 · Fichas y rediseño · HECHO · commit c108b66 · index.html (lmpro) · dictado animado (reproductor de clase, solo
  Protester), ventana «Repeticiones por frase»: las dos ruedas van de número en número (rueda del ratón, dedo, lápiz y
  toque). Solo funciones nuevas ruedaPaso/ruedaManejo y su enganche en abrirReps; marcas «(29-sep-2026, Iago)». Lo
  mismo está en ipad.html del Diario (deploy 6abc0101).
- 29-sep 17:22 · Fichas y rediseño · HECHO · Netlify deploy 6abc00ba87c1426ec5387059 (entonacionelemental, 29-sep 20:20) · App de corrección ENTONACIÓN ELEMENTAL (Netlify entonacionelemental ·
  correccionentonacion.lmathome.es): por parejas, afinación y ritmo de 5 % en 5 % (parejas.js); «Otro» no resta sin
  motivo escrito (parejas.js y app.js); 😥 en vez de 🥲, que no sale en el ordenador del aula (pantalla.js y app.js); la
  pantalla del aula se recarga sola si hay versión nueva (pantalla.html); index.html con ?v nuevos. Probado y
  publicado el 29-sep a las 20:20.
- 29-sep 17:13 · Fichas y rediseño · HECHO · commit f8e608e (LMEAVathome) · Piel · ENTONACIÓN zoom y carriles (LMEAVathome piel/apps/portal.js y
  portal.css, sección 17): en «a todo el ancho» la música pasa al 80 % del ancho (se veía granulado de tan grande) y
  los lados son carriles para desplazar sin pintar (dedo, lápiz y ratón). Solo el visor del libro (Tester, GE).
- 29-sep 16:11 · Fichas y rediseño · HECHO · commit aea57f7 (LMEAVathome) · Piel · ARREGLO pantalla completa (LMEAVathome piel/apps/portal.js):
  desde 51e4c80 la pantalla completa del portal (Tester/Protester, GE y GP) se quitaba sola al entrar: la sección 17
  declaraba otra «function enPantalla» y pisaba la de la sección 11 (todas las secciones de la piel comparten ámbito).
  Renombrada a enAlternaPantalla; comprobado que no queda ningún otro nombre repetido. OJO quien toque la piel: no
  repetir nombres de función entre secciones.
- 29-sep 15:18 · Fichas y rediseño · HECHO · commit 51e4c80 y b77fbe0 (LMEAVathome) y 2a96901 (lmpro) · piel/apps/portal.js y portal.css (LMEAVathome) e index.html de GE
  (LMEAVathome) y GP (lmpro): LIBRO DE ENTONACIÓN en el cuadro de la clave de sol (solo Tester GE: «Lección activa ·
  N» con dos vistas, tonalidad y anotaciones con los colores de Intervalia) y la punta fina de las lecciones de ritmo
  en VERDE. Sección 17 nueva al final de portal.js; en los index solo cambia el color de la punta fina.
- 29-sep 13:58 · Fichas y rediseño · HECHO · commit 1dac585 y 1e46607 (LMEAVathome) y 056abc7 (lmpro) · piel/apps/portal.js y portal.css (LMEAVathome) e index.html de GE
  (LMEAVathome) y GP (lmpro): MOROSOS con papel («Ya entregó»), periodo extra y ceros (calavera); avisos del alumno
  del periodo extra y del 0. Base de datos ya aplicada (migraciones morosos_papel_ya_entrego_ceros_20260929 y
  morosos_ya_entrego_solo_papel_20260929).
- 29-sep 12:55 · Fichas y rediseño · HECHO · commit 1f2c1ae (LMEAVathome) y 0533b42 (lmpro) · index.html de GE (LMEAVathome) y de GP (lmpro): PENTAGRAMA con un
  tercer botón en el selector de claves (cuadrado blanco = pantalla en blanco, sin pentagramas); solo el bloque
  «PENTAGRAMA».
- 29-sep 12:21 · Fichas y rediseño · HECHO · commit 7530f2e (LMEAVathome) · piel/apps/portal.js y portal.css (LMEAVathome): atajos del profesor
  (Resultados de Ritmo, Entonación, Ritmo entonado y Dictado) DENTRO del portal con una ✕ arriba a la derecha (solo
  Tester/Protester) y las reclamaciones ya leídas en gris.
- 29-sep 11:26 · Fichas y rediseño · HECHO · commit 1a56759 (LMEAVathome) y e0c5f43 (lmpro) · index.html de GE (LMEAVathome) y de GP (lmpro): LIBROS (visor, solo
  Tester/Protester) con la página ajustada al ancho, zoom (− / + / pellizco / Ctrl+rueda) y botón de pantalla
  completa; solo el bloque «LIBROS DEL AULA».
- 29-sep 11:22 · Fichas y rediseño · HECHO · commit 6cd1e0b (LMEAVathome) y ec0c491 (lmpro) · index.html de GE (LMEAVathome) y de GP (lmpro): PENTAGRAMA sin puntero
  al escribir con el lápiz y «Borrar todo» de un solo toque (Deshacer lo recupera); solo el bloque «PENTAGRAMA».
- 29-sep 10:19 · Fichas y rediseño · HECHO · commit 9b03186 (LMEAVathome) · piel/apps/portal.js (LMEAVathome): la ventana de bienvenida de la
  reforma estética deja de salir a todos desde el lunes 6-oct-2026 (hasta entonces, igual: una vez por cuenta y
  aparato).
- 29-sep 10:04 · Fichas y rediseño · HECHO · commit 75183d5 y 89a4cea (LMEAVathome) y 8868871 (lmpro) · piel/apps/portal.js (LMEAVathome): MOROSOS solo durante la clase de un
  grupo que debe algo (si no, el icono no está) · index.html de GE (LMEAVathome) y de GP (lmpro): PENTAGRAMA con
  selección libre (lazo que tintinea) y cursor para mover y agrandar con asas, solo Tester/Protester; solo cambia el
  bloque «PENTAGRAMA».
- 29-sep 09:08 · Fichas y rediseño · HECHO · commit a2c0e5a · piel/apps/portal.js y portal.css (LMEAVathome) · MOROSOS solo
  Tester/Protester: cuadrado rojo con ⚠ a la izquierda de todo, globito con los alumnos del grupo que está en clase
  (horario del Diario) con ficha digital en la semana de gracia, lista al tocarlo, ondas solo 5 s. Datos:
  suite_morosos_fichas_token con la llave «lm_profe» que deja el Diario (deploy 6abb5b35). Sección 15 nueva al final
  de portal.js; no toca lo demás.
- 29-sep 07:59 · Fichas y rediseño · HECHO · commit d5916c0 (LMEAVathome) y 8bbad2b (lmpro) · index.html de GE (LMEAVathome) y de GP (lmpro) · papel↔digital con la
  ficha en marcha (diálogo al cambiar y filtro por ficha), «Marcar como leído» en reclamaciones y el 0 en rojo
- 29-sep 07:42 · Fichas y rediseño · HECHO · commit 8a2766b (ritmoathome) · index.html (ritmoathome) · carta 1.3: el orden corchea+negra /
  negra+corchea como el de los ritmos nuevos (la negra coincide)
- 29-sep 07:33 · Fichas y rediseño · HECHO · commit 8082ccf (ritmoathome) · index.html (ritmoathome) · carta 1.3: «¿De qué lo conoces?» y árbol
  con negra+corchea y corchea+negra, crafteo solo con los dos tajos
- 29-sep 07:11 · Fichas y rediseño · HECHO · commit a286ebe (LMEAVathome) y 6581d5d (PreDictPROCarrusel) · piel/apps/portal.js y portal.css (LMEAVathome) · campana tranquila
  (ondas solo 5 s) y Mis resultados con «Volver» amarillo; index.html (PreDictPROCarrusel) · botón «volver al portal»
  arriba a la izquierda
- 28-sep 20:31 · Fichas y rediseño · HECHO · commit 20bf4a4 (lmpro) · Portal GP: el botón del Carrusel PRO solo para Protester/Tester, los
  alumnos ya no lo ven (lmpro index.html).
- 28-sep 19:58 · Fichas y rediseño · HECHO · commit 6104967 y 1cbfc54 (PredictCarrusel), dacc219 (LMEAVathome) · Espiral del Carrusel Elemental en Tester: PredictCarrusel index.html
  (dado naranja y modo pantalla con la semilla del iPad en app_config) y LMEAVathome index.html (bloque «ESPIRAL» al
  final, solo Tester).
- 28-sep 19:40 · Fichas y rediseño · HECHO · commit 35247a6 (LMEAVathome) y 18e416b (PreDictPROCarrusel) · Carrusel PRO: estética nueva para todos, pantalla del profe y móviles
  por QR (LMEAVathome piel/lm-piel.js y PreDictPROCarrusel index.html, línea 22). El Carrusel de GE no se toca.
- 28-sep 19:11 · Fichas y rediseño · HECHO · commit c6d391e, f4db5c6 y cb88e77 (GE) y 57c60c2 (GP) · piel/lm-piel.js, piel/apps/portal.js y portal.css (LMEAVathome) e
  index.html de GE y GP (solo la línea 5 «LM piel») · la estética nueva PARA TODOS los alumnos, con la ventana de
  bienvenida en la portada y el Temazo en azul liso. Lo de Tester/Protester sigue siendo solo suyo
- 28-sep 17:58 · Fichas y rediseño · HECHO · commit dfaeb99 y 11858be · index.html y manifest.webmanifest · Dictado activo = el reproductor
  del iPad (duración total, Ir al final, Corregir; solo Protester) e iconos nuevos (apple-touch-icon, icon-192 e
  icon-512, ?v=6)
- 28-sep 16:35 · Fichas y rediseño · HECHO · commit a485ae2 · index.html · Resultados (solo Protester): el botón abre la pantalla de
  corrección al momento (Safari bloqueaba la pestaña abierta tras una espera)
- 28-sep 11:29 · Fichas y rediseño · HECHO · commit e47bb51 · index.html · Pentagrama (solo Tester/Protester): claves solo en
  símbolo y botón de compases del 2 al 8 que divide cada pentagrama; con sol y fa, las divisorias cruzan el sistema
- 28-sep 11:10 · Fichas y rediseño · HECHO · commit 79d89cb · index.html · Libros (solo Tester/Protester): siempre a pantalla
  completa, páginas al ancho y «Lista» en columna a la derecha; Pentagrama: márgenes iguales y línea final en cada
  pentagrama. Bloques «(28-sep-2026, Iago)».
- 28-sep 08:31 · Fichas y rediseño · HECHO · commit 6eada7a · index.html: Ojeador en iPad/Safari (modo profesor solo lectura), formato de
  reserva papel/digital, Temazo más suave y una sola vez, Pentagrama (solo Protester), y línea «LM piel» tras `<meta charset>` (solo cuentas de prueba).
