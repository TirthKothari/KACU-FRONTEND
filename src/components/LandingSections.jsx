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
  Activity,
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Layers,
  LayoutGrid,
  PlayCircle,
  Quote,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

const GrainOverlay = () => (
  <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
);

// Placeholder components (assuming you have these defined in your project)
const Button = ({ children, variant, className, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 ${variant === "primary" ? "bg-[#31694E] text-white" : "bg-white text-[#31694E] border border-[#31694E]/20"} ${className}`}
  >
    {children}
  </button>
);

const GlassCard = ({ children, className }) => (
  <div
    className={`bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl ${className}`}
  >
    {children}
  </div>
);

const GridPattern = () => (
  <div className="absolute inset-0 bg-[linear-gradient(rgba(49,105,78,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(49,105,78,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
);

export const Hero = ({ onGetStarted }) => {
  return (
    <section className="relative flex items-center pt-25 pb-14 min-h-[480px] overflow-hidden bg-[#FAFAF8] selection:bg-[#BBC863] selection:text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridPattern />

        <div className="absolute -top-[20%] -right-[10%] w-[300px] h-[300px] bg-[#F0E491] rounded-full mix-blend-multiply filter blur-[120px] opacity-40" />
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-[#BBC863] rounded-full mix-blend-multiply filter blur-[120px] opacity-30" />
        <div className="absolute bottom-0 right-[20%] w-[350px] h-[350px] bg-[#658C58] rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
      </div>

      <div className="container mx-auto px-18 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-fit mb-5"
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

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl lg:text-5xl font-extrabold text-[#31694E] leading-[1.1] mb-5 tracking-tight"
            >
              The First Step Toward{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#658C58] to-[#31694E]">
                  Natural Growth.
                </span>
                <div className="absolute bottom-1 left-0 w-full h-3 bg-[#F0E491]/60 -z-0 -rotate-1" />
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-[#658C58] font-medium leading-relaxed max-w-lg mb-6"
            >
              Kacu provides the resources and eco-friendly funding solutions you
              need to cultivate your business's financial future today.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button variant="primary" onClick={onGetStarted}>
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
              transition={{ delay: 0.4 }}
              className="flex items-center gap-5"
            >
              <div className="flex -space-x-4 p-2 bg-white rounded-full shadow-lg shadow-[#BBC863]/10 border border-[#FAFAF8]">
                {[32, 44, 86].map((num, i) => (
                  <img
                    key={num}
                    src={`https://randomuser.me/api/portraits/${i === 1 ? "women" : "men"}/${num}.jpg`}
                    className="w-9 h-9 rounded-full border-2 border-white object-cover"
                    alt="User"
                  />
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-[#31694E]">
                    3.5M+
                  </span>
                  <Activity size={16} className="text-[#BBC863]" />
                </div>
                <p className="text-xs font-bold text-[#658C58] tracking-wide uppercase opacity-80">
                  Active Users
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="lg:col-span-6 relative h-[460px] w-full perspective-1000">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full z-10"
            >
              <div className="absolute top-8 right-8 w-[90%] h-[90%] border border-[#BBC863]/30 rounded-[2.5rem] -z-10 translate-x-3 translate-y-3" />

              <img
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop"
                alt="Kacu Success Story"
                className="w-full h-full object-cover rounded-[2.5rem] shadow-[0_30px_60px_-20px_rgba(49,105,78,0.3)]"
              />

              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </motion.div>

            {/* Widget 1 */}
            <div className="absolute top-4 -left-6 z-30">
              <GlassCard className="p-4 min-w-[220px]">
                <p className="text-[10px] font-bold text-[#BBC863] uppercase">
                  Funds Available
                </p>
                <h3 className="text-2xl font-bold text-[#31694E]">$8,952</h3>
                <div className="mt-2 w-full h-1.5 bg-[#F0E491]/30 rounded-full">
                  <div className="w-[75%] h-full bg-gradient-to-r from-[#658C58] to-[#31694E] rounded-full" />
                </div>
              </GlassCard>
            </div>

            {/* Widget 2 */}
            <div className="absolute top-[40%] -left-4 z-40">
              <GlassCard className="flex items-center gap-3 py-2 px-3">
                <img
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  className="w-10 h-10 rounded-full border-2 border-white"
                  alt="Agent"
                />
                <div>
                  <p className="text-sm font-bold text-[#31694E]">
                    Sarah Jenkins
                  </p>
                  <p className="text-[10px] text-[#658C58] uppercase">
                    Loan Specialist
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Widget 3 */}
            <div className="absolute bottom-4 -right-6 z-40">
              <GlassCard className="p-4 w-60">
                <p className="text-[10px] font-bold text-[#BBC863] uppercase">
                  Current Balance
                </p>
                <p className="text-xl font-bold text-[#31694E]">$15,649</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FundingCard = ({ item, index }) => {
  return (
    <div className="group relative h-full flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#BBC863]/25 bg-white shadow-[0_8px_30px_-8px_rgba(49,105,78,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#BBC863] hover:shadow-[0_20px_40px_-15px_rgba(49,105,78,0.18)]">
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* --- Header: Icon & Decor --- */}
        <div className="mb-6 flex justify-between items-start">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#31694E] to-[#2A5943] flex items-center justify-center text-[#F0E491] shadow-[0_8px_20px_-6px_rgba(49,105,78,0.35)] group-hover:scale-105 transition-transform duration-300">
            <item.icon size={26} strokeWidth={2} />
          </div>
          {/* Subtle decorative dot cluster */}
          <div className="flex flex-col gap-1 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#BBC863]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#BBC863]/50" />
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#BBC863]/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#BBC863]" />
            </div>
          </div>
        </div>

        {/* --- Content --- */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#1E3F30] mb-3 group-hover:text-[#31694E] transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-[#5A7C6B] text-sm leading-relaxed font-medium">
            {item.desc}
          </p>
        </div>

        {/* --- Footer: Action Line --- */}
        <div className="mt-auto pt-6 border-t border-[#BBC863]/20 flex items-center justify-between">
          <span className="text-xs font-bold text-[#31694E]/60 uppercase tracking-[0.2em] group-hover:text-[#BBC863] transition-colors duration-300">
            Learn More
          </span>

          <div className="w-8 h-8 rounded-full bg-[#F5F7F4] border border-[#BBC863]/30 flex items-center justify-center text-[#31694E] transition-all duration-300 group-hover:bg-[#BBC863] group-hover:text-[#1E3F30] group-hover:border-transparent shadow-sm">
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Bottom accent line using the gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#31694E] via-[#BBC863] to-[#F0E491] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
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
    <section className="relative py-12 overflow-hidden bg-[#FAFAF8]">
      {/* --- 1. Static Background Layer --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(49,105,78,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(49,105,78,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* TOP RIGHT: Static Yellow/Gold Orb */}
        <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-[#F0E491] to-[#BBC863] rounded-full blur-[140px] opacity-40 mix-blend-multiply" />

        {/* BOTTOM LEFT: Static Muted Gold/Green Orb */}
        <div className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#BBC863] to-[#658C58]/30 rounded-full blur-[150px] opacity-30 mix-blend-multiply" />
      </div>

      {/* Matches Hero's px-18 container padding */}
      <div className="container mx-auto px-18 relative z-10">
        {/* --- 2. Header Section --- */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#BBC863]/30 shadow-sm mb-4 cursor-default">
            <Sparkles size={12} className="text-[#BBC863] fill-[#BBC863]" />
            <span className="text-[#31694E] font-bold text-[10px] uppercase tracking-[0.2em]">
              Tailored Funding Solutions
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#31694E] tracking-tight leading-[1.1] mb-3">
            Funding Options <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BBC863] via-[#658C58] to-[#31694E]">
              Engineered for Growth
            </span>
          </h2>

          {/* Description */}
          <p className="text-base text-[#5A7C6B] font-medium leading-relaxed max-w-2xl mx-auto">
            Select the funding option that fits your goals. Our AI-driven
            assessment approves you in record time, so you can focus on
            building.
          </p>
        </div>

        {/* --- 3. Cards Grid --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {options.map((opt, idx) => (
            <FundingCard key={idx} item={opt} index={idx} />
          ))}
        </div>

        {/* --- 4. Bottom CTA --- */}
        <div className="mt-8 flex justify-center">
          <button className="group relative px-8 py-4 bg-[#31694E] text-white rounded-full font-bold shadow-[0_20px_40px_-10px_rgba(49,105,78,0.4)] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_25px_50px_-10px_rgba(49,105,78,0.5)] active:scale-95">
            <span className="relative z-10 flex items-center gap-2 text-sm">
              View All Solutions
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#31694E] to-[#2A5943] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
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
    <section className="bg-gradient-to-r from-[#31694E] via-[#2A5943] to-[#31694E] py-6 not-last-of-type:text-white relative overflow-hidden">
      {/* Grid Pattern (Static) */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#F0E491_1px,transparent_1px)] [background-size:30px_30px]" />
      </div>

      {/* Floating Light Orbs (Static positions) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#F0E491] rounded-full blur-[100px] opacity-20" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#BBC863] rounded-full blur-[120px] opacity-20" />

      <div className="container mx-auto px-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-18">
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
    <section className="relative py-12 overflow-hidden bg-[#FAFAF8]">
      {/* --- 1. Static Background Mesh --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(49,105,78,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(49,105,78,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[#F0E491]/30 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#658C58]/20 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      {/* px-18 matches Hero's container padding */}
      <div className="container mx-auto px-18 relative z-10">
        {/* --- 2. Section Header --- */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#BBC863]/30 shadow-sm mb-6">
            <Star size={14} className="text-[#BBC863] fill-[#BBC863]" />
            <span className="text-[#31694E] font-bold text-xs uppercase tracking-[0.2em]">
              Trusted by 5,000+ Businesses
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#31694E] mb-4 tracking-tight leading-[1.1]">
            Real Stories.{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#658C58] to-[#31694E]">
                Natural Success.
              </span>
              <div className="absolute bottom-2 left-0 w-full h-3 bg-[#F0E491]/50 -z-10 origin-left -skew-x-12" />
            </span>
          </h2>

          <p className="text-[#658C58] text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of business owners who trust Kacu to fund their
            dreams. Transparency, speed, and organic growth are at our core.
          </p>
        </div>

        {/* --- 3. Reviews Grid --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="h-full">
              <div className="group relative h-full flex flex-col p-6 rounded-2xl bg-white border border-[#BBC863]/25 shadow-[0_8px_30px_-8px_rgba(49,105,78,0.10)] hover:shadow-[0_20px_40px_-10px_rgba(49,105,78,0.16)] hover:border-[#BBC863]/50 transition-all duration-300 overflow-hidden">
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F0E491]/10 via-transparent to-[#658C58]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quote icon — visible at rest, brightens on hover */}
                <div className="absolute top-5 right-5 text-[#BBC863]/30 group-hover:text-[#BBC863]/50 transition-colors duration-300">
                  <Quote size={32} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "text-[#BBC863] fill-[#BBC863]"
                              : "text-slate-200 fill-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-[#1E3F30] mb-2 line-clamp-1 group-hover:text-[#31694E] transition-colors duration-300">
                    "{review.title}"
                  </h3>

                  <p className="text-[#5A7C6B] text-sm leading-relaxed mb-4 flex-grow">
                    {review.text}
                  </p>

                  {/* Author Footer */}
                  <div className="mt-auto pt-4 border-t border-[#BBC863]/20 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-[0_4px_10px_-4px_rgba(49,105,78,0.3)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#658C58] to-[#31694E]" />
                      <div className="absolute inset-0 flex items-center justify-center text-[#F0E491] font-bold text-base">
                        {review.name.charAt(0)}
                      </div>
                    </div>

                    <div className="leading-tight">
                      <p className="text-sm font-bold text-[#31694E]">
                        {review.name}
                      </p>
                      <p className="text-[10px] text-[#BBC863] font-bold uppercase tracking-wide">
                        {review.business}
                      </p>
                    </div>

                    <div className="ml-auto flex items-center gap-1">
                      <CheckCircle size={10} className="text-[#31694E]" />
                      <span className="text-[10px] font-medium text-slate-400">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- 4. Trust Banner --- */}
        <div className="mt-16 flex justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-8 py-4 rounded-full bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-[#BBC863]/25 hover:scale-[1.01] transition-transform duration-300">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export const DarkFeatureSection = ({ onGetStarted }) => {
  return (
    <section className="relative py-20 overflow-hidden bg-[#1E3F30]">
      {/* --- Static Background --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#31694E] via-[#2A5943] to-[#1E3F30]">
        <GrainOverlay />

        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-[#658C58] rounded-full blur-[120px] opacity-20 mix-blend-screen" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[#BBC863] rounded-full blur-[100px] opacity-10 mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(240,228,145,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(240,228,145,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>

      {/* px-18 matches Hero's container padding */}
      <div className="container mx-auto px-18 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* --- Left Column: Content --- */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BBC863]/10 border border-[#BBC863]/25 backdrop-blur-md mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F0E491] shadow-[0_0_10px_#F0E491]" />
              <span className="text-[#F0E491] font-bold tracking-[0.2em] text-[10px] uppercase">
                Why Choose Kacu
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
              Your partner in <br />
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#F0E491] to-[#BBC863]">
                  Financial Growth.
                </span>
                <div className="absolute bottom-1 left-0 w-full h-3 bg-[#658C58]/40 -z-10 origin-left skew-x-12" />
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
                <div
                  key={i}
                  className="group relative flex gap-5 p-5 rounded-2xl bg-white/[0.08] border border-white/10 overflow-hidden cursor-default hover:bg-white/[0.12] transition-colors duration-300"
                >
                  {/* Hover Gradient Border */}
                  <div className="absolute inset-0 rounded-2xl border border-[#BBC863]/0 group-hover:border-[#BBC863]/30 transition-colors duration-300" />

                  {/* Icon Box */}
                  <div className="relative w-12 h-12 rounded-xl bg-[#31694E] border border-[#658C58]/40 flex items-center justify-center text-[#F0E491] shrink-0 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4),0_0_0_1px_rgba(240,228,145,0.08)]">
                    <feature.icon size={22} strokeWidth={2} />
                    <div className="absolute inset-0 bg-[#F0E491] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 rounded-xl" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-1 text-white group-hover:text-[#F0E491] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={onGetStarted}
              className="group relative px-10 py-4 bg-[#F0E491] rounded-full overflow-hidden shadow-[0_0_40px_-10px_rgba(240,228,145,0.3)] hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#F0E491] to-[#BBC863]" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay transition-opacity" />
              <span className="relative z-10 flex items-center gap-3 text-[#31694E] font-bold tracking-wide">
                Get Funded Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* --- Right Column: Static Visuals --- */}
          <div className="relative perspective-1000 pl-4 lg:pl-0">
            <div className="relative z-20">
              {/* Abstract Backdrop Shape */}
              <div className="absolute top-0 right-0 w-full h-full bg-[#658C58]/20 rounded-[2.5rem] rotate-6 scale-95 blur-sm -z-10" />

              {/* Main Image Frame */}
              <div className="group relative rounded-[2.5rem] overflow-hidden border border-[#658C58]/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] bg-[#1E3F30]">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                  alt="Team Strategy"
                  className="w-full h-auto object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3F30] via-transparent to-transparent opacity-80" />
              </div>

              {/* "Happy Clients" Card */}
              <div className="absolute -bottom-10 -left-6 md:-left-12 bg-[#FAFAF8]/10 backdrop-blur-xl border border-white/15 p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
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
              </div>

              {/* Decorative Tech Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-t-2 border-r-2 border-[#BBC863]/30 rounded-tr-[2rem] pointer-events-none" />
              <div className="absolute bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-[#658C58]/30 rounded-br-[2rem] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CreditScoreSelector = () => {
  const [selectedScore, setSelectedScore] = useState("Excellent");

  const fundingMap = {
    Excellent: {
      range: "$50,000 - $5M+",
      label: "Prime Rates Available",
      color: "#F0E491",
      icon: Sparkles,
      progress: 100,
    },
    Great: {
      range: "$25,000 - $2M+",
      label: "Fast Approval",
      color: "#BBC863",
      icon: TrendingUp,
      progress: 85,
    },
    Good: {
      range: "$10,000 - $1M",
      label: "Flexible Terms",
      color: "#658C58",
      icon: Activity,
      progress: 70,
    },
    Fair: {
      range: "$5,000 - $500k",
      label: "Building Credit",
      color: "#31694E",
      icon: Shield,
      progress: 50,
    },
    Poor: {
      range: "Custom Plans",
      label: "Revenue Based",
      color: "#A3A3A3",
      icon: Layers,
      progress: 30,
    },
  };

  const selectedData = fundingMap[selectedScore];
  const IconComponent = selectedData.icon;

  return (
    <section className="relative py-20 bg-[#1E3F30] overflow-hidden">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(240,228,145,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(240,228,145,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#658C58] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#BBC863] rounded-full blur-[100px] opacity-10" />
      </div>

      {/* px-18 matches Hero's container padding */}
      <div className="container mx-auto px-18 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* --- Left Column: Information --- */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BBC863]/10 border border-[#BBC863]/25 backdrop-blur-md mb-6">
              <div className="w-2 h-2 rounded-full bg-[#F0E491] shadow-[0_0_10px_#F0E491]" />
              <span className="text-[#F0E491] font-bold tracking-[0.2em] text-[10px] uppercase">
                Instant Qualification
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Unlock your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0E491] to-[#BBC863]">
                Financial Potential.
              </span>
            </h2>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
              Don't let a number define your business's future. Whether you have
              excellent credit or are just building it, Kacu has a funding
              solution tailored to your revenue and goals.
            </p>

            {/* Checklist */}
            <ul className="space-y-4 mb-10">
              {[
                "No hard credit pull to check eligibility",
                "Funding available in as little as 4 hours",
                "Rates starting as low as 6.99%",
                "Dedicated advisor for every account",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#31694E] flex items-center justify-center text-[#F0E491] shrink-0 border border-[#658C58]/40 shadow-[0_0_0_1px_rgba(240,228,145,0.08)]">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-slate-200 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            {/* Security Footer */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-sm text-[#BBC863]/80 font-medium">
              <Shield size={14} />
              <span>Bank-level security & 256-bit encryption</span>
            </div>
          </div>

          {/* --- Right Column: The Calculator --- */}
          <div className="relative">
            {/* Card Glow Background */}
            <div
              className="absolute inset-0 rounded-[2.5rem] blur-xl transition-all duration-500"
              style={{
                background: `radial-gradient(ellipse at 60% 40%, ${selectedData.color}25, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(101,140,88,0.15), transparent 60%)`,
              }}
            />

            <div className="relative bg-[#FAFAF8]/[0.07] backdrop-blur-xl border border-white/15 rounded-[2.5rem] p-8 shadow-2xl">
              {/* Accent top border that reflects selected score */}
              <div
                className="absolute top-0 left-8 right-8 h-[2px] rounded-full transition-all duration-500"
                style={{
                  background: `linear-gradient(to right, transparent, ${selectedData.color}, transparent)`,
                }}
              />

              {/* Header */}
              <div className="text-center mb-8 pt-2">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Select Your Credit Score
                </h3>
                <p className="text-white/50 text-sm">
                  See your estimated funding power instantly
                </p>
              </div>

              {/* Score Buttons Grid */}
              <div className="grid grid-cols-5 gap-2 mb-8">
                {Object.keys(fundingMap).map((score) => {
                  const isSelected = selectedScore === score;
                  const scoreColor = fundingMap[score].color;
                  return (
                    <button
                      key={score}
                      onClick={() => setSelectedScore(score)}
                      className={`relative flex flex-col items-center gap-2 p-2 py-4 rounded-xl transition-all duration-300 ${
                        isSelected
                          ? "text-[#1E3F30] shadow-lg scale-105 z-10"
                          : "bg-white/[0.08] border border-white/10 text-white/60 hover:bg-white/[0.13] hover:text-white/90"
                      }`}
                      style={
                        isSelected
                          ? {
                              background: `linear-gradient(to bottom, ${scoreColor}, ${scoreColor}cc)`,
                              boxShadow: `0 8px 24px -8px ${scoreColor}80`,
                            }
                          : {}
                      }
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        {score}
                      </span>
                      <div
                        className="w-2 h-2 rounded-full transition-colors duration-300"
                        style={{
                          backgroundColor: isSelected
                            ? "#1E3F30"
                            : `${scoreColor}60`,
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Result Display Area */}
              <div className="bg-[#1E3F30]/60 rounded-3xl p-6 border border-white/10 text-center mb-6 relative overflow-hidden">
                {/* Subtle color wash based on selection */}
                <div
                  className="absolute inset-0 opacity-10 transition-all duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 120%, ${selectedData.color}, transparent 70%)`,
                  }}
                />

                <p className="text-[#BBC863] text-xs font-bold uppercase tracking-widest mb-3 relative z-10">
                  Estimated Funding Range
                </p>

                <div
                  className="text-3xl md:text-4xl font-bold mb-3 relative z-10 transition-all duration-300"
                  style={{ color: selectedData.color }}
                >
                  {selectedData.range}
                </div>

                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium relative z-10"
                  style={{
                    backgroundColor: `${selectedData.color}18`,
                    border: `1px solid ${selectedData.color}35`,
                    color: selectedData.color,
                  }}
                >
                  <IconComponent size={13} />
                  {selectedData.label}
                </div>

                {/* Progress Track */}
                <div className="mt-5 relative z-10">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${selectedData.progress}%`,
                        background: `linear-gradient(to right, ${selectedData.color}99, ${selectedData.color})`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-white/30 font-medium">
                      Limited
                    </span>
                    <span className="text-[10px] text-white/30 font-medium">
                      Maximum
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full group relative py-4 rounded-xl font-bold text-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, ${selectedData.color}, ${selectedData.color}cc)`,
                  }}
                />
                <span
                  className="relative z-10 flex items-center justify-center gap-2 font-bold"
                  style={{ color: "#1E3F30" }}
                >
                  Check Eligibility
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>

              <p className="text-center text-white/30 text-xs mt-4">
                *Preliminary estimate based on credit tier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
