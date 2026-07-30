/**
 * Generates plango AI finale pitch deck (8 slides) per pitch-slides-readme.md
 * Run: node scripts/generate-pitch-deck.mjs
 */
import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'plango-ai-finale-pitch-deck.pptx');

const C = {
  bg: '0F172A',
  bgCard: '1E293B',
  green: '22C55E',
  greenDark: '14532D',
  orange: 'F97316',
  white: 'F8FAFC',
  muted: '94A3B8',
  dim: '64748B',
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Team Terrabytes';
pres.title = 'plango AI — Finale Pitch Deck';

function brand(slide, n) {
  slide.addText('plango AI', {
    x: 0.45,
    y: 0.28,
    w: 2,
    h: 0.35,
    fontSize: 11,
    fontFace: 'Calibri',
    color: C.green,
    italic: true,
    bold: true,
  });
  slide.addText(String(n), {
    x: 9.1,
    y: 0.28,
    w: 0.5,
    h: 0.35,
    fontSize: 10,
    fontFace: 'Calibri',
    color: C.dim,
    align: 'right',
  });
}

function title(slide, text, y = 0.85) {
  slide.addText(text, {
    x: 0.55,
    y,
    w: 8.9,
    h: 0.75,
    fontSize: 32,
    fontFace: 'Georgia',
    color: C.white,
    bold: true,
  });
}

function body(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.55,
    y: opts.y ?? 1.75,
    w: opts.w ?? 8.9,
    h: opts.h ?? 1.2,
    fontSize: opts.fontSize ?? 18,
    fontFace: 'Calibri',
    color: opts.color ?? C.muted,
    valign: opts.valign ?? 'top',
    ...opts.extra,
  });
}

function darkBg(slide) {
  slide.background = { color: C.bg };
}

function accentBar(slide) {
  slide.addShape(pres.ShapeType.rect, {
    x: 0.55,
    y: 1.55,
    w: 1.2,
    h: 0.06,
    fill: { color: C.green },
    line: { color: C.green, transparency: 100 },
  });
}

// ── Slide 1 — The Hook ─────────────────────────────────────────────
const s1 = pres.addSlide();
darkBg(s1);
s1.addImage({
  path: 'https://images.unsplash.com/photo-1527482792272-5ed535e09527?w=1920&q=80',
  x: 0,
  y: 0,
  w: 10,
  h: 5.625,
  sizing: { type: 'cover', w: 10, h: 5.625 },
});
s1.addShape(pres.ShapeType.rect, {
  x: 0,
  y: 0,
  w: 10,
  h: 5.625,
  fill: { color: '000000', transparency: 55 },
  line: { transparency: 100 },
});
brand(s1, 1);
title(s1, 'Tuesday, 6 PM, Colombo.', 1.1);
s1.addText('35% of food wasted · 20–30% savings missed · hours lost every week', {
  x: 0.55,
  y: 2.15,
  w: 8.5,
  h: 0.9,
  fontSize: 22,
  fontFace: 'Calibri',
  color: C.white,
  bold: true,
});
s1.addNotes(
  "It's Tuesday, 6 pm in Colombo. Amma is deciding dinner. She forgets the rice is finished. She buys fish someone in the family can't eat. Last week's tomatoes have spoiled. And it's starting to rain. Every Sri Lankan family knows this evening. Around 35% of household food ends up wasted, 20 to 30% of savings are missed from unplanned buying, and hours every week disappear into juggling lists, prices, and diets. This isn't a convenience problem — in this economy, it's a household finance problem."
);

// ── Slide 2 — The World Just Validated This ───────────────────────
const s2 = pres.addSlide();
darkBg(s2);
brand(s2, 2);
title(s2, 'The "personal shopping genius" is here.');

s2.addShape(pres.ShapeType.rect, {
  x: 0.55,
  y: 1.75,
  w: 4.2,
  h: 2.85,
  fill: { color: C.bgCard },
  line: { color: C.dim, pt: 1 },
  rectRadius: 0.08,
});
s2.addText('Gopuff × xAI', {
  x: 0.75,
  y: 2.0,
  w: 3.8,
  h: 0.5,
  fontSize: 22,
  fontFace: 'Calibri',
  color: C.orange,
  bold: true,
});
s2.addText('Go', {
  x: 0.75,
  y: 2.55,
  w: 3.8,
  h: 0.9,
  fontSize: 48,
  fontFace: 'Georgia',
  color: C.white,
  bold: true,
});
s2.addText('Voice AI cart · 500 US warehouses · 2026', {
  x: 0.75,
  y: 3.45,
  w: 3.8,
  h: 0.5,
  fontSize: 13,
  fontFace: 'Calibri',
  color: C.muted,
});

