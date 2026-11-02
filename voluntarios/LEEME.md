# Seleccionador de voluntarios · LM at home GP (14-oct-2026)

Hecho por Claude para Iago (conversación Cowork del escape room «Atonalidad»). Solo lo ve la cuenta **Iago González Protester**.

## v7 (2-nov-2026): «modjugador», la pantalla de selección de personaje (Modulación)
Iago (2-nov): el selector de los 4 días de Modulación, igual, «como un selector de personajes»: todos los alumnos con su RETRATO
pixel art de busto (de frente, con su instrumento; hecho por descripción, ropa al azar), en blanco y negro salvo el que pisa la
flecha del ratón; el ratón pasea, se para, hace clic y el elegido sube al centro en color en un marco dorado, con «¡TE TOCA!»;
de fondo, música 8-bit «rollo MIDI, retro total». `VERSION = 7`. Los demás temas, igual (los v6 de Modulación siguen, sin uso).
- Retratos: `suite_vol_avatares(p_cuenta_id)` → `{alumnos:{<nombre>:{instr,f1,f2}}, gen:{'gen:<instrumento>':{f1,f2}}}` (PNG de
  144 px de alto en Supabase, tabla `suite_vol_avatares`; f2 = f1 bajado 2 px, respiración). Sin retrato → `gen:<instrumento>`
  → `gen:otro`. Si la llamada falla, tarjetas sin retrato (como modpixel).
- Música: bucle chiptune original (8 compases, 140) con el sintetizador A; fanfarria al clic.
- Cómo se hacen los retratos (y cada curso): Dropbox `APPs/LMATHOME GP (github lmpro)/VOLUNTARIOS (fuentes)/v7-personajes/LEEME.md`;
  lo recuerda un aviso del Diario al guardar la semana en la U8.
- Deshacer: lm-voluntarios.js y LEEME.md del commit bb63dba (v6), o en el portal devolver el mapa de temas de integra_sesion.

## v6 (2-nov-2026): los cuatro temas de Modulación
Iago (2-nov): el portal de Modulación (modulacion.gp.lmathome.es, U8) lleva selector de voluntarios con «un tipo de generador aleatorio…
de cada una de las sesiones». `VERSION = 6`. Los temas de antes, **igual**. Cuatro temas nuevos (1920×1080 escalado, sin dependencias;
solo las letras que carga el portal: Marcellus SC, Pixelify Sans, DotGothic16, Atkinson Hyperlegible, IBM Plex Mono):
- `modpixel` (Sesión 1, «Viajar entre tonalidades»): pantalla «ELIGE JUGADOR» en píxel, de noche (los azules del nivel 2D); el cursor salta
  de tarjeta en tarjeta con su «blip» de onda cuadrada, frena, la elegida parpadea, confeti de píxeles, fanfarria chiptune y «¡TE TOCA!».
- `modmapa` (Sesión 2, «Tres formas de viajar»): el mapa de pergamino con su rosa de los vientos; los nombres son pueblos en un circuito
  y la ficha del viajero (capucha, sin cara) los recorre frenando; el elegido, en oro, con su sello de lacre y un arpegio de arpa.
- `modpuente` (Sesión 3, «Construye el puente»): el puente colgante al atardecer, un nombre en cada tablón; la luz del farol los recorre
  frenando y el elegido se enciende en oro con la cadencia sol7 → do.
- `modrueda` (Sesión 4, «Práctica libre»): la rueda de armaduras convertida en tambor (escala 3♯…0…3♭ en latón); gira hacia abajo con
  un «tic» por nombre y se para en la ventana central, con la misma cadencia.
- El portal: un cargador en cada sesión (s1–s4) con `tema` según la sesión y `empezar: ['#inicio']` (sale al «Pulsa para empezar»).
- Fuentes y capturas: Dropbox `APPs/LMATHOME GP (github lmpro)/VOLUNTARIOS (fuentes)/v6-2-nov-2026/`.
- Deshacer: volver a subir la v5 (`lm-voluntarios.js` del commit anterior); el portal de Modulación cae al tema `museo`.

