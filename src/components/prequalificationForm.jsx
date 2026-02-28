import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  BarChart3,
  User,
  DollarSign,
  Clock,
  Loader2,
} from "lucide-react";

// Enum keys matching your Django models
const LOAN_AMOUNT_CHOICES = [
  { key: "OPTION_1", label: "under $10,000" },
  { key: "OPTION_2", label: "$10,000 - $25,000" },
  { key: "OPTION_3", label: "$25,001 - $75,000" },
  { key: "OPTION_4", label: "$75,001 - $250,000" },
  { key: "OPTION_5", label: "$250,001 - $500,000" },
  { key: "OPTION_6", label: "$500,001 - $750,000" },
  { key: "OPTION_7", label: "$750,001 - $1,000,000" },
  { key: "OPTION_8", label: "over $1,000,000" },
];

const LOAN_TERM_CHOICES = [
  { key: "TERM_1", label: "3 months" },
  { key: "TERM_2", label: "6 months" },
  { key: "TERM_3", label: "12 months" },
  { key: "TERM_4", label: "18 months" },
  { key: "TERM_5", label: "24 months" },
  { key: "TERM_6", label: "More than 24 months" },
];

const LOCATION_CHOICES = [
  { key: "USA", label: "USA" },
  { key: "CANADA", label: "CANADA" },
];

const YEARS_CHOICES = [
  { key: "TERM_1", label: "Less than 6 months" },
  { key: "TERM_2", label: "6 months to 12 months" },
  { key: "TERM_3", label: "1 year" },
  { key: "TERM_4", label: "2-3 years" },
  { key: "TERM_5", label: "3-5 years" },
  { key: "TERM_6", label: "More than 5 years" },
];

