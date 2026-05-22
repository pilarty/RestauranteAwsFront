import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Users, Clock, CreditCard } from "lucide-react";

type TableStatus = "available" | "occupied" | "reserved" | "waiting_order" | "eating" | "waiting_check";

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  shape: "rect" | "circle";
  x: number;
  y: number;
  w: number;
  h: number;
  timeSeated?: string;
  pax?: number;
}

const mockTables: Table[] = [
  { id: "1", number: "1", capacity: 2, status: "available", shape: "circle", x: 1, y: 1, w: 2, h: 2 },
  { id: "2", number: "2", capacity: 4, status: "occupied", shape: "rect", x: 4, y: 1, w: 3, h: 2, timeSeated: "45m", pax: 3 },
  { id: "3", number: "3", capacity: 4, status: "eating", shape: "rect", x: 8, y: 1, w: 3, h: 2, timeSeated: "1h 15m", pax: 4 },
  { id: "4", number: "4", capacity: 6, status: "waiting_check", shape: "rect", x: 1, y: 4, w: 4, h: 2, timeSeated: "1h 45m", pax: 6 },
  { id: "5", number: "5", capacity: 2, status: "waiting_order", shape: "circle", x: 6, y: 4, w: 2, h: 2, timeSeated: "5m", pax: 2 },
  { id: "6", number: "6", capacity: 2, status: "reserved", shape: "circle", x: 9, y: 4, w: 2, h: 2 },
  { id: "7", number: "7", capacity: 8, status: "available", shape: "rect", x: 1, y: 7, w: 5, h: 3 },
  { id: "8", number: "8", capacity: 4, status: "eating", shape: "rect", x: 7, y: 7, w: 4, h: 3, timeSeated: "30m", pax: 4 },
];

const statusConfig: Record<TableStatus, { color: string; label: string; ring: string }> = {
  available: { color: "bg-white text-[#8C7A6B] border-[#E8E1D5]", label: "Available", ring: "ring-[#D4AF37]/50" },
  occupied: { color: "bg-[#F0EBE1] text-[#4A3B32] border-[#C4BCB3]", label: "Occupied", ring: "ring-[#4A3B32]/30" },
  reserved: { color: "bg-[#D4AF37]/10 text-[#C5A028] border-[#D4AF37]/30", label: "Reserved", ring: "ring-[#D4AF37]/50" },
  waiting_order: { color: "bg-orange-50 text-orange-600 border-orange-200", label: "Waiting Order", ring: "ring-orange-500/50" },
  eating: { color: "bg-teal-50 text-teal-700 border-teal-200", label: "Eating", ring: "ring-teal-500/50" },
  waiting_check: { color: "bg-[#4A3B32] text-white border-[#322721]", label: "Waiting Check", ring: "ring-[#4A3B32]/50" },
};

export function TableMap() {
  const navigate = useNavigate();
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#4A3B32] tracking-tight">Floor Map</h1>
          <p className="text-[#8C7A6B] mt-1 text-sm">Live restaurant status overview</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="flex items-center gap-2 whitespace-nowrap bg-white px-3 py-1.5 rounded-sm border border-[#E8E1D5]">
            <div className={`w-3 h-3 rounded-full ${config.color.split(' ')[0]} border ${config.color.split(' ')[2]}`} />
            <span className="text-xs uppercase tracking-widest text-[#4A3B32] font-semibold">{config.label}</span>
            <span className="text-xs text-[#8C7A6B] font-medium ml-1">
              ({mockTables.filter(t => t.status === status).length})
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-white border border-[#E8E1D5] rounded-sm p-8 relative overflow-auto shadow-sm">
        <div 
          className="relative w-full min-w-[800px] h-[600px]"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "repeat(10, 1fr)",
            gap: "1rem"
          }}
        >
          {mockTables.map((table) => {
            const isCircle = table.shape === "circle";
            const config = statusConfig[table.status];
            
            return (
              <motion.button
                key={table.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/table/${table.id}`)}
                className={`relative flex flex-col items-center justify-center border transition-all ${config.color} hover:ring-2 ${config.ring} shadow-sm group`}
                style={{
                  gridColumn: `${table.x} / span ${table.w}`,
                  gridRow: `${table.y} / span ${table.h}`,
                  borderRadius: isCircle ? "50%" : "8px",
                }}
              >
                <span className="text-2xl font-serif font-semibold opacity-90">{table.number}</span>
                
                {table.status !== "available" && table.status !== "reserved" && (
                  <div className="absolute -bottom-3 flex items-center justify-center gap-2 bg-white border border-[#E8E1D5] px-3 py-1 rounded-sm shadow-md">
                    <div className="flex items-center gap-1 text-xs font-medium text-[#4A3B32]">
                      <Users className="w-3 h-3 text-[#D4AF37]" />
                      {table.pax}/{table.capacity}
                    </div>
                    <div className="w-px h-3 bg-[#E8E1D5]" />
                    <div className="flex items-center gap-1 text-xs font-medium text-[#4A3B32]">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      {table.timeSeated}
                    </div>
                  </div>
                )}
                
                {table.status === "reserved" && (
                  <div className="absolute -bottom-3 bg-[#D4AF37] border border-[#C5A028] px-3 py-1 rounded-sm text-xs text-white font-medium whitespace-nowrap shadow-md tracking-wide">
                    19:30 - Smith (4)
                  </div>
                )}
                
                {table.status === "waiting_check" && (
                  <div className="absolute top-2 right-2 animate-pulse bg-white/20 p-1 rounded-full backdrop-blur-sm">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}