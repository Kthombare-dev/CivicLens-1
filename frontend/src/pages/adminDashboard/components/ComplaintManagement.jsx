import React, { useState } from 'react';
import { Search, ChevronDown, Filter, MoreHorizontal, X } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        'Submitted': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'New': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
        'Assigned': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Resolved': 'bg-slate-100 text-slate-600 border-slate-200',
    };

    return (
        <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border transition-all ${styles[status === 'Submitted' ? 'New' : status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            {status === 'Submitted' ? 'New' : status}
        </span>
    );
};

const ComplaintManagement = ({ complaints, onAssignClick, onUpdateStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [activeActionId, setActiveActionId] = useState(null);

    const categories = ['All', 'Pothole', 'Garbage', 'Streetlight', 'Water / Sanitation'];
    const statusOptions = ['All', 'New', 'In Progress', 'Assigned', 'Resolved'];

    const filteredComplaints = complaints.filter(item => {
        const matchesCategory = selectedCategory === 'All' ||
            item.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0]);

        const statusToMatch = (item.status === 'Submitted' || item.status === 'New') ? 'New' : item.status;
        const matchesStatus = selectedStatus === 'All' ||
            statusToMatch.toLowerCase() === selectedStatus.toLowerCase();

        const matchesSearch =
            item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.assignedTo && item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesCategory && matchesStatus && matchesSearch;
    });

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
            {/* Header / Filters */}
            <div className="p-8 border-b border-slate-50 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Complaint Management</h3>

                    <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                        {/* Category Dropdown */}
                        <div className="relative min-w-[160px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-transparent border-none text-xs font-bold text-slate-500 appearance-none cursor-pointer focus:ring-0"
                            >
                                <option value="All">All Categories</option>
                                {categories.filter(c => c !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative min-w-[160px]">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-transparent border-none text-xs font-bold text-slate-500 appearance-none cursor-pointer focus:ring-0"
                            >
                                <option value="All">All Statuses</option>
                                {statusOptions.filter(s => s !== 'All').map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>

                    </div>
                </div>

                {/* Search Row - Moved Below and Added Clear Icon on Left */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSearchTerm('')}
                        className={`p-1.5 rounded-lg transition-all ${searchTerm
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 opacity-100'
                                : 'text-slate-200 opacity-0 pointer-events-none'
                            }`}
                        title="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search keyword"
                            className="pl-8 pr-4 py-2 bg-transparent border-none text-xs font-bold text-slate-500 focus:ring-0 w-full placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Area with Scrolling */}
            <div className="overflow-x-auto max-h-[700px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-8 py-6 w-12">
                                <input type="checkbox" className="rounded border-slate-200 text-emerald-600 focus:ring-emerald-500" />
                            </th>
                            <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                            <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <div className="flex items-center gap-1">
                                    Category <ChevronDown className="w-3 h-3 text-slate-300" />
                                </div>
                            </th>
                            <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</th>
                            <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 lg:table-cell hidden">Assigned To</th>
                            <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredComplaints.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <input type="checkbox" className="rounded border-slate-200 text-emerald-600 focus:ring-emerald-500" />
                                </td>
                                <td className="px-4 py-6">
                                    <span className="text-[13px] font-black text-slate-800 tracking-wider font-mono flex flex-col">
                                        {item.id.split('-')[0]}-
                                        <span>{item.id.split('-')[1]}</span>
                                    </span>
                                </td>
                                <td className="px-4 py-6">
                                    <span className="text-[13px] font-bold text-slate-600 leading-tight block max-w-[120px]">{item.category}</span>
                                </td>
                                <td className="px-4 py-6">
                                    <span className="text-[13px] font-bold text-slate-600">{item.location}</span>
                                </td>
                                <td className="px-4 py-6 lg:table-cell hidden">
                                    <span className="text-[13px] font-black text-slate-400">{item.assignedTo || 'None'}</span>
                                </td>
                                <td className="px-4 py-6">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-4 py-6">
                                    {item.status === 'New' || item.status === 'Submitted' ? (
                                        <button
                                            onClick={() => onAssignClick(item)}
                                            className="px-8 py-2.5 bg-[#0B4D34] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#073926] transition-all shadow-lg shadow-emerald-900/10"
                                        >
                                            Assign
                                        </button>
                                    ) : (
                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveActionId(activeActionId === item.id ? null : item.id)}
                                                className="px-6 py-2.5 bg-slate-100/50 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-between gap-4 min-w-[140px]"
                                            >
                                                Change Status
                                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeActionId === item.id ? 'rotate-180' : ''}`} />
                                            </button>

                                            {activeActionId === item.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveActionId(null)} />
                                                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20">
                                                        {statusOptions.filter(s => s !== 'All' && s !== 'New').map(s => (
                                                            <button
                                                                key={s}
                                                                onClick={() => {
                                                                    onUpdateStatus(item.id, s);
                                                                    setActiveActionId(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComplaintManagement;
