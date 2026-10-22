# Coordinación entre conversaciones de Claude · lmpro (portal GP)

Iago tiene varias conversaciones de Claude subiendo cambios a este portal a la vez. Este fichero es el punto de
encuentro (empieza por «_» para que la web no lo publique). Antes de subir nada: mira el último commit de `main`, lee
esto, apunta abajo fecha, quién eres, qué vas a tocar y «EN CURSO» (en un commit solo con este fichero), edita
SIEMPRE sobre la versión del último commit y, al acabar, cambia tu línea a «HECHO · commit xxxxxxx».

## Normas fijas de Iago para los portales
- (16-oct-2026) TARJETAS DE AVISO DE LOS PORTALES TEMÁTICOS: cada portal interactivo del medallero GP (Acústica, Atonalidad,
  Fonógrafo y los que vengan) tiene que llevar sus tarjetas para la campana, con texturas HECHAS CON CHATGPT: una por día o
  capítulo, que sea el resumen de lo que se vive dentro (Acústica Día 1, fuera y de día con el árbol caído; los demás,
  interiores con su protagonista). Mismo alto y ancho que las demás tarjetas y los botones siempre en el mismo sitio; la
  letra, el contorno, los colores y la personalidad, los de su portal (Acústica: blanco por fuera, contorno y botones, y
  dentro los colores de la cabaña y de cada día; el dorado, solo si le va, como al Fonógrafo). Se registran en HITO_TEMAS
  (index.html, junto a hitoCSS) y las texturas van en hitos/<portal>-<n>.webp. Cómo
  se hacen y qué falta subir: Dropbox APPs/LMATHOME GP (github lmpro)/LEEME-16-oct-2026-tarjetas-de-los-portales.txt y la
  carpeta «TARJETAS DE LOS PORTALES (sin subir)».
- (16-oct-2026) REVELADO DE UN PORTAL EN EL MEDALLERO: sin cartel ni nada que cerrar; solo la animación del icono (foco,
  niebla fuera, respingo y sonido), que se apaga sola. Lo que trae el portal ya lo cuentan sus tarjetas en la campana.
