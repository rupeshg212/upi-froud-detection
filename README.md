# 🛡️ UPI SHIELD — Full-Stack Real-Time Smart UPI Fraud Detection System

A production-grade, full-stack AI/ML fraud detection and prevention platform for UPI payments, implementing a **Two-Level Stacking Ensemble Learning Framework** based on the **IEEE 2025 Conference Paper** (*"UPI Fraud Detection using Ensemble Learning"*, IC-CGU 2025).

![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI_Python_3.10-009688?style=for-the-badge&logo=fastapi)
![ML Models](https://img.shields.io/badge/ML-Scikit--Learn_%7C_XGBoost_%7C_SMOTE-FF6F00?style=for-the-badge&logo=scikitlearn)
![Frontend](https://img.shields.io/badge/Frontend-React_19_%7C_Vite_8_%7C_Tailwind_v4-61DAFB?style=for-the-badge&logo=react)
![Status](https://img.shields.io/badge/Status-Live_Connected-emerald?style=for-the-badge)

---

## 🏗️ System Architecture

```
                          ┌──────────────────────────────────────────────┐
                          │   Frontend: React 19 + Tailwind CSS (Vite)   │
                          │             http://localhost:5173/           │
                          └──────────────────────┬───────────────────────┘
                                                 │ REST API (JSON)
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │     Backend: Python FastAPI (Uvicorn)        │
                          │          http://127.0.0.1:8001/              │
                          └──────────────┬───────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
  ┌───────────────────────────────┐               ┌───────────────────────────────┐
  │   SQLite Database (Storage)   │               │    Two-Level Stacking ML      │
  │ • Transactions (Audit logs)   │               │ • Level-0: MLP, RF, XGB, SVM  │
  │ • Merchants (Registry & QR)   │               │ • Level-1: CatBoost Meta      │
  │ • Security Alerts             │               │ • SMOTE Oversampling          │
  └───────────────────────────────┘               └───────────────────────────────┘
```

---

## 🌟 Key Features

### 1. 🧠 Real Machine Learning Engine (`backend/ml_engine.py`)
* **Two-Level Stacking Architecture (IEEE 2025 Paper)**:
  * **Level-0 Base Classifiers**:
    * **MLP Classifier**: Multi-Layer Perceptron Neural Network (ReLU non-linear mapping).
    * **Random Forest**: 60-tree bagging ensemble for non-linear decision boundaries.
    * **XGBoost**: Extreme Gradient Boosted trees for tabular feature interactions.
    * **Support Vector Machine (SVM)**: RBF kernel hyper-plane separation.
    * **Logistic Regression**: Calibrated linear log-odds baseline.
  * **Level-1 Meta-Learner (CatBoost / GradientBoosting)**:
    * Trained on 5-Fold Stratified Out-of-Fold (OOF) cross-validation meta-features minimizing logistic loss.
* **Class Imbalance & Preprocessing**:
  * **SMOTE (Synthetic Minority Oversampling Technique)**: Balances real-world UPI dataset (97% legit / 3% fraud).
  * **StandardScaler**: Centers continuous variables to zero mean and unit variance.
* **Feature Engineering Pipeline**:
  * `Amount-to-Frequency Ratio`: $\text{ratio} = \frac{\text{amount}}{\text{user\_txns}}$
  * `Odd-Hour Telemetry`: Identifies high-risk fraud window (11:00 PM – 4:00 AM).
  * `Device Fingerprinting`: Flags unverified hardware signatures.
  * `VPA Handle & Domain Heuristic`: Analyzes blacklist domains and synthetic VPAs (`@fakebank`, `@scam`).

---

### 2. ⚡ FastAPI REST API Endpoints (`http://127.0.0.1:8001/docs`)
* `GET /api/health` — Live server heartbeat and ML model loaded verification.
* `POST /api/predict` — Real-time inference through the 5-classifier Stacking Ensemble.
* `POST /api/scan-merchant` — Decodes UPI QR payloads, queries merchant registry, and returns fraud analysis.
* `GET /api/transactions` — Queries SQLite database with search and status filters.
* `POST /api/transactions` — Creates and logs a new transaction with ML prediction and auto-alerts.
* `PATCH /api/transactions/{id}/status` — Updates transaction status (`APPROVED`, `REVIEW`, `BLOCKED`).
* `GET /api/alerts` — Real-time security incident logs.
* `GET /api/analytics` — Dynamic risk distribution and amount summaries.
* `POST /api/retrain` — Triggers real re-training of the ML models on demand!

---

### 3. 📷 Merchant QR Scanner & Fraud Forensic Engine
* **Real-time Camera Viewfinder**: Integrated webcam scanner with green HUD brackets and animated scanning laser.
* **Image Upload**: Upload QR code images for instant decoding.
* **Instant Demo QR Presets**:
  * `demo.merchant@upi` → **Risk Score: 78 / 100 (HIGH RISK MERCHANT)**
  * `phishing.cashback@fakebank` → **Risk Score: 96 / 100 (CONFIRMED FRAUD MERCHANT)**
  * `starbucks.pay@hdfcbank` → **Risk Score: 8 / 100 (VERIFIED SAFE MERCHANT)**
  * `quickloans.instant@ybl` → **Risk Score: 65 / 100 (SUSPICIOUS LENDER)**
  * `myshop@upi` → **Risk Score: 14 / 100 (APPROVED LOCAL MERCHANT)**
* **In-depth Fraud Breakdown Modal**:
  * NPCI Verification & legal bank entity checks
  * VPA account creation age (`< 72 hours old`)
  * Complaint volume tracking (`14 open user fraud disputes`)
  * Display name vs. legal beneficiary mismatch alerts
  * Velocity spike indicators (`340 micro-transactions in 1 hr`)
  * Individual votes from MLP, RF, XGBoost, SVM, and CatBoost meta-learner.

---

### 4. 🔬 Interactive Ensemble AI Model Lab
* **Architecture Flowchart (Figure 1)**: Interactive pipeline visualizer.
* **Classifier Performance Benchmark (Table I)**:
  * Decision Tree: `87.82%` Acc | `88.78%` Recall
  * K-Nearest Neighbours: `91.37%` Acc | `92.86%` Recall
  * MLP Neural Network: `92.38%` Acc | `94.89%` Recall
  * Gradient Boosting: `93.40%` Acc | `91.83%` Recall
  * Random Forest: `95.43%` Acc | `94.89%` Recall
  * Support Vector Classifier: `95.43%` Acc | `93.87%` Recall
  * Logistic Regression: `95.94%` Acc | `93.87%` Recall
  * XGBoost: `95.94%` Acc | `96.93%` Recall
  * **Proposed Stacking Ensemble Model: `96.95%` Acc | `97.95%` Recall | `0.99` ROC-AUC**
* **Interactive ROC-AUC Curve (Figure 3)**: Near-zero false positive rate curve (AUC = 0.99).
* **Live Retrain Button**: Click "⚡ Retrain Live Python ML Engine" to trigger actual backend re-training with real-time terminal logs!

---

## 🚀 How to Run in Terminal

### Terminal 1: Start Python FastAPI ML Backend
```powershell
cd "c:\Users\Rupesh g\OneDrive\Documents\upi-final-pro"
npm run server
# or directly:
python -m uvicorn backend.main:app --port 8001 --host 127.0.0.1
```
* Backend will be active on: **`http://127.0.0.1:8001`**
* Interactive Swagger API Docs: **`http://127.0.0.1:8001/docs`**

---

### Terminal 2: Start React Frontend (Vite)
```powershell
cd "c:\Users\Rupesh g\OneDrive\Documents\upi-final-pro"
npm run dev
```
* Frontend will be active on: **`http://localhost:5173`**

---

### Terminal 3 (Optional): Train / Re-train ML Models Standalone
```powershell
npm run train
# or directly:
python backend/ml_engine.py
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Machine Learning** | Scikit-Learn 1.7, XGBoost 3.2, Imbalanced-Learn (SMOTE), Joblib, NumPy, Pandas |
| **Backend API** | Python 3.10, FastAPI, Uvicorn (ASGI), Pydantic |
| **Database** | SQLite 3 (`backend/upi_shield.db`) |
| **Frontend UI** | React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **QR Scanner** | Html5-Qrcode (Webcam + File Upload + Payload Parsing) |
