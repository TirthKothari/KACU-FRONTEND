import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Sparkles,
  PlayCircle,
  Zap,
  LayoutGrid,
  BarChart,
  Briefcase,
  CreditCard,
  Store,
  Layers,
  Star,
} from "lucide-react";
import { Button } from "./UI"; // Assuming Button accepts className overrides

// PALETTE REFERENCE:
// Highlight/Accent: #F0E491 (Pale Cream/Yellow)
// Cards/Container:  #BBC863 (Olive/Muted Lime)
// Interaction:      #658C58 (Sage Green)
// Primary/Text:     #31694E (Deep Forest Green)

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-visible bg-[#FAFAF8]">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0E491] rounded-full blur-[120px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-block px-4 py-2 bg-[#F0E491]/30 text-[#31694E] rounded-full text-xs font-bold mb-8 tracking-wide shadow-sm border border-[#BBC863]/30">
            FINANCE MANAGEMENT
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#31694E] leading-[1.1] mb-6 tracking-tight">
            The First Step Toward{" "}
            <span className="text-[#658C58]">Natural Growth.</span>
          </h1>
          <p className="text-lg text-[#658C58] mb-10 leading-relaxed max-w-lg font-medium">
            Kacu provides the resources and eco-friendly funding solutions you
            need to cultivate your business's financial future today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={() => navigate("/wizard")}
              className="px-8 py-4 bg-[#658C58] text-white rounded-full font-semibold hover:bg-[#31694E] transition-all shadow-lg hover:shadow-[#658C58]/30 flex items-center justify-center gap-2"
            >
              Get Started
            </button>
            <button className="px-8 py-4 bg-[#F0E491]/40 text-[#31694E] rounded-full font-semibold hover:bg-[#F0E491] transition-all flex items-center justify-center gap-2 border border-[#BBC863]/20">
              <PlayCircle size={18} /> How it works
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
                alt="User"
              />
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
                alt="User"
              />
              <img
                src="https://randomuser.me/api/portraits/men/86.jpg"
                className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
                alt="User"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#31694E]">3.5M+</p>
              <p className="text-sm text-[#658C58]">Active Users</p>
            </div>
          </div>
        </motion.div>

        <div className="relative hidden lg:block h-[650px] w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute right-0 top-0 bottom-0 w-[85%] z-10"
          >
            <img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop"
              alt="Kacu Success Story"
              className="w-full h-full object-cover rounded-[3rem] shadow-2xl shadow-[#BBC863]/20"
              style={{ objectPosition: "top" }}
            />
          </motion.div>
          {/* Floating Widgets */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-24 left-0 z-20 bg-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(49,105,78,0.1)] border border-[#BBC863]/20 w-64"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-2xl font-bold text-[#31694E]">$8,952</p>
                <p className="text-xs text-[#BBC863] font-bold mt-1">
                  Available Funds
                </p>
              </div>
              <div className="w-10 h-6 bg-[#F0E491]/30 rounded flex items-center justify-center">
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 rounded-full bg-[#BBC863] opacity-80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#658C58] opacity-80"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-[#658C58]/10 text-[#31694E] text-[10px] font-bold rounded uppercase">
                Active
              </div>
              <div className="h-1 flex-grow bg-[#F0E491]/30 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-[#658C58]"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[45%] left-4 z-30"
          >
            <div className="bg-white py-3 px-4 rounded-2xl shadow-xl shadow-[#31694E]/5 border border-[#BBC863]/20 flex items-center gap-4 relative">
              <div className="absolute -right-12 top-1/2 w-12 h-[2px] bg-[#BBC863]/30 hidden xl:block"></div>
              <div className="absolute -right-12 top-1/2 w-2 h-2 bg-[#BBC863] rounded-full translate-y-[-3px] hidden xl:block"></div>
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt="Agent"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <p className="text-sm font-bold text-[#31694E]">
                  Sarah Jenkins
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#658C58]">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                    className="w-3 rounded-sm"
                    alt="US"
                  />
                  <span>Loan Specialist</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-16 -right-6 z-30 bg-white p-6 rounded-3xl shadow-[0_30px_60px_rgba(49,105,78,0.15)] border border-[#BBC863]/20 w-72"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-[#BBC863] font-bold mb-1 uppercase">
                  Current Balance
                </p>
                <p className="text-2xl font-bold text-[#31694E]">$15,649.00</p>
              </div>
              <div className="w-10 h-10 bg-[#F0E491]/30 rounded-full flex items-center justify-center text-[#658C58]">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="relative h-16 w-full">
              <svg
                viewBox="0 0 100 40"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#658C58" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#658C58" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,40 L0,30 C20,30 20,10 40,20 C60,30 60,5 80,15 C90,20 100,10 100,10 L100,40 Z"
                  fill="url(#gradient)"
                />
                <path
                  d="M0,30 C20,30 20,10 40,20 C60,30 60,5 80,15 C90,20 100,10 100,10"
                  fill="none"
                  stroke="#658C58"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx="80"
                  cy="15"
                  r="4"
                  fill="#fff"
                  stroke="#658C58"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-[#BBC863] mt-2 uppercase font-semibold tracking-wider">
              <span>Jan</span>
              <span>Feb</span>
              <span className="text-[#31694E]">Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </motion.div>
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
    <section className="py-24 bg-[#F0E491]/10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#F0E491] rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#BBC863] rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#658C58]/10 text-[#31694E] rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#658C58]/20">
            <Star size={14} fill="currentColor" className="text-[#BBC863]" />{" "}
            4.9/5 Average Rating
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#31694E] mb-6">
            Real Stories.{" "}
            <span className="text-[#658C58]">Natural Success.</span>
          </h2>
          <p className="text-[#658C58] text-lg max-w-2xl mx-auto font-medium">
            Join thousands of business owners who trust Kacu to fund their
            dreams. Transparency and organic growth are at our core.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-[#BBC863]/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col group">
                {/* Top Row: Stars & Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < review.rating
                            ? "text-[#BBC863] fill-[#BBC863]"
                            : "text-slate-200 fill-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[#658C58] text-xs font-semibold opacity-70">
                    <CheckCircle size={12} className="text-[#31694E]" />{" "}
                    Verified
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-[#31694E] mb-2 group-hover:text-[#658C58] transition-colors">
                  "{review.title}"
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow mb-6">
                  {review.text}
                </p>

                {/* Footer: Author Info */}
                <div className="border-t border-[#BBC863]/20 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#31694E]/10 text-[#31694E] flex items-center justify-center font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#31694E]">
                      {review.name}
                    </p>
                    <p className="text-xs text-[#BBC863] font-medium">
                      {review.business}
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-slate-400">
                    {review.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trustpilot Style Banner (Social Proof) */}
        <div className="mt-16 flex justify-center">
          <div className="bg-white py-4 px-8 rounded-full shadow-lg border border-[#BBC863]/20 flex items-center gap-4">
            <span className="text-[#31694E] font-bold">Excellent</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-[#658C58] flex items-center justify-center text-white text-[10px]"
                >
                  <Star size={12} fill="white" />
                </div>
              ))}
            </div>
            <span className="text-slate-500 text-sm">
              Based on <strong className="text-[#31694E]">1,250+</strong>{" "}
              reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export const TrustStrip = () => {
  const stats = [
    { label: "Funding Provided", val: "$500M+" },
    { label: "Business Supported", val: "10k+" },
    { label: "Partner Banks", val: "50+" },
    { label: "Customer Rating", val: "4.9/5" },
  ];
  return (
    <section className="bg-[#31694E] py-16 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#F0E491_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="container mx-auto px-6 flex flex-wrap gap-8 justify-between items-center relative z-10">
        {stats.map((s, i) => (
          <div key={i} className="text-center md:text-left">
            <p className="text-4xl md:text-5xl font-bold mb-1 text-[#F0E491] drop-shadow-sm">
              {s.val}
            </p>
            <p className="text-[#BBC863] text-sm uppercase tracking-widest font-bold">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const DarkFeatureSection = () => {
  return (
    <section className="py-24 bg-[#31694E] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#658C58] rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#BBC863] rounded-full blur-[100px] opacity-10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[#F0E491] font-bold tracking-widest text-sm mb-2">
              WHY CHOOSE KACU
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your partner in <br />{" "}
              <span className="text-[#F0E491]">Financial Growth.</span>
            </h2>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed font-light">
              We understand that every business journey is unique. Our platform
              combines organic speed with human expertise to get you funded when
              it matters most.
            </p>
            <div className="space-y-8">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#658C58]/20 border border-[#658C58]/30 flex items-center justify-center text-[#F0E491] shrink-0 group-hover:bg-[#F0E491] group-hover:text-[#31694E] transition-all">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#F0E491]">
                    Lighting Fast Decisions
                  </h3>
                  <p className="text-slate-300">
                    Get pre-qualified in minutes with our advanced algorithms,
                    no paperwork required initially.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#658C58]/20 border border-[#658C58]/30 flex items-center justify-center text-[#F0E491] shrink-0 group-hover:bg-[#F0E491] group-hover:text-[#31694E] transition-all">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#F0E491]">
                    Flexible Repayment
                  </h3>
                  <p className="text-slate-300">
                    Revenue-based options that adapt to your business flow. We
                    only succeed when you do.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <button className="px-8 py-4 bg-[#F0E491] text-[#31694E] rounded-full font-bold hover:bg-white transition-all shadow-lg flex items-center gap-2">
                Get Funded Now
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#658C58] to-transparent rounded-[2rem] rotate-3 opacity-30 transform scale-105"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
              alt="Team Strategy"
              className="w-full rounded-[2rem] shadow-2xl border border-[#658C58]/50 relative z-10"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#FAFAF8] text-[#31694E] p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-[#BBC863]/20">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-[#BBC863] border-2 border-white"
                    ></div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-lg">2,500+</p>
                  <p className="text-xs text-[#658C58] font-bold">
                    Happy Clients
                  </p>
                </div>
              </div>
            </div>
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
      desc: "We don’t just look at credit scores; we see your business potential. Funding in just 4 hours, with no hidden fees.",
      icon: BarChart,
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
      desc: "Afford essential tools with our equipment financing. Spread the cost over time, making it easier to grow without heavy upfront expenses.",
      icon: Zap,
    },
    {
      title: "Merchant Cash Advance",
      desc: "Need funds fast? Our merchant cash advance is ideal for quick cash boosts, with simple, speedy processing to support your needs.",
      icon: Store,
    },
    {
      title: "Debt Consolidation",
      desc: "Simplify your debts. Merge multiple payments into one, easing your financial management and focusing more on growing your business.",
      icon: Layers,
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#BBC863_1px,transparent_1px)] [background-size:20px_20px] opacity-20 -z-10" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#31694E] mb-6 tracking-tight">
            A Range Of Funding Options <br />
            <span className="text-[#658C58]">For Your Business</span>
          </h2>
          <p className="text-[#658C58] text-lg max-w-2xl mx-auto font-medium">
            Select the funding option that fits your goals and get approved in
            record time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {options.map((opt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div
                className="
                  h-full 
                  flex flex-col items-start 
                  p-8 rounded-[2rem] 
                  /* Default State: Soft Green Gradient Background */
                  bg-gradient-to-br from-[#658C58]/10 to-[#31694E]/5
                  border border-[#BBC863]/20 
                  
                  /* Hover State: Transitions to White with stronger shadow */
                  hover:bg-white 
                  hover:from-white hover:to-white 
                  shadow-sm 
                  hover:shadow-[0_20px_40px_-10px_rgba(101,140,88,0.2)] 
                  hover:border-[#658C58] 
                  hover:-translate-y-2 
                  
                  transition-all duration-300 group cursor-pointer
                "
              >
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-[#F0E491]/40 text-[#31694E] flex items-center justify-center mb-8 shadow-sm border border-[#F0E491] group-hover:scale-110 group-hover:bg-[#F0E491] transition-all duration-300">
                  <opt.icon size={32} strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-bold text-[#31694E] mb-4 group-hover:text-[#658C58] transition-colors">
                  {opt.title}
                </h3>

                <p className="text-[#31694E]/70 leading-relaxed mb-8 flex-grow font-medium">
                  {opt.desc}
                </p>

                <div className="w-full mt-auto">
                  <button className="px-6 py-3 rounded-full border-2 border-[#BBC863]/30 bg-white/50 text-[#31694E] font-bold text-sm w-auto group-hover:bg-[#658C58] group-hover:border-[#658C58] group-hover:text-white transition-all duration-300 flex items-center gap-2">
                    READ MORE <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CreditScoreSelector = () => {
  const navigate = useNavigate();
  const [selectedScore, setSelectedScore] = useState("Excellent");
  const [hoveredScore, setHoveredScore] = useState(null);

  const fundingMap = {
    Excellent: {
      range: "$50,000 - $5M+",
      label: "Prime Rates Available",
      color: "#F0E491",
      icon: TrendingUp,
      description: "Best rates & terms",
    },
    Great: {
      range: "$25,000 - $2M+",
      label: "Fast Approval",
      color: "#BBC863",
      icon: Sparkles,
      description: "Quick processing",
    },
    Good: {
      range: "$10,000 - $1M",
      label: "Flexible Terms",
      color: "#658C58",
      icon: Shield,
      description: "Multiple options",
    },
    Fair: {
      range: "$5,000 - $500k",
      label: "Building Credit",
      color: "#31694E",
      icon: TrendingUp,
      description: "Growth focused",
    },
    Poor: {
      range: "Custom Plans",
      label: "Revenue Based",
      color: "#F0E491",
      icon: Shield,
      description: "Alternative solutions",
    },
  };

  return (
    <section className="pb-24 pt-0 bg-white relative z-20 -mt-10">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-[#31694E] via-[#2A5943] to-[#1E3F30] rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-[#31694E]/30 border border-[#658C58]/30">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 -left-24 w-96 h-96 bg-[#F0E491] rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#BBC863] rounded-full blur-[120px]"
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#658C58]/20 backdrop-blur-sm border border-[#F0E491]/30 mb-6"
              >
                <Sparkles className="text-[#F0E491]" size={18} />
                <span className="text-[#F0E491] font-semibold text-sm">
                  Instant Pre-Qualification
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Let's find your{" "}
                <span className="text-[#F0E491] relative inline-block">
                  perfect match
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[#BBC863]/20 -z-10 rotate-1"></span>
                </span>
              </h2>
              <p className="text-[#BBC863] text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                Select your credit score range to discover personalized funding
                options tailored just for you
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-12">
              {Object.keys(fundingMap).map((score, index) => {
                const ScoreIcon = fundingMap[score].icon;
                return (
                  <motion.button
                    key={score}
                    onClick={() => setSelectedScore(score)}
                    onHoverStart={() => setHoveredScore(score)}
                    onHoverEnd={() => setHoveredScore(null)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative py-5 px-3 rounded-2xl font-semibold transition-all duration-300 border flex flex-col items-center justify-center gap-2 group ${selectedScore === score ? "bg-[#F0E491] text-[#31694E] shadow-2xl translate-y-[-4px] border-[#F0E491]" : "bg-white/10 backdrop-blur-sm text-white border-white/10 hover:bg-white/20 hover:border-white/30"}`}
                  >
                    <AnimatePresence>
                      {selectedScore === score && (
                        <motion.div
                          layoutId="active-check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          className="absolute top-2 right-2 text-[#31694E]"
                        >
                          <CheckCircle size={16} fill="currentColor" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <ScoreIcon
                      size={20}
                      className={`transition-colors ${selectedScore === score ? "text-[#31694E]" : "text-[#F0E491] group-hover:text-white"}`}
                    />
                    <span className="text-base md:text-lg font-bold">
                      {score}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#658C58]/20 to-transparent pointer-events-none"></div>
              <div className="text-left w-full md:w-auto relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[#BBC863] text-xs md:text-sm uppercase tracking-widest font-bold opacity-90">
                    Your Estimated Funding
                  </span>
                  <motion.span
                    key={selectedScore}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-4 py-1.5 rounded-full bg-[#1E3F30] backdrop-blur-sm text-xs md:text-sm text-[#F0E491] font-bold shadow-lg border border-[#F0E491]/20 flex items-center gap-2"
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: fundingMap[selectedScore].color,
                      }}
                    ></span>
                    {fundingMap[selectedScore].label}
                  </motion.span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedScore}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <p className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
                      {fundingMap[selectedScore].range}
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="h-1.5 rounded-full mt-4 overflow-hidden"
                      style={{
                        background: `linear-gradient(to right, ${fundingMap[selectedScore].color}, transparent)`,
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="w-full md:w-auto relative z-10">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => navigate("/wizard")}
                    className="w-full md:w-auto bg-[#F0E491] text-[#31694E] hover:bg-white border-2 border-[#F0E491] hover:border-white py-6 px-12 text-lg font-bold shadow-2xl hover:shadow-[#F0E491]/30 rounded-2xl flex items-center justify-center gap-3 group relative overflow-hidden transition-all"
                  >
                    <span className="relative z-10">Check Eligibility Now</span>
                    <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-[#BBC863] text-xs md:text-sm mt-4 text-center font-medium flex items-center justify-center gap-2"
                >
                  <Shield size={14} className="text-[#658C58]" /> No impact on
                  credit score • Secure & confidential
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
