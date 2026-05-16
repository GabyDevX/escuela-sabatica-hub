import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home,
  Heart, Filter, HelpCircle, Search
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg:#0f080a; --bg2:#180c10; --bg3:#221018;
  --surf:#2a1520; --surf2:#36192a;
  --brd:#3e1e2e; --brd2:#5a2a42;
  --tx:#f0e4ea; --tx2:#b08090; --tx3:#705060;
  --acc:#c4607a; --acc2:#d47890; --acc3:#f0b0c0;
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

.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#1a080e 0%,#0f080a 55%,#080508 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(196,96,122,.18) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.85rem;font-weight:700;line-height:1.18;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(196,96,122,.22);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(196,96,122,.04)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(196,96,122,.3) 30%,rgba(196,96,122,.3) 70%,transparent)}

.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}

.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:44px;min-height:56px;padding:.6rem .28rem .5rem;font-size:.46rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.03em;text-transform:uppercase}
.nav button svg{width:19px;height:19px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:14%;right:14%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(196,96,122,.08);border-radius:10px;z-index:-1}

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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(196,96,122,.12);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(245,158,11,.15);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}

.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(196,96,122,.03)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(196,96,122,.14);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}

.egw-wrap{background:linear-gradient(135deg,rgba(196,96,122,.07),rgba(196,96,122,.02));border:1px solid rgba(196,96,122,.18);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(196,96,122,.06);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}

.honey-card{background:linear-gradient(135deg,rgba(196,96,122,.10),rgba(196,96,122,.03));border:1px solid rgba(196,96,122,.22);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
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
.vida-card{background:linear-gradient(135deg,rgba(196,96,122,.10),rgba(196,96,122,.02));border:1.5px solid rgba(196,96,122,.25);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
.vida-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.75rem}
.vida-text{font-size:1rem;line-height:1.72;color:var(--tx2)}
.vida-text strong{color:var(--tx)}

.key-list{list-style:none;padding:0;margin-bottom:.85rem}
.key-list li{display:flex;gap:.7rem;align-items:flex-start;padding:.6rem 0;border-bottom:1px solid var(--brd)}
.key-list li:last-child{border-bottom:none}
.key-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);flex-shrink:0;margin-top:.55rem}
.key-text{font-size:.97rem;line-height:1.6;color:var(--tx2)}
.key-text strong{color:var(--tx)}

