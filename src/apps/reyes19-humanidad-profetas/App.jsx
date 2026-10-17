import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Mountain, ShieldAlert, Crown, ScrollText, Users
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0d060b;--bg2:#150b12;--bg3:#1f1119;--surf:#281621;--surf2:#341d2c;--brd:#43263a;--brd2:#63395a;--tx:#f5e8f0;--tx2:#b896aa;--tx3:#85627a;--acc:#a8508f;--acc2:#cf86bb;--acc3:#f0cde6;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#d4a94a;--warn-d:rgba(212,169,74,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1a0b15 0%,#150b12 55%,#0d060b 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(168,80,143,.30) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(168,80,143,.40);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(168,80,143,.10)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(168,80,143,.48) 30%,rgba(168,80,143,.48) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(168,80,143,.18);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(168,80,143,.25);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(212,169,74,.18);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(168,80,143,.09)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(168,80,143,.25);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(168,80,143,.16),rgba(168,80,143,.02));border:1px solid rgba(168,80,143,.30);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(168,80,143,.12);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(168,80,143,.20),rgba(168,80,143,.03));border:1px solid rgba(168,80,143,.36);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.honey-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.honey-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.honey-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}
.guide-banner{background:linear-gradient(135deg,rgba(212,169,74,.12),rgba(212,169,74,.02));border:1px solid rgba(212,169,74,.24);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(212,169,74,.16);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
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
.vida-card{background:linear-gradient(135deg,rgba(168,80,143,.20),rgba(168,80,143,.03));border:1.5px solid rgba(168,80,143,.38);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(168,80,143,.10);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
.cmp-block{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1rem .9rem;margin-bottom:.85rem}
.cmp-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--tx);margin-bottom:.7rem;line-height:1.3}
.cmp-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.cmp-cell{border-radius:10px;padding:.7rem .7rem;font-size:.93rem;line-height:1.5;color:var(--tx2)}
.cmp-cell.a{background:rgba(168,80,143,.12);border:1px solid rgba(168,80,143,.28)}
.cmp-cell.b{background:rgba(212,169,74,.08);border:1px solid rgba(212,169,74,.24)}
.cmp-lbl{font-family:'IBM Plex Mono',monospace;font-size:.55rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.35rem;display:block}
.cmp-cell.a .cmp-lbl{color:var(--acc2)}
.cmp-cell.b .cmp-lbl{color:var(--warn)}
.cmp-note{font-size:.93rem;line-height:1.55;color:var(--tx2);margin-top:.7rem;padding-top:.65rem;border-top:1px solid var(--brd)}
.sym-card{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1rem .95rem;margin-bottom:.85rem}
.sym-head{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin-bottom:.35rem}
.sym-name{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--tx);line-height:1.3}
.sym-ref{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);white-space:nowrap}
.sym-fact{font-size:.97rem;line-height:1.5;color:var(--tx2);margin-bottom:.7rem}
.sym-opt{width:100%;background:var(--bg2);border:1.5px solid var(--brd);border-radius:10px;padding:.7rem .85rem;font-size:.97rem;line-height:1.45;color:var(--tx2);cursor:pointer;text-align:left;margin-bottom:.4rem;font-family:'DM Sans',sans-serif;transition:all .2s}
.sym-opt.sel{border-color:var(--acc2);color:var(--tx);background:rgba(168,80,143,.14)}
.sym-opt.ok{border-color:var(--ok);background:var(--ok-d);color:var(--ok)}
.sym-opt.bad{border-color:var(--err);background:var(--err-d);color:var(--err)}
.sym-opt:disabled{cursor:default}
.sym-expl{font-size:.95rem;line-height:1.55;color:var(--tx2);background:var(--surf2);border-radius:10px;padding:.75rem .85rem;margin-top:.35rem}
.check-btn{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#fff;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;margin-top:.2rem;transition:background .2s}
.check-btn:disabled{background:var(--brd2);color:var(--tx3);cursor:default}
.check-result{text-align:center;font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:600;color:var(--acc3);margin:.9rem 0 .4rem}
.faith-item{display:flex;gap:.75rem;align-items:flex-start;background:var(--surf);border:1px solid var(--brd);border-radius:12px;padding:.8rem .95rem;margin-bottom:.5rem;cursor:pointer;transition:all .2s}
.faith-item.on{border-color:var(--acc);background:rgba(168,80,143,.10)}
.faith-item svg{flex-shrink:0;margin-top:.15rem}
.faith-text{font-size:.97rem;line-height:1.5;color:var(--tx2)}
.faith-item.on .faith-text{color:var(--tx)}
.faith-count{font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--tx3);text-align:right;margin:.2rem 0 1rem;letter-spacing:.06em}
`;
// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: el GPS espiritual", desc: "Preguntar: ¿qué hace un GPS? Te dice dónde estás, hacia dónde vas y te avisa de los peligros. Presentar la idea de la semana: Dios usó a los profetas como un «GPS» para su pueblo, y eran personas de carne y hueso, con miedo, ira y desánimo. Hoy conocemos a uno de los más grandes: Elías." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos del grupo. Orar pidiendo que Dios nos hable por los canales que él eligió (su Palabra y el don de profecía) y que nos acompañe en los momentos bajos." },
  { time: "05–11 min", title: "Tab Elías — Del Carmelo al desierto", desc: "Recorrer los siete momentos de 1 Reyes 19:1-16 tocando cada tarjeta. Detenerse en los versículos 4-10. Hacer el «detective de palabras»: ¿qué frases se repiten? (la vida, «Levántate, come», «¿Qué haces aquí, Elías?», «solo yo he quedado»). Preguntar: ¿qué observan del estado emocional de Elías? Contrastar con Santiago 5:17 y Dios que lo busca, lo alimenta y lo restaura." },
  { time: "11–16 min", title: "Tab Falsos — Micaías contra cuatrocientos", desc: "Leer 1 Reyes 22:1-14 con el grupo y mirar la comparación Micaías / falsos profetas. Hacer la dinámica «¿Verdadero o falso?» en el celular. Modo maestro: abre la explicación completa de cada rasgo. Conectar con 1 Reyes 18:19 y Deuteronomio 18:20." },
  { time: "16–20 min", title: "Tab Mujeres — Profetisas", desc: "Hacer la dinámica «¿Quién soy?» con Miriam, Débora, Hulda y Noadías. Leer Éxodo 15:20, Jueces 4:4-5, 2 Reyes 22:11-14 y las falsas profetisas de Nehemías 6:14 y Ezequiel 13:17-18. Idea clave: Dios llamó tanto a hombres como a mujeres." },
  { time: "20–24 min", title: "Tab Funciones — Reyes, sacerdotes y naciones", desc: "Recorrer las funciones del profeta: guiar a los reyes, confrontar a los sacerdotes, enseñar al pueblo, hablar a las naciones y escribir los mensajes. Cerrar con la pregunta: ¿cómo nos ayuda esto a entender a Jesús como profeta (Mateo 21:11, 46; Lucas 7:16; 24:19)?" },
  { time: "24–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Detenerse en la respuesta de Dios al desánimo de Elías y en la respuesta de Micaías a la presión del rey." },
  { time: "27–30 min", title: "Reflexión y cierre", desc: "Usar los tres bloques de inQuiere («La humanidad de los profetas», «La lucha contra los falsos profetas» y «El papel y la naturaleza de los profetas») y las reflexiones personales. Leer la cita de Elena G. de White sobre su llamado: Dios elige a personas imperfectas que están dispuestas a servirlo. Cerrar con «Para tu vida»." },
];

const ELIAS_PASOS = [
  {
    key: "e1", badge: "19:1, 2",
    name: "1. Una amenaza de muerte",
    body: "Acab le cuenta a Jezabel todo lo que Elías había hecho, y cómo había matado a espada a todos los profetas. Ella envía un mensajero a Elías con un juramento: «Así me hagan los dioses, y aun me añadan, si mañana a estas horas yo no he puesto tu persona como la de uno de ellos»."
  },
  {
    key: "e2", badge: "19:3",
    name: "2. Miedo y huida",
    body: "«Viendo, pues, el peligro, se levantó y se fue para salvar su vida». Llega a Beerseba, en Judá, y deja allí a su criado. Elías olvida cómo el Señor acababa de protegerlo y guiarlo en el Carmelo; se dejó dominar por el miedo."
  },
  {
    key: "e3", badge: "19:4",
    name: "3. «Basta ya, oh Jehová»",
    body: "Se interna un día de camino en el desierto, se sienta debajo de un enebro y, deseando morirse, dice: «Basta ya, oh Jehová, quítame la vida, pues no soy yo mejor que mis padres». Suena a un hombre que sufre de depresión: justo después del punto más alto de su ministerio llega la desesperación."
  },
  {
    key: "e4", badge: "19:5-8",
    name: "4. Dios lo busca, lo alimenta y lo restaura",
    body: "Elías se echa y se duerme. Un ángel lo toca: «Levántate, come». A su cabecera hay una torta cocida sobre las ascuas y una vasija de agua. Come, bebe y vuelve a dormirse. El ángel viene una segunda vez: «Levántate y come, porque largo camino te resta». Fortalecido con aquella comida, camina cuarenta días y cuarenta noches hasta Horeb, el monte de Dios. Dios no empieza con un reproche: empieza cuidando."
  },
  {
    key: "e5", badge: "19:9, 10",
    name: "5. «¿Qué haces aquí, Elías?»",
    body: "En una cueva de Horeb, la palabra de Jehová le pregunta: «¿Qué haces aquí, Elías?». Elías responde: «He sentido un vivo celo por Jehová Dios de los ejércitos; porque los hijos de Israel han dejado tu pacto, han derribado tus altares, y han matado a espada a tus profetas; y sólo yo he quedado, y me buscan para quitarme la vida». Aparece la soledad y la sensación de fracaso: la apostasía seguía a pesar de sus esfuerzos."
  },
  {
    key: "e6", badge: "19:11-14",
    name: "6. El viento, el terremoto, el fuego y el silbo",
    body: "Jehová le dice que salga y se ponga en el monte. Pasa un viento grande y poderoso que rompe los montes y quiebra las peñas, pero Jehová no estaba en el viento. Después un terremoto; Jehová no estaba en el terremoto. Después un fuego; Jehová no estaba en el fuego. Y tras el fuego, «un silbo apacible y delicado». Elías cubre su rostro con su manto, sale y se pone a la puerta de la cueva. La voz vuelve a preguntar: «¿Qué haces aquí, Elías?». Y él repite palabra por palabra la misma respuesta del versículo 10."
  },
  {
    key: "e7", badge: "19:15, 16",
    name: "7. Una nueva misión",
    body: "Dios no lo deja en la cueva: «Ve, vuélvete por tu camino». Le encarga ungir a Hazael por rey de Siria, a Jehú hijo de Nimsi por rey sobre Israel, y a Eliseo hijo de Safat, de Abel-mehola, «para que sea profeta en tu lugar». Elías pasa del desánimo a una tarea concreta, y recibe a alguien que continuará su obra."
  },
];

const REPETIDAS = [
  {
    key: "r1", badge: "vida · 6×",
    name: "La vida en peligro",
    body: "«Salvar su vida» (v. 3), «quítame la vida» (v. 4) y «me buscan para quitarme la vida» (vv. 10, 14); además la amenaza de Jezabel en el v. 2. Toda la historia gira en torno al miedo a morir y al deseo de morir."
  },
  {
    key: "r2", badge: "Levántate, come · 2×",
    name: "El cuidado práctico de Dios",
    body: "El ángel dice «Levántate, come» (v. 5) y de nuevo «Levántate y come, porque largo camino te resta» (v. 7). Dios atiende primero el cuerpo cansado: comida, agua y descanso. Y le recuerda que todavía hay camino por delante."
  },
  {
    key: "r3", badge: "¿Qué haces aquí? · 2×",
    name: "La pregunta de Dios",
    body: "La misma pregunta en los versículos 9 y 13. No es una pregunta para informarse: Dios invita a Elías a poner en palabras lo que siente. Y Elías puede decirlo con total honestidad."
  },
  {
    key: "r4", badge: "solo yo · 2×",
    name: "La soledad",
    body: "«Sólo yo he quedado» (vv. 10 y 14), con la misma frase y casi las mismas palabras en ambos casos. Elías se sentía solo y lamentaba el aparente fracaso de su ministerio, como si él solo pudiera haber corregido a toda la nación."
  },
  {
    key: "r5", badge: "Jehová no estaba · 3×",
    name: "No en el estruendo",
    body: "«Jehová no estaba en el viento… en el terremoto… en el fuego» (vv. 11, 12). Después de tanto estruendo, Dios llega en «un silbo apacible y delicado». Elías había visto fuego del cielo en el Carmelo; ahora Dios le habla de otra manera."
  },
];

const FALSOS_COMPARA = [
  {
    key: "fc1", title: "El mensaje",
    a: { lbl: "Los cuatrocientos", text: "«Sube, porque Jehová la entregará en mano del rey». Todos a una voz: «Sube… y serás prosperado» (1 Rey. 22:6, 12)." },
    b: { lbl: "Micaías", text: "«Vive Jehová, que lo que Jehová me hablare, eso diré» (1 Rey. 22:14). Esperó a que Dios le dijera qué decir." },
    note: "Los falsos profetas decían lo que el rey quería oír. El verdadero profeta decía lo que Dios había revelado, sin importar cómo fuera recibido."
  },
  {
    key: "fc2", title: "La presión",
    a: { lbl: "Los cuatrocientos", text: "Unanimidad total. Eran profetas de la familia real (1 Rey. 18:19) y no tenían nada que perder con decir lo que el rey deseaba." },
    b: { lbl: "Micaías", text: "El mensajero que lo trajo insistió en que no dijera nada que contradijera lo ya dicho: «tu palabra sea como la de uno de ellos» (1 Rey. 22:13)." },
    note: "Micaías se enfrentó él solo a cuatrocientos. Incluso presionado para modificar los mensajes de juicio del Señor y apaciguar al malvado Acab, presentó la verdad de Dios."
  },
  {
    key: "fc3", title: "La reacción del rey",
    a: { lbl: "Acab sobre los falsos", text: "Los consulta, los reúne y les cree: le dicen lo que quiere escuchar." },
    b: { lbl: "Acab sobre Micaías", text: "«Yo le aborrezco, porque nunca me profetiza cosa buena, sino solamente mal» (1 Rey. 22:8)." },
    note: "Esa frase dice mucho del rey, pero también del profeta: era un hombre que no temía decir la verdad ni siquiera al propio rey, lo cual no era la mejor manera de ganarse el favor real."
  },
];

const FALSOS_DINAMICA = [
  {
    key: "v1", name: "Dice lo que el rey quiere escuchar", ref: "1 Reyes 22:6, 13",
    fact: "Todos coinciden en el mismo mensaje agradable. Cuando lo llaman a hablar, le piden que su palabra «sea como la de uno de ellos».",
    opts: ["Profeta verdadero", "Profeta falso"],
    ans: 1,
    expl: "Los cuatrocientos «profetas» aconsejaron unánimemente al rey que peleara. La presión para mentir era probablemente la misma que sentían ellos: decir lo que el rey deseaba."
  },
  {
    key: "v2", name: "Espera que Dios le diga qué hablar", ref: "1 Reyes 22:14",
    fact: "Cuando lo presionan para que cambie su mensaje, responde: «lo que Jehová me hablare, eso diré».",
    opts: ["Profeta verdadero", "Profeta falso"],
    ans: 0,
    expl: "Micaías no accedió a la presión. Esperó a que Dios le dijera qué decir. Los verdaderos profetas son receptores de la revelación y la inspiración de Dios."
  },
  {
    key: "v3", name: "Come de la mesa de Jezabel", ref: "1 Reyes 18:19",
    fact: "Son cientos de profetas de Baal y de la Asera, financiados por la familia real.",
    opts: ["Profeta verdadero", "Profeta falso"],
    ans: 1,
    expl: "Elías pide reunir «los cuatrocientos cincuenta profetas de Baal, y los cuatrocientos profetas de la Asera, que comen de la mesa de Jezabel». El mensaje de Elías se oponía abiertamente a los cientos de falsos profetas pagados por la corona."
  },
  {
    key: "v4", name: "Transmite fielmente aunque choque con el poder", ref: "1 Reyes 22:8",
    fact: "El rey dice de él: «Lo odio, porque jamás me profetiza algo bueno, sino todo lo malo».",
    opts: ["Profeta verdadero", "Profeta falso"],
    ans: 0,
    expl: "Los verdaderos profetas transmitían los mensajes de Dios con fidelidad, precisión y honestidad, aunque a veces esto los pusiera en conflicto directo con los que estaban en el poder."
  },
  {
    key: "v5", name: "Habla lo que Dios no le mandó", ref: "Deuteronomio 18:20",
    fact: "Tiene la presunción de hablar en nombre de Dios palabra que no le fue mandada, o habla en nombre de dioses ajenos.",
    opts: ["Profeta verdadero", "Profeta falso"],
    ans: 1,
    expl: "Hay evidencia de falsos profetas desde la historia temprana de Israel (Deut. 18:20). Afortunadamente Dios dio a su pueblo orientación para distinguir quiénes eran sus verdaderos profetas."
  },
  {
    key: "v6", name: "Se queda solo frente a cuatrocientos", ref: "1 Reyes 22:1-14",
    fact: "Presenta la verdad que le fue revelada sin importarle cómo sea recibida, aunque todos los demás digan lo contrario.",
    opts: ["Profeta verdadero", "Profeta falso"],
    ans: 0,
    expl: "Por cada obra de Dios, Satanás tiene sus falsificaciones. Israel se enfrentó tanto a profetas verdaderos como a falsos; la clave estaba en saber distinguirlos."
  },
];

const MUJERES_DINAMICA = [
  {
    key: "m1", name: "Tomó un pandero y las mujeres salieron tras ella", ref: "Éxodo 15:20",
    fact: "Era hermana de Aarón, y Dios la envió delante de su pueblo junto con Moisés y Aarón.",
    opts: ["Miriam", "Débora", "Hulda", "Noadías"],
    ans: 0,
    expl: "Éxodo 15:20 la llama «María la profetisa, hermana de Aarón», y Miqueas 6:4 recuerda que Dios envió delante de Israel «a Moisés, a Aarón y a María»: profetisa y líder."
  },
  {
    key: "m2", name: "Juzgaba a Israel debajo de una palmera", ref: "Jueces 4:4-5",
    fact: "Los hijos de Israel subían a ella a juicio. Se levantó «madre en Israel» cuando las aldeas habían decaído.",
    opts: ["Miriam", "Débora", "Hulda", "Noadías"],
    ans: 1,
    expl: "Débora fue profetisa y jueza. Jueces 5:7: «hasta que yo Débora me levanté, me levanté madre en Israel»."
  },
  {
    key: "m3", name: "Consultada por el rey Josías", ref: "2 Reyes 22:11-14",
    fact: "Cuando se halló el libro de la ley, el rey rasgó sus vestidos y mandó consultar a Jehová. El sacerdote Hilcías fue a hablar con ella.",
    opts: ["Miriam", "Débora", "Hulda", "Noadías"],
    ans: 2,
    expl: "Hulda fue profetisa y consejera real (2 Rey. 22:14; 2 Crón. 34:22). Cuando el sacerdote y los oficiales del rey buscaron orientación espiritual, acudieron a ella."
  },
  {
    key: "m4", name: "Quería infundir miedo a Nehemías", ref: "Nehemías 6:14",
    fact: "Nehemías pide a Dios que se acuerde de ella entre los profetas que procuraban asustarlo.",
    opts: ["Miriam", "Débora", "Hulda", "Noadías"],
    ans: 3,
    expl: "Noadías es una de las falsas profetisas. Ezequiel 13:17-18 también condena a «las hijas de tu pueblo que profetizan de su propio corazón»."
  },
];

const MUJERES_DETALLE = [
  {
    key: "md1", badge: "Éxodo 15:20 · Miqueas 6:4",
    name: "Miriam, profetisa y líder",
    body: "Tomó un pandero en su mano y todas las mujeres salieron en pos de ella con panderos y danzas. Dios, por medio de Miqueas, la cuenta entre quienes envió delante de su pueblo: «a Moisés, a Aarón y a María»."
  },
  {
    key: "md2", badge: "Jueces 4:4-5 · 5:7",
    name: "Débora, profetisa y jueza",
    body: "Juzgaba a Israel; se sentaba debajo de una palmera entre Ramá y Bet-el, y los hijos de Israel subían a ella a juicio. Ella misma dice: «me levanté madre en Israel»."
  },
  {
    key: "md3", badge: "2 Reyes 22:11-14 · 2 Crónicas 34:19-22",
    name: "Hulda, profetisa y consejera real",
    body: "El rey rasgó sus vestidos al oír la ley y mandó consultar a Jehová. Fueron a Hulda, que moraba en Jerusalén, y le hablaron. Ella transmitió la palabra de Dios al rey, y sus palabras fueron guardadas por escrito en los libros de Reyes y Crónicas."
  },
  {
    key: "md4", badge: "Nehemías 6:14 · Ezequiel 13:17, 18",
    name: "Ejemplos de falsas profetisas",
    body: "Noadías, entre los profetas que procuraban infundir miedo a Nehemías. Y las hijas del pueblo que «profetizan de su propio corazón», contra quienes Ezequiel debía profetizar. Que existan falsificaciones no invalida lo auténtico: también hubo falsos profetas hombres."
  },
];

const FUNCIONES_REYES = [
  {
    key: "fr1", badge: "1 Samuel 8:5, 11-18",
    name: "El pueblo quería «un rey, como las naciones»",
    body: "Samuel intentó evitar que Israel estuviera bajo el dominio de un rey, pero el pueblo lo exigió: «un rey que nos gobierne, como es costumbre en todas las naciones». Dios les advirtió a través de su profeta lo que traería esa petición. Siguiendo los deseos del pueblo, Samuel ungió a Saúl, el primer rey de Israel. Un ejemplo triste y poderoso del peligro de siempre: querer ser como los que nos rodean."
  },
  {
    key: "fr2", badge: "Reyes y Crónicas",
    name: "Más reyes malos que buenos",
    body: "Los dos libros de Reyes y los dos de Crónicas registran el tipo y la calidad del gobierno de los reyes de Israel y Judá. Los que hicieron el mal superaban con creces a los que hicieron el bien a los ojos de Dios. Una de las funciones principales de los profetas era ayudar a guiar a los reyes infieles de vuelta a la obediencia a la ley de Dios."
  },
  {
    key: "fr3", badge: "1 Reyes 18:4-19 · 2 Crónicas 24:20-22",
    name: "Un trabajo peligroso",
    body: "Los profetas se enfrentaban a amenazas, y algunos fueron heridos y asesinados por reyes que alejaban de Dios a su pueblo. Jezabel destruía a los profetas de Jehová; Zacarías hijo del sacerdote Joiada fue apedreado por mandato del rey Joás."
  },
];

const FUNCIONES_SACERDOTES = [
  {
    key: "fs1", badge: "Levítico 8:10-13",
    name: "Moisés ungió a los sacerdotes",
    body: "Moisés, profeta de Dios, ungió a Aarón y a sus hijos como sacerdotes de Israel."
  },
  {
    key: "fs2", badge: "Oseas 6:9 · Malaquías 2:1-3",
    name: "Palabras de reprensión",
    body: "En ocasiones Dios enviaba reprensión a los sacerdotes a través de los profetas."
  },
  {
    key: "fs3", badge: "1 Samuel 2:27-36",
    name: "La casa de Elí",
    body: "Un ejemplo llamativo: toda la casa de Elí fue confrontada por sus prácticas corruptas. Reprensiones así eran muy severas, pues se daban en respuesta a la corrupción desenfrenada de personas a las que se les habían concedido privilegios especiales."
  },
];

const FUNCIONES_PUEBLO = [
  {
    key: "fp1", badge: "2 Crónicas 34:14-28 · Jeremías 5:31 · Ezequiel 22:26",
    name: "Maestros del pueblo",
    body: "Los profetas eran maestros del pueblo. Presentaban mensajes de Dios a los sacerdotes, a los reyes y a la nación en general."
  },
  {
    key: "fp2", badge: "Isaías 60:1-3 · 62:1-2",
    name: "Mensajeros para las naciones",
    body: "Los profetas también comunicaban a las naciones vecinas el plan de Dios para ellas, un tema que se repite en los mensajes de varios profetas."
  },
  {
    key: "fp3", badge: "2 Crónicas 13:22",
    name: "Escritores y guardianes del mensaje",
    body: "Se esperaba que transmitieran fielmente los mensajes de Dios, y a veces también se les ordenaba escribirlos y conservarlos."
  },
  {
    key: "fp4", badge: "Jeremías 42:4 · 2 Reyes 22:15-17",
    name: "Personas de oración y de la Palabra",
    body: "Por muy humanos e imperfectos que fueran, eran hombres y mujeres de oración, fieles a la Palabra, y servidores de Dios y de su pueblo."
  },
];

const VERSES = [
  {
    ref: "1 Reyes 19:1-16", isBase: true,
    text: `1 Acab dio la nueva a Jezabel de todo lo que Elías había hecho, y cómo había matado a espada a todos los profetas. 2 Entonces Jezabel envió un mensajero a Elías, diciendo: Así me hagan los dioses, y aun me añadan, si mañana a estas horas yo no he puesto tu persona como la de uno de ellos. 3 Viendo, pues, el peligro, se levantó y se fue para salvar su vida, y vino a Beerseba, que está en Judá, y dejó allí a su criado. 4 Y él se fue por el desierto un día de camino, y vino y se sentó debajo de un enebro; y deseando morirse, dijo: Basta ya, oh Jehová, quítame la vida, pues no soy yo mejor que mis padres. 5 Y se echó y durmió debajo del enebro, y he aquí luego un ángel le tocó, y le dijo: Levántate, come. 6 Entonces miró, y he aquí a su cabecera una torta cocida sobre las ascuas, y una vasija de agua; y comió y bebió, y volvió a dormirse. 7 Y vino la segunda vez el ángel de Jehová, y le tocó, diciendo: Levántate y come, porque largo camino te resta. 8 Se levantó, pues, y comió y bebió; y fortalecido con aquella comida caminó cuarenta días y cuarenta noches hasta Horeb, el monte de Dios. 9 Y allí se metió en una cueva, donde pasó la noche. Y vino a él palabra de Jehová, el cual le dijo: ¿Qué haces aquí, Elías? 10 El respondió: He sentido un vivo celo por Jehová Dios de los ejércitos; porque los hijos de Israel han dejado tu pacto, han derribado tus altares, y han matado a espada a tus profetas; y sólo yo he quedado, y me buscan para quitarme la vida. 11 Él le dijo: Sal fuera, y ponte en el monte delante de Jehová. Y he aquí Jehová que pasaba, y un grande y poderoso viento rompía los montes, y quebraba las peñas delante de Jehová; pero Jehová no estaba en el viento. Y tras el viento un terremoto; pero Jehová no estaba en el terremoto. 12 Y tras el terremoto un fuego; pero Jehová no estaba en el fuego. Y tras el fuego un silbo apacible y delicado. 13 Y cuando lo oyó Elías, cubrió su rostro con su manto, y salió, y se puso a la puerta de la cueva. Y he aquí vino a él una voz, diciendo: ¿Qué haces aquí, Elías? 14 Él respondió: He sentido un vivo celo por Jehová Dios de los ejércitos; porque los hijos de Israel han dejado tu pacto, han derribado tus altares, y han matado a espada a tus profetas; y sólo yo he quedado, y me buscan para quitarme la vida. 15 Y le dijo Jehová: Ve, vuélvete por tu camino, por el desierto de Damasco; y llegarás, y ungirás a Hazael por rey de Siria. 16 A Jehú hijo de Nimsi ungirás por rey sobre Israel; y a Eliseo hijo de Safat, de Abel-mehola, ungirás para que sea profeta en tu lugar.`
  },
  {
    ref: "2 Reyes 2:11",
    text: `Y aconteció que yendo ellos y hablando, he aquí un carro de fuego con caballos de fuego apartó a los dos; y Elías subió al cielo en un torbellino.`
  },
  {
    ref: "Juan 1:21",
    text: `Y le preguntaron: ¿Pues qué? ¿Eres tú Elías? Dijo: No soy. ¿Eres tú el profeta? Y respondió: No.`
  },
  {
    ref: "Marcos 8:27, 28",
    text: `27 Salieron Jesús y sus discípulos por las aldeas de Cesarea de Filipo; y en el camino preguntó a sus discípulos, diciéndoles: ¿Quién dicen los hombres que soy? 28 Ellos respondieron: Unos, Juan el Bautista; otros, Elías; y otros, alguno de los profetas.`
  },
  {
    ref: "Mateo 27:49",
    text: `Pero los otros decían: Deja, veamos si viene Elías a librarle.`
  },
  {
    ref: "1 Reyes 17:1",
    text: `Entonces Elías tisbita, de los moradores de Galaad, dijo a Acab: Vive Jehová Dios de Israel, en cuya presencia estoy, que no habrá lluvia ni rocío en estos años, sino por mi palabra.`
  },
  {
    ref: "1 Reyes 18:4-19",
    text: `4 Porque cuando Jezabel destruía a los profetas de Jehová, Abdías tomó a cien profetas, y los escondió de cincuenta en cincuenta por cuevas, y los sustentó con pan y agua. 5 Dijo, pues, Acab a Abdías: Ve por el país a todas las fuentes de aguas, y a todos los arroyos; quizá hallaremos hierba con que conservemos la vida a los caballos y las mulas, para que no se nos mueran todas las bestias. 6 Y dividieron entre sí el país para recorrerlo; Acab fue solo por un camino, y Abdías fue solo por otro. 7 Y yendo Abdías por el camino, se encontró con Elías; y cuando lo reconoció, se postró sobre su rostro, y dijo: ¿No eres tú mi señor Elías? 8 Y él respondió: Yo soy; ve, di a tu amo: Aquí está Elías. 9 Y él dijo: ¿En qué he pecado, para que entregues a tu siervo en mano de Acab para que me mate? 10 Vive Jehová tu Dios, que no ha habido nación ni reino adonde mi amo no haya enviado a buscarte; y cuando decían: No está aquí, hacía jurar a reinos y a naciones que no te habían hallado. 11 ¿Y ahora tú dices: Ve, di a tu amo: Aquí está Elías? 12 Acontecerá que cuando yo me haya ido, el Espíritu de Jehová te llevará adonde yo no sepa, y al venir yo y dar las nuevas a Acab, al no hallarte él, me matará; y tu siervo teme a Jehová desde su juventud. 13 ¿No ha sido dicho a mi señor lo que hice cuando Jezabel mataba a los profetas de Jehová; que escondí a cien varones de los profetas de Jehová de cincuenta en cincuenta en cuevas, y los mantuve con pan y agua? 14 ¿Y ahora dices tú: Ve, di a tu amo: Aquí está Elías; para que él me mate? 15 Y le dijo Elías: Vive Jehová de los ejércitos, en cuya presencia estoy, que hoy me mostraré a él. 16 Entonces Abdías fue a encontrarse con Acab, y le dio el aviso; y Acab vino a encontrarse con Elías. 17 Cuando Acab vio a Elías, le dijo: ¿Eres tú el que turbas a Israel? 18 Y él respondió: Yo no he turbado a Israel, sino tú y la casa de tu padre, dejando los mandamientos de Jehová, y siguiendo a los baales. 19 Ahora, pues, envía y reúneme a todo Israel en el monte Carmelo, y los cuatrocientos cincuenta profetas de Baal, y los cuatrocientos profetas de la Asera, que comen de la mesa de Jezabel.`
  },
  {
    ref: "1 Reyes 18:38, 39",
    text: `38 Entonces cayó fuego de Jehová, y consumió el holocausto, la leña, las piedras y el polvo, y aun lamió el agua que estaba en la zanja. 39 Viéndolo todo el pueblo, se postraron y dijeron: ¡Jehová es el Dios, Jehová es el Dios!`
  },
  {
    ref: "Malaquías 4:5, 6",
    text: `5 He aquí, yo os envío el profeta Elías, antes que venga el día de Jehová, grande y terrible. 6 Él hará volver el corazón de los padres hacia los hijos, y el corazón de los hijos hacia los padres, no sea que yo venga y hiera la tierra con maldición.`
  },
  {
    ref: "Santiago 5:17",
    text: `Elías era hombre sujeto a pasiones semejantes a las nuestras, y oró fervientemente para que no lloviese, y no llovió sobre la tierra por tres años y seis meses.`
  },
  {
    ref: "Deuteronomio 18:20",
    text: `El profeta que tuviere la presunción de hablar palabra en mi nombre, a quien yo no le haya mandado hablar, o que hablare en nombre de dioses ajenos, el tal profeta morirá.`
  },
  {
    ref: "1 Reyes 22:1-14",
    text: `1 Tres años pasaron sin guerra entre los sirios e Israel. 2 Pero al tercer año, Josafat rey de Judá descendió para ver al rey de Israel. 3 Y el rey de Israel dijo a sus siervos: ¿No sabéis que Ramot de Galaad es nuestra, y nosotros callamos, y no la tomamos de mano del rey de Siria? 4 Y dijo a Josafat: ¿Quieres venir conmigo a la guerra a Ramot de Galaad? Y Josafat respondió al rey de Israel: Yo soy como tú; mi pueblo como tu pueblo, y mis caballos como tus caballos. 5 Dijo luego Josafat al rey de Israel: Te ruego que consultes hoy la palabra de Jehová. 6 Entonces el rey de Israel reunió a los profetas, como cuatrocientos hombres, y les preguntó: ¿Iré a la guerra contra Ramot de Galaad, o desistiré? Y ellos dijeron: Sube, porque Jehová la entregará en mano del rey. 7 Y dijo Josafat: ¿Hay aún aquí algún profeta de Jehová, por el cual consultemos? 8 El rey de Israel respondió a Josafat: Aún hay un varón por el cual podemos consultar a Jehová, Micaías hijo de Imla; mas yo le aborrezco, porque nunca me profetiza cosa buena, sino solamente mal. Y respondió Josafat: No hable el rey así. 9 Entonces el rey de Israel llamó a un oficial, y le dijo: Haz venir pronto a Micaías hijo de Imla. 10 Y el rey de Israel y Josafat rey de Judá estaban sentados cada uno en su trono, vestidos con sus ropas reales, en la plaza junto a la entrada de la puerta de Samaria, y todos los profetas profetizaban delante de ellos. 11 Y Sedequías hijo de Quenaana se había hecho cuernos de hierro, y decía: Jehová dice así: Con estos cornearás a los sirios hasta acabarlos. 12 De este modo profetizaban también todos los profetas, diciendo: Sube a Ramot de Galaad, y serás prosperado, pues Jehová la entregará en mano del rey. 13 Y el mensajero que había ido a llamar a Micaías le habló diciendo: He aquí que las palabras de los profetas a una voz anuncian al rey cosas buenas; yo, pues, te ruego que tu palabra sea como la de uno de ellos, y anuncies buen éxito. 14 Y Micaías respondió: Vive Jehová, que lo que Jehová me hablare, eso diré.`
  },
  {
    ref: "Éxodo 15:20",
    text: `Y María la profetisa, hermana de Aarón, tomó un pandero en su mano, y todas las mujeres salieron en pos de ella con panderos y danzas.`
  },
  {
    ref: "Miqueas 6:4",
    text: `Porque yo te hice subir de la tierra de Egipto, y de la casa de servidumbre te redimí; y envié delante de ti a Moisés, a Aarón y a María.`
  },
  {
    ref: "Jueces 4:4, 5",
    text: `4 En aquel tiempo juzgaba a Israel una mujer, Débora, profetisa, mujer de Lapidot; 5 la cual acostumbraba sentarse debajo de la palmera de Débora, entre Ramá y Bet-el, en el monte de Efraín; y los hijos de Israel subían a ella a juicio.`
  },
  {
    ref: "Jueces 5:7",
    text: `Las aldeas quedaron abandonadas en Israel, habían decaído, hasta que yo Débora me levanté, me levanté madre en Israel.`
  },
  {
    ref: "2 Reyes 22:11-14",
    text: `11 Cuando el rey hubo oído las palabras del libro de la ley, rasgó sus vestidos. 12 Y mandó el rey a Hilcías sacerdote, y a Ahicam hijo de Safán, a Acbor hijo de Micaías, a Safán escriba y a Asaías siervo del rey, diciendo: 13 Id y preguntad a Jehová por mí, por el pueblo y por todo Judá, acerca de las palabras de este libro que se ha hallado; porque grande es la ira de Jehová que se ha encendido contra nosotros, por cuanto nuestros padres no obedecieron a las palabras de este libro, para hacer conforme a todo lo que nos fue escrito. 14 Entonces fueron el sacerdote Hilcías, Ahicam, Acbor, Safán y Asaías, a la profetisa Hulda, mujer de Salum hijo de Ticva, hijo de Harhas, guarda de las vestiduras, la cual moraba en Jerusalén en la segunda parte de la ciudad, y hablaron con ella.`
  },
  {
    ref: "2 Reyes 22:15-17",
    text: `15 Ella les dijo: Jehová Dios de Israel ha dicho así: Decid al varón que os envió a mí: 16 Así ha dicho Jehová: He aquí yo traigo mal sobre este lugar, y sobre los que moran en él, conforme a todas las palabras del libro que ha leído el rey de Judá; 17 por cuanto me dejaron a mí y quemaron incienso a dioses ajenos, provocándome a ira con toda la obra de sus manos; mi ira se encenderá contra este lugar, y no se apagará.`
  },
  {
    ref: "2 Crónicas 34:14-28",
    text: `14 Al sacar ellos el dinero que había sido traído a la casa de Jehová, el sacerdote Hilcías halló el libro de la ley de Jehová dada por medio de Moisés. 15 Y dando cuenta Hilcías, dijo al escriba Safán: He hallado el libro de la ley en la casa de Jehová. Y Hilcías dio el libro a Safán. 16 Safán lo llevó al rey, y le contó el asunto, diciendo: Tus siervos han hecho todo lo que se les encomendó. 17 Han fundido el dinero que se halló en la casa de Jehová, y lo han entregado en poder de los encargados y de los que hacen la obra. 18 Asimismo declaró el escriba Safán al rey, diciendo: El sacerdote Hilcías me dio un libro. Y lo leyó Safán delante del rey. 19 Luego que el rey hubo oído las palabras de la ley, rasgó sus vestidos. 20 Y mandó el rey a Hilcías, a Ahicam hijo de Safán, a Abdón hijo de Micaías, al escriba Safán y a Asaías siervo del rey, diciendo: 21 Id y consultad a Jehová por mí y por los que han quedado en Israel y en Judá, acerca de las palabras del libro que ha sido hallado; porque grande es la ira de Jehová que ha caído sobre nosotros, por cuanto nuestros padres no guardaron la palabra de Jehová, para hacer conforme a todo lo que está escrito en este libro. 22 Entonces Hilcías y los del rey fueron a Hulda profetisa, mujer de Salum hijo de Ticva, hijo de Hasra, guarda de las vestiduras, la cual moraba en Jerusalén en el Colegio, y hablaron con ella las palabras referidas. 23 Y ella respondió: Jehová Dios de Israel ha dicho así: Decid al varón que os envió a mí: 24 Así ha dicho Jehová: He aquí yo traigo mal sobre este lugar, y sobre sus moradores, todas las maldiciones que están escritas en el libro que leyeron delante del rey de Judá; 25 por cuanto me han dejado, y han quemado incienso a dioses ajenos, provocándome a ira con todas las obras de sus manos; por tanto, se derramará mi ira sobre este lugar, y no se apagará. 26 Pero al rey de Judá, que os ha enviado a consultar a Jehová, le diréis así: Jehová Dios de Israel ha dicho así: Por cuanto oíste las palabras del libro, 27 y tu corazón se ablandó, y te humillaste delante de Dios al oír sus palabras sobre este lugar y sobre sus moradores, y te humillaste delante de mí, y rasgaste tus vestidos y lloraste en mi presencia, yo también te he oído, dice Jehová. 28 He aquí que yo te recogeré con tus padres, y serás recogido en tu sepulcro en paz, y tus ojos no verán todo el mal que yo traigo sobre este lugar y sobre los moradores de él. Y ellos refirieron al rey la respuesta.`
  },
  {
    ref: "Nehemías 6:14",
    text: `Acuérdate, Dios mío, de Tobías y de Sanbalat, conforme a estas cosas que hicieron, y también de Noadías profetisa y de los otros profetas que procuraban infundirme miedo.`
  },
  {
    ref: "Ezequiel 13:17, 18",
    text: `17 Y tú, hijo de hombre, pon tu rostro contra las hijas de tu pueblo que profetizan de su propio corazón, y profetiza contra ellas, 18 y di: Así ha dicho Jehová el Señor: ¡Ay de aquellas que cosen vendas mágicas para todas las manos, y hacen velos mágicos para cubrir la cabeza de toda edad, para cazar las almas! ¿Habéis de cazar las almas de mi pueblo, para mantener vuestra propia vida?`
  },
  {
    ref: "1 Samuel 8:5",
    text: `y le dijeron: He aquí tú has envejecido, y tus hijos no andan en tus caminos; por tanto, constitúyenos ahora un rey que nos juzgue, como tienen todas las naciones.`
  },
  {
    ref: "1 Samuel 8:11-18",
    text: `11 Dijo: Así hará el rey que reinará sobre vosotros: tomará vuestros hijos, y los pondrá en sus carros y en su gente de a caballo, para que corran delante de su carro; 12 y nombrará para sí jefes de millares y jefes de cincuenta; los pondrá asimismo a que aren sus campos y sieguen sus mieses, y a que fabriquen sus armas de guerra y los pertrechos de sus carros. 13 Tomará también a vuestras hijas para que sean perfumadoras, cocineras y amasadoras. 14 Asimismo tomará lo mejor de vuestras tierras, de vuestras viñas y de vuestros olivares, y los dará a sus siervos. 15 Diezmará vuestro grano y vuestras viñas, para dar a sus oficiales y a sus siervos. 16 Tomará vuestros siervos y vuestras criadas, vuestros mejores jóvenes, y vuestros asnos, y con ello hará sus obras. 17 Diezmará también vuestros rebaños, y seréis sus siervos. 18 Y clamaréis aquel día a causa de vuestro rey que os habréis elegido, mas Jehová no os responderá en aquel día.`
  },
  {
    ref: "1 Samuel 2:27-36",
    text: `27 Y vino un varón de Dios a Elí, y le dijo: Así ha dicho Jehová: ¿No me manifesté yo claramente a la casa de tu padre, cuando estaban en Egipto en casa de Faraón? 28 Y yo le escogí por mi sacerdote entre todas las tribus de Israel, para que ofreciese sobre mi altar, y quemase incienso, y llevase efod delante de mí; y di a la casa de tu padre todas las ofrendas de los hijos de Israel. 29 ¿Por qué habéis hollado mis sacrificios y mis ofrendas, que yo mandé ofrecer en el tabernáculo; y has honrado a tus hijos más que a mí, engordándoos de lo principal de todas las ofrendas de mi pueblo Israel? 30 Por tanto, Jehová el Dios de Israel dice: Yo había dicho que tu casa y la casa de tu padre andarían delante de mí perpetuamente; mas ahora ha dicho Jehová: Nunca yo tal haga, porque yo honraré a los que me honran, y los que me desprecian serán tenidos en poco. 31 He aquí vienen días en que cortaré tu brazo, y el brazo de la casa de tu padre, de modo que no haya anciano en tu casa. 32 Verás el afán del Tabernáculo, mientras Dios hace bien a Israel; y en ningún tiempo habrá anciano en tu casa. 33 El varón de los tuyos a quien yo no corte de mi altar, será para consumir tus ojos y llenar tu alma de dolor; y toda la cría de tu casa morirá en la edad viril. 34 Y esto te será por señal: lo que acontecerá a tus dos hijos, Ofni y Finees: ambos morirán en un día. 35 Y yo me suscitaré un sacerdote fiel, que haga conforme a mi corazón y a mi alma; y yo le edificaré casa firme, y andará delante de mi ungido todos los días. 36 Y cualquiera que haya quedado en tu casa vendrá a postrarse delante de él por una moneda de plata y un bocado de pan, diciéndole: Te ruego que me agregues a alguno de los ministerios, para que pueda comer un bocado de pan.`
  },
  {
    ref: "Levítico 8:10-13",
    text: `10 Y Moisés tomó el aceite de la unción y ungió el tabernáculo y todas las cosas que había en él, y las santificó. 11 Y roció de él sobre el altar siete veces, y ungió el altar y todos sus utensilios, y la fuente y su base, para santificarlos. 12 Y derramó del aceite de la unción sobre la cabeza de Aarón, y le ungió para santificarlo. 13 Después Moisés hizo acercar los hijos de Aarón, y les vistió las túnicas, y los ciñó con cintos, y les ató las tiaras, como Jehová se lo había mandado a Moisés.`
  },
  {
    ref: "Oseas 6:9",
    text: `Y como ladrones que esperan a algún hombre, así una compañía de sacerdotes mata en el camino hacia Siquem; ciertamente hacen maldad.`
  },
  {
    ref: "Malaquías 2:1-3",
    text: `1 Ahora, oh sacerdotes, para vosotros es este mandamiento. 2 Si no oyereis, y si no decidieis de corazón dar gloria a mi nombre, ha dicho Jehová de los ejércitos, enviaré sobre vosotros maldición, y maldeciré vuestras bendiciones; y ya las he maldecido, porque no lo ponéis en el corazón. 3 He aquí, yo os dañaré la sementera, y os echaré al rostro el estiércol, el estiércol de vuestras fiestas solemnes, y seréis llevados con él.`
  },
  {
    ref: "Jeremías 5:31",
    text: `Los profetas profetizaron mentira, y los sacerdotes dirigían por manos de ellos; y mi pueblo así lo quiso. ¿Qué haréis cuando llegue el fin?`
  },
  {
    ref: "Ezequiel 22:26",
    text: `Sus sacerdotes violaron mi ley, y contaminaron mis santuarios; entre lo santo y lo profano no hicieron diferencia, ni distinguieron entre inmundo y limpio; y de mis días de reposo apartaron sus ojos, y yo he sido profanado en medio de ellos.`
  },
  {
    ref: "Isaías 60:1-3",
    text: `1 Levántate, resplandece; porque ha venido tu luz, y la gloria de Jehová ha nacido sobre ti. 2 Porque he aquí que tinieblas cubrirán la tierra, y oscuridad las naciones; mas sobre ti amanecerá Jehová, y sobre ti será vista su gloria. 3 Y andarán las naciones a tu luz, y los reyes al resplandor de tu nacimiento.`
  },
  {
    ref: "Isaías 62:1, 2",
    text: `1 Por amor de Sion no callaré, y por amor de Jerusalén no me estaré quieto, hasta que salga como resplandor su justicia, y su salvación se encienda como antorcha. 2 Entonces verán las naciones tu justicia, y todos los reyes tu gloria; y te será puesto un nombre nuevo, que la boca de Jehová nombrará.`
  },
  {
    ref: "2 Crónicas 13:22",
    text: `Los demás hechos de Abías, sus caminos y sus dichos, están escritos en la historia del profeta Iddo.`
  },
  {
    ref: "Jeremías 42:4",
    text: `Y el profeta Jeremías les dijo: He oído; he aquí que voy a orar a Jehová vuestro Dios, como habéis dicho; y todo lo que Jehová os respondiere, os lo haré saber, no os reservaré palabra.`
  },
  {
    ref: "2 Crónicas 24:20-22",
    text: `20 Entonces el espíritu de Dios vino sobre Zacarías hijo del sacerdote Joiada; y puesto en pie, a más altura que el pueblo, les dijo: Así ha dicho Dios: ¿Por qué quebrantáis los mandamientos de Jehová? No os vendrá bien por ello; porque por haber dejado a Jehová, él también os abandonará. 21 Pero ellos conspiraron contra él, y por mandato del rey lo apedrearon en el patio de la casa de Jehová. 22 Así el rey Joás no se acordó de la misericordia que Joiada padre de Zacarías había hecho con él, antes mató a su hijo, quien dijo al morir: Jehová lo vea, y lo demande.`
  },
  {
    ref: "Mateo 21:11, 46",
    text: `11 Y la gente decía: Este es Jesús, el profeta, de Nazaret de Galilea. 46 Pero al buscar cómo echarle mano, temían al pueblo, porque éste le tenía por profeta.`
  },
  {
    ref: "Lucas 7:16",
    text: `Y todos tuvieron miedo, y glorificaban a Dios, diciendo: Un gran profeta se ha levantado entre nosotros; y: Dios ha visitado a su pueblo.`
  },
  {
    ref: "Lucas 24:19",
    text: `Entonces él les dijo: ¿Qué cosas? Y ellos dijeron: De Jesús nazareno, que fue varón profeta, poderoso en obra y en palabra delante de Dios y de todo el pueblo.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Qué ocurrió inmediatamente después de la gran victoria de Elías en el monte Carmelo?",
    opts: ["El pueblo lo coronó como rey", "Una reina lo amenazó y Elías entró en pánico y huyó", "Dios lo trasladó al cielo", "Los falsos profetas se arrepintieron"],
    ans: 1,
    feedback: "El punto álgido del ministerio público de Elías fue seguido de un tiempo oscuro de profunda desesperación. Amenazado por Jezabel, «viendo, pues, el peligro, se levantó y se fue para salvar su vida» (1 Rey. 19:3)."
  },
  {
    q: "Cuando Elías pidió morir debajo del enebro, ¿cuál fue la primera respuesta de Dios?",
    opts: ["Lo reprendió por su falta de fe", "Lo dejó solo hasta que se calmara", "Envió un ángel con comida, agua y descanso", "Le mostró fuego del cielo otra vez"],
    ans: 2,
    feedback: "El ángel lo tocó dos veces: «Levántate, come». Había una torta cocida y una vasija de agua (1 Rey. 19:5-7). Dios buscó, sanó y restauró a Elías con cuidado y misericordia."
  },
  {
    q: "¿Qué frase repitió Elías, casi igual, en los versículos 10 y 14?",
    opts: ["«Sólo yo he quedado, y me buscan para quitarme la vida»", "«Jehová es el Dios»", "«Heme aquí, envíame a mí»", "«Hablad, que tu siervo oye»"],
    ans: 0,
    feedback: "En ambas respuestas Elías expresa su celo, su sensación de fracaso y su soledad (1 Rey. 19:10, 14). Dios lo escuchó con paciencia y lo envió a una nueva misión."
  },
  {
    q: "Según Santiago 5:17, ¿qué clase de hombre era Elías?",
    opts: ["Un hombre sin debilidades", "Un ángel enviado en forma humana", "Un hombre de otra época que no se puede comparar con nosotros", "Un hombre sujeto a pasiones semejantes a las nuestras"],
    ans: 3,
    feedback: "Elías era «hombre sujeto a pasiones semejantes a las nuestras» (Sant. 5:17). Dios obró a través de él a pesar de sus debilidades: los profetas eran seres humanos frágiles, sujetos al miedo, la ira y el desánimo."
  },
  {
    q: "Cuando el mensajero le pidió que anunciara buen éxito como los demás, ¿qué respondió Micaías?",
    opts: ["«Haré lo que el rey me pida»", "«Lo que Jehová me hablare, eso diré»", "«No diré nada»", "«Los profetas de Asera tienen razón»"],
    ans: 1,
    feedback: "Micaías esperó a que Dios le dijera qué decir (1 Rey. 22:14), aunque se enfrentaba él solo a cuatrocientos falsos profetas y el rey lo odiaba por no profetizarle nunca nada bueno."
  },
  {
    q: "¿A qué profetisa acudieron el sacerdote Hilcías y los oficiales del rey Josías en busca de orientación espiritual?",
    opts: ["Miriam", "Débora", "Hulda", "Noadías"],
    ans: 2,
    feedback: "Hulda fue profetisa y consejera real (2 Rey. 22:11-14; 2 Crón. 34:19-22). Dios ha llamado tanto a hombres como a mujeres a ser profetas; Noadías, en cambio, fue una falsa profetisa (Neh. 6:14)."
  },
  {
    q: "¿A qué familia sacerdotal confrontó un profeta por sus prácticas corruptas?",
    opts: ["La casa de Elí", "La casa de Aarón", "La casa de Josías", "La casa de Saúl"],
    ans: 0,
    feedback: "Toda la casa de Elí fue confrontada (1 Sam. 2:27-36). Reprensiones tan severas se daban en respuesta a la corrupción desenfrenada de personas a las que se habían concedido privilegios especiales."
  },
  {
    q: "¿Cuál es la gran lección de la experiencia de Elena G. de White ante su llamado?",
    opts: ["Dios solo llama a personas sin debilidades", "Dios elige a personas imperfectas que están dispuestas a servirlo", "Los profetas nunca sienten miedo", "Un llamado profético no se puede rechazar con oración"],
    ans: 1,
    feedback: "Elena era joven, tímida y de salud delicada; llegó a mirar con deseo hacia la tumba. Tras mucha oración y el aliento de otros creyentes, accedió y dedicó su vida a seguir los mandatos de Dios. Era humana, pero Dios la usó."
  },
];

