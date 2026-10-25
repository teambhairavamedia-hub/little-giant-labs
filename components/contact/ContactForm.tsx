"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";

type Application = {
  enterpriseName: string;
  industry: string;
  revenue: string;
  acquisitionSpend: string;
  bottleneck: string;
  partnership: string;
  corporateEmail: string;
  linkedin: string;
};

const empty: Application = {
  enterpriseName: "",
  industry: "",
  revenue: "",
  acquisitionSpend: "",
  bottleneck: "",
  partnership: "",
  corporateEmail: "",
  linkedin: "",
};

// Canonical enum keys required by database and validation logic
const industries = [
  "Enterprise Banking & FinTech",
  "Heavy Infrastructure & Real Estate",
  "Premium Consumer Goods (D2C)",
  "Venture-Backed Technology",
  "High-Ticket B2B Services",
];
const revenues = [
  "Under $1 Million",
  "$1M – $5 Million",
  "$5M – $20 Million",
  "$20 Million+",
];
const spends = [
  "Under $10,000 / month",
  "$10,000 – $50,000 / month",
  "$50,000 – $150,000 / month",
  "$150,000+ / month",
];
const bottlenecks = [
  "Ad platform algorithmic fatigue & dropping ROAS",
  "Inability to produce high-retention visual media at scale",
  "Lack of advanced attribution models and data tracking",
  "Sub-optimal customer lifetime value (LTV) and backend CRM systems",
];
const partnershipOptions = [
  "We are looking for a cheap, hands-off execution vendor",
  "We are prepared to invest premium capital for institutional scale and long-term partnership",
];

const inputClass =
  "mt-3 w-full border-0 border-b border-lgl-sage bg-transparent px-0 py-3 text-base text-lgl-fg placeholder:text-lgl-muted outline-none transition-colors focus:border-[#C5A059] focus:ring-0";
const choiceClass =
  "flex min-h-14 cursor-pointer items-center gap-4 border border-lgl-line/40 px-4 py-3 text-sm leading-relaxed text-lgl-soft transition-colors hover:border-lgl-sage has-[:checked]:border-[#C5A059] has-[:checked]:bg-[#004B3A] has-[:checked]:text-[#F8F6F0] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#C5A059]";

function isEmailValid(email: string) {
  const match = email.trim().match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/);
  if (!match) return false;
  const domain = match[1].toLowerCase();
  return !["gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.co.in", "ymail.com"].includes(domain);
}

function validLinkedIn(url: string) {
  try {
    const parsed = new URL(url.trim());
    return (
      ["linkedin.com", "www.linkedin.com"].includes(parsed.hostname.toLowerCase()) &&
      parsed.protocol === "https:" &&
      /^\/in\/[A-Za-z0-9_%.-]+\/?$/.test(parsed.pathname)
    );
  } catch {
    return false;
  }
}

