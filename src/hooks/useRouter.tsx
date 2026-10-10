import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { policies, type PolicySlug } from "../data/policies";
import { isResearchAreaId, type ResearchVisualKey } from "../data/research";
import { isScienceSection, type ScienceSection } from "../data/science";

export type View =
  | { name: "home" }
  | { name: "shop"; research?: ResearchVisualKey }
  | { name: "science"; section?: ScienceSection }
  | { name: "about" }
  | { name: "find" }
  | { name: "product"; id: string }
  | { name: "policy"; slug: PolicySlug }
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "login"; redirect?: string }
  | { name: "account" }
  | { name: "track"; order?: string }
  | { name: "payment-capture"; token: string };

type RouterContextValue = {
  view: View;
  navigate: (next: View) => void;
};

export const parse = (hash: string): View => {
  if (/^#\/shop\b/.test(hash)) {
    const research = hash.match(/[?&]research=([^&]+)/);
    const id = research ? decodeURIComponent(research[1]) : "";
    return isResearchAreaId(id) ? { name: "shop", research: id } : { name: "shop" };
  }
  if (/^#\/science\b/.test(hash)) {
    const section = hash.match(/[?&]s=([^&]+)/);
    const id = section ? decodeURIComponent(section[1]) : "";
    return isScienceSection(id) ? { name: "science", section: id } : { name: "science" };
  }
  if (/^#\/about\b/.test(hash)) return { name: "about" };
  if (/^#\/find\b/.test(hash)) return { name: "find" };
  if (/^#\/cart\b/.test(hash)) return { name: "cart" };
  if (/^#\/checkout\b/.test(hash)) return { name: "checkout" };
  if (/^#\/account\b/.test(hash)) return { name: "account" };
  const track = hash.match(/^#\/track(?:\/([^/?]+))?/);
  if (track) return { name: "track", order: track[1] ? decodeURIComponent(track[1]) : undefined };
  const paymentCapture = hash.match(/^#\/payment-capture\/([^/?]+)/);
  if (paymentCapture) return { name: "payment-capture", token: decodeURIComponent(paymentCapture[1]) };
  const login = hash.match(/^#\/login(?:\?redirect=([^&]+))?/);
  if (login) return { name: "login", redirect: login[1] ? decodeURIComponent(login[1]) : undefined };
  const product = hash.match(/^#\/product\/([^/?]+)/);
  if (product) return { name: "product", id: product[1] };
  const policy = hash.match(/^#\/policies\/([^/?]+)/);
  if (policy && policy[1] in policies) {
    return { name: "policy", slug: policy[1] as PolicySlug };
  }
  return { name: "home" };
};

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>(() =>
    typeof window === "undefined"
      ? { name: "home" }
      : parse(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => {
      setView(parse(window.location.hash));
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((next: View) => {
    let hash: string;
    switch (next.name) {
      case "home":
        hash = "";
        break;
      case "shop":
        hash = next.research ? `#/shop?research=${next.research}` : "#/shop";
        break;
      case "science":
        hash = next.section ? `#/science?s=${next.section}` : "#/science";
        break;
      case "about":
        hash = "#/about";
        break;
      case "find":
        hash = "#/find";
        break;
      case "product":
        hash = `#/product/${next.id}`;
        break;
      case "policy":
        hash = `#/policies/${next.slug}`;
        break;
      case "cart":
        hash = "#/cart";
        break;
      case "checkout":
        hash = "#/checkout";
        break;
      case "login":
        hash = next.redirect ? `#/login?redirect=${encodeURIComponent(next.redirect)}` : "#/login";
        break;
      case "account":
        hash = "#/account";
        break;
      case "track":
        hash = next.order
          ? `#/track/${encodeURIComponent(next.order)}`
          : "#/track";
        break;
      case "payment-capture":
        hash = `#/payment-capture/${encodeURIComponent(next.token)}`;
        break;
    }
    if (hash === "") {
      if (window.location.hash) {
        history.pushState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
        setView({ name: "home" });
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    } else {
      window.location.hash = hash.slice(1);
    }
  }, []);

  const value = useMemo(() => ({ view, navigate }), [view, navigate]);

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}
