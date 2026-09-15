import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronRight, Gift, Heart, Image as ImageIcon, MessageCircle, Package, Palette, ShoppingCart, Truck } from "lucide-react";
import heroImage from "@/assets/labelle-hero.jpg";
import kitsImage from "@/assets/labelle-kits.jpg";
import processImage from "@/assets/labelle-process.jpg";
import productsImage from "@/assets/labelle-products.jpg";
import bowImage from "@/assets/category-bow.jpg";
import stationeryImage from "@/assets/category-stationery.jpg";
import keychainImage from "@/assets/category-keychain.jpg";
import centerpieceImage from "@/assets/category-centerpiece.jpg";
import arrangementImage from "@/assets/category-arrangement.jpg";
import favorImage from "@/assets/category-favor.jpg";
import { SiteHeader } from "@/components/site-header";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { getPublicContent, getPublicProducts } from "@/serverFunctions/admin";
import type { Product, SiteContent } from "@/lib/store";

const whatsapp = "https://wa.me/5567998517483?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20La%27Belle%20Ateli%C3%AA%20e%20gostaria%20de%20fazer%20uma%20encomenda.";
const FALLBACK_CATEGORIES = ["Laços", "Papelaria Personalizada", "Chaveiros em Resina", "Centros de Mesa", "Arranjos", "Lembrancinhas"];
const FALLBACK_CATEGORY_IMAGES = [bowImage, stationeryImage, keychainImage, centerpieceImage, arrangementImage, favorImage];
const galleryPositions = ["5% 15%", "35% 20%", "64% 15%", "90% 35%", "15% 85%", "54% 82%"];
const steps = [
  { icon: ShoppingCart, label: "Escolha o produto ou kit" }, { icon: Palette, label: "Defina o tema e personalização" },
  { icon: Package, label: "Informe a quantidade" }, { icon: CalendarDays, label: "Nos envie a data do evento" }, { icon: ImageIcon, label: "Envie referências (se tiver)" },
];
const benefits = [
  { icon: Truck, label: "Atendimento personalizado" },
  { icon: Heart, label: "Produtos exclusivos" },
  { icon: Gift, label: "Feito com carinho" },
];

const DEFAULT_CONTENT: SiteContent = {
  heroTagline: "Papelaria e personalizados para momentos inesquecíveis.",
  heroParagraph: "Transformamos suas ideias em detalhes que fazem toda a diferença.",
  aboutText: "Na La'Belle Ateliê, cada detalhe é criado com carinho para transformar momentos especiais em memórias únicas.",
  testimonials: [
    "Ficou ainda mais lindo do que eu imaginava!",
    "Cada detalhe ficou perfeito.",
    "Atendimento maravilhoso e trabalho impecável.",
  ],
};

