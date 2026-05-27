import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { ArrowLeft, Users, Edit3, Sparkles, Loader2 } from "lucide-react";
import { base_url } from "../../api";

const CHIP_CATEGORIES = {
  edades: ["20s", "30s", "40s", "50s", "Mixto"],
  ocasion: ["Cumpleaños", "Aniversario", "Cita", "Reunión", "Ninguna"],
};

type Recomendaciones = {
  mozos_recomendados: { id_mozo: number; propina_rate_esperado: number; rank: number }[];
  recomendaciones_por_comensal: {
    id_persona_en_mesa: number;
    entrada: { id_plato: number; score: number; rank: number }[];
    principal: { id_plato: number; score: number; rank: number }[];
    postre: { id_plato: number; score: number; rank: number }[];
    bebida: { id_plato: number; score: number; rank: number }[];
  }[];
};

const franjaHoraria = () => {
  const h = new Date().getHours();
  if (h < 15) return "mediodia";
  if (h < 19) return "tarde";
  return "noche";
};

const diaSemana = () => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
};

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reserva = location.state?.reserva;

  const [chips, setChips] = useState<Record<string, string>>({
    edades: "",
    ocasion: reserva?.motivo_visita ?? "",
  });

  useEffect(() => {
    if (!reserva?.notas) return;
    try {
      const notasQR = JSON.parse(reserva.notas);
      setChips(prev => ({
        ...prev,
        edades: notasQR.edades ?? prev.edades,
        ocasion: notasQR.ocasion ?? prev.ocasion,
      }));
    } catch {}
  }, [reserva]);

  const [recomendaciones, setRecomendaciones] = useState<Recomendaciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleChip = (category: string, value: string) => {
    setChips(prev => ({
      ...prev,
      [category]: prev[category] === value ? "" : value,
    }));
  };

  const handleGenerarRecomendaciones = async () => {
    setLoading(true);
    setError(null);

    const cantPersonas = reserva?.cantidad_personas ?? 1;

    const comensales = Array.from({ length: cantPersonas }, (_, i) => ({
      id_persona_en_mesa: i + 1,
      id_cliente: i === 0 ? (reserva?.id_cliente ?? null) : null,
      franja_etaria_persona: chips.edades || "adulto",
      cant_acompanantes: cantPersonas - 1,
      motivo_visita: chips.ocasion || reserva?.motivo_visita || "casual",
      restriccion_alimentaria: "ninguna",
      orden_de_pedido: i + 1,
    }));

    const payload = {
      comensales,
      dia_semana: diaSemana(),
      franja_horaria: franjaHoraria(),
    };

    try {
      const res = await fetch(`${base_url}/v1/mesas/${id}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al generar recomendaciones");

      const data = await res.json();
      setRecomendaciones(data);
    } catch (err) {
      setError("No se pudieron generar las recomendaciones.");
    } finally {
      setLoading(false);
    }
  };

  const notasQR = (() => {
    try { return JSON.parse(reserva?.notas); } catch { return null; }
  })();

  return (
    <div className="h-full flex flex-col -m-4 md:-m-6 lg:-m-10">
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-[#E8E1D5] bg-white flex justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-[#4A3B32]">Mesa {id}</h1>
            {reserva && (
              <p className="text-xs text-[#8C7A6B]">{reserva.nombre_cliente}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8C7A6B]">
          <Users className="w-4 h-4" />
          {reserva?.cantidad_personas ?? "?"} personas
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto grid xl:grid-cols-12 gap-8">

          {/* IZQUIERDA */}
          <div className="xl:col-span-5 space-y-6">
            <section className="bg-white border border-[#E8E1D5] p-6">
              <h2 className="flex items-center gap-2 mb-4 font-serif text-[#4A3B32]">
                <Edit3 className="w-5 h-5" />
                Observaciones del mozo
              </h2>

              {/* Datos precargados */}
              {reserva && (
                <div className="mb-5 p-3 bg-[#FCFBF8] border border-[#E8E1D5] rounded-sm text-xs text-[#8C7A6B] space-y-1">
                  <p>
                    <span className="font-semibold">Motivo:</span>{" "}
                    {reserva.motivo_visita ?? "No especificado"}
                  </p>
                  {notasQR ? (
                    <>
                      {notasQR.nombre && (
                        <p><span className="font-semibold">Nombre (QR):</span> {notasQR.nombre}</p>
                      )}
                      {notasQR.tipoGrupo && (
                        <p><span className="font-semibold">Tipo de grupo:</span> {notasQR.tipoGrupo}</p>
                      )}
                      {notasQR.estadoAnimo && (
                        <p><span className="font-semibold">Estado de ánimo:</span> {notasQR.estadoAnimo}</p>
                      )}
                    </>
                  ) : (
                    <p><span className="font-semibold">Notas:</span> {reserva.notas ?? "—"}</p>
                  )}
                </div>
              )}

              {Object.entries(CHIP_CATEGORIES).map(([key, options]) => (
                <div key={key} className="mb-5">
                  <h3 className="text-xs uppercase text-[#8C7A6B] mb-2 font-semibold tracking-widest">{key}</h3>
                  <div className="flex flex-wrap gap-2">
                    {options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleChip(key, opt)}
                        className={`px-3 py-1 text-xs border rounded-sm transition-all ${
                          chips[key] === opt
                            ? "bg-[#4A3B32] text-[#D4AF37] border-[#4A3B32]"
                            : "bg-white text-[#8C7A6B] border-[#E8E1D5] hover:border-[#D4AF37]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleGenerarRecomendaciones}
                disabled={loading}
                className="w-full mt-4 bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-60 text-white py-3 text-xs uppercase font-semibold flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "Generando..." : "Generar recomendaciones"}
              </button>

              {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
            </section>
          </div>

          {/* DERECHA */}
          <div className="xl:col-span-7 space-y-6">
            {!recomendaciones && !loading && (
              <div className="bg-white border border-[#E8E1D5] p-6 text-center text-sm text-[#8C7A6B]">
                Completá los datos y generá las recomendaciones de IA
              </div>
            )}

            {recomendaciones && (
              <>
                {/* Mozos */}
                <section className="bg-white border border-[#E8E1D5] p-6">
                  <h2 className="flex items-center gap-2 mb-4 font-serif text-[#4A3B32]">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    Mozo recomendado
                  </h2>
                  <div className="space-y-2">
                    {recomendaciones.mozos_recomendados.map(m => (
                      <div key={m.id_mozo} className="flex justify-between items-center text-sm border border-[#E8E1D5] p-3 rounded-sm">
                        <span className="text-[#4A3B32] font-medium">Mozo #{m.id_mozo}</span>
                        <span className="text-xs text-[#8C7A6B]">
                          Propina esperada: {(m.propina_rate_esperado * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Platos por comensal */}
                {recomendaciones.recomendaciones_por_comensal.map(c => (
                  <section key={c.id_persona_en_mesa} className="bg-white border border-[#E8E1D5] p-6">
                    <h2 className="font-serif text-[#4A3B32] mb-4">Comensal {c.id_persona_en_mesa}</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {(["entrada", "principal", "postre", "bebida"] as const).map(curso => (
                        <div key={curso}>
                          <h3 className="text-xs uppercase text-[#8C7A6B] font-semibold mb-2 tracking-widest">{curso}</h3>
                          {c[curso].slice(0, 1).map(p => (
                            <div key={p.id_plato} className="text-sm border border-[#E8E1D5] p-2 rounded-sm">
                              <span className="text-[#4A3B32]">Plato #{p.id_plato}</span>
                              <span className="text-xs text-[#8C7A6B] ml-2">{(p.score * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}