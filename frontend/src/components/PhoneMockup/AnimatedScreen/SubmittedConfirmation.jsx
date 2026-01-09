import { motion } from "framer-motion";

export default function SubmittedConfirmation() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex h-full flex-col items-center justify-start pt-2 px-6 text-center space-y-5"
        >
            {/* Success Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50"
            >
                <div className="absolute inset-0 rounded-full border border-emerald-100" />
                <svg
                    className="h-10 w-10 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
                        d="M20 6L9 17l-5-5"
                    />
                </svg>
            </motion.div>

            {/* Main Text */}
            <div className="space-y-2">
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg font-bold text-slate-800"
                >
                    Complaint Submitted
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm font-medium text-slate-500 max-w-[200px] mx-auto leading-relaxed"
                >
                    Your issue has been successfully reported to the council.
                </motion.p>
            </div>

            {/* Ticket Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500" />

                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider">Ticket ID</span>
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">#CL-20491</span>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Status</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Queued
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
