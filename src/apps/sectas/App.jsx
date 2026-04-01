import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, BookOpen, AlertTriangle, Scale, Shield, ScrollText,
  Brain, MessageCircle, ChevronRight, Check, X, Star,
  Clock, Heart, Search, Sparkles, Target, Users, Eye,
  EyeOff, Lock, Unlock, ArrowRight, RotateCcw, Zap,
  BookMarked, Church, Flame, HelpCircle
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   ESCUELA SABÁTICA JÓVENES — SEMANA 12
   "¿Secta o Iglesia?" — Apologética: Cultos Apocalípticos
   Hechos 2:42-47
   ═══════════════════════════════════════════════════════════════ */

const TABS = [
  { id: "inicio", Icon: Home, label: "Inicio" },
  { id: "contexto", Icon: BookOpen, label: "Contexto" },
  { id: "sectas", Icon: AlertTriangle, label: "Sectas" },
  { id: "comparar", Icon: Scale, label: "Comparar" },
  { id: "iasd", Icon: Shield, label: "IASD" },
  { id: "biblia", Icon: ScrollText, label: "Biblia" },
  { id: "quiz", Icon: Brain, label: "Quiz" },
  { id: "cierre", Icon: MessageCircle, label: "Cierre" },
];

const CULTS = [
  {
    name: "Heaven's Gate",
    year: "1997",
    leader: "Marshall Applewhite",
    location: "San Diego, California",
    deaths: "39 muertos",
    story: "La escena era escalofriante: 39 cadáveres vestidos con conjuntos deportivos idénticos, zapatillas Nike nuevas, y cubiertos con telas moradas. Applewhite convenció a sus seguidores de que eran alienígenas en cuerpos humanos, y que al suicidarse serían transportados a una nave espacial oculta detrás del cometa Hale-Bopp.",
    tactics: ["Aislamiento total del mundo exterior", "El líder como único contacto con 'la verdad'", "Miedo apocalíptico: el mundo se acababa", "Uniformidad forzada (ropa, peinado, identidad)", "Renuncia a la familia y posesiones"],
    // Student view: key facts they'll use to find patterns
    studentFacts: [
      "El líder decidía qué pensar y creer",
      "Los seguidores dejaron familia y amigos",
      "Usaban el miedo al fin del mundo",
      "Nadie podía cuestionar al líder",
      "Entregaron todo su dinero y posesiones",
    ],
    gradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
  },
  {
    name: "Jonestown",
    year: "1978",
    leader: "Jim Jones",
    location: "Guyana, Sudamérica",
    deaths: "918 muertos",
    story: "Jim Jones fundó el Peoples Temple prometiendo igualdad racial y justicia social. Pero detrás de la fachada, controlaba cada aspecto de la vida de sus seguidores. Cuando congresistas fueron a investigar, Jones ordenó el suicidio/asesinato masivo con cianuro mezclado en jugo. Más de 900 personas murieron, incluyendo 304 niños.",
    tactics: ["Explotación económica total", "Castigos públicos humillantes", "Aislamiento en la selva, lejos de todo", "Culto extremo a la personalidad", "Simulacros de suicidio para 'probar lealtad'"],
    studentFacts: [
      "El líder controlaba todas las decisiones",
      "Aislados en la selva, sin contacto exterior",
      "Decía que el mundo los perseguía",
      "Prohibido cuestionar o salir del grupo",
      "Obligados a entregar todo su dinero",
    ],
    gradient: "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)",
  },
  {
    name: "Davidianos (Waco)",
    year: "1993",
    leader: "David Koresh",
    location: "Waco, Texas",
    deaths: "76 muertos",
    story: "David Koresh se proclamó el último profeta y único intérprete de la Biblia. Tomó el control total sobre sus seguidores: decidía quién se casaba, separaba familias, y almacenaba armas. El asedio del FBI duró 51 días y terminó en un incendio devastador con 76 muertos, incluyendo 25 niños.",
    tactics: ["Interpretación exclusiva y distorsionada de la Biblia", "Abuso de autoridad sobre relaciones y familias", "Profecías apocalípticas manipuladas", "Control absoluto de la información", "Preparación militar contra 'el mundo exterior'"],
    studentFacts: [
      "Solo el líder podía interpretar la Biblia",
      "Separó a los miembros de sus familias",
      "Usaba profecías del fin para generar pánico",
      "Prohibido pensar distinto o irse",
      "Los seguidores entregaban todo al líder",
    ],
    gradient: "linear-gradient(135deg, #9a3412 0%, #ea580c 100%)",
  },
];

const PATTERNS = [
  { id: "lider", label: "Un líder que exige obediencia total", icon: Lock },
  { id: "aislamiento", label: "Aislamiento de familia y sociedad", icon: EyeOff },
  { id: "miedo", label: "Miedo apocalíptico para controlar", icon: AlertTriangle },
  { id: "pensamiento", label: "Prohibido cuestionar o pensar diferente", icon: Lock },
  { id: "dinero", label: "Explotación económica de los miembros", icon: Target },
];

const COMPARE = [
  { trait: "Autoridad", cult: "Obediencia ciega e incondicional al líder. No rinde cuentas a nadie.", church: "Liderazgo servicial, con rendición de cuentas mutua.", ref: "Mat. 20:25-28" },
  { trait: "Comunidad", cult: "Aislamiento forzado de familia, amigos y sociedad.", church: "Los creyentes se dispersaban e integraban en la sociedad.", ref: "Hech. 8:1" },
  { trait: "Finanzas", cult: "Explotación económica para enriquecimiento del líder.", church: "Generosidad voluntaria y alegre. Los apóstoles rechazaron enriquecerse.", ref: "2 Cor. 9:7 · Hech. 8:18-22" },
  { trait: "Pensamiento", cult: "Prohibido cuestionar. Pensar diferente es traición.", church: "Examinar todo. Escudriñar las Escrituras por uno mismo.", ref: "1 Tes. 5:21 · Hech. 17:11" },
  { trait: "Profecía", cult: "Miedo apocalíptico como herramienta de control y pánico.", church: "Las profecías inspiran esperanza y preparación, no terror.", ref: "1 Tes. 5:4-6" },
  { trait: "Transparencia", cult: "Secretismo, rituales ocultos, manipulación emocional.", church: "Predicación pública y abierta. Nada en secreto.", ref: "Juan 18:20 · Hech. 2:14" },
];

