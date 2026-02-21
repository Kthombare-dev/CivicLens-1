import React, { useState, useEffect } from 'react';
import { complaintService } from '../../../services/complaintService';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const statusStyles = {
    Submitted: { bg: 'bg-blue-50', text: 'text-blue-700' },
    Assigned: { bg: 'bg-purple-50', text: 'text-purple-700' },
    'In Progress': { bg: 'bg-amber-50', text: 'text-amber-700' },
    Resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    Rejected: { bg: 'bg-red-50', text: 'text-red-700' },
};

export default function ManageIssues() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            setError(null);
            const list = await complaintService.getComplaints();
            setComplaints(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err.message || 'Failed to load complaints');
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleMarkResolved = async (complaint) => {
        if (complaint.status === 'Resolved') return;
        try {
            setUpdatingId(complaint._id);
            await complaintService.updateComplaintStatus(complaint._id, 'Resolved');
            setComplaints((prev) =>
                prev.map((c) => (c._id === complaint._id ? { ...c, status: 'Resolved' } : c))
            );
        } catch (err) {
            alert(err.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Manage Issues (Official)</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Mark complaints as Resolved so citizens can verify them in the Public Feed.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Title</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Address / Area</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {complaints.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                        No complaints yet.
                                    </td>
                                </tr>
                            ) : (
                                complaints.map((c) => {
                                    const style = statusStyles[c.status] || { bg: 'bg-slate-50', text: 'text-slate-700' };
                                    return (
                                        <tr key={c._id} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-slate-800">{c.title}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate" title={c.address}>
                                                {c.area || c.address || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${style.bg} ${style.text}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {c.status !== 'Resolved' ? (
                                                    <button
                                                        onClick={() => handleMarkResolved(c)}
                                                        disabled={updatingId === c._id}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
                                                    >
                                                        {updatingId === c._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}
                                                        Mark Resolved
                                                    </button>
                                                ) : (
                                                    <span className="text-emerald-600 text-sm font-medium">Resolved — citizens can verify</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
