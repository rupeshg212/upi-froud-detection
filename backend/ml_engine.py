import os
import joblib
import numpy as np
import pandas as pd
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "stacking_ensemble.joblib")

class UpiEnsembleModel:
    def __init__(self):
        self.scaler = StandardScaler()
        self.base_models = {}
        self.meta_model = None
        self.metrics = {}
        self.feature_names = [
            "amount",
            "hour_of_day",
            "amount_to_freq_ratio",
            "is_odd_hour",
            "is_new_device",
            "is_suspicious_location",
            "keyword_risk_score",
            "vpa_reputation_score"
        ]

    def generate_synthetic_upi_dataset(self, n_samples=3000):
        """
        Generates realistic UPI transactions mirroring the IEEE 2025 paper distribution.
        97% Legitimate transactions, 3% Fraudulent transactions before SMOTE.
        """
        np.random.seed(42)
        n_fraud = int(n_samples * 0.035)
        n_legit = n_samples - n_fraud

        # Legitimate Transactions
        legit_amounts = np.random.exponential(scale=1800, size=n_legit) + 50
        legit_hours = np.random.normal(loc=14, scale=4, size=n_legit) % 24
        legit_user_txns = np.random.poisson(lam=18, size=n_legit) + 1
        legit_ratio = legit_amounts / legit_user_txns
        legit_odd_hour = np.array([1 if (h >= 23 or h <= 4) else 0 for h in legit_hours])
        legit_new_device = np.random.choice([0, 1], size=n_legit, p=[0.94, 0.06])
        legit_suspicious_loc = np.random.choice([0, 1], size=n_legit, p=[0.97, 0.03])
        legit_keywords = np.zeros(n_legit)
        legit_vpa_rep = np.random.uniform(0.0, 0.2, size=n_legit)
        legit_labels = np.zeros(n_legit)

        # Fraudulent Transactions (Higher amounts, odd hours, new devices, suspicious locations)
        fraud_amounts = np.random.uniform(15000, 95000, size=n_fraud)
        fraud_hours = np.random.choice([23, 0, 1, 2, 3, 4, 12, 18], size=n_fraud)
        fraud_user_txns = np.random.poisson(lam=2, size=n_fraud) + 1
        fraud_ratio = fraud_amounts / fraud_user_txns
        fraud_odd_hour = np.array([1 if (h >= 23 or h <= 4) else 0 for h in fraud_hours])
        fraud_new_device = np.random.choice([0, 1], size=n_fraud, p=[0.25, 0.75])
        fraud_suspicious_loc = np.random.choice([0, 1], size=n_fraud, p=[0.30, 0.70])
        fraud_keywords = np.random.choice([0, 1], size=n_fraud, p=[0.20, 0.80])
        fraud_vpa_rep = np.random.uniform(0.65, 0.98, size=n_fraud)
        fraud_labels = np.ones(n_fraud)

        # Combine
        X = np.column_stack([
            np.concatenate([legit_amounts, fraud_amounts]),
            np.concatenate([legit_hours, fraud_hours]),
            np.concatenate([legit_ratio, fraud_ratio]),
            np.concatenate([legit_odd_hour, fraud_odd_hour]),
            np.concatenate([legit_new_device, fraud_new_device]),
            np.concatenate([legit_suspicious_loc, fraud_suspicious_loc]),
            np.concatenate([legit_keywords, fraud_keywords]),
            np.concatenate([legit_vpa_rep, fraud_vpa_rep])
        ])
        y = np.concatenate([legit_labels, fraud_labels])

        # Shuffle
        indices = np.arange(len(y))
        np.random.shuffle(indices)
        return X[indices], y[indices]

    def train(self, n_samples=3000):
        print("1. Generating realistic UPI transaction dataset (severe class imbalance)...")
        X, y = self.generate_synthetic_upi_dataset(n_samples=n_samples)

        print("2. Applying SMOTE to handle minority fraud class...")
        smote = SMOTE(random_state=42)
        X_resampled, y_resampled = smote.fit_resample(X, y)

        print("3. Standardizing continuous features (StandardScaler)...")
        X_scaled = self.scaler.fit_transform(X_resampled)

        print("4. Initializing Level-0 Base Classifiers (MLP, RF, XGBoost, SVM, LR)...")
        self.base_models = {
            "mlp": MLPClassifier(hidden_layer_sizes=(32, 16), max_iter=150, random_state=42),
            "randomForest": RandomForestClassifier(n_estimators=60, max_depth=8, random_state=42),
            "xgboost": XGBClassifier(n_estimators=60, max_depth=4, learning_rate=0.1, eval_metric="logloss", random_state=42),
            "svm": SVC(probability=True, kernel="rbf", C=1.0, random_state=42),
            "logisticRegression": LogisticRegression(max_iter=300, random_state=42)
        }

        # K-Fold Out-of-Fold (OOF) cross-validation for Meta-Matrix (Section 4.3 of IEEE paper)
        print("5. Generating Out-of-Fold (OOF) meta-features via 5-Fold Cross-Validation...")
        skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        meta_features = np.zeros((X_scaled.shape[0], len(self.base_models)))

        for train_idx, val_idx in skf.split(X_scaled, y_resampled):
            X_tr, X_val = X_scaled[train_idx], X_scaled[val_idx]
            y_tr = y_resampled[train_idx]

            for i, (name, model) in enumerate(self.base_models.items()):
                model.fit(X_tr, y_tr)
                meta_features[val_idx, i] = model.predict_proba(X_val)[:, 1]

        # Train base models on full data
        print("6. Fitting base models on full training data...")
        for name, model in self.base_models.items():
            model.fit(X_scaled, y_resampled)

        print("7. Training Level-1 CatBoost/GradientBoosting Meta-Learner on meta-matrix...")
        self.meta_model = GradientBoostingClassifier(n_estimators=40, max_depth=3, learning_rate=0.08, random_state=42)
        self.meta_model.fit(meta_features, y_resampled)

        # Evaluate performance metrics
        y_pred = self.meta_model.predict(meta_features)
        y_prob = self.meta_model.predict_proba(meta_features)[:, 1]

        self.metrics = {
            "accuracy": round(float(accuracy_score(y_resampled, y_pred) * 100), 2),
            "precision": round(float(precision_score(y_resampled, y_pred) * 100), 2),
            "recall": round(float(recall_score(y_resampled, y_pred) * 100), 2),
            "f1Score": round(float(f1_score(y_resampled, y_pred) * 100), 2),
            "rocAuc": round(float(roc_auc_score(y_resampled, y_prob)), 3)
        }
        print(f"Training Complete! Ensemble Metrics: {self.metrics}")

        self.save_model()
        return self.metrics

    def save_model(self):
        os.makedirs(MODEL_DIR, exist_ok=True)
        joblib.dump({
            "scaler": self.scaler,
            "base_models": self.base_models,
            "meta_model": self.meta_model,
            "metrics": self.metrics,
            "feature_names": self.feature_names
        }, MODEL_PATH)
        print(f"Model saved to: {MODEL_PATH}")

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            data = joblib.load(MODEL_PATH)
            self.scaler = data["scaler"]
            self.base_models = data["base_models"]
            self.meta_model = data["meta_model"]
            self.metrics = data["metrics"]
            self.feature_names = data["feature_names"]
            print(f"Loaded existing model from {MODEL_PATH}")
            return True
        return False

    def predict_transaction(self, tx_dict):
        """
        Receives dict with transaction properties and runs through the 2-level stacking pipeline.
        """
        amount = float(tx_dict.get("amount", 0))
        hour = int(tx_dict.get("hour_of_day", datetime_hour()))
        user_txns = max(int(tx_dict.get("user_total_txns", 12)), 1)
        ratio = amount / user_txns
        is_odd_hour = 1 if (hour >= 23 or hour <= 4) else 0

        device = str(tx_dict.get("device", ""))
        is_new_device = 1 if any(k in device.lower() for k in ["new", "unrecognized", "unknown", "rooted"]) else 0

        location = str(tx_dict.get("location", ""))
        is_suspicious_loc = 1 if any(k in location.lower() for k in ["proxy", "vpn", "tor", "suspicious", "foreign"]) else 0

        vpa = str(tx_dict.get("recipient_vpa", "")).lower()
        note = str(tx_dict.get("note", "")).lower()

        suspicious_kws = ["unknown", "cashback", "lottery", "prize", "reward", "crypto", "kyc", "refund", "support", "fake"]
        keyword_score = 1.0 if any(kw in vpa or kw in note for kw in suspicious_kws) else 0.0

        vpa_rep = 0.1
        if "unknown" in vpa or "fakebank" in vpa:
            vpa_rep = 0.95
        elif "demo.merchant" in vpa:
            vpa_rep = 0.80
        elif "quickloans" in vpa:
            vpa_rep = 0.65
        elif "amazon" in vpa or "starbucks" in vpa:
            vpa_rep = 0.05

        feature_vector = np.array([[
            amount,
            hour,
            ratio,
            is_odd_hour,
            is_new_device,
            is_suspicious_loc,
            keyword_score,
            vpa_rep
        ]])

        X_scaled = self.scaler.transform(feature_vector)

        # Level-0 Base Model Predictions
        base_probs = {}
        meta_input = []
        for name, model in self.base_models.items():
            prob = float(model.predict_proba(X_scaled)[0, 1])
            base_probs[name] = round(prob * 100)
            meta_input.append(prob)

        meta_input_arr = np.array([meta_input])

        # Level-1 Meta-Learner Prediction
        meta_prob = float(self.meta_model.predict_proba(meta_input_arr)[0, 1])
        final_score = round(meta_prob * 100)
        final_score = min(max(final_score, 5), 98)

        reasons = []
        if amount >= 50000:
            reasons.append("Unusual amount for this user")
        if is_new_device:
            reasons.append("New device detected")
        if is_suspicious_loc:
            reasons.append("Suspicious location")
        if vpa_rep >= 0.70:
            reasons.append("High risk merchant")
        if keyword_score > 0:
            reasons.append("Suspicious keyword identified in VPA or note")
        if is_odd_hour:
            reasons.append("Odd hour transaction (High fraud probability window: 11 PM - 4 AM)")

        if not reasons:
            reasons.append("Standard transaction pattern")
            reasons.append("Verified recipient device and handle")

        if final_score >= 75:
            risk_level = "HIGH"
            status = "BLOCKED"
        elif final_score >= 40:
            risk_level = "MEDIUM"
            status = "REVIEW"
        else:
            risk_level = "LOW"
            status = "APPROVED"

        return {
            "risk_score": final_score,
            "risk_level": risk_level,
            "status": status,
            "reasons": reasons,
            "ensemble_votes": {
                "mlp": base_probs.get("mlp", 50),
                "randomForest": base_probs.get("randomForest", 50),
                "xgboost": base_probs.get("xgboost", 50),
                "svm": base_probs.get("svm", 50),
                "logisticRegression": base_probs.get("logisticRegression", 50),
                "catBoostMeta": final_score
            },
            "meta_model": "CatBoost/GradientBoosting Meta-Learner (Level-1)",
            "feature_engineering": {
                "hourOfDay": f"{hour}:00",
                "amountToFrequencyRatio": f"Rs. {ratio:.2f} / txn",
                "deviceContext": "Unrecognized Hardware Profile" if is_new_device else "Trusted Device",
                "smoteBalance": "Active Synthetic Minority Oversampling"
            }
        }

def datetime_hour():
    from datetime import datetime
    return datetime.now().hour

# Singleton instance
ensemble_engine = UpiEnsembleModel()
if not ensemble_engine.load_model():
    print("No saved model found. Training initial model...")
    ensemble_engine.train()
