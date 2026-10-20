import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import clsx from "clsx";
import {
  learnPanel,
  shopPanel,
  supportPanel,
  utilityLinks,
  type MegaId,
  type NavLink,
  type NavRow,
} from "../data/navigation";

type Props = {
  id: MegaId;
  /** Every panel stays mounted; only the active one is shown. */
  isActive: boolean;
  onNavigate: (href: string) => void;
};

type Panel = {
  rows: NavRow[];
  /** A compact wrapped row of plain links under the thumbnails. */
  groupLabel?: string;
  groupLinks?: NavLink[];
  /** Omitted where each row is already its own destination. */
  allLink?: { label: string; href: string };
  /** Support's rows *are* the utility links; repeating them would be silly. */
  showUtility?: boolean;
};

const panels: Record<MegaId, Panel> = {
  shop: shopPanel,
  learn: learnPanel,
  support: supportPanel,
};

const panelLabels: Record<MegaId, string> = {
  shop: "Shop",
  learn: "Learn",
  support: "Support",
};

/**
 * A compact dropdown anchored under its trigger — not a full-width mega
 * panel. Each row is a thumbnail, a name and one short meta line, so the menu
 * stays scannable in a glance and the descriptive copy stays on the pages the
 * rows lead to.
 */
export function MegaMenuPanel({ id, isActive, onNavigate }: Props) {
  const root = useRef<HTMLDivElement | null>(null);
  const firstRun = useRef(true);
  const { rows, allLink, groupLabel, groupLinks, showUtility = true } = panels[id];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = el.querySelectorAll<HTMLElement>("[data-mega-item]");

    // Skip the entrance on mount so a closed panel never flashes.
    if (firstRun.current) {
      firstRun.current = false;
      if (!isActive) return;
    }

    if (reduced) {
      gsap.set(el, {
        opacity: isActive ? 1 : 0,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
      });
      gsap.set(Array.from(items), { opacity: isActive ? 1 : 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (!isActive) {
        gsap.to(el, { opacity: 0, y: -6, duration: 0.2, ease: "power2.in" });
        return;
      }

      gsap.killTweensOf([el, items] as object[]);

      gsap.fromTo(
        el,
        { opacity: 0, y: -8, clipPath: "inset(0% 0% 100% 0%)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.46,
          ease: "power3.out",
          overwrite: true,
        },
      );

      gsap.fromTo(
        items,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.42,
          ease: "power3.out",
          stagger: 0.03,
          delay: 0.05,
          overwrite: true,
        },
      );
    }, el);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <div
      className={clsx("mega", `mega--${id}`, isActive && "is-active")}
      id={`mega-panel-${id}`}
      ref={root}
      role="region"
      aria-label={`${panelLabels[id]} menu`}
      hidden={!isActive}
    >
      <ul className="mega__rows">
        {rows.map((row) => (
          <li key={row.id} data-mega-item>
            <a
              className="mega__row"
              href={row.href}
              data-cursor
              onClick={(e) => {
                e.preventDefault();
                onNavigate(row.href);
              }}
            >
              {/* Decorative: the label beside it already names the row. */}
              <span className="mega__thumb">
                <img
                  src={row.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={160}
                  height={160}
                />
              </span>
              <span className="mega__row-text">
                <span className="mega__row-meta mono">{row.meta}</span>
                <span className="mega__row-label">{row.label}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {groupLinks && groupLinks.length > 0 && (
        <div className="mega__group" data-mega-item>
          {groupLabel && <span className="mega__group-label">{groupLabel}</span>}
          <div className="mega__group-links">
            {groupLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor
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
      )}

      {allLink && (
        <a
          className="mega__all"
          href={allLink.href}
          data-cursor
          data-mega-item
          onClick={(e) => {
            e.preventDefault();
            onNavigate(allLink.href);
          }}
        >
          {allLink.label}
          <svg viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
            <path
              d="M3 8h9M8.5 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="square"
            />
          </svg>
        </a>
      )}

      {/* One hairline row, so support stays reachable without adding height. */}
      {showUtility && (
        <div
          className={clsx("mega__utility", !allLink && "mega__utility--ruled")}
          data-mega-item
        >
          {utilityLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export type { MegaId };
