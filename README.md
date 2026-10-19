# Inkseq TV — viewing prototype

Clickable prototype of **Inkseq TV**, the viewer-facing site for stories made with [Inkseq](https://inkseq.com).
Planning issue: inkseq/h3-studio#311 (structure and retention decisions are in its owner-decision comments).

All visuals are placeholders (gradients); there is no real footage, backend or payment. State lives in `localStorage`.

## Run

```bash
npm install
npm run dev   # http://127.0.0.1:5199
```

Phone layout below 1024 px, website layout above. English and Chinese.

## What it demonstrates

- **One platform, per-genre acquisition.** Genre tabs (Romance, Anime, Classics, Sci-fi, History & myth, Mystery & horror) plus *For you*.
  Genre landing pages at `/romance`, `/anime`, … where the first episodes play without sign-up. `?ref=<channel>` tags the source.
- **One URL per show** for SEO and sharing: `/s/<show>` and `/s/<show>/<episode>`.
- **Retention**
  - The entry genre sticks: later visits open on that tab.
  - Onboarding picks 1–3 interests, with the entry genre preselected.
  - *Continue watching* is the top row.
  - Episodes end with a next-episode countdown plus three similar picks.
  - Viewers can follow shows and creators, with opt-in new-episode notes.
  - The feed is about 80% preferred genres and 20% adjacent ones.
- **Ratings.** 16+ titles (horror, mature romance) are hidden until a year-of-birth confirmation. No children's channel and no adult content.
- **Money.**
  - TV coins (per-episode unlock) and weekly/monthly memberships through Stripe Checkout (mocked).
  - One-tap cancel and a renewal reminder; no free trials.
  - Purchases are not available in mainland China (Stripe Managed Payments limitation).
- **Account and wallet.** Sign-in is shared with inkseq.com. TV coins are kept separate from Inkseq creator credits.
- **Analytics (demo tools).** Visitors → sign-ups → payers by genre × channel, plus D1/D7, episodes per session, completion and follow rate, using synthetic sample data.

## Operating assumptions (owner decisions, 2026-10-19)

- Brand **Inkseq TV**, operated by a subsidiary with its own Stripe account; shared login, separate wallet.
- Curated, reviewed works only at launch: no open uploads and no comments.

## Code map

| File | What |
|---|---|
| `src/data.js`, `src/data_zh.js` | Catalogue, genres, prices |
| `src/i18n.js` | UI strings (EN/ZH) |
| `src/store.jsx` | State, gates (16+, paywall), feed ranking |
| `src/router.jsx` | Landing URLs, `ref`, per-show URLs |
| `src/screens.jsx` | Home / genre tabs, Discover feed, My list, show page, Me |
| `src/player.jsx` | Player, end card |
| `src/sheets.jsx` | Onboarding, sign-in, 16+, notifications, creator, unlock, checkout, membership, analytics |
| `src/desktop.jsx`, `src/main.jsx` | Website and phone shells |
