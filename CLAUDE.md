# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A mobile-first Persian (RTL) smart coffee menu prototype ("منوی هوشمند کافه دی") built with Next.js (App Router), React, TypeScript, Tailwind CSS, and Framer Motion. It's a single-page quiz: the user answers mood/flavor/temperature/base/extras questions and gets a recommended drink, with an optional order flow that notifies the cafe owner via Telegram.

## Commands

```bash
npm install
npm run dev          # local dev server at http://localhost:3000
npm run build         # next build
npm run pages:build   # same as build; used by the GitHub Pages workflow
npm run start          # serve a production build
npm run lint            # eslint .
```

There is no test suite/framework configured in this repo.

## Architecture

- **Static export, no backend.** `next.config.mjs` sets `output: "export"`; the entire site is prerendered to static HTML/JS and served from GitHub Pages (see `.github/workflows/deploy-pages.yml`). There is no server runtime, no API routes, and no database — everything client-side.
- **GitHub Pages base path.** `next.config.mjs` computes `basePath`/`assetPrefix` from `GITHUB_REPOSITORY` when building under GitHub Actions (skipped for `*.github.io` user/org sites), exposed to client code as `NEXT_PUBLIC_BASE_PATH`. Any hardcoded asset URL (images, etc.) must be prefixed with `process.env.NEXT_PUBLIC_BASE_PATH` (see `BASE_PATH` usage in `app/page.tsx`) rather than starting from `/`.
- **Single-page quiz flow.** `app/page.tsx` is essentially the whole app: a `stepIndex` state machine (0 = start screen, 1-5 = question screens for mood/flavor/temperature/base/extras, 6 = result) rendered inside one `AnimatePresence`/`motion.section` transition. Question screens share the `QuestionScreen` wrapper and a custom scroll-snap `WheelPicker` component (drag-to-select list with a draggable side-thumb scrollbar, built from raw pointer/scroll events, no external carousel library).
- **Recommendation engine.** `lib/menu-data.ts` holds the static drink catalog (`drinks`) and the answer option lists (`moods`, `flavors`, `temperatures`, `bases`, `extras`), all in Persian. `recommendDrink()` scores every drink against the user's answers (flavor weighted highest, then temperature/base, then mood) and returns the best match plus the matched-criteria explanations shown on the result screen. `findSimilarDrink()` in `app/page.tsx` picks a second suggestion sharing flavor/temperature with the winner.
- **Order notification is a separate Cloudflare Worker**, not part of this Next.js app. `app/page.tsx`'s `sendOrderNotification()` POSTs `{ name, drink }` to `NEXT_PUBLIC_ORDER_WEBHOOK_URL` (baked in at build time from the `ORDER_WEBHOOK_URL` repo variable). The worker itself (`worker/worker.js`) forwards it to Telegram; it's deployed independently via the Cloudflare dashboard as described in `worker/README.md` and is not built/deployed by this repo's CI. If the webhook URL isn't configured, ordering silently no-ops (logs a warning) instead of failing.
- **Images** live under `public/images/{drinks,flavors,temps,extras}` and are referenced by the `visual`/`photo` keys defined alongside each option/drink in `lib/menu-data.ts` — adding a new drink or option normally means adding both a data entry and a matching image file.
- **Styling** is Tailwind plus a substantial block of hand-written CSS in `app/globals.css` for the liquid-glass buttons, the phone-shell frame (`.app-shell`), and the `WheelPicker`'s scroll-snap/thumb visuals. The `cafe` color palette and Vazirmatn font (loaded via `next/font/google` in `app/layout.tsx`) are the only theme customizations in `tailwind.config.ts`.
