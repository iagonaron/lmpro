# ESTUDIO POR FASES UNIFICADO · DECISIONES DE IAGO (20-nov-2026)

Coordinadora: conversación «Piloto lección 57 digital» (Claude). Toda conversación que toque el estudio por fases
(ritmopro, ritmoathome, Entonación at home, visor de lecciones de LMEAVathome/lmpro) lee esto ANTES de cada bloque y
apunta aquí lo que Iago diga «para todos». Lo más reciente manda. (Empieza por «_»: la web no lo publica.)

Base de diseño: `iagonaron/ritmopro` → `_DISENO-ESTUDIO-POR-FASES.md` + `index.html` (commit fd6f623, 20-nov 09:52) y
los cambios del 20-nov 10:06–10:12 (§5), AJUSTADOS con la recapitulación de Iago del 20-nov 10:31 (§1–4), que manda.

## 0. Qué se unifica (mismo aspecto, mismos carteles, mismos botones, mismo piano)
1. **Ritmo at home** (GE, repo `ritmoathome`): lecciones aleatorias del motor según las cartas elegidas.
2. **Entonación at home** (GE): lecciones cargadas por Iago.
3. **Ritmo entonado at home** (GP, repo `ritmopro`): lecciones del motor según mundos/cartas.
4. **Visor de lecciones de la campana** (tareas de la semana), GE (`LMEAVathome`) y GP (`lmpro`): lecciones del libro
   en digital (`libro/` + `libro.js`; piloto: lección 57 de 2.º GP, pruebas en gp.lmathome.es/pruebas-libro-57/?libro=57).
- Continuista entre apps y entre cursos. Visor de cada curso = misma secuencia y recursos que su app (GE ↔ Ritmo at
  home; GP ↔ Ritmo entonado at home). **Única diferencia del visor: sin tiempo** (ni reloj ni paso automático; se pasa
  con «Pasar a la siguiente fase»).
- **Mismo sonido de piano** de acompañamiento en todas. Cartelitos y botones iguales.

## 1. Carteles
- Información muy simple, con **palabras destacadas**; avisan de lo relevante. 2.ª persona del singular.
- La barra de **Velocidad** de abajo (dibujada 🐢 ●●●●● 🐇): coger un tempo cómodo; se mantiene salvo que la cambies.
- Ritmo at home: «Tienes **5 minutos** para las fases de ritmo: percusión y ritmo con notas». GE: **a pulso**.
- Visor: «Aquí no hay tiempo: tómate el que haga falta».

## 2. Columnas de anotar (las dos, en todas y en el visor)
- Las de `_DISENO` §3. **GE: SIN Patrones △/U ni «Revelar patrón»**; sí intervalos.
- Lo anotado se mantiene entre fases. En el visor se guarda además en el dispositivo (por alumno y lección).

## 3. Ritmo at home (GE) — 4 fases
1. **Fase 1 · Percusión** (espacio/pad, cabezas en X) y **Fase 2 · Ritmo con notas**: **5 min en total**, se va de una a
   otra libremente y se anota. Cartel claro.
2. Al acabar: **ejecución** («simulacro»): de arriba abajo, solfeando sin cantar; única ayuda, figuras en verde al sonar
   + metrónomo (a pulso). **Máximo 2 veces**: tras cada una, «¿Qué tal ha ido?» (deslizador de caritas: muy mal → decente
   → muy bien); tras la 1.ª, «¿Quieres hacerlo una última vez?».
3. «¿Quieres seguir con la fase de entonación? Es **opcional**»: fases 3 y 4 marcadas «opcional» (§4). Ese tiempo suma
   solo a Ritmo at home (verde).
- Caritas: **solo para el alumno**, no se guardan.
- **Visor GE**: igual pero **sin tiempo**.

## 4. Fases de entonación (Ritmo at home 3–4, Entonación at home, Ritmo entonado 3–4 y visor)
- **Tónica · Escala · Arpegio**.
- ~~Durante el estudio NO se reproduce el acompañamiento~~ → **DECISIÓN DE IAGO 20-nov 10:55 (manda):**
  - **Ritmo at home (fases 3–4), Ritmo entonado (fase 3) y visores de ritmo de la campana GE y GP**: en la fase de estudio
    de entonación **SÍ suena el acompañamiento** con ▶ (acordes, sin la melodía), junto con la ayuda del piano elegida.
    **Sin micrófono** en el estudio: el micrófono solo en la realización final (fase 4), donde no hay pistas ni notas
    premarcadas en azul (solo se ilumina la figura que toca cantar).
  - **Entonación at home**: en los **5 minutos de estudio, NI acompañamiento NI selector de ayuda del piano**; solo
    **Tónica · Escala · Arpegio** (y Pistas). «Las lecciones de entonación las tienen que sacar ellos mentalmente.»
- **Ayudas**: (a) **Ayuda del piano**: **Sin ayuda · Cada pentagrama · Cada compás** (1.ª nota de cada pentagrama /
  compás; ni «todas» ni «pulso»); (b) **Pistas**: hasta **3 notas** a elección.
- **Pistas**: se pulsa «Pistas» y queda activo (las notas **parpadean**); 3 clics seguidos para las 3 notas, sin volver
  al botón; otra pulsación en «Pistas» para salir antes. Notas de pista en azul.
