import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  DoorOpen, Users, Crown, Moon
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#050810;--bg2:#0a0f1c;--bg3:#101728;--surf:#131b2b;--surf2:#1b2539;--brd:#1f2b42;--brd2:#2e3f5c;--tx:#e6ecf5;--tx2:#94a3ba;--tx3:#5f6f88;--acc:#3d5a80;--acc2:#6a8db8;--acc3:#b9cde6;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#c9a24a;--warn-d:rgba(201,162,74,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#0d1526 0%,#0a0f1c 55%,#050810 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(61,90,128,.30) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(61,90,128,.40);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(61,90,128,.10)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(61,90,128,.48) 30%,rgba(61,90,128,.48) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(61,90,128,.18);border-radius:10px;z-index:-1}
.content{padding:1.25rem 1rem 2rem;animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.sec-title{font-family:'Playfair Display',serif;font-size:1.65rem;font-weight:700;color:var(--tx);margin-bottom:.25rem;line-height:1.2}
.sec-sub{font-size:.95rem;color:var(--tx2);margin-bottom:1.25rem;line-height:1.55}
.card{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1.1rem 1rem;margin-bottom:.85rem}
.card p{font-size:1rem;line-height:1.65;color:var(--tx2)}
.card-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.5rem}
.verse-item{border-left:3px solid var(--acc);border-radius:0 12px 12px 0;background:var(--surf);margin-bottom:.7rem;overflow:hidden;cursor:pointer;transition:background .2s}
.verse-item:hover{background:var(--surf2)}
.verse-item.base-v{border-left:4px solid var(--warn)}
.verse-header{display:flex;align-items:center;justify-content:space-between;padding:.8rem 1rem}
.verse-ref{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:var(--tx)}
.verse-tags{display:flex;gap:.4rem;align-items:center}
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(61,90,128,.25);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(201,162,74,.18);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(61,90,128,.09)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(61,90,128,.25);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(61,90,128,.16),rgba(61,90,128,.02));border:1px solid rgba(61,90,128,.30);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(61,90,128,.12);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(61,90,128,.20),rgba(61,90,128,.03));border:1px solid rgba(61,90,128,.36);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.honey-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.honey-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.honey-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}
.guide-banner{background:linear-gradient(135deg,rgba(201,162,74,.12),rgba(201,162,74,.02));border:1px solid rgba(201,162,74,.24);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(201,162,74,.16);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
.guide-banner p{font-size:.9rem;color:var(--tx2);line-height:1.45}
.guide-step{display:flex;gap:.9rem;margin-bottom:.8rem;padding:.9rem 1rem;background:var(--surf);border-radius:12px;border:1px solid var(--brd)}
.guide-time{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--warn);white-space:nowrap;padding-top:.1rem;min-width:58px}
.guide-step-body{flex:1}
.guide-step-title{font-size:.97rem;font-weight:600;color:var(--tx);margin-bottom:.3rem}
.guide-step-desc{font-size:.92rem;line-height:1.55;color:var(--tx2)}
.quiz-progress{display:flex;gap:4px;margin-bottom:1.2rem}
.quiz-dot{height:4px;flex:1;border-radius:2px;background:var(--brd2);transition:background .3s}
.quiz-dot.active{background:var(--acc2)}
.quiz-dot.correct{background:var(--ok)}
.quiz-dot.wrong{background:var(--err)}
.quiz-q{font-family:'Playfair Display',serif;font-size:1.22rem;font-weight:600;line-height:1.4;color:var(--tx);margin-bottom:1.1rem}
.quiz-option{width:100%;background:var(--surf);border:1.5px solid var(--brd);border-radius:12px;padding:.85rem 1rem;font-size:1rem;color:var(--tx2);cursor:pointer;text-align:left;margin-bottom:.5rem;transition:all .2s;font-family:'DM Sans',sans-serif;line-height:1.4}
.quiz-option:hover:not(:disabled){border-color:var(--acc);color:var(--tx);background:var(--surf2)}
.quiz-option.correct{border-color:var(--ok);background:var(--ok-d);color:var(--ok)}
.quiz-option.wrong{border-color:var(--err);background:var(--err-d);color:var(--err)}
.quiz-feedback{background:var(--surf2);border-radius:12px;padding:.9rem 1rem;margin-top:.65rem;font-size:.97rem;line-height:1.55;color:var(--tx2)}
.quiz-feedback strong{color:var(--acc2)}
.quiz-next{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#fff;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;margin-top:.8rem;transition:background .2s}
.quiz-next:hover{background:var(--acc2)}
.quiz-results{text-align:center;padding:1rem 0}
.quiz-score{font-family:'Playfair Display',serif;font-size:3.5rem;font-weight:700;color:var(--acc2);line-height:1}
.quiz-pct{font-family:'IBM Plex Mono',monospace;font-size:.75rem;color:var(--tx3);letter-spacing:.1em;margin-top:.3rem}
.quiz-msg{font-size:1.02rem;color:var(--tx2);margin:1rem 0 1.5rem;line-height:1.55}
.quiz-retry{background:var(--surf);border:1.5px solid var(--brd2);border-radius:12px;padding:.8rem 1.5rem;font-size:.97rem;color:var(--acc2);cursor:pointer;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:.5rem;transition:border-color .2s}
.quiz-retry:hover{border-color:var(--acc)}
.reflex-card{background:var(--surf);border:1px solid var(--brd);border-radius:14px;padding:1rem 1.05rem;margin-bottom:.75rem;display:flex;gap:.9rem;align-items:flex-start}
.reflex-num{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:var(--brd2);line-height:1;flex-shrink:0;width:2rem;padding-top:.1rem}
.reflex-body{flex:1}
.reflex-q{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:var(--tx);line-height:1.4}
.reflex-ref{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);margin-top:.35rem}
.vida-card{background:linear-gradient(135deg,rgba(61,90,128,.20),rgba(61,90,128,.03));border:1.5px solid rgba(61,90,128,.38);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}
.key-list{list-style:none;padding:0;margin-bottom:.85rem}
.key-list li{display:flex;gap:.7rem;align-items:flex-start;padding:.6rem 0;border-bottom:1px solid var(--brd)}
.key-list li:last-child{border-bottom:none}
.key-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:.55rem}
.key-text{font-size:.97rem;line-height:1.6;color:var(--tx2)}
.key-text strong{color:var(--tx)}
.discuss-block{margin-bottom:1.1rem}
.discuss-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--tx);margin-bottom:.55rem}
.discuss-q{display:flex;gap:.6rem;align-items:flex-start;padding:.55rem 0;border-bottom:1px solid var(--brd)}
.discuss-q:last-child{border-bottom:none}
.discuss-num{font-family:'IBM Plex Mono',monospace;font-size:.68rem;color:var(--acc2);flex-shrink:0;padding-top:.15rem}
.discuss-text{font-size:.94rem;line-height:1.55;color:var(--tx2)}
.discuss-ref{color:var(--tx3);font-size:.86rem}
.discuss-personal{background:rgba(61,90,128,.10);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: una pérdida dolorosa", desc: "Preguntar quién ha vivido una ruptura dolorosa en una relación: algo que dijimos y no se puede desdecir, o una decisión de otro que rompió el vínculo. Dios también conoce esa pérdida: en el Edén perdió la conversación cara a cara con Adán y Eva (Isaías 59:2)." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos del grupo. Orar agradeciendo que el velo ya está rasgado y que podemos acercarnos a Dios sin intermediarios." },
  { time: "05–11 min", title: "Tab Velo — El santuario y el velo rasgado", desc: "Recorrer la historia del santuario: del Edén al tabernáculo, del templo de Salomón al de Herodes. Explicar el velo, la sangre rociada delante de él y el Día de la Expiación. Cerrar con Mateo 27:51 y Hebreos 10:19, 20: el velo era su carne." },
  { time: "11–16 min", title: "Tab Palabras — Conversaciones desde la cruz", desc: "Trabajar las dos conversaciones personales de Jesús en la cruz: el ladrón arrepentido (Lucas 23:40-43) y el encargo de María a Juan (Juan 19:25-27). Conectar con 1 Corintios 13:5: el amor no busca lo suyo." },
  { time: "16–21 min", title: "Tab Cumplido — Todo está cumplido", desc: "Desarrollar «Tengo sed», el vinagre del Salmo 69:21 y el clamor «Consumado es». Mostrar el eco en Apocalipsis 12:10 y el descanso sabático de Jesús en la tumba, paralelo a Génesis 2:1-3. Repasar el bloque inVestiga sobre el significado de su muerte." },
  { time: "21–24 min", title: "Tab Sepulcro — José, Nicodemo y el sábado", desc: "La muerte prematura que sorprendió a Pilato (Marcos 15:44), la vida entregada voluntariamente (Juan 10:17, 18) y los dos seguidores secretos que por fin dieron la cara. Destacar que interrumpieron la sepultura para guardar el sábado (Lucas 23:56)." },
  { time: "24–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto, deteniéndose en el significado del velo rasgado y en por qué Jesús murió antes de lo esperado." },
  { time: "27–30 min", title: "Cierre e inQuiere", desc: "Usar los tres bloques de discusión: las palabras finales, su muerte y en el sepulcro. Cerrar con las citas de Elena G. de White y los «Puntos clave para recordar»." },
];

