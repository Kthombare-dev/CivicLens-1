import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ImpactChart from './components/ImpactChart';
import IssuesTable from './components/IssuesTable';
import CivicPointsCard from './components/CivicPointsCard';
import PublicFeed from './components/PublicFeed';
import ReportIssue from './components/ReportIssue';
import { useAuth } from '../../context/AuthContext';
import { Star, Box, CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Home');

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-10"
                    >
                        {/* Stat Cards Grid */}
                        <div className="flex gap-8 mt-4">
                            <StatCard
                                title="Issues Reported"
                                value="12"
                                icon={AlertCircle}
                                colorClass="text-[#f59e0b]"
                                iconBgClass="bg-[#fffbeb]"
                            />
                            <StatCard
                                title="Currently In Progress"
                                value="5"
                                icon={Clock}
                                colorClass="text-[#3b82f6]"
                                iconBgClass="bg-[#eff6ff]"
                            />
                            <StatCard
                                title="Issues Resolved"
                                value="42"
                                icon={CheckCircle}
                                colorClass="text-[#10b981]"
                                iconBgClass="bg-[#ecfdf5]"
                            />
                            <StatCard
                                title="Verifications Done"
                                value="15"
                                icon={Shield}
                                colorClass="text-[#6366f1]"
                                iconBgClass="bg-[#f5f3ff]"
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-10">
                            {/* Left Column */}
                            <div className="col-span-8 space-y-10">
                                <ImpactChart />
                            </div>

                            {/* Right Column */}
                            <div className="col-span-4 space-y-10">
                                <CivicPointsCard />
                            </div>
                        </div>
                    </motion.div>
                );
            case 'Report Issue':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="pt-6"
                    >
                        <ReportIssue />
                    </motion.div>
                );
            case 'My Issues':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pt-6"
                    >
                        <IssuesTable />
                    </motion.div>
                );
            case 'Civic Points':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pt-6 max-w-4xl mx-auto"
                    >
                        <CivicPointsCard />
                    </motion.div>
                );
            case 'Public Feed':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pt-6 max-w-4xl mx-auto"
                    >
                        <PublicFeed />
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] overflow-hidden">
            {/* Fixed Sidebar */}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-72 ml-0 h-full overflow-y-auto scroll-smooth">
                <div className="max-w-[1400px] mx-auto lg:px-12 px-6 py-8">
                    <Header
                        userName={user?.name || "Rohit Verma"}
                        location={user?.location || "Vijay Nagar"}
                        activeTab={activeTab}
                    />

                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
