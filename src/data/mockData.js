// Initial Mock Data matching screenshot exactly
export const initialTransactions = [
  {
    id: "TXN10008",
    merchant: "rahulsharma@paytm",
    merchantName: "Rahul Sharma",
    amount: 50000,
    risk: "MEDIUM",
    riskScore: 58,
    status: "REVIEW",
    date: "23 May 2025, 10:45 AM",
    category: "Peer Transfer",
    reasons: [
      "Higher than usual peer transfer amount",
      "Recipient registered in different state",
      "Manual review initiated by risk engine"
    ]
  },
  {
    id: "TXN10007",
    merchant: "amazon@apl",
    merchantName: "Amazon India Marketplace",
    amount: 2500,
    risk: "LOW",
    riskScore: 12,
    status: "APPROVED",
    date: "23 May 2025, 09:30 AM",
    category: "E-Commerce",
    reasons: [
      "Verified merchant with trusted NPCI seal",
      "Consistent purchasing pattern",
      "Low financial liability score"
    ]
  },
  {
    id: "TXN10006",
    merchant: "unknown@upi",
    merchantName: "Suspicious P2P Endpoint",
    amount: 50000,
    risk: "HIGH",
    riskScore: 92,
    status: "BLOCKED",
    date: "22 May 2025, 11:15 PM",
    category: "High Risk Unknown VPA",
    reasons: [
      "Unusual amount for this user",
      "New device detected",
      "Suspicious location",
      "High risk merchant"
    ]
  },
  {
    id: "TXN10005",
    merchant: "flipkart@apl",
    merchantName: "Flipkart Internet Pvt Ltd",
    amount: 50000,
    risk: "MEDIUM",
    riskScore: 52,
    status: "REVIEW",
    date: "22 May 2025, 07:22 PM",
    category: "Electronics Shopping",
    reasons: [
      "Large lump-sum transaction",
      "Step-up OTP authentication pending verification",
      "Under routine velocity monitoring"
    ]
  },
  {
    id: "TXN10004",
    merchant: "zomato@upi",
    merchantName: "Zomato Limited",
    amount: 15000,
    risk: "LOW",
    riskScore: 18,
    status: "APPROVED",
    date: "22 May 2025, 01:10 PM",
    category: "Food & Dining",
    reasons: [
      "Regular recurring transaction partner",
      "Standard device fingerprint",
      "Safe transaction velocity"
    ]
  },
  {
    id: "TXN10003",
    merchant: "swiggy@upi",
    merchantName: "Bundl Technologies (Swiggy)",
    amount: 800,
    risk: "LOW",
    riskScore: 8,
    status: "APPROVED",
    date: "21 May 2025, 08:45 PM",
    category: "Food Delivery",
    reasons: [
      "Verified corporate merchant",
      "Typical spending threshold",
      "Zero prior disputes recorded"
    ]
  },
  {
    id: "TXN10002",
    merchant: "myshop@upi",
    merchantName: "My Local Kirana Store",
    amount: 3700,
    risk: "LOW",
    riskScore: 14,
    status: "APPROVED",
    date: "21 May 2025, 06:20 PM",
    category: "Groceries",
    reasons: [
      "Frequent local merchant",
      "Within typical basket size",
      "Low risk score"
    ]
  }
];

export const initialAlerts = [
  {
    id: "ALT-201",
    type: "HIGH_RISK",
    title: "High Risk Transaction",
    description: "Transaction of ₹50,000 to unknown@upi is blocked.",
    date: "22 May 2025, 11:15 PM",
    status: "BLOCKED",
    txnId: "TXN10006",
    viewed: false
  },
  {
    id: "ALT-202",
    type: "MEDIUM_RISK",
    title: "Medium Risk Transaction",
    description: "Transaction of ₹50,000 to flipkart@apl is under review.",
    date: "22 May 2025, 07:22 PM",
    status: "REVIEW",
    txnId: "TXN10005",
    viewed: false
  },
  {
    id: "ALT-203",
    type: "SECURITY",
    title: "New Device Login",
    description: "New login detected from Windows PC",
    date: "21 May 2025, 10:05 AM",
    status: "INFO",
    txnId: null,
    viewed: true
  },
  {
    id: "ALT-204",
    type: "REVIEW",
    title: "Transaction Under Review",
    description: "Transaction of ₹50,000 is under review.",
    date: "20 May 2025, 09:10 PM",
    status: "REVIEW",
    txnId: "TXN10008",
    viewed: true
  }
];

