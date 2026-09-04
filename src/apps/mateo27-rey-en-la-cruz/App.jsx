import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Moon, MapPin, Frown, Eye
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#070307;--bg2:#0f0610;--bg3:#180b1a;--surf:#1b0e1e;--surf2:#251527;--brd:#2a1520;--brd2:#3d1f2c;--tx:#f0e6ea;--tx2:#a98f97;--tx3:#6f5860;--acc:#7a1f38;--acc2:#a83955;--acc3:#d9a3b0;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#c9924a;--warn-d:rgba(201,146,74,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1c0912 0%,#0f0610 55%,#070307 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(122,31,56,.26) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(122,31,56,.34);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(122,31,56,.09)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(122,31,56,.42) 30%,rgba(122,31,56,.42) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(122,31,56,.15);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(122,31,56,.2);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(201,146,74,.18);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(122,31,56,.07)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(122,31,56,.2);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(122,31,56,.14),rgba(122,31,56,.02));border:1px solid rgba(122,31,56,.26);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(122,31,56,.1);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(122,31,56,.18),rgba(122,31,56,.03));border:1px solid rgba(122,31,56,.32);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.honey-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.honey-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.honey-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}
.guide-banner{background:linear-gradient(135deg,rgba(201,146,74,.12),rgba(201,146,74,.02));border:1px solid rgba(201,146,74,.24);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(201,146,74,.16);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
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
.vida-card{background:linear-gradient(135deg,rgba(122,31,56,.18),rgba(122,31,56,.03));border:1.5px solid rgba(122,31,56,.34);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(122,31,56,.09);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: Cuando no te escuchan", desc: "Contar la anécdota de intentar tener una conversación importante con alguien que nunca termina de entender. Así vivió Jesús con sus discípulos: tres advertencias claras sobre la cruz, y ninguna fue asimilada." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración del grupo. Orar agradeciendo que Jesús, sabiendo exactamente lo que le esperaba, igual caminó hacia la cruz." },
  { time: "05–10 min", title: "Tab Camino — El camino a la cruz", desc: "Repasar las tres predicciones de Jesús (Marcos 8, 9 y 10) y el pedido de Santiago y Juan por los tronos. Contrastar la expectativa de gloria con la realidad de Simón de Cirene cargando la cruz." },
  { time: "10–15 min", title: "Tab Burlas — ¡Sálvate a ti mismo!", desc: "Trabajar Mateo 27:39-44: la multitud, los líderes, los soldados y uno de los criminales repiten la misma tentación de Satanás en el desierto (Mateo 4:6). Destacar la oración de perdón de Jesús." },
  { time: "15–20 min", title: "Tab Abandono — Oscuridad y silencio", desc: "Desarrollar las tres horas de oscuridad, el clamor de Mateo 27:46 y la asombrosa precisión profética del Salmo 22, que termina en victoria (v. 21 en adelante)." },
  { time: "20–23 min", title: "Tab Testigos — La respuesta del centurión", desc: "Repasar brevemente los relatos paralelos y los salmos de sufrimiento, y detenerse en la confesión del centurión romano (Mateo 27:54) frente a la indiferencia general de la multitud." },
  { time: "23–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto, deteniéndose en el significado del clamor de abandono y en la respuesta del centurión." },
  { time: "27–30 min", title: "Cierre e inQuiere", desc: "Usar los tres bloques de discusión: voces desdeñosas, oscuridad y silencio, y respuesta. Cerrar con la cita de Elena G. de White y los «Puntos clave para recordar»." },
];

const CAMINO_DATA = [
  {
    key: "ca1", badge: "Marcos 8:31-33",
    name: "1. Primera advertencia, primer rechazo",
    body: "Jesús comenzó a enseñar que le era necesario padecer mucho, ser desechado por los líderes religiosos, ser muerto y resucitar al tercer día. Pedro lo tomó aparte para reconvenirlo, y Jesús le respondió: «¡Quítate de delante de mí, Satanás!». La primera vez que Jesús fue claro sobre la cruz, fue rechazado de inmediato."
  },
  {
    key: "ca2", badge: "Marcos 9:30-32",
    name: "2. Segunda advertencia, mismo silencio",
    body: "Jesús volvió a explicar a sus discípulos que sería entregado, muerto y resucitado al tercer día. «Pero ellos no entendían esta palabra, y tenían miedo de preguntarle» (v. 32). No fue un malentendido: fue una negativa silenciosa a procesar algo que no encajaba en sus expectativas."
  },
  {
    key: "ca3", badge: "Marcos 10:32-34",
    name: "3. Tercera advertencia, sin ambigüedad",
    body: "Mientras subían a Jerusalén, Jesús explicó en los términos más claros posibles lo que iba a suceder: entrega, condena, burla, azotes, escupitajos, muerte y resurrección al tercer día. No pudo ser más directo. Y sin embargo, lo que sucedió después revela que los discípulos aún seguían sin escuchar."
  },
  {
    key: "ca4", badge: "Marcos 10:35-40",
    name: "4. Un trono, no una cruz",
    body: "Santiago y Juan se acercaron con una petición urgente: sentarse uno a la derecha y otro a la izquierda de Jesús «en tu gloria». Jesús, desconsolado, respondió: «No sabéis lo que pedís». Cuando pidieron estar junto a él, imaginaban los puestos más altos del gobierno. No sabían que estar junto a él significaría la crucifixión."
  },
  {
    key: "ca5", badge: "Mateo 27:32-37",
    name: "5. Camino al Gólgota",
    body: "Un hombre llamado Simón de Cirene fue obligado a cargar la cruz de Jesús. Al llegar al Gólgota le ofrecieron vinagre mezclado con hiel, pero no quiso beberlo. Lo crucificaron, repartieron su ropa echando suertes, y colocaron sobre su cabeza el título: «ESTE ES JESÚS, EL REY DE LOS JUDÍOS»."
  },
];

