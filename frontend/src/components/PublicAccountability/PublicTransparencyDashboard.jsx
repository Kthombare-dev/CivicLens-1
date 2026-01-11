"use client";

import { motion } from "framer-motion";

const complaints = [
    {
        id: "CL-20491",
        issue: "Pothole on MG Road",
        area: "MG Road, Indore",
        department: "Road & Infrastructure",
        status: "Verified",
        updated: "05 Jan 2026",
    },
    {
        id: "CL-20488",
        issue: "Garbage Overflow",
        area: "Rajwada Market",
        department: "Sanitation",
        status: "In Progress",
        updated: "10 Jan 2026",
    },
    {
        id: "CL-20475",
        issue: "Streetlight Not Working",
        area: "Vijay Nagar",
        department: "Electrical",
        status: "Open",
        updated: "20 Jan 2026",
    },
];

const statusStyle = {
    Open: "bg-slate-100 text-slate-600",
    "In Progress": "bg-blue-50 text-blue-600",
    Verified: "bg-emerald-50 text-emerald-700",
};

export default function DesktopDashboardMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={{
                y: [0, -8, 0],
            }}
            transition={{
                y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                opacity: { duration: 0.6, ease: "easeOut" }
            }}
            whileHover={{
                rotateX: 1,
                rotateY: 1,
                scale: 1.01,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
            }}
            style={{ perspective: 1000 }}
            className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all"
        >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 px-6 py-4 gap-4 sm:gap-0">
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                        Public Transparency Dashboard
                    </p>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Indore Municipal Corporation
                    </h3>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Public Records
                </span>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Sidebar */}
                <div className="col-span-1 border-b md:border-b-0 md:col-span-3 md:border-r border-slate-200 bg-slate-50 px-4 py-6">
                    <p className="mb-4 text-xs font-medium text-slate-500">
                        Overview
                    </p>

                    <div className="grid grid-cols-3 md:grid-cols-1 gap-4 space-y-0 md:space-y-4">
                        <SidebarStat label="Total Issues" value="3" />
                        <SidebarStat label="Resolved" value="1" />
                        <SidebarStat label="In Progress" value="1" />
                    </div>

                    <div className="mt-8 rounded-xl border border-emerald-100/60 bg-emerald-50/50 px-4 py-4">
                        <p className="text-xs font-medium text-emerald-700">
                            Accountability
                        </p>
                        <p className="mt-1 text-[11px] text-emerald-700">
                            All resolutions are publicly visible and citizen-verified.
                        </p>
                    </div>
                </div>

                {/* Main Table */}
                <div className="col-span-1 md:col-span-9 px-6 py-6 overflow-x-auto">
                    <table className="w-full text-sm min-w-[500px]">
                        <thead className="border-b border-slate-200 text-xs font-bold text-slate-700">
                            <tr>
                                <th className="pb-3 text-left">Issue</th>
                                <th className="pb-3 text-left">Department</th>
                                <th className="pb-3 text-left">Status</th>
                                <th className="pb-3 text-left">Last Update</th>
                            </tr>
                        </thead>

                        <tbody>
                            {complaints.map((c) => (
                                <tr
                                    key={c.id}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="py-5">
                                        <p className="font-medium text-slate-900">
                                            {c.issue}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {c.area}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            ID: {c.id}
                                        </p>
                                    </td>

                                    <td className="py-5 text-slate-600">
                                        {c.department}
                                    </td>

                                    <td className="py-5">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusStyle[c.status]
                                                }`}
                                        >
                                            {c.status}
                                        </span>
                                        {c.status === "Verified" && (
                                            <span className="ml-2 text-emerald-600">✔</span>
                                        )}
                                    </td>

                                    <td className="py-5 text-xs text-slate-500">
                                        {c.updated}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}

/* ---------- Helpers ---------- */

function SidebarStat({ label, value }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-2xl font-bold text-slate-900">
                {value}
            </span>
        </div>
    );
}
