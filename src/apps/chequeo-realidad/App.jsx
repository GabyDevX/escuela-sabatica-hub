import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Home, HelpCircle,
  MessageCircle, Flame, Leaf, RotateCcw, CheckCircle, XCircle, Thermometer
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg:#090e0a;
  --bg2:#0d1410;
  --bg3:#121a14;
  --surf:#161f18;
  --surf2:#1c2820;
  --brd:#223028;
  --brd2:#2e4035;
  --tx:#f0f7f1;
  --tx2:#c8deca;
  --tx3:#7da882;
  --acc:#4d9e5a;
  --acc2:#6abf75;
  --acc3:#b2ddb8;
  --ok:#4d9e5a;
  --ok-d:rgba(77,158,90,.12);
  --err:#d4574a;
  --err-d:rgba(212,87,74,.1);
  --warn:#c49a3a;
  --warn-d:rgba(196,154,58,.1);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}

/* HERO */
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(175deg,#0c1a0f 0%,#0a1309 55%,#07100a 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:360px;height:260px;background:radial-gradient(ellipse at 50% 30%,rgba(77,158,90,.25) 0%,transparent 70%);pointer-events:none}
.hero-branch{position:absolute;pointer-events:none;opacity:.11}
.hero-branch.l{left:-18px;bottom:-8px;width:175px;transform:rotate(-18deg)}
.hero-branch.r{right:-28px;top:5px;width:155px;transform:rotate(22deg) scaleX(-1)}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.8;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Lora',serif;font-size:1.95rem;font-weight:700;line-height:1.18;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1;letter-spacing:-.01em}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(77,158,90,.18);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(77,158,90,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(77,158,90,.28) 30%,rgba(77,158,90,.28) 70%,transparent)}

/* SECRET BAR */
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}

/* NAV */
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:52px;min-height:56px;padding:.65rem .35rem .55rem;font-size:.5rem;gap:4px;justify-content:center;background:transparent;border:none;color:#5a8c62;cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.04em;text-transform:uppercase}
.nav button svg{width:20px;height:20px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:18%;right:18%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 5px;background:rgba(77,158,90,.11);border-radius:10px;z-index:-1}

