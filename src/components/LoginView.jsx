import React, { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginView({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState("rupesh@upi");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerName, setRegisterName] = useState("Rupesh G");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: isRegistering ? registerName : "Rupesh G",
      upiId: identifier.includes("@") ? identifier : `${identifier}@upi`
    });
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      name: "Rupesh G",
      upiId: "rupesh@upi"
    });
  };

  return (
    <div className="min-h-screen bg-[#070d1e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Login Card matching screenshot */}
      <div className="w-full max-w-md bg-[#0a122c]/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative z-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/30 mb-3 ring-4 ring-blue-500/20">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-white font-extrabold text-2xl tracking-wide">UPI SHIELD</h1>
          <p className="text-xs text-blue-400 font-medium tracking-tight mt-0.5">
            Secure Every Transaction
          </p>
        </div>

        {/* Welcome Back Heading matching screenshot */}
        <div className="w-full text-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isRegistering ? "Create your Account" : "Welcome Back!"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegistering
              ? "Setup smart real-time UPI fraud prevention"
              : "Sign in to your account"}
          </p>
        </div>

        {/* Form matching screenshot */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {isRegistering && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Rupesh G"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              UPI ID / Email / Mobile
            </label>
            <input
              type="text"
              placeholder="UPI ID / Email / Mobile"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-4 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password matching screenshot */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>

            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to registered email!"); }} className="text-blue-400 hover:text-blue-300 transition-colors">
              Forgot Password?
            </a>
          </div>

          {/* Login Button matching screenshot */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{isRegistering ? "Create Account" : "Login"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* 1-Click Instant Demo Login shortcut */}
        <div className="w-full mt-4 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={handleDemoLogin}
            className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>⚡ Instant Demo Access (Rupesh G)</span>
          </button>
        </div>

        {/* Toggle Register/Login matching screenshot */}
        <div className="mt-5 text-xs text-slate-400">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-blue-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-blue-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
