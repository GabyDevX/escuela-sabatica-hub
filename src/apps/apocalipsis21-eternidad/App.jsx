import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Heart, Crown, Sparkles, Eye
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0c0a06;--bg2:#161208;--bg3:#241e10;--surf:#2a2214;--surf2:#38301c;--brd:#4a3e28;--brd2:#6a5a3a;--tx:#f5f0e6;--tx2:#c9b88e;--tx3:#8c7a58;--acc:#c9a03c;--acc2:#e0be58;--acc3:#f5e4a8;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#f59e0b;--warn-d:rgba(245,158,11,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1e1808 0%,#161208 55%,#0c0a06 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(201,160,60,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(201,160,60,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(201,160,60,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,160,60,.3) 30%,rgba(201,160,60,.3) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:40px;min-height:56px;padding:.6rem .2rem .5rem;font-size:.42rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:18px;height:18px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(201,160,60,.08);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(201,160,60,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(245,158,11,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(201,160,60,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(201,160,60,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(201,160,60,.07),rgba(201,160,60,.02));border:1px solid rgba(201,160,60,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(201,160,60,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(201,160,60,.10),rgba(201,160,60,.03));border:1px solid rgba(201,160,60,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(201,160,60,.10),rgba(201,160,60,.02));border:1.5px solid rgba(201,160,60,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: ¿Qué te ilusiona de la eternidad?", desc: "Preguntar a la clase qué es lo que más les ilusiona del cielo. Compartir las respuestas típicas de niños, adolescentes y adultos (intro de la semana). Conectar: esta semana estudiaremos los dos últimos capítulos de la Biblia, donde se nos muestra la recompensa que Dios tiene preparada." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración. Orar por fe para perseverar hasta el fin y por un anhelo renovado por la eternidad con Dios." },
  { time: "05–12 min", title: "Tab Cordero — Apocalipsis 7:17; 14:4; 22:4", desc: "Explorar lo que significa seguir al Cordero. Énfasis: para seguirlo en la eternidad, primero debemos seguirlo aquí. El Cordero es también nuestro Pastor (Apoc 7:17). Preguntar: ¿en qué áreas de tu vida estás siguiendo al Cordero hoy?" },
  { time: "12–18 min", title: "Tab Novia — Apocalipsis 21:2, 9-11; Juan 14:1-3", desc: "Desarrollar la analogía de la boda y la descripción de la Nueva Jerusalén. Usar la tabla de contraste 'Ahora vs. En la eternidad'. Preguntar: ¿cómo te estás preparando para esta boda celestial?" },
  { time: "18–24 min", title: "Tab Encuentro — 1 Tes 4:16-17; Apoc 22:17, 20", desc: "Explorar el momento en que veremos a Jesús cara a cara y la invitación final: «¡Ven!». Preguntar: ¿qué imaginas que sentirás cuando veas el rostro de Jesús por primera vez?" },
  { time: "24–28 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Pausar especialmente en la pregunta 4 (lo que ya no existirá) y la pregunta 6 (últimas palabras de Jesús en la Biblia). Son los momentos más emotivos de la lección." },
  { time: "28–30 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Leer la cita final de Elena G. de White sobre el fin del gran conflicto. Invitar a orar juntos: «Amén; sí, ven, Señor Jesús» (Apocalipsis 22:20)." },
];

