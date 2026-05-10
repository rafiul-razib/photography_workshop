"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const shouldHideFooter =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main>{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}
