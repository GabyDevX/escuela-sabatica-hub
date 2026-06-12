import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Heart, CloudLightning, HeartPulse, Compass
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#04090f;--bg2:#071520;--bg3:#0c2030;--surf:#102b40;--surf2:#163b56;--brd:#1f4a64;--brd2:#2d6c8f;--tx:#e6f1f7;--tx2:#8fb5c9;--tx3:#53778c;--acc:#0ea5b8;--acc2:#38d6e8;--acc3:#bdf3fa;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#f59e0b;--warn-d:rgba(245,158,11,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#0a2433 0%,#071520 55%,#04090f 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(14,165,184,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(14,165,184,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(14,165,184,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,184,.3) 30%,rgba(14,165,184,.3) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:40px;min-height:56px;padding:.6rem .2rem .5rem;font-size:.42rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:18px;height:18px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(14,165,184,.08);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(14,165,184,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(245,158,11,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(14,165,184,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(14,165,184,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(14,165,184,.07),rgba(14,165,184,.02));border:1px solid rgba(14,165,184,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(14,165,184,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(14,165,184,.10),rgba(14,165,184,.03));border:1px solid rgba(14,165,184,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(14,165,184,.10),rgba(14,165,184,.02));border:1.5px solid rgba(14,165,184,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
  { time: "00–03 min", title: "Bienvenida: «Dios me estaba tomando fotos»", desc: "Contar brevemente la historia de la joven que sonreía al cielo con cada relámpago (intro de la semana). Preguntar: ¿bajamos la cabeza ante las tormentas de la vida, o miramos al cielo? Conectar: esta semana veremos cómo Jesús actúa en medio de los reveses." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración. Orar pidiendo confianza para atravesar tormentas y reveses sin perder de vista el carácter de Dios." },
  { time: "05–13 min", title: "Tab Tormenta — Marcos 4:35-41", desc: "Recorrer los 4 puntos de la travesía. Énfasis: Jesús sugirió el viaje sabiendo que venía la tormenta; los discípulos expertos no pudieron salvarse solos. Preguntar: ¿qué lecciones aprendemos sobre la mejor manera de navegar las tormentas de la vida?" },
  { time: "13–20 min", title: "Tab Sanidad — Marcos 5:25-34", desc: "Desarrollar la historia de la mujer con doce años de reveses. Usar la tabla de contraste 'Bajar la cabeza vs. Mirar al cielo'. Preguntar: además de sanarla físicamente, ¿cómo restauró Jesús a esta mujer como persona?" },
  { time: "20–25 min", title: "Tab Avance — Lucas 24:13-35 (camino a Emaús)", desc: "Explorar cómo dos discípulos desanimados vieron, de repente, el plan perfecto de Dios donde antes solo veían tragedia. Conectar con Isaías 61:3: Dios saca belleza de las cenizas. Preguntar: ¿qué revés de tu vida hoy podría ser, en realidad, un avance?" },
  { time: "25–28 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Pausar especialmente en la pregunta 3 (la fe de la mujer) y la pregunta 6 (Emaús). Son los dos momentos más aplicables de la lección." },
  { time: "28–30 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Leer en voz alta el texto 'Para tu vida'. Invitar a una oración personal en silencio: pedirle a Dios ayuda para mirar al cielo —y no bajar la cabeza— en la próxima tormenta." },
];

