import { Bell, ChevronDown, CheckCircle, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Header = ({ userName = "Rohit Verma", location = "Vijay Nagar", onReportIssue, activeTab }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="flex items-center justify-between py-6 px-0 bg-[#F8FAFC]">
            <div>
                {activeTab === 'Home' && (
                    <>
                        <h1 className="text-3xl font-bold text-slate-900">Hello, {userName}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500 text-sm font-medium">Your actions are publicly recorded and Citizen-Verified</span>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
