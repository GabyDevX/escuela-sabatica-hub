import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Heart, Users, Shield
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0f0806;--bg2:#1a1108;--bg3:#2a1c0e;--surf:#2d1e12;--surf2:#3d2c1a;--brd:#4d3822;--brd2:#6d5238;--tx:#f5ede6;--tx2:#c9a88e;--tx3:#8c6a50;--acc:#e8683a;--acc2:#f09060;--acc3:#fcd0b0;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#f59e0b;--warn-d:rgba(245,158,11,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#2a1608 0%,#1a1108 55%,#0f0806 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(232,104,58,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(232,104,58,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(232,104,58,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(232,104,58,.3) 30%,rgba(232,104,58,.3) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:40px;min-height:56px;padding:.6rem .2rem .5rem;font-size:.42rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:18px;height:18px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(232,104,58,.08);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(232,104,58,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(245,158,11,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(232,104,58,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(232,104,58,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(232,104,58,.07),rgba(232,104,58,.02));border:1px solid rgba(232,104,58,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(232,104,58,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(232,104,58,.10),rgba(232,104,58,.03));border:1px solid rgba(232,104,58,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(232,104,58,.10),rgba(232,104,58,.02));border:1.5px solid rgba(232,104,58,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.compare-header{font-family:'IBM Plex Mono',monospace;font-size:.54rem;text-transform:uppercase;letter-spacing:.08em;padding:.4rem .55rem;border-radius:8px 8px 0 0;text-align:center;font-weight:500}
.compare-header.red{background:var(--err-d);color:var(--err)}
.compare-header.ok{background:var(--ok-d);color:var(--ok)}
.compare-cell{background:var(--surf);border:1px solid var(--brd);border-top:none;padding:.55rem .6rem}
.compare-cell:last-child{border-radius:0 0 8px 8px}
.compare-item{font-size:.91rem;line-height:1.5;color:var(--tx2);padding:.28rem 0;border-bottom:1px solid var(--brd)}
.compare-item:last-child{border-bottom:none}
.love-cat{margin-bottom:1rem}
.love-cat-title{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.5rem;display:flex;align-items:center;gap:.4rem}
.love-cat-refs{display:flex;flex-wrap:wrap;gap:.4rem}
.love-ref-chip{font-family:'IBM Plex Mono',monospace;font-size:.6rem;padding:.25rem .6rem;border-radius:8px;background:rgba(232,104,58,.10);border:1px solid rgba(232,104,58,.18);color:var(--tx2)}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: La historia del pastor G.", desc: "Contar la historia del pastor que le gritó a un conductor que resultó ser un visitante de la iglesia. Preguntar: ¿qué tipo de impresión dejamos en los demás como creyentes? Conectar: esta semana veremos cómo hablar de Jesús al mundo con valentía y amor." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración. Orar pidiendo valentía y amor para ser testigos fieles de Cristo en cada interacción cotidiana." },
  { time: "05–12 min", title: "Tab Testigos — Hechos 4:13; Mateo 28:19", desc: "Explorar qué significa ser testigo. Énfasis: Dios usa personas comunes — los discípulos eran pescadores sin preparación académica. El testimonio real es compartir lo que Dios hace en tu vida. Preguntar: ¿cuándo fue la última vez que hablaste de lo que Dios hizo por ti?" },
  { time: "12–18 min", title: "Tab Valentía — Hechos 4:13, 20, 29-31", desc: "Desarrollar la valentía de los discípulos ante el concilio. Usar la tabla de contraste 'Sin amor vs. Con amor'. Preguntar: ¿de dónde venía la valentía de Pedro y Juan? ¿Cómo podemos tener esa misma valentía hoy?" },
  { time: "18–24 min", title: "Tab Amor — 1 Juan 4:7-11; Mateo 9:36", desc: "Explorar los consejos prácticos para hablar de Jesús. Conectar con los versículos sobre el amor. Preguntar: ¿qué pasos concretos puedes dar esta semana para hablar de Cristo a alguien?" },
  { time: "24–28 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Pausar especialmente en la pregunta 3 (valentía de Pedro y Juan) y la pregunta 7 (motivación de Jesús). Son los momentos más aplicables de la lección." },
  { time: "28–30 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Leer en voz alta la cita de Elena G. de White sobre el amor que brota espontáneamente. Invitar a una oración personal: pedir a Dios valentía y amor para hablar de Jesús esta semana." },
];

