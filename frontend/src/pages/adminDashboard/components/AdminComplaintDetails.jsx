import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ClipboardList,
  MapPin,
  Calendar,
  Info,
  CheckCircle,
  Tag,
  AlertTriangle,
  Building2,
  Clock,
  User
} from "lucide-react";
import { complaintService } from "../../../services/complaintService";

export default function AdminComplaintDetails({ complaint, onClose }) {
  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (complaint) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [complaint]);

  if (!complaint) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-[0.5px] border-emerald-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-[0.5px] border-blue-200";
      case "Submitted":
        return "bg-amber-100 text-amber-800 border-[0.5px] border-amber-200";
      case "Assigned":
        return "bg-indigo-100 text-indigo-800 border-[0.5px] border-indigo-200";
      default:
        return "bg-slate-100 text-slate-800 border-[0.5px] border-slate-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Sliding Panel */}
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="w-screen max-w-2xl transform"
          >
            <div className="flex h-full flex-col bg-white shadow-2xl rounded-l-3xl overflow-hidden ring-1 ring-slate-900/5 border-l border-white/40">
              {/* Header (Sticky) */}
              <div className="px-6 py-6 sm:px-8 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-900 rounded-xl flex-shrink-0 shadow-sm border border-slate-800">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight" id="slide-over-title">
                      Intelligence Audit View
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(complaint.status)}`}>
                        {complaint.status}
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">•</span>
                      <span className="text-slate-500 text-sm font-medium">Ref: {complaint.id || complaint._id}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-xl p-2.5 text-slate-400 hover:text-slate-500 hover:bg-slate-100/80 transition-all border border-transparent shadow-sm hover:shadow"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto w-full relative h-[calc(100vh-100px)]">
                <div className="p-6 sm:p-8 space-y-8 absolute inset-0 pb-24">

                  {/* Hero Image Section */}
                  {complaint.images && complaint.images.length > 0 && (
                    <div className="w-full">
                      <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 relative group">
                        <img
                          src={complaintService.getImageUrl(complaint.images[0])}
                          alt="Submitted Evidence"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4">
                            <p className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">Primary Evidence Capture</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Core Information Section */}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{complaint.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Dynamic Meta Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location Card */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                            <MapPin className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recorded Area</span>
                        </div>
                        <p className="font-semibold text-slate-900 text-sm pl-[44px] leading-snug">
                        {complaint.location || complaint.address}
                        </p>
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                          <Calendar className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Submission Date</span>
                      </div>
                      <p className="font-semibold text-slate-900 text-sm pl-[44px]">
                        {formatDate(complaint.createdAt || complaint.date)}
                      </p>
                    </div>

                    {/* Assignment Info */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                          <User className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Official</span>
                      </div>
                      <p className="font-semibold text-slate-900 text-sm pl-[44px]">
                        {complaint.assignedTo || complaint.assignedOfficerId?.name || "Unassigned"}
                      </p>
                    </div>

                    {/* Expected Resolution / SLA Card */}
                    {complaint.expectedResolutionDate && (
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                            <Clock className="w-4 h-4 text-emerald-500" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">SLA Deadline</span>
                        </div>
                        <p className="font-semibold text-slate-900 text-sm pl-[44px] flex items-center gap-2">
                          {formatDate(complaint.expectedResolutionDate)}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                              Math.ceil((new Date(complaint.expectedResolutionDate) - new Date()) / (1000 * 60 * 60 * 24)) >= 0
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-600"
                          }`}>
                            {(() => {
                              const days = Math.ceil((new Date(complaint.expectedResolutionDate) - new Date()) / (1000 * 60 * 60 * 24));
                              return days >= 0 ? `${days} DAYS LEFT` : `${Math.abs(days)} DAYS OVERDUE`;
                            })()}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Meta Traits Card (AI / Category) */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden sm:col-span-2 group hover:border-slate-200 transition-colors">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                            <Info className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Intelligence Briefing</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 pl-[44px]">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</span>
                            <div className="flex items-center gap-1.5 align-middle text-slate-800 text-sm font-semibold">
                                <Tag className="w-3.5 h-3.5 text-slate-400"/>
                                {complaint.category || "Uncategorized"}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">AI Priority</span>
                            <div className="flex items-center gap-1.5 align-middle text-slate-800 text-sm font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500"/>
                                {complaint.priority || "Normal"}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Target Department</span>
                            <div className="flex items-center gap-1.5 align-middle text-slate-800 text-sm font-semibold">
                                <Building2 className="w-3.5 h-3.5 text-sky-500"/>
                                <span className="truncate max-w-[120px]" title={complaint.department || "General"}>
                                  {complaint.department || "General"}
                                </span>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>

                  {/* Resolution History Section */}
                  {complaint.timeline && complaint.timeline.length > 0 && (
                     <div className="mt-8">
                       <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                           <CheckCircle className="w-4 h-4 text-slate-600" />
                         </div>
                         Operational Timeline
                       </h4>
                       <div className="border-l-2 border-slate-100 ml-4 pl-6 space-y-6 relative">
                          <div className="absolute w-3 h-3 bg-slate-200 rounded-full left-[-7px] top-0 border-2 border-white"></div>
                          {complaint.timeline.map((event, index) => (
                             <div key={index} className="relative group">
                                <div className="absolute w-3 h-3 bg-slate-300 rounded-full left-[-31px] top-1.5 border-2 border-white shadow-sm ring-2 ring-transparent group-hover:bg-slate-500 transition-colors"></div>
                                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                  {event.status} 
                                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">Event</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">{event.note || "System updated."}</p>
                                <span className="text-xs text-slate-400 mt-2 block font-medium flex items-center gap-1">
                                  {formatDate(event.timestamp)}
                                </span>
                             </div>
                          ))}
                          <div className="absolute w-3 h-3 bg-slate-200 rounded-full left-[-7px] bottom-0 border-2 border-white"></div>
                       </div>
                     </div>
                  )}

                  <div className="h-6"></div> {/* Bottom Padding Fix */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
