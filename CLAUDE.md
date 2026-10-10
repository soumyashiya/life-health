# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Read this file first. It exists so you do not have to re-audit the project on every task.**

---

## PROJECT PURPOSE

Lyfe Health — a dark, editorial e-commerce site selling research-grade peptide reference
materials to laboratories. Single-page React SPA with hash routing, heavy scroll animation, and a
real checkout that talks to an external order service.

Compliance framing matters: products are **for laboratory research only, not for human or
veterinary use**. Never write marketing copy that implies otherwise, and never invent lab results,
purity figures, certifications, or batch numbers.

---

## TECH STACK

| | |
|---|---|
| Framework | React 19 + TypeScript (~6.0), **no** React Router / Next.js |
| Build | Vite 8, `@vitejs/plugin-react` |
| Animation | GSAP 3 + ScrollTrigger, `@gsap/react`, Lenis (smooth scroll) |
| Styling | Hand-written CSS, no Tailwind/CSS-in-JS |
| Utilities | `clsx` |
| Fonts | `@fontsource/anton` (display), `@fontsource/ibm-plex-sans` (body) |
| Lint | ESLint 10 flat config + typescript-eslint |

### Commands

```bash
npm run dev       # Vite dev server on :5173
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # preview the production build
```

There is **no test suite**. Verification is done by running the app and checking the affected
section in a browser.

---

## PROJECT STRUCTURE

```
src/
  main.tsx              entry; React StrictMode
  App.tsx               provider stack + view switch (the "router outlet")
  index.css             design tokens + global primitives (:root lives here)
  styles/portfolio.css  ~7.7k lines — ALL component styling
  components/           one file per section / page
  data/                 site.ts, research.ts, navigation.ts, policies.ts
  hooks/                useRouter, useCart, useAuth, useSmoothScroll, useSectionReveal, useMagnetic
  lib/                  api.ts (all HTTP), fingerprint.ts
  assets/               images, imported as ES modules
server/                 tiny Express app: order-confirmation email only
```

Provider nesting in `App.tsx`: `RouterProvider > AuthProvider > CartProvider > AppShell`.

---

## ROUTING

Custom **hash router** in `src/hooks/useRouter.tsx`. A `View` union type is parsed from
`window.location.hash`. There is no route table and no router library.

| Hash | View |
|---|---|
| *(empty)* | `home` |
| `#/shop`, `#/shop?research=<id>` | `shop` (optionally filtered) |
| `#/science`, `#/science?s=<section>` | `science` (scrolls to `standards` \| `purity` \| `reports`) |
| `#/about` | `about` (the `#about` home section still exists separately) |
| `#/product/<id>` | `product` |
| `#/policies/<slug>` | `policy` |
| `#/find` | `find` — guided product finder |
| `#/cart` `#/checkout` `#/login` `#/account` `#/track` | corresponding views |
| `#/payment-capture/<token>` | manual bank-transfer capture |

**Home sections** (in-page anchors, not routes): `#home #about #services #work #why-us
#reviews #faq #contact`.

**Adding a route** means editing three places: the `View` union, `parse()`, and `navigate()` in
`useRouter.tsx`, then the view switch in `App.tsx`.

The home view stays mounted and is hidden via `hidden`/`aria-hidden` when another view is active —
this keeps GSAP ScrollTrigger pins from firing. `body.is-product-view` is toggled alongside it.

---

## DESIGN SYSTEM

All tokens live in `src/index.css` `:root`. **Use the variables, never hard-coded values.**

### Colors
```
--color-bg #080808   --color-bg-elev #141414
--color-fg #ffffff   --color-fg-dim #bcbcb7   --color-fg-muted #949490
--color-accent #ffeec8 (warm cream — the only accent)
--color-accent-soft rgba(255,238,200,.12)
--color-outline #4b4b49   --color-outline-soft rgba(255,255,255,.08)
--color-danger #ea384c    --color-success #82e298
```

### Typography
- `--font-display` **Anton** — all `h1`–`h6`, uppercase, line-height .95
- `--font-body` **IBM Plex Sans** — body copy
- `--font-mono` system mono — meta, labels, counts (`.mono` helper)
- Size helpers: `.display .h2 .h3 .h4 .lead .eyebrow .mono` (all `clamp()`-based)

