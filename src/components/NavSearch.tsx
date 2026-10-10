import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "../data/site";
import { researchAreas, researchAreaHref } from "../data/research";

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
};

/** `haystack` is the pre-lowercased text the query is matched against. */
type Result = { label: string; context: string; href: string; haystack: string };

const index: Result[] = [
  ...projects.map((product) => ({
    label: product.title,
    context: product.sector,
    href: `#/product/${product.id}`,
    haystack: `${product.title} ${product.sector} ${product.summary}`.toLowerCase(),
  })),
  ...researchAreas.map((area) => ({
    label: area.name,
    context: "Research area",
    href: researchAreaHref(area),
    haystack: `${area.name} ${area.description}`.toLowerCase(),
  })),
];

/**
 * Header search over the real catalogue.
 *
 * The site had no search before this header, so rather than ship an icon that
 * opens nothing, this matches the actual `projects` and `researchAreas` data
 * and routes to pages that already exist.
 *
 * The panel is a separate component so each open mounts it fresh — that keeps
 * query and cursor reset without an effect writing state on every close.
 */
export function NavSearch({ open, onClose, onNavigate }: Props) {
  if (!open) return null;
  return <SearchPanel onClose={onClose} onNavigate={onNavigate} />;
}

function SearchPanel({ onClose, onNavigate }: Omit<Props, "open">) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 6);
    return index.filter((item) => item.haystack.includes(q)).slice(0, 8);
  }, [query]);

  useEffect(() => {
    // Let the panel paint before stealing focus, or iOS skips the keyboard.
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter" && results[cursor]) {
        e.preventDefault();
        onNavigate(results[cursor].href);
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [results, cursor, onClose, onNavigate]);

  return (
    <div className="navsearch" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        type="button"
        className="navsearch__scrim"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="container navsearch__shell">
        <div className="navsearch__bar">
          <svg className="navsearch__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="m15.75 15.75 3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className="navsearch__input"
            placeholder="Search research materials"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            aria-label="Search research materials"
            autoComplete="off"
          />
          <button type="button" className="navsearch__close" onClick={onClose}>
            Esc
          </button>
        </div>

        {results.length > 0 ? (
          <ul className="navsearch__results">
            {results.map((result, i) => (
              <li key={result.href + result.label}>
                <a
                  className={i === cursor ? "is-cursor" : undefined}
                  href={result.href}
                  onMouseEnter={() => setCursor(i)}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(result.href);
                    onClose();
                  }}
                >
                  <span className="navsearch__result-label">{result.label}</span>
                  <span className="navsearch__result-context mono">
                    {result.context}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="navsearch__empty">
            No matches for “{query.trim()}”. Try a compound or research area.
          </p>
        )}
      </div>
    </div>
  );
}
