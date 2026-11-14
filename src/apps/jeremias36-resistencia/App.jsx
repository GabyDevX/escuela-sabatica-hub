import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  ScrollText, ShieldAlert, Droplets, AlertTriangle, Circle
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0e0705;--bg2:#160b07;--bg3:#20110b;--surf:#2b1710;--surf2:#38201a;--brd:#4a2a1e;--brd2:#6b3d2b;--tx:#f7ebe4;--tx2:#c09a87;--tx3:#8a6554;--acc:#c4572d;--acc2:#e58a5e;--acc3:#f6cdb4;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#d4a94a;--warn-d:rgba(212,169,74,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1a0d08 0%,#160b07 55%,#0e0705 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(196,87,45,.30) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(196,87,45,.40);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(196,87,45,.10)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(196,87,45,.48) 30%,rgba(196,87,45,.48) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(196,87,45,.18);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(196,87,45,.25);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(212,169,74,.18);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(196,87,45,.09)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(196,87,45,.25);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(196,87,45,.16),rgba(196,87,45,.02));border:1px solid rgba(196,87,45,.30);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(196,87,45,.12);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(196,87,45,.20),rgba(196,87,45,.03));border:1px solid rgba(196,87,45,.36);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(196,87,45,.20),rgba(196,87,45,.03));border:1.5px solid rgba(196,87,45,.38);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(196,87,45,.10);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
.cmp-block{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1rem .9rem;margin-bottom:.85rem}
.cmp-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--tx);margin-bottom:.7rem;line-height:1.3}
.cmp-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.cmp-cell{border-radius:10px;padding:.7rem .7rem;font-size:.93rem;line-height:1.5;color:var(--tx2)}
.cmp-cell.a{background:rgba(196,87,45,.12);border:1px solid rgba(196,87,45,.28)}
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
.sym-opt.sel{border-color:var(--acc2);color:var(--tx);background:rgba(196,87,45,.14)}
.sym-opt.ok{border-color:var(--ok);background:var(--ok-d);color:var(--ok)}
.sym-opt.bad{border-color:var(--err);background:var(--err-d);color:var(--err)}
.sym-opt:disabled{cursor:default}
.sym-expl{font-size:.95rem;line-height:1.55;color:var(--tx2);background:var(--surf2);border-radius:10px;padding:.75rem .85rem;margin-top:.35rem}
.check-btn{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#fff;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;margin-top:.2rem;transition:background .2s}
.check-btn:disabled{background:var(--brd2);color:var(--tx3);cursor:default}
.check-result{text-align:center;font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:600;color:var(--acc3);margin:.9rem 0 .4rem}
.faith-item{display:flex;gap:.75rem;align-items:flex-start;background:var(--surf);border:1px solid var(--brd);border-radius:12px;padding:.8rem .95rem;margin-bottom:.5rem;cursor:pointer;transition:all .2s}
.faith-item.on{border-color:var(--acc);background:rgba(196,87,45,.10)}
.faith-item svg{flex-shrink:0;margin-top:.15rem}
.faith-text{font-size:.97rem;line-height:1.5;color:var(--tx2)}
.faith-item.on .faith-text{color:var(--tx)}
.faith-count{font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--tx3);text-align:right;margin:.2rem 0 1rem;letter-spacing:.06em}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: «decir mi verdad»", desc: "Preguntar: hoy se anima a todos a «decir su verdad»; ¿qué pasa cuando mi verdad choca con la Verdad, que es Jesucristo y su Palabra? Presentar la idea de la semana: ante el mensaje de Dios algunos cambian y otros se rebelan. Hoy vemos la reacción de un rey que quemó el mensaje." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos del grupo. Orar pidiendo corazones dispuestos a escuchar a Dios, incluso cuando el mensaje incomoda." },
  { time: "05–11 min", title: "Tab Rollo — Jeremías 36:20-32", desc: "Leer el pasaje con el grupo y recorrer las ocho escenas tocando cada tarjeta. Hacer el «detective de palabras» (rollo, fuego, palabras, escribir). Modo maestro: la dinámica «¿Quién lo hizo?» muestra todas las respuestas. Idea clave: quemar el rollo no borró el mensaje; Dios mandó escribirlo de nuevo, con más palabras." },
  { time: "11–16 min", title: "Tab Rechazo — Una historia de resistencia", desc: "Recorrer la línea del rechazo: Israel en el desierto (Núm. 14), Joaquim, Sedequías (2 Crón. 36:11-12), Judá (36:15-16), Jesús (Mat. 23:37) y Esteban (Hech. 7:52-58). Modo maestro: se abre la explicación completa de cada caso. Contrastar con Josué y Caleb." },
  { time: "16–20 min", title: "Tab Jeremías — El costo de ser profeta", desc: "Mirar los tres grupos de pasajes de inVestiga: un profeta afligido, confrontación intensa y fidelidad a la Palabra. Preguntar: ¿cómo se sostuvo Jeremías? Leer Jeremías 1:17-18 y 20:7-9: el mensaje era «como un fuego ardiente» en sus huesos." },
  { time: "20–24 min", title: "Tab Aviso — Escrito para nuestra advertencia", desc: "Leer 1 Corintios 10:6-13. Conversar: ¿cómo se puede menospreciar a un profeta sin oponerse abiertamente? Usar la lista de autoexamen como guía, sin presionar a nadie a compartir. Cerrar con 2 Crónicas 20:20 y la prosperidad espiritual." },
  { time: "24–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Detenerse en la respuesta de Dios al rollo quemado y en el porqué de las historias del Antiguo Testamento según Pablo." },
  { time: "27–30 min", title: "Reflexión y cierre", desc: "Usar los dos bloques de inQuiere («Resistirse al mensaje» y «Una historia para nosotros») y las reflexiones personales. Leer la cita de Elena G. de White sobre su misión de reprender, advertir y alentar, y cómo trataba a los escépticos. Cerrar con «Para tu vida»." },
];

const ANTES_ROLLO = [
  {
    key: "a1", badge: "Jer. 6:8-19, 26",
    name: "Años de advertencias",
    body: "Durante muchos años Dios envió mensajes por medio de Jeremías para advertir a Judá, expresarles su descontento y decirles que Babilonia los conquistaría y los llevaría cautivos. El Señor buscaba salvarlos, pero primero tenían que obedecer."
  },
  {
    key: "a2", badge: "Jer. 32:15",
    name: "Un terreno como señal de esperanza",
    body: "A medida que el ministerio de Jeremías llegaba a su fin, las súplicas de Dios se hicieron más intensas, pero siempre fueron redentoras. Dios le dijo que comprara un terreno y conservara la escritura: «aún se comprarán casas, heredades y viñas en esta tierra». La compra demostraba la fe del profeta en que el pueblo volvería a su tierra tras el exilio babilónico."
  },
  {
    key: "a3", badge: "Jer. 36:19",
    name: "Una última exhortación",
    body: "Fue el amor lo que movió a Dios a hacer que Jeremías escribiera una última exhortación al arrepentimiento y la reforma. Baruc escribió el mensaje y lo leyó en voz alta en Jerusalén. Los príncipes de la corte lo llamaron para que les leyera el rollo, y se dieron cuenta de que Jeremías correría peligro si el rey lo oía: le advirtieron a Baruc que se escondieran él y Jeremías."
  },
];

const ESCENAS = [
  {
    key: "s1", badge: "36:20-21",
    name: "1. El rollo llega al rey",
    body: "Los príncipes dejan el rollo en la cámara de Elisama el escriba y entran al atrio a contar al rey todas esas palabras. El rey Joaquim manda a Jehudí a tomar el rollo y leérselo a él y a todos los príncipes que estaban a su lado."
  },
  {
    key: "s2", badge: "36:22-23",
    name: "2. Un rey, un brasero y un cortaplumas",
    body: "Era el mes noveno; el rey estaba en la casa de invierno, con un brasero encendido delante de él. Cuando Jehudí había leído tres o cuatro planas, el rey rasgó el rollo con un cortaplumas de escribano y lo echó al fuego, hasta que todo el rollo se consumió. Solo escuchó el comienzo del mensaje antes de enfurecerse."
  },
  {
    key: "s3", badge: "36:24",
    name: "3. Sin temor ni arrepentimiento",
    body: "«Ni el rey ni ninguno de sus siervos que oyeron todas estas palabras, temieron, ni rasgaron sus vestidos.» Ante la Palabra de Dios, la señal clásica de arrepentimiento era rasgar las vestiduras; ellos rasgaron el rollo."
  },
  {
    key: "s4", badge: "36:25",
    name: "4. Tres voces que rogaron",
    body: "Elnatán, Delaía y Gemarías rogaron al rey que no quemara el rollo, pero él no los quiso oír. La respuesta de Joaquim fue de desprecio hacia Dios, su mensaje y su mensajero."
  },
  {
    key: "s5", badge: "36:26",
    name: "5. Contra el mensajero",
    body: "Si no puede callar el mensaje, el rey va contra el mensajero: manda prender a Baruc el escriba y al profeta Jeremías. «Pero Jehová los escondió»."
  },
  {
    key: "s6", badge: "36:27-28",
    name: "6. «Vuelve a tomar otro rollo»",
    body: "Después de que el rey quemó el rollo, vino palabra de Jehová a Jeremías: que tomara otro rollo y escribiera en él todas las palabras primeras que estaban en el primer rollo que quemó Joaquim."
  },
  {
    key: "s7", badge: "36:29-31",
    name: "7. La sentencia sobre Joaquim",
    body: "Dios cita las palabras del rey («¿Por qué escribiste en él que vendrá el rey de Babilonia…?») y declara: no tendrá quien se siente sobre el trono de David, y su cadáver será echado al calor del día y al hielo de la noche. Castigará su maldad en él, en su descendencia y en sus siervos, y traerá sobre Jerusalén y Judá todo el mal anunciado, «y no escucharon»."
  },
  {
    key: "s8", badge: "36:32",
    name: "8. Otro rollo, más palabras",
    body: "Jeremías tomó otro rollo y se lo dio a Baruc hijo de Nerías, que escribió de boca de Jeremías todas las palabras del libro quemado; «y aun fueron añadidas sobre ellas muchas otras palabras semejantes». El mensaje no desapareció: creció."
  },
];

