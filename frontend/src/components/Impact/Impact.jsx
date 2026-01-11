import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { id: 1, value: "10,000+", label: "Citizens engaged" },
    { id: 2, value: "95%", label: "Verified resolution rate" },
    { id: 3, value: "3 Cities", label: "Live municipal deployments" }
];

const Impact = () => {
    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-3">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Decorative line for mobile separation, hidden on last item/desktop */}
                            {index !== stats.length - 1 && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:block w-px h-12 bg-slate-200" style={{ right: '-1.5rem' }} />
                            )}

                            <dt className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                                {stat.value}
                            </dt>
                            <dd className="text-base sm:text-lg font-medium text-slate-500">
                                {stat.label}
                            </dd>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Impact;