const CORDERO_DATA = [
  {
    key: "cr1", badge: "Apoc 3:14; Heb 13:5",
    name: "1. Jesús es fiel",
    body: "¿Qué te depara el futuro? Podría parecer abrumador, emocionante, aterrador y maravilloso, todo al mismo tiempo. Ten presente que Jesús es fiel y que sus palabras son verdaderas (Apocalipsis 3:14). Habrá tiempos turbulentos por delante, pero él ha prometido que nunca te dejará ni te abandonará (Hebreos 13:5). Él hará exactamente lo que dijo que hará, como siempre lo ha hecho y siempre lo hará (Hebreos 10:23)."
  },
  {
    key: "cr2", badge: "Salmo 25:15; Col 3:2",
    name: "2. Fijar los ojos en Jesús",
    body: "Independientemente del número de días que nos queden en la tierra, debemos fijar nuestros ojos en Jesús para mirarlo con determinación. Esto no siempre es fácil en un mundo que clama por nuestra atención. Pero que podamos decir, como David: «Siempre dirijo mis ojos al Señor, porque él me libra de todo peligro» (Salmo 25:15). Se nos invita: «Piensen en las cosas del cielo, no en las de la tierra» (Colosenses 3:2)."
  },
  {
    key: "cr3", badge: "Apocalipsis 7:17",
    name: "3. El Cordero es nuestro Pastor",
    body: "Jesús, el Cordero, es también nuestro Pastor y guía nuestros pasos como nadie más puede hacerlo. Esto nos resulta muy reconfortante cuando atravesamos momentos difíciles, pero Jesús nunca dejará de guiarnos, ni siquiera en el cielo. Apocalipsis 7:17 dice: «Porque el Cordero, que está en medio del trono, será su pastor y los guiará a manantiales de aguas de vida». Como su pueblo, sus ovejas, seguiremos a Jesús en el cielo."
  },
  {
    key: "cr4", badge: "Apoc 14:4; 22:4",
    name: "4. Seguir al Cordero por siempre",
    body: "Juan el Bautista presentó a Jesús como el «Cordero de Dios» (Juan 1:35-37). Los discípulos lo siguieron de cerca, y el Apocalipsis dice que nosotros haremos lo mismo: «Son los que siguen al Cordero por dondequiera que va» (Apocalipsis 14:4). Sin embargo, para anhelar seguirlo en el cielo, primero debemos seguirlo aquí en la tierra. Una característica que define al pueblo de Dios es que «llevarán su nombre en la frente» (Apocalipsis 22:4): siempre estaremos pensando en él."
  },
];

const NOVIA_DATA = [
  {
    key: "nv1", badge: "Apoc 21:2; 19:7",
    name: "1. La analogía de la boda",
    body: "Mientras estaba exiliado en la isla de Patmos, Juan tuvo una visión de cómo será cuando nos reunamos con Dios por la eternidad. Para describir esta unión, utiliza la analogía de una boda. Una boda es un acontecimiento que la gente espera con mucha ilusión. Cuando llega el día, la novia está preciosa y todo el mundo quiere verla. Este día marca una nueva vida en unidad, y lo mismo ocurrirá con nuestra relación con Dios cuando él regrese."
  },
  {
    key: "nv2", badge: "Juan 14:1-3",
    name: "2. Jesús prepara un lugar",
    body: "Jesús ha estado preparando un lugar para nosotros: «En la casa de mi Padre muchas moradas hay; voy, pues, a preparar lugar para vosotros. Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo» (Juan 14:2-3). Este lugar hermoso es demasiado maravilloso como para describirlo. «El lenguaje humano no alcanza a describir la recompensa de los justos. Solo la conocerán quienes la contemplen» (Elena G. de White)."
  },
  {
    key: "nv3", badge: "Apocalipsis 21:9-27",
    name: "3. La Nueva Jerusalén",
    body: "Al pueblo de Dios se le llama la novia (Apocalipsis 19:7), y la ciudad santa, la nueva Jerusalén, también se describe como «una esposa ataviada para su marido» (Apocalipsis 21:2). Esta hermosa descripción muestra una conexión íntima entre el pueblo de Dios y la ciudad, ya que a ambos se los identifica como «la novia». La Nueva Jerusalén es la capital del reino y lo representa."
  },
  {
    key: "nv4", badge: "Mateo 25:13",
    name: "4. Estar preparados",
    body: "Debido a su gran amor por los seres humanos, Dios espera con ansias el día de la boda con nosotros y anhela que estemos listos para morar con él para siempre. Él se está preparando para ese día y nos invita a prepararnos también. Dios no quiere que esta «boda» nos tome por sorpresa (Mateo 25:13). El universo es la congregación que verá cómo tiene lugar este acontecimiento, y nosotros somos algunas de las figuras centrales de esta historia."
  },
];

