import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
// Custom Components
import OfficerSidebar from "./components/OfficerSidebar";
import OfficerTopNav from "./components/OfficerTopNav";
import OfficerStatCards from "./components/OfficerStatCards";
import AssignedComplaintsTable from "./components/AssignedComplaintsTable";
import ComplaintSlideOver from "./components/ComplaintSlideOver";
import OfficerProfile from "./components/OfficerProfile";
import { TrendingUp } from "lucide-react";

export default function OfficerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfficerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = JSON.parse(localStorage.getItem("user") || "{}").token;
        const headers = { Authorization: `Bearer ${token}` };

        // We can fetch table data for both 'dashboard' and 'resolved' tabs
        let endpoint = `${import.meta.env.VITE_API_URL}/officer/complaints`;
        if (activeTab === "resolved") {
          endpoint += "?status=Resolved";
        }

        const complaintsRes = await fetch(endpoint, { headers });
        const complaintsData = await complaintsRes.json();
        
        if (complaintsData.success) {
          setAssignedComplaints(complaintsData.data.complaints);
        }

        // Fetch stats only for the main dashboard
        if (activeTab === "dashboard") {
          const statsRes = await fetch(
            `${import.meta.env.VITE_API_URL}/officer/dashboard-stats`,
            { headers }
          );
          const statsData = await statsRes.json();
          if (statsData.success) {
            setDashboardStats(statsData.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch official data", err);
        setError("Failed to synchronize with server.");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch for relevant tabs (simulate others for now)
    if (activeTab === "dashboard" || activeTab === "resolved") {
      fetchOfficerData();
    } else {
      setIsLoading(false);
    }
  }, [activeTab]);

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}").token;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/officer/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      
      const resData = await res.json();

      if (res.ok && resData.success) {
        // Update local state without refetching immediately for snappy UI
        setAssignedComplaints((prev) =>
          prev.map((c) => (c._id === complaintId || c.id === complaintId ? { ...c, status: newStatus } : c)),
        );

        // Optionally, we could trigger a refetch of stats here if needed
      } else {
        throw new Error(resData.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] selection:bg-emerald-100 selection:text-emerald-900 flex overflow-hidden">
      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <OfficerSidebar
        isSidebarOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64 relative z-0 h-screen overflow-y-auto">
        <OfficerTopNav
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 mx-auto w-full max-w-[1600px] flex flex-col gap-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Area Intelligence{" "}
                <span className="text-emerald-600">Overview</span>
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Track, manage, and resolve civic incidents securely.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-[0_2px_8px_rgb(0,0,0,0.02)] border border-slate-100 text-sm font-semibold text-slate-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Stats */}
          {activeTab === "dashboard" && (
            <OfficerStatCards stats={dashboardStats} isLoading={isLoading} />
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-12 w-full h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex items-center justify-center min-h-[200px] text-sm font-medium">
                {error}
              </div>
            ) : activeTab === "dashboard" || activeTab === "resolved" ? (
              <AssignedComplaintsTable
                assignedComplaints={assignedComplaints}
                onSelectComplaint={setSelectedComplaint}
              />
            ) : activeTab === "profile" ? (
              <OfficerProfile />
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] min-h-[400px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-inset ring-emerald-100/50">
                  <TrendingUp className="w-8 h-8" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Module
                </h3>
                <p className="text-slate-500 font-medium text-sm max-w-sm leading-relaxed">
                  This sector is currently undergoing infrastructure upgrades
                  and is in the development phase.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="px-6 py-8 sm:px-10 mt-auto border-t border-slate-200/60 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 tracking-wide uppercase">
          <div className="flex items-center gap-4">
            <span className="text-slate-900">© 2025 CivicLens</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span>Officer Accountability Protocol</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="hover:text-emerald-700 transition-colors focus:outline-none focus:underline underline-offset-4">
              Privacy
            </button>
            <button className="hover:text-emerald-700 transition-colors focus:outline-none focus:underline underline-offset-4">
              Terms
            </button>
          </div>
        </footer>
      </div>

      {/* Slide-over Panel for Details */}
      <ComplaintSlideOver
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
