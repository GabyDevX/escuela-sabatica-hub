import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Heart, Shield,
  AlertTriangle, CheckCircle, XCircle, RotateCcw, Users, Eye
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg:#08080f; --bg2:#0c0c18; --bg3:#111120;
  --surf:#161625; --surf2:#1e1e32;
  --brd:#222238; --brd2:#2e2e50;
  --tx:#f0f0fa; --tx2:#b8b8d8; --tx3:#7878a0;
  --acc:#7c6fcd; --acc2:#a090ea; --acc3:#d0c8ff;
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
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#0c0b22 0%,#09091a 55%,#06060f 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(124,111,205,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.85rem;font-weight:700;line-height:1.18;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(124,111,205,.2);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(124,111,205,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(124,111,205,.3) 30%,rgba(124,111,205,.3) 70%,transparent)}

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
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(124,111,205,.08);border-radius:10px;z-index:-1}

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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(124,111,205,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(224,192,112,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}

/* EXPAND */
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(124,111,205,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(124,111,205,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}

/* EGW */
.egw-wrap{background:linear-gradient(135deg,rgba(124,111,205,.07),rgba(124,111,205,.02));border:1px solid rgba(124,111,205,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(124,111,205,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}

/* CONTRAST CARD (fariseo vs publicano) */
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
.guide-banner{background:linear-gradient(135deg,rgba(224,192,112,.10),rgba(224,192,112,.02));border:1px solid rgba(224,192,112,.22);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(224,192,112,.12);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
.guide-banner p{font-size:.9rem;color:var(--tx2);line-height:1.45}
.guide-step{display:flex;gap:.9rem;margin-bottom:.8rem;padding:.9rem 1rem;background:var(--surf);border-radius:12px;border:1px solid var(--brd)}
.guide-time{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--warn);white-space:nowrap;padding-top:.1rem;min-width:58px}
.guide-step-body{flex:1}
.guide-step-title{font-size:.97rem;font-weight:600;color:var(--tx);margin-bottom:.3rem}
.guide-step-desc{font-size:.92rem;line-height:1.55;color:var(--tx2)}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const VERSES = [
  { ref:"Lucas 18:9-14", base:true, text:`9 A unos que confiaban en sí mismos como justos, y menospreciaban a los otros, dijo también esta parábola: 10 Dos hombres subieron al templo a orar: uno era fariseo, y el otro publicano. 11 El fariseo, puesto en pie, oraba consigo mismo de esta manera: Dios, te doy gracias porque no soy como los otros hombres, ladrones, injustos, adúlteros, ni aun como este publicano; 12 ayuno dos veces a la semana, doy diezmos de todo lo que gano. 13 Mas el publicano, estando lejos, no quería ni aun alzar los ojos al cielo, sino que se golpeaba el pecho, diciendo: Dios, sé propicio a mí, pecador. 14 Os digo que éste descendió a su casa justificado antes que el otro; porque cualquiera que se enaltece, será humillado; y el que se humilla, será enaltecido.` },
  { ref:"Lucas 22:24-27", text:`24 Hubo también entre ellos una discusión sobre quién de ellos sería el mayor. 25 Pero él les dijo: Los reyes de las naciones se enseñorean de ellas, y los que sobre ellas tienen autoridad son llamados bienhechores; 26 mas no así vosotros, sino sea el mayor entre vosotros como el más joven, y el que dirige, como el que sirve. 27 Porque, ¿cuál es mayor, el que se sienta a la mesa, o el que sirve? ¿No es el que se sienta a la mesa? Mas yo estoy entre vosotros como el que sirve.` },
  { ref:"Lucas 14:7-11", text:`7 Observando cómo escogían los primeros asientos a la mesa, refirió a los convidados una parábola, diciéndoles: 8 Cuando fueres convidado por alguno a bodas, no te sientes en el primer lugar, no sea que otro más distinguido que tú esté convidado por él, 9 y viniendo el que te convidó a ti y a él, te diga: Da lugar a éste; y entonces comiences con vergüenza a ocupar el último lugar. 10 Mas cuando fueres convidado, ve y siéntate en el último lugar, para que cuando venga el que te convidó, te diga: Amigo, sube más arriba; entonces tendrás gloria delante de los que se sientan contigo a la mesa. 11 Porque cualquiera que se enaltece, será humillado; y el que se humilla, será enaltecido.` },
  { ref:"Filipenses 2:3-8", text:`3 Nada hagáis por contienda o por vanagloria; antes bien con humildad, estimando cada uno a los demás como superiores a él mismo; 4 no mirando cada uno por lo suyo propio, sino cada cual también por lo de los otros. 5 Haya, pues, en vosotros este sentir que hubo también en Cristo Jesús, 6 el cual, siendo en forma de Dios, no estimó el ser igual a Dios como cosa a que aferrarse, 7 sino que se despojó a sí mismo, tomando forma de siervo, hecho semejante a los hombres; 8 y estando en la condición de hombre, se humilló a sí mismo, haciéndose obediente hasta la muerte, y muerte de cruz.` },
  { ref:"1 Pedro 5:5", text:`Igualmente, jóvenes, estad sujetos a los ancianos; y todos, sumisos unos a otros, revestíos de humildad; porque: Dios resiste a los soberbios, y da gracia a los humildes.` },
  { ref:"Santiago 4:6-10", text:`6 Pero él da mayor gracia. Por esto dice: Dios resiste a los soberbios, y da gracia a los humildes. 7 Someteos, pues, a Dios; resistid al diablo, y huirá de vosotros. 8 Acercaos a Dios, y él se acercará a vosotros. Pecadores, limpiad las manos; y vosotros los de doble ánimo, purificad vuestros corazones. 9 Afligíos, y lamentad, y llorad. Vuestra risa se convierta en llanto, y vuestro gozo en tristeza. 10 Humillaos delante del Señor, y él os exaltará.` },
  { ref:"Romanos 3:23", text:`por cuanto todos pecaron, y están destituidos de la gloria de Dios,` },
  { ref:"Romanos 7:24", text:`¡Miserable de mí! ¿quién me librará de este cuerpo de muerte?` },
  { ref:"1 Timoteo 1:15", text:`Palabra fiel y digna de ser recibida por todos: que Cristo Jesús vino al mundo para salvar a los pecadores, de los cuales yo soy el primero.` },
  { ref:"Salmo 25:9", text:`Encaminará a los humildes por el juicio, y enseñará a los mansos su carrera.` },
  { ref:"Salmo 149:4", text:`Porque Jehová tiene contentamiento en su pueblo; hermoseará a los humildes con la salvación.` },
  { ref:"Mateo 23:11-12", text:`11 El que es el mayor de vosotros, sea vuestro siervo. 12 Porque el que se enaltece será humillado, y el que se humilla será enaltecido.` },
  { ref:"Proverbios 29:23", text:`La soberbia del hombre le abate; pero al humilde de espíritu sustenta la honra.` },
  { ref:"Isaías 14:12-14", text:`12 ¡Cómo caíste del cielo, oh Lucero, hijo de la mañana! Cortado fuiste por tierra, tú que debilitabas a las naciones. 13 Tú que decías en tu corazón: Subiré al cielo; en lo alto, junto a las estrellas de Dios, levantaré mi trono, y en el monte del testimonio me sentaré, a los lados del norte; 14 sobre las alturas de las nubes subiré, y seré semejante al Altísimo.` },
  { ref:"1 Juan 2:15-16", text:`15 No améis al mundo, ni las cosas que están en el mundo. Si alguno ama al mundo, el amor del Padre no está en él. 16 Porque todo lo que hay en el mundo, los deseos de la carne, los deseos de los ojos, y la vanagloria de la vida, no proviene del Padre, sino del mundo.` },
  { ref:"Marcos 12:31", text:`Y el segundo es semejante: Amarás a tu prójimo como a ti mismo. No hay otro mandamiento mayor que éstos.` },
  { ref:"Salmo 138", text:`1 Te alabaré con todo mi corazón; delante de los dioses te cantaré salmos. 2 Me postraré hacia tu santo templo, y alabaré tu nombre por tu misericordia y tu fidelidad; porque has engrandecido tu nombre, y tu palabra sobre todas las cosas. 3 El día que clamé, me respondiste; me fortaleciste con vigor en mi alma. 4 Te alabarán, oh Jehová, todos los reyes de la tierra, porque han oído los dichos de tu boca. 5 Y cantarán de los caminos de Jehová, que la gloria de Jehová es grande. 6 Porque Jehová es excelso, y atiende al humilde, mas al altivo mira de lejos. 7 Si anduviere yo en medio de la angustia, tú me vivificarás; contra la ira de mis enemigos extenderás tu mano, y me salvará tu diestra. 8 Jehová cumplirá su propósito en mí; tu misericordia, oh Jehová, es para siempre; no desampares la obra de tus manos.` },
];

const QUIZ_DATA = [
  {
    q: "¿Qué actitud tenía el fariseo al orar en el templo?",
    opts: ["Se golpeaba el pecho con arrepentimiento","Confiaba en sí mismo y menospreciaba a los demás","Pedía dirección a Dios humildemente","Ayunaba en secreto sin decírselo a nadie"],
    ans: 1,
    feedback: "El fariseo «confiaba en sí mismo como justo» y menospreciaba al publicano, comparándose favorablemente con él ante Dios (Lc 18:11)."
  },
  {
    q: "¿Cuál fue la actitud del publicano al orar?",
    opts:["Se paró al frente de todos para ser visto","Agradeció a Dios por sus buenas obras","Se mantuvo lejos, sin alzar los ojos, pidiendo misericordia","Diezmó de todo lo que ganaba"],
    ans: 2,
    feedback: "El publicano «estando lejos, no quería ni aun alzar los ojos al cielo, sino que se golpeaba el pecho» reconociendo su condición pecaminosa (Lc 18:13)."
  },
  {
    q: "¿Cuál fue el veredicto de Jesús sobre los dos hombres?",
    opts:["Ambos fueron justificados por igual","El fariseo fue justificado por sus buenas obras","El publicano descendió justificado, no el fariseo","Jesús no emitió un juicio final"],
    ans: 2,
    feedback: "«Este [el publicano] descendió a su casa justificado antes que el otro» (Lc 18:14). La gracia va al que reconoce su necesidad."
  },
  {
    q: "¿Cuál es el principio que Jesús repite en Lucas 18:14?",
    opts:["El que sirve más será el más grande","El que se enaltece será humillado; el que se humilla será enaltecido","El amor cubre multitud de pecados","Bienaventurado el que ora dos veces por semana"],
    ans: 1,
    feedback: "«Cualquiera que se enaltece, será humillado; y el que se humilla, será enaltecido» — principio del reino al revés que Jesús repite en varios contextos."
  },
  {
    q: "¿Cuál es la actitud bíblica frente al orgullo, según 1 Pedro 5:5?",
    opts:["Dios bendice a los orgullosos que trabajan duro","Dios resiste a los soberbios y da gracia a los humildes","La humildad solo aplica a los líderes de iglesia","El orgullo es necesario para tener autoridad"],
    ans: 1,
    feedback: "«Dios resiste a los soberbios, y da gracia a los humildes» (1 P 5:5). El posicionamiento de Dios respecto al orgullo no puede ser más claro."
  },
  {
    q: "¿Qué ejemplo dio Cristo sobre la humildad en Lucas 22:27?",
    opts:["«El que manda tiene derecho a ser servido»","«El líder debe sentarse en el primer lugar»","«Yo estoy entre vosotros como el que sirve»","«Bienaventurado el que hace el bien en público»"],
    ans: 2,
    feedback: "Jesús, el Señor del universo, se presenta como siervo. Esa es la pauta para el liderazgo cristiano (Lc 22:27)."
  },
  {
    q: "¿De dónde comenzó el orgullo, según las Escrituras?",
    opts:["Del deseo humano de tener más posesiones","De Lucifer, que quiso igualarse a Dios (Is 14:12-14)","De la envidia entre hermanos en el Antiguo Testamento","Del sistema político de las naciones"],
    ans: 1,
    feedback: "«Subiré [...] seré semejante al Altísimo» (Is 14:13-14). El orgullo de Lucifer fue el origen del gran conflicto."
  },
];

const GUIDE_STEPS = [
  { time:"00–05 min", title:"Apertura: El espejo del orgullo", desc:"Pedí que cada uno piense en una persona orgullosa. Luego preguntá: ¿pueden hacer el mismo ejercicio con ustedes mismos? ¿Qué ven?" },
  { time:"05–15 min", title:"La parábola: dos hombres, dos actitudes", desc:"Lee Lucas 18:9-14 en voz alta. Comparad al fariseo y al publicano: ¿Cómo se veían a sí mismos? ¿Cómo veían a los demás? ¿Cuál fue el veredicto de Jesús?" },
  { time:"15–20 min", title:"El problema de los discípulos", desc:"Lee Lucas 22:24-27. Después de años con Jesús, ¿seguían peleando por quién era el mayor? ¿Qué dice eso sobre cuán arraigado puede estar el orgullo?" },
  { time:"20–25 min", title:"El ejemplo supremo: Filipenses 2:3-8", desc:"Leed juntos el himno de la kénosis. ¿Qué renunció Jesús? ¿Cuánto se humilló? ¿Qué nos enseña esto sobre cómo debemos relacionarnos?" },
  { time:"25–28 min", title:"Reflexión personal y oración", desc:"Preguntá: ¿En qué área de tu vida el orgullo te está impidiendo crecer o conectarte con Dios? Terminen en oración conjunta pidiendo un corazón humilde." },
  { time:"28–30 min", title:"Cierre y desafío semanal", desc:"Desafío: Esta semana, identificá un momento diario donde puedas poner a alguien más en primer lugar. Compartan la experiencia la próxima clase." },
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
        return <span key={i} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:".55rem", color:"var(--acc)", verticalAlign:"super", opacity:.8, marginRight:"2px" }}>{part.trim()}</span>;
      }
      return part ? <span key={i}>{part}</span> : null;
    });
  }

  const TABS = [
    { id:"inicio", label:"Inicio", Icon: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id:"parabolа", label:"Parábola", Icon: Users },
    { id:"interpreta", label:"Discípulos", Icon: Eye },
    { id:"biblia", label:"Biblia", Icon: BookOpen },
    { id:"quiz", label:"Quiz", Icon: Shield },
    ...(teacherMode ? [{ id:"guia", label:"Guía", Icon: Star }] : []),
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="scroll-area">
          {/* HERO */}
          <div className="hero" onClick={handleHeroTap}>
            <div className="hero-glow" />
            <div className="hero-brand">
              <span className="hero-dot" />
              InVerso · Semana 3
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Orgullo<br />versus <em>Humildad</em>
            </h1>
            <div className="hero-ref">Lucas 18 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio" && <TabInicio teacherMode={teacherMode} />}
            {tab === "parabolа" && <TabParabola openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "interpreta" && <TabInterpreta />}
            {tab === "biblia" && <TabBiblia openVerses={openVerses} toggle={toggleVerse} renderVerseText={renderVerseText} />}
            {tab === "quiz" && (
              <TabQuiz
                quizIdx={quizIdx} quizSelected={quizSelected}
                quizAnswered={quizAnswered} quizResults={quizResults}
                quizDone={quizDone} score={score}
                selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz}
              />
            )}
            {tab === "guia" && teacherMode && <TabGuia />}
          </div>
        </div>

        {/* NAV */}
        <nav className="nav">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
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
      <div className="sec-title">Orgullo vs Humildad</div>
      <div className="sec-sub">El mundo recompensa el orgullo. El cielo recompensa la humildad.</div>

      <div className="card">
        <div className="card-label">Explorar esta semana</div>
        <p>
          <strong style={{ color:"var(--tx)" }}>Parábola</strong> — El fariseo y el publicano (Lucas 18:9-14)<br />
          <strong style={{ color:"var(--tx)" }}>Discípulos</strong> — El orgullo hasta el final del ministerio de Jesús<br />
          <strong style={{ color:"var(--tx)" }}>Biblia</strong> — Todos los versículos de la semana
        </p>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Palabras de vida del gran Maestro, cap. 13, p. 127</div>
        <div className="egw-text">«Mientras más nos acerquemos a Jesús, y más claramente apreciemos la pureza de su carácter, con mayor claridad discerniremos la excesiva pecaminosidad del pecado, y <strong>menos nos sentiremos inclinados a ensalzarnos a nosotros mismos</strong>.»</div>
      </div>

      <div className="card">
        <div className="card-label">Pregunta introductoria</div>
        <p>Al pensar en la palabra <strong style={{ color:"var(--acc3)" }}>"orgullo"</strong>, ¿en quién pensás primero? La verdadera pregunta es: ¿y yo? Al señalar con el dedo a otros sin querer ver el orgullo en nuestra propia vida, nos autoengañamos.</p>
      </div>

      {teacherMode && (
        <div className="card" style={{ border:"1px solid rgba(224,192,112,.3)", background:"rgba(224,192,112,.04)" }}>
          <div className="card-label" style={{ color:"var(--warn)" }}>💡 Nota para el maestro</div>
          <p>Activá la pestaña <strong style={{ color:"var(--tx)" }}>Guía</strong> para ver el plan completo de 30 minutos con tiempos, preguntas y actividades.</p>
        </div>
      )}
    </>
  );
}

