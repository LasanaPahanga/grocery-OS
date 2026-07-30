# plango AI — Finale Pitch Deck Spec (8 slides, 5-minute pitch)

This file specifies exactly what goes on each slide so the deck can be generated in any tool (Gamma, Canva, PowerPoint, etc.).

**Global design direction**
- Theme: dark background, one accent color (plango green or warm orange), large bold typography.
- Rule: max ~10 words of visible text per slide. Slides are backdrops, not documents.
- Every slide: plango AI logo small in a corner, slide number small.
- Fonts: one display font for headlines, one clean sans for body.

---

## Slide 1 — The Hook

**Slide title (on slide):** `Tuesday, 6 PM, Colombo.`

**On-slide text (exact):**
> 35% of food wasted · 20–30% savings missed · hours lost every week

**Visual:** Full-bleed photo of a rainy Colombo street or a busy Sri Lankan kitchen at dusk. Dark overlay so the text pops. No product UI, no logo emphasis — pure story.

**Speaker notes (0:00–0:35):**
"It's Tuesday, 6 pm in Colombo. Amma is deciding dinner. She forgets the rice is finished. She buys fish someone in the family can't eat. Last week's tomatoes have spoiled. And it's starting to rain. Every Sri Lankan family knows this evening. Around 35% of household food ends up wasted, 20 to 30% of savings are missed from unplanned buying, and hours every week disappear into juggling lists, prices, and diets. This isn't a convenience problem — in this economy, it's a household finance problem."

---

## Slide 2 — The World Just Validated This

**Slide title (on slide):** `The "personal shopping genius" is here.`

**On-slide text (exact):**
> Gopuff × xAI launched "Go" — 2026
> Built on 500 US warehouses. Built for America.
> **Nobody is building this for Sri Lanka.**

**Visual:** Split layout — left: a still/reference frame from the Gopuff "Go" launch video (or a stylized mock of a voice-AI cart). Right: a map of Sri Lanka, dimmed/empty. The contrast IS the message.

**Speaker notes (0:35–1:10):**
"A few weeks ago, Gopuff and xAI launched 'Go' — a voice AI that knows your pantry, your weather, your life, and builds your cart before you even ask. This is where grocery is going, globally. But Go works because of 500 American warehouses and American data. No one is building this for the 5.9 million households of Sri Lanka — with our prices, our pola markets, our diets, our power cuts and monsoons. We are. And we didn't wait for permission — we built it."

---

## Slide 3 — Meet plango AI

**Slide title (on slide):** `One conversation → a full grocery plan.`

**On-slide text (exact — 4 words with icons):**
> 🧠 Remembers · 🛡️ Respects · 🏷️ Compares · 🌧️ Adapts

**Visual:** One clean screenshot of the plango chat with a real plan output (recipes + shopping list + savings in LKR). The four words as icon chips below or beside it.

**Speaker notes (1:10–1:50):**
"plango AI is Sri Lanka's family grocery brain. You talk to it like a family member: 'Plan three dinners this week, diabetic-friendly, under 5,000 rupees.' And it does four things. It REMEMBERS — what's already in your pantry, so nothing is bought twice or wasted. It RESPECTS — every family member's allergies and diet rules, checked in code before any AI writes a word. It COMPARES — live prices across Keells, Cargills, and the pola, in rupees, with sources shown. And it ADAPTS — to weather, spoilage risk, traffic, even a supply crisis."

---

## Slide 4 — It's Real. You've Seen the Code.

**Slide title (on slide):** `Not a wireframe. A working system.`

**On-slide text (exact — badge/chip style):**
> 9 specialist agents · pgvector pantry memory · live 3-store price pipeline · rules before AI · full fallback chain

**Visual:** Simplified agent-swarm diagram (orchestrator in center, 8 agents around it) — clean, minimal, no labels beyond agent names. The five capability badges across the bottom.

**Speaker notes (1:50–2:40):**
"You've been through our codebase in the viva, so I'll say this in one breath. Nine specialist agents behind one orchestrator. Pantry memory with vector search on Supabase. Real price comparison across three retail channels. Dietary safety enforced in code — Gemini explains decisions, it never makes safety decisions. And when an API dies mid-plan, planning continues on cached fallbacks. You verified this yourselves. It's not a wireframe — it's a working system. In fact — even when Gemini itself goes down, plango still produces a plan. Ask us how in Q&A."

