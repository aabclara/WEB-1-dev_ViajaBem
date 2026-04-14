"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, LogIn, UserPlus, LayoutDashboard, Home } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/cadastro", label: "Cadastro", icon: UserPlus },
  { href: "/painel", label: "Painel", icon: LayoutDashboard },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Marca */}
        <Link
          href="/"
          className="flex items-center gap-2 text-viaje-primary transition-opacity hover:opacity-80"
        >
          <Bus size={28} strokeWidth={2.2} />
          <span className="text-xl font-bold tracking-tight">Viaje Bem</span>
        </Link>

        {/* Navegacao */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-viaje-primary/10 text-viaje-primary"
                    : "text-viaje-neutral hover:bg-stone-200/60 hover:text-viaje-primary",
                )}
              >
                <Icon size={16} strokeWidth={2} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
