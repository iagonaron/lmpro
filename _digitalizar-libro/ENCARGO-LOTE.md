# Encargo de lote: pasar lecciones del libro a JSON, verificarlas y revisarlas

Para CADA lección de tu lista (carpeta /home/claude/lotes/<grado>-<NNN>, con src.png, esqueleto.json y sNN-a/b.png con regla):

1. TRANSCRIBE siguiendo /home/claude/lotes/ENCARGO-TRANSCRIPCION.md ENTERO (incluidas las secciones de AMPLIACIÓN del final) y escribe <carpeta>/<NNN>.json. Fíjate bien en: armadura (alturas reales: si♭ = `bb4`), alteraciones que duran todo el compás, dirección de plicas, número de nota donde empieza y acaba cada ligadura, tresillos, cambios de clave.
   Ejemplos ya terminados y correctos para copiar el estilo: /home/claude/lotes/4ge-046/046.json, /home/claude/lotes/2gp-075/075.json, /home/claude/lotes/2gp-062/062.json, /home/claude/lotes/4ge-050/050.json.
2. VERIFICA: `python3 /home/claude/tools/verifica.py /home/claude/lotes/<grado>-<NNN>` (tarda ~1 min). Debe salir una línea JSON con "avisos": [] y "trazo_por_fase": [1,1,1]. Si hay avisos de sumas o un error, corrige el JSON y repite.
3. REVISA lado a lado siguiendo /home/claude/lotes/ENCARGO-REVISION.md con las láminas lado-sNN-a/b.png que genera el paso 2 (arriba libro, abajo copia). Corrige el JSON y vuelve a ejecutar el paso 2 si cambias algo. Si en la copia ves un becuadro que el libro no tiene, la altura está mal.
4. Pasa a la siguiente lección.

Reglas: toca SOLO las carpetas de tu lista (no edites libro.js, ni herramientas, ni otras carpetas). No uses navegadores. Si algo del libro no se puede expresar con el formato, déjalo en "pendiente" y sigue.

Al final responde SOLO con una línea por lección: «NNN: OK» o «NNN: <dudas/pendientes en pocas palabras>».
