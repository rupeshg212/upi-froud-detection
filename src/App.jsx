import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardView from "./components/DashboardView";
import TransactionsView from "./components/TransactionsView";
import TransactionModal from "./components/TransactionModal";
import ScanMerchantView from "./components/ScanMerchantView";
import SendMoneyView from "./components/SendMoneyView";
import AlertsView from "./components/AlertsView";
import AnalyticsView from "./components/AnalyticsView";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import LoginView from "./components/LoginView";
import { initialTransactions, initialAlerts, userProfile } from "./data/mockData";

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem("upi_auth");
    return savedAuth !== null ? JSON.parse(savedAuth) : true;
  });

  // Current User
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("upi_user");
    return savedUser ? JSON.parse(savedUser) : userProfile;
  });

  // Active View Tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("upi_transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Alerts State
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem("upi_alerts");
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  // Selected Transaction for Detail Modal
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Prefilled Merchant for Send Money
  const [prefilledMerchant, setPrefilledMerchant] = useState(null);

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem("upi_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("upi_alerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem("upi_auth", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("upi_user", JSON.stringify(currentUser));
  }, [currentUser]);

  // Unread Alerts Count
  const unreadAlertsCount = alerts.filter((a) => !a.viewed).length;

  // Transaction Status Updater (from Modal)
  const handleUpdateTxnStatus = (txnId, newStatus) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: newStatus } : t))
    );
  };

  // Add New Transaction (from Send Money)
  const handleAddNewTransaction = (newTxn) => {
    setTransactions((prev) => [newTxn, ...prev]);

    // If High risk or Review, generate alert
    if (newTxn.status === "BLOCKED" || newTxn.status === "REVIEW") {
      const newAlert = {
        id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
        type: newTxn.status === "BLOCKED" ? "HIGH_RISK" : "MEDIUM_RISK",
        title:
          newTxn.status === "BLOCKED"
            ? "High Risk Transaction"
            : "Medium Risk Transaction",
        description: `Transaction of ₹${newTxn.amount.toLocaleString(
          "en-IN"
        )} to ${newTxn.merchant} is ${
          newTxn.status === "BLOCKED" ? "blocked" : "under review"
        }.`,
        date: newTxn.date,
        status: newTxn.status,
        txnId: newTxn.id,
        viewed: false
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    setTransactions(initialTransactions);
    setAlerts(initialAlerts);
    localStorage.removeItem("upi_transactions");
    localStorage.removeItem("upi_alerts");
  };

  // Login handler
  const handleLogin = (userCreds) => {
    setCurrentUser((prev) => ({
      ...prev,
      name: userCreds.name || prev.name,
      upiId: userCreds.upiId || prev.upiId
    }));
    setIsAuthenticated(true);
    setActiveTab("dashboard");
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Open Alert Transaction
  const handleViewAlertTxn = (alert) => {
    if (alert.txnId) {
      const match = transactions.find((t) => t.id === alert.txnId);
      if (match) {
        setSelectedTxn(match);
        return;
      }
    }
    // If no direct transaction link, navigate to transactions tab
    setActiveTab("transactions");
  };

  const handleDismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // If not logged in, show Login Screen (Panel 1 in user's image)
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertCount={unreadAlertsCount}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <Topbar
          user={currentUser}
          unreadAlertCount={unreadAlertsCount}
          alerts={alerts}
          onOpenAlerts={() => setActiveTab("alerts")}
          onOpenProfile={() => setActiveTab("profile")}
          setMobileOpen={setMobileOpen}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              transactions={transactions}
              alerts={alerts}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectTransaction={(txn) => setSelectedTxn(txn)}
            />
          )}

          {activeTab === "transactions" && (
            <TransactionsView
              transactions={transactions}
              onSelectTransaction={(txn) => setSelectedTxn(txn)}
            />
          )}

          {activeTab === "scan-merchant" && (
            <ScanMerchantView
              onBack={() => setActiveTab("dashboard")}
              onPayMerchant={(merchant) => {
                setPrefilledMerchant(merchant);
                setActiveTab("send-money");
              }}
            />
          )}

          {activeTab === "send-money" && (
            <SendMoneyView
              prefilledMerchant={prefilledMerchant}
              onNewTransaction={(newTxn) => {
                handleAddNewTransaction(newTxn);
              }}
            />
          )}

          {activeTab === "alerts" && (
            <AlertsView
              alerts={alerts}
              onViewAlertTxn={handleViewAlertTxn}
              onDismissAlert={handleDismissAlert}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsView transactions={transactions} />
          )}

          {activeTab === "profile" && <ProfileView user={currentUser} />}

          {activeTab === "settings" && (
            <SettingsView onResetDemoData={handleResetDemoData} />
          )}
        </main>
      </div>

      {/* Transaction Details Modal matching screenshot */}
      {selectedTxn && (
        <TransactionModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
          onUpdateStatus={handleUpdateTxnStatus}
        />
      )}
    </div>
  );
}