const VERSES = [
  { ref: "Hechos 2:42-47", text: "Y perseveraban en la doctrina de los apóstoles, en la comunión unos con otros, en el partimiento del pan y en las oraciones. Y sobrevino temor a toda persona; y muchas maravillas y señales eran hechas por los apóstoles. Todos los que habían creído estaban juntos, y tenían en común todas las cosas; y vendían sus propiedades y sus bienes, y lo repartían a todos según la necesidad de cada uno. Y perseverando unánimes cada día en el templo, y partiendo el pan en las casas, comían juntos con alegría y sencillez de corazón, alabando a Dios, y teniendo favor con todo el pueblo. Y el Señor añadía cada día a la iglesia los que habían de ser salvos.", key: true },
  { ref: "Mateo 20:25-28", text: "Entonces Jesús, llamándolos, dijo: Sabéis que los gobernantes de las naciones se enseñorean de ellas, y los que son grandes ejercen sobre ellas potestad. Mas entre vosotros no será así, sino que el que quiera hacerse grande entre vosotros será vuestro servidor, y el que quiera ser el primero entre vosotros será vuestro siervo; como el Hijo del Hombre no vino para ser servido, sino para servir, y para dar su vida en rescate por muchos." },
  { ref: "1 Tesalonicenses 5:21", text: "Examinadlo todo; retened lo bueno." },
  { ref: "1 Pedro 3:15", text: "Sino santificad a Dios el Señor en vuestros corazones, y estad siempre preparados para presentar defensa con mansedumbre y reverencia ante todo el que os demande razón de la esperanza que hay en vosotros." },
  { ref: "Hechos 17:11", text: "Y estos eran más nobles que los que estaban en Tesalónica, pues recibieron la palabra con toda solicitud, escudriñando cada día las Escrituras para ver si estas cosas eran así." },
  { ref: "Juan 18:20", text: "Jesús le respondió: Yo públicamente he hablado al mundo; siempre he enseñado en la sinagoga y en el templo, donde se reúnen todos los judíos, y nada he hablado en oculto." },
  { ref: "1 Tesalonicenses 5:4-6", text: "Mas vosotros, hermanos, no estáis en tinieblas, para que aquel día os sorprenda como ladrón. Porque todos vosotros sois hijos de luz e hijos del día; no somos de la noche ni de las tinieblas. Por tanto, no durmamos como los demás, sino velemos y seamos sobrios." },
  { ref: "2 Corintios 9:7", text: "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre." },
  { ref: "Lucas 6:26", text: "¡Ay de vosotros, cuando todos los hombres hablen bien de vosotros! porque así hacían sus padres con los falsos profetas." },
  { ref: "Apocalipsis 12:17", text: "Entonces el dragón se llenó de ira contra la mujer; y se fue a hacer guerra contra el resto de la descendencia de ella, los que guardan los mandamientos de Dios y tienen el testimonio de Jesucristo." },
  { ref: "Mateo 23:37", text: "¡Jerusalén, Jerusalén, que matas a los profetas, y apedreas a los que te son enviados! ¡Cuántas veces quise juntar a tus hijos, como la gallina junta sus polluelos debajo de las alas, y no quisiste!" },
];

const QUIZ_DATA = [
  { q: "¿Cuál es una señal clave de una secta?", opts: ["Estudiar la Biblia en grupo", "Un líder que exige obediencia sin rendir cuentas", "Cantar himnos los sábados", "Tener creencias distintivas"], ans: 1, why: "Las sectas se caracterizan por líderes que exigen obediencia incondicional y no rinden cuentas a nadie. Cristo modeló lo opuesto: liderazgo servicial (Mat. 20:25-28)." },
  { q: "¿Cómo manejaba la iglesia primitiva el dinero?", opts: ["Exigían diezmos bajo amenaza", "Compartían voluntariamente sus recursos", "Cobraban entrada a los cultos", "Solo los apóstoles manejaban las finanzas"], ans: 1, why: "Los primeros creyentes compartían voluntariamente (Hech. 2:44-45). Los apóstoles rechazaron enriquecerse y reprendieron a quienes intentaron comprar poder espiritual (Hech. 8:18-22)." },
  { q: "¿Qué respondió Jesús cuando lo acusaron de liderar una secta?", opts: ["Se escondió de las autoridades", "Amenazó a sus acusadores", "Enfatizó que siempre habló abiertamente al mundo", "Dejó de predicar en público"], ans: 2, why: "Jesús respondió con transparencia: «Yo públicamente he hablado al mundo... nada he hablado en oculto» (Juan 18:20). Su ministerio fue siempre abierto." },
  { q: "¿Qué enseña 1 Tesalonicenses 5:21 que debemos hacer?", opts: ["Obedecer al líder sin cuestionar", "Examinarlo todo y retener lo bueno", "Alejarse completamente del mundo", "Seguir solo a un líder espiritual"], ans: 1, why: "La Biblia anima al pensamiento crítico y al examen personal. Las sectas hacen exactamente lo contrario: prohíben cuestionar." },
  { q: "¿Cómo describió el historiador romano Tácito al cristianismo?", opts: ["Como una religión admirable", "Como una superstición perniciosa", "Como filosofía griega aplicada", "Como secta política judía"], ans: 1, why: "Tácito (116 d.C.) llamó al cristianismo una «superstición muy perniciosa». Esto muestra cómo la sociedad malinterpretaba al movimiento cristiano primitivo." },
  { q: "¿Cuál es la posición oficial de la IASD sobre Elena G. de White?", opts: ["Sus escritos reemplazan a la Biblia", "Es considerada igual a los apóstoles bíblicos", "Sus escritos son un don profético que confirma la Biblia", "No la consideran relevante actualmente"], ans: 2, why: "La IASD afirma sola Scriptura: la Biblia es la autoridad suprema. Los escritos de Elena White son un don profético (Apoc. 19:10) que confirma las verdades bíblicas, sin sustituirlas." },
  { q: "¿Qué hicieron los creyentes de Berea que los hizo «más nobles»?", opts: ["Aceptaron todo sin preguntar", "Escudriñaban las Escrituras cada día para verificar", "Construyeron el templo más grande", "Nunca cuestionaron a Pablo"], ans: 1, why: "Los bereanos recibieron la palabra con solicitud pero «escudriñando cada día las Escrituras para ver si estas cosas eran así» (Hech. 17:11). La fe verdadera examina." },
];

