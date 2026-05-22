import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, Users, Clock, Edit3, 
  Sparkles, ChefHat, Wine, Heart, Info
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const CHIP_CATEGORIES = {
  groupType: ["Family", "Couple", "Friends", "Business", "Solo"],
  mood: ["Celebratory", "Relaxed", "Rushed", "Romantic", "Formal"],
  occasion: ["Birthday", "Anniversary", "Date", "Meeting", "None"],
  ages: ["20s", "30s", "40s", "50s", "Mixed"],
};

const RECOMMENDATIONS = {
  starters: [
    { name: "Truffle Bruschetta", match: 98, reason: "Matches 'vegetarian' and 'light' preferences", image: "https://images.unsplash.com/photo-1536739782508-c2388552aad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVzY2hldHRhJTIwYXBwZXRpemVyfGVufDF8fHx8MTc3OTI5MjgxN3ww&ixlib=rb-4.1.0&q=80&w=1080" }
  ],
  mains: [
    { name: "Wagyu Ribeye", match: 95, reason: "Customer usually orders high-end steaks", image: "https://images.unsplash.com/photo-1706650616334-97875fae8521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhayUyMGRpbm5lcnxlbnwxfHx8fDE3NzkyNDEwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" }
  ],
  desserts: [
    { name: "Classic Tiramisu", match: 88, reason: "Expressed interest in coffee-based desserts", image: "https://images.unsplash.com/photo-1698688334089-c68105801d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdSUyMGRlc3NlcnR8ZW58MXx8fHwxNzc5NDAyMDE2fDA&ixlib=rb-4.1.0&q=80&w=1080" }
  ],
  drinks: [
    { name: "Old Fashioned", match: 92, reason: "Matches 'strong' and 'classic' mood", image: "https://images.unsplash.com/photo-1695605302696-b82d19ce57cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGNvY2t0YWlsJTIwZmFuY3l8ZW58MXx8fHwxNzc5NDAyMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Pinot Noir Reserve", match: 94, reason: "Perfect pairing for Wagyu", image: "https://images.unsplash.com/photo-1630369160812-26c7604cbd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB3aW5lJTIwcG91cnxlbnwxfHx8fDE3Nzk0MDIwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080" }
  ]
};

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [observations, setObservations] = useState<Record<string, string>>({
    groupType: "Couple",
    mood: "Romantic",
    occasion: "Anniversary"
  });

  const toggleObservation = (category: string, value: string) => {
    setObservations(prev => ({
      ...prev,
      [category]: prev[category] === value ? "" : value
    }));
  };

  return (
    <div className="h-full flex flex-col -m-4 md:-m-6 lg:-m-10">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#E8E1D5] bg-white/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-2 -ml-2 text-[#8C7A6B] hover:text-[#4A3B32] hover:bg-[#F0EBE1] rounded-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-[#4A3B32] flex items-center gap-3">
              Table {id || "2"}
              <span className="text-[10px] px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-sm font-semibold uppercase tracking-widest">
                Eating
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-[#8C7A6B] uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#D4AF37]" /> 2 / 4 Pax</div>
          <div className="w-px h-4 bg-[#E8E1D5]" />
          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#D4AF37]" /> Seated 45m ago</div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-10 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Session & Observations */}
          <div className="xl:col-span-5 space-y-8">
            {/* Quick Observations */}
            <section className="bg-white border border-[#E8E1D5] rounded-sm shadow-sm p-6">
              <div className="flex items-center justify-between mb-6 border-b border-[#E8E1D5] pb-4">
                <h2 className="text-lg font-serif text-[#4A3B32] flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                  Waiter Observations
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-[#8C7A6B] font-semibold">Auto-saves</span>
              </div>

              <div className="space-y-6">
                {Object.entries(CHIP_CATEGORIES).map(([catKey, options]) => (
                  <div key={catKey}>
                    <h3 className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-widest mb-3">
                      {catKey.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {options.map(opt => {
                        const isSelected = observations[catKey] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleObservation(catKey, opt)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wider uppercase transition-all ${
                              isSelected 
                                ? "bg-[#4A3B32] text-[#D4AF37] border border-[#4A3B32]" 
                                : "bg-white text-[#8C7A6B] border border-[#E8E1D5] hover:border-[#D4AF37] hover:text-[#4A3B32]"
                            }`}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                
                <div>
                  <h3 className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-widest mb-3 mt-8">Notes</h3>
                  <textarea 
                    className="w-full bg-[#FCFBF8] border border-[#E8E1D5] rounded-sm p-3 text-sm text-[#4A3B32] placeholder:text-[#C4BCB3] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] resize-none h-24"
                    placeholder="E.g. Wants to be seated away from the door..."
                  />
                </div>
              </div>
            </section>

            {/* Customer Survey Results */}
            <section className="bg-white border border-[#E8E1D5] rounded-sm shadow-sm p-6">
              <h2 className="text-lg font-serif text-[#4A3B32] flex items-center gap-2 mb-6 border-b border-[#E8E1D5] pb-4">
                <Heart className="w-5 h-5 text-rose-500" />
                QR Survey Results
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FCFBF8] border border-[#E8E1D5] p-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-1">Dietary</div>
                  <div className="font-semibold text-sm text-[#4A3B32]">Gluten-free, No Shellfish</div>
                </div>
                <div className="bg-[#FCFBF8] border border-[#E8E1D5] p-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-1">Hunger Level</div>
                  <div className="font-semibold text-sm text-[#4A3B32]">Starving (3 courses)</div>
                </div>
                <div className="bg-[#FCFBF8] border border-[#E8E1D5] p-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-1">Drink Pref</div>
                  <div className="font-semibold text-sm text-[#4A3B32]">Red Wine, Cocktails</div>
                </div>
                <div className="bg-[#FCFBF8] border border-[#E8E1D5] p-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-1">Pacing</div>
                  <div className="font-semibold text-sm text-[#4A3B32]">Leisurely (No rush)</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: AI Recommendations */}
          <div className="xl:col-span-7 space-y-6">
            <div className="bg-white border border-[#D4AF37]/30 shadow-sm rounded-sm p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#D4AF37]"></div>
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Sparkles className="w-32 h-32 text-[#D4AF37]" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-serif text-[#4A3B32] mb-3 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                  AI Dining Profile
                </h2>
                <p className="text-[#8C7A6B] leading-relaxed max-w-2xl text-sm">
                  Based on their survey and your observations, this couple is here for a romantic anniversary dinner. They prefer a leisurely pace and have a strong preference for high-end meats and complex red wines. <span className="font-semibold text-[#4A3B32]">Avoid shellfish and gluten.</span>
                </p>
              </div>
            </div>

            {/* Recommendations Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: "all", label: "All Suggestions" },
                { id: "starters", label: "Starters", icon: ChefHat },
                { id: "mains", label: "Mains", icon: ChefHat },
                { id: "drinks", label: "Drinks & Pairings", icon: Wine },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-sm text-xs font-semibold tracking-widest uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-[#4A3B32] text-[#D4AF37] shadow-sm"
                      : "bg-white border border-[#E8E1D5] text-[#8C7A6B] hover:text-[#4A3B32] hover:border-[#D4AF37]"
                  }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Recommendation Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(RECOMMENDATIONS).map(([category, items]) => {
                if (activeTab !== "all" && activeTab !== category) return null;
                
                return items.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={item.name}
                    className="bg-white border border-[#E8E1D5] shadow-sm rounded-sm overflow-hidden group hover:border-[#D4AF37] transition-colors"
                  >
                    <div className="h-48 w-full relative overflow-hidden">
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-sm border border-[#D4AF37]/30 flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-[10px] font-bold text-[#4A3B32] uppercase tracking-widest">{item.match}% Match</span>
                      </div>
                      <div className="absolute top-3 left-3 bg-[#4A3B32]/90 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase border border-[#322721]/50 shadow-sm">
                        {category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-serif text-[#4A3B32] mb-3">{item.name}</h3>
                      <div className="flex items-start gap-2 bg-[#FCFBF8] p-3 rounded-sm border border-[#E8E1D5]">
                        <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <p className="text-xs text-[#8C7A6B] leading-snug">{item.reason}</p>
                      </div>
                      <div className="mt-5 flex gap-3">
                        <button className="flex-1 bg-white border border-[#4A3B32] hover:bg-[#F0EBE1] text-[#4A3B32] py-2.5 rounded-sm font-semibold text-xs tracking-widest uppercase transition-colors">
                          Suggest
                        </button>
                        <button className="flex-1 bg-[#4A3B32] hover:bg-[#322721] text-[#D4AF37] py-2.5 rounded-sm font-semibold text-xs tracking-widest uppercase transition-colors shadow-sm">
                          Add to Order
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}