# 🛡️ UPI SHIELD — Smart Real-Time UPI Fraud Detection & Merchant QR Scanner

A production-grade, real-time AI-powered UPI fraud detection and prevention web application modeled after modern financial security systems.

![UPI SHIELD Dashboard](https://img.shields.io/badge/UPI_SHIELD-v2.4_Active-blue?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Live_Localhost:5173-emerald?style=for-the-badge)

---

## 🌟 Key Features

### 1. 📷 Merchant QR Scanner & Fraud Forensic Engine
* **Real-time Camera Scanner**: Uses live device webcam/camera to scan standard UPI QR codes (`upi://pay?pa=...`).
* **Image Upload**: Upload QR code screenshots or photos for instant decoding.
* **Instant Demo QR Presets**: Test with pre-configured high-risk, critical scam, and verified merchants:
  * `demo.merchant@upi` → **Risk Score: 78 / 100 (HIGH RISK MERCHANT)** (matches UI design)
  * `phishing.cashback@fakebank` → **Risk Score: 96 / 100 (CONFIRMED FRAUD MERCHANT)**
  * `starbucks.pay@hdfcbank` → **Risk Score: 8 / 100 (VERIFIED SAFE MERCHANT)**
  * `quickloans.instant@ybl` → **Risk Score: 65 / 100 (SUSPICIOUS UNVERIFIED LENDER)**
  * `myshop@upi` → **Risk Score: 14 / 100 (APPROVED LOCAL MERCHANT)**
* **In-depth Fraud Breakdown Modal**:
  * NPCI Verification & legal bank entity checks
  * VPA account creation age (e.g. `< 72 hours old`)
  * Complaint volume tracking (e.g. `14 open user fraud disputes`)
  * Display name vs. legal beneficiary mismatch alerts
  * Velocity spike indicators (e.g. `340 micro-transactions in 1 hour`)
  * Clear safety recommendations & Cyber Crime Reporting (1930) integration.

---

### 2. ⚡ Real-Time In-Flight Send Money Guard
* As the user enters amount, recipient VPA, and note, the **AI Fraud Engine computes risk in real time (38ms latency)**:
  * **Amount Anomaly**: Flags transactions exceeding user's standard daily patterns (e.g. ₹50,000).
  * **Keyword Heuristics**: Detects social engineering terms like `cashback`, `lottery`, `crypto`, `kyc`, `refund`.
  * **Device & Location Fingerprinting**: Flags logins or transfers initiated from unrecognized devices or proxy IPs.
  * **Odd-Hour Anomaly**: Evaluates late-night high-risk time windows (11:00 PM – 4:00 AM).
* **Automatic Defense Actions**:
  * Safe transactions: Immediate approval with celebratory confetti.
  * Medium risk: Prompts step-up 2FA PIN verification.
  * High risk: Intercepts and blocks payment with full explanation.

---

### 3. 📊 Dashboard (Matching Design)
* **4 Core Metrics**:
  * Total Transactions: `7` (This Month)
  * Total Amount: `₹181,000` (This Month)
  * Fraud Detected: `1` (This Month)
  * Blocked: `1` (This Month)
* **SVG Interactive Donut Charts**:
  * **Risk Overview**: Low Risk 3 (42.9%), Medium Risk 3 (42.9%), High Risk 1 (14.2%)
  * **Transaction Status**: Approved 2 (28.6%), Under Review 3 (42.9%), Blocked 1 (14.2%)
* **High Risk Alert Banner**: Direct quick access to active security threats.
* **Recent Activity Feed**: Real-time table preview with risk tags.

---

### 4. 💳 Transactions Audit Trail & Detail View
* Searchable and filterable by status (`Approved`, `Review`, `Blocked`, `High`, `Medium`, `Low`).
* Exportable to CSV audit logs.
* **Transaction Detail View**:
  * Status badge: `BLOCKED` / `REVIEW` / `APPROVED`
  * Recipient info & amount: `₹50,000 To unknown@upi`
  * Reference ID: `TXN10006`, Timestamp: `22 May 2025, 11:15 PM`
  * Risk Score: `92 / 100 (HIGH)`
  * Bullet-point reason breakdown:
    * • Unusual amount for this user
    * • New device detected
    * • Suspicious location
    * • High risk merchant

---

### 5. 📈 Analytics
* **Risk Distribution Bar Chart**: Exact count comparison between LOW (3), MEDIUM (3), and HIGH (1).
* **Amount Distribution Donut Chart**:
  * Total: `₹181,000`
  * Low Risk: `₹16,000 (8.8%)`
  * Medium Risk: `₹115,000 (63.5%)`
  * High Risk: `₹50,000 (27.6%)`
* Key Performance Metrics: Fraud losses prevented, sub-second inference speed, precision accuracy.

---

### 6. 🔔 Alerts Center
* Categorized threat log: High Risk (Blocked), Medium Risk (Review), New Device Login, etc.
* Direct action buttons to view full transaction forensics or dismiss alerts.

---

### 7. 🔐 User Profile & Security Settings
* User Identity: **Rupesh G** (`rupesh@upi`).
* Linked Bank accounts (State Bank of India, HDFC Bank) with live balance view.
* Configurable AI Sensitivity (Strict / Balanced / Permissive).
* Toggle Auto-Block, 2FA Step-up, and instant Push Notifications.
* Reset to default demo data at any time.

---

## 🚀 How to Run Locally

The server is already running in background at:
```
http://localhost:5173/
```

To run manually in any terminal:
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🛠️ Tech Stack
* **Frontend Framework**: React 19 + Vite 8
* **Styling**: Tailwind CSS v4 + Custom HUD scanner animations
* **Icons**: Lucide React
* **QR Engine**: Html5-Qrcode (Camera + File Upload + Payload Parser)
* **Effects**: Canvas Confetti
* **State Management**: React state + LocalStorage persistence
