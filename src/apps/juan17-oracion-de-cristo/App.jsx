import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Users, Search, Sparkles, Link as LinkIcon
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#0b0813;--bg2:#120e20;--bg3:#1c1738;--surf:#1f1a3a;--surf2:#282050;--brd:#2f2755;--brd2:#443a75;--tx:#eee9f7;--tx2:#a99dc9;--tx3:#6c5f97;--acc:#7c5cc0;--acc2:#9b7fd9;--acc3:#d4c5f0;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#e0a83c;--warn-d:rgba(224,168,60,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1a1436 0%,#120e20 55%,#0b0813 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(124,92,192,.22) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(124,92,192,.28);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(124,92,192,.06)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(124,92,192,.35) 30%,rgba(124,92,192,.35) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(124,92,192,.12);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(124,92,192,.16);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(224,168,60,.16);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(124,92,192,.05)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(124,92,192,.16);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(124,92,192,.10),rgba(124,92,192,.02));border:1px solid rgba(124,92,192,.22);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(124,92,192,.08);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(124,92,192,.14),rgba(124,92,192,.03));border:1px solid rgba(124,92,192,.28);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(124,92,192,.14),rgba(124,92,192,.03));border:1.5px solid rgba(124,92,192,.30);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(124,92,192,.07);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: Orar por cosas más grandes", desc: "Compartir brevemente la idea de la intro: el poder de la oración intercesora y cómo Dios actúa cuando nos atrevemos a pedirle cosas grandes que lo glorifican a él." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración del grupo. Orar agradeciendo que Jesús mismo ora por nosotros ahora mismo." },
  { time: "05–11 min", title: "Tab Interioriza — Juan 17:1-5", desc: "Trabajar la oración de Jesús por sí mismo: reconoce que ha llegado la hora, pide ser glorificado y define la vida eterna como conocer a Dios (Juan 17:3)." },
  { time: "11–17 min", title: "Tab Interpreta — Juan 17:6-19", desc: "Explicar la frase repetida «por los que me diste», la paradoja de estar en el mundo sin ser del mundo (17:11, 14, 16, 18) y la santificación por la verdad (17:17)." },
  { time: "17–21 min", title: "Tab Investiga — referencias cruzadas", desc: "Repasar los versículos sobre dar gloria a Dios (Mateo 5:16; Romanos 15:6; 1 Corintios 6:20; 1 Pedro 2:12, 4:16) y la intercesión de Cristo (Lucas 22:31, 32; Romanos 8:34; Juan 12:28; 21:19; Hebreos 7:25)." },
  { time: "21–25 min", title: "Tab Unidad — Juan 17:20-26", desc: "Desarrollar la oración de Jesús por todos los futuros creyentes: la unidad como la de la Trinidad (17:21-23) y su anhelo de que estemos con él (17:24)." },
  { time: "25–28 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto, deteniéndose en la definición de vida eterna (17:3) y en la intercesión continua de Cristo (Hebreos 7:25)." },
  { time: "28–30 min", title: "Cierre e inQuiere", desc: "Usar los tres bloques de discusión: por sí mismo, por sus discípulos y por todos los creyentes. Cerrar con la cita de Elena G. de White y los «Puntos clave para recordar»." },
];

const INTERIORIZA_DATA = [
  {
    key: "in1", badge: "Juan 17:1",
    name: "1. Ha llegado la hora",
    body: "Jesús comienza su oración reconociendo que había llegado la hora: su tiempo en la tierra estaba llegando a su fin y la profecía se estaba cumpliendo. En cuestión de horas, Judas lo traicionaría, sus discípulos más cercanos se quedarían dormidos cuando más necesitaba sus oraciones, todos huirían tras su arresto y Pedro lo negaría. Aun así, su oración por sí mismo fue sorprendentemente breve."
  },
  {
    key: "in2", badge: "Juan 17:1, 5",
    name: "2. Glorifícame para que te glorifique",
    body: "Jesús le pidió al Padre que lo glorificara, para que él, a su vez, pudiera glorificar al Padre. Esta oración tiene tanto de enseñanza como de petición personal: sabía que los discípulos podían oírlo. Su mayor preocupación, incluso frente a la cruz, era que Dios fuera glorificado a través de todo lo que estaba a punto de suceder."
  },
  {
    key: "in3", badge: "Juan 17:3",
    name: "3. La vida eterna es conocerte",
    body: "Al repasar la misión que el Padre le había encomendado, Jesús definió la vida eterna de una manera inesperada. Solemos pensar que es vivir algún día en el cielo, libres de las cargas de este mundo. Pero para Jesús, la vida eterna se basa totalmente en una relación: conocer íntimamente a Dios el Padre y a Jesucristo, a quien el Padre envió. No hay que esperar hasta el cielo para empezar a experimentarla: comienza aquí y ahora."
  },
  {
    key: "in4", badge: "Juan 17:5",
    name: "4. La gloria que tuve contigo",
    body: "Consciente de que su misión de reconciliar a la humanidad con Dios dependía de su reunificación con el Padre, Jesús expresó su profundo anhelo de volver a estar con él y disfrutar de la estrecha relación que compartían antes de que existiera el mundo. Su propósito no se cumpliría hasta que regresara al cielo y fuera restaurado a su lugar junto al Padre."
  },
];