- (16-oct-2026) PORTALES POR HITOS: cada portal temático del medallero se abre por días o capítulos al acabar la clase en
  que Iago lo marca en el Diario (desplegable «Vídeo» del bloque de teoría); el portal solo deja entrar en lo ya visto
  («#cu=<cuenta>&dias=1.2», «&dia=N» desde el aviso) y lo demás, con candado; el profe (#c=) lo ve todo. Un portal nuevo:
  _suite_hito_meta (SQL que ejecuta Iago con enlace), HITO_WEB y su medalla en index.html, el guardián en su página (como
  CabHitos o AtonHitos), sus tarjetas (HITO_TEMAS + hitos/) y sus títulos en diario-video-teoria.js del Diario.
- (16-oct-2026) PANTALLA DEL AULA: va con pocos fotogramas. Nada de movimientos «fluidos» en lo que se ve en clase (encoger,
  deslizar, recolocar animando): los cambios de tamaño o de sitio, DE GOLPE. La tarjeta de la escaleta mide siempre lo
  mismo (300 px) y lleva un + amarillo en su esquina que abre la escaleta entera (el − la cierra).
- (16-oct-2026) ACORDES EN TEORÍA (GE y GP, ejercicios y fichas): al CONSTRUIR vale el bajo pedido y las demás notas por su
  nombre en cualquier octava y orden, por encima del bajo; al IDENTIFICAR se pide también la fundamental (rueda de notas con
  ♭/♯) y se corrige. Todo pasa por LM_ACO (arriba/bajo/raizRueda) en index.html.

## Registro (lo más reciente arriba · hora de Galicia)
- 22-oct 16:58 · C1 · Hamilton · EN CURSO · solo dentro de hamilton/ (index.html, css/hamilton.css, js/app.js, voz-intro-v4.mp3 nuevo): voz sin «Nos vemos en clase», párrafos sincronizados con la voz, música bajo la voz al 18 %.
- 22-oct 16:50 · C1 · Hamilton · HECHO · commits f0fc9bd…e979cf3 · solo dentro de hamilton/ (index.html, css/hamilton.css, js/app.js, img/fondos/papel-carta.webp y voz-intro-v3.mp3 NUEVOS): botón «Reiniciar» para cuentas de prueba (RPC suite_hamilton_reiniciar), música más alta, carta con letra de época (IM Fell), papel nuevo, palabras clave en rojo y misma letra en todos los párrafos; voz v3 servida desde el portal (sin dos «clase»).
- 22-oct 14:27 · C1 · Hamilton · HECHO · commits ef648e6, bd21442 y b18f80a · solo dentro de hamilton/ (index.html, css/hamilton.css, js/app.js, js/datos-expres.js): carta un párrafo cada vez + «Continuar» a los caminos, barras de carga, exprés recortado (7 partes, sin «Quédate con…») y sin música, iconos SVG. Medios nuevos en Supabase (intro-v2.mp3, E3_room…, E5_satisfied-v2). No toca index.html del portal GP.
- 22-oct 13:25 · C1 · Hamilton · HECHO · solo dentro de hamilton/ (app.js, css/hamilton.css, index.html): la intro del portal pasa a ser «la carta de Iago»,
  con su voz en off (Supabase hamilton/expres/voz/intro.mp3) y los párrafos apareciendo a su ritmo. No toca index.html del portal GP.
- 22-oct 12:55 · C1 · Hamilton · HECHO (con el ok de Iago: «súbelo a lmpro») · commits 4357d02, 7b1158c, 27f187c y a4e17c0 (hamilton/) y f3ac1a6 (medalla) · probado en vivo con Protester · PORTAL DE HAMILTON SOLO PARA PROTESTER: carpeta NUEVA hamilton/
  (gp.lmathome.es/hamilton/: index.html, css/, js/, img/fondos/) y en index.html UNA entrada nueva en PRUEBAS del medallero
  (u:'ham', solo:/protester/i, misterio:true): la medalla de Hamilton sigue con la «?» y al pulsarla abre el portal con #c=.
  A los alumnos no les cambia nada (el portal no se les abre hasta el jue 3-dic 08:00, Supabase suite_hamilton_config).
- 22-oct 12:30 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · TEORÍA PRO: EL CARRITO DEL CONTADOR FLOTANTE
  DEL GENERADOR DE FICHAS. teoriapro 5b6ae18 (encima de 98e5f82, el de «C1 · 4 Sabores» con los tests 7.1 y 7.2: esperé a su HECHO
  para no pisarnos), solo index.html (+48) y su _COORDINACION-IA.md (ahí, el detalle). Iago: «me gustaría que ahí estuviese una
  especie de resumen de los títulos de ejercicios que he ido añadiendo… como si estuviese sumando cosas a un carrito de la compra».
  Encima del «4/5 · en la ficha», la lista de la ficha en su orden: tocar un título lleva a ese ejercicio; ✕ lo quita; tocar el número
  pliega o despliega la lista (se recuerda en el aparato). En el móvil, solo el contador. En elemental no hace falta: la «Ficha de
  esta semana» ya lista los tipos. También comprobado: el SQL de la norma del tipo test, pegado por Iago y funcionando, y que la norma
  cubre los tests 7.1 y 7.2 nuevos (enunciados únicos). Espejo de Dropbox (LMPRO/TEORÍA PRO) igual a GitHub; copia de antes en
  _PARA BORRAR/22-oct-2026-antes-carrito-del-generador/.
- 22-oct 11:50 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · TEORÍA PRO: NORMA DEL TIPO TEST, NINGUNA
  PREGUNTA REPETIDA NI EN LA MISMA FICHA NI EN LA SIGUIENTE. teoriapro 9384723 (EN CURSO en 0875918, encima de 9e638f0), solo
  index.html (+85 −11) y su _COORDINACION-IA.md (ahí, el detalle). Iago: «si yo meto dos preguntas tipo test sobre acústica 2.1, que
  ninguna salga repetida… cuando le dé a generar ficha, que se baneen… al menos durante la siguiente semana… Así que sea una norma».
  En las fichas 3–6 de 2.º GP ya había pasado tres veces (preguntas de una ficha repetidas en la siguiente). Ahora el generador elige
  primero las que nunca salieron, luego las más antiguas; nunca una de esta ficha ni de la anterior si el banco da para ello (si no, ⚠
  en ese ejercicio); el refuerzo, igual (la ficha manda). Lo de las fichas enviadas lo da una función NUEVA de Supabase,
  suite_ficha_test_usadas(p_token), solo lectura, que Iago tiene que pegar:
  DIARIO PROFESOR (netlify diariodeiagocmus)/SQL-BD/PEGAR-22-oct-2026--teoria-pro-tipo-test-sin-repetir.sql (y su DESHACER). Sin ella,
  solo la norma dentro de la ficha. OJO, conversación del Latin: no toco BANCO; las preguntas y tramos nuevos entran solos en la norma
  (por su texto). Espejo de Dropbox (LMPRO/TEORÍA PRO) igual a GitHub; copia de antes en
  _PARA BORRAR/22-oct-2026-antes-tipo-test-sin-repetir/.
- 22-oct 08:15 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · RESUMEN DE TU SEMANA: EL BOTÓN DEL MAPA, BIEN
  VISIBLE EN LA TIRA SIN DESPLEGAR, Y LA TIRA EN UNA FILA TAMBIÉN EN EL CHROME 94 DEL AULA. LMEAVathome 32612b4 (encima de b93218e) y
  lmpro 07f575d (encima de 18cad5b), solo index.html (+38 −2 cada uno, el mismo cambio). Iago: «abrí el visor de un alumno y en
  resumen de la semana elemental todavía no salía el botón de mapa teórico cuando está sin expandir… Te cabe en una fila todo?». (1)
  El iconito del mapa ya estaba en la tira de GE desde el 20-oct (292d6a0), pero en la fila compacta (@container rsmc de 296 a 499 px:
  iPad en vertical, ventanas medianas) medía 12/11 px; ahora 16/15 px (renglón del nombre 16/15 px y row-gap 1 px; recuadro de 36 px y
  tarjeta de 94 px, iguales). (2) El ordenador del aula es un Chrome 94 en Linux (lo dicen los registros de Supabase): no entiende
  @container ni cqw (llegaron en Chrome 105), así que allí el resumen seguía en 2 × 2 (150 px). Ahora, si
  CSS.supports('container-type','inline-size') es falso, cv2CSS añade las mismas reglas de las @container rsmc colgadas de
  .rsm-chips-c.rsmq-296/340/500 (rsmSinCQ) y rsmMedir() pone la clase según el ancho medido (ResizeObserver); en los navegadores
  nuevos no hace nada. Banco: 2452 comprobaciones (alumno y #visor=, 390–1920 px, navegador nuevo y Chrome 94 simulado); en vivo, por
  huella. Espejos de Dropbox iguales; copias de antes en _PARA BORRAR/22-oct-2026-antes-resumen-boton-mapa-y-fila-aula/ y
  LEEME-22-oct-2026-resumen-boton-mapa-y-una-fila-en-el-aula.txt en las carpetas GE y GP. OJO, para todos: ese Chrome 94 del aula
  tampoco entiende :has() ni color-mix(), que usan otras partes de los portales.
- 22-oct 07:11 · Fichas y rediseño · HECHO · MOROSOS DEL PORTAL CON EL NOMBRE OFICIAL: Iago pegó el SQL del 21-oct en Supabase.
  Comprobado: suite_morosos_fichas_v2 ya saca el nombre de alumnos_canon (nombre + apellidos; si no hay, el de la cuenta), 0 veces la
  línea vieja; la función de antes, en public._copia_fn_morosos_v2_20261021 (con RLS y sin acceso para anon/authenticated). En
  DIARIO PROFESOR (netlify diariodeiagocmus)/SQL-BD el fichero se llama ahora «YA-PEGADO-21-oct-2026--morosos-portal-nombre-oficial
  (ejecutado 22-oct).sql»; para deshacer, DESHACER-21-oct-2026--morosos-portal-nombre-oficial.sql.
- 21-oct 18:24 · Fichas y rediseño · HECHO (con el ok de Iago) · ESCALETA (VÍDEOS DE LAS TARJETAS DE TEORÍA Y «ABRIR ›» DE PREDICT
  CARRUSEL) Y MI MAPA DE TEORÍA («VER APUNTES» EN «VER COMO EL ALUMNO»). LMEAVathome b93218e (encima de fbc8665), dos ficheros:
  piel/escaleta.js — (1) Iago, foto del aula: «la escaleta invasiva… he abierto el vídeo yendo desde Teoría at home… que se comprima
  arriba»: el visor de vídeos de las TARJETAS de Teoría at home / PRO (.ivg-caja: ▶ de la tarjeta → lista → vídeo) cuenta como
  'vidteoria' (inmersivo): sin tarjeta grande y #lme-mini en una línea (clase lme-ivg: position:fixed, z-index 10001, fondo opaco),
  centrada en el margen de arriba; el de «VER APUNTES» (.apxf-vid) sigue igual. (2) Iago: «cuando aparece la portada, PreDict
  Carrusel, no me aparece el enlace para ir directamente a la aplicación»: en irA el «Abrir ›» de PreDict sale también fuera del
  portal (abreCarrusel: pestaña 'lm-carrusel-pantalla'; GE https://iagonaron.github.io/PredictCarrusel/?pantalla=1&t=…, GP
  …/PreDictPROCarrusel/?t=…); en el portal, como antes (pulsa #ge-espiral / .carrusel-btn). piel/mapa.js — en el modo profesor
  (W.__VISOR, «ver como el alumno» desde el Diario) los enlaces llevan #c=<cuenta del alumno visto> (antes, sin cuenta: Teoría salía
  de invitado y no abría los apuntes); Teoría con esa cuenta solo comprueba que está validada. Comprobados en vivo los 39 «Vídeo
  didáctico» del mapa (18 GE, 21 GP) y que todos los temas de apuntes del mapa existen. OJO quien toque el visor .ivg de Teoría,
  inmersivo/miniLibro o irA de la escaleta. Bancos: visor 85/85, cartel 12/12, mapa 12/12. Espejo Dropbox: LMATHOME
  GE/LMEAV AT HOME/piel; los de antes en APPs/_PARA BORRAR/21-oct-2026-antes-escaleta-videos-teoria-predict-y-mapa-visor/. LEEME:
  LMATHOME GE (github LMEAVathome)/LEEME-21-oct-2026-escaleta-videos-teoria-predict-y-mapa-ver-apuntes.txt. Y PENDIENTE DE IAGO (SQL
  preparado, no lanzado): la lista de morosos del portal con el nombre OFICIAL (alumnos_canon) en vez del de la cuenta: una línea de
  suite_morosos_fichas_v2 (DIARIO PROFESOR/SQL-BD/PEGAR-21-oct-2026--morosos-portal-nombre-oficial.sql; se para solo si esa línea ya
  no está tal cual). OJO quien toque suite_morosos_fichas_v2 antes de que lo lance.
- 21-oct 09:20 · Fichas y rediseño · HECHO (con el ok de Iago) · DICTADOS PROFESIONAL, LA APP DEL ALUMNO SE PONE SOLA EN LA VERSIÓN
  NUEVA Y LA CUENTA NO SE PIERDE POR UN FALLO DE RED («a los alumnos… ¿les aparecerá ya la nueva versión?… yo sí que voy a estar
  pendiente de tocar la banda amarilla… pero ellos igual no»; «que los alumnos tengan como su cuenta y no tengan que volver a meter el
  PIN»). Netlify dictadosprofesional 6ad86645 (encima de 6ad85af5), 4 ficheros: sw.js r2-2026-10-21 (la página del alumno, / e
  /index.html: red primero hasta 4 s y si no la copia; al instalarse encima del r1, la página del alumno recién abierta —menos de 25 s
  según el «date» de su copia— y a la vista se recarga UNA vez sola con client.navigate; profesor.html y todo lo demás exactamente
  como el r1: copia al instante + banda; la MISMA caja lm-clase-r1-2026-09-22); index.html (el aviso «nueva-version» se escucha desde
  el principio, no desde «load»; recién abierta y sin tocar → se recarga sola; a medias → al volver a #view-home; como mucho una
  recarga cada 3 min, si no la banda; app.js?v=dos2); app.js dos2 (init(): la cuenta recordada solo se olvida si la base dice que ese
  alumno no existe; con error de red/Supabase, un reintento y entra con la cuenta recordada; verificarAlumnoVigente(): con error, no
  echa al alumno); profesor.html (el aviso desde el principio: la banda ya no se pierde; el panel NUNCA se recarga solo). OJO quien
  toque el registro del service worker de estas dos páginas, sw.js o el init() del alumno: mantener esto. Banco con service worker
  real 36/36 (Chromium + servidor que imita a Netlify); dos páginas 17/17 y 10/10 con los ficheros nuevos; borrador y publicado
  comprobados en vivo. Espejo: Dropbox «DICTADOS PROFESIONAL v15 (minimal)» (los de antes, *.bak-antes-sw-r2-20261021 y
  sw.r1-2026-09-22.js). LEEME: APPS CORRECCION (netlify x6)/LEEME-21-OCT-dictados-pro-version-nueva-sola-y-cuenta.txt. Deshacer:
  Publish deploy 6ad85af5.
- 21-oct 08:28 · Fichas y rediseño · HECHO (con el ok de Iago; SQL lanzado por él) · DICTADOS PROFESIONAL, EL DICTADO EN DOS PÁGINAS
  («medio dictado… en una hoja y medio en la parte de atrás… una línea de texto discreta… dos recuadros con su más… y a mí que me
  lleguen dos fotos»). Supabase: dictados.foto_url_2 text (vacía en los de siempre). Netlify dictadosprofesional 6ad85af5 (encima de
  6acfc65e): alumno: dos-paginas.js NUEVO (la línea «Tu dictado está en dos páginas diferentes» bajo el recuadro de la foto; dos
  recuadros Página 1/2; «Continuar» solo con las dos; «Solo una página») y app.js?v=dos1 (sube la 2.ª como <id>/<hora>-2.jpg en
  fotos-dictados y la manda en foto_url_2; si la columna no estuviera, va como enlace en comentario_alumno); profesor:
  panel.js?v=p19 («1»/«2» junto al ↻ en la revisión uno a uno, cada página con giro y zoom de cero; la ficha del detalle con las
  dos; la limpieza de 7 días también borra la 2.ª). OJO quien toque la foto del alumno en el panel (renderReviewStep, zoom-foto.js,
  coloca-foto.js): revVerPagina cambia img.src y data-rot. Las evaluaciones (Diario, portal) siguen con foto_url: la 2.ª página solo
  en el panel. Copias: _PARA BORRAR/21-oct-2026-antes-del-dictado-en-dos-paginas/.
- 21-oct 07:54 · Fichas y rediseño · HECHO (SQL lanzado por Iago) · DICTADOS PROFESIONAL, «Error al guardar: permission denied for
  table evaluaciones» al revisar con número de dictado. Causa: el arreglo del 15-oct (una sola nota por dictado) puso en
  evaluaciones_upsert_dictados (SECURITY INVOKER) un DELETE de evaluaciones de los «hermanos» del dictado; la app escribe como anon,
  que no tiene DELETE en evaluaciones. Con numero NULL la función sale antes (por eso el 20-oct la corrección manual GP sí
  guardaba). Arreglo: evaluaciones_upsert_dictados(text) SECURITY DEFINER y search_path = public, pg_temp (anon sigue sin DELETE;
  datos sin tocar). Comprobado: los del 20-oct revisados, en evaluaciones como dictado 6, uno por alumno. OJO quien añada un DELETE
  en una función que se llame desde los triggers de dictados u otra tabla que escriban las apps: necesita SECURITY DEFINER. Ficheros
  (y DESHACER): APPS CORRECCION/DICTADOS PROFESIONAL/PENDIENTE-21-oct-2026-dictados-pro-guardar….
- 21-oct 06:41 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado; cada repo comprobado justo antes) · RESUMEN
  DE TU SEMANA, LOS CUATRO EN UNA FILA Y LA TARJETA DEL ALTO DE LAS DEMÁS (Iago, tras enseñarla en el aula con Protester: «quiero
  que estén en una sola fila y la notificación ocupe igual que el resto… tanto en mi aula como en sus portales abiertos en tablet o
  PC»). index.html de los dos portales (LMEAVathome fbc8665 y este commit en lmpro), solo CSS: tres reglas @container rsmc tras la
  del 18-oct. Desde 296 px de rejilla, .rsm-chips en 4 columnas y .rsm-chip de 36 px (la tarjeta, 94 px, como un aviso); con 500 o
  más, nombre y nota en la misma línea (12 y 13 px; el contenido 2,5 px más arriba para que «Ficha N», .rsm-noent-t abajo a la
  derecha, no pise la nota); entre 296 y 499, nombre arriba y nota con «Ficha N» debajo; por debajo de 296 (móvil), el 2 × 2 de
  siempre. El iconito del mapa, con .rsm-chip .rsm-mapa-mini (la regla base va después y ganaba). Antes: 2 × 2 por debajo de 500 px
  de rejilla (iPad en vertical, aula con la pantalla ampliada) y la tarjeta de 150 px; en fila, recuadros de 42 px (tarjeta de 100)
  y «Entonaci…» cortado con un 10,00. OJO quien toque .rsm-chip: hay reglas por tamaño de rejilla (@container rsmc) que pisan las de
  base. Banco t-rsm21 (GE y GP, de 390 a 1920 px). Copias: _PARA BORRAR/21-oct-2026-antes-del-resumen-en-una-fila/.
- 20-oct 21:20 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · LMEAVathome 906c0a9 y 1309640
  (piel/escaleta.js) · LA ESCALETA EN LA INTRO DE LA CARTA, ARRIBA EN EL CENTRO («a mí me gusta que la escaleta esté siempre en el
  centro, arriba… que la referencia sea arriba en el medio»; y luego: «lo importante es que el botón de avanzar esté habilitado, que
  los títulos de los carteles estén habilitados… si la escaleta está justo encima de esos puntitos… un mal menor»): con #introOv
  abierto (RITMO at home / PRO), #lme-mini (.lme-intro, translateX(-50%)) va centrado en la pantalla si cabe entre .intro-brand y
  .intro-nav; si no, lo más cerca del centro entre los dos (mín. 150 px); si ni así (móvil), justo bajo .intro-bar, y #introStage
  con margin-top 44px (ESCENA; se quita al cerrar la intro). Nunca encima de .intro-brand ni de ← «Siguiente» ✕. Los .intro-dots que
  queden debajo: translateX a su derecha o a su izquierda si caben; si no, visibility:hidden (PUNTOS; vuelven al cerrar). OJO quien
  toque la barra de la intro de RITMO (.intro-brand, .intro-dots, .intro-nav, #introStage): la escaleta se coloca por ellas. Banco
  t-intro-centro en 10 tamaños (1920 a 390 px) + los de siempre. Copias:
  _PARA BORRAR/20-oct-2026-antes-de-la-escaleta-centrada-en-la-intro (ee89743) y
  _PARA BORRAR/20-oct-2026-antes-de-la-escaleta-de-la-intro-en-ventanas-estrechas (906c0a9).
  · Y lo del dictado manual GP de las 20:22: SQL ejecutado por Iago y comprobado (ese dictado ya cuenta; la alumna tiene sus 5
  dictados del curso en el Diario y en Mis resultados, y en la corrección manual GP sale una sola vez, con los apellidos puestos).
- 20-oct 20:22 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · LMEAVathome ee89743 (piel/escaleta.js) ·
  EL VÍDEO DEL ▶ DE LA TARJETA, COMO LOS DE TEORÍA («el botón de play de la tarjeta de la escaleta lo que abra quiero que sea igual,
  vamos, a unificar»): el didáctico (#lme-video.lme-did) va en .lme-vcaja (16:9 centrada sobre #050403, las medidas de .apxf-vid-caja),
  ✕ arriba a la derecha, e inmersivo() = 'vidteoria' → la línea #lme-mini (.lme-vid) en su margen de arriba (miniLibro busca
  .apxf-vid o #lme-video.lme-did y su caja). El temático (.lme-tema, un portal) sigue a pantalla completa y sin escaleta. VID_CAJA =
  false lo quita. t-video-portal 48/48 + los de siempre. Copia: _PARA BORRAR/20-oct-2026-antes-del-video-del-play-como-en-teoria.
  · Y un dictado manual GP de hoy guardado en una ficha vieja nueva sin enlazar (la app de dictados se lo saltó escribiendo el nombre
  a medias): SQL para Iago que lo enlaza (alumnos_link) y vuelve a pasar ese dictado (APPS CORRECCION/PENDIENTE-20-oct-2026-…sql).
  OJO: escaleta_ausentes cuenta como «No vino» a quien tiene el dictado en una ficha sin enlazar.
- 20-oct 19:56 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · tres cosas:
  (1) LMEAVathome 1613b54 (piel/escaleta.js) · ESCALETA EN EL MARGEN NEGRO DE LOS VÍDEOS DE TEORÍA («¿durante los vídeos podía ocupar
  menos la escaleta? Ojalá cupiese en el margen negro de arriba sin invadir el vídeo»): con .apxf-vid (vídeo de Teoría at home / PRO)
  abierto, inmersivo() = 'vidteoria' (sin tarjeta) y #lme-mini (.lme-vid) va en el .apxf-vid, centrado en la banda entre su borde
  de arriba y .apxf-vid-caja (no toca el vídeo ni la ✕). t-video 28/28 a 1280, 1523, 1920 y 820 + los de siempre. OJO quien toque
  .apxf-vid / .apxf-vid-caja: la escaleta se coloca por ellos. Copia: _PARA BORRAR/20-oct-2026-antes-de-la-escaleta-en-el-margen-del-video.
  (2) teoriapro 9e638f0 (index.html; su _COORDINACION-IA.md, en el mismo commit) · MODOS POR NOTAS NETAS (Iago: en los modos vale
  la armadura de referencia + la alteración característica, pero también otra armadura si «las notas netas resultantes» son las del
  modo): modoNetasOk (familia 'modo') en MODOS_MOTOR.puntua, corregirESCVar y dibujarEscCorr («Armadura: ✓ 3 ♭ (la de referencia:
  4 ♭)»); MODOS_NETAS = false lo quita. Banco con las 42 respuestas distintas entregadas (157 ejercicios): suben 20, las otras
  137 igual. LAS NOTAS YA PUESTAS: SQL que pega Iago (LMATHOME GP/PENDIENTE-20-oct-2026-modos-notas-netas (pegar en Supabase).sql,
  y su DESHACER): 20 ejercicios en 14 entregas (fichas 2-5 de 2.º GP) al 100 % en payload.ejercicios, nota recalculada con
  _suite_nota_con (solo esas 14 filas; marca payload.modos_netas con pct_antes y nota_antes), copia en _bak_modos_netas_20261020
  (RLS, sin permisos web), un aviso por alumno en suite_notificaciones (tipo aviso, payload mensaje_prof + modos_netas) y PARA si
  hay nota a mano en la casilla (manda la última la borraría) o choque con el antiduplicados. Probado en una base local con el mismo
  esquema y triggers: 21/21. OJO quien toque payload.ejercicios de fichas: la marca modos_netas es lo que usa el DESHACER.
  (3) Netlify dictadoselemental 6ad7aace (encima de 6ad132e5) · CORRECCIÓN MANUAL GP, CADA ALUMNO UNA VEZ: vw_dictados_gp_canon
  saca una fila por cada enlace de alumnos_link (app dictado-profesional) y tres alumnos tienen 2-3 fichas viejas enlazadas: salían
  repetidos y «Hay N alumnos que se llaman…: pon el apellido». canon-unico-20oct.js (NUEVO; envuelve cargarAlumnosManual) deja una
  fila por alumno_canon_id, con el app_id cuya ficha vieja casa mejor con nombre y apellidos. La base de datos no cambia. Banco
  17/17. Deshacer: Publish deploy 6ad132e5.
- 20-oct 19:15 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · DIARIO, deploy 6ad798cf (encima de 6ad7592f):
  «VER FICHA» EN EL DESGLOSE DE LA LUPA 🔍 de cada ficha entregada en la campana («cómo puedo ver lo que contestó un alumno en un
  ejercicio que no ha reclamado?»): al pie del desglose, enlace a su ficha corregida (?revision=ficha:cuenta&s=…&piel=1, el mismo
  generador que la lupa amarilla de las reclamaciones; GP → Teoría PRO), haya reclamado o no; solo si la entrega trae source_id.
  suite-campana.js (VER_FICHA) y el ?v de index/ipad/iphone (s49 → s50; quien vuelva a tocar suite-campana.js: s51). Banco 12/12
  con las hojas de estilo publicadas. Copias: DIARIO PROFESOR …/_SUBIDA-20-OCT-noche-ver-ficha-en-la-lupa (deploy 6ad798cf)/antes.
- 20-oct 18:30 · Fichas y rediseño · HECHO (Iago, en clase con 2.º GP; con su ok para subir lo terminado) · LMEAVathome dd22efd
  (piel/escaleta.js y piel/lm-piel.js): (1) UN SOLO DICTADO EN «HOY EN CLASE» («sale el dictado número 6… pero también sale dictado
  en plan redundante y sin datos»): formatea() lee «Corregir dictado» (slot corregir-dictado) como «Corrección del dictado» (antes,
  /dictado/ en el slot → «Dictado»); agendaHoy() no la pone aparte si la clase tiene su dictado (sin dictado, sí); irA() le deja
  «Abrir el dictado»; detalles() quita «Editar en DICTADO PRO». (2) LA ESCALETA EN LA INTRO DE LA CARTA («durante la intro… no
  tengo referencia del tiempo que queda»): el INTRO del portal abre RITMO at home / RITMO PRO, otra web sin sesión del profe.
  lm-piel.js, en el portal con sesión de Tester/Protester, guarda su cuenta en la cookie lm_cta_ge / lm_cta_gp (*.lmathome.es,
  12 h; con otra sesión la borra) y, en la familia ritmo sin sesión, la acepta SOLO para la escaleta (TESTER_ID; CTA_COOKIE).
  escaleta.js: con #introOv.show, inmersivo() = 'intro' y #lme-mini (.lme-intro) a la altura de .intro-bar, tras .intro-brand y
  antes de .intro-dots (fuera de la barra: en el repaso va en grayscale). Bancos t-dictado 17/17 y t-intro 26/26 + los de siempre.
  OJO quien toque lm-piel.js o escaleta.js: parte de dd22efd; quien toque la intro de RITMO (#introOv, .intro-bar, .intro-brand,
  .intro-dots): la escaleta se coloca por ellos. Copias: _PARA BORRAR/20-oct-2026-antes-del-dictado-unico-y-la-escaleta-en-la-intro.
- 20-oct 17:48 · Fichas y rediseño · HECHO (Iago, en clase; con su ok para subir lo terminado) · lo de la tarde, en cuatro subidas:
  (1) LMEAVathome 78eb0cd (piel/escaleta.js) · LA ESCALETA YA NO TAPA LOS MENÚS NI LA PANTALLA DE RESULTADOS («pulso resultados, no
  me abre… paré la escaleta… y ahí sí»): apartar() corría .topbar-right con transform, que la hacía capa aparte (stacking context)
  dentro de .wrap, y sus menús (.lm-ic-menu, z 5000: Libros, Ritmo, Entonación) quedaban bajo .hero (z 75): se veían, pero el toque
  caía en el título. Ahora la corre con position:relative + left (correr(), CORRE_LEFT). Y con #lm-marco-app abierto (Resultados
  dentro del portal), inmersivo() = 'marco': ni tarjeta ni ▶ encima; en clase, #lme-mini en el centro de .lm-ma-bar (.lme-marco).
  Banco nuevo t-conf (menús, Resultados, campana, Mis resultados, libros y pizarra; GE y GP; 1280/1523/1920; fila corrida como en
  el aula): 16/16 y 13/13; y los de siempre 40/40 + 13/13 + 19/19 ×2 + 6/6. OJO quien toque escaleta.js: parte de 78eb0cd; quien
  toque el z-index de la fila, de .hero o de #lm-marco-app (portal.css), que lo pruebe con la escaleta en marcha.
  (2) LMEAVathome b7167f8 (escaleta.js) · la lección y el consejo de entonación, en «Preparación entonación» (bloquesDe).
  (3) LMEAVathome 97fd969 y lmpro e1bb064 (index.html, pizarra «Pentagrama») · la goma y «borrar todo», a la izquierda (grupo
  .pz-borra tras los colores); con 1500 px o más, la escaleta (#pz-esc) en el centro exacto de #pz-bar.
  (4) LMEAVathome 2b3086e (piel/apps/portal.js) · con la sospecha de «táctil enganchado», el dedo ya no desplaza la hoja del visor
  de entonación al dibujar (#lm-ento.lm-en-dibuja .lm-en-pag y #pz-zona, fuera de tqDesliza).
  Copias: _PARA BORRAR/20-oct-2026-antes-de-que-la-escaleta-no-tape-los-menus, …-antes-de-la-leccion-en-la-preparacion-escaleta,
  …-antes-de-la-goma-a-la-izquierda-pizarra y …-antes-del-dedo-que-no-desplaza-al-dibujar. LEEMEs en LMATHOME GE (y GP, la pizarra).
- 20-oct 16:55 · Fichas y rediseño · HECHO (Iago, en clase; con su ok para subir lo terminado) · LMEAVathome cd7cc72 (piel/lm-piel.js y
  piel/escaleta.js): (1) LA ESCALETA EN TEORÍA at home / PRO («en los ejercicios libres… no aparece la escaleta»): allí no hay
  lmeav_session/lmpro_session; la cuenta llega del portal en el #c= (apuntes.js → apx_cuenta_ge/_gp). lm-piel.js, solo en la
  familia teoria y sin sesión, la acepta si es la de Tester/Protester (TESTER_ID) y deja LMPiel.cuentaTester; escaleta.js la usa
  en cuenta0(). (2) ■ y luego ▶ = la clase DE NUEVO, por la previa (para seguir, ⏸). (3) PreDict: contorno amarillo en la
  caracola (#ge-espiral, GE) o en .carrusel-btn (GP), no en el dictado. Banco 35/35 + 13/13 + 9/9 + 6/6 (Teoría at home de
  verdad, copia saneada). OJO quien toque lm-piel.js o escaleta.js: parte de cd7cc72. Copia:
  _PARA BORRAR/20-oct-2026-antes-de-teoria-reinicio-y-caracola-escaleta; LEEME de la escaleta en LMATHOME GE, ampliado.
- 20-oct 16:34 · Fichas y rediseño · HECHO (Iago, en clase con 4B; con su ok para subir lo terminado) · ESCALETA (solo piel/escaleta.js,
  LMEAVathome): (1) 805f106 · un ▶ de prueba antes de la hora que luego se para (■) o se pausa (⏸) antes de la hora ya no cuenta:
  en punto, entrada (la lista de morosos se abre sola), previa, «Hoy en clase» y la primera actividad (hoy: ▶ 15:57:21 y ■ 15:57:31
  dejaron la clase «parada» y no salió nada). ANTES_NO_CUENTA. (2) bccd040 · el ▶ (y el botón de arriba del mando) empieza SIEMPRE
  por la previa —antes de la hora, en la entrada o tras un ■ antes de la hora—: estado nuevo { pre } que corre la línea de tiempo
  (v.t5 = cuándo empieza la primera actividad); si la previa no está lista, espera 6 s como mucho y si no, la cuenta de siempre;
  tras un ■ en plena clase, sigue donde estaba. La previa se prepara desde 10 min antes. PLAY_CON_PREVIA. (3) bccd040 · con la
  pizarra, el visor de ritmo (#ts-visor) o el de entonación (#lm-ento) abiertos y la clase en marcha, ↓ ↑ Av/Re Pág → ← y Tab son
  de la escaleta (escucha en window, fase de captura), no del control con el foco (rueda de la tonalidad, herramientas); en un
  campo de texto, del campo. MANDO_PIZARRA. Banco 33/33 + 13/13 + 9/9. OJO quien toque escaleta.js: parte de bccd040. Copias:
  _PARA BORRAR/20-oct-2026-antes-del-play-de-prueba-escaleta y …-antes-del-play-con-previa-escaleta; LEEME en LMATHOME GE.
- 20-oct 14:09 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · CAMPANA DEL DIARIO, qué día abrió cada
  alumno en Acústica (Iago: «me gustaría saber qué día es el que ha abierto… a mí también»; la tarjeta sin día llevaba la textura
  del Día 1). (1) La cabaña: el latido apunta también «portada», «lugares» y «dia-N-carga» (en «Preparando el Día N»):
  cualidadesdelsonido e65c7dd (solo prueba.html, +5 −3). (2) hitos/cabana-portada.webp NUEVA (textura de la tarjeta sin día):
  lmpro 69242be. (3) Diario, deploy 6ad7592f encima de 6ad748ad: suite-campana.js (con día, «pantalla de carga» si la hubo; sin
  día, la textura de la portada y «sin entrar en ningún día · portada…» o «no consta el día»; Atonalidad sin capítulo, tarjeta
  lisa) y ?v=s49 en index/ipad/iphone (quien vuelva a tocar suite-campana.js: s50); los 75 ficheros restantes, iguales.
  Supabase no cambia. Copias: _PARA BORRAR/20-oct-2026-antes-de-portada-y-carga-en-el-latido-La-cabana y «antes (deploy
  6ad748ad)» en el _SUBIDA del Diario; LEEMEs en DIARIO PROFESOR y en LMATHOME GP.
- 20-oct 13:58 · C1 del proyecto Blues · HECHO · commits 104e462 (coordinación EN CURSO) y 846b748 (voluntarios/lm-voluntarios.js v4 y voluntarios/LEEME.md: 4 temas nuevos para el Blues —telegrafo, tabla, marquesina y album— y un tema por oferta; los temas de siempre, igual; no toqué index.html). Comprobados 3 de 3 con el mismo sha y en vivo (gp.lmathome.es/voluntarios/lm-voluntarios.js con VERSION = 4). Subido entre 13:49 y 13:50 (la hora 14:05 del EN CURSO era prevista). CÓMO DESHACER: lmpro → subir APPs/_PARA BORRAR/20-oct-2026-voluntarios-v3/lm-voluntarios.js (la v3).
- 20-oct 14:05 · C1 del proyecto Blues · EN CURSO · voluntarios/lm-voluntarios.js v4 (4 temas nuevos para el Blues: telegrafo, tabla, marquesina y album; ofrece({tema}) elige la estética de cada oferta; los temas de siempre, igual) y voluntarios/LEEME.md. No toco index.html.
- 20-oct 13:40 · C1 del proyecto Blues · HECHO · commits 79671e0 (hitos/ NUEVOS: blues-1…5.webp, f-limelight, f-cormorant-600, f-cormorant-italica) y 0ed347d (index.html): medalla del Blues u5n (el acordeón de John; para todos, como Atonalidad: cerrada, su sombra con la «?»), MEDALLAS u5 → https://blues.gp.lmathome.es/, anticipo en PRUEBAS solo Protester con misterio:true, u5 se destapa por hitos (HITO_WEB.blues + diasDe(hh,'blues')), y las 5 tarjetas «Blues · Acto N» de la campana (HITO_TEMAS.blues, hitoChip «ADMITE UNO» que se pica, CSS «billete de 1928»). Comprobado: los 10 ficheros con el mismo sha que el paquete; banco local de la campana 38/38 (consola igual que antes). Bloques marcados «(20-oct-2026)». DESHACER: revertir 0ed347d y 79671e0 (o subir el index.html de ad0137a: copia en APPs/_PARA BORRAR/20-oct-2026-lmpro-antes-del-blues/index.html).
- 20-oct 12:50 · Fichas y rediseño · HECHO · RITMO at home 1.6, 2.ª vuelta (lo que pidió Iago al probarlo): en «¿Qué hace la
  ligadura?» los 4 ejemplos en 2×2, grandes y a la misma escala, y suenan con el pulso debajo como en la génesis; en las fases
  1-3 la nota grave de una nota alargada por ligadura suena entera (antes lo ligado parecía mudo); con la piel, la gemela del
  árbol se enciende entera. ritmoathome d378ef7 (index.html y fases 1-3; las demás cartas, iguales). Copia en _PARA BORRAR/
  20-oct-2026-antes-de-la-2a-vuelta-ligaduras-1.6-RITMO-at-home; añadido al LEEME-20-oct-2026-ritmo-ligaduras-1.6-quiz-e-intro.txt.
- 20-oct 12:20 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · (1) RITMO at home, carta 1.6
  «Ligaduras»: el quiz trabaja ocho ritmos de dos pulsos, el primero ligado al segundo (cuatro familias; cada fase coge cuatro
  al azar; ya no se recortan a su primer pulso). Fase 1, el pulso donde EMPIEZA; las cuatro fases dibujan y hacen sonar la
  ligadura; fase 3 con botón «Ligadura» (vale la grafía gemela); fase 4, la ligada no se percute. Intro: ejemplos que suenan,
  génesis de 8 pasos y árbol de 8 con la gemela iluminada entera: ritmoathome a54b698 (index.html y las 4 fases). Las demás
  cartas, iguales (regresión con el mismo azar en 1.1, 1.4, 2.1 y 6.2); en un puzzle sin relleno la cabecera ya no lo nombra.
  (2) RITMO PRO, el ✦ «Revelar patrón» de las intros suena a un tercio: ritmopro 1efb95e (MAGIA_VOL). Espejos de Dropbox
  iguales; copias en _PARA BORRAR/20-oct-2026-antes-de-las-ligaduras-1.6-RITMO-at-home y …-antes-de-bajar-la-varita-RITMO-PRO;
  LEEME-20-oct-2026-ritmo-ligaduras-1.6-quiz-e-intro.txt en la carpeta GE.
- 20-oct 11:30 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · cinco arreglos de esta mañana:
  (1) RESUMEN DE TU SEMANA, «Ficha N» en la esquina del recuadro de Teoría también con nota: LMEAVathome 4f57e7d y lmpro
  ccc7162 (solo index.html, +7 −1). (2) ESCALETA, el contorno amarillo de la lección se ve amarillo aunque la notificación
  esté en gris (el gris se aparta de los padres del botón y queda en lo demás; sin :has()): LMEAVathome 6937110 (solo
  piel/escaleta.js, misma ?v). (3) TEORÍA PRO, serie armónica (clave de Fa hasta Mi4, la nota donde se pulsa, recuerda su
  clave, se corrige por el sonido; Iago: «como ahora», 1/7 por armónico): teoriapro 15ef491. (4) TEORÍA PRO, botón
  «Entendido» al terminar la ficha, como en GE: teoriapro 0f56012. (5) TEORÍA at home, en la ficha corregida el intervalo
  pedido bajo cada compás de «Coloca la 2ª nota»: teoriaathome 1047528. Los de teoría, apuntados también en el
  _COORDINACION-IA.md de cada repositorio. Espejos de Dropbox iguales, copias de antes en _PARA BORRAR/20-oct-2026-* y
  LEEME-20-oct-2026-* en las carpetas GE y GP.
- 20-oct 08:55 · Fichas y rediseño · HECHO · RESUMEN DE TU SEMANA en los dos portales (LMEAVathome 6156343 y lmpro c9de7eb,
  solo index.html, +5 −3 cada uno): fuera «entregada tarde» (la ficha entregada en el tiempo extra, solo su nota); sin entregar,
  «—» y en la esquina «Ficha N» (antes «ficha no entregada», que queda si no viene el número); el subtítulo del detalle ya no
  dice «· entregada tarde». Supabase no cambia ('tarde' sigue en el payload). Iago: «si entregaron en el periodo extra que no
  ponga nada» · «simplemente: Ficha 4, en la esquina».
- 20-oct 07:21 · Fichas y rediseño · HECHO (con el ok de Iago para subir lo terminado) · LMEAVathome 292d6a0, solo
  index.html (+3 −2): en el resumen de la semana de GE, sin desplegar, el iconito del mapa delante de «Teoría» y todo ese recuadro
  abre «Mi mapa de teoría», como ya pasaba en GP (rsmChipMapa ya no se limita a GP). «Ver mi mapa de teoría» del detalle, igual.
  Iago: «cuando aún está compactado, ya aparezca en teoría el botón de ver mi mapa teórico, al igual que ocurre con profesional».
- 19-oct 15:34 · Fichas y rediseño · HECHO · MI MAPA DE TEORÍA: LMEAVathome bd29342 (solo piel/mapa.js). Tonalidades con
  los nombres del libro (Indica la tonalidad · Indica la armadura · Tonalidades vecinas) y, en la ventanita de «Practicar»,
  debajo de «Ver apuntes», la pestaña en la que se abren (3.er dato de AP). Iago: «vídeo explicativo es vídeo didáctico».
- 19-oct 14:55 · Fichas y rediseño · HECHO (con el ok de Iago: «tienes ya mi OK… para subir todo») · MI MAPA DE TEORÍA, 2.ª
  versión. LMEAVathome: solo piel/mapa.js (cbfe0d2; antes 5f96670). Misma dirección (piel/mapa.js?v=2026-10-19a): los portales
  NO cambian. Iago: «la flecha de arriba a la izquierda no funciona», «demasiado grande… más continuidad del portal», «el propio
  mapa debería ser una ventana emergente… con el fondo que estuviese antes» y «cuando pone practicar, una mini ventanita para
  escoger apuntes, vídeo o ejercicios libres». Ahora: ventana en el centro con el portal detrás atenuado, letra y tamaños de la
  campana; se cierra con la ✕ (cuadrada, arriba a la derecha), Esc, tocando fuera o «atrás» (deja su entrada en el historial,
  como el visor de lecciones). La flecha de antes no cerraba porque el SVG de las pistas le quedaba encima (ahora sin clics).
  «Practicar» (solo en rojo) abre una ventanita con lo que haya: Ver apuntes (teoria.ge/gp.lmathome.es/?apuntes=…&nombre=…),
  Vídeo didáctico (intros/<carpeta>/index.html) y Ejercicios libres (?practice=<clave>), en pestaña nueva y con #c=<cuenta>
  como los enlaces del portal (sin la cuenta en el modo profesor). Tablas AP/VI/PR copiadas del bloque «APUNTES EN LAS FICHAS»
  de teoriaathome y teoriapro: OJO quien cambie allí apuntes, vídeos o prácticas, que lo cambie también en piel/mapa.js. Tipo
  test de 2.º GP sin apuntes web: «Apuntes en el Libro de 2.º GP · unidad N · págs.». Nunca enlaza portales interactivos (se
  abren con su medalla). Copia de antes: APPs/_PARA BORRAR/19-oct-2026-antes-del-mapa-v2/mapa.js.
- 19-oct 13:50 · Fichas y rediseño · HECHO (con el ok de Iago; él ejecutó el SQL) · MI MAPA DE TEORÍA. Supabase (lo ejecutó Iago, un
  solo «Run»): suite_mi_mapa_teoria(p_cuenta_id) (solo lee; como suite_mis_resultados) da, de una cuenta validada, cada clave de
  ejercicio de las fichas que ha hecho: veces, media, media3 (las 3 últimas: el color de la luz) y última; digital, de
  payload.ejercicios; papel, de ejercicios_pct con las claves de suite_fichas_asignadas.ejercicios_json (mismo orden). Y la 5.ª
  versión del resumen: _suite_resumen_teoria_tarde + suite_resumen_barrer (ficha entregada tarde → recuadro de Teoría con su nota y
  'tarde': true, guardando 'antes'); 3 resúmenes de la semana 42 ya puestos al día. LMEAVathome: piel/mapa.js (5f96670, el mapa:
  diseño Circuito, «Teoría» en el centro, cajas por áreas con sus luces; MAPA.ge con las 24 claves de teoriaathome y MAPA.gp con
  las de teoriapro; «Practicar ›» en lo rojo, a ?practice=<clave>) e index.html (3637c57): «Ver mi mapa de teoría» dentro de
  Teoría en el resumen desplegado. lmpro (este commit): en la tira del resumen, el iconito del mapa delante de «Teoría» y todo ese
  recuadro abre el mapa. Interruptor en los dos portales: RSM_SIN_MAPA=true. OJO quien toque las claves de las fichas: una clave
  nueva sale en el mapa solo si se añade a MAPA de piel/mapa.js.
- 19-oct 13:10 · Fichas y rediseño · HECHO (cada sitio comprobado justo antes; con el ok de Iago: «tienes ya mi OK… para subir todo») ·
  DIARIO deploy 6ad5f1e9 (encima de 6ad5eb29), solo ipad.html (0c1525aa): la nota 🗒 de cada apartado va con la escaleta como
  b.nota (hasta 120 letras), sea la del Radar o escrita a mano (Iago: «las notas que escriba yo a mano también deberían aparecerme»).
  AULA (LMEAVathome 3095bb1): piel/escaleta.js: b.nota en el cartel con la letra del subtítulo (blanca, 36 px; ya no la píldora
  amarilla); lm-piel.js: escaleta.js?v=2026-10-19b. OJO quien toque la escaleta: ahora SÍ salen en el aula las 🗒 escritas a mano.
  PREVIA (LMEAVathome 5b8da1d): piel/previa/previa.html, molde «Tipo test del libro»: ni la pregunta ni sus opciones (Iago: «no la
  resolución del tipo test… un parrafito de la información»): el concepto de título y un parrafito que lo explica. EXPL_TEST tiene
  uno por cada una de las 102 preguntas del BANCO de la ficha (teoriapro), buscadas por el texto de la pregunta normalizado; si no
  está, el del tramo (EXPL_TRAMO). OJO quien cambie el BANCO de los tipo test: una pregunta nueva o reescrita sale con el parrafito
  de su tramo hasta que se le escriba el suyo.
  PORTALES, RESUMEN DE TU SEMANA (index.html de GE, LMEAVathome d6da1e4, y de GP, este commit): «Ver detalle» con una flechita
  (sin el iconito; abierta, «Cerrar detalle»), los resúmenes anteriores en gris (.rsm-viejo) y, si areas[teoría].tarde, el chip
  de Teoría con su nota y «entregada tarde» (el SQL v5 del resumen, que lo marca, está pendiente). Banco: 58 de 58.
  Copias de antes: Dropbox APPs/_PARA BORRAR/19-oct-2026-antes-de-las-notas-a-mano-en-el-aula/,
  …/19-oct-2026-antes-del-tipo-test-explicado/ y …/19-oct-2026-antes-del-resumen-ver-detalle/; el Diario, en
  APPs/DIARIO PROFESOR (netlify diariodeiagocmus)/_SUBIDA-19-OCT-mediodia-notas-a-mano-en-el-aula (deploy 6ad5f1e9)/antes (deploy 6ad5eb29)/.
- 19-oct 12:15 · Fichas y rediseño · HECHO (cada sitio comprobado justo antes; con el ok de Iago: «tienes ya mi OK… para subir todo») ·
  DIARIO deploy 6ad5eb29 (encima de 6ad4b0f0), 4 ficheros: diario-radar.js r4 (a41b4e60) e index.html ?v=r4 (fc78bae2): el icono del
  Radar con los tres colores en el dibujo; en GP el ritmo entonado ya no va «todo junto»: Ritmo (nota_final) y Entonación
  (nota_secundaria con etiqueta entonacion, o payload.entonacion) salen aparte, como ya los separa el Diario; lo que hay que repasar,
  en rojo; de las áreas, la mejor en verde y la más floja en rojo. ipad.html (dc24cdc4): el vídeo elegido para el bloque de teoría
  sale en su tarjeta (en GE se pinta aunque no haya texto); la nota 🗒 que puso el Radar (solo la suya, tal cual) va con la escaleta
  como b.nota; diario-previa.js 2026-10-18c (¡Ojo! con variantes, 18274d1b).
  AULA (LMEAVathome 019e9ac): piel/escaleta.js: «Hoy en clase» → «Teoría: ▶ <vídeo>» (o una línea más); el cartel de la actividad
  enseña b.nota en amarillo («Recordar los matices»); lm-piel.js: escaleta.js?v=2026-10-19a.
  OJO quien toque la escaleta: b.video y b.nota vienen del iPad; las 🗒 escritas a mano NO se publican en el aula.
  Copias de antes: Dropbox APPs/DIARIO PROFESOR (netlify diariodeiagocmus)/_SUBIDA-19-OCT-radar-video-y-notas (deploy 6ad5eb29)/antes
  (deploy 6ad4b0f0)/ y APPs/_PARA BORRAR/19-oct-2026-antes-del-video-en-el-indice/.
- 19-oct 11:15 · Fichas y rediseño · HECHO (cada repo comprobado justo antes; con el ok de Iago: «adelante, y que sea
  reversible… sé cauto») · LA CAMPANA SIN GASTAR DE MÁS. En Supabase, el 87 % de las peticiones eran la campana de los portales:
  preguntaba cada 30 s, con 9 llamadas, aunque nadie mirara la pestaña (una pestaña olvidada abierta = 14.000 peticiones al
  día). index.html de GE (LMEAVathome 6fbfd95) y GP (este commit), solo AluCampana: autoRefrescar() no pregunta con la pestaña
  oculta (al volver o con el foco, al momento y una sola vez); POLL 60 s (antes 30); barridos(id, cada) —quiz/tareas, hitos
  (GP), recos, resumen— al entrar, al abrir la campana (si hace más de 1 min) y luego cada 10 min como mucho.
  AluCampana.refrescar() llamado desde otros módulos: igual que antes. AHORRO=false (junto a POLL): todo como antes.
  piel/apps/portal.js (LMEAVathome 0f783b2): cargarMorosos no pide con la pestaña oculta. Banco con reloj simulado (GE y GP):
  mismas llamadas al entrar, mismo globo, misma lista; 10 min a la vista, 160 → 53 llamadas; 30 min oculta, 480 → 0. OJO quien
  toque la campana: no volver a poner setInterval(refrescar, …) sin mirar document.hidden; los barridos van en barridos().
  Copias de antes: Dropbox APPs/_PARA BORRAR/19-oct-2026-antes-de-la-campana-que-ahorra/.
- 18-oct 23:05 · Magnetófono (Cowork, la conversación de las animáticas) · HECHO · commits 6c51215…19c429a · Repo magnetofono, solo prueba.html + cinta/ (index.html sin tocar): MOTOR v3 como La cabaña (Iago: «va a tirones… 1080 y 60 frames pero usando vídeos»): cinta/r (1080p60: un vídeo por tramo seguido con su sonido dentro, en trozos de 9,5 MB) y cinta/r3 (720p30), cinta/js (motor.js, comun.js y runs.js nuevo), prueba.html y LEEME; el micro se pide al pulsar la bobina; el prólogo sin pianos ni clarinete. Con el ok de Iago («Si, te dejo»), al final fuera cinta/v y cinta/v7 (quedan en el historial). En lmpro, solo esta línea.
- 18-oct 16:05 · Magnetófono (Cowork, la conversación de las animáticas) · HECHO · (1) voluntarios/ (b6ab9e6 y fc451c1): lm-voluntarios.js v3 (sin botón arriba: «Seleccionar voluntario» surge en el medio al empezar, en hora de clase; el del Fonógrafo, de cilindro de cera; ofrece({tras}) fuera de hora no espera a nada) y su LEEME; los portales no cambian. (2) Repo magnetofono, solo prueba.html + cinta/ (index.html sin tocar), commits f67ddef…492c41c (27): la interactiva con las animáticas nuevas (prólogo v5.3, bobina 1 v3.6, bobinas 2 y 3 v3.5): tramos en cinta/v y cinta/v7, pistas de sonido continuas en cinta/p (nuevo), motor y estaciones con las notas de Iago de la mañana, LEEME al día. En vivo: los 415 ficheros, iguales al repo; la bobina 1 suena y avanza en Chrome. Siguen en el repo, sin usarse, b1_00_g.mp4 y b3_08_e.mp4 de cinta/v y cinta/v7 (cortes de antes).
- 18-oct 13:50 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes; con el ok de Iago: «Sí, los
  dos») · RESUMEN DE TU SEMANA, LOS CUATRO RECUADROS IGUALES (Iago: «que los cuatro apartados… tengan el mismo largo… en versión
  móvil, un 2x2… que solo ponga teoría… y lo de ficha no entregada en pequeñito dentro del propio recuadro, abajo a la derecha,
  discreto»). index.html de los dos portales (LMEAVathome 8dd73f0 y este commit en lmpro): .rsm-chips es una rejilla de columnas
  iguales dentro de .rsm-chips-c (container-type:inline-size, nombre rsmc): 2 columnas, y 4 en fila con @container rsmc
  (min-width:500px); tamaños con cqw (clamp). Teoría sin entregar = «Teoría —» + <i class="rsm-noent-t">ficha no entregada</i>
  (9,5 px, rosa, abajo a la derecha). Fuera el «sin entregar» y la regla de tableta (641–900 px) de los recuadros. Banco: GE y
  GP a 360/390/820/1024/1280 px, 90 de 90. Y EL DIARIO (deploy 6ad4b0f0 encima de 6ad3ffa8): en el móvil la campana se ponía
  padding:10px!important y pisaba la zona segura del iPhone (la ✕ quedaba debajo de la hora y no se podía pulsar); ahora
  padding-top calc(12px + env(safe-area-inset-top)) y la ✕ de 44 × 44. suite-campana.js?v=s48 en las tres páginas: quien lo
  toque después, s49.
- 18-oct 13:50 · Magnetófono (Cowork, la conversación de las animáticas) · EN CURSO · (1) voluntarios/: lm-voluntarios.js v3 y su LEEME (V2 y V3 de Iago: el del Fonógrafo, de cilindro de cera; nada de botón arriba: «Seleccionar voluntario» surge en el medio al empezar, en hora de clase; los portales no cambian). (2) Repo magnetofono: la interactiva con las animáticas nuevas (prólogo v5.3, bobina 1 v3.6, bobinas 2 y 3 v3.5), hacia las 16:00. No toco index.html.
- 18-oct 12:45 · Fichas y rediseño · HECHO (Iago: «Este alumno, que ha entrado hoy, no tiene en notificaciones su resumen de la
  semana») · RESUMEN DE TU SEMANA: CASI NADIE LO TENÍA. Causa: suite_notificaciones ya tenía el índice único
  suite_notif_ref_uidx (ref_tabla, ref_id) y el resumen usaba de ref_id solo la semana ('2026-W42'), igual para todos: entró el
  primero y a los demás el portal les daba «duplicate key» (409) en cada refresco, callado (1.232 desde el 17). Arreglo (SQL
  lanzado por Iago, resumen-semana-4.sql; portales sin tocar, no usan ref_id): suite_resumen_barrer pone ref_id =
  'IYYY-Wnn:<cuenta>' (como los demás avisos), «ya lo tiene» mira solo la semana (split_part) y el insert va con on conflict do
  nothing sin índice; suite_resumen_barrer_todos (tarea lm_resumen_semana, viernes 17:01 y 18:01 UTC) sigue si una cuenta falla
  y cuenta los errores. Creados los 47 que faltaban (semana 12–18 oct, fechados el viernes 16 a las 19:00): 48 en total, ninguna
  cuenta validada sin el suyo; desde las 12:43 el portal recibe 200. OJO quien cree avisos en suite_notificaciones: (ref_tabla,
  ref_id) es único en TODA la tabla, no por cuenta: mete la cuenta en ref_id. Deshacer: _PARA
  BORRAR/18-oct-2026-resumen4-antes/deshacer-resumen-semana-4.sql.
- 18-oct 11:20 · Fichas y rediseño · HECHO (Iago: «si sabes que el ejercicio de claves ha salido mal, pues pones un ojo sobre
  explicación de cómo se resuelve… y que tengas varias variantes según el día… eso puedes aplicarlo a cualquier ejercicio del
  que no puedes tener un rastreo tan preciso») · EL ¡OJO! DE CUALQUIER EJERCICIO FALLADO. LMEAVathome e82aed0
  (piel/previa/previa.html 738153ed, antes 9aec3e68; piel/previa/elige.js 80aad636, 2026-10-18c): en eligeOjos, si paramsDe no
  saca el apartado exacto (o falla), variante(molde, key, curso, semana + n) da una de las variantes de ejemplo de ese tipo
  (filtradas: escala mayor/menor, identificar/construir, cadencias de GE sin perfecta, adornos/abreviaciones, enarmonía de la
  nota/avanzada; los test, no) y el pick lleva generico: true. El resumen de MOLDES (window.__previa.resumen, moldes.json) lleva
  ya TODAS las variantes. acordePro: dos de construir más (Sol 7, Mi ø). Sin ¡Ojo!: solo ex_* de GP (no hay molde). OJO:
  diario-previa.js sigue sin subir (Diario 6ad3ffa8, 08bd63ce). Copia de antes: APPs/_PARA
  BORRAR/18-oct-2026-antes-de-las-variantes/.
- 18-oct 10:55 · Fichas y rediseño · HECHO (cada repo comprobado justo antes; con el ok de Iago: «Sí, los dos») · EL MANDO N76 Y
  EL ¡OJO! DE TODOS LOS TIPOS. LMEAVathome d19b007 y f5eadab (piel/escaleta.js 6003dd9b, antes 83f78b0a; piel/lm-piel.js
  9fa9f4b1, carga escaleta.js?v=2026-10-18c): el mando de Iago (Norwii N76) hace solo cuatro cosas («sin funciones de mantener
  ni cosas extrañas»): arriba (Tab) = play / pausa (antes de empezar, el ▶); → (o ↓, Av Pág) = siguiente; ← (o ↑, Re Pág) =
  anterior; F5 en clase no recarga y no hace nada; B, «.» y Esc ya no hacen nada; en la previa, el mando no hace nada. Y 8c9843b
  (piel/previa/previa.html 9aec3e68; piel/previa/elige.js 0be5595a, 2026-10-18b): el tipo de ejercicio, grande, en la línea del
  «¡Ojo! Cuidado con esto»; en GP la rotación también saca los moldes de GE; paramsDe ya saca el ¡Ojo! de
  int_clasif/intervalos_id, int_constr/intervalos_build, inv_*/inversion_int_*, acordes*, aco_*/inversion_aco_*, cadencias y
  ton_* de GP (antes devolvía null y salía otro), y fallados el apartado de casi todos. Supabase: escaleta_previa_fichas, 2.ª
  versión (en GE, cada ejercicio entero salvo render y _solSvg; la creó Iago con Run). Siguen sin ¡Ojo! propio (salen solo de
  repaso): cla_* (la ficha no guarda la clave), semitonos, ena_*/enarmoniapro, gra_senalar, ton_vecinos, esc_otras/escala_otras
  y acordespro_*. OJO: diario-previa.js NO se ha subido (sigue 08bd63ce en el Diario 6ad3ffa8): su copia del motor es la de
  antes; da igual, manda lo del aula. Quien toque escaleta.js: el próximo ?v en lm-piel.js, después de 2026-10-18c. Copias de
  antes: APPs/_PARA BORRAR/18-oct-2026-antes-del-mando-n76/ y 18-oct-2026-antes-del-ojo-por-tipos/.
- 18-oct 09:26 · Magnetófono (Cowork, la conversación de las animáticas) · HECHO · LA VERSIÓN INTERACTIVA DEL MAGNETÓFONO, SOLO
  PARA PROTESTER (Iago, 17-oct: «que me lo habilites solo en Protester, para que yo lo pueda ir viendo ahí»; hoy: «sube», «pero
  sólo para protester»).
  (1) magnetofono, commits fa9251d…5666e0b (23): prueba.html + cinta/ NUEVOS (el motor, las estaciones de las tres bobinas, los
  tramos de vídeo en cinta/v/ y cinta/v7/, sonidos en cinta/a/, imágenes en cinta/i/; qué es y cómo se quita: cinta/LEEME.txt).
  En vivo: https://magnetofono.gp.lmathome.es/prueba.html (sin enlazar desde ningún sitio y con noindex); su index.html, SIN
  TOCAR.
  (2) lmpro, commits 0bbb807 (hitos/), 0c8c1d5 (voluntarios/) y 0f05dbc (index.html 29cfc13a…): PRUEBAS u4 → con la cuenta
  Protester la medalla u4 se VE CERRADA, con la sombra del icono nuevo (u4n, la caja de Alemania con el magnetófono) y la «?»,
  pero al pulsarla abre la prueba con «#c=<cuenta>»; lo mismo la u3 de Atonalidad, que hasta hoy le salía abierta (misterio:true
  en las dos; Iago, 18-oct: «que visualmente se siga viendo con la interrogación, eso sí, con el icono nuevo… ponme también el
  de atonalidad con la interrogación (aunque en protester sí pueda acceder pulsando)»); cuando se abra la semana, se ven
  abiertas, como siempre. Tester y alumnos, igual que antes (probado sin red en 1280 y 390: las once medallas idénticas a las de
  main, cerradas y abiertas). En vivo, con la cuenta Protester: Fonógrafo y Acústica abiertas, Atonalidad y Magnetófono con la
  «?» y al pulsarlas abren su prueba; las demás, cerradas («Todavía no desbloqueado»); magnetofono sirve los 339 ficheros (200,
  mismos bytes). HITO_TEMAS «magnetofono» (tema «cinta»: «MAGNETÓFONO» en Bodoni crema, «Bobina N» en el rojo de grabar, el
  título en una etiqueta a máquina, la luz roja y dos bobinas que giran despacio; con «reducir movimiento», quietas) + hitos/ (6
  ficheros nuevos); voluntarios/lm-voluntarios.js v2 (más el tema «cinta»; museo, radio y disco idénticos, probados los cuatro)
  y su LEEME.md. SUPABASE: nada. El SQL de las tarjetas (_suite_hito_meta y _suite_hito_de_texto con «magnetofono» y «bobina N»;
  comprobado contra lo de hoy) está SIN EJECUTAR y lo lanza Iago: APPs/DIARIO PROFESOR (netlify
  diariodeiagocmus)/SQL-BD/18-oct-2026-hitos-magnetofono (SIN EJECUTAR).sql; hasta entonces no sale ninguna tarjeta del
  Magnetófono en la campana. Deshacer: borrar la entrada u4 de PRUEBAS (y la línea de u4n) y el «misterio:true» de la u3, o
  subir los de APPs/_PARA BORRAR/18-oct-2026-lmpro-antes-del-magnetofono/ (index.html, lm-voluntarios.js y LEEME.md de 3ce6f36 =
  d14d7b1); en magnetofono, borrar prueba.html y cinta/. OJO quien toque @MEDALLERO: mantén las entradas u3 y u4 de PRUEBAS con
  su misterio:true (y el .misterio de pintar(), del clic y del CSS) y la línea de u4n de __MED_IMG__ (va DESPUÉS de las de u3n,
  que la del 15-oct crea __MED_IMG__ de cero). OJO quien toque voluntarios/: es la v2, con cuatro temas.
- 18-oct 09:20 · Fichas y rediseño · HECHO (cada repo comprobado justo antes; con el ok de Iago: «en clase ya ni toco el iPad…
  lo que sí abro es el portal tester o el protester… ahí es donde decida» y «y si construyo el intervalo, que lo haga igual») ·
  EL ¡OJO! DE LA PREVIA LO CALCULA LA PANTALLA DEL AULA. LMEAVathome 5bd21e7 (piel/previa/previa.html fadac467, antes 25c5f5bc;
  piel/previa/elige.js 64d7d4d8, NUEVO) y 56af89b (piel/escaleta.js 83f78b0a, antes ea9cd8ab; piel/lm-piel.js 7b06bc13, antes
  1472de03, carga escaleta.js?v=2026-10-18a): con el portal abierto (desde 8 min antes como mucho; a la hora en punto sobra) y
  solo con la cuenta Tester / Protester, la escaleta pide UNA VEZ POR CLASE escaleta_previa_fichas(p_cuenta_id, p_grupo, p_anio,
  p_semana) (Supabase, NUEVA: security definer, solo lectura, con _escaleta_es_profe; las entregas de la última ficha cerrada
  del grupo, sin nombres; la crea Iago con Run) y elige con piel/previa/elige.js (generado con gen-diario.py: el motor de
  ojos.js y lo compartido de diario-previa.src.js). Se guarda en sessionStorage lm_esc_ojo:<clave>|<clase>. En pvConfig manda lo
  calculado aquí (aunque sea null: uno de repaso) sobre el bloque «__previa» del iPad. PREVIA_V 2026-10-18a. Para mirar:
  LMEscaleta.ojo(); para quitarlo: OJO_ON = false. Además, «Construye el intervalo» (intConstr) con la natural en medio y su
  raya, como al clasificar. OJO quien toque escaleta.js: el próximo ?v en lm-piel.js, después de 2026-10-18a; quien toque
  eligeOjos, paramsDe o fallados: regenerar elige.js y diario-previa.js (gen-diario.py). Copias de antes: APPs/_PARA
  BORRAR/18-oct-2026-antes-del-ojo-en-el-aula/.
- 18-oct 08:25 · Fichas y rediseño · HECHO (con el ok de Iago: «prefiero que añadas en el medio un sol natural pequeño… y una raya
  más») · INTERVALOS EN LA PREVIA. LMEAVathome f6c5e0b (solo piel/previa/previa.html, 3df44964; antes 84ae8fa6): en el ¡Ojo!
  «Clasifica el intervalo», las 2ª y 3ª que se cuentan sin alteraciones y la alteración cambia: la alterada se aparta, la
  natural queda en medio en cabecita pequeña y sale la raya de la alteración (+ st / − st); igual en las 6ª y 7ª al darles la
  vuelta (antes ahí faltaba ese paso y la línea final no cuadraba). OJO quien toque intClasif en ojos.js: rayaAlt y «aparta».
  Copia de antes: APPs/_PARA BORRAR/18-oct-2026-previa-antes-de-intervalos/.
- 18-oct 01:10 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes; con el ok de Iago: «¡Ojo! que
  faltan» y «Todo, y la previa ya encendida») · LOS ¡OJO! QUE FALTABAN. LMEAVathome 19d3766 (solo piel/previa/previa.html,
  84ae8fa6; antes 3b02110d): 8 moldes nuevos del «¡Ojo! Cuidado con esto» (GP: serieArmonica, dodeConstruir, dodeVariante,
  modulacion, transporte, blues; GE: terminos, quizGE = notas de adorno y abreviaciones). Llevan «rotacion: false»: solo salen
  por un error de verdad en la última ficha cerrada, nunca de repaso (eligeOjos los salta). Diario 6ad3ffa8 (encima de 6ad3f2f1):
  diario-previa.js 2026-10-18a (08bd63ce) saca el apartado fallado de esos ejercicios (en GE, términos/adornos/abreviaciones
  leen aparte estado->i->_terminos/_quiz, solo lectura) e ipad.html solo cambia su ?v (b5e4fe13). OJO quien toque eligeOjos o
  paramsDe en la previa: diario-previa.js lleva una copia generada (gen-diario.py); paramsDe no puede usar TEO. Copias de antes:
  APPs/_PARA BORRAR/18-oct-2026-previa-antes-de-los-ojos-nuevos/ y _SUBIDA-18-OCT-madrugada-ojos-que-faltaban (deploy 6ad3ffa8)/.
- 18-oct 00:15 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes; con el ok de Iago: «Todo, y
  la previa ya encendida») · LA PREVIA DEL AULA, ENCENDIDA. LMEAVathome cfdf2ab y 36dc272 (piel/previa/: previa.html 3b02110d,
  la música previa-ge48.mp3 y los sonidos) y 4d81e7a (piel/escaleta.js be67747d; piel/lm-piel.js f4a7ff08 carga
  escaleta.js?v=2026-10-17p): la cuenta atrás del aula es ahora la previa, en un marco con sandbox (BASE + previa/previa.html):
  aviso con los recordatorios, «¡Ojo! Cuidado con esto», respiro y, en GE, consejo; dura lo que mida (cuentaDe; la de siempre,
  CUENTA = 32 s) y «Hoy en clase» sigue en su sitio. Se decide al empezar la cuenta (sessionStorage lm_esc_pv:<clave>); si no
  está lista, la de siempre; «Saltar», Av Pág / → / Esc o 3,5 s sin señales del marco → la de siempre con su pista. El sonido
  de la previa lo pone escaleta.js (pvSuena, por el MASTER). Y EL MANDO (keydown en escaleta.js): Av Pág / Re Pág, B o «.»,
  F5 sin recargar en clase, flechas solo en el portal; con libro, pizarra, dictado, editor o campo de texto, no hace nada.
  Diario 6ad3f2f1 (encima de 6ad3cc2b): diario-previa.js (nuevo) calcula el ¡Ojo! de cada grupo (última ficha cerrada, error
  más repetido y su apartado; solo lee evaluaciones) e ipad.html (pubDatos) lo publica en el bloque «__previa» (m: 0; la
  escaleta de antes lo ignora). OJO quien toque escaleta.js: sube su ?v en lm-piel.js (ahora 2026-10-17p) y no uses CUENTA
  para las fases (es la pista de 32 s): usa v.cu. Quien toque pubDatos (ipad.html): deja el bloque «__previa». Para apagar la
  previa: PREVIA_ON = false en escaleta.js. Copia de antes: APPs/_PARA BORRAR/17-oct-2026-escaleta-antes-de-la-previa/.
- 17-oct 21:30 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes; con el ok de Iago) ·
  DIARIO (Netlify diariodeiagocmus 6ad3cc2b encima de 6ad3a730; suite-campana.js?v=s47, sha1 48b619b3; las tres páginas solo cambian
  el ?v=s46 → s47): la campana SIN HORAS de los alumnos. Iago: «la hora a la que terminó… no es un dato importante… me va a hacer
  tóxico mirar eso… el tiempo que han echado, sí». Fuera «terminó a las HH:MM» de itemsLibres (un rato de varios días ponía en todas
  sus tarjetas la hora en que acabó el rato entero) y la hora de itemsResets («Cambió su contraseña» y el mensaje que se copia, solo
  con el día). Se quedan los plazos de las fichas (fechaHoraGal/hastaTxt), la fecha y hora de las notas borradas y la del certificado.
  OJO quien toque la campana del Diario: no volváis a poner la hora de la actividad de los alumnos (los minutos, sí).
