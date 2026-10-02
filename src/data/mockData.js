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
    ],
    ensembleVotes: {
      mlp: 55,
      randomForest: 59,
      xgboost: 61,
      svm: 54,
      logisticRegression: 56,
      catBoostMeta: 58
    }
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
    ],
    ensembleVotes: {
      mlp: 14,
      randomForest: 10,
      xgboost: 11,
      svm: 15,
      logisticRegression: 12,
      catBoostMeta: 12
    }
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
    ],
    ensembleVotes: {
      mlp: 88,
      randomForest: 94,
      xgboost: 96,
      svm: 90,
      logisticRegression: 89,
      catBoostMeta: 92
    }
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
    ],
    ensembleVotes: {
      mlp: 48,
      randomForest: 54,
      xgboost: 53,
      svm: 51,
      logisticRegression: 50,
      catBoostMeta: 52
    }
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
    ],
    ensembleVotes: {
      mlp: 20,
      randomForest: 16,
      xgboost: 17,
      svm: 19,
      logisticRegression: 18,
      catBoostMeta: 18
    }
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
    ],
    ensembleVotes: {
      mlp: 9,
      randomForest: 7,
      xgboost: 8,
      svm: 10,
      logisticRegression: 8,
      catBoostMeta: 8
    }
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
    ],
    ensembleVotes: {
      mlp: 16,
      randomForest: 13,
      xgboost: 13,
      svm: 15,
      logisticRegression: 14,
      catBoostMeta: 14
    }
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
    ensembleVotes: {
      mlp: 74,
      randomForest: 81,
      xgboost: 82,
      svm: 72,
      logisticRegression: 75,
      catBoostMeta: 78
    },
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
    ensembleVotes: {
      mlp: 92,
      randomForest: 98,
      xgboost: 99,
      svm: 94,
      logisticRegression: 95,
      catBoostMeta: 96
    },
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
    ensembleVotes: {
      mlp: 10,
      randomForest: 6,
      xgboost: 7,
      svm: 9,
      logisticRegression: 8,
      catBoostMeta: 8
    },
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
    ensembleVotes: {
      mlp: 62,
      randomForest: 68,
      xgboost: 67,
      svm: 61,
      logisticRegression: 64,
      catBoostMeta: 65
    },
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
    ensembleVotes: {
      mlp: 16,
      randomForest: 12,
      xgboost: 13,
      svm: 15,
      logisticRegression: 14,
      catBoostMeta: 14
    },
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
  protectionLevel: "MAXIMUM (CatBoost Stacking Ensemble)",
  totalProtectedSavings: "₹1,50,000+",
  lastLogin: "Today, 10:05 AM (Windows PC)",
  deviceFingerprint: "Win11-Chrome-Secured",
  linkedAccounts: [
    { bank: "State Bank of India", accNumber: "•••• 4921", primary: true, balance: 124500 },
    { bank: "HDFC Bank", accNumber: "•••• 8109", primary: false, balance: 45000 }
  ]
};

// Research Paper Dataset Benchmark (From IEEE 2025: Table I & Figs 2a-e, Fig 3)
export const ensembleResearchBenchmarks = {
  paperTitle: "UPI Fraud Detection using Ensemble Learning",
  conference: "2025 IEEE International Conference on Cognitive, Green and Ubiquitous Computing (IC-CGU)",
  authors: [
    "Santosh Kumar Maharana",
    "Sankarsan Sahoo",
    "Sudhanshu Sekhar Rautaray",
    "Shreemanta Kumar Tripathy",
    "Meenakshi Kandpal",
    "Jyotirmayee Rautaray"
  ],
  institution: "Odisha University of Technology & Research (OUTR), Bhubaneswar & SOA University",
  doi: "10.1109/IC-CGU67042.2025.11338035",
  table1: [
    {
      model: "Decision Tree",
      accuracy: 87.82,
      precision: 87.00,
      recall: 88.78,
      f1Score: 87.88,
      rocAuc: 87.50,
      type: "Baseline Model",
      isProposed: false
    },
    {
      model: "K-Nearest Neighbours",
      accuracy: 91.37,
      precision: 90.09,
      recall: 92.86,
      f1Score: 91.45,
      rocAuc: 86.80,
      type: "Baseline Model",
      isProposed: false
    },
    {
      model: "MLP Classifier (Neural Net)",
      accuracy: 92.38,
      precision: 90.29,
      recall: 94.89,
      f1Score: 92.53,
      rocAuc: 92.40,
      type: "Level-0 Base Classifier",
      isProposed: false
    },
    {
      model: "Gradient Boosting",
      accuracy: 93.40,
      precision: 94.73,
      recall: 91.83,
      f1Score: 93.26,
      rocAuc: 93.10,
      type: "Baseline Model",
      isProposed: false
    },
    {
      model: "Random Forest",
      accuracy: 95.43,
      precision: 95.87,
      recall: 94.89,
      f1Score: 95.38,
      rocAuc: 95.10,
      type: "Level-0 Base Classifier",
      isProposed: false
    },
    {
      model: "Support Vector Classifier (SVM)",
      accuracy: 95.43,
      precision: 96.84,
      recall: 93.87,
      f1Score: 95.34,
      rocAuc: 94.80,
      type: "Level-0 Base Classifier",
      isProposed: false
    },
    {
      model: "Logistic Regression",
      accuracy: 95.94,
      precision: 95.87,
      recall: 93.87,
      f1Score: 95.83,
      rocAuc: 87.20,
      type: "Level-0 Base Classifier",
      isProposed: false
    },
    {
      model: "XGBoost",
      accuracy: 95.94,
      precision: 94.12,
      recall: 96.93,
      f1Score: 95.94,
      rocAuc: 96.44,
      type: "Level-0 Base Classifier",
      isProposed: false
    },
    {
      model: "Stacked Ensemble Model (Proposed)",
      accuracy: 96.95,
      precision: 96.00,
      recall: 97.95,
      f1Score: 96.97,
      rocAuc: 99.00,
      type: "Two-Level Stacking with CatBoost Meta-Learner",
      isProposed: true
    }
  ],
  stackingPipeline: [
    {
      step: 1,
      title: "Input UPI Data Stream",
      description: "Captures transaction amount, timestamp, user & device identifiers, and VPA endpoint."
    },
    {
      step: 2,
      title: "Data Preprocessing & SMOTE",
      description: "Median imputation for continuous, mode for categorical, StandardScaler, and SMOTE oversampling for class imbalance."
    },
    {
      step: 3,
      title: "Feature Engineering",
      description: "Extracts hour & day of transaction, amount-to-frequency user ratio, velocity anomalies."
    },
    {
      step: 4,
      title: "Level-0 Base Classifiers",
      description: "5 Diverse Models: MLP Neural Net, Random Forest, XGBoost, Support Vector Machine (SVM), Logistic Regression."
    },
    {
      step: 5,
      title: "Out-of-Fold (OOF) Meta-Matrix",
      description: "K-Fold Cross-Validation generates prediction probabilities forming the Level-1 meta-feature matrix."
    },
    {
      step: 6,
      title: "Level-1 Meta-Learner (CatBoost)",
      description: "CatBoost trained with logistic loss on meta-features, synthesizing base model weights to yield optimal fraud probability."
    }
  ]
};
