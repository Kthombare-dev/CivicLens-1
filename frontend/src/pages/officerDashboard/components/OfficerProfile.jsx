import React from "react";
import { User, Mail, Phone, MapPin, Briefcase, ShieldCheck, Clock } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function OfficerProfile() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="w-full space-y-6 max-w-7xl">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500"></div>
        <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-12 relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-white overflow-hidden shadow-md flex-shrink-0 z-10 transition-transform hover:scale-105">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
              alt="Profile"
              className="w-full h-full object-cover bg-slate-50"
            />
          </div>
          <div className="flex-1 space-y-1 text-center sm:text-left pt-2 sm:pt-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{user.name}</h2>
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              {user.ward || "General Infrastructure"} Official
            </p>
          </div>
          <div className="sm:pb-3 w-full sm:w-auto flex justify-center sm:justify-end mt-4 sm:mt-0">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3.5 py-1.5 font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 text-xs tracking-wide">
              Active Account
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest text-[11px] border-b border-slate-100 pb-3">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="text-sm font-semibold text-slate-900">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                <p className="text-sm font-semibold text-slate-900">+91 {user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest text-[11px] border-b border-slate-100 pb-3">
            Assignment Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Assigned Department</p>
                <p className="text-sm font-semibold text-slate-900">{user.ward || "General Infrastructure"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Jurisdiction Area</p>
                <p className="text-sm font-semibold text-slate-900">{user.area || "City Wide"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Member Since</p>
                <p className="text-sm font-semibold text-slate-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}) : "Recently"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
