import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, Shield,
  Zap, HelpCircle, Heart
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#080612;--bg2:#0e0b1f;--bg3:#161230;--surf:#1e1840;--surf2:#26204f;--brd:#352d60;--brd2:#4e4484;--tx:#ede8fc;--tx2:#9b8fc4;--tx3:#615890;--acc:#a855f7;--acc2:#c084fc;--acc3:#e9d5ff;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#f59e0b;--warn-d:rgba(245,158,11,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#140a2c 0%,#0e0b1f 55%,#080612 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(168,85,247,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(168,85,247,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(168,85,247,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(168,85,247,.3) 30%,rgba(168,85,247,.3) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:40px;min-height:56px;padding:.6rem .2rem .5rem;font-size:.42rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:18px;height:18px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(168,85,247,.08);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(168,85,247,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(245,158,11,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(168,85,247,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(168,85,247,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(168,85,247,.07),rgba(168,85,247,.02));border:1px solid rgba(168,85,247,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(168,85,247,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(168,85,247,.10),rgba(168,85,247,.03));border:1px solid rgba(168,85,247,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.honey-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.honey-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.honey-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}
.guide-banner{background:linear-gradient(135deg,rgba(245,158,11,.10),rgba(245,158,11,.02));border:1px solid rgba(245,158,11,.22);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(245,158,11,.12);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
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
.vida-card{background:linear-gradient(135deg,rgba(168,85,247,.10),rgba(168,85,247,.02));border:1.5px solid rgba(168,85,247,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}
.key-list{list-style:none;padding:0;margin-bottom:.85rem}
.key-list li{display:flex;gap:.7rem;align-items:flex-start;padding:.6rem 0;border-bottom:1px solid var(--brd)}
.key-list li:last-child{border-bottom:none}
.key-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:.55rem}
.key-text{font-size:.97rem;line-height:1.6;color:var(--tx2)}
.key-text strong{color:var(--tx)}
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin-bottom:.85rem}
.compare-col{}
.compare-header{font-family:'IBM Plex Mono',monospace;font-size:.54rem;text-transform:uppercase;letter-spacing:.08em;padding:.4rem .55rem;border-radius:8px 8px 0 0;text-align:center;font-weight:500}
.compare-header.red{background:var(--err-d);color:var(--err)}
.compare-header.ok{background:var(--ok-d);color:var(--ok)}
.compare-cell{background:var(--surf);border:1px solid var(--brd);border-top:none;padding:.55rem .6rem}
.compare-cell:last-child{border-radius:0 0 8px 8px}
.compare-item{font-size:.91rem;line-height:1.5;color:var(--tx2);padding:.28rem 0;border-bottom:1px solid var(--brd)}
.compare-item:last-child{border-bottom:none}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: El ajetreo del sábado", desc: "Relatar brevemente la historia de la mujer que se distrajo haciendo tareas el sábado de mañana (la historia del intro). Preguntar al grupo: ¿Alguna vez te pasó que lo urgente te alejó de lo importante en tu relación con Dios? Conectar: cuando nos alejamos, el arrepentimiento es el camino de regreso." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración. Orar pidiendo corazones sensibles a la convicción del Espíritu Santo y apertura genuina para recibir el perdón de Dios." },
  { time: "05–12 min", title: "Tab Rebelión — Éxodo 32–34", desc: "Recorrer las 4 etapas del relato. Énfasis: Israel quebrantó el pacto apenas semanas después de haberlo prometido solemnemente. Preguntar: ¿Cómo es posible eso? ¿En qué se parece a nuestra propia experiencia? El punto central: la gracia de Dios en Éxodo 34:6-7 superó una rebelión enorme. ¿Qué dice eso sobre el carácter de Dios?" },
  { time: "12–18 min", title: "Tab Espíritu — Convicción y arrepentimiento", desc: "Explorar el rol del Espíritu Santo en la convicción. Usar la tabla de contraste genuino vs. falso. Conectar con los ejemplos de Esaú, Balaam y Judas. Preguntar: ¿Cuándo fue la última vez que sentiste esa voz suave del Espíritu? ¿Cómo respondiste?" },
  { time: "18–23 min", title: "Tab Vestidura — El manto de justicia", desc: "Desarrollar la metáfora de la ropa. De Génesis 3 (hojas de higuera) a Zacarías 3 (ropa sucia reemplazada) a Mateo 22 (vestimenta de boda). Preguntar: ¿Qué representa prácticamente «vestirnos» del manto de justicia de Cristo cada día?" },
  { time: "23–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Pausar especialmente en la pregunta 4 (arrepentimiento genuino vs. falso) y la pregunta 5 (el manto de justicia). Son los dos conceptos más aplicables de la lección." },
  { time: "27–30 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Leer en voz alta el texto 'Para tu vida'. Invitar a una oración personal en silencio: pedirle a Dios un corazón sensible al Espíritu y disposición a arrepentirse genuinamente esta semana." },
];

