import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Moon, Shield, Search, Droplet
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0d0609;--bg2:#150a0e;--bg3:#211117;--surf:#241318;--surf2:#301920;--brd:#341a20;--brd2:#4a2530;--tx:#f3e9ea;--tx2:#b89aa0;--tx3:#7a5860;--acc:#8a3b4a;--acc2:#b0576a;--acc3:#e0acb8;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#c9924a;--warn-d:rgba(201,146,74,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#241017 0%,#150a0e 55%,#0d0609 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(138,59,74,.24) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(138,59,74,.32);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(138,59,74,.08)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(138,59,74,.4) 30%,rgba(138,59,74,.4) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(138,59,74,.14);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(138,59,74,.18);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(201,146,74,.18);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(138,59,74,.06)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(138,59,74,.18);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(138,59,74,.12),rgba(138,59,74,.02));border:1px solid rgba(138,59,74,.24);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(138,59,74,.09);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(138,59,74,.16),rgba(138,59,74,.03));border:1px solid rgba(138,59,74,.30);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(138,59,74,.16),rgba(138,59,74,.03));border:1.5px solid rgba(138,59,74,.32);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(138,59,74,.08);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: Extrañamente callado", desc: "Compartir brevemente la anécdota del evangelista siempre sereno que, por primera vez, se quedó sin palabras. Así vieron los discípulos a Jesús en Getsemaní: quebrado, vulnerable, extrañamente callado." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración del grupo. Orar agradeciendo que Jesús cargó nuestro trago amargo para que nosotros no tuviéramos que hacerlo." },
  { time: "05–10 min", title: "Tab Interioriza — El trago amargo", desc: "Trabajar Mateo 26:36-41: Jesús lleva a Pedro, Santiago y Juan más adentro del huerto, confiesa su tristeza de muerte y ora para que pase de él esa copa. Los discípulos se duermen." },
  { time: "10–15 min", title: "Tab Agonía — Extremadamente doloroso", desc: "Explicar por qué Jesús sudó gotas de sangre (Lucas 22:44), qué representaba el peso del pecado sobre él, y cómo un ángel vino a fortalecerlo antes de que pudiera morir allí mismo." },
  { time: "15–20 min", title: "Tab Interpreta — Guarda tu espada", desc: "Desarrollar el arresto: el «Yo soy» de Jesús (Juan 18:5; 8:58), el beso de Judas, la espada de Pedro y la sanidad de la oreja de Malco." },
  { time: "20–23 min", title: "Tab Investiga — referencias cruzadas", desc: "Repasar brevemente los relatos paralelos (Marcos 14; Lucas 22; Juan 18) y los pasajes que explican el dolor y la lucha de Cristo (Isaías 53; Salmo 22; Hebreos 5 y 12)." },
  { time: "23–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto, deteniéndose en el significado de la copa y en la sanidad de Malco." },
  { time: "27–30 min", title: "Cierre e inQuiere", desc: "Usar los tres bloques de discusión: el sufrimiento de Cristo, los discípulos dormidos y el arresto. Cerrar con la cita de Elena G. de White y los «Puntos clave para recordar»." },
];

const INTERIORIZA_DATA = [
  {
    key: "in1", badge: "Mateo 26:36, 37",
    name: "1. Solo con los tres",
    body: "Jesús llevó a los once discípulos al huerto de Getsemaní. Judas ya había abandonado el grupo para entregarlo. Jesús dejó a ocho discípulos cerca de la entrada y se llevó solo a Pedro, Santiago y Juan a lo más profundo del huerto, con la esperanza de que lo apoyaran orando por él durante esta terrible prueba."
  },
  {
    key: "in2", badge: "Mateo 26:38",
    name: "2. Una tristeza de muerte",
    body: "Jesús anhelaba la compañía y el apoyo humanos. «Siento en mi alma una tristeza de muerte. Quédense ustedes aquí, y permanezcan despiertos conmigo» (Mateo 26:38). Las angustiadas palabras de Cristo comunicaron a los discípulos que esa noche era diferente a cualquier otra."
  },
  {
    key: "in3", badge: "Mateo 26:39; Apocalipsis 14:10",
    name: "3. El trago amargo",
    body: "Abrumado por la tensión, Jesús se postró sobre su rostro y oró: «Padre mío, si es posible, líbrame de este trago amargo». Apocalipsis describe este trago como «la copa de su ira». En el huerto, Jesús luchó con el peso de la ira de Dios hacia el pecado. Como nuestro sustituto, el que no tenía pecado tomó lo que nosotros merecíamos."
  },
  {
    key: "in4", badge: "Mateo 26:40, 41",
    name: "4. Los discípulos dormidos",
    body: "Pedro, Santiago y Juan se quedaron dormidos como si fuera una noche cualquiera. Aun así, Jesús mostró compasión: no los reprendió con dureza, sino que dijo: «Manténganse despiertos y oren, para que no caigan en tentación... ustedes tienen buena voluntad, pero son débiles» (Mateo 26:41)."
  },
];

