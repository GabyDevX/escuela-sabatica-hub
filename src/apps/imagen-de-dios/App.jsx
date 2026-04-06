import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Home, HelpCircle,
  MessageCircle, Flame, Shield, Heart, Eye, RotateCcw,
  CheckCircle, XCircle
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg:#07080f; --bg2:#0b0c1a; --bg3:#10111f;
  --surf:#141628; --surf2:#1a1c35;
  --brd:#202340; --brd2:#2c2f58;
  --tx:#f2f2fc; --tx2:#c8c8e8; --tx3:#8888aa;
  --acc:#c9a84c; --acc2:#e0c070; --acc3:#f5e4b8;
  --ok:#10b981; --ok-d:rgba(16,185,129,.10);
  --err:#f43f5e; --err-d:rgba(244,63,94,.10);
  --warn:#e0c070; --warn-d:rgba(224,192,112,.10);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}

/* HERO */
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#0b0d22 0%,#080a18 55%,#06070f 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(201,168,76,.18) 0%,transparent 70%);pointer-events:none}
.hero-deco{position:absolute;pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;line-height:1.18;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(201,168,76,.2);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(201,168,76,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.3) 30%,rgba(201,168,76,.3) 70%,transparent)}

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
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(201,168,76,.08);border-radius:10px;z-index:-1}

/* CONTENT */
.content{padding:1.25rem 1rem 2rem;animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.sec-title{font-family:'Playfair Display',serif;font-size:1.65rem;font-weight:700;color:var(--tx);margin-bottom:.25rem;line-height:1.2}
.sec-sub{font-size:.95rem;color:var(--tx2);margin-bottom:1.25rem;line-height:1.55}

/* CARD */
.card{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1.1rem 1rem;margin-bottom:.85rem}
.card p{font-size:1rem;line-height:1.65;color:var(--tx2)}
.card-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc);margin-bottom:.5rem}

