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
| Fonts (added) | `@fontsource/playfair-display` — 2026-10-15, header wordmark only |
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

### ⚠ THEME INVERTED TO LIGHT — burgundy redesign, 2026-10-15

**The site no longer runs on a near-black ground.** The brief called for a white ground, soft
black type and restrained burgundy accents, so the *core* tokens were flipped rather than a
second palette added — `body` reads `--color-bg`/`--color-fg`, so that is what actually turns
the page white. The colour table below documents the **old dark values** and is kept only as
history; read `index.css` for what is live.

```
--color-bg #ffffff        --color-bg-elev #f7f4f2    (was #080808 / #141414)
--color-fg #171717        --color-fg-dim #4a4746     --color-fg-muted #6f6a68
--color-accent #8b1e2d    (was cream #ffeec8)        --color-accent-soft rgba(139,30,45,.08)
--color-secondary #b85a66 (was lime #b8f52a)         --color-outline #ddd6d3
--color-on-accent #ffffff (NEW — see below)
```

The LIORA brand tokens went burgundy with it:
```
--brand-primary #8b1e2d   --brand-primary-deep #6d1622   --brand-primary-soft rgba(139,30,45,.08)
--brand-rose #b85a66      --brand-sand #f7f4f2           --brand-ink #171717
--brand-muted #6f6a68     --brand-border #e8e2e0
--brand-purple / --brand-purple-deep  →  aliases of the two primaries
```
**The `--brand-purple*` aliases are deliberate.** The header, footer, search overlay and mobile
drawer were all written against those names; pointing them at the primary flips every one of
those surfaces in one edit instead of a sweep. New rules should use `--brand-primary*`.

**`--color-on-accent` is the trap this inversion exposed.** 43 rules said `color: var(--color-bg)`
to mean *"knockout type on an accent fill"* — correct when the page was near-black and the accent
was cream, and **silently invisible** the moment the theme inverted. They now say
`var(--color-on-accent)`. Two ranges genuinely meant "dark ink on a white band" and were
corrected back to `var(--color-fg)` instead: the **catalogue band** (`.catalog*`, ~20 lines) and
the **lab-proof white cards**. If you add a rule in either place, use `--color-fg`, not
`--color-on-accent`.

**Type over photography must be hard-coded white**, not tokenised — it has no theme. The open
WhyUs tile (`.why__card.is-active …`) needed exactly that fix; the collapsed tiles sit on light
panels and keep the ink colour.

### Colors (historical — the dark theme, superseded above)
```
--color-bg #080808   --color-bg-elev #141414
--color-fg #ffffff   --color-fg-dim #bcbcb7   --color-fg-muted #949490
--color-accent #ffeec8 (warm cream — the primary accent)
--color-accent-soft rgba(255,238,200,.12)
--color-secondary #b8f52a (lime — shop CTAs and the hero backdrop only. Promoting
                        it to --color-accent site-wide, including the ~20 hard-coded
                        rgba(255,238,200,…) washes in portfolio.css, was tried and
                        reverted on 2026-10-13. Don't redo it unasked.)
--color-secondary-soft rgba(184,245,42,.12)
--color-outline #4b4b49   --color-outline-soft rgba(255,255,255,.08)
--color-danger #ea384c    --color-success #82e298
```

**LIORA light palette** — added 2026-10-14 *alongside* the dark tokens, not replacing them.
Only the hero and the header consume these; everything else is still on the dark theme.
```
--brand-bg #ffffff        --brand-soft #f5f2f8
--brand-purple #7650a8    --brand-purple-deep #4b286d
--brand-ink #29262e       --brand-muted #77727e
--brand-border #e7e2eb
```

**Hero campaign green** — added 2026-10-15, sampled off the reference capture with ffmpeg rather
than eyeballed. **Scoped to the hero band alone**: nothing outside `.hero` consumes these, and
the purple above is still the brand everywhere else.
```
--brand-green #2b5e0e     --brand-green-deep #27590a    --brand-green-light #3c6b20
--brand-lime #b3ea88      --brand-lime-ink #1c4a06
```
The one exception is `.nav.is-transparent .nav__cta`, which takes `--brand-lime` so the header's
pill doesn't sit purple on the green band. The scrolled header is unaffected.

### Typography

**⚠⚠ OSWALD + GEIST AS OF 2026-10-19** — the pairing taken from
`fluxtheory.in/about-us` on request. **`--font-display` and `--font-heavy` point at Oswald,
`--font-body` at Geist**: a three-line token edit rather than a sweep through ~100 rules, the
same device the header uses for the LIORA palette.

This is the **third** face change of the day. The order was Anton + IBM Plex → Roboto
everywhere (the hero's face, requested) → this. Anton, Roboto and Plex are all still
imported and unused, so **reverting is editing those three token lines**.

- **Measured off the reference, not guessed.** Its headings run **Oswald 500–700, uppercase,
  leading equal to the font size, tracked negative** and tightening as the type grows
  (-2.2px at 44px ≈ -0.05em; -1.12px at 28px ≈ -0.04em). Its body is **Geist 400 at 16/24**
  with normal tracking, and its small caps labels are 500/12px at **+0.07em**.
- The `h1`–`h6` default is now **600 / `line-height: 1` / `-0.04em`** — the reference's h1
  values. It was 900/0.98/-0.025em, which were the hero's from the Roboto pass.
- **`--font-heavy` and `--font-display` are no longer different faces.** `--font-heavy` used
  to be "the hero headline only, a heavy grotesque, *not* the condensed display face"; the
  reference uses one condensed face for every heading, so both tokens resolve the same now.
  They are kept as two names so a future headings-only change is still one line.
- **Oswald's heaviest cut is 700**, so the site's many `font-weight: 900` rules land there.
  `font-synthesis: none` is already set, so nothing is faked. **300 and 400 are imported**
  because existing rules ask for them — the collage pairs a light line against a bold one and
  the lot band's statement is near-regular; without those cuts both collapse onto 500.
- **The size helpers went back UP**, having been cut ~30% for Roboto hours earlier. Scaled by
  the faces' average uppercase advance (Anton ≈ 0.44em, Oswald ≈ 0.50em, Roboto Black ≈
  0.62em), Oswald sits at about **0.88× the original Anton-era sizes**:
  `.display` `7.75 → 9.9rem`, `.h2` `5.1 → 6.6rem`, `.h3` `3.4 → 4.4rem`, `.h4`
  `2.55 → 3.3rem`. **This is the lever to reach for whenever the display face changes** — the
  clamps are tuned to a face's width, not to a design intent.
- Body is **already 16/24**, which is exactly the reference's, so nothing changed there.
- `--font-serif` (Playfair) is **untouched** — still the header wordmark and the FAQ heading's
  italic accent.
- **Per-band eyebrow tracking was left alone.** The reference sets its small caps labels at
  +0.07em; ours run 0.18–0.22em and each band declares its own, so matching them would be a
  sweep rather than a token change. Worth doing if the reference is being followed closely.
- Verified 0 horizontal page overflow on home / shop / science / about / PDP / cart / checkout
  at 1440, and home / shop / science / about / PDP at 320. (Elements inside the `.range__rail`
  carousel extend past the viewport by design; the page-level measure is the real test.)

The 2026-10-17 pass below is what this supersedes, and its per-band notes still hold — read
"the hero's face" as Oswald now:

**⚠ Every home-page band heading runs on the hero's face** (2026-10-17, requested):
`--font-heavy` (Roboto 900), `letter-spacing: -0.025em`, leading near 1. Each band **keeps its
own size and casing** — only the face, weight and tracking are shared — so `.range__title` /
`.feature__title` / `.collage__heading` / `.sciband__title` stay sentence case and
`.stories__title` / `.faq__title` / `.contact__title` / `.spotlight__title` stay uppercase.
Anton is now **off the home view entirely**; it is still the `h1`–`h6` default and still runs
every other route (Shop, Science, About, PDP, cart/checkout/account). Two consequences:

- **Roboto Light (300) is imported for this.** `.collage__heading` pairs a light line against a
  bold one, and with only 700/900 loaded the thin line synthesised off the Black and the pair
  collapsed. `.collage__line` is 300, `--bold` is 900.
- **Roboto Medium (500) is imported too** (2026-10-19) and is used by exactly one heading —
  `.lotfan__title`, the lot band's long statement. Its reference reads as a sentence, and at
  900 the scrubbed word-fill cannot be read through it. Don't spread it; 900 is still the
  rule.
- **Roboto Black runs far wider than Anton at the same size.** `.faq__title` had to drop off the
  `.h2` helper's `7.5rem` cap onto its own `clamp(2rem, 4.6vw, 4rem)` — that scale was set for a
  condensed face. Check the measure before reusing an Anton-era size on this face.
- `.spotlight__title` is the one that changed most in character: it was quiet tracked capitals
  in the body face at `0.16em`, and the Black cut at that tracking read as spaced-out signage,
  so its tracking came down to `0.02em`. Its *size* is unchanged and deliberately small — the
  photograph is still that band's display element.
- The footer was left alone: it renders on every route, so it is site chrome rather than a home
  section.

- `--font-display` / `--font-heavy` **Oswald** (Anton → Roboto → this, all 2026-10-19) —
  all `h1`–`h6`, uppercase, weight 600, leading 1, tracking -0.04em
- `--font-serif` **Playfair Display** — **the header wordmark only** (added 2026-10-15). A
  high-contrast serif the other faces can't imitate. Don't spread it to body or headings. It
  is the one face the 10-19 unification left alone.
- `--font-body` **Geist Sans** (IBM Plex → Roboto → this, all 2026-10-19) — body copy, 16/24
- `--font-mono` system mono — meta, labels, counts (`.mono` helper)
- Size helpers: `.display .h2 .h3 .h4 .lead .eyebrow .mono` (all `clamp()`-based)

### Layout
- `--container-max: 88rem`; `.container` centers and applies `clamp(1.25rem, 4vw, 5rem)` inline padding
- `.section` applies `--section-pad-y` (3.5rem → 2.75rem ≤991px → 2.25rem ≤767px). Sections are
  flush, so the gap a reader sees between two of them is **twice** this — 112px on desktop.
  Tightened twice on request: 7.5/5/4rem → 5/3.5/3rem → the current values. Don't raise it back
  without being asked. Every band now tracks the token — `.testimonials` used to hard-code
  `padding-block: 5rem`, which made it conspicuously taller than its neighbours on mobile.
  (`.testimonials` / `.testimonials__head` are still the reviews band's outer selectors and are
  the only two of that old block the markup still uses — see the reviews rail below.)
  The ~2300px between `#work` and `#why-us` is **not** padding: it is the GSAP pin spacer that
  drives the horizontal product carousel, and must stay.
- Radii: `--radius-sm 3px`, `--radius-md 8px`, `--radius-lg 16px` (the design is mostly squared;
  pills are reserved for header controls)

### Breakpoints
Primary: **991px** (desktop→mobile nav), **767px**, **480px**. Secondary: 1199, 640, 374.
Always `max-width` (desktop-first). Reuse these — don't invent new ones.

### Shared motion system (2026-10-20)

`src/lib/motion.ts` + `hooks/use{Reveal,ScrollShift,Parallax}.ts` — **every number in
them is read out of `designer.incube.agency`'s own `style.css` / `main.min.js`**, not
eyeballed. Before this, each of ~38 animated components re-typed its own durations and
easings, which is why the page's rhythm varied band to band. New work should use these
rather than inventing a fourth set of numbers.

What was verified on that reference, and where it lives here:

| Reference | Value | Ours |
|---|---|---|
| `.animtitle__line > span` | mask + `translate3d(0,130%,0)`, 1s `cubic-bezier(.215,.61,.355,1)`, **0.25s per line** | `REVEAL_*`, `.anim__line` |
| `.soc-links--show` label stagger | same curve, 0.25s steps | `data-anim-delay` |
| `ScrollShift` on `h1,p,ul` | `y = lerp(prev, delta × 3, 0.07)`, **off below 1024px** | `useScrollShift` — **built, then taken off all type on request** |
| Layered parallax | `delta/4` and `delta/7` — a **1.75 ratio** | `PARALLAX_NEAR/FAR` |
| `.text-img` hover | `scale(2.5)`, 2s `cubic-bezier(.19,1,.22,1)` | `EASE_SETTLE` (device itself not ported) |

The two curves map **exactly** onto GSAP: `cubic-bezier(.215,.61,.355,1)` is `power2.out`
and `cubic-bezier(.19,1,.22,1)` is `expo.out`. Its smooth scroll is **not** Lenis — a
custom `.scroll-container` lerp at `ease: 0.05`; we stayed on Lenis (see below).

**Typography was deliberately not changed.** The reference runs Geogrotesque, which is
proprietary; the brief's "preserve LYFE's typography" was chosen over matching its face,
so Oswald/Geist/Playfair stand. Only the mechanics (line-height, the stagger language)
were adopted.

Usage — attach the ref to a section and mark its children:

```tsx
const revealRef = useReveal<HTMLElement>();
<h2 data-anim="lines">            // masked line-by-line rise
<p  data-anim="up" data-anim-delay="0.25">
<figure data-anim="mask">         // clip-path wipe, keeps its corner radius
<h2 data-shift>                   // scroll-velocity drag (App mounts one for the home view)
<img data-parallax="near|far">
```

Things that cost a pass and are easy to get wrong again:

- **`splitLines` refuses an element with markup children** and warns in dev — it works off
  `textContent`, so an italic accent or a `<br>` would be flattened away. Headings whose
  breaks are authored (the hero's `lines` array, the FAQ's two-tone title) carry
  `.anim__line > .anim__line-inner` **themselves**; `lineTargets()` finds those, so both
  routes land in the same tween. The FAQ title is the worked example.
- **`data-anim="mask"` is a `fromTo`, not a `from`.** A resting `clip-path` of `none`
  cannot be interpolated towards — the trap half the bands in this file carry a note
  about. Stating both ends also lets the element's own `border-radius` ride along, so a
  rounded figure does not square off for the length of the wipe.
- **Each `[data-anim]` element gets its own trigger**, as the reference does. The sequence
  between a label, a heading and a CTA comes from them entering at different moments, so a
  tall section never fires its lower half early.
- **The hooks bail out entirely under `prefers-reduced-motion`** — the `index.css` block
  only reaches CSS animation, and a GSAP tween writes inline transforms it cannot touch.
  Verified: under that preference the range heading is **not split at all**, and every
  target reads `opacity: 1; transform: none`. `useSectionReveal` was missing this branch
  and has been fixed (it predates `useReveal`; prefer the new one).
- **⚠ NOTHING CARRIES `data-shift` ANY MORE** (2026-10-20, requested: *"no jumping effect
  for title and text, need it for image"*). The reference runs its velocity drag on
  `h1`/`p`/`ul`; on this type it read as the headings jumping. The hook, its constants and
  the `App.tsx` mount are gone from the page — **`useScrollShift.ts` is kept in the tree,
  unused**, so re-tagging an element is one attribute plus one hook call. **Images drift
  instead**, on the about band's scrubbed parallax: `.sciband__photo`, `.feature__photo` and
  the FAQ portrait all carry `data-parallax="far"`, and the unmounted `DocBand`'s three tiles
  alternate near/far.
- **A drifting image needs travel room in CSS, not a bigger tween.** Each one overhangs its
  frame the way `.aboutband__media img` does (`height: 114%` at `inset: -7% 0`), or the
  parallax drags the frame's own background in at whichever edge it moves away from.
  `.feature__photo` takes a **shallower 108%** on purpose — its crop is measured to put the
  carton mid-slot and a taller frame moves it.
- **A hover scale on a drifting image must use the `scale` property, not `transform`.** GSAP
  owns `transform` for the drift and would wipe a CSS one. `.faq__figure img` and
  `.docband__tile img` were both converted; `.drift__tile` already used this device for its
  seat and tilt.
- **`.anim__line` clips horizontally as well as vertically.** The FAQ heading is `nowrap` and
  deliberately runs wider than its 26rem column (517px in a 416px track) — the mask cut
  "Asked" off. Fixed two ways, both needed: `.faq__line` is `width: max-content` above 991px
  so the mask is sized to the text rather than the column, and `.anim__line` carries
  `padding-inline: 0.2em` with an equal negative margin for the hairline case (the same
  heading sits 4px over its box at 375). **Check `scrollWidth > clientWidth` on any line you
  mask.**
- **`SHIFT_CLAMP` (40px) is ours, not the reference's.** Its `delta` is bounded by its own
  frame loop while Lenis's velocity spikes on a flung trackpad, and its headings are
  ~173px display type where a 90px drag is a third of a line — ours are ~56px, where the
  same number moves a heading a whole line down.
- **`useScrollShift` owns `y`, `useParallax` owns `yPercent`.** A `data-shift` target must
  not have `y` animated by its own band — the project's usual disjoint-transform rule. The
  three currently tagged (`.docband__title`, `.drift__title`, `.sciband__title`) were
  checked: each band tweens the `__line > span` children, never the `h2`.
- It runs on the **GSAP ticker, not scroll events** — the lerp has to keep running after
  the last event to bring the element home. One instance is mounted in `App.tsx` for the
  whole home view rather than one per band.
- **Do not put a scroll reveal on anything near the fold.** `useReveal` parks its targets
  at `opacity: 0` / `translateY(130%)` the moment it mounts, and only releases them at
  `top 85%`. `TrustBar` was given one and it had to come straight back out — the strip sits
  just under the hero and was invisible on arrival. Adopted so far in `ProductRange`
  (split heading, lead, 5 staggered cards) and `FAQ` (authored title lines, figure wipe),
  both of which are well down the page.

### Motion
- **Lenis is tuned to `rogue-rosy.webflow.io`** (`useSmoothScroll.ts`, 2026-10-15):
  `duration: 1, easing: expo-out, wheelMultiplier: 0.95, gestureOrientation: "vertical",
  smoothWheel: true, syncTouch: false`. Touch stays native.
  - **That site does not use Lenis** — it runs SmoothScroll.js 1.4.10 with
    `animationTime: 1000, stepSize: 100, pulseAlgorithm: 1, pulseScale: 4,
    accelerationDelta: 50, accelerationMax: 3`. We stayed on Lenis and mapped the feel onto it:
    `animationTime` → `duration`, the pulse curve → the expo-out easing, `stepSize` → the wheel
    multiplier coming back up near 1.
  - **Don't swap the library to match exactly.** `getLenis()` drives the Science rail and its
    `?s=` deep links, `data-lenis-prevent` guards the inner-scroll regions, and ScrollTrigger is
    synced to Lenis's own tick. All three break with a different scroller.
  - `accelerationMax` has **no Lenis equivalent** — rapid consecutive wheel events don't ramp
    the step here. That is the one part of the reference's feel this cannot reproduce.
  - **`lerp` and `duration` are mutually exclusive in Lenis**, so passing both silently drops
    the lerp. This is a duration build and carries no `lerp` key; the previous `lerp: 0.1` /
    `wheelMultiplier: 0.7` pair (matched to `eline-boer.webflow.io`) is gone, not commented out.
  - **Testing it needs patience.** `useSmoothScroll(ready)` only starts once the rAF-driven
    `Preloader` completes, and hiding the preloader with CSS does **not** complete it. Until
    then the page scrolls natively and looks like Lenis is broken. Poll for `html.lenis` before
    measuring anything.
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
- `NavSearch.tsx` — search over real `projects` + `researchAreas` data. **Kept but no longer
  mounted (2026-10-15)** — the search control was removed from the bar on request, same
  convention as `Projects.tsx` / `ResearchAreas.tsx`. Its `.navsearch` CSS is still present.
- `data/navigation.ts` — **the single source of truth for nav IA**

**What the bar carries after 2026-10-15:** `Home` · the mark · `Shop / Learn / Support` ·
account · cart. Nothing else. Three things were removed on request in one pass — the
`Find your product` CTA, the search control, and the menu icon *on desktop* — so **the bar now
has no filled control at all**. If one is ever added back, note it must not be the brand purple
over the green hero.

**The bar is aligned to the hero, not to `.container`** (2026-10-15). `.nav__row` carries the
`container` class, whose `88rem` max-width centres it — but the hero band is full-bleed, so above
~1440px the two drifted badly (at 1920 the bar started at 336px and the headline at 92px; they
only coincided at 1440 by accident). `.nav__row` now sets `max-width: none` and
`padding-left: calc(var(--hero-inset) + var(--gutter))`, which is exactly where `.hero__panel`'s
content begins. **Verified delta 0 at 375 / 991 / 1280 / 1440 / 1920** — *at the time*. `--gutter` is a
`:root` token and `.hero__panel`'s `padding-left` reads it too, so the two cannot drift apart
by accident — don't re-hard-code the clamp in either place.

**The line moved out a step on 2026-10-17.** `--nav-pad-x`
(`clamp(0.75rem, 1.6vw, 1.75rem)`, a `:root` token) is added on top of it: the bar got it
first, on both sides (left 77 → **100px** at 1440, right 43 → **66px**), and the home bands
followed in a second pass so the page keeps **one** line. **Set `--nav-pad-x: 0rem` to put
everything back** — nothing hard-codes the old value.

So the shared line is now `--hero-inset + --gutter + --nav-pad-x`, and these all sit on it:
`.nav__row` (left), `.trustbar`, `.aboutband`, `.range`, `.spotlight`, `.sciband__copy`,
`.whychoose`, `.faq`, `.collage`, `.bento__inner`, `.feature` (its section padding).
**Verified delta 0 against the bar at 375 / 480 / 767 / 991 / 1024 / 1280 / 1440 / 1920.**

Three things are deliberately *not* on it:
- **The hero.** Its two cards sit at `--hero-inset` from the viewport; widening that was
  built and **reverted on request**. The bar therefore no longer starts exactly where the
  hero headline does — that 2026-10-15 alignment is the one casualty of this change.
- **`.feature__inner`**, capped at `--feature-max` and centred — an explicit earlier request.
  Its *section* padding is on the line; the inner cap is what offsets it above ~1230px.
- **At 320px** the bar has its own narrower padding (14px), so the bands sit 30px inside it.
  Matching that would put the type hard against the edge.

`.aboutband` and `.faq` were taken **off the `container` class** to join the line — a
container-width band is capped at 88rem and centres, which drifts from the bar above ~1440. (The leftmost thing on that line is the small logo
glyph; the wordmark itself sits after it.)

The right side keeps its own `padding-right: clamp(1rem, 2vw, 2rem)` so the account/cart cluster
hugs the corner rather than the page's inner margin. The asymmetry is deliberate.

**Header typography is set to a second reference capture** (2026-10-15) — ratios measured off it
with a pixel analysis, not eyeballed (brand cap-height 7.5px vs link 5px → 1.5×; words ~1.4em
apart):
- `.nav__brand-lead` is **`--font-serif` (Playfair Display 500)**, caps, `0.12em` tracked, at
  `1.25rem` — a measured 1.54× the links. `--font-serif` was added for this and **nothing else
  on the site uses it**; `@fontsource/playfair-display` 400/500 are imported in `index.css`.
  Anton is a condensed grotesque and Plex is low-contrast, so neither could do it.
- `.nav__brand-accent` takes the same serif so the lockup reads as one mark, but stays small and
  widely tracked. The reference wordmark is a single word; ours carries a sub-word.
- `.nav__link` is `0.8125rem` / weight `400` (down from `0.875rem` / `450`), and `.nav__links`
  gap went to `clamp(1.1rem, 2.4vw, 2.4rem)` for the reference's even spacing.
- **The links were NOT moved to the right** as the reference has them. At ≥992px they would land
  on the hero's pale photograph, where white type is invisible — the exact trap documented under
  `.nav__primary` above. They stay on the green panel.

**The wordmark and the nav words sit lower in the bar than the icon cluster** (2026-10-15,
requested) — `--nav-drop` (0.5rem) applied as `top` on `.nav__brand` and `.nav__primary`.
**It must stay `top`, not `transform`:** the opening sequence in `Navbar.tsx` animates
`.nav__brand`'s transform, and a CSS one here would be wiped the moment that timeline runs.

**Icon controls are `2.625rem` with `1.375rem` glyphs** (raised from `2.25` / `1.125` on request,
2026-10-15). `.nav__toggle` is deliberately the same size — the two sit side by side on mobile
and a mismatch reads as a broken row, so keep them in step.

**`--hero-pad-y` opens white page above and below the hero's cards** (2026-10-15, requested), and
**`.nav.is-transparent .nav__row` takes the same value as `padding-top`**. That pairing is not
optional: the bar sits *over* the hero, and there were only 8px of headroom before the nav links
would have landed on the white strip instead of the green card — white type on white. It is
scoped to the transparent state so the scrolled plate is unaffected.

**The bar is a centred mark between a word and a cluster (rebuilt 2026-10-14 against the Lumiva
Cosmetics hero).** `grid-template-columns: 1fr auto 1fr` on `.nav__row` — that is what actually
centres the mark, because the two flexible columns stay equal whatever the left word and the
right cluster measure. `Home` far left, mark over wordmark in the middle, `.nav__cluster` (nav
links + icon controls + CTA) far right. Over the hero it carries no surface and runs **white on
the photography**; scrolled, it takes the white plate and the charcoal/purple palette.

This replaced the filled purple brand plate that expanded on hover. **The expand is gone with
it** — a centred mark has nowhere to expand to. So are the bordered pill nav items; the bar now
sits straight on imagery, where a row of boxes fought it.

Scroll state: the bar settles from ~88px to ~71px and takes a **soft-lavender translucent plate**
(`rgba(250,248,252,.92)`) with a hairline and a low shadow — white would read as a sheet laid over
the palette rather than part of it. Everything transitions on the same 0.5s curve so nothing
jumps. The controls are one group of icons, then a clear step to the CTA and another to the menu
— three things, not six evenly spaced ones; one size (2.25rem) and one stroke weight (1.5) across
search, account and cart, with hit areas larger than the glyphs. The CTA is the only filled
control in either state.

Three traps this cost:

- `.nav.is-transparent .nav__brand { color: #fff }` colours the *parent*. The old
  `.nav__brand-lead` block still carried `color: var(--color-fg)`, and **a declaration on the
  element always beats an inherited value**, whatever the parent selector's specificity — so the
  wordmark stayed charcoal on a white-on-image bar. Those legacy brand rules are deleted; keep
  the brand defined in one place.
- the bar needs a `text-shadow` in the transparent state. The hero's scrim is uniform across the
  width but the photography under it is not, and the pale studio wall sits directly under the
  centred mark.
- **earlier versions of this header left duplicate blocks behind** — a second `.nav__logo` and a
  second `.nav__cta`, each still carrying a `color`/`background` that beat the current rules. The
  mark stayed purple on a white-on-image bar because of it. Both are deleted; if the header is
  reworked again, grep for a duplicate selector before adding an override.

**Shop · Learn · Support ride the bar from 992px up, and fold into the drawer below it.** They
sit **beside the mark on the hero's colour panel**, which is the one constraint that matters:
`.nav__primary` must be a direct child of `.nav__row` with `flex: 0 0 auto` and `margin-right:
auto`. Nested inside `.nav__cluster` (where it was) its auto margin only pushes against the
controls, and `justify-content: center` on the row carried the links across the seam onto the
photograph, where white type has nothing to sit on.

**`.nav__toggle` is now shown at ≤991px only** (2026-10-15, removed from the desktop bar on
request). It used to stand at every width as the way into the panels' deeper links; on desktop
the three words already reach those, so only the deep links are lost.

**Do not remove it below 992px as well.** Under that width `.nav__primary` is hidden, so the
drawer is the site's *only* navigation — dropping it there leaves a phone with no way to move
around at all. The `.mobnav` rules deliberately sit outside any media query. At ≥992px the
drawer's head and scroll area are constrained to `--container-max` (dead code for now, but kept:
edge-to-edge is right on a phone and reads as a stretched phone menu on a 1440 screen).

The search control is gone (2026-10-15) — `.nav__search-btn` / `.nav__search-label` and the
≥1200px rule that widened it into a labelled pill are all deleted. `searchOpen` went with it, so
**nothing but `scrolled` and the route decides `is-transparent` now**.

**The three words each open an accordion in that drawer.** The four options the bar used to carry
are sub-items inside them:

| was | now |
|---|---|
| Research panel (5 areas) | the category row inside **Shop** (`.mega__group`, plain links) |
| Shop panel (6 products) | **Shop**, unchanged |
| Science panel | **Learn**, plus Lab reports and the About page |
| About (direct link) | a row inside **Learn** |
| the hairline utility row | **Support**'s whole panel (`showUtility: false` there, so it isn't printed twice) |

`researchPanel` is gone; `researchLinks` replaced it. Panels are still data-driven from
`data/navigation.ts` — add links there, not in JSX.

**Navbar owns the page-load sequence** (2026-10-14), lifted beat for beat from the reference's
own script — it starts in the header, so it lives there rather than in Hero:

1. the brand plate is set to `height: 100vh; width: 100%` — a full-screen purple field, and the
   reason the hero no longer has a curtain of its own
2. `.nav__brand-lead`, `.nav__star`, `.nav__brand-accent` rise from `yPercent: 100` inside their
   masks — 0.4s `power2.out`, stagger 0.2, after a 0.4s hold
3. the star turns 180° (0.4s `power1.out`), then drops away (0.8s, delay 0.2)
4. the plate collapses to `height: 100%` (0.8s `power2.out`, overlapped `-=0.8`), which drops
   `is-intro` and settles the wordmark back to bar size
5. the plate narrows to `width: 33.333%` (0.8s, delay 0.2)
6. **on the same beat** the hero photograph narrows to its column (`-=0.8`)
7. the hero's tags fade up (1s)

Both plate and photograph end with **`clearProps`** so CSS owns them again — the hover
transition and any later resize depend on it. `.nav__brand.is-intro ~ .nav__actions, ~
.nav__primary` stand the controls down while the field is open, because the second word is
parked where they live. Note `main.tsx` runs StrictMode, so in **dev** the effect is
double-invoked and the opening visibly restarts once; production builds do not.

**The brand plate expands on hover.** At rest the header is a filled purple block in the corner
carrying the whole wordmark; on hover the plate opens across the full bar, the second word
travels to the far end and the nav items slide up in the middle. Modelled on
`eline-boer.webflow.io`, at its timings: width 1s `power2.inOut`, items 0.5s `power2.out`
staggered 0.2s. **This is CSS, not GSAP** — deliberately, so it can never fight the load
timeline over the same `width`, and so it keeps working for keyboard and touch. Notes:

- `.nav__brand` *is* the plate — positioned against `.nav` so it can run edge to edge while its
  content still lines up with the container. **`.nav__row` and `.container` must stay
  `position: static`** or the absolute positioning resolves against the wrong box.
- it is also `pointer-events: none`, with only the two words re-enabled — a full-width `<a>`
  would otherwise swallow every click in the bar.
- **`.nav__primary` and `.nav__actions` need `position: relative; z-index: 3`.** The plate is
  positioned and they are not, so without it the expanded plate paints straight over the nav
  items and the icon controls.