const INTERPRETA_DATA = [
  {
    key: "it1", badge: "Juan 17:6, 9, 11, 12, 24",
    name: "1. Por los que me diste",
    body: "Jesús repitió esta frase, con ligeras variaciones, cinco veces durante su oración. El cuidado de los discípulos pasó del Padre a Jesús, y luego de vuelta al Padre; el Espíritu Santo desempeña este mismo papel en Juan 14-16. Es profundamente alentador saber que toda la Trinidad se preocupa por nosotros."
  },
  {
    key: "it2", badge: "Juan 17:11, 14, 16, 18",
    name: "2. En el mundo, pero no del mundo",
    body: "Los discípulos debían estar «en el mundo», pero «no ser del mundo». Jesús llama a sus seguidores a estar presentes en el mundo sin acoplarse a él: no retirarse de la sociedad, sino mezclarse y relacionarse con la gente sin comprometer sus principios ni prácticas. Así como el Padre lo envió al mundo, él envió a sus discípulos al mundo."
  },
  {
    key: "it3", badge: "Juan 17:17",
    name: "3. Santifícalos en tu verdad",
    body: "Esta hermosa paradoja —estar en el mundo sin ser del mundo— solo es posible en la medida en que las personas se transformen por la verdad de la Palabra de Dios. La política, la envidia, el orgullo y la ambición egoísta a menudo dividían a los discípulos; Jesús oró para que, a pesar de sus diferencias, se unieran y estuvieran unidos entre sí."
  },
  {
    key: "it4", badge: "Juan 17:12",
    name: "4. El caso de Judas",
    body: "Estas oraciones, lamentablemente, no se cumplirían en la vida de Judas, un hecho que Jesús reconoció abiertamente. Judas ya se había marchado, pero Jesús no lo había olvidado. Su deserción inquietó profundamente a los demás discípulos, pero esta oración les recuerda que Jesús anticipó completamente la traición."
  },
];

const UNIDAD_DATA = [
  {
    key: "un1", badge: "Juan 17:20",
    name: "1. Él oró por vos",
    body: "La oración de Jesús por sus discípulos no se limitó a los doce. Él nos incluyó a todos cuando oró «por los que han de creer en mí al oír el mensaje de ellos». ¿Sabías que Jesús oró por vos, hace dos mil años, en ese huerto? Sus oraciones en la tierra fueron un pequeño reflejo de su continua intercesión en el cielo."
  },
  {
    key: "un2", badge: "Juan 17:21-23",
    name: "2. Unidad como la de la Trinidad",
    body: "Jesús oró para que fuéramos uno con los demás, no en una unidad superficial, sino en un vínculo profundo que solo puede surgir como resultado de la unidad con Cristo. Que seamos uno tal y como él y el Padre son uno. No hay mayor unidad que la de la Trinidad, y Jesús desea esa misma unidad para nosotros."
  },
  {
    key: "un3", badge: "Juan 17:22, 23",
    name: "3. Su gloria a través de nosotros",
    body: "La unidad entre nosotros es una parte de la gloria de su carácter que Cristo quiere revelar a través de nosotros. Así como el Padre reveló su gloria a través de la vida y el ministerio de Jesús, Dios quiere revelar su gloria a través de nuestras vidas hoy. Esta unidad, este amor y el fruto que producen serán evidencia para el mundo de que Jesús es real."
  },
  {
    key: "un4", badge: "Juan 17:24",
    name: "4. Donde yo estoy, quiero que estén conmigo",
    body: "Jesús espera con ansias el momento en que finalmente seamos glorificados con él. Suplica con fervor: «Padre, tú me los diste, y quiero que estén conmigo donde yo voy a estar». Su mayor anhelo es que estemos con él en el cielo, que lo veamos a él y al Padre cara a cara y que conozcamos la profundidad de su amor."
  },
];

