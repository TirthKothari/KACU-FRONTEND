import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Activity,
  CheckCircle2,
  Loader2,
  Shield,
} from "lucide-react";

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
  { key: "CANADA", label: "Canada" },
];
const YEARS_CHOICES = [
  { key: "TERM_1", label: "Less than 6 months" },
  { key: "TERM_2", label: "6 – 12 months" },
  { key: "TERM_3", label: "1 year" },
  { key: "TERM_4", label: "2 – 3 years" },
  { key: "TERM_5", label: "3 – 5 years" },
  { key: "TERM_6", label: "More than 5 years" },
];
const STEP_LABELS = ["Contact", "Business", "Funding", "Review"];

// ─────────────────────────────────────────────────────────────────
// DEBUG HELPER — logs with a consistent prefix so they're easy to
// filter in DevTools: type "KACU" in the console filter box
// ─────────────────────────────────────────────────────────────────
const dbg = {
  info: (...a) =>
    console.log("%c[KACU ℹ]", "color:#BBC863;font-weight:bold", ...a),
  ok: (...a) =>
    console.log("%c[KACU ✓]", "color:#4ade80;font-weight:bold", ...a),
  warn: (...a) =>
    console.warn("%c[KACU ⚠]", "color:#f97316;font-weight:bold", ...a),
  error: (...a) =>
    console.error("%c[KACU ✗]", "color:#f87171;font-weight:bold", ...a),
  table: (...a) => console.table(...a),
};

// ── Scoped styles ─────────────────────────────────────────────────
const SCOPED_CSS = `
  @keyframes kacu-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(500%)} }
  @keyframes kacu-float-a { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(35px,-25px) scale(1.06)} 70%{transform:translate(-18px,20px) scale(0.97)} }
  @keyframes kacu-float-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-42px,30px)} }
  @keyframes kacu-float-c { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(28px,-38px) scale(1.05)} }
  @keyframes kacu-grid    { 0%,100%{opacity:1} 50%{opacity:0.6} }
  @keyframes kacu-pulse   { 0%,100%{box-shadow:0 8px 28px -8px rgba(240,228,145,0.3)} 50%{box-shadow:0 8px 40px -4px rgba(240,228,145,0.55)} }
  [data-kacu-form] .kacu-shimmer-bar  { animation: kacu-shimmer 4s ease-in-out infinite; }
  [data-kacu-form] .kacu-btn-cta      { animation: kacu-pulse   3s ease-in-out infinite; }
  [data-kacu-form] .kacu-btn-cta:hover{ animation: none; }
  [data-kacu-form] .kacu-grid         { animation: kacu-grid    8s ease-in-out infinite; }
  [data-kacu-form] .kacu-orb-a        { animation: kacu-float-a 22s ease-in-out infinite; }
  [data-kacu-form] .kacu-orb-b        { animation: kacu-float-b 20s ease-in-out infinite 3s; }
  [data-kacu-form] .kacu-orb-c        { animation: kacu-float-c 28s ease-in-out infinite 5s; }
  [data-kacu-form] input:-webkit-autofill,
  [data-kacu-form] input:-webkit-autofill:hover,
  [data-kacu-form] input:-webkit-autofill:focus,
  [data-kacu-form] input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 9999px rgba(42,89,67,0.95) inset !important;
    box-shadow:         0 0 0 9999px rgba(42,89,67,0.95) inset !important;
    -webkit-text-fill-color: #F0E491 !important;
    caret-color: #F0E491;
    transition: background-color 9999s ease-in-out 0s;
  }
  [data-kacu-form] select option { background:#1E3F30; color:#FAFAF8; }
`;

