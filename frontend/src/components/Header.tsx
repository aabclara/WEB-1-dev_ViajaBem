"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { clsx } from "clsx";
import { useAuthUser } from "@/src/presentation/hooks/useAuthUser";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Destinos" },
  { href: "/#viagens", label: "Viagens" },
  { href: "/sobre", label: "Sobre" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { usuario, logout } = useAuthUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-surface-variant/20">
      <div className="flex justify-between items-center px-6 sm:px-8 h-20 w-full max-w-7xl mx-auto">
        {/* Logo - left */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Bus size={28} strokeWidth={2.2} className="text-primary" />
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-on-background whitespace-nowrap">
            Viaje Bem
          </span>
        </Link>

        {/* Navigation - center (Desktop) */}
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

        {/* User profile or Login/Cadastro - right (Desktop) */}
        <div className="hidden md:flex gap-4">
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
                <Link href="/perfil" className="flex items-center gap-2 text-on-background font-bold border-l border-stone-200 pl-4 h-6 hover:text-primary transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <User size={18} />
                  </div>
                  <span className="hidden sm:inline">{usuario.apelido || usuario.nome.split(" ")[0]}</span>
                </Link>
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

        {/* Hamburger Menu button - Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex md:hidden text-on-background p-2 transition-colors hover:text-primary focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-surface-variant/30 px-6 py-6 flex flex-col gap-6 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 font-semibold text-lg">
            {navItems.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={clsx(
                    "transition-colors duration-200 py-1",
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
          <div className="h-px bg-surface-variant/30" />
          <div className="flex flex-col gap-3">
            {usuario ? (
              <>
                <Link
                  href="/painel"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 text-primary bg-primary/10 hover:bg-primary/20 py-3 rounded-xl transition-all text-sm font-bold w-full"
                >
                  <LayoutDashboard size={18} />
                  <span>Painel</span>
                </Link>
                <Link
                  href="/perfil"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 text-on-background bg-surface-container-high py-3 rounded-xl transition-all text-sm font-bold w-full"
                >
                  <User size={18} />
                  <span>{usuario.apelido || usuario.nome.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 text-error bg-error/10 hover:bg-error/20 py-3 rounded-xl transition-all text-sm font-bold w-full"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                >
                  Login
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-secondary text-on-secondary py-3 rounded-xl font-bold flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                >
                  Cadastro
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