- 17-oct 20:05 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes; con el ok de Iago) ·
  CAMPANA y RESUMEN DE TU SEMANA (3.ª vuelta). LMEAVathome (index.html d613d22b) y lmpro, este commit (index.html 0ed6abca):
  (1) contarPendientes ya no cuenta el resumen semanal ni los portales interactivos (payload.portal_hito): «que la campana solo
  numere las tareas, reclamaciones y mensajes»; (2) sin el punto de «nuevo» (.alu-dot display:none) en .rsm y .cv2-hito; (3) teoría
  con no_entregada → chip «Teoría · sin entregar» (rosa; title con la frase entera) y, en GE, «No se entregó la ficha de esta
  semana» en «Ver mi semana»; rsmN(null) = «—»; rsmRecos no cuenta áreas sin nota; (4) .rsm>.cv2-mid con height:auto y
  min-height:64px y chips compactos de 641 a 900 px (en iPad el 4.º chip se salía de la tarjeta; ya pasaba antes). SQL
  resumen-semana-3.sql (lo lanza Iago): suite_resumen_barrer_todos() y la tarea de pg_cron «lm_resumen_semana» (viernes 17:01
  y 18:01 UTC → 19:01 de Galicia en verano y en invierno) crean el resumen a todas las cuentas validadas; _suite_resumen_areas:
  teoría = la ficha que cerró ese viernes a las 19:00 (suite_fichas_asignadas.fin_normal, la de su grupo) con la nota que tenía
  al cerrar; si no la entregó: {ap:'teoria', nota:null, no_entregada:true, ficha:N}.
