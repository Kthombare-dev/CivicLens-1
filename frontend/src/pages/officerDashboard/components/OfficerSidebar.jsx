import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  Bell,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OfficerSidebar({
  isSidebarOpen,
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "resolved", name: "Resolved Complaints", icon: CheckSquare },
    { id: "performance", name: "My Performance", icon: TrendingUp },
    { id: "notifications", name: "Notifications", icon: Bell, badge: "2" },
    { id: "profile", name: "Profile", icon: UserIcon },
  ];

  return (
    <aside
      className={`w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSidebarOpen
          ? "translate-x-0 cursor-default shadow-2xl lg:shadow-none"
          : "-translate-x-full lg:translate-x-0"
      }`}
      aria-label="Sidebar Navigation"
    >
      <div className="flex justify-center px-6 pt-6 pb-2">
        <img
          src="/CivicLensLogo.png"
          alt="CivicLens Logo"
          className="h-24 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 px-4 pt-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                isActive
                  ? "bg-emerald-50/50 text-emerald-700 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive
                    ? "text-emerald-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
                strokeWidth={isActive ? 2 : 1.75}
              />
              <span className="text-sm flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center justify-center min-w-[1.25rem]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-6 bg-slate-50/50 border-t border-slate-100 mt-auto">
        <h4 className="px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Account
        </h4>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900 transition-all font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
            <UserIcon
              className="w-4.5 h-4.5 text-slate-400"
              strokeWidth={1.75}
            />
            <span>Profile & Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          >
            <LogOut
              className="w-4.5 h-4.5 text-red-500/80"
              strokeWidth={1.75}
            />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