export function ContactForm() {
  const router = useRouter();
  const { dict, locale } = useI18n();

  const [values, setValues] = useState<Application>(empty);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submittingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const set = (key: keyof Application, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const requiredText = (key: keyof Application) => values[key].trim().length > 0;

  const stepValid = () => {
    if (step === 0) return requiredText("enterpriseName") && requiredText("industry");
    if (step === 1) return requiredText("revenue") && requiredText("acquisitionSpend");
    if (step === 2) return requiredText("bottleneck") && requiredText("partnership");
    return isEmailValid(values.corporateEmail) && validLinkedIn(values.linkedin);
  };

  function changeStep(next: number) {
    setError("");
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function goNext() {
    if (stepValid()) {
      changeStep(step + 1);
    } else {
      setError(dict.contact.form.validationError);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) {
      goNext();
      return;
    }
    if (!stepValid() || submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legal_name: values.enterpriseName,
          industry_vertical: values.industry,
          ttm_revenue: values.revenue,
          monthly_ad_spend: values.acquisitionSpend,
          growth_bottleneck: values.bottleneck,
          partnership_readiness: values.partnership,
          decision_maker_email: values.corporateEmail,
          decision_maker_linkedin: values.linkedin,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || dict.contact.form.serverError);
      }

      router.push(getLocalizedPath("/application-received", locale));
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : dict.contact.form.serverError
      );
    } finally {
      submittingRef.current = false;
      setBusy(false);
    }
  }

  const radioGroup = (
    key: keyof Application,
    canonicalOptions: string[],
    name: string,
    optionsMap: Record<string, string>
  ) => (
    <fieldset className="space-y-3">
      <legend className="sr-only">{name}</legend>
      {canonicalOptions.map((canonicalOption) => {
        const localizedLabel = optionsMap[canonicalOption] || canonicalOption;
        return (
          <label className={choiceClass} key={canonicalOption}>
            <input
              className="size-4 accent-[#C5A059]"
              type="radio"
              name={key}
              value={canonicalOption}
              checked={values[key] === canonicalOption}
              onChange={() => set(key, canonicalOption)}
            />
            <span>{localizedLabel}</span>
          </label>
        );
      })}
    </fieldset>
  );

  const formDict = dict.contact.form;

  return (
    <form
      onSubmit={submit}
      noValidate
      className="border border-lgl-line/30 bg-lgl-bg p-6 sm:p-10 lg:p-12"
      aria-busy={busy}
    >
      <ol
        className="mb-10 grid grid-cols-4 gap-2"
        aria-label={formDict.stepAria.replace("{step}", String(step + 1))}
      >
        {[0, 1, 2, 3].map((item) => (
          <li
            key={item}
            aria-current={item === step ? "step" : undefined}
            className="flex flex-col gap-2"
          >
            <span
              className={`text-[11px] font-semibold tracking-[.2em] ${
                item <= step ? "text-lgl-gold" : "text-lgl-soft/60"
              }`}
            >
              <span className="sr-only">{formDict.stepPrefix} </span>
              {String(item + 1).padStart(2, "0")}
            </span>
            <span
              className={`h-[2px] ${item <= step ? "bg-[#C5A059]" : "bg-lgl-track"}`}
            />
          </li>
        ))}
      </ol>

      <div className="min-h-[430px]">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mb-9 max-w-2xl font-display text-3xl leading-tight tracking-[-.04em] text-lgl-fg outline-none sm:text-4xl"
        >
          {formDict.stepTitles[step]}
        </h2>

        {step === 0 && (
          <div className="space-y-10">
            <label className="block text-sm text-lgl-fg">
              {formDict.fields.enterpriseName.label} <span className="text-lgl-gold">*</span>
              <input
                className={inputClass}
                required
                autoComplete="organization"
                placeholder={formDict.fields.enterpriseName.placeholder}
                value={values.enterpriseName}
                onChange={(e) => set("enterpriseName", e.target.value)}
              />
            </label>
            <div>
              <p className="mb-4 text-sm text-lgl-fg">
                {formDict.fields.industry.label} <span className="text-lgl-gold">*</span>
              </p>
              {radioGroup(
                "industry",
                industries,
                formDict.fields.industry.legend,
                formDict.fields.industry.options
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-10">
            <div>
              <p className="mb-4 text-sm text-lgl-fg">
                {formDict.fields.revenue.label} <span className="text-lgl-gold">*</span>
              </p>
              {radioGroup(
                "revenue",
                revenues,
                formDict.fields.revenue.legend,
                formDict.fields.revenue.options
              )}
            </div>
            <div>
              <p className="mb-4 text-sm text-lgl-fg">
                {formDict.fields.acquisitionSpend.label} <span className="text-lgl-gold">*</span>
              </p>
              {radioGroup(
                "acquisitionSpend",
                spends,
                formDict.fields.acquisitionSpend.legend,
                formDict.fields.acquisitionSpend.options
              )}
            </div>
            <p className="border-l border-[#C5A059] pl-4 text-xs leading-relaxed text-lgl-soft">
              {formDict.fields.acquisitionSpend.financialNote}
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <div>
              <p className="mb-4 text-sm text-lgl-fg">
                {formDict.fields.bottleneck.label} <span className="text-lgl-gold">*</span>
              </p>
              {radioGroup(
                "bottleneck",
                bottlenecks,
                formDict.fields.bottleneck.legend,
                formDict.fields.bottleneck.options
              )}
            </div>
            <div>
              <p className="mb-4 text-sm leading-relaxed text-lgl-fg">
                {formDict.fields.partnership.label} <span className="text-lgl-gold">*</span>
              </p>
              {radioGroup(
                "partnership",
                partnershipOptions,
                formDict.fields.partnership.legend,
                formDict.fields.partnership.options
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10">
            <p className="max-w-xl text-sm leading-relaxed text-lgl-soft">
              {formDict.fields.corporateEmail.instruction}
            </p>
            <label className="block text-sm text-lgl-fg">
              {formDict.fields.corporateEmail.label} <span className="text-lgl-gold">*</span>
              <input
                className={inputClass}
                type="email"
                required
                autoComplete="email"
                placeholder={formDict.fields.corporateEmail.placeholder}
                value={values.corporateEmail}
                onChange={(e) => set("corporateEmail", e.target.value)}
                aria-describedby="email-hint"
              />
              <span id="email-hint" className="mt-2 block text-xs text-lgl-soft">
                {formDict.fields.corporateEmail.hint}
              </span>
              {values.corporateEmail && !isEmailValid(values.corporateEmail) && (
                <span className="mt-2 block text-xs text-lgl-gold" role="status">
                  {formDict.fields.corporateEmail.error}
                </span>
              )}
            </label>
            <label className="block text-sm text-lgl-fg">
              {formDict.fields.linkedin.label} <span className="text-lgl-gold">*</span>
              <input
                className={inputClass}
                type="url"
                required
                autoComplete="url"
                placeholder={formDict.fields.linkedin.placeholder}
                value={values.linkedin}
                onChange={(e) => set("linkedin", e.target.value)}
              />
              {values.linkedin && !validLinkedIn(values.linkedin) && (
                <span className="mt-2 block text-xs text-lgl-gold" role="status">
                  {formDict.fields.linkedin.error}
                </span>
              )}
            </label>
          </div>
        )}
      </div>

      {error && (
        <p className="mb-5 border border-[#C5A059] bg-lgl-bg p-4 text-sm text-lgl-fg" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-4 border-t border-lgl-line/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => changeStep(Math.max(0, step - 1))}
          disabled={step === 0 || busy}
          className="min-h-12 px-2 text-left text-xs font-semibold uppercase tracking-[.18em] text-lgl-soft transition-colors hover:text-lgl-fg disabled:cursor-not-allowed disabled:text-lgl-sage cursor-pointer"
        >
          {formDict.back}
        </button>

        {step < 3 ? (
          <button
            key="continue"
            type="button"
            onClick={goNext}
            className="min-h-12 bg-[#C5A059] px-7 text-xs font-bold uppercase tracking-[.18em] text-[#0B1B2B] transition-colors hover:bg-lgl-gold-hover focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#C5A059] cursor-pointer"
          >
            {formDict.continue}
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={busy}
            className="min-h-12 bg-[#C5A059] px-7 text-xs font-bold uppercase tracking-[.18em] text-[#0B1B2B] transition-colors hover:bg-lgl-gold-hover focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#C5A059] disabled:cursor-wait disabled:bg-[#8BA898] cursor-pointer"
          >
            {busy ? formDict.submitting : formDict.submit}
          </button>
        )}
      </div>
    </form>
  );
}
