"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/browser";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page doesn't get the admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setAuthenticated(true);
      }
    });
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (authenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-charcoal-light">Loading...</div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: t("dashboard") },
    { href: "/admin/orders", label: t("orders") },
    { href: "/admin/products", label: t("products") },
    { href: "/admin/inquiries", label: t("inquiries") },
  ];

  return (
    <div className="min-h-screen">
      {/* Admin nav bar */}
      <div className="bg-forest text-cream sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12 overflow-x-auto">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    pathname === item.href
                      ? "bg-white/20 text-white"
                      : "text-cream/70 hover:text-cream hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="text-sm text-cream/70 hover:text-cream transition-colors whitespace-nowrap ml-4"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
