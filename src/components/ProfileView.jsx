import React from "react";
import { User, Shield, Smartphone, Landmark, CheckCircle, CreditCard, KeyRound } from "lucide-react";

export default function ProfileView({ user }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">User Profile</h1>
        <p className="text-slate-500 text-sm mt-0.5">Account identity, linked payment handles & device security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Card */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-50">
            RG
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-4">{user.name}</h2>
          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200/50 mt-1 font-semibold">
            {user.upiId}
          </span>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Registered Phone</span>
              <span className="font-semibold text-slate-800">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Email Address</span>
              <span className="font-semibold text-slate-800">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Device Fingerprint</span>
              <span className="font-semibold text-slate-800">{user.deviceFingerprint}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Protection Level</span>
              <span className="font-bold text-emerald-600">{user.protectionLevel}</span>
            </div>
          </div>
        </div>

        {/* Linked Accounts & Security Status */}
        <div className="md:col-span-7 space-y-6">
          {/* Linked Bank Accounts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-600" />
              <span>Linked Bank Accounts</span>
            </h3>

            <div className="space-y-3">
              {user.linkedAccounts.map((acc, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs font-bold text-xs">
                      {acc.bank.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{acc.bank}</span>
                        {acc.primary && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">A/C: {acc.accNumber}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Available Balance</span>
                    <span className="font-extrabold text-sm text-slate-900">
                      ₹{acc.balance.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Health Score */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>UPI Shield Security Health</span>
            </h3>

            <div className="flex items-center justify-between mb-2 text-sm font-semibold">
              <span className="text-slate-600">Account Hardening Level</span>
              <span className="text-emerald-600 font-bold">98% Protected</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
              <div className="bg-emerald-500 h-full w-[98%] rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Device Fingerprint Verified</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Sim Binding Active</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Phishing Protection On</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>NPCI Safe Route Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
