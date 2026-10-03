# Coordinación entre conversaciones de Claude · lmpro (portal GP)

Iago tiene varias conversaciones de Claude subiendo cambios a este portal a la vez. Este fichero es el punto de
encuentro (empieza por «_» para que la web no lo publique). Antes de subir nada: mira el último commit de `main`, lee
esto, apunta abajo fecha, quién eres, qué vas a tocar y «EN CURSO» (en un commit solo con este fichero), edita
SIEMPRE sobre la versión del último commit y, al acabar, cambia tu línea a «HECHO · commit xxxxxxx».

## Registro (lo más reciente arriba · hora de Galicia)
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
