# Encargo: revisar lado a lado una lección del libro pasada a digital

Carpeta: la que se te indique. Dentro:
- `lado-sNN-a.png` / `lado-sNN-b.png`: cada pentagrama en dos mitades; ARRIBA el libro (escaneado), ABAJO la copia digital, a la misma escala y en la misma posición (separadas por una franja roja).
- `NNN.json`: la transcripción (formato explicado en /home/claude/lotes/ENCARGO-TRANSCRIPCION.md).

Abre cada lámina con Read y compara COMPÁS A COMPÁS, nota a nota: altura (línea/espacio), figura (corchete, barra, puntillo), silencios, alteraciones, plicas, ligaduras (dónde empiezan y acaban, arriba/abajo), tenutos, corchetes discontinuos, números de compás, cifra de compás, texto. El espaciado horizontal puede ser algo distinto: eso NO es un error.

Si encuentras errores de la copia, CORRIGE `NNN.json` (solo lo necesario) y comprueba que cada compás sigue sumando lo que pide su compás. No toques nada más.

Responde SOLO con: «SIN ERRORES» o la lista de cambios hechos (compás, qué había, qué has puesto), y cualquier duda que no puedas resolver.

Notas (20-nov, 12:30):
- La alteración accidental vale para TODO el compás (si el libro pone sol♯ y luego un sol sin signo en el mismo compás, es sol♯; en la copia no se verá signo en el segundo). Si la copia dibuja un becuadro que el libro no tiene, casi seguro la altura está mal en el JSON.
- Formato ampliado (articulaciones !, >, ~; uniones; tresillos; matices; compas libre; sin_barra; numero; casillas; barra_ini/barra_fin; clave por sistema): ver «AMPLIACIÓN DEL FORMATO» en ENCARGO-TRANSCRIPCION.md.
- Ligaduras: comprueba con cuidado en qué NOTA empieza y acaba cada una en el libro (cuenta las notas del compás, empezando en 1; los silencios también cuentan).
- Diferencias de pura posición (un silencio algo más arriba, un corchete de tresillo arriba o abajo, la curva de la ligadura más plana) NO son errores.