## v5 (22-oct-2026): una animación por día, capítulo, bobina o sección
Iago (22-oct): «pedí que cada día de un portal… tenga su propia animación de aleatoriedad de alumnos… hoy me encontré en el día 3
de la cabaña la misma animación… que el del día 2» y «que las dos secciones de trabajo del fonógrafo también tienen cada uno un
diseño». `VERSION = 5`. Los temas de antes quedan **igual**.
- **`monta({ temaDe })`**: una función del portal que dice qué tema toca en **esa** oferta (recibe lo que se pasa a `ofrece()`).
  Si `ofrece({ tema })` trae un tema que existe, manda ese. Sin `temaDe`, todo como en la v4.
- **Siete temas nuevos** (1920×1080 escalado, sin dependencias; solo las letras que ya carga cada portal):
  - Atonalidad: `cordon` (capítulo 1, el museo de día: postes de latón con su cartela y el cordón de terciopelo que cae en el
    elegido) y `dado` (capítulo 2, la noche de los grafitis: el dado de oro que rueda y se para con su nombre arriba). El 3
    sigue con `museo` (la rueda del candado).
  - Magnetófono: `caza` (bobina 2, el plano del metro de París de 1948: el vagón da vueltas a la línea, frena en una estación y
    se enciende «● REC») y `maquina` (bobina 3, la máquina de escribir del Club d'Essai: escribe los nombres cada vez más
    despacio y el último, en rojo; «EN ANTENA»). La 1 sigue con `cinta`.
  - Acústica: `arbol` (Día 1, el lago al amanecer: una ráfaga recorre los pinos de la orilla, cada uno con su tablilla; el
    elegido cruje, se parte y cae al agua; luego, silencio) y `sinte` (Día 3, el sintetizador modular: el cable coral salta de
    toma en toma, cada toma suena con otro timbre del mismo La —seno, triángulo, sierra, cuadrada, campana FM, filtro, órgano,
    coro— y el osciloscopio dibuja su onda; los nombres, a mano en cinta de carrocero). El 2 sigue con `radio`.
  - Fonógrafo: `taller` (el montaje: la mesa del despacho con el tapete verde, las piezas de latón con su etiqueta de cartón y
    una lupa que las recorre; sin campanitas: roce, papel y el «clac» de una pieza que encaja). La grabación, con el cilindro
    (`disco`).
- **Los portales** (solo su `LM_VOL_CONFIG`; el Fonógrafo, también el final del montaje): Acústica y Atonalidad leen el día o el
  capítulo de su pantalla de carga (`#carga .ceja`); el Magnetófono usa la bobina que ya pasaba (`ofrece({ dia })`); el Fonógrafo
  usa `taller` en la oferta del montaje (`#mcEmpezar`) y, **nuevo**, al acabar de montar y antes de grabar llama a
  `ofrece({ tema: 'disco' })` (hasta ahora la grabación no tenía sorteo). Con el módulo v4, los portales siguen como antes.
- Fuentes de los temas y los scripts: Dropbox, `APPs/LMATHOME GP (github lmpro)/VOLUNTARIOS (fuentes)/v5-22-oct-2026/`.
- Deshacer: volver a subir la v4 (`lm-voluntarios.js` y este LEEME anteriores; copia en
  `APPs/_PARA BORRAR/22-oct-2026-voluntarios-v4/`). Los portales no hace falta tocarlos (sin la v5, `temaDe` no se usa); para
  quitar la oferta antes de grabar del Fonógrafo, volver a subir su `index.html` anterior (copia en la misma carpeta).

## v4 (20-oct-2026): temas del Blues y un tema por oferta
Encargo del proyecto «Blues»: una estética por acto, y que cada oferta pueda elegir la suya. `VERSION = 4`. Los cuatro temas de
antes (`museo`, `radio`, `disco`, `cinta`) quedan **igual**.
- **Cuatro temas nuevos** (1920×1080 escalado, sin dependencias; solo las tipografías que el portal ya carga: Limelight,
  Cormorant Garamond, Jost y Poiret One):
  - `telegrafo` (Acto 1, vapor de 1928): el telégrafo de órdenes de la sala de máquinas, latón #C9A45C, crema #F3E6C8 y azul
    acero #3E5E7A. Con pocos nombres, **sectores** y una palanca que barre; con muchos, un **tambor** que gira con su trinquete.
    Al final, doble campana y el sector del elegido se enciende. «Voluntario» y el nombre, en Limelight.
  - `tabla` (Acto 2, tabla de lavar): zinc ondulado en marco de madera, ocre #9A6A2E y un dedal de metal que **raspa** hacia abajo
    y hacia arriba y da el **golpe** al frenar; la línea del elegido se ilumina.
  - `marquesina` (Acto 3, art déco): marquesina roja #8C1E26 y oro con bombillas que persiguen, letras que **voltean** (con su
    tecla), y al final bombillas parpadeando, aplauso y metales. «Voluntario» en Limelight.
  - `album` (Acto 4, el álbum de John): fotos en ámbar #A0672A, páginas que **pasan** (pagina/papel), pies de foto en Cormorant
    cursiva; la página elegida se ilumina suave.
