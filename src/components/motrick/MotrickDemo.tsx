import { useState } from "react";
import { MotrickProvider } from "./store";
import { WebPanel } from "./WebPanel";
import { DriverApp } from "./DriverApp";

type Mode = "auto" | "pc" | "mobile";
const modes: { id: Mode; label: string }[] = [
  { id: "auto", label: "Automático (Responsive)" },
  { id: "pc", label: "Forzar Vista PC (Panel Web)" },
  { id: "mobile", label: "Forzar Vista Móvil (App Conductor)" },
];

export function MotrickDemo() {
  const [mode, setMode] = useState<Mode>("auto");
  return (
    <MotrickProvider>
      <div className="sticky top-0 z-40 flex h-12 items-center gap-2 overflow-x-auto bg-sidebar px-3 text-sidebar-foreground">
        <span className="shrink-0 text-xs font-bold">Modo Demo Motrick:</span>
        {modes.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${mode === m.id ? "bg-brand text-brand-foreground" : "hover:bg-sidebar-accent"}`}>{m.label}</button>
        ))}
      </div>
      {mode === "pc" && <WebPanel />}
      {mode === "mobile" && <DriverApp framed />}
      {mode === "auto" && (<>
        <div className="hidden lg:block"><WebPanel /></div>
        <div className="lg:hidden"><DriverApp framed={false} /></div>
      </>)}
    </MotrickProvider>
  );
}
