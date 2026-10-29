"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";
import { EMAIL_ELIGIBILITY_MESSAGES, isEmailFormatValid, type EmailEligibilityOutcome } from "@/lib/email-eligibility";
import { APPLICATION_LIMITS, applicationOptions } from "@/lib/application-options";

type Enquiry = {
  contactName: string;
  workEmail: string;
  companyName: string;
  role: string;
  helpWith: string;
  projectDetails: string;
  timeline: string;
};

const empty: Enquiry = {
  contactName: "",
  workEmail: "",
  companyName: "",
  role: "",
  helpWith: "",
  projectDetails: "",
  timeline: "",
};

const LAST_STEP = 2;

const inputClass =
  "mt-3 w-full border-0 border-b border-lgl-sage bg-transparent px-0 py-3 text-base text-lgl-fg placeholder:text-lgl-muted outline-none transition-colors focus:border-[#C5A059] focus:ring-0";
const textareaClass =
  "mt-3 block min-h-36 w-full resize-y border border-lgl-line/40 bg-transparent px-4 py-3 text-base leading-relaxed text-lgl-fg placeholder:text-lgl-muted outline-none transition-colors focus:border-[#C5A059] focus:ring-0";
const selectClass =
  "mt-3 w-full cursor-pointer border-0 border-b border-lgl-sage bg-lgl-bg px-0 py-3 text-base text-lgl-fg outline-none transition-colors focus:border-[#C5A059] focus:ring-0";
const choiceClass =
  "flex min-h-14 cursor-pointer items-center gap-4 border border-lgl-line/40 px-4 py-3 text-sm leading-relaxed text-lgl-soft transition-colors hover:border-lgl-sage has-[:checked]:border-[#C5A059] has-[:checked]:bg-[#004B3A] has-[:checked]:text-[#F8F6F0] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#C5A059]";

