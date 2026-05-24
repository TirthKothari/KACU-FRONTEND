// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Eye,
//   EyeOff,
//   Lock,
//   User,
//   ArrowRight,
//   ShieldCheck,
//   Sparkles,
// } from "lucide-react";

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({ username: "", password: "" });

//   // Use the environment variable for the API base
//   const API_BASE = import.meta.env.VITE_API_BASE_URL;

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE}/applicant/login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       console.log("api BASE:", API_BASE);

//       if (response.ok) {
//         // --- PRODUCTION AUTH LOGIC ---
//         // 1. Save the token to localStorage so it can be used in Dashboard fetch headers
//         // Based on your Django screenshot, the key is usually 'token'
//         if (data.token) {
//           localStorage.setItem("token", data.token);
//         }

//         // 2. Save user details if provided (useful for displaying "Welcome, Name")
//         if (data.user || data.username) {
//           localStorage.setItem(
//             "user",
//             JSON.stringify(data.user || { username: data.username }),
//           );
//         }
//         // 3. ROLE-BASED REDIRECTION
//         // Check if the backend sent a role. Adjust 'data.role' to match your API key.
//         if (
//           data.role === "AGENT" ||
//           (data.user && data.user.role === "AGENT")
//         ) {
//           window.location.href = "/agentdashboard";
//         } else if (
//           data.role === "ADMIN" ||
//           (data.user && data.user.role === "ADMIN")
//         ) {
//           window.location.href = "/admindashboard";
//         } else {
//           window.location.href = "/clientdashboard";
//         }
//       } else {
//         // Handle Django REST framework error messages (data.message or data.detail)
//         setError(
//           data.message || data.detail || "Invalid username or password.",
//         );
//       }
//     } catch (err) {
//       setError("Connection failed. Please check if the backend is running.");
//       console.error("Login Error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-0 md:p-6 font-sans relative overflow-hidden">
//       {/* Background Blobs */}
//       <div className="hidden lg:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#31694E]/10 rounded-full blur-[120px]" />
//       <div className="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#BBC863]/10 rounded-full blur-[120px]" />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full lg:max-w-5xl bg-white lg:rounded-[2.5rem] shadow-2xl lg:shadow-[#31694E]/10 overflow-hidden flex flex-col lg:flex-row lg:min-h-[580px] lg:max-h-[650px]"
//       >
//         {/* --- LEFT SIDE: THE FORM --- */}
//         <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
//           {/* Logo */}
//           <div className="mb-8 flex items-center gap-2 group cursor-pointer">
//             <div className="w-8 h-8 bg-[#31694E] rounded-lg flex items-center justify-center text-[#F0E491] font-bold text-lg">
//               K
//             </div>
//             <span className="text-xl font-black text-[#31694E] tracking-tight uppercase">
//               Kacu
//             </span>
//           </div>

//           <div className="w-full">
//             <h1 className="text-3xl font-black text-[#31694E] mb-2 tracking-tight">
//               Welcome Back
//             </h1>
//             <p className="text-[#658C58] text-sm font-medium mb-8">
//               Premium funding for modern entrepreneurs.
//             </p>

//             {error && (
//               <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-md font-bold animate-pulse">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleLogin} className="space-y-5">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-[#31694E]/40 ml-1">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <User
//                     size={18}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-[#658C58]"
//                   />
//                   <input
//                     type="text"
//                     name="username"
//                     required
//                     placeholder="Your username"
//                     autoComplete="username"
//                     className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none transition-all focus:bg-white focus:border-[#BBC863] text-[#31694E] text-sm font-medium"
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <div className="flex justify-between items-center ml-1">
//                   <label className="text-[10px] font-black uppercase tracking-widest text-[#31694E]/40">
//                     Password
//                   </label>
//                   <a
//                     href="#"
//                     className="text-[10px] font-bold text-[#658C58] hover:text-[#31694E]"
//                   >
//                     Forgot?
//                   </a>
//                 </div>
//                 <div className="relative">
//                   <Lock
//                     size={18}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-[#658C58]"
//                   />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     required
//                     autoComplete="current-password"
//                     placeholder="••••••••"
//                     className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none transition-all focus:bg-white focus:border-[#BBC863] text-[#31694E] text-sm font-medium"
//                     onChange={handleInputChange}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#31694E]"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 disabled={isLoading}
//                 type="submit"
//                 className="w-full py-4 bg-[#31694E] text-[#F0E491] rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#31694E]/20 flex items-center justify-center gap-3 hover:bg-[#26533d] transition-all active:scale-[0.98] disabled:opacity-70"
//               >
//                 {isLoading ? "Verifying..." : "Login to Kacu"}
//                 {!isLoading && <ArrowRight size={18} />}
//               </button>
//             </form>

