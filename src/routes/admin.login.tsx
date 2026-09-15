import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import { loginSession } from "@/serverFunctions/admin";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Login | La'Belle Ateliê" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await loginSession({ data: { password } });
      if (!res.ok) {
        setError(res.reason);
      } else {
        await router.invalidate();
      }
    } catch {
      setError("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[18px] border border-border bg-card p-8 soft-shadow">
          <div className="mx-auto w-fit"><Brand /></div>
          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <div className="grid size-11 place-items-center rounded-full bg-secondary text-gold-dark"><Lock className="size-5" strokeWidth={1.6} /></div>
            <h1 className="text-2xl font-semibold">Área do administrador</h1>
            <p className="text-sm text-muted-foreground">Digite a senha para acessar.</p>
          </div>
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
          </form>
        </div>
      </div>
    </div>
  );
}