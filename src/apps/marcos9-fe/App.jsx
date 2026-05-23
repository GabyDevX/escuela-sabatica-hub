import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, Layers,
  Users, HelpCircle, Shield
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0e0804;--bg2:#170d06;--bg3:#201309;--surf:#2a1a0c;--surf2:#342010;--brd:#432c18;--brd2:#5c3e22;--tx:#f5ecd8;--tx2:#b89060;--tx3:#786040;--acc:#d9683c;--acc2:#ea804e;--acc3:#f5a878;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#f59e0b;--warn-d:rgba(245,158,11,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1c0e06 0%,#0e0804 55%,#090504 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(217,104,60,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.85rem;font-weight:700;line-height:1.18;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(217,104,60,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(217,104,60,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(217,104,60,.3) 30%,rgba(217,104,60,.3) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:44px;min-height:56px;padding:.6rem .28rem .5rem;font-size:.46rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.03em;text-transform:uppercase}
.nav button svg{width:19px;height:19px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:14%;right:14%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(217,104,60,.08);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(217,104,60,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(245,158,11,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(217,104,60,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(217,104,60,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(217,104,60,.07),rgba(217,104,60,.02));border:1px solid rgba(217,104,60,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(217,104,60,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(217,104,60,.10),rgba(217,104,60,.03));border:1px solid rgba(217,104,60,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(217,104,60,.10),rgba(217,104,60,.02));border:1.5px solid rgba(217,104,60,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}
.key-list{list-style:none;padding:0;margin-bottom:.85rem}
.key-list li{display:flex;gap:.7rem;align-items:flex-start;padding:.6rem 0;border-bottom:1px solid var(--brd)}
.key-list li:last-child{border-bottom:none}
.key-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:.55rem}
.key-text{font-size:.97rem;line-height:1.6;color:var(--tx2)}
.key-text strong{color:var(--tx)}
.casos-group{margin-bottom:1.4rem}
.casos-head{display:flex;align-items:center;gap:.65rem;padding:.65rem .9rem;border-radius:10px;margin-bottom:.55rem}
.casos-head-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.casos-head-info{flex:1}
.casos-head-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;line-height:1.2}
.casos-head-sub{font-family:'IBM Plex Mono',monospace;font-size:.54rem;letter-spacing:.05em;margin-top:.12rem;opacity:.7}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: ¿Cómo está tu wifi espiritual?", desc: "Preguntá: ¿Hay alguna área de tu vida donde tu fe está débil o tambaleó últimamente? Escuchar 2-3 respuestas. Conectar con la ilustración: la fe es como el wifi — invisible, pero tiene el poder de conectarte con lo que necesitás." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos. Orar pidiendo que Dios aumente la fe de cada uno, igual que el padre de Marcos 9 — con honestidad y sin pretender tener más fe de la que se tiene." },
  { time: "05–13 min", title: "Tab Fe y Duda — Cinco conceptos clave", desc: "Explorar los 5 conceptos. Énfasis en: (1) fe y duda pueden coexistir — nadie debe alejarse de Dios por tener dudas; (2) fe ≠ sentimiento — es una decisión; (3) la fe de Jesús es algo recibido, no producido. Preguntá: ¿Cuándo fue la última vez que tu fe fue contraria a lo que sentías?" },
  { time: "13–19 min", title: "Tab Casos — Investigación bíblica comparada", desc: "Recorrer los tres grupos de pasajes. Invitar a identificar el patrón en cada grupo. Énfasis en el contraste: los mismos discípulos que tuvieron poca fe en la tormenta también caminaron sobre el agua y movieron montañas. La fe puede crecer — y también debilitarse si no se cultiva." },
  { time: "19–24 min", title: "Quiz interactivo", desc: "Hacer las 7 preguntas en conjunto. Pausar en pregunta 2 (Hebreos 11:1, definición de fe) y pregunta 3 (Romanos 10:17, fuente de la fe) — son los cimientos teológicos de toda la lección." },
  { time: "24–27 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Enfocarse en: ¿Con qué parte de esta historia te identificás más? ¿En qué basás concretamente tu fe? Leer el texto Para tu vida en voz alta." },
  { time: "27–30 min", title: "Oración de cierre", desc: "Invitar a quienes lo deseen a hacer suya la oración del padre: «Creo; ayuda mi incredulidad» (Mr 9:24). No escribir la oración — hacerla en vivo con el grupo." },
];

const FE_CONCEPTOS = [
  {
    key: "f1", badge: "Hebreos 11:1",
    name: "¿Qué es la fe?",
    body: "«Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve» (He 11:1). No es un sentimiento, ni algo que generamos por nosotros mismos. Pablo escribe que Dios reparte «a cada uno una medida de fe» (Ro 12:3) — es un don. La fe no depende de ver señales; depende de confiar en quién es Dios y lo que ya ha revelado en su Palabra y en la historia."
  },
  {
    key: "f2", badge: "Marcos 9:24",
    name: "Fe y duda pueden coexistir",
    body: "El padre del muchacho endemoniado dijo: «Creo; ayuda mi incredulidad» (Mr 9:24). Jesús no lo rechazó por su duda — actuó de todas formas. Nadie debería alejarse de Dios porque tiene preguntas. La duda no cancela la fe; a veces es el punto de partida para que crezca. Lo que importa no es la ausencia de duda, sino hacia dónde te dirigís con ella."
  },
  {
    key: "f3", badge: "Hebreos 10:23",
    name: "La fe es dinámica, no estática",
    body: "La fe puede fortalecerse o debilitarse. Los propios discípulos tuvieron fe débil incluso después de la resurrección (Mr 16:13-14). Pablo los instó: «Examínense a sí mismos si están firmes en la fe» (2 Co 13:5). La comodidad espiritual es un peligro real — la fe que no se nutre se deteriora. Quienes dependen de la fe prestada de otro la pierden en la primera crisis (ver Mt 25:8)."
  },
  {
    key: "f4", badge: "Romanos 10:17",
    name: "Fe no es sentimiento",
    body: "Muchos creen que no tienen fe porque no la sienten. Pero la fe no depende de una emoción intensa — se basa en la Palabra de Dios (Ro 10:17). Elena G. de White escribió: «Muchos no ejercitan la fe que es su privilegio y deber ejercitar, y a menudo esperan aquel sentimiento íntimo que solo la fe puede dar. El sentimiento de por sí no es fe» (Primeros escritos, cap. 17, p. 103). Creer es una decisión deliberada, a veces contraria al sentimiento."
  },
  {
    key: "f5", badge: "Apocalipsis 14:12",
    name: "La fe de Jesús",
    body: "El pueblo de Dios en los últimos días guarda los mandamientos y tiene «la fe de Jesús» (Ap 14:12). Tener la fe de Jesús significa imitar su confianza total en el Padre — una fe que no se derrumba bajo presión extrema, como en Getsemaní (Mt 26:39). Es también una fe que no podemos producir solos; la recibimos de él. «A veces nuestra fe puede ser débil; con todo, Jesús es digno» (Ap 5:9) y podemos recibir su fe como don de gracia."
  },
];

const CASOS_DATA = [
  {
    key: "g1",
    title: "La incredulidad",
    sub: "Cuatro momentos de fe débil",
    colorHex: "#f43f5e",
    bgHex: "rgba(244,63,94,.10)",
    Icon: XCircle,
    items: [
      { ref: "Mateo 8:23-27", name: "La tormenta en el mar", desc: "Los discípulos estaban aterrados por la tormenta mientras Jesús dormía. Cuando lo despertaron, calmó el mar y les preguntó: «¿Por qué teméis, hombres de poca fe?» (Mt 8:26). Habían visto milagros, pero el miedo superó su fe en ese momento." },
      { ref: "Mateo 13:58", name: "Nazaret: sin fe, sin milagros", desc: "En su propia ciudad, Jesús «no hizo allí muchos milagros, a causa de la incredulidad de ellos» (Mt 13:58). La falta de fe de los nazarenos no anuló el poder de Jesús — pero sí limitó lo que él pudo hacer en ese lugar." },
      { ref: "Mateo 14:22-33", name: "Pedro camina sobre el agua", desc: "Pedro comenzó a caminar sobre el agua — un milagro increíble. Pero cuando vio el viento, se hundió. Jesús lo tomó de la mano: «¡Hombre de poca fe! ¿Por qué dudaste?» (Mt 14:31). La fe de Pedro empezó bien, pero no resistió la presión." },
      { ref: "Mateo 16:5-12", name: "La levadura de los fariseos", desc: "Los discípulos olvidaron pan y se preocuparon. Jesús les preguntó: «¿Cómo es que no entendéis?» (Mt 16:11). Habían visto multiplicarse los panes dos veces, ¡y aún así se inquietaban! El olvido espiritual debilita la fe." },
    ]
  },
  {
    key: "g2",
    title: "Una gran fe",
    sub: "Dos ejemplos que asombraron a Jesús",
    colorHex: "#10b981",
    bgHex: "rgba(16,185,129,.10)",
    Icon: CheckCircle,
    items: [
      { ref: "Mateo 8:5-13", name: "El centurión romano", desc: "Este oficial no era judío, pero reconoció la autoridad de Jesús: «Solamente di la palabra, y mi criado sanará» (Mt 8:8). Jesús se maravilló: «Ni aun en Israel he hallado tanta fe» (Mt 8:10). La fe genuina no depende del trasfondo religioso." },
      { ref: "Mateo 15:21-28", name: "La mujer cananea", desc: "Esta mujer gentil suplicó por su hija con una fe que no se rindió ante el silencio ni el rechazo aparente. Jesús la probó, y ella respondió con humildad y persistencia. La respuesta: «Oh mujer, grande es tu fe; hágase contigo como quieres» (Mt 15:28)." },
    ]
  },
  {
    key: "g3",
    title: "El poder de la fe",
    sub: "Lo que un grano de mostaza puede mover",
    colorHex: "#d9683c",
    bgHex: "rgba(217,104,60,.10)",
    Icon: Shield,
    items: [
      { ref: "Mateo 17:19-21", name: "¿Por qué nosotros no pudimos?", desc: "Los discípulos no pudieron sanar a un endemoniado. Jesús explicó: «Por vuestra poca fe; si tuviereis fe como un grano de mostaza, diréis a este monte: Pásate de aquí allá, y se pasará; y nada os será imposible» (Mt 17:20). La fe pequeña pero genuina es suficiente." },
      { ref: "Mateo 21:21-22", name: "Fe sin dudar", desc: "«Si tuviereis fe y no dudareis... si a este monte dijereis: Quítate y échate en el mar, será hecho» (Mt 21:21). El poder de la oración con fe genuina no tiene límites dentro de la voluntad de Dios. «Todo lo que pidiereis en oración, creyendo, lo recibiréis» (Mt 21:22)." },
    ]
  },
];

const VERSES = [
  { ref: "Marcos 9:22-24", isBase: true, text: `22 Y muchas veces le echa en el fuego y en el agua, para matarle; pero si algo puedes hacer, ten misericordia de nosotros, y ayúdanos. 23 Jesús le dijo: Si puedes creer, al que cree todo le es posible. 24 E inmediatamente el padre del muchacho clamó y dijo: Creo; ayuda mi incredulidad.` },
  { ref: "Hebreos 11:1", text: `Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.` },
  { ref: "Hebreos 11:6", text: `Pero sin fe es imposible agradar a Dios; porque es necesario que el que se acerca a Dios crea que le hay, y que es galardonador de los que le buscan.` },
  { ref: "Hebreos 10:23", text: `Mantengamos firme, sin fluctuar, la profesión de nuestra esperanza, porque fiel es el que prometió.` },
  { ref: "Romanos 10:17", text: `Así que la fe es por el oír, y el oír, por la palabra de Dios.` },
  { ref: "Romanos 12:3", text: `Digo, pues, por la gracia que me es dada, a cada cual que está entre vosotros, que no tenga más alto concepto de sí que el que debe tener, sino que piense de sí con cordura, conforme a la medida de fe que Dios repartió a cada uno.` },
  { ref: "Efesios 2:8-9", text: `8 Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; 9 no por obras, para que nadie se gloríe.` },
  { ref: "2 Corintios 13:5", text: `Examinaos a vosotros mismos si estáis en la fe; probaos a vosotros mismos. ¿O no os conocéis a vosotros mismos, que Jesucristo está en vosotros, a menos que estéis reprobados?` },
  { ref: "Juan 20:29", text: `Jesús le dijo: Porque me has visto, Tomás, creíste; bienaventurados los que no vieron, y creyeron.` },
  { ref: "Marcos 8:12", text: `Y gimiendo en su espíritu, dijo: ¿Por qué pide señal esta generación? De cierto os digo que no se dará señal a esta generación.` },
  { ref: "Marcos 16:13-14", text: `13 Y fueron y lo dijeron a los otros; y ni aun a ellos creyeron. 14 Finalmente se apareció a los once mismos, estando ellos sentados a la mesa, y les reprochó su incredulidad y dureza de corazón, porque no habían creído a los que le habían visto resucitado.` },
  { ref: "Apocalipsis 14:12", text: `Aquí está la paciencia de los santos, los que guardan los mandamientos de Dios y la fe de Jesús.` },
  { ref: "Apocalipsis 5:9", text: `Y cantaban un nuevo cántico, diciendo: Digno eres de tomar el libro y de abrir sus sellos; porque tú fuiste inmolado, y con tu sangre nos has redimido para Dios, de todo linaje y lengua y pueblo y nación.` },
  { ref: "Mateo 26:39", text: `Y yendo un poco adelante, se postró sobre su rostro, orando y diciendo: Padre mío, si es posible, pase de mí esta copa; pero no sea como yo quiero, sino como tú.` },
  { ref: "Mateo 17:20", text: `Y Jesús les dijo: Por vuestra poca fe; porque de cierto os digo, que si tuviereis fe como un grano de mostaza, diréis a este monte: Pásate de aquí allá, y se pasará; y nada os será imposible.` },
  { ref: "Mateo 21:21-22", text: `21 Respondiendo Jesús, les dijo: De cierto os digo, que si tuviereis fe, y no dudareis, no sólo haréis esto de la higuera, sino que si a este monte dijereis: Quítate y échate en el mar, será hecho. 22 Y todo lo que pidiereis en oración, creyendo, lo recibiréis.` },
  { ref: "Mateo 8:26", text: `Y él les dijo: ¿Por qué teméis, hombres de poca fe? Entonces, levantándose, reprendió a los vientos y al mar; y se hizo grande bonanza.` },
  { ref: "Mateo 8:10", text: `Al oírlo Jesús, se maravilló, y dijo a los que le seguían: De cierto os digo, que ni aun en Israel he hallado tanta fe.` },
  { ref: "Mateo 13:58", text: `Y no hizo allí muchos milagros, a causa de la incredulidad de ellos.` },
  { ref: "Mateo 14:31", text: `Al momento Jesús, extendiendo la mano, asió de él, y le dijo: ¡Hombre de poca fe! ¿Por qué dudaste?` },
  { ref: "Mateo 15:28", text: `Entonces respondiendo Jesús, dijo: Oh mujer, grande es tu fe; hágase contigo como quieres. Y su hija fue sanada desde aquella hora.` },
  { ref: "Mateo 25:8", text: `Y las insensatas dijeron a las prudentes: Dadnos de vuestro aceite; porque nuestras lámparas se apagan.` },
  { ref: "Deuteronomio 8:2", text: `Y te acordarás de todo el camino por donde te ha traído Jehová tu Dios estos cuarenta años en el desierto, para afligirte, para probarte, para saber lo que había en tu corazón, si habías de guardar o no sus mandamientos.` },
  { ref: "Jeremías 31:3", text: `Jehová se manifestó a mí hace ya mucho tiempo, diciendo: Con amor eterno te he amado; por tanto, te prolongué mi misericordia.` },
];

const QUIZ_DATA = [
  {
    q: "Cuando el padre pide ayuda a Jesús en Marcos 9:22, ¿cómo está formulada su petición?",
    opts: ["«Sé que puedes sanarle, por favor hazlo»", "«Si algo puedes hacer, ten misericordia de nosotros»", "«Creo en ti; sana a mi hijo ahora»", "«Haz un milagro para que mis dudas desaparezcan»"],
    ans: 1,
    feedback: "«Si algo puedes hacer, ten misericordia de nosotros, y ayúdanos» (Marcos 9:22). La petición está llena de duda — el «si algo puedes» revela su incredulidad. A pesar de eso, Jesús no lo rechaza; lo desafía a creer."
  },
  {
    q: "Según Hebreos 11:1, ¿cuál es la definición bíblica de fe?",
    opts: ["Un sentimiento profundo de paz interior con Dios", "La capacidad de hacer milagros al pedírselo a Dios", "La certeza de lo que se espera y la convicción de lo que no se ve", "La confianza basada en señales y experiencias pasadas"],
    ans: 2,
    feedback: "«Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve» (Hebreos 11:1). La fe no es un sentimiento ni depende de señales visibles — es una certeza y una convicción que trasciende lo que percibimos con los sentidos."
  },
  {
    q: "¿De dónde viene la fe, según Romanos 10:17?",
    opts: ["De las experiencias difíciles que nos forjan", "Del esfuerzo personal y la disciplina espiritual", "Del oír la Palabra de Dios", "De ver cómo Dios actúa en la vida de otros"],
    ans: 2,
    feedback: "«Así que la fe es por el oír, y el oír, por la palabra de Dios» (Romanos 10:17). La fuente principal de la fe es la exposición a la Palabra de Dios. Por eso el estudio bíblico no es opcional para quien quiere crecer en fe."
  },
  {
    q: "¿Qué mostró el centurión de Mateo 8:5-13 que asombró a Jesús?",
    opts: ["Que había estudiado las Escrituras toda su vida", "Una fe perfecta sin ninguna duda", "Reconoció la autoridad de Jesús sin necesitar verlo actuar", "Que había seguido a Jesús desde el principio de su ministerio"],
    ans: 2,
    feedback: "El centurión dijo: «Solamente di la palabra, y mi criado sanará» (Mt 8:8). Jesús se maravilló: «Ni aun en Israel he hallado tanta fe» (Mt 8:10). Era un gentil, no judío — lo que muestra que la fe no depende del trasfondo religioso, sino del reconocimiento genuino de quién es Jesús."
  },
  {
    q: "¿Qué necesita el pueblo de Dios en los últimos días, según Apocalipsis 14:12?",
    opts: ["Solo guardar el sábado y los demás mandamientos", "Guardar los mandamientos de Dios y tener la fe de Jesús", "Evangelizar a todas las naciones antes del fin", "Separarse completamente del mundo para mantenerse puros"],
    ans: 1,
    feedback: "«Aquí está la paciencia de los santos, los que guardan los mandamientos de Dios y la fe de Jesús» (Apocalipsis 14:12). No es solo obediencia legal — es obediencia impulsada por la fe de Cristo viviendo en nosotros. Los dos van inseparablemente juntos."
  },
  {
    q: "¿Qué ilustra la historia de las cinco vírgenes insensatas (Mateo 25:8) sobre la fe?",
    opts: ["Que debemos orar en grupo para que la fe sea más fuerte", "Que la fe se puede transferir de una persona a otra", "Que la fe prestada de otro no sirve cuando llega la crisis", "Que es suficiente con haber tenido fe en el pasado"],
    ans: 2,
    feedback: "Las vírgenes insensatas intentaron pedir aceite prestado — pero no fue posible compartirlo. Así es la fe personal: no se puede tomar prestada. Cada uno debe establecer su propia conexión con Dios. En una crisis, quienes dependen de la fe de otro la pierden rápido."
  },
  {
    q: "¿Cuánta fe es necesaria para que «nada sea imposible», según Mateo 17:20?",
    opts: ["Una fe grande, desarrollada durante años de vida cristiana", "Una fe perfecta, sin ninguna sombra de duda", "Fe como un grano de mostaza", "Al menos la misma fe que tenían los apóstoles"],
    ans: 2,
    feedback: "«Si tuviereis fe como un grano de mostaza, diréis a este monte: Pásate de aquí allá, y se pasará; y nada os será imposible» (Mateo 17:20). El grano de mostaza es la semilla más pequeña — lo que importa no es el tamaño sino que sea genuina y esté puesta en el Dios que sí puede."
  },
];

const REFLEXIONES = [
  { key: "r1", q: "¿Cómo ayudó Jesús a un hombre que tenía serios problemas de incredulidad? ¿Cuál fue la clave del encuentro?", ref: "Marcos 9:17–24" },
  { key: "r2", q: "¿Podés tener dudas y fe al mismo tiempo? ¿Debemos alejarnos de Dios solo porque tenemos preguntas o no entendemos algo?", ref: "Marcos 9:24 · Mateo 17:20" },
  { key: "r3", q: "¿Por qué es tan importante la fe para la relación con Dios? ¿En qué se basa concretamente tu fe hoy?", ref: "Hebreos 11:6 · Romanos 10:17" },
  { key: "r4", q: "¿Cuál es la diferencia entre fe y sentimiento? ¿Cómo mantenés tu fe fuerte cuando no la sentís?", ref: "Mateo 8:26 · Romanos 10:17" },
  { key: "r5", q: "¿Qué experiencias o momentos han fortalecido más tu fe? ¿En qué basás tu confianza en Dios cuando todo se oscurece?", ref: "Hebreos 10:23 · 2 Corintios 13:5" },
];

// ── COMPONENTES DE TABS ───────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Tener <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>fe</em></div>
      <div className="sec-sub">Marcos 9:14-29 — El padre que creía y dudaba</div>

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
            <p>Se dice que «la fe es como el wifi: es invisible, pero tiene el poder de conectarte con lo que necesitás». Sin fe no tendríamos ninguna relación con Dios. Esta semana exploramos qué hacer con la duda y la incredulidad, qué es y qué no es la fe, y qué significa tener «la fe de Jesús».</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Marcos 9:23-24
            </div>
            <div className="honey-text">
              «Si puedes creer, al que cree todo le es posible.» E inmediatamente el padre clamó y dijo: «Creo; ayuda mi incredulidad.»
            </div>
            <div className="honey-ref">Marcos 9:23-24 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>La fe puede comenzar siendo muy pequeña</strong>, pero crece con el tiempo a medida que la cultivamos en la Palabra y la oración.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>La fe es una decisión, no un sentimiento.</strong> Es necesaria para la salvación y puede ejercerse incluso cuando no se la siente.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>La fe de Jesús</strong> — la que el pueblo de Dios necesita en los últimos días — solo puede provenir de Jesús mismo, no de nuestro esfuerzo.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabFeDuda({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Fe y Duda</div>
      <div className="sec-sub">Cinco conceptos clave sobre la naturaleza de la fe</div>

      {FE_CONCEPTOS.map(item => (
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · Primeros escritos, cap. 17, p. 103</div>
        <div className="egw-text">«Muchos no ejercitan la fe que es su privilegio y deber ejercitar, y a menudo esperan aquel sentimiento íntimo que solo la fe puede dar. El sentimiento de por sí no es fe. [...] <strong>A nosotros nos toca ejercitar la fe; pero el sentimiento gozoso y sus beneficios nos son dados por Dios.</strong>»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 47, pp. 405-406</div>
        <div className="egw-text">«Aunque muy pequeña, la semilla de mostaza contiene el mismo principio vital misterioso que produce el crecimiento del árbol más imponente. <strong>Si tenemos una fe tal, nos posesionaremos de la Palabra de Dios y de todos los agentes útiles que él ha provisto. Así nuestra fe se fortalecerá, y traerá en nuestra ayuda el poder del cielo.</strong>»</div>
      </div>
    </>
  );
}

function TabCasos({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Casos</div>
      <div className="sec-sub">Compará la fe de diferentes personas que interactuaron con Jesús</div>

      {CASOS_DATA.map(grupo => (
        <div key={grupo.key} className="casos-group">
          <div className="casos-head" style={{ background: grupo.bgHex }}>
            <div className="casos-head-icon" style={{ background: grupo.colorHex + "22" }}>
              <grupo.Icon size={16} color={grupo.colorHex} />
            </div>
            <div className="casos-head-info">
              <div className="casos-head-title" style={{ color: grupo.colorHex }}>{grupo.title}</div>
              <div className="casos-head-sub" style={{ color: grupo.colorHex }}>{grupo.sub}</div>
            </div>
          </div>

          {grupo.items.map(item => (
            <div
              key={item.ref}
              className={`expand-item${openExpand[item.ref] ? " open" : ""}`}
              onClick={() => toggleExpand(item.ref)}
            >
              <div className="expand-header">
                <span className="expand-badge">{item.ref}</span>
                <span className="expand-name">{item.name}</span>
                {openExpand[item.ref] ? <ChevronUp size={16} color="var(--acc2)" /> : <ChevronDown size={16} color="var(--tx3)" />}
              </div>
              {openExpand[item.ref] && (
                <div className="expand-body">{item.desc}</div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>¿Qué otros pasajes vienen a tu mente relacionados con la comprensión del papel de la fe? ¿En cuál de estos grupos te identificás más hoy?</p>
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
                <>
                  <span className="verse-tag warn-tag"><Star size={9} style={{ display: "inline", marginRight: 3 }} />Texto base</span>
                </>
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
    const msg = pct === 100 ? "¡Perfecto! Dominás el tema de esta semana." :
                pct >= 71 ? "¡Muy bien! Tenés una base sólida sobre la fe." :
                pct >= 43 ? "Buen comienzo. Te recomendamos repasar los conceptos clave." :
                "Vale la pena volver a leer el material. La fe crece cuando la cultivamos.";
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
      <div className="sec-sub">Preguntas para el grupo y reflexión personal</div>

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
          <p>Tu fe es como el wifi de tu relación con Dios: invisible, pero te conecta con todo lo que necesitás. Y como el wifi, a veces la señal se corta — no porque Dios se haya ido, sino porque algo está interfiriendo.</p>
          <br />
          <p>Tal vez tu fe está débil porque dejaste de alimentarla con la Palabra. O porque la duda se fue acumulando sin que hicieras nada con ella. O porque estás esperando <em>sentir</em> algo antes de creer, y ese sentimiento nunca llega.</p>
          <br />
          <p>Lo que el padre de Marcos 9 hizo es algo que vos también podés hacer hoy, con honestidad: <strong>«Creo; ayuda mi incredulidad»</strong> (Mr 9:24). No es una declaración de fuerza — es una declaración de honestidad. Y Jesús responde a ese tipo de fe.</p>
          <br />
          <p>Esta semana, en lugar de esperar sentirte diferente, hacé una sola cosa concreta: abrí la Biblia y leé hasta que algo te hable. No porque debas. Porque la fe crece cuando la alimentamos — y Dios es fiel para encontrarte donde estás.</p>
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
    { id: "inicio",  label: "Inicio",   Icon: Home },
    { id: "feduda",  label: "Fe y Duda", Icon: Layers },
    { id: "casos",   label: "Casos",    Icon: Users },
    { id: "biblia",  label: "Biblia",   Icon: BookOpen },
    { id: "quiz",    label: "Quiz",     Icon: HelpCircle },
    { id: "cierre",  label: "Cierre",   Icon: Flame },
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
              InVerso · Semana 8
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Tener <em>fe</em>
            </h1>
            <div className="hero-ref">Marcos 9:14-29 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"  && <TabInicio teacherMode={teacherMode} />}
            {tab === "feduda"  && <TabFeDuda openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "casos"   && <TabCasos openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "biblia"  && <TabBiblia openVerses={openVerses} toggle={toggleVerse} renderVerseText={renderVerseText} />}
            {tab === "quiz"    && (
              <TabQuiz
                quizIdx={quizIdx} quizSelected={quizSelected}
                quizAnswered={quizAnswered} quizResults={quizResults}
                quizDone={quizDone} score={score}
                selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz}
              />
            )}
            {tab === "cierre"  && <TabCierre />}
          </div>
        </div>

        <nav className="nav">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={tab === id ? "on" : ""} onClick={() => switchTab(id)}>
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