const TORMENTA_DATA = [
  {
    key: "tm1", badge: "Marcos 4:35-36",
    name: "1. La invitación a cruzar",
    body: "Al anochecer, después de un largo día enseñando a las multitudes, Jesús invitó a sus discípulos: «Vamos al otro lado del lago». Jesús sabía que se avecinaba una tormenta, pero aun así sugirió el viaje. Tenía una lección de vida importante que enseñarles a sus seguidores más cercanos — una lección que solo podían aprender en medio de la tempestad."
  },
  {
    key: "tm2", badge: "Marcos 4:37-38",
    name: "2. Jesús dormido en la popa",
    body: "Se desató una fuerte tempestad y las olas comenzaron a llenar la barca de agua. Jesús, mientras tanto, dormía sobre la única almohada de la embarcación — probablemente el asiento del timonel, en la popa. Este es el único relato de los Evangelios que menciona que Jesús dormía. En una de las peores tormentas de sus vidas, con los discípulos aterrorizados pensando que iban a morir, Jesús descansaba en paz."
  },
  {
    key: "tm3", badge: "Marcos 4:38",
    name: "3. «¿No te importa?»",
    body: "Pedro, Andrés, Santiago y Juan eran pescadores experimentados que conocían el mar de Galilea como la palma de su mano y sabían qué hacer en una tormenta. Aun así, esta vez no fue suficiente. Despertaron a Jesús con una acusación: «¿No te importa que perezcamos?». Cuestionaron su carácter y su amor por ellos — la misma respuesta que muchas veces damos nosotros en los momentos difíciles."
  },
  {
    key: "tm4", badge: "Marcos 4:39-41",
    name: "4. Calma con una palabra",
    body: "Jesús se levantó, reprendió al viento y dijo al mar: «Calla, enmudece». Y se hizo grande bonanza. Luego les preguntó: «¿Por qué estáis así amedrentados? ¿Cómo no tenéis fe?». Los discípulos se llenaron de gran temor, asombrados de quién era realmente Aquel que estaba con ellos en la barca. Es en las tormentas de la vida cuando Dios puede obrar los milagros más grandes."
  },
];

const SANIDAD_DATA = [
  {
    key: "sn1", badge: "Marcos 5:25-27",
    name: "Doce años de reveses",
    body: "Entre la multitud que rodeaba a Jesús cerca de Capernaúm había una mujer que llevaba doce años enferma. Había gastado todo su dinero en médicos, «sin que le hubiera servido de nada. Al contrario, iba de mal en peor» (Marcos 5:26). Doce años de constantes reveses, de esperanzas frustradas, de puertas cerradas. Aun así, había oído hablar de Jesús y reunió las pocas fuerzas que le quedaban para salir esa mañana."
  },
  {
    key: "sn2", badge: "Marcos 5:28",
    name: "«Si logro tocar siquiera su manto»",
    body: "La presión de la multitud era casi sofocante mientras la mujer se acercaba poco a poco a Jesús. Entre empujones y jaloneos, lo vio y se animó a sí misma: «Si logro tocar siquiera su manto, quedaré sana» (Marcos 5:28, NVI). No se quedó en su casa esperando que las cosas mejoraran solas — deliberadamente, y creyendo, se acercó a Jesús con esperanza."
  },
  {
    key: "sn3", badge: "Marcos 5:30-34",
    name: "El toque de la fe",
    body: "Cuando la mujer tocó el borde del manto de Jesús, su vida cambió para siempre. No solo fue sanada físicamente: Jesús la recibió, temblando de miedo, recompensó su fe, la impulsó a contar su historia y le devolvió la confianza. «El Salvador podía distinguir el toque de la fe del contacto casual de la muchedumbre desprevenida» (Elena G. de White, El Deseado de todas las gentes, cap. 36, p. 317). No fue el manto lo que la sanó, sino su fe."
  },
  {
    key: "sn4", badge: "Mateo 11:28-29",
    name: "La invitación de Jesús hoy",
    body: "No importa cuántos reveses hayamos sufrido, Jesús nos exhorta hoy a imitar a esta mujer. Nos invita así: «Vengan a mí todos ustedes que están cansados de sus trabajos y cargas, y yo los haré descansar. Acepten el yugo que les pongo, y aprendan de mí, que soy paciente y de corazón humilde; así encontrarán descanso» (Mateo 11:28-29). Verlo a la distancia no es suficiente — hay que acercarse a él."
  },
];

const COMPARE_CABEZA = [
  "Culpar a Dios por lo que está pasando",
  "Cuestionar su carácter: «¿No te importa?»",
  "Intentar resolverlo todo a solas",
  "Quedarse en cama, resignado al revés",
  "Suponer que Dios debería actuar distinto",
  "Ver solo la tragedia, sin más historia detrás",
];