- **Sonidos** (`monta({ sonidos })`; si falta alguno, suena el sintetizador del módulo): `campana` (telégrafo), `raspa`
  (lista de 2: abajo y arriba) y `golpe` (tabla), `tecla` y `aplauso` (marquesina), `pagina` y `papel` (álbum).
- **`ofrece({ tema })`**: el tema de **esa** oferta. Si `tema` existe en `TEMAS`, esa oferta (botón y ruleta) usa esa estética;
  si no existe o no se da, usa el de `monta`. Cada tema inyecta su CSS solo cuando se usa (`lmv-css-<tema>`) y el botón lleva la
  clase `lmv-of-<tema>`. Ejemplo: `LMVoluntarios.monta({ portal:'blues', tema:'telegrafo', engancha:false, sonidos })` y, en el
  Acto 3, `LMVoluntarios.ofrece({ tema:'marquesina' })`.
- Los temas nuevos respetan **`prefers-reduced-motion`**: el giro dura menos, sin destellos ni confeti, y los cambios son directos.
- **Nombres largos**: en los temas nuevos el nombre final se achica hasta caber (`nombreFit`, opcional por tema), aunque sea
  «María del Carmen Fernández-Villaverde»; probado con 1, 6, 12 y 22 nombres. Los cuatro temas antiguos no lo llevan (si algún
  día aparece un nombre así, basta con ponerles `nombreFit: { min: 40 }`).
- `gira()` de los temas nuevos espera hasta 0,7 s a que carguen los sonidos antes de empezar, para que el primer giro no sea mudo.
- Deshacer: volver a subir la v3 (`lm-voluntarios.js` anterior); los portales no cambian.

## v3 (18-oct-2026): el botón surge solo al empezar, y el Fonógrafo es de cilindro
Iago (18-oct): «Nada de botón arriba: que SURJA SOLO al abrir con Protester EN HORARIO DE CLASE. Al “Empezar el día N” (cuando
ya ha cargado lo que tenga que cargar, o tras “permitir micrófono”), un botón en el MEDIO de la pantalla, “Seleccionar
voluntario”, y ya con ese grupo. En casa, fuera de hora, no sale.» · «El del Fonógrafo NO puede ser un disco: es de CILINDRO DE
CERA.» · «El día 1 del Fonógrafo NO lleva voluntario (es solo verlo).»
- **Ya no hay botón arriba.** Al pulsar el botón de empezar del portal (`#cEmpezar` en Acústica y Atonalidad, `#mcEmpezar` en
  «Monta tu fonógrafo»; el día 1 del Fonógrafo, el vídeo, no tiene) —o cuando el portal llama a `LMVoluntarios.ofrece()`, como
  hace el Magnetófono al empezar cada bobina, después del permiso del micro—, si hay clase en ese momento sale en el medio
  **«Seleccionar voluntario»** (debajo, el grupo de esa hora) y **«Ahora no»**. El portal espera: empieza en cuanto se cierra
  la ruleta o se dice «Ahora no». Fuera de la hora de clase no sale nada y el portal empieza como siempre.
- **Fonógrafo: el cilindro de cera** (el tema sigue llamándose `disco`, para no tocar el portal): el fonógrafo de frente, con
  los nombres alrededor del cilindro, que suben por la cara que se ve y frenan; el que queda delante, junto al fiel de latón,
  se ilumina con la fanfarria.
- Lo de los cuatro temas (uno por portal) sigue igual. Lo de «un selector distinto por día» (V1) queda para otra tanda.
- Deshacer: volver a subir la v2 (`lm-voluntarios.js` de antes; copia en `_PARA BORRAR/18-oct-2026-voluntarios-v2/`).
- (18-oct, tarde) `ofrece({ tras })`: primero mira si hay clase; **fuera de hora no espera a nada** (ni al permiso del micro)
  y el portal empieza ya, como antes. En hora de clase sí espera a que se conteste al permiso y entonces saca la oferta.

