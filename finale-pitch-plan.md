# plango AI — Finale Pitch Plan (5 min pitch + 5 min Q&A)

## Strategic read of the situation

- The judges **already did the viva and read your codebase**. They know the tech is real. Re-explaining architecture wastes your 5 minutes and bores them.
- The organizers' brief says it plainly: *real problem, purpose over hype, tell a good story, stay cool in Q&A*. This round is judged on **conviction, clarity, and vision** — Shark Tank, not a design review.
- Your secret weapon is the **Gopuff × Grok "Go" video**: the world's biggest players just validated the exact category you're building — the *personal shopping genius*. Your pitch: **that future is coming everywhere, but nobody is building it for the Sri Lankan family — except us. And ours already works.**

**The one-sentence thesis of the pitch:**
> "Gopuff needed 500 warehouses and Grok to build their shopping genius for America. We built one for the Sri Lankan family — and it works today, on real Keells and pola prices, through a real monsoon."

---

## Structure: 8 slides, ~5:00 total (target 4:40 to leave buffer)

### Slide 1 — The Hook: a Tuesday evening (0:00 – 0:35)
**Visual:** One photo — a stressed parent in a kitchen, or a rain-soaked Colombo street. No text except the logo.

**Script beats:**
- Open with the story, not the product: *"It's Tuesday, 6 pm in Colombo. Amma is deciding dinner. She forgets the rice is finished. She buys fish someone in the family can't eat. The tomatoes from last week have spoiled. And it's starting to rain."*
- Land the numbers fast: **~35% of household food wasted, 20–30% savings missed, hours every week lost** juggling lists, prices, and diets.
- *"This isn't a convenience problem. In this economy, it's a household finance problem."*

**Why this works:** Judges' brief said "solve a real problem." You anchor emotionally AND economically in 35 seconds.

---

### Slide 2 — The world just validated this category (0:35 – 1:10)
**Visual:** A single still/frame reference from the Gopuff "Go" launch + one line: *"The personal shopping genius — Gopuff × xAI, 2026."*

**Script beats:**
- *"A few weeks ago, Gopuff and xAI launched 'Go' — a voice AI that knows your pantry, your weather, your life, and builds your cart before you ask. This is where grocery is going, globally."*
- The pivot — say it slowly: *"But Go works because of 500 US warehouses and American data. **No one is building this for the 5.9 million households of Sri Lanka** — with our prices, our pola markets, our diets, our power cuts and monsoons."*
- *"We are. And we didn't wait for permission — we built it."*

**Why this works:** You borrow a billion-dollar company's market validation, then position their strength (US infrastructure) as the exact reason they can't serve your market. Instant "why now + why us."

---

### Slide 3 — Meet plango AI (1:10 – 1:50)
**Visual:** One screenshot of the chat + plan output. One tagline: *"One conversation → a full grocery plan."*

**Script beats:**
- *"plango AI is Sri Lanka's family grocery brain. You talk to it like a family member: 'Plan 3 dinners this week, diabetic-friendly, under 5,000 rupees.'"*
- It answers with four things, tick them off on fingers:
  1. **Remembers** — what's already in your pantry, so nothing is bought twice or wasted.
  2. **Respects** — every family member's allergies and diet rules, checked in code before any AI writes a word.
  3. **Compares** — live prices across Keells, Cargills and the pola, in rupees, with sources shown.
  4. **Adapts** — to weather, spoilage risk, traffic, even a supply crisis.

---

### Slide 4 — And it's real. You've seen the code. (1:50 – 2:40)
**Visual:** The agent-swarm diagram from the old deck, simplified. Badge-style callouts: *9 agents · pgvector RAG memory · live price pipeline · rules-before-AI · full fallback chain.*

**Script beats:**
- Address the judges directly — this is your credibility moment: *"You've been through our codebase in the viva, so I'll say this in one breath:"*
- *"Nine specialist agents behind one orchestrator. Pantry memory with vector search on Supabase. Real price comparison across three retail channels. Dietary safety enforced in code — Gemini explains decisions, it never makes safety decisions. And when an API dies mid-plan, planning continues on cached fallbacks. You verified this. It's not a wireframe — it's a working system."*
- Optional flex if timing allows: *"When Gemini itself goes down, plango still produces a plan. Ask us how in Q&A."* (Plants a question you want.)

**Why this works:** 50 seconds of dense, confident proof — no diagrams walked through, because they've already inspected it. Planting a Q&A question gives you a home-field first question.

---

### Slide 5 — From planner to genius: the roadmap (2:40 – 3:25)
**Visual:** A 3-step horizontal arrow: **Today: Plans when you ask → Next: Anticipates before you ask → Then: Orders for you.**

**Script beats:**
- *"Today, plango plans when you ask. The roadmap takes it to what you saw in that Go video — but localized:"*
  - **Phase 1 (now):** the planning brain — built, working.
  - **Phase 2:** anticipation — *"You're low on rice, coconut oil runs out Friday, dhal prices spike next week — it's already in your list."* The pantry memory and price pipeline we built are exactly the data this needs.
  - **Phase 3:** fulfillment — one tap to order via retailer partnerships (Keells/Cargills online) and delivery integration. **WhatsApp and voice in Sinhala and Tamil** — meeting families where they already are.
- *"Every phase is built on infrastructure that already exists in our repo. This isn't a pivot — it's a straight line."*

---

### Slide 6 — Why we win this market (3:25 – 4:05)
**Visual:** Simple 2-column: *"Global AI assistants"* vs *"plango AI"* — 3 rows max.

