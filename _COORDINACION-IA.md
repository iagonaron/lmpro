# Coordinación entre conversaciones de Claude · lmpro (portal GP)

Iago tiene varias conversaciones de Claude subiendo cambios a este portal a la vez. Este fichero es el punto de
encuentro (empieza por «_» para que la web no lo publique). Antes de subir nada: mira el último commit de `main`, lee
esto, apunta abajo fecha, quién eres, qué vas a tocar y «EN CURSO» (en un commit solo con este fichero), edita
SIEMPRE sobre la versión del último commit y, al acabar, cambia tu línea a «HECHO · commit xxxxxxx».

## Registro (lo más reciente arriba · hora de Galicia)
- 15-oct 18:59 · Fichas y rediseño · HECHO (sin EN CURSO aparte; Iago vio las capturas y dijo «sí, publica todo»; comprobado justo antes
  que main seguía en 18da699) · GP · TEMAZO COMPACTO (Iago): al completar las tareas, el temazo ya no es la franja azul grande
  encima de los portales, sino una barrita en la fila de arriba a la derecha, a la izquierda de Mis resultados y la campana,
  a su altura (34 px) y con su radio (10): ▶, el título con su progreso, 🎲 otro género y ↗ escúchalo entero en Spotify (en
  las unidades con botones, un ▾ los despliega). Mismo funcionamiento, mismo sonidito y destellos. De largo, 280 px como
  mucho, sin pasar del centro de la fila (con Protester, 184). Solo cambia el bloque @TEMAZO de index.html (estilos al final,
  seccion() y pintar(); la franja de siempre sigue ahí si no hay fila arriba). Deshacer: index.html de 18da699 (copia en
  APPs/_PARA BORRAR/15-oct-2026-lmpro-antes-del-temazo-compacto/).
- 15-oct 18:58 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la escaleta de las 17:45, publicado a las 18:58
  como pidió Iago, entre dos clases; comprobado justo antes que main seguía en 18da699 y LMEAVathome en d42c4e9) · ESCALETA
  v7 (Iago): el índice dura lo que haga falta: 1,5 s de silencio tras la tensión, la carga de datos (tecleo y «computing»
  suaves, abajo «Cargando actividades» y un circulito amarillo que gira, sin raya), una línea cada 1,5 s y, con la última,
  se para la carga y suena alto el Scifi Touch Activation 3, cuyo último golpe cae en el 5:00. La preparación (32 s) se
  corre según lo largo del índice. El ▶ de la escaleta, sin resplandor. En el portal, al empezar cada clase (la entrada),
  la lista de morosos se abre sola si sale el ⚠ de ese grupo (una vez por clase). LMEAVathome b1367e7 (escaleta.js 6bb530f4…;
  escaleta-previa-v7, -datos-v7 y -cierre-v7.mp3 nuevos en piel/). Banco 44/44, 21/21, 6/6 y 3/3 (morosos).
  Deshacer: piel/escaleta.js de d42c4e9.
- 15-oct 17:45 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la escaleta de las 17:27, con prisa para la clase de
  las 18:00; comprobado justo antes que main seguía en 50861db y LMEAVathome en 8b05d37) · ESCALETA v6 (Iago): al final de
  la preparación, tensión (riser) y de golpe silencio; a los 1,5 s, el tecleo de datos mucho más bajo y sin más efectos;
  las líneas del índice cada 1,5 s con el Button Press de su Splice; fuera «Cargando actividades» y la raya amarilla de
  abajo (también en el cartel de cada actividad). Preparación 4:16–4:48 e índice 4:48–5:00. LMEAVathome d42c4e9
  (escaleta.js 2973109f…, piel/escaleta-previa-v6.mp3 y escaleta-item-v6.mp3 nuevos). Banco 44/44, 21/21 y 6/6.
  Deshacer: piel/escaleta.js de 8b05d37.
- 15-oct 17:27 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la escaleta de las 16:45; comprobado justo antes
  que main seguía en 9b50376 y LMEAVathome en a07465f) · ESCALETA, ÍNDICE DE 10 s QUE «CARGA» LAS ACTIVIDADES (Iago): la
  preparación pasa a 4:18–4:50 (32 s, la misma pista del alligator con sus complementos) y «Hoy en clase» a 4:50–5:00, ya
  sin base: suenan datos cargando todo el rato, abajo «Cargando actividades ••• NN %» con su barra, las líneas salen a ritmo
  fijo (la última hacia el 4:58), cada una con su pop un pelín más agudo, y en el 5:00 un cierre sutil de los de datos, sin
  platillo. La pista nueva es piel/escaleta-previa-v5.mp3 (la escaleta-previa.mp3 de antes se queda, sin usar). LMEAVathome
  8b05d37 (escaleta.js af305991…). Banco 44/44, 21/21 y 6/6. Deshacer: piel/escaleta.js de a07465f.
- 15-oct 16:45 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la escaleta de las 16:20; comprobado justo antes
  que main seguía en 2bd080c y LMEAVathome en 95972e2) · ESCALETA CON LOS SONIDOS DE SPLICE DE IAGO: la previa (4:12–5:00)
  suena con una pista hecha con sus sonidos (piel/escaleta-previa.mp3, 120 por minuto: el loop «alligator» de base, un
  complemento distinto en cada secuencia de 4 compases, platillo de transición al entrar «Hoy en clase» y break con riser
  y golpe en el 5:00); cada línea del índice, un bubble pop (escaleta-item.mp3); cada cambio de actividad, dos «task
  completed» alternos (escaleta-cambio-1/2.mp3). Si no cargan, la batería sintetizada. LMEAVathome a07465f (escaleta.js
  b51f00d8… y los 4 mp3 nuevos en piel/). Banco 44/44, 21/21 y 6/6. Deshacer: piel/escaleta.js de 95972e2 (los mp3 sobran).
- 15-oct 16:20 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la escaleta de las 15:25; comprobado justo antes
  que main seguía en 49924af y LMEAVathome en 2eca48e) · ESCALETA, PREPARACIÓN PRIMERO E ÍNDICE CON LA BATERÍA (Iago): de
  4:12 a 4:44, la preparación (cuenta atrás de 32 s) con la batería a 120 por minuto, más baja y en fade-in; de 4:44 a 5:00,
  «Hoy en clase» sin cortar la batería, cada línea en un golpe y un break corto que cierra en el 5:00 con la primera
  actividad (sin ding). Índice: «Ritmo: preparación lección N», «Ritmo: evaluación lecciones…», «Teoría: …» (varias líneas,
  una debajo de otra); el descanso, una raya recta. «Pregunta de la semana pasada» → «Evaluación». Dos puntos del tiempo en
  blanco; recordatorio solo con contorno y una chincheta. En el portal, en la preparación de ritmo, el contorno amarillo va a
  la campana y a la lección de hoy dentro de «Tareas de la semana». Solo cambia piel/escaleta.js (LMEAVathome 95972e2,
  sha256 f11ead15…). Banco 44/44 y 21/21. Deshacer: piel/escaleta.js de 2eca48e (copia en
  APPs/_PARA BORRAR/15-oct-2026-escaleta-antes-de-la-bateria/).
- 15-oct 15:25 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la escaleta de las 15:05; comprobado justo antes
  que main seguía en d7230ee y LMEAVathome en 0a19dc3) · ESCALETA, «HOY EN CLASE» DE 15 s (Iago): de 4:00 a 4:15 (la cuenta
  atrás de 45 s sigue de 4:15 a 5:00); cada línea entra 2 s después de la anterior, con su sonido; el descanso ya no es una
  línea con nombre: «Descanso» sale en su turno y se deshace en una raya discontinua amarilla entre lo de antes y lo de
  después. Solo cambia piel/escaleta.js (LMEAVathome 2eca48e, sha256 3c488ae9…). Banco 40/40 y 18/18; probado con la
  escaleta publicada de 2Gp C2. Deshacer: piel/escaleta.js de 0a19dc3 (copia en
  APPs/_PARA BORRAR/15-oct-2026-escaleta-antes-del-indice-15s/).
- 15-oct 15:05 · Fichas y rediseño · HECHO (sin EN CURSO aparte; comprobado justo antes que main seguía en 5700be8,
  LMEAVathome en de34bca y el Diario en 6acf1cef) · ESCALETA EN LA PANTALLA DEL AULA (solo cuentas Tester/Protester):
  LMEAVathome 0a19dc3: piel/escaleta.js (nuevo) y piel/lm-piel.js (lo carga solo con esas cuentas y nunca en el Ojeador); Diario
  deploy 6ad0ce25 (ipad.html publica la escaleta de cada clase en escaleta_publicada; app.js: el cuadro del bloque de teoría
  avisa de que ese texto lo ven los alumnos). En el portal y las apps: tarjeta de tres líneas arriba en el centro; «Hoy en
  clase» 8 s desde 4:07; cuenta atrás de 45 s con batería y recordatorios; cartel en cada cambio (se quita tocando); fin de
  clase (con tareas en C2); editores de ritmo y entonación en modo aula; la música de los 30 temas se para sola. No toca
  portal.js ni los index.html de los portales. Banco 39/39 y 18/18 (con el portal y la piel de verdad). Quitarla: borrar
  sus líneas de lm-piel.js (o ?escaleta=0 en una pestaña). Deshacer el Diario: deploy 6acf1cef.
- 15-oct 14:08 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la v4 de las 13:58; comprobado justo antes que
  main seguía en 275387f y LMEAVathome en 2c2c10d) · CAMPANA v5 (Iago eligió: «Lecciones y tareas»): en «Tareas de la semana»,
  «Lecciones de ritmo» y las tareas sueltas se marcan con la ✓ verde en la esquina de su fila, como las tarjetas (globo
  «Marcar como estudiadas» / «Marcar como hecho»); hechas, la fila en gris, sin «Marcar estudiadas», «Hecho» ni la pastilla
  «✓ Hecho». Quiz, fichas y papel, igual. Mismos manejadores (ts-marcar / ts-lec-todas): mientras guarda o si falla, el
  cuadrado conserva su ✓. Banco 141/141. LMEAVathome de34bca (index.html 45dae31b…), lmpro este commit (index.html
  13b6e092…). Deshacer: los index.html de 275387f (lmpro) y 2c2c10d (LMEAVathome).
- 15-oct 13:58 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la campana v3 de las 13:15, en los dos portales;
  comprobado justo antes que main seguía en 42cb316 y LMEAVathome en e5cd89a) · CAMPANA v4 (Iago, tarde): la FECHA, debajo del
  icono (las «Tareas de la semana» la siguen llevando en su franja, a la derecha) y arriba a la derecha solo los botones
  cuadrados (✓ visto y sobre); ✓ también en el dictado revisado o corregido; en la tarjeta roja de TIEMPO EXTRA, el rótulo en
  ámbar, sin contorno y parpadeando a la par que el día de hoy, y el triángulo amarillo de peligro en vez del punto blanco;
  reclamaciones: «Ficha N · reclamación» + «✕ Denegada» / «✓ Aceptada» (sin «reclamación denegada · ejercicios…»), icono de
  exclamación amarilla en el cuadro rosa y, al pasar el ratón, «Marcar como visto» / «Enviar mensaje a Iago». En index.html
  solo cambian cv2Tarjeta, cv2Visto y el CSS cv2, y tres líneas del render (dictado, reclamación y ficha). Banco 123/123 (GE y
  GP; 1280, 1024, 820 y 390). LMEAVathome 2c2c10d (index.html 3b3efb81…), lmpro este commit (index.html 9b8b289b…).
  Deshacer: APPs/_PARA BORRAR/15-oct-2026-portales-antes-de-la-campana-v4/{ge,gp}/.
- 15-oct 13:15 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la campana de las 10:28, en los dos portales;
  comprobado justo antes que main seguía en c0f2df0 y LMEAVathome en 0451c29) · CAMPANA v3 (Iago, mediodía: «que todas las
  notificaciones tuviesen la misma altura. Todas»): todas las tarjetas sueltas igual de altas y cada fila de «Tareas de la
  semana» igual (la cabecera de las tareas, más fina); la FECHA, en la esquinita de arriba a la derecha (también la de las
  tareas, con el cuadro más pequeño); los días de las fichas, segmentos rectangulares casi pegados («Tiempo extra» con aire
  dentro de su contorno); fuera el texto «ENVIADA antes de las 19h EN PUNTO o se
  queda el 0» del tiempo extra; lo que no cabe se corta con «…» y sale «Leer mensaje completo», que despliega esa tarjeta (o
  esa fila). En index.html solo cambian las piezas cv2* (cv2Tarjeta y su CSS; nuevas cv2Mas y cv2Recortes, que se llama tras
  pintar la campana) y el render de la campana (cabecera de las tareas con la fecha; reclamación: el mensaje junto a la nota y
  los ejercicios en el subtítulo; dictado: el aviso de las fotos junto a la nota). Manejadores y data-* iguales. Banco 101/101
  (GE y GP; 1280, 1024, 820 y 390). LMEAVathome e5cd89a (index.html e882ac5c…), lmpro este commit (index.html 9345851b…).
  Deshacer: APPs/_PARA BORRAR/15-oct-2026-portales-antes-de-la-campana-v3/{ge,gp}/.
- 15-oct 13:15 · Fichas y rediseño · HECHO (apunte atrasado: es de Netlify, no toca este repo) · CORRECCIÓN DE DICTADOS DE GE
  (dictadoselemental, 15-oct por la mañana, deploys 6ad0a258 y 6ad0a528): en el móvil, la solución del dictado arriba, en dos
  pentagramas como la ve el alumno, con lupa a pantalla completa. Copia y deshacer: APPs/APPS CORRECCION (netlify x6)/
  _SUBIDAS-15-OCT-solucion-del-dictado-en-la-correccion/ (o el deploy anterior en Netlify).
- 15-oct 10:34 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoque de la entrada de las 10:28, en los dos portales;
  comprobado justo antes que main seguía en 193c527 y LMEAVathome en 9cc6139) · CAMPANA: en «Tareas de la semana» ya abierta
  pero con algo pendiente, el cuadro y su número se ven enteros (antes salían apagados como lo leído). Solo una regla de CSS
  (.cv2.cv2-pend) y la clase en la tarjeta. Banco 91/91. Deshacer: volver a los index.html de 193c527 (lmpro) y 9cc6139
  (LMEAVathome).
