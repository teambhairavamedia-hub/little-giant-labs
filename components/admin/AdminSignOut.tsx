"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";

export function AdminSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    try { await fetch("/api/admin/logout", { method: "POST" }); } finally {
      try { await signOut(getFirebaseAuth()); } catch { /* Browser state may already be empty. */ }
      router.replace("/admin/login"); router.refresh();
    }
  }
  return <button onClick={logout} disabled={busy} className="rounded-full border border-[#e8e8e6] px-4 py-2 text-xs font-medium transition hover:border-[#800000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000] disabled:opacity-60">{busy ? "Signing out…" : "Sign out"}</button>;
}