- 17-oct 18:53 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes; con el ok de Iago) ·
  RESUMEN DE TU SEMANA (2.ª vuelta), LA CABAÑA y DIARIO. (1) LMEAVathome 6f56d8a (index.html 249bfbd6) y lmpro, este commit (index.html
  388384b8): el icono «semana» sin la raya de abajo y con las barras grandes; el puntito de «sin ver», con los cuatro colores
  (conic-gradient); la fecha, «12–18 oct» (.rsm-fecha), discreta y sin marco tras el título; en GP (payload.nivel = 'gp'), solo las
  cuatro notas, sin «Ver mi semana»; y el resumen dura 7 días desde su creado_en: luego deja de pintarse y de contar en el globo
  (contarPendientes lo cuenta solo si está sin leer y vigente). (2) Solo GP, la cabaña (.hito-cab): fuera el ruido de entrada (el
  ::after, sin animación; el dial se queda) y el borde del icono, el puntito y los botones, con rgb(var(--hito-dia)) (azul, verde o
  salmón según el día) en vez de blanco. (3) Diario 6ad3a730 (encima de 6ad38ea7; suite-campana.js?v=s46, fbc0f2a2): los cambios de
  contraseña ya no tienen sección propia: son avisos de «Actividad de los alumnos» (itemsResets), con el nombre oficial cuando
  suite_pass_resets_listar devuelve nombre y apellidos. Eso lo trae el SQL resumen-semana-2.sql (lo lanza Iago), que además cambia
  _suite_resumen_areas: la última ficha entregada aunque no sea de esa semana, y en los dictados de GP con porcentajes, «pres_…» =
  true es que está BIEN (resta cuando es false).
  OJO quien toque la campana del Diario: seccionResets ya no se pinta; los cambios de contraseña salen de itemsResets.
