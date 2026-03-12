import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import StatCardsGrid from './components/StatCards';
import ComplaintManagement from './components/ComplaintManagement';
import AnalyticsPanels from './components/AnalyticsPanels';
import UserManagement from './components/UserManagement';
import OfficerManagement from './components/OfficerManagement';
import AssignOfficerPanel from './components/AssignOfficerPanel';
import AdminComplaintDetails from './components/AdminComplaintDetails';
import { adminService } from '../../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [viewingComplaint, setViewingComplaint] = useState(null);
    const [complaintRefreshKey, setComplaintRefreshKey] = useState(0);
    const [data, setData] = useState({ stats: null, analytics: null });

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            const [statsResult, analyticsResult] = await Promise.allSettled([
                adminService.getStats(),
                adminService.getAnalytics(),
            ]);

            if (statsResult.status === 'rejected')
                console.error('Error fetching stats:', statsResult.reason);
            if (analyticsResult.status === 'rejected')
                console.error('Error fetching analytics:', analyticsResult.reason);

            setData({
                stats:     statsResult.status     === 'fulfilled' ? statsResult.value     : null,
                analytics: analyticsResult.status === 'fulfilled' ? analyticsResult.value : null,
            });
            setLoading(false);
        };

        fetchAllData();
    }, []);

    const handleAssignOfficer = async (officerId) => {
        if (!selectedComplaint) return;
        try {
            await adminService.assignOfficer(selectedComplaint._id, officerId);
            setSelectedComplaint(null);
            // Increment key so ComplaintManagement re-fetches its current page
            setComplaintRefreshKey(k => k + 1);
        } catch (error) {
            // Re-throw so AssignOfficerPanel can show the error
            throw error;
        }
    };

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
                        className="space-y-10"
                    >
                        <StatCardsGrid stats={data.stats} />

                        <div className="grid grid-cols-1 gap-10">
                            <AnalyticsPanels analytics={data.analytics} />
                        </div>
                    </motion.div>
                );
            case 'complaints':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className={`${selectedComplaint ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-500`}>
                            <ComplaintManagement
                                onAssignClick={complaint => setSelectedComplaint(complaint)}
                                onViewDetails={complaint => setViewingComplaint(complaint)}
                                refreshKey={complaintRefreshKey}
                            />
                        </div>
                        <AnimatePresence>
                            {selectedComplaint && (
                                <div className="lg:col-span-4 h-full">
                                    <AssignOfficerPanel
                                        isOpen={!!selectedComplaint}
                                        onClose={() => setSelectedComplaint(null)}
                                        selectedComplaint={selectedComplaint}
                                        onAssign={handleAssignOfficer}
                                    />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            case 'users':
                return <UserManagement />;
            case 'officers':
                return <OfficerManagement />;
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
            <main className="transition-all duration-300 lg:pl-64">

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

            <AdminComplaintDetails 
                complaint={viewingComplaint} 
                onClose={() => setViewingComplaint(null)} 
            />
        </div>
    );
};

export default AdminDashboard;
