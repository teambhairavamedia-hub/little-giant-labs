import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_GLOBAL_SETTINGS, type GlobalSettings } from "@/lib/global-settings";

type Row = {
  data_retention_days: number | null;
  breach_notification_enabled: boolean;
  updated_at: string | null;
  updated_by: string | null;
};

const toSettings = (row: Row | null): GlobalSettings =>
  row
    ? {
        dataRetentionDays: row.data_retention_days,
        breachNotificationEnabled: row.breach_notification_enabled,
        updatedAt: row.updated_at,
        updatedBy: row.updated_by,
      }
    : DEFAULT_GLOBAL_SETTINGS;

/** Reads the settings row. Throws if the table can't be read (for example, before the migration is applied). */
export async function readGlobalSettings(): Promise<GlobalSettings> {
  const { data, error } = await createSupabaseServerClient()
    .from("global_settings")
    .select("data_retention_days, breach_notification_enabled, updated_at, updated_by")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error("Settings could not be read.");
  return toSettings(data as Row | null);
}

/** Saves the retention period and records who changed it. */
export async function saveRetentionDays(days: number | null, updatedBy: string | null): Promise<GlobalSettings> {
  const { data, error } = await createSupabaseServerClient()
    .from("global_settings")
    .upsert({ id: 1, data_retention_days: days, updated_at: new Date().toISOString(), updated_by: updatedBy }, { onConflict: "id" })
    .select("data_retention_days, breach_notification_enabled, updated_at, updated_by")
    .single();
  if (error) throw new Error("Settings could not be saved.");
  return toSettings(data as Row);
}
