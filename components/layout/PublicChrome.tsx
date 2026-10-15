"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { ReactNode } from "react";

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <><Header />{children}<Footer /></>;
}
