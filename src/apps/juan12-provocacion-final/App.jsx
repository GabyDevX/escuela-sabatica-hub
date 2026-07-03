import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Heart, Users, Search
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0f0805;--bg2:#1a0f0a;--bg3:#28160e;--surf:#2e1a12;--surf2:#3c2418;--brd:#4a2e1e;--brd2:#6a462e;--tx:#f5ece6;--tx2:#cfb09a;--tx3:#907058;--acc:#b8552e;--acc2:#e08050;--acc3:#f5b88c;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#e0a83c;--warn-d:rgba(224,168,60,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#241209 0%,#1a0f0a 55%,#0f0805 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(184,85,46,.20) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(184,85,46,.25);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(184,85,46,.05)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(184,85,46,.32) 30%,rgba(184,85,46,.32) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:40px;min-height:56px;padding:.6rem .2rem .5rem;font-size:.42rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:18px;height:18px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(184,85,46,.10);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(184,85,46,.14);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(224,168,60,.16);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(184,85,46,.04)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(184,85,46,.16);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(184,85,46,.09),rgba(184,85,46,.02));border:1px solid rgba(184,85,46,.20);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(184,85,46,.07);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(184,85,46,.12),rgba(184,85,46,.03));border:1px solid rgba(184,85,46,.25);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(184,85,46,.12),rgba(184,85,46,.03));border:1.5px solid rgba(184,85,46,.28);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(184,85,46,.06);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: La alarma de incendios", desc: "Compartir la ilustración de la intro: una decisión curiosa cuyas consecuencias son mucho mayores de lo que se imaginó. Conectar: Jesús, a diferencia de nosotros, sabía exactamente lo que sucedería después de resucitar a Lázaro, y aun así avanzó." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración. Orar pidiendo la disposición de escuchar realmente lo que Jesús dice, en lugar de lo que queremos oír." },
  { time: "05–12 min", title: "Tab Interioriza — Juan 11:47-54; 12:12-19", desc: "Contrastar la reacción de los líderes religiosos (Caifás) con la de la multitud. Ambos grupos actuaron por ambición egoísta y ninguno escuchó realmente a Jesús. Preguntar: ¿qué advertencia nos da esto como estudiantes de la Biblia?" },
  { time: "12–20 min", title: "Tab Interpreta — Juan 12:1-8", desc: "Desarrollar la escena de María ungiendo los pies de Jesús y la reacción de Judas y Simón. Énfasis: María fue la única que pareció escuchar lo que Jesús había estado diciendo sobre su muerte. Preguntar: ¿qué nos ayuda a recordar nuestros orígenes en Cristo, como lo hizo María?" },
  { time: "20–25 min", title: "Tab Investiga — referencias cruzadas", desc: "Repasar cómo Jesús preparó a sus discípulos (Marcos 8, 9, 10) y la derrota de Satanás en la cruz (Hebreos 2:10; Apocalipsis 12:10). Notar que los discípulos no entendían, a pesar de las advertencias repetidas." },
  { time: "25–28 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Detenerse especialmente en la pregunta sobre el grano de trigo (Juan 12:24) y en la del alma turbada (Juan 12:27), los momentos más íntimos del pasaje." },
  { time: "28–30 min", title: "Cierre e inQuiere", desc: "Usar las preguntas de discusión del tab Cierre en tres bloques: la respuesta de la gente, escuchar a Jesús, y el propósito de Cristo. Cerrar con la cita de Elena G. de White sobre el regalo fragante de María." },
];

