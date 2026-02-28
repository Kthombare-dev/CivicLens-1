import React from 'react';
import { Tag, Activity, MapPin, ChevronRight, PieChart, BarChart } from 'lucide-react';

const AnalyticsItem = ({ icon: Icon, title, count, colorClass }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass || 'bg-slate-50 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-600">{title}</span>
        </div>
        <span className="text-sm font-black text-slate-800 tabular-nums">{count}</span>
    </div>
);

const AnalyticsCard = ({ title, icon: Icon, children, onViewAll }) => (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider">{title}</h3>
            </div>
            <button onClick={onViewAll} className="p-1 hover:bg-slate-50 rounded text-slate-400">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
        <div className="divide-y divide-slate-50 flex-1">
            {children}
        </div>
        <button className="w-full mt-6 py-2.5 rounded-xl border-2 border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:border-emerald-100 hover:text-emerald-600 transition-all">
            View Full Report
        </button>
    </div>
);

const EmptyAnalytics = () => (
    <div className="flex flex-col items-center justify-center py-12 text-slate-300">
        <Activity className="w-8 h-8 mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest">No analytics data</p>
    </div>
);

const AnalyticsPanels = ({ analytics }) => {
    if (!analytics) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <AnalyticsCard title="Complaint Category" icon={Tag}><EmptyAnalytics /></AnalyticsCard>
                    <AnalyticsCard title="Status Overview" icon={Activity}><EmptyAnalytics /></AnalyticsCard>
                </div>
                <div className="lg:col-span-4">
                    <AnalyticsCard title="Top Locations" icon={MapPin}><EmptyAnalytics /></AnalyticsCard>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left side: Category and Status Overview */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Complaint Category Count */}
                <AnalyticsCard title="Complaint Category" icon={Tag}>
                    {(analytics.categories || []).length === 0
                        ? <EmptyAnalytics />
                        : analytics.categories.map((cat, i) => (
                            <AnalyticsItem
                                key={i}
                                icon={BarChart}
                                title={cat.name}
                                count={cat.count}
                                colorClass={i % 2 === 0 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}
                            />
                        ))
                    }
                </AnalyticsCard>

                {/* Complaint Status Overview */}
                <AnalyticsCard title="Status Overview" icon={Activity}>
                    {(analytics.statusOverview || []).length === 0
                        ? <EmptyAnalytics />
                        : analytics.statusOverview.map((status, i) => (
                            <AnalyticsItem
                                key={i}
                                icon={PieChart}
                                title={status.name}
                                count={status.count}
                                colorClass={status.name === 'Resolved' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}
                            />
                        ))
                    }
                </AnalyticsCard>
            </div>

            {/* Right side: Top Locations */}
            <div className="lg:col-span-4">
                <AnalyticsCard title="Top Locations" icon={MapPin}>
                    {(analytics.locations || []).length === 0
                        ? <EmptyAnalytics />
                        : analytics.locations.map((loc, i) => (
                            <AnalyticsItem
                                key={i}
                                icon={MapPin}
                                title={loc.name}
                                count={loc.count}
                            />
                        ))
                    }
                </AnalyticsCard>
            </div>
        </div>
    );
};

export default AnalyticsPanels;
