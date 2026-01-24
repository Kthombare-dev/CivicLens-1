import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, iconBgClass }) => {
    return (
        <div className="bg-white p-7 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100/60 flex flex-col gap-5 flex-1 min-w-[200px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 ${iconBgClass} rounded-2xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
            <div>
                <div className="text-[40px] font-black text-slate-800 tracking-tighter leading-none">{value}</div>
                <div className="text-slate-400 text-[13px] font-bold mt-2 uppercase tracking-wide">{title}</div>
            </div>
        </div>
    );
};

export default StatCard;
