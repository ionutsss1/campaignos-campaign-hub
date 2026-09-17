# CampaignOS · Campaign Hub (Variant B)

A prototype of the brand-facing **Campaign Hub** for CampaignOS. The layout takes its structure from game UIs (lobby, mode select, level map, season pass, daily rewards, quest board, item shop, loot reveal); the styling stays premium and muted.

Design source: Figma file **campaign os**, page *Campaign Hub — Variant B (Game)*.

## Sections

| # | Section | Behaviour |
|---|---------|-----------|
| — | HUD | Glass bar after scroll, active tab follows the section in view, XP and streak counters tween on change |
| 00 | Lobby | Full-bleed key art with parallax, masked title reveal, live "next draw" countdown, magnetic buttons |
| 01 | Choose your game | Five full-height posters; the hovered/focused one expands and reveals details (swipe carousel on mobile) |
| 02 | Season journey | Map stage; the cleared path draws itself on scroll, stops pop in, live stop pulses with a floating popover (vertical timeline on mobile) |
| 03 | Brand Pass | 20-tier track with drag-to-scroll and momentum, "You are here" marker, chests every 5 tiers |
| 04 | Daily & quests | 7-day streak with a working **Claim** (tile flip, +25 XP, toast), quest stepper and animated mission progress |
| 05 | Prize vault | Rarity filter animated with GSAP Flip, image zoom and rarity glow on hover |
| 06 | Mystery drop | Live countdown with digit transitions, reminder toggle, rotating winners feed, leaderboard |
| — | Footer | **Brand Kit** switch (Demo A / Demo B) that re-themes the accent through a registered CSS custom property |

## Stack

- React 19 + TypeScript + Vite
- [GSAP](https://gsap.com) (ScrollTrigger, SplitText, Flip, ScrollToPlugin) via `@gsap/react`
- [Lenis](https://lenis.darkroom.engineering) smooth scrolling, synced to the GSAP ticker
- Plain CSS with design tokens that mirror the Figma variable collections (`src/styles/global.css`)
- Respects `prefers-reduced-motion` (Lenis and scroll animations are disabled)

## Run

```bash
npm install
npm run dev
```

`npm run build` outputs a static site to `dist/` (relative base, works under any sub-path). Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

QA helpers (use the local Microsoft Edge install): `node scripts/shots.mjs 1440 900 shots` for section screenshots, `node scripts/interact.mjs` for the claim / filter / hover checks.

## Notes

- All imagery was generated with Gemini for this prototype; brand names are placeholders for demo purposes.
- Data is static (`src/data.ts`); XP, streak, quests, stock and winners need backend support in CampaignOS.
