import React from 'react';
import { X, User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const AssignOfficerPanel = ({ isOpen, onClose, selectedComplaint, officers, onAssign }) => {
    const [selectedOfficerId, setSelectedOfficerId] = React.useState(null);

    if (!isOpen || !selectedComplaint) return null;

    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col h-full sticky top-24"
        >
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800">Assign Officer</h3>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6 mb-8">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Complaint</p>
                    <div className="flex flex-col">
                        <span className="text-[16px] font-black text-slate-800">{selectedComplaint.id}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-slate-600">{selectedComplaint.category}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-sm font-black text-emerald-600 uppercase tracking-wider text-[10px]">High</span>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Select Officer</p>
                    <div className="relative">
                        <select
                            className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-none rounded-xl text-[15px] font-bold text-slate-600 appearance-none focus:ring-2 focus:ring-emerald-500/20"
                            onChange={(e) => setSelectedOfficerId(e.target.value)}
                            value={selectedOfficerId || ''}
                        >
                            <option value="">Select Officer</option>
                            {officers.map(officer => (
                                <option key={officer.id} value={officer.id}>{officer.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-3">
                    {officers.map((officer) => (
                        <button
                            key={officer.id}
                            onClick={() => setSelectedOfficerId(officer.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedOfficerId === officer.id
                                    ? 'border-emerald-500 bg-emerald-50/30'
                                    : 'border-slate-50 hover:border-slate-100 hover:bg-slate-50/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                    <img src={officer.avatar} alt={officer.name} className="w-full h-full object-cover" />
                                </div>
                                <span className={`text-[15px] font-bold ${selectedOfficerId === officer.id ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {officer.name}
                                </span>
                            </div>
                            <span className={`text-base font-black ${selectedOfficerId === officer.id ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {officer.workload}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                disabled={!selectedOfficerId}
                onClick={() => onAssign(selectedOfficerId)}
                className="w-full mt-auto bg-[#10b981] hover:bg-[#059669] text-white py-4 rounded-xl font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:shadow-none"
            >
                Assign Officer
            </button>
        </motion.div>
    );
};

export default AssignOfficerPanel;
