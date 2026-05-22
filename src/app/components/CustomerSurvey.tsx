import { useState } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Wine, Coffee, Utensils, Heart } from "lucide-react";
import { Toaster, toast } from "sonner";

const steps = [
  { id: "welcome", title: "Welcome to BellaVista" },
  { id: "dietary", title: "Any allergies or dietary preferences?" },
  { id: "drinks", title: "What are we drinking tonight?" },
  { id: "hunger", title: "How hungry is the table?" },
  { id: "done", title: "All set!" }
];

export function CustomerSurvey() {
  const { tableId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({
    dietary: [],
    drinks: [],
    hunger: []
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      toast.success("Preferences saved! Your waiter has been notified.");
    }
  };

  const toggleSelection = (category: string, value: string) => {
    setSelections(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 text-center mt-12">
            <div className="w-16 h-16 mx-auto bg-[#4A3B32] flex items-center justify-center shadow-lg mb-8 rounded-sm">
              <span className="text-[#D4AF37] font-serif text-3xl font-bold leading-none">B</span>
            </div>
            <h1 className="text-4xl font-serif text-[#4A3B32] tracking-tight">
              Table {tableId || "7"}
            </h1>
            <p className="text-[#8C7A6B] max-w-xs mx-auto text-base leading-relaxed font-light">
              Before you order, let's personalize your dining experience. It only takes a moment.
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-3 mt-4">
            {["Vegetarian", "Vegan", "Gluten-Free", "Nut Allergy", "Dairy-Free", "None / Eat Everything"].map(opt => {
              const selected = selections.dietary.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleSelection("dietary", opt)}
                  className={`w-full flex items-center justify-between p-4 rounded-sm border transition-all ${
                    selected 
                      ? "bg-[#FCFBF8] border-[#D4AF37] text-[#4A3B32] shadow-sm" 
                      : "bg-white border-[#E8E1D5] text-[#8C7A6B] hover:border-[#D4AF37]"
                  }`}
                >
                  <span className={`font-medium ${selected ? 'font-semibold' : ''}`}>{opt}</span>
                  {selected && <Check className="w-5 h-5 text-[#D4AF37]" />}
                </button>
              )
            })}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: "Red Wine", icon: Wine },
              { label: "White Wine", icon: Wine },
              { label: "Cocktails", icon: Coffee },
              { label: "Beer", icon: Utensils },
              { label: "Non-Alcoholic", icon: Heart },
              { label: "Water Only", icon: Heart },
            ].map(opt => {
              const selected = selections.drinks.includes(opt.label);
              return (
                <button
                  key={opt.label}
                  onClick={() => toggleSelection("drinks", opt.label)}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-sm border transition-all ${
                    selected 
                      ? "bg-[#FCFBF8] border-[#D4AF37] text-[#4A3B32] shadow-sm" 
                      : "bg-white border-[#E8E1D5] text-[#8C7A6B] hover:border-[#D4AF37]"
                  }`}
                >
                  <opt.icon className={`w-8 h-8 ${selected ? 'text-[#D4AF37]' : ''}`} strokeWidth={1.5} />
                  <span className={`text-sm ${selected ? 'font-semibold' : 'font-medium'}`}>{opt.label}</span>
                </button>
              )
            })}
          </div>
        );
      case 3:
        return (
          <div className="space-y-3 mt-4">
            {[
              { label: "Just a light bite", desc: "Sharing a few starters" },
              { label: "Normal dinner", desc: "Main course and maybe dessert" },
              { label: "Starving!", desc: "Bring on the 3-course meal" },
              { label: "Drinks mainly", desc: "Focusing on the bar menu" },
            ].map(opt => {
              const selected = selections.hunger.includes(opt.label);
              return (
                <button
                  key={opt.label}
                  onClick={() => {
                    setSelections(p => ({ ...p, hunger: [opt.label] })); // single select
                  }}
                  className={`w-full text-left p-5 rounded-sm border transition-all ${
                    selected 
                      ? "bg-[#FCFBF8] border-[#D4AF37] shadow-sm" 
                      : "bg-white border-[#E8E1D5] hover:border-[#D4AF37]"
                  }`}
                >
                  <h3 className={`font-serif text-lg mb-1 ${selected ? "text-[#4A3B32]" : "text-[#8C7A6B]"}`}>
                    {opt.label}
                  </h3>
                  <p className="text-[#8C7A6B] text-sm font-light">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        );
      case 4:
        return (
          <div className="text-center mt-16 space-y-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-20 h-20 mx-auto rounded-full bg-[#FCFBF8] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]"
            >
              <Check className="w-8 h-8" />
            </motion.div>
            <h2 className="text-2xl font-serif text-[#4A3B32]">Your profile is ready</h2>
            <p className="text-[#8C7A6B] max-w-xs mx-auto text-sm font-light">
              Your waiter will review your preferences and provide personalized recommendations shortly.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#4A3B32] font-sans selection:bg-[#D4AF37]/30 flex flex-col relative overflow-hidden">
      <Toaster theme="light" position="bottom-center" />
      
      {/* Decorative top line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37] to-[#D4AF37]/40"></div>
      
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-6 md:p-8 relative">
        {/* Progress bar */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="mb-10 z-10 relative">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#8C7A6B] font-bold mb-3">
              <span>Step {currentStep} of {steps.length - 2}</span>
            </div>
            <div className="h-1 w-full bg-[#E8E1D5] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#D4AF37]"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 2)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <h2 className="text-2xl font-serif text-[#4A3B32] mb-8 text-center">
                  {steps[currentStep].title}
                </h2>
              )}
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {currentStep < steps.length - 1 && (
          <div className="mt-12 z-10 relative">
            <button
              onClick={handleNext}
              className="w-full bg-[#4A3B32] hover:bg-[#322721] text-[#D4AF37] py-4 rounded-sm font-semibold tracking-widest uppercase text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {currentStep === 0 ? "Let's Begin" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}