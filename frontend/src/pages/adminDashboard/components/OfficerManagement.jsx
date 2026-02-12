import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, Edit2, ChevronLeft, ChevronRight, X, User, Mail, Briefcase, Phone, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfficerModal = ({ isOpen, onClose, officer, onSave, pool }) => {
    const [formData, setFormData] = useState(
        officer || { name: '', email: '', department: '', phone: '', id: null }
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (officer) setFormData(officer);
        else setFormData({ name: '', email: '', department: '', phone: '', id: null });
    }, [officer, isOpen]);

    if (!isOpen) return null;

    const isEdit = !!officer;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-visible"
            >
                <div className="p-10 pb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">
                            {isEdit ? 'Update Profile' : 'Select Officer for Deployment'}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">
                            {isEdit ? 'MODIFIED EXISTING OFFICER' : 'AVAILABLE IN RECRUITMENT POOL'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-2xl transition-colors text-slate-300 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form className="p-10 pt-4 space-y-8" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
                    <div className="space-y-6">
                        {/* Custom Dropdown for Full Name */}
                        <div className="space-y-2.5 relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>

                            {isEdit ? (
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        disabled
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[15px] font-bold text-slate-400 cursor-not-allowed opacity-70"
                                        value={formData.name}
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full pl-14 pr-12 py-4 bg-white border-2 transition-all rounded-2xl text-left flex items-center justify-between ${isDropdownOpen ? 'border-slate-800 ring-4 ring-slate-100' : 'border-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <User className={`w-4 h-4 ${formData.name ? 'text-slate-800' : 'text-slate-400'}`} />
                                            <span className={`text-[15px] font-bold ${formData.name ? 'text-slate-800' : 'text-slate-400'}`}>
                                                {formData.name || 'Select from Recruit List'}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[24px] shadow-2xl py-3 z-50 max-h-[300px] overflow-y-auto custom-scrollbar"
                                                >
                                                    {pool.length > 0 ? pool.map(p => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, ...p });
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="w-full px-6 py-4 hover:bg-slate-50 transition-colors flex flex-col text-left group"
                                                        >
                                                            <span className="text-[15px] font-black text-slate-800 group-hover:text-[#4B958E] transition-colors">{p.name}</span>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[11px] font-bold text-slate-400">{p.email}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                                <span className="text-[11px] font-bold text-slate-400">{p.department}</span>
                                                            </div>
                                                        </button>
                                                    )) : (
                                                        <div className="px-6 py-8 text-center">
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No candidates available</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[15px] font-bold text-slate-600 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        required
                                        pattern="[6-9]{1}[0-9]{9}"
                                        maxLength="10"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[15px] font-bold text-slate-600 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                                        placeholder="10-digit number"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 10) setFormData({ ...formData, phone: val });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Department</label>
                            <div className="relative">
                                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    required
                                    className="w-full pl-14 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[15px] font-bold text-slate-600 appearance-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all cursor-pointer"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                >
                                    <option value="" disabled>Select Department</option>
                                    <option value="Sanitation">Sanitation</option>
                                    <option value="Water">Water</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Roads">Roads</option>
                                    <option value="Field Officer">Field Officer</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-8 py-5 bg-[#0B4D34] hover:bg-[#073926] text-white rounded-[20px] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
                        >
                            <Save className="w-5 h-5 text-emerald-200" />
                            <span>{isEdit ? 'Update profile' : 'Deploy officer'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const OfficerManagement = ({ officers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [managedOfficerIds, setManagedOfficerIds] = useState(['OFF001', 'OFF002', 'OFF003', 'OFF004']);
    const [officerStatuses, setOfficerStatuses] = useState(
        officers.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.status || 'Active' }), {})
    );

    // Officers currently in the management table
    const managedOfficers = officers.filter(o => managedOfficerIds.includes(o.id));

    // Officers available to be added
    const recruitmentPool = officers.filter(o => !managedOfficerIds.includes(o.id));

    const filteredOfficers = managedOfficers.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = (data) => {
        if (!managedOfficerIds.includes(data.id)) {
            setManagedOfficerIds(prev => [...prev, data.id]);
            setOfficerStatuses(prev => ({ ...prev, [data.id]: 'Active' }));
        }
        setIsModalOpen(false);
    };



    return (
        <>
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white">
                    <div>
                        <h3 className="text-[24px] font-black text-slate-800 tracking-tight leading-none">Officer Management</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3">Administrative Control Panel</p>
                    </div>
                    <button
                        onClick={() => { setSelectedOfficer(null); setIsModalOpen(true); }}
                        className="flex items-center gap-3 px-8 py-3.5 bg-[#4B958E] hover:bg-[#3D7A74] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-900/10"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Officer</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Name</th>

                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOfficers.map((officer) => {
                                const status = officerStatuses[officer.id] || 'Active';
                                const isActive = status === 'Active';

                                return (
                                    <tr key={officer.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="text-[12px] font-black text-slate-400 font-mono tracking-wider">{officer.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-[#4B958E] text-xs">
                                                    {officer.name.charAt(0)}
                                                </div>
                                                <span className="text-[14px] font-black text-slate-700 tracking-tight">{officer.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`} />
                                                {status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">

                                                <button
                                                    onClick={() => { setSelectedOfficer(officer); setIsModalOpen(true); }}
                                                    className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all group-hover:scale-105"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI matching the reference image */}
                <div className="p-6 border-t border-slate-50 flex items-center justify-end gap-6">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing 1 to {filteredOfficers.length} of {managedOfficers.length} officers
                    </p>
                    <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-slate-100 text-[#4B958E] rounded-lg text-xs font-black">1</button>
                        <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-lg text-xs font-black">2</button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                <OfficerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    officer={selectedOfficer}
                    onSave={handleSave}
                    pool={recruitmentPool}
                />
            </AnimatePresence>
        </>
    );
};

export default OfficerManagement;