const INVESTIGA_GLORIA = [
  { key: "ig1", badge: "Mateo 5:16", name: "Que glorifiquen a tu Padre", body: "«Así alumbre vuestra luz delante de los hombres, para que vean vuestras buenas obras, y glorifiquen a vuestro Padre que está en los cielos» (Mateo 5:16)." },
  { key: "ig2", badge: "Romanos 15:6", name: "Unánimes, a una voz", body: "«Para que unánimes, a una voz, glorifiquéis al Dios y Padre de nuestro Señor Jesucristo» (Romanos 15:6). La unidad y la gloria a Dios están profundamente conectadas." },
  { key: "ig3", badge: "1 Corintios 6:20", name: "Comprados por precio", body: "«Porque habéis sido comprados por precio; glorificad, pues, a Dios en vuestro cuerpo y en vuestro espíritu, los cuales son de Dios» (1 Corintios 6:20)." },
  { key: "ig4", badge: "1 Pedro 2:12; 4:16", name: "Glorificar a Dios incluso al sufrir", body: "«Para que en lo que murmuran de vosotros como de malhechores, glorifiquen a Dios en el día de la visitación, al considerar vuestras buenas obras» (1 Pedro 2:12). «Si alguno padece como cristiano, no se avergüence, sino glorifique a Dios en esto» (1 Pedro 4:16)." },
];

const INVESTIGA_INTERCESION = [
  { key: "ii1", badge: "Lucas 22:31, 32", name: "He rogado por ti", body: "«Simón, Simón, he aquí Satanás os ha pedido para zarandearos como a trigo; pero yo he rogado por ti, que tu fe no falte; y tú, una vez vuelto, confirma a tus hermanos» (Lucas 22:31, 32)." },
  { key: "ii2", badge: "Romanos 8:34", name: "El que también intercede por nosotros", body: "«¿Quién es el que condenará? Cristo es el que murió; más aún, el que también resucitó, el que además está a la diestra de Dios, el que también intercede por nosotros» (Romanos 8:34)." },
  { key: "ii3", badge: "Juan 12:28; 21:19", name: "Glorifica tu nombre", body: "«Padre, glorifica tu nombre. Entonces vino una voz del cielo: Lo he glorificado, y lo glorificaré otra vez» (Juan 12:28). Más adelante, Jesús anticipa que hasta la muerte de Pedro glorificaría a Dios (Juan 21:19)." },
  { key: "ii4", badge: "Hebreos 7:25", name: "Vive para siempre para interceder", body: "«Por lo cual puede también salvar perpetuamente a los que por él se acercan a Dios, viviendo siempre para interceder por ellos» (Hebreos 7:25). Las oraciones de Jesús en la tierra fueron apenas un reflejo de su continua intercesión en el cielo." },
];

