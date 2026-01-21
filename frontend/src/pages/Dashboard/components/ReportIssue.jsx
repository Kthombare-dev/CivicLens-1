import React from 'react';
import { Camera, MapPin, Send } from 'lucide-react';

const ReportIssue = () => {
    return (
        <div className="bg-white p-12 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 max-w-3xl mx-auto">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Report a New Issue</h2>
                <p className="text-slate-500 font-medium mt-2">Your contribution helps make the city better for everyone.</p>
            </div>

            <form className="space-y-8">
                <div>
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Issue Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Broken streetlight on 5th Avenue"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Category</label>
                        <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 appearance-none">
                            <option>Roads & Potholes</option>
                            <option>Sanitation & Waste</option>
                            <option>Electricity & Lights</option>
                            <option>Water Supply</option>
                            <option>Public Parks</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Location</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Current Location"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 pl-12"
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
                    <textarea
                        rows="4"
                        placeholder="Describe the issue in detail..."
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <button type="button" className="flex items-center justify-center gap-2 px-6 py-8 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-600 transition-all group">
                        <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span>Upload Photo</span>
                    </button>
                    <button type="submit" className="flex items-center justify-center gap-3 px-6 py-8 bg-[#10b981] text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 hover:-translate-y-1 transition-all">
                        <Send className="w-6 h-6" />
                        <span>Submit Report</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportIssue;
