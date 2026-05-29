import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, Scale,
  Eye, HelpCircle
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0f0609;--bg2:#190a0d;--bg3:#220e12;--surf:#2c1017;--surf2:#37141d;--brd:#4a1a24;--brd2:#62242f;--tx:#f5dde0;--tx2:#b88090;--tx3:#7a505a;--acc:#c0394c;--acc2:#d55268;--acc3:#e8808f;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#f59e0b;--warn-d:rgba(245,158,11,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1f0709 0%,#0f0609 55%,#09050a 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(192,57,76,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(192,57,76,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(192,57,76,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(192,57,76,.3) 30%,rgba(192,57,76,.3) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:44px;min-height:56px;padding:.6rem .28rem .5rem;font-size:.46rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.03em;text-transform:uppercase}
.nav button svg{width:19px;height:19px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:14%;right:14%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(192,57,76,.08);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(192,57,76,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(245,158,11,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(192,57,76,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(192,57,76,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(192,57,76,.07),rgba(192,57,76,.02));border:1px solid rgba(192,57,76,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(192,57,76,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(192,57,76,.10),rgba(192,57,76,.03));border:1px solid rgba(192,57,76,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(192,57,76,.10),rgba(192,57,76,.02));border:1.5px solid rgba(192,57,76,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}
.key-list{list-style:none;padding:0;margin-bottom:.85rem}
.key-list li{display:flex;gap:.7rem;align-items:flex-start;padding:.6rem 0;border-bottom:1px solid var(--brd)}
.key-list li:last-child{border-bottom:none}
.key-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:.55rem}
.key-text{font-size:.97rem;line-height:1.6;color:var(--tx2)}
.key-text strong{color:var(--tx)}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: ¿Cómo ve el mundo al pecado hoy?", desc: "Preguntar al grupo: ¿Cómo ve la cultura popular al pecado hoy? ¿Ha cambiado esa percepción? Escuchar 2-3 respuestas. Conectar: si el pecado no es serio, ¿para qué necesitamos un Salvador? El Sermón del Monte confronta esa comodidad directamente." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos. Orar pidiendo que el Espíritu Santo use la ley de Dios como un espejo honesto para cada persona presente — no para condenar, sino para llevar a Cristo." },
  { time: "05–12 min", title: "Tab La Ley — Las antítesis del Sermón del Monte", desc: "Explorar los 7 puntos donde Jesús amplió la ley. Enfatizar: (1) Jesús no rebajó el estándar — lo elevó al nivel del corazón; (2) la audiencia religiosa quedó igual de expuesta; (3) ninguno de nosotros puede cumplir ese estándar solos. Preguntar: ¿En cuál de estas áreas te sentiste más interpelado/a?" },
  { time: "12–18 min", title: "Tab Espejo — Propósito y límites de la ley", desc: "Recorrer los 5 conceptos. Énfasis en el contraste: la ley puede revelar el pecado, pero no puede quitarlo. Solo el evangelio hace lo que la ley no puede. La ley es la maestra que nos lleva a Cristo (Gálatas 3:24). Preguntar: ¿La ley te asusta o te da gratitud por el evangelio?" },
  { time: "18–23 min", title: "Quiz interactivo", desc: "Hacer las 7 preguntas en conjunto. Pausar especialmente en pregunta 3 (Romanos 3:20, propósito de la ley) y pregunta 5 (Gálatas 2:16, justificación solo en Cristo). Son las dos bisagras teológicas de la lección." },
  { time: "23–28 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Foco en: ¿Estás construyendo sobre la Roca o sobre la arena? ¿Cuál es la diferencia entre conocer a Jesús y conocer sobre Jesús? Leer el texto 'Para tu vida' en voz alta." },
  { time: "28–30 min", title: "Oración de cierre", desc: "Invitar a una oración personal en silencio: pedirle a Dios que use su ley como espejo en nuestra propia vida, y que nos dé gracia para responder no con legalismo sino con amor genuino a Jesús." },
];

const ANTITESIS_DATA = [
  {
    key: "a1", badge: "Mateo 5:21-22",
    name: "El enojo y el homicidio",
    body: "«Oísteis que fue dicho... No matarás. Pero yo os digo que cualquiera que se enoje contra su hermano, será culpable de juicio» (Mt 5:21-22). Jesús no condena solo el acto físico del homicidio — también condena la ira que lo precede. La ira sin resolver, los insultos y el desprecio son formas de matar en el corazón. Dios ve el interior, no solo las acciones externas."
  },
  {
    key: "a2", badge: "Mateo 5:27-30",
    name: "La lujuria y el adulterio",
    body: "«Oísteis que fue dicho: No cometerás adulterio. Pero yo os digo que cualquiera que mira a una mujer para codiciarla, ya adulteró con ella en su corazón» (Mt 5:27-28). El problema no empieza con el acto sino con la mirada deliberada y el deseo cultivado. Su solución radical — sacarse el ojo, cortarse la mano — muestra cuán seriamente toma el pecado y sus consecuencias eternas."
  },
  {
    key: "a3", badge: "Mateo 5:33-37",
    name: "Los juramentos y la integridad",
    body: "«Oísteis además que fue dicho... No perjurarás. Pero yo os digo: No juréis en ninguna manera» (Mt 5:33-34). Si nuestra palabra fuera siempre verdadera, no necesitaríamos juramentos para reforzarla. Jesús apunta al problema de raíz: la deshonestidad del corazón. Su estándar es simple y absoluto: que nuestro «sí» sea sí y nuestro «no» sea no."
  },
  {
    key: "a4", badge: "Mateo 5:38-42",
    name: "La venganza y la generosidad",
    body: "«Oísteis que fue dicho: Ojo por ojo, y diente por diente. Pero yo os digo: No resistáis al que es malo» (Mt 5:38-39). La ley de la equidad fue dada para limitar la venganza desproporcionada, no para fomentarla. Jesús la supera con una ética del amor radical: la otra mejilla, la capa, la milla extra. Una actitud que exige un corazón transformado."
  },
  {
    key: "a5", badge: "Mateo 5:43-48",
    name: "El amor a los enemigos",
    body: "«Oísteis que fue dicho: Amarás a tu prójimo, y aborrecerás a tu enemigo. Pero yo os digo: Amad a vuestros enemigos, bendecid a los que os maldicen» (Mt 5:43-44). Amar a quienes nos aman no requiere gracia sobrenatural. El estándar divino es amar incluso a quienes nos lastiman. «Sed, pues, vosotros perfectos, como vuestro Padre que está en los cielos es perfecto» (Mt 5:48)."
  },
  {
    key: "a6", badge: "Mateo 6:1-18",
    name: "La religión superficial",
    body: "En Mateo 6, Jesús expone tres prácticas religiosas usadas para impresionar a otros: dar limosnas ostentosamente, orar rimbombantemente, y ayunar con cara larga. La hipocresía consiste en hacer cosas correctas con motivos incorrectos — para ser vistos. Dios, «que ve en lo secreto» (Mt 6:4, 6, 18), es el único público que importa."
  },
  {
    key: "a7", badge: "Mateo 7:1-5",
    name: "El juicio a los demás",
    body: "«No juzguéis, para que no seáis juzgados. Porque con el juicio con que juzgáis, seréis juzgados» (Mt 7:1-2). Jesús no prohíbe el discernimiento sino la actitud de superioridad moral. La parábola de la viga y la paja señala nuestra ceguera selectiva: somos expertos en detectar los defectos ajenos mientras ignoramos los nuestros. La autocrítica honesta debe preceder a cualquier corrección a otros."
  },
];

const ESPEJO_CONCEPTOS = [
  {
    key: "e1", badge: "1 Juan 3:4",
    name: "¿Qué es el pecado?",
    body: "La Biblia define el pecado como «infracción de la ley» (1 Juan 3:4). Es también parte de nuestra naturaleza caída: «He aquí, en maldad he sido formado, y en pecado me concibió mi madre» (Salmo 51:5). Jeremías añade: «Engañoso es el corazón más que todas las cosas, y perverso» (Jeremías 17:9). El pecado no es solo lo que hacemos — es también lo que somos sin la gracia de Dios."
  },
  {
    key: "e2", badge: "Santiago 1:23-25",
    name: "La ley como espejo",
    body: "La ley de Dios funciona como un espejo que revela quiénes somos realmente. Santiago escribe: «Si alguno es oidor de la palabra pero no hacedor de ella, es semejante al hombre que considera en un espejo su rostro natural. Se considera a sí mismo, y se va, y luego olvida cómo era» (Santiago 1:23-24). El espejo no te cambia — solo muestra lo que necesita cambiar. La ley cumple esa función: revela el pecado, pero no lo elimina."
  },
  {
    key: "e3", badge: "Romanos 3:20 · 7:7",
    name: "El propósito de la ley",
    body: "«Por medio de la ley es el conocimiento del pecado» (Romanos 3:20). Pablo también escribe: «Yo no conocí el pecado sino por la ley» (Romanos 7:7). Dios escribió su ley con su propio dedo (Éxodo 31:18) no para condenar sin remedio, sino para que reconozcamos nuestra necesidad de un Salvador. La ley es la maestra que nos lleva a Cristo (Gálatas 3:24)."
  },
  {
    key: "e4", badge: "Gálatas 2:16",
    name: "La ley no puede salvar",
    body: "Aunque la ley es santa, justa y buena (Romanos 7:12), tiene una limitación esencial: «por las obras de la ley ningún ser humano será justificado delante de él» (Romanos 3:20). La ley condena al transgresor pero no lo puede perdonar. Muestra la deuda pero no puede pagarla. Por eso la ley necesita al evangelio: «El hombre no es justificado por las obras de la ley, sino por la fe de Jesucristo» (Gálatas 2:16)."
  },
  {
    key: "e5", badge: "Juan 14:15 · 1 Juan 5:3",
    name: "Obediencia por amor, no por temor",
    body: "Jesús enseñó: «Si me amáis, guardad mis mandamientos» (Juan 14:15). El orden es crucial: primero el amor, luego la obediencia. La obediencia motivada por el miedo al castigo es legalismo. La obediencia como respuesta al amor es la vida cristiana genuina. Juan añade: «Este es el amor a Dios, que guardemos sus mandamientos; y sus mandamientos no son gravosos» (1 Juan 5:3). Lo que para el legalista es una carga, para el que ama es un privilegio."
  },
];

const VERSES = [
  { ref: "Mateo 5:17-20", isBase: true, text: `17 No penséis que he venido para abrogar la ley o los profetas; no he venido para abrogar, sino para cumplir. 18 Porque de cierto os digo que hasta que pasen el cielo y la tierra, ni una jota ni una tilde pasará de la ley, hasta que todo se haya cumplido. 19 De manera que cualquiera que quebrante uno de estos mandamientos muy pequeños, y así enseñe a los hombres, muy pequeño será llamado en el reino de los cielos; mas cualquiera que los haga y los enseñe, éste será llamado grande en el reino de los cielos. 20 Porque os digo que si vuestra justicia no fuere mayor que la de los escribas y fariseos, no entraréis en el reino de los cielos.` },
  { ref: "Mateo 7:21-23", text: `21 No todo el que me dice: Señor, Señor, entrará en el reino de los cielos, sino el que hace la voluntad de mi Padre que está en los cielos. 22 Muchos me dirán en aquel día: Señor, Señor, ¿no profetizamos en tu nombre, y en tu nombre echamos fuera demonios, y en tu nombre hicimos muchas maravillas? 23 Y entonces les declararé: Nunca os conocí; apartaos de mí, hacedores de maldad.` },
  { ref: "Mateo 7:24-27", text: `24 Cualquiera, pues, que me oye estas palabras, y las hace, le compararé a un hombre prudente, que edificó su casa sobre la roca. 25 Descendió lluvia, y vinieron ríos, y soplaron vientos, y golpearon contra aquella casa; y no cayó, porque estaba fundada sobre la roca. 26 Pero cualquiera que me oye estas palabras y no las hace, le compararé a un hombre insensato, que edificó su casa sobre la arena; 27 y descendió lluvia, y vinieron ríos, y soplaron vientos, y dieron con ímpetu contra aquella casa; y cayó, y fue grande su ruina.` },
  { ref: "Isaías 59:2", text: `Pero vuestras iniquidades han hecho división entre vosotros y vuestro Dios, y vuestros pecados han hecho ocultar de vosotros su rostro para no oír.` },
  { ref: "1 Juan 3:4", text: `Todo aquel que comete pecado, infringe también la ley; pues el pecado es infracción de la ley.` },
  { ref: "Salmo 51:5", text: `He aquí, en maldad he sido formado, y en pecado me concibió mi madre.` },
  { ref: "Jeremías 17:9", text: `Engañoso es el corazón más que todas las cosas, y perverso; ¿quién lo conocerá?` },
  { ref: "Romanos 3:19-23", text: `19 Pero sabemos que todo lo que la ley dice, lo dice a los que están bajo la ley, para que toda boca se cierre y todo el mundo quede bajo el juicio de Dios. 20 ya que por las obras de la ley ningún ser humano será justificado delante de él; porque por medio de la ley es el conocimiento del pecado. 21 Pero ahora, aparte de la ley, se ha manifestado la justicia de Dios, testificada por la ley y por los profetas; 22 la justicia de Dios por medio de la fe en Jesucristo, para todos los que creen en él. Porque no hay diferencia, 23 por cuanto todos pecaron, y están destituidos de la gloria de Dios.` },
  { ref: "Romanos 4:15", text: `Pues la ley produce ira; pero donde no hay ley, tampoco hay transgresión.` },
  { ref: "Romanos 7:7", text: `¿Qué diremos, pues? ¿La ley es pecado? En ninguna manera. Pero yo no conocí el pecado sino por la ley; porque tampoco conociera la codicia, si la ley no dijera: No codiciarás.` },
  { ref: "Romanos 7:14", text: `Porque sabemos que la ley es espiritual; mas yo soy carnal, vendido al pecado.` },
  { ref: "Romanos 8:7", text: `Por cuanto los designios de la carne son enemistad contra Dios; porque no se sujetan a la ley de Dios, ni tampoco pueden.` },
  { ref: "Santiago 1:23-25", text: `23 Porque si alguno es oidor de la palabra pero no hacedor de ella, éste es semejante al hombre que considera en un espejo su rostro natural. 24 Porque él se considera a sí mismo, y se va, y luego olvida cómo era. 25 Mas el que mira atentamente en la perfecta ley, la de la libertad, y persevera en ella, no siendo oidor olvidadizo, sino hacedor de la obra, éste será bienaventurado en lo que hace.` },
  { ref: "Gálatas 2:16", text: `Sabiendo que el hombre no es justificado por las obras de la ley, sino por la fe de Jesucristo, nosotros también hemos creído en Jesucristo, para ser justificados por la fe de Cristo y no por las obras de la ley, por cuanto por las obras de la ley nadie será justificado.` },
  { ref: "Gálatas 3:13", text: `Cristo nos redimió de la maldición de la ley, hecho por nosotros maldición (porque está escrito: Maldito todo el que es colgado en un madero).` },
  { ref: "Juan 14:15", text: `Si me amáis, guardad mis mandamientos.` },
  { ref: "1 Juan 5:3", text: `Pues este es el amor a Dios, que guardemos sus mandamientos; y sus mandamientos no son gravosos.` },
  { ref: "Juan 17:3", text: `Y esta es la vida eterna: que te conozcan a ti, el único Dios verdadero, y a Jesucristo, a quien has enviado.` },
  { ref: "Marcos 12:30-31", text: `30 Y amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente y con todas tus fuerzas. Este es el principal mandamiento. 31 Y el segundo es semejante: Amarás a tu prójimo como a ti mismo. No hay otro mandamiento mayor que éstos.` },
  { ref: "Mateo 22:40", text: `De estos dos mandamientos depende toda la ley y los profetas.` },
  { ref: "1 Corintios 4:5", text: `Así que, no juzguéis nada antes de tiempo, hasta que venga el Señor, el cual aclarará también lo oculto de las tinieblas, y manifestará las intenciones de los corazones; y entonces cada uno recibirá su alabanza de Dios.` },
];

const QUIZ_DATA = [
  {
    q: "Según Mateo 5:20, ¿qué dijo Jesús sobre la justicia necesaria para entrar en el reino de los cielos?",
    opts: [
      "Que era suficiente guardar los Diez Mandamientos fielmente",
      "Que la fe en él reemplazaría cualquier requisito de justicia",
      "Que la justicia debía ser mayor que la de los escribas y fariseos",
      "Que nadie podía entrar sin haber sido bautizado"
    ],
    ans: 2,
    feedback: "«Si vuestra justicia no fuere mayor que la de los escribas y fariseos, no entraréis en el reino de los cielos» (Mateo 5:20). Jesús no bajó el estándar — lo elevó al máximo, mostrando que ninguna justicia humana es suficiente. Solo la justicia de Cristo puede satisfacer ese requisito."
  },
  {
    q: "Según 1 Juan 3:4, ¿cómo define la Biblia al pecado?",
    opts: [
      "Hacer daño deliberadamente a otra persona",
      "Infracción de la ley de Dios",
      "Alejarse de los mandamientos de la iglesia",
      "Tener pensamientos impuros o malos deseos"
    ],
    ans: 1,
    feedback: "«Todo aquel que comete pecado, infringe también la ley; pues el pecado es infracción de la ley» (1 Juan 3:4). El pecado tiene una definición objetiva: es la violación de la ley de Dios. No es solo subjetivo o cultural — es una transgresión frente a un estándar divino."
  },
  {
    q: "¿Cuál es el propósito principal de la ley según Romanos 3:20?",
    opts: [
      "Salvarnos de nuestros pecados mediante la obediencia",
      "Darnos un estilo de vida saludable y ordenado",
      "El conocimiento del pecado",
      "Establecer la superioridad moral del pueblo judío"
    ],
    ans: 2,
    feedback: "«Por medio de la ley es el conocimiento del pecado» (Romanos 3:20). La ley no fue diseñada para justificarnos — fue diseñada para mostrarnos que somos pecadores que necesitan un Salvador. Es como el espejo que revela la suciedad, no el jabón que la limpia."
  },
  {
    q: "Según Jesús en Mateo 5:21-22, ¿qué pecado del corazón coloca en la misma categoría de gravedad que el homicidio?",
    opts: [
      "La envidia hacia el prójimo",
      "El enojo injustificado con un hermano",
      "El orgullo y la arrogancia espiritual",
      "El adulterio cometido en el pensamiento"
    ],
    ans: 1,
    feedback: "«Cualquiera que se enoje contra su hermano, será culpable de juicio» (Mateo 5:22). Jesús conectó el homicidio con la ira que lo precede en el corazón. No se trata solo del acto externo — Dios juzga el estado interior. La ira sin resolver puede tener la misma raíz que el acto que produce."
  },
  {
    q: "¿Dónde puede encontrarse la justificación ante Dios, según Gálatas 2:16?",
    opts: [
      "En las obras de la ley combinadas con la fe",
      "Principalmente en las obras de la ley",
      "No por las obras de la ley, sino por la fe en Jesucristo",
      "En el bautismo y la pertenencia a la iglesia verdadera"
    ],
    ans: 2,
    feedback: "«El hombre no es justificado por las obras de la ley, sino por la fe de Jesucristo» (Gálatas 2:16). La justificación es exclusivamente por la fe en Cristo. Las obras de la ley, por muy buenas que sean, no pueden justificar a nadie ante Dios. Solo la justicia de Cristo imputada a nosotros puede hacerlo."
  },
  {
    q: "Según Mateo 7:21, ¿quiénes entrarán en el reino de los cielos?",
    opts: [
      "Todos los que dicen «Señor, Señor» con sinceridad",
      "Solo los que hacen la voluntad del Padre celestial",
      "Los que profetizan y hacen milagros en el nombre de Jesús",
      "Los que conocen bien las Escrituras y las enseñan a otros"
    ],
    ans: 1,
    feedback: "«No todo el que me dice: Señor, Señor, entrará en el reino de los cielos, sino el que hace la voluntad de mi Padre» (Mateo 7:21). Conocer sobre Jesús no es lo mismo que conocerlo. La vida eterna no es solo un cuerpo de doctrina correcta — es una relación viva con Dios que se expresa en obediencia."
  },
  {
    q: "En Mateo 7:24-25, ¿a qué compara Jesús al que escucha y obedece sus palabras?",
    opts: [
      "A un árbol plantado junto al río cuyo fruto no se pierde",
      "A un hombre prudente que edificó su casa sobre la roca",
      "A una ciudad puesta en lo alto de un monte que no puede ocultarse",
      "A una semilla de mostaza que crece hasta convertirse en árbol"
    ],
    ans: 1,
    feedback: "«Cualquiera que me oye estas palabras, y las hace, le compararé a un hombre prudente, que edificó su casa sobre la roca» (Mateo 7:24). La diferencia entre los dos constructores no es el conocimiento — ambos oyeron a Jesús. La diferencia es la obediencia. Solo el que actúa sobre lo que escucha construye sobre la Roca."
  },
];

const REFLEXIONES = [
  { key: "r1", q: "¿Cómo ve el pecado la cultura popular hoy? ¿En qué se diferencia esa visión de la bíblica? ¿Cómo debería responder nuestra iglesia?", ref: "Mateo 5:20 · Isaías 59:2" },
  { key: "r2", q: "¿Cuál era la relación de Cristo con la ley? ¿Cuándo Jesús dice «oísteis que fue dicho... pero yo os digo», está contradiciéndola o profundizándola?", ref: "Mateo 5:17-22" },
  { key: "r3", q: "¿Ha sido fácil o difícil para ti obedecer la ley de Dios? ¿Qué rol juega el amor en tu obediencia? ¿Cómo evitar caer en la trampa del legalismo?", ref: "Juan 14:15 · 1 Juan 5:3" },
  { key: "r4", q: "¿Cuál es el peligro de la falsa seguridad de salvación? ¿Qué señales indican que uno realmente conoce a Jesús, y no solo sabe sobre él?", ref: "Mateo 7:21-23 · Juan 17:3" },
  { key: "r5", q: "¿Cómo deseas responder esta semana a Cristo y a sus enseñanzas? ¿Sobre qué estás edificando tu vida espiritual?", ref: "Mateo 7:24-27" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">El pecado, el evangelio <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>y la ley</em></div>
      <div className="sec-sub">Novena Semana · Mateo 5–7</div>

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
            <p>El pecado es el mayor obstáculo para una relación estrecha con Dios. El Sermón del Monte (Mateo 5–7) fue la oportunidad de Jesús para revelar el verdadero alcance de la ley — no abolirla, sino mostrar su profundidad espiritual y exponer la necesidad universal de un Salvador, incluso entre los más religiosos.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Mateo 5:17-18
            </div>
            <div className="honey-text">
              «No penséis que he venido para abrogar la ley o los profetas; no he venido para abrogar, sino para cumplir. Porque de cierto os digo que hasta que pasen el cielo y la tierra, ni una jota ni una tilde pasará de la ley.»
            </div>
            <div className="honey-ref">Mateo 5:17-18 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>El pecado nos separa de Dios</strong> y es más serio de lo que la cultura reconoce. Afecta nuestros pensamientos, motivos, palabras y acciones.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>La ley de Dios es un espejo</strong> que refleja su carácter y revela nuestros pecados. Tiene que ver con relaciones: con Dios y con los demás.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>La ley no puede salvarnos</strong> — solo condena y señala nuestra necesidad. Solo Jesús puede justificarnos y restaurar nuestra relación con Dios.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabLaLey({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">La Ley</div>
      <div className="sec-sub">Cómo Jesús amplió la ley para revelar el pecado del corazón</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>Jesús se dirigía a judíos profundamente religiosos que se creían justos. Citó la ley una y otra vez para mostrar que incluso los más devotos eran culpables ante Dios. No rebajó el estándar — lo elevó al nivel del corazón.</p>
      </div>

      {ANTITESIS_DATA.map(item => (
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
        <p>¿En cuál de estas áreas te sentiste más interpelado/a? ¿Cuánta diferencia hay entre tu conducta externa y el estado de tu corazón?</p>
      </div>
    </>
  );
}

function TabEspejo({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Espejo</div>
      <div className="sec-sub">La ley como reveladora del pecado — y sus límites</div>

      {ESPEJO_CONCEPTOS.map(item => (
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · El conflicto de los siglos, cap. 28, p. 461</div>
        <div className="egw-text">«La ley revela al hombre sus pecados, pero no dispone ningún remedio. Mientras promete vida al que obedece, declara que la muerte es lo que le toca al transgresor. <strong>Solo el evangelio de Cristo puede librarlo de la condenación o de la mancha del pecado.</strong> Debe arrepentirse ante Dios cuya ley transgredió, y tener fe en Cristo y en su sacrificio expiatorio.»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El conflicto de los siglos, cap. 28, p. 460</div>
        <div className="egw-text">«La ley de Dios, por su naturaleza misma, es inmutable. Es una revelación de la voluntad y del carácter de su Autor. Dios es amor, y su ley es amor. Sus dos grandes principios son el amor a Dios y al hombre. <strong>"El amor, pues, es el cumplimiento de la ley" (Romanos 13:10).</strong>»</div>
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
    const msg = pct === 100 ? "¡Perfecto! Comprendés bien el pecado, la ley y el evangelio." :
                pct >= 71 ? "¡Muy bien! Tenés una base sólida sobre estas verdades fundamentales." :
                pct >= 43 ? "Buen comienzo. Te recomendamos repasar los conceptos del Sermón del Monte." :
                "Vale la pena volver a leer el material. Estas verdades son esenciales para nuestra fe.";
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
      <div className="sec-sub">Saber y hacer — Preguntas para el grupo</div>

      <div className="card">
        <div className="card-label">Mateo 7:21-23</div>
        <p>Jesús advierte que algunos lo llamarán «Señor, Señor» y afirmarán haberlo servido — pero él dirá: «Nunca os conocí». No basta conocer sobre Jesús. La vida eterna es conocerlo a él (Juan 17:3). Y conocerlo genuinamente produce obediencia — no como condición de salvación, sino como fruto de una relación viva.</p>
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
          <p>El Sermón del Monte no es una lista de reglas para cumplir — es un espejo. Si lo lees honestamente, vas a ver que fallás en todas sus dimensiones: la ira, la lujuria, el orgullo, el juicio, la hipocresía. Eso no es un accidente. Jesús lo diseñó así.</p>
          <br />
          <p>Pero el espejo no es el punto final. El punto final es lo que hacés cuando ves tu reflejo. Podés alejarte y olvidar, como el hombre de Santiago 1. O podés correr al único que puede limpiar lo que el espejo revela.</p>
          <br />
          <p>La ley te muestra que necesitás a Jesús desesperadamente. El evangelio te dice que Jesús vino exactamente por eso. <strong>«Cristo nos redimió de la maldición de la ley»</strong> (Gálatas 3:13) — no para que vivieras sin ley, sino para que vivieras por amor al que la cumplió en tu lugar.</p>
          <br />
          <p>Esta semana, en lugar de medir tu espiritualidad por las obras externas, mirá el Sermón del Monte y dejate desafiar en el corazón. Luego pedile a Dios que haga en vos lo que vos solo no podés hacer.</p>
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
    { id: "inicio",  label: "Inicio",  Icon: Home },
    { id: "laley",   label: "La Ley",  Icon: Scale },
    { id: "espejo",  label: "Espejo",  Icon: Eye },
    { id: "biblia",  label: "Biblia",  Icon: BookOpen },
    { id: "quiz",    label: "Quiz",    Icon: HelpCircle },
    { id: "cierre",  label: "Cierre",  Icon: Flame },
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
              InVerso · Semana 9
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              El pecado, el evangelio <em>y la ley</em>
            </h1>
            <div className="hero-ref">Mateo 5–7 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"  && <TabInicio teacherMode={teacherMode} />}
            {tab === "laley"   && <TabLaLey openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "espejo"  && <TabEspejo openExpand={openExpand} toggleExpand={toggleExpand} />}
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