- 17-oct 18:01 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes; con el ok de Iago) ·
  CAMPANA DEL ALUMNO, GE y GP: LMEAVathome 06a1538 (index.html c99b179d) y lmpro, este commit (index.html 7681daeb).
  (1) «RESUMEN DE TU SEMANA»: aviso tipo 'aviso' con payload resumen_semana (ref_tabla 'resumen_semana', ref_id 'IYYY-WIW', índice
  único suite_notif_resumen_unico). Lo crea la RPC suite_resumen_barrer(p_cuenta_id), que el portal llama en refrescar() después de
  suite_recos_barrer (con try/catch: si aún no existe, no pasa nada), fechado el viernes a las 19:00 (Madrid) y solo si hubo notas esa
  semana, de lunes a domingo. Las notas salen de _suite_resumen_areas (interna, revocada a anon y authenticated). El SQL
  (resumen-semana.sql) lo lanza Iago. En el portal: rsmTarjeta(), justo debajo de «Tareas de la semana» (su _cuandoAviso es el de las
  tareas menos 1 ms); «Ver mi semana» despliega las cajas por área; «Marcar como visto» la pone gris.
  (2) Botones de ancho estándar (.cv2-btn2, blancos con contorno: .cv2-visto2 y .cv2-sobre2): «Marcar como visto», «Marcar como
  estudiadas», «Marcar como hecha» y «Contestar a Iago»; encima del botón principal (26 px) si lo hay y, si no, abajo (34 px).
  Reclamación: «Contestar a Iago» (la marca vista) y «Ver mi ficha corregida». (3) Solo GP: la tarjeta del día de un portal temático
  dice «Marcar como visto» y «✓ Visto» (antes, «hecho»).
  OJO quien toque la campana: no volváis a los cuadraditos .cv2-cuad en las tarjetas; una acción secundaria nueva, con cv2-btn2 y
  cv2-visto2. Si cambiáis el orden de render(), que el resumen siga debajo de las tareas de la semana.
