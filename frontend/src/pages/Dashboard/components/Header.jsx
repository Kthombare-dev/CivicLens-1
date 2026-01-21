import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const Header = ({ userName = "Rohit Verma", location = "Vijay Nagar" }) => {
    return (
        <header className="flex items-center justify-between py-6 px-4 bg-[#F8FAFC]">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Hello, {userName}</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome to your CivicLens dashboard.</p>
            </div>

            {/* Removed profile and notifications as requested */}
        </header>
    );
};

export default Header;