const AGONIA_DATA = [
  {
    key: "ag1", badge: "Mateo 26:38; Romanos 6:23",
    name: "1. Me estoy muriendo",
    body: "Jesús no exageraba su sufrimiento. Básicamente les estaba diciendo: «Me estoy muriendo». El peso y la magnitud del pecado lo abrumaban. No veía el rostro sonriente de su Padre ni oía palabras de aliento como en su bautismo; recibía todo lo que nuestros pecados merecen, porque «la paga del pecado es muerte» (Romanos 6:23)."
  },
  {
    key: "ag2", badge: "Salmo 22:14",
    name: "2. Su corazón se derritió como cera",
    body: "La carga era tan intensa que Jesús comenzó a sangrar por los poros de la piel; gotas de sangre caían al suelo. Nuestros pecados hicieron derramar la primera sangre del cuerpo de Cristo. Su corazón se derritió como cera (Salmo 22:14). Irónicamente, la palabra Getsemaní significa «prensa de aceite»."
  },
  {
    key: "ag3", badge: "Mateo 26:39, 42, 44",
    name: "3. Tres oraciones, una decisión",
    body: "Jesús oró tres veces para que le fuera quitada esa carga, y cada vez tu rostro le vino a la mente. Él vio lo que habría sucedido si no hubiera seguido adelante, y eso le dio la fuerza interior para decir: «Pero que no se haga lo que yo quiero, sino lo que quieres tú» (Mateo 26:39). Su decisión quedó hecha: salvaría al ser humano, sea cual fuere el costo."
  },
  {
    key: "ag4", badge: "Lucas 22:43",
    name: "4. Un ángel lo fortaleció",
    body: "En ese momento, Dios envió a un ángel para fortalecer a Jesús. Si ese ángel no hubiera venido, Jesús podría haber muerto allí mismo en el huerto. Fortalecido, se levantó y caminó con firmeza hacia la traición, la condena y la crucifixión. Ningún precio fue demasiado alto para nuestra salvación."
  },
];

const INTERPRETA_DATA = [
  {
    key: "it1", badge: "Juan 18:4, 5; 8:58",
    name: "1. Yo Soy",
    body: "Judas llevó a un grupo de hombres armados al jardín. Cuando Jesús les preguntó a quién buscaban, respondieron: «A Jesús de Nazaret». Jesús respondió: «Yo soy» (Juan 18:5), el mismo término con el que Dios se daba a conocer (Juan 8:58). Al oírlo, los hombres cayeron al suelo, testimonio del poder divino de Cristo y una última oportunidad de reconsiderar."
  },
  {
    key: "it2", badge: "Mateo 26:48-50",
    name: "2. El beso de Judas",
    body: "El que lo entregaba les había dado una señal: «Al que yo besare, ese es; prendedle». Judas se acercó y lo besó. Jesús le dijo: «Amigo, ¿a qué vienes?». Aun en el momento de la traición, Jesús seguía llamando amigo a Judas."
  },
  {
    key: "it3", badge: "Mateo 26:51-54; Juan 18:11",
    name: "3. La espada de Pedro",
    body: "Pedro le asestó un golpe a Malco, el siervo del sumo sacerdote, y le cortó la oreja. Jesús lo reprendió: «Todos los que empuñan la espada perecerán por la espada». Le dijo que podía convocar doce legiones de ángeles, pero eligió no hacerlo: «Si el Padre me da a beber este trago amargo, ¿acaso no habré de beberlo?» (Juan 18:11). Nadie le quitaba la vida; él la entregaba."
  },
  {
    key: "it4", badge: "Lucas 22:51",
    name: "4. Jesús sana a Malco",
    body: "Después de hablar con Pedro, Jesús sanó la herida de Malco. Estos hombres vinieron armados a arrestarlo y, aun así, Jesús sanó a uno de ellos. Incluso en este momento de tanta tensión, siguió pensando en los demás, poniéndolos por encima de sí mismo, protegiendo tanto a sus amigos como a sus enemigos."
  },
];

