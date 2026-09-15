import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Lock, LogIn, LogOut, Package, ShoppingBag, Tags, TextQuote } from "lucide-react";
import { getSession, loginSession, logoutSession } from "@/serverFunctions/admin";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/_layout")({
  loader: () => getSession(),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/conteudo", label: "Conteúdo", icon: TextQuote },
] as const;

function AdminLayout() {
  const { authed } = Route.useLoaderData();
  if (!authed) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-card p-5 lg:flex">
        <div className="flex items-center justify-between">
          <Brand />
          <LogoutButton />
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground [&.active]:bg-secondary [&.active]:font-semibold [&.active]:text-gold-dark"
            >
              <Icon className="size-4" strokeWidth={1.6} /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-[12px] bg-secondary px-4 py-3 text-[0.7rem] leading-5 text-muted-foreground">
          Administração da La'Belle Ateliê. As alterações são publicadas no site imediatamente.
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Brand />
        <LogoutButton />
        <div />
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground [&.active]:bg-secondary [&.active]:font-semibold [&.active]:text-gold-dark"
          >
            <Icon className="size-3.5" /> {label}
          </Link>
        ))}
      </nav>

      <main className="lg:pl-60">
        <div className="atelier-container py-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      aria-label="Sair"
      className={`grid size-8 place-items-center rounded-[8px] text-muted-foreground transition hover:bg-secondary hover:text-foreground ${compact ? "size-8" : ""}`}
      onClick={async () => {
        setBusy(true);
        try {
          await logoutSession();
          await router.invalidate();
        } finally {
          setBusy(false);
        }
      }}
      disabled={busy}
    >
      <LogOut className="size-4" />
    </button>
  );
}

function LoginScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await loginSession({ data: { password } });
      if (!res.ok) setError(res.reason);
      else await router.invalidate();
    } catch {
      setError("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <Card>
        <span className="text-[0.65rem] font-bold tracking-[0.3em] text-gold-dark">ÁREA RESTRITA</span>
        <h1 className="mt-2 text-3xl font-semibold">Administração</h1>
        <p className="mt-2 text-sm text-muted-foreground">Acesse com a senha do administrador.</p>
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Input
            type="password"
            autoFocus
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" variant="atelier" size="atelier" disabled={loading || !password}>
            {loading ? "Entrando..." : "Entrar"} <LogIn className="size-4" />
          </Button>
          <Link to="/" className="text-center text-xs text-muted-foreground hover:text-foreground">
            Voltar ao site
          </Link>
        </form>
      </Card>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`w-full max-w-md rounded-[18px] border border-border bg-card p-8 soft-shadow ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    novo: "bg-blue-100 text-blue-700",
    em_andamento: "bg-amber-100 text-amber-700",
    concluido: "bg-emerald-100 text-emerald-700",
    cancelado: "bg-rose-100 text-rose-700",
  };
  const labels: Record<string, string> = {
    novo: "Novo",
    em_andamento: "Em andamento",
    concluido: "Concluído",
    cancelado: "Cancelado",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-semibold ${styles[status] ?? "bg-secondary text-muted-foreground"}`}>
      {labels[status] ?? status}
    </span>
  );
}