const ENCUENTRO_DATA = [
  {
    key: "en1", badge: "Gén 2:7; Ecl 3:11",
    name: "1. Creados para estar con Dios",
    body: "Dios nos creó para que estuviéramos cerca de él (Génesis 2:7) y lo ha dado todo para restaurar nuestra relación rota (Juan 3:16). A pesar de que él puso la eternidad en nuestro corazón, no podemos comprender lo que Dios ha hecho desde el principio hasta el fin (Eclesiastés 3:11). Somos parte del gran conflicto, pero con demasiada frecuencia olvidamos el gran costo de lo que Dios sacrificó para restaurar la relación que desea tener con nosotros."
  },
  {
    key: "en2", badge: "1 Tes 4:16-17; Apoc 14:14",
    name: "2. La segunda venida",
    body: "Un día, aparecerá una pequeña nube blanca en Oriente. A medida que se acerque, veremos a «alguien parecido al Hijo del hombre» con «una corona de oro en la cabeza» (Apocalipsis 14:14). Miles de ángeles acompañarán a Jesús, y todos los ojos lo verán. Oiremos su grito, un toque de trompeta de Dios, y las tumbas de aquellos que durmieron en Cristo se abrirán y resucitarán primero (1 Tesalonicenses 4:16). Reconocerán la voz de Aquel que los llama."
  },
  {
    key: "en3", badge: "Apocalipsis 22:4",
    name: "3. Cara a cara",
    body: "¡Qué pensamiento tan asombroso! Un día veremos a Jesús, lo veremos de verdad. ¡Escucharemos su voz y confesaremos que él es el Señor! Aquel sobre quien hemos leído, a quien hemos orado, de quien hemos hablado a otros, y Aquel a quien nuestros corazones han anhelado… lo veremos cara a cara. Cada oración perseverante, cada momento en que hemos priorizado el tiempo con él, cada prueba, culminará en ver su rostro (Apocalipsis 22:4)."
  },
  {
    key: "en4", badge: "Apocalipsis 22:17, 20",
    name: "4. «¡Vengan!»",
    body: "«El Espíritu y la Esposa dicen: Ven. Y el que oye, diga: Ven. Y el que tiene sed, venga; y el que quiera, tome del agua de la vida gratuitamente» (Apocalipsis 22:17). Jesús ofrece el agua de la vida a toda alma sedienta. Que responder al llamado de Jesús sea la prioridad de tu vida. Las últimas palabras de la Biblia prometen: «Ciertamente vengo en breve. Amén; sí, ven, Señor Jesús» (Apocalipsis 22:20)."
  },
];

const COMPARE_AHORA = [
  "Lágrimas, dolor y sufrimiento",
  "Muerte y separación de seres queridos",
  "Pecado y tentación constante",
  "Visión borrosa de Dios, como en un espejo",
  "Pruebas y tribulaciones",
  "Tiempo limitado, vida fugaz",
];

const COMPARE_ETERNIDAD = [
  "No más llanto, clamor ni dolor",
  "Vida eterna y reencuentro con los redimidos",
  "Santidad y pureza perfecta, sin pecado",
  "Ver a Dios cara a cara, su rostro",
  "Gozo, paz y plenitud eternos",
  "Eternidad sin fin junto a Jesús",
];