const VELO_DATA = [
  {
    key: "ve1", badge: "Isaías 59:2",
    name: "1. El Edén: una relación rota",
    body: "A Dios le encantaba visitar a Adán y Eva y hablar con ellos cara a cara. El pecado dañó esa relación y causó una profunda separación: «vuestras iniquidades han hecho división entre vosotros y vuestro Dios». Satanás convenció a nuestros primeros padres de una imagen equivocada de Dios, y esa imagen falsa los llevó a decisiones que destruyeron la intimidad con él."
  },
  {
    key: "ve2", badge: "Éxodo 25:8",
    name: "2. «Háganme un santuario»",
    body: "Para lograr la reconciliación, Dios propuso algo asombroso: «Y harán un santuario para mí, y habitaré en medio de ellos». Él mismo diseñó cada detalle del santuario para mostrarle a su pueblo lo que se necesitaba para restaurar la conexión cara a cara con él."
  },
  {
    key: "ve3", badge: "Historia",
    name: "3. Del tabernáculo al templo de Herodes",
    body: "El tabernáculo portátil que construyó Moisés sirvió de modelo para los templos posteriores. Salomón levantó el primer templo permanente en Jerusalén; siglos después los babilonios lo destruyeron. En tiempos de Esdras y Nehemías se construyó un segundo templo, que Herodes restauró y amplió en el siglo I a. C. Ese fue el templo que existía en la época de Cristo."
  },
  {
    key: "ve4", badge: "Salmo 80:1",
    name: "4. Detrás del velo: el trono de Dios",
    body: "El templo tenía un patio rodeado por un muro. Dentro había una estructura con dos compartimentos: el Lugar Santo y el Lugar Santísimo. En el Lugar Santísimo estaba el Arca de la Alianza, que representaba el trono de Dios; sobre ella, dos querubines con alas plegadas, símbolo de los ángeles que rodean el trono de Dios en el cielo. Dentro del arca descansaban las dos tablas de piedra del Sinaí."
  },
  {
    key: "ve5", badge: "El velo",
    name: "5. Una barrera protectora",
    body: "Como el ser humano ya no podía ver a Dios cara a cara sin morir, Dios le ordenó a Moisés colocar un velo delante del Arca de la Alianza. No era un castigo: era una barrera protectora para los sacerdotes mientras oficiaban en la presencia de un Dios santo."
  },
  {
    key: "ve6", badge: "El sacrificio diario",
    name: "6. La sangre delante del velo",
    body: "Cuando un transgresor traía un animal al santuario, el sacerdote tomaba la sangre y la rociaba delante del velo, ante el Arca que contenía la ley que el transgresor había quebrantado. Ese proceso permitía volver a casa con los pecados perdonados y la certeza de estar en paz con Dios."
  },
  {
    key: "ve7", badge: "Día de la Expiación",
    name: "7. Una vez al año, detrás del velo",
    body: "Solo en el Día de la Expiación el sumo sacerdote entraba detrás del velo, y solo después de llenar el compartimento con el humo del incienso. Así la presencia de Dios permanecía algo velada mientras el sacerdote colocaba la sangre de los cabritos sacrificados sobre el propiciatorio."
  },
  {
    key: "ve8", badge: "Juan 1:29 · Mateo 27:51",
    name: "8. El año 31 d. C.: el verdadero Cordero",
    body: "Durante siglos se ofrecieron innumerables sacrificios y se roció una cantidad incalculable de sangre delante del velo. Entonces, cuando el sacerdote se disponía a sacrificar el cordero de la ofrenda vespertina, el verdadero Cordero sin mancha estaba siendo crucificado fuera de la ciudad. Al exhalar Jesús su último aliento, la tierra tembló, las rocas se partieron y el velo del templo se rasgó de arriba abajo: la firma inconfundible de Dios."
  },
  {
    key: "ve9", badge: "Hebreos 10:19, 20",
    name: "9. El velo era su carne",
    body: "Pablo explica que el velo representaba la carne de Cristo: él nos abrió «un camino nuevo y vivo... a través del velo, esto es, de su carne». El velo se rasgó cuando su cuerpo fue quebrantado por nosotros. Su muerte derribó la barrera y nos permitió acercarnos a Dios."
  },
  {
    key: "ve10", badge: "Daniel 9:27",
    name: "10. El fin de los sacrificios",
    body: "El rasgamiento del velo también indicaba que el santuario terrenal ya no era necesario: el precio del pecado había sido pagado en su totalidad. «A la mitad de la semana hará cesar el sacrificio y la ofrenda». Comenzó una nueva era en la que lo único que necesitamos hacer es mirar a Cristo, nuestro Sumo Sacerdote en el santuario celestial."
  },
];

const PALABRAS_DATA = [
  {
    key: "pa1", badge: "Mateo 27:44",
    name: "1. Dos ladrones, un mismo insulto",
    body: "Jesús fue crucificado entre dos ladrones. El relato de Mateo aclara que al principio ambos lo insultaron: «Lo mismo le injuriaban también los ladrones que estaban crucificados con él». Ninguno de los dos empezó mejor que el otro."
  },
  {
    key: "pa2", badge: "Lucas 23:40-43",
    name: "2. El corazón que se ablandó",
    body: "El corazón de uno de ellos se ablandó al ver a Jesús sufrir con dignidad. Reconoció que él merecía su condena y que Jesús «ningún mal hizo», entendió que era el Hijo de Dios y quiso saber si había lugar para él en su reino: «Acuérdate de mí cuando vengas en tu reino». Jesús le respondió: «Hoy estarás conmigo en el paraíso». Incluso mientras moría, siguió extendiendo su mano para salvar."
  },
  {
    key: "pa3", badge: "Juan 19:25",
    name: "3. María, al pie de la cruz",
    body: "Junto a la cruz estaban su madre, la hermana de su madre, María mujer de Cleofas, y María Magdalena. Imagina lo que fue para María: ver impotente cómo su propio Hijo inocente, que Dios mismo le había dado milagrosamente, era asesinado de la forma más cruel e inhumana. Jesús sabía el peso exacto de la carga que ella llevaba en ese momento."
  },
  {
    key: "pa4", badge: "Juan 19:26, 27",
    name: "4. «Mujer, he ahí tu hijo»",
    body: "Jesús miró a su madre y le dijo: «Mujer, he ahí tu hijo». Y a Juan: «He ahí tu madre». Desde aquella hora el discípulo la recibió en su casa y la cuidó de ahí en adelante. Aunque tenía muchísimo de qué preocuparse, Jesús se tomó el tiempo de asegurarse de que su madre quedara bien cuidada, confiando su bienestar a uno de sus amigos más cercanos."
  },
  {
    key: "pa5", badge: "Juan 19:26",
    name: "5. El único de los doce que llegó hasta la cruz",
    body: "Juan fue el único de los doce discípulos que realmente siguió a Jesús hasta la cruz. Pedro lo siguió hasta el patio del sumo sacerdote, pero huyó hacia Getsemaní después de su tercera negación. En el Calvario solo estaban Juan, María la madre de Jesús y muchas de las otras mujeres que lo seguían, incluida María Magdalena."
  },
  {
    key: "pa6", badge: "1 Corintios 13:5",
    name: "6. Un amor que «no busca lo suyo»",
    body: "Parece increíble que Jesús, mientras sufría bajo el peso aplastante del pecado y el dolor de la crucifixión, siguiera preocupado por los demás. El amor «no busca lo suyo». Incluso en la cruz, Jesús demostró la importancia de las relaciones familiares y de ser fiel en las responsabilidades domésticas. Cuando el destino del mundo pendía de un hilo, se tomó el tiempo para proveer para su madre."
  },
];

