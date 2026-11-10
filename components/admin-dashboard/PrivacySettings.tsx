"use client";

import { useEffect, useState } from "react";
import { RETENTION_MAX_DAYS, RETENTION_MIN_DAYS, type GlobalSettings } from "@/lib/global-settings";
import { dateFormat } from "./constants";

/* Common choices; any whole number of days can be typed instead */
const PRESETS = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "6 months", days: 180 },
  { label: "1 year", days: 365 },
];

/* Site-wide data and privacy settings (table global_settings): how long enquiries are kept, and data-breach
   notifications, which are coming soon. */
export function PrivacySettings() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [days, setDays] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/settings", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!active) return;
        if (!response.ok) throw new Error(result?.error ?? "Settings could not be loaded.");
        setSettings(result.settings);
        setDays(result.settings.dataRetentionDays ? String(result.settings.dataRetentionDays) : "");
      })
      .catch((cause) => { if (active) setLoadError(cause instanceof Error ? cause.message : "Settings could not be loaded."); });
    return () => { active = false; };
  }, []);

  const saved = settings?.dataRetentionDays ? String(settings.dataRetentionDays) : "";
  const changed = days.trim() !== saved;

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ dataRetentionDays: days.trim() === "" ? null : days.trim() }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Settings could not be saved.");
      setSettings(result.settings);
      setDays(result.settings.dataRetentionDays ? String(result.settings.dataRetentionDays) : "");
      setFeedback({
        type: "success",
        message: result.settings.dataRetentionDays
          ? `Saved. Enquiries older than ${result.settings.dataRetentionDays} days will be deleted in the next daily clean-up.`
          : "Saved. Enquiries are kept until you delete them.",
      });
    } catch (cause) {
      setFeedback({ type: "error", message: cause instanceof Error ? cause.message : "Settings could not be saved." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="privacy-settings-heading" className="rounded-2xl border border-[#e8e8e6] bg-white p-6 sm:p-8 lg:p-6">
      <p className="label-eyebrow text-[#800000]">Global settings</p>
      <h2 id="privacy-settings-heading" className="mt-3 text-2xl font-semibold">Data &amp; privacy</h2>

      {loadError ? (
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">{loadError}</p>
      ) : !settings ? (
        <p className="mt-5 text-sm text-[#6b6b6b]" role="status">Loading settings…</p>
      ) : (
        <>
          <div className="mt-6">
            <label htmlFor="retention-days" className="text-sm font-semibold text-[#202020]">Data retention</label>
            <p className="mt-1 text-xs leading-relaxed text-[#6b6b6b]">
              Enquiries older than this are deleted automatically every night. Leave empty to keep enquiries until you
              delete them.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                id="retention-days"
                type="number"
                inputMode="numeric"
                min={RETENTION_MIN_DAYS}
                max={RETENTION_MAX_DAYS}
                step={1}
                value={days}
                onChange={(event) => { setDays(event.target.value); setFeedback(null); }}
                placeholder="Keep"
                className="h-10 w-28 rounded-lg border border-[#d9d9d6] px-3 text-sm tabular-nums focus-visible:border-[#800000] focus-visible:outline-2 focus-visible:outline-[#800000]/30"
              />
              <span className="text-sm text-[#6b6b6b]">days</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Common retention periods">
              {PRESETS.map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => { setDays(String(preset.days)); setFeedback(null); }}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${days === String(preset.days) ? "border-[#800000] bg-[#800000]/10 text-[#800000]" : "border-[#d9d9d6] text-[#4a4a4a] hover:border-[#800000]/50"}`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setDays(""); setFeedback(null); }}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${days === "" ? "border-[#800000] bg-[#800000]/10 text-[#800000]" : "border-[#d9d9d6] text-[#4a4a4a] hover:border-[#800000]/50"}`}
              >
                Keep
              </button>
            </div>
            <button
              type="button"
              disabled={!changed || saving}
              onClick={() => void save()}
              className="mt-4 rounded-lg bg-[#800000] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#660000] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000]"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {feedback && (
              <p
                className={`mt-3 text-xs ${feedback.type === "success" ? "text-emerald-800" : "text-red-800"}`}
                role={feedback.type === "success" ? "status" : "alert"}
              >
                {feedback.message}
              </p>
            )}
            {settings.updatedAt && (
              <p className="mt-3 text-xs text-[#8a8a8a]">
                Last changed {dateFormat.format(new Date(settings.updatedAt))}
                {settings.updatedBy ? ` by ${settings.updatedBy}` : ""}
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-[#eeeeec] pt-5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#202020]">Data breach notification</p>
              <span className="rounded-full bg-[#f3f3f1] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b6b6b]">Coming soon</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#6b6b6b]">
              Notify affected people and the Data Protection Board of India after a personal data breach.
            </p>
            <label className="mt-3 inline-flex cursor-not-allowed items-center gap-2 text-sm text-[#9a9a9a]">
              <input type="checkbox" disabled checked={settings.breachNotificationEnabled} readOnly className="h-4 w-4" />
              Send breach notifications
            </label>
          </div>
        </>
      )}
    </section>
  );
}
