import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Users, Clock, Edit3,
  Sparkles, ChefHat, Wine, Heart, Info
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const CHIP_CATEGORIES = {
  tipoGrupo: ["Familia", "Pareja", "Amigos", "Negocios", "Solo"],
  estadoAnimo: ["Celebración", "Relajado", "Con prisa", "Romántico", "Formal"],
  ocasion: ["Cumpleaños", "Aniversario", "Cita", "Reunión", "Ninguna"],
  edades: ["20s", "30s", "40s", "50s", "Mixto"],
};

const RECOMENDACIONES = {
  entradas: [
    {
      name: "Bruschetta de trufa",
      match: 98,
      reason: "Coincide con preferencias vegetarianas y platos livianos",
      image: "https://images.unsplash.com/photo-1536739782508-c2388552aad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
    }
  ],
  principales: [
    {
      name: "Wagyu Ribeye",
      match: 95,
      reason: "Suele elegir cortes premium",
      image: "https://images.unsplash.com/photo-1706650616334-97875fae8521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
    }
  ],
  postres: [
    {
      name: "Tiramisú clásico",
      match: 88,
      reason: "Interés en postres con café",
      image: "https://images.unsplash.com/photo-1698688334089-c68105801d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
    }
  ],
  bebidas: [
    {
      name: "Old Fashioned",
      match: 92,
      reason: "Encaja con perfil clásico",
      image: "https://images.unsplash.com/photo-1695605302696-b82d19ce57cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
    },
    {
      name: "Pinot Noir Reserva",
      match: 94,
      reason: "Perfecto para carne Wagyu",
      image: "https://images.unsplash.com/photo-1630369160812-26c7604cbd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
    }
  ]
};

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("todo");

  const [observaciones, setObservaciones] = useState<Record<string, string>>({
    tipoGrupo: "Pareja",
    estadoAnimo: "Romántico",
    ocasion: "Aniversario"
  });

  const toggleObservation = (category: string, value: string) => {
    setObservaciones(prev => ({
      ...prev,
      [category]: prev[category] === value ? "" : value
    }));
  };

  return (
    <div className="h-full flex flex-col -m-4 md:-m-6 lg:-m-10">

      {/* HEADER */}
      <header className="px-6 py-4 border-b border-[#E8E1D5] bg-white/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-2xl font-serif text-[#4A3B32]">
            Mesa {id || "2"}
            <span className="text-[10px] ml-2 px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-sm">
              Comiendo
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs uppercase">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> 2 / 4 personas
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Hace 45 min
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-10 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* IZQUIERDA */}
          <div className="xl:col-span-5 space-y-8">

            {/* OBSERVACIONES */}
            <section className="bg-white border p-6">
              <div className="flex justify-between mb-6">
                <h2 className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Observaciones del mozo
                </h2>
              </div>

              <div className="space-y-6">
                {Object.entries(CHIP_CATEGORIES).map(([key, options]) => (
                  <div key={key}>
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
              </div>
            </section>

          </div>

          {/* DERECHA */}
          <div className="xl:col-span-7 space-y-6">

            {/* PERFIL IA */}
            <div className="bg-white border p-6">
              <h2 className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Perfil de IA
              </h2>

              <p className="text-sm mt-2">
                Pareja en aniversario, cena romántica, ritmo lento, carne premium y vino tinto.
              </p>
            </div>

            {/* RECOMENDACIONES */}
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(RECOMENDACIONES).map(([cat, items]) => {
                if (activeTab !== "todo" && activeTab !== cat) return null;

                return items.map(item => (
                  <div key={item.name} className="border bg-white">
                    <img src={item.image} className="h-40 w-full object-cover" />

                    <div className="p-4">
                      <h3 className="font-serif">{item.name}</h3>
                      <p className="text-xs mt-2">{item.reason}</p>
                    </div>
                  </div>
                ));
              })}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}