/* VERSE */
.verse-item{border-left:3px solid var(--acc);border-radius:0 12px 12px 0;background:var(--surf);margin-bottom:.7rem;overflow:hidden;cursor:pointer;transition:background .2s}
.verse-item:hover{background:var(--surf2)}
.verse-item.base-v{border-left:4px solid var(--warn)}
.verse-header{display:flex;align-items:center;justify-content:space-between;padding:.8rem 1rem}
.verse-ref{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;color:var(--tx)}
.verse-tags{display:flex;gap:.4rem;align-items:center}
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(201,168,76,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(224,192,112,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}

/* EXPANDABLE ITEMS */
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(201,168,76,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(201,168,76,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.55;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}

/* EGW */
.egw-wrap{background:linear-gradient(135deg,rgba(201,168,76,.07),rgba(201,168,76,.02));border:1px solid rgba(201,168,76,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(201,168,76,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}

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
.quiz-next{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#07080f;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;margin-top:.8rem;transition:background .2s}
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
.reflex-ref{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc);margin-top:.35rem}
.vida-card{background:linear-gradient(135deg,rgba(201,168,76,.10),rgba(201,168,76,.02));border:1.5px solid rgba(201,168,76,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}

/* GUIDE */
.guide-banner{background:linear-gradient(135deg,rgba(224,192,112,.10),rgba(224,192,112,.02));border:1px solid rgba(224,192,112,.22);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(224,192,112,.12);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
.guide-banner p{font-size:.9rem;color:var(--tx2);line-height:1.45}
.guide-step{display:flex;gap:.9rem;margin-bottom:.8rem;padding:.9rem 1rem;background:var(--surf);border-radius:12px;border:1px solid var(--brd)}
.guide-time{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--warn);white-space:nowrap;padding-top:.1rem;min-width:58px}
.guide-step-body{flex:1}
.guide-step-title{font-size:.97rem;font-weight:600;color:var(--tx);margin-bottom:.3rem}
.guide-step-desc{font-size:.92rem;line-height:1.55;color:var(--tx2)}

/* COR13 EXERCISE */
.cor13-item{border-left:3px solid var(--brd2);border-radius:0 10px 10px 0;background:var(--surf);margin-bottom:.55rem;overflow:hidden;cursor:pointer;transition:all .2s}
.cor13-item.open{border-left-color:var(--acc);background:rgba(201,168,76,.04)}
.cor13-header{display:flex;align-items:center;justify-content:space-between;padding:.7rem .9rem}
.cor13-attr{font-size:1rem;font-weight:600;color:var(--tx);font-family:'DM Sans',sans-serif}
.cor13-body{padding:.2rem .9rem .8rem;border-top:1px solid var(--brd)}
.cor13-orig{font-size:.88rem;color:var(--tx3);font-style:italic;margin-bottom:.4rem;line-height:1.5}
.cor13-dios{font-size:.97rem;color:var(--acc3);line-height:1.55}

/* NOMBRES */
.nombre-card{background:linear-gradient(135deg,var(--surf),var(--surf2));border:1px solid var(--brd);border-radius:14px;padding:.9rem 1rem;margin-bottom:.6rem;display:flex;gap:.8rem;align-items:flex-start}
.nombre-heb{font-family:'IBM Plex Mono',monospace;font-size:.68rem;color:var(--acc);letter-spacing:.06em;flex-shrink:0;padding-top:.15rem}
.nombre-body{}
.nombre-title{font-size:1rem;font-weight:600;color:var(--tx);margin-bottom:.2rem}
.nombre-desc{font-size:.9rem;color:var(--tx2);line-height:1.5}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const VERSES = [
  { ref:"Juan 17 (completo)", base:true, text:`1 Estas cosas habló Jesús, y levantando los ojos al cielo, dijo: Padre, la hora ha llegado; glorifica a tu Hijo, para que también tu Hijo te glorifique a ti; 2 como le has dado potestad sobre toda carne, para que dé vida eterna a todos los que le diste. 3 Y esta es la vida eterna: que te conozcan a ti, el único Dios verdadero, y a Jesucristo, a quien has enviado. 4 Yo te he glorificado en la tierra; he acabado la obra que me diste que hiciese. 5 Ahora pues, Padre, glorifícame tú al lado tuyo, con aquella gloria que tuve contigo antes que el mundo fuese. 6 He manifestado tu nombre a los hombres que del mundo me diste; tuyos eran, y me los diste, y han guardado tu palabra. 7 Ahora han conocido que todas las cosas que me has dado, proceden de ti; 8 porque las palabras que me diste, les he dado; y ellos las recibieron, y han conocido verdaderamente que salí de ti, y han creído que tú me enviaste. 9 Yo ruego por ellos; no ruego por el mundo, sino por los que me diste; porque tuyos son, 10 y todo lo mío es tuyo, y lo tuyo mío; y he sido glorificado en ellos. 11 Y ya no estoy en el mundo; mas éstos están en el mundo, y yo voy a ti. Padre santo, a los que me has dado, guárdalos en tu nombre, para que sean uno, así como nosotros. 12 Cuando estaba con ellos en el mundo, yo los guardaba en tu nombre; a los que me diste, yo los guardé, y ninguno de ellos se perdió, sino el hijo de perdición, para que la Escritura se cumpliese. 13 Pero ahora voy a ti; y hablo esto en el mundo, para que tengan mi gozo cumplido en sí mismos. 14 Yo les he dado tu palabra; y el mundo los aborreció, porque no son del mundo, como tampoco yo soy del mundo. 15 No ruego que los quites del mundo, sino que los guardes del mal. 16 No son del mundo, como tampoco yo soy del mundo. 17 Santifícalos en tu verdad; tu palabra es verdad. 18 Como tú me enviaste al mundo, también yo los he enviado al mundo. 19 Y por ellos yo me santifico a mí mismo, para que también ellos sean santificados en la verdad. 20 Mas no ruego solamente por éstos, sino también por los que han de creer en mí por la palabra de ellos, 21 para que todos sean uno; como tú, oh Padre, en mí, y yo en ti, que también ellos sean uno en nosotros; para que el mundo crea que tú me enviaste. 22 La gloria que me diste, yo les he dado, para que sean uno, así como nosotros somos uno. 23 Yo en ellos, y tú en mí, para que sean perfectos en unidad, para que el mundo conozca que tú me enviaste, y que los has amado a ellos como también a mí me has amado. 24 Padre, aquellos que me has dado, quiero que donde yo estoy, también ellos estén conmigo, para que vean mi gloria que me has dado; porque me has amado desde antes de la fundación del mundo. 25 Padre justo, el mundo no te ha conocido, pero yo te he conocido, y éstos han conocido que tú me enviaste. 26 Y les he dado a conocer tu nombre, y lo daré a conocer aún, para que el amor con que me has amado, esté en ellos, y yo en ellos.` },
  { ref:"Juan 17:11", text:`Y ya no estoy en el mundo; mas éstos están en el mundo, y yo voy a ti. Padre santo, a los que me has dado, guárdalos en tu nombre, para que sean uno, así como nosotros.` },
  { ref:"Juan 17:25-26", text:`25 Padre justo, el mundo no te ha conocido, pero yo te he conocido, y éstos han conocido que tú me enviaste. 26 Y les he dado a conocer tu nombre, y lo daré a conocer aún, para que el amor con que me has amado, esté en ellos, y yo en ellos.` },
  { ref:"Jeremías 32:17", text:`¡Oh Señor Jehová! he aquí que tú hiciste el cielo y la tierra con tu gran poder, y con tu brazo extendido, ni hay nada que sea difícil para ti;` },
  { ref:"Isaías 46:9-10", text:`9 Acordaos de las cosas pasadas desde los tiempos antiguos; porque yo soy Dios, y no hay otro Dios, y nada hay semejante a mí, 10 que anuncio lo por venir desde el principio, y desde la antigüedad lo que aún no era hecho; que digo: Mi consejo permanecerá, y haré todo lo que quiero;` },
  { ref:"Salmo 145:17", text:`Justo es Jehová en todos sus caminos, y misericordioso en todas sus obras.` },
  { ref:"Deuteronomio 7:9", text:`Conoce, pues, que Jehová tu Dios es Dios, Dios fiel, que guarda el pacto y la misericordia a los que le aman y guardan sus mandamientos, hasta mil generaciones;` },
  { ref:"Romanos 2:4", text:`¿O menosprecias las riquezas de su benignidad, paciencia y longanimidad, ignorando que su benignidad te guía al arrepentimiento?` },
  { ref:"Romanos 11:33", text:`¡Oh profundidad de las riquezas de la sabiduría y de la ciencia de Dios! ¡Cuán insondables son sus juicios, e inescrutables sus caminos!` },
  { ref:"2 Corintios 12:9", text:`Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad. Por tanto, de buena gana me gloriaré más bien en mis debilidades, para que repose sobre mí el poder de Cristo.` },
  { ref:"Efesios 1:7", text:`en quien tenemos redención por su sangre, el perdón de pecados según las riquezas de su gracia,` },
  { ref:"Jeremías 29:11", text:`Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.` },
  { ref:"Juan 11:25", text:`Le dijo Jesús: Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.` },
  { ref:"Salmo 47:8", text:`Reinó Dios sobre las naciones; se sentó Dios sobre su santo trono.` },
  { ref:"Deuteronomio 33:27", text:`El eterno Dios es tu refugio, y acá abajo los brazos eternos; Él echó de delante de ti al enemigo, y dijo: Destruye.` },
  { ref:"Génesis 3:1-5", text:`1 Pero la serpiente era astuta, más que todos los animales del campo que Jehová Dios había hecho; la cual dijo a la mujer: ¿Conque Dios os ha dicho: No comáis de todo árbol del huerto? 2 Y la mujer respondió a la serpiente: Del fruto de los árboles del huerto podemos comer; 3 pero del fruto del árbol que está en medio del huerto dijo Dios: No comeréis de él, ni le tocaréis, para que no muráis. 4 Entonces la serpiente dijo a la mujer: No moriréis; 5 sino que sabe Dios que el día que comáis de él, serán abiertos vuestros ojos, y seréis como Dios, sabiendo el bien y el mal.` },
  { ref:"Santiago 1:17", text:`Toda buena dádiva y todo don perfecto desciende de lo alto, del Padre de las luces, en el cual no hay mudanza, ni sombra de variación.` },
  { ref:"1 Juan 1:5", text:`Este es el mensaje que hemos oído de él, y os anunciamos: Dios es luz, y no hay ningunas tinieblas en él.` },
  { ref:"Apocalipsis 4:8", text:`Y los cuatro seres vivientes tenían cada uno seis alas, y alrededor y por dentro estaban llenos de ojos; y no cesaban día y noche de decir: Santo, santo, santo es el Señor Dios Todopoderoso, el que era, el que es, y el que ha de venir.` },
  { ref:"1 Samuel 2:2", text:`No hay santo como Jehová; porque no hay ninguno fuera de ti, y no hay refugio como el Dios nuestro.` },
  { ref:"Isaías 57:15", text:`Porque así dijo el Alto y Sublime, el que habita la eternidad, y cuyo nombre es el Santo: Yo habito en la altura y la santidad, y también con el quebrantado y humilde de espíritu, para hacer vivir el espíritu de los humildes, y para vivificar el corazón de los quebrantados.` },
  { ref:"Levítico 20:26", text:`Habéis, pues, de serme santos, porque yo Jehová soy santo, y os he apartado de los pueblos para que seáis míos.` },
  { ref:"Romanos 6:22", text:`Mas ahora que habéis sido libertados del pecado y hechos siervos de Dios, tenéis por vuestro fruto la santificación, y como fin, la vida eterna.` },
  { ref:"Hebreos 12:14", text:`Seguid la paz con todos, y la santidad, sin la cual nadie verá al Señor.` },
  { ref:"1 Pedro 1:13-16", text:`13 Por tanto, ceñid los lomos de vuestro entendimiento, sed sobrios, y esperad por completo en la gracia que se os traerá cuando Jesucristo sea manifestado; 14 como hijos obedientes, no os conforméis a los deseos que antes teníais estando en vuestra ignorancia; 15 sino, como aquel que os llamó es santo, sed también vosotros santos en toda vuestra manera de vivir; 16 porque escrito está: Sed santos, porque yo soy santo.` },
  { ref:"1 Juan 4:8", text:`El que no ama, no ha conocido a Dios; porque Dios es amor.` },

  { ref:"1 Juan 4:16", text:`Y nosotros hemos conocido y creído el amor que Dios tiene para con nosotros. Dios es amor; y el que permanece en amor, permanece en Dios, y Dios en él.` },
  { ref:"Génesis 1:27", text:`Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó.` },
  { ref:"Génesis 15:2", text:`Y respondió Abram: Señor Jehová, ¿qué me darás, siendo así que ando sin hijo, y el mayordomo de mi casa es este Damasceno Eliezer?` },
  { ref:"Jueces 6:15", text:`Y él le respondió: Ah, señor mío, ¿con qué salvaré yo a Israel? He aquí que mi familia es pobre en Manasés, y yo el menor en la casa de mi padre.` },
  { ref:"Malaquías 1:6", text:`El hijo honra al padre, y el siervo a su señor. Si, pues, soy yo padre, ¿dónde está mi honra? y si soy señor, ¿dónde está mi temor? dice Jehová de los ejércitos a vosotros, oh sacerdotes, que menospreciáis mi nombre.` },
  { ref:"Salmo 97:5", text:`Los montes se derritieron como cera delante de Jehová, delante del Señor de toda la tierra.` },
  { ref:"Génesis 22:13-14", text:`13 Entonces alzó Abraham sus ojos y miró, y he aquí detrás un carnero trabado en un zarzal por sus cuernos; y fue Abraham y tomó el carnero, y lo ofreció en holocausto en lugar de su hijo. 14 Y llamó Abraham el nombre de aquel lugar, Jehová proveerá. Por tanto se dice hoy: En el monte de Jehová será provisto.` },
  { ref:"Juan 3:16", text:`Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.` },
  { ref:"Romanos 5:8", text:`Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros.` },
  { ref:"Isaías 59:1-2", text:`1 He aquí que no se ha acortado la mano de Jehová para salvar, ni se ha agravado su oído para oír; 2 pero vuestras iniquidades han hecho división entre vosotros y vuestro Dios, y vuestros pecados han hecho ocultar de vosotros su rostro para no oír.` },
  { ref:"Juan 13:34-35", text:`34 Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado, que también os améis unos a otros. 35 En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros.` },
  { ref:"Juan 15:9-13", text:`9 Como el Padre me ha amado, así también yo os he amado; permaneced en mi amor. 10 Si guardareis mis mandamientos, permaneceréis en mi amor; así como yo he guardado los mandamientos de mi Padre, y permanezco en su amor. 11 Estas cosas os he hablado, para que mi gozo esté en vosotros, y vuestro gozo sea cumplido. 12 Este es mi mandamiento: Que os améis unos a otros, como yo os he amado. 13 Nadie tiene mayor amor que este, que uno ponga su vida por sus amigos.` },
  { ref:"1 Juan 4:7-11", text:`7 Amados, amémonos unos a otros; porque el amor es de Dios. Todo aquel que ama, es nacido de Dios, y conoce a Dios. 8 El que no ama, no ha conocido a Dios; porque Dios es amor. 9 En esto se mostró el amor de Dios para con nosotros, en que Dios envió a su Hijo unigénito al mundo, para que vivamos por él. 10 En esto consiste el amor: no en que nosotros hayamos amado a Dios, sino en que él nos amó a nosotros, y envió a su Hijo en propiciación por nuestros pecados. 11 Amados, si Dios nos ha amado así, debemos también nosotros amarnos unos a otros.` },
  { ref:"1 Corintios 13:4-8", text:`4 El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece; 5 no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor; 6 no se goza de la injusticia, mas se goza de la verdad; 7 todo lo sufre, todo lo cree, todo lo espera, todo lo soporta. 8 El amor nunca deja de ser; pero las profecías se acabarán, y cesarán las lenguas, y la ciencia acabará.` },
  { ref:"Juan 14:9", text:`Jesús le dijo: ¿Tanto tiempo hace que estoy con vosotros, y no me has conocido, Felipe? El que me ha visto a mí, ha visto al Padre; ¿cómo, pues, dices tú: Muéstranos el Padre?` },
  { ref:"Hebreos 1:3", text:`el cual, siendo el resplandor de su gloria, y la imagen misma de su sustancia, y quien sustenta todas las cosas con la palabra de su poder, habiendo efectuado la purificación de nuestros pecados por medio de sí mismo, se sentó a la diestra de la Majestad en las alturas,` },
  { ref:"Juan 12:32", text:`Y yo, si fuere levantado de la tierra, a todos atraeré a mí mismo.` },
  { ref:"Lucas 1:3-4", text:`3 me ha parecido también a mí, después de haber investigado con diligencia todas las cosas desde el principio, escribírtelas por orden, oh excelentísimo Teófilo, 4 para que conozcas bien la verdad de las cosas en las cuales has sido instruido.` },
  { ref:"Mateo 1:23", text:`He aquí, una virgen concebirá y dará a luz un hijo, y llamarás su nombre Emanuel, que traducido es: Dios con nosotros.` },
  { ref:"Mateo 28:20", text:`enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.` },
  { ref:"Juan 14:3", text:`Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo, para que donde yo estoy, vosotros también estéis.` },
  { ref:"Salmo 23", text:`1 Jehová es mi pastor; nada me faltará. 2 En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará. 3 Confortará mi alma; me guiará por sendas de justicia por amor de su nombre. 4 Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento. 5 Aderezas mesa delante de mí en presencia de mis angustiadores; unges mi cabeza con aceite; mi copa está rebosando. 6 Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días.` },
];

const PERSONAJES = [
  { badge:"Moisés", ref:"Éxodo 3:5-6", reaccion:"Se quitó el calzado y ocultó su rostro, porque tuvo miedo de mirar a Dios.", leccion:"Ante la santidad de Dios, lo primero que reconocemos es que estamos en terreno sagrado. La respuesta de Moisés no fue orgullo sino reverencia." },
  { badge:"Isaías", ref:"Isaías 6:1-5", reaccion:"Exclamó: «¡Ay de mí! que soy muerto; porque siendo hombre inmundo, he visto al Rey, Jehová de los ejércitos.»", leccion:"La santidad de Dios revela nuestra propia condición. No para condenarnos, sino para mostrarnos quiénes somos y quién puede hacernos limpios." },
  { badge:"Ezequiel", ref:"Ezequiel 1:28", reaccion:"Cuando vio la semejanza de la gloria de Jehová, cayó sobre su rostro y oyó la voz de uno que hablaba.", leccion:"Ningún ser humano puede soportar la plenitud de la gloria de Dios de pie. La postura natural ante lo sagrado es la humildad total." },
  { badge:"Daniel", ref:"Daniel 10:8", reaccion:"«No quedó fuerza en mí, y mi vigor se cambió en desfallecimiento, y no retuve fuerza alguna.»", leccion:"La presencia de lo santo agota nuestra autosuficiencia. Daniel, uno de los hombres más íntegros de la Biblia, quedó sin fuerzas ante la gloria celestial." },
  { badge:"Juan", ref:"Apocalipsis 1:17", reaccion:"Cuando lo vio, cayó como muerto a sus pies. Y Jesús le puso su diestra encima diciendo: «No temas».", leccion:"Aun el discípulo amado cayó como muerto. La santidad de Dios inspira reverencia, pero su respuesta inmediata es siempre: «No temas.»" },
];

const EVANGELIOS = [
  { num:"Mt", nombre:"Mateo", para:"Judíos de su tiempo", angulo:"Jesús como el Mesías prometido", rasgos:"Cita el AT más de 60 veces. Muestra a Jesús cumpliendo las promesas. El Rey de Israel que esperaban.", verso:"«No penséis que he venido para abrogar la ley o los profetas; no he venido para abrogar, sino para cumplir.» (5:17)" },
  { num:"Mc", nombre:"Marcos", para:"Audiencia greco-romana diversa", angulo:"Jesús el Siervo activo", rasgos:"Usa la palabra «luego» 40 veces. Jesús siempre en movimiento, sanando, respondiendo, sirviendo sin descanso.", verso:"«Porque el Hijo del Hombre no vino para ser servido, sino para servir, y para dar su vida en rescate por muchos.» (10:45)" },
  { num:"Lc", nombre:"Lucas", para:"Creyentes en Cristo, especialmente gentiles", angulo:"La humanidad perfecta de Jesús", rasgos:"Escrito por un médico. Énfasis en la compasión por mujeres, pobres y marginados. Jesús llora, ora, siente.", verso:"«El Espíritu del Señor está sobre mí, por cuanto me ha ungido para dar buenas nuevas a los pobres.» (4:18)" },
  { num:"Jn", nombre:"Juan", para:"Todos, para creer", angulo:"La divinidad de Cristo", rasgos:"Siete señales, siete «Yo soy». Escrito para que crean. Juan 3:16 como corazón del evangelio eterno.", verso:"«Estas se han escrito para que creáis que Jesús es el Cristo, el Hijo de Dios, y para que creyendo, tengáis vida en su nombre.» (20:31)" },
];

const COR13 = [
  { attr:"Es sufrido (paciente)", orig:"El amor es sufrido", dios:"Dios es sufrido — espera con paciencia infinita que volvamos a él, sin cansarse nunca de nosotros." },
  { attr:"Es benigno (amable)", orig:"es benigno", dios:"Dios es benigno — su bondad activa está presente en cada amanecer, en cada gracia que no merecimos." },
  { attr:"No tiene envidia", orig:"el amor no tiene envidia", dios:"Dios no tiene envidia — su amor no compite; nos regocija cuando crecemos, cuando prosperamos, cuando somos amados por otros." },
  { attr:"No se envanece", orig:"no es jactancioso, no se envanece", dios:"Dios no se envanece — el Creador del universo no necesita impresionarnos. Su grandeza se revela en la humildad con que se acercó a nosotros." },
  { attr:"No busca lo suyo", orig:"no busca lo suyo", dios:"Dios no busca lo suyo — todo lo que hizo —la creación, la salvación— fue por nosotros, no para su beneficio." },
  { attr:"No guarda rencor", orig:"no guarda rencor", dios:"Dios no guarda rencor — «cuanto está lejos el oriente del occidente, hizo alejar de nosotros nuestras rebeliones» (Salmo 103:12)." },
  { attr:"Se goza en la verdad", orig:"se goza de la verdad", dios:"Dios se goza en la verdad — porque él es la verdad misma. Y la verdad, aunque duela, siempre libera." },
  { attr:"Todo lo soporta", orig:"todo lo sufre, todo lo cree, todo lo espera, todo lo soporta", dios:"Dios todo lo soporta — su amor no se rinde ante nuestra terquedad, nuestras dudas ni nuestra distancia." },
  { attr:"Nunca deja de ser", orig:"El amor nunca deja de ser", dios:"Dios nunca deja de ser — su amor no tiene fecha de vencimiento. Es el mismo ayer, hoy y por los siglos." },
];

const NOMBRES_DIOS = [
  { heb:"ADONAI", esp:"Señor de todos los que reinan", refs:"Génesis 15:2 · Jueces 6:15 · Malaquías 1:6 · Salmo 97:5", desc:"Adonai subraya la soberanía y el señorío de Dios. Cuando Abram llamó «Adonai» a Dios, reconoció que no hay autoridad por encima de él." },
  { heb:"JEHOVÁ-JIREH", esp:"El Señor proveerá", refs:"Génesis 22:13-14", desc:"Abraham puso este nombre al lugar donde Dios proveyó el carnero. No solo significa que Dios provee recursos, sino que ya vio lo que necesitamos antes de pedirlo." },
  { heb:"HESED", esp:"Amor de pacto", refs:"Deuteronomio 7:9 · Lamentaciones 3:22-23", desc:"La palabra más rica en hebreo para el amor de Dios. Incluye lealtad, protección, firmeza y ternura. No es un sentimiento pasajero, sino un compromiso irrompible." },
  { heb:"EL SHADDAI", esp:"Dios Todopoderoso (El que es suficiente)", refs:"Génesis 17:1 · Éxodo 6:3", desc:"Aparece 48 veces en el AT. Dios no solo tiene poder: él mismo es la suficiencia para todo lo que necesitamos. Cuando todo falta, él es el único que sobra." },
];

const QUIZ = [
  {
    q:"Según Juan 17:3, ¿cuál es la definición de vida eterna?",
    opts:["Creer en Jesucristo y ser bautizado","Guardar todos los mandamientos de la ley","Conocer al único Dios verdadero y a Jesucristo, a quien él envió","Participar activamente en la misión de la iglesia"],
    ans:2,
    exp:"«Y esta es la vida eterna: que te conozcan a ti, el único Dios verdadero, y a Jesucristo, a quien has enviado» (Jn 17:3). Conocer a Dios es mucho más que saber sobre él —es una relación personal y transformadora."
  },
  {
    q:"¿Cuál fue la estrategia de Satanás en el jardín del Edén para atacar el carácter de Dios? (Génesis 3:1-5)",
    opts:["Decirle a Eva que Dios no existía","Convencer a Eva de que Dios le ocultaba secretos y no quería lo mejor para ella","Prometerle a Eva poderes sobrenaturales si lo adoraba","Amenazar a Eva con castigo inmediato si desobedecía"],
    ans:1,
    exp:"El mensaje de Satanás fue claro: «Dios te oculta algo. No quiere lo mejor para ti.» Esa estrategia de mancillar el carácter de Dios es exactamente la misma que usa hoy —en las redes, en la cultura, en nuestros propios pensamientos."
  },
  {
    q:"¿Qué proclamaban sin cesar los cuatro seres vivientes ante el trono de Dios? (Apocalipsis 4:8)",
    opts:["«Gloria, honor y poder al Creador de todas las cosas»","«Digno eres de recibir la gloria, la honra y el poder»","«¡Santo, santo, santo es el Señor Dios Todopoderoso!»","«¡Aleluya! porque el Señor nuestro Dios Omnipotente reina»"],
    ans:2,
    exp:"Apocalipsis 4:8 muestra que incluso los seres celestiales sin pecado están perpetuamente abrumados por la santidad de Dios. «Santo» es el único atributo de Dios que la Biblia repite tres veces seguidas —enfatizando que es central en todo lo que él es."
  },
  {
    q:"Según 1 Juan 4:8, ¿cuál es la descripción más completa del carácter de Dios?",
    opts:["Dios es justo","Dios es todopoderoso","Dios es sabio","Dios es amor"],
    ans:3,
    exp:"Juan no dice «Dios es amoroso», sino «Dios es amor» (1 Jn 4:8). El amor no es solo una característica de Dios —es la esencia de quién él es. Todo lo demás (su justicia, su poder, su santidad) fluye de esa identidad."
  },
  {
    q:"¿Qué incluye la palabra hebrea 'hesed' que describe el amor de Dios?",
    opts:["Compasión hacia los que sufren físicamente","Lealtad, protección, firmeza y ternura","Perdón total e incondicional de toda ofensa","Amor romántico y sentimiento profundo"],
    ans:1,
    exp:"Hesed es el amor del pacto de Dios —no un sentimiento pasajero sino un compromiso activo. Cuando Dios dice que nos ama, significa lealtad inquebrantable, protección constante, firmeza ante la adversidad y ternura en la cercanía."
  },
  {
    q:"¿Cómo podemos ver el carácter de Dios con mayor claridad? (Juan 14:9)",
    opts:["Estudiando la naturaleza y la creación","Escuchando a los líderes espirituales y teólogos","Mirando a Jesús: sus palabras, acciones y amor","Meditando en los Salmos y los Proverbios"],
    ans:2,
    exp:"«El que me ha visto a mí, ha visto al Padre» (Jn 14:9). Jesús no solo refleja a Dios —lo revela. Para conocer cómo es Dios realmente, debemos estudiar, leer y contemplar la vida de Jesús en los cuatro Evangelios."
  },
  {
    q:"¿Cuál es la reacción típica de los personajes bíblicos al encontrarse con la santidad de Dios?",
    opts:["Reciben poder sobrenatural y comienzan a profetizar","Sienten paz inmediata y total confianza","Caen postrados, ocultan el rostro o quedan sin fuerzas","Se llenan de alegría y comienzan a adorar en voz alta"],
    ans:2,
    exp:"Moisés ocultó su rostro, Isaías dijo «¡Ay de mí!», Ezequiel cayó sobre su rostro, Daniel perdió todas sus fuerzas, Juan cayó como muerto. La santidad de Dios revela nuestra fragilidad —y por eso su respuesta siempre es: «No temas.»"
  },
];

const REFLEXIONES = [
  { q:"¿Por qué es tan importante conocer a Dios personalmente, no solo saber cosas sobre él?", ref:"Juan 17:3" },
  { q:"¿Cómo procura el enemigo distorsionar tu imagen de Dios hoy día —en redes, en la cultura, en el dolor?", ref:"Génesis 3:1-5" },
  { q:"¿En qué momentos de tu vida has sentido de manera especial la santidad de Dios? ¿Cómo influyó eso en tu forma de verlo?", ref:"Juan 17:11 · Apocalipsis 4:8" },
  { q:"Reemplazá la palabra «amor» en 1 Corintios 13 por tu nombre. ¿Cuánto se aleja tu amor del amor de Dios?", ref:"1 Corintios 13:4-8" },
  { q:"¿Qué aspecto del carácter de Dios necesitás conocer más profundamente esta semana?", ref:"Juan 17:25-26" },
  { q:"¿Cómo podés reflejar el amor de Dios a alguien concreto en tu entorno esta semana?", ref:"Juan 13:34-35 · 1 Juan 4:11" },
];

// ── SVG LIGHT RAYS ───────────────────────────────────────────────────────────
const LightRays = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="hero-deco"
    style={{ width:"260px", height:"260px", top:"50%", left:"50%", transform:"translate(-50%,-62%)", opacity:1 }}>
    <circle cx="100" cy="100" r="22" stroke="#c9a84c" strokeWidth="0.7" opacity="0.3"/>
    <circle cx="100" cy="100" r="48" stroke="#c9a84c" strokeWidth="0.4" opacity="0.18"/>
    <circle cx="100" cy="100" r="82" stroke="#c9a84c" strokeWidth="0.3" opacity="0.1"/>
    <line x1="100" y1="78" x2="100" y2="10" stroke="#c9a84c" strokeWidth="0.6" opacity="0.18"/>
    <line x1="100" y1="122" x2="100" y2="190" stroke="#c9a84c" strokeWidth="0.6" opacity="0.18"/>
    <line x1="78" y1="100" x2="10" y2="100" stroke="#c9a84c" strokeWidth="0.6" opacity="0.18"/>
    <line x1="122" y1="100" x2="190" y2="100" stroke="#c9a84c" strokeWidth="0.6" opacity="0.18"/>
    <line x1="84" y1="84" x2="29" y2="29" stroke="#c9a84c" strokeWidth="0.4" opacity="0.12"/>
    <line x1="116" y1="116" x2="171" y2="171" stroke="#c9a84c" strokeWidth="0.4" opacity="0.12"/>
    <line x1="116" y1="84" x2="171" y2="29" stroke="#c9a84c" strokeWidth="0.4" opacity="0.12"/>
    <line x1="84" y1="116" x2="29" y2="171" stroke="#c9a84c" strokeWidth="0.4" opacity="0.12"/>
    <circle cx="100" cy="100" r="8" fill="#c9a84c" opacity="0.12"/>
    <circle cx="100" cy="100" r="4" fill="#e0c070" opacity="0.2"/>
  </svg>
);

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("inicio");
  const [master, setMaster] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [secretFlash, setSecretFlash] = useState(false);
  const [openVerses, setOpenVerses] = useState({});
  const [openPersonajes, setOpenPersonajes] = useState({});
  const [openEvangelios, setOpenEvangelios] = useState({});
  const [openCor13, setOpenCor13] = useState({});
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [quizDone, setQuizDone] = useState(false);
  const scrollRef = useRef(null);
  const tapTimer = useRef(null);

  const changeTab = useCallback((t) => {
    setTab(t);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "instant" }), 0);
  }, []);

  const handleTitleTap = useCallback(() => {
    const next = tapCount + 1;
    setTapCount(next);
    clearTimeout(tapTimer.current);
    if (next >= 5) {
      setMaster(m => !m); setSecretFlash(true); setTapCount(0);
      setTimeout(() => setSecretFlash(false), 1200);
    } else {
      tapTimer.current = setTimeout(() => setTapCount(0), 1800);
    }
  }, [tapCount]);

  const toggle = (setter, key) => setter(p => ({ ...p, [key]: !p[key] }));

  const selectQuiz = i => {
    if (quizAnswered) return;
    setQuizSelected(i); setQuizAnswered(true);
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
    { id:"inicio",   label:"Inicio",   Icon:Home },
    { id:"santidad", label:"Santidad", Icon:Shield },
    { id:"amor",     label:"Amor",     Icon:Heart },
    { id:"jesus",    label:"Jesús",    Icon:Eye },
    { id:"biblia",   label:"Biblia",   Icon:BookOpen },
    { id:"quiz",     label:"Quiz",     Icon:HelpCircle },
    { id:"cierre",   label:"Cierre",   Icon:MessageCircle },
  ];

  const score = quizResults.filter(Boolean).length;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="scroll-area" ref={scrollRef}>
          <div className="hero">
            <div className="hero-glow" />
            <LightRays />
            <div className="hero-brand"><span className="hero-dot" />InVerso · Semana 2 · 2do Trim. 2026</div>
            <h1 className="hero-title" onClick={handleTitleTap}>Una imagen más<br /><em>clara de Dios</em></h1>
            <div className="hero-ref">Juan 17</div>
            <div className="hero-line" />
          </div>
          <div className={`secret-bar${secretFlash ? " flash" : ""}`}>{master ? "— modo maestro activo —" : "· · ·"}</div>
          <div className="content">
            {tab==="inicio"   && <TabInicio master={master} />}
            {tab==="santidad" && <TabSantidad openPersonajes={openPersonajes} toggle={k => toggle(setOpenPersonajes, k)} />}
            {tab==="amor"     && <TabAmor openCor13={openCor13} toggle={k => toggle(setOpenCor13, k)} />}
            {tab==="jesus"    && <TabJesus openEvangelios={openEvangelios} toggle={k => toggle(setOpenEvangelios, k)} master={master} />}
            {tab==="biblia"   && <TabBiblia openVerses={openVerses} toggle={k => toggle(setOpenVerses, k)} />}
            {tab==="quiz"     && <TabQuiz quizIdx={quizIdx} quizSelected={quizSelected} quizAnswered={quizAnswered} quizResults={quizResults} quizDone={quizDone} score={score} selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz} />}
            {tab==="cierre"   && <TabCierre />}
          </div>
        </div>
        <nav className="nav">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={tab===id ? "on" : ""} onClick={() => changeTab(id)}><Icon />{label}</button>
          ))}
        </nav>
      </div>
    </>
  );
}