const REFLECTIONS = [
  "¿Cómo respondés cuando alguien acusa a tu iglesia de ser una secta?",
  "¿Qué diferencia real ves entre seguir a un líder humano y seguir a Cristo?",
  "¿Alguna vez sentiste presión de grupo en un contexto religioso? ¿Cómo lo manejaste?",
  "¿Cómo podemos ser una iglesia más transparente y acogedora en nuestra comunidad?",
  "¿Por qué crees que incluso Jesús fue acusado de formar una secta?",
];

const GUIDE = [
  { time: "0-3'", emoji: Users, title: "Bienvenida", detail: "Saludo caloroso. ¿Cómo estuvo la semana? Compartir el link de la app para que todos la abran en sus celulares." },
  { time: "3-5'", emoji: Heart, title: "Pedidos y Oración", detail: "Pedidos breves. Orar juntos pidiendo sabiduría para la clase." },
  { time: "5-8'", emoji: BookOpen, title: "Contexto histórico", detail: "Sección CONTEXTO de la app. Los primeros cristianos fueron acusados de ser una secta. Tácito, Plinio, los primeros apologistas. Leer 1 Pedro 3:15 juntos. Esto prepara el terreno para lo que sigue." },
  { time: "8-13'", emoji: AlertTriangle, title: "Sectas reales", detail: "Los chicos abren la sección SECTAS en la app. Leen los datos de cada secta y hacen la dinámica de identificar el patrón común. Vos complementás con el contexto completo desde tu modo maestro." },
  { time: "13-19'", emoji: Scale, title: "Secta vs Iglesia Primitiva", detail: "Tabla comparativa en la app. Leer Hechos 2:42-47 juntos. Ir punto por punto: autoridad, comunidad, dinero, pensamiento, profecía, transparencia." },
  { time: "19-23'", emoji: Shield, title: "¿Somos secta?", detail: "Sección IASD. Acusaciones sobre Elena White y mentalidad de remanente. Evidencia bíblica. Jesús también fue acusado." },
  { time: "23-27'", emoji: Brain, title: "Quiz interactivo", detail: "¡Todos hacen el quiz desde sus celulares! Comparar puntajes. Repasar respuestas. El 7/7 gana un reconocimiento." },
  { time: "27-30'", emoji: MessageCircle, title: "Reflexión y cierre", detail: "Elegir 2-3 preguntas de reflexión y dialogar. Oración de cierre. Leer juntos el texto final de la app." },
];

// ── STYLES ─────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root {
  --bg:#08080f; --bg2:#0f0f1a; --bg3:#171728;
  --surf:#1c1c34; --surf2:#242445;
  --brd:#2a2a4a; --brd2:#3d3d6a;
  --tx:#eaeaf5; --tx2:#9090b0; --tx3:#606080;
  --acc:#6366f1; --acc2:#818cf8; --acc3:#c7d2fe;
  --ok:#10b981; --ok-d:rgba(16,185,129,.1);
  --err:#f43f5e; --err-d:rgba(244,63,94,.1);
  --warn:#f59e0b; --warn-d:rgba(245,158,11,.1);
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%;overflow:hidden}
body{font-family:'DM Sans',system-ui,sans-serif;background:var(--bg);color:var(--tx);-webkit-font-smoothing:antialiased}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}

