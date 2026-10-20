import productRetatrutide from "../assets/products/retatrutide-20mg.webp";
import productGlow from "../assets/products/glow-70mg.webp";
import productBpcTb from "../assets/product-1-new.jpeg";
import productTirzepatide from "../assets/products/tirzepatide-40mg.webp";
import productNad from "../assets/products/nad-1000mg.webp";
import productRetatrutide40 from "../assets/products/retatrutide-40mg.webp";
import janoshikTirzepatide40 from "../assets/janoshik/tirzepatide-40mg.png";
import janoshikRetatrutide20 from "../assets/janoshik/retatrutide-20mg.png";
import janoshikRetatrutide40 from "../assets/janoshik/retatrutide-40mg.png";
import janoshikGlow70 from "../assets/janoshik/glow-70mg.png";
import janoshikBpcTb500 from "../assets/janoshik/bpc-tb500-40mg.png";
import reta20Pen from "../assets/product-media/reta20-pen.jpg";
import reta20Open from "../assets/product-media/reta20-open.jpg";
import reta20Uv from "../assets/product-media/reta20-uv.jpg";
import reta40Pen from "../assets/product-media/reta40-pen.jpg";
import reta40Open from "../assets/product-media/reta40-open.jpg";
import reta40Uv from "../assets/product-media/reta40-uv.jpg";
import glowPen from "../assets/product-media/glow-pen.jpg";
import glowOpen from "../assets/product-media/glow-open.jpg";
import glowUv from "../assets/product-media/glow-uv.jpg";
import bpcPen from "../assets/product-media/bpc-pen.jpg";
import bpcOpen from "../assets/product-media/bpc-open.jpg";
import bpcUv from "../assets/product-media/bpc-uv.jpg";
import tirzPen from "../assets/product-media/tirz-pen.jpg";
import tirzOpen from "../assets/product-media/tirz-open.jpg";
import tirzUv from "../assets/product-media/tirz-uv.jpg";
import nadPen from "../assets/product-media/nad-pen.jpg";
import nadOpen from "../assets/product-media/nad-open.jpg";
import nadUv from "../assets/product-media/nad-uv.jpg";
import standardPurity from "../assets/standards/purity.webp";
import standardConsistency from "../assets/standards/consistency.webp";
import standardPackaging from "../assets/standards/packaging.webp";
import standardSupport from "../assets/standards/support.webp";
import aboutImg from "../assets/about-seo.webp";
import whyConsistent from "../assets/consistence-seo.webp";
import whyPurity from "../assets/purity-seo.webp";
import whyService from "../assets/service-seo.webp";
import whySupport from "../assets/support-seo.webp";
import review1 from "../assets/review1-seo.webp";
import review2 from "../assets/review-2-seo.webp";
import review3 from "../assets/review3-seo.webp";
import review4 from "../assets/review4-seo.webp";
import review5 from "../assets/review5-seo.webp";
import review6 from "../assets/review6-seo.webp";