const VERSES = [
  {
    ref: "Apocalipsis 21:2-5", isBase: true,
    text: `2 Y yo Juan vi la santa ciudad, la nueva Jerusalén, descender del cielo, de Dios, dispuesta como una esposa ataviada para su marido. 3 Y oí una gran voz del cielo que decía: He aquí el tabernáculo de Dios con los hombres, y él morará con ellos; y ellos serán su pueblo, y Dios mismo estará con ellos como su Dios. 4 Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto, ni clamor, ni dolor; porque las primeras cosas pasaron. 5 Y el que estaba sentado en el trono dijo: He aquí, yo hago nuevas todas las cosas. Y me dijo: Escribe; porque estas palabras son fieles y verdaderas.`
  },
  {
    ref: "Apocalipsis 5:12",
    text: `Que decían a gran voz: El Cordero que fue inmolado es digno de tomar el poder, las riquezas, la sabiduría, la fortaleza, la honra, la gloria y la alabanza.`
  },
  {
    ref: "Apocalipsis 7:16-17",
    text: `16 Ya no tendrán hambre ni sed, y el sol no caerá más sobre ellos, ni calor alguno; 17 porque el Cordero que está en medio del trono los pastoreará, y los guiará a fuentes de aguas de vida; y Dios enjugará toda lágrima de los ojos de ellos.`
  },
  {
    ref: "Apocalipsis 14:4",
    text: `Estos son los que no se contaminaron con mujeres, pues son vírgenes. Estos son los que siguen al Cordero por dondequiera que va. Estos fueron redimidos de entre los hombres como primicias para Dios y para el Cordero.`
  },
  {
    ref: "Apocalipsis 19:7",
    text: `Gocémonos y alegrémonos y démosle gloria; porque han llegado las bodas del Cordero, y su esposa se ha preparado.`
  },
  {
    ref: "Apocalipsis 22:4",
    text: `Y verán su rostro, y su nombre estará en sus frentes.`
  },
  {
    ref: "Apocalipsis 22:12",
    text: `He aquí yo vengo pronto, y mi galardón conmigo, para recompensar a cada uno según sea su obra.`
  },
  {
    ref: "Apocalipsis 22:17",
    text: `Y el Espíritu y la Esposa dicen: Ven. Y el que oye, diga: Ven. Y el que tiene sed, venga; y el que quiera, tome del agua de la vida gratuitamente.`
  },
  {
    ref: "Apocalipsis 22:20",
    text: `El que da testimonio de estas cosas dice: Ciertamente vengo en breve. Amén; sí, ven, Señor Jesús.`
  },
  {
    ref: "Juan 14:1-3",
    text: `1 No se turbe vuestro corazón; creéis en Dios, creed también en mí. 2 En la casa de mi Padre muchas moradas hay; si así no fuera, yo os lo hubiera dicho; voy, pues, a preparar lugar para vosotros. 3 Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo, para que donde yo estoy, vosotros también estéis.`
  },
  {
    ref: "Mateo 24:13",
    text: `Mas el que persevere hasta el fin, éste será salvo.`
  },
  {
    ref: "Hebreos 13:5",
    text: `Sean vuestras costumbres sin avaricia, contentos con lo que tenéis ahora; porque él dijo: No te desampararé, ni te dejaré.`
  },
  {
    ref: "Salmo 25:15",
    text: `Mis ojos están siempre hacia Jehová, porque él sacará mis pies de la red.`
  },
  {
    ref: "Colosenses 3:2",
    text: `Poned la mira en las cosas de arriba, no en las de la tierra.`
  },
  {
    ref: "Filipenses 3:20-21",
    text: `20 Mas nuestra ciudadanía está en los cielos, de donde también esperamos al Salvador, al Señor Jesucristo; 21 el cual transformará el cuerpo de la humillación nuestra, para que sea semejante al cuerpo de la gloria suya, por el poder con el cual puede también sujetar a sí mismo todas las cosas.`
  },
  {
    ref: "1 Tesalonicenses 4:16-17",
    text: `16 Porque el Señor mismo con voz de mando, con voz de arcángel, y con trompeta de Dios, descenderá del cielo; y los muertos en Cristo resucitarán primero. 17 Luego nosotros los que vivimos, los que hayamos quedado, seremos arrebatados juntamente con ellos en las nubes para recibir al Señor en el aire, y así estaremos siempre con el Señor.`
  },
  {
    ref: "Isaías 25:8-9",
    text: `8 Destruirá a la muerte para siempre; y enjugará Jehová el Señor toda lágrima de todos los rostros; y quitará la afrenta de su pueblo de toda la tierra; porque Jehová lo ha dicho. 9 Y se dirá en aquel día: He aquí, éste es nuestro Dios, le hemos esperado, y nos salvará; éste es Jehová a quien hemos esperado, nos gozaremos y nos alegraremos en su salvación.`
  },
  {
    ref: "Job 19:25-27",
    text: `25 Yo sé que mi Redentor vive, y al fin se levantará sobre el polvo; 26 y después de deshecha esta mi piel, en mi carne he de ver a Dios; 27 al cual veré por mí mismo, y mis ojos lo verán, y no otro, aunque mi corazón desfallece dentro de mí.`
  },
  {
    ref: "2 Corintios 4:16-18",
    text: `16 Por tanto, no desmayamos; antes aunque este nuestro hombre exterior se va desgastando, el interior no obstante se renueva de día en día. 17 Porque esta leve tribulación momentánea produce en nosotros un cada vez más excelente y eterno peso de gloria; 18 no mirando nosotros las cosas que se ven, sino las que no se ven; pues las cosas que se ven son temporales, pero las que no se ven son eternas.`
  },
  {
    ref: "Apocalipsis 14:14",
    text: `Miré, y he aquí una nube blanca; y sobre la nube uno sentado semejante al Hijo del Hombre, que tenía en la cabeza una corona de oro, y en la mano una hoz aguda.`
  },
];

