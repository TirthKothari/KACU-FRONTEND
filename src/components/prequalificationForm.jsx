import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Activity,
  CheckCircle2,
  Loader2,
  Shield,
  Lock,
  ArrowRight,
} from "lucide-react";
import.meta.env;

// --- Constants ---
const LOAN_AMOUNT_CHOICES = [
  { key: "OPTION_1", label: "under $10,000" },
  { key: "OPTION_2", label: "$10,000 – $25,000" },
  { key: "OPTION_3", label: "$25,001 – $75,000" },
  { key: "OPTION_4", label: "$75,001 – $250,000" },
  { key: "OPTION_5", label: "$250,001 – $500,000" },
  { key: "OPTION_6", label: "$500,001 – $750,000" },
  { key: "OPTION_7", label: "$750,001 – $1,000,000" },
  { key: "OPTION_8", label: "over $1,000,000" },
];

const YEARS_CHOICES = [
  { key: "TERM_1", label: "Less than 6 months" },
  { key: "TERM_2", label: "6 – 12 months" },
  { key: "TERM_3", label: "1 year" },
  { key: "TERM_4", label: "2 – 3 years" },
  { key: "TERM_5", label: "3 – 5 years" },
  { key: "TERM_6", label: "More than 5 years" },
];

const STEP_LABELS = ["Contact", "Business", "Funding", "Review", "Security"];

