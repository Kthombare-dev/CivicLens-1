import React from 'react';
import { Star, ChevronRight } from 'lucide-react';

const activities = [
    { id: 1, points: '+20', text: 'Street Light complaint verified', color: 'text-[#10b981]' },
    { id: 2, points: '+10', text: 'Pothole issue reported', color: 'text-[#3b82f6]' },
];

const CivicPointsCard = () => {
    return (
        <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Civic Points & Rewards</h3>

            <div className="flex items-center gap-4 mb-10">
                <Star className="w-10 h-10 text-amber-400 fill-amber-300 shadow-amber-200 shadow-sm" />
                <span className="text-5xl font-black text-slate-900 leading-none">220</span>
            </div>

            <div className="space-y-5 mb-10">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                        <span className={`font-black text-xs uppercase tracking-wider whitespace-nowrap pt-0.5 ${activity.color}`}>{activity.points} points</span>
                        <span className="text-slate-300 font-bold">|</span>
                        <span className="text-slate-500 font-bold text-sm leading-tight">{activity.text}</span>
                    </div>
                ))}
            </div>

            <button className="flex items-center gap-1 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-emerald-600 transition-colors">
                See all activity <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default CivicPointsCard;
