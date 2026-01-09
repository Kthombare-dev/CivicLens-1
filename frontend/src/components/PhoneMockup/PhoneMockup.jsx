"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ComplaintForm from "./AnimatedScreen/ComplaintForm";
import SubmittedConfirmation from "./AnimatedScreen/SubmittedConfirmation";
import InProgress from "./AnimatedScreen/InProgress";
import VerifiedSuccess from "./AnimatedScreen/VerifiedSuccess";

const SCREENS = ["FORM", "SUBMITTED", "IN_PROGRESS", "VERIFIED"];

export default function PhoneMockup() {
    const [step, setStep] = useState(0);

    // Auto-advance screens
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % SCREENS.length);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 0, rotateX: 0 }}
                animate={{ opacity: 1, scale: 1, rotateY: -12, rotateX: 5 }}
                transition={{ duration: 1, ease: "easeOut" }}
                whileHover={{ rotateY: -5, rotateX: 0, scale: 1.02 }}
                className="relative z-10"
                style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
            >
                {/* Phone Frame */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="relative h-[560px] w-[280px] rounded-[36px] bg-slate-900 p-[6px] shadow-[25px_35px_60px_-15px_rgba(0,0,0,0.3),_12px_12px_0px_#020617]"
                >
                    {/* Screen */}
                    <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-white flex flex-col">

                        {/* Status Bar (static) */}
                        <div className="flex-none flex items-center justify-between px-5 pt-3 pb-0 text-[10px] font-medium text-slate-900 relative z-10">
                            <span>9:41</span>
                            <span className="flex gap-1">
                                <span className="h-1 w-1 rounded-full bg-slate-800" />
                                <span className="h-1 w-1 rounded-full bg-slate-800" />
                                <span className="h-1 w-1 rounded-full bg-slate-800" />
                            </span>
                        </div>

                        {/* App Bar */}
                        <div className="flex-none flex items-center justify-between px-4 pb-1 pt-0 -mt-2">
                            <div className="flex items-center">
                                <img
                                    src="/CivicLensLogo.png"
                                    alt="CivicLens"
                                    className="h-20 w-auto object-contain"
                                />

                            </div>
                        </div>

                        {/* Dynamic Screen Area */}
                        <div className="relative flex-1 px-0 overflow-visible">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={SCREENS[step]}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="px-4"
                                >
                                    {SCREENS[step] === "FORM" && <ComplaintForm />}
                                    {SCREENS[step] === "SUBMITTED" && <SubmittedConfirmation />}
                                    {SCREENS[step] === "IN_PROGRESS" && <InProgress />}
                                    {SCREENS[step] === "VERIFIED" && <VerifiedSuccess />}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-slate-300" />
                    </div>

                    {/* Light reflection */}
                    <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/10 to-transparent" />
                </motion.div>
            </motion.div>
        </div>
    );
}
