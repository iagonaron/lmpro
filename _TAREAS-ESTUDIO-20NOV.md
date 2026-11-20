# Tareas del estudio por fases · encargo de Iago 20-nov-2026 15:25

Lo lleva la conversación «Piloto lección 57 digital», que coordina el enjambre «Estudio por fases unificado».
Se retoma sola a las 17:15, cuando se renuevan los créditos.
Marcar cada línea con HECHO, la hora y el commit.

Módulos:
- **Visor** = lecciones-libro/libro/libro.js (lmpro y LMEAVathome).
- **Común** = LMEAVathome/piel/estudio-comun.js, que cargan Ritmo at home (RaH), Entonación at home (EaH) y Ritmo entonado at home (REaH).
- Cuando algo se pueda, se hace en el común. Si toca el index.html de RaH o EaH, el push está bloqueado desde esta sesión: subirlo por Chrome (/upload/main de GitHub) o pedirle a Iago acceso con la app de GitHub.

## Prioridad 1 (lo que verán los alumnos esta semana)
1. HECHO 17:55 (29a498b) · **GP lección 58 en digital.** Iago la abrió desde la campana y salió la versión antigua. Pasarla y añadirla a DIGITAL.GP.n.
2. HECHO 17:55/18:10 (29a498b, 3cc623b) · **Terminar la tanda de GP** de los ayudantes pausados por el límite: 67, 81, 82, 85, 93, 90, 96 (falta 090, 096) y 101–141 (faltan 107, 108, 109, 140, 141). Revisarlas y publicarlas.
3. HECHO 15:35 (estudio-comun v2) · **Arpegio en EaH**: la nota aguda dura de más (epOido: `i===3 ? st*1.6` y `t+=st*1.5`). Ponerlo con el mismo pulso que la escala.

## Prioridad 1 bis · Anotaciones de clase para el grupo (Iago 15:43, eligió las opciones recomendadas)
- En el **visor de la campana**, abierto con la cuenta Tester o Protester (la que Iago usa en el aula), sale un botón **«Guardar para <grupo>»**. El grupo se deduce del día y la hora de clase (horario C1/C2 y grupos del Diario) y se enseña para confirmar, p. ej. «Guardar para 4.º A».
- Se guarda lo pintado en esa lección: trazos, intervalos, octavas y patrones. Va a una tabla nueva de Supabase (curso, grupo, lección, datos, creado), con **caducidad de 14 días** (Iago 15:52): la tabla se limpia sola y no acumula nada.
- El alumno de ese grupo que abre esa lección desde sus tareas ve: **«¿Quieres ver las anotaciones que Iago hizo en clase con tu grupo?»** con dos botones: **«Sí»** y **«No, prefiero desde cero»**. Con «Sí», se copian a sus anotaciones (que siguen guardándose en su dispositivo). La pregunta sale una sola vez por lección.
- **En la escaleta de la clase de evaluación (C2, Iago 15:46):** en el bloque «Evaluar lecciones de ritmo / ritmo entonado», el botón **«Abrir»** lleva directo a esa lección en el visor, en la pantalla del aula, con las anotaciones que Iago guardó para ESE grupo. Así el alumno que quiera mirarlas las ve desde su pupitre. Si para ese grupo y esa lección no hay nada guardado, la abre limpia.
- HECHO 16:05 (libro.js v23, commit c15fdbe/8f68aab · Supabase `suite_libro_anot_clase` + `suite_libro_anot_clase_guardar/_leer` + `suite_libro_grupo_ahora`):
  - Lo que Iago pinta con Tester/Protester se guarda SOLO, sin botón, para el grupo que tiene clase a esa hora (horario_clases, ±20 min). Sale el chip «📌 Apuntes guardados para 4.º B».
  - Al alumno le salen ya puestos, con el interruptor «Con apuntes de Iago» abajo a la izquierda (encendido por defecto, Iago 15:52; sustituye a la pregunta Sí/No).
  - Los apuntes de Iago se guardan por clase (día + franja de 90 min) para que cada grupo empiece en limpio.
  - Falta: el botón «Abrir» de la escaleta.
- **Escaleta de evaluación (Iago 15:53):** «Abrir» lleva a una vista de SOLO MIRAR, a pantalla completa y sin columnas de anotar, con las anotaciones del grupo. Arriba, un botón por lección («Lección 46», «Lección 47»…); por defecto la primera, y se pasa a la siguiente con un toque. — **HECHO 17:35** (libro.js v25 ?evaluar=; RPC suite_libro_anot_clase_ahora).
- **App de corrección (Iago 15:54):** al cambiar de lección mientras corrige, un cartelito le recuerda «cambia también la lección en la pantalla del aula». — **HECHO en Dropbox 18:30** (aviso-pantalla-20nov.js + línea en index.html de RITMO ELEMENTAL v6 y RITMO ENTONADO PROFESIONAL v7; .bak-antes-aviso-pantalla-20261120). **Falta publicar en Netlify** (ritmoelemental, ritmoentonadoprofesional): desde aquí no se llega a Netlify.
- **Botones de Ritmo y Ritmo entonado** de Tester/Protester (los cuadrados de arriba del portal): un tercer botón «Lecciones a evaluar», junto a «Intro activa» y «Ver resultados», que abre la vista de la escaleta sin pasar por ella. — **HECHO 18:10**: siempre, con selector de lecciones (Iago 17:24).
- Vale para las lecciones del libro que se abren en el visor de la campana: las de ritmo de 4.º GE y las de ritmo entonado de 2.º GP (Iago 15:44). No se aplica a los módulos at home, que generan lecciones nuevas. Textos al alumno en 2.ª persona del singular.

