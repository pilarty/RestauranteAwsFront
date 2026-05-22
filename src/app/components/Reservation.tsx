import { useState } from "react";
import { Calendar, Clock, Users, User, Mail, Phone, MessageSquare, ChevronRight, Sparkles, MapPin, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Reservation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    email: "",
    phone: "",
    occasion: "",
    specialRequests: "",
    seatingPreference: "indoor",
  });

  const occasions = ["Casual Dining", "Birthday", "Anniversary", "Business", "Date Night", "Celebration"];
  const timeSlots = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reservation submitted:", formData);
    setStep(4);
  };

  const isStep1Valid = formData.date && formData.time && formData.guests;
  const isStep2Valid = formData.name && formData.email && formData.phone;

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 md:p-8 relative"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560130934-590b85fc08e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwZWxlZ2FudHxlbnwxfHx8fDE3Nzk0MDM2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')` }}
    >
      <div className="absolute inset-0 bg-[#2A1F18]/60 backdrop-blur-[3px]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#FCFBF8] shadow-2xl rounded-sm overflow-hidden border border-[#E8E1D5]"
      >
        {/* Decorative Top Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37] to-[#D4AF37]/40"></div>

        {/* Header */}
        <div className="bg-white px-6 py-10 md:px-10 border-b border-[#E8E1D5] text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-[#D4AF37] text-xs md:text-sm uppercase tracking-[0.4em] font-semibold mb-3">
              BellaVista
            </h2>
            <h1 className="text-3xl md:text-4xl font-serif text-[#4A3B32] mb-4">
              Reserve Your Table
            </h1>
            <p className="text-[#8C7A6B] font-light text-sm md:text-base max-w-sm mx-auto">
              Experience authentic flavors and exceptional service in an elegant setting.
            </p>
          </motion.div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-3 mt-8 max-w-[200px] mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full bg-[#F0EBE1] overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{
                    width: s < step ? '100%' : s === step ? '100%' : '0%',
                    backgroundColor: s <= step ? '#D4AF37' : 'transparent'
                  }}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FCFBF8] min-h-[400px]">
          <form onSubmit={handleSubmit} className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {/* Step 1: Date, Time, Guests */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white border border-[#E8E1D5] rounded-sm px-4 py-3.5 text-[#4A3B32] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Select Time
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => updateField("time", time)}
                          className={`py-3 rounded-sm text-sm transition-all border ${
                            formData.time === time
                              ? 'bg-[#4A3B32] text-[#D4AF37] border-[#4A3B32] shadow-md'
                              : 'bg-white text-[#8C7A6B] border-[#E8E1D5] hover:border-[#D4AF37] hover:text-[#4A3B32]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      Party Size
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
                      {guestOptions.map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => updateField("guests", num)}
                          className={`py-3 rounded-sm text-sm transition-all border ${
                            formData.guests === num
                              ? 'bg-[#4A3B32] text-[#D4AF37] border-[#4A3B32] shadow-md'
                              : 'bg-white text-[#8C7A6B] border-[#E8E1D5] hover:border-[#D4AF37] hover:text-[#4A3B32]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-[#8C7A6B] mt-3 italic">For parties larger than 8, please contact us directly.</p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid}
                      className="w-full bg-[#D4AF37] hover:bg-[#C5A028] disabled:bg-[#E8E1D5] disabled:text-[#A89F91] text-white px-6 py-4 rounded-sm font-semibold tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4 text-[#D4AF37]" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white border border-[#E8E1D5] rounded-sm px-4 py-3.5 text-[#4A3B32] placeholder:text-[#C4BCB3] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-white border border-[#E8E1D5] rounded-sm px-4 py-3.5 text-[#4A3B32] placeholder:text-[#C4BCB3] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-[#E8E1D5] rounded-sm px-4 py-3.5 text-[#4A3B32] placeholder:text-[#C4BCB3] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-14 md:w-auto md:px-6 flex items-center justify-center bg-transparent border border-[#E8E1D5] text-[#8C7A6B] hover:text-[#4A3B32] hover:border-[#4A3B32] py-4 rounded-sm transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden md:inline ml-2 text-xs font-semibold tracking-widest uppercase">Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!isStep2Valid}
                      className="flex-1 bg-[#D4AF37] hover:bg-[#C5A028] disabled:bg-[#E8E1D5] disabled:text-[#A89F91] text-white px-6 py-4 rounded-sm font-semibold tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preferences & Special Requests */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      Occasion (Optional)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                      {occasions.map((occ) => (
                        <button
                          key={occ}
                          type="button"
                          onClick={() => updateField("occasion", formData.occasion === occ ? "" : occ)}
                          className={`py-3 px-4 rounded-sm text-sm transition-all border ${
                            formData.occasion === occ
                              ? 'bg-[#4A3B32] text-[#D4AF37] border-[#4A3B32] shadow-md'
                              : 'bg-white text-[#8C7A6B] border-[#E8E1D5] hover:border-[#D4AF37] hover:text-[#4A3B32]'
                          }`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      Seating Preference
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateField("seatingPreference", "indoor")}
                        className={`py-4 rounded-sm text-sm transition-all border ${
                          formData.seatingPreference === "indoor"
                            ? 'bg-[#4A3B32] text-[#D4AF37] border-[#4A3B32] shadow-md'
                            : 'bg-white text-[#8C7A6B] border-[#E8E1D5] hover:border-[#D4AF37] hover:text-[#4A3B32]'
                        }`}
                      >
                        Indoor Dining
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("seatingPreference", "outdoor")}
                        className={`py-4 rounded-sm text-sm transition-all border ${
                          formData.seatingPreference === "outdoor"
                            ? 'bg-[#4A3B32] text-[#D4AF37] border-[#4A3B32] shadow-md'
                            : 'bg-white text-[#8C7A6B] border-[#E8E1D5] hover:border-[#D4AF37] hover:text-[#4A3B32]'
                        }`}
                      >
                        Outdoor Terrace
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C7A6B] mb-3 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                      Special Requests
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => updateField("specialRequests", e.target.value)}
                      placeholder="Dietary requirements, accessibility needs, allergies, etc."
                      rows={4}
                      className="w-full bg-white border border-[#E8E1D5] rounded-sm px-4 py-3.5 text-[#4A3B32] placeholder:text-[#C4BCB3] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-14 md:w-auto md:px-6 flex items-center justify-center bg-transparent border border-[#E8E1D5] text-[#8C7A6B] hover:text-[#4A3B32] hover:border-[#4A3B32] py-4 rounded-sm transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden md:inline ml-2 text-xs font-semibold tracking-widest uppercase">Back</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#4A3B32] hover:bg-[#322721] text-[#D4AF37] px-6 py-4 rounded-sm font-semibold tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4A3B32]/20"
                    >
                      Confirm Booking
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-6 md:py-10"
                >
                  <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-[#D4AF37]" />
                  </div>

                  <h2 className="text-3xl font-serif text-[#4A3B32] mb-3">Reservation Confirmed</h2>
                  <p className="text-[#8C7A6B] mb-8 max-w-sm mx-auto">
                    We look forward to hosting you. A confirmation email has been sent to <span className="text-[#4A3B32] font-medium">{formData.email}</span>.
                  </p>

                  <div className="bg-white border border-[#E8E1D5] rounded-sm p-6 md:p-8 text-left mb-8 max-w-md mx-auto relative">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4AF37] m-1.5"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4AF37] m-1.5"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4AF37] m-1.5"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4AF37] m-1.5"></div>

                    <h3 className="text-xs font-semibold text-[#8C7A6B] mb-5 uppercase tracking-widest border-b border-[#E8E1D5] pb-3">Reservation Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#8C7A6B]">Date</span>
                        <span className="text-[#4A3B32] font-medium">
                          {formData.date ? new Date(formData.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#8C7A6B]">Time</span>
                        <span className="text-[#4A3B32] font-medium">{formData.time}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#8C7A6B]">Guests</span>
                        <span className="text-[#4A3B32] font-medium">{formData.guests} people</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#8C7A6B]">Name</span>
                        <span className="text-[#4A3B32] font-medium">{formData.name}</span>
                      </div>
                      {formData.occasion && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#8C7A6B]">Occasion</span>
                          <span className="text-[#D4AF37] font-medium">{formData.occasion}</span>
                        </div>
                      )}
                      {formData.seatingPreference && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#8C7A6B]">Seating</span>
                          <span className="text-[#4A3B32] font-medium capitalize">{formData.seatingPreference}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <a
                      href="/"
                      className="flex-1 bg-transparent border border-[#E8E1D5] text-[#4A3B32] hover:bg-[#E8E1D5]/30 px-6 py-4 rounded-sm font-semibold tracking-widest uppercase text-xs transition-all inline-block text-center"
                    >
                      Return Home
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setFormData({
                          date: "",
                          time: "",
                          guests: 2,
                          name: "",
                          email: "",
                          phone: "",
                          occasion: "",
                          specialRequests: "",
                          seatingPreference: "indoor",
                        });
                      }}
                      className="flex-1 bg-[#D4AF37] hover:bg-[#C5A028] text-white px-6 py-4 rounded-sm font-semibold tracking-widest uppercase text-xs transition-all text-center shadow-lg shadow-[#D4AF37]/20"
                    >
                      New Booking
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
