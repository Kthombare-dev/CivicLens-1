import React from "react";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function OfficerTopNav({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-slate-100 transition-all">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100/80 rounded-xl transition-colors focus:ring-2 focus:ring-emerald-500/20 outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Officer{" "}
          <span className="text-emerald-600 font-semibold">
            {title || "Dashboard"}
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <button
          className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-full transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none"
          aria-label="View Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200/60">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.name || "Michael Brown"}
            </p>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
              {user?.department || "Department Officer"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Michael Brown"}`}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