s2.addShape(pres.ShapeType.rect, {
  x: 5.0,
  y: 1.75,
  w: 4.45,
  h: 2.85,
  fill: { color: C.bgCard },
  line: { color: C.dim, pt: 1 },
  rectRadius: 0.08,
});
// Stylized Sri Lanka map placeholder
s2.addShape(pres.ShapeType.ellipse, {
  x: 6.1,
  y: 2.35,
  w: 2.2,
  h: 1.9,
  fill: { color: C.greenDark, transparency: 30 },
  line: { color: C.green, pt: 2 },
});
s2.addText('Sri Lanka', {
  x: 5.2,
  y: 2.55,
  w: 4.1,
  h: 0.5,
  fontSize: 16,
  fontFace: 'Calibri',
  color: C.muted,
  align: 'center',
});
s2.addText('Nobody is building this for Sri Lanka.', {
  x: 5.0,
  y: 4.75,
  w: 4.45,
  h: 0.55,
  fontSize: 16,
  fontFace: 'Calibri',
  color: C.white,
  bold: true,
  align: 'center',
});

s2.addText('Gopuff × xAI launched "Go" — 2026\nBuilt on 500 US warehouses. Built for America.', {
  x: 0.55,
  y: 4.75,
  w: 4.2,
  h: 0.7,
  fontSize: 14,
  fontFace: 'Calibri',
  color: C.muted,
});

s2.addNotes(
  "A few weeks ago, Gopuff and xAI launched 'Go' — a voice AI that knows your pantry, your weather, your life, and builds your cart before you even ask. This is where grocery is going, globally. But Go works because of 500 American warehouses and American data. No one is building this for the 5.9 million households of Sri Lanka — with our prices, our pola markets, our diets, our power cuts and monsoons. We are. And we didn't wait for permission — we built it."
);

// ── Slide 3 — Meet plango AI ───────────────────────────────────────
const s3 = pres.addSlide();
darkBg(s3);
brand(s3, 3);
title(s3, 'One conversation → a full grocery plan.');

s3.addShape(pres.ShapeType.rect, {
  x: 0.55,
  y: 1.65,
  w: 5.5,
  h: 3.35,
  fill: { color: C.bgCard },
  line: { color: C.dim, pt: 1 },
  rectRadius: 0.1,
});
s3.addText('plango chat', {
  x: 0.75,
  y: 1.85,
  w: 5.1,
  h: 0.35,
  fontSize: 10,
  fontFace: 'Calibri',
  color: C.dim,
});
s3.addText('Plan 3 dinners — diabetic-friendly, under Rs 5,000', {
  x: 0.75,
  y: 2.25,
  w: 5.1,
  h: 0.45,
  fontSize: 12,
  fontFace: 'Calibri',
  color: C.white,
  fill: { color: '334155' },
  rectRadius: 0.05,
});
s3.addText('✓ 3 meal plan · shopping list · Rs 4,240 est.\n✓ Keells vs Cargills vs pola sources shown\n✓ Diet rules passed (diabetic-safe)', {
  x: 0.75,
  y: 2.85,
  w: 5.1,
  h: 2.0,
  fontSize: 13,
  fontFace: 'Calibri',
  color: C.muted,
  lineSpacingMultiple: 1.3,
});

const chips = [
  { icon: '🧠', label: 'Remembers' },
  { icon: '🛡️', label: 'Respects' },
  { icon: '🏷️', label: 'Compares' },
  { icon: '🌧️', label: 'Adapts' },
];
chips.forEach((chip, i) => {
  const x = 6.35 + (i % 2) * 1.75;
  const y = 1.85 + Math.floor(i / 2) * 1.55;
  s3.addShape(pres.ShapeType.rect, {
    x,
    y,
    w: 1.55,
    h: 1.2,
    fill: { color: C.bgCard },
    line: { color: C.green, pt: 1 },
    rectRadius: 0.08,
  });
  s3.addText(`${chip.icon} ${chip.label}`, {
    x,
    y: y + 0.35,
    w: 1.55,
    h: 0.5,
    fontSize: 14,
    fontFace: 'Calibri',
    color: C.white,
    bold: true,
    align: 'center',
  });
});

