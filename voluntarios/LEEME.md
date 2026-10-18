# Seleccionador de voluntarios · LM at home GP (14-oct-2026)

Hecho por Claude para Iago (conversación Cowork del escape room «Atonalidad»). Solo lo ve la cuenta **Iago González Protester**.

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
