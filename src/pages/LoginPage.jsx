import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });

  // Use the environment variable for the API base
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/applicant/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("api BASE:", API_BASE);

      if (response.ok) {
        // --- PRODUCTION AUTH LOGIC ---
        // 1. Save the token to localStorage so it can be used in Dashboard fetch headers
        // Based on your Django screenshot, the key is usually 'token'
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // 2. Save user details if provided (useful for displaying "Welcome, Name")
        if (data.user || data.username) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user || { username: data.username }),
          );
        }
        // 3. ROLE-BASED REDIRECTION
        // Check if the backend sent a role. Adjust 'data.role' to match your API key.
        if (
          data.role === "AGENT" ||
          (data.user && data.user.role === "AGENT")
        ) {
          window.location.href = "/agentdashboard";
        } else {
          window.location.href = "/clientdashboard";
        }
      } else {
        // Handle Django REST framework error messages (data.message or data.detail)
        setError(
          data.message || data.detail || "Invalid username or password.",
        );
      }
    } catch (err) {
      setError("Connection failed. Please check if the backend is running.");
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-0 md:p-6 font-sans relative overflow-hidden">
      {/* Background Blobs */}
      <div className="hidden lg:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#31694E]/10 rounded-full blur-[120px]" />
      <div className="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#BBC863]/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full lg:max-w-5xl bg-white lg:rounded-[2.5rem] shadow-2xl lg:shadow-[#31694E]/10 overflow-hidden flex flex-col lg:flex-row lg:min-h-[580px] lg:max-h-[650px]"
      >
        {/* --- LEFT SIDE: THE FORM --- */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-[#31694E] rounded-lg flex items-center justify-center text-[#F0E491] font-bold text-lg">
              K
            </div>
            <span className="text-xl font-black text-[#31694E] tracking-tight uppercase">
              Kacu
            </span>
          </div>

          <div className="w-full">
            <h1 className="text-3xl font-black text-[#31694E] mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[#658C58] text-sm font-medium mb-8">
              Premium funding for modern entrepreneurs.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-md font-bold animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#31694E]/40 ml-1">
                  Username
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#658C58]"
                  />
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Your username"
                    autoComplete="username"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none transition-all focus:bg-white focus:border-[#BBC863] text-[#31694E] text-sm font-medium"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#31694E]/40">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[10px] font-bold text-[#658C58] hover:text-[#31694E]"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#658C58]"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none transition-all focus:bg-white focus:border-[#BBC863] text-[#31694E] text-sm font-medium"
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#31694E]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-4 bg-[#31694E] text-[#F0E491] rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#31694E]/20 flex items-center justify-center gap-3 hover:bg-[#26533d] transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? "Verifying..." : "Login to Kacu"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-full border-t border-gray-100"></div>
                <span className="absolute px-4 bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Social Login
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors font-bold text-[#31694E] text-xs">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                    alt="G"
                  />{" "}
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors font-bold text-[#31694E] text-xs">
                  <img
                    src="https://www.svgrepo.com/show/442910/apple-logo.svg"
                    className="w-4 h-4"
                    alt="A"
                  />{" "}
                  Apple
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-xs font-bold text-gray-400">
              New here?{" "}
              <a href="#" className="text-[#31694E] hover:underline">
                Register Now
              </a>
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: VISUALS --- */}
        <div className="hidden lg:flex w-1/2 bg-[#31694E] relative items-center justify-center p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-[#31694E] via-[#31694E] to-[#26533d]" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[#F0E491] text-[10px] font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} /> AI-Powered Lending
            </div>

            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              The future of <br />
              <span className="text-[#F0E491]">Capital.</span>
            </h2>

            <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl text-left max-w-sm mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-[#F0E491] rounded-xl flex items-center justify-center text-[#31694E]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-black uppercase tracking-widest">
                    Enterprise Grade
                  </div>
                  <div className="text-white/40 text-[10px] font-medium">
                    SSL Encrypted 256-bit
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-[#F0E491]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white/40">Approval Probability</span>
                  <span className="text-[#F0E491]">98.2% High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
