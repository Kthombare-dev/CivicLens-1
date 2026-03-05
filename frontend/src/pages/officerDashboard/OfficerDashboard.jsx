import React, { useState } from 'react';
import {
    LayoutDashboard,
    ClipboardList,
    CheckSquare,
    Bell,
    User as UserIcon,
    LogOut,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Hourglass,
    CheckCircle,
    AlertCircle,
    Menu,
    TrendingUp,
    Clock,
    MapPin,
    Calendar,
    Image as ImageIcon,
    Upload,
    X,
    User,
    Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfficerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    // Mock data
    const stats = [
        { label: 'Assigned Complaints', count: 23, icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Complaints In Progress', count: 16, icon: Hourglass, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Resolved Complaints', count: 42, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Pending Complaints', count: 7, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Pending Updates', count: 7, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    ];

    const assignedComplaints = [
        { id: 'CMP-0485', category: 'Garbage Overflow', location: 'City Park', description: 'A garbage bin is overflowing in the city park, waste spilling onto the ground.', status: 'Submitted', statusColor: 'bg-amber-100 text-amber-700', date: 'Apr 22, 2024, 04:15 PM', reporter: 'John Doe', reporterEmail: 'john.doe@gmail.com', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400', phone: '+91 98765 43210' },
        { id: 'CMP-0484', category: 'Broken Streetlight', location: 'Lakeview Area', description: 'Streetlight pole #45 is flickering and periodically goes dark.', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700', date: 'Apr 21, 2024, 09:30 AM', reporter: 'Alex Walker', reporterEmail: 'alex.w@yahoo.com', image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=400', phone: '+91 76543 21098' },
        { id: 'CMP-0483', category: 'Water Leakage', location: 'Station Area', description: 'Underground pipe burst near the main entrance.', status: 'Submitted', statusColor: 'bg-amber-100 text-amber-700', date: 'Apr 20, 2024, 11:20 AM', reporter: 'Sam Wilson' },
        { id: 'CMP-0482', category: 'Pothole', location: 'Aurora Ave', description: 'Large pothole causing traffic slowdowns.', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700', date: 'Apr 19, 2024, 02:45 PM', reporter: 'Sarah Chen' },
        { id: 'CMP-0481', category: 'Unsanitary Area', location: 'Market Square', description: 'Accumulated waste behind the market stalls.', status: 'Resolved', statusColor: 'bg-emerald-100 text-emerald-700', date: 'Apr 18, 2024, 05:00 PM', reporter: 'John Doe' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'resolved', name: 'Resolved Complaints', icon: CheckSquare },
        { id: 'performance', name: 'My Performance', icon: TrendingUp },
        { id: 'notifications', name: 'Notifications', icon: Bell, badge: '2' },
        { id: 'profile', name: 'Profile', icon: UserIcon },
    ];

    const Sidebar = () => (
        <aside className={`w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-50 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex justify-center px-6 pt-4 pb-0">
                <img
                    src="/CivicLensLogo.png"
                    alt="CivicLens Logo"
                    className="h-28 w-auto object-contain"
                />
            </div>

            <nav className="flex-1 px-6 pt-4 space-y-3">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-[#f0fdf4] text-[#10b981]'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                }`}
                        >
                            <item.icon className={`w-5.5 h-5.5 ${isActive ? 'text-[#10b981]' : 'text-slate-400'}`} />
                            <span className="text-[16px] font-bold flex-1 text-left">{item.name}</span>
                            {item.badge && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="px-5 py-8 space-y-6 bg-white border-t border-slate-50/50">
                <div className="space-y-4">
                    <h4 className="px-5 text-[12px] font-bold uppercase tracking-wider text-slate-400/80">Account</h4>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-medium">
                            <UserIcon className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                            <span className="text-[15px]">Profile & Settings</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                        >
                            <LogOut className="w-5 h-5" strokeWidth={1.5} />
                            <span className="text-[15px]">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif]">

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <Sidebar />

            {/* Content Area */}
            <div className="flex-1 flex flex-col transition-all duration-300 lg:pl-64">

                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
                            <Menu className="w-6 h-6 text-slate-600" />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">
                            Officer <span className="text-emerald-600">Dashboard</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                2
                            </span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'Michael Brown'}</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{user?.department || 'Department Officer'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-emerald-50 overflow-hidden">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Michael Brown'}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">

                    <div className="flex flex-col gap-10">

                        {/* Top Section: Welcome & Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Intelligence <span className="text-emerald-600">Overview</span></h2>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Welcome back to CivicLens Operations</p>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-50">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-slate-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className={`p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group hover:shadow-lg ${stat.bg} border-slate-50`}>
                                        <div className={`p-4 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform flex-shrink-0 ${stat.color}`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-0.5 whitespace-nowrap">{stat.label}</p>
                                            <h3 className="text-xl font-black text-slate-800 tabular-nums leading-none">{stat.count}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Left Column: Complaints Table */}
                            <div className="flex-1 space-y-10">
                                {activeTab === 'dashboard' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-10"
                                    >
                                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden flex flex-col">
                                            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Assigned Complaints</h3>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">23 items currently active</p>
                                                </div>
                                                <div className="relative max-w-sm w-full">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        placeholder="Quick search filter..."
                                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-300 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse min-w-[800px]">
                                                    <thead>
                                                        <tr className="border-b border-slate-50 bg-slate-50/20">
                                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                                                            <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                                                            <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</th>
                                                            <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {assignedComplaints.map((item, idx) => (
                                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedComplaint(item)}>
                                                                <td className="px-8 py-5">
                                                                    <span className="text-[12px] font-black text-slate-800 tracking-wider font-mono">{item.id}</span>
                                                                </td>
                                                                <td className="px-4 py-5">
                                                                    <span className="text-[13px] font-bold text-slate-600">{item.category}</span>
                                                                </td>
                                                                <td className="px-4 py-5">
                                                                    <div className="flex items-center gap-2">
                                                                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                                                        <span className="text-[13px] font-bold text-slate-500 truncate max-w-[150px]">{item.location}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-5">
                                                                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                        item.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                                        }`}>
                                                                        {item.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-5 text-right">
                                                                    <button
                                                                        className="px-5 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                                                                    >
                                                                        Details
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing 5 of 23 active tasks</p>
                                                <div className="flex gap-2">
                                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-500/20">1</button>
                                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"><ChevronRight className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* COMPLAINT DETAILS SECTION (Admin-style inline) */}
                                        <AnimatePresence>
                                            {selectedComplaint && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
                                                >
                                                    <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-emerald-500 rounded-lg"><ClipboardList className="w-5 h-5 text-white" /></div>
                                                                <h3 className="text-xl font-black tracking-tight">{selectedComplaint.id}</h3>
                                                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">{selectedComplaint.status}</span>
                                                            </div>
                                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Detailed Intelligence Assessment</p>
                                                        </div>
                                                        <button onClick={() => setSelectedComplaint(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><X className="w-5 h-5" /></button>
                                                    </div>

                                                    <div className="p-8">
                                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                                            <div className="lg:col-span-5">
                                                                <div className="aspect-video lg:aspect-square rounded-2xl bg-slate-100 border border-slate-100 overflow-hidden relative shadow-inner group">
                                                                    <img src={selectedComplaint.image} alt="Evidence" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                                                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"><ImageIcon className="w-5 h-5" /></div>
                                                                        <p className="text-xs font-bold text-white uppercase tracking-widest">Assessment Image</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="lg:col-span-7 space-y-10">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                    <div className="space-y-4">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Location</span>
                                                                            <span className="text-lg font-black text-slate-800 mt-1">{selectedComplaint.location}</span>
                                                                        </div>
                                                                        <div className="flex flex-col px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Reporter Information</span>
                                                                            <div className="flex items-center gap-3 mt-2">
                                                                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400"><UserIcon className="w-4 h-4" /></div>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-sm font-black text-slate-700 leading-none">{selectedComplaint.reporter}</span>
                                                                                    <span className="text-[10px] font-bold text-slate-400 mt-1 leading-none">Citizen Reporting</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-4">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Registered</span>
                                                                            <span className="text-sm font-bold text-slate-800 mt-1">{selectedComplaint.date}</span>
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Category</span>
                                                                            <div className="flex items-center gap-2 mt-2">
                                                                                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Info className="w-3.5 h-3.5" /></div>
                                                                                <span className="text-sm font-black text-slate-700">{selectedComplaint.category}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence Report</span>
                                                                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group transition-all hover:bg-white hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/5">
                                                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">"{selectedComplaint.description}"</p>
                                                                        <TrendingUp className="absolute right-6 top-6 w-10 h-10 text-emerald-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
                                                                    </div>
                                                                </div>

                                                                <div className="bg-emerald-50/30 p-8 rounded-3xl border border-emerald-100/50 relative overflow-hidden">
                                                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                                        <div className="space-y-2">
                                                                            <h4 className="text-lg font-black text-slate-800">Operational Update</h4>
                                                                            <p className="text-xs font-bold text-slate-500">Provide resolution evidence and update task status.</p>
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-4">
                                                                            <div className="relative">
                                                                                <select className="pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 appearance-none min-w-[160px] shadow-sm cursor-pointer transition-all">
                                                                                    <option>In Progress</option>
                                                                                    <option>Resolved</option>
                                                                                    <option>On Hold</option>
                                                                                </select>
                                                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                                            </div>
                                                                            <button className="px-8 py-3.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">Commit Resolution</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {activeTab !== 'dashboard' && (
                                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
                                        <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl">
                                            <TrendingUp className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h3>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-xs leading-relaxed">Intelligence gathering and processing for this sector is currently in development phase.</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Widgets */}
                            <div className="lg:w-80 space-y-10">
                                {/* My Performance Widget */}
                                <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 group hover:shadow-lg transition-all">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-[0.2em]">Efficiency</h3>
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Daily Resolved</p>
                                                <span className="text-xl font-black text-slate-800 tabular-nums">03</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                            <div className="w-[65%] h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notifications Widget */}
                                <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-[0.2em]">Live Feed</h3>
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    </div>
                                    <div className="space-y-8 relative">
                                        <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-slate-50"></div>
                                        <div className="relative pl-8 flex flex-col gap-1 group cursor-pointer">
                                            <div className="absolute left-0 top-1.5 w-[10px] h-[10px] rounded-full bg-emerald-500 border-2 border-white shadow-sm ring-4 ring-emerald-50 group-hover:scale-125 transition-all"></div>
                                            <p className="text-[13px] font-bold text-slate-700 leading-tight">New high-priority incident assigned</p>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">08:42 AM</span>
                                        </div>
                                        <div className="relative pl-8 flex flex-col gap-1 group cursor-pointer">
                                            <div className="absolute left-0 top-1.5 w-[10px] h-[10px] rounded-full bg-slate-300 border-2 border-white shadow-sm ring-4 ring-slate-50 group-hover:scale-125 transition-all"></div>
                                            <p className="text-[13px] font-bold text-slate-500 leading-tight">Monthly performance report ready</p>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">2 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                </main>

                <footer className="p-8 pb-12 flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-50">
                    <div className="flex items-center gap-6">
                        <span>© 2025 CivicLens</span>
                        <span className="h-4 w-[1px] bg-slate-200"></span>
                        <span>Officer Accountability System</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hover:text-emerald-600 transition-colors">Privacy Policy</button>
                        <button className="hover:text-emerald-600 transition-colors">Terms of Service</button>
                    </div>
                </footer>

            </div>
        </div>
    );
}
