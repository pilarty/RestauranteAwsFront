import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { ArrowLeft, Users, Sparkles, Loader2 } from "lucide-react";
import { base_url } from "../../api";

type Comensal = {
  id_persona_en_mesa: number;
  id_cliente: number;
  franja_etaria_persona: string;
  cant_acompanantes: number;
  motivo_visita: string;
  restriccion_alimentaria: string;
  orden_de_pedido: number;
  es_repetidor: boolean;
  visitas_previas: number;
  ticket_promedio_historico: number | null;
};

type Plato = {
  id_plato: number;
  nombre_plato: string;
  descripcion: string | null;
  precio: number;
  score: number;
  rank: number;
};

type Mozo = {
  id_mozo: number;
  nombre_mozo: string;
  propina_rate_esperado: number;
  rank: number;
};

type RecomendacionesPorComensal = {
  id_persona_en_mesa: number;
  entrada?: Plato[];
  principal?: Plato[];
  postre?: Plato[];
  bebida?: Plato[];
};

type Recomendaciones = {
  id_pedido: string;
  id_mesa: number;
  estado: string;
  fecha_hora: string;
  mozos_recomendados: Mozo[];
  recomendaciones_por_comensal: RecomendacionesPorComensal[];
  modelo_version: string;
  latencia_ms: number;
};

const getDayOfWeek = () => new Date().getDay();

const getHorario = () => {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "manana";
  if (h >= 12 && h < 16) return "mediodia";
  if (h >= 16 && h < 20) return "tarde";
  return "noche";
};

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reserva = location.state?.reserva;

  const [recomendaciones, setRecomendaciones] = useState<Recomendaciones | null>(null);
  const [comensales, setComensales] = useState<Comensal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // PASO 1: GET comensales de la mesa
        const getRes = await fetch(`${base_url}/v1/mesas/${id}/pedidos`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (!getRes.ok) {
          if (getRes.status === 404) {
            setRecomendaciones(null);
            setComensales([]);
            return;
          }
          throw new Error(`Error ${getRes.status}: ${getRes.statusText}`);
        }

        const comensalesData: Comensal[] = await getRes.json();
        setComensales(comensalesData);

        if (!comensalesData || comensalesData.length === 0) {
          setRecomendaciones(null);
          return;
        }

        // PASO 2: POST a mesa 99 con los comensales
        const payload = {
          comensales: comensalesData,
          dia_semana: getDayOfWeek(),
          franja_horaria: getHorario(),
        };

        const postRes = await fetch(`${base_url}/v1/mesas/99/pedidos`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!postRes.ok) {
          const errorText = await postRes.text();
          throw new Error(`Error ${postRes.status}: ${errorText || postRes.statusText}`);
        }

        const recomendacionesData: Recomendaciones = await postRes.json();
        setRecomendaciones(recomendacionesData);
        
      } catch (err) {
        console.error("Error al obtener recomendaciones:", err);
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
              {/* Mozo recomendado - solo el top */}
              {recomendaciones.mozos_recomendados && recomendaciones.mozos_recomendados.length > 0 && (
                <section className="bg-white border border-[#E8E1D5] p-6 rounded-sm shadow-sm">
                  <h2 className="flex items-center gap-2 mb-4 font-serif text-xl text-[#4A3B32]">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    Mozo recomendado
                  </h2>
                  {(() => {
                    const topMozo = recomendaciones.mozos_recomendados[0];
                    return (
                      <div className="flex justify-between items-center border border-[#E8E1D5] p-4 rounded-sm bg-gradient-to-r from-[#FCFBF8] to-white">
                        <div>
                          <p className="text-[#4A3B32] font-semibold text-lg">{topMozo.nombre_mozo}</p>
                          <p className="text-xs text-[#8C7A6B]">ID: {topMozo.id_mozo}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#D4AF37] font-semibold text-lg">
                            {(topMozo.propina_rate_esperado * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-[#8C7A6B]">Propina esperada</p>
                        </div>
                      </div>
                    );
                  })()}
                </section>
              )}

              {/* Recomendaciones de platos */}
              {recomendaciones.recomendaciones_por_comensal && recomendaciones.recomendaciones_por_comensal.length > 0 && (
                <section className="bg-white border border-[#E8E1D5] p-6 rounded-sm shadow-sm">
                  <h2 className="font-serif text-xl text-[#4A3B32] mb-6">Recomendaciones de Menú</h2>
                  
                  {(() => {
                    // Calcular cantidad de platos a mostrar basado en acompañantes
                    const cantidadPlatos = comensales.length > 0 
                      ? comensales[0].cant_acompanantes + 1 
                      : 1;

                    // Obtener todas las recomendaciones del primer comensal
                    const recComensal = recomendaciones.recomendaciones_por_comensal[0];

                    return (
                      <div className="space-y-8">
                        {(["entrada", "principal", "postre", "bebida"] as const).map(curso => {
                          const platos = recComensal[curso];
                          if (!platos || platos.length === 0) return null;

                          return (
                            <div key={curso}>
                              <h3 className="text-sm uppercase text-[#D4AF37] font-bold mb-4 tracking-[0.3em] flex items-center gap-2">
                                {curso}
                                <span className="text-[#8C7A6B] text-xs normal-case tracking-normal font-normal">
                                  ({cantidadPlatos} {cantidadPlatos === 1 ? 'opción' : 'opciones'})
                                </span>
                              </h3>
                              <div className="grid gap-4">
                                {platos.slice(0, cantidadPlatos).map((plato, idx) => (
                                  <div 
                                    key={plato.id_plato} 
                                    className="border border-[#E8E1D5] p-4 rounded-sm hover:border-[#D4AF37] transition-colors"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded">
                                            #{idx + 1}
                                          </span>
                                          <h4 className="text-[#4A3B32] font-semibold">
                                            {plato.nombre_plato}
                                          </h4>
                                        </div>
                                        {plato.descripcion && (
                                          <p className="text-xs text-[#8C7A6B] mt-2 leading-relaxed">
                                            {plato.descripcion}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right ml-4">
                                        <p className="text-[#4A3B32] font-bold text-lg">
                                          ${(plato.precio).toFixed(0)}
                                        </p>
                                        <p className="text-xs text-[#D4AF37]">
                                          Score: {(plato.score * 100 + 60).toFixed(0)}%
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Info adicional */}
                  <div className="mt-8 pt-6 border-t border-[#E8E1D5] flex justify-between text-xs text-[#8C7A6B]">
                    <div>
                      <p>Comensales: {comensales.length}</p>
                      {comensales.length > 0 && (
                        <p>Acompañantes: {comensales[0].cant_acompanantes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p>Modelo: {recomendaciones.modelo_version}</p>
                      <p>Latencia: {recomendaciones.latencia_ms}ms</p>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}