import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ImpactChart = ({ data = [] }) => {
    // Transform API data to chart format
    const chartData = data.length > 0 
        ? data.map(week => ({
            name: week.week,
            value1: week.complaintsCreated || 0,
            value2: week.complaintsVerified || 0
        }))
        : [
            { name: 'Week 1', value1: 0, value2: 0 },
            { name: 'Week 2', value1: 0, value2: 0 },
            { name: 'Week 3', value1: 0, value2: 0 },
            { name: 'Week 4', value1: 0, value2: 0 }
        ];

    // Calculate max value for Y-axis
    const maxValue = Math.max(
        ...chartData.map(d => Math.max(d.value1, d.value2)),
        5
    );
    return (
        <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40">
            <div className="mb-10">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your Impact</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Complaints Over 4 Weeks</p>
            </div>

            <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 700 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 700 }}
                            domain={[0, maxValue]}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '20px',
                                border: 'none',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                padding: '12px 16px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value1"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 8, strokeWidth: 0, fill: '#fbbf24' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value2"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ImpactChart;
