import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Heart, Scale,
  Eye, CheckCircle, XCircle, RotateCcw, Home, Shield, Flame
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg:#060e0d; --bg2:#0a1412; --bg3:#101e1c;
  --surf:#152422; --surf2:#1c3230;
  --brd:#1f3e3a; --brd2:#2a5450;
  --tx:#e8f5f3; --tx2:#9ecac4; --tx3:#5a9a94;
  --acc:#0d9488; --acc2:#14b8a6; --acc3:#7cf0e4;
  --ok:#10b981; --ok-d:rgba(16,185,129,.10);
  --err:#f43f5e; --err-d:rgba(244,63,94,.10);
  --warn:#f0b429; --warn-d:rgba(240,180,41,.10);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}

/* HERO */
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#091a18 0%,#060e0c 55%,#040a09 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(13,148,136,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.85rem;font-weight:700;line-height:1.18;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(13,148,136,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(13,148,136,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(13,148,136,.3) 30%,rgba(13,148,136,.3) 70%,transparent)}

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
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(13,148,136,.08);border-radius:10px;z-index:-1}

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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(13,148,136,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(240,180,41,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}

/* EXPAND */
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(13,148,136,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(13,148,136,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}

/* EGW */
.egw-wrap{background:linear-gradient(135deg,rgba(13,148,136,.07),rgba(13,148,136,.02));border:1px solid rgba(13,148,136,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(13,148,136,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}

/* CONTRAST CARD */
.contrast-wrap{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;margin-bottom:.9rem}
.contrast-card{background:var(--surf);border:1px solid var(--brd);border-radius:14px;padding:.9rem .85rem}
.contrast-card.bad{border-color:rgba(244,63,94,.22);background:rgba(244,63,94,.04)}
.contrast-card.good{border-color:rgba(16,185,129,.22);background:rgba(16,185,129,.04)}
.contrast-head{font-family:'IBM Plex Mono',monospace;font-size:.6rem;letter-spacing:.09em;text-transform:uppercase;margin-bottom:.5rem}
.contrast-card.bad .contrast-head{color:var(--err)}
.contrast-card.good .contrast-head{color:var(--ok)}
.contrast-item{font-size:.88rem;color:var(--tx2);line-height:1.5;margin-bottom:.3rem;padding-left:.6rem;border-left:2px solid var(--brd2)}
.contrast-card.bad .contrast-item{border-left-color:rgba(244,63,94,.3)}
.contrast-card.good .contrast-item{border-left-color:rgba(16,185,129,.3)}

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

/* GUIDE */
.guide-banner{background:linear-gradient(135deg,rgba(240,180,41,.10),rgba(240,180,41,.02));border:1px solid rgba(240,180,41,.22);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(240,180,41,.12);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
.guide-banner p{font-size:.9rem;color:var(--tx2);line-height:1.45}
.guide-step{display:flex;gap:.9rem;margin-bottom:.8rem;padding:.9rem 1rem;background:var(--surf);border-radius:12px;border:1px solid var(--brd)}
.guide-time{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--warn);white-space:nowrap;padding-top:.1rem;min-width:58px}
.guide-step-body{flex:1}
.guide-step-title{font-size:.97rem;font-weight:600;color:var(--tx);margin-bottom:.3rem}
.guide-step-desc{font-size:.92rem;line-height:1.55;color:var(--tx2)}

/* CIERRE */
.reflex-card{background:var(--surf);border:1px solid var(--brd);border-radius:14px;padding:1rem 1.05rem;margin-bottom:.75rem;display:flex;gap:.9rem;align-items:flex-start}
.reflex-num{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:var(--brd2);line-height:1;flex-shrink:0;width:2rem;padding-top:.1rem}
.reflex-body{flex:1}
.reflex-q{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:var(--tx);line-height:1.4}
.reflex-ref{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);margin-top:.35rem}
.vida-card{background:linear-gradient(135deg,rgba(13,148,136,.10),rgba(13,148,136,.02));border:1.5px solid rgba(13,148,136,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}

/* SWORD */
.sword-card{background:linear-gradient(135deg,rgba(244,63,94,.06),rgba(13,148,136,.04));border:1px solid rgba(13,148,136,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem}
.sword-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.sword-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.sword-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const VERSES = [
  {
    ref: "2 Timoteo 3:10-17", base: true,
    text: `10 Pero tú has seguido mi doctrina, conducta, propósito, fe, longanimidad, amor, paciencia, 11 persecuciones, padecimientos, como los que me sobrevinieron en Antioquía, en Iconio, en Listra; persecuciones que he sufrido, y de todas me ha librado el Señor. 12 Y también todos los que quieren vivir piadosamente en Cristo Jesús padecerán persecución; 13 mas los malos hombres y los engañadores irán de mal en peor, engañando y siendo engañados. 14 Pero persiste tú en lo que has aprendido y te persuadiste, sabiendo de quién has aprendido; 15 y que desde la niñez has sabido las Sagradas Escrituras, las cuales te pueden hacer sabio para la salvación por la fe que es en Cristo Jesús. 16 Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia, 17 a fin de que el hombre de Dios sea perfecto, enteramente preparado para toda buena obra.`
  },
  {
    ref: "Efesios 6:17-18",
    text: `17 Y tomad el yelmo de la salvación, y la espada del Espíritu, que es la palabra de Dios; 18 orando en todo tiempo con toda oración y súplica en el Espíritu, y velando en ello con toda perseverancia y súplica por todos los santos;`
  },
  {
    ref: "Hebreos 4:12",
    text: `Porque la palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos; y penetra hasta partir el alma y el espíritu, las coyunturas y los tuétanos, y discierne los pensamientos y las intenciones del corazón.`
  },
  {
    ref: "Salmo 33:6",
    text: `Por la palabra de Jehová fueron hechos los cielos, y todo el ejército de ellos por el aliento de su boca.`
  },
  {
    ref: "Juan 11:41-44",
    text: `41 Entonces quitaron la piedra de donde había sido puesto el muerto. Y Jesús, alzando los ojos a lo alto, dijo: Padre, gracias te doy por haberme oído. 42 Yo sabía que siempre me oyes; pero lo dije por causa de la multitud que está alrededor, para que crean que tú me has enviado. 43 Y habiendo dicho esto, clamó a gran voz: ¡Lázaro, ven fuera! 44 Y el que había muerto salió, atadas las manos y los pies con vendas, y el rostro envuelto en un sudario. Jesús les dijo: Desatadle, y dejadle ir.`
  },
  {
    ref: "Mateo 4:1-11",
    text: `1 Entonces Jesús fue llevado por el Espíritu al desierto, para ser tentado por el diablo. 2 Y después de haber ayunado cuarenta días y cuarenta noches, tuvo hambre. 3 Y vino a él el tentador, y le dijo: Si eres Hijo de Dios, di que estas piedras se conviertan en pan. 4 El respondió y dijo: Escrito está: No sólo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios. 5 Entonces el diablo le llevó a la santa ciudad, y le puso sobre el pináculo del templo, 6 y le dijo: Si eres Hijo de Dios, échate abajo; porque escrito está: A sus ángeles mandará acerca de ti, y en sus manos te sostendrán, para que no tropieces con tu pie en piedra. 7 Jesús le dijo: Escrito está también: No tentarás al Señor tu Dios. 8 Otra vez le llevó el diablo a un monte muy alto, y le mostró todos los reinos del mundo y la gloria de ellos, 9 y le dijo: Todo esto te daré, si postrado me adorares. 10 Entonces Jesús le dijo: Vete, Satanás, porque escrito está: Al Señor tu Dios adorarás, y a él sólo servirás. 11 El diablo entonces le dejó; y he aquí vinieron ángeles y le servían.`
  },
  {
    ref: "Lamentaciones 3:22-23",
    text: `22 Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. 23 Nuevas son cada mañana; grande es tu fidelidad.`
  },
  {
    ref: "Isaías 55:9",
    text: `Como son más altos los cielos que la tierra, así son mis caminos más altos que vuestros caminos, y mis pensamientos más que vuestros pensamientos.`
  },
  {
    ref: "Mateo 22:37",
    text: `Jesús le dijo: Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente.`
  },
  {
    ref: "Isaías 1:18",
    text: `Venid luego, dice Jehová, y estemos a cuenta: si vuestros pecados fueren como la grana, como la nieve serán emblanquecidos; si fueren rojos como el carmesí, vendrán a ser como blanca lana.`
  },
  {
    ref: "Proverbios 8:33",
    text: `Escuchad el consejo, y sed sabios, y no lo menospreciéis.`
  },
  {
    ref: "1 Corintios 2:14",
    text: `Pero el hombre natural no percibe las cosas que son del Espíritu de Dios, porque para él son locura, y no las puede entender, porque se han de discernir espiritualmente.`
  },
  {
    ref: "Santiago 1:21",
    text: `Por lo cual, desechando toda inmundicia y abundancia de malicia, recibid con mansedumbre la palabra implantada, la cual puede salvar vuestras almas.`
  },
  {
    ref: "1 Pedro 1:23",
    text: `siendo renacidos, no de simiente corruptible, sino de incorruptible, por la palabra de Dios que vive y permanece para siempre.`
  },
  {
    ref: "Marcos 9:24",
    text: `E inmediatamente el padre del muchacho clamó y dijo: Creo; ayuda mi incredulidad.`
  },
  {
    ref: "Lucas 17:6",
    text: `El Señor dijo: Si tuvierais fe como un grano de mostaza, podríais decir a este sicómoro: Desarráigate, y plántate en el mar; y os obedecería.`
  },
  {
    ref: "1 Tesalonicenses 2:13",
    text: `Por lo cual también nosotros sin cesar damos gracias a Dios, de que cuando recibisteis la palabra de Dios que oísteis de nosotros, la recibisteis no como palabra de hombres, sino según es en verdad, la palabra de Dios, la cual actúa en vosotros los creyentes.`
  },
  {
    ref: "Hebreos 1:1-2",
    text: `1 Dios, habiendo hablado muchas veces y de muchas maneras en otro tiempo a los padres por los profetas, 2 en estos postreros días nos ha hablado por el Hijo, a quien constituyó heredero de todo, y por quien asimismo hizo el universo;`
  },
  {
    ref: "2 Pedro 1:19-21",
    text: `19 Tenemos también la palabra profética más segura, a la cual hacéis bien en estar atentos como a una antorcha que alumbra en lugar oscuro, hasta que el día esclarezca y el lucero de la mañana salga en vuestros corazones; 20 entendiendo primero esto, que ninguna profecía de la Escritura es de interpretación privada, 21 porque nunca la profecía fue traída por voluntad humana, sino que los santos hombres de Dios hablaron siendo inspirados por el Espíritu Santo.`
  },
  {
    ref: "Salmo 33:4-5",
    text: `4 Porque recta es la palabra de Jehová, y toda su obra es hecha con fidelidad. 5 El ama justicia y juicio; de la misericordia de Jehová está llena la tierra.`
  },
  {
    ref: "Salmo 119:160",
    text: `La suma de tu palabra es verdad, y eterno es todo juicio de tu justicia.`
  },
  {
    ref: "Juan 17:17",
    text: `Santifícalos en tu verdad; tu palabra es verdad.`
  },
  {
    ref: "Efesios 1:13",
    text: `En él también vosotros, habiendo oído la palabra de verdad, el evangelio de vuestra salvación, y habiendo creído en él, fuisteis sellados con el Espíritu Santo de la promesa,`
  },
  {
    ref: "Salmo 12:6",
    text: `Las palabras de Jehová son palabras limpias, como plata refinada en horno de tierra, purificada siete veces.`
  },
  {
    ref: "Proverbios 30:5-6",
    text: `5 Toda palabra de Dios es limpia; él es escudo a los que en él esperan. 6 No añadas a sus palabras, para que no te reprenda, y seas hallado mentiroso.`
  },
  {
    ref: "Juan 14:6",
    text: `Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.`
  },
  {
    ref: "Juan 5:39",
    text: `Escudriñad las Escrituras; porque a vosotros os parece que en ellas tenéis la vida eterna; y ellas son las que dan testimonio de mí;`
  },
  {
    ref: "Hebreos 13:8",
    text: `Jesucristo es el mismo ayer, y hoy, y por los siglos.`
  },
  {
    ref: "Jeremías 15:16",
    text: `Fueron halladas tus palabras, y yo las comí; y tu palabra me fue por gozo y por alegría de mi corazón; porque tu nombre se invocó sobre mí, oh Jehová Dios de los ejércitos.`
  },
  {
    ref: "Mateo 4:4",
    text: `El respondió y dijo: Escrito está: No sólo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.`
  },
  {
    ref: "1 Pedro 2:2",
    text: `desead, como niños recién nacidos, la leche espiritual no adulterada, para que por ella crezcáis para salvación;`
  },
  {
    ref: "Mateo 12:34",
    text: `¡Generación de víboras! ¿Cómo podéis hablar lo bueno, siendo malos? porque de la abundancia del corazón habla la boca.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Cuánta Escritura es inspirada por Dios, según 2 Timoteo 3:16?",
    opts: ["Solo el Nuevo Testamento", "Los libros escritos por apóstoles", "Toda la Escritura", "Solo los Evangelios y las epístolas"],
    ans: 2,
    feedback: "«Toda la Escritura es inspirada por Dios» (2 Tim 3:16). No podemos seleccionar solo las partes con las que estamos cómodos — la Biblia es un todo."
  },
  {
    q: "¿Cuáles son las cuatro funciones de las Escrituras según 2 Timoteo 3:16?",
    opts: ["Entretener, informar, consolar y motivar", "Enseñar, redargüir, corregir, instruir en justicia", "Profetizar, sanar, salvar y juzgar", "Narrar historia, enseñar ciencia, revelar el futuro y guardar tradiciones"],
    ans: 1,
    feedback: "Enseñar (doctrina), redargüir (señalar el error), corregir (enderezar el camino) e instruir en justicia (formar el carácter). Las cuatro apuntan a transformar la vida."
  },
  {
    q: "¿Cómo llama Pablo a la Palabra de Dios en Efesios 6:17?",
    opts: ["El escudo de la fe", "El cinturón de la verdad", "La espada del Espíritu", "El yelmo de la salvación"],
    ans: 2,
    feedback: "«La espada del Espíritu, que es la palabra de Dios» (Ef 6:17). Jesús usó exactamente esta arma para vencer al tentador en el desierto (Mt 4:1-11)."
  },
  {
    q: "Según Hebreos 4:12, la Palabra de Dios es...",
    opts: ["Un relato histórico de la humanidad", "Viva y eficaz, más cortante que toda espada de dos filos", "Una colección de leyes morales antiguas", "Un manual de instrucción moral para la cultura"],
    ans: 1,
    feedback: "«Viva y eficaz, y más cortante que toda espada de dos filos; [...] discierne los pensamientos y las intenciones del corazón» (Heb 4:12). No es un libro muerto."
  },
  {
    q: "¿Qué declaró Jesús en Juan 14:6?",
    opts: ["«Venid a mí todos los que estáis trabajados»", "«Yo soy el camino, la verdad y la vida»", "«El que cree en mí tiene vida eterna»", "«Las Escrituras dan testimonio de mí»"],
    ans: 1,
    feedback: "«Yo soy el camino, y la verdad, y la vida» (Jn 14:6). Jesús no es una verdad entre muchas — se declaró la Verdad universal para todos los tiempos y culturas."
  },
  {
    q: "De acuerdo a Juan 5:39, ¿de quién dan testimonio las Escrituras?",
    opts: ["De los profetas de Israel", "De la ley de Moisés", "De Jesús, el Mesías", "De la historia del pueblo de Dios"],
    ans: 2,
    feedback: "«Escudriñad las Escrituras [...] ellas son las que dan testimonio de mí» (Jn 5:39). Toda la Biblia — Antiguo y Nuevo Testamento — apunta a Cristo."
  },
  {
    q: "¿Qué condición del corazón describe Santiago 1:21 para recibir la Palabra?",
    opts: ["Con inteligencia y preparación académica previa", "Con un espíritu crítico que evalúe cada texto", "Con mansedumbre, desechando la inmundicia y la malicia", "Con entusiasmo emocional en el momento"],
    ans: 2,
    feedback: "«Recibid con mansedumbre la palabra implantada, la cual puede salvar vuestras almas» (Stg 1:21). La actitud del corazón es determinante para el beneficio de la Palabra."
  },
  {
    q: "¿Qué enemigo trabaja activamente para mantenernos alejados de la Biblia?",
    opts: ["La modernidad y la tecnología únicamente", "Satanás, usando la profesión, apatía, cansancio y duda", "El sistema educativo secular", "Los falsos maestros dentro de la iglesia"],
    ans: 1,
    feedback: "Satanás «emplea cuantos medios puede para impedir que las personas conozcan la Biblia» (EGW, El conflicto de los siglos, cap. 38, p. 579). Sabe que la Palabra lo deja sin poder."
  },
];

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: La pregunta del espejo", desc: "Preguntá al grupo: ¿Cuántas Biblias tienen en casa? ¿Cuántas veces la leyeron esta semana? La Biblia es el libro más distribuido de la historia — ¿y también el más descuidado en nuestros hogares?" },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos de oración brevemente. Orar pidiendo corazones abiertos al Espíritu Santo para recibir la Palabra en la sesión de hoy." },
  { time: "05–12 min", title: "Tab Autoridad — Las 4 funciones de la Biblia", desc: "Leer 2 Timoteo 3:16-17 en voz alta. Recorrer las cuatro funciones. Usar el contraste (enfoque correcto vs incorrecto). Preguntar: ¿Cuándo fue la última vez que la Biblia te corrigió algo? ¿Lo recibiste?" },
  { time: "12–19 min", title: "Tab Corazón — El estado del corazón", desc: "Presentar los cuatro tipos de corazón al acercarse a la Biblia. Énfasis en la EGW: leer con actitud equivocada puede empeorar la condición espiritual. Preguntar: ¿Con qué espíritu llegás vos a la Biblia habitualmente?" },
  { time: "19–23 min", title: "Tab Verdad — Jesús como Verdad", desc: "El contexto cultural: la verdad está en crisis (Time 2017). Contrastar con Juan 14:6 y Juan 5:39. Toda la Biblia da testimonio de Jesús. Preguntar: ¿Cómo cambia tu lectura de la Biblia cuando sabés que todo apunta a Cristo?" },
  { time: "23–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Pausar en las que generan discusión. Usar los feedbacks como punto de profundización." },
  { time: "27–30 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Énfasis en la última: ¿Qué ha hecho la Biblia en tu vida? Cerrar con el desafío concreto del 'Para tu vida'. Oración final a cargo del maestro." },
];

const REFLEXIONES = [
  { q: "¿En qué se diferencia la Biblia de cualquier otro libro de la historia? ¿Qué la hace única y por qué la gente arriesgaba su vida por obtenerla?", ref: "2 Timoteo 3:16; 2 Pedro 1:21" },
  { q: "¿Cuáles son los beneficios concretos de estudiar las Escrituras en tu vida? ¿Para qué sirve la Biblia según 2 Timoteo 3:15-17?", ref: "2 Timoteo 3:15-17" },
  { q: "¿Cuál es el estado de tu corazón cuando vas a leer la Biblia? ¿Traés tus opiniones para justificarlas, o llegás con mente abierta dispuesto a ser corregido?", ref: "Santiago 1:21; 1 Corintios 2:14" },
  { q: "¿Qué o quién es la verdad? ¿Dónde encontramos esa verdad que 'no cambia con el tiempo'?", ref: "Juan 14:6; Juan 17:17; Juan 5:39" },
  { q: "¿Cuál es la diferencia entre leer la Biblia como un libro sobre Dios y leerla como un libro de Dios escrito específicamente para vos?", ref: "Jeremías 15:16; 1 Pedro 2:2" },
  { q: "¿Qué ha hecho la Biblia en tu vida hasta ahora? ¿Cómo sería tu vida sin ella? Si hablaras con alguien escéptico, ¿qué le dirías?", ref: "1 Tesalonicenses 2:13; Hebreos 4:12" },
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
    { id: "autoridad", label: "Autoridad", Icon: Scale },
    { id: "corazon", label: "Corazón", Icon: Heart },
    { id: "verdad", label: "Verdad", Icon: Eye },
    { id: "biblia", label: "Biblia", Icon: BookOpen },
    { id: "quiz", label: "Quiz", Icon: Shield },
    { id: "cierre", label: "Cierre", Icon: Star },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="scroll-area" ref={scrollRef}>
          {/* HERO */}
          <div className="hero" onClick={handleHeroTap}>
            <div className="hero-glow" />
            <div className="hero-brand">
              <span className="hero-dot" />
              InVerso · Semana 4
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              El papel de<br />la <em>Biblia</em>
            </h1>
            <div className="hero-ref">2 Timoteo 3 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio" && <TabInicio teacherMode={teacherMode} />}
            {tab === "autoridad" && <TabAutoridad openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "corazon" && <TabCorazon openExpand={openExpand} toggleExpand={toggleExpand} teacherMode={teacherMode} />}
            {tab === "verdad" && <TabVerdad />}
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

        {/* NAV */}
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
      <div className="sec-title">El libro más poderoso</div>
      <div className="sec-sub">Prohibido, copiado en secreto, contrabandeado. La gente moría por obtenerlo.</div>

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
              <strong style={{ color: "var(--tx)" }}>Autoridad</strong> — Las 4 funciones de la Biblia (2 Tim 3:16-17)<br />
              <strong style={{ color: "var(--tx)" }}>Corazón</strong> — Cómo recibimos la Palabra y con qué actitud<br />
              <strong style={{ color: "var(--tx)" }}>Verdad</strong> — Jesús como la Verdad; las Escrituras testifican de él<br />
              <strong style={{ color: "var(--tx)" }}>Biblia</strong> — Los 32 versículos de la semana · RVR1960
            </p>
          </div>

          <div className="sword-card">
            <div className="sword-label"><BookOpen size={12} />Hebreos 4:12</div>
            <div className="sword-text">«La palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos; [...] discierne los pensamientos y las intenciones del corazón.»</div>
            <div className="sword-ref">Hebreos 4:12 · RVR1960</div>
          </div>

          <div className="egw-wrap">
            <div className="egw-source"><BookOpen size={12} />Elena G. de White · El conflicto de los siglos, cap. 38, p. 579</div>
            <div className="egw-text">«Satanás emplea cuantos medios puede para impedir que [las personas] conozcan la Biblia, cuyo claro lenguaje revela sus engaños. Sabe que la <strong>oración y el estudio de la Biblia</strong> son las armas más poderosas que la humanidad puede usar contra él.»</div>
          </div>

          <div className="card">
            <div className="card-label">Pregunta para arrancar</div>
            <p>¿La Biblia está en tu mesita de noche acumulando polvo, o en tu teléfono entre las apps que nunca abrís? <strong style={{ color: "var(--acc3)" }}>¿Qué lugar real ocupa en tu semana?</strong> Satanás no necesita prohibirla hoy — solo necesita que estés demasiado ocupado para abrirla.</p>
          </div>
        </>
      )}
    </>
  );
}

// ── TAB: AUTORIDAD ────────────────────────────────────────────────────────────
function TabAutoridad({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Las Escrituras: Autoridad</div>
      <div className="sec-sub">«Toda la Escritura es inspirada por Dios» — 2 Timoteo 3:16</div>

      <div className="card">
        <div className="card-label">El principio de autoridad</div>
        <p>Para que la Biblia tenga verdadero impacto, debemos aceptar la inspiración de <strong style={{ color: "var(--tx)" }}>toda la Escritura</strong>, no solo de las partes con las que tendemos a estar de acuerdo. Cuando la Biblia entra en conflicto con nuestras opiniones, debemos permitir que la Biblia nos corrija — y no intentar corregirla a ella.</p>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>Las 4 funciones de las Escrituras (2 Tim 3:16)</div>

      {[
        { key: "f1", badge: "01", name: "Enseñar", body: "La Biblia es la fuente de doctrina. Nos revela la voluntad de Dios, su carácter y su plan de redención. No es un libro de historia ni de ciencia — es revelación divina de quién es Dios y qué quiere de nosotros. Dios no espera que dejemos de pensar: «Vengan, vamos a discutir este asunto» (Is 1:18)." },
        { key: "f2", badge: "02", name: "Redargüir", body: "La Palabra identifica el error — en doctrina y en conducta. «El hombre natural no percibe las cosas del Espíritu de Dios» (1 Cor 2:14), por eso la Biblia con el Espíritu Santo actúa como espejo que revela lo que no vemos en nosotros mismos. Esto requiere humildad para recibirlo." },
        { key: "f3", badge: "03", name: "Corregir", body: "No basta señalar el error — la Biblia también muestra el camino de regreso. Endereza lo que está torcido. Alguien con corazón sensible acepta la Palabra en lo más profundo de su ser y «recibe nueva vida de ella» (1 P 1:23). La corrección bíblica es acto de amor, no de condena." },
        { key: "f4", badge: "04", name: "Instruir en justicia", body: "El objetivo final: que el «hombre de Dios sea perfecto, enteramente preparado para toda buena obra» (2 Tim 3:17). No se trata de acumular conocimiento bíblico — se trata de que ese conocimiento forme el carácter. La Biblia no es académica; es transformacional." },
      ].map(({ key, badge, name, body }) => (
        <div key={key} className={`expand-item${openExpand[key] ? " open" : ""}`} onClick={() => toggleExpand(key)}>
          <div className="expand-header">
            <span className="expand-badge">{badge}</span>
            <span className="expand-name">{name}</span>
            {openExpand[key] ? <ChevronUp size={15} color="var(--tx3)" /> : <ChevronDown size={15} color="var(--tx3)" />}
          </div>
          {openExpand[key] && <div className="expand-body">{body}</div>}
        </div>
      ))}

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem", marginTop: "1rem" }}>¿Cómo nos acercamos a la Biblia?</div>
      <div className="contrast-wrap">
        <div className="contrast-card bad">
          <div className="contrast-head">Incorrecto</div>
          <div className="contrast-item">Seleccionar solo las partes cómodas</div>
          <div className="contrast-item">Usarla para justificar mis opiniones</div>
          <div className="contrast-item">Leer con espíritu crítico y arrogante</div>
          <div className="contrast-item">Ponerme por encima del texto</div>
        </div>
        <div className="contrast-card good">
          <div className="contrast-head">Correcto</div>
          <div className="contrast-item">Aceptar la Biblia en su totalidad</div>
          <div className="contrast-item">Dejar que ella corrija mis opiniones</div>
          <div className="contrast-item">Acercarse con humildad y fe</div>
          <div className="contrast-item">Confiar en que Dios habla cuando necesito</div>
        </div>
      </div>

      <div className="egw-wrap" style={{ marginTop: ".5rem" }}>
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · La educación, cap. 30, p. 234</div>
        <div className="egw-text">«Una cosa es tratar la Biblia como un manual de instrucción moral [...] pero otra cosa es considerarla como lo que en realidad es: <strong>la Palabra del Dios viviente</strong>, la palabra que es nuestra vida, la palabra que ha de moldear nuestras acciones, nuestros dichos y nuestros pensamientos.»</div>
      </div>
    </>
  );
}

// ── TAB: CORAZÓN ─────────────────────────────────────────────────────────────
function TabCorazon({ openExpand, toggleExpand, teacherMode }) {
  const studentItems = [
    {
      key: "c1", badge: "Corazón abierto", name: "Con humildad y mansedumbre",
      body: "«Recibid con mansedumbre la palabra implantada, la cual puede salvar vuestras almas» (Stg 1:21). Un corazón abierto acepta la Palabra en lo más profundo del ser y recibe nueva vida de ella. No se trata de emoción — se trata de disponibilidad real para ser transformado."
    },
    {
      key: "c2", badge: "Corazón cerrado", name: "Con arrogancia o apatía",
      body: "Cuando pensamos que ya lo sabemos todo y que no hay nada nuevo que descubrir, la instrucción de la Palabra nunca va más allá de la superficie. EGW advierte: «Muchos leen la Biblia de una manera que no aprovecha, y hasta en numerosos casos produce un daño patente» (El camino a Cristo, cap. 12, p. 165)."
    },
    {
      key: "c3", badge: "Discernimiento", name: "No todos ven lo mismo",
      body: "«El hombre natural no percibe las cosas que son del Espíritu de Dios, porque para él son locura» (1 Cor 2:14). El mismo texto puede cambiar la vida de una persona y no impactar en absoluto a otra. La diferencia no es inteligencia — es apertura espiritual al Espíritu Santo."
    },
    {
      key: "c4", badge: "La fe importa", name: "Dios puede hacer crecer tu fe",
      body: "«Creo; ayuda mi incredulidad» (Mr 9:24). Si tu fe es pequeña para recibir la Biblia, la buena noticia es que Dios puede aumentarla. No hay que esperar tener fe perfecta para empezar. Incluso una fe como semilla de mostaza es suficiente para que la Palabra obre (Lc 17:6)."
    },
  ];

  return (
    <>
      <div className="sec-title">Recibir Instrucción</div>
      <div className="sec-sub">Las mismas palabras cambian la vida de una persona y no impactan en nada a otra.</div>

      <div className="card">
        <div className="card-label">El estado del corazón</div>
        <p>Nuestra capacidad para recibir instrucción bíblica depende del <strong style={{ color: "var(--tx)" }}>estado de nuestro corazón</strong>. La Palabra de Dios obra en nosotros cuando tenemos fe. El crecimiento es gradual — tal vez no lo reconozcamos de inmediato — pero si seguimos aferrados a la apatía y el pecado sin disposición a cambiar, leer la Biblia nos servirá de poco.</p>
      </div>

      {studentItems.map(({ key, badge, name, body }) => (
        <div key={key} className={`expand-item${openExpand[key] ? " open" : ""}`} onClick={() => toggleExpand(key)}>
          <div className="expand-header">
            <span className="expand-badge">{badge}</span>
            <span className="expand-name">{name}</span>
            {openExpand[key] ? <ChevronUp size={15} color="var(--tx3)" /> : <ChevronDown size={15} color="var(--tx3)" />}
          </div>
          {openExpand[key] && <div className="expand-body">{body}</div>}
        </div>
      ))}

      <div className="egw-wrap" style={{ marginTop: ".5rem" }}>
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Testimonios para la iglesia, t. 8, p. 333</div>
        <div className="egw-text">«La razón por lo que la juventud, y aun los que han alcanzado una edad madura, caen tan fácilmente en la tentación y el pecado es que <strong>no estudian la Palabra de Dios ni meditan en ella como debieran</strong>. La falta de una fuerza de voluntad firme [...] es el resultado de su descuido de las sagradas instrucciones de la Palabra de Dios.»</div>
      </div>

      {teacherMode && (
        <div className="card" style={{ borderColor: "rgba(240,180,41,.3)", background: "rgba(240,180,41,.04)" }}>
          <div className="card-label" style={{ color: "var(--warn)" }}>Nota para el maestro</div>
          <p>Preguntar al grupo: ¿Con cuál de los cuatro tipos de corazón te identificás más honestamente hoy? Dar espacio para respuestas personales. No presionar — el objetivo es reflexión, no confesión pública. Esta sección es de las más transformadoras si hay un ambiente de confianza.</p>
        </div>
      )}
    </>
  );
}

// ── TAB: VERDAD ───────────────────────────────────────────────────────────────
function TabVerdad() {
  return (
    <>
      <div className="sec-title">Contempla a Jesús</div>
      <div className="sec-sub">Las Escrituras dan testimonio de él — Juan 5:39</div>

      <div className="card">
        <div className="card-label">El contexto cultural</div>
        <p>En 2017, la portada de la revista <em style={{ color: "var(--acc3)" }}>Time</em> preguntaba: <strong style={{ color: "var(--tx)" }}>«¿Ha muerto la verdad?»</strong> La idea misma de la verdad se deteriora — la cultura popular dice que no hay una vara de medir confiable. Sin embargo, Jesús declaró sin límite de cultura ni era: <strong style={{ color: "var(--acc3)" }}>«Yo soy el camino, la verdad y la vida»</strong> (Jn 14:6).</p>
      </div>

      <div className="sword-card">
        <div className="sword-label"><Eye size={12} />La Biblia preserva esa verdad</div>
        <div className="sword-text">«Las Escrituras dan testimonio de mí.»</div>
        <div className="sword-ref">Juan 5:39 — Jesús hablando sobre las Escrituras</div>
      </div>

      <div className="card">
        <div className="card-label">Un solo hilo en toda la Biblia</div>
        <p>El Antiguo Testamento prometió la venida de Jesús. El Nuevo Testamento documentó su llegada. Jesús está <strong style={{ color: "var(--tx)" }}>presente simbólicamente en el AT</strong> y se revela en el NT. Ambos dan testimonio de una sola Verdad. Por eso no se puede leer la Biblia en fragmentos — es un relato continuo con un protagonista: Jesús.</p>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Testimonios para la iglesia, t. 5, p. 659</div>
        <div className="egw-text">«Hay minas de verdad que ha de descubrir todavía el investigador ferviente. <strong>La Biblia nunca contradice las verdades pasadas, sino que se basa en ellas.</strong> Podemos buscar luz adicional porque ella nunca contradice lo que ya fue revelado.»</div>
      </div>

      <div className="card">
        <div className="card-label">La Biblia como fuente de toda verdad</div>
        <p>La Biblia, y solo la Biblia, debe ser la fuente de lo que entendemos como verdad. <strong style={{ color: "var(--tx)" }}>Todas las demás fuentes deben probarse</strong> con la Palabra de Dios — incluso lo que llamamos «razón» necesita ser evaluado a su luz. Jesucristo «es el mismo ayer, y hoy, y por los siglos» (Heb 13:8): esa permanencia es el ancla en un mundo donde la verdad se negocia.</p>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Testimonios para la iglesia, t. 8, p. 333</div>
        <div className="egw-text">«La Biblia entera es una revelación de la gloria de Dios en Cristo. Aceptada, creída y obedecida, es el gran instrumento para <strong>la transformación del carácter</strong>. Y es el único medio seguro para lograr la cultura intelectual.»</div>
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
      ? "Excelente comprensión. La Biblia que estudias con este esfuerzo es la misma que puede transformar tu vida."
      : pct >= 50
      ? "Buen intento. Revisá los versículos clave y volvé — el crecimiento en la Palabra es un proceso gradual."
      : "La lección tiene profundidad. No te desanimes — abrí la Biblia, releé con calma, y volvé a intentarlo.";
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

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} />Para tu vida</div>
        <div className="vida-text">
          Tenés la Biblia en tu teléfono, pero también tenés Instagram, YouTube, TikTok y un millón de notificaciones. <strong>Satanás no necesita prohibir la Biblia hoy</strong> — solo necesita que estés tan ocupado que nunca la abras.<br /><br />
          La próxima vez que agarres el teléfono en la mañana, antes del primer scroll, abrí una sola página de la Palabra. No tiene que ser un estudio académico ni una hora de devoción perfecta. Solo vos, el texto, y un corazón disponible.<br /><br />
          Jeremías escribió: «Fueron halladas tus palabras, y yo las comí; y tu palabra me fue por gozo y por alegría de mi corazón» (Jer 15:16). La Biblia no es una clase que hay que aprobar. <strong>Es alimento. Y nadie come por obligación cuando tiene hambre de verdad.</strong>
        </div>
      </div>
    </>
  );
}
