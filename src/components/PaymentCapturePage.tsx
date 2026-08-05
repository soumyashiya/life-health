import { useEffect, useRef, useState } from "react";
import { useRouter } from "../hooks/useRouter";
import {
  ApiError,
  paymentCaptureApplyPromo,
  paymentCaptureUpload,
  paymentCaptureValidate,
  type ApiOrderItemRow,
  type PaymentCaptureValidateResponse,
} from "../lib/api";

/**
 * Public payment-capture page for the manual bank-transfer flow. Reached via
 * an emailed link (#/payment-capture/:token) — no auth required, matching
 * the documented `/api/payment-capture/*` endpoints. Screenshot upload is
 * verified server-side by the payment-verification-service (OCR-scored
 * against the order total + payee bank details); the response's
 * `payment_status` drives the UI, we never re-implement the scoring here.
 */

type UploadStatus = "idle" | "uploading" | "received" | "rejected" | "pending";

type VerificationVerdict = {
  decision: "approved" | "rejected";
  probability: number;
  reasons: string[];
  extracted: Record<string, unknown>;
};

const REASON_LABELS: Record<string, string> = {
  amount_mismatch: "The transferred amount doesn't match your order total.",
  payee_missing_or_mismatch: "We couldn't confirm the payee name on the screenshot.",
  sort_code_not_found: "We couldn't find the sort code on the screenshot.",
  account_number_not_found: "We couldn't find the account number on the screenshot.",
  bank_signals_missing: "We couldn't confirm this is a bank transfer confirmation.",
  ocr_confidence_low: "The screenshot is too unclear to read reliably.",
};

const explainRejection = (reasons: string[] | undefined): string[] => {
  if (!reasons) return [];
  return reasons.filter((r) => r in REASON_LABELS).map((r) => REASON_LABELS[r]);
};

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const lineTotal = (it: ApiOrderItemRow) =>
  it.line_total != null ? Number(it.line_total) : Number(it.unit_price) * it.quantity;

