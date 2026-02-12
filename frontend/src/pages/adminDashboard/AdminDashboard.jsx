import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import StatCardsGrid from './components/StatCards';
import ComplaintManagement from './components/ComplaintManagement';
import AnalyticsPanels from './components/AnalyticsPanels';
import UserManagement from './components/UserManagement';
import OfficerManagement from './components/OfficerManagement';
import AssignOfficerPanel from './components/AssignOfficerPanel';
import { adminService } from '../../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [officers, setOfficers] = useState([]);
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
                const [stats, complaints, analytics, users, officersList] = await Promise.all([
                    adminService.getStats(),
                    adminService.getRecentComplaints(),
                    adminService.getAnalytics(),
                    adminService.getUsers(),
                    adminService.getOfficers()
                ]);

                setData({ stats, complaints, analytics, users });
                setOfficers(officersList);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleAssignOfficer = (officerId) => {
        // Logic to update complaint status and assigned officer
        console.log(`Assigning officer ${officerId} to complaint ${selectedComplaint.id}`);

        setData(prev => ({
            ...prev,
            complaints: prev.complaints.map(c =>
                c.id === selectedComplaint.id
                    ? { ...c, status: 'Assigned', assignedTo: officers.find(o => o.id === officerId).name }
                    : c
            )
        }));

        setSelectedComplaint(null);
    };

    const handleUpdateStatus = (complaintId, newStatus) => {
        setData(prev => ({
            ...prev,
            complaints: prev.complaints.map(c =>
                c.id === complaintId
                    ? { ...c, status: newStatus }
                    : c
            )
        }));
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
                                complaints={data.complaints}
                                onAssignClick={(complaint) => setSelectedComplaint(complaint)}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        </div>
                        <AnimatePresence>
                            {selectedComplaint && (
                                <div className="lg:col-span-4 h-full">
                                    <AssignOfficerPanel
                                        isOpen={!!selectedComplaint}
                                        onClose={() => setSelectedComplaint(null)}
                                        selectedComplaint={selectedComplaint}
                                        officers={officers}
                                        onAssign={handleAssignOfficer}
                                    />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            case 'users':
                return <UserManagement users={data.users} />;
            case 'officers':
                return <OfficerManagement officers={officers} />;
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
        </div>
    );
};

export default AdminDashboard;