const BURLAS_DATA = [
  {
    key: "bu1", badge: "Mateo 27:39, 40",
    name: "1. La multitud que pasaba",
    body: "Grandes multitudes de viajeros llegaban desde África, Asia y Europa para la Pascua. Los que pasaban junto a la cruz insultaban a Jesús meneando la cabeza: «Tú que derribas el templo y en tres días lo reedificas, sálvate a ti mismo; si eres Hijo de Dios, desciende de la cruz»."
  },
  {
    key: "bu2", badge: "Mateo 27:41-43",
    name: "2. Los líderes religiosos",
    body: "Los principales sacerdotes, escribas y ancianos se burlaron con absoluto desdén: «A otros salvó, a sí mismo no se puede salvar... confió en Dios; líbrele ahora si le quiere; porque ha dicho: Soy Hijo de Dios». Se burlaban de él por afirmar exactamente lo que era verdad."
  },
  {
    key: "bu3", badge: "Lucas 23:37",
    name: "3. Los soldados",
    body: "Los soldados romanos también se burlaron: «Si tú eres el Rey de los judíos, sálvate a ti mismo». La ironía es que la inscripción sobre su cabeza, escrita por orden de Pilato, decía exactamente eso: que era el Rey de los judíos."
  },
  {
    key: "bu4", badge: "Lucas 23:39",
    name: "4. Uno de los criminales",
    body: "Uno de los malhechores crucificados junto a él se burló: «Si tú eres el Cristo, sálvate a ti mismo y a nosotros». Sin saberlo, Jesús ya estaba en proceso de proporcionarles la salvación. Solo que él aún no se había dado cuenta."
  },
  {
    key: "bu5", badge: "Mateo 4:6",
    name: "5. El eco de la tentación del desierto",
    body: "Satanás desafió la identidad de Jesús con la misma frase que había usado en el desierto: «Si eres Hijo de Dios». Satanás sabe que Jesús es el Hijo de Dios, y Jesús también lo sabe. Intentaba provocarlo para que usara su divinidad en beneficio propio, no de la humanidad."
  },
  {
    key: "bu6", badge: "Lucas 23:34",
    name: "6. La respuesta de Jesús: perdón",
    body: "Ante todo este desprecio y maltrato, Jesús continuó ofreciendo perdón. Por todos los que contribuyeron a su muerte, oró: «Padre, perdónalos, porque no saben lo que hacen». La ironía de «desciende de la cruz» es que, precisamente porque es el Hijo de Dios, no descenderá."
  },
];

const ABANDONO_DATA = [
  {
    key: "ab1", badge: "Mateo 27:45",
    name: "1. Tres horas de oscuridad",
    body: "Las multitudes burlonas quedaron en silencio cuando la oscuridad cayó sobre el Calvario a la hora sexta (el mediodía), y duró hasta la hora novena, tres horas de intenso sufrimiento espiritual, mucho más intenso que el dolor físico de la crucifixión."
  },
  {
    key: "ab2", badge: "Mateo 27:46",
    name: "2. Sin el término «Padre»",
    body: "Jesús clamó: «Dios mío, Dios mío, ¿por qué me has desamparado?». Normalmente comenzaba sus oraciones con el cariñoso término «Padre». Aquí lo abandonó, porque se sentía completamente separado y solo. Nuestros pecados lo separaron de su Padre."
  },
  {
    key: "ab3", badge: "Mateo 3:17",
    name: "3. La voz que ya no se escuchó",
    body: "En su bautismo, una voz del cielo había dicho: «Este es mi Hijo amado, en quien tengo complacencia». En la cruz, no hubo ninguna voz del cielo. Ya no sentía la sonrisa del cielo sobre él. Sin respuesta del cielo, todo tenía que ser por fe."
  },
  {
    key: "ab4", badge: "Salmo 22:1, 7, 8, 16, 18",
    name: "4. Una profecía escrita siglos antes",
    body: "«Dios mío, Dios mío, ¿por qué...?» fue pronunciado primero por David en el Salmo 22, una profecía mesiánica de precisión asombrosa: manos y pies perforados (v. 16, cuando la crucifixión ni siquiera existía como práctica), el desprecio de los que se burlarían (vv. 7, 8), y el reparto de sus vestiduras por suertes (v. 18)."
  },
  {
    key: "ab5", badge: "Salmo 22:21",
    name: "5. De la derrota a la victoria",
    body: "El tono del Salmo 22, del versículo 1 al 20, suena como el de alguien ignorado y pasado por alto. Pero el versículo 21 marca un cambio: «¡Me has respondido!». Desde ahí, el salmo se convierte en alabanza. Al citar el versículo 1, Jesús también cumplía el resto del salmo, que termina en triunfo. Su fe traspasó la oscuridad."
  },
];

