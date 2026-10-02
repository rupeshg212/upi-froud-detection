import React, { useState, useMemo } from "react";
import { AlertTriangle, ShieldAlert, Monitor, CheckCircle, Eye, Trash2, Filter } from "lucide-react";

export default function AlertsView({ alerts, onViewAlertTxn, onDismissAlert }) {
  const [filter, setFilter] = useState("All");

  const filteredAlerts = useMemo(() => {
    if (filter === "All") return alerts;
    if (filter === "HIGH") return alerts.filter((a) => a.type === "HIGH_RISK" || a.status === "BLOCKED");
    if (filter === "MEDIUM") return alerts.filter((a) => a.type === "MEDIUM_RISK" || a.status === "REVIEW");
    if (filter === "SECURITY") return alerts.filter((a) => a.type === "SECURITY");
    return alerts;
  }, [alerts, filter]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Alerts</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time security threats and incident notifications</p>
        </div>

        {/* Filter dropdown matching screenshot */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="SECURITY">Security / Device</option>
          </select>
        </div>
      </div>

      {/* Alert Cards List matching screenshot */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            No active alerts in this category.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isHighRisk = alert.type === "HIGH_RISK" || alert.status === "BLOCKED";
            const isMedium = alert.type === "MEDIUM_RISK" || alert.status === "REVIEW";
            const isSecurity = alert.type === "SECURITY";

            return (
              <div
                key={alert.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  {/* Icon badge matching screenshot */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isHighRisk
                        ? "bg-rose-100 text-rose-600"
                        : isMedium
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {isSecurity ? (
                      <Monitor className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>

                  {/* Text details matching screenshot */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{alert.description}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block font-medium">
                      {alert.date}
                    </span>
                  </div>
                </div>

                {/* View button matching screenshot */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => onViewAlertTxn(alert)}
                    className="px-5 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    View
                  </button>
                  {onDismissAlert && (
                    <button
                      onClick={() => onDismissAlert(alert.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
