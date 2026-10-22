// Hamilton exprés · contenidos (22-oct-2026 · C1 · visor único: frase corta + su vídeo, paso a paso)
// 14:05 · recorte de Iago: 7 partes, sin «Quédate con…», cartel de spoilers al principio, menos vídeos.
// Clips: momentos musicales cortados del análisis de Jaime Altozano (solo pantallas de letra, sin Jaime).
// En «¿quién canta?» se usan versiones sin el personaje ni el rótulo (expres/escucha/), que dejan leer la letra.
// Las frases en inglés llevan su traducción entre paréntesis.
var P = "expres/personajes/", C = "expres/clips/", O = "expres/escucha/";
var FIG = window.HAM_FIG = { Hamilton: P + "hamilton.png", Burr: P + "burr.png", Washington: P + "washington.png", Angelica: P + "angelica.png", Eliza: P + "eliza.png" };
window.HAM_EXPRES = [
{
  titulo:"Antes de que se abra el telón",
  pasos:[
    {t:"texto", cartel:true, h:"¡Atención, atención!", sub:"Vas a ver spoilers masivos.",
      txt:["Pero es que la primera canción del musical ya te hace todos los spoilers de lo que va a suceder. Así ha sido diseñada esta historia.",
           "Y, a fin de cuentas, en música no hay spoilers: si no, no tendría sentido escuchar una canción más de una vez, ¿verdad?",
           "<b>Venga: conoce la historia antes de verla.</b>"]},
    {t:"texto", h:"¿Quién era Alexander Hamilton?", flujo:true, cartas:[
      {k:"1755", t:"Nace en una isla del Caribe, de padre escocés"},
      {k:"Huérfano", t:"Sin padre ni madre, de niño"},
      {k:"1772", t:"Sus vecinos le pagan el viaje a Nueva York"},
      {k:"1776", t:"Revolución: ¡su gran oportunidad!"}]},
    {t:"clip", src:C+"E1_origen_1.mp4", txt:"La primera canción ya cuenta su infancia: huérfano en una isla del Caribe."},
    {t:"clip", src:C+"E1_origen_2.mp4", txt:"Sus vecinos hacen una <b>colecta</b> para mandarlo a Nueva York."},
    {t:"clip", src:C+"E1_origen_3.mp4", txt:"El consejo antes de partir: que estudie y no olvide de dónde viene."},
    {t:"texto", h:"Los personajes", fichas:[
      {img:FIG.Hamilton, n:"Hamilton", t:"Impulsivo y con prisa"},
      {img:FIG.Burr, n:"Burr", t:"Su rival. Prudente"},
      {img:FIG.Washington, n:"Washington", t:"El general, su jefe"},
      {img:FIG.Angelica, n:"Angelica", t:"La mayor de las Schuyler"},
      {img:FIG.Eliza, n:"Eliza", t:"Se casa con Hamilton"}],
      nota:"También salen Jefferson, Lafayette y un rey Jorge III muy cómico: los conocerás en clase."}
  ]
},
{
  titulo:"Hamilton y sus leitmotivs",
  pasos:[
    {t:"texto", h:"El truco del musical", cartas:[
      {k:"Leitmotiv", t:"Melodía o frase que vuelve, ligada a un personaje o una idea"},
      {k:"Wagner", t:"Lo popularizó en la ópera"},
      {k:"En Hamilton", t:"Son frases (es rap): casi siempre la misma melodía, pero no siempre"}]},
    {t:"clip", src:C+"E2_alexander-hamilton.mp4", fig:"Hamilton", txt:"El personaje de Hamilton tiene tres leitmotivs. El primero, su nombre: <b>«Alexander Hamilton»</b>. Suena cuando se presenta o hablan de él."},
    {t:"clip", src:C+"E2_just-you-wait.mp4", fig:"Hamilton", txt:"El segundo: <b>«Just you wait»</b> (espera y verás). Cuando alguien duda de él y quiere demostrar su valía. Aquí, ante Angelica."},
    {t:"clip", src:C+"E2_my-shot.mp4", fig:"Hamilton", txt:"El tercero: <b>«My shot»</b> (mi oportunidad): no desperdiciar ninguna. Ojo, tiene tres sentidos: la oportunidad, los chupitos (<i>shots</i>) del bar… y uno que verás en el duelo. Aquí, en el bar."},
    {t:"clip", src:C+"E2_tres-motivos-juntos.mp4", fig:"Hamilton", txt:"Final del primer acto: <b>los tres a la vez</b>."},
    {t:"act", a:{tipo:"empareja", consigna:"Une cada leitmotiv de Hamilton con lo que significa.", img:FIG.Hamilton,
      items:[["«Alexander Hamilton»","Se presenta o hablan de él"],["«Just you wait» (espera y verás)","Dudan de él y quiere demostrar su valía"],["«My shot» (mi oportunidad)","No desperdiciar ninguna oportunidad"]]}}
  ]
},
{
  titulo:"Burr, el opuesto",
  pasos:[
    {t:"texto", h:"Burr: el que espera", cartas:[
      {img:FIG.Burr, k:"«Talk less, smile more»", t:"(habla menos, sonríe más) Su consejo a Hamilton"},
      {img:FIG.Burr, k:"«Wait for it»", t:"(espera el momento) Su leitmotiv: no precipitarse"},
      {k:"Pizzicato", t:"Cuerdas pellizcadas cuando habla bajito"},
      {img:FIG.Burr, k:"«The room where it happens»", t:"(la sala donde ocurre todo) Su ambición"}]},
    {t:"act", a:{tipo:"oido", consigna:"¿Quién canta: Hamilton o Burr? Lee la letra mientras escuchas y pulsa en cuanto lo sepas.",
      opciones:[{n:"Hamilton", img:FIG.Hamilton},{n:"Burr", img:FIG.Burr}],
      items:[
        {src:O+"E3_talk-less-smile-more_3.mp4", ok:"Burr", pie:"Era su consejo: «Talk less, smile more» (habla menos, sonríe más)."},
        {src:O+"E1_origen_4.mp4", ok:"Hamilton", pie:"«Just you wait» (espera y verás): todo lo que va a conseguir."},
        {src:O+"E3_room-where-it-happens_1.mp4", ok:"Burr", pie:"«The room where it happens» (la sala donde ocurre todo): la primera vez lo canta bajito, con pizzicato de fondo."}]}}
  ]
},
{
  titulo:"Washington y la revolución",
  pasos:[
    {t:"texto", fig:"Washington", txt:"La guerra va mal y llega el general <b>George Washington</b>. Elige a Hamilton como su <b>mano derecha</b>."},
    {t:"clip", src:C+"E4_my-shot-en-su-cabeza.mp4", fig:"Hamilton", txt:"Hamilton acepta: oye en su cabeza su leitmotiv, «my shot» (mi oportunidad)."},
    {t:"clip", src:C+"E4_history-con-coro_2.mp4", fig:"Washington", txt:"Antes de la batalla final, Washington canta <b>«History has its eyes on you»</b> (la Historia tiene sus ojos puestos en ti): tus decisiones tienen consecuencias. Detrás, el <b>coro</b>: la voz del pueblo."}
  ]
},
{
  titulo:"Las hermanas Schuyler",
  pasos:[
    {t:"texto", h:"Tres hermanas", cartas:[
      {k:"Las Schuyler", t:"Tres hermanas de una familia rica y poderosa de Nueva York"},
      {img:FIG.Angelica, k:"Angelica", t:"La mayor. Brillante y ambiciosa"},
      {img:FIG.Eliza, k:"Eliza", t:"La mediana. Dulce"},
      {k:"Peggy", t:"La pequeña"}]},
    {t:"texto", h:"Dos hermanas, dos palabras", cartas:[
      {img:FIG.Angelica, k:"«Satisfied»", t:"(satisfecha) Angelica desea a Hamilton, pero no se casa: él es pobre y ella debe cuidar de su familia"},
      {img:FIG.Eliza, k:"«Helpless»", t:"(indefensa) Eliza, rendida ante el amor: se casa con él"}]},
    {t:"act", a:{tipo:"oido", consigna:"¿Quién canta: Angelica o Eliza? Lee la letra mientras escuchas y pulsa en cuanto lo sepas.",
      opciones:[{n:"Angelica", img:FIG.Angelica},{n:"Eliza", img:FIG.Eliza}],
      items:[
        {src:O+"E5_satisfied-v2.mp4", ok:"Angelica", pie:"«Satisfied» (satisfecha): renuncia a él y se lo presenta a Eliza."},
        {src:O+"E5_helpless.mp4", ok:"Eliza", pie:"«Helpless» (indefensa): rendida ante el amor."},
        {src:O+"E5_look-around-eliza.mp4", ok:"Eliza", pie:"«Look around» (mira a tu alrededor): le pide que se quede con ella."}]}}
  ]
},
{
  titulo:"El escándalo Reynolds",
  pasos:[
    {t:"texto", h:"Escribir para salir del lío", flujo:true, cartas:[
      {k:"Aventura", t:"Con Maria Reynolds"},
      {k:"Chantaje", t:"Le piden dinero, y paga"},
      {k:"Acusación", t:"Lo acusan de corrupción"},
      {k:"Panfleto", t:"Para probar que era un chantaje… lo confiesa todo"}]},
    {t:"clip", src:C+"E6_wait-for-it-panfleto.mp4", fig:"Hamilton", txt:"Le habría bastado con esperar. Y justo antes de publicarlo canta <b>«Wait for it»</b> (espera el momento)… ¡el leitmotiv de Burr!"},
    {t:"act", a:{tipo:"preguntas", consigna:"Comprueba que lo has entendido.",
      items:[
        {q:"¿Para qué publica Hamilton el panfleto?", o:["Para probar que pagó un chantaje","Para acusar a Burr de corrupción","Para ganar las elecciones de 1800"], ok:0},
        {q:"¿Qué leitmotiv de Burr canta Hamilton justo antes?", o:["«Talk less, smile more» (habla menos)","«Wait for it» (espera el momento)","«The room where it happens» (la sala)"], ok:1}]}}
  ]
},
{
  titulo:"El duelo",
  pasos:[
    {t:"texto", fig:"Hamilton", txt:"1804: duelo con Burr. Hamilton, que ha perdido a su hijo en otro duelo, <b>dispara al cielo</b>: esta vez sí desperdicia su disparo, su «shot» (oportunidad). Burr no espera."},
    {t:"clip", src:C+"E7_burr-arrepentido_2.mp4", fig:"Burr", txt:"Burr se arrepiente: había sitio para los dos."},
    {t:"act", a:{tipo:"empareja", consigna:"Une cada momento con lo que hace cada uno.",
      items:[["Hamilton, al principio","No desperdicia ninguna oportunidad",FIG.Hamilton],["Hamilton, en el duelo","Dispara al cielo: desperdicia su disparo",FIG.Hamilton],["Burr, al principio","Espera su momento",FIG.Burr],["Burr, en el duelo","No espera: dispara",FIG.Burr]]}}
  ]
}
];