- the trigger is `:hover` **and** `:focus-within`, and the links are hidden with `opacity` +
  `pointer-events`, never `visibility: hidden` — they have to stay focusable, because tabbing
  into them is what fires `:focus-within`. Under `@media (hover: none)` the bar is simply open.
- `.nav__brand-accent` is a sibling of `.nav__brand-lead` now, so it no longer inherits the
  lead's face or casing; both are restated on it.
- every control carries the reference's **circular hover fill**: a `::after` layer clipped to
  `circle(0% → 141.4%)` opening from wherever the pointer crossed the edge, with `--wipe-x` /
  `--wipe-y` written by `setWipeOrigin` in `Navbar.tsx`. It needs `isolation: isolate` on the
  button so the `z-index: -1` layer sits above the control's own background but under its label,
  and the hover rules must **not** also set a `background` — that floods instantly and hides the
  wipe. 141.4% ≈ the diagonal, so the circle clears the corners from any origin.

**The whole header system runs on the light LIORA palette (2026-10-14).** It had to: it sits
over the white hero. The mechanism is a **token re-point** on `.nav__shell, .nav__backdrop,
.navsearch, .mobnav` — the same device `.footer` already uses — which converts the bar, the
dropdowns, the search overlay and the mobile drawer in one block instead of rewriting ~900
lines. Notes:

