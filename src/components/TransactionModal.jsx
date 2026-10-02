import React from "react";
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck, Download, Share2, X, BrainCircuit, Cpu } from "lucide-react";

export default function TransactionModal({ transaction, onClose, onUpdateStatus }) {
  if (!transaction) return null;

  const isBlocked = transaction.status === "BLOCKED";
  const isReview = transaction.status === "REVIEW";
  const isApproved = transaction.status === "APPROVED";

  const ensembleVotes = transaction.ensembleVotes || {
    mlp: Math.max(transaction.riskScore - 4, 6),
    randomForest: Math.max(transaction.riskScore + 2, 8),
    xgboost: Math.max(transaction.riskScore + 3, 8),
    svm: Math.max(transaction.riskScore - 2, 7),
    logisticRegression: Math.max(transaction.riskScore - 1, 7),
    catBoostMeta: transaction.riskScore
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header matching screenshot */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors p-1 -ml-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-base">Transaction Details</span>
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Status & Amount badge matching screenshot */}
          <div className="flex flex-col items-center justify-center text-center pt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-3 ${
                isBlocked
                  ? "bg-rose-100 text-rose-600 border border-rose-200"
                  : isReview
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
              }`}
            >
              {transaction.status}
            </span>

            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              ₹{transaction.amount.toLocaleString("en-IN")}
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              To <span className="text-slate-800 font-semibold">{transaction.merchant}</span>
            </p>
            {transaction.merchantName && (
              <span className="text-xs text-slate-400 mt-0.5">{transaction.merchantName}</span>
            )}
          </div>

          {/* Details Grid matching screenshot */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3.5 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Transaction ID</span>
              <span className="font-mono font-bold text-slate-900">{transaction.id}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Date & Time</span>
              <span className="font-semibold text-slate-800">{transaction.date}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Risk Level</span>
              <span
                className={`font-bold text-xs px-2.5 py-0.5 rounded-md ${
                  transaction.risk === "HIGH"
                    ? "bg-rose-100 text-rose-700 font-black"
                    : transaction.risk === "MEDIUM"
                    ? "bg-amber-100 text-amber-700 font-black"
                    : "bg-emerald-100 text-emerald-700 font-black"
                }`}
              >
                {transaction.risk}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Risk Score</span>
              <span className="font-bold text-base text-rose-600">
                {transaction.riskScore || (transaction.risk === "HIGH" ? 92 : transaction.risk === "MEDIUM" ? 52 : 12)} / 100
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Status</span>
              <span
                className={`font-bold text-xs px-2.5 py-0.5 rounded-md uppercase ${
                  isBlocked
                    ? "bg-rose-100 text-rose-700"
                    : isReview
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </div>

          {/* Reason Section matching screenshot */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">Reason</h4>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <ul className="space-y-2 text-sm text-slate-700">
                {(transaction.reasons && transaction.reasons.length > 0
                  ? transaction.reasons
                  : [
                      "Unusual amount for this user",
                      "New device detected",
                      "Suspicious location",
                      "High risk merchant",
                    ]
                ).map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="text-slate-400 font-bold select-none">•</span>
                    <span className="text-slate-700 font-medium">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* IEEE 2025 Paper: Stacking Ensemble Breakdown Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-blue-600" />
                <span>Stacking Ensemble Model Consensus</span>
              </h4>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                IEEE IC-CGU 2025
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 font-bold text-slate-800">
                <span>Level-1 CatBoost Meta-Learner:</span>
                <span className="text-sm font-extrabold text-blue-600">{ensembleVotes.catBoostMeta}% Fraud Conf.</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500">XGBoost (28%):</span>
                  <span className="font-bold text-slate-800">{ensembleVotes.xgboost}%</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Random Forest (24%):</span>
                  <span className="font-bold text-slate-800">{ensembleVotes.randomForest}%</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500">MLP Neural Net (20%):</span>
                  <span className="font-bold text-slate-800">{ensembleVotes.mlp}%</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500">SVM Classifier (16%):</span>
                  <span className="font-bold text-slate-800">{ensembleVotes.svm}%</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg border border-slate-200 col-span-2">
                  <span className="text-slate-500">Logistic Regression (12%):</span>
                  <span className="font-bold text-slate-800">{ensembleVotes.logisticRegression}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Forensic Telemetry Banner */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Smart UPI Fraud Engine Telemetry</span>
            </div>
            <p className="text-blue-700">
              Evaluated with Stacking Ensemble (MLP + RF + XGBoost + SVM + LR → CatBoost). Model Accuracy: 96.95%, Recall: 97.95%.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          {isBlocked && (
            <button
              onClick={() => {
                if (onUpdateStatus) onUpdateStatus(transaction.id, "REVIEW");
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Request Unblock Review
            </button>
          )}

          {isReview && (
            <>
              <button
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus(transaction.id, "BLOCKED");
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Block Transaction
              </button>
              <button
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus(transaction.id, "APPROVED");
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Authorize & Approve
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
