import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ImpactChart from './components/ImpactChart';
import IssuesTable from './components/IssuesTable';
import CivicPointsCard from './components/CivicPointsCard';
import PublicFeed from './components/PublicFeed';
import ReportIssue from './components/ReportIssue';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { Star, Box, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await complaintService.getDashboardData();
            setDashboardData(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Refresh dashboard when switching to Home tab (but not on initial mount)
    const isInitialMount = React.useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (activeTab === 'Home') {
            fetchDashboardData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

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
                                value={dashboardData?.statistics?.activeIssues?.toString() || "0"}
                                icon={Box}
                                colorClass="text-[#3b82f6]"
                                iconBgClass="bg-[#eff6ff]"
                            />
                            <StatCard
                                title="Resolved"
                                value={dashboardData?.statistics?.resolvedIssues?.toString() || "0"}
                                icon={CheckCircle}
                                colorClass="text-[#10b981]"
                                iconBgClass="bg-[#ecfdf5]"
                            />
                            <StatCard
                                title="Civic points"
                                value={dashboardData?.statistics?.civicPoints?.toString() || "0"}
                                icon={Star}
                                colorClass="text-[#f59e0b]"
                                iconBgClass="bg-[#fffbeb]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                            {/* Left Column */}
                            <div className="col-span-1 md:col-span-8 space-y-10">
                                <ImpactChart data={dashboardData?.impactGraph?.weeks || []} />
                                <IssuesTable />
                            </div>

                            {/* Right Column */}
                            <div className="col-span-1 md:col-span-4 space-y-10">
                                <CivicPointsCard 
                                    totalPoints={dashboardData?.statistics?.civicPoints || 0}
                                    activities={dashboardData?.recentActivities || []}
                                />
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
                        <CivicPointsCard 
                            totalPoints={dashboardData?.statistics?.civicPoints || 0}
                            activities={dashboardData?.recentActivities || []}
                        />
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
                        userName={dashboardData?.user?.name || user?.name || "User"}
                        location={dashboardData?.user?.location || user?.location || "Location not available"}
                        activeTab={activeTab}
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />


                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-slate-400 font-medium">Loading dashboard...</div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-red-500 font-medium">Error: {error}</div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {renderContent()}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
