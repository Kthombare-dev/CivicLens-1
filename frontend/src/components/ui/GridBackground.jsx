import React from 'react';

const GridBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Radial Gradient Highlight/Spotlight */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_800px_at_50%_200px,#dbeafe,transparent)] opacity-70"></div>

            {/* Content */}
            <div className="relative z-10 w-full flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    );
};

export default GridBackground;
