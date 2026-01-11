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
                        <div className="flex-none flex items-center justify-between px-5 pt-4 pb-1 text-[10px] font-bold text-slate-800 relative z-20 bg-slate-50/90 backdrop-blur-sm">
                            <span className="tracking-wide">9:41</span>
                            <div className="flex items-center gap-1.5">
                                {/* Signal */}
                                <svg className="w-3 h-3 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M1 12.5C1 12.2239 1.22386 12 1.5 12H2.5C2.77614 12 3 12.2239 3 12.5V20.5C3 20.7761 2.77614 21 2.5 21H1.5C1.22386 21 1 20.7761 1 20.5V12.5Z" />
                                    <path d="M6 9.5C6 9.22386 6.22386 9 6.5 9H7.5C7.77614 9 8 9.22386 8 9.5V20.5C8 20.7761 7.77614 21 7.5 21H6.5C6.22386 21 6 20.7761 6 20.5V9.5Z" />
                                    <path d="M11 6.5C11 6.22386 11.2239 6 11.5 6H12.5C12.7761 6 13 6.22386 13 6.5V20.5C13 20.7761 12.7761 21 12.5 21H11.5C11.2239 21 11 20.7761 11 20.5V6.5Z" />
                                    <path d="M16 3.5C16 3.22386 16.2239 3 16.5 3H17.5C17.7761 3 18 3.22386 18 3.5V20.5C18 20.7761 17.7761 21 17.5 21H16.5C16.2239 21 16 20.7761 16 20.5V3.5Z" />
                                </svg>
                                {/* Wi-Fi */}
                                <svg className="w-3 h-3 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3C7.45607 3 3.30396 4.69837 0.171875 7.50024L1.58862 8.91699C4.30507 6.49504 7.95471 5 12 5C16.0453 5 19.6949 6.49504 22.4114 8.91699L23.8281 7.50024C20.696 4.69837 16.5439 3 12 3Z" />
                                    <path d="M12 7C8.52928 7 5.35624 8.29749 2.96484 10.4534L4.38159 11.8701C6.38871 10.0577 9.07188 8.96 12 8.96C14.9281 8.96 17.6113 10.0577 19.6184 11.8701L21.0352 10.4534C18.6438 8.29749 15.4707 7 12 7Z" />
                                    <path d="M12 11C9.60255 11 7.40845 11.896 5.75781 13.4065L7.17456 14.8232C8.44192 13.6823 10.126 13 12 13C13.874 13 15.5581 13.6823 16.8254 14.8232L18.2422 13.4065C16.5916 11.896 14.3975 11 12 11Z" />
                                    <path d="M12 15C10.6558 15 9.42646 15.4795 8.521 16.326L12 19.805L15.479 16.326C14.5735 15.4795 13.3442 15 12 15Z" />
                                </svg>
                                {/* Battery */}
                                <svg className="w-4.5 h-4.5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="2" y="7" width="18" height="10" rx="2.5" ry="2.5" strokeWidth="2" />
                                    <path d="M22 10V14" strokeWidth="2" strokeLinecap="round" />
                                    <rect x="4" y="9" width="14" height="6" rx="1" fill="currentColor" stroke="none" />
                                </svg>
                            </div>
                        </div>

                        {/* Browser Bar */}
                        <div className="flex-none bg-slate-50 border-b border-slate-200 px-3 pb-1.5 pt-0 z-20 flex items-center gap-2 shadow-sm relative">
                            {/* Back/Nav Controls */}
                            <div className="flex items-center gap-2.5 pl-1 text-slate-400">
                                <div className="text-[10px] font-serif font-bold text-slate-600 flex items-end">
                                    <span className="text-[8px] leading-none mb-0.5">A</span>
                                    <span className="leading-none">A</span>
                                </div>
                            </div>

                            {/* Address Bar */}
                            <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm h-7 flex items-center justify-center gap-1.5 overflow-hidden text-slate-600">
                                <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM4 8C3.44772 8 3 8.44772 3 9V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V9C21 8.44772 20.5523 8 20 8H4Z" />
                                </svg>
                                <span className="text-[10px] font-medium">civiclens.com</span>
                            </div>

                            {/* Reload */}
                            <div className="flex-none text-slate-400 pr-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                        </div>

                        {/* Website Header */}
                        {/* <div className="flex-none flex items-center justify-between px-4 py-1 bg-white border-b border-slate-50 z-10">
                            <img
                                src="/CivicLensLogo.png"
                                alt="CivicLens"
                                className="h-8 w-auto object-contain"
                            />
                        </div> */}

                        {/* Dynamic Screen Area */}
                        <div className="relative flex-1 px-0 overflow-visible mt-2">
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
