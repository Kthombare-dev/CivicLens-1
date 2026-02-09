import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import StatCardsGrid from './components/StatCards';
import RecentComplaints from './components/RecentComplaints';
import AnalyticsPanels from './components/AnalyticsPanels';
import UserManagement from './components/UserManagement';
import { adminService } from '../../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        stats: null,
        complaints: [],
        analytics: null,
        users: []
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [stats, complaints, analytics, users] = await Promise.all([
                    adminService.getStats(),
                    adminService.getRecentComplaints(),
                    adminService.getAnalytics(),
                    adminService.getUsers()
                ]);

                setData({ stats, complaints, analytics, users });
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Intelligence...</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'dashboard':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <StatCardsGrid stats={data.stats} />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-8">
                                <RecentComplaints complaints={data.complaints} />
                                <UserManagement users={data.users} />
                            </div>
                            <div className="lg:col-span-4">
                                <AnalyticsPanels analytics={data.analytics} />
                            </div>
                        </div>
                    </motion.div>
                );
            case 'complaints':
                return <RecentComplaints complaints={data.complaints} />;
            case 'users':
                return <UserManagement users={data.users} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif]">
            {/* Sidebar for Desktop */}
            <div className={`hidden lg:block`}>
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Mobile Sidebar (Collapsible) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -288 }}
                            animate={{ x: 0 }}
                            exit={{ x: -288 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 lg:hidden"
                        >
                            <Sidebar
                                activeTab={activeTab}
                                onTabChange={(tab) => {
                                    setActiveTab(tab);
                                    setIsSidebarOpen(false);
                                }}
                                isOpen={true}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>

                <TopNavbar
                    title={activeTab}
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
                    {renderTabContent()}
                </div>

                <footer className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-slate-50">
                    <p>© 2025 CivicLens | All rights reserved. | Privacy Policy | Terms and Conditions</p>
                </footer>
            </main>
        </div>
    );
};

export default AdminDashboard;
