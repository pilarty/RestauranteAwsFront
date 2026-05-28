import React, { useEffect, useMemo, useState } from "react";
import { base_url } from "../../api";

type EstadoPedido = "pendiente" | "activo" | "informado" | "confirmado" | "cerrado";
type Curso = "entrada" | "principal" | "postre" | "bebida";

type Plato = {
  id_plato: number;
  nombre_plato: string;
  descripcion: string | null;
  precio: number;
  score: number;
  rank: number;
};

type RecomendacionComensal = {
  id_persona_en_mesa: number;
  entrada: Plato[];
  principal: Plato[];
  postre: Plato[];
  bebida: Plato[];
};

type MozoRecomendado = {
  id_mozo: number;
  nombre_mozo?: string | null;
  propina_rate_esperado: number;
  rank: number;
};

type PedidoResponse = {
  id_pedido: string;
  mozos_recomendados: MozoRecomendado[];
};

type PlatosSeleccionados = {
  id_entrada?: number;
  id_principal?: number;
  id_postre?: number;
  id_bebida?: number;
};

type PreferenciaResponse = {
  codigo_pedido: string;
  id_mesa: number;
  estado: EstadoPedido;
  fecha_hora: string;
  id_pedido?: string | null;
  platos_seleccionados?: PlatosSeleccionados | null;
  comensal: {
    id_persona_en_mesa: number;
    id_cliente: number | null;
    franja_etaria_persona: string;
    cant_acompanantes: number;
    motivo_visita: string;
    restriccion_alimentaria: string;
    orden_de_pedido: number;
  };
};

type FeedbackForm = {
  montoPropina: string;
  propinaRate: string;
  horaEntregaPlato: string;
  horaRetiroPlato: string;
  likeMozo: string;
  likeEntrada: string;
  likePrincipal: string;
  likePostre: string;
  likeBebida: string;
  proporcionDejadaEntrada: string;
  proporcionDejadaPrincipal: string;
  proporcionDejadaPostre: string;
};

const cursos: { key: Curso; label: string; required: boolean }[] = [
  { key: "entrada", label: "Entrada", required: false },
  { key: "principal", label: "Principal", required: true },
  { key: "postre", label: "Postre", required: false },
  { key: "bebida", label: "Bebida", required: true },
];

