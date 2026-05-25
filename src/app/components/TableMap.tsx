import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Users, Clock, CreditCard } from "lucide-react";

type EstadoMesa =
  | "disponible"
  | "ocupada"
  | "reservada"
  | "esperando_pedido"
  | "comiendo"
  | "esperando_cuenta";

interface Mesa {
  id: string;
  numero: string;
  capacidad: number;
  estado: EstadoMesa;
  forma: "rect" | "circle";
  x: number;
  y: number;
  w: number;
  h: number;
  tiempoSentado?: string;
  personas?: number;
}

const mesasMock: Mesa[] = [
  { id: "1", numero: "1", capacidad: 2, estado: "disponible", forma: "circle", x: 1, y: 1, w: 2, h: 2 },
  { id: "2", numero: "2", capacidad: 4, estado: "ocupada", forma: "rect", x: 4, y: 1, w: 3, h: 2, tiempoSentado: "45m", personas: 3 },
  { id: "3", numero: "3", capacidad: 4, estado: "comiendo", forma: "rect", x: 8, y: 1, w: 3, h: 2, tiempoSentado: "1h 15m", personas: 4 },
  { id: "4", numero: "4", capacidad: 6, estado: "esperando_cuenta", forma: "rect", x: 1, y: 4, w: 4, h: 2, tiempoSentado: "1h 45m", personas: 6 },
  { id: "5", numero: "5", capacidad: 2, estado: "esperando_pedido", forma: "circle", x: 6, y: 4, w: 2, h: 2, tiempoSentado: "5m", personas: 2 },
  { id: "6", numero: "6", capacidad: 2, estado: "reservada", forma: "circle", x: 9, y: 4, w: 2, h: 2 },
  { id: "7", numero: "7", capacidad: 8, estado: "disponible", forma: "rect", x: 1, y: 7, w: 5, h: 3 },
  { id: "8", numero: "8", capacidad: 4, estado: "comiendo", forma: "rect", x: 7, y: 7, w: 4, h: 3, tiempoSentado: "30m", personas: 4 },
];

const configEstado: Record<
  EstadoMesa,
  { color: string; etiqueta: string; anillo: string }
> = {
  disponible: {
    color: "bg-white text-[#8C7A6B] border-[#E8E1D5]",
    etiqueta: "Disponible",
    anillo: "ring-[#D4AF37]/50",
  },
  ocupada: {
    color: "bg-[#F0EBE1] text-[#4A3B32] border-[#C4BCB3]",
    etiqueta: "Ocupada",
    anillo: "ring-[#4A3B32]/30",
  },
  reservada: {
    color: "bg-[#D4AF37]/10 text-[#C5A028] border-[#D4AF37]/30",
    etiqueta: "Reservada",
    anillo: "ring-[#D4AF37]/50",
  },
  esperando_pedido: {
    color: "bg-orange-50 text-orange-600 border-orange-200",
    etiqueta: "Esperando pedido",
    anillo: "ring-orange-500/50",
  },
  comiendo: {
    color: "bg-teal-50 text-teal-700 border-teal-200",
    etiqueta: "Comiendo",
    anillo: "ring-teal-500/50",
  },
  esperando_cuenta: {
    color: "bg-[#4A3B32] text-white border-[#322721]",
    etiqueta: "Esperando cuenta",
    anillo: "ring-[#4A3B32]/50",
  },
};

export function TableMap() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#4A3B32]">
            Mapa del salón
          </h1>
          <p className="text-[#8C7A6B] mt-1 text-sm">
            Estado en tiempo real de las mesas
          </p>
        </div>
      </div>

      {/* leyenda */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {Object.entries(configEstado).map(([estado, config]) => (
          <div
            key={estado}
            className="flex items-center gap-2 bg-white px-3 py-1.5 border border-[#E8E1D5]"
          >
            <div
              className={`w-3 h-3 rounded-full ${config.color.split(" ")[0]} border`}
            />
            <span className="text-xs uppercase font-semibold">
              {config.etiqueta}
            </span>
            <span className="text-xs text-[#8C7A6B]">
              ({mesasMock.filter((m) => m.estado === estado).length})
            </span>
          </div>
        ))}
      </div>

      {/* mapa */}
      <div className="flex-1 bg-white border border-[#E8E1D5] p-8 overflow-auto">
        <div
          className="relative w-full min-w-[800px] h-[600px]"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "repeat(10, 1fr)",
            gap: "1rem",
          }}
        >
          {mesasMock.map((mesa) => {
            const isCircle = mesa.forma === "circle";
            const config = configEstado[mesa.estado];

            return (
              <motion.button
                key={mesa.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/table/${mesa.id}`)}
                className={`flex flex-col items-center justify-center border ${config.color} hover:ring-2 ${config.anillo}`}
                style={{
                  gridColumn: `${mesa.x} / span ${mesa.w}`,
                  gridRow: `${mesa.y} / span ${mesa.h}`,
                  borderRadius: isCircle ? "50%" : "8px",
                }}
              >
                <span className="text-2xl font-serif">{mesa.numero}</span>

                {mesa.estado !== "disponible" &&
                  mesa.estado !== "reservada" && (
                    <div className="absolute -bottom-3 bg-white border px-3 py-1 flex items-center gap-2 text-xs">
                      <Users className="w-3 h-3" />
                      {mesa.personas}/{mesa.capacidad}
                      <Clock className="w-3 h-3 ml-2" />
                      {mesa.tiempoSentado}
                    </div>
                  )}

                {mesa.estado === "reservada" && (
                  <div className="absolute -bottom-3 bg-[#D4AF37] text-white px-3 py-1 text-xs">
                    19:30 - Reserva
                  </div>
                )}

                {mesa.estado === "esperando_cuenta" && (
                  <div className="absolute top-2 right-2">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}