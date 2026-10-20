import { promoCopy } from "../data/site";
import bannerImg from "../assets/sub-new.jpeg";

/* Full-bleed band under the catalogue. The photograph carries the packs on its
   right half and open cream on the left, so the copy sits left and the image is
   anchored right — see .promo__* in portfolio.css. */
export function PromoBanner() {
  return (
    <section className="promo">
      <img
        className="promo__img"
        src={bannerImg}
        alt=""
        width={1695}
        height={624}
        loading="lazy"
        decoding="async"
      />

      <div className="container promo__inner">
        <div className="promo__copy">
          <span className="promo__eyebrow">{promoCopy.eyebrow}</span>
          <h2 className="promo__title">{promoCopy.title}</h2>
          <p className="promo__text">{promoCopy.text}</p>
          <div className="promo__actions">
            <a
              className="btn btn--secondary"
              href={promoCopy.primary.href}
              data-cursor
              data-cursor-text="Shop"
            >
              {promoCopy.primary.label}
            </a>
            <a className="btn btn--ghost" href={promoCopy.secondary.href}>
              {promoCopy.secondary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