const CUMPLIDO_DATA = [
  {
    key: "cu1", badge: "Juan 19:28",
    name: "1. «Tengo sed»",
    body: "A veces el dolor físico de Jesús quedaba opacado por una angustia interna mucho más intensa, pero su sufrimiento corporal fue extremo. Después de horas colgado en la cruz, deseaba beber agua. «Tengo sed» fue un grito real de un cuerpo real buscando alivio a un tormento real."
  },
  {
    key: "cu2", badge: "Salmo 69:21",
    name: "2. Vinagre en vez de agua",
    body: "Conmovido por la compasión, un soldado le ofreció vinagre en una esponja. En cumplimiento de la profecía, el Salvador sufriente no recibió ni un sorbo de agua: «Me pusieron además hiel por comida, y en mi sed me dieron a beber vinagre»."
  },
  {
    key: "cu3", badge: "Juan 19:30",
    name: "3. «Consumado es»",
    body: "Al no encontrar alivio, Jesús gritó de nuevo: «Consumado es». Luego inclinó la cabeza y entregó el espíritu. Había pasado 33 años y medio revelando quién era realmente el Padre, y finalmente había derrotado por completo a Satanás."
  },
  {
    key: "cu4", badge: "Lucas 23:46",
    name: "4. «Padre, en tus manos»",
    body: "Lucas conserva la última palabra: «Padre, en tus manos encomiendo mi espíritu». Después de las horas de oscuridad y silencio, Jesús murió confiando, sin ninguna evidencia sensible, en el Padre a quien siempre le había obedecido."
  },
  {
    key: "cu5", badge: "El gran conflicto",
    name: "5. Nunca cedió",
    body: "Satanás intentó matarlo poco después de su nacimiento, lo tentó en el desierto e incitó a los fariseos y a la multitud a exigir su muerte. Jesús nunca cedió a los ataques ni a las tentaciones. Condenó el pecado en la carne, y los días de Satanás quedaron contados. ¡Qué historia! ¡Qué Salvador!"
  },
  {
    key: "cu6", badge: "Apocalipsis 12:10",
    name: "6. El cielo respondió",
    body: "Los ángeles se estremecieron ante esta escena. Con la muerte de Jesús, la fealdad del pecado y la rebelión quedaron al descubierto ante todo el universo, y los ángeles desarrollaron una renovada admiración y lealtad hacia su Creador y Rey. «Ahora ha venido la salvación, el poder, y el reino de nuestro Dios... porque ha sido lanzado fuera el acusador de nuestros hermanos»."
  },
  {
    key: "cu7", badge: "Génesis 2:1-3",
    name: "7. Descansó en sábado",
    body: "Jesús murió poco antes de la puesta del sol del viernes, cuando el sábado estaba a punto de comenzar. Descansó en la tumba todo el sábado y resucitó temprano el primer día de la semana. Coincide exactamente con la creación: «acabó Dios en el día séptimo la obra que hizo; y reposó». Al igual que en la creación, Jesús descansó en sábado de su obra de recreación y redención."
  },
  {
    key: "cu8", badge: "Hebreos 12:2",
    name: "8. La fe que lo sostuvo",
    body: "«Puestos los ojos en Jesús, el autor y consumador de la fe, el cual por el gozo puesto delante de él sufrió la cruz, menospreciando el oprobio». Su fe en el desenlace —no la ausencia de dolor— fue lo que lo sostuvo hasta poder decir que verdaderamente todo estaba cumplido."
  },
];

const INVESTIGA_PECADOS = [
  { key: "ip1", badge: "Hebreos 9:28", name: "Ofrecido una sola vez", body: "«Así también Cristo fue ofrecido una sola vez para llevar los pecados de muchos; y aparecerá por segunda vez, sin relación con el pecado, para salvar a los que le esperan». Su sacrificio no se repite: es definitivo." },
  { key: "ip2", badge: "1 Pedro 2:24", name: "Nuestros pecados en su cuerpo", body: "«Quien llevó él mismo nuestros pecados en su cuerpo sobre el madero, para que nosotros, estando muertos a los pecados, vivamos a la justicia; y por cuya herida fuisteis sanados»." },
];

const INVESTIGA_MURIO = [
  { key: "im1", badge: "Isaías 53:8-12", name: "Cortado de la tierra de los vivientes", body: "Setecientos años antes, Isaías describió su muerte con precisión: «fue cortado de la tierra de los vivientes, y por la rebelión de mi pueblo fue herido»; «se dispuso con los impíos su sepultura, mas con los ricos fue en su muerte»; «derramó su vida hasta la muerte, y fue contado con los pecadores»." },
  { key: "im2", badge: "Romanos 5:8", name: "Siendo aún pecadores", body: "«Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros». No esperó a que mejoráramos: murió mientras todavía éramos enemigos." },
  { key: "im3", badge: "1 Corintios 15:3", name: "Conforme a las Escrituras", body: "«Que Cristo murió por nuestros pecados, conforme a las Escrituras». Pablo lo pone como lo primero del evangelio: no un accidente histórico, sino el centro del plan." },
  { key: "im4", badge: "Hebreos 2:9, 14, 15", name: "Gustó la muerte por todos", body: "Participó de nuestra carne y sangre «para destruir por medio de la muerte al que tenía el imperio de la muerte, esto es, al diablo, y librar a todos los que por el temor de la muerte estaban durante toda la vida sujetos a servidumbre»." },
];

const INVESTIGA_REDIMIO = [
  { key: "ir1", badge: "1 Pedro 1:18, 19", name: "No con oro ni plata", body: "«Fuisteis rescatados de vuestra vana manera de vivir... no con cosas corruptibles, como oro o plata, sino con la sangre preciosa de Cristo, como de un cordero sin mancha y sin contaminación»." },
  { key: "ir2", badge: "Apocalipsis 5:9", name: "El cántico nuevo", body: "«Digno eres de tomar el libro y de abrir sus sellos; porque tú fuiste inmolado, y con tu sangre nos has redimido para Dios, de todo linaje y lengua y pueblo y nación»." },
];

const SEPULCRO_DATA = [
  {
    key: "se1", badge: "Juan 19:31-33",
    name: "1. Una muerte demasiado rápida",
    body: "La cruz no causaba una muerte rápida: sus víctimas sufrían una agonía lenta, y a veces permanecían vivas durante varios días. Por eso los judíos pidieron que les quebrasen las piernas antes del sábado. Cuando los soldados llegaron a Jesús y lo vieron ya muerto, no le quebraron las piernas: había muerto en cuestión de horas."
  },
  {
    key: "se2", badge: "Marcos 15:44, 45",
    name: "2. Pilato se sorprendió",
    body: "«Pilato se sorprendió de que ya hubiese muerto; y haciendo venir al centurión, le preguntó si ya estaba muerto». Pilato tenía mucha experiencia con crucifixiones, y lo que pasó no encajaba con ninguna. Jesús no murió a causa de la cruz, sino a causa de nuestros pecados mientras estaba en ella."
  },
  {
    key: "se3", badge: "Juan 10:17, 18",
    name: "3. Nadie le quitó la vida",
    body: "Su muerte prematura confirma que no fue obligado a esa situación, sino que él mismo eligió su destino: «Nadie me la quita, sino que yo de mí mismo la pongo. Tengo poder para ponerla, y tengo poder para volverla a tomar»."
  },
  {
    key: "se4", badge: "Lucas 23:50, 51",
    name: "4. José de Arimatea",
    body: "Miembro del Sanedrín, el consejo más poderoso de la nación, «varón bueno y justo», que también esperaba el reino de Dios y «no había consentido en el acuerdo ni en los hechos de ellos». Era un seguidor secreto de Jesús que no apoyó su condena. Puso a disposición su propio sepulcro y obtuvo de Pilato el permiso para llevarse el cuerpo."
  },
  {
    key: "se5", badge: "Juan 3:1-21 · Juan 7:50-52",
    name: "5. Nicodemo",
    body: "Fariseo rico y gobernante de los judíos, había buscado una entrevista privada con Jesús de noche, al principio de su ministerio, para averiguar quién era realmente. Después de aquella conversación se sabe poco de él, salvo cuando defendió a Jesús en una reunión de los fariseos («¿Juzga acaso nuestra ley a un hombre si primero no le oye?»). Luego desapareció por completo... hasta que Jesús murió."
  },
  {
    key: "se6", badge: "Juan 19:39, 40",
    name: "6. Cien libras de mirra y áloes",
    body: "Nicodemo trajo un compuesto de mirra y áloes de casi cien libras para preparar el cuerpo, una cantidad propia de un entierro real. Ambos hombres se preocupaban por cómo los verían sus compañeros del concilio; pero ese temor no les impidió hacer lo que Dios había puesto en sus corazones, justo en el momento decisivo."
  },
  {
    key: "se7", badge: "Juan 19:41, 42",
    name: "7. Un sepulcro nuevo en un huerto",
    body: "Muchas víctimas de la crucifixión eran dejadas en la cruz para que se descompusieran y fueran devoradas por aves u otros animales, o eran arrojadas al basurero de la ciudad. Jesús, en cambio, fue honrado con una sepultura digna, en un huerto y en un sepulcro nuevo donde nadie había sido puesto."
  },
  {
    key: "se8", badge: "Lucas 23:56",
    name: "8. El honor de detenerse",
    body: "Se acercaba el sábado y el proceso de sepultura seguía incompleto. Sus amigos, cuidadosos de guardar el sábado según el mandamiento, interrumpieron el trabajo: «descansaron el día de reposo, conforme al mandamiento». Darle una sepultura digna fue un acto de amor; pero creían que guardar el sábado que él mismo había establecido en la creación y dado en el Sinaí sería una forma aún mayor de honrarlo. Le rindieron doble honor."
  },
];

