import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- NATURE PALETTE THEME ---
const THEME = {
  primary: "#31694E", // Deep Forest Green (Headers, Nav, Text)
  secondary: "#658C58", // Sage Green (Buttons, Interactions)
  container: "#BBC863", // Olive (Borders, Cards, Subtle details)
  highlight: "#F0E491", // Pale Cream (Accents, Icons, Glows)

  bg: "#FAFAF8", // Warm Off-White (Page Background)
  cardBg: "#FFFFFF", // Pure White (Content Area)
};

// --- COMPONENT: BRANDED BUTTON ---
const Button = ({
  children,
  onClick,
  disabled,
  className = "",
  variant = "primary",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle =
    "px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";

  const buttonStyle =
    variant === "primary"
      ? {
          backgroundColor: isHovered ? THEME.primary : THEME.secondary,
          color: "#FFFFFF",
          boxShadow: isHovered
            ? `0 10px 30px -5px ${THEME.secondary}60`
            : `0 5px 15px -5px ${THEME.secondary}40`,
        }
      : {
          color: THEME.primary,
          backgroundColor: isHovered ? `${THEME.highlight}50` : "transparent",
          boxShadow: "none",
          border: `1px solid ${THEME.container}`,
        };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonStyle}
      className={`${baseStyle} ${className}`}
    >
      {children}
    </button>
  );
};

