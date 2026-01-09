import { motion } from "framer-motion";

const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

export default function InProgressResolution() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 px-5 pt-2 pb-6 h-full flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-slate-900">Track Status</h3>
                    <p className="text-xs text-slate-500 font-medium">Ticket #CL-20491</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-sm">🚧</span>
                </div>
            </div>

            {/* Status Card */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-amber-50 border border-amber-100 p-4"
            >
                <div className="flex items-start gap-3">
                    <div className="relative pt-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-amber-900 leading-tight">Work in Progress</h4>
                        <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">
                            Municipal team has been deployed and is currently working on the issue.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Timeline */}
            <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Activity Log</h4>
                <motion.div
                    variants={timelineVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-0 relative pl-2"
                >
                    {/* Line */}
                    <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-slate-100" />

                    {/* Items */}
                    <TimelineItem
                        icon={<div className="w-2 h-2 bg-white rounded-full" />}
                        iconBg="bg-emerald-500"
                        title="Complaint Verified"
                        time="10:30 AM"
                        active
                    />
                    <TimelineItem
                        icon={<div className="w-2 h-2 bg-white rounded-full" />}
                        iconBg="bg-emerald-500"
                        title="Assigned to Road Dept"
                        time="11:45 AM"
                        active
                    />
                    <TimelineItem
                        icon={<div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />}
                        iconBg="bg-amber-100"
                        title="Crew Arrived on Site"
                        time="Just now"
                        isLast
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}

function TimelineItem({ icon, iconBg, title, time, active, isLast }) {
    return (
        <motion.div variants={itemVariants} className={`relative flex gap-4 pb-6 ${isLast ? 'pb-0' : ''}`}>
            <div className={`relative z-10 flex-shrink-0 h-7 w-7 rounded-full ${iconBg} flex items-center justify-center ring-4 ring-white`}>
                {icon}
            </div>
            <div className="pt-1">
                <p className={`text-xs font-bold ${active ? 'text-slate-900' : 'text-slate-800'}`}>{title}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{time}</p>
            </div>
        </motion.div>
    )
}
