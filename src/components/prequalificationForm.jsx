import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  Loader2,
  Shield,
  Lock,
  ArrowRight,
  Building2,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  MapPin,
  Tag,
  Clock,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  Hash,
  X,
} from "lucide-react";

// ─── Cookie Utilities ─────────────────────────────────────────────────────────

const CookieManager = {
  set(name, value, days = 1) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = [
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
      `expires=${expires}`,
      "path=/",
      "SameSite=Strict",
      // "Secure", // Uncomment in production (requires HTTPS)
    ].join("; ");
  },

  get(name) {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  },

  remove(name) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`;
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const LOAN_AMOUNT_CHOICES = [
  { key: "OPTION_1", label: "Under $10,000" },
  { key: "OPTION_2", label: "$10,000 – $25,000" },
  { key: "OPTION_3", label: "$25,001 – $75,000" },
  { key: "OPTION_4", label: "$75,001 – $250,000" },
  { key: "OPTION_5", label: "$250,001 – $500,000" },
  { key: "OPTION_6", label: "$500,001 – $750,000" },
  { key: "OPTION_7", label: "$750,001 – $1,000,000" },
  { key: "OPTION_8", label: "Over $1,000,000" },
];

const YEARS_CHOICES = [
  { key: "TERM_1", label: "Less than 6 months" },
  { key: "TERM_2", label: "6 – 12 months" },
  { key: "TERM_3", label: "1 year" },
  { key: "TERM_4", label: "2 – 3 years" },
  { key: "TERM_5", label: "3 – 5 years" },
  { key: "TERM_6", label: "More than 5 years" },
];

const STEP_CONFIG = [
  { label: "Contact", icon: User },
  { label: "Business", icon: Building2 },
  { label: "Funding", icon: DollarSign },
  { label: "Review", icon: Activity },
  { label: "Security", icon: Lock },
];

const EMPTY_FORM = {
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
  reference_code: "", // ✅ Fixed typo: was refernce_code
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const PreQualificationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loanTypes, setLoanTypes] = useState([]);
  const [capturedUuid, setCapturedUuid] = useState(null);
  const [regPassword, setRegPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetch(`${API_BASE}/loan-types/active/`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setLoanTypes(result.data);
          if (result.data.length > 0)
            setFormData((p) => ({ ...p, loan_type: result.data[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  };

  const validateStep = (s) => {
    const req = {
      1: ["business_name", "name", "email", "phone"],
      2: ["annual_revenue"],
      3: ["loan_type"],
    };
    const newErrors = {};
    (req[s] || []).forEach((f) => {
      const val =
        formData[f] !== null && formData[f] !== undefined
          ? String(formData[f]).trim()
          : "";
      if (!val) newErrors[f] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── 1. Pre-Qualification Submission ──────────────────────────────────────────
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
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Store JWT in a secure cookie — NOT localStorage
        if (data.token) {
          CookieManager.set("kacu_auth_token", data.token, 1);
        }
        setCapturedUuid(data.form_uuid);
        setStep(5);
        setStatus("idle");
      } else {
        setStatus("error");
        setServerMessage(data.message || "Submission failed.");
      }
    } catch {
      setStatus("error");
      setServerMessage("Network error. Please try again.");
    }
  };

  // ── 2. Registration ───────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!regPassword) {
      setErrors({ regPassword: true });
      return;
    }
    setStatus("submitting");

    const nameParts = formData.name.trim().split(" ");

    // ✅ Read token from secure cookie — NOT localStorage
    const tokenFromCookie = CookieManager.get("kacu_auth_token");

    const regPayload = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" ") || "Applicant",
      email: formData.email,
      password: regPassword,
      phone: formData.phone,
      role: "APPLICANT",
      // ✅ Send token directly in payload (replaces prequalification_form_uuid)
      token: tokenFromCookie,
    };

    try {
      const res = await fetch(`${API_BASE}/applicant/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(regPayload),
      });
      const data = await res.json();

      // if (res.ok) {
      //   console.log("FULL REGISTER RESPONSE:", JSON.stringify(data));
      //   alert(JSON.stringify(data));
      //   // ✅ Store session
      //   // token from registration response in cookie (not localStorage)
      //   if (data.token) {
      //     CookieManager.set("kacu_auth_token", data.token, 7);
      //   }
      //   if (data.user || data.username) {
      //     // Store non-sensitive user metadata in cookie (session only)
      //     CookieManager.set(
      //       "kacu_user",
      //       JSON.stringify(data.user || { username: data.username }),
      //       7,
      //     );
      //   }
      //   window.location.href = "/clientdashboard";
      // }
      if (res.ok && data.success) {
        // Clear the prequal token — it's no longer valid
        CookieManager.remove("kacu_auth_token");
        // Redirect to login so user authenticates and gets real auth token
        window.location.href = "/login";
      } else {
        setServerMessage(
          typeof data === "object"
            ? Object.values(data).join(", ")
            : "Registration failed.",
        );
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setServerMessage("Connection error. Please try again.");
    }
  };

  if (status === "success") return <SuccessScreen navigate={navigate} />;

  const isLastDataStep = step === 4;
  const isSecurityStep = step === 5;

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* ── 4-corner orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(49,105,78,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(49,105,78,0.025)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#31694E] rounded-full blur-[130px] opacity-[0.12] mix-blend-multiply" />
        <div className="absolute -top-[15%] -right-[8%] w-[480px] h-[480px] bg-[#BBC863] rounded-full blur-[130px] opacity-[0.18] mix-blend-multiply" />
        <div className="absolute -bottom-[15%] -left-[8%] w-[480px] h-[480px] bg-[#F0E491] rounded-full blur-[130px] opacity-[0.22] mix-blend-multiply" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-[#658C58] rounded-full blur-[130px] opacity-[0.12] mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 md:px-18 relative z-10">
        {/* ── Section Header ── */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#BBC863]/30 shadow-sm mb-5">
            <Sparkles size={12} className="text-[#BBC863] fill-[#BBC863]" />
            <span className="text-[#31694E] font-bold tracking-[0.2em] text-[10px] uppercase">
              Secure Funding Request
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#31694E] tracking-tight leading-[1.1] mb-4">
            Prequalify{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BBC863] via-[#658C58] to-[#31694E]">
              Instantly
            </span>
          </h2>
          <p className="text-base text-[#5A7C6B] font-medium leading-relaxed">
            No hard credit pull. Funding decisions in as little as 4 hours.
          </p>
        </div>

        {/* ── Main Card ── */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-[#1E3F30] rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_-16px_rgba(30,63,48,0.25)]"
          >
            {/* Gold top accent line */}
            <div className="absolute top-0 left-12 right-12 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#F0E491]/70 to-transparent" />

            {/* ── Step Progress Bar ── */}
            <div className="px-8 py-7 lg:px-12 border-b border-white/8">
              <div className="flex items-center justify-between gap-2">
                {STEP_CONFIG.map((s, i) => {
                  const isActive = i + 1 === step;
                  const isDone = i + 1 < step;
                  return (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-2 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isDone
                              ? "bg-[#F0E491] text-[#1E3F30] shadow-[0_0_16px_rgba(240,228,145,0.35)]"
                              : isActive
                                ? "bg-[#F0E491]/15 border-2 border-[#F0E491] text-[#F0E491]"
                                : "bg-white/8 border border-white/12 text-white/25"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 size={16} strokeWidth={2.5} />
                          ) : (
                            <s.icon size={14} strokeWidth={2} />
                          )}
                        </div>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block transition-colors ${
                            isActive
                              ? "text-[#F0E491]"
                              : isDone
                                ? "text-[#F0E491]/50"
                                : "text-white/20"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {i < STEP_CONFIG.length - 1 && (
                        <div className="flex-1 h-px relative overflow-hidden mb-4">
                          <div className="absolute inset-0 bg-white/10 rounded-full" />
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#F0E491]/80 to-[#BBC863]/60 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: isDone ? "100%" : "0%" }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* ── Form Body ── */}
            <div className="px-8 py-10 lg:px-12">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <StepWrapper key="s1">
                    <StepTitle
                      title="Contact Information"
                      desc="Tell us about yourself and your business."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <DarkInput
                        label="Business Name"
                        name="business_name"
                        icon={Building2}
                        value={formData.business_name}
                        onChange={handleInputChange}
                        error={errors.business_name}
                        placeholder="Acme Logistics LLC"
                      />
                      <DarkInput
                        label="Full Name"
                        name="name"
                        icon={User}
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        placeholder="John Doe"
                      />
                      <DarkInput
                        label="Email Address"
                        name="email"
                        type="email"
                        icon={Mail}
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        placeholder="john@company.com"
                      />
                      <DarkInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        icon={Phone}
                        value={formData.phone}
                        onChange={handleInputChange}
                        error={errors.phone}
                        placeholder="(555) 000-0000"
                      />
                    </div>

                    {/* ── Resume Application CTA ── */}
                    <div className="mt-8 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setShowResumeModal(true)}
                        className="group flex items-center gap-2 text-[11px] font-semibold text-white/30 hover:text-[#BBC863]/70 transition-colors duration-200"
                      >
                        <Hash
                          size={11}
                          className="group-hover:text-[#BBC863]/70 transition-colors"
                        />
                        Already filled prequalification?{" "}
                        <span className="underline underline-offset-2 decoration-white/20 group-hover:decoration-[#BBC863]/50 transition-all">
                          Resume your application
                        </span>
                      </button>
                    </div>
                  </StepWrapper>
                )}

                {step === 2 && (
                  <StepWrapper key="s2">
                    <StepTitle
                      title="Business Details"
                      desc="Help us understand your business profile."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <DarkInput
                        label="Annual Revenue ($)"
                        name="annual_revenue"
                        type="number"
                        icon={DollarSign}
                        value={formData.annual_revenue}
                        onChange={handleInputChange}
                        error={errors.annual_revenue}
                        placeholder="150000"
                      />
                      <DarkSelect
                        label="Years in Business"
                        name="years_in_business"
                        icon={Calendar}
                        options={YEARS_CHOICES}
                        value={formData.years_in_business}
                        onChange={handleInputChange}
                      />
                      <DarkSelect
                        label="Business Location"
                        name="business_location"
                        icon={MapPin}
                        options={[
                          { key: "USA", label: "United States" },
                          { key: "CANADA", label: "Canada" },
                        ]}
                        value={formData.business_location}
                        onChange={handleInputChange}
                      />
                      {/* ✅ Fixed field name: reference_code */}
                      <DarkInput
                        label="Reference Code"
                        name="reference_code"
                        icon={Tag}
                        value={formData.reference_code}
                        onChange={handleInputChange}
                        placeholder="Optional"
                      />
                    </div>
                  </StepWrapper>
                )}

                {step === 3 && (
                  <StepWrapper key="s3">
                    <StepTitle
                      title="Funding Request"
                      desc="Select the amount, term, and type of funding you need."
                    />
                    <div className="space-y-7">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <DarkSelect
                          label="Desired Amount"
                          name="loan_amount"
                          icon={DollarSign}
                          options={LOAN_AMOUNT_CHOICES}
                          value={formData.loan_amount}
                          onChange={handleInputChange}
                        />
                        <DarkSelect
                          label="Loan Term"
                          name="loan_term"
                          icon={Clock}
                          options={[
                            { key: "TERM_1", label: "3 months" },
                            { key: "TERM_2", label: "6 months" },
                            { key: "TERM_3", label: "12 months" },
                            { key: "TERM_4", label: "18 months" },
                            { key: "TERM_5", label: "24 months" },
                            { key: "TERM_6", label: "More than 24 months" },
                          ]}
                          value={formData.loan_term}
                          onChange={handleInputChange}
                        />
                      </div>
                      {loanTypes.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F0E491]/40 mb-3">
                            Funding Product
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {loanTypes.map((t) => {
                              const isSelected = formData.loan_type === t.id;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      loan_type: t.id,
                                    })
                                  }
                                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                                    isSelected
                                      ? "bg-[#F0E491]/10 border-[#F0E491]/60 shadow-[0_0_20px_rgba(240,228,145,0.08)]"
                                      : "bg-white/5 border-white/10 hover:border-[#BBC863]/40 hover:bg-white/8"
                                  }`}
                                >
                                  <div
                                    className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${isSelected ? "text-[#F0E491]/60" : "text-white/25"}`}
                                  >
                                    Product
                                  </div>
                                  <div
                                    className={`font-semibold text-sm leading-tight ${isSelected ? "text-[#F0E491]" : "text-white/70"}`}
                                  >
                                    {t.name}
                                  </div>
                                  {isSelected && (
                                    <div className="mt-2.5 w-5 h-0.5 bg-[#F0E491]/70 rounded-full" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </StepWrapper>
                )}

                {step === 4 && (
                  <StepWrapper key="s4">
                    <StepTitle
                      title="Review & Submit"
                      desc="Confirm your details before we process your request."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DarkReviewGroup title="Contact">
                        <DarkReviewRow
                          label="Business"
                          value={formData.business_name}
                        />
                        <DarkReviewRow label="Name" value={formData.name} />
                        <DarkReviewRow label="Email" value={formData.email} />
                        <DarkReviewRow label="Phone" value={formData.phone} />
                      </DarkReviewGroup>
                      <DarkReviewGroup title="Business">
                        <DarkReviewRow
                          label="Annual Revenue"
                          value={
                            formData.annual_revenue
                              ? `$${Number(formData.annual_revenue).toLocaleString()}`
                              : "—"
                          }
                        />
                        <DarkReviewRow
                          label="Years"
                          value={
                            YEARS_CHOICES.find(
                              (y) => y.key === formData.years_in_business,
                            )?.label
                          }
                        />
                        <DarkReviewRow
                          label="Location"
                          value={formData.business_location}
                        />
                        {/* ✅ Fixed: reference_code */}
                        {formData.reference_code && (
                          <DarkReviewRow
                            label="Ref Code"
                            value={formData.reference_code}
                          />
                        )}
                      </DarkReviewGroup>
                      <DarkReviewGroup
                        title="Funding"
                        className="md:col-span-2"
                      >
                        <DarkReviewRow
                          label="Amount"
                          value={
                            LOAN_AMOUNT_CHOICES.find(
                              (a) => a.key === formData.loan_amount,
                            )?.label
                          }
                        />
                        <DarkReviewRow
                          label="Term"
                          value={
                            formData.loan_term === "TERM_1"
                              ? "3 – 12 Months"
                              : "12 – 24 Months"
                          }
                        />
                        {loanTypes.length > 0 && (
                          <DarkReviewRow
                            label="Product"
                            value={
                              loanTypes.find((t) => t.id === formData.loan_type)
                                ?.name || "—"
                            }
                          />
                        )}
                      </DarkReviewGroup>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-3 justify-center">
                      {[
                        "No hard credit pull",
                        "256-bit encrypted",
                        "4-hour funding",
                      ].map((t) => (
                        <div
                          key={t}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#BBC863]/10 border border-[#BBC863]/25"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F0E491]" />
                          <span className="text-[10px] font-bold text-[#BBC863] uppercase tracking-wider">
                            {t}
                          </span>
                        </div>
                      ))}
                    </div>
                  </StepWrapper>
                )}

                {step === 5 && (
                  <StepWrapper key="s5">
                    <div className="max-w-md mx-auto py-2">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-[#F0E491]/10 border border-[#F0E491]/30 flex items-center justify-center mx-auto mb-5">
                          <Lock size={28} className="text-[#F0E491]" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Create Your Account
                        </h3>
                        <p className="text-sm text-white/50">
                          Set a password to secure your application portal.
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-3xl border border-white/10 p-7 space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F0E491]/40">
                            Email
                          </label>
                          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white/40 text-sm">
                            {formData.email}
                          </div>
                        </div>
                        <div className="relative">
                          <DarkInput
                            label="Password"
                            name="regPassword"
                            type={showPassword ? "text" : "password"}
                            icon={Lock}
                            value={regPassword}
                            onChange={(e) => {
                              setRegPassword(e.target.value);
                              if (errors.regPassword)
                                setErrors((p) => ({
                                  ...p,
                                  regPassword: false,
                                }));
                            }}
                            error={errors.regPassword}
                            placeholder="Min. 8 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 bottom-3.5 text-white/30 hover:text-[#F0E491]/70 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#BBC863]/8 border border-[#BBC863]/20">
                          <Shield
                            size={14}
                            className="text-[#BBC863] mt-0.5 shrink-0"
                          />
                          <p className="text-[11px] text-[#BBC863]/70 leading-relaxed">
                            Your information is protected with bank-level
                            256-bit encryption.
                          </p>
                        </div>
                      </div>
                    </div>
                  </StepWrapper>
                )}
              </AnimatePresence>

              {/* ── Navigation Footer ── */}
              <div className="mt-10 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => step > 1 && step < 5 && setStep(step - 1)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm text-white/30 hover:text-white/70 hover:bg-white/8 transition-all ${
                    step === 1 || step === 5
                      ? "invisible pointer-events-none"
                      : ""
                  }`}
                >
                  ← Back
                </button>

                {serverMessage && status === "error" && (
                  <p className="text-red-400 text-[11px] font-medium text-center flex-1">
                    {serverMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={
                    isLastDataStep
                      ? handleSubmitPrequal
                      : isSecurityStep
                        ? handleRegister
                        : () => validateStep(step) && setStep(step + 1)
                  }
                  disabled={status === "submitting"}
                  className="group px-10 py-3.5 bg-[#F0E491] text-[#1E3F30] rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#BBC863] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_32px_-8px_rgba(240,228,145,0.5)] hover:shadow-[0_12px_40px_-8px_rgba(240,228,145,0.6)]"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Processing…</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isLastDataStep
                          ? "Submit"
                          : isSecurityStep
                            ? "Finish"
                            : "Continue"}
                      </span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Bottom trust strip ── */}
          <div className="mt-7 flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: Shield, label: "SSL Encrypted" },
              { icon: CheckCircle2, label: "No Hard Pull" },
              { icon: Activity, label: "Decision in 4 Hours" },
            ].map(({ icon: Icon, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <div className="w-px h-3 bg-[#31694E]/20" />}
                <div className="flex items-center gap-2 text-[#5A7C6B]/60 text-xs font-medium">
                  <Icon size={13} className="text-[#658C58]/60" />
                  <span>{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Resume Application Modal ── */}
      <AnimatePresence>
        {showResumeModal && (
          <ResumeModal
            apiBase={API_BASE}
            onClose={() => setShowResumeModal(false)}
            onResume={({ uuid, name, email, phone }) => {
              setFormData((prev) => ({
                ...prev,
                name: name || prev.name,
                email: email || prev.email,
                phone: phone || prev.phone,
              }));
              setCapturedUuid(uuid);
              setStep(5);
              setShowResumeModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ─── Resume Application Modal ─────────────────────────────────────────────────

const ResumeModal = ({ apiBase, onClose, onResume }) => {
  const [uuid, setUuid] = useState("");
  const [modalStatus, setModalStatus] = useState("idle");
  const [modalError, setModalError] = useState("");

  const handleLookup = async () => {
    if (!uuid.trim()) {
      setModalError("Please enter your application reference.");
      return;
    }
    setModalStatus("loading");
    setModalError("");

    try {
      const res = await fetch(
        `${apiBase}/applicant/prequalification/${uuid.trim()}/`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        },
      );
      const data = await res.json();

      if (res.ok && data.success !== false) {
        // ✅ Store refreshed token in secure cookie
        if (data.token) {
          CookieManager.set("kacu_auth_token", data.token, 1);
        }

        // ✅ Hydrate form state and jump to step 5
        onResume({
          uuid: data.form_uuid || uuid.trim(),
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } else {
        setModalError(
          data.message || "Application not found. Please check your reference.",
        );
        setModalStatus("idle");
      }
    } catch {
      setModalError("Network error. Please try again.");
      setModalStatus("idle");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative bg-[#1E3F30] rounded-3xl border border-white/10 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)] w-full max-w-md p-8"
      >
        {/* Gold top accent */}
        <div className="absolute top-0 left-10 right-10 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[#F0E491]/50 to-transparent" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/12 transition-all"
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div className="mb-7">
          <div className="w-11 h-11 rounded-xl bg-[#F0E491]/10 border border-[#F0E491]/25 flex items-center justify-center mb-5">
            <Hash size={18} className="text-[#F0E491]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1.5">
            Resume Application
          </h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Enter your application reference to pick up where you left off and
            proceed to account setup.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <DarkInput
            label="Application Reference"
            name="resume_uuid"
            icon={Hash}
            value={uuid}
            onChange={(e) => {
              setUuid(e.target.value);
              if (modalError) setModalError("");
            }}
            placeholder="e.g. a1b2c3d4-e5f6-…"
            error={!!modalError}
          />
          {modalError && (
            <p className="text-red-400 text-[11px] font-medium">{modalError}</p>
          )}

          <button
            type="button"
            onClick={handleLookup}
            disabled={modalStatus === "loading"}
            className="w-full py-3.5 bg-[#F0E491] text-[#1E3F30] rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#BBC863] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_6px_24px_-6px_rgba(240,228,145,0.45)]"
          >
            {modalStatus === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={15} />
                <span>Looking up…</span>
              </>
            ) : (
              <>
                <span>Resume</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Step Wrapper ─────────────────────────────────────────────────────────────
const StepWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 16 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -16 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// ─── Step Title ───────────────────────────────────────────────────────────────
const StepTitle = ({ title, desc }) => (
  <div className="mb-8">
    <h3 className="text-xl font-bold text-white mb-1.5">{title}</h3>
    <p className="text-sm text-white/40">{desc}</p>
  </div>
);

// ─── Dark Input ───────────────────────────────────────────────────────────────
const DarkInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  icon: Icon,
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label
      className={`text-[10px] font-black uppercase tracking-[0.2em] ml-0.5 ${error ? "text-red-400" : "text-[#F0E491]/40"}`}
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon
            size={14}
            className={error ? "text-red-400/60" : "text-[#BBC863]/40"}
          />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/6 border text-[#F0E491] text-sm outline-none transition-all placeholder:text-white/20 ${
          error
            ? "border-red-500/40 bg-red-900/10 focus:border-red-400/60 focus:ring-2 focus:ring-red-500/10"
            : "border-white/10 focus:border-[#F0E491]/40 focus:ring-2 focus:ring-[#F0E491]/8 hover:border-white/20"
        }`}
      />
    </div>
    {error && (
      <p className="text-red-400 text-[10px] font-semibold ml-0.5">
        This field is required.
      </p>
    )}
  </div>
);

// ─── Dark Select ──────────────────────────────────────────────────────────────
const DarkSelect = ({ label, name, value, options, onChange, icon: Icon }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-0.5 text-[#F0E491]/40">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Icon size={14} className="text-[#BBC863]/40" />
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-9 py-3 rounded-xl bg-white/6 border border-white/10 text-[#F0E491] text-sm outline-none cursor-pointer appearance-none transition-all focus:border-[#F0E491]/40 focus:ring-2 focus:ring-[#F0E491]/8 hover:border-white/20"
      >
        {options.map((o) => (
          <option
            key={o.key}
            value={o.key}
            className="bg-[#1E3F30] text-[#F0E491]"
          >
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#BBC863]/40 pointer-events-none"
      />
    </div>
  </div>
);

// ─── Review Components ────────────────────────────────────────────────────────
const DarkReviewGroup = ({ title, children, className = "" }) => (
  <div
    className={`bg-white/5 rounded-2xl border border-white/8 p-5 ${className}`}
  >
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F0E491]/40 mb-4">
      {title}
    </p>
    <div className="space-y-3">{children}</div>
  </div>
);

const DarkReviewRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 pb-2.5 border-b border-white/6 last:border-b-0 last:pb-0">
    <span className="text-xs text-white/35 font-medium shrink-0">{label}</span>
    <span className="text-xs text-[#F0E491]/80 font-semibold text-right truncate max-w-[60%]">
      {value || "—"}
    </span>
  </div>
);

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => navigate("/clientdashboard"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-[#31694E] flex items-center justify-center mx-auto mb-6 shadow-[0_20px_40px_-10px_rgba(49,105,78,0.4)]">
          <CheckCircle2 size={40} className="text-[#F0E491]" />
        </div>
        <h1 className="text-4xl font-black text-[#1E3F30] mb-2">You're in!</h1>
        <p className="text-[#5A7C6B] mb-8">Redirecting to your dashboard…</p>
        <Loader2 className="animate-spin text-[#31694E] mx-auto" size={28} />
      </motion.div>
    </div>
  );
};