// --- COMPONENT: SUCCESS VIEW (Nature Style) ---
const SuccessView = ({ onComplete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center text-center p-8 h-full w-full max-w-md mx-auto"
  >
    {/* Animated Icon */}
    <div className="relative mb-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className="absolute inset-0 rounded-full opacity-30"
        style={{ backgroundColor: THEME.container }}
      />
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl relative z-10 border-4 border-white"
        style={{ backgroundColor: THEME.highlight }}
      >
        <ShieldCheck size={48} color={THEME.primary} strokeWidth={1.5} />
      </div>
    </div>

    <h2
      className="text-3xl font-extrabold mb-2"
      style={{ color: THEME.primary }}
    >
      Application Received
    </h2>
    <p
      className="mb-8 leading-relaxed text-sm font-medium opacity-80"
      style={{ color: THEME.secondary }}
    >
      Your request has been securely received by our underwriting team.
    </p>

    {/* Status Badge */}
    <div
      className="rounded-xl p-4 w-full mb-8 border flex items-center gap-4 bg-[#F0E491]/10"
      style={{ borderColor: THEME.container }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${THEME.secondary}20` }}
      >
        <CheckCircle2 size={20} color={THEME.secondary} />
      </div>
      <div className="text-left">
        <div
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: THEME.container }}
        >
          Status
        </div>
        <div className="text-sm font-bold" style={{ color: THEME.primary }}>
          Pre-Approved
        </div>
      </div>
    </div>

    <Button onClick={onComplete} className="w-full">
      Go to Dashboard <ArrowRight size={18} />
    </Button>
  </motion.div>
);

const ApplicationWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    duration: "",
    location: "",
    creditScore: "",
    businessAge: "",
    revenue: "",
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
  });

  const questions = [
    {
      id: "amount",
      question: "Capital Request",
      subtext: "How much funding does your business require?",
      type: "money",
      placeholder: "50,000",
    },
    {
      id: "purpose",
      question: "Use of Funds",
      subtext: "What is the primary objective for this capital?",
      type: "options",
      options: [
        "Expansion",
        "Equipment",
        "Payroll",
        "Marketing",
        "Inventory",
        "Other",
      ],
    },
    {
      id: "duration",
      question: "Timeline",
      subtext: "What is your preferred repayment duration?",
      type: "options",
      options: ["3 Months", "6 Months", "1 Year", "2 Years+"],
    },
    {
      id: "location",
      question: "Location",
      subtext: "Where is your business headquartered?",
      type: "text",
      placeholder: "City, State or Zip Code",
    },
    {
      id: "creditScore",
      question: "Credit Profile",
      subtext: "What is your estimated credit score range?",
      type: "options",
      options: [
        "Excellent (720+)",
        "Good (680-719)",
        "Fair (640-679)",
        "Poor (<640)",
      ],
    },
    {
      id: "businessAge",
      question: "Business Age",
      subtext: "How long have you been operating?",
      type: "options",
      options: ["< 1 Year", "1-2 Years", "3-5 Years", "5+ Years"],
    },
    {
      id: "revenue",
      question: "Annual Revenue",
      subtext: "What is your gross annual revenue?",
      type: "money",
      placeholder: "250,000",
    },
    {
      id: "fullName",
      question: "Personal Details",
      subtext: "What is your full legal name?",
      type: "text",
      placeholder: "John Doe",
    },
    {
      id: "email",
      question: "Contact Email",
      subtext: "Where should we send your offer?",
      type: "email",
      placeholder: "name@company.com",
    },
    {
      id: "password",
      question: "Security",
      subtext: "Create a secure password for your account.",
      type: "password",
      placeholder: "••••••••",
    },
    {
      id: "companyName",
      question: "Company Name",
      subtext: "What is the legal name of your entity?",
      type: "text",
      placeholder: "Acme Corp LLC",
    },
    {
      id: "phone",
      question: "Phone Number",
      subtext: "Best number to reach you instantly.",
      type: "tel",
      placeholder: "(555) 000-0000",
    },
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Form Data Submitted:", formData);
      setIsSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/");
  };

  const handleChange = (val) => {
    setFormData({ ...formData, [questions[step].id]: val });
  };

  const currentQ = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-['Manrope',sans-serif] p-4 relative overflow-hidden"
      style={{ backgroundColor: THEME.bg }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');`}
      </style>

      {/* Decorative Organic Blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[80px] opacity-20 pointer-events-none"
        style={{ backgroundColor: THEME.container }}
      ></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: THEME.secondary }}
      ></div>

      {/* Main Card */}
      <div
        className="relative z-10 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[650px] border"
        style={{
          backgroundColor: THEME.cardBg,
          borderColor: `${THEME.container}40`,
          boxShadow: `0 20px 60px -15px rgba(49, 105, 78, 0.15)`, // Deep green shadow hint
        }}
      >
        {isSubmitted ? (
          <div className="w-full flex items-center justify-center p-8">
            <SuccessView onComplete={() => navigate("/clientdashboard")} />
          </div>
        ) : (
          <>
            {/* Sidebar (Left) - Deep Forest Green */}
            <div
              className="w-full md:w-1/3 p-10 flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: THEME.primary }}
            >
              {/* Texture overlay for sidebar */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F0E491_1px,transparent_1px)] [background-size:20px_20px]"></div>

              <div className="relative z-10">
                <div
                  className="flex items-center gap-2 mb-10 cursor-pointer group w-fit"
                  onClick={handlePrev}
                >
                  <div className="p-2 rounded-full border transition-all duration-300 bg-white/10 border-white/20 group-hover:bg-white group-hover:text-[#31694E] text-white">
                    <ChevronLeft size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#BBC863] group-hover:text-[#F0E491] transition-colors">
                    Go Back
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold text-white mb-4">
                  Application
                </h1>
                <p className="text-[#BBC863] text-sm leading-relaxed font-medium">
                  Let's grow your business together. Complete the steps to
                  unlock funding.
                </p>
              </div>

              <div className="relative z-10 mt-8 md:mt-0">
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-white/80">
                  <span>Progress</span>
                  <span style={{ color: THEME.highlight }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-black/20">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: THEME.highlight }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
                <div className="mt-4 text-xs text-white/60 font-medium">
                  Step {step + 1} of {questions.length}
                </div>
              </div>
            </div>

            {/* Content Section (Right) - White with Olive details */}
            <div className="w-full md:w-2/3 p-8 md:p-16 flex flex-col justify-center relative bg-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full justify-center max-w-xl mx-auto w-full"
                >
                  {/* Header */}
                  <div className="mb-10">
                    <h2
                      className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight"
                      style={{ color: THEME.primary }}
                    >
                      {currentQ.question}
                    </h2>
                    <p
                      className="text-lg font-medium"
                      style={{ color: THEME.secondary }}
                    >
                      {currentQ.subtext}
                    </p>
                  </div>

                  {/* Input Area */}
                  <div className="flex-grow flex flex-col justify-center mb-8 min-h-[180px]">
                    {currentQ.type === "options" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQ.options.map((opt) => {
                          const isSelected = formData[currentQ.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                handleChange(opt);
                                setTimeout(handleNext, 150);
                              }}
                              className={`group relative p-5 rounded-2xl text-left transition-all duration-300 border-2
                                        ${
                                          isSelected
                                            ? "text-white shadow-lg translate-y-[-2px]"
                                            : "bg-white text-[#31694E] hover:border-[#658C58] hover:bg-[#F0E491]/10"
                                        }`}
                              style={{
                                borderColor: isSelected
                                  ? THEME.secondary
                                  : `${THEME.container}50`,
                                backgroundColor: isSelected
                                  ? THEME.secondary
                                  : undefined,
                              }}
                            >
                              <span className="font-bold">{opt}</span>
                              {isSelected && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F0E491] flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4 text-[#31694E]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="relative group">
                        <input
                          type={
                            currentQ.type === "money" ? "number" : currentQ.type
                          }
                          autoFocus
                          className="w-full bg-[#FAFAF8] border-2 rounded-2xl py-5 text-2xl font-bold placeholder:text-[#BBC863]/60 focus:outline-none transition-all"
                          style={{
                            color: THEME.primary,
                            borderColor: `${THEME.container}50`,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = THEME.secondary;
                            e.target.style.boxShadow = `0 10px 30px -10px ${THEME.secondary}30`;
                            e.target.style.backgroundColor = "#FFFFFF";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${THEME.container}50`;
                            e.target.style.boxShadow = "none";
                            e.target.style.backgroundColor = "#FAFAF8";
                          }}
                          placeholder={currentQ.placeholder}
                          value={formData[currentQ.id]}
                          onChange={(e) => handleChange(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleNext()}
                        />

                        {currentQ.type === "money" && (
                          <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#BBC863]" />
                        )}
                        {currentQ.type === "money" && (
                          <style>{`input[type="number"] { padding-left: 3.5rem; }`}</style>
                        )}
                        {currentQ.type !== "money" && (
                          <style>{`input { padding-left: 1.5rem; }`}</style>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-[#BBC863]/20">
                    <span
                      className="text-sm font-semibold opacity-60 hidden sm:block"
                      style={{ color: THEME.primary }}
                    >
                      Press{" "}
                      <strong style={{ color: THEME.secondary }}>Enter</strong>{" "}
                      ↵
                    </span>

                    {currentQ.type !== "options" && (
                      <Button
                        onClick={handleNext}
                        disabled={!formData[currentQ.id]}
                        className="w-full sm:w-auto"
                      >
                        {step === questions.length - 1
                          ? "Submit Application"
                          : "Continue"}
                        <ArrowRight size={18} />
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationWizard;
