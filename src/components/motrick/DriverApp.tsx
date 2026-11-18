import { useEffect, useState } from "react";
import { Fingerprint, Lock, LockOpen, RotateCcw, Truck, Wifi, WifiOff, AlertTriangle, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Logo } from "./Logo";
import { useMotrick } from "./store";

type Phase = "locked" | "verifying" | "ok";
const reasons = ["Falla de lector", "Zona sin cobertura", "Relevo de emergencia"];

export function DriverApp({ framed }: { framed: boolean }) {
  const { addContingency } = useMotrick();
  const [online, setOnline] = useState(true);
  const [phase, setPhase] = useState<Phase>("locked");
  const [secs, setSecs] = useState(120);
  const [modal, setModal] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    if (phase === "verifying") { const t = setTimeout(() => { setPhase("ok"); setSecs(120); }, 2000); return () => clearTimeout(t); }
    if (phase === "ok") { const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000); return () => clearInterval(t); }
    return undefined;
  }, [phase]);

  const request = (r: string) => {
    const c = `MTK-${Math.floor(1000 + Math.random() * 9000)}`;
    setCode(c); addContingency(r, c);
  };
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");

  const screen = (
    <div className="dark flex min-h-full flex-col bg-background p-5 text-foreground">
      <div className="flex items-center justify-between">
        <Logo />
        <button onClick={() => setOnline(!online)} className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${online ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
          {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}{online ? "Conectado - Red Portuaria" : "Modo Offline / Sin Cobertura"}
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-card p-3 text-sm"><Truck className="h-4 w-4 text-brand" />Tractocamión Placa <b>UTB-890</b></div>

      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        {phase === "ok" ? (
          <div key="ok" className="animate-pop flex flex-col items-center">
            <div className="grid h-36 w-36 place-items-center rounded-full bg-success/15 ring-4 ring-success"><LockOpen className="h-16 w-16 text-success" /></div>
            <p className="mt-6 text-xl font-extrabold text-success">¡Identidad Confirmada! Encendido Habilitado</p>
            <p className="mt-1 text-sm text-muted-foreground">Carlos Mendoza - ID Verificado</p>
            <div className="mt-5 rounded-xl bg-card px-6 py-3"><p className="text-xs text-muted-foreground">Tiempo para dar arranque</p><p className="text-3xl font-extrabold tabular-nums">{mm}:{ss} min</p></div>
          </div>
        ) : phase === "verifying" ? (
          <div className="flex flex-col items-center">
            <div className="animate-scan grid h-36 w-36 place-items-center rounded-full bg-brand/20"><ScanFace className="h-16 w-16 animate-pulse text-brand" /></div>
            <p className="mt-6 font-semibold">Verificando identidad y turno asignado...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="grid h-36 w-36 place-items-center rounded-full bg-destructive/15 ring-4 ring-destructive"><Lock className="h-16 w-16 text-destructive" /></div>
            <p className="mt-6 text-xl font-extrabold text-destructive">ENCENDIDO BLOQUEADO</p>
            <p className="text-sm text-muted-foreground">Requiere validación previa al arranque</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {phase === "ok" ? (
          <Button variant="outline" className="h-12 w-full" onClick={() => setPhase("locked")}><RotateCcw className="h-4 w-4" />Reiniciar Simulación</Button>
        ) : (
          <Button disabled={phase === "verifying"} onClick={() => setPhase("verifying")} className="h-16 w-full bg-brand text-base font-bold text-brand-foreground hover:bg-brand/90">
            <Fingerprint className="h-6 w-6" />Iniciar Validación de Conductor
          </Button>
        )}
        <button onClick={() => { setCode(null); setModal(true); }} className="w-full rounded-lg border border-border p-3 text-xs text-muted-foreground hover:bg-card">
          <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-warning" />¿Problemas de lectura o emergencia? Solicitar arranque por contingencia
        </button>
      </div>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Arranque por contingencia</DialogTitle><DialogDescription>Selecciona el motivo. La solicitud queda registrada y trazable.</DialogDescription></DialogHeader>
          {code ? (
            <div className="animate-pop rounded-lg bg-muted p-4 text-center">
              <p className="text-xs text-muted-foreground">Código temporal trazable</p>
              <p className="text-3xl font-extrabold tracking-widest text-brand">{code}</p>
              <p className="mt-2 text-sm">Acción registrada en el panel central. Espera la autorización remota del jefe de flota.</p>
              <Button className="mt-4 w-full" onClick={() => setModal(false)}>Entendido</Button>
            </div>
          ) : (
            <div className="space-y-2">{reasons.map((r) => <Button key={r} variant="outline" className="w-full justify-start" onClick={() => request(r)}>{r}</Button>)}</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  if (!framed) return <div className="min-h-[calc(100vh-3rem)]">{screen}</div>;
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center bg-muted py-8">
      <div className="h-[780px] w-[380px] overflow-hidden rounded-[2.5rem] border-[10px] border-foreground shadow-2xl">
        <div className="h-full overflow-y-auto">{screen}</div>
      </div>
    </div>
  );
}
