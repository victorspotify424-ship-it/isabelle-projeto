import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <div className={cn("inline-flex flex-col items-center leading-none", light && "text-primary-foreground", className)}>
      <Sprout className="mb-0.5 size-4 text-gold" strokeWidth={1.35} />
      <span className="font-display text-[1.65rem] font-semibold leading-[0.7]">La'Belle</span>
      <span className="mt-2 text-[0.48rem] font-semibold tracking-[0.32em]">ATELIÊ</span>
    </div>
  );
}