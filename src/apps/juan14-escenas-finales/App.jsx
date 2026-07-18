import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Heart, Users, Search, Sparkles
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#06070f;--bg2:#0b0d1d;--bg3:#131532;--surf:#161938;--surf2:#1f2348;--brd:#262b52;--brd2:#363c78;--tx:#e9eaf7;--tx2:#a3a8ce;--tx3:#63699a;--acc:#5468c4;--acc2:#7d8ede;--acc3:#c2caf0;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#e0a83c;--warn-d:rgba(224,168,60,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#0d1130 0%,#0b0d1d 55%,#06070f 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(84,104,196,.22) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(84,104,196,.28);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(84,104,196,.06)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(84,104,196,.35) 30%,rgba(84,104,196,.35) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(84,104,196,.12);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(84,104,196,.16);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(224,168,60,.16);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(84,104,196,.05)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(84,104,196,.16);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(84,104,196,.10),rgba(84,104,196,.02));border:1px solid rgba(84,104,196,.22);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(84,104,196,.08);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(84,104,196,.14),rgba(84,104,196,.03));border:1px solid rgba(84,104,196,.28);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(84,104,196,.14),rgba(84,104,196,.03));border:1.5px solid rgba(84,104,196,.30);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(84,104,196,.07);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
.pair-card{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:.85rem}
.pair-cell{border-radius:12px;padding:.85rem .8rem;font-size:.9rem;line-height:1.5}
.pair-cell.joy{background:rgba(16,185,129,.09);border:1px solid rgba(16,185,129,.25);color:var(--tx2)}
.pair-cell.fear{background:rgba(244,63,94,.09);border:1px solid rgba(244,63,94,.25);color:var(--tx2)}
.pair-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:.4rem}
.pair-cell.joy .pair-tag{color:var(--ok)}
.pair-cell.fear .pair-tag{color:var(--err)}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: Poner las cosas en orden", desc: "Compartir brevemente la idea de la intro: cuando alguien sabe que su hora se acerca, procura dejar todo en orden para los que se quedan. Conectar con lo que Jesús hace en el aposento alto: prepara a sus discípulos para su partida." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración. Orar agradeciendo las promesas que Jesús deja a quienes ama antes de partir." },
  { time: "05–11 min", title: "Tab Interioriza — Juan 14:1-11, 23", desc: "Trabajar la tristeza de los discípulos ante la partida de Jesús y las promesas que él les da. Énfasis en Juan 14:9: 'el que me ha visto a mí, ha visto al Padre'." },
  { time: "11–17 min", title: "Tab Interpreta — Juan 14:15-17, 25, 26", desc: "Explicar el matiz de traducción de Juan 14:15 (no es una orden, sino una consecuencia natural del amor) y la promesa del Espíritu Santo como Consolador." },
  { time: "17–21 min", title: "Tab Investiga — referencias cruzadas", desc: "Repasar las promesas de la presencia de Dios (Deuteronomio 31:6, 8; Josué 1:5; Isaías 43:2; Hebreos 13:5) y del Espíritu (Ezequiel 36:24-27; Lucas 11:13; Hechos 5:32; 1 Juan 3:24)." },
  { time: "21–25 min", title: "Tab Boda — Juan 14:2, 3 y la Segunda Venida", desc: "Desarrollar la imagen de la boda para la Segunda Venida (Mateo 22:2; 25:1; Apocalipsis 19:7-9) y contrastar la alegría del pueblo de Dios (Isaías 25:8, 9) con el temor de los que rechazan a Cristo (Apocalipsis 6:15-17)." },
  { time: "25–28 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto, deteniéndose en la promesa del lugar preparado (Juan 14:2, 3) y en la paz que Jesús ofrece (Juan 14:27)." },
  { time: "28–30 min", title: "Cierre e inQuiere", desc: "Usar los tres bloques de discusión: La promesa de su regreso, La ayuda divina concedida, y Paz y fe. Cerrar con la cita de Elena G. de White sobre las obras 'todavía más grandes' y los 'Puntos clave para recordar'." },
];