- 17-oct 15:12 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes; con el ok de Iago, «súbelo todo») ·
  ACTIVIDAD «POR LIBRE» CON LO QUE HIZO DENTRO. (1) teoriapro 38a3899: index.html pone en <i id="lm-que" data-lm-ejercicio>
  «<data-path>|ej», «|ap» o «|vi» (ejercicios, apuntes, vídeo; en la portada '' = no cuenta); compases.html y modulacion.html, su marca
  fija («compasespro|ej», «modulacion|ej»). (2) cualidadesdelsonido 7cbd498: prueba.html, marcaLatido() «dia-N», «dia-N-paradas»,
  «repaso» ('' en la portada y las listas). (3) LMEAVathome 7b8f622: piel/latido.js, sonando() mira también el vídeo/audio de los
  iframes de la misma web (los vídeos de Teoría van en uno). (4) Diario 6ad372b5 (encima de 6ad34707; suite-campana.js?v=s44, 8ab9cb4d):
  «Por libre» de Teoría PRO por apartado y tipo; portales temáticos, una tarjeta por día con la textura de HITO_TEMAS
  (gp.lmathome.es/hitos/<portal>-<n>.webp) y data-leer-id «l|<rato>|<n>»; flechita ⌄ «ver todo» en las tarjetas del listado que no caben.
  OJO quien toque Teoría PRO o un portal temático: mantened el <i id="lm-que"> y sus claves (el Diario las traduce en PORTAL_LIBRE y
  TEO_GP de suite-campana.js). Un portal nuevo por días o capítulos: que apunte «<pref>-N» y añadidlo a PORTAL_LIBRE.
- 17-oct 14:01 · Fichas y rediseño · HECHO · TEORÍA PRO (repo teoriapro, commit d977da3, index.html 70fdfbe5; con el ok de Iago)
  + Supabase (SQL lanzado por Iago): REPASO de una ficha ya entregada, «oculto» (sin botón en el Diario; se da con
  select suite_ficha_repaso_dar('nombre', '2Gp', 4, 'motivo')). suite_ficha_abrir devuelve ahora 'repaso' (true si la cuenta tiene
  un repaso por hacer de esa ficha; entonces abre aunque haya pasado fin_gracia). En teoriapro, con repaso=true: aviso antes de
  empezar (no se evalúa), empieza en blanco, sin progreso ni SuiteTiempo, botón final «Corregir y ver mi nota» y entrega con
  suite_ficha_repaso_entregar (tabla suite_ficha_repasos; NO toca evaluaciones ni el Diario). Un enlace con &repaso=1 cuyo
  repaso ya está hecho dice «Ya hiciste el repaso». El aviso de la campana es una tarjeta «Recomendado para ti» (payload
  recomendacion + apps): el portal no cambia.
  OJO quien toque suite_ficha_abrir o el arranque de alumno de teoriapro: mantened el campo 'repaso' y el atajo &repaso=1.
- 17-oct 11:58 · Fichas y rediseño · HECHO · DIARIO (Netlify diariodeiagocmus 6ad34707 encima de 6ad342cd, con el ok de Iago): Radar v3
  (diario-radar.js?v=r3, bf5447d9; index.html 65e08d33). (1) Bloque de teoría (GE: .notas-por-clase[data-bloque-id=bloque_teoria]
  textarea[data-clase]; GP: #gp-bteo-notas-c1/c2): si está vacío, placeholder «Sugerencia: repasar …» (lo más flojo de la última
  ficha) y un + (.drd-mas) que escribe el texto y lanza input y change. (2) SOLO GE: el Radar ESCRIBE una nota en
  bloques_data.__notas_bloque[entonacion|dictado] (criterio por debajo del 70 % o el mismo fallo de presentación del dictado en 3
  o más) y lo apunta en bloques_data.__radar_notas = {bloque: {txt, clave}}. Nunca pisa una nota escrita a mano, no repone las
  que se borran, no repite una clave usada en las 2 semanas anteriores y solo escribe en semanas de la actual en adelante con la
  anterior ya terminada; guarda con window.scheduleSave(). (3) Ventana: sugerencias arriba, semáforo (rojo <5, amarillo 5–6,99,
  verde ≥7) y barrida de radar.
  OJO quien toque el Diario: que parta de 6ad34707 (index.html 65e08d33). bloques_data.__radar_notas es del Radar: no lo borréis
  al guardar ni lo uséis para otra cosa.
- 17-oct 11:42 · Fichas y rediseño · HECHO · DIARIO (Netlify diariodeiagocmus 6ad342cd encima de 6ad340b9 y 6ad32a90, con el ok de Iago):
  dos módulos nuevos que carga index.html justo después de diario-prep-extras.js. (1) RADAR (diario-radar.js?v=r2, cecd2c65):
  botón en la barra de la preparación (GE y GP), a la izquierda de la chincheta 📌 (o de Guardar), con un «1» rojo cada
  semana hasta que se abre (localStorage drd-visto:curso:anio:semana). Ventana de SOLO LECTURA (grupos_canon,
  alumnos_canon, evaluaciones; sin testers ni evaluación inicial): la última ficha que entregó casi todo el curso,
  ejercicio a ejercicio (%, por debajo del 50 %, ceros, patrones), y las áreas de la mejor a la peor con la media del
  curso de la semana pasada, tendencia de 6 semanas y criterios. (2) ESCALETA DEL AULA SIN IPAD (diario-escaleta-aula.js?v=e1,
  5a045c09): con la preparación a la vista y la semana (de la actual a +3) 15 s sin cambios, carga ipad.html de C1 y C2
  en iframes ocultos (&tactil=0&aula=1), espera a que __escaletaAula.datos() se quede quieto y llama a escaleta_guardar
  con la clave de esa vista; no escribe nada más. index.html 33a06827.
  OJO quien toque el Diario: que parta de 6ad342cd (index.html 33a06827). Si alguien cambia ipad.html, que
  window.__escaletaAula.datos() siga devolviendo {bloques, tareas}: ahora la escaleta del aula depende de eso aunque
  nadie abra el iPad. Copia de antes: Dropbox «_SUBIDA-17-OCT-radar-y-escaleta-sin-ipad (deploy 6ad342cd)/antes (deploy 6ad32a90)».
- 17-oct 10:03 · Fichas y rediseño · HECHO · DIARIO (Netlify diariodeiagocmus 6ad32a90 encima de 6ad27105, con el ok de Iago):
  en la CAMPANA, el 0 automático por no entregar (tarjeta negra con calavera, itemsCeros) ya va en el MISMO cuadro que
  las demás notas (mismo alto y ancho, misma columna) y centrado; antes era un cuadrado propio (30×30 en el móvil, 34 de
  alto en PC/iPad) y con la alineación por línea base el 0 quedaba arriba. Iago eligió «0» (no «0,00»): el ancho lo da un
  «0,00» invisible (.scv-cero-num::before). suite-campana.js 23e10f18 y su ?v=s43 en index.html, ipad.html e iphone.html.
  OJO quien toque la campana: que parta de 6ad32a90 y suba el ?v= de suite-campana.js (ahora s43) en los tres HTML.