- 15-oct 10:28 · Fichas y rediseño · HECHO (el EN CURSO de las 09:34; comprobado justo antes que main seguía en el commit de las
  10:07 de Atonalidad, sobre el que va este cambio) · CAMPANA DEL ALUMNO EN GE Y GP, «COLUMNA DE BOTONES» (Iago: «mira este caos
  de notificaciones… que sean más parecidos entre todos, que las cosas estén en los mismos lugares»; de tres propuestas eligió
  la 2 y la afinó en varias rondas). Todas las tarjetas: cuadro con el icono del color del apartado y el punto de «nuevo» · lo
  que pasa (título = qué es · en gris qué ha pasado; pastilla del estado; la nota en su caja, verde si aprueba y roja si no) ·
  columna fija a la derecha: arriba «visto» (✓ verde) y «contestar» (sobre amarillo), en medio el botón, abajo la fecha. Misma
  altura salvo si trae mensaje de Iago; «Tareas de la semana» en filas iguales y el número de pendientes en el punto del cuadro;
  lo hecho y lo ya visto, en gris. Fichas con 14 casillas (7 rosas + 7 de «Tiempo extra», con sus dos fechas «vie 16/10 · 19h»),
  también la de papel (botón rosa «Entregada en clase»); «Lecciones de ritmo · Intro N» en verde; TIEMPO EXTRA con menos texto;
  el dictado corregido igual que el verificado; «Contestar a Iago» y el visor del dictado, con las mismas piezas. En index.html:
  el cuerpo del list.map del render de AluCampana, piezas cv2* (cv2Tarjeta, cv2Estilo, cv2Nota, cv2Barra14, cv2Plazo) y su CSS
  (#cv2-campana-css), pintarCuenta → cv2Plazo dentro de .cv2, el texto del botón «visto» y los rótulos de esas dos ventanas.
  Manejadores y data-* iguales. Banco 89/89 (GE y GP; 1280, 1024, 820 y 390). LMEAVathome 9cc6139 (index.html 177883f8…), lmpro
  este commit (index.html f31cc292…). Deshacer: APPs/_PARA BORRAR/15-oct-2026-portales-antes-de-la-campana-columna/{ge,gp}/. OJO
  quien toque la campana: todo pasa por cv2Tarjeta/cv2Estilo/cv2CSS (si cambias un tipo de aviso, usa esas piezas).
- 15-oct 10:07 · Escape room «Atonalidad» (Cowork) · HECHO (sin EN CURSO aparte: va en este mismo commit, junto a index.html;
  comprobado justo antes que main seguía en cef3a6e) · MEDALLAS DEL MEDALLERO «A SANGRE» (Iago: «los botones de los portales…
  la imagen de ChatGPT… no se adecúa exactamente al tipo de curvatura de esquinas de los botones… que las esquinas coincidan
  exactamente con la forma»; «no poner la piel esa marrón, mantenemos la estética actual»). En index.html solo cambian las
  imágenes de las medallas (las tres líneas de datos: window.__MED_IMG__, I.on/I.off.u2n e I.on.u3n); ni CSS, ni JS, ni la piel.
  Cada imagen pierde el marco y las esquinas redondeadas que traía de ChatGPT y llega hasta el borde: la forma la pone solo el
  botón (.med; con la piel, border-radius 12px), a cualquier tamaño. Las cerradas (off, que solo se ven sin la piel), con la
  misma receta de antes (desenfoque + tinte). u3n (Atonalidad, cuenta Protester) sale directamente del icono limpio del 14-oct.
  Llevan su marca C2PA (por eso el index.html crece unos 165 KB). Fuentes y guiones: APPs/LMATHOME GP (github lmpro)/MEDALLAS A
  SANGRE (fuentes)/. Deshacer: volver a subir el index.html del commit cef3a6e (copia en APPs/_PARA BORRAR/15-oct-2026-portal-gp-
  antes-de-medallas-a-sangre/). A «Fichas y rediseño» (EN CURSO 09:34): no toco la campana; tu parche entra encima sin choque.
- 15-oct 09:34 · Fichas y rediseño · EN CURSO → HECHO a las 10:28 (ver arriba) · CAMPANA DEL ALUMNO EN GE Y GP (index.html de lmpro y de LMEAVathome). Iago
  eligió armonizar todos los avisos con la «columna de botones»: cuadro con el icono del color del apartado · lo que pasa ·
  fecha y botones en una columna fija a la derecha. Toco solo el pintado de la campana (render() de AluCampana: tareas de la
  semana, quiz, dictado revisado, recomendado, ficha en papel corregida, reclamaciones, fichas y avisos) y su CSS; los
  manejadores y los data-* se quedan igual. Si necesitas subir el index.html de lmpro o de LMEAVathome antes de que cierre esto,
  súbelo sin esperar: rehago mi parche sobre tu versión (va por script).
- 14-oct 20:40 · Fichas y rediseño · HECHO (sin EN CURSO aparte: va en este mismo commit, junto a index.html; comprobado justo
  antes que main seguía en e595b01) · CAMPANA DEL ALUMNO: TARJETA «DICTADO Nº N · NOTA REVISADA» EN DOS LÍNEAS (Iago: «la
  estética de notas revisadas de dictados no me convence… no minimalista… no aprovecha el espacio… al ser dictado el color de
  destacado debería ser naranja»; de tres propuestas eligió la A). En index.html solo cambian dos trozos, marcados
  «14-oct-2026»: lo que pinta la tarjeta (bloque «DICTADO REVISADO (Iago jul-2026)», justo antes de @RECO) y su CSS. Línea 1:
  cascos, «Dictado nº N · nota revisada», pastilla «Corregida por Iago» (naranja) o «✓ Verificada» (verde) y las fechas;
  línea 2: «Tu corrección x → Nota de Iago y» (o «Tu nota y»), el comentario y «Ver dictado y solución» (mismo data-id-notif,
  mismo visor) o, pasados los 7 días, el aviso de que las fotos se guardan 7 días. Contorno naranja (#f97316; ya leída, más
  tenue). Mismos datos (suite_alumno_notif_listar): sin SQL. Banco 18/18 (escritorio, iPad 820 px y móvil 390 px; el visor
  abre). Deshacer: volver a subir el index.html del commit e595b01 (copia en
  APPs/_PARA BORRAR/14-oct-2026-portal-gp-antes-de-dictado-revisado-A/). OJO quien toque la campana: las clases dct-* son de
  esta tarjeta.
- 14-oct 17:10 · Escape room «Atonalidad» (Cowork) · HECHO (sin EN CURSO aparte: va en este mismo commit, junto a index.html; comprobado
  justo antes que main seguía en fd8f561). ICONO MÁS LIMPIO DE ATONALIDAD en la medalla u3n (la que ve la cuenta Protester): Iago pidió
  un icono más limpio; ChatGPT lo rehízo (la misma casa de noche, en penumbra y casi sin color, sin manchas ni hojas de colores, y la O
  y la I de ATONALIDAD en celeste). En index.html solo cambia la línea del icono u3n (la imagen, 208 px, con el mismo marco que la
  anterior, y su comentario). Lo mismo en el escape room (atonalidad.gp.lmathome.es/prueba.html, su icono de pestaña). Deshacer:
  volver a subir el index.html del commit fd8f561.
- 14-oct 14:29 · Escape room «Atonalidad» (Cowork) · HECHO (sin EN CURSO aparte: va en este mismo commit con el index.html de lmpro) ·
  SELECCIONADOR DE VOLUNTARIOS, SOLO PARA LA CUENTA PROTESTER (Iago: «un botón… seleccionador de voluntarios… solo activo en los
  horarios de los grupos… una ruleta de alumnos de ese grupo… que puedas darlo otra vez»; «que dure como 5 segundos, que dé algo
  hype… en todos los portales, incluidos los futuros… con la misma estética que el propio portal»; «cada vez que la ruleta
  aleatoriza, el nombre que sale se banea» hasta que salgan todos). En index.html, bloque @MEDALLERO: conCuentaVol(u) — con
  sesión validada y esTester(), el portal se abre con «#c=<cuenta>»; a los alumnos, igual que siempre. Nueva carpeta
  voluntarios/ (lm-voluntarios.js, el módulo con los temas museo/radio/disco; LEEME.md: cómo añadirlo a un portal nuevo).
  SUPABASE (migración voluntarios_gp_20261014): tabla suite_voluntarios (RLS sin políticas) y suite_voluntarios_estado /
  suite_voluntarios_tira (solo responden a la cuenta tester; hora exacta de clase según horario_clases, hora de Madrid).
  Portales con el cargador: atonalidad 75d7ce0, cualidadesdelsonido y fon-grafo (commits de hoy). Deshacer: que
  conCuentaVol devuelva u; SQL-BD/14-oct-2026-voluntarios-DESHACER.sql. OJO quien toque @MEDALLERO: mantener conCuentaVol
  en el window.open de las medallas.
- 14-oct 14:25 · Fichas y rediseño · HECHO (sin EN CURSO aparte: aquí solo va este registro; lo demás ya está publicado y
  comprobado) · CORRECCIÓN DE DICTADOS (Netlify dictadoselemental, correcciondictado.lmathome.es): deploy 6acf7424 encima
  de 6ac93722. «Corrección manual GP»: al escribir en «Nombre» sale una lista propia con nombre + apellidos + grupo
  (vw_dictados_gp_canon; sin tildes; cada palabra casa con el principio de cualquier palabra del nombre o apellidos;
  tocar abre ya la corrección; ↑ ↓ Intro; los ya corregidos con su nota; testers fuera). Fichero NUEVO
  nombres-gp-14oct.js (app-7oct.js sin tocar) + una línea en index.html. Banco 21/21. Deshacer: Netlify → 6ac93722 →
  Publish deploy. · SUPABASE: el SQL de la entrada de las 13:55 (alta flexible + formato en espera) YA ESTÁ PEGADO (Iago,
  14:20) y comprobado: las 5 funciones con la huella del banco. Se pegó en 4 trozos (SQL-BD/…-PARTE-1, 2A, 2B y 3): el
  editor de Supabase NO guarda una consulta con _suite_registrar_alumno_v4_alumnos en claro, así que en la 2B va en
  base64 dentro de un execute (misma función). OJO quien pase SQL a Iago por enlace (…/sql/new?content=): por encima de
  ~9.000 caracteres no carga, y alguna consulta creada así no se guarda: mejor botones que abran el editor al momento.
- 14-oct 13:55 · Fichas y rediseño · HECHO (sin EN CURSO aparte: va en este mismo commit con el index.html de lmpro) ·
  PORTALES GE/GP (index.html): DIGITAL O PAPEL CON LA CUENTA PENDIENTE + «Podrás cambiar el formato siempre que quieras»
  (Iago: «que el alumno que todavía está pendiente de validar sí tenga la opción ya de escoger si papel o digital… un
  texto destacado, quizá medio tintineante»). Al quedar pendiente (alta, o entrada con la cuenta aún pendiente) se abre
  la ventana de digital/papel de siempre con la entradilla «Mientras Iago revisa tu cuenta», SOLO si suite_formato_leer
  devuelve «pendiente» (SQL nuevo) y aún no eligió; se guarda con suite_formato_elegir (sin expediente) y Supabase lo
  aplica al validar. El pie gris pasa a píldora que late (lmfSiempre; quieta con «reducir movimiento»). En @FORMATO:
  decidir(op) y decidirPendiente(id); en la puerta: formatoEnEspera(id). Sin el SQL, el portal hace lo de antes.
  SUPABASE (lo pega Iago, en 3 partes): SQL-BD/14-oct-2026-alta-flexible-y-formato-en-espera.sql → el ALTA acepta solo
  el nombre de pila si en alumnos_canon no hay otro activo que pueda llamarse así, y «Mª» pegado al nombre
  (_suite_alta_nombre_casa; el expediente sigue EXACTO); tabla suite_formato_pendiente + _suite_formato_pendiente_aplicar;
  cambian _suite_registrar_alumno_v4_alumnos, suite_formato_elegir, _suite_formato_leer_alumnos, suite_validar_alumno y
  suite_listar_pendientes_v3 (trozos marcados «14-oct-2026»: mantenerlos si alguien las toca). El login no cambia.
  Bancos: portal 30/30 (GE y GP), SQL 100/100. LMEAVathome bdfe810 (index.html c8bee8c5…), lmpro este commit
  (index.html 22f6df66…). Deshacer: APPs/_PARA BORRAR/14-oct-2026-portales-antes-del-formato-en-espera/{ge,gp}/ y
  SQL-BD/14-oct-2026-alta-flexible-y-formato-en-espera-DESHACER.sql. OJO: mismo código en GE y GP.
- 14-oct 08:30 · Fichas y rediseño · HECHO (sin EN CURSO aparte: aquí solo va este registro; lo demás ya está publicado y
  comprobado) · RECLAMACIONES POR EJERCICIO Y POR APARTADO (Iago: «quiero que vaya apartado por apartado o reclamación por
  reclamación… sea lo que sea que se corrige, si se acepta, que suba la nota»; opciones: dar por bueno, dar por buenos
  apartados, anular y % a mano, «que las opciones se desplieguen»). SUPABASE (lo pegó Iago a las 08:25): SQL-BD/
  14-oct-2026-reclamaciones-por-apartado.sql → tabla suite_ficha_ajustes (ficha, cuenta, n, tipo, pct 0-1…; RLS sin
  políticas), _suite_ajustes_de, _suite_nota_con (la media de la app, 1 decimal), _suite_apartados_total,
  suite_reclamacion_opciones y suite_reclamacion_decidir (comprueba todo antes de escribir: aceptar NUNCA baja la nota);
  el trigger suite_ficha_entrega_aplica_anulados y suite_ficha_recalcular aplican también los ajustes; y se ARREGLA
  suite_ficha_anular (anular a toda la clase daba error: «on conflict (ficha_id,n)» ya no casaba con el índice). Comprobado
  después: 89/89 entregas con la misma nota. DIARIO: Netlify deploy 6acf1cef (campana ?v=s41: ACEPTAR despliega ✓ Bien ·
  ＋ Apartado · % A mano · Ø Anular por ejercicio, con la nota que saldría; sin las funciones nuevas, lo de antes).
  TEORÍA: teoriaathome b3a3f11 y teoriapro 499c6d7 (marca «✔ Reclamación aceptada…» en la ficha corregida). VIGÍA de
  Chrome: ritmoathome d17dd47 (la fase 2 del quiz avisa a Sentry si las cartas no se ven; lo revisa la tarea Incidencias).
  OJO quien toque reclamaciones: el detalle va en payload.reclamacion.decisiones y los % nuevos en payload.ajustes (los
  pone el trigger); el aviso al alumno (suite_notif_crear) mantiene reclamacion_ficha_id y ejercicios (+ decisiones).
  Para volver: …-DESHACER.sql (en SQL-BD), Netlify → 6ace64db → Publish, y git revert de b3a3f11, 499c6d7 y d17dd47.
- 14-oct 07:53 · Intros didácticas · HECHO (sin EN CURSO aparte: va en este mismo commit con el index.html de lmpro) ·
  MEDALLERO GP, CUÁNDO SE ABRE CADA MEDALLA A LOS ALUMNOS (lo decide Supabase, no la web). Iago: «en general lo que quiero
  por defecto es que a los alumnos les salga no el viernes de la semana en la que activo la unidad, sino el viernes
  siguiente… así desde que yo activo la unidad todavía tengo 4 clases antes de que a ellos les aparezca. así no se hacen
  spoilers». Supabase, migración medallas_gp_viernes_siguiente_20261014: en suite_medallas_gp solo cambia una línea,
  v_apertura := suite_viernes_19(v_fecha + 7) (antes, suite_viernes_19(v_fecha)); sábado y domingo siguen contando como
  la semana que empieza. Hamilton, Tester/Protester (lo ven todo al momento), permisos y lo demás, igual. Efecto: Acústica
  (u2, marcada el domingo 11) pasa del viernes 16 al VIERNES 23-oct a las 19:00; Fonógrafo (u1) sigue abierta. La web no
  cambia de comportamiento (usa abierta/desde de la RPC): en index.html solo se ponen al día dos comentarios del
  @MEDALLERO. lmpro este commit (index.html 0ce4b3ca…). Deshacer: APPs/DIARIO PROFESOR (netlify diariodeiagocmus)/SQL-BD/
  14-oct-2026-medallas-viernes-siguiente-DESHACER.sql (pegarlo en el editor SQL de Supabase). OJO: quien toque
  suite_medallas_gp, que mantenga el «+ 7». Historia: APPs/LMATHOME GP (github lmpro)/
  LEEME-14-oct-2026-portales-gp-el-viernes-siguiente.txt
- 13-oct 23:31 · Fichas y rediseño · HECHO (sin EN CURSO aparte: va en este mismo commit con el index.html de lmpro) ·
  PORTALES GE/GP (index.html), CAMPANA DEL ALUMNO, aviso en TIEMPO EXTRA, 2.ª vuelta (Iago: «quiero que lo del tiempo
  extra sea como en lo de morosos, con la barra de tiempo por día y el segmento de ese día en amarillo»). En el aviso,
  la cuenta atrás «Te quedan 2 d 21 h 30 min» se cambia por la barra de la lista de morosos del aula: 7 casillas, una
  por día, que acaban en el final del periodo extra; rojo lo que ya pasó, ámbar el día de hoy (se va llenando y
  parpadea; el último día, más deprisa), gris lo que queda y «vie 19:00» al final (mismos colores, alto y parpadeo
  que morCasillas/morHasta de la piel). Al pasar el ratón, «Te quedan …». El texto («Última oportunidad… EN PUNTO…
  ENVIADA…») no cambia; en la tarjeta «Tareas de la semana» sigue el texto. Funciones barraExtraHTML/hastaCorto y la
  rama del aviso en pintarCuenta (solo rehace la barra si cambia, para no reiniciar el parpadeo). Banco 28/28 (GE y
  GP, 1280 y 390). LMEAVathome commit 745cd9a (index.html 95fcec6d…), lmpro este commit (index.html 841b1a7d…).
  Deshacer: APPs/_PARA BORRAR/13-oct-2026-portales-antes-de-la-barra-de-dias/{ge,gp}/. OJO: mismo código en GE y GP.
- 13-oct 23:01 · Fichas y rediseño · HECHO (sin EN CURSO aparte: va en este mismo commit con el index.html de lmpro) ·
  PORTALES GE/GP (index.html), CAMPANA DEL ALUMNO, aviso en TIEMPO EXTRA (Iago: «actualiza el aspecto de tiempo extra
  en notificación» → eligió «Hora de cierre clarísima»). El aviso dice ahora: «Última oportunidad: tienes hasta el
  viernes 16 de octubre a las 19:00 EN PUNTO. Tiene que estar ENVIADA antes de esa hora (pulsar «Entregar»): a las
  19:00:01 ya no entra y se queda el 0.» (la hora y «ENVIADA», resaltadas; la calavera detrás, como antes). La cuenta
  atrás del tiempo extra va sin segundos («Te quedan 2 d 21 h 30 min») y en la última hora «Te quedan 12:34», corriendo
  y destacada. Solo cambia el aviso en tiempo extra (fmtCuentaExtra, pintarCuenta en fase «gracia», cuerpoHTMLX y tres
  reglas de estilo); lo demás, igual (banco 20/20, GE y GP, 1280 y 390). En GP, hecho sobre la versión con Atonalidad
  en prueba (311951e9…). LMEAVathome commit 2acb53c (index.html c6b39c73…), lmpro este commit (index.html 1418c835…).
  Deshacer: APPs/_PARA BORRAR/13-oct-2026-portales-antes-del-tiempo-extra-claro/{ge,gp}/. OJO: es el mismo código en
  GE y GP (solo cambia el color de «en plazo»): si tocas uno, toca el otro.
- 13-oct 22:42 · Intros didácticas (escape room «Atonalidad») · HECHO · PORTAL GP, bloque @MEDALLERO: ANTICIPO DE
  ATONALIDAD SOLO PARA PROTESTER (Iago: «¿puedes activarme solo en Protester ya el portal con todo? Incluyendo el logotipo
  nuevo»). Con la cuenta Protester la medalla u3 sale ABIERTA, con el icono nuevo (u3n: la mansión de neón y grafiti con
  «ATONALIDAD»), y abre el escape room, https://atonalidad.gp.lmathome.es/prueba.html (repo atonalidad, commit 8d9b071:
  prueba.html + atonalidad/, ficheros NUEVOS; el Taller, index.html, sin tocar). Tester y alumnos: como antes, píxel a píxel
  (probado en local). PRUEBA pasa a PRUEBAS (lista) con pruebaDe(m) y «solo» por cuenta (la de Atonalidad: /protester/i).
  lmpro este commit (index.html 311951e9…). Deshacer: borrar la entrada u3 de PRUEBAS (y la línea del icono u3n), o
  subir APPs/_PARA BORRAR/13-oct-2026-portal-gp-antes-de-atonalidad-en-prueba/lmpro/index.html. OJO: si tocas el
  medallero, mantén pruebaDe() en el clic y en el pintado. Historia: APPs/LMATHOME GP (github lmpro)/
  LEEME-13-oct-2026-atonalidad-escape-room-en-prueba.txt
