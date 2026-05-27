import { Check, Hash } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { base_url } from "../../api";

export function PaginaQR() {
  const [step, setStep] = useState(0);
  const [idMesa, setIdMesa] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    email: "",
    phone: "",
    tipoGrupo: "",
    estadoAnimo: "",
    ocasion: "",
    edades: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: prev[field as keyof typeof prev] === value ? "" : value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${base_url}/v1/reservas?id_mesa=${idMesa}`);
      const reservas = await res.json();
      const reservaActiva = reservas.find((r: any) => r.estado === "confirmada");

      if (reservaActiva) {
        const notas = JSON.stringify({
          edades: formData.edades,
          ocasion: formData.ocasion,
          tipoGrupo: formData.tipoGrupo,
          estadoAnimo: formData.estadoAnimo,
          dni: formData.dni,
          nombre: formData.name,
        });

        await fetch(`${base_url}/v1/reservas/${reservaActiva.id_reserva}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notas }),
        });
      }
    } catch (err) {
      console.error("Error guardando datos QR", err);
    } finally {
      setIsLoading(false);
      setStep(3);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560130934-590b85fc08e7?auto=format&fit=crop&w=1080&q=80')" }}
    >
      <div className="absolute inset-0 bg-[#2A1F18]/60 backdrop-blur-[3px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-[#FCFBF8] border border-[#E8E1D5] shadow-2xl rounded-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white p-8 text-center border-b border-[#E8E1D5]">
          <h2 className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">BellaVista</h2>
          <h1 className="text-3xl font-serif text-[#4A3B32] mt-2">Bienvenido a BellaVista</h1>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* STEP 0 — Número de mesa */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <label className="text-xs uppercase font-semibold text-[#8C7A6B] flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#D4AF37]" />
                  Número de mesa
                </label>
                <input
                  type="number"
                  placeholder="Ej: 4"
                  value={idMesa}
                  onChange={(e) => setIdMesa(e.target.value)}
                  className="w-full border border-[#E8E1D5] rounded-sm px-4 py-3 text-[#4A3B32] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] bg-white"
                />
                <button
                  onClick={() => setStep(1)}
                  disabled={!idMesa}
                  className="w-full bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-50 text-white py-3 rounded-sm font-semibold text-xs uppercase tracking-widest"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {/* STEP 1 — Datos personales */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-xs text-[#8C7A6B] uppercase font-semibold tracking-widest mb-2">Tus datos</p>

                {[
                  { placeholder: "DNI", field: "dni" },
                  { placeholder: "Nombre", field: "name" },
                  { placeholder: "Email", field: "email" },
                  { placeholder: "Teléfono", field: "phone" },
                ].map(({ placeholder, field }) => (
                  <input
                    key={field}
                    placeholder={placeholder}
                    className="w-full border border-[#E8E1D5] p-3 rounded-sm bg-white text-[#4A3B32] focus:outline-none focus:border-[#D4AF37]"
                    onChange={(e) => updateField(field, e.target.value)}
                  />
                ))}

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setStep(0)} className="flex-1 border border-[#E8E1D5] py-3 rounded-sm text-xs text-[#8C7A6B]">
                    Atrás
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 bg-[#D4AF37] text-white py-3 rounded-sm text-xs font-semibold uppercase tracking-widest">
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Preferencias */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {[
                  { label: "Tipo de grupo", field: "tipoGrupo", options: ["Familia", "Pareja", "Amigos", "Negocios", "Solo"] },
                  { label: "Estado de ánimo", field: "estadoAnimo", options: ["Celebración", "Relajado", "Con prisa", "Romántico", "Formal"] },
                  { label: "Ocasión", field: "ocasion", options: ["Cumpleaños", "Aniversario", "Cita", "Reunión", "Ninguna"] },
                  { label: "Edades", field: "edades", options: ["20s", "30s", "40s", "50s", "Mixto"] },
                ].map(({ label, field, options }) => (
                  <div key={field}>
                    <label className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-widest">{label}</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleField(field, opt)}
                          className={`border p-2 rounded-sm text-sm transition-all ${
                            formData[field as keyof typeof formData] === opt
                              ? "bg-[#4A3B32] text-[#D4AF37] border-[#4A3B32]"
                              : "bg-white border-[#E8E1D5] text-[#8C7A6B] hover:border-[#D4AF37]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setStep(1)} className="flex-1 border border-[#E8E1D5] py-3 rounded-sm text-xs text-[#8C7A6B]">
                    Atrás
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-[#4A3B32] hover:bg-[#322721] disabled:opacity-60 text-[#D4AF37] py-3 rounded-sm text-xs font-semibold uppercase tracking-widest"
                  >
                    {isLoading ? "Guardando..." : "Confirmar"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Confirmación */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h2 className="text-xl font-serif text-[#4A3B32]">¡Listo!</h2>
                <p className="text-sm text-[#8C7A6B] mt-2">Tus datos fueron registrados correctamente. ¡Buen provecho!</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}