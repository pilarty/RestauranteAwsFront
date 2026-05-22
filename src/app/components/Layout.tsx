import { Outlet, NavLink, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings,
  Bell,
  UserCircle
} from "lucide-react";
import { motion } from "motion/react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Floor Map", path: "/" },
    { icon: CalendarDays, label: "Reservations", path: "/reservations" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: UserCircle, label: "Customer View", path: "/book" },
  ];

  return (
    <div className="flex h-screen bg-[#FCFBF8] overflow-hidden text-[#4A3B32] selection:bg-[#D4AF37]/30">
      {/* Sidebar */}
      <nav className="w-20 md:w-64 flex flex-col border-r border-[#E8E1D5] bg-white shrink-0">
        <div className="h-20 flex items-center justify-center md:justify-start md:px-8 border-b border-[#E8E1D5]">
          <div className="w-8 h-8 rounded-sm bg-[#4A3B32] flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-[#D4AF37] font-serif text-lg font-bold leading-none">B</span>
          </div>
          <span className="ml-3 font-serif text-xl text-[#4A3B32] hidden md:block tracking-wide">
            BellaVista
          </span>
        </div>

        <div className="flex-1 py-8 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
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
                  className={`w-5 h-5 md:mr-3 relative z-10 mx-auto md:mx-0 ${isActive ? 'text-[#D4AF37]' : ''}`} 
                  strokeWidth={isActive ? 2 : 1.5} 
                />
                <span className="relative z-10 hidden md:block font-medium text-sm tracking-wide">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#E8E1D5] bg-[#FCFBF8]/50">
          <button className="w-full flex items-center justify-center md:justify-start px-3 py-2 md:px-4 md:py-3 rounded-sm text-[#8C7A6B] hover:text-[#4A3B32] hover:bg-[#F0EBE1] transition-colors">
            <UserCircle className="w-6 h-6 md:mr-3 text-[#D4AF37]" strokeWidth={1.5} />
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-[#4A3B32]">Alex Waiter</span>
              <span className="text-xs text-[#8C7A6B]">Shift: 14:00 - 22:00</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FCFBF8]">
        <header className="h-20 flex items-center justify-end px-6 lg:px-10 border-b border-[#E8E1D5] bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-[#8C7A6B] hover:text-[#4A3B32] transition-colors rounded-full hover:bg-[#F0EBE1]">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full ring-2 ring-white" />
            </button>
            <div className="h-8 w-px bg-[#E8E1D5]" />
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-[#4A3B32] uppercase tracking-wider">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div className="text-xs text-[#8C7A6B]">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</div>
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