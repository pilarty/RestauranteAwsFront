import {
  Check,
  Users
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function PaginaQR() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    guests: 2,
    dni: "",
    name: "",
    email: "",
    phone: "",
    motivoVisita: "Negocios",
    restriccionAlimentaria: "Ninguna",
    specialRequests: "",
    seatingPreference: "indoor",
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560130934-590b85fc08e7?auto=format&fit=crop&w=1080&q=80')"
      }}
    >
      {/* Overlay igual que Reservation */}
      <div className="absolute inset-0 bg-[#2A1F18]/60 backdrop-blur-[3px]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-[#FCFBF8] border border-[#E8E1D5] shadow-2xl rounded-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white p-8 text-center border-b border-[#E8E1D5]">
          <h2 className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">
            BellaVista
          </h2>
          <h1 className="text-3xl font-serif text-[#4A3B32] mt-2">
            Bienvenido a BellaVista
          </h1>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div className="space-y-4">
                <label className="text-xs uppercase font-semibold text-[#8C7A6B] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  Comensales
                </label>

                <div className="grid grid-cols-4 gap-2">
                  {guestOptions.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => updateField("guests", num)}
                      className={`py-3 border rounded-sm ${
                        formData.guests === num
                          ? "bg-[#4A3B32] text-[#D4AF37]"
                          : "bg-white border-[#E8E1D5] text-[#8C7A6B]"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-4 bg-[#D4AF37] text-white py-3 rounded-sm"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
            <motion.div className="space-y-6">

                <input
                placeholder="DNI"
                className="w-full border p-3 rounded-sm"
                onChange={(e) => updateField("dni", e.target.value)}
                />

                <input
                placeholder="Nombre"
                className="w-full border p-3 rounded-sm"
                onChange={(e) => updateField("name", e.target.value)}
                />

                <input
                placeholder="Email"
                className="w-full border p-3 rounded-sm"
                onChange={(e) => updateField("email", e.target.value)}
                />

                <input
                placeholder="Teléfono"
                className="w-full border p-3 rounded-sm"
                onChange={(e) => updateField("phone", e.target.value)}
                />

                {/* Tipo de grupo */}
                <div>
                <label className="text-xs uppercase font-semibold text-[#8C7A6B]">
                    Tipo de grupo
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {["Familia", "Pareja", "Amigos", "Negocios", "Solo"].map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => updateField("tipoGrupo", t)}
                        className="border p-2 rounded-sm text-sm"
                    >
                        {t}
                    </button>
                    ))}
                </div>
                </div>

                {/* Estado de ánimo */}
                <div>
                <label className="text-xs uppercase font-semibold text-[#8C7A6B]">
                    Estado de ánimo
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {["Celebración", "Relajado", "Con prisa", "Romántico", "Formal"].map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => updateField("estadoAnimo", t)}
                        className="border p-2 rounded-sm text-sm"
                    >
                        {t}
                    </button>
                    ))}
                </div>
                </div>

                {/* Ocasión */}
                <div>
                <label className="text-xs uppercase font-semibold text-[#8C7A6B]">
                    Ocasión
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {["Cumpleaños", "Aniversario", "Cita", "Reunión", "Ninguna"].map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => updateField("ocasion", t)}
                        className="border p-2 rounded-sm text-sm"
                    >
                        {t}
                    </button>
                    ))}
                </div>
                </div>

                {/* Edades */}
                <div>
                <label className="text-xs uppercase font-semibold text-[#8C7A6B]">
                    Edades
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {["20s", "30s", "40s", "50s", "Mixto"].map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => updateField("edades", t)}
                        className="border p-2 rounded-sm text-sm"
                    >
                        {t}
                    </button>
                    ))}
                </div>
                </div>

                <div className="flex gap-2 pt-4">
                <button
                    onClick={() => setStep(1)}
                    className="flex-1 border py-3 rounded-sm"
                >
                    Atrás
                </button>

                <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-[#D4AF37] text-white py-3 rounded-sm"
                >
                    Continuar
                </button>
                </div>
            </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div className="text-center">
                <Check className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                <h2 className="text-xl font-serif text-[#4A3B32]">
                  Tus datos fueron registrados correctamente. ¡Buen provecho!
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}