s3.addNotes(
  "plango AI is Sri Lanka's family grocery brain. You talk to it like a family member: 'Plan three dinners this week, diabetic-friendly, under 5,000 rupees.' And it does four things. It REMEMBERS — what's already in your pantry, so nothing is bought twice or wasted. It RESPECTS — every family member's allergies and diet rules, checked in code before any AI writes a word. It COMPARES — live prices across Keells, Cargills, and the pola, in rupees, with sources shown. And it ADAPTS — to weather, spoilage risk, traffic, even a supply crisis."
);

// ── Slide 4 — It's Real ────────────────────────────────────────────
const s4 = pres.addSlide();
darkBg(s4);
brand(s4, 4);
title(s4, 'Not a wireframe. A working system.');

const agents = [
  { name: 'Inventory RAG', angle: -90 },
  { name: 'Recipe Compiler', angle: -38 },
  { name: 'Route Optimizer', angle: -15 },
  { name: 'Price Catalog', angle: 15 },
  { name: 'Sensory Decay', angle: 38 },
  { name: 'Dietary Guard', angle: 90 },
  { name: 'Crisis Intel', angle: 142 },
];
const cx = 5.0;
const cy = 2.85;
const r = 1.65;

s4.addShape(pres.ShapeType.ellipse, {
  x: cx - 0.55,
  y: cy - 0.4,
  w: 1.1,
  h: 0.8,
  fill: { color: C.greenDark },
  line: { color: C.green, pt: 2 },
});
s4.addText('Orchestrator', {
  x: cx - 0.55,
  y: cy - 0.28,
  w: 1.1,
  h: 0.5,
  fontSize: 10,
  fontFace: 'Calibri',
  color: C.white,
  bold: true,
  align: 'center',
});

agents.forEach((a) => {
  const rad = (a.angle * Math.PI) / 180;
  const ax = cx + r * Math.cos(rad) - 0.55;
  const ay = cy + r * Math.sin(rad) * 0.55 - 0.28;
  s4.addShape(pres.ShapeType.ellipse, {
    x: ax,
    y: ay,
    w: 1.1,
    h: 0.55,
    fill: { color: C.bgCard },
    line: { color: C.dim, pt: 1 },
  });
  s4.addText(a.name, {
    x: ax,
    y: ay + 0.1,
    w: 1.1,
    h: 0.35,
    fontSize: 8,
    fontFace: 'Calibri',
    color: C.muted,
    align: 'center',
  });
});

const badges = [
  '9 specialist agents',
  'pgvector pantry memory',
  'live 3-store price pipeline',
  'rules before AI',
  'full fallback chain',
];
badges.forEach((b, i) => {
  const bw = 1.75;
  const gap = 0.12;
  const total = badges.length * bw + (badges.length - 1) * gap;
  const startX = (10 - total) / 2;
  const x = startX + i * (bw + gap);
  s4.addShape(pres.ShapeType.rect, {
    x,
    y: 4.55,
    w: bw,
    h: 0.55,
    fill: { color: C.bgCard },
    line: { color: C.green, pt: 1 },
    rectRadius: 0.06,
  });
  s4.addText(b, {
    x,
    y: 4.62,
    w: bw,
    h: 0.45,
    fontSize: 9,
    fontFace: 'Calibri',
    color: C.white,
    align: 'center',
  });
});

s4.addNotes(
  "You've been through our codebase in the viva, so I'll say this in one breath. Nine specialist agents behind one orchestrator. Pantry memory with vector search on Supabase. Real price comparison across three retail channels. Dietary safety enforced in code — Gemini explains decisions, it never makes safety decisions. And when an API dies mid-plan, planning continues on cached fallbacks. You verified this yourselves. It's not a wireframe — it's a working system. In fact — even when Gemini itself goes down, plango still produces a plan. Ask us how in Q&A."
);