const INVESTIGA_PARALELOS = [
  { key: "ip1", badge: "Marcos 14:32-52", name: "El relato de Marcos", body: "El relato más cercano en estructura al de Mateo: la angustia de Jesús, la triple oración, los discípulos dormidos y el arresto con el beso de Judas y la espada de uno de los presentes." },
  { key: "ip2", badge: "Lucas 22:39-53", name: "El relato de Lucas", body: "Lucas, el médico, añade el detalle del ángel que fortalece a Jesús y la descripción de su sudor «como grandes gotas de sangre» (22:43, 44). También registra que Jesús sanó la oreja del siervo herido." },
  { key: "ip3", badge: "Juan 18:1-11", name: "El relato de Juan", body: "Juan omite la agonía de la oración y se enfoca en el control absoluto de Jesús durante el arresto: su «Yo soy», los hombres que caen al suelo, y nombra a Pedro y a Malco explícitamente." },
];

const INVESTIGA_DOLOR = [
  { key: "id1", badge: "Isaías 53:10-12", name: "Puesto su vida en expiación", body: "«Con todo eso, Jehová quiso quebrantarlo, sujetándole a padecimiento... por su conocimiento justificará mi siervo justo a muchos, y llevará las iniquidades de ellos... habiendo él llevado el pecado de muchos, y orado por los transgresores» (Isaías 53:10-12)." },
  { key: "id2", badge: "Isaías 59:2", name: "El pecado oculta el rostro de Dios", body: "«Vuestras iniquidades han hecho división entre vosotros y vuestro Dios, y vuestros pecados han hecho ocultar de vosotros su rostro para no oír» (Isaías 59:2). En Getsemaní, Jesús experimentó esa misma separación, cargando nuestro pecado." },
  { key: "id3", badge: "2 Corintios 5:21", name: "Hecho pecado por nosotros", body: "«Al que no conoció pecado, por nosotros lo hizo pecado, para que nosotros fuésemos hechos justicia de Dios en él» (2 Corintios 5:21). Este intercambio es la raíz de la agonía de Cristo en el huerto." },
];

const INVESTIGA_LUCHA = [
  { key: "il1", badge: "Salmo 22:14, 15", name: "Como cera, como agua derramada", body: "«He sido derramado como aguas, y todos mis huesos se descoyuntaron; mi corazón fue como cera, derritiéndose en medio de mis entrañas... y me has puesto en el polvo de la muerte» (Salmo 22:14, 15)." },
  { key: "il2", badge: "Hebreos 5:7", name: "Ruegos y súplicas con gran clamor", body: "«Cristo, en los días de su carne, ofreciendo ruegos y súplicas con gran clamor y lágrimas al que le podía librar de la muerte, fue oído a causa de su temor reverente» (Hebreos 5:7)." },
  { key: "il3", badge: "Hebreos 12:3, 4", name: "Considerad a aquel que sufrió", body: "«Considerad a aquel que sufrió tal contradicción de pecadores contra sí mismo, para que vuestro ánimo no se canse hasta desmayar. Porque aún no habéis resistido hasta la sangre, combatiendo contra el pecado» (Hebreos 12:3, 4)." },
];