- 13-oct 19:29 · Fichas y rediseño · HECHO (sin EN CURSO aparte: un solo fichero, la piel) · PIEL DE LOS PORTALES,
  CAJA NEGRA → n19 (solo Tester/Protester, con un editor abierto). Iago (19:13): «me ha vuelto a fallar la pantalla»,
  con el arreglo del dibujo ya cargado (recarga 19:12:36). Las tres veces de hoy (17:52, 18:12, 19:13) la pantalla se
  paró 30–40 s DESPUÉS del último toque, no escribiendo; la página seguía viva (recibía toques) y solo cerrar Chrome
  lo arreglaba; sin aceleración por hardware no pasó. Ahora: VELA (Screen Wake Lock: que la pantalla no se atenúe ni
  se apague), un PUNTO de 1 px casi transparente que late cada segundo, colgado de <html> (la gráfica nunca del todo
  quieta; fuera de <body> para no despertar a los vigilantes de la piel), y la caja negra apunta «fps0» (segundos sin
  tocar, vela, foco, animaciones) y «fps-vuelve»; el estado de los partes lleva vela, punto, quieto_s y
  sin_fotogramas_s. LMEAVathome commit 9e6ec69, piel/apps/portal.js 760d7dd0… (CN_V 13-oct-n19). OJO: si tocas la
  sección 19, mantén cnVela/cnPunto/cnQuieto y sus llamadas en cnLatido.
- 13-oct 18:57 · Fichas y rediseño · HECHO (sin EN CURSO aparte: va en este mismo commit con el index.html de lmpro) ·
  PORTALES GE/GP (index.html) y DICTADO AT HOME / DICTADOS PRO (index.html). (1) EDITOR DE ANOTACIONES de las
  lecciones (tsAnotar): la pantalla del aula se quedaba «pillada» escribiendo. La caja negra (lm_caja_negra) lo vio
  dos veces: tras muchos trazos, 0 imágenes por segundo y ninguna tecla (no era el teclado). Cada movimiento del dedo
  volvía a pintar TODOS los trazos de la página con «multiplicar». Ahora: capa con los trazos terminados (pg.base, se
  rehace solo cuando cambian) + el trazo en marcha, como mucho una vez por imagen (requestAnimationFrame). Se ve igual
  píxel a píxel (banco); mientras se escribe, −93 % de puntos trazados. (2) DICTADO DE CLASE A DOS VOCES
  (dibujaDictadoGP y la cabeza «regalo»): al corregir salía la alteración en toda nota alterada (en fa mayor, un bemol
  en cada si bemol). Ahora la pone VexFlow según la armadura y el compás (Accidental.applyAccidentals), como el de una
  voz. LMEAVathome commit dbbc55b (index.html aa5a2f4b…), lmpro este commit (index.html a00be2a4…), dictadoathome
  248330e (b4e3142d…), dictadospro f8aa574 (bdc8efe6…). OJO: el editor de anotaciones y DictadoClase son el mismo
  código en GE y GP (solo cambia ANOT_MODO): si tocas uno, toca el otro. La aceleración por hardware de Chrome del
  ordenador del aula se queda ACTIVADA (sin ella todo iba lento): no propongas quitarla.
- 13-oct 17:28 · Fichas y rediseño · HECHO (sin EN CURSO aparte: solo la caja negra, que es mía) · PIEL DE LOS
  PORTALES, CAJA NEGRA DEL EDITOR (solo Tester/Protester). Iago (13-oct): el editor de ritmo se volvió a enganchar hoy
  en el aula (16:10–16:19, 5 recargas; cerró la ventana a las 16:30) con su teclado Bluetooth prestado en otra aula, y
  Sentry no recibe nada desde la red del centro. (1) Con un editor abierto se apunta lo que llega del TECLADO, el
  RATÓN/PANEL TÁCTIL y la RUEDA (cuándo y de qué clase; nunca qué tecla) y cada parte lleva el resumen «teclado». (2)
  Cada parte va también a la base: rpc lm_caja_negra_guardar(p_token, p_portal, p_version, p_tipo, p_datos) → tabla
  lm_caja_negra (RLS sin políticas, tope 300/día, se borra a los 45 días), firmado con la llave de los morosos; 8 por
  carga como mucho y el perfil del aparato uno cada 6 h; si la función no existe o falla, se calla. SQL pendiente de
  que lo pegue Iago (hasta entonces la piel se calla) (DIARIO PROFESOR
  (…)/SQL-BD/13-oct-2026-caja-negra-a-la-base.sql). LMEAVathome commit 548b5c6, piel/apps/portal.js 21cc160c… (CN_V
  13-oct-n18). OJO: si tocas la caja negra (sección 19 de portal.js), mantén cnBase y la línea «teclado» de cnEstado.
- 12-oct 17:34 · Fichas y rediseño · HECHO (retoque, sin EN CURSO aparte) · LISTA DE MOROSOS: la etiqueta «EN PAPEL»
  pasa a «PAPEL» (lo pidió Iago). DIARIO: deploy 6accfd83 encima de 6accf43d (suite-campana.js 2ccac4ae…; index, ipad
  e iphone piden ?v=s40; 75 ficheros antes y después). PORTALES: LMEAVathome commit 939055f, piel/apps/portal.js
  4bb1a136… (CN_V 12-oct-n17).
- 12-oct 17:07 · Fichas y rediseño · HECHO (sin EN CURSO aparte: solo el bloque de morosos, que llevo yo) · LISTA DE
  MOROSOS, «PROPUESTA B» elegida por Iago, igual en el Diario y en los dos portales: tarjetas de contorno rojo (ya no
  rojo opaco), todas de 58 px; 7 casillas, una por día, que acaban en SU final (con prórroga): días pasados en rojo,
  hoy en ámbar que se va llenando y parpadea (más rápido el último día) y «vie 19:00»; EN PAPEL lleva un recuadro «ya
  entregó» (verde; al volver a abrir ya no sale), DIGITAL nada más; los ceros, aparte, en negro con su 0 y una
  cabecera para cada parte («En periodo extra · N», «Se acabó · cero · N»). Sin cuenta atrás en segundos: con la lista
  abierta se repinta cada minuto. DIARIO: deploy 6accf43d encima de 6acb6139 (suite-campana.js 1b1873e9…; index, ipad
  e iphone piden ?v=s39). PORTALES: LMEAVathome commit 97639eb, piel/apps/portal.js 563781b9… (CN_V 12-oct-n16; la
  usan GE y GP). Sin cambios en Supabase. OJO: si tocas la lista de morosos, el diseño vive en dos sitios
  (suite-campana.js del Diario, clases .smor-*, y piel/apps/portal.js, clases .lm-mor-*): cambia los dos.
- 11-oct 12:14 · Fichas y rediseño · HECHO (retoque) · DIARIO, deploy 6acb6139 encima de 6acb6028: en la ventana
  «Semana guardada», los botones de clase del selector de unidad pasan a «C1 · C2» (regla de Iago para controles:
  nunca «Clase 1 / Clase 2»). Solo app.js (d83) e index.html.
- 11-oct 12:09 · Fichas y rediseño · HECHO (retoque, sin EN CURSO aparte) · DIARIO, deploy 6acb6028 encima de
  6acb5a11: DICTADO «+1» CON SALTOS. En la biblioteca de 2º GP, 3.mxl y 4.mxl empiezan igual; Iago eligió saltarse el
  4 también en los cursos que vienen. diario-dictado-clase.js: _dictTablaSaltos ({2gp: {4}}),
  DictadoBiblioteca.siguiente/saltado y «· se salta» en el desplegable; diario-progresion.js (progDictado GE/GP) y
  diario-semana-siguiente.js (dictObjetivo) usan ese siguiente en vez de +1; index.html r19/r22/s3. Datos (desde el
  Diario, con su permiso): 2º GP semana 42 → nº 5 y semana 43 → nº 6, «a mano». 4º GE sin cambios.
- 11-oct 11:46 · Fichas y rediseño · HECHO (retoque, sin EN CURSO aparte) · DIARIO (Netlify diariodeiagocmus), deploy
  6acb5a11 encima de 6aca3b28: ventana «Semana guardada» de 2º GP (solo ordenador). La unidad activa se pinta en CADA
  apertura (el modal se reutiliza y se quedaba con la unidad de la primera vez) y lleva debajo las unidades como la
  cabecera: tocar otra → «Clase 1 · Clase 2 · Cancelar» → u2gpCambiarUnidad (la misma de la cabecera). Panel con tope
  de alto y scroll dentro. Solo app.js (bkpPintarUnidad, nueva) e index.html (app.js?v=d82); 75 ficheros antes y
  después. Sin cambios en Supabase.
- 11-oct 11:16 · Fichas y rediseño · HECHO (retoque, mismos bloques) · TARJETA DE RECLAMACIÓN EN LA CAMPANA DEL
  ALUMNO, OPCIÓN 2 elegida por Iago: «Ver mi ficha corregida» a la izquierda y «Marcar como leído» · «↩ Contestar a
  Iago» a la derecha en UNA fila al pie (.alu-recl-pie, con el grupo derecho .alu-recl-acc), todo a la misma altura;
  el mensaje ocupa todo el ancho; en el móvil, «Ver mi ficha» a lo ancho y debajo los dos botones. Igual en la tarjeta
  «Ficha N en papel ¡Corregida!». «Ficha N» con espacio duro en los títulos. Portal GE: LMEAVathome commit 1a46268
  (index.html ac703d4c…). Portal GP: este commit (index.html 87cfbba2…).
- 11-oct 11:00 · Fichas y rediseño · HECHO (retoque, sin EN CURSO aparte: mismos bloques que el 10-oct) · OJEADOR Y «↩
  CONTESTAR A IAGO»: en el Ojeador del profesor (#visor=) la tarjeta de reclamación enseña el botón como lo ve el
  alumno; la ventana avisa «Ojeador: así lo ve el alumno. Desde aquí no se envía nada.» y «Enviar» va siempre apagado
  (abrirContestar corta el envío con window.__VISOR; la RPC sigue en el BLOCK del Ojeador). Portal GE: LMEAVathome
  commit 5807414 (index.html 3f2c4f65…). Portal GP: este commit (index.html 8cc7e133…). Para el alumno no cambia nada.
- 10-oct 15:22 · Fichas y rediseño · HECHO · «↩ CONTESTAR A IAGO» EN LAS RESPUESTAS A RECLAMACIONES. Diario: Netlify
  deploy 6aca3b28 encima de 6ac936ad (suite-campana.js 2a8588e8…; index, ipad e iphone piden ?v=s37; 75 ficheros, el
  resto idéntico). Portal GE: LMEAVathome commit 9255a1d (index.html d6a5a7fc…). Portal GP: este commit (index.html
  345e423f…). Supabase: las 2 funciones, pegadas por Iago y comprobadas (idénticas a las ensayadas). OJO A PARTIR DE
  AHORA: (1) suite_notificaciones.payload_json.respuesta_alumno lo escribe el ALUMNO: si reescribes payloads de
  notificaciones, no lo pises; (2) el aviso de reclamación que manda la campana del Diario (suite_notif_crear con
  payload.reclamacion = true) se puede contestar: mantén reclamacion_ficha_id y ejercicios; (3) en los portales, la
  tarjeta de reclamación lleva ahora .alu-recl-acc (dos botones en columna) y la ventana #alu-resp-modal (z-index
  1000).
- 10-oct 15:16 · Fichas y rediseño · EN CURSO · «↩ CONTESTAR A IAGO» EN LAS RESPUESTAS A RECLAMACIONES: el alumno
  puede contestar UNA vez a cada respuesta de Iago a su reclamación (ventana emergente desde la tarjeta de la campana
  del portal; le llega a la campana del Diario con ACEPTAR · DENEGAR · COMENTAR). SUPABASE (pegado por Iago hoy y
  comprobado): suite_alumno_reclamacion_contestar(p_cuenta_id, p_notif_id, p_texto) guarda la respuesta DENTRO de la
  notificación (suite_notificaciones.payload_json.respuesta_alumno = {texto, en}) y la deja leída;
  suite_reclamacion_respuestas_listar(p_secreto, p_limite) las lista para la campana. Toco: index.html de lmpro y de
  LMEAVathome (tarjeta de reclamación de la campana del alumno, función abrirContestar, estilos
  .alu-recl-acc/.alu-resp-*, y la RPC nueva en el BLOCK del Ojeador) y, en el Diario (Netlify), suite-campana.js (+
  ?v=s37 en index, ipad e iphone). No toques esos bloques hasta que ponga HECHO.
- 9-oct 21:05 · Fichas y rediseño · HECHO · SUPABASE: Iago pegó a las 21:00 el SQL de prácticas hasta el 15-jun-2027;
  comprobado solo leyendo (suite_login_alumno_v2 y suite_registrar_alumno_v4 idénticas a las ensayadas; la original de
  entrar, intacta en _suite_login_alumno_v2_alumnos y sin permiso para anon; pg_cron lm_practicas_cerrar «1 * * * *»
  activo; copia en _bak_funciones_20261009_practicas_fin). OJO A PARTIR DE AHORA: suite_login_alumno_v2 es una
  «puerta»; si cambias cómo se entra, cambia _suite_login_alumno_v2_alumnos. OJO TAMBIÉN, EGRESS DE SUPABASE: la
  organización (plan Free, 5 GB/mes) superó el egress en el ciclo anterior y va por 8,07 GB en el actual (18-sep a
  18-oct; el pico fue del 24-sep al 2-oct, casi todo PostgREST). Periodo de gracia hasta el 1-nov. Desde el 3-oct va a
  unos 80 MB/día. Evita lecturas grandes o repetidas contra la base de verdad (vistas enteras, select * sin filtro,
  bucles de pruebas): usa datos de prueba.
