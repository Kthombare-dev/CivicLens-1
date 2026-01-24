import React, { useEffect, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { complaintService } from '../../../services/complaintService';
import { useAuth } from '../../../context/AuthContext';

const getStatusColor = (status) => {
    switch (status) {
        case 'Submitted': return 'Gold';
        case 'Assigned': return 'Purple';
        case 'In Progress': return 'Blue';
        case 'Resolved': return 'Green';
        case 'Rejected': return 'Red';
        default: return 'Slate';
    }
};

const getStatusStyles = (color) => {
    switch (color) {
        case 'Gold': return 'bg-[#fffbeb] text-[#f59e0b]';
        case 'Purple': return 'bg-[#f3e8ff] text-[#9333ea]';
        case 'Blue': return 'bg-[#eff6ff] text-[#3b82f6]';
        case 'Green': return 'bg-[#ecfdf5] text-[#10b981]';
        case 'Red': return 'bg-red-50 text-red-500';
        default: return 'bg-slate-100 text-slate-500';
    }
};

const getDotColor = (color) => {
    switch (color) {
        case 'Gold': return 'bg-[#f59e0b]';
        case 'Purple': return 'bg-[#9333ea]';
        case 'Blue': return 'bg-[#3b82f6]';
        case 'Green': return 'bg-[#10b981]';
        case 'Red': return 'bg-red-500';
        default: return 'bg-slate-500';
    }
};

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const IssuesTable = () => {
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            if (!user) return;
            try {
                const data = await complaintService.getComplaints({
                    citizen_id: user.id || user._id
                });
                setIssues(data);
            } catch (error) {
                console.error('Failed to fetch issues:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (issues.length === 0) {
        return (
            <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 text-center py-16">
                <p className="text-slate-400 font-bold mb-4">No issues reported yet.</p>
                <button className="text-emerald-600 font-black uppercase tracking-wider text-xs hover:underline">Report your first issue</button>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100/60">
            <div className="flex items-center justify-between mb-8">
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
                    {issues.map((issue) => {
                        const color = getStatusColor(issue.status);
                        return (
                            <div key={issue._id} className="grid grid-cols-12 items-center p-4 hover:bg-slate-50/80 rounded-3xl transition-all group">
                                <div className="col-span-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <img
                                            src={complaintService.getImageUrl(issue.images[0])}
                                            alt=""
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
                                        />
                                    </div>
                                    <span className="font-bold text-slate-700 truncate pr-4">{issue.title}</span>
                                </div>
                                <div className="col-span-3 flex justify-center">
                                    <div className={`flex items-center gap-2.5 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider ${getStatusStyles(color)}`}>
                                        <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(color)}`}></span>
                                        {issue.status}
                                    </div>
                                </div>
                                <div className="col-span-3 text-right text-slate-400 text-sm font-bold">
                                    {formatTimeAgo(issue.createdAt)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default IssuesTable;
