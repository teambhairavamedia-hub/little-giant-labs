import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { PrivacySettings } from "@/components/admin-dashboard/PrivacySettings";
import { getAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { absolute: "Settings | Admin | Little Giant Labs" } };

export default async function AdminSettingsPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return <AdminShell>
    <p className="label-eyebrow text-[#800000]">Administration</p><h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Settings</h1>
    <p className="mt-3 text-sm text-[#6b6b6b]">Site-wide settings for data, privacy and enquiries.</p>
    <div className="mt-8 max-w-2xl">
      <PrivacySettings />
    </div>
  </AdminShell>;
}
