import React from "react";
import {
  ClipboardList,
  Hourglass,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function OfficerStatCards({ stats, isLoading }) {
  // Map API keys to the UI structure. Fallback to 0 if loading/undefined.
  const statCards = [
    {
      label: "Assigned Tasks",
      count: stats?.totalAssigned || 0,
      icon: ClipboardList,
      textColor: "text-slate-700",
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50/80",
      borderColor: "border-emerald-100/50",
    },
    {
      label: "In Progress",
      count: stats?.inProgress || 0,
      icon: Hourglass,
      textColor: "text-slate-700",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/80",
      borderColor: "border-blue-100/50",
    },
    {
      label: "Resolved",
      count: stats?.resolved || 0,
      icon: CheckCircle,
      textColor: "text-slate-700",
      iconColor: "text-teal-600",
      bgColor: "bg-teal-50/80",
      borderColor: "border-teal-100/50",
    },
    {
      label: "Overdue (SLA Missed)",
      count: stats?.overdue || 0,
      icon: AlertCircle,
      textColor: stats?.overdue > 0 ? "text-red-700 font-bold" : "text-slate-700",
      iconColor: stats?.overdue > 0 ? "text-red-600" : "text-amber-500",
      bgColor: stats?.overdue > 0 ? "bg-red-50" : "bg-amber-50/80",
      borderColor: stats?.overdue > 0 ? "border-red-200" : "border-amber-100/50",
    },
    {
      label: "Pending Review",
      count: stats?.pendingReview || 0,
      icon: AlertCircle,
      textColor: "text-slate-700",
      iconColor: "text-slate-500",
      bgColor: "bg-slate-50/80",
      borderColor: "border-slate-200",
    },
  ];

  if (isLoading || !stats) {
     return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse h-[88px]">
                    <div className="flex items-center gap-4 h-full">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-slate-100 rounded w-20"></div>
                            <div className="h-6 bg-slate-100 rounded w-10"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((stat, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex items-center gap-4 group"
        >
          <div
            className={`p-3.5 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${stat.bgColor} ${stat.iconColor} border ${stat.borderColor}`}
          >
            <stat.icon className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-slate-500 font-medium text-xs mb-1 truncate">
              {stat.label}
            </p>
            <h3
              className={`text-2xl font-bold tabular-nums leading-none tracking-tight ${stat.textColor}`}
            >
              {stat.count}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
