import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Users, Info } from "lucide-react";

type EstadoMesa = "disponible" | "reservada" | "ocupada";

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
  personas?: number;
}

const mesasMock: Mesa[] = [
  { id: "1", numero: "1", capacidad: 2, estado: "disponible", forma: "circle", x: 1, y: 2, w: 2, h: 2 },
  { id: "2", numero: "2", capacidad: 4, estado: "ocupada", forma: "rect", x: 4, y: 2, w: 3, h: 2, personas: 3 },
  { id: "3", numero: "3", capacidad: 6, estado: "ocupada", forma: "rect", x: 8, y: 2, w: 3, h: 2, personas: 4 },
  { id: "4", numero: "4", capacidad: 8, estado: "ocupada", forma: "rect", x: 1, y: 5, w: 4, h: 2, personas: 5 },
  { id: "5", numero: "5", capacidad: 4, estado: "ocupada", forma: "circle", x: 6, y: 5, w: 2, h: 2, personas: 2 },
  { id: "6", numero: "6", capacidad: 2, estado: "reservada", forma: "circle", x: 9, y: 5, w: 2, h: 2 },
  { id: "7", numero: "7", capacidad: 10, estado: "disponible", forma: "rect", x: 1, y: 8, w: 5, h: 3 },
  { id: "8", numero: "8", capacidad: 6, estado: "reservada", forma: "rect", x: 7, y: 8, w: 4, h: 3 },
];

const configEstado: Record<
  EstadoMesa,
  { colorMesa: string; colorSilla: string; anillo: string; etiqueta: string }
> = {
  disponible: {
    colorMesa: "bg-white text-[#4A3B32] border-[#E8E1D5]",
    colorSilla: "bg-[#E8E1D5] border-[#D4AF37]/20",
    anillo: "ring-gray-300",
    etiqueta: "Disponible",
  },
  ocupada: {
    colorMesa: "bg-[#F3B33E] text-[#1C1C1E] border-[#DDA02A]",
    colorSilla: "bg-[#DDA02A] border-[#C58D1B]",
    anillo: "ring-[#F3B33E]/50",
    etiqueta: "Ocupada",
  },
  reservada: {
    colorMesa: "bg-[#5C4033] text-white border-[#4A3329]",
    colorSilla: "bg-[#4A3329] border-[#3B2820]",
    anillo: "ring-[#5C4033]/50",
    etiqueta: "Reservada",
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
          <p className="text-[#8C7A6B] mt-1 text-1xl">
            Pasa el cursor sobre una mesa para ver los detalles
          </p>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {Object.entries(configEstado).map(([estado, config]) => (
          <div
            key={estado}
            className="flex items-center gap-2 bg-white px-3 py-1.5 border border-[#E8E1D5] rounded-md text-xs uppercase font-semibold shadow-sm"
          >
            <div
              className={`w-3 h-3 rounded-sm ${config.colorMesa.split(" ")[0]} border`}
            />
            <span className="text-[#4A3B32]">{config.etiqueta}</span>
            <span className="text-xs text-[#8C7A6B] normal-case font-normal">
              ({mesasMock.filter((m) => m.estado === estado).length})
            </span>
          </div>
        ))}
      </div>

      {/* Mapa */}
      <div className="flex-1 bg-[#F9F8F6] border border-[#E8E1D5] p-16 overflow-auto relative rounded-xl shadow-inner max-w-[1200px]">
        
        {/* Entrada más grande */}
        <div
          className="absolute left-0 top-1/2 bg-white border-y border-r border-[#E8E1D5] text-xs tracking-[0.3em] text-[#6B5A4E] font-bold px-8 py-8 uppercase rounded-r-lg"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
        >
          ENTRADA
        </div>

        {/* Mapa desplazado a la derecha */}
        <div
          className="relative w-full min-w-[800px] h-[650px] pl-48"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "repeat(12, 1fr)",
            gap: "1.2rem",
          }}
        >
          {mesasMock.map((mesa) => {
            const isCircle = mesa.forma === "circle";
            const config = configEstado[mesa.estado];
            const cantidadPersonas = mesa.personas || 0;

            const sillasArriba = Math.ceil(mesa.capacidad / 2);
            const sillasAbajo = Math.floor(mesa.capacidad / 2);

            return (
              <div
                key={mesa.id}
                className="relative flex items-center justify-center group"
                style={{
                  gridColumn: `${mesa.x} / span ${mesa.w}`,
                  gridRow: `${mesa.y} / span ${mesa.h}`,
                }}
              >
                {/* SILLAS */}
                {isCircle ? (
                  <>
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-0 pointer-events-none">
                      {Array.from({ length: sillasArriba }).map((_, i) => (
                        <span
                          key={`l-${i}`}
                          className={`w-4 h-6 rounded-l-md border border-r-0 shadow-sm ${config.colorSilla}`}
                        />
                      ))}
                    </div>

                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-0 pointer-events-none">
                      {Array.from({ length: sillasAbajo }).map((_, i) => (
                        <span
                          key={`r-${i}`}
                          className={`w-4 h-6 rounded-r-md border border-l-0 shadow-sm ${config.colorSilla}`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-4 z-0 pointer-events-none">
                      {Array.from({ length: sillasArriba }).map((_, i) => (
                        <span
                          key={`t-${i}`}
                          className={`w-7 h-4 rounded-t-md border border-b-0 shadow-sm ${config.colorSilla}`}
                        />
                      ))}
                    </div>

                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-0 pointer-events-none">
                      {Array.from({ length: sillasAbajo }).map((_, i) => (
                        <span
                          key={`b-${i}`}
                          className={`w-7 h-4 rounded-b-md border border-t-0 shadow-sm ${config.colorSilla}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* MESA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/table/${mesa.id}`)}
                  className={`w-full h-full flex items-center justify-center border shadow-md transition-all relative z-10 ${config.colorMesa} hover:ring-4 ${config.anillo}`}
                  style={{
                    borderRadius: isCircle ? "50%" : "6px",
                  }}
                >
                  <span className="text-xl font-serif font-bold tracking-wide">
                    M{mesa.numero}
                  </span>

                  {/* TOOLTIP */}
                  <div className="absolute bottom-full mb-5 hidden group-hover:flex flex-col items-center pointer-events-none z-50 filter drop-shadow-md">
                    <div className="bg-[#1C1C1E] text-white text-xs rounded-lg p-3 whitespace-nowrap flex flex-col gap-1 min-w-[120px] border border-[#2C2C2E]">
                      <div className="flex items-center justify-between border-b border-gray-700 pb-1 mb-1">
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                          Mesa M{mesa.numero}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Estado:</span>
                        <span className="text-gray-200 font-semibold">
                          {config.etiqueta}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Personas:</span>
                        <span className="flex items-center gap-1 text-gray-200">
                          <Users className="w-3 h-3" />
                          {mesa.estado === "ocupada"
                            ? `${cantidadPersonas}/${mesa.capacidad}`
                            : `0/${mesa.capacidad}`}
                        </span>
                      </div>
                    </div>

                    <div className="w-2 h-2 bg-[#1C1C1E] rotate-45 -mt-1 border-r border-b border-[#2C2C2E]" />
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}