const COMPARE_CIELO = [
  "Confiar en el carácter de Dios aun sin entender",
  "Recordar cómo Dios nos ha guiado antes",
  "Acercarse a Jesús con fe, aunque cueste",
  "Salir, aunque queden pocas fuerzas, como la mujer",
  "Saber que él está obrando algo más grande",
  "Ver el plan divino detrás del aparente revés",
];

const AVANCE_DATA = [
  {
    key: "av1", badge: "Lucas 24:13-21",
    name: "El mayor revés de sus vidas",
    body: "Cuando Jesús murió en la cruz, sus seguidores quedaron atónitos, desanimados y confundidos. Dos discípulos caminaban hacia Emaús hablando sobre lo ocurrido. Sus esperanzas y sueños se habían desmoronado: Aquel que esperaban como rey de Israel había sido crucificado (Lucas 24:21). Para ellos, no era solo un revés personal, sino un golpe devastador para toda la nación."
  },
  {
    key: "av2", badge: "Lucas 24:15-16, 25-27",
    name: "Un desconocido abre las Escrituras",
    body: "Un desconocido se unió a ellos en el camino y entabló conversación. Era Jesús, pero algo les impidió reconocerlo. A pesar de no saber con quién hablaban, sus corazones se conmovieron profundamente cuando él abrió las Escrituras —Moisés, los Salmos y los profetas— y les explicó el significado de los acontecimientos que tanto los habían decepcionado."
  },
  {
    key: "av3", badge: "Lucas 24:31-35, 38",
    name: "Lo que parecía revés era avance",
    body: "Al descubrir un nuevo significado en las palabras de los profetas, los discípulos se dieron cuenta de que los acontecimientos que parecían sin sentido y trágicos eran, en realidad, parte crucial del plan divino. Se apresuraron a contarlo a los demás. Cuando Jesús apareció entre ellos, preguntó: «¿Por qué están asustados? ¿Por qué tienen esas dudas en su corazón?» (Lucas 24:38). Ese es también su mensaje para nosotros hoy."
  },
  {
    key: "av4", badge: "Isaías 61:3",
    name: "Belleza en lugar de cenizas",
    body: "Con Jesús, nuestros mayores reveses pueden convertirse en nuestros mayores avances. Las cosas que a nosotros nos parecen tan inútiles y trágicas no toman por sorpresa a Dios. Dios saca belleza de nuestras cenizas (Isaías 61:3). Jesús convierte en victorias las aparentes derrotas — aunque, como los discípulos de Emaús, nos lleve tiempo entenderlo."
  },
];

