import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Users } from "lucide-react";
import { base_url } from "../../api";

type EstadoMesa = "disponible" | "ocupada";

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

interface MesaAPI {
  // IDs comunes
  id?: string | number;
  id_mesa?: string | number;   // ← tu API usa este
  _id?: string | number;
  table_id?: string | number;
  mesa_id?: string | number;

  // Número de mesa
  numero?: string | number;
  numero_mesa?: string | number;
  table_number?: string | number;
  name?: string | number;

  // Capacidad
  capacidad?: number;
  max_personas?: number;
  capacity?: number;
  seats?: number;

  // Estado
  estado?: string;
  status?: string;
  ocupada?: boolean;

  // Forma
  forma?: "rect" | "circle";
  shape?: string;

  // Posición (solo se usan si los cuatro vienen juntos del API)
  x?: number;
  y?: number;
  w?: number;
  h?: number;

  // Personas actuales
  personas?: number;
  personas_actuales?: number;
  current_persons?: number;
}

const posicionesFallback = [
  { forma: "circle" as const, x: 1, y: 2, w: 2, h: 2 },
  { forma: "rect" as const, x: 4, y: 2, w: 3, h: 2 },
  { forma: "rect" as const, x: 8, y: 2, w: 3, h: 2 },
  { forma: "rect" as const, x: 1, y: 5, w: 4, h: 2 },
  { forma: "circle" as const, x: 6, y: 5, w: 2, h: 2 },
  { forma: "circle" as const, x: 9, y: 5, w: 2, h: 2 },
  { forma: "rect" as const, x: 1, y: 8, w: 5, h: 3 },
  { forma: "rect" as const, x: 7, y: 8, w: 4, h: 3 },
];

function mapearEstado(mesa: MesaAPI): EstadoMesa {
  const raw = (mesa.estado ?? mesa.status ?? "").toString().toLowerCase();
  if (
    raw === "ocupada" ||
    raw === "ocupado" ||
    raw === "occupied" ||
    raw === "busy" ||
    mesa.ocupada === true
  ) {
    return "ocupada";
  }
  // "libre", "disponible", "free", "available", etc. → disponible
  return "disponible";
}

function resolverID(mesa: MesaAPI): string {
  const raw = mesa.id_mesa ?? mesa.id ?? mesa._id ?? mesa.table_id ?? mesa.mesa_id;
  if (raw == null) {
    console.warn("Mesa sin id reconocible:", mesa);
  }
  return String(raw ?? "");
}

function resolverNumero(mesa: MesaAPI, p0?: number): string {
  // Tu API no tiene campo "numero": el número visible ES el id_mesa
  const raw = mesa.numero ?? mesa.numero_mesa ?? mesa.table_number ?? mesa.id_mesa ?? mesa.id;
  if (raw == null || String(raw) === "undefined" || String(raw) === "null") {
    return "?";
  }
  return String(raw);
}

function resolverCapacidad(mesa: MesaAPI): number {
  return mesa.capacidad ?? mesa.max_personas ?? mesa.capacity ?? mesa.seats ?? 4;
}

function normalizarMesa(mesa: MesaAPI, index: number): Mesa {
  const pos = posicionesFallback[index] ?? posicionesFallback[0];

  // Solo usar posición del API si los CUATRO campos están presentes,
  // para no mezclar datos con significado distinto (ej: w en cm vs columnas de grid)
  const tienePos =
    mesa.x != null && mesa.y != null && mesa.w != null && mesa.h != null;

  const forma: "rect" | "circle" =
    mesa.forma ?? (mesa.shape === "circle" ? "circle" : pos.forma);

  return {
    id: resolverID(mesa),
    numero: resolverNumero(mesa, index + 1),
    capacidad: resolverCapacidad(mesa),
    estado: mapearEstado(mesa),
    forma,
    x: tienePos ? mesa.x! : pos.x,
    y: tienePos ? mesa.y! : pos.y,
    w: tienePos ? mesa.w! : pos.w,
    h: tienePos ? mesa.h! : pos.h,
    personas: mesa.personas ?? mesa.personas_actuales ?? mesa.current_persons,
  };
}

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
};

export function TableMap() {
  const navigate = useNavigate();

  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${base_url}/v1/mesas`);

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const rawText = await res.text();

        let data: MesaAPI[];
        try {
          data = JSON.parse(rawText);
        } catch {
          throw new Error(
            "El backend no devolvió JSON válido. Respuesta: " +
              rawText.slice(0, 120)
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "Respuesta inesperada del servidor (se esperaba un array de mesas)."
          );
        }

        // Ordenar por ID numérico para que el índice → posición sea siempre consistente
        const ordenadas = [...data].sort((a, b) => {
          const idA = Number(a.id ?? a._id ?? a.table_id ?? a.mesa_id ?? 0);
          const idB = Number(b.id ?? b._id ?? b.table_id ?? b.mesa_id ?? 0);
          return idA - idB;
        });

        setMesas(ordenadas.map(normalizarMesa));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar mesas");
      } finally {
        setLoading(false);
      }
    };

    fetchMesas();
  }, []);

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
      {!loading && !error && (
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
                ({mesas.filter((m) => m.estado === estado).length})
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center text-[#8C7A6B] text-sm">
          Cargando mesas...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-4 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Mapa */}
      {!loading && !error && (
        <div className="flex-1 bg-[#F9F8F6] border border-[#E8E1D5] p-16 overflow-auto relative rounded-xl shadow-inner max-w-[1200px]">

          {/* Entrada */}
          <div
            className="absolute left-0 top-1/2 bg-white border-y border-r border-[#E8E1D5] text-xs tracking-[0.3em] text-[#6B5A4E] font-bold px-8 py-8 uppercase rounded-r-lg"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            ENTRADA
          </div>

          {/* Grid */}
          <div
            className="relative w-full min-w-[800px] h-[650px] pl-48"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gridTemplateRows: "repeat(12, 1fr)",
              gap: "1.2rem",
            }}
          >
            {mesas.map((mesa) => {
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
      )}
    </div>
  );
}