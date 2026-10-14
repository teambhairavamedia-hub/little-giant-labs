"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Application = {
  enterpriseName: string; industry: string; industryOther: string;
  revenue: string; revenueCustom: string; acquisitionSpend: string; spendCustom: string;
  bottleneck: string; bottleneckOther: string; partnership: string;
  corporateEmail: string; linkedin: string;
};

const empty: Application = { enterpriseName: "", industry: "", industryOther: "", revenue: "", revenueCustom: "", acquisitionSpend: "", spendCustom: "", bottleneck: "", bottleneckOther: "", partnership: "", corporateEmail: "", linkedin: "" };
const industries = ["Enterprise Banking & FinTech", "Heavy Infrastructure & Real Estate", "Premium Consumer Goods (D2C)", "Venture-Backed Technology", "High-Ticket B2B Services", "Other"];
const revenues = ["Under $1 Million", "$1M–$5 Million", "$5M–$20 Million", "$20 Million+", "Other / Enter custom amount or range"];
const spends = ["Under $10,000 / month", "$10,000–$50,000 / month", "$50,000–$150,000 / month", "$150,000+ / month", "Other / Enter custom amount or range"];
const bottlenecks = ["Ad platform algorithmic fatigue & dropping ROAS", "Inability to produce high-retention visual media at scale", "Lack of advanced attribution models and data tracking", "Sub-optimal customer lifetime value (LTV) and backend CRM systems", "Other"];
const partnershipOptions = ["We are looking for a cheap, hands-off execution vendor.", "We are prepared to invest premium capital for institutional scale and long-term partnership."];
const inputClass = "mt-3 w-full border-0 border-b border-[#8BA898] bg-transparent px-0 py-3 text-base text-[#F8F6F0] placeholder:text-[#E2E8F0] outline-none transition-colors focus:border-[#C5A059] focus:ring-0";
const choiceClass = "flex min-h-14 cursor-pointer items-center gap-4 border border-[#F0F4F8]/40 px-4 py-3 text-sm leading-relaxed text-[#E2E8F0] transition-colors hover:border-[#8BA898] has-[:checked]:border-[#C5A059] has-[:checked]:bg-[#004B3A] has-[:checked]:text-[#F8F6F0] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#C5A059]";

function isEmailValid(email: string) {
  const match = email.trim().match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/);
  if (!match) return false;
  const domain = match[1].toLowerCase();
  return !["gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.co.in", "ymail.com"].includes(domain);
}

function validLinkedIn(url: string) {
  try {
    const parsed = new URL(url.trim());
    return ["linkedin.com", "www.linkedin.com"].includes(parsed.hostname.toLowerCase()) && parsed.protocol === "https:" && /^\/in\/[A-Za-z0-9_%.-]+\/?$/.test(parsed.pathname);
  } catch { return false; }
}

