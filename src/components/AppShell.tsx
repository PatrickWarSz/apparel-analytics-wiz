import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Factory } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/", label: "Meses" },
    { to: "/config", label: "Cadastros" },
    { to: "/revenda", label: "Revenda" },
    { to: "/estoque", label: "Estoque fiscal" },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-5 py-3">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <Factory className="size-5 text-accent" />
            <span>REMESSA</span>
            <span className="text-accent">/</span>
            <span className="font-normal opacity-80">industrialização</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded px-3 py-1.5 transition-colors hover:bg-white/10",
                  path === l.to && "bg-white/15 font-semibold",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-6">{children}</main>
    </div>
  );
}