.hero{position:relative;padding:2.8rem 1.5rem 1rem;text-align:center;overflow:hidden;user-select:none;cursor:default}
.hero-bg{position:absolute;inset:-80% -60%;background:radial-gradient(ellipse at 50% 30%,rgba(99,102,241,.12) 0%,transparent 60%);animation:pulse 10s ease-in-out infinite;pointer-events:none}
@keyframes pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
.hero-tag{font-family:'IBM Plex Mono',monospace;font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--acc2);margin-bottom:.5rem;position:relative;opacity:0;animation:fi .6s .2s forwards}
.hero h1{font-family:'Playfair Display',serif;font-size:2.8rem;font-weight:800;line-height:1;letter-spacing:-.02em;position:relative;margin-bottom:.35rem;opacity:0;animation:su .7s .3s forwards}
.hero h1 em{font-style:italic;background:linear-gradient(135deg,var(--acc2),var(--acc3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:.95rem;font-weight:300;color:var(--tx2);position:relative;opacity:0;animation:fi .6s .5s forwards}
.hero-badge{font-family:'IBM Plex Mono',monospace;font-size:.65rem;color:var(--acc);margin-top:.7rem;position:relative;display:inline-flex;align-items:center;gap:.35rem;padding:.2rem .65rem;border-radius:20px;background:var(--bg3);border:1px solid var(--brd);opacity:0;animation:fi .6s .7s forwards}
@keyframes fi{to{opacity:1}}
@keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

.secret-bar{font-family:'IBM Plex Mono',monospace;font-size:.5rem;text-align:center;padding:.15rem;height:18px;color:transparent;transition:color .6s}
.secret-bar.vis{color:var(--tx3)}
.secret-bar.active{color:var(--ok)}

.nav{flex-shrink:0;width:100%;background:rgba(8,8,15,.96);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid var(--brd);display:flex;overflow-x:auto;scrollbar-width:none;padding-bottom:env(safe-area-inset-bottom,0px)}
.nav::-webkit-scrollbar{display:none}
.nav button{flex:1 0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.65rem .55rem .55rem;min-width:58px;min-height:56px;font-size:.55rem;font-family:'IBM Plex Mono',monospace;color:var(--tx3);cursor:pointer;border:none;background:none;text-transform:uppercase;letter-spacing:.05em;position:relative;transition:color .18s;gap:4px;-webkit-tap-highlight-color:transparent}
.nav button.on{color:var(--acc2)}
.nav button.on::before{content:'';position:absolute;top:0;left:18%;right:18%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 3px 3px}
.nav button.on::after{content:'';position:absolute;inset:4px 5px;background:rgba(99,102,241,.13);border-radius:10px;z-index:-1}
.nav button svg{width:20px;height:20px;stroke-width:1.8}

.ct{padding:1.2rem}
.fin{animation:su .35s ease forwards}
.st{font-family:'Playfair Display',serif;font-size:1.65rem;font-weight:700;letter-spacing:-.02em;margin-bottom:.8rem;display:flex;align-items:center;gap:.45rem}
.st svg{width:22px;height:22px;stroke-width:1.8;color:var(--acc2)}

.card{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1.1rem;margin-bottom:.75rem;transition:border-color .3s}
.card:active{border-color:var(--brd2)}
.card h3{font-size:1.1rem;font-weight:600;margin-bottom:.5rem}
.card p{color:var(--tx2);line-height:1.65;font-size:1rem}
.card p strong{color:var(--tx)}
.dv{height:1px;background:var(--brd);margin:.9rem 0}
.tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.6rem}
.tag{font-family:'IBM Plex Mono',monospace;font-size:.58rem;padding:.18rem .45rem;background:var(--bg3);border:1px solid var(--brd);border-radius:5px;color:var(--tx2)}

.cult-card{border-radius:16px;margin-bottom:.75rem;overflow:hidden;cursor:pointer;border:1px solid var(--brd);transition:transform .15s}
.cult-card:active{transform:scale(.985)}
.cult-head{padding:.85rem 1rem;display:flex;justify-content:space-between;align-items:center}
.cult-head h3{font-size:1rem;font-weight:700;color:white}
.cult-meta{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:rgba(255,255,255,.7);margin-top:.15rem}
.cult-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;padding:.15rem .4rem;background:rgba(255,255,255,.18);border-radius:5px;color:white;font-weight:500}
.cult-body{padding:0 1rem 1rem;background:var(--surf)}
.cult-body p{color:var(--tx2);line-height:1.65;font-size:1rem;padding-top:.8rem}
.cult-expand{font-size:.72rem;color:var(--tx3);padding:.3rem 1rem .6rem;font-family:'IBM Plex Mono',monospace;display:flex;align-items:center;gap:.3rem}
.cult-expand svg{width:14px;height:14px}

/* student facts */
.fact-list{padding:.6rem 1rem 1rem;background:var(--surf)}
.fact-item{display:flex;align-items:flex-start;gap:.5rem;padding:.4rem 0;font-size:.97rem;color:var(--tx2);line-height:1.5}
.fact-item svg{width:14px;height:14px;color:var(--warn);flex-shrink:0;margin-top:3px}

/* pattern game */
.pattern-game{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1.1rem;margin-top:.5rem}
.pattern-game h3{font-size:1rem;font-weight:600;margin-bottom:.3rem;display:flex;align-items:center;gap:.4rem}
.pattern-game h3 svg{width:18px;height:18px;color:var(--warn)}
.pattern-game>p{font-size:.95rem;color:var(--tx2);margin-bottom:.8rem;line-height:1.5}
.pat-opt{display:flex;align-items:center;gap:.6rem;padding:.7rem .8rem;margin-bottom:.35rem;background:var(--bg3);border:1.5px solid var(--brd);border-radius:12px;cursor:pointer;transition:all .2s;font-size:.97rem;color:var(--tx)}
.pat-opt:active{transform:scale(.98)}
.pat-opt svg{width:18px;height:18px;color:var(--tx3);flex-shrink:0}
.pat-opt.sel{border-color:var(--ok);background:var(--ok-d)}
.pat-opt.sel svg{color:var(--ok)}
.pat-result{margin-top:.7rem;padding:.8rem;border-radius:12px;font-size:.97rem;line-height:1.55}
.pat-result.success{background:var(--ok-d);border:1px solid rgba(16,185,129,.2);color:var(--tx)}
.pat-result.partial{background:var(--warn-d);border:1px solid rgba(245,158,11,.2);color:var(--tx)}
.pat-check{margin-top:.6rem;padding:.6rem 1.2rem;background:var(--acc);border:none;border-radius:10px;color:white;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:.3rem}
.pat-check:active{opacity:.85}
.pat-check svg{width:16px;height:16px}