const REPETIDAS = [
  {
    key: "r1", badge: "rollo",
    name: "El rollo",
    body: "El rollo se menciona una y otra vez: se deja, se toma, se lee, se corta, se quema, se vuelve a tomar y se vuelve a escribir (vv. 20-32). Todo gira en torno a un mensaje escrito y a lo que se hace con él."
  },
  {
    key: "r2", badge: "fuego · brasero",
    name: "El fuego",
    body: "«Un brasero encendido» (v. 22), «lo echó en el fuego» (v. 23), «el fuego que había en el brasero» (v. 23) y «el libro que Joacim… había quemado en el fuego» (v. 32). El fuego del rey frente al mensaje que ya quemaba por dentro de los profetas."
  },
  {
    key: "r3", badge: "palabras",
    name: "Las palabras",
    body: "«Todas estas palabras» (vv. 20, 24), «las palabras primeras» (v. 28), «las palabras del libro» y «muchas otras palabras semejantes» (v. 32). Lo que se quiso destruir era, en realidad, la palabra de Dios."
  },
  {
    key: "r4", badge: "rey · siervos · príncipes",
    name: "Los que oyen",
    body: "Oyen el rey, sus siervos y los príncipes, y casi nadie reacciona como se esperaba. Quienes temen son los que advierten, ruegan y esconden; quien tiene el poder, no teme."
  },
];

const REACCIONES = [
  {
    key: "q1", name: "«Ve, y escóndete, tú y Jeremías»", ref: "Jeremías 36:19",
    fact: "Entendieron de inmediato que el mensaje era peligroso para el profeta si llegaba al rey, y cuidaron de la seguridad de Baruc y Jeremías.",
    opts: ["Los príncipes", "El rey Joaquim", "Jehová"],
    ans: 0,
    expl: "Los príncipes de la corte se preocuparon por la seguridad de Baruc y de Jeremías y les advirtieron que se escondieran."
  },
  {
    key: "q2", name: "Rogaron que no quemara el rollo", ref: "Jeremías 36:25",
    fact: "Elnatán, Delaía y Gemarías le pidieron algo al rey, pero no los quiso oír.",
    opts: ["Los príncipes", "El rey Joaquim", "Jehová"],
    ans: 0,
    expl: "Elnatán, Delaía y Gemarías rogaron al rey que no quemase el rollo. Incluso con intercesores a su lado, el rey no los quiso oír."
  },
  {
    key: "q3", name: "Cortó el rollo y lo echó al brasero", ref: "Jeremías 36:23",
    fact: "Cuando se habían leído tres o cuatro planas, usó un cortaplumas de escribano y lo echó al fuego hasta que todo se consumió.",
    opts: ["Los príncipes", "El rey Joaquim", "Jehová"],
    ans: 1,
    expl: "Joaquim solo escuchó el comienzo del mensaje antes de enfurecerse. Su respuesta fue de desprecio hacia Dios, su mensaje y su mensajero."
  },
  {
    key: "q4", name: "Mandó prender a Baruc y a Jeremías", ref: "Jeremías 36:26",
    fact: "Si el mensaje no se podía callar, había que deshacerse del mensajero.",
    opts: ["Los príncipes", "El rey Joaquim", "Jehová"],
    ans: 1,
    expl: "Joaquim mandó a Jerameel, a Seraías y a Selemías a prender a Baruc y a Jeremías. Es la tentación de siempre: deshacerse del mensajero."
  },
  {
    key: "q5", name: "Los escondió", ref: "Jeremías 36:26",
    fact: "Aunque el rey envió a prenderlos, no los encontraron.",
    opts: ["Los príncipes", "El rey Joaquim", "Jehová"],
    ans: 2,
    expl: "«Pero Jehová los escondió». Dios protege a sus mensajeros y su obra no depende del favor del rey."
  },
  {
    key: "q6", name: "«Vuelve a tomar otro rollo»", ref: "Jeremías 36:28, 32",
    fact: "Mandó escribir de nuevo todas las palabras primeras, y se añadieron muchas otras semejantes.",
    opts: ["Los príncipes", "El rey Joaquim", "Jehová"],
    ans: 2,
    expl: "Dios no se rinde: su mensaje no se borra destruyendo el rollo. Nuestra renuencia a escucharlo no borra el mensaje que tiene para nosotros."
  },
];

const CASOS = [
  {
    key: "c1", badge: "Núm. 13:31–14:4",
    name: "Israel en el desierto",
    body: "Cuando los espías trajeron informes de gigantes y ciudades amuralladas, el pueblo entró en pánico. Se volvieron contra Moisés y Aarón y exigieron un nuevo liderazgo que los llevara de vuelta a Egipto: «Designemos un jefe, y volvámonos a Egipto». Los representantes de Dios eran blancos fáciles para la ira de la nación: cuando nos sentimos amenazados, podemos enfurecernos o volvernos irracionales."
  },
  {
    key: "c2", badge: "Núm. 14:6-10",
    name: "Josué y Caleb: las voces fieles",
    body: "Rasgaron sus vestiduras y suplicaron al pueblo que confiara en Dios a pesar de sus temores: «Si Jehová se agradare de nosotros, él nos llevará a esta tierra… no seáis rebeldes contra Jehová, ni temáis al pueblo de esta tierra». Estas voces fieles enfurecieron al pueblo, que habló de apedrearlos, y habrían muerto de no ser por la intervención de Dios."
  },
  {
    key: "c3", badge: "Jer. 36:20-26",
    name: "El rey Joaquim",
    body: "Siguió el ejemplo de sus padres: quemó el mensaje de Dios con la esperanza de eludir la palabra profética. Corta, quema, y después va contra el mensajero."
  },
  {
    key: "c4", badge: "2 Crón. 36:11-12",
    name: "El rey Sedequías",
    body: "Subió al trono a los 21 años, cuando las profecías de Jeremías estaban a punto de cumplirse. «Hizo lo malo ante los ojos de Jehová su Dios, y no se humilló delante del profeta Jeremías, que hablaba de parte de Jehová». Se presenta a Jeremías como un portavoz de Dios mismo; sin embargo, Sedequías no se humilló ante él."
  },
  {
    key: "c5", badge: "2 Crón. 36:15-21",
    name: "La nación de Judá",
    body: "Dios envió constantemente aviso por medio de sus mensajeros, porque tenía misericordia de su pueblo. Pero hacían escarnio de los mensajeros de Dios, menospreciaban sus palabras y se burlaban de sus profetas, hasta que no hubo ya remedio. Esta larga historia de rechazo llevó a perseguir a Jeremías y finalmente al cautiverio de Judá en Babilonia."
  },
  {
    key: "c6", badge: "Mat. 23:37",
    name: "Jesús lamenta",
    body: "Esta triste historia entristeció a Jesús: «¡Jerusalén, Jerusalén, que matas a los profetas, y apedreas a los que te son enviados! ¡Cuántas veces quise juntar a tus hijos… y no quisiste!»."
  },
  {
    key: "c7", badge: "Hech. 7:52-58",
    name: "Esteban y el Sanedrín",
    body: "Esteban preguntó a los miembros del Sanedrín: «¿A cuál de los profetas no persiguieron vuestros padres?». Los líderes no soportaron que se mencionara esta historia: se taparon los oídos, interrumpieron su discurso y lo apedrearon hasta matarlo."
  },
];

