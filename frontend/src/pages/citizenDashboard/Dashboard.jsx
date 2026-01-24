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
import { Star, Box, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                        <div className="flex gap-8 mt-6 overflow-x-auto pb-4 lg:pb-0">
                            <StatCard
                                title="Active issues"
                                value="5"
                                icon={Box}
                                colorClass="text-[#3b82f6]"
                                iconBgClass="bg-[#eff6ff]"
                            />
                            <StatCard
                                title="Resolved"
                                value="14"
                                icon={CheckCircle}
                                colorClass="text-[#10b981]"
                                iconBgClass="bg-[#ecfdf5]"
                            />
                            <StatCard
                                title="Civic points"
                                value="220"
                                icon={Star}
                                colorClass="text-[#f59e0b]"
                                iconBgClass="bg-[#fffbeb]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                            {/* Left Column */}
                            <div className="col-span-1 md:col-span-8 space-y-10">
                                <ImpactChart />
                                <IssuesTable />
                            </div>

                            {/* Right Column */}
                            <div className="col-span-1 md:col-span-4 space-y-10">
                                <CivicPointsCard />
                                <PublicFeed />
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
                        className="pt-6"
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
                        className="pt-6"
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
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden glass"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    setIsSidebarOpen(false);
                }}
                isOpen={isSidebarOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-72 h-full overflow-y-auto scroll-smooth w-full bg-[#f8fafc]">
                <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
                    <Header
                        userName={user?.name || "Rohit Verma"}
                        location={user?.location || "Vijay Nagar"}
                        activeTab={activeTab}
                        onMenuClick={() => setIsSidebarOpen(true)}
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