// ── TAB: INICIO ───────────────────────────────────────────────────────────────
function TabInicio({ master }) {
  return (
    <>
      <div className="sec-title">Bienvenida</div>
      <div className="sec-sub">Esta semana: conocer el carácter de Dios — su santidad y su amor — para tener una relación más profunda con él.</div>
      {master ? (
        <>
          <div className="guide-banner">
            <div className="guide-badge">Maestro</div>
            <p>Guía de clase · 30 minutos · Modo maestro activo</p>
          </div>
          {[
            { t:"0–3 min",   title:"Bienvenida",        desc:'Pregunta introductoria: "Si tuvieras que describir a Dios con tres palabras, ¿cuáles serían?" Anotá las respuestas. Introduce la tensión: ¿de dónde viene nuestra imagen de Dios?' },
            { t:"3–5 min",   title:"Pedidos y oración", desc:"Tomá pedidos brevemente. Pedí que alguien ore pidiendo que Dios se revele a través del estudio de hoy." },
            { t:"5–11 min",  title:"Tab: Santidad",     desc:"Recorrés los 5 personajes bíblicos. Preguntá: ¿Por qué la santidad de Dios es el fundamento de todas sus otras cualidades? ¿Podríamos confiar en un Dios omnipotente que no fuera santo?" },
            { t:"11–18 min", title:"Tab: Amor",         desc:"Ejercicio grupal con 1 Cor 13: leelo sustituyendo «amor» por «Dios». Cada uno elige el atributo que más le impacta y lo comparte. Luego explorá los nombres hebreos de Dios." },
            { t:"18–22 min", title:"Tab: Jesús",        desc:"Los cuatro Evangelios como lentes para ver a Dios. Preguntá: ¿Cuál ángulo del carácter de Dios te resulta más nuevo o desafiante? Enfatizá Juan 14:9." },
            { t:"22–27 min", title:"Tab: Quiz",         desc:"Quiz grupal. Aprovechá cada explicación para relacionarla con vida concreta: ¿Cómo distorsiona el enemigo el carácter de Dios en tu contexto hoy?" },
            { t:"27–30 min", title:"Reflexión y cierre",desc:"Usá las preguntas 1, 3 y 6 del Cierre. Terminá leyendo «Para tu vida». Cerrar en oración de alabanza al carácter de Dios." },
          ].map((s, i) => (
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
            <p>Tener una imagen clara de Dios es fundamental para construir una relación real con él. Esta semana exploramos su santidad, su amor y cómo Jesús es la revelación más completa del carácter del Padre.</p>
          </div>
          <div className="card">
            <div className="card-label">Texto base — Juan 17</div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", color:"var(--tx)", lineHeight:"1.65" }}>"Y esta es la vida eterna: que te conozcan a ti, el único Dios verdadero, y a Jesucristo, a quien has enviado."</p>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:".6rem", color:"var(--tx3)", marginTop:".5rem" }}>Juan 17:3</div>
          </div>
          <div className="card">
            <div className="card-label">Explorar esta semana</div>
            <p>
              <strong style={{ color:"var(--tx)" }}>Santidad</strong> — Lo que significa que Dios sea completamente santo<br />
              <strong style={{ color:"var(--tx)" }}>Amor</strong> — Hesed y el ejercicio de 1 Corintios 13<br />
              <strong style={{ color:"var(--tx)" }}>Jesús</strong> — Los cuatro Evangelios como ventanas a Dios<br />
              <strong style={{ color:"var(--tx)" }}>Biblia</strong> — Todos los versículos de la semana
            </p>
          </div>
          <div className="egw-wrap">
            <div className="egw-source"><BookOpen size={12} />Elena G. de White · Palabras de vida del gran Maestro, cap. 29, p. 344</div>
            <div className="egw-text">"El último mensaje de clemencia que debe darse al mundo, es una revelación de <strong>su carácter de amor</strong>."</div>
          </div>
        </>
      )}
    </>
  );
}

// ── TAB: SANTIDAD ─────────────────────────────────────────────────────────────
function TabSantidad({ openPersonajes, toggle }) {
  return (
    <>
      <div className="sec-title">Santidad</div>
      <div className="sec-sub">Dios está libre y completamente separado del mal. Su santidad no es solo una cualidad — es el fundamento de todo lo que él es.</div>
      <div className="card">
        <div className="card-label">¿Qué significa que Dios sea santo?</div>
        <p>Dios es ciento por ciento bueno, de principio a fin (Santiago 1:17; 1 Juan 1:5). Su amor es un amor puro y santo. Su omnipotencia es una omnipotencia santa. Sin esta santidad, su poder sería tiranía y su conocimiento sería amenaza. <strong style={{ color:"var(--tx)" }}>Solo la santidad de Dios nos permite amarlo plenamente y libremente.</strong></p>
      </div>
      <div style={{ marginBottom:".5rem" }}>
        <div className="card-label" style={{ marginBottom:".6rem", paddingLeft:".2rem" }}>Personajes bíblicos ante la santidad de Dios</div>
        {PERSONAJES.map(p => (
          <div key={p.badge} className={`expand-item${openPersonajes[p.badge] ? " open" : ""}`} onClick={() => toggle(p.badge)}>
            <div className="expand-header">
              <span className="expand-badge">{p.badge}</span>
              <span className="expand-name" style={{ fontSize:".95rem" }}>{p.reaccion}</span>
              {openPersonajes[p.badge] ? <ChevronUp size={16} color="var(--tx3)" style={{ flexShrink:0 }} /> : <ChevronDown size={16} color="var(--tx3)" style={{ flexShrink:0 }} />}
            </div>
            {openPersonajes[p.badge] && (
              <div className="expand-body">
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:".58rem", color:"var(--acc)", marginBottom:".4rem" }}>{p.ref}</div>
                <p style={{ fontSize:".97rem", lineHeight:"1.55", color:"var(--tx2)" }}>{p.leccion}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ background:"linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.02))", border:"1px solid rgba(201,168,76,.2)", borderRadius:"14px", padding:"1rem 1.1rem", marginBottom:".85rem" }}>
        <div className="card-label">Apocalipsis 4:8 — El coro eterno</div>
        <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", color:"var(--acc3)", lineHeight:"1.7", fontSize:"1.05rem" }}>"¡Santo, santo, santo es el Señor Dios Todopoderoso, el que era, el que es, y el que ha de venir!"</p>
        <p style={{ fontSize:".9rem", color:"var(--tx2)", marginTop:".6rem", lineHeight:"1.5" }}>El único atributo de Dios repetido tres veces seguidas en la Biblia. Incluso los seres celestiales sin pecado quedan perpetuamente abrumados por la santidad de Dios.</p>
      </div>
      <div className="card">
        <div className="card-label">Llamados a la santidad — 1 Pedro 1:15-16</div>
        <p>La santidad de Dios no es solo para admirar. Estamos llamados a reflejarla: <strong style={{ color:"var(--tx)" }}>"Como aquel que os llamó es santo, sed también vosotros santos en toda vuestra manera de vivir."</strong></p>
      </div>
      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Testimonios para la iglesia, t. 5, p. 692</div>
        <div className="egw-text">"Satanás procura constantemente mantener las mentes humanas ocupadas en aquellas cosas que les impedirán obtener <strong>el conocimiento de Dios</strong>."</div>
      </div>
    </>
  );
}

// ── TAB: AMOR ─────────────────────────────────────────────────────────────────
function TabAmor({ openCor13, toggle }) {
  return (
    <>
      <div className="sec-title">Amor</div>
      <div className="sec-sub">«Dios es amor» (1 Juan 4:8). No es que Dios ame — el amor es la esencia misma de quién él es.</div>
      <div className="card">
        <div className="card-label">Hesed — El amor del pacto</div>
        <p>La palabra hebrea <strong style={{ color:"var(--acc3)" }}>hesed</strong> describe el amor comprometido de Dios: lealtad, protección, firmeza y ternura. No es un sentimiento pasajero sino un compromiso indestructible. Tu situación, tus errores, tu distancia — nada puede romper el hesed de Dios.</p>
      </div>
      <div className="card-label" style={{ marginBottom:".5rem", paddingLeft:".2rem" }}>Nombres de Dios que revelan su amor</div>
      {NOMBRES_DIOS.map(n => (
        <div key={n.heb} className="card" style={{ marginBottom:".65rem" }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:".72rem", color:"var(--acc2)", letterSpacing:".08em", marginBottom:".2rem" }}>{n.heb}</div>
          <div style={{ fontSize:"1rem", fontWeight:600, color:"var(--tx)", marginBottom:".25rem" }}>{n.esp}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:".55rem", color:"var(--tx3)", marginBottom:".4rem" }}>{n.refs}</div>
          <p style={{ fontSize:".97rem", lineHeight:"1.55", color:"var(--tx2)", margin:0 }}>{n.desc}</p>
        </div>
      ))}
      <div style={{ marginTop:"1rem", marginBottom:".5rem" }}>
        <div className="card-label" style={{ marginBottom:".3rem", paddingLeft:".2rem" }}>Ejercicio — 1 Corintios 13:4-8</div>
        <p style={{ fontSize:".88rem", color:"var(--tx3)", marginBottom:".7rem", lineHeight:"1.5" }}>Donde dice "amor", ponele "Dios". Tocá cada atributo para ver cómo revela el carácter de Dios.</p>
        {COR13.map(item => (
          <div key={item.attr} className={`cor13-item${openCor13[item.attr] ? " open" : ""}`} onClick={() => toggle(item.attr)}>
            <div className="cor13-header">
              <span className="cor13-attr">{item.attr}</span>
              {openCor13[item.attr] ? <ChevronUp size={15} color="var(--tx3)" /> : <ChevronDown size={15} color="var(--tx3)" />}
            </div>
            {openCor13[item.attr] && (
              <div className="cor13-body">
                <div className="cor13-orig">"{item.orig}"</div>
                <div className="cor13-dios">→ {item.dios}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="egw-wrap" style={{ marginTop:"1rem" }}>
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Testimonios para la iglesia, t. 5, pp. 691-692</div>
        <div className="egw-text">"Todo el amor paterno que se haya transmitido de generación en generación... son tan solo como una gota del ilimitado océano, cuando se comparan con el <strong>amor infinito e inagotable de Dios</strong>."</div>
      </div>
      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 1, pp. 22-23</div>
        <div className="egw-text">"Cuanto más estudiamos el carácter divino a la luz de la cruz, mejor vemos <strong>la misericordia, la ternura y el perdón</strong> unidos a la equidad y la justicia."</div>
      </div>
    </>
  );
}

// ── TAB: JESÚS ────────────────────────────────────────────────────────────────
function TabJesus({ openEvangelios, toggle, master }) {
  return (
    <>
      <div className="sec-title">Jesús</div>
      <div className="sec-sub">La imagen más clara y verdadera de Dios está en Jesús. Los cuatro Evangelios son cuatro ventanas al carácter del Padre.</div>
      <div style={{ background:"linear-gradient(135deg,rgba(201,168,76,.1),rgba(201,168,76,.02))", border:"1.5px solid rgba(201,168,76,.28)", borderRadius:"16px", padding:"1.2rem 1.1rem", marginBottom:"1rem", textAlign:"center" }}>
        <div className="card-label" style={{ justifyContent:"center", display:"flex" }}>Juan 14:9 — Clave de la semana</div>
        <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"1.1rem", color:"var(--acc3)", lineHeight:"1.65" }}>"El que me ha visto a mí, ha visto al Padre."</p>
      </div>
      <div className="card-label" style={{ marginBottom:".6rem", paddingLeft:".2rem" }}>Los cuatro Evangelios</div>
      {EVANGELIOS.map(e => (
        <div key={e.num} className={`expand-item${openEvangelios[e.num] ? " open" : ""}`} onClick={() => toggle(e.num)}>
          <div className="expand-header">
            <span className="expand-badge">{e.num}</span>
            <div style={{ flex:1 }}>
              <div className="expand-name">{e.nombre}</div>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:".55rem", color:"var(--acc)", marginTop:".1rem" }}>{e.angulo}</div>
            </div>
            {openEvangelios[e.num] ? <ChevronUp size={16} color="var(--tx3)" style={{ flexShrink:0 }} /> : <ChevronDown size={16} color="var(--tx3)" style={{ flexShrink:0 }} />}
          </div>
          {openEvangelios[e.num] && (
            <div className="expand-body">
              <p style={{ fontSize:".9rem", color:"var(--tx3)", marginBottom:".4rem" }}>Para: {e.para}</p>
              <p style={{ fontSize:".97rem", lineHeight:"1.55", color:"var(--tx2)", marginBottom:".5rem" }}>{e.rasgos}</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:".95rem", color:"var(--acc3)", lineHeight:"1.55" }}>{e.verso}</p>
            </div>
          )}
        </div>
      ))}
      <div className="card" style={{ marginTop:".5rem" }}>
        <div className="card-label">Emanuel — Dios con nosotros</div>
        <p>Cuando Jesús vino a esta tierra, era <strong style={{ color:"var(--tx)" }}>"Dios con nosotros"</strong> (Mateo 1:23). Antes de ascender prometió: <em style={{ color:"var(--acc3)" }}>"Estaré con vosotros todos los días, hasta el fin del mundo"</em> (Mateo 28:20). Los Evangelios no son solo historia pasada — son ventanas al carácter de Dios hoy.</p>
      </div>
      {master && (
        <div className="egw-wrap">
          <div className="egw-source"><BookOpen size={12} />Elena G. de White · Palabras de vida del gran Maestro, cap. 2, p. 23</div>
          <div className="egw-text">"El tema favorito de Cristo era la ternura paternal y la abundante gracia de Dios; <strong>se presentaba a sí mismo como el camino, la verdad y la vida</strong>."</div>
        </div>
      )}
      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Carta 53, 1900</div>
        <div className="egw-text">"Cada escritor tiene su propia experiencia, y esta diversidad amplía y profundiza el conocimiento que se transmite para <strong>satisfacer las necesidades de mentes diversas</strong>."</div>
      </div>
    </>
  );
}


