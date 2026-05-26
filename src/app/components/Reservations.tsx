import { useState } from "react";
import { Clock, Users, Search, Star, Heart } from "lucide-react";
import { motion } from "motion/react";

const reservasIniciales = [
  { id: 1, nombre: "Eleanor Shellstrop", hora: "18:30", personas: 2, mesa: "4", estado: "confirmada", tags: ["Aniversario", "VIP"] },
  { id: 2, nombre: "Chidi Anagonye", hora: "19:00", personas: 4, mesa: "12", estado: "en_mesa", tags: ["Alergia: Frutos secos"] },
  { id: 3, nombre: "Tahani Al-Jamil", hora: "20:00", personas: 6, mesa: "8", estado: "pendiente", tags: ["VIP", "Cumpleaños"] },
  { id: 4, nombre: "Jason Mendoza", hora: "20:30", personas: 2, mesa: "TBD", estado: "lista_espera", tags: [] },
];

type Filtro = "todos" | "pendientes" | "en_mesa";

export function Reservations() {
  const [reservas, setReservas] = useState(reservasIniciales);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const marcarLlegada = (id: number) => {
    setReservas(prev =>
      prev.map(r =>
        r.id === id ? { ...r, estado: "en_mesa" } : r
      )
    );
  };

  const reservasFiltradas = reservas.filter(r => {
    if (filtro === "todos") return true;
    if (filtro === "pendientes") return r.estado === "pendiente";
    if (filtro === "en_mesa") return r.estado === "en_mesa";
    return true;
  });

  const etiquetaEstado = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "Confirmada";
      case "pendiente":
        return "Pendiente";
      case "en_mesa":
        return "En la mesa";
      case "lista_espera":
        return "Lista de espera";
      default:
        return estado;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#4A3B32] tracking-tight">
            Reservas
          </h1>
          <p className="text-[#8C7A6B] mt-1 text-sm">
            Gestión de reservas y lista de espera
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-[#E8E1D5] rounded-sm overflow-hidden shadow-sm flex flex-col">

        {/* Buscador */}
        <div className="p-4 border-b border-[#E8E1D5] bg-[#FCFBF8]">
          <div className="flex items-center bg-white border border-[#E8E1D5] rounded-sm px-3 py-2">
            <Search className="w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Buscar nombre..."
              className="bg-transparent border-none outline-none ml-2 w-full text-sm text-[#4A3B32]"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {[
              { id: "todos", label: "Todos" },
              { id: "pendientes", label: "Pendientes" },
              { id: "en_mesa", label: "En la mesa" },
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

        {/* Lista */}
        <div className="flex-1 overflow-auto p-3 space-y-3 bg-[#FCFBF8]">
          {reservasFiltradas.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-[#E8E1D5] rounded-sm p-4 hover:border-[#D4AF37] transition-all"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-serif text-[#4A3B32]">{res.nombre}</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 border rounded-sm">
                  {etiquetaEstado(res.estado)}
                </span>
              </div>

              <div className="flex gap-4 text-xs text-[#8C7A6B] mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {res.hora}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {res.personas} personas
                </div>
                <div>Mesa {res.mesa}</div>
              </div>

              {res.estado !== "en_mesa" && (
                <button
                  onClick={() => marcarLlegada(res.id)}
                  className="text-xs px-3 py-1 border border-[#4A3B32] text-[#4A3B32] hover:bg-[#4A3B32] hover:text-[#D4AF37] transition-colors rounded-sm"
                >
                  Marcar llegada
                </button>
              )}

              {res.tags.length > 0 && (
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {res.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm"
                    >
                      {tag.includes("VIP") && <Star className="w-3 h-3 inline" />}
                      {tag.includes("Alergia") && <Heart className="w-3 h-3 inline" />}
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}