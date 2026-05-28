import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  UserCircle
} from "lucide-react";
import { motion } from "motion/react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import logoBellavista from "../assets/logoBellavista.png";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Mapa del local", path: "/" },
    { icon: CalendarDays, label: "Reservas", path: "/reservations" },
    //{ icon: Settings, label: "Configuración", path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#FCFBF8] overflow-hidden text-[#4A3B32] selection:bg-[#D4AF37]/30">
      {/* Sidebar */}
      <nav className="w-20 md:w-64 flex flex-col border-r border-[#E8E1D5] bg-white shrink-0">
        
        {/* Cabecera del Sidebar con tu nueva imagen */}
        <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-[#E8E1D5] gap-3">
          <img 
            src={logoBellavista} 
            alt="BellaVista Logo"
            className="h-18 w-auto object-contain max-w-full md:max-w-[200px]" 
          />

          <h1 className="text-4xl md:text-3xl font-serif text-[#D4AF37]">
            Bellavista
          </h1>
        </div>

        <div className="flex-1 py-8 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex items-center px-3 py-3 md:px-4 md:py-3 rounded-sm transition-all duration-200 group ${
                  isActive
                    ? "text-[#4A3B32]"
                    : "text-[#8C7A6B] hover:text-[#4A3B32] hover:bg-[#F0EBE1]/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-[#F0EBE1] rounded-sm border border-[#E8E1D5]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 md:mr-3 relative z-10 mx-auto md:mx-0 ${
                    isActive ? "text-[#D4AF37]" : ""
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className="relative z-10 hidden md:block font-medium text-sm tracking-wide">
                  {item.label}
                </span>
              </NavLink>
            );
          })}

          <button
            onClick={() => navigate("/pagina-restaurante")}
                className="border border-gray-300 px-5 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:bg-gray-100 transition"
          >
            Modo comensal
          </button>
          <button
            onClick={() => navigate("/pagina-qr")}
                className="border border-gray-300 px-5 py-2 text-xs uppercase tracking-[0.25em] text-gray-700 hover:bg-gray-100 transition"
          >
            QR
          </button>
        </div>

        <div className="p-4 border-t border-[#E8E1D5] bg-[#FCFBF8]/50">
          <button className="w-full flex items-center justify-center md:justify-start px-3 py-2 md:px-4 md:py-3 rounded-sm text-[#8C7A6B] hover:text-[#4A3B32] hover:bg-[#F0EBE1] transition-colors">
            <UserCircle className="w-6 h-6 md:mr-3 text-[#D4AF37]" strokeWidth={1.5} />
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-[#4A3B32]">Alex Camarero</span>
              <span className="text-xs text-[#8C7A6B]">Turno: 14:00 - 22:00</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FCFBF8]">
        {/* Header - Limpio y sin notificaciones */}
        <header className="h-20 flex items-center justify-end px-6 lg:px-10 border-b border-[#E8E1D5] bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-[#4A3B32] uppercase tracking-wider">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-xs text-[#8C7A6B]">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric"
                })}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}