// ── TAB: BIBLIA ───────────────────────────────────────────────────────────────
function renderVerseText(text) {
  const parts = text.split(/(\b\d+\s)/);
  return parts.map((part, i) => {
    if (/^\d+\s$/.test(part)) {
      return <span key={i} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:".55rem", color:"var(--acc)", verticalAlign:"super", opacity:.8, marginRight:"2px" }}>{part.trim()}</span>;
    }
    return part ? <span key={i}>{part}</span> : null;
  });
}

function TabBiblia({ openVerses, toggle }) {
  return (
    <>
      <div className="sec-title">Biblia</div>
      <div className="sec-sub">{VERSES.filter(Boolean).length} referencias · RVR1960 · Tocá para expandir</div>
      {VERSES.map(v => (
        <div key={v.ref} className={`verse-item${v.base ? " base-v" : ""}`} onClick={() => toggle(v.ref)}>
          <div className="verse-header">
            <span className="verse-ref">{v.ref}</span>
            <div className="verse-tags">
              {v.base && <span className="verse-tag warn-tag"><Star size={9} style={{ display:"inline", marginRight:"2px" }} />Texto base</span>}
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
    const pct = Math.round((score / QUIZ.length) * 100);
    const msgs = ["Seguí repasando el material —cada lección refuerza tu fe.","Buen intento. Releé los versículos clave y volvé a intentarlo.","¡Bien hecho! Conocés los conceptos principales de esta semana.","¡Excelente! Tenés un dominio sólido del carácter de Dios."];
    return (
      <div className="quiz-results">
        <div style={{ marginBottom:"1rem" }}><div className="quiz-score">{score}/{QUIZ.length}</div><div className="quiz-pct">{pct}% correcto</div></div>
        <div className="quiz-progress" style={{ marginBottom:"1.5rem" }}>{quizResults.map((r, i) => <div key={i} className={`quiz-dot ${r?"correct":"wrong"}`} />)}</div>
        <div className="quiz-msg">{msgs[pct<40?0:pct<60?1:pct<90?2:3]}</div>
        <button className="quiz-retry" onClick={retryQuiz}><RotateCcw size={16} />Intentar de nuevo</button>
      </div>
    );
  }
  const q = QUIZ[quizIdx];
  return (
    <>
      <div className="sec-title">Quiz</div>
      <div className="sec-sub" style={{ marginBottom:".85rem" }}>Pregunta {quizIdx+1} de {QUIZ.length}</div>
      <div className="quiz-progress">{QUIZ.map((_,i) => <div key={i} className={`quiz-dot ${i<quizIdx?(quizResults[i]?"correct":"wrong"):i===quizIdx?"active":""}`} />)}</div>
      <div className="quiz-q">{q.q}</div>
      {q.opts.map((opt, i) => {
        let cls = "quiz-option";
        if (quizAnswered) { if (i===q.ans) cls+=" correct"; else if (i===quizSelected) cls+=" wrong"; }
        return <button key={i} className={cls} onClick={() => selectQuiz(i)} disabled={quizAnswered}>{opt}</button>;
      })}
      {quizAnswered && (
        <>
          <div className="quiz-feedback">
            {quizSelected===q.ans
              ? <><CheckCircle size={14} color="var(--ok)" style={{ display:"inline", marginRight:"5px" }} /><strong>¡Correcto!</strong> {q.exp}</>
              : <><XCircle size={14} color="var(--err)" style={{ display:"inline", marginRight:"5px" }} /><strong>No exactamente.</strong> {q.exp}</>}
          </div>
          <button className="quiz-next" onClick={nextQuiz}>{quizIdx+1<QUIZ.length?"Siguiente →":"Ver resultados"}</button>
        </>
      )}
    </>
  );
}

// ── TAB: CIERRE ───────────────────────────────────────────────────────────────
function TabCierre() {
  return (
    <>
      <div className="sec-title">Cierre</div>
      <div className="sec-sub">Preguntas para el grupo · Reflexión personal</div>
      {REFLEXIONES.map((r, i) => (
        <div className="reflex-card" key={i}>
          <div className="reflex-num">{i+1}</div>
          <div className="reflex-body">
            <div className="reflex-q">{r.q}</div>
            <div className="reflex-ref">{r.ref}</div>
          </div>
        </div>
      ))}
      <div className="vida-card">
        <div className="vida-label"><Flame size={13} />Para tu vida</div>
        <div className="vida-text">
          En Instagram, TikTok, en los memes y en las conversaciones de tu entorno, la imagen de Dios es distorsionada constantemente — a veces de forma obvia, a veces muy sutil. <strong>La pregunta de esta semana no es si Dios existe, sino si la imagen que tenés de él es la verdadera.</strong><br /><br />
          ¿Cuándo fue la última vez que te sentaste y, sin distracciones, leíste lo que Jesús dijo e hizo? No para cumplir, sino porque querías conocer cómo es el Padre.<br /><br />
          Esta semana, elegí un evangelio y leé un capítulo cada día. No como tarea — como una conversación. <strong>Cada acción de Jesús es una carta abierta sobre cómo es Dios.</strong> Y ese Dios que ves ahí te conoce, no te oculta nada, y quiere lo mejor para vos.
        </div>
      </div>
    </>
  );
}
