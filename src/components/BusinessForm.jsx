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
  HelpCircle,
  BarChart3,
  Database,
  AlertCircle,
} from "lucide-react";

export const BusinessForm = () => {
  const [step, setStep] = useState(1);
  const [selectedScore, setSelectedScore] = useState("Excellent");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    isDBASame: true,
    legalName: "",
    dbaName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "California",
    zip: "",
    website: "",
    industry: "Technology",
    entityType: "LLC",
    ownershipYears: "",
    taxId: "",
    annualRevenue: "$500k - $2M",
  });

  // Definition of required fields per step
  const requiredFields = {
    1: ["legalName", "taxId", "entityType"],
    2: ["address", "city", "state", "zip", "email", "website"],
    3: ["annualRevenue", "ownershipYears", "industry", "phone"],
    4: [], // Credit score is pre-selected
  };

  if (!formData.isDBASame) requiredFields[1].push("dbaName");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
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
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    // Simulate API logic
    setTimeout(() => {
      console.log("Transmission Complete", {
        ...formData,
        creditScore: selectedScore,
      });
      window.location.href = "/wizard";
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 bg-[#FDFCF0] relative overflow-hidden font-sans selection:bg-[#F0E491]">
      {/* Background Decor */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#31694E 1.5px, transparent 1.5px), linear-gradient(90deg, #31694E 1.5px, transparent 1.5px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#31694E] rounded-full blur-[180px] opacity-[0.06]" />

      {/* Brand Header */}
      <div className="z-10 text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-3"
        >
          <div className="px-4 py-1.5 rounded-full bg-white border border-[#BBC863]/30 shadow-sm flex items-center gap-2 text-[9px] font-bold text-[#31694E] uppercase tracking-[0.4em]">
            <Database size={12} className="text-[#658C58]" />
            Official Capital Entry Portal
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1A2E23] mb-2 leading-none">
          Business <span className="text-[#31694E]">Verification</span>
        </h1>
      </div>

      {/* Main Container */}
      <motion.div
        layout
        className="z-10 w-full max-w-7xl bg-[#0D1A14] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative"
      >
        {/* Step Indicator Top Bar */}
        <div className="flex bg-black/40 border-b border-white/5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 py-4 flex flex-col items-center relative transition-colors duration-500"
            >
              <span
                className={`text-[8px] font-black uppercase tracking-[0.3em] ${step >= i ? "text-[#F0E491]" : "text-white/20"}`}
              >
                Module 0{i}
              </span>
              {step === i && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute bottom-0 w-full h-[2px] bg-[#F0E491] shadow-[0_0_10px_#F0E491]"
                />
              )}
            </div>
          ))}
        </div>

        <form
          className="p-8 md:p-12 relative"
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
                className="space-y-10"
              >
                <div className="flex flex-col lg:flex-row items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl gap-8">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Scale size={18} className="text-[#F0E491]" />
                      Legal Entity Confirmation
                    </h3>
                    <p className="text-[#658C58] text-xs mt-1">
                      Is your DBA name identical to your Legal Registered name?
                    </p>
                  </div>
                  <div className="flex p-1 bg-black/40 rounded-xl border border-white/10">
                    {["Yes", "No"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, isDBASame: opt === "Yes" })
                        }
                        className={`px-10 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${(opt === "Yes") === formData.isDBASame ? "bg-[#F0E491] text-[#0A1A12]" : "text-white/30"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <LuxuryInput
                    label="Legal Business Name"
                    icon={<Building2 />}
                    name="legalName"
                    value={formData.legalName}
                    error={errors.legalName}
                    placeholder="Corp Name"
                    onChange={handleInputChange}
                  />
                  <LuxuryInput
                    label="Trading DBA Name"
                    icon={<FileText />}
                    name="dbaName"
                    value={formData.dbaName}
                    disabled={formData.isDBASame}
                    error={errors.dbaName}
                    placeholder="DBA Name"
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
                  <LuxurySelect
                    label="Entity Type"
                    icon={<Layers />}
                    name="entityType"
                    value={formData.entityType}
                    options={["LLC", "S-Corp", "C-Corp", "Partnership"]}
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>
            )}

            {/* MODULE 2: OPERATIONS */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
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
                <LuxurySelect
                  label="State"
                  name="state"
                  value={formData.state}
                  options={[
                    "California",
                    "Delaware",
                    "Texas",
                    "New York",
                    "Florida",
                  ]}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Zip Code"
                  name="zip"
                  value={formData.zip}
                  error={errors.zip}
                  onChange={handleInputChange}
                />
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
              </motion.div>
            )}

            {/* MODULE 3: FINANCIALS */}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <LuxurySelect
                  label="Annual Revenue"
                  icon={<BarChart3 />}
                  name="annualRevenue"
                  value={formData.annualRevenue}
                  options={["<$100k", "$100k-$500k", "$500k-$2M", "$2M-$10M+"]}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Years Active"
                  icon={<Calendar />}
                  name="ownershipYears"
                  value={formData.ownershipYears}
                  error={errors.ownershipYears}
                  placeholder="Years"
                  onChange={handleInputChange}
                />
                <LuxurySelect
                  label="Primary Industry"
                  icon={<Briefcase />}
                  name="industry"
                  value={formData.industry}
                  options={["Technology", "Retail", "Logistics", "Healthcare"]}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Direct Business Line"
                  icon={<Phone />}
                  name="phone"
                  value={formData.phone}
                  error={errors.phone}
                  placeholder="+1 (555) 000-0000"
                  onChange={handleInputChange}
                />
              </motion.div>
            )}

            {/* MODULE 4: TIER MATCHING */}
            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {["Excellent", "Great", "Good", "Fair", "Poor"].map(
                    (label, idx) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedScore(label)}
                        className={`relative flex flex-col items-center justify-center p-8 rounded-2xl transition-all duration-300 border
                        ${
                          selectedScore === label
                            ? "bg-[#F0E491] border-transparent shadow-[0_10px_30px_rgba(240,228,145,0.2)]"
                            : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`mb-2 transition-colors ${selectedScore === label ? "text-[#31694E]" : "text-[#658C58]"}`}
                        >
                          {idx === 0 ? (
                            <Star size={18} />
                          ) : idx === 1 ? (
                            <TrendingUp size={18} />
                          ) : (
                            <Activity size={18} />
                          )}
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

                <div className="bg-[#31694E]/10 border border-[#658C58]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#31694E] text-[#F0E491] text-[8px] font-black uppercase tracking-widest">
                      <Zap size={10} fill="currentColor" /> System Qualified
                      Allocation
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                      {selectedScore === "Excellent" ? "$5.0M+" : "$500K+"}
                    </h2>
                    <p className="text-[#658C58] text-xs font-medium opacity-80">
                      Verified capacity match for {selectedScore} credit
                      profiles.
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col gap-3">
                    <QualificationPill
                      icon={
                        <ShieldCheck size={14} className="text-[#F0E491]" />
                      }
                      text="Bank-Grade Encryption"
                    />
                    <QualificationPill
                      icon={
                        <CheckCircle2 size={14} className="text-[#BBC863]" />
                      }
                      text="Tier 1 Matching"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#658C58]" />
              <p className="text-[8px] font-bold text-[#658C58] uppercase tracking-[0.2em]">
                All information is mandatory for system assessment.
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-10 py-4 rounded-xl text-white/50 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={step < 4 ? handleNext : handleSubmit}
                className={`flex-1 md:flex-none flex items-center justify-center gap-4 px-16 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all
                  ${isSubmitting ? "bg-white/10 text-white/20" : "bg-[#F0E491] text-[#0A1A12] hover:shadow-[0_0_20px_rgba(240,228,145,0.3)]"}`}
              >
                {isSubmitting
                  ? "Processing..."
                  : step === 4
                    ? "Complete Submission"
                    : "Next Phase"}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <p className="mt-6 text-[8px] text-[#31694E]/50 uppercase font-bold tracking-widest">
        Kacu Financial LLC © 2024 • Secured by Bank-Grade AES-256
      </p>
    </div>
  );
};

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
    className={`space-y-2 group transition-opacity ${disabled ? "opacity-20 pointer-events-none" : "opacity-100"}`}
  >
    <label
      className={`text-[9px] font-black uppercase tracking-widest px-1 transition-colors ${error ? "text-red-400" : "text-[#658C58]"}`}
    >
      {label} {error && "• Required"}
    </label>
    <div className="relative">
      {icon && (
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? "text-red-400" : "text-white/20 group-focus-within:text-[#F0E491]"}`}
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
        className={`w-full bg-white/[0.02] border rounded-xl py-4 ${icon ? "pl-12" : "pl-5"} pr-5 outline-none text-[12px] font-bold text-white transition-all
          ${error ? "border-red-400/50 bg-red-400/5" : "border-white/5 focus:border-[#F0E491]/30 focus:bg-white/[0.05]"}`}
      />
    </div>
  </div>
);

const LuxurySelect = ({ label, icon, name, value, options, onChange }) => (
  <div className="space-y-2 group">
    <label className="text-[9px] font-black text-[#658C58] uppercase tracking-widest px-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#F0E491]">
          {React.cloneElement(icon, { size: 16 })}
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-10 outline-none focus:border-[#F0E491]/30 text-[12px] font-bold text-white cursor-pointer transition-all"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0D1A14]">
            {o}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
        <AlertCircle size={14} className="rotate-180" />
      </div>
    </div>
  </div>
);

const QualificationPill = ({ icon, text }) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
    {icon}
    <span className="text-[8px] font-black text-white uppercase tracking-widest">
      {text}
    </span>
  </div>
);