- the scope must also set `color: var(--brand-ink)`. Re-pointing a token only changes rules
  that *use* it; anything that merely inherits text colour would still take the dark theme's
  white from `<body>` (the mobile drawer's accordion bodies did exactly that).
- only six hard-coded values in the nav range needed patching by hand — the `.nav` plate, the
  icon-button fill, the `.mega` shadow and row hover, the backdrop and the search scrim.
- `.nav__cart` / `.nav__account` used to re-declare size, border and radius, which beat
  `.nav__icon-btn` on source order and left them as bare icons. They now only carry positioning;
  **don't put the box back on them.**

Styling follows the hero's reference: a **filled purple brand block**, square-cornered 2px
bordered uppercase buttons for the nav items, icon controls and CTA, no underline indicator
(`.nav__link-rule` is `display: none`). The scroll state animates — the bar settles ~91px → 63px
and every control shrinks with it over the existing 0.5s transitions. Over the hero the bar is
fully transparent; it can be, because every control carries its own opaque fill.

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

An earlier device-count question ("one pen or two") was dropped — packaging is a PDP detail.

**The finder has no entry point in the UI any more.** `primaryCta` in `data/navigation.ts` still
points at it, but the header CTA that rendered it was removed on 2026-10-15 and so was its copy
in the mobile drawer. `#/find` still routes and the page still works — it is simply unlinked.
Worth raising if the finder is meant to be discoverable.

**Science page** — `SciencePage.tsx` + `data/science.ts`. Three sections (standards / purity /
reports) behind one route, a sticky scroll-spy rail (IntersectionObserver, ±45% band), and a
report list built by filtering `projects` for `labAnalysis`. **All batch numbers, purity figures
and compound breakdowns derive from `site.ts` — never hand-write them here.**


Scrolling and motion on this page (added 2026-10-12):

- **Rail clicks and `?s=` deep links scroll through Lenis**, via `getLenis()` from
  `useSmoothScroll`, not `scrollIntoView`. Native smooth scrolling fights the site-wide smooth
  scroll instance. The offset is computed as `-(nav + rail + 16)` at call time, which is also
  what finally fixes the long-standing bug where a section heading landed *behind* the sticky
  rail — the `02` now sits ~89px clear of it. Don't swap this back to `scrollIntoView`.
- The rail's active state is a **sliding marker** (`.science__rail-marker`), positioned from the
  active link's `offsetLeft`/`offsetWidth`, plus a scrubbed **reading-progress line**
  (`.science__rail-progress`). The per-link `::after` is now a hover hint only and is explicitly
  suppressed on `.is-current`, so the two indicators can't both draw.
- Hero: headline splits to characters and rises behind a per-word mask (`SplitText`, with
  `aria-label` on the `<h1>` so it still reads as one heading), and the banner image is on a
  scrubbed parallax. The method image counter-drifts in 02.
- Generic reveals use `ScrollTrigger.batch` so a row of cards arrives together instead of each
  firing its own trigger.
- **Purity meters animate `scaleX`, never `width`.** `width` is set inline as a percentage of
  the lot's real purity; tweening it makes GSAP freeze that into a pixel value, and the bars then
  under-report the published figure — measured at ~85% against true readings of 99.21–99.85%.
  `.report__meter-fill` already carries `transform-origin: left center` for this. Verified every
  bar renders at its exact published percentage.
- All of it sits in one `gsap.matchMedia("no-preference")` block; reduced motion gets no tween,
  no parallax, no char split movement, and the meters render at their true widths immediately.

Lab reports are expandable certificate rows (`.report*`): collapsed shows a purity meter on a
true 0–100 scale; expanded shows the compound table plus the **real Janoshik scan** from
`labAnalysis.reportImages`. Those scans are ~1 MB and ~900×3000, so they sit in a
`max-height` scroll frame carrying `data-lenis-prevent` — without it Lenis swallows the inner
scroll, and without the frame one open row runs 2.2 viewports tall. Only one row opens at a time.

**About page** — `AboutPage.tsx` + `data/about.ts`. Headline, paragraph, stats and signals are
re-exported from `aboutCopy` so the page and the `#about` home section cannot diverge. The
`compliance` block is verbatim product/checkout legal wording — **do not paraphrase it**, and do
not place clinician, patient or treatment imagery beside it.

**Home sections, as mounted (2026-10-20, latest)** — `Hero`, `TrustBar`,
**`ShopCategories`**, `AboutBand`,
`ProductRange`, `AboutProduct`, `ScienceBand`, `DriftBand`, `LineStory`,
`WhyChoose`, `Testimonials`, `ProductFeature`,
`FAQ`, **`FinalCta`**, `Contact`, `Footer` — with **`AnnouncementBar`** fixed above the
header, outside the view.
(**`DocBand` was added 2026-10-20**, between `DriftBand` and `LineStory`, **and unmounted on request the same day**.) (`ConfidenceBand` and `LotOffer` were unmounted the same day. A swap
putting `AboutProduct` under the hero and `AboutBand` under the range was tried and **reverted on
request**.) Verified in the DOM, in that order, with every home anchor
(`#home #work #why-us #reviews #faq #contact`) still resolving.
(**`AboutProduct` was added 2026-10-19**, mounted directly under the products grid on
request.)
(**`LineStory` and `ProductReel` were added 2026-10-19** — sections 3 and 4 of
`nymphaicosmetics.com`. Section 2 of that reference is the scatter collage `DriftBand`
already does, so it was not built twice. **`ProductReel` was then unmounted on request the
same day**; `LineStory` stays mounted.)
(**`LotOffer` and `ProductFeature` were moved below `Testimonials` on request**, 2026-10-19.
They used to run between `ProductRange` and `ScienceBand`. **Their relative order is
unchanged** — lot, then featured — so the band describing how a lot is supplied still leads
into the one that puts a named lot up for sale; flipping them is a two-line swap in
`App.tsx`. Nothing else moved, and neither band's own markup or CSS was touched.)
(**`LotFan` was unmounted on 2026-10-19** and `LotOffer` took its slot.)
(**`ProductPlinth` was unmounted on request**, 2026-10-17 — see the unmounted list.)
(**`ProductSpotlight` was unmounted on 2026-10-17** and `LotFan` took its slot.)
(**`Campaign` was unmounted on request**, 2026-10-17 — see the unmounted list.)
(**`CompoundCollage` was unmounted on request, 2026-10-17** — see the unmounted list below.)
(`ProductFeature` was first mounted above `CompoundCollage` and **moved below it on request**
the same day — the collage closes on *"nothing left undocumented"* and the feature band is what
then puts a documented lot up for sale.)
(`ProductSpotlight` and `ProductRange` were **swapped on request** late on 2026-10-16 — the
order asked for was hero, then products, then the spotlight. `TrustBar` stays directly under
the hero; it is the strip spanning the hero's two cards, not a numbered section.)
**`WhyUs` and `ProofBento` were unmounted on request later the same day** — see the two
entries below and the "Unmounted … but kept in the tree" list.

**Offer band** (`ProductOffer.tsx`, `.offer__*`) and **lot panel** (`LotPanel.tsx`,
`.lotpanel__*`) — added 2026-10-15 as the 2nd and 3rd sections, built to a supplement-site
reference. **Both were unmounted on 2026-10-16, on request.** Components and CSS are untouched
and still in the tree, so remounting either is one line in `App.tsx` plus its import. Two
knock-on effects: `ProductOffer` was the only place on the home view that ran a checkout
straight from a band (the `ProductRange` cards still add to the cart), and with `LotPanel` gone
the home view no longer surfaces `purityMethod.steps` / `standards` at all — the Science page
still does. The notes below describe the bands as built, and still apply if either comes back:

- The reference's offer column sells two tiers — *Subscribe & Save* vs *One-time Purchase* —
  with a **48% OFF** disc and struck-through was-prices. **None of that exists here**: no
  subscription system, no multi-pack SKUs, no discount pricing in `projects`. A crossed-out
  price is fabricated commercial data. So the band has **one real purchase mode at one real
  unit price**, the dark disc carries the lot's **published purity** instead of a fake saving,
  and the 1/3/5-Pack control is a **quantity** (`n × price`), not a variant. Verified live:
  1-Pack `$350.00`, 5-Pack `$1,750.00`.
- `FEATURED_ID` picks the lot. Checkout adds the real quantity to the real cart and routes to
  `#/checkout` **through the router** — assigning `window.location.hash` directly trips the lint
  rule against mutating globals from a component, and the hash router owns that value anyway.
- The reference's panel reads *"Our patented formula is made with Vitamin B12 to help support:"*
  over rows like *Cellular Energy Production* and *Overall Good Health*. **Those are consumer
  health-benefit claims** on a catalogue whose every product page says "not for human or
  veterinary use" — the single clearest thing this site cannot say. The layout is kept and the
  rows are sourced from `purityMethod.steps` + `standards` in `data/science.ts`, so they stay in
  step with what the Science page publishes. **Don't swap this copy for benefit language.**
- Rows are native `<details>`/`<summary>` — keyboard and screen-reader accessible with no JS.

**Unmounted from the home view but kept in the tree** — `About`, `Services`, `PromoBanner`,
`LabProof`, `ProductShowcase`, `ProductOffer`, `LotPanel`, `WhyUs`, `ProofBento`,
`CompoundCollage`, `Campaign`, `ProductSpotlight`, `ProductPlinth`, `LotFan`, `ProductReel`
(all removed on request),
plus
`Catalogue`, `Projects` and `ResearchAreas` from earlier passes. Components and CSS are untouched; remounting any of them is one line in `App.tsx` plus
its import. Consequences worth knowing:

- **`#about`, `#services` and `#why-us` no longer exist on the home view**, so a nav or footer
  link pointing at them has nothing to scroll to. The `#/about` *route* is unaffected.
  The footer's **`Why Us`** entry (`site.navLinks` in `data/site.ts`) was the live example,
  and it **resolves again as of 2026-10-17**: the new `WhyChoose` band carries `id="why-us"`.
- `aboutCopy` and `proofCopy` are **still exported and still read** — by the About page and the
  Science page respectively. Don't delete them as "unused".
- The home view's GSAP console warnings dropped from ~190 to ~28 with `LabProof` unmounted; its
  pinned assembly was the bulk of the "Invalid scope" noise. Treat **28** as the new home
  baseline, not 190.

**About (home)** (`About.tsx`, `aboutCopy` in `site.ts`, `.about__*` in `portfolio.css`) —
rebuilt 2026-10-13 as a storefront band: heading, then a photo frame on the left carrying a
**purity chip** (a real `labAnalysis.purity`, never a round number) and a **floating packshot
card** that links to its product, with the paragraph, signal *chips*, two CTAs (Shop the range /
Our story) and the three counters on the right, closed by a scrolling trust strip.

- `aboutCopy` itself is unchanged — `data/about.ts` re-exports it for the About *page*, so
  editing those fields would silently change `#/about` too.
- The packshot needs a clipping `.about__float-media` wrapper: the box renders sit on a tall
  transparent canvas, so the `<img>` is scaled ~1.55 inside a frame that hides the overflow.
  Scaling the bare `<img>` spills the carton across the photo.
- Put the heading's measure on `.about__heading`, **not** on `.about__head` — `ch` on the
  wrapper is sized by the 16px body font and clamps the display type to ~230px wide.
- The trust strip renders its list four times and the keyframe travels `-25%`, so the loop is
  seamless; change one and you must change the other.
- The photo is still the pre-existing `about-seo.webp` (medals) — imagery here was out of scope
  for the rebuild, and it is the one off-brand asset left in this band.

**Standards / Services** (`Services.tsx`, `services` in `site.ts`, `.services__*` / `.service*`
in `portfolio.css`) — rebuilt 2026-10-13 against the Vertical Webflow template's services
section. Two columns, **pure CSS sticky, no GSAP**:

- Left `.services__media`: four `.services__shot` blocks, all pinned at the same `--svc-top`,
  so each photo wipes up over the one before as you scroll.
- Right `.services__list`: four `.service` cards pinned at **staggered** tops
  (`calc(var(--svc-top) + var(--i) * var(--svc-step))`, `--i` set inline). Each card is opaque
  (`background: var(--color-bg)`), so it covers the body of the card above and leaves only its
  header row — the stack of collapsed `[01] [02] [03]` headers above the open card.
- **Both columns need the trailing `.services__tail` (55vh).** A sticky item is released when
  its *containing block* runs out, so without that spacer the last card never pins and the whole
  stack is pushed off the top. The tail also carries the oversized `.services__word` wordmark,
  as the reference parks "SERVICES" under its list. Hidden ≤991px.
- `--svc-item` / `--svc-top` / `--svc-step` on `.services` drive both columns — keep them shared
  or the photos and cards fall out of step.
- GSAP only animates `.services__head`. **Do not tween the cards or shots** — a transform on a
  sticky element fights its offset.
- ≤991px the media column is hidden and the cards go static; pinning a two-column stack on a
  phone traps the reader.
- Imagery: `src/assets/standards/*.webp` — **product-led retail stills** (Magnific, 2026-10-13):
  carton + pen, a row of cartons, a carton in an insulated mailer, a phone beside a carton. They
  replaced an earlier lab-coat set on request ("look less like a science site").
- Copy is **shop promises, not lab process** ("Tested before it ships", "The same every order"),
  and the section head reads *Why shop with us / What you get, every order*. Each promise still
  points at something real (a report, the spec, the packing format, WhatsApp) — don't let it
  drift into claims the site can't back.

**Promo banner** (`PromoBanner.tsx`, `promoCopy` in `site.ts`, `.promo__*` at the end of
`portfolio.css`) — full-bleed cream band under the *Why shop with us* band (moved there from
under the catalogue on 2026-10-13), built on
`src/assets/sub-new.jpeg` (1695×624 — it replaced `bg-img-sub.jpeg`, which is still on disk but
unused; the band's white palette is sampled from it, so a cream-backed banner would need the
`.promo` background and scrim changed back). The packs sit in the right half of the frame, so
the image is `object-position: right center` and the copy sits left behind a **directional
scrim** (`.promo::before`, heavy left → clear over the packs), same rule as the page banners. Below
768px the photo becomes a 16/9 block of its own with the copy under it — a cover-fitted banner
crops the packs out entirely at that width. `.btn--ghost` is overridden inside `.promo` because
the shared version renders white-on-cream.
**The photograph shows the wider ALLUVI range (MOTS-C, CJC-1295, Tesamorelin), none of which
this catalogue stocks** — `promoCopy` therefore talks about how lots are supplied and must
never imply those products are for sale here.

**Hero** (`Hero.tsx`, `heroCopy` in `site.ts`, `.hero__*` in `portfolio.css`) — **a full-bleed
photograph, 2026-10-14**, on the LIORA light palette. It is the one light band above the fold
and the only part of the home page not on the dark theme.

It was first rebuilt as a split modelled on `eline-boer.webflow.io` (a 1fr/2fr band: a 475px
tinted panel of type and three bordered link rows beside a 950px photograph). **The text column
and its buttons were then removed on request** — `.hero__panel*`, `.hero__title`, `.hero__line`,
`.hero__lead`, `.hero__rows`, `.hero__row*` and `.hero__tag` are all gone, along with
`heroCopy.headline` / `.intro` / `.rows` / `.tag` / `.signals`. The split version is one commit
back in git if the column is ever wanted again.

It is now **a solid colour panel of type beside a photograph**, modelled on the VIREO
supplements hero and taken to the reference exactly on **2026-10-15**. `--hero-split: 56%` — the
panel takes the larger share, because it carries everything.

- **Two rounded cards on a white page, not one flush band** (2026-10-15). `--hero-inset`
  (~10px) is both `.hero`'s padding and its column `gap`, and `--hero-radius` (~16–24px) rounds
  `.hero__panel` and `.hero__visual`. Both measurements were scaled off the reference capture.
  `.hero__panel` needs its `overflow: hidden`: it is a card now, so anything that outgrows it
  spills onto the white page instead of being clipped at the viewport edge as it used to be.
- **`.hero__panel` is `justify-content: space-between`**, not `flex-end` (fixed 2026-10-15):
  headline block just under the bar, foot row on the panel's bottom edge, slack between them —
  the reference's composition. `flex-end` sent *all* the slack above the headline, and once the
  band was made taller that opened a 182px void between the bar and "FEEL BETTER." (now 50px).
  Don't put `flex-end` back without shortening the band.
- **The panel is flat `--brand-primary` burgundy** (2026-10-15 redesign) — **not** a gradient.
  The brief rules out constant gradients, and a single confident field is what makes the band
  read as editorial rather than as a supplement template. It replaced a 205° campaign-green
  gradient, which replaced a lavender-to-purple one; `--brand-green*` / `--brand-lime*` are gone
  from `index.css` entirely.
- `.hero__visual`'s ground is the warm off-white `--brand-sand` with a very shallow falloff, and
  **`.hero__wordmark` is a burgundy ghost at 11%, not white** — a white mark vanished once the
  ground went from greige to off-white.
- `.hero__cta` is a **light lime pill with dark-green type** (`--brand-lime` /
  `--brand-lime-ink`), the reference's one accent and — now that the header's CTA is gone — the
  only filled control anywhere above the fold.
- **The bar stays transparent while a dropdown is open** (2026-10-15). `activeMenu` used to
  break `is-transparent`, which threw a full-width white plate across the bar the moment a nav
  item was hovered — it read as the header changing state rather than a panel opening under it.
  The panel is its own opaque card and needs no plate behind it.
- **No scrims anywhere, and none needed** — the type sits on a solid fill, which is the whole
  point of this layout. That is why it replaced the two-photograph version.
- **The band is not full height** (`clamp(40rem, 86svh, 54rem)`, 2026-10-15 — raised from
  `34rem/78svh/46rem`, then trimmed back from `94svh`), so the catalogue still just starts
  showing before the fold. That is the whole reason it is capped; don't take it to 100svh.
  **The band's height is the lever for the panel's spare space**, not the content's gaps — at
  `94svh` it left ~170px of dead green above the foot row.
- **`.hero__content` stays tightly set** — `gap: clamp(1.25rem, 3vh, 2.25rem)` and nothing else.
  Headline, lede and CTA are one block. Giving it `flex: 1` + `space-between` to soak up the
  panel's surplus was tried and reverted: it pushed the three ~94px apart and the lede read as a
  floating fragment. The surplus belongs between that block and the foot row (~99px at
  1440x900), which is where the reference puts it too.
- The headline runs on **`--font-heavy` (Roboto 900)**, not the site's display face: the
  reference's headline is wide and black and **Anton cannot do that** — it is far more condensed.
  Roboto was already a dependency, just unimported. `line-height: 0.98` with `-0.025em` tracking
  stacks the lines almost touching, which is the reference's look; the per-line mask's
  `padding-bottom`/`margin-bottom` pair must stay equal or the lines drift apart again.
- The size is **capped at 4.5rem so the longest line still fits the panel on one line**, and
  `.hero__line > span` is `nowrap`: one entry in `heroCopy.lines` is one rendered line, and a
  wrap breaks both the composition and the mask. Re-check the cap if the copy ever gets longer.
- **The copy is not the reference's.** Its hero reads "Feel better. Live stronger. Every day." —
  a personal health-benefit claim, which is the one thing this catalogue cannot say: every
  product page, the footer and the About page carry research-use-only disclaimers, and peptide
  efficacy claims are a regulatory problem besides. Ours keeps the reference's cadence — three
  short declaratives, same rhythm and lengths — on claims the site can evidence. Raised with the
  client 2026-10-14; don't quietly swap in benefit copy to match a reference.
- `.hero__disc` sets a small round photograph inline in the second line. It renders at about
  40px, where packaging detail is mush — so it takes a **crop of the band's own portrait**, not
  a packshot. The catalogue renders sit on tall transparent canvases and crop to a circle badly.
- **The right half is a client-supplied cut-out on a ground built in CSS** (2026-10-15).
  `.hero__visual` paints a soft neutral studio sweep, `.hero__wordmark` sits over it, and
  `.hero__model` — the figure — sits on top, so the brand reads *behind* her as the reference
  has it. There is no background photograph and therefore no second image layer.
  - **`.hero__model` is `object-fit: cover`, not `contain`.** The cut-out is trimmed tight —
    her hair already runs off the top of its own canvas — so letterboxing it would float a
    flat-topped head below a strip of empty ground.
  - **`.hero__model` is sized and bottom-anchored, not `object-fit: cover`.** The cut-out's own
    canvas decides this: her hair has clear headroom at the top and her arms clear the sides,
    but the **bottom row is fully opaque** — the torso is cut flat. So she sits on the frame's
    bottom edge (where the bleed puts that cut just below the card and hides it) and the spare
    room belongs at the top, which is where the wordmark lives. `cover` cropped ~23% off her
    width to fill a shape she doesn't match, which is what made her read as over-zoomed.
  - **`--hero-figure` on `.hero__model` is the size dial** (94% desktop, 116% ≤991px where
    `max-height` binds instead). It needs `max-width: none` beside it — the global
    `img { max-width: 100% }` silently clamps any value over 100% back to the card width, so
    without it the dial appears to do nothing above 100%.
  - **`.hero__frame` is bled at the bottom only** (`inset: 0 0 -6% 0`). The parallax travels
    upward, so that is the edge that needs headroom; a symmetric bleed pushes the figure up and
    crops her head, which this asset cannot afford. That cost a pass to find — don't restore it.
  - `.hero__visual` is the rounded card and does the clipping; the frame inside it is what moves.
  - `.hero__wordmark` is `left: 33%`, well off-centre: the figure fills the right of the card, so
    at a true 50% only the first two letters clear her and the mark reads truncated rather than
    ghosted. It is decorative; the bar carries the real one.
- **Everything else in the band is real.** `.hero__shelf` is three catalogue entries linking to
  their own product pages, `.hero__faces` are the site's existing review portraits, and
  `heroCopy.proof` is a figure the About page already publishes (`aboutCopy.stats`). Don't put an
  invented customer count here.
- **`.hero__shelf-item img` is absolutely positioned and `object-fit: cover`, scaled 0.88** (fixed
  2026-10-19). At `height: auto` the 900x1130 canvas overflowed the 3:2 tile and an overflowing
  grid item pins to the top, so every carton sat on the tile's bottom edge, half cut off. It
  must be absolute: in a content-sized grid row `height: 100%` resolves back to the image's own
  height. The entrance animates the `<li>`, so the `transform` on the `<img>` is safe.
- `.hero__shelf-item a` takes the carton's own 3:2 and clips the canvas — that is enough on its
  own, and it does **not** want `.catalog__media`'s scale-up on top: at 1.75 the ends were cropped
  and the product names cut in half.
- ≤991px it stacks, photograph first via `order: -1`, then the panel carries the rest. The
  wordmark is **re-centred and shrunk** there — off-centre and oversized it runs off a card that
  narrow and reads as a clipped fragment.
- ≤767px `.hero__foot` wraps and `.hero__shelf` takes its own row. The proof cluster is
  `flex: 0 0 auto` (its label must not wrap), so beside three packshots there was not enough room
  left on a phone and the last tile ran out past the panel's rounded edge.

**⚠ Headline reveal moved into `Hero.tsx` and gated on the preloader (2026-10-20 fix).** The
Navbar sequence starts on mount, so the lines rose *behind* the ~5s `Preloader` and were already
still when it lifted (and below 992px there was no reveal at all). `App.tsx` now passes
`<Hero ready={ready} />`; Hero holds `.hero__line > span` at `yPercent: 110` and the copy/foot at
`opacity: 0` until `ready`, then runs the rise (1.1s `power3.out`, stagger 0.12) at every width.
Reduced motion gets no branch. Navbar no longer touches any `.hero__*` element. Verified by
fast-forwarding GSAP's global timeline in Playwright: hidden while `.preloader` exists, `0` after.
The paragraph below is history.

Motion: the band's arrival — headline lines rising behind their masks, then the copy, CTA, proof
and shelf — belongs to the sequence in `Navbar.tsx`, because the hero is hidden behind that
sequence's field until it lifts; anything animating on mount would play unseen. This band adds
only the figure's settle and its scroll parallax, **both on `.hero__frame`** — and on
disjoint properties (entrance owns `scale`/`opacity`, the scrub owns `yPercent`) so the two
tweens cannot fight over the same transform.

Imagery, all in `src/assets/hero/`, converted from the client drops in
`src/assets/latest-images/` — which stays untouched as the source of truth, same convention as
`new/` → `products/`:

| file | what | used by |
|---|---|---|
| `figure.webp` (1236×1272, **alpha**) | the figure holding the **TESAMORELIN** carton, burgundy wardrobe | right half, and the inline disc |
| `stage.webp` (928×1152) | a generated studio backdrop | **unused since the client drop**, kept for now |
| `model.webp`, `showcase.webp` (928×1152) | the purple-palette predecessors | unused since 2026-10-15 |
| `scene.webp` (928×1152) | the carton front-on, round cream plinth, orchids | unused since the 10-14 rebuild |
| `lifestyle.webp`, `lifestyle-wide.webp`, `packshot.webp` | superseded | unused, kept for now |

**`figure.webp` is the client's own art, not generated here.** It is a straight webp conversion
of `latest-images/hero-without bg-new.png` (quality 80, alpha preserved, **no colour grade** —
the file is theirs and ships as supplied). It replaced `hero-withoutbg.png` on 2026-10-15 for
the burgundy redesign: same model, burgundy wardrobe, holding a TESAMORELIN carton instead of
MOTS-C. Both source files remain in `latest-images/`, which stays untouched as the source of
truth, same convention as `new/` → `products/`.

Two earlier passes on 2026-10-15 were superseded by that drop and are worth knowing about only
so they are not repeated:

- Magnific generations put the carton in frame reliably but **garbled its printed text every
  time**, including through an `ideogram-4-5` `preciseEdit` pass aimed at the box face alone.
  Headlines (`MOTS-C`, `ALLUVI`) came through; straplines and small print did not.
- What *did* work was **compositing the real carton onto the generated hand with ffmpeg**:
  `perspective` with `sense=1` mapping the artwork's corners onto the box's quad. Two traps if
  this is ever needed again — `perspective` **extends edge pixels rather than filling**, so a
  solid-white mask warps to white everywhere and the cut-out silently fails (pad both inputs with
  a border first), and the carton needs `fillborders=mode=smear` rather than a transparent pad or
  it picks up a dark fringe along every edge.

**She holds the carton; she does not take anything.** The reference frame has its model putting a
capsule in her mouth with a glass of water — a person consuming the product is the single
clearest way to contradict the research-use-only position. The client's asset keeps the carton in
both hands at chest height with her face clear, which holds that line. **If this is ever
regenerated, negate capsules, pills, tablets, bottles, drinking glasses, water, food, drink and
anything near or entering her mouth, plus syringes, vials, lab coats and clinical settings.**
Raised with the client 2026-10-15; they chose the no-ingestion version.

The 2026-10-14 grade below applied to `model.webp` / `showcase.webp`, which the 10-15 rebuild
replaced. Kept only in case that pair is ever restored:

```
# right half — also calms the orb graphics, which were the loudest thing in the band
eq=brightness=0.025:contrast=0.93:saturation=0.74,
colorbalance=rs=0.01:bs=0.045:gs=-0.005:rm=0.015:bm=0.035:gm=-0.01:rh=0.01:bh=0.02
# left half
eq=brightness=0.03:contrast=0.95:saturation=0.82,
colorbalance=rs=0.01:bs=0.04:gs=-0.005:rm=0.012:bm=0.03:gm=-0.008
```

`scene.webp` was **generated with Magnific** (`images_generate`, the real packshot passed as an
image reference) on 2026-10-14, after `images_replace_background` sat queued indefinitely and was
abandoned. It was reshot once — the first pass put the carton on a rough slab with no clear
contact shadow.

**Every batch so far has produced at least one unusable frame, always the same three ways:** a
visible softbox or lamp in the corner, an invented second pen window on the carton, or the carton
floating with no contact shadow. Generate several and check those three before anything else.

The carton's headline artwork comes through correct; **its small print does not** — the model
re-renders the storage and injection lines as garbled near-text. Illegible at the size it ships
at, but it is altered packaging copy, so do not reuse this asset anywhere it appears large.

**Compliance state of this band — one problem standing, one closed:**

1. **STANDING, client-directed: the live hero shows an ALLUVI TESAMORELIN carton, which this
   catalogue does not stock.** (It was MOTS-C earlier the same day — also not stocked — and
   briefly the catalogue's own Glow 70mg.) The TESAMORELIN packaging carries consumer benefit
   claims — *TARGETED BODY FAT · IMPROVE DEFINITION · PRESERVE LEAN MASS* — and *For subcutaneous
   injection only*, all of which sit against the research-use-only line on every product page.
   At the size it ships the strapline is legible on a large display. **So every word in the band
   must describe the catalogue and never the carton**, same rule as the promo banner, and nothing
   may be placed next to this image that reads as a claim. Raised with the client each time the
   art changed; their call.
2. **CLOSED: `showcase.webp` depicts health outcomes** — an orb chain of energy, waistline,
   brain, joint, immunity and skin. That is consumer benefit imagery on a laboratory-use-only
   catalogue, and it is the one thing the imagery rules elsewhere in this file explicitly
   exclude. It was client-directed on 2026-10-14 and was the inline disc's source; **the disc now
   crops `figure.webp` instead**, so none of it renders anywhere. Don't point the disc back at it.

What *does* still stand is the headline copy — see `heroCopy.lines` above: benefit language on a
research-use-only catalogue, client-directed, flagged in `site.ts` for whoever signs off the
compliance copy.

**Two different limes — don't conflate them.** `--brand-lime #b3ea88` is the hero's CTA fill
(2026-10-15, sampled off the reference). `--color-secondary #b8f52a` below is the dark theme's
shop-CTA colour and has nothing to do with the hero.

**Lime `#b8f52a` (`--color-secondary`)** is the shop-CTA colour. It was briefly promoted to
`--color-accent` site-wide and **reverted** — cream is the accent again; lime stays on
`.btn--secondary`. (It no longer appears in the hero: the 2026-10-14 rebuild dropped the lime
backdrop cards along with `.hero__layer*`, `.hero__actions`, `.hero__signals`, `.hero__display`
and the two `.hero__image-tag` badges.)
`.btn--secondary` lives in `portfolio.css` beside `.btn--primary`, **not** in `index.css` —
that file's `.btn` block is later in the cascade and would reset the variant's border.

**Trust bar** (`TrustBar.tsx`, `trustBar` in `site.ts`, `.trustbar__*` at the end of
`portfolio.css`) — **added 2026-10-15**, mounted between `Hero` and `ProductShowcase`. A quiet,
low-contrast six-up row spanning the full width under the hero's two cards.

- **Built to a reference that fills this slot with partner logos — ours carries credentials
  instead, and that is not a shortcut.** There are no partner or certification marks to show:
  the only genuinely named third party in the project is **Janoshik Analytical**, the lab behind
  `scienceReports`. Drawing logo-shaped marks for the rest would read as endorsements the site
  cannot evidence, which is what the "never fabricate certifications" rule exists to prevent.
  Each entry is a generic line icon plus a fact the site already backs up elsewhere, and only
  Janoshik is named. **Do not add a mark here without a real relationship behind it.**
- **It is burgundy at full strength as of 2026-10-20** (requested): `--brand-primary`, opacity 1,
  which is the colour it previously showed **only on hover**. Hover now deepens to
  `--brand-primary-deep` so the row keeps an affordance. This reverses the original
  "it must stay quiet (`--brand-muted`, 0.85)" decision — that was about not competing with
  the hero above it; the call now is that six credentials should read as credentials.
- **It carries no scroll reveal, deliberately.** A `data-anim="up"` stagger was added and
  **removed the same day**: the strip spans the hero's two cards, so at 1440x900 it sits just
  below the fold, and a reveal keyed to `top 85%` left all six entries invisible on arrival —
  exactly when the row has to be readable. Anything animated here must play on load.
- Six items will not fit one line below ~1200px, so the row becomes a horizontal scroll rail
  rather than shrinking the type to breaking point.

**Product showcase** (`ProductShowcase.tsx`, `showcaseCopy` in `site.ts`, `.showcase__*` at the
end of `portfolio.css`) — **added 2026-10-15**, mounted directly between `Hero` and `Catalogue`.
Built to a supplement-site reference: a centred `01 · What's inside matters` chip, then one
device held large on a ringed stage with three white claim cards floating around it.

- **Every asset is the client's own artwork, cropped and de-skewed — nothing is generated.**
  Generating a carton re-draws the printed packaging, which the image models reliably garble
  (see the hero notes). `latest-images/` stays the untouched source.
- **The carton is the client's own TESAMORELIN render** (`carton-tesamorelin.webp`,
  2026-10-15): `latest-images/tesamorelin.png` cropped to its alpha bounds
  (`crop=1110:524:7:463`, measured — don't eyeball it) and converted to webp at quality 90.
  Nothing else is done to it. It already carries its own contact shadow, so the CSS
  `drop-shadow` on `.showcase__product` is only reinforcing it.
  - **Two earlier reconstructions are superseded and must not be revived.** Before this render
    existed, the face was recovered from the hero shot — de-skewed with ffmpeg `perspective`,
    then composited onto the MOTS-C box geometry to borrow its edges and shadow. It was soft,
    hard-edged and visibly a photo of something being held. If a new compound ever needs the
    same treatment: measure the carton's corners on a fine grid first, note that a hand-held
    carton usually tilts (in that shot the top-right corner sat *lower* than the top-left, and
    assuming otherwise cost two passes), and **ask for a proper render before attempting it** —
    that is what finally fixed this one.
  - `carton.webp` is the untouched MOTS-C render — kept on disk, no longer imported.
- **The product is sized to dominate the stage** (`width: clamp(16rem, 52%, 34rem)` against a
  `min-height: clamp(18rem, 30vw, 26rem)` visual). At the original 42% / 37vw it read as a small
  object adrift in a large empty frame, which is not how the reference frames its bottle.
- **Nothing is scattered around the carton — the stage is the rings and the product, nothing
  else.** Two passes at a surround were built and both removed on request: cut-out pre-filled
  pens, and then the carton's own printed motifs (the purple ribbon and orange molecular
  lattice, keyed off the box face with
  `crop=…,format=rgba,colorkey=0xf6f3f7:0.26:0.10`). All three files are kept but no longer
  imported — `assets/showcase/{pen,motif-wave,motif-lattice}.webp`. If a surround is ever wanted
  again, note the motif crops need a radial `mask-image`: they are rectangular crops out of a
  box face and without the feather their edges stop on a hard line and read as torn-off scraps.
  Whatever is used, it cannot be capsules — the reference tumbles them round its bottle, this
  catalogue has none, and a pill strewn around a research-only device would contradict every
  product page.
- `.showcase__visual` and `.showcase__cards` are **siblings**, not nested. The cards are an
  absolutely-positioned overlay on desktop (`pointer-events: none`, re-enabled per card) and
  drop into a plain 3-up row below the artwork at ≤991px. Keeping them out of the visual is what
  lets that reflow happen without disturbing the rings.
- Card placement is **clear of the carton's footprint** — it is landscape where the reference's
  bottle is portrait, so the left-hand cards sit high and low rather than beside it.
- **COMPLIANCE: the carton pictured is ALLUVI MOTS-C, which this catalogue does not stock**, and
  its packaging carries benefit claims. So no line of `showcaseCopy` describes that carton — the
  three cards are about how lots in *this* catalogue are supplied, and every figure is one the
  site already publishes (`aboutCopy.stats` for 99%+, the Janoshik lots in `scienceReports`,
  `promoCopy` for the format). The product image takes a generic alt that names no compound.
  Same rule as the promo banner — don't let this copy drift onto the carton.

**Proof bento / "How a lot is supplied"** (`ProofBento.tsx`, `bentoCopy` in `site.ts`,
`.bento__*` at the end of `portfolio.css`) — added 2026-10-16, **rebuilt the same day to a
numbered-tile reference, then unmounted on request before that rebuild was finished.**
Read this whole entry before remounting it.

**State as it stands in the tree** — a cream panel inset on the page, a rule-flanked eyebrow
over a two-line heading with a burgundy pill CTA opposite it, and four numbered tiles: a tall
burgundy feature tile spanning both rows on the left, a white and a tinted tile beside it, and
a soft wide tile underneath. Two tiles carry a packshot.

- **It was pulled mid-pass and is not finished.** Verified at 1440 before it was removed:
  `tsc -b` clean, `npm run build` passes, 0 JS errors, and the grid lands in the reference's
  composition. **Two things were still wrong and are not fixed:** the feature tile's packshot
  **overlaps its own title and body** (it needs to be smaller and clear of the copy), and
  `.bento__title` carries `max-width: 14ch`, which breaks the heading to **three** lines where
  the reference has two. Nothing below 1440 was checked at all.
  - The packshot was also rendering **vertically stretched**; that one *is* fixed —
    `height: auto` on `.bento__tile--feature .bento__shot`. The packshots carry intrinsic
    `width`/`height` attributes, so a rule that sets only `width` leaves the 1130px attribute
    height in force. Worth knowing anywhere else a packshot is positioned by width alone.
- **The reference's four tiles are consumer outcome categories** — Energy, Focus, Immunity,
  Recovery, each with a line about what it does for the reader. None of that is sayable on a
  research-use-only catalogue, so the tiles are filled from **`standards` in `data/science.ts`**
  — the same four numbered entries the Science page publishes, read in the component so the two
  cannot drift, and so a fifth standard would appear by itself.
- **The earlier 2×2 bento is gone from the tree**, markup and CSS. Keep its reasons: that
  version's reference put a woman **ingesting** a tablet in one tile, a symptom checklist in
  another, and a fabricated *"50+ Clinicians' Choice"* badge over a fabricated professor's
  quote in a third. `bentoCopy.checks` / `.tested` / `.packing` / `.lead` went with it.
- **`.bento__tile-title` must not set a colour.** It is shared by the burgundy tile and the
  three light ones; an `#ffffff` on it once rendered a light card's heading white on white and
  the heading vanished entirely. Each tile states its own ink.
- `grid-auto-rows` is a fixed height, not `auto`: the four tiles carry very different amounts
  of copy and on auto rows the grid stepped into an uneven patchwork.
- **`.bento__inner` is deliberately inset past the shared line** (requested). Every other band
  starts on `--hero-inset + --gutter`; this one takes that as a margin and carries its own
  padding, because it is a panel on the page rather than a full-bleed band. Its sand fill is
  also what separates it from the sand bands above and below — the white gutters are the seam.
- `assets/bento/quote-ground.webp` (Magnific, burgundy liquid macro, 1600×1208, 45 KB) is
  **no longer imported** — it was the old voice tile's ground. On disk, unused.

**Featured lot** (`ProductFeature.tsx`, `featureCopy` in `site.ts`, `.feature__*` at the end of
`portfolio.css`) — **added 2026-10-16**, mounted **under `CompoundCollage`** (it first took the
slot `ProofBento` vacated, above the collage, and was moved below it on request). Built to a client reference: a split band — a photograph on the left, a solid colour
panel on the right carrying a rule-flanked eyebrow, a two-line headline, a lead, three chips,
the price, and a quantity stepper beside an Add to Cart pill. **It is the only band on the home
view that puts a price and a real add-to-cart on a single named lot** (`ProductRange`'s cards
add quietly from a hover pill; this one is the shop-the-feature band).

- **Two lines of the reference could not ship.** Its headline is *"Your everyday foundation."* —
  a personal benefit claim, the one register this catalogue cannot use. And its chips read
  *30 Daily Capsules · Plant-Based · Third-Party Tested*: the first two describe a consumer
  supplement, and there are no capsules and no formulation claims here. The cadence is kept and
  **the chips are derived in the component** from the lot's `Form` and `Total content` specs
  plus the real `labAnalysis.purity` — a chip with no source is dropped, so a lot without an
  analysis shows two.
- **Everything shoppable is real.** `featureCopy.productId` picks the lot; the lead is that
  lot's own `summary`, the price is `formatUsd(p.price)`, the note is its own `safetyProtocol`,
  and the stepper adds that quantity to the real cart via `useCart` and opens the drawer.
  Verified end to end: decrement disabled at 1, +2 → 3, − → 2, `liora.cart.v1` lands
  `[{"id":"p2","qty":2}]`, drawer opens, 0 console errors.
- **`productId` is `p2` (Glow 70mg) deliberately** — `ProductSpotlight` sits directly above and
  is built around `p1`. Changing it re-derives the chips, lead, price and packshot together, so
  it is a one-line swap; the photograph is product-adjacent and does not have to change with it.
- **The photograph is `assets/feature/featured-lot.webp`** (1024×1536, 214 KB) — a straight
  webp conversion of the client drop `latest-images/featured-img.png`, which stays untouched as
  the source of truth, same convention as `new/` → `products/`. It replaced
  `standards/packaging.webp` (a carton in an insulated mailer) on request, 2026-10-16.
  - **It is portrait 2:3 in a landscape slot**, so `cover` discards ~40% of its height. Nothing
    is baked into the file: `object-position: center 42%` frames it. Measured against the
    source, the carton and the hand placing it sit at 28–62% down the frame and a *centred*
    crop keeps only 19.7–80.3%, which clips the bag's mouth — hence the upward bias. Re-check
    this value if the photograph is ever swapped.
  - **COMPLIANCE, open: the photograph shows an ALLUVI TESAMORELIN carton, which this catalogue
    does not stock, while the panel names and prices Glow 70mg.** That is a straight mismatch —
    the band pictures one product and sells another — and it is sharper than the same problem in
    the hero, which names no product at all. The TESAMORELIN packaging also carries consumer
    benefit claims (*TARGETED BODY FAT · IMPROVE DEFINITION · PRESERVE LEAN MASS*) and
    *For subcutaneous injection only*, legible at this crop. **So every word in the band must
    describe the catalogue and never the carton**, same rule as the hero and the promo banner,
    and `featureCopy.photoAlt` names no compound. Raised when the image landed; the client
    chose the photograph. Two ways to close it if it is ever revisited: point
    `featureCopy.productId` at TESAMORELIN once that lot actually exists (it is the blocked
    pending task — no price, no Janoshik report), or drop the price and the named lot from the
    panel so the band stops making a product claim.
  - **The featured lot's own packshot card is gone** (`.feature__packshot*`, removed on request
    the same day). It was added precisely so the panel would not price a carton the band never
    shows, and briefly moved bottom-left because the client photo puts its own carton on the
    right — but two different cartons in one band read worse than one. Removing it is what
    leaves the mismatch above with nothing to offset it. In git if it is wanted back.
- **It is narrower than every other band, and centred** (requested). **Widened to 80rem on
  2026-10-17**, which means the cap no longer bites below ~1440 — the band is full width there
  and only starts centring above it (1225px at 1440, 1280px at 1920). `--feature-max`
  on `.feature__inner` caps it and `margin-inline: auto` centres it; the section's own
  `padding-inline` keeps `--hero-inset + --gutter` as the floor, so the cap only bites above
  ~1230px and narrow viewports still get the standard margin. Measured 1288px → **1088px** at
  1440, and it stops growing at 1920 where the neighbouring bands keep widening. Height was
  unaffected (495 → 495). **This is deliberately out of step with the shared line** — same
  footnote as `.bento__inner`, opposite direction.
- **The band's height was cut ~23% on request** (643px → 495px at 1440; the section with its
  padding, 755px → 591px). The real cause was not spacing: **`.feature__photo` was in the flow**,
  so the grid row took the square 1200×1200 file's own ratio at the column's width and the band
  grew to 643px where `min-height` had asked for 512. It is `position: absolute; inset: 0` now —
  **don't put it back in the flow**, or the band silently re-inflates to whatever the photograph
  happens to be. `min-height` on `.feature__inner` is the only thing that may set this height.
  The panel's padding, headline, price and gaps were tightened alongside it, and
  `.feature__note`'s measure widened to `62ch` so the research-use-only line sits on one row.
- `.feature__line` carries **no mask**. The lines are not animated individually, and
  `overflow: hidden` on a line box clips descenders — "fully documented." has two.
- **`.feature__media` needs a resting `clip-path: inset(0% 0% 0% 0%)`.** The entrance wipes
  from `inset(0% 100% 0% 0%)`, and GSAP cannot interpolate an inset towards `none`.
- Entrance owns `clipPath`/`scale`/`y`/`opacity` and there is no scrub, so the usual
  disjoint-property rule is satisfied trivially. Reduced motion gets no `mm.add` branch and
  every tween is a `from`, so the finished state renders straight from CSS.
- **The band is rounded where the reference's is square** — the hero's two cards and the bento
  panel both round at `--radius-lg`, and a hard rectangle between them read as a different site.
  One line on `.feature__inner` to flip back.
- **The price is knockout white, not a bright accent.** The reference sets its price in lime;
  the burgundy palette has no lime (`--brand-lime*` were deleted in the 10-15 redesign) and
  `--brand-rose` sits too close to the field to read, so the size carries it instead.

**About band** (`AboutBand.tsx`, `aboutBandCopy` in `site.ts`, `.aboutband__*` at the end of
`portfolio.css`) — **added 2026-10-17**, mounted under `TrustBar`. Built to **two** client
references: the *layout* of one — a tall photograph left, a two-line headline right, and under
it a small photograph beside a paragraph and a pill CTA — and the *text effect* of the other.

- **The paragraph is `aboutCopy.paragraph`, read in the component rather than restated**, so
  this band and the `#/about` page cannot drift. Editing that one field changes both, which is
  the point. `aboutBandCopy` holds only what is new here: eyebrow, the two headline lines, the
  CTA and the two alts.
- **Neither reference's copy could ship.** The first heads itself *"Created With Science. /
  Made For Your Lifestyle."* over a paragraph about "maintaining healthy vision" and
  "supporting everyday eye wellness"; the second runs *"we create gentle, effective skincare
  that nourishes, protects and strengthens your skin"*, closing on *"healthy skin is always
  beautiful skin"*. Both are consumer outcome claims, and the first also says the shop
  formulates the product — this catalogue supplies reference material and formulates nothing.
- **The text effect is a scrubbed per-word fill**, the second reference's device: the
  paragraph arrives at `opacity: .22` and fills to ink one word at a time as the band passes
  (`stagger: 1` with `scrub`, triggered on `.aboutband__text`, `top 85%` → `bottom 55%` so the
  last word lands before the paragraph leaves the middle of the screen).
  - The words are **split in the component, not in the data** — the copy stays one readable
    string in `site.ts`, and because the spans are plain inline text the paragraph still
    selects and reads as one sentence.
  - **`opacity`, not `color`**: the ink is already the body colour, so fading it gives the
    reference's grey-to-black run with no colour interpolation, and the resting CSS state is
    the *finished* one — reduced motion gets no tween at all and renders the paragraph at full
    strength.
  - It owns `opacity` on the words alone; the photographs' entrance owns `clipPath`/`scale`.
    Disjoint properties, the usual rule.
- `.aboutband__media--tall` is **4/4.4** (trimmed from 4/5 on request, 2026-10-19), **not the reference's 3/4**: the right column's content is
  shorter than the photograph, and at 3/4 it left ~80px of dead panel under the CTA.
- `.aboutband__media--inset` (the `about2` photograph) went **4/3 → 4/3.4 on request**
  (2026-10-19) — 206px → 233px tall at 1440. `.aboutband__row` is `align-items: center`, so
  the extra height grows symmetrically about the paragraph beside it, and the band's own
  height is unchanged (617px) because the tall photograph still sets it. The ≤560px rule
  (16/10, stacked) is deliberately left alone.
- Both `.aboutband__media` frames need a resting `clip-path: inset(0 0 0 0)` — the entrance
  wipes from an inset and GSAP cannot interpolate one towards `none`. Same note as
  `.feature__media`.
- **Imagery is the client's own as of 2026-10-17** — `assets/aboutband/portrait.webp` and
  `inset.webp`, straight webp conversions of `latest-images/about1.png` and `about2.jpeg`.
  They replaced `categories/recovery.webp` and `standards/consistency.webp`, which had no
  compliance issue at all; these two have one each, and `aboutBandCopy` records both:
  - **The tall tile is an ALLUVI TESAMORELIN carton, which this catalogue does not stock** —
    not in `projects`, no price, no report — and its **benefit strapline is legible** at this
    size, as is *For subcutaneous injection only*. Nothing in the band quotes the pack and the
    alt names no compound.
    **The drop was replaced twice on 2026-10-17** — `about1.png` -> `about1-new.png` ->
    `about1-latest.png`, same framing each time. The first was a **MOTS-C** carton whose
    printed copy the image model had **garbled** (*“BOHSI DVOIOI /lHPPOVE”*, *“ALLUVI
    REACTHCARE”*, *“A0mg”*); the current drop's pack text is clean, which closes that.
  - **The inset is the health-outcome orb chain** (energy, waistline, brain, joint, immunity,
    skin) — the same artwork `showcase.webp` was dropped for on 2026-10-15 and the FAQ band
    still carries. Consumer benefit imagery on a laboratory-use-only catalogue. Client-chosen
    each time.
- **The paragraph is sentence case as of 2026-10-19** (requested). It was set in capitals from
  2026-10-17, as the text-effect reference sets its own. The extra tracking (`0.02em`) and the
  loose line (`1.75`) existed *for* the caps — a block of capitals needs both at this measure —
  so they came down with the transform, to `0` and `1.65`, and the size went up a step. **Don't
  reinstate one without the other**, in either direction. The scrubbed word-fill is unaffected;
  it owns `opacity`, not casing.
- **Both photographs drift on scroll** (requested, 2026-10-17) and **counter-drift** — the
  tall one down, the inset up — which is what makes the pair read as two planes rather than
  one flat row. The scrub owns `yPercent` on the `<img>`s; the entrance owns `clipPath` on the
  frames and `scale` on the tall image, so nothing shares a property on the same element.
  - **The travel room is CSS, not the tween.** `.aboutband__media img` is `height: 114%` at
    `inset: -7% 0` against a drift of ±6%. At a flush 100% the parallax drags the frame's own
    background in at whichever edge it moves away from. Verified the image overhangs the frame
    at **every** sampled scroll position and width (worst margin −8px at 375, −42px at 1920).
- **The word-reveal is shared with `WhyChoose`** (requested, 2026-10-17): that band runs the
  same scrubbed grey-to-ink fill on its four row labels, at the same settings, so the two read
  as one device. There it owns `opacity` on `.whychoose__label` — a *child* of the row its
  entrance animates, which is what keeps the two tweens off the same property on the same
  element.
- **It sits under `TrustBar`, not directly under `Hero`**, because the trust strip is the row
  spanning the hero's two cards rather than a section of its own.
- ≤991px the tall photograph goes over the panel at 16/9; ≤560px the inset row stacks too.

**Plinth band** (`ProductPlinth.tsx`, `plinthCopy` in `site.ts`, `.plinth__*` at the end of
`portfolio.css`) — added 2026-10-17 between `ScienceBand` and `WhyChoose`, **and unmounted on
request the same day**. Component, copy and CSS are untouched, so remounting it is one line in
`App.tsx` plus its import; it shares `assets/lotfan/face.webp` with `LotFan`, so it leaves no
asset of its own behind. Built
to a client screenshot: a centred two-line headline over a lead, the pack standing on a white
plinth, an icon feature either side of it, a round link badge, and a foot of three things — a
short aside, a small card with a photo and a link, and one large figure.

- **The reference is a skincare page and almost none of its copy transfers.** Its headline is
  *"Radiant skin, / Unveiled naturally"* over "clean-label skincare designed with botanical
  precision… a daily ritual that feels completely transformative", and its features read
  *Carefully selected ingredients* and *Quality-Focused Selection* — outcome and formulation
  claims, on a catalogue that formulates nothing. The composition is kept; every line here is
  something the site already evidences.
- **The figure is `aboutCopy.stats[1]`, read in the component.** The reference's *48k+ real
  experiences, honest recommendations* is a review-volume claim and there is no review data in
  this project — inventing one is the same fabrication the rules exclude everywhere else.
- **The round badge goes to the catalogue, not to the pack.** The reference's reads *Explore
  Product*; TESAMORELIN has no product page to send anyone to, and a badge that looked like one
  would be the clearest possible implication that the lot is for sale. Same reason there is no
  price in the band. The compliance note on `lotFanCopy` applies here too.
- **The pack is the same built box as the badge band** — `assets/lotfan/face.webp` as the front
  face with a top and a right side hinged on its edges, `perspective` on the wrapper because
  GSAP writes `transform` wholesale, and a **positive-only** scrub (`rotateY 6deg → 24deg`)
  because the left side is not built. The two bands share the asset deliberately; a second crop
  of the same carton would be two things to keep in step.
- **The plinth has to be wider than the pack.** The carton is 2.17:1, so at the reference's
  proportions it overhangs a narrower block and stops reading as standing on it: the plinth is
  `min(96%, 30rem)` against the pack's `min(72%, 23rem)`, and the pack carries a small negative
  bottom margin so it sits *on* the top edge rather than floating above it.
- `.plinth__features` is an absolute overlay on desktop and becomes a **row under the stage at
  ≤991px**, then a stack at ≤560px where the badge also leaves the stage and becomes a pill —
  at that width the disc covers the carton.
- Motion: one `once: true` entrance (masked headline lines, lead, the plinth growing from its
  base, the pack rising onto it, features in from their own sides, badge, foot) plus the scrub,
  which owns the box's rotation alone — disjoint from the entrance's `y`/`opacity`/`scaleY`/`x`.

**⚠ Unmounted on request 2026-10-19** (component, copy, CSS and `assets/confidence/` kept).
**Confidence band** (`ConfidenceBand.tsx`, `confidenceCopy` in `site.ts`, `.confidence__*` at the
end of `portfolio.css`, `assets/confidence/`) — **added 2026-10-19** under `DriftBand`, to a
client reference: a small tracked uppercase heading, three outlined-icon features down each side,
and a product **film** in the middle (the reference had a still).

- **Five of the reference's six features were supplement claims** (Non-GMO, Vegan, "engineered for
  potency and absorption", natural ingredients, "no heavy metals") and were replaced with facts the
  site evidences; only *Third-party tested* survives. See the `confidenceCopy` comment.
- **The film is `assets/confidence/loop.mp4` (720², 6s seamless, h264, 239 KB, no audio) — built
  with ffmpeg from `lotoffer/carton.webp`, not by an AI video model.** The carton floats, breathes
  and tilts on sine curves with a period equal to the clip, over a radial ground with an orbiting
  rose glow and a floor shadow that shrinks as it rises. `poster.webp` is frame 0. (A peptide-chain
  version — glass beads orbiting the carton — was rendered on 2026-10-19 and **reverted on
  request**.)
- **⚠ THE FILM IS NO LONGER MOUNTED.** On request (2026-10-19) the centre media was swapped for
  a client still, `assets/confidence/analysis.webp` — a straight webp conversion of
  `latest-images/product-analysis.png` (941x1672, alpha, 294 KB), a cut-out of a figure holding
  a carton. `loop.mp4` and `poster.webp` are kept on disk, so restoring the film is one import
  plus the `<video>` markup, which is in git. The IntersectionObserver playback gate went with
  it; a still needs no observer.
  - The drop is a **tall cut-out in a near-square frame**, so `.confidence__media img` is
    `object-fit: contain` with `object-position: center bottom`. At `cover` the carton is
    cropped out of the bottom third. The radial `mask-image` feathers the figure's cut bottom
    edge into the band.
  - **COMPLIANCE, open and worse than the usual case: the carton's printed copy is garbled.**
    The headline renders as mangled, partly mirrored letterforms; *ALLUVI HEALTHCARE* comes
    through as "HEAI†C.ARE"; the strapline is reversed nonsense; *10 doses of 2 mg* reads
    "10 ōeex 2 mg"; the pen label is mirrored. This is **altered packaging copy** — the one
    thing the Campaign entry says to never ship ("Never ship an outpaint of a pack shot without
    checking its small print at 1:1"), and the same failure the about band's first two drops
    were replaced for. The headline is legible enough at the shipped size (~250px wide at 1440)
    to read as wrong on a large display.
    - It is also a **TESAMORELIN carton, which this catalogue does not stock**, so the usual
      rule applies: nothing in the band may describe the pack, and `confidenceCopy.mediaAlt`
      names no compound.
    - **The band is headed *"Documented before it ships"***, which is the sharpest possible
      place for this. Raised when the swap was made; client-directed.
    - **Two ways to close it**: composite the real catalogue render onto the garbled face (the
      method the Billboard band and Campaign both use — note this carton is at an angle, so it
      needs a `perspective` warp with measured corners, not a straight overlay), or restore the
      film, which was built from the real render precisely to avoid this.
- The panel is feathered with a radial `mask-image` so the media's ground melts into the band.
- Motion: entrance (heading, media scale-in, columns from their own sides), icons drawn in via
  `strokeDashoffset`, and a scrub owning `yPercent` on the centre media.
- ≤991px the media goes on top and the features run two columns; ≤560px one column.

**Drift band** (`DriftBand.tsx`, `driftCopy` in `site.ts`, `.drift__*` at the end of
`portfolio.css`) — **added 2026-10-19** between `ScienceBand` and `WhyChoose`, to a client
reference: a centred uppercase three-line statement with six tilted, white-mounted photo tiles
scattered around it.

- **Copy:** the reference's *"Gentle ingredients, powerful skin transformation daily"* is an outcome
  claim; ours is *Sealed lots, / published reports, / the same every order.* — what `promoCopy`
  already says — plus a pill link to `#/science?s=reports`.
- **⚠ Imagery replaced 2026-10-20 (requested) — the six tiles are now the client's gallery
  set**, `assets/drift/gallery{1-new,2,3,4,5,6}.webp`: straight webp conversions (scale 720,
  quality 82) of `latest-images/gallery*.png`, which stays untouched as the source of truth.
  Tile 1 takes `gallery1-new.png`, the client's replacement for `gallery1.png` the same day;
  the old `gallery1.webp` was deleted rather than left unused, as it had never been committed.
  Each tile is one import + one `TILES` entry.
  - **The drops are 4:5 and the tiles are square**, so `cover` crops a fifth of the height.
    `.drift__float img` reads **`object-position: center var(--pos, 50%)`** and a tile may set
    `pos` in `TILES` — tile 1 is at **15%** because she stands high in that frame and a centred
    crop took the top of her head. Check the crop on any new drop before assuming 50% works.
  - **COMPLIANCE, open: every frame is a person holding an ALLUVI pack**, and the packs include
    **MOTS-C, TESAMORELIN and CJC-1295, none of which this catalogue stocks** (the Retatrutide
    and Tirzepatide frames are stocked lots). Several straplines are legible in the source
    files, though not at the ~190px the tiles render. Usual rule, as for the hero and the about
    band: nothing in `driftCopy` describes a pack and **no alt names a compound**. It is also
    the largest set of consumer-lifestyle frames on the site. Client-directed.
  - The previous tiles — `standards/{purity,consistency,packaging}`,
    `categories/{cellular,recovery}`, `spotlight/details/p2-molecules` — are still used by other
    bands, so nothing was orphaned. `metabolic` / `peptide` (body-focused) were left out of that
    set on purpose; that note is history now.
- **Four animations, four layers, no shared transform:** `.drift__tile` takes the scroll parallax
  (`y`; its seat and tilt are the CSS `translate`/`rotate` properties, which compose with GSAP's
  `transform`), `.drift__scroll` the scrubbed fly-out from the statement's centre (px offsets from
  function values + `invalidateOnRefresh`), `.drift__lean` a `quickTo` pointer lean on fine
  pointers only, `.drift__float` a CSS idle bob (off under reduced motion). Headline lines rise
  behind masks. Reduced motion gets the finished layout.
- Tile `size` is a share of the stage width, scaled by `--k` (1 / 1.45 at ≤991 / 1.9 at ≤767);
  ≤767 the fourth tile is hidden and the lines are `nowrap` at a phone size.

**⚠ Unmounted on request 2026-10-19** (component, copy, CSS and assets kept; `lotoffer/carton.webp`
is still used by the confidence film). **Lot offer band** (`LotOffer.tsx`, `lotOfferCopy` in `site.ts`, `.lotoffer__*` at the end of
`portfolio.css`, `assets/lotoffer/carton.webp`) — **added 2026-10-19** in the "Inside the lot"
slot, replacing `LotFan`. Built to a client screenshot of a starter-kit offer: a pale blush stage
with the product at left, a dark burgundy panel at right with headline, the priced product line,
an itemised "includes" list, a total, a full-width white CTA and small outlined badges.

- **The reference's list could not ship as drawn**: every row had a struck-through was-price beside
  *Free*, and the total advertised a saving. No bonus items, bundles or discounts exist here, so
  those are fabricated figures. **Rows are derived from the lot** — `packageContents` (tag *In the
  box*), the `labAnalysis` report with batch and purity (*Published*), and a cold-stored dispatch
  row from `promoCopy`'s claim (*Standard*). The total is the real unit price.
- **`productId` is `p1`** (Retatrutide 20mg, $350, Janoshik 99.21%), and the carton pictured is
  that lot's own render — the band names, prices and shows the same product. `ProductFeature`
  below sells `p2`. The CTA adds 1 × `p1` and opens the drawer; verified `liora.cart.v1` lands
  `[{"id":"p1","qty":1}]`.
- **The stage is CSS, not a photograph.** A generated studio scene (empty plinth, blank burgundy
  cold-pack pouch, real carton composited on after) was planned, but neither Higgsfield nor
  Magnific was connected on 2026-10-19. `carton.webp` is the catalogue render cropped to the
  carton + shadow (`crop=900:480:0:345`). Swapping in a scene is one import.
- `.lotoffer__pack` needs **`isolation: isolate`** — its halo disc and floor shadow sit at a
  negative z-index and otherwise fall behind the stage's own background.
- Motion: one `once: true` entrance plus a scrub owning `yPercent` on the `<img>` alone.
- ≤991px it stacks, stage first.

**⚠ Unmounted on request 2026-10-19** (component, copy, CSS and `assets/billboard/` kept).
**Billboard band** (`Billboard.tsx`, `billboardCopy` in `site.ts`, `.billboard__*` at the end
of `portfolio.css`, `assets/billboard/`) — **added 2026-10-19**, mounted under `LineStory`.
Built to a client screenshot of a skincare page: a saturated colour panel with an enormous
ghost wordmark filling it, a cut-out figure holding the product over it, a frosted glass pill
bottom left, a short copy block bottom right, and a 4-up card row underneath.

- **The figure is a generated plate with the real carton composited in, and that method is
  the point.** Image models re-draw printed packaging and reliably garble it — the hero notes
  record three separate attempts. So the plate was generated with her holding a **completely
  blank white box**, and the catalogue's own render was pasted onto it. Every pixel of the
  pack is real artwork; nothing on it was drawn by a model. This is the second time the
  project has used this method (Campaign build 1 was the first) and it is now the standard
  route for putting a real carton in a generated hand.
  - **The blank box was detected, not eyeballed**: a luminance/chroma scan of the 880x1168
    plate (neutral, `min(r,g,b) > 214`, `max-min < 9`) puts its face at **x 211, y 338,
    220 x 111**, with only a ~2px lean — near enough front-on that no `perspective` warp was
    needed, just a straight `overlay` of the carton scaled to 222x113 at (210, 337), a 1px
    bleed each side so no white sliver haloes it.
  - The carton is stretched ~11% vertically to meet the box (2.17 → 1.96). Invisible at render
    size, and well under the 14% `ProductSpotlight` already does.
  - Background removed with Higgsfield's `image_background_remover`, then **trimmed to its
    alpha bounds** (`crop=524:1153:170:15`). Verified: alpha 0 at all four corners, 254 on the
    figure, 41.8% opaque.
  - The generation prompt's negation list is the one that works and should be reused: no
    text/letters/numbers/logos anywhere *especially on the box*, no capsules, pills, tablets,
    bottles, jars, tubes, droppers, glasses, water, food or drink, nothing near her mouth, no
    syringes, needles, vials or ampoules, no lab coats, gloves or clinical settings, no warm
    amber/golden grade. **One generation, two variants, first one used.**
- **`billboardCopy.productId` is a stocked lot** (`p1`), which is why this band may name it,
  price it, link to it and set its name as the ghost word — unlike the hero, science and
  about bands, which picture cartons the catalogue does not carry and are written around them.
- **The four cards are the lot's real `specs`**, read in the component, so a spec edited on
  the product data changes the band with it. The reference's own four are ingredient and
  benefit cards (*"Cleansing Oil / Deep makeup removal"*), the register every product page
  disclaims. Their images are the `standards/*` product stills — **not** the `categories/*`
  lifestyle set, for the same reason the product reel avoids it: beside a named and priced lot
  a fitness frame reads as that compound's outcome.
- **`.billboard__figure` is top-anchored, and that is load-bearing.** She has to be taller
  than the panel so it crops her — the reference's framing — but the crop has to fall at her
  thighs, not her head. Bottom-anchored the overflow comes off the *top* instead and both her
  head and the carton leave the frame; that cost a pass. Cropping from the bottom also
  disposes of the cut-out's own flat bottom row, which is its canvas edge.
- **The panel is 16/9 and the figure 148% of it.** At the 16/11 first pass the lower half was
  dead colour and the carton read small; square at ≤991px with the figure at 134%, because a
  4/5 panel stood 1040px tall on a 931px width and read as a portrait crop rather than a band.
- `.billboard__pill` is the reference's glass chip, and it needs `backdrop-filter` to read as
  frosted rather than as a flat translucent box — the ghost word and the figure both pass
  behind it. It is a real link; the band's only control.
- The panel is `--brand-primary`, not the reference's gold — the brief allows one accent plus
  the rose. It is **inset on the page with rounded corners**, as the reference draws it, the
  same device `.bento__inner` uses.
- Motion: one `once: true` entrance (ghost, then the figure rising onto it, then pill, copy
  and cards) plus two scrubs — `x` on the ghost and `y` on the figure's `<img>`, counter-
  drifting so the two read as separate planes. The entrance owns `yPercent`/`opacity` on the
  figure *wrapper* and the scrub owns `y` on the `<img>` inside it, so nothing shares a
  property on one element — the usual rule.
- ≤991px the copy block is dropped (it collides with the figure at that panel width) and the
  cards go 2-up; ≤480px the pill centres.
- Note this makes the ghost word the site's **third** (`WhyChoose`, the unmounted `LotFan`,
  and this). `LineStory` had one too until it was removed on request the same day.

