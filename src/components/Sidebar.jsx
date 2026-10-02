import React from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  CreditCard,
  Send,
  QrCode,
  Bell,
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
  BrainCircuit
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  unreadAlertCount = 0,
  onLogout,
  mobileOpen = false,
  setMobileOpen
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "send-money", label: "Send Money", icon: Send },
    { id: "scan-merchant", label: "Scan Merchant", icon: QrCode, badge: "NEW" },
    { id: "ensemble-model", label: "Ensemble AI Model", icon: BrainCircuit, badge: "AI LAB" },
    { id: "alerts", label: "Alerts", icon: Bell, alertCount: unreadAlertCount },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a1128] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-wide flex items-center gap-1.5">
                UPI SHIELD
              </h1>
              <p className="text-[11px] text-blue-400 font-medium tracking-tight">Secure Every Transaction</p>
            </div>
          </div>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Real-time Engine Status Pill */}
        <div className="px-5 py-3">
          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-200">CatBoost Ensemble</span>
            </div>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800/50">
              96.95%
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                    : "hover:bg-slate-800/70 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30">
                      {item.badge}
                    </span>
                  )}
                  {item.alertCount > 0 && (
                    <span className="text-[11px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm shadow-rose-500/40">
                      {item.alertCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