const DISCUSS_HUMANIDAD = [
  { n: 1, text: "¿Qué tipo de revés sufrió el profeta Elías inmediatamente después de su victoria en el monte Carmelo?", ref: "1 Reyes 19:1-10" },
  { n: 2, text: "¿Con qué tipo de debilidades humanas luchó el profeta Elías?", ref: "Santiago 5:17" },
];

const DISCUSS_FALSOS = [
  { n: 1, text: "¿Cuántos falsos profetas se opusieron a Elías y a su mensaje?", ref: "1 Reyes 18:19" },
  { n: 2, text: "¿Por qué el rey Acab prefirió el mensaje de los falsos profetas al del verdadero profeta? ¿Cómo deben responder los verdaderos profetas cuando se los presiona para que cambien su mensaje?", ref: "1 Reyes 22:1-14" },
];

const DISCUSS_PAPEL = [
  { n: 1, text: "¿Hubo casos en los que Dios haya utilizado a profetisas para guiar a su pueblo?", ref: "Éxodo 15:20; Jueces 4:4" },
  { n: 2, text: "¿A quién acudieron el rey Josías y el sacerdote Hilcías en busca de orientación espiritual? ¿Qué nos dice esto sobre la relación entre profetas, sacerdotes y reyes?", ref: "2 Reyes 22:11-14" },
  { n: 3, text: "¿Se les exigió alguna vez a los profetas del Antiguo Testamento que desafiaran la corrupción en el sacerdocio?", ref: "1 Samuel 2:27-36; Malaquías 2:1-3" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "Haz un esquema o un mapa conceptual de 1 Reyes 19:1-16, con atención especial a los versículos 4-10. ¿Qué observas sobre el estado emocional de Elías?", ref: "1 Reyes 19:4-10" },
  { key: "rfl2", q: "¿Cómo buscó, sanó y restauró Dios a Elías cuando se encontraba en un momento muy bajo? ¿Qué te dice esto sobre el cuidado y la misericordia de Dios?", ref: "1 Reyes 19:5-8" },
  { key: "rfl3", q: "¿En qué ocasión has luchado más intensamente contra la sensación de fracaso en tu vida o en tus proyectos? ¿Qué promesas bíblicas puedes reclamar para ayudarte a superar el desánimo?", ref: "" },
  { key: "rfl4", q: "¿Qué nos enseña la historia de Micaías sobre cómo actúan los verdaderos profetas?", ref: "1 Reyes 22:1-14" },
  { key: "rfl5", q: "Siempre es fácil seguir lo que está de moda. Teniendo en cuenta lo corrupta que puede ser la cultura, ¿por qué esto nunca es una buena idea?", ref: "" },
  { key: "rfl6", q: "¿Qué otros versículos te vienen a la mente que te ayuden a comprender mejor la naturaleza y la función de los profetas del Antiguo Testamento?", ref: "" },
  { key: "rfl7", q: "¿Cómo nos ayudan las funciones de los profetas del Antiguo Testamento a comprender mejor el papel de Jesús, quien también fue profeta?", ref: "Mateo 21:11, 46; Lucas 7:16; 24:19" },
  { key: "rfl8", q: "Memoriza tu pasaje favorito de 1 Reyes 19:1-16. Escríbelo varias veces para que te sea más fácil recordarlo.", ref: "1 Reyes 19:1-16" },
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

function Dinamica({ items, doneLabel }) {
  const [sel, setSel] = useState({});
  const [checked, setChecked] = useState(false);
  const answered = Object.keys(sel).length;
  const correct = items.filter(s => sel[s.key] === s.ans).length;
  return (
    <>
      {items.map(s => (
        <div key={s.key} className="sym-card">
          <div className="sym-head">
            <span className="sym-name">{s.name}</span>
            <span className="sym-ref">{s.ref}</span>
          </div>
          <div className="sym-fact">{s.fact}</div>
          {s.opts.map((o, i) => {
            let cls = "sym-opt";
            if (checked) {
              if (i === s.ans) cls += " ok";
              else if (sel[s.key] === i) cls += " bad";
            } else if (sel[s.key] === i) cls += " sel";
            return (
              <button key={i} className={cls} disabled={checked} onClick={() => setSel(p => ({ ...p, [s.key]: i }))}>
                {o}
              </button>
            );
          })}
          {checked && <div className="sym-expl">{s.expl}</div>}
        </div>
      ))}

      {checked ? (
        <>
          <div className="check-result">{correct} de {items.length} {doneLabel}</div>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button className="quiz-retry" onClick={() => { setSel({}); setChecked(false); }}><RotateCcw size={15} /> Intentar de nuevo</button>
          </div>
        </>
      ) : (
        <button className="check-btn" disabled={answered < items.length} onClick={() => setChecked(true)}>
          {answered < items.length ? `Respondé los ${items.length} (${answered}/${items.length})` : "Verificar"}
        </button>
      )}
    </>
  );
}

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">La humanidad <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>de los profetas</em></div>
      <div className="sec-sub">Tercera Semana · 1 Reyes 19:1-16 · Profetas del Antiguo Testamento</div>

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
            <div className="card-label">Un GPS espiritual</div>
            <p>El GPS te dice dónde estás, hacia dónde vas y te advierte de los peligros del camino. Los viajeros espirituales que se dirigen al cielo también necesitan un «GPS» celestial. Una de las formas en que Dios orientó a su pueblo fue a través de los profetas del Antiguo Testamento: en sus relatos, consejos, profecías, poesía y cantos, transmitieron los mensajes de Dios. Pero eran personas como vos y como yo: seres humanos frágiles, sujetos al miedo, la ira y el desánimo.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · 1 Reyes 19:1-16
            </div>
            <div className="honey-text">
              «Levántate y come, porque largo camino te resta.»
            </div>
            <div className="honey-ref">1 Reyes 19:7 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Elías: un ícono entre los profetas</div>
            <p>Elías nunca murió: fue trasladado al cielo en un carro de fuego (2 Rey. 2:11). Siglos después, la gente se preguntaba si Juan el Bautista o Jesús eran Elías (Juan 1:21; Mar. 8:27, 28), y en la cruz la multitud se burló diciendo que Elías no venía a rescatarlo (Mat. 27:49). Dios lo envió a Acab para anunciar una sequía (1 Rey. 17:1) y lo usó en el monte Carmelo para llamar a toda la nación a volver al Señor.</p>
          </div>

          <div className="egw-wrap">
            <div className="egw-source"><Star size={11} /> Elena G. de White · Mensajes selectos, t. 1, p. 147</div>
            <div className="egw-text">«La mayor y más urgente de todas nuestras necesidades es la de un reavivamiento de la verdadera piedad en nuestro medio. Procurarlo debiera ser nuestra primera obra. Debe haber esfuerzos fervientes para obtener las bendiciones del Señor, <strong>no porque Dios no esté dispuesto a conferirnos sus bendiciones, sino porque no estamos preparados para recibirlas.</strong>»</div>
          </div>

          <div className="card">
            <div className="card-label">El mensaje de Elías hoy · Malaquías 4:5, 6</div>
            <p>Justo antes de la segunda venida de Cristo, Dios ordena a su iglesia proclamar de nuevo el mensaje de Elías: volver a Dios con todo el corazón, apartarse de los «ídolos» y estar preparados para permanecer de pie en el gran día del Señor. Según Malaquías 4:6, es un llamado que da lugar a la verdadera restauración de los corazones y los hogares. El reavivamiento en el hogar se extiende a la iglesia, la comunidad y la nación, y motiva al pueblo de Dios para la misión.</p>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text">Los profetas <strong>no eran personas perfectas</strong>: luchaban con las debilidades y los desafíos propios de los seres humanos.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Los mensajes de los falsos profetas <strong>suelen ser más populares</strong> que los de los verdaderos profetas.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Dios ha llamado <strong>tanto a hombres como a mujeres</strong> a ser profetas.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabElias({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Elías</div>
      <div className="sec-sub">Del fuego del Carmelo a la cueva de Horeb</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Un hombre «con debilidades como las nuestras»</div>
        <p>Elías tuvo un éxito impresionante en el Carmelo: el fuego descendió literalmente del cielo (1 Rey. 18:38). Cabría esperar euforia. En cambio, el punto álgido de su ministerio fue seguido por un tiempo oscuro de profunda desesperación. Tocá cada momento de 1 Reyes 19:1-16 para recorrer el camino.</p>
      </div>

      <ExpandList items={ELIAS_PASOS} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Detective de palabras · lo que se repite</div>
      <div className="card" style={{ marginBottom: "1rem" }}>
        <p>Al estudiar el pasaje conviene rodear las palabras que se repiten, subrayar lo importante y conectar ideas con flechas. Estas son las pistas que se repiten en los versículos 4-10 (y alrededor). ¿A qué apuntan juntas?</p>
      </div>
      <ExpandList items={REPETIDAS} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="cmp-block" style={{ marginTop: ".4rem" }}>
        <div className="cmp-title">La misma respuesta, dos veces</div>
        <div className="cmp-grid">
          <div className="cmp-cell a">
            <span className="cmp-lbl">1 Reyes 19:10</span>
            «He sentido un vivo celo por Jehová… sólo yo he quedado, y me buscan para quitarme la vida.»
          </div>
          <div className="cmp-cell b">
            <span className="cmp-lbl">1 Reyes 19:14</span>
            «He sentido un vivo celo por Jehová… sólo yo he quedado, y me buscan para quitarme la vida.»
          </div>
        </div>
        <div className="cmp-note">Entre una respuesta y otra pasaron el viento, el terremoto, el fuego y el silbo apacible, y Elías seguía diciendo exactamente lo mismo. Dios no lo corrigió a gritos: lo escuchó, lo volvió a preguntar y le dio una nueva tarea.</div>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)" }}>
        <div className="card-label">Lo que esto dice de Dios</div>
        <p>La historia de Elías nos recuerda que, incluso para los seguidores de Dios, no todos los días son maravillosos. Elías no era profeta porque fuera perfecto: Dios obró a través de él a pesar de sus debilidades. Todos tenemos momentos bajos; lo importante es recordar la fidelidad de Dios y no rendirse.</p>
      </div>
    </>
  );
}

