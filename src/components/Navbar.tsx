import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { site } from "../data/site";
import {
  navEntries,
  primaryCta,
  type MegaId,
  type NavId,
} from "../data/navigation";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useMagnetic } from "../hooks/useMagnetic";
import { parse, useRouter } from "../hooks/useRouter";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { NavSearch } from "./NavSearch";

/** Grace period so a diagonal mouse path to the panel doesn't close it. */
const CLOSE_DELAY = 140;

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MegaId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const { totalQty, open: openCart } = useCart();
  const { account, logout } = useAuth();
  const { view, navigate } = useRouter();

  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Partial<Record<NavId, HTMLButtonElement | null>>>({});
  const closeTimer = useRef<number | null>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.22);

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
      setSearchOpen(false);

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
  const transparent =
    !scrolled && view.name === "home" && !activeMenu && !searchOpen;

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
              href="#home"
              data-cursor
              aria-label={site.name}
              onClick={(e) => {
                e.preventDefault();
                go("#home");
              }}
            >
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
              <span className="nav__brand-name">
                <span className="nav__brand-primary">{site.brandMark}</span>
                <span className="nav__brand-divider" aria-hidden />
                <span className="nav__brand-accent">{site.brandSub}</span>
              </span>
            </a>

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
                        >
                          {entry.label}
                          <span className="nav__link-rule" aria-hidden />
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
                          onClick={(e) => {
                            e.preventDefault();
                            go(entry.href);
                          }}
                        >
                          {entry.label}
                          <span className="nav__link-rule" aria-hidden />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="nav__actions">
              <button
                type="button"
                className="nav__icon-btn"
                onClick={() => {
                  closeMenu();
                  setSearchOpen(true);
                }}
                aria-label="Search products"
                aria-expanded={searchOpen}
                data-cursor
                data-cursor-text="Search"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="m15.75 15.75 3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

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

              <a
                className="nav__cta"
                href={primaryCta.href}
                ref={ctaRef}
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  go(primaryCta.href);
                }}
              >
                <span>{primaryCta.label}</span>
              </a>

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
        </header>
      </div>

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

      <NavSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={go}
      />
    </>
  );
}