const INTERIORIZA_DATA = [
  {
    key: "in1", badge: "Juan 11:47-48",
    name: "1. El temor de los líderes",
    body: "Tras la resurrección de Lázaro, los principales sacerdotes y los fariseos se reunieron en concilio, preocupados por la influencia que estaban perdiendo. «¿Qué hacemos? —se preguntaron—. Porque este hombre hace muchas señales. Si le dejamos así, todos creerán en él; y vendrán los romanos, y destruirán nuestro lugar santo y nuestra nación.» El miedo a perder su posición, más que el amor a la verdad, dirigía sus decisiones."
  },
  {
    key: "in2", badge: "Juan 11:49-53",
    name: "2. Caifás y la 'solución'",
    body: "Caifás, el sumo sacerdote, intentó convencerlos de que había una solución obvia, revistiéndola de un propósito divino: «No pensáis que nos conviene que un hombre muera por el pueblo, y no que toda la nación perezca» (v. 50). Irónicamente, profetizó sin saberlo que Jesús moriría por la nación. Caifás desempeñó un papel fundamental en la muerte de Aquel a quien él y su nación habían estado esperando."
  },
  {
    key: "in3", badge: "Juan 12:12-15",
    name: "3. La entrada triunfal",
    body: "Al día siguiente, la multitud, cuya expectación aumentaba, recibió a Jesús con una gran celebración: ramas de palmera y gritos de «¡Hosanna! Bendito el que viene en el nombre del Señor, el Rey de Israel!». Creían estar a punto de conseguir un nuevo rey terrenal. También tenían razón sobre quién era Jesús, pero no de la forma que esperaban."
  },
  {
    key: "in4", badge: "Juan 12:17-19",
    name: "4. Dos respuestas, un mismo error",
    body: "Un grupo quería destruir a Jesús; el otro, coronarlo rey. Sin embargo, ambos estaban impulsados por la ambición egoísta y la supervivencia, y ambos estaban equivocados porque ninguno escuchó realmente lo que Jesús decía sobre su propósito. Parafraseando a Elena G. de White: «Esperaban a un Mesías que no había sido prometido»."
  },
];

const INTERPRETA_DATA = [
  {
    key: "it1", badge: "Juan 12:1-3",
    name: "1. La fiesta en Betania",
    body: "Los amigos de Lázaro se reunieron en la casa de Simón, un leproso sanado, para celebrar su resurrección. En medio del agradecimiento general, María se acercó sigilosamente por detrás de Jesús y comenzó a ungirle los pies con un frasco de aceite de nardo puro, muy caro y aromático, secándoselos con su cabello. El relato de Lucas añade que también se los lavó con sus lágrimas (Lucas 7:38, 44). Fue un momento sincero de profunda gratitud."
  },
  {
    key: "it2", badge: "Juan 12:4-6",
    name: "2. El desprecio de Judas",
    body: "El dulce aroma llamó la atención de todos, pero no todos apreciaron el regalo. Judas Iscariote protestó: el perfume debió venderse y darse a los pobres. Juan aclara que su indignación no obedecía a la justicia, sino a la codicia, ya que Judas robaba del dinero del grupo. En el relato de Lucas, también Simón la menospreció, llamándola «pecadora» (Lucas 7:39)."
  },
  {
    key: "it3", badge: "Juan 12:7-8",
    name: "3. La única que escuchó",
    body: "Jesús intervino para tranquilizar a María, avergonzada por la crítica. Declaró que ella había hecho algo bueno: parecía ser la única que realmente había escuchado lo que él llevaba tiempo diciendo, pues estaba preparando su cuerpo para la sepultura. Nadie más comprendía cuán difíciles serían para él los acontecimientos que se avecinaban."
  },
  {
    key: "it4", badge: "Mateo 26:6-13",
    name: "4. Un recordatorio fragante",
    body: "Quizás esta ofrenda se convirtió en un recordatorio para Jesús durante sus últimas horas: al menos una persona respondería a la crucifixión y todo habría valido la pena. Mientras era acosado, maltratado y tentado a creer que a nadie le importaba, esa fragancia le recordaría la verdad. Al menos había una persona, y para él eso era suficiente."
  },
];

const XREF_PREPARO = [
  { ref: "Marcos 8:31-33", desc: "Jesús enseña por primera vez que debe padecer, ser desechado y morir. Pedro lo reprende, y Jesús le responde: «¡Quítate de delante de mí, Satanás!»." },
  { ref: "Marcos 9:30-32", desc: "Jesús repite el anuncio de su muerte y resurrección. Los discípulos no entienden la palabra y tienen miedo de preguntarle." },
  { ref: "Marcos 10:32-34", desc: "Subiendo a Jerusalén, Jesús detalla con más precisión lo que le sucederá: será entregado, condenado, escarnecido, azotado y muerto, y resucitará al tercer día." },
];

const XREF_MARIA = [
  { ref: "Mateo 26:6-13", desc: "Relato paralelo del ungimiento en Betania; Jesús declara que el gesto se recordará dondequiera que se predique el evangelio." },
  { ref: "Marcos 14:3-9", desc: "Otro relato del mismo episodio, con el mismo desenlace: la acción de María se predicará «en memoria de ella»." },
  { ref: "Lucas 7:36-50", desc: "Un episodio anterior similar en casa de Simón el fariseo, donde una mujer pecadora unge los pies de Jesús con lágrimas y perfume." },
];