const TESTIGOS_PARALELOS = [
  { key: "tp1", badge: "Marcos 15:21-41", name: "El relato de Marcos", body: "Marcos sigue de cerca la estructura de Mateo: Simón de Cirene, el título en la cruz, las burlas de transeúntes y líderes, las tres horas de oscuridad, el clamor de abandono y la confesión del centurión." },
  { key: "tp2", badge: "Lucas 23:26-49", name: "El relato de Lucas", body: "Lucas añade la oración de perdón de Jesús («Padre, perdónalos») y el diálogo completo con los dos criminales, incluida la promesa al que se arrepintió: «Hoy estarás conmigo en el paraíso»." },
  { key: "tp3", badge: "Juan 19:17-37", name: "El relato de Juan", body: "Juan agrega detalles como la disputa por el título «Rey de los judíos», el cuidado de Jesús por su madre desde la cruz, y el cumplimiento profético de que no le quebraron ningún hueso." },
];

const TESTIGOS_SUFRIMIENTO = [
  { key: "ts1", badge: "Salmo 18:1-12", name: "Un clamor que llega al cielo", body: "David describe cómo, en su angustia, invocó a Jehová y su clamor llegó a los oídos de Dios, quien respondió con poder y presencia. Un anticipo del clamor de Cristo en la cruz." },
  { key: "ts2", badge: "Salmo 69:19-21", name: "Escarnio, hiel y vinagre", body: "«El escarnio ha quebrantado mi corazón... me pusieron además hiel por comida, y en mi sed me dieron a beber vinagre» (vv. 20, 21). Otra profecía mesiánica cumplida al pie de la letra en el Calvario." },
  { key: "ts3", badge: "Salmo 71:10, 11", name: "«Dios lo ha desamparado»", body: "«Diciendo: Dios lo ha desamparado; perseguidle y prendedle, pues no hay quien lo libre» (v. 11). Las mismas palabras que resonaron, siglos después, junto a la cruz de Jesús." },
];