const VERSES = [
  {
    ref: "Juan 19:25-42", isBase: true,
    text: `25 Estaban junto a la cruz de Jesús su madre, y la hermana de su madre, María mujer de Cleofas, y María Magdalena. 26 Cuando vio Jesús a su madre, y al discípulo a quien él amaba, que estaba presente, dijo a su madre: Mujer, he ahí tu hijo. 27 Después dijo al discípulo: He ahí tu madre. Y desde aquella hora el discípulo la recibió en su casa. 28 Después de esto, sabiendo Jesús que ya todo estaba consumado, dijo, para que la Escritura se cumpliese: Tengo sed. 29 Y estaba allí una vasija llena de vinagre; entonces ellos empaparon en vinagre una esponja, y poniéndola en un hisopo, se la acercaron a la boca. 30 Cuando Jesús hubo tomado el vinagre, dijo: Consumado es. Y habiendo inclinado la cabeza, entregó el espíritu. 31 Entonces los judíos, por cuanto era la preparación de la pascua, a fin de que los cuerpos no quedasen en la cruz en el día de reposo (pues aquel día de reposo era de gran solemnidad), rogaron a Pilato que se les quebrasen las piernas, y fuesen quitados de allí. 32 Vinieron, pues, los soldados, y quebraron las piernas al primero, y asimismo al otro que había sido crucificado con él. 33 Mas cuando llegaron a Jesús, como le vieron ya muerto, no le quebraron las piernas. 34 Pero uno de los soldados le abrió el costado con una lanza, y al instante salió sangre y agua. 35 Y el que lo vio da testimonio, y su testimonio es verdadero; y él sabe que dice verdad, para que vosotros también creáis. 36 Porque estas cosas sucedieron para que se cumpliese la Escritura: No será quebrado hueso suyo. 37 Y también otra Escritura dice: Mirarán al que traspasaron. 38 Después de todo esto, José de Arimatea, que era discípulo de Jesús, pero secretamente por miedo de los judíos, rogó a Pilato que le permitiese llevarse el cuerpo de Jesús; y Pilato se lo concedió. Entonces vino, y se llevó el cuerpo de Jesús. 39 También Nicodemo, el que antes había visitado a Jesús de noche, vino trayendo un compuesto de mirra y de áloes, como cien libras. 40 Tomaron, pues, el cuerpo de Jesús, y lo envolvieron en lienzos con especias aromáticas, según es costumbre sepultar entre los judíos. 41 Y en el lugar donde había sido crucificado, había un huerto; y en el huerto un sepulcro nuevo, en el cual aún no había sido puesto ninguno. 42 Allí, pues, por causa de la preparación de la pascua de los judíos, y porque aquel sepulcro estaba cerca, pusieron a Jesús.`
  },
  {
    ref: "Génesis 2:1-3",
    text: `1 Fueron, pues, acabados los cielos y la tierra, y todo el ejército de ellos. 2 Y acabó Dios en el día séptimo la obra que hizo; y reposó el día séptimo de toda la obra que hizo. 3 Y bendijo Dios al día séptimo, y lo santificó, porque en él reposó de toda la obra que había hecho en la creación.`
  },
  {
    ref: "Éxodo 25:8",
    text: `Y harán un santuario para mí, y habitaré en medio de ellos.`
  },
  {
    ref: "Salmo 69:21",
    text: `Me pusieron además hiel por comida, y en mi sed me dieron a beber vinagre.`
  },
  {
    ref: "Salmo 80:1",
    text: `Oh Pastor de Israel, escucha; tú que pastoreas como a ovejas a José, que estás entre querubines, resplandece.`
  },
  {
    ref: "Isaías 53:8-12",
    text: `8 Por cárcel y por juicio fue quitado; y su generación, ¿quién la contará? Porque fue cortado de la tierra de los vivientes, y por la rebelión de mi pueblo fue herido. 9 Y se dispuso con los impíos su sepultura, mas con los ricos fue en su muerte; aunque nunca hizo maldad, ni hubo engaño en su boca. 10 Con todo eso, Jehová quiso quebrantarlo, sujetándole a padecimiento. Cuando haya puesto su vida en expiación por el pecado, verá linaje, vivirá por largos días, y la voluntad de Jehová será en su mano prosperada. 11 Verá el fruto de la aflicción de su alma, y quedará satisfecho; por su conocimiento justificará mi siervo justo a muchos, y llevará las iniquidades de ellos. 12 Por tanto, yo le daré parte con los grandes, y con los fuertes repartirá despojos; por cuanto derramó su vida hasta la muerte, y fue contado con los pecadores, habiendo él llevado el pecado de muchos, y orado por los transgresores.`
  },
  {
    ref: "Isaías 59:2",
    text: `pero vuestras iniquidades han hecho división entre vosotros y vuestro Dios, y vuestros pecados han hecho ocultar de vosotros su rostro para no oír.`
  },
  {
    ref: "Daniel 9:27",
    text: `Y por otra semana confirmará el pacto con muchos; a la mitad de la semana hará cesar el sacrificio y la ofrenda. Después con la muchedumbre de las abominaciones vendrá el desolador, hasta que venga la consumación, y lo que está determinado se derrame sobre el desolador.`
  },
  {
    ref: "Mateo 27:44",
    text: `Lo mismo le injuriaban también los ladrones que estaban crucificados con él.`
  },
  {
    ref: "Mateo 27:51",
    text: `Y he aquí, el velo del templo se rasgó en dos, de arriba abajo; y la tierra tembló, y las rocas se partieron;`
  },
  {
    ref: "Marcos 15:44, 45",
    text: `44 Pilato se sorprendió de que ya hubiese muerto; y haciendo venir al centurión, le preguntó si ya estaba muerto. 45 E informado por el centurión, dio el cuerpo a José.`
  },
  {
    ref: "Lucas 23:40-43",
    text: `40 Respondiendo el otro, le reprendió, diciendo: ¿Ni aun temes tú a Dios, estando en la misma condenación? 41 Nosotros, a la verdad, justamente padecemos, porque recibimos lo que merecieron nuestros hechos; mas éste ningún mal hizo. 42 Y dijo a Jesús: Acuérdate de mí cuando vengas en tu reino. 43 Entonces Jesús le dijo: De cierto te digo que hoy estarás conmigo en el paraíso.`
  },
  {
    ref: "Lucas 23:46",
    text: `Entonces Jesús, clamando a gran voz, dijo: Padre, en tus manos encomiendo mi espíritu. Y habiendo dicho esto, expiró.`
  },
  {
    ref: "Lucas 23:50, 51",
    text: `50 Había un varón llamado José, de Arimatea, ciudad de Judea, el cual era miembro del concilio, varón bueno y justo. 51 Este, que también esperaba el reino de Dios, y no había consentido en el acuerdo ni en los hechos de ellos.`
  },
  {
    ref: "Lucas 23:56",
    text: `Y vueltas, prepararon especias aromáticas y ungüentos; y descansaron el día de reposo, conforme al mandamiento.`
  },
  {
    ref: "Juan 1:29",
    text: `El siguiente día vio Juan a Jesús que venía a él, y dijo: He aquí el Cordero de Dios, que quita el pecado del mundo.`
  },
  {
    ref: "Juan 3:1-21",
    text: `1 Había un hombre de los fariseos que se llamaba Nicodemo, un principal entre los judíos. 2 Este vino a Jesús de noche, y le dijo: Rabí, sabemos que has venido de Dios como maestro; porque nadie puede hacer estas señales que tú haces, si no está Dios con él. 3 Respondió Jesús y le dijo: De cierto, de cierto te digo, que el que no naciere de nuevo, no puede ver el reino de Dios. 4 Nicodemo le dijo: ¿Cómo puede un hombre nacer siendo viejo? ¿Puede acaso entrar por segunda vez en el vientre de su madre, y nacer? 5 Respondió Jesús: De cierto, de cierto te digo, que el que no naciere de agua y del Espíritu, no puede entrar en el reino de Dios. 6 Lo que es nacido de la carne, carne es; y lo que es nacido del Espíritu, espíritu es. 7 No te maravilles de que te dije: Os es necesario nacer de nuevo. 8 El viento sopla de donde quiere, y oyes su sonido; mas ni sabes de dónde viene, ni a dónde va; así es todo aquel que es nacido del Espíritu. 9 Respondió Nicodemo y le dijo: ¿Cómo puede hacerse esto? 10 Respondió Jesús y le dijo: ¿Eres tú maestro de Israel, y no sabes esto? 11 De cierto, de cierto te digo, que lo que sabemos hablamos, y lo que hemos visto, testificamos; y no recibís nuestro testimonio. 12 Si os he dicho cosas terrenales, y no creéis, ¿cómo creeréis si os dijere las celestiales? 13 Nadie subió al cielo, sino el que descendió del cielo; el Hijo del Hombre, que está en el cielo. 14 Y como Moisés levantó la serpiente en el desierto, así es necesario que el Hijo del Hombre sea levantado, 15 para que todo aquel que en él cree, no se pierda, mas tenga vida eterna. 16 Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna. 17 Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él. 18 El que en él cree, no es condenado; pero el que no cree, ya ha sido condenado, porque no ha creído en el nombre del unigénito Hijo de Dios. 19 Y esta es la condenación: que la luz vino al mundo, y los hombres amaron más las tinieblas que la luz, porque sus obras eran malas. 20 Porque todo aquel que hace lo malo, aborrece la luz y no viene a la luz, para que sus obras no sean reprendidas. 21 Mas el que practica la verdad viene a la luz, para que sea manifiesto que sus obras son hechas en Dios.`
  },
  {
    ref: "Juan 7:50-52",
    text: `50 Les dijo Nicodemo, el que vino a él de noche, el cual era uno de ellos: 51 ¿Juzga acaso nuestra ley a un hombre si primero no le oye, y sabe lo que ha hecho? 52 Respondieron y le dijeron: ¿Eres tú también galileo? Escudriña y ve que de Galilea nunca se ha levantado profeta.`
  },
  {
    ref: "Juan 10:17, 18",
    text: `17 Por eso me ama el Padre, porque yo pongo mi vida, para volverla a tomar. 18 Nadie me la quita, sino que yo de mí mismo la pongo. Tengo poder para ponerla, y tengo poder para volverla a tomar. Este mandamiento recibí de mi Padre.`
  },
  {
    ref: "Romanos 5:8",
    text: `Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros.`
  },
  {
    ref: "1 Corintios 13:5",
    text: `no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor;`
  },
  {
    ref: "1 Corintios 15:3",
    text: `Porque primeramente os he enseñado lo que asimismo recibí: Que Cristo murió por nuestros pecados, conforme a las Escrituras;`
  },
  {
    ref: "Hebreos 2:9, 14, 15",
    text: `9 Pero vemos a aquel que fue hecho un poco menor que los ángeles, a Jesús, coronado de gloria y de honra, a causa del padecimiento de la muerte, para que por la gracia de Dios gustase la muerte por todos. 14 Así que, por cuanto los hijos participaron de carne y sangre, él también participó de lo mismo, para destruir por medio de la muerte al que tenía el imperio de la muerte, esto es, al diablo, 15 y librar a todos los que por el temor de la muerte estaban durante toda la vida sujetos a servidumbre.`
  },
  {
    ref: "Hebreos 9:28",
    text: `así también Cristo fue ofrecido una sola vez para llevar los pecados de muchos; y aparecerá por segunda vez, sin relación con el pecado, para salvar a los que le esperan.`
  },
  {
    ref: "Hebreos 10:19, 20",
    text: `19 Así que, hermanos, teniendo libertad para entrar en el Lugar Santísimo por la sangre de Jesucristo, 20 por el camino nuevo y vivo que él nos abrió a través del velo, esto es, de su carne,`
  },
  {
    ref: "Hebreos 12:2",
    text: `puestos los ojos en Jesús, el autor y consumador de la fe, el cual por el gozo puesto delante de él sufrió la cruz, menospreciando el oprobio, y se sentó a la diestra del trono de Dios.`
  },
  {
    ref: "1 Pedro 1:18, 19",
    text: `18 sabiendo que fuisteis rescatados de vuestra vana manera de vivir, la cual recibisteis de vuestros padres, no con cosas corruptibles, como oro o plata, 19 sino con la sangre preciosa de Cristo, como de un cordero sin mancha y sin contaminación.`
  },
  {
    ref: "1 Pedro 2:24",
    text: `quien llevó él mismo nuestros pecados en su cuerpo sobre el madero, para que nosotros, estando muertos a los pecados, vivamos a la justicia; y por cuya herida fuisteis sanados.`
  },
  {
    ref: "Apocalipsis 5:9",
    text: `y cantaban un nuevo cántico, diciendo: Digno eres de tomar el libro y de abrir sus sellos; porque tú fuiste inmolado, y con tu sangre nos has redimido para Dios, de todo linaje y lengua y pueblo y nación;`
  },
  {
    ref: "Apocalipsis 12:10",
    text: `Entonces oí una gran voz en el cielo, que decía: Ahora ha venido la salvación, el poder, y el reino de nuestro Dios, y la autoridad de su Cristo; porque ha sido lanzado fuera el acusador de nuestros hermanos, el que los acusaba delante de nuestro Dios día y noche.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Qué ocurrió en el templo en el mismo momento en que Jesús exhaló su último aliento?",
    opts: ["Se apagaron las lámparas del Lugar Santo", "El velo del templo se rasgó en dos, de arriba abajo", "El sumo sacerdote renunció a su cargo", "El Arca de la Alianza desapareció"],
    ans: 1,
    feedback: "«El velo del templo se rasgó en dos, de arriba abajo; y la tierra tembló, y las rocas se partieron» (Mateo 27:51). De arriba abajo: fue Dios, no un hombre, quien lo rasgó."
  },
  {
    q: "Según Hebreos 10:19, 20, ¿qué representaba el velo del templo?",
    opts: ["La ley de Moisés", "La carne de Cristo", "El sacerdocio levítico", "La separación entre judíos y gentiles"],
    ans: 1,
    feedback: "Cristo nos abrió «un camino nuevo y vivo... a través del velo, esto es, de su carne» (Hebreos 10:20). El velo se rasgó cuando su cuerpo fue quebrantado por nosotros."
  },
  {
    q: "¿Qué hicieron al principio los dos ladrones crucificados junto a Jesús?",
    opts: ["Los dos le pidieron perdón", "Los dos lo insultaron", "Uno guardó silencio y el otro oró", "Los dos pidieron ser bajados de la cruz"],
    ans: 1,
    feedback: "«Lo mismo le injuriaban también los ladrones que estaban crucificados con él» (Mateo 27:44). Después, el corazón de uno de ellos se ablandó al verlo sufrir con dignidad (Lucas 23:40-43)."
  },
  {
    q: "¿Qué arreglo hizo Jesús desde la cruz por su madre?",
    opts: ["Le pidió a Pedro que la llevara a Galilea", "La encomendó al discípulo Juan, que la recibió en su casa", "Le pidió a José de Arimatea que la cuidara", "Le dijo que volviera a Nazaret con sus parientes"],
    ans: 1,
    feedback: "«Mujer, he ahí tu hijo... He ahí tu madre. Y desde aquella hora el discípulo la recibió en su casa» (Juan 19:26, 27). Aun cargando el pecado del mundo, se ocupó de su responsabilidad familiar."
  },
  {
    q: "Cuando Jesús dijo «Tengo sed», ¿qué le dieron y qué profecía se cumplió?",
    opts: ["Agua fresca; Isaías 53:9", "Vinagre en una esponja; Salmo 69:21", "Vino mezclado con miel; Salmo 22:18", "Nada en absoluto; Daniel 9:27"],
    ans: 1,
    feedback: "Empaparon una esponja en vinagre y se la acercaron a la boca (Juan 19:29). El Salvador sufriente no recibió ni un sorbo de agua: «en mi sed me dieron a beber vinagre» (Salmo 69:21)."
  },
  {
    q: "¿Por qué el descanso de Jesús en la tumba durante el sábado es tan significativo?",
    opts: ["Porque así evitó la persecución de los romanos", "Porque repite el patrón de la creación: terminada la obra, Dios reposó el séptimo día", "Porque el sábado era el único día permitido para sepultar", "Porque los discípulos necesitaban tiempo para preparar el sepulcro"],
    ans: 1,
    feedback: "«Acabó Dios en el día séptimo la obra que hizo; y reposó» (Génesis 2:2). Al igual que en la creación, Jesús descansó en sábado de su obra de recreación y redención. ¡Verdaderamente «todo está cumplido»!"
  },
  {
    q: "¿Qué sorprendió a Pilato respecto de la muerte de Jesús, y qué demuestra?",
    opts: ["Que tardara tantos días; demuestra su resistencia física", "Que muriera tan pronto; demuestra que entregó su vida voluntariamente", "Que nadie reclamara el cuerpo; demuestra su soledad", "Que hubiera un terremoto; demuestra la ira de los dioses"],
    ans: 1,
    feedback: "«Pilato se sorprendió de que ya hubiese muerto» (Marcos 15:44). Jesús no murió a causa de la cruz, sino de nuestros pecados mientras estaba en ella: «Nadie me la quita, sino que yo de mí mismo la pongo» (Juan 10:18)."
  },
  {
    q: "¿Quiénes dieron sepultura digna al cuerpo de Jesús, y qué tenían en común?",
    opts: ["Pedro y Juan; ambos eran pescadores", "José de Arimatea y Nicodemo; ambos eran seguidores que hasta entonces habían mantenido su fe en secreto", "El centurión y un soldado; ambos eran romanos", "María Magdalena y Marta; ambas eran de Betania"],
    ans: 1,
    feedback: "Ambos eran miembros prominentes del Sanedrín que seguían a Jesús en privado (Juan 19:38-42; Lucas 23:50, 51). El temor a sus compañeros no les impidió actuar en el momento decisivo."
  },
];

const DISCUSS_PALABRAS = [
  { n: 1, text: "¿Qué arreglos hizo Jesús por su madre en medio de su sufrimiento? ¿Qué nos enseña esto sobre la responsabilidad en las relaciones familiares?", ref: "Juan 19:25-27" },
  { n: 2, text: "¿Cuánto sufrimiento físico y dolor sintió Jesús mientras estaba en la cruz? ¿De qué manera su fe lo ayudó a sobrellevarlo?", ref: "Lucas 23:46; Juan 19:28; Hebreos 12:2" },
  { n: 3, text: "¿Qué «se cumplió» en la cruz?", ref: "Juan 19:30; Hebreos 2:14" },
];

const DISCUSS_MUERTE = [
  { n: 1, text: "¿Qué tenía de inusual el momento de la muerte de Cristo?", ref: "Juan 19:31-33; Marcos 15:44" },
  { n: 2, text: "¿Cuál fue la verdadera razón de su muerte?", ref: "Isaías 53:10-12; 1 Corintios 15:3" },
  { n: 3, text: "¿Entregó Jesús su vida voluntariamente?", ref: "Juan 10:17, 18" },
];

const DISCUSS_SEPULCRO = [
  { n: 1, text: "¿Qué dos hombres colaboraron para dar sepultura digna al cuerpo de Jesús? ¿Por qué esto fue un punto de inflexión en sus vidas?", ref: "Juan 19:38-42" },
  { n: 2, text: "¿De qué otra manera los amigos de Jesús lo honraron durante su sepultura?", ref: "Lucas 23:56" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Qué revela el amor abnegado que Jesús demostró, incluso en medio de su gran sufrimiento, sobre el gran amor que te tiene a ti personalmente? ¿Cuál es la mejor manera de responder a ese amor?", ref: "Juan 19:25-27; 1 Corintios 13:5" },
  { key: "rfl2", q: "¿Qué partes de esta historia te resultan más difíciles de entender? ¿Hay algún detalle o enfoque nuevo que hayas percibido esta vez?", ref: "" },
  { key: "rfl3", q: "¿Cómo crees que te habrías sentido al ver la muerte de Jesús si hubieras sido uno de los ángeles? ¿Cómo te habría cambiado la vida ese momento?", ref: "Apocalipsis 12:10" },
  { key: "rfl4", q: "¿Alguna vez has intentado ser un seguidor secreto de Jesús? ¿Por qué los verdaderos seguidores de Jesús terminan revelando su fe?", ref: "Juan 19:38, 39" },
  { key: "rfl5", q: "¿Qué otros pasajes de las Escrituras te vienen a la mente en relación con Juan 19:25-42?", ref: "" },
  { key: "rfl6", q: "Memoriza tu pasaje favorito de Juan 19:25-42. Escríbelo varias veces para ayudarte a memorizarlo.", ref: "Juan 19:25-42" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function ExpandList({ items, openExpand, toggleExpand }) {
  return items.map(item => (
    <div
      key={item.key}
      className={`expand-item${openExpand[item.key] ? " open" : ""}`}
      onClick={() => toggleExpand(item.key)}
    >
      <div className="expand-header">
        <span className="expand-badge">{item.badge}</span>
        <span className="expand-name">{item.name}</span>
        {openExpand[item.key] ? <ChevronUp size={16} color="var(--acc2)" /> : <ChevronDown size={16} color="var(--tx3)" />}
      </div>
      {openExpand[item.key] && (
        <div className="expand-body">{item.body}</div>
      )}
    </div>
  ));
}

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">La muerte <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>y la sepultura</em></div>
      <div className="sec-sub">Undécima Semana · Juan 19:25-42 · Las escenas finales</div>

      {teacherMode ? (
        <>
          <div className="guide-banner">
            <span className="guide-badge">Maestro</span>
            <p>Guía de clase · 30 minutos · Modo maestro activo</p>
          </div>
          {GUIDE_STEPS.map((s, i) => (
            <div key={i} className="guide-step">
              <div className="guide-time">{s.time}</div>
              <div className="guide-step-body">
                <div className="guide-step-title">{s.title}</div>
                <div className="guide-step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="card">
            <div className="card-label">El velo rasgado</div>
            <p>¿Alguna vez has vivido una pérdida dolorosa en una relación? Quizás dijiste algo de lo que te arrepentiste, o alguien tomó decisiones que provocaron una ruptura. Dios también ha experimentado pérdidas dolorosas: en el Edén le encantaba hablar cara a cara con Adán y Eva, y el pecado abrió una separación profunda. Todo el sistema del santuario existió para responder esa pérdida. Y en el año 31 d. C., cuando Jesús exhaló su último aliento, el velo que protegía esa distancia se rasgó de arriba abajo.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Juan 19:30
            </div>
            <div className="honey-text">
              «Cuando Jesús hubo tomado el vinagre, dijo: Consumado es. Y habiendo inclinado la cabeza, entregó el espíritu.»
            </div>
            <div className="honey-ref">Juan 19:30 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text">Incluso en medio de su intenso sufrimiento, Jesús demostró su amor <strong>continuando preocupado por los demás</strong>: le prometió la salvación al ladrón creyente y se ocupó de su madre.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">La <strong>muerte prematura</strong> de Cristo, que sorprendió a sus enemigos, demostró que no fue solo la cruz la que acabó con su vida, sino también nuestros pecados.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Tras su muerte, los amigos de Jesús lo honraron dándole una <strong>sepultura digna</strong> y guardando el sábado.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabVelo({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Velo</div>
      <div className="sec-sub">El velo rasgado</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Una barrera que Dios mismo quitó</div>
        <p>Durante cientos de años, el santuario prefiguró el sacrificio final de Jesús, «el Cordero de Dios, que quita el pecado del mundo» (Juan 1:29). Cada pieza del mobiliario, cada ritual y cada gota de sangre rociada delante del velo apuntaban a un solo día. Este recorrido te lleva del Edén al Calvario.</p>
      </div>

      <ExpandList items={VELO_DATA} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>Al igual que se rasgó la barrera protectora entre la presencia de Dios y sus hijos, Cristo abrió el camino para que los pecadores fueran perdonados, purificados y restaurados de nuevo a su presencia. Hoy no necesitas un sacerdote, un velo ni un animal: solo mirar a Cristo.</p>
      </div>
    </>
  );
}

function TabPalabras({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Palabras</div>
      <div className="sec-sub">Conversaciones personales desde la cruz</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Tiempo para el otro</div>
        <p>Mientras Jesús pendía de la cruz, uno no pensaría que tenía tiempo ni energía para conversaciones personales. Y sin embargo, los Evangelios registran dos interacciones muy importantes: una con un criminal moribundo y otra con su propia madre. En las dos, Jesús estaba pensando en alguien que no era él mismo.</p>
      </div>

      <ExpandList items={PALABRAS_DATA} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>¿Qué revela el amor abnegado que Jesús demostró, incluso en medio de su gran sufrimiento, sobre el gran amor que te tiene a ti personalmente? ¿Cuál es la mejor manera de responder a ese amor?</p>
      </div>
    </>
  );
}

function TabCumplido({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Cumplido</div>
      <div className="sec-sub">Todo está cumplido</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El momento que lo cambió todo</div>
        <p>Los ángeles en el cielo se estremecieron ante esta escena. Ese momento lo cambió todo. «El grito agonizante del Salvador: "Consumado es", fue el toque de agonía para Satanás. Fue entonces cuando quedó zanjado el gran conflicto que había durado tanto tiempo y asegurada la extirpación final del mal» (Elena G. de White, <em>El conflicto de los siglos</em>, cap. 30, p. 493).</p>
      </div>

      <ExpandList items={CUMPLIDO_DATA} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="card" style={{ borderColor: "var(--brd2)", margin: "1.1rem 0 .85rem" }}>
        <div className="card-label">inVestiga · ¿Qué significó su muerte?</div>
        <p>Estos pasajes nos ayudan a comprender el verdadero significado de la muerte y la sepultura de Jesús.</p>
      </div>

      <div className="group-label">Llevó nuestros pecados</div>
      <ExpandList items={INVESTIGA_PECADOS} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Él murió por nosotros</div>
      <ExpandList items={INVESTIGA_MURIO} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Nos redimió con su sangre</div>
      <ExpandList items={INVESTIGA_REDIMIO} openExpand={openExpand} toggleExpand={toggleExpand} />
    </>
  );
}

function TabSepulcro({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Sepulcro</div>
      <div className="sec-sub">La sepultura de Jesús</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Dos hombres que dejaron de esconderse</div>
        <p>José de Arimatea y Nicodemo tenían historias parecidas: los dos eran miembros prominentes del Sanedrín, el consejo más poderoso de Israel, y los dos habían seguido a Jesús en privado. Estaban preocupados por cómo los verían sus compañeros. Pero ese temor no les impidió hacer lo que Dios había puesto en sus corazones, justo cuando hacerlo costaba más que nunca.</p>
      </div>

      <ExpandList items={SEPULCRO_DATA} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>¿Alguna vez has intentado ser un seguidor secreto de Jesús? ¿Por qué los verdaderos seguidores de Jesús terminan revelando su fe?</p>
      </div>
    </>
  );
}

function TabBiblia({ openVerses, toggle, renderVerseText }) {
  return (
    <>
      <div className="sec-title">Biblia</div>
      <div className="sec-sub">{VERSES.length} pasajes · RVR1960 · Tocá para expandir</div>

      {VERSES.map(v => (
        <div
          key={v.ref}
          className={`verse-item${v.isBase ? " base-v" : ""}`}
          onClick={() => toggle(v.ref)}
        >
          <div className="verse-header">
            <span className="verse-ref">{v.ref}</span>
            <div className="verse-tags">
              {v.isBase && (
                <span className="verse-tag warn-tag"><Star size={9} style={{ display: "inline", marginRight: 3 }} />Texto base</span>
              )}
              {openVerses[v.ref] ? <ChevronUp size={15} color="var(--acc2)" /> : <ChevronDown size={15} color="var(--tx3)" />}
            </div>
          </div>
          {openVerses[v.ref] && (
            <div className="verse-body">{renderVerseText(v.text)}</div>
          )}
        </div>
      ))}
    </>
  );
}

function TabQuiz({ quizIdx, quizSelected, quizAnswered, quizResults, quizDone, score, selectQuiz, nextQuiz, retryQuiz }) {
  if (quizDone) {
    const pct = Math.round((score / QUIZ_DATA.length) * 100);
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien lo que se cumplió en la cruz y lo que significó su sepultura." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre la muerte y la sepultura de Jesús." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Juan 19:25-42." :
                "Vale la pena releer el pasaje. Es donde el velo se rasga y el camino a Dios queda abierto para vos.";
    return (
      <div className="quiz-results">
        <div className="quiz-score">{score}/{QUIZ_DATA.length}</div>
        <div className="quiz-pct">{pct}% correcto</div>
        <div className="quiz-msg">{msg}</div>
        <button className="quiz-retry" onClick={retryQuiz}><RotateCcw size={15} /> Intentar de nuevo</button>
      </div>
    );
  }

  const q = QUIZ_DATA[quizIdx];
  return (
    <>
      <div className="quiz-progress">
        {QUIZ_DATA.map((_, i) => {
          let cls = "quiz-dot";
          if (i < quizResults.length) cls += quizResults[i] ? " correct" : " wrong";
          else if (i === quizIdx) cls += " active";
          return <div key={i} className={cls} />;
        })}
      </div>

      <div className="quiz-q">{q.q}</div>

      {q.opts.map((opt, i) => {
        let cls = "quiz-option";
        if (quizAnswered) {
          if (i === q.ans) cls += " correct";
          else if (i === quizSelected) cls += " wrong";
        }
        return (
          <button key={i} className={cls} onClick={() => selectQuiz(i)} disabled={quizAnswered}>
            {opt}
          </button>
        );
      })}

      {quizAnswered && (
        <>
          <div className="quiz-feedback">
            {quizSelected === q.ans
              ? <><CheckCircle size={14} color="var(--ok)" style={{ display: "inline", marginRight: 6 }} /><strong>Correcto.</strong> </>
              : <><XCircle size={14} color="var(--err)" style={{ display: "inline", marginRight: 6 }} /><strong>Incorrecto.</strong> </>
            }
            {q.feedback}
          </div>
          <button className="quiz-next" onClick={nextQuiz}>
            {quizIdx + 1 < QUIZ_DATA.length ? "Siguiente →" : "Ver resultados"}
          </button>
        </>
      )}
    </>
  );
}

function TabCierre() {
  return (
    <>
      <div className="sec-title">Cierre</div>
      <div className="sec-sub">imPlícate · inQuiere</div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El conflicto de los siglos, cap. 20, pp. 347, 348</div>
        <div className="egw-text">«El reino de la gracia fue instituido inmediatamente después de la caída del ser humano... Sin embargo, no fue establecido en realidad hasta la muerte de Cristo. [...] En Getsemaní la copa del dolor le tembló en la mano. Aun entonces, hubiera podido enjugar el sudor de sangre de su frente y dejar que la raza culpable pereciera en su iniquidad. [...] Pero cuando el Salvador hubo rendido la vida y exclamado en su último aliento: <strong>"Todo está cumplido"</strong>, el plan de la redención quedó asegurado. La promesa de salvación hecha a la pareja culpable en el Edén quedó ratificada. [...] Así, la muerte de Cristo —el acontecimiento mismo que los discípulos habían considerado como la ruina final de sus esperanzas— fue lo que las aseguró para siempre.»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · Los hechos de los apóstoles, cap. 20, pp. 156, 157</div>
        <div className="egw-text">«La muerte de Cristo demuestra el gran amor de Dios por la humanidad. Es nuestra garantía de salvación. <strong>Quitarle al cristiano la cruz sería como borrar del cielo el sol.</strong> La cruz nos acerca a Dios, y nos reconcilia con él. [...] Sin la cruz, el ser humano no podría unirse con el Padre. De ella depende toda nuestra esperanza. De ella emana la luz del amor del Salvador; y cuando al pie de la cruz el pecador mira al que murió para salvarlo, puede regocijarse con pleno gozo; porque sus pecados son perdonados.»</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Las palabras finales</div>
        {DISCUSS_PALABRAS.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Hay aspectos de tu vida en los que sigues viviendo como si Jesús no hubiera vencido a Satanás? ¿Cómo puedes vivir cada día en la victoria que Cristo consiguió en la cruz?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Su muerte</div>
        {DISCUSS_MUERTE.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿De qué manera cambia tu perspectiva sobre el amor y el sacrificio de Jesús el hecho de que su muerte fuera voluntaria y no forzada?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">En el sepulcro</div>
        {DISCUSS_SEPULCRO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> Dos grupos trabajaron juntos para darle a Jesús una sepultura digna: los líderes religiosos, que mantenían su fe en privado, y las mujeres, que eran valientes y no tenían miedo. ¿Qué podemos aprender sobre cómo se puede trabajar con creyentes de diferentes orígenes?</div>
      </div>

      {REFLEXIONES.map((r, i) => (
        <div key={r.key} className="reflex-card">
          <div className="reflex-num">{i + 1}</div>
          <div className="reflex-body">
            <div className="reflex-q">{r.q}</div>
            {r.ref && <div className="reflex-ref">{r.ref}</div>}
          </div>
        </div>
      ))}

      <div className="card">
        <div className="card-label">Puntos clave para recordar</div>
        <ul className="key-list">
          <li>
            <span className="key-dot" />
            <span className="key-text">Incluso en medio de su intenso sufrimiento, Jesús demostró su amor al <strong>continuar preocupado por los demás</strong>: le prometió la salvación al ladrón creyente y se ocupó de su madre.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">La muerte prematura de Cristo, la cual sorprendió a sus enemigos, demostró que no solo fue la cruz la que acabó con su vida, <strong>sino también nuestros pecados</strong>.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Tras su muerte, los amigos de Jesús le honraron proporcionándole una sepultura digna y <strong>guardando el sábado</strong>.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>José de Arimatea y Nicodemo creyeron en Jesús durante años sin que nadie se enterara. Tenían buenas razones: eran parte del concilio, tenían reputación, posición, colegas que los juzgarían. Su fe estaba en privado porque en público salía cara.</p>
          <br />
          <p>Probablemente sepas de qué se trata. Se puede ser cristiano en casa y en la iglesia, y algo mucho más neutral en el grupo de la facultad, en el equipo, en los grupos de chat o en las historias que subís. No por vergüenza exactamente: por cálculo. Porque hablar cuesta.</p>
          <br />
          <p>Lo interesante es cuándo dejaron de esconderse: <strong>justo en el peor momento posible.</strong> No cuando Jesús multiplicaba panes y todos lo aplaudían, sino cuando estaba muerto, condenado, y asociarse con él no ofrecía absolutamente ningún beneficio. Ahí fueron a Pilato a pedir el cuerpo.</p>
          <br />
          <p>Esta semana, elegí un lugar concreto donde tu fe está en modo secreto y hacé algo pequeño y real: responder con honestidad cuando te pregunten qué hacés el sábado, defender a alguien de quien todos se ríen, decir «yo sí creo» sin dar un sermón. <strong>No tenés que anunciarlo: tenés que dejar de ocultarlo.</strong></p>
          <br />
          <p>Y si esta semana te toca cargar con algo pesado, acordate de lo que Jesús hizo mientras moría: se ocupó de su madre. El dolor propio no lo desconectó de la gente que tenía cerca. Preguntale hoy a alguien cómo está de verdad.</p>
        </div>
      </div>
    </>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("inicio");
  const [openVerses, setOpenVerses] = useState({});
  const [openExpand, setOpenExpand] = useState({});
  const [teacherMode, setTeacherMode] = useState(false);
  const [barFlash, setBarFlash] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);

  const taps = useRef(0);
  const tapTimer = useRef(null);
  const scrollRef = useRef(null);

  const handleHeroTap = useCallback(() => {
    taps.current += 1;
    clearTimeout(tapTimer.current);
    if (taps.current >= 5) {
      taps.current = 0;
      setTeacherMode(m => !m);
      setBarFlash(true);
      setTimeout(() => setBarFlash(false), 600);
    } else {
      tapTimer.current = setTimeout(() => { taps.current = 0; }, 1000);
    }
  }, []);

  const switchTab = useCallback((id) => {
    setTab(id);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "instant" }), 0);
  }, []);

  const toggleVerse = useCallback(ref => setOpenVerses(p => ({ ...p, [ref]: !p[ref] })), []);
  const toggleExpand = useCallback(key => setOpenExpand(p => ({ ...p, [key]: !p[key] })), []);

  const selectQuiz = (i) => {
    if (quizAnswered) return;
    setQuizSelected(i);
    setQuizAnswered(true);
    const correct = i === QUIZ_DATA[quizIdx].ans;
    setQuizResults(p => [...p, correct]);
    if (correct) setScore(s => s + 1);
  };

  const nextQuiz = () => {
    if (quizIdx + 1 >= QUIZ_DATA.length) {
      setQuizDone(true);
    } else {
      setQuizIdx(i => i + 1);
      setQuizSelected(null);
      setQuizAnswered(false);
    }
  };

  const retryQuiz = () => {
    setQuizIdx(0); setQuizSelected(null); setQuizAnswered(false);
    setQuizResults([]); setQuizDone(false); setScore(0);
  };

  function renderVerseText(text) {
    const parts = text.split(/(\b\d+\s)/);
    return parts.map((part, i) => {
      if (/^\d+\s$/.test(part)) {
        return <span key={i} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: ".55rem", color: "var(--acc2)", verticalAlign: "super", opacity: .8, marginRight: "2px" }}>{part.trim()}</span>;
      }
      return part ? <span key={i}>{part}</span> : null;
    });
  }

  const TABS = [
    { id: "inicio",    label: "Inicio",    Icon: Home },
    { id: "velo",      label: "Velo",      Icon: DoorOpen },
    { id: "palabras",  label: "Palabras",  Icon: Users },
    { id: "cumplido",  label: "Cumplido",  Icon: Crown },
    { id: "sepulcro",  label: "Sepulcro",  Icon: Moon },
    { id: "biblia",    label: "Biblia",    Icon: BookOpen },
    { id: "quiz",      label: "Quiz",      Icon: HelpCircle },
    { id: "cierre",    label: "Cierre",    Icon: Flame },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="scroll-area" ref={scrollRef}>
          <div className="hero" onClick={handleHeroTap}>
            <div className="hero-glow" />
            <div className="hero-brand">
              <span className="hero-dot" />
              InVerso · Semana 11
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              La muerte <em>y la sepultura</em>
            </h1>
            <div className="hero-ref">Juan 19:25-42 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"   && <TabInicio teacherMode={teacherMode} />}
            {tab === "velo"     && <TabVelo openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "palabras" && <TabPalabras openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "cumplido" && <TabCumplido openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "sepulcro" && <TabSepulcro openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "biblia"   && <TabBiblia openVerses={openVerses} toggle={toggleVerse} renderVerseText={renderVerseText} />}
            {tab === "quiz"     && (
              <TabQuiz
                quizIdx={quizIdx} quizSelected={quizSelected}
                quizAnswered={quizAnswered} quizResults={quizResults}
                quizDone={quizDone} score={score}
                selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz}
              />
            )}
            {tab === "cierre"   && <TabCierre />}
          </div>
        </div>

        <nav className="nav">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={tab === id ? "on" : ""} onClick={() => switchTab(id)}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
