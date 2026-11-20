# Digitalizar lecciones del libro (Ritmo 4 · 4.º GE y Ritmo 6 · 2.º GP)

Carpeta para que **otra conversación** pase lecciones del libro a JSON para el visor de la campana, sin pisar a la conversación del **«Piloto lección 57 digital»**. Esa conversación lleva `libro.js` y las fases de estudio.

## Reglas
- **No toques `libro.js`** ni nada del visor. Si una lección necesita algo que el formato no tiene, déjalo en `"pendiente"` dentro del JSON. Apúntalo también en la sección «Pendientes para libro.js» de este fichero.
- **Ayudantes.** Trabaja con ayudantes de modelo barato (sonnet), unas 7 u 8 lecciones por ayudante y como mucho 3 a la vez. La máquina tiene 2 núcleos y cada `verifica.py` abre un Chrome.
- **Antes de subir.** Lee la última línea de `_COORDINACION-IA.md` de lmpro y deja EN CURSO / HECHO, como pide el resto del ecosistema. Haz siempre `git pull --rebase` antes de cada commit: la otra conversación también sube a los mismos repos.

## Pasos
1. `bash /home/claude/lmpro/_digitalizar-libro/montar.sh "4ge:<números>" "2gp:<números>"`. Monta las herramientas, el banco en el puerto 8822 y las carpetas `/home/claude/lotes/<grado>-NNN` con `src.png`, esqueleto y reglas.
2. Mira cada `src.png`. Si un recorte está cortado (de GP), el libro completo está en el Dropbox de Iago: `CMUS/MATERIALES/2GP MATERIALES/RITMO/Ritmo 6 - Tordesillas.pdf`. Si tu sesión tiene acceso a esa carpeta del ordenador de Iago, se re-recorta con `herramientas/recorta.py` y `desplaza.py`.
3. Cada ayudante sigue `/home/claude/lotes/ENCARGO-LOTE.md` (transcribe → `verifica.py` → revisa lado a lado).
4. Revisa tú los avisos y alguna lámina `lado-sNN-a/b.png` por lección. Que `verifica.py` dé `"avisos": []` y `"trazo_por_fase": [1,1,1]` (se dibuja y lo dibujado se mantiene entre fases).
5. Publica:
   - **GP:** `NNN.json` → `lmpro/lecciones-libro/libro/2gp/NNN.json`.
   - **GE:** → `LMEAVathome/lecciones-libro/libro/4ge/NNN.json`. Repo: https://github.com/iagonaron/LMEAVathome.git.
   - **Campana:** en `LMEAVathome/piel/libro-digital.js`, añade el número a `DIGITAL.GE.n` o `DIGITAL.GP.n`, en orden. Es UNA línea que la otra conversación también toca: pull justo antes, cambio mínimo y push inmediato.
   - Un commit por tanda, con el pie de atribución de la sesión.

## Encargo actual (20-nov-2026)
Lecciones elegidas en el plan de cartas del Diario que aún no están en digital. La primera tanda (GE 54–124 y GP 67–141) la hace la conversación del piloto.
- **4.º GE (16):** 96, 99, 104, 106, 107, 108, 109, 111, 112, 113, 133, 143, 148, 159, 161, 162
  - 99: solo la lección, sin el ejercicio A/B/C de debajo.
  - 133: lleva un segundo pentagrama de pulso. Transcribe la melodía y deja la línea de pulso en «pendiente».
- **2.º GP (19):** 46, 47, 117, 118, 120, 122, 123, 127, 128, 130, 133, 135, 149, 152, 153, 206, 211, 213, 217
  - 206–217: claves de Do.

## Pendientes para libro.js
(apúntalos aquí: lección · qué falta)
- GP 046 · tresillos (c4-5, c8-9) y quintillo 5:6 (c11-12) que cruzan la barra: partidos en dos compases incompletos (no hay grupo que cruce barra).
- GP 047 · grupo 4:3 (c6-7) cruza la barra: partido igual; el c9 suma 22 semicorcheas en el libro (pide 24), queda incompleto. «♪ = ♪» del cambio a 12/8 no se dibuja.
- GP 127 · doble puntillo (c4, c8, c9): no hay en el formato; escrito como puntillo + figura unida (misma duración).
- GE 108 · la doble barra separada tras el c1 se dibuja como doble barra normal.
- GE 112 · ligadura de unión si3–si3 entre pentagramas (c3–c4): libro.js la dibuja recta al cruzar de pentagrama; omitida (queda la de expresión, y en audio se re-ataca).
- GE 133 · segundo pentagrama de pulso sin transcribir (falta en el formato).
- GE 148 · ligadura corta bajo re4 del c8 (1.ª vez) hacia la repetición: omitida.
- GP 153 · c11 termina en breve (falta en el formato): escrita como redonda y compás incompleto.
- Claves de Do: 206 «alto», 211 «tenor», 213 «soprano» (VexFlow las dibuja bien). OJO: la clave de cortesía de fin de pentagrama de libro.js solo conoce treble/bass, por si algún día una lección cambia a clave de Do a mitad.
- GP 130 · dobles puntillos escritos como puntillo + figura unida (misma duración).
- HECHO 20-nov 19:20 (libro.js v32: KEY_ACCIDENTALS con B, F#, C#, Db, Gb, Cb y sus menores; 067 repasada: gb3/ab3 donde el libro no pone becuadro; 118, 120, 123, 135 publicadas) · ARMADURAS DE 5 O MÁS ALTERACIONES: KEY_ACCIDENTALS del motor (index.html de ritmopro/banco) solo llega a 4♯/4♭ (E, Ab). Con F# (6♯), C# (7♯), Db (5♭), Cb (7♭)… la copia pinta la alteración delante de cada nota afectada. Afecta a GP 118, 120 (F#), 123 (C#), 135 (Cb) → EN ESPERA (sin publicar), y también a la GP 067 (Db) ya publicada por el piloto. Falta añadir en libro.js las armaduras B, F#, C#, Db, Gb, Cb (y sus menores).
- HECHO 20-nov 19:20 (libro.js v32 admite '64'; el c2 ya va en semifusas, sin valoraciones ocultas; c4 cotejado con el libro y bien; publicada) · GP 149 · semifusas (64) en el c2: durDe/dur16 de libro.js no admiten '64'. El JSON en espera las finge como fusas con valoración 4:2/8:4 oculta (3 barras en vez de 4) y el c4 hay que repasarlo con el libro → EN ESPERA.
- PUBLICADA 20-nov 19:20 a petición de Iago, con la duda: ⚠ GP 133 · el recorte (src.png) está cortado por abajo en c7–c8: no se ven las cifras de los grupos; el JSON en espera los deduce por la suma (c7 6:4, c8 3:2). Hay que re-recortarla del PDF (Ritmo 6 - Tordesillas.pdf) y confirmarlo → EN ESPERA.
- Los JSON en espera están en _digitalizar-libro/en-espera/2gp-NNN.json (verifican sin avisos; solo falta lo dicho). Cuando esté resuelto: copiarlos a lecciones-libro/libro/2gp/NNN.json y añadir el número a DIGITAL.GP.
