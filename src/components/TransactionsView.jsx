import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, Download, AlertCircle, CheckCircle, ShieldX } from "lucide-react";

export default function TransactionsView({ transactions, onSelectTransaction }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.merchantName && txn.merchantName.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === "All") return true;
      if (statusFilter === "APPROVED") return txn.status === "APPROVED";
      if (statusFilter === "REVIEW") return txn.status === "REVIEW";
      if (statusFilter === "BLOCKED") return txn.status === "BLOCKED";
      if (statusFilter === "HIGH") return txn.risk === "HIGH";
      if (statusFilter === "MEDIUM") return txn.risk === "MEDIUM";
      if (statusFilter === "LOW") return txn.risk === "LOW";

      return true;
    });
  }, [transactions, searchQuery, statusFilter]);

  const exportCSV = () => {
    const headers = "ID,Merchant / UPI ID,Amount,Risk,Status,Date & Time\n";
    const rows = filteredTransactions
      .map((t) => `${t.id},${t.merchant},${t.amount},${t.risk},${t.status},"${t.date}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "upi_shield_transactions.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-slate-500 text-sm mt-0.5">Comprehensive audit trail of all evaluated UPI activities</p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Main Table Card matching screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Filter by:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="APPROVED">Approved</option>
              <option value="REVIEW">Under Review</option>
              <option value="BLOCKED">Blocked</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Merchant / UPI ID</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Risk</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No transactions match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    onClick={() => onSelectTransaction(txn)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900">
                      {txn.id}
                    </td>

                    {/* Merchant / UPI ID */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {txn.merchant}
                      </div>
                      {txn.merchantName && (
                        <div className="text-xs text-slate-400 font-normal truncate max-w-xs">
                          {txn.merchantName}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ₹{txn.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Risk Badge matching screenshot */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          txn.risk === "LOW"
                            ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200/50"
                            : txn.risk === "MEDIUM"
                            ? "bg-amber-100/80 text-amber-700 border border-amber-200/50"
                            : "bg-rose-100/80 text-rose-700 border border-rose-200/50"
                        }`}
                      >
                        {txn.risk}
                      </span>
                    </td>

                    {/* Status Badge matching screenshot */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          txn.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : txn.status === "REVIEW"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                      {txn.date}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(txn);
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline px-2.5 py-1 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
