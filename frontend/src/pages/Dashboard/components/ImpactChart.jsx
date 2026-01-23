import React from 'react';
import {
    PieChart, Pie, Cell,
    BarChart, Bar,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend
} from 'recharts';

// 1. Issue Status Distribution Data
const statusData = [
    { name: 'Pending', value: 25, color: '#f59e0b' },
    { name: 'In Progress', value: 35, color: '#3b82f6' },
    { name: 'Verified & Closed', value: 40, color: '#10b981' },
];

const categoryData = [
    { category: 'Potholes', count: 12, color: '#3b82f6' },
    { category: 'Waste', count: 8, color: '#10b981' },
    { category: 'Lights', count: 5, color: '#f59e0b' },
    { category: 'Water', count: 7, color: '#6366f1' },
];

// 3. Civic Points Progress Data
const pointsData = [
    { name: 'Week 1', reporting: 40, verification: 20 },
    { name: 'Week 2', reporting: 85, verification: 45 },
    { name: 'Week 3', reporting: 110, verification: 90 },
    { name: 'Week 4', reporting: 150, verification: 140 },
    { name: 'Current', reporting: 180, verification: 195 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-50">
                <p className="font-bold text-slate-800 mb-1">{label || payload[0].name || payload[0].payload.category}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm font-medium" style={{ color: entry.color || entry.fill }}>
                        {entry.name || 'Count'}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const ImpactChart = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
                {/* 1. Frequent Categories (Pie Chart - Replacing Issue Status) */}
                <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40">
                    <div className="mb-6">
                        <h4 className="text-xl font-bold text-slate-800">Frequent Categories</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Distribution of Issues</p>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="category"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-slate-500 font-semibold text-xs ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. Civic Points Progress (Area Chart) */}
            <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight">Civic Points Progress</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Points Growth Over Time</p>
                    </div>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={pointsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorReporting" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorVerification" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
                            <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                            <Area
                                type="monotone"
                                dataKey="reporting"
                                name="Reporting Points"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorReporting)"
                            />
                            <Area
                                type="monotone"
                                dataKey="verification"
                                name="Verification Points"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorVerification)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ImpactChart;
