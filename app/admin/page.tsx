import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { AdminSignOut } from "@/components/admin/AdminSignOut";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <main className="min-h-screen">
    <header className="border-b border-[#e8e8e6] bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <a href="/admin" className="label-eyebrow text-[#800000]">Little Giant Labs <span className="ml-2 text-[#6b6b6b]">Admin</span></a><AdminSignOut /></div></header>
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="label-eyebrow text-[#800000]">Administration</p><h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Admin dashboard</h1>
      <section aria-label="Dashboard placeholder" className="mt-10 rounded-2xl border border-[#e8e8e6] bg-white p-8 sm:p-12">
        <h2 className="text-xl font-semibold">Your workspace is ready</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#6b6b6b]">Application management functionality will be added here in a future phase.</p>
      </section>
    </div>
  </main>;
}