function TabFalsos({ teacherMode, openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Falsos</div>
      <div className="sec-sub">{teacherMode ? "Micaías contra los falsos profetas · Vista maestro" : "¿A qué voz le creés?"}</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Cuando las voces se contradicen</div>
        <p>El mensaje de Elías se oponía a cientos de falsos profetas financiados por la familia real (1 Rey. 18:19). Era normal: hay falsos profetas ya en la historia temprana de Israel (Deut. 18:20). En 1 Reyes 22, Acab y Josafat quieren ir a la guerra contra Ramot de Galaad; cuatrocientos «profetas» dicen que sí, pero Josafat, desconfiado, pide «un profeta de Jehová». Aparece Micaías.</p>
      </div>

      {FALSOS_COMPARA.map(x => (
        <div key={x.key} className="cmp-block">
          <div className="cmp-title">{x.title}</div>
          <div className="cmp-grid">
            <div className="cmp-cell b">
              <span className="cmp-lbl">{x.a.lbl}</span>
              {x.a.text}
            </div>
            <div className="cmp-cell a">
              <span className="cmp-lbl">{x.b.lbl}</span>
              {x.b.text}
            </div>
          </div>
          <div className="cmp-note">{x.note}</div>
        </div>
      ))}

      {teacherMode ? (
        <>
          <div className="group-label">Cómo distinguirlos · explicación completa</div>
          <ExpandList
            items={FALSOS_DINAMICA.map(s => ({ key: `t-${s.key}`, badge: s.ref, name: s.name, body: `${s.fact} ${s.expl}` }))}
            openExpand={openExpand} toggleExpand={toggleExpand}
          />
        </>
      ) : (
        <>
          <div className="group-label">Dinámica · ¿verdadero o falso?</div>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p>Para cada rasgo, elegí si describe a un profeta verdadero o a uno falso. Cuando termines, tocá «Verificar».</p>
          </div>
          <Dinamica items={FALSOS_DINAMICA} doneLabel="rasgos identificados" />
        </>
      )}

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>Por cada obra de Dios, Satanás tiene sus falsificaciones. Siempre es fácil seguir lo que está de moda, pero la cultura puede estar corrupta: la clave estaba en saber distinguir las voces.</p>
      </div>
    </>
  );
}

