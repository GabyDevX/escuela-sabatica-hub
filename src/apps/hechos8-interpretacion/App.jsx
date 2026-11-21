import { useState, useRef, useCallback } from "react";
import {
  BookOpen, Star, ChevronDown, ChevronUp, Flame,
  CheckCircle, XCircle, RotateCcw, Home, HelpCircle,
  Route, Glasses, Link2, ScrollText, Dices, Mic, Eye, Search,
  Lightbulb, Users
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--bg:#090b05;--bg2:#10130a;--bg3:#181c0f;--surf:#1e2314;--surf2:#292f1b;--brd:#343b22;--brd2:#4b5530;--tx:#f1f4e6;--tx2:#a9b38a;--tx3:#747d58;--acc:#9bbf3e;--acc2:#bcd96a;--acc3:#e3f0b8;--ok:#10b981;--ok-d:rgba(16,185,129,.10);--err:#f43f5e;--err-d:rgba(244,63,94,.10);--warn:#d4a94a;--warn-d:rgba(212,169,74,.10)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--tx)}
body{font-family:'DM Sans',sans-serif}
.app{max-width:440px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.scroll-area{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.scroll-area::-webkit-scrollbar{width:3px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px}
.hero{position:relative;padding:2.8rem 1.5rem 2.4rem;background:linear-gradient(170deg,#141a0a 0%,#10130a 55%,#090b05 100%);overflow:hidden;text-align:center}
.hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:300px;background:radial-gradient(ellipse at 50% 40%,rgba(155,191,62,.30) 0%,transparent 70%);pointer-events:none}
.hero-brand{font-family:'IBM Plex Mono',monospace;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--acc2);margin-bottom:.6rem;opacity:.75;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:.4rem}
.hero-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);display:inline-block}
.hero-title{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:700;line-height:1.22;color:var(--tx);margin-bottom:.6rem;cursor:default;user-select:none;position:relative;z-index:1}
.hero-title em{font-style:italic;color:var(--acc3);font-weight:400}
.hero-ref{font-family:'IBM Plex Mono',monospace;font-size:.63rem;color:var(--tx3);letter-spacing:.08em;padding:.3rem .85rem;border:1px solid rgba(155,191,62,.40);border-radius:20px;display:inline-block;margin-top:.35rem;position:relative;z-index:1;background:rgba(155,191,62,.10)}
.hero-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(155,191,62,.48) 30%,rgba(155,191,62,.48) 70%,transparent)}
.secret-bar{font-size:.48rem;color:var(--bg3);text-align:center;padding:.18rem;transition:color .4s;user-select:none;letter-spacing:.06em;font-family:'IBM Plex Mono',monospace}
.secret-bar.flash{color:var(--tx3)}
.nav{flex-shrink:0;width:100%;background:var(--bg2);border-top:1px solid var(--brd);padding-bottom:env(safe-area-inset-bottom,0px);display:flex}
.nav button{flex:1 0 auto;min-width:38px;min-height:56px;padding:.6rem .15rem .5rem;font-size:.4rem;gap:3px;justify-content:center;background:transparent;border:none;color:var(--tx3);cursor:pointer;display:flex;flex-direction:column;align-items:center;position:relative;transition:color .2s;font-family:'IBM Plex Mono',monospace;letter-spacing:.02em;text-transform:uppercase}
.nav button svg{width:17px;height:17px;transition:transform .2s}
.nav button.on{color:var(--acc2)}
.nav button.on svg{transform:translateY(-1px)}
.nav button.on::before{content:'';position:absolute;top:0;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:0 0 2px 2px}
.nav button.on::after{content:'';position:absolute;inset:4px 3px;background:rgba(155,191,62,.18);border-radius:10px;z-index:-1}
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
.verse-tag{font-family:'IBM Plex Mono',monospace;font-size:.53rem;text-transform:uppercase;letter-spacing:.08em;padding:.2rem .5rem;border-radius:10px;background:rgba(155,191,62,.25);color:var(--acc2)}
.verse-tag.warn-tag{background:rgba(212,169,74,.18);color:var(--warn)}
.verse-body{padding:.1rem 1rem 1rem;font-family:'DM Sans',sans-serif;font-size:1.05rem;line-height:1.75;color:var(--tx);border-top:1px solid var(--brd)}
.expand-item{background:var(--surf);border:1px solid var(--brd);border-radius:12px;margin-bottom:.65rem;overflow:hidden;cursor:pointer;transition:all .2s}
.expand-item.open{border-color:var(--acc);background:rgba(155,191,62,.09)}
.expand-header{display:flex;align-items:center;gap:.7rem;padding:.85rem 1rem}
.expand-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);background:rgba(155,191,62,.25);padding:.2rem .45rem;border-radius:6px;flex-shrink:0;white-space:nowrap}
.expand-name{font-size:1rem;font-weight:600;color:var(--tx);flex:1;line-height:1.3}
.expand-body{font-size:.97rem;line-height:1.6;color:var(--tx2);padding:.1rem 1rem 1rem;border-top:1px solid var(--brd)}
.egw-wrap{background:linear-gradient(135deg,rgba(155,191,62,.16),rgba(155,191,62,.02));border:1px solid rgba(155,191,62,.30);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.egw-wrap::before{content:'"';position:absolute;top:-10px;right:12px;font-family:'Playfair Display',serif;font-size:6rem;color:rgba(155,191,62,.12);line-height:1;pointer-events:none}
.egw-source{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem}
.egw-text{font-size:.97rem;line-height:1.78;color:var(--tx2);font-style:italic;font-family:'DM Sans',sans-serif}
.egw-text strong{font-style:normal;color:var(--acc3);font-weight:600}
.honey-card{background:linear-gradient(135deg,rgba(155,191,62,.20),rgba(155,191,62,.03));border:1px solid rgba(155,191,62,.36);border-radius:16px;padding:1.15rem 1.1rem;margin-bottom:.85rem;position:relative;overflow:hidden}
.honey-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem}
.honey-text{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.6;color:var(--tx);font-style:italic}
.honey-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--tx3);margin-top:.55rem}
.guide-banner{background:linear-gradient(135deg,rgba(212,169,74,.12),rgba(212,169,74,.02));border:1px solid rgba(212,169,74,.24);border-radius:14px;padding:.85rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:.7rem}
.guide-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);background:rgba(212,169,74,.16);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
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
.quiz-next{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#0c1004;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;margin-top:.8rem;transition:background .2s}
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
.vida-card{background:linear-gradient(135deg,rgba(155,191,62,.20),rgba(155,191,62,.03));border:1.5px solid rgba(155,191,62,.38);border-radius:16px;padding:1.2rem 1.1rem;margin-top:.5rem}
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
.discuss-personal{background:rgba(155,191,62,.10);border-left:3px solid var(--acc);border-radius:0 10px 10px 0;padding:.7rem .9rem;margin-top:.5rem;font-size:.92rem;line-height:1.55;color:var(--tx2)}
.discuss-personal strong{color:var(--acc3);font-style:normal}
.group-label{font-family:'IBM Plex Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin:1rem 0 .6rem;display:flex;align-items:center;gap:.5rem}
.group-label:first-of-type{margin-top:0}
.cmp-block{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1rem .9rem;margin-bottom:.85rem}
.cmp-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--tx);margin-bottom:.7rem;line-height:1.3}
.cmp-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.cmp-cell{border-radius:10px;padding:.7rem .7rem;font-size:.93rem;line-height:1.5;color:var(--tx2)}
.cmp-cell.a{background:rgba(155,191,62,.12);border:1px solid rgba(155,191,62,.28)}
.cmp-cell.b{background:rgba(212,169,74,.08);border:1px solid rgba(212,169,74,.24)}
.cmp-lbl{font-family:'IBM Plex Mono',monospace;font-size:.55rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.35rem;display:block}
.cmp-cell.a .cmp-lbl{color:var(--acc2)}
.cmp-cell.b .cmp-lbl{color:var(--warn)}
.cmp-note{font-size:.93rem;line-height:1.55;color:var(--tx2);margin-top:.7rem;padding-top:.65rem;border-top:1px solid var(--brd)}
.sym-card{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1rem .95rem;margin-bottom:.85rem}
.sym-head{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin-bottom:.35rem}
.sym-name{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--tx);line-height:1.3}
.sym-ref{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--acc2);white-space:nowrap}
.sym-fact{font-size:.97rem;line-height:1.5;color:var(--tx2);margin-bottom:.7rem}
.sym-opt{width:100%;background:var(--bg2);border:1.5px solid var(--brd);border-radius:10px;padding:.7rem .85rem;font-size:.97rem;line-height:1.45;color:var(--tx2);cursor:pointer;text-align:left;margin-bottom:.4rem;font-family:'DM Sans',sans-serif;transition:all .2s}
.sym-opt.sel{border-color:var(--acc2);color:var(--tx);background:rgba(155,191,62,.14)}
.sym-opt.ok{border-color:var(--ok);background:var(--ok-d);color:var(--ok)}
.sym-opt.bad{border-color:var(--err);background:var(--err-d);color:var(--err)}
.sym-opt:disabled{cursor:default}
.sym-expl{font-size:.95rem;line-height:1.55;color:var(--tx2);background:var(--surf2);border-radius:10px;padding:.75rem .85rem;margin-top:.35rem}
.check-btn{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#0c1004;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;margin-top:.2rem;transition:background .2s}
.check-btn:disabled{background:var(--brd2);color:var(--tx3);cursor:default}
.check-result{text-align:center;font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:600;color:var(--acc3);margin:.9rem 0 .4rem}
.faith-item{display:flex;gap:.75rem;align-items:flex-start;background:var(--surf);border:1px solid var(--brd);border-radius:12px;padding:.8rem .95rem;margin-bottom:.5rem;cursor:pointer;transition:all .2s}
.faith-item.on{border-color:var(--acc);background:rgba(155,191,62,.10)}
.faith-item svg{flex-shrink:0;margin-top:.15rem}
.faith-text{font-size:.97rem;line-height:1.5;color:var(--tx2)}
.faith-item.on .faith-text{color:var(--tx)}
.faith-count{font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--tx3);text-align:right;margin:.2rem 0 1rem;letter-spacing:.06em}
.btn-main{width:100%;background:var(--acc);border:none;border-radius:12px;padding:.9rem;color:#0c1004;font-size:1rem;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;margin-top:.7rem;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:.5rem}
.btn-main:hover{background:var(--acc2)}
.btn-main:disabled{background:var(--brd2);color:var(--tx3);cursor:default}
.btn-ghost{background:var(--surf);border:1.5px solid var(--brd2);border-radius:12px;padding:.7rem 1.2rem;font-size:.95rem;color:var(--acc2);cursor:pointer;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:.5rem;transition:border-color .2s}
.btn-ghost:hover{border-color:var(--acc)}
.step-tag{font-family:'IBM Plex Mono',monospace;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.55rem}
.step-tag .dot{width:18px;height:18px;border-radius:50%;background:rgba(155,191,62,.22);display:inline-flex;align-items:center;justify-content:center;font-size:.6rem;color:var(--acc3)}
.read-cue{display:flex;align-items:center;gap:.55rem;background:rgba(155,191,62,.10);border:1px solid rgba(155,191,62,.28);border-radius:12px;padding:.6rem .85rem;margin-bottom:.8rem;font-size:.92rem;line-height:1.4;color:var(--acc3)}
.read-cue svg{flex-shrink:0;color:var(--acc2)}
.titular{background:linear-gradient(135deg,rgba(155,191,62,.16),rgba(155,191,62,.03));border:1px solid rgba(155,191,62,.32);border-radius:16px;padding:1.2rem 1.1rem;margin-bottom:.85rem}
.titular-q{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:600;line-height:1.5;color:var(--tx);font-style:italic}
.titular-ref{font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--tx3);margin-top:.55rem;letter-spacing:.06em}
.ask{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.45;color:var(--tx);margin:.9rem 0 .6rem}
.pass{border-left:3px solid var(--acc);background:var(--bg2);border-radius:0 10px 10px 0;padding:.7rem .9rem .8rem;margin:.55rem 0;font-size:1.02rem;line-height:1.75;color:var(--tx)}
.pass-ref{font-family:'IBM Plex Mono',monospace;font-size:.6rem;color:var(--acc2);letter-spacing:.08em;text-transform:uppercase;margin-bottom:.3rem;display:block}
.hl{background:rgba(155,191,62,.28);color:var(--tx);border-radius:4px;padding:0 2px}
.hl-0{background:rgba(155,191,62,.30)}
.hl-1{background:rgba(224,169,74,.30)}
.hl-2{background:rgba(96,165,250,.28)}
.hl-3{background:rgba(244,114,182,.26)}
.chip-row{display:flex;flex-wrap:wrap;gap:.45rem;margin-bottom:.9rem}
.chip{border:1.5px solid var(--brd2);background:var(--surf);color:var(--tx2);border-radius:20px;padding:.4rem .8rem;font-size:.85rem;cursor:pointer;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:.4rem;transition:all .2s}
.chip .cnt{font-family:'IBM Plex Mono',monospace;font-size:.6rem;opacity:.8}
.chip.on.c0{border-color:var(--acc);background:rgba(155,191,62,.20);color:var(--tx)}
.chip.on.c1{border-color:#e0a94a;background:rgba(224,169,74,.20);color:var(--tx)}
.chip.on.c2{border-color:#60a5fa;background:rgba(96,165,250,.20);color:var(--tx)}
.chip.on.c3{border-color:#f472b6;background:rgba(244,114,182,.20);color:var(--tx)}
.dlg{display:flex;gap:.6rem;margin-bottom:.55rem;align-items:flex-start}
.dlg-who{font-family:'IBM Plex Mono',monospace;font-size:.52rem;text-transform:uppercase;letter-spacing:.06em;flex-shrink:0;width:62px;padding:.28rem .3rem;border-radius:7px;text-align:center;margin-top:.12rem}
.dlg-who.N{background:var(--surf2);color:var(--tx2)}
.dlg-who.A{background:rgba(96,165,250,.18);color:#93c5fd}
.dlg-who.F{background:rgba(155,191,62,.22);color:var(--acc3)}
.dlg-who.E{background:rgba(224,169,74,.20);color:#f3c775}
.dlg-text{font-size:1.02rem;line-height:1.65;color:var(--tx)}
.dlg-text.N{color:var(--tx2)}
.dlg-v{font-family:'IBM Plex Mono',monospace;font-size:.5rem;color:var(--acc2);vertical-align:super;margin-right:3px}
.roles{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.9rem}
.roles .dlg-who{width:auto;padding:.3rem .6rem;margin-top:0}
.teach{background:rgba(224,169,74,.07);border:1px dashed rgba(224,169,74,.42);border-radius:14px;padding:.85rem 1rem;margin-bottom:.9rem}
.teach-label{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--warn);display:flex;align-items:center;gap:.4rem;margin-bottom:.45rem}
.teach p,.teach li{font-size:.94rem;line-height:1.55;color:var(--tx2)}
.teach p+p{margin-top:.45rem}
.teach ul{list-style:none;padding:0}
.teach li{padding-left:.9rem;position:relative;margin-top:.3rem}
.teach li::before{content:'';position:absolute;left:0;top:.6rem;width:4px;height:4px;border-radius:50%;background:var(--warn)}
.teach strong{color:var(--tx)}
.opinion{width:100%;background:var(--surf);border:1.5px solid var(--brd);border-radius:12px;padding:.8rem 1rem;font-size:.98rem;color:var(--tx2);cursor:pointer;text-align:left;margin-bottom:.45rem;transition:all .2s;font-family:'DM Sans',sans-serif;line-height:1.45}
.opinion:hover:not(:disabled){border-color:var(--acc);background:var(--surf2)}
.opinion.sel{border-color:var(--acc2);background:rgba(155,191,62,.14);color:var(--tx)}
.opinion.ok{border-color:var(--ok);background:var(--ok-d);color:var(--ok)}
.opinion.bad{border-color:var(--err);background:var(--err-d);color:var(--err)}
.opinion:disabled{cursor:default}
.note{font-size:.95rem;line-height:1.6;color:var(--tx2);background:var(--surf2);border-radius:12px;padding:.8rem .95rem;margin:.55rem 0}
.note strong{color:var(--acc3)}
.principle{background:linear-gradient(135deg,rgba(155,191,62,.20),rgba(155,191,62,.04));border:1.5px solid rgba(155,191,62,.40);border-radius:16px;padding:1.1rem 1.05rem;margin:.85rem 0}
.principle-label{font-family:'IBM Plex Mono',monospace;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;color:var(--acc2);display:flex;align-items:center;gap:.4rem;margin-bottom:.55rem}
.principle-text{font-family:'Playfair Display',serif;font-size:1.05rem;line-height:1.6;color:var(--tx);font-weight:600}
.lens-head{display:flex;align-items:center;gap:.6rem;margin:1.4rem 0 .7rem}
.lens-badge{font-family:'IBM Plex Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;background:rgba(155,191,62,.22);color:var(--acc3);padding:.3rem .6rem;border-radius:8px;flex-shrink:0}
.lens-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--tx);line-height:1.25}
.divider{height:1px;background:var(--brd);margin:1.5rem 0 .5rem}
.pull{background:var(--surf);border:1px solid var(--brd);border-radius:16px;padding:1.1rem 1rem;margin-bottom:.85rem;text-align:center}
.pull-verse{font-family:'Playfair Display',serif;font-size:1.3rem;font-style:italic;font-weight:600;line-height:1.45;color:var(--tx);margin:.4rem 0 .3rem;animation:fadeIn .35s ease}
.pull-ref{font-family:'IBM Plex Mono',monospace;font-size:.68rem;color:var(--acc2);letter-spacing:.08em}
.toolkit{display:flex;gap:.8rem;align-items:flex-start;padding:.75rem 0;border-bottom:1px solid var(--brd)}
.toolkit:last-child{border-bottom:none}
.toolkit-n{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:var(--acc);line-height:1;width:1.5rem;flex-shrink:0}
.toolkit-t{font-size:1rem;font-weight:600;color:var(--tx);margin-bottom:.15rem}
.toolkit-d{font-size:.94rem;line-height:1.5;color:var(--tx2)}
`;

// ── VERSÍCULOS (RVR1960) ─────────────────────────────────────────────────────
// Fuente única: los casos, las dinámicas y la pestaña Biblia leen de aquí.

const VERSES = [
  // ── Texto base
  { g: "base", ref: "Hechos 8:26-40", isBase: true,
    text: `26 Un ángel del Señor habló a Felipe, diciendo: Levántate y ve hacia el sur, por el camino que desciende de Jerusalén a Gaza, el cual es desierto. 27 Entonces él se levantó y fue. Y sucedió que un etíope, eunuco, funcionario de Candace reina de los etíopes, el cual estaba sobre todos sus tesoros, y había venido a Jerusalén para adorar, 28 volvía sentado en su carro, y leyendo al profeta Isaías. 29 Y el Espíritu dijo a Felipe: Acércate y júntate a ese carro. 30 Acudiendo Felipe, le oyó que leía al profeta Isaías, y dijo: ¿Entiendes lo que lees? 31 Él dijo: ¿Y cómo podré, si alguno no me enseñare? Y rogó a Felipe que subiese y se sentara con él. 32 El pasaje de la Escritura que leía era este: Como oveja a la muerte fue llevado; y como cordero mudo delante del que lo trasquila, así no abrió su boca. 33 En su humillación no se le hizo justicia; mas su generación, ¿quién la contará? Porque fue quitada de la tierra su vida. 34 Respondiendo el eunuco, dijo a Felipe: Te ruego que me digas: ¿de quién dice el profeta esto; de sí mismo, o de algún otro? 35 Entonces Felipe, abriendo su boca, y comenzando desde esta escritura, le anunció el evangelio de Jesús. 36 Y yendo por el camino, llegaron a cierta agua, y dijo el eunuco: Aquí hay agua; ¿qué impide que yo sea bautizado? 37 Felipe dijo: Si crees de todo corazón, bien puedes. Respondiendo, dijo: Creo que Jesucristo es el Hijo de Dios. 38 Y mandó parar el carro; y descendieron ambos al agua, Felipe y el eunuco, y le bautizó. 39 Cuando subieron del agua, el Espíritu del Señor arrebató a Felipe; y el eunuco no le vio más, y siguió gozoso su camino. 40 Pero Felipe se encontró en Azoto; y pasando, anunciaba el evangelio en todas las ciudades, hasta que llegó a Cesarea.` },

  // ── De Emaús al etíope (semanas 1-2 y 7)
  { g: "lec", ref: "Lucas 24:21", text: `Pero nosotros esperábamos que él era el que había de redimir a Israel; y ahora, sobre todo esto, hoy es ya el tercer día desde que esto ha acontecido.` },
  { g: "lec", ref: "Lucas 24:25-27", text: `25 Entonces él les dijo: ¡Oh insensatos, y tardos de corazón para creer todo lo que los profetas han dicho! 26 ¿No era necesario que el Cristo padeciera estas cosas, y que entrara en su gloria? 27 Y comenzando desde Moisés, y siguiendo por todos los profetas, les declaraba en todas las Escrituras lo que de él decían.` },
  { g: "lec", ref: "Lucas 24:31-32", text: `31 Entonces les fueron abiertos los ojos, y le reconocieron; mas él se desapareció de su vista. 32 Y se decían el uno al otro: ¿No ardía nuestro corazón en nosotros, mientras nos hablaba en el camino, y cuando nos abría las Escrituras?` },
  { g: "lec", ref: "Lucas 24:33", text: `Y levantándose en la misma hora, volvieron a Jerusalén, y hallaron a los once reunidos, y a los que estaban con ellos,` },
  { g: "lec", ref: "Lucas 24:36", text: `Mientras ellos aún hablaban de estas cosas, Jesús se puso en medio de ellos, y les dijo: Paz a vosotros.` },
  { g: "lec", ref: "Lucas 24:44-49", text: `44 Y les dijo: Estas son las palabras que os hablé, estando aún con vosotros: que era necesario que se cumpliese todo lo que está escrito de mí en la ley de Moisés, en los profetas y en los salmos. 45 Entonces les abrió el entendimiento, para que comprendiesen las Escrituras; 46 y les dijo: Así está escrito, y así fue necesario que el Cristo padeciese, y resucitase de los muertos al tercer día; 47 y que se predicase en su nombre el arrepentimiento y el perdón de pecados en todas las naciones, comenzando desde Jerusalén. 48 Y vosotros sois testigos de ello. 49 He aquí, yo enviaré la promesa de mi Padre sobre vosotros; mas quedaos vosotros en la ciudad de Jerusalén, hasta que seáis investidos de poder desde lo alto.` },
  { g: "lec", ref: "Isaías 53:1-12", text: `1 ¿Quién ha creído a nuestro anuncio? ¿Y sobre quién se ha manifestado el brazo de Jehová? 2 Subirá cual renuevo delante de él, y como raíz de tierra seca; no hay parecer en él, ni hermosura; le veremos, mas sin atractivo para que le deseemos. 3 Despreciado y desechado entre los hombres, varón de dolores, experimentado en quebranto; y como que escondimos de él el rostro, fue menospreciado, y no lo estimamos. 4 Ciertamente llevó él nuestras enfermedades, y sufrió nuestros dolores; y nosotros le tuvimos por azotado, por herido de Dios y abatido. 5 Mas él herido fue por nuestras rebeliones, molido por nuestros pecados; el castigo de nuestra paz fue sobre él, y por su llaga fuimos nosotros curados. 6 Todos nosotros nos descarriamos como ovejas, cada cual se apartó por su camino; mas Jehová cargó en él el pecado de todos nosotros. 7 Angustiado él, y afligido, no abrió su boca; como cordero fue llevado al matadero; y como oveja delante de sus trasquiladores, enmudeció, y no abrió su boca. 8 Por cárcel y por juicio fue quitado; y su generación, ¿quién la contará? Porque fue cortado de la tierra de los vivientes, y por la rebelión de mi pueblo fue herido. 9 Y se dispuso con los impíos su sepultura, mas con los ricos fue en su muerte; aunque nunca hizo maldad, ni hubo engaño en su boca. 10 Con todo eso, Jehová quiso quebrantarlo, sujetándole a padecimiento. Cuando haya puesto su vida en expiación por el pecado, verá linaje, vivirá por largos días, y la voluntad de Jehová será en su mano prosperada. 11 Verá el fruto de la aflicción de su alma, y quedará satisfecho; por su conocimiento justificará mi siervo justo a muchos, y llevará las iniquidades de ellos. 12 Por tanto, yo le daré parte con los grandes, y con los fuertes repartirá despojos; por cuanto derramó su vida hasta la muerte, y fue contado con los pecadores, habiendo él llevado el pecado de muchos, y orado por los transgresores.` },
  { g: "lec", ref: "Lucas 10:25-37", text: `25 Y he aquí un intérprete de la ley se levantó y dijo, para ponerle a prueba: Maestro, ¿haciendo qué cosa heredaré la vida eterna? 26 Él le dijo: ¿Qué está escrito en la ley? ¿Cómo lees? 27 Aquél respondiendo, dijo: Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con todas tus fuerzas, y con toda tu mente; y a tu prójimo como a ti mismo. 28 Y le dijo: Bien has respondido; haz esto, y vivirás. 29 Pero él, queriendo justificarse a sí mismo, dijo a Jesús: ¿Y quién es mi prójimo? 30 Respondiendo Jesús, dijo: Un hombre descendía de Jerusalén a Jericó, y cayó en manos de ladrones, los cuales le despojaron; e hiriéndole, se fueron, dejándole medio muerto. 31 Aconteció que descendió un sacerdote por aquel camino, y viéndole, pasó de largo. 32 Asimismo un levita, llegando cerca de aquel lugar, y viéndole, pasó de largo. 33 Pero un samaritano que iba de camino, vino adonde él estaba, y al verle, fue movido a misericordia; 34 y acercándose, vendó sus heridas, echándoles aceite y vino; y poniéndole en su cabalgadura, lo llevó al mesón, y cuidó de él. 35 Otro día al partir, sacó dos denarios, y los dio al mesonero, y le dijo: Cuídamele; y todo lo que gastes de más, yo te lo pagaré cuando regrese. 36 ¿Quién, pues, de estos tres te parece que fue el prójimo del que cayó en manos de los ladrones? 37 Él dijo: El que usó de misericordia con él. Entonces Jesús le dijo: Ve, y haz tú lo mismo.` },
  { g: "lec", ref: "Mateo 27:5", text: `Y arrojando las piezas de plata en el templo, salió, y fue y se ahorcó.` },
  { g: "lec", ref: "Juan 13:27", text: `Y después del bocado, Satanás entró en él. Entonces Jesús le dijo: Lo que vas a hacer, hazlo más pronto.` },
  { g: "lec", ref: "1 Corintios 13:12", text: `Ahora vemos por espejo, oscuramente; mas entonces veremos cara a cara. Ahora conozco en parte; pero entonces conoceré como fui conocido.` },
  { g: "lec", ref: "2 Timoteo 4:1-5", text: `1 Te encarezco delante de Dios y del Señor Jesucristo, que juzgará a los vivos y a los muertos en su manifestación y en su reino, 2 que prediques la palabra; que instes a tiempo y fuera de tiempo; redarguye, reprende, exhorta con toda paciencia y doctrina. 3 Porque vendrá tiempo cuando no soportarán la sana doctrina, sino que teniendo comezón de oír, se amontonarán maestros conforme a sus propias concupiscencias, 4 y apartarán de la verdad el oído y se volverán a las fábulas. 5 Pero tú sé sobrio en todo, soporta las aflicciones, haz obra de evangelista, cumple tu ministerio.` },
  { g: "lec", ref: "Salmos 51:12", text: `Vuélveme el gozo de tu salvación, y espíritu noble me sustente.` },
  { g: "lec", ref: "Juan 17:17", text: `Santifícalos en tu verdad; tu palabra es verdad.` },
  { g: "lec", ref: "Juan 16:13", text: `Pero cuando venga el Espíritu de verdad, él os guiará a toda la verdad; porque no hablará por su propia cuenta, sino que hablará todo lo que oyere, y os hará saber las cosas que habrán de venir.` },
  { g: "lec", ref: "Mateo 4:4", text: `El respondió y dijo: Escrito está: No sólo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.` },
  { g: "lec", ref: "Mateo 28:20", text: `enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.` },

  // ── Contexto histórico y cultural (semana 3)
  { g: "ctx", ref: "Isaías 65:17-20", text: `17 Porque he aquí que yo crearé nuevos cielos y nueva tierra; y de lo primero no habrá memoria, ni más vendrá al pensamiento. 18 Mas os gozaréis y os alegraréis para siempre en las cosas que yo he creado; porque he aquí que yo traigo a Jerusalén alegría, y a su pueblo gozo. 19 Y me alegraré con Jerusalén, y me gozaré con mi pueblo; y nunca más se oirá en ella voz de lloro, ni voz de clamor. 20 No habrá más allí niño que muera de pocos días, ni viejo que sus días no cumpla; porque el niño morirá de cien años, y el pecador de cien años será maldito.` },
  { g: "ctx", ref: "Isaías 26:19", text: `Tus muertos vivirán; sus cadáveres resucitarán. ¡Despertad y cantad, moradores del polvo! Porque tu rocío es cual rocío de hortalizas, y la tierra dará a luz los muertos.` },
  { g: "ctx", ref: "Isaías 25:8", text: `Destruirá a la muerte para siempre; y enjugará Jehová el Señor las lágrimas de todos los rostros, y quitará la afrenta de su pueblo de toda la tierra; porque Jehová lo ha dicho.` },
  { g: "ctx", ref: "Deuteronomio 28:1-2, 15", text: `1 Acontecerá que si oyeres atentamente la voz de Jehová tu Dios, para guardar y poner por obra todos sus mandamientos que yo te prescribo hoy, también Jehová tu Dios te exaltará sobre todas las naciones de la tierra. 2 Y vendrán sobre ti todas estas bendiciones, y te alcanzarán, si oyeres la voz de Jehová tu Dios. [...] 15 Pero acontecerá, si no oyeres la voz de Jehová tu Dios, para guardar y cumplir todos sus mandamientos y sus estatutos que yo te intimo hoy, que vendrán sobre ti todas estas maldiciones, y te alcanzarán.` },
  { g: "ctx", ref: "Mateo 24:1-3", text: `1 Cuando Jesús salió del templo y se iba, se acercaron sus discípulos para mostrarle los edificios del templo. 2 Respondiendo él, les dijo: ¿Veis todo esto? De cierto os digo, que no quedará aquí piedra sobre piedra, que no sea derribada. 3 Y estando él sentado en el monte de los Olivos, los discípulos se le acercaron aparte, diciendo: Dinos, ¿cuándo serán estas cosas, y qué señal habrá de tu venida, y del fin del siglo?` },
  { g: "ctx", ref: "1 Corintios 16:20", text: `Todos los hermanos os saludan. Saludaos los unos a los otros con ósculo santo.` },
  { g: "ctx", ref: "Romanos 16:16", text: `Saludaos unos a otros con ósculo santo. Os saludan todas las iglesias de Cristo.` },
  { g: "ctx", ref: "2 Corintios 13:12", text: `Saludaos unos a otros con ósculo santo.` },
  { g: "ctx", ref: "1 Tesalonicenses 5:26", text: `Saludad a todos los hermanos con ósculo santo.` },

  // ── Interpretar bien (semana 4)
  { g: "int", ref: "Génesis 3:1-5", text: `1 Pero la serpiente era astuta, más que todos los animales del campo que Jehová Dios había hecho; la cual dijo a la mujer: ¿Conque Dios os ha dicho: No comáis de todo árbol del huerto? 2 Y la mujer respondió a la serpiente: Del fruto de los árboles del huerto podemos comer; 3 pero del fruto del árbol que está en medio del huerto dijo Dios: No comeréis de él, ni lo tocaréis, para que no muráis. 4 Entonces la serpiente dijo a la mujer: No moriréis; 5 sino que sabe Dios que el día que comáis de él, serán abiertos vuestros ojos, y seréis como Dios, sabiendo el bien y el mal.` },
  { g: "int", ref: "Mateo 4:5-7", text: `5 Entonces el diablo le llevó a la santa ciudad, y le puso sobre el pináculo del templo, 6 y le dijo: Si eres Hijo de Dios, échate abajo; porque escrito está: A sus ángeles mandará por ti, y en sus manos te sostendrán, para que no tropieces con tu pie en piedra. 7 Jesús le dijo: Escrito está también: No tentarás al Señor tu Dios.` },
  { g: "int", ref: "2 Pedro 3:15-16", text: `15 Y tened entendido que la paciencia de nuestro Señor es para salvación; como también nuestro amado hermano Pablo, según la sabiduría que le ha sido dada, os ha escrito, 16 casi en todas sus epístolas, hablando en ellas de esto; entre las cuales hay algunas difíciles de entender, las cuales los ignorantes e inestables tuercen, como también las otras Escrituras, para su propia perdición.` },
  { g: "int", ref: "2 Timoteo 2:15", text: `Procura con diligencia presentarte a Dios aprobado, como obrero que no tiene de qué avergonzarse, que usa bien la palabra de verdad.` },
  { g: "int", ref: "2 Pedro 1:20-21", text: `20 entendiendo primero esto, que ninguna profecía de la Escritura es de interpretación privada, 21 porque nunca la profecía fue traída por voluntad humana, sino que los santos hombres de Dios hablaron siendo inspirados por el Espíritu Santo.` },
  { g: "int", ref: "Salmos 119:125", text: `Tu siervo soy yo, dame entendimiento para conocer tus testimonios.` },
  { g: "int", ref: "Daniel 9:13", text: `Conforme está escrito en la ley de Moisés, todo este mal vino sobre nosotros, y no hemos rogado a Jehová nuestro Dios, para convertirnos de nuestras maldades y entender tu verdad.` },
  { g: "int", ref: "Daniel 9:23", text: `Al principio de tus ruegos fue dada la orden, y yo he venido para enseñártela, porque tú eres muy amado. Entiende, pues, la orden, y entiende la visión.` },

  // ── La Biblia se interpreta a sí misma (semana 5)
  { g: "sola", ref: "2 Timoteo 3:16", text: `Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia,` },
  { g: "sola", ref: "Mateo 5:17-22, 27-28", text: `17 No penséis que he venido para abrogar la ley o los profetas; no he venido para abrogar, sino para cumplir. 18 Porque de cierto os digo que hasta que pasen el cielo y la tierra, ni una jota ni una tilde pasará de la ley, hasta que todo se haya cumplido. 19 De manera que cualquiera que quebrante uno de estos mandamientos muy pequeños, y así enseñe a los hombres, muy pequeño será llamado en el reino de los cielos; mas cualquiera que los haga y los enseñe, éste será llamado grande en el reino de los cielos. 20 Porque os digo que si vuestra justicia no fuere mayor que la de los escribas y fariseos, no entraréis en el reino de los cielos. 21 Oísteis que fue dicho a los antiguos: No matarás; y cualquiera que matare será culpable de juicio. 22 Pero yo os digo que cualquiera que se enoje contra su hermano, será culpable de juicio; y cualquiera que diga: Necio, a su hermano, será culpable ante el concilio; y cualquiera que le diga: Fatuo, quedará expuesto al infierno de fuego. [...] 27 Oísteis que fue dicho: No cometerás adulterio. 28 Pero yo os digo que cualquiera que mira a una mujer para codiciarla, ya adulteró con ella en su corazón.` },
  { g: "sola", ref: "Jeremías 31:31-34", text: `31 He aquí vienen días, dice Jehová, en los cuales haré nuevo pacto con la casa de Israel y con la casa de Judá. 32 No como el pacto que hice con sus padres el día que tomé su mano para sacarlos de la tierra de Egipto; porque ellos invalidaron mi pacto, aunque fui yo un marido para ellos, dice Jehová. 33 Pero este es el pacto que haré con la casa de Israel después de aquellos días, dice Jehová: Daré mi ley en su mente, y la escribiré en su corazón; y yo seré a ellos por Dios, y ellos me serán por pueblo. 34 Y no enseñará más ninguno a su prójimo, ni ninguno a su hermano, diciendo: Conoce a Jehová; porque todos me conocerán, desde el más pequeño de ellos hasta el más grande, dice Jehová; porque perdonaré la maldad de ellos, y no me acordaré más de su pecado.` },
  { g: "sola", ref: "Hebreos 8:8-10", text: `8 Porque reprendiéndolos dice: He aquí vienen días, dice el Señor, en que estableceré con la casa de Israel y la casa de Judá un nuevo pacto; 9 no como el pacto que hice con sus padres el día que los tomé de la mano para sacarlos de la tierra de Egipto; porque ellos no permanecieron en mi pacto, y yo me desentendí de ellos, dice el Señor. 10 Por lo cual, este es el pacto que haré con la casa de Israel después de aquellos días, dice el Señor: Pondré mis leyes en la mente de ellos, y sobre su corazón las escribiré; y seré a ellos por Dios, y ellos me serán a mí por pueblo;` },
  { g: "sola", ref: "Hebreos 10:16", text: `Este es el pacto que haré con ellos después de aquellos días, dice el Señor: Pondré mis leyes en sus corazones, y en sus mentes las escribiré,` },
  { g: "sola", ref: "Daniel 2:31-35", text: `31 Tú, oh rey, veías, y he aquí una gran imagen. Esta imagen, que era muy grande, y cuya gloria era muy sublime, estaba en pie delante de ti, y su aspecto era terrible. 32 La cabeza de esta imagen era de oro fino; su pecho y sus brazos, de plata; su vientre y sus muslos, de bronce; 33 sus piernas, de hierro; sus pies, en parte de hierro y en parte de barro cocido. 34 Estabas mirando, hasta que una piedra fue cortada, no con mano, e hirió a la imagen en sus pies de hierro y de barro cocido, y los desmenuzó. 35 Entonces fueron desmenuzados también el hierro, el barro cocido, el bronce, la plata y el oro, y fueron como tamo de las eras del verano, y se los llevó el viento sin que de ellos quedara rastro alguno; mas la piedra que hirió a la imagen fue hecha un gran monte que llenó toda la tierra.` },
  { g: "sola", ref: "Daniel 2:36-45", text: `36 Este es el sueño; también la interpretación de él diremos en presencia del rey. 37 Tú, oh rey, eres rey de reyes; porque el Dios del cielo te ha dado reino, poder, fuerza y majestad. 38 Y dondequiera que habitan hijos de hombres, bestias del campo y aves del cielo, él los ha entregado en tu mano, y te ha dado el dominio sobre todo; tú eres aquella cabeza de oro. 39 Y después de ti se levantará otro reino inferior al tuyo; y luego un tercer reino de bronce, el cual dominará sobre toda la tierra. 40 Y el cuarto reino será fuerte como hierro; y como el hierro desmenuza y rompe todas las cosas, desmenuzará y quebrantará todo. 41 Y lo que viste de los pies y los dedos, en parte de barro cocido de alfarero y en parte de hierro, será un reino dividido; mas habrá en él algo de la fuerza del hierro, de la manera que viste el hierro mezclado con el barro cocido. 42 Y por ser los dedos de los pies en parte de hierro y en parte de barro cocido, el reino será en parte fuerte, y en parte frágil. 43 En cuanto a lo que viste del hierro mezclado con barro, se mezclarán por medio de alianzas humanas; pero no se unirán el uno con el otro, como el hierro no se mezcla con el barro. 44 Y en los días de estos reyes el Dios del cielo levantará un reino que no será jamás destruido, ni será el reino dejado a otro pueblo; desmenuzará y consumirá a todos estos reinos, pero él permanecerá para siempre, 45 de la manera que viste que del monte fue cortada una piedra, no con mano, la cual desmenuzó el hierro, el bronce, el barro, la plata y el oro. El gran Dios ha mostrado al rey lo que ha de acontecer en lo por venir; y el sueño es verdadero, y fiel su interpretación.` },
  { g: "sola", ref: "Mateo 13:3-9", text: `3 Y les habló muchas cosas por parábolas, diciendo: He aquí, el sembrador salió a sembrar. 4 Y mientras sembraba, parte de la semilla cayó junto al camino; y vinieron las aves y la comieron. 5 Parte cayó en pedregales, donde no tenía mucha tierra; y brotó pronto, porque no tenía profundidad de tierra; 6 pero salido el sol, se quemó; y porque no tenía raíz, se secó. 7 Y parte cayó entre espinos; y los espinos crecieron, y la ahogaron. 8 Pero parte cayó en buena tierra, y dio fruto, cuál a ciento, cuál a sesenta, y cuál a treinta por uno. 9 El que tiene oídos para oír, oiga.` },
  { g: "sola", ref: "Mateo 13:18-23", text: `18 Oíd, pues, vosotros la parábola del sembrador: 19 Cuando alguno oye la palabra del reino y no la entiende, viene el malo, y arrebata lo que fue sembrado en su corazón. Este es el que fue sembrado junto al camino. 20 Y el que fue sembrado en pedregales, éste es el que oye la palabra, y al momento la recibe con gozo; 21 pero no tiene raíz en sí, sino que es de corta duración, pues al venir la aflicción o la persecución por causa de la palabra, luego tropieza. 22 El que fue sembrado entre espinos, éste es el que oye la palabra, pero el afán de este siglo y el engaño de las riquezas ahogan la palabra, y se hace infructuosa. 23 Mas el que fue sembrado en buena tierra, éste es el que oye y entiende la palabra, y da fruto; y produce a ciento, a sesenta, y a treinta por uno.` },
  { g: "sola", ref: "2 Crónicas 36:20-23", text: `20 Y a los que escaparon de la espada, llevó cautivos a Babilonia; y fueron siervos suyos y de sus hijos, hasta que vino el reino de los persas; 21 para que se cumpliese la palabra de Jehová por boca de Jeremías, hasta que la tierra hubiese gozado de reposo; porque todo el tiempo de su asolamiento reposó, hasta que los setenta años fueron cumplidos. 22 Mas al primer año de Ciro rey de los persas, para que se cumpliese la palabra de Jehová por boca de Jeremías, Jehová excitó el espíritu de Ciro rey de los persas, el cual hizo pregonar de palabra y también por escrito, por todo su reino, diciendo: 23 Así dice Ciro rey de los persas: Jehová, el Dios de los cielos, me ha dado todos los reinos de la tierra; y él me ha mandado que le edifique casa en Jerusalén, que está en Judá. ¿Quién de entre vosotros hay de todo su pueblo? Sea Jehová su Dios con él, y suba.` },
  { g: "sola", ref: "Jeremías 25:11-12", text: `11 Toda esta tierra será puesta en ruinas y en espanto; y servirán estas naciones al rey de Babilonia setenta años. 12 Y cuando sean cumplidos los setenta años, castigaré al rey de Babilonia y a aquella nación por su maldad, ha dicho Jehová, y a la tierra de los caldeos; y la convertiré en desiertos para siempre.` },
  { g: "sola", ref: "Jeremías 29:10", text: `Porque así dijo Jehová: Cuando se cumplan para Babilonia setenta años, yo os visitaré, y despertaré sobre vosotros mi buena palabra, para haceros volver a este lugar.` },
  { g: "sola", ref: "1 Pedro 1:10-12", text: `10 Los profetas que profetizaron de la gracia destinada a vosotros, inquirieron y diligentemente indagaron acerca de esta salvación, 11 escudriñando qué persona y qué tiempo indicaba el Espíritu de Cristo que estaba en ellos, el cual anunciaba de antemano los sufrimientos de Cristo, y las glorias que vendrían tras ellos. 12 A éstos se les reveló que no para sí mismos, sino para nosotros, administraban las cosas que ahora os son anunciadas por los que os han predicado el evangelio por el Espíritu Santo enviado del cielo; cosas en las cuales desean mirar los ángeles.` },

  // ── Ejemplos de la clase (casos y prácticas)
  { g: "ej", ref: "Salmos 14:1", text: `Dice el necio en su corazón: No hay Dios. Se han corrompido, hacen obras abominables; no hay quien haga bien.` },
  { g: "ej", ref: "Salmos 91:11-12", text: `11 Pues a sus ángeles mandará acerca de ti, que te guarden en todos tus caminos. 12 En las manos te llevarán, para que tu pie no tropiece en piedra.` },
  { g: "ej", ref: "Romanos 6:1-2", text: `1 ¿Qué, pues, diremos? ¿Perseveraremos en el pecado para que la gracia abunde? 2 En ninguna manera; porque los que hemos muerto al pecado, ¿cómo viviremos aún en él?` },
  { g: "ej", ref: "Romanos 6:12-15", text: `12 No reine, pues, el pecado en vuestro cuerpo mortal, de modo que lo obedezcáis en sus concupiscencias; 13 ni tampoco presentéis vuestros miembros al pecado como instrumentos de iniquidad, sino presentaos vosotros mismos a Dios como vivos de entre los muertos, y vuestros miembros a Dios como instrumentos de justicia. 14 Porque el pecado no se enseñoreará de vosotros; pues no estáis bajo la ley, sino bajo la gracia. 15 ¿Qué pues? ¿Pecaremos, porque no estamos bajo la ley sino bajo la gracia? En ninguna manera.` },
  { g: "ej", ref: "Romanos 3:31", text: `¿Luego por la fe invalidamos la ley? En ninguna manera, sino que confirmamos la ley.` },
  { g: "ej", ref: "Romanos 7:12", text: `De manera que la ley a la verdad es santa, y el mandamiento santo, justo y bueno.` },
  { g: "ej", ref: "Daniel 9:24-27", text: `24 Setenta semanas están determinadas sobre tu pueblo y sobre tu santa ciudad, para terminar la prevaricación, y poner fin al pecado, y expiar la iniquidad, para traer la justicia perpetua, y para sellar la visión y la profecía, y para ungir al Santo de los santos. 25 Sabe, pues, y entiende, que desde la salida de la orden para restaurar y edificar a Jerusalén hasta el Mesías Príncipe, habrá siete semanas, y sesenta y dos semanas; se volverá a edificar la plaza y el muro en tiempos angustiosos. 26 Y después de las sesenta y dos semanas se quitará la vida al Mesías, mas no por sí; y el pueblo de un príncipe que ha de venir destruirá la ciudad y el santuario; y su fin será con inundación, y hasta el fin de la guerra durarán las devastaciones. 27 Y por otra semana confirmará el pacto con muchos; a la mitad de la semana hará cesar el sacrificio y la ofrenda. Después con la muchedumbre de las abominaciones vendrá el desolador, hasta que venga la consumación, y lo que está determinado se derrame sobre el desolador.` },
  { g: "ej", ref: "Números 14:34", text: `Conforme al número de los días, de los cuarenta días en que reconocisteis la tierra, llevaréis vuestras faltas cuarenta años, un año por cada día; y conoceréis mi castigo.` },
  { g: "ej", ref: "Ezequiel 4:6", text: `Cumplidos estos, te acostarás sobre tu lado derecho segunda vez, y llevarás la maldad de la casa de Judá cuarenta días; día por año, día por año te lo he dado.` },
  { g: "ej", ref: "Daniel 7:17", text: `Estas cuatro grandes bestias son cuatro reyes que se levantarán en la tierra.` },
  { g: "ej", ref: "Daniel 7:25", text: `Y hablará palabras contra el Altísimo, y a los santos del Altísimo quebrantará, y pensará en cambiar los tiempos y la ley; y los santos serán entregados en su mano hasta tiempo, y tiempos, y medio tiempo.` },
  { g: "ej", ref: "Apocalipsis 12:6", text: `Y la mujer huyó al desierto, donde tiene lugar preparado por Dios, para que allí la sustenten durante mil doscientos sesenta días.` },
  { g: "ej", ref: "Apocalipsis 12:14", text: `Y se le dieron a la mujer las dos alas de la gran águila, para que volase de delante de la serpiente al desierto, a su lugar, donde es sustentada por un tiempo, y tiempos, y la mitad de un tiempo.` },
  { g: "ej", ref: "Lucas 14:26", text: `Si alguno viene a mí, y no aborrece a su padre, y madre, y mujer, e hijos, y hermanos, y aun a su propia vida, no puede ser mi discípulo.` },
  { g: "ej", ref: "Mateo 10:37", text: `El que ama a padre o madre más que a mí, no es digno de mí; el que ama a hijo o hija más que a mí, no es digno de mí;` },
  { g: "ej", ref: "Deuteronomio 21:15", text: `Si un hombre tuviere dos mujeres, la una amada y la otra aborrecida, y la amada y la aborrecida le hubieren dado hijos, y el hijo primogénito fuere de la aborrecida,` },
  { g: "ej", ref: "Juan 19:26-27", text: `26 Cuando vio Jesús a su madre, y al discípulo a quien él amaba, que estaba presente, dijo a su madre: Mujer, he ahí tu hijo. 27 Después dijo al discípulo: He ahí tu madre. Y desde aquella hora el discípulo la recibió en su casa.` },
  { g: "ej", ref: "Marcos 7:10-13", text: `10 Porque Moisés dijo: Honra a tu padre y a tu madre; y: El que maldiga al padre o a la madre, muera irremisiblemente. 11 Pero vosotros decís: Basta que diga un hombre al padre o a la madre: Es Corbán (esto es, mi ofrenda a Dios) todo aquello con que pudiera ayudarte, 12 y no le dejáis hacer más por su padre o por su madre, 13 invalidando la palabra de Dios con vuestra tradición que habéis transmitido. Y muchas cosas hacéis semejantes a esta.` },
  { g: "ej", ref: "Juan 4:9", text: `La mujer samaritana le dijo: ¿Cómo tú, siendo judío, me pides a mí de beber, que soy mujer samaritana? Porque judíos y samaritanos no se tratan entre sí.` },
  { g: "ej", ref: "Juan 8:48", text: `Respondieron entonces los judíos, y le dijeron: ¿No decimos bien nosotros que tú eres samaritano, y que tienes demonio?` },
  { g: "ej", ref: "Isaías 56:3-5", text: `3 Y el extranjero que sigue a Jehová no hable diciendo: Me apartará totalmente Jehová de su pueblo; ni diga el eunuco: He aquí yo soy árbol seco. 4 Porque así dijo Jehová: A los eunucos que guarden mis días de reposo, y escojan lo que yo quiero, y abracen mi pacto, 5 yo les daré en mi casa y dentro de mis muros lugar y nombre mejor que el de hijos e hijas; nombre perpetuo les daré, que nunca perecerá.` },
  { g: "ej", ref: "Mateo 27:12-14", text: `12 Y siendo acusado por los principales sacerdotes y por los ancianos, nada respondió. 13 Pilato le dijo: ¿No oyes cuántas cosas testifican contra ti? 14 Pero Jesús no le respondió ni una palabra; de tal manera que el gobernador se maravillaba mucho.` },
  { g: "ej", ref: "Mateo 27:57-60", text: `57 Cuando llegó la noche, vino un hombre rico de Arimatea, llamado José, que también había sido discípulo de Jesús. 58 Este fue a Pilato y pidió el cuerpo de Jesús. Entonces Pilato mandó que se le diese el cuerpo. 59 Y tomando José el cuerpo, lo envolvió en una sábana limpia, 60 y lo puso en su sepulcro nuevo, que había labrado en la peña; y después de hacer rodar una gran piedra a la puerta del sepulcro, se fue.` },
  { g: "ej", ref: "Juan 1:11", text: `A lo suyo vino, y los suyos no le recibieron.` },
  { g: "ej", ref: "1 Pedro 2:24", text: `quien llevó él mismo nuestros pecados en su cuerpo sobre el madero, para que nosotros, estando muertos a los pecados, vivamos a la justicia; y por cuya herida fuisteis sanados.` },
  { g: "ej", ref: "Lucas 22:37", text: `Porque os digo que es necesario que se cumpla todavía en mí aquello que está escrito: Y fue contado con los inicuos; porque lo que está escrito de mí, tiene cumplimiento.` },
  { g: "ej", ref: "Filipenses 4:11-13", text: `11 No lo digo porque tenga escasez, pues he aprendido a contentarme, cualquiera que sea mi situación. 12 Sé vivir humildemente, y sé tener abundancia; en todo y por todo estoy enseñado, así para estar saciado como para tener hambre, así para tener abundancia como para padecer necesidad. 13 Todo lo puedo en Cristo que me fortalece.` },
  { g: "ej", ref: "Jeremías 29:11", text: `Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.` },
  { g: "ej", ref: "Mateo 18:15-20", text: `15 Por tanto, si tu hermano peca contra ti, ve y repréndele estando tú y él solos; si te oyere, has ganado a tu hermano. 16 Mas si no te oyere, toma aún contigo a uno o dos, para que en boca de dos o tres testigos conste toda palabra. 17 Si no los oyere a ellos, dilo a la iglesia; y si no oyere a la iglesia, tenle por gentil y publicano. 18 De cierto os digo que todo lo que atéis en la tierra, será atado en el cielo; y todo lo que desatéis en la tierra, será desatado en el cielo. 19 Otra vez os digo que si dos de vosotros se pusieren de acuerdo en la tierra acerca de cualquiera cosa que pidieren, les será hecho por mi Padre que está en los cielos. 20 Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.` },
];

const VMAP = Object.fromEntries(VERSES.map(v => [v.ref, v.text]));

const GROUPS = [
  { g: "base", label: "Texto base" },
  { g: "lec", label: "De Emaús al etíope" },
  { g: "ctx", label: "Contexto histórico y cultural" },
  { g: "int", label: "Interpretar bien la Palabra" },
  { g: "sola", label: "La Biblia se interpreta a sí misma" },
  { g: "ej", label: "Ejemplos y prácticas de la clase" },
];

// ── CONTENIDO ────────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  { time: "00–03 min", title: "Bienvenida + «El experimento del dedo» (Inicio)", desc: "Que todos toquen el botón del experimento (Mateo 27:5, Lucas 10:37, Juan 13:27) y lean en voz alta lo que les salió. Dejar que se rían. Después preguntar: «¿Esto es leer la Biblia? ¿Qué falló?». Es el anzuelo de toda la clase: un versículo auténtico puede decir algo falso si lo sacamos de su contexto." },
  { time: "03–05 min", title: "Pedidos y oración", desc: "Recoger pedidos. Orar pidiendo humildad para escuchar la Palabra y que el Espíritu Santo guíe a toda la verdad (Juan 16:13)." },
  { time: "05–10 min", title: "Camino — Hechos 8:26-40", desc: "Lectura a cuatro voces (narrador, ángel/Espíritu, Felipe, etíope): pedir cuatro voluntarios. Activar el detective de palabras y preguntar qué se repite. Remarcar la pregunta del etíope en v. 34: «¿de quién dice el profeta esto?». Cerrar con el puente Isaías 53 → Jesús: cada alumno resuelve y se comenta en voz alta." },
  { time: "10–20 min", title: "Lentes — tres casos para interpretar", desc: "Un caso por lente, unos 3 minutos cada uno: 1) Romanos 6:14 (contexto literario), 2) Daniel 9:24 (contexto bíblico general: día por año), 3) Lucas 14:26 (histórico y cultural). En cada caso: voluntario lee el titular → todos eligen su postura → mano alzada por opción → se revela el contexto → se resuelve el detective. Si hay tiempo: el caso extra del buen samaritano." },
  { time: "20–23 min", title: "Paralelos — la Biblia se explica sola", desc: "Dos dinámicas rápidas: Daniel 2 (el sueño y su interpretación en el mismo capítulo) y Mateo 13 (el sembrador y su explicación). Mostrar que la Biblia misma trae la llave. Mencionar 2 Crónicas 36 ↔ Jeremías 25 y el Sermón del Monte ↔ Jeremías 31." },
  { time: "23–25 min", title: "Elena — cómo leer sus escritos", desc: "Las cinco pautas y la dinámica de las bicicletas (1894, Battle Creek): el mismo método aplicado a un profeta moderno. Es la parte más prescindible si falta tiempo." },
  { time: "25–28 min", title: "Quiz interactivo", desc: "Las 8 preguntas en conjunto; leer cada explicación. Detenerse en la pregunta de Satanás citando la Biblia (Mateo 4:5-7) y en «aborrecer» (Lucas 14:26)." },
  { time: "28–30 min", title: "Reflexión y cierre", desc: "Elegir 2 o 3 preguntas de Cierre (no todas). Leer «Para tu vida» y proponer el reto de la semana. Orar en vivo." },
];

const TOOLKIT = [
  { t: "Las palabras", d: "¿Qué significa cada palabra importante? ¿Qué quería decir en ese idioma y en esa época?" },
  { t: "Contexto literario", d: "¿Qué dicen los versículos de antes y de después? ¿Cuál es el argumento del autor?" },
  { t: "Contexto bíblico general", d: "¿Qué dicen otros pasajes de la Biblia sobre lo mismo? Comparar pasajes paralelos." },
  { t: "Marco histórico y cultural", d: "¿Quién lo escribió, a quién, cuándo y en qué cultura?" },
  { t: "Armonía con toda la Escritura", d: "¿Mi conclusión está de acuerdo con lo que enseña la Biblia en su conjunto?" },
];

// Experimento del dedo
const AZAR = [
  { ref: "Mateo 27:5", frag: "…y fue y se ahorcó.", ctx: "Es el final de Judas, que se arrepintió tarde de haber traicionado a Jesús (Mat. 27:3-5). No es una orden ni un consejo para nadie." },
  { ref: "Lucas 10:37", frag: "Ve, y haz tú lo mismo.", ctx: "Jesús termina la parábola del buen samaritano: «haz lo mismo» significa mostrar misericordia con quien lo necesita, no copiar cualquier cosa que estés pensando." },
  { ref: "Juan 13:27", frag: "Lo que vas a hacer, hazlo más pronto.", ctx: "Jesús habla con Judas en la última cena, sabiendo que lo traicionaría. No es una luz verde para tu plan." },
];

// Hechos 8 a varias voces
const DIALOGO = [
  { v: "26", who: "N", text: "Un ángel del Señor habló a Felipe, diciendo:" },
  { who: "A", text: "Levántate y ve hacia el sur, por el camino que desciende de Jerusalén a Gaza, el cual es desierto." },
  { v: "27-28", who: "N", text: "Entonces él se levantó y fue. Y sucedió que un etíope, eunuco, funcionario de Candace reina de los etíopes, el cual estaba sobre todos sus tesoros, y había venido a Jerusalén para adorar, volvía sentado en su carro, y leyendo al profeta Isaías." },
  { v: "29", who: "N", text: "Y el Espíritu dijo a Felipe:" },
  { who: "A", text: "Acércate y júntate a ese carro." },
  { v: "30", who: "N", text: "Acudiendo Felipe, le oyó que leía al profeta Isaías, y dijo:" },
  { who: "F", text: "¿Entiendes lo que lees?" },
  { v: "31", who: "N", text: "Él dijo:" },
  { who: "E", text: "¿Y cómo podré, si alguno no me enseñare?" },
  { who: "N", text: "Y rogó a Felipe que subiese y se sentara con él." },
  { v: "32-33", who: "N", text: "El pasaje de la Escritura que leía era este:" },
  { who: "E", text: "Como oveja a la muerte fue llevado; y como cordero mudo delante del que lo trasquila, así no abrió su boca. En su humillación no se le hizo justicia; mas su generación, ¿quién la contará? Porque fue quitada de la tierra su vida." },
  { v: "34", who: "N", text: "Respondiendo el eunuco, dijo a Felipe:" },
  { who: "E", text: "Te ruego que me digas: ¿de quién dice el profeta esto; de sí mismo, o de algún otro?" },
  { v: "35", who: "N", text: "Entonces Felipe, abriendo su boca, y comenzando desde esta escritura, le anunció el evangelio de Jesús." },
  { v: "36", who: "N", text: "Y yendo por el camino, llegaron a cierta agua, y dijo el eunuco:" },
  { who: "E", text: "Aquí hay agua; ¿qué impide que yo sea bautizado?" },
  { v: "37", who: "F", text: "Si crees de todo corazón, bien puedes." },
  { who: "N", text: "Respondiendo, dijo:" },
  { who: "E", text: "Creo que Jesucristo es el Hijo de Dios." },
  { v: "38-40", who: "N", text: "Y mandó parar el carro; y descendieron ambos al agua, Felipe y el eunuco, y le bautizó. Cuando subieron del agua, el Espíritu del Señor arrebató a Felipe; y el eunuco no le vio más, y siguió gozoso su camino. Pero Felipe se encontró en Azoto; y pasando, anunciaba el evangelio en todas las ciudades, hasta que llegó a Cesarea." },
];
const WHO = { N: "Narrador", A: "Ángel / Espíritu", F: "Felipe", E: "Etíope" };

// Detective de palabras (con regex sin acentos problemáticos)
const CATS = [
  { id: "leer", label: "Leer y Escritura", re: "leyendo|leía|lees|Escritura|escritura|Isaías" },
  { id: "ens", label: "Entender y enseñar", re: "Entiendes|enseñare|anunció|anunciaba|evangelio" },
  { id: "cam", label: "Camino y carro", re: "camino|carro" },
  { id: "agua", label: "Agua y bautismo", re: "agua|bautizado|bautizó" },
];

const PUENTE = [
  { key: "p1", name: "Isaías 53:7", ref: "Cordero", fact: "«Como cordero fue llevado al matadero; y como oveja delante de sus trasquiladores, enmudeció, y no abrió su boca.»",
    opts: ["Jesús calmó la tormenta con una palabra", "Ante las acusaciones de los sacerdotes y de Pilato, Jesús guardó silencio", "Jesús expulsó a los vendedores del templo"], ans: 1,
    refs: ["Mateo 27:12-14"],
    expl: "Cuando lo acusaron, «nada respondió» (Mat. 27:12-14). Isaías lo había descrito siglos antes: el Siervo callaría como un cordero." },
  { key: "p2", name: "Isaías 53:9", ref: "Sepultura", fact: "«…y se dispuso con los impíos su sepultura, mas con los ricos fue en su muerte.»",
    opts: ["Jesús fue sepultado en una fosa común", "Un hombre rico, José de Arimatea, lo puso en su sepulcro nuevo", "Su cuerpo nunca fue encontrado"], ans: 1,
    refs: ["Mateo 27:57-60"],
    expl: "Murió entre malhechores, pero lo sepultó un hombre rico en su propia tumba nueva (Mat. 27:57-60)." },
  { key: "p3", name: "Isaías 53:12", ref: "Contado", fact: "«…y fue contado con los pecadores, habiendo él llevado el pecado de muchos.»",
    opts: ["Fue crucificado entre dos malhechores, y Jesús mismo citó este versículo", "Fue coronado como rey en Jerusalén", "Fue encarcelado un año"], ans: 0,
    refs: ["Lucas 22:37"],
    expl: "Jesús mismo se aplicó el texto: «Y fue contado con los inicuos» (Luc. 22:37). Así el Nuevo Testamento interpreta el Antiguo." },
  { key: "p4", name: "Isaías 53:3", ref: "Rechazado", fact: "«Despreciado y desechado entre los hombres, varón de dolores, experimentado en quebranto.»",
    opts: ["Su propio pueblo no lo recibió", "Todos los líderes lo aceptaron enseguida", "Nadie supo nunca quién era"], ans: 0,
    refs: ["Juan 1:11"],
    expl: "«A lo suyo vino, y los suyos no le recibieron» (Juan 1:11). Felipe pudo mostrarle al etíope esta misma historia en la vida de Jesús." },
];

// ── Los tres lentes ──────────────────────────────────────────────────────────

const CASOS = [
  {
    id: "lit", badge: "Lente 1 · Literario", title: "«Ya no estoy bajo la ley»",
    ref: "Romanos 6:14",
    titular: "«Porque el pecado no se enseñoreará de vosotros; pues no estáis bajo la ley, sino bajo la gracia.»",
    q0: "Si solo tuvieras este versículo en una captura de pantalla, ¿qué entenderías?",
    opts0: [
      "Que los cristianos ya no necesitan obedecer los mandamientos de Dios",
      "Que ya no dependemos de la ley para ser salvos, pero seguimos queriendo vivir en obediencia",
      "No lo sé: necesito leer lo que viene antes y después",
    ],
    ctxTitle: "Ahora leé lo que lo rodea",
    ctxRefs: ["Romanos 6:1-2", "Romanos 6:12-15"],
    marks: { "Romanos 6:12-15": ["¿Pecaremos, porque no estamos bajo la ley sino bajo la gracia? En ninguna manera."] },
    ctxNote: "Fijate en cómo empieza el capítulo (v. 1-2) y en lo que Pablo pregunta justo después (v. 15). El autor se anticipa a la conclusión apresurada.",
    det: {
      q: "¿Qué hace Pablo en el versículo 15?",
      opts: ["Confirma que ya no existen mandamientos que cumplir", "Pregunta si podemos pecar porque estamos bajo la gracia, y responde: «¡En ninguna manera!»", "Cambia de tema y habla de otra cosa"],
      ans: 1,
      expl: "Pablo mismo descarta la lectura aislada. El versículo 14 dice que el pecado no nos dominará porque la gracia nos sostiene, no que podamos pecar tranquilos.",
    },
    principle: "Antes de sacar una conclusión, leé los versículos de antes y de después. El mismo autor suele aclarar lo que quiere decir.",
    extras: [
      { key: "lit-e1", badge: "Más pistas", name: "Pablo y la ley en el mismo libro", body: "Romanos 3:31: «¿Luego por la fe invalidamos la ley? En ninguna manera, sino que confirmamos la ley». Y Romanos 7:12: «la ley a la verdad es santa, y el mandamiento santo, justo y bueno». Pablo no puede estar diciendo que la ley sobra: su argumento es que la ley no salva, la gracia sí; y la gracia transforma al que obedece por amor.", refs: ["Romanos 3:31", "Romanos 7:12"] },
      { key: "lit-e2", badge: "El diablo también cita", name: "Satanás citó la Biblia… recortada", body: "En Mateo 4:6 el diablo cita Salmos 91:11-12 para tentar a Jesús: «A sus ángeles mandará por ti». Pero en el salmo, el versículo dice que los ángeles «te guarden en todos tus caminos». Satanás dejó afuera esa frase, que cambia el sentido: Dios protege a quien camina con él, no a quien se tira desde el templo para probarlo. Jesús respondió con otro pasaje: «Escrito está también…» (Mat. 4:7).", refs: ["Salmos 91:11-12", "Mateo 4:5-7"] },
    ],
    teach: {
      s0: "Pedí que un voluntario lea el titular en voz alta. Después, mano alzada por cada opción. No corrijas todavía: dejá que se note la división. La tercera opción es la actitud humilde que queremos formar.",
      s1: "Que otro alumno lea el contexto. Preguntá: «¿Quién había hecho la pregunta del versículo 15? ¿Pablo o un lector apurado?». Respuesta: Pablo se la hace a sí mismo porque sabía que alguien lo malinterpretaría (2 Ped. 3:16).",
      s2: "Conectá con el PDF: «muchas distorsiones se derivan de aislar pasajes de su contexto literario». Preguntá si alguna vez vieron un versículo así en redes y qué se perdía al leerlo solo.",
    },
  },
  {
    id: "bib", badge: "Lente 2 · Bíblico general", title: "Setenta semanas: ¿días o años?",
    ref: "Daniel 9:24",
    titular: "«Setenta semanas están determinadas sobre tu pueblo y sobre tu santa ciudad…»",
    q0: "Si leés «semanas» como siete días literales, ¿cuánto sería este período?",
    opts0: [
      "70 semanas literales: 490 días, poco más de un año",
      "Un período mucho más largo: las «semanas» son simbólicas",
      "No lo sé: voy a buscar pistas dentro y fuera del pasaje",
    ],
    ctxTitle: "Tres pistas para resolver el misterio",
    ctxRefs: ["Daniel 9:24-27"],
    marks: {},
    ctxNote: "Pista 1: dentro del mismo pasaje. Mirá lo que debe ocurrir dentro de esas semanas: salir una orden, reconstruir una ciudad entera «en tiempos angustiosos», que llegue el Mesías y que lo maten. ¿Cabe todo eso en poco más de un año?",
    det: {
      q: "¿Qué detalle del pasaje no cabe en 490 días?",
      opts: ["Reconstruir Jerusalén, la llegada del Mesías y su muerte", "La palabra «Mesías»", "El nombre del profeta Daniel"],
      ans: 0,
      expl: "El texto mismo empuja a leer algo más largo. Cuando una lectura literal choca con los datos del pasaje, la Biblia misma suele darnos la llave en otro lugar.",
    },
    principle: "Cuando un texto necesita una llave, buscá en la Biblia cómo se usa esa misma idea en otros pasajes. «Día por año» no es invento nuestro: está en la propia Escritura.",
    extras: [
      { key: "bib-e1", badge: "Pista 2", name: "La Biblia ya usó «un día = un año»", body: "Números 14:34: por cada uno de los cuarenta días que los espías recorrieron la tierra, Israel llevaría su castigo un año: cuarenta años. Ezequiel 4:6: «día por año, día por año te lo he dado». Son dos ejemplos donde Dios mismo establece esa equivalencia para el tiempo profético.", refs: ["Números 14:34", "Ezequiel 4:6"] },
      { key: "bib-e2", badge: "Pista 3", name: "Los símbolos de Daniel se explican con otros símbolos", body: "En la visión de Daniel 7, las bestias son reyes o reinos (Dan. 7:17): simbólicas. Si los animales son símbolos, los tiempos también lo son. Además, Daniel 7:25 habla de «tiempo, y tiempos, y medio tiempo», y Apocalipsis 12:6 y 12:14 describen el mismo período: en una versión lo cuenta como «mil doscientos sesenta días», y en la otra como «un tiempo, y tiempos, y la mitad de un tiempo». La Biblia misma está traduciendo su propio código.", refs: ["Daniel 7:17", "Daniel 7:25", "Apocalipsis 12:6", "Apocalipsis 12:14"] },
    ],
    teach: {
      s0: "No menciones todavía «día por año». Dejá que ellos propongan. Con 490 días es imposible reconstruir una ciudad y que llegue el Mesías: ese razonamiento es el punto.",
      s1: "Lectura a dos voces de Daniel 9:25-26. Pedí que cuenten cuántos hechos hay (orden, reconstrucción, Mesías, muerte). Subrayá la humildad: no es lo mismo «yo decido que es así» que «la Biblia misma lo dice en otro lado».",
      s2: "Dato para el maestro (interpretación adventista): la orden de Artajerjes para restaurar Jerusalén se dio en el 457 a. C. (Esd. 7); 483 años después, en el 27 d. C., Jesús fue bautizado como Mesías («Ungido») y la «semana» restante lleva al 31-34 d. C. Mismo principio en Daniel 8:14 (2300 tardes y mañanas). Dejá que la pregunta de los chicos marque la profundidad: lo central es el método, no memorizar fechas.",
    },
  },
  {
    id: "his", badge: "Lente 3 · Histórico y cultural", title: "«Si alguno no aborrece a su padre y madre…»",
    ref: "Lucas 14:26",
    titular: "«Si alguno viene a mí, y no aborrece a su padre, y madre, y mujer, e hijos, y hermanos, y aun a su propia vida, no puede ser mi discípulo.»",
    q0: "Según este versículo suelto, ¿qué te estaría pidiendo Jesús?",
    opts0: [
      "Que odie literalmente a mi familia para ser discípulo",
      "Que lo ponga a él en primer lugar, incluso sobre las relaciones más cercanas",
      "No lo sé: algo no cuadra con el resto de lo que Jesús enseña",
    ],
    ctxTitle: "Comparemos pasajes paralelos",
    ctxRefs: ["Mateo 10:37", "Deuteronomio 21:15"],
    marks: { "Mateo 10:37": ["más que a mí"], "Deuteronomio 21:15": ["la una amada y la otra aborrecida"] },
    ctxNote: "Pista cultural: en el mundo hebreo, «amar» y «aborrecer» se usaban muchas veces como contraste de preferencias, no como sentimientos de odio. Deuteronomio 21:15 habla de una esposa «aborrecida» que igualmente tiene derechos y es madre de sus hijos: es la menos amada, no la odiada.",
    det: {
      q: "Compará Lucas 14:26 con Mateo 10:37. ¿Qué frase de Mateo explica el sentido de «aborrecer»?",
      opts: ["«no es digno de mí»", "«ama… más que a mí»", "«padre o madre»"],
      ans: 1,
      expl: "Mateo lo dice sin el modismo: quien ama a su familia más que a Jesús no puede ser su discípulo. El texto no pide odio, pide prioridad.",
    },
    principle: "Un texto nace en una cultura y un idioma concretos. Conocer cómo hablaba esa gente, y comparar con pasajes paralelos, evita errores enormes.",
    extras: [
      { key: "his-e1", badge: "Armonía con toda la Biblia", name: "Jesús y su propia familia", body: "Desde la cruz, Jesús se ocupó de su madre y se la encomendó a Juan (Juan 19:26-27). En Marcos 7:10-13 condenó a quienes dejaban sin ayuda a sus padres con excusas religiosas. Es imposible que el mismo Jesús enseñe a odiar a la familia. Cuando una lectura choca con el resto de la Escritura, esa lectura está mal.", refs: ["Juan 19:26-27", "Marcos 7:10-13"] },
    ],
    teach: {
      s0: "Esta suele generar el mayor debate. Aprovechalo: los que eligieron «odiar» se darán cuenta de que algo no cuadra. Preguntá: «¿Cuántos conocen a alguien que usó este versículo contra la iglesia?».",
      s1: "Mostrá la comparación: Lucas 14:26 vs Mateo 10:37. Mismo Jesús, mismo mensaje, otro modismo. Preguntá: «¿Qué expresión nuestra sonaría extraña para alguien de otra cultura dentro de 2000 años?» (ej.: «me muero de hambre», «te mato si…»).",
      s2: "Cerrá con 1 Corintios 16:20: el «ósculo santo» es otro caso de la semana 3 donde cultura y principio se separan: la forma cambia, el principio (recibir con calidez) permanece.",
    },
  },
  {
    id: "par", badge: "Caso extra · Parábola", title: "El buen samaritano: ¿quién es el héroe?",
    ref: "Lucas 10:30-37",
    titular: "«…Aconteció que descendió un sacerdote por aquel camino, y viéndole, pasó de largo. Asimismo un levita… pasó de largo. Pero un samaritano… fue movido a misericordia.»",
    q0: "¿Por qué crees que Jesús eligió a un samaritano como protagonista?",
    opts0: [
      "Porque en su cultura los samaritanos eran muy queridos",
      "Para sorprender: era un grupo despreciado por los judíos, y el héroe era justamente él",
      "No lo sé: necesito conocer más de la época",
    ],
    ctxTitle: "¿Quiénes eran los samaritanos?",
    ctxRefs: ["Juan 4:9", "Juan 8:48"],
    marks: { "Juan 4:9": ["judíos y samaritanos no se tratan entre sí"], "Juan 8:48": ["tú eres samaritano, y que tienes demonio"] },
    ctxNote: "Los judíos y los samaritanos eran enemigos históricos y religiosos. Llamar «samaritano» a alguien era un insulto, como se ve en Juan 8:48. Un sacerdote y un levita eran, en cambio, los «religiosos modelo» del pueblo. Jesús invierte las expectativas.",
    det: {
      q: "Mirá la última respuesta del intérprete de la ley en Lucas 10:37: «El que usó de misericordia con él». ¿Qué detalle cultural se nota?",
      opts: ["Responde sin nombrar al samaritano: le cuesta decir la palabra", "Se enoja y se va", "Pide más tiempo para pensar"],
      ans: 0,
      expl: "El abogado evita la palabra «samaritano». Jesús lo obliga a reconocer que el prójimo puede ser justo la persona que uno desprecia. Sin el trasfondo cultural, el impacto de la parábola se diluye en «sé amable».",
    },
    principle: "El trasfondo histórico y cultural convierte una historia «bonita» en una enseñanza revolucionaria: la misericordia no tiene frontera étnica ni religiosa.",
    extras: [
      { key: "par-e1", badge: "Dato del camino", name: "El camino de Jerusalén a Jericó", body: "El trayecto era conocido por ser peligroso: descendía más de mil metros en unos veintisiete kilómetros por zonas desiertas, ideales para los asaltantes. Jesús no explica por qué el sacerdote y el levita pasaron de largo; lo importante es que alguien con motivos para no ayudar sí ayudó.", refs: [] },
    ],
    teach: {
      s0: "Si el tiempo es corto, dejá este caso como opcional. Conecta con la anécdota del PDF: «Ve y haz tú lo mismo» (Luc. 10:37) cierra esta parábola.",
      s1: "Pedí ejemplos modernos: ¿quién sería hoy el «samaritano» para ellos (de otra religión, de otro equipo, un compañero que cae mal)? Sin presionar a nadie.",
      s2: "Recordá que el contexto previo (Luc. 10:25-29) es el mismo pasaje del PDF: Jesús pregunta «¿cómo lees?» y el abogado quiere justificarse.",
    },
  },
];

// ¿Qué lente?
const LENTES_PRACTICA = [
  { key: "l1", name: "Salmos 14:1", ref: "Frase suelta", fact: "Alguien comparte una imagen que dice solo: «No hay Dios». Y pone el versículo.",
    opts: ["Contexto literario", "Contexto bíblico general", "Marco histórico y cultural"], ans: 0, refs: ["Salmos 14:1"],
    expl: "Basta leer la frase completa: «Dice el necio en su corazón: No hay Dios». El contexto literario cambia todo el sentido." },
  { key: "l2", name: "Isaías 65:20", ref: "Niño de cien años", fact: "«El niño morirá de cien años.» ¿Habrá muerte en la tierra nueva?",
    opts: ["Contexto literario", "Contexto bíblico general", "Marco histórico y cultural"], ans: 2, refs: ["Isaías 65:17-20", "Isaías 25:8"],
    expl: "Es lenguaje poético para el pueblo de Israel de entonces, ligado a las promesas del pacto (Deut. 28). Y otros textos de Isaías (25:8; 65:19) confirman que la muerte terminará. Se usan los dos lentes, pero el punto de partida es el histórico." },
  { key: "l3", name: "1 Corintios 16:20", ref: "Beso santo", fact: "«Saludaos los unos a los otros con ósculo santo.» ¿Hoy deberíamos besarnos al saludar en la iglesia?",
    opts: ["Contexto literario", "Contexto bíblico general", "Marco histórico y cultural"], ans: 2, refs: ["1 Corintios 16:20"],
    expl: "En la cultura griega, el beso era un saludo común. El principio que permanece es recibir con calidez y hacer sentir parte de la familia (Rom. 16:16; 2 Cor. 13:12; 1 Tes. 5:26)." },
  { key: "l4", name: "Daniel 7:25", ref: "Tiempo, tiempos…", fact: "«…hasta tiempo, y tiempos, y medio tiempo.» ¿Qué período es este?",
    opts: ["Contexto literario", "Contexto bíblico general", "Marco histórico y cultural"], ans: 1, refs: ["Daniel 7:25", "Apocalipsis 12:6"],
    expl: "Apocalipsis 12:6 y 12:14 describen el mismo período con otras palabras (1260 días). La Biblia explica la Biblia." },
  { key: "l5", name: "Mateo 27:5", ref: "El dedo al azar", fact: "«…y fue y se ahorcó.» ¿Es un consejo para mi problema?",
    opts: ["Contexto literario", "Contexto bíblico general", "Marco histórico y cultural"], ans: 0, refs: ["Mateo 27:5"],
    expl: "Es el final de Judas dentro del relato de la traición. Basta mirar quién habla, de quién y por qué para ver que no es un consejo." },
];

// Versículos de feed
const FEED = [
  { key: "f1", name: "Filipenses 4:13", ref: "«Todo lo puedo…»", fact: "Un post dice: «Todo lo puedo en Cristo que me fortalece» sobre una foto de un trofeo. ¿De qué hablaba Pablo en realidad?",
    opts: ["De conseguir cualquier meta que me proponga", "De poder vivir contento tanto con poco como con mucho, gracias a Cristo", "De ser siempre el mejor en todo"], ans: 1, refs: ["Filipenses 4:11-13"],
    expl: "Los versículos 11 y 12 lo aclaran: Pablo habla de contentamiento en la escasez y en la abundancia. No es un lema para ganar torneos; es fortaleza para resistir y servir en cualquier situación." },
  { key: "f2", name: "Jeremías 29:11", ref: "«Pensamientos de paz»", fact: "Se comparte como promesa personal: «Yo sé los pensamientos que tengo acerca de vosotros…». ¿A quién se lo dijo Dios originalmente?",
    opts: ["A un joven que estaba por rendir un examen", "A los exiliados judíos en Babilonia, con la promesa de volver tras setenta años (Jer. 29:10)", "A los apóstoles en el aposento alto"], ans: 1, refs: ["Jeremías 29:10", "Jeremías 29:11"],
    expl: "Es una promesa dirigida a un pueblo en el exilio, que también muestra el carácter de Dios: sus planes para nosotros son de paz y esperanza. Podemos aplicar el principio, no copiar la promesa literal." },
  { key: "f3", name: "Mateo 18:20", ref: "«Dos o tres…»", fact: "Se usa como «aunque haya poca gente, Dios está». ¿Qué situación describe el contexto?",
    opts: ["Una reunión de oración con poca asistencia", "El proceso para restaurar a un hermano que pecó (Mat. 18:15-17)", "Una boda"], ans: 1, refs: ["Mateo 18:15-20"],
    expl: "El contexto es la reconciliación de un hermano. Aun así, la presencia de Cristo con los suyos es verdadera: el principio se sostiene, pero conviene entender dónde nace." },
];

// ── Paralelos ───────────────────────────────────────────────────────────────

const DAN2 = [
  { key: "d1", name: "Daniel 2:32", ref: "Cabeza de oro", fact: "El sueño del rey: «La cabeza de esta imagen era de oro fino».",
    opts: ["Un reino futuro", "El propio rey Nabucodonosor y su reino", "El Mesías"], ans: 1, refs: ["Daniel 2:36-45"],
    expl: "La interpretación está en el mismo capítulo: «tú eres aquella cabeza de oro» (Dan. 2:38)." },
  { key: "d2", name: "Daniel 2:33", ref: "Pies de hierro y barro", fact: "«Sus pies, en parte de hierro y en parte de barro cocido.»",
    opts: ["Un reino dividido: parte fuerte, parte frágil", "Una ciudad que se cae", "Dos reyes enemigos"], ans: 0, refs: [],
    expl: "«Será un reino dividido… en parte fuerte, y en parte frágil» (Dan. 2:41-42)." },
  { key: "d3", name: "Daniel 2:34", ref: "La piedra", fact: "«Una piedra fue cortada, no con mano, e hirió a la imagen.»",
    opts: ["Un reino de Dios que nunca será destruido", "Un terremoto en Babilonia", "Una nueva imagen de oro"], ans: 0, refs: [],
    expl: "«El Dios del cielo levantará un reino que no será jamás destruido» (Dan. 2:44). La Biblia explica su propio símbolo." },
];

const SEMBRADOR = [
  { key: "s1", name: "Mateo 13:4", ref: "Junto al camino", fact: "«Parte de la semilla cayó junto al camino; y vinieron las aves y la comieron.»",
    opts: ["El que oye la palabra y no la entiende; viene el malo y se la arrebata", "El que la recibe con gozo pero se seca", "El que es ahogado por riquezas"], ans: 0, refs: ["Mateo 13:18-23"], expl: "Mateo 13:19." },
  { key: "s2", name: "Mateo 13:5-6", ref: "Pedregales", fact: "«Brotó pronto… pero salido el sol, se quemó; y porque no tenía raíz, se secó.»",
    opts: ["El que oye la palabra con gozo, pero no tiene raíz y tropieza ante la aflicción", "El que no la entiende", "El que da fruto abundante"], ans: 0, refs: [], expl: "Mateo 13:20-21." },
  { key: "s3", name: "Mateo 13:7", ref: "Espinos", fact: "«Parte cayó entre espinos; y los espinos crecieron, y la ahogaron.»",
    opts: ["El afán de este siglo y el engaño de las riquezas que ahogan la palabra", "La persecución", "La falta de agua"], ans: 0, refs: [], expl: "Mateo 13:22." },
  { key: "s4", name: "Mateo 13:8", ref: "Buena tierra", fact: "«Parte cayó en buena tierra, y dio fruto.»",
    opts: ["El que oye y entiende la palabra, y da fruto", "El que nunca duda", "El que lo sabe todo"], ans: 0, refs: [], expl: "Mateo 13:23. Nota la palabra «entiende»: el tema de toda la semana." },
];

const PARALELOS_EXTRA = [
  { key: "pe1", badge: "Mismo libro", name: "El sueño y su interpretación en Daniel 2", body: "Daniel 2:31-35 describe el sueño del rey Nabucodonosor y Daniel 2:36-45 trae su interpretación. Mateo 13:3-9 narra la parábola del sembrador y Mateo 13:18-23 la explica. A veces la clave está a pocos versículos de distancia." },
  { key: "pe2", badge: "Profeta posterior", name: "Jeremías → 2 Crónicas", body: "Jeremías 25:11-12 y 29:10 anuncian setenta años de servicio a Babilonia. 2 Crónicas 36:20-23 registra el cumplimiento. Un autor posterior confirma y explica a uno anterior." },
  { key: "pe3", badge: "Nuevo Testamento", name: "El Sermón del Monte y Jeremías 31", body: "Una lectura rápida de Mateo 5:17-48 puede parecer que Jesús reemplaza las leyes del Antiguo Testamento. Una lectura cuidadosa muestra que revela su dimensión espiritual, cumpliendo la promesa de Jeremías 31:31-34 (ver Heb. 8:8-10; 10:16): la ley en la mente y escrita en el corazón." },
  { key: "pe4", badge: "Profetas que no entendían todo", name: "1 Pedro 1:10-12", body: "Algunos profetas escribieron cosas que ellos mismos no comprendieron del todo; los profetas posteriores, y el Nuevo Testamento, las iluminaron. Detrás de todos está el mismo Espíritu, por eso la Biblia es un todo coherente y no una colección de mensajes sueltos." },
];

// ── Elena G. de White ───────────────────────────────────────────────────────

const PAUTAS = [
  { key: "g1", badge: "1", name: "Con actitud positiva y de oración", body: "Empezá con una mente abierta, no con espíritu de duda. Nuestra disposición mental es una lente que tiñe todo lo que oímos, leemos y vemos. Necesitamos que el Espíritu Santo guíe nuestro pensamiento." },
  { key: "g2", badge: "2", name: "Tené en cuenta el contexto", body: "Algunas personas basan su comprensión en una declaración o un párrafo aislado, fuera de su contexto histórico y literario. Ella misma escribió que «deben tomarse en cuenta el tiempo y el lugar» (Mensajes selectos, t. 1, p. 67). Ignorar el contexto ha causado un sinfín de problemas." },
  { key: "g3", badge: "3", name: "Centrate en los principios", body: "¿Cuál es el punto principal que enfatiza el pasaje? En 1894 escribió a la iglesia de Battle Creek condenando la compra de bicicletas (Testimonios para la iglesia, t. 8, pp. 58-60). El principio era la buena administración de los recursos dados por Dios, como el dinero, ya que las bicicletas eran muy costosas en aquella época." },
  { key: "g4", badge: "4", name: "Estudiá todo lo que escribió sobre el tema", body: "Examiná las declaraciones menos claras a la luz de su enseñanza general. Ella lamentó el mal uso que algunos hacían de sus escritos: «Mucho que se da a entender como un mensaje de la Hna. White tiene el propósito de representar mal a la Hna. White» (Mensajes selectos, t. 1, p. 52)." },
  { key: "g5", badge: "5", name: "Asegurate de que realmente lo dijo", body: "Muchas declaraciones se le atribuyen falsamente. La mejor forma de saberlo es verificar la fuente: en qué libro, página o carta aparece. Una vez comprobado, se puede examinar con los principios correctos." },
];

const EGW_PRACTICA = [
  { key: "e1", name: "Las bicicletas", ref: "Mensaje de 1894", fact: "Alguien dice en el grupo: «Elena G. de White prohibió las bicicletas, así que andar en bici es pecado». ¿Qué hacés antes de aceptarlo?",
    opts: ["Lo acepto: si ella lo escribió, vale para todos y siempre", "Busco el contexto: cuándo, a quién y por qué lo escribió", "Lo descarto: sus escritos no importan"], ans: 1, refs: [],
    expl: "Escribió en 1894 a los miembros de Battle Creek sobre la compra de bicicletas, que eran muy caras. El principio: administrar bien los recursos que Dios nos da (pautas 2 y 3)." },
  { key: "e2", name: "WhatsApp", ref: "Cita viral", fact: "Te llega una cita muy fuerte «de Elena G. de White» por un grupo. ¿Primer paso?",
    opts: ["Reenviarla enseguida", "Verificar la fuente: ¿qué libro y página?", "Cambiarle las palabras para que suene mejor"], ans: 1, refs: [],
    expl: "Pauta 5: muchas citas se le atribuyen falsamente. Si no hay fuente verificable, no se difunde." },
  { key: "e3", name: "Frase difícil", ref: "Declaración dura", fact: "Encontrás una frase que parece dura y poco clara sobre un tema. ¿Qué hacés?",
    opts: ["La uso como regla absoluta", "Leo todo lo que escribió sobre ese tema para entenderla mejor", "La ignoro y no pregunto nada"], ans: 1, refs: [],
    expl: "Pauta 4: lo menos claro se interpreta a la luz de su enseñanza general sobre el mismo tema." },
  { key: "e4", name: "Actitud", ref: "Antes de abrir el libro", fact: "¿Con qué actitud conviene empezar a leer sus escritos?",
    opts: ["Con espíritu de duda, para encontrar errores", "Con oración, mente abierta y deseo de aprender", "Con indiferencia, como cualquier libro"], ans: 1, refs: [],
    expl: "Pauta 1: nuestra disposición mental es una lente que colorea lo que leemos." },
];

// ── Quiz ────────────────────────────────────────────────────────────────────

const QUIZ_DATA = [
  { q: "En el camino a Emaús, ¿qué esperaban los dos discípulos del Mesías?",
    opts: ["Que los librara del dominio romano", "Que fundara una escuela de profetas", "Que se casara con una princesa", "Que reconstruyera el templo en tres días"],
    ans: 0, feedback: "«Nosotros esperábamos que él era el que había de redimir a Israel» (Luc. 24:21). Era una interpretación sesgada y parcial de las profecías; Jesús les abrió las Escrituras (Luc. 24:25-27)." },
  { q: "En Hechos 8, ¿por qué el etíope no entendía Isaías 53 aunque lo estaba leyendo?",
    opts: ["Estaba escrito en un idioma extranjero", "Necesitaba que alguien le explicara el significado", "El rollo estaba incompleto", "Isaías no hablaba de nadie en particular"],
    ans: 1, feedback: "«¿Y cómo podré, si alguno no me enseñare?» (Hech. 8:31). Leer no siempre basta: hace falta contexto y alguien que enseñe." },
  { q: "En el experimento del dedo, ¿qué pasó con Mateo 27:5, Lucas 10:37 y Juan 13:27?",
    opts: ["Eran falsos y no estaban en la Biblia", "Eran versículos auténticos que, sacados de su contexto, daban mensajes erróneos", "Eran ironías de Jesús", "Eran promesas para cada persona"],
    ans: 1, feedback: "Los tres son auténticos, pero aislados no sirven como guía. Muchas distorsiones nacen de aislar pasajes de su contexto literario." },
  { q: "¿Qué hace Pablo en Romanos 6:15 después de decir que no estamos bajo la ley sino bajo la gracia?",
    opts: ["Anula los mandamientos", "Pregunta si podemos pecar porque estamos bajo la gracia y responde «¡En ninguna manera!»", "Habla de otro tema", "Pide que no se hable de la ley"],
    ans: 1, feedback: "El contexto inmediato corrige la lectura aislada. Pablo se adelanta a la conclusión apresurada." },
  { q: "En Mateo 4:5-7, ¿cómo usó el diablo las Escrituras?",
    opts: ["Las citó parcialmente para llevar a Jesús a presumir de la protección de Dios", "Las rechazó por completo", "Las explicó correctamente", "Citó un texto del Nuevo Testamento"],
    ans: 0, feedback: "Citó Salmos 91 sin la frase «en todos tus caminos». Jesús respondió con otro pasaje: «Escrito está también…» (Mat. 4:7)." },
  { q: "¿Qué dos textos bíblicos establecen que un día puede representar un año en la profecía?",
    opts: ["Génesis 1:5 y Éxodo 20:8", "Números 14:34 y Ezequiel 4:6", "Mateo 5:17 y Lucas 14:26", "Salmos 14:1 y Romanos 6:14"],
    ans: 1, feedback: "Números 14:34: «un año por cada día»; Ezequiel 4:6: «día por año, día por año te lo he dado». La Biblia misma ofrece la llave." },
  { q: "En Lucas 14:26, ¿qué significa «aborrecer» según el paralelo de Mateo 10:37?",
    opts: ["Odiar a la familia", "Amar menos que a Jesús: ponerlo en primer lugar", "Abandonar el hogar", "Ignorar a los padres"],
    ans: 1, feedback: "Mateo dice «ama… más que a mí». Es un modismo del mundo hebreo, no un mandato de odio." },
  { q: "Según el mensaje de Elena G. de White sobre las bicicletas (1894), ¿cuál era el principio?",
    opts: ["Que andar en bicicleta es un pecado", "La buena administración de los recursos que Dios nos da, como el dinero", "Que no se debía hacer ejercicio", "Que la tecnología es mala"],
    ans: 1, feedback: "Las bicicletas eran muy costosas; el principio era la mayordomía. Por eso hay que buscar el contexto y centrarse en los principios." },
];

// ── Cierre ──────────────────────────────────────────────────────────────────

const DISCUSS_ENTENDER = [
  { t: "¿Por qué el visitante de Etiopía necesitaba a alguien que le ayudara a comprender el significado de la profecía de Isaías?", r: "Hech. 8:26-35" },
  { t: "¿Qué resultado tuvo ese estudio bíblico?", r: "Hech. 8:36-40" },
  { t: "¿Cómo ayudó Jesús a sus discípulos a comprender el significado de las Escrituras?", r: "Luc. 24:25-27, 44-45" },
];
const DISCUSS_IMPORTANCIA = [
  { t: "¿Cómo reconoció Jesús la necesidad de interpretar correctamente el significado de las Escrituras?", r: "Luc. 10:26" },
  { t: "En el gran panorama del gran conflicto, ¿cómo intenta Satanás constantemente llevar a las personas a malinterpretar las Escrituras?", r: "Mat. 4:5-7" },
  { t: "¿Cuáles son los peligros de la interpretación privada y de tergiversar el significado de las Escrituras?", r: "2 Ped. 1:20; 3:16" },
  { t: "¿Por qué debemos orar para que Dios nos dé un buen entendimiento de la verdad?", r: "Sal. 119:125; Dan. 9:13, 23" },
];
const DISCUSS_PRINCIPIOS = [
  { t: "¿Por qué es importante examinar primero el contexto inmediato para comprender la interpretación correcta de un pasaje?", r: "Dan. 2:31-45" },
  { t: "¿Cómo ayudan algunos libros de la Biblia a interpretar otros libros de la Biblia?", r: "2 Crón. 36:20-23" },
];
const PUNTOS_CLAVE = [
  "Dios necesita que expliquemos la Biblia a las personas que nunca podrían entenderla sin ayuda.",
  "Satanás intenta que las personas malinterpreten las Escrituras para poder desviarlas del camino.",
  "La Biblia es un todo unificado y se interpreta a sí misma.",
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function numberize(text) {
  return text.split(/(\b\d+\s)/).map((part, i) => {
    if (/^\d+\s$/.test(part)) {
      return <span key={i} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: ".55rem", color: "var(--acc2)", verticalAlign: "super", opacity: .8, marginRight: "2px" }}>{part.trim()}</span>;
    }
    return part ? <span key={i}>{part}</span> : null;
  });
}

function renderVerse(text, marks) {
  if (!marks || !marks.length) return numberize(text);
  const parts = text.split(new RegExp("(" + marks.map(esc).join("|") + ")"));
  return parts.map((p, i) => marks.includes(p) ? <mark key={i} className="hl">{p}</mark> : <span key={i}>{numberize(p)}</span>);
}

function Pass({ k, marks }) {
  const text = VMAP[k];
  if (!text) return null;
  return (
    <div className="pass">
      <span className="pass-ref">{k} · RVR1960</span>
      {renderVerse(text, marks)}
    </div>
  );
}

function Teach({ title, children }) {
  return (
    <div className="teach">
      <div className="teach-label"><Users size={12} /> Maestro · {title}</div>
      {children}
    </div>
  );
}

function ExpandList({ items, openExpand, toggleExpand }) {
  return items.map(item => (
    <div key={item.key} className={`expand-item${openExpand[item.key] ? " open" : ""}`} onClick={() => toggleExpand(item.key)}>
      <div className="expand-header">
        <span className="expand-badge">{item.badge}</span>
        <span className="expand-name">{item.name}</span>
        {openExpand[item.key] ? <ChevronUp size={16} color="var(--acc2)" /> : <ChevronDown size={16} color="var(--tx3)" />}
      </div>
      {openExpand[item.key] && (
        <div className="expand-body" onClick={e => e.stopPropagation()}>
          <p style={{ marginTop: ".6rem" }}>{item.body}</p>
          {(item.refs || []).map(r => <Pass key={r} k={r} />)}
        </div>
      )}
    </div>
  ));
}

function Dinamica({ items, doneLabel, ask }) {
  const [sel, setSel] = useState({});
  const [checked, setChecked] = useState(false);
  const answered = Object.keys(sel).length;
  const correct = items.filter(s => sel[s.key] === s.ans).length;
  return (
    <>
      {items.map(s => (
        <div key={s.key} className="sym-card">
          <div className="sym-head">
            <span className="sym-name">{s.name}</span>
            <span className="sym-ref">{s.ref}</span>
          </div>
          <div className="sym-fact">{s.fact}</div>
          {ask && <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: ".58rem", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--acc2)", margin: ".2rem 0 .5rem" }}>{ask}</div>}
          {s.opts.map((o, i) => {
            let cls = "sym-opt";
            if (checked) {
              if (i === s.ans) cls += " ok";
              else if (sel[s.key] === i) cls += " bad";
            } else if (sel[s.key] === i) cls += " sel";
            return (
              <button key={i} className={cls} disabled={checked} onClick={() => setSel(p => ({ ...p, [s.key]: i }))}>{o}</button>
            );
          })}
          {checked && (
            <div className="sym-expl">
              {s.expl}
              {(s.refs || []).map(r => <Pass key={r} k={r} />)}
            </div>
          )}
        </div>
      ))}
      {checked ? (
        <>
          <div className="check-result">{correct} de {items.length} {doneLabel}</div>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button className="quiz-retry" onClick={() => { setSel({}); setChecked(false); }}><RotateCcw size={15} /> Intentar de nuevo</button>
          </div>
        </>
      ) : (
        <button className="check-btn" disabled={answered < items.length} onClick={() => setChecked(true)}>
          {answered < items.length ? `Respondé los ${items.length} (${answered}/${items.length})` : "Verificar"}
        </button>
      )}
    </>
  );
}

// ── EXPERIMENTO DEL DEDO ─────────────────────────────────────────────────────

function Azar() {
  const [seen, setSeen] = useState([]);
  const [cur, setCur] = useState(null);
  const [ctx, setCtx] = useState(false);
  const all = seen.length >= AZAR.length;

  const pull = () => {
    const left = AZAR.map((_, i) => i).filter(i => !seen.includes(i));
    const pick = left[Math.floor(Math.random() * left.length)];
    setSeen(s => [...s, pick]);
    setCur(pick);
    setCtx(false);
  };
  const reset = () => { setSeen([]); setCur(null); setCtx(false); };

  return (
    <div className="pull">
      <div className="card-label" style={{ textAlign: "center" }}>El experimento del dedo</div>
      <p style={{ fontSize: ".97rem", lineHeight: 1.55, color: "var(--tx2)" }}>
        Tenés un problema grande y querés saber qué quiere Dios que hagas. Cerrás los ojos, abrís la Biblia y apuntás con el dedo…
      </p>
      {cur !== null && (
        <div key={cur + "-" + seen.length}>
          <div className="pull-verse">«{AZAR[cur].frag}»</div>
          <div className="pull-ref">{AZAR[cur].ref}</div>
          <div style={{ marginTop: ".7rem" }}>
            <button className="btn-ghost" onClick={() => setCtx(c => !c)}>
              <Eye size={15} /> {ctx ? "Ocultar contexto" : "Ver contexto real"}
            </button>
          </div>
          {ctx && <div className="note" style={{ textAlign: "left" }}>{AZAR[cur].ctx}</div>}
        </div>
      )}
      {!all ? (
        <button className="btn-main" onClick={pull}><Dices size={18} /> {seen.length === 0 ? "Señalar un versículo" : "Intentar otra vez"}</button>
      ) : (
        <>
          <div className="note" style={{ textAlign: "left", marginTop: ".9rem" }}>
            <strong>Los tres son versículos auténticos.</strong> Y ninguno era para tu problema. El error no está en la Biblia: está en <strong>cómo la leemos</strong>. Hoy vamos a aprender a leerla bien.
          </div>
          <button className="btn-ghost" onClick={reset} style={{ marginTop: ".5rem" }}><RotateCcw size={15} /> Repetir</button>
        </>
      )}
    </div>
  );
}

// ── INICIO ───────────────────────────────────────────────────────────────────

function TabInicio({ teacherMode }) {
  return (
    <>
      <div className="sec-title">Interpretar <em style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "var(--acc3)" }}>la Palabra</em></div>
      <div className="sec-sub">Octava Semana · Hechos 8:26-40 · El don de profecía</div>

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
          <Teach title="Cómo usar esta clase">
            <ul>
              <li>Cada pestaña tiene <strong>momentos de participación</strong>: alguien lee en voz alta, todos eligen su postura, luego se revela el contexto.</li>
              <li>Las respuestas de «opinión» no se corrigen en el momento: primero se escucha, después se descubre.</li>
              <li>Si el tiempo es corto: saltar el caso extra (buen samaritano) y la pestaña «Elena».</li>
            </ul>
          </Teach>
        </>
      ) : (
        <>
          <Azar />

          <div className="honey-card">
            <div className="honey-label"><Star size={13} /> Texto base · Hechos 8:26-40</div>
            <div className="honey-text">«¿Entiendes lo que lees? Él dijo: ¿Y cómo podré, si alguno no me enseñare?»</div>
            <div className="honey-ref">Hechos 8:30-31 · RVR1960</div>
          </div>

          <div className="card">
            <div className="card-label">Un mensaje que se puede malinterpretar</div>
            <p>Los escritos proféticos nunca vienen con la garantía de que todos los interpretarán bien. Los dos discípulos camino a Emaús esperaban un Mesías que los librara de Roma (Luc. 24:21): una interpretación sesgada y parcial. Jesús les explicó las Escrituras desde una perspectiva más amplia, y sus corazones ardieron (Luc. 24:25-32). Interpretar bien guía por el camino correcto; interpretar mal puede llevar al desastre espiritual.</p>
          </div>

          <div className="card">
            <div className="card-label">Cinco preguntas antes de concluir</div>
            {TOOLKIT.map((t, i) => (
              <div key={i} className="toolkit">
                <div className="toolkit-n">{i + 1}</div>
                <div>
                  <div className="toolkit-t">{t.t}</div>
                  <div className="toolkit-d">{t.d}</div>
                </div>
              </div>
            ))}
            <div className="note" style={{ marginBottom: 0 }}>Y siempre con <strong>minuciosidad y humildad</strong>: «ahora vemos por espejo, oscuramente» (1 Cor. 13:12). Ninguno de nosotros posee toda la verdad.</div>
          </div>

          <div className="card">
            <div className="card-label">Puntos clave para recordar</div>
            <ul className="key-list">
              {PUNTOS_CLAVE.map((p, i) => (
                <li key={i}><span className="key-dot" /><span className="key-text">{p}</span></li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

// ── CAMINO (Hechos 8) ────────────────────────────────────────────────────────

function Resaltar({ text, active }) {
  const useCats = CATS.filter(c => active[c.id]);
  if (!useCats.length) return text;
  const rx = new RegExp("(" + useCats.map(c => c.re).join("|") + ")", "gi");
  return text.split(rx).map((p, i) => {
    if (!p) return null;
    const idx = useCats.findIndex(c => new RegExp("^(?:" + c.re + ")$", "i").test(p));
    return idx >= 0 ? <mark key={i} className={`hl hl-${CATS.findIndex(c => c.id === useCats[idx].id)}`}>{p}</mark> : <span key={i}>{p}</span>;
  });
}

function TabCamino({ teacherMode, openExpand, toggleExpand }) {
  const [active, setActive] = useState({});
  const [pick, setPick] = useState(null);
  const fullText = DIALOGO.map(d => d.text).join(" ");
  const count = c => (fullText.match(new RegExp(c.re, "gi")) || []).length;

  return (
    <>
      <div className="sec-title">Camino</div>
      <div className="sec-sub">Hechos 8:26-40 · Felipe y el etíope</div>

      {teacherMode && (
        <Teach title="Lectura a cuatro voces">
          <ul>
            <li>Pedí <strong>cuatro voluntarios</strong>: narrador, ángel/Espíritu, Felipe y etíope. El resto sigue la lectura y busca palabras que se repiten.</li>
            <li>El texto griego de Hechos cita Isaías 53 según la traducción griega (Septuaginta); por eso la redacción de Hechos 8:32-33 difiere un poco de Isaías 53:7-8 en la RVR1960. El sentido es el mismo.</li>
            <li>Dato histórico: Candace era el título de las reinas de Etiopía (Cus). Un eunuco era un funcionario de confianza. Isaías 56:3-5 promete lugar y nombre perpetuo a los eunucos que siguen a Jehová: un contexto que ilumina por qué este hombre «adoraba» y buscaba respuestas.</li>
          </ul>
        </Teach>
      )}

      <div className="step-tag"><span className="dot">1</span> Elegí tu voz</div>
      <div className="read-cue"><Mic size={16} /> Repartan los roles. Cada uno lee solo sus líneas.</div>
      <div className="roles">
        {Object.entries(WHO).map(([k, v]) => <span key={k} className={`dlg-who ${k}`}>{v}</span>)}
      </div>

      <div className="step-tag"><span className="dot">2</span> Leé en voz alta y buscá palabras repetidas</div>
      <div className="chip-row">
        {CATS.map((c, i) => (
          <button key={c.id} className={`chip c${i}${active[c.id] ? " on" : ""}`} onClick={() => setActive(a => ({ ...a, [c.id]: !a[c.id] }))}>
            {c.label} <span className="cnt">{count(c)}</span>
          </button>
        ))}
      </div>
      <div className="card" style={{ padding: ".9rem .8rem" }}>
        {DIALOGO.map((d, i) => (
          <div key={i} className="dlg">
            <span className={`dlg-who ${d.who}`}>{WHO[d.who]}</span>
            <span className={`dlg-text ${d.who}`}>
              {d.v && <span className="dlg-v">{d.v}</span>}
              <Resaltar text={d.text} active={active} />
            </span>
          </div>
        ))}
      </div>
      <div className="note">
        <strong>Preguntale al grupo:</strong> ¿qué palabras se repiten más? ¿Qué te dicen? Fijate que Felipe no empieza con un sermón: empieza con una pregunta («¿Entiendes lo que lees?») y después <strong>escucha</strong> la pregunta del etíope.
      </div>

      <div className="step-tag" style={{ marginTop: "1.2rem" }}><span className="dot">3</span> La pregunta clave</div>
      <div className="titular">
        <div className="titular-q">«¿De quién dice el profeta esto; de sí mismo, o de algún otro?»</div>
        <div className="titular-ref">Hechos 8:34</div>
      </div>
      <div className="ask">Si fueras Felipe, ¿cómo responderías?</div>
      {[
        "Le diría que Isaías habla de sí mismo, porque fue perseguido",
        "Le mostraría que se refiere a Jesús, con textos del propio Isaías y de otros pasajes",
        "Le diría que es un misterio y que no se puede saber",
      ].map((o, i) => (
        <button key={i} className={`opinion${pick === i ? " sel" : ""}${pick !== null && i === 1 ? " ok" : ""}`} onClick={() => setPick(i)} disabled={pick !== null}>{o}</button>
      ))}
      {pick !== null && (
        <div className="note">
          <strong>Eso hizo Felipe:</strong> «comenzando desde esta escritura, le anunció el evangelio de Jesús» (Hech. 8:35). No inventó nada: conectó el texto con la historia de Jesús y con «otras porciones de las Escrituras». Ahora hacé lo mismo: armá el puente.
        </div>
      )}

      <div className="step-tag" style={{ marginTop: "1.2rem" }}><span className="dot">4</span> Armá el puente: Isaías 53 → Jesús</div>
      <div className="read-cue"><BookOpen size={16} /> Leé cada frase de Isaías y elegí cómo se cumplió en Jesús.</div>
      <Dinamica items={PUENTE} doneLabel="puentes bien armados" />

      <div className="divider" />
      <div className="sec-title" style={{ fontSize: "1.25rem", marginBottom: ".6rem" }}>Tres lecciones de Felipe</div>
      <ExpandList
        openExpand={openExpand}
        toggleExpand={toggleExpand}
        items={[
          { key: "cam1", badge: "1", name: "Leer no siempre alcanza", body: "La simple lectura de un pasaje no siempre conduce a una comprensión profunda. Hace falta conocer el contexto y tener suficiente conocimiento para discernir el significado." },
          { key: "cam2", badge: "2", name: "Aprendemos unos de otros", body: "La Biblia no está pensada para ser estudiada de forma aislada. Dios podría usar ángeles, pero envía a personas para ayudar a otras personas a comprender su Palabra." },
          { key: "cam3", badge: "3", name: "Tenemos la misión de compartir", body: "El estudio bíblico tiene dos objetivos: el crecimiento espiritual personal y guiar a otros hacia una relación salvadora con Jesús. La exposición de Felipe llevó al etíope a pedir el bautismo (Hech. 8:35-39; comparar con Sal. 51:12)." },
        ]}
      />
    </>
  );
}

// ── LENTES ───────────────────────────────────────────────────────────────────

function Caso({ c, teacherMode, openExpand, toggleExpand }) {
  const [stage, setStage] = useState(0);
  const [p0, setP0] = useState(null);
  const [pd, setPd] = useState(null);
  const answered = pd !== null;

  const reset = () => { setStage(0); setP0(null); setPd(null); };

  return (
    <>
      <div className="lens-head">
        <span className="lens-badge">{c.badge}</span>
      </div>
      <div className="sec-title" style={{ fontSize: "1.3rem", marginBottom: ".8rem" }}>{c.title}</div>

      {teacherMode && <Teach title="Paso 1"><p>{c.teach.s0}</p></Teach>}

      <div className="step-tag"><span className="dot">1</span> El titular</div>
      <div className="read-cue"><Mic size={16} /> Que un voluntario lo lea en voz alta.</div>
      <div className="titular">
        <div className="titular-q">{c.titular}</div>
        <div className="titular-ref">{c.ref} · RVR1960</div>
      </div>
      <div className="ask">{c.q0}</div>
      {c.opts0.map((o, i) => (
        <button key={i} className={`opinion${p0 === i ? " sel" : ""}`} disabled={stage >= 1} onClick={() => setP0(i)}>{o}</button>
      ))}
      {stage === 0 && (
        <button className="btn-main" disabled={p0 === null} onClick={() => setStage(1)}>
          <Search size={18} /> Ahora leamos el contexto
        </button>
      )}

      {stage >= 1 && (
        <>
          <div className="divider" />
          {teacherMode && <Teach title="Paso 2"><p>{c.teach.s1}</p></Teach>}
          <div className="step-tag"><span className="dot">2</span> {c.ctxTitle}</div>
          <div className="read-cue"><Mic size={16} /> Otro voluntario lee el contexto.</div>
          {c.ctxRefs.map(r => <Pass key={r} k={r} marks={(c.marks || {})[r]} />)}
          <div className="note">{c.ctxNote}</div>
          <div className="ask">{c.det.q}</div>
          {c.det.opts.map((o, i) => {
            let cls = "opinion";
            if (answered) {
              if (i === c.det.ans) cls += " ok";
              else if (i === pd) cls += " bad";
            }
            return <button key={i} className={cls} disabled={answered} onClick={() => setPd(i)}>{o}</button>;
          })}
          {answered && <div className="note"><strong>{pd === c.det.ans ? "¡Eso es! " : "Casi. "}</strong>{c.det.expl}</div>}
          {answered && stage === 1 && (
            <button className="btn-main" onClick={() => setStage(2)}><Lightbulb size={18} /> Ver el principio</button>
          )}
        </>
      )}

      {stage >= 2 && (
        <>
          <div className="divider" />
          {teacherMode && <Teach title="Paso 3"><p>{c.teach.s2}</p></Teach>}
          <div className="principle">
            <div className="principle-label"><Lightbulb size={13} /> Principio</div>
            <div className="principle-text">{c.principle}</div>
          </div>
          <ExpandList items={c.extras} openExpand={openExpand} toggleExpand={toggleExpand} />
          <div style={{ textAlign: "center", marginTop: ".6rem" }}>
            <button className="btn-ghost" onClick={reset}><RotateCcw size={15} /> Repetir este caso</button>
          </div>
        </>
      )}
    </>
  );
}

const LENTE_VIEWS = [
  { id: "lit", label: "1 · Literario" },
  { id: "bib", label: "2 · Bíblico" },
  { id: "his", label: "3 · Cultural" },
  { id: "par", label: "Extra · Parábola" },
  { id: "prac", label: "¿Qué lente?" },
  { id: "feed", label: "Versículos de feed" },
];

function TabLentes({ teacherMode, openExpand, toggleExpand }) {
  const [view, setView] = useState("lit");
  const caso = CASOS.find(c => c.id === view);

  return (
    <>
      <div className="sec-title">Lentes</div>
      <div className="sec-sub">Tres maneras de leer mejor un pasaje difícil</div>

      {teacherMode && (
        <Teach title="Cómo conducir esta pestaña">
          <ul>
            <li>Un caso a la vez (≈3 min). Siempre en este orden: <strong>titular → opinión → contexto → detective → principio</strong>.</li>
            <li>Mano alzada por cada opción en el paso 1. Nadie queda mal: la idea es que se vea cómo cambia la lectura al ampliar el lente.</li>
            <li>«¿Qué lente?» y «Versículos de feed» sirven como práctica final o tarea.</li>
          </ul>
        </Teach>
      )}

      <div className="chip-row">
        {LENTE_VIEWS.map(v => (
          <button key={v.id} className={`chip c0${view === v.id ? " on" : ""}`} onClick={() => setView(v.id)}>{v.label}</button>
        ))}
      </div>

      {caso && <Caso key={caso.id} c={caso} teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}

      {view === "prac" && (
        <>
          <div className="note">Para cada versículo, elegí <strong>el lente que más ayuda a empezar</strong>. A veces se combinan: no hay un único camino.</div>
          <Dinamica items={LENTES_PRACTICA} doneLabel="lentes bien elegidos" ask="¿Qué lente usarías primero?" />
        </>
      )}
      {view === "feed" && (
        <>
          <div className="note">Versículos que aparecen seguido en redes. Elegí qué dice <strong>en su contexto original</strong>.</div>
          <Dinamica items={FEED} doneLabel="aciertos" />
        </>
      )}
    </>
  );
}

// ── PARALELOS ────────────────────────────────────────────────────────────────

function TabParalelos({ teacherMode, openExpand, toggleExpand }) {
  const [v, setV] = useState("d");
  return (
    <>
      <div className="sec-title">Paralelos</div>
      <div className="sec-sub">La Biblia se interpreta a sí misma</div>

      {teacherMode && (
        <Teach title="Idea central">
          <p>Si creemos que «toda la Escritura es inspirada por Dios» (2 Tim. 3:16), podemos dejar que la Biblia sea su propia intérprete. Un solo Espíritu está detrás de todos los autores. Preguntá: «¿Qué suposición hay detrás de cada forma de leer? ¿Es la Biblia Palabra de Dios que me juzga a mí, o yo la juzgo a ella?».</p>
        </Teach>
      )}

      <div className="chip-row">
        <button className={`chip c0${v === "d" ? " on" : ""}`} onClick={() => setV("d")}>Daniel 2</button>
        <button className={`chip c0${v === "m" ? " on" : ""}`} onClick={() => setV("m")}>Mateo 13</button>
        <button className={`chip c0${v === "o" ? " on" : ""}`} onClick={() => setV("o")}>Otros paralelos</button>
      </div>

      {v === "d" && (
        <>
          <div className="read-cue"><Mic size={16} /> Un voluntario lee Daniel 2:31-35 (el sueño). Después, resolvemos.</div>
          <Pass k="Daniel 2:31-35" />
          <div className="note">Ahora no adivines: la interpretación está <strong>en el mismo capítulo</strong> (Dan. 2:36-45). Elegí qué significa cada elemento.</div>
          <Dinamica items={DAN2} doneLabel="elementos bien interpretados" />
        </>
      )}
      {v === "m" && (
        <>
          <div className="read-cue"><Mic size={16} /> Lean Mateo 13:3-9 (la parábola) y luego resuelvan.</div>
          <Pass k="Mateo 13:3-9" />
          <div className="note">Jesús mismo la interpreta en Mateo 13:18-23. Elegí qué representa cada tipo de terreno.</div>
          <Dinamica items={SEMBRADOR} doneLabel="terrenos bien identificados" />
        </>
      )}
      {v === "o" && (
        <>
          <ExpandList items={PARALELOS_EXTRA} openExpand={openExpand} toggleExpand={toggleExpand} />
          <div className="egw-wrap">
            <div className="egw-source"><Star size={11} /> Elena G. de White · Mensajes selectos, t. 2, p. 130</div>
            <div className="egw-text">«<strong>El Antiguo Testamento es el evangelio expresado en figuras y símbolos. El Nuevo Testamento es la realidad. El uno es tan esencial como el otro.</strong>»</div>
          </div>
        </>
      )}
    </>
  );
}

// ── ELENA ────────────────────────────────────────────────────────────────────

function TabElena({ teacherMode, openExpand, toggleExpand }) {
  return (
    <>
      <div className="sec-title">Elena</div>
      <div className="sec-sub">Cómo leer los escritos de Elena G. de White</div>

      {teacherMode && (
        <Teach title="Enfoque">
          <p>Los mismos principios que usamos con la Biblia (contexto, principios, estudiar todo el tema) aplican a un escrito profético moderno. Un solo párrafo aislado no define una enseñanza. Se puede recomendar la lectura de <strong>Cómo leer a Elena G. de White</strong>, de George R. Knight, y del capítulo «Consejo relativo a la edad para ingresar en la escuela» (Mensajes selectos, t. 3, pp. 251-265).</p>
        </Teach>
      )}

      <div className="card">
        <div className="card-label">Un regalo que hay que leer bien</div>
        <p>Los escritos proféticos de Elena G. de White pueden ser —y son— una gran bendición. Es trágico cuando se los usa y aplica de forma errónea. Estas cinco pautas ayudan a leerlos bien.</p>
      </div>

      <ExpandList items={PAUTAS} openExpand={openExpand} toggleExpand={toggleExpand} />

      <div className="divider" />
      <div className="sec-title" style={{ fontSize: "1.25rem", marginBottom: ".6rem" }}>Ponelo en práctica</div>
      <Dinamica items={EGW_PRACTICA} doneLabel="pautas bien aplicadas" />
    </>
  );
}

// ── BIBLIA ───────────────────────────────────────────────────────────────────

function TabBiblia({ openVerses, toggle }) {
  return (
    <>
      <div className="sec-title">Biblia</div>
      <div className="sec-sub">{VERSES.length} pasajes · RVR1960 · Tocá para expandir</div>
      {GROUPS.map(gr => (
        <div key={gr.g}>
          <div className="group-label">{gr.label}</div>
          {VERSES.filter(v => v.g === gr.g).map(v => (
            <div key={v.ref} className={`verse-item${v.isBase ? " base-v" : ""}`} onClick={() => toggle(v.ref)}>
              <div className="verse-header">
                <span className="verse-ref">{v.ref}</span>
                <div className="verse-tags">
                  {v.isBase && <span className="verse-tag warn-tag"><Star size={9} style={{ display: "inline", marginRight: 3 }} />Texto base</span>}
                  {openVerses[v.ref] ? <ChevronUp size={15} color="var(--acc2)" /> : <ChevronDown size={15} color="var(--tx3)" />}
                </div>
              </div>
              {openVerses[v.ref] && <div className="verse-body">{numberize(v.text)}</div>}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// ── QUIZ ─────────────────────────────────────────────────────────────────────

function TabQuiz({ quizIdx, quizSelected, quizAnswered, quizResults, quizDone, score, selectQuiz, nextQuiz, retryQuiz }) {
  if (quizDone) {
    const pct = Math.round((score / QUIZ_DATA.length) * 100);
    const msg = pct === 100 ? "¡Perfecto! Ya tenés el método para leer la Biblia con minuciosidad y humildad." :
                pct >= 75 ? "¡Muy bien! Dominás las ideas principales: contexto literario, bíblico y cultural." :
                pct >= 50 ? "Buen comienzo. Repasá los casos de la pestaña Lentes." :
                "Vale la pena volver a la historia de Felipe y el etíope, y a los tres lentes.";
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
        return <button key={i} className={cls} onClick={() => selectQuiz(i)} disabled={quizAnswered}>{opt}</button>;
      })}
      {quizAnswered && (
        <>
          <div className="quiz-feedback">
            {quizSelected === q.ans
              ? <><CheckCircle size={14} color="var(--ok)" style={{ display: "inline", marginRight: 6 }} /><strong>Correcto.</strong> </>
              : <><XCircle size={14} color="var(--err)" style={{ display: "inline", marginRight: 6 }} /><strong>Incorrecto.</strong> </>}
            {q.feedback}
          </div>
          <button className="quiz-next" onClick={nextQuiz}>{quizIdx + 1 < QUIZ_DATA.length ? "Siguiente →" : "Ver resultados"}</button>
        </>
      )}
    </>
  );
}

// ── CIERRE ───────────────────────────────────────────────────────────────────

function DiscussBlock({ title, items, personal }) {
  return (
    <div className="discuss-block">
      <div className="discuss-title">{title}</div>
      {items.map((d, i) => (
        <div key={i} className="discuss-q">
          <span className="discuss-num">{i + 1}.</span>
          <span className="discuss-text">{d.t} {d.r && <span className="discuss-ref">({d.r})</span>}</span>
        </div>
      ))}
      <div className="discuss-personal"><strong>Reflexión personal:</strong> {personal}</div>
    </div>
  );
}

function TabCierre() {
  return (
    <>
      <div className="sec-title">Cierre</div>
      <div className="sec-sub">Elegí 2 o 3 preguntas para conversar en grupo</div>

      <DiscussBlock
        title="Ayuda para comprender"
        items={DISCUSS_ENTENDER}
        personal="¿Cómo te han ayudado otras personas a comprender la Biblia? ¿Cómo estás ayudando a otros a comprender mejor la Biblia?"
      />
      <DiscussBlock
        title="La importancia de una interpretación adecuada"
        items={DISCUSS_IMPORTANCIA}
        personal="¿Cómo puedes protegerte de los engaños de quienes hacen un mal uso de las Escrituras?"
      />
      <DiscussBlock
        title="Principios para la interpretación"
        items={DISCUSS_PRINCIPIOS}
        personal="¿Qué otros principios pueden ayudarnos a interpretar correctamente la Biblia?"
      />

      <div className="card">
        <div className="card-label">Puntos clave para recordar</div>
        <ul className="key-list">
          {PUNTOS_CLAVE.map((p, i) => (
            <li key={i}><span className="key-dot" /><span className="key-text">{p}</span></li>
          ))}
        </ul>
      </div>

      <div className="vida-card">
        <div className="vida-label"><Flame size={13} /> Para tu vida</div>
        <div className="vida-text">
          <p>Un versículo en una story, un reel con una frase «de Elena G. de White», un meme con Jeremías 29:11 sobre un atardecer. Casi todo lo que te llega de la Biblia llega <strong>recortado</strong>. Y un versículo recortado dice lo que el que lo recortó quiere que diga.</p>
          <br />
          <p>El etíope no se quedó con su duda: viajó a Jerusalén, leyó, buscó, y cuando no entendió, pidió ayuda. Eso no es debilidad: es la actitud de alguien que quiere la verdad. <strong>Preguntar «¿esto qué quiere decir de verdad?» es de valientes.</strong> En tu liceo o facultad, cuando alguien te lance un versículo para discutir, no tenés que ganar el debate: tenés que mirar el contexto.</p>
          <br />
          <p>Esta semana, <strong>una sola cosa concreta</strong>: la próxima vez que veas un versículo o una cita viral, hacé el chequeo de treinta segundos: leé tres versículos antes y tres después, buscá un pasaje paralelo y preguntate si tu conclusión está de acuerdo con el resto de la Biblia. Si es de Elena G. de White, preguntá dónde lo dijo. Y compartí con un amigo lo que descubriste.</p>
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
    if (quizIdx + 1 >= QUIZ_DATA.length) setQuizDone(true);
    else { setQuizIdx(i => i + 1); setQuizSelected(null); setQuizAnswered(false); }
  };
  const retryQuiz = () => {
    setQuizIdx(0); setQuizSelected(null); setQuizAnswered(false);
    setQuizResults([]); setQuizDone(false); setScore(0);
  };

  const TABS = [
    { id: "inicio",    label: "Inicio",    Icon: Home },
    { id: "camino",    label: "Camino",    Icon: Route },
    { id: "lentes",    label: "Lentes",    Icon: Glasses },
    { id: "paralelos", label: "Paralelos", Icon: Link2 },
    { id: "elena",     label: "Elena",     Icon: ScrollText },
    { id: "biblia",    label: "Biblia",    Icon: BookOpen },
    { id: "quiz",      label: "Quiz",      Icon: HelpCircle },
    { id: "cierre",    label: "Cierre",    Icon: Flame },
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
              InVerso · Semana 8
              <span className="hero-dot" />
            </div>
            <h1 className="hero-title">
              Interpretar <em>la Palabra</em>
            </h1>
            <div className="hero-ref">Hechos 8:26-40 · RVR1960</div>
            <div className="hero-line" />
          </div>

          <div className={`secret-bar${barFlash ? " flash" : ""}`}>
            {teacherMode ? "● MODO MAESTRO ACTIVO ●" : "· · ·"}
          </div>

          <div className="content" key={tab}>
            {tab === "inicio"    && <TabInicio teacherMode={teacherMode} />}
            {tab === "camino"    && <TabCamino teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "lentes"    && <TabLentes teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "paralelos" && <TabParalelos teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "elena"     && <TabElena teacherMode={teacherMode} openExpand={openExpand} toggleExpand={toggleExpand} />}
            {tab === "biblia"    && <TabBiblia openVerses={openVerses} toggle={toggleVerse} />}
            {tab === "quiz"      && (
              <TabQuiz
                quizIdx={quizIdx} quizSelected={quizSelected}
                quizAnswered={quizAnswered} quizResults={quizResults}
                quizDone={quizDone} score={score}
                selectQuiz={selectQuiz} nextQuiz={nextQuiz} retryQuiz={retryQuiz}
              />
            )}
            {tab === "cierre"    && <TabCierre />}
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
