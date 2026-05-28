import { useState } from "react";
import { base_url } from "../../api";

const getDayOfWeek = () => new Date().getDay();

const getHorario = () => {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "manana";
  if (h >= 12 && h < 16) return "mediodia";
  if (h >= 16 && h < 20) return "tarde";
  return "noche";
};

export function PaginaQR() {
  const [step, setStep] = useState(0);
  const [idMesa, setIdMesa] = useState("");
  const [idPersonaEnMesa, setIdPersonaEnMesa] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastPayload, setLastPayload] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    dni: "",
    cantAcompanantes: "",
    franjaEtaria: "",
    motivoVisita: "",
    restriccion: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev] === value ? "" : value,
    }));
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
      const capacidad = data.capacidad || 10;
      const randomSeat = Math.floor(Math.random() * capacidad) + 1;
      setIdPersonaEnMesa(randomSeat);
      setStep(1);
    } catch (e) {
      console.error("[fetchMesa] error:", e);
      setError("No se pudo obtener la mesa. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = {
      comensales: [
        {
          id_persona_en_mesa: idPersonaEnMesa,
          id_cliente: parseInt(formData.dni) || 0,
          franja_etaria_persona: formData.franjaEtaria,
          cant_acompanantes: parseInt(formData.cantAcompanantes) || 0,
          motivo_visita: formData.motivoVisita,
          restriccion_alimentaria: formData.restriccion || "ninguna",
          orden_de_pedido: Math.floor(Math.random() * 5) + 1,
        },
      ],
      dia_semana: getDayOfWeek(),
      franja_horaria: getHorario(),
    };
    try {
      const res = await fetch(`${base_url}/v1/mesas/${idMesa}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[handleSubmit] status:", res.status);
      const data = await res.json();
      console.log("[handleSubmit] response:", data);
    } catch (err) {
      console.error("[handleSubmit] error:", err);
    } finally {
      setIsLoading(false);
      setLastPayload(JSON.stringify(payload, null, 2));
      setStep(3);
    }
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
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i <= step && step < 3 ? "bg-[#D4AF37]" : "bg-[#E8E1D5]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* STEP 0 — Número de mesa */}
          {step === 0 && (
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
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                onClick={fetchMesa}
                disabled={!idMesa || isLoading}
                className="w-full bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-50 text-white py-3 rounded-sm font-semibold text-xs uppercase tracking-widest"
              >
                {isLoading ? "Buscando..." : "Continuar"}
              </button>
            </div>
          )}

          {/* STEP 1 — Datos personales */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#8C7A6B] uppercase font-semibold tracking-widest mb-2">
                Tus datos
              </p>
              <input
                type="number"
                placeholder="DNI"
                className={inputClass}
                onChange={(e) => updateField("dni", e.target.value)}
              />
              <input
                type="number"
                placeholder="Cantidad de acompañantes"
                min={0}
                max={20}
                className={inputClass}
                onChange={(e) => updateField("cantAcompanantes", e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 border border-[#E8E1D5] py-3 rounded-sm text-xs text-[#8C7A6B]"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.dni || formData.cantAcompanantes === ""}
                  className="flex-1 bg-[#D4AF37] disabled:opacity-50 text-white py-3 rounded-sm text-xs font-semibold uppercase tracking-widest"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Preferencias */}
          {step === 2 && (
            <div className="space-y-6">
              {[
                {
                  label: "Franja etaria",
                  field: "franjaEtaria",
                  options: ["joven", "adulto", "senior", "mixto"],
                },
                {
                  label: "Motivo de visita",
                  field: "motivoVisita",
                  options: ["negocios", "cumpleaños", "date", "turista", "casual"],
                },
                {
                  label: "Restricción alimentaria",
                  field: "restriccion",
                  options: ["ninguna", "vegetariano", "vegano", "sin gluten", "sin lactosa", "halal"],
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
                  onClick={() => setStep(1)}
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

          {/* STEP 3 — Confirmación */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#D4AF37] text-2xl">✓</span>
              </div>
              <h2 className="text-xl font-serif text-[#4A3B32]">¡Listo!</h2>
              <p className="text-sm text-[#8C7A6B] mt-2">
                Tus datos fueron registrados correctamente. ¡Buen provecho!
              </p>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}