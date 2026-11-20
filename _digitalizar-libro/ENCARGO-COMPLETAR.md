# Encargo: completar lecciones con lo que faltaba (la captura vieja estaba cortada)

Cada carpeta tiene ahora `src.png` = la lección COMPLETA sacada del libro original (más margen arriba/abajo), y `src_captura.png` = la captura vieja (cortada). El JSON (`NNN.json`) ya está desplazado para coincidir con la nueva `src.png` (las x no cambian; las y se sumaron), y hay láminas nuevas `sNN-a/b.png` con regla.

Para cada lección de tu lista:
1. Compara `src.png` con lo que dibuja la copia: ejecuta `python3 /home/claude/tools/verifica.py <carpeta>` y mira `superpuesta.png` y las láminas `lado-sNN-a/b.png`.
2. AÑADE al JSON lo que el libro tiene y faltaba por el recorte: textos (con su flecha) en `notas_libro` (x0, x1, y medidos en la NUEVA src.png con la regla), equivalencias (♪ = ♪ con `ritmos` + texto «=»), matices (`matices`), marcas bajo/sobre notas, corchetes de tresillo, etc. Formato: /home/claude/lotes/ENCARGO-TRANSCRIPCION.md (lee las secciones de AMPLIACIÓN del final).
3. Corrige lo que ahora veas mal. Vacía de `pendiente` lo resuelto.
4. Vuelve a ejecutar verifica.py: "avisos": [] y "trazo_por_fase": [1,1,1].
Reglas: toca SOLO tus carpetas; no uses navegadores. Responde una línea por lección: «NNN: añadido …» o «NNN: nada que añadir».
