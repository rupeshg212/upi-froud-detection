import React, { useState } from "react";
import { TrendingUp, ShieldCheck, Zap, Award, DollarSign } from "lucide-react";

export default function AnalyticsView({ transactions }) {
  const [timeframe, setTimeframe] = useState("This Month");

  // Dynamic calculations
  const lowRiskTxns = transactions.filter((t) => t.risk === "LOW");
  const medRiskTxns = transactions.filter((t) => t.risk === "MEDIUM");
  const highRiskTxns = transactions.filter((t) => t.risk === "HIGH");

  const lowCount = lowRiskTxns.length;
  const medCount = medRiskTxns.length;
  const highCount = highRiskTxns.length;

  const lowAmount = lowRiskTxns.reduce((a, c) => a + c.amount, 0);
  const medAmount = medRiskTxns.reduce((a, c) => a + c.amount, 0);
  const highAmount = highRiskTxns.reduce((a, c) => a + c.amount, 0);
  const totalAmount = lowAmount + medAmount + highAmount;

  const lowPercent = totalAmount > 0 ? ((lowAmount / totalAmount) * 100).toFixed(1) : 0;
  const medPercent = totalAmount > 0 ? ((medAmount / totalAmount) * 100).toFixed(1) : 0;
  const highPercent = totalAmount > 0 ? ((highAmount / totalAmount) * 100).toFixed(1) : 0;

  // Max value for bar scaling
  const maxCount = Math.max(lowCount, medCount, highCount, 4);

  // SVG Donut calculation helper
  const renderDonutSegments = () => {
    let accumulatedAngle = 0;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;

    const data = [
      { value: lowAmount, color: "#10b981" },
      { value: medAmount, color: "#f59e0b" },
      { value: highAmount, color: "#ef4444" },
    ];

    return data.map((item, index) => {
      const percentage = totalAmount > 0 ? item.value / totalAmount : 0;
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
          className="transition-all duration-700 ease-out"
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Risk intelligence, volumetric exposure & fraud prevention telemetry
          </p>
        </div>

        <div className="self-start sm:self-auto">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="This Month">This Month</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Quarter">This Quarter</option>
            <option value="Year to Date">Year to Date</option>
          </select>
        </div>
      </div>

      {/* Two Main Analytical Charts matching screenshot exactly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Bar Chart matching screenshot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Risk Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Count of transactions classified by AI risk level</p>
          </div>

          {/* Bar Chart Canvas / SVG Container */}
          <div className="py-8 px-4">
            <div className="flex items-end justify-around h-56 border-b border-l border-slate-200 pl-4 pb-2 relative">
              {/* Y-axis grid ticks */}
              <div className="absolute left-[-28px] top-0 bottom-2 flex flex-col justify-between text-[11px] font-mono text-slate-400 select-none">
                <span>{maxCount}</span>
                <span>{Math.round(maxCount * 0.75)}</span>
                <span>{Math.round(maxCount * 0.5)}</span>
                <span>{Math.round(maxCount * 0.25)}</span>
                <span>0</span>
              </div>

              {/* Bar 1: LOW (Green) */}
              <div className="flex flex-col items-center gap-2 w-16">
                <span className="text-xs font-bold text-slate-800">{lowCount}</span>
                <div
                  className="w-12 bg-emerald-500 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-xs"
                  style={{ height: `${(lowCount / maxCount) * 180}px` }}
                />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  LOW
                </span>
              </div>

              {/* Bar 2: MEDIUM (Amber) */}
              <div className="flex flex-col items-center gap-2 w-16">
                <span className="text-xs font-bold text-slate-800">{medCount}</span>
                <div
                  className="w-12 bg-amber-500 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-xs"
                  style={{ height: `${(medCount / maxCount) * 180}px` }}
                />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  MEDIUM
                </span>
              </div>

              {/* Bar 3: HIGH (Red) */}
              <div className="flex flex-col items-center gap-2 w-16">
                <span className="text-xs font-bold text-slate-800">{highCount}</span>
                <div
                  className="w-12 bg-rose-500 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-xs"
                  style={{ height: `${(highCount / maxCount) * 180}px` }}
                />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  HIGH
                </span>
              </div>
            </div>
            <div className="text-center text-xs text-slate-400 mt-3 font-medium">
              Risk Classification
            </div>
          </div>
        </div>

        {/* Amount Distribution Donut Chart matching screenshot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Amount Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Value of transactions grouped by risk category</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6">
            {/* SVG Donut */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {renderDonutSegments()}
              </svg>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center px-2">
                <span className="text-xl font-extrabold text-slate-900">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
              </div>
            </div>

            {/* Legend with exact amounts & percentages matching screenshot */}
            <div className="space-y-4 w-full sm:w-auto">
              {/* Low Risk */}
              <div className="flex items-center justify-between sm:justify-start gap-8 text-sm">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-medium text-slate-700">Low Risk</span>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{lowAmount.toLocaleString("en-IN")}{" "}
                  <span className="text-slate-400 font-normal">({lowPercent}%)</span>
                </span>
              </div>

              {/* Medium Risk */}
              <div className="flex items-center justify-between sm:justify-start gap-8 text-sm">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-medium text-slate-700">Medium Risk</span>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{medAmount.toLocaleString("en-IN")}{" "}
                  <span className="text-slate-400 font-normal">({medPercent}%)</span>
                </span>
              </div>

              {/* High Risk */}
              <div className="flex items-center justify-between sm:justify-start gap-8 text-sm">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                  <span className="font-medium text-slate-700">High Risk</span>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{highAmount.toLocaleString("en-IN")}{" "}
                  <span className="text-slate-400 font-normal">({highPercent}%)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Fraud Losses Prevented</span>
            <h4 className="text-xl font-extrabold text-slate-900">₹{highAmount.toLocaleString("en-IN")}</h4>
            <span className="text-[11px] text-emerald-600 font-medium">100% Intercepted</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Model Evaluation Speed</span>
            <h4 className="text-xl font-extrabold text-slate-900">38 ms</h4>
            <span className="text-[11px] text-blue-600 font-medium">Real-Time In-Flight Check</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Precision Accuracy</span>
            <h4 className="text-xl font-extrabold text-slate-900">99.7%</h4>
            <span className="text-[11px] text-indigo-600 font-medium">NPCI Regulatory Grade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