const RESIST = [
  {
    key: "x1", name: "Pidió «designar un jefe» para volver a Egipto", ref: "Números 14:2-4",
    fact: "Presa del pánico por los gigantes y las ciudades amuralladas, se volvió contra Moisés y Aarón.",
    opts: ["Israel en el desierto", "El rey Joaquim", "El rey Sedequías", "El Sanedrín"],
    ans: 0,
    expl: "El temor del pueblo pronto se convirtió en ira contra Aarón y Moisés y en una rebelión abierta contra Dios."
  },
  {
    key: "x2", name: "Cortó el rollo y lo arrojó al fuego", ref: "Jeremías 36:23",
    fact: "Quiso hacer desaparecer el mensaje de Dios destruyéndolo.",
    opts: ["Israel en el desierto", "El rey Joaquim", "El rey Sedequías", "El Sanedrín"],
    ans: 1,
    expl: "Pensó que rechazar o destruir el mensaje era hacerlo desaparecer. Pero no se borra el mensaje que Dios tiene para nosotros."
  },
  {
    key: "x3", name: "No se humilló delante del profeta", ref: "2 Crónicas 36:12",
    fact: "Subió al trono a los 21 años; el profeta hablaba de parte de Jehová.",
    opts: ["Israel en el desierto", "El rey Joaquim", "El rey Sedequías", "El Sanedrín"],
    ans: 2,
    expl: "«Hizo lo malo ante los ojos de Jehová su Dios; y no se humilló delante del profeta Jeremías que le hablaba por boca del Señor»."
  },
  {
    key: "x4", name: "Se tapó los oídos y apedreó a Esteban", ref: "Hechos 7:57-58",
    fact: "No toleró que se recordara cómo los antepasados trataron a los profetas.",
    opts: ["Israel en el desierto", "El rey Joaquim", "El rey Sedequías", "El Sanedrín"],
    ans: 3,
    expl: "Los líderes nacionales interrumpieron el discurso de Esteban y lo apedrearon hasta matarlo: la historia de rechazo a los profetas se repetía."
  },
  {
    key: "x5", name: "Habló de apedrear a quienes pedían confiar en Dios", ref: "Números 14:8-10",
    fact: "Las voces fieles de Josué y Caleb la enfurecieron.",
    opts: ["Israel en el desierto", "El rey Joaquim", "El rey Sedequías", "El Sanedrín"],
    ans: 0,
    expl: "Josué y Caleb rasgaron sus vestiduras y suplicaron confianza en Dios. De no ser por la intervención de Dios, habrían muerto."
  },
];

const AFLIGIDO = [
  {
    key: "j1", badge: "Jer. 9:1",
    name: "Lágrimas día y noche",
    body: "«¡Quién diera a mi cabeza aguas, y a mis ojos fuente de lágrimas, para que llore día y noche los muertos de la hija de mi pueblo!». El profeta sufre por el destino de su pueblo."
  },
  {
    key: "j2", badge: "Jer. 13:17",
    name: "Llanto en secreto",
    body: "«En secreto llorará mi alma a causa de vuestra soberbia; y llorando amargamente se desharán mis ojos en lágrimas, porque el rebaño de Jehová fue hecho cautivo». Llora por el rebaño que será llevado cautivo."
  },
  {
    key: "j3", badge: "Jer. 14:17",
    name: "Un quebrantamiento muy doloroso",
    body: "«Derramen mis ojos lágrimas noche y día, y no cesen; porque de gran quebrantamiento es quebrantada la virgen hija de mi pueblo, de plaga muy dolorosa». El dolor de Dios y el de su profeta se unen."
  },
  {
    key: "j4", badge: "Jer. 20:14-18",
    name: "«Maldito el día en que nací»",
    body: "Jeremías llega a lamentar haber nacido: «¿Para qué salí de la matriz? ¿Para ver trabajo y dolor, y que mis días se gasten en afrenta?». Un profeta honesto, que también se desanima y lo dice con sinceridad."
  },
];

const CONFRONTACION = [
  {
    key: "k1", badge: "Jer. 15:10",
    name: "Hombre de contiendas",
    body: "«¡Ay de mí, madre mía, que me engendraste hombre de rencillas y hombre de contiendas para toda la tierra! … todos me maldicen.» Su mensaje lo dejó enfrentado con todos."
  },
  {
    key: "k2", badge: "Jer. 26:8-11",
    name: "«De cierto morirás»",
    body: "Cuando terminó de hablar todo lo que Jehová le había mandado, los sacerdotes, los profetas y todo el pueblo le prendieron diciendo: «De cierto morirás». Pidieron para él pena de muerte por profetizar contra la ciudad."
  },
  {
    key: "k3", badge: "Jer. 38:4",
    name: "«Rogamos que muera este hombre»",
    body: "Los príncipes dijeron al rey: «Rogamos que muera este hombre; porque de esta manera hace desfallecer las manos de los hombres de guerra… este hombre no busca la paz de este pueblo, sino el mal». Lo acusaron de debilitar a los soldados y al pueblo con sus palabras."
  },
];

const FIEL = [
  {
    key: "f1", badge: "Jer. 20:7-9",
    name: "Un fuego ardiente en los huesos",
    body: "La palabra de Jehová le fue de afrenta y escarnio cada día. Dijo: «No me acordaré más de él, ni hablaré más en su nombre»; pero «había en mi corazón como un fuego ardiente metido en mis huesos, y traté de sufrirlo, y no pude». Dios lo sostuvo y le dio fuerza para cumplir su llamado."
  },
  {
    key: "f2", badge: "Jer. 26:2",
    name: "«No retengas palabra»",
    body: "Dios le ordenó: «Ponte en el atrio de la casa de Jehová, y habla a todas las ciudades de Judá… todas las palabras que yo te mando que les hables; no retengas palabra». Los profetas debían transmitir el mensaje completo, sin importar el costo personal."
  },
  {
    key: "f3", badge: "Jer. 1:17-18",
    name: "Columna de hierro",
    body: "Al llamarlo, Dios le dijo: «Ciñe, pues, tus lomos, levántate, y háblales todo cuanto te mande; no temas delante de ellos». Para ser profeta debía ser como columna de hierro: fiable e inquebrantable. Fue exactamente lo que necesitó."
  },
];

const SUTILES = [
  "Leo solo los pasajes o consejos que confirman lo que ya pienso.",
  "Cuando un mensaje me incomoda, me quedo con la parte que me conviene y descarto el resto.",
  "Hago chistes o comentarios irónicos sobre quienes toman en serio los mensajes de Dios.",
  "Pienso «eso ya lo escuché mil veces» y paso de largo.",
  "Dejo la obediencia para después: «ya lo voy a ver».",
  "Me alejo del mensajero (la persona, el grupo, la iglesia) en vez de revisar el mensaje.",
];

const LECCIONES = [
  {
    key: "l1", badge: "1 Cor. 10:6",
    name: "Para que no codiciemos lo malo",
    body: "«Estas cosas sucedieron como ejemplos para nosotros, para que no codiciemos cosas malas, como ellos codiciaron.» Dios conservó estas historias para nuestra instrucción, para salvarnos de repetir los mismos errores."
  },
  {
    key: "l2", badge: "1 Cor. 10:11",
    name: "Escrito para amonestarnos",
    body: "«Y estas cosas les acontecieron como ejemplo, y están escritas para amonestarnos a nosotros, a quienes han alcanzado los fines de los siglos.» La experiencia de la humanidad con Dios, buena y mala, no debe pasarse por alto ni menospreciarse."
  },
  {
    key: "l3", badge: "Gál. 6:14-16",
    name: "Una línea del pasado al presente",
    body: "Dios traza una línea recta que conecta el pasado con el presente y une al antiguo Israel con la iglesia actual, de la que formamos parte quienes hemos aceptado a Jesús como Señor y Salvador."
  },
  {
    key: "l4", badge: "1 Cor. 10:12, 13",
    name: "No estamos condenados a repetirlo",
    body: "«El que piensa estar firme, mire que no caiga.» Pero también: Dios es fiel y nos da la salida para que podamos soportar. Si escuchamos las advertencias de las Escrituras y los mensajes que nos envía por medio de sus profetas, no estamos condenados a repetir los errores del pasado."
  },
  {
    key: "l5", badge: "2 Crón. 20:20 · 3 Juan 1:2",
    name: "Seguros y prosperados",
    body: "«Creed en Jehová vuestro Dios, y estaréis seguros; creed a sus profetas, y seréis prosperados.» La prosperidad espiritual que Dios quiere darnos no se define por casas, autos, ropa u otras posesiones: él desea que nuestra vida espiritual prospere, como prosperamos en otros aspectos. Y requiere obediencia a sus mensajes."
  },
];

