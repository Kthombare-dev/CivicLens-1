import { Bell, ChevronDown, CheckCircle, Plus } from 'lucide-react';

const Header = ({ userName = "Rohit Verma", location = "Vijay Nagar", onReportIssue, activeTab }) => {
    return (
        <header className="flex items-center justify-between py-6 px-0 bg-[#F8FAFC]">
            <div>
                {activeTab === 'Home' ? (
                    <>
                        <h1 className="text-3xl font-bold text-slate-900">Hello, {userName}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500 text-sm font-medium">Your actions are publicly recorded and Citizen-Verified</span>
                        </div>
                    </>
                ) : (
                    <h1 className="text-3xl font-bold text-slate-900">{activeTab}</h1>
                )}
            </div>

            <button
                onClick={onReportIssue}
                className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Report an Issue
            </button>
        </header>
    );
};

export default Header;