**Offer banner** (**unmounted on request 2026-10-19, the same day it was added**)
(`OfferBanner.tsx`, `offerBannerCopy` in `site.ts`, `.offerband__*` at the end of
`portfolio.css`, `assets/offer/`) — it sat **directly above `FAQ`**. Component, copy, CSS and
its three composited chips are all untouched and still in the tree, so remounting it is one
line in `App.tsx` plus its import. The notes below describe it as built and still apply. Built to a client screenshot: a full-bleed photographic card with a headline, a
short lead and a white pill CTA on the left, and a translucent panel under them carrying three
product chips, a price and a line of supporting copy.

- **Three things in the reference could not ship, and two are the same objection.**
  - It prices its product **"$39.00" against a struck-through "$63"**. There is no discount
    pricing anywhere in `projects` and no was-price to strike through, so that figure would be
    **fabricated commercial data** — the exact objection that cut the same device out of
    `ProductOffer`. The price here is the lot's own, formatted from the catalogue, with
    nothing struck through and a `From` qualifier.
  - Its panel line reads **"Buy 2, Save More — Limited Time Bundle Offer!"**. There is no
    bundle system, no multi-pack SKU and no time-limited pricing in this project; inventing
    one on a live storefront is a real-money error. The line is a fact about how orders ship
    instead, and `promoCopy` already says both halves of it.
  - Its headline is *"Boost your health with nature's best!"* over a wellness-journey lead.
- **The three chips are composited, not generated.** Each is the real catalogue render laid
  over a flat colour with ffmpeg (`color=...` + `overlay`, 600x400, the pack at 92% width), so
  the printed artwork is untouched. Asked for via Magnific; **generating "the product on a
  different background" re-draws the packaging**, which is the failure this project has hit
  repeatedly — see the hero notes and the two garbled client drops of the same day. If a
  *photographic* ground is ever wanted instead of a flat colour, that is the point to reach
  for a model.
  - They are **landscape, not the reference's squares**: its product is a tall bottle, ours is
    a 2.17:1 carton, and in a square chip the pack sat in a band of dead colour top and bottom.
  - Grounds are teal / burgundy / indigo — one per lot, distinct enough to read at ~78px.
- **The ground is `assets/offer/banner.webp`** — a straight webp conversion of the client drop
  `latest-images/offer-banner-img.png` (1670x941, 107 KB). **Its pack copy is clean**, unlike
  the confidence-band and about-product drops of the same day. It still pictures a TESAMORELIN
  carton the catalogue does not stock, so nothing in the band describes the pack and
  `bannerAlt` names no compound.
- **The scrim is directional and its ramp has to finish before the carton starts.** Measured
  on the drop at 1440: the pack spans about **35–78%** of the frame's width, so a scrim still
  carrying 0.26 at 52% visibly dimmed its left half against its right. Clear by **48%** leaves
  the product lit and still covers the type, which ends around 45%.
  - **≤991px the ramp turns vertical and goes deeper.** Stacked, the type runs the full width
    and sits *over* the figure rather than beside her, so the photograph under it is bright
    where it was dark on the left.
- Motion: one `once: true` entrance (headline lines rising behind their own masks, lead, CTA,
  panel, chips popping in) plus a scrub owning `yPercent` on the background `<img>` alone.
- ≤560px the panel goes to a column so the chips wrap above the price rather than squeezing
  it; the frame goes 3/4 and the photo crops to the figure.

**About-product band** (`AboutProduct.tsx`, `aboutProductCopy` in `site.ts`, `.aboutprod__*`
at the end of `portfolio.css`) — **added 2026-10-19**, mounted **directly under
`ProductRange`** on request. Built to a client screenshot: a small centred title over a lead
whose words fill on scroll, the product on a tall oval stage in the middle, a circular mark
and a tinted card down each side joined to the centre by hairline braces, and a row of pill
chips closing the band.

- **Almost none of the reference's copy could ship.** Its lead is *"Wellness begins with clean
  nutrition. We craft high-quality natural supplements from selected ingredients, rigorous
  testing, and science-backed formulas"* — consumer wellness, and it says the shop
  *formulates* the product, which this catalogue does not do. Its two cards are *"Brain &
  Focus — enhances mental clarity, concentration, and cognitive performance"* and *"Daily
  Energy — promotes lasting energy and focus"*; its circle labels are *Non-GMO* and *Natural
  Formula*; four of its five chips are *100% Natural Ingredients*, *No Artificial Additives*,
  *Science-Backed Formulas* and *Sustainably Sourced*. Outcome and formulation claims
  throughout.
- **So every slot is filled from real data in the component**, which is what keeps it honest
  and self-maintaining: the **four `services` promises** supply the two cards and the two
  circle labels (one each, all four used), and the **five chips are
  `purityMethod.documentation`** — the fields every published report actually carries. The
  reference happens to have five chips too. A field added to that list appears here by itself,
  and this band and the Science page cannot drift.
- **The stage image is `assets/aboutprod/stage.webp`** (client drop, 2026-10-19) — a straight
  webp conversion of `latest-images/product-info-img1.png` (941x1672, 175 KB). It replaced the
  `p1` catalogue render that sat on the oval.
  - **It is `object-fit: contain`, not `cover`** (2026-10-19, requested: fit it properly and
    zoom out). At `cover` the 0.563 drop was scaled to fill the 0.682 oval, so there was no
    zooming out to be had — and the carton, which sits low and left in the frame, was being
    cut by the oval's curve. Contained it renders at 0.32 scale (301px wide in a 365px oval),
    the whole photograph is visible and the carton clears the mask.
  - **The oval's ground is sampled off the photograph's own edges**, because with `contain`
    that ground is what fills the ~32px gap either side and a mismatch reads as a border round
    the photo. Measured on the drop: the left edge holds **#9f9ea1 from top to bottom** and the
    right runs **#aaaaaa → #b6b6b6** through the band where the oval is widest, which is the
    only place the join is visible at all — hence the shallow `100deg` grey gradient. It
    replaced the sand radial the carton render sat on. **Re-sample if the photograph changes.**
  - **⚠ COMPLIANCE, open and the same failure as the confidence band: the carton's printed
    copy is garbled.** It is the same AI-rendered pack — the headline mangled and partly
    mirrored, *ALLUVI HEALTHCARE* broken, the strapline reversed, the dose line corrupted.
    That is altered packaging copy, the one thing the Campaign entry says never to ship. It is
    also a **TESAMORELIN carton, which the catalogue does not stock**. Raised when the swap was
    made (and once before, for the confidence band); client-directed both times. Mitigations:
    no word in the band describes the pack and `aboutProductCopy.stageAlt` names no compound.
    **To close it**: composite the real catalogue render onto the garbled face — the method the
    Billboard band uses — or go back to the `p1` render, which is one import away in git.
- **The "The same every order" circle has its own photo** (2026-10-20, requested):
  `assets/aboutprod/every-order.webp` (720x900), from the client drop `latest-images/every order.png`
  — a woman holding an ALLUVI **Tirzepatide 40mg** carton, which *is* a stocked lot (`p5`). Set via
  `circleImage` in `SIDES`, **not** on `services[1].image`, which the Contact band also reads.
- **The grid is placed by column index** (side · stage · side) because the stage is the last
  child in the markup — on auto-placement it landed in column three with the two sides
  together in one and two. **Those placements are restated at ≤991px and ≤560px**, where the
  track count changes; the same warning `.whychoose__front` carries.
- **The braces are dropped at ≤991px.** The stage moves above the two sides there, so a
  bracket still pointing sideways at it reads as a stray rule.
- The two cards are tinted **sand and light rose**, not the reference's orange and green — the
  brief allows one accent plus the rose. The chips alternate the same two tints rather than
  the reference's five.
- The lead uses **`.aboutband__word`'s scrubbed fill at its settings**, so this band and the
  about band read as one language. `opacity`, not `color`, and the resting CSS state is the
  finished one — reduced motion renders it at full strength.
- Motion: one `once: true` entrance (title, the stage opening, each side arriving from its own
  edge, the braces drawing in on `scaleX` from the outer edge, chips) plus two scrubs — the
  word fill, and `y` on the pack. The entrance owns `scale`/`opacity` on the stage and the
  scrub owns `y` on the `<img>` inside it, so nothing shares a property on one element.
- Verified at 1440 / 991 / 375: columns in the right order, stage above the sides when
  stacked, braces hidden, 0 horizontal overflow at every width.

**⚠ Unmounted on request 2026-10-20** (component, copy, CSS and `assets/docband/` kept).
**Documentation band** (`DocBand.tsx`, `docBandCopy` in `data/site.ts`, `.docband__*` at the
end of `portfolio.css`, `assets/docband/`) — **added 2026-10-20**, mounted between `DriftBand`
and `LineStory`. Built to a client screenshot of a soft-drinks page: the product held large on
one side, a dotted chip over a two-line heading with a script accent across its second line, a
paragraph, a pill CTA with a disc arrow, and a row of three labelled photo tiles closing it.

- **None of the reference's copy could ship.** It reads `PICKED BY NATURE` over *"FRESH STARTS
  WITH FRESH INGREDIENTS / Made With Real Fruit"*, then a paragraph about botanicals and *"a
  refreshingly authentic taste from the very first sip"*, closing on `FIND YOUR FLAVOR`. This
  catalogue supplies reference material and makes no sensory, formulation or outcome claim at
  all. The composition is kept; every line is something the site publishes — the paragraph is
  `purityMethod`'s three steps and its lab, in prose.
- **The three tiles are `services`, read in the component** (first three of four), with their
  own images, titles and links, so the band and the Standards section cannot drift.
- **The accent line runs on `--font-serif` (Playfair italic)**, where the reference uses a
  script. That is the second exception to the home-page `--font-heavy` heading rule, after the
  FAQ — a seventh family was not imported for one line.
- **The pack is a generated hand holding a blank box with the catalogue's own Retatrutide
  render composited onto it** — the Billboard/Campaign method, and the third time the project
  has used it. Worth knowing:
  - **The blank box was generated, not the pack.** Image models re-draw printed packaging and
    garble it; every pixel of the artwork here is the real render.
  - **Two Magnific batches of four.** The first asked only for a "wide blank box" and produced
    faces at 1.3–1.8:1; a second asking for "a flat carton roughly 22 cm across and 10 cm
    tall" landed one at **2.6:1**, against the carton's 2.164. **This contradicts the Campaign
    entry's "don't re-prompt for proportions"** — re-prompting worked here. Pick on the face's
    ratio either way.
  - **The face is a general quad, so the paste is a homography**, not the straight overlay the
    earlier bands used: solve unit-square → quad, invert, and sample the render per pixel,
    multiplying by the plate's own luminance so the artwork picks up the box's light instead
    of sitting on it as a flat decal. Corners used: TL (94,446) TR (822,354) BR (831,671)
    BL (130,724) in the 928x1152 plate, bled 0.8% outward from the quad's centre.
  - **Corners came from intersecting line fits of the four silhouette edges.** Extreme-point
    detection (max `x−y` etc.) undershot the right end by ~30px and left a white band of bare
    box showing — fit the edges, don't take the extremes.
  - Background removed with Magnific's remover, then trimmed to its alpha bounds
    (`crop=836:718:92:352`) → `docband/pack.webp`. **`docband/plate.webp` is the composited
    frame before the cut-out** and is kept, unused: the generated plate itself lives only on
    Magnific and its URL expires, so that file is the only way back to this image.
  - **`latest-images/hand-img.jpeg` is the client's own hand shot and is NOT used** — it is a
    cut-out whose transparency checkerboard is baked into the pixels, which is why this band
    was generated instead. Left on disk.
- **The cut-out's right edge is where the forearm leaves the plate**, so `.docband__media` must
  run to the viewport edge — a flat cut on the page's own edge is invisible, anywhere inside it
  is not. That is why the band is **mirrored** from the reference (copy left, product right),
  and why the section carries its padding on the left only.
- **No open compliance item**, which is rare for this project: the carton is **Retatrutide
  20mg, a stocked lot**, so `packAlt` names it, and the pack copy is the real artwork rather
  than a model's attempt at it. `note` carries the research-use-only line in the band.
- `.docband__line > span` is `nowrap` — one entry in `lines` is one rendered line, the hero's
  contract — and is released at ≤767px. ≤991px it stacks (copy, media, tiles) with the media
  still flush right; ≤560px the accent leaves its absolute seat for its own line and the tiles
  go 2-up with the third full width.
- Motion: one `once: true` entrance (media wiping up from its base, then chip, masked heading
  lines, accent, body, CTA, tiles, note) plus a scrub owning `yPercent` on the `<img>` inside
  the frame — the entrance owns the frame's `clipPath`/`scale`, so nothing shares a property
  on one element. Reduced motion gets no `mm.add` branch and renders from CSS.