const XREF_DERROTA = [
  { ref: "Hebreos 2:10", desc: "Convenía que Dios, al llevar muchos hijos a la gloria, perfeccionase por aflicciones al autor de la salvación de ellos." },
  { ref: "Apocalipsis 12:10", desc: "«Ahora ha venido la salvación... porque ha sido lanzado fuera el acusador de nuestros hermanos». La cruz selló la derrota de Satanás." },
];

const VERSES = [
  {
    ref: "Juan 12:23-33", isBase: true,
    text: `23 Jesús les respondió, diciendo: Ha llegado la hora para que el Hijo del Hombre sea glorificado. 24 De cierto, de cierto os digo, que si el grano de trigo no cae en la tierra y muere, queda solo; pero si muere, lleva mucho fruto. 25 El que ama su vida, la perderá; y el que aborrece su vida en este mundo, para vida eterna la guardará. 26 Si alguno me sirve, sígame; y donde yo estuviere, allí también estará mi servidor. Si alguno me sirviere, mi Padre le honrará. 27 Ahora está turbada mi alma; ¿y qué diré? ¿Padre, sálvame de esta hora? Mas para esto he llegado a esta hora. 28 Padre, glorifica tu nombre. Entonces vino una voz del cielo: Lo he glorificado, y lo glorificaré otra vez. 29 Y la multitud que estaba allí, y había oído la voz, decía que había sido un trueno. Otros decían: Un ángel le ha hablado. 30 Respondió Jesús y dijo: No ha venido esta voz por causa mía, sino por causa de vosotros. 31 Ahora es el juicio de este mundo; ahora el príncipe de este mundo será echado fuera. 32 Y yo, si fuere levantado de la tierra, a todos atraeré a mí mismo. 33 Y decía esto dando a entender de qué muerte iba a morir.`
  },
  {
    ref: "Juan 11:47-54",
    text: `47 Entonces los principales sacerdotes y los fariseos reunieron el concilio, y dijeron: ¿Qué hacemos? Porque este hombre hace muchas señales. 48 Si le dejamos así, todos creerán en él; y vendrán los romanos, y destruirán nuestro lugar santo y nuestra nación. 49 Entonces Caifás, uno de ellos, sumo sacerdote aquel año, les dijo: Vosotros no sabéis nada; 50 ni pensáis que nos conviene que un hombre muera por el pueblo, y no que toda la nación perezca. 51 Esto no lo dijo por sí mismo, sino que como era el sumo sacerdote aquel año, profetizó que Jesús había de morir por la nación; 52 y no solamente por la nación, sino también para congregar en uno a los hijos de Dios que estaban dispersos. 53 Así que, desde aquel día acordaron matarle. 54 Por tanto, Jesús ya no andaba abiertamente entre los judíos, sino que se alejó de allí a la región contigua al desierto, a una ciudad llamada Efraín; y se quedó allí con sus discípulos.`
  },
  {
    ref: "Juan 12:1-8",
    text: `1 Seis días antes de la pascua, vino Jesús a Betania, donde estaba Lázaro, que había muerto, y a quien había resucitado de los muertos. 2 Y le hicieron allí una cena; Marta servía, y Lázaro era uno de los que estaban sentados a la mesa con él. 3 Entonces María tomó una libra de perfume de nardo puro, de mucho precio, y ungió los pies de Jesús, y los enjugó con sus cabellos; y la casa se llenó del olor del perfume. 4 Y dijo uno de sus discípulos, Judas Iscariote hijo de Simón, el que le iba a entregar: 5 ¿Por qué no fue este perfume vendido por trescientos denarios, y dado a los pobres? 6 Pero dijo esto, no porque se cuidara de los pobres, sino porque era ladrón, y teniendo la bolsa, sustraía de lo que se echaba en ella. 7 Entonces Jesús dijo: Déjala; para el día de mi sepultura ha guardado esto. 8 Porque a los pobres siempre los tendréis con vosotros, mas a mí no siempre me tendréis.`
  },
  {
    ref: "Juan 12:12-19",
    text: `12 El siguiente día, grandes multitudes que habían venido a la fiesta, al oír que Jesús venía a Jerusalén, 13 tomaron ramas de palmera y salieron a recibirle, y clamaban: ¡Hosanna! Bendito el que viene en el nombre del Señor, el Rey de Israel! 14 Y halló Jesús un asnillo, y montó sobre él, como está escrito: 15 No temas, hija de Sion; he aquí tu Rey viene, montado sobre un pollino de asna. 16 Estas cosas no las entendieron sus discípulos al principio; pero cuando Jesús fue glorificado, entonces se acordaron de que estas cosas estaban escritas acerca de él, y de que se las habían hecho. 17 Y daba testimonio la gente que estaba con él cuando llamó a Lázaro del sepulcro, y le resucitó de los muertos. 18 Por lo cual también había venido la gente a recibirle, porque había oído que él había hecho esta señal. 19 Pero los fariseos dijeron entre sí: Ya veis que no conseguís nada. Mirad, el mundo se va tras él.`
  },
  {
    ref: "Marcos 8:31-33",
    text: `31 Y comenzó a enseñarles que el Hijo del Hombre debía padecer mucho, y ser desechado por los ancianos, por los principales sacerdotes y por los escribas, y ser muerto, y resucitar después de tres días. 32 Esto les decía claramente. Entonces Pedro le tomó aparte y comenzó a reconvenirle. 33 Pero él, volviéndose y mirando a sus discípulos, reprendió a Pedro, diciendo: ¡Quítate de delante de mí, Satanás! porque no pones la mira en las cosas de Dios, sino en las de los hombres.`
  },
  {
    ref: "Marcos 9:30-32",
    text: `30 Habiendo salido de allí, caminaron por Galilea; y no quería que nadie lo supiese. 31 Porque enseñaba a sus discípulos, y les decía: El Hijo del Hombre será entregado en manos de hombres, y le matarán; pero después de muerto, resucitará al tercer día. 32 Pero ellos no entendían esta palabra, y tenían miedo de preguntarle.`
  },
  {
    ref: "Marcos 10:32-34",
    text: `32 Iban por el camino subiendo a Jerusalén; y Jesús iba delante de ellos, y ellos estaban asombrados, y le seguían con miedo. Entonces, volviendo a tomar a los doce aparte, comenzó a decirles las cosas que le habían de acontecer: 33 He aquí subimos a Jerusalén, y el Hijo del Hombre será entregado a los principales sacerdotes y a los escribas, y le condenarán a muerte, y le entregarán a los gentiles. 34 Y le escarnecerán, le azotarán, y escupirán en él, y le matarán; mas al tercer día resucitará.`
  },
  {
    ref: "Hebreos 2:10",
    text: `Porque convenía a aquel por cuya causa son todas las cosas, y por quien todas las cosas subsisten, que habiendo de llevar muchos hijos a la gloria, perfeccionase por aflicciones al autor de la salvación de ellos.`
  },
  {
    ref: "Apocalipsis 12:10",
    text: `Entonces oí una gran voz en el cielo, que decía: Ahora ha venido la salvación, el poder, y el reino de nuestro Dios, y el poder de su Cristo; porque ha sido lanzado fuera el acusador de nuestros hermanos, el que los acusaba delante de nuestro Dios día y noche.`
  },
];

