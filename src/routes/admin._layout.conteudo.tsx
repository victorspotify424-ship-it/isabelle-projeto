import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getContent, saveContent } from "@/serverFunctions/admin";
import { PageHeader } from "./admin._layout";
import type { SiteContent } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/_layout/conteudo")({
  head: () => ({ meta: [{ title: "Conteúdo | La'Belle Ateliê" }] }),
  component: AdminConteudo,
});

function AdminConteudo() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getContent().then(setContent).catch(() => {});
  }, []);

  if (!content) {
    return <PageHeader title="Conteúdo" subtitle="Carregando..." />;
  }

  const set = (key: keyof SiteContent, value: string) =>
    setContent((c) => (c ? { ...c, [key]: value } : c));

  const submit = async () => {
    setBusy(true);
    try {
      await saveContent({ data: { content } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Conteúdo" subtitle="Textos exibidos nas páginas do site." action={
        <Button variant="atelier" size="atelier" disabled={busy} onClick={submit}>
          <Save className="size-4" /> {saved ? "Salvo!" : "Salvar alterações"}
        </Button>
      } />

      <div className="grid gap-5">
        <section className="rounded-[16px] border border-border bg-card p-5">
          <h2 className="text-sm font-bold">Página inicial — Destaque</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Frase principal (título do hero)">
              <Input value={content.heroTagline} onChange={(e) => set("heroTagline", e.target.value)} />
            </Field>
            <Field label="Parágrafo de apoio">
              <Textarea value={content.heroParagraph} onChange={(e) => set("heroParagraph", e.target.value)} className="min-h-20" />
            </Field>
          </div>
        </section>

        <section className="rounded-[16px] border border-border bg-card p-5">
          <h2 className="text-sm font-bold">Sobre o ateliê</h2>
          <div className="mt-4">
            <Field label="Texto da seção 'Feito à mão'">
              <Textarea value={content.aboutText} onChange={(e) => set("aboutText", e.target.value)} className="min-h-24" />
            </Field>
          </div>
        </section>

        <section className="rounded-[16px] border border-border bg-card p-5">
          <h2 className="text-sm font-bold">Depoimentos</h2>
          <p className="mt-1 text-xs text-muted-foreground">Deixe um campo vazio para usar o texto atual.</p>
          <div className="mt-4 grid gap-4">
            {content.testimonials.map((t, i) => (
              <Field key={i} label={`Depoimento ${i + 1}`}>
                <Input
                  value={t}
                  onChange={(e) => {
                    const next = [...content.testimonials];
                    next[i] = e.target.value;
                    setContent((c) => (c ? { ...c, testimonials: next } : c));
                  }}
                />
              </Field>
            ))}
          </div>
        </section>
      </div>
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