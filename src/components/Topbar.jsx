import React, { useState, useEffect } from "react";
import { Bell, Shield, Menu, ChevronDown, CheckCheck, AlertTriangle, Server, Zap } from "lucide-react";
import { apiService } from "../utils/apiService";

export default function Topbar({
  user,
  unreadAlertCount = 0,
  alerts = [],
  onOpenAlerts,
  setMobileOpen,
  onOpenProfile
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ connected: false });

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      const res = await apiService.checkHealth();
      if (isMounted) {
        setBackendStatus(res);
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            Hello, {user.name.split(" ")[0]} <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Here's what's happening with your account today.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 sm:space-x-4">
        {/* Real-Time Python ML Backend Status Pill */}
        <div
          title={backendStatus.status === "healthy" ? "FastAPI + Scikit-Learn + XGBoost Backend Active" : "Client-side ML Active"}
          className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            backendStatus.status === "healthy"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              backendStatus.status === "healthy" ? "bg-emerald-400" : "bg-blue-400"
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              backendStatus.status === "healthy" ? "bg-emerald-500" : "bg-blue-500"
            }`}></span>
          </span>
          <Server className="w-3.5 h-3.5" />
          <span>
            {backendStatus.status === "healthy"
              ? "FastAPI ML Backend: CONNECTED (Port 8001)"
              : "Smart ML Shield: ACTIVE"}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-sm">Security Alerts & Updates</span>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline" onClick={onOpenAlerts}>
                  View all
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="py-2.5 flex items-start space-x-3 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer" onClick={onOpenAlerts}>
                    <div className={`p-1.5 rounded-full mt-0.5 shrink-0 ${
                      alert.status === "BLOCKED"
                        ? "bg-rose-100 text-rose-600"
                        : alert.status === "REVIEW"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{alert.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{alert.description}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{alert.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div
          onClick={onOpenProfile}
          className="flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            RG
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-800 block">{user.name}</span>
            <span className="text-[10px] text-slate-400 font-medium block">{user.upiId}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
