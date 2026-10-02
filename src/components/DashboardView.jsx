import React from "react";
import {
  ArrowLeftRight,
  Wallet,
  AlertTriangle,
  Lock,
  ExternalLink,
  QrCode,
  Send,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ChevronRight,
  BrainCircuit
} from "lucide-react";

export default function DashboardView({
  transactions,
  alerts,
  onNavigate,
  onSelectTransaction
}) {
  // Compute dynamic stats from transactions
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const lowRiskCount = transactions.filter((t) => t.risk === "LOW").length;
  const medRiskCount = transactions.filter((t) => t.risk === "MEDIUM").length;
  const highRiskCount = transactions.filter((t) => t.risk === "HIGH").length;

  const approvedCount = transactions.filter((t) => t.status === "APPROVED").length;
  const reviewCount = transactions.filter((t) => t.status === "REVIEW").length;
  const blockedCount = transactions.filter((t) => t.status === "BLOCKED").length;

  const highRiskAlert = alerts.find(
    (a) => a.type === "HIGH_RISK" || a.status === "BLOCKED"
  );

  // SVG Donut calculation helper
  const renderDonutSegments = (data, total) => {
    let accumulatedAngle = 0;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;

    return data.map((item, index) => {
      const percentage = total > 0 ? item.value / total : 0;
      const strokeDasharray = `${percentage * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle * circumference;
      accumulatedAngle += percentage;

      return (
        <circle
          key={index}
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={item.color}
          strokeWidth="12"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out hover:opacity-90 cursor-pointer"
        />
      );
    });
  };

  const riskData = [
    { label: "Low Risk", value: lowRiskCount, color: "#10b981", percent: "42.9%" },
    { label: "Medium Risk", value: medRiskCount, color: "#f59e0b", percent: "42.9%" },
    { label: "High Risk", value: highRiskCount, color: "#ef4444", percent: "14.2%" },
  ];

  const statusData = [
    { label: "Approved", value: approvedCount, color: "#10b981", percent: "28.6%" },
    { label: "Under Review", value: reviewCount, color: "#f59e0b", percent: "42.9%" },
    { label: "Blocked", value: blockedCount, color: "#ef4444", percent: "14.2%" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time fraud surveillance and UPI activity</p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => onNavigate("scan-merchant")}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Merchant QR</span>
          </button>
          <button
            onClick={() => onNavigate("send-money")}
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Send className="w-4 h-4 text-blue-600" />
            <span>Send Money</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Transactions
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {totalTransactions}
            </span>
            <span className="text-xs font-medium text-emerald-600 mt-1.5 block">
              This Month
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-medium text-emerald-600 mt-1.5 block">
              This Month
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Fraud Detected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Fraud Detected
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {highRiskCount}
            </span>
            <span className="text-xs font-medium text-amber-600 mt-1.5 block">
              This Month
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Blocked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Blocked
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {blockedCount}
            </span>
            <span className="text-xs font-medium text-rose-600 mt-1.5 block">
              This Month
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Donut Charts Section (Risk Overview & Transaction Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Risk Overview</h3>
            <span className="text-xs text-slate-400 font-medium">Real-time Model</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* Donut Chart SVG */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {renderDonutSegments(riskData, totalTransactions)}
              </svg>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">{totalTransactions}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Legend matching screenshot */}
            <div className="space-y-3.5 w-full sm:w-auto">
              {riskData.map((item, i) => (
                <div key={i} className="flex items-center justify-between sm:justify-start gap-8 text-sm">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {item.value} <span className="text-slate-400 font-normal">({totalTransactions > 0 ? ((item.value / totalTransactions) * 100).toFixed(1) : 0}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Transaction Status</h3>
            <span className="text-xs text-slate-400 font-medium">NPCI Gateway State</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* Donut Chart SVG */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {renderDonutSegments(statusData, totalTransactions)}
              </svg>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">{totalTransactions}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Legend matching screenshot */}
            <div className="space-y-3.5 w-full sm:w-auto">
              {statusData.map((item, i) => (
                <div key={i} className="flex items-center justify-between sm:justify-start gap-8 text-sm">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {item.value} <span className="text-slate-400 font-normal">({totalTransactions > 0 ? ((item.value / totalTransactions) * 100).toFixed(1) : 0}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Level Stacking Ensemble Engine Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-blue-800/60">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                Two-Level Stacking Ensemble Engine Active
              </h4>
              <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                CATBOOST META-LEARNER
              </span>
            </div>
            <p className="text-xs text-blue-200/90 mt-0.5">
              MLP + Random Forest + XGBoost + SVM + Logistic Regression combined via Meta-Learner
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("ensemble-model")}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs hover:scale-[1.02]"
        >
          Explore Stacking Lab →
        </button>
      </div>

      {/* High Risk Alert Banner matching screenshot */}
      {highRiskAlert && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-rose-900 font-bold text-base flex items-center gap-2">
                High Risk Alert
              </h4>
              <p className="text-rose-700 text-sm mt-0.5">
                1 high risk transaction detected. Please review immediately.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("alerts")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            View Alerts
          </button>
        </div>
      )}

      {/* Recent Activity Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Transactions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live UPI stream verified with AI Guard</p>
          </div>
          <button
            onClick={() => onNavigate("transactions")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 4).map((txn) => (
            <div
              key={txn.id}
              onClick={() => onSelectTransaction(txn)}
              className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  txn.risk === "HIGH"
                    ? "bg-rose-100 text-rose-700"
                    : txn.risk === "MEDIUM"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                  {txn.risk === "HIGH" ? "!" : txn.risk === "MEDIUM" ? "?" : "✓"}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900 text-sm">{txn.merchant}</span>
                    <span className="text-[11px] font-mono text-slate-400">({txn.id})</span>
                  </div>
                  <span className="text-xs text-slate-500 block">{txn.date}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-900 text-sm block">
                  ₹{txn.amount.toLocaleString("en-IN")}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                  txn.status === "APPROVED"
                    ? "bg-emerald-100 text-emerald-700"
                    : txn.status === "REVIEW"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
