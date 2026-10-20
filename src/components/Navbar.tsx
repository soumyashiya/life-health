import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "../data/site";
import { navEntries, type MegaId, type NavId } from "../data/navigation";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { parse, useRouter } from "../hooks/useRouter";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

/** Grace period so a diagonal mouse path to the panel doesn't close it. */
const CLOSE_DELAY = 140;

/**
 * Records where the pointer crossed a control's edge, so the hover fill can
 * open as a circle from that exact point and retract to wherever it leaves —
 * the interaction the reference uses on every button.
 */
const setWipeOrigin = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--wipe-x", `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty("--wipe-y", `${((e.clientY - r.top) / r.height) * 100}%`);
};

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MegaId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { totalQty, open: openCart } = useCart();
  const { account, logout } = useAuth();
  const { view, navigate } = useRouter();

  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLAnchorElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Partial<Record<NavId, HTMLButtonElement | null>>>({});
  const closeTimer = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    cancelClose();
    setActiveMenu(null);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setActiveMenu(null), CLOSE_DELAY);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  /* ---- page-load sequence ------------------------------------------------
     This lives here rather than in Hero because it is one movement: the brand
     plate starts as a full-screen colour field, the wordmark rises inside it,
     the plate collapses into the bar, and the hero photograph narrows into its
     column on the same beat. Timings and eases are taken from the reference.
     The hover that re-opens the bar is CSS — see `.nav__brand` — so the two
     can never fight over the same width. */
  useEffect(() => {
    const brand = brandRef.current;
    const cover = coverRef.current;
    if (!brand || !cover) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 992px) and (prefers-reduced-motion: no-preference)", () => {
      const parts = [".nav__star", ".nav__logo", ".nav__brand-lead", ".nav__brand-accent"];
      // Only present on the home view; GSAP no-ops on an empty selector.
      // The hero's arrival belongs to this timeline, not to Hero's own: the
      // band is hidden behind the field until it lifts, so anything that
      // animated on mount would play unseen. GSAP no-ops on an empty selector,
      // so an inner page just runs the header part.
      const heroBits =
        ".hero__content > *:not(.hero__title), .hero__shelf-item";
      const heroLines = ".hero__line > span";

      brand.classList.add("is-intro");

      // How far the mark has to travel to sit in the middle of the field, and
      // how much bigger it runs while it is there. Measured rather than
      // guessed, so the settle lands exactly on the bar position.
      const box = brand.getBoundingClientRect();
      const toCentre = window.innerHeight / 2 - (box.top + box.height / 2);

      const tl = gsap.timeline();
      tl.set(cover, { yPercent: 0 })
        .set(brand, { y: toCentre, scale: 2.6, transformOrigin: "center center" })
        .set(parts, { yPercent: 100 })
        .set(heroBits, { opacity: 0 })
        .set(heroLines, { yPercent: 110 })
        .to(parts, {
          yPercent: 0,
          delay: 0.4,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.2,
        })
        .to(".nav__star", { rotation: 180, duration: 0.4, ease: "power1.out" })
        .to(".nav__star", {
          yPercent: 100,
          duration: 0.8,
          ease: "power1.out",
          delay: 0.2,
        })
        // The field lifts while the mark settles back into the bar.
        .to(
          cover,
          { yPercent: -100, duration: 0.9, ease: "power3.inOut" },
          "-=0.6",
        )
        .to(
          brand,
          {
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.inOut",
            onComplete: () => brand.classList.remove("is-intro"),
            clearProps: "transform",
          },
          "<",
        )
        // The headline rises behind its per-line masks as the field clears,
        // then the smaller type and the card follow it.
        .to(
          heroLines,
          {
            yPercent: 0,
            duration: 0.95,
            ease: "power3.out",
            stagger: 0.09,
            clearProps: "transform",
          },
          "-=0.45",
        )
        .to(
          heroBits,
          {
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.08,
            clearProps: "opacity",
          },
          "-=0.6",
        );

      return () => {
        tl.kill();
        brand.classList.remove("is-intro");
      };
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  /* ---- solid header once the hero is behind us --------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- body scroll lock for the mobile drawer ---------------------------- */
  useEffect(() => {
    document.body.classList.toggle("scroll-lock", drawerOpen);
    return () => document.body.classList.remove("scroll-lock");
  }, [drawerOpen]);

  /* ---- account dropdown: outside click ----------------------------------- */
  useEffect(() => {
    if (!accountMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!accountMenuRef.current?.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [accountMenuOpen]);

  /* ---- ESC closes the mega menu and returns focus to its trigger --------- */
  useEffect(() => {
    if (!activeMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      const trigger = triggerRefs.current[activeMenu];
      closeMenu();
      trigger?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeMenu, closeMenu]);

  /* ---- clicking outside the header closes the mega menu ------------------ */
  useEffect(() => {
    if (!activeMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!shellRef.current?.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeMenu, closeMenu]);

  /* ---- navigation -------------------------------------------------------- */
  const go = useCallback(
    (href: string) => {
      closeMenu();
      setDrawerOpen(false);

      if (href.startsWith("#/")) {
        navigate(parse(href));
        return;
      }

      const scrollToTarget = () => {
        if (href === "#home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      if (view.name === "home") {
        scrollToTarget();
      } else {
        navigate({ name: "home" });
        window.setTimeout(scrollToTarget, 120);
      }
    },
    [closeMenu, navigate, view.name],
  );

  /* ---- ArrowDown drops focus into the open panel ------------------------- */
  const onTriggerKeyDown = (e: React.KeyboardEvent, id: MegaId) => {
    if (e.key !== "ArrowDown") return;
    e.preventDefault();
    setActiveMenu(id);
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLAnchorElement>(`#mega-panel-${id} a`)
        ?.focus();
    });
  };

  // Over the hero the header carries no surface of its own; it picks one up
  // on scroll, on an inner page, or whenever a panel is open.
  // An open panel deliberately does NOT break transparency. Dropping it put a
  // full-width white plate across the bar the moment a nav item was hovered,
  // which reads as the header changing state rather than a panel opening under
  // it. The panel is its own opaque card and needs no plate behind it.
  const transparent = !scrolled && view.name === "home";

  return (
    <>
      <div
        className={clsx("nav__shell", activeMenu && "has-mega")}
        ref={shellRef}
        onMouseLeave={scheduleClose}
      >
        <header
          className={clsx(
            "nav",
            scrolled && "is-scrolled",
            transparent && "is-transparent",
          )}
        >
          <div className="container nav__row">
            <a
              className="nav__brand"
              ref={brandRef}
              href="#home"
              data-cursor
              aria-label={site.name}
              onClick={(e) => {
                e.preventDefault();
                go("#home");
              }}
            >
              {/* Mark over wordmark, centred in the bar. The star between the
                  two words only exists for the load sequence — it rises with
                  them, turns, then drops away. Each part sits in its own mask
                  so the rise reads as a reveal. */}
              <span className="nav__brand-mask nav__brand-mask--star" aria-hidden>
                <span className="nav__star">
                  <svg viewBox="0 0 60 60" fill="none">
                    <path
                      d="M0 30L18.9196 27.0919C23.1356 26.4439 26.4439 23.1356 27.0919 18.9196L30 0L32.9081 18.9196C33.5561 23.1356 36.8644 26.4439 41.0804 27.0919L60 30L41.0804 32.9081C36.8644 33.5561 33.5561 36.8644 32.9081 41.0804L30 60L27.0919 41.0804C26.4439 36.8644 23.1356 33.5561 18.9196 32.9081L0 30Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </span>

              <span className="nav__brand-mask">
                <span className="nav__logo" aria-hidden>
                  <svg viewBox="0 0 32 32" fill="none">
                    <path
                      d="M10 16 L21 9"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 16 L21 23"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle cx="10" cy="16" r="4.2" fill="currentColor" />
                    <circle cx="22" cy="8.5" r="3" fill="currentColor" />
                    <circle cx="22" cy="23.5" r="3" fill="currentColor" />
                  </svg>
                </span>
              </span>

              <span className="nav__brand-mask">
                <span className="nav__brand-lead">{site.brandMark}</span>
              </span>

              <span className="nav__brand-mask">
                <span className="nav__brand-accent">{site.brandSub}</span>
              </span>
            </a>

            {/* A direct child of the row, not of the cluster: it has to sit
                beside the mark on the hero's colour panel, and nested in the
                cluster its auto margin only pushed against the controls. */}
            <nav className="nav__primary" aria-label="Primary">
              <ul className="nav__links">
                {navEntries.map((entry) => {
                  const isMega = entry.hasPanel;
                  const id = entry.id as MegaId;
                  return (
                    <li
                      key={entry.id}
                      className="nav__item"
                      onMouseEnter={() => {
                        cancelClose();
                        setActiveMenu(isMega ? id : null);
                      }}
                    >
                      {isMega ? (
                        <button
                          type="button"
                          className={clsx(
                            "nav__link",
                            activeMenu === id && "is-active",
                          )}
                          aria-expanded={activeMenu === id}
                          aria-controls={`mega-panel-${id}`}
                          data-cursor
                          ref={(el) => {
                            triggerRefs.current[entry.id] = el;
                          }}
                          onClick={() =>
                            setActiveMenu((cur) => (cur === id ? null : id))
                          }
                          onKeyDown={(e) => onTriggerKeyDown(e, id)}
                          onMouseEnter={setWipeOrigin}
                          onMouseLeave={setWipeOrigin}
                        >
                          <span className="nav__link-label">{entry.label}</span>
                        </button>
                      ) : null}

                      {isMega && (
                        <MegaMenuPanel
                          id={id}
                          isActive={activeMenu === id}
                          onNavigate={go}
                        />
                      )}

                      {!isMega && (
                        <a
                          className="nav__link"
                          href={entry.href}
                          data-cursor
                          onMouseEnter={setWipeOrigin}
                          onMouseLeave={setWipeOrigin}
                          onClick={(e) => {
                            e.preventDefault();
                            go(entry.href);
                          }}
                        >
                          <span className="nav__link-label">{entry.label}</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="nav__cluster">
            <div className="nav__actions">
              {/* The search control and its overlay were removed from the bar
                  on request (2026-10-15). `NavSearch.tsx` is kept but no longer
                  mounted, same convention as `Projects.tsx` — the catalogue is
                  still browsable through Shop and the shop page's own filters. */}

              <div className="nav__account-wrap" ref={accountMenuRef}>
                <button
                  className="nav__icon-btn nav__account"
                  onClick={() => {
                    if (account) {
                      setAccountMenuOpen((v) => !v);
                    } else {
                      navigate({ name: "login" });
                    }
                  }}
                  aria-label={account ? "Your account" : "Sign in"}
                  aria-expanded={account ? accountMenuOpen : undefined}
                  data-cursor
                  data-cursor-text={account ? "Account" : "Sign in"}
                  type="button"
                >
                  <svg className="nav__account-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="8.5" r="3.75" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M4.75 20.25c0-3.59 3.25-6.5 7.25-6.5s7.25 2.91 7.25 6.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {account && accountMenuOpen && (
                  <div className="nav__account-menu" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        navigate({ name: "account" });
                      }}
                    >
                      My Orders
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        navigate({ name: "track" });
                      }}
                    >
                      Track Order
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="nav__account-menu-danger"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                        navigate({ name: "home" });
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <button
                className="nav__icon-btn nav__cart"
                onClick={openCart}
                aria-label={`Open cart, ${totalQty} item${totalQty === 1 ? "" : "s"}`}
                data-cursor
                data-cursor-text="Cart"
                type="button"
              >
                <svg className="nav__cart-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 6h2.2l2.4 10.2a2 2 0 0 0 1.95 1.55h7.6a2 2 0 0 0 1.95-1.55L21.5 9H7.2"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10.5" cy="20.25" r="1.25" fill="currentColor" />
                  <circle cx="17.5" cy="20.25" r="1.25" fill="currentColor" />
                </svg>
                {totalQty > 0 && (
                  <span className="nav__cart-badge" aria-hidden>
                    {totalQty}
                  </span>
                )}
              </button>

              {/* The "Find your product" CTA was removed from the bar on
                  request (2026-10-15), and from the drawer with it. The finder
                  is still routable at #/find — only its header entry points
                  are gone. */}

              <button
                className="nav__toggle"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav"
                onClick={() => setDrawerOpen(true)}
                data-cursor
                type="button"
              >
                <span aria-hidden />
              </button>
            </div>
            </div>
          </div>
        </header>
      </div>

      {/* The field the page opens on. It covers everything, the wordmark rises
          inside it, then it lifts away. Parked off-screen at rest, so reduced
          motion and a failed script both land on the finished page. */}
      <div className="nav__cover" ref={coverRef} aria-hidden />

      <div
        className={clsx("nav__backdrop", activeMenu && "is-visible")}
        aria-hidden
        onMouseEnter={scheduleClose}
      />

      <div id="mobile-nav">
        <MobileNav
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={go}
        />
      </div>

    </>
  );
}