//             <div className="mt-8">
//               <div className="relative flex items-center justify-center mb-6">
//                 <div className="w-full border-t border-gray-100"></div>
//                 <span className="absolute px-4 bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest">
//                   Social Login
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors font-bold text-[#31694E] text-xs">
//                   <img
//                     src="https://www.svgrepo.com/show/475656/google-color.svg"
//                     className="w-4 h-4"
//                     alt="G"
//                   />{" "}
//                   Google
//                 </button>
//                 <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors font-bold text-[#31694E] text-xs">
//                   <img
//                     src="https://www.svgrepo.com/show/442910/apple-logo.svg"
//                     className="w-4 h-4"
//                     alt="A"
//                   />{" "}
//                   Apple
//                 </button>
//               </div>
//             </div>

//             <p className="mt-8 text-center text-xs font-bold text-gray-400">
//               New here?{" "}
//               <a href="#" className="text-[#31694E] hover:underline">
//                 Register Now
//               </a>
//             </p>
//           </div>
//         </div>

//         {/* --- RIGHT SIDE: VISUALS --- */}
//         <div className="hidden lg:flex w-1/2 bg-[#31694E] relative items-center justify-center p-12">
//           <div className="absolute inset-0 bg-gradient-to-br from-[#31694E] via-[#31694E] to-[#26533d]" />

//           <div className="relative z-10 text-center">
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[#F0E491] text-[10px] font-black uppercase tracking-widest mb-6">
//               <Sparkles size={14} /> AI-Powered Lending
//             </div>

//             <h2 className="text-4xl font-black text-white leading-tight mb-4">
//               The future of <br />
//               <span className="text-[#F0E491]">Capital.</span>
//             </h2>

//             <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl text-left max-w-sm mx-auto">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-10 h-10 bg-[#F0E491] rounded-xl flex items-center justify-center text-[#31694E]">
//                   <ShieldCheck size={20} />
//                 </div>
//                 <div>
//                   <div className="text-white text-xs font-black uppercase tracking-widest">
//                     Enterprise Grade
//                   </div>
//                   <div className="text-white/40 text-[10px] font-medium">
//                     SSL Encrypted 256-bit
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
//                   <div className="h-full w-[70%] bg-[#F0E491]" />
//                 </div>
//                 <div className="flex justify-between text-[10px] font-bold">
//                   <span className="text-white/40">Approval Probability</span>
//                   <span className="text-[#F0E491]">98.2% High</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Star,
  CheckCircle2,
  Zap,
} from "lucide-react";

// --- DATA ---
const stats = [
  { value: "$500M+", label: "Funding Provided" },
  { value: "10k+", label: "Businesses Supported" },
  { value: "4 hrs", label: "Avg. Approval Time" },
  { value: "4.9/5", label: "Customer Rating" },
];

const testimonials = [
  {
    quote:
      "Kacu funded us in under 6 hours. No paperwork nightmares, no credit-score lectures. Just capital.",
    name: "Marcus T.",
    role: "Restaurant Owner, Chicago",
    avatar: "MT",
    color: "#BBC863",
  },
  {
    quote:
      "We went from application to funded in one afternoon. Kacu changed how I think about business finance.",
    name: "Priya S.",
    role: "E-commerce Founder, Austin",
    avatar: "PS",
    color: "#F0E491",
  },
  {
    quote:
      "The team actually picked up the phone. In the fintech world, that alone is worth everything.",
    name: "Derek W.",
    role: "Logistics Company, Toronto",
    avatar: "DW",
    color: "#88B49F",
  },
];

const features = [
  { icon: Zap, text: "Pre-qualify in minutes — no hard credit pull" },
  { icon: Clock, text: "Funds available in as little as 4 hours" },
  { icon: TrendingUp, text: "Rates starting as low as 6.99%" },
];

// --- ANIMATED COUNTER ---
const Counter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const numeric = parseInt(target.replace(/[^0-9]/g, ""), 10);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(numeric / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) {
        setCount(numeric);
        clearInterval(timer);
      } else setCount(start);
    }, 35);
    return () => clearInterval(timer);
  }, [numeric]);
  return (
    <>
      {target.replace(/[0-9]+/, count)}
      {suffix}
    </>
  );
};

