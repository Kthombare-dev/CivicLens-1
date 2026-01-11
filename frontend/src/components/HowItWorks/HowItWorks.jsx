import React, { useState } from 'react';
import { Camera, Building2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './HowItWorks.css';

const steps = [
    {
        id: 1,
        title: "Report an Issue",
        description: "Report civic issues with photo and location",
        icon: Camera, // Pass component, not element, for animation
        iconAnimation: { scale: [1, 1.15, 1], transition: { duration: 0.6, times: [0, 0.5, 1], delay: 0.5 } }
    },
    {
        id: 2,
        title: "Smart Assignment",
        description: "Automatically routed to the responsible department",
        icon: Building2,
        iconAnimation: { y: [0, -4, 0], transition: { duration: 0.6, times: [0, 0.5, 1], delay: 0.65 } }
    },
    {
        id: 3,
        title: "Transparent Tracking",
        description: "Track progress with real-time public updates",
        icon: Clock,
        iconAnimation: { rotate: [0, 25, 0], transition: { duration: 0.6, times: [0, 0.5, 1], delay: 0.8 } }
    },
    {
        id: 4,
        title: "Verified Resolution",
        description: "Resolution verified by citizens and records",
        icon: ShieldCheck,
        iconAnimation: { scale: [1, 1.15, 1], transition: { duration: 0.6, times: [0, 0.5, 1], delay: 0.95 } }
    }
];

const HowItWorks = () => {
    const [hoveredStep, setHoveredStep] = useState(null);

    return (
        <section id="how-it-works" className="hiw-section" aria-label="How CivicLens Works">
            <div className="hiw-container">

                {/* Section Header */}
                <motion.div
                    className="hiw-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">How CivicLens Works</h2>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">A transparent, citizen-first complaint lifecycle</p>
                </motion.div>

                {/* Steps Flow */}
                <div className="hiw-steps-flow">
                    {steps.map((step, index) => {
                        const isCardHovered = hoveredStep === index;
                        const isNextConnectorActive = hoveredStep === index + 1;
                        const IconComponent = step.icon;

                        const handleMouseMove = (e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                        };

                        return (
                            <React.Fragment key={step.id}>
                                {/* Step Card */}
                                <motion.div
                                    className={`hiw-step-card ${isCardHovered ? 'hovered' : ''}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    onMouseEnter={() => setHoveredStep(index)}
                                    onMouseLeave={() => setHoveredStep(null)}
                                    onMouseMove={handleMouseMove}
                                >
                                    <div className={`hiw-icon-container ${isCardHovered ? 'active' : ''}`}>
                                        <motion.div
                                            whileInView={step.iconAnimation}
                                            viewport={{ once: true }}
                                        >
                                            <IconComponent strokeWidth={1.5} size={28} />
                                        </motion.div>
                                    </div>

                                    {/* Number Fade In */}
                                    <motion.span
                                        className={`hiw-step-number ${isCardHovered ? 'active' : ''}`}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                                    >
                                        0{step.id}
                                    </motion.span>

                                    <h3 className="hiw-card-title">{step.title}</h3>
                                    <p className="hiw-card-desc">{step.description}</p>
                                    <div className="hiw-glow" />
                                </motion.div>

                                {/* Connector */}
                                {index < steps.length - 1 && (
                                    <motion.div
                                        className={`hiw-connector-wrapper ${isNextConnectorActive ? 'active' : ''}`}
                                        initial={{ opacity: 0.1 }} // Start faint
                                        whileInView={{ opacity: 0.3 }} // Fade to normal state
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                                    >
                                        <div className="hiw-connector-line">
                                            {/* Storytelling Line: Animates once on load */}
                                            <motion.div
                                                className="hiw-connector-story-line"
                                                initial={{ width: "0%" }}
                                                whileInView={{ width: "100%" }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, delay: index * 0.15 + 0.4, ease: "easeInOut" }}
                                            />
                                        </div>
                                        <ChevronRight className="hiw-arrow" size={16} />
                                    </motion.div>
                                )}
                            </React.Fragment>
                        )
                    })}
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;
