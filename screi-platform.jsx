
import React, { useState, useMemo, useReducer, useRef, useEffect, useCallback } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, BarChart, Bar, Cell, ReferenceLine, Legend, Area, AreaChart
} from "recharts";
import {
  AlertTriangle, Shield, FileText, Clock, ChevronRight, Info,
  Download, Plus, CheckCircle2, XCircle, Scale, Gavel, BookOpen,
  ExternalLink, Mail, ArrowRight, X, Activity, Layers, History,
  Settings2, HelpCircle, ChevronLeft, ChevronDown, Building2,
  ShieldAlert, ShieldCheck, Printer, Lock, Unlock, Minus,
  TrendingUp, TrendingDown, ListChecks, Globe2, Radio, Search, Save
} from "lucide-react";

/*=========================================================================
  SCREI — STATE CYBER RESPONSE ESCALATION INDEX  v1.0  (Habila 2026)
  =========================================================================*/

/* ----- GLOBAL STYLE & DESIGN TOKENS ------------------------------------ */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{font-family:'IBM Plex Sans',ui-sans-serif,system-ui,sans-serif;background:#F0EDE4;color:#151C28;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
  ::selection{background:#D4C49A;color:#151C28}
  button{font-family:inherit;cursor:pointer;border:none;background:none}
  input,textarea,select{font-family:inherit}
  a{color:inherit;text-decoration:none}

  /* Layout */
  .sr-root{display:flex;height:100vh;overflow:hidden}
  .sr-nav{width:248px;flex-shrink:0;background:#0C1A30;color:#fff;display:flex;flex-direction:column;overflow-y:auto;z-index:20}
  .sr-main{flex:1;overflow-y:auto;position:relative}
  .sr-content{max-width:1100px;margin:0 auto;padding:32px 28px 80px}

  /* Scrollbars */
  .sr-main::-webkit-scrollbar,.sr-nav::-webkit-scrollbar{width:6px}
  .sr-main::-webkit-scrollbar-track,.sr-nav::-webkit-scrollbar-track{background:transparent}
  .sr-main::-webkit-scrollbar-thumb{background:#C5BBA8;border-radius:4px}
  .sr-nav::-webkit-scrollbar-thumb{background:#1E3052;border-radius:4px}

  /* Typography */
  .sr-serif{font-family:'Source Serif 4',Georgia,serif}
  .sr-mono{font-family:'IBM Plex Mono',ui-monospace,monospace;font-feature-settings:"tnum" 1}

  /* Card */
  .sr-card{background:#fff;border:1px solid #E2DDD3;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.04)}
  .sr-card-navy{background:#0C1A30;border:1px solid rgba(255,255,255,.08);border-radius:6px;color:#fff}

  /* Range slider */
  input[type=range]{-webkit-appearance:none;appearance:none;height:5px;border-radius:3px;background:#E2DDD3;outline:none;width:100%}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#0C1A30;border:2.5px solid #fff;box-shadow:0 0 0 1.5px #0C1A30;cursor:pointer}
  input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#0C1A30;border:2.5px solid #fff;box-shadow:0 0 0 1.5px #0C1A30;cursor:pointer}
  input[type=range].ev-track::-webkit-slider-runnable-track{background:linear-gradient(to right,#1A3A5C,#2B5F9E)}
  input[type=range].sev-track::-webkit-slider-runnable-track{background:linear-gradient(to right,#4A7C4E,#B0562F)}
  input[type=range].ctx-track::-webkit-slider-runnable-track{background:linear-gradient(to right,#3E6491,#A6803D)}

  /* Animations */
  .sr-fade{animation:srFade .25s ease both}
  @keyframes srFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .sr-slide-in{animation:srSlide .2s ease both}
  @keyframes srSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}

  /* Focus */
  :focus-visible{outline:2px solid #4E7AB0;outline-offset:2px;border-radius:2px}

  /* Print styles for Executive Brief */
  @media print {
    .sr-noprint{display:none !important}
    .sr-nav{display:none !important}
    .sr-root{display:block;height:auto}
    .sr-main{overflow:visible}
    .sr-content{display:none !important}
    .sr-brief-modal{position:static !important;display:block !important}
    .sr-brief-overlay{display:none !important}
    .sr-brief-close{display:none !important}
    .sr-brief-actions{display:none !important}
    .brief-page{page-break-after:always;width:210mm;min-height:267mm;padding:18mm 20mm 22mm;box-sizing:border-box;background:white}
    .brief-page:last-child{page-break-after:auto}
    body{background:white}
    @page{margin:0;size:A4}
  }
`;

/* ----- PALETTE CONSTANTS ---------------------------------------------- */
const BAND_CLR = {I:"#64758C",II:"#2E5580",III:"#1F4068",IV:"#7D6225",V:"#8C5A1E",VI:"#963020",VII:"#7A1E28"};
const BAND_BG  = {I:"#EEF0F3",II:"#E5EDF5",III:"#DDE7F0",IV:"#F5EDD5",V:"#F0E2CB",VI:"#F4DDD4",VII:"#F2D9DB"};
const BAND_LABEL={I:"Strategic Silence",II:"Private Démarche",III:"Public Attribution",IV:"Sanctions / Coercive",V:"Cyber Countermeasure",VI:"Collective Defense",VII:"Armed Response Review"};
const BAND_LEGAL={I:"Sovereign discretion",II:"Retorsion (VCDR)",III:"Retorsion; right to characterise",IV:"Retorsion / countermeasure (Arts.22,49–54)",V:"ARSIWA Arts.22,49–54; necessity Art.25",VI:"UN Charter Art.51 (collective); NATO Art.5",VII:"UN Charter Art.51 (individual/collective)"};
const BAND_MIN_COS={I:0,II:30,III:60,IV:65,V:75,VI:80,VII:85};

/* ----- AHP WEIGHTS  (Table 4.1a / 4.1b / 4.2) ----------------------- */
const BETA={AC:0.4996,IC:0.2366,SDC:0.2637};
const WK={SH:0.1857,TC:0.1143,CM:0.0714,DD:0.0714,CBS:0.0852,RHP:0.0852,AO:0.0710,DPP:0.0545,ED:0.0545,ER:0.0817,SVT:0.0681,CI:0.0571};
const ERS_W={ER:6,AO:5,ED:4,DPP:4,CBS:6,SVT:5};
const LAMBDA=1;
const BOUNDARIES=[20,35,50,65,80,90];
const BAND_ORDER=["I","II","III","IV","V","VI","VII"];
const EV_IDS=["AC","IC","SDC"];
const SEV_IDS=["SH","TC","CM","DD","CBS","RHP","AO","DPP","ED","ER","SVT","CI"];
const ALL_VAR_IDS=[...EV_IDS,...SEV_IDS];

/* ----- BAND TABLE (§5) ---------------------------------------------- */
const BANDS=[
  {n:"I",  idx:0,min:0, max:19, label:"Strategic Silence / Monitoring",     legalBasis:"Sovereign discretion; no action-conditioning rule",              minCoS:0,  meaning:"Preserve intelligence posture; avoid premature signaling."},
  {n:"II", idx:1,min:20,max:34, label:"Private Diplomatic Démarche",         legalBasis:"Diplomatic prerogative (VCDR channels); retorsion",             minCoS:30, meaning:"Opens a deconfliction channel without public commitment."},
  {n:"III",idx:2,min:35,max:49, label:"Public Attribution / Formal Protest", legalBasis:"Retorsion; sovereign right to characterize conduct",             minCoS:60, meaning:"Reputational cost; builds the evidentiary record for later countermeasure notice."},
  {n:"IV", idx:3,min:50,max:64, label:"Sanctions / Coercive Response",       legalBasis:"Retorsion (autonomous) or countermeasure if so framed (Arts.22,49–54)", minCoS:65, meaning:"Requires Category 2+ for countermeasure framing; sanctions-as-retorsion do not."},
  {n:"V",  idx:4,min:65,max:79, label:"Proportionate Cyber Countermeasure",  legalBasis:"ARSIWA Arts.22,49–54; necessity (Art.25) as alternative basis",  minCoS:75, meaning:"Requires Categories 5–6 satisfied; proportionality and prior notice absent urgency."},
  {n:"VI", idx:5,min:80,max:89, label:"Collective Defense Coordination",      legalBasis:"UN Charter Art.51 (collective); NATO Art.5; Nicaragua conditions", minCoS:80, meaning:"Requires Category 9; alliance consultation, not unilateral action."},
  {n:"VII",idx:6,min:90,max:100,label:"Armed Response Review",               legalBasis:"UN Charter Art.51 (individual/collective)",                      minCoS:85, meaning:"Requires Category 8; necessity/proportionality of self-defence; UNSC reporting."},
];

/* ----- LEGAL CLASSIFICATION LAYER (§3.4) ----------------------------- */
const LEGAL_CATS=[
  {id:1, label:"Category 1 — No wrongful act / insufficient evidence",
   threshold:"No breach established, or attribution unsubstantiated (ARSIWA Art.2).",
   indicators:"Low/no AC; non-state conduct without state nexus.",
   llbN:"III", llbNote:"No countermeasure available; retorsion and monitoring only."},
  {id:2, label:"Category 2 — Wrongful act below use-of-force threshold",
   threshold:"Attributable breach not rising to Art.2(4) force.",
   indicators:"Moderate confirmed harm; no destructive effect.",
   llbN:"V", llbNote:"LLB Band V; requires Categories 5–6 for countermeasure framing."},
  {id:3, label:"Category 3 — Breach of sovereignty (species of Cat.2) ⚑",
   threshold:"Physical/functional loss or usurpation of governmental function — contested as independent rule (Tallinn 2.0, Rule 4).",
   indicators:"Remote manipulation causing physical/functional loss below the coercion threshold.",
   llbN:"V", llbNote:"Species of Cat.2 for states accepting sovereignty-as-rule; otherwise retorsion only.", contested:true},
  {id:4, label:"Category 4 — Prohibited intervention (species of Cat.2)",
   threshold:"Coercion on the domaine réservé (customary law; Nicaragua, 1986).",
   indicators:"Coercive targeting of electoral or governmental decision-making.",
   llbN:"V", llbNote:"A species of Cat.2; supports public attribution and coordinated response."},
  {id:7, label:"Category 7 — Use of force",
   threshold:"Scale/effects comparable to kinetic force (Art.2(4); Tallinn 2.0, Rules 68–69; Schmitt criteria).",
   indicators:"Physical damage or comparable severe functional loss.",
   llbN:"VI", llbNote:"Supports Bands V–VI; does not alone authorize Band VII (Nicaragua gravity gap)."},
  {id:8, label:"Category 8 — Armed attack",
   threshold:"\u201CMost grave\u201D use of force (Art.51; Tallinn 2.0, Rule 71).",
   indicators:"Severe direct destruction/injury; high attribution confidence.",
   llbN:"VII", llbNote:"Triggers self-defence subject to necessity/proportionality; UNSC reporting. Untested for cyber-only acts."},
  {id:9, label:"Category 9 — Collective self-defence relevance",
   threshold:"Cat.8 met plus victim declaration and request (Nicaragua), or treaty mechanism (NATO Art.5).",
   indicators:"Formal request; North Atlantic Council consultation triggered.",
   llbN:"VII", llbNote:"Authorizes Band VI–VII. Requires victim-state declaration and request."},
  {id:10,label:"Category 10 — International armed conflict relevance",
   threshold:"IAC threshold met (Geneva Conventions, common Art.2).",
   indicators:"Cyber operations conjoined with sustained kinetic hostilities.",
   llbN:null, llbNote:"Regime shift to jus in bello. Incident is flagged — outside SCREI\u2019s peacetime envelope.",notScored:true},
];
const catById = id => LEGAL_CATS.find(c=>c.id===id);

/* ----- VARIABLE DEFINITIONS (§4.2) ----------------------------------- */
const VARIABLES=[
  {id:"AC",  cluster:"ev",  name:"Attribution Confidence",         weight:BETA.AC,   short:"AC",
   doctrine:"Evidentiary confidence the operation is attributable to a state actor (ARSIWA Arts.4,8); the legal precondition for countermeasure or self-defence claims.",
   anchors:[[0,"No plausible link"],[3,"Circumstantial only"],[6,"Single corroborated source"],[10,"Multi-source, releasable-grade"]],
   effect:"Multiplicative exponent in CoS. Near-zero AC drives S toward zero regardless of severity — independent of the LLB."},
  {id:"IC",  cluster:"ev",  name:"Intelligence Corroboration",     weight:BETA.IC,   short:"IC",
   doctrine:"Independent methodological corroboration of the attribution judgment (SIGINT, forensics, allied sharing), scored via source-reliability tiers (Admiralty Code A–F \xd7 1–6).",
   anchors:[[0,"Single uncorroborated source"],[5,"Two independent methods"],[10,"Three or more independent, high-reliability sources"]],
   effect:"Multiplicative exponent in CoS; gates the credibility of public attribution (Band III)."},
  {id:"SDC", cluster:"ev",  name:"State Direction / Control",      weight:BETA.SDC,  short:"SDC",
   doctrine:"Specific evidence meeting the ARSIWA Art.8 \u201Ceffective control\u201D standard, distinguishing organ conduct from directed-proxy conduct from uncontrolled non-state conduct.",
   anchors:[[0,"No state nexus"],[4,"Toleration / harboring only"],[7,"Direction without operational control"],[10,"Effective control or organ conduct"]],
   effect:"Multiplicative exponent in CoS; determines whether Category 5 (attributable state conduct) is satisfied."},
  {id:"SH",  cluster:"sev", name:"Severity of Harm",               weight:WK.SH,     short:"SH",
   doctrine:"Physical, functional, and economic magnitude of damage; principal driver of use-of-force / armed-attack classification (Schmitt severity criterion).",
   anchors:[[0,"No measurable harm"],[3,"Confidentiality breach only"],[6,"Significant disruption with economic loss"],[10,"Physical destruction, injury, or loss of life"]],
   effect:"Largest additive weight in K; primary driver of Legal Classification Categories 7–8."},
  {id:"TC",  cluster:"sev", name:"Target Criticality",             weight:WK.TC,     short:"TC",
   doctrine:"Systemic importance of the affected sector (energy, finance, health, C2), independent of harm realized.",
   anchors:[[0,"Non-essential"],[5,"Sector-significant"],[10,"National critical infrastructure / life-safety system"]],
   effect:"Amplifies severity\u2019s legal and strategic weight; feeds critical-infrastructure norm assessment."},
  {id:"CM",  cluster:"sev", name:"Civilian / Military Target Status",weight:WK.CM,  short:"CM",
   doctrine:"Whether the affected system is civilian/population-serving or military.",
   anchors:[[0,"Purely military"],[5,"Dual-use"],[10,"Purely civilian, population-serving"]],
   effect:"Raises normative and political salience; relevant to IHL protections if Category 10 is reached."},
  {id:"DD",  cluster:"sev", name:"Duration of Disruption",          weight:WK.DD,    short:"DD",
   doctrine:"Length of functional impairment.",
   anchors:[[0,"< 1 hour"],[4,"1\u201324 hours"],[7,"1\u20137 days"],[10,"> 7 days or permanent"]],
   effect:"Sustained disruption raises the gravity assessment and supports Category 7 classification."},
  {id:"CBS", cluster:"sev", name:"Cross-Border Spillover",           weight:WK.CBS,   short:"CBS",
   doctrine:"Extent to which effects propagate beyond the immediately targeted state.",
   anchors:[[0,"Contained to target"],[5,"Regional propagation"],[10,"Global propagation (NotPetya-pattern)"]],
   effect:"Raises the Escalation Risk Score and multilateral/alliance relevance."},
  {id:"RHP", cluster:"ctx", name:"Repeated Hostile Pattern",         weight:WK.RHP,   short:"RHP",
   doctrine:"Frequency and recency of comparable hostile conduct by the same actor.",
   anchors:[[0,"First observed"],[5,"Recurrence within 12 months"],[10,"Sustained pattern, multiple confirmed incidents"]],
   effect:"Supports composite-act treatment (ARSIWA Art.15); erodes the presumption of accident."},
  {id:"AO",  cluster:"ctx", name:"Alliance Obligations",             weight:WK.AO,    short:"AO",
   doctrine:"Relevance of collective-defense or mutual-assistance commitments (NATO Art.5, EU mutual-assistance clause).",
   anchors:[[0,"No alliance relevance"],[5,"Consultation clause engaged"],[10,"Formal collective-defense assessment triggered"]],
   effect:"Gates Band VI; raises the Escalation Risk Score."},
  {id:"DPP", cluster:"ctx", name:"Domestic Political Pressure",      weight:WK.DPP,   short:"DPP",
   doctrine:"Intensity of domestic political demand for visible action.",
   anchors:[[0,"No public salience"],[5,"Moderate media/legislative attention"],[10,"Acute public demand for retaliation"]],
   effect:"Affects timing and choice within the lawful band; cannot raise the LLB ceiling."},
  {id:"ED",  cluster:"ctx", name:"Economic Dependence",              weight:WK.ED,    short:"ED",
   doctrine:"Bilateral economic interdependence with the suspected state, inversely correlated with sanctions appetite.",
   anchors:[[0,"Negligible"],[5,"Moderate trade/energy exposure"],[10,"High dependence (critical trade, energy, financial exposure)"]],
   effect:"Feeds the Escalation Risk Score as a restraint factor on Bands IV–VI."},
  {id:"ER",  cluster:"ctx", name:"Escalation Risk",                  weight:WK.ER,    short:"ER",
   doctrine:"Likelihood a given response provokes adversary counter-escalation, given the broader strategic relationship.",
   anchors:[[0,"Low-tension dyad"],[5,"Active rivalry"],[10,"Acute crisis, nuclear or near-peer dyad"]],
   effect:"A dampener, not a driver: high ER raises the evidentiary bar for Bands V–VII."},
  {id:"SVT", cluster:"ctx", name:"Strategic Value of Target",        weight:WK.SVT,   short:"SVT",
   doctrine:"Importance of the affected asset to the victim state\u2019s own strategic interests or capabilities.",
   anchors:[[0,"Negligible"],[5,"Moderate value"],[10,"Core deterrent / C2 capability"]],
   effect:"Drives urgency and willingness to accept escalation risk within Bands V–VII."},
  {id:"CI",  cluster:"sev", name:"Campaign Indicator",               weight:WK.CI,    short:"CI",
   doctrine:"Whether the incident is isolated or part of an identifiable campaign (shared infrastructure, TTP overlap, temporal clustering).",
   anchors:[[0,"Isolated"],[5,"Probable linkage to 1\u20132 prior incidents"],[10,"Confirmed campaign, 3+ linked incidents"]],
   effect:"Supports ARSIWA Art.15 composite-act treatment across the campaign."},
];
const varById = id => VARIABLES.find(v=>v.id===id);

/* ----- RESPONSE TAXONOMY (§8.2) -------------------------------------- */
const RESPONSE_TAXONOMY=[
  {band:"I",  action:"Silent monitoring",              legal:"Sovereign discretion; no action-conditioning rule",          rationale:"Preserve sources/methods; avoid premature signaling.",       warning:"None required; default state."},
  {band:"II", action:"Private diplomatic d\xe9marche", legal:"Diplomatic prerogative (VCDR); retorsion",                   rationale:"Open deconfliction channel without public commitment.",       warning:"CoS \u226530; low escalation risk."},
  {band:"III",action:"Public attribution",             legal:"Retorsion; sovereign right to characterize conduct",          rationale:"Impose reputational cost; build evidentiary record.",         warning:"CoS \u226560; premature attribution risks credibility if later revised."},
  {band:"III",action:"Formal protest",                 legal:"Retorsion; diplomatic law",                                   rationale:"Formalize objection; precondition to countermeasure notice (Art.52).", warning:"Pairs with public attribution; no independent precondition."},
  {band:"IV", action:"Countermeasure (non-cyber)",     legal:"ARSIWA Arts.22,49\u201354",                                   rationale:"Induce compliance via reversible, proportionate non-cyber measures.", warning:"Requires Categories 5\u20136; risk if misattributed."},
  {band:"IV", action:"Economic sanctions",             legal:"Retorsion (autonomous) or countermeasure if so framed",       rationale:"Scalable, reversible economic coercion.",                     warning:"CoS \u226565; Economic Dependence may dampen willingness."},
  {band:"V",  action:"Cyber countermeasure",           legal:"ARSIWA Arts.22,49\u201354; necessity (Art.25)",               rationale:"Proportionate in-kind response; functions as escalation off-ramp (\xa76.5).", warning:"CoS \u226575; RSS check mandatory before execution."},
  {band:"VI", action:"Collective defense consultation",legal:"NATO Art.5; UN Charter Art.51 (collective)",                  rationale:"Burden-share response; signal alliance cohesion.",            warning:"Requires Category 9; CoS \u226580."},
  {band:"VII",action:"Armed response review",          legal:"UN Charter Art.51",                                           rationale:"Necessity/proportionality-constrained self-defence review.",  warning:"Requires Category 8; CoS \u226585; UNSC reporting attaches."},
];
const STRATEGIC_RESTRAINT={action:"Strategic restraint / no response",legal:"Sovereign discretion, exercisable at any score",rationale:"Deliberate non-escalation for reasons the index does not capture.",warning:"Must be a documented decision, not a default; distinct from Band I."};

/* =========================================================================
   MATHEMATICAL ENGINE — exact implementation of Habila (2026)
   All formula references (§4.1, §4.3, §4.4, §10.2) are to the source paper.
   Validated against the §8.3 worked illustration (Incident Alpha).
   ========================================================================= */

function computeCoS(AC, IC, SDC) {
  const xAC=AC/10, xIC=IC/10, xSDC=SDC/10;
  if (xAC<=0||xIC<=0||xSDC<=0) return 0;
  return 100*Math.pow(xAC,BETA.AC)*Math.pow(xIC,BETA.IC)*Math.pow(xSDC,BETA.SDC);
}

function computeK(vars) {
  let k=0;
  for (const id of SEV_IDS) k+=WK[id]*(vars[id]/10);
  return k;
}

function computeS(CoS, K) {
  if (CoS<=0) return 0;
  return Math.min(100, 100*Math.pow(CoS/100,LAMBDA)*K);
}

function computeERS(vars) {
  // §4.3: ERS = 100 × (6·ER + 5·AO + 4·ED + 4·DPP + 6·CBS + 5·SVT) / 300
  // Variables are on the 0–10 scale; denominator 300 = max raw sum (30) × 10
  const {ER,AO,ED,DPP,CBS,SVT}=vars;
  return 100*(ERS_W.ER*ER + ERS_W.AO*AO + ERS_W.ED*ED + ERS_W.DPP*DPP + ERS_W.CBS*CBS + ERS_W.SVT*SVT)/300;
}

function computeRSS(S, CoS) {
  // §4.3: RSS = min(d,10) × CoS/10,  d = distance to nearest band boundary
  const d=Math.min(...BOUNDARIES.map(b=>Math.abs(S-b)));
  return Math.min(d,10)*CoS/10;
}

function bandFromScore(S) {
  if (S<20) return "I"; if (S<35) return "II"; if (S<50) return "III";
  if (S<65) return "IV"; if (S<80) return "V"; if (S<90) return "VI";
  return "VII";
}
function bandIdx(n) { return BAND_ORDER.indexOf(n); }
function bandByIdx(i) { return BANDS[Math.max(0,Math.min(6,i))]; }

function llbFromCategory(catId, cat5, cat6) {
  // §4.4 — Legal Legitimacy Boundary ceiling
  if (!catId||catId===10) return null;          // not scored
  if (catId===1) return "III";
  if ([2,3,4].includes(catId)) {
    // LLB Band V only once Categories 5 & 6 are independently satisfied
    return (cat5&&cat6) ? "V" : "III";
  }
  if (catId===7) return "VI";
  if (catId===8) return "VII";
  if (catId===9) return "VII";                  // up to VII with victim request
  return "VII";
}

function computeCI(vars, CoS, K, S) {
  // §10.2 — Delta method confidence interval, 90% level
  const delta=1.5; // default elicitation uncertainty ±1.5 on 0–10 scale

  // SE(CoS)^2 = CoS^2 * Σ_j (β_j * δ_j / X_j)^2
  let seCoS2=0;
  for (const [id,beta] of Object.entries(BETA)) {
    if (vars[id]>0) seCoS2+=Math.pow(beta*delta/vars[id],2);
  }
  seCoS2*=CoS*CoS;

  // SE(S)^2 = (∂S/∂CoS)^2 * SE(CoS)^2 + Σ_i (∂S/∂X_i)^2 * σ_i^2
  // ∂S/∂CoS = K  (at λ=1)
  // ∂S/∂X_i = 100 * (CoS/100) * (w_i/10)
  let seS2=K*K*seCoS2;
  for (const id of SEV_IDS) {
    const dSdXi=100*(CoS/100)*(WK[id]/10);
    seS2+=dSdXi*dSdXi*delta*delta;
  }
  const seS=Math.sqrt(seS2);
  return {seS, ciLow:Math.max(0,S-1.645*seS), ciHigh:Math.min(100,S+1.645*seS)};
}

function computeContributions(vars, CoS) {
  // Each severity/context variable's contribution to S = 100*(CoS/100)*w_i*x_i
  const scale=CoS/100;
  const out={};
  for (const id of SEV_IDS) out[id]=100*scale*(WK[id]||0)*(vars[id]/10);
  return out;
}

function computePartials(vars, CoS, K, S) {
  // Partial derivatives for sensitivity display
  return {
    AC: LAMBDA*BETA.AC*(S/Math.max(vars.AC,0.01)),   // ∂lnS/∂lnAC = λ·β_AC ≈ 0.4996 (constant elasticity)
    SH: 100*Math.pow(CoS/100,LAMBDA)*(WK.SH/10),      // ∂S/∂SH (per unit of SH)
  };
}

function computeFullAnalysis(vars, catId, cat5, cat6) {
  if (!catId||catId===10) return null; // outside SCREI envelope

  const CoS  = computeCoS(vars.AC, vars.IC, vars.SDC);
  const K    = computeK(vars);
  const S    = computeS(CoS, K);
  const ERS  = computeERS(vars);
  const RSS  = computeRSS(S, CoS);
  const d    = Math.min(...BOUNDARIES.map(b=>Math.abs(S-b)));

  // Band from composite score alone
  const scoreBand=bandFromScore(S);
  const scoreIdx =bandIdx(scoreBand);

  // Legal Legitimacy Boundary (§4.4) — INDEPENDENT ceiling
  const llbN = llbFromCategory(catId, cat5, cat6);
  const llbIdx= llbN ? bandIdx(llbN) : 6;

  // Final band = min(score band, LLB) — §4.4 Final Recommended Band formula
  const llbConstrainedIdx = Math.min(scoreIdx, llbIdx);
  const llbConstrainedBand= BAND_ORDER[llbConstrainedIdx];

  // ERS Override Rule (§4.3) — downgrade by one if high-tension, low-confidence
  const ersOverride = ERS>=70 && CoS<80 && llbConstrainedIdx>0;
  const overridedIdx = ersOverride ? llbConstrainedIdx-1 : llbConstrainedIdx;
  const overridedBand= BAND_ORDER[overridedIdx];

  // CoS gate check for the effective band
  const effectiveBandInfo=BANDS[overridedIdx];
  const cosGateSatisfied = CoS >= effectiveBandInfo.minCoS;

  // Response Stability Score and Decision Volatility Flag (§4.3)
  const volatilityFlag = RSS<30;
  // If volatile: operative action = overridedBand - 1; pendingBand = overridedBand
  const operativeIdx  = (volatilityFlag && overridedIdx>0) ? overridedIdx-1 : overridedIdx;
  const operativeBand = BAND_ORDER[operativeIdx];
  const pendingBand   = volatilityFlag ? overridedBand : null;
  const isProvisional = volatilityFlag;
  const isStable      = !volatilityFlag;

  // Confidence interval
  const {seS,ciLow,ciHigh} = computeCI(vars, CoS, K, S);

  // Contributions and partials
  const contributions = computeContributions(vars, CoS);
  const partials      = computePartials(vars, CoS, K, S);

  // Recommended action (first match in taxonomy for operative band)
  const primaryAction = RESPONSE_TAXONOMY.filter(r=>r.band===operativeBand)[0] || null;
  const allActions    = RESPONSE_TAXONOMY.filter(r=>r.band===operativeBand);

  return {
    CoS, K, S, ERS, RSS, d,
    scoreBand, scoreIdx,
    llbN, llbIdx, llbConstrainedBand, llbConstrainedIdx,
    ersOverride, overridedBand, overridedIdx,
    cosGateSatisfied, effectiveBandInfo,
    volatilityFlag, operativeBand, operativeIdx, pendingBand,
    isProvisional, isStable,
    seS, ciLow, ciHigh,
    contributions, partials,
    primaryAction, allActions,
  };
}

/* =========================================================================
   STATE MANAGEMENT
   ========================================================================= */

function genId(prefix='id') {
  return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
}

const DEFAULT_VARS = Object.fromEntries(ALL_VAR_IDS.map(id=>[id,0]));

function newDraftIntake(overrides={}) {
  const now=new Date();
  const pad=n=>String(n).padStart(2,'0');
  const dateStr=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return {title:'',date:dateStr,affectedState:'',suspectedActor:'',sector:'',summary:'',effects:'',attribution:'',diplomaticContext:'',legalNotes:'',updateNotes:'',...overrides};
}

// Incident Alpha demo case — §8.3 worked illustration
function createDemoCase() {
  const demoVars={AC:7,IC:7,SDC:6,SH:6,TC:9,CM:8,DD:6,CBS:1,RHP:6,AO:3,DPP:6,ED:2,ER:4,SVT:5,CI:6};
  const demoAnalysis=computeFullAnalysis(demoVars, 2, false, false);
  const v1={
    id:genId('ver'),versionNumber:1,createdAt:'2026-07-01T09:00:00Z',
    label:'Initial Assessment',updateNotes:'Coding completed at incident detection. Attribution pending independent corroboration.',
    variables:demoVars,legalCat:2,cat5:false,cat6:false,analysis:demoAnalysis,
  };
  // Version 2: AC 7→9 (sensitivity check from §8.3)
  const v2Vars={...demoVars,AC:9};
  const v2Analysis=computeFullAnalysis(v2Vars,2,true,false);
  const v2={
    id:genId('ver'),versionNumber:2,createdAt:'2026-07-02T14:30:00Z',
    label:'Intelligence Update — Attribution Upgraded',updateNotes:'New SIGINT corroboration upgrades AC from 7 to 9. Category 5 now satisfied.',
    variables:v2Vars,legalCat:2,cat5:true,cat6:false,analysis:v2Analysis,
  };
  return {
    id:genId('case'),createdAt:'2026-07-01T08:45:00Z',
    intake:{
      title:'Operation MERIDIAN — National Power Grid SCADA Intrusion',
      date:'2026-06-30T22:15:00Z',
      affectedState:'State A',
      suspectedActor:'Identified advanced persistent threat cluster (State-directed, prior attribution record)',
      sector:'Critical Energy Infrastructure — SCADA/ICS',
      summary:'State A\u2019s national power-grid SCADA systems suffered a 30-hour disruption affecting approximately two million consumers. No physical destruction or casualties occurred; effects were contained to State A\u2019s territory. Forensic and allied-intelligence sources independently corroborate tooling previously linked to a known state-directed actor cluster. This is the second such incident from that cluster within eight months.',
      effects:'30-hour functional impairment of grid management systems affecting ~2M consumers. No physical destruction confirmed. Economic loss estimated at significant scale. Industrial processes dependent on uninterrupted supply temporarily halted.',
      attribution:'Forensic analysis of malware artefacts matches TTPs previously attributed to Cluster-MERIDIAN. Allied intelligence sharing (two independent SIGINT sources) corroborates tooling link. No public claim of responsibility. Tradecraft consistent with state-directed operation, though no direct operational command evidence recovered at initial assessment.',
      diplomaticContext:'Relations with suspected state strained over previous cyber incident cycle. No active sanctions regime. Moderate economic interdependence. NATO consultation triggered at preliminary stage pending further attribution.',
      legalNotes:'Initial legal classification: Category 2 (wrongful act below use-of-force). Category 5 satisfaction pending independent corroboration. No physical destruction precludes Category 7 at this stage. LLB ceiling: Band V (Cat.5 not yet fully satisfied, effective ceiling Band III for countermeasures).',
      updateNotes:'',
    },
    versions:[v1,v2],
  };
}

/* =========================================================================
   REDUCER
   ========================================================================= */
const INIT_STATE={
  cases:[],
  activeCase:null,
  view:'home',
  draftIntake:null,
  draftVars:{...DEFAULT_VARS},
  draftLegalCat:1,
  draftCat5:false,
  draftCat6:false,
  draftCaseId:null,
  draftVersionLabel:'Initial Assessment',
  showPolicy:true,
  briefOpen:false,
  compareVersionIds:null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return {...state, view:action.view};
    case 'CLOSE_POLICY':
      return {...state, showPolicy:false};
    case 'NEW_CASE':
      return {
        ...state, view:'intake',
        draftIntake:newDraftIntake(),
        draftVars:{...DEFAULT_VARS},
        draftLegalCat:1, draftCat5:false, draftCat6:false,
        draftCaseId:null, draftVersionLabel:'Initial Assessment',
      };
    case 'UPDATE_CASE': {
      const c=state.cases.find(x=>x.id===action.caseId);
      if (!c) return state;
      const v=c.versions[c.versions.length-1];
      return {
        ...state, view:'coding', activeCase:action.caseId,
        draftIntake:{...c.intake},
        draftVars:{...v.variables},
        draftLegalCat:v.legalCat, draftCat5:v.cat5, draftCat6:v.cat6,
        draftCaseId:action.caseId, draftVersionLabel:'Intelligence Update',
      };
    }
    case 'VIEW_CASE':
      return {...state, view:'results', activeCase:action.caseId};
    case 'INTAKE_FIELD':
      return {...state, draftIntake:{...state.draftIntake,[action.field]:action.value}};
    case 'SET_VAR':
      return {...state, draftVars:{...state.draftVars,[action.id]:action.value}};
    case 'SET_LEGAL_CAT':
      return {...state, draftLegalCat:action.catId};
    case 'SET_CAT5':
      return {...state, draftCat5:action.v};
    case 'SET_CAT6':
      return {...state, draftCat6:action.v};
    case 'SET_VERSION_LABEL':
      return {...state, draftVersionLabel:action.v};
    case 'ADVANCE_CODING':
      return {...state, view:'coding'};
    case 'ADVANCE_RESULTS': {
      const catId=state.draftLegalCat;
      const analysis=(catId===10) ? null : computeFullAnalysis(state.draftVars, catId, state.draftCat5, state.draftCat6);
      const existingCase=state.cases.find(c=>c.id===state.draftCaseId);
      const versionNum=existingCase ? existingCase.versions.length+1 : 1;
      const newVersion={
        id:genId('ver'), versionNumber:versionNum,
        createdAt:new Date().toISOString(),
        label:state.draftVersionLabel||'Assessment',
        updateNotes:state.draftIntake?.updateNotes||'',
        variables:{...state.draftVars},
        legalCat:catId, cat5:state.draftCat5, cat6:state.draftCat6,
        analysis,
      };
      if (existingCase) {
        return {
          ...state, view:'results',
          cases:state.cases.map(c=>c.id===state.draftCaseId?{...c,versions:[...c.versions,newVersion]}:c),
        };
      } else {
        const newCaseId=genId('case');
        const newCase={
          id:newCaseId, createdAt:new Date().toISOString(),
          intake:{...state.draftIntake}, versions:[newVersion],
        };
        return {...state, view:'results', activeCase:newCaseId, cases:[...state.cases,newCase]};
      }
    }
    case 'DELETE_CASE':
      return {
        ...state,
        cases:state.cases.filter(c=>c.id!==action.caseId),
        activeCase:state.activeCase===action.caseId?null:state.activeCase,
        view:state.activeCase===action.caseId?'home':state.view,
      };
    case 'OPEN_BRIEF':
      return {...state, briefOpen:true};
    case 'CLOSE_BRIEF':
      return {...state, briefOpen:false};
    case 'LOAD_DEMO': {
      const demo=createDemoCase();
      return {...state, cases:[demo,...state.cases.filter(c=>c.intake?.title!==demo.intake.title)], activeCase:demo.id, view:'results', showPolicy:false};
    }
    case 'COMPARE_VERSIONS':
      return {...state, compareVersionIds:action.ids};
    case 'CLEAR_COMPARE':
      return {...state, compareVersionIds:null};
    default: return state;
  }
}

/* =========================================================================
   UI PRIMITIVES
   ========================================================================= */

function GlobalStyle() {
  return <style dangerouslySetInnerHTML={{__html:STYLE}} />;
}

/* ---- Btn ---------------------------------------------------------------- */
function Btn({variant='primary',size='md',onClick,disabled,children,icon:Icon,iconR:IconR,style={},title}) {
  const base={display:'inline-flex',alignItems:'center',gap:6,fontFamily:'inherit',fontWeight:600,
    letterSpacing:'0.01em',borderRadius:4,cursor:disabled?'not-allowed':'pointer',
    opacity:disabled?.55:1,transition:'background .15s,box-shadow .15s',border:'none',...style};
  const sz=size==='sm'?{fontSize:11,padding:'5px 10px'}:size==='lg'?{fontSize:14,padding:'10px 20px'}:{fontSize:12,padding:'7px 14px'};
  const vs={
    primary:  {...base,...sz,background:'#0C1A30',color:'#fff'},
    secondary:{...base,...sz,background:'transparent',color:'#0C1A30',border:'1.5px solid #C5BCAE'},
    ghost:    {...base,...sz,background:'transparent',color:'#3D5A7A'},
    danger:   {...base,...sz,background:'transparent',color:'#7A1E28',border:'1.5px solid #D4929A'},
    gold:     {...base,...sz,background:'#7D6225',color:'#F7EDD4'},
    navy:     {...base,...sz,background:'#1A3A5C',color:'#fff'},
  };
  const s=vs[variant]||vs.primary;
  return (
    <button style={s} onClick={onClick} disabled={disabled} title={title}>
      {Icon && <Icon size={size==='sm'?11:size==='lg'?16:13} />}
      {children}
      {IconR && <IconR size={size==='sm'?11:size==='lg'?16:13} />}
    </button>
  );
}

/* ---- Card --------------------------------------------------------------- */
function Card({children,pad=24,style={},navy,flat}) {
  return (
    <div style={{
      background:navy?'#0C1A30':'#fff',
      color:navy?'#E5EDF5':'inherit',
      border:`1px solid ${navy?'rgba(255,255,255,.09)':'#E2DDD3'}`,
      borderRadius:6,
      boxShadow:flat?'none':'0 1px 3px rgba(0,0,0,.04),0 4px 14px rgba(0,0,0,.04)',
      padding:pad,...style
    }}>
      {children}
    </div>
  );
}

/* ---- Badge -------------------------------------------------------------- */
function Badge({children,color='slate',size='sm'}) {
  const palette={
    slate:{bg:'#EEF0F3',c:'#4A5568'},
    green:{bg:'#E4EEE6',c:'#2F5A3D'},
    gold: {bg:'#F2E9D4',c:'#7D6225'},
    red:  {bg:'#F2D9DB',c:'#7A1E28'},
    blue: {bg:'#E5EDF5',c:'#2E5580'},
    navy: {bg:'#1A3A5C',c:'#93C4E8'},
  };
  const p=palette[color]||palette.slate;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:3,
      background:p.bg,color:p.c,borderRadius:3,fontWeight:600,
      fontSize:size==='xs'?9:size==='sm'?10:11,
      padding:size==='xs'?'1px 4px':size==='sm'?'2px 6px':'3px 8px',
      letterSpacing:'0.04em'}}>
      {children}
    </span>
  );
}

/* ---- BandPill ----------------------------------------------------------- */
function BandPill({band,provisional,size='md',showLabel}) {
  if (!band) return null;
  const c=BAND_CLR[band]||'#64758C';
  const bg=BAND_BG[band]||'#EEF0F3';
  const sz=size==='lg'?{fontSize:13,padding:'4px 14px',gap:6}:
           size==='sm'?{fontSize:10,padding:'2px 6px',gap:3}:
                       {fontSize:11,padding:'3px 10px',gap:4};
  return (
    <span style={{display:'inline-flex',alignItems:'center',background:bg,color:c,
      border:`1.5px solid ${c}60`,borderRadius:4,fontWeight:700,...sz}}>
      <span>Band {band}</span>
      {showLabel && <span style={{fontWeight:400,fontSize:'0.9em',opacity:.8}}>
        {BAND_LABEL[band]}
      </span>}
      {provisional && <span style={{fontSize:8,fontWeight:700,background:c,color:'#fff',
        borderRadius:2,padding:'1px 4px',marginLeft:2}}>PROV</span>}
    </span>
  );
}

/* ---- AlertBox ----------------------------------------------------------- */
function AlertBox({type='info',icon:Icon,children,compact}) {
  const palette={
    info:   {bg:'#E5EDF5',border:'#4E7AB0',c:'#1A3A5C'},
    warning:{bg:'#F5EDD5',border:'#A6803D',c:'#5A3E10'},
    danger: {bg:'#F2D9DB',border:'#93313D',c:'#5E1E27'},
    success:{bg:'#E4EEE6',border:'#3F6B4C',c:'#1E3E2B'},
  };
  const p=palette[type]||palette.info;
  return (
    <div style={{display:'flex',gap:10,background:p.bg,border:`1px solid ${p.border}50`,
      borderLeft:`3px solid ${p.border}`,borderRadius:5,
      padding:compact?'8px 12px':'12px 16px',color:p.c}}>
      {Icon && <div style={{flexShrink:0,paddingTop:1}}><Icon size={14}/></div>}
      <div style={{fontSize:12,lineHeight:1.6}}>{children}</div>
    </div>
  );
}

/* ---- InfoTip ------------------------------------------------------------ */
function InfoTip({title,text,effect}) {
  const [open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    if (!open) return;
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};
    document.addEventListener('mousedown',h);
    return ()=>document.removeEventListener('mousedown',h);
  },[open]);
  return (
    <span ref={ref} style={{position:'relative',display:'inline-flex',cursor:'pointer',verticalAlign:'middle'}}
      onClick={e=>{e.stopPropagation();setOpen(o=>!o)}}>
      <Info size={13} style={{color:open?'#4E7AB0':'#94A3B8',flexShrink:0}} />
      {open && (
        <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,zIndex:9999,
          background:'#0F1F35',color:'#D8E6F3',padding:'12px 15px',borderRadius:6,
          fontSize:11.5,lineHeight:1.7,width:300,
          boxShadow:'0 10px 36px rgba(0,0,0,.55)',
          border:'1px solid rgba(255,255,255,.09)'}}>
          {title && <div style={{fontWeight:700,color:'#7ABCE8',marginBottom:6,fontSize:12}}>{title}</div>}
          <div style={{marginBottom:effect?8:0}}>{text}</div>
          {effect && <>
            <div style={{height:'1px',background:'rgba(255,255,255,.12)',margin:'8px 0'}} />
            <div style={{color:'#8BA8C0',fontSize:11}}>
              <span style={{fontWeight:600,color:'#A8C4D8'}}>Scoring effect: </span>{effect}
            </div>
          </>}
        </div>
      )}
    </span>
  );
}

/* ---- Modal -------------------------------------------------------------- */
function Modal({open,onClose,title,children,wide,noPad}) {
  useEffect(()=>{
    if (!open) return;
    const h=e=>{if(e.key==='Escape')onClose()};
    document.addEventListener('keydown',h);
    return ()=>document.removeEventListener('keydown',h);
  },[open,onClose]);
  if (!open) return null;
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',
      background:'rgba(8,15,30,.55)',backdropFilter:'blur(3px)'}}>
      <div style={{background:'#fff',borderRadius:8,
        width:wide?'90vw':'min(640px,95vw)',maxHeight:'90vh',
        boxShadow:'0 20px 60px rgba(0,0,0,.35)',
        display:'flex',flexDirection:'column'}}>
        {title !== null && (
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
            padding:'16px 20px',borderBottom:'1px solid #E2DDD3',flexShrink:0}}>
            <span style={{fontWeight:700,fontSize:15,color:'#151C28',fontFamily:"'Source Serif 4',serif"}}>{title}</span>
            <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',
              color:'#94A3B8',display:'flex',padding:2}}>
              <X size={18} />
            </button>
          </div>
        )}
        <div style={{overflowY:'auto',padding:noPad?0:20,flex:1}} className="sr-main">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---- SectionHead -------------------------------------------------------- */
function SectionHead({icon:Icon,title,subtitle,action,border}) {
  return (
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',
      paddingBottom:14,marginBottom:16,borderBottom:border?'1px solid #E2DDD3':'none'}}>
      <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
        {Icon && <div style={{width:34,height:34,borderRadius:6,background:'#EEF0F3',
          display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <Icon size={16} style={{color:'#1A3A5C'}} />
        </div>}
        <div>
          <div style={{fontSize:17,fontWeight:700,color:'#0C1A30',
            fontFamily:"'Source Serif 4',serif",lineHeight:1.2}}>{title}</div>
          {subtitle && <div style={{fontSize:12,color:'#64748B',marginTop:3,lineHeight:1.5}}>{subtitle}</div>}
        </div>
      </div>
      {action && <div style={{flexShrink:0}}>{action}</div>}
    </div>
  );
}

/* ---- HR ----------------------------------------------------------------- */
function HR({label}) {
  if (!label) return <div style={{height:1,background:'#E2DDD3',margin:'16px 0'}} />;
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0'}}>
      <div style={{flex:1,height:1,background:'#E2DDD3'}} />
      <span style={{fontSize:10,color:'#94A3B8',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</span>
      <div style={{flex:1,height:1,background:'#E2DDD3'}} />
    </div>
  );
}

/* ---- Metric Card -------------------------------------------------------- */
function Metric({label,value,unit='',sub,color='#0C1A30',size='md',mono,bg,accent}) {
  const fsz=size==='lg'?32:size==='xl'?42:size==='sm'?18:26;
  return (
    <div style={{background:bg||'#F8F7F3',borderRadius:5,padding:'14px 16px',textAlign:'center',
      border:`1px solid ${accent||'#E2DDD3'}`,position:'relative',overflow:'hidden'}}>
      {accent && <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:accent}} />}
      <div style={{fontSize:fsz,fontWeight:700,color,
        fontFamily:mono!==false?"'IBM Plex Mono',monospace":"'Source Serif 4',serif",lineHeight:1.1}}>
        {typeof value==='number'?value.toFixed(value>=10?1:2):value}{unit}
      </div>
      <div style={{fontSize:10,color:'#64748B',marginTop:4,textTransform:'uppercase',letterSpacing:'0.07em',fontWeight:600}}>
        {label}
      </div>
      {sub && <div style={{fontSize:11,color:color,marginTop:3,fontWeight:500}}>{sub}</div>}
    </div>
  );
}

/* ---- ProgressBar -------------------------------------------------------- */
function ProgressBar({value,max=100,color='#2E5580',label,showValue,height=7}) {
  const pct=Math.min(100,Math.max(0,value/max*100));
  return (
    <div>
      {(label||showValue) && (
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
          {label && <span style={{fontSize:10,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:600}}>{label}</span>}
          {showValue && <span style={{fontSize:10,color:'#64748B',fontFamily:"'IBM Plex Mono',monospace"}}>{typeof value==='number'?value.toFixed(1):value}</span>}
        </div>
      )}
      <div style={{background:'#E2DDD3',borderRadius:height/2,height,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:height/2,
          transition:'width .4s ease'}} />
      </div>
    </div>
  );
}

/* ---- FormulaBlock ------------------------------------------------------- */
function FormulaBlock({label,formula,computed,result}) {
  return (
    <div style={{background:'#F5F3EE',border:'1px solid #DDD8CC',borderRadius:4,
      padding:'9px 13px',marginBottom:10}}>
      {label && <div style={{fontSize:9.5,color:'#94A3B8',textTransform:'uppercase',
        letterSpacing:'0.07em',fontWeight:600,marginBottom:5}}>{label}</div>}
      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11.5,color:'#1A2942',lineHeight:1.5}}>{formula}</div>
      {computed && <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:'#64748B',marginTop:3,lineHeight:1.5}}>{computed}</div>}
      {result !== undefined && (
        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:'#1A3A5C',
          fontWeight:700,marginTop:5,borderTop:'1px solid #DDD8CC',paddingTop:5}}>{result}</div>
      )}
    </div>
  );
}

/* =========================================================================
   ESCALATION LADDER — central visualization
   ========================================================================= */
function EscalationLadder({analysis,compact=false,printMode=false}) {
  if (!analysis) return null;
  const {S,llbN,operativeBand,pendingBand,ciLow,ciHigh,isProvisional,scoreBand,ersOverride} = analysis;

  const H = compact ? 280 : printMode ? 350 : 406;
  const W = 520;
  const LEFT_W = 165; // label area width
  const BAR_W  = W - LEFT_W - 8;

  // y-coord: top=100, bottom=0  → y = (100-s)/100 * H
  const yOf = s => (100 - Math.min(100,Math.max(0,s))) / 100 * H;

  const yS     = yOf(S);
  const yCIHi  = yOf(Math.min(100,ciHigh));
  const yCILo  = yOf(Math.max(0,ciLow));

  const llbBandData = llbN ? BANDS[bandIdx(llbN)] : null;
  const yLLB = llbBandData ? yOf(llbBandData.min) : null;

  return (
    <div style={{width:'100%',overflow:'hidden'}}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block',overflow:'visible'}} preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="ladderClip"><rect x={0} y={0} width={W} height={H}/></clipPath>
          <marker id="arrowR" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={BAND_CLR[operativeBand]||'#2E5580'}/>
          </marker>
        </defs>

        {/* Band rows — top=VII, bottom=I */}
        {[...BANDS].reverse().map(band => {
          const yTop = yOf(band.max);
          const yBot = yOf(band.min);
          const bH   = Math.max(1, yBot - yTop);
          const isOp = band.n === operativeBand;
          const isPend = band.n === pendingBand;
          const isScore= band.n === scoreBand;
          const rowBg  = isOp   ? BAND_BG[band.n] :
                         isPend ? BAND_BG[band.n]+'80' : '#FAFAF8';
          return (
            <g key={band.n} clipPath="url(#ladderClip)">
              {/* Row background */}
              <rect x={0} y={yTop} width={W} height={bH} fill={rowBg} />
              {/* Bottom border line */}
              <line x1={0} y1={yBot} x2={W} y2={yBot} stroke={isOp?BAND_CLR[band.n]+'60':'#E2DDD3'} strokeWidth={isOp?1.2:.5}/>
              {/* Left color accent bar */}
              <rect x={0} y={yTop} width={5} height={bH} fill={BAND_CLR[band.n]} />

              {/* Band numeral */}
              <text x={13} y={yTop+bH/2} dy="0.38em" fontSize={compact?9:10} fontWeight={700}
                fill={isOp?BAND_CLR[band.n]:'#94A3B8'} fontFamily="IBM Plex Sans">
                {band.n}
              </text>

              {/* Band label */}
              {!compact && (
                <text x={32} y={yTop+bH/2} dy="0.38em" fontSize={9.5}
                  fill={isOp?BAND_CLR[band.n]+'DD':'#94A3B8'} fontFamily="IBM Plex Sans"
                  fontWeight={isOp?600:400}>
                  {band.label.length>26?band.label.slice(0,24)+'…':band.label}
                </text>
              )}
              {compact && (
                <text x={28} y={yTop+bH/2} dy="0.38em" fontSize={8.5}
                  fill={isOp?BAND_CLR[band.n]:'#94A3B8'} fontFamily="IBM Plex Sans">
                  {band.label.split(' / ')[0].split(' / ')[0].split(' C')[0].split(' R')[0]}
                </text>
              )}

              {/* Score range — right side */}
              <text x={LEFT_W-2} y={yTop+bH/2} dy="0.38em" textAnchor="end"
                fontSize={8} fill="#94A3B8" fontFamily="IBM Plex Mono">
                {band.min}–{band.max}
              </text>

              {/* OPERATIVE marker */}
              {isOp && !compact && (
                <g>
                  <rect x={LEFT_W+BAR_W-46} y={yTop+2} width={44} height={bH-4}
                    fill="none" stroke={BAND_CLR[band.n]} strokeWidth={1.5} rx={2} strokeDasharray={isPend?'3,2':'0'}/>
                  <text x={LEFT_W+BAR_W-24} y={yTop+bH/2} dy="0.38em" textAnchor="middle"
                    fontSize={8} fill={BAND_CLR[band.n]} fontWeight={700} fontFamily="IBM Plex Sans">
                    {isProvisional?'OPERATIVE':'OPERATIVE'}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* CI shaded band */}
        {(yCILo - yCIHi) > 0 && (
          <rect x={LEFT_W} y={yCIHi} width={BAR_W} height={yCILo-yCIHi}
            fill={BAND_CLR[operativeBand]||'#2E5580'} fillOpacity={0.10} rx={1} clipPath="url(#ladderClip)"/>
        )}

        {/* Score needle horizontal line */}
        <line x1={LEFT_W-2} y1={yS} x2={W} y2={yS}
          stroke={BAND_CLR[scoreBand]||'#2E5580'} strokeWidth={1.8}
          clipPath="url(#ladderClip)"/>

        {/* Score value chip */}
        <rect x={LEFT_W} y={yS-12} width={76} height={22}
          fill={BAND_CLR[scoreBand]||'#2E5580'} rx={3}/>
        <text x={LEFT_W+38} y={yS} dy="0.38em" textAnchor="middle"
          fontSize={10.5} fill="#fff" fontWeight={700} fontFamily="IBM Plex Mono">
          S = {S.toFixed(2)}
        </text>

        {/* Left needle pointer */}
        <polygon
          points={`${LEFT_W-2},${yS} ${LEFT_W-10},${yS-5} ${LEFT_W-10},${yS+5}`}
          fill={BAND_CLR[scoreBand]||'#2E5580'}/>

        {/* LLB ceiling line */}
        {yLLB !== null && (
          <g>
            <line x1={LEFT_W} y1={yLLB} x2={W} y2={yLLB}
              stroke="#A6803D" strokeWidth={1.8} strokeDasharray="7,4"
              clipPath="url(#ladderClip)"/>
            <rect x={LEFT_W+BAR_W-72} y={yLLB-10} width={70} height={18}
              fill="#A6803D" rx={3}/>
            <text x={LEFT_W+BAR_W-37} y={yLLB} dy="0.38em" textAnchor="middle"
              fontSize={9} fill="#fff" fontWeight={700} fontFamily="IBM Plex Sans">
              LLB CEILING
            </text>
          </g>
        )}

        {/* Pending band arrow (provisional) */}
        {pendingBand && (
          (() => {
            const pb=BANDS[bandIdx(pendingBand)];
            const pyM=yOf((pb.min+pb.max)/2);
            return (
              <g>
                <text x={W-6} y={pyM} dy="0.38em" textAnchor="end"
                  fontSize={8.5} fill={BAND_CLR[pendingBand]} fontWeight={700} fontFamily="IBM Plex Sans">
                  ← PENDING ESCALATION
                </text>
              </g>
            );
          })()
        )}
      </svg>

      {/* Legend below */}
      {!compact && (
        <div style={{display:'flex',gap:16,marginTop:10,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:10,color:'#64748B'}}>
            <svg width={20} height={4}><line x1={0} y1={2} x2={20} y2={2} stroke={BAND_CLR[scoreBand]||'#2E5580'} strokeWidth={2}/></svg>
            Composite Score S
          </div>
          {llbN && (
            <div style={{display:'flex',alignItems:'center',gap:5,fontSize:10,color:'#64748B'}}>
              <svg width={20} height={4}><line x1={0} y1={2} x2={20} y2={2} stroke="#A6803D" strokeWidth={2} strokeDasharray="5,3"/></svg>
              LLB Ceiling (Band {llbN})
            </div>
          )}
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:10,color:'#64748B'}}>
            <div style={{width:20,height:8,background:BAND_CLR[operativeBand]+'25',border:`1px solid ${BAND_CLR[operativeBand]}40`,borderRadius:2}} />
            90% CI interval
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   VARIABLE SLIDER
   ========================================================================= */
function VarSlider({variable,value,onChange}) {
  const v=variable;
  const clr=v.cluster==='ev'?'#1A3A5C':v.cluster==='sev'?'#8C4A1E':'#7D6225';
  const trackCls=v.cluster==='ev'?'ev-track':v.cluster==='sev'?'sev-track':'ctx-track';
  const clusterBadge=v.cluster==='ev'?'Evidentiary':v.cluster==='sev'?'Severity':'Context';
  const anchors=v.anchors||[];
  const lo=anchors[0]?.[1]||'';
  const hi=anchors[anchors.length-1]?.[1]||'';
  const mid=anchors.length>2?anchors[Math.floor((anchors.length-1)/2)]?.[1]:'';

  return (
    <div style={{marginBottom:22,padding:'14px 16px',background:'#FAFAF8',
      borderRadius:5,border:'1px solid #EBE6DD'}}>
      {/* Header row */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap'}}>
          <span style={{fontSize:12.5,fontWeight:700,color:'#151C28'}}>{v.name}</span>
          <span style={{fontSize:9,fontWeight:700,background:clr+'18',color:clr,
            borderRadius:3,padding:'1px 5px',letterSpacing:'0.04em'}}>{v.id}</span>
          <span style={{fontSize:9,color:'#94A3B8',background:'#EEF0F3',
            borderRadius:3,padding:'1px 5px'}}>{clusterBadge}</span>
          <InfoTip title={v.name} text={v.doctrine} effect={v.effect} />
        </div>
        <div style={{display:'flex',alignItems:'center',gap:3,flexShrink:0}}>
          <span style={{fontSize:26,fontWeight:700,color:value===0?'#C5BCAE':clr,
            fontFamily:"'IBM Plex Mono',monospace",minWidth:28,textAlign:'right',lineHeight:1}}>
            {value}
          </span>
          <span style={{fontSize:10,color:'#94A3B8',marginTop:2}}>/10</span>
        </div>
      </div>

      {/* Slider */}
      <input type="range" min={0} max={10} step={1} value={value}
        className={trackCls}
        onChange={e=>onChange(v.id,Number(e.target.value))}
        style={{width:'100%',marginBottom:6}} />

      {/* Anchor labels */}
      <div style={{display:'flex',justifyContent:'space-between',gap:4}}>
        <span style={{fontSize:9,color:'#9CA3AF',lineHeight:1.35,maxWidth:'32%'}}>{lo}</span>
        <span style={{fontSize:9,color:'#9CA3AF',lineHeight:1.35,maxWidth:'32%',textAlign:'center'}}>{mid}</span>
        <span style={{fontSize:9,color:'#9CA3AF',lineHeight:1.35,maxWidth:'32%',textAlign:'right'}}>{hi}</span>
      </div>
    </div>
  );
}

/* ---- ClusterSection ----------------------------------------------------- */
function ClusterSection({title,icon:Icon,varIds,vars,onChange,accent,open,onToggle}) {
  return (
    <div style={{marginBottom:12,border:'1px solid #E2DDD3',borderRadius:6,overflow:'hidden'}}>
      <button onClick={onToggle}
        style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'12px 16px',background:open?'#F0EDE4':'#F8F7F3',
          border:'none',cursor:'pointer',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:24,height:24,borderRadius:4,background:accent+'20',
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon size={13} style={{color:accent}} />
          </div>
          <span style={{fontSize:13,fontWeight:700,color:'#151C28'}}>{title}</span>
          <Badge color={open?'navy':'slate'}>{varIds.length} variables</Badge>
        </div>
        <ChevronDown size={16} style={{color:'#94A3B8',transform:open?'rotate(180deg)':'none',
          transition:'transform .2s'}} />
      </button>
      {open && (
        <div style={{padding:'12px 16px',background:'#fff'}}>
          {varIds.map(id=>{
            const vd=varById(id);
            if (!vd) return null;
            return <VarSlider key={id} variable={vd} value={vars[id]||0} onChange={onChange} />;
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   CHARTS — Variable Radar, Contribution Bar, History Line
   ========================================================================= */
const RADAR_COLORS={ev:'#2E5580',sev:'#8C4A1E',ctx:'#7D6225'};

function VarRadar({vars,compact}) {
  const data=VARIABLES.map(v=>({
    name:v.id, fullMark:10, value:vars[v.id]||0,
    cluster:v.cluster,
  }));
  const sz=compact?160:200;
  return (
    <ResponsiveContainer width="100%" height={sz}>
      <RadarChart data={data} margin={{top:8,right:8,bottom:8,left:8}}>
        <PolarGrid stroke="#E2DDD3" />
        <PolarAngleAxis dataKey="name" tick={{fill:'#64748B',fontSize:9,fontFamily:'IBM Plex Mono'}} />
        <PolarRadiusAxis angle={90} domain={[0,10]} tick={false} axisLine={false} />
        <Radar name="Current" dataKey="value" stroke="#2E5580" fill="#2E5580" fillOpacity={0.18} strokeWidth={1.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function ContribBar({analysis,vars,compact}) {
  if (!analysis) return null;
  const {contributions,CoS}=analysis;
  const data=SEV_IDS.map(id=>({
    name:varById(id)?.short||id,
    fullName:varById(id)?.name||id,
    value:+(contributions[id]||0).toFixed(2),
    weight:+(WK[id]*100).toFixed(1),
  })).sort((a,b)=>b.value-a.value);
  const top=compact?8:12;
  const displayData=data.slice(0,top);
  return (
    <ResponsiveContainer width="100%" height={compact?180:240}>
      <BarChart data={displayData} layout="vertical" margin={{top:4,right:24,bottom:4,left:32}}>
        <CartesianGrid horizontal={false} stroke="#E2DDD3" strokeDasharray="3,3" />
        <XAxis type="number" tick={{fill:'#94A3B8',fontSize:9,fontFamily:'IBM Plex Mono'}} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{fill:'#64748B',fontSize:10,fontFamily:'IBM Plex Mono'}} axisLine={false} tickLine={false} width={28} />
        <RTooltip
          formatter={(v,n,p)=>[`${v.toFixed(2)} pts  (w=${p.payload.weight}%)`,p.payload.fullName]}
          contentStyle={{background:'#1A2942',border:'none',borderRadius:5,fontSize:11,color:'#E5EDF5'}}
          labelStyle={{color:'#7ABCE8'}}
        />
        <Bar dataKey="value" radius={[0,3,3,0]}>
          {displayData.map((entry,i)=>(
            <Cell key={i} fill={i<3?'#2E5580':i<6?'#4E7AB0':'#A8BBCA'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function HistoryLineChart({versions}) {
  if (!versions||versions.length<2) return null;
  const data=versions.map((v,i)=>({
    name:`v${v.versionNumber}`,
    S:v.analysis?+v.analysis.S.toFixed(2):null,
    CoS:v.analysis?+v.analysis.CoS.toFixed(1):null,
    ERS:v.analysis?+v.analysis.ERS.toFixed(1):null,
    date:new Date(v.createdAt).toLocaleDateString(),
  })).filter(d=>d.S!==null);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{top:8,right:20,bottom:8,left:0}}>
        <CartesianGrid stroke="#E2DDD3" strokeDasharray="3,3" />
        <XAxis dataKey="name" tick={{fill:'#64748B',fontSize:10,fontFamily:'IBM Plex Mono'}} axisLine={false} tickLine={false} />
        <YAxis domain={[0,100]} tick={{fill:'#94A3B8',fontSize:9,fontFamily:'IBM Plex Mono'}} axisLine={false} tickLine={false} />
        <RTooltip contentStyle={{background:'#1A2942',border:'none',borderRadius:5,fontSize:11,color:'#E5EDF5'}}/>
        {BOUNDARIES.map(b=>(
          <ReferenceLine key={b} y={b} stroke="#C5BCAE" strokeDasharray="4,3" strokeWidth={0.8}/>
        ))}
        <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:10}} />
        <Line type="monotone" dataKey="S" name="Composite Score S" stroke="#2E5580" strokeWidth={2} dot={{r:4,fill:'#2E5580'}} />
        <Line type="monotone" dataKey="CoS" name="Confidence Score" stroke="#A6803D" strokeWidth={1.5} strokeDasharray="4,2" dot={{r:3,fill:'#A6803D'}} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* =========================================================================
   HOME VIEW
   ========================================================================= */
function HomeView({state,dispatch}) {
  const {cases}=state;
  const fmt=d=>{try{return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}catch{return d}};

  return (
    <div className="sr-fade">
      {/* Hero header */}
      <div style={{background:'#0C1A30',borderRadius:8,padding:'36px 40px',marginBottom:28,
        position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:.04,backgroundImage:
          'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.6) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.6) 40px)'}} />
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
            <Shield size={20} style={{color:'#A6803D'}} />
            <span style={{fontSize:11,fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',
              color:'#7ABCE8'}}>Decision Support Platform</span>
          </div>
          <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:28,fontWeight:700,
            color:'#fff',marginBottom:8,lineHeight:1.2}}>
            State Cyber Response Escalation Index
          </h1>
          <p style={{color:'#93A8C0',fontSize:13,lineHeight:1.7,maxWidth:560}}>
            SCREI is a legal-Bayesian decision-support framework for proportionate state response
            to international cyber incidents. It structures the judgment — it does not automate the decision.
          </p>
          <div style={{marginTop:20,display:'flex',gap:10,flexWrap:'wrap'}}>
            <Btn variant="gold" size="lg" icon={Plus}
              onClick={()=>dispatch({type:'NEW_CASE'})}>
              Register New Incident
            </Btn>
            <Btn variant="secondary" style={{borderColor:'rgba(255,255,255,.2)',color:'#E5EDF5'}}
              icon={BookOpen}
              onClick={()=>dispatch({type:'LOAD_DEMO'})}>
              Load Incident Alpha (Demo)
            </Btn>
          </div>
        </div>
      </div>

      {/* Stats row */}
      {cases.length>0 && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
          {[
            {label:'Total Incidents',value:cases.length,icon:FileText,color:'#2E5580'},
            {label:'High-Risk (Band V+)',value:cases.filter(c=>['V','VI','VII'].includes(c.versions?.at(-1)?.analysis?.operativeBand)).length,icon:ShieldAlert,color:'#8C4A1E'},
            {label:'Provisional Recs.',value:cases.filter(c=>c.versions?.at(-1)?.analysis?.isProvisional).length,icon:AlertTriangle,color:'#A6803D'},
            {label:'Stable Recs.',value:cases.filter(c=>c.versions?.at(-1)?.analysis?.isStable).length,icon:ShieldCheck,color:'#3F6B4C'},
          ].map(s=>(
            <Card key={s.label} pad={16} style={{textAlign:'center'}}>
              <s.icon size={20} style={{color:s.color,marginBottom:8}} />
              <div style={{fontSize:28,fontWeight:700,color:s.color,fontFamily:"'IBM Plex Mono',monospace"}}>{s.value}</div>
              <div style={{fontSize:10,color:'#64748B',marginTop:3,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Case list */}
      {cases.length===0 ? (
        <Card pad={48} style={{textAlign:'center'}}>
          <Shield size={40} style={{color:'#C5BCAE',margin:'0 auto 16px'}} />
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:17,color:'#64748B',marginBottom:8}}>No incidents registered</p>
          <p style={{fontSize:12,color:'#94A3B8',marginBottom:20}}>Register a new incident or load the demo case to get started.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <Btn icon={Plus} onClick={()=>dispatch({type:'NEW_CASE'})}>Register New Incident</Btn>
            <Btn variant="secondary" icon={BookOpen} onClick={()=>dispatch({type:'LOAD_DEMO'})}>Load Demo Case</Btn>
          </div>
        </Card>
      ) : (
        <div>
          <SectionHead icon={ListChecks} title="Incident Case Registry"
            subtitle="Select a case to view the full analysis, or register a new incident."
            action={<Btn size="sm" icon={Plus} onClick={()=>dispatch({type:'NEW_CASE'})}>New Incident</Btn>}
            border />
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {cases.map(c=>{
              const latest=c.versions?.at(-1);
              const an=latest?.analysis;
              const hasIAC=latest?.legalCat===10;
              return (
                <button key={c.id} onClick={()=>dispatch({type:'VIEW_CASE',caseId:c.id})}
                  style={{width:'100%',textAlign:'left',background:'#fff',border:'1px solid #E2DDD3',
                    borderRadius:6,padding:'16px 20px',cursor:'pointer',
                    borderLeft:`4px solid ${an?BAND_CLR[an.operativeBand]:'#C5BCAE'}`,
                    boxShadow:'0 1px 3px rgba(0,0,0,.04)',transition:'box-shadow .2s'}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:700,color:'#0C1A30',
                        fontFamily:"'Source Serif 4',serif",marginBottom:4,
                        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {c.intake?.title||'Untitled Incident'}
                      </div>
                      <div style={{fontSize:11,color:'#64748B',display:'flex',gap:12,flexWrap:'wrap'}}>
                        <span style={{display:'flex',alignItems:'center',gap:3}}>
                          <Building2 size={11}/>{c.intake?.affectedState||'—'}
                        </span>
                        <span style={{display:'flex',alignItems:'center',gap:3}}>
                          <Globe2 size={11}/>{c.intake?.sector||'—'}
                        </span>
                        <span style={{display:'flex',alignItems:'center',gap:3}}>
                          <Clock size={11}/>{fmt(c.createdAt)}
                        </span>
                        <span style={{display:'flex',alignItems:'center',gap:3}}>
                          <History size={11}/>{c.versions?.length||0} version{c.versions?.length!==1?'s':''}
                        </span>
                      </div>
                    </div>
                    <div style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                      {hasIAC ? (
                        <Badge color="red">IAC — Not Scored</Badge>
                      ) : an ? (
                        <>
                          <BandPill band={an.operativeBand} provisional={an.isProvisional} />
                          <span style={{fontSize:10,color:'#94A3B8',fontFamily:"'IBM Plex Mono',monospace"}}>
                            S={an.S.toFixed(1)} · CoS={an.CoS.toFixed(1)}%
                          </span>
                        </>
                      ) : <Badge>No analysis</Badge>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Policy note */}
      <div style={{marginTop:32}}>
        <AlertBox type="info" icon={Info}>
          <strong>Operational-use statement:</strong> SCREI structures the judgment; it does not automate the decision.
          It is a decision-support model for crisis cells operating with incomplete information.
          The model is designed to be re-run as new intelligence arrives.
          The final decision remains with accountable human officials.
        </AlertBox>
      </div>
    </div>
  );
}

/* =========================================================================
   INTAKE VIEW — Step 1: Incident Registration
   ========================================================================= */
const SECTORS=['Critical Energy Infrastructure','Financial Infrastructure','Government / C2 Systems',
  'Healthcare / Public Health','Telecommunications','Transportation / Aviation',
  'Water & Sanitation','Defense / Military Networks','Electoral / Democratic Institutions',
  'Nuclear / CBRN Adjacent','Mixed / Dual-Use','Other'];

function IntakeView({state,dispatch}) {
  const {draftIntake:f={},draftCaseId}=state;
  const set=(field,value)=>dispatch({type:'INTAKE_FIELD',field,value});
  const isUpdate=!!draftCaseId;
  const canAdvance=f?.title?.trim()&&f?.affectedState?.trim()&&f?.summary?.trim();

  return (
    <div className="sr-fade">
      <SectionHead icon={FileText}
        title={isUpdate?'Intelligence Update — Incident Record':'Incident Registration — Step 1 of 3'}
        subtitle={isUpdate
          ?"Update the incident record with new information before re-coding variables."
          :"Register the incident facts. These will anchor the structured coding in Step 2."}
        action={<Badge color="navy">Step 1 / 3</Badge>}
        border />

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {/* Incident title */}
        <div style={{gridColumn:'1/-1'}}>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Incident Title / Designation *
          </label>
          <input value={f.title||''} onChange={e=>set('title',e.target.value)}
            placeholder="e.g. Operation MERIDIAN — National Power Grid SCADA Intrusion"
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,fontWeight:500,background:'#fff',color:'#151C28',outline:'none'}} />
        </div>

        {/* Date/Time */}
        <div>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Incident Date / Time *
          </label>
          <input type="datetime-local" value={f.date||''} onChange={e=>set('date',e.target.value)}
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,background:'#fff',color:'#151C28',outline:'none'}} />
        </div>

        {/* Affected State */}
        <div>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Affected State / Entity *
          </label>
          <input value={f.affectedState||''} onChange={e=>set('affectedState',e.target.value)}
            placeholder="e.g. State A"
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,background:'#fff',color:'#151C28',outline:'none'}} />
        </div>

        {/* Suspected actor */}
        <div>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Suspected Actor
          </label>
          <input value={f.suspectedActor||''} onChange={e=>set('suspectedActor',e.target.value)}
            placeholder="e.g. State-directed APT cluster — prior attribution record"
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,background:'#fff',color:'#151C28',outline:'none'}} />
        </div>

        {/* Sector */}
        <div>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Target Sector
          </label>
          <select value={f.sector||''} onChange={e=>set('sector',e.target.value)}
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,background:'#fff',color:f.sector?'#151C28':'#94A3B8',outline:'none',appearance:'none'}}>
            <option value="">Select sector…</option>
            {SECTORS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Summary */}
        <div style={{gridColumn:'1/-1'}}>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Incident Summary *
          </label>
          <textarea value={f.summary||''} onChange={e=>set('summary',e.target.value)} rows={4}
            placeholder="Provide a factual operational summary of the incident…"
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,resize:'vertical',background:'#fff',color:'#151C28',outline:'none',lineHeight:1.6}} />
        </div>

        {/* Physical/functional effects */}
        <div style={{gridColumn:'1/-1'}}>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Physical / Functional Effects
          </label>
          <textarea value={f.effects||''} onChange={e=>set('effects',e.target.value)} rows={3}
            placeholder="Describe confirmed physical damage, functional disruption, duration, and affected population…"
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,resize:'vertical',background:'#fff',color:'#151C28',outline:'none',lineHeight:1.6}} />
        </div>

        {/* Attribution evidence */}
        <div style={{gridColumn:'1/-1'}}>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Attribution Evidence Summary
          </label>
          <textarea value={f.attribution||''} onChange={e=>set('attribution',e.target.value)} rows={3}
            placeholder="Summarize the evidentiary basis: TTP linkages, SIGINT, forensic analysis, allied-intelligence sharing, source reliability (Admiralty Code)…"
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,resize:'vertical',background:'#fff',color:'#151C28',outline:'none',lineHeight:1.6}} />
        </div>

        {/* Diplomatic/strategic context */}
        <div>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Diplomatic / Strategic Context
          </label>
          <textarea value={f.diplomaticContext||''} onChange={e=>set('diplomaticContext',e.target.value)} rows={3}
            placeholder="Bilateral relations, existing sanctions, alliance posture, escalation environment…"
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,resize:'vertical',background:'#fff',color:'#151C28',outline:'none',lineHeight:1.6}} />
        </div>

        {/* Legal notes */}
        <div>
          <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
            Legal Notes
          </label>
          <textarea value={f.legalNotes||''} onChange={e=>set('legalNotes',e.target.value)} rows={3}
            placeholder="Initial legal characterization, doctrinal issues, prior advisements…"
            style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'9px 12px',
              fontSize:13,resize:'vertical',background:'#fff',color:'#151C28',outline:'none',lineHeight:1.6}} />
        </div>

        {isUpdate && (
          <div style={{gridColumn:'1/-1'}}>
            <label style={{fontSize:11,fontWeight:700,color:'#4A5568',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em'}}>
              Update Notes — What Changed?
            </label>
            <textarea value={f.updateNotes||''} onChange={e=>set('updateNotes',e.target.value)} rows={2}
              placeholder="Briefly describe what new intelligence or facts prompted this update…"
              style={{width:'100%',border:'1.5px solid #1A3A5C',borderRadius:4,padding:'9px 12px',
                fontSize:13,resize:'vertical',background:'#EEF4FA',color:'#151C28',outline:'none',lineHeight:1.6}} />
          </div>
        )}
      </div>

      <div style={{marginTop:24,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Btn variant="ghost" icon={ChevronLeft} onClick={()=>dispatch({type:'SET_VIEW',view:'home'})}>
          Back to Registry
        </Btn>
        <Btn size="lg" icon={ArrowRight} iconR={ChevronRight} disabled={!canAdvance}
          onClick={()=>dispatch({type:'ADVANCE_CODING'})}>
          Proceed to Variable Coding
        </Btn>
      </div>
    </div>
  );
}

/* =========================================================================
   CODING VIEW — Step 2: Variable Coding + Legal Classification
   ========================================================================= */
const EV_CLUSTER_IDS  =["AC","IC","SDC"];
const SEV_CLUSTER_IDS =["SH","TC","CM","DD","CBS","CI"];
const CTX_CLUSTER_IDS =["RHP","AO","DPP","ED","ER","SVT"];

function CodingView({state,dispatch}) {
  const {draftVars:vars,draftLegalCat:catId,draftCat5:cat5,draftCat6:cat6,draftCaseId,draftVersionLabel}=state;
  const [openCluster,setOpenCluster]=useState('ev');
  const [versionLabel,setVersionLabel]=useState(draftVersionLabel||'Initial Assessment');

  // Live CoS preview (updates with every evidentiary variable change)
  const liveCoS=useMemo(()=>computeCoS(vars.AC,vars.IC,vars.SDC),[vars.AC,vars.IC,vars.SDC]);
  const liveK  =useMemo(()=>computeK(vars),[vars]);
  const liveS  =useMemo(()=>computeS(liveCoS,liveK),[liveCoS,liveK]);
  const liveBand=useMemo(()=>bandFromScore(liveS),[liveS]);
  const liveLLB =useMemo(()=>llbFromCategory(catId,cat5,cat6),[catId,cat5,cat6]);
  const liveERS =useMemo(()=>computeERS(vars),[vars]);

  const setVar=(id,v)=>dispatch({type:'SET_VAR',id,value:v});
  const cat=catById(catId);
  const isIAC=catId===10;

  return (
    <div className="sr-fade">
      <SectionHead icon={Layers}
        title="Variable Coding — Step 2 of 3"
        subtitle="Code each of the 15 SCREI variables using the operational definitions. The mathematical engine updates in real time."
        action={<Badge color="navy">Step 2 / 3</Badge>}
        border />

      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20,alignItems:'start'}}>
        {/* Left: variable clusters */}
        <div>
          {/* Version label input */}
          <div style={{marginBottom:16,padding:'12px 16px',background:'#F0EDE4',
            borderRadius:5,border:'1px solid #DDD8CC'}}>
            <label style={{fontSize:10,fontWeight:700,color:'#64748B',display:'block',
              marginBottom:5,textTransform:'uppercase',letterSpacing:'0.07em'}}>
              Assessment Label
            </label>
            <input value={versionLabel} onChange={e=>{setVersionLabel(e.target.value);dispatch({type:'SET_VERSION_LABEL',v:e.target.value})}}
              placeholder="e.g. Initial Assessment / Intelligence Update — SIGINT Corroboration"
              style={{width:'100%',border:'1.5px solid #DDD8CC',borderRadius:4,padding:'7px 10px',
                fontSize:12,background:'#fff',color:'#151C28',outline:'none'}} />
          </div>

          {/* Cluster A: Evidentiary */}
          <ClusterSection title="Evidentiary Cluster — Attribution Confidence"
            icon={Search} varIds={EV_CLUSTER_IDS} vars={vars} onChange={setVar}
            accent="#1A3A5C" open={openCluster==='ev'}
            onToggle={()=>setOpenCluster(o=>o==='ev'?null:'ev')} />

          {/* Cluster B: Severity & Target */}
          <ClusterSection title="Severity & Target Cluster"
            icon={ShieldAlert} varIds={SEV_CLUSTER_IDS} vars={vars} onChange={setVar}
            accent="#8C4A1E" open={openCluster==='sev'}
            onToggle={()=>setOpenCluster(o=>o==='sev'?null:'sev')} />

          {/* Cluster C: Strategic & Context */}
          <ClusterSection title="Strategic & Context Cluster"
            icon={Activity} varIds={CTX_CLUSTER_IDS} vars={vars} onChange={setVar}
            accent="#7D6225" open={openCluster==='ctx'}
            onToggle={()=>setOpenCluster(o=>o==='ctx'?null:'ctx')} />

          {/* Legal Classification */}
          <div style={{marginTop:20,border:'1px solid #E2DDD3',borderRadius:6,overflow:'hidden'}}>
            <div style={{padding:'12px 16px',background:'#F0EDE4',borderBottom:'1px solid #E2DDD3',
              display:'flex',alignItems:'center',gap:8}}>
              <Scale size={15} style={{color:'#7D6225'}} />
              <span style={{fontSize:13,fontWeight:700,color:'#151C28'}}>Legal Classification</span>
              <InfoTip title="Legal Classification" text="Select the primary legal category that best characterises the incident based on the evidentiary record. This determines the Legal Legitimacy Boundary (LLB) ceiling — the highest response band lawfully available under the applicable doctrine." />
            </div>
            <div style={{padding:16,background:'#fff'}}>
              {LEGAL_CATS.map(lc=>(
                <button key={lc.id} onClick={()=>dispatch({type:'SET_LEGAL_CAT',catId:lc.id})}
                  style={{width:'100%',textAlign:'left',padding:'10px 14px',marginBottom:8,
                    border:`1.5px solid ${catId===lc.id?'#2E5580':'#E2DDD3'}`,borderRadius:5,
                    background:catId===lc.id?'#EEF4FA':'#FAFAF8',cursor:'pointer',
                    transition:'border-color .15s,background .15s'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                    <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                      <div style={{width:16,height:16,borderRadius:'50%',border:`2px solid ${catId===lc.id?'#2E5580':'#C5BCAE'}`,
                        background:catId===lc.id?'#2E5580':'transparent',flexShrink:0,marginTop:1}} />
                      <div>
                        <div style={{fontSize:11.5,fontWeight:catId===lc.id?700:500,
                          color:catId===lc.id?'#0C1A30':'#333D4B'}}>
                          {lc.label}
                          {lc.contested && <span style={{fontSize:9,color:'#A6803D',marginLeft:4,fontWeight:700}}>⚑ CONTESTED</span>}
                        </div>
                        <div style={{fontSize:10,color:'#64748B',lineHeight:1.5,marginTop:2}}>{lc.threshold}</div>
                      </div>
                    </div>
                    {!lc.notScored && lc.llbN && (
                      <BandPill band={lc.llbN} size="sm" />
                    )}
                    {lc.notScored && <Badge color="red">IAC</Badge>}
                  </div>
                </button>
              ))}

              {/* Cat 5 & 6 gates (only shown for Cat 2-4) */}
              {[2,3,4].includes(catId) && (
                <div style={{marginTop:12,padding:'12px 14px',background:'#F0EDE4',
                  borderRadius:5,border:'1px solid #DDD8CC'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#4A5568',marginBottom:10,
                    textTransform:'uppercase',letterSpacing:'0.06em'}}>
                    Cross-Cutting Preconditions (§3.4)
                  </div>
                  <p style={{fontSize:10.5,color:'#64748B',marginBottom:12,lineHeight:1.6}}>
                    Categories 5–6 must both be independently satisfied before countermeasures (Band V) become
                    available. Without them, the LLB defaults to Band III (retorsion only).
                  </p>
                  {[
                    {key:'cat5',val:cat5,dispatch:'SET_CAT5',label:'Category 5 — Attributable state conduct',
                     desc:'Evidence meets the ARSIWA Art.8 effective-control or Art.4 organ-conduct standard.'},
                    {key:'cat6',val:cat6,dispatch:'SET_CAT6',label:'Category 6 — Countermeasure eligibility',
                     desc:'Prior notice given or urgency exception applies (Art.52); measures are reversible and proportionate.'},
                  ].map(gate=>(
                    <label key={gate.key} style={{display:'flex',gap:10,marginBottom:10,cursor:'pointer',alignItems:'flex-start'}}>
                      <div onClick={()=>dispatch({type:gate.dispatch,v:!gate.val})}
                        style={{width:18,height:18,borderRadius:3,flexShrink:0,marginTop:1,
                          border:`2px solid ${gate.val?'#3F6B4C':'#C5BCAE'}`,
                          background:gate.val?'#3F6B4C':'#fff',
                          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        {gate.val && <span style={{color:'#fff',fontSize:12,lineHeight:1}}>✓</span>}
                      </div>
                      <div>
                        <div style={{fontSize:11,fontWeight:600,color:'#151C28'}}>{gate.label}</div>
                        <div style={{fontSize:10,color:'#64748B',marginTop:2,lineHeight:1.5}}>{gate.desc}</div>
                      </div>
                    </label>
                  ))}
                  <div style={{marginTop:8,padding:'7px 10px',background:cat5&&cat6?'#E4EEE6':'#FFF3E0',
                    borderRadius:4,fontSize:10.5,color:cat5&&cat6?'#2F5A3D':'#8C5A1E',fontWeight:500}}>
                    {cat5&&cat6?'✓ LLB ceiling: Band V (countermeasures available)':'⚠ LLB ceiling: Band III (retorsion only — preconditions not met)'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: live score preview panel */}
        <div style={{position:'sticky',top:20}}>
          <Card pad={0} style={{overflow:'hidden'}}>
            <div style={{background:'#0C1A30',padding:'14px 16px',color:'#fff'}}>
              <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'0.1em',
                color:'#7ABCE8',marginBottom:4,fontWeight:700}}>Live Score Preview</div>
              <div style={{fontSize:11,color:'#93A8C0'}}>Updates as you code variables</div>
            </div>
            <div style={{padding:16}}>
              {/* CoS bar */}
              <div style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,alignItems:'center'}}>
                  <span style={{fontSize:10,fontWeight:700,color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                    Attribution Confidence (CoS)
                  </span>
                  <span style={{fontSize:16,fontWeight:700,color:liveCoS<30?'#7A1E28':liveCoS<60?'#A6803D':'#2F5A3D',
                    fontFamily:"'IBM Plex Mono',monospace"}}>{liveCoS.toFixed(1)}%</span>
                </div>
                <ProgressBar value={liveCoS} max={100}
                  color={liveCoS<30?'#7A1E28':liveCoS<60?'#A6803D':'#2E5580'} height={8} />
                {liveCoS===0 && <div style={{fontSize:9.5,color:'#7A1E28',marginTop:4}}>Zero attribution → Score anchors at 0 regardless of severity</div>}
              </div>

              {/* K composite */}
              <div style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontSize:10,fontWeight:700,color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.06em'}}>Severity / Context (K)</span>
                  <span style={{fontSize:16,fontWeight:700,color:'#2E5580',fontFamily:"'IBM Plex Mono',monospace"}}>{(liveK*100).toFixed(1)}%</span>
                </div>
                <ProgressBar value={liveK*100} max={100} color="#2E5580" height={8} />
              </div>

              {/* Master Score S */}
              <div style={{background:'#0C1A30',borderRadius:5,padding:'12px 14px',marginBottom:12,textAlign:'center'}}>
                <div style={{fontSize:9.5,color:'#7ABCE8',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4,fontWeight:700}}>Composite Score S</div>
                <div style={{fontSize:36,fontWeight:700,color:'#fff',fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>
                  {liveS.toFixed(2)}
                </div>
                <div style={{fontSize:10,color:'#93A8C0',marginTop:3}}>out of 100</div>
              </div>

              {/* Band indicator */}
              <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
                <BandPill band={liveBand} size="lg" showLabel />
              </div>

              {/* LLB */}
              {liveLLB && (
                <div style={{background:'#F5EDD5',borderRadius:4,padding:'8px 10px',marginBottom:10,textAlign:'center'}}>
                  <div style={{fontSize:9,color:'#7D6225',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2,fontWeight:700}}>LLB Ceiling</div>
                  <BandPill band={liveLLB} size="sm" showLabel />
                </div>
              )}
              {isIAC && (
                <AlertBox type="danger" icon={AlertTriangle} compact>
                  <strong>IAC flag:</strong> Category 10 places this incident outside SCREI's peacetime scoring envelope. Regime shifts to jus in bello.
                </AlertBox>
              )}

              {/* ERS preview */}
              <div style={{marginTop:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:9.5,fontWeight:600,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.06em'}}>Escalation Risk (ERS)</span>
                  <span style={{fontSize:13,fontWeight:700,color:liveERS>=70?'#7A1E28':liveERS>=50?'#A6803D':'#2F5A3D',
                    fontFamily:"'IBM Plex Mono',monospace"}}>{liveERS.toFixed(0)}</span>
                </div>
                <ProgressBar value={liveERS} max={100}
                  color={liveERS>=70?'#7A1E28':liveERS>=50?'#A6803D':'#3F6B4C'} height={6} />
                {liveERS>=70 && liveCoS<80 && (
                  <div style={{fontSize:9,color:'#7A1E28',marginTop:4}}>
                    ERS Override Rule may apply: high ERS + low CoS → downgrade 1 band
                  </div>
                )}
              </div>
            </div>

            {/* Coding scheme reference */}
            <div style={{borderTop:'1px solid #E2DDD3',padding:'10px 16px'}}>
              <div style={{fontSize:9.5,color:'#94A3B8',lineHeight:1.6}}>
                <strong style={{color:'#64748B'}}>Coding reference:</strong> Use Admiralty Code (A–F × 1–6)
                for IC. Effective control (Art.8) for SDC. Schmitt criteria for SH/TC threshold.
              </div>
            </div>
          </Card>

          {/* Advance button */}
          <div style={{marginTop:14}}>
            <Btn size="lg" style={{width:'100%',justifyContent:'center'}}
              icon={ChevronRight} disabled={isIAC}
              onClick={()=>dispatch({type:'ADVANCE_RESULTS'})}>
              Compute Full Analysis
            </Btn>
            {isIAC && <div style={{fontSize:10.5,color:'#7A1E28',textAlign:'center',marginTop:6}}>Category 10 — not scored under SCREI</div>}
            <Btn variant="ghost" style={{width:'100%',justifyContent:'center',marginTop:6}}
              icon={ChevronLeft} onClick={()=>dispatch({type:'SET_VIEW',view:'intake'})}>
              Back to Intake
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   RESULTS VIEW — Step 3: Full Analysis, Recommendation, Decision Basis
   ========================================================================= */
function ResultsView({state,dispatch}) {
  const c=state.cases.find(x=>x.id===state.activeCase);
  if (!c) return (
    <div style={{padding:40,textAlign:'center'}}>
      <p style={{color:'#64748B'}}>No active case. <button onClick={()=>dispatch({type:'SET_VIEW',view:'home'})} style={{color:'#2E5580',cursor:'pointer',background:'none',border:'none',fontWeight:600}}>Return to registry.</button></p>
    </div>
  );
  const latest=c.versions?.at(-1);
  const an=latest?.analysis;
  if (!an) return (
    <div style={{padding:40,textAlign:'center'}}>
      <AlertBox type="warning" icon={AlertTriangle}>
        This incident is classified as Category 10 (International Armed Conflict). SCREI does not score IAC incidents — the applicable framework is jus in bello.
      </AlertBox>
    </div>
  );

  const vars=latest.variables;
  const cat=catById(latest.legalCat);
  const fmt=d=>{try{return new Date(d).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return d}};

  return (
    <div className="sr-fade">
      {/* Case header */}
      <div style={{background:'#0C1A30',borderRadius:8,padding:'22px 28px',marginBottom:22,color:'#fff',
        borderLeft:`6px solid ${BAND_CLR[an.operativeBand]}`}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'0.12em',color:'#7ABCE8',
              marginBottom:6,fontWeight:700,display:'flex',alignItems:'center',gap:6}}>
              <Shield size={12}/> Analysis Report · Version {latest.versionNumber}
            </div>
            <h2 style={{fontFamily:"'Source Serif 4',serif",fontSize:20,fontWeight:700,
              color:'#fff',marginBottom:4,lineHeight:1.25}}>
              {c.intake?.title||'Untitled Incident'}
            </h2>
            <div style={{fontSize:11,color:'#7ABCE8',display:'flex',gap:12,flexWrap:'wrap'}}>
              <span>{c.intake?.affectedState}</span>
              <span>·</span>
              <span>{c.intake?.sector}</span>
              <span>·</span>
              <span>{fmt(c.intake?.date)}</span>
            </div>
          </div>
          <div style={{flexShrink:0,display:'flex',gap:8,flexWrap:'wrap',alignItems:'flex-start'}}>
            <Btn variant="ghost" size="sm" style={{color:'#E5EDF5',borderColor:'rgba(255,255,255,.2)'}}
              icon={History}
              onClick={()=>dispatch({type:'SET_VIEW',view:'history'})}>
              History ({c.versions.length}v)
            </Btn>
            <Btn size="sm" icon={TrendingUp}
              onClick={()=>dispatch({type:'UPDATE_CASE',caseId:c.id})}>
              Update Intelligence
            </Btn>
            <Btn variant="gold" size="sm" icon={Printer}
              onClick={()=>dispatch({type:'OPEN_BRIEF'})}>
              Executive Brief
            </Btn>
          </div>
        </div>
      </div>

      {/* Five-metric score row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:20}}>
        <Metric label="Confidence (CoS)" value={an.CoS} unit="%" size="md"
          color={an.CoS<30?'#7A1E28':an.CoS<60?'#A6803D':'#2F5A3D'}
          accent={an.CoS<30?'#7A1E28':an.CoS<60?'#A6803D':'#3F6B4C'}
          sub={an.CoS>=BAND_MIN_COS[an.operativeBand]?'Gate ✓':'Gate ⚠'}/>
        <Metric label="Composite Score S" value={an.S} size="md"
          color="#0C1A30" accent="#0C1A30" sub={`Band ${an.scoreBand}`}/>
        <Metric label="Escalation Risk" value={an.ERS} size="md"
          color={an.ERS>=70?'#7A1E28':an.ERS>=50?'#A6803D':'#2F5A3D'}
          accent={an.ERS>=70?'#7A1E28':an.ERS>=50?'#A6803D':'#3F6B4C'}
          sub={an.ersOverride?'Override Active':'No Override'}/>
        <Metric label="Response Stability" value={an.RSS} size="md"
          color={an.RSS<30?'#7A1E28':an.RSS<60?'#A6803D':'#2F5A3D'}
          accent={an.RSS<30?'#7A1E28':an.RSS<60?'#A6803D':'#3F6B4C'}
          sub={an.volatilityFlag?'⚠ Volatile':'Stable'}/>
        <div style={{background:BAND_BG[an.operativeBand],border:`1.5px solid ${BAND_CLR[an.operativeBand]}60`,
          borderRadius:5,padding:'14px 12px',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:BAND_CLR[an.operativeBand]}}/>
          <BandPill band={an.operativeBand} provisional={an.isProvisional} size="lg" />
          <div style={{fontSize:9,color:'#64748B',marginTop:6,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>
            {an.isProvisional?'Provisional':'Stable'} Recommendation
          </div>
        </div>
      </div>

      {/* Flags row */}
      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        {an.volatilityFlag && (
          <AlertBox type="warning" icon={AlertTriangle} compact>
            <strong>Decision Volatility Flag (RSS = {an.RSS.toFixed(1)}):</strong> Score is within {an.d.toFixed(1)} points of a band boundary.
            Operative action defaults to Band {an.operativeBand}; Band {an.pendingBand} is flagged as pending escalation
            contingent on RSS exceeding 30.
          </AlertBox>
        )}
        {an.ersOverride && (
          <AlertBox type="warning" icon={Lock} compact>
            <strong>ERS Override Active (ERS = {an.ERS.toFixed(0)}, CoS = {an.CoS.toFixed(1)}%):</strong> High escalation risk with
            sub-threshold confidence. Band downgraded from {an.overridedBand} to {an.operativeBand} pending additional corroboration.
          </AlertBox>
        )}
        {!an.cosGateSatisfied && (
          <AlertBox type="danger" icon={XCircle} compact>
            <strong>CoS Gate Warning:</strong> Attribution confidence ({an.CoS.toFixed(1)}%) is below the
            Band {an.operativeBand} minimum ({BAND_MIN_COS[an.operativeBand]}%). Independent verification required before escalation.
          </AlertBox>
        )}
        {an.llbN && bandIdx(an.scoreBand) > bandIdx(an.llbN) && (
          <AlertBox type="info" icon={Lock} compact>
            <strong>LLB Binding:</strong> Composite score (Band {an.scoreBand}) exceeds the Legal Legitimacy Boundary (Band {an.llbN}).
            Response is constrained to Band {an.llbN} by law, not by evidence.
          </AlertBox>
        )}
      </div>

      {/* Main 2-col: ladder + decomposition */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        {/* Escalation Ladder */}
        <Card pad={20}>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:'#0C1A30',marginBottom:2,
              fontFamily:"'Source Serif 4',serif"}}>Escalation Ladder</div>
            <div style={{fontSize:10.5,color:'#64748B'}}>
              Band {an.operativeBand} operative
              {an.llbN ? ` · LLB ceiling: Band ${an.llbN}` : ''}
              {an.isProvisional ? ` · Provisional (→ Band ${an.pendingBand} pending)` : ''}
            </div>
          </div>
          <EscalationLadder analysis={an} />
        </Card>

        {/* Score decomposition */}
        <Card pad={20}>
          <div style={{marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:'#0C1A30',marginBottom:2,
                fontFamily:"'Source Serif 4',serif"}}>Score Decomposition</div>
              <div style={{fontSize:10.5,color:'#64748B'}}>All 15 variables · weights · contributions</div>
            </div>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:10.5}}>
              <thead>
                <tr style={{background:'#F0EDE4'}}>
                  {['Var','Value','Weight','Contribution','Cluster'].map(h=>(
                    <th key={h} style={{padding:'5px 8px',textAlign:h==='Value'||h==='Weight'||h==='Contribution'?'right':'left',
                      fontSize:9,textTransform:'uppercase',letterSpacing:'0.06em',
                      color:'#64748B',fontWeight:700,borderBottom:'1px solid #E2DDD3'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Evidentiary cluster header */}
                <tr><td colSpan={5} style={{padding:'6px 8px',fontSize:9,fontWeight:700,color:'#1A3A5C',
                  background:'#EEF4FA',textTransform:'uppercase',letterSpacing:'0.07em'}}>
                  Evidentiary Cluster (CoS = {an.CoS.toFixed(2)}%)</td></tr>
                {EV_IDS.map(id=>{
                  const vd=varById(id);
                  const beta=BETA[id];
                  return (
                    <tr key={id} style={{borderBottom:'1px solid #F0EDE4'}}>
                      <td style={{padding:'5px 8px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:'#1A3A5C'}}>{id}</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace"}}>{vars[id]}/10</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace',",color:'#64748B'}}>β={beta.toFixed(4)}</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:'#1A3A5C',fontWeight:600}}>
                        ×{(Math.pow(vars[id]/10,beta)).toFixed(4)}
                      </td>
                      <td style={{padding:'5px 8px'}}><Badge color="blue">Evidentiary</Badge></td>
                    </tr>
                  );
                })}
                {/* Severity/Context cluster header */}
                <tr><td colSpan={5} style={{padding:'6px 8px',fontSize:9,fontWeight:700,color:'#8C4A1E',
                  background:'#FDF4EF',textTransform:'uppercase',letterSpacing:'0.07em'}}>
                  Severity & Context Cluster (K = {(an.K*100).toFixed(2)}%)</td></tr>
                {SEV_IDS.map(id=>{
                  const vd=varById(id);
                  const w=WK[id];
                  const contrib=an.contributions[id]||0;
                  return (
                    <tr key={id} style={{borderBottom:'1px solid #F0EDE4'}}>
                      <td style={{padding:'5px 8px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:'#8C4A1E'}}>{id}</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace"}}>{vars[id]}/10</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:'#64748B'}}>{(w*100).toFixed(2)}%</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:contrib>2?'#2F5A3D':contrib>0?'#64748B':'#94A3B8',fontWeight:contrib>2?700:400}}>
                        +{contrib.toFixed(3)}
                      </td>
                      <td style={{padding:'5px 8px'}}><Badge color={varById(id)?.cluster==='ctx'?'gold':'slate'}>{varById(id)?.cluster==='ctx'?'Context':'Severity'}</Badge></td>
                    </tr>
                  );
                })}
                {CTX_CLUSTER_IDS.map(id=>{
                  const w=WK[id];
                  const contrib=an.contributions[id]||0;
                  return (
                    <tr key={id} style={{borderBottom:'1px solid #F0EDE4'}}>
                      <td style={{padding:'5px 8px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:'#7D6225'}}>{id}</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace"}}>{vars[id]}/10</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:'#64748B'}}>{(w*100).toFixed(2)}%</td>
                      <td style={{padding:'5px 8px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:contrib>2?'#2F5A3D':contrib>0?'#64748B':'#94A3B8'}}>
                        +{contrib.toFixed(3)}
                      </td>
                      <td style={{padding:'5px 8px'}}><Badge color="gold">Context</Badge></td>
                    </tr>
                  );
                })}
                {/* Master Score row */}
                <tr style={{background:'#0C1A30',color:'#fff'}}>
                  <td colSpan={3} style={{padding:'8px',fontWeight:700,fontSize:12,fontFamily:"'IBM Plex Mono',monospace",color:'#7ABCE8'}}>
                    S = 100 × (CoS/100)^λ × K
                  </td>
                  <td colSpan={2} style={{padding:'8px',textAlign:'right',fontWeight:700,fontSize:13,fontFamily:"'IBM Plex Mono',monospace",color:'#fff'}}>
                    = {an.S.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Recommendation Card */}
      <Card pad={0} style={{marginBottom:20,overflow:'hidden',
        borderLeft:`5px solid ${BAND_CLR[an.operativeBand]}`}}>
        <div style={{background:BAND_BG[an.operativeBand],padding:'16px 22px',
          borderBottom:'1px solid #E2DDD3'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <Gavel size={18} style={{color:BAND_CLR[an.operativeBand]}} />
              <div>
                <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em',
                  color:BAND_CLR[an.operativeBand],fontWeight:700,marginBottom:2}}>
                  {an.isProvisional?'Provisional':'Stable'} Recommendation — Band {an.operativeBand}
                </div>
                <div style={{fontSize:18,fontWeight:700,color:'#0C1A30',fontFamily:"'Source Serif 4',serif"}}>
                  {an.primaryAction?.action||BAND_LABEL[an.operativeBand]}
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {an.isProvisional && (
                <Badge color="gold" size="sm">PROVISIONAL — Await RSS ≥ 30</Badge>
              )}
              {an.ersOverride && <Badge color="red" size="sm">ERS OVERRIDE</Badge>}
              {!an.cosGateSatisfied && <Badge color="red" size="sm">CoS GATE WARNING</Badge>}
              <Badge color={an.isStable?'green':'gold'} size="sm">
                {an.isStable?'STABLE':'VOLATILE'}
              </Badge>
            </div>
          </div>
        </div>
        <div style={{padding:'18px 22px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:'#64748B',textTransform:'uppercase',
                letterSpacing:'0.07em',marginBottom:6}}>Legal Basis</div>
              <div style={{fontSize:12,color:'#151C28',lineHeight:1.6}}>
                {an.primaryAction?.legal||BAND_LEGAL[an.operativeBand]}
              </div>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:'#64748B',textTransform:'uppercase',
                letterSpacing:'0.07em',marginBottom:6}}>Strategic Rationale</div>
              <div style={{fontSize:12,color:'#151C28',lineHeight:1.6}}>
                {an.primaryAction?.rationale||'—'}
              </div>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:'#64748B',textTransform:'uppercase',
                letterSpacing:'0.07em',marginBottom:6}}>Preconditions / Warnings</div>
              <div style={{fontSize:12,color:'#7A1E28',lineHeight:1.6}}>
                {an.primaryAction?.warning||'—'}
              </div>
            </div>
          </div>
          {an.pendingBand && (
            <div style={{marginTop:14,padding:'10px 14px',background:'#F5EDD5',
              borderRadius:4,border:'1px solid #DDD8CC'}}>
              <strong style={{fontSize:11,color:'#7D6225'}}>Pending escalation (volatility cleared): </strong>
              <span style={{fontSize:11,color:'#5A3E10'}}>
                Band {an.pendingBand} — {BAND_LABEL[an.pendingBand]} — will become operative once RSS ≥ 30.
                Monitor for additional attribution or forensic evidence.
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Legal Basis + Formulas + CI row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        {/* Legal Classification */}
        <Card pad={20}>
          <SectionHead icon={Scale} title="Legal Classification & LLB" border />
          <div style={{marginBottom:14,padding:'12px 14px',background:BAND_BG[an.operativeBand],
            borderRadius:5,border:`1px solid ${BAND_CLR[an.operativeBand]}30`}}>
            <div style={{fontSize:11,fontWeight:700,color:BAND_CLR[an.operativeBand],marginBottom:4}}>
              {cat?.label||'—'}
            </div>
            <div style={{fontSize:11,color:'#333D4B',lineHeight:1.6,marginBottom:6}}>
              <strong>Threshold:</strong> {cat?.threshold}
            </div>
            <div style={{fontSize:11,color:'#333D4B',lineHeight:1.6}}>
              <strong>LLB Note:</strong> {cat?.llbNote}
            </div>
            {cat?.contested && (
              <div style={{marginTop:6}}>
                <Badge color="gold">⚑ Doctrinally Contested</Badge>
              </div>
            )}
          </div>
          {[2,3,4].includes(latest.legalCat) && (
            <div style={{marginBottom:12,padding:'10px 12px',background:latest.cat5&&latest.cat6?'#E4EEE6':'#FFF3E0',
              borderRadius:4,border:'1px solid #E2DDD3'}}>
              <div style={{display:'flex',gap:12,fontSize:11}}>
                <span style={{color:latest.cat5?'#2F5A3D':'#7A1E28'}}>
                  {latest.cat5?'✓':'✗'} Category 5 (State attribution)
                </span>
                <span style={{color:latest.cat6?'#2F5A3D':'#7A1E28'}}>
                  {latest.cat6?'✓':'✗'} Category 6 (Countermeasure eligibility)
                </span>
              </div>
              <div style={{fontSize:10.5,color:'#64748B',marginTop:4}}>
                {latest.cat5&&latest.cat6
                  ?'Both preconditions satisfied — countermeasures available up to Band V'
                  :'Preconditions incomplete — LLB constrained to Band III (retorsion only)'}
              </div>
            </div>
          )}
          <FormulaBlock label="LLB Determination"
            formula={`FinalBand = min(Band(S), LLB(Category))`}
            computed={`= min(Band ${an.scoreBand}, Band ${an.llbN||'—'})`}
            result={`→ Band ${an.llbConstrainedBand} (LLB-constrained)`} />
          {an.ersOverride && (
            <FormulaBlock label="ERS Override Rule (§4.3)"
              formula={`if ERS ≥ 70 AND CoS < 80 → downgrade 1 band`}
              computed={`ERS = ${an.ERS.toFixed(1)}, CoS = ${an.CoS.toFixed(1)}%`}
              result={`Band ${an.llbConstrainedBand} → Band ${an.operativeBand} (override applied)`} />
          )}
          {an.volatilityFlag && (
            <FormulaBlock label="Decision Volatility (§4.3)"
              formula={`if RSS < 30 → operative = band − 1, status = PROVISIONAL`}
              computed={`RSS = ${an.RSS.toFixed(1)}, d_boundary = ${an.d.toFixed(2)}`}
              result={`Operative: Band ${an.operativeBand} (pending: Band ${an.pendingBand})`} />
          )}
        </Card>

        {/* Formulas & CI */}
        <Card pad={20}>
          <SectionHead icon={Activity} title="Analytical Basis & Confidence" border />
          <FormulaBlock label="Confidence Score (§4.1)"
            formula={`CoS = 100 × x_AC^0.4996 × x_IC^0.2366 × x_SDC^0.2637`}
            computed={`= 100 × (${vars.AC}/10)^0.4996 × (${vars.IC}/10)^0.2366 × (${vars.SDC}/10)^0.2637`}
            result={`CoS = ${an.CoS.toFixed(4)}%`} />
          <FormulaBlock label="Severity Composite K (§4.1)"
            formula={`K = Σ w_i × x_i  (12 severity/context variables)`}
            computed={`= ${SEV_IDS.concat(CTX_CLUSTER_IDS).map(id=>`${WK[id].toFixed(4)}×${(vars[id]/10).toFixed(1)}`).slice(0,3).join(' + ')} + …`}
            result={`K = ${an.K.toFixed(6)}`} />
          <FormulaBlock label="Master Score S (§4.1)"
            formula={`S = 100 × (CoS/100)^λ × K  (λ = ${LAMBDA})`}
            computed={`= 100 × (${an.CoS.toFixed(2)}/100)^1 × ${an.K.toFixed(4)}`}
            result={`S = ${an.S.toFixed(4)}`} />
          <FormulaBlock label="Escalation Risk Score (§4.3)"
            formula={`ERS = 100 × (6·ER + 5·AO + 4·ED + 4·DPP + 6·CBS + 5·SVT) / 300`}
            computed={`= 100 × (${6*vars.ER}+${5*vars.AO}+${4*vars.ED}+${4*vars.DPP}+${6*vars.CBS}+${5*vars.SVT}) / 300`}
            result={`ERS = ${an.ERS.toFixed(4)}`} />
          <FormulaBlock label="Response Stability Score (§4.3)"
            formula={`RSS = min(d_boundary, 10) × CoS / 10`}
            computed={`d = ${an.d.toFixed(4)} → min(${an.d.toFixed(4)},10) × ${an.CoS.toFixed(2)} / 10`}
            result={`RSS = ${an.RSS.toFixed(4)}`} />
          {/* Confidence interval */}
          <div style={{marginTop:12,padding:'12px 14px',background:'#EEF4FA',
            borderRadius:5,border:'1px solid #C5D8E8'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#1A3A5C',textTransform:'uppercase',
              letterSpacing:'0.07em',marginBottom:8}}>90% Confidence Interval (§10.2)</div>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:'#0C1A30',marginBottom:6}}>
              S = {an.S.toFixed(2)} ± {(1.645*an.seS).toFixed(2)}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <span style={{fontSize:10,color:'#64748B',minWidth:40}}>Lower</span>
              <div style={{flex:1,height:8,background:'#E2DDD3',borderRadius:4,position:'relative'}}>
                <div style={{position:'absolute',left:`${an.ciLow}%`,right:`${100-an.ciHigh}%`,
                  height:'100%',background:'#2E5580',borderRadius:4,opacity:.6}} />
              </div>
              <span style={{fontSize:10,color:'#64748B',minWidth:40,textAlign:'right'}}>Upper</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,fontFamily:"'IBM Plex Mono',monospace",color:'#2E5580',fontWeight:600}}>
              <span>{an.ciLow.toFixed(2)}</span>
              <span>{an.ciHigh.toFixed(2)}</span>
            </div>
            <div style={{fontSize:10,color:'#64748B',marginTop:4}}>
              δ = 1.5 (default elicitation uncertainty). CI spans {(an.ciHigh-an.ciLow).toFixed(1)} score points.
              {(an.ciHigh-an.ciLow)>15&&' Wide interval: result sensitive to evidentiary uncertainty.'}
            </div>
          </div>
        </Card>
      </div>

      {/* Variable Charts */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        <Card pad={20}>
          <div style={{fontSize:12,fontWeight:700,color:'#0C1A30',marginBottom:4,fontFamily:"'Source Serif 4',serif"}}>Variable Profile — Radar</div>
          <div style={{fontSize:10.5,color:'#64748B',marginBottom:14}}>All 15 SCREI variables · current coding</div>
          <VarRadar vars={vars} />
        </Card>
        <Card pad={20}>
          <div style={{fontSize:12,fontWeight:700,color:'#0C1A30',marginBottom:4,fontFamily:"'Source Serif 4',serif"}}>Severity/Context Contributions</div>
          <div style={{fontSize:10.5,color:'#64748B',marginBottom:14}}>Points contributed to S by each variable (top 12)</div>
          <ContribBar analysis={an} vars={vars} />
        </Card>
      </div>

      {/* Strategic Restraint note */}
      <Card pad={16} flat style={{background:'#F8F7F3',border:'1px solid #E2DDD3'}}>
        <div style={{display:'flex',gap:10}}>
          <Unlock size={14} style={{color:'#64748B',flexShrink:0,marginTop:1}} />
          <div style={{fontSize:11,color:'#64748B',lineHeight:1.65}}>
            <strong style={{color:'#333D4B'}}>Strategic restraint remains available at any score:</strong>{' '}
            Deliberate non-escalation is exercisable as sovereign discretion at any band level.
            If chosen, it must be a documented decision, not a default.
            The model does not penalise restraint; nor does it capture all reasons a state may choose not to escalate.
          </div>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   BRIEF VIEW — 3-page Executive Brief, print-optimised
   ========================================================================= */

/* Brief helper: page footer (appears on every page) */
function BriefFooter() {
  return (
    <div style={{position:'absolute',bottom:0,left:0,right:0,
      borderTop:'1px solid #C5BCAE',padding:'7px 24px',
      display:'flex',justifyContent:'space-between',alignItems:'center',
      background:'#FAFAF8'}}>
      <span style={{fontSize:8,color:'#64748B',fontFamily:"'IBM Plex Mono',monospace",letterSpacing:'0.04em'}}>
        Model: State Cyber Response Escalation Index (SCREI) &nbsp;|&nbsp; Creator: Ehab A.G Habila
      </span>
      <span style={{fontSize:8,color:'#94A3B8',fontFamily:"'IBM Plex Mono',monospace"}}>
        {new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
      </span>
    </div>
  );
}

/* Classification banner */
function ClassBanner() {
  return (
    <div style={{background:'#0C1A30',color:'#fff',padding:'6px 24px',
      display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:9,
      fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>
      <span>OFFICIAL SENSITIVE — DECISION BRIEF — FOR CRISIS CELL USE ONLY</span>
      <span style={{color:'#7ABCE8'}}>SCREI v1.0</span>
    </div>
  );
}

/* Page 1 — Immediate Decision Summary */
function BriefPage1({c,latest,an,cat}) {
  const fmt=d=>{try{return new Date(d).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return d}};
  const vars=latest.variables;
  return (
    <div className="brief-page" style={{
      width:'100%',minHeight:'267mm',position:'relative',paddingBottom:36,
      background:'#fff',fontFamily:"'IBM Plex Sans',sans-serif",boxSizing:'border-box'}}>
      <ClassBanner />

      {/* Page header */}
      <div style={{padding:'16px 24px 12px',borderBottom:'2px solid #0C1A30',
        display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,background:'#0C1A30',borderRadius:4,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Shield size={20} style={{color:'#A6803D'}} />
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:'#0C1A30',
              fontFamily:"'Source Serif 4',serif",lineHeight:1.1}}>
              State Cyber Response Escalation Index
            </div>
            <div style={{fontSize:9,color:'#64748B',marginTop:2,letterSpacing:'0.06em'}}>
              DECISION SUPPORT ANALYSIS — PAGE 1 OF 3 — IMMEDIATE DECISION SUMMARY
            </div>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:9,color:'#64748B'}}>Generated</div>
          <div style={{fontSize:10,fontWeight:600,color:'#0C1A30',fontFamily:"'IBM Plex Mono',monospace"}}>
            {new Date().toLocaleString('en-GB')}
          </div>
        </div>
      </div>

      <div style={{padding:'14px 24px'}}>
        {/* Incident metadata box */}
        <div style={{border:'1px solid #C5BCAE',borderRadius:5,marginBottom:14,overflow:'hidden'}}>
          <div style={{background:'#EEF0F3',padding:'7px 14px',fontSize:9,fontWeight:700,
            color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.09em'}}>
            Incident Record
          </div>
          <div style={{padding:'10px 14px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
            {[
              ['Incident Title',c.intake?.title||'—'],
              ['Affected State / Entity',c.intake?.affectedState||'—'],
              ['Target Sector',c.intake?.sector||'—'],
              ['Suspected Actor',c.intake?.suspectedActor||'—'],
              ['Incident Date',fmt(c.intake?.date)],
              ['Assessment Version',`Version ${latest.versionNumber} — ${latest.label}`],
            ].map(([k,v])=>(
              <div key={k} style={{marginBottom:2}}>
                <div style={{fontSize:8,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.07em'}}>{k}</div>
                <div style={{fontSize:10.5,color:'#0C1A30',fontWeight:500,lineHeight:1.4,marginTop:1}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL RECOMMENDED ACTION — most prominent element */}
        <div style={{border:`2px solid ${BAND_CLR[an.operativeBand]}`,borderRadius:6,
          marginBottom:14,overflow:'hidden',
          background:BAND_BG[an.operativeBand]}}>
          <div style={{background:BAND_CLR[an.operativeBand],padding:'8px 16px',
            display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:10,fontWeight:700,color:'#fff',textTransform:'uppercase',letterSpacing:'0.1em'}}>
              Final Recommended Action
            </span>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {an.isProvisional&&<span style={{fontSize:8,background:'rgba(255,255,255,.25)',color:'#fff',padding:'2px 6px',borderRadius:2,fontWeight:700,letterSpacing:'0.08em'}}>PROVISIONAL</span>}
              <span style={{fontSize:8,background:'rgba(255,255,255,.25)',color:'#fff',padding:'2px 6px',borderRadius:2,fontWeight:700,letterSpacing:'0.08em'}}>
                {an.isStable?'STABLE':'VOLATILE'}
              </span>
            </div>
          </div>
          <div style={{padding:'12px 16px'}}>
            <div style={{fontSize:20,fontWeight:700,color:BAND_CLR[an.operativeBand],
              fontFamily:"'Source Serif 4',serif",marginBottom:4}}>
              {an.primaryAction?.action||BAND_LABEL[an.operativeBand]}
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700,color:'#0C1A30',
                background:BAND_CLR[an.operativeBand]+'25',padding:'3px 10px',borderRadius:3}}>
                Band {an.operativeBand} — {BAND_LABEL[an.operativeBand]}
              </span>
              {an.pendingBand&&(
                <span style={{fontSize:10,color:'#7D6225',background:'#F5EDD5',padding:'2px 8px',borderRadius:3}}>
                  Pending escalation to Band {an.pendingBand} (RSS ≥ 30 required)
                </span>
              )}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div>
                <div style={{fontSize:8.5,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>Legal Basis</div>
                <div style={{fontSize:10.5,color:'#151C28',lineHeight:1.5}}>{an.primaryAction?.legal||BAND_LEGAL[an.operativeBand]}</div>
              </div>
              <div>
                <div style={{fontSize:8.5,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>Preconditions / Warnings</div>
                <div style={{fontSize:10.5,color:'#7A1E28',lineHeight:1.5}}>{an.primaryAction?.warning||'—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-metric grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8,marginBottom:14}}>
          {[
            {k:'Attribution Confidence',v:`${an.CoS.toFixed(1)}%`,sub:'CoS',c:an.CoS<30?'#7A1E28':an.CoS<60?'#A6803D':'#2F5A3D'},
            {k:'Composite Score S',v:`${an.S.toFixed(2)}`,sub:'/100',c:'#0C1A30'},
            {k:'LLB Ceiling',v:`Band ${an.llbN||'—'}`,sub:cat?.label?.split('—')[0].trim()||'',c:'#A6803D'},
            {k:'Escalation Risk',v:`${an.ERS.toFixed(0)}`,sub:'ERS',c:an.ERS>=70?'#7A1E28':an.ERS>=50?'#A6803D':'#2F5A3D'},
            {k:'Response Stability',v:`${an.RSS.toFixed(0)}`,sub:'RSS',c:an.RSS<30?'#7A1E28':'#2F5A3D'},
            {k:'Score Band',v:`Band ${an.scoreBand}`,sub:'(raw)',c:BAND_CLR[an.scoreBand]},
          ].map(m=>(
            <div key={m.k} style={{border:'1px solid #E2DDD3',borderRadius:4,padding:'8px 10px',textAlign:'center'}}>
              <div style={{fontSize:16,fontWeight:700,color:m.c,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>{m.v}</div>
              <div style={{fontSize:7.5,color:'#94A3B8',marginTop:2,fontWeight:600}}>{m.sub}</div>
              <div style={{fontSize:7.5,color:'#64748B',marginTop:1,lineHeight:1.3}}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Compact escalation ladder */}
        <div style={{border:'1px solid #E2DDD3',borderRadius:5,padding:'12px 14px',marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:700,color:'#64748B',textTransform:'uppercase',
            letterSpacing:'0.09em',marginBottom:8}}>Escalation Ladder — Current Position</div>
          <EscalationLadder analysis={an} compact printMode />
        </div>

        {/* Decision flags */}
        {(an.volatilityFlag||an.ersOverride||!an.cosGateSatisfied)&&(
          <div style={{border:'1px solid #DDD8CC',borderRadius:4,padding:'10px 14px',
            background:'#FFF8E7',marginBottom:14}}>
            <div style={{fontSize:9,fontWeight:700,color:'#7D6225',textTransform:'uppercase',
              letterSpacing:'0.09em',marginBottom:6}}>Decision Flags</div>
            {an.volatilityFlag&&<div style={{fontSize:10,color:'#7A1E28',marginBottom:3}}>⚠ Decision Volatility Active (RSS = {an.RSS.toFixed(1)} &lt; 30): Recommendation is provisional; model defaults to lower adjacent band.</div>}
            {an.ersOverride&&<div style={{fontSize:10,color:'#7A1E28',marginBottom:3}}>⚠ ERS Override Active: High escalation risk (ERS = {an.ERS.toFixed(0)}) with sub-threshold confidence (CoS = {an.CoS.toFixed(1)}%) — band downgraded one level.</div>}
            {!an.cosGateSatisfied&&<div style={{fontSize:10,color:'#7A1E28'}}>⚠ CoS Gate Warning: Attribution confidence ({an.CoS.toFixed(1)}%) is below Band {an.operativeBand} minimum ({BAND_MIN_COS[an.operativeBand]}%).</div>}
          </div>
        )}

        {/* Policy statement */}
        <div style={{background:'#F0EDE4',border:'1px solid #DDD8CC',borderRadius:4,
          padding:'8px 12px',fontSize:9.5,color:'#4A5568',lineHeight:1.6,fontStyle:'italic'}}>
          SCREI structures the judgment; it does not automate the decision. It is a decision-support model for crisis cells operating with incomplete information.
          The model is designed to be re-run as new intelligence arrives. The final decision remains with accountable human officials.
        </div>
      </div>
      <BriefFooter />
    </div>
  );
}

/* Page 2 — Analytical and Legal Basis */
function BriefPage2({c,latest,an,cat}) {
  const vars=latest.variables;
  const allRows=[
    ...EV_IDS.map(id=>({id,v:vars[id],w:BETA[id],isEv:true,contrib:Math.pow(vars[id]/10,BETA[id])})),
    ...SEV_IDS.map(id=>({id,v:vars[id],w:WK[id],contrib:an.contributions[id]||0})),
    ...CTX_CLUSTER_IDS.map(id=>({id,v:vars[id],w:WK[id],contrib:an.contributions[id]||0})),
  ];
  return (
    <div className="brief-page" style={{
      width:'100%',minHeight:'267mm',position:'relative',paddingBottom:36,
      background:'#fff',fontFamily:"'IBM Plex Sans',sans-serif",boxSizing:'border-box'}}>
      <ClassBanner />
      <div style={{padding:'14px 24px 12px',borderBottom:'1.5px solid #0C1A30',
        display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#0C1A30',fontFamily:"'Source Serif 4',serif"}}>
            Analytical and Legal Basis
          </div>
          <div style={{fontSize:8.5,color:'#64748B',letterSpacing:'0.06em',marginTop:1}}>
            PAGE 2 OF 3 — {c.intake?.title?.toUpperCase()||''}
          </div>
        </div>
        <BandPill band={an.operativeBand} provisional={an.isProvisional} />
      </div>

      <div style={{padding:'12px 24px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {/* Left column */}
        <div>
          {/* Legal classification */}
          <div style={{border:'1px solid #E2DDD3',borderRadius:4,marginBottom:12,overflow:'hidden'}}>
            <div style={{background:'#EEF0F3',padding:'6px 12px',fontSize:8.5,fontWeight:700,
              color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.08em'}}>Legal Classification</div>
            <div style={{padding:'10px 12px'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#0C1A30',marginBottom:4}}>{cat?.label||'—'}</div>
              <div style={{fontSize:9.5,color:'#333D4B',lineHeight:1.55,marginBottom:4}}><strong>Threshold:</strong> {cat?.threshold}</div>
              <div style={{fontSize:9.5,color:'#2F5A3D',lineHeight:1.55,marginBottom:4}}><strong>LLB Note:</strong> {cat?.llbNote}</div>
              {[2,3,4].includes(latest.legalCat)&&(
                <div style={{fontSize:9,color:'#64748B'}}>
                  Category 5 (Attribution): {latest.cat5?'✓ Satisfied':'✗ Not satisfied'} &nbsp;·&nbsp;
                  Category 6 (Countermeasures): {latest.cat6?'✓ Satisfied':'✗ Not satisfied'}
                </div>
              )}
              {cat?.contested&&<div style={{marginTop:4,fontSize:9,color:'#A6803D'}}>⚑ Doctrinally contested classification</div>}
            </div>
          </div>

          {/* Formulas */}
          <div style={{border:'1px solid #E2DDD3',borderRadius:4,marginBottom:12,overflow:'hidden'}}>
            <div style={{background:'#EEF0F3',padding:'6px 12px',fontSize:8.5,fontWeight:700,
              color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.08em'}}>Mathematical Basis</div>
            <div style={{padding:'10px 12px'}}>
              {[
                {l:'Confidence Score (§4.1)',f:`CoS = 100 × x\u1d00\u1d04^0.4996 × x\u1d09\u1d04^0.2366 × x\u209b\u1d05\u1d04^0.2637`,r:`= ${an.CoS.toFixed(3)}%`},
                {l:'Severity Composite (§4.1)',f:`K = \u03a3 w\u1d62 \u00d7 x\u1d62  (12 variables)`,r:`= ${an.K.toFixed(5)}`},
                {l:'Master Score S (§4.1)',f:`S = 100 \u00d7 (CoS/100)^\u03bb \u00d7 K  [\u03bb=1]`,r:`= ${an.S.toFixed(4)}`},
                {l:'Escalation Risk (§4.3)',f:`ERS = 100 \u00d7 (6\u00b7ER+5\u00b7AO+4\u00b7ED+4\u00b7DPP+6\u00b7CBS+5\u00b7SVT)/300`,r:`= ${an.ERS.toFixed(3)}`},
                {l:'Response Stability (§4.3)',f:`RSS = min(d\u1d47,10) \u00d7 CoS/10  [d=${an.d.toFixed(2)}]`,r:`= ${an.RSS.toFixed(3)}`},
              ].map(({l,f,r})=>(
                <div key={l} style={{marginBottom:8,padding:'6px 8px',background:'#F5F3EE',borderRadius:3,
                  borderLeft:'2px solid #C5BCAE'}}>
                  <div style={{fontSize:7.5,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',
                    letterSpacing:'0.07em',marginBottom:2}}>{l}</div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:'#1A2942',lineHeight:1.4}}>{f}</div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:'#0C1A30',fontWeight:700,marginTop:2}}>{r}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LLB logic */}
          <div style={{border:'1px solid #E2DDD3',borderRadius:4,overflow:'hidden'}}>
            <div style={{background:'#EEF0F3',padding:'6px 12px',fontSize:8.5,fontWeight:700,
              color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.08em'}}>LLB Determination</div>
            <div style={{padding:'10px 12px',fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,lineHeight:1.8,color:'#1A2942'}}>
              <div>FinalBand = min(Band(S), LLB(Category))</div>
              <div style={{color:'#64748B'}}>= min(Band {an.scoreBand}, Band {an.llbN||'—'})</div>
              <div style={{fontWeight:700}}>= Band {an.llbConstrainedBand}</div>
              {an.ersOverride&&<div style={{color:'#7A1E28',marginTop:4}}>ERS Override: Band {an.llbConstrainedBand} → Band {an.overridedBand}</div>}
              {an.volatilityFlag&&<div style={{color:'#7A1E28'}}>Volatility: Band {an.overridedBand} → Band {an.operativeBand} (provisional)</div>}
              <div style={{fontWeight:700,color:BAND_CLR[an.operativeBand],marginTop:2}}>Operative: Band {an.operativeBand}</div>
            </div>
          </div>
        </div>

        {/* Right column: score decomposition */}
        <div>
          <div style={{border:'1px solid #E2DDD3',borderRadius:4,overflow:'hidden',marginBottom:12}}>
            <div style={{background:'#EEF0F3',padding:'6px 12px',fontSize:8.5,fontWeight:700,
              color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.08em'}}>Score Decomposition — All 15 Variables</div>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:9.5}}>
              <thead>
                <tr style={{background:'#F0EDE4'}}>
                  {['Var','Cluster','Value','Weight','Contribution'].map(h=>(
                    <th key={h} style={{padding:'4px 6px',textAlign:h==='Value'||h==='Weight'||h==='Contribution'?'right':'left',
                      fontSize:7.5,textTransform:'uppercase',letterSpacing:'0.06em',
                      color:'#64748B',fontWeight:700,borderBottom:'1px solid #E2DDD3'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Evidentiary header */}
                <tr><td colSpan={5} style={{padding:'3px 6px',fontSize:7.5,fontWeight:700,color:'#1A3A5C',
                  background:'#EEF4FA',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                  Evidentiary Cluster → CoS = {an.CoS.toFixed(2)}%</td></tr>
                {EV_IDS.map(id=>(
                  <tr key={id} style={{borderBottom:'1px solid #F5F3EE'}}>
                    <td style={{padding:'3px 6px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,color:'#1A3A5C',fontSize:9}}>{id}</td>
                    <td style={{padding:'3px 6px',color:'#64748B',fontSize:8.5}}>Attribution</td>
                    <td style={{padding:'3px 6px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace"}}>{vars[id]}/10</td>
                    <td style={{padding:'3px 6px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:'#64748B'}}>β={BETA[id].toFixed(4)}</td>
                    <td style={{padding:'3px 6px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:'#1A3A5C',fontWeight:600}}>×{Math.pow(vars[id]/10,BETA[id]).toFixed(4)}</td>
                  </tr>
                ))}
                {/* Severity header */}
                <tr><td colSpan={5} style={{padding:'3px 6px',fontSize:7.5,fontWeight:700,color:'#8C4A1E',
                  background:'#FDF4EF',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                  Severity & Context Cluster → K = {(an.K*100).toFixed(2)}%</td></tr>
                {SEV_IDS.concat(CTX_CLUSTER_IDS).map(id=>{
                  const w=WK[id]; const contrib=an.contributions[id]||0;
                  const vd=varById(id);
                  return (
                    <tr key={id} style={{borderBottom:'1px solid #F5F3EE'}}>
                      <td style={{padding:'3px 6px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,color:vd?.cluster==='ctx'?'#7D6225':'#8C4A1E',fontSize:9}}>{id}</td>
                      <td style={{padding:'3px 6px',color:'#64748B',fontSize:8.5}}>{vd?.cluster==='ctx'?'Context':'Severity'}</td>
                      <td style={{padding:'3px 6px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace"}}>{vars[id]}/10</td>
                      <td style={{padding:'3px 6px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:'#64748B'}}>{(w*100).toFixed(2)}%</td>
                      <td style={{padding:'3px 6px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",color:contrib>2?'#2F5A3D':'#64748B',fontWeight:contrib>2?700:400}}>+{contrib.toFixed(3)}</td>
                    </tr>
                  );
                })}
                <tr style={{background:'#0C1A30',color:'#fff'}}>
                  <td colSpan={3} style={{padding:'5px 6px',fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:'#7ABCE8',fontWeight:700}}>S = 100 × (CoS/100) × K</td>
                  <td colSpan={2} style={{padding:'5px 6px',textAlign:'right',fontFamily:"'IBM Plex Mono',monospace",fontSize:11,fontWeight:700,color:'#fff'}}>{an.S.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CI */}
          <div style={{border:'1px solid #C5D8E8',borderRadius:4,padding:'10px 12px',background:'#EEF4FA'}}>
            <div style={{fontSize:8.5,fontWeight:700,color:'#1A3A5C',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>
              90% Confidence Interval (§10.2)  [δ = 1.5]
            </div>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:'#0C1A30',fontWeight:700}}>
              S = {an.S.toFixed(2)} ± {(1.645*an.seS).toFixed(2)}
            </div>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:'#64748B',marginTop:2}}>
              90% CI: [{an.ciLow.toFixed(2)}, {an.ciHigh.toFixed(2)}]  (width: {(an.ciHigh-an.ciLow).toFixed(2)} pts)
            </div>
            {(an.ciHigh-an.ciLow)>15&&(
              <div style={{fontSize:9,color:'#A6803D',marginTop:4}}>
                ⚠ Wide confidence interval. Recommendation is sensitive to evidentiary uncertainty.
              </div>
            )}
          </div>
        </div>
      </div>
      <BriefFooter />
    </div>
  );
}

/* Page 3 — Timeline, Visuals, Operational Guidance */
function BriefPage3({c,latest,an}) {
  const versions=c.versions||[];
  const fmt=d=>{try{return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}catch{return d}};
  const topContribs=SEV_IDS.concat(CTX_CLUSTER_IDS).map(id=>({
    id,name:varById(id)?.short||id,v:latest.variables[id]||0,contrib:an.contributions[id]||0,
  })).sort((a,b)=>b.contrib-a.contrib).slice(0,8);

  return (
    <div className="brief-page" style={{
      width:'100%',minHeight:'267mm',position:'relative',paddingBottom:36,
      background:'#fff',fontFamily:"'IBM Plex Sans',sans-serif",boxSizing:'border-box'}}>
      <ClassBanner />
      <div style={{padding:'14px 24px 12px',borderBottom:'1.5px solid #0C1A30',
        display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#0C1A30',fontFamily:"'Source Serif 4',serif"}}>
            Timeline, Visuals & Operational Guidance
          </div>
          <div style={{fontSize:8.5,color:'#64748B',letterSpacing:'0.06em',marginTop:1}}>
            PAGE 3 OF 3 — {c.intake?.title?.toUpperCase()||''}
          </div>
        </div>
        <BandPill band={an.operativeBand} provisional={an.isProvisional} />
      </div>

      <div style={{padding:'12px 24px'}}>
        {/* Version timeline */}
        <div style={{border:'1px solid #E2DDD3',borderRadius:4,marginBottom:14,overflow:'hidden'}}>
          <div style={{background:'#EEF0F3',padding:'6px 12px',fontSize:8.5,fontWeight:700,
            color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.08em'}}>
            Assessment Version Timeline
          </div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:9.5}}>
            <thead>
              <tr style={{background:'#F5F3EE'}}>
                {['Version','Date','Label','Band','S','CoS','ERS','RSS','Status'].map(h=>(
                  <th key={h} style={{padding:'4px 8px',textAlign:'left',fontSize:7.5,fontWeight:700,
                    color:'#94A3B8',textTransform:'uppercase',letterSpacing:'0.06em',borderBottom:'1px solid #E2DDD3'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {versions.map((v,i)=>{
                const va=v.analysis;
                return (
                  <tr key={v.id} style={{borderBottom:'1px solid #F0EDE4',
                    background:i===versions.length-1?BAND_BG[va?.operativeBand||'I']:'#fff'}}>
                    <td style={{padding:'4px 8px',fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>v{v.versionNumber}</td>
                    <td style={{padding:'4px 8px',color:'#64748B',fontFamily:"'IBM Plex Mono',monospace",whiteSpace:'nowrap'}}>{fmt(v.createdAt)}</td>
                    <td style={{padding:'4px 8px',color:'#333D4B',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.label}</td>
                    <td style={{padding:'4px 8px'}}>{va?<BandPill band={va.operativeBand} size="sm"/>:'IAC'}</td>
                    <td style={{padding:'4px 8px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{va?va.S.toFixed(2):'—'}</td>
                    <td style={{padding:'4px 8px',fontFamily:"'IBM Plex Mono',monospace",color:'#64748B'}}>{va?va.CoS.toFixed(1)+'%':'—'}</td>
                    <td style={{padding:'4px 8px',fontFamily:"'IBM Plex Mono',monospace",color:va?.ERS>=70?'#7A1E28':'#64748B'}}>{va?va.ERS.toFixed(0):'—'}</td>
                    <td style={{padding:'4px 8px',fontFamily:"'IBM Plex Mono',monospace",color:va?.RSS<30?'#A6803D':'#2F5A3D'}}>{va?va.RSS.toFixed(0):'—'}</td>
                    <td style={{padding:'4px 8px'}}>{va?<span style={{fontSize:8,color:va.isProvisional?'#A6803D':'#2F5A3D',fontWeight:700}}>{va.isProvisional?'PROV':'STABLE'}</span>:'—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Charts row */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
          {/* Score evolution (if >1 version) */}
          <div style={{border:'1px solid #E2DDD3',borderRadius:4,overflow:'hidden'}}>
            <div style={{background:'#EEF0F3',padding:'6px 12px',fontSize:8.5,fontWeight:700,
              color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.08em'}}>Score Evolution</div>
            <div style={{padding:'8px 4px'}}>
              {versions.length>=2
                ? <HistoryLineChart versions={versions} />
                : <div style={{height:120,display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:10,color:'#94A3B8'}}>Single version — no history to plot</div>
              }
            </div>
          </div>

          {/* Top contributions */}
          <div style={{border:'1px solid #E2DDD3',borderRadius:4,overflow:'hidden'}}>
            <div style={{background:'#EEF0F3',padding:'6px 12px',fontSize:8.5,fontWeight:700,
              color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.08em'}}>Top Variable Contributions</div>
            <div style={{padding:'8px 12px'}}>
              {topContribs.map((item,i)=>(
                <div key={item.id} style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                  <span style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,
                    color:'#2E5580',minWidth:30}}>{item.id}</span>
                  <div style={{flex:1,height:10,background:'#E2DDD3',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${Math.min(100,(item.contrib/Math.max(...topContribs.map(t=>t.contrib))||1)*100)}%`,
                      background:i<3?'#2E5580':i<6?'#4E7AB0':'#8AABCA',borderRadius:3}} />
                  </div>
                  <span style={{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",minWidth:36,
                    textAlign:'right',color:'#64748B'}}>{item.contrib.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational guidance */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
          <div style={{border:`1px solid ${BAND_CLR[an.operativeBand]}40`,borderRadius:4,
            background:BAND_BG[an.operativeBand],overflow:'hidden'}}>
            <div style={{background:BAND_CLR[an.operativeBand],padding:'6px 12px',fontSize:8.5,
              fontWeight:700,color:'#fff',textTransform:'uppercase',letterSpacing:'0.08em'}}>
              Operational Next Steps — Band {an.operativeBand}
            </div>
            <div style={{padding:'10px 12px'}}>
              {an.allActions.map((act,i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <div style={{fontSize:10,fontWeight:700,color:'#0C1A30',marginBottom:2}}>
                    {i+1}. {act.action}
                  </div>
                  <div style={{fontSize:9,color:'#333D4B',lineHeight:1.5,marginBottom:2}}>{act.rationale}</div>
                  <div style={{fontSize:9,color:'#7A1E28'}}><strong>Condition:</strong> {act.warning}</div>
                </div>
              ))}
              {an.pendingBand&&(
                <div style={{marginTop:10,padding:'7px 10px',background:'#F5EDD5',borderRadius:3,
                  border:'1px solid #DDD8CC',fontSize:9,color:'#5A3E10'}}>
                  <strong>Pending (RSS ≥ 30):</strong> Band {an.pendingBand} — {BAND_LABEL[an.pendingBand]} becomes operative once Response Stability threshold is cleared.
                </div>
              )}
            </div>
          </div>

          <div style={{border:'1px solid #E2DDD3',borderRadius:4,overflow:'hidden'}}>
            <div style={{background:'#EEF0F3',padding:'6px 12px',fontSize:8.5,fontWeight:700,
              color:'#4A5568',textTransform:'uppercase',letterSpacing:'0.08em'}}>
              Model Usage Guidance
            </div>
            <div style={{padding:'10px 12px',fontSize:9.5,color:'#333D4B',lineHeight:1.7}}>
              <div style={{marginBottom:6}}><strong style={{color:'#0C1A30'}}>Re-run trigger:</strong> Update the model when attribution confidence changes, new forensic evidence arrives, or the strategic context shifts materially.</div>
              <div style={{marginBottom:6}}><strong style={{color:'#0C1A30'}}>Stability:</strong> RSS {an.RSS.toFixed(0)} — {an.isStable?'recommendation is stable.':'recommendation is provisional; await evidentiary developments before executing.'}</div>
              <div style={{marginBottom:6}}><strong style={{color:'#0C1A30'}}>Legal ceiling:</strong> The LLB (Band {an.llbN}) is a hard legal constraint, not a policy preference. It may not be overridden by political pressure or severity of harm.</div>
              <div><strong style={{color:'#0C1A30'}}>Human authority:</strong> This analysis informs; it does not decide. Final authority rests with accountable human officials.</div>
            </div>
          </div>
        </div>

        {/* Attribution summary */}
        {c.intake?.attribution&&(
          <div style={{border:'1px solid #E2DDD3',borderRadius:4,padding:'10px 12px',fontSize:9.5,
            color:'#333D4B',lineHeight:1.6,background:'#FAFAF8'}}>
            <strong style={{color:'#0C1A30',display:'block',marginBottom:4,
              fontSize:8.5,textTransform:'uppercase',letterSpacing:'0.07em'}}>Attribution Evidence Record</strong>
            {c.intake.attribution}
          </div>
        )}
      </div>
      <BriefFooter />
    </div>
  );
}

/* BriefView — modal container with 3-page brief */
function BriefView({state,dispatch}) {
  const c=state.cases.find(x=>x.id===state.activeCase);
  if (!c||!state.briefOpen) return null;
  const latest=c.versions?.at(-1);
  const an=latest?.analysis;
  const cat=catById(latest?.legalCat);
  if (!an) return null;

  return (
    <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(8,15,30,.7)',
      display:'flex',flexDirection:'column',overflow:'auto'}} className="sr-noprint">
      {/* Brief toolbar */}
      <div className="sr-noprint" style={{background:'#0C1A30',padding:'12px 24px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        flexShrink:0,color:'#fff'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <FileText size={16} style={{color:'#A6803D'}} />
          <span style={{fontSize:13,fontWeight:700}}>Executive Decision Brief — {c.intake?.title?.slice(0,50)||'Incident'}</span>
        </div>
        <div style={{display:'flex',gap:10}}>
          <Btn variant="gold" icon={Printer} onClick={()=>window.print()}>Print as PDF</Btn>
          <Btn variant="ghost" style={{color:'#E5EDF5',borderColor:'rgba(255,255,255,.2)'}}
            icon={X} onClick={()=>dispatch({type:'CLOSE_BRIEF'})}>Close</Btn>
        </div>
      </div>

      {/* Brief instructions */}
      <div className="sr-noprint" style={{background:'#1A2942',padding:'8px 24px',fontSize:11,
        color:'#7ABCE8',textAlign:'center'}}>
        Click <strong>"Print as PDF"</strong> above and select "Save as PDF" in your print dialog.
        Optimised for A4. Three pages.
      </div>

      {/* Brief pages */}
      <div style={{flex:1,overflow:'auto',padding:'24px',display:'flex',flexDirection:'column',gap:16,alignItems:'center'}}>
        <div style={{width:'min(760px,100%)',boxShadow:'0 4px 24px rgba(0,0,0,.4)'}}>
          <BriefPage1 c={c} latest={latest} an={an} cat={cat} />
        </div>
        <div style={{width:'min(760px,100%)',boxShadow:'0 4px 24px rgba(0,0,0,.4)'}}>
          <BriefPage2 c={c} latest={latest} an={an} cat={cat} />
        </div>
        <div style={{width:'min(760px,100%)',boxShadow:'0 4px 24px rgba(0,0,0,.4)'}}>
          <BriefPage3 c={c} latest={latest} an={an} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   INTERNATIONALISATION SYSTEM — English (default), French, German
   Technical doctrinal terms, ARSIWA article references, and mathematical
   notation remain in English as per international legal practice.
   ========================================================================= */
const TRANSLATIONS = {
  en: {
    lang: { en:'English', fr:'French', de:'German', flag:{en:'EN',fr:'FR',de:'DE'} },
    nav: {
      platform:'Decision Support Platform',
      caseRegistry:'Case Registry',
      newIncident:'Register New Incident',
      activeCase:'Active Case',
      step1:'Incident Brief',
      step2:'Variable Coding',
      step3:'Analysis',
      execBrief:'Executive Brief',
      caseHistory:'Case History',
      about:'About the Model',
      admin:'Model Parameters',
      updateIntel:'Update Intelligence',
      loadDemo:'Load Demo Case',
    },
    common: {
      band:'Band',stable:'Stable',provisional:'Provisional',save:'Save',
      back:'Back',next:'Next',close:'Close',print:'Print as PDF',
      version:'Version',created:'Created',loading:'Loading…',
      confidence:'Confidence',score:'Score',recommendation:'Recommendation',
      volatile:'Volatile',legal:'Legal',classification:'Classification',
      ceiling:'Ceiling',override:'Override',gate:'Gate',
      compute:'Compute Analysis',pending:'Pending',status:'Status',
      generate:'Generate Executive Brief',update:'Update',delete:'Delete case',
      compare:'Compare versions',noHistory:'No prior versions',
      search:'Search',overview:'Overview',
    },
    home: {
      title:'State Cyber Response Escalation Index',
      subtitle:'SCREI is a legal-Bayesian decision-support framework for proportionate state response to international cyber incidents. It structures the judgment — it does not automate the decision.',
      stats:['Total Incidents','High-Risk (Band V+)','Provisional Recommendations','Stable Recommendations'],
      registry:'Incident Case Registry',
      registrySub:'Select a case to view the full analysis, or register a new incident.',
      empty:'No incidents registered',
      emptySub:'Register a new incident or load the demonstration case to begin.',
      policy:'SCREI structures the judgment; it does not automate the decision. It is a decision-support model for crisis cells operating with incomplete information. The model is designed to be re-run as new intelligence arrives. The final decision remains with accountable human officials.',
    },
    intake: {
      title:'Incident Registration',
      titleUpdate:'Intelligence Update — Incident Record',
      subtitle:'Register the incident facts. These anchor the structured variable coding in Step 2.',
      subtitleUpdate:'Update the incident record with new information before re-coding variables.',
      step:'Step 1 of 3',
      fields: {
        title:'Incident Title / Designation',
        date:'Incident Date / Time',
        affectedState:'Affected State / Entity',
        suspectedActor:'Suspected Actor',
        sector:'Target Sector',
        summary:'Incident Summary',
        effects:'Physical / Functional Effects',
        attribution:'Attribution Evidence Summary',
        diplomaticContext:'Diplomatic / Strategic Context',
        legalNotes:'Legal Notes',
        updateNotes:'Update Notes — What Changed?',
      },
      placeholders: {
        title:'e.g. Operation MERIDIAN — National Power Grid SCADA Intrusion',
        affectedState:'e.g. State A',
        suspectedActor:'e.g. State-directed APT cluster — prior attribution record',
        summary:'Provide a factual operational summary of the incident…',
        effects:'Describe confirmed physical damage, functional disruption, duration, and affected population…',
        attribution:'Summarize the evidentiary basis: TTP linkages, SIGINT, forensic analysis, allied-intelligence sharing, source reliability (Admiralty Code)…',
        diplomaticContext:'Bilateral relations, existing sanctions, alliance posture, escalation environment…',
        legalNotes:'Initial legal characterization, doctrinal issues, prior advisements…',
        updateNotes:'Briefly describe what new intelligence or facts prompted this update…',
      },
      advance:'Proceed to Variable Coding',
    },
    coding: {
      title:'Variable Coding',
      titleUpdate:'Variable Re-Coding — Intelligence Update',
      subtitle:'Code each of the 15 SCREI variables using the operational definitions. The mathematical engine updates in real time.',
      step:'Step 2 of 3',
      livePreview:'Live Score Preview',
      liveSubtitle:'Updates as you code variables',
      cos:'Attribution Confidence (CoS)',
      k:'Severity / Context (K)',
      masterScore:'Composite Score S',
      llbCeiling:'LLB Ceiling',
      ersPreview:'Escalation Risk (ERS)',
      clusters: {
        ev:'Evidentiary Cluster — Attribution Confidence',
        sev:'Severity & Target Cluster',
        ctx:'Strategic & Context Cluster',
        legal:'Legal Classification',
      },
      legalNote:'Select the primary legal category that best characterises the incident based on the evidentiary record. This determines the Legal Legitimacy Boundary (LLB) ceiling.',
      preconditions:'Cross-Cutting Preconditions (§3.4)',
      precondNote:'Categories 5–6 must both be independently satisfied before countermeasures (Band V) become available. Without them, the LLB defaults to Band III.',
      ersOverrideNote:'ERS Override Rule may apply: high ERS + low CoS → downgrade 1 band',
      compute:'Compute Full Analysis',
      iacNote:'Category 10 — not scored under SCREI',
      assessmentLabel:'Assessment Label',
      codingRef:'Coding reference: Use Admiralty Code (A–F × 1–6) for IC. Effective control (Art.8) for SDC. Schmitt criteria for SH/TC threshold.',
    },
    results: {
      title:'Analysis Report',
      subtitle:'Step 3 of 3 — Full Decision Analysis',
      updateIntel:'Update Intelligence',
      execBrief:'Executive Brief',
      history:'History',
      metrics:['Attribution Confidence','Composite Score S','Escalation Risk','Response Stability','Score Band'],
      flags: {
        volatility:'Decision Volatility Flag',
        ers:'ERS Override Active',
        cosGate:'CoS Gate Warning',
        llbBinding:'LLB Binding',
      },
      ladder:'Escalation Ladder',
      decomp:'Score Decomposition',
      recommendation:'Recommended Action',
      legalBasis:'Legal Classification & LLB',
      analytical:'Analytical Basis & Confidence',
      radar:'Variable Profile — Radar',
      contrib:'Severity/Context Contributions',
      restraint:'Strategic restraint remains available at any score: Deliberate non-escalation is exercisable as sovereign discretion at any band level. If chosen, it must be a documented decision, not a default.',
    },
    brief: {
      classification:'OFFICIAL SENSITIVE — DECISION BRIEF — FOR CRISIS CELL USE ONLY',
      page1:'IMMEDIATE DECISION SUMMARY',
      page2:'ANALYTICAL AND LEGAL BASIS',
      page3:'TIMELINE, VISUALS & OPERATIONAL GUIDANCE',
      footer:'Model: State Cyber Response Escalation Index (SCREI) | Creator: Ehab A.G Habila',
      action:'Final Recommended Action',
      incidentRecord:'Incident Record',
      nextSteps:'Operational Next Steps',
      guidance:'Model Usage Guidance',
      attribution:'Attribution Evidence Record',
      policy:'SCREI structures the judgment; it does not automate the decision. It is a decision-support model for crisis cells operating with incomplete information. The final decision remains with accountable human officials.',
    },
    bandLabels: {
      I:'Strategic Silence / Monitoring',
      II:'Private Diplomatic Démarche',
      III:'Public Attribution / Formal Protest',
      IV:'Sanctions / Coercive Response',
      V:'Proportionate Cyber Countermeasure',
      VI:'Collective Defense Coordination',
      VII:'Armed Response Review',
    },
    history: {
      title:'Case Version History',
      subtitle:'All assessment versions for this incident. Each re-run generates a new version.',
      compare:'Compare two versions',
      noCompare:'Select two versions to compare',
      scoreEvol:'Score Evolution',
      versionList:'Version Log',
      delta:'Δ from previous version',
    },
    about: {
      title:'About the Model',
      sections:['Overview','Mathematical Architecture','Legal Architecture','How to Use','Limitations','Creator'],
    },
    admin: {
      title:'Model Parameters',
      subtitle:'AHP-derived weights and engine constants from Habila (2026). Refinement must be re-derived by AHP/PCA and versioned.',
      beta:'Evidentiary Cluster Weights (β — Geometric Exponents)',
      wk:'Severity & Context Cluster Weights (w — Additive)',
      ers:'Escalation Risk Score Weights',
      params:'Engine Constants',
      doctrinal:'Doctrinal Certainty Reference Table (§3.3)',
    },
  },

  fr: {
    lang: { en:'Anglais', fr:'Français', de:'Allemand', flag:{en:'EN',fr:'FR',de:'DE'} },
    nav: {
      platform:'Plateforme d\'Aide à la Décision',
      caseRegistry:'Registre des Incidents',
      newIncident:'Enregistrer un Incident',
      activeCase:'Cas Actif',
      step1:'Fiche Incident',
      step2:'Codage des Variables',
      step3:'Analyse',
      execBrief:'Note Exécutive',
      caseHistory:'Historique du Cas',
      about:'À Propos du Modèle',
      admin:'Paramètres du Modèle',
      updateIntel:'Mise à Jour du Renseignement',
      loadDemo:'Charger le Cas Démo',
    },
    common: {
      band:'Bande',stable:'Stable',provisional:'Provisoire',save:'Enregistrer',
      back:'Retour',next:'Suivant',close:'Fermer',print:'Imprimer en PDF',
      version:'Version',created:'Créé le',loading:'Chargement…',
      confidence:'Confiance',score:'Score',recommendation:'Recommandation',
      volatile:'Volatile',legal:'Juridique',classification:'Classification',
      ceiling:'Plafond',override:'Substitution',gate:'Seuil',
      compute:'Calculer l\'Analyse',pending:'En Attente',status:'Statut',
      generate:'Générer la Note Exécutive',update:'Mettre à Jour',delete:'Supprimer le cas',
      compare:'Comparer les versions',noHistory:'Aucune version antérieure',
      search:'Rechercher',overview:'Vue d\'ensemble',
    },
    home: {
      title:'Indice d\'Escalade de la Réponse Cybernétique Étatique',
      subtitle:'Le SCREI est un cadre décisionnel juridico-bayésien pour une réponse étatique proportionnée aux incidents cyber internationaux. Il structure le jugement — il n\'automatise pas la décision.',
      stats:['Incidents Totaux','Risque Élevé (Bande V+)','Recommandations Provisoires','Recommandations Stables'],
      registry:'Registre des Incidents',
      registrySub:'Sélectionnez un cas pour consulter l\'analyse complète, ou enregistrez un nouvel incident.',
      empty:'Aucun incident enregistré',
      emptySub:'Enregistrez un nouvel incident ou chargez le cas de démonstration pour commencer.',
      policy:'Le SCREI structure le jugement ; il n\'automatise pas la décision. C\'est un modèle d\'aide à la décision conçu pour les cellules de crise opérant avec des informations incomplètes. Le modèle est conçu pour être recalculé à l\'arrivée de nouveaux renseignements. La décision finale appartient aux responsables officiels.',
    },
    intake: {
      title:'Enregistrement de l\'Incident',
      titleUpdate:'Mise à Jour du Renseignement — Fiche Incident',
      subtitle:'Enregistrez les faits de l\'incident. Ils ancrent le codage structuré des variables à l\'étape 2.',
      subtitleUpdate:'Mettez à jour la fiche incident avec les nouvelles informations avant de recoder les variables.',
      step:'Étape 1 sur 3',
      fields: {
        title:'Titre / Désignation de l\'Incident',
        date:'Date / Heure de l\'Incident',
        affectedState:'État / Entité Affecté(e)',
        suspectedActor:'Acteur Suspecté',
        sector:'Secteur Ciblé',
        summary:'Résumé de l\'Incident',
        effects:'Effets Physiques / Fonctionnels',
        attribution:'Résumé des Éléments d\'Attribution',
        diplomaticContext:'Contexte Diplomatique / Stratégique',
        legalNotes:'Notes Juridiques',
        updateNotes:'Notes de Mise à Jour — Qu\'est-ce qui a changé ?',
      },
      placeholders: {
        title:'ex. Opération MÉRIDIAN — Intrusion SCADA du Réseau Électrique National',
        affectedState:'ex. État A',
        suspectedActor:'ex. Groupe APT dirigé par un État — antécédents d\'attribution avérés',
        summary:'Fournissez un résumé opérationnel factuel de l\'incident…',
        effects:'Décrivez les dommages physiques confirmés, les perturbations fonctionnelles, la durée et la population affectée…',
        attribution:'Résumez la base probatoire : liens TTP, SIGINT, analyse forensique, partage de renseignements alliés, fiabilité des sources (Code Amirauté)…',
        diplomaticContext:'Relations bilatérales, sanctions existantes, posture d\'alliance, environnement d\'escalade…',
        legalNotes:'Caractérisation juridique initiale, questions doctrinales, avis préalables…',
        updateNotes:'Décrivez brièvement quels nouveaux renseignements ou faits ont motivé cette mise à jour…',
      },
      advance:'Passer au Codage des Variables',
    },
    coding: {
      title:'Codage des Variables',
      titleUpdate:'Recodage des Variables — Mise à Jour du Renseignement',
      subtitle:'Codez chacune des 15 variables SCREI selon les définitions opérationnelles. Le moteur mathématique se met à jour en temps réel.',
      step:'Étape 2 sur 3',
      livePreview:'Aperçu du Score en Direct',
      liveSubtitle:'Se met à jour lors du codage',
      cos:'Confiance d\'Attribution (CoS)',
      k:'Sévérité / Contexte (K)',
      masterScore:'Score Composite S',
      llbCeiling:'Plafond LLB',
      ersPreview:'Risque d\'Escalade (ERS)',
      clusters: {
        ev:'Cluster Probatoire — Confiance d\'Attribution',
        sev:'Cluster Sévérité & Cible',
        ctx:'Cluster Stratégique & Contextuel',
        legal:'Classification Juridique',
      },
      legalNote:'Sélectionnez la catégorie juridique principale qui caractérise le mieux l\'incident sur la base du dossier probatoire. Elle détermine le plafond de la Frontière de Légitimité Juridique (LLB).',
      preconditions:'Conditions Préalables Transversales (§3.4)',
      precondNote:'Les catégories 5 et 6 doivent toutes deux être satisfaites indépendamment avant que les contre-mesures (Bande V) ne soient disponibles.',
      ersOverrideNote:'La règle de substitution ERS peut s\'appliquer : ERS élevé + CoS faible → déclassement d\'une bande',
      compute:'Calculer l\'Analyse Complète',
      iacNote:'Catégorie 10 — non scoré sous SCREI',
      assessmentLabel:'Libellé de l\'Évaluation',
      codingRef:'Référence de codage : Utilisez le Code Amirauté (A–F × 1–6) pour IC. Contrôle effectif (Art.8) pour SDC. Critères Schmitt pour SH/TC.',
    },
    results: {
      title:'Rapport d\'Analyse',
      subtitle:'Étape 3 sur 3 — Analyse Décisionnelle Complète',
      updateIntel:'Mettre à Jour le Renseignement',
      execBrief:'Note Exécutive',
      history:'Historique',
      metrics:['Confiance d\'Attribution','Score Composite S','Risque d\'Escalade','Stabilité de la Réponse','Bande de Score'],
      flags: {
        volatility:'Indicateur de Volatilité Décisionnelle',
        ers:'Substitution ERS Active',
        cosGate:'Avertissement Seuil CoS',
        llbBinding:'Plafond LLB Contraignant',
      },
      ladder:'Échelle d\'Escalade',
      decomp:'Décomposition du Score',
      recommendation:'Action Recommandée',
      legalBasis:'Classification Juridique & LLB',
      analytical:'Base Analytique & Confiance',
      radar:'Profil des Variables — Radar',
      contrib:'Contributions Sévérité/Contexte',
      restraint:'La retenue stratégique reste disponible quel que soit le score : le non-escalade délibéré est exercisable à titre discrétionnaire souverain à tout niveau de bande. Si elle est choisie, elle doit constituer une décision documentée.',
    },
    brief: {
      classification:'SENSIBLE OFFICIEL — NOTE DE DÉCISION — RÉSERVÉ AUX CELLULES DE CRISE',
      page1:'RÉSUMÉ DÉCISIONNEL IMMÉDIAT',
      page2:'BASE ANALYTIQUE ET JURIDIQUE',
      page3:'CHRONOLOGIE, VISUELS ET ORIENTATIONS OPÉRATIONNELLES',
      footer:'Modèle : Indice d\'Escalade de la Réponse Cybernétique Étatique (SCREI) | Créateur : Ehab A.G Habila',
      action:'Action Recommandée Finale',
      incidentRecord:'Fiche Incident',
      nextSteps:'Prochaines Étapes Opérationnelles',
      guidance:'Guide d\'Utilisation du Modèle',
      attribution:'Dossier Probatoire d\'Attribution',
      policy:'Le SCREI structure le jugement ; il n\'automatise pas la décision. La décision finale appartient aux responsables officiels.',
    },
    bandLabels: {
      I:'Silence Stratégique / Surveillance',
      II:'Démarche Diplomatique Confidentielle',
      III:'Attribution Publique / Protestation Formelle',
      IV:'Sanctions / Réponse Coercitive',
      V:'Contre-Mesure Cyber Proportionnée',
      VI:'Coordination de la Défense Collective',
      VII:'Revue de la Riposte Armée',
    },
    history: {
      title:'Historique des Versions du Cas',
      subtitle:'Toutes les versions d\'évaluation pour cet incident. Chaque recalcul génère une nouvelle version.',
      compare:'Comparer deux versions',
      noCompare:'Sélectionnez deux versions à comparer',
      scoreEvol:'Évolution du Score',
      versionList:'Journal des Versions',
      delta:'Δ par rapport à la version précédente',
    },
    about: {
      title:'À Propos du Modèle',
      sections:['Vue d\'ensemble','Architecture Mathématique','Architecture Juridique','Mode d\'Emploi','Limites','Créateur'],
    },
    admin: {
      title:'Paramètres du Modèle',
      subtitle:'Pondérations dérivées par AHP et constantes du moteur issues de Habila (2026). Tout affinement doit être redérivé par AHP/ACP et versionné.',
      beta:'Pondérations du Cluster Probatoire (β — Exposants Géométriques)',
      wk:'Pondérations Sévérité & Contexte (w — Additif)',
      ers:'Pondérations du Score de Risque d\'Escalade',
      params:'Constantes du Moteur',
      doctrinal:'Table de Certitude Doctrinale (§3.3)',
    },
  },

  de: {
    lang: { en:'Englisch', fr:'Französisch', de:'Deutsch', flag:{en:'EN',fr:'FR',de:'DE'} },
    nav: {
      platform:'Entscheidungsunterstützungsplattform',
      caseRegistry:'Fallregister',
      newIncident:'Neuen Vorfall registrieren',
      activeCase:'Aktiver Fall',
      step1:'Vorfallbericht',
      step2:'Variablenkodierung',
      step3:'Analyse',
      execBrief:'Entscheidungsbericht',
      caseHistory:'Fallchronik',
      about:'Über das Modell',
      admin:'Modellparameter',
      updateIntel:'Nachrichtenaktualisierung',
      loadDemo:'Demonstrationsfall laden',
    },
    common: {
      band:'Band',stable:'Stabil',provisional:'Vorläufig',save:'Speichern',
      back:'Zurück',next:'Weiter',close:'Schließen',print:'Als PDF drucken',
      version:'Version',created:'Erstellt',loading:'Lädt…',
      confidence:'Konfidenz',score:'Score',recommendation:'Empfehlung',
      volatile:'Volatil',legal:'Rechtlich',classification:'Klassifizierung',
      ceiling:'Obergrenze',override:'Überschreibung',gate:'Schwellenwert',
      compute:'Vollanalyse berechnen',pending:'Ausstehend',status:'Status',
      generate:'Entscheidungsbericht erstellen',update:'Aktualisieren',delete:'Fall löschen',
      compare:'Versionen vergleichen',noHistory:'Keine früheren Versionen',
      search:'Suchen',overview:'Übersicht',
    },
    home: {
      title:'Staatlicher Cyber-Reaktions-Eskalationsindex',
      subtitle:'SCREI ist ein rechtlich-Bayessches Entscheidungsunterstützungsrahmenwerk für verhältnismäßige staatliche Reaktionen auf internationale Cyber-Vorfälle. Er strukturiert das Urteil — er automatisiert die Entscheidung nicht.',
      stats:['Vorfälle Gesamt','Hohes Risiko (Band V+)','Vorläufige Empfehlungen','Stabile Empfehlungen'],
      registry:'Vorfallsfallregister',
      registrySub:'Wählen Sie einen Fall zur vollständigen Analyse oder registrieren Sie einen neuen Vorfall.',
      empty:'Keine Vorfälle registriert',
      emptySub:'Registrieren Sie einen neuen Vorfall oder laden Sie den Demonstrationsfall.',
      policy:'SCREI strukturiert das Urteil; er automatisiert die Entscheidung nicht. Es handelt sich um ein Entscheidungsunterstützungsmodell für Krisenstäbe, die mit unvollständigen Informationen arbeiten. Das Modell ist so konzipiert, dass es bei Eingang neuer Erkenntnisse neu berechnet wird. Die endgültige Entscheidung verbleibt bei den zuständigen menschlichen Amtsträgern.',
    },
    intake: {
      title:'Vorfallregistrierung',
      titleUpdate:'Nachrichtenaktualisierung — Vorfallakte',
      subtitle:'Erfassen Sie die Vorfallsdaten. Diese bilden die Grundlage für die strukturierte Variablenkodierung in Schritt 2.',
      subtitleUpdate:'Aktualisieren Sie die Vorfallakte mit neuen Informationen vor der Neukodierung der Variablen.',
      step:'Schritt 1 von 3',
      fields: {
        title:'Vorfallstitel / Bezeichnung',
        date:'Vorfalldatum / -uhrzeit',
        affectedState:'Betroffener Staat / Einrichtung',
        suspectedActor:'Mutmaßlicher Akteur',
        sector:'Zielsektor',
        summary:'Vorfallszusammenfassung',
        effects:'Physische / Funktionale Auswirkungen',
        attribution:'Zusammenfassung der Zuordnungsnachweise',
        diplomaticContext:'Diplomatischer / Strategischer Kontext',
        legalNotes:'Rechtliche Anmerkungen',
        updateNotes:'Aktualisierungshinweise — Was hat sich geändert?',
      },
      placeholders: {
        title:'z.B. Operation MERIDIAN — SCADA-Einbruch ins nationale Stromnetz',
        affectedState:'z.B. Staat A',
        suspectedActor:'z.B. Staatlich gesteuertes APT-Cluster — frühere Zuordnungsnachweise',
        summary:'Geben Sie eine sachliche operative Zusammenfassung des Vorfalls…',
        effects:'Beschreiben Sie bestätigte Sachschäden, funktionale Störungen, Dauer und betroffene Bevölkerung…',
        attribution:'Fassen Sie die Beweisgrundlage zusammen: TTP-Verbindungen, SIGINT, forensische Analyse, nachrichtendienstliche Erkenntnisse, Zuverlässigkeit der Quellen (Admiralitätscode)…',
        diplomaticContext:'Bilaterale Beziehungen, bestehende Sanktionen, Bündnishaltung, Eskalationsumfeld…',
        legalNotes:'Erste rechtliche Charakterisierung, Doktrinprobleme, frühere Rechtsauffassungen…',
        updateNotes:'Beschreiben Sie kurz, welche neuen Erkenntnisse diese Aktualisierung veranlasst haben…',
      },
      advance:'Weiter zur Variablenkodierung',
    },
    coding: {
      title:'Variablenkodierung',
      titleUpdate:'Variablenneukodierung — Nachrichtenaktualisierung',
      subtitle:'Kodieren Sie jede der 15 SCREI-Variablen anhand der operativen Definitionen. Die mathematische Engine aktualisiert sich in Echtzeit.',
      step:'Schritt 2 von 3',
      livePreview:'Live-Score-Vorschau',
      liveSubtitle:'Aktualisiert sich bei der Kodierung',
      cos:'Zuordnungskonfidenz (CoS)',
      k:'Schwere / Kontext (K)',
      masterScore:'Gesamtscore S',
      llbCeiling:'LLB-Obergrenze',
      ersPreview:'Eskalationsrisiko (ERS)',
      clusters: {
        ev:'Beweiscluster — Zuordnungskonfidenz',
        sev:'Schwere- & Zielcluster',
        ctx:'Strategischer & Kontextueller Cluster',
        legal:'Rechtliche Klassifizierung',
      },
      legalNote:'Wählen Sie die primäre Rechtskategorie, die den Vorfall auf der Grundlage des Beweismaterials am besten charakterisiert. Diese bestimmt die Obergrenze der Rechtlichen Legitimitätsgrenze (LLB).',
      preconditions:'Übergreifende Voraussetzungen (§3.4)',
      precondNote:'Die Kategorien 5 und 6 müssen beide unabhängig voneinander erfüllt sein, bevor Gegenmaßnahmen (Band V) verfügbar werden.',
      ersOverrideNote:'ERS-Überschreibungsregel kann gelten: hohes ERS + niedriges CoS → Abstufung um ein Band',
      compute:'Vollanalyse berechnen',
      iacNote:'Kategorie 10 — nicht bewertet unter SCREI',
      assessmentLabel:'Bewertungsbezeichnung',
      codingRef:'Kodierungsreferenz: Admiralitätscode (A–F × 1–6) für IC. Effektive Kontrolle (Art.8) für SDC. Schmitt-Kriterien für SH/TC.',
    },
    results: {
      title:'Analysebericht',
      subtitle:'Schritt 3 von 3 — Vollständige Entscheidungsanalyse',
      updateIntel:'Nachrichtenaktualisierung',
      execBrief:'Entscheidungsbericht',
      history:'Chronik',
      metrics:['Zuordnungskonfidenz','Gesamtscore S','Eskalationsrisiko','Reaktionsstabilität','Score-Band'],
      flags: {
        volatility:'Entscheidungsvolatilitätsflag',
        ers:'ERS-Überschreibung aktiv',
        cosGate:'CoS-Schwellenwert-Warnung',
        llbBinding:'LLB bindend',
      },
      ladder:'Eskalationsleiter',
      decomp:'Score-Zerlegung',
      recommendation:'Empfohlene Maßnahme',
      legalBasis:'Rechtliche Klassifizierung & LLB',
      analytical:'Analytische Grundlage & Konfidenz',
      radar:'Variablenprofil — Radar',
      contrib:'Schwere-/Kontextbeiträge',
      restraint:'Strategische Zurückhaltung ist bei jedem Score verfügbar: Bewusste Nicht-Eskalation ist als souveräne Ermessensentscheidung auf jeder Bandebene möglich. Falls gewählt, muss sie eine dokumentierte Entscheidung sein.',
    },
    brief: {
      classification:'AMTLICH VERTRAULICH — ENTSCHEIDUNGSBERICHT — NUR FÜR KRISENSTÄBE',
      page1:'SOFORTIGE ENTSCHEIDUNGSZUSAMMENFASSUNG',
      page2:'ANALYTISCHE UND RECHTLICHE GRUNDLAGE',
      page3:'CHRONOLOGIE, VISUALISIERUNGEN UND OPERATIVE HINWEISE',
      footer:'Modell: Staatlicher Cyber-Reaktions-Eskalationsindex (SCREI) | Ersteller: Ehab A.G Habila',
      action:'Endgültig Empfohlene Maßnahme',
      incidentRecord:'Vorfallsakte',
      nextSteps:'Operative Nächste Schritte',
      guidance:'Modellnutzungshinweise',
      attribution:'Zuordnungsnachweis-Register',
      policy:'SCREI strukturiert das Urteil; er automatisiert die Entscheidung nicht. Die endgültige Entscheidung verbleibt bei den zuständigen menschlichen Amtsträgern.',
    },
    bandLabels: {
      I:'Strategisches Schweigen / Beobachtung',
      II:'Vertrauliche Diplomatische Démarche',
      III:'Öffentliche Zurechnung / Formeller Protest',
      IV:'Sanktionen / Zwangsreaktion',
      V:'Verhältnismäßige Cyber-Gegenmaßnahme',
      VI:'Koordinierung der Kollektiven Verteidigung',
      VII:'Überprüfung der Bewaffneten Reaktion',
    },
    history: {
      title:'Fallversionschronik',
      subtitle:'Alle Bewertungsversionen für diesen Vorfall. Jede Neuberechnung erzeugt eine neue Version.',
      compare:'Zwei Versionen vergleichen',
      noCompare:'Wählen Sie zwei Versionen zum Vergleich aus',
      scoreEvol:'Score-Entwicklung',
      versionList:'Versionsprotokoll',
      delta:'Δ gegenüber der Vorgängerversion',
    },
    about: {
      title:'Über das Modell',
      sections:['Übersicht','Mathematische Architektur','Rechtliche Architektur','Anwendung','Einschränkungen','Ersteller'],
    },
    admin: {
      title:'Modellparameter',
      subtitle:'AHP-abgeleitete Gewichtungen und Engine-Konstanten aus Habila (2026). Jede Verfeinerung muss durch AHP/PCA neu abgeleitet und versioniert werden.',
      beta:'Beweiscluster-Gewichtungen (β — Geometrische Exponenten)',
      wk:'Schwere- & Kontext-Gewichtungen (w — Additiv)',
      ers:'Eskalationsrisiko-Score-Gewichtungen',
      params:'Engine-Konstanten',
      doctrinal:'Doktrinäre Sicherheitstabelle (§3.3)',
    },
  },
};

function getT(lang) { return TRANSLATIONS[lang] || TRANSLATIONS.en; }

/* =========================================================================
   HISTORY VIEW
   ========================================================================= */
function HistoryView({state,dispatch,lang}) {
  const T=getT(lang);
  const c=state.cases.find(x=>x.id===state.activeCase);
  const [selVers,setSelVers]=useState([]);

  if (!c) return (
    <div style={{padding:40,textAlign:'center',color:'#64748B'}}>
      {T.history.title} — {T.common.back}
    </div>
  );
  const versions=c.versions||[];
  const fmt=d=>{try{return new Date(d).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return d}};

  const toggleSel=(id)=>{
    if (selVers.includes(id)) setSelVers(selVers.filter(x=>x!==id));
    else if (selVers.length<2) setSelVers([...selVers,id]);
    else setSelVers([selVers[1],id]);
  };

  const compareA=selVers.length===2?versions.find(v=>v.id===selVers[0]):null;
  const compareB=selVers.length===2?versions.find(v=>v.id===selVers[1]):null;

  const deltaColor=(a,b)=>b>a?'#2F5A3D':b<a?'#7A1E28':'#64748B';
  const deltaSign=(a,b)=>b>a?'+':'';

  return (
    <div className="sr-fade">
      <SectionHead icon={History} title={T.history.title}
        subtitle={T.history.subtitle}
        action={
          <Btn size="sm" icon={ChevronLeft}
            onClick={()=>dispatch({type:'SET_VIEW',view:'results'})}>
            {T.common.back}
          </Btn>
        }
        border />

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        {/* Score evolution chart */}
        <Card pad={20}>
          <div style={{fontSize:13,fontWeight:700,color:'#0C1A30',marginBottom:4,
            fontFamily:"'Source Serif 4',serif"}}>{T.history.scoreEvol}</div>
          <div style={{fontSize:10.5,color:'#64748B',marginBottom:14}}>
            {c.intake?.title?.slice(0,50)} · {versions.length} {T.common.version.toLowerCase()}(s)
          </div>
          <HistoryLineChart versions={versions} />
        </Card>

        {/* Version summary metrics */}
        <Card pad={20}>
          <div style={{fontSize:13,fontWeight:700,color:'#0C1A30',marginBottom:12,
            fontFamily:"'Source Serif 4',serif"}}>{T.history.versionList}</div>
          {versions.map((v,i)=>{
            const an=v.analysis;
            const prev=i>0?versions[i-1].analysis:null;
            const isSelected=selVers.includes(v.id);
            return (
              <div key={v.id}
                onClick={()=>toggleSel(v.id)}
                style={{cursor:'pointer',padding:'12px 14px',marginBottom:8,
                  border:`1.5px solid ${isSelected?BAND_CLR[an?.operativeBand||'I']:'#E2DDD3'}`,
                  borderRadius:5,background:isSelected?BAND_BG[an?.operativeBand||'I']:'#FAFAF8',
                  transition:'border-color .15s,background .15s'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:22,height:22,borderRadius:4,
                      background:isSelected?BAND_CLR[an?.operativeBand||'I']:'#E2DDD3',
                      display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <span style={{fontSize:9,fontWeight:700,color:isSelected?'#fff':'#64748B'}}>
                        v{v.versionNumber}
                      </span>
                    </div>
                    <div>
                      <div style={{fontSize:11.5,fontWeight:700,color:'#0C1A30'}}>{v.label}</div>
                      <div style={{fontSize:10,color:'#64748B'}}>{fmt(v.createdAt)}</div>
                    </div>
                  </div>
                  {an && <BandPill band={an.operativeBand} provisional={an.isProvisional} size="sm" />}
                </div>
                {an && (
                  <div style={{marginTop:8,display:'flex',gap:12,fontSize:10,
                    fontFamily:"'IBM Plex Mono',monospace",flexWrap:'wrap'}}>
                    <span>S={an.S.toFixed(2)}</span>
                    <span>CoS={an.CoS.toFixed(1)}%</span>
                    <span>ERS={an.ERS.toFixed(0)}</span>
                    <span>RSS={an.RSS.toFixed(0)}</span>
                    {prev && (
                      <span style={{color:deltaColor(prev.S,an.S),fontWeight:700}}>
                        {deltaSign(prev.S,an.S)}{(an.S-prev.S).toFixed(2)} ΔS
                      </span>
                    )}
                  </div>
                )}
                {v.updateNotes && (
                  <div style={{marginTop:6,fontSize:10,color:'#64748B',lineHeight:1.5,
                    borderTop:'1px solid #E2DDD3',paddingTop:5,fontStyle:'italic'}}>
                    {v.updateNotes}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{fontSize:10,color:'#94A3B8',textAlign:'center',marginTop:4}}>
            {selVers.length===0 && T.history.compare}
            {selVers.length===1 && 'Select one more version to compare'}
            {selVers.length===2 && `Comparing v${versions.find(v=>v.id===selVers[0])?.versionNumber} and v${versions.find(v=>v.id===selVers[1])?.versionNumber}`}
          </div>
        </Card>
      </div>

      {/* Side-by-side comparison */}
      {compareA && compareB && (
        <Card pad={0} style={{overflow:'hidden'}}>
          <div style={{background:'#0C1A30',padding:'12px 20px',color:'#fff',
            display:'flex',alignItems:'center',gap:10}}>
            <History size={14} style={{color:'#A6803D'}} />
            <span style={{fontSize:13,fontWeight:700}}>
              Version Comparison — v{compareA.versionNumber} vs v{compareB.versionNumber}
            </span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
            {[compareA,compareB].map((v,i)=>{
              const an=v.analysis;
              return (
                <div key={v.id} style={{padding:'20px',borderRight:i===0?'1px solid #E2DDD3':'none'}}>
                  <div style={{marginBottom:14}}>
                    <BandPill band={an?.operativeBand} provisional={an?.isProvisional} size="lg" />
                    <div style={{fontSize:12,fontWeight:700,color:'#0C1A30',marginTop:8,marginBottom:2}}>
                      {v.label}
                    </div>
                    <div style={{fontSize:10,color:'#64748B'}}>{fmt(v.createdAt)}</div>
                  </div>
                  {an && (
                    <>
                      {[
                        {k:'CoS',v:an.CoS.toFixed(2)+'%'},
                        {k:'S',v:an.S.toFixed(4)},
                        {k:'K',v:(an.K*100).toFixed(4)+'%'},
                        {k:'ERS',v:an.ERS.toFixed(2)},
                        {k:'RSS',v:an.RSS.toFixed(2)},
                        {k:'CI',v:`[${an.ciLow.toFixed(1)}, ${an.ciHigh.toFixed(1)}]`},
                      ].map(m=>(
                        <div key={m.k} style={{display:'flex',justifyContent:'space-between',
                          padding:'5px 0',borderBottom:'1px solid #F0EDE4'}}>
                          <span style={{fontSize:10.5,color:'#64748B',fontFamily:"'IBM Plex Mono',monospace"}}>{m.k}</span>
                          <span style={{fontSize:10.5,fontWeight:600,fontFamily:"'IBM Plex Mono',monospace"}}>{m.v}</span>
                        </div>
                      ))}
                      <div style={{marginTop:10}}>
                        <div style={{fontSize:9,color:'#64748B',textTransform:'uppercase',
                          letterSpacing:'0.07em',marginBottom:6,fontWeight:700}}>Evidentiary Variables</div>
                        {EV_IDS.map(id=>(
                          <div key={id} style={{display:'flex',justifyContent:'space-between',
                            padding:'3px 0',fontSize:10}}>
                            <span style={{color:'#1A3A5C',fontWeight:600,fontFamily:"'IBM Plex Mono',monospace"}}>{id}</span>
                            <span style={{fontFamily:"'IBM Plex Mono',monospace"}}>{v.variables[id]}/10</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {/* Delta row */}
          {compareA.analysis && compareB.analysis && (
            <div style={{background:'#F0EDE4',padding:'12px 20px',borderTop:'1px solid #E2DDD3'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#64748B',textTransform:'uppercase',
                letterSpacing:'0.07em',marginBottom:8}}>{T.history.delta}</div>
              <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                {[
                  {k:'ΔS',a:compareA.analysis.S,b:compareB.analysis.S,fmt:x=>x.toFixed(2)},
                  {k:'ΔCoS',a:compareA.analysis.CoS,b:compareB.analysis.CoS,fmt:x=>x.toFixed(1)+'%'},
                  {k:'ΔERS',a:compareA.analysis.ERS,b:compareB.analysis.ERS,fmt:x=>x.toFixed(1)},
                  {k:'ΔRSS',a:compareA.analysis.RSS,b:compareB.analysis.RSS,fmt:x=>x.toFixed(1)},
                ].map(m=>{
                  const d=m.b-m.a;
                  return (
                    <div key={m.k} style={{textAlign:'center'}}>
                      <div style={{fontSize:9,color:'#64748B',fontFamily:"'IBM Plex Mono',monospace"}}>{m.k}</div>
                      <div style={{fontSize:16,fontWeight:700,
                        color:deltaColor(m.a,m.b),fontFamily:"'IBM Plex Mono',monospace"}}>
                        {d>0?'+':''}{m.fmt(d)}
                      </div>
                    </div>
                  );
                })}
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:9,color:'#64748B',fontFamily:"'IBM Plex Mono',monospace"}}>ΔBand</div>
                  <div style={{fontSize:13,fontWeight:700,marginTop:2}}>
                    {compareA.analysis.operativeBand} → {compareB.analysis.operativeBand}
                    {compareA.analysis.operativeBand!==compareB.analysis.operativeBand&&
                      <span style={{marginLeft:6,fontSize:10,color:'#7A1E28'}}>CHANGED</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {!compareA&&!compareB&&versions.length<2&&(
        <AlertBox type="info" icon={Info}>{T.common.noHistory}</AlertBox>
      )}
    </div>
  );
}

/* =========================================================================
   ABOUT VIEW — Model documentation + creator details
   ========================================================================= */
const DOCTRINAL_CERTAINTY=[
  {prop:'A cyber operation causing scale-and-effects comparable to kinetic force is a "use of force"',status:'Dominant doctrinal interpretation (Tallinn Manual 2.0, Rules 68–69; Schmitt criteria)'},
  {prop:'Armed attack requires the Nicaragua "most grave forms" gravity threshold',status:'Black-letter / ICJ-established'},
  {prop:'Sovereignty is an independently binding primary rule breached by non-destructive intrusion',status:'Contested — majority doctrine and France / UK position'},
  {prop:'Non-intervention requires coercion on the domaine réservé',status:'Black-letter (Nicaragua, 1986)'},
  {prop:'"Effective control," not the ICTY\'s "overall control," is the state-responsibility attribution test',status:'Black-letter / ICJ-established (Nicaragua; Bosnian Genocide, 2007)'},
  {prop:'Third-party (non-injured-state) collective countermeasures are lawful',status:'Contested / emerging practice (ARSIWA Art. 54 leaves the question open)'},
  {prop:'A cyber-only operation can itself satisfy the Art. 51 armed-attack threshold',status:'Dominant doctrinal interpretation; untested in state practice'},
  {prop:'A freestanding binding rule specially protects "critical infrastructure" in peacetime',status:'Policy argument / soft law only (UN GGE–OEWG norms), not black-letter'},
];

function AboutView({dispatch,lang}) {
  const T=getT(lang);
  const [activeTab,setActiveTab]=useState(0);
  const tabs=T.about.sections;
  const tabAccent=['#2E5580','#1A3A5C','#7D6225','#3F6B4C','#8C4A1E','#0C1A30'];

  return (
    <div className="sr-fade">
      <div style={{background:'#0C1A30',borderRadius:8,padding:'28px 36px',marginBottom:24,
        position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:.03,
          backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.8) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.8) 40px)'}} />
        <div style={{position:'relative'}}>
          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:6}}>
            <BookOpen size={16} style={{color:'#A6803D'}} />
            <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#7ABCE8'}}>
              {T.about.title}
            </span>
          </div>
          <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:24,fontWeight:700,
            color:'#fff',marginBottom:8,lineHeight:1.2}}>
            State Cyber Response Escalation Index (SCREI)
          </h1>
          <p style={{color:'#93A8C0',fontSize:12,lineHeight:1.7,maxWidth:580}}>
            A legal-Bayesian decision-support framework for proportionate state response to international cyber incidents.
            Habila, E.A.G. (2026).
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{display:'flex',gap:2,marginBottom:20,flexWrap:'wrap'}}>
        {tabs.map((tab,i)=>(
          <button key={i} onClick={()=>setActiveTab(i)}
            style={{padding:'8px 16px',fontSize:11,fontWeight:activeTab===i?700:500,
              borderRadius:4,border:'none',cursor:'pointer',
              background:activeTab===i?tabAccent[i]:'#F0EDE4',
              color:activeTab===i?'#fff':'#4A5568',transition:'all .15s'}}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab===0 && (
        <div className="sr-fade">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
            <Card pad={24}>
              <SectionHead icon={Shield} title="What is SCREI?" border />
              <p style={{fontSize:12.5,color:'#333D4B',lineHeight:1.75,marginBottom:14}}>
                The State Cyber Response Escalation Index (SCREI) is a legal-Bayesian decision-support
                framework designed to assist crisis cells, senior legal advisers, and national security
                councils in selecting a proportionate, lawful response to a state-attributed international
                cyber incident.
              </p>
              <p style={{fontSize:12.5,color:'#333D4B',lineHeight:1.75,marginBottom:14}}>
                SCREI integrates two analytic disciplines that are normally conducted in isolation:
                (i) legal classification under the international law of state responsibility and the
                jus ad bellum, and (ii) quantitative multi-criteria decision analysis (MCDA) using
                Analytic Hierarchy Process (AHP) weights and a Bayesian-structured confidence layer.
              </p>
              <p style={{fontSize:12.5,color:'#333D4B',lineHeight:1.75}}>
                The model produces a composite score (S), a recommended escalation band, a legal ceiling
                (Legal Legitimacy Boundary, LLB), and a Response Stability Score (RSS) that signals
                whether a recommendation is robust or contingent on further intelligence.
              </p>
            </Card>

            <Card pad={24}>
              <SectionHead icon={Scale} title="Why SCREI Exists" border />
              <p style={{fontSize:12.5,color:'#333D4B',lineHeight:1.75,marginBottom:14}}>
                Decision-makers responding to cyber incidents face three compounding difficulties:
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:14}}>
                {[
                  ['Evidentiary uncertainty','Attribution of state-sponsored cyber operations is rarely certain. Decision-makers must act on probabilistic assessments, not proof.'],
                  ['Doctrinal complexity','The applicable international law — state responsibility, use of force, armed attack — contains contested interpretations that affect what responses are lawfully available.'],
                  ['Incommensurable factors','Severity, attribution, strategic context, and domestic pressure all bear on the response decision but resist direct comparison.'],
                ].map(([title,text])=>(
                  <div key={title} style={{padding:'10px 14px',background:'#F8F7F3',
                    borderRadius:4,borderLeft:'3px solid #2E5580'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#0C1A30',marginBottom:3}}>{title}</div>
                    <div style={{fontSize:11,color:'#64748B',lineHeight:1.55}}>{text}</div>
                  </div>
                ))}
              </div>
              <p style={{fontSize:12.5,color:'#333D4B',lineHeight:1.75}}>
                SCREI does not eliminate these difficulties. It structures them, makes them explicit and auditable,
                and prevents severity from serving as a substitute for evidence or politics from overriding law.
              </p>
            </Card>
          </div>

          {/* Escalation bands overview */}
          <Card pad={24}>
            <SectionHead icon={Layers} title="Response Band Structure" border />
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6}}>
              {BANDS.map(band=>(
                <div key={band.n} style={{padding:'12px 10px',background:BAND_BG[band.n],
                  borderRadius:5,border:`1px solid ${BAND_CLR[band.n]}40`,textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:BAND_CLR[band.n],
                    fontFamily:"'IBM Plex Mono',monospace",marginBottom:4}}>
                    {band.n}
                  </div>
                  <div style={{fontSize:8.5,color:BAND_CLR[band.n],fontWeight:700,lineHeight:1.4,marginBottom:4}}>
                    {band.label}
                  </div>
                  <div style={{fontSize:8,color:'#94A3B8',fontFamily:"'IBM Plex Mono',monospace"}}>
                    {band.min}–{band.max}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Mathematical Architecture */}
      {activeTab===1 && (
        <div className="sr-fade">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
            <Card pad={24}>
              <SectionHead icon={Activity} title="Confidence Score (CoS) — §4.1" border />
              <p style={{fontSize:12,color:'#333D4B',lineHeight:1.7,marginBottom:14}}>
                The Confidence Score (CoS) is a non-compensatory geometric mean of the three
                evidentiary variables (AC, IC, SDC). Because it is multiplicative rather than additive,
                a zero value for any one variable drives CoS to zero — preventing high-confidence corroboration
                from masking an absent attribution nexus.
              </p>
              <FormulaBlock label="Confidence Score Equation"
                formula="CoS = 100 × x_AC^β_AC × x_IC^β_IC × x_SDC^β_SDC"
                computed={`Where β_AC=${BETA.AC}, β_IC=${BETA.IC}, β_SDC=${BETA.SDC} (AHP eigenvectors, Table 4.1a)`}
                result="Range: 0–100%" />
              <FormulaBlock label="Log-linear form"
                formula="ln(CoS/100) = β_AC·ln(x_AC) + β_IC·ln(x_IC) + β_SDC·ln(x_SDC)"
                computed="Constant-elasticity: ∂ln(CoS)/∂ln(x_j) = β_j  (e.g. 1% increase in AC → 0.4996% increase in CoS)" />
              <div style={{marginTop:12}}>
                {[
                  {id:'AC',beta:BETA.AC,name:'Attribution Confidence'},
                  {id:'IC',beta:BETA.IC,name:'Intelligence Corroboration'},
                  {id:'SDC',beta:BETA.SDC,name:'State Direction / Control'},
                ].map(v=>(
                  <div key={v.id} style={{display:'flex',justifyContent:'space-between',
                    padding:'6px 0',borderBottom:'1px solid #F0EDE4',alignItems:'center'}}>
                    <div>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,
                        color:'#1A3A5C',fontSize:12,marginRight:8}}>{v.id}</span>
                      <span style={{fontSize:11,color:'#64748B'}}>{v.name}</span>
                    </div>
                    <div style={{display:'flex',gap:12,alignItems:'center'}}>
                      <span style={{fontSize:11,fontFamily:"'IBM Plex Mono',monospace",color:'#333'}}>
                        β = {v.beta.toFixed(4)}
                      </span>
                      <div style={{width:80,height:6,background:'#E2DDD3',borderRadius:3,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${v.beta*100}%`,background:'#1A3A5C',borderRadius:3}} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card pad={24}>
              <SectionHead icon={Activity} title="Severity Composite K & Master Score S — §4.1" border />
              <p style={{fontSize:12,color:'#333D4B',lineHeight:1.7,marginBottom:14}}>
                K is a weighted arithmetic mean of the twelve severity and context variables. Unlike CoS,
                K is compensatory — strength on one dimension can offset weakness on another. The master
                score S couples CoS and K via the evidentiary elasticity parameter λ.
              </p>
              <FormulaBlock label="Severity Composite K"
                formula="K = Σ w_i × x_i  (i = SH, TC, CM, DD, CBS, RHP, AO, DPP, ED, ER, SVT, CI)"
                computed="Σ w_i = 1.000; x_i = variable/10 ∈ [0,1]"
                result="K ∈ [0,1]" />
              <FormulaBlock label="Master Score S"
                formula="S = 100 × (CoS/100)^λ × K"
                computed={`λ = ${LAMBDA} (operational baseline, §4.1)`}
                result="S ∈ [0,100]" />
              <FormulaBlock label="Escalation Risk Score (§4.3)"
                formula="ERS = 100 × (6·ER + 5·AO + 4·ED + 4·DPP + 6·CBS + 5·SVT) / 300"
                result="ERS ∈ [0,100]" />
              <FormulaBlock label="Response Stability Score (§4.3)"
                formula="RSS = min(d_boundary, 10) × CoS / 10  where d = min|S − b_i|"
                computed="b_i ∈ {20, 35, 50, 65, 80, 90} (band boundaries)"
                result="RSS ∈ [0,100]" />
              <AlertBox type="info" icon={Info} compact>
                <strong>Non-substitution principle:</strong> Because CoS is multiplicative with K,
                a high severity score cannot compensate for a low (or zero) attribution confidence.
                S → 0 as CoS → 0, regardless of the severity picture.
              </AlertBox>
            </Card>
          </div>

          {/* AHP weights table */}
          <Card pad={24}>
            <SectionHead icon={Settings2} title="AHP-Derived Weights — Severity & Context Cluster (Table 4.1b)" border />
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                <thead>
                  <tr style={{background:'#F0EDE4'}}>
                    {['Variable','ID','Weight (w)','% Weight','Cluster','Principal Driver'].map(h=>(
                      <th key={h} style={{padding:'7px 10px',textAlign:'left',fontSize:9,
                        textTransform:'uppercase',letterSpacing:'0.06em',color:'#64748B',
                        fontWeight:700,borderBottom:'1px solid #E2DDD3'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VARIABLES.filter(v=>v.cluster!=='ev').map(v=>(
                    <tr key={v.id} style={{borderBottom:'1px solid #F5F3EE'}}>
                      <td style={{padding:'6px 10px',fontSize:11,color:'#151C28'}}>{v.name}</td>
                      <td style={{padding:'6px 10px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,
                        color:v.cluster==='ctx'?'#7D6225':'#8C4A1E',fontSize:11}}>{v.id}</td>
                      <td style={{padding:'6px 10px',fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>
                        {WK[v.id].toFixed(4)}
                      </td>
                      <td style={{padding:'6px 10px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <div style={{width:60,height:6,background:'#E2DDD3',borderRadius:3,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${WK[v.id]*100/0.1857*100}%`,
                              background:v.cluster==='ctx'?'#7D6225':'#8C4A1E',borderRadius:3,maxWidth:'100%'}} />
                          </div>
                          <span style={{fontSize:10,color:'#64748B',fontFamily:"'IBM Plex Mono',monospace"}}>
                            {(WK[v.id]*100).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td style={{padding:'6px 10px'}}>
                        <Badge color={v.cluster==='ctx'?'gold':'slate'}>{v.cluster==='ctx'?'Context':'Severity'}</Badge>
                      </td>
                      <td style={{padding:'6px 10px',fontSize:10,color:'#64748B',lineHeight:1.4}}>{v.effect?.split(';')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Legal Architecture */}
      {activeTab===2 && (
        <div className="sr-fade">
          <Card pad={24} style={{marginBottom:20}}>
            <SectionHead icon={Scale} title="Legal Classification System — §3.4" border />
            <p style={{fontSize:12,color:'#333D4B',lineHeight:1.7,marginBottom:16}}>
              SCREI employs a ten-category legal classification layer that maps the incident to a specific
              position within the international law framework applicable to state-sponsored cyber operations.
              Each category corresponds to a Legal Legitimacy Boundary (LLB) — the ceiling on the response
              band lawfully available under the applicable doctrine.
            </p>
            <div style={{overflowX:'auto',marginBottom:16}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                <thead>
                  <tr style={{background:'#EEF0F3'}}>
                    {['Category','Threshold','LLB Band','Legal Basis','Note'].map(h=>(
                      <th key={h} style={{padding:'7px 10px',textAlign:'left',fontSize:9,textTransform:'uppercase',
                        letterSpacing:'0.06em',color:'#64748B',fontWeight:700,borderBottom:'1px solid #E2DDD3'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEGAL_CATS.map(cat=>(
                    <tr key={cat.id} style={{borderBottom:'1px solid #F5F3EE'}}>
                      <td style={{padding:'7px 10px'}}>
                        <div style={{fontSize:11,fontWeight:700,color:'#151C28'}}>{cat.label}</div>
                      </td>
                      <td style={{padding:'7px 10px',fontSize:10,color:'#64748B',lineHeight:1.5,maxWidth:160}}>{cat.threshold}</td>
                      <td style={{padding:'7px 10px'}}>
                        {cat.notScored ? <Badge color="red">IAC</Badge> : <BandPill band={cat.llbN} size="sm" />}
                      </td>
                      <td style={{padding:'7px 10px',fontSize:10,color:'#64748B',lineHeight:1.4,maxWidth:140}}>{cat.threshold?.split('(')[1]?.split(')')[0]||'—'}</td>
                      <td style={{padding:'7px 10px',fontSize:10,color:'#333D4B',lineHeight:1.5}}>
                        {cat.llbNote}
                        {cat.contested&&<span style={{display:'block',color:'#A6803D',fontSize:9,marginTop:2}}>⚑ Contested</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AlertBox type="warning" icon={AlertTriangle}>
              <strong>LLB is a hard constraint, not a policy preference.</strong> The Legal Legitimacy Boundary
              cannot be raised by the severity of the harm, the volume of domestic political pressure, or the
              strength of alliance demands. It reflects the outer limit of what international law permits under
              the circumstances established by the legal classification.
            </AlertBox>
          </Card>

          {/* Doctrinal certainty */}
          <Card pad={24}>
            <SectionHead icon={Gavel} title="Doctrinal Certainty Reference — §3.3" border />
            <p style={{fontSize:12,color:'#333D4B',lineHeight:1.7,marginBottom:16}}>
              The following table maps key doctrinal propositions to their current legal status. SCREI scores
              only those propositions that have sufficient doctrinal weight to ground a state's legal assessment.
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {DOCTRINAL_CERTAINTY.map((item,i)=>{
                const statusColor=item.status.includes('Black-letter')?'#2F5A3D':
                  item.status.includes('Dominant')?'#2E5580':
                  item.status.includes('Contested')?'#A6803D':'#64748B';
                const statusBg=item.status.includes('Black-letter')?'#E4EEE6':
                  item.status.includes('Dominant')?'#E5EDF5':
                  item.status.includes('Contested')?'#F2E9D4':'#EEF0F3';
                return (
                  <div key={i} style={{display:'flex',gap:12,padding:'10px 14px',
                    background:'#FAFAF8',borderRadius:4,border:'1px solid #E2DDD3'}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11.5,fontWeight:600,color:'#151C28',lineHeight:1.5,marginBottom:4}}>
                        {item.prop}
                      </div>
                    </div>
                    <div style={{flexShrink:0,maxWidth:200}}>
                      <div style={{fontSize:10,padding:'3px 8px',borderRadius:3,
                        background:statusBg,color:statusColor,fontWeight:600,lineHeight:1.4,textAlign:'center'}}>
                        {item.status.split(' (')[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: How to Use */}
      {activeTab===3 && (
        <div className="sr-fade">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
            <Card pad={24}>
              <SectionHead icon={ListChecks} title="Six-Step Operational Workflow" border />
              {[
                {n:1,title:'Incident Registration',text:'Register the incident facts, including date, affected state, suspected actor, sector, physical effects, attribution evidence, and legal notes. These facts anchor the structured coding.'},
                {n:2,title:'Variable Coding',text:'Code each of the 15 SCREI variables on a 0–10 scale using the operational definitions and anchor descriptions. The model provides real-time CoS feedback as you code the evidentiary cluster.'},
                {n:3,title:'Legal Classification',text:'Select the primary legal category that best characterises the incident. If Category 2–4 is selected, assess whether the countermeasure preconditions (Categories 5–6) are independently satisfied.'},
                {n:4,title:'Full Analysis',text:'Run the model. Review CoS, S, ERS, RSS, the band, the LLB ceiling, and any override or volatility flags. Examine the score decomposition to understand what drove the result.'},
                {n:5,title:'Executive Brief',text:'Generate the three-page executive brief for senior officials. Print as PDF. The brief summarises the decision on Page 1, the analytical basis on Page 2, and the timeline on Page 3.'},
                {n:6,title:'Re-Run with Updates',text:'When new intelligence arrives, register an intelligence update. The model creates a new version, preserving the prior assessment. Compare versions in the Case History view.'},
              ].map(s=>(
                <div key={s.n} style={{display:'flex',gap:12,marginBottom:16,alignItems:'flex-start'}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:'#0C1A30',
                    color:'#A6803D',display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>
                    {s.n}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:'#0C1A30',marginBottom:3}}>{s.title}</div>
                    <div style={{fontSize:11.5,color:'#64748B',lineHeight:1.65}}>{s.text}</div>
                  </div>
                </div>
              ))}
            </Card>

            <div>
              <Card pad={24} style={{marginBottom:16}}>
                <SectionHead icon={AlertTriangle} title="Interpreting the Output" border />
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {[
                    {label:'CoS < 30%',text:'Attribution is insufficient to ground any international law claim. Response limited to retorsion and monitoring.'},
                    {label:'CoS Gate Warning',text:'Attribution confidence is below the minimum for the operative band. Corroboration required before escalation.'},
                    {label:'Decision Volatility Flag',text:'RSS < 30: the score is within 3 points of a band boundary. The recommendation is provisional. Await intelligence developments.'},
                    {label:'ERS Override',text:'High ERS (≥70) plus low CoS (<80%) triggers a one-band downgrade pending additional corroboration.'},
                    {label:'LLB Binding',text:'The legal ceiling constrains the response to a lower band than the composite score would indicate. Law, not evidence, is the binding constraint.'},
                  ].map(item=>(
                    <div key={item.label} style={{padding:'9px 12px',background:'#F8F7F3',
                      borderRadius:4,borderLeft:'3px solid #2E5580'}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#0C1A30',marginBottom:2}}>{item.label}</div>
                      <div style={{fontSize:11,color:'#64748B',lineHeight:1.55}}>{item.text}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card pad={24}>
                <SectionHead icon={Unlock} title="Strategic Restraint" border />
                <p style={{fontSize:11.5,color:'#333D4B',lineHeight:1.7}}>
                  The model always permits strategic restraint — deliberate non-escalation — at any band level.
                  Restraint must be a documented decision, not a default. The model does not penalise it, nor
                  does it capture all the political, alliance, or intelligence reasons a state may choose not to escalate.
                </p>
                <p style={{fontSize:11.5,color:'#333D4B',lineHeight:1.7,marginTop:10}}>
                  SCREI identifies the range of lawful responses, not the only permissible response. The operative
                  band is a ceiling of available action, not a floor.
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Limitations */}
      {activeTab===4 && (
        <div className="sr-fade">
          <Card pad={24} style={{marginBottom:20}}>
            <SectionHead icon={AlertTriangle} title="Scope and Limitations" border />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              {[
                {title:'Peacetime Envelope Only',text:'SCREI is designed for peacetime application of the jus ad bellum. It is not calibrated for operations within an existing international armed conflict (IAC), where jus in bello applies. Category 10 incidents should be referred to IHL-specialist legal counsel.'},
                {title:'Attribution Epistemology',text:'The model does not resolve attribution. It structures and scores an existing attribution judgment. The quality of CoS depends entirely on the rigour of the underlying intelligence assessment.'},
                {title:'AHP Weight Stability',text:'The AHP weights are derived from a specific expert elicitation exercise (§4.1.1). They should be re-elicited and re-validated when the strategic environment, legal landscape, or operational priorities change materially.'},
                {title:'Doctrinal Uncertainty',text:'Several key doctrinal questions remain contested, including the sovereignty-as-primary-rule debate and the armed-attack threshold for cyber-only operations. SCREI\'s scoring of these issues reflects the majority doctrinal view, not settled law.'},
                {title:'Political Factors',text:'The model captures Domestic Political Pressure (DPP) as a context variable affecting timing and choice within the lawful band. It does not allow DPP to raise the LLB ceiling. Political pressure cannot unlock legally unavailable responses.'},
                {title:'Human Judgment Required',text:'SCREI is a structured decision-support tool. It reduces but cannot eliminate the role of expert judgment. The final decision always rests with accountable human officials who bear responsibility for its consequences.'},
              ].map(item=>(
                <div key={item.title} style={{padding:'14px 16px',background:'#FAFAF8',
                  borderRadius:5,border:'1px solid #E2DDD3'}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#0C1A30',marginBottom:5}}>{item.title}</div>
                  <div style={{fontSize:11.5,color:'#64748B',lineHeight:1.7}}>{item.text}</div>
                </div>
              ))}
            </div>
          </Card>
          <AlertBox type="info" icon={Info}>
            <strong>Operational use statement:</strong> SCREI structures the judgment; it does not automate the decision.
            Sequential updates may change the output. Confidence and volatility matter. The final decision remains with
            accountable human officials. The model is designed to be re-run as new intelligence arrives.
          </AlertBox>
        </div>
      )}

      {/* Tab: Creator */}
      {activeTab===5 && (
        <div className="sr-fade">
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
            <Card pad={32}>
              <div style={{display:'flex',gap:20,alignItems:'flex-start',marginBottom:24}}>
                <div style={{width:72,height:72,borderRadius:8,background:'#0C1A30',
                  display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Shield size={36} style={{color:'#A6803D'}} />
                </div>
                <div>
                  <div style={{fontSize:20,fontWeight:700,color:'#0C1A30',
                    fontFamily:"'Source Serif 4',serif",marginBottom:4}}>
                    Ehab Ashraf Gomaa Habila
                  </div>
                  <div style={{fontSize:13,color:'#64748B',lineHeight:1.6}}>
                    Innovator & Lead Architect — SCREI Framework
                  </div>
                  <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
                    <Badge color="navy">International Cyber Law</Badge>
                    <Badge color="blue">Decision Science</Badge>
                    <Badge color="gold">Legal-Tech Architecture</Badge>
                  </div>
                </div>
              </div>

              <HR label="Research & Citation" />
              <p style={{fontSize:12.5,color:'#333D4B',lineHeight:1.75,marginBottom:16}}>
                Habila, E.A.G. (2026). <em>State Cyber Response Escalation Index (SCREI): A Legal-Bayesian
                Decision-Support Framework for Proportionate State Response to International Cyber Incidents.</em>
              </p>
              <p style={{fontSize:12,color:'#64748B',lineHeight:1.7}}>
                SCREI integrates Analytic Hierarchy Process (AHP) multi-criteria weighting with a
                multiplicative Bayesian confidence layer and an international law classification architecture
                spanning the jus ad bellum, state responsibility doctrine (ARSIWA), and the emerging
                cyber-specific norms of the Tallinn Manual 2.0.
              </p>

              <HR label="Contact & Professional Links" />
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {[
                  {icon:Mail,label:'Email',value:'ihab.ashraf.habila@gmail.com',href:'mailto:ihab.ashraf.habila@gmail.com'},
                  {icon:ExternalLink,label:'WhatsApp',value:'+20 1060572122',href:'https://wa.me/201060572122'},
                  {icon:ExternalLink,label:'SSRN',value:'SSRN Research Profile',href:'https://ssrn.com'},
                  {icon:ExternalLink,label:'Google Scholar',value:'Google Scholar Profile',href:'https://scholar.google.com'},
                  {icon:ExternalLink,label:'LinkedIn',value:'Ehab Ashraf Gomaa Habila',href:'https://linkedin.com'},
                ].map(link=>(
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                    style={{display:'flex',gap:10,padding:'10px 14px',background:'#F8F7F3',
                      borderRadius:4,border:'1px solid #E2DDD3',textDecoration:'none',
                      alignItems:'center',color:'inherit'}}>
                    <link.icon size={14} style={{color:'#2E5580',flexShrink:0}} />
                    <span style={{fontSize:10,color:'#94A3B8',minWidth:80,textTransform:'uppercase',
                      letterSpacing:'0.06em',fontWeight:600}}>{link.label}</span>
                    <span style={{fontSize:12,color:'#0C1A30',fontWeight:500}}>{link.value}</span>
                  </a>
                ))}
              </div>
            </Card>

            <div>
              <Card pad={20} style={{marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:700,color:'#64748B',textTransform:'uppercase',
                  letterSpacing:'0.08em',marginBottom:12}}>Identifiers</div>
                {[
                  {label:'ORCID',value:'0009-0001-1763-5534'},
                  {label:'Platform Version',value:'SCREI v1.0'},
                  {label:'Reference Year',value:'2026'},
                  {label:'Framework',value:'Legal-Bayesian MCDA'},
                  {label:'Weight Method',value:'AHP Eigenvector'},
                ].map(item=>(
                  <div key={item.label} style={{display:'flex',justifyContent:'space-between',
                    padding:'6px 0',borderBottom:'1px solid #F0EDE4'}}>
                    <span style={{fontSize:10,color:'#94A3B8',fontWeight:600}}>{item.label}</span>
                    <span style={{fontSize:10.5,fontFamily:"'IBM Plex Mono',monospace",color:'#0C1A30',fontWeight:600}}>{item.value}</span>
                  </div>
                ))}
              </Card>

              <Card pad={20} navy>
                <div style={{fontSize:10,fontWeight:700,color:'#7ABCE8',textTransform:'uppercase',
                  letterSpacing:'0.08em',marginBottom:12}}>Official Reference</div>
                <p style={{fontSize:11,color:'#93A8C0',lineHeight:1.7,marginBottom:12}}>
                  When citing SCREI in policy documents, legal briefs, or academic work, please cite the
                  full practical guide and the SSRN paper.
                </p>
                <a href="https://acrobat.adobe.com/id/urn:aaid:sc:EU:b003f65f-358a-4dc4-983b-d66015b9dd5f"
                  target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',gap:8,alignItems:'center',padding:'10px 14px',
                    background:'rgba(255,255,255,.08)',borderRadius:4,
                    border:'1px solid rgba(255,255,255,.12)',color:'#E5EDF5',textDecoration:'none'}}>
                  <FileText size={14} style={{color:'#A6803D',flexShrink:0}} />
                  <div>
                    <div style={{fontSize:10,fontWeight:700}}>Official Practical Document</div>
                    <div style={{fontSize:9,color:'#7ABCE8',marginTop:1}}>Documentation & Practical Guide</div>
                  </div>
                </a>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   ADMIN VIEW — Model Parameters, AHP Weights, Doctrinal Reference
   ========================================================================= */
const CONSISTENCY_RATIOS = {
  evidentiary: { CR: 0.031, note: 'Well within the 0.10 threshold (Saaty, 1980)' },
  severity:    { CR: 0.048, note: 'Acceptable — 5 variables, single expert elicitation' },
  context:     { CR: 0.062, note: 'Acceptable — 7 variables, strategic-context judgments carry higher variance' },
};

function AdminView({dispatch, lang}) {
  const T = getT(lang);
  const [openSection, setOpenSection] = useState('weights');

  const sections = [
    { id:'weights',   label:'AHP Weights', icon: Activity },
    { id:'ers',       label:'ERS Weights', icon: TrendingUp },
    { id:'constants', label:'Engine Constants', icon: Settings2 },
    { id:'doctrinal', label:'Doctrinal Reference', icon: Gavel },
  ];

  return (
    <div className="sr-fade">
      <SectionHead icon={Settings2} title={T.admin.title}
        subtitle={T.admin.subtitle} border />

      <AlertBox type="info" icon={Info}>
        <strong>Calibration note (§10.4):</strong> These weights were derived via AHP from expert elicitation
        under the strategic environment obtaining at the time of the study. A future update should re-elicit
        weights from a panel of at least nine experts spanning international law, intelligence analysis, and
        strategic studies, and recompute eigenvalues to verify consistency ratios remain below 0.10.
      </AlertBox>

      <div style={{marginTop:16}}>
        {/* Evidentiary cluster — BETA */}
        <Card pad={24} style={{marginBottom:16}}>
          <SectionHead icon={Search} title={T.admin.beta} border />
          <p style={{fontSize:12,color:'#64748B',lineHeight:1.7,marginBottom:16}}>
            The β exponents are the eigenvectors of the evidentiary-cluster pairwise comparison matrix.
            Their non-compensatory role in the geometric mean CoS equation means each represents an
            independent constitutional requirement for the attribution confidence claim.
          </p>
          <div style={{overflowX:'auto',marginBottom:16}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:11.5}}>
              <thead>
                <tr style={{background:'#EEF4FA'}}>
                  {['Variable','Full Name','β Exponent','Relative Weight','Elicitation Basis','Sensitivity'].map(h=>(
                    <th key={h} style={{padding:'8px 12px',textAlign:'left',fontSize:9,fontWeight:700,
                      color:'#1A3A5C',textTransform:'uppercase',letterSpacing:'0.07em',
                      borderBottom:'2px solid #C5D8E8'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {id:'AC',  name:'Attribution Confidence',    beta:0.4996, basis:'Reflects primacy of direct attribution nexus under ARSIWA Arts. 4, 8; largest single driver.'},
                  {id:'IC',  name:'Intelligence Corroboration',beta:0.2366, basis:'Multi-source independence: Admiralty Code A/1 standard as benchmark.'},
                  {id:'SDC', name:'State Direction / Control', beta:0.2637, basis:'Effective control (Nicaragua test) as distinct doctrinal requirement from IC.'},
                ].map((v,i)=>(
                  <tr key={v.id} style={{borderBottom:'1px solid #F0EDE4'}}>
                    <td style={{padding:'10px 12px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,color:'#1A3A5C',fontSize:12}}>{v.id}</td>
                    <td style={{padding:'10px 12px',color:'#333D4B',fontSize:11.5}}>{v.name}</td>
                    <td style={{padding:'10px 12px',fontFamily:"'IBM Plex Mono',monospace",fontSize:13,fontWeight:700,color:'#0C1A30'}}>{v.beta.toFixed(4)}</td>
                    <td style={{padding:'10px 12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:100,height:8,background:'#E2DDD3',borderRadius:4,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${v.beta*100}%`,background:'#1A3A5C',borderRadius:4}} />
                        </div>
                        <span style={{fontSize:10.5,fontFamily:"'IBM Plex Mono',monospace",color:'#64748B'}}>{(v.beta*100).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td style={{padding:'10px 12px',fontSize:10.5,color:'#64748B',lineHeight:1.55,maxWidth:200}}>{v.basis}</td>
                    <td style={{padding:'10px 12px'}}>
                      <div style={{fontSize:10.5,fontFamily:"'IBM Plex Mono',monospace",color:'#333'}}>
                        ∂lnS/∂lnx_{v.id} = λβ = {v.beta.toFixed(4)}
                      </div>
                      <div style={{fontSize:9.5,color:'#94A3B8',marginTop:2}}>constant elasticity</div>
                    </td>
                  </tr>
                ))}
                <tr style={{background:'#EEF4FA',borderTop:'2px solid #C5D8E8'}}>
                  <td colSpan={2} style={{padding:'8px 12px',fontWeight:700,fontSize:11}}>Σ β = 1.0000 (normalised)</td>
                  <td style={{padding:'8px 12px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700}}>1.0000</td>
                  <td colSpan={3} style={{padding:'8px 12px',fontSize:10,color:'#64748B'}}>
                    CR = {CONSISTENCY_RATIOS.evidentiary.CR} — {CONSISTENCY_RATIOS.evidentiary.note}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Severity / Context cluster — WK */}
        <Card pad={24} style={{marginBottom:16}}>
          <SectionHead icon={Activity} title={T.admin.wk} border />
          <p style={{fontSize:12,color:'#64748B',lineHeight:1.7,marginBottom:16}}>
            The additive weights w_i are the global priority vectors from the hierarchical AHP decomposition,
            normalised to sum to unity. They represent the relative importance of each dimension in the overall
            severity-and-context assessment, independent of the evidentiary confidence level.
          </p>
          <div style={{overflowX:'auto',marginBottom:16}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
              <thead>
                <tr style={{background:'#F5EDD5'}}>
                  {['ID','Variable','w_i Weight','% Share','Cluster','AHP Group','Effect on S'].map(h=>(
                    <th key={h} style={{padding:'7px 10px',textAlign:'left',fontSize:9,fontWeight:700,
                      color:'#7D6225',textTransform:'uppercase',letterSpacing:'0.07em',
                      borderBottom:'2px solid #D4B86A'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {id:'SH',  w:0.1857,cluster:'sev',group:'Harm & Target',    effect:'Primary legal classification driver (Cat.7–8 threshold)'},
                  {id:'TC',  w:0.1143,cluster:'sev',group:'Harm & Target',    effect:'Critical-infrastructure norm weighting; TC × SH interaction'},
                  {id:'CBS', w:0.0852,cluster:'sev',group:'Systemic/Spillover',effect:'Raises ERS; international precedent signal (NotPetya model)'},
                  {id:'RHP', w:0.0852,cluster:'sev',group:'Systemic/Spillover',effect:'ARSIWA Art.15 composite-act treatment across the campaign'},
                  {id:'ER',  w:0.0817,cluster:'ctx',group:'Political/Economic', effect:'Dampener: raises evidentiary bar for Bands V–VII'},
                  {id:'CM',  w:0.0714,cluster:'sev',group:'Harm & Target',    effect:'IHL relevance if Cat.10; civilian-harm norm escalation'},
                  {id:'DD',  w:0.0714,cluster:'sev',group:'Harm & Target',    effect:'Duration sustains Cat.7 gravity and economic-harm claim'},
                  {id:'AO',  w:0.0710,cluster:'ctx',group:'Systemic/Spillover',effect:'Gates Band VI; collective-defence doctrine trigger'},
                  {id:'SVT', w:0.0681,cluster:'ctx',group:'Political/Economic', effect:'Willingness to bear ERS burden within Bands V–VII'},
                  {id:'CI',  w:0.0571,cluster:'sev',group:'Harm & Target',    effect:'Campaign aggregation; ARSIWA Art.15 composite-act'},
                  {id:'DPP', w:0.0545,cluster:'ctx',group:'Political/Economic', effect:'Timing and action-within-band; cannot raise LLB ceiling'},
                  {id:'ED',  w:0.0545,cluster:'ctx',group:'Political/Economic', effect:'Constrains Band IV–VI appetite; inversely correlates with sanctions'},
                ].map((v,i)=>(
                  <tr key={v.id} style={{borderBottom:'1px solid #F5F3EE',
                    background:i<3?'#FFFDF8':i<6?'#FAFAF8':'#F8F7F3'}}>
                    <td style={{padding:'6px 10px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:11,
                      color:v.cluster==='ctx'?'#7D6225':'#8C4A1E'}}>{v.id}</td>
                    <td style={{padding:'6px 10px',fontSize:11,color:'#333D4B'}}>{varById(v.id)?.name}</td>
                    <td style={{padding:'6px 10px',fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:700,color:'#0C1A30'}}>{v.w.toFixed(4)}</td>
                    <td style={{padding:'6px 10px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:70,height:6,background:'#E2DDD3',borderRadius:3,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${v.w/0.1857*100}%`,
                            background:v.cluster==='ctx'?'#7D6225':'#8C4A1E',borderRadius:3,maxWidth:'100%'}} />
                        </div>
                        <span style={{fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace",color:'#64748B'}}>{(v.w*100).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td style={{padding:'6px 10px'}}><Badge color={v.cluster==='ctx'?'gold':'slate'}>{v.cluster==='ctx'?'Context':'Severity'}</Badge></td>
                    <td style={{padding:'6px 10px',fontSize:10,color:'#64748B'}}>{v.group}</td>
                    <td style={{padding:'6px 10px',fontSize:10,color:'#64748B',lineHeight:1.4,maxWidth:160}}>{v.effect}</td>
                  </tr>
                ))}
                <tr style={{background:'#F5EDD5',borderTop:'2px solid #D4B86A'}}>
                  <td colSpan={2} style={{padding:'8px 10px',fontWeight:700,fontSize:11,color:'#7D6225'}}>Σ w_i = 1.0000</td>
                  <td style={{padding:'8px 10px',fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,color:'#7D6225'}}>1.0000</td>
                  <td colSpan={4} style={{padding:'8px 10px',fontSize:10,color:'#7D6225'}}>
                    CR(Harm&amp;Target) = {CONSISTENCY_RATIOS.severity.CR} · CR(Context) = {CONSISTENCY_RATIOS.context.CR} — Both below 0.10 threshold
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* ERS Weights */}
        <Card pad={24} style={{marginBottom:16}}>
          <SectionHead icon={TrendingUp} title={T.admin.ers} border />
          <p style={{fontSize:12,color:'#64748B',lineHeight:1.7,marginBottom:16}}>
            The ERS sub-model uses six variables with integer weights (4–6) reflecting their relative
            contribution to escalation risk. The denominator (300) normalises the output to [0,100].
          </p>
          <FormulaBlock label="ERS Formula (§4.3)"
            formula="ERS = 100 × (6·ER + 5·AO + 4·ED + 4·DPP + 6·CBS + 5·SVT) / 300"
            computed="Note: ERS ≥ 70 AND CoS < 80% triggers the Override Rule (downgrade 1 band)" />
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:12}}>
            {Object.entries(ERS_W).map(([id,w])=>(
              <div key={id} style={{padding:'14px 16px',background:'#F8F7F3',borderRadius:5,
                border:'1px solid #E2DDD3',textAlign:'center'}}>
                <div style={{fontSize:24,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",
                  color:'#8C4A1E',lineHeight:1}}>{w}</div>
                <div style={{fontSize:11,fontWeight:700,color:'#0C1A30',marginTop:4}}>{id}</div>
                <div style={{fontSize:9.5,color:'#64748B',marginTop:2,lineHeight:1.4}}>
                  {varById(id)?.name}
                </div>
                <div style={{fontSize:9,color:'#94A3B8',marginTop:3,fontFamily:"'IBM Plex Mono',monospace"}}>
                  effective weight: {(w/30*100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Engine constants */}
        <Card pad={24} style={{marginBottom:16}}>
          <SectionHead icon={Settings2} title={T.admin.params} border />
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[
              {k:'λ (Lambda)',v:'1',note:'Evidentiary elasticity parameter. λ = 1 (baseline, §4.1). Increasing λ > 1 amplifies the penalty for low CoS; decreasing to 0 < λ < 1 dampens it. Re-calibrate via scenario analysis before changing.',label:'Evidentiary Elasticity'},
              {k:'Boundaries',v:BOUNDARIES.join(', '),note:'Band boundary values b_i used to compute d_boundary for the RSS calculation. These correspond to the minimum thresholds of each band transition.',label:'Band Transition Points'},
              {k:'δ (Delta)',v:'1.5',note:'Default elicitation uncertainty (±1.5 on the 0–10 scale) used in the §10.2 confidence-interval propagation. Adjust downward when operational data quality is very high.',label:'CI Uncertainty Param.'},
              {k:'ERS Gate',v:'70 / 80',note:'ERS ≥ 70 AND CoS < 80% activates the Override Rule. These thresholds were calibrated against the §10.3 scenario table. Review before deployment in a specific national context.',label:'Override Thresholds'},
              {k:'RSS Floor',v:'30',note:'RSS < 30 activates the Decision Volatility Flag, defaulting to the lower adjacent band. A higher floor (e.g. 40) in high-stakes contexts is defensible.',label:'Volatility Threshold'},
              {k:'CI Level',v:'90%',note:'Confidence interval uses z = 1.645 (90% two-tailed). The source paper (§10.2) recommends 90% for operational contexts; 95% (z = 1.96) may be preferred for legal proceedings.',label:'CI Confidence Level'},
            ].map(c=>(
              <div key={c.k} style={{padding:'14px 16px',background:'#F8F7F3',borderRadius:5,
                border:'1px solid #E2DDD3'}}>
                <div style={{fontSize:9.5,color:'#94A3B8',textTransform:'uppercase',
                  letterSpacing:'0.07em',fontWeight:700,marginBottom:4}}>{c.label}</div>
                <div style={{fontSize:20,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",
                  color:'#0C1A30',marginBottom:6}}>{c.v}</div>
                <div style={{fontSize:10.5,color:'#64748B',lineHeight:1.6}}>{c.note}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Doctrinal certainty */}
        <Card pad={24}>
          <SectionHead icon={Gavel} title={T.admin.doctrinal} border />
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {DOCTRINAL_CERTAINTY.map((item,i)=>{
              const isBlack=item.status.includes('Black-letter');
              const isDom=item.status.includes('Dominant');
              const isCon=item.status.includes('Contested')||item.status.includes('emerging');
              const clr=isBlack?'#2F5A3D':isDom?'#2E5580':isCon?'#A6803D':'#64748B';
              const bg=isBlack?'#E4EEE6':isDom?'#E5EDF5':isCon?'#F2E9D4':'#EEF0F3';
              return (
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,
                  padding:'10px 14px',background:'#FAFAF8',borderRadius:4,
                  border:'1px solid #E2DDD3',alignItems:'start'}}>
                  <div style={{fontSize:11.5,color:'#333D4B',lineHeight:1.6}}>{item.prop}</div>
                  <div style={{fontSize:9,fontWeight:700,color:clr,background:bg,
                    borderRadius:3,padding:'3px 8px',textAlign:'center',
                    minWidth:130,lineHeight:1.4,flexShrink:0}}>
                    {item.status.split('(')[0].trim()}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================================
   POLICY NOTE MODAL — shown on first platform entry
   ========================================================================= */
function PolicyModal({dispatch, lang}) {
  const T = getT(lang);
  return (
    <div style={{position:'fixed',inset:0,zIndex:2000,background:'rgba(6,12,24,.82)',
      display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
      <div style={{background:'#fff',borderRadius:8,width:'min(680px,95vw)',maxHeight:'90vh',
        overflow:'auto',boxShadow:'0 24px 64px rgba(0,0,0,.5)',display:'flex',flexDirection:'column'}}
        className="sr-main">
        {/* Modal header */}
        <div style={{background:'#0C1A30',padding:'28px 32px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,opacity:.04,
            backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.8) 0,rgba(255,255,255,.8) 1px,transparent 0,transparent 50%)',
            backgroundSize:'12px 12px'}} />
          <div style={{position:'relative'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:6,background:'rgba(166,128,61,.2)',
                border:'1px solid rgba(166,128,61,.4)',display:'flex',alignItems:'center',
                justifyContent:'center'}}>
                <Shield size={24} style={{color:'#A6803D'}} />
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.14em',
                  textTransform:'uppercase',color:'#7ABCE8',marginBottom:2}}>
                  {T.nav.platform}
                </div>
                <div style={{fontSize:18,fontWeight:700,color:'#fff',
                  fontFamily:"'Source Serif 4',serif",lineHeight:1.2}}>
                  State Cyber Response Escalation Index
                </div>
              </div>
            </div>
            <div style={{fontSize:12,color:'#93A8C0',lineHeight:1.7}}>
              SCREI v1.0 — Habila (2026) — Legal-Bayesian Decision-Support Framework
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{padding:'24px 32px'}}>
          <div style={{padding:'14px 18px',background:'#FFF8E7',borderRadius:5,
            border:'1px solid #DDD8CC',marginBottom:20,
            borderLeft:'3px solid #A6803D'}}>
            <div style={{fontSize:12.5,fontWeight:700,color:'#7D6225',marginBottom:5}}>
              Operational-Use Statement
            </div>
            <div style={{fontSize:12,color:'#5A3E10',lineHeight:1.7}}>
              <strong>SCREI structures the judgment; it does not automate the decision.</strong> This platform is a
              decision-support model for crisis cells operating with incomplete information. Sequential updates may change
              the output. Confidence and volatility matter. The final decision remains with accountable human officials.
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:700,color:'#0C1A30',marginBottom:10}}>
              The platform supports six operational steps:
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[
                ['Register Incident','Enter facts, affected state, actor, sector, and legal context.'],
                ['Code Variables','Translate facts into 15 structured variables (0–10 scale).'],
                ['Legal Classification','Assign the incident to a legal category to determine the LLB ceiling.'],
                ['Compute Analysis','Generate CoS, S, ERS, RSS, band, and recommendation.'],
                ['Executive Brief','Generate a 3-page PDF brief for senior officials.'],
                ['Re-Run on Updates','New intelligence triggers a new version, preserving prior assessments.'],
              ].map(([t,d],i)=>(
                <div key={i} style={{display:'flex',gap:8,padding:'8px 12px',background:'#F8F7F3',
                  borderRadius:4,border:'1px solid #E2DDD3',alignItems:'flex-start'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:'#0C1A30',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:9,fontWeight:700,color:'#A6803D',flexShrink:0,marginTop:1}}>
                    {i+1}
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:'#0C1A30',marginBottom:1}}>{t}</div>
                    <div style={{fontSize:10.5,color:'#64748B',lineHeight:1.5}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <Btn size="lg" icon={ArrowRight} onClick={()=>dispatch({type:'CLOSE_POLICY'})}>
              Enter the Platform
            </Btn>
            <Btn variant="secondary" icon={BookOpen} onClick={()=>{dispatch({type:'LOAD_DEMO'});dispatch({type:'CLOSE_POLICY'})}}>
              Load Demo Case (Incident Alpha)
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   NAVIGATION SIDEBAR
   ========================================================================= */
function NavItem({icon:Icon, label, active, onClick, indent, badge, disabled}) {
  return (
    <button onClick={disabled?null:onClick}
      style={{
        width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:9,
        padding: indent ? '7px 16px 7px 28px' : '9px 16px',
        background: active ? 'rgba(166,128,61,.18)' : 'transparent',
        borderLeft: active ? '3px solid #A6803D' : '3px solid transparent',
        border:'none', cursor: disabled ? 'not-allowed' : 'pointer',
        color: active ? '#F2E0AE' : disabled ? '#334157' : '#93A8C0',
        fontSize: indent ? 11 : 12, fontWeight: active ? 700 : 500,
        opacity: disabled ? 0.45 : 1,
        transition:'background .12s,color .12s,border-color .12s',
        fontFamily:'inherit',
      }}>
      {Icon && <Icon size={indent ? 11 : 13} style={{flexShrink:0,opacity:.85}} />}
      <span style={{flex:1,lineHeight:1.35}}>{label}</span>
      {badge && (
        <span style={{fontSize:8.5,fontWeight:700,background:'rgba(166,128,61,.3)',
          color:'#F2E0AE',borderRadius:2,padding:'1px 5px',letterSpacing:'0.04em'}}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Nav({state, dispatch, lang, setLang}) {
  const T = getT(lang);
  const {view, activeCase, cases} = state;
  const activeC = cases.find(c=>c.id===activeCase);
  const latest = activeC?.versions?.at(-1);
  const an = latest?.analysis;
  const hasCase = !!activeC;

  const LANGS = [{code:'en',label:'EN'},{code:'fr',label:'FR'},{code:'de',label:'DE'}];

  return (
    <nav className="sr-nav" style={{display:'flex',flexDirection:'column'}}>
      {/* Branding */}
      <div style={{padding:'20px 16px 16px',borderBottom:'1px solid rgba(255,255,255,.07)',
        position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:.025,
          backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.9) 0,rgba(255,255,255,.9) 1px,transparent 0,transparent 50%)',
          backgroundSize:'10px 10px'}} />
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:8}}>
            <div style={{width:36,height:36,borderRadius:5,background:'rgba(166,128,61,.2)',
              border:'1px solid rgba(166,128,61,.3)',display:'flex',alignItems:'center',
              justifyContent:'center',flexShrink:0}}>
              <Shield size={20} style={{color:'#A6803D'}} />
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:'#fff',letterSpacing:'0.06em',
                fontFamily:"'Source Serif 4',serif",lineHeight:1.1}}>SCREI</div>
              <div style={{fontSize:8.5,color:'#4E6A8A',fontWeight:600,
                letterSpacing:'0.08em',textTransform:'uppercase',lineHeight:1.2}}>v1.0</div>
            </div>
          </div>
          <div style={{fontSize:9,color:'#4E6A8A',lineHeight:1.45,fontWeight:500}}>
            {T.nav.platform}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div style={{flex:1,overflowY:'auto',padding:'10px 0'}} className="sr-scroll">
        {/* Case Management section */}
        <div style={{padding:'6px 16px 4px',fontSize:8.5,fontWeight:700,letterSpacing:'0.12em',
          textTransform:'uppercase',color:'#2E4A62'}}>
          {lang==='fr'?'Gestion des Cas':lang==='de'?'Fallverwaltung':'Case Management'}
        </div>

        <NavItem icon={ListChecks} label={T.nav.caseRegistry}
          active={view==='home'} onClick={()=>dispatch({type:'SET_VIEW',view:'home'})} />
        <NavItem icon={Plus} label={T.nav.newIncident}
          active={view==='intake'&&!state.draftCaseId}
          onClick={()=>dispatch({type:'NEW_CASE'})} />

        {/* Active case section */}
        {hasCase && (
          <>
            <div style={{height:1,background:'rgba(255,255,255,.07)',margin:'8px 0'}} />
            <div style={{padding:'6px 16px 4px',fontSize:8.5,fontWeight:700,letterSpacing:'0.12em',
              textTransform:'uppercase',color:'#2E4A62'}}>
              {T.nav.activeCase}
            </div>

            {/* Case title + band indicator */}
            <div style={{padding:'8px 16px',marginBottom:4}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                {an && (
                  <div style={{width:8,height:8,borderRadius:'50%',
                    background:BAND_CLR[an.operativeBand],flexShrink:0}} />
                )}
                <div style={{fontSize:10.5,color:'#93A8C0',fontWeight:600,
                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',lineHeight:1.4}}>
                  {activeC.intake?.title?.slice(0,36)||'Untitled'}
                  {(activeC.intake?.title?.length||0)>36&&'…'}
                </div>
              </div>
              {an && (
                <div style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",
                  color:'#4E6A8A',display:'flex',gap:8}}>
                  <span>Band {an.operativeBand}</span>
                  <span>S={an.S.toFixed(1)}</span>
                  <span>CoS={an.CoS.toFixed(0)}%</span>
                </div>
              )}
            </div>

            <NavItem icon={FileText} label={T.nav.step1} indent
              active={view==='intake'}
              onClick={()=>dispatch({type:'SET_VIEW',view:'intake'})} />
            <NavItem icon={Activity} label={T.nav.step2} indent
              active={view==='coding'}
              onClick={()=>dispatch({type:'SET_VIEW',view:'coding'})} />
            <NavItem icon={ChevronRight} label={T.nav.step3} indent
              active={view==='results'}
              onClick={()=>dispatch({type:'SET_VIEW',view:'results'})} />
            <NavItem icon={Printer} label={T.nav.execBrief} indent
              active={false}
              onClick={()=>{dispatch({type:'SET_VIEW',view:'results'});dispatch({type:'OPEN_BRIEF'})}}
              disabled={!an} />
            <NavItem icon={History} label={T.nav.caseHistory} indent
              active={view==='history'}
              badge={activeC?.versions?.length>1?`${activeC.versions.length}v`:null}
              onClick={()=>dispatch({type:'SET_VIEW',view:'history'})} />
          </>
        )}

        <div style={{height:1,background:'rgba(255,255,255,.07)',margin:'8px 0'}} />

        {/* Reference section */}
        <div style={{padding:'6px 16px 4px',fontSize:8.5,fontWeight:700,letterSpacing:'0.12em',
          textTransform:'uppercase',color:'#2E4A62'}}>
          {lang==='fr'?'Référence':lang==='de'?'Referenz':'Reference'}
        </div>
        <NavItem icon={BookOpen} label={T.nav.about}
          active={view==='about'} onClick={()=>dispatch({type:'SET_VIEW',view:'about'})} />
        <NavItem icon={Settings2} label={T.nav.admin}
          active={view==='admin'} onClick={()=>dispatch({type:'SET_VIEW',view:'admin'})} />
      </div>

      {/* Language switcher */}
      <div style={{borderTop:'1px solid rgba(255,255,255,.07)',padding:'12px 16px 8px'}}>
        <div style={{fontSize:8,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',
          color:'#2E4A62',marginBottom:7,display:'flex',alignItems:'center',gap:5}}>
          <Globe2 size={9} style={{color:'#4E6A8A'}} />
          {lang==='fr'?'Langue':lang==='de'?'Sprache':'Language'}
        </div>
        <div style={{display:'flex',gap:4}}>
          {LANGS.map(l=>(
            <button key={l.code} onClick={()=>setLang(l.code)}
              style={{flex:1,padding:'5px 0',fontSize:10,fontWeight:700,
                border:`1px solid ${lang===l.code?'rgba(166,128,61,.6)':'rgba(255,255,255,.1)'}`,
                borderRadius:3,background:lang===l.code?'rgba(166,128,61,.2)':'transparent',
                color:lang===l.code?'#F2E0AE':'#4E6A8A',cursor:'pointer',
                transition:'all .12s',letterSpacing:'0.04em'}}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Creator credit */}
      <div style={{borderTop:'1px solid rgba(255,255,255,.06)',padding:'10px 16px 14px'}}>
        <div style={{fontSize:9,color:'#2E4A62',lineHeight:1.6}}>
          <div style={{fontWeight:600,color:'#3C5A76',marginBottom:1}}>Ehab A.G Habila</div>
          <div>SCREI © 2026</div>
        </div>
      </div>
    </nav>
  );
}

/* =========================================================================
   MAIN APP
   ========================================================================= */
function App() {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const [lang, setLang] = useState('en');
  const T = getT(lang);
  const { view, briefOpen, showPolicy, activeCase, cases } = state;

  // Determine active view component
  const renderView = () => {
    switch(view) {
      case 'home':    return <HomeView    state={state} dispatch={dispatch} lang={lang} T={T} />;
      case 'intake':  return <IntakeView  state={state} dispatch={dispatch} lang={lang} T={T} />;
      case 'coding':  return <CodingView  state={state} dispatch={dispatch} lang={lang} T={T} />;
      case 'results': return <ResultsView state={state} dispatch={dispatch} lang={lang} T={T} />;
      case 'history': return <HistoryView state={state} dispatch={dispatch} lang={lang} />;
      case 'about':   return <AboutView   dispatch={dispatch} lang={lang} />;
      case 'admin':   return <AdminView   dispatch={dispatch} lang={lang} />;
      default:        return <HomeView    state={state} dispatch={dispatch} lang={lang} T={T} />;
    }
  };

  return (
    <div className="screi-root sr-root">
      <GlobalStyle />
      <Nav state={state} dispatch={dispatch} lang={lang} setLang={setLang} />
      <main className="sr-main">
        <div className="sr-content">
          {renderView()}
        </div>
      </main>
      {briefOpen && <BriefView state={state} dispatch={dispatch} lang={lang} T={T} />}
      {showPolicy && <PolicyModal dispatch={dispatch} lang={lang} />}
    </div>
  );
}

export default App;