### Layout
- `--container-max: 88rem`; `.container` centers and applies `clamp(1.25rem, 4vw, 5rem)` inline padding
- `.section` applies `--section-pad-y` (3.5rem → 2.75rem ≤991px → 2.25rem ≤767px). Sections are
  flush, so the gap a reader sees between two of them is **twice** this — 112px on desktop.
  Tightened twice on request: 7.5/5/4rem → 5/3.5/3rem → the current values. Don't raise it back
  without being asked. Every band now tracks the token — `.testimonials` used to hard-code
  `padding-block: 5rem`, which made it conspicuously taller than its neighbours on mobile.
  The ~2300px between `#work` and `#why-us` is **not** padding: it is the GSAP pin spacer that
  drives the horizontal product carousel, and must stay.
- Radii: `--radius-sm 3px`, `--radius-md 8px`, `--radius-lg 16px` (the design is mostly squared;
  pills are reserved for header controls)

### Breakpoints
Primary: **991px** (desktop→mobile nav), **767px**, **480px**. Secondary: 1199, 640, 374.
Always `max-width` (desktop-first). Reuse these — don't invent new ones.

### Motion
- Easing: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`
- GSAP for entrances/scroll; CSS transitions for hover/state
- Every animated component must branch on `prefers-reduced-motion` (`gsap.set` instead of tweens).
  `index.css` also kills all animation globally under reduced motion.
- `useSectionReveal()` — generic `[data-reveal]` stagger; `useMagnetic()` — cursor-follow

### Images
Imported as ES modules (`import img from "../assets/x.webp"`), never string paths. Always set
`width`/`height`, `loading="lazy"`, `decoding="async"`. Decorative images take `alt=""`.

**Page banners** (`.science__hero-media img`, `.about-page__hero-media img`) run at full opacity
with a **directional** scrim — heavy on the left where type sits, clear on the right — so the
photograph stays visible instead of being flattened. Do not go back to a flat full-cover scrim,
and do not dim the image itself.

Scrim weight is per-image, not a shared constant: About's photo is dark so it takes a light
scrim; Science's is pale and warm so it needs a heavier one or the cream stat row loses contrast.
Re-check the stat row after changing either.

A page whose hero is full-bleed must carry **`view--flush`** alongside `view--page` in `App.tsx`
(Science and About do). `.view--page` adds `padding-top: clamp(6rem,10vh,8rem)` to clear the
fixed header; on a banner page that leaves a bare strip above the image, because the hero clears
the header with its own top padding.

**Image art direction:** banner/section imagery is **cool-toned** — deep blue, teal and indigo
with cyan and soft violet highlights, on near-black. This deliberately contrasts the cream
`--color-accent` type. An earlier warm amber/champagne set was rejected for looking yellow; do
not reintroduce warm tones.

**Generating new imagery:** Higgsfield `gpt_image_2_5`, ~0.25 credits per image. Prompt the cool
palette explicitly *and* negate the warm one (`strictly no warm amber, golden, orange, sepia or
brown`) — the model drifts warm otherwise. Always also negate *people, text, logos, pills/bottles,
medical or clinical treatment imagery* — the last matters because treatment imagery contradicts
the research-use-only position. **There is a daily generation cap** (hit after ~5 images in one
day); plan batches around it. Downloads arrive as 1–2 MB PNGs; convert before committing:
`ffmpeg -y -i in.png -vf "scale='min(1800,iw)':-2" -quality 82 out.webp` (ffmpeg is available;
sharp / magick / cwebp are not). Bespoke About art lives in `src/assets/about/`.

To recolour an existing warm image rather than regenerate, a plain `hue=` rotation flattens it to
near-greyscale — use `hue=h=165:s=0.3,colorbalance=…,eq=saturation=1.9` instead (see
`about/compliance.webp`).

---

## KEY COMPONENTS

**Header (recently rebuilt — see status below)**
- `Navbar.tsx` — bar, scroll state, panel open/close, keyboard, mobile toggle
- `MegaMenu.tsx` — the compact dropdown panel (shared by all three menus)
- `MobileNav.tsx` — full-screen drawer with accordions
- `NavSearch.tsx` — search over real `projects` + `researchAreas` data
- `data/navigation.ts` — **the single source of truth for nav IA**

**Commerce** — `ShopPage`, `ProductDetail`, `CartDrawer`, `CartPage`, `CheckoutPage`,
`PaymentCapturePage`, `OrderTracking`, `AccountPage`, `LoginPage`

**Product finder** (`#/find`) — `ProductFinder.tsx` + `data/finder.ts`. Typeform-style, one
question per pane (**application → composition → documentation → scale**), A–F letter keys and
Enter, then three ranked matches reusing the `.shop-card` markup. `rankProducts()` **scores,
never filters**, so there is always a result.