const VERSES = [
  {
    ref: "Marcos 4:37-40", isBase: true,
    text: `37 Pero se levantó una gran tempestad de viento, y echaba olas en la barca, de tal manera que ya se anegaba. 38 Y él estaba en la popa, durmiendo sobre un cabezal; y le despertaron, y le dijeron: Maestro, ¿no te importa que perezcamos? 39 Y levantándose, calmó el viento, y dijo al mar: Calla, enmudece. Y cesó el viento, y se hizo grande bonanza. 40 Y a ellos dijo: ¿Por qué estáis así amedrentados? ¿Cómo no tenéis fe?`
  },
  {
    ref: "Marcos 4:35-36",
    text: `35 Aquel día, cuando llegó la noche, les dijo: Pasemos al otro lado. 36 Y despachando a la multitud, entraron en la barca con él; y había también con él otras barcas.`
  },
  {
    ref: "Marcos 4:41",
    text: `Y temieron con gran temor, y se decían el uno al otro: ¿Quién es éste, que aun el viento y el mar le obedecen?`
  },
  {
    ref: "Marcos 5:25-29",
    text: `25 Pero una mujer que padecía de flujo de sangre desde hacía doce años, 26 y había gastado todo lo que tenía en médicos, sin que ninguno pudiera curarla, antes bien iba de mal en peor, 27 cuando oyó hablar de Jesús, se acercó por detrás entre la multitud, y tocó su manto; 28 porque decía: Si tocare tan solamente su manto, seré salva. 29 Y luego la fuente de su sangre se secó; y sintió en su cuerpo que estaba sana de aquel azote.`
  },
  {
    ref: "Marcos 5:30-34",
    text: `30 Luego Jesús, conociendo en sí mismo que había salido de él poder, volviéndose a la multitud, dijo: ¿Quién ha tocado mis vestidos? 31 Y le dijeron sus discípulos: Ves que la multitud te aprieta, y dices: ¿Quién me ha tocado? 32 Pero él miraba alrededor para ver quién había hecho esto. 33 Entonces la mujer, temiendo y temblando, sabiendo lo que en ella había sido hecho, vino y se postró delante de él, y le dijo toda la verdad. 34 Y él le dijo: Hija, tu fe te ha hecho salva; ve en paz, y queda sana de tu azote.`
  },
  {
    ref: "Mateo 11:28-29",
    text: `28 Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. 29 Llevad mi yugo sobre vosotros, y aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas.`
  },
  {
    ref: "2 Corintios 5:7",
    text: `Porque por fe andamos, no por vista.`
  },
  {
    ref: "Job 1:18-19",
    text: `18 Entre tanto que este hablaba, vino otro que dijo: Tus hijos y tus hijas estaban comiendo y bebiendo vino en casa de su hermano el mayor; 19 y un viento del desierto vino y dio en las cuatro esquinas de la casa, y cayó sobre los jóvenes, y murieron; y solo yo escapé para traerte las nuevas.`
  },
  {
    ref: "Job 2:9-10",
    text: `9 Le dijo entonces su mujer: ¿Aún retienes tu integridad? Maldice a Dios, y muere. 10 Y él le dijo: Como habla cualquiera de las mujeres necias, has hablado. ¿Recibiremos el bien, y el mal no lo recibiremos? En todo esto no pecó Job con sus labios.`
  },
  {
    ref: "Isaías 55:8-9",
    text: `8 Porque mis pensamientos no son vuestros pensamientos, ni vuestros caminos mis caminos, dijo Jehová. 9 Como son más altos los cielos que la tierra, así son mis caminos más altos que vuestros caminos, y mis pensamientos más que vuestros pensamientos.`
  },
  {
    ref: "Romanos 8:18, 28",
    text: `18 Pues tengo por cierto que las aflicciones del tiempo presente no son comparables con la gloria venidera que en nosotros ha de manifestarse. ... 28 Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.`
  },
  {
    ref: "2 Corintios 12:9-10",
    text: `9 Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad. Por tanto, de buena gana me gloriaré en mis debilidades, para que repose sobre mí el poder de Cristo. 10 Por lo cual, por amor a Cristo me gozo en las debilidades, en afrentas, en necesidades, en persecuciones, en angustias; porque cuando soy débil, entonces soy fuerte.`
  },
  {
    ref: "Romanos 5:3-5",
    text: `3 Y no solo esto, sino que también nos gloriamos en las tribulaciones, sabiendo que la tribulación produce paciencia; 4 y la paciencia, prueba; y la prueba, esperanza; 5 y la esperanza no avergüenza; porque el amor de Dios ha sido derramado en nuestros corazones por el Espíritu Santo que nos fue dado.`
  },
  {
    ref: "Santiago 1:2-4, 12",
    text: `2 Hermanos míos, tened por sumo gozo cuando os hallareis en diversas pruebas, 3 sabiendo que la prueba de vuestra fe produce paciencia. 4 Mas tenga la paciencia su obra completa, para que seáis perfectos y cabales, sin que os falte cosa alguna. ... 12 Bienaventurado el varón que soporta la tentación; porque cuando haya resistido la prueba, recibirá la corona de vida, que Dios ha prometido a los que le aman.`
  },
  {
    ref: "1 Pedro 1:6-7",
    text: `6 En lo cual vosotros os alegráis, aunque ahora por un poco de tiempo, si es necesario, seáis afligidos en diversas pruebas, 7 para que sometida a prueba vuestra fe, mucho más preciosa que el oro, el cual aunque perecedero se prueba con fuego, sea hallada en alabanza, gloria y honra cuando sea manifestado Jesucristo.`
  },
  {
    ref: "Salmo 34:18-19",
    text: `18 Cercano está Jehová a los quebrantados de corazón, y salva a los contritos de espíritu. 19 Muchas son las aflicciones del justo, pero de todas ellas le librará Jehová.`
  },
  {
    ref: "2 Corintios 4:16-18",
    text: `16 Por tanto, no desmayamos; antes aunque este nuestro hombre exterior se va desgastando, el interior no obstante se renueva de día en día. 17 Porque esta leve tribulación momentánea produce en nosotros un cada vez más excelente y eterno peso de gloria; 18 no mirando nosotros las cosas que se ven, sino las que no se ven; pues las que se ven son temporales, pero las que no se ven son eternas.`
  },
  {
    ref: "Filipenses 4:8-13",
    text: `8 Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable, todo lo que es de buen nombre; si hay virtud alguna, si algo digno de alabanza, en esto pensad. ... 13 Todo lo puedo en Cristo que me fortalece.`
  },
  {
    ref: "Lucas 24:13-21",
    text: `13 Y he aquí, dos de ellos iban el mismo día a una aldea llamada Emaús... 17 Y les dijo: ¿Qué cosas son las que tratáis entre vosotros mientras camináis, y por qué estáis tristes? 21 Pero nosotros esperábamos que él era el que había de redimir a Israel.`
  },
  {
    ref: "Lucas 24:25-27",
    text: `25 Entonces él les dijo: ¡Oh insensatos, y tardos de corazón para creer todo lo que los profetas han dicho! 26 ¿No era necesario que el Cristo padeciera estas cosas, y que entrara en su gloria? 27 Y comenzando por Moisés, y siguiendo por todos los profetas, les declaraba en todas las Escrituras lo que de él decían.`
  },
  {
    ref: "Lucas 24:32-35",
    text: `32 Y se decían el uno al otro: ¿No ardía nuestro corazón en nosotros, mientras nos hablaba en el camino, y cuando nos abría las Escrituras? 33 Y levantándose en la misma hora, volvieron a Jerusalén, y hallaron a los once reunidos... 35 y de cómo les había sido conocido al partir el pan.`
  },
  {
    ref: "Lucas 24:38",
    text: `Y él les dijo: ¿Por qué estáis turbados, y vienen a vuestro corazón estos pensamientos?`
  },
  {
    ref: "Isaías 61:3",
    text: `A ordenar que a los afligidos de Sion se les dé gloria en lugar de ceniza, óleo de gozo en lugar de luto, manto de alegría en lugar de espíritu angustiado; y serán llamados árboles de justicia, plantío de Jehová, para gloria suya.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Por qué Jesús sugirió cruzar el lago aun sabiendo que se acercaba una tormenta (Marcos 4:35-38)?",
    opts: [
      "Quería poner a prueba la valentía de los discípulos pescadores",
      "No sabía que vendría la tormenta y se dejó sorprender",
      "Tenía una lección de vida importante que enseñarles, que solo podían aprender en la tempestad",
      "Quería llegar rápido al otro lado antes de que oscureciera"
    ],
    ans: 2,
    feedback: "Jesús sabía que se avecinaba una tormenta, pero aun así sugirió el viaje. Tenía una importante lección de vida que enseñar a sus seguidores más cercanos — una lección que solo podían aprender en medio de la tempestad."
  },
  {
    q: "¿Qué tiene de especial el hecho de que Jesús estuviera dormido durante la tormenta (Marcos 4:38)?",
    opts: [
      "Es el único relato de los Evangelios que menciona que Jesús dormía",
      "Demuestra que Jesús estaba cansado por haber sanado a muchas personas",
      "Los discípulos lo habían drogado sin que él lo supiera",
      "Era una señal de que Jesús no confiaba en sus discípulos"
    ],
    ans: 0,
    feedback: "Este es el único relato de los Evangelios que menciona que Jesús dormía. Durante una de las peores tormentas de su vida, cuando los discípulos estaban aterrorizados, Jesús dormía en paz en la popa, probablemente sobre el cabezal del timonel."
  },
  {
    q: "¿Qué fue, en realidad, lo que sanó a la mujer del flujo de sangre (Marcos 5:34)?",
    opts: [
      "El poder especial que tenía el manto de Jesús",
      "Su fe, y su decisión de acercarse a tocarlo",
      "Los doce años de tratamientos médicos que finalmente dieron resultado",
      "La compasión de la multitud que le abrió paso"
    ],
    ans: 1,
    feedback: "«El Salvador podía distinguir el toque de la fe del contacto casual de la muchedumbre desprevenida» (E.G. de White). El manto de Jesús no tenía ningún poder especial. Lo que la sanó fueron su fe y su decisión de acercarse a tocarlo."
  },
  {
    q: "Además de sanarla físicamente, ¿qué más hizo Jesús por la mujer (Marcos 5:33-34)?",
    opts: [
      "Le ordenó que no contara a nadie lo que había sucedido",
      "La envió de inmediato a presentarse ante los sacerdotes",
      "La recibió con compasión, recompensó su fe y le devolvió la confianza ante todos",
      "Le pidió que pagara una ofrenda por su sanidad"
    ],
    ans: 2,
    feedback: "Jesús recibió a una mujer tímida, «temblando de miedo», y recompensó su fe: la impulsó a contar su historia y le devolvió la confianza. La sanidad física fue solo una parte de una restauración mucho más profunda."
  },
  {
    q: "Según el relato de Job, ¿cómo respondieron sus tres amigos ante su sufrimiento?",
    opts: [
      "Lo ayudaron a reconstruir su patrimonio perdido",
      "Permanecieron en silencio siete días y luego le ofrecieron palabras de consuelo",
      "Trataron de ofrecer razones humanas, culpándolo de algún pecado oculto",
      "Convencieron a Job de maldecir a Dios, tal como sugería su esposa"
    ],
    ans: 2,
    feedback: "Cuando finalmente hablaron, los tres amigos trataron de ofrecer razones humanas para explicar la desgracia de Job y, sin querer, aumentaron su sufrimiento, diciendo que debía de tener algún pecado oculto del que arrepentirse."
  },
  {
    q: "¿Por qué los discípulos del camino a Emaús no reconocieron a Jesús al principio (Lucas 24:15-16)?",
    opts: [
      "Porque Jesús llevaba un disfraz para no ser identificado",
      "Porque algo se lo impidió, y solo lo reconocieron al partir el pan",
      "Porque hacía mucho tiempo que no veían a Jesús en persona",
      "Porque estaba muy oscuro y no podían verle el rostro"
    ],
    ans: 1,
    feedback: "Lucas dice que «sus ojos estaban velados para que no le conociesen» (Lucas 24:16). A pesar de no saber con quién hablaban, sus corazones ardían mientras Jesús les abría las Escrituras — y lo reconocieron al partir el pan."
  },
  {
    q: "Según Isaías 61:3, ¿qué promete Dios dar a los afligidos en lugar de ceniza?",
    opts: [
      "Gloria, óleo de gozo y manto de alegría",
      "Riquezas materiales y una larga vida",
      "Una explicación inmediata de por qué sufrieron",
      "El olvido total de lo que sufrieron"
    ],
    ans: 0,
    feedback: "«A ordenar que a los afligidos de Sion se les dé gloria en lugar de ceniza, óleo de gozo en lugar de luto, manto de alegría en lugar de espíritu angustiado» (Isaías 61:3). Dios saca belleza de nuestras cenizas — convierte los reveses en avances."
  },
  {
    q: "Según 2 Corintios 12:9-10, ¿cuándo dice Pablo que es más fuerte?",
    opts: [
      "Cuando tiene éxito en su ministerio y todo marcha bien",
      "Cuando es débil, porque entonces el poder de Cristo se perfecciona en él",
      "Cuando logra superar sus debilidades por su propio esfuerzo",
      "Cuando los demás reconocen públicamente su autoridad apostólica"
    ],
    ans: 1,
    feedback: "«De buena gana me gloriaré en mis debilidades, para que repose sobre mí el poder de Cristo... porque cuando soy débil, entonces soy fuerte» (2 Corintios 12:9-10). La gracia de Dios se perfecciona, precisamente, en nuestra debilidad."
  },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Qué lecciones podemos aprender de los discípulos sobre la mejor manera de navegar las tormentas de la vida?", ref: "Marcos 4:35-41" },
  { key: "rfl2", q: "¿Qué nos enseña esta historia sobre confiar en Dios incluso cuando parece que está ausente o no interviene?", ref: "Marcos 4:38-40" },
  { key: "rfl3", q: "Además de sanarla físicamente, ¿cómo restauró Jesús a una mujer que había sufrido doce años de reveses?", ref: "Marcos 5:25-34" },
  { key: "rfl4", q: "¿Cómo fue que dos discípulos desanimados vieron, de repente, el plan perfecto de Dios donde antes solo veían una tragedia sin sentido?", ref: "Lucas 24:13-27" },
  { key: "rfl5", q: "¿Qué promesa bíblica te parece especialmente significativa cuando enfrentas decepciones y frustraciones?", ref: "Romanos 8:18, 28 · Isaías 61:3" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Reveses <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>de la vida</em></div>
      <div className="sec-sub">Undécima Semana · Marcos 4:35–5:43</div>

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
            <p>«¿Bajamos la cabeza mientras la lluvia nos golpea la espalda, o miramos al cielo, sabiendo que Dios está ahí cuando volvemos el rostro hacia él?» Esta semana, a través de Marcos 4–5, veremos cómo Jesús calmó una tormenta literal y restauró a una mujer que sufría reveses desde hacía doce años. Descubriremos que, con Jesús, nuestros mayores reveses pueden convertirse en nuestros mayores avances.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Marcos 4:39-40
            </div>
            <div className="honey-text">
              «Y levantándose, calmó el viento, y dijo al mar: Calla, enmudece. Y cesó el viento, y se hizo grande bonanza. Y a ellos dijo: ¿Por qué estáis así amedrentados? ¿Cómo no tenéis fe?»
            </div>
            <div className="honey-ref">Marcos 4:39-40 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Podemos confiar en Dios en las mayores tormentas</strong> — incluso cuando sentimos que está dormido o ausente.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>A Jesús le place sanar y restaurar</strong> — sobre todo a quienes han sufrido los reveses más devastadores, como la mujer de doce años de enfermedad.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Las pruebas más difíciles desarrollan el carácter</strong> y nos ayudan a tener una relación aún más cercana con Dios.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabTormenta({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Tormenta</div>
      <div className="sec-sub">La travesía de Marcos 4:35-41</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>Jesús había pasado el día hablando a una gran multitud a orillas del mar de Galilea. Al anochecer, invitó a sus discípulos a cruzar al otro lado. Sabía que venía una tormenta — y aun así, sugirió ir.</p>
      </div>

      {TORMENTA_DATA.map(item => (
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
        <p>¿Cuál es tu respuesta habitual cuando enfrentas una tormenta en tu vida? ¿Cuánto afectan esos momentos a tu relación con Dios?</p>
      </div>
    </>
  );
}

function TabSanidad({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Sanidad</div>
      <div className="sec-sub">«Si logro tocar siquiera su manto, quedaré sana» — Marcos 5:25-34</div>

      {SANIDAD_DATA.map(item => (
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
        <div className="card-label" style={{ padding: "0 .25rem .5rem" }}>Bajar la cabeza vs. mirar al cielo</div>
        <div className="compare-grid">
          <div className="compare-col">
            <div className="compare-header red">Bajar la cabeza</div>
            <div className="compare-cell">
              {COMPARE_CABEZA.map((item, i) => (
                <div key={i} className="compare-item">{item}</div>
              ))}
            </div>
          </div>
          <div className="compare-col">
            <div className="compare-header ok">Mirar al cielo</div>
            <div className="compare-cell">
              {COMPARE_CIELO.map((item, i) => (
                <div key={i} className="compare-item">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El ministerio de curación, cap. 40, p. 340</div>
        <div className="egw-text">«En la vida futura, se aclararán los misterios que aquí nos han preocupado y chasqueado. <strong>Veremos que las oraciones que nos parecían desatendidas y las esperanzas defraudadas estuvieron entre nuestras mayores bendiciones.</strong>»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 36, p. 317</div>
        <div className="egw-text">«El Salvador podía distinguir el toque de la fe <strong>del contacto casual de la muchedumbre desprevenida.</strong> No fue el manto lo que la sanó a la mujer, fueron su fe y su decisión de acercarse a tocarlo.»</div>
      </div>
    </>
  );
}

function TabAvance({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Avance</div>
      <div className="sec-sub">Lo que parece revés, es en realidad un avance — Lucas 24:13-35</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>Los pequeños reveses que sufrieron los discípulos en el camino tenían como objetivo fortalecer su fe para que pudieran soportar la mayor decepción de todas: la muerte de Jesús en la cruz.</p>
      </div>

      {AVANCE_DATA.map(item => (
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
        <p>¿Cuáles han sido los mayores reveses de tu vida? ¿Qué lecciones has aprendido de esas experiencias? ¿Podrías ahora ver en ellos un avance que antes no veías?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien cómo Dios actúa en medio de los reveses." :
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
        <div className="card-label">Puntos clave · Marcos 4:35–5:43</div>
        <p>Podemos aprender a confiar en Dios en las mayores tormentas de la vida, incluso cuando sentimos que él está ausente. A Jesús le place sanar y restaurar, sobre todo a los que han sufrido los reveses más devastadores. Las pruebas más difíciles de la vida pueden desarrollar el carácter y ayudarnos a tener una relación aún más cercana con Dios.</p>
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
          <p>Piensa en el revés más reciente que viviste: una respuesta que no llegó, una puerta que se cerró, una relación que se rompió a pesar de tu esfuerzo. ¿Qué hiciste con eso? ¿Bajaste la cabeza, o miraste al cielo?</p>
          <br />
          <p>Los discípulos en la tormenta gritaron «¿no te importa?» — y Jesús, sin reprocharles nada, simplemente se levantó y calmó el mar. La mujer enferma llevaba doce años de reveses, y aun así reunió fuerzas para acercarse. <strong>Ninguno de los dos esperó tener todas las respuestas antes de actuar con fe.</strong></p>
          <br />
          <p>Los discípulos de Emaús caminaron kilómetros con el corazón roto, sin saber que Jesús mismo iba a su lado. Lo que parecía el final de la historia era, en realidad, el comienzo de algo mucho más grande.</p>
          <br />
          <p>Esta semana, cuando llegue la próxima tormenta —y llegará— recuerda: Dios sigue en la barca, aunque parezca dormido. Y lo que hoy parece un revés, en sus manos, puede convertirse en tu mayor avance.</p>
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
    { id: "inicio",   label: "Inicio",   Icon: Home },
    { id: "tormenta", label: "Tormenta", Icon: CloudLightning },
    { id: "sanidad",  label: "Sanidad",  Icon: HeartPulse },
    { id: "avance",   label: "Avance",   Icon: Compass },
    { id: "biblia",   label: "Biblia",   Icon: BookOpen },
    { id: "quiz",     label: "Quiz",     Icon: HelpCircle },
    { id: "cierre",   label: "Cierre",   Icon: Flame },
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
              InVerso · Semana 11
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Reveses <em>de la vida</em>
            </h1>
            <div className="hero-ref">Marcos 4:35–5:43 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"   && <TabInicio teacherMode={teacherMode} />}
            {tab === "tormenta" && <TabTormenta openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "sanidad"  && <TabSanidad openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "avance"   && <TabAvance openExpand={openExpand} toggleExpand={toggleExpand} />}
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
