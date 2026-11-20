# Encargo: transcribir UNA lección del libro a JSON (formato «libro digital»)

Carpeta de trabajo: la que se te indique (p. ej. /home/claude/lotes/4ge-046). Dentro tienes:
- `src.png`: la captura completa de la lección (página entera).
- `esqueleto.json`: medidas detectadas: ancho/alto de la página y, por pentagrama, `y` (línea SUPERIOR del pentagrama, en px del original) e `interlinea` (px entre líneas). Las `barras` de ese fichero NO son fiables (confunden plicas): ignóralas.
- `sNN-a.png`, `sNN-b.png`: cada pentagrama NN en dos mitades ampliadas ×2 con una REGLA arriba (números = x en px del ORIGINAL). Úsalas para leer las notas y para medir la x de cada barra de compás.

Ejemplos de formato terminados (léelos primero): `/home/claude/l57/libro/2gp/057.json` (2.º GP) y `/home/claude/l57/libro/4ge/047.json` (4.º GE).

## Qué tienes que escribir
Un único fichero `NNN.json` (número con 3 cifras, p. ej. `046.json`) en la carpeta de trabajo, con el mismo formato que los ejemplos:
- `v`:1, `libro`, `curso` ("4Ge" o "2Gp"), `grado` ("ge" o "gp"), `n`, `titulo` (el número), `captura` (URL: https://woiptkyrxkbpnvioypit.supabase.co/storage/v1/object/public/diario/libros_lecciones/<4Ge/ritmo | 2Gp/ritmo_entonado>/full/NNN.png), `tonalidad` (p. ej. "Sol mayor", "La menor"), `armadura` (en notación VexFlow: "C","G","D","A","E","B","F#","F","Bb","Eb","Ab","Db" mayores; si es menor, la de su relativo mayor, p. ej. La menor → "C"), `clave` ("treble" o "bass"; si una lección cambia de clave, indícalo en `pendiente`).
- `modo`: "mayor" o "menor".
- `titulo_estilo`: en 4.º GE el número va en negrita SIN serifa → `{ "fuente":"sans", "x":<x izquierda del número>, "y":<línea base del número>, "px":<alto de fuente≈ alto de las cifras/0.72> }`. En 2.º GP (serif) puedes omitirlo si está en la posición del ejemplo; si no, pon `x`,`y`,`px` sin `fuente`.
- `numeros_x`: x (px) donde empiezan los números de compás de inicio de pentagrama (5, 9…).
- `pagina`: `{ "ancho", "alto", "interlinea" }` (de esqueleto.json; interlinea = media).
- `sistemas`: uno por pentagrama: `y` (de esqueleto.json), `x0` (x donde empieza el pentagrama), `barras` (x de CADA barra de compás de ese pentagrama, incluida la final del pentagrama, medidas con la regla), `compases` (números de compás de ese pentagrama). Opcional: `"final":"fin"` en el último (doble barra final), `"final":"doble"` si hay doble barra fina, y `"cortesia":{"x1":<fin del pentagrama>,"compas":"..."}` si hay compás de cortesía tras la barra.
- `compases`: uno por compás: `{"c":N, "m":"..."}`; el primero lleva `"compas":"12/8"` (o "2/4+1/4" para fraccionarios) y cada cambio de compás también. Si el primer compás es una ANACRUSA (incompleto), añade `"anacrusa": true`; si el último completa la anacrusa, `"incompleto": true`.
  - `m`: grupos de barrado separados por « | »; cada grupo empieza por `^` (plicas arriba) o `v` (plicas abajo), tal como están en el libro; una nota sola con corchete o una negra suelta es un grupo propio. Nota = `figura:altura`, figura 1 2 4 8 16 32 con «.» para puntillo (`4.`, `8.`, `2.`), altura `g4`, `f#4`, `bb3`, `c5`… (Do4 = do central). Silencio = `figura:r` (`8:r`, `4.:r`). Tenuto = «-» tras la altura (`4:d5-`).
  - ALTERACIONES: escribe la altura REAL que suena: la armadura se aplica sola, y una alteración accidental vale para TODO el compás (si hay re♯ y luego otro re sin signo en el mismo compás, ese re también es `d#`).
  - Ligaduras de unión (misma altura) y tresillos: si aparecen, anótalo en `pendiente` (todavía no hay notación para ellas).
- `ligaduras`: lista «compás.nota-compás.nota arriba|abajo» (nota contada desde 1 dentro de su compás, silencios incluidos).
- `corchetes`: (si hay corchetes discontinuos bajo notas) «c.n-c.n».
- `notas_libro`: si hay texto en la página (explicaciones, flechas), cópialo como en 057.json (con x0/x1 de cada línea y la flecha). Si no hay, omítelo.
- `pendiente`: lista de cosas que no has podido expresar en el formato (o vacía).

## Comprobación obligatoria antes de terminar
Cada compás debe sumar lo que pide su compás (en semicorcheas: 12/8 = 24; 9/8 = 18; 6/8 = 12; 2/4 = 8; 3/4 = 12; 4/4 = 16; (2+1/4)/4 = 9; (1+3/4)/4 = 7), salvo anacrusa/incompleto. Compruébalo con python (cuenta 16/figura, ×1.5 con puntillo). Valida que el JSON carga (`python3 -c "import json;json.load(open('NNN.json'))"`).

No escribas nada fuera de tu carpeta. Al terminar responde SOLO: la ruta del fichero, los compases que sumaban mal y cómo lo resolviste, y el contenido de `pendiente`.

## AMPLIACIÓN DEL FORMATO (20-nov, 12:00) — úsala en vez de dejarlo en `pendiente`
- Articulaciones: sufijos tras la altura: `-` tenuto, `!` picado (staccato), `>` acento, `~` calderón (también en silencios: `4:r~`). Se pueden combinar: `8:g4>!`.
- `"uniones"`: ligaduras de UNIÓN (misma altura): `["2.5-3.1", "4.21-4.22"]` (pueden cruzar la barra).
- `"tresillos"`: grupos de valoración especial: `["3.1-3.3"]` (3:2 por defecto) o `{"notas":"12.4-12.8","r":"5:4"}`; `{"notas":"1.21-1.25","r":"5:6"}`. Las notas dentro se escriben con su figura escrita (corcheas del tresillo = `8`). Con tresillos, el compás debe sumar lo que pide aplicando la proporción.
- `"matices"`: `["1.39 fz", "4.27 sffz"]` (debajo de esa nota).
- Música sin compás: `"compas":"libre"` en el primer compás (no se dibuja cifra; cada compás dura lo que suman sus figuras). Un compás NUNCA cruza de pentagrama: si en el libro un período sigue en el pentagrama siguiente sin barra, pártelo en dos compases y pon `"sin_barra": true` en el que acaba el pentagrama (no se dibuja barra). Igual cuando un pentagrama termina sin barra en cualquier otra lección.
- Numeración: si el número impreso al inicio de un pentagrama no coincide con el número de su primer compás (p. ej. anacrusa o errata del libro), pon en ese sistema `"numero": <lo impreso>`; si el pentagrama no lleva número impreso, `"numero": null`; si la lección no imprime ningún número, `"sin_numeros": true`.
- Ligaduras de expresión que cruzan de pentagrama: escríbelas normal («2.12-3.4 arriba»); se dibujan en dos trozos.
- `notas_libro`: cada parte puede ser texto, `{"it":"texto en cursiva"}`, `{"frac":"1/4"}`, `{"figura":"3x16"}`; cada línea con `x0`, `x1` (extremos del texto en px) e `y` (línea base).
- Cambio de clave entre pentagramas: `"clave":"bass"` dentro del sistema que la cambie (la de cortesía al final del anterior se dibuja sola).
- Repeticiones: en el compás, `"barra_ini":"repeticion"` (ritornelo de inicio) y/o `"barra_fin":"repeticion"` (fin de repetición) o `"barra_fin":"doble"`.
- Casillas de 1.ª/2.ª vez: `"casillas":[{"compases":[6],"texto":"1."},{"compases":[7],"texto":"2.","cerrada":false}]`.
- Cambio de clave DENTRO de un pentagrama: en el compás donde aparece la clave nueva, `"clave_desde":{"n":<nº de la primera nota (o silencio) tras la clave>,"clave":"treble"}`. Los compases siguientes de ESE pentagrama ya se leen en la clave nueva (no hace falta repetirlo); en los pentagramas siguientes pon `"clave":"treble"` en el sistema como siempre.
- Las alturas SIEMPRE son reales: si la armadura tiene si♭, un si sin signo es `bb4` (no `b4`); la alteración accidental vale hasta el final del compás.
- Plicas: el prefijo ^/v de cada grupo es la dirección de la plica EN EL LIBRO (mira bien hacia dónde va la plica o la barra).
- Compases aditivos: `"compas":"3+3+2/8"` o `"2+3/8"` (se dibujan así y duran la suma).
- Figuras rítmicas sueltas en el texto del libro (p. ej. «(♩ ♩ ♩.)»): dentro de un elemento de `notas_libro`, `"ritmos":[{"figs":"4 4 4.","xs":[x de cada cabeza],"y":<y de las cabezas>,"yb":<y de la punta de las plicas>}]` (figuras: 4, 8, 16, con «.» para puntillo y «r» para silencio: `8r`, `16r`); y si hay líneas horizontales sueltas, `"rayas":[[x0,x1,y]]`.
- Más articulaciones (sufijos): `'` staccatissimo (cuña), `^` marcato. Corchetes discontinuos por encima: `"9.1-9.3 arriba"`.
- Marcato encima: sufijo `^`; marcato debajo (la «V» bajo la nota): sufijo `V`.