export const demoMerchants = [
  {
    vpa: "demo.merchant@upi",
    name: "Demo Quick Electronics Hub",
    legalName: "QuickElectro Digital Ltd (Unverified)",
    category: "Electronics & Gadgets",
    riskScore: 78,
    riskLevel: "HIGH",
    status: "HIGH RISK MERCHANT",
    reportedCount: 14,
    accountAge: "3 days old",
    location: "Kolkata, WB (IP routing via proxy)",
    bankName: "Unknown Cooperative Node",
    ifsc: "UTIB0009988",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=demo.merchant@upi&pn=Demo%20Quick%20Electronics&mc=5732",
    fraudReasons: [
      "New UPI VPA created less than 72 hours ago",
      "Reported by 14 users for payment fraud / non-delivery",
      "Banking beneficiary name mismatch with display name",
      "High velocity: 340 micro-requests in last 1 hour",
      "Failed NPCI Merchant Registry verification check"
    ],
    safetyWarning: "Do not send payments or scan QR codes promising discounts or lottery prizes from this merchant.",
    recommendation: "DO NOT PROCEED. Report this merchant to the Cyber Crime Helpline (1930)."
  },
  {
    vpa: "phishing.cashback@fakebank",
    name: "NPCI Instant 5000 Cashback",
    legalName: "Unknown Individual (Fake Gateway)",
    category: "Phishing / Scam",
    riskScore: 96,
    riskLevel: "CRITICAL",
    status: "CONFIRMED FRAUD MERCHANT",
    reportedCount: 89,
    accountAge: "14 hours old",
    location: "Unknown VPN / Tor Exit Node",
    bankName: "Flagged Account",
    ifsc: "PYTM0000001",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=phishing.cashback@fakebank&pn=Instant%20Cashback&mc=0000",
    fraudReasons: [
      "Blacklisted on National Cyber Crime Reporting Portal",
      "Malicious 'Reverse Payment' request attempt detected",
      "Phishing domain spoofing official banking portal",
      "Over 80+ chargeback & fraud disputes logged today"
    ],
    safetyWarning: "CRITICAL DANGER: Attempting to initiate this transaction will cause financial loss.",
    recommendation: "IMMEDIATELY BLOCKED by UPI SHIELD AI Engine."
  },
  {
    vpa: "starbucks.pay@hdfcbank",
    name: "Starbucks Coffee India",
    legalName: "Tata Starbucks Private Limited",
    category: "Food & Beverage",
    riskScore: 8,
    riskLevel: "LOW",
    status: "VERIFIED SAFE MERCHANT",
    reportedCount: 0,
    accountAge: "8 years old",
    location: "Mumbai, MH (Registered Corporate)",
    bankName: "HDFC Bank Ltd",
    ifsc: "HDFC0000060",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=starbucks.pay@hdfcbank&pn=Starbucks%20India&mc=5812",
    fraudReasons: [
      "Fully verified NPCI Merchant Tier-1 credentials",
      "Over 2.5 million successful transactions recorded",
      "Legitimate enterprise banking integration",
      "Zero open complaints or disputes"
    ],
    safetyWarning: "This is a trusted merchant. It is safe to proceed with standard UPI PIN.",
    recommendation: "Safe to pay."
  },
  {
    vpa: "quickloans.instant@ybl",
    name: "Instant 5-Min Paperless Loans",
    legalName: "FinEase Fast Credits Unregistered",
    category: "Micro-Financing",
    riskScore: 65,
    riskLevel: "MEDIUM",
    status: "SUSPICIOUS UNVERIFIED LENDER",
    reportedCount: 6,
    accountAge: "2 weeks old",
    location: "Jaipur, RJ",
    bankName: "Yes Bank Node",
    ifsc: "YESB0000123",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=quickloans.instant@ybl&pn=Instant%20Loans&mc=6012",
    fraudReasons: [
      "Lacks RBI NBFC registration certification",
      "Unsolicited loan processing fee request pattern",
      "Moderate complaints regarding unauthorized deductions"
    ],
    safetyWarning: "Legitimate lenders never request upfront UPI processing fees.",
    recommendation: "Proceed with extreme caution or verify NBFC credentials."
  },
  {
    vpa: "myshop@upi",
    name: "My Local Kirana Store",
    legalName: "Gupta General Stores",
    category: "Daily Essentials",
    riskScore: 14,
    riskLevel: "LOW",
    status: "APPROVED MERCHANT",
    reportedCount: 0,
    accountAge: "3 years old",
    location: "Bengaluru, KA",
    bankName: "ICICI Bank",
    ifsc: "ICIC0000002",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=myshop@upi&pn=Gupta%20Store&mc=5411",
    fraudReasons: [
      "Frequent neighborhood merchant",
      "Consistent low dispute frequency",
      "Legitimate UPI soundbox registered"
    ],
    safetyWarning: "Standard merchant transaction.",
    recommendation: "Safe to proceed."
  }
];

export const userProfile = {
  name: "Rupesh G",
  upiId: "rupesh@upi",
  phone: "+91 98765 43210",
  email: "rupesh@example.com",
  shieldStatus: "ACTIVE",
  protectionLevel: "MAXIMUM (AI Real-time)",
  totalProtectedSavings: "₹1,50,000+",
  lastLogin: "Today, 10:05 AM (Windows PC)",
  deviceFingerprint: "Win11-Chrome-Secured",
  linkedAccounts: [
    { bank: "State Bank of India", accNumber: "•••• 4921", primary: true, balance: 124500 },
    { bank: "HDFC Bank", accNumber: "•••• 8109", primary: false, balance: 45000 }
  ]
};