// ── Slide 5 — Roadmap ──────────────────────────────────────────────
const s5 = pres.addSlide();
darkBg(s5);
brand(s5, 5);
title(s5, 'From planner to genius.');

const stages = [
  { label: 'TODAY', text: 'Plans when you ask', done: true },
  { label: 'NEXT', text: 'Anticipates before you ask', done: false },
  { label: 'THEN', text: 'Orders for you', done: false },
];
stages.forEach((st, i) => {
  const x = 0.55 + i * 3.15;
  s5.addShape(pres.ShapeType.rect, {
    x,
    y: 1.85,
    w: 2.85,
    h: 2.2,
    fill: { color: st.done ? C.greenDark : C.bgCard },
    line: { color: st.done ? C.green : C.dim, pt: st.done ? 2 : 1 },
    rectRadius: 0.1,
  });
  s5.addText(st.label, {
    x,
    y: 2.05,
    w: 2.85,
    h: 0.45,
    fontSize: 14,
    fontFace: 'Calibri',
    color: st.done ? C.green : C.muted,
    bold: true,
    align: 'center',
  });
  s5.addText(st.text, {
    x,
    y: 2.65,
    w: 2.85,
    h: 1.0,
    fontSize: 16,
    fontFace: 'Calibri',
    color: C.white,
    bold: true,
    align: 'center',
  });
  if (i < 2) {
    s5.addText('→', {
      x: x + 2.85,
      y: 2.5,
      w: 0.3,
      h: 0.5,
      fontSize: 24,
      color: C.dim,
      align: 'center',
    });
  }
});

s5.addText('WhatsApp · Voice in Sinhala & Tamil · Retailer partnerships', {
  x: 0.55,
  y: 4.35,
  w: 8.9,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Calibri',
  color: C.muted,
  align: 'center',
});

s5.addNotes(
  "Today, plango plans when you ask. The roadmap takes it to what you saw in that Go video — but localized. Phase one is the planning brain — built and working. Phase two is anticipation: you're low on rice, coconut oil runs out Friday, dhal prices spike next week — it's already on your list. The pantry memory and price pipeline we built are exactly the data this needs. Phase three is fulfillment: one tap to order through retailer partnerships, delivered — on WhatsApp and by voice, in Sinhala and Tamil, meeting families where they already are. Every phase builds on infrastructure that already exists in our repo. This isn't a pivot — it's a straight line."
);

// ── Slide 6 — Why We Win ───────────────────────────────────────────
const s6 = pres.addSlide();
darkBg(s6);
brand(s6, 6);
title(s6, 'The moat is local.');

const moats = [
  { title: 'Local data', desc: 'pola prices, local recipes, crisis patterns' },
  { title: 'Local economics', desc: 'engineered to run at LKR price points' },
  { title: 'Local trust', desc: "on the family's side, across every store" },
];
moats.forEach((m, i) => {
  const y = 1.75 + i * 0.95;
  s6.addShape(pres.ShapeType.rect, {
    x: 0.55,
    y,
    w: 8.9,
    h: 0.8,
    fill: { color: C.bgCard },
    line: { color: C.dim, pt: 1 },
    rectRadius: 0.06,
  });
  s6.addText(`${m.title} — ${m.desc}`, {
    x: 0.75,
    y: y + 0.18,
    w: 8.5,
    h: 0.5,
    fontSize: 17,
    fontFace: 'Calibri',
    color: C.white,
  });
});

s6.addText('5.9M households · groceries = the largest monthly spend', {
  x: 0.55,
  y: 4.55,
  w: 8.9,
  h: 0.4,
  fontSize: 13,
  fontFace: 'Calibri',
  color: C.muted,
  align: 'center',
});

s6.addNotes(
  "Why won't Google or Gopuff just do this? Three reasons. First, the data moat is local: pola wholesale prices, Sri Lankan recipes, rupee budget behavior, monsoon and crisis patterns — we're capturing data nobody else is collecting. Second, the economics are local: our cost-control engineering — template-first answers, scoped agents, capped tokens — means we can serve a Sri Lankan family at Sri Lankan price points. A US-cost AI stack can't. Third, trust is local: privacy-isolated family data, safety rules in code, sources shown for every claim. And the market is real — 5.9 million households, and groceries are the single largest monthly spend. Save a family even 15% and plango pays for itself many times over — freemium for families, referral revenue from retailers."
);