const REBELION_DATA = [
  {
    key: "rb1", badge: "Éxodo 24:7-8",
    name: "1. El pacto solemne",
    body: "Moisés leyó el libro del pacto al pueblo. Todos respondieron: «Haremos todas las cosas que Jehová ha dicho, y obedeceremos». Luego roció sangre sobre el pueblo, simbolizando el tipo de castigo que acarrearía el incumplimiento: la muerte misma. El pacto era claro y los términos, conocidos. Nadie podía alegar ignorancia."
  },
  {
    key: "rb2", badge: "Éxodo 32:1-6",
    name: "2. La rebelión del becerro de oro",
    body: "Apenas semanas después del pacto solemne, el pueblo se impacientó esperando a Moisés. Exigieron a Aarón dioses visibles. Aarón, temiendo por su propia seguridad, cedió y fundió las joyas de oro en un becerro, mezclando la adoración a Jehová con la idolatría egipcia. Todos sabían que habían comprometido su vida en el pacto. Y lo quebrantaron de todas formas."
  },
  {
    key: "rb3", badge: "Éxodo 32–33",
    name: "3. La intercesión de Moisés",
    body: "La ira de Dios ardió contra Israel. Pero Moisés intercedió por el pueblo, rogando perdón por amor al nombre de Dios y a las promesas hechas a los patriarcas. Llegó a decir: «Perdona ahora su pecado, y si no, ráeme ahora de tu libro que has escrito» (Éxodo 32:32). Este es un tipo de la intercesión de Cristo, que dio su propia vida por el perdón de nuestros pecados."
  },
  {
    key: "rb4", badge: "Éxodo 34:5-9",
    name: "4. La restauración del pacto",
    body: "Dios respondió a la intercesión de Moisés. Bajó en la nube y proclamó su propio carácter: «Jehová, fuerte, misericordioso y piadoso; tardo para la ira, y grande en misericordia y verdad; que guarda misericordia a millares, que perdona la iniquidad, la rebelión y el pecado» (Éxodo 34:6-7). Restauró el pacto con un pueblo que lo había quebrantado flagrantemente. Esta es la gracia de Dios en acción."
  },
];

const ESPIRITU_DATA = [
  {
    key: "es1", badge: "Juan 16:8",
    name: "El Espíritu convence de pecado",
    body: "Una de las funciones del Espíritu Santo es «convencer al mundo de pecado, de justicia y de juicio» (Juan 16:8). Esa inquietud interior que sentimos cuando actuamos mal, esa voz suave que nos hace volver la mirada a nuestra conducta — eso es el Espíritu obrando. Sin esa convicción, permaneceríamos ciegos a nuestra propia condición espiritual."
  },
  {
    key: "es2", badge: "Juan 16:13 · Efesios 4:30",
    name: "Dependencia y sensibilidad",
    body: "El Espíritu nos guiará a toda la verdad (Juan 16:13), incluyendo la verdad sobre nosotros mismos. Sin él, somos espiritualmente impotentes, incapaces incluso de arrepentirnos por nuestras propias fuerzas. Por eso es crucial no contristarlo: «No contristéis al Espíritu Santo de Dios, con el cual fuisteis sellados» (Efesios 4:30). Ignorar su convicción embota nuestra sensibilidad espiritual."
  },
  {
    key: "es3", badge: "Hechos 5:31 · Romanos 2:4",
    name: "El arrepentimiento como don",
    body: "El arrepentimiento no surge de nuestra propia fuerza de voluntad. Dios exaltó a Cristo «para dar a Israel arrepentimiento y perdón de pecados» (Hechos 5:31). Y es «la benignidad de Dios» lo que nos guía al arrepentimiento (Romanos 2:4). No es el miedo al castigo lo que produce el verdadero cambio — es la bondad inconmensurable de Dios que nos atrae a él."
  },
];

const COMPARE_GENUINO = [
  "Nace de la convicción del Espíritu Santo",
  "Produce tristeza por ofender a Dios",
  "Lleva al abandono real del pecado",
  "No busca excusas ni justificaciones",
  "Produce reforma real en la conducta",
  "Resulta en restitución cuando es posible",
];

const COMPARE_FALSO = [
  "Nace del miedo a las consecuencias",
  "Solo lamenta el sufrimiento causado",
  "Puede reformarse sin cambio interior",
  "Añade disculpas y justificaciones",
  "Sin abandono real del pecado",
  "Como Judas: confesión sin transformación",
];

