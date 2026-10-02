import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "upi_shield.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Transactions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        merchant TEXT NOT NULL,
        merchant_name TEXT,
        amount REAL NOT NULL,
        risk TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL,
        category TEXT,
        reasons TEXT,
        ensemble_votes TEXT
    )
    """)

    # Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        txn_id TEXT,
        viewed INTEGER DEFAULT 0
    )
    """)

    # Merchants Registry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS merchants (
        vpa TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        legal_name TEXT,
        category TEXT,
        risk_score INTEGER NOT NULL,
        risk_level TEXT NOT NULL,
        status TEXT NOT NULL,
        reported_count INTEGER DEFAULT 0,
        account_age TEXT,
        location TEXT,
        bank_name TEXT,
        ifsc TEXT,
        qr_code_url TEXT,
        fraud_reasons TEXT,
        ensemble_votes TEXT,
        safety_warning TEXT,
        recommendation TEXT
    )
    """)

    # Seed Initial Merchants if empty
    cursor.execute("SELECT COUNT(*) as count FROM merchants")
    if cursor.fetchone()["count"] == 0:
        seed_merchants = [
            (
                "demo.merchant@upi",
                "Demo Quick Electronics Hub",
                "QuickElectro Digital Ltd (Unverified)",
                "Electronics & Gadgets",
                78,
                "HIGH",
                "HIGH RISK MERCHANT",
                14,
                "3 days old",
                "Kolkata, WB (IP routing via proxy)",
                "Unknown Cooperative Node",
                "UTIB0009988",
                "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=demo.merchant@upi&pn=Demo%20Quick%20Electronics&mc=5732",
                json.dumps([
                    "New UPI VPA created less than 72 hours ago",
                    "Reported by 14 users for payment fraud / non-delivery",
                    "Banking beneficiary name mismatch with display name",
                    "High velocity: 340 micro-requests in last 1 hour",
                    "Failed NPCI Merchant Registry verification check"
                ]),
                json.dumps({"mlp": 74, "randomForest": 81, "xgboost": 82, "svm": 72, "logisticRegression": 75, "catBoostMeta": 78}),
                "Do not send payments or scan QR codes promising discounts or lottery prizes from this merchant.",
                "DO NOT PROCEED. Report this merchant to the Cyber Crime Helpline (1930)."
            ),
            (
                "phishing.cashback@fakebank",
                "NPCI Instant 5000 Cashback",
                "Unknown Individual (Fake Gateway)",
                "Phishing / Scam",
                96,
                "CRITICAL",
                "CONFIRMED FRAUD MERCHANT",
                89,
                "14 hours old",
                "Unknown VPN / Tor Exit Node",
                "Flagged Account",
                "PYTM0000001",
                "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=phishing.cashback@fakebank&pn=Instant%20Cashback&mc=0000",
                json.dumps([
                    "Blacklisted on National Cyber Crime Reporting Portal",
                    "Malicious 'Reverse Payment' request attempt detected",
                    "Phishing domain spoofing official banking portal",
                    "Over 80+ chargeback & fraud disputes logged today"
                ]),
                json.dumps({"mlp": 92, "randomForest": 98, "xgboost": 99, "svm": 94, "logisticRegression": 95, "catBoostMeta": 96}),
                "CRITICAL DANGER: Attempting to initiate this transaction will cause financial loss.",
                "IMMEDIATELY BLOCKED by UPI SHIELD AI Engine."
            ),
            (
                "starbucks.pay@hdfcbank",
                "Starbucks Coffee India",
                "Tata Starbucks Private Limited",
                "Food & Beverage",
                8,
                "LOW",
                "VERIFIED SAFE MERCHANT",
                0,
                "8 years old",
                "Mumbai, MH (Registered Corporate)",
                "HDFC Bank Ltd",
                "HDFC0000060",
                "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=starbucks.pay@hdfcbank&pn=Starbucks%20India&mc=5812",
                json.dumps([
                    "Fully verified NPCI Merchant Tier-1 credentials",
                    "Over 2.5 million successful transactions recorded",
                    "Legitimate enterprise banking integration",
                    "Zero open complaints or disputes"
                ]),
                json.dumps({"mlp": 10, "randomForest": 6, "xgboost": 7, "svm": 9, "logisticRegression": 8, "catBoostMeta": 8}),
                "This is a trusted merchant. It is safe to proceed with standard UPI PIN.",
                "Safe to pay."
            ),
            (
                "quickloans.instant@ybl",
                "Instant 5-Min Paperless Loans",
                "FinEase Fast Credits Unregistered",
                "Micro-Financing",
                65,
                "MEDIUM",
                "SUSPICIOUS UNVERIFIED LENDER",
                6,
                "2 weeks old",
                "Jaipur, RJ",
                "Yes Bank Node",
                "YESB0000123",
                "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=quickloans.instant@ybl&pn=Instant%20Loans&mc=6012",
                json.dumps([
                    "Lacks RBI NBFC registration certification",
                    "Unsolicited loan processing fee request pattern",
                    "Moderate complaints regarding unauthorized deductions"
                ]),
                json.dumps({"mlp": 62, "randomForest": 68, "xgboost": 67, "svm": 61, "logisticRegression": 64, "catBoostMeta": 65}),
                "Legitimate lenders never request upfront UPI processing fees.",
                "Proceed with extreme caution or verify NBFC credentials."
            ),
            (
                "myshop@upi",
                "My Local Kirana Store",
                "Gupta General Stores",
                "Daily Essentials",
                14,
                "LOW",
                "APPROVED MERCHANT",
                0,
                "3 years old",
                "Bengaluru, KA",
                "ICICI Bank",
                "ICIC0000002",
                "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=myshop@upi&pn=Gupta%20Store&mc=5411",
                json.dumps([
                    "Frequent neighborhood merchant",
                    "Consistent low dispute frequency",
                    "Legitimate UPI soundbox registered"
                ]),
                json.dumps({"mlp": 16, "randomForest": 12, "xgboost": 13, "svm": 15, "logisticRegression": 14, "catBoostMeta": 14}),
                "Standard merchant transaction.",
                "Safe to proceed."
            )
        ]
        cursor.executemany("""
        INSERT INTO merchants (vpa, name, legal_name, category, risk_score, risk_level, status, reported_count, account_age, location, bank_name, ifsc, qr_code_url, fraud_reasons, ensemble_votes, safety_warning, recommendation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, seed_merchants)

    # Seed Initial Transactions if empty (matching UI screenshot)
    cursor.execute("SELECT COUNT(*) as count FROM transactions")
    if cursor.fetchone()["count"] == 0:
        seed_txns = [
            ("TXN10008", "rahulsharma@paytm", "Rahul Sharma", 50000, "MEDIUM", 58, "REVIEW", "23 May 2025, 10:45 AM", "Peer Transfer", json.dumps(["Higher than usual peer transfer amount", "Recipient registered in different state", "Manual review initiated by risk engine"]), json.dumps({"mlp": 55, "randomForest": 59, "xgboost": 61, "svm": 54, "logisticRegression": 56, "catBoostMeta": 58})),
            ("TXN10007", "amazon@apl", "Amazon India Marketplace", 2500, "LOW", 12, "APPROVED", "23 May 2025, 09:30 AM", "E-Commerce", json.dumps(["Verified merchant with trusted NPCI seal", "Consistent purchasing pattern", "Low financial liability score"]), json.dumps({"mlp": 14, "randomForest": 10, "xgboost": 11, "svm": 15, "logisticRegression": 12, "catBoostMeta": 12})),
            ("TXN10006", "unknown@upi", "Suspicious P2P Endpoint", 50000, "HIGH", 92, "BLOCKED", "22 May 2025, 11:15 PM", "High Risk Unknown VPA", json.dumps(["Unusual amount for this user", "New device detected", "Suspicious location", "High risk merchant"]), json.dumps({"mlp": 88, "randomForest": 94, "xgboost": 96, "svm": 90, "logisticRegression": 89, "catBoostMeta": 92})),
            ("TXN10005", "flipkart@apl", "Flipkart Internet Pvt Ltd", 50000, "MEDIUM", 52, "REVIEW", "22 May 2025, 07:22 PM", "Electronics Shopping", json.dumps(["Large lump-sum transaction", "Step-up OTP authentication pending verification", "Under routine velocity monitoring"]), json.dumps({"mlp": 48, "randomForest": 54, "xgboost": 53, "svm": 51, "logisticRegression": 50, "catBoostMeta": 52})),
            ("TXN10004", "zomato@upi", "Zomato Limited", 15000, "LOW", 18, "APPROVED", "22 May 2025, 01:10 PM", "Food & Dining", json.dumps(["Regular recurring transaction partner", "Standard device fingerprint", "Safe transaction velocity"]), json.dumps({"mlp": 20, "randomForest": 16, "xgboost": 17, "svm": 19, "logisticRegression": 18, "catBoostMeta": 18})),
            ("TXN10003", "swiggy@upi", "Bundl Technologies (Swiggy)", 800, "LOW", 8, "APPROVED", "21 May 2025, 08:45 PM", "Food Delivery", json.dumps(["Verified corporate merchant", "Typical spending threshold", "Zero prior disputes recorded"]), json.dumps({"mlp": 9, "randomForest": 7, "xgboost": 8, "svm": 10, "logisticRegression": 8, "catBoostMeta": 8})),
            ("TXN10002", "myshop@upi", "My Local Kirana Store", 3700, "LOW", 14, "APPROVED", "21 May 2025, 06:20 PM", "Groceries", json.dumps(["Frequent local merchant", "Within typical basket size", "Low risk score"]), json.dumps({"mlp": 16, "randomForest": 13, "xgboost": 13, "svm": 15, "logisticRegression": 14, "catBoostMeta": 14}))
        ]
        cursor.executemany("""
        INSERT INTO transactions (id, merchant, merchant_name, amount, risk, risk_score, status, date, category, reasons, ensemble_votes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, seed_txns)

    # Seed Initial Alerts
    cursor.execute("SELECT COUNT(*) as count FROM alerts")
    if cursor.fetchone()["count"] == 0:
        seed_alerts = [
            ("ALT-201", "HIGH_RISK", "High Risk Transaction", "Transaction of ₹50,000 to unknown@upi is blocked.", "22 May 2025, 11:15 PM", "BLOCKED", "TXN10006", 0),
            ("ALT-202", "MEDIUM_RISK", "Medium Risk Transaction", "Transaction of ₹50,000 to flipkart@apl is under review.", "22 May 2025, 07:22 PM", "REVIEW", "TXN10005", 0),
            ("ALT-203", "SECURITY", "New Device Login", "New login detected from Windows PC", "21 May 2025, 10:05 AM", "INFO", None, 1),
            ("ALT-204", "REVIEW", "Transaction Under Review", "Transaction of ₹50,000 is under review.", "20 May 2025, 09:10 PM", "REVIEW", "TXN10008", 1)
        ]
        cursor.executemany("""
        INSERT INTO alerts (id, type, title, description, date, status, txn_id, viewed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, seed_alerts)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_PATH)
