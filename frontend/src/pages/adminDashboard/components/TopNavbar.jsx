import React from 'react';
import { Bell, User, Menu } from 'lucide-react';

const TopNavbar = ({ title, onMenuClick }) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
                    <Menu className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">
                    Admin <span className="text-emerald-600">Dashboard</span>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                        2
                    </span>
                </button>

                {/* Profile
                <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">Admin</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super User</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-emerald-50 overflow-hidden">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                            alt="Admin"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div> */}
            </div>
        </header>
    );
};

export default TopNavbar;