const VESTIDURA_DATA = [
  {
    key: "vs1", badge: "Génesis 3:7 · Isaías 64:6",
    name: "Nuestra propia «ropa»",
    body: "Cuando Adán y Eva pecaron, su vestimenta de luz fue reemplazada por desnudez. Intentaron cubrirse con hojas de higuera — imagen perfecta de los esfuerzos humanos para resolver el problema del pecado. Isaías describe nuestra propia justicia así: «Todas nuestras justicias como trapo de inmundicia» (Isaías 64:6). Por muy buenas que sean nuestras obras, no bastan para presentarnos ante Dios."
  },
  {
    key: "vs2", badge: "Zacarías 3:1-5",
    name: "Dios quita la ropa sucia",
    body: "Zacarías vio una visión poderosa: el sumo sacerdote Josué de pie ante el ángel de Jehová con «vestiduras viles» mientras Satanás lo acusaba. Entonces el ángel declaró: «Quitadle esas vestiduras viles... Mira que he quitado de ti tu pecado, y te he hecho vestir de ropas de gala» (Zacarías 3:4). Esto es el evangelio en imagen: Dios mismo nos quita la ropa sucia del pecado y nos viste de su gloria."
  },
  {
    key: "vs3", badge: "Mateo 22:11-13",
    name: "La vestimenta de boda",
    body: "En la parábola del banquete real (Mateo 22), un hombre llegó sin la vestimenta de boda que el rey ofrecía gratuitamente. Prefirió sus propias ropas sucias y gastadas — imagen de nuestra propia justicia. Al rechazar el regalo de Cristo, ese hombre quedó excluido. Aceptar la vestimenta de boda es una elección diaria: no se gana, se recibe con fe y gratitud."
  },
  {
    key: "vs4", badge: "Isaías 61:10 · Apocalipsis 19:8",
    name: "El manto de justicia de Cristo",
    body: "«Me vistió con vestiduras de salvación, me rodeó de manto de justicia» (Isaías 61:10). El lino blanco y limpio que viste a los redimidos en Apocalipsis 19:8 es «las acciones justas de los santos» — no las propias, sino la justicia de Cristo imputada por fe. Este manto «es la justicia de Cristo, su propio carácter sin mancha, que por la fe se imparte a todos los que lo reciben como Salvador personal» (E.G. de White)."
  },
];

