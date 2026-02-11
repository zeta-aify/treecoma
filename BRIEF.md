# Treecoma × Ban Pastarini — Project Brief

*Created: 2026-02-11*
*Status: Planning*

## Vision

Build a complete digital presence for an Italian-Thai family business that combines **premium organic cannabis** and **artisan pizza** — two passion projects grown with love in Thailand.

## The Business

### Brand Names
- **Treecoma** — the cannabis brand
- **Ban Pastarini** — (verify exact name from image)

### What Makes It Special
- 🌱 **100% organic** — entire process from seed to sale
- 👨‍👩‍👧‍👦 **Family-owned** — Italian-Thai family, authentic story
- 📜 **Licensed** — government-approved to grow and sell
- 🧬 **Strain: Atena** — premium, government-approved variety
- 🍕 **Pizza too** — they make perfect artisan pizza
- ❤️ **Made with love** — beautiful place, passionate people

### Target Audience
- Weed lovers
- Nature lovers
- Life lovers
- Premium/quality-focused consumers

## Deliverables

### 1. E-Commerce Website
- [ ] Beautiful, premium design matching the brand
- [ ] Product catalog (weed strains, possibly pizza?)
- [ ] Shopping cart & checkout
- [ ] Email capture system
- [ ] Shipping information
- [ ] "About" story — focus on family, organic process, love

### 2. Chat Interface / Admin System
- [ ] Easy for the family to manage orders
- [ ] WhatsApp integration (?)
- [ ] Simple enough for non-tech people
- [ ] Notifications for new orders

### 3. Instagram Presence
- [ ] Create business account(s)
- [ ] AI-powered content database (like LinkedIn engine)
- [ ] Family uploads photos → AI generates captions/posts
- [ ] Consistent brand aesthetic

### 4. Family Documentation
- [ ] Simple guide: "How to use the system"
- [ ] Photo upload workflow (WhatsApp channel?)
- [ ] What photos to take (farm, plants, process, pizza, family)

### 5. Marketing (Phase 2)
- [ ] Google Ads setup
- [ ] Meta Ads (TBD — cannabis restrictions)
- [ ] SEO optimization

## Content Focus

**DO focus on:**
- The family story
- How they grow (organic process)
- The beautiful location
- The love and passion
- Premium quality

**DON'T over-focus on:**
- Government certifications (mention, but don't lead with)
- Technical strain details (keep accessible)

## Research Needed

- [ ] "Atena" strain — what is it? Government approval details?
- [ ] Cannabis e-commerce regulations in Thailand
- [ ] Payment processing options for cannabis
- [ ] Shipping/delivery regulations
- [ ] Meta/Google Ads policies for cannabis in Thailand

## Agent Architecture (Proposed)

```
┌─────────────────────────────────────────────────────┐
│                    ZETA (Main)                      │
│            Orchestration & Strategy                 │
└─────────────────────────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    ▼                    ▼                    ▼
┌─────────┐       ┌─────────────┐      ┌──────────┐
│  WEB    │       │   CONTENT   │      │  SOCIAL  │
│  Agent  │       │    Agent    │      │  Agent   │
│ (build) │       │ (copy/SEO)  │      │(IG/posts)│
└─────────┘       └─────────────┘      └──────────┘
   Sonnet             Sonnet              Haiku
```

## Tech Stack (Proposed)

- **Website:** Static site (Astro/Next.js) + Supabase backend
- **E-commerce:** Snipcart / Shopify Lite / Custom
- **Database:** Supabase (like LinkedIn engine)
- **Hosting:** Vercel / Netlify
- **Instagram:** Meta Business API or manual + AI captions
- **Chat:** WhatsApp Business API or Telegram bot

## Next Steps

1. [ ] Get image in readable format (JPG/PNG)
2. [ ] Research Thai cannabis e-commerce regulations
3. [ ] Design agent architecture in detail
4. [ ] Create content database schema
5. [ ] Build MVP website structure
6. [ ] Set up Instagram business account

---

*This is a living document. Update as project evolves.*