export function PaymentCapturePage({ token }: { token: string }) {
  const { navigate } = useRouter();

  const [data, setData] = useState<PaymentCaptureValidateResponse | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadError, setUploadError] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [screenshotUrl, setScreenshotUrl] = useState("");

  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    setData(null);
    paymentCaptureValidate(token)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg =
          err instanceof ApiError && (err.status === 400 || err.status === 404)
            ? "This payment link is invalid or has expired."
            : err instanceof ApiError
              ? err.message
              : "Failed to load payment details.";
        setLoadError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code || promoLoading) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      await paymentCaptureApplyPromo({ token, promoCode: code });
      const fresh = await paymentCaptureValidate(token);
      setData(fresh);
      setPromoInput("");
    } catch (err) {
      setPromoError(
        err instanceof ApiError ? err.message : "Could not apply promo.",
      );
    } finally {
      setPromoLoading(false);
    }
  };

  const uploadScreenshot = async () => {
    if (!file || uploadStatus === "uploading") return;
    setUploadStatus("uploading");
    setUploadError("");
    setRejectionReasons([]);
    try {
      const res = await paymentCaptureUpload(token, file);
      setUploadStatus(res.payment_status);
      setScreenshotUrl(res.screenshotUrl);
      if (res.verification_error) setUploadError(res.verification_error);
      if (res.payment_status === "rejected") {
        const verdict = (res.verification as { verdict?: VerificationVerdict } | null)
          ?.verdict;
        setRejectionReasons(explainRejection(verdict?.reasons));
      }
    } catch (err) {
      setUploadStatus("idle");
      setUploadError(
        err instanceof ApiError ? err.message : "Upload failed. Please try again.",
      );
    }
  };

  const pickFile = (f: File | null | undefined) => {
    if (f) setFile(f);
  };

  const copyField = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopiedField(key);
      window.setTimeout(() => setCopiedField((k) => (k === key ? null : k)), 1600);
    });
  };

  if (loading) {
    return (
      <section className="container paycap">
        <div className="paycap__loading">
          <svg
            className="paycap__spinner"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="9.5"
              stroke="var(--color-outline)"
              strokeWidth="2"
            />
            <path
              d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>
    );
  }

  if (loadError || !data) {
    return (
      <section className="container paycap">
        <div className="account-empty">
          <div className="account-empty__icon" aria-hidden>
            <AlertIcon />
          </div>
          <h3 className="account-empty__title">Link unavailable</h3>
          <p className="account-empty__text">
            {loadError || "Payment link not found."}
          </p>
        </div>
      </section>
    );
  }

  const order = data.order;
  const total = Number(order.total ?? 0);
  const subtotal = order.subtotal != null ? Number(order.subtotal) : null;
  const discountAmount =
    order.discount_amount != null ? Number(order.discount_amount) : 0;
  const orderNumber = String(order.order_number ?? "");

  if (uploadStatus === "received") {
    return (
      <section className="container paycap">
        <div className="order-modal__card" style={{ margin: "0 auto", maxWidth: "34rem" }}>
          <div className="order-modal__icon" aria-hidden>
            <CheckCircleIcon />
          </div>
          <span className="mono eyebrow">Order {orderNumber}</span>
          <h1 className="order-modal__title">Payment confirmed</h1>
          <p className="order-modal__lede">
            Thank you — your transfer was verified and your order is being
            prepared.
          </p>
          {screenshotUrl && (
            <a
              href={screenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{ color: "var(--color-accent)" }}
            >
              View uploaded screenshot ↗
            </a>
          )}
          <div className="order-modal__actions">
            <button
              type="button"
              className="account-btn account-btn--primary"
              onClick={() => navigate({ name: "track", order: orderNumber })}
              data-cursor
            >
              Track order
            </button>
            <button
              type="button"
              className="account-btn account-btn--ghost"
              onClick={() => navigate({ name: "home" })}
              data-cursor
            >
              Back to home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container paycap">
      <header className="paycap__head">
        <span className="mono eyebrow">Complete payment</span>
        <h1 className="paycap__title">Order {orderNumber}</h1>
        <p className="paycap__lede">
          Transfer the total below to the account, then upload a screenshot
          of your transfer so we can confirm it.
        </p>
      </header>

      <div className="paycap__grid">
        {/* Left — order summary + amount + bank details */}
        <div className="paycap__col">
          {data.items.length > 0 && (
            <div className="paycap__panel">
              <h2 className="paycap__panel-title">
                <PackageIcon /> Order summary
              </h2>
              <ul className="order-card__items">
                {data.items.map((it) => (
                  <li key={it.id} className="order-card__item">
                    <div>
                      <span className="order-card__item-name">{it.name}</span>
                      <span className="mono order-card__item-qty">
                        × {it.quantity}
                      </span>
                    </div>
                    <span className="order-card__item-price">
                      {formatUsd(lineTotal(it))}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="checkout__summary-rows" style={{ marginTop: "1rem" }}>
                {subtotal != null && (
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatUsd(subtotal)}</dd>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div>
                    <dt>Discount</dt>
                    <dd>−{formatUsd(discountAmount)}</dd>
                  </div>
                )}
                <div className="checkout__summary-total">
                  <dt>Total</dt>
                  <dd>{formatUsd(total)}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="paycap__amount">
            <p className="paycap__amount-label">
              <WalletIcon /> Amount due
            </p>
            <p className="paycap__amount-value">{formatUsd(total)}</p>
          </div>

          <div className="paycap__panel">
            <h2 className="paycap__panel-title">
              <LandmarkIcon /> Bank transfer details
            </h2>
            <div className="paycap__bank">
              <BankRow
                icon={<BuildingIcon />}
                label="Payee"
                value={data.bank.payeeName}
                onCopy={() => copyField("payeeName", data.bank.payeeName)}
                copied={copiedField === "payeeName"}
              />
              <BankRow
                icon={<HashIcon />}
                label="Reference"
                value={data.bank.reference}
                mono
                onCopy={() => copyField("reference", data.bank.reference)}
                copied={copiedField === "reference"}
              />
              <BankRow
                icon={<LandmarkIcon />}
                label="Sort code"
                value={data.bank.sortCode}
                mono
                onCopy={() => copyField("sortCode", data.bank.sortCode)}
                copied={copiedField === "sortCode"}
              />
              <BankRow
                icon={<HashIcon />}
                label="Account number"
                value={data.bank.accountNumber}
                mono
                onCopy={() =>
                  copyField("accountNumber", data.bank.accountNumber)
                }
                copied={copiedField === "accountNumber"}
              />
            </div>
          </div>

          {data.allowPromo && (
            <div className="paycap__panel">
              <h2 className="paycap__panel-title">
                <TagIcon /> Promo code
              </h2>
              <div className="checkout__promo-row">
                <input
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void applyPromo();
                    }
                  }}
                  placeholder="Enter code"
                  className="mono"
                  style={{ textTransform: "uppercase" }}
                />
                <button
                  type="button"
                  onClick={() => void applyPromo()}
                  disabled={promoLoading}
                >
                  {promoLoading ? "…" : "Apply"}
                </button>
              </div>
              {promoError && (
                <p className="field__error" style={{ marginTop: "0.5rem" }}>
                  {promoError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right — upload proof */}
        <div className="paycap__panel paycap__upload">
          <h2 className="paycap__panel-title">
            <UploadIcon /> Upload payment screenshot
          </h2>
          <p className="paycap__hint">PNG, JPG, or PDF · max 25 MB.</p>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            className={`paycap__dropzone${dragOver ? " is-drag" : ""}`}
          >
            <UploadIcon />
            {file ? (
              <p className="paycap__dropzone-file">{file.name}</p>
            ) : (
              <>
                <p className="paycap__dropzone-title">
                  Drop your screenshot here, or browse
                </p>
                <p className="paycap__dropzone-hint">Click to select a file</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => pickFile(e.target.files?.[0])}
              style={{ display: "none" }}
            />
          </label>

          {uploadError && (
            <div className="paycap__banner paycap__banner--error">
              <AlertIcon />
              <span>{uploadError}</span>
            </div>
          )}
          {uploadStatus === "pending" && (
            <div className="paycap__banner paycap__banner--pending">
              <ClockIcon />
              <span>
                Screenshot received. Verification is queued; we'll email you
                with the result.
              </span>
            </div>
          )}
          {uploadStatus === "rejected" && (
            <div className="paycap__banner paycap__banner--error">
              <AlertIcon />
              <div>
                <p style={{ margin: 0 }}>
                  We couldn't verify this screenshot. Please re-upload a
                  clearer image of the transfer.
                </p>
                {rejectionReasons.length > 0 && (
                  <ul>
                    {rejectionReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn btn--primary paycap__submit"
            onClick={() => void uploadScreenshot()}
            disabled={!file || uploadStatus === "uploading"}
            data-cursor
          >
            {uploadStatus === "uploading" ? (
              <>
                <svg
                  className="paycap__spinner"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  style={{ width: "16px", height: "16px" }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9.5"
                    stroke="var(--color-bg)"
                    strokeOpacity="0.35"
                    strokeWidth="2"
                  />
                  <path
                    d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
                    stroke="var(--color-bg)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Uploading…
              </>
            ) : (
              "Submit screenshot"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

function BankRow({
  icon,
  label,
  value,
  mono = false,
  onCopy,
  copied,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="paycap__bank-row">
      <div className="paycap__bank-info">
        <span className="paycap__bank-icon" aria-hidden>
          {icon}
        </span>
        <dl className="paycap__bank-text">
          <dt>{label}</dt>
          <dd className={mono ? "mono" : undefined}>{value}</dd>
        </dl>
      </div>
      <button
        type="button"
        className={`paycap__copy${copied ? " is-copied" : ""}`}
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        data-cursor
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

// ---- inline icons (matching the site's stroke-based line-icon style) ----

function PackageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 8 12 4l8.5 4M3.5 8v8L12 20l8.5-4V8M3.5 8 12 12m0 0 8.5-4M12 12v8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16.5 12.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function LandmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10h16M5.5 10v8M9.5 10v8M14.5 10v8M18.5 10v8M3.5 20h17M12 3l9 5H3l9-5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="3.5" width="14" height="17" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8.5 7.5h1.5M14 7.5h1.5M8.5 11.5h1.5M14 11.5h1.5M8.5 15.5h1.5M14 15.5h1.5M10.5 20.5v-4h3v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3.5 7 20.5M17 3.5l-2 17M4 8.5h16M3.5 15.5h16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m3.5 12.5 8-8.6 9 .1.1 9-8.6 8a1.4 1.4 0 0 1-2 0l-6.5-6.5a1.4 1.4 0 0 1 0-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="15.2" cy="8.8" r="1.4" fill="currentColor" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15.5V5m0 0L7.5 9.5M12 5l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 15.5v2.75A2.25 2.25 0 0 0 6.75 20.5h10.5a2.25 2.25 0 0 0 2.25-2.25V15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="8.5" y="8.5" width="11" height="11" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M15.5 8.5V6.6A1.6 1.6 0 0 0 13.9 5H6.1A1.6 1.6 0 0 0 4.5 6.6v7.8A1.6 1.6 0 0 0 6.1 16h1.9"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden>
      <circle cx="30" cy="30" r="27" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path
        d="M19 30.5 27 38 42 22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.75" r="1.05" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v5.3l3.6 2.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