const INTERIORIZA_DATA = [
  {
    key: "in1", badge: "Juan 14:1-3",
    name: "1. Una separación que no es definitiva",
    body: "Los discípulos habían compartido la vida entera con Jesús: viajaban, comían y trabajaban juntos. Les costaba muchísimo aceptar que se fuera. Por eso Jesús no minimizó su dolor, sino que lo enmarcó en una promesa: se iba a preparar un lugar para ellos, y volvería a buscarlos para que estuvieran donde él está. No era un adiós, sino un hasta luego."
  },
  {
    key: "in2", badge: "Juan 14:7, 9",
    name: "2. El que me ha visto a mí, ha visto al Padre",
    body: "Los discípulos, curiosos por saber a dónde iba Jesús, terminaron preguntando por el Padre. Jesús respondió con una de las verdades más importantes de todo el capítulo: 'El que me ha visto a mí, ha visto al Padre'. Muchos creen, sin darse cuenta, que Jesús es bondadoso mientras que el Padre es severo y exigente. Jesús insiste en que eso no es así: todo lo que él hace es exactamente lo que haría el Padre."
  },
  {
    key: "in3", badge: "Juan 14:13, 14",
    name: "3. Un Dios que quiere escuchar y responder",
    body: "En dos ocasiones seguidas, Jesús les aseguró a los discípulos que el Padre estaba deseoso de escuchar y responder sus oraciones. Quería corregir la idea de un Dios distante e indiferente. A través de Jesús, obtenemos acceso pleno y completo al Padre."
  },
  {
    key: "in4", badge: "Juan 14:23",
    name: "4. El deseo de morar con nosotros",
    body: "Jesús les dejó claro a los discípulos que anhelaba estar con ellos, y que tanto él como el Padre querían morar en ellos. Este mensaje era clave, porque estaban a punto de abandonarlo en su sufrimiento. En momentos de culpa solemos pensar que Jesús ya no quiere estar con nosotros; él se adelantó a ese fracaso con la promesa de su presencia constante."
  },
];

const INTERPRETA_DATA = [
  {
    key: "it1", badge: "Juan 14:15",
    name: "1. No es una orden, es una consecuencia",
    body: "«Si me aman, obedezcan mis mandamientos» puede sonar como un imperativo incómodo, casi una manipulación: 'si me quisieras, lo harías'. Pero en el idioma original la declaración de Jesús no es un mandato, sino una descripción: 'si me aman, obedecerán mis mandamientos'. La obediencia es el fruto natural del amor, no la condición para conseguirlo."
  },
  {
    key: "it2", badge: "Juan 14:16, 17",
    name: "2. El otro Consolador",
    body: "Jesús explica cómo los discípulos van a poder guardar sus mandamientos: 'Yo pediré al Padre y él les dará otro Consolador para que los acompañe siempre: el Espíritu de verdad'. Como amamos a Jesús, él ora para que el Padre nos envíe al Espíritu Santo, quien nos da el poder para amar a Dios y obedecerle."
  },
  {
    key: "it3", badge: "Juan 14:25, 26",
    name: "3. El Espíritu enseña y recuerda",
    body: "En su ausencia, el Espíritu Santo seguiría enseñando a los discípulos y les recordaría todo lo que Cristo les había enseñado. Es una promesa muy esperanzadora también para nosotros: leer y estudiar las Escrituras puede resultar abrumador, pero el Espíritu nos ayuda a comprender y recordar lo que más necesitamos."
  },
  {
    key: "it4", badge: "Juan 14, en conjunto",
    name: "4. La Trinidad obrando junta",
    body: "Estos versículos describen a las tres Personas de la Trinidad como participantes activos en nuestra salvación. Jesús, el Padre y el Espíritu Santo trabajan juntos para sacarnos del pecado y darnos el poder para vivir una nueva vida. Dios no establece un estándar alto y nos deja solos para alcanzarlo: nos da el poder para ponerlo en práctica."
  },
];

const INVESTIGA_PRESENCIA = [
  { key: "iv1", badge: "Deuteronomio 31:6", name: "Esforzaos y cobrad ánimo", body: "«Esforzaos y cobrad ánimo; no temáis, ni tengáis miedo de ellos; porque Jehová tu Dios es el que va contigo; no te dejará ni te desamparará» (Deuteronomio 31:6)." },
  { key: "iv2", badge: "Deuteronomio 31:8", name: "Él va delante de ti", body: "«Y Jehová va delante de ti; él estará contigo, no te dejará, ni te desamparará; no temas ni te intimides» (Deuteronomio 31:8)." },
  { key: "iv3", badge: "Josué 1:5", name: "Como estuve con Moisés", body: "«Nadie te podrá hacer frente en todos los días de tu vida; como estuve con Moisés, estaré contigo; no te dejaré, ni te desampararé» (Josué 1:5)." },
  { key: "iv4", badge: "Isaías 43:2; Hebreos 13:5", name: "En las aguas y en el fuego", body: "«Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán. Cuando pases por el fuego, no te quemarás, ni la llama arderá en ti» (Isaías 43:2). El autor de Hebreos repite la misma promesa siglos después: «Él dijo: No te desampararé, ni te dejaré» (Hebreos 13:5)." },
];

