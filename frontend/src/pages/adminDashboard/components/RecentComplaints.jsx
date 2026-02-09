import React, { useState } from 'react';
import { Search, MoreHorizontal, ChevronDown } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        'Submitted': 'bg-emerald-50 text-emerald-600',
        'In Progress': 'bg-amber-50 text-amber-600',
        'Resolved': 'bg-blue-50 text-blue-600',
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${styles[status] || 'bg-slate-50 text-slate-600'}`}>
            {status}
        </span>
    );
};

const RecentComplaints = ({ complaints }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-black text-slate-800">Recent Complaints</h3>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search complaints..."
                        className="pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Complaint ID</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <div className="flex items-center gap-1">Status <ChevronDown className="w-3 h-3" /></div>
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {complaints.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="text-xs font-black text-slate-800 tracking-wider font-mono">{item.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-slate-700">{item.user}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-slate-600">{item.category}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-slate-600">{item.location}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.timestamp}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex justify-center">
                <button className="text-emerald-600 font-black uppercase tracking-widest text-[11px] hover:underline">View All Complaints</button>
            </div>
        </div>
    );
};

export default RecentComplaints;