## Qué hace (v1–v2; desde la v3, sin el botón de arriba: ver arriba)
- En cada portal interactivo del medallero GP sale, arriba a la derecha (a la izquierda de la pausa y la pantalla completa),
  un botón con icono y el texto «Voluntarios».
- Solo está activo en la **hora exacta** de clase de los grupos GP (tabla `horario_clases` de Supabase, hora de Madrid):
  2GpC martes 18–19 y jueves 19–20; 2GpF martes 19–20 y jueves 18–19. Fuera de esa hora se ve apagado y, si se pulsa, dice
  cuándo es la próxima clase.
- Al pulsarlo, se abre la ruleta y **gira sola** unos 5 s hasta un alumno del grupo que tiene clase. «Otra vez» vuelve a girar;
  «Cerrar» (o Esc) la cierra. Si la historia del portal estaba en marcha, se pone en pausa.
- **Cada nombre que sale queda fuera** hasta que hayan salido todos los de su grupo (haya aceptado ser voluntario o no). Cuando
  ya han salido todos, empieza una ronda nueva con el grupo entero. El sorteo lo hace Supabase, no la página.
- Cada portal tiene su estética (su «tema»): `museo` (Atonalidad: la rueda del candado del capítulo 3), `radio` (Acústica ·
  La cabaña: la radio que sintoniza el nombre), `disco` (Fonógrafo: el disco y la aguja) y, desde el 18-oct-2026 (v2),
  `cinta` (Magnetófono: los nombres escritos en la cinta, que rebobina, frena y deja uno bajo el cabezal de reproducir; sus
  sonidos, en el portal: `cinta/a/vol_rebobina.mp3`, `vol_frena.mp3` y `vol_tecla.mp3`).

## Cómo funciona
1. El medallero de `gp.lmathome.es` (index.html, bloque @MEDALLERO, función `conCuentaVol`) abre cada portal con
   `#c=<cuenta>` **solo** si la sesión es la de pruebas (Tester/Protester).
2. El portal lleva al principio del `<head>` un **cargador** (bloque «SELECCIONADOR DE VOLUNTARIOS»): quita `#c=` de la
   dirección, guarda la cuenta en ese navegador (`localStorage.lm_vol_cuenta`) y carga `lm-voluntarios.js` de esta carpeta.
   Sin cuenta guardada no carga nada: a los alumnos no les llega nada.
3. `lm-voluntarios.js` pregunta a Supabase (`suite_voluntarios_estado`, `suite_voluntarios_tira`, migración
   `voluntarios_gp_20261014`). Si la cuenta no es Protester, Supabase no devuelve nada, el módulo olvida la cuenta y no
   enseña el botón. La tabla `suite_voluntarios` no se puede leer ni escribir desde la web (RLS sin políticas).

## Para un portal NUEVO (Iago: «en todos los portales, incluidos los futuros»)
1. Añadir un tema nuevo en `lm-voluntarios.js` (`TEMAS.<nombre>`: su CSS y su `crea()` con `ajusta`, `espera`, `gira` y
   `quita`), con la estética del portal.
2. Pegar el cargador al principio del `<head>` del portal con su configuración (`portal`, `tema`, `boton: { padre, antes,
   clase, id }`, `alAbrir`) y una regla CSS `#bVoluntarios` que lo coloque a la izquierda de sus botones de arriba a la
   derecha, con la misma forma que ellos. Plantilla y configuraciones: `cargador.py` en las fuentes (Dropbox).
3. Nada más: el medallero ya pasa la cuenta a cualquier portal que abra.

## Deshacer
- De un portal: borrar su cargador y su regla `#bVoluntarios` (o volver a subir la versión anterior de su página).
- De todos: borrar esta carpeta (los portales siguen igual, sin botón) y, en index.html, que `conCuentaVol` devuelva `u`.
- Supabase: `APPs/DIARIO PROFESOR (netlify diariodeiagocmus)/SQL-BD/14-oct-2026-voluntarios-DESHACER.sql`.
  Para vaciar solo la ruleta (que todos vuelvan a poder salir): `delete from public.suite_voluntarios;`