const TESTIGOS_DATA = [
  {
    key: "ts1", badge: "Mateo 28:19",
    name: "1. El gran mandato",
    body: "Jesús nos dio el mandato de compartir su mensaje con el mundo: «Vayan y hagan discípulos» (Mateo 28:19, NTV). La misión de la Iglesia Adventista del Séptimo Día es hacer discípulos, que a su vez hagan otros discípulos. De esa manera, todos estamos predicando el evangelio eterno y el mensaje de los tres ángeles para preparar al mundo para el pronto regreso de Jesús."
  },
  {
    key: "ts2", badge: "Hechos 1:8",
    name: "2. El poder para testificar",
    body: "Jesús les prometió a sus discípulos: «Cuando el Espíritu Santo venga sobre ustedes, recibirán poder y saldrán a dar testimonio de mí, en Jerusalén, en toda la región de Judea y de Samaria, y hasta en las partes más lejanas de la tierra» (Hechos 1:8). Sin el poder del Espíritu Santo, nuestro testimonio logra muy poco. Dios busca testigos que reconozcan su dependencia de él."
  },
  {
    key: "ts3", badge: "Hechos 4:13",
    name: "3. Personas improbables",
    body: "Cuando Jesús vino a esta tierra, eligió a las personas menos prometedoras para que predicaran su mensaje. Las barcas de los pescadores eran el último lugar donde se esperaría que Jesús encontrara el talento que necesitaba. Cuando la gente vio la valentía de Pedro, Juan y los demás discípulos, se maravilló porque les faltaba preparación académica. Esto atrajo aún más la atención sobre el poder de Cristo que obraba en ellos."
  },
  {
    key: "ts4", badge: "Apocalipsis 12:11",
    name: "4. Tu testimonio personal",
    body: "El verdadero testimonio es, en gran medida, el resultado de ser testigo ocular de lo que Dios está haciendo en tu vida, de darte cuenta de lo que él te está enseñando a medida que creces espiritualmente. Y, luego, solo se trata de compartir tu experiencia con los demás. Nuestro testimonio personal suele ser lo que más peso tiene, sobre todo en las primeras etapas del mismo (Apocalipsis 12:11)."
  },
];

const VALENTIA_DATA = [
  {
    key: "vl1", badge: "Hechos 1:8; 4:31",
    name: "1. El poder del Espíritu",
    body: "Los discípulos solo lograron tener un impacto a gran escala por medio del poder del Espíritu Santo. «Cuando hubieron orado, el lugar en que estaban congregados tembló; y todos fueron llenos del Espíritu Santo, y hablaban con denuedo la palabra de Dios» (Hechos 4:31). El Espíritu Santo les dio poder para hacer cosas más allá de la capacidad humana y para predicar el mensaje de Cristo mucho más allá de sus fronteras."
  },
  {
    key: "vl2", badge: "Hechos 4:9",
    name: "2. Las buenas obras abren puertas",
    body: "El testimonio de los discípulos era más que palabras. En el nombre de Jesús, Pedro sanó a un cojo en el Templo de Jerusalén, lo que inmediatamente llamó la atención de la multitud y provocó la oposición de los dirigentes religiosos. Hoy en día, nuestro testimonio también debe incluir buenas obras a favor de los indefensos. Ayudar a las personas con sus necesidades físicas sensibiliza su corazón y da credibilidad a nuestro mensaje."
  },
  {
    key: "vl3", badge: "Hechos 4:20",
    name: "3. «No podemos callar»",
    body: "Las autoridades intentaron silenciar a Pedro y a Juan, pero ellos no se dejaron intimidar. No se contentaban con ser testigos pasivos. Se sentían impulsados a ser testigos activos de Cristo. Pedro y Juan declararon: «No podemos dejar de decir lo que hemos visto y oído» (Hechos 4:20). Cuando el amor de Cristo llena nuestro corazón, hablamos de él con la misma naturalidad con la que hablaríamos de un amigo."
  },
  {
    key: "vl4", badge: "Hechos 4:13, 29",
    name: "4. Valentía que viene de Jesús",
    body: "Hechos 4 utiliza repetidamente la palabra «valentía» para describir el testimonio de los discípulos (Hechos 4:13, 29, 31). Cuando la gente observaba a los discípulos y escuchaba sus palabras, se daba cuenta de que no se trataba de una valentía que naciera de la autoconfianza, sino de una valentía que era el resultado de haber pasado tiempo con Jesús. «Habían estado con Jesús» (Hechos 4:13)."
  },
];

