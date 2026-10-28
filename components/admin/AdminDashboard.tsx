"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeContactEmail, normalizeLinkedInProfileUrl } from "@/lib/admin-contact-links";

type Application = {
  id: string; legal_name: string; contact_name: string | null; help_with: string | null; budget_range: string | null;
  qualification_status: "qualified" | "rejected" | "pending_review"; submitted_at: string; decision_maker_email: string;
};
type DashboardData = {
  applications: Application[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  metrics: {
    totalApplications: number; newApplicationsLast7Days: number; qualifiedApplicationsLast7Days: number;
    qualification: { qualified: number; rejected: number; pendingReview: number }; window: { startsAt: string; endsAt: string };
  };
};
/* Enquiry fields (contact form v2) plus legacy partnership-application answers kept on older rows */
type ApplicationDetail = Application & {
  project_details: string | null; company_size: string | null; industry_vertical: string | null; timeline: string | null;
  ttm_revenue: string | null; monthly_ad_spend: string | null; growth_bottleneck: string | null;
  partnership_readiness: string | null; decision_maker_linkedin: string | null; rejection_reasons: unknown;
};

const rejectionLabels: Record<string, string> = {
  ttm_revenue_below_1m: "Trailing twelve-month revenue below $1 million",
  monthly_ad_spend_below_10k: "Monthly paid acquisition spend below $10,000",
  cheap_execution_vendor: "Seeking a low-cost, hands-off execution vendor",
};

const numberFormat = new Intl.NumberFormat("en-US");
const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export function AdminDashboard() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const load = useCallback(async (requestedPage: number) => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/admin/applications?page=${requestedPage}&pageSize=25`, { cache: "no-store" });
      if (response.status === 401) { router.replace("/admin/login"); router.refresh(); return; }
      if (!response.ok) throw new Error("Application data could not be loaded. Please try again.");
      const result = await response.json() as DashboardData;
      setData(result); setPage(requestedPage);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Application data could not be loaded. Please try again.");
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(1); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  const qualified = data?.metrics.qualification.qualified ?? 0;
  const rejected = data?.metrics.qualification.rejected ?? 0;
  const pendingReview = data?.metrics.qualification.pendingReview ?? 0;
  const breakdownTotal = qualified + rejected + pendingReview;
  const qualifiedPercent = breakdownTotal ? Math.round(qualified / breakdownTotal * 100) : 0;
  const rejectedPercent = breakdownTotal ? Math.round(rejected / breakdownTotal * 100) : 0;
  const pendingReviewPercent = breakdownTotal ? 100 - qualifiedPercent - rejectedPercent : 0;

  const openDetail = (application: Application, button: HTMLButtonElement) => {
    openerRef.current = button;
    setSelected(application);
  };
  const closeDetail = useCallback(() => {
    setSelected(null);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  return <div className="mt-9 space-y-8">
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
      <p>{error}</p><button onClick={() => void load(page)} className="mt-3 font-semibold underline underline-offset-4">Retry</button>
    </div>}
    {loading && !data ? <div className="grid gap-4 md:grid-cols-3"><div className="h-32 animate-pulse rounded-2xl bg-white" /><div className="h-32 animate-pulse rounded-2xl bg-white" /><div className="h-32 animate-pulse rounded-2xl bg-white" /></div> : data && <>
      <section aria-label="Application metrics" className="grid gap-4 md:grid-cols-3">
        <Metric label="Total applications" value={data.metrics.totalApplications} />
        <Metric label="New applications · last 7 days" value={data.metrics.newApplicationsLast7Days} />
        <Metric label="Qualified · last 7 days" value={data.metrics.qualifiedApplicationsLast7Days} />
      </section>
      <section aria-labelledby="qualification-heading" className="rounded-2xl border border-[#e8e8e6] bg-white p-6 sm:p-8">
        <div><p className="label-eyebrow text-[#800000]">All time</p><h2 id="qualification-heading" className="mt-3 text-2xl font-semibold">Qualification breakdown</h2></div>
        {breakdownTotal === 0 ? <p className="mt-7 text-sm text-[#6b6b6b]">No applications have been received.</p> : <div className="mt-7 flex flex-col items-center gap-8 sm:flex-row">
          <div role="img" aria-label={`Application status: ${qualified} qualified (${qualifiedPercent}%), ${rejected} rejected (${rejectedPercent}%), ${pendingReview} pending review (${pendingReviewPercent}%)`} className="h-40 w-40 shrink-0 rounded-full" style={{ background: `conic-gradient(#15803d 0% ${qualifiedPercent}%, #b91c1c ${qualifiedPercent}% ${qualifiedPercent + rejectedPercent}%, #0284c7 ${qualifiedPercent + rejectedPercent}% 100%)` }} />
          <ul className="grid w-full gap-4 sm:grid-cols-3">
            <Breakdown label="Qualified" count={qualified} percent={qualifiedPercent} color="#15803d" labelClass="text-green-800" />
            <Breakdown label="Rejected" count={rejected} percent={rejectedPercent} color="#b91c1c" labelClass="text-red-800" />
            <Breakdown label="Pending review" count={pendingReview} percent={pendingReviewPercent} color="#0284c7" labelClass="text-sky-800" />
          </ul>
        </div>}
      </section>
      <section aria-labelledby="applications-heading" className="overflow-hidden rounded-2xl border border-[#e8e8e6] bg-white">
        <div className="flex flex-col gap-2 border-b border-[#e8e8e6] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div><p className="label-eyebrow text-[#800000]">Submissions</p><h2 id="applications-heading" className="mt-3 text-2xl font-semibold">Applications</h2></div>
          <p className="text-sm text-[#6b6b6b]">{numberFormat.format(data.pagination.total)} total</p>
        </div>
        {data.pagination.total === 0 ? <p className="px-6 py-10 text-center text-sm text-[#6b6b6b]">No applications have been received.</p> : <>
          {loading && <p className="px-6 py-2 text-xs text-[#6b6b6b]" role="status">Loading applications…</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
              <thead><tr className="bg-[#f7f7f6] text-xs text-[#6b6b6b]"><th scope="col" className="px-5 py-3 font-medium sm:px-7">Company or brand</th><th scope="col" className="px-4 py-3 font-medium">Contact</th><th scope="col" className="px-4 py-3 font-medium">Needs help with</th><th scope="col" className="px-4 py-3 font-medium">Budget</th><th scope="col" className="px-4 py-3 font-medium">Status</th><th scope="col" className="px-4 py-3 font-medium">Email</th><th scope="col" className="px-5 py-3 font-medium sm:px-7">Submitted (IST)</th></tr></thead>
              <tbody>{data.applications.map((application) => {
                const email = normalizeContactEmail(application.decision_maker_email);
                return <tr key={application.id} className="border-t border-[#eeeeec] align-top">
                <td className="px-5 py-4 font-medium sm:px-7"><button type="button" onClick={(event) => openDetail(application, event.currentTarget)} className="text-left underline decoration-[#800000]/30 underline-offset-4 hover:text-[#800000] hover:decoration-[#800000] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]">{application.legal_name}<span className="sr-only"> — View application</span></button></td><td className="px-4 py-4">{application.contact_name ?? "—"}</td><td className="px-4 py-4">{application.help_with ?? "—"}</td><td className="px-4 py-4">{application.budget_range ?? "—"}</td>
                <td className="px-4 py-4 text-center"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${application.qualification_status === "qualified" ? "bg-emerald-50 text-emerald-800" : application.qualification_status === "rejected" ? "bg-amber-50 text-amber-900" : "bg-sky-50 text-sky-900"}`}>{application.qualification_status === "pending_review" ? "Pending review" : application.qualification_status === "qualified" ? "Qualified" : "Rejected"}</span></td>
                <td className="max-w-44 px-4 py-4">{email ? <a href={`mailto:${email.split("@").map(encodeURIComponent).join("@")}`} title={email} aria-label={`Email applicant at ${email}`} className="block max-w-44 truncate text-[#800000] underline decoration-[#800000]/30 underline-offset-4 hover:decoration-[#800000] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]">{email}</a> : <span className="text-[#6b6b6b]" aria-label="Email unavailable">—</span>}</td>
                <td className="whitespace-nowrap px-5 py-4 text-[#6b6b6b] sm:px-7"><time dateTime={application.submitted_at}>{dateFormat.format(new Date(application.submitted_at))}</time></td>
              </tr>;
              })}</tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-[#e8e8e6] px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-[#6b6b6b]">Page {page} of {data.pagination.totalPages} · {numberFormat.format(data.pagination.total)} applications</p>
            <div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => void load(page - 1)} className="rounded-lg border border-[#d9d9d6] px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40">Previous</button><button disabled={page >= data.pagination.totalPages || loading} onClick={() => void load(page + 1)} className="rounded-lg border border-[#d9d9d6] px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40">Next</button></div>
          </div>
        </>}
      </section>
    </>}
    {selected && <ApplicationDetailPanel key={selected.id} id={selected.id} onClose={closeDetail} />}
  </div>;
}

function ApplicationDetailPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLElement>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setError(""); setApplication(null);
    try {
      const response = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, { cache: "no-store", signal });
      if (response.status === 401) { window.location.assign("/admin/login"); return; }
      if (!response.ok) {
        if (response.status === 404) throw new Error("This application could not be found.");
        throw new Error("Application details could not be loaded. Please try again.");
      }
      const result = await response.json() as { application: ApplicationDetail };
      setApplication(result.application);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setError(cause instanceof Error ? cause.message : "Application details could not be loaded. Please try again.");
    } finally { if (!signal?.aborted) setLoading(false); }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => { void load(controller.signal); }, 0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panelRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); onClose(); }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { window.clearTimeout(timer); controller.abort(); document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [load, onClose]);

  const email = normalizeContactEmail(application?.decision_maker_email);
  const linkedin = normalizeLinkedInProfileUrl(application?.decision_maker_linkedin);
  const reasons = Array.isArray(application?.rejection_reasons) ? application.rejection_reasons : [];
  const answer = (value: unknown) => typeof value === "string" && value.trim() ? value : "—";
  const hasLegacyAnswers = Boolean(application && [application.ttm_revenue, application.monthly_ad_spend, application.growth_bottleneck, application.partnership_readiness, application.decision_maker_linkedin]
    .some((value) => typeof value === "string" && value.trim()));

  return <div className="fixed inset-0 z-[100] bg-black/45" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="application-detail-title" tabIndex={-1} className="ml-auto flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl outline-none">
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#e8e8e6] bg-white px-5 py-5 sm:px-8">
        <div><p className="label-eyebrow text-[#800000]">Application details</p><h2 id="application-detail-title" className="mt-2 text-xl font-semibold sm:text-2xl">{application?.legal_name ?? "Application"}</h2></div>
        <button type="button" onClick={onClose} aria-label="Close application details" className="rounded-lg border border-[#d9d9d6] px-3 py-2 text-sm hover:border-[#800000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]">Close</button>
      </header>
      <div className="space-y-6 p-5 sm:p-8">
        {loading && <p role="status" className="py-8 text-sm text-[#6b6b6b]">Loading application details…</p>}
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"><p>{error}</p>{!error.includes("could not be found") && <button type="button" onClick={() => void load()} className="mt-3 font-semibold underline underline-offset-4">Retry</button>}</div>}
        {application && <>
          <div className="flex flex-wrap items-center justify-between gap-3"><span className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${application.qualification_status === "qualified" ? "bg-emerald-50 text-emerald-800" : application.qualification_status === "rejected" ? "bg-amber-50 text-amber-900" : "bg-sky-50 text-sky-900"}`}>{application.qualification_status === "pending_review" ? "Pending review" : application.qualification_status === "qualified" ? "Qualified" : "Rejected"}</span><time className="text-sm text-[#6b6b6b]" dateTime={application.submitted_at}>{dateFormat.format(new Date(application.submitted_at))} IST</time></div>
          {application.qualification_status === "rejected" && <section aria-labelledby="reasons-heading" className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 id="reasons-heading" className="font-semibold text-amber-950">Stored rejection reasons</h3>{reasons.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950">{reasons.map((reason, index) => { const code = typeof reason === "string" ? reason : ""; const label = rejectionLabels[code] ?? (code ? code.replace(/[_-]+/g, " ") : "Unrecognized stored reason"); return <li key={`${code}-${index}`}>{label}</li>; })}</ul> : <p className="mt-2 text-sm text-amber-950">No rejection reasons were stored.</p>}</section>}
          <dl className="divide-y divide-[#eeeeec] rounded-xl border border-[#e8e8e6] px-4 sm:px-5">
            <DetailField label="Name" value={answer(application.contact_name)} />
            <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">Work email</dt><dd className="mt-2 break-words text-sm leading-relaxed">{email ? <a className="text-[#800000] underline underline-offset-4" href={`mailto:${email.split("@").map(encodeURIComponent).join("@")}`}>{email}</a> : "—"}</dd></div>
            <DetailField label="Company or brand name" value={answer(application.legal_name)} />
            <DetailField label="What they need help with" value={answer(application.help_with)} />
            <DetailField label="About the project" value={answer(application.project_details)} />
            <DetailField label="Company size" value={answer(application.company_size)} />
            <DetailField label="Industry" value={answer(application.industry_vertical)} />
            <DetailField label="Budget range" value={answer(application.budget_range)} />
            <DetailField label="Desired timeline" value={answer(application.timeline)} />
          </dl>
          {hasLegacyAnswers && <section aria-labelledby="legacy-heading">
            <h3 id="legacy-heading" className="mb-3 text-sm font-semibold text-[#6b6b6b]">Earlier application answers</h3>
            <dl className="divide-y divide-[#eeeeec] rounded-xl border border-[#e8e8e6] px-4 sm:px-5">
              <DetailField label="Trailing twelve-month revenue" value={answer(application.ttm_revenue)} />
              <DetailField label="Monthly paid acquisition spend" value={answer(application.monthly_ad_spend)} />
              <DetailField label="Strategic bottleneck" value={answer(application.growth_bottleneck)} />
              <DetailField label="Expectations regarding the engagement" value={answer(application.partnership_readiness)} />
              <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">Decision-maker LinkedIn profile</dt><dd className="mt-2 break-all text-sm leading-relaxed">{linkedin ? <a className="text-[#0a66c2] underline underline-offset-4" href={linkedin} target="_blank" rel="noopener noreferrer">{linkedin}</a> : "—"}</dd></div>
            </dl>
          </section>}
        </>}
      </div>
    </section>
  </div>;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">{label}</dt><dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#202020]">{value}</dd></div>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="rounded-2xl border border-[#e8e8e6] bg-white p-6"><p className="text-sm text-[#6b6b6b]">{label}</p><p className="mt-3 text-4xl font-semibold tabular-nums">{numberFormat.format(value)}</p></article>;
}

function Breakdown({ label, count, percent, color, labelClass }: { label: string; count: number; percent: number; color: string; labelClass: string }) {
  return <li className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} /><span className={`text-sm font-medium ${labelClass}`}>{label}</span><span className="ml-auto text-sm font-semibold tabular-nums">{numberFormat.format(count)} <span className="font-normal text-[#6b6b6b]">({percent}%)</span></span></li>;
}

