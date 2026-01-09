import { motion } from "framer-motion";

export default function VerifiedResolution() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-start pt-1 pb-6 px-6 text-center space-y-5 bg-gradient-to-b from-emerald-50/50 to-white"
        >
            {/* Verified Icon */}
            <div className="relative">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50"
                >
                    <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </motion.div>
                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                        animate={{
                            opacity: 0,
                            x: (Math.random() - 0.5) * 100,
                            y: (Math.random() - 0.5) * 100,
                            scale: 1
                        }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-emerald-400"
                    />
                ))}
            </div>

            {/* Title */}
            <div className="space-y-1">
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-bold text-slate-800"
                >
                    Issue Resolved & Verified!
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-medium text-slate-500 max-w-[220px] mx-auto"
                >
                    The clean-up has been verified by 5 other citizens in your area.
                </motion.p>
            </div>

            {/* Impact Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full rounded-2xl bg-white border border-slate-100 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-lg">🏆</div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Impact</p>
                        <p className="text-xs font-bold text-slate-800">You helped keep your city clean!</p>
                    </div>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-full bg-gradient-to-r from-blue-400 to-emerald-400"
                    />
                </div>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
                Close Case
            </motion.button>
        </motion.div>
    );
}
