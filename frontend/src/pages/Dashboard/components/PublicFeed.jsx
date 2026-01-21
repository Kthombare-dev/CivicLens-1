import React from 'react';
import { ArrowRight } from 'lucide-react';

const feedItems = [
    { id: 1, name: 'Broken Park Bench', verifiers: 5, time: '3 hours ago', icon: 'https://cdn-icons-png.flaticon.com/128/3004/3004654.png' },
    { id: 2, name: 'Fixed Manhole Cover', verifiers: 7, time: '6 hours ago', icon: 'https://cdn-icons-png.flaticon.com/128/3125/3125672.png' },
    { id: 3, name: 'Cleared Debris', verifiers: 4, time: '1 day ago', icon: 'https://cdn-icons-png.flaticon.com/128/3616/3616738.png' },
];

const PublicFeed = () => {
    return (
        <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40">
            <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Public Feed</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Recently Verified in Vijay Nagar</p>
            </div>

            <div className="space-y-4 my-8">
                {feedItems.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50/50 rounded-[24px] border border-slate-100 group hover:border-emerald-200 hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-slate-50">
                                <img src={item.icon} alt="" className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.verifiers} verifying citizens</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform text-sm group">
                Learn how to earn points <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default PublicFeed;
