#!/bin/bash
# Monta en /home/claude el banco de pruebas de las lecciones del libro (mismas rutas que usan los ENCARGO-*.md y verifica.py).
# Uso: bash montar.sh "4ge:99 104 ..." "2gp:117 118 ..."
set -e
R=/home/claude/lmpro; [ -d $R ] || git clone -q https://github.com/iagonaron/lmpro.git $R
mkdir -p /home/claude/tools /home/claude/lotes /home/claude/l57/site /home/claude/l57/libro/2gp /home/claude/l57/libro/4ge
cp $R/_digitalizar-libro/herramientas/*.py /home/claude/tools/
cp $R/_digitalizar-libro/ENCARGO-*.md /home/claude/lotes/
cp -r $R/_digitalizar-libro/ejemplos/* /home/claude/lotes/
cd /home/claude/tools; [ -d node_modules/vexflow ] || npm i -s vexflow@4.2.2 soundfont-player@0.12.0 >/dev/null 2>&1
pip list 2>/dev/null | grep -qi playwright || pip install -q --break-system-packages playwright opencv-python-headless scipy
[ -x /usr/bin/google-chrome ] || echo "OJO: falta /usr/bin/google-chrome (verifica.py lo usa): instala chrome o cambia executable_path"
cp $R/lecciones-libro/libro/libro.js /home/claude/l57/libro/libro.js
cp -r $R/lecciones-libro/libro/fuentes /home/claude/l57/libro/ 2>/dev/null || cp -r $R/pruebas-libro-ge/libro/fuentes /home/claude/l57/libro/ 2>/dev/null || true
cp $R/pruebas-libro-57/index.html /home/claude/l57/site/index.html
cp $R/pruebas-libro-ge/index.html /home/claude/l57/site/index-ge.html
ln -sfn /home/claude/l57/libro /home/claude/l57/site/libro
B=https://woiptkyrxkbpnvioypit.supabase.co/storage/v1/object/public/diario/libros_lecciones
for grupo in "$@"; do g=${grupo%%:*}; ns=${grupo#*:}
  for n in $ns; do NNN=$(printf %03d $n); d=/home/claude/lotes/$g-$NNN; mkdir -p $d
    if [ $g = 4ge ]; then url=$B/4Ge/ritmo/full/$NNN.png; else url=$B/2Gp/ritmo_entonado/full/$NNN.png; fi
    curl -sS -o $d/src.png "$url"
    for th in 0.45 0.4 0.3 0.25; do python3 /home/claude/tools/esqueleto.py $d/src.png $d $th >/dev/null 2>&1; c=$(python3 -c "import json;print(len(json.load(open('$d/esqueleto.json'))['sistemas']))"); [ "$c" -ge 2 ] && break; done
    python3 /home/claude/tools/regla.py $d; rm -f $d/m[0-9][0-9].png
  done; done
cd /home/claude/l57/site && (curl -s -o /dev/null localhost:8822 || (setsid nohup python3 -m http.server 8822 >/tmp/srv.log 2>&1 &)); sleep 1
echo "Banco listo en http://localhost:8822 (index.html = GP, index-ge.html = GE)"