const CONSEJOS_DATA = [
  {
    key: "c1", badge: "Paso 1",
    name: "Construye una amistad",
    body: "Relaciónate con la persona y construye una amistad con el tiempo. Tu calidez, amabilidad e interés genuino lo ayudarán a acercarse a Dios. Algunos llaman a esto «evangelismo a través de la amistad»."
  },
  {
    key: "c2", badge: "Paso 2",
    name: "Ora por oportunidades",
    body: "Ora para que el Espíritu Santo obre en el corazón de la persona y para que se te presenten las oportunidades adecuadas para interactuar con ella. Pídele a Dios que te dé valentía, pero también gentileza en tu acercamiento."
  },
  {
    key: "c3", badge: "Paso 3",
    name: "Comparte con naturalidad",
    body: "Busca formas naturales de hablar sobre tus experiencias de fe para ofrecerte a orar por la persona. Cuando el amor a Cristo llena nuestro corazón, hablamos de él con la misma naturalidad con la que hablaríamos de un amigo."
  },
  {
    key: "c4", badge: "Paso 4",
    name: "Conecta con la comunidad",
    body: "Busca formas de conectar a tu nuevo amigo con otras personas de la iglesia para que pueda experimentar el abrazo de la comunidad de la fe. Un evento social o un pequeño grupo de estudio bíblico es un buen siguiente paso."
  },
  {
    key: "c5", badge: "Paso 5",
    name: "Comparte promesas bíblicas",
    body: "Ora por las necesidades o preguntas que pueda tener tu nuevo amigo y busca una oportunidad para mostrarle cómo la Biblia ofrece consuelo, consejo y guía. Al principio, puedes compartir una promesa bíblica o responder una pregunta, lo que abrirá la puerta a un análisis más profundo."
  },
  {
    key: "c6", badge: "Paso 6",
    name: "Invita a dar el siguiente paso",
    body: "Llegará un momento en el que querrás preguntarle a tu amigo si le gustaría dar el siguiente paso: estudiar la Biblia y después bautizarse. No te apresures en estos pasos, pero tampoco te demores. Ora por ello."
  },
  {
    key: "c7", badge: "Vivir",
    name: "Tus acciones lo dicen todo",
    body: "Nuestras acciones deben revelar a quién pertenecemos. La forma en que tratamos a los demás lo dice todo. A medida que nuestro carácter se va moldeando a imagen de Cristo (santificación), vamos viviendo para atraer a todas las personas hacia él. Al igual que un niño aprende poco a poco a caminar, tú empiezas dando pequeños pasos."
  },
];

const COMPARE_SIN = [
  "«Como metal que resuena» (1 Cor 13:1)",
  "Obligar a aceptar la verdad",
  "Buscar convertir solo con argumentos",
  "Representar mal a Cristo con nuestras acciones",
  "Esperar que vengan los necesitados",
  "Hablar sin escuchar ni construir relación",
];

const COMPARE_CON = [
  "Palabras llenas de poder y gracia",
  "Invitar con gentileza y respeto",
  "Construir relaciones genuinas primero",
  "Reflejar el carácter de Cristo en todo",
  "Ministrar activamente a los necesitados",
  "Escuchar, orar y compartir con amor",
];

