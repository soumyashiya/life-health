import { useEffect, useState } from "react";
import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductRange } from "./components/ProductRange";
import { ProductFeature } from "./components/ProductFeature";
import { ScienceBand } from "./components/ScienceBand";
import { DriftBand } from "./components/DriftBand";
import { LineStory } from "./components/LineStory";
import { AboutProduct } from "./components/AboutProduct";
import { TrustBar } from "./components/TrustBar";
import { AboutBand } from "./components/AboutBand";
import { WhyChoose } from "./components/WhyChoose";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { ProductDetail } from "./components/ProductDetail";
import { ShopPage } from "./components/ShopPage";
import { SciencePage } from "./components/SciencePage";
import { AboutPage } from "./components/AboutPage";
import { ProductFinder } from "./components/ProductFinder";
import { PolicyPage } from "./components/PolicyPage";
import { CartDrawer } from "./components/CartDrawer";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { LoginPage } from "./components/LoginPage";
import { AccountPage } from "./components/AccountPage";
import { OrderTracking } from "./components/OrderTracking";
import { PaymentCapturePage } from "./components/PaymentCapturePage";
import { CartProvider } from "./hooks/useCart";
import { RouterProvider, useRouter } from "./hooks/useRouter";
import { AuthProvider } from "./hooks/useAuth";
import { getLenis, useSmoothScroll } from "./hooks/useSmoothScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_REVEAL, prefersReducedMotion } from "./lib/motion";
import { sendFingerprintOnce } from "./lib/fingerprint";
import "./styles/portfolio.css";