export const Route = createFileRoute("/")({
  loader: async () => {
    const [content, products] = await Promise.all([
      getPublicContent().catch(() => DEFAULT_CONTENT),
      getPublicProducts().catch(() => [] as Product[]),
    ]);
    return { content, products };
  },
  head: () => ({ meta: [
    { title: "La'Belle Ateliê | Papelaria e Personalizados em Vicentina - MS" },
    { name: "description", content: "Papelaria personalizada, laços, chaveiros em resina, centros de mesa, arranjos e lembrancinhas para tornar seus momentos ainda mais especiais." },
    { property: "og:title", content: "La'Belle Ateliê | Papelaria e Personalizados" },
    { property: "og:description", content: "Detalhes personalizados para momentos inesquecíveis em Vicentina - MS." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Home,
});

const reveal = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.55 } };

function Home() {
  const { content, products } = Route.useLoaderData();
  const categories = FALLBACK_CATEGORIES;
  const categoryImages = FALLBACK_CATEGORY_IMAGES;

  return <div className="min-h-screen bg-background">
    <SiteHeader />
    <main>
      <section id="inicio" className="overflow-hidden bg-[linear-gradient(105deg,var(--cream)_0%,var(--cream-2)_100%)]">
        <div className="mx-auto grid min-h-[570px] max-w-[1440px] lg:grid-cols-[44%_56%]">
          <div className="relative z-10 flex flex-col justify-center px-5 py-14 sm:px-10 lg:pl-[max(40px,calc((100vw-1240px)/2))] lg:pr-10 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
              <p className="mb-6 text-[0.65rem] font-semibold tracking-[0.34em] text-gold-dark">SONHE&nbsp; • &nbsp;PERSONALIZE&nbsp; • &nbsp;CELEBRE</p>
              <h1 className="font-display text-[3.4rem] font-semibold leading-[0.78] text-brown-dark sm:text-7xl">La'Belle <span className="mt-4 block text-2xl font-medium tracking-[0.28em]">ATELIÊ</span></h1>
              <h2 className="mt-8 max-w-md font-display text-[2.25rem] font-medium leading-[0.98] text-brown-dark sm:text-[2.85rem]">{content.heroTagline}</h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">{content.heroParagraph}</p>
              <div className="mt-7 grid gap-3 sm:flex">
                <Button asChild variant="atelier" size="atelier"><Link to="/encomenda">Monte sua encomenda <ArrowRight /></Link></Button>
                <Button asChild variant="atelierOutline" size="atelier"><a href="#categorias">Ver catálogo</a></Button>
              </div>
            </motion.div>
            <div className="mt-9 grid grid-cols-3 gap-3 border-t border-border pt-5">
              {benefits.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-0 flex-col gap-2 text-[0.6rem] leading-tight text-muted-foreground sm:flex-row sm:items-center"><Icon className="size-5 shrink-0 text-gold-dark" strokeWidth={1.4}/><span>{label}</span></div>)}
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }} className="relative min-h-[440px] lg:min-h-[570px]">
            <img src={heroImage} alt="Cenário de festa personalizado com balões, urso e lembrancinhas" className="absolute inset-0 h-full w-full object-cover" width={1600} height={1056}/>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--cream-2)_0%,transparent_22%)] opacity-80 max-lg:hidden" />
            <p className="absolute right-[8%] top-[9%] max-w-[180px] rotate-[-5deg] font-script text-3xl leading-tight text-brown">Pequenos detalhes,<br/>grandes histórias.</p>
          </motion.div>
        </div>
      </section>

      <section id="categorias" className="py-16 lg:py-20">
        <div className="atelier-container">
          <motion.div {...reveal} className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div><h2 className="text-4xl font-semibold">Nossas Categorias</h2><p className="mt-1 text-sm text-muted-foreground">Tudo para tornar seu momento ainda mais especial.</p></div>
            <a href="#galeria" className="hidden items-center gap-1 text-xs font-semibold text-gold-dark sm:flex">Ver todas <ArrowRight className="size-3"/></a>
          </motion.div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((name,i) => <motion.a {...reveal} transition={{ duration:.45, delay:i*.05 }} href="/encomenda" key={name} className="group overflow-hidden rounded-[14px] border border-border bg-card soft-shadow transition duration-300 hover:-translate-y-1.5 hover:shadow-lg">
              <div className="aspect-[4/4.2] overflow-hidden"><img src={categoryImages[i]} alt={name} loading="lazy" width={800} height={1008} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"/></div>
              <h3 className="flex min-h-14 items-center justify-center px-2 text-center font-sans text-xs font-semibold leading-tight">{name}</h3>
            </motion.a>)}
          </div>
        </div>
      </section>

      {products.length > 0 && <section id="produtos" className="py-16 lg:py-20">
        <div className="atelier-container">
          <motion.div {...reveal} className="mb-7"><h2 className="text-4xl font-semibold">Catálogo</h2><p className="mt-1 text-sm text-muted-foreground">Produtos disponíveis na La'Belle Ateliê.</p></motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <motion.a {...reveal} href="/encomenda" key={p.id} className="group flex flex-col overflow-hidden rounded-[16px] border border-border bg-card soft-shadow transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="aspect-[16/10] overflow-hidden bg-secondary">
                {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center text-[0.65rem] uppercase tracking-widest text-muted-foreground">Imagem em breve</div>}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-sans text-sm font-bold">{p.name}</h3>
                <p className="mt-0.5 text-xs text-gold-dark">{p.category}{p.price ? ` · R$ ${p.price}` : ""}</p>
                {p.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{p.description}</p>}
                <div className="mt-auto pt-4"><span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-dark">Faça sua encomenda <ArrowRight className="size-3" /></span></div>
              </div>
            </motion.a>)}
          </div>
        </div>
      </section>}

      <section id="kits" className="atelier-container pb-16 lg:pb-20">
        <motion.div {...reveal} className="grid overflow-hidden rounded-[18px] bg-secondary soft-shadow lg:grid-cols-[34%_66%]">
          <div className="flex flex-col justify-center p-8 lg:p-12"><h2 className="text-4xl font-semibold leading-none">Kits Temáticos<br/>Personalizados</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Temas que encantam,<br/>detalhes que marcam!</p><Button asChild variant="atelier" size="atelier" className="mt-7 w-fit"><Link to="/encomenda">Ver kits temáticos <ArrowRight/></Link></Button></div>
          <div className="relative min-h-72 overflow-hidden"><img src={kitsImage} alt="Kit temático personalizado com borboletas" loading="lazy" width={1600} height={720} className="absolute inset-0 h-full w-full object-cover"/><p className="absolute right-8 top-8 rotate-[-5deg] text-right font-script text-3xl leading-tight text-brown-dark">Cada festa<br/>tem uma<br/>história única ♡</p></div>
        </motion.div>
      </section>

      <section className="border-y border-border bg-paper py-16">
        <div className="atelier-container grid gap-8 lg:grid-cols-[1fr_330px] lg:items-center">
          <motion.div {...reveal}><h2 className="mb-8 text-4xl font-semibold">Como fazer sua encomenda?</h2><div className="grid gap-6 sm:grid-cols-5 sm:gap-2">
            {steps.map(({ icon: Icon, label },i)=><div key={label} className="relative flex items-center gap-4 sm:flex-col sm:text-center"><div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-gold-dark"><Icon className="size-5" strokeWidth={1.5}/></div><div><span className="text-[0.62rem] font-bold tracking-widest text-gold-dark">ETAPA 0{i+1}</span><p className="mt-1 text-xs leading-4">{label}</p></div>{i<4&&<ChevronRight className="absolute -right-2 top-4 hidden size-3 text-primary/50 sm:block"/>}</div>)}
          </div></motion.div>
          <motion.aside {...reveal} className="rounded-[14px] border border-border bg-background p-6"><div className="flex gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground"><MessageCircle/></div><div><h3 className="font-sans text-sm font-bold">Fale conosco pelo WhatsApp</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Tire suas dúvidas e faça sua encomenda de forma rápida e fácil.</p></div></div><Button asChild variant="whatsapp" size="atelier" className="mt-5 w-full"><a href={whatsapp} target="_blank" rel="noreferrer">Chamar no WhatsApp <ArrowRight/></a></Button></motion.aside>
        </div>
      </section>

      <section id="galeria" className="py-16 lg:py-20"><div className="atelier-container"><motion.div {...reveal} className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div><h2 className="text-4xl font-semibold">Inspire-se</h2><p className="mt-1 max-w-xl text-sm text-muted-foreground">Trabalhos que transformaram momentos em memórias especiais.</p></div><a href="https://instagram.com/labelle_ateliel" target="_blank" rel="noreferrer" className="hidden text-xs font-semibold text-gold-dark sm:block">Ver mais no Instagram →</a></motion.div><div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
        {galleryPositions.map((pos,i)=><div key={pos} className="group aspect-[4/5] min-w-[70vw] snap-center overflow-hidden rounded-[12px] border border-border sm:min-w-0"><img src={i%2?productsImage:kitsImage} alt={`Trabalho personalizado La'Belle ${i+1}`} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" style={{objectPosition:pos}}/></div>)}</div></div></section>

      <section id="sobre" className="bg-secondary py-16 lg:py-24"><div className="atelier-container grid items-center gap-10 lg:grid-cols-2"><motion.div {...reveal} className="overflow-hidden rounded-[18px]"><img src={processImage} alt="Processo artesanal de uma encomenda La'Belle" loading="lazy" width={1200} height={912} className="aspect-[4/3] h-full w-full object-cover"/></motion.div><motion.div {...reveal} className="lg:px-12"><span className="text-[0.65rem] font-bold tracking-[0.3em] text-gold-dark">NOSSO ATELIÊ</span><h2 className="mt-4 text-5xl font-semibold leading-[.95]">Feito à mão.<br/>Pensado para você.</h2><p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">{content.aboutText}</p></motion.div></div></section>

      <section id="depoimentos" className="py-16 lg:py-20"><div className="atelier-container"><h2 className="mb-8 text-center text-4xl font-semibold">Palavras de carinho</h2><div className="grid gap-4 md:grid-cols-3">{content.testimonials.filter(Boolean).map((text,i)=><motion.blockquote {...reveal} transition={{duration:.45,delay:i*.08}} key={i} className="rounded-[14px] border border-border bg-card p-7 text-center soft-shadow"><div className="mb-4 text-sm tracking-[0.24em] text-gold">★★★★★</div><p className="font-display text-2xl leading-snug">“{text}”</p></motion.blockquote>)}</div></div></section>

      <section className="bg-champagne py-16 text-primary-foreground lg:py-20"><motion.div {...reveal} className="atelier-container text-center"><h2 className="text-5xl font-semibold leading-[.95] sm:text-6xl">Seu momento merece<br/>detalhes inesquecíveis.</h2><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-primary-foreground/85">Conte sua ideia para nós e vamos criar algo exclusivamente seu.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="atelier" className="bg-brown-dark hover:bg-brown"><Link to="/encomenda">Monte sua encomenda <ArrowRight/></Link></Button><Button asChild size="atelier" variant="atelierOutline" className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"><a href={whatsapp} target="_blank" rel="noreferrer">Falar no WhatsApp</a></Button></div></motion.div></section>
    </main>
    <footer id="contato" className="bg-brown-dark py-14 text-primary-foreground"><div className="atelier-container grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]"><div><Brand light/><p className="mt-6 max-w-xs text-xs leading-6 text-primary-foreground/65">Papelaria e personalizados feitos com carinho.<br/>Vicentina - MS<br/>Não atendemos aos sábados.</p></div><div><h3 className="font-sans text-xs font-bold uppercase tracking-widest text-champagne">Navegue</h3><div className="mt-5 grid grid-cols-2 gap-3 text-xs text-primary-foreground/70"><a href="#inicio">Início</a><a href="#categorias">Produtos</a><a href="#kits">Kits</a><Link to="/encomenda">Encomendas</Link></div></div><div><h3 className="font-sans text-xs font-bold uppercase tracking-widest text-champagne">Fale conosco</h3><div className="mt-5 flex flex-col gap-3 text-xs text-primary-foreground/70"><a href="https://instagram.com/labelle_ateliel" target="_blank" rel="noreferrer">@labelle_ateliel</a><a href={whatsapp} target="_blank" rel="noreferrer">(67) 99851-7483</a></div></div></div><div className="atelier-container mt-12 flex flex-col gap-2 border-t border-primary-foreground/10 pt-5 text-[0.65rem] text-primary-foreground/45 sm:flex-row sm:justify-between"><span>© 2026 La'Belle Ateliê. Todos os direitos reservados.</span><span>Desenvolvido por Vic Solves</span></div></footer>
    <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp" className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105"><MessageCircle/></a>
  </div>;
}