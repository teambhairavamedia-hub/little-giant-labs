"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Application = {
  id: string; legal_name: string; industry_vertical: string; ttm_revenue: string;
  monthly_ad_spend: string; qualification_status: "qualified" | "rejected"; submitted_at: string;
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
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });

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
          <div role="img" aria-label={`Qualification breakdown: ${qualified} qualified (${qualifiedPercent}%), ${rejected} rejected (${rejectedPercent}%)`} className="h-40 w-40 shrink-0 rounded-full" style={{ background: `conic-gradient(#800000 0% ${qualifiedPercent}%, #c5a059 ${qualifiedPercent}% 100%)` }} />
          <ul className="grid w-full gap-4 sm:grid-cols-2">
            <Breakdown label="Qualified" count={qualified} percent={qualifiedPercent} color="#800000" />
            <Breakdown label="Rejected" count={rejected} percent={rejectedPercent} color="#c5a059" />
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
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead><tr className="bg-[#f7f7f6] text-xs text-[#6b6b6b]"><th scope="col" className="px-5 py-3 font-medium sm:px-7">Legal company name</th><th scope="col" className="px-4 py-3 font-medium">Industry</th><th scope="col" className="px-4 py-3 font-medium">TTM revenue</th><th scope="col" className="px-4 py-3 font-medium">Monthly ad spend</th><th scope="col" className="px-4 py-3 font-medium">Status</th><th scope="col" className="px-5 py-3 font-medium sm:px-7">Submitted (UTC)</th></tr></thead>
              <tbody>{data.applications.map((application) => <tr key={application.id} className="border-t border-[#eeeeec] align-top">
                <td className="px-5 py-4 font-medium sm:px-7">{application.legal_name}</td><td className="px-4 py-4">{application.industry_vertical}</td><td className="px-4 py-4">{application.ttm_revenue}</td><td className="px-4 py-4">{application.monthly_ad_spend}</td>
                <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${application.qualification_status === "qualified" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{application.qualification_status === "qualified" ? "Qualified" : "Rejected"}</span></td>
                <td className="whitespace-nowrap px-5 py-4 text-[#6b6b6b] sm:px-7"><time dateTime={application.submitted_at}>{dateFormat.format(new Date(application.submitted_at))}</time></td>
              </tr>)}</tbody>
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

function Breakdown({ label, count, percent, color }: { label: string; count: number; percent: number; color: string }) {
  return <li className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} /><span className="text-sm">{label}</span><span className="ml-auto text-sm font-semibold tabular-nums">{numberFormat.format(count)} <span className="font-normal text-[#6b6b6b]">({percent}%)</span></span></li>;
}
