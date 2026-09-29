# Coordinación entre conversaciones de Claude · lmpro (portal GP)

Iago tiene varias conversaciones de Claude subiendo cambios a este portal a la vez. Este fichero es el punto de
encuentro (empieza por «_» para que la web no lo publique). Antes de subir nada: mira el último commit de `main`, lee
esto, apunta abajo fecha, quién eres, qué vas a tocar y «EN CURSO» (en un commit solo con este fichero), edita
SIEMPRE sobre la versión del último commit y, al acabar, cambia tu línea a «HECHO · commit xxxxxxx».

## Registro (lo más reciente arriba · hora de Galicia)
- 29-sep 10:19 · Fichas y rediseño · EN CURSO · piel/apps/portal.js (LMEAVathome): la ventana de bienvenida de la
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