const QUIZ_DATA = [
  {
    q: "Según Juan 11:49-50, ¿qué declaró Caifás a los demás líderes religiosos?",
    opts: [
      "Que debían esperar a que los romanos actuaran primero",
      "Que convenía que un hombre muriera por el pueblo",
      "Que debían dejar libre a Jesús para evitar problemas",
      "Que debían pedirle a Jesús que se exiliara"
    ],
    ans: 1,
    feedback: "«Ni pensáis que nos conviene que un hombre muera por el pueblo, y no que toda la nación perezca» (Juan 11:50). Sin saberlo, Caifás profetizó que Jesús moriría por la nación."
  },
  {
    q: "¿Con qué gritos recibió la multitud a Jesús en su entrada triunfal? (Juan 12:13)",
    opts: [
      "«¡Crucifícale, crucifícale!»",
      "«¡Hosanna! Bendito el que viene en el nombre del Señor, el Rey de Israel!»",
      "«¡Este es el profeta Jesús!»",
      "«¡Sálvanos de los romanos!»"
    ],
    ans: 1,
    feedback: "La multitud tomó ramas de palmera y clamó: «¡Hosanna! Bendito el que viene en el nombre del Señor, el Rey de Israel!» (Juan 12:13). Esperaban un rey terrenal, sin entender el verdadero propósito de Jesús."
  },
  {
    q: "¿Qué hizo María en la cena de Betania? (Juan 12:3)",
    opts: [
      "Le lavó los pies a Jesús solo con agua",
      "Ungió los pies de Jesús con perfume de nardo puro y los enjugó con su cabello",
      "Le preparó la comida a Jesús y a los discípulos",
      "Le entregó todas sus posesiones a los pobres"
    ],
    ans: 1,
    feedback: "«Entonces María tomó una libra de perfume de nardo puro, de mucho precio, y ungió los pies de Jesús, y los enjugó con sus cabellos» (Juan 12:3). Fue un acto sincero de profunda gratitud."
  },
  {
    q: "Según Juan aclara, ¿por qué criticó Judas el gesto de María? (Juan 12:4-6)",
    opts: [
      "Porque realmente amaba a los pobres más que a nadie",
      "Porque no le agradaba María personalmente",
      "Porque era ladrón y sustraía del dinero del grupo",
      "Porque pensaba que el perfume era falso"
    ],
    ans: 2,
    feedback: "«Pero dijo esto, no porque se cuidara de los pobres, sino porque era ladrón, y teniendo la bolsa, sustraía de lo que se echaba en ella» (Juan 12:6). Su indignación nacía de la codicia, no de la justicia."
  },
  {
    q: "¿Qué dijo Jesús sobre el significado del gesto de María? (Juan 12:7)",
    opts: [
      "Que ella debió pedirle permiso antes de hacerlo",
      "Que había guardado el perfume para el día de su sepultura",
      "Que el gesto no tenía ningún significado especial",
      "Que ella debía repartir el perfume entre los discípulos"
    ],
    ans: 1,
    feedback: "«Déjala; para el día de mi sepultura ha guardado esto» (Juan 12:7). María parecía ser la única que había escuchado lo que Jesús llevaba tiempo diciendo sobre su muerte inminente."
  },
  {
    q: "¿Qué enseñó Jesús con la imagen del grano de trigo? (Juan 12:24)",
    opts: [
      "Que la siembra debe hacerse en la estación correcta",
      "Que si el grano no cae en tierra y muere, queda solo; pero si muere, lleva mucho fruto",
      "Que el trigo representa la riqueza del reino de Dios",
      "Que los discípulos debían dedicarse a la agricultura"
    ],
    ans: 1,
    feedback: "«Si el grano de trigo no cae en la tierra y muere, queda solo; pero si muere, lleva mucho fruto» (Juan 12:24). Jesús enseñaba que su muerte, lejos de ser una derrota, produciría una abundante cosecha de vida."
  },
  {
    q: "¿Qué expresó Jesús sobre su propia angustia, y cuál fue su decisión? (Juan 12:27)",
    opts: [
      "«Mi alma está turbada... mas para esto he llegado a esta hora»",
      "«No quiero continuar con esta misión»",
      "«Pediré a mi Padre que cambie sus planes»",
      "«Prefiero que otro tome mi lugar»"
    ],
    ans: 0,
    feedback: "«Ahora está turbada mi alma; ¿y qué diré? ¿Padre, sálvame de esta hora? Mas para esto he llegado a esta hora» (Juan 12:27). A pesar de la angustia, Jesús se sometió por completo a su propósito."
  },
  {
    q: "¿Qué anunció Jesús que sucedería con 'el príncipe de este mundo'? (Juan 12:31, 32)",
    opts: [
      "Que gobernaría la tierra hasta el fin de los tiempos",
      "Que sería echado fuera cuando Jesús fuera levantado de la tierra",
      "Que se aliaría con los líderes religiosos",
      "Que nunca sería vencido definitivamente"
    ],
    ans: 1,
    feedback: "«Ahora es el juicio de este mundo; ahora el príncipe de este mundo será echado fuera. Y yo, si fuere levantado de la tierra, a todos atraeré a mí mismo» (Juan 12:31-32). La cruz selló la derrota de Satanás."
  },
];