**⚠ MERCHANDISING COPY DE-LABBED (2026-10-20, requested: *"still all content research
and study type, change into content like ecommerce"*).** The shopping surfaces now read as
a shop; the compliance layer is untouched. What changed, and the line that was held:

| was | now |
|---|---|
| `researchAreas[].name` "Metabolic research" … | "Metabolic", "Cellular", "Peptides", "Recovery", "Blends" |
| `shopTitleLines` "Explore metabolic / pathways", "Study cellular / energy", "Compare peptide / purity", "Research tissue / repair", "Test multi-compound / blends" | "GLP-1 & / metabolic", "NAD+ & / cellular", "All / peptides", "Recovery / peptides", "Multi-compound / blends" |
| `researchAreas[].description` — "for metabolic and energy-pathway studies", "regeneration-focused laboratory studies" | what the lot **is and contains** |
| `projects[].sector` "Compound Analysis" ×5 + "Support" | the category it is filed under |
| `projects[].summary` — "research device", "for … studies", "pathway research" | form, content and how it ships |
| `specs` Form "Pre-filled research pen(s)" | "Pre-filled pen(s)" |
| shop `h1` "The full catalogue." / its lead | "Shop all products." / a buying lead |
| `rangeCopy.lead` "Pre-filled research devices" | "Pre-filled devices" |

- **Every figure in the new summaries was checked against that lot's own `specs`**, not
  read off the carton artwork — 20 mg total, 2 × 35 mg pens, 20 mg BPC-157 + 20 mg TB-500,
  2 × 500 mg pens. Nothing was rounded or invented.
- **The compliance layer is deliberately NOT de-labbed** and must stay: `safetyProtocol`
  on every lot ("Produced for laboratory research only. Not for human or veterinary
  consumption."), the PDP `(R&D Only)` title suffix, `rangeCopy.note`, the shop page
  disclaimer, the About compliance block and the whole Science page. The brief asked for
  ecommerce *content*, and its own rules forbid inventing benefits — so the lab **framing**
  went and the research-use-only **position** did not. Pharmacology stayed too (GLP-1/GIP
  agonist, GHK-Cu, NAD+): it is factual product identity and it is what distinguishes one
  lot from another on a card.
- `alt` text still says "research carton" in several bands. Left alone deliberately — it
  is accurate, it is not merchandising copy, and several of those alts are load-bearing
  for the compliance notes that explain why they name no compound.
- Route ids are unchanged (`#/shop?research=<id>`), so no link broke.
- Verified live: chips read All products · Metabolic · Cellular · Peptides · Recovery ·
  Blends; PDP breadcrumb "Catalogue · Metabolic" with `safetyProtocol` still printed; card
  shelf lines "Pre-filled pen · 20 mg total".

**Announcement bar** (`AnnouncementBar.tsx`, `announcementCopy` in `data/site.ts`,
`.announce__*` in `portfolio.css`) — **added 2026-10-20**, fixed above the header.

- **It carries no offer, and that is deliberate.** There is no promotions system, no
  discount pricing, no shipping-threshold rule and no guarantee anywhere in this project
  to read a real one from — inventing one on a live storefront is a real-money error, the
  same objection that cut the struck-through price out of `ProductOffer` and `OfferBanner`.
  It states a fact the site already publishes instead. **Replace the copy the day a real
  offer is configured, not before.**
- **The offset is a token, not a magic number.** `--announce-h` (2.5rem, `:root`) is read
  by `body`'s `padding-top` **and** by `.nav__shell`'s `top`, so the bar, the header and
  the page can never disagree. Padding on `body` moves the normal flow only — fixed
  elements resolve against the viewport — which is why the bar sits in the gap.
- **Dismissal is resolved at import, before React's first render.** The module zeroes
  `--announce-h` when `liora.announce.v1` is set. Doing it in an effect instead gives a
  returning visitor one frame with a 40px gap and a header that then jumps up into it —
  that was built and measured. The key keeps the `liora.*` prefix, same as the cart.
- **Two message lengths, picked by CSS.** The full sentence ellipsises below ~430px in
  uppercase mono and the word it loses is "third-party" — the only part carrying weight —
  so `messageShort` takes over at ≤560px along with the link being hidden.
- **≤560px the close button leaves the overlay and joins the flow.** Absolutely placed it
  sits over a centred full-width line; padding the text only widened its box. As two flex
  items they share the row and cannot collide. `.announce__text` needs `min-width: 0`
  there or the flex item refuses to shrink and overflows instead of ellipsising.
- Verified at 320 / 375 / 430 / 561 / 768 / 1440 / 1920: no clipping, no collision, 0
  horizontal overflow; dismiss → `navTop` and `body` padding both 0 with no leftover gap,
  and it stays dismissed across a reload.

**Shop by category** (`ShopCategories.tsx`, `categoryCopy` in `data/site.ts`, `.cats__*`
at the end of `portfolio.css`) — **added 2026-10-20**, between `TrustBar` and `AboutBand`.

- **The five tiles are the real `researchAreas`, read in the component** — name,
  description, `shopImage` and `shopTitleLines` were all already in `data/research.ts`
  and had been **unused on the home view since `Catalogue` was unmounted**. Each links to
  `#/shop?research=<id>`, the filter the shop page already supports, so no category is
  invented and no link is dead. A sixth area in the data adds a sixth tile by itself.
- The count under each label is `area.productIds.length` — a real figure, not typed copy.
- **Imagery generated 2026-10-20 (Magnific, `src/assets/shop-categories/`, 200 KB total).**
  The old `categories/*` lifestyle set was shot for goal-style labels ("Explore metabolic
  pathways") and a water bottle does not illustrate "Multi-compound blends"; those files
  are **untouched and still used by the contact band's photo circles**.
  - **Four passes in one day, all on request.** Abstract macro (ink blooms, quartz,
    filaments) → full-figure lifestyle portraits → tight studio body crops → **warm
    golden-hour window scenes**, which is what is live: a figure seen **from behind** at a
    window, backlit, with the view beyond. The language is the client's own drop,
    `latest-images/recovery.jpeg` — `recovery` uses it directly and `cellular`, `peptide`
    and `blends` were generated to match. Each pass overwrote the files in place, so the
    imports never changed; **the three earlier sets are recoverable only by regenerating.**
    People are allowed here — this is the one place the project's no-people rule has
    always been waived.
  - **`metabolic` is deliberately outside that language** and is now the one cool studio
    crop in a row of four warm window scenes. It was reverted to the original
    `categories/metabolic.webp` on request; flagged as the odd frame out, client-directed.
    It is also the one landscape source (1024x688), so the 4/5 tile crops it hardest —
    the dumbbell falls outside the frame. The `recovery` drop is 1200x600 and crops to its
    centre cleanly (checked: the figure stays fully in frame).
  - **⚠ THIS IS CONSUMER LIFESTYLE IMAGERY ON A LABORATORY-USE-ONLY CATALOGUE AND IT IS AN
    OPEN, CLIENT-DIRECTED ITEM.** It sits under GLP-1 (a weight-loss drug class) and
    Recovery, where a person pictured beside the label can read as the outcome the
    compound is associated with — the one claim every product page disclaims. **Raised at
    every pass**; the direction was reaffirmed each time.
    - The **from-behind framing is the mitigation that survived all four passes** and is
      worth keeping: nobody is posed to display a body or to endorse anything, which keeps
      the set reading as "a customer" rather than "a result". `metabolic` is the exception
      — it is a body, not a person.
  - **What is held regardless of the direction, and must stay in any re-prompt:** no
    packaging (image models garble printed artwork), no capsule, pill, syringe, vial, lab
    coat or clinical setting; for `recovery` **no bandage, brace, strapping, bruising,
    injury or massage** — nothing that reads as being treated; no weighing scale,
    measuring tape or before-and-after framing; no food or drink (an earlier `cellular`
    take came back holding a cup and was re-picked — a drink is ingestion imagery); and
    **faces stay out of frame.**
  - Nothing holds, takes or sits near the product: no packaging (models garble printed
    artwork), no capsule, no syringe, no lab coat, no clinical setting. **The `cellular`
    shot came back holding a cup on the first pass and was re-picked** — a drink is
    ingestion imagery. Keep `food, drink, cup, glass` in the negation list.
  - Tiles take `alt=""`: the label beside them is the accessible text, and an alt here
    would be the only place naming what the person is "for".
  - `.cats__body`'s scrim is deep (0.88 at the base) and `.cats__name` carries a
    `text-shadow` — several frames are pale exactly where the label sits.
- The whole tile is **one anchor**, so the image, label and count are the same target.
- `grid-template-columns` uses `minmax(0, 1fr)`, never a bare `1fr`: a bare track is
  floored at its widest item's min-content and the two-line labels blow past it. Same
  trap as `.whychoose__front`. 5-up → 3 at ≤1199 → 2 at ≤767 → 1 at ≤420, where the crop
  also goes 16/10 because two portrait tiles that narrow leave the label unreadable.

**Final CTA** (`FinalCta.tsx`, `finalCtaCopy` in `data/site.ts`, `.finalcta__*` at the end
of `portfolio.css`) — **added 2026-10-20**, between `FAQ` and `Contact`.

- **Burgundy, not near-black.** The FAQ above is cream and `.contact` below **opens dark**
  before its wipe, so a black band here would merge straight into it; the brand accent is
  the one value that separates both neighbours.
- Knockout type uses `--color-on-accent`, never `--color-bg` — the trap the theme
  inversion exposed.
- Its heading lines are authored, so they carry `.anim__line` masks themselves and
  `splitLines` stands aside. Claims nothing: a headline, a line `promoCopy` already makes,
  and two links to routes that exist.

**Statement band** (`LineStory.tsx`, `lineStoryCopy` in `site.ts`, `.linestory__*` at the end
of `portfolio.css`) — **added 2026-10-19**, mounted between `DriftBand` and `ProductReel`.
Built to **section 3 of `nymphaicosmetics.com`**: a saturated colour band carrying one large
centred statement with an inline image that opens mid-sentence, a two-paragraph block whose
words fill from faded to solid on scroll, and an enormous ghost word closing the band.

- **The reference's statement could not ship.** It reads *"Dafne, il primo capitolo; pelle che
  muta con un gesto quotidiano e rifiorisce"* — skin that changes and reblooms with a daily
  gesture, a personal outcome claim and the register every product page here disclaims. The
  cadence is kept (one semicolon-joined sentence, centred, set over several lines) on what the
  site can evidence; `promoCopy` already says all of it.
- **The ground is `--brand-primary`, not the reference's slate blue.** The brief allows one
  accent plus the rose, and a second saturated colour would read as a different brand. Type on
  it is `--color-on-accent`, never `--color-bg` — the trap the theme inversion exposed.
- **The inline image opens in place as you scroll** (2026-10-19, requested) — the band's
  signature move. Measured off the reference, whose own pill scrubs
  `0 → 334x188 → 549x309 → 600x338`; ours runs `104x46 → 311x168 → 521x291 → 608x342`,
  radius `999px → 18px`, with the photograph `scale`ing `1.5 → 1` inside it so the growth
  reads as a zoom rather than a crop being uncovered.
  - **It grows *in the line*, and the sentence re-flows around it.** `.linestory__pill` is the
    image itself, `inline-flex` in the middle of line two, so as it opens the two halves of
    that line are pushed apart and the lines above and below move down with the line box.
    That is the reference's actual behaviour.
  - **An earlier pass flew the image out of the socket into a full-width frame below the
    statement, and it was dropped.** The words have to *move*, not be covered: that version
    crossed the heading on its way down and needed the statement faded to 0.22 to stop the two
    colliding. `.linestory__frame` / `.linestory__media` are gone with it, as is the fade.
  - **Line two's halves are deliberately tiny** (`that` / `arrives`). The image opens to ~608px
    in a ~1000px measure, so only ~8 characters fit either side of it on the same line — and
    both halves staying on that line is the whole look. With longer halves the first wrapped to
    the line above and the image read as a block dropped into a paragraph rather than a word in
    a sentence.
  - **The statement is set as explicit lines**, not one wrapped string, so the image lands in
    the middle one. One entry in `lineStoryCopy` is one rendered line, the contract the hero
    and the FAQ heading already use; `text-wrap: balance` had to go with it, since balancing
    re-breaks the lines and moves the image.
  - `vertical-align: middle` on the pill, **not a baseline nudge** — once the box is ~340px tall
    a baseline-aligned inline element hangs its whole height above the line.
  - **The CSS resting state is the finished one** (open, square corners), so reduced motion
    renders the image at full size with no tween to undo. Verified: no inline style is written
    at all.
  - **⚠ There must be no narrow-screen `width` override on `.linestory__pill`.** It carried one
    from when it was a small inline oval (`clamp(2.5rem, 12vw, 4rem)`); that rule survived the
    rebuild, beat the open width, and rendered the image at **45x25px** on a phone with
    `aspect-ratio` sizing the box off its own height. `min(100%, 38rem)` already resolves to the
    band's width at every size.
  - The image is `assets/linestory/expand.webp` — a straight webp conversion of the client drop
    `latest-images/bg-latest.png` (1672x941, almost exactly the 16/9 it opens to, so nothing is
    cropped). **COMPLIANCE: it pictures a TESAMORELIN carton the catalogue does not stock**, and
    at the open size its benefit strapline is legible. Its printed copy is at least clean,
    unlike the confidence band's drop. Nothing in the band refers to the pack and the alt names
    no compound.
- **No "sealed" anywhere in this band** (requested) — not in the statement, the paragraphs, the
  ghost word or the alt. The other bands still use it; this one says "documented" instead,
  which the published reports evidence just as directly.
- **The enormous ghost word that closed the band is gone** (requested). With the opening image
  as the display element a second oversized mark under it competed; `lineStoryCopy.ghost`,
  `.linestory__ghost*` and its drift scrub were all removed.
- `.linestory__type` is capped at **32ch** (up from 26ch when the lines became explicit).
  The reference sets 56px type across four centred lines in a 1297px block.
- The paragraphs use **`.aboutband__word`'s scrubbed fill at its settings**, so this band and
  the about band read as one language. `opacity`, not `color`, and the resting CSS state is
  the finished one — reduced motion renders them at full strength.

**Product reel** (**unmounted on request 2026-10-19, the same day it was added**)
(`ProductReel.tsx`, `reelCopy` in `site.ts`, `.reel__*` at the end of
`portfolio.css`) — it sat under `LineStory`. Component, copy and CSS are untouched and still
in the tree, so remounting it is one line in `App.tsx` plus its import; it carries **no asset
of its own** (the carton faces are `ProductSpotlight`'s crops, the arch stills are
`standards/*`), so it leaves nothing behind. The notes below describe it as built and still
apply if it comes back. Built to **section 4 of
`nymphaicosmetics.com`**: a pinned band that steps through three lots one at a time — eyebrow,
name, price and an EXPLORE link on the left, the carton standing over an arch-masked
photograph in the middle, a counter top right and a thumbnail rail bottom right, with the
ground cross-fading per lot.

- **The reference renders its bottles as live Spline 3D scenes.** There is no 3D model of any
  carton in this project, and generating one re-draws the printed packaging, which the image
  models reliably garble (see the hero notes). The carton is the **CSS-built box `LotFan`
  introduced** instead — the render is the front face, three hinged panels are the top and
  both sides — so the product still turns in space without inventing artwork.
  - Front faces are `assets/spotlight/cartons/p{1,2,4}.webp`, the crops `ProductSpotlight`
    already measured at alpha ≥ 250. A whole catalogue render carries its transparent canvas
    into the box and the built faces float detached.
  - **`rotate: 0` is stated in the scrub**, same trap as `LotFan`: GSAP decomposes the CSS
    resting pose off the computed matrix and leaves a residual ~2.7deg roll.
- **Everything shown is read from `projects`** — name, price, lede and link. `reelCopy.ids`
  are **stocked** lots (`p1`, `p2`, `p4`), which is why this band may name and price them,
  unlike the hero, science and about bands.
- **The arch has to be wider than the carton**, and that inverts on a phone if you are not
  watching: the reference's bottle is portrait and sits inside a narrow arch, ours is a 2.17:1
  landscape carton. Desktop is a 24rem arch against an 18rem pack; the ≤560px block was
  briefly a 44vw arch against an 86% pack, which put the carton outside the frame it is
  supposed to stand in.
- **Below 992px the arch and the pack swap roles.** Pinned, the arch is absolutely centred
  behind a pack that sits in the flow; stacked, that leaves `.reel__visual` with only the
  pack's height and the arch spills over the copy beneath. Unpinned, the arch is the flow
  element and the pack floats over it — same composition, opposite mechanism.
- **The arch photographs are the `standards/*` product stills, not the `categories/*`
  lifestyle set.** Those are the one place the no-people rule is waived, but it was waived for
  *category* tiles; behind a named and priced lot a fitness frame reads as that compound's
  outcome, which is the claim this catalogue cannot make. Note each still contains a carton of
  its own, so the band shows two — the 3D pack covers most of the photographed one.
- **The swap takes the middle third of each step** (`FADE = 0.34`), the same contract as
  `ProductSpotlight`: fading two slides across a whole step leaves them at 50/50 for most of
  the run, and two sets of printed artwork at half opacity read as one doubled, ghosted carton.
- **The thumbnail rail is indicators, not controls.** The band is scrubbed by the scroll while
  pinned, so a click that jumped the run would fight the gesture driving it. The frame is
  always drawn and transparent at rest — a border that appears would resize the tile and shunt
  the rail sideways on every step, same note as `.spotlight__detail`.
- **Pinned ≥992px only**, the rule `Services`, `LabProof`, `Contact` and `ProductSpotlight` all
  follow. Below that every slide is lit and the counter and rail are hidden — they only mean
  something while the band steps.
- `LOTS` is resolved **once at module scope**: everything it reads is static, and rebuilding it
  per render hands the scroll effect a new array identity every time, which
  `react-hooks/exhaustive-deps` flags. Same note as `ProductSpotlight`'s `LOTS`.
- Verified at 1440 / 991 / 375: pinned at `top: 0` throughout, counter stepping 01 → 02 → 03,
  slide opacities cross-fading (`[1,0,0]` → `[0,1,0]` → `[0,0.91,0.08]` mid-dissolve →
  `[0,0,1]`), the thumb tracking, the box turning −8° → +26°, and 0 horizontal overflow.

**Section 2 of that reference is `DriftBand`**, which already existed — the same
scatter-collage device (a centred statement with photo tiles flying out around it). That is
why this pass built two bands and not three.

**Lot band** (unmounted 2026-10-19) (`LotFan.tsx`, `lotFanCopy` in `site.ts`, `.lotfan__*` at the end of
`portfolio.css`) — added 2026-10-17 in the slot `ProductSpotlight` vacated the same day,
**rebuilt 2026-10-19 to a new client reference**: a cream panel with a rule-flanked eyebrow,
one long centred statement whose words fill from grey to ink on scroll, the pack at the centre
over an enormous pale ghost mark, and a hairline row of four figures closing the band.

**Three designs have gone into this slot.** An *arc of radiating wedges*; then a *badge ring*
— six dashed medallions around the pack with dotted arrows running in, on a saturated burgundy
ground; then this. All three are in git and all three kept the same CSS-built 3D pack. Gone
with the 10-19 rebuild: `.lotfan__badges` / `__badge` / `__disc` / `__arrow` / `__head` /
`__foot` / `__sub` / `__ghost-char`, the `ICONS` map in the component, and
`lotFanCopy.badges` / `.sub` / `.name`.

- **The reference's two unusable parts.** Its headline is *"Vitelora brings thoughtfully
  formulated nutrients into simple daily rituals so taking care of yourself feels
  effortless"* — a consumer outcome claim. And it tumbles **capsules** around the bottle:
  there are none in this catalogue and a pill strewn around a research-only device
  contradicts every product page, the same reason the showcase band's surround was dropped.
  The capsules are simply not replaced — the ghost mark carries that space.
- **The four figures carry the six facts the badges did** — four printed on the carton, two
  about how every order ships (`promoCopy` already says both). The reference's read *50K+
  happy customers* (there is no review data in this project), *100% natural ingredients*,
  *3rd party lab certified* and *30 days per bottle*.
  **Nothing here may become "batch documented" or a purity figure**: TESAMORELIN has no
  published report, so that is precisely the kind of fact that is true of the stocked lots and
  false of this one. It is also why the statement is about sealing, cold-packing and fill
  volume and never about documentation.
- **The statement is the one home heading that is not Black.** `@fontsource/roboto/500` was
  imported for it (`index.css`): the reference sets this as a sentence, and at 900 the same
  copy is a dense slab the word-fill cannot be read through. Face and tracking still follow
  the home-page rule — only the weight differs. It carries `text-wrap: balance` and a `30ch`
  measure: at 26ch it broke `cold-packed` on its own hyphen, and unbalanced it ended on a
  one-word line.
- **The words fill one at a time on a scrub**, `.aboutband__word`'s device at its settings
  (0.26 → 1, `stagger: 1`, triggered on `.lotfan__title`). The resting CSS state is the
  finished one, so reduced motion renders the sentence at full strength. The entrance
  deliberately does not touch the headline — the fill is its arrival.
- **The pack is a box built in CSS, not a photograph.** Every carton render in the client's
  set is flat front-on — there is no dimensional one — so `.lotfan__box` makes the turn: the
  render is the front face and **four hinged `.lotfan__side` panels** are the top, bottom and
  two sides, swung back 90deg on the printed edges.
  - **A second pass on 2026-10-19 ("product like 3D animation with better look") rebuilt
    this.** Before it only the top and the right were built. Four things came with the four
    faces, and they are what make the box read as an object rather than a slanted card:
    - **`.lotfan__sheen`** — a narrow specular band that sweeps the printed face **on the
      same tween as the rotation** (a `--lotfan-sheen` background position), so the highlight
      can never drift out of step with the angle. **Peak alpha stays at 0.5**: the pack's
      printed copy has to stay readable through it, which is the one thing a product
      highlight cannot break on this catalogue. It parks off the face at 122%, so reduced
      motion renders no highlight at all rather than a frozen one.
    - **`.lotfan__shadow`** — a blurred grounding ellipse under the box, which is what makes
      the pack read as suspended. It breathes against the bob. Centred with `left`/`right`
      and **no CSS transform**: GSAP writes `transform` on it for the scale, so a centring
      translate would be baked in — the same trap `.lotfan__pack` carries a note about.
    - **`.lotfan__float`** — the idle bob (3.1s sine, `y -18`, `rotate 1.2`), paused by a
      ScrollTrigger while the band is off screen.
    - `perspective` down to **1100px** with `perspective-origin: 50% 38%`. At the old 1500px
      this pack read as an axonometric drawing rather than a photographed object.
  - **Three transforms, three elements** — `.lotfan__pack` (entrance `y`/`scale`/`opacity`),
    `.lotfan__float` (the bob), `.lotfan__box` (the turn). That is the disjoint-property rule
    applied through the DOM rather than through property names, and it is the whole reason
    the bob needed an element of its own.
  - **`.lotfan__float` must never take a `filter`.** A filtered element has its `preserve-3d`
    ignored, which flattens the subtree and the built sides vanish. The `drop-shadow` belongs
    on `.lotfan__pack`, which carries `perspective`, not `preserve-3d`.
  - **The front is a pre-cropped asset, `assets/lotfan/face.webp`** — the catalogue render
    cut to exactly its printed rectangle (846x391 at 27,375, measured at alpha >= 250) and
    the box is that ratio. Fitting the *uncropped* render with `cover` left a sliver of its
    transparent canvas above the artwork, and the top face then floated detached with a dark
    gap under it — that was the first attempt and it looked like a card with a white strip
    stuck on. The built faces hinge on the element's edges, so the element has to be the
    carton and nothing else.
  - **`--lotfan-depth` is a share of the carton's *width*, not its height.** At this face size
    the render is about 53px/cm, so a 2.4cm-deep carton is 15%. The first pass used 11% of the
    *height*, which came out under a centimetre.
  - **The box turns as the band scrolls** (the "3D animation" asked for): a scrub takes it
    `rotateY -6deg → +30deg`, `rotateX 13deg → 3deg`. **`perspective` therefore lives on
    `.lotfan__pack`, not in the box's own transform** — GSAP writes `transform` wholesale, so
    a `perspective()` inside it is wiped on the first tick. The CSS keeps a static
    `rotateX(9deg) rotateY(19deg)` so reduced motion still renders a dimensional box.
  - **The range is deliberately lopsided, and this is the part worth keeping.** A symmetric
    sweep puts the flat-on angle at progress 0.5 — the band centred in the viewport, i.e.
    exactly when it is being looked at, and a carton square to the camera has no dimension in
    it at all. Starting at -6deg moves the crossing down to roughly progress 0.17, while the
    band is still low on the screen. Measured with the band centred at 1440: `rotateY 12deg`.
  - **A positive `rotateY` shows the LEFT face**, not the right — it pushes the box's right
    edge away and brings the left one forward. The pre-10-19 note here claimed the opposite,
    which is why that version's one built side was the one it never showed. The left panel is
    therefore the one shaded as catching the light (the render is lit from the upper left).
  - **`rotate: 0` has to be stated in the scrub.** GSAP reads the element's start off the
    computed *matrix* and decomposes it into its own rotation order; the CSS resting pose
    (`rotateX` composed with `rotateY`) does not decompose cleanly and leaves a residual
    **~3deg roll**, which visibly tilted the carton on the page. The faces also carry
    `backface-visibility: hidden` as a guard.
- **The pack is capped at `24rem` (`min(44%, 24rem)`), and the ceiling is the ghost mark
  behind it** — larger, and the carton covers the middle of the word so only its outer
  strokes read. It came down from 28rem when the turn widened: a box swung 30deg sweeps wider
  than a flat one. (Before 10-19 the ceiling was the badge columns at ~66%.)
- **`.lotfan__stage` sets its own `min-height`** (`clamp(14rem, 24vw, 21rem)`, dropped at
  ≤767px). The ghost mark's line box is taller than a landscape carton, so a stage sized by
  the pack cropped the word top and bottom.
- **`.lotfan__pack` and `.lotfan__ghost-row` must not be centred with a translate.** GSAP
  animates both and writes `transform` wholesale, so a centring `translate(-50%, -50%)` is
  baked into the inline value and survives into rules that want no transform — it dragged the
  pack half its width off the left edge when the stage was an absolute ring. The flex stage
  centres the pack; `inset: 0` + `justify-content: center` centres the ghost row.
- **The ghost behind the pack is the BRAND, not the product name** (2026-10-19, requested),
  read from `site.brandMark` / `brandSub` so it cannot drift from the header. It is the
  **why-us band's ghost device reused**: the mark with its sub-word beside it and a slow
  horizontal drift on scroll (`x -30 → 30`, that band's settings). It is `aria-hidden` —
  decorative, and the header carries the real wordmark.
  - **The sub-word is nested inside the mark, not a sibling** (2026-10-19). As a flex pair
    the *lockup* centred, which put the carton over the gap between the two words and hid the
    back half of the mark — "LY … HEALTH" with the FE behind the box. Hanging the sub off the
    mark's right edge (`position: absolute; left: 100%`) leaves the **mark** centred, so the
    pack covers its middle and the outer letters read either side, which is the reference's
    composition. The entrance therefore tweens `.lotfan__ghost` **only** — tweening both
    compounds the same opacity twice.
  - **The tint is `#e6ddd8`, a step warmer and darker than the why-us band's `#ececea`.**
    That band sits on white, where its value reads; on this sand ground (`#f7f4f2`) the same
    grey was three steps off the ground and the mark all but vanished.
  - **≤767px the mark goes to `38vw` and the sub-word is hidden.** At the desktop `27vw` the
    four letters measure *narrower* than the carton on a phone, so the whole mark hid behind
    it and the sub-word was left floating alone at the right — a stray label, not a watermark.
  - Dropping the product name from display type is also what **closes** the sharpest part of
    the compliance note below: the band now merely pictures the carton, as the hero and the
    science band do.
  - The per-character fill the old ghost ran is gone with it; the statement above carries that
    device now. The entrance owns `opacity` on the two words, the scrub owns `x` on the row —
    disjoint, the usual rule.
- `.lotfan__stats` is a 4-up grid under a hairline, **2-up at ≤767px** — four figures do not
  fit one line on a phone without the labels breaking mid-word.
- Motion: one `once: true` entrance (eyebrow, ghost, pack, stats, note), three scrubs — the
  word fill on `.lotfan__word`, `x` on the ghost row, and `rotateX`/`rotateY`/`--lotfan-sheen`
  on the box — and one infinite idle timeline on `.lotfan__float` + `.lotfan__shadow`, paused
  off screen. Every one of those owns a different property on a different element, the usual
  rule. Reduced motion gets no `mm.add` branch at all and renders the finished state from
  CSS: static turn, full-strength statement, sheen parked off the face. **Verified both ways.**
- **COMPLIANCE, open: this band displays an ALLUVI TESAMORELIN carton, which the catalogue
  does not stock** — not in `projects`, no price, no Janoshik report. Until 2026-10-19 it also
  set that name in display type; the ghost word is the brand now, so only the photograph
  remains. The rest of the guard rails stand: no price, no add-to-cart and no link anywhere in
  it, every figure a carton fact rather than a claim, and `note` carries the research-use-only
  line in the band itself. The pack import in `LotFan.tsx` is one line — pointing it at a
  stocked lot is a one-line change if this is ever challenged.

**Why choose us** (`WhyChoose.tsx`, `whyChooseCopy` in `site.ts`, `.whychoose__*` at the end
of `portfolio.css`) — **added 2026-10-17**, mounted between `ScienceBand` and `Testimonials`.
Built to a client reference: a two-line headline top left, an enormous pale ghost **WHY** with
a smaller **CHOOSE US** beside it, a photograph overlapping the ghost word, a stack of three
packs, and a numbered list of four reasons.

- **It carries `id="why-us"`.** The footer's `Why Us` link has been a dead anchor since the
  old `WhyUs` band was unmounted on 2026-10-16; it resolves again. (That band is still
  unmounted and still in the tree — this is a different component, not a remount.)
- **The four rows are `whyUs`, read in the component, not restated** — same numbers and
  titles — so the list and any future `WhyUs` remount cannot drift. The reference numbers its
  rows 001–004 beside generic benefits; ours prints the real `number` and `title`.
- **The reference's headline is *"ENERGY THAT KEEPS / YOU MOVING"***, a consumer benefit claim.
  Ours is one of the shop promises in `services`, which the published reports evidence. The
  ghost words are kept verbatim — they claim nothing.
- **Proportions are measured off the reference, then corrected once by eye**: the first pass
  had a 4/5 photograph filling a third of the band and the cluster sitting *below* the ghost
  word instead of over it. The photograph is near square (`1 / 1.05`), the ghost runs to
  `29vw`, and `.whychoose__stage`'s `padding-top` is what sets the overlap.
- **The band is aligned to the header, not to `.container`** (requested). `.nav__row` drops
  the 88rem cap and starts at `--hero-inset + --gutter`, so a container-width band sat visibly
  inside the bar above ~1440px. The section therefore carries **no `container` class** and
  repeats that calculation; both read the same `:root` tokens, so the two cannot drift — the
  same contract the hero has with the bar. **Verified delta 0 at 375 / 767 / 991 / 1280 / 1440
  / 1600 / 1920.** At 320 the band sits 18px inside the bar: the header has its own tighter
  narrow-screen padding there, and matching it would put the headline against the edge.
  - The right side takes the *left* value, not the header's — the bar keeps a tighter
    `padding-right` so the cart hugs the corner, and that asymmetry in a content band reads as
    a mistake.
- `.whychoose__front` is a **four-track grid whose second track is deliberately empty** —
  photo · gap · stack · list. That is what holds the reference's space between the photograph
  and the pack stack without a spacer element.
- **The stack-and-list cluster was sized up ~15% on request** (2026-10-19): pack width
  `clamp(4.5rem, 10vw, 9rem)` → `clamp(5rem, 11.5vw, 10.5rem)` (144 → **166px** at 1440), the
  list track 22% → **26%** (269 → **318px**), the label `0.75rem` → `0.875rem` cap (11.5 →
  **13.2px**), with the row/list gaps and `.whychoose__num` nudged to match. The extra list
  width comes **out of the empty spacer track**, so the photograph does not move. Re-checked
  the 320px label trap below: rows still wrap rather than clip (`scrollWidth == clientWidth`
  on all four) and there is no horizontal overflow at 1440 / 991 / 320.
- **Two grid traps this cost, both worth knowing:**
  - **Items placed by column index must be re-placed at every breakpoint that changes the
    track count.** The desktop rule puts the stack in column 3; at ≤560px the grid has one
    column, so grid invented an implicit third track off the right-hand edge and the stack
    rendered outside the page.
  - **Every flexible track needs `minmax(0, …)`.** A bare `1fr` is floored at its widest
    item's min-content: the list's longest label sized the whole row to **301px inside a 265px
    element** at 320, and the labels clipped mid-word. Same family as the `grid-auto-columns`
    note on the catalogue and range rails.
- The pack tiles crop the renders' tall transparent canvas (`aspect-ratio: 900 / 430`,
  `object-fit: cover`) — fitting the whole canvas would stack three cartons with two
  canvas-heights of air between them. Same canvas problem `.range__media` documents.
- Motion: one `once: true` entrance (headline lines, ghost fade, photo wipe, packs, rows) plus
  a scrub that owns **`x` on `.whychoose__ghost-row` alone** — disjoint from the entrance's
  `yPercent`/`opacity`/`clipPath`, the usual rule. Reduced motion gets no `mm.add` branch and
  renders the finished state from CSS.
- ≤991px it goes two columns with the list full width beneath and the photograph capped at
  20rem; ≤560px everything stacks and the pack stack turns into a row of three.

**Campaign band** (`Campaign.tsx`, `campaignCopy` in `site.ts`, `.campaign__*` at the end of
`portfolio.css`, `assets/campaign/`) — added 2026-10-17 and **unmounted on request the same
day**. Component, copy, CSS and all four plates are untouched, so remounting it is one line in
`App.tsx` plus its import; it last sat under `Testimonials`, having started between
`ProductSpotlight` and `ProductFeature`. Built to a client reference (a lifestyle frame with *"FULL POWER"* set huge
over its left half and a white dimensioned spec card in the opposite corner). No CTA — the
reference has none.

**Built three times in one day on the same reference; what is live is the third.** The
differences were entirely in what photograph it carries:

1. a generated rooftop plate with the real carton composited into a blank held box;
2. a split — headline on a burgundy gradient left, a cut-out figure right;
3. **the live one** — the client's drop `latest-images/11.png` as a full-bleed background with
   the type over it, which is the reference's own structure.

- **The plate is the client's drop widened by outpainting** (requested: "make the lady zoom
  out"). The frame ratio only ever crops vertically, so no CSS change can make the subject
  smaller — the scene itself had to be extended. Higgsfield `outpaint_image` took
  `11.png` (1672x940) to 3168x1344, adding sky and skyline on the left and a concrete wall on
  the right; she and the pack now render about a quarter smaller.
  - **⚠ The outpaint re-rendered the carton's printed copy and corrupted it** — *"Store in a
    refirgarator (2°C to **6**°C)"*, *"For cuboutaneous iniriction only"*, *"Read package
    toaflet before use"*. The original says **2°C to 8°C**. That is altered packaging copy
    with a wrong storage spec, legible at the size this band renders. **Never ship an
    outpaint of a pack shot without checking its small print at 1:1.**
  - **The fix is a composite:** the original frame is pasted back over the generated
    surroundings, so every pixel of the pack is the client's own. Registration was found by
    normalised cross-correlation on three horizontal strips across a range of scales —
    **scale 1.3844, offset (256, 32)**, the best of the candidates at r=0.69. The overlay
    carries a 110px feathered alpha edge (`geq` on the alpha channel) so the join into the
    generated wall and sky is invisible; checked at 1:1 on the right-hand seam.
  - `scene-outpaint.png` is the raw outpaint, kept **only** as the record of that corruption.
    **Do not ship it.**
- **The photograph decides where the type can go, and this drop is the mirror of the
  reference.** Its reference clears the whole left half; this plate puts the carton there.
  Measured with a sky/brightness scan of the widened plate (20x10 grid): the clear band is
  **y 0–20%**, the carton sits at **x 5–60%**, and her head reaches y 10% at x 50–65%. So the
  headline is left-aligned and sits **high**, not centred. Two things rule out the reference's
  placement: white type over a white carton vanishes, and scrimming the carton dark enough to
  fix that hides the product the band exists to show.
- **The copy block is sized to the sky, not to taste**, and the zoom-out shrank the sky with
  everything else: the clear strip is **~121px at 1440** (it was 162 before the widening). The
  headline is `3.1vw` and the disclaimer is held to **one line** (`max-width: none` on
  `.campaign__note` is doing that, deliberately). Measured copy-bottom against the sky limit:
  118/121 at 1440, 108/107 at 1280, 87/100 at 991, 108/150 at 767. **Raise `.campaign__title`
  and the second line lands on the pack** — that is what the sizes are for, not taste.
- **`.campaign__frame` is a ratio, not a capped height** — that keeps the framing identical at
  every width. `object-position: center top`: the sky and the carton are both in the upper
  four fifths, so the crop comes off her legs and the ground.
  - **The ratio is a vertical crop, not a zoom.** It went 2.2 -> 2.0 on a "zoom out a little"
    request, which showed 89% of the frame instead of 81% but left the subject exactly as big;
    the second "make the lady zoom out" is what forced the outpaint above. It is now
    `2200 / 934` — **the widened plate's own ratio, so nothing is cropped at all.** Heights
    605 at 1440, 809 at 1920, 537 at 1280. ≤991px takes 1.95 (a small side crop) and ≤767px a
    square.
  - The frame briefly ran to `max-width: 1700px` (the plate is 1672 wide) over a
    `--brand-primary-deep` ground. **Both were removed on request** — that left a burgundy
    strip down each side above 1700px. The band is edge to edge now, the section has no
    background of its own, and the plate upscales a little past 1700, which on a photograph is
    not visible.
- ≤767px the frame is **square, not 3/4**. The carton spans 55% of the plate's width, and a 3/4
  window shows only 32% of it — it cropped the pack to "...ORELIN". A square window shows 42%,
  which seats the whole carton, and `object-position: 20% top` puts that window on it (it was
  9% before the widening moved the carton right). The
  square crop also pulls the pack up under the copy, so the mobile rule carries its own
  **stronger scrim** (0.66 → clear by 48%, against 0.52 → 38% on desktop).
- The scrim is **directional, down from the top** — the site's page-banner device. It must stay
  clear of the carton: a flat wash greys the whole photograph out.
- The spec card keeps the reference's corner. It sits over her dark jacket, which is why it
  needs no scrim of its own.
- **COMPLIANCE, open — the band pictures an ALLUVI TESAMORELIN carton**, and at this size the
  pack is the largest it appears anywhere on the site:
  - The catalogue **does not stock it** — not in `projects`, no price, no Janoshik report. So
    nothing in the band may imply one: no purity, no batch, no price, no link.
  - Its printed strapline — *TARGETED BODY FAT · IMPROVE DEFINITION · PRESERVE LEAN MASS* — and
    *For subcutaneous injection only* are **fully legible here**, not merely present. **Every
    word in the band must describe the catalogue and never the carton**, and the headline is
    the site's own positioning line precisely because it is the opposite claim: it says what
    the material is for. `.campaign__note` carries the research-use-only line **in the band**
    for the same reason — don't remove it.
  - It is a person holding the product in a lifestyle setting, the closest this site comes to
    consumer-use imagery. Client-directed, three times over.
- **The spec card's callouts are facts legible on the pack** — pre-filled pen, 20 mg total,
  10 doses of 2 mg, 2–8 °C. The reference's card is a dimensioned drawing (*13cm*, *8cm*);
  **the carton's physical size is unknown and must not be invented**, so the drawing's form is
  kept and the quantities are not.
- Motion: one `once: true` entrance (lines rising behind their masks, then the note, then the
  card) plus a scrub owning **`scale` on the photograph alone** — disjoint properties, the same
  rule as the hero and the feature band. Every tween is a `from`, and reduced motion gets no
  `mm.add` branch, so the finished state renders from CSS.
  **Verifying in Playwright needs patience** — the entrance needs several seconds of wall clock
  under the throttled harness, and an early screenshot catches the card mid-fade and reads as a
  translucent card. That is the harness, not a bug.

**Assets, all in `assets/campaign/`.** Only `scene.webp` is imported; the other three are the
earlier builds, kept on disk:

| file | what | state |
|---|---|---|
| `scene.webp` (2200x934, 208 KB) | the client drop `latest-images/11.png` outpainted wider, with the original frame composited back over it | **live** |
| `scene-outpaint.png` (3168x1344) | the raw outpaint, **pack copy corrupted** | keep as evidence, never ship |
| `figure.webp` (1000x1778, alpha) | `latest-images/bg-img-new.png` cut out of its white ground | build 2, unused |
| `rooftop.webp` (1344x752) | generated plate with the real carton composited into the held box | build 1, unused |
| `rooftop-source.png` | that plate before the carton was composited in | build 1, unused |

**Build 2's cut-out is worth knowing about**, because the same trick will be wanted again:
`latest-images/bg-img-new.png` is a white studio frame, which reads as a pasted rectangle on a
colour ground. Higgsfield's `image_background_remover` (via `media_upload` → `media_confirm` →
`remove_background`) cut it cleanly **and took the drop's "your name" corner watermark with
it** — no crop could have removed that without cutting her head. A `colorkey` would not have
worked: her trousers and the carton are near-white too.

**Build 1's compositing method is the project's record of how to put a real carton into a
generated hand**, and is kept for that reason:

- The scene came from Higgsfield `gpt_image_2_5` with the model holding a **completely blank
  white box**. Image models re-draw printed packaging and garble it — the hero notes record
  three separate attempts — so no generated pack was ever going to be usable.
- The blank box in the plate measures **x 818–1040, y 249–371** (223 x 123), **detected** with a
  canvas luminance/chroma scan, not eyeballed: bright, low-chroma, not sky-blue.
- The carton's **solid** face (alpha ≥ 250) in the 900x1130 render is **846x391 at (27, 375)**,
  ratio 2.164 — the ratio all six packshots carry.
- `[1:v]format=rgba,crop=846:391:27:375,scale=225:125[c];[0:v][c]overlay=817:248` — a 1px bleed
  each side so no sliver of the white box haloes the carton, and a ~20% vertical stretch to meet
  the box's 1.80 ratio, invisible at render size.
- **Two generation passes.** The first (box ratio 1.80) is the one used; a second asking for a
  box "twice as wide as it is tall" produced ~3.17 boxes — *further* from the carton. Don't
  re-prompt for proportions; pick the plate whose box is nearest 2.16.
- The prompt's negation list worked and should be reused: no text/letters/numbers/logos
  anywhere (especially on the box), no cans, bottles, glasses, capsules, pills, syringes,
  vials, food or drink, nothing near her mouth, no lab coat or clinical setting, no warm grade.


**Our science band** (`ScienceBand.tsx`, `sciBandCopy` in `site.ts`, `.sciband__*` at the end of
`portfolio.css`, `assets/sciband/`) — **added 2026-10-16**, mounted between `ProductFeature` and
`Testimonials`. Built to a client reference: a white card inset on the page, a rule-flanked
eyebrow over a short headline, a lead, a 2×2 grid of ticked chips and a filled pill CTA, with
the product group photograph bleeding off the card's right edge.

- **⚠ REBUILT 2026-10-19 to a second client reference — the notes below this one describe
  the previous build and are history.** Now: a **sand** band; copy left on the shared page
  line (rule-led eyebrow, headline in two tones — line 1 ink, line 2 `--brand-primary` —
  lead, four outlined **icon cards** with a title and a one-line note, a burgundy pill CTA
  with a shadow, and a `Transparency · Testing · Traceability` tagline); the photograph is a
  **card rounded on its left corners only, bleeding off the viewport's right edge**. (Its
  corner molecule line art was removed on request the same day.) The photo is `assets/sciband/background.webp`
  (from `latest-images/science-new.png`, a model holding an ALLUVI **TESAMORELIN** pen on
  a burgundy wall) at `object-position: 100% center` so her face stays in the near-square
  crop. Card notes are `sciBandCopy.chipNotes`, keyed by the field label — mass-spec's is
  *"Confirms the compound's identity"*, not the reference's "accurate composition
  analysis", which overstated it. **The reference's *ALLUVI — Research · Quality · Trust*
  lockup on the photo was deliberately not reproduced** (manufacturer name in site voice).
  The media's resting `clip-path` carries the `round` radii — it is what shapes the card
  during the entrance wipe. ≤1199 the cards go one column, ≤991 the photo stacks on top as a
  fully rounded card, ≤640 the headline lines may wrap. **Compliance: TESAMORELIN is not
  stocked** — `photoAlt` names no compound and nothing in the copy describes the pen.

- **The reference's chips read *Clean Ingredients · No Artificial Colors · Plant-Friendly*
  beside *Third-Party Tested*.** Three of those four describe a consumer supplement's
  formulation; this catalogue sells reference material and makes no formulation claims at all.
  **The chips are `purityMethod.documentation`** — what every published report actually carries
  — read in the component, so the band and the Science page cannot diverge, and a field added
  there appears here. The list holds five and the grid seats four, hence the `slice`.
- **It runs full width** (requested). The reference insets a white card on a pale page; this
  band goes edge to edge, so there is no ground showing and the rounding went with it — a
  full-bleed band with rounded corners reads as a card that failed to fit. The copy's leading
  inset tracks the viewport (`clamp(1.5rem, 7vw, 9rem)`) rather than sitting at a fixed step,
  and the title, lead and chips all carry their own `max-width` so the column does not stretch
  with the screen. Verified at 1920 / 1440 / 375.
- The band stays **white**, which is also what lets the photograph drop in untouched: it is a
  white-ground studio shot, and on a tinted band it would read as a pasted rectangle — the
  problem `.spotlight__visual` has to feather its way out of.
- **The group shot is cropped to its content.** `latest-images/science.png` is 2065×761 with the
  cartons in the lower right and a large empty white corner; dropped in whole, the group sat low
  and small with dead space above it. Detected bounds (non-white at a 242 threshold) are
  x 615–2009, y 81–725, and `assets/sciband/group.webp` is that box plus a small margin.
  `latest-images/` stays untouched as the source of truth.
- `.sciband__photo` is **wider than its column on purpose** (112%), because the reference lets
  the group run off the card edge rather than fitting inside it. The card's `overflow: hidden`
  does the cropping.
- `.sciband__media` carries a resting `clip-path: inset(0 0 0 0)` — the entrance wipes from an
  inset and GSAP cannot interpolate one towards `none`. Same note as `.feature__media`.
- The tick discs are **burgundy, not the reference's green**: the brief allows one accent plus
  the rose, and a green tick would read as a second brand.
- **COMPLIANCE: the photograph shows MOTS-C, CJC-1295 and TESAMORELIN cartons, none of which
  this catalogue stocks** — same position as the hero, the showcase and the promo banner. Every
  word in the band describes the catalogue and never the cartons, and `sciBandCopy.photoAlt`
  names no compound.

**Compound collage** (`CompoundCollage.tsx`, `collageCopy` in `site.ts`, `.collage__*` at the
end of `portfolio.css`) — added 2026-10-16, **unmounted on request 2026-10-17** ("Only verified
material & nothing left undocumented"). Component and CSS untouched, so remounting it is one
line in `App.tsx` plus its import. It was the only band publishing every lot's measured
concentration on the home view; the Science page still does. Built to the
`loopii-juice-bar.webflow.io` intro section: a two-line heading with the first line light and
the second bold, three overlapping tilted cards rising to the right, and a list bottom right.

- **Geometry is measured off the reference**, not approximated — inside its 965×960 stage it
  places a 468×663 card at −10°, a 432×608 card straight, and a 325×325 card at +8°. Those
  ratios and offsets are the percentages in the CSS.
- **The reference's list pairs each ingredient with an effect** ("Ashwagandha Relieves Stress",
  "Cordyceps Boosts Energy") — the exact form this catalogue cannot use. The row shape is kept
  and the right half carries the **measured concentration**, built from every
  `labAnalysis.compounds` entry in `projects`. **Published strings are carried through, never
  reformatted**: a range is chosen by comparing parsed numbers but printed from the original
  values, because rounding a reported concentration would put a figure on the page no report
  backs. The list grows by itself when a lot is added.
- **The tilt is a CSS `rotate`, not a `transform`.** GSAP owns `transform` on these cards for
  the settle and the scrub; an individual `rotate` composes with it instead of being wiped.
  Entrance owns `scale`/`opacity`, the scrub owns `yPercent` — the usual split.
- The reference's bent-straw prop has no equivalent object here, and the two bands above
  already carry molecular line art, so this band has **no decorative graphic**.
- ≤560px the square packshot card is dropped and the other two go side by side: three
  overlapping tilted cards are unreadable at any size that fits a phone.

**Product spotlight** (`ProductSpotlight.tsx`, `spotlightCopy` in `site.ts`, `.spotlight__*` at
the end of `portfolio.css`) — **added 2026-10-16**, now mounted **after `ProductRange`**. It
was built as the 3rd section, between `TrustBar` and `ProductRange`, in the slot the three
unmounted supplement-reference bands used to fill, and moved below the range on request the
same day. **Revised the same day to a client mockup of this very section**: a warm sand band
carrying molecular line art, a centred rule-flanked head, the client's studio shot of a carton
held in both hands, four icon chips with hairline leader lines out to the carton, a selectable
detail gallery with pagers, and a CTA row.

- **Two lines of the mockup's own copy could not ship**, and `spotlightCopy` records why. It
  headed the band *"ALLUVI HEALTHCARE / TRUSTED SCIENCE. REAL RESULTS."* — ALLUVI is the
  manufacturer whose packaging this catalogue carries by licensing arrangement, so as a
  **section heading** (site voice, not packaging) it would read as this shop being ALLUVI; and
  *"real results"* is an outcome claim, the exact register every product page disclaims. The
  cadence is kept — `Inside the lot` over `Documented. Sealed. Cold-packed.`, three short
  declaratives the site can evidence (`promoCopy` already says all three).
- **`.spotlight__title` is small on purpose.** The mockup sets this line under the eyebrow, not
  as a headline — the photograph is the band's display element and a 3rem headline fought it.
  It was the body face at 400 with `0.16em` tracking; it moved to the hero's Roboto 900 at
  `0.02em` in the 2026-10-17 typography pass (see Typography), **keeping its small size**.
  It stays an `h2`, so the document outline is unchanged.
- `spotlightCopy.lead` was **removed** with this pass; the mockup's head is two lines and
  nothing else. It is in git if the paragraph is ever wanted back.

- **The reference floats benefit chips around the product** — *Moisturizing & Hydrating*,
  *Naturally Beautiful*, *3 fold*. **Not one of those is sayable here**: every product page
  says "not for human or veterinary use". The composition is kept and the chips are **derived
  from `projects` in the component, never typed into copy** — `labAnalysis.purity` + `lab`,
  `labAnalysis.batchNumber` + `fillVolume`, and the `Form` / `Total content` / `Storage`
  specs. A chip with no source is dropped, so a lot without an analysis simply shows fewer.
- **The band pins and runs through the range** (2026-10-16, requested): it stops at the top of
  the screen, the carton **in the hands** changes one lot at a time as you keep scrolling, and
  the pin releases into the next section after the last one. Verified at 1440: pinned from
  scrollY 1658 to 4194 with the figure held at 163–164px throughout, all five cartons
  cross-fading in order, chips tracking each lot (99.21% → 98.6% → 99.269% → 99.85% → NAD+'s
  spec fallback), and the release clean.
  - **It works at all because the fingers in the photograph are entirely *behind* the carton** —
    checked at 4× on both edges. An overlay covers the printed face without touching a hand, so
    no masking or cut-out was needed.
  - **The overlays are cropped to each carton's *solid* rectangle, not to its alpha bounds**
    (`assets/spotlight/cartons/p{1,2,4,5,6}.webp`). The renders carry a soft drop shadow of
    their own; including it padded the box by ~2%, which both undersized the carton — so the
    photograph's own edge peeked out around it — and painted **a second, offset shadow box**
    across the hands. That was reported from a screenshot and is what the re-crop fixes.
    Cropping at **alpha ≥ 250** isolates the face; the five then agree to within 0.6%, so one
    CSS box frames all of them, and the photograph supplies the only shadow in the frame.
    `cartons/{tirzepatide-40mg,nad-1000mg}.webp` are the uncropped drop intermediates, kept.
  - `.spotlight__carton`'s four `--carton-*` values are **the photographed front face and
    nothing else**, and they are **detected, not eyeballed** — a luminance-step scan down
    x=1000 / x=1500 and across y=330 / 345 / 760 / 770 of the 2048×1152 source puts the face at
    **x 489–1640, y 313–777**. Each is nudged a fraction outward so no sliver of the
    photograph's own white box haloes a coloured carton (it is invisible behind the white
    Retatrutide render and obvious behind the pink Glow one — test with Glow, not with `p1`).
  - **Getting `--carton-h` wrong is what breaks the hold, and it did twice.** An eyeballed value
    made the overlay ~37px too tall and the surplus hung over **the right thumb that tucks under
    the carton's base** — the box stopped reading as held and started reading as pasted on.
    If a carton ever looks like it is covering a finger, that is the number.
  - **What actually showed the old carton through was its top *rim*, not a lid.** The old box's
    top edge line runs **y 307–315** (measured, darkest at 312–313). An overlay starting at the
    face proper (y 313) leaves a few pixels of that dark rim standing above the new carton.
    `--carton-y` therefore sits at **26.6%** (y≈306), *above* the detected face, with
    `--carton-h` carrying the difference so the base does not move.
  - **There is no lid, and a `.spotlight__carton-top` element that painted one must not come
    back.** It was built on the theory that the camera looks down on the box and leaves a white
    top surface above the face, repainted per lot in a sampled board colour. Measured, the
    photograph above the rim is **250–253 — identical to its studio ground far from the box**.
    The element was painting a bar onto plain background, which is what then showed as a white
    strip across the top. The `card` colours and `--lot-card-rgb` went with it.
  - **`.spotlight__carton-edge` is the contact shadow**, and it stays. A render cropped to its
    own solid edge has a hard cut where the photographed carton had a soft shadow, which is
    what made the base read as pasted onto the hand. It sits *below* the face so it never
    darkens artwork, and it is one element for the whole stack so a mid-crossfade frame cannot
    stack two shadows.
  - The four `--carton-*` values live on **`.spotlight__cartons`**, the shared wrapper, so the
    stack and the shadow resolve against the same numbers. Don't move them back onto
    `.spotlight__carton` — the shadow is a sibling and would stop seeing them.
  - It sets **both `width` and `height`**, squashing the render on purpose: the photograph looks
    down on the carton, so its top surface shows and the face is foreshortened hard — aspect
    **2.48** against the renders' 2.17. A uniform scale matches one axis or the other.
    The white top surface visible above the overlay is the photograph's, and keeping it is what
    holds the 3D read.
  - The client's newer drops are the *same artwork* as `products/*.webp`, just 1120×1405
    instead of 900×1130, so the two sources mix without drifting.
  - **The band's ambient colour follows the carton in the hands** (2026-10-16, requested).
    `--lot-accent-rgb` on `.spotlight` is a bare `r, g, b` triplet the CSS mixes its own alphas
    from; `ProductSpotlight` rewrites it on **the same curve as the crossfade**, so the colour
    arrives with the product instead of drifting ahead of it. Verified live across the run:
    orange → pink → orange → **blue** (Tirzepatide) → **yellow** (NAD+) → **red** (Tesamorelin).
    - **Each accent is sampled from that carton's own printed artwork, never picked.** Every
      pixel of the render is binned by hue and weighted by the *square* of its saturation, so
      the one strong colour on a mostly-white box wins. Both Retatrutide strengths land on the
      same orange because they are the same artwork. Re-sample rather than eyeball if a carton
      is replaced.
    - It is set straight onto the element, not tweened: **GSAP will not interpolate a custom
      property as a colour**, and a per-frame tween fights the scrub. `mixHex` lerps the
      channels; `gsap.utils.interpolate` is wrong here because it hands back an `rgba()` string
      and the CSS needs the bare triplet.
    - **Only the ambient layers take it** — `.spotlight__wash` and `.spotlight__art`. The chips,
      pagers, active tile frame and every control stay burgundy: the brief allows one accent
      plus the rose, and letting the product colour into the controls too reads as a different
      brand per lot rather than a lit band. The fallback in CSS is the opening lot's orange,
      which is what reduced motion and every width below the pin breakpoint keep.
  - **The swap takes the middle third of each step, not all of it.** Fading two different
    cartons across a whole step leaves them at 50/50 for most of the run, and two sets of
    printed artwork at half opacity read as one doubled, ghosted box rather than as a change.
    Each carton is held solid either side of a short dissolve (`FADE = 0.34` of a step), with a
    2.5% slide and a 1.5% scale to give the dissolve a direction. Verified in a 22-sample
    trace: several consecutive frames at opacity 1.00 per lot, one blended frame between.
  - **Six lots are in the run** — `p1`, `p2`, `p6`, `p4`, `p5` and **TESAMORELIN 20mg**, rotated
    so it opens on `spotlightCopy.productId`. `p3` has no clean render and is not in it.
  - **TESAMORELIN is in the band but deliberately *not* in `projects`** (added on request,
    2026-10-16). It is the blocked pending task — no price, no Janoshik report — and giving it
    a catalogue entry would put a guessed price on a live storefront. It lives in
    `spotlightCopy.pendingLots` instead, carrying **only facts legible on the carton** (pre-filled
    pen, 20 mg total, 2–8°C). It has no `labAnalysis`, so the chip filter drops its purity and
    batch rows by itself — verified live, it shows two chips where a documented lot shows four.
    **Delete that entry the moment the real product lands in `projects`.**
    The drop's MOTS-C and CJC-1295 cartons are still out: unlike TESAMORELIN they are not
    pending products at all, so there is nothing truthful to caption them with.
  - **`LOTS` / `ACCENTS` are resolved once at module scope, not per render.** Everything they
    read is static, and rebuilding them each render handed the scroll effect a new array
    identity every time — `react-hooks/exhaustive-deps` flags it, and that warning is the only
    thing standing between this file and the clean 9-error baseline.
  - **The detail tiles are per-lot now** (`assets/spotlight/details/<id>-{name,device,molecules}
    .webp`, 15 files). They were three fixed crops of the Retatrutide photograph, which once the
    carton started changing sat there reading *"20mg · 4 doses of 5 mg"* under a 1,000 mg
    carton. Each set is cropped at the same three fractions of the carton face. **The mg badge
    is deliberately not a tile**: its position moves between cartons, and the storage /
    subcutaneous-injection small print sits directly under it. `detail-{molecules,device,dose}
    .webp` are unused now but still on disk.
  - **Pin is ≥992px and no-preference only.** Below that the band keeps the parallax it always
    had and shows the opening carton — pinning a band on a phone traps the reader, the same
    rule `Services`, `LabProof` and `Contact` follow. The desktop `yPercent` drift on
    `.spotlight__visual` was **removed**, not kept alongside: a pinned element whose own
    `yPercent` is scrubbed drifts out of its pinned frame.
  - `.spotlight__visual > img` is a **direct-child** selector now. The carton overlays are
    `<img>`s inside that figure too, and its vertical feather mask would otherwise fade each
    overlay across its own top and base.
  - **A `removeChild ... not a child of this node` crash while testing this was the harness, not
    the code.** Deleting the `.preloader` node (which React still owns, because the rAF-driven
    preloader never completes headless) makes the next React commit fail and unmounts the whole
    app. Hide it with injected CSS instead — as the environment note below already says.