function TabMujeres({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Mujeres</div>
      <div className="sec-sub">Profetisas del Antiguo Testamento</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">inVestiga · el llamado de Dios a las mujeres</div>
        <p>¿Qué revelan estos textos del Antiguo Testamento sobre el llamado de Dios a las mujeres al ministerio profético? También hubo falsas profetisas. Probá la dinámica y luego abrí el detalle de cada una.</p>
      </div>

      <div className="group-label">Dinámica · ¿quién soy?</div>
      <Dinamica items={MUJERES_DINAMICA} doneLabel="profetisas identificadas" />

      <div className="group-label">Detalle y pasajes</div>
      <ExpandList items={MUJERES_DETALLE} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Idea clave</div>
        <p>Dios ha llamado tanto a hombres como a mujeres a ser profetas. ¿Qué otros versículos te vienen a la mente que te ayuden a comprender mejor la naturaleza y la función de los profetas del Antiguo Testamento?</p>
      </div>
    </>
  );
}

function TabFunciones({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Funciones</div>
      <div className="sec-sub">Para qué usaba Dios a sus profetas</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Un rol difícil</div>
        <p>La función de los profetas incluía la responsabilidad, a menudo difícil, de transmitir mensajes a los reyes, a los sacerdotes y a toda la nación. Tocá cada tarjeta para ver lo que hacían.</p>
      </div>

      <div className="group-label"><Crown size={13} /> Con los reyes</div>
      <ExpandList items={FUNCIONES_REYES} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label"><ShieldAlert size={13} /> Con los sacerdotes</div>
      <ExpandList items={FUNCIONES_SACERDOTES} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label"><ScrollText size={13} /> Con el pueblo y las naciones</div>
      <ExpandList items={FUNCIONES_PUEBLO} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="honey-card" style={{ marginTop: ".4rem" }}>
        <div className="honey-label"><Star size={13} /> Jesús, también profeta</div>
        <div className="honey-text">«Un gran profeta se ha levantado entre nosotros; y: Dios ha visitado a su pueblo.»</div>
        <div className="honey-ref">Lucas 7:16 · ver también Mateo 21:11, 46; Lucas 24:19</div>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)" }}>
        <div className="card-label">Para reflexionar</div>
        <p>¿Cómo nos ayudan las funciones de los profetas del Antiguo Testamento (guiar a reyes, confrontar a sacerdotes, enseñar al pueblo, hablar a las naciones) a comprender mejor el papel de Jesús, quien también fue profeta?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien la humanidad de los profetas y cómo los cuida Dios." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre Elías, los falsos profetas y las funciones proféticas." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar 1 Reyes 19:1-16." :
                "Vale la pena releer el pasaje. Dios cuida a sus siervos incluso en sus momentos más bajos.";
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

function DiscussBlock({ title, items, personal }) {
  return (
    <div className="discuss-block">
      <div className="discuss-title">{title}</div>
      {items.map(d => (
        <div key={d.n} className="discuss-q">
          <span className="discuss-num">{d.n}.</span>
          <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
        </div>
      ))}
      <div className="discuss-personal"><strong>Reflexión personal:</strong> {personal}</div>
    </div>
  );
}

function TabCierre() {
  return (
    <>
      <div className="sec-title">Cierre</div>
      <div className="sec-sub">imPlícate · inQuiere</div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · Spiritual gifts, t. 2, pp. 35-36 (Primeros escritos, p. 50)</div>
        <div className="egw-text">«Más o menos una semana después de esto, el Señor me dio otra visión y me mostró las pruebas que yo debía pasar, y que debía ir y relatar a otros lo que él me había revelado, y que arrostraría una gran oposición y sufriría angustia de espíritu por hacerlo. [...] Mi salud era muy mala y solo tenía 17 años. [...] Oré fervientemente para que la carga recayera sobre otra persona. Pero toda la luz que pude obtener fue: "Da a conocer a los demás lo que te he revelado". No me sentía preparada para salir al mundo. Naturalmente, tenía poca confianza en mí misma. [...] <strong>Miraba con deseo hacia la tumba. La muerte me parecía preferible a las responsabilidades que tendría que asumir.</strong>»</div>
      </div>

      <div className="card">
        <div className="card-label">Imperfecta pero dispuesta</div>
        <p>Elena sentía que prefería morir antes que aceptar su llamado. Tras mucha oración y el aliento de otros creyentes, accedió y dedicó el resto de su vida a seguir los mandatos de Dios. Era humana, con defectos, pruebas físicas, desafíos familiares y dificultades interpersonales. Pero vemos una gran lección: <strong style={{ color: "var(--tx)" }}>Dios elige a personas imperfectas que están dispuestas a servirlo.</strong> Su ministerio animó a los creyentes, ayudó a organizar oficialmente la Iglesia Adventista del Séptimo Día en 1863, influyó en los sistemas adventistas de salud y educación, y dejó aproximadamente cien mil páginas de escritos inspirados.</p>
      </div>

      <DiscussBlock
        title="La humanidad de los profetas"
        items={DISCUSS_HUMANIDAD}
        personal="¿Por qué se sentía Elías tan solo? ¿De qué maneras podemos afrontar la soledad cuando nos sentimos abandonados?"
      />
      <DiscussBlock
        title="La lucha contra los falsos profetas"
        items={DISCUSS_FALSOS}
        personal="¿Cómo podemos resistir la tentación de escuchar solo las voces que nos agradan?"
      />
      <DiscussBlock
        title="El papel y la naturaleza de los profetas"
        items={DISCUSS_PAPEL}
        personal="Imagina que eres un profeta del Antiguo Testamento. ¿Qué te gustaría de ese llamado y qué parte de tu responsabilidad te daría miedo?"
      />

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
            <span className="key-text">Los profetas <strong>no eran personas perfectas</strong>. Luchaban con las debilidades y los desafíos propios de los seres humanos.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Los mensajes de los falsos profetas <strong>suelen ser más populares</strong> que los de los verdaderos profetas.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Dios ha llamado <strong>tanto a hombres como a mujeres</strong> a ser profetas.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Hay un tipo de bajón que casi nadie cuenta: el que llega <strong>justo después de una buena racha</strong>. Terminás un campamento espectacular, aprobás ese final que te tenía mal, tu proyecto sale bien... y a los dos días estás tirado, sin ganas de nada, pensando que todo lo que hacés da lo mismo. A Elías le pasó con fuego del cielo incluido.</p>
          <br />
          <p>Fijate qué hizo Dios. No le tiró un versículo ni le preguntó dónde había quedado su fe. Primero lo dejó dormir, le mandó comida y agua, y recién después empezó a hablar. A veces lo más espiritual que podés hacer es <strong>dormir, comer, salir a caminar y decírselo a alguien</strong>. Y cuando Dios le preguntó «¿qué haces aquí?», Elías fue sincero (dos veces, igualito): lo dijo todo, sin maquillarlo. Podés hacer lo mismo.</p>
          <br />
          <p>La otra cara de la semana: Micaías estaba solo contra cuatrocientos, y tenía razón. En el grupo de chat, en la facultad o en el trabajo, la voz más popular no siempre es la verdadera. Antes de seguir lo que está de moda, preguntate: ¿esto es lo que Dios dijo, o lo que me conviene escuchar?</p>
          <br />
          <p>Esta semana, <strong>una sola cosa concreta</strong>: elegí un versículo de 1 Reyes 19:1-16 y escribilo a mano varias veces hasta saberlo. Y si estás en tu propio enebro, contáselo hoy a una persona de confianza. No esperes a sentirte mejor para hacerlo.</p>
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
    { id: "elias",     label: "Elías",    Icon: Mountain },
    { id: "falsos",    label: "Falsos",   Icon: ShieldAlert },
    { id: "mujeres",   label: "Mujeres",  Icon: Users },
    { id: "funciones", label: "Funciones", Icon: Crown },
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
              InVerso · Semana 3
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              La humanidad <em>de los profetas</em>
            </h1>
            <div className="hero-ref">1 Reyes 19:1-16 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"    && <TabInicio teacherMode={teacherMode} />}
            {tab === "elias"     && <TabElias openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "falsos"    && <TabFalsos teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "mujeres"   && <TabMujeres openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "funciones" && <TabFunciones openExpand={openExpand} toggleExpand={toggleExpand} />}
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
