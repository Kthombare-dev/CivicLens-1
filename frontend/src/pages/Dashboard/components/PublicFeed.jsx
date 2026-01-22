import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Camera, Clock, CheckCircle2, Star, ShieldCheck, Gift, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const feedItems = [
    { id: 1, name: 'Broken Park Bench', verifiers: 5, time: '3 hours ago', icon: 'https://cdn-icons-png.flaticon.com/128/3004/3004654.png' },
    { id: 2, name: 'Fixed Manhole Cover', verifiers: 7, time: '6 hours ago', icon: 'https://cdn-icons-png.flaticon.com/128/3125/3125672.png' },
    { id: 3, name: 'Cleared Debris', verifiers: 4, time: '1 day ago', icon: 'https://cdn-icons-png.flaticon.com/128/3616/3616738.png' },
];

const PublicFeed = () => {
    const [showPointsGuide, setShowPointsGuide] = useState(false);

    if (showPointsGuide) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 space-y-12"
            >
                {/* Header */}
                <div className="flex items-start gap-5 border-b border-slate-50 pb-6">
                    <button
                        onClick={() => setShowPointsGuide(false)}
                        className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-colors shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Success Journey</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Your step-by-step guide to civic impact</p>
                    </div>
                </div>

                {/* 1. The ‘1-2-3’ Simple Guide */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-sm">1. The 1-2-3 Journey</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 -z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 bg-white border-4 border-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:border-emerald-100 transition-colors">
                                <Camera className="w-7 h-7 text-emerald-500" />
                            </div>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full mb-2">+10 POINTS</span>
                            <h5 className="font-bold text-slate-900 text-sm">See It & Report It</h5>
                            <p className="text-[11px] text-slate-500 mt-2 px-4">Capture a photo and submit via Web or WhatsApp.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 bg-white border-4 border-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:border-blue-100 transition-colors">
                                <Clock className="w-7 h-7 text-blue-500" />
                            </div>
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full mb-2">PROCESSING</span>
                            <h5 className="font-bold text-slate-900 text-sm">Let Officials Work</h5>
                            <p className="text-[11px] text-slate-500 mt-2 px-4">Wait for resolution and track live progress.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 bg-white border-4 border-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:border-emerald-100 transition-colors">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                            </div>
                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full mb-2">+20 POINTS</span>
                            <h5 className="font-bold text-slate-900 text-sm">Verify the Fix</h5>
                            <p className="text-[11px] text-slate-500 mt-2 px-4">Upload ‘After Photo’ to confirm resolution.</p>
                        </div>
                    </div>
                </div>

                {/* 2. The ‘Point Menu’ */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Gift className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-sm">2. Point Menu</h4>
                    </div>

                    <div className="bg-slate-50/50 rounded-[32px] overflow-hidden border border-slate-100">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Points Earned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { action: 'New Issue Report', points: '+10 Points', color: 'text-emerald-600' },
                                    { action: 'Issue Verification', points: '+20 Points', color: 'text-emerald-600' },
                                    { action: 'Daily Check-in', points: '+2 Points', color: 'text-blue-500' },
                                    { action: 'Upvoting an Issue', points: '+5 Points', color: 'text-indigo-500' },
                                ].map((item, i) => (
                                    <tr key={i} className="hover:bg-white transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{item.action}</td>
                                        <td className={`px-6 py-4 text-xs font-black text-right ${item.color}`}>{item.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. The ‘Why Points Matter’ Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-sm">3. Why Points Matter</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start gap-4 p-5 bg-amber-50/30 rounded-[24px] border border-amber-100/50 hover:bg-white hover:border-amber-200 transition-all group">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                <Star className="w-5 h-5 text-amber-500 fill-current" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-900 text-sm">Recognition</h5>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Earn badges like <span className="text-amber-600 font-bold">‘Indore Guardian’</span> to showcase your contribution.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-blue-50/30 rounded-[24px] border border-blue-100/50 hover:bg-white hover:border-blue-200 transition-all group">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                <Gift className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-900 text-sm">Utility Rewards</h5>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Higher points unlock <span className="text-blue-600 font-bold">discounts on municipal services</span> like water or waste bills.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-emerald-50/30 rounded-[24px] border border-emerald-100/50 hover:bg-white hover:border-emerald-200 transition-all group">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-900 text-sm">Better Neighborhoods</h5>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">More points lead to faster issue resolution and improved areas like <span className="text-emerald-600 font-bold">Vijay Nagar</span>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40"
        >
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

            <button
                onClick={() => setShowPointsGuide(true)}
                className="flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform text-sm group"
            >
                Learn how to earn points <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
};

export default PublicFeed;
