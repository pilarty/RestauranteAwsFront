import { useState, useEffect } from "react";
import { Clock, Users, Search } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { base_url } from "../../api";

type Reserva = {
  id_reserva: string;
  nombre_cliente: string;
  fecha_hora: string;
  cantidad_personas: number;
  id_mesa: number;
  estado: string;
  motivo_visita: string | null;
  notas: string | null;
  email: string | null;
  telefono: string | null;
  id_cliente: number | null;
};

type Filtro = "todos" | "confirmada" | "completada";

export function Reservations() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${base_url}/v1/reservas`)
      .then(res => res.json())
      .then(data => setReservas(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const marcarLlegada = async (reserva: Reserva) => {
    try {
      // 1. Obtener mesas disponibles
      const mesasRes = await fetch(`${base_url}/v1/mesas`);
      if (!mesasRes.ok) throw new Error(`Error al obtener mesas: ${mesasRes.status}`);
      const mesas = await mesasRes.json();

      // 2. Usar la mesa ya asignada a la reserva, o buscar una libre si no tiene
      let mesaTarget = mesas.find((m: any) => m.id_mesa === reserva.id_mesa);

      if (!mesaTarget || mesaTarget.estado !== "libre") {
        // Fallback: buscar cualquier mesa libre con capacidad suficiente
        mesaTarget = mesas.find(
          (m: any) => m.estado === "libre" && m.capacidad >= reserva.cantidad_personas
        );
      }

      if (!mesaTarget) {
        alert("No hay mesas disponibles para sentar a este cliente.");
        return;
      }

      // 3. Marcar mesa como ocupada
      const patchMesaRes = await fetch(`${base_url}/v1/mesas/${mesaTarget.id_mesa}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "ocupada" }),
      });
      if (!patchMesaRes.ok) throw new Error(`Error al actualizar mesa: ${patchMesaRes.status}`);

      // 4. Actualizar reserva a completada
      const patchReservaRes = await fetch(`${base_url}/v1/reservas/${reserva.id_reserva}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "completada" }),
      });
      if (!patchReservaRes.ok) throw new Error(`Error al actualizar reserva: ${patchReservaRes.status}`);

      // 5. Actualizar estado local
      setReservas(prev =>
        prev.map(r =>
          r.id_reserva === reserva.id_reserva ? { ...r, estado: "completada" } : r
        )
      );

      // 6. Navegar a la mesa
      navigate("/");

    } catch (err) {
      console.error("Error en marcarLlegada:", err);
      alert(`Ocurrió un error al marcar la llegada: ${err instanceof Error ? err.message : "Error desconocido"}`);
    }
  };

  const reservasFiltradas = reservas
    .filter(r => filtro === "todos" || r.estado === filtro)
    .filter(r => r.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase()));

  const etiquetaEstado = (estado: string) => {
    switch (estado) {
      case "confirmada": return "Confirmada";
      case "cancelada": return "Cancelada";
      case "completada": return "En la mesa";
      default: return estado;
    }
  };

  const hora = (fecha_hora: string) =>
    new Date(fecha_hora).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#4A3B32] tracking-tight">Reservas</h1>
          <p className="text-[#8C7A6B] mt-1 text-sm">Gestión de reservas y lista de espera</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-[#E8E1D5] rounded-sm overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-[#E8E1D5] bg-[#FCFBF8]">
          <div className="flex items-center bg-white border border-[#E8E1D5] rounded-sm px-3 py-2">
            <Search className="w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Buscar nombre..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 w-full text-sm text-[#4A3B32]"
            />
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {[
              { id: "todos", label: "Todos" },
              { id: "confirmada", label: "Confirmadas" },
              { id: "completada", label: "En la mesa" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id as Filtro)}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold uppercase whitespace-nowrap ${
                  filtro === f.id
                    ? "bg-[#4A3B32] text-[#D4AF37]"
                    : "bg-white border border-[#E8E1D5] text-[#8C7A6B]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3 space-y-3 bg-[#FCFBF8]">
          {loading && (
            <p className="text-center text-sm text-[#8C7A6B] py-8">Cargando reservas...</p>
          )}

          {!loading && reservasFiltradas.length === 0 && (
            <p className="text-center text-sm text-[#8C7A6B] py-8">No hay reservas.</p>
          )}

          {reservasFiltradas.map((res, i) => (
            <motion.div
              key={res.id_reserva}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-[#E8E1D5] rounded-sm p-4 hover:border-[#D4AF37] transition-all"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-serif text-[#4A3B32]">{res.nombre_cliente}</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 border rounded-sm">
                  {etiquetaEstado(res.estado)}
                </span>
              </div>

              <div className="flex gap-4 text-xs text-[#8C7A6B] mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {hora(res.fecha_hora)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {res.cantidad_personas} personas
                </div>
                <div>Mesa {res.id_mesa}</div>
              </div>

              {res.motivo_visita && (
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  <span className="text-[9px] uppercase px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm">
                    {res.motivo_visita}
                  </span>
                </div>
              )}

              {res.estado === "confirmada" && (
                <button
                  onClick={() => marcarLlegada(res)}
                  className="text-xs px-3 py-1 border border-[#4A3B32] text-[#4A3B32] hover:bg-[#4A3B32] hover:text-[#D4AF37] transition-colors rounded-sm"
                >
                  Marcar llegada
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}