const VERSES = [
  {
    ref: "Jeremías 36:20-32", isBase: true,
    text: `20 Y entraron al rey en el atrio, habiendo dejado el rollo en la cámara de Elisama escriba, y contaron a oídos del rey todas estas palabras. 21 Entonces envió el rey a Jehudí para que tomase el rollo; el cual, tomándolo de la cámara de Elisama escriba, leyó en ello a oídos del rey, y a oídos de todos los príncipes que junto al rey estaban. 22 Y el rey estaba en la casa de invierno en el mes noveno, y había un brasero encendido delante de él. 23 Y sucedió que cuando Jehudí había leído tres o cuatro planas, lo rasgó el rey con un cortaplumas de escribano, y lo echó en el fuego que había en el brasero, hasta que todo el rollo se consumió en el fuego que había en el brasero. 24 Y ni el rey ni ninguno de sus siervos que oyeron todas estas palabras, temieron, ni rasgaron sus vestidos. 25 Y aunque Elnatán, Delaía y Gemarías rogaron al rey que no quemase el rollo, no los quiso oír. 26 Y mandó el rey a Jerameel hijo de Hamelec, a Seraías hijo de Azriel y a Selemías hijo de Abdeel, que prendiesen a Baruc el escriba y al profeta Jeremías; pero Jehová los escondió. 27 Y después que el rey quemó el rollo, con las palabras que Baruc había escrito de boca de Jeremías, vino palabra de Jehová a Jeremías, diciendo: 28 Vuelve a tomar otro rollo, y escribe en él todas las palabras primeras que estaban en el primer rollo que quemó Joacim rey de Judá. 29 Y dirás a Joacim rey de Judá: Así ha dicho Jehová: Tú quemaste este rollo, diciendo: ¿Por qué escribiste en él, diciendo: De cierto vendrá el rey de Babilonia, y destruirá esta tierra, y hará que no queden en ella hombres ni animales? 30 Por tanto, así ha dicho Jehová contra Joacim rey de Judá: No tendrá quien se siente sobre el trono de David; y su cadáver será echado al calor del día y al hielo de la noche. 31 Y castigaré su maldad en él, y en su descendencia y en sus siervos; y traeré sobre ellos, y sobre los moradores de Jerusalén y sobre los varones de Judá, todo el mal que les he anunciado, y no escucharon. 32 Tomó entonces Jeremías otro rollo, y lo dio a Baruc hijo de Nerías, escriba; y escribió en él de boca de Jeremías todas las palabras del libro que Joacim rey de Judá había quemado en el fuego; y aun fueron añadidas sobre ellas muchas otras palabras semejantes.`
  },
  {
    ref: "Jeremías 36:19",
    text: `Entonces dijeron los príncipes a Baruc: Ve, y escóndete, tú y Jeremías, y que nadie sepa dónde estáis.`
  },
  {
    ref: "Hebreos 11:32-38",
    text: `32 ¿Y qué más digo? Porque el tiempo me faltaría para contar de Gedeón, de Barac, de Sansón, de Jefté, de David, de Samuel y de los profetas; 33 que por fe conquistaron reinos, hicieron justicia, alcanzaron promesas, taparon bocas de leones, 34 apagaron fuegos impetuosos, evitaron filo de espada, sacaron fuerzas de debilidad, se hicieron fuertes en batallas, pusieron en fuga ejércitos extranjeros. 35 Las mujeres recibieron sus muertos mediante resurrección; otros fueron atormentados, no aceptando el rescate, a fin de obtener mejor resurrección; 36 y otros experimentaron vituperios y azotes, y a más de esto prisiones y cárceles. 37 Apedreados, aserrados, puestos a prueba, muertos a filo de espada; anduvieron errantes cubiertos de pieles de ovejas y de cabras, pobres, angustiados, maltratados; 38 de los cuales el mundo no era digno; errando por los desiertos, por los montes, por las cuevas y por las cavernas de la tierra.`
  },
  {
    ref: "Números 13:31–14:4",
    text: `31 Mas los varones que subieron con él, dijeron: No podremos subir contra aquel pueblo, porque es más fuerte que nosotros. 32 Y hablaron mal entre los hijos de Israel de la tierra que habían reconocido, diciendo: La tierra por donde pasamos para reconocerla, es tierra que traga a sus moradores; y todo el pueblo que vimos en medio de ella son hombres de grande estatura. 33 También vimos allí gigantes, hijos de Anac, raza de los gigantes, y éramos nosotros, a nuestro parecer, como langostas; y así les parecíamos a ellos. 1 Entonces toda la congregación alzó la voz y dio gritos; y el pueblo lloró aquella noche. 2 Y murmuraron contra Moisés y Aarón todos los hijos de Israel, y les dijo toda la multitud: ¡Ojalá hubiéramos muerto en la tierra de Egipto; o en este desierto ojalá muriéramos! 3 ¿Y por qué nos trae Jehová a esta tierra para caer a espada, y que nuestras mujeres y nuestros niños sean por presa? ¿No sería mejor que nos volviésemos a Egipto? 4 Y decían el uno al otro: Designemos un jefe, y volvámonos a Egipto.`
  },
  {
    ref: "Números 14:6-10",
    text: `6 Y Josué hijo de Nun y Caleb hijo de Jefone, que eran de los que habían reconocido la tierra, rasgaron sus vestidos; 7 y hablaron a toda la congregación de los hijos de Israel, diciendo: La tierra por donde pasamos para reconocerla, es en gran manera buena. 8 Si Jehová se agradare de nosotros, él nos llevará a esta tierra, y nos la entregará; tierra que fluye leche y miel. 9 Por tanto, no seáis rebeldes contra Jehová, ni temáis al pueblo de esta tierra; porque nosotros los comeremos como pan; su amparo se ha apartado de ellos, y con nosotros está Jehová; no los temáis. 10 Entonces toda la multitud habló de apedrearlos. Pero la gloria de Jehová se mostró en el tabernáculo de reunión a todos los hijos de Israel.`
  },
  {
    ref: "Jeremías 1:17, 18",
    text: `17 Ciñe, pues, tus lomos, levántate, y háblales todo cuanto te mande; no temas delante de ellos, para que no te haga yo quebrantar delante de ellos. 18 Porque he aquí que yo te he puesto hoy como ciudad fortificada, como columna de hierro y como muros de bronce contra toda esta tierra, contra los reyes de Judá, sus príncipes, sus sacerdotes y el pueblo de la tierra.`
  },
  {
    ref: "Jeremías 6:8-19",
    text: `8 Corrígete, Jerusalén, para que no se aparte mi alma de ti, para que no te convierta en desierto, en tierra inhabitada. 9 Así ha dicho Jehová de los ejércitos: Rebuscarán como a vid los restos de Israel; vuelve a pasar tu mano, como vendimiador entre los sarmientos. 10 ¿A quién hablaré y amonestaré, para que oigan? He aquí que sus oídos son incircuncisos, y no pueden escuchar; he aquí que la palabra de Jehová les es cosa vergonzosa, no la aman. 11 Por tanto, estoy lleno del furor de Jehová, trabajado de contenerme; lo derramaré sobre los niños en la calle, y sobre la reunión de los jóvenes igualmente; porque será preso tanto el marido como la mujer, el viejo como el muy anciano. 12 Sus casas pasarán a otros, sus heredades y sus mujeres juntamente; porque extenderé mi mano sobre los moradores de esta tierra, dice Jehová. 13 Porque desde el más chico de ellos hasta el más grande, cada uno sigue la avaricia; desde el profeta hasta el sacerdote, todos son engañadores. 14 Y curan el quebrantamiento de mi pueblo con liviandad, diciendo: Paz, paz; y no hay paz. 15 ¿Se han avergonzado de haber hecho abominación? Ciertamente no se han avergonzado, ni aun supieron avergonzarse; por tanto, caerán entre los que caigan; cuando los castigue, caerán, dice Jehová. 16 Así dijo Jehová: Paraos en los caminos, y mirad, y preguntad por las sendas antiguas, cuál sea el buen camino, y andad por él, y hallaréis descanso para vuestras almas. Mas dijeron: No andaremos. 17 Puse también sobre vosotros atalayas, que dijesen: Escuchad al sonido de la trompeta. Y dijeron ellos: No escucharemos. 18 Por tanto, oíd, naciones, y entiende, oh congregación, lo que sucederá a ellos. 19 Oye, tierra: He aquí yo traigo mal sobre este pueblo, el fruto de sus pensamientos; porque no escucharon mis palabras, y aborrecieron mi ley.`
  },
  {
    ref: "Jeremías 6:26",
    text: `Hija de mi pueblo, cíñete de cilicio, y revuélcate en ceniza; haz luto como por hijo único, llanto de amarguras; porque presto vendrá sobre nosotros el destructor.`
  },
  {
    ref: "Jeremías 32:15",
    text: `Porque así ha dicho Jehová de los ejércitos, Dios de Israel: Aún se comprarán casas, heredades y viñas en esta tierra.`
  },
  {
    ref: "2 Crónicas 36:11, 12",
    text: `11 De veintiún años era Sedequías cuando comenzó a reinar, y reinó once años en Jerusalén. 12 E hizo lo malo ante los ojos de Jehová su Dios, y no se humilló delante del profeta Jeremías, que hablaba de parte de Jehová.`
  },
  {
    ref: "2 Crónicas 36:15-21",
    text: `15 Y Jehová el Dios de sus padres envió constantemente aviso a ellos por medio de sus mensajeros, porque él tenía misericordia de su pueblo y de su habitación. 16 Mas ellos hacían escarnio de los mensajeros de Dios, y menospreciaban sus palabras, y burlaban de sus profetas, hasta que subió la ira de Jehová contra su pueblo, y no hubo ya remedio. 17 Por lo cual trajo contra ellos al rey de los caldeos, que mató a espada a sus jóvenes en la casa de su santuario, sin perdonar joven ni doncella, anciano ni decrépito; todos los entregó en sus manos. 18 Asimismo todos los utensilios de la casa de Dios, grandes y pequeños, los tesoros de la casa de Jehová, y los tesoros del rey y de sus príncipes, todo lo llevó a Babilonia. 19 Y quemaron la casa de Dios, y rompieron el muro de Jerusalén; consumieron a fuego todos sus palacios, y destruyeron todos sus objetos deseables. 20 Los que escaparon de la espada fueron llevados cautivos a Babilonia, y fueron siervos de él y de sus hijos, hasta que vino el reino de los persas; 21 para que se cumpliese la palabra de Jehová por boca de Jeremías, hasta que la tierra hubiese gozado de reposo por sus días de reposo; porque todos los días de su asolamiento reposó, hasta que los setenta años fueron cumplidos.`
  },
  {
    ref: "Éxodo 3:15",
    text: `Dijo más Dios a Moisés: Así dirás a los hijos de Israel: Jehová, el Dios de vuestros padres, el Dios de Abraham, Dios de Isaac y Dios de Jacob, me ha enviado a vosotros. Este es mi nombre para siempre; con él se me recordará por todos los siglos.`
  },
  {
    ref: "Salmo 105:26",
    text: `Envió a su siervo Moisés, y a Aarón al cual escogió.`
  },
  {
    ref: "Malaquías 3:1",
    text: `He aquí, yo envío mi mensajero, el cual preparará el camino delante de mí; y luego vendrá a su templo el Señor a quien vosotros buscáis, el ángel del pacto, a quien deseáis vosotros. He aquí viene, ha dicho Jehová de los ejércitos.`
  },
  {
    ref: "Isaías 6:8",
    text: `Después oí la voz del Señor, que decía: ¿A quién enviaré, y quién irá por nosotros? Entonces respondí yo: Heme aquí, envíame a mí.`
  },
  {
    ref: "Jeremías 25:4",
    text: `Y envió Jehová a vosotros todos sus siervos los profetas desde temprano y sin cesar; pero no oísteis, ni inclinasteis vuestros oídos para escuchar.`
  },
  {
    ref: "Mateo 11:13",
    text: `Porque todos los profetas y la ley hasta Juan profetizaron.`
  },
  {
    ref: "Lucas 11:49",
    text: `Por eso la sabiduría de Dios también dijo: Les enviaré profetas y apóstoles; y de ellos a unos matarán y a otros perseguirán.`
  },
  {
    ref: "2 Pedro 3:9",
    text: `El Señor no retarda su promesa, como algunos la tienen por tardanza, sino que es paciente para con nosotros, no queriendo que ninguno perezca, sino que todos procedan al arrepentimiento.`
  },
  {
    ref: "Mateo 23:37",
    text: `¡Jerusalén, Jerusalén, que matas a los profetas, y apedreas a los que te son enviados! ¡Cuántas veces quise juntar a tus hijos, como la gallina junta sus polluelos debajo de las alas, y no quisiste!`
  },
  {
    ref: "Hechos 7:52, 57, 58",
    text: `52 ¿A cuál de los profetas no persiguieron vuestros padres? Y mataron a los que anunciaron de antemano la venida del Justo, de quien vosotros ahora habéis sido entregadores y matadores; 57 Entonces ellos, dando grandes voces, se taparon los oídos y arremetieron a una contra él. 58 Y echándole fuera de la ciudad, le apedrearon; y los testigos pusieron sus ropas a los pies de un joven que se llamaba Saulo.`
  },
  {
    ref: "Jeremías 9:1",
    text: `¡Quién diera a mi cabeza aguas, y a mis ojos fuente de lágrimas, para que llore día y noche los muertos de la hija de mi pueblo!`
  },
  {
    ref: "Jeremías 13:17",
    text: `Mas si no oyereis esto, en secreto llorará mi alma a causa de vuestra soberbia; y llorando amargamente se desharán mis ojos en lágrimas, porque el rebaño de Jehová fue hecho cautivo.`
  },
  {
    ref: "Jeremías 14:17",
    text: `Les dirás, pues, esta palabra: Derramen mis ojos lágrimas noche y día, y no cesen; porque de gran quebrantamiento es quebrantada la virgen hija de mi pueblo, de plaga muy dolorosa.`
  },
  {
    ref: "Jeremías 20:14-18",
    text: `14 Maldito el día en que nací; el día en que mi madre me dio a luz no sea bendito. 15 Maldito el hombre que dio nuevas a mi padre, diciendo: Un hijo varón te ha nacido; haciéndole alegrar así mucho. 16 Y sea el tal hombre como las ciudades que asoló Jehová, y no se arrepintió; oiga gritos de mañana, y voz de guerra a mediodía, 17 porque no me mató desde la matriz, y mi madre me hubiera sido mi sepulcro, y su vientre embarazado para siempre. 18 ¿Para qué salí de la matriz? ¿Para ver trabajo y dolor, y que mis días se gasten en afrenta?`
  },
  {
    ref: "Jeremías 15:10",
    text: `¡Ay de mí, madre mía, que me engendraste hombre de rencillas y hombre de contiendas para toda la tierra! Nunca di ni tomé en préstamo, y todos me maldicen.`
  },
  {
    ref: "Jeremías 26:8-11",
    text: `8 Y cuando Jeremías acabó de hablar todo lo que Jehová le había mandado que hablase a todo el pueblo, los sacerdotes y los profetas y todo el pueblo le prendieron, diciendo: De cierto morirás. 9 ¿Por qué has profetizado en nombre de Jehová, diciendo: Esta casa será como Silo, y esta ciudad será asolada hasta no quedar morador? Y todo el pueblo se juntó contra Jeremías en la casa de Jehová. 10 Y los príncipes de Judá oyeron estas cosas, y subieron de la casa del rey a la casa de Jehová, y se sentaron en la entrada de la puerta nueva de la casa de Jehová. 11 Entonces hablaron los sacerdotes y los profetas a los príncipes y a todo el pueblo, diciendo: En pena de muerte ha incurrido este hombre; porque profetizó contra esta ciudad, como vosotros habéis oído con vuestros oídos.`
  },
  {
    ref: "Jeremías 38:4",
    text: `Y dijeron los príncipes al rey: Rogamos que muera este hombre; porque de esta manera hace desfallecer las manos de los hombres de guerra que han quedado en esta ciudad, y las manos de todo el pueblo, hablándoles tales palabras; porque este hombre no busca la paz de este pueblo, sino el mal.`
  },
  {
    ref: "Jeremías 20:7-9",
    text: `7 Me sedujiste, oh Jehová, y fui seducido; más fuerte fuiste que yo, y vencisteme; cada día he sido escarnecido, cada cual se burla de mí. 8 Porque cuantas veces hablo, doy voces, grito: Violencia y destrucción; porque la palabra de Jehová me ha sido por afrenta y por escarnio cada día. 9 Y dije: No me acordaré más de él, ni hablaré más en su nombre; no obstante, había en mi corazón como un fuego ardiente metido en mis huesos; y estoy trabajado de contenerlo, y no puedo.`
  },
  {
    ref: "Jeremías 26:2",
    text: `Así ha dicho Jehová: Ponte en el atrio de la casa de Jehová, y habla a todas las ciudades de Judá, que vienen para adorar en la casa de Jehová, todas las palabras que yo te mando que les hables; no retengas palabra.`
  },
  {
    ref: "1 Corintios 10:6-13",
    text: `6 Estas cosas sucedieron como ejemplos para nosotros, para que no codiciemos cosas malas, como ellos codiciaron. 7 Ni seáis idólatras, como algunos de ellos, según está escrito: Se sentó el pueblo a comer y a beber, y se levantó a jugar. 8 Ni forniquemos, como algunos de ellos fornicaron, y cayeron en un día veintitrés mil. 9 Ni tentemos al Señor, como también algunos de ellos le tentaron, y perecieron por las serpientes. 10 Ni murmuréis, como algunos de ellos murmuraron, y perecieron por el destructor. 11 Y estas cosas les acontecieron como ejemplo, y están escritas para amonestarnos a nosotros, a quienes han alcanzado los fines de los siglos. 12 Así que, el que piensa estar firme, mire que no caiga. 13 No os ha sobrevenido ninguna tentación que no sea humana; pero fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir, sino que dará también juntamente con la tentación la salida, para que podáis soportar.`
  },
  {
    ref: "Gálatas 6:14-16",
    text: `14 Pero lejos esté de mí gloriarme, sino en la cruz de nuestro Señor Jesucristo, por quien el mundo me es crucificado a mí, y yo al mundo. 15 Porque en Cristo Jesús ni la circuncisión vale nada, ni la incircuncisión, sino la nueva creación. 16 Y a todos los que anden conforme a esta regla, paz y misericordia sea a ellos, y al Israel de Dios.`
  },
  {
    ref: "2 Crónicas 20:20",
    text: `Y madrugaron por la mañana y salieron al desierto de Tecoa; y mientras ellos salían, Josafat, estando en pie, dijo: Oídme, Judá y moradores de Jerusalén. Creed en Jehová vuestro Dios, y estaréis seguros; creed a sus profetas, y seréis prosperados.`
  },
  {
    ref: "3 Juan 1:2",
    text: `Amado, yo deseo que tú seas prosperado en todas las cosas, y que tengas salud, así como prospera tu alma.`
  },
  {
    ref: "Isaías 40:8",
    text: `Sécase la hierba, marchítase la flor; mas la palabra del Dios nuestro permanece para siempre.`
  },
];

