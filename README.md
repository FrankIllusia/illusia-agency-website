# Illusia Agency Website

New illusiaagency.com — Next.js 14, TypeScript, Tailwind, GSAP.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + inline styles
- **Animations**: GSAP + ScrollTrigger (scroll-driven hero)
- **Deployment**: Vercel

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Project Structure

```
app/
  components/
    Nav.tsx          ← Fixed navigation bar (mobile-responsive)
    Hero.tsx         ← Scroll-driven hero section (GSAP ScrollTrigger)
    Work.tsx         ← Project/case study grid (Kursza-style hover glow)
    Services.tsx     ← Services list
    AISection.tsx    ← AI expertise section
    About.tsx        ← About section
    Team.tsx         ← Team cards
    Contact.tsx      ← Contact CTA + footer
  globals.css        ← Design tokens, global styles, shared component styles
  layout.tsx         ← Root layout + metadata
  page.tsx           ← Home page (assembles all sections)
public/
  images/
    hero-reel.mp4    ← Hero background video (upload here)
    hero-poster.jpg  ← Hero video poster frame
    about.jpg        ← About section image
    work/            ← Project images (tyson.jpg, etc.)
    team/            ← Team headshots (frank.jpg, parker.jpg, etc.)
```

## Collaboration

Both Frank (Xavier/OpenClaw) and Parker (Claude Code) work on this repo simultaneously.

**Workflow:**
- `main` → production branch, auto-deploys to Vercel
- Parker: create a branch `parker/[feature]`, PR into main when ready
- Xavier: commits directly to main for smaller fixes, branches for bigger features
- **Don't edit the same file at the same time** — sections are split into separate components to make this easy

## Replacing Placeholders

| File | What to replace |
|------|----------------|
| `Hero.tsx` | `/images/hero-reel.mp4` — upload actual reel video |
| `Work.tsx` | `projects` array — add real client/title/image/year data |
| `Team.tsx` | `team` array — add real names, roles, headshots |
| `Contact.tsx` | Email address |

## Deploying

Push to `main` → Vercel auto-deploys. Point `illusiaagency.com` DNS to Vercel when ready.
