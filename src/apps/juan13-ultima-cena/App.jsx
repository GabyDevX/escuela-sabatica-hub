import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Heart, Users, Search
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#100608;--bg2:#1c0a0d;--bg3:#2a1013;--surf:#2e1216;--surf2:#3c1a1f;--brd:#4a1f26;--brd2:#6a2e38;--tx:#f5e8ea;--tx2:#cfa8ae;--tx3:#8f6068;--acc:#a13544;--acc2:#d9536a;--acc3:#f0a3b2;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#e0a83c;--warn-d:rgba(224,168,60,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#22090d 0%,#1c0a0d 55%,#100608 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(161,53,68,.20) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(161,53,68,.25);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(161,53,68,.05)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(161,53,68,.32) 30%,rgba(161,53,68,.32) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:40px;min-height:56px;padding:.6rem .2rem .5rem;font-size:.42rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:18px;height:18px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(161,53,68,.10);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(161,53,68,.14);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(224,168,60,.16);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(161,53,68,.04)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(161,53,68,.16);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(161,53,68,.09),rgba(161,53,68,.02));border:1px solid rgba(161,53,68,.20);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(161,53,68,.07);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(161,53,68,.12),rgba(161,53,68,.03));border:1px solid rgba(161,53,68,.25);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.honey-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.honey-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.honey-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}
.guide-banner{background:linear-gradient(135deg,rgba(224,168,60,.10),rgba(224,168,60,.02));border:1px solid rgba(224,168,60,.22);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(224,168,60,.14);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
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
.vida-card{background:linear-gradient(135deg,rgba(161,53,68,.12),rgba(161,53,68,.03));border:1.5px solid rgba(161,53,68,.28);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}
.key-list{list-style:none;padding:0;margin-bottom:.85rem}
.key-list li{display:flex;gap:.7rem;align-items:flex-start;padding:.6rem 0;border-bottom:1px solid var(--brd)}
.key-list li:last-child{border-bottom:none}
.key-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:.55rem}
.key-text{font-size:.97rem;line-height:1.6;color:var(--tx2)}
.key-text strong{color:var(--tx)}
.xref-table{margin-bottom:.9rem}
.xref-group-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);padding:0 .1rem .55rem}
.xref-row{display:flex;gap:.7rem;align-items:flex-start;background:var(--surf);border:1px solid var(--brd);border-radius:12px;padding:.75rem .9rem;margin-bottom:.5rem}
.xref-ref{font-family:'IBM Plex Mono',monospace;font-size:.68rem;color:var(--acc2);white-space:nowrap;padding-top:.15rem;min-width:92px}
.xref-desc{font-size:.92rem;line-height:1.5;color:var(--tx2)}
.discuss-block{margin-bottom:1.1rem}
.discuss-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--tx);margin-bottom:.55rem}
.discuss-q{display:flex;gap:.6rem;align-items:flex-start;padding:.55rem 0;border-bottom:1px solid var(--brd)}
.discuss-q:last-child{border-bottom:none}
.discuss-num{font-family:'IBM Plex Mono',monospace;font-size:.68rem;color:var(--acc2);flex-shrink:0;padding-top:.15rem}
.discuss-text{font-size:.94rem;line-height:1.55;color:var(--tx2)}
.discuss-ref{color:var(--tx3);font-size:.86rem}
.discuss-personal{background:rgba(161,53,68,.06);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: La jarra y la toalla", desc: "Compartir la ilustración de la intro: una noche de estudio bíblico en la que unos jóvenes amigos, sin previo aviso, lavaron los pies de todos los presentes. Conectar con la pregunta: ¿Qué está pasando aquí? tal como debieron sentirla los discípulos en el aposento alto." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración. Orar pidiendo un corazón dispuesto a servir, incluso cuando eso resulte incómodo o humillante." },
  { time: "05–12 min", title: "Tab Interioriza — Juan 13:1-5, 21-30", desc: "Desarrollar el contraste entre el amor de Jesús 'hasta el fin' y la traición de Judas. Énfasis: Jesús lavó también los pies de Judas, sabiendo lo que haría. Preguntar: ¿hasta dónde llega el amor de Jesús?" },
  { time: "12–20 min", title: "Tab Interpreta — Juan 13:6-11, 36-38; Lucas 22:31-34", desc: "Trabajar la protesta de Pedro ante el lavamiento y la predicción de su negación. Énfasis: Jesús conocía a Pedro mejor que él mismo, y aun así oró por él y le prometió un lugar junto a él (Juan 14:1-3)." },
  { time: "20–25 min", title: "Tab Investiga — referencias cruzadas", desc: "Repasar los relatos paralelos (Mateo 26, Marcos 14, Lucas 22), las profecías de traición (Salmo 41:9; Zacarías 13:7) y el cumplimiento de la Pascua en Cristo (1 Corintios 5:7)." },
  { time: "25–28 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Detenerse en la pregunta sobre el nuevo mandamiento (Juan 13:34) y en la promesa de Jesús a Pedro (Lucas 22:32)." },
  { time: "28–30 min", title: "Cierre e inQuiere", desc: "Usar las tres secciones de discusión del tab Cierre: Un sirviente, Traicionado y rechazado, y Un nuevo recuerdo. Cerrar con la cita de Elena G. de White sobre el líder servidor y las 'Ideas clave para recordar'." },
];

