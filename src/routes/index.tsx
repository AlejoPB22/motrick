import { createFileRoute } from "@tanstack/react-router";
import { MotrickDemo } from "@/components/motrick/MotrickDemo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Motrick · Autenticación vehicular previa al arranque" },
      { name: "description", content: "Prototipo Motrick: panel de alertas y telemetría para flotas y app de autenticación del conductor en Cartagena." },
      { property: "og:title", content: "Motrick · Autenticación vehicular previa al arranque" },
      { property: "og:description", content: "Panel de flota y app del conductor para bloquear arranques no autorizados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MotrickDemo,
});