const useFormStyles = () => {
  useEffect(() => {
    const el = document.createElement("style");
    el.setAttribute("data-kacu-styles", "true");
    el.textContent = SCOPED_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
};

// ── Background ────────────────────────────────────────────────────
const ContainedBackground = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    <div style={{ position: "absolute", inset: 0, background: "#FAFAF8" }} />
    <div
      className="kacu-grid"
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(rgba(49,105,78,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(49,105,78,0.06) 1px,transparent 1px)`,
        backgroundSize: "52px 52px",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }}
    />
    <div
      className="kacu-orb-a"
      style={{
        position: "absolute",
        top: "-15%",
        left: "-10%",
        width: 650,
        height: 650,
        background:
          "radial-gradient(circle,#F0E491 0%,#BBC863 35%,transparent 72%)",
        filter: "blur(80px)",
        opacity: 0.35,
        mixBlendMode: "multiply",
      }}
    />
    <div
      className="kacu-orb-b"
      style={{
        position: "absolute",
        bottom: "-15%",
        right: "-10%",
        width: 600,
        height: 600,
        background:
          "radial-gradient(circle,#F0E491 0%,#BBC863 40%,transparent 72%)",
        filter: "blur(90px)",
        opacity: 0.3,
        mixBlendMode: "multiply",
      }}
    />
    <div
      className="kacu-orb-c"
      style={{
        position: "absolute",
        top: "25%",
        left: "30%",
        width: 500,
        height: 500,
        background: "radial-gradient(circle,#658C58 0%,transparent 70%)",
        filter: "blur(120px)",
        opacity: 0.07,
      }}
    />
  </div>
);

// ── Step dots ─────────────────────────────────────────────────────
const StepDots = ({ step, total }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    {Array.from({ length: total }).map((_, i) => {
      const done = i + 1 < step,
        active = i + 1 === step;
      return (
        <React.Fragment key={i}>
          <motion.div
            layout
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 999,
              height: 6,
              width: active ? 28 : done ? 8 : 6,
              background: active
                ? "linear-gradient(90deg,#F0E491,#BBC863)"
                : done
                  ? "rgba(187,200,99,0.6)"
                  : "rgba(255,255,255,0.15)",
              boxShadow: active ? "0 0 10px rgba(240,228,145,0.6)" : "none",
            }}
          />
          {i < total - 1 && (
            <div
              style={{
                height: 1,
                width: 16,
                borderRadius: 999,
                background: done
                  ? "rgba(187,200,99,0.4)"
                  : "rgba(255,255,255,0.1)",
                transition: "background 0.4s",
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const FieldReveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

// ── Main form ─────────────────────────────────────────────────────
export const PreQualificationForm = () => {
  useFormStyles();

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loanTypes, setLoanTypes] = useState([]);
  const [apiDebug, setApiDebug] = useState(null); // surfaces debug info in UI too

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

  // ── GET /loan-types/active/ ──────────────────────────────────
  useEffect(() => {
    const fetchLoanTypes = async () => {
      // 1. Check env var is set
      dbg.info("VITE_API_BASE_URL =", API_BASE);
      if (!API_BASE) {
        const msg =
          "VITE_API_BASE_URL is undefined. Check your .env file and restart Vite.";
        dbg.error(msg);
        setApiDebug({ stage: "env", error: msg });
        setServerMessage(msg);
        return;
      }

      const url = `${API_BASE}/loan-types/active/`;
      dbg.info("Fetching loan types from:", url);

      try {
        const response = await fetch(url);
        dbg.info("Response status:", response.status, response.statusText);
        dbg.info(
          "Response headers:",
          Object.fromEntries(response.headers.entries()),
        );

        if (!response.ok) {
          const text = await response.text();
          dbg.error(`HTTP ${response.status} — body:`, text);
          setApiDebug({
            stage: "loan-types-status",
            status: response.status,
            body: text,
          });
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        dbg.ok("Loan types raw response:", result);
        dbg.table(result.data);

        // Check expected shape: { success: true, data: [...] }
        if (typeof result.success === "undefined") {
          dbg.warn(
            'Response has no "success" field — check API contract. Full response:',
            result,
          );
          setApiDebug({
            stage: "loan-types-shape",
            warning: 'Missing "success" field',
            result,
          });
        }

        if (result.success && Array.isArray(result.data)) {
          dbg.ok(`Loaded ${result.data.length} loan type(s)`);
          setLoanTypes(result.data);
          if (result.data.length > 0) {
            dbg.info("Default loan_type set to id:", result.data[0].id);
            setFormData((p) => ({ ...p, loan_type: result.data[0].id }));
          } else {
            dbg.warn("result.data is empty — no loan types returned from API");
          }
        } else {
          dbg.error("Unexpected response shape:", result);
          setApiDebug({
            stage: "loan-types-shape",
            error: "Unexpected shape",
            result,
          });
        }
      } catch (err) {
        dbg.error("Fetch /loan-types/active/ failed:", err.message, err);
        // Distinguish CORS vs network vs other
        if (err instanceof TypeError && err.message.includes("fetch")) {
          dbg.error(
            "This looks like a CORS or network error. Is the Django server running? Is CORS_ALLOWED_ORIGINS set?",
          );
        }
        setApiDebug({ stage: "loan-types-catch", error: err.message });
        setServerMessage(
          "Unable to connect to server. Check console (filter: KACU).",
        );
      }
    };

    fetchLoanTypes();
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
      4: [],
    };
    const newErrors = {};
    (req[s] || []).forEach((f) => {
      if (!formData[f]?.toString().trim()) newErrors[f] = true;
    });
    if (Object.keys(newErrors).length > 0) {
      dbg.warn(
        `Step ${s} validation failed — missing fields:`,
        Object.keys(newErrors),
      );
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── POST /applicant/prequalification/ ───────────────────────
  const handleSubmit = async () => {
    dbg.info("=== SUBMIT TRIGGERED ===");

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      dbg.error("Validation failed — form incomplete");
      setServerMessage("Please fill in all required fields.");
      return;
    }

    setStatus("submitting");

    const rawPhone = formData.phone.replace(/\D/g, "");
    const formattedPhone =
      rawPhone.length <= 10 ? `+1${rawPhone}` : `+${rawPhone}`;

    const payload = {
      ...formData,
      phone: formattedPhone,
      annual_revenue: parseFloat(formData.annual_revenue) || 0,
      loan_type: parseInt(formData.loan_type),
    };

    dbg.info("Final payload being sent:", payload);
    dbg.table(payload);

    const url = `${API_BASE}/applicant/prequalification/`;
    dbg.info("POST →", url);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      dbg.info("POST response status:", response.status, response.statusText);

      // Always parse body for debug info, even on error
      let data;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
        dbg.info("POST response JSON:", data);
      } else {
        const text = await response.text();
        dbg.warn("POST response is not JSON. Body:", text);
        data = {
          message: `Non-JSON response (${response.status}): ${text.slice(0, 200)}`,
        };
      }

      if (response.ok) {
        dbg.ok("Submission SUCCESS:", data);
        setStatus("success");
      } else {
        dbg.error(`Submission FAILED — HTTP ${response.status}:`, data);
        // Log each field error if Django returns them
        if (data && typeof data === "object") {
          Object.entries(data).forEach(([field, msgs]) => {
            dbg.error(`  Field "${field}":`, msgs);
          });
        }
        setStatus("error");
        setServerMessage(
          data?.message ||
            data?.detail ||
            JSON.stringify(data) ||
            "Submission failed.",
        );
      }
    } catch (err) {
      dbg.error("POST fetch threw an exception:", err.message, err);
      if (err instanceof TypeError) {
        dbg.error(
          "Network/CORS error — is the server running and accepting POST from this origin?",
        );
      }
      setStatus("error");
      setServerMessage("Connection error. Check console (filter: KACU).");
    }
  };

  if (status === "success") return <SuccessScreen />;

  return (
    <div
      data-kacu-form="true"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
      }}
    >
      <ContainedBackground />

      <motion.div
        layout
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 820,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ── API debug banner (only shown when there's a problem) ── */}
        <AnimatePresence>
          {apiDebug && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: 16,
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                fontSize: 11,
                color: "#fca5a5",
                fontFamily: "monospace",
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: "#f87171" }}>
                ⚠ API Debug ({apiDebug.stage}):
              </strong>
              <br />
              {apiDebug.error && (
                <span>
                  Error: {apiDebug.error}
                  <br />
                </span>
              )}
              {apiDebug.status && (
                <span>
                  HTTP Status: {apiDebug.status}
                  <br />
                </span>
              )}
              {apiDebug.warning && (
                <span>
                  Warning: {apiDebug.warning}
                  <br />
                </span>
              )}
              <span style={{ opacity: 0.6 }}>
                Open DevTools → Console, filter by "KACU" for full details
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dark card */}
        <div
          style={{
            borderRadius: 32,
            overflow: "hidden",
            background:
              "linear-gradient(160deg,#2A5943 0%,#1E3F30 30%,#172E23 100%)",
            border: "1px solid rgba(240,228,145,0.12)",
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.08), 0 20px 60px -15px rgba(30,63,48,0.5), inset 0 1px 0 rgba(240,228,145,0.08)",
            position: "relative",
          }}
        >
          {/* Shimmer line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              overflow: "hidden",
              background:
                "linear-gradient(90deg,transparent,rgba(240,228,145,0.4),rgba(187,200,99,0.7),rgba(240,228,145,0.4),transparent)",
            }}
          >
            <div
              className="kacu-shimmer-bar"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "20%",
                height: "100%",
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)",
              }}
            />
          </div>

          {/* Header */}
          <div
            style={{
              padding: "2.5rem 3rem 2rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background:
                "linear-gradient(180deg,rgba(240,228,145,0.04) 0%,transparent 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#F0E491",
                      boxShadow: "0 0 8px rgba(240,228,145,0.8)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(240,228,145,0.6)",
                    }}
                  >
                    Pre-Qualification
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  <span style={{ color: "#FAFAF8" }}>Business </span>
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg,#F0E491 0%,#BBC863 60%,#658C58 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Information
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 8,
                  }}
                >
                  {STEP_LABELS[step - 1]} · Step {step} of 4
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{ paddingTop: 4 }}
              >
                <StepDots step={step} total={4} />
              </motion.div>
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: "2.5rem 3rem" }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                  }}
                >
                  <FieldReveal delay={0.05}>
                    <LuxuryInput
                      label="Business Legal Name"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleInputChange}
                      error={errors.business_name}
                    />
                  </FieldReveal>
                  <FieldReveal delay={0.1}>
                    <LuxuryInput
                      label="Contact Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                  </FieldReveal>
                  <FieldReveal delay={0.15}>
                    <LuxuryInput
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                    />
                  </FieldReveal>
                  <FieldReveal delay={0.2}>
                    <LuxuryInput
                      label="Phone"
                      name="phone"
                      placeholder="10 digits"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                    />
                  </FieldReveal>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                  }}
                >
                  <FieldReveal delay={0.05}>
                    <LuxuryInput
                      label="Annual Revenue ($)"
                      name="annual_revenue"
                      type="number"
                      value={formData.annual_revenue}
                      onChange={handleInputChange}
                      error={errors.annual_revenue}
                    />
                  </FieldReveal>
                  <FieldReveal delay={0.1}>
                    <LuxurySelect
                      label="Years in Business"
                      name="years_in_business"
                      options={YEARS_CHOICES}
                      value={formData.years_in_business}
                      onChange={handleInputChange}
                    />
                  </FieldReveal>
                  <FieldReveal delay={0.15}>
                    <LuxurySelect
                      label="Business Location"
                      name="business_location"
                      options={LOCATION_CHOICES}
                      value={formData.business_location}
                      onChange={handleInputChange}
                    />
                  </FieldReveal>
                  <FieldReveal delay={0.2}>
                    <LuxuryInput
                      label="Reference Code"
                      name="refernce_code"
                      value={formData.refernce_code}
                      onChange={handleInputChange}
                    />
                  </FieldReveal>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ display: "flex", flexDirection: "column", gap: 28 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 20,
                    }}
                  >
                    <FieldReveal delay={0.05}>
                      <LuxurySelect
                        label="Loan Amount"
                        name="loan_amount"
                        options={LOAN_AMOUNT_CHOICES}
                        value={formData.loan_amount}
                        onChange={handleInputChange}
                      />
                    </FieldReveal>
                    <FieldReveal delay={0.1}>
                      <LuxurySelect
                        label="Loan Term"
                        name="loan_term"
                        options={LOAN_TERM_CHOICES}
                        value={formData.loan_term}
                        onChange={handleInputChange}
                      />
                    </FieldReveal>
                  </div>
                  <FieldReveal delay={0.15}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "rgba(240,228,145,0.5)",
                          marginBottom: 12,
                        }}
                      >
                        Select Loan Product
                      </label>
                      {loanTypes.length === 0 && (
                        <div
                          style={{
                            padding: "16px",
                            borderRadius: 12,
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.2)",
                            color: "rgba(248,113,113,0.8)",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          No loan types loaded — check console (filter: KACU)
                          for API errors.
                        </div>
                      )}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3,1fr)",
                          gap: 12,
                        }}
                      >
                        {loanTypes.map((t, i) => {
                          const sel = formData.loan_type === t.id;
                          return (
                            <motion.button
                              key={t.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.18 + i * 0.05 }}
                              whileHover={{
                                y: -2,
                                transition: { duration: 0.18 },
                              }}
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              onClick={() => {
                                dbg.info("Loan type selected:", t);
                                setFormData({ ...formData, loan_type: t.id });
                              }}
                              style={{
                                padding: 16,
                                borderRadius: 14,
                                textAlign: "left",
                                cursor: "pointer",
                                transition: "all 0.22s ease",
                                background: sel
                                  ? "linear-gradient(135deg,rgba(240,228,145,0.15),rgba(187,200,99,0.1))"
                                  : "rgba(255,255,255,0.04)",
                                border: sel
                                  ? "1px solid rgba(240,228,145,0.35)"
                                  : "1px solid rgba(255,255,255,0.08)",
                                boxShadow: sel
                                  ? "0 4px 20px -8px rgba(240,228,145,0.25),inset 0 1px 0 rgba(240,228,145,0.1)"
                                  : "none",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 11,
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                  marginBottom: 4,
                                  color: sel
                                    ? "#F0E491"
                                    : "rgba(255,255,255,0.6)",
                                }}
                              >
                                {t.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: sel
                                    ? "rgba(240,228,145,0.5)"
                                    : "rgba(255,255,255,0.25)",
                                }}
                              >
                                {t.amount}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </FieldReveal>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="s4"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ padding: "2rem 0" }}
                >
                  <div
                    style={{
                      borderRadius: 20,
                      padding: "3rem",
                      textAlign: "center",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 14,
                      }}
                      style={{
                        position: "relative",
                        width: 64,
                        height: 64,
                        margin: "0 auto 20px",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          background: "rgba(240,228,145,0.15)",
                          filter: "blur(16px)",
                          transform: "scale(1.6)",
                        }}
                      />
                      <div
                        style={{
                          position: "relative",
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg,rgba(240,228,145,0.2),rgba(187,200,99,0.15))",
                          border: "1px solid rgba(240,228,145,0.25)",
                          boxShadow: "0 8px 24px -8px rgba(240,228,145,0.3)",
                        }}
                      >
                        <Activity size={26} color="#F0E491" />
                      </div>
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        fontSize: 24,
                        fontWeight: 900,
                        color: "#FAFAF8",
                        letterSpacing: "-0.02em",
                        marginBottom: 10,
                      }}
                    >
                      Ready to Submit
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.6,
                        maxWidth: 300,
                        margin: "0 auto",
                      }}
                    >
                      Your pre-qualification data has been collected. Click
                      Finalize to submit for review.
                    </motion.p>
                    {status === "error" && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          marginTop: 16,
                          padding: "8px 16px",
                          borderRadius: 999,
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          color: "#f87171",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {serverMessage}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: 32,
                paddingTop: 28,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => step > 1 && setStep(step - 1)}
                style={{
                  visibility: step === 1 ? "hidden" : "visible",
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  color: "rgba(187,200,99,0.6)",
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(187,200,99,0.2)",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#BBC863";
                  e.currentTarget.style.borderColor = "rgba(187,200,99,0.4)";
                  e.currentTarget.style.background = "rgba(187,200,99,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(187,200,99,0.6)";
                  e.currentTarget.style.borderColor = "rgba(187,200,99,0.2)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Back
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={
                  step === 4
                    ? handleSubmit
                    : () => validateStep(step) && setStep(step + 1)
                }
                disabled={status === "submitting"}
                className="kacu-btn-cta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 40px",
                  borderRadius: 14,
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  background: "linear-gradient(135deg,#F0E491 0%,#BBC863 100%)",
                  color: "#1E3F30",
                  border: "1px solid rgba(240,228,145,0.3)",
                  cursor: status === "submitting" ? "not-allowed" : "pointer",
                  opacity: status === "submitting" ? 0.6 : 1,
                }}
              >
                {status === "submitting" ? (
                  <Loader2
                    size={15}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : step === 4 ? (
                  "Finalize Application"
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 20,
            color: "rgba(49,105,78,0.4)",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          <Shield size={11} />
          <span>Bank-level encryption · No hard credit pull</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ── Input ─────────────────────────────────────────────────────────
const LuxuryInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          marginLeft: 2,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: error
            ? "rgba(248,113,113,0.9)"
            : focused
              ? "#BBC863"
              : "rgba(240,228,145,0.5)",
          transition: "color 0.2s",
        }}
      >
        {label}
        {error && (
          <span
            style={{
              fontWeight: 700,
              textTransform: "none",
              letterSpacing: "normal",
              color: "rgba(248,113,113,0.7)",
              fontSize: 10,
            }}
          >
            · required
          </span>
        )}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          borderRadius: 12,
          padding: "13px 16px",
          fontSize: 14,
          fontWeight: 500,
          color: "#F0E491",
          caretColor: "#F0E491",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          transition: "all 0.2s ease",
          background: error
            ? "rgba(239,68,68,0.08)"
            : focused
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.05)",
          border: error
            ? "1px solid rgba(248,113,113,0.4)"
            : focused
              ? "1px solid rgba(240,228,145,0.35)"
              : "1px solid rgba(255,255,255,0.1)",
          boxShadow: focused
            ? "0 0 0 3px rgba(240,228,145,0.06),inset 0 1px 3px rgba(0,0,0,0.2)"
            : "inset 0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
};

// ── Select ────────────────────────────────────────────────────────
const LuxurySelect = ({ label, name, value, options, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          marginLeft: 2,
          color: focused ? "#BBC863" : "rgba(240,228,145,0.5)",
          transition: "color 0.2s",
        }}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          borderRadius: 12,
          padding: "13px 16px",
          fontSize: 14,
          fontWeight: 500,
          color: "#F0E491",
          WebkitTextFillColor: "#F0E491",
          outline: "none",
          appearance: "none",
          cursor: "pointer",
          width: "100%",
          boxSizing: "border-box",
          transition: "all 0.2s ease",
          background: focused
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.05)",
          border: focused
            ? "1px solid rgba(240,228,145,0.35)"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: focused
            ? "0 0 0 3px rgba(240,228,145,0.06),inset 0 1px 3px rgba(0,0,0,0.2)"
            : "inset 0 1px 3px rgba(0,0,0,0.15)",
        }}
      >
        {options.map((o) => (
          <option
            key={o.key}
            value={o.key}
            style={{ background: "#1E3F30", color: "#FAFAF8" }}
          >
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ── Success ───────────────────────────────────────────────────────
const SuccessScreen = () => {
  useFormStyles();
  return (
    <div
      data-kacu-form="true"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <ContainedBackground />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", position: "relative", zIndex: 10 }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 180,
            damping: 14,
          }}
          style={{
            position: "relative",
            width: 96,
            height: 96,
            margin: "0 auto 28px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(49,105,78,0.2)",
              filter: "blur(28px)",
              transform: "scale(2.2)",
            }}
          />
          <div
            style={{
              position: "relative",
              width: 96,
              height: 96,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#31694E,#1E3F30)",
              border: "1px solid rgba(240,228,145,0.2)",
              boxShadow: "0 24px 60px -12px rgba(49,105,78,0.5)",
            }}
          >
            <CheckCircle2 size={44} color="#F0E491" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#1E3F30",
            marginBottom: 12,
          }}
        >
          Application Submitted
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(49,105,78,0.5)",
            maxWidth: 300,
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          Your pre-qualification has been received. A specialist will reach out
          within 4 hours.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.location.reload()}
          style={{
            padding: "14px 40px",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            background: "linear-gradient(135deg,#31694E,#2A5943)",
            color: "#F0E491",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 12px 32px -8px rgba(49,105,78,0.4)",
          }}
        >
          Submit Another Application
        </motion.button>
      </motion.div>
    </div>
  );
};
