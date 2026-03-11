import React, { useState } from "react";
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export default function AssignedComplaintsTable({
  assignedComplaints,
  onSelectComplaint,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
      case "In Progress":
        return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20";
      default: // Submitted / Pending
        return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col overflow-hidden h-full">
      {/* Header / Search */}
      <div className="p-6 sm:px-8 sm:py-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
            Active Assignments
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Manage and update your assigned civil tasks.
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-shadow bg-slate-50/50 hover:bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50/80">
              <th
                scope="col"
                className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Task ID
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                SLA Deadline
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {assignedComplaints.length === 0 ? (
                <tr>
                    <td colSpan="7" className="py-12 text-center text-sm text-slate-500 bg-slate-50/30">
                        No assigned complaints found.
                    </td>
                </tr>
            ) : assignedComplaints.map((item, idx) => (
              <tr
                key={item._id || idx}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                onClick={() => onSelectComplaint(item)}
              >
                <td className="whitespace-nowrap py-4 pl-6 pr-3">
                  <div className="text-sm font-medium text-slate-900 font-mono tracking-tight">
                    {item.id}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <div className="text-sm font-medium text-slate-700">
                    {item.category}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span
                      className="text-sm text-slate-600 truncate max-w-[150px] lg:max-w-[200px]"
                      title={item.location}
                    >
                      {item.location}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 hidden md:table-cell">
                  <div className="text-sm text-slate-500">
                    {item.date ? item.date.split(",")[0] : 'N/A'}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusStyle(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                    {item.isOverdue ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20">
                            Overdue
                        </span>
                    ) : item.status === 'Resolved' ? (
                        <span className="text-sm font-medium text-slate-400">—</span>
                    ) : item.daysLeft !== null && item.daysLeft !== undefined ? (
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${item.daysLeft <= 1 ? 'bg-amber-100/50 text-amber-700 ring-1 ring-inset ring-amber-600/20' : 'bg-slate-100 text-slate-600'}`}>
                            {item.daysLeft} {item.daysLeft === 1 ? 'Day' : 'Days'} Left
                        </span>
                    ) : (
                        <span className="text-sm text-slate-400">Not set</span>
                    )}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectComplaint(item);
                    }}
                    className="text-emerald-600 hover:text-emerald-900 font-semibold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-slate-500 font-medium">
          Showing <span className="font-semibold text-slate-900">1</span> to{" "}
          <span className="font-semibold text-slate-900">5</span> of{" "}
          <span className="font-semibold text-slate-900">
            {assignedComplaints.length}
          </span>{" "}
          results
        </p>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center p-2 rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only">Previous page</span>
          </button>
          <button className="inline-flex items-center justify-center px-3.5 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all shadow-emerald-600/10">
            1
          </button>
          <button className="inline-flex items-center justify-center -ml-px p-2 rounded-md border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
            <ChevronRight className="w-4 h-4" />
            <span className="sr-only">Next page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
