import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ClipboardList,
  ImageIcon,
  MapPin,
  User,
  Info,
  Clock,
  CheckCircle,
} from "lucide-react";
import { format, differenceInHours } from "date-fns";
import { complaintService } from "../../../services/complaintService";

export default function ComplaintSlideOver({
  complaint,
  onClose,
  onUpdateStatus,
}) {
  const [selectedStatus, setSelectedStatus] = useState("Assigned");

  useEffect(() => {
    if (complaint && complaint.status) {
      setSelectedStatus(complaint.status);
    }
  }, [complaint]);
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

  // Calculate SLA metrics dynamically upon opening
  let daysLeft = null;
  let slaStatusColor = "bg-slate-100 text-slate-700 ring-slate-600/20";
  let slaTextColor = "text-slate-500";
  let slaDateFormatted = "Pending AI Analysis";

  if (complaint.expectedResolutionDate) {
    const deadline = new Date(complaint.expectedResolutionDate);
    const today = new Date();
    const hoursLeft = differenceInHours(deadline, today);
    daysLeft = Math.ceil(hoursLeft / 24);
    slaDateFormatted = format(deadline, "MMM dd, yyyy, hh:mm a");

    if (daysLeft < 0) {
      slaStatusColor = "bg-red-100 text-red-700 ring-red-600/20";
      slaTextColor = "text-red-700";
    } else if (daysLeft <= 2) {
      slaStatusColor = "bg-amber-100 text-amber-700 ring-amber-600/20";
      slaTextColor = "text-amber-700";
    } else {
      slaStatusColor = "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      slaTextColor = "text-emerald-700";
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-[0.5px] border-emerald-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-[0.5px] border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border-[0.5px] border-amber-200";
    }
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
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="w-screen max-w-2xl transform"
          >
            <div className="flex h-full flex-col bg-white shadow-2xl rounded-l-3xl overflow-hidden ring-1 ring-slate-900/5 border-l border-white/40">
              {/* Header (Sticky) */}
              <div className="px-6 py-6 sm:px-8 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-50 rounded-xl flex-shrink-0 shadow-sm border border-emerald-100/50">
                    <ClipboardList className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h2
                      className="text-xl font-bold text-slate-900 tracking-tight"
                      id="slide-over-title"
                    >
                      {complaint.id}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(complaint.status)}`}
                      >
                        {complaint.status}
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">
                        •
                      </span>
                      <span className="text-slate-500 text-xs font-medium">
                        Assigned Intelligence Report
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-white p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto w-full">
                <div className="px-6 py-8 sm:px-8 space-y-10">
                  {/* Primary Image / Evidence */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest text-[11px]">
                        Primary Evidence
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                        <ImageIcon className="w-3.5 h-3.5" /> Image attached
                      </div>
                    </div>
                    <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-[inset_0_2px_10px_rgb(0,0,0,0.03)] border border-slate-200/60 group">
                      <img
                        src={complaintService.getImageUrl(complaint.images?.[0])}
                        alt={`Incident ${complaint.id}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium drop-shadow-md">
                          Captured by citizen
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Intelligence Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 border-dashed">
                    {/* Location */}
                    <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">
                          Target Location
                        </span>
                        <span className="text-slate-800 font-semibold text-[15px] flex items-center gap-1.5 leading-snug break-words">
                          <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {complaint.location}
                        </span>
                      </div>
                    </div>

                    {/* Time Log */}
                    <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">
                          Time Lodged
                        </span>
                        <span className="text-slate-800 font-semibold text-[15px] flex items-center gap-1.5 leading-snug">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          {complaint.date.split(",")[0]}{" "}
                          <span className="text-slate-400 font-medium text-[13px] ml-1">
                            {complaint.date.split(",")[1]}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Expected Resolution */}
                    <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2 col-span-1 sm:col-span-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">
                          Expected Resolution
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`font-semibold text-[15px] flex items-center gap-1.5 leading-snug ${slaTextColor}`}>
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            {slaDateFormatted}
                          </span>
                          {daysLeft !== null && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${slaStatusColor}`}>
                              {daysLeft < 0 ? `${Math.abs(daysLeft)} DAYS OVERDUE` : `${daysLeft} DAYS LEFT`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">
                          Incident Category
                        </span>
                        <span className="text-slate-800 font-semibold text-[15px] flex items-center gap-1.5 leading-snug">
                          <Info className="w-4 h-4 text-blue-500" />
                          {complaint.category}
                        </span>
                      </div>
                    </div>

                    {/* Reporter */}
                    <div className="px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">
                          Identified Reporter
                        </span>
                        <span className="text-slate-800 font-semibold text-[15px] flex items-center gap-1.5 leading-snug">
                          <User className="w-4 h-4 text-amber-500" />
                          {complaint.reporter}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                      Citizen Narrative{" "}
                      <span className="h-px bg-slate-200 flex-1 ml-2"></span>
                    </h3>
                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                      <p className="text-slate-700 text-[15px] leading-relaxed relative">
                        <span className="absolute -left-2 -top-2 text-3xl text-emerald-200 font-serif leading-none select-none">
                          "
                        </span>
                        {complaint.description}
                        <span className="absolute -right-2 -bottom-4 text-3xl text-emerald-200 font-serif leading-none select-none">
                          "
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer / Action Area (Sticky) */}
              <div className="px-6 py-6 sm:px-8 border-t border-slate-100 bg-slate-50">
                <div className="p-5 bg-white rounded-xl shadow-sm border border-emerald-100/50 relative overflow-hidden ring-1 ring-inset ring-slate-900/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="space-y-1 max-w-xs">
                      <h4 className="text-[15px] font-bold text-slate-900 tracking-tight">
                        Status Update Action
                      </h4>
                      <p className="text-xs text-slate-500 leading-tight">
                        Proceed to change the current state of this ticket.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="block w-full sm:w-auto rounded-lg border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6 font-semibold shadow-sm transition-shadow cursor-pointer"
                      >
                        <option value="Assigned">Assigned (Pending Action)</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          onUpdateStatus(complaint._id || complaint.id, selectedStatus);
                          onClose();
                        }}
                        disabled={selectedStatus === complaint.status}
                        className="inline-flex justify-center items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all min-w-[120px]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Commit
                      </button>
                    </div>
                  </div>

                  {/* Decorative background element */}
                  <div className="absolute right-0 top-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-50 opacity-50 blur-2xl block pointer-events-none"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