const VERSES = [
  {
    ref: "Éxodo 34:5-9", isBase: true,
    text: `5 Y Jehová descendió en la nube, y estuvo allí con él, y proclamó el nombre de Jehová. 6 Y pasando Jehová por delante de él, proclamó: ¡Jehová! ¡Jehová! fuerte, misericordioso y piadoso; tardo para la ira, y grande en misericordia y verdad; 7 que guarda misericordia a millares, que perdona la iniquidad, la rebelión y el pecado, y que de ningún modo tendrá por inocente al malvado; que visita la iniquidad de los padres sobre los hijos y sobre los hijos de los hijos, hasta la tercera y cuarta generación. 8 Entonces Moisés, apresurándose, bajó la cabeza hacia el suelo y adoró. 9 Y dijo: Si ahora, Señor, he hallado gracia en tus ojos, vaya ahora el Señor en medio de nosotros; porque es un pueblo de dura cerviz; y perdona nuestra iniquidad y nuestro pecado, y tómanos por tu heredad.`
  },
  {
    ref: "Éxodo 24:7-8",
    text: `7 Y tomó el libro del pacto y lo leyó a oídos del pueblo, el cual dijo: Haremos todas las cosas que Jehová ha dicho, y obedeceremos. 8 Entonces Moisés tomó la sangre y roció sobre el pueblo, y dijo: He aquí la sangre del pacto que Jehová ha hecho con vosotros sobre todas estas cosas.`
  },
  {
    ref: "Éxodo 32:1-6",
    text: `1 Viendo el pueblo que Moisés tardaba en descender del monte, se acercaron entonces a Aarón, y le dijeron: Levántate, haznos dioses que vayan delante de nosotros; porque a este Moisés, el varón que nos sacó de la tierra de Egipto, no sabemos qué le haya acontecido. 2 Y Aarón les dijo: Apartad los zarcillos de oro que están en las orejas de vuestras mujeres, de vuestros hijos y de vuestras hijas, y traédmelos. 3 Entonces todo el pueblo apartó los zarcillos de oro que tenían en sus orejas, y los trajeron a Aarón. 4 Y él los tomó de las manos de ellos, y le dio forma con buril, e hizo de ello un becerro de fundición. Entonces dijeron: Israel, estos son tus dioses, que te sacaron de la tierra de Egipto. 5 Y viendo esto Aarón, edificó un altar delante del becerro; y pregonó Aarón, y dijo: Mañana será fiesta para Jehová. 6 Y al día siguiente madrugaron, y ofrecieron holocaustos, y presentaron ofrendas de paz; y se sentó el pueblo a comer y a beber, y se levantó a regocijarse.`
  },
  {
    ref: "Lucas 10:40-42",
    text: `40 Pero Marta se preocupaba con muchos quehaceres, y acercándose, dijo: Señor, ¿no te da cuidado que mi hermana me deje servir sola? Dile, pues, que me ayude. 41 Respondiendo Jesús, le dijo: Marta, Marta, afanada y turbada estás con muchas cosas. 42 Pero solo una cosa es necesaria; y María ha escogido la buena parte, la cual no le será quitada.`
  },
  {
    ref: "Mateo 3:2",
    text: `Arrepentíos, porque el reino de los cielos se ha acercado.`
  },
  {
    ref: "Marcos 1:15",
    text: `El tiempo se ha cumplido, y el reino de Dios se ha acercado; arrepentíos, y creed en el evangelio.`
  },
  {
    ref: "Hechos 20:21",
    text: `Testificando a judíos y a gentiles acerca del arrepentimiento para con Dios, y de la fe en nuestro Señor Jesucristo.`
  },
  {
    ref: "Joel 2:12-14",
    text: `12 Por eso pues, ahora, dice Jehová, convertíos a mí con todo vuestro corazón, con ayuno y lloro y lamento. 13 Rasgad vuestro corazón, y no vuestros vestidos, y convertíos a Jehová vuestro Dios; porque misericordioso es y clemente, tardo para la ira y grande en benignidad, y que se arrepiente del castigo. 14 ¿Quién sabe si volverá y se arrepentirá y dejará bendición tras de él, esto es, ofrenda y libación para Jehová vuestro Dios?`
  },
  {
    ref: "Lucas 24:46-48",
    text: `46 Y les dijo: Así está escrito, y así fue necesario que el Cristo padeciese, y resucitase de los muertos al tercer día; 47 y que se predicase en su nombre el arrepentimiento y el perdón de pecados en todas las naciones, comenzando desde Jerusalén. 48 Y vosotros sois testigos de estas cosas.`
  },
  {
    ref: "Hechos 3:18-19",
    text: `18 Pero Dios ha cumplido así lo que había antes anunciado por boca de todos sus profetas, que su Cristo había de padecer. 19 Así que, arrepentíos y convertíos, para que sean borrados vuestros pecados; para que vengan de la presencia del Señor tiempos de refrigerio.`
  },
  {
    ref: "Apocalipsis 3:19",
    text: `Yo reprendo y castigo a todos los que amo; sé, pues, celoso, y arrepiéntete.`
  },
  {
    ref: "Hechos 5:31",
    text: `A éste, Dios ha exaltado con su diestra por Príncipe y Salvador, para dar a Israel arrepentimiento y perdón de pecados.`
  },
  {
    ref: "Hechos 11:18",
    text: `Entonces, oídas estas cosas, callaron, y glorificaron a Dios, diciendo: ¡De manera que también a los gentiles ha dado Dios arrepentimiento para vida!`
  },
  {
    ref: "Romanos 2:4",
    text: `¿O menosprecias las riquezas de su benignidad, paciencia y longanimidad, ignorando que su benignidad te guía al arrepentimiento?`
  },
  {
    ref: "Salmo 103:3, 8, 12",
    text: `3 Él es quien perdona todas tus iniquidades, el que sana todas tus dolencias. ... 8 Misericordioso y clemente es Jehová; lento para la ira, y grande en misericordia. ... 12 Cuanto está lejos el oriente del occidente, hizo alejar de nosotros nuestras rebeliones.`
  },
  {
    ref: "2 Pedro 3:9",
    text: `El Señor no retarda su promesa, según algunos la tienen por tardanza, sino que es paciente para con nosotros, no queriendo que ninguno perezca, sino que todos procedan al arrepentimiento.`
  },
  {
    ref: "1 Juan 1:9",
    text: `Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.`
  },
  {
    ref: "Juan 16:8",
    text: `Y cuando él venga, convencerá al mundo de pecado, de justicia y de juicio.`
  },
  {
    ref: "Juan 16:13",
    text: `Pero cuando venga el Espíritu de verdad, él os guiará a toda la verdad; porque no hablará por su propia cuenta, sino que hablará todo lo que oyere, y os hará saber las cosas que habrán de venir.`
  },
  {
    ref: "Efesios 4:30",
    text: `Y no contristéis al Espíritu Santo de Dios, con el cual fuisteis sellados para el día de la redención.`
  },
  {
    ref: "Mateo 22:11-13",
    text: `11 Y entró el rey para ver a los convidados, y vio allí a un hombre que no estaba vestido de boda. 12 Y le dijo: Amigo, ¿cómo entraste aquí, sin estar vestido de boda? Mas él enmudeció. 13 Entonces el rey dijo a los que servían: Atadle de pies y manos, y echadle en las tinieblas de afuera; allí será el lloro y el crujir de dientes.`
  },
  {
    ref: "Isaías 64:6",
    text: `Si bien todos nosotros somos como suciedad, y todas nuestras justicias como trapo de inmundicia; y caímos todos nosotros como la hoja, y nuestras maldades nos llevaron como viento.`
  },
  {
    ref: "Isaías 61:10",
    text: `En gran manera me gozaré en Jehová, mi alma se alegrará en mi Dios; porque me vistió con vestiduras de salvación, me rodeó de manto de justicia, como a novio me atavió, y como a novia adornada con sus joyas.`
  },
  {
    ref: "Apocalipsis 19:8",
    text: `Y a ella se le ha concedido que se vista de lino fino, limpio y resplandeciente; porque el lino fino es las acciones justas de los santos.`
  },
  {
    ref: "Efesios 5:27",
    text: `A fin de presentársela a sí mismo, una iglesia gloriosa, que no tuviese mancha ni arruga ni cosa semejante, sino que fuese santa y sin mancha.`
  },
  {
    ref: "Génesis 3:7",
    text: `Entonces fueron abiertos los ojos de ambos, y conocieron que estaban desnudos; entonces cosieron hojas de higuera, y se hicieron delantales.`
  },
  {
    ref: "Zacarías 3:1-5",
    text: `1 Me mostró al sumo sacerdote Josué, el cual estaba delante del ángel de Jehová, y Satanás estaba a su mano derecha para acusarle. 2 Y dijo Jehová a Satanás: Jehová te reprenda, oh Satanás; Jehová, que ha escogido a Jerusalén, te reprenda. ¿No es éste un tizón arrebatado del incendio? 3 Y Josué estaba vestido de vestiduras viles, y estaba delante del ángel. 4 Y habló el ángel, y mandó a los que estaban delante de él, diciendo: Quitadle esas vestiduras viles. Y a él le dijo: Mira que he quitado de ti tu pecado, y te he hecho vestir de ropas de gala. 5 Después dijo: Pongan mitra limpia sobre su cabeza. Y pusieron una mitra limpia sobre su cabeza, y le vistieron las ropas. Y el ángel de Jehová estaba en pie.`
  },
  {
    ref: "Mateo 27:4",
    text: `Diciendo: Yo he pecado entregando sangre inocente. Mas ellos dijeron: ¿Qué nos importa a nosotros? ¡Allá tú!`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Qué proclamó Dios sobre sí mismo en Éxodo 34:6-7, ante el pueblo que acababa de rebelarse?",
    opts: [
      "Que era justo y no toleraría ningún pecado en su pueblo",
      "Que era misericordioso, piadoso, tardo para la ira y grande en perdón",
      "Que renovaría el pacto solo con Moisés, no con el pueblo",
      "Que destruiría a Israel por su rebelión y comenzaría de nuevo"
    ],
    ans: 1,
    feedback: "«¡Jehová! ¡Jehová! fuerte, misericordioso y piadoso; tardo para la ira, y grande en misericordia y verdad; que guarda misericordia a millares, que perdona la iniquidad, la rebelión y el pecado» (Éxodo 34:6-7). Dios proclamó su carácter de gracia en respuesta directa a la peor rebelión de Israel."
  },
  {
    q: "¿Por qué los israelitas fabricaron el becerro de oro, si acababan de hacer un pacto solemne con Dios?",
    opts: [
      "Querían mezclar la adoración a Dios con sus tradiciones culturales egipcias",
      "Habían olvidado completamente a Jehová durante los años en Egipto",
      "Moisés tardaba en bajar y querían un dios visible que los guiara",
      "Aarón les había dicho que Dios pedía una imagen de su presencia"
    ],
    ans: 2,
    feedback: "«Viendo el pueblo que Moisés tardaba en descender del monte... le dijeron a Aarón: Levántate, haznos dioses que vayan delante de nosotros» (Éxodo 32:1). La impaciencia y la necesidad de algo tangible los llevó a quebrantar el pacto que acababan de hacer solemnemente."
  },
  {
    q: "Según Juan 16:8, ¿cuál es la función del Espíritu Santo en relación con el pecado?",
    opts: [
      "Proteger al creyente de cometer pecados graves",
      "Dar poder para vencer el pecado mediante la disciplina espiritual",
      "Convencer al mundo de pecado, de justicia y de juicio",
      "Revelar qué pecados son imperdonables según Dios"
    ],
    ans: 2,
    feedback: "«Y cuando él venga, convencerá al mundo de pecado, de justicia y de juicio» (Juan 16:8). La convicción de pecado es obra del Espíritu Santo, no de nuestra propia reflexión moral. Es un regalo: sin esa convicción, permaneceríamos ciegos a nuestra condición espiritual."
  },
  {
    q: "¿Cuál es la diferencia entre el arrepentimiento genuino y el falso, según Elena G. de White?",
    opts: [
      "El genuino es más emotivo y expresivo; el falso es frío e intelectual",
      "El genuino produce reforma en la conducta; el falso solo lamenta las consecuencias",
      "El genuino viene después del bautismo; el falso, antes de comprometerse con Dios",
      "El genuino se confiesa públicamente; el falso se guarda en secreto"
    ],
    ans: 1,
    feedback: "«Ningún arrepentimiento que no obre una reforma es genuino» (E.G. de White). Esaú lloró la pérdida de su primogenitura, no el pecado que la causó. Judas confesó haber entregado sangre inocente, pero no experimentó transformación. El arrepentimiento genuino incluye el abandono real del pecado."
  },
  {
    q: "En la parábola de Mateo 22, ¿qué representa la vestimenta de boda que el rey ofrecía gratuitamente a sus invitados?",
    opts: [
      "Las buenas obras acumuladas durante la vida cristiana",
      "La obediencia perfecta a los mandamientos de la ley",
      "La justicia de Cristo imputada al creyente por la fe",
      "La pertenencia formal a la iglesia y el bautismo recibido"
    ],
    ans: 2,
    feedback: "El hombre que llegó sin vestimenta prefirió sus propias ropas gastadas — imagen de nuestra propia justicia (Isaías 64:6). La vestimenta de boda es «la justicia de Cristo, su propio carácter sin mancha, que por la fe se imparte a todos los que lo reciben como Salvador personal» (E.G. de White, Palabras de vida del gran Maestro)."
  },
  {
    q: "¿A qué compara el profeta Isaías (64:6) nuestra propia justicia?",
    opts: [
      "A un edificio construido sobre arena",
      "A una ofrenda quemada a medias",
      "A un trapo de inmundicia",
      "A una lámpara que se apaga rápidamente"
    ],
    ans: 2,
    feedback: "«Todas nuestras justicias como trapo de inmundicia» (Isaías 64:6). Por muy buenas que sean nuestras obras y esfuerzos religiosos, no pueden justificarnos ante Dios. Solo el manto de justicia de Cristo, recibido por fe, puede presentarnos limpios ante él."
  },
  {
    q: "¿Qué promete Dios cuando confesamos nuestros pecados, según 1 Juan 1:9?",
    opts: [
      "Que nos dará una señal visible para confirmar que fuimos perdonados",
      "Que es fiel y justo para perdonar y limpiarnos de toda maldad",
      "Que perdonará según la sinceridad y frecuencia de la confesión",
      "Que perdonará los pecados menores pero recordará los más graves"
    ],
    ans: 1,
    feedback: "«Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad» (1 Juan 1:9). El perdón no depende de nuestro mérito sino de la fidelidad y justicia de Dios. La promesa es absoluta: no solo perdón, sino limpieza total."
  },
  {
    q: "¿Qué tienen en común los mensajes iniciales de Juan el Bautista y de Jesús?",
    opts: [
      "Ambos prometían el establecimiento inmediato del reino político de Israel",
      "Ambos comenzaron predicando el arrepentimiento y la cercanía del reino de Dios",
      "Ambos se dirigían exclusivamente al pueblo judío de Jerusalén",
      "Ambos enseñaban que la ley mosaica había quedado abolida"
    ],
    ans: 1,
    feedback: "Juan dijo: «Arrepentíos, porque el reino de los cielos se ha acercado» (Mateo 3:2). Jesús dijo: «El tiempo se ha cumplido, y el reino de Dios se ha acercado; arrepentíos, y creed en el evangelio» (Marcos 1:15). El arrepentimiento no es un mensaje obsoleto — es la entrada al evangelio."
  },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Cómo cambia la historia de Éxodo 32–34 tu visión del carácter de Dios? ¿Qué te transmite sobre su disposición a perdonar incluso las rebeliones más flagrantes?", ref: "Éxodo 34:5-9" },
  { key: "rfl2", q: "¿Cuándo fue la última vez que sentiste la convicción del Espíritu Santo sobre algo en tu vida? ¿Cómo respondiste? ¿Fue fácil o difícil obedecer esa voz?", ref: "Juan 16:8 · Efesios 4:30" },
  { key: "rfl3", q: "¿Cómo distinguirías en tu propia vida entre el arrepentimiento genuino y el falso? ¿Hay algo de lo que te has «arrepentido» pero en realidad no has abandonado?", ref: "El camino a Cristo, cap. 7" },
  { key: "rfl4", q: "¿Qué significa prácticamente «vestirnos» con el manto de justicia de Cristo cada día? ¿Cómo lo llevarías a cabo en tu rutina esta semana?", ref: "Isaías 61:10 · Zacarías 3:4" },
  { key: "rfl5", q: "¿Cómo le explicarías el don del manto de justicia de Cristo a un amigo que siente que sus pecados son demasiado graves para ser perdonados?", ref: "1 Juan 1:9 · Romanos 2:4" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">El arrepentimiento <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>y el perdón</em></div>
      <div className="sec-sub">Décima Semana · Éxodo 34:1-9</div>

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
            <p>El arrepentimiento y el perdón son el corazón de la relación con Dios. Esta semana, a través de Éxodo 34, veremos que la gracia de Dios es capaz de superar incluso la peor rebelión. También exploraremos qué significa arrepentirse genuinamente y cómo vestirnos con el manto de justicia de Cristo.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Éxodo 34:6-7
            </div>
            <div className="honey-text">
              «¡Jehová! ¡Jehová! fuerte, misericordioso y piadoso; tardo para la ira, y grande en misericordia y verdad; que guarda misericordia a millares, que perdona la iniquidad, la rebelión y el pecado.»
            </div>
            <div className="honey-ref">Éxodo 34:6-7 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Dios perdona las peores rebeliones</strong> — la historia del becerro de oro muestra hasta dónde llega su gracia cuando hay arrepentimiento genuino.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>El arrepentimiento genuino es un don del Espíritu Santo</strong> — no nace de nuestro esfuerzo, sino de la convicción que él produce en nosotros.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>El manto de justicia de Cristo</strong> nos cubre completamente — no nuestra justicia imperfecta, sino la de él, imputada por fe.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabRebelion({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Rebelión</div>
      <div className="sec-sub">La historia de Éxodo 32–34 y la gracia de Dios</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>Israel acababa de hacer un pacto solemne con Dios — sellado con sangre, con plena conciencia de las consecuencias. Semanas después, quebrantaron ese pacto de la manera más flagrante posible. ¿Cómo respondió Dios?</p>
      </div>

      {REBELION_DATA.map(item => (
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
        <p>¿En qué se parece la historia de Israel a tu propia experiencia con Dios? ¿Hubo momentos en los que prometiste obediencia y luego fallaste? ¿Cómo respondió Dios?</p>
      </div>
    </>
  );
}

function TabEspiritu({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Espíritu</div>
      <div className="sec-sub">La convicción del Espíritu Santo y el arrepentimiento genuino</div>

      {ESPIRITU_DATA.map(item => (
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

      <div style={{ marginBottom: ".6rem" }}>
        <div className="card-label" style={{ padding: "0 .25rem .5rem" }}>Arrepentimiento genuino vs. falso</div>
        <div className="compare-grid">
          <div className="compare-col">
            <div className="compare-header ok">Genuino</div>
            <div className="compare-cell">
              {COMPARE_GENUINO.map((item, i) => (
                <div key={i} className="compare-item">{item}</div>
              ))}
            </div>
          </div>
          <div className="compare-col">
            <div className="compare-header red">Falso</div>
            <div className="compare-cell">
              {COMPARE_FALSO.map((item, i) => (
                <div key={i} className="compare-item">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 31, pp. 271-272</div>
        <div className="egw-text">«A menudo nos apenamos porque nuestras malas acciones nos producen consecuencias desagradables. Pero esto no es arrepentimiento. <strong>El verdadero pesar por el pecado es resultado de la obra del Espíritu Santo.</strong> El Espíritu revela la ingratitud del corazón que ha despreciado y agraviado al Salvador, y nos trae contritos al pie de la cruz.»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El camino a Cristo, cap. 7, p. 88</div>
        <div className="egw-text">«No hay evidencia de arrepentimiento verdadero cuando no se produce una reforma en la vida. <strong>Si restituye la prenda, devuelve lo que haya robado, confiesa sus pecados y ama a Dios y a su prójimo,</strong> el pecador puede estar seguro de que pasó de muerte a vida.»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El camino a Cristo, cap. 7, p. 21</div>
        <div className="egw-text">«El arrepentimiento incluye tristeza por el pecado y abandono del mismo. <strong>No renunciaremos al pecado a menos que nos demos cuenta de su malignidad.</strong> Mientras no lo repudiemos de corazón, no habrá cambio real en nuestra vida.»</div>
      </div>
    </>
  );
}

function TabVestidura({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Vestidura</div>
      <div className="sec-sub">El manto de justicia de Cristo — identidad y cobertura</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">La metáfora de la ropa</div>
        <p>La Biblia usa la ropa como símbolo de identidad espiritual. Desde el jardín del Edén hasta el banquete de bodas del Apocalipsis, lo que vestimos representa quién somos delante de Dios. ¿Elegimos nuestra propia ropa sucia o el manto limpio que Cristo ofrece?</p>
      </div>

      {VESTIDURA_DATA.map(item => (
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

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · Palabras de vida del gran Maestro, cap. 24, p. 256</div>
        <div className="egw-text">«Este hermoso lino blanco es la justicia de Cristo, <strong>su propio carácter sin mancha, que por la fe se imparte a todos los que lo reciben como Salvador personal.</strong> Debe elegirse diariamente vestirnos con el manto de justicia de Jesús.»</div>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>Debemos elegir diariamente vestirnos con el manto de justicia de Jesús. ¿Qué significa esto realmente y cómo lo llevamos a cabo en la práctica?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien el arrepentimiento y el perdón." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre estas verdades esenciales." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar el material de esta semana." :
                "Vale la pena releer el material. Estas verdades son fundamentales para la vida cristiana.";
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
      <div className="sec-sub">Reflexión en grupo y para tu vida</div>

      <div className="card">
        <div className="card-label">Puntos clave · Éxodo 34:1-9</div>
        <p>Dios está dispuesto a perdonar los pecados más graves cuando los confesamos. Identificar nuestros pecados en respuesta a las indicaciones del Espíritu Santo y rendírselos en arrepentimiento son partes vitales de una relación próspera con Dios. Saber que somos completamente perdonados y cubiertos por el manto de justicia de Jesús es la experiencia más transformadora para un ser humano.</p>
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

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>En algún momento de esta semana —en clase, con tus amigos, en tu cabeza mientras scrolleás— vas a hacer o pensar algo que sabes que está mal. No es predicción, es realidad. La pregunta no es si vas a fallar, sino qué hacés con eso.</p>
          <br />
          <p>El mundo te dice que te perdones a vos mismo rápido y sigas. Eso no es arrepentimiento — es anestesia. El Espíritu Santo te dice algo diferente: <strong>«Mirá eso de frente. No lo justifiques. Traelo a Dios.»</strong></p>
          <br />
          <p>Y cuando lo traés, pasa algo que ningún motivador de Instagram puede ofrecerte: Dios, que conoce todo lo que hiciste, dice «te perdono» y te viste de nuevo con algo limpio. No porque te lo ganaste, sino porque Cristo lo pagó. Eso es lo que cambia el corazón de verdad.</p>
          <br />
          <p>Esta semana, cuando el Espíritu te toque el hombro, no lo ignores. Respondé. Confesá. Y recibí lo que Dios quiere darte: perdón completo y un nuevo comienzo, sin condiciones adicionales.</p>
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
    { id: "inicio",    label: "Inicio",   Icon: Home },
    { id: "rebelion",  label: "Rebelión", Icon: Shield },
    { id: "espiritu",  label: "Espíritu", Icon: Zap },
    { id: "vestidura", label: "Vestidura",Icon: Heart },
    { id: "biblia",    label: "Biblia",   Icon: BookOpen },
    { id: "quiz",      label: "Quiz",     Icon: HelpCircle },
    { id: "cierre",    label: "Cierre",   Icon: Flame },
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
              InVerso · Semana 10
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              El arrepentimiento <em>y el perdón</em>
            </h1>
            <div className="hero-ref">Éxodo 34:1-9 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"    && <TabInicio teacherMode={teacherMode} />}
            {tab === "rebelion"  && <TabRebelion openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "espiritu"  && <TabEspiritu openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "vestidura" && <TabVestidura openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "biblia"    && <TabBiblia openVerses={openVerses} toggle={toggleVerse} renderVerseText={renderVerseText} />}
            {tab === "quiz"      && (
              <TabQuiz
                quizIdx={quizIdx} quizSelected={quizSelected}
                quizAnswered={quizAnswered} quizResults={quizResults}
                quizDone={quizDone} score={score}
                selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz}
              />
            )}
            {tab === "cierre"    && <TabCierre />}
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
