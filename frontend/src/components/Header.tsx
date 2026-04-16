"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Destinos" },
  { href: "/#viagens", label: "Viagens" },
  { href: "/sobre", label: "Sobre" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-7xl mx-auto">
        {/* Logo - left */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Bus size={28} strokeWidth={2.2} className="text-primary" />
          <span className="text-2xl font-black tracking-tighter text-on-background">
            Viaje Bem
          </span>
        </Link>

        {/* Navigation - center */}
        <nav className="hidden md:flex items-center space-x-8 font-medium text-lg">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

          {/* Login and Cadastro buttons - right */}
          <div className="flex gap-4">
            <Link
              href="/login"
              className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold h-10 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
            >
              Login
            </Link>
            <Link
              href="/cadastro"
              className="bg-secondary text-on-secondary px-6 py-2 rounded-xl font-bold h-10 flex items-center justify-center transition-transform active:scale-95 shadow-sm"
            >
              Cadastro
            </Link>
          </div>
      </div>
    </header>
  );
}
