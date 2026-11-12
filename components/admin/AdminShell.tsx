"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSignOut } from "@/components/admin/AdminSignOut";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: "M19.14 12.94a7.07 7.07 0 0 0 0-1.88l2.03-1.58-1.92-3.32-2.39.96a7.3 7.3 0 0 0-1.62-.94L14.88 3.5h-3.84l-.36 2.68c-.58.23-1.12.55-1.62.94l-2.39-.96-1.92 3.32 2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58 1.92 3.32 2.39-.96c.5.39 1.04.71 1.62.94l.36 2.68h3.84l.36-2.68c.58-.23 1.12-.55 1.62-.94l2.39.96 1.92-3.32-2.03-1.58ZM12.96 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z",
  },
];

/* Admin page frame: a left menu (always shown on large screens, a slide-in drawer on smaller ones) with
   Dashboard and Settings, and a top bar with sign out. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The drawer closes when a link is chosen, the backdrop is clicked or Escape is pressed
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1 p-4">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000] ${active ? "bg-[#800000]/10 text-[#800000]" : "text-[#4a4a4a] hover:bg-[#f3f3f1] hover:text-[#0a0a0a]"}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current"><path d={item.icon} /></svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Large screens: fixed left menu */}
      <aside className="hidden w-60 shrink-0 border-r border-[#e8e8e6] bg-white lg:sticky lg:top-0 lg:block lg:h-screen">
        <div className="border-b border-[#e8e8e6] px-6 py-5">
          <Link href="/admin/dashboard" className="label-eyebrow text-[#800000]">Little Giant Labs <span className="ml-1 text-[#6b6b6b]">Admin</span></Link>
        </div>
        {nav}
      </aside>

      {/* Smaller screens: drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <aside
          id="admin-drawer"
          className={`absolute inset-y-0 left-0 w-64 max-w-[80vw] bg-white shadow-xl transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
          inert={!open}
        >
          <div className="flex items-center justify-between border-b border-[#e8e8e6] px-5 py-5">
            <span className="label-eyebrow text-[#800000]">Admin menu</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-md p-1 text-[#6b6b6b] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-[#800000]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7l-1.4-1.4L9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3 1.4 1.4Z" /></svg>
            </button>
          </div>
          {nav}
        </aside>
      </div>

      <div className="min-w-0 flex-1">
        <header className="border-b border-[#e8e8e6] bg-white">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="admin-drawer"
                className="rounded-md border border-[#e8e8e6] p-2 text-[#4a4a4a] hover:border-[#800000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#800000] lg:hidden"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" /></svg>
              </button>
              <Link href="/admin/dashboard" className="label-eyebrow text-[#800000] lg:hidden">Little Giant Labs <span className="ml-1 text-[#6b6b6b]">Admin</span></Link>
            </div>
            <AdminSignOut />
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