- **The carton pictured is a lot this catalogue actually stocks** — Retatrutide 20mg (`p1`) —
  which is why this band may name the product on it. That makes it the exception: the hero and
  the showcase picture cartons the catalogue does **not** stock and are deliberately written
  around them. `spotlightCopy.productId` ties the copy to the photograph; **swap the photograph
  and you must change that id**, or the chips will describe a different lot than the one on
  screen. The carton's own small print (*For subcutaneous injection only*, the storage line)
  is legible at this size — nothing in the copy may echo it.
- Image: `assets/spotlight/product-info.webp` (1800×1012, 133 KB), a straight ffmpeg conversion
  of the client drop `latest-images/product-info.png`, which stays untouched as the source of
  truth — same convention as `new/` → `products/`. Nothing is generated: an image model
  re-draws printed packaging and reliably garbles it (see the hero notes).
- **The band stays white and the wash is parked in the far corners.** The shot is a pure-white
  studio frame, so anywhere the burgundy wash passes behind it the file reads as a lighter
  rectangle pasted onto a tinted band. The image also takes a radial `mask-image` feather
  (falloff from 76%, outside the carton) to kill the frame edge — measured afterwards at a
  4/255 step, i.e. invisible. On the sand ground used elsewhere, neither trick is enough.
- `.spotlight__chips` is a **sibling** of the figure, not a child — an absolutely-positioned
  overlay seated by `:nth-child` on desktop, dropping into a plain 2-up grid under the
  photograph at ≤991px (1-up ≤560). Keeping it out of the figure is what lets that reflow
  happen; same structure as `.showcase__cards`. The overlay is `pointer-events: none` with each
  chip re-enabled, or it would swallow every click across the photograph.