- 16-oct 20:52 · Fichas y rediseño · HECHO · DIARIO (Netlify diariodeiagocmus 6ad27105 encima de 6ad2428d, con el ok de Iago):
  «Tareas para casa» salía VACÍO en «Fin de la clase» en GE. La casilla «Sin tareas» (semanas.tareas_ge_sin_tareas) está
  oculta desde julio y la marca el Diario SOLA cuando «Otras tareas» está vacío (diario-restyle.js): significa «sin OTRAS
  tareas», no «sin tareas». ipad.html pubTareas() la leía como «ninguna tarea» y mandaba []; ahora pubTareasGE() manda
  lecciones, quiz (__introRitmo) y ficha (__ficha_fisica o teoria_ficha_numero) con sus números —lo mismo que el envío a
  los alumnos, que SIEMPRE estuvo bien— y las «otras» solo si las hay. app.js: lo mismo en el PDF (construirSemanaGE).
  OJO quien toque el Diario: que parta de 6ad27105 (ipad.html 4e952097, app.js 85722257) y que NADIE use
  tareas_ge_sin_tareas como «sin tareas». Copia de antes: Dropbox «_SUBIDA-16-OCT-noche-tareas-en-la-pantalla-del-aula
  (deploy 6ad27105)/antes (deploy 6ad2428d)». Ofrecido a Iago (sin aplicar): cron los viernes 17:00 y 18:00 UTC con
  suite_quiz_barrer() para que el reparto quede hecho a las 19:00 aunque nadie abra el portal.
- 16-oct 19:30 · Fichas y rediseño · HECHO · ACORDES EN TEORÍA GE Y GP (lo que pidió Iago), publicado y comprobado en vivo:
  teoriaathome 10b9385 (index.html b55c9b28) y teoriapro 4fd4aa8 (index.html 70cd5b10). (1) CONSTRUIR (Inversión de acordes
  «B · Construye», «Acordes» GE y sus fichas, «Construye» del avanzado GP y fichas GP): vale el bajo pedido (o la fundamental)
  en su sitio y las demás notas por su NOMBRE, en cualquier octava y orden, siempre por encima del bajo (antes: la posición
  exacta); una nota por debajo del bajo o escrita con otro nombre (Mi♯ por Fa) sigue mal. (2) IDENTIFICAR («A · Identifica»,
  «Identifica» del avanzado GP, fichas GP de acordes y de inversión): rueda de la FUNDAMENTAL con ♭/♯, corregida (verde, o
  roja con la buena debajo); en A · Identifica cuenta 1/3 (fundamental, tipo, inversión); en GP, 1/2 (fundamental, tipo).
  Todo sale de LM_ACO (script justo después de <body> en los dos index.html: arriba(), bajo(), raizRueda()); en GP, además,
  el override de ACORDES_MOTOR («grupo de 4 compases»). Lo nuevo lleva _v:2; las fichas ya repartidas (sin _v) corrigen
  como antes. Copia de antes: Dropbox _PARA BORRAR/16-oct-2026-antes-de-los-acordes. OJO quien toque teoría: que parta de
  10b9385 (GE) / 4fd4aa8 (GP).
- 16-oct 19:05 · Fichas y rediseño · HECHO · «FIN DE LA CLASE» (LMEAVathome 1ee4450, piel/escaleta.js + lm-piel.js,
  escaleta.js?v=2026-10-16m): «Poner faltas» abajo en el centro y más grande y, a su lado, «No vinieron: …» (lo marcado
  como «No vino» durante la clase en dictado GE, ritmo GE, entonación GE y ritmo entonado GP; en GP, quien ni envió el
  dictado por el QR ni está corregido a mano). Lo da una función nueva, escaleta_ausentes (solo lectura; SQL dado a Iago
  con enlace, PENDIENTE de que lo pegue; sin ella no sale la línea). Las apps de corrección guardan «No vino» así:
  corr_notas.no_vino; rit_notas / ent_notas / rep_notas .sin_evaluar.
- 16-oct 18:50 · Fichas y rediseño · HECHO · ESCALETA Y PORTAL, lo que pidió Iago desde clase, publicado y comprobado en
  vivo: LMEAVathome 64aa7ed (piel/escaleta.js + piel/lm-piel.js, escaleta.js?v=2026-10-16l): tarjeta SIEMPRE de 300 px y
  sin animación (en el portal la fila de botones se aparta de golpe; antes se medía a medio deslizar y no paraba de
  moverse); + amarillo en la esquina de la tarjeta y de la línea (libros, pizarra, dictado) → ventana grande en el centro
  con la escaleta entera (lo hecho tachado, lo de ahora destacado, lo que falta; − para volver); en el DICTADO ANIMADO la
  escaleta en una línea dentro de su barra (.dc-top, antes de .dc-top-derecha); el DESCANSO a pantalla completa todo el
  rato con cuenta atrás y «Después: …» (en la C1, la entonación sin número; tocar o Esc lo quitan). 96f525a
  (piel/apps/portal.js, sección 20): fuera el aro rojo «La pantalla nota algo apoyado aquí» (TQ_ARO = false; lo demás
  igual). Quien toque escaleta.js: subir su ?v= en lm-piel.js. Copia de antes: Dropbox _PARA BORRAR/16-oct-2026-antes-del-
  mas-y-el-descanso. Sigue: los «no vino» de las apps de corrección en «Fin de la clase» (con un SQL que pega Iago) y los
  acordes de teoría GE/GP.
