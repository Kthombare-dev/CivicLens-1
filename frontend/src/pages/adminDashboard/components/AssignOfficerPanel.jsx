import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { adminService } from '../../../services/adminService';

const AssignOfficerPanel = ({ isOpen, onClose, selectedComplaint, onAssign }) => {
    const [officers, setOfficers] = useState([]);
    const [loadingOfficers, setLoadingOfficers] = useState(false);
    const [selectedOfficerId, setSelectedOfficerId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch officers fresh every time the panel opens
    useEffect(() => {
        if (!isOpen) return;
        setSelectedOfficerId(null);
        setError(null);
        const load = async () => {
            setLoadingOfficers(true);
            try {
                const result = await adminService.getOfficers({ limit: 100 });
                // Only show active officers, sorted by workload asc
                setOfficers((result.officers || []).filter(o => o.isActive));
            } catch {
                setOfficers([]);
            } finally {
                setLoadingOfficers(false);
            }
        };
        load();
    }, [isOpen]);

    if (!isOpen || !selectedComplaint) return null;

    const handleAssign = async () => {
        if (!selectedOfficerId) return;
        setLoading(true);
        setError(null);
        try {
            await onAssign(selectedOfficerId);
        } catch (err) {
            setError(err.message || 'Failed to assign officer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden"
        >
            {/* ── Fixed Header ───────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 flex-shrink-0">
                <div>
                    <h3 className="text-lg font-black text-slate-800 leading-none">Assign Officer</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Select an officer below
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* ── Complaint Info ──────────────────────────────────────── */}
            <div className="px-6 py-4 bg-slate-50/60 border-b border-slate-50 flex-shrink-0">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Complaint</p>
                <p className="text-[13px] font-black text-slate-800 font-mono">{selectedComplaint.id}</p>
                <p className="text-[12px] font-bold text-slate-500 mt-0.5">{selectedComplaint.category}</p>
                {selectedComplaint.location && (
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{selectedComplaint.location}</p>
                )}
            </div>

            {/* ── Scrollable Officer List ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {loadingOfficers ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    </div>
                ) : officers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-300 gap-2">
                        <AlertCircle className="w-6 h-6" />
                        <p className="text-xs font-bold uppercase tracking-widest text-center">
                            No active officers found.<br />Add officers first.
                        </p>
                    </div>
                ) : (
                    officers.map(officer => {
                        const isSelected = String(selectedOfficerId) === String(officer._id);
                        return (
                            <button
                                key={String(officer._id)}
                                onClick={() => setSelectedOfficerId(String(officer._id))}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${isSelected
                                        ? 'border-emerald-500 bg-emerald-50/40'
                                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                    <img src={officer.avatar} alt={officer.name} className="w-full h-full object-cover" />
                                </div>

                                {/* Name + dept */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[13px] font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {officer.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
                                        {officer.department}
                                    </p>
                                </div>

                                {/* Workload badge */}
                                <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
                                    <span className={`text-sm font-black tabular-nums ${isSelected ? 'text-emerald-600' : 'text-slate-300'}`}>
                                        {officer.workload}
                                    </span>
                                    <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">active</span>
                                </div>

                                {/* Check icon */}
                                {isSelected && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* ── Fixed Footer ────────────────────────────────────────── */}
            <div className="px-6 py-5 border-t border-slate-50 flex-shrink-0 space-y-3">
                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-xs font-bold">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {!selectedOfficerId && officers.length > 0 && (
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">
                        Select an officer to continue
                    </p>
                )}

                <button
                    disabled={!selectedOfficerId || loading || loadingOfficers || officers.length === 0}
                    onClick={handleAssign}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Assigning…' : 'Assign Officer'}
                </button>
            </div>
        </motion.div>
    );
};

export default AssignOfficerPanel;
