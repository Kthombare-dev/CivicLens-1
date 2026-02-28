import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Plus, Edit2, ChevronLeft, ChevronRight,
    X, User, Mail, Briefcase, Phone, Save,
    Loader2, AlertCircle, Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../../services/adminService';

const LIMIT = 8;

const DEPARTMENTS = [
    'Sanitation',
    'Water Supply',
    'Roads & Infrastructure',
    'Streetlight & Electricity',
    'Drainage & Sewage',
    'Parks & Gardens',
    'Solid Waste Management',
    'Field Operations',
];

/* ─── Officer Modal (Add / Edit) ─────────────────────────────────────── */
const OfficerModal = ({ isOpen, onClose, officer, onSave }) => {
    const isEdit = !!officer;
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', ward: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setFormData(
                isEdit
                    ? { name: officer.name, email: officer.email, phone: officer.phone, ward: officer.department }
                    : { name: '', email: '', phone: '', ward: '' }
            );
        }
    }, [isOpen, officer]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await onSave(formData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const field = (label, icon, input) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
                {input}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden"
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-5 flex items-start justify-between border-b border-slate-50">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">
                            {isEdit ? 'Edit Officer' : 'Add New Officer'}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {isEdit ? 'Update department assignment' : 'Default password: Officer@123'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                    {field('Full Name', <User className="w-4 h-4" />,
                        <input
                            type="text" required disabled={isEdit}
                            placeholder="Officer full name"
                            value={formData.name}
                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {field('Email', <Mail className="w-4 h-4" />,
                            <input
                                type="email" required disabled={isEdit}
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        )}
                        {field('Phone', <Phone className="w-4 h-4" />,
                            <input
                                type="tel" required disabled={isEdit}
                                placeholder="10-digit number"
                                maxLength={10}
                                value={formData.phone}
                                onChange={e => {
                                    const v = e.target.value.replace(/\D/g, '');
                                    if (v.length <= 10) setFormData(p => ({ ...p, phone: v }));
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        )}
                    </div>

                    {field('Department', <Briefcase className="w-4 h-4" />,
                        <select
                            required
                            value={formData.ward}
                            onChange={e => setFormData(p => ({ ...p, ward: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-bold text-slate-600 appearance-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer"
                        >
                            <option value="" disabled>Select Department</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-xs font-bold">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3.5 bg-[#0B4D34] hover:bg-[#073926] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-emerald-300" />}
                            {loading ? 'Saving…' : (isEdit ? 'Save Changes' : 'Add Officer')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

/* ─── Main Component ──────────────────────────────────────────────────── */
const OfficerManagement = () => {
    const [officers, setOfficers]       = useState([]);
    const [pagination, setPagination]   = useState({ total: 0, page: 1, limit: LIMIT, totalPages: 0 });
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [page, setPage]               = useState(1);
    const [searchTerm, setSearchTerm]   = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [togglingId, setTogglingId]   = useState(null);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // Reset page on search change
    useEffect(() => { setPage(1); }, [debouncedSearch]);

    // Fetch data
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await adminService.getOfficers({ page, limit: LIMIT, search: debouncedSearch });
                if (!cancelled) {
                    setOfficers(result.officers || []);
                    setPagination(result.pagination || { total: 0, page: 1, limit: LIMIT, totalPages: 0 });
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [page, debouncedSearch]);

    const refresh = () => setPage(p => { if (p === 1) setDebouncedSearch(s => s); return 1; });

    const handleSave = async (formData) => {
        if (selectedOfficer) {
            await adminService.updateOfficer(selectedOfficer._id, { ward: formData.ward });
            setOfficers(prev => prev.map(o =>
                String(o._id) === String(selectedOfficer._id)
                    ? { ...o, department: formData.ward }
                    : o
            ));
        } else {
            await adminService.createOfficer(formData);
            refresh();
        }
        setIsModalOpen(false);
    };

    const handleToggleStatus = async (officer) => {
        setTogglingId(String(officer._id));
        try {
            const result = await adminService.toggleOfficerStatus(officer._id);
            setOfficers(prev => prev.map(o =>
                String(o._id) === String(officer._id)
                    ? { ...o, isActive: result.isActive, status: result.status }
                    : o
            ));
        } catch (err) {
            console.error('Failed to toggle status:', err);
        } finally {
            setTogglingId(null);
        }
    };

    const getPageNumbers = () => {
        const { totalPages } = pagination;
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) return [1, 2, 3, 4, '...', totalPages];
        if (page >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', page - 1, page, page + 1, '...', totalPages];
    };

    return (
        <>
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex flex-col overflow-hidden">

                {/* ── Header ───────────────────────────────────────────── */}
                <div className="px-8 py-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">Officer Management</h3>
                        {!loading && (
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                {pagination.total} registered officials
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search officers…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all w-48"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Add Officer */}
                        <button
                            onClick={() => { setSelectedOfficer(null); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B4D34] hover:bg-[#073926] text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-900/10"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Officer
                        </button>
                    </div>
                </div>

                {/* ── Table ────────────────────────────────────────────── */}
                <div className="overflow-x-auto flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-24 text-red-400 text-sm font-bold">{error}</div>
                    ) : officers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-300 gap-2">
                            <User className="w-8 h-8" />
                            <p className="text-sm font-bold uppercase tracking-widest">No officers found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[860px]">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/40">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Officer ID</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Department</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Phone</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Active</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {officers.map(officer => {
                                    const isActive  = officer.isActive;
                                    const toggling  = togglingId === String(officer._id);

                                    return (
                                        <tr key={String(officer._id)} className="hover:bg-slate-50/40 transition-colors group">
                                            {/* ID */}
                                            <td className="px-6 py-5">
                                                <span className="text-[11px] font-black text-slate-400 font-mono tracking-wider">{officer.id}</span>
                                            </td>

                                            {/* Name + avatar */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                                        <img src={officer.avatar} alt={officer.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-black text-slate-700 leading-none">{officer.name}</p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">{officer.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Department */}
                                            <td className="px-6 py-5">
                                                <span className="text-[12px] font-bold text-slate-600">{officer.department}</span>
                                            </td>

                                            {/* Phone */}
                                            <td className="px-6 py-5">
                                                <span className="text-[12px] font-bold text-slate-500">{officer.phone}</span>
                                            </td>

                                            {/* Workload */}
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black ${
                                                    officer.workload > 0
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-slate-50 text-slate-400'
                                                }`}>
                                                    {officer.workload}
                                                </span>
                                            </td>

                                            {/* Status badge */}
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                    isActive
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-rose-50 text-rose-500'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                                                    {officer.status}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Toggle status */}
                                                    <button
                                                        onClick={() => handleToggleStatus(officer)}
                                                        disabled={toggling}
                                                        title={isActive ? 'Deactivate' : 'Activate'}
                                                        className={`p-2 rounded-xl transition-all ${
                                                            isActive
                                                                ? 'bg-rose-50 text-rose-400 hover:bg-rose-100'
                                                                : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                                                        } disabled:opacity-50`}
                                                    >
                                                        {toggling
                                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            : <Power className="w-3.5 h-3.5" />
                                                        }
                                                    </button>

                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => { setSelectedOfficer(officer); setIsModalOpen(true); }}
                                                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                                                        title="Edit department"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ── Pagination Footer ─────────────────────────────────── */}
                {!loading && !error && pagination.total > 0 && (
                    <div className="px-8 py-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing {Math.min((page - 1) * LIMIT + 1, pagination.total)}–{Math.min(page * LIMIT, pagination.total)} of {pagination.total}
                        </p>

                        {pagination.totalPages > 1 && (
                            <div className="flex items-center gap-1">
                                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                                    className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {getPageNumbers().map((num, i) =>
                                    num === '...' ? (
                                        <span key={`e-${i}`} className="px-2 text-slate-300 text-xs font-bold">…</span>
                                    ) : (
                                        <button key={num} onClick={() => setPage(num)}
                                            className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                                                page === num ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    )
                                )}
                                <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages}
                                    className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <OfficerModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        officer={selectedOfficer}
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default OfficerManagement;
