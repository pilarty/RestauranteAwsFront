import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { ArrowLeft, Users, Sparkles, Loader2 } from "lucide-react";
import { base_url } from "../../api";

type Recomendaciones = {
  mozos_recomendados?: { id_mozo: number; propina_rate_esperado: number; rank: number }[];
  recomendaciones_por_comensal?: {
    id_persona_en_mesa: number;
    entrada?: { id_plato: number; score: number; rank: number }[];
    principal?: { id_plato: number; score: number; rank: number }[];
    postre?: { id_plato: number; score: number; rank: number }[];
    bebida?: { id_plato: number; score: number; rank: number }[];
  }[];
};

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reserva = location.state?.reserva;

  const [recomendaciones, setRecomendaciones] = useState<Recomendaciones | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${base_url}/v1/mesas/${id}/pedidos`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          // Verificar que el objeto tenga al menos alguna propiedad con datos
          if (data && (
            (data.mozos_recomendados && data.mozos_recomendados.length > 0) ||
            (data.recomendaciones_por_comensal && data.recomendaciones_por_comensal.length > 0)
          )) {
            setRecomendaciones(data);
          } else {
            // Respuesta vacía o sin datos útiles
            setRecomendaciones(null);
          }
        } else if (res.status === 404) {
          // No hay recomendaciones para esta mesa (normal)
          setRecomendaciones(null);
        } else {
          // Error del servidor
          const errorText = await res.text();
          setError(`Error ${res.status}: ${errorText || res.statusText}`);
        }
      } catch (err) {
        console.error("Error al obtener recomendaciones:", err);
        // Error de red (CORS, conexión, etc.)
        if (err instanceof TypeError) {
          setError("Error de conexión: verifica que el backend esté disponible");
        } else {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
        setRecomendaciones(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecomendaciones();
  }, [id]);

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
        <div className="max-w-7xl mx-auto space-y-6">

          {loading && (
            <div className="bg-white border border-[#E8E1D5] p-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-[#D4AF37] animate-spin" />
              <p className="text-sm text-[#8C7A6B]">Cargando información...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 p-12 text-center rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-lg font-serif text-red-900 mb-2">
                Error de conexión
              </h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-semibold rounded"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && !recomendaciones && (
            <div className="bg-white border border-[#E8E1D5] p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-[#D4AF37] opacity-30" />
              <h3 className="text-lg font-serif text-[#4A3B32] mb-2">
                No hay clientes en esta mesa
              </h3>
              <p className="text-sm text-[#8C7A6B]">
                La información y recomendaciones aparecerán cuando lleguen los comensales
              </p>
            </div>
          )}

          {!loading && !error && recomendaciones && (
            <>
              {/* Mozos */}
              {recomendaciones.mozos_recomendados && recomendaciones.mozos_recomendados.length > 0 && (
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
              )}

              {/* Platos por comensal */}
              {recomendaciones.recomendaciones_por_comensal && recomendaciones.recomendaciones_por_comensal.length > 0 && 
                recomendaciones.recomendaciones_por_comensal.map(c => (
                <section key={c.id_persona_en_mesa} className="bg-white border border-[#E8E1D5] p-6">
                  <h2 className="font-serif text-[#4A3B32] mb-4">Comensal {c.id_persona_en_mesa}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {(["entrada", "principal", "postre", "bebida"] as const).map(curso => (
                      <div key={curso}>
                        <h3 className="text-xs uppercase text-[#8C7A6B] font-semibold mb-2 tracking-widest">{curso}</h3>
                        {c[curso] && Array.isArray(c[curso]) && c[curso].length > 0 ? (
                          c[curso].slice(0, 1).map(p => (
                            <div key={p.id_plato} className="text-sm border border-[#E8E1D5] p-2 rounded-sm">
                              <span className="text-[#4A3B32]">Plato #{p.id_plato}</span>
                              <span className="text-xs text-[#8C7A6B] ml-2">{(p.score * 100).toFixed(0)}%</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm border border-[#E8E1D5] p-2 rounded-sm text-[#8C7A6B] text-center">
                            Sin recomendación
                          </div>
                        )}
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
  );
}