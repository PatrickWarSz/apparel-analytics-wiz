import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { LogOut, Factory } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Carregando…
      </div>
    );
  }

  const links = [
    { to: "/", label: "Meses" },
    { to: "/config", label: "Cadastros" },
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
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span className="hidden opacity-70 sm:inline">{user.email}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1 text-primary-foreground hover:bg-white/10"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
            >
              <LogOut className="size-4" /> Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-6">{children}</main>
    </div>
  );
}