// ── Slide 7 — Team & The Ask ───────────────────────────────────────
const s7 = pres.addSlide();
darkBg(s7);
brand(s7, 7);
title(s7, 'Team Terrabytes');

const teamSlots = [
  { name: 'Member 1', role: 'Lead' },
  { name: 'Member 2', role: 'AI' },
  { name: 'Member 3', role: 'Backend' },
  { name: 'Member 4', role: 'Product' },
];
teamSlots.forEach((t, i) => {
  const x = 0.55 + i * 2.25;
  s7.addShape(pres.ShapeType.rect, {
    x,
    y: 1.75,
    w: 2.0,
    h: 1.5,
    fill: { color: C.bgCard },
    line: { color: C.dim, pt: 1 },
    rectRadius: 0.08,
  });
  s7.addShape(pres.ShapeType.ellipse, {
    x: x + 0.55,
    y: 1.95,
    w: 0.9,
    h: 0.9,
    fill: { color: '334155' },
    line: { color: C.dim, pt: 1 },
  });
  s7.addText(t.name, {
    x,
    y: 2.95,
    w: 2.0,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Calibri',
    color: C.white,
    bold: true,
    align: 'center',
  });
  s7.addText(t.role, {
    x,
    y: 3.25,
    w: 2.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Calibri',
    color: C.muted,
    align: 'center',
  });
});

s7.addShape(pres.ShapeType.rect, {
  x: 0.55,
  y: 3.75,
  w: 8.9,
  h: 0.9,
  fill: { color: C.greenDark },
  line: { color: C.green, pt: 2 },
  rectRadius: 0.08,
});
s7.addText('Idea → 9-agent production system → survived your code review.', {
  x: 0.75,
  y: 3.82,
  w: 8.5,
  h: 0.35,
  fontSize: 14,
  fontFace: 'Calibri',
  color: C.muted,
  align: 'center',
});
s7.addText('The ask: 100 pilot families in Colombo. 90 days.', {
  x: 0.75,
  y: 4.15,
  w: 8.5,
  h: 0.4,
  fontSize: 20,
  fontFace: 'Calibri',
  color: C.white,
  bold: true,
  align: 'center',
});

s7.addNotes(
  "We're Team Terrabytes. In [X weeks], we went from an idea to a nine-agent production system that survived your code review. We're here for the win — and for the backing to put plango into 100 pilot families in Colombo in the next 90 days. The system is ready. The families are waiting."
);

// ── Slide 8 — Close ────────────────────────────────────────────────
const s8 = pres.addSlide();
darkBg(s8);
brand(s8, 8);

s8.addText('plango AI', {
  x: 0.55,
  y: 1.65,
  w: 8.9,
  h: 1.0,
  fontSize: 52,
  fontFace: 'Georgia',
  color: C.white,
  bold: true,
  italic: true,
  align: 'center',
});
accentBar(s8);
s8.addShape(pres.ShapeType.rect, {
  x: 4.4,
  y: 1.55,
  w: 1.2,
  h: 0.06,
  fill: { color: C.green },
  line: { transparency: 100 },
});
s8.addText('Sri Lanka\'s grocery brain.', {
  x: 0.55,
  y: 2.75,
  w: 8.9,
  h: 0.6,
  fontSize: 28,
  fontFace: 'Georgia',
  color: C.green,
  bold: true,
  align: 'center',
});
s8.addText('Remembers your home. Respects your family. Works through the storm.', {
  x: 1.0,
  y: 3.45,
  w: 8.0,
  h: 0.8,
  fontSize: 18,
  fontFace: 'Calibri',
  color: C.muted,
  align: 'center',
});

s8.addNotes(
  "Gopuff needed 500 warehouses and the world's biggest AI lab to build a shopping genius for America. We built one for the Sri Lankan family — it remembers your home, respects your family, and keeps working through the storm. plango AI. Sri Lanka's grocery brain. Thank you."
);

await pres.writeFile({ fileName: OUT });
console.log(`Created: ${OUT}`);
