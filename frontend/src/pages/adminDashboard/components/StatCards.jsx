import React from 'react';
import { Users, FileText, Activity, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    const colorClasses = {
        emerald: 'bg-emerald-500 text-white',
        teal: 'bg-teal-500 text-white',
        indigo: 'bg-indigo-500 text-white',
        amber: 'bg-amber-500 text-white',
        rose: 'bg-rose-500 text-white',
    };

    const lightColorClasses = {
        emerald: 'bg-emerald-50 text-emerald-600',
        teal: 'bg-teal-50 text-teal-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <div className={`p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group hover:shadow-lg ${lightColorClasses[color] || 'bg-white border-slate-50'}`}>
            <div className={`p-4 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-0.5 whitespace-nowrap">{title}</p>
                <h3 className="text-xl font-black text-slate-800 tabular-nums leading-none">{value.toLocaleString()}</h3>
            </div>
        </div>
    );
};

const StatCardsGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 mb-10">
            <StatCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon={Users}
                color="emerald"
            />
            <StatCard
                title="Complaints"
                value={stats?.totalComplaints || 0}
                icon={FileText}
                color="teal"
            />
            <StatCard
                title="Active"
                value={stats?.activeComplaints || 0}
                icon={Activity}
                color="indigo"
            />
            <StatCard
                title="Resolved"
                value={stats?.resolvedComplaints || 0}
                icon={CheckCircle}
                color="emerald"
            />
            <StatCard
                title="Pending"
                value={stats?.pendingComplaints || 0}
                icon={Clock}
                color="amber"
            />
        </div>
    );
};

export default StatCardsGrid;
