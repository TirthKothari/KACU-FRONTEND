import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Activity,
  ShieldCheck,
  TrendingUp,
  Star,
  CheckCircle,
  Shield,
  Sparkles,
  Layers,
  Quote,
  Zap,
  LayoutGrid,
  BarChart3,
  Briefcase,
  CreditCard,
  Store,
  ChevronRight,
  CheckCircle2,
  User,
} from "lucide-react";
// --- Utility: Grid Background Pattern ---
const GridPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="#31694E"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
  </svg>
);
const GrainOverlay = () => (
  <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);
// --- Component: Spotlight Card ---
// This component tracks mouse movement to create a cursor-following gradient
const FundingCard = ({ item, index }) => {
  const divRef = useRef(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    position.x.set(e.clientX - rect.left);
    position.y.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      // CHANGED: Background is now a 'Stone' gradient instead of white.
      // Border is darker (#31694E/20) for better visibility.
      className="group relative h-full rounded-[2rem] border border-[#31694E]/20 bg-gradient-to-br from-[#F5F5F2] to-[#E6E6E1] shadow-lg shadow-[#31694E]/5 overflow-hidden transition-colors duration-500 hover:border-[#BBC863]/50"
    >
      {/* 1. Spotlight Gradient Effect (Kept consistent) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${position.x}px ${position.y}px,
              rgba(255, 255, 255, 0.8),
              transparent 40%
            )
          `,
        }}
      />

      {/* 2. Content Container */}
      <div className="relative h-full p-8 flex flex-col z-10">
        {/* Icon Header */}
        <div className="flex justify-between items-start mb-6">
          {/* CHANGED: Icon box is now Dark Green by default for contrast */}
          <div className="relative w-16 h-16 rounded-2xl bg-[#31694E] border border-[#31694E] flex items-center justify-center text-[#F0E491] shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:bg-[#BBC863] group-hover:text-[#31694E] group-hover:border-[#BBC863] group-hover:shadow-[0_10px_20px_rgba(187,200,99,0.4)]">
            <item.icon size={30} strokeWidth={1.5} />
            {/* Inner Glow on Hover */}
            <div className="absolute inset-0 rounded-2xl bg-white blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
          </div>

          {/* Subtle Index Number */}
          <span className="text-4xl font-bold text-[#31694E]/10 group-hover:text-[#31694E]/20 transition-colors">
            0{index + 1}
          </span>
        </div>

        {/* Text Content */}
        {/* CHANGED: Text colors are deeper/darker */}
        <h3 className="text-2xl font-bold text-[#1E3F30] mb-3 group-hover:translate-x-1 transition-transform duration-300">
          {item.title}
        </h3>
        <p className="text-[#4A6B5D] leading-relaxed text-sm font-medium flex-grow mb-8 group-hover:text-[#31694E] transition-colors">
          {item.desc}
        </p>

        {/* Action Area */}
        <div className="pt-6 border-t border-[#31694E]/10 flex items-center justify-between group-hover:border-[#31694E]/20 transition-colors">
          <span className="text-xs font-bold text-[#658C58] uppercase tracking-widest group-hover:text-[#31694E] transition-colors">
            Learn More
          </span>
          <motion.div
            className="w-8 h-8 rounded-full bg-[#31694E]/10 flex items-center justify-center text-[#31694E] border border-[#31694E]/10"
            whileHover={{
              x: 5,
              backgroundColor: "#31694E",
              color: "#F0E491",
              borderColor: "#31694E",
            }}
          >
            <ArrowRight size={14} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  ...props
}) => {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: isPrimary
          ? "0 20px 40px -10px rgba(101,140,88,0.5)"
          : "none",
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-8 py-4 rounded-full font-bold text-sm tracking-wide overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 group ${
        isPrimary
          ? "bg-[#31694E] text-white shadow-xl shadow-[#31694E]/20 hover:bg-[#2A5943]"
          : "bg-[#E6E6E1] text-[#31694E] border border-[#31694E]/20 hover:bg-[#F0E491] hover:border-[#BBC863]"
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Button Shine Effect */}
      {isPrimary && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}
      <span className="relative z-20 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

// --- Component: Glass Card (Reusable) ---
const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, backdropFilter: "blur(0px)" }}
    animate={{ opacity: 1, y: 0, backdropFilter: "blur(20px)" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={`bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(49,105,78,0.1)] rounded-3xl ${className}`}
  >
    {children}
  </motion.div>
);

export const Hero = () => {
  const { scrollY } = useScroll();

  // Parallax Effects
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]);
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const rotateImage = useTransform(scrollY, [0, 1000], [0, 5]);

  return (
    // Reduced padding (pt-20 pb-10) and removed min-h-screen for a more compact look
    <section className="relative flex items-center pt-20 pb-10 lg:pt-24 overflow-hidden bg-[#FAFAF8] selection:bg-[#BBC863] selection:text-white">
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridPattern />
        <motion.div
          style={{ y: yBackground }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#F0E491] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse"
        />
        <motion.div
          style={{ y: yBackground }}
          className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-[#BBC863] rounded-full mix-blend-multiply filter blur-[120px] opacity-30"
        />
        <motion.div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-[#658C58] rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* --- Left Column: Content --- */}
          <motion.div
            style={{ y: yText }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Badge - Reduced mb-8 to mb-4 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-fit mb-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#BBC863]/30 shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BBC863] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#658C58]"></span>
                </span>
                <span className="text-xs font-bold tracking-widest text-[#31694E] uppercase">
                  Finance Management
                </span>
              </div>
            </motion.div>

            {/* Heading - Reduced mb-6 to mb-4 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-extrabold text-[#31694E] leading-[1.1] mb-4 tracking-tight"
            >
              The First Step Toward{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#658C58] to-[#31694E]">
                  Natural Growth.
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1, ease: "circOut" }}
                  className="absolute bottom-2 left-0 h-4 bg-[#F0E491]/60 -z-0 -rotate-1"
                />
              </span>
            </motion.h1>

            {/* Subtext - Reduced mb-10 to mb-6 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-[#658C58] font-medium leading-relaxed max-w-lg mb-6"
            >
              Kacu provides the resources and eco-friendly funding solutions you
              need to cultivate your business's financial future today.
            </motion.p>

            {/* Actions - Reduced mb-16 to mb-8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 mb-8"
            >
              <Button variant="primary">
                Get Started <ArrowRight size={18} />
              </Button>
              <Button variant="secondary">
                <PlayCircle size={18} /> How it works
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-4 p-2 bg-white rounded-full shadow-lg shadow-[#BBC863]/10 border border-[#FAFAF8]">
                {[32, 44, 86].map((num, i) => (
                  <motion.img
                    key={num}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    src={`https://randomuser.me/api/portraits/${i === 1 ? "women" : "men"}/${num}.jpg`}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    alt="User"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-[#31694E]">
                    3.5M+
                  </span>
                  <Activity size={16} className="text-[#BBC863]" />
                </div>
                <p className="text-xs font-bold text-[#658C58] tracking-wide uppercase opacity-80">
                  Active Users
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* --- Right Column: Visuals --- */}
          {/* Reduced height from h-[700px] to h-[550px] */}
          <div className="lg:col-span-6 relative h-[550px] w-full perspective-1000">
            <motion.div
              style={{ rotateY: rotateImage }}
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full h-full z-10"
            >
              <div className="absolute top-10 right-10 w-[90%] h-[90%] border border-[#BBC863]/30 rounded-[3rem] -z-10 translate-x-4 translate-y-4" />

              <img
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop"
                alt="Kacu Success Story"
                className="w-full h-full object-cover rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(49,105,78,0.3)]"
                style={{ objectPosition: "top" }}
              />
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </motion.div>

            {/* Floating Widget 1 */}
            <motion.div
              className="absolute top-10 -left-8 z-30"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <GlassCard className="p-6 min-w-[260px]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] font-bold text-[#BBC863] uppercase tracking-wider mb-1">
                      Funds Available
                    </p>
                    <h3 className="text-3xl font-bold text-[#31694E]">
                      $8,952
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F0E491]/30 flex items-center justify-center text-[#31694E]">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div className="mt-2 w-full h-1.5 bg-[#F0E491]/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-gradient-to-r from-[#658C58] to-[#31694E] rounded-full shadow-[0_0_10px_rgba(101,140,88,0.5)]"
                  />
                </div>
              </GlassCard>
            </motion.div>

            {/* Floating Widget 2 */}
            <motion.div
              className="absolute top-[40%] -left-4 z-40"
              animate={{ x: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <GlassCard className="flex items-center gap-4 py-3 px-4 pr-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#BBC863] rounded-full blur opacity-40"></div>
                  <img
                    src="https://randomuser.me/api/portraits/women/65.jpg"
                    alt="Agent"
                    className="relative w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#658C58] border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#31694E]">
                    Sarah Jenkins
                  </p>
                  <p className="text-[10px] text-[#658C58] font-medium uppercase tracking-wide">
                    Loan Specialist
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Floating Widget 3 */}
            <motion.div
              className="absolute bottom-8 -right-6 z-40"
              animate={{ y: [0, 20, 0] }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <GlassCard className="p-6 w-72">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#BBC863] uppercase tracking-wider">
                      Current Balance
                    </p>
                    <p className="text-2xl font-bold text-[#31694E]">
                      $15,649.00
                    </p>
                  </div>
                  <div className="p-2 bg-[#658C58]/10 rounded-lg text-[#31694E]">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="relative h-24 w-full">
                  <svg
                    viewBox="0 0 200 100"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient
                        id="chartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#658C58"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#658C58"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <motion.path
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      d="M0 70 C 40 70, 60 30, 100 40 C 140 50, 160 10, 200 20 V 100 H 0 Z"
                      fill="url(#chartGradient)"
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      d="M0 70 C 40 70, 60 30, 100 40 C 140 50, 160 10, 200 20"
                      fill="none"
                      stroke="#658C58"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <motion.circle
                      cx="200"
                      cy="20"
                      r="4"
                      fill="#FFFFFF"
                      stroke="#31694E"
                      strokeWidth="3"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                    />
                  </svg>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FundingOptions = () => {
  const options = [
    {
      title: "Term Business Loan",
      desc: "We don't just look at credit scores; we see your business potential. Funding in just 4 hours, with no hidden fees.",
      icon: BarChart3,
    },
    {
      title: "Working Capital Loans",
      desc: "Simple, fee-free and not dependent on credit history. Ideal for businesses with a steady monthly revenue of $15,000+.",
      icon: Briefcase,
    },
    {
      title: "Business Line Of Credit",
      desc: "Flexible funds when your business needs it. Our line of credit offers easy access to money, helping you handle sudden costs.",
      icon: CreditCard,
    },
    {
      title: "Equipment Financing",
      desc: "Afford essential tools with our equipment financing. Spread the cost over time, making it easier to grow.",
      icon: Zap,
    },
    {
      title: "Merchant Cash Advance",
      desc: "Need funds fast? Our merchant cash advance is ideal for quick cash boosts, with simple, speedy processing.",
      icon: Store,
    },
    {
      title: "Debt Consolidation",
      desc: "Simplify your debts. Merge multiple payments into one, easing your financial management.",
      icon: Layers,
    },
  ];

  return (
    // Reduced padding from py-32 to py-16
    <section className="relative py-16 overflow-hidden bg-[#FAFAF8]">
      {/* --- 1. Background Layer (Fixed & Animated) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(49,105,78,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(49,105,78,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* TOP RIGHT: Yellow/Gold Orb */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[700px] h-[700px] bg-gradient-to-br from-[#F0E491] to-[#BBC863] rounded-full blur-[140px] opacity-40 mix-blend-multiply"
        />

        {/* BOTTOM LEFT: Muted Gold/Green Orb */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -left-[10%] w-[800px] h-[800px] bg-gradient-to-tr from-[#BBC863] to-[#658C58]/30 rounded-full blur-[150px] opacity-30 mix-blend-multiply"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* --- 2. Header Section --- Reduced mb-20 to mb-12 */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // Reduced mb-8 to mb-4
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#BBC863]/40 shadow-sm mb-4 hover:shadow-md transition-shadow cursor-default"
          >
            <Sparkles
              size={14}
              className="text-[#BBC863] fill-[#BBC863] animate-pulse"
            />
            <span className="text-[#31694E] font-bold text-xs uppercase tracking-[0.2em]">
              Tailored Funding Solutions
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            // Reduced mb-6 to mb-4
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#31694E] tracking-tight leading-[1.1] mb-4"
          >
            Funding Options <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BBC863] via-[#658C58] to-[#31694E]">
              Engineered for Growth
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-[#5A7C6B] font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Select the funding option that fits your goals. Our AI-driven
            assessment approves you in record time, so you can focus on
            building.
          </motion.p>
        </div>

        {/* --- 3. Cards Grid --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {options.map((opt, idx) => (
            <FundingCard key={idx} item={opt} index={idx} />
          ))}
        </div>

        {/* --- 4. Bottom CTA --- Reduced mt-20 to mt-12 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <button className="group relative px-10 py-5 bg-[#31694E] text-white rounded-full font-bold shadow-[0_20px_40px_-10px_rgba(49,105,78,0.4)] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_25px_50px_-10px_rgba(49,105,78,0.5)] active:scale-95">
            <span className="relative z-10 flex items-center gap-3">
              View All Solutions
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export const TrustStrip = () => {
  const stats = [
    { label: "Funding Provided", val: "$500M+", target: 500 },
    { label: "Business Supported", val: "10k+", target: 10 },
    { label: "Partner Banks", val: "50+", target: 50 },
    { label: "Customer Rating", val: "4.9/5", target: 4.9 },
  ];

  return (
    // Reduced padding from py-20 to py-10
    <section className="bg-gradient-to-r from-[#31694E] via-[#2A5943] to-[#31694E] py-10 text-white relative overflow-hidden">
      {/* Grid Pattern (Static) */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#F0E491_1px,transparent_1px)] [background-size:30px_30px]" />
      </div>

      {/* Floating Light Orbs (Static positions) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#F0E491] rounded-full blur-[100px] opacity-20" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#BBC863] rounded-full blur-[120px] opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center lg:text-left group">
              <div className="relative inline-block">
                {/* Glow Effect on Hover (CSS Transition only) */}
                <div className="absolute inset-0 bg-[#F0E491] rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                <p className="relative text-4xl lg:text-5xl font-bold mb-2 text-[#F0E491] drop-shadow-[0_0_20px_rgba(240,228,145,0.3)]">
                  {s.val}
                </p>
              </div>

              <p className="text-[#BBC863] text-sm uppercase tracking-[0.2em] font-bold">
                {s.label}
              </p>

              {/* Decorative Line */}
              <div className="h-1 w-16 bg-gradient-to-r from-[#F0E491] to-transparent rounded-full mt-3 mx-auto lg:mx-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CustomerStories = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      business: "Boutique Owner",
      title: "Funding in less than 24h!",
      text: "I was skeptical at first, but Kacu delivered exactly as promised. I applied in the morning and had the working capital in my account by the afternoon.",
      rating: 5,
      date: "2 days ago",
    },
    {
      name: "Michael Ross",
      business: "Construction Firm",
      title: "Professional and transparent",
      text: "Unlike other lenders who hit you with hidden fees, Kacu was upfront about everything. The rep, Beth, walked me through the entire term loan process.",
      rating: 5,
      date: "1 week ago",
    },
    {
      name: "David Chen",
      business: "Tech Startup",
      title: "Great for rapid scaling",
      text: "We needed bridge financing while waiting for our Series A. The line of credit Kacu set up for us was flexible and grew as our revenue grew. A true partner.",
      rating: 5,
      date: "3 weeks ago",
    },
    {
      name: "Elena Rodriguez",
      business: "Restaurant Group",
      title: "Lifesaver for equipment",
      text: "Our main oven broke down right before the holiday rush. The equipment financing approval was instant, and we didn't have to drain our cash reserves.",
      rating: 4,
      date: "1 month ago",
    },
    {
      name: "James Wilson",
      business: "Logistics Co.",
      title: "Simple process, great rates",
      text: "The dashboard is super easy to use. I can check my balance and draw funds whenever I need fuel coverage. It's streamlined our cash flow management completely.",
      rating: 5,
      date: "2 days ago",
    },
    {
      name: "Anita Patel",
      business: "Dental Practice",
      title: "Excellent customer support",
      text: "I had a few questions about the repayment structure. The support team was knowledgeable and didn't treat me like just a number. Feels good to be supported.",
      rating: 5,
      date: "5 days ago",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-[#FAFAF8]">
      {/* --- 1. Living Background Mesh --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Abstract Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(49,105,78,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(49,105,78,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Floating Gradient Orbs */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#F0E491]/30 rounded-full blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#658C58]/20 rounded-full blur-[100px] mix-blend-multiply"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* --- 2. Section Header --- */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#BBC863]/30 shadow-sm mb-8"
          >
            <div className="relative">
              <Star size={14} className="text-[#BBC863] fill-[#BBC863]" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-[#BBC863] rounded-full opacity-50 scale-150"
              />
            </div>
            <span className="text-[#31694E] font-bold text-xs uppercase tracking-[0.2em]">
              Trusted by 5,000+ Businesses
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-[#31694E] mb-6 tracking-tight leading-[1.1]"
          >
            Real Stories.{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#658C58] to-[#31694E]">
                Natural Success.
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
                className="absolute bottom-2 left-0 w-full h-3 bg-[#F0E491]/50 -z-10 origin-left -skew-x-12"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#658C58] text-lg max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Join thousands of business owners who trust Kacu to fund their
            dreams. Transparency, speed, and organic growth are at our core.
          </motion.p>
        </div>

        {/* --- 3. Enhanced Reviews Grid --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative h-full flex flex-col p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_-10px_rgba(49,105,78,0.05)] hover:shadow-[0_25px_50px_-10px_rgba(49,105,78,0.1)] transition-all duration-500 overflow-hidden"
              >
                {/* Subtle Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F0E491]/10 via-transparent to-[#658C58]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quote Icon Decoration */}
                <div className="absolute top-6 right-6 text-[#BBC863]/20 group-hover:text-[#BBC863]/40 transition-colors">
                  <Quote size={40} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Rating Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 + i * 0.05 }}
                        >
                          <Star
                            size={16}
                            className={
                              i < review.rating
                                ? "text-[#BBC863] fill-[#BBC863]"
                                : "text-slate-200 fill-slate-200"
                            }
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Verified Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#31694E]/5 border border-[#31694E]/10">
                      <CheckCircle size={10} className="text-[#31694E]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#31694E]">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#1E3F30] mb-3 line-clamp-1 group-hover:text-[#31694E] transition-colors">
                    "{review.title}"
                  </h3>

                  <p className="text-[#5A7C6B] text-sm leading-relaxed mb-8 flex-grow">
                    {review.text}
                  </p>

                  {/* Author Footer */}
                  <div className="mt-auto pt-6 border-t border-[#31694E]/10 flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-inner">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#658C58] to-[#31694E]" />
                      <div className="absolute inset-0 flex items-center justify-center text-[#F0E491] font-bold text-lg">
                        {review.name.charAt(0)}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#31694E]">
                        {review.name}
                      </p>
                      <p className="text-xs text-[#BBC863] font-bold uppercase tracking-wide">
                        {review.business}
                      </p>
                    </div>

                    <div className="ml-auto text-[10px] font-medium text-slate-400">
                      {review.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* --- 4. Trust Banner --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-24 flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-8 py-5 rounded-full bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-[#BBC863]/20"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#31694E] font-bold text-xl">
                Excellent
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-[#31694E] rounded flex items-center justify-center"
                  >
                    <Star size={12} fill="white" className="text-white" />
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            <p className="text-sm text-slate-500 font-medium">
              Rated <strong className="text-[#31694E]">4.9/5</strong> based on{" "}
              <strong className="text-[#31694E]">1,250+</strong> reviews
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export const DarkFeatureSection = () => {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotateOrb = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section className="relative py-32 overflow-hidden bg-[#1E3F30]">
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#31694E] via-[#2A5943] to-[#1E3F30]">
        <GrainOverlay />

        {/* Animated Background Orbs */}
        <motion.div
          style={{ rotate: rotateOrb }}
          className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-[#658C58] rounded-full blur-[120px] opacity-20 mix-blend-screen"
        />
        <motion.div
          style={{ y: yParallax }}
          className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[#BBC863] rounded-full blur-[100px] opacity-10 mix-blend-screen"
        />

        {/* Techno Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(240,228,145,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(240,228,145,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30 mask-image-gradient" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* --- Left Column: Content --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Glowing Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BBC863]/10 border border-[#BBC863]/20 backdrop-blur-md mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#F0E491] animate-pulse shadow-[0_0_10px_#F0E491]" />
              <span className="text-[#F0E491] font-bold tracking-[0.2em] text-[10px] uppercase">
                Why Choose Kacu
              </span>
            </motion.div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
              Your partner in <br />
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#F0E491] to-[#BBC863]">
                  Financial Growth.
                </span>
                {/* Underline Animation */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
                  className="absolute bottom-1 left-0 w-full h-3 bg-[#658C58]/40 -z-10 origin-left skew-x-12"
                />
              </span>
            </h2>

            <p className="text-[#FAFAF8]/70 text-lg mb-12 leading-relaxed font-light max-w-md">
              We understand that every business journey is unique. Our platform
              combines organic speed with human expertise to get you funded when
              it matters most.
            </p>

            {/* Feature List Cards */}
            <div className="space-y-4 mb-12">
              {[
                {
                  icon: Zap,
                  title: "Lighting Fast Decisions",
                  desc: "Get pre-qualified in minutes with our advanced algorithms, no paperwork required initially.",
                },
                {
                  icon: LayoutGrid,
                  title: "Flexible Repayment",
                  desc: "Revenue-based options that adapt to your business flow. We only succeed when you do.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{
                    x: 10,
                    backgroundColor: "rgba(101, 140, 88, 0.15)",
                  }}
                  className="group relative flex gap-5 p-5 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 overflow-hidden cursor-default"
                >
                  {/* Hover Gradient Border */}
                  <div className="absolute inset-0 rounded-2xl border border-[#BBC863]/0 group-hover:border-[#BBC863]/30 transition-colors duration-300" />

                  {/* Icon Box */}
                  <div className="relative w-12 h-12 rounded-xl bg-[#31694E] border border-[#658C58]/30 flex items-center justify-center text-[#F0E491] shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon size={22} strokeWidth={2} />
                    {/* Icon Glow */}
                    <div className="absolute inset-0 bg-[#F0E491] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 rounded-xl" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-1 text-white group-hover:text-[#F0E491] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-4 bg-[#F0E491] rounded-full overflow-hidden shadow-[0_0_40px_-10px_rgba(240,228,145,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#F0E491] to-[#BBC863] transition-all" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay transition-opacity" />

              <span className="relative z-10 flex items-center gap-3 text-[#31694E] font-bold tracking-wide">
                Get Funded Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>

          {/* --- Right Column: Immersive Visuals --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative perspective-1000 pl-4 lg:pl-0"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20"
            >
              {/* Abstract Backdrop Shape */}
              <div className="absolute top-0 right-0 w-full h-full bg-[#658C58]/20 rounded-[2.5rem] rotate-6 scale-95 blur-sm -z-10" />

              {/* Main Image Frame */}
              <div className="group relative rounded-[2.5rem] overflow-hidden border border-[#658C58]/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] bg-[#1E3F30]">
                {/* Image */}
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                  alt="Team Strategy"
                  className="w-full h-auto object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3F30] via-transparent to-transparent opacity-80" />

                {/* Scanning Line Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F0E491]/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
              </div>

              {/* Floating "Happy Clients" Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-10 -left-6 md:-left-12 bg-[#FAFAF8]/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />

                <div className="relative flex items-center gap-5">
                  {/* Avatar Stack */}
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="relative w-12 h-12 rounded-full border-[3px] border-[#2A5943] bg-[#BBC863] overflow-hidden shadow-lg"
                      >
                        <img
                          src={`https://randomuser.me/api/portraits/men/${i * 12 + 10}.jpg`}
                          alt="Client"
                          className="w-full h-full object-cover grayscale mix-blend-luminosity hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-[3px] border-[#2A5943] bg-[#31694E] flex items-center justify-center text-white text-xs font-bold shadow-lg z-10">
                      +2k
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold text-white tracking-tight">
                        2,500+
                      </span>
                      <CheckCircle2 size={18} className="text-[#BBC863]" />
                    </div>
                    <p className="text-[11px] font-bold text-[#BBC863] uppercase tracking-widest">
                      Happy Clients
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Tech Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-t-2 border-r-2 border-[#BBC863]/30 rounded-tr-[2rem] pointer-events-none" />
              <div className="absolute bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-[#658C58]/30 rounded-br-[2rem] pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const CreditScoreSelector = () => {
  const [selectedScore, setSelectedScore] = useState("Excellent");
  const [hoveredScore, setHoveredScore] = useState(null);

  const fundingMap = {
    Excellent: {
      range: "$50,000 - $5M+",
      label: "Prime Rates Available",
      color: "#F0E491",
      icon: Sparkles,
      description: "Best rates & terms",
      progress: 100,
    },
    Great: {
      range: "$25,000 - $2M+",
      label: "Fast Approval",
      color: "#BBC863",
      icon: TrendingUp,
      description: "Quick processing",
      progress: 85,
    },
    Good: {
      range: "$10,000 - $1M",
      label: "Flexible Terms",
      color: "#658C58",
      icon: Activity,
      description: "Multiple options",
      progress: 70,
    },
    Fair: {
      range: "$5,000 - $500k",
      label: "Building Credit",
      color: "#31694E",
      icon: Shield,
      description: "Growth focused",
      progress: 50,
    },
    Poor: {
      range: "Custom Plans",
      label: "Revenue Based",
      color: "#A3A3A3",
      icon: Layers,
      description: "Alternative solutions",
      progress: 30,
    },
  };

  return (
    // Added a soft yellow gradient to the section background and a base grid
    <section className="relative z-20 -mt-10 pb-12 px-4 md:px-6 bg-gradient-to-b from-transparent via-[#F0E491]/10 to-transparent">
      {/* SECTION LEVEL GRID */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#31694E 1px, transparent 1px), linear-gradient(90deg, #31694E 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[3rem] bg-[#1E3F30] p-6 md:p-12 text-center shadow-[0_50px_100px_-20px_rgba(49,105,78,0.5)] border border-[#658C58]/30"
        >
          {/* --- ENHANCED INTERNAL BACKGROUND --- */}
          <div className="absolute inset-0 pointer-events-none">
            {/* High-visibility internal technical grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(rgba(240, 228, 145, 0.15) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(240, 228, 145, 0.15) 1.5px, transparent 1.5px)`,
                backgroundSize: "30px 30px",
              }}
            />

            {/* Yellow Ambient Glow (Top Right) */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-[#F0E491] rounded-full blur-[140px] mix-blend-overlay"
            />

            {/* Yellow Ambient Glow (Bottom Left) */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-[20%] -left-[5%] w-[500px] h-[500px] bg-[#F0E491]/40 rounded-full blur-[120px] mix-blend-screen"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1E3F30]/90" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* --- Header Section --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#658C58]/30 backdrop-blur-md border border-[#F0E491]/30 mb-4 shadow-lg"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0E491] opacity-75"></span>
                  <Sparkles className="relative text-[#F0E491]" size={16} />
                </div>
                <span className="text-[#F0E491] font-bold text-xs uppercase tracking-[0.15em]">
                  Instant Pre-Qualification
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 leading-[1.1]">
                Let's find your{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0E491] to-[#BBC863]">
                    perfect match
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
                    className="absolute bottom-1 left-0 w-full h-3 bg-[#658C58]/40 -z-10 skew-x-12 origin-left"
                  />
                </span>
              </h2>

              <p className="text-[#BBC863]/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
                Select your credit score range to immediately see the funding
                power available to your business.
              </p>
            </motion.div>

            {/* --- Interactive Score Buttons --- */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.keys(fundingMap).map((score, index) => {
                const item = fundingMap[score];
                const isSelected = selectedScore === score;
                const ScoreIcon = item.icon || Shield;

                return (
                  <motion.button
                    key={score}
                    onClick={() => setSelectedScore(score)}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative py-4 px-4 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 group ${
                      isSelected
                        ? "bg-gradient-to-b from-[#F0E491] to-[#BBC863] text-[#31694E] shadow-[0_20px_40px_-10px_rgba(240,228,145,0.5)] scale-105 z-10"
                        : "bg-white/5 backdrop-blur-md text-white/70 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -top-2 -right-2 bg-white text-[#31694E] rounded-full p-1 shadow-lg"
                      >
                        <CheckCircle size={16} fill="currentColor" />
                      </motion.div>
                    )}

                    <ScoreIcon
                      size={28}
                      className={`transition-colors duration-300 ${isSelected ? "text-[#31694E]" : "text-[#BBC863] group-hover:text-[#F0E491]"}`}
                    />

                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-lg font-bold tracking-wide ${isSelected ? "text-[#31694E]" : "text-white"}`}
                      >
                        {score}
                      </span>
                      <span
                        className={`hidden md:block text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-[#31694E]/70" : "text-white/40"}`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* --- Dynamic Results Dashboard --- */}
            <motion.div
              layout
              className="relative overflow-hidden bg-[#FAFAF8]/10 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-[#FAFAF8]/10 shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]"
            >
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#F0E491]/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="w-full lg:w-1/2 text-left space-y-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#BBC863] text-xs font-bold uppercase tracking-widest">
                      Estimated Funding Power
                    </span>
                    <div className="h-px flex-grow bg-gradient-to-r from-[#BBC863]/30 to-transparent" />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedScore}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-1 drop-shadow-lg">
                        {fundingMap[selectedScore].range}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
                          style={{
                            color: fundingMap[selectedScore].color,
                            backgroundColor: fundingMap[selectedScore].color,
                          }}
                        />
                        <p className="text-lg text-[#F0E491] font-medium">
                          {fundingMap[selectedScore].label}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="w-full h-2 bg-black/20 rounded-full mt-4 overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{
                        backgroundColor: fundingMap[selectedScore].color,
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${fundingMap[selectedScore].progress}%`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 50,
                        damping: 15,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-3">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(240,228,145,0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative w-full lg:w-auto px-10 py-4 bg-[#F0E491] text-[#31694E] rounded-[1.5rem] font-bold text-lg shadow-lg overflow-hidden transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F0E491] via-[#BBC863] to-[#F0E491] group-hover:bg-[length:200%_100%] transition-all duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Check Eligibility
                      <ArrowRight
                        className="group-hover:translate-x-1 transition-transform"
                        strokeWidth={2.5}
                      />
                    </span>
                  </motion.button>

                  <p className="flex items-center gap-2 text-[#BBC863]/80 text-xs font-medium">
                    <Shield size={14} />
                    Secure & confidential • No credit impact
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