export const PreQualificationForm = () => {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loanTypes, setLoanTypes] = useState([]);

  // Accessing variable via import.meta.env
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    business_name: "",
    name: "",
    email: "",
    phone: "",
    loan_amount: "OPTION_1",
    loan_term: "TERM_1",
    business_location: "USA",
    years_in_business: "TERM_1",
    annual_revenue: "",
    loan_type: "", // Integer ID
    refernce_code: "",
  });

  // 1. Fetch Dynamic Loan Types using the PLURAL URL
  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        console.log("Fetching from: ", `${API_BASE}/loan-types/active/`);
        const response = await fetch(`${API_BASE}/loan-types/active/`);

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const result = await response.json();
        console.log("API Data Received:", result);

        if (result.success && result.data) {
          setLoanTypes(result.data);
          // Set the first available loan type as default
          if (result.data.length > 0) {
            setFormData((prev) => ({ ...prev, loan_type: result.data[0].id }));
          }
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setServerMessage("Unable to connect to server. Check your connection.");
      }
    };
    fetchLoanTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateStep = (s) => {
    const required = {
      1: ["business_name", "name", "email", "phone"],
      2: ["annual_revenue"],
      3: ["loan_type"],
      4: [],
    };
    const currentFields = required[s] || [];
    const newErrors = {};
    currentFields.forEach((f) => {
      if (!formData[f] || formData[f].toString().trim() === "")
        newErrors[f] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("--- SUBMIT TRIGGERED ---");

    // Ensure all steps are valid
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      console.error("Form is incomplete");
      setServerMessage("Please fill in all required fields.");
      return;
    }

    setStatus("submitting");

    // Format phone for Django Regex: +1XXXXXXXXXX
    const rawPhone = formData.phone.replace(/\D/g, "");
    const formattedPhone =
      rawPhone.length <= 10 ? `+1${rawPhone}` : `+${rawPhone}`;

    const payload = {
      ...formData,
      phone: formattedPhone,
      annual_revenue: parseFloat(formData.annual_revenue) || 0,
      loan_type: parseInt(formData.loan_type),
    };

    console.log("Sending Final Payload:", payload);

    try {
      const response = await fetch(`${API_BASE}/applicant/prequalification/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        console.log("SUCCESS! Rendering Success Screen...");
        setStatus("success");
      } else {
        setStatus("error");
        setServerMessage(
          data.message || "Submission failed. Please try again.",
        );
      }
    } catch (err) {
      console.error("Network Error:", err);
      setStatus("error");
      setServerMessage("Connection error. Please try again later.");
    }
  };

  if (status === "success") return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-4">
      <motion.div
        layout
        className="w-full max-w-4xl bg-[#31694E] rounded-[2rem] shadow-2xl overflow-hidden"
      >
        {/* Module Progress */}
        <div className="flex bg-black/10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 py-4 text-center text-[10px] font-black tracking-widest ${step >= i ? "text-[#F0E491]" : "text-[#BBC863]/30"}`}
            >
              MODULE 0{i}
              {step === i && (
                <div className="h-0.5 bg-[#F0E491] mt-1 mx-6 shadow-[0_0_8px_#F0E491]" />
              )}
            </div>
          ))}
        </div>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <LuxuryInput
                  label="Business Legal Name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  error={errors.business_name}
                />
                <LuxuryInput
                  label="Contact Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />
                <LuxuryInput
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                <LuxuryInput
                  label="Phone"
                  name="phone"
                  placeholder="10 Digits"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <LuxuryInput
                  label="Annual Revenue ($)"
                  name="annual_revenue"
                  type="number"
                  value={formData.annual_revenue}
                  onChange={handleInputChange}
                  error={errors.annual_revenue}
                />
                <LuxurySelect
                  label="Years in Business"
                  name="years_in_business"
                  options={YEARS_CHOICES}
                  value={formData.years_in_business}
                  onChange={handleInputChange}
                />
                <LuxurySelect
                  label="Location"
                  name="business_location"
                  options={LOCATION_CHOICES}
                  value={formData.business_location}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Reference Code"
                  name="refernce_code"
                  value={formData.refernce_code}
                  onChange={handleInputChange}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LuxurySelect
                    label="Loan Amount"
                    name="loan_amount"
                    options={LOAN_AMOUNT_CHOICES}
                    value={formData.loan_amount}
                    onChange={handleInputChange}
                  />
                  <LuxurySelect
                    label="Loan Term"
                    name="loan_term"
                    options={LOAN_TERM_CHOICES}
                    value={formData.loan_term}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#BBC863] uppercase tracking-widest">
                    Select Loan Product
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {loanTypes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, loan_type: t.id })
                        }
                        className={`p-5 rounded-2xl border text-left transition-all ${formData.loan_type === t.id ? "bg-[#F0E491] text-[#31694E] border-transparent" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}
                      >
                        <div className="text-xs font-black uppercase">
                          {t.name}
                        </div>
                        <div className="text-[10px] opacity-60 mt-1">
                          Amount: {t.amount}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <Activity size={48} className="mx-auto text-[#F0E491]" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  Review Complete
                </h2>
                <p className="text-[#BBC863] text-sm max-w-sm mx-auto">
                  Click "Finalize" to submit your pre-qualification data for
                  review.
                </p>
                {status === "error" && (
                  <p className="text-red-400 font-bold text-xs">
                    {serverMessage}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              className={`text-[#BBC863] text-[10px] font-bold uppercase tracking-widest ${step === 1 ? "invisible" : ""}`}
            >
              Back
            </button>
            <button
              onClick={
                step === 4
                  ? handleSubmit
                  : () => validateStep(step) && setStep(step + 1)
              }
              disabled={status === "submitting"}
              className="bg-[#658C58] hover:bg-[#F0E491] hover:text-[#31694E] text-white px-12 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3"
            >
              {status === "submitting" ? (
                <Loader2 className="animate-spin" size={16} />
              ) : step === 4 ? (
                "Finalize"
              ) : (
                "Continue"
              )}
              {step < 4 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Components
const LuxuryInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-[#BBC863] uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`bg-white/5 border ${error ? "border-red-500" : "border-white/10"} rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#F0E491] transition-all`}
    />
  </div>
);

const LuxurySelect = ({ label, name, value, options, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-[#BBC863] uppercase tracking-widest ml-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#F0E491] appearance-none"
    >
      {options.map((o) => (
        <option key={o.key} value={o.key} className="bg-[#31694E]">
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const SuccessScreen = () => (
  <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6 text-center">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="space-y-6"
    >
      <div className="w-24 h-24 bg-[#31694E] rounded-full flex items-center justify-center mx-auto shadow-2xl">
        <CheckCircle2 size={48} className="text-[#F0E491]" />
      </div>
      <h1 className="text-4xl font-black text-[#31694E] uppercase tracking-tighter">
        Submitted!
      </h1>
      <p className="text-[#658C58] font-bold">
        Your application has been received successfully.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#31694E] text-[#F0E491] px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl"
      >
        Apply Again
      </button>
    </motion.div>
  </div>
);
