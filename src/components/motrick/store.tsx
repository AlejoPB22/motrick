import { createContext, useContext, useState, type ReactNode } from "react";

export type AlertLevel = "red" | "yellow" | "green";
export type FleetAlert = { id: string; level: AlertLevel; title: string; detail: string; time: string; pending?: boolean; authorized?: boolean };
export type AccessLog = { vehicle: string; config: string; driver: string; time: string; method: "Biometría" | "PIN" | "Contingencia"; status: "Desbloqueado" | "Bloqueado" };

const now = () => new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

const initialAlerts: FleetAlert[] = [
  { id: "a1", level: "red", title: "Intento de arranque sin autenticación", detail: "Tractocamión TRK-104 · Zona Portuaria Mamonal", time: "05:42" },
  { id: "a2", level: "yellow", title: "Solicitud de arranque por contingencia sin señal", detail: "Camión Rígido CRG-221 · Vía Pasacaballos · Código MTK-4821", time: "05:31", pending: true },
  { id: "a3", level: "green", title: "Relevo de turno validado", detail: "Utilitario UTL-032 · Patio Bosque → Conductor J. Herrera", time: "05:15" },
  { id: "a4", level: "green", title: "Relevo de turno validado", detail: "Tractocamión UTB-890 · Terminal Contecar", time: "05:02" },
];

const initialLogs: AccessLog[] = [
  { vehicle: "UTB-890", config: "Tractocamión", driver: "Carlos Mendoza", time: "05:02", method: "Biometría", status: "Desbloqueado" },
  { vehicle: "TRK-104", config: "Tractocamión", driver: "No identificado", time: "05:42", method: "PIN", status: "Bloqueado" },
  { vehicle: "CRG-221", config: "Camión Rígido", driver: "Luis Barrios", time: "05:31", method: "Contingencia", status: "Bloqueado" },
  { vehicle: "UTL-032", config: "Utilitario", driver: "Jorge Herrera", time: "05:15", method: "Biometría", status: "Desbloqueado" },
  { vehicle: "TRK-118", config: "Tractocamión", driver: "Andrés Julio", time: "04:58", method: "PIN", status: "Desbloqueado" },
  { vehicle: "CRG-207", config: "Camión Rígido", driver: "María Pérez", time: "04:40", method: "Biometría", status: "Desbloqueado" },
];

const simulated: Omit<FleetAlert, "id" | "time">[] = [
  { level: "red", title: "Intento de arranque bloqueado", detail: "Tractocamión TRK-131 · Muelle Sociedad Portuaria" },
  { level: "yellow", title: "Contingencia: falla de lector biométrico", detail: "Camión Rígido CRG-240 · Zona Franca La Candelaria", pending: true },
  { level: "green", title: "Autenticación biométrica exitosa", detail: "Utilitario UTL-045 · Parque Industrial Mamonal" },
];

type Ctx = {
  alerts: FleetAlert[]; logs: AccessLog[];
  simulateAlert: () => void; authorize: (id: string) => void;
  addContingency: (reason: string, code: string) => void;
};
const C = createContext<Ctx | null>(null);

export function MotrickProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [logs, setLogs] = useState(initialLogs);
  const [n, setN] = useState(0);
  const value: Ctx = {
    alerts, logs,
    simulateAlert: () => {
      const a = simulated[n % simulated.length]!;
      setN(n + 1);
      setAlerts((p) => [{ ...a, id: crypto.randomUUID(), time: now() }, ...p]);
    },
    authorize: (id) => {
      setAlerts((p) => p.map((a) => (a.id === id ? { ...a, pending: false, authorized: true } : a)));
      setLogs((p) => [{ vehicle: "Remoto", config: "Excepción", driver: "Jefe de Flota", time: now(), method: "Contingencia", status: "Desbloqueado" }, ...p]);
    },
    addContingency: (reason, code) => {
      setAlerts((p) => [{ id: crypto.randomUUID(), level: "yellow", title: `Contingencia: ${reason}`, detail: `Tractocamión UTB-890 · Carlos Mendoza · Código ${code}`, time: now(), pending: true }, ...p]);
      setLogs((p) => [{ vehicle: "UTB-890", config: "Tractocamión", driver: "Carlos Mendoza", time: now(), method: "Contingencia", status: "Bloqueado" }, ...p]);
    },
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useMotrick = () => { const c = useContext(C); if (!c) throw new Error("no provider"); return c; };