const INVESTIGA_ESPIRITU = [
  { key: "ie1", badge: "Ezequiel 36:24-27", name: "Corazón nuevo, Espíritu nuevo", body: "«Os daré corazón nuevo, y pondré espíritu nuevo dentro de vosotros... Y pondré dentro de vosotros mi Espíritu, y haré que andéis en mis estatutos» (Ezequiel 36:26, 27). Siglos antes de Juan 14, Dios ya prometía morar en su pueblo por medio de su Espíritu." },
  { key: "ie2", badge: "Lucas 11:13", name: "El Padre da el Espíritu a quien lo pide", body: "«Si vosotros, siendo malos, sabéis dar buenas dádivas a vuestros hijos, ¿cuánto más vuestro Padre celestial dará el Espíritu Santo a los que se lo pidan?» (Lucas 11:13)." },
  { key: "ie3", badge: "Hechos 5:32", name: "Testigo junto con nosotros", body: "«Y nosotros somos testigos suyos de estas cosas, y también el Espíritu Santo, el cual ha dado Dios a los que le obedecen» (Hechos 5:32). El Espíritu no solo nos acompaña: da testimonio con nosotros." },
  { key: "ie4", badge: "1 Juan 3:24", name: "La señal de que permanece en nosotros", body: "«El que guarda sus mandamientos, permanece en Dios, y Dios en él. Y en esto sabemos que él permanece en nosotros, por el Espíritu que nos ha dado» (1 Juan 3:24)." },
];

const BODA_DATA = [
  { key: "bd1", badge: "Mateo 9:15", name: "Jesús, el Esposo", body: "Jesús se refería a sí mismo como el Esposo: «¿Acaso pueden los que están de bodas tener luto entre tanto que el esposo está con ellos? Mas vendrán días cuando el esposo les será quitado» (Mateo 9:15). Con esta imagen, Jesús recalca la relación de amor entre él y su pueblo." },
  { key: "bd2", badge: "Mateo 22:2", name: "El banquete de bodas real", body: "«El reino de los cielos es semejante a un rey que hizo fiesta de bodas a su hijo» (Mateo 22:2). Jesús contó esta parábola para ilustrar los acontecimientos de la Segunda Venida." },
  { key: "bd3", badge: "Mateo 25:1", name: "Las diez vírgenes", body: "«Entonces el reino de los cielos será semejante a diez vírgenes que tomando sus lámparas, salieron a recibir al esposo» (Mateo 25:1). La espera y la preparación son el centro de esta parábola." },
  { key: "bd4", badge: "Apocalipsis 19:7-9", name: "Las bodas del Cordero", body: "«Gocémonos y alegrémonos y démosle gloria; porque han llegado las bodas del Cordero, y su esposa se ha preparado... Bienaventurados los que son llamados a la cena de las bodas del Cordero» (Apocalipsis 19:7, 9). Es el reencuentro definitivo entre Cristo y su pueblo." },
];

