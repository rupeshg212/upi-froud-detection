// Smart AI Fraud Detection Engine for UPI Transactions and QR Codes
import { demoMerchants } from "../data/mockData";

export const evaluateUpiTransaction = ({
  amount = 0,
  recipientVpa = "",
  recipientName = "",
  device = "Current Device",
  location = "Known City",
  timeHour = new Date().getHours(),
  isNewRecipient = false,
  note = ""
}) => {
  let score = 5;
  const reasons = [];
  const riskFactors = [];

  const parsedAmount = Number(amount) || 0;
  const vpaLower = recipientVpa.toLowerCase().trim();
  const noteLower = note.toLowerCase().trim();

  // Check against known merchant database first
  const matchedMerchant = demoMerchants.find(m => m.vpa.toLowerCase() === vpaLower);
  if (matchedMerchant) {
    if (matchedMerchant.riskScore >= 70) {
      score += matchedMerchant.riskScore * 0.7;
      reasons.push("High risk merchant");
      reasons.push(`Merchant has ${matchedMerchant.reportedCount} fraud complaints reported`);
      riskFactors.push("FLAGGED_MERCHANT");
    } else if (matchedMerchant.riskScore < 20) {
      score = Math.min(score, 12);
      reasons.push("Verified merchant with trusted NPCI seal");
      return {
        riskScore: Math.round(score),
        riskLevel: "LOW",
        status: "APPROVED",
        reasons,
        riskFactors,
        merchantDetails: matchedMerchant
      };
    }
  }

  // 1. Amount Threshold & Anomaly Detection
  if (parsedAmount >= 50000) {
    score += 35;
    reasons.push("Unusual amount for this user");
    riskFactors.push("AMOUNT_ANOMALY");
  } else if (parsedAmount >= 25000) {
    score += 20;
    reasons.push("Transaction amount exceeds typical daily baseline");
    riskFactors.push("HIGH_AMOUNT");
  } else if (parsedAmount > 10000) {
    score += 10;
  }

  // 2. Suspicious Keywords in VPA or Payment Notes
  const suspiciousKeywords = [
    "unknown", "cashback", "lottery", "prize", "reward", "crypto",
    "kyc", "refund", "support", "telegram", "claim", "free", "urgent",
    "fake", "hack", "deposit"
  ];

  const matchedKeywords = suspiciousKeywords.filter(kw => 
    vpaLower.includes(kw) || noteLower.includes(kw)
  );

  if (matchedKeywords.length > 0) {
    score += 40;
    reasons.push(`Suspicious keywords identified in VPA/Note: [${matchedKeywords.join(", ")}]`);
    riskFactors.push("SOCIAL_ENGINEERING_KEYWORD");
  }

  // 3. Known Untrusted or Spoofed Domains
  if (vpaLower.endsWith("@fakebank") || vpaLower.endsWith("@scam") || vpaLower.endsWith("@test")) {
    score += 50;
    reasons.push("Unregistered or synthetic banking handle (@fakebank)");
    riskFactors.push("INVALID_BANK_PSP");
  } else if (vpaLower.includes("unknown@upi")) {
    score += 45;
    reasons.push("Unverified recipient with no KYC footprint");
    riskFactors.push("UNVERIFIED_VPA");
  }

  // 4. Device & Location Check
  if (device.includes("New") || device.includes("Unknown") || device.includes("Unrecognized")) {
    score += 25;
    reasons.push("New device detected");
    riskFactors.push("UNRECOGNIZED_DEVICE");
  }

  if (location.includes("Proxy") || location.includes("VPN") || location.includes("Suspicious") || location.includes("Tor")) {
    score += 25;
    reasons.push("Suspicious location");
    riskFactors.push("ANOMALOUS_GEOLOCATION");
  }

  // 5. Time-of-Day Risk (Late Night hours: 11 PM to 5 AM)
  if (timeHour >= 23 || timeHour <= 4) {
    score += 15;
    reasons.push("Odd hour transaction (High fraud probability window: 11 PM - 4 AM)");
    riskFactors.push("ODD_HOUR_ANOMALY");
  }

  // 6. Generic High Risk merchant catch
  if (vpaLower.includes("unknown") || vpaLower.includes("demo.merchant")) {
    if (!reasons.includes("High risk merchant")) {
      reasons.push("High risk merchant");
    }
  }

  // Bound score between 1 and 99
  const finalScore = Math.min(Math.max(Math.round(score), 5), 98);

  let riskLevel = "LOW";
  let status = "APPROVED";

  if (finalScore >= 75) {
    riskLevel = "HIGH";
    status = "BLOCKED";
  } else if (finalScore >= 40) {
    riskLevel = "MEDIUM";
    status = "REVIEW";
  } else {
    riskLevel = "LOW";
    status = "APPROVED";
  }

  // Ensure default reason if low risk
  if (reasons.length === 0) {
    reasons.push("Standard transaction pattern");
    reasons.push("Verified recipient device and handle");
  }

  return {
    riskScore: finalScore,
    riskLevel,
    status,
    reasons,
    riskFactors,
    merchantDetails: matchedMerchant || null
  };
};

// Parse standard UPI QR Code string (e.g. upi://pay?pa=...&pn=...&am=...)
export const parseUpiQrString = (qrText) => {
  if (!qrText) return null;

  try {
    if (qrText.startsWith("upi://pay?") || qrText.includes("pa=")) {
      const queryPart = qrText.includes("?") ? qrText.split("?")[1] : qrText;
      const params = new URLSearchParams(queryPart);
      return {
        vpa: params.get("pa") || "",
        name: params.get("pn") || params.get("pa") || "Merchant",
        amount: params.get("am") || "",
        mc: params.get("mc") || "",
        tr: params.get("tr") || "",
        raw: qrText
      };
    }
  } catch (err) {
    console.error("Failed to parse UPI string", err);
  }

  // Plain VPA string fallback
  if (qrText.includes("@")) {
    return {
      vpa: qrText.trim(),
      name: qrText.split("@")[0],
      amount: "",
      mc: "",
      tr: "",
      raw: qrText
    };
  }

  return {
    vpa: qrText,
    name: "Unrecognized QR Endpoint",
    amount: "",
    mc: "",
    tr: "",
    raw: qrText
  };
};
