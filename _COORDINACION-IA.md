# Coordinación entre conversaciones de Claude · lmpro (portal GP)

Iago tiene varias conversaciones de Claude subiendo cambios a este portal a la vez. Este fichero es el punto de
encuentro (empieza por «_» para que la web no lo publique). Antes de subir nada: mira el último commit de `main`, lee
esto, apunta abajo fecha, quién eres, qué vas a tocar y «EN CURSO» (en un commit solo con este fichero), edita
SIEMPRE sobre la versión del último commit y, al acabar, cambia tu línea a «HECHO · commit xxxxxxx».

## Registro (lo más reciente arriba · hora de Galicia)
- 1-oct 11:34 · Fichas y rediseño · EN CURSO · visor de ritmo: la punta fina, la PRIMERA (punta, verde, gris, △/U,
  alertas), como en entonación. Voy a tocar: LMEAVathome piel/apps/portal.js e index.html (parto de 0cf3d33); lmpro
  index.html (parto de b4a1ab0). No subáis esos ficheros hasta que ponga HECHO.
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