/* CONTENT */
.content{padding:1.25rem 1rem 2rem;animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.sec-title{font-family:'Lora',serif;font-size:1.65rem;font-weight:700;color:var(--tx);margin-bottom:.25rem;line-height:1.2}
.sec-sub{font-size:.95rem;color:#b8d4bb;margin-bottom:1.25rem;line-height:1.55}

/* CARDS */
.card{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1.1rem 1rem;margin-bottom:.85rem}
.card p{font-size:1rem;line-height:1.65;color:#c8deca}
.card-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:#7da882;margin-bottom:.5rem}

/* VERSE */
.verse-item{border-left:3px solid var(--acc);border-radius:0 12px 12px 0;background:var(--surf);margin-bottom:.7rem;overflow:hidden;cursor:pointer;transition:background .2s}
.verse-item:hover{background:var(--surf2)}
.verse-item.base{border-left:4px solid var(--warn)}
.verse-header{display:flex;align-items:center;justify-content:space-between;padding:.8rem 1rem}
.verse-ref{font-family:'Lora',serif;font-size:1rem;font-weight:600;color:var(--tx)}
.verse-tags{display:flex;gap:.4rem;align-items:center}
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(77,158,90,.15);color:var(--acc2)}
.verse-tag.base-tag{background:rgba(196,154,58,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:#daf0dd;border-top:1px solid var(--brd)}

/* QUIZ */
.quiz-progress{display:flex;gap:4px;margin-bottom:1.2rem}
.quiz-dot{height:4px;flex:1;border-radius:2px;background:var(--brd2);transition:background .3s}
.quiz-dot.active{background:var(--acc2)}
.quiz-dot.correct{background:var(--ok)}
.quiz-dot.wrong{background:var(--err)}
.quiz-q{font-family:'Lora',serif;font-size:1.22rem;font-weight:600;line-height:1.4;color:var(--tx);margin-bottom:1.1rem}
.quiz-option{width:100%;background:var(--surf);border:1.5px solid var(--brd);border-radius:12px;padding:.85rem 1rem;font-size:1rem;color:#c8deca;cursor:pointer;text-align:left;margin-bottom:.5rem;transition:all .2s;font-family:'DM Sans',sans-serif;line-height:1.4}
.quiz-option:hover:not(:disabled){border-color:var(--acc);color:var(--tx);background:var(--surf2)}
.quiz-option.correct{border-color:var(--ok);background:var(--ok-d);color:var(--acc2)}
.quiz-option.wrong{border-color:var(--err);background:var(--err-d);color:var(--err)}
.quiz-feedback{background:var(--surf2);border-radius:12px;padding:.9rem 1rem;margin-top:.65rem;font-size:.97rem;line-height:1.55;color:#c8deca}
.quiz-feedback strong{color:var(--acc2)}
.quiz-next{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#fff;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;margin-top:.8rem;transition:background .2s}
.quiz-next:hover{background:var(--acc2)}
.quiz-results{text-align:center;padding:1rem 0}
.quiz-score{font-family:'Lora',serif;font-size:3.5rem;font-weight:700;color:var(--acc2);line-height:1}
.quiz-pct{font-family:'IBM Plex Mono',monospace;font-size:.75rem;color:var(--tx3);letter-spacing:.1em;margin-top:.3rem}
.quiz-msg{font-size:1.02rem;color:#c8deca;margin:1rem 0 1.5rem;line-height:1.55}
.quiz-retry{background:var(--surf);border:1.5px solid var(--brd2);border-radius:12px;padding:.8rem 1.5rem;font-size:.97rem;color:var(--acc2);cursor:pointer;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:.5rem;transition:border-color .2s}
.quiz-retry:hover{border-color:var(--acc)}

/* DIAGNÓSTICO */
.diag-grid{display:grid;gap:.6rem;margin-bottom:1.2rem}
.diag-card{background:var(--surf);border:1px solid var(--brd);border-radius:14px;padding:.9rem 1rem;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.diag-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:2px 0 0 2px}
.diag-card.c0::before{background:#c05a50}
.diag-card.c1::before{background:#c49a3a}
.diag-card.c2::before{background:#7a6abf}
.diag-card.c3::before{background:#3a8fa0}
.diag-card.c4::before{background:#4d9e5a}
.diag-card.open{background:var(--surf2);border-color:var(--brd2)}
.diag-header{display:flex;align-items:center;gap:.7rem}
.diag-label{font-family:'IBM Plex Mono',monospace;font-size:.56rem;color:#7da882;text-transform:uppercase;letter-spacing:.08em}
.diag-name{font-family:'Lora',serif;font-size:1.05rem;font-weight:600;color:var(--tx);flex:1}
.diag-body{font-size:.97rem;line-height:1.55;color:#c8deca;margin-top:.7rem;padding-top:.7rem;border-top:1px solid var(--brd)}
.diag-remedy{display:flex;gap:.5rem;margin-top:.6rem;padding:.6rem .8rem;background:rgba(77,158,90,.07);border-radius:8px;font-size:.9rem;color:var(--acc3);align-items:flex-start;line-height:1.45;border-left:2px solid rgba(77,158,90,.28)}

/* VID */
.vid-items{display:grid;gap:.65rem;margin-bottom:1rem}
.vid-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;padding:.9rem 1rem;cursor:pointer;transition:all .2s}
.vid-item.open{border-color:var(--acc);background:rgba(77,158,90,.05)}
.vid-header{display:flex;align-items:center;gap:.7rem}
.vid-num{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);background:rgba(77,158,90,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0}
.vid-title{font-size:1rem;font-weight:600;color:var(--tx);line-height:1.3}
.vid-body{font-size:.97rem;line-height:1.55;color:#c8deca;margin-top:.65rem;padding-top:.65rem;border-top:1px solid var(--brd)}

/* EGW */
.egw-wrap{background:linear-gradient(135deg,rgba(77,158,90,.08),rgba(77,158,90,.02));border:1px solid rgba(77,158,90,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Lora',serif;font-size:6rem;color:rgba(77,158,90,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:#c8deca;font-style:italic;font-family:'Lora',serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}

/* CIERRE */
.reflex-card{background:var(--surf);border:1px solid var(--brd);border-radius:14px;padding:1rem 1.05rem;margin-bottom:.75rem;display:flex;gap:.9rem;align-items:flex-start}
.reflex-num{font-family:'Lora',serif;font-size:1.6rem;font-weight:700;color:var(--brd2);line-height:1;flex-shrink:0;width:2rem;padding-top:.1rem}
.reflex-body{flex:1}
.reflex-q{font-family:'Lora',serif;font-size:1rem;font-weight:600;color:var(--tx);line-height:1.4}
.reflex-ref{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:#7da882;margin-top:.35rem}
.vida-card{background:linear-gradient(135deg,rgba(77,158,90,.12),rgba(77,158,90,.03));border:1.5px solid rgba(77,158,90,.24);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:#c8deca}
.vida-text strong{color:var(--tx)}

/* GUÍA MAESTRO */
.guide-banner{background:linear-gradient(135deg,rgba(196,154,58,.11),rgba(196,154,58,.03));border:1px solid rgba(196,154,58,.22);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(196,154,58,.12);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
.guide-banner p{font-size:.9rem;color:#c8deca;line-height:1.45}
.guide-step{display:flex;gap:.9rem;margin-bottom:.8rem;padding:.9rem 1rem;background:var(--surf);border-radius:12px;border:1px solid var(--brd)}
.guide-time{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--warn);white-space:nowrap;padding-top:.1rem;min-width:60px}
.guide-step-body{flex:1}
.guide-step-title{font-size:.97rem;font-weight:600;color:var(--tx);margin-bottom:.3rem}
.guide-step-desc{font-size:.92rem;line-height:1.55;color:#c8deca}
hr.gdiv{border:none;border-top:1px dashed var(--brd);margin:.4rem 0 .9rem}
`;

// ─── DATOS ────────────────────────────────────────────────────────────────────
const VERSES = [
  { ref:"Apocalipsis 3:14-22", base:true, text:`14 Escribe al ángel de la iglesia en Laodicea: He aquí el Amén, el testigo fiel y verdadero, el principio de la creación de Dios, dice esto: 15 Yo conozco tus obras, que ni eres frío ni caliente. ¡Ojalá fueses frío o caliente! 16 Pero por cuanto eres tibio, y no frío ni caliente, te vomitaré de mi boca. 17 Porque tú dices: Yo soy rico, y me he enriquecido, y de ninguna cosa tengo necesidad; y no sabes que tú eres un desventurado, miserable, pobre, ciego y desnudo. 18 Por tanto, yo te aconsejo que de mí compres oro refinado en fuego, para que seas rico, y vestiduras blancas para vestirte, y que la vergüenza de tu desnudez no se descubra; y unge tus ojos con colirio, para que veas. 19 Yo reprendo y castigo a todos los que amo; sé, pues, celoso, y arrepiéntete. 20 He aquí, yo estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré a él, y cenaré con él, y él conmigo. 21 Al que venciere, le daré que se siente conmigo en mi trono, así como yo he vencido, y me he sentado con mi Padre en su trono. 22 El que tiene oído, oiga lo que el Espíritu dice a las iglesias.` },
  { ref:"Jeremías 31:3-4", text:`3 De lejos Jehová se me apareció diciendo: Con amor eterno te he amado; por tanto, te prolongué mi misericordia. 4 Aún te edificaré, y serás edificada, oh virgen de Israel; todavía serás adornada con tus panderos, y saldrás en los coros de los que se alegran.` },
  { ref:"Juan 15:1-11", text:`1 Yo soy la vid verdadera, y mi Padre es el labrador. 2 Todo pámpano que en mí no lleva fruto, lo quitará; y todo aquel que lleva fruto, lo limpiará, para que lleve más fruto. 3 Ya vosotros estáis limpios por la palabra que os he hablado. 4 Permaneced en mí, y yo en vosotros. Como el pámpano no puede llevar fruto de sí mismo, si no permanece en la vid, así tampoco vosotros, si no permanecéis en mí. 5 Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto; porque separados de mí nada podéis hacer. 6 El que en mí no permanece, será echado fuera como pámpano, y se secará; y los recogen, y los echan en el fuego, y arden. 7 Si permanecéis en mí, y mis palabras permanecen en vosotros, pedid todo lo que queréis, y os será hecho. 8 En esto es glorificado mi Padre, en que llevéis mucho fruto, y seáis así mis discípulos. 9 Como el Padre me ha amado, así también yo os he amado; permaneced en mi amor. 10 Si guardareis mis mandamientos, permaneceréis en mi amor; así como yo he guardado los mandamientos de mi Padre, y permanezco en su amor. 11 Estas cosas os he hablado, para que mi gozo esté en vosotros, y vuestro gozo sea cumplido.` },
  { ref:"Juan 15:15", text:`Ya no os llamaré siervos, porque el siervo no sabe lo que hace su señor; pero os he llamado amigos, porque todas las cosas que oí de mi Padre, os las he dado a conocer.` },
  { ref:"Gálatas 5:22-23", text:`22 Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, 23 mansedumbre, templanza; contra tales cosas no hay ley.` },
  { ref:"Juan 4:35-38", text:`35 ¿No decís vosotros: Aún faltan cuatro meses para que llegue la siega? He aquí os digo: Alzad vuestros ojos y mirad los campos, porque ya están blancos para la siega. 36 Y el que siega recibe salario, y recoge fruto para vida eterna, para que el que siembra goce juntamente con el que siega. 37 Porque en esto es verdadero el dicho: Uno es el que siembra, y otro es el que siega. 38 Yo os he enviado a segar lo que vosotros no labrasteis; otros labraron, y vosotros habéis entrado en sus labores.` },
  { ref:"1 Juan 3:24", text:`Y el que guarda sus mandamientos, permanece en Dios, y Dios en él. Y en esto sabemos que él permanece en nosotros, por el Espíritu que nos ha dado.` },
  { ref:"1 Juan 4:12-16", text:`12 Nadie ha visto jamás a Dios. Si nos amamos unos a otros, Dios permanece en nosotros, y su amor se ha perfeccionado en nosotros. 13 En esto conocemos que permanecemos en él, y él en nosotros, en que nos ha dado de su Espíritu. 14 Y nosotros hemos visto y testificamos que el Padre ha enviado al Hijo, el Salvador del mundo. 15 Todo aquel que confiese que Jesús es el Hijo de Dios, Dios permanece en él, y él en Dios. 16 Y nosotros hemos conocido y creído el amor que Dios tiene para con nosotros. Dios es amor; y el que permanece en amor, permanece en Dios, y Dios en él.` },
  { ref:"1 Juan 4:13", text:`En esto conocemos que permanecemos en él, y él en nosotros, en que nos ha dado de su Espíritu.` },
  { ref:"1 Juan 4:19", text:`Nosotros le amamos a él, porque él nos amó primero.` },
  { ref:"1 Juan 2:3-6", text:`3 Y en esto sabemos que nosotros le conocemos, si guardamos sus mandamientos. 4 El que dice: Yo le conozco, y no guarda sus mandamientos, el tal es mentiroso, y la verdad no está en él; 5 pero el que guarda su palabra, en éste verdaderamente el amor de Dios se ha perfeccionado; por esto sabemos que estamos en él. 6 El que dice que permanece en él, debe andar como él anduvo.` },
  { ref:"Lucas 11:13", text:`Pues si vosotros, siendo malos, sabéis dar buenas dádivas a vuestros hijos, ¿cuánto más vuestro Padre celestial dará el Espíritu Santo a los que se lo pidan?` },
  { ref:"Juan 14:15-18, 23", text:`15 Si me amáis, guardad mis mandamientos. 16 Y yo rogaré al Padre, y os dará otro Consolador, para que esté con vosotros para siempre: 17 el Espíritu de verdad, al cual el mundo no puede recibir, porque no le ve, ni le conoce; pero vosotros le conocéis, porque mora con vosotros, y estará en vosotros. 18 No os dejaré huérfanos; vendré a vosotros. ... 23 El que me ama, mi palabra guardará; y mi Padre le amará, y vendremos a él, y haremos morada con él.` },
  { ref:"Romanos 8:9-11", text:`9 Mas vosotros no vivís según la carne, sino según el Espíritu, si es que el Espíritu de Dios mora en vosotros. Y si alguno no tiene el Espíritu de Cristo, no es de él. 10 Pero si Cristo está en vosotros, el cuerpo en verdad está muerto a causa del pecado, mas el espíritu vive a causa de la justicia. 11 Y si el Espíritu de aquel que levantó de los muertos a Jesús mora en vosotros, el que levantó de los muertos a Cristo Jesús vivificará también vuestros cuerpos mortales por su Espíritu que mora en vosotros.` },
  { ref:"Génesis 3:8-10", text:`8 Y oyeron la voz de Jehová Dios que se paseaba en el huerto, al aire del día; y el hombre y su mujer se escondieron de la presencia de Jehová Dios entre los árboles del huerto. 9 Mas Jehová Dios llamó al hombre, y le dijo: ¿Dónde estás tú? 10 Y él respondió: Oí tu voz en el huerto, y tuve miedo, porque estaba desnudo; y me escondí.` },
  { ref:"Génesis 5:24", text:`Caminó, pues, Enoc con Dios, y desapareció, porque le llevó Dios.` },
  { ref:"Éxodo 33:11", text:`Y hablaba Jehová a Moisés cara a cara, como habla cualquiera a su compañero. Y él volvía al campamento; pero el joven Josué hijo de Nun, su servidor, nunca se apartaba de en medio del tabernáculo.` },
  { ref:"Éxodo 34:29", text:`Y aconteció que descendiendo Moisés del monte Sinaí con las dos tablas del testimonio en su mano, al descender del monte, no sabía Moisés que la piel de su rostro resplandecía, después que hubo hablado con Dios.` },
  { ref:"Apocalipsis 4:9-11", text:`9 Y siempre que aquellos seres vivientes dan gloria y honra y acción de gracias al que está sentado en el trono, al que vive por los siglos de los siglos, 10 los veinticuatro ancianos se postran delante del que está sentado en el trono, y adoran al que vive por los siglos de los siglos, y echan sus coronas delante del trono, diciendo: 11 Señor, digno eres de recibir la gloria y la honra y el poder; porque tú creaste todas las cosas, y por tu voluntad existen y fueron creadas.` },
  { ref:"Apocalipsis 5:11-14", text:`11 Y miré, y oí la voz de muchos ángeles alrededor del trono, y de los seres vivientes, y de los ancianos; y su número era millones de millones, 12 que decían a gran voz: El Cordero que fue inmolado es digno de tomar el poder, las riquezas, la sabiduría, la fortaleza, la honra, la gloria y la alabanza. 13 Y a todo lo creado que está en el cielo, y sobre la tierra, y debajo de la tierra, y en el mar, y a todas las cosas que en ellos hay, oí decir: Al que está sentado en el trono, y al Cordero, sea la alabanza, la honra, la gloria y el poder, por los siglos de los siglos. 14 Los cuatro seres vivientes decían: Amén; y los veinticuatro ancianos se postraron sobre sus rostros y adoraron al que vive por los siglos de los siglos.` },
];

const DIAGS = [
  { key:"c0", label:"Diagnóstico 1", name:"Desdichado", student:"Sabés que algo falta. Vas a la iglesia, pero por dentro hay un vacío. Llevás una vida cristiana de forma automática, sin emoción real.", teacher:"El griego ταλαίπωρος (talaipōros) implica miseria por esfuerzo agotador. El laodiceo cree que su vida cristiana es suficiente, pero en realidad está agotado de aparentar.", remedy:"Jesús ofrece descanso real: 'Venid a mí todos los que estáis trabajados' (Mt 11:28). La relación con él no es una carga sino alivio." },
  { key:"c1", label:"Diagnóstico 2", name:"Miserable", student:"Ves a otros con una fe vibrante y te preguntás por qué no la sentís vos. Hay una sensación constante de que tu fe es insuficiente.", teacher:"ἐλεεινός (eleeinos): digno de compasión. Cristo mira al laodiceo con ternura, no con desprecio. La miseria espiritual no es condena, es diagnóstico.", remedy:"'Yo reprendo y castigo a todos los que amo' (Ap 3:19). La reprensión es evidencia de amor, no de rechazo." },
  { key:"c2", label:"Diagnóstico 3", name:"Pobre", student:"Creés que tu vida espiritual está bien porque cumplís con lo básico. Pero la riqueza espiritual real —el amor profundo por Dios— se fue perdiendo.", teacher:"Laodicea era famosa por su banca. El contraste es poderoso: riqueza material, pobreza espiritual. Jesús ofrece 'oro refinado en fuego' (Ap 3:18).", remedy:"El oro de Cristo es fe y amor probados. No se compra con dinero sino con rendición al Señorío de Cristo." },
  { key:"c3", label:"Diagnóstico 4", name:"Ciego", student:"No ves tus propias fallas. Cuando alguien te señala algo, tu reacción inmediata es defenderte. Es difícil ver con claridad tu propia condición espiritual.", teacher:"Laodicea era famosa por su colirio medicinal (polvo frigio). Irónicamente, con toda esa medicina para los ojos, seguían espiritualmente ciegos.", remedy:"'Unge tus ojos con colirio, para que veas' (Ap 3:18). El Espíritu Santo es quien abre la visión espiritual." },
  { key:"c4", label:"Diagnóstico 5", name:"Desnudo", student:"Actuás como si todo estuviera bien, pero por dentro sabés que tu vida no refleja lo que decís creer. Hay una brecha entre lo que mostrás y lo que realmente sos.", teacher:"Laodicea era famosa por su industria textil —lana negra brillosa. Pero Jesús dice que están desnudos. Las 'vestiduras blancas' representan la justicia de Cristo.", remedy:"'Vestiduras blancas para vestirte' (Ap 3:18). La justicia no es propia sino la de Cristo que nos cubre." },
];

const VID_ITEMS = [
  { num:"01", title:"Permanecer es vivir en conexión íntima", body:"La palabra 'permanecer' aparece 10 veces en Juan 15:1-11. No es una visita ocasional a Jesús cuando lo necesitás, sino una conexión constante como la rama con la vid. Sin esa conexión, la rama no puede existir." },
  { num:"02", title:"El fruto es la prueba de la conexión", body:"El fruto del Espíritu (Gálatas 5:22-23) —amor, gozo, paz— no es algo que uno fabrica. Es el resultado natural de estar conectado. Si la rama está en la vid, el fruto viene solo." },
  { num:"03", title:"El Espíritu Santo es la savia", body:"Elena G. de White describe al Espíritu Santo como la savia de la vid que fluye desde la raíz hasta cada rama. Sin él, la rama se seca. 'Pide al Padre el Espíritu Santo' (Lucas 11:13) es la clave práctica." },
  { num:"04", title:"Dios dio el primer paso", body:"No somos nosotros quienes nos conectamos a Cristo. Él nos eligió primero (1 Juan 4:19). El pámpano no se injerta solo —el labrador lo hace. Nuestra parte es responder al amor que ya nos fue dado." },
  { num:"05", title:"Permanecer incluye guardar mandamientos", body:"Juan 15:10 y 1 Juan 2:3-6 muestran que permanecer no es solo sentimiento. Guardar los mandamientos es la evidencia de que la relación es real, no solo emocional." },
];

const QUIZ = [
  { q:"¿Cómo describe Jesús la condición espiritual del pueblo de Laodicea?", opts:["Fría pero recuperable","Tibio, sin frío ni calor","Caliente y apasionada","Fría y alejada de Dios"], ans:1, exp:"En Apocalipsis 3:15-16 Jesús dice: 'ni eres frío ni caliente'. La tibieza es la condición más peligrosa porque la persona ni siente su necesidad ni la urgencia de cambiar." },
  { q:"¿Qué cinco diagnósticos espirituales da Jesús al laodiceo en Apocalipsis 3:17?", opts:["Orgulloso, rebelde, impuro, mentiroso, incrédulo","Desdichado, miserable, pobre, ciego y desnudo","Tibio, distante, ocupado, distraído y olvidadizo","Rico, satisfecho, independiente, autosuficiente y orgulloso"], ans:1, exp:"Apocalipsis 3:17 lista exactamente estos cinco. Cristo contrasta esto con la autopercepción del laodiceo: 'Yo soy rico y de ninguna cosa tengo necesidad'." },
  { q:"¿Qué metáfora usa Jesús en Juan 15 para describir la relación que quiere con nosotros?", opts:["Un rey y su vasallo","Un maestro y su alumno","La vid y sus pámpanos","Un pastor y sus ovejas"], ans:2, exp:"En Juan 15:1-11 Jesús dice: 'Yo soy la vid, vosotros los pámpanos'. La clave es el 'permanecer', palabra que aparece 10 veces en ese pasaje." },
  { q:"¿Qué ofrece Jesús para remediar la condición del laodiceo en Apocalipsis 3:18?", opts:["Fuerza, sabiduría y valentía","Oro refinado, vestiduras blancas y colirio","Arrepentimiento, ayuno y oración","Estudio bíblico, evangelismo y ofrenda"], ans:1, exp:"Jesús ofrece tres remedios concretos: oro refinado en fuego (fe genuina), vestiduras blancas (justicia de Cristo) y colirio (discernimiento espiritual del Espíritu Santo)." },
  { q:"¿Por qué razón Jesús reprende a los laodiceos, según Apocalipsis 3:19?", opts:["Porque está enojado con ellos","Porque quiere que cambien de iglesia","Porque los ama y quiere que sean celosos y se arrepientan","Porque han pecado demasiado para ser perdonados"], ans:2, exp:"'Yo reprendo y castigo a todos los que amo' (Ap 3:19). La reprensión de Jesús no es rechazo sino la evidencia más clara de su amor." },
  { q:"¿Qué promete Jesús a quien abre la puerta en Apocalipsis 3:20?", opts:["Que lo sanará de sus enfermedades","Que le dará prosperidad material","Que entrará y cenará con él","Que lo protegerá de todo mal"], ans:2, exp:"'Entraré a él, y cenaré con él, y él conmigo' (Ap 3:20). Cenar juntos en la cultura del Medio Oriente era el símbolo de la amistad más íntima." },
  { q:"Según 1 Juan 4:19, ¿por qué somos capaces de amar a Dios?", opts:["Porque nacimos con amor en el corazón","Porque la iglesia nos enseñó a amarlo","Porque él nos amó primero","Porque entendemos su sacrificio"], ans:2, exp:"'Nosotros le amamos a él, porque él nos amó primero' (1 Jn 4:19). El amor hacia Dios no es nuestra iniciativa sino nuestra respuesta a su amor previo." },
  { q:"¿Cuál es la imagen de Génesis 5:24 que ilustra la relación cercana con Dios?", opts:["Adán trabajando en el jardín","Noé construyendo el arca","Enoc caminando con Dios hasta desaparecer","Abel ofreciendo su sacrificio"], ans:2, exp:"'Caminó, pues, Enoc con Dios, y desapareció, porque le llevó Dios' (Gn 5:24). Enoc representa el ideal: no una visita ocasional sino un caminar continuo con Dios." },
];

const REFLEXIONES = [
  { q:"¿Qué significa que tu condición espiritual no sea ni fría ni caliente? ¿Te identificás con alguno de los cinco diagnósticos de Laodicea?", ref:"Apocalipsis 3:14-16" },
  { q:"¿Qué cosas concretas en tu vida ahora mismo obstaculizan tu relación con Dios?", ref:"Reflexión personal" },
  { q:"¿Qué diferencia hay entre tener una relación tibia con Cristo y una de permanencia constante en él?", ref:"Juan 15:1-11" },
  { q:"¿Qué papel juega el Espíritu Santo a la hora de ayudarte a permanecer en Cristo?", ref:"Romanos 8:9-11; Lucas 11:13" },
  { q:"¿Cómo te ha mostrado Dios su amor de forma concreta en tu vida?", ref:"1 Juan 4:19; Jeremías 31:3-4" },
  { q:"¿Qué podría cambiar si como iglesia oráramos por el Espíritu Santo con más fervor y regularidad?", ref:"Lucas 11:13" },
];

// SVG rama decorativa
const Branch = ({ style }) => (
  <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className="hero-branch">
    <path d="M80 195 C80 195 78 145 60 112 C42 79 18 68 28 48 C38 28 70 38 80 58 C90 38 112 18 127 33 C142 48 122 74 101 94 C80 114 82 145 80 195Z" stroke="#4d9e5a" strokeWidth="1.5" fill="none"/>
    <path d="M80 155 C58 133 33 128 23 108" stroke="#4d9e5a" strokeWidth="1" fill="none"/>
    <path d="M80 122 C102 106 116 84 108 63" stroke="#4d9e5a" strokeWidth="1" fill="none"/>
    <path d="M74 100 C53 89 38 70 46 53" stroke="#4d9e5a" strokeWidth=".8" fill="none"/>
    <circle cx="28" cy="48" r="2.5" fill="#4d9e5a" opacity=".6"/>
    <circle cx="127" cy="33" r="2.5" fill="#4d9e5a" opacity=".6"/>
    <circle cx="23" cy="108" r="2" fill="#4d9e5a" opacity=".4"/>
  </svg>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("inicio");
  const [master, setMaster] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [secretFlash, setSecretFlash] = useState(false);
  const [openVerses, setOpenVerses] = useState({});
  const [openDiags, setOpenDiags] = useState({});
  const [openVids, setOpenVids] = useState({});
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [quizDone, setQuizDone] = useState(false);
  const scrollRef = useRef(null);
  const tapTimer = useRef(null);

  const changeTab = useCallback((t) => {
    setTab(t);
    setTimeout(() => scrollRef.current?.scrollTo({ top:0, behavior:"instant" }), 0);
  }, []);

  const handleTitleTap = useCallback(() => {
    const next = tapCount + 1;
    setTapCount(next);
    clearTimeout(tapTimer.current);
    if (next >= 5) {
      setMaster(m => !m);
      setSecretFlash(true);
      setTapCount(0);
      setTimeout(() => setSecretFlash(false), 1200);
    } else {
      tapTimer.current = setTimeout(() => setTapCount(0), 1800);
    }
  }, [tapCount]);

  const toggleVerse = r => setOpenVerses(p => ({ ...p, [r]: !p[r] }));
  const toggleDiag  = k => setOpenDiags(p => ({ ...p, [k]: !p[k] }));
  const toggleVid   = n => setOpenVids(p => ({ ...p, [n]: !p[n] }));

  const selectQuiz = i => {
    if (quizAnswered) return;
    setQuizSelected(i);
    setQuizAnswered(true);
    setQuizResults(r => [...r, i === QUIZ[quizIdx].ans]);
  };
  const nextQuiz = () => {
    if (quizIdx + 1 >= QUIZ.length) { setQuizDone(true); return; }
    setQuizIdx(i => i + 1); setQuizSelected(null); setQuizAnswered(false);
  };
  const retryQuiz = () => {
    setQuizIdx(0); setQuizSelected(null); setQuizAnswered(false); setQuizResults([]); setQuizDone(false);
  };

  const TABS = [
    { id:"inicio",      label:"Inicio",    Icon:Home },
    { id:"diagnostico", label:"Diagnóst.", Icon:Thermometer },
    { id:"vid",         label:"La Vid",    Icon:Leaf },
    { id:"biblia",      label:"Biblia",    Icon:BookOpen },
    { id:"quiz",        label:"Quiz",      Icon:HelpCircle },
    { id:"cierre",      label:"Cierre",    Icon:MessageCircle },
  ];

  const score = quizResults.filter(Boolean).length;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="scroll-area" ref={scrollRef}>

          {/* HERO */}
          <div className="hero">
            <div className="hero-glow" />
            <Branch style={{left:"-18px",bottom:"-8px",width:"175px",transform:"rotate(-18deg)"}} />
            <Branch style={{right:"-28px",top:"5px",width:"155px",transform:"rotate(22deg) scaleX(-1)"}} />
            <div className="hero-brand">
              <span className="hero-dot" />
              InVerso · Semana 1 · 2do Trim. 2026
            </div>
            <h1 className="hero-title" onClick={handleTitleTap}>
              Un chequeo a tu<br /><em>realidad espiritual</em>
            </h1>
            <div className="hero-ref">Apocalipsis 3:14-22</div>
            <div className="hero-line" />
          </div>

          {/* SECRET BAR */}
          <div className={`secret-bar${secretFlash ? " flash" : ""}`}>
            {master ? "— modo maestro activo —" : "· · ·"}
          </div>

          {/* CONTENT */}
          <div className="content">
            {tab==="inicio"      && <TabInicio master={master} />}
            {tab==="diagnostico" && <TabDiagnostico master={master} openDiags={openDiags} toggleDiag={toggleDiag} />}
            {tab==="vid"         && <TabVid openVids={openVids} toggleVid={toggleVid} />}
            {tab==="biblia"      && <TabBiblia openVerses={openVerses} toggleVerse={toggleVerse} />}
            {tab==="quiz"        && <TabQuiz quizIdx={quizIdx} quizSelected={quizSelected} quizAnswered={quizAnswered} quizResults={quizResults} quizDone={quizDone} score={score} selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz} />}
            {tab==="cierre"      && <TabCierre />}
          </div>
        </div>

        {/* NAV */}
        <nav className="nav">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={tab===id ? "on" : ""} onClick={() => changeTab(id)}>
              <Icon />{label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

function TabInicio({ master }) {
  return (
    <>
      <div className="sec-title">Bienvenida</div>
      <div className="sec-sub">Esta semana: un diagnóstico honesto de tu relación con Dios y cómo permanecer en él.</div>
      {master ? (
        <>
          <div className="guide-banner">
            <div className="guide-badge">Maestro</div>
            <p>Guía de clase · 30 minutos · Modo maestro activo</p>
          </div>
          {[
            { t:"0–3 min",   title:"Bienvenida",         desc:'Recibí a los jóvenes. Pregunta introductoria: "¿Cómo describirías tu relación con Dios esta semana —caliente, tibia o fría?"' },
            { t:"3–5 min",   title:"Pedidos y oración",  desc:"Tomá pedidos brevemente. Pedí que alguien ore. Enfocate en pedir claridad espiritual y apertura a la reprensión de Cristo." },
            { t:"5–12 min",  title:"Tab: Diagnóstico",   desc:"Presentá los 5 diagnósticos de Laodicea. Invitá a los alumnos a identificar cuál les habla más. En modo maestro ves el contexto histórico completo." },
            { t:"12–18 min", title:"Tab: La Vid",        desc:"Leé Juan 15:1-11 en voz alta. Preguntá: ¿Qué diferencia hay entre visitar a Jesús y permanecer en él? Usá los 5 puntos expandibles." },
            { t:"18–27 min", title:"Tab: Quiz",          desc:"Quiz grupal. Que los jóvenes participen desde sus celulares. Aprovechá los momentos de error para profundizar con las explicaciones." },
            { t:"27–30 min", title:"Reflexión y cierre", desc:"Tab Cierre: Elegí 2-3 preguntas para el grupo. Terminá con el texto 'Para tu vida'. Cerrar en oración." },
          ].map((s,i) => (
            <div className="guide-step" key={i}>
              <div className="guide-time">{s.t}</div>
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
            <div className="card-label">Esta semana</div>
            <p>Jesús tiene un mensaje directo para su pueblo de los últimos días. En Apocalipsis 3:14-22, da un diagnóstico honesto y hace una invitación sorprendente.</p>
          </div>
          <div className="card">
            <div className="card-label">Texto base</div>
            <p style={{fontFamily:"'Lora',serif",fontStyle:"italic",color:"var(--tx)",lineHeight:"1.65"}}>"Yo estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré a él, y cenaré con él, y él conmigo."</p>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",color:"var(--tx3)",marginTop:".5rem"}}>Apocalipsis 3:20</div>
          </div>
          <div className="card">
            <div className="card-label">Explorar esta semana</div>
            <p><strong style={{color:"var(--tx)"}}>Diagnóstico</strong> — Los 5 problemas que Jesús ve en nosotros<br /><strong style={{color:"var(--tx)"}}>La Vid</strong> — Qué significa realmente permanecer<br /><strong style={{color:"var(--tx)"}}>Biblia</strong> — Todos los versículos de la semana<br /><strong style={{color:"var(--tx)"}}>Quiz</strong> — Probá lo que aprendiste</p>
          </div>
        </>
      )}
    </>
  );
}

function TabDiagnostico({ master, openDiags, toggleDiag }) {
  return (
    <>
      <div className="sec-title">Diagnóstico</div>
      <div className="sec-sub">Cristo conoce nuestra condición mejor que nosotros mismos. Ap 3:17 lista cinco problemas —no para condenar, sino para sanar.</div>
      {!master && <div className="card" style={{marginBottom:"1rem"}}><div className="card-label">¿Cuál te describe?</div><p>Tocá cada carta para ver si ese diagnóstico habla a tu situación.</p></div>}
      <div className="diag-grid">
        {DIAGS.map(d => (
          <div key={d.key} className={`diag-card ${d.key}${openDiags[d.key] ? " open" : ""}`} onClick={() => toggleDiag(d.key)}>
            <div className="diag-header">
              <span className="diag-label">{d.label}</span>
              <span className="diag-name">{d.name}</span>
              {openDiags[d.key] ? <ChevronUp size={16} color="var(--tx3)" /> : <ChevronDown size={16} color="var(--tx3)" />}
            </div>
            {openDiags[d.key] && (
              <div className="diag-body">
                <p style={{fontSize:".97rem",lineHeight:"1.55",color:"var(--tx2)",marginBottom:".5rem"}}>{master ? d.teacher : d.student}</p>
                <div className="diag-remedy"><Star size={13} color="var(--acc2)" style={{flexShrink:0,marginTop:"2px"}} /><span>{d.remedy}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="card"><div className="card-label">La respuesta de Cristo</div><p>Frente a cada diagnóstico, Jesús tiene un remedio concreto. Su reprensión termina con una invitación: "Cenaré con él" (Ap 3:20).</p></div>
    </>
  );
}

function TabVid({ openVids, toggleVid }) {
  return (
    <>
      <div className="sec-title">La Vid</div>
      <div className="sec-sub">Juan 15:1-11. "Permanecer" aparece 10 veces. No es una metáfora decorativa —es la clave de toda la vida cristiana.</div>
      <div className="vid-items">
        {VID_ITEMS.map(v => (
          <div key={v.num} className={`vid-item${openVids[v.num] ? " open" : ""}`} onClick={() => toggleVid(v.num)}>
            <div className="vid-header">
              <span className="vid-num">{v.num}</span>
              <span className="vid-title">{v.title}</span>
              {openVids[v.num] ? <ChevronUp size={16} color="var(--tx3)" style={{flexShrink:0}} /> : <ChevronDown size={16} color="var(--tx3)" style={{flexShrink:0}} />}
            </div>
            {openVids[v.num] && <div className="vid-body">{v.body}</div>}
          </div>
        ))}
      </div>
      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El Deseado de todas las gentes, cap. 73, pp. 644-645</div>
        <div className="egw-text">"El pámpano está injertado en la vid viviente, y fibra tras fibra, vena tras vena, va creciendo en el tronco. La vida de la vid llega a ser la vida del pámpano… <strong>Esta unión con Cristo, una vez formada, debe ser mantenida.</strong> Este no es un contacto casual, ninguna unión que se realiza y se corta luego. El sarmiento llega a ser parte de la vid viviente… <strong>Sin mí, no podéis vencer un solo pecado, ni resistir una sola tentación.</strong>"</div>
      </div>
    </>
  );
}

function TabBiblia({ openVerses, toggleVerse }) {
  return (
    <>
      <div className="sec-title">Biblia</div>
      <div className="sec-sub">Todos los versículos · RVR1960 · Tocá para expandir</div>
      {VERSES.map(v => (
        <div key={v.ref} className={`verse-item${v.base ? " base" : ""}`} onClick={() => toggleVerse(v.ref)}>
          <div className="verse-header">
            <span className="verse-ref">{v.ref}</span>
            <div className="verse-tags">
              {v.base && <span className="verse-tag base-tag"><Star size={9} style={{display:"inline",marginRight:"2px"}} />Texto base</span>}
              {openVerses[v.ref] ? <ChevronUp size={16} color="var(--tx3)" /> : <ChevronDown size={16} color="var(--tx3)" />}
            </div>
          </div>
          {openVerses[v.ref] && <div className="verse-body">{v.text}</div>}
        </div>
      ))}
    </>
  );
}

function TabQuiz({ quizIdx, quizSelected, quizAnswered, quizResults, quizDone, score, selectQuiz, nextQuiz, retryQuiz }) {
  if (quizDone) {
    const pct = Math.round((score / QUIZ.length) * 100);
    const msgs = ["Seguí repasando el material —cada lección refuerza tu fe.","Buen intento. Releé los versículos y volvé a intentarlo.","¡Bien hecho! Conocés los conceptos principales de esta lección.","¡Excelente! Tenés un dominio sólido de esta semana."];
    return (
      <div className="quiz-results">
        <div style={{marginBottom:"1rem"}}><div className="quiz-score">{score}/{QUIZ.length}</div><div className="quiz-pct">{pct}% correcto</div></div>
        <div className="quiz-progress" style={{marginBottom:"1.5rem"}}>{quizResults.map((r,i) => <div key={i} className={`quiz-dot ${r?"correct":"wrong"}`} />)}</div>
        <div className="quiz-msg">{msgs[pct<40?0:pct<60?1:pct<90?2:3]}</div>
        <button className="quiz-retry" onClick={retryQuiz}><RotateCcw size={16} />Intentar de nuevo</button>
      </div>
    );
  }
  const q = QUIZ[quizIdx];
  return (
    <>
      <div className="sec-title">Quiz</div>
      <div className="sec-sub" style={{marginBottom:".85rem"}}>Pregunta {quizIdx+1} de {QUIZ.length}</div>
      <div className="quiz-progress">{QUIZ.map((_,i) => <div key={i} className={`quiz-dot ${i<quizIdx?(quizResults[i]?"correct":"wrong"):i===quizIdx?"active":""}`} />)}</div>
      <div className="quiz-q">{q.q}</div>
      {q.opts.map((opt,i) => {
        let cls = "quiz-option";
        if (quizAnswered) { if (i===q.ans) cls+=" correct"; else if (i===quizSelected) cls+=" wrong"; }
        return <button key={i} className={cls} onClick={() => selectQuiz(i)} disabled={quizAnswered}>{opt}</button>;
      })}
      {quizAnswered && (
        <>
          <div className="quiz-feedback">
            {quizSelected===q.ans
              ? <><CheckCircle size={14} color="var(--ok)" style={{display:"inline",marginRight:"5px"}} /><strong>¡Correcto!</strong> {q.exp}</>
              : <><XCircle size={14} color="var(--err)" style={{display:"inline",marginRight:"5px"}} /><strong>No exactamente.</strong> {q.exp}</>}
          </div>
          <button className="quiz-next" onClick={nextQuiz}>{quizIdx+1<QUIZ.length?"Siguiente →":"Ver resultados"}</button>
        </>
      )}
    </>
  );
}

function TabCierre() {
  return (
    <>
      <div className="sec-title">Cierre</div>
      <div className="sec-sub">Preguntas para el grupo · Reflexión personal</div>
      {REFLEXIONES.map((r,i) => (
        <div className="reflex-card" key={i}>
          <div className="reflex-num">{i+1}</div>
          <div className="reflex-body"><div className="reflex-q">{r.q}</div><div className="reflex-ref">{r.ref}</div></div>
        </div>
      ))}
      <div className="vida-card">
        <div className="vida-label"><Flame size={13} />Para tu vida</div>
        <div className="vida-text">En el medio de las clases, los trabajos, las redes sociales y el scroll infinito, <strong>Jesús sigue tocando a tu puerta</strong>. No de forma agresiva, no interrumpe ni se impone. Solo llama.<br /><br />La pregunta de esta semana no es si sos "buen cristiano" o si vas a la iglesia. Es más directa: <strong>¿estás realmente conectado a él, o solo estás cerca?</strong><br /><br />Esta semana, elegí un momento específico —en el bondi, antes de dormir, entre clases— y abrile esa puerta. No necesita ser una hora de oración formal. Solo decile que querés que entre. <strong>Él cumple lo que prometió.</strong></div>
      </div>
    </>
  );
}