export function ContactForm() {
  const router = useRouter();
  const { dict, locale } = useI18n();

  const [values, setValues] = useState<Enquiry>(empty);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [emailCheck, setEmailCheck] = useState<{
    email: string;
    outcome: EmailEligibilityOutcome | "idle" | "checking" | "invalid" | "unavailable";
  }>({ email: "", outcome: "idle" });
  const submittingRef = useRef(false);
  const idempotencyKeyRef = useRef<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const set = (key: keyof Enquiry, value: string) => {
    if (values[key] !== value) idempotencyKeyRef.current = null;
    setValues((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const filled = (key: keyof Enquiry, max: number) => {
    const length = values[key].trim().length;
    return length > 0 && length <= max;
  };

  useEffect(() => {
    const email = values.workEmail.trim().toLowerCase();
    if (!email || !isEmailFormatValid(email) || email.length > 254) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setEmailCheck({ email, outcome: "checking" });
      try {
        const response = await fetch("/api/applications/email-eligibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Email eligibility could not be checked.");
        const result = await response.json() as { outcome?: EmailEligibilityOutcome | "invalid" };
        if (["eligible", "disposable", "free", "invalid"].includes(result.outcome ?? "")) {
          setEmailCheck({ email, outcome: result.outcome as EmailEligibilityOutcome | "invalid" });
        } else {
          setEmailCheck({ email, outcome: "unavailable" });
        }
      } catch {
        if (!controller.signal.aborted) setEmailCheck({ email, outcome: "unavailable" });
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [values.workEmail]);

  // The first two steps contain required answers; the final step is optional context.
  const stepValid = () => {
    if (step === 0) {
      const email = values.workEmail.trim().toLowerCase();
      const recognizedIneligible = emailCheck.email === email &&
        (emailCheck.outcome === "disposable" || emailCheck.outcome === "free");
      return filled("contactName", APPLICATION_LIMITS.contactName) &&
        filled("companyName", APPLICATION_LIMITS.companyName) &&
        email.length <= 254 && isEmailFormatValid(email) && !recognizedIneligible;
    }
    if (step === 1) return values.helpWith !== "" && filled("projectDetails", APPLICATION_LIMITS.projectDetails);
    return true;
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
    if (step < LAST_STEP) {
      goNext();
      return;
    }
    if (!stepValid() || submittingRef.current) return;
    submittingRef.current = true;
    const idempotencyKey = idempotencyKeyRef.current ?? `application-submission:${Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
    idempotencyKeyRef.current = idempotencyKey;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        // Optional answers are sent blank when skipped; the server stores them as NULL.
        body: JSON.stringify({
          contact_name: values.contactName,
          decision_maker_email: values.workEmail,
          legal_name: values.companyName,
          contact_role: values.role,
          help_with: values.helpWith,
          project_details: values.projectDetails,
          timeline: values.timeline,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || dict.contact.form.serverError);
      }

      router.push(getLocalizedPath("/application-received", locale));
      idempotencyKeyRef.current = null;
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

  const formDict = dict.contact.form;
  const optionalTag = <span className="ml-2 text-xs text-lgl-soft">({formDict.optionalTag})</span>;

  /* Optional single-choice answer as a native select; the empty option means "not answered". */
  const optionalSelect = (
    key: keyof Enquiry,
    label: string,
    canonicalOptions: readonly string[],
    optionsMap: Record<string, string>
  ) => (
    <label className="block text-sm text-lgl-fg">
      {label}
      {optionalTag}
      <select className={selectClass} value={values[key]} onChange={(e) => set(key, e.target.value)}>
        <option value="">{formDict.selectPlaceholder}</option>
        {canonicalOptions.map((option) => (
          <option key={option} value={option}>
            {optionsMap[option] || option}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <form
      onSubmit={submit}
      noValidate
      className="border border-lgl-line/30 bg-lgl-bg p-6 sm:p-10 lg:p-12"
      aria-busy={busy}
    >
      <ol
        className="mb-10 grid grid-cols-3 gap-2"
        aria-label={formDict.stepAria.replace("{step}", String(step + 1))}
      >
        {[0, 1, 2].map((item) => (
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
              {formDict.fields.contactName.label} <span className="text-lgl-gold">*</span>
              <input
                className={inputClass}
                required
                maxLength={APPLICATION_LIMITS.contactName}
                autoComplete="name"
                placeholder={formDict.fields.contactName.placeholder}
                value={values.contactName}
                onChange={(e) => set("contactName", e.target.value)}
              />
            </label>
            <label className="block text-sm text-lgl-fg">
              {formDict.fields.workEmail.label} <span className="text-lgl-gold">*</span>
              <input
                className={inputClass}
                type="email"
                required
                autoComplete="email"
                placeholder={formDict.fields.workEmail.placeholder}
                value={values.workEmail}
                onChange={(e) => set("workEmail", e.target.value)}
                aria-describedby="email-hint email-eligibility-status"
              />
              <span id="email-hint" className="mt-2 block text-xs text-lgl-soft">
                {formDict.fields.workEmail.hint}
              </span>
              {values.workEmail && (!isEmailFormatValid(values.workEmail) || values.workEmail.trim().length > 254) && (
                <span className="mt-2 block text-xs text-lgl-gold" role="status">
                  {formDict.fields.workEmail.error}
                </span>
              )}
              <span id="email-eligibility-status" className="mt-2 block text-xs text-lgl-gold" role="status" aria-live="polite">
                {emailCheck.email === values.workEmail.trim().toLowerCase() && emailCheck.outcome === "disposable"
                  ? EMAIL_ELIGIBILITY_MESSAGES.disposable
                  : emailCheck.email === values.workEmail.trim().toLowerCase() && emailCheck.outcome === "free"
                    ? EMAIL_ELIGIBILITY_MESSAGES.free
                    : emailCheck.email === values.workEmail.trim().toLowerCase() && emailCheck.outcome === "checking"
                      ? "Checking email eligibility…"
                      : ""}
              </span>
            </label>
            <label className="block text-sm text-lgl-fg">
              {formDict.fields.companyName.label} <span className="text-lgl-gold">*</span>
              <input
                className={inputClass}
                required
                maxLength={APPLICATION_LIMITS.companyName}
                autoComplete="organization"
                placeholder={formDict.fields.companyName.placeholder}
                value={values.companyName}
                onChange={(e) => set("companyName", e.target.value)}
              />
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-10">
            {optionalSelect("role", formDict.fields.role.label, applicationOptions.contact_role, formDict.fields.role.options)}
            <fieldset className="space-y-3">
              <legend className="mb-4 text-sm text-lgl-fg">
                {formDict.fields.helpWith.label} <span className="text-lgl-gold">*</span>
              </legend>
              {applicationOptions.help_with.map((option) => (
                <label className={choiceClass} key={option}>
                  <input
                    className="size-4 accent-[#C5A059]"
                    type="radio"
                    name="helpWith"
                    value={option}
                    checked={values.helpWith === option}
                    onChange={() => set("helpWith", option)}
                  />
                  <span>{formDict.fields.helpWith.options[option] || option}</span>
                </label>
              ))}
            </fieldset>
            <label className="block text-sm text-lgl-fg">
              {formDict.fields.projectDetails.label} <span className="text-lgl-gold">*</span>
              <textarea
                className={textareaClass}
                required
                rows={5}
                maxLength={APPLICATION_LIMITS.projectDetails}
                placeholder={formDict.fields.projectDetails.placeholder}
                value={values.projectDetails}
                onChange={(e) => set("projectDetails", e.target.value)}
                aria-describedby="project-hint"
              />
              <span id="project-hint" className="mt-2 flex justify-between gap-4 text-xs text-lgl-soft">
                <span>{formDict.fields.projectDetails.hint}</span>
                <span className="tabular-nums" aria-hidden="true">
                  {values.projectDetails.length}/{APPLICATION_LIMITS.projectDetails}
                </span>
              </span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <p className="text-sm leading-relaxed text-lgl-soft">{formDict.optionalNote}</p>
            {optionalSelect("timeline", formDict.fields.timeline.label, applicationOptions.timeline, formDict.fields.timeline.options)}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-8 mb-5 border-l-4 border-[#C5A059] bg-[#C5A059]/10 p-4 text-sm leading-relaxed text-lgl-fg" role="alert">
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

        {step < LAST_STEP ? (
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
