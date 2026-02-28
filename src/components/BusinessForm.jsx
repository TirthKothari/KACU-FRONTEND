import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  FileText,
  ChevronRight,
  ShieldCheck,
  Zap,
  Landmark,
  Scale,
  Star,
  TrendingUp,
  Activity,
  Shield,
  Layers,
  CheckCircle2,
  BarChart3,
  User,
  DollarSign,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";

export const BusinessForm = () => {
  const [step, setStep] = useState(1);
  const [selectedScore, setSelectedScore] = useState("Excellent");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Base URL
  const API_URL =
    "https://kacu-backend.onrender.com/api/applicant/prequalification/";

  const [formData, setFormData] = useState({
    // Model: business_name
    legalName: "",
    // Model: name (Contact Person)
    contactName: "",
    isDBASame: true,
    dbaName: "",
    // Model: email
    email: "",
    // Model: phone
    phone: "",
    // Model: business_location
    address: "",
    city: "",
    state: "California",
    zip: "",
    website: "",
    // Model: loan_type (Sent as null/ignored as per model null=True, or mapped)
    industry: "Technology",
    // Model: years_in_business
    ownershipYears: "1-2 Years",
    taxId: "",
    // Model: annual_revenue
    annualRevenue: "$500k - $2M",
    // Model: loan_amount
    loanAmount: "$50k - $100k",
    // Model: loan_term
    loanTerm: "12 Months",
  });

  // Required fields for validation
  const requiredFields = {
    1: ["legalName", "contactName", "taxId", "phone"],
    2: ["address", "city", "state", "zip", "email"],
    3: ["annualRevenue", "ownershipYears", "loanAmount", "loanTerm"],
    4: [],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateStep = () => {
    const currentRequired = requiredFields[step];
    const newErrors = {};
    let isValid = true;

    currentRequired.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  // --- Data Transformation for Backend ---
  const transformData = () => {
    // Convert Revenue String to Float
    let revenueFloat = 0.0;
    if (formData.annualRevenue.includes("<$100k")) revenueFloat = 50000.0;
    else if (formData.annualRevenue.includes("$100k-$500k"))
      revenueFloat = 250000.0;
    else if (formData.annualRevenue.includes("$500k-$2M"))
      revenueFloat = 1000000.0;
    else if (formData.annualRevenue.includes("$2M-$10M"))
      revenueFloat = 5000000.0;
    else revenueFloat = 150000.0; // Default fallback

    // Format Phone (Remove non-digits, ensure + prefix)
    const rawPhone = formData.phone.replace(/\D/g, "");
    const formattedPhone = rawPhone.startsWith("91")
      ? `+${rawPhone}`
      : `+91${rawPhone}`;
    // Note: Model defaults to +91, adjusting logic to ensure it passes regex.
    // If user enters 10 digits, we append +91 or +1 based on your region logic.
    // Here assuming +91 for the default model constraint.

    return {
      business_name: formData.legalName,
      name: formData.contactName,
      email: formData.email,
      phone: formattedPhone.slice(0, 15), // Ensure max length
      business_location: formData.state, // Mapping state to location choice
      years_in_business: formData.ownershipYears,
      annual_revenue: revenueFloat,
      loan_amount: formData.loanAmount,
      loan_term: formData.loanTerm,
      // Sending null for relations usually requires ID, skipping if optional or sending defaults
      // refernce_code: "",
    };
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setStatus("submitting");

    const payload = transformData();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setServerMessage(data.message || "Prequalification submitted!");
        // Optional: Redirect
        // window.location.href = "/dashboard";
      } else {
        setStatus("error");
        console.error("Validation Errors:", data);
        setServerMessage(
          data.message || "Validation failed. Please check inputs.",
        );
      }
    } catch (error) {
      setStatus("error");
      setServerMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <SuccessScreen message={serverMessage} uuid={serverMessage.form_uuid} />
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 bg-[#FDFCF0] relative overflow-hidden font-sans selection:bg-[#F0E491]">
      {/* Background Decor */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#31694E 1.5px, transparent 1.5px), linear-gradient(90deg, #31694E 1.5px, transparent 1.5px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Brand Header */}
      <div className="z-10 text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-4"
        >
          <div className="px-5 py-2 rounded-full bg-white border border-[#BBC863] shadow-sm flex items-center gap-2 text-[10px] font-bold text-[#31694E] uppercase tracking-[0.3em]">
            <Zap size={12} className="text-[#BBC863] fill-[#BBC863]" />
            Capital Entry Portal
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#31694E] mb-2 leading-none">
          Pre<span className="text-[#658C58]">Qualification</span>
        </h1>
      </div>

      {/* Main Container */}
      <motion.div
        layout
        className="z-10 w-full max-w-7xl bg-[#31694E] rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(49,105,78,0.4)] overflow-hidden relative border border-[#658C58]/30"
      >
        {/* Step Indicator */}
        <div className="flex bg-[#0A1A12]/20 border-b border-[#BBC863]/20">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 py-5 flex flex-col items-center relative transition-colors duration-500"
            >
              <span
                className={`text-[9px] font-black uppercase tracking-[0.3em] ${step >= i ? "text-[#F0E491]" : "text-[#BBC863]/40"}`}
              >
                Module 0{i}
              </span>
              {step === i && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute bottom-0 w-full h-[3px] bg-[#F0E491] shadow-[0_0_15px_#F0E491]"
                />
              )}
            </div>
          ))}
        </div>

        <form
          className="p-8 md:p-12 relative min-h-[500px]"
          onSubmit={(e) => e.preventDefault()}
        >
          <AnimatePresence mode="wait">
            {/* MODULE 1: IDENTITY */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div className="flex flex-col lg:flex-row items-center justify-between p-6 bg-[#658C58]/10 border border-[#BBC863]/20 rounded-2xl gap-8">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Scale size={18} className="text-[#F0E491]" />
                      Legal Entity Confirmation
                    </h3>
                    <p className="text-[#BBC863] text-xs mt-1">
                      Is your DBA name identical to your Legal Registered name?
                    </p>
                  </div>
                  <div className="flex p-1 bg-[#0A1A12]/30 rounded-xl border border-[#BBC863]/10">
                    {["Yes", "No"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, isDBASame: opt === "Yes" })
                        }
                        className={`px-10 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${(opt === "Yes") === formData.isDBASame ? "bg-[#F0E491] text-[#31694E]" : "text-[#BBC863]/50"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LuxuryInput
                    label="Authorized Contact Name"
                    icon={<User />}
                    name="contactName"
                    value={formData.contactName}
                    error={errors.contactName}
                    placeholder="Full Legal Name"
                    onChange={handleInputChange}
                  />
                  <LuxuryInput
                    label="Direct Phone (Mobile)"
                    icon={<Phone />}
                    name="phone"
                    value={formData.phone}
                    error={errors.phone}
                    placeholder="9000000000"
                    onChange={handleInputChange}
                  />
                  <LuxuryInput
                    label="Legal Business Name"
                    icon={<Building2 />}
                    name="legalName"
                    value={formData.legalName}
                    error={errors.legalName}
                    placeholder="Registered Entity Name"
                    onChange={handleInputChange}
                  />
                  <LuxuryInput
                    label="Tax ID (EIN)"
                    icon={<Landmark />}
                    name="taxId"
                    value={formData.taxId}
                    error={errors.taxId}
                    placeholder="XX-XXXXXXX"
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>
            )}

            {/* MODULE 2: LOCATION & CONTACT */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <LuxuryInput
                  label="Corporate Email"
                  icon={<Mail />}
                  name="email"
                  value={formData.email}
                  error={errors.email}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Web URL"
                  icon={<Globe />}
                  name="website"
                  value={formData.website}
                  error={errors.website}
                  placeholder="www.company.com"
                  onChange={handleInputChange}
                />
                <LuxurySelect
                  label="State"
                  name="state"
                  value={formData.state}
                  options={[
                    "California",
                    "New York",
                    "Texas",
                    "Florida",
                    "Illinois",
                    "Maharashtra",
                    "Delhi",
                  ]}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Physical Address"
                  icon={<MapPin />}
                  name="address"
                  value={formData.address}
                  error={errors.address}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="City"
                  name="city"
                  value={formData.city}
                  error={errors.city}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Zip / Postal Code"
                  name="zip"
                  value={formData.zip}
                  error={errors.zip}
                  onChange={handleInputChange}
                />
              </motion.div>
            )}

            {/* MODULE 3: FINANCIALS & TERMS */}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <LuxurySelect
                  label="Annual Revenue"
                  icon={<BarChart3 />}
                  name="annualRevenue"
                  value={formData.annualRevenue}
                  options={["<$100k", "$100k-$500k", "$500k-$2M", "$2M-$10M+"]}
                  onChange={handleInputChange}
                />
                <LuxurySelect
                  label="Time in Business"
                  icon={<Calendar />}
                  name="ownershipYears"
                  value={formData.ownershipYears}
                  options={["< 1 Year", "1-2 Years", "3-5 Years", "5+ Years"]}
                  onChange={handleInputChange}
                />
                <LuxurySelect
                  label="Requested Loan Amount"
                  icon={<DollarSign />}
                  name="loanAmount"
                  value={formData.loanAmount}
                  options={[
                    "$10k - $50k",
                    "$50k - $100k",
                    "$100k - $500k",
                    "$500k+",
                  ]}
                  onChange={handleInputChange}
                />
                <LuxurySelect
                  label="Preferred Term"
                  icon={<Clock />}
                  name="loanTerm"
                  value={formData.loanTerm}
                  options={["6 Months", "12 Months", "24 Months", "36 Months"]}
                  onChange={handleInputChange}
                />
              </motion.div>
            )}

            {/* MODULE 4: SUBMISSION & SCORING */}
            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Credit Score Selector (Visual Only) */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {["Excellent", "Great", "Good", "Fair", "Poor"].map(
                    (label, idx) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedScore(label)}
                        className={`relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border
                        ${
                          selectedScore === label
                            ? "bg-[#F0E491] border-transparent shadow-[0_10px_30px_rgba(240,228,145,0.2)]"
                            : "bg-[#658C58]/10 border-[#BBC863]/10 hover:bg-[#658C58]/20"
                        }`}
                      >
                        <div
                          className={`mb-2 transition-colors ${selectedScore === label ? "text-[#31694E]" : "text-[#BBC863]"}`}
                        >
                          <Activity size={18} />
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest ${selectedScore === label ? "text-[#31694E]" : "text-white"}`}
                        >
                          {label}
                        </span>
                      </button>
                    ),
                  )}
                </div>

                <div className="bg-[#0A1A12]/30 border border-[#BBC863]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BBC863] text-[#31694E] text-[8px] font-black uppercase tracking-widest">
                      <Zap size={10} fill="currentColor" />
                      Estimated Qualification
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter">
                      {selectedScore === "Excellent" ? "$5.0M+" : "$500K+"}
                    </h2>
                    <p className="text-[#BBC863] text-xs font-medium opacity-80">
                      Based on revenue of {formData.annualRevenue}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    {status === "error" && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs flex items-center gap-2">
                        <AlertCircle size={14} /> {serverMessage}
                      </div>
                    )}
                    <QualificationPill
                      icon={
                        <ShieldCheck size={14} className="text-[#F0E491]" />
                      }
                      text="256-Bit SSL Secured"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="mt-12 pt-6 border-t border-[#BBC863]/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#BBC863]" />
              <p className="text-[8px] font-bold text-[#BBC863] uppercase tracking-[0.2em]">
                Kacu Financial LLC © 2026
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-4 rounded-xl text-[#BBC863]/60 hover:text-[#F0E491] font-black text-[9px] uppercase tracking-widest transition-all"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                disabled={status === "submitting"}
                onClick={step < 4 ? handleNext : handleSubmit}
                className={`flex-1 md:flex-none flex items-center justify-center gap-4 px-12 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all
                  ${status === "submitting" ? "bg-[#658C58] opacity-80 cursor-wait" : "bg-[#658C58] text-white hover:bg-[#BBC863] hover:text-[#31694E] shadow-lg"}`}
              >
                {status === "submitting" ? (
                  <>
                    Processing <Loader2 className="animate-spin" size={14} />
                  </>
                ) : step === 4 ? (
                  "Submit Application"
                ) : (
                  "Next Step"
                )}
                {step !== 4 && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Reusable Components with Theme ---

const SuccessScreen = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFCF0] text-[#31694E]">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center space-y-4"
    >
      <div className="w-20 h-20 bg-[#658C58] rounded-full flex items-center justify-center mx-auto shadow-xl">
        <CheckCircle2 size={40} className="text-[#F0E491]" />
      </div>
      <h2 className="text-3xl font-black">Success</h2>
      <p className="text-[#658C58]">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 text-sm font-bold underline decoration-[#BBC863]"
      >
        Start New Application
      </button>
    </motion.div>
  </div>
);

const LuxuryInput = ({
  label,
  icon,
  name,
  disabled,
  value,
  placeholder,
  onChange,
  error,
}) => (
  <div
    className={`space-y-2 group transition-opacity ${disabled ? "opacity-50 pointer-events-none" : "opacity-100"}`}
  >
    <label
      className={`text-[9px] font-black uppercase tracking-widest px-1 transition-colors ${error ? "text-red-400" : "text-[#BBC863]"}`}
    >
      {label} {error && "• Required"}
    </label>
    <div className="relative">
      {icon && (
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? "text-red-400" : "text-[#BBC863]/40 group-focus-within:text-[#F0E491]"}`}
        >
          {React.cloneElement(icon, { size: 16 })}
        </div>
      )}
      <input
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-[#0A1A12]/30 border rounded-xl py-4 ${icon ? "pl-12" : "pl-5"} pr-5 outline-none text-[12px] font-bold text-white placeholder-white/20 transition-all
          ${error ? "border-red-400/50 bg-red-400/5" : "border-[#BBC863]/10 focus:border-[#F0E491]/50 focus:bg-[#0A1A12]/50"}`}
      />
    </div>
  </div>
);

const LuxurySelect = ({ label, icon, name, value, options, onChange }) => (
  <div className="space-y-2 group">
    <label className="text-[9px] font-black text-[#BBC863] uppercase tracking-widest px-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BBC863]/40 group-focus-within:text-[#F0E491]">
          {React.cloneElement(icon, { size: 16 })}
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-[#0A1A12]/30 border border-[#BBC863]/10 rounded-xl py-4 pl-12 pr-10 outline-none focus:border-[#F0E491]/50 text-[12px] font-bold text-white cursor-pointer transition-all hover:bg-[#0A1A12]/50"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#31694E] text-white">
            {o}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#BBC863]/40">
        <AlertCircle size={14} className="rotate-180" />
      </div>
    </div>
  </div>
);

const QualificationPill = ({ icon, text }) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#0A1A12]/40 border border-[#BBC863]/10 backdrop-blur-md">
    {icon}
    <span className="text-[8px] font-black text-white uppercase tracking-widest">
      {text}
    </span>
  </div>
);
