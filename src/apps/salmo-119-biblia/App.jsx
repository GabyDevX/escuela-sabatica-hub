import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Heart,
  CheckCircle, XCircle, RotateCcw, Home, Shield, Flame, Layers, Search
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg:#0d0b06; --bg2:#131008; --bg3:#1c180b;
  --surf:#221d0e; --surf2:#2e2714;
  --brd:#3a3118; --brd2:#52451e;
  --tx:#f5f0e0; --tx2:#c8bc98; --tx3:#8a7d52;
  --acc:#c48a0c; --acc2:#d4a020; --acc3:#f0c850;
  --ok:#10b981; --ok-d:rgba(16,185,129,.10);
  --err:#f43f5e; --err-d:rgba(244,63,94,.10);
  --warn:#e09a30; --warn-d:rgba(224,154,48,.10);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}

/* HERO */
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1a1407 0%,#0d0b06 55%,#090805 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(196,138,12,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.85rem;font-weight:700;line-height:1.18;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(196,138,12,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(196,138,12,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(196,138,12,.3) 30%,rgba(196,138,12,.3) 70%,transparent)}

/* SECRET BAR */
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}

/* NAV */
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:44px;min-height:56px;padding:.6rem .28rem .5rem;font-size:.46rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.03em;text-transform:uppercase}
.nav button svg{width:19px;height:19px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:14%;right:14%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(196,138,12,.08);border-radius:10px;z-index:-1}

/* CONTENT */
.content{padding:1.25rem 1rem 2rem;animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.sec-title{font-family:'Playfair Display',serif;font-size:1.65rem;font-weight:700;color:var(--tx);margin-bottom:.25rem;line-height:1.2}
.sec-sub{font-size:.95rem;color:var(--tx2);margin-bottom:1.25rem;line-height:1.55}

/* CARD */
.card{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1.1rem 1rem;margin-bottom:.85rem}
.card p{font-size:1rem;line-height:1.65;color:var(--tx2)}
.card-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.5rem}

