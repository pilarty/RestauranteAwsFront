import * as React from "react";
import { useState } from "react";
import { User, Bell, Shield, Paintbrush, LogOut } from "lucide-react";

export function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Paintbrush },
  ];

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8 border-b border-[#E8E1D5] pb-6">
        <h1 className="text-3xl font-serif text-[#4A3B32]">Settings</h1>
        <p className="text-[#8C7A6B] mt-2 text-sm">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-left text-sm font-semibold tracking-wide uppercase ${
                  activeTab === tab.id
                    ? "bg-[#4A3B32] text-[#D4AF37] shadow-sm"
                    : "text-[#8C7A6B] hover:text-[#4A3B32] hover:bg-[#F0EBE1]/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white border border-[#E8E1D5] shadow-sm rounded-sm p-6 md:p-10">
          {activeTab === "profile" && (
            <div className="space-y-8">
              <h2 className="text-xl font-serif text-[#4A3B32]">Profile Information</h2>
              
              <div className="flex items-center gap-6 pb-8 border-b border-[#E8E1D5]">
                <div className="w-20 h-20 rounded-sm bg-[#FCFBF8] border border-[#E8E1D5] flex items-center justify-center text-2xl font-serif font-bold text-[#4A3B32] shadow-sm">
                  AW
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#4A3B32]">Alex Waiter</h3>
                  <p className="text-[#8C7A6B] text-sm font-medium">Senior Server</p>
                  <button className="mt-2 text-xs uppercase tracking-widest text-[#D4AF37] hover:text-[#C5A028] font-bold transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid gap-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B]">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Alex Waiter"
                    className="w-full bg-[#FCFBF8] border border-[#E8E1D5] rounded-sm px-4 py-2.5 text-[#4A3B32] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B]">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="alex@bellavista.test"
                    className="w-full bg-[#FCFBF8] border border-[#E8E1D5] rounded-sm px-4 py-2.5 text-[#4A3B32] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B]">Employee ID</label>
                  <input 
                    type="text" 
                    defaultValue="EMP-8472"
                    disabled
                    className="w-full bg-[#F0EBE1] border border-[#E8E1D5] rounded-sm px-4 py-2.5 text-[#8C7A6B] cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-[#E8E1D5] flex justify-end">
                <button className="px-6 py-3 bg-[#4A3B32] hover:bg-[#322721] text-[#D4AF37] font-semibold tracking-widest uppercase text-xs rounded-sm transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="h-full flex flex-col items-center justify-center text-[#C4BCB3] py-12">
              <SettingsIcon className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-sm">This settings panel is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}