// --- TESTIMONIAL CAROUSEL ---
const TestimonialCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);
  const t = testimonials[idx];
  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45 }}
          className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-5"
        >
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className="fill-[#BBC863] text-[#BBC863]"
              />
            ))}
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-4 font-medium italic">
            "{t.quote}"
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#31694E] text-xs font-black flex-shrink-0"
              style={{ backgroundColor: t.color }}
            >
              {t.avatar}
            </div>
            <div>
              <div className="text-white text-xs font-black">{t.name}</div>
              <div className="text-white/40 text-[10px] font-medium">
                {t.role}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${
              i === idx ? "w-5 h-1.5 bg-[#BBC863]" : "w-1.5 h-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// --- MAIN LOGIN PAGE ---
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });

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
      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user || data.username)
          localStorage.setItem(
            "user",
            JSON.stringify(data.user || { username: data.username }),
          );
        if (data.role === "AGENT" || data.user?.role === "AGENT")
          window.location.href = "/agentdashboard";
        else if (data.role === "ADMIN" || data.user?.role === "ADMIN")
          window.location.href = "/admindashboard";
        else window.location.href = "/clientdashboard";
      } else {
        setError(
          data.message || data.detail || "Invalid username or password.",
        );
      }
    } catch (err) {
      setError("Connection failed. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#F6F7F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "0",
      }}
    >
      {/* Google font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&family=Playfair+Display:wght@700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .kacu-input {
          width: 100%;
          padding: 14px 14px 14px 48px;
          background: #F0F2EC;
          border: 1.5px solid transparent;
          border-radius: 14px;
          outline: none;
          transition: all 0.2s;
          color: #1C3D2B;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
        }
        .kacu-input:focus {
          background: #fff;
          border-color: #BBC863;
          box-shadow: 0 0 0 3px rgba(187,200,99,0.15);
        }
        .kacu-input::placeholder { color: #9CAE9A; }

        .login-btn {
          width: 100%;
          padding: 15px;
          background: #31694E;
          color: #F0E491;
          border: none;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(49,105,78,0.25);
        }
        .login-btn:hover:not(:disabled) { background: #265540; transform: translateY(-1px); box-shadow: 0 12px 28px rgba(49,105,78,0.3); }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .social-btn {
          flex: 1;
          padding: 12px;
          background: #fff;
          border: 1.5px solid #E8EBE3;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #31694E;
          transition: all 0.2s;
        }
        .social-btn:hover { background: #F6F7F2; border-color: #C8D4BF; }

        /* Responsive layout */
        .login-wrapper {
          width: 100%;
          max-width: 1100px;
          background: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 100vh;
        }

        @media (min-width: 1024px) {
          .login-wrapper {
            flex-direction: row;
            min-height: auto;
            max-height: 700px;
            border-radius: 32px;
            box-shadow: 0 40px 80px rgba(49,105,78,0.12), 0 4px 16px rgba(0,0,0,0.06);
            margin: 24px;
          }
        }

        .form-panel {
          width: 100%;
          padding: 40px 28px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #fff;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 480px) {
          .form-panel { padding: 48px 40px; }
        }

        @media (min-width: 1024px) {
          .form-panel {
            width: 45%;
            padding: 56px 52px;
          }
        }

        .right-panel {
          display: none;
        }

        @media (min-width: 1024px) {
          .right-panel {
            display: flex;
            width: 55%;
            background: #31694E;
            flex-direction: column;
            justify-content: center;
            padding: 52px 48px;
            position: relative;
            overflow: hidden;
          }
        }

        /* Mobile trust bar — shown only on mobile below the form */
        .mobile-trust {
          display: flex;
          background: #31694E;
          padding: 28px;
          gap: 0;
          flex-wrap: wrap;
        }
        @media (min-width: 1024px) {
          .mobile-trust { display: none; }
        }

        .stat-item {
          width: 50%;
          padding: 16px 12px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .stat-item:nth-child(2n) { border-right: none; }
        .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom: none; }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 900;
          color: #BBC863;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          margin-bottom: 8px;
        }
        .feature-icon {
          width: 32px;
          height: 32px;
          background: rgba(187,200,99,0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feature-text {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          line-height: 1.4;
        }

        /* Decorative blobs */
        .blob1 {
          position: absolute;
          top: -80px;
          right: -80px;
          width: 300px;
          height: 300px;
          background: rgba(187,200,99,0.12);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }
        .blob2 {
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 250px;
          height: 250px;
          background: rgba(240,228,145,0.08);
          border-radius: 50%;
          filter: blur(50px);
          pointer-events: none;
        }

        /* Subtle dot pattern on right panel */
        .dot-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .divider-line {
          width: 100%;
          height: 1px;
          background: #E8EBE3;
          position: relative;
        }
        .divider-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          padding: 0 14px;
          font-size: 10px;
          font-weight: 900;
          color: #C0C8B8;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          white-space: nowrap;
        }

        .error-box {
          padding: 12px 14px;
          background: #FEF2F2;
          border-left: 3px solid #EF4444;
          border-radius: 0 10px 10px 0;
          color: #B91C1C;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
        }
      `}</style>

      {/* Outer bg blobs */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "-10%",
          width: "40%",
          height: "40%",
          background: "rgba(49,105,78,0.07)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "-10%",
          width: "40%",
          height: "40%",
          background: "rgba(187,200,99,0.07)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="login-wrapper"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ===== LEFT: FORM ===== */}
        <div className="form-panel">
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "36px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#31694E",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F0E491",
                fontFamily: "'Playfair Display',serif",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              K
            </div>
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 900,
                fontSize: 20,
                color: "#31694E",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Kacu
            </span>
          </div>

          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 900,
                color: "#BBC863",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Welcome Back
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(26px, 4vw, 34px)",
                fontWeight: 900,
                color: "#1C3D2B",
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              Your Capital.
              <br />
              On Your Terms.
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#658C58",
                fontWeight: 500,
                marginBottom: 28,
                lineHeight: 1.5,
              }}
            >
              Eco-friendly funding solutions for modern entrepreneurs.
            </p>

            {error && <div className="error-box">{error}</div>}

            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Username */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 900,
                    color: "rgba(49,105,78,0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 6,
                  }}
                >
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#658C58",
                    }}
                  />
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Your username"
                    autoComplete="username"
                    className="kacu-input"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: "rgba(49,105,78,0.45)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#658C58",
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#658C58",
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="kacu-input"
                    style={{ paddingRight: 48 }}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9CAE9A",
                      display: "flex",
                      padding: 4,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="login-btn">
                {isLoading ? "Verifying..." : "Login to Kacu"}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Social login */}
            <div style={{ marginTop: 24 }}>
              <div className="divider-line" style={{ marginBottom: 20 }}>
                <span className="divider-label">Or continue with</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="social-btn">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    style={{ width: 16, height: 16 }}
                    alt="G"
                  />
                  Google
                </button>
                <button className="social-btn">
                  <img
                    src="https://www.svgrepo.com/show/442910/apple-logo.svg"
                    style={{ width: 16, height: 16 }}
                    alt="A"
                  />
                  Apple
                </button>
              </div>
            </div>

            <p
              style={{
                marginTop: 24,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
                color: "#9CAE9A",
              }}
            >
              New here?{" "}
              <a
                href="#"
                style={{
                  color: "#31694E",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                Apply for funding →
              </a>
            </p>
          </div>
        </div>

        {/* ===== MOBILE: TRUST STATS ===== */}
        <div className="mobile-trust">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ===== RIGHT: DESKTOP PANEL ===== */}
        <div className="right-panel">
          <div className="dot-pattern" />
          <div className="blob1" />
          <div className="blob2" />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "rgba(187,200,99,0.15)",
                border: "1px solid rgba(187,200,99,0.25)",
                borderRadius: 999,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#BBC863",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Kacu Financial • Est. 2025
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: 28 }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(28px, 2.8vw, 40px)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.15,
                  marginBottom: 10,
                }}
              >
                The First Step
                <br />
                Toward <span style={{ color: "#BBC863" }}>Natural Growth.</span>
              </h2>
              {/* <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 380,
                }}
              >
                Kacu provides eco-friendly, AI-powered funding — so you can
                focus on building what matters.
              </p> */}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 0,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 28,
              }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px 10px",
                    textAlign: "center",
                    borderRight:
                      i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#BBC863",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ marginBottom: 24 }}
            >
              {features.map(({ icon: Icon, text }, i) => (
                <div className="feature-item" key={i}>
                  <div className="feature-icon">
                    <Icon size={15} color="#BBC863" />
                  </div>
                  <span className="feature-text">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* Testimonial Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 10,
                }}
              >
                What our clients say
              </div>
              <TestimonialCarousel />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