- 16-oct 18:15 · Fichas y rediseño · HECHO (sin EN CURSO aparte; cada repo comprobado justo antes) · LO QUE PIDIÓ IAGO DESDE
  CLASE ESTA TARDE, todo publicado y comprobado en vivo: (1) ESCALETA (LMEAVathome piel/escaleta.js + lm-piel.js): 37b8a9d
  aviso del cambio a un 30 % (unos −10 dB) · d333971 «Poner faltas» pequeño abajo a la izquierda en «Fin de la clase» (las
  tareas, lo grande) y la línea de la pizarra en negro · 6e44f22 en el PORTAL la tarjeta SIEMPRE arriba en el centro y la
  fila de botones de la derecha (⚠ morosos, pizarra, libros…, campana) se aparta con un transform en .topbar-right (la
  píldora #lm-fmt-centro, oculta mientras está la tarjeta) · 442832a el cartel del cambio y «Fin de la clase» en TODAS partes
  (libros, pizarra, dictado animado, carruseles, vídeos; con algo a pantalla completa se meten dentro, y un vídeo a pantalla
  completa se sale de ella) salvo en los portales interactivos de GP (*.gp.lmathome.es salvo teoria.gp y carruseles);
  .lme-full con z-index 2147483647. Ahora: escaleta.js d3ab538b, lm-piel.js 14289d70 (?v=2026-10-16k). OJO quien toque la
  piel: que parta de 442832a. (2) DIARIO (Netlify diariodeiagocmus 6ad2428d encima de 6ad2325a): la imagen de la solución
  del dictado (la que enseña el iPad en la corrección) con barra final (en GP, de pentagrama a pentagrama); las imágenes ya
  hechas con la ruta «curso-año-semana.png» se rehacen UNA vez en «…-fin.png» al abrir esa semana en el Diario;
  diario-dictado-clase.js ?v=r20. OJO quien toque el Diario: que parta de 6ad2428d. (3) QUIZ DE RITMO (ritmoathome c3fe408):
  el fondo de colores (manchas bajo blur 40 px) quieto en pantallas táctiles (fases 1, 2 y 4) y, en la fase 4, mientras se
  juega (body.jugando); banco con CPU ×6: de ~11 a ~59 fps. OJO: que parta de c3fe408. Nota: en 4.º GE, semana 42, el Diario
  tiene «sin tareas»; por eso el fin de la C2 de hoy no enseñó tareas. Deshacer: APPs/_PARA BORRAR/16-oct-2026-antes-del-aviso-
  mas-bajo, …-antes-de-faltas-pequeno-y-linea-negra, …-antes-de-la-escaleta-centrada-en-el-portal, …-antes-del-cartel-en-todas-
  partes y …-antes-de-la-fluidez-del-quiz; el Diario, Netlify 6ad2325a.
- 16-oct 16:43 · Fichas y rediseño · HECHO (en este mismo commit, con index.html) · PIZARRA «Pentagrama» Y ESCALETA (Iago: «cuando
  estamos con la pizarra… que no ocupe, no me invada ni tape botones… en el medio, solo con una línea… a la izquierda los
  colores, en el centro la escaleta y a la derecha los grosores»). index.html de lmpro (este commit) y de LMEAVathome: la
  barra de la pizarra en tres partes (claves, compases y colores · hueco #pz-esc · grosores, goma, selección, deshacer y
  borrar; la ✕ al final). LMEAVathome piel/escaleta.js + lm-piel.js (?v=2026-10-16g): con la pizarra abierta, la escaleta en
  una línea dentro de #pz-esc (lo que toca y cuánto queda) y la tarjeta y el ▶ de fuera, ocultos. Deshacer: los commits
  anteriores a estos en cada repo.
- 16-oct 16:31 · Fichas y rediseño · HECHO · ESCALETA DEL AULA, dos retoques que pidió Iago (LMEAVathome bc2e736, piel/escaleta.js +
  lm-piel.js ?v=2026-10-16f): «durante la reproducción de un vídeo didáctico quiero que la escaleta no se vea… molesta» → con el
  vídeo abierto desde la tarjeta (didáctico o temático), la tarjeta no se ve (inmersivo() = «pantalla»); y «en FaActos e
  Intervalia… solo la línea de la actividad actual, sin la de antes y la de después» → en el libro, solo qué toca y cuánto
  queda. Deshacer: volver a subir los dos de fef9561.
- 16-oct 16:20 · Fichas y rediseño · HECHO (en este mismo commit, con index.html) · ATONALIDAD POR CAPÍTULOS (Iago: «bloquear
  cada capítulo hasta verlo en clase»), como los días de Acústica. atonalidad be96f7b: prueba.html con window.AtonHitos
  («#cu=…&dias=…», «&dia=N»): portada con candado en el capítulo aún no visto, «Fin del capítulo N» sin pasar al siguiente si
  está cerrado, «Seguir donde lo dejaste» y, al alumno, sin el panel «Prueba:» ni el «Página de prueba» (el profe con #c= y
  quien llega sin nada, todo abierto). lmpro f538fa4: hitos/ con las texturas y letras de Atonalidad. lmpro (este commit):
  index.html, la medalla u3 = el museo (atonalidad.gp.lmathome.es/prueba.html), abierta por hitos como u2 (HITO_WEB en
  conHitos), y Escape acaba el revelado entero. Supabase (lo ejecutó Iago): _suite_hito_meta con Atonalidad encendida y sus
  títulos, la cabaña ya «Acústica» y un emoji por portal en suite_hitos_barrer (DIARIO PROFESOR/SQL-BD/
  2026-10-16-hitos-atonalidad*.sql). Diario (Netlify diariodeiagocmus 6ad2325a encima de 6ad20152): diario-video-teoria.js
  con los títulos de los capítulos y «Acústica»; index.html con su ?v=v2. Y la ESCALETA DEL AULA (LMEAVathome, piel/escaleta.js
  + lm-piel.js): eeb3b94, detrás de la campana (y de Mis resultados) mientras está abierta (z-index 80 con :has); fef9561
  (?v=2026-10-16e), con un libro del aula abierto (FaActos, Intervalia…) va DENTRO del libro en una línea (#lme-mini: qué toca,
  «quedan N min», qué viene), en su barra entre el título y el cambio de página o, con «Ampliar», flotando arriba en el
  centro; la tarjeta y el ▶ de fuera se apartan mientras. Deshacer: copias en Dropbox _PARA BORRAR/
  16-oct-2026-antes-de-atonalidad-por-capitulos/ (lo de esta tarde; la escaleta, también el commit anterior a cada uno); del
  Diario, _SUBIDA-16-OCT-tarde-titulos-de-atonalidad (deploy 6ad2325a)/antes; el SQL, con su -DESHACER.
- 16-oct 15:22 · Fichas y rediseño · HECHO (en este mismo commit, con index.html) · PORTAL GP, dos ajustes que pidió
  Iago. (1) Tarjetas de Acústica «demasiado blancas»: blanco solo el contorno y los botones; «Día N» en el ámbar de la
  cabaña, y la letra de mano y la aguja de la radio con el tono de la habitación de cada día (1 bruma azul, 2 verde del
  osciloscopio, 3 coral de los cables): solo cambia HITO_CSS. (2) Medallero: el revelado de un portal nuevo ya NO saca
  cartel ni capa que bloquee: foco, niebla fuera con respingo y sonido, y se apaga solo (~2,8 s); espera a que el
  medallero se vea (en el móvil, tras «Continuar de todas formas») y se da por visto al empezar. Tocado: colocar,
  siguiente, cerrar y ceremonia (+ aLaVista y empezar), una guarda al principio de arrancar() y el fundido de
  .medrev-veo. Deshacer: volver a subir el index.html de c203c9a0 (copia en Dropbox, APPs/_PARA BORRAR/
  16-oct-2026-antes-de-corchetes-y-portales/lmpro-4-c203c9a0/).
- 16-oct 14:55 · Fichas y rediseño · HECHO (sin EN CURSO aparte; lmpro seguía en mis commits) · TARJETAS DE LOS PORTALES,
  ajustes pedidos por Iago: c30d5c6 textura del Día 3 de Acústica (hitos/cabana-3.webp, se abre el jueves); 1714fe0 «Ir a
  ver» abre el día Y lo da por hecho (además de «Marcar como hecho», para quien ya lo vio en clase), ya en gris «Ir a ver»
  sigue funcionando, y los días de un portal juntos con el más reciente arriba (Día 2 y justo debajo Día 1); y ahora
  Acústica en BLANCO (contorno, botones, radio), sin «Leer mensaje completo» en estas tarjetas y el título nunca se recorta
  (index.html 558a928a → 2a9f419e → c203c9a0). Deshacer: index.html de dfec80b (o de bf11662 para quitar las tarjetas).
- 16-oct 14:08 · Fichas y rediseño · HECHO (sin EN CURSO aparte; comprobado justo antes que lmpro seguía en d02a0a5,
  index.html de bf11662) · (1) PORTAL GP · TARJETAS DE LOS PORTALES en la campana (lmpro 8d75873 + dfec80b): carpeta nueva
  hitos/ (texturas de Acústica Día 1 y Día 2 hechas con ChatGPT a partir de las imágenes de cada día, con sus credenciales
  C2PA, y las letras Jost y Mano) e index.html con HITO_TEMAS (un registro por portal: tema, medalla, nombre, parte, títulos
  y texturas; Atonalidad y Fonógrafo, preparados pero sin texturas en hitos/ ni avisos). Se llama «Acústica · Día N» (no «La
  cabaña»), «Ya disponible» discreto, arriba «Marcar como hecho» del mismo largo que «Ir a ver» (solo ese botón la marca
  leída; «Ir a ver» y tocar la tarjeta ya no) y los días de un mismo portal van juntos y en orden, en el sitio del más
  reciente. Deshacer: index.html de bf11662 (copia en _PARA BORRAR/16-oct-2026-antes-de-corchetes-y-portales/lmpro-3/).
  (2) DIARIO 6ad20152 (antes 6ad1e543): en el móvil, «Ver su portal» en la ficha del alumno (iphone-app.js e iphone.html,
  s32). Deshacer: publicar 6ad1e543.
- 16-oct 12:32 · Fichas y rediseño · HECHO (sin EN CURSO aparte; comprobado justo antes que lmpro seguía en b65e3af,
  LMEAVathome en 5078acd y cualidadesdelsonido en a2ac6e9) · (1) ESCALETA DEL AULA (piel/escaleta.js + lm-piel.js, solo
  Tester/Protester): ▶ del vídeo del bloque de teoría (didáctico encima, con la escaleta arriba; temático a pantalla
  completa), el cartel de cada actividad con «Abrir ›» y velado, y «Poner faltas» en «Fin de la clase» (C1 y C2: hay que
  marcarlo para cerrarla). LMEAVathome 5c443ce → 19d16b1 → 5078acd → 6157691. Deshacer: la piel de 4d4d466. (2) QUIZ,
  fase 4: ataque de la base de 50 a 10 ms (sonaba detrás del metrónomo). ritmoathome 4de62ad. Deshacer: 1b8b99d.
  (3) DIARIO: «Vídeo» en el bloque de teoría de Preparación de clases (diario-video-teoria.js, nuevo: GE didácticos; GP
  temáticos + didácticos) y la vista iPad lo publica en la escaleta. Netlify diariodeiagocmus 6ad1e543 encima de
  6ad13c27. (4) PREDICT CARRUSEL en la pantalla: el del iPad solo si es de hace 30 min o menos; si no, uno nuevo
  («Generando un carrusel nuevo…»). PredictCarrusel a9467a3. (5) HITOS DE LOS PORTALES (GP): Supabase (lo ejecutó Iago):
  _suite_hito_de_texto, _suite_hito_meta, _suite_hitos_gp, suite_hitos_de y suite_hitos_barrer (avisos tipo «aviso» con
  ref_tabla «portal_hito» y payload_json.portal_hito; solo La cabaña encendida); lmpro bf11662 (campana: tarjeta «La
  cabaña · Día N» con «Ir a ver»; la medalla u2 la abren los hitos); cualidadesdelsonido 54ad90c (la cabaña: candado en
  los días no vistos, window.CabHitos, «#cu=…&dias=…&dia=N»). Deshacer: SQL-BD/2026-10-16-hitos-portales-DESHACER.sql,
  lmpro b65e3af, cualidadesdelsonido a2ac6e9. OJO: quien toque index.html de lmpro, que parta de bf11662; la piel de
  LMEAVathome, de 6157691; la cabaña, de 54ad90c; el Diario, de 6ad1e543.
- 16-oct 10:30 · Fichas y rediseño · HECHO (sin EN CURSO aparte; comprobado justo antes que ritmoathome seguía en ceec5cc,
  LMEAVathome en 9bdfa93 y lmpro en 432cddd) · (1) QUIZ DE RITMO, las 4 fases (Iago: «el corchete pase por encima del
  silencio cuando hay semicorcheas del mismo pulso antes y después»; fase 4: «silencio de semicorchea, no ese símbolo raro»
  y «que lo adelantes un poquito»): autoBeam une por encima de los silencios cortos DEL MISMO PULSO (sin los del principio
  o el final); fase 4 con silencios de verdad (glifos Bravura) y ventana de precisión 50 ms antes (ADELANTO_VENTANA; el
  dibujo no cambia). ritmoathome 1b8b99d. Deshacer: ceec5cc. (2) PORTAL GE: el quiz a medias dice «Continuar el quiz»
  (localStorage suite_quiz_abierto_<cuenta>_<envío>). LMEAVathome 4d4d466. Deshacer: 9bdfa93. (3) PORTAL GP: el temazo de
  Protester va debajo de la botonera, a la altura de la tira de la música; la medalla de Atonalidad lleva el icono nuevo
  para todos (cerrada: sombra dorada con «?»). lmpro 60f6720. Deshacer: 432cddd. Quien toque index.html de lmpro o de
  LMEAVathome, que parta de 60f6720 / 4d4d466; las fases del quiz, de 1b8b99d.
- 15-oct 23:23 · Fichas y rediseño · HECHO (sin EN CURSO aparte; comprobado justo antes que LMEAVathome seguía en edd4fdf) ·
  PENDIENTES DE IAGO («termina lo pendiente»): (1) MOROSOS DEL PORTAL (GE y GP), «más estrechos, primer apellido entero»: la
  lista mide 360 px (antes 430) y, si un nombre no cabe, se abrevian los demás apellidos y nunca el primero («Margarita
  Fernández de N. L.»; el entero, en el title). piel/apps/portal.js (morAcortar; arrancarTictac va antes de pintar, para
  medir con su CSS) y portal.css. LMEAVathome 9bdfa93. Deshacer: esos dos de edd4fdf. El logo que baja con la escaleta ya
  estaba (escaleta.js: .hero margin-top 64px con la tarjeta). (2) NOMBRES LARGOS en las correcciones de ritmo, entonación y
  ritmo entonado, como en el dictado GE: nombres-cortos-15oct.js (nuevo) y una línea en index.html. Netlify ritmoelemental
  6ad142fd, entonacionelemental 6ad14303, ritmoentonadoprofesional 6ad14309. Deshacer: borrar esa línea (o 6ac61a0a / 6ac619e1
  / 6ac616d3).
- 15-oct 23:02 · Fichas y rediseño · HECHO (sin EN CURSO aparte) · DIARIO: LA CAMPANA NUEVA, A LA PRIMERA. El móvil y el iPad de
  Iago seguían con la campana de la tarde: el service worker (sw.js) abre los .js desde la copia guardada y solo los renueva
  por detrás; lo que los baja a la primera es cambiar su ?v=. index.html, ipad.html e iphone.html: «suite-campana.js?v=s41» →
  «?v=s42» (nada más). Netlify diariodeiagocmus, deploy 6ad13c27 encima de 6ad13afc. OJO: quien cambie suite-campana.js, que
  suba también ese ?v= en las tres páginas (s43…). Quien despliegue el Diario, que parta de 6ad13c27. Deshacer: 6ad13afc.
- 15-oct 22:52 · Fichas y rediseño · HECHO (sin EN CURSO aparte) · DIARIO, CAMPANA COMPACTA (Iago, móvil, iPad y ordenador: «no
  necesito la fecha debajo del icono… el alto de cada notificación, el del icono y el margen mínimo… la fecha, en los grupos del
  mismo día, aparte»; y luego: «los iconos, minimalistas, a la izquierda de la nota; la nota, lo último»): sin fecha debajo del
  icono; en «Actividad de los alumnos» todas las tarjetas del mismo alto (64 px en ordenador e iPad, 52 en el móvil), nombre y
  línea gris en una línea cada uno y un separador por día («Hoy», «Ayer», «Martes 13/10»; lo visto, «Vistas · Hoy»); la lupa y
  el ⚠ del comentario, iconos de línea delante de la nota. Netlify diariodeiagocmus: deploys 6ad138ea y 6ad13afc (el vivo)
  encima de 6ad13260; suite-campana.js 783ff3db… (antes 89ce4458…). Quien despliegue el Diario, que parta de 6ad13afc.
  Deshacer: volver a publicar 6ad13260 (sin la versión compacta) o 6ad138ea (compacta, con los iconos de antes).
- 15-oct 22:12 · Fichas y rediseño · HECHO (sin EN CURSO aparte; Netlify vuelve a dejar subir ficheros) · LOS DOS DESPLIEGUES DE
  NETLIFY que se habían quedado a medias por el error 500 de esta tarde: (1) DIARIO (diariodeiagocmus, deploy 6ad13260 encima de
  6ad0e9f6): suite-campana.js 89ce4458… (antes 16a93aa2…): en el móvil, tarjetas compactas e iguales (nota pequeña, sin la fecha
  del medio en la línea gris) y la tarjeta nueva «Por libre» en «Actividad de los alumnos», que lee suite_actividad_listar como
  mucho cada 10 min (para no gastar Supabase). Quien despliegue el Diario, que parta de 6ad13260. (2) CORRECCIÓN DE DICTADOS GE
  (dictadoselemental, deploy 6ad132e5 encima de 6ad0a528): en la cabecera de la rúbrica, los nombres largos se abrevian lo justo
  en vez de cortarse con «…» (nombres-cortos-15oct.js nuevo y una línea en index.html, b2eaaf48…). Comprobado en vivo por huella.
  Deshacer: volver a publicar 6ad0e9f6 / 6ad0a528 desde Netlify (copias de antes en el Dropbox, cada una con su LEEME).
- 15-oct 21:49 · Fichas y rediseño · HECHO (sin EN CURSO aparte) · FUERA EL BOTÓN DE REFRESCAR (Iago: «si hay alguna notificación sin
  yo darle a refrescar no sería necesario el botón»; eligió quitarlo y que se recargue solo): al VOLVER al portal tras 1 min o
  más fuera, si ha cambiado lo publicado (página o piel, por su tamaño) se recarga solo en ese momento; nunca con la escaleta
  en marcha, con algo abierto o escribiendo, y como mucho una vez cada 10 min. piel/apps/portal.js = el de 7d3e186 + el bloque
  «VERSIÓN NUEVA, SOLA»; portal.css = el de 7d3e186. LMEAVathome edd4fdf. Deshacer: esos dos de 7d3e186 (o de 9508ff9, con botón).
- 15-oct 21:37 · Fichas y rediseño · HECHO (sin EN CURSO aparte; sigue a la entrada de las 21:26) · TRABAJO POR LIBRE en los temáticos
  que faltaban (una línea con piel/latido.js antes de </body>, parcheada sobre la versión de GitHub y comprobada por huella):
  magnetofono 68ab840, transporte 6004c74, modulacion 656d89b, blues 3f41dfd y afrolatin fb9f3d5. Deshacer: borrar esa línea
  (o volver al index.html del commit anterior de cada repo).
- 15-oct 21:26 · Fichas y rediseño · HECHO (sin EN CURSO aparte; comprobado justo antes que main seguía en df26330 y LMEAVathome
  en 7d3e186) · PORTALES (Iago, noche): (1) BOTÓN DE REFRESCAR en la portada, GE y GP («muchas veces entro y quiero ver si
  hay novedades y tengo que cerrar la ventana»): cuadrado 1×1 liso como la campana, a su derecha (antes de «Pantalla
  completa»), visible con la sesión abierta; recarga el portal. piel/apps/portal.js (botonRefrescar) y portal.css (bloque
  «REFRESCAR»), LMEAVathome 9508ff9. (2) TRABAJO POR LIBRE (avisos en la campana del Diario: quién, en qué subportal y
  ejercicio, cuánto rato practicando de verdad —2 min o más— y a qué hora terminó; un aviso por rato): lm-piel.js carga el
  nuevo piel/latido.js en todas sus apps (LMEAVathome 8ee75e1). En los portales deja la cuenta del alumno en una cookie de
  .lmathome.es (lm_cta_ge / lm_cta_gp; nunca las de Tester/Protester ni en el Ojeador); en los subportales manda un latido
  por minuto (suite_actividad_ping) solo con la pestaña delante y algo tocado en los últimos 2 min (o un vídeo sonando).
  No cuentan: tareas (fichaId, quizCarta, introCarta…), lo abierto desde el Diario, ritmo, entonación, dictados ni el
  Carrusel. Los temáticos lo cargan con una línea antes de </body>: fon-grafo 3623cef, cualidadesdelsonido a2ac6e9
  (prueba.html) y atonalidad a50a34f (index y prueba). Faltan magnetofono, transporte, modulacion, blues y afrolatin.
  Supabase (SQL pegado por Iago): columna suite_actividad_sesiones.detalle y suite_actividad_ping / _listar nuevos.
  La tarjeta de la campana del Diario, pendiente (Netlify da 500 al subir). Deshacer: lm-piel.js de 9508ff9 (sin él,
  latido.js no se carga); portal.js y portal.css de 7d3e186; en los temáticos, borrar su línea (copias de todo en
  APPs/_PARA BORRAR/15-oct-2026-portal-antes-del-refrescar/, -piel-antes-del-latido/ y -tematicos-antes-del-latido/).
- 15-oct 20:23 · Fichas y rediseño · HECHO (sin EN CURSO aparte: retoques de la escaleta de las 18:58, publicados pasadas las 20:00;
  comprobado justo antes que main seguía en 47036eb y LMEAVathome en b1367e7) · ESCALETA v7b y MOROSOS (Iago, en clase):
  (1) «lo de los morosos, que no desaparezca si pulso el play de 30 temas… solo que se vaya al empezar la cuenta atrás»:
  piel/apps/portal.js (e311c0a8…) no cierra la lista con clics fuera mientras la escaleta está en la entrada (se sigue
  cerrando con su icono y con Esc) y escaleta.js la cierra al empezar la cuenta atrás; (2) «en la preparación quita la barra
  amarilla de abajo»: fuera; (3) el menú del botón de libros (y los demás de arriba) ya no queda detrás de la tarjeta de la
  escaleta: mientras está abierto, la tarjeta se aparta; (4) la lección de ritmo de hoy, con su contorno amarillo aunque la
  tarea esté hecha (la tarjeta gris recupera su color mientras toca). LMEAVathome 3feddd2 (escaleta.js e62714e5…) y 7d3e186
  (portal.js). Banco 44/44, 21/21, 6/6, 4/4 (morosos), 4/4 (libro y gris), 2/2 (abrir a medias). Deshacer: piel/escaleta.js
  y piel/apps/portal.js de b1367e7 (copias en APPs/_PARA BORRAR/15-oct-2026-escaleta-antes-de-v7b/).
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
