import React from 'react';
import { Star, ChevronRight } from 'lucide-react';

const CivicPointsCard = ({ totalPoints = 0, activities = [] }) => {
    // Format activities for display
    const formattedActivities = activities.slice(0, 5).map((activity, index) => {
        const points = activity.points > 0 ? `+${activity.points}` : activity.points.toString();
        // Determine color based on activity type
        const color = activity.points >= 20 ? 'text-[#10b981]' : 'text-[#3b82f6]';
        return {
            id: activity._id || index,
            points: `${points} POINTS`,
            text: activity.description || 'Activity',
            color: color
        };
    });

    return (
        <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Civic Points & Rewards</h3>

            <div className="flex items-center gap-4 mb-10">
                <Star className="w-10 h-10 text-amber-400 fill-amber-300 shadow-amber-200 shadow-sm" />
                <span className="text-5xl font-black text-slate-900 leading-none">{totalPoints}</span>
            </div>

            <div className="space-y-5 mb-10">
                {formattedActivities.length > 0 ? (
                    formattedActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                            <span className={`font-black text-xs uppercase tracking-wider whitespace-nowrap pt-0.5 ${activity.color}`}>{activity.points}</span>
                            <span className="text-slate-300 font-bold">|</span>
                            <span className="text-slate-500 font-bold text-sm leading-tight">{activity.text}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-slate-400 text-sm font-medium">No recent activities</div>
                )}
            </div>

            <button className="flex items-center gap-1 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-emerald-600 transition-colors">
                See all activity <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default CivicPointsCard;
