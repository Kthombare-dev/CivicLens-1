import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';

const LIMIT = 8;

const StatusBadge = ({ status }) => {
    const styles = {
        'Submitted': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
        'Assigned':    'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Resolved':    'bg-slate-100 text-slate-600 border-slate-200',
        'Rejected':    'bg-red-50 text-red-600 border-red-100',
    };
    const display  = status === 'Submitted' ? 'New' : status;
    const styleKey = status === 'Submitted' ? 'Submitted' : status;
    return (
        <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border ${styles[styleKey] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            {display}
        </span>
    );
};

const ComplaintManagement = ({ onAssignClick, refreshKey = 0 }) => {
    const [complaints, setComplaints]   = useState([]);
    const [pagination, setPagination]   = useState({ total: 0, page: 1, limit: LIMIT, totalPages: 0 });
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [page, setPage]               = useState(1);
    const [searchTerm, setSearchTerm]   = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus]     = useState('All');
    const [activeActionId, setActiveActionId]     = useState(null);

    const categories      = ['All', 'Pothole', 'Garbage', 'Streetlight', 'Water / Sanitation'];
    const statusOptions   = ['All', 'Submitted', 'In Progress', 'Assigned', 'Resolved', 'Rejected'];
    const changeStatuses  = ['In Progress', 'Resolved', 'Rejected'];

    // Debounce search by 500 ms
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // Reset to page 1 whenever filters / search / refreshKey change
    useEffect(() => { setPage(1); }, [debouncedSearch, selectedStatus, selectedCategory, refreshKey]);

    // Main data fetch
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiStatus   = selectedStatus === 'All' ? '' : selectedStatus;
                const apiCategory = selectedCategory === 'All' ? '' : selectedCategory;
                const result = await adminService.getRecentComplaints({
                    page, limit: LIMIT,
                    status:   apiStatus,
                    category: apiCategory,
                    search:   debouncedSearch
                });
                if (!cancelled) {
                    setComplaints(result.complaints || []);
                    setPagination(result.pagination  || { total: 0, page: 1, limit: LIMIT, totalPages: 0 });
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [page, selectedStatus, selectedCategory, debouncedSearch, refreshKey]);

    const handleStatusUpdate = async (complaint, newStatus) => {
        setActiveActionId(null);
        try {
            await adminService.updateComplaintStatus(complaint._id, newStatus);
            // Optimistic local update; socket event will also update citizen's UI
            setComplaints(prev =>
                prev.map(c =>
                    c._id.toString() === complaint._id.toString()
                        ? { ...c, status: newStatus }
                        : c
                )
            );
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const getPageNumbers = () => {
        const { totalPages } = pagination;
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3)                return [1, 2, 3, 4, '...', totalPages];
        if (page >= totalPages - 2)   return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', page - 1, page, page + 1, '...', totalPages];
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col">

            {/* ── Header / Filters ─────────────────────────────────────── */}
            <div className="p-8 border-b border-slate-50 space-y-6 flex-shrink-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Complaint Management</h3>
                        {!loading && (
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {pagination.total} total complaints
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                        {/* Category */}
                        <div className="relative min-w-[160px]">
                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-transparent border-none text-xs font-bold text-slate-500 appearance-none cursor-pointer focus:ring-0"
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Status */}
                        <div className="relative min-w-[160px]">
                            <select
                                value={selectedStatus}
                                onChange={e => setSelectedStatus(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-transparent border-none text-xs font-bold text-slate-500 appearance-none cursor-pointer focus:ring-0"
                            >
                                {statusOptions.map(s => (
                                    <option key={s} value={s}>
                                        {s === 'All' ? 'All Statuses' : s === 'Submitted' ? 'New' : s}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSearchTerm('')}
                        className={`p-1.5 rounded-lg transition-all ${searchTerm ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'opacity-0 pointer-events-none'}`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, category, location, citizen…"
                            className="pl-8 pr-4 py-2 bg-transparent border-none text-xs font-bold text-slate-500 focus:ring-0 w-full placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Table ────────────────────────────────────────────────── */}
            <div className="overflow-x-auto flex-1">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-24 text-red-400 text-sm font-bold">{error}</div>
                ) : complaints.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-300 gap-2">
                        <Search className="w-8 h-8" />
                        <p className="text-sm font-bold uppercase tracking-widest">No complaints found</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 w-12">
                                    <input type="checkbox" className="rounded border-slate-200 text-emerald-600 focus:ring-emerald-500" />
                                </th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Citizen</th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 lg:table-cell hidden">Assigned To</th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {complaints.map(item => (
                                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <input type="checkbox" className="rounded border-slate-200 text-emerald-600 focus:ring-emerald-500" />
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className="text-[12px] font-black text-slate-800 tracking-wider font-mono">{item.id}</span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className="text-[13px] font-bold text-slate-600 block max-w-[120px]">{item.category}</span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className="text-[13px] font-bold text-slate-600 block max-w-[150px] truncate" title={item.location}>
                                            {item.location}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className="text-[13px] font-bold text-slate-500">{item.citizen?.name || '—'}</span>
                                    </td>
                                    <td className="px-4 py-5 lg:table-cell hidden">
                                        <span className="text-[13px] font-black text-slate-400">{item.assignedTo || 'None'}</span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-4 py-5">
                                        {item.status === 'Submitted' ? (
                                            <button
                                                onClick={() => onAssignClick(item)}
                                                className="px-6 py-2.5 bg-[#0B4D34] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#073926] transition-all shadow-lg shadow-emerald-900/10"
                                            >
                                                Assign
                                            </button>
                                        ) : (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveActionId(activeActionId === item._id ? null : item._id)}
                                                    className="px-5 py-2.5 bg-slate-100/50 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3 min-w-[130px]"
                                                >
                                                    Change Status
                                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeActionId === item._id ? 'rotate-180' : ''}`} />
                                                </button>

                                                {activeActionId === item._id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setActiveActionId(null)} />
                                                        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20">
                                                            {changeStatuses
                                                                .filter(s => s !== item.status)
                                                                .map(s => (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => handleStatusUpdate(item, s)}
                                                                        className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))
                                                            }
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
                )}
            </div>

            {/* ── Pagination Footer ─────────────────────────────────────── */}
            {!loading && !error && pagination.total > 0 && (
                <div className="px-8 py-4 border-t border-slate-50 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {Math.min((page - 1) * LIMIT + 1, pagination.total)}–{Math.min(page * LIMIT, pagination.total)} of {pagination.total}
                    </p>

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 1}
                                className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {getPageNumbers().map((num, i) =>
                                num === '...' ? (
                                    <span key={`ellipsis-${i}`} className="px-2 text-slate-300 text-xs font-bold">…</span>
                                ) : (
                                    <button
                                        key={num}
                                        onClick={() => setPage(num)}
                                        className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                                            page === num
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'text-slate-400 hover:bg-slate-50'
                                        }`}
                                    >
                                        {num}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === pagination.totalPages}
                                className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComplaintManagement;
