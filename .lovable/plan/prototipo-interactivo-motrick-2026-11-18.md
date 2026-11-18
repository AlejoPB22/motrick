# Prototipo interactivo Motrick

Prototipo solo frontend (datos simulados y estado local, sin backend) en la página principal `/`.

## Barra Demo (fija arriba)
"Modo Demo Motrick:" con 3 botones: Automático (Responsive), Forzar Vista PC, Forzar Vista Móvil. En automático: escritorio (lg+) muestra el Panel Web; móvil muestra la App del Conductor.

## Vista 1 — Panel Web (Jefe de Flota), fondo claro
Menú lateral colapsable con 3 pestañas:
1. **Monitoreo y Alertas**
   - 4 KPIs: Vehículos Activos 18/20, Autenticaciones Hoy 42, Intentos Bloqueados 3, Excepciones por Contingencia 1.
   - Izquierda: alertas en tiempo real por color (rojo TRK-104 Mamonal, amarillo contingencia sin señal, verde relevos validados). Botón "Simular Nueva Alerta" (entra animada) y "Autorizar Excepción Remota" que cambia a "Autorizado".
   - Derecha: tabla de trazabilidad (Vehículo, Configuración, Conductor, Hora, Método, Estado del encendido).
   - Las solicitudes de contingencia generadas en la App aparecen aquí (estado compartido).
2. **Cotizador y Modalidades**
   - Tarjeta destacada "Suscripción Mensual con Hardware en Comodato" (preferida por el 50%) y "Compra Directa de Hardware + Licencia", con precios en COP de ejemplo que incluyen instalación y soporte explícitos.
   - Verificador de compatibilidad: Tractocamión / Camión Rígido / Utilitario → tiempo estimado de instalación y nota "sin afectar la garantía".
3. **Flota y Conductores** (el documento menciona 3 pestañas pero describe 2; propongo esta): listado de vehículos con conductor asignado, estado del dispositivo y última validación.

## Vista 2 — App del Conductor, modo oscuro dentro de un marco de teléfono (en PC)
- Cabecera: logo, conectividad alternable (Conectado - Red Portuaria / Modo Offline) y vehículo "Tractocamión Placa UTB-890".
- Candado rojo grande "ENCENDIDO BLOQUEADO".
- Botón "Iniciar Validación de Conductor" → pulso 2 s "Verificando identidad y turno asignado..." → estado verde, "Carlos Mendoza - ID Verificado", cuenta regresiva 02:00. Botón "Reiniciar Simulación".
- Botón "Solicitar arranque por contingencia" → modal con motivo (Falla de lector, Zona sin cobertura, Relevo de emergencia) → código temporal trazable y aviso de registro en el panel.

## Detalles técnicos
- Colores slate-900 / blue-600 / slate-50 como tokens semánticos en styles.css; iconos lucide-react; componentes shadcn existentes (sidebar, card, table, dialog, badge).
- Estado compartido con un contexto React; componentes en `src/components/motrick/`.
- Título y metadatos de la página actualizados a Motrick.
