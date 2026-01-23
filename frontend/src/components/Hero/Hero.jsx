import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PhoneMockup from "../PhoneMockup/PhoneMockup";
import { AvatarCircles } from "../ui/avatar-circles";

export default function Hero() {
    const navigate = useNavigate();
    return (
        <section id="home" className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 lg:py-24 isolate">
            {/* --- Background Layers --- */}

            {/* 3. Noise Overlay - Reduced Opacity & Changed to simple CSS grain if possible, but keeping SVG with lower opacity */}
            <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
                }}
            />

            {/* 4. Abstract Civic Pattern (Subtle Grid) */}
            <div className="absolute inset-0 z-0 opacity-[0.3]"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* 2. Split-Focus Gradient (Neutral Left) */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white blur-[80px] rounded-full z-0 pointer-events-none opacity-60" />

            {/* 1. Soft Radial Gradient (Glow behind Phone - Right) */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-emerald-400/10 blur-[100px] rounded-full z-0 pointer-events-none"
            />

            {/* 5. Light Vignette */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(transparent_0%,_transparent_50%,_rgba(248,250,252,0.8)_90%,_#f8fafc_100%)]" />


            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                {/* GRID LAYOUT: Changed lg:grid-cols-2 to md:grid-cols-2 to ensure side-by-side on smaller laptops */}
                <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-24">

                    {/* Left content: Text Data */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-start text-left order-1 max-w-xl lg:max-w-none"
                    >
                        {/* 2 Badge: Modern Pill */}
                        <div className="mb-6 inline-flex items-center rounded-full bg-white px-4 py-1.5 border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:border-emerald-200 hover:shadow-emerald-500/10">
                            <span className="relative flex h-2.5 w-2.5 mr-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 animate-pulse"></span>
                            </span>
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                                Live In Your City
                            </span>
                        </div>

                        {/* 1 Headline: Modern Typography */}
                        <h1 className="text-5xl tracking-tight sm:text-7xl text-balance w-full font-sans">
                            <span className="block font-medium text-slate-800 mb-2">
                                See Civic Issues.
                            </span>
                            <span className="block font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 pb-3 drop-shadow-sm">
                                Track Action.
                            </span>
                            <span className="block text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-600 mt-1 tracking-tight whitespace-nowrap">
                                Ensure Accountability.
                            </span>
                        </h1>

                        {/* Proof-driven micro-line */}
                        <p className="mt-4 text-sm font-bold text-emerald-700 flex items-center gap-2 tracking-wide">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>100% Verified Public Record</span>
                        </p>

                        {/* 3 Paragraph: Better Readability */}
                        <p className="mt-6 text-xl leading-loose text-slate-500 max-w-md font-light">
                            CivicLens empowers citizens to report local issues and track their resolution transparently. Join the community restoring trust in city administration.
                        </p>

                        {/* 4 CTA Section: Premium Buttons */}
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="group relative rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <span className="relative">Start Reporting</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ x: 4 }}
                                onClick={() => navigate('/dashboard')}
                                className="group text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                View Dashboard
                                <span aria-hidden="true" className="text-emerald-500 transition-transform group-hover:translate-x-1">→</span>
                            </motion.button>
                        </div>

                        {/* 7 Trust Indicator: Avatars */}
                        <div className="mt-6 flex items-center gap-5 border-t border-slate-100 pt-4 w-full max-w-md">
                            <AvatarCircles
                                numPeople={100}
                                avatarUrls={[
                                    { imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop", profileUrl: "#" },
                                    { imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop", profileUrl: "#" },
                                    { imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop", profileUrl: "#" },
                                    { imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop", profileUrl: "#" }
                                ]}
                            />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-slate-800 leading-none">1000+</span>
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Citizens Trusted</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right mockup: PhoneMockup */}
                    <div className="relative flex justify-center md:justify-end order-2"> {/* Explicit order 2 and md:justify-end */}
                        <PhoneMockup />
                    </div>
                </div>
            </div>
        </section>
    );
}