const INTERIORIZA_DATA = [
  {
    key: "in1", badge: "Juan 13:1",
    name: "1. Los amó hasta el fin",
    body: "«Él siempre había amado a los suyos que estaban en el mundo, y así los amó hasta el fin». Esta declaración es asombrosa si consideramos lo que sigue: Judas lo traiciona, pero Jesús lo sigue amando hasta el fin. Pedro lo niega, los discípulos huyen, los líderes y el pueblo lo crucifican, y aun así Jesús continúa amándolos hasta el fin."
  },
  {
    key: "in2", badge: "Juan 13:2-5",
    name: "2. El lavamiento, un acto deliberado",
    body: "Aunque sabía que tenía más autoridad que todos los reyes de la tierra juntos, y que el destino del mundo estaba en sus manos, Jesús decidió lavar los pies de sus discípulos, incluidos los de Judas. No fue una improvisación: nadie más estaba dispuesto a humillarse y tomar el lugar del siervo, así que él mismo se quitó la túnica y se ciñó con una toalla."
  },
  {
    key: "in3", badge: "Juan 13:21-27",
    name: "3. Una decisión que se repite",
    body: "Jesús declaró abiertamente que uno de ellos lo traicionaría, e identificó a Judas dándole el pan mojado, el gesto de honor reservado para el invitado más querido en la mesa. Aun en ese último instante, le ofreció una salida. Judas decidió, una vez más, seguir adelante con su traición: «Después del bocado, Satanás entró en él»."
  },
  {
    key: "in4", badge: "Juan 13, en conjunto",
    name: "4. El contraste central del capítulo",
    body: "Juan alude a la traición de Judas al menos quince veces en este capítulo: es un punto de inflexión decisivo. Pero el tema crucial no es la traición en sí, sino el contraste entre la cruenta decisión de Judas y la respuesta de Jesús, que se humilló y lo sirvió de todos modos. Ese amor desinteresado es la razón por la que Jesús vino a la tierra."
  },
];

const INTERPRETA_DATA = [
  {
    key: "it1", badge: "Juan 13:6-8",
    name: "1. Pedro protesta",
    body: "Cuando le llegó el turno, Pedro se negó rotundamente a que Jesús le lavara los pies. Su personalidad impetuosa e impulsiva salió a relucir: no podía concebir a su Maestro arrodillado como un siervo. Jesús le respondió con firmeza: «Si no te lavo, no podrás ser de los míos»."
  },
  {
    key: "it2", badge: "Juan 13:9-11",
    name: "2. Un cambio radical de postura",
    body: "Ante esa advertencia, Pedro no solo cedió, sino que pidió más: «¡Entonces, Señor, no me laves solamente los pies, sino también las manos y la cabeza!». Jesús, incluso con cierto humor, mantuvo su intención original: solo necesitaba lavarle los pies, porque el resto ya estaba limpio."
  },
  {
    key: "it3", badge: "Lucas 22:31, 32",
    name: "3. 'Simón, Simón...'",
    body: "Más tarde, durante la fiesta, Jesús le advirtió con ternura: «Satanás los ha pedido a ustedes para sacudirlos como si fueran trigo; pero yo he rogado por ti, para que no te falte la fe». Pedro protestó de nuevo, declarando que estaba dispuesto a morir por Jesús."
  },
  {
    key: "it4", badge: "Juan 13:36-38; 14:1-3",
    name: "4. La predicción y la promesa",
    body: "Jesús le advirtió a Pedro que lo negaría tres veces antes del amanecer; conocía a Pedro mejor que él se conocía a sí mismo. Sin embargo, inmediatamente después le dijo: «No se angustien ustedes... Voy a prepararles un lugar». En contexto, Pedro fue el primero en recibir esa hermosa promesa."
  },
];

