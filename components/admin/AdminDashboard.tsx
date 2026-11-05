"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeContactEmail, normalizeContactPhone, normalizeLinkedInProfileUrl } from "@/lib/admin-contact-links";
import { LEAD_SOURCE_KEYS, describeLeadSource, normalizeLeadSource } from "@/lib/lead-source";
import { CopyableTableLink } from "@/components/admin-dashboard/CopyableTableLink";
import { DashboardMetrics } from "@/components/admin-dashboard/DashboardMetrics";
import { DashboardSkeleton } from "@/components/admin-dashboard/DashboardSkeleton";
import { QualificationBreakdown } from "@/components/admin-dashboard/QualificationBreakdown";
import {
  dateFormat,
  numberFormat,
  rejectionLabels,
  statusLabels,
  type Application,
  type ApplicationDetail,
  type DashboardData,
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
  const [bulkDontAskAgain, setBulkDontAskAgain] = useState(false);
  const [skipConfirm, setSkipConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lgl-admin-skip-status-confirm");
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

  useEffect(() => {
    if (!showConfirmModal) return;
    confirmButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !updating) {
        e.stopPropagation();
        setShowConfirmModal(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showConfirmModal, updating]);

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
                    setBulkDontAskAgain(false);
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
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
        onMouseDown={(e) => { if (e.target === e.currentTarget && !updating) setShowConfirmModal(false); }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-status-modal-title"
          className="w-full max-w-md rounded-2xl border border-[#e8e8e6] bg-white p-6 shadow-2xl"
        >
          <h3 id="confirm-status-modal-title" className="text-lg font-semibold text-[#202020]">
            Confirm status change
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#4a4a4a]">
            Are you sure you want to change the status of{" "}
            <span className="font-semibold text-[#202020]">{selectedIds.size}</span>{" "}
            {selectedIds.size === 1 ? "application" : "applications"} to{" "}
            <span className="font-semibold text-[#202020]">{statusLabels[targetStatus]}</span>?
          </p>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="bulk-dont-ask-again"
              checked={bulkDontAskAgain}
              onChange={(e) => setBulkDontAskAgain(e.target.checked)}
              className="admin-checkbox h-4 w-4 rounded border border-black bg-white checked:border-blue-600 checked:bg-blue-600 cursor-pointer"
            />
            <label htmlFor="bulk-dont-ask-again" className="text-xs text-[#4a4a4a] select-none cursor-pointer">
              Don&apos;t ask again
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={updating}
              onClick={() => setShowConfirmModal(false)}
              className="rounded-lg border border-[#d9d9d6] px-4 py-2 text-sm font-medium text-[#4a4a4a] hover:bg-neutral-50 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              ref={confirmButtonRef}
              type="button"
              disabled={updating}
              onClick={async () => {
                if (bulkDontAskAgain) {
                  updateSkipConfirmPreference(true);
                }
                await applyBulkStatus();
              }}
              className="rounded-lg bg-[#800000] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#660000] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]"
            >
              {updating ? "Updating…" : "Confirm change"}
            </button>
          </div>
        </div>
      </div>
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

function ApplicationDetailPanel({
  id,
  onClose,
  onUpdated,
  skipConfirm,
  onToggleSkipConfirm,
}: {
  id: string;
  onClose: () => void;
  onUpdated?: () => void;
  skipConfirm: boolean;
  onToggleSkipConfirm: (skip: boolean) => void;
}) {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLElement>(null);

  const [pendingStatus, setPendingStatus] = useState<"pending_review" | "qualified" | "rejected" | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [detailFeedback, setDetailFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    if (!showConfirmDialog) return;
    confirmBtnRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !updating) {
        e.stopPropagation();
        setShowConfirmDialog(false);
        setPendingStatus(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showConfirmDialog, updating]);

  const executeStatusUpdate = async (statusToApply: "pending_review" | "qualified" | "rejected") => {
    if (!application || updating) return;
    setUpdating(true);
    setDetailFeedback(null);
    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          ids: [application.id],
          status: statusToApply,
        }),
      });

      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Failed to update application status.");
      }

      setApplication((prev) => prev ? { ...prev, qualification_status: statusToApply } : null);
      setDetailFeedback({
        type: "success",
        message: `Status updated to "${statusLabels[statusToApply]}".`,
      });
      onUpdated?.();
    } catch (err) {
      setDetailFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update application status.",
      });
    } finally {
      setUpdating(false);
      setPendingStatus(null);
    }
  };

  const handleStatusSelect = (newStatus: "pending_review" | "qualified" | "rejected") => {
    if (!application || newStatus === application.qualification_status || updating) return;
    if (skipConfirm) {
      void executeStatusUpdate(newStatus);
    } else {
      setPendingStatus(newStatus);
      setDontAskAgain(false);
      setShowConfirmDialog(true);
    }
  };

  const email = normalizeContactEmail(application?.decision_maker_email);
  const phone = normalizeContactPhone(application?.contact_phone);
  const source = normalizeLeadSource(application?.lead_source);
  const linkedin = normalizeLinkedInProfileUrl(application?.decision_maker_linkedin);
  const reasons = Array.isArray(application?.rejection_reasons) ? application.rejection_reasons : [];
  const answer = (value: unknown) => typeof value === "string" && value.trim() ? value : "—";
  const hasLegacyAnswers = Boolean(application && [application.company_size, application.industry_vertical, application.budget_range, application.ttm_revenue, application.monthly_ad_spend, application.growth_bottleneck, application.partnership_readiness, application.decision_maker_linkedin]
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
        {detailFeedback && (
          <div
            className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs ${
              detailFeedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
            role={detailFeedback.type === "success" ? "status" : "alert"}
          >
            <p>{detailFeedback.message}</p>
            <button
              type="button"
              onClick={() => setDetailFeedback(null)}
              className="ml-3 font-semibold underline underline-offset-2"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}
        {application && <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative inline-flex items-center">
                <label htmlFor="detail-status-select" className="sr-only">Change status</label>
                <select
                  id="detail-status-select"
                  disabled={updating}
                  value={application.qualification_status}
                  onChange={(e) => handleStatusSelect(e.target.value as "pending_review" | "qualified" | "rejected")}
                  className={`appearance-none rounded-full pl-3.5 pr-8 py-1.5 text-sm font-semibold cursor-pointer border-0 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000] disabled:cursor-not-allowed disabled:opacity-60 ${
                    application.qualification_status === "qualified"
                      ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : application.qualification_status === "rejected"
                      ? "bg-amber-50 text-amber-900 hover:bg-amber-100"
                      : "bg-sky-50 text-sky-900 hover:bg-sky-100"
                  }`}
                >
                  <option value="pending_review">Pending review</option>
                  <option value="qualified">Qualified</option>
                  <option value="rejected">Rejected</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs opacity-60">
                  ▼
                </span>
              </div>
              {updating && <span className="text-xs text-[#6b6b6b] animate-pulse">Updating…</span>}
            </div>
            <time className="text-sm text-[#6b6b6b]" dateTime={application.submitted_at}>{dateFormat.format(new Date(application.submitted_at))} IST</time>
          </div>
          {application.qualification_status === "rejected" && <section aria-labelledby="reasons-heading" className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 id="reasons-heading" className="font-semibold text-amber-950">Stored rejection reasons</h3>{reasons.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950">{reasons.map((reason, index) => { const code = typeof reason === "string" ? reason : ""; const label = rejectionLabels[code] ?? (code ? code.replace(/[_-]+/g, " ") : "Unrecognized stored reason"); return <li key={`${code}-${index}`}>{label}</li>; })}</ul> : <p className="mt-2 text-sm text-amber-950">No rejection reasons were stored.</p>}</section>}
          <dl className="divide-y divide-[#eeeeec] rounded-xl border border-[#e8e8e6] px-4 sm:px-5">
            <DetailField label="Name" value={answer(application.contact_name)} />
            <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">Work email</dt><dd className="mt-2 break-words text-sm leading-relaxed">{email ? <a className="text-[#800000] underline underline-offset-4" href={`mailto:${email.split("@").map(encodeURIComponent).join("@")}`}>{email}</a> : "—"}</dd></div>
            <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">Phone / WhatsApp</dt><dd className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-relaxed">{phone ? <><span>{phone}</span><a className="text-[#800000] underline underline-offset-4" href={`tel:${phone}`}>Call</a><a className="text-[#800000] underline underline-offset-4" href={`https://wa.me/${phone.slice(1)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></> : "—"}</dd></div>
            <DetailField label="Company or brand name" value={answer(application.legal_name)} />
            <DetailField label="What they need help with" value={answer(application.help_with)} />
            <DetailField label="About the project" value={answer(application.project_details)} />
            <DetailField label="Your role" value={answer(application.contact_role)} />
            <DetailField label="Desired timeline" value={answer(application.timeline)} />
            <DetailField label="Came from" value={describeLeadSource(source)} />
            {source && <DetailField label="Source details" value={LEAD_SOURCE_KEYS.filter((key) => source[key]).map((key) => `${key}: ${source[key]}`).join("\n")} />}
          </dl>
          {hasLegacyAnswers && <section aria-labelledby="legacy-heading">
            <h3 id="legacy-heading" className="mb-3 text-sm font-semibold text-[#6b6b6b]">Earlier application answers</h3>
            <dl className="divide-y divide-[#eeeeec] rounded-xl border border-[#e8e8e6] px-4 sm:px-5">
              <DetailField label="Earlier company size" value={answer(application.company_size)} />
              <DetailField label="Earlier application industry" value={answer(application.industry_vertical)} />
              <DetailField label="Earlier budget range" value={answer(application.budget_range)} />
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
    {showConfirmDialog && pendingStatus && application && (
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && !updating) {
            setShowConfirmDialog(false);
            setPendingStatus(null);
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-individual-status-title"
          className="w-full max-w-md rounded-2xl border border-[#e8e8e6] bg-white p-6 shadow-2xl"
        >
          <h3 id="confirm-individual-status-title" className="text-lg font-semibold text-[#202020]">
            Confirm status change
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#4a4a4a]">
            Are you sure you want to change the status of{" "}
            <span className="font-semibold text-[#202020]">{application.legal_name}</span> from{" "}
            <span className="font-semibold text-[#202020]">{statusLabels[application.qualification_status]}</span> to{" "}
            <span className="font-semibold text-[#202020]">{statusLabels[pendingStatus]}</span>?
          </p>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="dont-ask-again-individual"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
              className="admin-checkbox h-4 w-4 rounded border border-black bg-white checked:border-blue-600 checked:bg-blue-600 cursor-pointer"
            />
            <label htmlFor="dont-ask-again-individual" className="text-xs text-[#4a4a4a] select-none cursor-pointer">
              Don&apos;t ask again
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={updating}
              onClick={() => {
                setShowConfirmDialog(false);
                setPendingStatus(null);
              }}
              className="rounded-lg border border-[#d9d9d6] px-4 py-2 text-sm font-medium text-[#4a4a4a] hover:bg-neutral-50 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              ref={confirmBtnRef}
              type="button"
              disabled={updating}
              onClick={async () => {
                if (!pendingStatus) return;
                const target = pendingStatus;
                setShowConfirmDialog(false);
                if (dontAskAgain) {
                  onToggleSkipConfirm(true);
                }
                await executeStatusUpdate(target);
              }}
              className="rounded-lg bg-[#800000] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#660000] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]"
            >
              {updating ? "Updating…" : "Confirm change"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">{label}</dt><dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#202020]">{value}</dd></div>;
}