// --- Main Component ---
export const PreQualificationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loanTypes, setLoanTypes] = useState([]);
  const [capturedUuid, setCapturedUuid] = useState(null);
  const [regPassword, setRegPassword] = useState("");

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
    loan_type: "",
    refernce_code: "",
  });

  useEffect(() => {
    fetch(`${API_BASE}/loan-types/active/`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setLoanTypes(result.data);
          if (result.data.length > 0)
            setFormData((p) => ({ ...p, loan_type: result.data[0].id }));
        }
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  };

  // Fixed Validation Function
  const validateStep = (s) => {
    const req = {
      1: ["business_name", "name", "email", "phone"],
      2: ["annual_revenue"],
      3: ["loan_type"],
    };
    const newErrors = {};

    (req[s] || []).forEach((f) => {
      // Safe check for trim
      const val =
        formData[f] !== null && formData[f] !== undefined
          ? String(formData[f]).trim()
          : "";
      if (!val) newErrors[f] = true;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPrequal = async () => {
    setStatus("submitting");
    const rawPhone = formData.phone.replace(/\D/g, "");
    const payload = {
      ...formData,
      phone: rawPhone.length <= 10 ? `+1${rawPhone}` : `+${rawPhone}`,
      annual_revenue: parseFloat(formData.annual_revenue) || 0,
    };

    try {
      const res = await fetch(
        `${API_BASE}/applicant/prequalification/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setCapturedUuid(data.form_uuid);
        setStep(5);
        setStatus("idle");
      } else {
        setStatus("error");
        setServerMessage(data.message || "Submission failed.");
      }
    } catch (err) {
      setStatus("error");
      setServerMessage("Network error.");
    }
  };

  const handleRegister = async () => {
    if (!regPassword) {
      setErrors({ regPassword: true });
      return;
    }

    setStatus("submitting");

    const nameParts = formData.name.trim().split(" ");
    const regPayload = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" ") || "Applicant",
      email: formData.email,
      password: regPassword,
      phone: formData.phone,
      role: "APPLICANT",
      prequalification_form_uuid: capturedUuid,
    };

    try {
      const res = await fetch(`${API_BASE}/applicant/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regPayload),
      });

      const data = await res.json(); // ✅ IMPORTANT

      if (res.ok) {
        // ✅ Save token (same as login)
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // ✅ Save user info
        if (data.user || data.username) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user || { username: data.username }),
          );
        }

        // ✅ Redirect to dashboard
        window.location.href = "/clientdashboard";

        // OR if you want to keep success screen:
        // setStatus("success");
      } else {
        setServerMessage(
          typeof data === "object"
            ? Object.values(data).join(", ")
            : "Registration failed.",
        );
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
      setServerMessage("Connection error.");
      console.error("Register Error:", err);
    }
  };

  if (status === "success") return <SuccessScreen navigate={navigate} />;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center p-4 lg:p-6 bg-white font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#F0E491] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#31694E] blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="bg-[#1E3F30] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 lg:px-12 lg:py-10 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#F0E491]/60 uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F0E491] shadow-[0_0_8px_#F0E491]" />
                {step === 5
                  ? "Identity Verification"
                  : "Secure Funding Request"}
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-none">
                {step === 5 ? "Account " : "Prequalify "}
                <span className="text-[#F0E491]">
                  {step === 5 ? "Security" : "Instantly"}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {STEP_LABELS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 <= step ? "w-8 bg-[#F0E491]" : "w-3 bg-white/10"}`}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 lg:px-12 lg:py-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <LuxuryInput
                    label="Business Name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    error={errors.business_name}
                  />
                  <LuxuryInput
                    label="Full Name"
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
                    placeholder="10 digits"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
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
                    options={[
                      { key: "USA", label: "USA" },
                      { key: "CANADA", label: "Canada" },
                    ]}
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <LuxurySelect
                      label="Desired Amount"
                      name="loan_amount"
                      options={LOAN_AMOUNT_CHOICES}
                      value={formData.loan_amount}
                      onChange={handleInputChange}
                    />
                    <LuxurySelect
                      label="Loan Term"
                      name="loan_term"
                      options={[
                        { key: "TERM_1", label: "3-12 Months" },
                        { key: "TERM_2", label: "12-24 Months" },
                      ]}
                      value={formData.loan_term}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {loanTypes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() =>
                          setFormData({ ...formData, loan_type: t.id })
                        }
                        className={`p-4 rounded-xl border transition-all text-left ${formData.loan_type === t.id ? "bg-[#F0E491]/10 border-[#F0E491]" : "bg-white/5 border-white/10"}`}
                      >
                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                          Product
                        </div>
                        <div
                          className={`font-bold text-sm ${formData.loan_type === t.id ? "text-[#F0E491]" : "text-white"}`}
                        >
                          {t.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="s4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <Activity size={48} className="text-[#F0E491] mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ready to Submit
                  </h3>
                  <p className="text-white/40 max-w-sm">
                    Review your information before continuing to your secure
                    registration.
                  </p>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="s5"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto py-4"
                >
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center space-y-6">
                    <Lock size={32} className="text-[#F0E491] mx-auto" />
                    <h3 className="text-xl font-bold text-white">
                      To register yourself enter password
                    </h3>
                    <LuxuryInput
                      label="Password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      error={errors.regPassword}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav */}
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                <Shield size={14} /> Encrypted
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  onClick={() => step > 1 && step < 5 && setStep(step - 1)}
                  className={`flex-1 md:flex-none px-6 py-4 rounded-xl font-bold text-sm ${step === 1 || step === 5 ? "hidden" : "text-white/40 hover:text-white"}`}
                >
                  Back
                </button>
                <button
                  onClick={
                    step === 4
                      ? handleSubmitPrequal
                      : step === 5
                        ? handleRegister
                        : () => validateStep(step) && setStep(step + 1)
                  }
                  disabled={status === "submitting"}
                  className="flex-1 md:flex-none px-10 py-4 bg-[#F0E491] text-[#1E3F30] rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  {status === "submitting" ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      {step === 4 ? "Submit" : step === 5 ? "Finish" : "Next"}{" "}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
            {serverMessage && (
              <p className="text-red-400 text-[11px] text-center mt-6 font-medium">
                {serverMessage}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// UI Components
const LuxuryInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) => (
  <div className="flex flex-col gap-1 w-full">
    <label
      className={`text-[9px] font-black uppercase tracking-wider ml-1 ${error ? "text-red-400" : "text-white/40"}`}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-white/5 border outline-none text-[#F0E491] transition-all ${error ? "border-red-500/50" : "border-white/10 focus:border-[#F0E491]/40"}`}
    />
  </div>
);

const LuxurySelect = ({ label, name, value, options, onChange }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-[9px] font-black uppercase tracking-wider ml-1 text-white/40">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-[#F0E491] cursor-pointer focus:border-[#F0E491]/40"
    >
      {options.map((o) => (
        <option key={o.key} value={o.key} className="bg-[#1E3F30]">
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const SuccessScreen = ({ navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => navigate("/clientdashboard"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <CheckCircle2 size={64} className="text-[#31694E] mx-auto mb-6" />
        <h1 className="text-4xl font-black text-[#1E3F30] mb-2">Success!</h1>
        <p className="text-[#1E3F30]/60 mb-8">
          Redirecting to your dashboard...
        </p>
        <Loader2 className="animate-spin text-[#31694E] mx-auto" size={32} />
      </motion.div>
    </div>
  );
};
