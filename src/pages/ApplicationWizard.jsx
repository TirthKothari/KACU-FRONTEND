import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Re-defining Button here to ensure it works standalone.
// If you have it in '../components/UI', you can switch back to that import.
const Button = ({ children, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-[#00ABE4] text-white hover:bg-[#0095c8] shadow-lg shadow-[#00ABE4]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide ${className}`}
  >
    {children}
  </button>
);

const ApplicationWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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
      question: "How much does your business need?",
      type: "money",
      placeholder: "e.g. 50,000",
    },
    {
      id: "purpose",
      question: "What do you need funds for?",
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
      question: "About how long do you need funds?",
      type: "options",
      options: ["3 Months", "6 Months", "1 Year", "2 Years+"],
    },
    {
      id: "location",
      question: "Where is your business located?",
      type: "text",
      placeholder: "City, State or Zip Code",
    },
    {
      id: "creditScore",
      question: "What is your credit score?",
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
      question: "How long have you been in business?",
      type: "options",
      options: ["Less than 1 Year", "1-2 Years", "3-5 Years", "5+ Years"],
    },
    {
      id: "revenue",
      question: "What is your annual revenue?",
      type: "money",
      placeholder: "e.g. 250,000",
    },
    {
      id: "fullName",
      question: "What is your name?",
      type: "text",
      placeholder: "First and Last Name",
    },
    {
      id: "email",
      question: "What is your email address?",
      type: "email",
      placeholder: "name@company.com",
    },
    {
      id: "password",
      question: "Create a password",
      type: "password",
      placeholder: "Min. 8 characters",
    },
    {
      id: "companyName",
      question: "What is the name of your company?",
      type: "text",
      placeholder: "Legal Business Name",
    },
    {
      id: "phone",
      question: "What is your phone number?",
      type: "tel",
      placeholder: "(555) 000-0000",
    },
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // --- REDIRECT LOGIC HERE ---
      // You can also save formData to a backend/context here before redirecting
      console.log("Form Data Submitted:", formData);
      navigate("/clientdashboard");
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/"); // Go back to landing page
  };

  const handleChange = (val) => {
    setFormData({ ...formData, [questions[step].id]: val });
  };

  const currentQ = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#E9F1FA] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between shadow-sm z-20">
        <button
          onClick={handlePrev}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
        >
          <ChevronLeft />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-[#00ABE4]">Application</span>
          <span className="text-xs text-slate-400">
            Step {step + 1} of {questions.length}
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-200">
        <motion.div
          className="h-full bg-[#00ABE4]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Form Container */}
      <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="w-full max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center leading-tight">
                {currentQ.question}
              </h2>

              <div className="mb-10">
                {currentQ.type === "options" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          handleChange(opt);
                          setTimeout(handleNext, 200);
                        }}
                        className={`p-6 rounded-2xl border-2 text-lg font-medium transition-all duration-200 text-left
                          ${
                            formData[currentQ.id] === opt
                              ? "border-[#00ABE4] bg-[#00ABE4]/5 text-[#00ABE4] shadow-lg"
                              : "border-white bg-white text-slate-600 hover:border-[#00ABE4]/30 hover:shadow-md"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group focus-within:ring-2 ring-[#00ABE4]">
                    {currentQ.type === "money" && (
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                        <DollarSign size={24} />
                      </div>
                    )}
                    <input
                      type={
                        currentQ.type === "money" ? "number" : currentQ.type
                      }
                      autoFocus
                      className={`w-full bg-transparent border-none p-6 text-2xl font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none ${currentQ.type === "money" ? "pl-14" : ""}`}
                      placeholder={currentQ.placeholder}
                      value={formData[currentQ.id]}
                      onChange={(e) => handleChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                {currentQ.type !== "options" && (
                  <Button
                    onClick={handleNext}
                    disabled={!formData[currentQ.id]}
                    className="w-full md:w-auto px-12 py-4 text-lg"
                  >
                    {step === questions.length - 1
                      ? "Submit Application"
                      : "Continue"}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;
