import React from 'react';
import { ChevronDown } from 'lucide-react';

const issues = [
    { id: 1, name: 'Pothole on Main Road', status: 'Pending', color: 'Gold', time: '1 day ago', icon: 'https://cdn-icons-png.flaticon.com/128/2329/2329865.png' },
    { id: 2, name: 'Overflowing Garbage Bin', status: 'Verified and Closed', color: 'Green', time: '3 days ago', icon: 'https://cdn-icons-png.flaticon.com/128/3159/3159066.png' },
    { id: 3, name: 'Street Light Not Working', status: 'In Progress', color: 'Blue', time: '5 days ago', icon: 'https://cdn-icons-png.flaticon.com/128/2987/2987996.png' },
    { id: 4, name: 'Sewage Overflow', status: 'Verified and Closed', color: 'Green', time: '7 days ago', icon: 'https://cdn-icons-png.flaticon.com/128/4005/4005663.png' },
];

const getStatusStyles = (color) => {
    switch (color) {
        case 'Gold': return 'bg-[#fffbeb] text-[#f59e0b]';
        case 'Blue': return 'bg-[#eff6ff] text-[#3b82f6]';
        case 'Green': return 'bg-[#ecfdf5] text-[#10b981]';
        default: return 'bg-slate-100 text-slate-500';
    }
};

const getDotColor = (color) => {
    switch (color) {
        case 'Gold': return 'bg-[#f59e0b]';
        case 'Blue': return 'bg-[#3b82f6]';
        case 'Green': return 'bg-[#10b981]';
        default: return 'bg-slate-500';
    }
};

const IssuesTable = () => {
    return (
        <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Track Your Issues</h3>
                <button className="text-slate-400 font-bold hover:text-emerald-600 transition-colors text-sm">View all</button>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-12 pb-6 text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] px-4 border-b border-slate-50">
                    <div className="col-span-6">Issue</div>
                    <div className="col-span-3 text-center">Status</div>
                    <div className="col-span-3 text-right flex items-center justify-end gap-1 cursor-pointer hover:text-slate-600">
                        Days update <ChevronDown className="w-3 h-3" />
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {issues.map((issue) => (
                        <div key={issue.id} className="grid grid-cols-12 items-center p-4 hover:bg-slate-50/80 rounded-3xl transition-all group">
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <img src={issue.icon} alt="" className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100" />
                                </div>
                                <span className="font-bold text-slate-700">{issue.name}</span>
                            </div>
                            <div className="col-span-3 flex justify-center">
                                <div className={`flex items-center gap-2.5 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider ${getStatusStyles(issue.color)}`}>
                                    <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(issue.color)}`}></span>
                                    {issue.status}
                                </div>
                            </div>
                            <div className="col-span-3 text-right text-slate-400 text-sm font-bold">
                                {issue.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IssuesTable;