**Script beats:**
- *"Why won't Google or Gopuff just do this? Three reasons:"*
  1. **The data moat is local:** pola wholesale prices, Sri Lankan recipes, LKR budget behavior, monsoon-and-crisis patterns. We're capturing data nobody else is collecting.
  2. **The economics are local:** our cost-control engineering (template-first answers, scoped agents, capped tokens) means we can serve a Sri Lankan family at Sri Lankan price points. A US-cost AI stack can't.
  3. **Trust is local:** privacy-isolated family data, safety rules in code, sources shown for every claim. Families will let *this* into their kitchen.
- Market line: *"5.9M households; groceries are the single largest monthly spend. Save a family even 15% and plango pays for itself many times over — freemium for families, referral/partnership revenue from retailers."*

*(Adjust the household number/monetization line to whatever your team has actually validated — keep exactly one market stat and one revenue sentence. More becomes noise in 5 minutes.)*

---

### Slide 7 — The team + the ask (4:05 – 4:35)
**Visual:** Team photo, one line per person max.

**Script beats:**
- *"We're Team Terrabytes. In [X weeks], we went from an idea to a nine-agent production system that survived your code review."*
- The ask (tune to what the finale actually offers — placement, incubation, funding): *"We're here for the win — and for backing to put plango into 100 pilot families in Colombo in the next 90 days. The system is ready. The families are waiting."*

---

### Slide 8 — Close (4:35 – 4:50)
**Visual:** Logo + closing line only.

**Script — the callback, memorized word-for-word:**
> *"Gopuff needed 500 warehouses and the world's biggest AI lab to build a shopping genius for America. We built one for the Sri Lankan family — it remembers your home, respects your family, and keeps working through the storm. **plango AI. Sri Lanka's grocery brain.** Thank you."*

Stop. Smile. Invite questions. Finishing 10–20 seconds early reads as confidence; running over reads as losing control.

---

## Timing summary

| # | Slide | Time | Cumulative |
|---|-------|------|------------|
| 1 | Tuesday-evening hook + problem | 0:35 | 0:35 |
| 2 | Gopuff/Go — category validated, gap is local | 0:35 | 1:10 |
| 3 | plango AI — the solution | 0:40 | 1:50 |
| 4 | It's real — you've seen the code | 0:50 | 2:40 |
| 5 | Roadmap: planner → anticipator → orderer | 0:45 | 3:25 |
| 6 | Moat, market, model | 0:40 | 4:05 |
| 7 | Team + ask | 0:30 | 4:35 |
| 8 | Close (callback line) | 0:15 | 4:50 |

~700 spoken words total. Rehearse to a hard 4:50.

---

## Q&A prep (5 min) — likely questions and answer angles

**Business / vision (most likely in a Shark Tank finale):**
1. *"How do you make money?"* — Freemium households; retailer partnerships (affiliate/referral on fulfilled baskets); anonymized demand insights for FMCG/retail later. Lead with the retailer referral model — it aligns your incentive with the family's savings.
2. *"What if Keells builds this themselves?"* — A retailer's assistant will always push its own shelves. plango's value is being **on the family's side** — comparing across Keells, Cargills AND the pola. Neutrality is the product.
3. *"Gopuff/Google enters Sri Lanka — then what?"* — They validated the category; localization is the moat (pola prices, local recipes, LKR behavior, Sinhala/Tamil, crisis patterns). We'd be the acquisition target, not the casualty — and that's a fine outcome too.
4. *"Who's your first user, how do you get them?"* — Pilot cohort of Colombo families via [your actual channel]; WhatsApp-first onboarding keeps acquisition cost near zero.

**Technical (they know the code — expect sharp ones):**
5. *"Gemini API costs at scale?"* — Point to what's built: template-first responses, intent-scoped agent activation (simple asks skip the swarm), capped tokens per household, vector-narrowed context. Cost per plan is engineered down, not hoped down.
6. *"Hallucinated prices or unsafe meals?"* — Prices come from the live pipeline/cache, never generated. Diet rules run in code before AI touches the plan; Gemini only explains. Every claim carries a source.
7. *"What happens when Gemini is down?"* (the one you planted) — Cached templates produce a basic plan instantly; each agent has a fallback; orchestrator continues with survivors. Demo-ready answer.
8. *"Price data freshness/accuracy?"* — Crawl + cache with TTL, plausibility checks against catalog, stale prices flagged as possibly outdated rather than hidden. Honesty over false precision.

**Q&A conduct (from the organizers' own tips):**
- One person fields, then routes: business → [name], technical → [name]. Never two people answering at once.
- Pause one beat before answering — it reads as thoughtfulness.
- If you don't know: *"We haven't validated that yet — here's how we would."* Never bluff a panel that has read your code.

---

## Delivery notes

- **Two speakers max.** Suggested split: Speaker A does slides 1–3 (story), Speaker B does 4–6 (proof + vision), Speaker A returns for 7–8 (ask + close). The handoff at slide 4 signals depth of team.
- **Slides are backdrops, not documents.** Max ~10 words visible per slide. Your old deck was a viva document; this one is a stage prop.
- **Memorize three things verbatim:** the opening story, the Gopuff pivot line ("no one is building this for Sri Lanka — we are"), and the closing callback. Everything else can flex.
- **Energy per the organizers' brief:** they literally asked for it — "bring the energy, make it unforgettable." Rehearse standing, timed, at performance volume, at least 5 full runs.
