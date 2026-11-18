import { ShieldCheck } from "lucide-react";
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-extrabold tracking-tight ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-foreground"><ShieldCheck className="h-5 w-5" /></span>
      Motrick
    </div>
  );
}
