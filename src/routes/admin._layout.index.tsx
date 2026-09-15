import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { getOrders, getProducts } from "@/serverFunctions/admin";
import { PageHeader, StatusPill } from "./admin._layout";
import type { Order, Product } from "@/lib/store";

export const Route = createFileRoute("/admin/_layout/")({
  head: () => ({ meta: [{ title: "Painel | La'Belle Ateliê" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getOrders().then(setOrders).catch(() => {});
    getProducts().then(setProducts).catch(() => {});
  }, []);

  const recent = orders.slice(0, 3);
  const newCount = orders.filter((o) => o.status === "novo").length;

  const cards = [
    { to: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos", value: orders.length, sub: newCount > 0 ? `${newCount} novos` : null, color: "bg-blue-50 text-blue-600" },
    { to: "/admin/produtos", icon: Package, label: "Produtos", value: products.length, sub: `${products.filter((p) => p.active).length} ativos`, color: "bg-emerald-50 text-emerald-600" },
  ] as const;

  return (
    <>
      <PageHeader
        title="Painel"
        subtitle="Visão geral da La'Belle Ateliê."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ to, icon: Icon, label, value, sub, color }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col gap-4 rounded-[16px] border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`grid size-10 place-items-center rounded-[10px] text-white ${color}`}><Icon className="size-5" /></div>
            <div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
              <div className="mt-1 text-3xl font-semibold">{value}</div>
              {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">Pedidos recentes</h2>
          <Link to="/admin/pedidos" className="text-xs text-gold-dark hover:underline">Ver todos</Link>
        </div>
        <div className="grid gap-3">
          {recent.length === 0 && (
            <div className="rounded-[14px] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Nenhum pedido registrado ainda.
            </div>
          )}
          {recent.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-border bg-card p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{o.name || o.product}</p>
                <p className="text-xs text-muted-foreground">
                  {o.product} · {o.quantity} un. · {o.eventDate || "Sem data"}
                </p>
              </div>
              <StatusPill status={o.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}