import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Building2, ArrowRight } from 'lucide-react';

const audiences = [
    {
        id: "citizens",
        role: "For Citizens",
        title: "Report, Verify & Earn Civic Value",
        description: "Report civic issues in seconds, track progress transparently, and help verify completed work. Your participation contributes to better services — and is recognized.",
        icon: UserCheck,
        features: [
            { title: "Instant mobile reporting", desc: "Raise issues with photos and auto-detected location in a few taps." },
            { title: "Transparent status tracking", desc: "Follow every update from assignment to resolution in real time." },
            { title: "Civic participation points", desc: "Earn digital points for helping verify resolved issues, which may support municipal benefits such as service bill relaxations, subject to local policies." }
        ],
        color: "emerald"
    },
    {
        id: "authorities",
        role: "For Municipal Authorities",
        title: "Resolve Faster. Recognize Performance.",
        description: "Manage geo-tagged complaints, assign them efficiently, and track resolution timelines through a centralized system that supports accountability and internal recognition.",
        icon: Building2,
        features: [
            { title: "Smart issue routing & assignment", desc: "Automatically route complaints to the right department and assigned staff." },
            { title: "Outcome-based performance tracking", desc: "Resolution timelines and completion quality are recorded to support internal reviews, incentives, and recognition." },
            { title: "Verified closure workflow", desc: "Issues are closed only after work completion and citizen verification." }
        ],
        color: "blue"
    }
];

const BuiltForEveryone = () => {
    return (
        <section className="bg-white py-24 border-t border-slate-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }}
            />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-semibold text-slate-900 tracking-tight mb-6">
                        Built for Everyone
                    </h2>
                    <p className="text-lg text-slate-500 leading-relaxed">
                        A transparent system that empowers citizens and supports municipal teams through shared accountability.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {audiences.map((item, index) => {
                        const Icon = item.icon;
                        const isBlue = item.color === 'blue';
                        return (
                            <motion.div
                                key={item.id}
                                className={`group relative overflow-hidden rounded-3xl p-8 sm:p-10 transition-all duration-300 border flex flex-col h-full ${isBlue ? 'bg-slate-50 border-slate-200 hover:border-blue-200' : 'bg-slate-50 border-slate-200 hover:border-emerald-200'
                                    }`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)" }}
                            >
                                {/* Top Badge */}
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 w-fit ${isBlue ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    <Icon size={14} />
                                    {item.role}
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-black transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 mb-8 leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Feature List */}
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {item.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isBlue ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                                            <div>
                                                <span className="block text-[15px] font-bold text-slate-900 mb-0.5">
                                                    {feat.title}
                                                </span>
                                                <span className="block text-sm text-slate-500/90 leading-snug">
                                                    {feat.desc}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Link */}
                                <div className={`mt-auto flex items-center gap-2 font-semibold text-sm pt-4 ${isBlue ? 'text-blue-600 group-hover:text-blue-700' : 'text-emerald-600 group-hover:text-emerald-700'
                                    }`}>
                                    Learn more
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </div>

                                {/* Decor Blob */}
                                <div className={`absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${isBlue ? 'bg-blue-500' : 'bg-emerald-500'
                                    }`} />
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default BuiltForEveryone;
