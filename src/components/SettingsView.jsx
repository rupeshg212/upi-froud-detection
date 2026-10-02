import React, { useState } from "react";
import { Sliders, Shield, Bell, Key, RotateCcw, Check } from "lucide-react";

export default function SettingsView({ onResetDemoData }) {
  const [sensitivity, setSensitivity] = useState("Balanced");
  const [autoBlock, setAutoBlock] = useState(true);
  const [instantAlerts, setInstantAlerts] = useState(true);
  const [require2FA, setRequire2FA] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Security Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure AI fraud sensitivity rules and defense automation</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        {/* Fraud Sensitivity Mode */}
        <div>
          <label className="font-bold text-slate-900 text-sm block mb-1">
            AI Fraud Detection Sensitivity
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Sets threshold for intercepting anomalies and high velocity requests
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "Strict", desc: "Flag Score > 60" },
              { id: "Balanced", desc: "Flag Score > 75 (Default)" },
              { id: "Permissive", desc: "Flag Score > 85" }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSensitivity(option.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  sensitivity === option.id
                    ? "border-blue-600 bg-blue-50/60 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <span
                  className={`font-bold text-xs block ${
                    sensitivity === option.id ? "text-blue-700" : "text-slate-800"
                  }`}
                >
                  {option.id}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          {/* Auto Block Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                Auto-Block High Risk Transactions
              </span>
              <span className="text-xs text-slate-500">
                Instantly intercept transactions matching known phishing or blacklisted handles
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoBlock}
              onChange={(e) => setAutoBlock(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* Instant SMS Alert */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                Instant Cyber Crime Alerts
              </span>
              <span className="text-xs text-slate-500">
                Send push notifications whenever new high risk activity or unknown login is logged
              </span>
            </div>
            <input
              type="checkbox"
              checked={instantAlerts}
              onChange={(e) => setInstantAlerts(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* Step-up 2FA for Medium Risk */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                Step-up Biometric / PIN Challenge
              </span>
              <span className="text-xs text-slate-500">
                Require secondary authentication for peer transfers exceeding daily average
              </span>
            </div>
            <input
              type="checkbox"
              checked={require2FA}
              onChange={(e) => setRequire2FA(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? "Preferences Saved!" : "Save Preferences"}</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Reset transactions and alerts back to demo dataset?")) {
                onResetDemoData();
              }
            }}
            className="text-xs text-slate-500 hover:text-rose-600 font-semibold flex items-center space-x-1 p-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