export function ContactForm() {
  const router = useRouter();
  const [values, setValues] = useState<Application>(empty);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const set = (key: keyof Application, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const requiredText = (key: keyof Application) => values[key].trim().length > 0;
  const stepValid = () => {
    if (step === 0) return requiredText("enterpriseName") && requiredText("industry") && (values.industry !== "Other" || requiredText("industryOther"));
    if (step === 1) return requiredText("revenue") && (values.revenue !== revenues[4] || requiredText("revenueCustom")) && requiredText("acquisitionSpend") && (values.acquisitionSpend !== spends[4] || requiredText("spendCustom")) && [values.revenueCustom, values.spendCustom].every((amount) => !amount || /^[\p{Sc}\p{L}\d\s.,'’–—-]+$/u.test(amount.trim()));
    if (step === 2) return requiredText("bottleneck") && (values.bottleneck !== "Other" || requiredText("bottleneckOther")) && requiredText("partnership");
    return isEmailValid(values.corporateEmail) && validLinkedIn(values.linkedin);
  };

  function changeStep(next: number) { setError(""); setStep(next); requestAnimationFrame(() => headingRef.current?.focus()); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stepValid() || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "We couldn’t submit your application. Please try again later.");
      }
      router.push("/application-received");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We couldn’t submit your application. Please try again.");
    } finally { setBusy(false); }
  }

  const radioGroup = (key: keyof Application, options: string[], name: string) => (
    <fieldset className="space-y-3">
      <legend className="sr-only">{name}</legend>
      {options.map((option) => <label className={choiceClass} key={option}>
        <input className="size-4 accent-[#C5A059]" type="radio" name={key} value={option} checked={values[key] === option} onChange={() => set(key, option)} />
        <span>{option}</span>
      </label>)}
    </fieldset>
  );

  return <form onSubmit={submit} noValidate className="border border-[#F0F4F8]/30 bg-[#0B1B2B] p-6 sm:p-10 lg:p-12" aria-busy={busy}>
    <div className="mb-10 flex items-center justify-between border-b border-[#F0F4F8]/30 pb-5">
      <span className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#8BA898]">High-Ticket Application Vetting Questions</span>
      <span className="font-display text-sm text-[#C5A059]">{String(step + 1).padStart(2, "0")} <span className="text-[#E2E8F0]">/ 04</span></span>
    </div>
    <div className="mb-10 flex gap-2" aria-label={`Step ${step + 1} of 4`}>
      {[0, 1, 2, 3].map((item) => <span key={item} className={`h-[2px] flex-1 ${item <= step ? "bg-[#C5A059]" : "bg-[#F0F4F8]"}`} />)}
    </div>
    <div className="min-h-[430px]">
      <h2 ref={headingRef} tabIndex={-1} className="mb-9 max-w-2xl font-display text-3xl leading-tight tracking-[-.04em] text-[#F8F6F0] outline-none sm:text-4xl">
        { ["Corporate identity & positioning", "Financial profile", "Strategic roadblocks & expectations", "Executive access"][step] }
      </h2>
      {step === 0 && <div className="space-y-10">
        <label className="block text-sm text-[#F8F6F0]">What is the legal registered name of your enterprise? <span className="text-[#C5A059]">*</span><input className={inputClass} required autoComplete="organization" placeholder="Enter your registered enterprise name" value={values.enterpriseName} onChange={(e) => set("enterpriseName", e.target.value)} /></label>
        <div><p className="mb-4 text-sm text-[#F8F6F0]">Which industry vertical does your brand seek to dominate? <span className="text-[#C5A059]">*</span></p>{radioGroup("industry", industries, "Industry vertical")}{values.industry === "Other" && <label className="mt-5 block text-sm text-[#F8F6F0]">Specify your industry <span className="text-[#C5A059]">*</span><input className={inputClass} required value={values.industryOther} onChange={(e) => set("industryOther", e.target.value)} /></label>}</div>
      </div>}
      {step === 1 && <div className="space-y-10">
        <div><p className="mb-4 text-sm text-[#F8F6F0]">What is your verified trailing 12-month (TTM) revenue? <span className="text-[#C5A059]">*</span></p>{radioGroup("revenue", revenues, "Trailing 12-month revenue")}{values.revenue === revenues[4] && <label className="mt-5 block text-sm text-[#F8F6F0]">Custom amount or range <span className="text-[#C5A059]">*</span><input className={inputClass} required placeholder="Amount or range, with currency (e.g. INR 2–3 crore)" value={values.revenueCustom} onChange={(e) => set("revenueCustom", e.target.value)} /><span className="mt-2 block text-xs text-[#E2E8F0]">Please identify the currency. Any currency and amount are welcome.</span></label>}</div>
        <div><p className="mb-4 text-sm text-[#F8F6F0]">What is your current allocated monthly capital spend for paid customer acquisition? <span className="text-[#C5A059]">*</span></p>{radioGroup("acquisitionSpend", spends, "Monthly customer acquisition spend")}{values.acquisitionSpend === spends[4] && <label className="mt-5 block text-sm text-[#F8F6F0]">Custom amount or range <span className="text-[#C5A059]">*</span><input className={inputClass} required placeholder="Amount or range, with currency (e.g. INR 5–8 lakh / month)" value={values.spendCustom} onChange={(e) => set("spendCustom", e.target.value)} /><span className="mt-2 block text-xs text-[#E2E8F0]">Please identify the currency. Any currency and amount are welcome.</span></label>}</div>
        <p className="border-l border-[#C5A059] pl-4 text-xs leading-relaxed text-[#E2E8F0]">Financial information supports internal review only. It does not determine eligibility to submit.</p>
      </div>}
      {step === 2 && <div className="space-y-10">
        <div><p className="mb-4 text-sm text-[#F8F6F0]">What is the primary architectural bottleneck stalling your current digital growth scale? <span className="text-[#C5A059]">*</span></p>{radioGroup("bottleneck", bottlenecks, "Primary growth bottleneck")}{values.bottleneck === "Other" && <label className="mt-5 block text-sm text-[#F8F6F0]">Describe your primary bottleneck <span className="text-[#C5A059]">*</span><input className={inputClass} required value={values.bottleneckOther} onChange={(e) => set("bottleneckOther", e.target.value)} /></label>}</div>
        <div><p className="mb-4 text-sm leading-relaxed text-[#F8F6F0]">We operate strictly as an institutional growth partner on high-ticket monthly retainers + performance incentives. Are you looking for a traditional execution vendor, or are you fully capitalized to invest in top-tier growth architecture? <span className="text-[#C5A059]">*</span></p>{radioGroup("partnership", partnershipOptions, "Partnership expectations")}</div>
      </div>}
      {step === 3 && <div className="space-y-10">
        <p className="max-w-xl text-sm leading-relaxed text-[#E2E8F0]">Provide the direct corporate email address and LinkedIn profile of the presiding decision-maker (CEO, CMO, or Managing Partner).</p>
        <label className="block text-sm text-[#F8F6F0]">A. Corporate email address <span className="text-[#C5A059]">*</span><input className={inputClass} type="email" required autoComplete="email" placeholder="name@company.com" value={values.corporateEmail} onChange={(e) => set("corporateEmail", e.target.value)} aria-describedby="email-hint"/><span id="email-hint" className="mt-2 block text-xs text-[#E2E8F0]">Use your organization’s email. Consumer addresses such as Gmail and Yahoo are not accepted.</span>{values.corporateEmail && !isEmailValid(values.corporateEmail) && <span className="mt-2 block text-xs text-[#C5A059]" role="status">Enter a valid corporate email address. Gmail and Yahoo addresses are not accepted.</span>}</label>
        <label className="block text-sm text-[#F8F6F0]">B. LinkedIn profile URL <span className="text-[#C5A059]">*</span><input className={inputClass} type="url" required autoComplete="url" placeholder="https://www.linkedin.com/in/your-profile" value={values.linkedin} onChange={(e) => set("linkedin", e.target.value)} />{values.linkedin && !validLinkedIn(values.linkedin) && <span className="mt-2 block text-xs text-[#C5A059]" role="status">Enter a valid LinkedIn profile URL, such as https://www.linkedin.com/in/your-profile.</span>}</label>
      </div>}
    </div>
    {error && <p className="mb-5 border border-[#C5A059] bg-[#0B1B2B] p-4 text-sm text-[#F8F6F0]" role="alert">{error}</p>}
    <div className="flex flex-col-reverse gap-4 border-t border-[#F0F4F8]/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" onClick={() => changeStep(Math.max(0, step - 1))} disabled={step === 0 || busy} className="min-h-12 px-2 text-left text-xs font-semibold uppercase tracking-[.18em] text-[#E2E8F0] transition-colors hover:text-[#F8F6F0] disabled:cursor-not-allowed disabled:text-[#8BA898]">← Back</button>
      {step < 3 ? <button type="button" onClick={() => stepValid() ? changeStep(step + 1) : setError("Complete the required fields and check your answers to continue.")} className="min-h-12 bg-[#C5A059] px-7 text-xs font-bold uppercase tracking-[.18em] text-[#0B1B2B] transition-colors hover:bg-[#F8F6F0] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#C5A059]">Continue <span aria-hidden="true">→</span></button> : <button type="submit" disabled={busy} className="min-h-12 bg-[#C5A059] px-7 text-xs font-bold uppercase tracking-[.18em] text-[#0B1B2B] transition-colors hover:bg-[#F8F6F0] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#C5A059] disabled:cursor-wait disabled:bg-[#8BA898]">{busy ? "Submitting…" : "Submit Application"}</button>}
    </div>
  </form>;
}
