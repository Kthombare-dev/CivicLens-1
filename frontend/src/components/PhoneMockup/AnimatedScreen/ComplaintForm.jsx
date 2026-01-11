import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export default function ComplaintFormScreen() {
    const [uploadState, setUploadState] = useState("idle"); // idle, uploading, done
    const [issueType, setIssueType] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const timers = [];

        // 1. Simulate Upload Interaction
        timers.push(setTimeout(() => setUploadState("uploading"), 1500));
        timers.push(setTimeout(() => setUploadState("done"), 3500));

        // 2. AI Analysis Start
        timers.push(setTimeout(() => setIsAnalyzing(true), 3600));

        // 3. AI Populates Data (Sequential)
        timers.push(setTimeout(() => {
            setIssueType("Garbage Dump");
        }, 5000));

        timers.push(setTimeout(() => {
            setLocation("Sector 4, Market Road");
        }, 6000));

        timers.push(setTimeout(() => {
            setDescription("Overflowing garbage bin causing health hazard.");
            setIsAnalyzing(false);
        }, 7000));

        // 4. Submit
        timers.push(setTimeout(() => setIsSubmitting(true), 8500));

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2 font-sans h-full flex flex-col"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h3 className="text-base font-bold text-slate-800 tracking-tight">
                    Report Issue
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wide">
                        AI Auto-Detection Active
                    </p>
                </div>
            </motion.div>

            {/* Upload Area */}
            <motion.div
                variants={itemVariants}
                className={`relative group flex h-16 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-500 ease-out ${uploadState === "done"
                    ? "border-emerald-500/50 bg-emerald-50/50"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                    }`}
            >
                {uploadState === "idle" && (
                    <div className="text-center space-y-0.5">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mx-auto w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </motion.div>
                        <span className="block text-[10px] font-medium text-slate-500">Tap to Upload</span>
                    </div>
                )}

                {uploadState === "uploading" && (
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="relative h-6 w-6">
                            <svg className="animate-spin h-full w-full text-blue-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium text-blue-600">Analyzing...</span>
                    </div>
                )}

                {uploadState === "done" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-0.5"
                    >
                        <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">Processed</span>
                    </motion.div>
                )}

                {isAnalyzing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 animate-[shimmer_1.5s_infinite]" />
                )}
            </motion.div>

            {/* Smart Fields Container */}
            <div className="space-y-2">
                {/* Issue Type Selector */}
                <motion.div
                    variants={itemVariants}
                    className={`relative flex items-center justify-between rounded-xl border p-2.5 transition-all duration-300 ${issueType
                        ? "border-blue-200 bg-blue-50/30 shadow-sm"
                        : "border-slate-200 bg-white"
                        }`}
                >
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Issue Type</span>
                        <span className={`text-xs font-medium ${issueType ? "text-slate-900" : "text-slate-400"}`}>
                            {isAnalyzing && !issueType ? (
                                <span className="inline-flex items-center gap-1.5 text-blue-600">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                    Identifying...
                                </span>
                            ) : (
                                issueType || "Waiting..."
                            )}
                        </span>
                    </div>
                    {issueType && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 text-[8px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-200"
                        >
                            AI DETECTED
                        </motion.span>
                    )}
                </motion.div>

                {/* Location Field */}
                <motion.div
                    variants={itemVariants}
                    className={`relative flex items-center justify-between rounded-xl border p-2.5 transition-all duration-300 ${location
                        ? "border-indigo-200 bg-indigo-50/30 shadow-sm"
                        : "border-slate-200 bg-white"
                        }`}
                >
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Location</span>
                        <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-medium truncate ${location ? "text-slate-900" : "text-slate-400"}`}>
                                {isAnalyzing && !location ? (
                                    <span className="inline-flex items-center gap-1.5 text-indigo-600">
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
                                        Locating...
                                    </span>
                                ) : (
                                    location || "Waiting..."
                                )}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div
                    variants={itemVariants}
                    className={`relative rounded-xl border p-2.5 min-h-[4.5rem] transition-all duration-300 ${description
                        ? "border-emerald-200 bg-emerald-50/20 shadow-sm"
                        : "border-slate-200 bg-white"
                        }`}
                >
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Description</span>
                    {isAnalyzing && !description ? (
                        <div className="space-y-1.5 mt-1">
                            <div className="h-1.5 w-3/4 bg-slate-100 rounded animate-pulse" />
                            <div className="h-1.5 w-1/2 bg-slate-100 rounded animate-pulse" />
                        </div>
                    ) : (
                        <p className={`text-[11px] leading-relaxed ${description ? "text-slate-700" : "text-slate-400"}`}>
                            {description || "AI generating details..."}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-1">
                <motion.button
                    disabled={!description}
                    animate={isSubmitting ? { scale: 0.98, opacity: 0.8 } : { scale: 1, opacity: description ? 1 : 0.5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full relative overflow-hidden rounded-xl py-3 text-xs font-bold text-white shadow-lg transition-all duration-300 ${description
                        ? "bg-slate-900 shadow-slate-900/25 hover:shadow-slate-900/35 hover:-translate-y-0.5"
                        : "bg-slate-200 shadow-none cursor-not-allowed text-slate-400"
                        }`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting Report...</span>
                        </div>
                    ) : (
                        "Submit Complaint"
                    )}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
