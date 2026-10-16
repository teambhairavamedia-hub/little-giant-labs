import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { getAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return <main className="min-h-screen">
    <header className="border-b border-[#e8e8e6] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <a href="/admin/dashboard" className="label-eyebrow text-[#800000]">Little Giant Labs <span className="ml-2 text-[#6b6b6b]">Admin</span></a><AdminSignOut /></div></header>
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="label-eyebrow text-[#800000]">Administration</p><h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Applications overview</h1>
      <p className="mt-3 text-sm text-[#6b6b6b]">Review submission volume and qualification outcomes.</p>
      <AdminDashboard />
    </div>
  </main>;
}