const DISCUSS_RESPUESTA = [
  { n: 1, text: "¿Cómo reaccionaron los líderes religiosos de Israel ante la resurrección de Lázaro?", ref: "Juan 11:47-54" },
  { n: 2, text: "Por el contrario, ¿cómo reaccionó la multitud al día siguiente?", ref: "Juan 12:12-19" },
  { n: 3, text: "¿En qué se diferenciaban y en qué se parecían las dos respuestas?" },
  { n: 4, text: "¿Cómo desafió Jesús ambas respuestas con su verdadero propósito?", ref: "Juan 12:23-26" },
];

const DISCUSS_ESCUCHAR = [
  { n: 1, text: "¿En qué sentido la respuesta de María estaba más en sintonía con los acontecimientos inminentes?", ref: "Juan 12:1-8" },
  { n: 2, text: "¿Por qué es importante asegurarnos de que realmente estamos escuchando lo que Jesús dice y no solo lo que queremos oír? Considera el ejemplo de los discípulos.", ref: "Marcos 9:30-32" },
];

const DISCUSS_PROPOSITO = [
  { n: 1, text: "Jesús enseñó que para que el trigo produzca más grano, primero tiene que morir. ¿Qué quiso decir con eso? ¿Qué significa eso para nosotros hoy?", ref: "Juan 12:24" },
  { n: 2, text: "¿Cuál declaró Cristo que era su propósito? ¿Cuál es el significado de esta declaración?", ref: "Juan 12:27" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Alguna vez te has sentido presionado por las expectativas que otras personas tienen sobre tu vida, y estas contradicen lo que Dios te ha llamado a hacer?", ref: "Juan 11:47-54; 12:12-19" },
  { key: "rfl2", q: "¿Alguna vez te ha criticado algún cristiano por dar lo mejor de ti a Jesús, como lo hizo María? ¿Cómo te sentiste?", ref: "Juan 12:1-8" },
  { key: "rfl3", q: "¿Alguna vez has escuchado la voz de Dios en tu vida, de forma audible o como una sensación de aliento proveniente de él?", ref: "Juan 12:27, 28" },
  { key: "rfl4", q: "Al pensar en las consecuencias de reconocer quién es Jesús, ¿es posible que acabemos rechazándolo? ¿Cómo podemos evitar que eso suceda?", ref: "Juan 12:23-33" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Las escenas <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>finales</em></div>
      <div className="sec-sub">Primera Semana · Juan 11:43–12:33 · La provocación final</div>

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
            <p>Un día, en el preescolar, alguien se detuvo frente a una alarma de incendios y pensó: ¿Qué pasará si acciono esta cosa? No pensó en las consecuencias, solo en la curiosidad. La resurrección de Lázaro fue el último gran milagro público de Jesús, y también la última provocación para los líderes religiosos: desató la serie de acontecimientos que condujeron a su muerte. La diferencia es que Jesús sabía exactamente lo que sucedería después, y aun así lo hizo.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Juan 12:23-24
            </div>
            <div className="honey-text">
              «Ha llegado la hora para que el Hijo del Hombre sea glorificado. De cierto, de cierto os digo, que si el grano de trigo no cae en la tierra y muere, queda solo; pero si muere, lleva mucho fruto.»
            </div>
            <div className="honey-ref">Juan 12:23-24 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Las multitudes y los líderes religiosos</strong> tuvieron reacciones opuestas ante la resurrección de Lázaro, pero ambos tenían expectativas equivocadas.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Cuando escuchas a Jesús,</strong> es importante prestar atención a lo que realmente dice, en lugar de a lo que tú quieres que diga.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>La cruz no fue una sorpresa para Jesús.</strong> Él sabía lo que iba a pasar y, aun así, siguió adelante debido a su gran amor por nosotros.</span>
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
      <div className="sec-sub">Una historia de dos respuestas</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>Tras la resurrección de Lázaro vemos dos reacciones muy diferentes: la de los líderes religiosos, que temían perder su influencia, y la de las multitudes, cuya expectación crecía. Ninguno de los dos grupos escuchó realmente lo que Jesús decía sobre su propósito.</p>
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
        <p>¿Te sorprende que los líderes religiosos, estudiosos bien versados de la Biblia, fueran capaces de conspirar para matar a Jesús? ¿Qué advertencia nos da esto como estudiantes de la Biblia?</p>
      </div>
    </>
  );
}

function TabInterpreta({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Interpreta</div>
      <div className="sec-sub">Alguien está escuchando — Juan 12:1-8</div>

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

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 62, p. 529</div>
        <div className="egw-text">«María no conocía el significado pleno de su acto de amor. No podía contestar a sus acusadores. [...] <strong>El Espíritu Santo había pensado en lugar suyo, y ella había obedecido sus impulsos.</strong> La Inspiración no se humilla a dar explicaciones. Una asistencia invisible habla a la mente y al alma, y mueve el corazón a la acción.»</div>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>Judas y Simón habían olvidado claramente sus orígenes, mientras que María no, y por eso lo dio todo por Jesús. ¿Qué nos ayuda a recordar nuestros orígenes en nuestras experiencias con Jesús?</p>
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
        <div className="xref-group-label">Cómo preparó a sus seguidores para su muerte</div>
        {XREF_PREPARO.map((x, i) => (
          <div key={i} className="xref-row">
            <div className="xref-ref">{x.ref}</div>
            <div className="xref-desc">{x.desc}</div>
          </div>
        ))}
      </div>

      <div className="xref-table">
        <div className="xref-group-label">Otros relatos sobre el gesto de María</div>
        {XREF_MARIA.map((x, i) => (
          <div key={i} className="xref-row">
            <div className="xref-ref">{x.ref}</div>
            <div className="xref-desc">{x.desc}</div>
          </div>
        ))}
      </div>

      <div className="xref-table">
        <div className="xref-group-label">La derrota de Satanás en la cruz</div>
        {XREF_DERROTA.map((x, i) => (
          <div key={i} className="xref-row">
            <div className="xref-ref">{x.ref}</div>
            <div className="xref-desc">{x.desc}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)" }}>
        <div className="card-label">Para pensar</div>
        <p>¿Qué otros versículos o promesas te vienen a la mente en relación con los acontecimientos descritos en Juan 11:43–12:33?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien la provocación final que condujo a la cruz." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre las escenas finales del ministerio de Jesús." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Juan 11:43–12:33." :
                "Vale la pena releer el material. Estos capítulos son clave para entender el camino de Jesús hacia la cruz.";
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
      <div className="sec-sub">inQuiere · Reflexión en grupo y para tu vida</div>

      <div className="discuss-block">
        <div className="discuss-title">La respuesta de la gente</div>
        {DISCUSS_RESPUESTA.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Alguna vez te has sentido presionado por las expectativas que otras personas tienen sobre tu vida? ¿Contradicen lo que sabes que Dios te ha llamado a hacer?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Escuchar a Jesús</div>
        {DISCUSS_ESCUCHAR.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Alguna vez te ha criticado algún cristiano por dar lo mejor de ti a Jesús, como lo hizo María? ¿De qué manera Dios te animó a superarlo?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">El propósito de Cristo</div>
        {DISCUSS_PROPOSITO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Alguna vez has escuchado la voz de Dios en tu vida, de forma audible o como una sensación de aliento proveniente de él?</div>
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 62, p. 530</div>
        <div className="egw-text">«La mirada que Jesús dirigió a Judas lo convenció de que el Salvador discernía su hipocresía y leía su carácter vil y despreciable. [...] <strong>Ahora la reprensión había provocado resentimiento en su corazón y resolvió vengarse.</strong> De la cena fue directamente al palacio del sumo sacerdote, donde estaba reunido el concilio, y ofreció entregar a Jesús en sus manos.»</div>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Comienza un nuevo trimestre siguiendo el camino de Jesús hacia la cruz. Ya viste las dos respuestas equivocadas ante su obra: la del temor que busca destruir, y la del entusiasmo que busca controlar. Ambas ignoraron lo que Jesús realmente decía.</p>
          <br />
          <p>Solo María pareció escuchar. Solo ella entendió, al menos en parte, lo que se avecinaba, y respondió con una entrega total. <strong>Escuchar a Jesús no siempre significa recibir aplausos;</strong> a veces significa ser incomprendido, como le pasó a ella.</p>
          <br />
          <p>Jesús prosiguió hasta su muerte movido por un amor más fuerte que el sufrimiento que lo esperaba. Abandonarnos le habría causado una agonía mayor incluso que la cruz. <strong>La cruz no fue una sorpresa para él.</strong> Él sabía lo que iba a pasar, y aun así siguió adelante, por ti.</p>
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
              InVerso · Semana 1
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Las escenas <em>finales</em>
            </h1>
            <div className="hero-ref">Juan 11:43–12:33 · RVR1960</div>
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