## Prioridad 2 (todos los módulos con Tónica/Escala/Arpegio: visor fase 3, RaH fase 3, REaH fase 3, EaH)
4. **Botón «Acordes»** junto a Tónica · Escala · Arpegio. Suenan los acordes tonales bien enlazados, con buena conducción de voces: I – IV – V(7) – I, o I – ii – V7 – I. Los carteles de la fase lo explican.
5. HECHO 18:50 (estudio-comun v5) en RaH, REaH y EaH; falta el visor · **Ventanas y carteles sin fondo negro opaco.** Que se intuya el fondo del conservatorio (cristal oscuro semitransparente con desenfoque) sin que se lea la lección. En todos los módulos, también en la primera ventana al pulsar «Iniciar estudio».
6. HECHO 15:35 en parte (aviso de la mano en azul; falta el borde del número) · **Cuenta atrás de EaH**: el aviso «Marca el pulso con la mano» y el recuadro del número, en AZUL (entonación), no en verde.
7. **EaH**: los silencios también se iluminan en azul cuando llega su momento.
8. HECHO 18:50 en RaH/REaH (centrado arriba, verde) · **«Iniciar estudio»** centrado y destacado en todos: verde en ritmo, azul en entonación.
9. HECHO 18:50 (aviso de la velocidad + subdivisión) · **Cada cartel de fase** recuerda que se puede bajar la velocidad y elegir la subdivisión si ayuda.
10. **Micrófono una sola vez por dispositivo.** Recordar el permiso (navigator.permissions / localStorage) y no volver a pedirlo en cada ventana. Que nadie se salte el paso del micrófono.

## Prioridad 3 (Ritmo at home GE, y donde aplique Ritmo entonado at home)
11. **«Combina mundos»** deja elegir un solo mundo, y entonces se marcan todas sus cartas (como ya pidió para GP).
12. **Fase de ejecución fuera.** No es una fase ni un botón con forma de ▶. Al acabarse el tiempo de la fase 2 sale una ventana: «Se ha agotado el tiempo de estudio: ahora hazlo directamente. Tienes 2 oportunidades», con una obligatoria y la segunda opcional. Igual en REaH.
13. **Cambio de fase pulsando el número** (1, 2, 3, 4). Fuera «Pasar a la siguiente fase». Se puede ir a la fase 3 cuando se quiera. En los at home NO se vuelve atrás (decisión §12), salvo que Iago diga otra cosa.
14. HECHO 18:50 · **Carteles con tiempo**: el botón no dice «Entendido» sino «Entendido e iniciar tiempo» (RaH, EaH, REaH).
15. **Subdivisión por defecto en RaH**: fase 1 en corcheas, adaptada al compás (en compuesto, negra con puntillo + corcheas, como en el visor); fase 2 solo pulso.
16. **Título «RITMO at home» cortado** arriba a la izquierda durante el estudio (sale «RIT / MO / at home» en tres líneas). Arreglarlo.
17. **Percusión (fase 1)**: al terminar de tocar NO sale ninguna ventana («a practicar»…): nada.
18. **Caritas tras la ejecución**: 1 Muy mal · 2 Mal · 3 Safé · 4 Bien · 5 Muy bien («Decente» fuera; escribir «Safé» tal cual lo dijo Iago).
19. **Música sin compás**: todos los golpes de subdivisión iguales. Con compás, solo el primero de cada compás más agudo; sin compás, solo el primero.
20. **Revelar patrón (△/U)**: el patrón va DEBAJO del pentagrama, no encima (REaH, GP).
21. **Ayuda del piano «Cada compás»**: en un pentagrama sin compás, la referencia es solo la primera nota del pentagrama. No se ilumina en azul ninguna otra, como el re# de su foto 5.

## Prioridad 4 (sin prisa)
22. **Portal GP, barras de música**:
    - La cuenta Protester solo ve la barra de clase (música ambiente, negra, p. ej. George Street Shuffle), debajo de «Bienvenido/a, nombre».
    - Los alumnos de GP que acaban las tareas ven la barra azul del temazo EN ESE MISMO SITIO y con el mismo tamaño, en vez de debajo del lema.

Al terminar cada bloque: probar con Playwright (capturas revisadas) y en vivo con el navegador. Apuntar HECHO aquí y en _COORDINACION-IA.md, y contárselo a Iago con ✅/⚠ y el resumen ⸻.

- **Pads verdes de la tablet (Iago 17:24):** a los lados de la pantalla, en el sitio de las columnas de anotar (que se esconden mientras tocas) — **HECHO 18:10** (libro.js v26, estudio-comun v4).
- **Blancas y redondas en modo X (Iago 17:38 y 17:40):** la X dentro de su cabeza sin rellenar (blanca con plica, redonda sin ella), también en las lecciones digitalizadas (la 47) — **HECHO 18:55** (libro.js v27; motor del visor; ritmopro 305aff0). ⚠ Ritmo at home (GE): cambiado en el clon local, sin subir (push bloqueado).
- **Percusión con las columnas de anotar a la vista (Iago 17:41):** los pads van por dentro de las columnas — **HECHO 19:05** (libro.js v28, estudio-comun v6, ritmopro c7a90fb).