**It exists for the visitor who does not know what to buy.** That constrains every question: no
step may assume catalogue knowledge — never ask for a compound by name, a strength in mg, or
anything else only a returning buyer could answer. A compound-name first question was built and
rejected for exactly this reason; don't reintroduce one. Each step still asks about the
*protocol*, never the person running it — a wellness-goal or age-range quiz (the pattern the
reference site uses) would misrepresent a research-only catalogue.

Step 01 offers the five `researchAreas` **plus "Not sure yet"** (six options — also the `LETTERS`
ceiling in `ProductFinder.tsx`; extend that array before adding a seventh). Composition is
single-active vs combination, read from `labAnalysis.compounds.length`. Weights: application 4
(the only answer tied to curated data, `researchAreas.productIds`), composition 3,
documentation 2 — or 1 when a single-active lot is matched against the per-compound-breakdown
answer — scale 2.

Answering "not sure" to everything scores zero and the ranking falls back to catalogue order, so
the results pane branches on `narrowed`: it drops the "Best match" badge and retitles to "Where
to start." rather than claiming a match the answers never supported. Keep that branch if you
touch the results header.

An earlier device-count question ("one pen or two") was dropped — packaging is a PDP detail. The
header pill CTA (`primaryCta` in `data/navigation.ts`) points at the finder.

**Science page** — `SciencePage.tsx` + `data/science.ts`. Three sections (standards / purity /
reports) behind one route, a sticky scroll-spy rail (IntersectionObserver, ±45% band), and a
report list built by filtering `projects` for `labAnalysis`. **All batch numbers, purity figures
and compound breakdowns derive from `site.ts` — never hand-write them here.**

Lab reports are expandable certificate rows (`.report*`): collapsed shows a purity meter on a
true 0–100 scale; expanded shows the compound table plus the **real Janoshik scan** from
`labAnalysis.reportImages`. Those scans are ~1 MB and ~900×3000, so they sit in a
`max-height` scroll frame carrying `data-lenis-prevent` — without it Lenis swallows the inner
scroll, and without the frame one open row runs 2.2 viewports tall. Only one row opens at a time.

**About page** — `AboutPage.tsx` + `data/about.ts`. Headline, paragraph, stats and signals are
re-exported from `aboutCopy` so the page and the `#about` home section cannot diverge. The
`compliance` block is verbatim product/checkout legal wording — **do not paraphrase it**, and do
not place clinician, patient or treatment imagery beside it.

**Home sections** — `Hero`, `About`, `Services`, `Projects` (products),
`WhyUs`, `Testimonials`, `FAQ`, `Contact`, `Footer`

`ResearchAreas.tsx` still exists but is **no longer mounted** on the home view (removed by
request). `data/research.ts` is still live — it drives the Research nav panel and the
`#/shop?research=<id>` filter.

**Chrome** — `Preloader`, `CustomCursor` (`data-cursor` / `data-cursor-text` attributes),
`ScrollProgress`, `SplitText`

**Data** — `data/site.ts` holds products (`projects`), testimonials, FAQ, and all home copy.

---

## API

All HTTP lives in `src/lib/api.ts`. Base URL `https://www.microservices.tech` (Vite proxies
`/api` in dev). Auth token in `localStorage` under `liora.auth.token`; cart under `liora.cart.v1`.

Those `liora.*` keys (plus `liora.auth.orders.v1`, `liora.fp.sent` and the `liora-fp` canvas seed
in `fingerprint.ts`) keep the **pre-rebrand prefix deliberately** — see the rebrand note below.
Do not "tidy" them to `lyfe.*`.

