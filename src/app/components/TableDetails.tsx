import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Users, Edit3, Sparkles } from "lucide-react";

const CHIP_CATEGORIES = {
  tipoGrupo: ["Familia", "Pareja", "Amigos", "Negocios", "Solo"],
  ocasion: ["Cumpleaños", "Aniversario", "Cita", "Reunión", "Ninguna"],
  edades: ["20s", "30s", "40s", "50s", "Mixto"],
};

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // lo que edita el mozo
  const [observaciones, setObservaciones] = useState<Record<string, string>>({
    tipoGrupo: "Pareja",
    ocasion: "Aniversario",
    edades: "30s",
  });

  // lo que ya fue “confirmado” para IA
  const [savedObservaciones, setSavedObservaciones] = useState<Record<string, string> | null>(null);

  const toggleObservation = (category: string, value: string) => {
    setObservaciones(prev => ({
      ...prev,
      [category]: prev[category] === value ? "" : value,
    }));
  };

  const handleSave = () => {
    setSavedObservaciones(observaciones);
  };

  const aiData = savedObservaciones; // esto controla la IA

  return (
    <div className="h-full flex flex-col -m-4 md:-m-6 lg:-m-10">

      {/* HEADER */}
      <header className="px-6 py-4 border-b border-[#E8E1D5] bg-white flex justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-2xl font-serif text-[#4A3B32]">
            Mesa {id || "2"}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Users className="w-4 h-4" /> 2 / 4 personas
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto grid xl:grid-cols-12 gap-8">

          {/* IZQUIERDA */}
          <div className="xl:col-span-5 space-y-6">

            <section className="bg-white border p-6">
              <h2 className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5" />
                Observaciones del mozo
              </h2>

              {Object.entries(CHIP_CATEGORIES).map(([key, options]) => (
                <div key={key} className="mb-5">
                  <h3 className="text-xs uppercase mb-2">{key}</h3>

                  <div className="flex flex-wrap gap-2">
                    {options.map(opt => {
                      const selected = observaciones[key] === opt;

                      return (
                        <button
                          key={opt}
                          onClick={() => toggleObservation(key, opt)}
                          className={`px-3 py-1 text-xs border ${
                            selected ? "bg-black text-white" : "bg-white"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSave}
                className="w-full mt-4 bg-[#D4AF37] text-white py-3 text-xs uppercase font-semibold"
              >
                Guardar cambios
              </button>
            </section>
          </div>

          {/* DERECHA */}
          <div className="xl:col-span-7 space-y-6">

            {!aiData && (
              <div className="bg-white border p-6 text-center text-sm text-gray-500">
                Guardá los cambios para generar el perfil de IA
              </div>
            )}

            {aiData && (
              <div className="bg-white border p-6">
                <h2 className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Perfil de IA
                </h2>

                <p className="text-sm mt-2">
                  Grupo: {aiData.tipoGrupo} <br />
                  Ocasión: {aiData.ocasion} <br />
                  Edad: {aiData.edades}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}