import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Camera,
  Upload,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X,
  FileWarning
} from "lucide-react";
import { demoMerchants } from "../data/mockData";
import { evaluateUpiTransaction, parseUpiQrString } from "../utils/fraudDetection";

export default function ScanMerchantView({ onBack, onPayMerchant }) {
  // Currently detected merchant / scan result
  // Default to demo.merchant@upi matching screenshot so the user sees the exact result immediately or can re-scan!
  const defaultMerchant = demoMerchants.find(m => m.vpa === "demo.merchant@upi") || demoMerchants[0];

  const [scannedData, setScannedData] = useState(defaultMerchant);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerMode, setScannerMode] = useState("preset"); // 'preset' | 'camera' | 'upload' | 'manual'
  const [manualVpa, setManualVpa] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  const handleSelectPreset = (merchant) => {
    stopCameraScanner();
    setIsScanning(true);
    setTimeout(() => {
      setScannedData(merchant);
      setIsScanning(false);
    }, 400);
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualVpa.trim()) return;

    setIsScanning(true);
    const parsed = parseUpiQrString(manualVpa);
    const evaluation = evaluateUpiTransaction({
      recipientVpa: parsed.vpa,
      amount: 1000
    });

    const matched = demoMerchants.find(m => m.vpa.toLowerCase() === parsed.vpa.toLowerCase());

    const result = matched || {
      vpa: parsed.vpa,
      name: parsed.name || parsed.vpa.split("@")[0],
      legalName: "Unknown Legal Entity",
      category: "Unclassified Entity",
      riskScore: evaluation.riskScore,
      riskLevel: evaluation.riskLevel,
      status: evaluation.riskLevel === "HIGH" ? "HIGH RISK MERCHANT" : evaluation.riskLevel === "MEDIUM" ? "MEDIUM RISK MERCHANT" : "VERIFIED SAFE MERCHANT",
      reportedCount: evaluation.riskLevel === "HIGH" ? 12 : 0,
      accountAge: evaluation.riskLevel === "HIGH" ? "2 days old" : "1 year old",
      location: "Unknown Location",
      bankName: "Standard PSP Node",
      ifsc: "UNKNOWN001",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(manualVpa)}`,
      fraudReasons: evaluation.reasons,
      safetyWarning: evaluation.riskLevel === "HIGH" ? "This entity exhibits high-risk telemetry indicators." : "Safe to transact with standard caution.",
      recommendation: evaluation.riskLevel === "HIGH" ? "DO NOT PROCEED with payment." : "Proceed with transaction."
    };

    setTimeout(() => {
      setScannedData(result);
      setIsScanning(false);
    }, 500);
  };

  // Start Camera Scanner via html5-qrcode
  const startCameraScanner = async () => {
    setCameraError("");
    setScannerMode("camera");

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
      }

      const qrScanner = new Html5Qrcode("qr-camera-feed");
      html5QrCodeRef.current = qrScanner;

      setCameraActive(true);

      await qrScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 }
        },
        (decodedText) => {
          // Detected!
          handleQrDecoded(decodedText);
          stopCameraScanner();
        },
        (errorMessage) => {
          // Scanning frame...
        }
      );
    } catch (err) {
      console.warn("Camera init error:", err);
      setCameraError("Camera access not available or blocked in browser. Use preset QRs or file upload below.");
      setCameraActive(false);
    }
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        // ignore
      }
      setCameraActive(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const qrScanner = new Html5Qrcode("qr-hidden-file-decoder");
      const result = await qrScanner.scanFile(file, true);
      handleQrDecoded(result);
    } catch (err) {
      // Fallback: If unreadable, simulate evaluating a sample
      alert("Could not detect clear QR from image. Testing with demo merchant.");
      handleSelectPreset(demoMerchants[0]);
    }
  };

  const handleQrDecoded = (decodedText) => {
    setIsScanning(true);
    const parsed = parseUpiQrString(decodedText);
    const matched = demoMerchants.find(m => m.vpa.toLowerCase() === parsed.vpa.toLowerCase());

    const evaluation = evaluateUpiTransaction({
      recipientVpa: parsed.vpa,
      amount: parsed.amount || 1000
    });

    const result = matched || {
      vpa: parsed.vpa,
      name: parsed.name || "Scanned Merchant",
      legalName: "Entity via QR payload",
      category: "Retail / Utility",
      riskScore: evaluation.riskScore,
      riskLevel: evaluation.riskLevel,
      status: evaluation.riskLevel === "HIGH" ? "HIGH RISK MERCHANT" : "VERIFIED SAFE MERCHANT",
      reportedCount: evaluation.riskLevel === "HIGH" ? 14 : 0,
      accountAge: "1 week old",
      location: "Scanned Target",
      bankName: "UPI Linked Bank",
      ifsc: "UPI0000001",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(decodedText)}`,
      fraudReasons: evaluation.reasons,
      safetyWarning: evaluation.riskLevel === "HIGH" ? "High risk detected in scanned QR endpoint." : "Verified merchant QR.",
      recommendation: evaluation.riskLevel === "HIGH" ? "DO NOT PROCEED." : "Safe to pay."
    };

    setTimeout(() => {
      setScannedData(result);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hidden container for file decoding */}
      <div id="qr-hidden-file-decoder" className="hidden"></div>

      {/* Header matching screenshot */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-lg text-slate-900">Scan Merchant</span>
        </button>

        <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full border border-blue-200/60">
          Smart QR Fraud Scanner
        </span>
      </div>

      {/* Main Scanner Container & Preview Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Scanner Viewfinder matching screenshot exactly */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center">
          {/* Scanner Viewfinder Box */}
          <div className="relative w-64 h-64 bg-slate-950 rounded-3xl p-4 flex items-center justify-center overflow-hidden border-2 border-slate-800 shadow-inner">
            {/* Green HUD Corner brackets matching screenshot */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl pointer-events-none z-20"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl pointer-events-none z-20"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl pointer-events-none z-20"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl pointer-events-none z-20"></div>

            {/* Red Laser Scanning Line animation */}
            <div className="animate-scan-line z-20"></div>

            {/* Content inside camera frame */}
            {cameraActive ? (
              <div id="qr-camera-feed" className="w-full h-full rounded-2xl overflow-hidden z-10"></div>
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center p-2">
                <img
                  src={scannedData.qrCodeUrl}
                  alt="Scanned QR"
                  className="w-44 h-44 rounded-xl object-contain bg-white p-2 shadow-md transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* Scanner Source Toggles */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full">
            <button
              onClick={() => {
                if (cameraActive) stopCameraScanner();
                else startCameraScanner();
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                cameraActive
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cameraActive ? "Stop Camera" : "Open Camera"}</span>
            </button>

            <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload QR</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {cameraError && (
            <p className="mt-2 text-[11px] text-amber-600 text-center font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
              {cameraError}
            </p>
          )}

          {/* Detection Card Section matching screenshot */}
          <div className="mt-6 w-full text-center space-y-3">
            <div>
              <span className="text-emerald-500 font-bold text-sm tracking-wide block">
                Merchant Detected!
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-mono tracking-tight mt-0.5">
                {scannedData.vpa}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{scannedData.name}</p>
            </div>

            {/* Risk Score */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Risk Score
              </span>
              <span
                className={`text-4xl font-extrabold tracking-tight mt-0.5 block ${
                  scannedData.riskScore >= 70
                    ? "text-rose-600"
                    : scannedData.riskScore >= 40
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                {scannedData.riskScore} <span className="text-xl text-slate-400 font-normal">/ 100</span>
              </span>
            </div>

            {/* Badge matching screenshot */}
            <div>
              <span
                className={`inline-block px-4 py-1.5 rounded-md text-xs font-black tracking-wider uppercase ${
                  scannedData.riskScore >= 70
                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                    : scannedData.riskScore >= 40
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                }`}
              >
                {scannedData.status}
              </span>
            </div>

            {/* View Merchant Details Button matching screenshot */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.01]"
            >
              View Merchant Details
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Test Suite & Preset QRs */}
        <div className="md:col-span-6 space-y-4">
          {/* Quick Preset Selector */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center justify-between">
              <span>Select Sample Merchant QR to Test:</span>
              <span className="text-[11px] font-normal text-slate-400">Instant AI Check</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Click any merchant below to load its QR code and live fraud risk analysis:
            </p>

            <div className="space-y-2">
              {demoMerchants.map((merchant) => {
                const isSelected = scannedData.vpa === merchant.vpa;
                const isDanger = merchant.riskScore >= 70;
                const isWarning = merchant.riskScore >= 40 && merchant.riskScore < 70;

                return (
                  <div
                    key={merchant.vpa}
                    onClick={() => handleSelectPreset(merchant)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isDanger
                            ? "bg-rose-100 text-rose-700"
                            : isWarning
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isDanger ? "!" : isWarning ? "?" : "✓"}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block font-mono">
                          {merchant.vpa}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">
                          {merchant.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-extrabold ${
                          isDanger
                            ? "text-rose-600"
                            : isWarning
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {merchant.riskScore}/100
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {merchant.riskLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Manual UPI Test Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Test Custom UPI ID / QR Payload</h4>
            <p className="text-xs text-slate-500 mb-3">
              Type any handle (e.g. <code>lottery.winner@fakebank</code>) to test detection:
            </p>

            <form onSubmit={handleManualSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. cashback.claim@fakebank"
                value={manualVpa}
                onChange={(e) => setManualVpa(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Evaluate
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Detailed Merchant Forensic Breakdown Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-2">
                <ShieldAlert
                  className={`w-5 h-5 ${
                    scannedData.riskScore >= 70
                      ? "text-rose-600"
                      : scannedData.riskScore >= 40
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                />
                <h3 className="font-bold text-base text-slate-900">Merchant Security Analysis</h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Alert Status Banner */}
              <div
                className={`p-4 rounded-2xl border ${
                  scannedData.riskScore >= 70
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : scannedData.riskScore >= 40
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs uppercase tracking-wider">
                    {scannedData.status}
                  </span>
                  <span className="font-extrabold text-sm">
                    Risk Score: {scannedData.riskScore}/100
                  </span>
                </div>
                <p className="text-xs mt-1.5 font-medium leading-relaxed">
                  {scannedData.safetyWarning}
                </p>
              </div>

              {/* Merchant Profile Grid */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2.5 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-200/50">
                  <span className="text-slate-500 font-medium">UPI VPA Handle</span>
                  <span className="font-bold text-slate-900 font-mono">{scannedData.vpa}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/50">
                  <span className="text-slate-500 font-medium">Business / Display Name</span>
                  <span className="font-semibold text-slate-800">{scannedData.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/50">
                  <span className="text-slate-500 font-medium">Legal Bank Entity</span>
                  <span className="font-semibold text-slate-800">{scannedData.legalName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/50">
                  <span className="text-slate-500 font-medium">Category</span>
                  <span className="font-medium text-slate-800">{scannedData.category}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/50">
                  <span className="text-slate-500 font-medium">Account Age</span>
                  <span className="font-medium text-slate-800">{scannedData.accountAge}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/50">
                  <span className="text-slate-500 font-medium">Reported Fraud Complaints</span>
                  <span
                    className={`font-bold ${
                      scannedData.reportedCount > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {scannedData.reportedCount} complaints
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Geo Location</span>
                  <span className="font-medium text-slate-700">{scannedData.location}</span>
                </div>
              </div>

              {/* Fraud Indicators List */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <FileWarning className="w-4 h-4 text-slate-500" />
                  <span>Fraud Risk Indicators</span>
                </h4>
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                  {scannedData.fraudReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          scannedData.riskScore >= 70
                            ? "bg-rose-500"
                            : scannedData.riskScore >= 40
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-slate-700 font-medium">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-600 flex items-start space-x-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-800">Recommendation: </strong>
                  {scannedData.recommendation}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              {scannedData.riskScore >= 70 ? (
                <button
                  onClick={() => {
                    alert(`Report logged for ${scannedData.vpa}. Shared with National Cyber Crime Reporting Portal.`);
                    setShowDetailModal(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Report to Cyber Crime Cell
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    onPayMerchant(scannedData);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Proceed to Pay Merchant
                </button>
              )}

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