.cmp-block{margin-bottom:.85rem}
.cmp-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.15em;color:var(--acc2);margin-bottom:.3rem;padding-left:.15rem}
.cmp-row{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
.cmp-cell{padding:.65rem .6rem;border-radius:12px;font-size:.93rem;line-height:1.5;border:1px solid var(--brd)}
.cmp-cell.bad{background:var(--err-d);border-color:rgba(244,63,94,.15)}
.cmp-cell.good{background:var(--ok-d);border-color:rgba(16,185,129,.15)}
.cmp-icon{font-family:'IBM Plex Mono',monospace;font-size:.55rem;display:flex;align-items:center;gap:.25rem;margin-bottom:.15rem}
.cmp-cell.bad .cmp-icon{color:var(--err)}
.cmp-cell.good .cmp-icon{color:var(--ok)}
.cmp-icon svg{width:12px;height:12px}
.cmp-ref{font-family:'IBM Plex Mono',monospace;font-size:.55rem;color:var(--tx3);text-align:right;margin-top:.2rem}

.verse{background:var(--surf);border:1px solid var(--brd);border-left:3px solid var(--acc);border-radius:0 14px 14px 0;padding:.9rem 1rem;margin-bottom:.55rem;cursor:pointer;transition:border-left-color .3s}
.verse:active{border-left-color:var(--acc3)}
.verse.kv{border-left-color:var(--warn);border-left-width:4px}
.verse-ref{font-family:'IBM Plex Mono',monospace;font-size:.7rem;color:var(--acc2);letter-spacing:.04em;display:flex;align-items:center;gap:.35rem}
.verse-ref svg{width:13px;height:13px}
.verse-hint{font-size:.78rem;color:var(--tx3);margin-top:.15rem;display:flex;align-items:center;gap:.25rem}
.verse-hint svg{width:13px;height:13px}
.vt{font-family:'DM Sans',system-ui,sans-serif;font-style:normal;font-weight:400;color:var(--tx);line-height:1.75;font-size:1.05rem;max-height:0;overflow:hidden;transition:max-height .5s ease,opacity .4s,margin .3s;opacity:0;margin-top:0}
.vt.open{max-height:800px;opacity:1;margin-top:.6rem}

.q-bar{display:flex;gap:.2rem;margin-bottom:1.1rem}
.q-dot{flex:1;height:3px;border-radius:2px;background:var(--brd);transition:background .3s}
.q-dot.ok{background:var(--ok)}.q-dot.no{background:var(--err)}.q-dot.now{background:var(--acc)}
.q-text{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:600;line-height:1.35;margin-bottom:.9rem}
.q-opt{display:block;width:100%;padding:.8rem .9rem;margin-bottom:.35rem;background:var(--surf);border:1px solid var(--brd);border-radius:12px;color:var(--tx);font-family:'DM Sans',sans-serif;font-size:1rem;text-align:left;cursor:pointer;transition:all .2s}
.q-opt:active{transform:scale(.98)}
.q-opt.right{border-color:var(--ok);background:var(--ok-d)}
.q-opt.miss{border-color:var(--err);background:var(--err-d)}
.q-opt.dim{pointer-events:none;opacity:.35}
.q-why{margin-top:.55rem;padding:.8rem;background:var(--bg3);border-radius:12px;font-size:.97rem;color:var(--tx2);line-height:1.55;border-left:3px solid var(--ok)}
.q-next{display:block;width:100%;margin-top:.75rem;padding:.7rem;background:var(--acc);border:none;border-radius:12px;color:white;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.3rem}
.q-next:active{opacity:.85}
.q-next svg{width:16px;height:16px}
.q-result{text-align:center;padding:1.5rem .5rem}
.q-big{font-family:'Playfair Display',serif;font-size:4.5rem;font-weight:800;background:linear-gradient(135deg,var(--acc2),var(--acc3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.q-pct{font-family:'IBM Plex Mono',monospace;font-size:.7rem;color:var(--tx3);margin-top:.3rem}
.q-msg{font-size:1rem;color:var(--tx);margin-top:.8rem;line-height:1.5}
.q-retry{margin-top:1rem;padding:.65rem 1.8rem;background:none;border:1px solid var(--acc);border-radius:12px;color:var(--acc3);font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:.3rem}
.q-retry svg{width:16px;height:16px}

.ref-card{background:var(--surf);border:1px solid var(--brd);border-radius:14px;padding:1rem;margin-bottom:.55rem}
.ref-n{font-family:'IBM Plex Mono',monospace;font-size:.55rem;color:var(--acc2);letter-spacing:.1em}
.ref-q{font-size:1.05rem;line-height:1.55;margin-top:.15rem}

.personal-card{background:linear-gradient(145deg,var(--surf),var(--surf2));border:1px solid var(--acc);border-radius:16px;padding:1.1rem;margin-top:.65rem}
.personal-card h4{font-size:.92rem;color:var(--acc3);margin-bottom:.5rem;display:flex;align-items:center;gap:.35rem}
.personal-card h4 svg{width:18px;height:18px}
.personal-card p{color:var(--tx2);line-height:1.7;font-size:1rem}
.personal-card p strong{color:var(--tx)}

.adv-card{padding:1rem;background:var(--surf);border:1px solid var(--brd);border-radius:14px;margin-bottom:.6rem}
.adv-tag{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.3rem;display:flex;align-items:center;gap:.3rem}
.adv-tag svg{width:12px;height:12px}
.adv-tag.red{color:var(--err)}.adv-tag.blue{color:var(--acc2)}
.adv-text{color:var(--tx2);line-height:1.65;font-size:1rem}
.adv-text strong{color:var(--ok)}

.pattern-card{background:var(--warn-d);border:1px solid rgba(245,158,11,.18);border-radius:14px;padding:1rem;margin-top:.15rem}
.pattern-card p{font-size:.97rem;line-height:1.55;color:var(--tx)}
.pattern-card strong{color:var(--warn)}

.guide-step{display:flex;gap:.7rem;margin-bottom:.55rem;padding:.8rem;background:var(--surf);border:1px solid var(--brd);border-radius:14px}
.guide-time{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);white-space:nowrap;min-width:38px;padding-top:2px}
.guide-body h4{font-size:.97rem;font-weight:600;margin-bottom:.15rem;display:flex;align-items:center;gap:.3rem}
.guide-body h4 svg{width:16px;height:16px;color:var(--acc2)}
.guide-body p{font-size:.92rem;color:var(--tx2);line-height:1.5}
`;

// ── COMPONENTS ────────────────────────────────────────────────

function Hero({ onTap }) {
  return (
    <div className="hero" onClick={onTap}>
      <div className="hero-bg" />
      <div className="hero-tag">Semana 12 · Escuela Sabática Jóvenes</div>
      <h1>¿<em>Secta</em> o Iglesia?</h1>
      <div className="hero-sub">Apologética — Cultos apocalípticos</div>
      <div className="hero-badge"><BookMarked size={13} /> Hechos 2:42-47</div>
    </div>
  );
}

function WelcomeSection() {
  return (
    <div className="ct fin">
      <h2 className="st"><Sparkles /> Bienvenidos</h2>
      <div className="card">
        <p style={{fontSize:".98rem",lineHeight:1.65}}>
          Esta semana exploramos un tema fuerte: <strong style={{color:"var(--acc3)"}}>los cultos apocalípticos y las sectas</strong>. Vamos a ver qué las define, cómo operan, y por qué la iglesia primitiva (y la Iglesia Adventista) son radicalmente diferentes.
        </p>
        <div className="dv"/>
        <p>Navegá por las secciones usando el menú de abajo. Al final hay un <strong style={{color:"var(--warn)"}}>quiz de 7 preguntas</strong> para poner a prueba lo que aprendiste.</p>
      </div>
      <div className="card" style={{borderColor:"var(--acc)"}}>
        <h3 style={{fontSize:".9rem",color:"var(--acc3)",display:"flex",alignItems:"center",gap:".3rem"}}><Star size={15}/> Texto base de la semana</h3>
        <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",lineHeight:1.65,fontSize:".98rem",color:"var(--tx)",marginTop:".4rem"}}>
          «Y perseveraban en la doctrina de los apóstoles, en la comunión unos con otros, en el partimiento del pan y en las oraciones... Todos los que habían creído estaban juntos, y tenían en común todas las cosas.»
        </p>
        <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".62rem",color:"var(--acc2)",marginTop:".4rem"}}>— Hechos 2:42, 44 (RVR1960)</p>
      </div>
    </div>
  );
}

function GuideSection() {
  return (
    <div className="ct fin">
      <h2 className="st"><BookOpen /> Guía de clase</h2>
      <p style={{color:"var(--tx2)",fontSize:".88rem",marginBottom:".8rem",lineHeight:1.5}}>Programa de 30 minutos. Compartí el link al inicio.</p>
      {GUIDE.map((s,i) => (
        <div key={i} className="guide-step">
          <div className="guide-time">{s.time}</div>
          <div className="guide-body">
            <h4><s.emoji size={16}/> {s.title}</h4>
            <p>{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContextSection() {
  return (
    <div className="ct fin">
      <h2 className="st"><BookOpen /> Contexto histórico</h2>
      <div className="card">
        <h3>Los primeros cristianos: ¿una secta?</h3>
        <p>Sorprendentemente, la iglesia cristiana primitiva fue tildada de secta. Las autoridades romanas acusaban a los cristianos de <strong style={{color:"var(--warn)"}}>canibalismo</strong> por la Cena del Señor, y de conspirar contra el gobierno por reunirse en secreto y negarse a adorar a los dioses romanos.</p>
        <div className="dv"/>
        <p>El historiador <strong>Tácito</strong> (116 d.C.) llamó al cristianismo una «superstición muy perniciosa». <strong>Plinio el Joven</strong>, gobernador romano, describió las reuniones como asambleas matutinas donde se comprometían a vivir moralmente y cantaban himnos a Cristo «como si fuese un dios».</p>
        <div className="dv"/>
        <p>Los primeros apologistas se levantaron para defender la fe. <strong>Justino Mártir</strong> (155 d.C.) argumentó que los cristianos buscaban adorar a Dios en espíritu y verdad. <strong>Atenágoras de Atenas</strong> (177 d.C.) enfatizó el rechazo a la idolatría y el compromiso con el amor y la justicia. Así nació la <strong style={{color:"var(--acc3)"}}>apologética</strong>: la defensa razonada de la fe.</p>
      </div>
      <div className="verse kv" style={{cursor:"default"}}>
        <div className="verse-ref"><Star size={12} style={{color:"var(--warn)"}}/> 1 Pedro 3:15 — El versículo de la apologética</div>
        <div className="vt open">«Sino santificad a Dios el Señor en vuestros corazones, y estad siempre preparados para presentar defensa con mansedumbre y reverencia ante todo el que os demande razón de la esperanza que hay en vosotros.»</div>
      </div>
    </div>
  );
}

// SECTAS — Different views for teacher vs student
function CultsTeacher() {
  const [open,setOpen]=useState(null);
  return (
    <div className="ct fin">
      <h2 className="st"><AlertTriangle /> Sectas famosas</h2>
      <p style={{color:"var(--tx2)",fontSize:".88rem",marginBottom:".8rem",lineHeight:1.5}}>Contexto completo de cada secta. Usá esto para complementar lo que los chicos ven en sus celulares.</p>
      {CULTS.map((c,i)=>(
        <div key={i} className="cult-card" onClick={()=>setOpen(open===i?null:i)}>
          <div className="cult-head" style={{background:c.gradient}}>
            <div>
              <h3 style={{display:"flex",alignItems:"center",gap:".4rem"}}>{c.name} <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".65rem",fontWeight:500,background:"rgba(255,255,255,.2)",padding:".1rem .35rem",borderRadius:"4px"}}>{c.year}</span></h3>
              <div className="cult-meta">{c.leader} · {c.location}</div>
            </div>
            <div className="cult-badge">{c.deaths}</div>
          </div>
          {open===i?(
            <div className="cult-body">
              <p>{c.story}</p>
              <div className="tags">{c.tactics.map((t,j)=><span key={j} className="tag">{t}</span>)}</div>
            </div>
          ):(
            <div className="cult-expand"><ChevronRight size={14}/> Toca para ver contexto completo</div>
          )}
        </div>
      ))}
      <div className="pattern-card">
        <p><strong>Patrón común:</strong> Un líder carismático que exige obediencia total, aísla a sus seguidores, tergiversa textos religiosos, y usa el miedo apocalíptico como herramienta de control.</p>
      </div>
    </div>
  );
}

function CultsStudent() {
  const [open,setOpen]=useState(null);
  const [selected,setSelected]=useState([]);
  const [checked,setChecked]=useState(false);

  const togglePattern=(id)=>{
    if(checked)return;
    setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  };
  const allCorrect=PATTERNS.every(p=>selected.includes(p.id));
  const score=selected.filter(s=>PATTERNS.some(p=>p.id===s)).length;

  return(
    <div className="ct fin">
      <h2 className="st"><AlertTriangle /> Sectas famosas</h2>
      <p style={{color:"var(--tx2)",fontSize:".88rem",marginBottom:".8rem",lineHeight:1.5}}>Leé los datos clave de cada secta. Después, identificá el patrón que tienen en común.</p>
      {CULTS.map((c,i)=>(
        <div key={i} className="cult-card" onClick={()=>setOpen(open===i?null:i)}>
          <div className="cult-head" style={{background:c.gradient}}>
            <div>
              <h3 style={{display:"flex",alignItems:"center",gap:".4rem"}}>{c.name} <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".65rem",fontWeight:500,background:"rgba(255,255,255,.2)",padding:".1rem .35rem",borderRadius:"4px"}}>{c.year}</span></h3>
              <div className="cult-meta">{c.leader} · {c.location}</div>
            </div>
            <div className="cult-badge">{c.deaths}</div>
          </div>
          {open===i?(
            <div className="fact-list">
              {c.studentFacts.map((f,j)=>(
                <div key={j} className="fact-item"><Zap size={14}/>{f}</div>
              ))}
            </div>
          ):(
            <div className="cult-expand"><ChevronRight size={14}/> Toca para ver datos clave</div>
          )}
        </div>
      ))}

      <div className="pattern-game">
        <h3><Search size={18}/> Encontrá el patrón</h3>
        <p>¿Qué tienen en común estas tres sectas? Seleccioná todos los patrones que identificás:</p>
        {PATTERNS.map(p=>(
          <div key={p.id} className={`pat-opt ${selected.includes(p.id)?'sel':''}`} onClick={()=>togglePattern(p.id)}>
            {selected.includes(p.id)?<Check size={18}/>:<p.icon size={18}/>}
            {p.label}
          </div>
        ))}
        {!checked&&selected.length>0&&(
          <button className="pat-check" onClick={()=>setChecked(true)}>
            <Check size={16}/> Verificar respuesta
          </button>
        )}
        {checked&&(
          <div className={`pat-result ${allCorrect?'success':'partial'}`}>
            {allCorrect
              ? <><strong>¡Perfecto!</strong> Identificaste los 5 patrones. Todas las sectas comparten estas mismas tácticas destructivas. La iglesia primitiva era radicalmente diferente — veamos por qué en la siguiente sección.</>
              : <><strong>{score} de 5 correctos.</strong> ¡Buen intento! En realidad, las tres sectas comparten <em>todos</em> estos patrones. Cada uno es una señal de alerta que debemos reconocer.</>
            }
          </div>
        )}
      </div>
    </div>
  );
}

function CompareSection() {
  return (
    <div className="ct fin">
      <h2 className="st"><Scale /> Secta vs Iglesia Primitiva</h2>
      <p style={{color:"var(--tx2)",fontSize:".88rem",marginBottom:".8rem",lineHeight:1.5}}>Hechos 2:42-47 describe una comunidad radicalmente diferente a cualquier secta:</p>
      {COMPARE.map((c,i)=>(
        <div key={i} className="cmp-block">
          <div className="cmp-label">{c.trait}</div>
          <div className="cmp-row">
            <div className="cmp-cell bad"><span className="cmp-icon"><X size={12}/> SECTA</span>{c.cult}</div>
            <div className="cmp-cell good"><span className="cmp-icon"><Check size={12}/> IGLESIA</span>{c.church}</div>
          </div>
          <div className="cmp-ref">{c.ref}</div>
        </div>
      ))}
    </div>
  );
}

function IASDSection() {
  return (
    <div className="ct fin">
      <h2 className="st"><Shield /> ¿Es la IASD una secta?</h2>
      <p style={{color:"var(--tx2)",fontSize:".88rem",marginBottom:".8rem",lineHeight:1.5}}>Respuestas a las acusaciones más comunes, con evidencia bíblica.</p>
      <div className="adv-card">
        <div className="adv-tag red"><X size={12}/> Acusación: «Ponen a Elena White por encima de la Biblia»</div>
        <div className="adv-text">La propia Elena escribió: <strong>«La Biblia y solamente la Biblia es nuestra regla de fe»</strong>. La IASD afirma el principio de <em>sola Scriptura</em>: la Biblia es la autoridad suprema. Los escritos de Elena White se consideran un don profético (Apoc. 19:10) que <strong>confirma y refuerza</strong> las verdades bíblicas, sin sustituirlas.</div>
      </div>
      <div className="adv-card">
        <div className="adv-tag red"><X size={12}/> Acusación: «Se creen los únicos cristianos verdaderos»</div>
        <div className="adv-text">La IASD reconoce que <strong>los seguidores de Dios existen en todas las confesiones</strong> (Juan 10:16). La identificación como «remanente» (Apoc. 12:17) es una designación humilde, no un mérito exclusivo. El Pew Research Center identificó a la IASD como <strong>el grupo religioso con mayor diversidad racial en EE.UU.</strong></div>
      </div>
      <div className="adv-card">
        <div className="adv-tag blue"><HelpCircle size={12}/> Perspectiva importante</div>
        <div className="adv-text">Ninguna iglesia es perfecta. Pueden existir individuos con comportamiento sectario, pero eso no refleja la teología oficial. Incluso <strong>Jesús fue acusado de fundar una secta</strong> (Luc. 23:2-5), y Pablo fue llamado «cabecilla de la secta de los nazarenos» (Hech. 24:5). La IASD promueve <strong>transparencia, estudio personal de la Biblia y liderazgo servicial</strong>.</div>
      </div>
    </div>
  );
}

function BibleSection() {
  const [openV,setOpenV]=useState(null);
  return (
    <div className="ct fin">
      <h2 className="st"><ScrollText /> Versículos clave</h2>
      <p style={{color:"var(--tx2)",fontSize:".88rem",marginBottom:".8rem",lineHeight:1.5}}>Tocá cada referencia para leer el texto completo (RVR1960).</p>
      {VERSES.map((v,i)=>(
        <div key={i} className={`verse ${v.key?'kv':''}`} onClick={()=>setOpenV(openV===i?null:i)}>
          <div className="verse-ref">
            {v.key&&<Star size={12} style={{color:"var(--warn)"}}/>}
            {v.ref}
            {v.key&&<span style={{color:"var(--warn)",fontSize:".52rem",letterSpacing:".08em"}}>TEXTO BASE</span>}
          </div>
          {openV!==i&&<div className="verse-hint"><ChevronRight size={12}/>Toca para leer</div>}
          <div className={`vt ${openV===i?'open':''}`}>«{v.text}»</div>
        </div>
      ))}
    </div>
  );
}

function QuizSection() {
  const [cur,setCur]=useState(0);
  const [sel,setSel]=useState(null);
  const [score,setScore]=useState(0);
  const [hist,setHist]=useState([]);
  const [done,setDone]=useState(false);

  const pick=(idx)=>{if(sel!==null)return;setSel(idx);const ok=idx===QUIZ_DATA[cur].ans;if(ok)setScore(s=>s+1);setHist(h=>[...h,ok])};
  const next=()=>{if(cur+1>=QUIZ_DATA.length)return setDone(true);setCur(c=>c+1);setSel(null)};
  const retry=()=>{setCur(0);setSel(null);setScore(0);setHist([]);setDone(false)};

  if(done){
    const pct=Math.round((score/QUIZ_DATA.length)*100);
    const msg=pct===100?"¡Perfecto! Estás listo para ser un apologista.":pct>=70?"¡Muy bien! Tenés una base sólida para defender tu fe.":"Hay espacio para crecer. ¡Repasá los versículos y volvé a intentar!";
    return(
      <div className="ct fin">
        <h2 className="st"><Brain /> Resultados</h2>
        <div className="q-result">
          <div className="q-big">{score}/{QUIZ_DATA.length}</div>
          <div className="q-pct">{pct}% correctas</div>
          <div className="q-msg">{msg}</div>
          <button className="q-retry" onClick={retry}><RotateCcw size={16}/>Intentar de nuevo</button>
        </div>
      </div>
    );
  }

  const q=QUIZ_DATA[cur];
  return(
    <div className="ct fin">
      <h2 className="st"><Brain /> Quiz</h2>
      <div className="q-bar">{QUIZ_DATA.map((_,i)=>(<div key={i} className={`q-dot ${i<cur?(hist[i]?'ok':'no'):i===cur?'now':''}`}/>))}</div>
      <div className="q-text">{q.q}</div>
      {q.opts.map((o,i)=>{
        let cls='q-opt';
        if(sel!==null){if(i===q.ans)cls+=' right';else if(i===sel&&i!==q.ans)cls+=' miss';else cls+=' dim'}
        return <button key={i} className={cls} onClick={()=>pick(i)}>{o}</button>
      })}
      {sel!==null&&(
        <>
          <div className="q-why">{q.why}</div>
          <button className="q-next" onClick={next}>{cur+1>=QUIZ_DATA.length?'Ver resultados':'Siguiente'}<ArrowRight size={16}/></button>
        </>
      )}
    </div>
  );
}

function CloseSection() {
  return (
    <div className="ct fin">
      <h2 className="st"><MessageCircle /> Para pensar</h2>
      <p style={{color:"var(--tx2)",fontSize:".88rem",marginBottom:".8rem",lineHeight:1.5}}>Preguntas para dialogar. No hay respuestas incorrectas.</p>
      {REFLECTIONS.map((q,i)=>(
        <div key={i} className="ref-card">
          <div className="ref-n">PREGUNTA {i+1}</div>
          <div className="ref-q">{q}</div>
        </div>
      ))}
      <div className="personal-card">
        <h4><Flame size={18}/> Para tu vida</h4>
        <p>
          En tu liceo o universidad, en redes sociales, en tu grupo de amigos — hay voces que van a cuestionar lo que creés. 
          Algunos con curiosidad genuina, otros con burla. <strong>No necesitás tener todas las respuestas</strong>, 
          pero sí podés tener la actitud correcta: responder con <strong style={{color:"var(--acc3)"}}>respeto, 
          honestidad y conocimiento de lo que dice la Biblia</strong>.
        </p>
        <div className="dv"/>
        <p>
          La próxima vez que alguien te pregunte algo incómodo sobre tu fe, en vez de cerrarte o enojarte, 
          probá algo distinto: <strong>escuchá primero, después respondé con lo que sabés, y si no sabés, 
          decí "no sé, pero lo voy a buscar"</strong>. Eso ya es apologética. Eso ya es ser como los bereanos 
          que escudriñaban todo. Eso ya es vivir 1 Pedro 3:15.
        </p>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────

export default function App() {
  const [tab,setTab]=useState("inicio");
  const [teacher,setTeacher]=useState(false);
  const [taps,setTaps]=useState(0);
  const [hintState,setHintState]=useState(""); // "" | "counting" | "active"
  const navRef=useRef(null);
  const scrollRef=useRef(null);
  const tapTimer=useRef(null);

  const handleSecretTap=useCallback(()=>{
    setTaps(prev=>{
      const next=prev+1;
      clearTimeout(tapTimer.current);
      if(next>=5){
        setTeacher(t=>!t);
        setHintState("active");
        setTimeout(()=>setHintState(""),2500);
        return 0;
      }
      if(next>=2)setHintState("counting");
      tapTimer.current=setTimeout(()=>{setTaps(0);setHintState("")},3000);
      return next;
    });
  },[]);

  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTo({top:0,behavior:"instant"})},[tab]);
  useEffect(()=>{
    if(navRef.current){
      const el=navRef.current.querySelector('.on');
      if(el)el.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    }
  },[tab]);

  function renderContent(){
    if(tab==="inicio")return teacher?<GuideSection/>:<WelcomeSection/>;
    if(tab==="sectas")return teacher?<CultsTeacher/>:<CultsStudent/>;
    switch(tab){
      case "contexto":return <ContextSection/>;
      case "comparar":return <CompareSection/>;
      case "iasd":return <IASDSection/>;
      case "biblia":return <BibleSection/>;
      case "quiz":return <QuizSection/>;
      case "cierre":return <CloseSection/>;
      default:return null;
    }
  }

  return(
    <>
      <style>{S}</style>
      <div className="app">
        <div className="scroll-area" ref={scrollRef}>
          <Hero onTap={handleSecretTap}/>
          <div className={`secret-bar ${hintState==='counting'?'vis':hintState==='active'?'active':''}`}>
            {hintState==='active'?(teacher?'👨‍🏫 Modo maestro activado':'📱 Modo alumno activado')
             :hintState==='counting'?`${5-taps} toques más...`:''}
          </div>
          <div key={tab+String(teacher)}>{renderContent()}</div>
        </div>
        <nav className="nav" ref={navRef}>
          {TABS.map(t=>(
            <button key={t.id} className={tab===t.id?'on':''} onClick={()=>setTab(t.id)}>
              <t.Icon/>{t.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