export function PaginaQR() {
  const [step, setStep] = useState<"mesa" | "datos" | "preferencias" | "espera" | "platos" | "feedback" | "cerrado">("mesa");
  const [idMesa, setIdMesa] = useState("");
  const [codigoPedido, setCodigoPedido] = useState(() => localStorage.getItem("codigo_pedido") || "");
  const [preferencia, setPreferencia] = useState<PreferenciaResponse | null>(null);
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionComensal | null>(null);
  const [mozoRecomendado, setMozoRecomendado] = useState<MozoRecomendado | null>(null);
  const [platosSeleccionados, setPlatosSeleccionados] = useState<PlatosSeleccionados>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    dni: "",
    cantAcompanantes: "",
    franjaEtaria: "",
    motivoVisita: "",
    restriccion: "",
  });

  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    montoPropina: "",
    propinaRate: "",
    horaEntregaPlato: "",
    horaRetiroPlato: "",
    likeMozo: "",
    likeEntrada: "",
    likePrincipal: "",
    likePostre: "",
    likeBebida: "",
    proporcionDejadaEntrada: "",
    proporcionDejadaPrincipal: "",
    proporcionDejadaPostre: "",
  });

  const selectedPrincipal = platosSeleccionados.id_principal;
  const selectedBebida = platosSeleccionados.id_bebida;
  const canConfirmPlatos = Boolean(selectedPrincipal && selectedBebida);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateFeedbackField = (field: keyof FeedbackForm, value: string) => {
    setFeedbackForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev] === value ? "" : value,
    }));
  };

  const estadoLabel = useMemo(() => {
    if (!preferencia) return "Pendiente";
    const labels: Record<EstadoPedido, string> = {
      pendiente: "Esperando activación del mozo",
      activo: "Pedido activo",
      informado: "Pedido informado",
      confirmado: "Platos confirmados",
      cerrado: "Comida finalizada",
    };
    return labels[preferencia.estado];
  }, [preferencia]);

  const parseApiError = async (res: Response, fallback: string) => {
    try {
      const data = await res.json();
      return data.detail || data.message || data.error || fallback;
    } catch {
      return fallback;
    }
  };

  const cargarMozoRecomendado = async (idPedido: string) => {
    try {
      const res = await fetch(`${base_url}/v1/pedidos/${idPedido}`);
      if (!res.ok) {
        throw new Error(await parseApiError(res, "No se pudo obtener el mozo recomendado."));
      }

      const data: PedidoResponse = await res.json();
      const mejorMozo = [...(data.mozos_recomendados || [])].sort(
        (a, b) => b.propina_rate_esperado - a.propina_rate_esperado,
      )[0];
      setMozoRecomendado(mejorMozo || null);
    } catch (err) {
      setMozoRecomendado(null);
      setError(err instanceof Error ? err.message : "No se pudo obtener el mozo recomendado.");
    }
  };

  const fetchMesa = async () => {
    setIsLoading(true);
    setError("");
    const url = `${base_url}/v1/mesas/${idMesa}`;
    console.log("[fetchMesa] url:", url);
    try {
      const res = await fetch(url);
      console.log("[fetchMesa] status:", res.status);
      const data = await res.json();
      console.log("[fetchMesa] data:", data);
      if (!res.ok) throw new Error("Mesa no encontrada");
      setStep("datos");
    } catch (e) {
      console.error("[fetchMesa] error:", e);
      setError("No se pudo obtener la mesa. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const aplicarPreferencia = (data: PreferenciaResponse) => {
    setPreferencia(data);
    setCodigoPedido(data.codigo_pedido);
    setIdMesa(String(data.id_mesa));
    localStorage.setItem("codigo_pedido", data.codigo_pedido);

    if (data.platos_seleccionados) {
      setPlatosSeleccionados(data.platos_seleccionados);
    }

    if (data.estado === "cerrado") {
      setStep("cerrado");
      return;
    }

    if (data.estado === "confirmado") {
      setStep("feedback");
      return;
    }

    if (data.estado === "activo" || data.estado === "informado") {
      setStep("platos");
      return;
    }

    setStep("espera");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    const payload = {
      id_mesa: parseInt(idMesa),
      comensal: {
        id_cliente: formData.dni ? parseInt(formData.dni) : null,
        franja_etaria_persona: formData.franjaEtaria,
        cant_acompanantes: parseInt(formData.cantAcompanantes) || 0,
        motivo_visita: formData.motivoVisita,
        restriccion_alimentaria: formData.restriccion || "ninguna",
        orden_de_pedido: 1,
      },
    };
    try {
      const res = await fetch(`${base_url}/v1/pedidos/preferencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[handleSubmit] status:", res.status);
      const data = await res.json();
      console.log("[handleSubmit] response:", data);

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo registrar la preferencia.");
      }

      aplicarPreferencia(data);
      setSuccess("Preferencias guardadas. Avisale al mozo para activar tu pedido.");
    } catch (err) {
      console.error("[handleSubmit] error:", err);
      setError(err instanceof Error ? err.message : "No se pudo registrar la preferencia.");
    } finally {
      setIsLoading(false);
    }
  };

  const consultarEstado = async (silent = false) => {
    if (!codigoPedido) return;
    if (!silent) {
      setIsLoading(true);
      setError("");
    }

    try {
      const res = await fetch(`${base_url}/v1/pedidos/preferencias/${codigoPedido}`);
      if (!res.ok) {
        throw new Error(await parseApiError(res, "No se pudo consultar el estado."));
      }
      const data: PreferenciaResponse = await res.json();
      aplicarPreferencia(data);
      if (data.estado === "activo" || data.estado === "informado") {
        await cargarPlatos(data.codigo_pedido);
      }
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "No se pudo consultar el estado.");
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const cargarPlatos = async (codigo = codigoPedido) => {
    if (!codigo) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${base_url}/v1/pedidos/preferencias/${codigo}/platos`);
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Todavía no hay platos disponibles."));
      }
      const data: RecomendacionComensal = await res.json();
      setRecomendaciones(data);
      setStep("platos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los platos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!codigoPedido || step !== "espera") return;

    const interval = window.setInterval(() => {
      void consultarEstado(true);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [codigoPedido, step]);

  useEffect(() => {
    if (codigoPedido && !preferencia) {
      void consultarEstado(true);
    }
  }, []);

  useEffect(() => {
    if (preferencia?.id_pedido && !mozoRecomendado) {
      void cargarMozoRecomendado(preferencia.id_pedido);
    }
  }, [preferencia?.id_pedido, mozoRecomendado]);

  const selectPlato = (curso: Curso, idPlato: number) => {
    const fieldByCurso: Record<Curso, keyof PlatosSeleccionados> = {
      entrada: "id_entrada",
      principal: "id_principal",
      postre: "id_postre",
      bebida: "id_bebida",
    };
    const field = fieldByCurso[curso];
    setPlatosSeleccionados((prev) => ({
      ...prev,
      [field]: prev[field] === idPlato ? undefined : idPlato,
    }));
  };

  const confirmarPlatos = async () => {
    if (!canConfirmPlatos || !codigoPedido) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      id_entrada: platosSeleccionados.id_entrada,
      id_principal: platosSeleccionados.id_principal,
      id_postre: platosSeleccionados.id_postre,
      id_bebida: platosSeleccionados.id_bebida,
    };

    try {
      const res = await fetch(`${base_url}/v1/pedidos/preferencias/${codigoPedido}/platos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await parseApiError(res, "No se pudo confirmar la selección."));
      }

      const data = await res.json();
      setPlatosSeleccionados(data.platos_seleccionados);
      await cargarMozoRecomendado(data.id_pedido);
      setPreferencia((prev) =>
        prev
          ? {
              ...prev,
              estado: data.estado,
              id_pedido: data.id_pedido,
              platos_seleccionados: data.platos_seleccionados,
            }
          : prev,
      );
      setSuccess("Platos confirmados. Cuando termines, podés finalizar la comida.");
      setStep("feedback");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo confirmar la selección.");
    } finally {
      setIsLoading(false);
    }
  };

  const toOptionalNumber = (value: string) => {
    if (value.trim() === "") return undefined;
    const number = Number(value);
    return Number.isNaN(number) ? undefined : number;
  };

  const toOptionalPercentRate = (value: string) => {
    const number = toOptionalNumber(value);
    return number === undefined ? undefined : number / 100;
  };

  const toOptionalBoolean = (value: string) => {
    if (value === "") return undefined;
    return value === "true";
  };

  const finalizarComida = async () => {
    if (!codigoPedido || !selectedPrincipal || !selectedBebida || !mozoRecomendado) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      id_mozo: mozoRecomendado.id_mozo,
      id_entrada: platosSeleccionados.id_entrada,
      id_principal: selectedPrincipal,
      id_postre: platosSeleccionados.id_postre,
      id_bebida: selectedBebida,
      hora_entrega_plato: feedbackForm.horaEntregaPlato || undefined,
      hora_retiro_plato: feedbackForm.horaRetiroPlato || undefined,
      monto_propina: toOptionalNumber(feedbackForm.montoPropina),
      propina_rate: toOptionalPercentRate(feedbackForm.propinaRate),
      like_mozo: toOptionalBoolean(feedbackForm.likeMozo),
      like_entrada: toOptionalBoolean(feedbackForm.likeEntrada),
      like_principal: toOptionalBoolean(feedbackForm.likePrincipal),
      like_postre: toOptionalBoolean(feedbackForm.likePostre),
      like_bebida: toOptionalBoolean(feedbackForm.likeBebida),
      proporcion_dejada_entrada: feedbackForm.proporcionDejadaEntrada || undefined,
      proporcion_dejada_principal: feedbackForm.proporcionDejadaPrincipal || undefined,
      proporcion_dejada_postre: feedbackForm.proporcionDejadaPostre || undefined,
    };

    try {
      const res = await fetch(`${base_url}/v1/pedidos/preferencias/${codigoPedido}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await parseApiError(res, "No se pudo finalizar la comida."));
      }

      localStorage.removeItem("codigo_pedido");
      setSuccess("Gracias por tu feedback. Tu comida quedó finalizada.");
      setStep("cerrado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo finalizar la comida.");
    } finally {
      setIsLoading(false);
    }
  };

  const empezarNuevoPedido = () => {
    localStorage.removeItem("codigo_pedido");
    setCodigoPedido("");
    setPreferencia(null);
    setRecomendaciones(null);
    setMozoRecomendado(null);
    setPlatosSeleccionados({});
    setSuccess("");
    setError("");
    setFormData({
      dni: "",
      cantAcompanantes: "",
      franjaEtaria: "",
      motivoVisita: "",
      restriccion: "",
    });
    setStep("mesa");
  };

  const inputClass =
    "w-full border border-[#E8E1D5] rounded-sm px-4 py-3 text-[#4A3B32] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] bg-white";

  const optBtn = (field: string, value: string) => {
    const selected = formData[field as keyof typeof formData] === value;
    return (
      <button
        key={value}
        type="button"
        onClick={() => toggleField(field, value)}
        className={`border p-2 rounded-sm text-sm transition-all ${
          selected
            ? "bg-[#4A3B32] text-[#D4AF37] border-[#4A3B32]"
            : "bg-white border-[#E8E1D5] text-[#8C7A6B] hover:border-[#D4AF37]"
        }`}
      >
        {value}
      </button>
    );
  };

  const renderBoolSelect = (field: keyof FeedbackForm, label: string) => (
    <label className="block">
      <span className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-widest">
        {label}
      </span>
      <select
        value={feedbackForm[field]}
        onChange={(e) => updateFeedbackField(field, e.target.value)}
        className={`${inputClass} mt-2`}
      >
        <option value="">Sin responder</option>
        <option value="true">Sí</option>
        <option value="false">No</option>
      </select>
    </label>
  );

  const renderProporcionSelect = (field: keyof FeedbackForm, label: string) => (
    <label className="block">
      <span className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-widest">
        {label}
      </span>
      <select
        value={feedbackForm[field]}
        onChange={(e) => updateFeedbackField(field, e.target.value)}
        className={`${inputClass} mt-2`}
      >
        <option value="">Sin responder</option>
        <option value="nada">Nada</option>
        <option value="poco">Poco</option>
        <option value="mitad">Mitad</option>
        <option value="mayoria">Mayoría</option>
        <option value="todo">Todo</option>
      </select>
    </label>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560130934-590b85fc08e7?auto=format&fit=crop&w=1080&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-[#2A1F18]/60 backdrop-blur-[3px]" />

      <div className="relative w-full max-w-xl bg-[#FCFBF8] border border-[#E8E1D5] shadow-2xl rounded-sm overflow-hidden">
        {/* Header */}
        <div className="bg-white p-8 text-center border-b border-[#E8E1D5]">
          <h2 className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">
            BellaVista
          </h2>
          <h1 className="text-3xl font-serif text-[#4A3B32] mt-2">
            Registro de mesa
          </h1>
          <div className="flex justify-center gap-2 mt-4">
            {["mesa", "preferencias", "espera", "platos", "feedback"].map((name, i) => (
              <div
                key={name}
                className={`w-2 h-2 rounded-full transition-all ${
                  i <= Math.max(0, ["mesa", "datos", "preferencias", "espera", "platos", "feedback", "cerrado"].indexOf(step) - (step === "datos" ? 1 : 0))
                    ? "bg-[#D4AF37]"
                    : "bg-[#E8E1D5]"
                }`}
              />
            ))}
          </div>
          {codigoPedido && (
            <p className="text-xs text-[#8C7A6B] mt-4">
              Código: <span className="font-semibold text-[#4A3B32]">{codigoPedido}</span>
            </p>
          )}
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 border border-red-200 bg-red-50 text-red-700 text-sm p-3 rounded-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 border border-green-200 bg-green-50 text-green-700 text-sm p-3 rounded-sm">
              {success}
            </div>
          )}

          {/* Número de mesa */}
          {step === "mesa" && (
            <div className="space-y-4">
              <p className="text-xs text-[#8C7A6B] uppercase font-semibold tracking-widest">
                Número de mesa
              </p>
              <input
                type="number"
                placeholder="Ej: 4"
                value={idMesa}
                onChange={(e) => setIdMesa(e.target.value)}
                className={inputClass}
              />
              <button
                onClick={fetchMesa}
                disabled={!idMesa || isLoading}
                className="w-full bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-50 text-white py-3 rounded-sm font-semibold text-xs uppercase tracking-widest"
              >
                {isLoading ? "Buscando..." : "Continuar"}
              </button>
              {codigoPedido && (
                <button
                  onClick={() => void consultarEstado()}
                  disabled={isLoading}
                  className="w-full border border-[#E8E1D5] hover:border-[#D4AF37] disabled:opacity-50 text-[#4A3B32] py-3 rounded-sm font-semibold text-xs uppercase tracking-widest"
                >
                  Recuperar pedido guardado
                </button>
              )}
            </div>
          )}

          {/* Datos personales */}
          {step === "datos" && (
            <div className="space-y-4">
              <p className="text-xs text-[#8C7A6B] uppercase font-semibold tracking-widest mb-2">
                Tus datos
              </p>
              <input
                type="number"
                placeholder="DNI"
                className={inputClass}
                value={formData.dni}
                onChange={(e) => updateField("dni", e.target.value)}
              />
              <input
                type="number"
                placeholder="Cantidad de acompañantes"
                min={0}
                max={20}
                className={inputClass}
                value={formData.cantAcompanantes}
                onChange={(e) => updateField("cantAcompanantes", e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep("mesa")}
                  className="flex-1 border border-[#E8E1D5] py-3 rounded-sm text-xs text-[#8C7A6B]"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep("preferencias")}
                  disabled={!formData.dni || formData.cantAcompanantes === ""}
                  className="flex-1 bg-[#D4AF37] disabled:opacity-50 text-white py-3 rounded-sm text-xs font-semibold uppercase tracking-widest"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Preferencias */}
          {step === "preferencias" && (
            <div className="space-y-6">
              {[
                {
                  label: "Franja etaria",
                  field: "franjaEtaria",
                  options: ["joven", "adulto", "senior"],
                },
                {
                  label: "Motivo de visita",
                  field: "motivoVisita",
                  options: ["negocios", "cumpleaños", "date", "turista", "casual"],
                },
                {
                  label: "Restricción alimentaria",
                  field: "restriccion",
                  options: ["ninguna", "vegetariano", "vegano", "celiaco", "kosher"],
                },
              ].map(({ label, field, options }) => (
                <div key={field}>
                  <label className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-widest">
                    {label}
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {options.map((opt) => optBtn(field, opt))}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep("datos")}
                  className="flex-1 border border-[#E8E1D5] py-3 rounded-sm text-xs text-[#8C7A6B]"
                >
                  Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !formData.franjaEtaria || !formData.motivoVisita || isLoading
                  }
                  className="flex-1 bg-[#4A3B32] hover:bg-[#322721] disabled:opacity-60 text-[#D4AF37] py-3 rounded-sm text-xs font-semibold uppercase tracking-widest"
                >
                  {isLoading ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </div>
          )}

          {/* Espera */}
          {step === "espera" && (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h2 className="text-xl font-serif text-[#4A3B32]">{estadoLabel}</h2>
                <p className="text-sm text-[#8C7A6B] mt-2">
                  Tus preferencias ya están guardadas. La carta recomendada va a aparecer cuando el mozo active el pedido desde la mesa.
                </p>
              </div>
              <button
                onClick={() => void consultarEstado()}
                disabled={isLoading}
                className="w-full bg-[#4A3B32] hover:bg-[#322721] disabled:opacity-60 text-[#D4AF37] py-3 rounded-sm text-xs font-semibold uppercase tracking-widest"
              >
                {isLoading ? "Consultando..." : "Actualizar estado"}
              </button>
            </div>
          )}

          {/* Platos */}
          {step === "platos" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs text-[#8C7A6B] uppercase font-semibold tracking-widest">
                  Selección de platos
                </p>
                <h2 className="text-2xl font-serif text-[#4A3B32] mt-1">
                  Elegí tus recomendaciones
                </h2>
                <p className="text-sm text-[#8C7A6B] mt-2">
                  Principal y bebida son obligatorios. Entrada y postre son opcionales.
                </p>
              </div>

              {!recomendaciones && (
                <button
                  onClick={() => void cargarPlatos()}
                  disabled={isLoading}
                  className="w-full bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-50 text-white py-3 rounded-sm font-semibold text-xs uppercase tracking-widest"
                >
                  {isLoading ? "Cargando..." : "Ver platos recomendados"}
                </button>
              )}

              {recomendaciones &&
                cursos.map(({ key, label, required }) => {
                  const platos = recomendaciones[key] || [];
                  const selectedByCurso: Record<Curso, number | undefined> = {
                    entrada: platosSeleccionados.id_entrada,
                    principal: platosSeleccionados.id_principal,
                    postre: platosSeleccionados.id_postre,
                    bebida: platosSeleccionados.id_bebida,
                  };

                  return (
                    <section key={key}>
                      <h3 className="text-sm uppercase text-[#D4AF37] font-bold mb-3 tracking-[0.25em]">
                        {label} {required ? "*" : ""}
                      </h3>
                      <div className="grid gap-3">
                        {platos.map((plato) => {
                          const selected = selectedByCurso[key] === plato.id_plato;
                          return (
                            <button
                              key={plato.id_plato}
                              type="button"
                              onClick={() => selectPlato(key, plato.id_plato)}
                              className={`text-left border p-4 rounded-sm transition-all ${
                                selected
                                  ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                  : "border-[#E8E1D5] bg-white hover:border-[#D4AF37]"
                              }`}
                            >
                              <div className="flex justify-between gap-3">
                                <div>
                                  <p className="text-[#4A3B32] font-semibold">
                                    {plato.nombre_plato}
                                  </p>
                                  {plato.descripcion && (
                                    <p className="text-xs text-[#8C7A6B] mt-1 leading-relaxed">
                                      {plato.descripcion}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-[#4A3B32] font-bold">${plato.precio}</p>
                                  <p className="text-xs text-[#8C7A6B]">Rank #{plato.rank}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

              {recomendaciones && (
                <button
                  onClick={confirmarPlatos}
                  disabled={!canConfirmPlatos || isLoading}
                  className="w-full bg-[#4A3B32] hover:bg-[#322721] disabled:opacity-60 text-[#D4AF37] py-3 rounded-sm text-xs font-semibold uppercase tracking-widest"
                >
                  {isLoading ? "Confirmando..." : "Confirmar platos"}
                </button>
              )}
            </div>
          )}

          {/* Feedback */}
          {step === "feedback" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs text-[#8C7A6B] uppercase font-semibold tracking-widest">
                  Feedback final
                </p>
                <h2 className="text-2xl font-serif text-[#4A3B32] mt-1">
                  Finalizar comida
                </h2>
                <p className="text-sm text-[#8C7A6B] mt-2">
                  Completá estos datos cuando termines para cerrar el pedido.
                </p>
              </div>

              <button
                onClick={() => setStep("platos")}
                className="w-full border border-[#E8E1D5] py-3 rounded-sm text-xs text-[#8C7A6B]"
              >
                Ver o cambiar platos seleccionados
              </button>

              <div className="border border-[#E8E1D5] bg-white p-4 rounded-sm">
                <p className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-widest">
                  Mozo asignado automáticamente
                </p>
                {mozoRecomendado ? (
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-[#4A3B32] font-semibold">
                        {mozoRecomendado.nombre_mozo || `Mozo ${mozoRecomendado.id_mozo}`}
                      </p>
                      <p className="text-xs text-[#8C7A6B]">ID: {mozoRecomendado.id_mozo}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#8C7A6B] mt-2">
                    Cargando el mozo con mejor rating del pedido...
                  </p>
                )}
              </div>

              <div className="grid gap-4">
                <input
                  type="datetime-local"
                  value={feedbackForm.horaEntregaPlato}
                  onChange={(e) => updateFeedbackField("horaEntregaPlato", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="datetime-local"
                  value={feedbackForm.horaRetiroPlato}
                  onChange={(e) => updateFeedbackField("horaRetiroPlato", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Monto de propina"
                  value={feedbackForm.montoPropina}
                  onChange={(e) => updateFeedbackField("montoPropina", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Porcentaje de propina (ej: 20)"
                  value={feedbackForm.propinaRate}
                  onChange={(e) => updateFeedbackField("propinaRate", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4">
                {renderBoolSelect("likeMozo", "¿Te gustó la atención del mozo?")}
                {platosSeleccionados.id_entrada && renderBoolSelect("likeEntrada", "¿Te gustó la entrada?")}
                {renderBoolSelect("likePrincipal", "¿Te gustó el principal?")}
                {platosSeleccionados.id_postre && renderBoolSelect("likePostre", "¿Te gustó el postre?")}
                {renderBoolSelect("likeBebida", "¿Te gustó la bebida?")}
              </div>

              <div className="grid gap-4">
                {platosSeleccionados.id_entrada && renderProporcionSelect("proporcionDejadaEntrada", "Proporción dejada de entrada")}
                {renderProporcionSelect("proporcionDejadaPrincipal", "Proporción dejada del principal")}
                {platosSeleccionados.id_postre && renderProporcionSelect("proporcionDejadaPostre", "Proporción dejada del postre")}
              </div>

              <button
                onClick={finalizarComida}
                disabled={!mozoRecomendado || !canConfirmPlatos || isLoading}
                className="w-full bg-[#4A3B32] hover:bg-[#322721] disabled:opacity-60 text-[#D4AF37] py-3 rounded-sm text-xs font-semibold uppercase tracking-widest"
              >
                {isLoading ? "Finalizando..." : "Enviar feedback y finalizar"}
              </button>
            </div>
          )}

          {/* Cerrado */}
          {step === "cerrado" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto">
                <span className="text-[#D4AF37] text-2xl">✓</span>
              </div>
              <div>
                <h2 className="text-xl font-serif text-[#4A3B32]">¡Gracias!</h2>
                <p className="text-sm text-[#8C7A6B] mt-2">
                  Tu pedido fue cerrado correctamente.
                </p>
              </div>
              <button
                onClick={empezarNuevoPedido}
                className="w-full border border-[#E8E1D5] hover:border-[#D4AF37] text-[#4A3B32] py-3 rounded-sm font-semibold text-xs uppercase tracking-widest"
              >
                Cargar otro pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}