`server/` is a separate tiny Express app that only forwards order-confirmation email to a shared
module at `../../../shared-email/order-email.js`. **That path is intentionally VPS-only and will
not resolve locally — do not "fix" it.**

---

## IMPLEMENTATION DECISIONS

1. **Never invent routes or content.** Every nav href must resolve to an existing hash route or
   home-section id. No fake products, claims, certifications, or lab data.
2. **Hash routing on purpose** — the site is a static SPA with no server-side routing.
3. **Home stays mounted** when other views show, to protect ScrollTrigger pins.
4. **`sendOrderConfirmationEmail` never throws** — a failed email must not break a placed order.
   It re-reads the persisted order rather than trusting client form state.
5. **One stylesheet.** New styles go in `portfolio.css` near related rules, not in new files.
6. **Panels are data-driven** from `data/navigation.ts`; add links there, not in JSX.

---

## FILES TO LEAVE ALONE

Do not modify unless the task is explicitly about them:

- `src/styles/portfolio.css.bak` — stale backup, slated for deletion, never a source of truth
- `server/index.js` import path — see above, VPS-only by design
- `src/lib/api.ts` endpoint URLs / payload shapes — contracts with an external service
- `src/data/policies.ts` — legal copy
- `dist/`, `node_modules/`, `.playwright-mcp/`
- Root `*.png` / `*.md` scratch files (`payment.md`, `API_DOCUMENTATION*.md`, screenshots)
- `src/assets/**` — do not re-encode or rename existing media

---

## REBRAND — LIORA HEALTHCARE → LYFE HEALTH (2026-10-09)

The brand is **Lyfe Health**. `site.brandMark` / `brandSub` are `Lyfe` / `Health`; contact is
`hello@lyfehealth.com` and `instagram.com/lyfehealth`. All UI copy, legal pages, page titles and
meta are renamed. Deliberately **not** renamed, each for a reason:

| Still says `liora` | Why |
|---|---|
| `liora.*` localStorage keys, `liora-fp` canvas seed | Renaming signs out live sessions, empties saved carts, and detaches new fingerprints from collected ones |
| `src/assets/liora-healthcare-lab-facility-dubai.jpeg` | Existing media is never renamed; the import identifier is `labFacility` |
| `/var/www/liorahealthcare/` paths in `server/index.js` comments | Real VPS directory, accurate as written |
| `https://liorahealthcare.com` in the `ALLOWED_ORIGINS` default | Kept alongside the new domain so production keeps working until DNS moves |

The repo directory itself is still `liorahealthcare/`. Product packaging photography shows
**ALLUVI** branding by licensing arrangement — that is not a leftover, leave it.

---

## CURRENT PROJECT STATUS

### Completed

- **Full commerce flow** — catalogue, PDP, cart, checkout, promo codes, payments
  (Klyme / AabanPay / manual capture), order tracking, accounts, affiliate, newsletter
- **Home page** — all sections listed above
- **Research areas** (`data/research.ts`) — 5 areas, each linking to a filtered
  `#/shop?research=<id>`; `ShopPage` accepts a `research` prop. The home-page
  `ResearchAreas` section that surfaced them was removed; the nav panel and shop filter remain,
  and the `Research` nav item's direct href is now `#/shop` (was the dead `#research` anchor).
- **Header redesign (current focus — functionally complete):**
  - Bar: `Research · Shop · Science · About` + search, account, cart, "Find your product" pill CTA
  - Sentence-case 14px nav links at near-zero tracking (uppercase + 0.16em read as too long)
  - Header ~74px transparent over hero → ~58px solid on scroll
  - Three compact 368px dropdowns anchored under their trigger (not full-width mega panels),
    each a thumbnail + meta + label row list, modelled on the restraint of seed.com but in
    Lyfe Health's palette
  - Research → 5 areas; Shop → 6 products with prices; Science → Our standards / Verified purity /
    Lab reports (no "view all" — `allLink` is optional)
  - Shared hairline utility row: Track order · FAQ · Contact
  - Full-screen mobile drawer mirroring the same IA
  - Verified: 1920→320px, ESC + focus restore, ArrowDown into panel, hover handoff, outside click,
    route navigation, reduced motion, 0 console errors
