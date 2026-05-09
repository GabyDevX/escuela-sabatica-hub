import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, Shield, Layers,
  MessageCircle, Search, Heart
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg:#070a14; --bg2:#0b0f1d; --bg3:#111827;
  --surf:#151e30; --surf2:#1c2840;
  --brd:#1e2e48; --brd2:#2a4068;
  --tx:#e0e8f8; --tx2:#8ba8cc; --tx3:#4a6890;
  --acc:#4a8fd4; --acc2:#6aaae8; --acc3:#a8cbf5;
  --ok:#10b981; --ok-d:rgba(16,185,129,.10);
  --err:#f43f5e; --err-d:rgba(244,63,94,.10);
  --warn:#f59e0b; --warn-d:rgba(245,158,11,.10);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}

/* HERO */
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#0d1628 0%,#070a14 55%,#050810 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(74,143,212,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.85rem;font-weight:700;line-height:1.18;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(74,143,212,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(74,143,212,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(74,143,212,.3) 30%,rgba(74,143,212,.3) 70%,transparent)}

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
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(74,143,212,.08);border-radius:10px;z-index:-1}

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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(74,143,212,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(245,158,11,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}

/* EXPAND */
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(74,143,212,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(74,143,212,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}

/* EGW */
.egw-wrap{background:linear-gradient(135deg,rgba(74,143,212,.07),rgba(74,143,212,.02));border:1px solid rgba(74,143,212,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(74,143,212,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}

/* PRAYER CARD (special card for Lord's Prayer elements) */
.prayer-card{border-radius:12px;margin-bottom:.6rem;overflow:hidden;cursor:pointer;transition:all .2s;border:1px solid var(--brd)}
.prayer-card.open{border-color:var(--acc2)}
.prayer-header{display:flex;align-items:flex-start;gap:.8rem;padding:.9rem 1rem;background:var(--surf)}
.prayer-icon{font-family:'IBM Plex Mono',monospace;font-size:.55rem;color:var(--acc2);background:rgba(74,143,212,.15);padding:.25rem .5rem;border-radius:6px;flex-shrink:0;margin-top:.15rem;white-space:nowrap}
.prayer-phrase{font-family:'Playfair Display',serif;font-size:.98rem;font-weight:600;color:var(--tx);flex:1;line-height:1.35;font-style:italic}
.prayer-body{font-size:.97rem;line-height:1.65;color:var(--tx2);padding:.1rem 1rem 1rem;background:var(--surf);border-top:1px solid var(--brd)}

/* STEP LIST */
.step-item{display:flex;gap:.9rem;padding:.85rem 1rem;background:var(--surf);border-radius:12px;border:1px solid var(--brd);margin-bottom:.5rem}
.step-num{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--acc2);white-space:nowrap;padding-top:.15rem;min-width:1.8rem;font-weight:700}
.step-body{flex:1;font-size:.97rem;line-height:1.6;color:var(--tx2)}
.step-body strong{color:var(--tx)}

/* HIGHLIGHT CARD */
.honey-card{background:linear-gradient(135deg,rgba(74,143,212,.10),rgba(74,143,212,.03));border:1px solid rgba(74,143,212,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.honey-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.honey-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.honey-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}

/* GUIDE */
.guide-banner{background:linear-gradient(135deg,rgba(245,158,11,.10),rgba(245,158,11,.02));border:1px solid rgba(245,158,11,.22);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(245,158,11,.12);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
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
.vida-card{background:linear-gradient(135deg,rgba(74,143,212,.10),rgba(74,143,212,.02));border:1.5px solid rgba(74,143,212,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const VERSES = [
  {
    ref: "Daniel 6:10-13", base: true,
    text: `10 Cuando Daniel supo que el edicto había sido firmado, entró en su casa, y abiertas las ventanas de su cámara que daban hacia Jerusalén, se arrodillaba tres veces al día, y oraba y daba gracias delante de su Dios, como lo solía hacer antes. 11 Entonces se juntaron aquellos hombres, y hallaron a Daniel orando y rogando en presencia de su Dios. 12 Fueron luego ante el rey y le hablaron del edicto real: ¿No has confirmado edicto que cualquiera que ore a cualquier dios u hombre dentro de treinta días, excepto a ti, oh rey, sea echado en el foso de los leones? Respondió el rey diciendo: Verdad es, conforme a la ley de Media y de Persia, la cual no puede ser revocada. 13 Entonces respondieron y dijeron delante del rey: Daniel, que es de los hijos del cautiverio de Judá, no te respeta a ti, oh rey, ni acata el edicto que confirmaste, sino que tres veces al día hace su petición.`
  },
  {
    ref: "Daniel 1:8",
    text: `Y Daniel propuso en su corazón no contaminarse con la porción de la comida del rey, ni con el vino que él bebía; pidió, por tanto, al jefe de los eunucos que no se le obligase a contaminarse.`
  },
  {
    ref: "Daniel 6:3-4",
    text: `3 Pero Daniel mismo era superior a estos sátrapas y gobernadores, porque había en él un espíritu superior; y el rey pensó en ponerlo sobre todo el reino. 4 Entonces los gobernadores y los sátrapas buscaban ocasión para acusar a Daniel en lo relacionado al reino; mas no podían hallar ocasión alguna o falta, porque él era fiel, y ningún vicio ni falta fue hallado en él.`
  },
  {
    ref: "Daniel 2:20-23",
    text: `20 Y Daniel habló y dijo: Sea bendito el nombre de Dios de siglos en siglos, porque suyos son el poder y la sabiduría. 21 Él muda los tiempos y las edades; quita reyes, y pone reyes; da la sabiduría a los sabios, y la ciencia a los entendidos. 22 Él revela lo profundo y lo escondido; conoce lo que está en tinieblas, y con él mora la luz. 23 A ti, oh Dios de mis padres, te doy gracias y te alabo, porque me has dado sabiduría y fuerza, y ahora me has revelado lo que te pedimos; pues nos has dado a conocer el asunto del rey.`
  },
  {
    ref: "Daniel 9:3-4",
    text: `3 Y volví mi rostro a Dios el Señor, buscándole en oración y ruego, en ayuno, cilicio y ceniza. 4 Y oré a Jehová mi Dios e hice confesión diciendo: Ahora, Señor, Dios grande, digno de ser temido, que guardas el pacto y la misericordia con los que te aman y guardan tus mandamientos.`
  },
  {
    ref: "Salmo 139:7-12",
    text: `7 ¿A dónde me iré de tu Espíritu? ¿Y a dónde huiré de tu presencia? 8 Si subiere a los cielos, allí estás tú; y si en el Seol hiciere mi estrado, he aquí, allí tú estás. 9 Si tomare las alas del alba y habitare en el extremo del mar, 10 aun allí me guiará tu mano, y me asirá tu diestra. 11 Si dijere: Ciertamente las tinieblas me encubrirán; aun la noche resplandecerá alrededor de mí. 12 Aun las tinieblas no encubren de ti, y la noche resplandece como el día; lo mismo te son las tinieblas que la luz.`
  },
  {
    ref: "Lamentaciones 3:55-57",
    text: `55 Invoqué tu nombre, oh Jehová, desde la cárcel profunda. 56 Oíste mi voz; no escondas tu oído al clamor de mis suspiros. 57 Te acercaste el día que te invoqué; dijiste: No temas.`
  },
  {
    ref: "1 Tesalonicenses 5:16-18",
    text: `16 Estad siempre gozosos. 17 Orad sin cesar. 18 Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.`
  },
  {
    ref: "Colosenses 4:2",
    text: `Perseverad en la oración, velando en ella con acción de gracias.`
  },
  {
    ref: "Romanos 12:12",
    text: `Gozosos en la esperanza; sufridos en la tribulación; constantes en la oración.`
  },
  {
    ref: "Salmo 5:3",
    text: `Oh Jehová, de mañana oirás mi voz; de mañana me presentaré delante de ti, y esperaré.`
  },
  {
    ref: "Salmo 55:17",
    text: `Tarde y mañana y a mediodía oraré y clamaré, y él oirá mi voz.`
  },
  {
    ref: "Salmo 92:1-2",
    text: `1 Bueno es alabarte, oh Jehová, y cantar salmos a tu nombre, oh Altísimo; 2 Anunciar por la mañana tu misericordia, y tu fidelidad cada noche.`
  },
  {
    ref: "Salmo 141:2",
    text: `Suba mi oración delante de ti como el incienso, el don de mis manos como la ofrenda de la tarde.`
  },
  {
    ref: "Génesis 24:12-14",
    text: `12 Y dijo: Oh Jehová, Dios de mi señor Abraham, dame, te ruego, el tener hoy buen encuentro, y haz misericordia con mi señor Abraham. 13 He aquí yo estoy junto a la fuente de agua, y las hijas de los varones de esta ciudad salen por agua; 14 sea, pues, que la doncella a quien yo dijere: Baja tu cántaro, te ruego, para que yo beba, y ella respondiere: Bebe, y también daré de beber a tus camellos; que sea ésta la que tú destinaste para tu siervo Isaac; y en esto conoceré que habrás hecho misericordia con mi señor.`
  },
  {
    ref: "1 Samuel 1:12-13",
    text: `12 Aconteció que mientras ella oraba largamente delante de Jehová, que Elí estaba observando la boca de ella. 13 Pero Ana hablaba en su corazón, y solamente se movían sus labios, y su voz no se oía; y Elí la tuvo por ebria.`
  },
  {
    ref: "Nehemías 2:4",
    text: `Entonces el rey me dijo: ¿Qué cosa pides? Entonces oré al Dios de los cielos.`
  },
  {
    ref: "Juan 5:30",
    text: `No puedo yo hacer nada por mí mismo; según oigo, así juzgo; y mi juicio es justo, porque no busco mi voluntad, sino la voluntad del que me envió, la del Padre.`
  },
  {
    ref: "Lucas 11:1",
    text: `Aconteció que estando Jesús orando en un lugar, cuando terminó, uno de sus discípulos le dijo: Señor, enséñanos a orar, como también Juan enseñó a sus discípulos.`
  },
  {
    ref: "Mateo 6:5-8",
    text: `5 Y cuando ores, no seas como los hipócritas; porque ellos aman orar en pie en las sinagogas y en las esquinas de las calles, para ser vistos de los hombres; de cierto os digo que ya tienen su recompensa. 6 Mas tú, cuando ores, entra en tu aposento, y cerrada tu puerta, ora a tu Padre que está en secreto; y tu Padre que ve en lo secreto te recompensará en público. 7 Y orando, no uséis vanas repeticiones, como los gentiles, que piensan que por su palabrería serán oídos. 8 No os hagáis, pues, semejantes a ellos; porque vuestro Padre sabe de qué cosas tenéis necesidad, antes que vosotros le pidáis.`
  },
  {
    ref: "Mateo 6:9-13",
    text: `9 Vosotros, pues, oraréis así: Padre nuestro que estás en los cielos, santificado sea tu nombre. 10 Venga tu reino. Hágase tu voluntad, como en el cielo, así también en la tierra. 11 El pan nuestro de cada día, dánoslo hoy. 12 Y perdónanos nuestras deudas, como también nosotros perdonamos a nuestros deudores. 13 Y no nos metas en tentación, mas líbranos del mal; porque tuyo es el reino, y el poder, y la gloria, por todos los siglos. Amén.`
  },
  {
    ref: "Lucas 22:41",
    text: `Y él se apartó de ellos a distancia como de un tiro de piedra; y puesto de rodillas oró.`
  },
  {
    ref: "Hechos 16:25-26",
    text: `25 Pero a medianoche, orando Pablo y Silas, cantaban himnos a Dios; y los presos los oían. 26 Entonces sobrevino de repente un gran terremoto, de tal manera que los cimientos de la cárcel se sacudían; y al instante se abrieron todas las puertas, y las cadenas de todos se soltaron.`
  },
  {
    ref: "Hechos 7:60",
    text: `Y puesto de rodillas, clamó a gran voz: Señor, no les tomes en cuenta este pecado. Y habiendo dicho esto, durmió.`
  },
  {
    ref: "Hechos 9:40",
    text: `Entonces, sacando a todos, Pedro se puso de rodillas y oró; y mirando al cuerpo, dijo: Tabita, levántate. Y ella abrió los ojos, y al ver a Pedro, se incorporó.`
  },
  {
    ref: "Hechos 20:36",
    text: `Cuando hubo dicho estas cosas, se puso de rodillas, y oró con todos ellos.`
  },
  {
    ref: "Marcos 1:35",
    text: `Levantándose muy de mañana, siendo aún muy oscuro, salió y se fue a un lugar desierto, y allí oraba.`
  },
  {
    ref: "Lucas 5:16",
    text: `Mas él se apartaba a lugares desiertos, y oraba.`
  },
  {
    ref: "Lucas 6:12",
    text: `En aquellos días él fue al monte a orar, y pasó la noche orando a Dios.`
  },
  {
    ref: "Marcos 6:46",
    text: `Y despidiéndose de ellos, se fue al monte a orar.`
  },
  {
    ref: "1 Crónicas 29:11",
    text: `Tuya es, oh Jehová, la magnificencia y el poder, la gloria, la victoria y el honor; porque todas las cosas que están en los cielos y en la tierra son tuyas. Tuyo, oh Jehová, es el reino, y tú eres excelso sobre todos.`
  },
  {
    ref: "Santiago 5:11",
    text: `He aquí, tenemos por bienaventurados a los que sufren. Habéis oído de la paciencia de Job, y habéis visto el fin del Señor, que el Señor es muy misericordioso y compasivo.`
  },
];

const QUIZ_DATA = [
  {
    q: "¿Cuántas veces al día oraba Daniel, según Daniel 6:10?",
    opts: ["Una vez, al amanecer", "Dos veces, mañana y noche", "Tres veces al día", "Cinco veces, como la tradición islámica"],
    ans: 2,
    feedback: "«Se arrodillaba tres veces al día, y oraba y daba gracias delante de su Dios, como lo solía hacer antes» (Dn 6:10). Esta práctica refleja el Salmo 55:17: «Tarde y mañana y a mediodía oraré y clamaré, y él oirá mi voz.»"
  },
  {
    q: "¿Qué hizo Daniel cuando se enteró del edicto que prohibía orar a cualquier dios?",
    opts: ["Oró en secreto con las ventanas cerradas para no ser visto", "Dejó de orar temporalmente para proteger su vida", "Continuó orando con las ventanas abiertas hacia Jerusalén", "Fue ante el rey para protestar el edicto"],
    ans: 2,
    feedback: "Daniel «entró en su casa, y abiertas las ventanas de su cámara que daban hacia Jerusalén, se arrodillaba tres veces al día» (Dn 6:10). Prefirió arriesgar su vida antes de orar en secreto. Su fidelidad en oración era más importante que su seguridad."
  },
  {
    q: "Según Elena G. de White citada en el estudio, ¿qué es la oración?",
    opts: ["Un ritual religioso de tres momentos al día", "El acto de abrir nuestro corazón a Dios como a un amigo", "Una práctica espiritual para personas avanzadas en la fe", "La repetición reverente de palabras sagradas"],
    ans: 1,
    feedback: "«Orar es el acto de abrir nuestro corazón a Dios como a un amigo» (Elena G. de White, El camino a Cristo, cap. 11, p. 138). La oración no es un ritual — es una conversación con alguien que nos ama y quiere escucharnos."
  },
  {
    q: "¿Quién vio a Ana orar en el tabernáculo con los labios moviéndose pero sin producir sonido?",
    opts: ["Samuel, su hijo", "Penina, su rival", "Elí, el sacerdote", "El profeta Gad"],
    ans: 2,
    feedback: "«Elí estaba observando la boca de ella. Pero Ana hablaba en su corazón, y solamente se movían sus labios, y su voz no se oía» (1 S 1:12-13). El Dios de la Biblia puede escuchar la oración silenciosa que se expresa desde el corazón."
  },
  {
    q: "¿Qué tipo de oraciones criticó Jesús según Mateo 6:5-8?",
    opts: ["Las oraciones muy cortas y apresuradas", "Las oraciones en voz alta en lugares públicos", "Las oraciones largas y ostentosas para ser vistos de los hombres", "Las oraciones sin referencias a las Escrituras"],
    ans: 2,
    feedback: "Jesús reprendió a quienes «aman orar en pie en las sinagogas y en las esquinas de las calles, para ser vistos de los hombres» (Mt 6:5). También rechazó las «vanas repeticiones» (v. 7). La oración verdadera es sincera, sencilla y personal."
  },
  {
    q: "¿Qué significado especial tiene arrodillarse para orar, según el estudio?",
    opts: ["Es el único modo válido de orar según la Biblia", "Es una declaración física de que elegimos a Dios, una postura de corazón humilde", "Es necesario para que Dios nos escuche correctamente", "Es una práctica solo para momentos de crisis o peligro"],
    ans: 1,
    feedback: "Arrodillarse no es el único modo válido de orar, pero «es como una declaración física a los poderes de las tinieblas de que elegimos a Dios». Revela una postura de corazón humilde y disposición de servir a Dios con todo el corazón."
  },
  {
    q: "¿Qué le dijo el discípulo a Jesús después de escucharlo orar, según Lucas 11:1?",
    opts: ["«¿Por qué oras tan seguido si ya conoces la voluntad del Padre?»", "«Señor, enséñanos a orar, como también Juan enseñó a sus discípulos»", "«¿Puedes repetir esa oración para que podamos memorizarla?»", "«¿Por qué te apartas a lugares solitarios para orar?»"],
    ans: 1,
    feedback: "«Uno de sus discípulos le dijo: Señor, enséñanos a orar, como también Juan enseñó a sus discípulos» (Lc 11:1). Escuchar a Jesús orar despertó en ellos el deseo de tener lo que él tenía: una conexión real y viva con el Padre."
  },
  {
    q: "¿Cuál era el rasgo que la Biblia destaca sobre la integridad de Daniel frente a sus rivales?",
    opts: ["Era el funcionario mejor pagado y más respetado del reino", "Hablaba todos los idiomas del Imperio Babilónico", "Era fiel, y ningún error ni falta hallaron en él", "Tenía visiones que ningún otro sabio podía interpretar"],
    ans: 2,
    feedback: "«Él era fiel, y ningún error ni falta fue hallado en él» (Dn 6:4). Sus rivales buscaban activamente algo de qué acusarlo, pero no encontraron nada. La vida de oración constante de Daniel se traducía en una vida de integridad irreprochable."
  },
];

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: ¿A quién llamás primero?", desc: "Preguntá: Cuando algo sale muy mal, ¿a quién llamás primero? ¿Y cuando tenés una gran noticia? Después de escuchar respuestas, introducí la pregunta central: ¿Qué lugar ocupa Dios en esa lista? Crear un ambiente honesto y sin juicios." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos brevemente. Orar pidiendo que Dios abra los corazones del grupo para ver la oración no como un deber religioso sino como una amistad real con él." },
  { time: "05–11 min", title: "Tab Daniel — El fiel Daniel", desc: "Recorrer las cuatro características expandibles de Daniel. Énfasis en que su vida de oración no era separable de su integridad pública. Pregunta clave: ¿Qué excusas ponemos para no orar? La agenda de Daniel como estadista era al menos tan apretada como la nuestra." },
  { time: "11–17 min", title: "Tab Postura — La posición al orar", desc: "Explorar las posiciones bíblicas de oración. Invitar al grupo a reflexionar: ¿Cuándo fue la última vez que se arrodillaron para orar? No condenar, sino invitar. La postura externa revela la postura interna del corazón. Sugerir que lo prueben esta semana." },
  { time: "17–22 min", title: "Tab Modelo — El Padre Nuestro", desc: "Recorrer los 7 elementos del Padre Nuestro. Énfasis en que la mayoría de nuestras oraciones están llenas de peticiones, cuando Jesús nos enseñó a orar por mucho más: alabanza, rendición, arrepentimiento, protección. ¿Cuándo fue la última vez que oramos así?" },
  { time: "22–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Pausar en la pregunta 3 (definición de oración de EGW) y en la pregunta 6 (significado de arrodillarse) — son las más ricas para debatir en grupo." },
  { time: "27–30 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Énfasis en la última reflexión personal: ¿la oración es algo hermoso o una carga para vos? Cerrar con el desafío concreto del texto Para tu vida. Oración final a cargo del maestro." },
];

const DANIEL_RASGOS = [
  {
    key: "d1", badge: "Carácter",
    name: "Se propuso no contaminarse",
    body: "«Daniel propuso en su corazón no contaminarse» (Dn 1:8). Desde el primer día en Babilonia, Daniel tomó decisiones firmes sobre su identidad. La convicción no llegó en el momento de crisis — ya estaba formada antes. Así también, la oración constante no aparece de repente en los malos momentos; se construye en los días ordinarios."
  },
  {
    key: "d2", badge: "Sabiduría",
    name: "Un espíritu superior en él",
    body: "«Porque había en él un espíritu superior» (Dn 6:3). La Biblia atribuye la sabiduría excepcional de Daniel al Espíritu de Dios que moraba en él (ver Dn 4:9; 5:14). Era inteligente, sí — pero su agudeza provenía de su conexión con el cielo. La oración no reemplaza el estudio; lo profundiza."
  },
  {
    key: "d3", badge: "Integridad",
    name: "Ningún error ni falta hallaron en él",
    body: "«Él era fiel, y ningún error ni falta fue hallado en él» (Dn 6:4). Sus rivales buscaban activamente algo de qué acusarlo y no encontraron nada. Décadas de vida pública intachable. Esta integridad no era esfuerzo moral propio — era el fruto de años de comunión con Dios en oración."
  },
  {
    key: "d4", badge: "Constancia",
    name: "Tres veces al día, como siempre hacía",
    body: "La frase clave de Daniel 6:10 es «como lo solía hacer antes». No oró tres veces ese día porque era el peor día de su vida — ya lo hacía siempre. La constancia en la oración durante los tiempos de paz fue lo que lo sostuvo cuando el decreto firmó su sentencia de muerte."
  },
];

const POSTURAS = [
  {
    key: "p1", badge: "Rodillas",
    name: "Arrodillado — declaración de sumisión",
    body: "Daniel se arrodillaba al orar (Dn 6:10). Lucas 22:41 muestra a Jesús de rodillas en Getsemaní. Hechos registra a Esteban (7:60), Pedro (9:40) y Pablo (20:36) arrodillados. Arrodillarse es una declaración física de que Dios es soberano y nosotros somos sus criaturas. No es el único modo de orar, pero tiene un peso especial."
  },
  {
    key: "p2", badge: "De pie",
    name: "De pie — oración en el momento",
    body: "Orar de pie era también práctica bíblica común. Salomón oró de pie en la dedicación del templo (2 Cr 20:5-6). Nehemías oró de pie ante el rey en cuestión de segundos (Neh 2:4). Ana oró de pie en el tabernáculo (1 S 1:26). Dios escucha nuestras oraciones en cualquier posición, incluyendo de pie en la cola del supermercado."
  },
  {
    key: "p3", badge: "Sentado",
    name: "Sentado — meditación y contemplación",
    body: "El rey David se sentó delante de Jehová en una de sus oraciones más profundas (2 S 7:18). Orar sentado puede propiciar un espacio de escucha más que de petición — cuando el corazón se aquieta y espera la respuesta de Dios. «Estad quietos, y conoced que yo soy Dios» (Sal 46:10)."
  },
  {
    key: "p4", badge: "En movimiento",
    name: "En silencio — la oración del corazón",
    body: "Eliezer oró silenciosamente junto al pozo de Nacor (Gn 24:12-14). Ana movía los labios sin emitir sonido (1 S 1:12-13). Nehemías oró en segundos antes de responder al rey (Neh 2:4). No hay ningún lugar en la tierra donde Dios no nos vea o no nos escuche (Sal 139:7-12). Podés elevar una oración silenciosa ahora mismo, donde estés."
  },
];

const PADRE_NUESTRO = [
  {
    key: "pn1", tag: "Alabanza",
    phrase: "«Padre nuestro que estás en los cielos, santificado sea tu nombre»",
    body: "Reconocé tu relación personal con el Padre de todos. Acercate a él con reverencia y respeto, reconociendo su santidad. La oración comienza con quién es Dios, no con lo que necesitás."
  },
  {
    key: "pn2", tag: "Anhelo",
    phrase: "«Venga tu reino»",
    body: "Anhelá el regreso de Cristo y pedí que el Espíritu Santo reine en tu corazón hoy. Es una oración de expectativa: que los valores del cielo irrumpan en tu día, en tu familia, en tus decisiones."
  },
  {
    key: "pn3", tag: "Rendición",
    phrase: "«Hágase tu voluntad, como en el cielo, así también en la tierra»",
    body: "Rendite y confiá en que Dios sabe lo que es mejor. En lugar de orar solo por lo que querés, entregá a Dios incluso tus planes más importantes. Jesús mismo dijo: «No busco mi voluntad, sino la voluntad del Padre» (Jn 5:30)."
  },
  {
    key: "pn4", tag: "Necesidad",
    phrase: "«El pan nuestro de cada día, dánoslo hoy»",
    body: "Pedí lo que necesitás para vivir, tanto físicamente (comida, salud, trabajo) como espiritualmente (la Palabra viva, el pan del cielo que es Jesús). Esta petición nos recuerda que dependemos de Dios cada día, no solo en las crisis."
  },
  {
    key: "pn5", tag: "Perdón",
    phrase: "«Perdónanos nuestras deudas, como también nosotros perdonamos»",
    body: "Arrepentite, buscá el perdón de Dios y recordá perdonar a los que te han hecho daño. La misericordia que pedís a Dios es la misma que debés extender a otros. El perdón no es opcional en la vida del que ora."
  },
  {
    key: "pn6", tag: "Protección",
    phrase: "«No nos metas en tentación, mas líbranos del mal»",
    body: "Pedí protección y refugio del mal en este mundo. Reconocé tu vulnerabilidad ante la tentación y pedí que Dios te guíe para evitarla. «El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente» (Sal 91:1)."
  },
  {
    key: "pn7", tag: "Doxología",
    phrase: "«Porque tuyo es el reino, el poder y la gloria por todos los siglos. Amén»",
    body: "Reconocé que todo lo que eres, tenés y hacés pertenece a Dios. Solo él merece gloria y alabanza. La oración termina donde comenzó: en Dios, no en vos. «Tuya es, oh Jehová, la magnificencia y el poder, la gloria» (1 Cr 29:11)."
  },
];

const REFLEXIONES = [
  { q: "¿Qué tipo de responsabilidades y presiones tenía Daniel en su vida profesional? ¿Cómo mantuvo su vida de oración en medio de eso?", ref: "Daniel 6:1-3" },
  { q: "¿Qué excusas ponemos para no tener una vida de oración más constante? ¿Cómo desafía la historia de Daniel esas excusas?", ref: "Daniel 6:4-10" },
  { q: "¿Cómo debemos aplicar el ejemplo de Daniel de orar a lo largo del día? ¿Qué momentos concretos podrías usar?", ref: "Salmo 55:17; 1 Tesalonicenses 5:17" },
  { q: "¿Cuánto dependía Jesús de su conexión con el Padre a través de la oración? ¿Qué dice eso sobre nuestra propia necesidad?", ref: "Lucas 6:12; Marcos 1:35; Marcos 6:46" },
  { q: "¿Qué temas de la oración modelo de Jesús están más ausentes en tus oraciones habituales?", ref: "Mateo 6:9-13" },
  { q: "¿Describirías la oración en tu vida como algo hermoso o como una carga? ¿Qué ha contribuido a tu perspectiva?", ref: "" },
];

// ── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("inicio");
  const [openVerses, setOpenVerses] = useState({});
  const [openExpand, setOpenExpand] = useState({});
  const [openPrayer, setOpenPrayer] = useState({});
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
  const togglePrayer = useCallback(key => setOpenPrayer(p => ({ ...p, [key]: !p[key] })), []);

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
    { id: "daniel",  label: "Daniel",  Icon: Shield },
    { id: "postura", label: "Postura", Icon: Layers },
    { id: "modelo",  label: "Modelo",  Icon: MessageCircle },
    { id: "biblia",  label: "Biblia",  Icon: BookOpen },
    { id: "quiz",    label: "Quiz",    Icon: Search },
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
              InVerso · Semana 6
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Mi vida de <em>oración</em>
            </h1>
            <div className="hero-ref">Daniel 6 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"  && <TabInicio teacherMode={teacherMode} />}
            {tab === "daniel"  && <TabDaniel openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "postura" && <TabPostura openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "modelo"  && <TabModelo openPrayer={openPrayer} togglePrayer={togglePrayer} />}
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

// ── TAB: INICIO ───────────────────────────────────────────────────────────────
function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Mi vida de oración</div>
      <div className="sec-sub">Daniel 6 — El ejemplo de Daniel</div>

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
              <strong style={{ color: "var(--tx)" }}>Daniel</strong> — El fiel Daniel: su carácter, su constancia, su vida de oración<br />
              <strong style={{ color: "var(--tx)" }}>Postura</strong> — La posición al orar y lo que revela nuestro corazón<br />
              <strong style={{ color: "var(--tx)" }}>Modelo</strong> — Jesús nos enseña a orar: los 7 elementos del Padre Nuestro<br />
              <strong style={{ color: "var(--tx)" }}>Biblia</strong> — Los {VERSES.length} versículos de la semana · RVR1960
            </p>
          </div>

          <div className="honey-card">
            <div className="honey-label"><BookOpen size={12} />Texto base · Daniel 6:10</div>
            <div className="honey-text">«...Abiertas las ventanas de su cámara que daban hacia Jerusalén, se arrodillaba tres veces al día, y oraba y daba gracias delante de su Dios, como lo solía hacer antes.»</div>
            <div className="honey-ref">Daniel 6:10 · RVR1960</div>
          </div>

          <div className="egw-wrap">
            <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 11, p. 138</div>
            <div className="egw-text">«<strong>Orar es el acto de abrir nuestro corazón a Dios como a un amigo.</strong> No que sea necesario para dar a conocer a Dios lo que somos, sino para que podamos recibirle a él. La oración no hace descender a Dios hasta nosotros, sino que nos eleva a él.»</div>
          </div>

          <div className="card">
            <div className="card-label">Pregunta para arrancar</div>
            <p>Imaginate que rara vez hablaras con tu mejor amigo o con tu pareja. Muy pronto la relación se rompería. <strong style={{ color: "var(--acc3)" }}>¿La oración ocupa en tu vida el lugar que le corresponde como conversación con tu mejor amigo?</strong></p>
          </div>
        </>
      )}
    </>
  );
}

// ── TAB: DANIEL ───────────────────────────────────────────────────────────────
function TabDaniel({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">El fiel Daniel</div>
      <div className="sec-sub">Un hombre con una conexión sólida con Dios · Daniel 6</div>

      <div className="card">
        <div className="card-label">El contexto</div>
        <p>Daniel era un funcionario de alto rango en el Imperio Babilónico — uno de los hombres más ocupados de su época. Sus rivales lo vigilaban constantemente buscando algo de qué acusarlo. Aun así, su vida de oración nunca cedió. ¿Qué excusas tenemos nosotros que él no tuviera?</p>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>Cuatro características de Daniel</div>

      {DANIEL_RASGOS.map(({ key, badge, name, body }) => (
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
        <div className="egw-source"><BookOpen size={12} />Daniel 2:20-23 — La oración de gratitud de Daniel</div>
        <div className="egw-text">«Sea bendito el nombre de Dios de siglos en siglos, porque suyos son el poder y la sabiduría. Él muda los tiempos y las edades; quita reyes, y pone reyes; da la sabiduría a los sabios [...] A ti, oh Dios de mis padres, te doy gracias y te alabo.» <strong>Esta oración reveló una actitud humilde, una confianza calmada y una fe viva.</strong></div>
      </div>

      <div className="card">
        <div className="card-label">La pregunta del millón</div>
        <p>¿Qué excusas ponemos para no tener una vida de oración más constante? Daniel enfrentó la muerte y siguió orando. Nosotros enfrentamos el cansancio, la pereza y la pantalla del celular. Su ejemplo nos desafía a ser fieles también.</p>
      </div>
    </>
  );
}

// ── TAB: POSTURA ──────────────────────────────────────────────────────────────
function TabPostura({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">La posición al orar</div>
      <div className="sec-sub">Lo externo revela lo interno · Daniel 6:10</div>

      <div className="card">
        <div className="card-label">Dios escucha en cualquier posición</div>
        <p>La Biblia reconoce muchas posiciones válidas para orar — de rodillas, de pie, sentado, acostado, en movimiento. Lo que importa no es la postura del cuerpo sino la postura del corazón. Dicho eso, la posición que elegimos <strong style={{ color: "var(--tx)" }}>sí refleja nuestra actitud de reverencia</strong> y nuestro deseo de rendirnos a Dios.</p>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>Posiciones bíblicas de oración</div>

      {POSTURAS.map(({ key, badge, name, body }) => (
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
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 11, p. 148</div>
        <div className="egw-text">«Podemos mantenernos tan cerca de Dios que, en cualquier prueba inesperada, nuestros pensamientos se vuelvan hacia él <strong>tan naturalmente como la flor se vuelve hacia el sol.</strong>»</div>
      </div>

      <div className="card">
        <div className="card-label">Un desafío para hoy</div>
        <p>Si podés arrodillarte, pero normalmente no lo hacés al orar, ¿por qué no lo probás la próxima vez y observás cómo influye en tu tiempo con Dios? Y a lo largo del día de hoy, ¿dónde y cómo le susurrarás una oración a Jesús?</p>
      </div>
    </>
  );
}

// ── TAB: MODELO ──────────────────────────────────────────────────────────────
function TabModelo({ openPrayer, togglePrayer }) {
  return (
    <>
      <div className="sec-title">Jesús nos enseña a orar</div>
      <div className="sec-sub">Los 7 elementos del Padre Nuestro · Mateo 6:9-13</div>

      <div className="card">
        <div className="card-label">El pedido de los discípulos</div>
        <p>Los discípulos veían a Jesús orar y sabían que era diferente a todo lo que habían escuchado. Después de escucharlo orar, uno de ellos le dijo: <strong style={{ color: "var(--tx)" }}>«Señor, enséñanos a orar»</strong> (Lc 11:1). No le pidieron que repitiera las palabras — le pidieron que los enseñara a tener lo que él tenía.</p>
      </div>

      <div className="card">
        <div className="card-label">Jesús rechazó dos tipos de oración</div>
        <p>Las oraciones ostentosas para ser vistos (Mt 6:5) y las «vanas repeticiones» con palabrería vacía (Mt 6:7). La oración verdadera es <strong style={{ color: "var(--tx)" }}>sincera, sencilla y personal</strong> — una conversación real, no una actuación religiosa.</p>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>Los 7 elementos — tocá para abrir</div>

      {PADRE_NUESTRO.map(({ key, tag, phrase, body }) => (
        <div key={key} className={`prayer-card${openPrayer[key] ? " open" : ""}`} onClick={() => togglePrayer(key)}>
          <div className="prayer-header">
            <span className="prayer-icon">{tag}</span>
            <span className="prayer-phrase">{phrase}</span>
            {openPrayer[key] ? <ChevronUp size={15} color="var(--tx3)" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color="var(--tx3)" style={{ flexShrink: 0 }} />}
          </div>
          {openPrayer[key] && <div className="prayer-body">{body}</div>}
        </div>
      ))}

      <div className="card" style={{ marginTop: ".75rem" }}>
        <div className="card-label">La estructura para tu oración</div>
        <p>Jesús enseñó una estructura simple: <strong style={{ color: "var(--tx)" }}>Alabanza → Rendición → Necesidad → Perdón → Protección → Doxología.</strong> Con demasiada frecuencia nuestras oraciones están llenas de peticiones. Esta semana, probá seguir estos elementos y observá la diferencia.</p>
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
      ? "Excelente. El mismo Dios que sostuvo a Daniel en el foso de los leones escucha tus oraciones hoy."
      : pct >= 50
      ? "Buen intento. Revisá los tabs de Daniel y el Padre Nuestro — hay mucho más para descubrir sobre la oración."
      : "No te desanimes. Abrí Daniel 6, arrodíllate un momento y hablá con Dios como lo hacía Daniel. Es más simple de lo que parece.";
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
            {r.ref && <div className="reflex-ref">{r.ref}</div>}
          </div>
        </div>
      ))}

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 11, pp. 148-149</div>
        <div className="egw-text">«Presenta a Dios tus necesidades, tristezas, gozos, preocupaciones y temores. No puedes incomodarlo ni agobiarlo. <strong>Las relaciones entre Dios y cada alma son tan especiales y únicas como si no hubiera habido otra alma por la que ocuparse</strong> ni por la cual entregar a su Hijo amado.»</div>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} />Para tu vida</div>
        <div className="vida-text">
          Tenés el teléfono siempre encima. Mandás mensajes mientras desayunás, chequeás Instagram antes de levantarte de la cama y escuchás podcasts mientras hacés ejercicio. Estás hiperconectado con todos — menos con Dios.<br /><br />
          Daniel era el segundo hombre más poderoso del Imperio Babilónico. Tenía reuniones de estado, decretos que firmar y rivales que lo vigilaban. Y aun así, tres veces al día se arrodillaba y hablaba con Dios. No lo hizo el día que firmaron su sentencia de muerte — lo hizo <strong>todos los días antes</strong>. Por eso pudo hacerlo ese día también.<br /><br />
          Esta semana, elegí un momento concreto: mañana, mediodía o noche. Buscá un lugar donde nadie te interrumpa. Arrodíllate si podés. Y hablá con Dios no como quien recita una lista de pedidos, sino como quien abre una conversación con alguien que realmente quiere escucharte. La oración no cambia a Dios — <strong>te cambia a vos.</strong>
        </div>
      </div>
    </>
  );
}