/* VERSE */
.verse-item{border-left:3px solid var(--acc);border-radius:0 12px 12px 0;background:var(--surf);margin-bottom:.7rem;overflow:hidden;cursor:pointer;transition:background .2s}
.verse-item:hover{background:var(--surf2)}
.verse-item.base-v{border-left:4px solid var(--warn)}
.verse-header{display:flex;align-items:center;justify-content:space-between;padding:.8rem 1rem}
.verse-ref{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:var(--tx)}
.verse-tags{display:flex;gap:.4rem;align-items:center}
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(196,138,12,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(224,154,48,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}

/* EXPAND */
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(196,138,12,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(196,138,12,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}

/* EGW */
.egw-wrap{background:linear-gradient(135deg,rgba(196,138,12,.07),rgba(196,138,12,.02));border:1px solid rgba(196,138,12,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(196,138,12,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}

/* HONEY CARD */
.honey-card{background:linear-gradient(135deg,rgba(196,138,12,.10),rgba(196,138,12,.03));border:1px solid rgba(196,138,12,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.honey-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.honey-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.honey-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}

/* STEP LIST */
.step-item{display:flex;gap:.9rem;padding:.85rem 1rem;background:var(--surf);border-radius:12px;border:1px solid var(--brd);margin-bottom:.5rem}
.step-num{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--acc2);white-space:nowrap;padding-top:.15rem;min-width:1.8rem;font-weight:700}
.step-body{flex:1;font-size:.97rem;line-height:1.6;color:var(--tx2)}
.step-body strong{color:var(--tx)}

/* GUIDE */
.guide-banner{background:linear-gradient(135deg,rgba(224,154,48,.10),rgba(224,154,48,.02));border:1px solid rgba(224,154,48,.22);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(224,154,48,.12);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
.guide-banner p{font-size:.9rem;color:var(--tx2);line-height:1.45}
.guide-step{display:flex;gap:.9rem;margin-bottom:.8rem;padding:.9rem 1rem;background:var(--surf);border-radius:12px;border:1px solid var(--brd)}
.guide-time{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--warn);white-space:nowrap;padding-top:.1rem;min-width:58px}
.guide-step-body{flex:1}
.guide-step-title{font-size:.97rem;font-weight:600;color:var(--tx);margin-bottom:.3rem}
.guide-step-desc{font-size:.92rem;line-height:1.55;color:var(--tx2)}

/* QUIZ */
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

/* CIERRE */
.reflex-card{background:var(--surf);border:1px solid var(--brd);border-radius:14px;padding:1rem 1.05rem;margin-bottom:.75rem;display:flex;gap:.9rem;align-items:flex-start}
.reflex-num{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:var(--brd2);line-height:1;flex-shrink:0;width:2rem;padding-top:.1rem}
.reflex-body{flex:1}
.reflex-q{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:var(--tx);line-height:1.4}
.reflex-ref{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);margin-top:.35rem}
.vida-card{background:linear-gradient(135deg,rgba(196,138,12,.10),rgba(196,138,12,.02));border:1.5px solid rgba(196,138,12,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const VERSES = [
  {
    ref: "Salmo 119:97-104", base: true,
    text: `97 ¡Oh, cuánto amo yo tu ley! Todo el día es ella mi meditación. 98 Me has hecho más sabio que mis enemigos con tus mandamientos, porque ellos son siempre conmigo. 99 Más que todos mis enseñadores he entendido, porque tus testimonios son mi meditación. 100 Más que los viejos entendí, porque he guardado tus mandamientos. 101 De todo mal camino contuve mis pies, para guardar tu palabra. 102 No me aparté de tus juicios, porque tú me enseñaste. 103 ¡Cuán dulces son a mi paladar tus palabras! Más que la miel a mi boca. 104 De tus mandamientos he adquirido inteligencia; por tanto, he aborrecido todo camino de mentira.`
  },
  {
    ref: "Salmo 119:9-11",
    text: `9 ¿Con qué limpiará el joven su camino? Con guardar tu palabra. 10 Con todo mi corazón te he buscado; no me dejes desviarme de tus mandamientos. 11 En mi corazón he guardado tus dichos, para no pecar contra ti.`
  },
  {
    ref: "Salmo 119:103-104",
    text: `103 ¡Cuán dulces son a mi paladar tus palabras! Más que la miel a mi boca. 104 De tus mandamientos he adquirido inteligencia; por tanto, he aborrecido todo camino de mentira.`
  },
  {
    ref: "Salmo 119:105",
    text: `Lámpara es a mis pies tu palabra, y lumbrera a mi camino.`
  },
  {
    ref: "Salmo 119:145-148",
    text: `145 Clamé con todo mi corazón; respóndeme, Jehová, y guardaré tus estatutos. 146 A ti clamé; sálvame, y guardaré tus testimonios. 147 Me anticipé al alba, y clamé; esperé en tu palabra. 148 Se anticiparon mis ojos a las vigilias de la noche, para meditar en tus mandatos.`
  },
  {
    ref: "Salmo 119:161-162",
    text: `161 Príncipes me han perseguido sin causa, pero mi corazón tuvo temor de tus palabras. 162 Me regocijo en tu palabra como el que halla muchos despojos.`
  },
  {
    ref: "Salmo 119:171-172",
    text: `171 Mis labios rebosarán de alabanza cuando me enseñes tus estatutos. 172 Hablará mi lengua tus dichos, porque todos tus mandamientos son justicia.`
  },
  {
    ref: "Jeremías 29:13",
    text: `Me buscaréis y me hallaréis, porque me buscaréis de todo vuestro corazón.`
  },
  {
    ref: "Salmo 37:4",
    text: `Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón.`
  },
  {
    ref: "Salmo 46:10",
    text: `Estad quietos, y conoced que yo soy Dios; seré exaltado entre las naciones; enaltecido seré en la tierra.`
  },
  {
    ref: "Hechos 17:11",
    text: `Y éstos eran más nobles que los que estaban en Tesalónica, pues recibieron la palabra con toda solicitud, escudriñando cada día las Escrituras para ver si estas cosas eran así.`
  },
  {
    ref: "Marcos 1:35",
    text: `Levantándose muy de mañana, siendo aún muy oscuro, salió y se fue a un lugar desierto, y allí oraba.`
  },
  {
    ref: "Lucas 10:39-42",
    text: `39 Esta tenía una hermana que se llamaba María, la cual, sentándose a los pies de Jesús, oía su palabra. 40 Pero Marta se distraía en muchos quehaceres, y acercándose, dijo: Señor, ¿no te importa que mi hermana me deje servir sola? Dile, pues, que me ayude. 41 Respondiendo Jesús, le dijo: Marta, Marta, afanada y turbada estás con muchas cosas. 42 Pero sólo una cosa es necesaria; y María ha escogido la buena parte, la cual no le será quitada.`
  },
  {
    ref: "1 Crónicas 16:11",
    text: `Buscad a Jehová y su poder; buscad su rostro continuamente.`
  },
  {
    ref: "Salmo 27:8",
    text: `Mi corazón ha dicho de ti: Buscad mi rostro. Tu rostro buscaré, oh Jehová.`
  },
  {
    ref: "Isaías 55:6-11",
    text: `6 Buscad a Jehová mientras puede ser hallado, llamadle en tanto que está cercano. 7 Deje el impío su camino, y el hombre inicuo sus pensamientos, y vuélvase a Jehová, el cual tendrá de él misericordia, y al Dios nuestro, el cual será amplio en perdonar. 8 Porque mis pensamientos no son vuestros pensamientos, ni vuestros caminos mis caminos, dijo Jehová. 9 Como son más altos los cielos que la tierra, así son mis caminos más altos que vuestros caminos, y mis pensamientos más que vuestros pensamientos. 10 Porque como desciende de los cielos la lluvia y la nieve, y no vuelve allá, sino que riega la tierra, y la hace germinar y producir, y da semilla al que siembra, y pan al que come, 11 así será mi palabra que sale de mi boca; no volverá a mí vacía, sino que hará lo que yo quiero, y será prosperada en aquello para que la envié.`
  },
  {
    ref: "Juan 8:31",
    text: `Dijo entonces Jesús a los judíos que habían creído en él: Si vosotros permaneciereis en mi palabra, seréis verdaderamente mis discípulos.`
  },
  {
    ref: "Juan 15:3, 7",
    text: `3 Ya vosotros estáis limpios por la palabra que os he hablado. [...] 7 Si permanecéis en mí, y mis palabras permanecen en vosotros, pedid todo lo que queréis, y os será hecho.`
  },
  {
    ref: "Isaías 50:4",
    text: `El Señor Jehová me dio lengua de sabios, para saber hablar palabras al cansado; despertará mañana tras mañana, despertará mi oído para que oiga como los sabios.`
  },
  {
    ref: "Filipenses 3:14",
    text: `Prosigo a la meta, al premio del supremo llamamiento de Dios en Cristo Jesús.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿A qué compara el Salmo 119:103 las palabras de Dios?",
    opts: ["A un río de agua fresca", "A la miel de panal", "A una lámpara en la oscuridad", "A una espada de dos filos"],
    ans: 1,
    feedback: "«¡Cuán dulces son a mi paladar tus palabras! Más que la miel a mi boca» (Sal 119:103). La metáfora de la miel habla de algo que se saborea y disfruta, no solo se consume por obligación. El estudio bíblico debe ser una experiencia de deleite genuino."
  },
  {
    q: "¿Con qué frecuencia leía Martín Lutero la Biblia completa, según el estudio?",
    opts: ["Una vez al año", "Dos veces al año", "Una vez al mes", "Cada semana"],
    ans: 1,
    feedback: "Lutero escribió: «Durante varios años he leído la Biblia dos veces al año». Comparó la Biblia con un árbol grande y poderoso, y sus palabras con pequeñas ramas que exploraba ansiosamente. Un modelo de devoción constante y sistemática."
  },
  {
    q: "Según Elena G. de White, ¿qué produce una lectura precipitada de las Escrituras?",
    opts: ["Un crecimiento espiritual acelerado", "Un beneficio muy escaso", "Confusión doctrinal permanente", "Un conocimiento superficial pero útil"],
    ans: 1,
    feedback: "«Solo se obtiene un beneficio muy escaso de una lectura precipitada de las Sagradas Escrituras» (El camino a Cristo, cap. 10, p. 133). Es posible leer la Biblia de principio a fin y aun así no captar su belleza ni su sentido profundo."
  },
  {
    q: "¿Cuál es el acto clave que distingue estudiar la Biblia de simplemente leerla?",
    opts: ["Memorizar versículos de memoria", "Usar un comentario bíblico", "Escribir mientras se lee", "Leer en voz alta con otra persona"],
    ans: 2,
    feedback: "«La principal diferencia entre solo leer la Biblia y estudiarla se reduce a un acto clave: escribir.» Escribir ralentiza los pensamientos, facilita la reflexión y lleva las ideas de la cabeza al corazón para el resto del día."
  },
  {
    q: "¿Dónde se retiraba Jesús para pasar tiempo con Dios, según Marcos 1:35?",
    opts: ["Al templo de Jerusalén cada tarde", "A un lugar solitario antes del amanecer", "Al huerto de Getsemaní los viernes", "A la sinagoga con sus discípulos"],
    ans: 1,
    feedback: "«Levantándose muy de mañana, siendo aún muy oscuro, salió y se fue a un lugar desierto, y allí oraba» (Mr 1:35). Jesús estableció el modelo: tiempo específico, lugar específico, sin distracciones, antes de que la multitud despertara."
  },
  {
    q: "¿Cuántos días lleva como mínimo formar un nuevo hábito, según el estudio?",
    opts: ["7 días", "14 días", "21 días", "40 días"],
    ans: 2,
    feedback: "El estudio indica que «lleva al menos veintiún días formar un nuevo hábito». Pero también es claro: nunca podremos tener éxito sin la ayuda del Espíritu Santo. La decisión es nuestra; el poder es de Dios."
  },
  {
    q: "¿Cuál es la 'doble bendición' de compartir lo que aprendemos en la Biblia?",
    opts: ["Leer el AT y el NT juntos produce doble fruto", "El que comparte se fortalece y también el que escucha", "Compartir en grupo y en privado da doble entendimiento", "Ayunar y estudiar juntos multiplica los beneficios"],
    ans: 1,
    feedback: "«Cuando compartimos y analizamos con otros, la conversación espiritual a menudo desafía y fortalece a ambos participantes.» Con frecuencia es cuando enseñamos o compartimos que se produce el aprendizaje más profundo en nuestra propia mente."
  },
  {
    q: "Según Elena G. de White (sección Implícate), ¿cuál fue la ruina de los judíos en el estudio bíblico?",
    opts: ["No leer la Biblia con suficiente frecuencia", "Leer sin oración previa", "No estar dispuestos a abandonar tradiciones establecidas", "No compartir lo que aprendían con otros"],
    ans: 2,
    feedback: "EGW escribió: «La falta de disposición para abandonar las tradiciones por largo tiempo establecidas fue la ruina de los judíos.» Traer doctrinas a la Biblia para confirmarlas, en lugar de leerla para ser corregidos, es el peligro más sutil del estudio bíblico."
  },
];

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: Tu primera Biblia", desc: "Preguntá al grupo: ¿Cuándo y cómo recibieron su primera Biblia? ¿La tienen en papel o en el celular? ¿Cuándo fue la última vez que la abrieron fuera de la Escuela Sabática? Crear ambiente de reflexión honesta, sin juicios." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos brevemente. Orar pidiendo corazones con hambre genuina por la Palabra de Dios — no solo conocimiento, sino encuentro personal con él." },
  { time: "05–11 min", title: "Tab Hábito — Una posesión preciada", desc: "Presentar la cita de Lutero. Preguntar: ¿Qué lugar ocupa la Biblia en tu agenda semanal real? Recorrer las tres sugerencias prácticas expandibles. Énfasis en EGW: la lectura precipitada produce muy poco fruto. ¿Alguna vez pusiste la alarma más temprano para leer la Biblia?" },
  { time: "11–17 min", title: "Tab Deleite — Meditar como María", desc: "Usar el contraste Marta vs. María (Lc 10:39-42). ¿Tu vida con Dios se parece más a María (contemplación) o a Marta (actividad sin pausa)? Preguntar: ¿Tenés un lugar y momento específico para estar con Dios? Si no, ¿qué lo impide?" },
  { time: "17–22 min", title: "Tab Método — Pasos prácticos", desc: "Recorrer los tres pasos expandibles: Ora, Escribí, Compartí. Énfasis especial en escribir como lo que distingue leer de estudiar. Presentar el método de 6 pasos. Preguntar: ¿Quién en el grupo lleva un diario bíblico? ¿Cómo les ha funcionado?" },
  { time: "22–26 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Pausar en la pregunta 8 sobre la ruina de los judíos — es la más desafiante para la autoevaluación personal." },
  { time: "26–30 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Énfasis en: ¿Con quién vas a compartir lo que aprendiste hoy? Cerrar con el desafío concreto: elegir un momento, un lugar y llevar un cuaderno esta semana. Oración final a cargo del maestro." },
];

const REFLEXIONES = [
  { q: "¿Cuáles son los beneficios de estudiar la ley, los mandamientos, los testimonios y los juicios de Dios?", ref: "Salmo 119:97-104" },
  { q: "¿Qué te dificulta tener un tiempo regular y sin prisas para estudiar la Biblia? ¿Cómo podrías superar esos desafíos?", ref: "Marcos 1:35; Lucas 10:39-42" },
  { q: "¿Cuáles han sido tus experiencias más impactantes en el estudio de la Biblia, ya sea en grupo o a solas?", ref: "Salmo 119:103; Salmo 119:161-162" },
  { q: "¿Cuál es el resultado natural de estudiar la Palabra de Dios con constancia y compartirla con otros?", ref: "Salmo 119:171-172; Isaías 50:4" },
  { q: "¿Con quién podrías compartir lo que estás aprendiendo en la Biblia esta semana? ¿Cómo te prepara Dios para hacerlo?", ref: "Salmo 119:172; Isaías 50:4" },
  { q: "¿Qué herramientas o técnicas te han ayudado a que tu tiempo de estudio bíblico sea más significativo?", ref: "Hechos 17:11; Juan 15:7" },
];

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
    { id: "inicio", label: "Inicio", Icon: Home },
    { id: "habito", label: "Hábito", Icon: BookOpen },
    { id: "deleite", label: "Deleite", Icon: Heart },
    { id: "metodo", label: "Método", Icon: Layers },
    { id: "biblia", label: "Biblia", Icon: Search },
    { id: "quiz", label: "Quiz", Icon: Shield },
    { id: "cierre", label: "Cierre", Icon: Flame },
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
              InVerso · Semana 5
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Cómo estudiar<br />la <em>Biblia</em>
            </h1>
            <div className="hero-ref">Salmo 119 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio" && <TabInicio teacherMode={teacherMode} />}
            {tab === "habito" && <TabHabito openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "deleite" && <TabDeleite />}
            {tab === "metodo" && <TabMetodo openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "biblia" && <TabBiblia openVerses={openVerses} toggle={toggleVerse} renderVerseText={renderVerseText} />}
            {tab === "quiz" && (
              <TabQuiz
                quizIdx={quizIdx} quizSelected={quizSelected}
                quizAnswered={quizAnswered} quizResults={quizResults}
                quizDone={quizDone} score={score}
                selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz}
              />
            )}
            {tab === "cierre" && <TabCierre />}
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

// ── TAB: INICIO ───────────────────────────────────────────────────────────────
function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Cómo estudiar la Biblia</div>
      <div className="sec-sub">Salmo 119 — Una posesión muy preciada</div>

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
            <div className="card-label">Explorar esta semana</div>
            <p>
              <strong style={{ color: "var(--tx)" }}>Hábito</strong> — Una posesión muy preciada: construir el hábito diario<br />
              <strong style={{ color: "var(--tx)" }}>Deleite</strong> — «Oh cuán dulce»: meditar en la Palabra como en miel<br />
              <strong style={{ color: "var(--tx)" }}>Método</strong> — Pasos prácticos para profundizar en el estudio<br />
              <strong style={{ color: "var(--tx)" }}>Biblia</strong> — Los {VERSES.length} versículos de la semana · RVR1960
            </p>
          </div>

          <div className="honey-card">
            <div className="honey-label"><BookOpen size={12} />Salmo 119:103-104</div>
            <div className="honey-text">«¡Cuán dulces son a mi paladar tus palabras! Más que la miel a mi boca. De tus mandamientos he adquirido inteligencia; por tanto, he aborrecido todo camino de mentira.»</div>
            <div className="honey-ref">Salmo 119:103-104 · RVR1960</div>
          </div>

          <div className="egw-wrap">
            <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 10, p. 133</div>
            <div className="egw-text">«Solo se obtiene un beneficio muy escaso de una <strong>lectura precipitada</strong> de las Sagradas Escrituras. Uno puede leer toda la Biblia y quedarse, sin embargo, sin ver su belleza o comprender su sentido profundo y oculto.»</div>
          </div>

          <div className="card">
            <div className="card-label">Pregunta para arrancar</div>
            <p>¿Cuándo fue la última vez que abriste la Biblia fuera del culto o la Escuela Sabática? <strong style={{ color: "var(--acc3)" }}>¿La Biblia está entre tus posesiones más preciadas — o es solo otro ícono más en tu pantalla de inicio?</strong></p>
          </div>
        </>
      )}
    </>
  );
}

// ── TAB: HÁBITO ───────────────────────────────────────────────────────────────
function TabHabito({ openExpand, toggleExpand }) {
  const sugerencias = [
    {
      key: "h1", badge: "1", name: "Pídele a Dios un deseo por él",
      body: "Reclama las promesas de Jeremías 29:13 y Salmo 37:4. Pídele que te despierte más temprano de lo habitual o que te ayude a liberar tiempo en tu agenda para pasarlo con él. El deseo mismo puede venir de Dios — empezá por pedirlo honestamente."
    },
    {
      key: "h2", badge: "2", name: "Entregá tu tiempo a Dios",
      body: "Sí, estás ocupado y tenés muchas cosas urgentes — pero el tiempo con Dios es de un valor incalculable. Ve a un lugar tranquilo y lee el Salmo 46:10. Pensá en los aspectos de tu vida que tal vez no has entregado a Dios y entrégaselos. El tiempo dado a Dios nunca es tiempo perdido."
    },
    {
      key: "h3", badge: "3", name: "Pasá tiempo con Dios aunque no tengas ganas",
      body: "Al igual que hace falta una decisión consciente y un plan para estar sano (ejercicio, dieta, descanso), hay que tomar una decisión consciente para mantener una relación estrecha con Dios. Recordá: lleva al menos 21 días formar un nuevo hábito, y nunca podremos tener éxito sin la ayuda del Espíritu Santo."
    },
  ];

  return (
    <>
      <div className="sec-title">Una posesión muy preciada</div>
      <div className="sec-sub">Construir el hábito de estudiar la Biblia a diario</div>

      <div className="card">
        <div className="card-label">Reflexión inicial</div>
        <p>Pensá en el momento en que recibiste tu primera Biblia. ¿Es hoy una de tus posesiones más preciadas? ¿O simplemente das por sentado que tenés la Palabra viva de Dios al alcance de tu mano? El ajetreo de la vida tiene la capacidad de reducir nuestro tiempo a solas con Dios hasta que pierde su poder.</p>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Martín Lutero · What Luther Says: An Anthology, t. 1, p. 83</div>
        <div className="egw-text">«Durante varios años he leído la Biblia dos veces al año. Si la Biblia fuera un árbol grande y poderoso y todas sus palabras fueran pequeñas ramas, yo habría tocado todas las ramas, <strong>ansioso por saber qué había allí y qué tenía que ofrecer</strong>.»</div>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>Tres sugerencias prácticas</div>

      {sugerencias.map(({ key, badge, name, body }) => (
        <div key={key} className={`expand-item${openExpand[key] ? " open" : ""}`} onClick={() => toggleExpand(key)}>
          <div className="expand-header">
            <span className="expand-badge">{badge}</span>
            <span className="expand-name">{name}</span>
            {openExpand[key] ? <ChevronUp size={15} color="var(--tx3)" /> : <ChevronDown size={15} color="var(--tx3)" />}
          </div>
          {openExpand[key] && <div className="expand-body">{body}</div>}
        </div>
      ))}

      <div className="card" style={{ marginTop: ".5rem" }}>
        <div className="card-label">El modelo de los bereanos — Hechos 17:11</div>
        <p>Los bereanos escudriñaban las Escrituras <strong style={{ color: "var(--tx)" }}>cada día</strong> — no solo en el culto del sábado — para verificar si lo que escuchaban era verdad. La constancia diaria es lo que transforma el conocimiento en fe viva.</p>
      </div>
    </>
  );
}

// ── TAB: DELEITE ─────────────────────────────────────────────────────────────
function TabDeleite() {
  return (
    <>
      <div className="sec-title">«Oh cuán dulce»</div>
      <div className="sec-sub">Meditar en la Palabra · Salmo 119:103-104</div>

      <div className="honey-card">
        <div className="honey-label"><Heart size={12} />La metáfora de la miel</div>
        <div className="honey-text">«¡Cuán dulces son a mi paladar tus palabras! Más que la miel a mi boca.»</div>
        <div className="honey-ref">Salmo 119:103 · RVR1960</div>
      </div>

      <div className="card">
        <div className="card-label">El deleite que no es forzado</div>
        <p>A diferencia de muchos postres, la dulzura de la Palabra de Dios es <strong style={{ color: "var(--tx)" }}>sanadora</strong> para nuestra vida — transforma nuestro carácter para bien. Una y otra vez, el Salmo 119 nos invita a deleitarnos en las palabras de Dios (vers. 16, 24, 35, 47, 70, 77, 92, 174). Ese deleite no es una respuesta forzada — es la experiencia genuina de todos los que reconocen que la Palabra contiene el mayor tesoro del mundo.</p>
      </div>

      <div className="card">
        <div className="card-label">Salmo 119:161-162 — Un corazón que reverencia</div>
        <p style={{ fontStyle: "italic", color: "var(--tx)", fontSize: "1rem", lineHeight: "1.65" }}>«Príncipes me han perseguido sin causa, pero mi corazón tuvo temor de tus palabras. Me regocijo en tu palabra como el que halla muchos despojos.»</p>
      </div>

      <div className="card">
        <div className="card-label">Inmersión, no velocidad</div>
        <p>«Se anticiparon mis ojos a las vigilias de la noche, para meditar en tus mandatos» (Sal 119:148). Este tipo de meditación no se logra en segundos. Requiere <strong style={{ color: "var(--tx)" }}>apartarse del ruido</strong>, poner a un lado el teléfono, desconectarse de las redes sociales y escuchar la voz de Dios sin distracciones.</p>
      </div>

      <div className="card">
        <div className="card-label">El modelo de Jesús — Marcos 1:35</div>
        <p>Para Jesús, esto significaba retirarse a un lugar solitario <strong style={{ color: "var(--tx)" }}>mucho antes del amanecer</strong>, mientras la multitud aún dormía. ¿Hay algún lugar al que puedas ir cada mañana para estar con Dios? Una silla junto a una ventana, un rincón tranquilo al aire libre, la mesa de la cocina. Un lugar concreto al que volver cada día.</p>
      </div>

      <div className="card">
        <div className="card-label">El mejor lugar — Lucas 10:39-42</div>
        <p>María eligió sentarse a los pies de Jesús — «la buena parte, la cual no le será quitada». Marta estaba ocupada con cosas urgentes e importantes. Jesús dijo que <strong style={{ color: "var(--tx)" }}>solo una cosa es necesaria</strong>. Sentado a los pies de Jesús, aprendiendo de su Palabra, es el mejor lugar en el que podés estar.</p>
      </div>
    </>
  );
}

// ── TAB: MÉTODO ──────────────────────────────────────────────────────────────
function TabMetodo({ openExpand, toggleExpand }) {
  const pasos = [
    {
      key: "m1", badge: "Ora", name: "Comenzá con oración",
      body: "«Nunca se debería estudiar la Biblia sin oración. Solo el Espíritu Santo puede hacernos sentir la importancia de lo que es fácil comprender, o impedir que nos apartemos del sentido de las verdades de difícil comprensión» (EGW, El conflicto de los siglos, cap. 38, p. 585). El Espíritu Santo es tu guía de estudio."
    },
    {
      key: "m2", badge: "Escribí", name: "Lee y escribí mientras lees",
      body: "Escribir ayuda a ralentizar los pensamientos y reflexionar sobre la Palabra a un ritmo en el que puedan producirse la observación, la interpretación y la aplicación. Lleva tus ideas de la cabeza al bolígrafo — y de ahí al corazón para el resto del día. Si no podés escribir, leé en voz alta y expresá tus pensamientos en forma de oración."
    },
    {
      key: "m3", badge: "Compartí", name: "Contale a alguien lo que aprendiste",
      body: "«Hablará mi lengua tus dichos» (Salmo 119:172). Compartir consolida el conocimiento en tu mente y anima a otra persona. Nuestro tiempo personal de estudio no solo nos fortalece — también nos equipa para animar a quienes nos rodean. Es una doble bendición: Dios nos prepara cada mañana para hablar palabras de aliento a los cansados (Is 50:4)."
    },
  ];

  return (
    <>
      <div className="sec-title">Profundizar en el estudio</div>
      <div className="sec-sub">Método práctico para cualquier persona</div>

      <div className="card">
        <div className="card-label">No hace falta ser erudito</div>
        <p>Aunque no hace falta ser un experto para estudiar la Biblia, hay formas en las que cualquier persona puede profundizar en la Palabra de Dios. Elegí un libro corto para empezar — Jonás, Marcos, Filipenses o 1 Juan — y avanzá poco a poco.</p>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>Los tres pasos esenciales</div>

      {pasos.map(({ key, badge, name, body }) => (
        <div key={key} className={`expand-item${openExpand[key] ? " open" : ""}`} onClick={() => toggleExpand(key)}>
          <div className="expand-header">
            <span className="expand-badge">{badge}</span>
            <span className="expand-name">{name}</span>
            {openExpand[key] ? <ChevronUp size={15} color="var(--tx3)" /> : <ChevronDown size={15} color="var(--tx3)" />}
          </div>
          {openExpand[key] && <div className="expand-body">{body}</div>}
        </div>
      ))}

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem", marginTop: "1rem" }}>Método de 6 pasos para un versículo o pasaje</div>

      {[
        { num: "01", text: "Orá para que el Espíritu Santo guíe tu mente y sensibilice tu corazón mientras lees." },
        { num: "02", text: "Elegí un versículo o pasaje de la Biblia. Empezá pequeño — un versículo puede ser suficiente." },
        { num: "03", text: "En un diario, escribí el pasaje completo o las partes que más te llamen la atención." },
        { num: "04", text: "Volvé a leer el pasaje con espíritu de oración y subrayá las ideas clave." },
        { num: "05", text: "Escribí lo que te dicen esas ideas. ¿Qué implican para tu relación con Dios y tu vida diaria?" },
        { num: "06", text: "Orá sobre estas ideas y pensá con quién podrías compartir lo que aprendiste." },
      ].map(({ num, text }) => (
        <div key={num} className="step-item">
          <div className="step-num">{num}</div>
          <div className="step-body">{text}</div>
        </div>
      ))}

      <div className="egw-wrap" style={{ marginTop: ".5rem" }}>
        <div className="egw-source"><BookOpen size={12} />Isaías 50:4</div>
        <div className="egw-text">«El Señor Jehová me dio lengua de sabios, para saber hablar palabras al cansado; despertará mañana tras mañana, despertará mi oído para que oiga como los sabios.» <strong>Nuestro tiempo personal con Dios nos equipa para animar a otros — esa es la doble bendición.</strong></div>
      </div>
    </>
  );
}

// ── TAB: BIBLIA ───────────────────────────────────────────────────────────────
function TabBiblia({ openVerses, toggle, renderVerseText }) {
  return (
    <>
      <div className="sec-title">Biblia</div>
      <div className="sec-sub">{VERSES.length} referencias · RVR1960 · Tocá para expandir</div>
      {VERSES.map(v => (
        <div key={v.ref} className={`verse-item${v.base ? " base-v" : ""}`} onClick={() => toggle(v.ref)}>
          <div className="verse-header">
            <span className="verse-ref">{v.ref}</span>
            <div className="verse-tags">
              {v.base && <span className="verse-tag warn-tag"><Star size={9} style={{ display: "inline", marginRight: "2px" }} />Texto base</span>}
              {openVerses[v.ref] ? <ChevronUp size={16} color="var(--tx3)" /> : <ChevronDown size={16} color="var(--tx3)" />}
            </div>
          </div>
          {openVerses[v.ref] && <div className="verse-body">{renderVerseText(v.text)}</div>}
        </div>
      ))}
    </>
  );
}

// ── TAB: QUIZ ─────────────────────────────────────────────────────────────────
function TabQuiz({ quizIdx, quizSelected, quizAnswered, quizResults, quizDone, score, selectQuiz, nextQuiz, retryQuiz }) {
  if (quizDone) {
    const pct = Math.round((score / QUIZ_DATA.length) * 100);
    const msg = pct >= 80
      ? "Excelente comprensión. El mismo Dios que escribió el Salmo 119 quiere que su Palabra sea dulce como miel para vos hoy."
      : pct >= 50
      ? "Buen intento. Revisá los pasos del método de estudio y volvé — la Palabra de Dios tiene más profundidad que descubrir."
      : "No te desanimes. Abrí la Biblia, elegí un pasaje corto, aplicá el método de 6 pasos — y volvé a intentarlo.";
    return (
      <div className="quiz-results">
        <div className="quiz-score">{score}/{QUIZ_DATA.length}</div>
        <div className="quiz-pct">{pct}% · COMPLETADO</div>
        <p className="quiz-msg">{msg}</p>
        <button className="quiz-retry" onClick={retryQuiz}><RotateCcw size={15} /> Reintentar</button>
      </div>
    );
  }

  const q = QUIZ_DATA[quizIdx];
  return (
    <>
      <div className="sec-title">Quiz</div>
      <div className="sec-sub">Prueba tu comprensión de la semana</div>
      <div className="quiz-progress">
        {QUIZ_DATA.map((_, i) => (
          <div key={i} className={`quiz-dot${i < quizResults.length ? (quizResults[i] ? " correct" : " wrong") : i === quizIdx ? " active" : ""}`} />
        ))}
      </div>
      <div className="quiz-q">{q.q}</div>
      {q.opts.map((opt, i) => {
        let cls = "quiz-option";
        if (quizAnswered) {
          if (i === q.ans) cls += " correct";
          else if (i === quizSelected) cls += " wrong";
        }
        return (
          <button key={i} className={cls} disabled={quizAnswered} onClick={() => selectQuiz(i)}>
            {opt}
          </button>
        );
      })}
      {quizAnswered && (
        <>
          <div className="quiz-feedback">
            {quizSelected === q.ans
              ? <><CheckCircle size={14} style={{ display: "inline", marginRight: "6px", color: "var(--ok)" }} /><strong>Correcto.</strong> {q.feedback}</>
              : <><XCircle size={14} style={{ display: "inline", marginRight: "6px", color: "var(--err)" }} /><strong>Incorrecto.</strong> {q.feedback}</>
            }
          </div>
          <button className="quiz-next" onClick={nextQuiz}>
            {quizIdx + 1 < QUIZ_DATA.length ? "Siguiente →" : "Ver resultados"}
          </button>
        </>
      )}
    </>
  );
}

// ── TAB: CIERRE ──────────────────────────────────────────────────────────────
function TabCierre() {
  return (
    <>
      <div className="sec-title">Cierre</div>
      <div className="sec-sub">Preguntas para el grupo · Reflexión personal · Aplicación</div>

      {REFLEXIONES.map((r, i) => (
        <div className="reflex-card" key={i}>
          <div className="reflex-num">{i + 1}</div>
          <div className="reflex-body">
            <div className="reflex-q">{r.q}</div>
            <div className="reflex-ref">{r.ref}</div>
          </div>
        </div>
      ))}

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El otro poder, cap. 4, pp. 25-26</div>
        <div className="egw-text">«Tenemos muchas lecciones que aprender, y muchas, muchas, que <strong>desaprender</strong>. Solo Dios es infalible. Los que piensan que nunca tendrán que abandonar una posición favorita, ni tener ocasión de cambiar una opinión, se verán chasqueados. Mientras nos aferremos a nuestras propias ideas y opiniones con decidida persistencia, no podremos tener la unidad por la cual oró Cristo.»</div>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} />Para tu vida</div>
        <div className="vida-text">
          Tenés la Biblia en el celular — y también TikTok, Instagram, YouTube y un millón de notificaciones. Nadie te prohíbe la Biblia hoy. Solo se requiere que estés tan ocupado, tan entretenido, tan cansado, que nunca la abras.<br /><br />
          Lutero leía la Biblia dos veces al año aunque era uno de los hombres más ocupados del siglo XVI. Jesús se levantaba antes del amanecer para estar a solas con Dios, aunque tenía multitudes esperándolo. María eligió sentarse a los pies de Jesús cuando había tareas urgentes que hacer.<br /><br />
          Esta semana, tomá una decisión concreta: elegí <strong>un momento específico</strong>, <strong>un lugar específico</strong> y <strong>llevá un cuaderno</strong>. No busques la experiencia perfecta — buscá a Dios donde estás, con lo que tenés, hoy. El hábito se construye en 21 días, pero el primer paso se da ahora.
        </div>
      </div>
    </>
  );
}
