// Site-wide settings that administrators change from the dashboard (table public.global_settings, one row).
// Validation lives here so the API route and tests share it; database access is in lib/global-settings-store.ts.

export const RETENTION_MIN_DAYS = 1;
export const RETENTION_MAX_DAYS = 3650;

export type GlobalSettings = {
  /** Enquiries older than this are deleted by the daily clean-up; null keeps them until deleted by hand */
  dataRetentionDays: number | null;
  /** Reserved for data-breach notifications ("coming soon"); not used yet */
  breachNotificationEnabled: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  dataRetentionDays: null,
  breachNotificationEnabled: false,
  updatedAt: null,
  updatedBy: null,
};

/**
 * Checks a requested retention period: a whole number of days in range, or null / "" to keep enquiries until
 * deleted by hand. Returns the value to store, or an error message.
 */
export function parseRetentionDays(value: unknown): { ok: true; days: number | null } | { ok: false; error: string } {
  if (value === null || value === "") return { ok: true, days: null };
  const days = typeof value === "string" && /^\d+$/.test(value.trim()) ? Number(value.trim()) : value;
  if (typeof days !== "number" || !Number.isInteger(days) || days < RETENTION_MIN_DAYS || days > RETENTION_MAX_DAYS) {
    return { ok: false, error: `Retention must be a whole number of days from ${RETENTION_MIN_DAYS} to ${RETENTION_MAX_DAYS}, or empty to keep enquiries.` };
  }
  return { ok: true, days };
}

/** The cut-off for the clean-up: enquiries submitted before this time are deleted. */
export function retentionCutoff(days: number, now: Date = new Date()): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}
