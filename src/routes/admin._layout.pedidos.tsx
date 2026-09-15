import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { getOrders, updateOrderStatus, deleteOrder } from "@/serverFunctions/admin";
import { PageHeader, StatusPill } from "./admin._layout";
import type { Order } from "@/lib/store";
import { ORDER_STATUS_LABELS } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/_layout/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos | La'Belle Ateliê" }] }),
  component: AdminPedidos,
});

function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = async () => {
    setOrders(await getOrders());
  };

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  return (
    <>
      <PageHeader title="Pedidos" subtitle={`${orders.length} registro(s) no sistema.`} action={
        <Button variant="atelierOutline" size="atelier" onClick={() => { setBusy(null); refresh(); }}><RefreshCw className="size-4" /> Atualizar</Button>
      } />

      {orders.length === 0 ? (
        <div className="rounded-[16px] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Nenhum pedido registrado. Quando um cliente enviar uma encomenda, ele aparecerá aqui.
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="flex flex-col gap-4 rounded-[16px] border border-border bg-card p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-semibold">{o.name || o.product}</h3>
                  <StatusPill status={o.status} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
                  <Field label="Produto" value={o.product} />
                  <Field label="Tema" value={o.theme} />
                  <Field label="Quantidade" value={o.quantity ? `${o.quantity} un.` : null} />
                  <Field label="Data do evento" value={o.eventDate} />
                  <Field label="Cidade" value={o.city} />
                  <Field label="Cores" value={o.colors} />
                  <Field label="Nome" value={o.name} />
                  <Field label="Idade" value={o.age} />
                </dl>
                {o.notes && (
                  <div className="mt-3 rounded-[10px] bg-secondary p-3 text-xs leading-5 text-muted-foreground">
                    <span className="font-bold text-brown-dark">Observações:</span> {o.notes}
                  </div>
                )}
                <p className="mt-2 text-[0.65rem] text-muted-foreground">
                  Criado em {new Date(o.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                <select
                  className="rounded-[10px] border border-border bg-paper px-3 py-2 text-sm"
                  value={o.status}
                  disabled={busy === o.id}
                  onChange={(e) => {
                    const status = e.target.value as Order["status"];
                    setBusy(o.id);
                    updateOrderStatus({ data: { id: o.id, status } }).finally(() => {
                      refresh().finally(() => setBusy(null));
                    });
                  }}
                >
                  {(Object.entries(ORDER_STATUS_LABELS) as [Order["status"], string][]).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                <Button
                  variant="ghost"
                  className="mt-2 justify-start gap-2 text-rose-600 hover:text-rose-700"
                  disabled={busy === o.id}
                  onClick={() => {
                    if (!confirm(`Excluir o pedido de ${o.name || o.product}?`)) return;
                    setBusy(o.id);
                    deleteOrder({ data: { id: o.id } }).finally(() => {
                      refresh().finally(() => setBusy(null));
                    });
                  }}
                >
                  <Trash2 className="size-3.5" /> Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <dt className="text-[0.62rem] font-bold uppercase tracking-widest text-gold-dark">{label}</dt>
      <dd className="mt-0.5 truncate">{value}</dd>
    </div>
  );
}