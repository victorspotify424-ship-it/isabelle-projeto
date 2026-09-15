import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { getProducts, saveProduct, deleteProduct } from "@/serverFunctions/admin";
import { PageHeader } from "./admin._layout";
import type { Product } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/_layout/produtos")({
  head: () => ({ meta: [{ title: "Produtos | La'Belle Ateliê" }] }),
  component: AdminProdutos,
});

const emptyProduct = (order: number): Product => ({
  id: "",
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  active: true,
  order,
});

function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product>(emptyProduct(0));
  const [isNew, setIsNew] = useState(false);

  const refresh = async () => {
    setProducts(await getProducts());
  };

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  const beginNew = () => {
    setEditing(emptyProduct(products.length + 1));
    setIsNew(true);
  };

  const beginEdit = (p: Product) => {
    setEditing({ ...p });
    setIsNew(false);
  };

  const invalid = useMemo(
    () =>
      !editing.name.trim() ||
      !editing.category.trim() ||
      (editing.price !== "" && isNaN(Number(editing.price.replace(/[^0-9.,]/g, "")))) ||
      (isNew && products.some((p) => p.name.toLowerCase() === editing.name.trim().toLowerCase())),
    [editing, products, isNew],
  );

  const submit = async () => {
    const product: Product = {
      ...editing,
      id: isNew ? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}` : editing.id,
      name: editing.name.trim(),
      description: editing.description.trim(),
      category: editing.category.trim(),
    };
    await saveProduct({ data: { product } });
    setEditing(emptyProduct(0));
    setIsNew(false);
    await refresh();
  };

  return (
    <>
      <PageHeader title="Produtos" subtitle="Produtos exibidos no catálogo do site." action={
        <Button variant="atelier" size="atelier" onClick={beginNew}><Plus className="size-4" /> Novo produto</Button>
      } />

      {(isNew || editing.id) && (
        <div className="mb-6 rounded-[16px] border border-border bg-card p-5">
          <h2 className="text-sm font-bold">{isNew ? "Novo produto" : "Editar produto"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Nome *"><Input value={editing.name} onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))} placeholder="Ex.: Laço de Fita Cetim" /></Field>
            <Field label="Categoria *"><Input value={editing.category} onChange={(e) => setEditing((v) => ({ ...v, category: e.target.value }))} placeholder="Ex.: Laços" /></Field>
            <Field label="Preço (R$)"><Input value={editing.price} onChange={(e) => setEditing((v) => ({ ...v, price: e.target.value }))} placeholder="Ex.: 35,90" /></Field>
            <Field label="URL da imagem"><Input value={editing.image} onChange={(e) => setEditing((v) => ({ ...v, image: e.target.value }))} placeholder="https://..." /></Field>
            <div className="sm:col-span-2">
              <Field label="Descrição"><Textarea value={editing.description} onChange={(e) => setEditing((v) => ({ ...v, description: e.target.value }))} className="min-h-20" /></Field>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="atelier" size="atelier" disabled={invalid} onClick={submit}>Salvar produto</Button>
            <Button variant="atelierOutline" size="atelier" onClick={() => { setEditing(emptyProduct(0)); setIsNew(false); }}>Cancelar</Button>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing((v) => ({ ...v, active: e.target.checked }))}
              />
              Visível no site
            </label>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-[16px] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Nenhum produto cadastrado. Clique em "Novo produto" para começar.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="flex flex-col overflow-hidden rounded-[16px] border border-border bg-card">
              <div className="aspect-[16/10] w-full overflow-hidden bg-secondary">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-[0.65rem] uppercase tracking-widest text-muted-foreground">Sem imagem</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold">{p.name}</h3>
                    <p className="mt-0.5 text-xs text-gold-dark">{p.category}{p.price ? ` · R$ ${p.price}` : ""}</p>
                  </div>
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full ${p.active ? "bg-emerald-100 text-emerald-600" : "bg-secondary text-muted-foreground"}`}>
                    {p.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  </span>
                </div>
                {p.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{p.description}</p>}
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="99"
                    value={p.order}
                    onChange={(e) => saveProduct({ data: { product: { ...p, order: Number(e.target.value) } } }).then(refresh)}
                    className="w-full"
                    aria-label={`Ordem de exibição de ${p.name}`}
                  />
                  <span className="shrink-0 text-[0.65rem] text-muted-foreground">{p.order}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 gap-2" onClick={() => beginEdit(p)}><Pencil className="size-3.5" /> Editar</Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 text-rose-600 hover:text-rose-700"
                    onClick={() => {
                      if (confirm(`Excluir "${p.name}"?`)) deleteProduct({ data: { id: p.id } }).then(refresh);
                    }}
                  >
                    <Trash2 className="size-3.5" /> Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}