const XREF_PARALELOS = [
  { ref: "Mateo 26:14-35", desc: "Relato paralelo de la última cena, la institución de la Cena del Señor y la predicción de la negación de Pedro." },
  { ref: "Marcos 14:10-31", desc: "Otro relato del aposento alto, con el mismo desenlace: Judas se ausenta para negociar la entrega de Jesús." },
  { ref: "Lucas 22:13-34", desc: "Incluye el diálogo único entre Jesús y Simón Pedro sobre la petición de Satanás y la oración de Cristo por él." },
];

const XREF_PROFECIAS = [
  { ref: "Salmo 41:9", desc: "«Aun el hombre de mi paz, en quien yo confiaba, el que de mi pan comía, alzó contra mí el calcañar». Profecía directa de la traición de Judas." },
  { ref: "Salmo 55:12-14", desc: "David lamenta la traición de un amigo cercano con quien compartía dulce comunión, anticipando lo que Jesús sufriría con Judas." },
  { ref: "Zacarías 13:7", desc: "«Hiere al pastor, y serán dispersadas las ovejas». Anuncia que los discípulos huirían al ser arrestado su Maestro." },
];

const XREF_PASCUA = [
  { ref: "1 Corintios 5:7", desc: "«Porque nuestra pascua, que es Cristo, ya fue sacrificada por nosotros». El Cordero pascual del Antiguo Testamento se cumple en Jesús." },
  { ref: "1 Pedro 1:19", desc: "Fuimos rescatados «con la sangre preciosa de Cristo, como de un cordero sin mancha y sin contaminación»." },
];

