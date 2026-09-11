import { useState } from "react";
import { LockKeyhole, Mail, Eye, EyeOff, Sparkles } from "lucide-react";

import grietLogo from "../assets/griet_logo.png";
import grietStatue from "../assets/statue.png";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gokaraju Rangaraju Statue Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${grietStatue})`,
        }}
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-950/65" />

      {/* Soft Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 text-center">

            {/* GRIET Logo */}
            <div className="mx-auto w-24 h-24 rounded-full bg-white p-2 shadow-lg flex items-center justify-center border border-slate-200">
              <img
                src={grietLogo}
                alt="GRIET Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <Sparkles className="text-cyan-600" size={22} />

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                GRIET Intelligent Campus
              </h1>
            </div>

            {/* Subtitle */}
            <p className="mt-2 text-sm font-semibold text-cyan-700">
              Intelligent Campus 2.0
            </p>

            <p className="mt-1 text-sm text-slate-500">
              AI Powered Digital Twin
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8">

            {/* Username / Email */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email / Username
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-600/20 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300"
            >
              Sign In
            </button>

            {/* College Name */}
            <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
              Gokaraju Rangaraju Institute of Engineering and Technology
            </p>
          </form>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-white/70 mt-4">
          GRIET Intelligent Campus 2.0
        </p>
      </div>
    </div>
  );
}