- **Entonación at home**: misma interfaz que las fases 3–4; **5 min** de estudio, pero **solo con Tónica · Escala ·
  Arpegio y Pistas** (sin acompañamiento ni ayuda del piano: decisión del 20-nov 10:55).
- (20-nov 10:47–10:51) En el estudio, las notas que tocará el piano según la ayuda elegida se ven en **azul**; las notas
  azules (pistas o ayuda) **suenan al pulsarlas** siempre que quieras, sin gastar pistas. El cartel lo explica.
  Referencia: `ritmopro/_DISENO-ESTUDIO-POR-FASES.md` §7–§8 (commit 6114ed1).

## 5. Cambios del 20-nov 10:06–10:12 (conversación de ritmopro) — valen para todas salvo lo indicado
1. Barra de abajo SIEMPRE visible sin bajar; la partitura se ajusta al alto que quede.
2. Velocidad elegida se mantiene en todas las fases; cada cartel lo avisa con la barra dibujada.
3. Subdivisión: fase 1 corcheas; resto, pulso. Pentagrama SIN COMPÁS: siempre corcheas.
4. Claqueta por compás; en (2+¼)/4 suena la semicorchea de más.
5. Cuenta atrás 3-2-1 central (150 px, cristal oscuro, borde del color de la fase, número blanco 96 px; se cancela al parar).
6. Los silencios también se iluminan.
7. Fase 2 GP: «Revelar patrón» (solo con dispares). **En GE no existe.**
8. ~~Piano: Todas · Pulso · Compás · Pentagrama~~ → **sustituido por §4** (Sin ayuda · Cada pentagrama · Cada compás).
9. Fase 4: al empezar solo la tónica; luego ayuda por pentagramas; notas que tocará el piano marcadas ANTES en azul.
10. «Pasar a la siguiente fase / a la realización final»: relleno del color de la fase, letra blanca.
11. Generar examen / Editar: solo profesor (Tester/Protester o navegador de Iago), nunca dentro del estudio.

## 6. Solo Tester / Protester
- Botón con icono «**Dificultad**» (0–10; 5 = intermedio) en Ritmo at home y Ritmo entonado at home, en cualquier
  momento; si no se pulsó, sale al final de la fase 4. **Solo en pantalla** (los alumnos lo apuntan en su libro):
  **no se guarda en ningún sitio**.

## 7. Reparto
- `ritmopro`: la conversación «Ritmo entonado con micrófono» publica §5 y aplica §4 y §6.
- Visor GP/GE + lecciones del libro: coordinadora (`libro.js` monta el estudio de ritmopro sin tiempo).
- Ritmo at home y Entonación at home (GE): conversaciones propias cuando ritmopro esté publicado; reutilizan su código.
- Antes de subir: huella EN CURSO/HECHO en el `_COORDINACION-IA.md` del repo; enseñar a Iago antes de publicar.

## 8. Carteles visuales y aviso de la mano (Iago, 20-nov 12:10–12:20) — PARA TODOS
- Carteles de cada fase como los de Entonación at home / Ritmo at home: título + una frase + **filas con el control en miniatura a la izquierda** (botón, pentagrama con la nota en azul, tortuga/liebre, columnas de anotar…) y qué hace a la derecha. Solo lo que exista en esa fase. Iago dio por buena la propuesta de Ritmo at home (fases 1, 2, ejecución, 3 y 4).
- En la **fase 2** (ritmo con notas / con la mano) y en la **ejecución rítmica**, una fila **destacada** (borde ámbar, icono de mano):
  - **GE**: «Recuerda usar el **pulso con la mano** cada vez que practiques.»
  - **GP**: «Recuerda utilizar **la mano**, ya sea marcando **subdivisión** o **pulso**, según cómo trabajemos en clase cada dificultad.»
- **Entonación at home (GE): HECHO y publicado** (entonacionathome b7cf64c, 20-nov 11:42): carteles visuales en «1. Estudio» y «2. Realización final». Iago lo confirmó «para todos» también desde esa conversación (12:29).
- Visor de lecciones del libro: hecho en `libro.js` (cvContenido/cvVisualiza), pendiente del visto bueno de Iago para encenderlo (`CARTELES_VISUALES`).

## 9. Barrido final de unificación (Iago, 20-nov 12:22)
- Cuando Ritmo at home y Entonación at home estén hechos, la coordinadora hace un **barrido final**: compara los cuatro módulos (Ritmo at home, Entonación at home, Ritmo entonado at home, visor de lecciones) y le da a Iago la **lista de diferencias** para unificar (textos de carteles, p. ej. «la figura que suena se ilumina», controles, colores).
- Piel, para todos: **verde = ritmo**, **azul = entonación**, fondo = **la foto del conservatorio**; el **dorado ya no se usa**.

## 10. Tiempo validado (Iago, 20-nov 12:32) — PARA TODOS
- El rato con un **cartel abierto NO cuenta** como trabajo (aunque el alumno se quede mucho tiempo en él).
- **Sin tiempos de cortesía.** El tiempo validado es el de las **cuentas atrás** de cada fase y, en las **ejecuciones / realizaciones finales**, lo que dure esa ejecución.
- Visor de lecciones del libro (sin cuentas atrás en pantalla): cuenta el tiempo activo sin carteles, con tope 3′ percusión · 2′ ritmo · 3′ entonación + lo que duren las realizaciones (libro.js, vtCalc).
- Revisarlo en el barrido final de unificación (§9) en los cuatro módulos.
