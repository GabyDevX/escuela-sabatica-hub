import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Compass, Users, Megaphone, Anchor, Square, SquareCheck
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#040a0e;--bg2:#08121a;--bg3:#0e1a24;--surf:#112029;--surf2:#182a36;--brd:#1d3240;--brd2:#2b4a5c;--tx:#e6f0f5;--tx2:#93aab8;--tx3:#5d7585;--acc:#2f7fa6;--acc2:#5fa9cf;--acc3:#bfe0f0;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#d4a94a;--warn-d:rgba(212,169,74,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#0a1a24 0%,#08121a 55%,#040a0e 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(47,127,166,.30) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(47,127,166,.40);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(47,127,166,.10)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(47,127,166,.48) 30%,rgba(47,127,166,.48) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(47,127,166,.18);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(47,127,166,.25);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(212,169,74,.18);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(47,127,166,.09)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(47,127,166,.25);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(47,127,166,.16),rgba(47,127,166,.02));border:1px solid rgba(47,127,166,.30);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(47,127,166,.12);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(47,127,166,.20),rgba(47,127,166,.03));border:1px solid rgba(47,127,166,.36);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(47,127,166,.20),rgba(47,127,166,.03));border:1.5px solid rgba(47,127,166,.38);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(47,127,166,.10);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
.cmp-block{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1rem .9rem;margin-bottom:.85rem}
.cmp-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--tx);margin-bottom:.7rem;line-height:1.3}
.cmp-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.cmp-cell{border-radius:10px;padding:.7rem .7rem;font-size:.93rem;line-height:1.5;color:var(--tx2)}
.cmp-cell.a{background:rgba(47,127,166,.12);border:1px solid rgba(47,127,166,.28)}
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
.sym-opt.sel{border-color:var(--acc2);color:var(--tx);background:rgba(47,127,166,.14)}
.sym-opt.ok{border-color:var(--ok);background:var(--ok-d);color:var(--ok)}
.sym-opt.bad{border-color:var(--err);background:var(--err-d);color:var(--err)}
.sym-opt:disabled{cursor:default}
.sym-expl{font-size:.95rem;line-height:1.55;color:var(--tx2);background:var(--surf2);border-radius:10px;padding:.75rem .85rem;margin-top:.35rem}
.check-btn{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#fff;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;margin-top:.2rem;transition:background .2s}
.check-btn:disabled{background:var(--brd2);color:var(--tx3);cursor:default}
.check-result{text-align:center;font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:600;color:var(--acc3);margin:.9rem 0 .4rem}
.faith-item{display:flex;gap:.75rem;align-items:flex-start;background:var(--surf);border:1px solid var(--brd);border-radius:12px;padding:.8rem .95rem;margin-bottom:.5rem;cursor:pointer;transition:all .2s}
.faith-item.on{border-color:var(--acc);background:rgba(47,127,166,.10)}
.faith-item svg{flex-shrink:0;margin-top:.15rem}
.faith-text{font-size:.97rem;line-height:1.5;color:var(--tx2)}
.faith-item.on .faith-text{color:var(--tx)}
.faith-count{font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--tx3);text-align:right;margin:.2rem 0 1rem;letter-spacing:.06em}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: ¿qué te haría cambiar de opinión?", desc: "Preguntar: ¿qué haría falta para que alguien que cree que a Dios no le importa el mundo cambie de idea? Presentar a Guillermo Miller: un capitán deísta que pasó de un Dios distante a un Salvador «el más señalado entre diez mil»." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos del grupo. Orar agradeciendo el trimestre de estudio sobre las últimas escenas de la vida de Cristo y pidiendo una fe firme para las escenas finales de la tierra." },
  { time: "05–10 min", title: "Tab Miller — De deísta a predicador", desc: "Recorrer la historia: el hogar cristiano, la desilusión, el deísmo, Plattsburgh, el sermón sobre los deberes parentales y la conversión. Leer su testimonio y conectar: su obra ayudó a preparar el cumplimiento de Apocalipsis 14." },
  { time: "10–15 min", title: "Tab 144.000 — Descifrar los símbolos", desc: "Hacer la dinámica en grupo: nombre del Padre en la frente (Éxodo 34:4-7), cántico nuevo (Apocalipsis 15:3), vírgenes (Apocalipsis 17:1, 5), sin mentira (Apocalipsis 14:5) y el sello (Apocalipsis 7:1-8). Abrir el detalle completo con el modo maestro." },
  { time: "15–20 min", title: "Tab Ángeles — Apocalipsis 14 y Juan 14-16", desc: "Comparar cada mensaje angélico con lo que Jesús enseñó la noche de la última cena: gloria y juicio (Juan 16:8-14), persecución (Juan 16:1-4), mandamientos y fe (Juan 14:1, 15, 21; 15:10, 14)." },
  { time: "20–24 min", title: "Tab Fe — La fe de Jesús", desc: "Leer la cita de El Deseado de todas las gentes: «Por la fe, Cristo venció». Hacer el chequeo de fe en silencio (cada uno en su celular) y repasar los pasajes de inVestiga: victoria, resistencia y preparación." },
  { time: "24–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Detenerse en por qué la virginidad es simbólica y en el paralelo entre el tercer ángel y Juan 14:15." },
  { time: "27–30 min", title: "Cierre e inQuiere", desc: "Usar los dos bloques de discusión: «El pueblo de Dios en los días finales» y «Mensajes paralelos». Cerrar con las citas de imPlícate (la ley y el evangelio van de la mano) y los «Puntos clave para recordar». Es la última semana del trimestre: invitar a compartir qué se llevan." },
];

