import React from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';

const Header = ({ userName = "Rohit Verma", location = "Vijay Nagar", activeTab = "Home", onMenuClick }) => {

    // Helper to safely render location whether it's a string or object
    const getDisplayLocation = (loc) => {
        if (!loc) return "Vijay Nagar";
        if (typeof loc === 'string') return loc;
        // Handle object case {city, ward...}
        if (typeof loc === 'object') {
            const parts = [];
            if (loc.ward) parts.push(loc.ward);
            if (loc.city) parts.push(loc.city);
            return parts.length > 0 ? parts.join(', ') : "Vijay Nagar";
        }
        return "Vijay Nagar";
    };

    const isHome = activeTab === 'Home';

    return (
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    {isHome && (
                        <>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hello, {userName}</h1>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-slate-500 font-medium text-sm">Welcome to your dashboard</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                                    {getDisplayLocation(location)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
