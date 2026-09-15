import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { Brand } from "./brand";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

const nav = [
  ["Início", "/#inicio"], ["Sobre", "/#sobre"], ["Produtos", "/#categorias"],
  ["Kits Temáticos", "/#kits"], ["Depoimentos", "/#depoimentos"], ["Contato", "/#contato"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur-xl">
      <div className="atelier-container grid h-[68px] grid-cols-[40px_1fr_40px] items-center lg:flex lg:h-[78px] lg:justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-border bg-paper p-8">
            <SheetTitle className="sr-only">Menu principal</SheetTitle>
            <Brand className="mb-10" />
            <nav className="flex flex-col gap-1">
              {nav.map(([label, href]) => <SheetClose asChild key={label}><a href={href} className="border-b border-border py-4 font-display text-2xl">{label}</a></SheetClose>)}
            </nav>
            <Button asChild variant="atelier" size="atelier" className="mt-8 w-full"><Link to="/encomenda">Faça sua encomenda</Link></Button>
          </SheetContent>
        </Sheet>
        <a href="/#inicio" aria-label="La'Belle Ateliê, início" className="justify-self-center lg:justify-self-auto"><Brand /></a>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([label, href]) => <a key={label} href={href} className="text-[0.72rem] font-semibold text-brown transition-colors hover:text-gold-dark">{label}</a>)}
        </nav>
        <div className="hidden items-center gap-1 lg:flex">
          <Button variant="ghost" size="icon" aria-label="Pesquisar"><Search strokeWidth={1.5} /></Button>
          <Button variant="ghost" size="icon" aria-label="Favoritos"><Heart strokeWidth={1.5} /></Button>
          <Button variant="ghost" size="icon" aria-label="Encomenda"><ShoppingBag strokeWidth={1.5} /></Button>
          <Button asChild variant="atelier" size="atelier" className="ml-3"><Link to="/encomenda">Faça sua encomenda</Link></Button>
        </div>
        <Link to="/encomenda" aria-label="Abrir encomenda" className="grid size-10 place-items-center justify-self-end lg:hidden"><ShoppingBag className="size-5" strokeWidth={1.5} /></Link>
      </div>
    </header>
  );
}