.resp-grid{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:.85rem}
.resp-card{background:var(--surf);border:1px solid var(--brd);border-radius:12px;padding:.85rem .9rem}
.resp-num{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);margin-bottom:.35rem}
.resp-title{font-size:.95rem;font-weight:600;color:var(--tx);line-height:1.3;margin-bottom:.3rem}
.resp-desc{font-size:.88rem;line-height:1.5;color:var(--tx2)}
`;

// ── DATOS ────────────────────────────────────────────────────────────────────

const ANA_ITEMS = [
  {
    key: "a1", badge: "Circunstancias",
    name: "Atrapada en una situación imposible",
    body: "Ana vivía en un matrimonio polígamo lleno de rivalidad. Su rival Penina la humillaba año tras año por no tener hijos. La infertilidad en aquella cultura era una marca de vergüenza. Ningún médico ni experto podía ayudarla. Solo Dios podía. Esa conciencia de su propia impotencia la empujó a Dios en lugar de alejarla de él."
  },
  {
    key: "a2", badge: "Oración",
    name: "Oraba con el corazón, no con la boca",
    body: "En el tabernáculo, Ana oraba con tal intensidad que sus labios se movían pero no emitía sonido. El sacerdote Elí pensó que estaba borracha. «Ana hablaba en su corazón» (1 S 1:13). Era una oración profunda, íntima, específica. No repitió frases vacías — derramó su alma ante Dios. Su petición era concreta: un hijo varón."
  },
  {
    key: "a3", badge: "Constancia",
    name: "Año tras año, sin rendirse",
    body: "Mientras que las oraciones de algunas personas se debilitan con el tiempo, las de Ana se fortalecían año tras año. Nunca se rindió. A veces, la espera profundiza nuestro caminar con Dios. Aprendemos a confiar más en él. Las circunstancias desfavorables de Ana la enseñaron a depender de Dios de maneras que muchas personas nunca aprenden."
  },
  {
    key: "a4", badge: "Respuesta",
    name: "Dios respondió en el momento perfecto",
    body: "Dios recordó a Ana y le dio un hijo: Samuel. Al llevarlo al sacerdote Elí, Ana hizo una oración de gratitud que quedó registrada en la Biblia (1 S 2:1-10). Samuel creció para convertirse en uno de los profetas más grandes de Israel (Jer 15:1). Las oraciones de Ana tuvieron un impacto eterno en la historia del pueblo de Dios."
  },
  {
    key: "a5", badge: "Lección",
    name: "Dios ve un panorama mucho más amplio",
    body: "Ana no habría tenido un testimonio tan convincente si Dios hubiera respondido rápido. La tardanza hizo que la respuesta fuera aún más espectacular. Nunca sabemos el verdadero significado de aquello por lo que oramos. Admitir cuán limitada es nuestra perspectiva debería llevarnos a la humildad y a confiar en Dios y en su tiempo."
  },
];

const CONDICIONES = [
  {
    key: "c1", badge: "Voluntad",
    name: "Busca la voluntad de Dios, no la tuya",
    body: "«Hágase tu voluntad» (Mt 6:10). La oración no es una transacción donde le damos a Dios nuestros planes y esperamos que él nos dé lo que queremos. Es el momento en que le entregamos nuestra voluntad y aceptamos sus planes. «Si pedimos alguna cosa conforme a su voluntad, él nos oye» (1 Jn 5:14)."
  },
  {
    key: "c2", badge: "Motivos",
    name: "Examina tus motivos",
    body: "«Pedís, y no recibís, porque pedís mal, para gastar en vuestros deleites» (Stg 4:3). «Todos los caminos del hombre son limpios en su propia opinión; pero Jehová pesa los espíritus» (Prov 16:2). Antes de llevar una petición a Dios, vale la pena preguntarse: ¿Esto me acerca más a él? ¿O solo satisface mi ego?"
  },
  {
    key: "c3", badge: "Pecado",
    name: "Suelta el pecado que estás albergando",
    body: "«Si en mi corazón hubiese yo mirado a la iniquidad, el Señor no me habría escuchado» (Sal 66:18). «Vuestros pecados han hecho ocultar de vosotros su rostro para no oír» (Is 59:2). El pecado voluntario y no confesado crea una barrera. No porque Dios se aleje, sino porque nosotros nos alejamos."
  },
  {
    key: "c4", badge: "Permanencia",
    name: "Permanece en Dios y en su Palabra",
    body: "«Si permanecéis en mí, y mis palabras permanecen en vosotros, pedid todo lo que queréis, y os será hecho» (Jn 15:7). La oración eficaz no está desconectada del estudio de la Biblia. «El que aparta su oído para no oír la ley, su oración también es abominable» (Prov 28:9)."
  },
  {
    key: "c5", badge: "Fe",
    name: "Ora con fe genuina",
    body: "«Sin fe es imposible agradar a Dios» (He 11:6). «El que duda es semejante a la onda del mar» (Stg 1:6). La fe no es certeza de que Dios hará exactamente lo que pedimos — es confianza en que él sabe lo que es mejor y que actúa por amor. «Todo lo que pidiereis orando, creed que lo recibiréis, y os vendrá» (Mr 11:24)."
  },
  {
    key: "c6", badge: "Humildad",
    name: "Acércate con corazón humilde",
    body: "«Dios resiste a los soberbios, y da gracia a los humildes» (Stg 4:6). «Humillaos, pues, bajo la poderosa mano de Dios, para que él os exalte cuando fuere tiempo» (1 P 5:6). La autosuficiencia es uno de los mayores obstáculos para la oración. Si realmente supiéramos cuánto necesitamos a Dios, acudiríamos a él mucho más."
  },
  {
    key: "c7", badge: "Perseverancia",
    name: "Persevera sin desmayar",
    body: "Jesús contó la parábola de la viuda persistente «sobre la necesidad de orar siempre, y no desmayar» (Lc 18:1). Ana lo ilustra con su vida. La tardanza no es abandono — a veces es preparación. «¿Y acaso Dios no hará justicia a sus escogidos, que claman a él día y noche?» (Lc 18:7)."
  },
  {
    key: "c8", badge: "Perdón",
    name: "Perdona a los demás primero",
    body: "«Cuando estéis orando, perdonad, si tenéis algo contra alguno, para que también vuestro Padre [...] os perdone a vosotros» (Mr 11:25). El no perdonar cierra la puerta de la oración. La misericordia que pedimos a Dios es la misma que debemos extender a quienes nos hirieron."
  },
];

const PREGUNTAS = [
  {
    key: "p1", badge: "¿Por qué?",
    name: "¿Por qué orar si Dios ya lo sabe todo?",
    body: "Elena G. de White responde: «No es que se necesite esto para darle a conocer a Dios lo que somos, sino a fin de capacitarnos para recibirlo. La oración no baja a Dios hacia nosotros, sino que nos eleva hacia él» (El camino a Cristo, cap. 11, p. 138). La oración es buena para nosotros. Nos invita a hacer una pausa y reconocer que Dios es soberano. Además, el Espíritu Santo intercede por nosotros cuando no sabemos cómo orar (Ro 8:26-27)."
  },
  {
    key: "p2", badge: "Bonanza",
    name: "¿Por qué orar cuando todo va bien?",
    body: "La autosuficiencia y el orgullo son los mayores obstáculos para la oración. Si los ángeles perfectos adoran a Dios continuamente, ¿cómo podemos nosotros, seres humanos pecadores, pensar que lo necesitamos menos? La dependencia de Dios no es solo para los tiempos difíciles — es la postura correcta siempre. La oración en tiempos de abundancia es donde se forma el carácter para los tiempos de crisis."
  },
  {
    key: "p3", badge: "Fe",
    name: "¿Cuál es el papel de la fe en la oración?",
    body: "«La oración y la fe están íntimamente ligadas y necesitan ser tomadas en cuenta juntas. En la oración de fe hay una ciencia divina» (Elena G. de White, La educación, cap. 30, pp. 232-233). La duda nos impide recibir las respuestas de Dios. Debemos acudir a él creyendo que es capaz de darnos cosas buenas y que tiene la sabiduría para hacer lo correcto (He 11:6)."
  },
  {
    key: "p4", badge: "¿Con quién?",
    name: "¿Con quién debo orar?",
    body: "Hay tres círculos. Primero: en privado (solo Dios y tú), porque la oración y el estudio de la Biblia son el alma de tu relación personal con él (Mt 6:6). Segundo: con tu familia y en grupos pequeños (Hch 12:12), porque «donde están dos o tres congregados en mi nombre, allí estoy yo» (Mt 18:20). Tercero: con tus hermanos de iglesia (Stg 5:13-16). Todas estas formas son importantes."
  },
  {
    key: "p5", badge: "Escuchar",
    name: "¿Cómo debo escuchar?",
    body: "Orar es más que hablar con Dios — también debemos permitirle que nos hable. La forma más clara y segura de escucharle es leyendo la Biblia y combinando la oración y el estudio bíblico en nuestro tiempo devocional. Hay que tener cuidado de no vaciar la mente ni de escuchar nuestros propios pensamientos en lugar de la Palabra. No toda voz interna es de Dios."
  },
  {
    key: "p6", badge: "Temas",
    name: "¿En qué temas deben centrarse nuestras oraciones?",
    body: "La Biblia indica temas amplios: alabar a Dios (1 Cr 29:11), confesar pecados (Sal 32:5; 51:10-13), pedir el Espíritu Santo (Lc 11:13), interceder por otros (1 Ti 2:1-4), pedir dirección y fortaleza (Ef 6:18-20; Fil 4:6), crecer en conocimiento de Dios (Col 1:9), y someter los planes propios a su voluntad (Stg 4:15). Una oración equilibrada cubre más que solo peticiones personales."
  },
];

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida: ¿Cuánto tiempo llevas esperando?", desc: "Preguntá: ¿Hay algo que llevas orando por meses o años? ¿Cómo te sientes al respecto? Después de escuchar 2-3 respuestas, introducí la historia de Ana como alguien que también esperó — y creció en esa espera." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos. Orar pidiendo que Dios abra los corazones para ver la oración no como una lista de pedidos sino como una relación con alguien que los conoce y los ama." },
  { time: "05–11 min", title: "Tab Ana — La historia de Ana", desc: "Recorrer las 5 etapas de la historia de Ana. Énfasis en que Ana no oró mejor bajo presión porque tenía gran fe — sino porque ya practicaba la fe antes. La persistencia forjó su confianza en Dios. Preguntar: ¿Cuándo tu fe se fortaleció en la espera, y cuándo se debilitó?" },
  { time: "11–17 min", title: "Tab Condiciones — ¿Qué impide que Dios responda?", desc: "Recorrer las 8 condiciones. Enfocarse en las que más resuenan con el grupo: voluntad de Dios, motivos, pecado, y perdón. No predicar — invitar a la autoevaluación. Preguntar: De esta lista, ¿cuál es la más difícil para vos personalmente?" },
  { time: "17–22 min", title: "Tab Preguntas — Dudas comunes sobre la oración", desc: "Explorar 2-3 de las 6 preguntas según lo que surja en el grupo. La pregunta sobre por qué orar si Dios ya lo sabe todo es especialmente buena para arrancar conversación. La pregunta sobre escuchar suele generar reflexión profunda." },
  { time: "22–27 min", title: "Quiz interactivo", desc: "Hacer las 8 preguntas en conjunto. Pausar en la pregunta 4 (4 maneras en que Dios responde) — es la más práctica para aplicar a situaciones reales del grupo." },
  { time: "27–30 min", title: "Reflexión y cierre", desc: "Usar las preguntas del tab Cierre. Enfocarse en la reflexión personal final: ¿Hay algo concreto que querés cambiar en tu vida de oración? Cerrar con el texto Para tu vida. Oración final a cargo del maestro." },
];

const QUIZ_DATA = [
  {
    q: "¿Cómo oraba Ana en el tabernáculo de Silo, según 1 Samuel 1:12-13?",
    opts: ["En voz alta, postrada en el suelo", "Con los labios moviéndose pero sin emitir sonido", "Cantando salmos junto al altar", "En silencio total, completamente inmóvil"],
    ans: 1,
    feedback: "«Ana hablaba en su corazón, y solamente se movían sus labios, y su voz no se oía» (1 S 1:13). Era una oración profunda y silenciosa desde el corazón. El sacerdote Elí la confundió con una persona ebria — tal era la intensidad de su oración."
  },
  {
    q: "¿Quién confundió la oración silenciosa de Ana con embriaguez?",
    opts: ["Su marido Elcana", "Su rival Penina", "El sacerdote Elí", "El profeta Gad"],
    ans: 2,
    feedback: "«Elí estaba observando la boca de ella» y «la tuvo por ebria» (1 S 1:12-13). Esto muestra que una oración genuinamente profunda puede parecer extraña para quienes la observan desde afuera. Dios, en cambio, escucha el corazón."
  },
  {
    q: "¿Qué prometió Ana a Dios si le concedía un hijo varón?",
    opts: ["Que iría a Jerusalén cada año a ofrecer sacrificios", "Que daría la mitad de sus bienes al templo", "Que dedicaría al niño a Jehová todos los días de su vida", "Que ayunaría tres veces por semana toda su vida"],
    ans: 2,
    feedback: "«Yo lo dedicaré a Jehová todos los días de su vida, y no pasará navaja sobre su cabeza» (1 S 1:11). Ana no solo pidió algo para sí misma — lo que pediría lo pondría en manos de Dios. Su voto transformó su petición personal en un acto de consagración."
  },
  {
    q: "¿Cuántas maneras menciona la lección en que Dios puede responder una oración?",
    opts: ["Dos: sí o no", "Tres: inmediata, diferida o negativa", "Cuatro: inmediata, diferida, inesperada o negativa", "Cinco, según el nivel de fe del creyente"],
    ans: 2,
    feedback: "La lección señala que Dios puede: (1) conceder la petición de inmediato, (2) retrasar su respuesta hasta el momento adecuado, (3) responder de una manera inesperada que no reconocemos de inmediato, o (4) no darnos lo que pedimos porque sabe que no es lo mejor. Cada una es una forma válida de respuesta."
  },
  {
    q: "Según Jeremías 15:1, ¿junto a quién se menciona a Samuel como gran intercesor?",
    opts: ["Elías y Eliseo", "Moisés", "Abraham e Isaac", "David y Salomón"],
    ans: 1,
    feedback: "«Si Moisés y Samuel se pusieran delante de mí...» (Jer 15:1). Samuel es mencionado junto a Moisés como uno de los intercesores más grandes de Israel. Las oraciones de Ana por un hijo tuvieron un impacto eterno en la historia de toda una nación."
  },
  {
    q: "Según el Salmo 62:8, ¿qué es Dios para nosotros cuando derramamos nuestro corazón en oración?",
    opts: ["Nuestro Pastor y Guía", "Nuestro Padre y Creador", "Nuestro Refugio", "Nuestro Rey y Señor"],
    ans: 2,
    feedback: "«Derramad delante de él vuestro corazón. Dios es nuestro refugio» (Sal 62:8). La imagen del refugio es poderosa: un lugar seguro al que corremos. No un juez que nos califica, sino un amparo que nos recibe."
  },
  {
    q: "¿Cuál es el principal obstáculo para la oración según la sección de preguntas frecuentes?",
    opts: ["La distracción y el entretenimiento", "La autosuficiencia y el orgullo", "La falta de tiempo y espacio tranquilo", "La dificultad para concentrarse"],
    ans: 1,
    feedback: "«La autosuficiencia y el orgullo pueden ser los mayores obstáculos para una vida de oración. Si nos diéramos cuenta de cuánto necesitamos a Dios, ¡acudiríamos a él mucho más!» Si los ángeles perfectos lo adoran, nosotros — seres humanos pecadores — necesitamos orar aún más."
  },
  {
    q: "¿Qué dijo Elena G. de White sobre la relación entre oración y Dios?",
    opts: ["Que la oración es el deber más importante de un cristiano", "Que la oración hace descender a Dios hasta nosotros", "Que la oración no baja a Dios hacia nosotros, sino que nos eleva a él", "Que la oración es una conversación del alma con los ángeles"],
    ans: 2,
    feedback: "«La oración no baja a Dios hacia nosotros, sino que nos eleva hacia él» (El camino a Cristo, cap. 11, p. 138). La oración no es una palanca para mover a Dios — es el canal que nos transforma a nosotros. Cambia nuestra perspectiva, no la de Dios."
  },
];

const REFLEXIONES = [
  { q: "¿Qué desafíos enfrentó Ana? ¿Cómo se sentía en medio de ellos, y qué la impidió alejarse de Dios?", ref: "1 Samuel 1:1-8" },
  { q: "Después de años de decepción, Ana oraba de forma más intensa, no menos. ¿Qué dice eso sobre cómo respondemos nosotros a las dificultades espirituales?", ref: "1 Samuel 1:9-18" },
  { q: "¿Por qué es importante buscar la voluntad de Dios al orar, en lugar de solo pedir lo que nosotros queremos?", ref: "Mateo 6:10; 1 Juan 5:14-15" },
  { q: "De las condiciones para la oración eficaz (voluntad, motivos, pecado, fe, humildad, perdón), ¿cuál te resulta más difícil de aplicar? ¿Por qué?", ref: "Salmo 66:18; Hebreos 11:6; Santiago 4:6" },
  { q: "¿Cómo podemos perseverar en la oración cuando no recibimos respuesta inmediata? ¿Qué hace que la espera sea formativa en lugar de destructiva?", ref: "Lucas 18:1-8; Romanos 8:28" },
  { q: "¿Hay algo concreto que te gustaría cambiar en tu vida de oración? ¿Por qué no empezar esos cambios hoy mismo?", ref: "" },
];

const VERSES = [
  {
    ref: "1 Samuel 1:8-11", base: true,
    text: `8 Y Elcana su marido le dijo: Ana, ¿por qué lloras? ¿Por qué no comes? ¿Por qué está afligido tu corazón? ¿No te soy yo mejor que diez hijos? 9 Y se levantó Ana después que hubo comido y bebido en Silo; y mientras el sacerdote Elí estaba sentado en una silla junto a un pilar del templo de Jehová, 10 ella con amargura de alma oró a Jehová, y lloró abundantemente. 11 E hizo voto, diciendo: Jehová de los ejércitos, si te dignares mirar a la aflicción de tu sierva, y te acordares de mí, y no te olvidares de tu sierva, sino que dieres a tu sierva un hijo varón, yo lo dedicaré a Jehová todos los días de su vida, y no pasará navaja sobre su cabeza.`
  },
  {
    ref: "1 Samuel 1:1-7",
    text: `1 Hubo un varón de Ramataim de Zofim, del monte de Efraín, que se llamaba Elcana hijo de Jeroham, hijo de Eliú, hijo de Tohu, hijo de Zuf, efrateo. 2 Y tenía él dos mujeres; el nombre de una era Ana, y el de la otra, Penina. Y Penina tenía hijos, mas Ana no los tenía. 3 Y todos los años aquel varón subía de su ciudad para adorar y para ofrecer sacrificios a Jehová de los ejércitos en Silo. 4 Y cuando llegaba el día en que Elcana ofrecía, daba a Penina su mujer, a todos sus hijos e hijas, sus porciones; 5 pero a Ana daba una parte escogida; porque amaba a Ana, aunque Jehová no le había concedido tener hijos. 6 Y su rival la irritaba, enojándola y entristeciéndola, porque Jehová no le había dado hijos. 7 Así hacía cada año; cuando subía a la casa de Jehová, la irritaba así; por lo cual Ana lloraba, y no comía.`
  },
  {
    ref: "1 Samuel 1:9-18",
    text: `9 Y se levantó Ana después que hubo comido y bebido en Silo; y mientras el sacerdote Elí estaba sentado en una silla junto a un pilar del templo de Jehová, 10 ella con amargura de alma oró a Jehová, y lloró abundantemente. 11 E hizo voto, diciendo: Jehová de los ejércitos, si te dignares mirar a la aflicción de tu sierva, y te acordares de mí, y no te olvidares de tu sierva, sino que dieres a tu sierva un hijo varón, yo lo dedicaré a Jehová todos los días de su vida, y no pasará navaja sobre su cabeza. 12 Aconteció que mientras ella oraba largamente delante de Jehová, que Elí estaba observando la boca de ella. 13 Pero Ana hablaba en su corazón, y solamente se movían sus labios, y su voz no se oía; y Elí la tuvo por ebria. 14 Entonces le dijo Elí: ¿Hasta cuándo estarás borracha? Digiere tu vino. 15 Y Ana le respondió diciendo: No, señor mío; yo soy una mujer atribulada de espíritu; no he bebido vino ni sidra, sino que he derramado mi alma delante de Jehová. 16 No tengas a tu sierva por una mujer impía; porque por la magnitud de mis congojas y de mi aflicción he hablado hasta ahora. 17 Elí respondió y dijo: Ve en paz, y el Dios de Israel te otorgue la petición que le has hecho. 18 Y ella dijo: Halle tu sierva gracia delante de tus ojos. Y se fue la mujer por su camino, y comió, y no estuvo más triste.`
  },
  {
    ref: "1 Samuel 1:19-20",
    text: `19 Y levantándose de mañana, adoraron delante de Jehová, y volvieron y fueron a su casa en Ramá. Y Elcana se llegó a Ana su mujer, y Jehová se acordó de ella. 20 Aconteció que al cumplirse el tiempo, después de haber concebido Ana, dio a luz un hijo, y le puso por nombre Samuel, diciendo: Por cuanto lo pedí a Jehová.`
  },
  {
    ref: "1 Samuel 2:1-10",
    text: `1 Y Ana oró y dijo: Mi corazón se regocija en Jehová, mi poder se exalta en Jehová; mi boca se ensanchó sobre mis enemigos, por cuanto me alegré en tu salvación. 2 No hay santo como Jehová; porque no hay ninguno fuera de ti, y no hay refugio como el Dios nuestro. 3 No multipliquéis palabras de grandeza y altanería; cesen las palabras arrogantes de vuestra boca; porque el Dios de todo saber es Jehová, y a él toca el pesar las acciones. 4 Los arcos de los fuertes fueron quebrados, y los débiles se ciñeron de poder. 5 Los saciados se alquilaron por pan, y los hambrientos dejaron de tener hambre; hasta la estéril dio a luz siete, y la que tenía muchos hijos languidece. 6 Jehová mata, y él da vida; él hace descender al Seol, y hace subir. 7 Jehová empobrece, y él enriquece; abate, y enaltece. 8 Él levanta del polvo al pobre, y del muladar exalta al menesteroso, para hacerle sentarse con príncipes y heredar un sitio de honor. Porque de Jehová son las columnas de la tierra, y él afirmó sobre ellas el mundo. 9 Él guarda los pies de sus santos, mas los impíos perecen en tinieblas; porque nadie será fuerte por su propia fuerza. 10 Delante de Jehová serán quebrantados sus adversarios, y sobre ellos tronará desde los cielos; Jehová juzgará los confines de la tierra, dará poder a su Rey, y exaltará el poderío de su Ungido.`
  },
  {
    ref: "Jeremías 15:1",
    text: `Me dijo Jehová: Si Moisés y Samuel se pusieran delante de mí, mi voluntad no estaría con este pueblo; échalos de mi presencia, y salgan.`
  },
  {
    ref: "1 Crónicas 17:1-4",
    text: `1 Cuando ya David habitaba en su casa, dijo David al profeta Natán: He aquí yo habito en casa de cedros, y el arca del pacto de Jehová está debajo de cortinas. 2 Y Natán dijo a David: Haz todo lo que está en tu corazón, porque Dios está contigo. 3 Y aconteció aquella noche, que vino palabra de Dios a Natán, diciendo: 4 Ve y di a David mi siervo: Así ha dicho Jehová: Tú no me edificarás casa en que habite.`
  },
  {
    ref: "Mateo 26:39-44",
    text: `39 Yendo un poco más adelante, se postró sobre su rostro, orando y diciendo: Padre mío, si es posible, pase de mí esta copa; pero no sea como yo quiero, sino como tú. 40 Vino luego a sus discípulos, y los halló durmiendo, y dijo a Pedro: ¿Así que no habéis podido velar conmigo una hora? 41 Velad y orad, para que no entréis en tentación; el espíritu a la verdad está dispuesto, pero la carne es débil. 42 Fue por segunda vez, y oró diciendo: Padre mío, si no puede pasar de mí esta copa sin que yo la beba, hágase tu voluntad. 43 Vino otra vez y los halló durmiendo, porque los ojos de ellos estaban cargados de sueño. 44 Y dejándolos, se fue de nuevo, y oró por tercera vez, diciendo las mismas palabras.`
  },
  {
    ref: "2 Corintios 12:7-10",
    text: `7 Y para que la grandeza de las revelaciones no me exaltase desmedidamente, me fue dado un aguijón en mi carne, un mensajero de Satanás que me abofetee, para que no me enaltezca sobremanera; 8 respecto a lo cual tres veces he rogado al Señor, que lo quite de mí. 9 Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad. Por tanto, de buena gana me gloriaré más bien en mis debilidades, para que repose sobre mí el poder de Cristo. 10 Por lo cual, por amor a Cristo me gozo en las debilidades, en afrentas, en necesidades, en persecuciones, en angustias; porque cuando soy débil, entonces soy fuerte.`
  },
  {
    ref: "Salmo 22:1-2",
    text: `1 Dios mío, Dios mío, ¿por qué me has desamparado? ¿Por qué estás tan lejos de mi salvación, y de las palabras de mi clamor? 2 Dios mío, clamo de día, y no respondes; y de noche, y no hay para mí reposo.`
  },
  {
    ref: "Mateo 7:7",
    text: `Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.`
  },
  {
    ref: "1 Juan 5:14-15",
    text: `14 Y esta es la confianza que tenemos en él, que si pedimos alguna cosa conforme a su voluntad, él nos oye. 15 Y si sabemos que él nos oye en cualquiera cosa que pidamos, sabemos que tenemos las peticiones que le hemos hecho.`
  },
  {
    ref: "Salmo 62:8",
    text: `Esperad en él en todo tiempo, oh pueblos; derramad delante de él vuestro corazón. Dios es nuestro refugio.`
  },
  {
    ref: "Mateo 6:10",
    text: `Venga tu reino. Hágase tu voluntad, como en el cielo, así también en la tierra.`
  },
  {
    ref: "Proverbios 16:2",
    text: `Todos los caminos del hombre son limpios en su propia opinión; pero Jehová pesa los espíritus.`
  },
  {
    ref: "Santiago 4:3",
    text: `Pedís, y no recibís, porque pedís mal, para gastar en vuestros deleites.`
  },
  {
    ref: "Salmo 66:18",
    text: `Si en mi corazón hubiese yo mirado a la iniquidad, el Señor no me habría escuchado.`
  },
  {
    ref: "Proverbios 15:29",
    text: `Jehová está lejos de los impíos; pero él oye la oración de los justos.`
  },
  {
    ref: "Isaías 59:2",
    text: `Pero vuestras iniquidades han hecho división entre vosotros y vuestro Dios, y vuestros pecados han hecho ocultar de vosotros su rostro para no oír.`
  },
  {
    ref: "Juan 15:7",
    text: `Si permanecéis en mí, y mis palabras permanecen en vosotros, pedid todo lo que queréis, y os será hecho.`
  },
  {
    ref: "Proverbios 28:9",
    text: `El que aparta su oído para no oír la ley, su oración también es abominable.`
  },
  {
    ref: "Hebreos 11:6",
    text: `Pero sin fe es imposible agradar a Dios; porque es necesario que el que se acerca a Dios crea que le hay, y que es galardonador de los que le buscan.`
  },
  {
    ref: "Santiago 1:6",
    text: `Pero pida con fe, no dudando nada; porque el que duda es semejante a la onda del mar, que es arrastrada por el viento y echada de una parte a otra.`
  },
  {
    ref: "Marcos 11:24",
    text: `Por tanto, os digo que todo lo que pidiereis orando, creed que lo recibiréis, y os vendrá.`
  },
  {
    ref: "Mateo 21:22",
    text: `Y todo lo que pidiereis en oración, creyendo, lo recibiréis.`
  },
  {
    ref: "Santiago 4:6",
    text: `Pero él da mayor gracia. Por esto dice: Dios resiste a los soberbios, y da gracia a los humildes.`
  },
  {
    ref: "1 Pedro 5:6",
    text: `Humillaos, pues, bajo la poderosa mano de Dios, para que él os exalte cuando fuere tiempo.`
  },
  {
    ref: "Lucas 18:1-8",
    text: `1 También les refirió Jesús una parábola sobre la necesidad de orar siempre, y no desmayar, 2 diciendo: Había en una ciudad un juez, que ni temía a Dios, ni respetaba a hombre. 3 Había también en aquella ciudad una viuda, la cual venía a él, diciendo: Hazme justicia de mi adversario. 4 Y él no quiso por algún tiempo; pero después de esto dijo dentro de sí: Aunque ni temo a Dios, ni tengo respeto a hombre, 5 sin embargo, porque esta viuda me es molesta, le haré justicia, no sea que viniendo de continuo, me agote la paciencia. 6 Y dijo el Señor: Oíd lo que dijo el juez injusto. 7 ¿Y acaso Dios no hará justicia a sus escogidos, que claman a él día y noche? ¿Se tardará en responderles? 8 Os digo que pronto les hará justicia. Pero cuando venga el Hijo del Hombre, ¿hallará fe en la tierra?`
  },
  {
    ref: "Marcos 11:25-26",
    text: `25 Y cuando estéis orando, perdonad, si tenéis algo contra alguno, para que también vuestro Padre que está en los cielos os perdone a vosotros vuestras ofensas. 26 Porque si vosotros no perdonáis, tampoco vuestro Padre que está en los cielos os perdonará vuestras ofensas.`
  },
  {
    ref: "Romanos 8:28",
    text: `Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.`
  },
  {
    ref: "Efesios 3:20",
    text: `Y a Aquel que es poderoso para hacer todas las cosas mucho más abundantemente de lo que pedimos o entendemos, según el poder que actúa en nosotros.`
  },
  {
    ref: "Jeremías 29:11-13",
    text: `11 Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis. 12 Entonces me invocaréis, y vendréis y oraréis a mí, y yo os oiré; 13 y me buscaréis y me hallaréis, porque me buscaréis de todo vuestro corazón.`
  },
  {
    ref: "Esdras 10:1",
    text: `Mientras oraba Esdras y hacía confesión, llorando y postrándose delante de la casa de Dios, se juntó a él una muy grande multitud de Israel, hombres y mujeres y niños; y lloraba el pueblo amargamente.`
  },
  {
    ref: "Nehemías 1:4-11",
    text: `4 Cuando oí estas palabras me senté y lloré, e hice duelo por algunos días, y ayuné y oré delante del Dios de los cielos. 5 Y dije: Te ruego, oh Jehová, Dios de los cielos, fuerte, grande y temible, que guardas el pacto y la misericordia a los que te aman y guardan tus mandamientos; 6 esté ahora atento tu oído y abiertos tus ojos para oír la oración de tu siervo, que hago ahora delante de ti día y noche, por los hijos de Israel tus siervos; y confieso los pecados de los hijos de Israel que hemos cometido contra ti; sí, yo y la casa de mi padre hemos pecado. 7 En extremo nos hemos corrompido contra ti, y no hemos guardado los mandamientos, estatutos y preceptos que mandaste a tu siervo Moisés. 8 Acuérdate ahora de la palabra que mandaste a tu siervo Moisés, diciendo: Si vosotros pecareis, yo os dispersaré por los pueblos; 9 pero si os volviereis a mí, y guardareis mis mandamientos, y los pusiereis por obra, aunque vuestra dispersión fuere hasta el extremo de los cielos, de allí os recogeré, y os traeré al lugar que escogí para hacer habitar allí mi nombre. 10 Ellos, pues, son tus siervos y tu pueblo, los cuales redimiste con tu gran poder, y con tu mano poderosa. 11 Te ruego, oh Jehová, esté ahora atento tu oído a la oración de tu siervo, y a la oración de tus siervos, quienes desean reverenciarte; y concede hoy el éxito a tu siervo, y dale gracia delante de aquel varón. Porque yo servía de copero al rey.`
  },
  {
    ref: "2 Reyes 13:4",
    text: `Mas Joacaz oró en presencia de Jehová, y Jehová lo escuchó; porque miró la aflicción de Israel, pues el rey de Siria los angustiaba.`
  },
  {
    ref: "2 Reyes 19:14-19",
    text: `14 Y tomó Ezequías las cartas de mano de los embajadores, y las leyó; y subió a la casa de Jehová, y las extendió Ezequías delante de Jehová. 15 Y oró Ezequías delante de Jehová, diciendo: Jehová Dios de Israel, que moras entre los querubines, sólo tú eres Dios de todos los reinos de la tierra; tú hiciste el cielo y la tierra. 16 Inclina, oh Jehová, tu oído, y oye; abre, oh Jehová, tus ojos, y mira; y oye las palabras de Senaquerib, que ha enviado a blasfemar al Dios viviente. 17 Es verdad, oh Jehová, que los reyes de Asiria han destruido las naciones y sus tierras; 18 y que pusieron en el fuego a sus dioses, por cuanto ellos no eran dioses, sino obra de manos de hombres, madera y piedra, y así los destruyeron. 19 Ahora, pues, oh Jehová Dios nuestro, sálvanos de su mano, para que sepan todos los reinos de la tierra que sólo tú, Jehová, eres Dios.`
  },
  {
    ref: "1 Reyes 3:6-9",
    text: `6 Y Salomón dijo: Tú hiciste gran misericordia a tu siervo David mi padre, porque él anduvo delante de ti en verdad, en justicia, y con rectitud de corazón para contigo; y tú le has reservado esta tu gran misericordia, que le diste un hijo que se sentase en su trono, como sucede en este día. 7 Y ahora, Jehová Dios mío, tú me has puesto a mí tu siervo por rey en lugar de David mi padre; y yo soy un muchacho pequeño, que no sé cómo entrar ni salir. 8 Y tu siervo está en medio de tu pueblo al cual tú escogiste; un pueblo grande, que no se puede contar ni numerar por su multitud. 9 Da, pues, a tu siervo corazón entendido para juzgar a tu pueblo, y para discernir entre lo bueno y lo malo; porque ¿quién podrá gobernar este tu pueblo tan grande?`
  },
  {
    ref: "Jeremías 32:16-25",
    text: `16 Y después que entregué la carta de compra a Baruc hijo de Nerías, oré a Jehová, diciendo: 17 ¡Oh Señor Jehová! He aquí que tú hiciste el cielo y la tierra con tu gran poder, y con tu brazo extendido, ni hay nada que sea difícil para ti; 18 que haces misericordia a millares, y castigas la maldad de los padres en sus hijos después de ellos; Dios grande, poderoso, Jehová de los ejércitos es su nombre; 19 grande en consejo, y magnífico en hechos; porque tus ojos están abiertos sobre todos los caminos de los hijos de los hombres, para dar a cada uno según sus caminos, y según el fruto de sus obras. 20 Que pusiste señales y portentos en tierra de Egipto hasta el día de hoy, y en Israel, y entre todos los hombres; y te has hecho nombre, como se ve en el día de hoy. 21 Y sacaste a tu pueblo Israel de la tierra de Egipto con señales y con portentos, con mano fuerte, y con brazo extendido, y con terror grande; 22 y les diste esta tierra, de la cual juraste a sus padres que se la darías, una tierra que fluye leche y miel; 23 y entraron y la poseyeron; pero no obedecieron tu voz, ni anduvieron en tu ley; no hicieron nada de lo que les mandaste hacer; por tanto has hecho venir sobre ellos todo este mal. 24 He aquí los baluartes han venido hasta la ciudad para tomarla; y la ciudad es entregada en manos de los caldeos que pelean contra ella, a causa de la espada, del hambre y de la pestilencia; lo que dijiste ha acontecido, y he aquí tú lo estás viendo. 25 ¡Y tú me has dicho, Señor Jehová: Cómprate la heredad por dinero, y pon testigos; bien que la ciudad es entregada en manos de los caldeos!`
  },
  {
    ref: "1 Reyes 8:22-30",
    text: `22 Luego se puso Salomón delante del altar de Jehová, en presencia de toda la congregación de Israel, y extendiendo sus manos al cielo, 23 dijo: Jehová Dios de Israel, no hay Dios como tú, ni arriba en los cielos ni abajo en la tierra, que guardas el pacto y la misericordia a tus siervos que caminan delante de ti con todo su corazón; 24 que has guardado a tu siervo David mi padre lo que le prometiste; lo dijiste con tu boca, y con tu mano lo has cumplido, como se ve en este día. 25 Ahora, pues, Jehová Dios de Israel, guarda a tu siervo David mi padre lo que le prometiste, diciendo: No faltará de ti varón delante de mí, que se siente en el trono de Israel, con tal que tus hijos guarden su camino y anden delante de mí como tú has andado delante de mí. 26 Ahora, pues, oh Dios de Israel, cúmplase tu palabra que dijiste a tu siervo David mi padre. 27 Pero ¿es verdad que Dios morará sobre la tierra? He aquí que los cielos, los cielos de los cielos, no te pueden contener; ¿cuánto menos esta casa que yo he edificado? 28 Con todo, tú atenderás a la oración de tu siervo, y a su ruego, oh Jehová Dios mío, para oír el clamor y la oración que tu siervo hace hoy delante de ti; 29 que estén tus ojos abiertos de noche y de día sobre esta casa, sobre este lugar del cual has dicho: Mi nombre estará allí; y que oigas la oración que tu siervo hace en este lugar. 30 Oye, pues, la oración de tu siervo, y de tu pueblo Israel; cuando oren en este lugar, también tú lo oirás en el lugar de tu morada, en los cielos; escucha y perdona.`
  },
  {
    ref: "1 Crónicas 4:9-10",
    text: `9 Y Jabes fue más ilustre que sus hermanos, al cual su madre llamó Jabes, diciendo: Por cuanto lo di a luz en dolor. 10 E invocó Jabes al Dios de Israel, diciendo: ¡Oh, si me dieras bendición, y ensancharas mi territorio, y si tu mano estuviera conmigo, y me libraras de mal, para que no me dañe! Y le otorgó Dios lo que pidió.`
  },
  {
    ref: "Romanos 8:26-27",
    text: `26 Y de igual manera el Espíritu nos ayuda en nuestra debilidad; pues qué hemos de pedir como conviene, no lo sabemos, pero el Espíritu mismo intercede por nosotros con gemidos indecibles. 27 Mas el que escudriña los corazones sabe cuál es la intención del Espíritu, porque conforme a la voluntad de Dios intercede por los santos.`
  },
  {
    ref: "Mateo 6:6",
    text: `Mas tú, cuando ores, entra en tu aposento, y cerrada tu puerta, ora a tu Padre que está en secreto; y tu Padre que ve en lo secreto te recompensará en público.`
  },
  {
    ref: "Hechos 12:12",
    text: `Y habiendo considerado esto, llegó a casa de María la madre de Juan, el que tenía por sobrenombre Marcos, donde muchos estaban reunidos orando.`
  },
  {
    ref: "Mateo 18:20",
    text: `Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.`
  },
  {
    ref: "Santiago 5:13-16",
    text: `13 ¿Está alguno entre vosotros afligido? Haga oración. ¿Está alguno alegre? Cante alabanzas. 14 ¿Está alguno enfermo entre vosotros? Llame a los ancianos de la iglesia, y oren sobre él, ungiéndole con aceite en el nombre del Señor. 15 Y la oración de fe salvará al enfermo, y el Señor lo levantará; y si hubiere cometido pecados, le serán perdonados. 16 Confesaos vuestras ofensas unos a otros, y orad unos por otros, para que seáis sanados. La oración eficaz del justo puede mucho.`
  },
  {
    ref: "1 Crónicas 29:11",
    text: `Tuya es, oh Jehová, la magnificencia y el poder, la gloria, la victoria y el honor; porque todas las cosas que están en los cielos y en la tierra son tuyas. Tuyo, oh Jehová, es el reino, y tú eres excelso sobre todos.`
  },
  {
    ref: "Job 42:10",
    text: `Y quitó Jehová la aflicción de Job, cuando él hubo orado por sus amigos; y aumentó al doble todas las cosas que habían sido de Job.`
  },
  {
    ref: "Salmo 32:5",
    text: `Mi pecado te declaré, y no encubrí mi iniquidad. Dije: Confesaré mis transgresiones a Jehová; y tú perdonaste la maldad de mi pecado. Selah`
  },
  {
    ref: "Salmo 51:10-13",
    text: `10 Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí. 11 No me eches de delante de ti, y no quites de mí tu santo Espíritu. 12 Vuélveme el gozo de tu salvación, y espíritu noble me sustente. 13 Entonces enseñaré a los transgresores tus caminos, y los pecadores se convertirán a ti.`
  },
  {
    ref: "Lucas 11:13",
    text: `Pues si vosotros, siendo malos, sabéis dar buenas dádivas a vuestros hijos, ¿cuánto más vuestro Padre celestial dará el Espíritu Santo a los que se lo pidan?`
  },
  {
    ref: "1 Timoteo 2:1-4",
    text: `1 Exhorto ante todo, a que se hagan rogativas, oraciones, peticiones y acciones de gracias, por todos los hombres; 2 por los reyes y por todos los que están en eminencia, para que vivamos quieta y reposadamente en toda piedad y honestidad. 3 Porque esto es bueno y agradable delante de Dios nuestro Salvador, 4 el cual quiere que todos los hombres sean salvos y vengan al conocimiento de la verdad.`
  },
  {
    ref: "Efesios 6:18-20",
    text: `18 Orando en todo tiempo con toda oración y súplica en el Espíritu, y velando en ello con toda perseverancia y súplica por todos los santos; 19 y por mí, a fin de que al abrir mi boca me sea dada palabra para dar a conocer con denuedo el misterio del evangelio, 20 por el cual soy embajador en cadenas; que con denuedo hable de él, como debo hablar.`
  },
  {
    ref: "Filipenses 4:6",
    text: `Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.`
  },
  {
    ref: "Colosenses 1:9",
    text: `Por lo cual también nosotros, desde el día que lo oímos, no cesamos de orar por vosotros, y de pedir que seáis llenos del conocimiento de su voluntad en toda sabiduría e inteligencia espiritual.`
  },
  {
    ref: "Santiago 4:15",
    text: `En lugar de lo cual deberíais decir: Si el Señor quiere, viviremos y haremos esto o aquello.`
  },
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
    { id: "inicio",      label: "Inicio",  Icon: Home },
    { id: "ana",         label: "Ana",     Icon: Heart },
    { id: "condiciones", label: "Oración", Icon: Filter },
    { id: "preguntas",   label: "Preguntas", Icon: HelpCircle },
    { id: "biblia",      label: "Biblia",  Icon: BookOpen },
    { id: "quiz",        label: "Quiz",    Icon: Search },
    { id: "cierre",      label: "Cierre",  Icon: Flame },
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
              InVerso · Semana 7
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              La práctica de la <em>oración</em>
            </h1>
            <div className="hero-ref">1 Samuel 1 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"      && <TabInicio teacherMode={teacherMode} />}
            {tab === "ana"         && <TabAna openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "condiciones" && <TabCondiciones openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "preguntas"   && <TabPreguntas openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "biblia"      && <TabBiblia openVerses={openVerses} toggle={toggleVerse} renderVerseText={renderVerseText} />}
            {tab === "quiz"        && (
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
      <div className="sec-title">La práctica de la oración</div>
      <div className="sec-sub">1 Samuel 1 — La historia de Ana</div>

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
              <strong style={{ color: "var(--tx)" }}>Ana</strong> — Su historia de dolor, espera y oración persistente<br />
              <strong style={{ color: "var(--tx)" }}>Oración</strong> — Las condiciones para una oración eficaz<br />
              <strong style={{ color: "var(--tx)" }}>Preguntas</strong> — Respuestas a dudas comunes sobre la oración<br />
              <strong style={{ color: "var(--tx)" }}>Biblia</strong> — Los {VERSES.length} versículos de la semana · RVR1960
            </p>
          </div>

          <div className="honey-card">
            <div className="honey-label"><BookOpen size={12} />Texto base · 1 Samuel 1:10-11</div>
            <div className="honey-text">«Ella con amargura de alma oró a Jehová, y lloró abundantemente. E hizo voto, diciendo: Jehová de los ejércitos, si te dignares mirar a la aflicción de tu sierva [...] yo lo dedicaré a Jehová todos los días de su vida.»</div>
            <div className="honey-ref">1 Samuel 1:10-11 · RVR1960</div>
          </div>

          <div className="egw-wrap">
            <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 11, p. 138</div>
            <div className="egw-text">«<strong>La oración no baja a Dios hacia nosotros, sino que nos eleva hacia él.</strong> No es que se necesite esto para darle a conocer a Dios lo que somos, sino a fin de capacitarnos para recibirlo.»</div>
          </div>

          <div className="card">
            <div className="card-label">Para arrancar</div>
            <p>¿Hay algo que llevas orando por mucho tiempo sin ver respuesta? <strong style={{ color: "var(--acc3)" }}>¿Eso debilitó tu fe, o la profundizó?</strong> La historia de Ana esta semana habla directo a esa pregunta.</p>
          </div>
        </>
      )}
    </>
  );
}

// ── TAB: ANA ─────────────────────────────────────────────────────────────────
function TabAna({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">La historia de Ana</div>
      <div className="sec-sub">Un ejemplo de oración persistente · 1 Samuel 1–2</div>

      <div className="card">
        <div className="card-label">El contexto</div>
        <p>Ana vivía en un matrimonio polígamo, era infértil, y su rival Penina la humillaba año tras año. Ningún médico podía ayudarla. Solo Dios podía. Esa conciencia de su impotencia total la acercó a Dios en lugar de alejarla de él. Su historia nos recuerda que las circunstancias más difíciles pueden convertirse en el terreno más fértil para la fe.</p>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>Cinco momentos clave — tocá para abrir</div>

      {ANA_ITEMS.map(({ key, badge, name, body }) => (
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
        <div className="egw-source"><BookOpen size={12} />1 Samuel 2:3 — La oración de gratitud de Ana</div>
        <div className="egw-text">«No multipliquéis palabras de grandeza y altanería; cesen las palabras arrogantes de vuestra boca; porque el Dios de todo saber es Jehová, y a él toca el pesar las acciones.» <strong>El camino de oración de Ana la llevó a tener un concepto más claro del carácter de Dios.</strong></div>
      </div>

      <div className="card">
        <div className="card-label">Puntos clave para recordar</div>
        <ul className="key-list">
          <li><span className="key-dot" /><span className="key-text">Las respuestas más profundas a la oración a veces llegan después de <strong>años</strong> de lucha y espera.</span></li>
          <li><span className="key-dot" /><span className="key-text">La tardanza de Dios hizo que la respuesta fuera <strong>más espectacular</strong>, no menos.</span></li>
          <li><span className="key-dot" /><span className="key-text">Nunca sabemos el <strong>verdadero alcance</strong> de aquello por lo que oramos. Ana oró por un hijo; Dios le dio un profeta que cambió una nación.</span></li>
        </ul>
      </div>
    </>
  );
}

// ── TAB: CONDICIONES ─────────────────────────────────────────────────────────
function TabCondiciones({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">¿Cómo ora con eficacia?</div>
      <div className="sec-sub">Cuando las oraciones parecen sin respuesta · 1 Juan 5:14</div>

      <div className="card">
        <div className="card-label">Las 4 maneras en que Dios responde</div>
        <div className="resp-grid">
          <div className="resp-card">
            <div className="resp-num">01</div>
            <div className="resp-title">Respuesta inmediata</div>
            <div className="resp-desc">Concede la petición de inmediato, en el momento que la hacemos.</div>
          </div>
          <div className="resp-card">
            <div className="resp-num">02</div>
            <div className="resp-title">Respuesta diferida</div>
            <div className="resp-desc">Retrasa su respuesta hasta el momento perfecto y adecuado.</div>
          </div>
          <div className="resp-card">
            <div className="resp-num">03</div>
            <div className="resp-title">Respuesta inesperada</div>
            <div className="resp-desc">Responde de una forma que no reconocemos de inmediato.</div>
          </div>
          <div className="resp-card">
            <div className="resp-num">04</div>
            <div className="resp-title">Respuesta negativa</div>
            <div className="resp-desc">Elige no darnos lo que pedimos, porque sabe que no es lo mejor.</div>
          </div>
        </div>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>Condiciones para la oración eficaz — tocá para abrir</div>

      {CONDICIONES.map(({ key, badge, name, body }) => (
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
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 11, pp. 143-144</div>
        <div className="egw-text">«Si nos acercamos a Dios, sintiéndonos desamparados y necesitados, como en realidad estamos, y con fe humilde y confiada presentamos nuestras necesidades ante Aquel cuyo conocimiento es infinito [...] él puede y quiere atender nuestro clamor, y <strong>hará resplandecer la luz en nuestro corazón.</strong>»</div>
      </div>
    </>
  );
}

// ── TAB: PREGUNTAS ────────────────────────────────────────────────────────────
function TabPreguntas({ openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Preguntas sobre la oración</div>
      <div className="sec-sub">Dudas comunes · respuestas bíblicas</div>

      <div className="card">
        <div className="card-label">Un factor clave</div>
        <p>Un factor que determina nuestra actitud ante las oraciones sin respuesta es <strong style={{ color: "var(--tx)" }}>cómo percibimos a Dios</strong>. Si lo percibimos como distante y sin interés, nuestra relación con él se debilita. Busca en la Biblia pruebas de su amor por ti. Pide que la imagen distorsionada que tienes de él se vuelva más clara.</p>
      </div>

      <div className="card-label" style={{ marginBottom: ".5rem", paddingLeft: ".2rem" }}>6 preguntas frecuentes — tocá para responder</div>

      {PREGUNTAS.map(({ key, badge, name, body }) => (
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
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 11, pp. 153-154</div>
        <div className="egw-text">«Nuestro Dios es un Padre tierno y misericordioso. Su servicio no tiene que ser considerado como algo que entristece [...] Él desea que quienes vengan a adorarlo se lleven <strong>pensamientos maravillosos acerca de su amor y protección.</strong>»</div>
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
      ? "Excelente. Como Ana, seguiste hasta el final. La misma fe que la sostuvo a ella está disponible para vos hoy."
      : pct >= 50
      ? "Buen intento. Revisá los tabs de Ana y Condiciones — la historia de 1 Samuel tiene mucho más para descubrir."
      : "No te desanimes. Abrí 1 Samuel 1, leé la historia de Ana, y hablá con Dios con la misma honestidad que ella. Es más simple de lo que parece.";
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
        <div className="egw-source"><BookOpen size={12} />Elena G. de White · El camino a Cristo, cap. 11, pp. 153-154</div>
        <div className="egw-text">«El alma puede elevarse hacia el cielo en las alas de la alabanza. Dios es adorado con cánticos y música en las mansiones celestiales, y al expresar nuestra gratitud nos aproximamos al culto que rinden los seres celestiales. <strong>"Quien me ofrece su gratitud, me honra" (Salmo 50:23).</strong>»</div>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} />Para tu vida</div>
        <div className="vida-text">
          Vivimos en la era de la gratificación inmediata. Si algo tarda más de dos segundos en cargar, lo cerramos. Si una conversación se pone difícil, bloqueamos. Si una relación requiere esfuerzo, la dejamos ir. Y sin querer, llevamos esa mentalidad a la oración: si Dios no responde rápido, asumimos que no escucha.<br /><br />
          Ana esperó años. No semanas — años. Y no esperó en silencio resignado: siguió orando, cada vez con más intensidad, no menos. Su fe no se gastó con el tiempo — se forjó. La espera no fue un obstáculo para su relación con Dios; fue el material con que esa relación se construyó.<br /><br />
          ¿Hay algo específico que llevas tiempo orando? <strong>Escribilo.</strong> Ponle fecha. No para llevar la cuenta, sino para reconocer que esa oración tiene historia. Que Dios la escuchó el primer día que la hiciste, y la sigue escuchando hoy. Y que su respuesta —cuando llegue, como llegue— va a ser mucho más de lo que pediste.
        </div>
      </div>
    </>
  );
}
