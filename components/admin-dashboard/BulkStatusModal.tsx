"use client";

import { useEffect, useRef, useState } from "react";
import { statusLabels } from "./constants";
import type { QualificationStatus } from "./types";

export interface BulkStatusModalProps {
  targetStatus: QualificationStatus;
  selectedCount: number;
  updating: boolean;
  onClose: () => void;
  onConfirm: (dontAskAgain: boolean) => void | Promise<void>;
}

export function BulkStatusModal({
  targetStatus,
  selectedCount,
  updating,
  onClose,
  onConfirm,
}: BulkStatusModalProps) {
  const [bulkDontAskAgain, setBulkDontAskAgain] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    confirmButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !updating) {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [updating, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !updating) onClose();
      }}
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
          <span className="font-semibold text-[#202020]">{selectedCount}</span>{" "}
          {selectedCount === 1 ? "application" : "applications"} to{" "}
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
            onClick={onClose}
            className="rounded-lg border border-[#d9d9d6] px-4 py-2 text-sm font-medium text-[#4a4a4a] hover:bg-neutral-50 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            disabled={updating}
            onClick={() => void onConfirm(bulkDontAskAgain)}
            className="rounded-lg bg-[#800000] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#660000] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]"
          >
            {updating ? "Updating…" : "Confirm change"}
          </button>
        </div>
      </div>
    </div>
  );
}
