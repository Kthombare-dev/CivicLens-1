import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { complaintService } from '../../../services/complaintService';

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}h ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const PublicFeed = () => {
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // Fetch all complaints, backend sorts by createdAt desc
                const data = await complaintService.getComplaints();
                setFeedItems(data.slice(0, 5)); // Show top 5
            } catch (error) {
                console.error('Failed to fetch public feed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100/60">
            <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Public Feed</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Recently Reported in Vijay Nagar</p>
            </div>

            <div className="space-y-4 my-8">
                {feedItems.length === 0 ? (
                    <p className="text-slate-400 font-bold text-center">No recent activity.</p>
                ) : (
                    feedItems.map((item) => (
                        <div key={item._id} className="p-4 bg-slate-50/50 rounded-[24px] border border-slate-100 group hover:border-emerald-200 hover:bg-white transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-50">
                                    <img
                                        src={complaintService.getImageUrl(item.images[0])}
                                        alt=""
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.votes} votes</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{formatTimeAgo(item.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button className="flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform text-sm group">
                Learn how to earn points <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default PublicFeed;
