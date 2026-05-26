import { useState } from "react";
import { Plus, Calendar, Clock, Users, ChevronLeft, ChevronRight, Search, Star, Heart } from "lucide-react";
import { motion } from "motion/react";

const mockReservations = [
  { id: 1, name: "Eleanor Shellstrop", time: "18:30", pax: 2, table: "4", status: "confirmed", tags: ["Aniversario", "VIP"] },
  { id: 2, name: "Chidi Anagonye", time: "19:00", pax: 4, table: "12", status: "arrived", tags: ["Alergia: Frutos secos"] },
  { id: 3, name: "Tahani Al-Jamil", time: "20:00", pax: 6, table: "8", status: "pending", tags: ["VIP", "Cumpleaños"] },
  { id: 4, name: "Jason Mendoza", time: "20:30", pax: 2, table: "TBD", status: "waitlist", tags: [] },
];

export function Reservations() {
  const [date] = useState(new Date());

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

        <button className="bg-[#4A3B32] hover:bg-[#322721] text-[#D4AF37] px-4 py-2.5 rounded-sm font-semibold tracking-widest uppercase text-xs transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Nueva reserva
        </button>
      </div>

      {/* Lista de reservas full width */}
      <div className="flex-1 bg-white border border-[#E8E1D5] rounded-sm overflow-hidden shadow-sm flex flex-col">
        
        {/* Search + filtros */}
        <div className="p-4 border-b border-[#E8E1D5] bg-[#FCFBF8]">
          <div className="flex items-center bg-white border border-[#E8E1D5] rounded-sm px-3 py-2">
            <Search className="w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Buscar nombre, teléfono..."
              className="bg-transparent border-none outline-none ml-2 w-full text-sm text-[#4A3B32]"
            />
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {["Todas", "Llegados", "Confirmadas", "Lista de espera"].map((t, i) => (
              <button
                key={t}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold uppercase whitespace-nowrap ${
                  i === 0
                    ? "bg-[#4A3B32] text-[#D4AF37]"
                    : "bg-white border border-[#E8E1D5] text-[#8C7A6B]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Reservas */}
        <div className="flex-1 overflow-auto p-3 space-y-3 bg-[#FCFBF8]">
          {mockReservations.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-[#E8E1D5] rounded-sm p-4 hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-serif text-[#4A3B32]">{res.name}</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 border rounded-sm">
                  {res.status}
                </span>
              </div>

              <div className="flex gap-4 text-xs text-[#8C7A6B]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {res.time}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {res.pax} personas
                </div>
                <div>Mesa {res.table}</div>
              </div>

              {res.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
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