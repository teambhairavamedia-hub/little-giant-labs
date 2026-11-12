import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return <AdminShell>
    <p className="label-eyebrow text-[#800000]">Administration</p><h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Applications overview</h1>
    <p className="mt-3 text-sm text-[#6b6b6b]">Review submission volume and qualification outcomes.</p>
    <AdminDashboard />
  </AdminShell>;
}