export const site = {
  name: "Lyfe Health",
  brandMark: "Lyfe",
  brandSub: "Health",
  aboutImage: aboutImg,
  role: "Research-grade peptide supply",
  location: "Global research supply",
  email: "hello@lyfehealth.com",
  phone: "+1 000 000 0000",
  whatsapp: "https://wa.me/10000000000",
  socials: [
    { label: "WhatsApp", href: "https://wa.me/10000000000" },
    { label: "Instagram", href: "https://instagram.com/lyfehealth" },
    { label: "Email", href: "mailto:hello@lyfehealth.com" },
  ],
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Products", href: "#work" },
    { label: "Why Us", href: "#why-us" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
};

/* The hero is a solid colour panel of type beside a photograph. Everything the
   band shows is real: the packshots along the panel's foot are catalogue
   entries, the faces are the site's own review portraits, and the figure
   beside them is one the About page already publishes. */
export const heroCopy = {
  /* The reference's own headline, set at the client's explicit instruction
     (2026-10-14, asked twice).

     NOTE FOR WHOEVER SIGNS OFF THE COMPLIANCE COPY: this is personal
     health-benefit language on a catalogue whose every product page, footer
     and About block carry "for laboratory research only, not for human or
     veterinary use". The two read against each other. Raised with the client;
     their call.

     Each line is an array of parts. A line with two parts gets the inline
     product disc between them, which is how the reference sets its second
     line. */
  lines: [["Feel better."], ["Live", "stronger."], ["Every day."]],
  lede: "Pre-filled, sealed and cold-packed reference materials — every lot published with its own third-party purity report.",
  cta: { label: "Explore products", href: "#/shop" },
  /* Already published on the About page (`aboutCopy.stats`); not a new claim. */
  proof: { value: "1000+", label: "Researchers served" },
};

export const catalogueCopy = {
  title: "Shop the catalogue",
  lead: "Pre-filled, sealed and lab verified. Pick a category or browse everything.",
  /* Tabs are the research areas themselves — see data/research.ts */
  shopAll: { label: "Shop all", href: "#/shop" },
  tilesTitle: "Shop by category",
};

/* The banner photograph shows the wider ALLUVI range, including compounds this
   catalogue does not stock — so the copy stays about how lots are supplied and
   never implies those specific products are for sale here. */
export const promoCopy = {
  eyebrow: "Sealed · Pre-filled · Documented",
  title: "Research devices, ready to ship",
  text: "Every lot leaves cold-stored in a fixed-volume sealed format, with its third-party purity report published on the product page.",
  primary: { label: "Shop the range", href: "#/shop" },
  secondary: { label: "See lab reports", href: "#/science?s=reports" },
};

/* The product grid under the hero (2026-10-15). It replaced the `Catalogue`
   band, which is still in the tree but no longer mounted.

   No count is written into this copy on purpose — `projects` is the source of
   truth for how many lots there are, and a hard-coded "six" silently goes
   stale the first time one is added. */
export const rangeCopy = {
  index: "02",
  /* Shop-led wording (2026-10-20, requested), in place of "The range / Every
     lot, documented". Deliberately not "Bestsellers": there is no sales data
     to back a ranking claim. */
  eyebrow: "Our products",
  title: "Shop the range",
  lead: "Pre-filled devices — each one sealed, cold-packed and published with its own third-party report.",
  shopAll: { label: "Shop all products", href: "#/shop" },
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
  /* The three marks top right (2026-10-20 rebuild). The reference's read
     "Clean Ingredients · Trusted Quality · Fast & Safe Shipping"; these are
     the three things `promoCopy` and the published reports already evidence. */
  trust: [
    { icon: "lab", lines: ["Third-party", "tested"] },
    { icon: "doc", lines: ["Batch", "documented"] },
    { icon: "cold", lines: ["Cold-packed", "shipping"] },
  ],
  categoriesLabel: "Shop by category",
};

/* The annotated product band (2026-10-16), the 3rd home section. Built to a
   reference that floats chips around a held product — its chips read
   "Moisturizing & Hydrating", "Naturally Beautiful" and the like.

   **Not one of those is sayable here.** They are consumer benefit claims on a
   catalogue whose every product page says "not for human or veterinary use".
   So the band keeps the reference's composition and annotates the carton with
   facts the site already publishes: the lot's real purity and batch from
   `labAnalysis`, its real `specs`, and the receptor pharmacology already in
   `summary`. **The chips are derived from `projects` in the component, not
   written here** — a figure typed into copy goes stale the moment the lot
   does.

   `productId` is the lot in the photograph (`assets/spotlight/product-info.webp`,
   the client's own shot). It is a **stocked catalogue product**, unlike the
   cartons in the hero and the showcase — so this copy may name it. If the
   photograph is ever swapped, change this id with it or the chips will
   describe a different lot than the one on screen. */
export const spotlightCopy = {
  /* The head is two centred lines, the eyebrow flanked by rules — the layout
     the 10-16 mockup asked for. It headed them "ALLUVI HEALTHCARE / TRUSTED
     SCIENCE. REAL RESULTS." and **neither line could ship**:
     - ALLUVI is the manufacturer whose packaging this catalogue carries by
       licensing arrangement. On a carton that is accurate; as a section
       heading it is site voice, and would read as this shop being ALLUVI.
     - "Real results" is an outcome claim — the exact register every product
       page disclaims. The cadence is kept and the claim is not. */
  eyebrow: "Inside the lot",
  productId: "p1",
  title: "Documented. Sealed. Cold-packed.",
  cta: { label: "View this lot", href: "#/product/p1" },
  reportLink: { label: "See the lab reports", href: "#/science?s=reports" },
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
};

/* The numbered supply grid (2026-10-16), mounted under the spotlight.
   **Rebuilt the same day to a second client reference**: a cream panel inset
   on the page, a rule-flanked eyebrow over a two-line heading with a pill CTA
   opposite it, and four numbered tiles — one tall feature tile spanning both
   rows on the left, two beside it and a wide one underneath. Two of the tiles
   carry a packshot.

   **The reference's four tiles are consumer outcome categories** — Energy,
   Focus, Immunity, Recovery, each with a line about what it does for the
   reader ("Support steady, sustained energy for busy days"). Not one of those
   is sayable on a catalogue whose every product page reads "not for human or
   veterinary use". The composition is kept and the tiles are filled from
   `standards` in `data/science.ts` — the same four numbered entries the
   Science page publishes, read in the component so the two cannot drift.

   This replaced the earlier 2x2 bento. Recorded because it is the reason
   three fields are gone from this block and must not be reinstated: that
   version's reference put a woman **ingesting** a tablet in one tile, a
   symptom checklist in another, and a fabricated "50+ Clinicians' Choice"
   endorsement over a fabricated professor's quote in a third. */
export const bentoCopy = {
  eyebrow: "How a lot is supplied",
  title: "Checked, documented, packed",
  /* The reference's "Explore Formulas" pill. Ours points at the real reports
     rather than at a range page that would promise more than it shows. */
  cta: { label: "See the lab reports", href: "#/science?s=reports" },
  note: "Reported by Janoshik Analytical, published as received.",
  shots: {
    feature: "The Retatrutide 20mg research carton, sealed as supplied",
    wide: "The Tirzepatide 40mg research carton, sealed as supplied",
  },
};

/* The featured-lot band (2026-10-16), mounted under the spotlight in the slot
   `ProofBento` vacated. Built to a client reference: a full-bleed split — a
   photograph on the left, a solid colour panel on the right carrying a
   rule-flanked eyebrow, a two-line headline, a lead, three spec chips, the
   price, and a quantity stepper beside an Add to Cart pill.

   **Two things in the reference could not be carried over.**
   - Its headline reads *"Your everyday foundation."* — a personal benefit
     claim, which is the one register this catalogue cannot use: every product
     page, the footer and the About page carry research-use-only disclaimers.
     Ours keeps the cadence (two short lines, a noun phrase) on something the
     site can evidence.
   - Its three chips read *30 Daily Capsules · Plant-Based · Third-Party
     Tested*. The first two describe a consumer supplement; this catalogue has
     no capsules and no formulation claims to make. **The chips are derived
     from the lot in the component, never typed here** — the `Form` and
     `Total content` specs and the real `labAnalysis` purity — so a chip with
     no source is simply dropped.

   Everything shoppable is real: `price` comes from `projects`, the stepper
   adds that quantity to the real cart, and the lead is the lot's own
   `summary`. `productId` is the one thing to change to feature another lot;
   the photograph is product-adjacent (how a lot ships) rather than a shot of
   this specific carton, so it does not have to change with it. */
export const featureCopy = {
  /* Deliberately not `p1` — `ProductSpotlight` sits directly above this band
     and is built around that lot. */
  productId: "p2",
  eyebrow: "Featured lot",
  lines: ["A reference lot,", "fully documented."],
  /* **Names no compound, deliberately.** The client's photograph shows an
     ALLUVI TESAMORELIN carton, which this catalogue does not stock — same
     position as the hero and the showcase, and the same rule applies: nothing
     in this band may describe the carton. See the note in `CLAUDE.md`. */
  photoAlt: "A sealed research carton being placed into a tote bag",
  cta: "Add to cart",
  specLink: "View full specification",
  qtyLabel: "Quantity",
};

/* The "our science" band (2026-10-16). Built to a client reference: a white
   card inset on the page, a rule-flanked eyebrow over a three-line headline,
   a short lead, a 2x2 grid of ticked chips and a filled pill CTA, with the
   product group photograph bleeding off the card's right edge.

   **Two things in the reference could not come across.**
   - Its chips read *Clean Ingredients · No Artificial Colors · Plant-Friendly*
     alongside *Third-Party Tested*. Three of those four describe a consumer
     supplement's formulation; this catalogue sells reference material and
     makes no formulation claims at all. **The chips are built in the component
     from `purityMethod.documentation`** — what every published report actually
     carries — so each one is a fact the Science page already states.
   - Its headline is about how the product is *formulated*. Ours is about how
     the lot is *verified*, which is the only claim this catalogue makes.

   **The photograph shows MOTS-C, CJC-1295 and TESAMORELIN cartons, none of
   which this catalogue stocks** — same position as the hero, the showcase and
   the promo banner. So every word here describes the catalogue and never the
   cartons, and the alt names no compound. */
export const sciBandCopy = {
  eyebrow: "Our science",
  lines: ["Independently tested.", "Published in full."],
  lead: "Analysis is carried out by an outside lab and the report goes up as received — no in-house figures, and nothing rounded on the way.",
  chipsLabel: "Every report carries",
  /* One line under each report field (2026-10-19 rebuild). Keyed by the
     field's label in `purityMethod.documentation`; a field with no note
     renders its title alone. Each says what the field *is* — the reference's
     "accurate composition analysis" overstated mass-spec, which confirms
     identity rather than measuring a composition. */
  chipNotes: {
    "Lot number": "Ties every report to its batch.",
    "HPLC purity": "Measured by an independent lab.",
    "Mass-spec confirmation": "Confirms the compound's identity.",
    "Fill volume": "Checked and documented.",
  } as Record<string, string>,
  cta: { label: "Explore our standards", href: "#/science" },
  /* The quiet line beside the CTA. The reference also stamps an
     *ALLUVI — Research · Quality · Trust* lockup on its photograph; that is
     the manufacturer's name set in site voice, which the spotlight notes
     already rule out, so it is not reproduced. */
  tags: ["Transparency", "Testing", "Traceability"],
  /* The backdrop (latest-images/science-new.png) shows an ALLUVI TESAMORELIN
     pen, which this catalogue does not stock — so the alt names no compound
     and no line here describes the device. */
  photoAlt: "A person holding up a pre-filled pen device",
};

/* The collage band (2026-10-16), mounted under the bento. Built to the
   `loopii-juice-bar.webflow.io` intro section: a two-line heading with the
   first line light and the second bold, three overlapping photo cards at
   different sizes and tilts, and a "Key Ingredients" list bottom right.

   **The reference's list pairs each ingredient with an effect** — "Ashwagandha
   Relieves Stress", "Cordyceps Boosts Energy". That is the exact form this
   catalogue cannot use: it tells a reader what the compound does to a person.
   The row shape is kept and the right-hand half carries the **measured
   concentration** instead, built in the component from every
   `labAnalysis.compounds` entry in `projects` — so the figures are the
   published ones and the list grows by itself when a lot is added.

   The reference also parks a bent drinking straw in the top right as a brand
   prop. There is no equivalent object here, and the two bands above already
   carry molecular line art, so this one has no decorative graphic. */
/* The plinth band (2026-10-17), built to a client screenshot: a centred
   two-line headline over a lead, the product standing on a white plinth, an
   icon feature either side of it, a round link badge overlapping the pack,
   and a foot of three things — a short aside, a small card with a photo and
   a link, and one large figure.

   **The reference is a skincare page and almost none of its copy transfers.**
   Its headline is *"Radiant skin, / Unveiled naturally"* over "modern
   clean-label skincare designed with botanical precision… a daily ritual that
   feels completely transformative", and its features read *Carefully selected
   ingredients* and *Quality-Focused Selection*. Outcome and formulation
   claims, on a catalogue that formulates nothing. The composition is kept and
   every line here is something the site already evidences.

   **The figure is `aboutCopy.stats[1]`, not a review count.** The reference's
   *48k+ real experiences, honest recommendations* is a review-volume claim;
   there is no review data in this project and inventing one is the same
   fabrication the rules exclude everywhere else.

   **The round badge links to the catalogue, not to the pack.** The reference's
   reads *Explore Product* — TESAMORELIN has no product page to send anyone
   to, and a badge that looked like one would be the clearest possible
   implication that the lot is for sale. Same reason there is no price here.
   See the compliance note on `lotFanCopy`; it applies to this band too. */
export const plinthCopy = {
  lines: ["Every lot, documented.", "Nothing taken on trust."],
  lead: "Reference material supplied sealed, cold-packed and pre-filled — each catalogue lot published with the third-party report it was tested against.",
  features: [
    { icon: "lab", title: "Independently tested", note: "Janoshik Analytical" },
    { icon: "seal", title: "Sealed and cold-packed", note: "Every order" },
  ],
  badge: { label: "Explore the range", href: "#/shop" },
  aside: "Pre-filled devices in a fixed-volume format, so the lot you reorder is the lot you opened last time.",
  card: {
    text: "Our standards, the method behind them and every published report sit on one page.",
    link: { label: "Read our standards", href: "#/science" },
    photoAlt: "A sealed research carton and its pre-filled device",
  },
  packAlt: "A sealed research carton",
};

/* The lot offer band (2026-10-19), in the "Inside the lot" slot — it replaced
   `LotFan` there, which is unmounted and kept. Built to a client reference: a
   pale panel carrying the kit at left, and a dark panel at right with a
   headline, the product line and its price, a "first purchase includes" list,
   a total, a full-width CTA and a row of small badges.

   **The reference's list is fabricated commerce and could not ship.** Every
   row carries a struck-through was-price beside the word *Free*, and the total
   advertises a saving. This catalogue has no bonus items, no bundle and no
   discount pricing, so each of those would be an invented figure — the same
   reason `ProductOffer` dropped its 48% OFF disc. The rows here are **what
   actually arrives or is actually published**, read from the lot in the
   component (`packageContents`, `labAnalysis`), each tagged with what it is
   rather than with a price; the total is the lot's real unit price.

   `productId` is `p1` deliberately — it is the lot with the cleanest render,
   it has a Janoshik report, and `ProductFeature` below already sells `p2`. The
   carton shown is that lot's own render, so the band names and prices exactly
   what it pictures. */
export const lotOfferCopy = {
  productId: "p1",
  kicker: "What arrives — one sealed lot",
  eyebrow: "Inside the lot",
  lines: ["Get started with", "a documented lot."],
  lead: "One sealed, pre-filled research device with its third-party report already published. Everything that arrives is listed below, at the price you see.",
  includesLabel: "Every order includes",
  /* Each derived row's tag says what kind of thing it is. */
  tags: { inBox: "In the box", published: "Published", standard: "Standard" },
  dispatch: {
    title: "Cold-stored dispatch",
    note: "Leaves sealed, in a fixed-volume format",
  },
  totalLabel: "Total",
  ctaLabel: "Add to cart",
  badges: ["Research use only", "Third-party tested", "Ships cold-stored"],
  packAlt: "A sealed research carton with its pre-filled device",
};

/* The drift band (2026-10-19), between the science band and "Why choose
   us". Built to a client reference: one centred uppercase statement with
   small tilted photo tiles scattered around it.

   **The reference's statement is a skincare outcome claim** — *"Gentle
   ingredients, powerful skin transformation daily"* — the register every
   product page here disclaims. The cadence is kept (three short uppercase
   lines) and the words are the three things `promoCopy` already says of
   every lot.

   The tiles reuse imagery already in the project: Higgsfield and Magnific
   were both unavailable when this was built, so nothing was generated. Each
   entry is one `import` in `DriftBand.tsx` — swap a file there to replace a
   tile. The body-focused category shots (`metabolic`, `peptide`) were left
   out on purpose: next to a research-use statement they read as outcome
   imagery. */
/* The confidence band (2026-10-19), under the drift band. Built to a client
   reference: a centred tracked heading, three icon features down each side
   and a product film in the middle.

   **The reference's six features are supplement formulation claims** —
   Non-GMO, Vegan, "Engineered for effectiveness … potency and absorption",
   "Quality natural ingredients", "No heavy metals". None of them describes
   reference material, and "no heavy metals" is a test result nobody has
   published here. Only *Third-party tested* survives as written. The other
   five are things the site already evidences: the Janoshik reports, the
   unrounded purity rule, batch numbers, the sealed fixed-volume format,
   cold-stored dispatch, and the research-use-only line on every product. */
export const confidenceCopy = {
  title: "Documented before it ships",
  left: [
    {
      icon: "lab",
      title: "Third-party tested",
      text: "Each documented lot is analysed by Janoshik Analytical, an independent lab.",
    },
    {
      icon: "chart",
      title: "Purity, unrounded",
      text: "The measured HPLC figure goes up exactly as the report gives it.",
    },
    {
      icon: "tag",
      title: "Batch traceable",
      text: "Every report is tied to the batch number of the lot it covers.",
    },
  ],
  right: [
    {
      icon: "seal",
      title: "Sealed & pre-filled",
      text: "Supplied in a fixed-volume sealed format, the same every order.",
    },
    {
      icon: "cold",
      title: "Cold-stored dispatch",
      text: "Lots leave cold-stored at 2–8 °C, packed to hold it in transit.",
    },
    {
      icon: "shield",
      title: "Research use only",
      text: "For laboratory research. Not for human or veterinary use.",
    },
  ],
  /* The centre media's alt. **Names no compound** — the carton in the client
     drop is one this catalogue does not stock, and its printed copy is
     garbled besides; see the compliance note on this band in `CLAUDE.md`.
     `videoLabel` was its predecessor and went with the film it described. */
  mediaAlt: "A customer holding a sealed research carton",
};

/* The offer banner (2026-10-19), built to a client screenshot and mounted
   directly above the FAQ: a full-bleed photographic band with a headline,
   a short lead and a pill CTA on the left, and a translucent panel under them
   carrying three product chips, a price and a line of supporting copy.

   **Three things in the reference could not ship, and two of them are the
   same objection.**
   - It prices its product **"$39.00" against a struck-through "$63"**. There
     is no discount pricing anywhere in `projects` and no was-price to strike
     through, so that figure would be **fabricated commercial data** — the
     exact objection that cut the same device out of `ProductOffer`. The price
     here is the lot's own `price`, formatted from the catalogue, with nothing
     struck through.
   - Its panel line reads **"Buy 2, Save More — Limited Time Bundle Offer!"**.
     There is no bundle system, no multi-pack SKU and no time-limited pricing
     in this project; inventing one on a live storefront is a real-money
     error. The line is a fact about what ships instead.
   - Its headline is *"Boost your health with nature's best!"* over *"Find the
     perfect supplement for your wellness journey"* — consumer wellness, the
     register every product page disclaims.

   `productId` is a **stocked** lot, which is why this band may name it, price
   it and link to it. The chips are three stocked lots too — see `OfferBanner`
   for how they were made. */
export const offerBannerCopy = {
  lines: ["Every lot you order", "arrives documented."],
  lead: "Pre-filled, cold-packed and published with the third-party report its own batch was tested against.",
  cta: { label: "Browse all products", href: "#/shop" },
  /* The lot whose real price the panel shows. */
  productId: "p1",
  priceNote: "From",
  /* Replaces the reference's bundle offer. `promoCopy` already says both
     halves of this, so it is not a new claim. */
  panelLine: "Every order ships sealed in an insulated mailer with a cold pack.",
  chipIds: ["p1", "p2", "p4"],
  bannerAlt: "A customer holding a research carton",
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
};

/* The about-product band (2026-10-19), built to a client screenshot: a small
   centred title over a lead whose words fill on scroll, the product on a tall
   oval stage in the middle, a circular icon and a tinted card down each side
   joined to the centre by hairline braces, and a row of pill chips closing
   the band. Mounted under `ProductRange`.

   **Almost none of the reference's copy could ship.** Its lead is *"Wellness
   begins with clean nutrition. We craft high-quality natural supplements from
   selected ingredients, rigorous testing, and science-backed formulas"* —
   consumer wellness, and it says the shop *formulates* the product, which
   this catalogue does not do. Its two cards are *"Brain & Focus — enhances
   mental clarity, concentration, and cognitive performance"* and *"Daily
   Energy — promotes lasting energy and focus"*: outcome claims of exactly the
   kind every product page here disclaims. Its circle labels (*Non-GMO*,
   *Natural Formula*) and four of its five chips (*100% Natural Ingredients*,
   *No Artificial Additives*, *Science-Backed Formulas*, *Sustainably
   Sourced*) are formulation claims.

   So the composition is kept and **every slot is filled from real data in the
   component**: the four `services` promises supply the two cards and the two
   circle labels, and the five chips are `purityMethod.documentation` — the
   fields every published report actually carries. A chip added there appears
   here by itself. */
export const aboutProductCopy = {
  title: "About the material",
  /* Split to words in the component for the scrubbed fill — the same device
     as `aboutCopy.paragraph` in the about band. Keep it one readable string
     here. Mirrors the reference's cadence on claims the site evidences. */
  lead: "Confidence starts with the paperwork. Every lot is pre-filled to one spec, cold-packed for transit, and published with the third-party report its own batch was tested against.",
  chipsLabel: "On every report",
  stageAlt: "A research carton on a plain stage",
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
};

/* The billboard band (2026-10-19), built to a client screenshot of a
   skincare page: a saturated colour panel with an enormous ghost wordmark
   filling it, a cut-out figure holding the product bottom-anchored over it, a
   frosted glass pill bottom left, a short copy block bottom right, and a 4-up
   card row underneath.

   **The figure is generated-plus-composited, not a client drop.** See
   `CLAUDE.md` for the method: the plate was generated with a *blank white
   box* in her hand and the real carton was composited onto it, because image
   models re-draw printed packaging and reliably garble it. So every pixel of
   the pack is the catalogue's own render.

   **`productId` is a stocked lot**, which is why this band may name it, price
   it and link to it — unlike the hero, science and about bands, which picture
   cartons the catalogue does not carry and are written around them. The
   ghost word is that lot's own name for the same reason.

   The four cards are the lot's **real `specs`**, read in the component, so a
   spec edited on the product data changes the band with it. The reference's
   own four are ingredient and benefit cards ("Cleansing Oil / Deep makeup
   removal"), which is the register every product page here disclaims. */
export const billboardCopy = {
  productId: "p1",
  pillLabel: "Lyfe Health",
  cta: { label: "View this lot", href: "#/product/p1" },
  /* Two short lines under the name, the reference's own shape. Both are
     things the site already publishes — `promoCopy` says the first and the
     lot's `safetyProtocol` says the second. */
  lines: [
    "Supplied sealed and pre-filled, cold-packed at 2–8 °C.",
    "Published with the third-party report its batch was tested against.",
  ],
  figureAlt: "A customer holding a sealed research carton",
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
};

/* The statement band (2026-10-19), built to section 3 of
   `nymphaicosmetics.com`: a saturated colour band carrying one large centred
   statement with an **inline pill that expands open** mid-sentence, a
   two-paragraph block under it whose lines fill from faded to solid on
   scroll, and an enormous ghost word closing the band.

   **The reference's own statement could not ship.** It reads *"Dafne, il
   primo capitolo; pelle che muta con un gesto quotidiano e rifiorisce"* —
   skin that changes and reblooms with a daily gesture — a personal outcome
   claim, and the register every product page here disclaims. The cadence is
   kept (one semicolon-joined sentence over four centred lines) on what the
   site can evidence, and `promoCopy` already says all of it.

   The band's ground is `--brand-primary`, not the reference's slate blue:
   the brief allows one accent plus the rose, and a second saturated colour
   would read as a different brand. */
export const lineStoryCopy = {
  /* **Set as explicit lines, not one wrapped string** (2026-10-19). The oval
     has to sit in the *middle of the second line*, and with `text-wrap:
     balance` doing the breaking it landed wherever the wrap happened to fall
     — at the end of line one. One entry here is one rendered line, the same
     contract `heroCopy.lines` and `faqCopy.title` use.

     Line two is split either side of the oval and the two halves are kept to
     a similar length, which is what actually centres it. */
  /* **No "sealed" anywhere in this band** (requested, 2026-10-19) — not in
     the statement, the paragraphs, the ghost word or the image's alt. The
     other bands still use it; this one says "documented" instead, which the
     published reports evidence just as directly. */
  /* **Line two's halves are deliberately short.** The image opens to ~608px
     in a ~1000px measure, so only about 8 characters fit either side of it on
     the same line — and both halves staying on that line is the whole look
     (the reference sets "con un [image] gesto"). With longer halves the first
     one wrapped to the line above and the image read as a block dropped into
     the paragraph instead of a word in the sentence. */
  lineOne: "One lot, one record; material",
  before: "that",
  after: "arrives",
  lineThree: "fully documented.",
  /* The expanding image's alt. It is the band's payoff at full width, so it
     carries a real description rather than being decorative. Names no
     compound — the cartons in the still are not identified. */
  pillAlt: "A customer holding a research carton",
  /* Two paragraphs, split to lines in the component so the scrub can fill
     them one line at a time. Keep them as readable strings here. */
  paragraphs: [
    "Every catalogue lot is supplied pre-filled in a fixed-volume format and leaves cold-stored at 2–8 °C, packed to hold that temperature in transit.",
    "Each one is published with the third-party report it was tested against — batch number, measured purity and the compound breakdown — so the lot you reorder is the lot you opened last time.",
  ],
  /* `ghost` is gone (2026-10-19, requested). The band closed on an enormous
     watermark word; with the expanding image as the display element a second
     oversized mark under it competed, so the word and `.linestory__ghost*`
     were both removed. */
};

/* The product reel (2026-10-19), built to section 4 of
   `nymphaicosmetics.com`: a pinned band that steps through three lots one at
   a time — eyebrow, name, price and an EXPLORE link on the left, the carton
   standing over an arch-masked photograph in the middle, a counter top right
   and a thumbnail rail bottom right, with the ground cross-fading per lot.

   **The reference renders its bottles as live Spline 3D scenes.** There is no
   3D model of any carton in this project and generating one would re-draw the
   printed packaging, which the image models reliably garble. The carton is
   the CSS-built box instead — the device `LotFan` introduced — so the product
   still turns in space without inventing artwork.

   `ids` are **stocked catalogue lots**, so this band may name them, price
   them and link to them. Everything shown is read from `projects`: the name,
   the price, the lede and the link all come from the entry. */
export const reelCopy = {
  eyebrow: "The range",
  ids: ["p1", "p2", "p4"],
  explore: "Explore",
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
};

/* The announcement bar (2026-10-20), above the header.
   **There is no offer, discount, free-shipping threshold or guarantee anywhere
   in this project** — no promo system, no shipping rules in the data, nothing
   to advertise. Inventing one on a live storefront is a real-money error, so
   the bar carries a fact the site already evidences and publishes instead:
   every stocked lot links to its own third-party report. Replace this the day
   a real offer is configured, not before. */
export const announcementCopy = {
  message: "Every lot ships with its own third-party lab report.",
  /* The full sentence ellipsises below ~430px in uppercase mono, and the word
     it loses is "third-party" — the only part that carries any weight. This
     keeps that and drops the rest; CSS picks one. */
  messageShort: "Third-party tested, every lot.",
  link: { label: "See the reports", href: "#/science?s=reports" },
  dismissLabel: "Dismiss announcement",
};

/* "Shop by category" on the home view (2026-10-20).
   The five categories are the real `researchAreas`, read in the component —
   their names, descriptions, imagery and product lists all already exist, and
   each one resolves to `#/shop?research=<id>`, a route that works. No category
   is invented to balance the grid. */
export const categoryCopy = {
  eyebrow: "Shop by category",
  title: "Shop by category.",
  lead: "Five ways into the catalogue — every one a live filter on products you can order today.",
  allLabel: "Shop all products",
  allHref: "#/shop",
};

/* The closing shopping band (2026-10-20), between the FAQ and the contact
   band. One headline, one CTA — no claim, no figure, nothing that needs
   evidence. */
export const finalCtaCopy = {
  lines: ["Documented material,", "ready to ship."],
  lead: "Browse the full catalogue — every lot sealed, cold-packed and published with its batch data.",
  primary: { label: "Shop all products", href: "#/shop" },
  secondary: { label: "Read the lab reports", href: "#/science?s=reports" },
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
};

export const driftCopy = {
  lines: ["Sealed lots,", "published reports,", "the same every order."],
  link: { label: "See the lab reports", href: "#/science?s=reports" },
};

/* The documentation band (2026-10-20), built to a client screenshot: a pack
   held large on the left, a chip over a two-line heading with a script accent
   across its second line, a paragraph, a pill CTA, and a row of three labelled
   photo tiles under them.

   **The reference is a soft-drinks page and its copy is all flavour**:
   `PICKED BY NATURE` over "FRESH STARTS WITH FRESH INGREDIENTS / Made With
   Real Fruit", then a paragraph about botanicals and "a refreshingly authentic
   taste from the very first sip", closing on `FIND YOUR FLAVOR`. None of that
   register exists here — this catalogue supplies reference material and makes
   no sensory or outcome claim at all. The composition is kept; every line below
   is something the site already publishes (`purityMethod` in `data/science.ts`
   names the three steps and the lab).

   The three tiles are **`services`, read in the component** — the same shop
   promises the Standards band publishes, with their own images and their own
   links, so a promise edited there changes this band with it. */
export const docBandCopy = {
  chip: "Documented before dispatch",
  lines: ["Every order starts", "with a documented lot."],
  /* Set across the second line in the serif italic, where the reference runs a
     script. It is a claim about paperwork, not about the material. */
  accent: "Published, not promised",
  body:
    "Analysis is carried out by Janoshik Analytical rather than in-house, and the report is published exactly as it was received — lot number, HPLC purity, mass-spec confirmation, fill volume and storage notes. Open it on the product page before you order.",
  cta: { label: "See the lab reports", href: "#/science?s=reports" },
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
  /* The pack is Retatrutide 20mg — a stocked lot — so unlike the hero, science
     and about bands this alt may name it. The hand is a generated plate; the
     carton on it is the catalogue's own render, composited in. */
  packAlt: "A hand holding a sealed Retatrutide 20mg research kit",
};

/* The lot band (2026-10-17), in the 3rd slot. **Rebuilt 2026-10-19 to a new
   client reference**: a cream panel carrying a rule-flanked eyebrow, one long
   centred statement whose words fill from grey to ink, the product at the
   centre over an enormous pale ghost wordmark, and a hairline stat row of four
   figures closing the band.

   **This is the third design in this slot.** The first was an arc of radiating
   wedges; the second ringed six dashed badge medallions around the pack with
   dotted arrows running in. Both are in git, and the pack itself — the CSS
   3D box over the ghost word — carries straight through all three.

   **Two things in the reference could not ship.**
   - Its headline is *"Vitelora brings thoughtfully formulated nutrients into
     simple daily rituals so taking care of yourself feels effortless"* — a
     consumer outcome claim, the register every product page disclaims. Ours
     keeps the cadence (one long sentence, four lines, sentence case) on how
     orders actually ship; `promoCopy` already says all of it.
   - It tumbles **capsules** around the bottle. There are none in this
     catalogue, and strewing pills around a research-only device would
     contradict every product page — the same reason the showcase band's
     surround was rejected. The ghost word carries that space instead.

   **The four stats replace the six badges and carry the same six facts** —
   four printed on the carton, two about how every order ships. The
   reference's read *50K+ happy customers*, *100% natural ingredients*,
   *3rd party lab certified* and *30 days per bottle*: a review-volume claim
   (there is no review data in this project), a formulation claim, and two
   claims this lot cannot evidence.

   **Nothing here may become "batch documented" or a purity figure.**
   TESAMORELIN has no published report — that is exactly the sort of fact
   that would be true of the stocked lots and false of this one. It is also
   why the statement talks about sealing, cold-packing and fill volume and
   never about documentation.

   **COMPLIANCE, open: this band displays an ALLUVI TESAMORELIN carton, which
   the catalogue does not stock** — it is not in `projects`, has no price and
   no Janoshik report. It used to be the only band that also set that name in
   **display type**; since 2026-10-19 the ghost word behind the pack is the
   brand instead, so the band merely pictures the carton, as the hero and the
   science band do. The rest of the guard rails stand: there is **no price, no
   add-to-cart and no link** anywhere in it, every figure is a carton fact
   rather than a claim, and `note` carries the research-use-only line in the
   band. The pack import in `LotFan.tsx` is one line — pointing it at a
   stocked lot is a one-line change if this is ever challenged. */
export const lotFanCopy = {
  eyebrow: "Inside the lot",
  /* One sentence, split to words in the component so the scrub can fill them
     one at a time — the same device as `aboutCopy.paragraph` in the about
     band. Keep it one readable string here. */
  title:
    "Every lot ships sealed, cold-packed and pre-filled to a fixed volume, so what you reorder is exactly what you opened last time.",
  stats: [
    { figure: "20 mg", label: "Total content" },
    { figure: "10 doses", label: "of 2 mg each" },
    { figure: "2–8 °C", label: "Cold-packed storage" },
    { figure: "Pre-filled", label: "Pen, sealed carton" },
  ],
  /* No `name` here any more: the ghost word behind the pack is the **brand**
     (2026-10-19, requested), read straight from `site.brandMark` /
     `brandSub` in the component so it cannot drift from the header. */
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
  packAlt: "A sealed research carton",
};

/* The "why choose us" band (2026-10-17), built to a client reference: a
   two-line headline top left, an enormous pale ghost **WHY** with a smaller
   **CHOOSE US** beside it, a photograph overlapping the ghost word, a stack
   of three packs, and a numbered list of four reasons to its right.

   **The reference's headline is *"ENERGY THAT KEEPS / YOU MOVING"*** — a
   consumer benefit claim, which this catalogue cannot make. Ours is one of
   the shop promises in `services`, which is evidenced: every lot's report is
   published. The ghost words are kept verbatim; they claim nothing.

   **The four rows are `whyUs`, read in the component, not restated here** —
   same numbers and titles as that block already carries, so the list and any
   future `WhyUs` remount cannot drift. The reference numbers its rows 001-004
   and prints a generic benefit beside each; ours prints the real `number` and
   `title`. */
export const whyChooseCopy = {
  lines: ["Tested before", "it ships."],
  ghost: "Why",
  ghostSub: "choose us",
  photoAlt: "A customer outdoors in daylight",
  stackAlt: "Three sealed research cartons stacked",
};

/* The about band under the hero (2026-10-17), built to two client references:
   the *layout* of the first — a tall photograph left, a two-line headline
   right, and under it a small photograph beside a paragraph and a pill CTA —
   and the *text effect* of the second, where the paragraph's words darken
   from grey to ink as the band is scrolled.

   **Neither reference's copy could ship.** The first heads itself *"Created
   With Science. / Made For Your Lifestyle."* over a paragraph about
   "maintaining healthy vision" and "supporting everyday eye wellness"; the
   second is an *"we create gentle, effective skincare that nourishes,
   protects and strengthens your skin"* block closing on "healthy skin is
   always beautiful skin". Both are consumer outcome claims, and the first
   also says the shop formulates the product — this catalogue supplies
   reference material and formulates nothing. The cadence is kept and the
   words are the catalogue's.

   **`paragraph` is not written here.** The band reads `aboutCopy.paragraph`
   in the component, so the home band and the `#/about` page cannot drift —
   editing that one field changes both, deliberately.

   **COMPLIANCE — the two client photographs (2026-10-17) each carry a
   problem, and the copy is written around both.** Nothing in this band
   describes either picture; the alts name no compound and no outcome.
   - `about1-latest.png` (the tall tile) shows an **ALLUVI TESAMORELIN carton,
     which this catalogue does not stock** — not in `projects`, no price, no
     Janoshik report — and its **benefit strapline is legible** at this size
     (TARGETED BODY FAT · IMPROVE DEFINITION · PRESERVE LEAN MASS), as is
     "For subcutaneous injection only". So no line here may quote the pack,
     and nothing in the band may imply that lot is for sale.
     The drops went `about1.png` -> `about1-new.png` -> `about1-latest.png`
     on 2026-10-17, all the same framing. The first was a **MOTS-C**
     carton whose **printed copy the image model had garbled** ("BOHSI DVOIOI
     /lHPPOVE", "ALLUVI REACTHCARE", "A0mg"). The new drop's pack text is
     clean and correct, which closes that one.
   - `about2.jpeg` (the inset) is the **health-outcome orb chain** — energy,
     waistline, brain, joint, immunity, skin. Consumer benefit imagery on a
     laboratory-use-only catalogue, and the same artwork `showcase.webp` was
     dropped for on 2026-10-15 and the FAQ band still carries. Client-chosen
     each time. */
export const aboutBandCopy = {
  eyebrow: "About us",
  lines: ["Characterised in the lab.", "Packed for the bench."],
  cta: { label: "Learn more", href: "#/about" },
  /* Describe the frame, never the pack or an outcome — see the note above. */
  tallAlt: "A customer holding a sealed research carton",
  insetAlt: "A customer at home",
};

/* The campaign band (2026-10-17), built to a client reference: a very large
   two-word headline over the open half of the band and a white technical spec
   card. Built twice the same day — first as a full-bleed rooftop photograph
   with the carton composited into a generated hand, then **rebuilt as a
   split** on request: the headline on a burgundy gradient on the left, the
   client's cut-out figure (`latest-images/bg-img-new.png`) on the right.

   **Three things in the reference could not come across.**
   - Its headline is *"FULL POWER"* over a drink can — a consumer benefit
     claim, the one register this catalogue cannot use. Ours is the site's own
     positioning line, which is the opposite claim: it says what the material
     is *for*. On a lifestyle frame that correction is the point, which is
     also why `note` carries the research-use-only line in the band itself
     rather than leaving it to the product pages.
   - Its spec card is a dimensioned drawing — *13cm*, *8cm*. **We do not know
     the carton's physical dimensions and will not invent them**, so the
     card's callouts carry facts legible on the carton instead. The drawing's
     form (line art, leader lines, tick ends) is kept; only the quantities
     change.
   - Its product is a branded can. The pack here is the client's own frame of
     an ALLUVI TESAMORELIN carton. **Its printed small print is garbled** —
     that drop is itself a generated image, and image models re-draw packaging
     copy — so nothing in this band may quote the pack, and it must not be
     reused anywhere the carton renders large. See the note in `CLAUDE.md`.

   **Every value in `spec` is readable off the carton face** — pre-filled pen
   in the window, `20mg`, `10 doses of 2 mg`, `Store in a refrigerator
   (2°C to 8°C)`. Nothing here is a purity, a batch or a price: TESAMORELIN is
   not in `projects` and has no published report, so the band may not imply
   one. The carton's own benefit strapline and its injection line are
   deliberately not echoed in any of this copy. */
export const campaignCopy = {
  lines: ["Research", "grade"],
  note: "Supplied strictly for laboratory research. Not for human or veterinary use.",
  /* Names no compound: the pack is legible in the frame, but the alt
     describes the picture, not the product. */
  photoAlt: "A person outdoors on a rooftop holding a sealed research carton",
  spec: {
    label: "Pre-filled pen",
    side: "20 mg total",
    base: "10 doses of 2 mg",
    foot: "Store 2–8 °C",
  },
};

export const collageCopy = {
  headingLight: "Only verified material &",
  headingBold: "nothing left undocumented",
  listTitle: "Key compounds",
  note: "Concentrations as measured by Janoshik Analytical across the catalogue.",
};

/* The quiet strip immediately under the hero, in the position a storefront
   usually fills with partner logos.

   **These are credentials, not logos, and that is deliberate.** There are no
   partner or certification marks to show: the only genuinely named third party
   in the whole project is Janoshik Analytical, the lab behind `scienceReports`.
   Drawing logo-shaped marks for the rest would read as endorsements the site
   cannot evidence — exactly what the "never fabricate certifications" rule
   exists to stop. So each entry is an icon plus a fact the site already backs
   up elsewhere, and only Janoshik is named. Don't add a mark here without a
   real relationship behind it. */
export const trustBar = [
  { icon: "lab", label: "Janoshik Analytical", note: "Independent lab" },
  { icon: "wave", label: "HPLC + mass spec", note: "Every batch" },
  { icon: "seal", label: "Sealed & cold-packed", note: "Fixed volume" },
  { icon: "doc", label: "Batch documented", note: "Published in full" },
  { icon: "truck", label: "Tracked delivery", note: "Worldwide" },
  { icon: "shield", label: "Research use only", note: "Not for human use" },
];

/* The band directly under the hero — one device shown large with three claims
   around it. Every figure is one the site already publishes: `aboutCopy.stats`
   for the purity headline, the Janoshik lots in `scienceReports` for the
   third-party line, and `promoCopy` for the supplied format.

   COMPLIANCE: the device pictured is ALLUVI MOTS-C, which this catalogue does
   NOT stock. So nothing here describes that carton — every line is about how
   lots in *this* catalogue are supplied. Same rule as the promo banner, and
   the reason there is no product name or dosage anywhere in this copy. */
export const showcaseCopy = {
  index: "01",
  eyebrow: "What's inside matters",
  cards: [
    {
      value: "99%+",
      title: "Published purity",
      text: "Every lot carries its own assay — the measured figure, never a rounded one.",
    },
    {
      value: "3rd party",
      title: "Independently tested",
      text: "Janoshik analysis on each batch, published in full on the product page.",
    },
    {
      value: "Sealed",
      title: "Fixed-volume format",
      text: "Pre-filled and cold-packed, supplied exactly as it left the facility.",
    },
  ],
};

export const aboutCopy = {
  heading: "Advancing modern research with smarter formulations.",
  paragraph:
    "We're committed to advancing high-quality peptide research through clean, reliable, and precisely characterised reference materials. Every product is sourced from verified suppliers and carefully packed to preserve consistency, purity, and integrity — from our facility to your bench.",
  stats: [
    { value: 99, suffix: "%+", label: "Formulation purity" },
    { value: 1000, suffix: "+", label: "Researchers served" },
    { value: 24, suffix: " h", label: "WhatsApp response" },
  ],
  signals: [
    { label: "Range", value: "Peptides · Reference materials" },
    { label: "Sourcing", value: "Verified suppliers" },
    { label: "Support", value: "Fast WhatsApp" },
  ],
};

/* The shopping experience — ordering, delivery, reordering, support. The
   product promises live in `services`; keep the two from drifting together. */
export const whyUs = [
  {
    number: "01",
    title: "Reorder with confidence",
    description:
      "One spec, one fill volume, one format. What you order next month is what you opened last month.",
    image: whyConsistent,
  },
  {
    number: "02",
    title: "Check the numbers first",
    description:
      "Purity, batch number and compound breakdown sit on the product page — read them before you add to cart.",
    image: whyPurity,
  },
  {
    number: "03",
    title: "Straightforward delivery",
    description:
      "Sealed, cold-packed and tracked from our bench to yours, with the paperwork in the box.",
    image: whyService,
  },
  {
    number: "04",
    title: "Help when you need it",
    description:
      "Message us on WhatsApp about an order, a batch or a document and a real person answers — usually same day.",
    image: whySupport,
  },
];

/* Shop-side promises, not lab process. Each one is still backed by something
   real on the site (the report, the spec, the packing format, WhatsApp). */
export const services = [
  {
    number: "01",
    title: "Tested before it ships",
    description:
      "Every batch goes out with its own third-party purity report — open it on the product page before you buy.",
    image: standardPurity,
    link: { label: "See a report", href: "#/science?s=reports" },
  },
  {
    number: "02",
    title: "The same every order",
    description:
      "Fixed-volume, pre-filled devices made to one spec, so a reorder matches what you had last time.",
    image: standardConsistency,
    link: { label: "Browse the range", href: "#/shop" },
  },
  {
    number: "03",
    title: "Sealed and cold-packed",
    description:
      "Shipped sealed in an insulated mailer with a cold pack, so it arrives in the condition it left in.",
    image: standardPackaging,
    link: { label: "How orders ship", href: "#faq" },
  },
  {
    number: "04",
    title: "A real person on WhatsApp",
    description:
      "Questions about an order, a batch or a document? Message us and you'll get an answer, usually same day.",
    image: standardSupport,
    link: { label: "Message us", href: "#contact" },
  },
];

export const projects = [
  {
    id: "p1",
    title: "Retatrutide 20mg",
    sector: "Metabolic",
    year: "USD 350",
    price: 350,
    summary:
      "Triple-agonist of GLP-1, GIP and glucagon receptors. One pre-filled pen, 20 mg total, sealed and cold-packed.",
    description:
      "A 20mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    safetyProtocol:
      "Produced for laboratory research only. Not for human or veterinary consumption.",
    accent: "#ffeec8",
    image: productRetatrutide,
    subImages: [productRetatrutide, reta20Pen, reta20Open, reta20Uv],
    specs: [
      { label: "Purity", value: "≥99% HPLC" },
      { label: "Form", value: "Pre-filled pen" },
      { label: "Total content", value: "20 mg total" },
      { label: "Storage", value: "2–8°C, do not freeze" },
    ],
    labAnalysis: {
      lab: "Janoshik Analytical",
      batchNumber: "AR1721TRT",
      fillVolume: "2.4 mL",
      purity: "99.21%",
      compounds: [
        { name: "Retatrutide", concentration: "9.57 mg/mL", verified: "22.96 mg" },
      ],
      reportUrl: "#janoshik-retatrutide-20mg",
      reportImages: [janoshikRetatrutide20],
    },
    packageContents: [
      "Pre-filled Research pen (20mg Retatrutide)",
      "Research information sheet",
    ],
    storageLogic: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    id: "p2",
    title: "Glow 70mg",
    sector: "Cellular",
    year: "USD 329",
    price: 329,
    summary:
      "GHK-Cu paired with BPC-157 and TB-500 in one blend. Two pre-filled pens, 35 mg each.",
    description:
      "A 70mg Glow formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    safetyProtocol:
      "Produced for laboratory research only. Not for human or veterinary consumption.",
    accent: "#c9d8ff",
    image: productGlow,
    subImages: [productGlow, glowPen, glowOpen, glowUv],
    specs: [
      { label: "Purity", value: "≥98% HPLC" },
      { label: "Form", value: "Pre-filled pens" },
      { label: "Total content", value: "2 × 35 mg pens" },
      { label: "Storage", value: "2–8°C, do not freeze" },
    ],
    labAnalysis: {
      lab: "Janoshik Analytical",
      batchNumber: "GL0621XSA",
      fillVolume: "3.4 mL",
      purity: "98.6%",
      compounds: [
        { name: "GHK-Cu", concentration: "7.59 mg/mL", verified: "25.80 mg" },
        { name: "BPC-157", concentration: "2.39 mg/mL", verified: "8.13 mg" },
        { name: "TB-500", concentration: "1.99 mg/mL", verified: "6.76 mg" },
      ],
      reportUrl: "#janoshik-glow-70mg",
      reportImages: [janoshikGlow70],
    },
    packageContents: [
      "2 × Pre-filled Research pens (each contains 5mg BPC-157, 5mg TB-500, 25mg GHK-Cu)",
      "Total contents: 10mg BPC-157, 10mg TB-500, 50mg GHK-Cu",
      "Research information sheet",
    ],
    storageLogic: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    id: "p6",
    title: "Retatrutide 40mg",
    sector: "Metabolic",
    year: "USD 629",
    price: 629,
    summary:
      "Higher-content triple-agonist of GLP-1, GIP and glucagon receptors. One pre-filled pen, 40 mg total.",
    description:
      "A 40mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    safetyProtocol:
      "Produced for laboratory research only. Not for human or veterinary consumption.",
    accent: "#ffe0b8",
    image: productRetatrutide40,
    subImages: [productRetatrutide40, reta40Pen, reta40Open, reta40Uv],
    specs: [
      { label: "Purity", value: "≥99% HPLC" },
      { label: "Form", value: "Pre-filled pen" },
      { label: "Total content", value: "40 mg total" },
      { label: "Storage", value: "2–8°C, do not freeze" },
    ],
    labAnalysis: {
      lab: "Janoshik Analytical",
      batchNumber: "AR1739JAT",
      fillVolume: "2.4 mL",
      purity: "99.269%",
      compounds: [
        { name: "Retatrutide", concentration: "18.22 mg/mL", verified: "43.72 mg" },
      ],
      reportUrl: "#janoshik-retatrutide-40mg",
      reportImages: [janoshikRetatrutide40],
    },
    packageContents: [
      "Pre-filled Research pen (40mg Retatrutide)",
      "Research information sheet",
    ],
    storageLogic: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    id: "p4",
    title: "Tirzepatide 40mg",
    sector: "Metabolic",
    year: "USD 399",
    price: 399,
    summary:
      "Dual agonist of GLP-1 and GIP receptors. One pre-filled pen, 40 mg total, sealed and cold-packed.",
    description:
      "A 40mg Tirzepatide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    safetyProtocol:
      "Produced for laboratory research only. Not for human or veterinary consumption.",
    accent: "#ffd4c2",
    image: productTirzepatide,
    subImages: [productTirzepatide, tirzPen, tirzOpen, tirzUv],
    specs: [
      { label: "Purity", value: "≥99% HPLC" },
      { label: "Form", value: "Pre-filled pen" },
      { label: "Total content", value: "40 mg total" },
      { label: "Storage", value: "2–8°C, do not freeze" },
    ],
    labAnalysis: {
      lab: "Janoshik Analytical",
      batchNumber: "TR786PAOS",
      fillVolume: "3 mL",
      purity: "99.85%",
      compounds: [
        { name: "Tirzepatide", concentration: "13.35 mg/mL", verified: "40.05 mg" },
      ],
      reportUrl: "#janoshik-tirzepatide-40mg",
      reportImages: [janoshikTirzepatide40],
    },
    packageContents: [
      "Pre-filled Research pen (40mg Tirzepatide)",
      "Research information sheet",
    ],
    storageLogic: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    id: "p3",
    title: "BPC-157 & TB-500 40mg",
    sector: "Recovery",
    year: "USD 269",
    price: 269,
    summary:
      "BPC-157 and TB-500 paired in one pre-filled pen — 20 mg of each, 40 mg total.",
    description:
      "A 40mg BPC-157 & TB-500 formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.",
    safetyProtocol:
      "Produced for laboratory research only. Not for human or veterinary consumption.",
    accent: "#d6ffd0",
    image: productBpcTb,
    subImages: [productBpcTb, bpcPen, bpcOpen, bpcUv],
    specs: [
      { label: "Purity", value: "≥99% HPLC" },
      { label: "Form", value: "Pre-filled pen" },
      { label: "Total content", value: "20 mg BPC-157 + 20 mg TB-500" },
      { label: "Storage", value: "2–8°C, do not freeze" },
    ],
    labAnalysis: {
      lab: "Janoshik Analytical",
      batchNumber: "BP1701FSR",
      fillVolume: "3 mL",
      purity: "99.32%",
      compounds: [
        { name: "BPC-157", concentration: "7.33 mg/mL", verified: "21.99 mg" },
        { name: "TB-500", concentration: "6.53 mg/mL", verified: "19.59 mg" },
      ],
      reportUrl: "#janoshik-bpc-tb500-40mg",
      reportImages: [janoshikBpcTb500],
    },
    packageContents: [
      "Pre-filled Research pen (20mg BPC-157, 20mg TB-500)",
      "Research information sheet",
    ],
    storageLogic: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
  {
    id: "p5",
    title: "NAD+ 1000mg",
    sector: "Cellular",
    year: "USD 249",
    price: 249,
    summary:
      "NAD+ (nicotinamide adenine dinucleotide). Two pre-filled pens, 500 mg each, 1,000 mg total.",
    description:
      "NAD+ (Nicotinamide Adenine Dinucleotide) research formulation for laboratory analysis and in vitro studies only. Provided exclusively for controlled laboratory R&D applications.",
    safetyProtocol:
      "Produced for laboratory research only. Not for human or veterinary consumption.",
    accent: "#ffeec8",
    image: productNad,
    subImages: [productNad, nadPen, nadOpen, nadUv],
    specs: [
      { label: "Purity", value: "≥99% HPLC" },
      { label: "Form", value: "Pre-filled pens" },
      { label: "Total content", value: "2 × 500 mg pens" },
      { label: "Storage", value: "2–8°C, do not freeze" },
    ],
    packageContents: [
      "2 × Pre-filled NAD+ pens (500mg each)",
      "Research information sheet",
    ],
    storageLogic: [
      "Store refrigerated (2–8°C). Do not freeze.",
      "Supplied in fixed-volume sealed format for laboratory analysis.",
    ],
  },
];

export const testimonials = [
  {
    quote:
      "Fast support, reliable products, and a smooth ordering experience. The team truly delivers dependable quality every time.",
    name: "Ethan Carter",
    role: "Lab Procurement Specialist",
    avatar: review1,
  },
  {
    quote:
      "Everything arrived securely, communication was excellent, and the overall service exceeded expectations for a premium brand.",
    name: "Samuel Bennett",
    role: "Research Operations Lead",
    avatar: review2,
  },
  {
    quote:
      "Product consistency, helpful guidance, and quick responses made the entire process simple, smooth, and extremely satisfying.",
    name: "Michelle Reed",
    role: "Research Assistant",
    avatar: review3,
  },
  {
    quote:
      "Support actually answered questions about handling and storage. Most suppliers send a generic FAQ link and disappear.",
    name: "Marco Ruiz",
    role: "Procurement Lead, Vela Biotech",
    avatar: review4,
  },
  {
    quote:
      "Pricing is fair, turnaround is quick, and the certificate of analysis is more detailed than what we used to get from larger suppliers.",
    name: "Sasha Petrov",
    role: "Postdoctoral Researcher",
    avatar: review5,
  },
  {
    quote:
      "WhatsApp reply within the hour. That alone changed how we plan ordering for our team.",
    name: "Rohan Natarajan",
    role: "Co-founder, Ember Research",
    avatar: review6,
  },
];

/* The FAQ section, rebuilt 2026-10-17 to a second client reference: two
   stacked blocks inside one band — a promo row (copy left, a photograph
   right) over the questions, which sit in a right-hand column with the
   heading alone on the left.

   **The reference's copy could not ship, in both blocks.** Its promo reads
   *"Ready to Transform Your Health"* over a lead about supporting "you and
   your baby's nutritional needs prior to conception, during pregnancy and
   beyond" — a personal health-outcome claim and a pregnancy claim, on a
   catalogue whose every product page says not for human or veterinary use.
   Its questions are *"Are Innerwork Supplements Healthy?"* and the like,
   which is the same register. The *form* is kept — a two-line headline, a
   three-line lead, one filled pill, and a heading sitting opposite the
   question rows — and the words are about ordering and paperwork, which is
   what this section actually is. `faqItems` is unchanged. */
export const faqCopy = {
  promo: {
    lines: ["Ready to order", "a documented lot?"],
    lead: "Every kit ships sealed and cold-packed with the batch certificate of analysis for its own lot. Browse the catalogue, or ask before you order — we answer either way.",
    button: { label: "Shop the range", href: "#/shop" },
    /* **Names nothing the picture implies.** The client's photograph carries
       a chain of health-outcome graphics; the crop favours the figure and
       the alt describes the frame, not an outcome. See `CLAUDE.md`. */
    photoAlt: "A customer at home",
  },
  /* Two lines, the reference's way: "Frequently *Asked*" / "Questions", the
     middle word set in italic. Kept as parts so the markup can style it. */
  title: { lead: "Frequently", accent: "Asked", tail: "Questions" },
  /* How many rows show before "View more" — the reference shows four. */
  initialCount: 4,
  viewMore: "View more",
  viewLess: "View less",
  /* **Names no compound, deliberately.** The portrait (2026-10-19 rebuild) is
     the client's own cut-out (`latest-images/faq-img.png`) set on a burgundy
     studio ground; the carton she holds is ALLUVI TESAMORELIN, which this
     catalogue does not stock, and its strapline is a benefit claim — the same
     position as the hero. Nothing in `faqItems` refers to the pack. */
  figureAlt: "A woman holding a sealed research carton beside her face",
};

export const faqItems = [
  {
    question: "What documentation comes with each order?",
    answer:
      "Every research kit is paired with a batch-specific certificate of analysis listing lot number, HPLC purity, and mass-spec confirmation. Storage and handling notes are included on the packing slip.",
  },
  {
    question: "How is purity verified?",
    answer:
      "Each batch is independently tested by reverse-phase HPLC and high-resolution mass spectrometry, then verified by Janoshik Analytical. We retain a reference sample from every lot for cross-verification on request.",
  },
  {
    question: "How is the product packaged?",
    answer:
      "Products are sealed inside tamper-evident research kits with pre-filled research devices. Cold-chain packaging is used where the compound requires refrigeration.",
  },
  {
    question: "What's the return policy?",
    answer:
      "We don't accept returns on opened or temperature-compromised kits. If a research kit arrives damaged or out of spec, contact us within 48 hours of receipt and we'll replace or refund.",
  },
  {
    question: "How can I pay?",
    answer:
      "Bank transfer, card payments via our checkout, and crypto on request. Institutional purchase orders are accepted with prior credit approval.",
  },
  {
    question: "Who are these materials for?",
    answer:
      "We supply laboratories and qualified researchers. Everything in the catalogue is a research-grade reference material, intended for laboratory research only — not for human or veterinary use, and not for diagnostic or therapeutic purposes.",
  },
  {
    question: "How should a kit be stored once it arrives?",
    answer:
      "Refrigerate between 2–8°C and do not freeze. Kits ship sealed in a fixed-volume format, so keep them sealed until the material is needed. The storage and handling notes for the specific lot are printed on the packing slip and on each product page.",
  },
];

export type Project = (typeof projects)[number];
export type Testimonial = (typeof testimonials)[number];
export type FaqItem = (typeof faqItems)[number];
