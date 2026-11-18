import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Lock, LockOpen, PanelLeftClose, PanelLeftOpen, Plus, ShieldAlert, Truck, Users, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Logo } from "./Logo";
import { useMotrick, type AlertLevel } from "./store";

type Tab = "monitor" | "fleet";
const tabs = [
  { id: "monitor" as Tab, label: "Monitoreo y Alertas", icon: Activity },
  { id: "fleet" as Tab, label: "Flota y Conductores", icon: Truck },
];

export function WebPanel() {
  const [tab, setTab] = useState<Tab>("monitor");
  const [open, setOpen] = useState(true);
  return (
    <div className="flex min-h-[calc(100vh-3rem)] bg-background">
      <aside className={`${open ? "w-64" : "w-16"} shrink-0 bg-sidebar text-sidebar-foreground transition-all`}>
        <div className="flex h-16 items-center justify-between px-4">
          {open ? <Logo /> : null}
          <button onClick={() => setOpen(!open)} aria-label="Alternar menú" className="rounded p-1 hover:bg-sidebar-accent">
            {open ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </button>
        </div>
        <nav className="space-y-1 px-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${tab === t.id ? "bg-brand text-brand-foreground" : "hover:bg-sidebar-accent"}`}>
              <t.icon className="h-5 w-5 shrink-0" />{open && t.label}
            </button>
          ))}
        </nav>
        {open && <p className="mt-8 px-5 text-xs opacity-60">Cartagena · Mamonal · Contecar</p>}
      </aside>
      <main className="flex-1 overflow-x-auto p-6 lg:p-8">
        {tab === "monitor" && <Monitor />}
        {tab === "fleet" && <Fleet />}
      </main>
    </div>
  );
}

const levelStyle: Record<AlertLevel, string> = {
  red: "border-l-destructive bg-destructive/5",
  yellow: "border-l-warning bg-warning/10",
  green: "border-l-success bg-success/5",
};
const levelIcon = { red: ShieldAlert, yellow: AlertTriangle, green: CheckCircle2 };
const levelText = { red: "text-destructive", yellow: "text-warning-foreground", green: "text-success" };

function Monitor() {
  const { alerts, logs, simulateAlert, authorize } = useMotrick();
  const exceptions = alerts.filter((a) => a.level === "yellow").length;
  const kpis = [
    { label: "Vehículos Activos", value: "18/20", icon: Truck, tone: "text-brand" },
    { label: "Autenticaciones Exitosas Hoy", value: "42", icon: CheckCircle2, tone: "text-success" },
    { label: "Intentos Bloqueados", value: String(alerts.filter((a) => a.level === "red").length + 2), icon: Lock, tone: "text-destructive" },
    { label: "Tokens de Contingencia (1 uso)", value: String(exceptions), icon: AlertTriangle, tone: "text-warning" },
  ];
  return (
    <div className="space-y-6">
      <Header title="Monitoreo y Alertas" sub="Autenticación previa al arranque en tiempo real" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <k.icon className={`h-6 w-6 ${k.tone}`} />
            <p className="mt-3 text-3xl font-extrabold">{k.value}</p>
            <p className="text-sm text-muted-foreground">{k.label}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Alertas Tempranas en Tiempo Real</h2>
            <Button size="sm" onClick={simulateAlert} className="bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="h-4 w-4" />Simular Nueva Alerta</Button>
          </div>
          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {alerts.map((a) => {
              const I = levelIcon[a.level];
              return (
                <div key={a.id} className={`animate-alert-in rounded-lg border border-l-4 p-3 ${levelStyle[a.level]}`}>
                  <div className="flex gap-3">
                    <I className={`mt-0.5 h-5 w-5 shrink-0 ${levelText[a.level]}`} />
                    <div className="flex-1">
                      <div className="flex justify-between gap-2"><p className="text-sm font-semibold">{a.title}</p><span className="text-xs text-muted-foreground">{a.time}</span></div>
                      <p className="text-xs text-muted-foreground">{a.detail}</p>
                      {a.pending && <Button size="sm" variant="outline" className="mt-2 h-7" onClick={() => authorize(a.id)}>Autorizar Token de Contingencia</Button>}
                      {a.authorized && <Badge className="mt-2 bg-success text-success-foreground"><Check className="h-3 w-3" />Autorizado</Badge>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5 xl:col-span-3">
          <h2 className="mb-4 font-bold">Registro Riguroso de Accesos y Trazabilidad</h2>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Vehículo</TableHead><TableHead>Configuración</TableHead><TableHead>Conductor</TableHead><TableHead>Hora</TableHead><TableHead>Método</TableHead><TableHead>Encendido</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {logs.map((l, i) => (
                <TableRow key={i} className="animate-alert-in">
                  <TableCell className="font-semibold">{l.vehicle}</TableCell><TableCell>{l.config}</TableCell><TableCell>{l.driver}</TableCell><TableCell>{l.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={l.method === "Biometría" ? "secondary" : "outline"}
                      className={l.method === "Biometría" ? "whitespace-nowrap" : "whitespace-nowrap border-warning/40 bg-warning/15 text-warning-foreground"}
                    >
                      {l.method}
                    </Badge>
                  </TableCell>
                  <TableCell>{l.status === "Desbloqueado"
                    ? <span className="inline-flex items-center gap-1 text-sm font-medium text-success"><LockOpen className="h-4 w-4" />Desbloqueado</span>
                    : <span className="inline-flex items-center gap-1 text-sm font-medium text-destructive"><Lock className="h-4 w-4" />Bloqueado</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

function Header({ title, sub }: { title: string; sub: string }) {
  return <div><h1 className="text-2xl font-extrabold tracking-tight">{title}</h1><p className="text-muted-foreground">{sub}</p></div>;
}

const fleet = [
  { plate: "UTB-890", type: "Tractocamión", driver: "Carlos Mendoza", device: "En línea", last: "05:02" },
  { plate: "TRK-104", type: "Tractocamión", driver: "Sin asignar", device: "Alerta", last: "05:42" },
  { plate: "TRK-118", type: "Tractocamión", driver: "Andrés Julio", device: "En línea", last: "04:58" },
  { plate: "CRG-221", type: "Camión Rígido", driver: "Luis Barrios", device: "Sin señal", last: "05:31" },
  { plate: "CRG-207", type: "Camión Rígido", driver: "María Pérez", device: "En línea", last: "04:40" },
  { plate: "UTL-032", type: "Utilitario", driver: "Jorge Herrera", device: "En línea", last: "05:15" },
];
function Fleet() {
  const tone = (d: string) => d === "En línea" ? "text-success" : d === "Alerta" ? "text-destructive" : "text-warning";
  return (
    <div className="space-y-6">
      <Header title="Flota y Conductores" sub="Vehículos, conductores asignados y estado de dispositivos" />
      <Card className="p-5">
        <Table>
          <TableHeader><TableRow><TableHead>Placa</TableHead><TableHead>Configuración</TableHead><TableHead><Users className="inline h-4 w-4" /> Conductor</TableHead><TableHead>Dispositivo</TableHead><TableHead>Última validación</TableHead></TableRow></TableHeader>
          <TableBody>{fleet.map((f) => (
            <TableRow key={f.plate}><TableCell className="font-semibold">{f.plate}</TableCell><TableCell>{f.type}</TableCell><TableCell>{f.driver}</TableCell>
              <TableCell className={`font-medium ${tone(f.device)}`}>● {f.device}</TableCell><TableCell>{f.last}</TableCell></TableRow>
          ))}</TableBody>
        </Table>
      </Card>
    </div>
  );
}
