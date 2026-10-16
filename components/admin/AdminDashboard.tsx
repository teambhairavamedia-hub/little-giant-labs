"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeContactEmail, normalizeLinkedInProfileUrl } from "@/lib/admin-contact-links";

type Application = {
  id: string; legal_name: string; industry_vertical: string; ttm_revenue: string;
  monthly_ad_spend: string; qualification_status: "qualified" | "rejected"; submitted_at: string;
  decision_maker_linkedin: string; decision_maker_email: string;
};
type DashboardData = {
  applications: Application[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  metrics: {
    totalApplications: number; newApplicationsLast7Days: number; qualifiedApplicationsLast7Days: number;
    qualification: { qualified: number; rejected: number }; window: { startsAt: string; endsAt: string };
  };
};

const numberFormat = new Intl.NumberFormat("en-US");
const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export function AdminDashboard() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
  const breakdownTotal = qualified + rejected;
  const qualifiedPercent = breakdownTotal ? Math.round(qualified / breakdownTotal * 100) : 0;
  const rejectedPercent = breakdownTotal ? 100 - qualifiedPercent : 0;

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
          <div role="img" aria-label={`Qualification breakdown: ${qualified} qualified (${qualifiedPercent}%), ${rejected} rejected (${rejectedPercent}%)`} className="h-40 w-40 shrink-0 rounded-full" style={{ background: `conic-gradient(#15803d 0% ${qualifiedPercent}%, #b91c1c ${qualifiedPercent}% 100%)` }} />
          <ul className="grid w-full gap-4 sm:grid-cols-2">
            <Breakdown label="Qualified" count={qualified} percent={qualifiedPercent} color="#15803d" labelClass="text-green-800" />
            <Breakdown label="Rejected" count={rejected} percent={rejectedPercent} color="#b91c1c" labelClass="text-red-800" />
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
              <thead><tr className="bg-[#f7f7f6] text-xs text-[#6b6b6b]"><th scope="col" className="px-5 py-3 font-medium sm:px-7">Legal company name</th><th scope="col" className="px-4 py-3 font-medium">Industry</th><th scope="col" className="px-4 py-3 font-medium">TTM revenue</th><th scope="col" className="px-4 py-3 font-medium">Monthly ad spend</th><th scope="col" className="px-4 py-3 font-medium">Status</th><th scope="col" className="px-4 py-3 font-medium">LinkedIn</th><th scope="col" className="px-4 py-3 font-medium">Email</th><th scope="col" className="px-5 py-3 font-medium sm:px-7">Submitted (IST)</th></tr></thead>
              <tbody>{data.applications.map((application) => {
                const linkedinUrl = normalizeLinkedInProfileUrl(application.decision_maker_linkedin);
                const email = normalizeContactEmail(application.decision_maker_email);
                return <tr key={application.id} className="border-t border-[#eeeeec] align-top">
                <td className="px-5 py-4 font-medium sm:px-7">{application.legal_name}</td><td className="px-4 py-4">{application.industry_vertical}</td><td className="px-4 py-4">{application.ttm_revenue}</td><td className="px-4 py-4">{application.monthly_ad_spend}</td>
                <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${application.qualification_status === "qualified" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{application.qualification_status === "qualified" ? "Qualified" : "Rejected"}</span></td>
                <td className="px-4 py-4">{linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open LinkedIn profile for ${application.legal_name}`} title="Open LinkedIn profile in a new tab" className="inline-flex rounded text-[#0a66c2] hover:text-[#004182] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a66c2]"><LinkedInIcon /></a> : <span className="text-[#6b6b6b]" aria-label="LinkedIn profile unavailable">—</span>}</td>
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
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="rounded-2xl border border-[#e8e8e6] bg-white p-6"><p className="text-sm text-[#6b6b6b]">{label}</p><p className="mt-3 text-4xl font-semibold tabular-nums">{numberFormat.format(value)}</p></article>;
}

function Breakdown({ label, count, percent, color, labelClass }: { label: string; count: number; percent: number; color: string; labelClass: string }) {
  return <li className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} /><span className={`text-sm font-medium ${labelClass}`}>{label}</span><span className="ml-auto text-sm font-semibold tabular-nums">{numberFormat.format(count)} <span className="font-normal text-[#6b6b6b]">({percent}%)</span></span></li>;
}

function LinkedInIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.35H4.97V9.02h2.96v9.33ZM6.45 7.75a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm11.9 10.6h-2.96v-4.54c0-1.08-.02-2.47-1.51-2.47-1.52 0-1.75 1.18-1.75 2.39v4.62H9.17V9.02h2.84v1.27h.04c.4-.73 1.36-1.51 2.8-1.51 2.99 0 3.55 1.97 3.55 4.54v5.03Z" /></svg>;
}