const QUIZ_DATA = [
  {
    q: "Cuando Jehudí había leído tres o cuatro planas del rollo, ¿qué hizo el rey Joaquim?",
    opts: ["Pidió que le leyera todo desde el principio", "Lo cortó con un cortaplumas y lo echó al fuego del brasero", "Rasgó sus vestidos y se humilló", "Lo guardó en la cámara de Elisama"],
    ans: 1,
    feedback: "El rey solo escuchó el comienzo del mensaje antes de enfurecerse; lo rasgó y lo echó al brasero hasta que todo el rollo se consumió (Jer. 36:23). Fue una respuesta de desprecio hacia Dios, su mensaje y su mensajero."
  },
  {
    q: "¿Qué dice Jeremías 36:24 sobre la reacción del rey y de sus siervos?",
    opts: ["Temieron y rasgaron sus vestidos", "Ni temieron ni rasgaron sus vestidos", "Se dividieron: unos temieron y otros no", "Pidieron consultar a otros profetas"],
    ans: 1,
    feedback: "«Ni el rey ni ninguno de sus siervos que oyeron todas estas palabras, temieron, ni rasgaron sus vestidos» (Jer. 36:24). Rasgar el rollo en lugar de las vestiduras muestra que no hubo arrepentimiento."
  },
  {
    q: "¿Qué le advirtieron los príncipes a Baruc cuando oyeron el mensaje de Jeremías?",
    opts: ["Que no volviera a escribir nada", "Que se llevara el rollo a Babilonia", "Que se escondiera, junto con Jeremías", "Que leyera el rollo en el templo"],
    ans: 2,
    feedback: "«Ve, y escóndete, tú y Jeremías, y que nadie sepa dónde estáis» (Jer. 36:19). Se dieron cuenta de que Jeremías correría peligro si el rollo llegaba al rey."
  },
  {
    q: "Después de que el rey quemó el rollo, ¿cómo respondió Dios?",
    opts: ["Retiró su mensaje de Judá", "Ordenó escribir otro rollo con las mismas palabras, y se añadieron muchas más", "Envió fuego sobre el palacio de inmediato", "Calló y no volvió a hablar con Jeremías"],
    ans: 1,
    feedback: "«Vuelve a tomar otro rollo, y escribe en él todas las palabras primeras» (Jer. 36:28), y «aun fueron añadidas sobre ellas muchas otras palabras semejantes» (v. 32). Nuestra renuencia no borra el mensaje de Dios."
  },
  {
    q: "¿Qué se dice de Sedequías en 2 Crónicas 36:12?",
    opts: ["Que escuchó a Jeremías y se arrepintió", "Que no se humilló delante del profeta Jeremías", "Que mandó matar a Jeremías", "Que huyó a Egipto"],
    ans: 1,
    feedback: "«Hizo lo malo ante los ojos de Jehová su Dios, y no se humilló delante del profeta Jeremías, que hablaba de parte de Jehová» (2 Crón. 36:12). Jeremías era un portavoz de Dios mismo."
  },
  {
    q: "¿Por qué Jesús lloró sobre Jerusalén en Mateo 23:37?",
    opts: ["Porque la ciudad iba a ser reconstruida", "Porque Jerusalén mataba a los profetas y apedreaba a los mensajeros que Dios le enviaba", "Porque nadie iba al templo", "Porque los romanos la habían conquistado"],
    ans: 1,
    feedback: "«¡Jerusalén, Jerusalén, que matas a los profetas, y apedreas a los que te son enviados!» (Mat. 23:37). La larga historia de rechazo a los profetas entristeció profundamente a Jesús."
  },
  {
    q: "Según Pablo, ¿por qué conservó Dios las historias del Antiguo Testamento?",
    opts: ["Solo como datos históricos", "Para que las naciones vecinas las conocieran", "Como ejemplo y para amonestarnos a quienes vivimos en los fines de los siglos", "Para reemplazar la ley"],
    ans: 2,
    feedback: "«Estas cosas les acontecieron como ejemplo, y están escritas para amonestarnos a nosotros» (1 Cor. 10:11). Y hay esperanza: Dios es fiel y da la salida para que podamos soportar (1 Cor. 10:13)."
  },
  {
    q: "Elena G. de White enseñó que a quienes dudaban de su don profético se los debía tratar con…",
    opts: ["Desconfianza y distancia", "Mucha paciencia y amor fraternal", "Silencio absoluto", "Corrección pública inmediata"],
    ans: 1,
    feedback: "Escribió que se los debía tratar con «mucha paciencia y amor fraternal […] hasta que encuentren su lugar y adopten una posición en favor o en contra» (Testimonios para la iglesia, t. 1, p. 294). La evidencia de su don eran los mensajes que Dios le daba."
  },
];