- **The chips carry icons only.** The hairline **leader lines** out to a dot on the carton were
  **removed on request, 2026-10-17** — `.spotlight__leader` is gone from the markup, the CSS and
  the entrance timeline (its `scaleX` tween; the chips' own `x`/`scale` arrival is unchanged).
  Don't reintroduce them unasked. Chip copy is `nowrap` with an ellipsis: a wrapped detail line
  pushes the pill into the hand next to it.
- **The band is `--brand-sand`, and that is only safe because the photograph is feathered on
  all four edges.** The shot is a white-ground studio frame; on a tinted band an unfeathered
  edge reads as a pasted rectangle. **The figure and the image carry one mask each** — the
  figure feathers left/right, the image feathers top/bottom. That nesting is deliberate:
  `mask-composite` is the usual way to intersect two gradients and is not dependable enough to
  rely on.
- **Decorative line art is inline SVG, not shipped images** — it tracks `--brand-primary`
  instead of baking a colour into a file. The carton's own printed motifs could not be reused:
  they are white-ground crops and cannot overlay a tinted band. The art layer is also the
  furthest-travelling element in the scrub. Two pieces, both matched to the mockup on a second
  pass after a looser first attempt was rejected:
  - **corner ring structures** (`MOLECULE` in the component, reused twice, the second rotated
    180°). **Node positions are traced off the mockup** — a 4× crop of its top-left corner,
    measured into a 240×165 viewBox — after two looser attempts were rejected. Three things
    make it read as that image rather than as a generic lattice:
    - **atoms come in two kinds**, solid discs and thick open rings. An all-solid or
      all-outline set reads as a wireframe pattern.
    - **the open rings are filled with `--brand-sand` and drawn last.** Left transparent, their
      bonds run straight across the middle and every open atom reads as a crossed-out circle.
      The fill is invisible against the band and knocks the bond out inside the ring.
    - **the network runs off the top and left edges.** The mockup's is a crop of something
      larger; a structure that closes neatly inside its own box reads as a logo in the corner.
    No `fill` may be set on the `<svg>` in CSS — it is inherited by every child and closes the
    open rings up. Fills are per element in the markup. The art sits at `top: 2.5rem` to clear
    the fixed header, which floats over this band, and shrinks at ≤767px where desktop scale
    lands it behind the eyebrow.
  - **ribbons** (`ribbon()`) — a **fan of 12 parallel hairline curves** sweeping *across* the
    band from each margin, generated rather than hand-written so the spacing stays even. The
    first version was four loose diagonals running down the band and read as stray strokes;
    the mockup's is a dense bundle, the carton's printed swirl restated.
- **The detail tiles are a gallery**: pagers either side, the active tile framed in burgundy
  with an inner gutter and a slight lift. Verified: arrows step, tiles select, both pagers
  disable at their end.
  - The border is **always 2px and transparent at rest**, never added on selection — a border
    that appears would resize the tile and shunt the whole strip sideways on every click. The
    active state adds `padding` instead, which cannot change the outer box under `border-box`.
  - The pagers are **borderless** white discs with burgundy glyphs, set well off the rail. An
    outlined button made them read as two more tiles in the strip. Geometry is measured off a
    5× crop of the mockup, not guessed: **48px disc at 1440, glyph ~40% of it, ~1.6px stroke**
    — which means `stroke-width: 2` in a 24 viewBox, since the value scales down with the
    render size (at 1.6 it came out near 1.1px and read thin).
  - **They wrap rather than clamp, and are never disabled.** The mockup draws both pagers in
    full burgundy with the *first* tile already active, so neither is ever dimmed — and with
    three tiles a disabled control is the more annoying of the two behaviours. Verified
    0 → prev → 2 → next → 0.
  - A caption naming the active crop was built under the rail and **removed on request** — the
    mockup has no such line. Selection now shows only in the frame and the lift, so the tiles'
    `alt` text is the sole description a screen reader gets; keep it specific. Raised that a
    control with no visible consequence is decoration dressed as an interface; the comp was
    reaffirmed, so this is deliberate.
- **`.spotlight__gallery` needs `position: relative; z-index: 4`.** Its negative `margin-top`
  pulls it up under the carton, overlapping `.spotlight__stage`, whose figure is positioned at
  `z-index: 1` — without them the photograph paints over the pagers and swallows every click.
  The whole gallery was unclickable until this was found.
- **Three detail tiles** (`.spotlight__details`), added 2026-10-16 on request. The reference
  floats small *ingredient* cut-outs here; this catalogue has none to picture and drawing some
  would be invention, so these are **measured ffmpeg crops of the band's own photograph** —
  the parts of the real lot. Coordinates against `latest-images/product-info.png` (2048×1152),
  all `scale=360:360 -quality 86`:

  | tile | crop | shows |
  |---|---|---|
  | `detail-molecules.webp` | `crop=170:170:495:595` | the carton's printed molecular artwork |
  | `detail-device.webp` | `crop=270:270:1175:275` | the pre-filled pen in its window |
  | `detail-dose.webp` | `crop=180:180:1440:497` | the `20mg` mark + "4 doses of 5 mg" |

  **The dose crop is cut to stop above the carton's storage and injection small print**
  (that line starts at y≈682). Do not widen it downward — enlarging *For subcutaneous
  injection only* into a detail tile is the one thing this band must not do.
  They are **rounded squares, not circles**: a circle clips the ends off "4 doses of 5 mg",
  and squared corners are the site's language anyway. `.showcase/motif-*.webp` were considered
  and rejected — they are keyed off the **purple MOTS-C** carton and clash beside this orange
  one. The `subImages` on `p1` are unusable here too: every one is **watermarked**
  (`www.ALLUVI.org` tiled) and one shows injection instructions.
- **`z-index` is load-bearing in the stage and cost a pass.** `.spotlight__visual` takes
  `z-index: 1` so it paints over `.spotlight__ground`; the chips and tiles are
  absolutely-positioned siblings at `auto`, so without indexes of their own they went
  *behind* the photograph and only the few pixels overhanging its edge stayed visible. Order is
  ground `0` → visual `1` → details `2` → chips `3`.
- **The grounding shadow only works because the image's base is feathered.** A radial mask was
  tried first and is wrong: with the frame's proportions its vertical radius lands far outside
  the box, so the bottom edge stayed a hard cut and `.spotlight__ground` was hidden behind
  opaque white. It is a **vertical linear fade** (`#000 80% → transparent`) that dissolves the
  wrists into the shadow. The left and right edges need nothing — measured at a 4/255 step
  against the white band, i.e. invisible.
- **Motion** (`ProductSpotlight.tsx`, `gsap.matchMedia(el)` scoped, the Hero's pattern): one
  `once: true` timeline at `top 72%` — head, then the photograph wiping up from its base
  (`clipPath` + `scale`), the shadow spreading (`scaleX`), chips arriving from the side each
  one sits on, tiles popping in, foot. Then a scrub: the photograph drifts `yPercent`, the
  tiles drift `y` at alternating rates against it. **Entrance and scrub own disjoint
  properties** — entrance `clipPath`/`scale`/`opacity`/`x`/`rotate`, scrub `y`/`yPercent` —
  the same rule as the hero and the LabProof tiles. Every tween is a `from`, so reduced motion
  (which gets no `mm.add` branch at all) renders the finished state straight from CSS.
  Verified both ways. Note this raised the home view's reduced-motion GSAP warning count from
  **28 to 36** — same pre-existing "Invalid scope" class, 0 errors.
- The desktop centring margin on `.spotlight__detail:nth-child(2)` is a **negative
  `margin-left`, not a transform** — GSAP owns the transform on these tiles. It therefore has
  to be unset at `:nth-child` specificity inside the ≤991px block, or the middle tile laps the
  other two in the mobile row.

**⚠ PRODUCT RANGE + CATEGORIES COMBINED 2026-10-20 (latest — supersedes the layout notes below).**
Built to a client reference and moved to **directly under the hero** (the slot `ShopCategories` held;
that band is **unmounted and kept**, its tiles now live here). Still carries `id="work"`. Cream band
(`--range-cream: #fbf6f1`): eyebrow pill + title + lead, three trust marks opposite
(`rangeCopy.trust`); a **3-up carousel** (2-up ≤991, one + peek ≤640) of rounded white cards with
round arrows outside the rail and **page dots** measured off the rail; then **four category tiles**
(`researchAreas` minus "All peptides", linking `#/shop?research=<id>`). Reference slots that could
not ship and what fills them: star rating → the lot's **batch number · lab**; *Bestseller / Trending /
New* badges → the **published purity** (or nothing); wishlist heart → the **add to cart** button;
outcome-claim tile labels → the areas' own `shopTitleLines`. The blush → coral media gradient is
kept; packshots sit at `scale(0.88)` so the carton does not run edge to edge. Arrows/dots verified
stepping 0 → 1 and disabling at each end.

**Product range** (`ProductRange.tsx`, `rangeCopy` in `site.ts`, `.range__*` at the end of
`portfolio.css`) — added 2026-10-15, **rebuilt 2026-10-16 to a best-sellers reference**: a
white band, the title on the left with two circular pagers on the right, and a **4-up
scroll-snapped rail**, then a `Shop all products` link and the research-use-only line.

- **The 10-16 rebuild replaced a continuously scrolling marquee on a burgundy backdrop.** Gone
  with it: `@keyframes range-marquee`, the two-copy duplication contract (`-50%` travel,
  `aria-hidden` clones), `.range__bg`, the `.range::after` scrim and the mask fade at both ends.
  The list renders **once** now. `assets/range/backdrop.webp` is no longer imported but stays on
  disk, so the burgundy version is one import plus a CSS block away.
- **The reference's cards carry a star rating and a review count. Ours cannot.** There is no
  review data in the project, and inventing it is the same fabrication the rules exclude
  everywhere else. That slot carries the lot's real shelf spec (`Form · Total content`) instead,
  and the only figure on a card is a published purity. Its earlier reference filled the tiles
  with photographs of people holding the product — also unusable, for the endorsement reason —
  which is why the tiles carry packshots.
- **The pagers only render when the rail overflows** (ResizeObserver), and each **disables at
  its end of the travel** — a scroll listener keeps `atStart`/`atEnd` current. The forward pager
  is the filled one and is the band's only filled control. With 5 cards in a 4-up rail the whole
  travel is ~320px, so both states are reachable immediately; verified.
- **`.range__rail`'s `grid-auto-columns` must stay a plain `calc()`** — wrapping it in
  `minmax(0, …)` lets the tracks shrink to fit, the rail never overflows, and the pagers never
  appear. Same trap as the catalogue rail.
- **⚠ The rail must NOT carry `data-lenis-prevent`** (removed 2026-10-20 — it had been there
  since the rebuild and was reported as "stuck in the product section"). That attribute tells
  Lenis to ignore the wheel for *everything* inside the element, on both axes — and this rail
  scrolls on **x only**, so with the pointer anywhere over the cards (368px tall, full band
  width) the page simply stopped scrolling down. Lenis runs
  `gestureOrientation: "vertical"`, so a horizontal wheel or trackpad gesture passes straight
  through to the rail without it, and touch is native. Verified both ways: a vertical wheel
  over a card moves the page 1710px and leaves `scrollLeft` at 0; a horizontal one moves
  `scrollLeft` to 311 and the page not at all. **The attribute belongs on genuinely vertical
  inner-scroll regions only** — `.report__scan-frame` on the Science page is the one real
  case in the project. `.catalog__rail` had the same bug and was fixed with it, though that
  band is unmounted.
  4-up ≥1200px, 3-up ≤1199, 2-up ≤767, one card plus a peek ≤480.
- **⚠ Superseded 2026-10-19 (requested): `.range__add` is now an always-visible outlined pill in the
  card body**, in `.range__row` opposite the name + price (`.range__meta`), filling burgundy on hover
  and while it reads *Added*. ≤480px it drops to the bag icon alone (label kept for screen readers).
  The hover-reveal notes below are history.
- **`.range__add` is the hover pill over the tile**, not a button in the card body. It is faded
  with `opacity` + `pointer-events`, **never `visibility: hidden`** — it has to stay focusable,
  because tabbing to it is what reveals it (`:focus-visible`). Under `@media (hover: none)` it
  simply stands, same convention as the header.
- `.range__title` runs on **`--font-heavy` (Roboto 900), sentence case** — the reference's
  heading is wide and black and Anton cannot do that, the same reason the hero headline uses it.
  The product names are **not** uppercased as the reference's are: `text-transform: uppercase`
  renders "20MG", and the unit matters on a research catalogue.

- **It replaced `Catalogue` and took `id="work"` with it.** That anchor has to keep resolving —
  the Products nav item and the home-section list both point at it. `Catalogue.tsx` is kept in
  the tree but no longer mounted, same convention as `Projects` / `ResearchAreas`.
  **Hiding `Catalogue` also removed the "Shop by category" tiles** (`shopImage` /
  `shopTitleLines` on `ResearchArea`); those are now only reachable via `#/shop?research=<id>`.
  Re-add them here if categories are wanted back on the home page.
- **The media tile is a vertical blush → coral gradient** (2026-10-19, requested), five stops
  sampled off the client's swatch (`#f1e5e4` → `#e79181`). It replaced the flat sand tile below.
- Cards are on the burgundy identity: warm sand media tile, squared corners, no card border or
  shadow since the 10-16 rebuild, and burgundy on exactly one filled control. No
  rounded-card-on-gradient — the brief rules both out.
- **`.range__media` is `aspect-ratio: 1/1`, `object-fit: cover`.** Three traps here, all already
  paid for:
  - The packshots sit on **tall transparent canvases** (900×1130) with a landscape carton in the
    middle, so `contain` fits the whole canvas and leaves a small carton adrift. **Measured
    2026-10-16** across all five (ffmpeg `alphaextract` → alpha bbox, not eyeballed): the carton
    is vertically centred (centre y 50.1–50.6%) and spans **~37% of the canvas height and ~97%
    of its width**. So a square `cover` tile shows the carton at ~47% of the tile height, near
    edge to edge — it is already as large as it can be without cropping the box. Don't "fix"
    the apparent empty space above and below it; that space is symmetric and intentional.
  - **The tile must not be near 4/5.** `900/1130 = .796` and `4/5 = .8` — almost the same shape,
    so `cover` crops nothing and you get the `contain` problem anyway. Square is far enough away
    to crop the empty canvas off.
  - It was `display: grid; place-items: center` first. A centred grid item is **not stretched**,
    so the image's `height: 100%` resolved against its own intrinsic ratio rather than the tile
    and **overflowed the card by ~165px**. Don't reintroduce `place-items: center` here.
- `.range__purity` shows `labAnalysis.purity` — the **real published figure**, and only on the
  lots that carry an analysis (5 of 6). Never round it and never invent one for the sixth.

**Catalogue** (`Catalogue.tsx`, `catalogueCopy` in `site.ts`, `.catalog__*` at the end of
`portfolio.css`) — the home shop band, added 2026-10-13 directly under the hero. It **replaces
`Projects`**, which is no longer mounted (the component file is kept); the new section carries
`id="work"` so the Products nav anchor still resolves.

- **White band, dark type** — the only light section on the home page. It takes `id="work"` and
  a top shadow so it reads as a sheet sliding over the hero. Square top edge: a rounded lip was
  tried and removed on request.
- **It scrolls over the hero.** `.view--home .hero` is `position: sticky; bottom: 0; z-index: 0`
  (bottom, not top — the hero is taller than the viewport and has to finish scrolling in before
  it pins), and `.view--home > *:not(.hero)` is `position: relative; z-index: 1` so every later
  section passes over it instead of under.
- Ecommerce-first content, deliberately not the science framing: tabs are the five
  `researchAreas` by short name (`titleLines[0]`), the card shows a `Lab verified` flag, the
  title, a shelf line built from the `Form` / `Total content` **specs** (not `summary`), price
  and *Add to cart* (`useCart`, opens the drawer), plus a `+` quick-add on the image.
- Rail is a scroll-snapped grid; `grid-auto-columns` must stay a plain `calc()` — wrapping it in
  `minmax(0, …)` lets the tracks shrink to fit and the rail never overflows, so the arrows
  disappear. Arrows render only when the rail actually overflows (ResizeObserver).
  It **no longer carries `data-lenis-prevent`** — see the warning under `.range__rail`.
- **Category tiles** use `shopImage` + `shopTitleLines`, both on `ResearchArea`. The images are
  **lifestyle photography with people** in `src/assets/categories/*.webp` (Higgsfield,
  2026-10-13) — fitness, daylight portrait, skin, stretching, hydration — requested explicitly
  against a supplement-storefront reference. They are the one place the cool-palette and
  no-people imagery rules do not apply; an earlier still-life set without people was replaced on
  request. They still carry no packaging, no capsules, no syringes and no clinical setting.
- `shopTitleLines` are goal-style two-line labels in the reference's cadence but **framed as
  research, never as a personal health outcome** ("Explore metabolic pathways", not "Manage
  weight naturally"). The catalogue is laboratory-use-only — consumer benefit copy on these
  tiles would contradict the compliance position on every product page. Keep that framing.

**⚠⚠ CONTACT: DO NOT PIN (2026-10-20).** A pinned version came back after the timed one and was
reported as **"stuck and double"** — `position: fixed` under Lenis plus `anticipatePin: 1` painted
the band twice as it latched and released. Live state: **no pin at any width**; the disc plays a
timed 1.6s tween at `top 55%`, `toggleActions: "play none none reverse"`. Verified 0 `.pin-spacer`
on the home view.

**Contact** (`Contact.tsx`, `.contact__*`) — **rebuilt 2026-10-13 against the Vertical Webflow
template’s contact/footer block**, replacing the 2026-10-12 enquiry-form version.

- **⚠ The pin is gone (2026-10-20, requested — the page felt stuck at the contact band), and the
  disc now PLAYS when the band is reached** (second request the same day): a timed 1.6s
  `power3.inOut` tween, `start: "top 55%"`, `toggleActions: "play none none reverse"` — not a
  scrub, so it runs on its own and replays on the next pass down. Verified no `.pin-spacer` and
  the disc at scale 0 until the trigger. The note below describes the old desktop pin.
- **The band pins and the turnover plays against the scroll.** ≥992px the section is
  `pin: true` with a scrubbed tween: it stops at the top of the screen, you keep scrolling,
  and a **growing light disc** (`.contact__grow`, 150vmax, `z-index: -1`) opens from the middle
  until it owns the viewport, then the pin releases into the footer. The section is
  `min-height: 100svh` so the pinned frame has no seam.
  - **⚠ FOUR VERSIONS HAVE SHIPPED IN THIS SLOT — read this before changing it again.**
    pin + 1:1 scrub (rejected, read as "stuck") → plain scrub, no pin → a timed 1.6s play on
    arrival → **the current one: pin restored, shorter hold, smoothed scrub** (2026-10-20,
    requested: it should hold when reached and reveal smoothly as you scroll).
  - **Two numbers carry that, and they are what to adjust if it reads as stuck again:**
    `end: "+=70%"` (the rejected version held `+=110%`, a full viewport plus) and
    **`scrub: 1`, not `scrub: true`** — a raw scrub maps the disc 1:1 to the wheel so every
    notch is a visible step; the 1s catch-up turns the same travel into a glide. `ease: "none"`
    for the same reason: an ease on top of a scrub fights the smoothing and reads as lag.
    `anticipatePin: 1` takes up the pin's layout shift a frame early so the band does not jump
    as it latches.
  - **Below 992px it does not pin at all** — a full-height pinned section traps a phone reader,
    the rule `Services`, `LabProof` and `ProductSpotlight` follow. The disc plays on arrival
    there (`top 55%`, `toggleActions: play none none reverse`) and rewinds if you scroll back.
  - Verified at 1440: `.contact` wrapped in a `.pin-spacer` of 1551px (921 band + 630 hold),
    `position` flipping `relative → fixed; top: 0` on latch, the disc scrubbing
    0 → 0.15 → 0.42 → 0.74 → 1 while held, and releasing to `relative` with the footer in
    view. At 390px: **0 pin spacers**, 0 horizontal overflow.
  - **Measuring this in Playwright needs care.** Setting `scrollTop` directly fights Lenis and
    the band's `getBoundingClientRect().top` comes back as nonsense mid-flight (−9000-ish).
    Drive it with real `mouse.wheel` input and assert on `position`/`.pin-spacer` instead.
- **The type flips with `mix-blend-mode: difference`, not a colour tween.** `.contact__main` /
  `.contact__foot` are pure white and blend: white over the dark band stays white, white over
  the disc lands near-black — and it is correct *per pixel*, so a glyph half-covered by the
  disc edge reads correctly on both sides. A `--contact-fg` crossfade was tried first and is
  wrong by construction: it recolours whole elements while the disc edge cuts through them.
  (The reference gets the same result with `backdrop-filter: invert(1)` on a circle *above*
  the content; that was built and reverted on request.)
- **The footer is light too** (`#e6e5e1`, same tone as the disc), so the wipe carries to the
  bottom of the page as it does on the reference. It re-points `--color-fg` / `--color-bg` /
  `--color-accent` / `--color-outline` inside `.footer` rather than rewriting each rule — the
  `--color-bg` flip is what keeps "dark text on an accent fill" (the Subscribe button) legible.
  `.footer` also needs `overflow: hidden`: the oversized `.footer__big` wordmark overflows its
  box and leaves a strip of dark page background below the panel.
- The email is the only CTA: `site.email` set huge as a `mailto:`, each character lifted on a
  **sine arc** computed in the component (ends low, middle high) — deterministic, no randomness.
  Its font-size is capped so it clears the photo columns; widen it and it runs under them.
  A `.sr-only` copy carries the address for assistive tech, the arc spans are `aria-hidden`.
- Eight round photos either side, reusing `assets/standards/*` and `assets/categories/*`.
  Hidden ≤991px — two 200px columns do not fit beside the type.
- **Photo entrance** (`once: true`, one timeline per circle, staggered 0.09s): an aperture
  `clip-path: circle(0% → 50%)` on the frame, the frame drifting in from *its own* side
  (`x` ±90, `rotate` ±9, read from `.contact__photos--left`), and the `<img>` inside settling
  from `scale 1.45` with `blur(14px) → 0`. A second scrubbed tween drifts each circle on **`y`**
  at alternating speeds for the whole section. The split matters: the entrance owns
  `clipPath`/`x`/`rotate`/`opacity` and the drift owns `y`, so the two never fight — the same
  rule as the LabProof tiles.
- Foot row: Shop / Help / Follow link columns.
- Reduced motion gets the finished light state (dark type, disc at scale 1) with no scrub.
- **The enquiry form is gone**, and with it `.form__*` / `.cfield*` — the old markup never sent
  anything (no contact endpoint exists), so the big mailto is a straight upgrade. If a real form
  is ever wanted back, it is in git before this commit.
- **Placeholder numbers are still filtered.** `isPlaceholderNumber()` (a run of 6+ zeros) hides
  the WhatsApp action and drops the WhatsApp social link; both return once real numbers land.
  **The Footer still prints the placeholder phone and WhatsApp link** — not fixed here.

**Why us** (`WhyUs.tsx`, `.why__*`) — **unmounted from the home view on request, 2026-10-16.**
Component and CSS are untouched, so remounting is one line in `App.tsx` plus its import. It took
`id="why-us"` with it, which is why the footer's `Why Us` link is now a dead anchor (see the
unmounted list above). The notes below describe it as built and still apply if it comes back.
Hover-expand tiles. Copy reframed 2026-10-13 around the
**shopping experience** (reorder / check the numbers / delivery / support); the product
*promises* live in `services`, so keep the two sections from converging again. **The tile
photography stays the original `*-seo.webp` set** — a human-model replacement in
`src/assets/why/` was generated and reverted on request; those files are on disk but unused. The active tile's photo runs at
**full opacity** with a **directional scrim** (`.why__card.is-active::after`), the same approach
as the page banners — never dim the image itself and never use a flat full-cover wash. The scrim
holds ~0.9 across the left ~44% where the number, title and copy sit, then falls away to 0 on the
right. It needs to stay that strong: the *Reliable service* image has a white product panel
exactly behind the body copy, and a gentler ramp made that text unreadable. Re-check that card
specifically after touching the gradient.

**Lab proof** (`LabProof.tsx`, `.proof__*` at the end of `portfolio.css`, copy in `proofCopy`
in `data/science.ts`) — the home teaser into `#/science?s=reports`. Rebuilt 2026-10-12 to a
**centred header over a 3 × 2 checkerboard**, after a wellness-site reference:

- Header: a **two-column grid** — the `Lyfe [ Science ]` mark and headline left (wrapped in
  `.proof__head-copy`), `proofCopy.text` as the lead right. `align-items: end` so the lead sits
  on the headline's last baseline instead of floating beside its cap height. The title carries
  no `max-width`; the grid column sets its measure. Stacks to one column ≤991px.
  `.proof__head`'s bottom margin is **deliberately tight** (~24px, not the usual 4rem band
  spacing) so the first row reads as part of the header block rather than a separate band below
  it. Don't restore it to the section default.
- **Type tracks the shared scale**, verified against siblings rather than eyeballed: heading 96px
  = `.why__heading`; mark 13px = `.eyebrow`; lead 21px = the `.lead` helper, which is what
  Services / Work / Reviews all render (`.why__lead` at 16px is the odd one out, not the
  pattern); card body 15px = `.service__desc`. Keep these in step if the section is restyled.
- Mosaic cells alternate card · media · card / media · card · media. The three **white cards**
  are `purityMethod.steps` verbatim (circular icon, label, body) — one card per step, so adding
  a fourth step breaks the checkerboard and the grid needs rethinking. They carry a soft shadow
  so the white lifts off the near-black page instead of sitting flat on it.
- **All three media cells are circular** (`border-radius: 999px`): two photos
  (`teamPanel.image`, `purityMethod.image`) and one **lot tile** — the highest-purity entry in
  `scienceReports`, derived not hand-picked, linking to its product and labelled with its real
  purity and batch number over a gradient scrim (the packaging shots are pale, so the label
  needs its own floor). Inside a circle that label is **centred and inset** so it stays off the
  curve; if the tile is ever squared off again, revert it to a left-aligned edge-to-edge bar.
- There is **no foot**. The pill CTA, crumb and research-use-only line were removed on request
  (2026-10-12); `.proof__foot` / `.proof__cta` / `.proof__crumb` / `.proof__disclaimer` are gone
  from both markup and CSS. `proofCopy.cta` / `.crumb` / `.disclaimer` are left in `science.ts`
  but are now unused — the section's only outbound link is the lot tile to its product page.
  The disclaimer itself is unaffected elsewhere: it still sits on every product
  (`safetyProtocol` in `site.ts`), the About compliance block, and the finder results.

Notes that matter if you touch it:

- Every cell is `aspect-ratio: 1/1` so the checkerboard stays square. Below 560px the grid goes
  single-column, cells become 16/10, and the circular tiles soften to `--radius-lg` — a
  full-width circle is absurdly tall on a phone.
- The two second-row circles carry `.proof__shot--low`, a `margin-top` that drops them below the
  card between them so the grid reads as a staggered composition. This needs
  `align-items: start` on `.proof__mosaic` — under the default `stretch` the cells fill the row
  height and the offset collapses to a few pixels. The stagger is removed in the single-column
  layout, where there is nothing to stagger against.
- **Pinned assembly (≥992px).** The section pins and the layout builds itself as you scroll:
  the three circles open as **one centred row** with the cards invisible, then the circles
  travel out to their checkerboard seats while the cards fade up in sequence. One scrubbed
  timeline, `end: "+=90%"`.
  - The trigger is **`.proof__mosaic` at `center center`** (pinning `.proof`), so the grid is
    centred — and therefore fully on screen, 896px in a 1000px viewport — while it assembles.
    Pinning on the section's own top would push row two below the fold. The headline is read on
    the way in, just before the pin engages.
  - Start positions come from **`offsetLeft`/`offsetTop`**, not `getBoundingClientRect` — the
    tiles are mid-transform when a refresh re-measures, and rects would feed the animation its
    own output. `.proof__mosaic` is `position: relative` to be their offsetParent.
    `invalidateOnRefresh` re-runs the function-based values on resize.
  - The opening row seats on **row one**, not the middle of the finished grid. `fromTo` start
    values apply the moment the timeline is built, so this is also what you see scrolling in
    *before* the pin engages — centring them left a ~330px dead gap under the lead.
  - Each circle has its **own arrival** (`once: true`, fired at `top 85%`, before the pin): an
    aperture opening `clip-path: circle(0% → 50%)` — 50%, not 71%, because the tiles are already
    circles — with a `blur(16px) → 0` focus-in, the photograph settling from `scale: 1.45`, and
    a single accent ring breaking out of the edge via `box-shadow` spread. Staggered 0.14s.
    It deliberately touches only `clipPath` / `filter` / `boxShadow` / the inner `img`, so it
    cannot collide with the pin timeline's `x` / `y` / `scale` on the same elements.
  - **Never animate the section's height while it is pinned** — not via `height`, not via
    `margin`. ScrollTrigger sizes the pin spacer once at setup, so a shorter section leaves the
    document short and **the next section scrolls up over this one**. Two attempts at collapsing
    the empty second row during the intro both failed this way: `height` additionally broke the
    grid (auto rows shrink to fit a definite height — 360 → 186px — dragging every tile out of
    place, and `align-content: start` does not prevent it because it only distributes surplus,
    never a deficit). The row stays reserved; it is simply empty dark space until the cards
    arrive.
  - Below 992px the pin is replaced by a plain in-place reveal (clip-path open + card rise);
    pinning a single-column stack would trap the reader.
- **Entrance timeline** (all inside `gsap.matchMedia("no-preference")` blocks, so reduced
  motion gets no tween or pin at all and every element renders at rest):
  1. Headline characters rise behind their own mask — `SplitText` supplies the `.char` spans and
     `.proof__title .word { overflow: hidden }` does the masking. The `<h2>` carries an
     `aria-label` with the full sentence, and each `SplitText` is passed `ariaLabel=""`, so
     assistive tech reads one heading rather than 33 letters.
  2. Cards rise and settle (`y`/`opacity`/`scale`) — below 992px only; above it the pinned
     assembly above owns the cards and tiles instead.
  3. Media tiles open from their centre via `clip-path: circle(0% → 71%)` — 71% ≈ half the
     diagonal, so the circle clears the square corners — while the photograph inside settles
     from `scale: 1.35`. Also below 992px only.
  4. Card icons **draw themselves in** via `strokeDasharray`/`strokeDashoffset` measured from
     `getTotalLength()`.
  5. The lot tile's purity **counts up to its real published figure**. Decimal places are read
     off the source string, so 99.85 / 99.269 / 98.6 all land exactly — never a rounded value.
     If the motion preference flips mid-session the matchMedia cleanup restores `lot.purity`.
- **Verifying this in Playwright:** GSAP lag-smoothing treats every throttled ~500ms frame as
  33ms, so a 1.6s tween needs ~24s of wall clock there. Mid-flight values look stuck at their
  start — that is the harness, not a bug. Wait it out or emulate reduced motion and assert the
  at-rest state instead.
- Icons are **inline SVG** in the component (`ICONS`), mapped positionally by `STEP_ICONS`.
- `assets/science/molecule.webp` (1024², 37 KB, Higgsfield) is still imported as the fallback
  for the lot tile when no lot carries an analysis. It is illustrative, not a model of any
  catalogue compound.

Earlier passes on this section are gone and should not be reinstated: a split canvas/panel
teaser (a canvas-drawn peptide chain, ~170 lines of projection maths), a three-band layout with
an attribute chip strip, and a lot carousel with transport controls, purity dial and thumbnail
selector. None of `.proof__feature`, `.proof__lot`, `.proof__gauge`, `.proof__attrs`,
`.proof__split` or `.proof__visual` exists any more.

**Reviews section** (`Testimonials.tsx`, section id `#reviews`, `.stories__*` in
`portfolio.css`) — rebuilt 2026-10-13 against a community-stories reference: a centred heading
over an infinite **masonry marquee of portrait cards**, where hovering a card floats that
person's review over it.

- **The card media is video, not a portrait** (2026-10-16, requested). The client supplied four
  customer clips in `latest-images/videos/` — people talking to camera holding an ALLUVI
  **RETATRUTIDE** carton, which this catalogue *does* stock (`p1` / `p4`), so unlike the hero
  and the feature band this imagery is not off-catalogue.
  - **⚠ OPEN: the four clips are all of women, and four of the six reviewer names are men's**
    (Ethan Carter, Samuel Bennett, Marco Ruiz, Rohan Natarajan). The rail therefore captions a
    visibly different person with each name — the written quotes and the faces no longer
    belong together. Flagged when the clips landed. **It cannot be fixed from this side**:
    renaming a review to match a clip, or writing a quote for a clip, both invent attribution.
    The client needs to supply the name / role / quote that goes with each clip, or the written
    testimonials and the clips need to stop being paired.
  - **Encode** (`assets/reviews/<name>.mp4` + a `.webp` poster, 4 of each): a 6s cut from 1s,
    `scale=420:-2`, h264 CRF 30 `veryslow`, **`-an`**, `+faststart`. That is 34.7 MB of source
    down to **723 KB**. Audio is dropped deliberately as well as for weight — these are spoken
    pieces, but the rail is a silent marquee and the written quote is what the hover reveals.
    `latest-images/videos/` stays untouched as the source of truth.
  - **Playback is gated by an IntersectionObserver on each `<video>`**, not by `autoplay`. The
    rail renders **24** video elements and no browser will decode that many at once; the
    marquee parks most of them far off either side of the viewport. Verified live: 24 total,
    **6 on screen, 6 playing, 0 playing off-screen**. Network is unaffected either way — there
    are only four distinct sources, so four files are fetched however many elements exist.
    **Don't swap this for a plain `autoplay` attribute.**
  - Reduced motion gets **no playback**, only the posters — an autoplaying loop is motion, and
    `index.css` kills every other animation under that preference.
  - The hover note's small thumbnail is the **clip's own poster**, not `review.avatar` — the
    card behind it is the clip now, and the portrait put two different people a few pixels
    apart. The `review*-seo.webp` portraits are still used elsewhere (`.hero__faces`), so they
    are not dead.
  - **Four clips, six reviews**, so they cycle by the review's index in the source list (not by
    its position in the loop, or the rail's copies would disagree). Adding a fifth entry to
    `REVIEW_CLIPS` is picked up with no other change.
- **One card per column** (2026-10-16, requested). It used to alternate a **tall column (one
  portrait)** with a **split column (two stacked, each ~half height)** — the reference's
  masonry. `buildColumns()`, the `Column` type, `.stories__col--split` and the whole
  `.stories__card--short` size (including its wider `.stories__review` inset and its tighter
  quote clamp at both breakpoints) are **gone**; the rail maps `testimonials` straight to one
  card each and `.stories__card` carries the single `3 / 4.4` ratio. Don't reintroduce a second
  card size without being asked.
- Cards sit straight; the whole *column* is offset by `--lift` from the fixed `COLUMN_LIFTS`
  array — with the masonry gone that array is the **only** thing staggering the row.
  **Never randomise the lifts** — the marquee duplicates the columns and the two copies would
  desync. The marquee renders **4 copies** of the list (down from 6 when the cards became
  video); half the track is then ~3100px at 1440 and ~3450px at 1920, which still clears the
  `x % -half` wrap at any viewport.
- **The review is the hover state**, not a separate card in the rail: `.stories__review` is
  absolutely positioned over its portrait at a *negative inset* (so it reads as a note dropped
  on top, larger than the frame), rotated ~-3.5°, translucent dark with a backdrop blur. It
  fades and unrotates in on hover while the name and its scrim fade out. Its base inset and
  7-line clamp were authored for the tall card, which is now the only card — the deeper `-16%`
  inset and 3-line clamp that the short card needed went with it.
- The marquee **stops** on hover (`timeScale: 0`), not just slows — the review has to be
  readable, and the same gesture that reveals it would otherwise carry it off screen.
- The reference runs this on a pale gradient; **ours stays on the dark page** — asked for
  explicitly. Portraits are the existing `review*-seo.webp` (real 4:5 photographs).
- `.stories__by` and its inner `<span>` both need `min-width: 0`, and the name/role are
  `display: block` with ellipsis — otherwise the nowrap role runs out past the card edge.

An earlier rebuild into an alternating product/review scroll rail (`.reviews__*`, `buildRail()`,
arrow paging) was **reverted on request (2026-10-12)**; `.reviews__*` exists nowhere now and
should not come back. The old `.testimonial__*` / `.marquee` card styles are gone with this
rebuild — only `.testimonials` survives as the section's outer class.

`ResearchAreas.tsx` still exists but is **no longer mounted** on the home view (removed by
request). `data/research.ts` is still live — it drives the Research nav panel and the
`#/shop?research=<id>` filter.

**⚠ The promo row ("Ready to order a documented lot?" + photograph) was removed on request
2026-10-19** — the band now opens straight on the heading and questions, and `.faq__main` lost
its top margin. `faqCopy.promo`, `.faq__promo*` and `assets/faq/portrait.webp` are kept but
unused, so the open compliance note on that photograph no longer applies to the live page.

**⚠ FAQ heading-column image replaced 2026-10-19 (requested)** — now `assets/faq/photo.webp`
(819x1024), a straight webp conversion of the client drop `latest-images/faq-new.jpeg`: a full-frame
fisheye photo of a woman in swimwear by a pool holding an ALLUVI **TESAMORELIN** carton to camera.
It replaced the cut-out `faq/figure.webp` (kept on disk); the cut-out's base-fade mask went with
it and the photo takes `--radius-lg`. **Then widened on request (same day):** `.faq__main` is now `minmax(0, 1.15fr) minmax(0, 0.85fr)` and
`.faq__figure` is a **5:4 card** (`max-width: 44rem`) showing the **whole** portrait photo
(`.faq__figure-photo`, `contain`) over a blurred, dimmed copy of itself (`.faq__figure-fill`, `cover`)
— requested as "zoom out"; a `cover` crop in a landscape slot always cut the carton. `.faq__trigger`
padding is `clamp(1.15rem, 2.22vw, 2.12rem)` so the list matches the card — bottoms within 6px at 1440. Superseded first pass — **Layout re-fitted the same day:** `.faq__main` is `minmax(0, 26rem) minmax(0, 1fr)` (was
1.12fr/0.88fr, which left a ~500px void beside a capped photo), the photo fills its column at
`aspect-ratio: 1 / 1.02` (`cover`, `center 40%`), and `.faq__trigger` rows are taller
(`clamp(1.05rem, 1.65vw, 1.6rem)`) so the list and the heading column end level — measured 3px
apart at 1440, 21px at 1920. **Compliance, open:** TESAMORELIN is not stocked, and its
benefit strapline (*TARGETED BODY FAT · IMPROVE DEFINITION · PRESERVE LEAN MASS*) is legible here;
it is also the most body-focused lifestyle image on the site. `faqCopy.figureAlt` names no compound.

**⚠ FAQ REBUILT AGAIN 2026-10-19 (latest — supersedes the notes below on layout and image).** Built to a
client reference: a warm cream band (`--faq-cream: #fbf5ef`), a large **serif** heading
"Frequently *Asked*" / "Questions" in `--brand-primary`, a portrait under it and an underlined
**View more** at the column's foot (shows `faqCopy.initialCount` = 4 rows, toggles to all 7 and
back, `aria-expanded`), and the questions in a hairline list beside the portrait with a bare
**plus that rotates 45° into a ×** when open.
- **Typography exception, on request:** the heading runs on `--font-serif` (Playfair 400, italic
  accent) — the reference is a light high-contrast serif. `@fontsource/playfair-display/400-italic.css`
  is now imported in `index.css`. Every other home heading still follows the `--font-heavy` rule.
- Grid: `minmax(0, 26rem) minmax(0, 1fr)` with areas `title . / figure list / more list`;
  `.faq__intro` is `display: contents` so its three children take areas. ≤991px it stacks
  title → figure → list → View more.
- **Image:** `assets/faq/portrait-burgundy.webp` (1000x1250) — the client's cut-out
  (`faq/figure.webp`, from `latest-images/faq-img.png`) composited with ffmpeg onto a burgundy
  studio ground with a soft cast shadow, to match a second client reference (portrait on one
  saturated colour). Higgsfield and Magnific were both unavailable, so nothing was generated.
  **Compliance:** she holds an ALLUVI TESAMORELIN carton (not stocked, benefit strapline legible);
  `figureAlt` names no compound. `documents.webp`, `photo.webp`, `figure.webp`, `portrait.webp`
  remain on disk, unused (`figure.webp` is the source for the composite).
- `faqCopy.title` is now `{ lead, accent, tail }`, not an array.

**FAQ** (`FAQ.tsx`, `faqCopy` + `faqItems` in `site.ts`, `.faq__*` in `portfolio.css`,
`assets/faq/`) — **rebuilt twice on 2026-10-17**, both times to a client reference. What is
live is the **second**: two stacked blocks inside one `.container` band — a promo row (copy
left, a near-square photograph right) over the questions, which sit in a right-hand column
with the heading alone opposite them.

- **The reference's copy could not ship, in both blocks.** Its promo reads *"Ready to
  Transform Your Health"* over a lead about supporting "you and your baby's nutritional needs
  prior to conception, during pregnancy and beyond" — a personal health-outcome claim and a
  pregnancy claim, on a catalogue whose every product page says not for human or veterinary
  use. Its questions are *"Are Innerwork Supplements Healthy?"* and the like, the same
  register. The **form** is kept — two-line headline, three-line lead, one filled pill, and a
  heading sitting opposite the rows — and the words are about ordering and paperwork.
  `faqItems` is untouched; only `faqCopy` was rewritten.
- **The reference's heading is a light serif. Ours is not.** `--font-serif` (Playfair) is the
  header wordmark's alone and does not spread, and every home band heading runs on the hero's
  `--font-heavy` since the typography pass earlier the same day. The layout is matched, the
  typeface is not.
- **`.faq__promo` is `align-items: start`, not `center`.** The copy block is about half the
  photograph's height; centring it opened a ~130px gap above the headline.
- `.faq__main` repeats the promo row's `1.12fr 0.88fr`, so the heading sits under the copy and
  the rows under the photograph — that alignment is the reference's whole structure.
- `.faq__promo-line` / `.faq__line` are `nowrap` on desktop (one entry in the data is one
  rendered line, as the hero does it) and **released to `normal` at ≤991px** — held as
  `nowrap`, the longest line is wider than the column at 320px.
- `.faq__mark` is the reference's filled disc at the end of each row: `--color-fg` at rest,
  `--brand-primary` on hover and when open, with one chevron that rotates rather than a
  plus/minus swap. `.faq__answer` keeps `padding-right: 3rem` so a long answer never runs
  under it. The answer still opens on a `0fr`/`1fr` grid row, so nothing measures a height.
