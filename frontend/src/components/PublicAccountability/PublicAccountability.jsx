import React from 'react';
import { Eye, FileCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicTransparencyDashboard from './PublicTransparencyDashboard';
import './PublicAccountability.css';

const features = [
    {
        id: 1,
        title: "Publicly Visible",
        description: "Every issue raised is mapped and visible to the entire community, ensuring no complaint goes unnoticed.",
        icon: Eye
    },
    {
        id: 2,
        title: "Verifiable Updates",
        description: "Status changes are recorded immutably. Anyone can verify the timeline and actions taken by authorities.",
        icon: FileCheck
    },
    {
        id: 3,
        title: "Community Driven",
        description: "Resolutions aren't closed unilaterally. Use citizen validation to confirm the work is actually done.",
        icon: Users
    }
];

const PublicAccountability = () => {
    return (
        <section className="pa-section bg-slate-50 py-24" aria-label="Public Accountability">
            <div className="mx-auto max-w-[1200px] px-6">

                {/* Header (Centered) */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl leading-tight mb-4">
                        Public Accountability, Built In
                    </h2>
                    <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                        Every complaint, update, and resolution is publicly visible and verifiable.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">

                    {/* Left: Dashboard Mockup */}
                    <div className="order-last lg:order-first">
                        <PublicTransparencyDashboard />
                    </div>

                    {/* Right: Accountability Content */}
                    <div>
                        {/* Features List */}
                        <div className="space-y-12">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={feature.id}
                                        className="flex items-start gap-4"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600">
                                            <Icon size={24} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{feature.title}</h3>
                                            <p className="text-slate-500 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default PublicAccountability;
