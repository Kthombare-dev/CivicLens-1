import React, { useState } from 'react';
import { Home, Megaphone, FileText, Star, Users, Bell, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeTab = 'Home', onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Report Issue', icon: Megaphone, special: true },
    { name: 'My Issues', icon: FileText },
    { name: 'Public Feed', icon: Users },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Brand Logo */}
      <div className="px-8 pt-8 pb-2">
        <img
          src="/CivicLensLogo.png"
          alt="CivicLens Logo"
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Top Navigation */}
      <nav className="px-6 py-4 space-y-2">
        {menuItems.map((item) => {
          if (item.special) {
            return (
              <button
                key={item.name}
                onClick={() => {
                  onTabChange(item.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-sm ${activeTab === item.name
                  ? 'bg-[#059669] text-white'
                  : 'bg-[#10b981] text-white hover:bg-[#059669]'
                  }`}
              >
                <item.icon className="w-5.5 h-5.5 text-white" />
                <span className="text-[15px]">{item.name}</span>
              </button>
            );
          }

          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                onTabChange(item.name);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 ${isActive
                ? 'bg-[#f0fdf4] text-[#10b981]'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
              <item.icon className={`w-5.5 h-5.5 transition-colors ${isActive ? 'text-[#10b981]' : 'text-slate-400'}`} />
              <span className={`text-[15px] font-bold`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Spacing in the middle */}
      <div className="flex-1"></div>

      {/* Bottom Account Section */}
      <div className="px-6 py-4 border-t border-slate-50 space-y-4">
        <div className="space-y-2">
          <h4 className="px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Account</h4>
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all font-semibold">
              <Bell className="w-5 h-5 opacity-60" strokeWidth={2} />
              <span className="text-[14px]">Notifications</span>
            </button>
            <button className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all font-semibold">
              <User className="w-5 h-5 opacity-60" strokeWidth={2} />
              <span className="text-[14px]">Profile & Settings</span>
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-white p-3 py-4 rounded-[24px] border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#eef2ff] rounded-full flex items-center justify-center text-[#4f46e5] font-bold text-xs shrink-0">
            RV
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-800 text-[14px] leading-tight">Rohit Verma</span>
            <span className="text-[11px] font-medium text-slate-400 mt-0.5">Resident, Vijay Nagar</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-6 right-6 z-[60]">
        <button
          onClick={toggleSidebar}
          className="p-3 bg-white rounded-2xl shadow-lg border border-slate-100 text-slate-600 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex w-72 fixed inset-y-0 left-0 border-r border-slate-50 z-50 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[55]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-[56] shadow-2xl border-r border-slate-100"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
