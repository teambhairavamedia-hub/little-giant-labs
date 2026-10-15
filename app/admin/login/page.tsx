import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-session";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <main className="flex min-h-screen items-center justify-center px-5 py-12">
    <div className="w-full max-w-md">
      <Link href="/" className="label-eyebrow text-[#800000]">Little Giant Labs</Link>
      <div className="mt-8 rounded-2xl border border-[#e8e8e6] bg-white p-7 shadow-[0_20px_48px_rgba(0,0,0,0.05)] sm:p-9">
        <p className="label-eyebrow text-[#6b6b6b]">Administration</p>
        <h1 className="mt-4 text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-sm text-[#6b6b6b]">Use your authorized Little Giant Labs admin account.</p>
        <AdminLoginForm />
      </div>
    </div>
  </main>;
}
