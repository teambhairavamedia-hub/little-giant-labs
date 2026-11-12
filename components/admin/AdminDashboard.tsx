"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApplicationDetailPanel } from "@/components/admin-dashboard/ApplicationDetailPanel";
import { ApplicationsTable } from "@/components/admin-dashboard/ApplicationsTable";
import { BulkStatusModal } from "@/components/admin-dashboard/BulkStatusModal";
import { DashboardMetrics } from "@/components/admin-dashboard/DashboardMetrics";
import { DashboardSkeleton } from "@/components/admin-dashboard/DashboardSkeleton";
import { QualificationBreakdown } from "@/components/admin-dashboard/QualificationBreakdown";
import { statusLabels } from "@/components/admin-dashboard/constants";
import type {
  Application,
  DashboardData,
  QualificationStatus,
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
  const [targetStatus, setTargetStatus] = useState<QualificationStatus | "">("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [skipConfirm, setSkipConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  // Search by company or brand name, email or contact name. `search` is what the box shows; `searchRef` is what the
  // list is filtered by, so paging and refreshes keep the current search.
  const [search, setSearch] = useState("");
  const searchRef = useRef("");
  const requestRef = useRef(0);

  const load = useCallback(async (requestedPage: number) => {
    const request = ++requestRef.current;
    setLoading(true); setError("");
    try {
      const query = new URLSearchParams({ page: String(requestedPage), pageSize: "25" });
      if (searchRef.current) query.set("q", searchRef.current);
      const response = await fetch(`/api/admin/applications?${query}`, { cache: "no-store" });
      if (request !== requestRef.current) return; // a newer search or page was requested meanwhile
      if (response.status === 401) { router.replace("/admin/login"); router.refresh(); return; }
      if (!response.ok) throw new Error("Application data could not be loaded. Please try again.");
      const result = await response.json() as DashboardData;
      if (request !== requestRef.current) return;
      setData(result); setPage(requestedPage);
    } catch (cause) {
      if (request !== requestRef.current) return;
      setError(cause instanceof Error ? cause.message : "Application data could not be loaded. Please try again.");
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(1); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  // Searches a moment after typing stops, from the first page
  useEffect(() => {
    const text = search.trim();
    if (text === searchRef.current) return;
    const timer = window.setTimeout(() => {
      searchRef.current = text;
      void load(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, load]);

  const toggleSelectAll = () => {
    const displayedApplications = data?.applications ?? [];
    const displayedIds = displayedApplications.map((app) => app.id);
    const allDisplayedSelected = displayedIds.length > 0 && displayedIds.every((id) => selectedIds.has(id));
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

  const handleApplyBulkStatus = () => {
    if (selectedIds.size === 0 || !targetStatus || updating) return;
    if (skipConfirm) {
      void applyBulkStatus();
    } else {
      setShowConfirmModal(true);
    }
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
          <ApplicationsTable
            applications={data.applications}
            pagination={data.pagination}
            currentPage={page}
            loading={loading}
            skipConfirm={skipConfirm}
            onToggleSkipConfirm={updateSkipConfirmPreference}
            actionFeedback={actionFeedback}
            onDismissFeedback={() => setActionFeedback(null)}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onClearSelection={clearSelection}
            targetStatus={targetStatus}
            onTargetStatusChange={setTargetStatus}
            onApplyBulkStatus={handleApplyBulkStatus}
            updating={updating}
            onSelectApplication={openDetail}
            onPageChange={(newPage) => void load(newPage)}
            search={search}
            activeSearch={data.search ?? ""}
            onSearchChange={setSearch}
          />
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

