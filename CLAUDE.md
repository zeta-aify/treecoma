# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Treecoma x Ban Pastarini — building the complete digital presence for an Italian-Thai family business selling premium organic cannabis (Treecoma) and artisan pizza (Ban Pastarini) in Thailand. The project is currently in **planning phase** with no code implemented yet.

## Repository Structure

- `BRIEF.md` — master project brief with vision, deliverables, and research needs
- `workspace/` — AI agent workspace containing:
  - `SOUL.md` — agent persona and brand tone guidelines
  - `AGENTS.md` — session workflow and phase priorities
  - `BRIEF.md` — project brief (duplicate of root)
  - `TODO.md` — current task list with priority levels

## Proposed Tech Stack (not yet implemented)

- **Website:** Astro or Next.js (static site)
- **Backend/Database:** Supabase
- **E-commerce:** Snipcart / Shopify Lite / Custom
- **Hosting:** Vercel or Netlify
- **Social:** Meta Business API or manual + AI captions
- **Chat:** WhatsApp Business API or Telegram bot

## Agent Architecture

ZETA is the main orchestrator. Three sub-agents are planned: WEB (site building), CONTENT (copy/SEO), and SOCIAL (Instagram/posts). See `BRIEF.md` for the full diagram.

## Brand & Content Guidelines

All generated copy and design should match the brand tone defined in `workspace/SOUL.md`:
- Organic, natural, authentic
- Family-first, made with love
- Premium quality, relaxed but professional
- Story-driven — show, don't tell
- Content should focus on the family story, organic growing process, and the location
- Avoid leading with government certifications or overly technical strain details

## Key Constraints

- Cannabis e-commerce regulations in Thailand must be researched before building checkout/payment flows
- Cannabis advertising restrictions apply to Meta and Google Ads — verify policies before any marketing implementation
- All external-facing content or publishing requires approval before going live
- Admin tools must be simple enough for non-technical family members