const QUIZ_DATA = [
  {
    q: "Según Apocalipsis 7:17, ¿qué hará el Cordero por su pueblo en la eternidad?",
    opts: [
      "Los gobernará con vara de hierro desde su trono",
      "Los pastoreará y guiará a fuentes de aguas de vida",
      "Los dejará libres para explorar el universo solos",
      "Los enviará a predicar a otros mundos caídos"
    ],
    ans: 1,
    feedback: "«El Cordero que está en medio del trono los pastoreará, y los guiará a fuentes de aguas de vida; y Dios enjugará toda lágrima de los ojos de ellos» (Apocalipsis 7:17). El Cordero es también nuestro Pastor, y nunca dejará de guiarnos."
  },
  {
    q: "¿Qué analogía utiliza Juan para describir la unión de Dios con su pueblo en la eternidad? (Apocalipsis 21:2)",
    opts: [
      "Una batalla victoriosa contra el enemigo",
      "Un banquete de coronación real",
      "Una boda entre el Cordero y su esposa",
      "Un tratado de paz entre dos reinos"
    ],
    ans: 2,
    feedback: "Juan utiliza la analogía de una boda: «Vi la santa ciudad, la nueva Jerusalén, descender del cielo, de Dios, dispuesta como una esposa ataviada para su marido» (Apocalipsis 21:2). Tanto el pueblo de Dios como la ciudad santa son identificados como «la novia»."
  },
  {
    q: "Según Apocalipsis 22:4, ¿qué característica define al pueblo de Dios?",
    opts: [
      "Llevarán su nombre en la frente, siempre pensando en él",
      "Vestirán túnicas blancas con coronas de piedras preciosas",
      "Tendrán alas como los ángeles para volar entre las estrellas",
      "Brillarán con una luz propia visible a todo el universo"
    ],
    ans: 0,
    feedback: "«Verán su rostro, y su nombre estará en sus frentes» (Apocalipsis 22:4). Esto significa que siempre estaremos pensando en él, identificados para siempre con nuestro Redentor."
  },
  {
    q: "Según Apocalipsis 21:4, ¿qué promete Dios que ya no existirá?",
    opts: [
      "Solo el dolor físico y las enfermedades",
      "Muerte, llanto, clamor ni dolor",
      "Solo la muerte y el sufrimiento extremo",
      "Solo las guerras y los desastres naturales"
    ],
    ans: 1,
    feedback: "«Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto, ni clamor, ni dolor; porque las primeras cosas pasaron» (Apocalipsis 21:4). Todo lo que causa sufrimiento será eliminado para siempre."
  },
  {
    q: "¿Qué prometió Jesús en Juan 14:1-3?",
    opts: [
      "Que enviaría ángeles para protegernos de todo peligro terrenal",
      "Que nunca tendríamos problemas mientras vivamos en la tierra",
      "Que va a preparar un lugar para nosotros y volverá a buscarnos",
      "Que nos daría riquezas y éxito como señal de su bendición"
    ],
    ans: 2,
    feedback: "«Voy, pues, a preparar lugar para vosotros. Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo, para que donde yo estoy, vosotros también estéis» (Juan 14:2-3). Jesús ha estado preparando un lugar para nosotros."
  },
  {
    q: "¿Cuáles son las últimas palabras de Jesús registradas en la Biblia? (Apocalipsis 22:20)",
    opts: [
      "«Id y haced discípulos a todas las naciones»",
      "«Yo soy el camino, la verdad y la vida»",
      "«Ciertamente vengo en breve»",
      "«Todo está consumado»"
    ],
    ans: 2,
    feedback: "«El que da testimonio de estas cosas dice: Ciertamente vengo en breve. Amén; sí, ven, Señor Jesús» (Apocalipsis 22:20). Las últimas palabras de Jesús en la Biblia son una promesa de que regresará pronto."
  },
  {
    q: "Según la lección, ¿qué debemos hacer para seguir al Cordero en la eternidad?",
    opts: [
      "Esperar pasivamente su regreso sin hacer nada",
      "Seguirlo primero aquí en la tierra, ahora",
      "Memorizar todo el libro de Apocalipsis",
      "Construir una réplica de la Nueva Jerusalén"
    ],
    ans: 1,
    feedback: "La lección dice: «Para anhelar seguirlo en el cielo, primero debemos seguirlo aquí en la tierra». Lo que hacemos ahora — seguir al Cordero cada día — es la preparación para seguirlo por la eternidad."
  },
  {
    q: "¿Qué invitación se da en Apocalipsis 22:17?",
    opts: [
      "Vender todo y retirarse a esperar la segunda venida",
      "Construir templos y santuarios en honor a Dios",
      "Venir y tomar del agua de la vida gratuitamente",
      "Huir de las ciudades terrenales a lugares seguros"
    ],
    ans: 2,
    feedback: "«El Espíritu y la Esposa dicen: Ven. Y el que oye, diga: Ven. Y el que tiene sed, venga; y el que quiera, tome del agua de la vida gratuitamente» (Apocalipsis 22:17). Jesús ofrece el agua de la vida a toda alma sedienta, sin costo alguno."
  },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿Qué hará que el cielo y la tierra nueva sean diferentes de la vida actual?", ref: "Apocalipsis 21:1-5" },
  { key: "rfl2", q: "¿Qué tipo de relación cercana con Dios disfrutarán los salvados para siempre?", ref: "Juan 14:1-3 · Apocalipsis 22:4" },
  { key: "rfl3", q: "¿Cuál es la amorosa invitación de Dios para nosotros en preparación para su venida?", ref: "Apocalipsis 22:17" },
  { key: "rfl4", q: "¿Para qué debemos estar siempre preparados y esperar con ansias?", ref: "Apocalipsis 22:7, 12, 20" },
  { key: "rfl5", q: "¿Qué aspecto de las lecciones de este trimestre deseas recordar más para mantener fuerte tu relación con Dios?", ref: "Apocalipsis 22:4 · Mateo 24:13" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Hacia <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>la eternidad</em></div>
      <div className="sec-sub">Decimotercera Semana · Apocalipsis 21–22</div>

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
            <p>¿Qué te ilusiona de la eternidad? Si le preguntas a un niño, tal vez te responda: «Montar un tigre» o «volar a diferentes planetas». Si le preguntas a un adulto, tal vez diga: «Estar en un lugar donde no haya más dolor ni muerte» o «reencontrarme con mis seres queridos». Todas estas respuestas reflejan aspectos de cómo será el cielo, pero solo dan una pequeña idea de las maravillas que nos esperan. Sin duda, la mayor bendición será ver finalmente a Jesús y darle las gracias, en persona, por lo que hizo por nosotros.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Apocalipsis 21:3-4
            </div>
            <div className="honey-text">
              «He aquí el tabernáculo de Dios con los hombres, y él morará con ellos; y ellos serán su pueblo, y Dios mismo estará con ellos como su Dios. Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto, ni clamor, ni dolor.»
            </div>
            <div className="honey-ref">Apocalipsis 21:3-4 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Aunque el cielo está mucho más allá del lenguaje humano,</strong> Dios nos permite vislumbrarlo y quiere que esperemos con ilusión la eternidad con él.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Debido a su gran amor por cada uno,</strong> Dios desea tener una relación cercana con todos ahora y pasar la eternidad con nosotros.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text"><strong>Dios está preparando una gran boda</strong> y quiere que nosotros también estemos preparados para ese glorioso día.</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}

function TabCordero({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">El Cordero</div>
      <div className="sec-sub">Seguir al Cordero ahora y por toda la eternidad</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>«¡El Cordero que fue sacrificado es digno de recibir el poder y la riqueza, la sabiduría y la fuerza, el honor, la gloria y la alabanza!» (Apocalipsis 5:12). Jesús es el Cordero de Dios, y al mismo tiempo nuestro Pastor. Solo tenemos que mantener la fe hasta que él venga.</p>
      </div>

      {CORDERO_DATA.map(item => (
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
        <p>¿En qué áreas de tu vida estás siguiendo al Cordero hoy? ¿Qué significa para ti fijar los ojos en Jesús en medio de un mundo que clama por tu atención?</p>
      </div>
    </>
  );
}

function TabNovia({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">La Novia</div>
      <div className="sec-sub">La boda del Cordero — Apocalipsis 21:2, 9-27</div>

      {NOVIA_DATA.map(item => (
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
        <div className="card-label" style={{ padding: "0 .25rem .5rem" }}>Ahora vs. En la eternidad</div>
        <div className="compare-grid">
          <div>
            <div className="compare-header red">Ahora</div>
            <div className="compare-cell">
              {COMPARE_AHORA.map((item, i) => (
                <div key={i} className="compare-item">{item}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="compare-header ok">En la eternidad</div>
            <div className="compare-cell">
              {COMPARE_ETERNIDAD.map((item, i) => (
                <div key={i} className="compare-item">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><Star size={11} /> Elena G. de White · El conflicto de los siglos, cap. 43, p. 654</div>
        <div className="egw-text">«<strong>El lenguaje humano no alcanza a describir la recompensa de los justos.</strong> Solo la conocerán quienes la contemplen. Ninguna inteligencia limitada puede comprender la gloria del paraíso de Dios.»</div>
      </div>
    </>
  );
}

function TabEncuentro({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Encuentro</div>
      <div className="sec-sub">Por fin, cara a cara — Apocalipsis 22:4, 17, 20</div>

      {ENCUENTRO_DATA.map(item => (
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · La fe por la cual vivo, 25 de diciembre</div>
        <div className="egw-text">«Entonces las naciones no reconocerán otra ley que la del cielo. Todos formarán una familia feliz y unida, revestidos con las vestiduras de alabanza y agradecimiento. [...] Dios y Cristo unirán su voz para proclamar: <strong>"No habrá más pecado, ni habrá más muerte".</strong>»</div>
      </div>

      <div className="card" style={{ borderColor: "var(--brd2)", marginTop: ".4rem" }}>
        <div className="card-label">Para reflexionar</div>
        <p>¿Qué imaginas que vas a pensar y sentir cuando veas por primera vez el rostro de Jesús? ¿Cómo cambia nuestra perspectiva de las pruebas actuales el saber que estaremos con él en la eternidad? (2 Corintios 4:16-18).</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien la esperanza gloriosa que Dios nos ha prometido." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre la recompensa eterna." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Apocalipsis 21 y 22." :
                "Vale la pena releer el material. Estos últimos capítulos de la Biblia son fundamentales para nuestra esperanza.";
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
        <div className="card-label">Puntos clave · Apocalipsis 21–22</div>
        <p>Aunque el cielo está mucho más allá del lenguaje y la imaginación humanos, Dios nos permite vislumbrarlo y quiere que esperemos con ilusión la eternidad con él. Debido a su gran amor, Dios desea tener una relación cercana con todos ahora y pasar la eternidad con nosotros. Dios está preparando una gran boda y quiere que nosotros también estemos preparados.</p>
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · El conflicto de los siglos, cap. 43, p. 657</div>
        <div className="egw-text">«El gran conflicto ha terminado. Ya no hay más pecado ni pecadores. Todo el universo está purificado. La misma pulsación de armonía y de gozo late en toda la creación. <strong>De Aquel que todo lo creó manan vida, luz y contentamiento por toda la extensión del espacio infinito.</strong> Desde el átomo más imperceptible hasta el mundo más vasto, todas las cosas animadas e inanimadas, declaran en su belleza sin mácula y en júbilo perfecto, que Dios es amor.»</div>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Hemos recorrido un trimestre completo explorando lo que significa crecer en nuestra relación con Dios. Desde chequear nuestra realidad espiritual hasta aprender a orar, estudiar la Biblia, tener fe y hablar de Jesús al mundo.</p>
          <br />
          <p>Ahora, al final del camino, Apocalipsis nos recuerda hacia dónde nos dirigimos: <strong>una eternidad con Aquel que nos amó hasta la muerte.</strong> Un día no habrá más lágrimas, ni dolor, ni muerte. Veremos su rostro. Llevaremos su nombre.</p>
          <br />
          <p>Pero para anhelar seguir al Cordero en la eternidad, primero debemos seguirlo aquí. Cada día que fijamos nuestros ojos en Jesús, cada oración, cada vez que hablamos de él, nos acerca más a ese glorioso encuentro.</p>
          <br />
          <p>Las últimas palabras de la Biblia son una promesa y una oración: <strong>«Ciertamente vengo en breve. Amén; sí, ven, Señor Jesús»</strong> (Apocalipsis 22:20). Que esta sea también tu oración hoy y cada día hasta que lo veas cara a cara.</p>
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
    { id: "cordero",    label: "Cordero",    Icon: Crown },
    { id: "novia",      label: "Novia",      Icon: Sparkles },
    { id: "encuentro",  label: "Encuentro",  Icon: Eye },
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
              InVerso · Semana 13
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Hacia <em>la eternidad</em>
            </h1>
            <div className="hero-ref">Apocalipsis 21–22 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"    && <TabInicio teacherMode={teacherMode} />}
            {tab === "cordero"   && <TabCordero openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "novia"     && <TabNovia openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "encuentro" && <TabEncuentro openExpand={openExpand} toggleExpand={toggleExpand} />}
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
