import React from 'react';
import { Home, Megaphone, FileText, Star, Users, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab = 'Home', onTabChange, isOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Report Issue', icon: Megaphone, special: true },
    { name: 'My Issues', icon: FileText },
    { name: 'Public Feed', icon: Users },
  ];

  return (
    <aside className={`w-72 fixed inset-y-0 left-0 bg-white border-r border-slate-50 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Brand Logo */}
      {/* Brand Logo */}
      <div className="flex justify-center px-6 pt-4 pb-0">
        <img
          src="/CivicLensLogo.png"
          alt="CivicLens Logo"
          className="h-28 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 px-6 pt-4 space-y-3">
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
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
            >
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[15px]">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