const VERSES = [
  {
    ref: "Mateo 26:36-56", isBase: true,
    text: `36 Entonces llegó Jesús con ellos a un lugar que se llama Getsemaní, y dijo a sus discípulos: Sentaos aquí, entre tanto que voy allí y oro. 37 Y tomando a Pedro, y a los dos hijos de Zebedeo, comenzó a entristecerse y a angustiarse en gran manera. 38 Entonces Jesús les dijo: Mi alma está muy triste, hasta la muerte; quedaos aquí, y velad conmigo. 39 Yendo un poco más adelante, se postró sobre su rostro, orando y diciendo: Padre mío, si es posible, pase de mí esta copa; pero no sea como yo quiero, sino como tú. 40 Vino luego a sus discípulos, y los halló durmiendo, y dijo a Pedro: ¿Así que no habéis podido velar conmigo una hora? 41 Velad y orad, para que no entréis en tentación; el espíritu a la verdad está dispuesto, pero la carne es débil. 42 Otra vez fue, y oró por segunda vez, diciendo: Padre mío, si no puede pasar de mí esta copa sin que yo la beba, hágase tu voluntad. 43 Vino otra vez, y los halló durmiendo, porque los ojos de ellos estaban cargados de sueño. 44 Y dejándolos, se fue de nuevo, y oró por tercera vez, diciendo las mismas palabras. 45 Entonces vino a sus discípulos y les dijo: Dormid ya, y descansad. He aquí ha llegado la hora, y el Hijo del Hombre es entregado en manos de pecadores. 46 Levantaos, vamos; ved, se acerca el que me entrega. 47 Mientras todavía hablaba, vino Judas, uno de los doce, y con él mucha gente con espadas y palos, de parte de los principales sacerdotes y de los ancianos del pueblo. 48 Y el que le entregaba les había dado señal, diciendo: Al que yo besare, ese es; prendedle. 49 Y en seguida se acercó a Jesús y dijo: ¡Salve, Maestro! Y le besó. 50 Y Jesús le dijo: Amigo, ¿a qué vienes? Entonces se acercaron y echaron mano a Jesús, y le prendieron. 51 Y he aquí, uno de los que estaban con Jesús, extendiendo la mano, sacó su espada, e hiriendo a un siervo del sumo sacerdote, le quitó la oreja. 52 Entonces Jesús le dijo: Vuelve tu espada a su lugar; porque todos los que tomen espada, a espada perecerán. 53 ¿Acaso piensas que no puedo ahora orar a mi Padre, y que él no me daría más de doce legiones de ángeles? 54 ¿Pero cómo entonces se cumplirían las Escrituras, de que es necesario que así se haga? 55 En aquella hora dijo Jesús a la multitud: ¿Como contra un ladrón habéis salido con espadas y con palos para prenderme? Cada día me sentaba con vosotros enseñando en el templo, y no me prendisteis. 56 Mas todo esto sucede, para que se cumplan las Escrituras de los profetas. Entonces todos los discípulos, dejándole, huyeron.`
  },
  {
    ref: "Salmo 23:4",
    text: `Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento.`
  },
  {
    ref: "Apocalipsis 14:10",
    text: `Este también beberá del vino del furor de Dios, que ha sido vaciado puro en el cáliz de su ira; y será atormentado con fuego y azufre delante de los santos ángeles y del Cordero.`
  },
  {
    ref: "Juan 18:5",
    text: `Le respondieron: A Jesús nazareno. Jesús les dijo: Yo soy. Y estaba también con ellos Judas, el que le entregaba.`
  },
  {
    ref: "Juan 8:58",
    text: `Jesús les dijo: De cierto, de cierto os digo: Antes que Abraham fuese, yo soy.`
  },
  {
    ref: "Lucas 22:36-38",
    text: `36 Y les dijo: Pues ahora, el que tiene bolsa, tómela, y también la alforja; y el que no tiene espada, venda su capa y compre una. 37 Porque os digo que es necesario que se cumpla todavía en mí aquello que está escrito: Y fue contado con los inicuos. Porque lo que está escrito de mí, tiene cumplimiento. 38 Entonces ellos dijeron: Señor, aquí hay dos espadas. Y él les dijo: Basta.`
  },
  {
    ref: "Juan 18:11",
    text: `Jesús entonces dijo a Pedro: Mete tu espada en la vaina; la copa que el Padre me ha dado, ¿no la he de beber?`
  },
  {
    ref: "Romanos 6:23",
    text: `Porque la paga del pecado es muerte, mas la dádiva de Dios es vida eterna en Cristo Jesús Señor nuestro.`
  },
  {
    ref: "Lucas 22:43, 44",
    text: `43 Y se le apareció un ángel del cielo para fortalecerle. 44 Y estando en agonía, oraba más intensamente; y era su sudor como grandes gotas de sangre que caían hasta la tierra.`
  },
  {
    ref: "Hebreos 12:2",
    text: `Puesta la mirada en Jesús, el autor y consumador de la fe, el cual por el gozo puesto delante de él sufrió la cruz, menospreciando el oprobio, y se sentó a la diestra del trono de Dios.`
  },
  {
    ref: "Isaías 53:10-12",
    text: `10 Con todo eso, Jehová quiso quebrantarlo, sujetándole a padecimiento. Cuando haya puesto su vida en expiación por el pecado, verá linaje, vivirá por largos días, y la voluntad de Jehová será en su mano prosperada. 11 Verá el fruto de la aflicción de su alma, y quedará satisfecho; por su conocimiento justificará mi siervo justo a muchos, y llevará las iniquidades de ellos. 12 Por tanto, yo le daré parte con los grandes, y con los fuertes repartirá despojos; por cuanto derramó su vida hasta la muerte, y fue contado con los pecadores, habiendo él llevado el pecado de muchos, y orado por los transgresores.`
  },
  {
    ref: "Isaías 59:2",
    text: `Vuestras iniquidades han hecho división entre vosotros y vuestro Dios, y vuestros pecados han hecho ocultar de vosotros su rostro para no oír.`
  },
  {
    ref: "2 Corintios 5:21",
    text: `Al que no conoció pecado, por nosotros lo hizo pecado, para que nosotros fuésemos hechos justicia de Dios en él.`
  },
  {
    ref: "Salmo 22:14, 15",
    text: `14 He sido derramado como aguas, y todos mis huesos se descoyuntaron; mi corazón fue como cera, derritiéndose en medio de mis entrañas. 15 Como un tiesto se secó mi vigor, y mi lengua se pegó a mi paladar, y me has puesto en el polvo de la muerte.`
  },
  {
    ref: "Hebreos 5:7",
    text: `Y Cristo, en los días de su carne, ofreciendo ruegos y súplicas con gran clamor y lágrimas al que le podía librar de la muerte, fue oído a causa de su temor reverente.`
  },
  {
    ref: "Hebreos 12:3, 4",
    text: `3 Considerad a aquel que sufrió tal contradicción de pecadores contra sí mismo, para que vuestro ánimo no se canse hasta desmayar. 4 Porque aún no habéis resistido hasta la sangre, combatiendo contra el pecado.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿A quiénes llevó Jesús más adentro del huerto para que oraran con él?",
    opts: ["A todos los once discípulos", "A Pedro, Santiago y Juan", "Solo a Pedro", "A ningún discípulo, fue solo"],
    ans: 1,
    feedback: "Jesús dejó a ocho discípulos cerca de la entrada y se llevó solo a Pedro, Santiago y Juan a lo más profundo del huerto, con la esperanza de que lo apoyaran orando (Mateo 26:37)."
  },
  {
    q: "¿Qué les dijo Jesús a sus discípulos sobre lo que sentía?",
    opts: ["Que estaba enojado con ellos", "Que sentía en su alma una tristeza de muerte", "Que tenía miedo de los fariseos", "Que quería huir de Jerusalén"],
    ans: 1,
    feedback: "«Siento en mi alma una tristeza de muerte. Quédense ustedes aquí, y permanezcan despiertos conmigo» (Mateo 26:38). No exageraba: básicamente les estaba diciendo que se estaba muriendo."
  },
  {
    q: "Según Apocalipsis 14:10, ¿qué representaba «la copa» que Jesús pidió que pasara de él?",
    opts: ["El dolor físico de la crucifixión", "La copa del furor / la ira de Dios contra el pecado", "El rechazo del pueblo judío", "El cansancio de tres años de ministerio"],
    ans: 1,
    feedback: "Apocalipsis describe esta copa como «la copa de su ira» (14:10). Como nuestro sustituto, Jesús, el que no tenía pecado, tomó lo que nosotros, los pecadores, merecíamos."
  },
  {
    q: "¿Por qué los discípulos no pudieron velar con Jesús esa noche?",
    opts: ["Estaban enfermos", "Se quedaron dormidos, porque el espíritu está dispuesto pero la carne es débil", "Se fueron a buscar ayuda", "Jesús les pidió que se retiraran"],
    ans: 1,
    feedback: "Vino y los halló durmiendo. «Velad y orad, para que no entréis en tentación; el espíritu a la verdad está dispuesto, pero la carne es débil» (Mateo 26:40, 41)."
  },
  {
    q: "¿Qué provocó que Jesús sudara «como grandes gotas de sangre» (Lucas 22:44)?",
    opts: ["El calor de la noche", "El peso aplastante del pecado del mundo sobre él", "Una enfermedad física", "El esfuerzo de caminar hasta el huerto"],
    ans: 1,
    feedback: "El peso del pecado literalmente le quitó la vida a Jesús. Su corazón se derritió como cera (Salmo 22:14). Getsemaní significa «prensa de aceite»."
  },
  {
    q: "Según Lucas 22:43, ¿qué envió Dios para fortalecer a Jesús en el huerto?",
    opts: ["Una voz audible desde el cielo", "Un ángel", "Ninguna ayuda; Jesús lo enfrentó completamente solo", "Un sueño reconfortante"],
    ans: 1,
    feedback: "«Se le apareció un ángel del cielo para fortalecerle» (Lucas 22:43). Si ese ángel no hubiera venido, Jesús podría haber muerto allí mismo, antes de llegar a la cruz."
  },
  {
    q: "¿Qué significó que Jesús dijera «Yo soy» a quienes vinieron a arrestarlo? (Juan 18:5)",
    opts: ["Simplemente confirmó su nombre", "Se identificó con el mismo término con el que Dios se daba a conocer, y los hombres cayeron al suelo", "Le pidió disculpas a la multitud", "Negó ser Jesús de Nazaret"],
    ans: 1,
    feedback: "Es el mismo «Yo Soy» de Juan 8:58. Al oírlo, los hombres cayeron inmediatamente al suelo, testimonio del poder divino de Cristo."
  },
  {
    q: "¿Qué hizo Jesús después de que Pedro le cortara la oreja a Malco?",
    opts: ["Lo ignoró y siguió caminando", "Reprendió a Pedro y sanó la oreja de Malco", "Le pidió a Pedro que huyera", "Convocó a los ángeles para pelear"],
    ans: 1,
    feedback: "Jesús reprendió la violencia de Pedro («todos los que empuñan la espada perecerán por la espada») y sanó la herida de Malco, mostrando compasión incluso por quienes venían a arrestarlo (Mateo 26:52; Lucas 22:51)."
  },
];

const DISCUSS_SUFRIMIENTO = [
  { n: 1, text: "¿Qué tipo de dolor estaba experimentando Jesús?", ref: "Mateo 26:36-39; Isaías 53:10-12" },
  { n: 2, text: "¿Qué nivel de presión tiene que soportar una persona para sudar gotas de sangre? ¿Qué crees que habría pasado si el ángel no hubiera venido a fortalecerlo?", ref: "Lucas 22:43, 44" },
];

const DISCUSS_DORMIDOS = [
  { n: 1, text: "¿Por qué crees que Jesús reprendió primero a Pedro por haberse quedado dormido?", ref: "Mateo 26:40, 41" },
  { n: 2, text: "Lucas 22:45 dice que los discípulos se quedaron dormidos por la tristeza. ¿Qué significa esto? ¿Te ha pasado alguna vez?", ref: "Lucas 22:45" },
];

const DISCUSS_ARRESTO = [
  { n: 1, text: "¿Cómo te sentirías si alguien te traicionara con un beso? ¿Por qué Jesús seguía llamando amigo a Judas?", ref: "Mateo 26:47-50" },
  { n: 2, text: "¿Cuál fue el problema en la forma en que Pedro respondió inicialmente al arresto de Cristo?", ref: "Mateo 26:51-54" },
  { n: 3, text: "A pesar de su inicial muestra de valentía, ¿qué hicieron los discípulos poco después del arresto de Jesús?", ref: "Mateo 26:56" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿De qué maneras nos quedamos dormidos cuando Jesús necesita que estemos completamente despiertos? ¿Qué implica mantenernos despiertos y orar?", ref: "Mateo 26:40, 41" },
  { key: "rfl2", q: "¿Es posible que a veces hiramos a las personas con nuestro celo desmedido, como lo hizo Pedro? ¿Alguna vez has visto a Dios sanar las heridas de alguien cuando eso ha pasado?", ref: "Mateo 26:51-54" },
  { key: "rfl3", q: "Lee Hebreos 12:2. ¿Cómo soportó Jesús el Getsemaní y la cruz? ¿Cuál era el gozo que Jesús anticipaba?", ref: "Hebreos 12:2" },
  { key: "rfl4", q: "Memoriza tu pasaje favorito de Mateo 26:36-56. Escríbelo varias veces para ayudarte a recordarlo.", ref: "Mateo 26:36-56" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">El jardín <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>de Getsemaní</em></div>
      <div className="sec-sub">Séptima Semana · Mateo 26:36-56 · Las escenas finales</div>

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
            <div className="card-label">Extrañamente callado</div>
            <p>Hay personas que parecen no alterarse nunca por nada, sin importar la crisis que enfrenten. Los discípulos conocían a Jesús así: sereno frente a cualquier situación. Pero en Getsemaní, Jesús se mostró diferente. Extrañamente callado. Triste. Vulnerable. «Al acercarse al huerto, los discípulos notaron el cambio de ánimo en su Maestro. Nunca antes le habían visto tan triste y callado» (Elena G. de White). Jesús sabía exactamente a dónde lo llevaba su camino, pero no se resistió ni huyó.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Mateo 26:38, 39
            </div>
            <div className="honey-text">
              «Siento en mi alma una tristeza de muerte. Quédense ustedes aquí, y permanezcan despiertos conmigo... Padre mío, si es posible, líbrame de este trago amargo; pero no sea como yo quiero, sino como tú.»
            </div>
            <div className="honey-ref">Mateo 26:38, 39 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text">Antes de que nadie pudiera tocarlo, Jesús ya estaba cerca de la muerte, no por tortura física, sino por el <strong>peso aplastante de nuestros pecados</strong>. Aun así, decidió seguir adelante.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Jesús deseaba sinceramente que su círculo más cercano lo apoyara en oración, pero mientras él <strong>luchaba solo con todo el peso del pecado</strong>, ellos se durmieron y lo dejaron con su carga.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Durante el arresto, Jesús mostró un <strong>control absoluto, compasión y compromiso</strong> con su misión: reprendió la violencia, sanó a uno de sus captores y entregó su vida con calma.</span>
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
      <div className="sec-sub">El trago amargo</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>Jesús anhelaba la compañía y el apoyo humanos en su hora más difícil. Este momento brindó una oportunidad única para que los discípulos le devolvieran algo a Jesús, pero Pedro, Santiago y Juan lucharon con el mismo cansancio que todos: se quedaron dormidos, dejando a Cristo solo con su lucha.</p>
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
        <p>¿De qué maneras nos quedamos dormidos cuando Jesús necesita que estemos completamente despiertos? ¿Qué implica mantenernos despiertos y orar?</p>
      </div>
    </>
  );
}

function TabAgonia({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Agonía</div>
      <div className="sec-sub">Extremadamente doloroso</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Un vistazo al sufrimiento de Dios</div>
        <p>El huerto de Getsemaní nos brinda una extraordinaria oportunidad de vislumbrar el sufrimiento mental y espiritual que Jesús soportó por nosotros. «Dios sufrió con su Hijo. [...] Hubo silencio en el cielo» (Elena G. de White, El Deseado de todas las gentes, cap. 74, p. 657). Si hay algo que demuestra que el pecado no se debe tomar a la ligera, es este momento.</p>
      </div>

      {AGONIA_DATA.map(item => (
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
        <p>Lee Hebreos 12:2. ¿Cómo soportó Jesús el Getsemaní y la cruz? ¿Cuál era el gozo que Jesús anticipaba?</p>
      </div>
    </>
  );
}

function TabInterpreta({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Interpreta</div>
      <div className="sec-sub">Guarda tu espada</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Control absoluto en medio del caos</div>
        <p>Jesús nunca defendió la violencia. Es cierto que expulsó a los mercaderes del templo y fabricó un látigo con cuerdas, pero ni siquiera en ese momento golpeó a nadie. Su postura pacifista, incluso estando armados, habría enviado un mensaje claro sobre la naturaleza del reino de Cristo, un mensaje que las acciones de Pedro amenazaban contradecir.</p>
      </div>

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
        <p>¿Es posible que a veces hiramos a las personas con nuestro celo desmedido, como lo hizo Pedro? ¿Alguna vez has visto a Dios sanar las heridas de alguien cuando eso ha pasado?</p>
      </div>
    </>
  );
}

function TabInvestiga({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Investiga</div>
      <div className="sec-sub">Lo que otras Escrituras revelan sobre Getsemaní</div>

      <div className="group-label">Relatos paralelos del Getsemaní</div>
      {INVESTIGA_PARALELOS.map(item => (
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

      <div className="group-label">Para entender el dolor de Cristo</div>
      {INVESTIGA_DOLOR.map(item => (
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

      <div className="group-label">La intensidad de la lucha de Cristo</div>
      {INVESTIGA_LUCHA.map(item => (
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
        <p>¿Qué otros versículos o promesas te vienen a la mente en relación con los acontecimientos del Getsemaní?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien la lucha de Jesús en el huerto y su control durante el arresto." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre lo que ocurrió en Getsemaní." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Mateo 26:36-56." :
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 74, pp. 653, 654</div>
        <div className="egw-text">«El corazón humano anhela solidaridad en el sufrimiento. Este anhelo lo sintió Cristo en las profundidades de su ser. En la suprema agonía de su alma, vino a sus discípulos con un anhelante deseo de oír algunas palabras de consuelo de aquellos a quienes había bendecido y consolado con tanta frecuencia. [...] Si tan solo pudiera saber que sus discípulos comprendían y apreciaban esto, se sentiría fortalecido. <strong>Levantándose con penoso esfuerzo, fue tambaleándose adonde había dejado a sus compañeros. Pero "los encontró dormidos".</strong> Si los hubiera hallado orando, habría quedado aliviado. [...] Pero no habían escuchado la amonestación repetida: "Manténganse despiertos y oren".»</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Para entender el sufrimiento de Cristo</div>
        {DISCUSS_SUFRIMIENTO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Los discípulos dormidos</div>
        {DISCUSS_DORMIDOS.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> La repetida petición de Cristo de que oremos por él denota vulnerabilidad personal. ¿Cómo encaja esto con la opinión generalizada de que vulnerabilidad es sinónimo de debilidad?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">El arresto en el jardín</div>
        {DISCUSS_ARRESTO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> A pesar de todas sus promesas, los discípulos abandonaron a Jesús cuando lo arrestaron. ¿Qué nos enseña esto sobre la falta de conciencia que a veces tenemos nosotros mismos?</div>
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
        <div className="card-label">Puntos clave para recordar</div>
        <ul className="key-list">
          <li>
            <span className="key-dot" />
            <span className="key-text">Antes de que nadie pudiera tocarlo, Jesús ya estaba cerca de la muerte, no por tortura física, sino por el <strong>peso aplastante de nuestros pecados</strong>. Aun así, decidió seguir adelante, porque nos vio y cree que valemos la pena.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Jesús deseaba sinceramente que su círculo más cercano lo apoyara en oración, pero mientras él <strong>luchaba contra todo el peso del pecado</strong> y se rendía a la voluntad del Padre, ellos se durmieron y lo dejaron solo con su carga.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Durante el arresto, Jesús mostró un <strong>control absoluto, compasión y compromiso</strong> con su misión. Reprendió la violencia, incluso sanó a uno de los que vinieron a arrestarlo, y luego, con calma, decidió seguir adelante y entregar su vida.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Jesús le pidió a sus tres amigos más cercanos una sola cosa esa noche: que se mantuvieran despiertos con él. No pudieron. Capaz vos también conocés esa sensación: alguien te necesita —un mensaje que no contestaste, un amigo que estaba pasando por algo difícil mientras vos estabas distraído con el teléfono— y cuando te diste cuenta, ya era tarde.</p>
          <br />
          <p>Jesús no dejó de amar a Pedro, Santiago y Juan por quedarse dormidos. Los siguió llamando amigos. Pero su historia es una invitación: <strong>la próxima vez que alguien en tu grupo, tu familia o tu chat te diga «estoy mal», elegí quedarte despierto.</strong> Escuchá antes de responder. Preguntá cómo está de verdad, no por cortesía.</p>
          <br />
          <p>Y si sos vos el que está cargando algo pesado esta semana —un examen, una pelea, una decisión difícil— recordá que Jesús ya conoció ese peso, hasta sudar gotas de sangre por vos. No estás solo, aunque a veces se sienta así. <strong>Esta semana, silenciá el teléfono diez minutos y estate completamente presente con quien lo necesite.</strong></p>
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
    { id: "interioriza",  label: "Interioriza",  Icon: Moon },
    { id: "agonia",       label: "Agonía",       Icon: Droplet },
    { id: "interpreta",   label: "Interpreta",   Icon: Shield },
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
              InVerso · Semana 7
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              El jardín <em>de Getsemaní</em>
            </h1>
            <div className="hero-ref">Mateo 26:36-56 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"       && <TabInicio teacherMode={teacherMode} />}
            {tab === "interioriza"  && <TabInterioriza openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "agonia"       && <TabAgonia openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "interpreta"   && <TabInterpreta openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "investiga"    && <TabInvestiga openExpand={openExpand} toggleExpand={toggleExpand} />}
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