const VERSES = [
  {
    ref: "Juan 14:1-3", isBase: true,
    text: `1 No se turbe vuestro corazón; creéis en Dios, creed también en mí. 2 En la casa de mi Padre muchas moradas hay; si así no fuera, yo os lo hubiera dicho; voy, pues, a preparar lugar para vosotros. 3 Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo, para que donde yo estoy, vosotros también estéis.`
  },
  {
    ref: "Juan 14:4-11",
    text: `4 Y sabéis a dónde voy, y sabéis el camino. 5 Le dijo Tomás: Señor, no sabemos a dónde vas; ¿cómo, pues, podemos saber el camino? 6 Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí. 7 Si me conocierais, también a mi Padre conoceríais; y desde ahora le conocéis, y le habéis visto. 8 Felipe le dijo: Señor, muéstranos el Padre, y nos basta. 9 Jesús le dijo: ¿Tanto tiempo hace que estoy con vosotros, y no me has conocido, Felipe? El que me ha visto a mí, ha visto al Padre; ¿cómo, pues, dices tú: Muéstranos el Padre? 10 ¿No crees que yo soy en el Padre, y el Padre en mí? Las palabras que yo os hablo, no las hablo por mi propia cuenta, sino que el Padre que mora en mí, él hace las obras. 11 Creedme que yo soy en el Padre, y el Padre en mí; de otra manera, creedme por las mismas obras.`
  },
  {
    ref: "Juan 14:12-14",
    text: `12 De cierto, de cierto os digo: El que en mí cree, las obras que yo hago, él las hará también; y aun mayores hará, porque yo voy al Padre. 13 Y todo lo que pidiereis al Padre en mi nombre, lo haré, para que el Padre sea glorificado en el Hijo. 14 Si algo pidiereis en mi nombre, yo lo haré.`
  },
  {
    ref: "Juan 14:15-21",
    text: `15 Si me amáis, guardad mis mandamientos. 16 Y yo rogaré al Padre, y os dará otro Consolador, para que esté con vosotros para siempre: 17 el Espíritu de verdad, al cual el mundo no puede recibir, porque no le ve, ni le conoce; pero vosotros le conocéis, porque mora con vosotros, y estará en vosotros. 18 No os dejaré huérfanos; vendré a vosotros. 19 Todavía un poco, y el mundo no me verá más; pero vosotros me veréis; porque yo vivo, vosotros también viviréis. 20 En aquel día vosotros conoceréis que yo estoy en mi Padre, y vosotros en mí, y yo en vosotros. 21 El que tiene mis mandamientos, y los guarda, ése es el que me ama; y el que me ama, será amado por mi Padre, y yo le amaré, y me manifestaré a él.`
  },
  {
    ref: "Juan 14:22-24",
    text: `22 Le dijo Judas (no el Iscariote): Señor, ¿cómo es que te manifestarás a nosotros, y no al mundo? 23 Respondió Jesús y le dijo: El que me ama, mi palabra guardará; y mi Padre le amará, y vendremos a él, y haremos morada con él. 24 El que no me ama, no guarda mis palabras; y la palabra que habéis oído no es mía, sino del Padre que me envió.`
  },
  {
    ref: "Juan 14:25-27",
    text: `25 Os he dicho estas cosas estando con vosotros. 26 Mas el Consolador, el Espíritu Santo, a quien el Padre enviará en mi nombre, él os enseñará todas las cosas, y os recordará todo lo que yo os he dicho. 27 La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.`
  },
  {
    ref: "Juan 14:28-31",
    text: `28 Habéis oído que yo os he dicho: Voy, y vengo a vosotros. Si me amarais, os habríais regocijado, porque he dicho que voy al Padre; porque el Padre mayor es que yo. 29 Y ahora os lo he dicho antes que suceda, para que cuando suceda, creáis. 30 Ya no hablaré mucho con vosotros; porque viene el príncipe de este mundo, y él nada tiene en mí. 31 Mas para que el mundo conozca que amo al Padre, y como el Padre me mandó, así hago. Levantaos, vamos de aquí.`
  },
  {
    ref: "Juan 16:24",
    text: `Hasta ahora nada habéis pedido en mi nombre; pedid, y recibiréis, para que vuestro gozo sea cumplido.`
  },
  {
    ref: "Deuteronomio 31:6",
    text: `Esforzaos y cobrad ánimo; no temáis, ni tengáis miedo de ellos; porque Jehová tu Dios es el que va contigo; no te dejará ni te desamparará.`
  },
  {
    ref: "Deuteronomio 31:8",
    text: `Y Jehová va delante de ti; él estará contigo, no te dejará, ni te desamparará; no temas ni te intimides.`
  },
  {
    ref: "Josué 1:5",
    text: `Nadie te podrá hacer frente en todos los días de tu vida; como estuve con Moisés, estaré contigo; no te dejaré, ni te desampararé.`
  },
  {
    ref: "Isaías 43:2",
    text: `Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán. Cuando pases por el fuego, no te quemarás, ni la llama arderá en ti.`
  },
  {
    ref: "Hebreos 13:5",
    text: `Sean vuestras costumbres sin avaricia, contentos con lo que tenéis ahora; porque él dijo: No te desampararé, ni te dejaré.`
  },
  {
    ref: "Ezequiel 36:24-27",
    text: `24 Yo os tomaré de entre las naciones, y os recogeré de todas las tierras, y os traeré a vuestro país. 25 Y esparciré sobre vosotros agua limpia, y seréis limpiados de todas vuestras inmundicias; y de todos vuestros ídolos os limpiaré. 26 Os daré corazón nuevo, y pondré espíritu nuevo dentro de vosotros; y quitaré de vuestra carne el corazón de piedra, y os daré un corazón de carne. 27 Y pondré dentro de vosotros mi Espíritu, y haré que andéis en mis estatutos, y guardéis mis preceptos, y los pongáis por obra.`
  },
  {
    ref: "Lucas 11:13",
    text: `Pues si vosotros, siendo malos, sabéis dar buenas dádivas a vuestros hijos, ¿cuánto más vuestro Padre celestial dará el Espíritu Santo a los que se lo pidan?`
  },
  {
    ref: "Hechos 5:32",
    text: `Y nosotros somos testigos suyos de estas cosas, y también el Espíritu Santo, el cual ha dado Dios a los que le obedecen.`
  },
  {
    ref: "1 Juan 3:24",
    text: `Y el que guarda sus mandamientos, permanece en Dios, y Dios en él. Y en esto sabemos que él permanece en nosotros, por el Espíritu que nos ha dado.`
  },
  {
    ref: "Mateo 9:15",
    text: `Y Jesús les dijo: ¿Acaso pueden los que están de bodas tener luto entre tanto que el esposo está con ellos? Mas vendrán días cuando el esposo les será quitado, y entonces ayunarán.`
  },
  {
    ref: "Mateo 22:2",
    text: `El reino de los cielos es semejante a un rey que hizo fiesta de bodas a su hijo.`
  },
  {
    ref: "Mateo 25:1",
    text: `Entonces el reino de los cielos será semejante a diez vírgenes que tomando sus lámparas, salieron a recibir al esposo.`
  },
  {
    ref: "Apocalipsis 19:7-9",
    text: `7 Gocémonos y alegrémonos y démosle gloria; porque han llegado las bodas del Cordero, y su esposa se ha preparado. 8 Y a ella se le ha concedido que se vista de lino fino, limpio y resplandeciente; porque el lino fino es las acciones justas de los santos. 9 Y el ángel me dijo: Escribe: Bienaventurados los que son llamados a la cena de las bodas del Cordero. Y me dijo: Estas son palabras verdaderas de Dios.`
  },
  {
    ref: "Isaías 25:8, 9",
    text: `8 Destruirá a la muerte para siempre; y enjugará Jehová el Señor toda lágrima de todos los rostros; y quitará la afrenta de su pueblo de toda la tierra; porque Jehová lo ha dicho. 9 Y se dirá en aquel día: He aquí, este es nuestro Dios, le hemos esperado, y nos salvará; este es Jehová a quien hemos esperado, nos gozaremos y nos alegraremos en su salvación.`
  },
  {
    ref: "Apocalipsis 6:15-17",
    text: `15 Y los reyes de la tierra, y los grandes, los ricos, los capitanes, los poderosos, y todo siervo y todo libre, se escondieron en las cuevas y entre las peñas de los montes; 16 y decían a los montes y a las peñas: Caed sobre nosotros, y escondednos del rostro de aquel que está sentado sobre el trono, y de la ira del Cordero; 17 porque el gran día de su ira ha llegado; ¿y quién podrá sostenerse en pie?`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Qué le prometió Jesús a sus discípulos que haría antes de volver por ellos? (Juan 14:2, 3)",
    opts: [
      "Enviarles cartas desde el cielo",
      "Preparar un lugar en la casa de su Padre y volver a buscarlos",
      "Dejar un ángel encargado de cuidarlos",
      "Regresar solo cuando ellos lo pidieran"
    ],
    ans: 1,
    feedback: "«Voy, pues, a preparar lugar para vosotros. Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo» (Juan 14:2, 3). Es la promesa que ha sostenido al pueblo de Dios a lo largo de los siglos."
  },
  {
    q: "Cuando Felipe le pidió a Jesús: «Muéstranos el Padre», ¿qué le respondió Jesús? (Juan 14:9)",
    opts: [
      "«Nadie puede ver al Padre todavía»",
      "«El que me ha visto a mí, ha visto al Padre»",
      "«Eso lo verán después de mi resurrección»",
      "«Solo el Espíritu Santo puede mostrártelo»"
    ],
    ans: 1,
    feedback: "«El que me ha visto a mí, ha visto al Padre» (Juan 14:9). Jesús corrige la idea de un Dios el Padre distante y severo: él es exactamente igual a Jesús en amor y carácter."
  },
  {
    q: "¿En nombre de quién les enseñó Jesús a orar al Padre? (Juan 14:13, 14)",
    opts: [
      "En nombre de los profetas",
      "En su propio nombre, el de Jesús",
      "En nombre de la iglesia",
      "No especificó ningún nombre"
    ],
    ans: 1,
    feedback: "«Todo lo que pidiereis al Padre en mi nombre, lo haré... Si algo pidiereis en mi nombre, yo lo haré» (Juan 14:13, 14). El Padre está deseoso de escuchar y responder nuestras oraciones."
  },
  {
    q: "¿A quién prometió Jesús enviar como «otro Consolador» para que estuviera con los discípulos para siempre? (Juan 14:16, 17)",
    opts: [
      "A otro apóstol",
      "Al Espíritu de verdad, el Espíritu Santo",
      "A un ángel guardián",
      "A Juan el Bautista"
    ],
    ans: 1,
    feedback: "«Yo rogaré al Padre, y os dará otro Consolador, para que esté con vosotros para siempre: el Espíritu de verdad» (Juan 14:16, 17)."
  },
  {
    q: "Según Juan 14:26, ¿qué haría el Espíritu Santo por los discípulos?",
    opts: [
      "Reemplazar la necesidad de estudiar la Biblia",
      "Enseñarles todas las cosas y recordarles todo lo que Jesús les había dicho",
      "Darles poder para juzgar a los demás",
      "Sustituir por completo a Jesús"
    ],
    ans: 1,
    feedback: "«El Consolador, el Espíritu Santo... él os enseñará todas las cosas, y os recordará todo lo que yo os he dicho» (Juan 14:26)."
  },
  {
    q: "¿Qué tipo de paz prometió Jesús a sus discípulos? (Juan 14:27)",
    opts: [
      "Una paz igual a la que da el mundo",
      "Una paz que solo llegaría después de la Segunda Venida",
      "Su propia paz, distinta a la que da el mundo",
      "Una paz condicionada a que nunca sufrieran"
    ],
    ans: 2,
    feedback: "«La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo» (Juan 14:27)."
  },
  {
    q: "¿Con qué imagen suele describir la Biblia la Segunda Venida de Cristo? (Mateo 22:2; 25:1; Apocalipsis 19:7-9)",
    opts: [
      "Una batalla final",
      "Una boda: las bodas del Cordero",
      "Un juicio silencioso",
      "Una cosecha sin fiesta"
    ],
    ans: 1,
    feedback: "«Han llegado las bodas del Cordero, y su esposa se ha preparado... Bienaventurados los que son llamados a la cena de las bodas del Cordero» (Apocalipsis 19:7, 9)."
  },
  {
    q: "¿Cómo contrasta la Biblia la reacción del pueblo de Dios y la de los malvados ante la Segunda Venida? (Isaías 25:8, 9; Apocalipsis 6:15-17)",
    opts: [
      "Ambos grupos reaccionan con indiferencia",
      "El pueblo de Dios se alegra y espera con gozo; los malvados la enfrentan con temor abrumador",
      "Solo los malvados se alegran, porque termina el sufrimiento",
      "La Biblia no describe ninguna reacción emocional"
    ],
    ans: 1,
    feedback: "«Nos gozaremos y nos alegraremos en su salvación» (Isaías 25:9), mientras que los malvados claman: «Escondednos del rostro de aquel que está sentado sobre el trono» (Apocalipsis 6:16). La Segunda Venida es una buena noticia para quienes esperan a Cristo."
  },
];

