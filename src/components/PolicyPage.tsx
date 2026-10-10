import { useEffect } from "react";
import { policies, type PolicySlug } from "../data/policies";
import { useRouter } from "../hooks/useRouter";

type Props = { slug: PolicySlug };

export function PolicyPage({ slug }: Props) {
  const policy = policies[slug];
  const { navigate } = useRouter();

  useEffect(() => {
    document.title = `${policy.metaTitle} — Lyfe Health`;
    return () => {
      document.title = "Lyfe Health";
    };
  }, [policy]);

  return (
    <article className="container policy-page">
      <nav className="policy-page__crumbs" aria-label="Breadcrumb">
        <button
          type="button"
          className="pdp__back"
          onClick={() => navigate({ name: "home" })}
          data-cursor
        >
          <span>Back home</span>
        </button>
        <span className="pdp__crumb-trail mono">Policies · {policy.navLabel}</span>
      </nav>

      <header className="policy-page__head">
        <span className="eyebrow">{policy.eyebrow}</span>
        <h1 className="policy-page__title">{policy.title}</h1>
        {policy.intro && <p className="policy-page__intro">{policy.intro}</p>}
      </header>

      <div className="policy-page__body">
        {policy.sections.map((section) => (
          <section className="policy-page__section" key={section.heading}>
            <h3>{section.heading}</h3>
            {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