- **All rows start closed** (`openIndex` is `null`), as the reference draws them.
- **The photograph under the heading is `assets/faq/documents.webp`** (2026-10-19) — an
  overhead flat-lay made with **Magnific** (a blank white mailer, a folded sheet and a
  cold-pack pouch on a warm neutral ground) with the catalogue's own **Retatrutide** render
  composited into the mailer. It illustrates what the band is actually about: what arrives in
  the box and the paperwork with it.
  - **The box was generated blank on purpose, and the real carton composited in.** Image
    models re-draw printed packaging and garble it — which is precisely what both drops this
    replaced did. The method is the Billboard band's, and it is now the project's standard
    route for putting a real pack into a generated scene.
    - The blank box was **detected, not eyeballed**: the generated mailer is *neutral* white
      (221,221,221) against a *warm* ground (228,222,212), so the scan keys on **chroma**
      (`r-b < 7`), not brightness — a brightness threshold found nothing. Face measured at
      **x 112–549, y 452–699** in the 928x1152 plate.
    - The carton is ~2.17:1 and the mailer ~1.77:1, so it is **not stretched to fit**: the
      render is laid on at 447px wide (the carton itself ≈ 420px) and centred, leaving an even
      white margin all round. That reads as the carton packed *in* its mailer, which is true,
      rather than as a label printed on it. It needed a 16px downward nudge off the
      arithmetic centre to look centred.
    - Two variants were generated; the other's box was ~1.5:1, further from the carton. Pick
      the plate whose box ratio is nearest, don't re-prompt for proportions — the same note
      the Campaign entry carries.
  - **It replaced a poolside swimwear frame** (`faq/photo.webp`, kept on disk) that sat beside
    questions on batch documentation and purity verification, and whose pack copy was partly
    mirrored. The earlier cut-out `faq/figure.webp` is also kept.
  - **The title and the figure are one grid child (`.faq__intro`), not two siblings.**
    `.faq__main` is a two-track grid, so a third child auto-places onto row 2 — in a row
    whose height is set by the question list, which drops the image hundreds of pixels clear
    of the heading it belongs to.
  - The slot is landscape (`5 / 4`) and the photo portrait (`4 / 5`), so the photo is shown
    **whole** (`contain`) over a **blurred, scaled copy of itself** (`cover`, `blur(22px)`) —
    zoomed out with nothing cropped. `.faq__figure`'s own `background` only shows if that fill
    fails to load; it is **sampled off the photograph's ground** (`#e4ded4`) and was a pale
    blue left over from the poolside frame, which would have flashed the wrong colour.
    **Re-sample it if the photo changes.**
  - **No open compliance item here, which is new for this band.** The carton is **Retatrutide,
    a stocked lot**, so `faqCopy.figureAlt` names it rather than writing around it; and the
    pack copy is the real artwork rather than a model's attempt at it. Both drops it replaced
    pictured TESAMORELIN, which the catalogue does not stock.
- The photograph is `assets/faq/portrait.webp` — a straight webp conversion of the client drop
  `latest-images/new-right.png`, which stays untouched as the source of truth, same convention
  as `new/` → `products/`. No grade: the file is theirs and ships as supplied.
  - The slot is near square (`1 / 1.07`), so `cover` keeps about two thirds of the landscape
    frame; `object-position: 34% center` puts that on the figure.
  - **COMPLIANCE, open: the photograph's full frame is a chain of health-outcome graphics** —
    energy, waistline, brain, joint, immunity, skin — which is consumer benefit imagery on a
    laboratory-use-only catalogue, and the one thing the imagery rules here explicitly
    exclude. It is the same orb artwork `showcase.webp` was dropped for on 2026-10-15. This
    slot shows **more** of it than the previous three-column layout did, and the stacked
    mobile layout shows all of it. Client-directed (they named the file to use). Mitigations:
    no word in the band refers to it, and `faqCopy.promo.photoAlt` is "A customer at home".
    Two ways to close it: crop the asset to the figure alone, or swap in a product still.
  - Its glow is **purple**, the pre-redesign brand colour, so it sits slightly off the
    burgundy palette. Left as supplied rather than graded, for the same reason.
- **The first rebuild is one commit back and should not be re-derived by accident.** It was a
  *full-bleed three-column* band — a photograph either side running to the page edge and a
  sand centre panel between them — built to a different reference (*"YOUR SKIN'S NATURAL
  DEFENSE – BOTTLED"*). Gone with it: `.faq__grid`, `.faq__shot*`, `.faq__panel-col`,
  `.faq__eyebrow`, `.faq__cta`, the italic-half-per-line heading (and with it the
  `@fontsource/roboto/900-italic` import — **nothing on the site is italic now**), and the
  left column's reuse of `standards/purity.webp`.
- **`faq-seo.webp` is still unused** — it went out in the first rebuild (dark, junk-food
  icons, off-theme since the inversion) and the second does not bring it back. On disk.

**⚠ The native mouse pointer is visible again (2026-10-20, requested).** The site used to set
`cursor: none` on every element and draw its own dot + ring, which on the light theme was nearly
invisible (the dot's `mix-blend-mode: difference` made burgundy a pale speck on white). Now links and
buttons show `pointer`, fields `text`, everything else `auto`; `.cursor-dot` is `display: none` and
`.cursor-ring` stays as a follow-along accent (1.5px, `z-index: 100000`). Don't put `cursor: none` back.

**⚠ The announcement bar above the header is hidden (2026-10-20, requested).** `AnnouncementBar`
is unmounted (component, `announcementCopy`, `.announce*` kept) and **`--announce-h` in `index.css` is
`0px`** — the header's `top` and `body`'s `padding-top` both read it, so leaving it at 2.5rem would
leave a blank strip. Remounting needs both changes reversed.

**Chrome** — `Preloader`, `CustomCursor` (`data-cursor` / `data-cursor-text` attributes),
`ScrollProgress`, `SplitText`

**Data** — `data/site.ts` holds products (`projects`), testimonials, FAQ, and all home copy.

**Product packshots** — five of the six products use the transparent-background box renders in
`src/assets/products/*.webp` (converted 2026-10-13 from the originals the client dropped in
`src/assets/new/`, which stay untouched as the source of truth). The carton sits on a tall
transparent canvas, so anywhere the image is `object-fit: contain` it needs scaling up —
`.catalog__media img` runs `transform: scale(1.6)` for exactly this reason. `cover` surfaces
(shop grid, PDP) need nothing.
**`p3` BPC-157 & TB-500 still uses the old `product-1-new.jpeg`** — there is no BPC/TB carton in
the supplied set, and the other boxes are different compounds, so it was left rather than
mislabelled. It is visibly the odd one out in the shop grid until a real render exists.

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

- **Shop listing became a real collection page** (2026-10-20): category chips, search, sort,
  live count and an empty state, on top of the grid that was already there.
  - **Category is a route, search and sort are view state.** The chips link to
    `#/shop?research=<id>` — the filter that already existed — so a filtered view stays
    linkable; only search and sort live in the component. The five chips are the real
    `researchAreas`, so every one resolves.
  - **Sorts read fields the catalogue actually carries**: price both ways, name, and
    highest verified purity. Lots without a published analysis sort **last** rather than
    being given a placeholder figure. There is no review, date or stock field, so no sort
    pretends otherwise.
  - **Search covers name, summary, sector and the shelf specs** — what a buyer would type
    ("retatrutide", "40 mg"). Verified: 2 results for "retatrutide", empty state for a
    miss, and the count is `aria-live` so it is announced.
  - **Switching category clears the search.** The component is not remounted on a category
    change (only its `research` prop changes), so a live search leaked across and showed
    "no products" for a category that has them. Reset happens **during render**, not in an
    effect — the project lints `set-state-in-effect`, and that is React's documented
    pattern for adjusting state when a prop changes.
  - `.shop-page__controls` carries `min-width: min(100%, 34rem)` so search + sort drop to
    their own full-width row together instead of squeezing into the gap beside the chips
    and stacking vertically. ≤767px the chips become an edge-to-edge scroll rail.
  - Verified at 320 / 375 / 768 / 1024 / 1440 / 1920: 0 horizontal overflow, 6 chips and 6
    cards at every width, and quick-add writes `[{"id":"p1","qty":1}]` to the real cart.

- **Full commerce flow** — catalogue, PDP, cart, checkout, promo codes, payments
  (Klyme / AabanPay / manual capture), order tracking, accounts, affiliate, newsletter
- **Home page** — all sections listed above
- **Research areas** (`data/research.ts`) — 5 areas, each linking to a filtered
  `#/shop?research=<id>`; `ShopPage` accepts a `research` prop. The home-page
  `ResearchAreas` section that surfaced them was removed; the nav panel and shop filter remain,
  and the `Research` nav item's direct href is now `#/shop` (was the dead `#research` anchor).
- **Header redesign (functionally complete).** Note the bar was stripped back on 2026-10-15 —
  see "What the bar carries" under KEY COMPONENTS. The list below is the state it was *designed*
  to, kept because the dropdown/drawer behaviour it describes is all still live:
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
- **About banner replaced** (2026-10-12) — `about/hero-lattice.webp` (1344×752, 53 KB), an
  abstract node-and-filament network in cyan/indigo/violet on near-black, generated with the
  recipe above. It supersedes the vials-and-microscope shot: `about/hero.webp` is still on disk
  but **no longer imported**. Intrinsic `width`/`height` in `AboutPage.tsx` were corrected to
  1344×752 (they said 1600×1067, which was never this image's ratio).
- **Lab proof rebuilt to the reference layout** (2026-10-12) — three bands (attribute strip ·
  3D render + method rows + pill CTA · cream lot-carousel band), detailed under KEY COMPONENTS.
  New asset `src/assets/science/molecule.webp` (1024², 37 KB) generated with the Higgsfield
  recipe; it replaced the canvas peptide chain.
- **Lab proof feature band redesigned** (2026-10-12) — transport controls, compound table, SVG
  purity dial and a thumbnail lot selector replaced the sparse three-column band and its five
  anonymous progress bars. Verified at 1440 / 900 / 375: `tsc -b` clean, build passes, ESLint 9,
  0 console errors, 0 overflow at every width, pause toggles `animationPlayState`, prev/next
  and arrow keys move selection and focus, and the title stays in sync with the active lot.
- **Lab proof home section** (`LabProof.tsx`) — component, `proofCopy` in `data/science.ts`,
  `.proof__*` CSS (458 lines at the end of `portfolio.css`, incl. 991/767/480 breakpoints), and
  mounted in `App.tsx` between `Projects` and `WhyUs`. Described under KEY COMPONENTS above.
- **Home section pass (2026-10-16).** Three changes in one sitting, all on request:
  `ProductOffer` (2nd section) and `LotPanel` (3rd) **unmounted** — components and CSS kept in
  the tree; `ProductRange` **rebuilt** from a burgundy marquee to a white best-sellers rail with
  pagers; and a new **`ProductSpotlight`** mounted as the 3rd section. All three are described
  under KEY COMPONENTS.
  Two later passes the same day added the spotlight's **detail tiles, grounding shadow and
  entrance/scrub motion**, then **revised the whole band to a client mockup** (sand ground,
  line art, rule-flanked head, icon chips with leader lines, selectable detail gallery) — all
  documented under its KEY COMPONENTS entry.
  Verified at 1920 / 1440 / 1280 / 991 / 767 / 480 / 375: `tsc -b` clean, `npm run build`
  passes, ESLint still exactly **9**, console **0 errors**, and **0 horizontal overflow at
  every width**. Paging verified end to end — the forward pager reaches the last card and
  disables, the back pager enables with it.
  Later the same day two more bands were added — **`ProofBento`** and **`CompoundCollage`**,
  both documented under KEY COMPONENTS.
  **That 52 is stale as of the last pass of 2026-10-16** — `WhyUs` and `ProofBento` came out
  and `ProductFeature` went in, and the count was not re-measured. Measure before treating any
  number as the baseline; console **errors** were re-confirmed at 0.
  **The reduced-motion GSAP warning baseline moved 28 → 36 → 44 → 52** as the spotlight, bento
  and collage timelines were added (8 per band); same pre-existing "Invalid scope" class, still
  0 errors. Treat **52** as the home baseline now.
- **Science page redesigns — all reverted (2026-10-12).** Two separate rebuilds of sections
  01/02 were attempted against a supplement-site reference (first an attribute strip + icon
  method rows + cream featured-lot band; then a light tabs band + dark feature band in
  `ScienceShowcase.tsx`). **Both were reverted on request.** `SciencePage.tsx` is back to
  `HEAD` exactly, and `science.ts` / `portfolio.css` are back to `HEAD` plus only the
  LabProof append. None of `.scix__*`, `.science__attrs`, `.science__lot*`, `scienceTabs`,
  `featureLot` or `ScienceShowcase.tsx` exists any more — do not reinstate them.
  Note the `scroll-margin-top` fix went with them: **section headings are clipped behind the
  sticky rail again** on rail clicks and `?s=` deep links. That is the original behaviour, left
  as-is deliberately; see Known issues.

### Bugs found and fixed

- **⚠ A hard load of any non-home route rendered a blank page** (introduced and fixed
  2026-10-20). The route-change effect in `App.tsx` called `ScrollTrigger.refresh()`
  inline. On a direct load of `#/shop`, `#/product/<id>`, `#/cart` or `#/checkout` the
  home view mounts **hidden** and its ~15 bands are still creating their triggers; the
  refresh measures one of them and throws `Cannot read properties of undefined (reading
  'end')` from inside ScrollTrigger. Nothing caught it, React unmounted, `#root` ended up
  with **0 children**. Soft navigation was unaffected, which is why it survived the first
  pass — **test routes with a hard reload, not just by clicking through**.
  Fixed with `safeRefreshScrollTriggers()` in `lib/motion.ts`: two frames of delay so the
  mount cascade finishes creating its triggers before anything measures them, plus a
  `try/catch`, because a stale scroll measurement is cosmetic and a blank storefront is
  not. The `document.fonts.ready` refresh in `useSmoothScroll` takes the same guard — it
  can land mid-mount too. Verified: all 8 routes hard-load with 0 page errors.

- **Dropdowns opened on their own when the pointer crossed the middle of the page**
  (fixed 2026-10-17). `.mega` is set to `display: block` inside the `@media (min-width: 992px)`
  block, which **outranks the UA's `[hidden] { display: none }`** — so all three closed panels
  stayed laid out under their triggers, invisible at `opacity: 0` but fully hit-testable (Shop's
  is 368x570, hanging over the centre of a 1440x900 viewport). Entering that box fired the
  trigger `<li>`'s `onMouseEnter` and the menu opened; the closed panels' links were also still
  in the tab order and the a11y tree. Fixed with one rule, `.mega[hidden] { display: none }`.
  **This is the third instance of the same trap** — see `.mobnav__drawer[hidden]` and
  `.report__detail[hidden]`. Any element toggled with the `hidden` attribute whose class also
  sets `display` needs the matching `[hidden]` rule.
  (Side effect: the 0.2s closing fade in `MegaMenu.tsx` no longer renders, because React sets
  `hidden` on the same commit. The open animation is unaffected.)

### Bugs found and fixed during the header work

- `MobileNav` passed `inert=""` as a string — React 19 takes a real boolean (`inert={!open}`)
- `.mobnav__drawer { display: grid }` outranked the UA `[hidden] { display:none }`, so collapsed
  accordions stayed laid out and keyboard-reachable behind `aria-expanded="false"`
- At 320px the header row overflowed and clipped the cart/menu buttons off-screen
- Stale `@media (max-width:1199px)` rules targeted a removed mega structure

### In progress / pending

No task is mid-flight. The reviews-rail rebuild that used to sit here was **reverted on
request** — `Testimonials.tsx` and its CSS are back to the committed marquee, and nothing
is left half-built.

Pending items, none of them started:

- **→ CURRENT TASK: add TESAMORELIN 20mg as a catalogue product.** Requested 2026-10-15 to
  replace BPC-157 & TB-500 in the home grid. **Blocked on two facts the client is sending**, and
  neither may be invented:
  1. **Price.** `projects` has no entry for it, and `.range__price` renders `formatUsd(p.price)`
     — a guessed price on a live storefront is a real-money error.
  2. **Janoshik report** — purity, batch number, compound breakdown, and the scan for
     `labAnalysis.reportImages`. `.range__purity` is already conditional, so the card renders
     without a badge until this lands; do **not** fill it with a placeholder figure.

  Ready and waiting: `src/assets/products/tesamorelin-20mg.webp` (900×1130, alpha — converted
  from `latest-images/tesamorelin.png`, matching the five siblings exactly). The specs legible
  on the carton are pre-filled pen, 20mg total, 10 doses of 2mg, store 2–8°C, subcutaneous
  injection — those are readable facts, not invented ones, so they can go straight into `specs`.
  Copy must follow `safetyProtocol` on every other lot: research use only.
- **BPC-157 & TB-500 (`p3`) is hidden from the home grid only** (`HIDDEN_IDS` in
  `ProductRange.tsx`). It is still in `projects`, still routable, still on `#/shop` and still in
  three `researchAreas.productIds`. Confirmed as the intended scope — full delisting was offered
  and declined, because deleting the entry strands the id in any saved `liora.cart.v1` cart.

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
- `src/assets/about/hero.webp` is now **unreferenced** (superseded by `hero-lattice.webp`);
  kept rather than deleted so the old banner can be restored, but safe to remove on request
- **Nothing in the working tree is committed yet.** Still on `main`, last commit
  `f636414 ui changes`. The **2026-10-19** pass rebuilt the **lot band** to a new client
  reference (see its KEY COMPONENTS entry) and touched four files:
  `src/components/LotFan.tsx` (rewritten), `src/data/site.ts` (`lotFanCopy` reshaped),
  `src/styles/portfolio.css` (the `.lotfan__*` block replaced, 386 → ~300 lines) and
  `src/index.css` (+`@fontsource/roboto/500`). Verified at 1440 / 991 / 375: `tsc -b` clean,
  `npm run build` passes, ESLint still exactly **9**, 0 console errors, 0 horizontal overflow,
  and both scrubs measured live (ghost drift −19.9 → +13.9px, box `rotateY` increasing, the
  statement filling word by word).
  **A second 2026-10-19 pass** took the band closer to that same reference and rebuilt the
  pack's 3D ("product like 3D animation with better look") — four built faces, a sheen on the
  rotation's own tween, a grounding ellipse, an idle bob, the mark re-centred behind the
  carton, a taller stage and a larger statement. It touched `src/components/LotFan.tsx` and
  the `.lotfan__*` block in `src/styles/portfolio.css` only — **no data, asset or copy change,
  so every compliance note on this band is untouched**. Verified at 1440 / 991 / 375: `tsc -b`
  clean, `npm run build` passes, ESLint still exactly **9**, 0 console errors, 0 horizontal
  overflow at all three, the turn measured live through the band (`rotateY` −18.8° → +20.3°,
  sheen 106% → −11%, no residual roll) and the reduced-motion resting state measured as
  CSS-only. Everything below predates it. The **last pass of 2026-10-16** (three requests in one sitting:
  unmount `WhyUs`, rebuild then unmount `ProofBento`, add `ProductFeature`) touched
  `src/App.tsx` (two more unmounts, one new mount), `src/components/ProofBento.tsx`
  (rewritten to the numbered-tile reference, then unmounted mid-pass — see its entry; it is
  **not finished**), `src/data/site.ts` (`bentoCopy` reshaped, `featureCopy` added) and
  `src/styles/portfolio.css` (`.bento__*` block replaced, `.feature__*` appended), and added
  `src/components/ProductFeature.tsx`. Verified: `tsc -b` clean, `npm run build` passes,
  ESLint still exactly **9**, 0 console errors, and the feature band checked at
  1440 / 991 / 375 with its stepper and add-to-cart exercised end to end.
  Everything below predates it. The earlier **2026-10-16** pass touched `src/App.tsx`
  (two unmounts, one new mount), `src/components/ProductRange.tsx` (rewritten), `src/data/site.ts` (+`spotlightCopy`)
  and `src/styles/portfolio.css` (`.range__*` block replaced, `.spotlight__*` appended), and
  added `src/components/ProofBento.tsx`, `src/components/CompoundCollage.tsx` and
  `src/assets/bento/quote-ground.webp`, plus
  `src/components/ProductSpotlight.tsx` and four files in `src/assets/spotlight/`
  (`product-info.webp` plus the three `detail-*.webp` tiles), all converted/cropped from the
  client drop `src/assets/latest-images/product-info.png` (already in the tree, untracked). Note `ProductRange.tsx` is itself still untracked — it was added on 10-15
  and never committed. Everything below predates this pass. The hero pass of **2026-10-15** (take the band to the reference exactly:
  green panel, two rounded cards, taller band, client's MOTS-C cut-out on the right) touched
  `src/components/Hero.tsx` (cut-out + wordmark in `.hero__frame`, motion moved onto that frame),
  `src/index.css` (`--brand-green*` / `--brand-lime*`), `src/styles/portfolio.css` (hero block)
  and added `src/assets/hero/{figure,stage}.webp` plus the client drop
  `src/assets/latest-images/hero-withoutbg.png`.
  A second pass the same day **stripped the bar**: `Navbar.tsx` (CTA, search control,
  `searchOpen`, the `NavSearch` mount and the now-unused `useMagnetic` import all removed;
  `is-transparent` no longer broken by an open panel), `MobileNav.tsx` (drawer CTA removed), and
  `portfolio.css` (the `.nav__cta`, `.nav__search-btn` and `.mobnav__cta` blocks deleted,
  `.nav__toggle` now desktop-hidden, `.nav__row` given a corner-hugging `padding-right`).
  A third pass set the bar's **typography and alignment** to a second reference capture:
  `package.json` (+`@fontsource/playfair-display`), `src/index.css` (`--font-serif`,
  `--hero-inset` and new `--gutter` / `--hero-pad-y` hoisted to `:root`) and `portfolio.css`
  (serif wordmark, lighter/smaller nav links, `.nav__row` aligned to the hero instead of
  `.container`, `--hero-pad-y` on `.hero` + the matching transparent-state `padding-top`).
  Verified at 1920 / 1440 / 1280 / 1024 / 991 / 375: `tsc -b` clean, `npm run build` passes,
  ESLint still exactly 9, 0 console errors, 0 horizontal overflow, and the bar/headline left
  edges measure identical at every width.
  The hero rebuild of 2026-10-14 before it touched only four tracked files —
  `src/components/Hero.tsx` (rewritten), `src/data/site.ts` (`heroCopy` reshaped),
  `src/index.css` (`--brand-*` added) and `src/styles/portfolio.css` (hero block replaced, nav
  token re-point + reference header treatment, `.nav__cart` / `.nav__account` de-duplicated,
  scroll-progress fill, `.is-light-surface` cursor, catalogue top shadow, sticky-hero rule
  removed) — plus new `src/assets/hero/*.webp`. Everything else listed below predates it:
  `src/App.tsx` (+LabProof mount), `src/components/Testimonials.tsx` (rewritten),
  `src/components/SciencePage.tsx` (01+02 rebuild), `src/data/science.ts` (+`proofCopy`,
  `lotAttributes`, `featuredLot`), and untracked `src/components/LabProof.tsx`.
  Untracked `.playwright-mcp/*.yml` are scratch.

- **The brand name is unresolved.** `site.brandMark`/`brandSub` still render **Lyfe / Health**,
  but the last two briefs both called the business **LIORA Healthcare**. The hero deliberately
  prints no brand name, so the question is confined to `data/site.ts` and the header — ask
  before renaming, and note the `liora.*` localStorage keys are a separate decision (see the
  rebrand table).

### Known issues (pre-existing, out of scope unless asked)

- **9 ESLint errors**, all pre-existing and unrelated to the header:
  `react-refresh/only-export-components` in `useAuth/useCart/useRouter`, and
  `react-hooks/set-state-in-effect` in `useAuth`, `LoginPage`, `PaymentCapturePage`, `ProductDetail`.
  Treat 9 as the baseline — only worry if the count rises. **Re-verified 2026-10-12** (still
  exactly 9 with `LabProof.tsx` and the rewritten `Testimonials.tsx` in the tree — neither added
  any), so there is no need to run `npm run lint` just to re-establish this.
- **~90 GSAP `Invalid scope` console warnings** on load. Verified *not* caused by the header.
  Warnings only; console **errors** are 0.
- `portfolio.css` is ~7.7k lines; always grep for a selector before adding a new one.
- **Science section headings sit under the sticky rail.** Rail clicks and `?s=` deep links call
  `scrollIntoView({block:"start"})`, which parks the section at the viewport top — behind the
  ~58px header and the ~50px rail, hiding the block number and clipping the headline. A
  one-line `.science__block { scroll-margin-top: 7.5rem }` fixes it; it was added once and then
  reverted along with a wider redesign, so it is **not** in the codebase. Pre-existing, left
  alone unless asked.

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
- Do not generate long explanations or reports unless asked. Summarize what changed and in which
  files, and stop.
- **Never edit source files with PowerShell `Get-Content`/`Set-Content`.** PS 5.1 reads with the
  ANSI codepage, so every non-ASCII character (em dashes, `→`, `×`, `–`) is destroyed and a BOM
  is added — it cost a full repair pass on `portfolio.css` once. Use the Edit/Write tools, or
  `node -e` with explicit `'utf8'`, for any scripted edit.
- Avoid redundant terminal commands, duplicate searches and repeated dependency checks. Baselines
  already recorded here (ESLint = 9, GSAP warnings, breakpoints) do not need re-measuring.
- Never claim a task is complete without checking the implementation actually exists — the reviews
  rail is the cautionary example: the JSX was written and the CSS was not, and the section looked
  "done" in the file list.
- If the stopping point is unclear, inspect the smallest relevant set of files and state the
  uncertainty rather than guessing.

---

## RESUME WORKFLOW

When the instruction is "continue", "resume", or "continue from where I stopped":

1. Read this file — in particular **CURRENT PROJECT STATUS → In progress / pending**, where the
   current task is marked `→ CURRENT TASK`.
2. Run `git status` / `git diff --stat` to confirm the tree still matches the uncommitted-files
   list recorded under In progress. If it does, trust this file and do not re-inspect.
3. Open only the files the current task names, then continue from the stated next action.
4. Do not restart finished work or re-audit the site. **DO NOT REPEAT** below lists what is
   already settled.
5. When the task is finished and verified, update In progress / pending: move the item into
   Completed and promote the next item to `→ CURRENT TASK`.

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
| Reviews / testimonials (`#reviews`) | `components/Testimonials.tsx`, `portfolio.css` (`.testimonials*` / `.marquee` / `.testimonial*` ~1743) |
| FAQ (`#faq`) | `components/FAQ.tsx`, `faqCopy` + `faqItems` in `data/site.ts`, `portfolio.css` (`.faq__*` ~2736), `assets/faq/` |
| Lab proof home section | `components/LabProof.tsx`, `proofCopy` in `data/science.ts`, `portfolio.css` (`.proof__*`, end of file) |
| Home shop band / products | `components/Catalogue.tsx`, `catalogueCopy` in `data/site.ts`, `shopImage` in `data/research.ts`, `portfolio.css` (`.catalog__*`, end of file) |
| Product showcase (under the hero) | `components/ProductShowcase.tsx`, `showcaseCopy` in `data/site.ts`, `portfolio.css` (`.showcase__*`, end of file), `assets/showcase/` |
| Product spotlight (3rd section) | `components/ProductSpotlight.tsx`, `spotlightCopy` in `data/site.ts`, `portfolio.css` (`.spotlight__*`, end of file), `assets/spotlight/` |
| Our science band | `components/ScienceBand.tsx`, `sciBandCopy` in `data/site.ts`, `portfolio.css` (`.sciband__*`, end of file), `assets/sciband/` |
| Plinth band | `components/ProductPlinth.tsx`, `plinthCopy` in `data/site.ts`, `portfolio.css` (`.plinth__*`, end of file) |
| Confidence band (6 features + film) | `components/ConfidenceBand.tsx`, `confidenceCopy` in `data/site.ts`, `portfolio.css` (`.confidence__*`, end of file), `assets/confidence/` |
| Drift band (statement + floating tiles) | `components/DriftBand.tsx`, `driftCopy` in `data/site.ts`, `portfolio.css` (`.drift__*`, end of file), `assets/drift/` |
| Documentation band (hand + pack) | `components/DocBand.tsx`, `docBandCopy` in `data/site.ts`, `portfolio.css` (`.docband__*`, end of file), `assets/docband/` |
| Lot offer band ("Inside the lot") | `components/LotOffer.tsx`, `lotOfferCopy` in `data/site.ts`, `portfolio.css` (`.lotoffer__*`, end of file) |
| Lot band (unmounted) | `components/LotFan.tsx`, `lotFanCopy` in `data/site.ts`, `portfolio.css` (`.lotfan__*`, end of file) |
| Why choose us (`#why-us`) | `components/WhyChoose.tsx`, `whyChooseCopy` + `whyUs` in `data/site.ts`, `portfolio.css` (`.whychoose__*`, end of file) |
| About band (under the hero) | `components/AboutBand.tsx`, `aboutBandCopy` in `data/site.ts`, `portfolio.css` (`.aboutband__*`, end of file) |
| Campaign band | `components/Campaign.tsx`, `campaignCopy` in `data/site.ts`, `portfolio.css` (`.campaign__*`, end of file), `assets/campaign/` |
| Featured lot (price + add to cart) | `components/ProductFeature.tsx`, `featureCopy` in `data/site.ts`, `portfolio.css` (`.feature__*`, end of file), `assets/feature/` |
| Proof bento (unmounted) | `components/ProofBento.tsx`, `bentoCopy` in `data/site.ts`, `portfolio.css` (`.bento__*`), `assets/bento/` |
| Compound collage | `components/CompoundCollage.tsx`, `collageCopy` in `data/site.ts`, `portfolio.css` (`.collage__*`, end of file) |
| Product range / home grid (`#work`) | `components/ProductRange.tsx`, `rangeCopy` in `data/site.ts`, `portfolio.css` (`.range__*`) |
| A home section | the matching `components/<Section>.tsx` + its block in `portfolio.css` |
| Shop listing / filter / sort / search | `components/ShopPage.tsx`, `researchAreas` in `data/research.ts`, `portfolio.css` (`.shop-page__*`) |
| Announcement bar | `components/AnnouncementBar.tsx`, `announcementCopy` in `data/site.ts`, `--announce-h` in `index.css`, `portfolio.css` (`.announce__*`) |
| Shop by category (home) | `components/ShopCategories.tsx`, `categoryCopy` in `data/site.ts`, `researchAreas` in `data/research.ts`, `portfolio.css` (`.cats__*`) |
| Final CTA | `components/FinalCta.tsx`, `finalCtaCopy` in `data/site.ts`, `portfolio.css` (`.finalcta__*`) |
| Routes | `hooks/useRouter.tsx` + `App.tsx` |
| Shared motion / reveals | `lib/motion.ts`, `hooks/useReveal.ts`, `useScrollShift.ts`, `useParallax.ts`, `.anim__*` in `index.css` |
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