const VERSES = [
  {
    ref: "Hechos 4:13-17", isBase: true,
    text: `13 Entonces viendo el denuedo de Pedro y de Juan, y sabiendo que eran hombres sin letras y del vulgo, se maravillaban; y les reconocían que habían estado con Jesús. 14 Y viendo al hombre que había sido sanado, que estaba en pie con ellos, no podían decir nada en contra. 15 Entonces les ordenaron que salieran del concilio; y conferenciaban entre sí, 16 diciendo: ¿Qué haremos con estos hombres? Porque de cierto, señal satisfactoria ha sido hecha por ellos, notoria a todos los que moran en Jerusalén, y no lo podemos negar. 17 Sin embargo, para que no se divulgue más entre el pueblo, amenacémosles para que no hablen de aquí en adelante a hombre alguno en este nombre.`
  },
  {
    ref: "Hechos 1:8",
    text: `Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra.`
  },
  {
    ref: "Hechos 4:9-12",
    text: `9 Puesto que hoy se nos interroga acerca del beneficio hecho a un hombre enfermo, de qué manera éste haya sido sanado, 10 sea notorio a todos vosotros, y a todo el pueblo de Israel, que en el nombre de Jesucristo de Nazaret, a quien vosotros crucificasteis y a quien Dios resucitó de los muertos, por él este hombre está en vuestra presencia sano. 11 Este Jesús es la piedra reprobada por vosotros los edificadores, la cual ha venido a ser cabeza del ángulo. 12 Y en ningún otro hay salvación; porque no hay otro nombre bajo el cielo, dado a los hombres, en que podamos ser salvos.`
  },
  {
    ref: "Hechos 4:20",
    text: `Porque no podemos dejar de decir lo que hemos visto y oído.`
  },
  {
    ref: "Hechos 4:29-31",
    text: `29 Y ahora, Señor, mira sus amenazas, y concede a tus siervos que con todo denuedo hablen tu palabra, 30 mientras extiendes tu mano para que se hagan sanidades y señales y prodigios mediante el nombre de tu santo Hijo Jesús. 31 Cuando hubieron orado, el lugar en que estaban congregados tembló; y todos fueron llenos del Espíritu Santo, y hablaban con denuedo la palabra de Dios.`
  },
  {
    ref: "Mateo 28:19-20",
    text: `19 Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; 20 enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.`
  },
  {
    ref: "1 Juan 4:7-11",
    text: `7 Amados, amémonos unos a otros; porque el amor es de Dios. Todo aquel que ama, es nacido de Dios, y conoce a Dios. 8 El que no ama, no ha conocido a Dios; porque Dios es amor. 9 En esto se mostró el amor de Dios para con nosotros, en que Dios envió a su Hijo unigénito al mundo, para que vivamos por él. 10 En esto consiste el amor: no en que nosotros hayamos amado a Dios, sino en que él nos amó a nosotros, y envió a su Hijo en propiciación por nuestros pecados. 11 Amados, si Dios nos ha amado así, debemos también nosotros amarnos unos a otros.`
  },
  {
    ref: "Romanos 5:8",
    text: `Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros.`
  },
  {
    ref: "Juan 3:16",
    text: `Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.`
  },
  {
    ref: "Juan 15:9-10",
    text: `9 Como el Padre me ha amado, así también yo os he amado; permaneced en mi amor. 10 Si guardareis mis mandamientos, permaneceréis en mi amor; así como yo he guardado los mandamientos de mi Padre, y permanezco en su amor.`
  },
  {
    ref: "Romanos 8:38-39",
    text: `38 Por lo cual estoy seguro de que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir, 39 ni lo alto, ni lo profundo, ni ninguna otra cosa creada nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro.`
  },
  {
    ref: "1 Corintios 13:1-3",
    text: `1 Si yo hablase lenguas humanas y angélicas, y no tengo amor, vengo a ser como metal que resuena, o címbalo que retiñe. 2 Y si tuviese profecía, y entendiese todos los misterios y toda ciencia, y si tuviese toda la fe, de tal manera que trasladase los montes, y no tengo amor, nada soy. 3 Y si repartiese todos mis bienes para dar de comer a los pobres, y si entregase mi cuerpo para ser quemado, y no tengo amor, de nada me sirve.`
  },
  {
    ref: "Juan 13:35",
    text: `En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros.`
  },
  {
    ref: "Mateo 9:36",
    text: `Y al ver las multitudes, tuvo compasión de ellas; porque estaban desamparadas y dispersas como ovejas que no tienen pastor.`
  },
  {
    ref: "Isaías 50:4",
    text: `Jehová el Señor me dio lengua de sabios, para saber hablar palabras al cansado; despertará mañana tras mañana, despertará mi oído para que oiga como los sabios.`
  },
  {
    ref: "1 Pedro 3:15",
    text: `Sino santificad a Dios el Señor en vuestros corazones, y estad siempre preparados para presentar defensa con mansedumbre y reverencia ante todo el que os demande razón de la esperanza que hay en vosotros.`
  },
  {
    ref: "Jeremías 20:9",
    text: `Y dije: No me acordaré más de él, ni hablaré más en su nombre; no obstante, había en mi corazón como un fuego ardiente metido en mis huesos; traté de sufrirlo, y no pude.`
  },
  {
    ref: "2 Corintios 5:14",
    text: `Porque el amor de Cristo nos constriñe, pensando esto: que si uno murió por todos, luego todos murieron.`
  },
  {
    ref: "Mateo 23:37",
    text: `¡Jerusalén, Jerusalén, que matas a los profetas, y apedreas a los que te son enviados! ¡Cuántas veces quise juntar a tus hijos, como la gallina junta sus polluelos debajo de las alas, y no quisiste!`
  },
  {
    ref: "Apocalipsis 12:11",
    text: `Y ellos le han vencido por medio de la sangre del Cordero y de la palabra del testimonio de ellos, y menospreciaron sus vidas hasta la muerte.`
  },
  {
    ref: "2 Pedro 3:18",
    text: `Antes bien, creced en la gracia y el conocimiento de nuestro Señor y Salvador Jesucristo. A él sea gloria ahora y hasta el día de la eternidad. Amén.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Qué prometió Jesús que recibirían los discípulos cuando viniera el Espíritu Santo (Hechos 1:8)?",
    opts: [
      "Riquezas materiales para financiar la obra misionera",
      "Poder para ser sus testigos hasta lo último de la tierra",
      "Protección contra toda forma de persecución",
      "La capacidad de hablar todos los idiomas del mundo"
    ],
    ans: 1,
    feedback: "Jesús les prometió: «Recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra» (Hechos 1:8). El poder era para testificar, no para beneficio propio."
  },
  {
    q: "Según la lección, ¿qué es el verdadero testimonio cristiano?",
    opts: [
      "Predicar sermones elaborados en la calle",
      "Dar complicados estudios bíblicos de manera formal",
      "Compartir lo que Dios está haciendo en tu vida con naturalidad",
      "Memorizar y recitar versículos de la Biblia a desconocidos"
    ],
    ans: 2,
    feedback: "El verdadero testimonio es, en gran medida, el resultado de ser testigo ocular de lo que Dios está haciendo en tu vida, y luego compartir tu experiencia con los demás. Cuando el amor a Cristo llena nuestro corazón, hablamos de él con la misma naturalidad con la que hablaríamos de un amigo."
  },
  {
    q: "¿Por qué se maravilló la gente al ver la valentía de Pedro y Juan (Hechos 4:13)?",
    opts: [
      "Porque eran los más ricos y poderosos de Jerusalén",
      "Porque eran hombres sin letras y del vulgo que habían estado con Jesús",
      "Porque habían estudiado en las mejores escuelas rabínicas",
      "Porque realizaron milagros que nadie había visto antes"
    ],
    ans: 1,
    feedback: "La gente se maravilló porque Pedro y Juan eran «hombres sin letras y del vulgo» — pescadores sin preparación académica. Su valentía no venía de la autoconfianza, sino de haber estado con Jesús. Esto atrajo aún más la atención sobre el poder de Cristo."
  },
  {
    q: "¿Qué declararon Pedro y Juan cuando les ordenaron dejar de hablar de Jesús (Hechos 4:20)?",
    opts: [
      "Prometieron obedecer y dejaron de predicar",
      "Pidieron permiso al concilio para seguir predicando",
      "«No podemos dejar de decir lo que hemos visto y oído»",
      "Respondieron con insultos y amenazas al concilio"
    ],
    ans: 2,
    feedback: "Pedro y Juan declararon: «No podemos dejar de decir lo que hemos visto y oído» (Hechos 4:20). No se contentaban con ser testigos pasivos. Se sentían impulsados a ser testigos activos de Cristo, sin importar las consecuencias."
  },
  {
    q: "Según 1 Corintios 13:1-3, ¿qué sucede si hacemos grandes obras pero no tenemos amor?",
    opts: [
      "Dios igualmente bendice nuestros esfuerzos",
      "Nuestras obras compensan la falta de amor",
      "De nada nos sirve; somos como metal que resuena",
      "Las personas se convertirán de todas formas"
    ],
    ans: 2,
    feedback: "Pablo dice que sin amor, venimos a ser «como metal que resuena» y que «nada soy» y «de nada me sirve» (1 Corintios 13:1-3). El amor es absolutamente fundamental para cualquier tipo de testimonio eficaz."
  },
  {
    q: "Según la lección, ¿cuál es el primer paso para hablar de Jesús a alguien?",
    opts: [
      "Entregarle un tratado religioso la primera vez que lo veas",
      "Construir una amistad genuina con la persona",
      "Invitarlo directamente a la iglesia sin conocerlo",
      "Explicarle todas las doctrinas adventistas en una conversación"
    ],
    ans: 1,
    feedback: "El primer consejo es relacionarte con la persona y construir una amistad con el tiempo. Tu calidez, amabilidad e interés genuino lo ayudarán a acercarse a Dios. Algunos llaman a esto «evangelismo a través de la amistad»."
  },
  {
    q: "¿Qué motivó a Jesús a trabajar incansablemente por la humanidad (Mateo 9:36)?",
    opts: [
      "La obligación de cumplir su misión cósmica",
      "El deseo de demostrar su poder ante las multitudes",
      "El amor y la compasión al ver a la gente desamparada",
      "La necesidad de ganar seguidores para su movimiento"
    ],
    ans: 2,
    feedback: "«Al ver a la gente, sintió compasión de ellos, porque estaban cansados y abatidos, como ovejas que no tienen pastor» (Mateo 9:36). El amor y la compasión de Jesús hacia la humanidad impulsaron su labor incansable."
  },
  {
    q: "Según la lección, ¿debemos obligar a alguien a aceptar la verdad bíblica?",
    opts: [
      "Sí, porque la verdad es más importante que la libertad de elección",
      "No, la coacción va contra la esencia misma del carácter de Dios",
      "Depende de la situación y de la urgencia del mensaje",
      "Solo debemos insistir con las personas que ya mostraron interés"
    ],
    ans: 1,
    feedback: "La lección es clara: la coacción va contra la esencia misma del carácter de Dios. Jesús nunca obligó a nadie a seguirlo a él ni su verdad, pero nunca se dio por vencido con nosotros. Nuestro enfoque siempre debe reflejar el enfoque de Jesús: invitar, no forzar."
  },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Cómo se prepararon los discípulos para ser testigos de Jesús y qué podemos aprender de su ejemplo?", ref: "Hechos 1:8; 4:13" },
  { key: "rfl2", q: "¿De qué manera el testimonio de los discípulos fue intencional, decidido y valiente?", ref: "Hechos 4:13, 20, 29, 31" },
  { key: "rfl3", q: "¿Por qué es el amor tan fundamental para cualquier tipo de testimonio eficaz?", ref: "Juan 13:35 · 1 Corintios 13:1-3" },
  { key: "rfl4", q: "¿Qué debería motivarnos a hablarles a las personas de Cristo y cómo evitar caer en la coacción?", ref: "Mateo 9:36 · Mateo 23:37" },
  { key: "rfl5", q: "¿Cuál ha sido tu experiencia al hablar de Cristo? ¿Qué lecciones has aprendido?", ref: "2 Pedro 3:18 · Apocalipsis 12:11" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Hablar de Jesús <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>al mundo</em></div>
      <div className="sec-sub">Duodécima Semana · Hechos 4</div>

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
            <p>Al pastor G. le esperaba un sábado muy ajetreado. Camino a la iglesia, un auto se le cruzó por delante. Pisó el freno, levantó el puño y le gritó al conductor. Cuando llegó a dar la clase de Escuela Sabática, reconoció un rostro familiar: era el conductor al que le había gritado veinte minutos antes — un visitante no adventista. El pastor G. se dio cuenta de cómo cada interacción, tanto con conocidos como con desconocidos, debe estar bañada por el amor de Dios.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Hechos 4:13
            </div>
            <div className="honey-text">
              «Entonces viendo el denuedo de Pedro y de Juan, y sabiendo que eran hombres sin letras y del vulgo, se maravillaban; y les reconocían que habían estado con Jesús.»
            </div>
            <div className="honey-ref">Hechos 4:13 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Cuando el amor de Dios y su Palabra llenan nuestra vida cotidiana,</strong> nos sentimos impulsados a compartirlo con quienes nos rodean.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Debemos ser personas de oración, reflexivas e intencionales</strong> al testificar, confiando en el poder del Espíritu Santo.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>A medida que pasamos tiempo a solas con Dios,</strong> él nos enseña y nos da palabras para hablar con los demás.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabTestigos({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Testigos</div>
      <div className="sec-sub">Somos testigos suyos — Hechos 4; Mateo 28:19</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>La pregunta no debe ser si nuestra vida es un testimonio, porque todo creyente deja en los demás algún tipo de impresión sobre Dios. La pregunta es qué tipo de testigos somos. ¿Hacemos que las personas se sientan atraídas a Cristo, o que sientan rechazo por lo mal que lo representamos?</p>
      </div>

      {TESTIGOS_DATA.map(item => (
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
        <p>¿Alguna vez has mirado los rostros de extraños en una multitud y te has preguntado si conocen a Jesús? ¿Alguna vez has sentido lo que solo puede ser el amor de Dios en ti hacia un extraño en necesidad?</p>
      </div>
    </>
  );
}

function TabValentia({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Valentía</div>
      <div className="sec-sub">Con toda valentía — Hechos 4:13-31</div>

      {VALENTIA_DATA.map(item => (
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
        <div className="card-label" style={{ padding: "0 .25rem .5rem" }}>Testimonio sin amor vs. con amor</div>
        <div className="compare-grid">
          <div>
            <div className="compare-header red">Sin amor</div>
            <div className="compare-cell">
              {COMPARE_SIN.map((item, i) => (
                <div key={i} className="compare-item">{item}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="compare-header ok">Con amor</div>
            <div className="compare-cell">
              {COMPARE_CON.map((item, i) => (
                <div key={i} className="compare-item">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 53, p. 462</div>
        <div className="egw-text">«No es parte de la misión de Cristo obligar a los hombres a recibirlo. Satanás y los hombres impulsados por su espíritu son quienes procuran violentar las conciencias. <strong>No puede haber una evidencia más concluyente de que poseemos el espíritu de Satanás que el deseo de dañar y destruir a los que no aprecian nuestro trabajo u obran contrariamente a nuestras ideas.</strong>»</div>
      </div>
    </>
  );
}

function TabAmor({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Amor</div>
      <div className="sec-sub">El amor como fundamento del testimonio — 1 Juan 4:7-11</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Motivación</div>
        <p>«Al ver a la gente, sintió compasión de ellos, porque estaban cansados y abatidos, como ovejas que no tienen pastor» (Mateo 9:36). El amor y la compasión de Jesús hacia la humanidad impulsaron su labor. Igualmente, el amor de Dios en nosotros debería impulsarnos a sentir la responsabilidad de llevar a las almas a él y a su verdad (2 Corintios 5:14).</p>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Versículos sobre el amor</div>
        <div className="love-cat">
          <div className="love-cat-title"><Heart size={11} /> El amor de Dios manifestado al mundo</div>
          <div className="love-cat-refs">
            <span className="love-ref-chip">1 Juan 4:7-11</span>
            <span className="love-ref-chip">Romanos 5:8</span>
            <span className="love-ref-chip">Juan 3:16</span>
          </div>
        </div>
        <div className="love-cat">
          <div className="love-cat-title"><Heart size={11} /> Permanecer siempre en el amor de Dios</div>
          <div className="love-cat-refs">
            <span className="love-ref-chip">Juan 15:9-10</span>
            <span className="love-ref-chip">Romanos 8:38-39</span>
          </div>
        </div>
        <div className="love-cat">
          <div className="love-cat-title"><Heart size={11} /> Inutilidad del ministerio sin amor</div>
          <div className="love-cat-refs">
            <span className="love-ref-chip">1 Corintios 13:1-3</span>
            <span className="love-ref-chip">Juan 13:35</span>
          </div>
        </div>
      </div>

      <div className="card-label" style={{ padding: "0 .25rem .5rem" }}>Consejos para hablar de Jesús</div>
      {CONSEJOS_DATA.map(item => (
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
        <p>Jeremías expresó esto cuando dijo: «Tu palabra en mi interior se convierte en un fuego que devora, que me cala hasta los huesos. Trato de contenerla, pero no puedo» (Jeremías 20:9). ¿Sientes ese fuego en tu corazón? ¿Qué pasos concretos puedes dar esta semana para hablar de Cristo a alguien?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien cómo hablar de Jesús al mundo con valentía y amor." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre el testimonio cristiano." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar el material de esta semana." :
                "Vale la pena releer el material. Estas verdades son fundamentales para nuestra misión como testigos.";
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
        <div className="card-label">Puntos clave · Hechos 4</div>
        <p>Cuando el amor de Dios y su Palabra llenan nuestra vida cotidiana, nos sentimos impulsados a compartirlo con quienes nos rodean. Debemos ser personas de oración, reflexivas e intencionales al testificar. A medida que pasamos tiempo a solas con Dios, él nos enseña y nos da palabras para hablar con los demás.</p>
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

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · Palabras de vida del gran Maestro, cap. 27, p. 318</div>
        <div className="egw-text">«Cuando el yo está sumergido en Cristo, <strong>el amor brota espontáneamente.</strong> La plenitud del carácter cristiano se alcanza cuando el impulso a ayudar y beneficiar a otros brota constantemente de adentro, cuando la luz del cielo llena el corazón y se revela en el semblante.»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · Palabras de vida del gran Maestro, p. 98</div>
        <div className="egw-text">«Todos los que reciben el mensaje del evangelio en su corazón anhelarán proclamarlo. El amor de Cristo ha de expresarse. <strong>No es natural que alguien mantenga secretas estas cosas, y aquellos que están llenos del amor de Cristo no lo harán.</strong>»</div>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Piensa en las personas que Dios ha puesto en tu camino: el vecino, el compañero de trabajo, el familiar que aún no conoce a Cristo. ¿Qué impresión les estás dejando sobre Dios?</p>
          <br />
          <p>Los discípulos eran pescadores sin preparación académica, pero la gente se maravilló de su valentía porque <strong>«habían estado con Jesús»</strong> (Hechos 4:13). No necesitaban títulos ni elocuencia — necesitaban una relación viva con Cristo.</p>
          <br />
          <p>Pedro y Juan declararon: «No podemos dejar de decir lo que hemos visto y oído» (Hechos 4:20). Cuando el amor de Cristo llena tu corazón, hablar de él se vuelve tan natural como hablar de un amigo.</p>
          <br />
          <p>Esta semana, pídele a Dios valentía para hablar de Jesús a alguien. No necesitas un sermón elaborado — solo comparte lo que él ha hecho en tu vida. <strong>Dios no busca personas elocuentes, busca personas dispuestas.</strong> ¿Estás dispuesto?</p>
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
    { id: "testigos",  label: "Testigos",  Icon: Users },
    { id: "valentia",  label: "Valentía",  Icon: Shield },
    { id: "amor",      label: "Amor",      Icon: Heart },
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
              InVerso · Semana 12
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Hablar de Jesús <em>al mundo</em>
            </h1>
            <div className="hero-ref">Hechos 4 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"   && <TabInicio teacherMode={teacherMode} />}
            {tab === "testigos" && <TabTestigos openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "valentia" && <TabValentia openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "amor"     && <TabAmor openExpand={openExpand} toggleExpand={toggleExpand} />}
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