const VERSES = [
  {
    ref: "Mateo 27:32-56", isBase: true,
    text: `32 Cuando salían, hallaron a un hombre de Cirene que se llamaba Simón; a éste obligaron a que llevase la cruz. 33 Y cuando llegaron a un lugar llamado Gólgota, que significa: Lugar de la Calavera, 34 le dieron a beber vinagre mezclado con hiel; pero después de haberlo probado, no quiso beberlo. 35 Cuando le hubieron crucificado, repartieron entre sí sus vestidos, echando suertes, para que se cumpliese lo dicho por el profeta: Partieron entre sí mis vestidos, y sobre mi ropa echaron suertes. 36 Y sentados le guardaban allí. 37 Y pusieron sobre su cabeza su causa escrita: ESTE ES JESÚS, EL REY DE LOS JUDÍOS. 38 Entonces crucificaron con él a dos ladrones, uno a la derecha, y otro a la izquierda. 39 Y los que pasaban le injuriaban, meneando la cabeza, 40 y diciendo: Tú que derribas el templo, y en tres días lo reedificas, sálvate a ti mismo; si eres Hijo de Dios, desciende de la cruz. 41 De esta manera también los principales sacerdotes, escarneciéndole con los escribas y los fariseos y los ancianos, decían: 42 A otros salvó, a sí mismo no se puede salvar; si es el Rey de Israel, descienda ahora de la cruz, y creeremos en él. 43 Confió en Dios; líbrele ahora si le quiere; porque ha dicho: Soy Hijo de Dios. 44 Lo mismo le injuriaban también los ladrones que estaban crucificados con él. 45 Y desde la hora sexta hubo tinieblas sobre toda la tierra, hasta la hora novena. 46 Cerca de la hora novena, Jesús clamó a gran voz, diciendo: Elí, Elí, ¿lama sabactani? Esto es: Dios mío, Dios mío, ¿por qué me has desamparado? 47 Algunos de los que estaban allí decían, al oírlo: A Elías llama éste. 48 Y al instante, corriendo uno de ellos, tomó una esponja, y la empapó de vinagre, y poniéndola en una caña, le dio a beber. 49 Pero los otros decían: Deja, veamos si viene Elías a librarle. 50 Mas Jesús, habiendo otra vez clamado a gran voz, entregó el espíritu. 51 Y he aquí, el velo del templo se rasgó en dos, de arriba abajo; y la tierra tembló, y las rocas se partieron; 52 y se abrieron los sepulcros, y muchos cuerpos de santos que habían dormido, se levantaron; 53 y saliendo de los sepulcros, después de la resurrección de él, vinieron a la santa ciudad, y aparecieron a muchos. 54 El centurión, y los que estaban con él guardando a Jesús, visto el terremoto, y las cosas que habían sido hechas, temieron en gran manera, y dijeron: Verdaderamente éste era Hijo de Dios. 55 Estaban allí muchas mujeres mirando de lejos, las cuales habían seguido a Jesús desde Galilea, sirviéndole, 56 entre las cuales estaban María Magdalena, María la madre de Jacobo y de José, y la madre de los hijos de Zebedeo.`
  },
  {
    ref: "Marcos 8:31-33",
    text: `31 Y comenzó a enseñarles que le era necesario al Hijo del Hombre padecer mucho, y ser desechado por los ancianos, por los principales sacerdotes y por los escribas, y ser muerto, y resucitar después de tres días. 32 Esto les decía claramente. Entonces Pedro le tomó aparte y comenzó a reconvenirle. 33 Pero él, volviéndose y mirando a sus discípulos, reprendió a Pedro, diciendo: ¡Quítate de delante de mí, Satanás! porque no pones la mira en las cosas de Dios, sino en las de los hombres.`
  },
  {
    ref: "Marcos 9:30-32",
    text: `30 Habiendo salido de allí, caminaron por Galilea; y no quería que nadie lo supiese. 31 Porque enseñaba a sus discípulos, y les decía: El Hijo del Hombre será entregado en manos de hombres, y le matarán; pero después de muerto, resucitará al tercer día. 32 Pero ellos no entendían esta palabra, y tenían miedo de preguntarle.`
  },
  {
    ref: "Marcos 10:32-34",
    text: `32 Iban por el camino subiendo a Jerusalén; y Jesús iba delante de ellos, y ellos se asombraban, y le seguían con miedo. Entonces, volviendo a tomar a los doce aparte, les comenzó a decir las cosas que le habían de acontecer: 33 He aquí subimos a Jerusalén, y el Hijo del Hombre será entregado a los principales sacerdotes y a los escribas, y le condenarán a muerte, y le entregarán a los gentiles; 34 y le escarnecerán, le azotarán, y escupirán en él, y le matarán; mas al tercer día resucitará.`
  },
  {
    ref: "Marcos 10:35-40",
    text: `35 Entonces Jacobo y Juan, hijos de Zebedeo, se acercaron a él, diciendo: Maestro, quisiéramos que nos hagas lo que pidiéremos. 36 Él les dijo: ¿Qué queréis que os haga? 37 Ellos le dijeron: Concédenos que en tu gloria nos sentemos el uno a tu derecha, y el otro a tu izquierda. 38 Entonces Jesús les dijo: No sabéis lo que pedís. ¿Podéis beber del vaso que yo bebo, o ser bautizados con el bautismo con que yo soy bautizado? 39 Ellos dijeron: Podemos. Jesús les dijo: A la verdad, del vaso que yo bebo, beberéis, y con el bautismo con que yo soy bautizado, seréis bautizados; 40 pero el sentarse a mi derecha y a mi izquierda, no es mío darlo, sino a aquellos para quienes está preparado.`
  },
  {
    ref: "Mateo 4:6",
    text: `Y le dijo: Si eres Hijo de Dios, échate abajo; porque escrito está: A sus ángeles mandará acerca de ti, y, En sus manos te sostendrán, para que no tropieces con tu pie en piedra.`
  },
  {
    ref: "Lucas 23:34",
    text: `Y Jesús decía: Padre, perdónalos, porque no saben lo que hacen. Y repartieron entre sí sus vestidos, echando suertes.`
  },
  {
    ref: "Lucas 23:37",
    text: `y diciendo: Si tú eres el Rey de los judíos, sálvate a ti mismo.`
  },
  {
    ref: "Lucas 23:39",
    text: `Y uno de los malhechores que estaban colgados le injuriaba, diciendo: Si tú eres el Cristo, sálvate a ti mismo y a nosotros.`
  },
  {
    ref: "Mateo 3:17",
    text: `Y hubo una voz de los cielos, que decía: Este es mi Hijo amado, en quien tengo complacencia.`
  },
  {
    ref: "Salmo 22",
    text: `1 Dios mío, Dios mío, ¿por qué me has desamparado? ¿Por qué estás tan lejos de mi salvación, y de las palabras de mi clamor? 2 Dios mío, clamo de día, y no respondes; y de noche, y no hay para mí reposo. 3 Pero tú eres santo, tú que habitas entre las alabanzas de Israel. 4 En ti esperaron nuestros padres; esperaron, y tú los libraste. 5 Clamaron a ti, y fueron librados; confiaron en ti, y no fueron avergonzados. 6 Mas yo soy gusano, y no hombre; oprobio de los hombres, y despreciado del pueblo. 7 Todos los que me ven me escarnecen; estiran la boca, menean la cabeza, diciendo: 8 Se encomendó a Jehová; líbrele él; sálvele, puesto que en él se complacía. 9 Pero tú eres el que me sacó del vientre; el que me hizo estar confiado desde que estaba a los pechos de mi madre. 10 Sobre ti fui echado desde antes de nacer; desde el vientre de mi madre, tú eres mi Dios. 11 No te alejes de mí, porque la angustia está cerca; porque no hay quien ayude. 12 Me han rodeado muchos toros; fuertes toros de Basán me han cercado. 13 Abrieron sobre mí su boca como león rapante y rugiente. 14 He sido derramado como aguas, y todos mis huesos se descoyuntaron; mi corazón fue como cera, derritiéndose en medio de mis entrañas. 15 Como un tiesto se secó mi vigor, y mi lengua se pegó a mi paladar, y me has puesto en el polvo de la muerte. 16 Porque perros me han rodeado, me ha cercado cuadrilla de malignos; horadaron mis manos y mis pies. 17 Contar puedo todos mis huesos; entre tanto, ellos me miran y me observan. 18 Repartieron entre sí mis vestidos, y sobre mi ropa echaron suertes. 19 Mas tú, Jehová, no te alejes; fortaleza mía, apresúrate a socorrerme. 20 Libra de la espada mi alma, del poder del perro mi vida. 21 Sálvame de la boca del león, y líbrame de los cuernos de los búfalos, pues me has oído. 22 Anunciaré tu nombre a mis hermanos; en medio de la congregación te alabaré. 23 Los que teméis a Jehová, alabadle; glorificadle, descendencia toda de Jacob, y temedle vosotros, descendencia toda de Israel. 24 Porque no menospreció ni abominó la aflicción del afligido, ni de él escondió su rostro; sino que cuando clamó a él, le oyó. 25 De ti será mi alabanza en la gran congregación; mis votos pagaré delante de los que le temen. 26 Comerán los humildes, y serán saciados; alabarán a Jehová los que le buscan; vivirá vuestro corazón para siempre. 27 Se acordarán, y se volverán a Jehová todos los confines de la tierra, y todas las familias de las naciones adorarán delante de ti. 28 Porque de Jehová es el reino, y él regirá las naciones. 29 Comerán y adorarán todos los poderosos de la tierra; delante de él se postrarán todos los que descienden al polvo, aun aquel que no puede conservar la vida a su propia alma. 30 La posteridad le servirá; esto será contado de Jehová hasta la postrera generación. 31 Vendrán, y anunciarán su justicia; a pueblo no nacido aún, anunciarán que él hizo esto.`
  },
  {
    ref: "Salmo 18:1-12",
    text: `1 Te amo, oh Jehová, fortaleza mía. 2 Jehová, roca mía y castillo mío, y mi libertador; Dios mío, fuerte mío, en él confiaré; escudo mío, y el poder de mi salvación, mi alto refugio. 3 Invocaré a Jehová, quien es digno de ser alabado, y seré salvo de mis enemigos. 4 Me rodearon ligaduras de muerte, y torrentes de perversidad me atemorizaron. 5 Ligaduras del Seol me rodearon; me tendieron lazos de muerte. 6 En mi angustia invoqué a Jehová, y clamé a mi Dios; él oyó mi voz desde su templo, y mi clamor llegó delante de él, a sus oídos. 7 La tierra fue conmovida y tembló; se conmovieron los cimientos de los montes, y se estremecieron, porque se indignó él. 8 Humo subió de su nariz, y de su boca fuego consumidor; carbones fueron por él encendidos. 9 Bajó los cielos, y descendió; había oscuridad debajo de sus pies. 10 Cabalgó sobre un querubín, y voló; voló sobre las alas del viento. 11 Puso tinieblas por su escondedero, por cortina alrededor de sí; oscuridad de aguas, nubes de los cielos. 12 Por el resplandor de su presencia, sus nubes pasaron; granizo y carbones ardientes.`
  },
  {
    ref: "Salmo 69:19-21",
    text: `19 Tú sabes mi afrenta, mi confusión y mi oprobio; delante de ti están todos mis adversarios. 20 El escarnio ha quebrantado mi corazón, y estoy acongojado. Esperé quien se compadeciese de mí, y no lo hubo; y consoladores, y ninguno hallé. 21 Me pusieron además hiel por comida, y en mi sed me dieron a beber vinagre.`
  },
  {
    ref: "Salmo 71:10, 11",
    text: `10 Porque mis enemigos hablan de mí, y los que acechan mi alma consultan juntamente, 11 diciendo: Dios lo ha desamparado; perseguidle y prendedle, pues no hay quien lo libre.`
  },
  {
    ref: "Hechos 12:1, 2",
    text: `1 En aquel mismo tiempo el rey Herodes echó mano a algunos de la iglesia para maltratarles. 2 Y mató a espada a Jacobo, hermano de Juan.`
  },
  {
    ref: "Apocalipsis 1:9",
    text: `Yo Juan, vuestro hermano, y copartícipe vuestro en la tribulación, en el reino y en la paciencia de Jesucristo, estaba en la isla llamada Patmos, por causa de la palabra de Dios y el testimonio de Jesucristo.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Qué le había predicho Jesús a sus discípulos, en términos muy claros, mientras subían a Jerusalén?",
    opts: ["Que sería coronado rey de inmediato", "Que sería entregado, condenado, maltratado, muerto y resucitaría al tercer día", "Que los discípulos serían arrestados en su lugar", "Que destruiría el templo de Jerusalén"],
    ans: 1,
    feedback: "«He aquí subimos a Jerusalén, y el Hijo del Hombre será entregado... y le condenarán a muerte... y le matarán; mas al tercer día resucitará» (Marcos 10:33, 34). No pudo ser más claro."
  },
  {
    q: "¿Qué le pidieron Santiago y Juan a Jesús poco después de esta advertencia?",
    opts: ["Que los dejara volver a Galilea", "Sentarse uno a su derecha y otro a su izquierda en su gloria", "Que les enseñara a orar", "Ser los primeros en ver la tumba vacía"],
    ans: 1,
    feedback: "«Concédenos que en tu gloria nos sentemos el uno a tu derecha, y el otro a tu izquierda» (Marcos 10:37). No sabían que estar junto a él significaría la crucifixión."
  },
  {
    q: "¿Quién fue obligado a cargar la cruz de Jesús camino al Gólgota?",
    opts: ["Pedro", "Un hombre de Cirene llamado Simón", "Uno de los soldados romanos", "Judas"],
    ans: 1,
    feedback: "«Hallaron a un hombre de Cirene que se llamaba Simón; a éste obligaron a que llevase la cruz» (Mateo 27:32)."
  },
  {
    q: "¿Qué frase repitieron la multitud, los líderes, los soldados y uno de los criminales al burlarse de Jesús en la cruz?",
    opts: ["«Perdónalo, Señor»", "«Sálvate a ti mismo / si eres Hijo de Dios»", "«Bájalo de la cruz, es inocente»", "«Él salvó a otros»"],
    ans: 1,
    feedback: "Mateo 27:40, 42; Lucas 23:37, 39. La misma exigencia se repitió de cuatro maneras distintas: que probara su identidad bajándose de la cruz."
  },
  {
    q: "¿Con qué otro momento de la vida de Jesús se relaciona directamente la burla «Si eres Hijo de Dios»?",
    opts: ["Su bautismo", "La tentación en el desierto (Mateo 4:6)", "La transfiguración", "La resurrección de Lázaro"],
    ans: 1,
    feedback: "Satanás usó la misma frase en el desierto: «Si eres Hijo de Dios, échate abajo» (Mateo 4:6). Sabía que Jesús es el Hijo de Dios; intentaba provocarlo para que usara su divinidad en beneficio propio."
  },
  {
    q: "¿Qué ocurrió durante tres horas antes de la muerte de Jesús, y qué clamó al final de ellas?",
    opts: ["Llovió y Jesús guardó silencio", "Hubo tinieblas sobre toda la tierra y Jesús clamó: «Dios mío, Dios mío, ¿por qué me has desamparado?»", "Hubo un terremoto y Jesús pidió agua", "La multitud se dispersó en silencio"],
    ans: 1,
    feedback: "«Desde la hora sexta hubo tinieblas sobre toda la tierra, hasta la hora novena... Jesús clamó a gran voz... Dios mío, Dios mío, ¿por qué me has desamparado?» (Mateo 27:45, 46)."
  },
  {
    q: "El Salmo 22, citado por Jesús en la cruz, ¿cómo termina, después de comenzar como un lamento de abandono?",
    opts: ["En más lamento y silencio", "En alabanza y un canto de victoria", "Con una maldición contra los enemigos", "No tiene relación con la crucifixión"],
    ans: 1,
    feedback: "El versículo 21 marca el giro: «¡Me has respondido!». Desde ahí el salmo se convierte en alabanza. Al citar el versículo 1, Jesús cumplía también el resto del salmo, que termina en triunfo."
  },
  {
    q: "¿Quién declaró «Verdaderamente éste era Hijo de Dios», y por qué resulta tan significativo?",
    opts: ["Un discípulo, porque lo conocía bien", "Un centurión romano pagano, que participó en la ejecución", "Un fariseo arrepentido", "María, la madre de Jesús"],
    ans: 1,
    feedback: "«El centurión... visto el terremoto, y las cosas que habían sido hechas... dijeron: Verdaderamente éste era Hijo de Dios» (Mateo 27:54). No fue un sacerdote erudito, sino un comandante militar pagano."
  },
];

const DISCUSS_VOCES = [
  { n: 1, text: "¿Qué decía la gente y los líderes religiosos junto a la cruz?", ref: "Mateo 27:39-43" },
  { n: 2, text: "¿De qué manera estas voces se hicieron eco de la primera tentación de Satanás en el desierto?", ref: "Mateo 4:6" },
  { n: 3, text: "¿Cómo profetizó David este tipo de rechazo?", ref: "Salmo 22:4-18" },
];

const DISCUSS_OSCURIDAD = [
  { n: 1, text: "¿Qué sucedió durante tres horas y qué pregunta desgarradora de Jesús reveló su sufrimiento interior?", ref: "Mateo 27:45, 46" },
  { n: 2, text: "Aunque la pregunta de Cristo sonaba a derrota, ¿por qué al citar el Salmo 22 también estaba mostrando su fe?", ref: "Salmo 22:1, 2, 22-31" },
];

const DISCUSS_RESPUESTA = [
  { n: 1, text: "¿Qué respuesta sorprendente dio el centurión romano, un hombre pagano?", ref: "Mateo 27:54" },
  { n: 2, text: "¿Qué tipos de reacciones puedes identificar entre las demás personas reunidas alrededor de la cruz? ¿Puedes identificarte con alguna de ellas?", ref: "" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Alguna vez has tenido la tentación de dudar de que Dios realmente te ve como su hijo? ¿Alguna vez alguien ha cuestionado tu identidad y te ha presionado para que demostraras tus méritos?", ref: "Mateo 27:40" },
  { key: "rfl2", q: "¿Cuál es el peor dolor que has experimentado? ¿Cómo imaginas el dolor que experimentó Jesús?", ref: "Mateo 27:45, 46" },
  { key: "rfl3", q: "¿Qué otros pasajes de las Escrituras te vienen a la mente en relación con Mateo 27:32-56?", ref: "" },
  { key: "rfl4", q: "¿Te impresiona la historia de la cruz cuando la lees, o te parece que es solo una antigua historia y no algo que podría transformar tu vida?", ref: "" },
  { key: "rfl5", q: "Memoriza tu pasaje favorito de Mateo 27:32-56. Escríbelo varias veces para ayudarte a recordarlo.", ref: "Mateo 27:32-56" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">El Rey <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>en la cruz</em></div>
      <div className="sec-sub">Décima Semana · Mateo 27:32-56 · Las escenas finales</div>

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
            <div className="card-label">Cuando no te escuchan</div>
            <p>¿Alguna vez intentaste tener una conversación realmente importante con alguien, solo para que esa persona terminara sin entender nada? Jesús vivió esto tres veces con sus discípulos, explicándoles con total claridad que sería maltratado, ejecutado como un criminal y resucitado al tercer día. Aun así, poco después, Santiago y Juan le pidieron tronos. La cruz jamás debió ser una sorpresa, pero cuando llegó, ningún discípulo estaba preparado.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Mateo 27:46
            </div>
            <div className="honey-text">
              «Cerca de la hora novena, Jesús clamó a gran voz, diciendo: Elí, Elí, ¿lama sabactani? Esto es: Dios mío, Dios mío, ¿por qué me has desamparado?»
            </div>
            <div className="honey-ref">Mateo 27:46 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text">Satanás utilizó a las multitudes burlonas y a los <strong>líderes religiosos</strong> que presionaban a Jesús para que cuestionara su identidad, con el fin de disuadirlo de completar su misión.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">El peor sufrimiento de Cristo lo causó la <strong>separación de su Padre</strong>, una pena que superó con creces cualquier dolor físico que estuviera padeciendo.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">El <strong>centurión romano</strong> quedó profundamente impresionado por la escena, un ejemplo digno para todos los que tienen un encuentro con la historia de la cruz.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabCamino({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Camino</div>
      <div className="sec-sub">El camino a la cruz</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Tres advertencias, ningún oído</div>
        <p>Jesús intentó preparar a sus discípulos para la cruz al menos tres veces, cada una más clara que la anterior. Su historia nos recuerda lo fácil que es ignorar los mensajes que no se ajustan a nuestras ideas preconcebidas. El futuro puede estar escrito con toda claridad, y aun así los acontecimientos pueden tomarnos por sorpresa, como si nunca nos hubieran advertido.</p>
      </div>

      {CAMINO_DATA.map(item => (
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
        <div className="card-label">Después bebieron de su copa</div>
        <p>Santiago fue el primero de los doce discípulos en morir, asesinado por Herodes (Hechos 12:1, 2). Juan fue el último, desterrado como prisionero a la isla de Patmos (Apocalipsis 1:9); según la tradición, sobrevivió a ser arrojado a una olla de aceite hirviendo. Ninguno imaginó, al pedir un trono, que estar junto a Jesús significaría eso.</p>
      </div>
    </>
  );
}

function TabBurlas({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Burlas</div>
      <div className="sec-sub">¡Sálvate a ti mismo!</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Una tentación directa de Satanás</div>
        <p>La crucifixión tuvo lugar junto a un camino muy transitado, a las afueras de la ciudad. La repetida mención de que Jesús «bajara de la cruz» no era una simple burla: era una tentación directa de Satanás, porque él sabía que Jesús podía hacerlo. Ese era el momento crucial del gran conflicto, el momento en que Satanás o lo ganaría todo o lo perdería todo.</p>
      </div>

      {BURLAS_DATA.map(item => (
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
        <p>Los que estaban alrededor de la cruz se burlaban de Jesús por afirmar que era el Hijo de Dios. ¿Alguna vez alguien ha cuestionado tu identidad y te ha presionado para que demostraras tus méritos? ¿Cómo respondiste?</p>
      </div>
    </>
  );
}

function TabAbandono({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Abandono</div>
      <div className="sec-sub">Abandonado, rechazado, con el corazón roto</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Peor que el castigo: el abandono</div>
        <p>Quizás no haya peor sentimiento en el universo que el de ser abandonado. Durante las tres horas de oscuridad, el dolor físico de Jesús era apenas una pequeña sombra comparado con su sufrimiento interno, mucho más intenso. Lo afligía la que posiblemente sea la pregunta más inquietante de la historia: «¿Por qué?».</p>
      </div>

      {ABANDONO_DATA.map(item => (
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
        <p>¿Cuál es el peor dolor que has experimentado? ¿Cómo imaginas el dolor que experimentó Jesús al sentirse completamente separado de su Padre?</p>
      </div>
    </>
  );
}

function TabTestigos({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Testigos</div>
      <div className="sec-sub">¿Cómo responderemos?</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Indiferencia frente al acontecimiento más grande</div>
        <p>Este fue el acontecimiento más espectacular y significativo que el mundo haya visto jamás, y aun así, la respuesta de la multitud fue en gran medida de indiferencia. Muchos que fueron testigos oculares permanecieron impasibles. Es posible saber mucho sobre la cruz y, sin embargo, que esta no tenga ningún efecto en nuestro corazón.</p>
      </div>

      <div className="group-label">La respuesta inesperada</div>
      <div className="expand-item open" style={{ cursor: "default" }}>
        <div className="expand-header">
          <span className="expand-badge">Mateo 27:54</span>
          <span className="expand-name">El centurión romano</span>
        </div>
        <div className="expand-body">Cuando Jesús exhaló su último aliento y un terremoto sacudió la tierra, un hombre expresó con franqueza: «¡Verdaderamente este era el Hijo de Dios!». ¿Quién dijo esto? No fue un sacerdote erudito, sino un centurión romano: un pagano, un comandante militar, alguien que había participado directamente en la ejecución de Jesús.</div>
      </div>

      <div className="group-label">Relatos paralelos en los Evangelios</div>
      {TESTIGOS_PARALELOS.map(item => (
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

      <div className="group-label">Su sufrimiento en la oscuridad y el aislamiento</div>
      {TESTIGOS_SUFRIMIENTO.map(item => (
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
        <p>¿Te impresiona la historia de la cruz cuando la lees, o te parece que es solo una antigua historia y no algo que podría transformar tu vida?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien las escenas finales de la cruz y su significado." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre lo que ocurrió en el Calvario." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Mateo 27:32-56." :
                "Vale la pena releer el pasaje. Es clave para entender el precio que Jesús pagó por vos.";
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 78, p. 713</div>
        <div className="egw-text">«La ira de Dios contra el pecado, la terrible manifestación de su desagrado por causa de la iniquidad, llenó de consternación el alma de su Hijo. [...] Sintiendo el terrible peso de la culpabilidad que lleva, no puede ver el rostro reconciliador del Padre. [...] Tan grande fue esa agonía que apenas le dejaba sentir el dolor físico. [...] <strong>En esa densa oscuridad, se ocultaba la presencia de Dios.</strong> [...] El Padre estaba con su Hijo. Sin embargo, su presencia no se reveló. [...] Por la fe, confió en Aquel a quien había sido siempre su placer obedecer. Y mientras, sumiso, se confiaba a Dios, desapareció la sensación de haber perdido el favor de su Padre. <strong>Por la fe, Cristo venció.</strong>»</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Voces desdeñosas</div>
        {DISCUSS_VOCES.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Alguna vez has oído a alguien decir: «Si sucediera (tal cosa), entonces creería en Dios»? ¿Cómo responderías ante eso?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Oscuridad y silencio</div>
        {DISCUSS_OSCURIDAD.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Alguna vez le has preguntado a Dios «por qué»? ¿Por qué me está pasando esto? ¿Qué lecciones aprendiste?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Respuesta</div>
        {DISCUSS_RESPUESTA.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Sientes que tienes sentimientos encontrados con respecto a la crucifixión? ¿Hay algo que te haya ayudado a entender mejor el significado de la cruz?</div>
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
            <span className="key-text">Satanás utilizó a las multitudes burlonas y a los líderes religiosos que presionaban a Jesús para que cuestionara su identidad, con el fin de <strong>disuadirlo de completar su misión</strong>.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">El peor sufrimiento de Cristo lo causó la <strong>separación de su Padre</strong>, una pena que superó con creces cualquier dolor físico que estuviera padeciendo.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">El centurión romano quedó profundamente impresionado por la escena, un <strong>ejemplo digno</strong> para todos los que tienen un encuentro con la historia de la cruz.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>La mayoría de las personas que estuvieron físicamente más cerca de la cruz —los soldados, los líderes, la multitud que pasaba camino a la Pascua— vieron el acontecimiento más importante de la historia y quedaron completamente indiferentes. Solo un centurión pagano, sin ninguna razón religiosa para hacerlo, reconoció lo que estaba pasando.</p>
          <br />
          <p>Puede pasarte algo parecido sin que te des cuenta: crecer escuchando la historia de la cruz en la escuela sabática, en devocionales, en cuentas cristianas de redes sociales... y que deje de moverte algo por dentro. Que se vuelva información conocida en lugar de una verdad que te cambia.</p>
          <br />
          <p>La próxima vez que alguien se burle de tu fe en el chat, en la universidad o en tu casa —«¿de verdad creés eso?», «si Dios existiera no permitiría...»—, recordá que la misma exigencia («si eres Hijo de Dios») se la hicieron a Jesús en la cruz, y él no necesitó bajar de allí para probar quién era. <strong>No tenés que ganar cada discusión para sostener tu fe.</strong></p>
          <br />
          <p>Y si sentís que la cruz es solo una historia que ya escuchaste mil veces: separá diez minutos esta semana, releé Mateo 27:32-56 despacio y en voz alta, como si fuera la primera vez que lo escuchás.</p>
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
    { id: "inicio",     label: "Inicio",     Icon: Home },
    { id: "camino",     label: "Camino",     Icon: MapPin },
    { id: "burlas",     label: "Burlas",     Icon: Frown },
    { id: "abandono",   label: "Abandono",   Icon: Moon },
    { id: "testigos",   label: "Testigos",   Icon: Eye },
    { id: "biblia",     label: "Biblia",     Icon: BookOpen },
    { id: "quiz",       label: "Quiz",       Icon: HelpCircle },
    { id: "cierre",     label: "Cierre",     Icon: Flame },
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
              El Rey <em>en la cruz</em>
            </h1>
            <div className="hero-ref">Mateo 27:32-56 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"     && <TabInicio teacherMode={teacherMode} />}
            {tab === "camino"     && <TabCamino openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "burlas"     && <TabBurlas openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "abandono"   && <TabAbandono openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "testigos"   && <TabTestigos openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "biblia"     && <TabBiblia openVerses={openVerses} toggle={toggleVerse} renderVerseText={renderVerseText} />}
            {tab === "quiz"       && (
              <TabQuiz
                quizIdx={quizIdx} quizSelected={quizSelected}
                quizAnswered={quizAnswered} quizResults={quizResults}
                quizDone={quizDone} score={score}
                selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz}
              />
            )}
            {tab === "cierre"     && <TabCierre />}
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
