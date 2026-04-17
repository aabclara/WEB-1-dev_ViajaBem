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

import { useState, useEffect } from "react";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { getAuthUser, logout } from "@/src/lib/auth";

export function Header() {
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<{ nome: string } | null>(null);

  useEffect(() => {
    setUsuario(getAuthUser());
  }, []);

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

        {/* User profile or Login/Cadastro - right */}
        <div className="flex gap-4">
          {usuario ? (
            <>
                <div className="flex items-center gap-4">
                  <Link
                    href="/painel"
                    className="flex items-center gap-1.5 text-primary bg-primary/10 hover:bg-primary/20 px-3 sm:px-4 py-1.5 rounded-full transition-all text-xs sm:text-sm font-bold"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden xs:inline">Painel</span>
                  </Link>
                  <div className="flex items-center gap-2 text-on-background font-bold border-l border-stone-200 pl-4 h-6">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <User size={18} />
                    </div>
                    <span className="hidden sm:inline">{usuario.nome.split(" ")[0]}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-on-surface-variant hover:text-error transition-colors p-2"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}

