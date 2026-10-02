import React, { useState, useEffect } from "react";
import {
  Send,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Smartphone,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { evaluateUpiTransaction } from "../utils/fraudDetection";

export default function SendMoneyView({ onNewTransaction, prefilledMerchant }) {
  const [recipientVpa, setRecipientVpa] = useState(prefilledMerchant?.vpa || "");
  const [amount, setAmount] = useState(prefilledMerchant?.riskScore >= 70 ? "50000" : "1500");
  const [note, setNote] = useState("");
  const [device, setDevice] = useState("Current Device (Windows PC)");
  const [location, setLocation] = useState("Home City (Bengaluru)");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHighRiskWarning, setShowHighRiskWarning] = useState(false);
  const [successTxn, setSuccessTxn] = useState(null);

  // Real-time evaluation
  const [evaluation, setEvaluation] = useState({
    riskScore: 8,
    riskLevel: "LOW",
    status: "APPROVED",
    reasons: []
  });

  useEffect(() => {
    if (prefilledMerchant) {
      setRecipientVpa(prefilledMerchant.vpa);
    }
  }, [prefilledMerchant]);

  useEffect(() => {
    const evalResult = evaluateUpiTransaction({
      recipientVpa,
      amount,
      note,
      device,
      location,
      timeHour: new Date().getHours()
    });
    setEvaluation(evalResult);
  }, [recipientVpa, amount, note, device, location]);

  const quickRecipients = [
    { label: "Amazon Pay", vpa: "amazon@apl", risk: "LOW" },
    { label: "Rahul Sharma", vpa: "rahulsharma@paytm", risk: "MEDIUM" },
    { label: "Unknown Node", vpa: "unknown@upi", risk: "HIGH" },
    { label: "Demo Merchant", vpa: "demo.merchant@upi", risk: "HIGH" },
    { label: "Cashback Scam", vpa: "phishing.cashback@fakebank", risk: "HIGH" },
    { label: "Starbucks India", vpa: "starbucks.pay@hdfcbank", risk: "LOW" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipientVpa || !amount) return;

    if (evaluation.riskLevel === "HIGH") {
      setShowHighRiskWarning(true);
      return;
    }

    processTransaction(evaluation.status);
  };

  const processTransaction = (finalStatus) => {
    setIsProcessing(true);

    setTimeout(() => {
      const newTxnId = `TXN${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const dateStr = `${now.getDate()} ${now.toLocaleString("en-US", { month: "short" })} ${now.getFullYear()}, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

      const newTxn = {
        id: newTxnId,
        merchant: recipientVpa,
        merchantName: evaluation.merchantDetails?.name || "P2P Recipient",
        amount: Number(amount),
        risk: evaluation.riskLevel,
        riskScore: evaluation.riskScore,
        status: finalStatus,
        date: dateStr,
        category: "Direct Payment",
        reasons: evaluation.reasons
      };

      onNewTransaction(newTxn);
      setIsProcessing(false);
      setShowHighRiskWarning(false);

      if (finalStatus === "APPROVED") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setSuccessTxn(newTxn);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Send Money</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Real-time AI behavioral fraud monitoring & transaction safety gateway
        </p>
      </div>

      {successTxn ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-5 animate-in zoom-in-95 duration-200">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
              successTxn.status === "APPROVED"
                ? "bg-emerald-100 text-emerald-600"
                : successTxn.status === "REVIEW"
                ? "bg-amber-100 text-amber-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {successTxn.status === "APPROVED" ? (
              <CheckCircle2 className="w-9 h-9" />
            ) : successTxn.status === "REVIEW" ? (
              <AlertTriangle className="w-9 h-9" />
            ) : (
              <Lock className="w-9 h-9" />
            )}
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                successTxn.status === "APPROVED"
                  ? "bg-emerald-100 text-emerald-800"
                  : successTxn.status === "REVIEW"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {successTxn.status}
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-3">
              ₹{successTxn.amount.toLocaleString("en-IN")}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              To <span className="font-semibold text-slate-800">{successTxn.merchant}</span>
            </p>
            <span className="text-xs text-slate-400 font-mono mt-1 block">
              Reference: {successTxn.id}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Evaluated Risk Score</span>
              <span className="font-bold text-slate-800">{successTxn.riskScore}/100 ({successTxn.risk})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timestamp</span>
              <span className="font-medium text-slate-700">{successTxn.date}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                setSuccessTxn(null);
                setRecipientVpa("");
                setAmount("1000");
                setNote("");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-500/25 transition-colors cursor-pointer"
            >
              Send Another Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Preset Recipient Chips */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Quick Test Recipients:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickRecipients.map((rec, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRecipientVpa(rec.vpa)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                        recipientVpa === rec.vpa
                          ? "bg-blue-600 text-white border-blue-600 font-bold"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {rec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient VPA */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Recipient UPI ID / Mobile
                </label>
                <input
                  type="text"
                  placeholder="e.g. unknown@upi or 9876543210@paytm"
                  value={recipientVpa}
                  onChange={(e) => setRecipientVpa(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Amount (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  {["500", "2500", "15000", "50000"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium cursor-pointer"
                    >
                      ₹{Number(preset).toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Remarks */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Note / Remarks (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner, Rent, or test 'cashback lottery'"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Simulated Device & Location Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Simulated Device
                  </label>
                  <select
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="Current Device (Windows PC)">Current Device (Windows PC)</option>
                    <option value="New Device (Android Emulator)">New Device (Android Emulator)</option>
                    <option value="Unrecognized Device (Rooted/Jailbroken)">Unrecognized Device (Rooted)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Simulated Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="Home City (Bengaluru)">Home City (Bengaluru)</option>
                    <option value="Suspicious Proxy / VPN Node">Suspicious Proxy / VPN</option>
                    <option value="Foreign IP (High Risk Geo)">Foreign IP (High Risk Geo)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isProcessing || !recipientVpa || !amount}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    evaluation.riskLevel === "HIGH"
                      ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                  }`}
                >
                  {isProcessing ? (
                    <span>Evaluating with AI Guard...</span>
                  ) : (
                    <>
                      <span>
                        {evaluation.riskLevel === "HIGH"
                          ? "Review High Risk Transaction"
                          : `Pay ₹${Number(amount || 0).toLocaleString("en-IN")}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Real-time AI Risk Telemetry Gauge Side */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Real-Time AI Risk Engine</span>
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  LIVE MODEL
                </span>
              </div>

              {/* Gauge Meter */}
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <div
                  className={`text-5xl font-black tracking-tight ${
                    evaluation.riskLevel === "HIGH"
                      ? "text-rose-600"
                      : evaluation.riskLevel === "MEDIUM"
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {evaluation.riskScore}
                  <span className="text-xl text-slate-400 font-medium"> / 100</span>
                </div>

                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    evaluation.riskLevel === "HIGH"
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : evaluation.riskLevel === "MEDIUM"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {evaluation.riskLevel} RISK • {evaluation.status}
                </span>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-full transition-all duration-300 ${
                      evaluation.riskLevel === "HIGH"
                        ? "bg-rose-500"
                        : evaluation.riskLevel === "MEDIUM"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${evaluation.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Triggered Heuristics List */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                  Evaluated Risk Indicators:
                </span>
                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {evaluation.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-2 bg-slate-50 p-2 rounded-lg">
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          evaluation.riskLevel === "HIGH"
                            ? "bg-rose-500"
                            : evaluation.riskLevel === "MEDIUM"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-slate-700 font-medium">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High Risk Intercept Warning Modal */}
      {showHighRiskWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-rose-200 overflow-hidden p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-extrabold text-slate-900">
                High Risk Transaction Detected
              </h3>
              <p className="text-xs text-rose-600 font-semibold mt-1">
                Risk Score: {evaluation.riskScore} / 100 • Auto-Blocked by UPI SHIELD
              </p>
            </div>

            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 text-xs space-y-2">
              <p className="font-bold text-rose-900">Flagged Risk Telemetry:</p>
              <ul className="space-y-1 text-rose-700">
                {evaluation.reasons.map((r, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span>•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => processTransaction("BLOCKED")}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-rose-500/25"
              >
                Confirm Block & Save to Audit Log
              </button>

              <button
                onClick={() => processTransaction("REVIEW")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Send to Manual Security Review
              </button>

              <button
                onClick={() => setShowHighRiskWarning(false)}
                className="w-full text-slate-400 hover:text-slate-600 font-semibold text-xs py-1.5 cursor-pointer"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