- **Science page** (`#/science`) — new route + `SciencePage.tsx` + `data/science.ts`:
  full-bleed hero with stat strip, sticky scroll-spy rail, 01 Standards (4 cards),
  02 Verified purity (method steps + COA contents), 03 Lab reports (5 real Janoshik lots with
  batch / purity / fill / compound breakdown, each linking to its product), closing CTA panel.
  The three Science dropdown rows now deep-link to `#/science?s=…` instead of home anchors.
  Reused existing imagery — no AI media generated.
  Verified: all 3 deep links land on their section, rail tracks on scroll, dropdown→page flow,
  375px single-column with no overflow, 0 console errors.
- **About page** (`#/about`) — new route + `AboutPage.tsx` + `data/about.ts`: hero, stats band
  (99%+ / 1000+ / 24h) and signals from `aboutCopy`, an operating split with a cross-link to
  `#/science?s=purity`, two pull-quotes (the two shortest reviews), a research-use-only
  compliance block, and a contact band (email + socials from `site.ts`). The `About` nav item now
  points at `#/about` instead of the home anchor.
  Verified: nav link, cross-link, 375px single-column, no overflow, 0 console errors.
- **About imagery + banner visibility** — three bespoke images generated with Higgsfield
  (`src/assets/about/{hero,operations,compliance}.webp`, 29–120 KB after webp conversion),
  replacing generic stock. Both page banners raised from `opacity` 0.32/0.40 → **0.85** with a
  directional scrim so the photograph reads while type stays legible.

### Bugs found and fixed during the header work

- `MobileNav` passed `inert=""` as a string — React 19 takes a real boolean (`inert={!open}`)
- `.mobnav__drawer { display: grid }` outranked the UA `[hidden] { display:none }`, so collapsed
  accordions stayed laid out and keyboard-reachable behind `aria-expanded="false"`
- At 320px the header row overflowed and clipped the cart/menu buttons off-screen
- Stale `@media (max-width:1199px)` rules targeted a removed mega structure

### In progress / pending

