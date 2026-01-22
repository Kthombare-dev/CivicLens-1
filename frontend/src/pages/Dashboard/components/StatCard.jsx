import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, iconBgClass }) => {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col gap-6 flex-1 min-w-[200px]">
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${iconBgClass} rounded-2xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
                <div className="text-4xl font-black text-slate-900 tracking-tight">{value}</div>
            </div>
            <div>
                <div className="text-slate-500 text-base font-semibold">{title}</div>
                {title === "Verifications Done" && (
                    <div className="text-slate-400 text-xs font-medium lowercase">contributions</div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