const MILLER_DATA = [
  {
    key: "mi1", badge: "Su juventud",
    name: "1. Un hogar cristiano y un alma inquieta",
    body: "Guillermo Miller se crió en un hogar cristiano y sentía un gran respeto por la fe de su madre. De joven tenía una profunda reverencia por Dios y un marcado sentido de su propia pecaminosidad. Intentó diligentemente vivir con integridad, pero finalmente se dio cuenta de que no podía hacerlo por sus propias fuerzas."
  },
  {
    key: "mi2", badge: "Deísmo",
    name: "2. Un Dios distante",
    body: "También se desilusionó por el sufrimiento que veía en el mundo, que no podía conciliar con un Dios amoroso. Esos dos factores —su fracaso moral y el dolor del mundo— lo llevaron a considerar otras creencias, y se decantó por el deísmo: la filosofía de que Dios creó todas las cosas pero es un Dios distante que no se interesa por lo que creó."
  },
  {
    key: "mi3", badge: "Guerra de 1812",
    name: "3. La bala de cañón en Plattsburgh",
    body: "Mientras servía como capitán en la Guerra de 1812 entre Estados Unidos y Gran Bretaña, durante la batalla de Plattsburgh una bala de cañón explotó a pocos metros de él: mató a uno de sus amigos y a él lo dejó ileso. La experiencia lo conmocionó tanto que empezó a replantearse sus creencias deístas."
  },
  {
    key: "mi4", badge: "Dos años después",
    name: "4. Una fiesta que se volvió reunión de oración",
    body: "La noche antes de la celebración anual de la victoria en Plattsburgh, un sermón muy emotivo conmovió tan profundamente a la comunidad que decidió cancelar los festejos y reemplazarlos por reuniones de oración."
  },
  {
    key: "mi5", badge: "El domingo siguiente",
    name: "5. Un sermón sobre los deberes parentales",
    body: "Le pidieron a Miller que leyera el sermón en la iglesia. El tema asignado —los deberes de los padres— dejaba al descubierto el vacío de las creencias deístas cuando se pensaba en el significado más profundo de la vida. Los presentes notaron lo conmovido que estaba. Ese momento marcó el comienzo de una transformación que cambió su vida y la de muchas otras personas."
  },
  {
    key: "mi6", badge: "Salmo 119:105",
    name: "6. «Encontré en Jesús un amigo»",
    body: "Miller descubrió que fuera de la Biblia no podía obtener prueba alguna de un Salvador así, y que la Biblia presentaba precisamente el Salvador que él necesitaba. Concluyó que un libro no inspirado no podía desarrollar principios tan perfectamente adaptados a las necesidades de un mundo caído. Las Escrituras, antes oscuras y contradictorias, se volvieron «antorcha a mis pies y luz a mi senda»."
  },
  {
    key: "mi7", badge: "Apocalipsis 14",
    name: "7. Un predicador del pronto regreso",
    body: "Después de estudiar muchas de las cosas que vimos juntos este trimestre, Miller se convirtió en un predicador increíblemente influyente, que llevó a muchos a aceptar a Cristo como su Salvador personal. También predicó las profecías sobre el pronto regreso de Cristo. Su obra ayudó a preparar el camino para el cumplimiento de Apocalipsis 14, escrito casi 1700 años antes de su nacimiento."
  },
];

const SIMBOLOS = [
  {
    key: "s1", name: "El nombre del Padre en la frente", ref: "Apocalipsis 14:1",
    fact: "Los 144.000 tienen el nombre de él y el de su Padre escrito en la frente.",
    opts: ["Un tatuaje o marca física visible", "El carácter amoroso de Dios gobernando sus decisiones", "Un título religioso que reciben por su cargo"],
    ans: 1,
    expl: "En las Escrituras, el nombre de Dios siempre va ligado a su carácter. Cuando se lo reveló a Moisés, describió su carácter: «misericordioso y piadoso; tardo para la ira, y grande en misericordia y verdad» (Éxodo 34:6). Su nombre en la frente muestra que su carácter guía cada decisión."
  },
  {
    key: "s2", name: "Un cántico nuevo", ref: "Apocalipsis 14:3",
    fact: "Cantan un cántico nuevo que nadie más puede aprender.",
    opts: ["La expresión de una experiencia única de redención y liberación", "Un himno que solo se enseña en el cielo", "Una canción que memorizaron antes del fin"],
    ans: 0,
    expl: "Es el cántico de Moisés y del Cordero (Apocalipsis 15:3). Nadie más puede aprenderlo porque nace de haber vivido de primera mano la redención y la liberación de Dios."
  },
  {
    key: "s3", name: "Vírgenes que no se contaminaron", ref: "Apocalipsis 14:4",
    fact: "Son vírgenes que no se contaminaron con mujeres.",
    opts: ["Que nunca se casaron", "Que eran todos hombres jóvenes", "Que rechazaron las enseñanzas de Babilonia y de sus hijas"],
    ans: 2,
    expl: "Como otros símbolos del Apocalipsis, la virginidad es simbólica. Babilonia es «la gran ramera», «la madre de las rameras» (Apocalipsis 17:1, 5). Los 144.000 rechazan sus enseñanzas y las de sus hijas, que siguen con tradiciones pecaminosas."
  },
  {
    key: "s4", name: "Siguen al Cordero", ref: "Apocalipsis 14:4",
    fact: "Siguen al Cordero por dondequiera que va.",
    opts: ["Viajan físicamente a Jerusalén", "Mantienen los ojos fijos en Jesús y caminan a su lado adonde los lleve", "Siguen a un líder religioso que representa a Cristo"],
    ans: 1,
    expl: "En lugar de seguir a las mujeres corruptas del Apocalipsis, este grupo está decidido a mantener sus ojos fijos en Jesús y a caminar a su lado dondequiera que él los lleve."
  },
  {
    key: "s5", name: "Sin mentira, sin mancha", ref: "Apocalipsis 14:5",
    fact: "En sus bocas no fue hallada mentira; son sin mancha delante del trono.",
    opts: ["Nunca cometieron ningún pecado en su vida", "Están revestidos de la justicia de Cristo y proclaman la verdad sobre él", "Hicieron un voto de silencio"],
    ans: 1,
    expl: "Refleja la profundidad de su vida de fe: están completamente revestidos de la justicia de Cristo, reflejan la belleza de su carácter y proclaman la verdad sobre quién es él."
  },
  {
    key: "s6", name: "Sellados", ref: "Apocalipsis 7:1-8",
    fact: "Reciben el sello del Dios vivo en la frente.",
    opts: ["Un afianzamiento en la verdad que los vuelve inconmovibles", "Una garantía de que no sufrirán nada", "Un registro de asistencia a la iglesia"],
    ans: 0,
    expl: "Elena G. de White lo describe como «un afianzamiento en la verdad, tanto intelectual como espiritualmente, de modo que los sellados son inconmovibles» (Eventos de los últimos días, cap. 15, p. 186). Su fe es imperturbable, sean cuales sean las consecuencias."
  },
];

