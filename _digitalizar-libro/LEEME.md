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