// ── TAB: PARÁBOLA ─────────────────────────────────────────────────────────────
function TabParabola({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">La Parábola</div>
      <div className="sec-sub">Dos hombres van al templo a orar. La diferencia entre ellos lo cambia todo.</div>

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Lucas 18:14</div>
        <div className="egw-text">«Cualquiera que se enaltece, será humillado; y el que se humilla, <strong>será enaltecido</strong>.»</div>
      </div>

      <div className="card-label" style={{ marginBottom:".5rem", paddingLeft:".2rem" }}>Cara a cara: el contraste</div>
      <div className="contrast-wrap">
        <div className="contrast-card bad">
          <div className="contrast-head">El Fariseo</div>
          <div className="contrast-item">Confiaba en su propia justicia</div>
          <div className="contrast-item">Menospreciaba a los demás</div>
          <div className="contrast-item">Oraba para ser visto</div>
          <div className="contrast-item">Creía merecer las bendiciones</div>
        </div>
        <div className="contrast-card good">
          <div className="contrast-head">El Publicano</div>
          <div className="contrast-item">Reconocía su condición pecaminosa</div>
          <div className="contrast-item">No se comparaba con nadie</div>
          <div className="contrast-item">Se mantuvo lejos, cabizbajo</div>
          <div className="contrast-item">Confiaba solo en la misericordia</div>
        </div>
      </div>

      <div className="card-label" style={{ marginBottom:".5rem", paddingLeft:".2rem", marginTop:".5rem" }}>Lo que Jesús enseña aquí</div>

      {[
        { key:"reino", badge:"Principio", name:"Un reino al revés", body:"El que se cree salvado está perdido; el que admite su indignidad está salvado. «Cristo puede salvar únicamente al que reconoce que es pecador» (EGW, Palabras de vida, cap. 13, p. 125)." },
        { key:"gracia", badge:"Gracia", name:"La base de nuestra reputación celestial", body:"No son nuestras buenas obras ni nuestro historial religioso lo que nos justifica ante Dios. Es la gracia recibida con humildad. 1 Juan 1:9 promete perdón al que confiesa." },
        { key:"orgullo", badge:"Advertencia", name:"¿Qué piensa Dios de los orgullosos?", body:"«Dios se opone a los orgullosos, pero ayuda con su bondad a los humildes» (1 Pedro 5:5). No puede estar más claro. El orgullo pone a Dios en nuestra contra." },
        { key:"positivo", badge:"Aclaración", name:"¿Puede el orgullo ser positivo?", body:"Buscar la excelencia y apreciar los dones de Dios no es orgullo. El mandato de \"amar al prójimo como a ti mismo\" (Mc 12:31) implica un amor propio sano, nunca egocéntrico." },
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

      <div className="egw-wrap" style={{ marginTop:"1rem" }}>
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Palabras de vida del gran Maestro, cap. 13, p. 126</div>
        <div className="egw-text">«Hay una sola forma en que podemos obtener un verdadero conocimiento del yo. Debemos <strong>contemplar a Cristo</strong>. La ignorancia de su vida y su carácter induce a los mortales a exaltarse en su propia justicia.»</div>
      </div>
    </>
  );
}

// ── TAB: INTERPRETA ──────────────────────────────────────────────────────────
function TabInterpreta() {
  return (
    <>
      <div className="sec-title">Lecciones difíciles</div>
      <div className="sec-sub">Incluso los más cercanos a Jesús lucharon con el orgullo hasta el final.</div>

      <div className="card">
        <div className="card-label">El problema de los discípulos — Lucas 22:24-27</div>
        <p>Después de años junto al humilde Jesús, los discípulos <strong style={{ color:"var(--tx)" }}>todavía discutían sobre quién era el más grande</strong>. Uno pensaría que lo habrían superado. Pero el orgullo es insidioso: se disfraza de ambición, liderazgo o servicio.</p>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Palabras de vida del gran Maestro, cap. 13, p. 122</div>
        <div className="egw-text">«No hay nada que ofenda tanto a Dios, o que sea tan peligroso para el alma humana, como el orgullo y la suficiencia propia. De todos los pecados es <strong>el más pernicioso, el más incurable</strong>.»</div>
      </div>

      <div className="card">
        <div className="card-label">El ejemplo perfecto — Filipenses 2:5-8</div>
        <p>Jesús, que <em style={{ color:"var(--acc3)" }}>siendo igual a Dios, se despojó a sí mismo</em>, tomando forma de siervo. No fue a la cruz para exaltarse — fue a exaltarnos a nosotros. Se humilló para que nosotros pudiéramos ser enaltecidos.</p>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El deseo de todas las gentes, cap. 48, pp. 411-412</div>
        <div className="egw-text">«El alma sincera y contrita es de gran valor a la vista de Dios. Él pone su señal sobre los hombres, no según su jerarquía ni su riqueza, ni por su grandeza intelectual, sino por su <strong>unión con Cristo</strong>.»</div>
      </div>

      <div className="egw-wrap">
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · Palabras de vida del gran Maestro, cap. 13, p. 127</div>
        <div className="egw-text">«Señor, toma mi corazón; porque yo no puedo dártelo. Es tuyo, mantenlo puro, porque yo no puedo guardarlo por ti. Sálvame a pesar de mi yo, mi yo débil y que no se parece a Cristo.»</div>
      </div>

      <div className="card">
        <div className="card-label">Reflexión — Salmo 138:6</div>
        <p>«Jehová es excelso, y atiende al humilde; mas al altivo mira de lejos.» Dios no está lejos del humilde — está cerca. El orgullo es la mayor distancia entre el alma y Dios.</p>
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
    const pct = Math.round((score / QUIZ_DATA.length) * 100);
    const msg = pct >= 80
      ? "Excelente comprensión de la lección. La humildad que buscamos primero es la de aprender."
      : pct >= 50
      ? "Buen intento. Revisá los versículos y volvé a intentarlo — el crecimiento es el objetivo."
      : "La lección tiene profundidad. No te desanimes — volvé al texto y meditá en él.";
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
              ? <><CheckCircle size={14} style={{ display:"inline", marginRight:"6px", color:"var(--ok)" }} /><strong>Correcto.</strong> {q.feedback}</>
              : <><XCircle size={14} style={{ display:"inline", marginRight:"6px", color:"var(--err)" }} /><strong>Incorrecto.</strong> {q.feedback}</>
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

// ── TAB: GUÍA MAESTRO ────────────────────────────────────────────────────────
function TabGuia() {
  return (
    <>
      <div className="sec-title">Guía del Maestro</div>
      <div className="sec-sub">Plan de clase · 30 minutos · Lucas 18</div>
      <div className="guide-banner">
        <span className="guide-badge">Modo Maestro</span>
        <p>Este plan está diseñado para guiar la clase de Escuela Sabática con preguntas de reflexión activa y participación grupal.</p>
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
      <div className="egw-wrap" style={{ marginTop:"1rem" }}>
        <div className="egw-source"><BookOpen size={12} />Puntos clave para recordar</div>
        <div className="egw-text">
          • El orgullo puede ser el mayor obstáculo en la relación con Dios.<br />
          • La autosuficiencia nos hace dejar de buscar a Dios.<br />
          • <strong>Jesús es el ejemplo supremo de humildad</strong> y el camino para superar el yo.
        </div>
      </div>
    </>
  );
}