const DISCUSS_REGRESO = [
  { n: 1, text: "¿Qué esperanza les dio Jesús a sus discípulos, que estaban confundidos por su partida?", ref: "Juan 14:1-6" },
  { n: 2, text: "¿Por qué la Biblia suele describir la Segunda Venida de Cristo con la imagen de una boda?", ref: "Mateo 22:2; 25:1; Apocalipsis 19:7-9" },
  { n: 3, text: "¿De qué manera la enseñanza del Segundo Advenimiento basada en el miedo puede afectar la forma en que se recibe el mensaje?" },
];

const DISCUSS_AYUDA = [
  { n: 1, text: "¿Alguna vez te has sentido tentado a creer, como muchos, que Dios el Padre es severo y distante? ¿Cómo corrigió Jesús estas creencias erróneas?", ref: "Juan 14:7-14" },
  { n: 2, text: "¿Cómo siguieron experimentando los discípulos la presencia de Dios tras la partida de Cristo?", ref: "Juan 14:15-24" },
  { n: 3, text: "¿Logras percibir cómo el Padre, el Hijo y el Espíritu Santo trabajan juntos para nuestra salvación en Juan 14?" },
];

const DISCUSS_PAZ = [
  { n: 1, text: "A pesar de los tiempos difíciles que se avecinaban, Cristo prometió su paz a los discípulos. ¿Cómo se manifiesta esa paz en nuestra vida?", ref: "Juan 14:27" },
  { n: 2, text: "Jesús dijo que cuando las cosas que anunció sucedieran, serían razones para creer en él. ¿Qué nos dice esto sobre la importancia de las profecías para fortalecer nuestra fe?", ref: "Juan 14:29" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Cuál de las promesas de Juan 14 te anima más?", ref: "Juan 14" },
  { key: "rfl2", q: "¿Qué ideas erróneas tenías sobre el Padre, y de qué manera las palabras de Jesús te ayudaron a corregirlas?", ref: "Juan 14:7-11" },
  { key: "rfl3", q: "¿Qué significa para ti personalmente la promesa del Espíritu Santo? ¿Cómo puedes recibir más del Espíritu Santo en tu vida?", ref: "Juan 14:16-26" },
  { key: "rfl4", q: "Memoriza tu pasaje favorito de Juan 14. Escríbelo varias veces para ayudarte a recordarlo.", ref: "Juan 14" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Un lugar <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>preparado</em></div>
      <div className="sec-sub">Tercera Semana · Juan 14 · Las escenas finales</div>

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
            <div className="card-label">Poner las cosas en orden</div>
            <p>Cuando alguien sabe que su hora se acerca, lo ideal es que ponga todo en orden: que asegure que sus seres queridos estarán bien cuidados, que diga lo que hay que decir y que anime a los que se quedan, recordándoles que esto no es un adiós, sino un hasta luego. Eso es exactamente lo que Jesús hace en el aposento alto: antes de partir, les da a sus discípulos las garantías y los principios que necesitarán para continuar su misión en su ausencia.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Juan 14:1-3
            </div>
            <div className="honey-text">
              «No se turbe vuestro corazón; creéis en Dios, creed también en mí. En la casa de mi Padre muchas moradas hay... voy, pues, a preparar lugar para vosotros. Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo, para que donde yo estoy, vosotros también estéis.»
            </div>
            <div className="honey-ref">Juan 14:1-3 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>La Segunda Venida</strong> no está destinada a ser un acontecimiento que infunda temor, sino un reencuentro maravilloso entre Cristo y su pueblo.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Jesús nos mostró</strong> que el Padre es tan amoroso y compasivo como él.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">A través de la obra del <strong>Espíritu Santo</strong>, los discípulos continuarían en la presencia de Dios después de la partida de Jesús.</span>
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
      <div className="sec-sub">Promesas para lo que viene</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>En Juan 13, Jesús les da la mala noticia de que uno de los discípulos está a punto de traicionarlo. En Juan 14, les da la triste noticia de que está a punto de dejarlos. Sin embargo, describió su partida como algo en beneficio de ellos, y les dejó promesas concretas para sostenerlos.</p>
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
        <p>¿Cuál de las promesas de Juan 14 te anima más? ¿Qué ideas erróneas tenías sobre el Padre, y de qué manera las palabras de Jesús te ayudaron?</p>
      </div>
    </>
  );
}

function TabInterpreta({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Interpreta</div>
      <div className="sec-sub">Ya viene la ayuda</div>

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
        <p>Después de leer el texto con tus anotaciones, ¿a qué conclusiones has llegado? ¿Qué significa para ti personalmente la promesa del Espíritu Santo? ¿Cómo puedes recibir más del Espíritu Santo en tu vida?</p>
      </div>
    </>
  );
}

function TabInvestiga({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Investiga</div>
      <div className="sec-sub">Lo que otras Escrituras revelan sobre estas promesas</div>

      <div className="group-label">La promesa de la presencia de Dios</div>
      {INVESTIGA_PRESENCIA.map(item => (
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

      <div className="group-label">La promesa del Espíritu</div>
      {INVESTIGA_ESPIRITU.map(item => (
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
        <div className="card-label">Para pensar</div>
        <p>¿Qué otros versículos o promesas te vienen a la mente en relación con Juan 14?</p>
      </div>
    </>
  );
}

function TabBoda({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">A preparar un lugar</div>
      <div className="sec-sub">La Segunda Venida como una boda</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">La promesa definitiva</div>
        <p>Jesús se comprometió a llevarnos algún día a su hogar para morar con él para siempre. La promesa de que Jesús volverá transforma la forma en que nos relacionamos con nuestras circunstancias actuales, porque nos da esperanza. Con gran expectación y alegría, Jesús espera el día en que pueda llevarnos a nuestro hogar celestial.</p>
      </div>

      {BODA_DATA.map(item => (
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

      <div className="group-label">Dos reacciones ante el mismo día</div>
      <div className="pair-card">
        <div className="pair-cell joy">
          <span className="pair-tag">Pueblo de Dios</span>
          «Nos gozaremos y nos alegraremos en su salvación» (Isaías 25:8, 9).
        </div>
        <div className="pair-cell fear">
          <span className="pair-tag">Los malvados</span>
          «Escondednos... de la ira del Cordero» (Apocalipsis 6:15-17).
        </div>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>¿De qué manera el hecho de pensar en la Segunda Venida como una boda influye en tu visión del carácter de Dios?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien las promesas que Jesús dejó a sus discípulos." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre las enseñanzas de Juan 14." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Juan 14." :
                "Vale la pena releer el capítulo. Es clave para entender la esperanza que Jesús nos deja.";
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 73, pp. 635, 636</div>
        <div className="egw-text">«"Les aseguro —continuó Cristo— que el que cree en mí hará también las obras que yo hago" (Juan 14:12). El Salvador anhelaba profundamente que sus discípulos comprendieran con qué propósito su divinidad se había unido a la humanidad. [...] <strong>"Y hará otras todavía más grandes, porque yo voy a donde está el Padre."</strong> Con esto no quiso decir Cristo que la obra de los discípulos sería de un carácter más elevado que la propia, sino que tendría mayor extensión. [...] La promesa del Salvador a sus discípulos es una promesa hecha a su iglesia hasta el fin del tiempo. [...] Estaría delante del Padre para pedir por ellos. La oración del humilde suplicante es presentada por él como su propio deseo en favor de aquella alma. Cada oración sincera es oída en el cielo.»</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">La promesa de su regreso</div>
        {DISCUSS_REGRESO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Alguna vez pensaste que se le da menos importancia al «por qué» de la Segunda Venida que al «cómo»? Si es así, ¿cómo podemos cambiar eso?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">La ayuda divina concedida</div>
        {DISCUSS_AYUDA.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Paz y fe</div>
        {DISCUSS_PAZ.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Qué preocupaciones o temores te causan más inquietud? ¿En qué se diferencia la paz que ofrece Jesús de la que tú buscarías de forma natural?</div>
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
            <span className="key-text">La Segunda Venida no está destinada a ser un acontecimiento que infunda temor, sino un <strong>reencuentro maravilloso</strong> entre Cristo y su pueblo.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Jesús nos mostró que <strong>el Padre es tan amoroso y compasivo como él.</strong></span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">A través de la obra del <strong>Espíritu Santo,</strong> los discípulos continuarían en la presencia de Dios después de la partida de Jesús.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Entre exámenes, notificaciones y planes que cambian de un día para otro, es fácil sentir que nadie tiene el control de nada. Juan 14 dice lo contrario: Jesús ya tiene un plan, ya está preparando un lugar, y ya prometió no dejarte solo mientras tanto.</p>
          <br />
          <p><strong>No necesitás resolverlo todo por tu cuenta.</strong> El mismo Espíritu que le recordaba a los discípulos las palabras de Jesús está disponible para vos: en tus decisiones del liceo o la universidad, en tus conversaciones con amigos, en los momentos en que la ansiedad gana terreno.</p>
          <br />
          <p>La próxima vez que sientas miedo por el futuro —el tuyo o el del mundo— recordá que la Segunda Venida no es una amenaza: es una boda que se está preparando. <strong>Podés esperar ese día con la misma ilusión de quien cuenta los días para reencontrarse con alguien que ama.</strong></p>
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
    { id: "boda",         label: "Boda",         Icon: Sparkles },
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
              InVerso · Semana 3
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Un lugar <em>preparado</em>
            </h1>
            <div className="hero-ref">Juan 14 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"       && <TabInicio teacherMode={teacherMode} />}
            {tab === "interioriza"  && <TabInterioriza openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "interpreta"   && <TabInterpreta openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "investiga"    && <TabInvestiga openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "boda"         && <TabBoda openExpand={openExpand} toggleExpand={toggleExpand} />}
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