const VERSES = [
  {
    ref: "Juan 17:1-5",
    text: `1 Estas cosas habló Jesús, y levantando los ojos al cielo, dijo: Padre, la hora ha llegado; glorifica a tu Hijo, para que también tu Hijo te glorifique a ti; 2 como le has dado potestad sobre toda carne, para que dé vida eterna a todos los que le diste. 3 Y esta es la vida eterna: que te conozcan a ti, el único Dios verdadero, y a Jesucristo, a quien has enviado. 4 Yo te he glorificado en la tierra; he acabado la obra que me diste que hiciese. 5 Ahora pues, Padre, glorifícame tú al lado tuyo, con aquella gloria que tuve contigo antes que el mundo fuese.`
  },
  {
    ref: "Juan 17:6-8",
    text: `6 He manifestado tu nombre a los hombres que del mundo me diste; tuyos eran, y me los diste, y han guardado tu palabra. 7 Ahora han conocido que todas las cosas que me has dado, proceden de ti; 8 porque las palabras que me diste, les he dado; y ellos las recibieron, y han conocido verdaderamente que salí de ti, y han creído que tú me enviaste.`
  },
  {
    ref: "Juan 17:9-13",
    text: `9 Yo ruego por ellos; no ruego por el mundo, sino por los que me diste; porque tuyos son, 10 y todo lo mío es tuyo, y lo tuyo es mío; y he sido glorificado en ellos. 11 Y ya no estoy en el mundo; mas éstos están en el mundo, y yo voy a ti. Padre santo, guárdalos en tu nombre, a los que me has dado, para que sean uno, así como nosotros. 12 Cuando estaba con ellos en el mundo, yo los guardaba en tu nombre; a los que me diste, yo los guardé, y ninguno de ellos se perdió, sino el hijo de perdición, para que la Escritura se cumpliese. 13 Pero ahora voy a ti; y hablo esto en el mundo, para que tengan mi gozo cumplido en sí mismos.`
  },
  {
    ref: "Juan 17:14-19",
    text: `14 Yo les he dado tu palabra; y el mundo los aborreció, porque no son del mundo, como tampoco yo soy del mundo. 15 No ruego que los quites del mundo, sino que los guardes del mal. 16 No son del mundo, como tampoco yo soy del mundo. 17 Santifícalos en tu verdad; tu palabra es verdad. 18 Como tú me enviaste al mundo, así yo los he enviado al mundo. 19 Y por ellos yo me santifico a mí mismo, para que también ellos sean santificados en la verdad.`
  },
  {
    ref: "Juan 17:20-26", isBase: true,
    text: `20 Mas no ruego solamente por éstos, sino también por los que han de creer en mí por la palabra de ellos, 21 para que todos sean uno; como tú, oh Padre, en mí, y yo en ti, que también ellos sean uno en nosotros; para que el mundo crea que tú me enviaste. 22 La gloria que me diste, yo les he dado, para que sean uno, así como nosotros somos uno. 23 Yo en ellos, y tú en mí, para que sean perfectos en unidad, para que el mundo conozca que tú me enviaste, y que los has amado a ellos como también a mí me has amado. 24 Padre, aquellos que me has dado, quiero que donde yo estoy, también ellos estén conmigo, para que vean mi gloria que me has dado; porque me has amado desde antes de la fundación del mundo. 25 Padre justo, el mundo no te ha conocido, pero yo te he conocido, y éstos han conocido que tú me enviaste. 26 Y les he dado a conocer tu nombre, y lo daré a conocer aún, para que el amor con que me has amado esté en ellos, y yo en ellos.`
  },
  {
    ref: "Mateo 5:16",
    text: `Así alumbre vuestra luz delante de los hombres, para que vean vuestras buenas obras, y glorifiquen a vuestro Padre que está en los cielos.`
  },
  {
    ref: "Romanos 15:6",
    text: `Para que unánimes, a una voz, glorifiquéis al Dios y Padre de nuestro Señor Jesucristo.`
  },
  {
    ref: "1 Corintios 6:20",
    text: `Porque habéis sido comprados por precio; glorificad, pues, a Dios en vuestro cuerpo y en vuestro espíritu, los cuales son de Dios.`
  },
  {
    ref: "1 Pedro 2:12",
    text: `Manteniendo buena vuestra manera de vivir entre los gentiles; para que en lo que murmuran de vosotros como de malhechores, glorifiquen a Dios en el día de la visitación, al considerar vuestras buenas obras.`
  },
  {
    ref: "1 Pedro 4:16",
    text: `Pero si alguno padece como cristiano, no se avergüence, sino glorifique a Dios en esto.`
  },
  {
    ref: "Lucas 22:31, 32",
    text: `31 Dijo también el Señor: Simón, Simón, he aquí Satanás os ha pedido para zarandearos como a trigo; 32 pero yo he rogado por ti, que tu fe no falte; y tú, una vez vuelto, confirma a tus hermanos.`
  },
  {
    ref: "Romanos 8:34",
    text: `¿Quién es el que condenará? Cristo es el que murió; más aún, el que también resucitó, el que además está a la diestra de Dios, el que también intercede por nosotros.`
  },
  {
    ref: "Juan 12:28",
    text: `Padre, glorifica tu nombre. Entonces vino una voz del cielo: Lo he glorificado, y lo glorificaré otra vez.`
  },
  {
    ref: "Juan 21:19",
    text: `Esto dijo, dando a entender con qué muerte había de glorificar a Dios. Y dicho esto, añadió: Sígueme.`
  },
  {
    ref: "Hebreos 7:25",
    text: `Por lo cual puede también salvar perpetuamente a los que por él se acercan a Dios, viviendo siempre para interceder por ellos.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Cuál fue la primera petición de Jesús al comenzar su oración en Juan 17?",
    opts: [
      "Que sus discípulos no lo abandonaran",
      "Que el Padre lo glorificara, para que él pudiera glorificar al Padre",
      "Que Judas se arrepintiera",
      "Que Pedro no lo negara"
    ],
    ans: 1,
    feedback: "«Padre, la hora ha llegado; glorifica a tu Hijo, para que también tu Hijo te glorifique a ti» (Juan 17:1). Su mayor preocupación era que Dios fuera glorificado a través de todo lo que estaba por suceder."
  },
  {
    q: "Según Juan 17:3, ¿cómo definió Jesús la vida eterna?",
    opts: [
      "Vivir para siempre en el cielo, sin más",
      "Conocer al único Dios verdadero y a Jesucristo, a quien envió",
      "Cumplir la ley a la perfección",
      "Nunca enfrentar sufrimiento"
    ],
    ans: 1,
    feedback: "«Esta es la vida eterna: que te conozcan a ti, el único Dios verdadero, y a Jesucristo, a quien has enviado» (Juan 17:3). Es una relación que empieza aquí y ahora, no algo que se experimenta recién en el cielo."
  },
  {
    q: "¿Qué significa que los discípulos estén «en el mundo» pero no sean «del mundo»? (Juan 17:11, 14, 16, 18)",
    opts: [
      "Que deben aislarse por completo de la sociedad",
      "Que deben estar presentes en el mundo sin acoplarse a él",
      "Que el mundo ya no puede afectarlos",
      "Que esto solo aplica a los apóstoles"
    ],
    ans: 1,
    feedback: "Jesús llama a sus seguidores a mezclarse y relacionarse con la gente del mundo sin comprometer sus principios ni prácticas. Es la misma misión que él tuvo: «Como tú me enviaste al mundo, así yo los he enviado al mundo» (Juan 17:18)."
  },
  {
    q: "¿Con qué pide Jesús que sean santificados sus discípulos? (Juan 17:17)",
    opts: [
      "Con ayunos prolongados",
      "Con la verdad de la Palabra de Dios",
      "Con rituales del templo",
      "Con la aprobación de los líderes religiosos"
    ],
    ans: 1,
    feedback: "«Santifícalos en tu verdad; tu palabra es verdad» (Juan 17:17). Solo la Palabra de Dios puede transformarnos para vivir en el mundo sin ser del mundo."
  },
  {
    q: "¿A quién se refirió Jesús como «el hijo de perdición» en su oración? (Juan 17:12)",
    opts: [
      "A Pedro",
      "A Judas",
      "A Tomás",
      "Al sumo sacerdote"
    ],
    ans: 1,
    feedback: "«Ninguno de ellos se perdió, sino el hijo de perdición» (Juan 17:12), una referencia a Judas, que ya se había marchado para traicionarlo. Jesús anticipó completamente esa traición."
  },
  {
    q: "¿Por quiénes más oró Jesús, además de sus doce discípulos? (Juan 17:20)",
    opts: [
      "Solo por los líderes religiosos de su época",
      "También por los que habrían de creer en él por la palabra de los discípulos",
      "Únicamente por su propia familia",
      "Por nadie más; su oración terminaba con los doce"
    ],
    ans: 1,
    feedback: "«Mas no ruego solamente por éstos, sino también por los que han de creer en mí por la palabra de ellos» (Juan 17:20). Jesús oró por cada creyente futuro, incluido vos."
  },
  {
    q: "¿Qué tipo de unidad pidió Jesús para sus seguidores? (Juan 17:21-23)",
    opts: [
      "Una unidad de opinión sobre temas secundarios",
      "Una unidad tan profunda como la que existe entre el Padre y el Hijo",
      "Una unidad basada solo en reglas compartidas",
      "Una unidad únicamente organizacional"
    ],
    ans: 1,
    feedback: "«Que todos sean uno; como tú, oh Padre, en mí, y yo en ti... para que el mundo crea que tú me enviaste» (Juan 17:21). No hay mayor unidad que la de la Trinidad, y Jesús desea esa misma unidad para nosotros."
  },
  {
    q: "Según Hebreos 7:25, ¿qué sigue haciendo Jesús hoy por nosotros?",
    opts: [
      "Ya terminó su obra de intercesión",
      "Vive para siempre intercediendo por los que se acercan a Dios por medio de él",
      "Solo intercede por los pastores",
      "Espera a que hagamos suficientes méritos"
    ],
    ans: 1,
    feedback: "«Puede también salvar perpetuamente a los que por él se acercan a Dios, viviendo siempre para interceder por ellos» (Hebreos 7:25). La oración de Juan 17 es apenas un reflejo de su intercesión continua en el cielo."
  },
];

const DISCUSS_SIMISMO = [
  { n: 1, text: "¿Cuál es el deseo supremo de Cristo?", ref: "Juan 17:1-5" },
  { n: 2, text: "¿Cómo definió Jesús la vida eterna? ¿Cómo podemos experimentarla ahora?", ref: "Juan 17:3" },
  { n: 3, text: "¿Cuál fue la obra de Cristo?", ref: "Juan 17:1-8" },
];

const DISCUSS_DISCIPULOS = [
  { n: 1, text: "¿Por qué Jesús oró por sus discípulos?", ref: "Juan 17:9-19" },
  { n: 2, text: "No es fácil estar en el mundo, pero sin ser parte del mundo. ¿Cómo podemos evitar volvernos como el mundo?", ref: "Juan 17:11, 14, 16, 18" },
  { n: 3, text: "¿Qué significa ser santificados por la verdad? ¿Cómo podemos experimentar más de esto?", ref: "Juan 17:17" },
];

const DISCUSS_CREYENTES = [
  { n: 1, text: "¿Cuál era el deseo de Jesús para las futuras generaciones de creyentes?", ref: "Juan 17:20-23" },
  { n: 2, text: "¿Cómo desea Jesús que experimentemos su gloria y su amor?", ref: "Juan 17:24-26" },
  { n: 3, text: "¿De qué manera la oración de Jesús refleja su continua intercesión por nosotros en el cielo?", ref: "Romanos 8:34; Hebreos 7:25" },
];

const REFLEXIONES = [
  { key: "rfl1", q: "¿De qué maneras has comenzado a disfrutar ya de la vida eterna, tal como la definió Jesús?", ref: "Juan 17:3" },
  { key: "rfl2", q: "¿Cómo glorificó Jesús al Padre mientras estuvo en la tierra? ¿Qué puedes hacer tú para glorificar al Padre esta semana?", ref: "Juan 17:4" },
  { key: "rfl3", q: "¿Cómo podemos ser parte del mundo sin acoplarnos a él?", ref: "Juan 17:11, 14, 16, 18" },
  { key: "rfl4", q: "Memoriza tu pasaje favorito de Juan 17. Escríbelo varias veces para ayudarte a recordarlo.", ref: "Juan 17" },
];

// ── COMPONENTES ───────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">La oración <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>de Cristo</em></div>
      <div className="sec-sub">Sexta Semana · Juan 17 · Las escenas finales</div>

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
            <div className="card-label">Orar por cosas más grandes</div>
            <p>Dios actúa poderosamente en respuesta a la oración intercesora: cuando alguien se atreve a orar con osadía por algo más grande que lo glorifica a él. Jesús mismo, sabiendo que en horas sería arrestado, dedicó parte de sus últimos momentos de libertad a orar. No oró por escapar de la cruz, sino por su Padre, por sus discípulos y por todos los que un día creerían en él por medio de ellos. Esa oración, registrada en Juan 17, nos permite conocer sus pensamientos más íntimos y la estrecha relación que tenía con su Padre.</p>
          </div>

          <div className="honey-card">
            <div className="honey-label">
              <Star size={13} />
              Texto base · Juan 17:20-26
            </div>
            <div className="honey-text">
              «Mas no ruego solamente por éstos, sino también por los que han de creer en mí por la palabra de ellos, para que todos sean uno; como tú, oh Padre, en mí, y yo en ti, que también ellos sean uno en nosotros... Padre, aquellos que me has dado, quiero que donde yo estoy, también ellos estén conmigo, para que vean mi gloria que me has dado.»
            </div>
            <div className="honey-ref">Juan 17:20-24 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              <li>
                <span className="key-dot" />
                <span className="key-text">El <strong>deseo más profundo de Cristo</strong> era que el Padre fuera glorificado y que nosotros lo conociéramos auténticamente, porque eso es lo que significa la vida eterna.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">En lugar de sacarlos del mundo, Jesús oró para que sus discípulos fueran <strong>transformados por la Palabra</strong> y anclados en el amor de la Trinidad.</span>
              </li>
              <li>
                <span className="key-dot" />
                <span className="key-text">Jesús no solo oró por los doce; también <strong>oró por nosotros</strong>, para que reflejáramos su carácter, su amor y su unidad, de modo que el mundo lo viera a través de nosotros.</span>
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
      <div className="sec-sub">La oración de Jesús por sí mismo</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">El contexto</div>
        <p>Jesús tenía mucho por qué orar cuando terminó de darles instrucciones a sus discípulos (Juan 13-16) y entró en el huerto, donde pronto sería arrestado. Judas ya se había marchado y estaba a punto de traicionarlo. A pesar de todo lo que tenía en su corazón y en su mente, Jesús comenzó orando por sí mismo, y lo que pidió fue inesperado.</p>
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
        <p>¿De qué maneras has comenzado a disfrutar ya de la vida eterna, tal como la definió Jesús? ¿Cómo glorificó Jesús al Padre mientras estuvo en la tierra? ¿Qué puedes hacer tú para glorificar al Padre esta semana?</p>
      </div>
    </>
  );
}

function TabInterpreta({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Interpreta</div>
      <div className="sec-sub">La oración de Jesús por sus discípulos</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Una responsabilidad compartida</div>
        <p>La gran preocupación de Jesús mientras oraba en Juan 17 eran sus discípulos. La continuación de su misión en el mundo dependía de este humilde y pequeño grupo, cuyo éxito dependía de su fidelidad a pesar de los enormes desafíos y presiones del mundo, y de sus propias luchas internas: la política, la envidia, el orgullo y la ambición egoísta a menudo los dividían.</p>
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
        <p>¿Cómo podemos ser parte del mundo sin acoplarnos a él? Memoriza tu pasaje favorito de Juan 17 y escríbelo varias veces para ayudarte a recordarlo.</p>
      </div>
    </>
  );
}

function TabInvestiga({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Investiga</div>
      <div className="sec-sub">Lo que otras Escrituras revelan sobre esta oración</div>

      <div className="group-label">Dar gloria a Dios</div>
      {INVESTIGA_GLORIA.map(item => (
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

      <div className="group-label">La intercesión de Cristo</div>
      {INVESTIGA_INTERCESION.map(item => (
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
        <p>¿Qué otros versículos o promesas te vienen a la mente en relación con Juan 17?</p>
      </div>
    </>
  );
}

function TabUnidad({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Unidad</div>
      <div className="sec-sub">La oración de Jesús por nosotros</div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">También oró por nosotros</div>
        <p>Hay algo profundamente reconfortante en saber que alguien está orando por vos. A través de las Escrituras podemos leer y escuchar las oraciones de Jesús y saber exactamente lo que oró por nosotros. Todo lo que enseñó en Juan 13-16 sentó las bases; aquí, en Juan 17, oraba para que Dios lo cumpliera, no solo en sus discípulos, sino también en nosotros.</p>
      </div>

      {UNIDAD_DATA.map(item => (
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
        <p>¿Cómo te sentís al saber que Jesús piensa continuamente en vos y quiere que estés con él en el cielo? ¿Cómo podés ayudar a otros a conocer esta verdad y a aceptarla en sus vidas?</p>
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
    const msg = pct === 100 ? "¡Perfecto! Entendés muy bien la oración que Jesús elevó por sí mismo, por sus discípulos y por vos." :
                pct >= 75  ? "¡Muy bien! Tenés una base sólida sobre las enseñanzas de Juan 17." :
                pct >= 50  ? "Buen comienzo. Te recomendamos repasar Juan 17." :
                "Vale la pena releer el capítulo. Es clave para entender que Jesús sigue orando por vos.";
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
        <div className="egw-source"><Star size={11} /> Elena G. de White · El Deseado de todas las gentes, cap. 73, p. 649</div>
        <div className="egw-text">«Cristo quiere que estén representados en su iglesia en la tierra el orden celestial, el plan de gobierno celestial, la armonía divina del cielo. Así queda glorificado en los suyos. [...] Elevando los ojos al cielo, dijo: "Padre, la hora es llegada; glorifica a tu Hijo, para que también tu Hijo te glorifique a ti... Esta empero es la vida eterna: que te conozcan el solo Dios verdadero, y a Jesucristo, al cual has enviado." [...] <strong>Cristo había concluido la obra que se le había confiado. Había glorificado a Dios en la tierra.</strong> Había manifestado el nombre del Padre. Había reunido a aquellos que habían de continuar su obra entre la gente. [...] Así, con el lenguaje de quien tenía autoridad divina, Cristo entregó a su electa iglesia en los brazos del Padre. Como consagrado sumo sacerdote, intercedió por los suyos. Como fiel pastor, reunió a su rebaño bajo la sombra del Todopoderoso, en el fuerte y seguro refugio.»</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">En oración por sí mismo y por su misión</div>
        {DISCUSS_SIMISMO.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
      </div>

      <div className="discuss-block">
        <div className="discuss-title">En oración por sus discípulos</div>
        {DISCUSS_DISCIPULOS.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Alguna vez has experimentado el poder de la oración intercesora, ya sea porque alguien ha orado por vos o porque vos has orado por otra persona?</div>
      </div>

      <div className="discuss-block">
        <div className="discuss-title">En oración por todos los creyentes</div>
        {DISCUSS_CREYENTES.map(d => (
          <div key={d.n} className="discuss-q">
            <span className="discuss-num">{d.n}.</span>
            <span className="discuss-text">{d.text} {d.ref && <span className="discuss-ref">({d.ref})</span>}</span>
          </div>
        ))}
        <div className="discuss-personal"><strong>Reflexión personal:</strong> ¿Qué asuntos dividen a las personas en el mundo actual? ¿Cómo pueden los creyentes de tantas culturas, orígenes y puntos de vista diferentes superar estos retos y estar unidos?</div>
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
            <span className="key-text">El <strong>deseo más profundo de Cristo</strong> era que el Padre fuera glorificado y que nosotros lo conociéramos auténticamente, porque eso es lo que significa la vida eterna.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">En lugar de sacarlos del mundo, Jesús oró para que sus discípulos fueran <strong>transformados por la Palabra</strong> y anclados en el amor de la Trinidad.</span>
          </li>
          <li>
            <span className="key-dot" />
            <span className="key-text">Jesús no solo oró por los doce; también <strong>oró por nosotros</strong>, para que reflejáramos su carácter, su amor y su unidad, de modo que el mundo lo viera a través de nosotros.</span>
          </li>
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>En este mismo momento, alguien —tal vez tus papás, un líder de tu iglesia, un amigo— podría estar orando por vos sin que lo sepas. Ahora sabés algo todavía más grande: Jesús mismo oró por vos hace dos mil años, en un huerto, la noche antes de morir, y sigue haciéndolo ahora mismo desde el cielo (Hebreos 7:25).</p>
          <br />
          <p><strong>Esta semana, animate a orar por algo más grande que lo que normalmente pedís.</strong> Por un amigo que está lejos de Dios, por tu familia, por la unidad de tu grupo de jóvenes cuando las diferencias generan tensión. No hace falta que la oración sea larga ni perfecta: hace falta que sea sincera.</p>
          <br />
          <p>Y la próxima vez que en el chat grupal, en el liceo o en redes sociales surja una discusión que divide, recordá lo que Jesús pidió para vos: que fueras uno con los demás creyentes, no a pesar de las diferencias, sino a través del amor que solo él puede darte. <strong>El mundo va a creer en Jesús cuando vea esa unidad en nosotros.</strong></p>
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
    { id: "interioriza",  label: "Interioriza",  Icon: Sparkles },
    { id: "interpreta",   label: "Interpreta",   Icon: Users },
    { id: "investiga",    label: "Investiga",    Icon: Search },
    { id: "unidad",       label: "Unidad",       Icon: LinkIcon },
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
              InVerso · Semana 6
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              La oración <em>de Cristo</em>
            </h1>
            <div className="hero-ref">Juan 17 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"       && <TabInicio teacherMode={teacherMode} />}
            {tab === "interioriza"  && <TabInterioriza openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "interpreta"   && <TabInterpreta openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "investiga"    && <TabInvestiga openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "unidad"       && <TabUnidad openExpand={openExpand} toggleExpand={toggleExpand} />}
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