- 9-oct 20:52 · Fichas y rediseño · HECHO · (1) DIARIO (Netlify diariodeiagocmus) deploy 6ac936ad encima de 6ac89f57
  (75 ficheros; solo cambian 5): ipad.html (beamsPorPulso: la corchea con puntillo y los tresillos con su duración; el
  ojo de la escaleta y el «Revelar» del dictado agrupan por pulsos como la solución del generador), suite-campana.css
  + suite-campana.js (los ceros automáticos de la campana, en negro con calavera; la lista del botón de morosos es la
  del portal de Tester/Protester: rojos con cuenta atrás y calaveras abajo, «Ya entregó» por
  suite_morosos_ya_entrego_token con la llave lm-morosos-v1; datos de suite_pendientes_fichas, sin cambios en la base)
  e index.html / iphone.html, que solo cambian ?v (s36 / d56). (2) CORRECCIÓN DE DICTADOS ELEMENTAL (Netlify
  dictadoselemental) deploy 6ac93722 encima de 6ac61a17: pantalla-7oct.js (la pantalla del aula solo enseña las notas
  del día de la última corrección del grupo) y pantalla.html (?v=3). (3) SUPABASE: preparado y SIN PEGAR (lo pega
  Iago): cuentas de prácticas con acceso hasta el 15-jun-2027 (suite_practicas.hasta y cerrada_en; puerta en
  suite_login_alumno_v2 con la original intacta en _suite_login_alumno_v2_alumnos; la puerta suite_registrar_alumno_v4
  con la fecha; pg_cron lm_practicas_cerrar cada hora). El SQL comprueba antes que esas dos funciones siguen como hoy:
  si las cambias, se parará sin tocar nada; apúntalo aquí.
- 9-oct 10:02 · Fichas y rediseño · HECHO · (1) CUENTAS DE PRÁCTICAS en Supabase: el SQL lo pegó Iago esta mañana;
  comprobado solo leyendo (las 23 funciones nuevas, idénticas a las ensayadas; copia de las 16 de antes en
  _bak_funciones_20261009_practicas). OJO A PARTIR DE AHORA: estas 14 funciones son «puertas» y la original está tal
  cual en _<nombre>_alumnos: suite_registrar_alumno_v4, suite_ficha_entregar, suite_ficha_revision_alumno,
  suite_fichas_entregadas, suite_semana_hechos_de, suite_quiz_hechos_de, suite_quiz_completar, suite_formato_leer,
  suite_alumno_notif_listar, suite_alumno_notif_contador, suite_uso_ping, suite_tiempo_ping, suite_pass_reset_v2 y
  suite_mis_resultados. Si cambias una, cambia la _…_alumnos (o la puerta, si es para prácticas): NO pegues encima una
  copia vieja con el nombre de la puerta. También cambiaron suite_listar_pendientes_v3 (lista «practicas») y
  suite_morosos (sin prácticas; una fila por alumno). (2) DIARIO deploy 6ac89f57 encima de 6ac80b00: «Tienes que
  volver a entrar» solo sale si hay versión nueva. Cada publicación del Diario la avisa Netlify (hook «Deploy
  succeeded») a la función de Supabase diario-publicado, que apunta la hora en app_config «diario_publicado»; no hay
  que hacer nada al publicar. (3) LMEAVathome: cancelada, con permiso de Iago, la publicación #216 (aedee0f, del
  6-oct) que seguía en cola; no queda nada en cola.
- 8-oct 23:33 · Fichas y rediseño · HECHO (parte de las CUENTAS DE PRÁCTICAS) · DIARIO (Netlify diariodeiagocmus)
  deploy 6ac80b00 encima de 6ac7f9f8: la campana enseña los avisos de las cuentas de prácticas (alta, ficha con su
  nota, quiz), que vendrán en una lista nueva «practicas» de suite_listar_pendientes_v3. suite-campana.js?v=s35;
  index.html, ipad.html e iphone.html solo cambian esa versión. Mientras no esté el SQL, la lista llega vacía y no
  cambia nada (probado). SIGUE EN CURSO: el SQL lo pega Iago el 9-oct a las 9:30. Cambiará: suite_cuentas (columna
  practicas), 3 tablas nuevas suite_practicas*, 14 funciones del alumno (se renombran tal cual a _<nombre>_alumnos y
  queda una «puerta» con el mismo nombre y parámetros: registrar_v4, ficha_entregar, ficha_revision_alumno,
  fichas_entregadas, semana_hechos_de, quiz_hechos_de, quiz_completar, formato_leer, alumno_notif_listar,
  alumno_notif_contador, uso_ping, tiempo_ping, pass_reset_v2, mis_resultados) y 2 del profesor
  (suite_listar_pendientes_v3 y suite_morosos). Si tocas alguna, parte de la versión que haya después de las 9:30.
- 8-oct 22:44 · Fichas y rediseño · EN CURSO (mañana 9-oct, desde las 9:30) · CUENTAS DE PRÁCTICAS en los portales
  (tres usuarias que no son alumnas: entran como alumnas pero no cuentan en notas, listas, Diario, informes ni
  morosos). Tocará: Supabase (una marca central en suite_cuentas y las funciones que listan o puntúan; el SQL lo pega
  Iago), piel/apps/portal.js de LMEAVathome y, si hace falta, el Diario. Si vas a tocar el alta/validación de cuentas,
  las funciones de morosos o el envío semanal, avisa aquí antes.
- 8-oct 22:44 · Fichas y rediseño · HECHO · (1) DIARIO (Netlify diariodeiagocmus) deploy 6ac7f9f8 encima de 6ac5429a:
  Intervalia Pro de 2.º GP automática: cada jueves con clase, la sesión siguiente (s1 → s2 → s1 de la lección
  siguiente), una sola cuenta para los dos grupos; regla única en diario-intervalia-pro.js (nuevo), usada por
  diario-progresion.js?v=r21, diario-semana-siguiente.js?v=s2 e ipad.html; app.js?v=d81. Solo escribe filas de
  intervalia_uso de la semana de HOY. (2) LMEAVathome · piel/apps/portal.js (los dos portales) · commit f59dba4 ·
  versión 8-oct-n15: lista de morosos de Tester/Protester con cuenta atrás (d h min s, hasta el fin del periodo extra
  de cada uno) y una fila por alumno según alumno_canon_id (había alumnos con dos cuentas validadas). (3)
  PreDictPROCarrusel · index.html · commit 375e918: melódico que puntúa notas + intervalos y espera a las respuestas
  (hasta 2,5 s); armónico con cuenta atrás «CORRECCIÓN» y corrección de la 1.ª parte antes de la 2.ª. Sin cambios en
  la base de datos. Comprobado antes: últimos commits LMEAVathome 1535a6a, PreDictPROCarrusel cd0a954, lmpro 4ecfde3;
  Diario vivo 6ac5429a. Comprobado después: los tres sirven la versión nueva. OJO: en LMEAVathome sigue EN COLA el run
  216 (commit aedee0f, del 6-oct); si arrancara, publicaría lo del 6-oct encima de todo: que lo cancele Iago.
