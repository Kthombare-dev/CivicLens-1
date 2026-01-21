import React from 'react';
import { Home, Megaphone, FileText, Star, Users, Bell, User } from 'lucide-react';

const Sidebar = ({ activeTab = 'Home', onTabChange }) => {
  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Report Issue', icon: Megaphone, special: true },
    { name: 'My Issues', icon: FileText },
    { name: 'Civic Points', icon: Star },
    { name: 'Public Feed', icon: Users },
  ];

  return (
    <aside className="w-72 fixed inset-y-0 left-0 bg-white border-r border-slate-50 flex flex-col z-50">
      {/* Brand Logo */}
      <div className="p-8 pb-4">
        <img
          src="/CivicLensLogo.png"
          alt="CivicLens Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 px-6 py-6 space-y-4">
        {menuItems.map((item) => {
          if (item.special) {
            return (
              <button
                key={item.name}
                onClick={() => onTabChange(item.name)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg ${activeTab === item.name
                    ? 'bg-[#10b981] text-white'
                    : 'bg-[#10b981] text-white hover:bg-[#059669] shadow-emerald-500/20'
                  }`}
              >
                <item.icon className="w-5.5 h-5.5 text-white" fill="white" />
                <span className="text-[16px]">{item.name}</span>
              </button>
            );
          }

          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onTabChange(item.name)}
              className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-[#f0fdf4] text-[#10b981]'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
              <item.icon className={`w-5.5 h-5.5 ${isActive ? 'text-[#10b981]' : 'text-slate-400'}`} />
              <span className={`text-[16px] font-bold`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Account Section */}
      <div className="px-5 py-8 space-y-6 bg-white border-t border-slate-50/50">
        <div className="space-y-4">
          <h4 className="px-5 text-[12px] font-bold uppercase tracking-wider text-slate-400/80">Account</h4>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-medium">
              <Bell className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              <span className="text-[15px]">Notifications</span>
            </button>
            <button className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-medium">
              <User className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              <span className="text-[15px]">Profile & Settings</span>
            </button>
          </div>
        </div>

        {/* User Card - Rohit Verma */}
        <div className="bg-white p-4 py-5 rounded-[28px] border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-3 ml-1 mr-1">
          <div className="w-10 h-10 bg-[#eef2ff] rounded-full flex items-center justify-center text-[#4f46e5] font-bold text-xs shrink-0">
            RV
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 text-[15px] leading-tight">Rohit Verma</span>
            <span className="text-[12px] font-medium text-slate-400 mt-0.5">Resident, Vijay Nagar</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
