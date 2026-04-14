import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/src/components/Header";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Viaje Bem — Gestão de Viagens",
  description: "Plataforma para gestão de combos de viagens curtas e grupos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className={montserrat.className}>
        <Header />
        <main className="min-h-screen bg-background text-foreground">
          {children}
        </main>
      </body>
    </html>
  );
}