const DISCUSS_RESISTIR = [
  { n: 1, text: "¿Cómo respondió el rey Joaquim a la advertencia profética?", ref: "Jeremías 36:20-26" },
  { n: 2, text: "¿Cómo respondió Dios al acto de rebeldía de Joaquim?", ref: "Jeremías 36:27-31" },
  { n: 3, text: "¿Cómo fue recibido el mensaje de Jeremías algunos años más tarde por el rey Sedequías?", ref: "2 Crónicas 36:11-12" },
  { n: 4, text: "¿Cómo respondió la nación de Judá a los mensajes que Dios les envió a través de sus profetas?", ref: "2 Crónicas 36:15-16" },
  { n: 5, text: "¿Por qué crees que esta historia de rechazo a los profetas entristeció tanto a Jesús?", ref: "Mateo 23:37" },
];

const DISCUSS_HISTORIA = [
  { n: 1, text: "¿Cómo se resistieron los israelitas a los líderes y profetas de Dios durante su peregrinaje por el desierto?", ref: "Números 14:1-4" },
  { n: 2, text: "Según el apóstol Pablo, ¿por qué inspiró Dios a los profetas a registrar las historias que tenemos en la Biblia?", ref: "1 Corintios 10:6-11" },
  { n: 3, text: "¿Cómo nos da la Biblia la esperanza de que no estamos condenados a repetir los errores del pasado?", ref: "1 Corintios 10:12-13" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "Haz un esquema o un mapa conceptual de Jeremías 36:20-32, con atención especial a los versículos 20-26. ¿Qué revela este texto sobre el tipo de resistencia que los profetas solían soportar?", ref: "Jeremías 36:20-26" },
  { key: "rfl2", q: "¿Qué nos dice sobre el carácter amoroso de Dios el hecho de que insista en acercarse a su pueblo a pesar de la rebeldía de este?", ref: "" },
  { key: "rfl3", q: "Imagina que el rey Joaquim hubiera aceptado el mensaje de Jeremías. ¿Cómo habría cambiado eso la historia de Jerusalén?", ref: "" },
  { key: "rfl4", q: "¿Por qué es tan común que los profetas se enfrenten a una feroz oposición y resistencia?", ref: "" },
  { key: "rfl5", q: "¿Cómo afecta a nuestra relación con Jesús el hecho de rechazar repetidamente sus mensajes?", ref: "" },
  { key: "rfl6", q: "¿Qué otros versículos o promesas te vienen a la mente en relación con la forma en que el pueblo de Dios ha recibido los mensajes divinos a lo largo de la historia?", ref: "" },
  { key: "rfl7", q: "¿Qué lecciones o valores puedes extraer de los relatos bíblicos sobre la rebelión y la incredulidad que te ayuden a evitar seguir el mismo camino?", ref: "1 Corintios 10:6-13" },
  { key: "rfl8", q: "Memoriza tu pasaje favorito de Jeremías 36:20-32. Escríbelo varias veces para que te sea más fácil recordarlo.", ref: "Jeremías 36:20-32" },
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
      <div className="sec-title">Ira ante <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>el mensaje de Dios</em></div>
      <div className="sec-sub">Séptima Semana · Jeremías 36:20-32 · El don de profecía</div>

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
            <div className="card-label">¿Decir mi verdad?</div>
            <p>Hoy se anima a las personas a «decir su verdad»: sus experiencias, sus ideas, sus límites, sus convicciones, sean cuales sean. Según esta forma de pensar, toda «verdad» es válida y no debe ser silenciada. Pero ¿qué sucede cuando esas «verdades» profundamente arraigadas entran en conflicto con la Verdad, que es Jesucristo, y su Palabra escrita? Algunos aceptan la verdad bíblica y se alejan de sus errores; otros se aferran a sus mentiras. Algunos cambian su comportamiento; otros se rebelan.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Jeremías 36:20-32
            </div>
            <div className="honey-text">
              «Tomó entonces Jeremías otro rollo… y aun fueron añadidas sobre ellas muchas otras palabras semejantes.»
            </div>
            <div className="honey-ref">Jeremías 36:32 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Mensajes que nadie quería oír</div>
            <p>Los profetas bíblicos a menudo transmitieron mensajes que la gente no quería oír: muchos fueron criticados, marginados, amenazados de muerte o incluso asesinados (Heb. 11:32-38). Aun así los proclamaron fielmente, porque su llamado no era opcional: habían recibido una instrucción para salvar la vida del pueblo de Dios. Esta semana vemos cómo reaccionó un rey ante uno de esos mensajes.</p>
          </div>

          <div className="card">
            <div className="card-label">Desde Moisés hasta Jeremías</div>
            <p>La propia fundación de Israel empezó con profetas que desafiaban el sentimiento popular. Cuando los espías trajeron informes de gigantes y ciudades amuralladas, el pueblo entró en pánico y se volvió contra Moisés y Aarón (Núm. 13:31–14:4). Josué y Caleb confiaron en Dios y casi mueren por decirlo (Núm. 14:6-10). Dios llamó a Jeremías a un ministerio difícil: «no temas delante de ellos» (Jer. 1:17), y lo hizo fuerte como una columna de hierro (Jer. 1:18).</p>
          </div>

          <div className="egw-wrap">
            <div className="egw-source"><Star size={11} /> Elena G. de White · Patriarcas y profetas, p. 409</div>
            <div className="egw-text">«<strong>Pero cuando los hombres entregan su corazón a la incredulidad, se colocan bajo el dominio de Satanás, y nadie puede decir hasta dónde los llevará.</strong>»</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text">El pueblo de Dios <strong>a menudo se resistía a los mensajes</strong> de los profetas.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Jesús <strong>se entristece</strong> cuando su pueblo rechaza a los mensajeros que él les envía.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Las historias de la Biblia se escribieron <strong>para ayudarnos a evitar repetir</strong> la historia de quienes rechazaron los mensajes de Dios.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabRollo({ teacherMode, openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Rollo</div>
      <div className="sec-sub">{teacherMode ? "Jeremías 36:20-32 · Vista maestro" : "El mensaje que no se pudo quemar"}</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Antes del rollo</div>
        <p>Jeremías fue la voz profética de Dios para Judá en una época de fatalidad inminente. Los pecados eran muchos y profundamente arraigados: idolatría, sacrificio de niños, adulterio y tiranía. Tocá cada tarjeta para ver cómo llegó el mensaje hasta el rey.</p>
      </div>

      <ExpandList items={ANTES_ROLLO} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Las ocho escenas · Jeremías 36:20-32</div>
      <ExpandList items={ESCENAS} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Detective de palabras · lo que se repite</div>
      <div className="card" style={{ marginBottom: "1rem" }}>
        <p>Al estudiar el pasaje conviene rodear las palabras que se repiten, subrayar lo importante y conectar ideas con flechas. Estas son las pistas de los versículos 20-32. ¿A qué apuntan juntas?</p>
      </div>
      <ExpandList items={REPETIDAS} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="cmp-block" style={{ marginTop: ".4rem" }}>
        <div className="cmp-title">Lo que quiso el rey, lo que hizo Dios</div>
        <div className="cmp-grid">
          <div className="cmp-cell b">
            <span className="cmp-lbl">Joaquim</span>
            Cortó el rollo, lo quemó hasta que se consumió todo y mandó prender al profeta y a su escriba (36:23, 26).
          </div>
          <div className="cmp-cell a">
            <span className="cmp-lbl">Dios</span>
            Escondió a sus siervos y ordenó escribir otro rollo con todas las palabras primeras, y aun más (36:26, 28, 32).
          </div>
        </div>
        <div className="cmp-note">A veces creemos que un mensaje divino desaparece si lo rechazamos, lo destruimos o nos deshacemos del mensajero. Nuestro desdén no lo borra: solo intensifica el daño que nos sobrevendrá a nosotros y a nuestras familias.</div>
      </div>

      {teacherMode ? (
        <>
          <div className="group-label">¿Quién lo hizo? · respuestas completas</div>
          <ExpandList
            items={REACCIONES.map(s => ({ key: `t-${s.key}`, badge: s.ref, name: s.name, body: `${s.fact} Respuesta: ${s.opts[s.ans]}. ${s.expl}` }))}
            openExpand={openExpand} toggleExpand={toggleExpand}
          />
        </>
      ) : (
        <>
          <div className="group-label">Dinámica · ¿quién lo hizo?</div>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p>Para cada acción, elegí quién la hizo: los príncipes, el rey Joaquim o Jehová. Cuando termines, tocá «Verificar».</p>
          </div>
          <Dinamica items={REACCIONES} doneLabel="acciones identificadas" />
        </>
      )}

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Una advertencia para todos</div>
        <p>La profecía sobre el fin del rey Joaquim (Jer. 36:30-31) contiene una grave advertencia para todo ser humano: si ignoramos las advertencias que Dios nos hace, lo hacemos por nuestra cuenta y riesgo, pues cosecharemos las consecuencias de nuestro pecado.</p>
      </div>
    </>
  );
}

