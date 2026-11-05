"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeContactEmail, normalizeContactPhone } from "@/lib/admin-contact-links";
import { describeLeadSource, normalizeLeadSource } from "@/lib/lead-source";
import { ApplicationDetailPanel } from "@/components/admin-dashboard/ApplicationDetailPanel";
import { BulkStatusModal } from "@/components/admin-dashboard/BulkStatusModal";
import { CopyableTableLink } from "@/components/admin-dashboard/CopyableTableLink";
import { DashboardMetrics } from "@/components/admin-dashboard/DashboardMetrics";
import { DashboardSkeleton } from "@/components/admin-dashboard/DashboardSkeleton";
import { QualificationBreakdown } from "@/components/admin-dashboard/QualificationBreakdown";
import {
  dateFormat,
  numberFormat,
  statusLabels,
} from "@/components/admin-dashboard/constants";
import type {
  Application,
  DashboardData,
} from "@/components/admin-dashboard/types";

export function AdminDashboard() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [targetStatus, setTargetStatus] = useState<"pending_review" | "qualified" | "rejected" | "">("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [skipConfirm, setSkipConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lgl-admin-skip-status-confirm");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "true") setSkipConfirm(true);
    } catch { /* ignore */ }
  }, []);

  const updateSkipConfirmPreference = useCallback((skip: boolean) => {
    setSkipConfirm(skip);
    try {
      if (skip) {
        window.localStorage.setItem("lgl-admin-skip-status-confirm", "true");
      } else {
        window.localStorage.removeItem("lgl-admin-skip-status-confirm");
      }
    } catch { /* ignore */ }
  }, []);

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

  const displayedApplications = data?.applications ?? [];
  const displayedIds = displayedApplications.map((app) => app.id);
  const allDisplayedSelected = displayedIds.length > 0 && displayedIds.every((id) => selectedIds.has(id));
  const someDisplayedSelected = displayedIds.some((id) => selectedIds.has(id));

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = !allDisplayedSelected && someDisplayedSelected;
    }
  }, [allDisplayedSelected, someDisplayedSelected]);

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (allDisplayedSelected) {
      for (const id of displayedIds) next.delete(id);
    } else {
      for (const id of displayedIds) next.add(id);
    }
    setSelectedIds(next);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setTargetStatus("");
  };

  const applyBulkStatus = async () => {
    if (selectedIds.size === 0 || !targetStatus) return;
    setUpdating(true);
    setActionFeedback(null);
    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          status: targetStatus,
        }),
      });

      if (response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }

      if (!response.ok) {
        const errorResult = await response.json().catch(() => null);
        throw new Error(errorResult?.error ?? "Failed to update applications. Please try again.");
      }

      const count = selectedIds.size;
      const label = statusLabels[targetStatus];
      setShowConfirmModal(false);
      clearSelection();
      setActionFeedback({
        type: "success",
        message: `Successfully updated ${count} ${count === 1 ? "application" : "applications"} to "${label}".`,
      });
      await load(page);
    } catch (err) {
      setShowConfirmModal(false);
      setActionFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update applications. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

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
    {loading && !data ? (
      <DashboardSkeleton />
    ) : data && (
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <section aria-labelledby="applications-heading" className="overflow-hidden rounded-2xl border border-[#e8e8e6] bg-white">
        <div className="flex flex-col gap-2 border-b border-[#e8e8e6] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div><p className="label-eyebrow text-[#800000]">Submissions</p><h2 id="applications-heading" className="mt-3 text-2xl font-semibold">Applications</h2></div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => updateSkipConfirmPreference(!skipConfirm)}
              className="text-xs text-[#6b6b6b] underline decoration-[#d9d9d6] underline-offset-4 hover:text-[#800000] hover:decoration-[#800000]"
              title="Toggle whether status changes require confirmation"
            >
              Status confirmations: <span className="font-medium text-[#202020]">{skipConfirm ? "Off" : "On"}</span>
            </button>
            <p className="text-sm text-[#6b6b6b]">{numberFormat.format(data.pagination.total)} total</p>
          </div>
        </div>
        {actionFeedback && (
          <div
            className={`flex items-center justify-between border-b px-5 py-3 text-sm sm:px-7 ${
              actionFeedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
            role={actionFeedback.type === "success" ? "status" : "alert"}
          >
            <p>{actionFeedback.message}</p>
            <button
              type="button"
              onClick={() => setActionFeedback(null)}
              className="ml-4 text-xs font-semibold underline underline-offset-2"
              aria-label="Dismiss message"
            >
              Dismiss
            </button>
          </div>
        )}
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e8e6] bg-[#fbfbfa] px-5 py-3 sm:px-7 text-sm" role="region" aria-label="Bulk actions">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[#202020]">
                {selectedIds.size} {selectedIds.size === 1 ? "application" : "applications"} selected
              </span>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-[#800000] underline decoration-[#800000]/30 underline-offset-2 hover:decoration-[#800000]"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="bulk-status-select" className="sr-only">Change status</label>
              <select
                id="bulk-status-select"
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as "pending_review" | "qualified" | "rejected" | "")}
                className="rounded-lg border border-[#d9d9d6] bg-white px-3 py-1.5 text-sm font-medium text-[#202020] focus-visible:outline-2 focus-visible:outline-[#800000]"
              >
                <option value="">Change status to…</option>
                <option value="pending_review">Pending review</option>
                <option value="qualified">Qualified</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                type="button"
                disabled={!targetStatus || updating}
                onClick={() => {
                  if (selectedIds.size === 0 || !targetStatus || updating) return;
                  if (skipConfirm) {
                    void applyBulkStatus();
                  } else {
                    setShowConfirmModal(true);
                  }
                }}
                className="rounded-lg bg-[#800000] px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-[#660000] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]"
              >
                Apply
              </button>
            </div>
          </div>
        )}
        {data.pagination.total === 0 ? <p className="px-6 py-10 text-center text-sm text-[#6b6b6b]">No applications have been received.</p> : <>
          {loading && <p className="px-6 py-2 text-xs text-[#6b6b6b]" role="status">Loading applications…</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px] border-collapse text-left text-sm">
              <thead><tr className="bg-[#f7f7f6] text-xs text-[#6b6b6b]">
                <th scope="col" className="w-12 px-3 py-3 text-center sm:px-4">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allDisplayedSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all applications on this page"
                    className="admin-checkbox h-4 w-4 rounded border border-black bg-white checked:border-blue-600 checked:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
                  />
                </th>
                <th scope="col" className="px-5 py-3 font-medium sm:px-7">Company or brand</th><th scope="col" className="px-4 py-3 font-medium">Contact</th><th scope="col" className="px-4 py-3 font-medium">Needs help with</th><th scope="col" className="px-4 py-3 font-medium">Status</th><th scope="col" className="px-4 py-3 font-medium">Email</th><th scope="col" className="px-4 py-3 font-medium">Phone / WhatsApp</th><th scope="col" className="px-4 py-3 font-medium">Source</th><th scope="col" className="px-5 py-3 font-medium sm:px-7">Submitted (IST)</th>
              </tr></thead>
              <tbody>{data.applications.map((application) => {
                const email = normalizeContactEmail(application.decision_maker_email);
                const phone = normalizeContactPhone(application.contact_phone);
                return <tr key={application.id} className="border-t border-[#eeeeec] align-top">
                <td className="w-12 px-3 py-4 text-center sm:px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(application.id)}
                    onChange={() => toggleSelect(application.id)}
                    aria-label={`Select ${application.legal_name}`}
                    className="admin-checkbox h-4 w-4 rounded border border-black bg-white checked:border-blue-600 checked:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
                  />
                </td>
                <td className="px-5 py-4 font-medium sm:px-7"><button type="button" onClick={(event) => openDetail(application, event.currentTarget)} className="text-left underline decoration-[#800000]/30 underline-offset-4 hover:text-[#800000] hover:decoration-[#800000] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]">{application.legal_name}<span className="sr-only"> — View application</span></button></td><td className="px-4 py-4">{application.contact_name ?? "—"}</td><td className="px-4 py-4">{application.help_with ?? "—"}</td>
                <td className="px-4 py-4 text-center"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${application.qualification_status === "qualified" ? "bg-emerald-50 text-emerald-800" : application.qualification_status === "rejected" ? "bg-amber-50 text-amber-900" : "bg-sky-50 text-sky-900"}`}>{application.qualification_status === "pending_review" ? "Pending review" : application.qualification_status === "qualified" ? "Qualified" : "Rejected"}</span></td>
                <td className="max-w-44 px-4 py-4">{email ? <CopyableTableLink href={`mailto:${email.split("@").map(encodeURIComponent).join("@")}`} text={email} title={email} ariaLabel={`Email applicant at ${email}`} className="block max-w-36 truncate text-[#800000] underline decoration-[#800000]/30 underline-offset-4 hover:decoration-[#800000] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]" /> : <span className="text-[#6b6b6b]" aria-label="Email unavailable">—</span>}</td>
                <td className="whitespace-nowrap px-4 py-4">{phone ? <CopyableTableLink href={`https://wa.me/${phone.slice(1)}`} text={phone} target="_blank" rel="noopener noreferrer" ariaLabel={`Message applicant on WhatsApp at ${phone}`} className="text-[#800000] underline decoration-[#800000]/30 underline-offset-4 hover:decoration-[#800000] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]" /> : <span className="text-[#6b6b6b]" aria-label="Phone not given">—</span>}</td>
                <td className="max-w-40 truncate px-4 py-4 text-[#4a4a4a]" title={describeLeadSource(normalizeLeadSource(application.lead_source))}>{describeLeadSource(normalizeLeadSource(application.lead_source))}</td>
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
    </div>
    <div className="flex flex-col gap-6 lg:col-span-1">
      <QualificationBreakdown qualification={data.metrics.qualification} />
      <DashboardMetrics metrics={data.metrics} />
    </div>
  </div>
)}
    {showConfirmModal && targetStatus && (
      <BulkStatusModal
        targetStatus={targetStatus}
        selectedCount={selectedIds.size}
        updating={updating}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={async (dontAskAgain) => {
          if (dontAskAgain) {
            updateSkipConfirmPreference(true);
          }
          await applyBulkStatus();
        }}
      />
    )}
    {selected && (
      <ApplicationDetailPanel
        key={selected.id}
        id={selected.id}
        onClose={closeDetail}
        onUpdated={() => void load(page)}
        skipConfirm={skipConfirm}
        onToggleSkipConfirm={updateSkipConfirmPreference}
      />
    )}
  </div>;
}