---

## Slide 5 — The Roadmap

**Slide title (on slide):** `From planner to genius.`

**On-slide text (exact — 3-step arrow):**
> **TODAY** Plans when you ask → **NEXT** Anticipates before you ask → **THEN** Orders for you

**Sub-text (small):** WhatsApp · Voice in Sinhala & Tamil · Retailer partnerships

**Visual:** Horizontal 3-stage arrow/timeline, left to right, with the first stage highlighted/filled (= done) and the next two outlined (= roadmap).

**Speaker notes (2:40–3:25):**
"Today, plango plans when you ask. The roadmap takes it to what you saw in that Go video — but localized. Phase one is the planning brain — built and working. Phase two is anticipation: you're low on rice, coconut oil runs out Friday, dhal prices spike next week — it's already on your list. The pantry memory and price pipeline we built are exactly the data this needs. Phase three is fulfillment: one tap to order through retailer partnerships, delivered — on WhatsApp and by voice, in Sinhala and Tamil, meeting families where they already are. Every phase builds on infrastructure that already exists in our repo. This isn't a pivot — it's a straight line."

---

## Slide 6 — Why We Win

**Slide title (on slide):** `The moat is local.`

**On-slide text (exact — 3 rows):**
> **Local data** — pola prices, local recipes, crisis patterns
> **Local economics** — engineered to run at LKR price points
> **Local trust** — on the family's side, across every store

**Sub-text (small, one line):** 5.9M households · groceries = the largest monthly spend

**Visual:** Three horizontal bars/cards, one per moat. Keep the market stat as a single small footer line — one number only.

**Speaker notes (3:25–4:05):**
"Why won't Google or Gopuff just do this? Three reasons. First, the data moat is local: pola wholesale prices, Sri Lankan recipes, rupee budget behavior, monsoon and crisis patterns — we're capturing data nobody else is collecting. Second, the economics are local: our cost-control engineering — template-first answers, scoped agents, capped tokens — means we can serve a Sri Lankan family at Sri Lankan price points. A US-cost AI stack can't. Third, trust is local: privacy-isolated family data, safety rules in code, sources shown for every claim. And the market is real — 5.9 million households, and groceries are the single largest monthly spend. Save a family even 15% and plango pays for itself many times over — freemium for families, referral revenue from retailers."

---

## Slide 7 — Team & The Ask

**Slide title (on slide):** `Team Terrabytes`

**On-slide text (exact):**
> Idea → 9-agent production system → survived your code review.
> **The ask: 100 pilot families in Colombo. 90 days.**

**Visual:** Team photo (or headshot grid), names + one-word roles under each. The ask as a bold banner at the bottom.

**Speaker notes (4:05–4:35):**
"We're Team Terrabytes. In [X weeks], we went from an idea to a nine-agent production system that survived your code review. We're here for the win — and for the backing to put plango into 100 pilot families in Colombo in the next 90 days. The system is ready. The families are waiting."

*(Adjust the ask to what the finale actually awards — funding, incubation, or placement.)*

---

## Slide 8 — Close

**Slide title (on slide):** `plango AI`

**On-slide text (exact):**
> **Sri Lanka's grocery brain.**
> Remembers your home. Respects your family. Works through the storm.

**Visual:** Logo centered, tagline under it, dark background. Nothing else. This slide stays up during Q&A.

**Speaker notes (4:35–4:50 — memorize verbatim):**
"Gopuff needed 500 warehouses and the world's biggest AI lab to build a shopping genius for America. We built one for the Sri Lankan family — it remembers your home, respects your family, and keeps working through the storm. plango AI. Sri Lanka's grocery brain. Thank you."

---

## Timing table

| # | Slide | Duration | Ends at |
|---|-------|----------|---------|
| 1 | Tuesday, 6 PM, Colombo | 0:35 | 0:35 |
| 2 | The world just validated this | 0:35 | 1:10 |
| 3 | Meet plango AI | 0:40 | 1:50 |
| 4 | It's real — you've seen the code | 0:50 | 2:40 |
| 5 | The roadmap | 0:45 | 3:25 |
| 6 | Why we win | 0:40 | 4:05 |
| 7 | Team & the ask | 0:30 | 4:35 |
| 8 | Close | 0:15 | 4:50 |

Target 4:50 — finishing early reads as confidence; running over reads as losing control.