function TabRechazo({ teacherMode, openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Rechazo</div>
      <div className="sec-sub">{teacherMode ? "Una historia de resistencia · Vista maestro" : "Una larga historia de resistencia"}</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Dios insiste</div>
        <p>Durante siglos Dios envió profetas a su pueblo (Éxo. 3:15; Sal. 105:26; Mal. 3:1; Isa. 6:8; Jer. 25:4; Mat. 11:13; Luc. 11:49), porque él «no quiere que nadie sea destruido, sino que todos procedan al arrepentimiento» (2 Ped. 3:9). La historia de Israel y Judá es la historia de los incesantes intentos de Dios por alcanzar a su pueblo descarriado con promesas de salvación, si tan solo se arrepintieran. La gracia de la voz de Jeremías no fue recibida con humildad, fe y arrepentimiento, sino con risas, burlas y escarnio.</p>
      </div>

      <div className="group-label">Casos · de Moisés a Esteban</div>
      <ExpandList items={CASOS} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="cmp-block" style={{ marginTop: ".4rem" }}>
        <div className="cmp-title">Dos respuestas ante la Verdad</div>
        <div className="cmp-grid">
          <div className="cmp-cell a">
            <span className="cmp-lbl">Aceptan</span>
            Reciben la verdad bíblica, cambian su comportamiento y se alejan de sus errores.
          </div>
          <div className="cmp-cell b">
            <span className="cmp-lbl">Se rebelan</span>
            Se aferran a sus mentiras, se rebelan contra la verdad y se vuelven contra quien la dice.
          </div>
        </div>
        <div className="cmp-note">Así ha ocurrido a lo largo de la historia: Josué y Caleb frente a la multitud, Jeremías frente a Joaquim, Esteban frente al Sanedrín.</div>
      </div>

      {teacherMode ? (
        <>
          <div className="group-label">¿Quién resistió? · respuestas completas</div>
          <ExpandList
            items={RESIST.map(s => ({ key: `t-${s.key}`, badge: s.ref, name: s.name, body: `${s.fact} Respuesta: ${s.opts[s.ans]}. ${s.expl}` }))}
            openExpand={openExpand} toggleExpand={toggleExpand}
          />
        </>
      ) : (
        <>
          <div className="group-label">Dinámica · ¿quién resistió?</div>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p>Para cada acción elegí quién la protagonizó. Cuando termines, tocá «Verificar».</p>
          </div>
          <Dinamica items={RESIST} doneLabel="casos identificados" />
        </>
      )}

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>¿Por qué es tan común que los profetas se enfrenten a una feroz oposición? ¿Y cómo afecta a nuestra relación con Jesús el hecho de rechazar repetidamente sus mensajes?</p>
      </div>
    </>
  );
}

function TabJeremias({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Jeremías</div>
      <div className="sec-sub">El costo personal de transmitir el mensaje</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">inVestiga · un ministerio difícil</div>
        <p>El ministerio profético de Jeremías abarcó los reinados de Josías, Joacaz, Joaquim, Joaquín y Sedequías. Jeremías era solo un hombre, un pecador como nosotros, pero era un representante del Señor y hablaba en su nombre. ¿Cómo nos ayudan estos pasajes a comprender los retos de su ministerio?</p>
      </div>

      <div className="group-label">Un profeta afligido</div>
      <ExpandList items={AFLIGIDO} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Confrontación intensa</div>
      <ExpandList items={CONFRONTACION} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Transmitiendo fielmente la palabra de Dios</div>
      <ExpandList items={FIEL} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="honey-card" style={{ marginTop: ".4rem" }}>
        <div className="honey-label"><Star size={13} /> Dios sostiene a su profeta</div>
        <div className="honey-text">«Ciñe, pues, tus lomos, levántate, y háblales todo cuanto te mande; no temas delante de ellos.»</div>
        <div className="honey-ref">Jeremías 1:17 · RVR1960</div>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)" }}>
        <div className="card-label">Para reflexionar</div>
        <p>Dios le dijo a Jeremías que debía ser tan fuerte como una columna de hierro. Y le dio la fuerza necesaria para cumplir su llamado. ¿Qué significa que Dios sostenga a quienes llama?</p>
      </div>
    </>
  );
}

