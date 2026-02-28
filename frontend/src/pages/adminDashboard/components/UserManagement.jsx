import React, { useState, useEffect, useCallback } from 'react';
import { Mail, ExternalLink, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { adminService } from '../../../services/adminService';

const LIMIT = 5;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async (page) => {
        try {
            setLoading(true);
            setError('');
            const result = await adminService.getUsers(page, LIMIT);
            setUsers(result.users || []);
            setPagination(result.pagination || { total: 0, page: 1, totalPages: 1 });
        } catch (err) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    const goToPage = (page) => {
        if (page < 1 || page > pagination.totalPages || loading) return;
        fetchUsers(page);
    };

    // Build compact page number list e.g. 1 … 4 5 6 … 12
    const getPageNumbers = () => {
        const { page, totalPages } = pagination;
        if (!totalPages || totalPages <= 1) return [];
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages = new Set([1, totalPages, page]);
        if (page > 1) pages.add(page - 1);
        if (page < totalPages) pages.add(page + 1);

        const sorted = [...pages].sort((a, b) => a - b);
        const result = [];
        sorted.forEach((p, i) => {
            if (i > 0 && p - sorted[i - 1] > 1) result.push('...');
            result.push(p);
        });
        return result;
    };

    const showPagination = !loading && !error && pagination.totalPages > 1;

    const COL_COUNT = 6;

    return (
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 col-span-1 lg:col-span-8 flex flex-col">

            {/* ── Header ───────────────────────────────────────────── */}
            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                <div>
                    <h3 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">User List</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        Registered Platform Citizens
                        {!loading && (
                            <span className="ml-2 normal-case font-semibold text-slate-300">
                                — {pagination.total} total
                            </span>
                        )}
                    </p>
                </div>
                <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10 self-start sm:self-auto">
                    <ExternalLink className="w-3.5 h-3.5" /> View Complaint
                </button>
            </div>

            {/* ── Table ────────────────────────────────────────────── */}
            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-slate-50">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User ID</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Complaints</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Civic Points</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Active</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            Array.from({ length: LIMIT }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {Array.from({ length: COL_COUNT }).map((__, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : error ? (
                            <tr>
                                <td colSpan={COL_COUNT} className="px-6 py-16 text-center text-sm text-red-400 font-bold">
                                    {error}
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={COL_COUNT} className="px-6 py-16 text-center text-sm text-slate-400 font-bold">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-slate-700 tracking-wider font-mono">{user.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs flex-shrink-0">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <Mail className="w-3 h-3 flex-shrink-0" />
                                            {user.contact}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black ${
                                            user.complaintsFiled > 5
                                                ? 'bg-amber-100 text-amber-600'
                                                : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            {user.complaintsFiled}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-violet-50 text-violet-600">
                                            <Star className="w-3 h-3 fill-violet-400 text-violet-400" />
                                            <span className="text-xs font-black">{user.civicPoints}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{user.lastActive}</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination footer ─────────────────────────────────── */}
            {!loading && !error && users.length > 0 && (
                <div className="px-8 py-4 border-t border-slate-100 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {((pagination.page - 1) * LIMIT) + 1}–{Math.min(pagination.page * LIMIT, pagination.total)} of {pagination.total} users
                    </p>

                    {showPagination && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {getPageNumbers().map((p, i) =>
                                p === '...' ? (
                                    <span key={`e-${i}`} className="w-7 text-center text-xs text-slate-300 font-bold">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-colors ${
                                            p === pagination.page
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => goToPage(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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

export default UserManagement;
