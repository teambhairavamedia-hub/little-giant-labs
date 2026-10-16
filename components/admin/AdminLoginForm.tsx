"use client";

import { useEffect, useState, type FormEvent } from "react";
import { sendEmailVerification, signInWithEmailAndPassword, signOut, type ActionCodeSettings, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebase/client";

function verificationError(cause: unknown) {
  const code = typeof cause === "object" && cause && "code" in cause ? String(cause.code) : "";
  if (code.includes("too-many-requests")) return "Too many emails have been requested. Please wait a while before trying again.";
  if (code.includes("network-request-failed")) return "Network error. Check your connection and try again.";
  return "We couldn't send the verification email. Please try again later.";
}

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verificationUser, setVerificationUser] = useState<User | null>(null);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("verified=1") && sessionStorage.getItem("admin-email-verified") === "1") {
      sessionStorage.removeItem("admin-email-verified");
      window.setTimeout(() => setMessage("Your email has been verified. Sign in now."), 0);
    }
  }, []);

  useEffect(() => {
    if (canResend) return;
    const timer = window.setTimeout(() => setCanResend(true), 30_000);
    return () => window.clearTimeout(timer);
  }, [canResend]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    let phase = "submit_handler";
    console.info("admin_login_flow", { phase });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { console.info("admin_login_flow", { phase: "email_validation_failed" }); setError("Enter a valid email address."); return; }
    if (!password) { console.info("admin_login_flow", { phase: "password_validation_failed" }); setError("Enter your password."); return; }
    setLoading(true);
    try {
      phase = "firebase_sign_in";
      console.info("admin_login_flow", { phase: `${phase}_started` });
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.info("admin_login_flow", { phase: `${phase}_resolved` });
      phase = "reload_user";
      await credential.user.reload();
      console.info("admin_login_flow", { phase: `${phase}_resolved` });
      if (!credential.user.emailVerified) {
        console.info("admin_login_flow", { phase: "email_verification_required" });
        setVerificationUser(credential.user);
        setError("Email verification is required before you can access the admin dashboard.");
        return;
      }
      phase = "id_token_retrieval";
      const idToken = await credential.user.getIdToken(true);
      console.info("admin_login_flow", { phase: `${phase}_resolved` });
      phase = "session_request";
      console.info("admin_login_flow", { phase: `${phase}_started` });
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) });
      console.info("admin_login_flow", { phase: `${phase}_completed`, status: response.status });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sign-in was not authorized.");
      phase = "dashboard_navigation";
      router.replace("/admin/dashboard"); router.refresh();
      console.info("admin_login_flow", { phase: `${phase}_started` });
      // The server session is already set. Client sign-out is best-effort and
      // must not block navigation after successful session creation.
      void signOut(auth).catch(() => { /* Admin authorization uses the server session cookie. */ });
    } catch (cause) {
      const code = typeof cause === "object" && cause && "code" in cause ? String(cause.code) : undefined;
      console.error("admin_login_flow_failed", { phase, code });
      try { await signOut(getFirebaseAuth()); } catch { /* Firebase may not have initialized. */ }
      const msg = cause instanceof Error ? cause.message : "Unable to sign in. Please try again.";
      setError(msg.includes("Firebase: Error") ? "Email or password is incorrect, or sign-in is not configured." : msg);
    } finally { setLoading(false); }
  }

  async function resendVerification() {
    if (!verificationUser || sending || !canResend) return;
    setSending(true); setError(""); setMessage("");
    try {
      await verificationUser.reload();
      if (verificationUser.emailVerified) {
        setMessage("Your email is verified. Return to sign in to continue.");
        return;
      }
      const actionCodeSettings: ActionCodeSettings = {
        url: `${window.location.origin}/admin/login`,
        handleCodeInApp: false,
      };
      await sendEmailVerification(verificationUser, actionCodeSettings);
      setVerificationEmailSent(true);
      setCanResend(false);
      setMessage(verificationEmailSent
        ? "Another verification email was sent. Check your inbox and follow the link, then return here to sign in."
        : "Verification email sent. Check your inbox and follow the link, then return here to sign in.");
    } catch (cause) { setError(verificationError(cause)); }
    finally { setSending(false); }
  }

  async function returnToLogin() {
    try { await signOut(getFirebaseAuth()); } catch { /* Clear local verification state even if Firebase sign-out fails. */ }
    setVerificationUser(null); setVerificationEmailSent(false); setPassword(""); setError(""); setMessage("");
  }

  if (verificationUser) return <div className="mt-7 space-y-5">
    <p className="rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-900" role="status">Email verification is required before you can access the admin dashboard. Verify the address for {verificationUser.email}.</p>
    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{message}</p>}
    <button type="button" disabled={sending || !canResend} onClick={resendVerification} className="w-full rounded-lg bg-[#800000] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{sending ? "Sending…" : !canResend ? "Please wait before resending" : verificationEmailSent ? "Resend verification mail" : "Send verification mail"}</button>
    <button type="button" onClick={returnToLogin} className="w-full px-4 py-2 text-sm font-medium underline underline-offset-4">Return to login</button>
  </div>;

  return <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
    {message && <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{message}</p>}
    <div><label htmlFor="admin-email" className="mb-2 block text-sm font-medium">Email address</label>
      <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-[#d9d9d6] bg-white px-4 py-3 text-sm outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/15" /></div>
    <div><label htmlFor="admin-password" className="mb-2 block text-sm font-medium">Password</label>
      <div className="relative"><input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-[#d9d9d6] bg-white px-4 py-3 pr-20 text-sm outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/15" />
        <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-3 my-auto h-fit text-xs font-medium text-[#6b6b6b] underline underline-offset-4">{showPassword ? "Hide" : "Show"}</button></div></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
    <button type="submit" disabled={loading || !email.trim() || !password} className="w-full rounded-lg bg-[#800000] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#660000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
  </form>;
}
