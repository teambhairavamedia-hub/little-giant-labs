import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin | Little Giant Labs", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#f7f7f6] text-[#0a0a0a]">{children}</div>;
}
