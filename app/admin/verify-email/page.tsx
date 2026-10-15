"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { applyActionCode, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function VerifyAdminEmailPage() {
  const [status, setStatus] = useState("Verifying your email…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    async function verify() {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      const code = params.get("oobCode");
      if (mode !== "verifyEmail" || !code) {
        setFailed(true);
        setStatus("This verification link is invalid or incomplete. Request a new email and try again.");
        return;
      }
      try {
        const auth = getFirebaseAuth();
        await applyActionCode(auth, code);
        try { await signOut(auth); } catch { /* The verification result does not depend on a client session. */ }
        sessionStorage.setItem("admin-email-verified", "1");
        window.location.replace("/admin/login?verified=1");
      } catch (cause) {
        const codeName = typeof cause === "object" && cause && "code" in cause ? String(cause.code) : "";
        const message = codeName.includes("expired")
          ? "This verification link has expired. Request a new verification email."
          : codeName.includes("used")
            ? "This verification link has already been used. Return to sign in."
            : "This verification link is invalid or has already been used. Request a new email and try again.";
        if (active) { setFailed(true); setStatus(message); }
      }
    }
    void verify();
    return () => { active = false; };
  }, []);

  return <main className="flex min-h-screen items-center justify-center px-5 py-12">
    <div className="w-full max-w-md rounded-2xl border border-[#e8e8e6] bg-white p-7 shadow-[0_20px_48px_rgba(0,0,0,0.05)] sm:p-9">
      <p className="label-eyebrow text-[#800000]">Administration</p>
      <h1 className="mt-4 text-3xl font-semibold">Email verification</h1>
      <p className={`mt-4 rounded-lg px-3 py-3 text-sm ${failed ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"}`} role={failed ? "alert" : "status"}>{status}</p>
      {failed && <Link href="/admin/login" className="mt-5 block text-sm font-medium underline underline-offset-4">Return to sign in</Link>}
    </div>
  </main>;
}