function TabAviso({ openExpand, toggleExpand }) {
  const [marks, setMarks] = useState({});
  const toggleMark = i => setMarks(p => ({ ...p, [i]: !p[i] }));
  const n = Object.values(marks).filter(Boolean).length;
  return (
    <>
      <div className="sec-title">Aviso</div>
      <div className="sec-sub">Escrito para nuestra advertencia</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Por qué quedaron escritas</div>
        <p>Los relatos del Antiguo Testamento, por sórdidos y tristes que sean, quedaron registrados por una buena razón: para que aprendamos qué sucede cuando nos rebelamos contra Dios. El pasado establece el contexto de lo que ocurre ahora, y a menos que aprendamos de él, estamos condenados a repetirlo.</p>
      </div>

      <ExpandList items={LECCIONES} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="honey-card" style={{ marginTop: ".4rem" }}>
        <div className="honey-label"><Star size={13} /> Una promesa eterna</div>
        <div className="honey-text">«Sécase la hierba, marchítase la flor; mas la palabra del Dios nuestro permanece para siempre.»</div>
        <div className="honey-ref">Isaías 40:8 · RVR1960</div>
      </div>

      <div className="group-label">Formas más sutiles · autoexamen</div>
      <div className="card" style={{ marginBottom: "1rem" }}>
        <p>Los israelitas se burlaron de los mensajeros de Dios y despreciaron sus palabras. Hoy nadie haría algo así abiertamente... ¿o sí? Hay formas más sutiles de menospreciar los mensajes de Dios sin oponerse de frente. Tocá las que alguna vez te hayan pasado. Es solo para vos.</p>
      </div>

      {SUTILES.map((t, i) => (
        <div key={i} className={`faith-item${marks[i] ? " on" : ""}`} onClick={() => toggleMark(i)}>
          {marks[i] ? <CheckCircle size={18} color="var(--acc2)" /> : <Circle size={18} color="var(--tx3)" />}
          <span className="faith-text">{t}</span>
        </div>
      ))}
      <div className="faith-count">{n} de {SUTILES.length} marcadas</div>

      <div className="card" style={{ borderColor: "var(--brd2)" }}>
        <div className="card-label">Sin culpa, con esperanza</div>
        <p>Si marcaste alguna, no es para quedarte en la culpa: Dios no se cansa de acercarse. Él es paciente, no quiere que nadie perezca, sino que todos procedan al arrepentimiento (2 Ped. 3:9). Y su Palabra no desperdicia palabras: lo que dijo entonces vale para quienes vivimos en estos tiempos últimos.</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien cómo reaccionó Joaquim y por qué Dios insiste con su mensaje." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre el rollo, el rechazo a los profetas y la advertencia para nosotros." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Jeremías 36:20-32." :
                "Vale la pena releer el pasaje. Dios no se cansa de acercarse a su pueblo.";
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · Testimonios para la iglesia, t. 4, p. 229</div>
        <div className="egw-text">«Dios me puso para reprender a su pueblo, y […] considerará a todos aquellos a quienes se proclama este mensaje como responsables del modo en que lo traten. […] <strong>Yo no escogí esta desagradable tarea. No me trae la alabanza o el favor de los hombres.</strong> […] En nombre de mi Redentor y con su fuerza, haré cuanto pueda. Advertiré, aconsejaré, reprenderé y alentaré tal como dicta el Espíritu de Dios.»</div>
      </div>

      <div className="card">
        <div className="card-label">La recepción y la comunicación de los mensajes</div>
        <p>Durante su vida, Elena G. de White recibió cientos de visiones y sueños proféticos. Duraban desde unos pocos minutos hasta varias horas y a veces eran presenciadas por grandes grupos; incluso algunos escépticos pudieron examinarla. Como los profetas bíblicos, experimentaba fenómenos sobrenaturales: en 1868 James White describió que estaba «completamente inconsciente de todo lo que sucedía a su alrededor», no respiraba, tenía los ojos abiertos y, al salir de la visión, perdía temporalmente la vista. Nadie podía controlar cuándo o cuánto duraría una visión; solían ser inesperadas, incluso para ella.</p>
      </div>

      <div className="card">
        <div className="card-label">La reacción de la gente</div>
        <p>Como en tiempos bíblicos, la reacción ante sus mensajes variaba: algunos aceptaban los consejos de Dios y otros los rechazaban. Con quienes expresaban escepticismo fue muy amable: pidió tratarlos con <strong style={{ color: "var(--tx)" }}>«mucha paciencia y amor fraternal […] hasta que encuentren su lugar y adopten una posición en favor o en contra»</strong>. Estaba convencida de que la verdadera evidencia de su don eran los mensajes que Dios le daba, y que quienes buscaran honestamente la verdad llegarían a ver que era genuino. Dios nos ha dado evidencias suficientes «para inclinar nuestra fe hacia el lado de la verdad».</p>
      </div>

      <DiscussBlock
        title="Resistirse al mensaje"
        items={DISCUSS_RESISTIR}
        personal="¿Cómo responde Jesús cuando ignoramos a los mensajeros que él envía?"
      />
      <DiscussBlock
        title="Una historia para nosotros"
        items={DISCUSS_HISTORIA}
        personal="Los israelitas se burlaron de los mensajeros de Dios, despreciaron sus palabras y se mofaron de sus profetas. Sin duda, hoy nunca haríamos algo así... ¿o sí? ¿Crees que hay formas más sutiles de socavar o menospreciar a los profetas sin oponerse abiertamente a ellos?"
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
            <span className="key-text">El pueblo de Dios <strong>a menudo se resistía a los mensajes</strong> de los profetas.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Jesús <strong>se entristece</strong> cuando su pueblo rechaza a los mensajeros que él les envía.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Las historias de la Biblia se escribieron <strong>para ayudarnos a evitar repetir la historia</strong> de aquellos que rechazaron los mensajes de Dios.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Hoy no hace falta un brasero para quemar un mensaje. Alcanza con <strong>un deslizar de pulgar</strong>: silenciás el grupo donde alguien te dijo algo incómodo, dejás en «visto» ese consejo de tus viejos, escuchás la prédica con el celular en la mano y pensás «esto no es para mí». Joaquim no discutió con el rollo: lo cortó de a pedacitos y lo tiró al fuego. Lo que Dios hizo fue pedir otro rollo, con más palabras.</p>
          <br />
          <p>Fijate en los príncipes: no eran santos, pero fueron los que avisaron, los que rogaron, los que ayudaron a esconder. En tu liceo, tu facultad o tu trabajo, a veces el mejor mensajero de Dios es el amigo que se anima a decirte lo que no querías escuchar. Antes de enojarte o de alejarte de esa persona, preguntate: <strong>¿y si tiene razón?</strong> Y al revés: ¿hay alguien a quien vos podrías hablarle con paciencia y cariño, sin humillarlo?</p>
          <br />
          <p>Pablo dice que estas historias están escritas para nosotros, y también dice que Dios es fiel y siempre da la salida. No estás condenado a repetir el error de Joaquim. La diferencia es mínima: <strong>escuchar entero, antes de decidir</strong>.</p>
          <br />
          <p>Esta semana, <strong>una sola cosa concreta</strong>: pensá en un consejo, un versículo o una advertencia que venís esquivando. Leelo completo, con calma, hasta el final. Escribí a mano tu versículo favorito de Jeremías 36:20-32 varias veces hasta saberlo. Y contale a una persona de confianza qué te está pidiendo Dios con eso.</p>
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
    { id: "inicio",   label: "Inicio",      Icon: Home },
    { id: "rollo",    label: "Rollo",       Icon: ScrollText },
    { id: "rechazo",  label: "Rechazo",     Icon: ShieldAlert },
    { id: "jeremias", label: "Jeremías",    Icon: Droplets },
    { id: "aviso",    label: "Aviso",       Icon: AlertTriangle },
    { id: "biblia",   label: "Biblia",      Icon: BookOpen },
    { id: "quiz",     label: "Quiz",        Icon: HelpCircle },
    { id: "cierre",   label: "Cierre",      Icon: Flame },
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
              Ira ante <em>el mensaje de Dios</em>
            </h1>
            <div className="hero-ref">Jeremías 36:20-32 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"   && <TabInicio teacherMode={teacherMode} />}
            {tab === "rollo"    && <TabRollo teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "rechazo"  && <TabRechazo teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "jeremias" && <TabJeremias openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "aviso"    && <TabAviso openExpand={openExpand} toggleExpand={toggleExpand} />}
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
