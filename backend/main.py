import os
import json
import sqlite3
from typing import Optional, List
from datetime import datetime
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .database import get_db, init_db
from .ml_engine import ensemble_engine

# Initialize database on startup
init_db()

app = FastAPI(
    title="UPI SHIELD - AI Fraud Detection Backend",
    description="FastAPI Backend with Stacking Ensemble ML Engine (IEEE 2025)",
    version="2.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class TransactionPredictRequest(BaseModel):
    amount: float
    recipient_vpa: str
    recipient_name: Optional[str] = "P2P Recipient"
    device: Optional[str] = "Current Device"
    location: Optional[str] = "Known City"
    hour_of_day: Optional[int] = None
    note: Optional[str] = ""
    user_total_txns: Optional[int] = 12

class CreateTransactionRequest(BaseModel):
    merchant: str
    merchant_name: Optional[str] = None
    amount: float
    device: Optional[str] = "Current Device (Windows PC)"
    location: Optional[str] = "Home City (Bengaluru)"
    note: Optional[str] = ""

class ScanMerchantRequest(BaseModel):
    qr_text: str

class UpdateStatusRequest(BaseModel):
    status: str

# Endpoints
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "UPI SHIELD ML Backend",
        "engine": "Stacking Ensemble (MLP + RF + XGBoost + SVM + LR -> CatBoost/GradientBoost)",
        "models_loaded": ensemble_engine.meta_model is not None,
        "database": "SQLite (Connected)",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/predict")
def predict_transaction(req: TransactionPredictRequest):
    data = req.model_dump()
    if data["hour_of_day"] is None:
        data["hour_of_day"] = datetime.now().hour

    prediction = ensemble_engine.predict_transaction(data)
    return prediction

@app.post("/api/scan-merchant")
def scan_merchant(req: ScanMerchantRequest):
    raw_text = req.qr_text.strip()
    vpa = raw_text

    # Parse UPI URI if present
    if "pa=" in raw_text:
        try:
            from urllib.parse import urlparse, parse_qs
            parsed = parse_qs(urlparse(raw_text).query)
            if "pa" in parsed:
                vpa = parsed["pa"][0]
        except Exception:
            pass

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM merchants WHERE LOWER(vpa) = LOWER(?)", (vpa,))
    row = cursor.fetchone()

    if row:
        merchant = dict(row)
        merchant["fraud_reasons"] = json.loads(merchant["fraud_reasons"])
        merchant["ensemble_votes"] = json.loads(merchant["ensemble_votes"])
        conn.close()
        return merchant

    # Run ML prediction on uncatalogued merchant
    conn.close()
    ml_res = ensemble_engine.predict_transaction({
        "amount": 2500,
        "recipient_vpa": vpa,
        "device": "Trusted Device",
        "location": "Scan Endpoint"
    })

    return {
        "vpa": vpa,
        "name": vpa.split("@")[0].capitalize(),
        "legal_name": "Unregistered Merchant Endpoint",
        "category": "Retail / Service",
        "risk_score": ml_res["risk_score"],
        "risk_level": ml_res["risk_level"],
        "status": f"{ml_res['risk_level']} RISK MERCHANT",
        "reported_count": 0,
        "account_age": "Unknown",
        "location": "QR Endpoint",
        "bank_name": "UPI Linked Node",
        "ifsc": "UPI0001",
        "qr_code_url": f"https://api.qrserver.com/v1/create-qr-code/?size=250x250&data={vpa}",
        "fraud_reasons": ml_res["reasons"],
        "ensemble_votes": ml_res["ensemble_votes"],
        "safety_warning": "Newly observed endpoint evaluated by Stacking Ensemble engine.",
        "recommendation": "Verify recipient credentials before entering PIN."
    }

@app.get("/api/transactions")
def get_transactions(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT * FROM transactions ORDER BY rowid DESC"
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        item = dict(r)
        item["reasons"] = json.loads(item["reasons"])
        item["ensemble_votes"] = json.loads(item["ensemble_votes"])
        
        # Apply filters in Python
        if status and status != "All":
            if item["status"] != status and item["risk"] != status:
                continue
        if search:
            s = search.lower()
            if not (s in item["id"].lower() or s in item["merchant"].lower() or (item["merchant_name"] and s in item["merchant_name"].lower())):
                continue

        results.append(item)

    return results

@app.post("/api/transactions")
def create_transaction(req: CreateTransactionRequest):
    # 1. Run real-time ML prediction
    ml_eval = ensemble_engine.predict_transaction({
        "amount": req.amount,
        "recipient_vpa": req.merchant,
        "device": req.device,
        "location": req.location,
        "note": req.note,
        "hour_of_day": datetime.now().hour
    })

    txn_id = f"TXN{datetime.now().strftime('%y%m%d%H%M%S')[-5:]}"
    now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")

    merchant_name = req.merchant_name or req.merchant.split("@")[0].capitalize()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO transactions (id, merchant, merchant_name, amount, risk, risk_score, status, date, category, reasons, ensemble_votes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        txn_id,
        req.merchant,
        merchant_name,
        req.amount,
        ml_eval["risk_level"],
        ml_eval["risk_score"],
        ml_eval["status"],
        now_str,
        "Direct Payment",
        json.dumps(ml_eval["reasons"]),
        json.dumps(ml_eval["ensemble_votes"])
    ))

    # Auto generate alert if High risk or Under Review
    if ml_eval["status"] in ["BLOCKED", "REVIEW"]:
        alert_id = f"ALT-{txn_id[-4:]}"
        alert_type = "HIGH_RISK" if ml_eval["status"] == "BLOCKED" else "MEDIUM_RISK"
        alert_title = "High Risk Transaction" if ml_eval["status"] == "BLOCKED" else "Medium Risk Transaction"
        action_word = "blocked" if ml_eval["status"] == "BLOCKED" else "under review"
        alert_desc = f"Transaction of ₹{req.amount:,.0f} to {req.merchant} is {action_word}."

        cursor.execute("""
        INSERT INTO alerts (id, type, title, description, date, status, txn_id, viewed)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        """, (alert_id, alert_type, alert_title, alert_desc, now_str, ml_eval["status"], txn_id))

    conn.commit()
    conn.close()

    return {
        "id": txn_id,
        "merchant": req.merchant,
        "merchant_name": merchant_name,
        "amount": req.amount,
        "risk": ml_eval["risk_level"],
        "risk_score": ml_eval["risk_score"],
        "status": ml_eval["status"],
        "date": now_str,
        "category": "Direct Payment",
        "reasons": ml_eval["reasons"],
        "ensemble_votes": ml_eval["ensemble_votes"]
    }

@app.patch("/api/transactions/{txn_id}/status")
def update_transaction_status(txn_id: str, req: UpdateStatusRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE transactions SET status = ? WHERE id = ?", (req.status, txn_id))
    conn.commit()
    conn.close()
    return {"id": txn_id, "status": req.status, "updated": True}

@app.get("/api/alerts")
def get_alerts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY rowid DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/alerts/{alert_id}/dismiss")
def dismiss_alert(alert_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM alerts WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    return {"id": alert_id, "dismissed": True}

@app.get("/api/analytics")
def get_analytics():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions")
    txns = cursor.fetchall()
    conn.close()

    total_count = len(txns)
    total_amount = sum(t["amount"] for t in txns)

    low_txns = [t for t in txns if t["risk"] == "LOW"]
    med_txns = [t for t in txns if t["risk"] == "MEDIUM"]
    high_txns = [t for t in txns if t["risk"] == "HIGH"]

    return {
        "total_transactions": total_count,
        "total_amount": total_amount,
        "low_count": len(low_txns),
        "med_count": len(med_txns),
        "high_count": len(high_txns),
        "low_amount": sum(t["amount"] for t in low_txns),
        "med_amount": sum(t["amount"] for t in med_txns),
        "high_amount": sum(t["amount"] for t in high_txns),
        "blocked_count": len([t for t in txns if t["status"] == "BLOCKED"]),
        "approved_count": len([t for t in txns if t["status"] == "APPROVED"]),
        "review_count": len([t for t in txns if t["status"] == "REVIEW"])
    }

@app.get("/api/benchmarks")
def get_benchmarks():
    return {
        "paper_title": "UPI Fraud Detection using Ensemble Learning",
        "conference": "IEEE IC-CGU 2025",
        "doi": "10.1109/IC-CGU67042.2025.11338035",
        "metrics": ensemble_engine.metrics
    }

@app.post("/api/retrain")
def retrain_model():
    """
    Triggers re-training of the Two-Level Stacking Ensemble model with SMOTE.
    """
    new_metrics = ensemble_engine.train(n_samples=2500)
    return {
        "status": "success",
        "message": "Stacking Ensemble retrained successfully with SMOTE & K-Fold OOF matrix",
        "metrics": new_metrics,
        "retrained_at": datetime.now().isoformat()
    }
