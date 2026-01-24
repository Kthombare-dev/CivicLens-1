import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Week 1', value1: 1, value2: 2 },
    { name: 'Week 2', value1: 2, value2: 3.5 },
    { name: 'Week 3', value1: 1.5, value2: 2 },
    { name: 'Week 4', value1: 2.5, value2: 4 },
    { name: 'Mon', value1: 3, value2: 4.8 },
];

const ImpactChart = () => {
    return (
        <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40">
            <div className="mb-10">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your Impact</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Complaints OVEER 4 Weeks</p>
            </div>

            <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
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
                            domain={[0, 5]}
                            ticks={[0, 1, 2, 3, 4, 5]}
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