- 8-oct 22:02 · Intros didácticas (la conversación de los vídeos y de «La cabaña») · HECHO · «La cabaña» OFICIAL (EN CURSO en
  3cc99b8; Iago: «la única forma para acceder por parte de los alumnos al portal de acústica será pulsando la medalla una
  vez que esté desbloqueada»). (1) ESTE REPO, commit e22af28, index.html, solo @MEDALLERO: la medalla u2 abre «La cabaña»
  para todos (https://acustica.gp.lmathome.es/prueba.html), con el icono nuevo al abrirse y, cerrada, la sombra de
  siempre (probado en local con sesiones simuladas: el medallero cerrado de un alumno sale idéntico, píxel a píxel). A
  los alumnos se les abre como todas: el viernes a las 19:00 de la semana en que Iago guarda la unidad 2 (previsto el
  viernes 16-oct). Tester/Protester ya la tienen abierta (PRUEBA queda como anticipo). (2) cualidadesdelsonido, commit
  af38999: index.html deja de ser el laboratorio antiguo y pasa a ser un aviso («Este laboratorio se abre desde su
  medalla, en el portal de 2.º GP» y un enlace a gp.lmathome.es); el antiguo, en APPs/_PARA BORRAR/
  8-oct-2026-acustica-laboratorio-antiguo/. Comprobado en vivo a las 22:01: gp.lmathome.es/index.html y
  acustica.gp.lmathome.es/index.html, idénticos a los subidos. QUIEN TOQUE EL MEDALLERO, QUE PARTA DE e22af28.
  Deshacer: «Revert» de e22af28 (medalla) y de af38999 (laboratorio antiguo). Nota: APPs/LMATHOME GP (github lmpro)/
  LEEME-8-oct-2026-acustica-la-cabana-oficial.txt.
- 8-oct 10:29 · Intros didácticas (la conversación de los vídeos y de «La cabaña») · HECHO · «La cabaña» VERSIÓN 3 (Iago,
  8-oct: «prefiero que no vibren. Eso se lo dejamos a la flauta»). cualidadesdelsonido 43a705d (encima de 6ea83c6),
  revisión 10081005: el oboe sin vibrato (su grabación: el ataque real y luego la nota quieta en 440 Hz) e igual de
  fuerte que el clarinete (sonios, ISO 532-1), en el vídeo del Día 3 (tramo 2, a 60 y a 30 fotogramas) y en la parada
  «De oboe a clarinete» (el botón pasa a ser «Oír la grabación del oboe»). Cambian 7 ficheros (18 MB): prueba.html,
  cabana/LEEME.txt, cabana/a/oboe_A4.mp3, cabana/manifest.json, cabana/manifest30.json, cabana/v/d3_2.mp4 y
  cabana/v30/d3_2.mp4. QUIEN TOQUE prueba.html O cabana/, QUE PARTA DE 43a705d. Comprobado antes de subir (sitio real
  H.264, 1080p60 y 720p30) y después, en la web real a las 10:28: los 7 ficheros, idénticos byte a byte a los del commit
  y a los del espejo. Los 3 de sonido y vídeo llevan la marca de procedencia (C2PA) de la entrega; descontándola, son
  idénticos a los montados. index.html de Acústica y este portal (lmpro), SIN TOCAR. Deshacer: «Revert» de 43a705d.
  Espejo de Dropbox al día; los 7 ficheros de la versión 2, en APPs/_PARA BORRAR/
  8-oct-2026-la-cabana-v2-antes-del-oboe-sin-vibrato/. Nota: APPs/LMATHOME GP (github lmpro)/
  LEEME-8-oct-2026-acustica-la-cabana-version-3.txt.
- 8-oct 09:52 · Fichas y rediseño · HECHO · en este mismo commit, junto a index.html (sin EN CURSO previo: un solo
  fichero, publicado en un minuto; comprobado antes que el último commit seguía siendo c306744 y el vivo, 84089193).
  Iago: «no es necesario que el alumno tenga lo de solución (la pizarra del profesor) editable. esa siempre estará
  bien colocada». En «Ver dictado y solución», la foto de la SOLUCIÓN ya no lleva ↻ ni deslizador: se ve entera, como
  antes del 7-oct, y al tocarla se abre a tamaño completo. La foto del alumno sigue igual (↻, deslizador y colocador).
  Solo index.html: el rótulo de la solución, la llamada a dvGiroZoom (solo figure.dv-mia) y la línea de ayuda.
- 7-oct 23:25 · Fichas y rediseño · HECHO · colocador automático de la foto del dictado + zoom calibrado (EN CURSO en
  440f1ae). Iago: «casi nunca me aparece bien colocada y tengo que andar rotando y ampliando… como coger de referencia
  claves de sol… también es demasiado sensible el zoom» y «que el visor del alumno tenga también el sistema mejorado
  de colocar la imagen». (1) NETLIFY dictadosprofesional → deploy 6ac6b80a73ed (antes 6ac604410b42; 26 → 27 ficheros;
  quien toque ese sitio, que parta de ahí). coloca-foto.js (NUEVO, 148 KB, sin dependencias): detector LMColoca; mira
  la foto EN EL NAVEGADOR (nada sale de él) y devuelve giro 0/90/180/270, inclinación fina y la caja de lo escrito,
  con sus confianzas; LMColoca.decide() es la política prudente (umbral 0,9): solo si está seguro se gira + endereza +
  encuadra; tumbada sin saber hacia qué lado → solo se gira; si duda → no se toca. zoom-foto.js (z2): aplica eso a la
  foto del alumno (window.ZFColoca, que llama panel.js al cargar la foto), pastilla «✓ Colocada sola · ver entera /
  encuadrar» junto al ↻, la foto girada cabe entera, y la rueda amplía en proporción al gesto y hacia el cursor
  (mandos arriba del fichero: ZF_RUEDA, ZF_PELLIZCO, ZF_TOPE, ZF_AIRE, ZF_FRANJA). Apunta en localStorage
  «zf_coloca_log» solo números (qué propuso y cómo quedó), nada de la foto. panel.js: en renderReviewStep se QUITA el
  giro a ciegas de la foto que llegaba «de pie» y se llama a ZFColoca; la solución y el modal de detalle no se tocan.
  profesor.html: panel.js?v=p18, coloca-foto.js?v=c1, zoom-foto.js?v=z2. Para volver atrás: quitar la línea de
  coloca-foto.js en profesor.html (la foto se queda como llega) o republicar el deploy anterior. (2) ESTE REPO →
  commit 58601af: coloca-foto.js (el mismo fichero, en la raíz) e index.html, solo dvGiroZoom / abrirVisorDictado y
  sus estilos: en «Ver dictado y solución» la foto DEL ALUMNO se coloca sola con la misma política (el detector se
  pide solo al abrir el visor); pastilla en una barrita debajo de la foto; la solución no se toca; si el fichero no
  carga o la foto no se puede leer, el visor queda como estaba. Apagarlo: DV_COLOCA=false. OJO: probado con fotos
  SINTÉTICAS, no con fotos reales de alumnos; tampoco en Safari / iPad. Nada de Supabase.
- 7-oct 22:01 · Fichas y rediseño · HECHO · commit 8be265c (EN CURSO en 22c54d3, parto de 24f29af) · index.html de este
  portal, SOLO el visor «Ver dictado y solución» de la campana del alumno. Iago: «la suya, la de su dictado, no se la deja
  girar. Me gustaría que tuviesen la opción de girar y aumentar, al igual que tengo yo en la parte del profesor».
  abrirVisorDictado(dj) se reescribe y gana una ayudante, dvGiroZoom(fig): cada foto (la del alumno y las de la
  solución) lleva en su rótulo un ↻ (.dv-girar, 90° por toque) y, a la derecha, un deslizador vertical de 1× a 3×
  (.dv-side/.dv-rail; también pellizco, Ctrl + rueda y teclas + − 0); ampliada, se arrastra sin poder «perderla»; la
  cifra vuelve a 1×. La foto va ENTERA en su marco (.dv-lz; en el móvil salía recortada) y sin ampliar sigue abriéndose
  en otra pestaña al tocarla. NO se gira sola (sale como llega, igual que antes): el colocador automático se añadirá
  más adelante, a la vez que en el panel del profesor. Estilos nuevos tras `.dictado-visor .dv-tip`; además
  `.dictado-visor .dv-body{grid-auto-rows:max-content}`. No toca nada más del portal, ni la piel, ni la base de datos.
  Para volver: git revert 8be265c, o subir el index.html de APPs/_PARA BORRAR/7-oct-2026-noche-portal-gp-antes-del-
  visor-con-giro/. Espejo de Dropbox igual que GitHub. Sin probar en Safari/iPad real (45 comprobaciones en Chromium).
- 7-oct 21:55 · Intros didácticas (la conversación de los vídeos y de «La cabaña») · HECHO · «La cabaña» VERSIÓN 2 (Iago
  la revisó entera el 7-oct con la cuenta Protester y dictó 24 correcciones; van todas). cualidadesdelsonido 6ea83c6
  (encima de 5bb582f): prueba.html y cabana/, revisión 10072009. Cambian o son nuevos 67 ficheros (478 MB) y se quitan
  11 que sobraban (a/amb_valle.mp3, a/mus_dentro.mp3, i/vacia_1·2·4·5·6.jpg y los vídeos d2_6 y d3_6, que ahora van
  dentro de d2_5 y d3_5). index.html de Acústica y este portal (lmpro), SIN TOCAR: sigue siendo una página EN PRUEBA,
  solo para Tester/Protester, en https://acustica.gp.lmathome.es/prueba.html. QUIEN TOQUE prueba.html O cabana/, QUE
  PARTA DE 6ea83c6. Qué cambia: (a) la música y los ambientes de fondo ya NO van dentro de los vídeos: los lleva la
  página (cabana/a/cama_*.mp3 + las curvas que van en prueba.html), seguidos, también en las paradas; (b) pausa en
  cualquier momento y portada con sonido; (c) fuera todos los círculos que rodeaban cosas; (d) al volver de una parada
  ya no asoma lo de antes; (e) Día 1: agudo/grave en vivo, 4'33'' sumándose poco a poco, capas en escalera; (f) Día 2:
  títulos que se añaden, la radio en otro orden, la cabaña vacía de tres pasos con cuenta atrás al grabar, libretas
  retocadas, sin la parada del sonómetro; (g) Día 3: parada nueva «De oboe a clarinete» (la grabación del oboe partida
  en sus armónicos: solo cambia el volumen de cada uno) y sin la parada de la serie armónica. Comprobado antes de subir:
  cada vídeo contra sus fuentes (527 fotogramas, 0 distintos), los tres días recorridos enteros en la página de pruebas
  y el sitio real (H.264) a 1080p60 y 720p30, dos veces (la segunda, con los ficheros tal como llegaron al Mac); y
  después, en la web real: los manifiestos de 60 y de 30 fotogramas responden con la revisión 10072009 (están cama_valle
  y oboe_A4; ya no están d2_6 ni d3_6) y origin/main es 6ea83c6, con el mismo árbol de 205 ficheros que se comprobó
  fichero a fichero contra el espejo. Deshacer: «Revert» de 6ea83c6 (la versión 1 es 5bb582f). Nota: APPs/LMATHOME GP
  (github lmpro)/LEEME-7-oct-2026-acustica-la-cabana-version-2.txt. Fuentes: …/_MATERIALES VÍDEOS
  TEMÁTICOS/ACÚSTICA/pagina_interactiva_fuentes_7oct_v2.zip. Espejo de Dropbox al día (CUALIDADES DEL SONIDO/); lo que
  sobraba de la versión 1, en APPs/_PARA BORRAR/7-oct-2026-la-cabana-v1-lo-que-sobra/. AVISO PARA TODAS LAS
  CONVERSACIONES: los vídeos, imágenes y sonidos que Claude pasa al Mac llegan ahora con una marca de procedencia dentro
  («credenciales de contenido», C2PA, firmada por Anthropic: «Claude proporcionó este fichero…»), unos 6 KB más por
  fichero. La llevan 61 de estos 67, así que su md5 YA NO es el del fichero montado; imagen y sonido, idénticos
  (comprobado descontando los bytes de la marca, y el sitio vuelto a probar entero con ella puesta). No hay que quitarla
  ni empaquetar los ficheros para esquivarla: las entregas se comprueban por el contenido, no por la huella del fichero.
- 7-oct 12:15 · Fichas y rediseño · HECHO · apps de corrección, dos tandas más en Netlify (cada despliegue solo con
  sus ficheros; el resto idéntico al anterior). (A) sw.js REVISIÓN 3 en las cuatro apps que viven en *.lmathome.es: la
  banda «Versión nueva lista» no salía nunca porque sw.js comparaba etag/last-modified y Cloudflare se los quita al
  HTML, así que cada versión nueva se veía a la segunda apertura. Ahora la página se pide primero a la red (3,5 s de
  margen; si no llega, la copia guardada: igual que el sw del Diario) y, para avisar, se compara el TEXTO de la
  página. El nombre de la caché NO cambia (lm-clase-r1-2026-09-22); dentro, const REVISION = 'r3-2026-10-07'.
  Despliegues: entonacionelemental 6ac615babd46, ritmoelemental 6ac616d3cda4, dictadoselemental 6ac616d33abc y
  ritmoentonadoprofesional 6ac616d3d36a (este es el VIVO de ese sitio). NO se ha tocado el sw.js de
  dictadosprofesional ni el de fichasteoria (siguen en la revisión 1: en netlify.app las cabeceras sí llegan). Sin
  probar en Safari. (B) Entonación, Ritmo y Dictado elemental: escribir OTRA nota a mano en el resumen BORRA los
  parámetros de esa fila (ent_notas; rit_notas cuando hay una sola clave; corr_notas) y la vista del iPad dice «Nota
  corregida a mano». Cambian app-7oct.js y pantalla-7oct.js; index.html y pantalla.html pasan a llamarlos con ?v=2.
  (C) Dictado, «Corrección manual GP»: la app manda también pres_caligrafia a la tabla dictados y, mientras la columna
  no exista, repite el guardado sin ella. Despliegues de B y C, que son los VIVOS: entonacionelemental 6ac619e1fd2a,
  ritmoelemental 6ac61a0abc0e y dictadoselemental 6ac61a179387. Quien toque esos sitios, que parta de ahí. PENDIENTE
  DE IAGO: pegar en Supabase «PEGAR-7-oct-2026--caligrafia-en-dictados.sql» (carpeta SQL-BD del Diario): añade la
  columna dictados.pres_caligrafia y la clave pres_caligrafia a lo que guardan en evaluaciones.payload_json las
  funciones evaluaciones_upsert_dictados y evaluaciones_upsert_corr_notas. Lleva un seguro por huella md5 de esas dos
  funciones: quien las cambie antes de que se pegue tiene que rehacer ese texto sobre la versión nueva. FALTA en el
  Diario (diario-lupa.js): las filas «Caligrafía y limpieza» y «Otro»; van en el próximo despliegue agrupado. LEEME en
  Dropbox: «APPS CORRECCION (netlify
  x6)/LEEME-7-OCT-mediodia-version-nueva-a-la-primera-y-nota-a-mano-borra-parametros.txt».
- 7-oct 10:50 · Fichas y rediseño · HECHO · seis despliegues en Netlify (de 10:30 a 10:35), cada uno solo con sus
  ficheros y el resto idéntico al anterior. (1) Resumen final EN DOS ZONAS en las cuatro apps de corrección: tocar la
  tarjeta del alumno abre su corrección con sus parámetros y tocar el recuadro de la nota deja escribirla a mano
  (marca «a mano» y aviso al abrir la corrección). Ficheros nuevos resumen-editable-7oct.js/.css (iguales en las
  cuatro) y app-7oct.js (app-r27.js en Ritmo entonado PRO), más index.html; app.js, app-buscador.js, app-r26.js y
  resumen-editable.js NO se tocan (los usan las páginas guardadas en los aparatos). (2) Vista del iPad (pantalla.html
  y pantalla-7oct.js nuevo; pantalla.js no se toca) en Entonación, Ritmo y Dictado: rótulo «Nota ajustada a mano» con
  el desglose atenuado, o «Nota puesta a mano» si la fila no trae parámetros. (3) Dictado: los nombres de 2.º GP en la
  «Corrección manual GP» (sin tildes ni mayúsculas, vale una palabra del nombre y, si casan varios, se pide el
  apellido), dentro de app-7oct.js. Despliegues: entonacionelemental 6ac603c2 (encima de 6abf9226), ritmoelemental
  6ac603dc (encima de 6abf91ed), dictadoselemental 6ac603f9 (encima de 6ac00f92) y ritmoentonadoprofesional 6ac6033f
  (encima de 6abfe8a1). (4) dictadosprofesional 6ac60441 (encima de 6abd49f0): parámetro «Otro» en la autocorrección
  del alumno, hasta 1 punto menos y con el motivo escrito (app.js, index.html y styles.css; panel.js y profesor.html
  con panel.js?v=p17). Usa otro_puntos y otro_desc de la tabla dictados, que ya existían. FALTA la fila «Otro» en la
  lupa del Diario (diario-lupa.js): va en el próximo despliegue agrupado del Diario. (5) fichasenpapel-cmus 6ac60450
  (encima de 6ac56693; solo index.html, pie «versión 7-oct»): una Ficha 1 que ya tiene nota no dice «va a Ev.
  inicial». Quien toque cualquiera de esos seis sitios, que parta de estos despliegues. LEEME, copias
  (.bak-antes-…-20261007) y guiones en Dropbox, «APPS CORRECCION (netlify x6)».
- 7-oct 10:30 · Fichas y rediseño · HECHO · tres cosas. (1) LMEAVathome 1535a6a (encima de aedee0f; solo
  piel/apps/portal.js, versión «7-oct-n14»): el editor de lecciones aguanta el táctil enganchado del ordenador del
  aula (clics y punteros de reserva, aro rojo donde la pantalla nota algo apoyado, aviso «táctil enganchado», «caja
  negra» con ?caja=1). Con esa subida salió también la campana cronológica de aedee0f, cuyo despliegue de Pages (#216)
  se había quedado en cola. OJO: #216 sigue «Queued» y, si arrancase, repondría la web anterior; lo cancela Iago.
  Quien toque piel/apps/portal.js, que parta de 1535a6a. (2) ritmoathome 3a207a8 (encima de 8a2766b; solo index.html):
  carta 1.4, la síncopa doble en la intro (su pregunta, su fusión y su rama del árbol) y «síncopa estándar» en lugar
  de «síncopa simple». (3) Supabase, pegado por Iago a las 09:58
  (SQL-BD/YA-PEGADO-7-oct-09h58--arreglo-ceros-y-prorroga-por-alumno.sql). ARREGLO del barrido de ceros de las fichas:
  se caía entero en cuanto dos alumnos de una misma ficha se quedaban sin entregar, porque el aviso al alumno llevaba
  la misma referencia para todos y suite_notificaciones no la admite repetida; ahora la referencia es
  <ficha>:cero:<alumno>. Y PRÓRROGA POR ALUMNO, solo papel: tabla suite_ficha_prorroga, _suite_fin_gracia_de y
  suite_ficha_prorrogar / suite_ficha_prorrogar_a / suite_ficha_prorroga_quitar (solo desde el editor de SQL). Cambian
  suite_fichas_barrer_vencidas, suite_morosos_fichas_v2, suite_pendientes_fichas y suite_morosos_ya_entrego_token
  (copia de las de antes en _bak_funciones_20261007): las filas de las listas traen una clave nueva, «prorroga», y su
  fin_gracia pasa a ser el del alumno. Quien toque esas cuatro funciones, que parta de las de ahora. Para quitar la
  prórroga dejando el arreglo: SQL-BD/DESHACER-7-oct-2026--prorroga-por-alumno.sql. Vistos y NO tocados:
  suite_recos_barrer usa una referencia de aviso sin el alumno (el mismo choque cuando haya recomendaciones) y
  _suite_ficha_retirar pone el estado «retirada», que el CHECK de suite_fichas_asignadas no admite.
- 6-oct 23:30 · Fichas y rediseño · HECHO · tres publicaciones de esta noche y un arreglo de datos. (1) Netlify
  diariodeiagocmus 6ac5429a (encima de 6ac4bdf5; app.js, ipad.html e index.html con app.js?v=d80): Intervalia PRO de
  2.º GP en la clase 2 por defecto, botones C1/C2 excluyentes en Preparación de clases y 9 minutos
  (bloques_data.__intervalia_pro_clase e intervalia_uso.clase). Quien toque el Diario, que parta de 6ac5429a. (2)
  Campana del alumno por orden cronológico en los dos portales, solo index.html: LMEAVathome aedee0f (encima de
  c0c7ab9) y lmpro 5f88c3b (encima de 83f1ac7). El orden es por creado_en, lo más reciente arriba; solo se quedan
  fijados arriba papelNueva y enTiempoExtra (función _cuandoAviso). (3) Netlify fichasenpapel-cmus 6ac56693 (encima de
  6ac0cbe6; solo index.html, pie «versión 6-oct»): periodo a prueba de despistes (franja ámbar fija si lo elegido no
  es el periodo de hoy, el botón dice «Guardar en 1T», pregunta antes de guardar una ficha normal fuera del periodo de
  hoy, un solo mensaje final con el periodo); fichas «Ya corregidas» a la vista, las de papel se vuelven a abrir y, si
  están en un periodo distinto al del día en que se corrigieron, botón «Pasar a 1T»; en la lista salen también los
  alumnos en digital con una ficha en papel sin corregir (suite_pendientes_fichas, formato papel o estado entrego);
  tras guardar se vuelve a leer la nota y se compara; el 0 automático ya no cuenta como corregida. Una ficha cuya nota
  es de la ficha DIGITAL aquí solo se ve (antes se le podía poner otra de papel encima y en el Diario seguía contando
  la digital). Claves nuevas en evaluaciones.payload_json: periodo_confirmado, movida_de, movida_el. No cambia ninguna
  tabla ni función. (4) Supabase, SOLO DATOS, lo pegó Iago a las 23:06: las Fichas 2 y 3 de un alumno de 2GpF, que la
  app había guardado en «Ev. inicial» (el iPhone tenía ese periodo elegido), pasan a 1T, y las dos copias tecleadas a
  mano en 1T quedan retiradas como las retira el Diario (fila diario_manual sin nota ni lección, payload retirada;
  casillas de eval_overrides quitadas). Copia en _bak_david_fichas_20261006 (RLS activado, sin permisos para anon).
  SQL y su DESHACER en Dropbox, APPs/DIARIO PROFESOR (netlify
  diariodeiagocmus)/SQL-BD/YA-PEGADO-6-oct-23h06--david-fichas-2-y-3-a-1T.sql. Copias, espejos y LEEME en Dropbox:
  APPs/DIARIO PROFESOR (netlify diariodeiagocmus)/LEEME-6-oct-2026-deploy-6ac5429a-intervalia-pro-en-c2.txt;
  LEEME-6-oct-2026-campana-por-orden-de-fecha.txt en las carpetas de GE y de GP; APPs/APPS CORRECCION (netlify
  x6)/FICHAS EN PAPEL (netlify
  fichasenpapel-cmus)/LEEME-6-oct-2026-deploy-6ac56693-periodo-seguro-ya-corregidas-y-digital.txt.
- 6-oct 19:05 · Intros didácticas (la conversación de los vídeos y de «La cabaña») · HECHO · dos cosas que pidió Iago hoy
  («publicarlo en Iago González Protester para que lo vea desde la propia web y así de paso veo el icono nuevo»).
  (1) cualidadesdelsonido 5bb582f (encima de 6c60ffa): AÑADIDOS prueba.html y cabana/ («La cabaña», la Acústica nueva:
  189 ficheros, 522 MB, revisión 10061541). index.html y lo demás, sin tocar. En vivo:
  https://acustica.gp.lmathome.es/prueba.html (sin enlazar desde ningún sitio y con noindex). Comprobado en la web real:
  los 189 ficheros con su tamaño, 11 de ellos byte a byte, y la reproducción H.264 a 1080p60 y 720p30.
  (2) lmpro 83f1ac7 (encima de 205ba8f), solo index.html, bloque @MEDALLERO: con las cuentas Tester/Protester la medalla de
  Acústica (u2) sale ABIERTA, con el icono nuevo (imágenes «u2n», en una línea <script> nueva detrás de la de
  window.__MED_IMG__) y abre prueba.html (objeto PRUEBA y función enPrueba()). Para los alumnos no cambia nada: su u2
  sigue con su icono, su estado y su dirección. QUIEN TOQUE index.html DE lmpro, QUE PARTA DE 83f1ac7.
  Apagarlo: PRUEBA = null. Deshacer: volver a subir el index.html de 205ba8f (copia en
  APPs/_PARA BORRAR/6-oct-2026-portal-gp-antes-de-la-cabana-en-prueba/) y, si se quiere quitar la página, borrar
  prueba.html y cabana/ de cualidadesdelsonido. Probado en un navegador de pruebas con la página y la piel reales
  (Protester y Tester con y sin la unidad abierta, alumna con y sin la unidad abierta: 5 casos, sin errores de JS).
  OJO: la piel (portal.css) enseña en sombra la imagen «on» de las medallas bloqueadas, así que el icono de u2 NO se ha
  cambiado para todos: el día que Iago dé el visto bueno se pasan las imágenes u2n a u2 y la dirección a MEDALLAS.
  Nota: APPs/LMATHOME GP (github lmpro)/LEEME-6-oct-2026-acustica-la-cabana-y-su-icono-en-prueba.txt. Espejo de
  Dropbox al día (LMPRO/ y TEORIA INTERACTIVA 2GP/CUALIDADES DEL SONIDO/).
- 6-oct 18:15 · Fichas y rediseño · HECHO · PredictCarrusel 84cdafd (encima de 353c2cf): guiado.js, guiado.css e
  index.html (en este, solo guiado.js?v=10 y guiado.css?v=7). QUIEN TOQUE EL CARRUSEL GUIADO, QUE PARTA DE 84cdafd.
  Iago: «que la única nota señalada al final sea la del bajo […] que se desplace lateralmente, paralelo a las líneas,
  hasta coincidir con la posición de esa nota en el acorde ordenado, y ahí un cartelito que aclare». Corrección del
  acorde 2 del Armónico (dibujaArmonico): el acorde ordenado se coloca anclado al bajo (en 2.ª inversión queda una
  octava más abajo que antes; la fundamental más grave posible es sol3); al final solo queda de color el bajo, que
  viaja en horizontal con un hilo hasta su nota en el acorde ordenado («es la fundamental / la tercera / la quinta») y
  de ahí sale el estado («Por lo tanto, el acorde está en…»). La corrección dura lo mismo que antes. Probado en el
  banco de pruebas (4 semillas vistas fotograma a fotograma, 400 semillas de registro, 3 carruseles completos sin
  errores). Espejo de Dropbox al día; los de antes, en APPs/_PARA
  BORRAR/6-oct-2026-carrusel-guiado-antes-del-bajo-que-viaja/. Deshacer: volver a subir esos tres ficheros.
- 6-oct 18:15 · Fichas y rediseño · HECHO · LMEAVathome 5903ae9 y c0c7ab9 (encima de 226a581), solo
  piel/apps/portal.js. QUIEN TOQUE piel/apps/portal.js, QUE PARTA DE c0c7ab9. (1) 5903ae9 · Iago: «que no se active
  justo en punto, sino cinco minutos antes de cada clase, coincidiendo con la activación de la reproducción musical»:
  el ⚠ de morosos sale desde MOR_ANTES = 5 minutos antes de la hora de inicio hasta la de fin (gruposEnClase); en el
  cambio de clase manda el grupo que entra (la clase que empieza más tarde); y el ▶ de la música (musVentana) mira ya
  el mismo reloj que el aviso (ahoraGalicia: hora de Galicia y reloj del servidor), para que se enciendan a la vez.
  (2) c0c7ab9 · Iago, en clase: «quiero que solo aparezcan los de ese grupo»: la lista (pintarPanelMorosos) enseña
  SOLO el grupo que está en clase, también en los ceros de abajo (antes, todos los grupos del portal con el de clase
  arriba); si cambia el grupo con la lista abierta, se repinta sola. Probado en el banco de pruebas (80
  comprobaciones). Espejo de Dropbox al día; la de antes, en APPs/_PARA
  BORRAR/6-oct-2026-morosos-5-min-antes-de-clase/. Deshacer: MOR_ANTES = 0 para volver a «en punto»; para la lista con
  todos los grupos, volver a subir la de 5903ae9.
- 6-oct 17:20 · Fichas y rediseño · HECHO · LMEAVathome 226a581 (encima de 03dc89f), solo piel/apps/portal.js. QUIEN
  TOQUE piel/apps/portal.js, QUE PARTA DE 226a581. Iago: «lo que me interesa es que se active en el momento exacto de
  la clase»: el ⚠ de morosos sale de la hora de inicio a la de fin del grupo (gruposEnClase: min >= ini && min < fin;
  antes, desde 30 min antes y con la hora de fin incluida), cualquier día, según el horario del Diario; y se mira cada
  15 s (antes 60) para que salga en punto. Probado en el banco de pruebas (11 comprobaciones de hora + 22 de repaso).
  Espejo de Dropbox al día. Deshacer: volver a subir la de 03dc89f.
- 6-oct 17:10 · Fichas y rediseño · HECHO · morosos en el portal (urgente, pedido por Iago en clase). LMEAVathome
  03dc89f (encima de ac3f2fe), solo piel/apps/portal.js, sección 15. QUIEN TOQUE piel/apps/portal.js, QUE PARTA DE
  03dc89f. Qué pasaba: el ⚠ de Tester/Protester necesitaba la llave «lm_profe» que solo deja el Diario en el navegador
  donde se abre; en clase el Diario va en el iPad y el portal en el ordenador del aula, que nunca la tuvo (registros:
  127 peticiones del portal GE y ninguna de morosos). Qué: (1) sin llave, el portal la pide con la cuenta (pedirLlave
  → suite_morosos_llave_cuenta, un intento cada 5 min como mucho) y la guarda como el Diario; (2) si la lista responde
  no_autorizado, tira la llave vieja y pide otra, una vez (antes repetía la petición dos veces por segundo); freno de
  30 s cuando la lista falla (MOR.tMal); (3) la hora de clase, en hora de Galicia y con el reloj del servidor
  (ahoraGalicia, mirarReloj: cabecera Date de un HEAD a /manifest.webmanifest). SUPABASE: columna
  suite_config.cuentas_profe (uuid[], las dos cuentas del profe) y función suite_morosos_llave_cuenta(p_cuenta_id),
  que da la misma llave que el Diario solo a esas cuentas; no cambia nada de lo que había. La pegó Iago en el editor
  SQL desde el móvil (a Claude se lo bloqueó el control de seguridad de su sesión). Comprobado: 49 comprobaciones en
  el banco de pruebas; en vivo el fichero es el probado (bfc5d94f…) y a las 16:57:34 el ordenador del aula pidió la
  llave, la recibió y pidió la lista. Pendiente de ver el icono en el aula (4B ya no tenía morosos). OJO: en 2GpC y
  2GpF hay un alumno con dos cuentas validadas y sale repetido en la lista (sin tocar). Nota: APPs/LMATHOME GE (github
  LMEAVathome)/LEEME-6-oct-2026-morosos-en-el-portal-salen-en-cualquier-aparato.txt. SQL y deshacer: APPs/DIARIO
  PROFESOR (netlify diariodeiagocmus)/SQL-BD/2026-10-06-morosos-llave-por-cuenta(-DESHACER).sql. Copia de antes:
  APPs/_PARA BORRAR/6-oct-2026-morosos-en-el-portal-llave-por-cuenta/. Espejo de Dropbox al día.
- 6-oct 14:05 · Fichas y rediseño · HECHO · PreDictPROCarrusel cd0a954 (encima de 6581d5d), solo index.html. QUIEN
  TOQUE EL CARRUSEL PRO, QUE PARTA DE cd0a954. Pedido de Iago: que un móvil al que se le va la señal vuelva a la
  partida con sus puntos, y QR + código al pausar. Causa: cada carga de la página inventaba un identificador nuevo y
  los puntos viven en la pantalla del aula apuntados a ese identificador, así que el móvil que recargaba volvía a 0.
  Qué: (1) el móvil recuerda quién era en la sala (localStorage «pcarrusel_yo»: código, identificador y nombre, 6 h);
  si recarga o vuelve a abrir la MISMA sala entra solo con el mismo identificador (yoLeer, yoGuardar, yoOlvidar,
  initPlayer, playerEntrar). Salir con la ✕ lo olvida. (2) Desde otro navegador: mismo nombre (aliasNorm: sin
  mayúsculas, tildes ni espacios de más) y la pantalla del aula le pasa los puntos del ausente (hostVuelve,
  hostAdoptar); si el tocayo figura conectado, sondeo de 4 s con los mensajes «estas»/«sigo» (hostSondear, hostSigo);
  si el identificador original da señales de vida, recupera sus puntos (hostVida, H.sust). (3) Pausa de la pantalla
  del aula: QR (lleva «&encurso=1») + código + línea «N conectados · X (pts) ha entrado» (#pauseQrBox, #pauseCode,
  #pauseEstado, hostPausaEstado); el móvil que llega por ese QR ve «Partida en curso · Sumarse» (#pjEnCurso). (4) El
  que entra o vuelve recibe la pausa si la hay y el mensaje «vuelta» con sus puntos (hostSaluda, hostAvisarVuelta,
  playerVuelta). (5) Llegar tarde: Armónico en fase 2, receta de Modos y podio (hostBroadcastPhase, playerOnPhase).
  Mensajes nuevos del canal: estas, sigo, vuelta. Nada en la base (solo Realtime). No se ha tocado el Carrusel de GE
  (PredictCarrusel), LMEAVathome/piel ni los portales. Probado en el banco de pruebas (81 + 21 + 40 comprobaciones y
  dos partidas completas, una a velocidad real) y con la conexión real desde el Chrome de Iago, en silencio y sin
  empezar partida; NO probado con móviles de verdad. En vivo: mismo sha256 que lo probado (fff826bf…). Nota:
  APPs/LMATHOME GP (github lmpro)/LEEME-6-oct-2026-carrusel-pro-volver-a-la-partida-y-qr-en-la-pausa.txt. Copia de
  antes: APPs/_PARA BORRAR/6-oct-2026-carrusel-pro-antes-de-volver-a-la-partida/PreDictPROCarrusel-index.html. Espejo
  de Dropbox al día.
- 6-oct 11:26 · Fichas y rediseño · HECHO · Diario, Netlify diariodeiagocmus: deploy 6ac4bdf5
  (6ac4bdf5eeaac3babb8c0539) encima de 6ac497db. QUIEN TOQUE EL DIARIO, QUE PARTA DE 6ac4bdf5. Solo app.js (ahora
  ?v=d79) e index.html (ese número de versión); 74 ficheros antes y después. Qué: la copia de seguridad que se ofrece
  tras «Guardar semana» en 2.º GP (y la del botón 💾 de Resultados) va directa a la carpeta que elija Iago (BACKUP
  COPIA SEGURIDAD CURSO, dentro de APPs/DIARIO PROFESOR). Antes la carpeta se pedía con el ZIP ya fabricado y Chrome
  se negaba (el selector de carpetas y el permiso de escritura necesitan un clic reciente), así que acababa siempre en
  Descargas. Ahora se resuelve nada más pulsar «Sí, guardar» (bkpCarpetaDestino, «paso 0» de
  bkpGenerarBackupCompleto). La ventana «Semana guardada» dice dónde se va a guardar y deja cambiar de carpeta
  (#bkp-destino, bkpPintarDestino). El ZIP del profesor sustituto se sigue descargando. Sin carpeta, sin permiso o sin
  selector (Safari, iPad): descarga normal, como antes. La ventana ya no depende de la clase is-saved del botón (podía
  durar una décima): mira state.semanaGuardadaEn y espera hasta 8 s mientras siga guardando. No se ha tocado
  ipad.html, iphone.html, iphone-app.js ni la base. Probado solo en el banco de pruebas con datos inventados: Iago ya
  tiene preparadas las clases de la semana y pidió no dejar residuo, así que NO se ha abierto su Diario ni se ha
  guardado ninguna semana. Nota: APPs/DIARIO PROFESOR (netlify
  diariodeiagocmus)/LEEME-6-oct-2026-deploy-6ac4bdf5-copia-de-seguridad-a-su-carpeta.txt. Ficheros y copia de antes:
  _SUBIDA-6-OCT-copia-de-seguridad-a-su-carpeta (deploy 6ac4bdf5)/ y, dentro, antes (deploy 6ac497db)/.
- 6-oct 10:40 · Fichas y rediseño · HECHO · dos cosas. (1) LMEAVathome cdf1c25, solo piel/lm-piel.js: «?piel=0» ya no
  apunta nada en el navegador; apaga la piel SOLO en la pestaña donde se abre y en ese sitio (sessionStorage
  «lm_piel_no_pestana»), sin tocar las cookies lm_piel ni lm_piel_no. Para apagar un navegador entero hay que escribir
  «?piel=apagar» (lo que antes hacía ?piel=0: cookie lm_piel_no=1 en *.lmathome.es durante un año). «?piel=1» enciende
  y limpia las dos marcas. El Ojeador, lo abierto desde el Diario y el Carrusel PRO no cambian. Motivo: el 6-oct a las
  8:59:50 una comprobación MÍA con «?piel=0» en el Chrome de Iago dejó lm_piel_no=1 y sus portales salieron con la
  estética antigua hasta las 10:18 (solo en su navegador: los ficheros publicados no habían cambiado). Marca quitada.
  (2) Portales, LMEAVathome ac3f2fe y lmpro 4059a32, solo index.html: el botón de «Entregar Ficha N en papel» pasa de
  «Entendido» a «Entregada» (campo boton de la «otra» que monta filtrar() en el bloque @FORMATO; la marca del alumno
  se guarda igual, por posición) y se pone al día el comentario de la línea «LM piel». SIGUE EN PIE PARA TODAS LAS
  CONVERSACIONES: en el Chrome de Iago, nunca «?piel=apagar»; y si comprobáis algo en su navegador, al acabar mirad
  las cookies desde cualquier página de *.lmathome.es y dejad lm_piel=1 y SIN lm_piel_no. Para ver una app sin la
  piel, en vuestro banco de pruebas. Notas: APPs/LMATHOME GE (github
  LMEAVathome)/LEEME-6-oct-2026-estetica-antigua-en-el-chrome-de-iago-y-cerrojo.txt y
  LEEME-6-oct-2026-entregada-apuntes-para-todos-y-limpiar-ficha.txt (las mismas en la carpeta de GP). Copias de antes:
  APPs/_PARA BORRAR/6-oct-2026-piel-antes-del-cerrojo-de-piel0/ y
  6-oct-2026-portales-y-teoria-antes-de-entregada-apuntes-y-limpiar/.
- 6-oct 08:50 · Fichas y rediseño · HECHO · dos cosas. (1) Portales (subido el 3-oct): LMEAVathome 0a5fc96 y lmpro
  b082bd7, solo index.html. En la campana, la parte «Entregar Ficha N en papel» de «Tareas de la semana» pasa a «Ficha
  N en papel · ¡Corregida!» (nota en grande y «Ver ficha con las soluciones») cuando existe el aviso papel_corregida
  de esa ficha; sin abrir va rellena en rosa, con latido y punto rojo, y su tarjeta sube arriba y no se apaga; al
  abrirla se queda en color, tranquila. Si la tarjeta de esa semana ya no está a la vista, el mismo aviso sale suelto
  (clase alu-papel-corr; va ANTES de la rama de reclamaciones porque viaja con reclamacion:true). De cada ficha solo
  vale el último aviso (los anteriores se dan por leídos solos) y el aviso ya no se pierde al cambiar de semana (los
  de papel solo ven el ciclo en curso): se ve hasta leerlo, y 8 días en cualquier caso. Pastilla «Ficha N corregida»
  bajo la campana (#alu-campana-papel). Código: papelCorregidas() y enlazarPapel() en el bloque @FORMATO (filtrar()
  las llama; se exporta __LM_FMT__.papelCorregidas) y, en la campana, otrasPendiente, pintarCampanaPapel,
  papelEnTarjeta / papelNueva, la rama ot.corregida y los estilos «ts-papel-*» de injectNebCSS. No toca la piel
  (piel/apps/portal.css y portal.js siguen igual) ni la base de datos. (2) Diario: Netlify diariodeiagocmus 6ac497db
  (encima de 6ac0d2c4; solo diario-lupa.js?v=l6 e index.html): la lupa de una nota de ficha en papel enseña «Por
  ejercicios» (payload ejercicios_pct y n_refuerzo; los nombres, con suite_ficha_ver) y el botón «Ver su ficha
  corregida», que abre el generador con ?revision=papel:<alumno>&s=…&papel=1&curso=…&n=…&pct=…&nota=… (solo si la
  ficha es del generador). Quien toque el Diario, que parta de 6ac497db. Notas: APPs/LMATHOME GE (github
  LMEAVathome)/LEEME-6-oct-2026-portal-ficha-en-papel-corregida.txt (la misma en la carpeta de GP) y APPs/DIARIO
  PROFESOR (netlify diariodeiagocmus)/LEEME-6-oct-2026-deploy-6ac497db-lupa-ficha-en-papel.txt.
- 3-oct 12:05 · Fichas y rediseño · HECHO · tres cosas de hoy. (1) Netlify fichasenpapel-cmus 6ac0cbe6 (encima de
  6abff91f; solo index.html): cada ejercicio se puntúa con cinco bolitas 0 · 25 · 50 · 75 · 100 en una línea y un «−»
  / «+» de 5 en 5 por fila; el marcador de arriba suma y acaba en rosa; el número de ejercicios lo pone el sistema
  (los de la ficha + los de refuerzo del alumno si su formato en esa ficha es papel: índice suite_fichas_indice_v2 y
  suite_formato_de_ficha); al guardar manda al portal un aviso con la nota y el enlace a la ficha en formato solución
  (suite_cuenta_de_alumno + suite_notif_crear, tipo «aviso», payload {reclamacion:true, estado:'papel', nota_despues,
  url, ficha_ref}; SIN ficha_id). En evaluaciones.payload_json guarda de más ficha_id, n_refuerzo y aviso_n. (2)
  Netlify diariodeiagocmus 6ac0d2c4 (encima de 6ac00a3b): suite-campana.js?v=s34 (bloque nuevo al final: triángulo de
  fichas pendientes con globo rojo = semana extra y globo negro = ceros, lista por grupos con línea de dos tramos; lee
  suite_pendientes_fichas; el ✓ de cuentas se oculta con todas validadas), iphone-app.js?v=s31 e iphone.html (iconos
  de papel: «+N» / «−N» solo por cambios de formato posteriores a la última ficha generada, con «cambiados» y
  «ultimas» de suite_formatos_de_grupo), index.html e ipad.html (solo la versión de suite-campana.js). Quien toque el
  Diario, que parta de 6ac0d2c4. (3) teoriaathome 71ec2c2 + 1dacaf8 y teoriapro bd04603 + c5bef86 (PDF de papel con
  nombres, refuerzo y 1 ficha sin nombre; ficha en formato solución): está en el _COORDINACION-IA.md de cada uno. Base
  de datos: cuatro funciones NUEVAS pegadas por Iago (suite_ficha_profe_contexto_v2, suite_fichas_indice_v2,
  suite_ficha_solucion_papel, suite_pendientes_fichas; SQL y DESHACER en Dropbox, DIARIO
  PROFESOR/SQL-BD/PEGAR-3-oct-2026--fichas-papel-refuerzo-y-morosos.sql); no se ha cambiado ninguna de las de antes.
  Copias y cómo volver atrás: LEEME-3-oct-2026 de cada carpeta de Dropbox.
- 2-oct 22:20 · Fichas y rediseño · HECHO · cuatro cosas esta noche. (1) lmpro index.html b088dff: libros del aula, el
  mismo arreglo que LMEAVathome a5d0c05 (el visor solo pone el PDF de la última apertura y admite que se le pida un
  libro). (2) Netlify diariodeiagocmus 6ac00a3b (encima de 6abfe8a9): iphone.html, iphone-canon.css?v=m2 e
  iphone-resultados.js?v=s23 (portada del móvil: cursos 1×1 que se voltean para elegir grupo, cuatro tarjetas hasta
  abajo, la línea de sincronización solo con avisos; IpResultados.elegir nuevo), ipad.html (recordatorio de papel sin
  el número), app.js?v=d78 e index.html («Ver su portal» abre la pestaña en el toque; app.js deja
  window.verPortalAlumno; el Ojeador lista alumnos_canon con el nombre oficial). (3) Netlify dictadoselemental
  6ac00f92 (encima de 6abfe8b1): pantalla.html, pantalla.js?v=c20261002-robusta (notas antes que la foto; avisos con
  «Reintentar»; a los 10 s avisa), caritas-r1.js NUEVO (dibujos de repuesto si al aparato le falta algún emoji; vale
  para las otras tres pantallas, que NO se han tocado) y supabase-js-2.117.2.min.js en el propio sitio (la pantalla ya
  no pide nada a jsDelivr; Sentry, async). index.html y app.js de esa app, sin tocar. (4) LMEAVathome index.html
  98d564f: «✔ Corregir» del dictado de clase abre la corrección en un marco (#dcCorr) dentro de #dcOverlay; ya no usa
  window.open. En lmpro ese botón no cambia (enseña la solución en el sitio). Espejos de Dropbox al día; lo de antes,
  en APPs/_PARA BORRAR/espejos-antes-2oct-libros-gp y espejos-antes-2oct-corregir-ge. Pendiente apuntado en DIARIO
  PROFESOR/PENDIENTES-2-oct-2026-noche.txt (N1–N4).
- 2-oct 20:34 · Fichas y rediseño · HECHO · Netlify fichasenpapel-cmus 6abff91f (encima de 6abfe8b6; solo index.html).
  Pedido por Iago a las 20:25: los ejercicios ya no empiezan al 100 %; empiezan SIN MARCAR (gris, 0) y hay que
  tocarlos todos, también para dejar un 0. Mientras falte alguno no hay nota y el botón dice «Faltan N ejercicios» en
  vez de «Guardar». Sin anotación previa de EN CURSO: un solo fichero, publicado en un minuto, con la comprobación de
  que el vivo seguía siendo 6abfe8b6.
- 2-oct 19:29 · Fichas y rediseño · HECHO · LMEAVathome: index.html (a5d0c05) y piel/apps/portal.js (5c865ef). Libros
  del aula de Tester/Protester: el visor solo pone el PDF de la ÚLTIMA apertura y admite que se le pida un libro
  concreto (LibrosAula.abrir(botón, tipo)); el cuadrado «Libros» de la piel se lo pide. Antes «Libro → FaActos» salía
  con la página de Intervalia. El portal GP (lmpro) tiene la misma carrera y NO se ha tocado: la piel nueva con el
  index.html viejo de GP hace lo de siempre. Espejos de Dropbox al día; lo de antes, en APPs/_PARA
  BORRAR/espejos-antes-2oct-libros-faactos.
- 2-oct 19:27 · Fichas y rediseño · HECHO · Netlify, cuatro sitios publicados: ritmoentonadoprofesional 6abfe8a1
  (encima de 6abec0fc; app-r26.js nuevo, index.html, resumen-editable.css y .js nuevos: resumen final editable);
  diariodeiagocmus 6abfe8a9 (encima de 6abf7f8e; ipad.html, iphone.html, iphone-app.js, iphone-resultados.js,
  iphone-ficha-resultados.js, iphone-canon.css nuevo: Diario móvil y recordatorio de fichas en papel con un grupo por
  línea); dictadoselemental 6abfe8b1 (encima de 6abf924e; app-buscador.js y buscador.css nuevos, index.html: buscador
  de alumno); fichasenpapel-cmus 6abfe8b6 (encima de 6abdecef; index.html: la nota se pone SOLO con deslizadores, uno
  por ejercicio, y lleva la fecha del día de corrección; guarda payload_json.ejercicios_pct). Supabase (lo pegó Iago a
  las 18:31): _trg_rit_notas_sync_agg pasa a security definer (Ritmo elemental «No vino» ya guarda);
  evaluaciones_dedup_post_write no confunde dos fichas distintas; quitada suite_mis_resultados_prueba_20261002. OJO en
  las apps de corrección: el código nuevo va en ficheros con NOMBRE NUEVO (app-r26.js, app-buscador.js) y app.js NO se
  toca, porque su sw.js sirve la copia guardada y una página antigua podía cargar código nuevo a medias.
- 2-oct 13:40 · Fichas y rediseño · HECHO · Supabase (con el sí de Iago de esta mañana; no cambia ninguna nota):
  columna nueva rep_notas.leccion_num (integer, vacía) y evaluaciones_upsert_rep_notas la copia a
  payload_json.leccion_num cuando la hay (la lección que leyó CADA alumno con reparto «7, 8», como ya hace Ritmo de
  4.º). Migración rep_notas_leccion_num_y_sync_a_evaluaciones; md5 de la definición 6217e4f8… → 9315a866… (prosrc
  75641351…). El resto de la función es idéntico. La app de Ritmo entonado que rellena la columna va en el despliegue
  de después de las 19:00 (si la columna no existiera, guarda igual sin ella). Definición y deshacer en Dropbox
  APPs/DIARIO PROFESOR/SQL-BD/HECHO-ritmo-entonado-leccion-de-cada-alumno-2026-10-02.sql.
- 2-oct 13:22 · Fichas y rediseño · HECHO · apps de corrección de ELEMENTAL, el resumen final se puede tocar (lapicito
  en cada fila; ventana con nota, «No vino» y «Corrección completa»; en Ritmo de 4.º se elige la lección del que llegó
  tarde; se puede seguir editando tras «Confirmar»): ritmoelemental deploy 6abf91ed (anterior 6abec12e),
  entonacionelemental 6abf9226 (anterior 6abc00ba), dictadoselemental 6abf924e (anterior 6abb958b). Ficheros: app.js e
  index.html en las tres, parejas.js en Entonación, y resumen-editable.js/.css nuevos (iguales en las tres). De paso,
  arreglado: «Anterior» de Ritmo y Dictado salía con la rúbrica vacía si el alumno tenía notas de otros días
  (maybeSingle sin fecha); en Dictado el «⏭ no vino» borraba la rúbrica en pantalla y quitaba al alumno del resumen, y
  el resumen leía notas de todos los días; en Entonación, tocar una nota de examen en el resumen la volvía de clase.
  La base de datos no cambia. OJO quien toque estas apps: toda lectura de rit_notas/ent_notas/corr_notas con
  maybeSingle() tiene que filtrar por fecha (hay una fila por alumno y día). Copias
  .bak-antes-resumen-editable-20261002 junto a cada fichero y LEEME-2-OCT-resumen-final-editable.txt en Dropbox
  APPs/APPS CORRECCION (netlify x6).
- 2-oct 13:00 · Fichas y rediseño · HECHO · Supabase (con el sí de Iago; la ejecutó él en el SQL Editor hacia las
  12:55 porque la confirmación de Supabase no llega al móvil): INSTALADA la regla «manda la última» en evaluaciones.
  Funciones nuevas _eval_nums, _eval_apartado y _eval_manda_la_ultima (SECURITY DEFINER, sin permisos para anon ni
  authenticated), disparador eval_a_manda_la_ultima_trg (AFTER INSERT OR UPDATE, el primero de los AFTER por nombre) y
  evaluaciones_dedup_post_write deja en paz las filas 'diario_manual'. Qué hace: si después de una nota escrita a mano
  en el Diario (fila diario_manual + casilla en eval_overrides) llega o cambia la nota de una app para lo mismo (mismo
  alumno, trimestre, apartado y números de lección/ficha/dictado; mismo día salvo en fichas), retira la de mano; el
  borrado queda en audit_deletes con payload._sustituida_por y el Diario lo enseña en la campana («Notas borradas»).
  No cuenta reenviar la misma nota ni el 0 automático; no toca exámenes ni Ev. inicial. Si falla, la nota de la app se
  guarda igual (queda un LOG «[manda la ultima]»). Comprobado tras instalar: md5(prosrc) b26bce39… / b33a8bf6… /
  563635ec… / 3ed3ef8d…, sin notas borradas. Definición y deshacer en Dropbox: APPs/DIARIO
  PROFESOR/SQL-BD/HECHO-manda-la-ultima-2026-10-02.sql. Quien toque evaluaciones_dedup_post_write o las notas a mano,
  que lo lea antes.
- 2-oct 12:00 · Fichas y rediseño · HECHO · Diario deploy 6abf7f8e (encima de 6abf5a0d): ficha del alumno (Ev. inicial
  con rombo y «no cuenta», «Ver su portal» azul, curso una vez, toques amarillos; PC, iPad y móvil), fuera la etiqueta
  «L13», «Lecciones 7, 8» en plural, «Notas borradas» como aviso de la campana, y la nota escrita a mano SIEMPRE en su
  propia fila (source_table 'diario_manual'; vaciar a mano una casilla con nota de app = fila sin nota con payload
  en_blanco; quitar la nota a mano = fila sin nota ni lección, payload retirada). 13 ficheros: app.js (d77),
  canon-plano.css (k15), diario-lupa.js (l5), evaluaciones-reader.js (fp6), ficha-resultados.js (f5), informe-v2.js
  (i2), suite-campana.js (s33), iphone-app.js (s29), iphone-ficha-resultados.js (f3), iphone-resultados.js (s21),
  index.html, ipad.html, iphone.html. Supabase: suite_mis_resultados otra vez (la casilla vaciada a mano tapa la nota
  de la app; md5 ec92b7d2…). PENDIENTE DEL «SÍ» DE IAGO, NO INSTALADA: la regla «manda la última» (disparador en
  evaluaciones + limpiador de duplicados); el SQL y su deshacer, en Dropbox APPs/DIARIO PROFESOR/SQL-BD/
  PENDIENTE-manda-la-ultima-2026-10-02.sql. Quien toque las notas a mano, que lea antes ese fichero. Copia de lo
  anterior y LEEME: Dropbox «_SUBIDA-2-OCT-ficha-del-alumno-campana-y-nota-a-mano (deploy 6abf7f8e)».
- 2-oct 10:10 · Fichas y rediseño · HECHO · Supabase (con el sí de Iago): función suite_mis_resultados (la de «Mis
  resultados» de los portales GE y GP). Ahora llegan las notas de la Ev. inicial escritas a mano en el Diario
  (eval_overrides, trimestre «inicial»; la de Teoría, como la ficha marcada «Evaluación inicial» en la preparación)
  y, si para lo mismo hay nota a mano (diario_manual) y de app, llega solo la escrita a mano. Comparado en las 48
  cuentas validadas: +40 notas de Teoría inicial, lo demás idéntico. md5 506eea9b… → 79ea090b…; migración
  suite_mis_resultados_ev_inicial_a_mano_y_nota_a_mano_manda. Los portales no cambian. Queda una copia de prueba
  inofensiva (suite_mis_resultados_prueba_20261002, sin permisos para anon). Definición y deshacer en Dropbox:
  DIARIO PROFESOR/SQL-BD/HECHO-mis-resultados-ev-inicial-y-nota-a-mano-2026-10-02.sql
- 2-oct 09:20 · Fichas y rediseño · HECHO · deploy 6abf5a0d del Diario (Netlify diariodeiagocmus, anterior 6abef22e) ·
  TRÁFICO DE SUPABASE (aviso de cuota: 7,2 GB sobre 5; el 98 % era la base de datos). El Diario lee de la vista nueva
  vw_evaluaciones_ligera (igual que vw_evaluaciones, sin payload_json.estado ni .respuestas: 239 kB frente a 2,8 MB)
  en las 14 lecturas que hacía de la vista de siempre: suite-campana.js (?v=s32), evaluaciones-reader.js (?v=fp5),
  ficha-resultados.js (?v=f4), diario-lupa.js (?v=l4), iphone-app.js (?v=s28) y app.js (?v=d76); index.html,
  ipad.html e iphone.html solo por esos números. La campana, cada 60 s y solo con la pestaña a la vista. 73 ficheros.
  PARA TODOS: no leáis vw_evaluaciones con payload_json entero en nada que se repita (cada ficha digital pesa
  ~76 kB); usad vw_evaluaciones_ligera. Quien toque el Diario, que parta de 6abf5a0d. Copias y LEEME en Dropbox.
  Deshacer: publicar 6abef22e (la vista puede quedarse).
- 2-oct 09:20 · Fichas y rediseño · HECHO · Supabase (con el sí de Iago; copias y deshacer en SQL-BD del Diario):
  (1) vista nueva vw_evaluaciones_ligera; (2) _trg_rit_notas_sync_agg añade payload_json.leccion_num (la lección de
  cada alumno en Ritmo de 4.º) y se rellenó en las 16 notas del 25-sep; (3) las 2 notas a mano de 2GpF del 1-oct
  pasan de «Lección 14, 16» a «Lección 7, 8» (con leccion_num 8); (4) una nota a mano duplicada de 2GpC (Ficha 2)
  quitada: vale la de la ficha digital. Tabla de copias: _copias_2026_10_02 (RLS, sin políticas).
- 2-oct 01:55 · Fichas y rediseño · HECHO · deploy 6abef22e del Diario (Netlify diariodeiagocmus, anterior 6abee958) ·
  LUPA DE AUDITORÍA, fase 4: diario-lupa.js (?v=l3), ficha-resultados.js (?v=f3) e index.html (solo esos dos números
  de versión); 73 ficheros. Las mismas ventanas, ahora también desde la FICHA DEL ALUMNO (ordenador e iPad): notas de
  clase, medias de apartado y media ponderada, exámenes, fila «Ini» y nota del boletín; y desde la tabla de arriba de
  la pestaña «Ev. inicial». ficha-resultados.js solo añade atributos data-lp-… (la fila de evaluaciones de la que
  sale cada nota) y FichaResultados.datos(); la ficha se ve y calcula igual. Solo lee. Quien toque el Diario, que
  parta de 6abef22e. Copias y LEEME en Dropbox. Deshacer: publicar en Netlify el deploy 6abee958.
- 2-oct 01:20 · Fichas y rediseño · HECHO · deploy 6abee958 del Diario (Netlify diariodeiagocmus, anterior 6abed913) ·
  LUPA DE AUDITORÍA, fases 2 y 3: diario-lupa.js (?v=l2) e index.html (solo ese número de versión); 73 ficheros. En
  «Resultados» ya tiene lupa toda nota con algo detrás: dictados de elemental (corr_notas: rúbrica y solución) y de
  profesional (dictados: solución, foto del alumno con visor de zoom y giro, autocorrección, revisión y comentarios),
  entonación de elemental (ent_notas), la media de cada apartado (qué notas la forman), «Media clase», exámenes y
  boletín (el cálculo entero, comprobado contra calcularMediaMock). Solo lee; no toca evaluaciones-reader.js ni
  app.js. Quien toque el Diario, que parta de 6abee958. Copias y LEEME en Dropbox. Deshacer: publicar en Netlify el
  deploy 6abed913.
- 2-oct 00:15 · Fichas y rediseño · HECHO · deploy 6abed913 del Diario (Netlify diariodeiagocmus, anterior 6abeca85) ·
  LUPA DE AUDITORÍA, fase 1: index.html (carga diario-lupa.js ?v=l1 y el lector ?v=fp4), evaluaciones-reader.js y
  diario-lupa.js (nuevo); 73 ficheros. En «Resultados», una lupa en cada nota de clase de Ritmo y de Teoría (y en la
  Entonación de 2.º GP que sale de Ritmo entonado) abre una ventana con el origen de la nota: lección, app, rúbrica
  (rit_notas / rep_notas), desglose de la ficha, reclamación y cambios (eval_audit). Solo lee. El lector deja un
  índice nuevo, window.EVAL_ORIGEN (qué fila de evaluaciones dejó la nota en cada casilla), y une en UNA columna la
  ficha que llega como «Ficha 2» (digital) y como «2» (papel). Quien toque el Diario, que parta de 6abed913. Copias y
  LEEME en Dropbox. Deshacer: publicar en Netlify el deploy 6abeca85.
- 1-oct 23:10 · Fichas y rediseño · HECHO · deploy 6abeca85 del Diario (Netlify diariodeiagocmus, anterior 6abdf341) ·
  ipad.html, selector-ritmo.js (?v=r5), iphone.html e iphone-app.js (?v=s27); 72 ficheros, solo esos cuatro cambian.
  Escaleta de la C2 de 2.º GP: primero la pregunta y después la lección (ORDEN_B2.c2), minutos por defecto 14 · 10 · 8
  (las semanas con orden o minutos puestos a mano los conservan). «Pregunta» (GP) y «Evaluación de Ritmo» (GE) del
  iPad con lo que se MANDÓ a los alumnos (suite_envio_lecciones; la preparación, de respaldo y con aviso si difiere).
  Móvil: en la portada, copias en papel por curso (4Ge / 2Gp) con los nombres al tocar. Quien toque el Diario, que
  parta de 6abeca85. Copias y LEEME en Dropbox. Deshacer: publicar en Netlify el deploy 6abdf341.
- 1-oct 22:33 · Fichas y rediseño · HECHO · «Mis resultados» (portales GE y GP): la Ev. Inicial a la vista del alumno:
  un rombo suelto en su fecha en la gráfica, «evaluación inicial (no cuenta para la media)» en la leyenda y, en la
  lista de notas de clase, al principio del curso (abajo: la lista va de lo más reciente a lo más antiguo) con
  «Ev. inicial (no cuenta para la media)». No entran en la media ni en ningún cálculo; sin SQL (suite_mis_resultados
  ya las devolvía). LMEAVathome: commit 6c0a19d (index.html, anterior 9b73d7f); lmpro: commit 8bb81a4 (index.html,
  anterior 4e66703). Copia en Dropbox. Deshacer: git revert de esos dos.
- 1-oct 22:19 · Fichas y rediseño · HECHO · apps de corrección de RITMO: las lecciones a preguntar salen de lo que se
  MANDÓ a los alumnos (suite_semana_envio), no de la preparación del Diario; el 1-oct en 2.º GP salieron 14 y 16 (la
  preparación de la semana 39, cambiada después de mandar) en vez de 7 y 8. Ritmo entonado, además: reparto de
  lecciones mitad y mitad con «Cambio de lección» (como Ritmo elemental). Netlify ritmoentonadoprofesional: deploy
  6abec0fc (anterior 6abb8c78), app.js ?v=r25 e index.html. Netlify ritmoelemental: deploy 6abec12e (anterior
  6abb8aae), app.js ?v=nv2 e index.html. Supabase: función nueva de solo lectura suite_envio_lecciones(curso, año,
  semana) para anon; las 23 notas de rep_notas del 1-oct pasan de «14, 16» a «7, 8» (copia en
  _copia_rep_7y8_2gp_20261001). Quien toque esas apps, que parta de lo vivo. Copias, LEEME y DESHACER en Dropbox
  (APPS CORRECCION y SQL-BD del Diario).
- 1-oct 22:00 · Fichas y rediseño · HECHO · música del portal (Tester/Protester): el ▶ responde en todo el círculo
  (el bloque del título, transparente y con z-index 75, tapaba su mitad de abajo; .portal-welcome pasa a z-index 76).
  LMEAVathome: commit 9b73d7f (piel/apps/portal.css, anterior f959325). Copia en Dropbox. Deshacer: git revert 9b73d7f.
- 1-oct 12:38 · Fichas y rediseño · HECHO · libro de entonación (solo Tester): el nombre del intervalo (2m, 5J, 4A/5D…),
  pequeño y negro, paralelo a su línea y justo debajo; sale al soltar y también en las líneas ya pintadas (no se guarda
  nada nuevo). LMEAVathome: commit f959325 (piel/apps/portal.js, anterior e5f7805). Copia en Dropbox. Deshacer: git
  revert f959325.
- 1-oct 11:38 · Fichas y rediseño · HECHO · visor de ritmo: la punta fina, la PRIMERA (punta, verde, gris, △/U, alertas),
  como en entonación. LMEAVathome: commits 91a1f43 (piel/apps/portal.js) y e5f7805 (index.html); lmpro: commit 4e66703
  (index.html). Solo cambia el orden. Copia en Dropbox. Deshacer: git revert de esos tres.
- 1-oct 11:12 · Fichas y rediseño · HECHO · VISOR DE RITMO (GE y GP): solo verde (ritmos nuevos), gris (ya vistos), punta
  fina NEGRA, △/U (el trazo a mano se cambia al segundo por el triángulo o la U de las intros, en verde; lo que no se
  parece se queda) y alertas; fuera amarillo, rosa, azul y nota de texto (lo ya dibujado se sigue viendo). «Borrar
  todo» de un toque con la tonalidad (deshacer lo devuelve). Tester/Protester: el visor se vacía al entrar y al salir;
  a los alumnos se les guarda. Libro de entonación: lo mismo de «Borrar todo» y el vaciado. LMEAVathome: commits
  ace8435 (piel/apps/portal.js y portal.css, anterior f22fe02) y 0cf3d33 (index.html); lmpro: commit bebc3c1 (index.html,
  anterior 85935f0). La hilera de la piel se arma con los botones que traiga la barra (sirve con portales viejos).
  Comprobado en vivo: los cuatro ficheros iguales a los probados. Copia en Dropbox. Deshacer: git revert de esos tres.
- 1-oct 10:20 · Fichas y rediseño · HECHO · ALERTAS amarilla y roja en el visor de las lecciones de ritmo (portales GE
  y GP, para todos) y alerta amarilla en el libro de entonación (solo lo abre Tester) · LMEAVathome: commits 0793a88
  (piel/apps/portal.js y portal.css, anterior 38dc1e2) y f22fe02 (index.html); lmpro: commit 8eeba9d (index.html,
  anterior edb1a89). Toque = icono; arrastre = zona traslúcida encabezada por el icono; se guardan con los trazos
  (campo «alertas»). La hilera de la piel solo pone los botones si la barra del portal los trae. Comprobado en vivo:
  los cuatro ficheros iguales a los probados. Copia en Dropbox. Deshacer: git revert de esos tres commits.
- 1-oct 08:55 · Fichas y rediseño · HECHO · Supabase: CLAVE ANTERIOR DE LA SUITE RETIRADA (con el «vale» de Iago).
  Solo vale la nueva: cualquier Diario o app con la clave anterior recibe «secreto». NO subáis copias antiguas del
  Diario (anteriores al deploy 6abdf341) ni de Fichas en papel (anteriores a 6abdecef). La anterior queda guardada en
  suite_config.gate_secreto_retirado (ninguna función la lee). Deshacer: SQL-BD/DESHACER-retirar-clave-vieja-2026-10-01.sql.
  Revisado antes: ningún repo público ni sitio de Netlify en uso la llevaba (solo el banco de pruebas abandonado
  diario-pruebas-rediseno).
- 1-oct 07:55 · Fichas y rediseño · HECHO · Supabase: 4 funciones tenían la clave ANTERIOR escrita dentro y con la
  nueva decían «secreto» (el contador de cuentas validadas del Diario salía 0/46): suite_validados_listar,
  suite_listar_pendientes_v2, suite_alumno_crear y suite_semana_reactualizar. Igualadas a las demás (aceptan la
  nueva y, en la transición, la anterior). Ya no queda ninguna función con la clave escrita: si creáis una, que use
  public.suite_check_secreto(p_secreto). Deshacer: SQL-BD/DESHACER-4-funciones-clave-escrita-2026-10-01.sql.
- 1-oct 07:46 · Fichas y rediseño · HECHO · deploy 6abdf341 del Diario (Netlify diariodeiagocmus, anterior 6abd7030) ·
  la clave nueva de la suite en los 7 ficheros que la llevan, la memoria final para cualquier curso (con 4Ge: la
  versión anterior fallaba) y listas de reserva con lo último leído bien. app.js (?v=d75), index.html, ipad.html,
  iphone.html, iphone-app.js (?v=s26), suite-campana.js (?v=s31), diario-mensajes.js (?v=s26), diario-semana-gp.js
  (?v=r22), diario-visor.js (?v=r4), selector-ritmo.js (?v=r4) y ficha-resultados.js (?v=f2). 72 ficheros, 72
  iguales. Copia y LEEME en Dropbox. OJO: quien parta de una versión anterior del Diario lleva la clave vieja.
- 1-oct · Fichas y rediseño · HECHO · deploy 6abdecef de Fichas en papel (Netlify fichasenpapel-cmus, anterior
  6abb707f) · la clave nueva de la suite y la web protegida con el inicio de sesión de Netlify. index.html.
- 1-oct · Fichas y rediseño · HECHO · Supabase: (1) vw_diario_grupos_alumnos con regla general para curso_diario
  (nGp… → nGp; GE que empieza por número → nGe); (2) horario_clases: se lee solo el curso escolar más reciente y no se
  escribe sin la clave (horario_clases_guardar); (3) clave de la suite cambiada CON TRANSICIÓN: valen la nueva y la
  anterior (gate_secreto_prev) hasta que Iago abra el Diario nuevo en sus aparatos. Quien suba algo que lleve la clave,
  que la copie de un fichero VIVO, no de una copia antigua, y nunca en código público. Deshacer: Dropbox, carpeta
  SQL-BD del Diario, ficheros DESHACER-*-2026-10-01.sql.
- 1-oct · Fichas y rediseño · HECHO · commits 4088d9a (index.html: fuera el bloque @SORTEO-BTN) y e8bf12a (borrado
  SORTEO/index.html) · ruleta de lecciones eliminada («ya no la necesito»; además tenía nombres de alumnos en una
  página pública). La tabla suite_sorteo_lecciones y lo que la lee (iPad, Ritmo entonado PRO) no se tocan.
- 30-sep 23:05 · Fichas y rediseño · HECHO · commit 38dc1e2 (LMEAVathome, anterior ffb6507) · el aviso «empieza la
  clase» de la música del portal lee las horas de horario_clases_publico (lo que guarda el paso «Horario» del wizard
  del Diario), las recuerda en el aparato y MUS_HORAS queda de respaldo. piel/apps/portal.js. Comprobado en vivo.
  Copia en Dropbox.
- 30-sep 22:45 · Fichas y rediseño · HECHO · deploy 6abd7030 del Diario (Netlify diariodeiagocmus, anterior 6abcb9f3) ·
  wizard «Nuevo curso»: contraseña del Diario antes de tocar nada, vaciado con la clave de la suite y paso «5 · Horario»
  tras «Grupos» (guarda horario_clases del curso nuevo); el editor de horario del visor ya trae las horas. app.js
  (?v=d74), index.html y diario-visor.js (?v=r3). 72 ficheros, 69 iguales. Copia y LEEME en Dropbox.
- 30-sep 22:00 · Fichas y rediseño · HECHO · commit ffb6507 (LMEAVathome, anterior f40c5c7) · música del portal 3 dB más
  baja (MUS_VOL 0,43 → 0,3) y el aviso de clase con las horas escritas en MUS_HORAS (mar 16:00, 18:00, 19:00 · mié 17:30 ·
  jue 18:00, 19:00 · vie 16:00, 17:30), de 5 min antes a 5 min después, sin depender del Diario (la pantalla del aula no lo
  tiene). piel/apps/portal.js. Comprobado en vivo. Copia en Dropbox.
- 30-sep 20:45 · Fichas y rediseño · HECHO · commit 353c2cf (PredictCarrusel, anterior cbffadf) · tiempos del carrusel
  guiado tras probarlo en clase: preparación 45 s (música repartida en 22 compases + anacrusa), «Termina de completar» 12 s
  (12…6 y luego «Solución en 5…1»), +3 s de solución en las cuatro pruebas y +5 s con la solución del acorde 1 del armónico;
  +10 s en total (10:51–11:17 con preparación). guiado.js e index.html (?v=9). Comprobado en vivo. Copia y LEEME en Dropbox.
- 30-sep 21:05 · Fichas y rediseño · HECHO · LMEAVathome: música de fondo en los portales (solo Tester/Protester, GE y GP) ·
  commits 47ade9d (reproductor: piel/apps/portal.js y portal.css, sección 18), 2dbf489 + ee48019 + 3c71aff (musica/: 30 MP3 de
  Kevin MacLeod, CC BY 4.0, 128 kbps y -16 LUFS, en tres tandas porque GitHub no admite 105 MB de una vez; y lista.json con
  ini/fin) y f40c5c7 (enlaza una canción con otra sin silencio). Tira bajo «Bienvenido/a… Salir»: barras a todo el ancho que
  suben desde la línea de silencio, título debajo, volumen -6 dB, aviso 5 min antes de clase. Comprobado en vivo. Copia y
  LEEME en Dropbox. Deshacer: revertir esos commits (sin musica/lista.json el reproductor no aparece).
- 30-sep 19:45 · Fichas y rediseño · HECHO · Netlify dictadosprofesional deploy 6abd49f0300260b7670f53b0 (anterior
  6ab62cf2308cc4dc8ad3364a) · el resumen de la sesión envía solo a evaluación (el eval_tipo elegido a todas las notas de la
  sesión) y desaparece el botón «Confirmar y enviar» (solo sale «Reintentar» si falla). Cada nota ya llegaba a evaluaciones al
  confirmarla (trigger). panel.js y profesor.html (panel.js?v=p16). Comprobado en vivo. Copia y LEEME en Dropbox. Deshacer:
  volver a publicar 6ab62cf2308cc4dc8ad3364a.
- 30-sep 19:20 · Fichas y rediseño · HECHO · commit cbffadf (PredictCarrusel, anterior fe73195) · bonus con 16 cadencias a 4
  voces (4 por tipo, en mayor y en menor, comprobadas: sin paralelas, sensible resuelta…), en las 10 tonalidades de GE, y «Generar
  carrusel» no repite el tipo del anterior (semillaNueva + window.PCCadencia); armónico, acorde 2: la corrección enseña primero la
  nota del bajo y la nota del acorde ordenado viaja al bajo. guiado.js e index.html (?v=8). Comprobado en vivo. Copia en Dropbox
  (LEEME). Deshacer: revertir cbffadf.
- 30-sep 18:55 · Fichas y rediseño · HECHO · commit c6677f9 (LMEAVathome, anterior 27aafe2) · libro de entonación del portal
  (sección 17 de piel/apps/portal.js, solo Tester): punta fina NEGRA por defecto (el azul se confundía con la 4J) y los 12
  intervalos con el trazo del libro de Intervalia: opaco, extremos rectos y 0,0036 del ancho de la página (antes 0,010 y
  traslúcido al 42 %). portal.js y portal.css. Comprobado en vivo. Copia en Dropbox (LEEME en piel/). Deshacer: revertir c6677f9.
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
