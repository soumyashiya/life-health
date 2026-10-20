import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  learnPanel,
  navEntries,
  shopPanel,
  supportPanel,
  utilityLinks,
  type NavId,
  type NavLink,
  type NavRow,
} from "../data/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
};

/** The accordion contents, flattened from the same rows the dropdowns use. */
const linksFor = (id: NavId): NavLink[] => {
  const panel: {
    rows: NavRow[];
    groupLinks?: NavLink[];
    allLink?: NavLink;
  } = id === "learn" ? learnPanel : id === "support" ? supportPanel : shopPanel;
  const rows: NavLink[] = panel.rows.map((row) => ({
    label: row.label,
    href: row.href,
    note: row.meta,
  }));
  // Shop's category row rides along as plain links; Support has no "view all",
  // since each of its rows is already a destination.
  return [...rows, ...(panel.groupLinks ?? []), ...(panel.allLink ? [panel.allLink] : [])];
};

/**
 * Mobile navigation — a full-screen panel, not a shrunken mega menu. All three
 * bar items expand as accordions, matching the desktop dropdowns one-for-one.
 */
export function MobileNav({ open, onClose, onNavigate }: Props) {
  const [expanded, setExpanded] = useState<NavId | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // The panel stays mounted so it can animate out, so collapsing the accordion
  // happens here on the way out rather than in an effect watching `open`.
  const close = useCallback(() => {
    setExpanded(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div
      className={clsx("mobnav", open && "is-open")}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="mobnav__head">
        <span className="mobnav__title mono">Menu</span>
        <button
          type="button"
          className="mobnav__close"
          onClick={close}
          aria-label="Close menu"
          ref={closeRef}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="mobnav__scroll">
        <ul className="mobnav__list">
          {navEntries.map((entry) => {
            if (!entry.hasPanel) {
              return (
                <li className="mobnav__item" key={entry.id}>
                  <a
                    className="mobnav__trigger mobnav__trigger--link"
                    href={entry.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(entry.href);
                    }}
                  >
                    <span>{entry.label}</span>
                    <span className="mobnav__arrow" aria-hidden>
                      <svg viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 13 13 3M6 3h7v7"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="square"
                        />
                      </svg>
                    </span>
                  </a>
                </li>
              );
            }

            const isOpen = expanded === entry.id;
            return (
              <li className="mobnav__item" key={entry.id}>
                <button
                  type="button"
                  className={clsx("mobnav__trigger", isOpen && "is-open")}
                  aria-expanded={isOpen}
                  aria-controls={`mobnav-${entry.id}`}
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                >
                  <span>{entry.label}</span>
                  <span className="mobnav__plus" aria-hidden />
                </button>

                <div
                  className={clsx("mobnav__drawer", isOpen && "is-open")}
                  id={`mobnav-${entry.id}`}
                  hidden={!isOpen}
                >
                  <div className="mobnav__drawer-inner">
                    <ul className="mobnav__group">
                      {linksFor(entry.id).map((link) => (
                        <li key={`${link.href}-${link.label}`}>
                          <a
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigate(link.href);
                            }}
                          >
                            {link.label}
                            {link.note && (
                              <span className="mobnav__note mono">
                                {link.note}
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* The "Find your product" CTA was removed from the drawer on request
            (2026-10-15), alongside the one in the bar. */}

        <div className="mobnav__foot">
          {utilityLinks.map((link) => (
            <a
              key={link.href}
              className="mobnav__foot-link"
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
