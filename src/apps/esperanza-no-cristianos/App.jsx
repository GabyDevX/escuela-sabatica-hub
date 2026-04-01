import { useState, useRef, useCallback, useEffect } from "react";
import {
  Star, BookOpen, ChevronDown, ChevronUp, Check, X,
  RotateCcw, Users, Globe, Shield, Flame, Heart,
  BookMarked, ZoomIn, Clock, Search, AlertCircle, Zap,
  MessageCircle, MapPin, Eye, Target
} from "lucide-react";

/* ─── ESTILOS GLOBALES ─────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg:#04060f; --bg2:#070a18; --bg3:#0b0f22;
  --surf:#0f142e; --surf2:#151c3a;
  --brd:#1e2648; --brd2:#2d3868;
  --tx:#eef0fa; --tx2:#8890c0; --tx3:#505878;
  --acc:#d4af37; --acc2:#e8c84a; --acc3:#f5e199;
  --ok:#10b981; --ok-d:rgba(16,185,129,.1);
  --err:#f43f5e; --err-d:rgba(244,63,94,.1);
  --warn:#c084fc; --warn-d:rgba(192,132,252,.1);
  --star:#d4af37; --silver:#a8b4d0;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; background: var(--bg); color: var(--tx); }
body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

.app { max-width: 440px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }

.scroll-area { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; overscroll-behavior-y: contain; }
.scroll-area::-webkit-scrollbar { width: 3px; }
.scroll-area::-webkit-scrollbar-track { background: transparent; }
.scroll-area::-webkit-scrollbar-thumb { background: var(--brd2); border-radius: 2px; }

/* HERO */
.hero {
  position: relative; overflow: hidden;
  background: linear-gradient(175deg, #06091a 0%, #0c1130 50%, #04060f 100%);
  padding: 2.5rem 1.5rem 2rem;
  cursor: pointer; user-select: none;
}
.hero::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 70% 50% at 50% 10%, rgba(212,175,55,.12) 0%, transparent 65%);
  animation: pulse-bg 5s ease-in-out infinite;
}
.hero::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,.35), transparent);
}
.hero-stars {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 12% 15%, rgba(255,255,255,.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 28% 8%, rgba(212,175,55,.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 45% 20%, rgba(255,255,255,.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 63% 6%, rgba(255,255,255,.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 78% 18%, rgba(212,175,55,.5) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 88% 10%, rgba(255,255,255,.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 35% 35%, rgba(255,255,255,.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 30%, rgba(212,175,55,.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 92% 28%, rgba(255,255,255,.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 8% 40%, rgba(255,255,255,.3) 0%, transparent 100%),
    radial-gradient(1px 1px at 70% 38%, rgba(255,255,255,.35) 0%, transparent 100%),
    radial-gradient(2px 2px at 20% 25%, rgba(212,175,55,.8) 0%, transparent 100%);
}
@keyframes pulse-bg { 0%,100%{opacity:.5} 50%{opacity:1} }

.hero-tag {
  font-family: 'IBM Plex Mono', monospace; font-size: .58rem; letter-spacing: .12em;
  color: var(--acc2); text-transform: uppercase; margin-bottom: .75rem;
  display: flex; align-items: center; gap: .4rem;
}
.hero-tag span { background: rgba(212,175,55,.12); border: 1px solid rgba(212,175,55,.28); padding: .2rem .5rem; border-radius: 4px; }
.hero-title {
  font-family: 'Source Serif 4', serif; font-size: 1.95rem; font-weight: 700;
  line-height: 1.18; color: var(--tx); margin-bottom: .5rem;
}
.hero-title em { font-style: italic; color: var(--acc2); }
.hero-sub {
  font-family: 'DM Sans', sans-serif; font-size: .92rem; color: var(--tx2);
  margin-bottom: 1.2rem; line-height: 1.5;
}
.hero-verse-chip {
  display: inline-flex; align-items: center; gap: .4rem;
  background: rgba(212,175,55,.1); border: 1px solid rgba(212,175,55,.28);
  border-radius: 8px; padding: .35rem .75rem;
  font-family: 'IBM Plex Mono', monospace; font-size: .72rem; color: var(--acc3);
}

/* SECRET BAR */
.secret-bar {
  text-align: center; padding: .2rem;
  font-size: .6rem; font-family: 'IBM Plex Mono', monospace;
  transition: color .5s; letter-spacing: .08em;
}

/* NAV */
.nav {
  flex-shrink: 0; background: var(--bg2);
  border-top: 1px solid var(--brd);
  display: flex; width: 100%;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.nav button {
  flex: 1 0 auto; min-width: 52px; min-height: 56px;
  padding: .6rem .4rem .5rem;
  background: none; border: none; cursor: pointer; color: var(--tx3);
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  font-size: .52rem; font-family: 'IBM Plex Mono', monospace; letter-spacing: .04em;
  text-transform: uppercase; position: relative; transition: color .2s;
}
.nav button svg { width: 19px; height: 19px; }
.nav button.on { color: var(--acc2); }
.nav button.on::after {
  content: ''; position: absolute; inset: 4px 5px;
  background: rgba(212,175,55,.1); border-radius: 10px; z-index: 0;
}
.nav button > * { position: relative; z-index: 1; }

/* SECTION FADE */
.section-wrap { animation: fadein .25s ease; padding: 0 0 2rem; }
@keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

/* SECTION TITLE */
.sec-title {
  font-family: 'Source Serif 4', serif; font-size: 1.65rem; font-weight: 700;
  color: var(--tx); margin: 1.5rem 1.25rem .25rem; line-height: 1.2;
}
.sec-title em { color: var(--acc2); font-style: italic; }
.sec-sub { font-size: .88rem; color: var(--tx2); margin: 0 1.25rem 1.25rem; line-height: 1.5; }

/* CARD */
.card {
  background: var(--surf); border: 1px solid var(--brd);
  border-radius: 16px; margin: 0 1rem .875rem; padding: 1.1rem 1.15rem;
}
.card-title {
  font-family: 'Source Serif 4', serif; font-size: 1.05rem; font-weight: 600;
  color: var(--tx); margin-bottom: .5rem;
}
.card-body { font-size: 1rem; color: var(--tx2); line-height: 1.65; }

/* DIVIDER */
.divider { height: 1px; background: var(--brd); margin: .5rem 1.25rem 1rem; }

/* VERSE CARD */
.verse-card {
  background: var(--surf); border-radius: 14px; margin: 0 1rem .75rem;
  border-left: 3px solid var(--acc); overflow: hidden; cursor: pointer;
}
.verse-card.base { border-left: 4px solid var(--acc2); }
.verse-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: .9rem 1.1rem; gap: .5rem;
}
.verse-ref {
  font-family: 'Source Serif 4', serif; font-size: 1rem; font-weight: 600; color: var(--tx);
}
.verse-tags { display: flex; gap: .4rem; align-items: center; flex-wrap: wrap; }
.verse-tag {
  font-family: 'IBM Plex Mono', monospace; font-size: .58rem; letter-spacing: .08em;
  text-transform: uppercase; padding: .18rem .45rem; border-radius: 4px;
}
.verse-tag.base { background: rgba(212,175,55,.12); color: var(--acc2); border: 1px solid rgba(212,175,55,.3); }
.verse-tag.theme { background: rgba(168,180,208,.08); color: var(--silver); border: 1px solid rgba(168,180,208,.18); }
.verse-body {
  font-family: 'DM Sans', sans-serif; font-size: 1.05rem; line-height: 1.75;
  color: var(--tx); padding: 0 1.1rem 1rem;
  border-top: 1px solid var(--brd);
}
.verse-context { font-size: .88rem; color: var(--tx2); margin-top: .5rem; font-style: italic; }

/* VERSE GROUP LABEL */
.verse-group-label {
  font-family: 'IBM Plex Mono', monospace; font-size: .65rem; letter-spacing: .12em;
  text-transform: uppercase; color: var(--tx3); margin: 1.1rem 1.25rem .5rem;
}

/* INTERACTIVE — CATEGORIZE */
.cat-item {
  background: var(--surf); border: 1.5px solid var(--brd); border-radius: 12px;
  margin: 0 1rem .6rem; padding: .9rem 1.1rem; cursor: pointer;
  transition: border-color .2s, background .2s;
}
.cat-item:hover { border-color: var(--brd2); }
.cat-item.selected-a { border-color: var(--ok); background: var(--ok-d); }
.cat-item.selected-b { border-color: var(--acc); background: rgba(212,175,55,.1); }
.cat-item.selected-c { border-color: var(--warn); background: var(--warn-d); }
.cat-item-title { font-size: .97rem; font-weight: 600; color: var(--tx); margin-bottom: .3rem; line-height: 1.4; }
.cat-item-hint { font-size: .88rem; color: var(--tx3); line-height: 1.4; }
.cat-item.revealed .cat-item-hint { color: var(--tx2); }

.cat-buttons { display: flex; gap: .5rem; margin: 0 1rem .5rem; flex-wrap: wrap; }
.cat-btn {
  flex: 1; min-width: 90px; padding: .55rem .6rem; border-radius: 10px; border: 1.5px solid;
  cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: .85rem; font-weight: 600;
  transition: opacity .2s, transform .1s;
}
.cat-btn:active { transform: scale(.97); }
.cat-btn.nature { border-color: var(--ok); background: var(--ok-d); color: var(--ok); }
.cat-btn.dreams { border-color: var(--acc); background: rgba(212,175,55,.1); color: var(--acc2); }
.cat-btn.angels { border-color: var(--warn); background: var(--warn-d); color: var(--warn); }
.cat-btn.inactive { opacity: .45; }

.cat-feedback {
  margin: 0 1rem .75rem; padding: .85rem 1rem; border-radius: 12px;
  border: 1px solid var(--ok); background: var(--ok-d); color: var(--ok);
  font-size: .92rem; line-height: 1.55;
}
.cat-feedback.partial { border-color: var(--warn); background: var(--warn-d); color: var(--warn); }

/* COMPARE TABLE */
.compare-wrap { margin: 0 1rem .875rem; }
.compare-header {
  display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-bottom: .5rem;
}
.compare-col-header {
  font-family: 'IBM Plex Mono', monospace; font-size: .68rem; letter-spacing: .1em;
  text-transform: uppercase; padding: .5rem .75rem; border-radius: 8px;
  text-align: center;
}
.compare-col-header.left { background: var(--err-d); color: var(--err); border: 1px solid rgba(244,63,94,.2); }
.compare-col-header.right { background: var(--ok-d); color: var(--ok); border: 1px solid rgba(16,185,129,.2); }
.compare-row { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-bottom: .5rem; }
.compare-cell {
  border-radius: 10px; padding: .7rem .8rem;
  font-size: .93rem; line-height: 1.5;
}
.compare-cell.left { background: rgba(244,63,94,.06); border: 1px solid rgba(244,63,94,.15); color: var(--tx2); }
.compare-cell.right { background: rgba(16,185,129,.06); border: 1px solid rgba(16,185,129,.15); color: var(--tx2); }

/* QUIZ */
.quiz-progress-bar { height: 3px; background: var(--brd); margin: 0 1rem 1.25rem; border-radius: 2px; overflow: hidden; }
.quiz-progress-fill { height: 100%; background: linear-gradient(90deg, var(--acc), var(--acc2)); transition: width .35s ease; border-radius: 2px; }
.quiz-q {
  font-family: 'Source Serif 4', serif; font-size: 1.25rem; line-height: 1.45;
  color: var(--tx); margin: 0 1rem 1.1rem; font-weight: 600;
}
.quiz-counter { font-family: 'IBM Plex Mono', monospace; font-size: .7rem; color: var(--tx3); margin: 0 1rem .6rem; }
.quiz-opt {
  display: flex; align-items: flex-start; gap: .75rem;
  background: var(--surf); border: 1.5px solid var(--brd); border-radius: 12px;
  margin: 0 1rem .6rem; padding: .9rem 1rem; cursor: pointer;
  font-size: 1rem; color: var(--tx2); line-height: 1.4;
  transition: border-color .15s, background .15s;
}
.quiz-opt:hover { border-color: var(--brd2); }
.quiz-opt.correct { border-color: var(--ok); background: var(--ok-d); color: var(--tx); }
.quiz-opt.wrong { border-color: var(--err); background: var(--err-d); color: var(--tx2); }
.quiz-opt.disabled { cursor: default; }
.quiz-opt-letter {
  font-family: 'IBM Plex Mono', monospace; font-size: .75rem; font-weight: 500;
  width: 22px; height: 22px; flex-shrink: 0; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  background: var(--surf2); color: var(--tx3); margin-top: .05rem;
}
.quiz-opt.correct .quiz-opt-letter { background: var(--ok); color: #fff; }
.quiz-opt.wrong .quiz-opt-letter { background: var(--err); color: #fff; }
.quiz-explanation {
  margin: .25rem 1rem .85rem; padding: .9rem 1rem; border-radius: 12px;
  background: var(--surf2); border-left: 3px solid var(--acc);
  font-size: .97rem; color: var(--tx2); line-height: 1.55;
}
.quiz-explanation strong { color: var(--acc3); font-weight: 600; }
.quiz-next-btn {
  display: block; width: calc(100% - 2rem); margin: .25rem 1rem;
  background: linear-gradient(135deg, var(--acc), var(--acc2)); color: #09091a;
  border: none; border-radius: 12px; padding: .85rem; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
  transition: opacity .2s;
}
.quiz-next-btn:hover { opacity: .9; }

.quiz-result {
  text-align: center; padding: 2rem 1.25rem 1rem;
  animation: fadein .3s ease;
}
.quiz-result-score {
  font-family: 'Source Serif 4', serif; font-size: 3.5rem; font-weight: 700;
  color: var(--acc2); line-height: 1;
}
.quiz-result-label { font-size: .88rem; color: var(--tx2); margin-top: .25rem; font-family: 'IBM Plex Mono', monospace; }
.quiz-result-msg { font-size: 1.05rem; color: var(--tx); margin: 1.1rem 0 1.5rem; line-height: 1.6; }
.quiz-retry-btn {
  display: inline-flex; align-items: center; gap: .5rem;
  background: var(--surf); border: 1px solid var(--brd2); color: var(--acc2);
  padding: .75rem 1.5rem; border-radius: 12px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: .95rem; font-weight: 600;
}

/* REFLECTION CARDS */
.reflect-card {
  background: var(--surf); border: 1px solid var(--brd); border-radius: 14px;
  margin: 0 1rem .75rem; padding: 1.1rem 1.15rem;
  display: flex; gap: .85rem; align-items: flex-start;
}
.reflect-num {
  font-family: 'IBM Plex Mono', monospace; font-size: .85rem; font-weight: 500;
  color: var(--acc2); background: rgba(212,175,55,.1); border: 1px solid rgba(212,175,55,.22);
  width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: .05rem;
}
.reflect-q { font-size: 1rem; color: var(--tx); line-height: 1.6; }

.for-you-card {
  background: linear-gradient(135deg, rgba(212,175,55,.07), rgba(212,175,55,.03));
  border: 1.5px solid rgba(212,175,55,.22); border-radius: 16px;
  margin: .5rem 1rem 0; padding: 1.25rem;
}
.for-you-header {
  display: flex; align-items: center; gap: .6rem; margin-bottom: .85rem;
  font-family: 'Source Serif 4', serif; font-size: 1.05rem; font-weight: 700; color: var(--acc3);
}
.for-you-body { font-size: 1rem; color: var(--tx2); line-height: 1.7; }
.for-you-body p + p { margin-top: .75rem; }
.for-you-body strong { color: var(--tx); font-weight: 600; }
.for-you-cta {
  margin-top: 1rem; padding: .85rem; border-radius: 10px;
  background: rgba(212,175,55,.1); border: 1px solid rgba(212,175,55,.22);
  font-size: .95rem; color: var(--acc3); font-weight: 600; line-height: 1.5;
}

/* GUIDE (modo maestro) */
.guide-step {
  background: var(--surf); border: 1px solid var(--brd); border-radius: 14px;
  margin: 0 1rem .6rem; padding: .95rem 1.1rem;
  display: flex; gap: .85rem; align-items: flex-start;
}
.guide-time {
  font-family: 'IBM Plex Mono', monospace; font-size: .72rem; color: var(--warn);
  background: var(--warn-d); border: 1px solid rgba(245,158,11,.2);
  padding: .25rem .5rem; border-radius: 6px; white-space: nowrap; flex-shrink: 0; margin-top: .1rem;
}
.guide-step-title { font-size: .97rem; font-weight: 600; color: var(--tx); margin-bottom: .25rem; }
.guide-step-body { font-size: .92rem; color: var(--tx2); line-height: 1.55; }
.guide-step-body li { margin-left: 1rem; margin-top: .25rem; }

/* EXPANDABLE MASTER ITEM */
.master-item {
  background: var(--surf); border: 1px solid var(--brd); border-radius: 13px;
  margin: 0 1rem .6rem; overflow: hidden;
}
.master-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: .9rem 1.1rem; cursor: pointer;
}
.master-title { font-size: .97rem; font-weight: 600; color: var(--tx); }
.master-body { padding: 0 1.1rem .9rem; font-size: .92rem; color: var(--tx2); line-height: 1.6; border-top: 1px solid var(--brd); padding-top: .75rem; }
.master-body p + p { margin-top: .5rem; }

/* ACCENT BADGE */
.badge {
  display: inline-flex; align-items: center; gap: .3rem;
  font-family: 'IBM Plex Mono', monospace; font-size: .62rem; letter-spacing: .08em;
  text-transform: uppercase; padding: .22rem .55rem; border-radius: 5px;
  background: rgba(212,175,55,.1); color: var(--acc3); border: 1px solid rgba(212,175,55,.22);
  margin-bottom: .6rem;
}

/* INFO BOX */
.info-box {
  background: var(--surf2); border: 1px solid var(--brd2); border-radius: 12px;
  margin: 0 1rem .875rem; padding: 1rem 1.1rem;
  font-size: .95rem; color: var(--tx2); line-height: 1.6;
}
.info-box strong { color: var(--tx); }
.info-box.warn { border-color: rgba(245,158,11,.25); background: var(--warn-d); }
.info-box.ok { border-color: rgba(16,185,129,.25); background: var(--ok-d); }

/* STAT CHIPS */
.stat-row { display: flex; gap: .5rem; margin: 0 1rem .875rem; flex-wrap: wrap; }
.stat-chip {
  flex: 1; min-width: 100px; background: var(--surf); border: 1px solid var(--brd);
  border-radius: 12px; padding: .75rem .8rem; text-align: center;
}
.stat-num { font-family: 'Source Serif 4', serif; font-size: 1.4rem; font-weight: 700; color: var(--acc2); }
.stat-label { font-size: .75rem; color: var(--tx3); margin-top: .15rem; font-family: 'IBM Plex Mono', monospace; }
`;

/* ─── DATOS DE LA LECCIÓN ─────────────────────────────────── */
const SEMANA = 13;
const TITULO = "Esperanza para los no cristianos";
const TEXTO_BASE = "Mateo 15:21-28";
const TEXTO_BASE_TEMA = "Apologética";

/* ─── VERSÍCULOS (RVR1960) ─────────────────────────────────── */
const VERSICULOS = [
  {
    ref: "Mateo 15:21-28",
    base: true,
    tema: "Texto base",
    grupos: ["La mujer cananea"],
    texto: `Saliendo Jesús de allí, se fue a la región de Tiro y de Sidón. Y he aquí una mujer cananea que había salido de aquella región clamaba, diciéndole: ¡Señor, Hijo de David, ten misericordia de mí! Mi hija es gravemente atormentada por un demonio. Pero Jesús no le respondió palabra. Entonces acercándose sus discípulos, le rogaron, diciendo: Despídela, pues da voces tras nosotros. Él respondiendo, dijo: No soy enviado sino a las ovejas perdidas de la casa de Israel. Entonces ella vino y se postró ante él, diciendo: ¡Señor, socórreme! Respondiendo él, dijo: No está bien tomar el pan de los hijos, y echarlo a los perrillos. Y ella dijo: Sí, Señor; pero aun los perrillos comen de las migajas que caen de la mesa de sus amos. Entonces respondiendo Jesús, dijo: Oh mujer, grande es tu fe; hágase contigo como quieres. Y su hija fue sanada desde aquella hora.`,
    contexto: "El único milagro registrado en la región de Tiro y Sidón. Jesús cruza fronteras culturales para revelar que la fe —no la etnia— acerca a las personas a Dios."
  },
  {
    ref: "Génesis 22:17-18",
    grupos: ["Deseo de Dios de salvar a todos"],
    texto: `De cierto te bendeciré, y multiplicaré tu descendencia como las estrellas del cielo y como la arena que está a la orilla del mar; y tu descendencia poseerá las puertas de sus enemigos. En tu simiente serán benditas todas las naciones de la tierra, por cuanto obedeciste a mi voz.`,
    contexto: "La promesa de Abraham no era solo para sus descendientes directos, sino para todas las naciones de la tierra."
  },
  {
    ref: "Salmos 19:1-4",
    grupos: ["Dios habla a través de la naturaleza"],
    texto: `Los cielos cuentan la gloria de Dios, y el firmamento anuncia la obra de sus manos. Un día emite palabra a otro día, y una noche a otra noche declara sabiduría. No hay lenguaje, ni palabras, ni es oída su voz. Por toda la tierra salió su voz, y hasta el extremo del mundo sus palabras.`,
    contexto: "La creación es un testimonio universal de Dios que llega a todos, sin importar idioma ni acceso a las Escrituras."
  },
  {
    ref: "Hechos 17:26-27",
    grupos: ["Dios habla a través de la naturaleza"],
    texto: `Y de una sangre ha hecho todo el linaje de los hombres, para que habiten sobre toda la faz de la tierra; y les ha prefijado el orden de los tiempos, y los límites de su habitación; para que busquen a Dios, si en alguna manera, palpando, puedan hallarle, aunque ciertamente no está lejos de cada uno de nosotros.`,
    contexto: "Pablo en el Areópago de Atenas, explicando que Dios no está lejos de ningún ser humano."
  },
  {
    ref: "Juan 1:9",
    grupos: ["Deseo de Dios de salvar a todos"],
    texto: `Aquella luz verdadera, que alumbra a todo hombre, venía a este mundo.`,
    contexto: "Juan declara que la luz de Cristo llega a toda la humanidad, no solo a quienes conocen el evangelio explícitamente."
  },
  {
    ref: "Romanos 1:20",
    grupos: ["Dios habla a través de la naturaleza"],
    texto: `Porque las cosas invisibles de él, su eterno poder y deidad, se hacen claramente visibles desde la creación del mundo, siendo entendidas por medio de las cosas hechas, de modo que no tienen excusa.`,
    contexto: "Pablo argumenta que todos son responsables de la luz que Dios les ha revelado a través de la creación."
  },
  {
    ref: "Romanos 2:12-15",
    grupos: ["La conciencia como revelación"],
    texto: `Porque todos los que sin ley han pecado, sin ley también perecerán; y todos los que bajo la ley han pecado, por la ley serán juzgados; porque no son los oidores de la ley los justos ante Dios, sino los hacedores de la ley serán justificados. Porque cuando los gentiles que no tienen ley, hacen por naturaleza lo que es de la ley, éstos, aunque no tengan ley, son ley para sí mismos, mostrando la obra de la ley escrita en sus corazones, dando testimonio su conciencia, y acusándoles o defendiéndoles sus razonamientos.`,
    contexto: "Dios ha dado una conciencia a todos los seres humanos; incluso quienes no tienen las Escrituras tienen un sentido moral interno."
  },
  {
    ref: "Mateo 28:19-20",
    grupos: ["La misión cristiana"],
    texto: `Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo.`,
    contexto: "La Gran Comisión: el método preferido de Dios para difundir el evangelio son los seres humanos que lo comparten."
  },
  {
    ref: "Lucas 19:40",
    grupos: ["La misión cristiana"],
    texto: `Él, respondiendo, les dijo: Os digo que si éstos callaran, las piedras clamarían.`,
    contexto: "Jesús enseña que si los seres humanos no proclaman el evangelio, Dios usará otros medios."
  },
  {
    ref: "Deuteronomio 7:1-5",
    grupos: ["La mujer cananea — contexto"],
    texto: `Cuando Jehová tu Dios te haya introducido en la tierra en la cual entrarás para tomarla, y haya echado de delante de ti a muchas naciones, al heteo, al gergeseo, al amorreo, al cananeo, al ferezeo, al heveo y al jebuseo, siete naciones mayores y más poderosas que tú, y Jehová tu Dios las haya entregado delante de ti, y las hayas derrotado, las destruirás del todo; no harás con ellas alianza, ni tendrás de ellas misericordia. Y no emparentarás con ellas; no darás tu hija a su hijo, ni tomarás a su hija para tu hijo. Porque desviará a tu hijo de en pos de mí, y servirán a dioses ajenos; y el furor de Jehová se encenderá sobre vosotros, y te destruirá pronto. Mas así habéis de hacer con ellos: sus altares destruiréis, y quebraréis sus estatuas, y destruiréis sus imágenes de Asera, y quemaréis sus esculturas en el fuego.`,
    contexto: "Contexto histórico del origen cananeo de la mujer. Los discípulos tenían razones culturales para rechazarla."
  },
  {
    ref: "Números 22:28-30",
    grupos: ["Dios habla de formas inesperadas"],
    texto: `Entonces Jehová abrió la boca al asna, y ella dijo a Balaam: ¿Qué te he hecho, que me has azotado estas tres veces? Y Balaam respondió al asna: Porque te has burlado de mí. ¡Ojalá tuviera espada en mi mano, que ahora te mataría! Y el asna dijo a Balaam: ¿No soy yo tu asna, sobre la que has cabalgado desde que tú me tienes hasta este día? ¿He acostumbrado hacerte así? Y él respondió: No.`,
    contexto: "Dios habló a través de un asna. Ejemplo de que Dios no está limitado a los medios convencionales."
  },
  {
    ref: "1 Reyes 19:11-13",
    grupos: ["Dios habla de formas inesperadas"],
    texto: `Él le dijo: Sal fuera, y ponte en el monte delante de Jehová. Y he aquí Jehová que pasaba, y un grande y poderoso viento que rompía los montes, y quebraba las peñas delante de Jehová; pero Jehová no estaba en el viento. Y tras el viento un terremoto; pero Jehová no estaba en el terremoto. Y tras el terremoto un fuego; pero Jehová no estaba en el fuego. Y tras el fuego un silbo apacible y delicado. Y cuando lo oyó Elías, cubrió su rostro con su manto, y salió, y se puso a la puerta de la cueva. Y he aquí vino a él una voz, que le dijo: ¿Qué haces aquí, Elías?`,
    contexto: "Dios habló a Elías con una voz suave y delicada. A veces Dios se comunica de maneras inesperadas y sutiles."
  },
  {
    ref: "Job 12:7-10",
    grupos: ["Dios habla a través de la naturaleza"],
    texto: `Y en verdad pregunta ahora a las bestias, y ellas te enseñarán; a las aves de los cielos, y ellas te lo mostrarán; o habla a la tierra, y ella te enseñará; los peces del mar te lo declararán también. ¿Qué cosa de todas estas no entiende que la mano de Jehová la hizo? En su mano está el alma de todo viviente, y el hálito de todo el género humano.`,
    contexto: "Job describe cómo la creación entera proclama la obra de Dios."
  },
  {
    ref: "Mateo 27:19",
    grupos: ["Dios habla de formas inesperadas"],
    texto: `Y estando él sentado en el tribunal, su mujer le mandó decir: No tengas nada que ver con ese justo; porque hoy he padecido mucho en sueños por causa de él.`,
    contexto: "Dios habló a la esposa de Pilato a través de un sueño, advirtiendo sobre la injusticia de condenar a Jesús."
  },
  {
    ref: "Lucas 19:39-40",
    grupos: ["La misión cristiana"],
    texto: `Entonces algunos de los fariseos de entre la multitud le dijeron: Maestro, reprende a tus discípulos. Él, respondiendo, les dijo: Os digo que si éstos callaran, las piedras clamarían.`,
    contexto: "La proclamación del evangelio es tan urgente que si los humanos guardan silencio, la creación misma hablaría."
  },
  {
    ref: "Hechos 10:1-8",
    grupos: ["Dios habla de formas inesperadas"],
    texto: `Había en Cesarea un hombre llamado Cornelio, centurión de la compañía llamada la Italiana, piadoso y temeroso de Dios con toda su casa, y que hacía muchas limosnas al pueblo, y oraba a Dios siempre. Este vio claramente en una visión, como a la hora novena del día, que un ángel de Dios entraba donde él estaba, y le decía: Cornelio. Él, mirándole fijamente, y atemorizado, dijo: ¿Qué es, Señor? Y le dijo: Tus oraciones y tus limosnas han subido para memoria delante de Dios. Envía, pues, ahora hombres a Jope, y haz venir a Simón, el que tiene por sobrenombre Pedro. Este posa en casa de cierto Simón curtidor, que tiene su casa junto al mar; él te dirá lo que es necesario que hagas. Ido el ángel que hablaba con Cornelio, este llamó a dos de sus criados, y a un devoto soldado de los que le asistían; a los cuales, habiéndoles declarado todo, los envió a Jope.`,
    contexto: "Cornelio era un gentil que buscaba a Dios con sinceridad. Dios le envió una visión y lo conectó con Pedro para recibir el evangelio completo."
  },
  {
    ref: "Isaías 49:6",
    grupos: ["Deseo de Dios de salvar a todos"],
    texto: `Dijo: Poco es para mí que tú seas mi siervo para levantar las tribus de Jacob, y para que restaures el remanente de Israel; también te di por luz de las naciones, para que seas mi salvación hasta lo postrero de la tierra.`,
    contexto: "El Mesías vendría no solo para Israel, sino como luz para todas las naciones hasta los confines de la tierra."
  },
  {
    ref: "Juan 12:32",
    grupos: ["Deseo de Dios de salvar a todos"],
    texto: `Y yo, si fuere levantado de la tierra, a todos atraeré a mí mismo.`,
    contexto: "Jesús promete que su sacrificio en la cruz tendrá un alcance universal: atraerá a todos los seres humanos."
  },
  {
    ref: "1 Timoteo 2:3-4",
    grupos: ["Deseo de Dios de salvar a todos"],
    texto: `Porque esto es bueno y agradable delante de Dios nuestro Salvador, el cual quiere que todos los hombres sean salvos y vengan al conocimiento de la verdad.`,
    contexto: "El deseo sincero de Dios es que toda persona sea salva, sin excepción de origen o historia."
  },
  {
    ref: "2 Pedro 3:9",
    grupos: ["Deseo de Dios de salvar a todos"],
    texto: `El Señor no retarda su promesa, según algunos la tienen por tardanza, sino que es paciente para con nosotros, no queriendo que ninguno perezca, sino que todos procedan al arrepentimiento.`,
    contexto: "La paciencia de Dios tiene una razón: no desea que nadie se pierda."
  },
  {
    ref: "Apocalipsis 7:9",
    grupos: ["La esperanza final"],
    texto: `Después de esto miré, y he aquí una gran multitud, la cual nadie podía contar, de todas naciones y tribus y pueblos y lenguas, que estaban delante del trono y en la presencia del Cordero, vestidos de ropas blancas, y con palmas en las manos.`,
    contexto: "En el cielo habrá personas de todas las naciones, tribus y lenguas, incluyendo quienes respondieron a la luz que tenían."
  },
  {
    ref: "Zacarías 13:6",
    grupos: ["La esperanza final"],
    texto: `Y si alguien le pregunta: ¿Qué heridas son estas en tus manos? Él responderá: Con ellas fui herido en casa de mis amigos.`,
    contexto: "Algunos que lleguen al cielo descubrirán la historia de la cruz por primera vez allí, y preguntarán sobre las cicatrices de Jesús."
  },
  {
    ref: "Apocalipsis 18:4",
    grupos: ["La esperanza final"],
    texto: `Y oí otra voz del cielo, que decía: Salid de ella, pueblo mío, para que no seáis partícipes de sus pecados, ni recibáis parte de sus plagas.`,
    contexto: "Dios tiene pueblo fiel incluso dentro de sistemas religiosos confusos (Babilonia). Los llama a salir hacia la luz."
  },
  {
    ref: "Romanos 12:3",
    grupos: ["La conciencia como revelación"],
    texto: `Digo, pues, por la gracia que me es dada, a cada cual que está entre vosotros, que no tenga más alto concepto de sí que el que debe tener, sino que piense de sí con cordura, conforme a la medida de fe que Dios repartió a cada uno.`,
    contexto: "Dios ha dado a cada persona una medida de fe: algo en el corazón humano que puede percibir el llamado divino."
  },
];

/* ─── QUIZ ──────────────────────────────────────────────────── */
const QUIZ = [
  {
    q: "¿Cómo llamó la mujer cananea a Jesús al acercarse a él?",
    opts: ["Maestro de Israel", "Hijo de David", "Profeta de Galilea", "Señor de los ángeles"],
    correct: 1,
    exp: "La mujer cananea lo llamó «Hijo de David» (Mat. 15:22), un título mesiánico que revela que comprendía su identidad, algo notable dada su distancia cultural del judaísmo."
  },
  {
    q: "Según Romanos 1:20, ¿qué pueden conocer todos los seres humanos aunque no tengan acceso a la Biblia?",
    opts: ["Los mandamientos de Dios escritos", "El eterno poder y deidad de Dios a través de la creación", "La historia completa del evangelio", "El nombre de Jesús"],
    correct: 1,
    exp: "Pablo argumenta que las cualidades invisibles de Dios —su eterno poder y naturaleza divina— se ven claramente desde la creación del mundo. Por eso nadie tiene excusa para no reconocerlo."
  },
  {
    q: "¿Cuál es el deseo sincero de Dios según 1 Timoteo 2:4?",
    opts: ["Que solo los creyentes sean salvos", "Que todos los hombres sean salvos y vengan al conocimiento de la verdad", "Que Israel sea restaurado primero", "Que los misioneros alcancen todas las naciones"],
    correct: 1,
    exp: "1 Timoteo 2:4 es claro: Dios «quiere que todos los hombres sean salvos y vengan al conocimiento de la verdad». Su deseo no tiene fronteras étnicas ni religiosas."
  },
  {
    q: "¿Qué criterio usará Dios para juzgar a quienes nunca tuvieron acceso al evangelio?",
    opts: ["Si conocieron el nombre de Jesús", "Su respuesta a la luz y la conciencia que recibieron", "Su nivel de moralidad comparado con otros", "Si alguien oró por su salvación"],
    correct: 1,
    exp: "El material enseña claramente que Dios juzgará a cada persona según cómo respondió a la luz que recibió, ya sea poca o mucha. Nadie se perderá simplemente por el lugar donde nació."
  },
  {
    q: "Según Hechos 10, ¿cómo llegó el evangelio a Cornelio, el centurión romano?",
    opts: ["Leyó un pergamino que alguien dejó en su puerta", "Un ángel se le apareció en visión y lo dirigió hacia Pedro", "Escuchó a Pablo predicar en el mercado", "Su familia judía le enseñó las Escrituras"],
    correct: 1,
    exp: "Cornelio, un gentil temeroso de Dios, recibió una visión angelical que lo dirigió específicamente a buscar a Pedro en Jope. Dios lo guió proactivamente porque Cornelio ya respondía a la luz que tenía."
  },
  {
    q: "¿Qué enseña Apocalipsis 7:9 sobre la composición del pueblo redimido?",
    opts: ["Será mayoritariamente del pueblo judío", "Solo incluirá a los que oyeron el evangelio en vida", "Vendrá de todas las naciones, tribus, pueblos y lenguas", "Estará formado solo por los adventistas fieles"],
    correct: 2,
    exp: "Apocalipsis 7:9 muestra una multitud que nadie puede contar, de absolutamente todas las naciones, tribus, pueblos y lenguas. Esto incluye a quienes respondieron a la luz que tuvieron, incluso si no conocieron el evangelio completo."
  },
  {
    q: "Según el material, ¿para qué sirve compartir el evangelio si Dios puede salvar a personas que nunca lo oyeron?",
    opts: ["No tiene sentido compartirlo entonces", "Aumenta las posibilidades de que las personas respondan adecuadamente a Dios", "Solo es obligación de los misioneros profesionales", "Solo sirve para cumplir un requisito religioso"],
    correct: 1,
    exp: "Compartir el evangelio no es irrelevante: aumenta las posibilidades de que las personas respondan conscientemente al amor de Dios. El misionero humano es el método preferido de Dios, aunque no el único."
  },
  {
    q: "¿Qué simboliza 'Babilonia' en Apocalipsis 18:4?",
    opts: ["El Imperio Romano del siglo I", "Una ciudad literal destruida en el futuro", "Una forma transigente de cristianismo que mezcla verdad y error", "Las religiones no cristianas del mundo"],
    correct: 2,
    exp: "En Apocalipsis 18, Babilonia se refiere a un sistema de cristianismo comprometido que mezcla verdad y error. Dios llama a su pueblo a salir de esa confusión. Esto revela que Dios tiene seguidores fieles incluso dentro de sistemas con errores doctrinales."
  }
];

/* ─── COMPONENTES ───────────────────────────────────────────── */
function VerseCard({ v, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`verse-card${v.base ? " base" : ""}`} onClick={() => setOpen(o => !o)}>
      <div className="verse-header">
        <span className="verse-ref">{v.ref}</span>
        <div className="verse-tags">
          {v.base && (
            <span className="verse-tag base">
              <Star size={10} style={{display:"inline",marginRight:2}} />Texto base
            </span>
          )}
          {v.tema && !v.base && <span className="verse-tag theme">{v.tema}</span>}
          {open ? <ChevronUp size={16} color="var(--tx3)" /> : <ChevronDown size={16} color="var(--tx3)" />}
        </div>
      </div>
      {open && (
        <div className="verse-body">
          {v.texto}
          {v.contexto && <div className="verse-context">{v.contexto}</div>}
        </div>
      )}
    </div>
  );
}

function GuideStep({ time, title, children }) {
  return (
    <div className="guide-step">
      <span className="guide-time">{time}</span>
      <div>
        <div className="guide-step-title">{title}</div>
        <div className="guide-step-body">{children}</div>
      </div>
    </div>
  );
}

/* ─── SECCIÓN: INICIO ──────────────────────────────────────── */
function SecInicio({ master }) {
  return (
    <div className="section-wrap">
      <p className="sec-title">¿Qué pasa con quienes nunca oyeron?</p>
      <p className="sec-sub">La pregunta más difícil de la apologética cristiana tiene una respuesta más amplia de lo que imaginas.</p>

      <div className="card">
        <div className="badge"><Globe size={10} />Contexto global</div>
        <div className="card-body">
          El mundo hoy tiene <strong style={{color:"var(--tx)"}}>8.200 millones de personas</strong>. El cristianismo es la religión más grande con 2.500 millones de seguidores, pero miles de millones nunca han oído el evangelio. ¿Los condena eso automáticamente?
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-chip"><div className="stat-num">2.5B</div><div className="stat-label">Cristianos</div></div>
        <div className="stat-chip"><div className="stat-num">1.9B</div><div className="stat-label">Musulmanes</div></div>
        <div className="stat-chip"><div className="stat-num">1.1B</div><div className="stat-label">Hindúes</div></div>
      </div>

      <div className="card">
        <div className="badge"><BookMarked size={10} />Elena G. de White</div>
        <div className="card-body" style={{fontSize:"1rem",fontStyle:"italic",lineHeight:1.7}}>
          «El plan de salvación trazado por el cielo es bastante amplio para abarcar todo el mundo […] Dios no permitirá que quede chasqueado nadie que anhele sinceramente algo superior y más noble que cuanto puede ofrecer el mundo.»
        </div>
        <div style={{fontSize:".78rem",color:"var(--tx3)",marginTop:".5rem",fontFamily:"'IBM Plex Mono',monospace"}}>
          — Profetas y reyes, cap. 31, p. 254
        </div>
      </div>

      <div className="info-box ok">
        <strong>Idea central de la semana:</strong> Dios desea sinceramente salvar a personas de todos los orígenes y religiones. A todas las personas del mundo se les ha dado una conciencia, una medida de fe y algo de luz, incluso si nunca han oído el nombre de Jesús.
      </div>

      {master && (
        <>
          <div className="divider" />
          <p className="verse-group-label" style={{color:"var(--warn)"}}>Guía del maestro — 30 minutos</p>
          <GuideStep time="0–3 min" title="Bienvenida">
            Saludar al grupo. Preguntar: <em>«¿Alguna vez alguien les preguntó qué pasará con sus familiares que nunca creyeron?»</em> Dejar que 2-3 personas compartan brevemente. No dar respuesta todavía.
          </GuideStep>
          <GuideStep time="3–5 min" title="Pedidos y oración">
            Recibir pedidos de oración, orar brevemente. Pedir guía para entender la amplitud del amor de Dios.
          </GuideStep>
          <GuideStep time="5–9 min" title="Sección: La mujer cananea">
            Leer Mateo 15:21-28 en voz alta. Preguntar: <em>«¿Qué sorprende de esta historia?»</em> Guiar hacia las secciones «La cananea» y «Contexto histórico» de la app.
          </GuideStep>
          <GuideStep time="9–15 min" title="Sección: ¿Cómo habla Dios?">
            Usar la dinámica interactiva de clasificación de la sección «Dios habla». Dejar que los alumnos clasifiquen los ejemplos bíblicos antes de revelar la respuesta.
          </GuideStep>
          <GuideStep time="15–20 min" title="Sección: Comparar perspectivas">
            Revisar la tabla comparativa de «Dos visiones» sobre cómo Dios salva. Discutir: ¿cuál representa mejor lo que enseña la Biblia?
          </GuideStep>
          <GuideStep time="20–27 min" title="Quiz interactivo">
            Hacer el quiz en grupos de 2-3. Leer las preguntas en voz alta, dejar que discutan y elijan. Comentar la explicación de cada respuesta.
          </GuideStep>
          <GuideStep time="27–30 min" title="Reflexión y cierre">
            Ir a la sección «Cierre». Leer las preguntas de reflexión. Terminar con el texto «Para tu vida» y oración espontánea.
          </GuideStep>
        </>
      )}
    </div>
  );
}

/* ─── SECCIÓN: LA CANANEA ──────────────────────────────────── */
function SecCananea({ master }) {
  const [selected, setSelected] = useState(null);
  const preguntas = [
    { label: "¿Por qué Jesús la ignoró al principio?", resp: "No era un rechazo real. Jesús quería crear un espacio donde la fe de la mujer brillara, y exponer ante los discípulos sus propios prejuicios hacia los gentiles. Les estaba mostrando un espejo de su favoritismo." },
    { label: "¿Qué título le dio al llamarlo «Hijo de David»?", resp: "Era un título mesiánico. Que una mujer cananea —fuera del judaísmo— reconociera la identidad de Jesús era notable y poderoso. Comprendía algo que los líderes religiosos de Israel a menudo pasaban por alto." },
    { label: "¿Por qué Jesús alabó específicamente su fe?", resp: "Porque perseveró a pesar del silencio inicial y de la respuesta aparentemente dura. En lugar de ofenderse, respondió con humildad y esperanza. Eso es exactamente lo que Jesús llama «gran fe»." },
    { label: "¿Qué aprendieron los discípulos?", resp: "Que las 'ovejas perdidas de Israel' no estaban definidas por etnia, sino por fe. El amor y la gracia de Dios se extienden más allá de Israel a todos los que creen, sin importar su origen cultural o religioso." },
  ];
  return (
    <div className="section-wrap">
      <p className="sec-title">Más allá de <em>Israel</em></p>
      <p className="sec-sub">La historia de la mujer cananea es el texto base de esta semana. Cada detalle tiene una lección.</p>

      {master ? (
        <>
          <div className="card">
            <div className="badge"><MapPin size={10} />Contexto geográfico</div>
            <div className="card-body">
              Tiro y Sidón estaban fuera de Israel, en la actual Líbano. Era un viaje deliberado a territorio pagano. Los cananeos históricamente adoraban a Baal y Asera, practicaban la idolatría y rituales como el sacrificio de niños (Deut. 7:1-5). Esta mujer venía de ese trasfondo.
            </div>
          </div>
          {preguntas.map((p, i) => (
            <div key={i} className="card">
              <div className="card-title">{p.label}</div>
              <div className="card-body">{p.resp}</div>
            </div>
          ))}
          <div className="info-box" style={{borderColor:"rgba(212,175,55,.25)",background:"rgba(212,175,55,.05)"}}>
            <strong>R. T. France:</strong> «Ella vio en Jesús algo que los líderes religiosos de Israel a menudo pasaban por alto: compasión y poder divino.»
          </div>
          <div className="info-box" style={{borderColor:"rgba(212,175,55,.25)",background:"rgba(212,175,55,.05)"}}>
            <strong>Elena G. de White:</strong> «Bajo la aparente negativa de Jesús, vio una compasión que él no podía ocultar.» — El Deseado de todas las gentes, cap. 43, p. 373
          </div>
        </>
      ) : (
        <>
          <div className="info-box">
            <strong>Lee Mateo 15:21-28.</strong> Este es el único milagro registrado en la región de Tiro y Sidón. Jesús cruzó fronteras culturales, religiosas y étnicas para revelar algo sobre el reino de Dios.
          </div>
          <p className="verse-group-label">Toca cada pregunta para explorarla</p>
          {preguntas.map((p, i) => (
            <div key={i} className="master-item">
              <div className="master-header" onClick={() => setSelected(selected === i ? null : i)}>
                <span className="master-title">{p.label}</span>
                {selected === i ? <ChevronUp size={16} color="var(--tx3)" /> : <ChevronDown size={16} color="var(--tx3)" />}
              </div>
              {selected === i && <div className="master-body"><p>{p.resp}</p></div>}
            </div>
          ))}
          <div className="card" style={{borderColor:"rgba(245,158,11,.25)",background:"rgba(245,158,11,.04)"}}>
            <div className="card-title" style={{color:"var(--warn)"}}>Para reflexionar</div>
            <div className="card-body">¿Cómo reaccionarías si la iglesia te rechazara como rechazaron los discípulos a esta mujer? ¿Cómo puedes ayudar a personas que han sido tratadas con rudeza en el pasado?</div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── SECCIÓN: DIOS HABLA ──────────────────────────────────── */
const HABLA_ITEMS = [
  { titulo: "El asna de Balaam", detalle: "Números 22:28-30 — Dios literalmente habló a través de un animal para detener a un profeta que iba en la dirección equivocada.", categoria: "animal", cat_label: "Animal" },
  { titulo: "La voz suave de Elías", detalle: "1 Reyes 19:11-13 — Después del viento, el terremoto y el fuego, Dios habló con un 'silbo apacible y delicado'. A veces Dios habla en el silencio.", categoria: "naturaleza", cat_label: "Naturaleza" },
  { titulo: "El sueño de la esposa de Pilato", detalle: "Mateo 27:19 — Dios le envió un sueño a una mujer romana pagana para advertir sobre la injusticia de condenar a Jesús.", categoria: "sueño", cat_label: "Sueño" },
  { titulo: "La visión de Cornelio", detalle: "Hechos 10:1-8 — Un centurión romano gentil que oraba sinceramente recibió una visión angelical que lo conectó con Pedro para conocer el evangelio.", categoria: "vision", cat_label: "Visión" },
  { titulo: "Las estrellas y la creación", detalle: "Salmos 19:1-4 y Romanos 1:20 — Los cielos cuentan la gloria de Dios sin usar palabras. Su voz llega a toda la tierra a través de lo que creó.", categoria: "naturaleza", cat_label: "Naturaleza" },
  { titulo: "Las piedras que clamarían", detalle: "Lucas 19:40 — Jesús dijo que si los humanos callaran, las piedras gritarían. Dios no está limitado a los métodos convencionales.", categoria: "naturaleza", cat_label: "Naturaleza" },
];

const CATEGORIAS = [
  { id: "naturaleza", label: "Naturaleza", color: "ok" },
  { id: "sueño", label: "Sueño / Visión", color: "acc" },
  { id: "vision", label: "Sueño / Visión", color: "acc" },
  { id: "animal", label: "Medios inusuales", color: "warn" },
];

function SecHabla({ master }) {
  const [selections, setSelections] = useState({});
  const [checked, setChecked] = useState(false);
  const allSelected = HABLA_ITEMS.every((_, i) => selections[i]);

  function getColorClass(cat) {
    if (cat === "naturaleza") return "selected-a";
    if (cat === "sueño" || cat === "vision") return "selected-b";
    return "selected-c";
  }

  function handleSelect(idx, cat) {
    if (checked) return;
    setSelections(s => ({ ...s, [idx]: cat }));
  }

  const score = HABLA_ITEMS.filter((item, i) => {
    const sel = selections[i];
    if (!sel) return false;
    if (item.categoria === "vision") return sel === "vision" || sel === "sueño";
    return sel === item.categoria;
  }).length;

  return (
    <div className="section-wrap">
      <p className="sec-title">¿Cómo habla <em>Dios</em>?</p>
      <p className="sec-sub">Dios no está limitado a la Biblia ni a los misioneros. Explora las formas en que ha llegado a personas de todos los tiempos.</p>

      {master ? (
        <>
          <div className="info-box">
            <strong>Contenido completo (modo maestro):</strong> Presenta cada uno de estos seis casos. Pregunta al grupo: ¿cuál los sorprende más? ¿Por qué creen que Dios elige medios tan variados?
          </div>
          {HABLA_ITEMS.map((item, i) => (
            <div key={i} className="card">
              <div className="card-title">{item.titulo}</div>
              <div className="card-body">{item.detalle}</div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="info-box">
            <strong>Dinámica:</strong> Clasifica cada ejemplo según cómo Dios comunicó su mensaje. Toca el ejemplo y luego el botón de categoría. Al terminar, verifica tus respuestas.
          </div>

          <div className="cat-buttons">
            <button className={`cat-btn nature${allSelected||checked ? "" : ""}`}
              onClick={() => {}}>🌿 Naturaleza</button>
            <button className={`cat-btn dreams`} onClick={() => {}}>💭 Sueño/Visión</button>
            <button className={`cat-btn angels`} onClick={() => {}}>✦ Inusual</button>
          </div>

          {HABLA_ITEMS.map((item, i) => {
            const sel = selections[i];
            let cls = "";
            if (sel === "naturaleza") cls = "selected-a";
            else if (sel === "sueño" || sel === "vision") cls = "selected-b";
            else if (sel) cls = "selected-c";
            return (
              <div key={i} className={`cat-item${cls ? " "+cls : ""}${checked ? " revealed" : ""}`}>
                <div className="cat-item-title">{item.titulo}</div>
                {checked
                  ? <div className="cat-item-hint">{item.detalle}</div>
                  : <div style={{display:"flex",gap:".4rem",marginTop:".4rem",flexWrap:"wrap"}}>
                      <button className={`cat-btn nature`} style={{flex:"none",fontSize:".75rem",padding:".3rem .55rem"}}
                        onClick={() => handleSelect(i, "naturaleza")}>🌿 Naturaleza</button>
                      <button className={`cat-btn dreams`} style={{flex:"none",fontSize:".75rem",padding:".3rem .55rem"}}
                        onClick={() => handleSelect(i, "sueño")}>💭 Sueño/Visión</button>
                      <button className={`cat-btn angels`} style={{flex:"none",fontSize:".75rem",padding:".3rem .55rem"}}
                        onClick={() => handleSelect(i, "animal")}>✦ Inusual</button>
                    </div>
                }
              </div>
            );
          })}

          {!checked && allSelected && (
            <button className="quiz-next-btn" style={{marginTop:".5rem"}} onClick={() => setChecked(true)}>
              Verificar clasificación
            </button>
          )}
          {checked && (
            <div className={`cat-feedback${score < 5 ? " partial" : ""}`}>
              {score === 6
                ? <><Check size={14} style={{marginRight:6}} /><strong>¡Excelente!</strong> Clasificaste todo perfectamente. Dios realmente usa una variedad asombrosa de medios.</>
                : <><AlertCircle size={14} style={{marginRight:6}} /><strong>{score} de 6 correctas.</strong> Revisa los detalles de cada ejemplo arriba.</>
              }
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── SECCIÓN: DOS VISIONES ──────────────────────────────────── */
function SecVisiones() {
  return (
    <div className="section-wrap">
      <p className="sec-title">Dos <em>visiones</em> de Dios</p>
      <p className="sec-sub">¿Cómo salva Dios a quienes no conocieron el evangelio? Hay una perspectiva limitante y una perspectiva bíblica.</p>

      <div className="compare-wrap">
        <div className="compare-header">
          <div className="compare-col-header left">Visión restrictiva</div>
          <div className="compare-col-header right">Visión bíblica</div>
        </div>
        {[
          ["Solo se salvan quienes explícitamente aceptan a Jesús", "Dios juzga según la respuesta a la luz que cada uno recibió"],
          ["Dios solo habla a través de la Biblia y misioneros", "Dios habla a través de la naturaleza, sueños, conciencia, ángeles"],
          ["Nacer en el lugar equivocado significa perdición", "Nadie se pierde simplemente por dónde o cuándo nació"],
          ["La misericordia de Dios tiene límites culturales", "El amor de Dios abarca a todas las naciones, tribus y lenguas"],
          ["El evangelio es para quienes lo merecen", "Dios quiere que TODOS los hombres sean salvos (1 Tim. 2:4)"],
        ].map(([l, r], i) => (
          <div className="compare-row" key={i}>
            <div className="compare-cell left">{l}</div>
            <div className="compare-cell right">{r}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{borderColor:"rgba(212,175,55,.25)"}}>
        <div className="badge"><BookMarked size={10} />Elena G. de White</div>
        <div className="card-body" style={{fontStyle:"italic",lineHeight:1.7}}>
          «Nuestra situación delante de Dios depende, no de la cantidad de luz que hemos recibido, sino del empleo que damos a la que tenemos.»
        </div>
        <div style={{fontSize:".78rem",color:"var(--tx3)",marginTop:".5rem",fontFamily:"'IBM Plex Mono',monospace"}}>
          — El Deseado de todas las gentes, cap. 24, p. 212
        </div>
      </div>

      <div className="card" style={{borderColor:"rgba(245,158,11,.25)"}}>
        <div className="badge" style={{background:"var(--warn-d)",color:"var(--warn)",borderColor:"rgba(245,158,11,.25)"}}><Star size={10} />Sorpresas en el juicio</div>
        <div className="card-body">
          En el cielo habrá personas que verán las cicatrices en las manos de Jesús y preguntarán por primera vez qué significan (Zac. 13:6). Algunos escucharán la historia de la cruz por primera vez allí. Respondieron a la luz que tenían, aunque no conocieron el nombre de Jesús.
        </div>
      </div>
    </div>
  );
}

/* ─── SECCIÓN: BIBLIA ──────────────────────────────────────── */
function SecBiblia() {
  const grupos = [
    "La mujer cananea",
    "La mujer cananea — contexto",
    "Dios habla a través de la naturaleza",
    "Dios habla de formas inesperadas",
    "La conciencia como revelación",
    "Deseo de Dios de salvar a todos",
    "La misión cristiana",
    "La esperanza final",
  ];
  return (
    <div className="section-wrap">
      <p className="sec-title">Versículos de la <em>semana</em></p>
      <p className="sec-sub">Todos los pasajes del material. Toca para ver el texto completo en RVR1960.</p>

      {/* Texto base primero */}
      {VERSICULOS.filter(v => v.base).map((v, i) => <VerseCard key={i} v={v} defaultOpen={true} />)}

      {grupos.filter(g => g !== "La mujer cananea").map(grupo => {
        const vs = VERSICULOS.filter(v => !v.base && v.grupos?.includes(grupo));
        if (!vs.length) return null;
        return (
          <div key={grupo}>
            <p className="verse-group-label">{grupo}</p>
            {vs.map((v, i) => <VerseCard key={i} v={v} />)}
          </div>
        );
      })}
    </div>
  );
}

/* ─── SECCIÓN: QUIZ ─────────────────────────────────────────── */
function SecQuiz() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  function answer(i) {
    if (answers[cur] !== undefined) return;
    setAnswers(a => ({ ...a, [cur]: i }));
  }
  function next() {
    if (cur < QUIZ.length - 1) setCur(c => c + 1);
    else setDone(true);
  }
  function retry() { setCur(0); setAnswers({}); setDone(false); }

  const score = Object.entries(answers).filter(([q, a]) => QUIZ[+q].correct === a).length;
  const pct = Math.round((score / QUIZ.length) * 100);

  if (done) {
    const msg = pct >= 87 ? "¡Excelente! Dominás el tema de esta semana." : pct >= 62 ? "Muy bien. Algunos conceptos para repasar." : "Seguí estudiando, ¡vas a mejorar con cada repaso!";
    return (
      <div className="section-wrap">
        <div className="quiz-result">
          <div className="quiz-result-score">{pct}%</div>
          <div className="quiz-result-label">{score} / {QUIZ.length} correctas</div>
          <div className="quiz-result-msg">{msg}</div>
          <button className="quiz-retry-btn" onClick={retry}><RotateCcw size={16} />Intentar de nuevo</button>
        </div>
      </div>
    );
  }

  const q = QUIZ[cur];
  const sel = answers[cur];
  const answered = sel !== undefined;
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="section-wrap">
      <p className="sec-title">Quiz — Semana 13</p>
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{width:`${((cur + (answered?1:0)) / QUIZ.length) * 100}%`}} />
      </div>
      <div className="quiz-counter">Pregunta {cur + 1} de {QUIZ.length}</div>
      <div className="quiz-q">{q.q}</div>
      {q.opts.map((opt, i) => {
        let cls = "";
        if (answered) {
          if (i === q.correct) cls = " correct";
          else if (i === sel) cls = " wrong";
          cls += " disabled";
        }
        return (
          <div key={i} className={`quiz-opt${cls}`} onClick={() => answer(i)}>
            <span className="quiz-opt-letter">
              {answered && i === q.correct ? <Check size={12} /> : answered && i === sel ? <X size={12} /> : letters[i]}
            </span>
            {opt}
          </div>
        );
      })}
      {answered && (
        <>
          <div className="quiz-explanation"><strong>Explicación:</strong> {q.exp}</div>
          <button className="quiz-next-btn" onClick={next}>
            {cur < QUIZ.length - 1 ? "Siguiente pregunta →" : "Ver resultados"}
          </button>
        </>
      )}
    </div>
  );
}

/* ─── SECCIÓN: CIERRE ──────────────────────────────────────── */
function SecCierre() {
  const reflexiones = [
    "¿Cómo ayudó Jesús a que brillara la fe de la mujer cananea? ¿Qué dice eso sobre cómo Dios maneja las dificultades en tu vida?",
    "¿Cómo influye en tu visión de la justicia de Dios saber que juzga a las personas según la luz que recibieron?",
    "Si Dios salvará a algunas personas que nunca oyeron el nombre de Jesús, ¿qué sentido tiene compartir el evangelio? ¿Qué cambia cuando alguien recibe el evangelio completo?",
    "¿Cuánta responsabilidad misionera debemos sentir hacia otros cristianos que están confundidos por falsas doctrinas?",
    "¿Qué ejemplos conocés en los que Dios haya usado sueños, fenómenos naturales o circunstancias para guiar a alguien hacia él?",
    "¿Cómo podés usar esta comprensión de la inclusividad de Dios en conversaciones con personas de otras religiones o sin creencias?",
  ];

  return (
    <div className="section-wrap">
      <p className="sec-title">Reflexión y <em>cierre</em></p>
      <p className="sec-sub">Preguntas para discutir en grupo antes de cerrar la clase.</p>

      {reflexiones.map((r, i) => (
        <div className="reflect-card" key={i}>
          <div className="reflect-num">{i + 1}</div>
          <div className="reflect-q">{r}</div>
        </div>
      ))}

      <div className="divider" style={{margin:"1rem 1.25rem .75rem"}} />

      <div className="for-you-card">
        <div className="for-you-header"><Flame size={17} />Para tu vida</div>
        <div className="for-you-body">
          <p>Hay personas en tu vida —un familiar, un compañero del liceo o la facultad, alguien que seguís en Instagram— que tal vez nunca van a entrar a una iglesia. Y probablemente en algún momento te preguntaron qué pensás sobre lo que le pasa a la gente que no cree, o sobre sus abuelos que nunca conocieron el evangelio.</p>
          <p>Esta semana aprendiste que <strong>Dios es más grande que tus respuestas simples</strong>. No está atrapado en las estructuras religiosas ni en los accidentes geográficos de nacimiento. Él llega a cada persona de alguna forma.</p>
          <p>Pero también aprendiste algo más: que compartir el evangelio <strong>aumenta las posibilidades</strong> de que esa persona responda conscientemente. No es que sin vos se pierde. Es que con vos, tiene más claridad, más herramientas, una historia más completa del amor de Dios.</p>
          <div className="for-you-cta">
            Esta semana: identifica una conversación que puedas tener sobre Dios con alguien que no lo conoce. No necesitás tener todas las respuestas. Solo compartí lo que sabés y dejá que Dios haga el resto.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── APP PRINCIPAL ─────────────────────────────────────────── */
const TABS = [
  { id: "inicio", label: "Inicio", icon: Zap },
  { id: "cananea", label: "Cananea", icon: Users },
  { id: "habla", label: "Dios Habla", icon: MessageCircle },
  { id: "visiones", label: "Visiones", icon: ZoomIn },
  { id: "biblia", label: "Biblia", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: Target },
  { id: "cierre", label: "Cierre", icon: Heart },
];

export default function App() {
  const [tab, setTab] = useState("inicio");
  const [master, setMaster] = useState(false);
  const [taps, setTaps] = useState(0);
  const [secretMsg, setSecretMsg] = useState("");
  const scrollRef = useRef(null);
  const tapTimer = useRef(null);

  function handleHeroTap() {
    const next = taps + 1;
    setTaps(next);
    clearTimeout(tapTimer.current);
    if (next >= 5) {
      setMaster(m => {
        const newM = !m;
        setSecretMsg(newM ? "— modo maestro —" : "— modo alumno —");
        setTimeout(() => setSecretMsg(""), 1800);
        return newM;
      });
      setTaps(0);
    } else {
      tapTimer.current = setTimeout(() => setTaps(0), 1200);
    }
  }

  function goTab(id) {
    setTab(id);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "instant" });
  }

  const content = {
    inicio: <SecInicio master={master} />,
    cananea: <SecCananea master={master} />,
    habla: <SecHabla master={master} />,
    visiones: <SecVisiones />,
    biblia: <SecBiblia />,
    quiz: <SecQuiz />,
    cierre: <SecCierre />,
  }[tab];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="scroll-area" ref={scrollRef}>
          <div className="hero" onClick={handleHeroTap}>
        <div className="hero-stars" />
            <div className="hero-tag">
              <span style={{fontFamily:"'IBM Plex Mono',monospace",letterSpacing:".1em"}}>SEMANA {SEMANA}</span>
              <span>{TEXTO_BASE_TEMA}</span>
            </div>
            <div className="hero-title">Esperanza para los <em>no cristianos</em></div>
            <div className="hero-sub">¿Qué pasa con quienes nunca oyeron el evangelio?</div>
            <div className="hero-verse-chip">
              <Star size={12} />
              {TEXTO_BASE}
            </div>
          </div>
          <div className="secret-bar" style={{color: secretMsg ? "var(--tx3)" : "var(--bg)"}}>
            {secretMsg || "·"}
          </div>
          {content}
        </div>
        <nav className="nav">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => goTab(t.id)}>
                <Icon />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