const ANGELES = [
  {
    key: "an1", title: "Primer ángel · Gloria y juicio",
    a: { lbl: "Apocalipsis 14:7", text: "«Temed a Dios, y dadle gloria, porque la hora de su juicio ha llegado»." },
    b: { lbl: "Juan 16:8-14", text: "El Espíritu «me glorificará; porque tomará de lo mío, y os lo hará saber», los guiará «a toda la verdad» y convencerá al mundo «de juicio»." },
    note: "Una forma en que el pueblo de Dios del fin le dará gloria es declarando al mundo el mensaje de Jesús y toda la verdad. El Espíritu usará a ese pueblo para llevar el mensaje de la hora del juicio."
  },
  {
    key: "an2", title: "Segundo ángel · Babilonia y la persecución",
    a: { lbl: "Apocalipsis 14:8 · 17:5, 6", text: "«Ha caído, ha caído Babilonia»: un poder religioso que persiguió al pueblo de Dios, «ebria de la sangre de los santos», y representó falsamente su carácter." },
    b: { lbl: "Juan 16:1-4", text: "«Cualquiera que os mate, pensará que rinde servicio a Dios. Y harán esto porque no conocen al Padre ni a mí»." },
    note: "El espíritu de persecución es lo contrario de tener el nombre del Padre escrito en la frente: quien persigue en nombre de Dios demuestra que no conoce su carácter."
  },
  {
    key: "an3", title: "Tercer ángel · Mandamientos y fe",
    a: { lbl: "Apocalipsis 14:12", text: "«Aquí está la paciencia de los santos, los que guardan los mandamientos de Dios y la fe de Jesús»." },
    b: { lbl: "Juan 14:1, 15 · 15:10", text: "«Creéis en Dios, creed también en mí». «Si me amáis, guardad mis mandamientos». «Si guardareis mis mandamientos, permaneceréis en mi amor»." },
    note: "La noche de la última cena, Jesús animó varias veces a sus discípulos a tener una fe más profunda, a creer en él pasara lo que pasara (Juan 14:1, 11, 29), e insistió en obedecer sus mandamientos (Juan 14:15, 21; 15:10, 14)."
  },
];

const FE_CHECK = [
  { key: "f1", text: "¿Estoy aprendiendo a confiar en Dios en los retos que enfrento hoy?" },
  { key: "f2", text: "¿Me aferro a Dios cuando me siento solo y sin el apoyo de mis amigos?" },
  { key: "f3", text: "¿Me mantengo firme en mis creencias aun cuando se burlan de mí por ellas?" },
  { key: "f4", text: "¿Sé vivir según mi fe cuando mis recursos son limitados?" },
  { key: "f5", text: "¿Cómo respondo ante el riesgo y el peligro?" },
  { key: "f6", text: "¿Le doy prioridad a Dios en mis finanzas, mi tiempo y mis talentos?" },
  { key: "f7", text: "¿Mantengo una relación de calidad con Dios en los buenos y en los malos momentos?" },
];

const INV_VICTORIA = [
  { key: "iv1", badge: "Apocalipsis 7:1-8", name: "Sellados antes de la tormenta", body: "Cuatro ángeles detienen los vientos de la tierra «hasta que hayamos sellado en sus frentes a los siervos de nuestro Dios». Dios no deja a su pueblo expuesto: primero lo afirma, después llega la crisis." },
  { key: "iv2", badge: "Apocalipsis 7:13, 14", name: "Salidos de la gran tribulación", body: "«Estos son los que han salido de la gran tribulación, y han lavado sus ropas, y las han emblanquecido en la sangre del Cordero». No esquivaron la prueba: la atravesaron vestidos de la justicia de Cristo." },
  { key: "iv3", badge: "Apocalipsis 15:1-4", name: "El cántico de Moisés y del Cordero", body: "Los que alcanzaron la victoria sobre la bestia están en pie sobre el mar de vidrio con arpas de Dios y cantan: «Grandes y maravillosas son tus obras... justos y verdaderos son tus caminos, Rey de los santos»." },
];

const INV_RESISTENCIA = [
  { key: "ir1", badge: "Marcos 13:13", name: "Perseverar hasta el fin", body: "«Seréis aborrecidos de todos por causa de mi nombre; mas el que persevere hasta el fin, éste será salvo». La promesa no es ausencia de oposición, sino salvación para quien persevera." },
  { key: "ir2", badge: "Lucas 18:8", name: "¿Hallará fe?", body: "«Cuando venga el Hijo del Hombre, ¿hallará fe en la tierra?» Jesús mismo planteó la pregunta: la fe del tiempo del fin es escasa y preciosa." },
  { key: "ir3", badge: "1 Tesalonicenses 5:23", name: "Guardados irreprensibles", body: "«El mismo Dios de paz os santifique por completo; y todo vuestro ser, espíritu, alma y cuerpo, sea guardado irreprensible para la venida de nuestro Señor Jesucristo». Es Dios quien guarda." },
  { key: "ir4", badge: "Santiago 5:7, 8", name: "La paciencia del labrador", body: "«Tened también vosotros paciencia, y afirmad vuestros corazones; porque la venida del Señor se acerca». Como el labrador que espera la lluvia temprana y la tardía." },
];

const INV_PREPARACION = [
  { key: "ip1", badge: "Lucas 21:34-36", name: "Velad en todo tiempo", body: "«Mirad también por vosotros mismos, que vuestros corazones no se carguen de glotonería y embriaguez y de los afanes de esta vida... Velad, pues, en todo tiempo orando»." },
  { key: "ip2", badge: "Romanos 13:11-14", name: "Es hora de despertar", body: "«Es ya hora de levantarnos del sueño; porque ahora está más cerca de nosotros nuestra salvación que cuando creímos... vestíos del Señor Jesucristo»." },
  { key: "ip3", badge: "Tito 2:11-13", name: "La gracia que enseña", body: "La gracia de Dios nos enseña a vivir «sobria, justa y piadosamente, aguardando la esperanza bienaventurada y la manifestación gloriosa de nuestro gran Dios y Salvador Jesucristo»." },
];