const VERSES = [
  {
    ref: "Juan 13:1-17", isBase: true,
    text: `1 Antes de la fiesta de la pascua, sabiendo Jesús que su hora había llegado para que pasase de este mundo al Padre, como había amado a los suyos que estaban en el mundo, los amó hasta el fin. 2 Y cuando cenaban, como el diablo ya había puesto en el corazón de Judas Iscariote, hijo de Simón, que le entregase, 3 sabiendo Jesús que el Padre le había dado todas las cosas en las manos, y que había salido de Dios, y a Dios iba, 4 se levantó de la cena, y se quitó su manto, y tomando una toalla, se la ciñó. 5 Luego puso agua en un lebrillo, y comenzó a lavar los pies de los discípulos, y a enjugarlos con la toalla con que estaba ceñido. 6 Entonces vino a Simón Pedro; y Pedro le dijo: Señor, ¿tú me lavas los pies? 7 Respondió Jesús y le dijo: Lo que yo hago, tú no lo comprendes ahora; mas lo entenderás después. 8 Pedro le dijo: No me lavarás los pies jamás. Jesús le respondió: Si no te lavare, no tendrás parte conmigo. 9 Le dijo Simón Pedro: Señor, no solo mis pies, sino también las manos y la cabeza. 10 Jesús le dijo: El que está lavado, no necesita sino lavarse los pies, pues está todo limpio; y vosotros limpios estáis, aunque no todos. 11 Porque sabía quién le iba a entregar; por eso dijo: No estáis limpios todos. 12 Así que, después que les hubo lavado los pies, tomó su manto, volvió a la mesa, y les dijo: ¿Sabéis lo que os he hecho? 13 Vosotros me llamáis Maestro, y Señor; y decís bien, porque lo soy. 14 Pues si yo, el Señor y el Maestro, he lavado vuestros pies, vosotros también debéis lavaros los pies los unos a los otros. 15 Porque ejemplo os he dado, para que como yo os he hecho, vosotros también hagáis. 16 De cierto, de cierto os digo: El siervo no es mayor que su señor, ni el enviado es mayor que el que le envió. 17 Si sabéis estas cosas, bienaventurados seréis si las hiciereis.`
  },
  {
    ref: "Juan 13:21-30",
    text: `21 Habiendo dicho Jesús esto, se conmovió en espíritu, y declaró y dijo: De cierto, de cierto os digo, que uno de vosotros me va a entregar. 22 Entonces los discípulos se miraban unos a otros, dudando de quién hablaba. 23 Y uno de sus discípulos, al cual Jesús amaba, estaba recostado al lado de Jesús. 24 A este, pues, hizo señas Simón Pedro, para que preguntase quién era aquel de quien hablaba. 25 Él entonces, recostado cerca del pecho de Jesús, le dijo: Señor, ¿quién es? 26 Respondió Jesús: A quien yo diere el pan mojado, aquel es. Y mojando el pan, lo dio a Judas Iscariote hijo de Simón. 27 Y después del bocado, Satanás entró en él. Entonces Jesús le dijo: Lo que vas a hacer, hazlo más pronto. 28 Pero ninguno de los que estaban a la mesa entendió por qué le dijo esto. 29 Porque algunos pensaban, puesto que Judas tenía la bolsa, que Jesús le decía: Compra lo que necesitamos para la fiesta; o que diese algo a los pobres. 30 Cuando él, pues, hubo tomado el bocado, luego salió; y era ya de noche.`
  },
  {
    ref: "Juan 13:31-35",
    text: `31 Entonces, cuando hubo salido, dijo Jesús: Ahora es glorificado el Hijo del Hombre, y Dios es glorificado en él. 34 Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado, que también os améis unos a otros. 35 En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros.`
  },
  {
    ref: "Juan 13:36-38",
    text: `36 Le dijo Simón Pedro: Señor, ¿a dónde vas? Jesús le respondió: A donde yo voy, no me puedes seguir ahora; mas me seguirás después. 37 Le dijo Pedro: Señor, ¿por qué no te puedo seguir ahora? Mi vida pondré por ti. 38 Jesús le respondió: ¿Tu vida pondrás por mí? De cierto, de cierto te digo: No cantará el gallo, sin que me hayas negado tres veces.`
  },
  {
    ref: "Lucas 22:31, 32",
    text: `31 Dijo también el Señor: Simón, Simón, he aquí Satanás os ha pedido para zarandearos como a trigo; 32 pero yo he rogado por ti, que tu fe no falte; y tú, una vez vuelto, confirma a tus hermanos.`
  },
  {
    ref: "Marcos 14:12-16",
    text: `12 El primer día de la fiesta de los panes sin levadura, cuando sacrificaban el cordero de la pascua, sus discípulos le dijeron: ¿Dónde quieres que vayamos a preparar para que comas la pascua? 13 Y envió dos de sus discípulos, y les dijo: Id a la ciudad, y os saldrá al encuentro un hombre que lleva un cántaro de agua; seguidle, 14 y donde entrare, decid al señor de la casa: El Maestro dice: ¿Dónde está el aposento donde he de comer la pascua con mis discípulos? 15 Y él os mostrará un gran aposento alto ya dispuesto; preparad para nosotros allí. 16 Fueron sus discípulos y llegaron a la ciudad, y hallaron como les había dicho; y prepararon la pascua.`
  },
  {
    ref: "1 Corintios 11:23-26",
    text: `23 Porque yo recibí del Señor lo que también os he enseñado: Que el Señor Jesús, la noche que fue entregado, tomó pan; 24 y habiendo dado gracias, lo partió, y dijo: Tomad, comed; esto es mi cuerpo que por vosotros es partido; haced esto en memoria de mí. 25 Asimismo tomó también la copa, después de haber cenado, diciendo: Esta copa es el nuevo pacto en mi sangre; haced esto todas las veces que la bebiereis, en memoria de mí. 26 Porque todas las veces que comiereis este pan, y bebiereis esta copa, la muerte del Señor anunciáis hasta que él venga.`
  },
  {
    ref: "1 Corintios 5:7",
    text: `Limpiaos, pues, de la vieja levadura, para que seáis nueva masa, sin levadura como sois; porque nuestra pascua, que es Cristo, ya fue sacrificada por nosotros.`
  },
  {
    ref: "Salmo 41:9",
    text: `Aun el hombre de mi paz, en quien yo confiaba, el que de mi pan comía, alzó contra mí el calcañar.`
  },
  {
    ref: "Zacarías 13:7",
    text: `Levántate, oh espada, contra el pastor, y contra el hombre compañero mío, dice Jehová de los ejércitos. Hiere al pastor, y serán dispersadas las ovejas; y volveré mi mano contra los pequeñitos.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Qué hizo Jesús después de levantarse de la cena, al ver que ninguno de los discípulos se ofrecía a lavar los pies? (Juan 13:4, 5)",
    opts: [
      "Pidió a un siervo que lo hiciera",
      "Se quitó el manto, se ciñó con una toalla y lavó los pies de los discípulos",
      "Reprendió a los discípulos y canceló la cena",
      "Esperó hasta el día siguiente para hacerlo"
    ],
    ans: 1,
    feedback: "«Se levantó de la cena, y se quitó su manto, y tomando una toalla, se la ciñó... y comenzó a lavar los pies de los discípulos» (Juan 13:4, 5). Nadie quiso humillarse, así que Jesús mismo tomó el lugar del siervo."
  },
  {
    q: "¿Qué le dijo Jesús a Pedro cuando este se negó a que le lavara los pies? (Juan 13:8)",
    opts: [
      "«Está bien, no es necesario»",
      "«Si no te lavare, no tendrás parte conmigo»",
      "«Entonces lávate tú mismo»",
      "«Eso lo decidirán los demás discípulos»"
    ],
    ans: 1,
    feedback: "Jesús le respondió: «Si no te lavare, no tendrás parte conmigo» (Juan 13:8). El lavamiento representaba la necesidad de Pedro —y de todos nosotros— de purificación continua."
  },
  {
    q: "¿Cómo identificó Jesús a quien lo iba a entregar? (Juan 13:26)",
    opts: [
      "Señalándolo directamente ante todos",
      "Dándole el pan mojado, el gesto reservado al invitado de honor",
      "Pidiéndole a Pedro que lo delatara",
      "Anunciando su nombre completo en voz alta"
    ],
    ans: 1,
    feedback: "«A quien yo diere el pan mojado, aquel es. Y mojando el pan, lo dio a Judas Iscariote» (Juan 13:26). Fue un último gesto de honor y de amor hacia quien lo traicionaría."
  },
  {
    q: "¿Qué le dijo Jesús a Judas inmediatamente después de darle el pan? (Juan 13:27)",
    opts: [
      "«Lo que vas a hacer, hazlo más pronto»",
      "«Todavía puedes arrepentirte»",
      "«Avisaré a los demás de tu plan»",
      "«Quédate aquí conmigo esta noche»"
    ],
    ans: 0,
    feedback: "«Lo que vas a hacer, hazlo más pronto» (Juan 13:27). Aun sabiendo lo que Judas haría, Jesús no lo expuso públicamente ni lo detuvo por la fuerza; respetó su decisión."
  },
  {
    q: "¿Cuál es el nuevo mandamiento que Jesús dio a sus discípulos? (Juan 13:34)",
    opts: [
      "Amarse unos a otros, como él los había amado",
      "Guardar el sábado con mayor rigor",
      "Predicar el evangelio a toda nación",
      "Obedecer a los líderes religiosos"
    ],
    ans: 0,
    feedback: "«Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado» (Juan 13:34). No era nuevo el mandamiento de amar, sino la medida: como Cristo nos amó."
  },
  {
    q: "¿Qué le predijo Jesús a Pedro que sucedería esa misma noche? (Juan 13:38)",
    opts: [
      "Que sería el líder de los demás discípulos",
      "Que lo negaría tres veces antes de que cantara el gallo",
      "Que sería arrestado en su lugar",
      "Que huiría a Galilea de inmediato"
    ],
    ans: 1,
    feedback: "«No cantará el gallo, sin que me hayas negado tres veces» (Juan 13:38). Jesús conocía a Pedro mejor de lo que Pedro se conocía a sí mismo."
  },
  {
    q: "Según Lucas 22:31, 32, ¿qué le aseguró Jesús a Simón Pedro?",
    opts: [
      "Que nunca sería tentado por Satanás",
      "Que había rogado por él, para que su fe no faltara",
      "Que sería excluido del grupo de los doce",
      "Que debía abandonar el liderazgo del grupo"
    ],
    ans: 1,
    feedback: "«Yo he rogado por ti, para que no te falte la fe. Y tú, cuando te hayas vuelto a mí, ayuda a tus hermanos a permanecer firmes» (Lucas 22:32). Jesús ya preveía la caída y la restauración de Pedro."
  },
  {
    q: "¿Qué símbolos estableció Jesús en el aposento alto, y qué representan? (1 Corintios 11:24, 25)",
    opts: [
      "El agua y la toalla, símbolos del servicio",
      "El pan y la copa, que representan su cuerpo partido y su sangre derramada",
      "El aceite y el incienso, símbolos del sacerdocio",
      "El cordero y las hierbas amargas, símbolos del éxodo"
    ],
    ans: 1,
    feedback: "«Esto es mi cuerpo que por vosotros es partido... Esta copa es el nuevo pacto en mi sangre» (1 Corintios 11:24, 25). La Cena del Señor sustituyó a la cena de la Pascua del Antiguo Testamento."
  },
];

const DISCUSS_SIERVO = [
  { n: 1, text: "¿Hasta dónde llega el amor de Jesús?", ref: "Juan 13:1" },
  { n: 2, text: "Muchos líderes jamás aceptarían el papel de siervo por orgullo o inseguridad, pero ¿qué hacía a Jesús diferente?", ref: "Juan 13:1-5" },
  { n: 3, text: "¿Por qué crees que Pedro se sorprendió y se resistió a que Jesús le lavara los pies?", ref: "Juan 13:6-11" },
  { n: 4, text: "¿Cuál es el significado del lavado de pies y por qué debemos lavarnos los pies unos a otros?", ref: "Juan 13:12-17" },
];

const DISCUSS_TRAICIONADO = [
  { n: 1, text: "¿Por qué era importante para Jesús identificar a su traidor? ¿Cómo demostró su amor a Judas e intentó salvarlo?", ref: "Juan 13:18-30" },
  { n: 2, text: "¿Cómo demostró Jesús que conocía y amaba a Pedro?", ref: "Juan 13:36–14:4" },
  { n: 3, text: "¿Cómo intentó Jesús ayudar a Pedro? ¿Cómo podemos evitar sobreestimarnos a nosotros mismos?", ref: "Lucas 22:31-34" },
];

const DISCUSS_RECUERDO = [
  { n: 1, text: "¿Qué nueva práctica estableció Jesús para que la siguieran todos los cristianos?", ref: "Juan 13:14, 15; 1 Corintios 11:25, 26" },
  { n: 2, text: "¿De qué manera Jesús cumplió los símbolos de la Pascua del Antiguo Testamento?", ref: "1 Corintios 5:7" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Alguna vez has experimentado un profundo convencimiento al tener que elegir entre rendirte a Dios o hacer lo que tú querías? ¿Cómo respondiste, y qué cambiarías si pudieras?", ref: "Juan 13:2-11" },
  { key: "rfl2", q: "¿En qué se diferencia el amor de Dios del amor humano?", ref: "Juan 13:1, 34, 35" },
  { key: "rfl3", q: "¿De qué manera la historia de Pedro te ayuda a comprender más profundamente el amor inquebrantable de Dios?", ref: "Juan 13:36-38; Lucas 22:31, 32" },
  { key: "rfl4", q: "Pedro se arrepintió y maduró; Judas se quitó la vida, consumido por la vergüenza y el remordimiento. ¿Qué determina el rumbo que tomará nuestra vida?", ref: "Juan 13:21-30, 36-38" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">La última <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>cena</em></div>
      <div className="sec-sub">Segunda Semana · Juan 13 · Las escenas finales</div>

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
            <div className="card-label">Intro de la semana</div>
            <p>Poco después de graduarse de la secundaria, unos amigos invitaron a alguien a un estudio bíblico semanal. Una noche, dos de ellos salieron de la habitación y volvieron con una jarra de agua y una toalla. ¿Qué está pasando aquí?, pensó. Entonces contaron lo que Jesús hizo en Juan 13, y comenzaron a lavar los pies de todos, uno por uno. Fue humillante y, a la vez, profundamente conmovedor: la presencia de Dios se sintió en esa habitación.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Juan 13:34
            </div>
            <div className="honey-text">
              «Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado, que también os améis unos a otros.»
            </div>
            <div className="honey-ref">Juan 13:34 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Jesús amó verdaderamente a Judas</strong> hasta el final. Le lavó los pies y le dio oportunidades para cambiar de rumbo, pero Judas se endureció ante ese amor.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Jesús predijo la negación de Pedro,</strong> pero también le ratificó su amor. Pedro finalmente se arrepintió y salió fortalecido de su fracaso.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Jesús nos conoce mejor que nadie</strong> y, sin embargo, nos ama más que cualquiera en el mundo.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabInterioriza({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Interioriza</div>
      <div className="sec-sub">Uno de ustedes me traicionará</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>Las escenas finales de la vida de Cristo revelan el amor profundo e inquebrantable que Dios siente por nosotros. Judas lo traiciona, Pedro lo niega, todos huyen, los líderes lo crucifican... y aun así, Jesús continúa amándolos hasta el fin.</p>
      </div>

      {INTERIORIZA_DATA.map(item => (
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
      ))}

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>¿Alguna vez has experimentado un profundo convencimiento al tener que elegir entre rendirte a Dios o hacer lo que tú querías? ¿En qué se diferencia el amor de Dios del amor humano?</p>
      </div>
    </>
  );
}

function TabInterpreta({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Interpreta</div>
      <div className="sec-sub">He orado por ti — Pedro en el aposento alto</div>

      {INTERPRETA_DATA.map(item => (
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
      ))}

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>A menudo ocultamos nuestros problemas por temor a que la gente deje de querernos. La belleza de Cristo es que nos conoce plenamente y aun así nos ama por completo. ¿De qué manera la historia de Pedro te ayuda a comprender más profundamente ese amor inquebrantable?</p>
      </div>
    </>
  );
}

function TabInvestiga() {
  return (
    <>
      <div className="sec-title">Investiga</div>
      <div className="sec-sub">Referencias cruzadas para profundizar</div>

      <div className="xref-table">
        <div className="xref-group-label">Relatos paralelos</div>
        {XREF_PARALELOS.map((x, i) => (
          <div key={i} className="xref-row">
            <div className="xref-ref">{x.ref}</div>
            <div className="xref-desc">{x.desc}</div>
          </div>
        ))}
      </div>

      <div className="xref-table">
        <div className="xref-group-label">Profecías de traición y abandono</div>
        {XREF_PROFECIAS.map((x, i) => (
          <div key={i} className="xref-row">
            <div className="xref-ref">{x.ref}</div>
            <div className="xref-desc">{x.desc}</div>
          </div>
        ))}
      </div>

      <div className="xref-table">
        <div className="xref-group-label">El cumplimiento de la Pascua</div>
        {XREF_PASCUA.map((x, i) => (
          <div key={i} className="xref-row">
            <div className="xref-ref">{x.ref}</div>
            <div className="xref-desc">{x.desc}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)" }}>
        <div className="card-label">Para pensar</div>
        <p>¿Qué otros versículos o promesas te vienen a la mente en relación con Juan 13? Repasa el pasaje que hayas memorizado de este capítulo.</p>
      </div>
    </>
  );
}

function TabBiblia({ openVerses, toggle, renderVerseText }) {
  return (
    <>
      <div className="sec-title">Biblia</div>
      <div className="sec-sub">{VERSES.length} versículos · RVR1960 · Tocá para expandir</div>

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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien lo que ocurrió en el aposento alto." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre la última cena de Jesús con sus discípulos." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Juan 13." :
                "Vale la pena releer el capítulo. Es clave para entender el amor de Jesús hasta el fin.";
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
      <div className="sec-sub">inVita · imPlícate · inQuiere</div>

      <div className="card">
        <div className="card-label">Una nueva era</div>
        <p>La Pascua celebraba la liberación de Israel de Egipto; el cordero pascual prometía esa liberación, cumplida en Jesús (1 Corintios 5:7). En el aposento alto, Jesús estableció el pan y el vino como símbolos de su cuerpo quebrantado y su sangre derramada. La Cena del Señor sustituyó a la cena de Pascua, para ayudarnos a comprender su sacrificio y lo que estamos llamados a hacer en respuesta: «Hagan esto en memoria de mí todas las veces que la beban» (1 Corintios 11:25).</p>
        <br />
        <p>Cuando Judas se fue, Jesús dio a sus discípulos un mandamiento nuevo —en realidad, el más antiguo de todos—: amarse los unos a los otros «como yo los amo a ustedes» (Juan 13:34). Ese pequeño detalle final lo cambia todo. Si Jesús no vive en nosotros, no podemos amar a los demás como él nos amó; pero él también nos da la fuerza para hacerlo.</p>
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Cuándo será la próxima vez que tu iglesia celebre la comunión? ¿Cómo puedes ayudar a que sea una mejor experiencia para tus amigos?</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 71, pp. 614-616</div>
        <div className="egw-text">«Era costumbre... que un criado lavara los pies de los huéspedes... pero no había siervo presente, y les tocaba a los discípulos cumplirlo. Pero cada uno... resolvió no desempeñar el papel de siervo. [...] <strong>Jesús aguardó un rato para ver lo que iban a hacer. Luego él, el Maestro divino, se levantó de la mesa</strong>... tomó una toalla y se ciñó... Esta acción abrió los ojos de los discípulos. [...] Tenía plena conciencia de su divinidad; pero había puesto a un lado su corona y vestiduras reales, y había tomado forma de siervo.»</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Un sirviente</div>
        {DISCUSS_SIERVO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Cuál ha sido tu experiencia con el lavado de pies? ¿Te parece significativo, incómodo o ambas cosas? Comparte la forma positiva en que te ha influido.</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Traicionado y rechazado</div>
        {DISCUSS_TRAICIONADO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> Pedro se arrepintió y maduró; Judas se quitó la vida, consumido por la vergüenza y el remordimiento. ¿Qué determina el rumbo que tomará nuestra vida?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Un nuevo recuerdo</div>
        {DISCUSS_RECUERDO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
      </div>

      {REFLEXIONES.map((r, i) => (
        <div key={r.key} className="reflex-card">
          <div className="reflex-num">{i + 1}</div>
          <div className="reflex-body">
            <div className="reflex-q">{r.q}</div>
            <div className="reflex-ref">{r.ref}</div>
          </div>
        </div>
      ))}

      <div className="card">
        <div className="card-label">Ideas clave para recordar</div>
        <ul className="key-list">
          <li>
            <span className="key-dot" />
            <span className="key-text"><strong>Jesús amó verdaderamente a Judas</strong> hasta el final. Le lavó los pies y le dio oportunidades para cambiar de rumbo, pero Judas se endureció ante el amor de Cristo.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text"><strong>Jesús predijo la negación de Pedro,</strong> pero también le ratificó su amor. Pedro finalmente se arrepintió y salió fortalecido de su fracaso.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text"><strong>Jesús nos conoce mejor que nadie</strong> y, sin embargo, nos ama más que cualquiera en el mundo.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Los discípulos habían preparado una mesa, pero habían olvidado preparar sus corazones. Cuando Jesús les lavó los pies, quiso convencerlos de su propia necesidad de purificación y humildad, dándoles una ilustración práctica de todo lo que les había enseñado.</p>
          <br />
          <p><strong>Cualquier cosa que Cristo nos pida, también está dispuesto a darnos la fuerza para hacerla.</strong> «Cualquier cosa que debe hacerse por orden suya, puede llevarse a cabo con su fuerza. Todos sus mandatos son habilitaciones» (Elena G. de White).</p>
          <br />
          <p>Jesús nos conoce plenamente —cada uno de nuestros pecados— y aun así su deseo de estar con nosotros permanece inalterable. <strong>Nos promete un hogar a pesar de todo.</strong></p>
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
    { id: "inicio",       label: "Inicio",       Icon: Home },
    { id: "interioriza",  label: "Interioriza",  Icon: Users },
    { id: "interpreta",   label: "Interpreta",   Icon: Heart },
    { id: "investiga",    label: "Investiga",    Icon: Search },
    { id: "biblia",       label: "Biblia",       Icon: BookOpen },
    { id: "quiz",         label: "Quiz",         Icon: HelpCircle },
    { id: "cierre",       label: "Cierre",       Icon: Flame },
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
              InVerso · Semana 2
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              La última <em>cena</em>
            </h1>
            <div className="hero-ref">Juan 13 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"       && <TabInicio teacherMode={teacherMode} />}
            {tab === "interioriza"  && <TabInterioriza openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "interpreta"   && <TabInterpreta openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "investiga"    && <TabInvestiga />}
            {tab === "biblia"       && <TabBiblia openVerses={openVerses} toggle={toggleVerse} renderVerseText={renderVerseText} />}
            {tab === "quiz"         && (
              <TabQuiz
                quizIdx={quizIdx} quizSelected={quizSelected}
                quizAnswered={quizAnswered} quizResults={quizResults}
                quizDone={quizDone} score={score}
                selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz}
              />
            )}
            {tab === "cierre"       && <TabCierre />}
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