function AppShell() {
  const [ready, setReady] = useState(false);
  const { view } = useRouter();
  useSmoothScroll(ready);

  const isHome = view.name === "home";

  // Keep ScrollTrigger from firing pins while the home view is hidden.
  useEffect(() => {
    document.body.classList.toggle("is-product-view", !isHome);
  }, [isHome]);

  /* A view swap changes the document height without a resize event, so Lenis
     keeps the old limit and every ScrollTrigger keeps its old start/end. The
     rAF waits for the new view to be laid out.

     The same frame carries the route transition. It is **enter-only**: the
     hash router swaps views synchronously, and holding the old one on screen
     to play it out would mean delaying an unmount behind an animation — that
     is what breaks back/forward. A short rise on arrival costs nothing and
     cannot interfere with history. `useRouter` has already put the scroll at
     the top by this point. */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      getLenis()?.resize();
      ScrollTrigger.refresh();

      if (prefersReducedMotion()) return;
      const entering = document.querySelector<HTMLElement>("main.view:not([hidden])");
      if (!entering) return;
      gsap.fromTo(
        entering,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE_REVEAL, clearProps: "opacity,transform" },
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [view]);

  useEffect(() => {
    void sendFingerprintOnce();
  }, []);

  return (
    <>
      {!ready && <Preloader onComplete={() => setReady(true)} />}
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      {/* **No scroll-velocity drag on type** (removed on request, 2026-10-20):
          the reference runs it on `h1`/`p`/`ul`, and headings lurching against
          the scroll read as jumpy here. `useScrollShift` is still in the tree
          and still correct — it simply has no targets. Images drift instead,
          on the about band's scrubbed parallax. */}
      <main className="view view--home" hidden={!isHome} aria-hidden={!isHome}>
        <Hero />
        {/* Quiet credential strip spanning the hero's two cards */}
        <TrustBar />
        {/* About band, built to two client references — the layout of one and
            the scroll word-reveal of the other. Its paragraph is read from
            `aboutCopy`, not restated, so this band and the `#/about` page
            cannot drift. See `aboutBandCopy` for the references' own copy and
            why none of it could ship. It sits here rather than directly under
            `Hero` because `TrustBar` is the strip spanning the hero's two
            cards, not a section of its own. */}
        <AboutBand />
        {/* The product grid. Replaced `Catalogue` on 2026-10-15 and took its
            `id="work"` with it, so the Products anchor still resolves.
            `Catalogue` is kept in the tree but no longer mounted — same
            convention as `Projects` and `ResearchAreas`. */}
        <ProductRange />
        {/* About-product band, built to a client screenshot and mounted
            directly under the products grid on request (2026-10-19). Its own
            cards, labels and chips were benefit and formulation claims and
            could not ship, so every slot is filled from real data in the
            component — the four `services` promises and
            `purityMethod.documentation`. See `aboutProductCopy`. */}
        <AboutProduct />
        {/* The carton annotated with facts drawn from its own `projects`
            entry. Moved below the range on 2026-10-16 (requested order: hero,
            products, then this) — it had sat directly under the trust strip,
            in the slot the three supplement-reference bands used to fill:
            `ProductShowcase` ("01 · What's inside matters"), `ProductOffer`
            (the offer band) and `LotPanel`, all three unmounted on request
            and still in the tree, untouched. */}
        {/* `ProductSpotlight` — the old “Inside the lot” band — unmounted on
            request (2026-10-17) and replaced by `LotFan`, built to a client
            screenshot: an arc of wedges behind a single pack. Component,
            `spotlightCopy`, `.spotlight__*` and `assets/spotlight/` are all
            kept, so remounting it is one line here plus its import. */}
        {/* `LotFan` — the 3D-box "Inside the lot" band — unmounted on request
            (2026-10-19) and replaced by `LotOffer`, built to a client
            screenshot. Component, `lotFanCopy` and `.lotfan__*` are kept.

            `LotOffer` itself no longer sits here either: it and
            `ProductFeature` were **moved below `Testimonials` on request**
            (2026-10-19) — see the pair under the reviews band. */}
        {/* `ProofBento` — the "How a lot is supplied" band — unmounted on
            request (2026-10-16). Component, `bentoCopy` and `.bento__*` are
            kept, so remounting it is one line here plus its import. It was
            being rebuilt to a numbered-tile reference when it was pulled;
            that rebuild is what is in the tree, not the earlier 2x2 bento.
            That slot is empty now — `ProductFeature` briefly filled it and
            was moved below the collage on request the same day. */}
        {/* `CompoundCollage` — the "Only verified material & nothing left
            undocumented" band — unmounted on request (2026-10-17). Component,
            `collageCopy` and `.collage__*` are kept, so remounting it is one
            line here plus its import. It was the only place on the home view
            that published every lot's measured concentration; the Science
            page still does. */}
        {/* `ProductFeature` — the featured-lot split band — **moved below
            `Testimonials` on request** (2026-10-19), together with
            `LotOffer`. See the pair under the reviews band. */}
        {/* "Our science" band, built to a client reference. Its formulation
            chips could not ship — the four here are what every published
            report carries, read from `purityMethod.documentation`. The
            cartons in the photograph are not stocked, so the copy describes
            the catalogue and never them — see `sciBandCopy`. */}
        <ScienceBand />
        {/* The drift band (2026-10-19): a centred statement with photo tiles
            flying out around it, built to a client reference. **It is also
            section 2 of `nymphaicosmetics.com`** — the same scatter-collage
            device — which is why the pass that built the two bands below it
            did not build a third. */}
        <DriftBand />
        {/* `DocBand` — "Every order starts with a documented lot." —
            unmounted on request (2026-10-20). Component, `docBandCopy` and its
            CSS and assets are kept, so remounting it is one line here plus its
            import. */}
        {/* Section 3 of `nymphaicosmetics.com`: a saturated band carrying one
            centred statement with an inline pill that opens mid-sentence, a
            two-paragraph block whose words fill on scroll, and an enormous
            ghost word closing it. Its own statement is a skin-outcome claim
            and could not ship — see `lineStoryCopy`. */}
        <LineStory />
        {/* `Billboard` — the lot's name set enormous behind a cut-out figure,
            with a spec card row below — **unmounted on request (2026-10-19)**.
            Component, `billboardCopy`, `.billboard__*` and
            `assets/billboard/` are kept, so remounting it is one line here
            plus its import. */}
        {/* `ProductReel` — section 4 of `nymphaicosmetics.com`, the pinned
            band stepping through three stocked lots — **unmounted on request
            (2026-10-19), the same day it was added**. Component, `reelCopy`
            and `.reel__*` are untouched and still in the tree, so remounting
            it is this line plus its import. It uses no asset of its own: the
            carton faces are `ProductSpotlight`'s crops and the arch stills
            are `standards/*`. */}
        {/* `ConfidenceBand` — "Documented before it ships", six features
            around a product film — unmounted on request (2026-10-19).
            Component, `confidenceCopy`, `.confidence__*` and
            `assets/confidence/` are kept; remounting it is one line here plus
            its import. */}
        {/* `ProductPlinth` — the plinth band — unmounted on request
            (2026-10-17), the same day it was added. Component, `plinthCopy`
            and `.plinth__*` are kept, so remounting it is one line here plus
            its import. It shares `assets/lotfan/face.webp` with `LotFan`, so
            it leaves no asset of its own behind. */}
        {/* "Why choose us", built to a client reference. Its rows are read
            from `whyUs`, not restated, so this band and that block cannot
            drift; see `whyChooseCopy` for the reference's benefit headline
            and why it could not ship. **It carries `id="why-us"`**, so the
            footer's `Why Us` link — a dead anchor since the old `WhyUs` band
            was unmounted on 2026-10-16 — resolves again. */}
        <WhyChoose />
        {/* `About`, `Services`, `PromoBanner` and `LabProof` were unmounted
            from the home view on request (2026-10-15). All four components
            and their CSS are untouched and still in the tree — same
            convention as `Catalogue`, `Projects` and `ResearchAreas` — so
            restoring any of them is one line here plus its import.

            Two knock-on effects, both deliberate:
            - `#about` and `#services` no longer exist on the home view, so
              any nav or footer link pointing at them has nothing to scroll
              to. The `#/about` *route* is unaffected.
            - `aboutCopy` and `proofCopy` are still exported and still read by
              the About page and the Science page respectively. Don't delete
              them as "unused". */}
        {/* `WhyUs` unmounted on request (2026-10-16). Component and CSS kept;
            remounting it is this line plus the import. Note the footer's
            `Why Us` link still points at `#why-us`, which no longer exists on
            the home view — same state `#about` / `#services` are already in. */}
        <Testimonials />
        {/* **The lot band and the featured lot both sit under the reviews**
            (moved here on request, 2026-10-19). They used to run above
            `ScienceBand`, between the product range and the science band.
            Their relative order is unchanged — lot, then featured — so the
            band that describes how a lot is supplied still leads into the
            one that puts a named lot up for sale. */}
        {/* `LotOffer` — the "What arrives — one sealed lot" offer band —
            unmounted on request (2026-10-19). Component, `lotOfferCopy`,
            `.lotoffer__*` and `assets/lotoffer/` are kept (the confidence
            film is built from `lotoffer/carton.webp`), so remounting it is one
            line here plus its import. */}
        {/* Featured-lot split band, built to a client reference. Its benefit
            headline and consumer-supplement chips could not ship — see
            `featureCopy`. Everything shoppable is read from `projects`: it is
            the only band on the home view carrying a price and a real
            add-to-cart on a single named lot. */}
        <ProductFeature />
        {/* `Campaign` — the full-bleed photographic band — unmounted on
            request (2026-10-17). Component, `campaignCopy`, `.campaign__*`
            and `assets/campaign/` are all kept, so remounting it is one line
            here plus its import. It last sat in this slot, under the reviews.
            See `CLAUDE.md` for the three builds it went through and the
            compliance position on picturing the TESAMORELIN pack. */}
        {/* `OfferBanner` — the full-bleed offer card that sat here — was
            **unmounted on request (2026-10-19), the same day it was added**.
            Component, `offerBannerCopy`, `.offerband__*` and `assets/offer/`
            are all untouched and still in the tree, so remounting it is this
            line plus its import. */}
        <FAQ />
        <Contact />
      </main>
      {view.name === "shop" && (
        <main className="view view--page">
          <ShopPage research={view.research} />
        </main>
      )}
      {view.name === "science" && (
        <main className="view view--page view--flush">
          <SciencePage section={view.section} />
        </main>
      )}
      {view.name === "about" && (
        <main className="view view--page view--flush">
          <AboutPage />
        </main>
      )}
      {view.name === "find" && (
        <main className="view view--page">
          <ProductFinder />
        </main>
      )}
      {view.name === "product" && (
        <main className="view view--product">
          <ProductDetail id={view.id} />
        </main>
      )}
      {view.name === "policy" && (
        <main className="view view--page">
          <PolicyPage slug={view.slug} />
        </main>
      )}
      {view.name === "cart" && (
        <main className="view view--page">
          <CartPage />
        </main>
      )}
      {view.name === "checkout" && (
        <main className="view view--page">
          <CheckoutPage />
        </main>
      )}
      {view.name === "login" && (
        <main className="view view--page view--auth">
          <LoginPage redirect={view.redirect} />
        </main>
      )}
      {view.name === "account" && (
        <main className="view view--page">
          <AccountPage />
        </main>
      )}
      {view.name === "track" && (
        <main className="view view--page">
          <OrderTracking />
        </main>
      )}
      {view.name === "payment-capture" && (
        <main className="view view--page">
          <PaymentCapturePage token={view.token} />
        </main>
      )}
      <Footer />
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