const VERSES = [
  {
    ref: "Apocalipsis 14:1-12", isBase: true,
    text: `1 Después miré, y he aquí el Cordero estaba en pie sobre el monte de Sion, y con él ciento cuarenta y cuatro mil, que tenían el nombre de él y el de su Padre escrito en la frente. 2 Y oí una voz del cielo como estruendo de muchas aguas, y como sonido de un gran trueno; y la voz que oí era como de arpistas que tocaban sus arpas. 3 Y cantaban un cántico nuevo delante del trono, y delante de los cuatro seres vivientes, y de los ancianos; y nadie podía aprender el cántico sino aquellos ciento cuarenta y cuatro mil que fueron redimidos de entre los de la tierra. 4 Estos son los que no se contaminaron con mujeres, pues son vírgenes. Estos son los que siguen al Cordero por dondequiera que va. Estos fueron redimidos de entre los hombres como primicias para Dios y para el Cordero; 5 y en sus bocas no fue hallada mentira, pues son sin mancha delante del trono de Dios. 6 Vi volar por en medio del cielo a otro ángel, que tenía el evangelio eterno para predicarlo a los moradores de la tierra, a toda nación, tribu, lengua y pueblo, 7 diciendo a gran voz: Temed a Dios, y dadle gloria, porque la hora de su juicio ha llegado; y adorad a aquel que hizo el cielo y la tierra, el mar y las fuentes de las aguas. 8 Otro ángel le siguió, diciendo: Ha caído, ha caído Babilonia, la gran ciudad, porque ha hecho beber a todas las naciones del vino del furor de su fornicación. 9 Y el tercer ángel los siguió, diciendo a gran voz: Si alguno adora a la bestia y a su imagen, y recibe la marca en su frente o en su mano, 10 él también beberá del vino de la ira de Dios, que ha sido vaciado puro en el cáliz de su ira; y será atormentado con fuego y azufre delante de los santos ángeles y del Cordero; 11 y el humo de su tormento sube por los siglos de los siglos. Y no tienen reposo de día ni de noche los que adoran a la bestia y a su imagen, ni nadie que reciba la marca de su nombre. 12 Aquí está la paciencia de los santos, los que guardan los mandamientos de Dios y la fe de Jesús.`
  },
  {
    ref: "Éxodo 34:4-7",
    text: `4 Y Moisés alisó dos tablas de piedra como las primeras; y se levantó de mañana y subió al monte Sinaí, como le mandó Jehová, y llevó en su mano las dos tablas de piedra. 5 Y Jehová descendió en la nube, y estuvo allí con él, proclamando el nombre de Jehová. 6 Y pasando Jehová por delante de él, proclamó: ¡Jehová! ¡Jehová! fuerte, misericordioso y piadoso; tardo para la ira, y grande en misericordia y verdad; 7 que guarda misericordia a millares, que perdona la iniquidad, la rebelión y el pecado, y que de ningún modo tendrá por inocente al malvado; que visita la iniquidad de los padres sobre los hijos y sobre los hijos de los hijos, hasta la tercera y cuarta generación.`
  },
  {
    ref: "Salmo 119:105",
    text: `Lámpara es a mis pies tu palabra, y lumbrera a mi camino.`
  },
  {
    ref: "Cantares 5:10",
    text: `Mi amado es blanco y rubio, señalado entre diez mil.`
  },
  {
    ref: "Marcos 13:13",
    text: `Y seréis aborrecidos de todos por causa de mi nombre; mas el que persevere hasta el fin, éste será salvo.`
  },
  {
    ref: "Lucas 18:8",
    text: `Os digo que pronto les hará justicia. Pero cuando venga el Hijo del Hombre, ¿hallará fe en la tierra?`
  },
  {
    ref: "Lucas 21:34-36",
    text: `34 Mirad también por vosotros mismos, que vuestros corazones no se carguen de glotonería y embriaguez y de los afanes de esta vida, y venga de repente sobre vosotros aquel día. 35 Porque como un lazo vendrá sobre todos los que habitan sobre la faz de toda la tierra. 36 Velad, pues, en todo tiempo orando que seáis tenidos por dignos de escapar de todas estas cosas que vendrán, y de estar en pie delante del Hijo del Hombre.`
  },
  {
    ref: "Juan 14:1",
    text: `No se turbe vuestro corazón; creéis en Dios, creed también en mí.`
  },
  {
    ref: "Juan 14:11",
    text: `Creedme que yo soy en el Padre, y el Padre en mí; de otra manera, creedme por las mismas obras.`
  },
  {
    ref: "Juan 14:15",
    text: `Si me amáis, guardad mis mandamientos.`
  },
  {
    ref: "Juan 14:21",
    text: `El que tiene mis mandamientos, y los guarda, ése es el que me ama; y el que me ama, será amado por mi Padre, y yo le amaré, y me manifestaré a él.`
  },
  {
    ref: "Juan 14:29",
    text: `Y ahora os lo he dicho antes que suceda, para que cuando suceda, creáis.`
  },
  {
    ref: "Juan 15:10",
    text: `Si guardareis mis mandamientos, permaneceréis en mi amor; así como yo he guardado los mandamientos de mi Padre, y permanezco en su amor.`
  },
  {
    ref: "Juan 15:14",
    text: `Vosotros sois mis amigos, si hacéis lo que yo os mando.`
  },
  {
    ref: "Juan 16:1-4",
    text: `1 Estas cosas os he hablado, para que no tengáis tropiezo. 2 Os expulsarán de las sinagogas; y aun viene la hora cuando cualquiera que os mate, pensará que rinde servicio a Dios. 3 Y harán esto porque no conocen al Padre ni a mí. 4 Mas os he dicho estas cosas, para que cuando llegue la hora, os acordéis de que ya os lo había dicho. Esto no os lo dije al principio, porque yo estaba con vosotros.`
  },
  {
    ref: "Juan 16:8-11",
    text: `8 Y cuando él venga, convencerá al mundo de pecado, de justicia y de juicio. 9 De pecado, por cuanto no creen en mí; 10 de justicia, por cuanto voy al Padre, y no me veréis más; 11 y de juicio, por cuanto el príncipe de este mundo ha sido ya juzgado.`
  },
  {
    ref: "Juan 16:13, 14",
    text: `13 Pero cuando venga el Espíritu de verdad, él os guiará a toda la verdad; porque no hablará por su propia cuenta, sino que hablará todo lo que oyere, y os hará saber las cosas que habrán de venir. 14 Él me glorificará; porque tomará de lo mío, y os lo hará saber.`
  },
  {
    ref: "Romanos 7:12",
    text: `De manera que la ley a la verdad es santa, y el mandamiento santo, justo y bueno.`
  },
  {
    ref: "Romanos 13:11-14",
    text: `11 Y esto, conociendo el tiempo, que es ya hora de levantarnos del sueño; porque ahora está más cerca de nosotros nuestra salvación que cuando creímos. 12 La noche está avanzada, y se acerca el día. Desechemos, pues, las obras de las tinieblas, y vistámonos las armas de la luz. 13 Andemos como de día, honestamente; no en glotonerías y borracheras, no en lujurias y lascivias, no en contiendas y envidia, 14 sino vestíos del Señor Jesucristo, y no proveáis para los deseos de la carne.`
  },
  {
    ref: "1 Tesalonicenses 5:23",
    text: `Y el mismo Dios de paz os santifique por completo; y todo vuestro ser, espíritu, alma y cuerpo, sea guardado irreprensible para la venida de nuestro Señor Jesucristo.`
  },
  {
    ref: "Tito 2:11-13",
    text: `11 Porque la gracia de Dios se ha manifestado para salvación a todos los hombres, 12 enseñándonos que, renunciando a la impiedad y a los deseos mundanos, vivamos en este siglo sobria, justa y piadosamente, 13 aguardando la esperanza bienaventurada y la manifestación gloriosa de nuestro gran Dios y Salvador Jesucristo.`
  },
  {
    ref: "Santiago 5:7, 8",
    text: `7 Por tanto, hermanos, tened paciencia hasta la venida del Señor. Mirad cómo el labrador espera el precioso fruto de la tierra, aguardando con paciencia hasta que reciba la lluvia temprana y la tardía. 8 Tened también vosotros paciencia, y afirmad vuestros corazones; porque la venida del Señor se acerca.`
  },
  {
    ref: "Apocalipsis 3:15, 16",
    text: `15 Yo conozco tus obras, que ni eres frío ni caliente. ¡Ojalá fueses frío o caliente! 16 Pero por cuanto eres tibio, y no frío ni caliente, te vomitaré de mi boca.`
  },
  {
    ref: "Apocalipsis 7:1-8",
    text: `1 Después de esto vi a cuatro ángeles en pie sobre los cuatro ángulos de la tierra, que detenían los cuatro vientos de la tierra, para que no soplase viento alguno sobre la tierra, ni sobre el mar, ni sobre ningún árbol. 2 Vi también a otro ángel que subía de donde sale el sol, y tenía el sello del Dios vivo; y clamó a gran voz a los cuatro ángeles, a quienes se les había dado el poder de hacer daño a la tierra y al mar, 3 diciendo: No hagáis daño a la tierra, ni al mar, ni a los árboles, hasta que hayamos sellado en sus frentes a los siervos de nuestro Dios. 4 Y oí el número de los sellados: ciento cuarenta y cuatro mil sellados de todas las tribus de los hijos de Israel. 5 De la tribu de Judá, doce mil sellados. De la tribu de Rubén, doce mil sellados. De la tribu de Gad, doce mil sellados. 6 De la tribu de Aser, doce mil sellados. De la tribu de Neftalí, doce mil sellados. De la tribu de Manasés, doce mil sellados. 7 De la tribu de Simeón, doce mil sellados. De la tribu de Leví, doce mil sellados. De la tribu de Isacar, doce mil sellados. 8 De la tribu de Zabulón, doce mil sellados. De la tribu de José, doce mil sellados. De la tribu de Benjamín, doce mil sellados.`
  },
  {
    ref: "Apocalipsis 7:13, 14",
    text: `13 Entonces uno de los ancianos habló, diciéndome: Estos que están vestidos de ropas blancas, ¿quiénes son, y de dónde han venido? 14 Yo le dije: Señor, tú lo sabes. Y él me dijo: Estos son los que han salido de la gran tribulación, y han lavado sus ropas, y las han emblanquecido en la sangre del Cordero.`
  },
  {
    ref: "Apocalipsis 15:1-4",
    text: `1 Vi en el cielo otra señal, grande y admirable: siete ángeles que tenían las siete plagas postreras; porque en ellas se consumaba la ira de Dios. 2 Vi también como un mar de vidrio mezclado con fuego; y a los que habían alcanzado la victoria sobre la bestia y su imagen, y su marca y el número de su nombre, en pie sobre el mar de vidrio, con las arpas de Dios. 3 Y cantan el cántico de Moisés siervo de Dios, y el cántico del Cordero, diciendo: Grandes y maravillosas son tus obras, Señor Dios Todopoderoso; justos y verdaderos son tus caminos, Rey de los santos. 4 ¿Quién no te temerá, oh Señor, y glorificará tu nombre? pues sólo tú eres santo; por lo cual todas las naciones vendrán y te adorarán, porque tus juicios se han manifestado.`
  },
  {
    ref: "Apocalipsis 17:1-6",
    text: `1 Vino entonces uno de los siete ángeles que tenían las siete copas, y habló conmigo diciéndome: Ven acá, y te mostraré la sentencia contra la gran ramera, la que está sentada sobre muchas aguas; 2 con la cual han fornicado los reyes de la tierra, y los moradores de la tierra se han embriagado con el vino de su fornicación. 3 Y me llevó en el Espíritu al desierto; y vi a una mujer sentada sobre una bestia escarlata llena de nombres de blasfemia, que tenía siete cabezas y diez cuernos. 4 Y la mujer estaba vestida de púrpura y escarlata, y adornada de oro, de piedras preciosas y de perlas, y tenía en la mano un cáliz de oro lleno de abominaciones y de la inmundicia de su fornicación; 5 y en su frente un nombre escrito, un misterio: BABILONIA LA GRANDE, LA MADRE DE LAS RAMERAS Y DE LAS ABOMINACIONES DE LA TIERRA. 6 Vi a la mujer ebria de la sangre de los santos, y de la sangre de los mártires de Jesús; y cuando la vi, quedé asombrado con gran asombro.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Qué filosofía adoptó Guillermo Miller antes de su conversión?",
    opts: ["El ateísmo: Dios no existe", "El deísmo: Dios creó todo pero es distante y no se interesa por lo creado", "El panteísmo: Dios está en todas las cosas", "El agnosticismo: no se puede saber nada de Dios"],
    ans: 1,
    feedback: "El sufrimiento del mundo y su propia incapacidad de vivir con integridad lo llevaron al deísmo. Luego descubrió en la Biblia un Salvador «bueno y compasivo» que expiaba nuestras transgresiones."
  },
  {
    q: "Según la lección, ¿qué representa el nombre del Padre escrito en la frente de los 144.000?",
    opts: ["Una marca física visible", "El carácter amoroso de Dios gobernando sus decisiones", "Su pertenencia a una tribu de Israel", "Un cargo de liderazgo en la iglesia"],
    ans: 1,
    feedback: "En las Escrituras el nombre de Dios va ligado a su carácter: al revelar su nombre a Moisés, describió que es «misericordioso y piadoso; tardo para la ira, y grande en misericordia y verdad» (Éxodo 34:6)."
  },
  {
    q: "¿Qué significa que los 144.000 sean «vírgenes» (Apocalipsis 14:4)?",
    opts: ["Que nunca se casaron", "Que son exclusivamente hombres", "Que rechazaron las enseñanzas de Babilonia, la gran ramera, y de sus hijas", "Que vivieron aislados en monasterios"],
    ans: 2,
    feedback: "Como otros símbolos del Apocalipsis, se interpreta simbólicamente. Babilonia es «la madre de las rameras» (Apocalipsis 17:5); los 144.000 no siguen sus enseñanzas: «siguen al Cordero por dondequiera que va»."
  },
  {
    q: "¿Qué cántico entonan los que obtienen la victoria?",
    opts: ["El cántico de David", "El cántico de Moisés y del Cordero", "El cántico de María", "El cántico de los ángeles de Belén"],
    ans: 1,
    feedback: "«Cantan el cántico de Moisés siervo de Dios, y el cántico del Cordero» (Apocalipsis 15:3). Es la expresión de haber vivido de primera mano la redención y la liberación de Dios."
  },
  {
    q: "Elena G. de White describe el sello de Dios como...",
    opts: ["Una marca en la mano derecha", "Un afianzamiento en la verdad, intelectual y espiritual, que los vuelve inconmovibles", "Un certificado de bautismo", "Una protección que evita todo sufrimiento"],
    ans: 1,
    feedback: "«Un afianzamiento en la verdad, tanto intelectual como espiritualmente, de modo que los sellados son inconmovibles» (Eventos de los últimos días, cap. 15, p. 186)."
  },
  {
    q: "¿Con qué enseñanza de Jesús en la última cena se relaciona el mensaje del segundo ángel sobre Babilonia?",
    opts: ["«En la casa de mi Padre muchas moradas hay»", "«Cualquiera que os mate, pensará que rinde servicio a Dios»", "«Yo soy la vid, vosotros los pámpanos»", "«La paz os dejo, mi paz os doy»"],
    ans: 1,
    feedback: "Jesús advirtió sobre los poderes perseguidores: «harán esto porque no conocen al Padre ni a mí» (Juan 16:2, 3). Babilonia persigue al pueblo de Dios y representa falsamente su carácter."
  },
  {
    q: "¿Cómo describe Apocalipsis 14:12 al pueblo de Dios del tiempo del fin?",
    opts: ["Los que conocen todas las profecías", "Los que guardan los mandamientos de Dios y la fe de Jesús", "Los que nunca fueron perseguidos", "Los que construyeron el templo"],
    ans: 1,
    feedback: "«Aquí está la paciencia de los santos, los que guardan los mandamientos de Dios y la fe de Jesús». Jesús dijo lo mismo en la última cena: «Si me amáis, guardad mis mandamientos» (Juan 14:15) y «creed también en mí» (Juan 14:1)."
  },
  {
    q: "Según la lección, ¿cómo se desarrolla la fe que necesitaremos en la crisis final?",
    opts: ["De golpe, cuando llegue la crisis", "Ejercitándola en las decisiones grandes y pequeñas de cada día", "Memorizando las profecías", "Evitando todo contacto con el mundo"],
    ans: 1,
    feedback: "No es posible desarrollar una fe sólida de la noche a la mañana. Así como Jesús «por la fe venció» porque conocía el carácter de su Padre, nuestra fe crece al confiar en Dios en los retos de hoy."
  },
];

const DISCUSS_PUEBLO = [
  { n: 1, text: "¿Qué diferencia a los 144.000 del resto de la humanidad?", ref: "Apocalipsis 14:1-5" },
  { n: 2, text: "Según la Biblia, ¿cómo podemos saber que el nombre de Dios está asociado con su carácter?", ref: "Éxodo 34:4-7" },
  { n: 3, text: "¿De qué mujeres del Apocalipsis se mantienen puros los 144.000? ¿Qué simboliza su virginidad?", ref: "Apocalipsis 17:5" },
  { n: 4, text: "¿Cuál es el significado de que los 144.000 sigan al Cordero dondequiera que va?", ref: "Apocalipsis 14:4" },
  { n: 5, text: "¿Qué significa que los 144.000 estén sellados?", ref: "Apocalipsis 7:1-8" },
];

const DISCUSS_PARALELOS = [
  { n: 1, text: "¿Qué temas de las últimas instrucciones de Cristo a sus discípulos se encuentran en el mensaje del primer ángel?", ref: "Apocalipsis 14:6, 7; Juan 16:8-10" },
  { n: 2, text: "¿De qué manera la advertencia contra el poder persecutorio de Babilonia refleja las advertencias de Cristo sobre la persecución?", ref: "Apocalipsis 14:8; 17:5, 6; Juan 16:1-4" },
  { n: 3, text: "¿De qué manera ambos mensajes subrayan la importancia de guardar los mandamientos de Dios?", ref: "Apocalipsis 14:12; Juan 14:15, 21; 15:10, 14" },
  { n: 4, text: "¿Cómo se manifiesta en ambos mensajes la invitación a profundizar en la fe y las creencias?", ref: "Apocalipsis 14:12; Juan 14:1, 11, 29" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Cómo trató Jesús de preparar a sus discípulos para su partida?", ref: "Juan 13-17" },
  { key: "rfl2", q: "¿De qué manera has experimentado un «afianzamiento en la verdad» al estudiar este trimestre?", ref: "" },
  { key: "rfl3", q: "¿Cómo te ha revelado Dios su hermoso carácter en lo que has estudiado?", ref: "Éxodo 34:6, 7" },
  { key: "rfl4", q: "¿Qué tipo de canto está componiendo Dios en tu vida? ¿Cómo ha sido la experiencia de liberación y salvación que te ha dado?", ref: "Apocalipsis 14:3; 15:3" },
  { key: "rfl5", q: "¿Qué partes de este pasaje te resultan más difíciles de entender? ¿Has notado algún detalle o enfoque nuevo esta vez?", ref: "" },
  { key: "rfl6", q: "¿Cómo podemos ser más receptivos al Espíritu Santo que nos guía a toda la verdad?", ref: "Juan 16:13" },
  { key: "rfl7", q: "¿Qué otros pasajes de las Escrituras te vienen a la mente en relación con Apocalipsis 14?", ref: "" },
  { key: "rfl8", q: "¿Qué oportunidades y experiencias te está dando Dios ahora para fortalecer tu fe en él?", ref: "Apocalipsis 14:12" },
  { key: "rfl9", q: "Memoriza tu pasaje favorito de Apocalipsis 14. Escríbelo varias veces para ayudarte a memorizarlo.", ref: "Apocalipsis 14:1-12" },
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
      <div className="sec-title">Las escenas finales <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>de la tierra</em></div>
      <div className="sec-sub">Decimotercera Semana · Apocalipsis 14 · Las escenas finales</div>

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
            <div className="card-label">El mensaje de un Salvador amoroso</div>
            <p>Durante doce semanas recorrimos las últimas escenas de la vida de Cristo: la última cena, Getsemaní, la cruz, la tumba. Ahora el foco se amplía. Todo lo que Jesús enseñó y vivió en sus momentos finales tenía un objetivo más largo: preparar al pueblo de Dios para los momentos finales de la historia de la tierra. Apocalipsis 14 es ese mensaje: un Salvador que vuelve a buscar a su pueblo, y una advertencia para que ese pueblo esté listo.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Apocalipsis 14:12
            </div>
            <div className="honey-text">
              «Aquí está la paciencia de los santos, los que guardan los mandamientos de Dios y la fe de Jesús.»
            </div>
            <div className="honey-ref">Apocalipsis 14:12 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text">Los 144.000 se fundamentan en <strong>la verdad del carácter de Dios</strong>, revelada en las últimas enseñanzas y actos de Jesús antes de la crucifixión.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">El mensaje de los tres ángeles <strong>se hace eco de las enseñanzas finales de Cristo</strong>.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Cuanto más ejercitemos nuestra fe hoy, <strong>más fuerte será</strong> para sostenernos en las pruebas que vendrán.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabMiller({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Miller</div>
      <div className="sec-sub">De un Dios distante a un Salvador amoroso</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El capitán Guillermo Miller</div>
        <p>Un joven criado en un hogar cristiano que terminó creyendo que a Dios no le importaba el mundo. Una bala de cañón, una fiesta cancelada y un sermón leído en voz alta cambiaron su historia, y la de muchísimas personas más. Tocá cada momento para recorrer su camino.</p>
      </div>

      <ExpandList items={MILLER_DATA} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="egw-wrap" style={{ marginTop: ".4rem" }}>
        <div className="egw-source"><Star size={11} /> Guillermo Miller · citado en El conflicto de los siglos, cap. 19, p. 319</div>
        <div className="egw-text">«De pronto, el carácter de un Salvador se grabó hondamente en mi espíritu. Me pareció que bien podía existir un ser tan bueno y compasivo que expiara nuestras transgresiones [...]. Me vi obligado a admitir que las Sagradas Escrituras debían ser una revelación de Dios. Llegaron a ser mi deleite; <strong>y encontré en Jesús un amigo.</strong> El Salvador vino a ser para mí el más señalado entre diez mil; y las Escrituras, que antes eran oscuras y contradictorias, se volvieron entonces antorcha a mis pies y luz a mi senda. [...] Encontré que el Señor Dios era una Roca en medio del océano de la vida. [...] Encontré que no se me había dicho nunca ni la mitad de lo que contenía.»</div>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)" }}>
        <div className="card-label">Para reflexionar</div>
        <p>Miller no encontró a Dios esquivando sus dudas sobre el sufrimiento, sino descubriendo en la Biblia el carácter de un Salvador. ¿Qué imagen de Dios tenías al empezar este trimestre? ¿Cambió algo?</p>
      </div>
    </>
  );
}

function TabSimbolos({ teacherMode, openExpand, toggleExpand }) {
  const [sel, setSel] = useState({});
  const [checked, setChecked] = useState(false);
  const answered = Object.keys(sel).length;
  const correct = SIMBOLOS.filter(s => sel[s.key] === s.ans).length;

  if (teacherMode) {
    return (
      <>
        <div className="sec-title">144.000</div>
        <div className="sec-sub">El pueblo de Dios en los días finales · Vista maestro</div>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div className="card-label">Contexto</div>
          <p>Las interpretaciones varían en los detalles, pero la mayoría coincide en que, como mínimo, los 144.000 representan al pueblo de Dios que vivirá durante las últimas escenas de la historia de la tierra (Apocalipsis 7:4-8; 14:1). Los alumnos ven una dinámica para descifrar cada símbolo; acá está el desarrollo completo.</p>
        </div>
        <ExpandList
          items={SIMBOLOS.map(s => ({ key: `t-${s.key}`, badge: s.ref, name: s.name, body: s.expl }))}
          openExpand={openExpand} toggleExpand={toggleExpand}
        />
        <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
          <div className="card-label">La base</div>
          <p>Han leído y adoptado la verdad del carácter de Dios revelada en Cristo. Están tan firmemente establecidos en esa verdad y en su amor inquebrantable por la humanidad, que su fe es imperturbable, sean cuales sean las consecuencias. Esa es exactamente la base que Cristo estableció en sus últimas instrucciones a sus discípulos.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sec-title">144.000</div>
      <div className="sec-sub">Descifrá los símbolos del pueblo final</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Cómo funciona</div>
        <p>El Apocalipsis habla en símbolos. Para cada rasgo de los 144.000, elegí lo que creés que significa. Cuando termines, tocá «Verificar».</p>
      </div>

      {SIMBOLOS.map(s => (
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
          <div className="check-result">{correct} de {SIMBOLOS.length} símbolos descifrados</div>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button className="quiz-retry" onClick={() => { setSel({}); setChecked(false); }}><RotateCcw size={15} /> Intentar de nuevo</button>
          </div>
        </>
      ) : (
        <button className="check-btn" disabled={answered < SIMBOLOS.length} onClick={() => setChecked(true)}>
          {answered < SIMBOLOS.length ? `Respondé los ${SIMBOLOS.length} (${answered}/${SIMBOLOS.length})` : "Verificar"}
        </button>
      )}
    </>
  );
}

function TabAngeles() {
  return (
    <>
      <div className="sec-title">Ángeles</div>
      <div className="sec-sub">Apocalipsis 14 y la última noche de Jesús</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Preparación para la crisis</div>
        <p>En sus últimas horas, Jesús compartió con sus discípulos lecciones clave (Juan 13-17) para que profundizaran en la verdad y vivieran en armonía con ella. Los preparó para la crisis dirigiendo su atención hacia la verdadera identidad del Padre. Fijate cómo el mensaje de los tres ángeles repite, casi punto por punto, lo que Jesús enseñó esa noche.</p>
      </div>

      {ANGELES.map(x => (
        <div key={x.key} className="cmp-block">
          <div className="cmp-title">{x.title}</div>
          <div className="cmp-grid">
            <div className="cmp-cell a">
              <span className="cmp-lbl">{x.a.lbl}</span>
              {x.a.text}
            </div>
            <div className="cmp-cell b">
              <span className="cmp-lbl">{x.b.lbl}</span>
              {x.b.text}
            </div>
          </div>
          <div className="cmp-note">{x.note}</div>
        </div>
      ))}

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>Estudiar las últimas escenas de la vida de Cristo nos conecta con Aquel que nos mantendrá fuertes en los últimos días de la tierra. Al reflexionar en ellas estaremos más preparados para permanecer firmes en la fe, amar como él amó y perseverar como él perseveró.</p>
      </div>
    </>
  );
}

function TabFe({ openExpand, toggleExpand }) {
  const [marks, setMarks] = useState({});
  const count = Object.values(marks).filter(Boolean).length;
  return (
    <>
      <div className="sec-title">Fe</div>
      <div className="sec-sub">La fe de Jesús</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Una fe que descansaba en el amor del Padre</div>
        <p>En las escenas finales, el pueblo de Dios soportará oposición, persecución y engaños religiosos. Se verá tentado a creer que fue abandonado a su suerte. La clave será tener el mismo tipo de fe que sostuvo a Jesús: una fe que descansaba en el amor del Padre, incluso cuando no podía sentirlo.</p>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 78, p. 716</div>
        <div className="egw-text">«En esas terribles horas había confiado en la evidencia que antes recibiera de que era aceptado de su Padre. Conocía el carácter de su Padre; comprendía su justicia, su misericordia y su gran amor. Por la fe, confió en Aquel a quien había sido siempre su placer obedecer. Y mientras, sumiso, se confiaba a Dios, desapareció la sensación de haber perdido el favor de su Padre. <strong>Por la fe, Cristo venció.</strong>»</div>
      </div>

      <div className="group-label">Chequeo de fe · tocá lo que ya estás practicando</div>
      {FE_CHECK.map(f => (
        <div key={f.key} className={`faith-item${marks[f.key] ? " on" : ""}`} onClick={() => setMarks(p => ({ ...p, [f.key]: !p[f.key] }))}>
          {marks[f.key] ? <SquareCheck size={18} color="var(--acc2)" /> : <Square size={18} color="var(--tx3)" />}
          <span className="faith-text">{f.text}</span>
        </div>
      ))}
      <div className="faith-count">{count}/{FE_CHECK.length} · Solo vos ves esto</div>

      <div className="card" style={{ borderColor: "var(--brd2)" }}>
        <div className="card-label">No se construye de la noche a la mañana</div>
        <p>El tipo de fe que vamos a necesitar solo se consigue ejerciéndola en las decisiones grandes y pequeñas de cada día. Lo que sostuvo a Jesús fue su confianza absoluta en su Padre; confiar en Dios será la única forma de tener verdadera paz en los últimos momentos de la historia.</p>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)", margin: "1.1rem 0 .85rem" }}>
        <div className="card-label">inVestiga · La experiencia del pueblo de Dios al final</div>
        <p>Estos pasajes ayudan a comprender lo que vivirá el pueblo de Dios durante las escenas finales de la historia de la tierra.</p>
      </div>

      <div className="group-label">Los 144.000 y su victoria</div>
      <ExpandList items={INV_VICTORIA} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Más fe y resistencia</div>
      <ExpandList items={INV_RESISTENCIA} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="group-label">Cómo prepararse</div>
      <ExpandList items={INV_PREPARACION} openExpand={openExpand} toggleExpand={toggleExpand} />
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien el mensaje de Apocalipsis 14 y la fe que necesita el pueblo de Dios al final." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre los 144.000 y los tres ángeles." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Apocalipsis 14:1-12." :
                "Vale la pena releer el pasaje. Es el mensaje de un Salvador que vuelve a buscarte.";
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · The Three Angels' Messages (2022), p. 115</div>
        <div className="egw-text">«El Señor tiene una obra para cada uno de sus fieles: llevar la fe de Jesús al lugar que le corresponde en el mensaje del tercer ángel. La ley ocupa un lugar importante, pero es impotente a menos que la justicia de Cristo se coloque junto a ella [...]. <strong>Dios es glorificado mediante la fe viva en un Salvador personal, plenamente suficiente.</strong> La fe contempla a Cristo tal como es: la única esperanza del pecador. La fe se aferra a Cristo, confía en él. Afirma: "Él me amó; él murió por mí. Acepto el sacrificio, y Cristo no habrá muerto por mí en vano".»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · The Three Angels' Messages (2022), p. 116</div>
        <div className="egw-text">«Cada rayo de luz que el cielo envía es esencial para nuestra salvación. [...] Ha sido necesario enaltecer la excelsa norma de justicia, pero al hacerlo, muchos han descuidado la predicación de la fe de Jesús. <strong>Si queremos tener el espíritu y el poder del mensaje del tercer ángel, debemos presentar la ley y el evangelio juntos, pues van de la mano.</strong> [...] Un poder desde lo alto actúa en los corazones de los leales para exaltar la ley y levantar a Jesús como un Salvador completo. [...] Tales personas no tendrán una experiencia diaria y viva del amor de Dios en el corazón, y si no se arrepienten con celo, se contarán entre aquellos representados por los laodicenses, quienes serán vomitados de la boca de Dios.»</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">El pueblo de Dios en los días finales</div>
        {DISCUSS_PUEBLO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Alguna vez te encontraste en una situación en la que te resultaba muy difícil seguir a Jesús? Reflexiona sobre las lecciones que aprendiste de esa experiencia.</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">Mensajes paralelos</div>
        {DISCUSS_PARALELOS.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Qué lecciones de las últimas escenas de la vida de Cristo pueden ayudarte a mantenerte fiel durante las últimas escenas de la tierra? Después de profundizar en este mensaje, ¿de qué maneras concretas podrías empezar a compartirlo con quienes te rodean?</div>
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
            <span className="key-text">Los 144.000 se fundamentan en la verdad del carácter de Dios, según lo revelan las últimas enseñanzas y actos de Jesús antes de la crucifixión. <strong>La verdad de Jesús es lo que los sostiene.</strong></span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">El mensaje de los tres ángeles <strong>se hace eco de las enseñanzas finales de Cristo</strong>.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Cuanto más ejercitemos nuestra fe hoy, <strong>más fuerte será para sostenernos</strong> en las pruebas más difíciles que vendrán en el futuro.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Es fácil imaginar el tiempo del fin como una película: decretos, persecución, una decisión dramática en el último minuto. Y es fácil pensar que, llegado el momento, vas a estar a la altura.</p>
          <br />
          <p>Pero la lección dice algo incómodo: <strong>la fe no se improvisa.</strong> La que vas a tener ese día es la que estás entrenando hoy. En el grupo de chat donde todos se ríen de «los religiosos». En el parcial que podrías copiar sin que nadie se entere. En la plata que te sobra (o que no te sobra) a fin de mes. En la noche en que Dios parece estar en silencio y no sentís nada.</p>
          <br />
          <p>Jesús no venció en la cruz porque sintiera al Padre cerca; venció porque <strong>conocía su carácter</strong> y confió en él sin sentirlo. Guillermo Miller cambió cuando descubrió ese mismo carácter en la Biblia. Los 144.000 llevan ese nombre en la frente.</p>
          <br />
          <p>Esta semana, volvé al chequeo de fe y elegí <strong>una sola</strong> de esas áreas en la que todavía no confiás en Dios. Hacé una decisión concreta ahí: algo chico, visible para vos, que te cueste un poco. Y elegí un versículo de Apocalipsis 14 para memorizar: es el último del trimestre, que sea el que te acompañe.</p>
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
    { id: "inicio",   label: "Inicio",  Icon: Home },
    { id: "miller",   label: "Miller",  Icon: Compass },
    { id: "simbolos", label: "144.000", Icon: Users },
    { id: "angeles",  label: "Ángeles", Icon: Megaphone },
    { id: "fe",       label: "Fe",      Icon: Anchor },
    { id: "biblia",   label: "Biblia",  Icon: BookOpen },
    { id: "quiz",     label: "Quiz",    Icon: HelpCircle },
    { id: "cierre",   label: "Cierre",  Icon: Flame },
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
              InVerso · Semana 13
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Las escenas finales <em>de la tierra</em>
            </h1>
            <div className="hero-ref">Apocalipsis 14:1-12 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"   && <TabInicio teacherMode={teacherMode} />}
            {tab === "miller"   && <TabMiller openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "simbolos" && <TabSimbolos teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "angeles"  && <TabAngeles />}
            {tab === "fe"       && <TabFe openExpand={openExpand} toggleExpand={toggleExpand} />}
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
