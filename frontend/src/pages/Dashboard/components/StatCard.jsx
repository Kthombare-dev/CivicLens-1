import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, iconBgClass }) => {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col gap-5 flex-1 min-w-[200px]">
            <div className={`w-12 h-12 ${iconBgClass} rounded-2xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
            <div>
                <div className="text-4xl font-black text-slate-900 tracking-tight leading-none">{value}</div>
                <div className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-wide">{title}</div>
            </div>
        </div>
    );
};

export default StatCard;
