import { useState } from "react";
import { Plus, Calendar, Clock, Users, ChevronLeft, ChevronRight, Search, Star, Heart, Sparkles } from "lucide-react";
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#4A3B32] tracking-tight">Reservas</h1>
          <p className="text-[#8C7A6B] mt-1 text-sm">Gestión de reservas y lista de espera</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#E8E1D5] rounded-sm p-1 shadow-sm">
            <button className="p-2 text-[#8C7A6B] hover:text-[#4A3B32] transition-colors rounded-sm hover:bg-[#F0EBE1]">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-4 py-1 flex items-center gap-2 border-x border-[#E8E1D5]">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-semibold text-[#4A3B32] text-xs uppercase tracking-widest">
                Hoy, 24 Oct
              </span>
            </div>

            <button className="p-2 text-[#8C7A6B] hover:text-[#4A3B32] transition-colors rounded-sm hover:bg-[#F0EBE1]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button className="bg-[#4A3B32] hover:bg-[#322721] text-[#D4AF37] px-4 py-2.5 rounded-sm font-semibold tracking-widest uppercase text-xs transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Nueva reserva
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Lista de reservas */}
        <div className="lg:col-span-1 flex flex-col bg-white border border-[#E8E1D5] rounded-sm overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E8E1D5] bg-[#FCFBF8]">
            <div className="flex items-center bg-white border border-[#E8E1D5] rounded-sm px-3 py-2 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37] transition-all">
              <Search className="w-4 h-4 text-[#8C7A6B]" />
              <input
                type="text"
                placeholder="Buscar nombre, teléfono..."
                className="bg-transparent border-none outline-none ml-2 w-full text-sm text-[#4A3B32] placeholder:text-[#C4BCB3]"
              />
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
              {["Todas", "Llegados", "Confirmadas", "Lista de espera"].map((t, i) => (
                <button
                  key={t}
                  className={`px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors ${
                    i === 0
                      ? "bg-[#4A3B32] text-[#D4AF37]"
                      : "bg-white border border-[#E8E1D5] text-[#8C7A6B] hover:text-[#4A3B32] hover:border-[#C4BCB3]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-3 bg-[#FCFBF8]">
            {mockReservations.map((res, i) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white hover:bg-[#FDFCFB] border border-[#E8E1D5] hover:border-[#D4AF37] shadow-sm rounded-sm p-4 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif font-medium text-[#4A3B32] group-hover:text-[#D4AF37] transition-colors">
                    {res.name}
                  </h3>

                  <div
                    className={`text-[10px] px-2 py-0.5 rounded-sm border font-semibold uppercase tracking-widest ${
                      res.status === "arrived"
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : res.status === "confirmed"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-[#F0EBE1] text-[#8C7A6B] border-[#C4BCB3]"
                    }`}
                  >
                    {res.status}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-[#8C7A6B] mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {res.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {res.pax} personas
                  </div>
                  <div className="text-[#4A3B32]">Mesa {res.table}</div>
                </div>

                {res.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {res.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-[#D4AF37]/10 text-[#C5A028] border border-[#D4AF37]/30 rounded-sm flex items-center gap-1 font-semibold"
                      >
                        {tag.includes("VIP") ? <Star className="w-3 h-3" /> : null}
                        {tag.includes("Alergia") ? <Heart className="w-3 h-3" /> : null}
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="lg:col-span-2 bg-white border border-[#E8E1D5] rounded-sm p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-[#FCFBF8] border border-[#E8E1D5] rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <h2 className="text-2xl font-serif text-[#4A3B32] mb-2">
            Selecciona una reserva
          </h2>

          <p className="text-[#8C7A6B] max-w-sm text-sm">
            Elige una reserva para ver detalles, asignar mesas o modificar información.
          </p>

          <div className="mt-8 pt-8 border-t border-[#E8E1D5] w-full max-w-md text-left">
            <h3 className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Sugerencias IA
            </h3>

            <div className="bg-[#FCFBF8] border border-[#E8E1D5] rounded-sm p-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]"></div>

              <p className="text-sm text-[#4A3B32]">
                Tienes una mesa sin asignar para 6 personas a las 20:00.{" "}
                <span className="font-semibold">Mesa 8</span> es ideal.
              </p>

              <button className="mt-3 text-xs uppercase tracking-widest text-[#D4AF37] hover:text-[#C5A028] font-semibold transition-colors">
                Asignar mesa 8
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}