- `About` has a page but no dropdown panel — offered, not requested
- **Science hero is still the warm/gold stock photo** and now clashes with About's cool palette.
  A cool replacement was prompted but blocked by the Higgsfield daily cap — regenerate it (prompt
  #4: abstract molecular visualisation, indigo/teal/cyan/magenta, wide, space on the left) once
  the cap resets.
- `site.phone` (`+1 000 000 0000`) and `site.whatsapp` (`wa.me/10000000000`) are placeholders.
  The About page shows email + socials only, but the Footer/Contact section may expose them.
- `src/assets/nav/{shop,learn,support}.webp` are now **unreferenced** (dropdowns use product and
  research imagery); safe to delete, awaiting confirmation
- `src/styles/portfolio.css.bak` awaiting deletion
- Nothing in the working tree is committed yet

### Known issues (pre-existing, out of scope unless asked)

- **9 ESLint errors**, all pre-existing and unrelated to the header:
  `react-refresh/only-export-components` in `useAuth/useCart/useRouter`, and
  `react-hooks/set-state-in-effect` in `useAuth`, `LoginPage`, `PaymentCapturePage`, `ProductDetail`.
  Treat 9 as the baseline — only worry if the count rises.
- **~90 GSAP `Invalid scope` console warnings** on load. Verified *not* caused by the header.
  Warnings only; console **errors** are 0.
- `portfolio.css` is ~7.7k lines; always grep for a selector before adding a new one.

---

## ENVIRONMENT NOTE (saves real time)

Verification through the Playwright MCP browser runs at **~2 FPS** — `requestAnimationFrame` is
throttled. GSAP tween values freeze mid-flight and `window.scrollTo` does not fire a `scroll`
event on the expected frame. This produces **convincing false bugs** (a panel stuck at opacity
0.41, a container at the wrong height, a scroll class that never applies).

When measuring animated state, first call `browser_emulate_media` with
`reducedMotion: "reduce"` — the components branch to instant `gsap.set`, so final layout is
measurable immediately and the reduced-motion path gets exercised too. Reset afterwards. For
scroll state, set `document.documentElement.scrollTop` and dispatch a `scroll` event manually.

The `Preloader` is also rAF-driven and will not finish; hide it with injected CSS for screenshots.

---

## AI WORKFLOW RULES

- DO NOT re-audit the entire website for every request.
- DO NOT reread unrelated files.
- DO NOT inspect the complete codebase unless the task genuinely requires it.
- Read `CLAUDE.md` first before starting a new task.
- Identify only the files directly related to the requested change.
- Inspect those files before modifying them.
- Reuse existing components, styles, utilities, animations, and design tokens whenever possible.
- Do not recreate functionality that already exists.
- Do not change unrelated sections.
- Do not rewrite working code unnecessarily.
- Preserve the existing visual identity unless the task explicitly requests a redesign.
- Keep changes focused and minimal.
- Before editing, determine the smallest set of files required.
- After editing, verify only the affected functionality/section.
- Do not perform a full-site audit after every small change.
- Update `CLAUDE.md` only when important project structure, decisions, completed work, or pending
  work changes.

---

## TASK EXECUTION RULE

- **Step 1:** Read `CLAUDE.md`.
- **Step 2:** Understand the requested task.
- **Step 3:** Identify the exact section/component/files involved.
- **Step 4:** Read only those relevant files.
- **Step 5:** Implement the requested change.
- **Step 6:** Check for visual/responsive issues related to that change.
- **Step 7:** Do not touch unrelated code.
- **Step 8:** Summarize what changed and which files were modified.

### Where things live (skip the search)

| Task | Files |
|---|---|
| Header / nav / dropdowns | `components/Navbar.tsx`, `MegaMenu.tsx`, `MobileNav.tsx`, `data/navigation.ts`, `portfolio.css` (nav + dropdown blocks) |
| Add/edit a nav link | `data/navigation.ts` only |
| Product data, price, copy | `data/site.ts` |
| Research areas | `data/research.ts`, `components/ResearchAreas.tsx` |
| Product finder | `components/ProductFinder.tsx`, `data/finder.ts`, `portfolio.css` (`.finder__*`, end of file) |
| Science page | `components/SciencePage.tsx`, `data/science.ts`, `portfolio.css` (`.science__*`, end of file) |
| About page | `components/AboutPage.tsx`, `data/about.ts`, `portfolio.css` (`.about-page__*`, end of file) |
| A home section | the matching `components/<Section>.tsx` + its block in `portfolio.css` |
| Routes | `hooks/useRouter.tsx` + `App.tsx` |
| Cart / auth behaviour | `hooks/useCart.tsx`, `hooks/useAuth.tsx` |
| API calls | `lib/api.ts` |
| Colors / fonts / spacing tokens | `index.css` |
| Legal pages | `data/policies.ts` |

---

## DO NOT REPEAT

This work is done and recorded above. Do not redo it unless the code has visibly changed:

- Full website audit and folder-structure discovery
- Design-system extraction (colors, fonts, spacing, radii, easing — all captured above)
- Breakpoint analysis (991 / 767 / 480 primary)
- Route and `View`-union analysis
- Component inventory
- Animation-stack analysis (GSAP + ScrollTrigger + Lenis; reduced-motion convention)
- Responsive sweep of the header across 1920 / 1440 / 1280 / 1024 / 768 / 480 / 375 / 320
- Header accessibility pass (ESC, focus restore, ArrowDown, aria-expanded/controls, inert, touch targets)
- seed.com reference analysis (56px bar, sentence-case 14px links, 375px anchored dropdown with
  thumbnail rows) — findings already applied
- Confirming the 9 ESLint errors and ~90 GSAP warnings are pre-existing

---

## CODE STYLE

- Comments explain **why**, not what. Match the existing density — current files comment the
  non-obvious decision and stay silent elsewhere.
- Named exports for components (`export function Navbar()`), default export only in `App.tsx`.
- `clsx` for conditional classes.
- BEM-ish CSS naming: `.block__element--modifier` (`.nav__link`, `.mega__row-label`).
- Keep `data/` as plain typed data; keep logic in components and hooks.
