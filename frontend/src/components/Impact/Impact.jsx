import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Quote, TrendingUp, Users, CheckCircle } from 'lucide-react';

// --- Counter Component for Stats ---
const Counter = ({ value, suffix = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-20px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
    const displayValue = useRef(0);

    useEffect(() => {
        if (inView) {
            motionValue.set(value);
        }
    }, [inView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                // Formatting numbers with commas
                const formatted = Math.floor(latest).toLocaleString();
                ref.current.textContent = `${formatted}${suffix}`;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref} className="tabular-nums" />;
};

// --- Impact Section ---
const Impact = () => {
    return (
        <section id="impact" className="relative py-24 bg-slate-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 relative z-10">

                {/* Header */}
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6"
                    >
                        Real Impact, <span className="text-emerald-600">Real Voices</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
                    >
                        CivicLens is helping citizens raise issues, track progress, and restore trust through transparent and verifiable civic action.
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="mb-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {[
                        { label: "Active Citizens", value: 1000, suffix: "+", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Verified Resolution", value: 95, suffix: "%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Avg. Response Time", value: 48, suffix: " hrs", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_20px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-transform duration-300 flex flex-col items-center justify-center text-center"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                                <stat.icon size={26} strokeWidth={2} />
                            </div>
                            <div className="text-5xl font-bold text-slate-900 mb-2 tracking-tight">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Reviews (Masonry/Bento Style) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

                    {/* Review 1 - Large Box (Span 7) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-7 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className="absolute top-8 right-8 pointer-events-none">
                            <Quote size={80} className="text-emerald-100/50 fill-emerald-50" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xl md:text-2xl font-medium text-slate-800 leading-normal mb-8 pr-12">
                                "Earlier, complaints felt like they disappeared. With CivicLens, I could track every update and verify the work myself. It feels empowering to actually see the change happen."
                            </p>
                        </div>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-500">R</div>
                            <div>
                                <p className="font-bold text-slate-900">Rohit Verma</p>
                                <p className="text-slate-500 text-sm">Resident, Vijay Nagar</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Review 2 - Small Box (Span 5) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className="relative z-10">
                            <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed mb-8">
                                "The transparency is what stood out. Once the issue was marked resolved, multiple citizens could verify it. That builds real trust."
                            </p>
                        </div>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-lg font-bold text-slate-300">A</div>
                            <div>
                                <p className="font-bold text-white">Anita Sharma</p>
                                <p className="text-slate-400 text-sm">Resident, Palasia</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Review 3 - Full Width or Centered (Span 12) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-12 bg-emerald-50/60 rounded-3xl p-8 md:px-16 md:py-12 border border-emerald-100/50 shadow-sm text-center"
                    >
                        <p className="text-xl md:text-2xl font-serif italic text-slate-800 leading-relaxed max-w-4xl mx-auto mb-8">
                            "I like that participation matters. Verifying resolved issues earns civic points, which actually encourages people to stay involved in their own neighborhoods."
                        </p>
                        <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-600">S</div>
                            <div className="text-left">
                                <span className="block font-bold text-slate-900 text-sm leading-tight">Suresh Patel</span>
                                <span className="block text-slate-500 text-xs leading-tight">Resident, Rajwada</span>
                            </div>
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default Impact;
