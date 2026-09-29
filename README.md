# Serrano Digital — website

Astro + plain CSS + minimal vanilla JS. No React, no UI framework, no CMS.
Single-page site, static output, deploys anywhere that serves static files.

## What's where (edit these first)

| To change...                                   | Edit this file                                    |
|-------------------------------------------------|----------------------------------------------------|
| Phone, email, prices, service area, nav labels   | `src/config.js`                                     |
| Section copy (About, Why Local, Small Business)  | The matching component in `src/components/*.astro` |
| Colors / fonts / spacing                         | `src/styles/global.css` (`:root` variables at top)  |
| Logo                                             | `public/logo.svg` (placeholder — see below)         |
| FAQ questions                                    | `src/config.js` → `faqs` array                      |
| Services grid                                    | `src/config.js` → `services` array                  |
| Contact form fields / destination                | `src/components/Contact.astro` + `FORM_ACTION` in `src/config.js` |
| SERRA chatbot flow                               | `src/scripts/serra.js` → `STEPS` object              |

Almost everything text-based lives in **`src/config.js`** on purpose — you
shouldn't have to touch markup to change a price or the phone number.

## About the logo

I didn't have your actual logo file, so `public/logo.svg` is a placeholder
wordmark (black square "S" mark + "Serrano Digital" in system font). Drop
your real logo in as `public/logo.svg` (or `.png`) and update the `src`
attribute in `src/components/Header.astro` if the filename changes.

## About the contact form

It posts to [FormSubmit.co](https://formsubmit.co) — a free relay that
emails form submissions to you with **no backend, no signup, no API key**.
The first time someone submits the form, FormSubmit sends a one-time
confirmation link to `serranodigitalco@gmail.com` — you must click it once
to activate delivery, or every submission after that gets silently dropped.
Test the form yourself right after deploying and confirm that email.

If you outgrow this (want submissions in a spreadsheet, Slack, a CRM,
etc.), swap `FORM_ACTION` in `src/config.js` for another provider or a
serverless function — the form markup itself doesn't need to change.

## About SERRA (the chatbot)

This is a **scripted decision tree**, not a real AI chatbot — per the
brief, v1 intentionally skips a live AI API. It asks a fixed sequence of
questions (category → device → home/business → issue → location → urgency
→ name → contact), then offers "Text Danny" (opens a pre-filled text
message) or "Request a Visit" (scrolls to the contact form and fills in
what it already collected).

The whole flow lives in `src/scripts/serra.js` as a `STEPS` object — add,
remove, or reorder questions by editing that object. There's a
`getSerraReply()` stub function with a comment marking exactly where to
wire in a real API call later, without touching the rest of the logic.

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:4321`.

```bash
npm run build      # builds the static site into dist/
npm run preview    # serves the built dist/ locally, to sanity-check the real output
```

## Deploy

### Option A — Vercel

1. Push this project to a GitHub repo.
2. In Vercel: **New Project** → import that repo. Vercel auto-detects
   Astro — no config needed (build command `astro build`, output `dist`).
3. Deploy. You'll get a `*.vercel.app` URL to test before pointing your domain at it.

### Option B — Cloudflare Pages

1. Push this project to a GitHub repo.
2. In Cloudflare dashboard: **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → select the repo.
3. Build command: `npm run build`. Build output directory: `dist`.
4. Deploy.

Either option works fine for a static Astro site like this one — pick
whichever you find easier to manage. Vercel's dashboard is slightly
simpler; Cloudflare's free tier has no bandwidth limits.

## Point serranodigital.co at the deployment

Wherever you registered `serranodigital.co`, go to its DNS settings and:

**If using Vercel:**
- Add the domain in the Vercel project's **Settings → Domains**.
- Vercel will show you exact DNS records to add (usually an `A` record for
  the root domain pointing to `76.76.21.21`, and a `CNAME` for `www`
  pointing to `cname.vercel-dns.com`). Use whatever Vercel shows you at
  the time — these values occasionally change.

**If using Cloudflare Pages:**
- If your domain's nameservers are already on Cloudflare, adding the
  custom domain in the Pages project does this automatically.
- If not, Cloudflare Pages will give you a `CNAME` record to add at your
  current registrar.

DNS changes can take anywhere from a few minutes to 24 hours to fully
propagate.

## Performance notes

This is about as light as a modern site gets: no client-side framework,
no icon font, no external font requests, one small CSS file, one tiny JS
module for the header/menu/SERRA. The FAQ accordion uses native
`<details>`/`<summary>` — zero JavaScript for that. You should be at or
near 95+ on Lighthouse performance out of the box; if you add large images
later, compress them (WebP/AVIF) and set explicit `width`/`height` so they
don't cause layout shift.

## Things I could not do for you

- **Your real logo** — I don't have the file. Placeholder is in place; swap it in.
- **A live AI backend for SERRA** — the brief asked for a decision tree for v1, so that's what's built. The code is structured to swap in a real API later (see above).
- **Actual DNS access** — I can't touch your domain registrar from here. The steps above are accurate but you'll need to log in and do it yourself (or tell me if you want walked through it live).
