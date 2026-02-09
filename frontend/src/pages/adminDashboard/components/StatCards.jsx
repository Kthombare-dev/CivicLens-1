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
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex items-center gap-5 group hover:translate-y-[-2px] transition-all">
            <div className={`p-4 rounded-xl ${lightColorClasses[color] || 'bg-slate-50'} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{title}</p>
                <h3 className="text-2xl font-black text-slate-800 tabular-nums">{value.toLocaleString()}</h3>
            </div>
        </div>
    );
};

const StatCardsGrid = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={Users}
                color="emerald"
            />
            <StatCard
                title="Complaints"
                value={stats.totalComplaints}
                icon={FileText}
                color="teal"
            />
            <StatCard
                title="Active"
                value={stats.activeComplaints}
                icon={Activity}
                color="indigo"
            />
            <StatCard
                title="Resolved"
                value={stats.resolvedComplaints}
                icon={CheckCircle}
                color="emerald"
            />
            <StatCard
                title="Pending"
                value={stats.pendingComplaints}
                icon={Clock}
                color="amber"
            />
        </div>
    );
};

export default StatCardsGrid;
