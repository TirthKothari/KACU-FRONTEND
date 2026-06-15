import React, { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const log = (label, data) =>
  console.log(
    `%c[KACU DEBUG] ${label}`,
    "color:#31694E;font-weight:bold;",
    data ?? "",
  );
const logError = (label, err) =>
  console.error(
    `%c[KACU ERROR] ${label}`,
    "color:#e53935;font-weight:bold;",
    err,
  );

const STATUS_META = {
  draft: { label: "Draft", color: "#92400e", bg: "#fef3c7" },
  submitted: { label: "Submitted", color: "#1d4ed8", bg: "#dbeafe" },
  pending: { label: "Pending", color: "#92400e", bg: "#fef3c7" },
  under_review: { label: "Under Review", color: "#6d28d9", bg: "#ede9fe" },
  approved: { label: "Approved", color: "#166534", bg: "#dcfce7" },
  rejected: { label: "Rejected", color: "#991b1b", bg: "#fee2e2" },
};

const LOAN_STEP_LABELS = {
  business_information: "Business Info",
  funding_information: "Funding",
  business_ownership_information: "Ownership",
  terms_and_conditions: "Terms",
  document_upload: "Documents",
  review_submission: "Review",
  completed: "Complete",
};

const STEPS_ORDER = [
  "business_information",
  "funding_information",
  "business_ownership_information",
  "terms_and_conditions",
  "document_upload",
  "review_submission",
  "completed",
];

const SIG_FONTS = [
  { label: "Cursive", value: "'Dancing Script', cursive" },
  { label: "Elegant", value: "'Great Vibes', cursive" },
  { label: "Bold Script", value: "'Pacifico', cursive" },
  { label: "Classic", value: "Georgia, serif" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SIGNATURE CANVAS HELPER
// Renders the typed name in the chosen font onto a canvas and returns a Blob
// ─────────────────────────────────────────────────────────────────────────────
const generateSignatureBlob = (name, fontFamily) =>
  new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FAFDF8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `italic 56px ${fontFamily}`;
    ctx.fillStyle = "#1c3e2c";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });

// ─────────────────────────────────────────────────────────────────────────────
// API LAYER
// ─────────────────────────────────────────────────────────────────────────────
const getToken = () => {
  const match = document.cookie
    .split("; ")
    .find((r) => r.startsWith("kacu_auth_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const authHeaders = () => ({ Authorization: `Token ${getToken()}` });
const jsonHeaders = () => ({
  "Content-Type": "application/json",
  ...authHeaders(),
});

const safeJson = async (res) => {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const t = await res.text();
    log("Non-JSON response", t.slice(0, 300));
    return null;
  }
  return res.json();
};

const apiGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
  const data = await safeJson(res);
  if (!res.ok)
    throw new Error(
      data?.detail || JSON.stringify(data) || `HTTP ${res.status}`,
    );
  return data;
};

const apiPost = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(body),
  });
  const data = await safeJson(res);
  if (!res.ok)
    throw new Error(
      data?.detail || JSON.stringify(data) || `HTTP ${res.status}`,
    );
  return data;
};

const apiPatch = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: jsonHeaders(),
    body: JSON.stringify(body),
  });
  const data = await safeJson(res);
  if (!res.ok)
    throw new Error(
      data?.detail || JSON.stringify(data) || `HTTP ${res.status}`,
    );
  return data;
};

const apiMultipart = async (path, formData, method = "POST") => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: formData,
  });
  const data = await safeJson(res);
  if (!res.ok)
    throw new Error(
      data?.detail || JSON.stringify(data) || `HTTP ${res.status}`,
    );
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ children, color = "#166534", bg = "#dcfce7" }) => (
  <span
    style={{
      background: bg,
      color,
      padding: "3px 12px",
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

const Spinner = ({ size = 24, color = "#31694E" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ animation: "kacu-spin 0.8s linear infinite" }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="3"
      strokeOpacity="0.2"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const Icon = {
  Home: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  File: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Chat: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  User: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Logout: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Arrow: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Check: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 11 4 18" />
    </svg>
  ),
  ChevRight: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevLeft: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Leaf: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 6-8 6z" />
    </svg>
  ),
  Dollar: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Clock: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Shield: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Plus: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Upload: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  ),
  Refresh: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  Edit: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Eye: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Back: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Info: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Search: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ExternalLink: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Send: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Paperclip: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  CheckCircle: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertCircle: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD FIELD PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const inputBase = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1.5px solid #e5e7eb",
  background: "#fafafa",
  fontSize: 14,
  color: "#1a1a1a",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const WizardField = ({ label, children, span = 1, required = false }) => (
  <div style={{ gridColumn: `span ${span}` }}>
    <label
      style={{
        display: "block",
        fontSize: 10,
        fontWeight: 800,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        marginBottom: 6,
      }}
    >
      {label}
      {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const WizardInput = (props) => (
  <input
    {...props}
    style={{ ...inputBase, ...props.style }}
    onFocus={(e) => {
      e.target.style.borderColor = "#31694E";
      props.onFocus?.(e);
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#e5e7eb";
      props.onBlur?.(e);
    }}
  />
);

const WizardSelect = ({ children, ...props }) => (
  <select
    {...props}
    style={{
      ...inputBase,
      appearance: "none",
      cursor: "pointer",
      ...props.style,
    }}
  >
    {children}
  </select>
);

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW PAGE PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const ReviewSection = ({ title, children }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      padding: "28px 32px",
      border: "1px solid #f0f0f0",
      marginBottom: 20,
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 800,
        color: "#31694E",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: 20,
        paddingBottom: 12,
        borderBottom: "2px solid #f0f0f0",
      }}
    >
      {title}
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 20,
      }}
    >
      {children}
    </div>
  </div>
);

const ReviewField = ({ label, value }) => (
  <div>
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        color: "#BBC863",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: value ? "#1a1a1a" : "#ccc",
      }}
    >
      {value || "—"}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION WIZARD — FULL PAGE
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 6;

const emptyForm = (prequalData, loanTypes) => ({
  loan_type: prequalData?.id || loanTypes?.[0]?.id || 1,
  is_dba: false,
  business_legal_name: "",
  business_dba_name: "",
  business_email: "",
  business_phone_number: "",
  business_website: "",
  business_country: "USA",
  business_state: "",
  business_address: "",
  business_city: "",
  business_zip_code: "",
  business_industry_type: "",
  business_legal_entity_type: "llc",
  business_length_of_ownership: "",
  business_number: "",
  business_estimated_start_date: "",
  business_province_of_incorporation: "",
  business_average_gross_monthly_sales: "",
  loan_amount_requested:
    prequalData?.amount?.toString().replace(/[^0-9.]/g, "") || "",
  loan_purpose: prequalData?.description || "",
  loan_term_requested: "",
  overdraft_protection: false,
  overdraft_protection_limit: "",
  business_existing_loan: false,
  business_lender_details: [],
  owner_first_name: "",
  owner_last_name: "",
  owner_email: "",
  owner_phone_number: "",
  owner_date_of_birth: "",
  owner_ssn: "",
  owner_address: "",
  owner_city: "",
  owner_state: "",
  owner_zip_code: "",
  owner_country: "USA",
  owner_percentage_of_ownership: "",
  owner_credit_score: "",
  signature_name: "",
  signature_font: SIG_FONTS[0].value,
  terms_accepted: false,
  documents: [],
});

const validateStep = (step, form) => {
  const errs = [];
  if (step === 1) {
    if (!form.business_legal_name.trim())
      errs.push("Legal Business Name is required");
    if (!form.business_email.trim()) errs.push("Business Email is required");
    if (!form.business_phone_number.trim())
      errs.push("Phone Number is required");
    if (!form.business_address.trim())
      errs.push("Business Address is required");
    if (!form.business_city.trim()) errs.push("City is required");
    if (!form.business_state.trim()) errs.push("State is required");
    if (!form.business_zip_code.trim()) errs.push("Zip Code is required");
    if (!form.business_industry_type.trim())
      errs.push("Industry Type is required");
    if (!form.business_average_gross_monthly_sales)
      errs.push("Average Monthly Sales is required");
    if (form.is_dba && !form.business_dba_name.trim())
      errs.push("DBA Name is required when DBA is checked");
  }
  if (step === 2) {
    if (!form.loan_amount_requested)
      errs.push("Requested Loan Amount is required");
    if (!form.loan_purpose.trim()) errs.push("Loan Purpose is required");
    if (!form.loan_term_requested.trim()) errs.push("Loan Term is required");
  }
  if (step === 3) {
    if (!form.owner_first_name.trim())
      errs.push("Owner First Name is required");
    if (!form.owner_last_name.trim()) errs.push("Owner Last Name is required");
    if (!form.owner_email.trim()) errs.push("Owner Email is required");
    if (!form.owner_phone_number.trim()) errs.push("Owner Phone is required");
    if (!form.owner_date_of_birth) errs.push("Date of Birth is required");
    if (!form.owner_ssn.trim()) errs.push("SSN is required");
    if (!form.owner_address.trim()) errs.push("Owner Address is required");
    if (!form.owner_city.trim()) errs.push("Owner City is required");
    if (!form.owner_state.trim()) errs.push("Owner State is required");
    if (!form.owner_zip_code.trim()) errs.push("Owner Zip Code is required");
    if (!form.owner_percentage_of_ownership)
      errs.push("Ownership % is required");
    if (!form.owner_credit_score) errs.push("Credit Score is required");
  }
  if (step === 5) {
    if (!form.terms_accepted) errs.push("You must accept the terms");
    if (!form.signature_name.trim()) errs.push("Signature name is required");
  }
  return errs;
};

const ApplicationWizardPage = ({
  onClose,
  onComplete,
  prequalData,
  loanTypes,
}) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [appUuid, setAppUuid] = useState(null);
  const [stepError, setStepError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [formData, setFormData] = useState(() =>
    emptyForm(prequalData, loanTypes),
  );

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    setValidationErrors([]);
    setStepError(null);
  };

  const addLender = () =>
    setFormData((p) => ({
      ...p,
      business_lender_details: [
        ...p.business_lender_details,
        { lender_name: "", balance: "" },
      ],
    }));
  const updateLender = (i, f, v) => {
    const list = [...formData.business_lender_details];
    list[i][f] = v;
    setFormData((p) => ({ ...p, business_lender_details: list }));
  };
  const removeLender = (i) =>
    setFormData((p) => ({
      ...p,
      business_lender_details: p.business_lender_details.filter(
        (_, idx) => idx !== i,
      ),
    }));

  const addDoc = () =>
    setFormData((p) => ({
      ...p,
      documents: [...p.documents, { document_name: "", document_file: null }],
    }));
  const updateDoc = (i, f, v) => {
    const list = [...formData.documents];
    list[i][f] = v;
    setFormData((p) => ({ ...p, documents: list }));
  };
  const removeDoc = (i) =>
    setFormData((p) => ({
      ...p,
      documents: p.documents.filter((_, idx) => idx !== i),
    }));

  const handleStepContinue = async () => {
    const errs = validateStep(step, formData);
    if (errs.length > 0) {
      setValidationErrors(errs);
      return;
    }
    setStepError(null);
    setValidationErrors([]);
    setSubmitting(true);
    try {
      if (step === 1) {
        const core = await apiPost("/application/create/", {
          loan_type: Number(formData.loan_type),
        });
        const uuid = core.loan_application_uuid;
        if (!uuid) throw new Error("No UUID returned from application create");
        setAppUuid(uuid);
        await apiPost("/application/business-information/create/", {
          loan_application_uuid: uuid,
          is_dba: formData.is_dba,
          business_legal_name: formData.business_legal_name.trim(),
          business_dba_name: formData.business_dba_name.trim() || null,
          business_email: formData.business_email.trim(),
          business_phone_number: formData.business_phone_number.trim(),
          business_website: formData.business_website.trim() || null,
          business_country: formData.business_country.trim() || "USA",
          business_state: formData.business_state.trim(),
          business_address: formData.business_address.trim(),
          business_city: formData.business_city.trim(),
          business_zip_code: formData.business_zip_code.trim(),
          business_industry_type: formData.business_industry_type.trim(),
          business_legal_entity_type: formData.business_legal_entity_type,
          business_length_of_ownership:
            formData.business_length_of_ownership.trim() || null,
          business_number: formData.business_number.trim() || null,
          business_estimated_start_date:
            formData.business_estimated_start_date || null,
          business_province_of_incorporation:
            formData.business_province_of_incorporation.trim() || null,
          business_average_gross_monthly_sales:
            formData.business_average_gross_monthly_sales
              ? parseFloat(
                  formData.business_average_gross_monthly_sales,
                ).toFixed(2)
              : null,
        });
        setStep(2);
      } else if (step === 2) {
        await apiPost("/application/funding-information/create/", {
          loan_application_uuid: appUuid,
          loan_amount_requested: parseFloat(
            formData.loan_amount_requested,
          ).toFixed(2),
          loan_purpose: formData.loan_purpose.trim(),
          loan_term_requested: formData.loan_term_requested.trim(),
          overdraft_protection: formData.overdraft_protection,
          overdraft_protection_limit:
            formData.overdraft_protection && formData.overdraft_protection_limit
              ? parseFloat(formData.overdraft_protection_limit).toFixed(2)
              : null,
          business_existing_loan: formData.business_existing_loan,
          business_lender_details: formData.business_existing_loan
            ? formData.business_lender_details.filter((l) =>
                l.lender_name.trim(),
              )
            : [],
        });
        setStep(3);
      } else if (step === 3) {
        await apiPost("/application/owner-information/create/", {
          loan_application_uuid: appUuid,
          owner_first_name: formData.owner_first_name.trim(),
          owner_last_name: formData.owner_last_name.trim(),
          owner_email: formData.owner_email.trim(),
          owner_phone_number: formData.owner_phone_number.trim(),
          owner_date_of_birth: formData.owner_date_of_birth,
          owner_ssn: formData.owner_ssn.trim(),
          owner_address: formData.owner_address.trim(),
          owner_city: formData.owner_city.trim(),
          owner_state: formData.owner_state.trim(),
          owner_zip_code: formData.owner_zip_code.trim(),
          owner_country: formData.owner_country.trim() || "USA",
          owner_percentage_of_ownership: parseFloat(
            formData.owner_percentage_of_ownership,
          ).toFixed(2),
          owner_credit_score: parseInt(formData.owner_credit_score, 10),
        });
        setStep(4);
      } else if (step === 4) {
        for (const doc of formData.documents) {
          if (doc.document_file && doc.document_name.trim()) {
            const fd = new FormData();
            fd.append("loan_application_uuid", appUuid);
            fd.append("document_name", doc.document_name.trim());
            fd.append("document_file", doc.document_file);
            await apiMultipart("/application/documents/create/", fd);
          }
        }
        setStep(5);
      } else if (step === 5) {
        // ── FIX 1: Generate canvas signature image and send as signature_image ──
        const sigBlob = await generateSignatureBlob(
          formData.signature_name.trim(),
          formData.signature_font,
        );
        const fd = new FormData();
        fd.append("loan_application_uuid", appUuid);
        fd.append("signature_name", formData.signature_name.trim());
        fd.append("terms_accepted", "true");
        fd.append("signature_image", sigBlob, "signature.png");
        await apiMultipart("/application/terms-and-conditions/create/", fd);
        setStep(6);
      }
    } catch (e) {
      logError("Step submit failed", e);
      setStepError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const grid2 = {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 16,
  };

  const sectionHeader = (num, title, subtitle) => (
    <div
      style={{
        borderLeft: "4px solid #31694E",
        paddingLeft: 16,
        marginBottom: 28,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: "#BBC863",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        Step {num} of {TOTAL_STEPS}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#31694E",
          marginTop: 2,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 13, color: "#658C58", marginTop: 4 }}>
        {subtitle}
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: "#31694E",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Icon.Back width={18} height={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>
            Loan Application
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: i <= step ? "#31694E" : "#f0f0f0",
                  color: i <= step ? "#F0E491" : "#bbb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  transition: "all 0.2s",
                }}
              >
                {i < step ? <Icon.Check width={14} height={14} /> : i}
              </div>
              {i < 6 && (
                <div
                  style={{
                    width: 24,
                    height: 2,
                    background: i < step ? "#31694E" : "#f0f0f0",
                    borderRadius: 99,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 760 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "40px 48px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f0",
            }}
          >
            {/* STEP 1 — Business Identity */}
            {step === 1 && (
              <div>
                {sectionHeader(
                  1,
                  "Business Identity",
                  "Legal information as registered with the government.",
                )}
                <div style={grid2}>
                  <WizardField label="Legal Business Name" required>
                    <WizardInput
                      name="business_legal_name"
                      value={formData.business_legal_name}
                      onChange={set}
                      placeholder="Acme Corp LLC"
                    />
                  </WizardField>
                  <WizardField label="Business Email" required>
                    <WizardInput
                      name="business_email"
                      type="email"
                      value={formData.business_email}
                      onChange={set}
                      placeholder="contact@business.com"
                    />
                  </WizardField>
                  <WizardField label="Phone Number" required>
                    <WizardInput
                      name="business_phone_number"
                      value={formData.business_phone_number}
                      onChange={set}
                      placeholder="+1 234 567 8900"
                    />
                  </WizardField>
                  <WizardField label="Business Website">
                    <WizardInput
                      name="business_website"
                      value={formData.business_website}
                      onChange={set}
                      placeholder="https://..."
                    />
                  </WizardField>
                  <WizardField label="Street Address" span={2} required>
                    <WizardInput
                      name="business_address"
                      value={formData.business_address}
                      onChange={set}
                      placeholder="123 Main St"
                    />
                  </WizardField>
                  <WizardField label="City" required>
                    <WizardInput
                      name="business_city"
                      value={formData.business_city}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="State / Province" required>
                    <WizardInput
                      name="business_state"
                      value={formData.business_state}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Zip Code" required>
                    <WizardInput
                      name="business_zip_code"
                      value={formData.business_zip_code}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Country">
                    <WizardInput
                      name="business_country"
                      value={formData.business_country}
                      onChange={set}
                      placeholder="USA"
                    />
                  </WizardField>
                  <WizardField label="Industry Type" required>
                    <WizardInput
                      name="business_industry_type"
                      value={formData.business_industry_type}
                      onChange={set}
                      placeholder="Retail, Tech, Food..."
                    />
                  </WizardField>
                  <WizardField label="Legal Entity Type">
                    <WizardSelect
                      name="business_legal_entity_type"
                      value={formData.business_legal_entity_type}
                      onChange={set}
                    >
                      <option value="llc">LLC</option>
                      <option value="corporation">Corporation</option>
                      <option value="partnership">Partnership</option>
                      <option value="sole_proprietorship">
                        Sole Proprietorship
                      </option>
                      <option value="pllc">PLLC</option>
                      <option value="s_corporation">S-Corporation</option>
                      <option value="public">Public</option>
                    </WizardSelect>
                  </WizardField>
                  <WizardField label="EIN / Business Reg. Number">
                    <WizardInput
                      name="business_number"
                      value={formData.business_number}
                      onChange={set}
                      placeholder="XX-XXXXXXX"
                    />
                  </WizardField>
                  <WizardField label="Estimated Start Date">
                    <WizardInput
                      name="business_estimated_start_date"
                      type="date"
                      value={formData.business_estimated_start_date}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Province of Incorporation">
                    <WizardInput
                      name="business_province_of_incorporation"
                      value={formData.business_province_of_incorporation}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Length of Ownership">
                    <WizardInput
                      name="business_length_of_ownership"
                      value={formData.business_length_of_ownership}
                      onChange={set}
                      placeholder="e.g. 3 years"
                    />
                  </WizardField>
                  <WizardField
                    label="Avg. Gross Monthly Sales ($)"
                    span={2}
                    required
                  >
                    <WizardInput
                      name="business_average_gross_monthly_sales"
                      type="number"
                      value={formData.business_average_gross_monthly_sales}
                      onChange={set}
                      placeholder="50000"
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#31694E",
                      }}
                    />
                  </WizardField>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 20,
                    padding: "14px 16px",
                    background: "rgba(240,228,145,0.15)",
                    borderRadius: 12,
                    border: "1.5px solid #F0E491",
                  }}
                >
                  <input
                    type="checkbox"
                    name="is_dba"
                    checked={formData.is_dba}
                    onChange={set}
                    style={{ width: 18, height: 18, accentColor: "#31694E" }}
                  />
                  <label
                    style={{ fontSize: 14, fontWeight: 700, color: "#31694E" }}
                  >
                    Does this business operate under a DBA (Doing Business As)?
                  </label>
                </div>
                {formData.is_dba && (
                  <div style={{ marginTop: 16 }}>
                    <WizardField label="DBA Name" required>
                      <WizardInput
                        name="business_dba_name"
                        value={formData.business_dba_name}
                        onChange={set}
                        placeholder="Trading name..."
                      />
                    </WizardField>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 — Funding */}
            {step === 2 && (
              <div>
                {sectionHeader(
                  2,
                  "Funding & Financials",
                  "Tell us how much you need and current debt obligations.",
                )}
                <div style={grid2}>
                  <WizardField label="Requested Amount ($)" required>
                    <WizardInput
                      name="loan_amount_requested"
                      type="number"
                      value={formData.loan_amount_requested}
                      onChange={set}
                      style={{ fontWeight: 700 }}
                    />
                  </WizardField>
                  <WizardField label="Requested Term" required>
                    <WizardInput
                      name="loan_term_requested"
                      value={formData.loan_term_requested}
                      onChange={set}
                      placeholder="e.g. 24 Months"
                    />
                  </WizardField>
                  <WizardField label="Purpose of Loan" span={2} required>
                    <textarea
                      name="loan_purpose"
                      value={formData.loan_purpose}
                      onChange={set}
                      style={{ ...inputBase, height: 80, resize: "none" }}
                    />
                  </WizardField>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    background: "#FAFDF8",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#31694E",
                        fontSize: 14,
                      }}
                    >
                      Overdraft Protection Required?
                    </span>
                    <input
                      type="checkbox"
                      name="overdraft_protection"
                      checked={formData.overdraft_protection}
                      onChange={set}
                      style={{ width: 20, height: 20, accentColor: "#31694E" }}
                    />
                  </div>
                  {formData.overdraft_protection && (
                    <div style={{ marginTop: 12 }}>
                      <WizardInput
                        name="overdraft_protection_limit"
                        type="number"
                        value={formData.overdraft_protection_limit}
                        onChange={set}
                        placeholder="Enter limit amount ($)"
                      />
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#31694E",
                        fontSize: 14,
                      }}
                    >
                      Existing Business Loans?
                    </span>
                    <input
                      type="checkbox"
                      name="business_existing_loan"
                      checked={formData.business_existing_loan}
                      onChange={set}
                      style={{ width: 20, height: 20, accentColor: "#31694E" }}
                    />
                  </div>
                  {formData.business_existing_loan && (
                    <div>
                      {formData.business_lender_details.map((l, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "flex-end",
                            marginBottom: 10,
                            padding: 12,
                            background: "#fff",
                            border: "1px solid #f0f0f0",
                            borderRadius: 10,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <label
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#888",
                                textTransform: "uppercase",
                              }}
                            >
                              Lender Name
                            </label>
                            <input
                              value={l.lender_name}
                              onChange={(e) =>
                                updateLender(i, "lender_name", e.target.value)
                              }
                              style={{
                                width: "100%",
                                borderBottom: "1.5px solid #e5e7eb",
                                border: "none",
                                outline: "none",
                                padding: "4px 0",
                                fontSize: 14,
                                boxSizing: "border-box",
                              }}
                            />
                          </div>
                          <div style={{ width: 120 }}>
                            <label
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#888",
                                textTransform: "uppercase",
                              }}
                            >
                              Balance
                            </label>
                            <input
                              type="number"
                              value={l.balance}
                              onChange={(e) =>
                                updateLender(i, "balance", e.target.value)
                              }
                              style={{
                                width: "100%",
                                borderBottom: "1.5px solid #e5e7eb",
                                border: "none",
                                outline: "none",
                                padding: "4px 0",
                                fontSize: 14,
                                boxSizing: "border-box",
                              }}
                            />
                          </div>
                          <button
                            onClick={() => removeLender(i)}
                            style={{
                              padding: 6,
                              border: "none",
                              background: "#fef2f2",
                              color: "#ef4444",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                          >
                            <Icon.Trash width={16} height={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addLender}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#31694E",
                          background: "rgba(49,105,78,0.08)",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: 10,
                          cursor: "pointer",
                        }}
                      >
                        <Icon.Plus width={16} height={16} /> Add Lender
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 — Owner Info */}
            {step === 3 && (
              <div>
                {sectionHeader(
                  3,
                  "Primary Owner Details",
                  "Personal information required for credit assessment.",
                )}
                <div style={grid2}>
                  <WizardField label="First Name" required>
                    <WizardInput
                      name="owner_first_name"
                      value={formData.owner_first_name}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Last Name" required>
                    <WizardInput
                      name="owner_last_name"
                      value={formData.owner_last_name}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Email" required>
                    <WizardInput
                      name="owner_email"
                      type="email"
                      value={formData.owner_email}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Phone" required>
                    <WizardInput
                      name="owner_phone_number"
                      value={formData.owner_phone_number}
                      onChange={set}
                      placeholder="+1 234 567 8900"
                    />
                  </WizardField>
                  <WizardField label="SSN" required>
                    <WizardInput
                      name="owner_ssn"
                      value={formData.owner_ssn}
                      onChange={set}
                      placeholder="XXX-XX-XXXX"
                    />
                  </WizardField>
                  <WizardField label="Date of Birth" required>
                    <WizardInput
                      name="owner_date_of_birth"
                      type="date"
                      value={formData.owner_date_of_birth}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Ownership %" required>
                    <WizardInput
                      name="owner_percentage_of_ownership"
                      type="number"
                      value={formData.owner_percentage_of_ownership}
                      onChange={set}
                      placeholder="51"
                    />
                  </WizardField>
                  <WizardField label="Credit Score (Est.)" required>
                    <WizardInput
                      name="owner_credit_score"
                      type="number"
                      value={formData.owner_credit_score}
                      onChange={set}
                      placeholder="700"
                    />
                  </WizardField>
                  <WizardField label="Home Address" span={2} required>
                    <WizardInput
                      name="owner_address"
                      value={formData.owner_address}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="City" required>
                    <WizardInput
                      name="owner_city"
                      value={formData.owner_city}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="State" required>
                    <WizardInput
                      name="owner_state"
                      value={formData.owner_state}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Zip Code" required>
                    <WizardInput
                      name="owner_zip_code"
                      value={formData.owner_zip_code}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Country">
                    <WizardInput
                      name="owner_country"
                      value={formData.owner_country}
                      onChange={set}
                      placeholder="USA"
                    />
                  </WizardField>
                </div>
              </div>
            )}

            {/* STEP 4 — Document Upload */}
            {step === 4 && (
              <div>
                {sectionHeader(
                  4,
                  "Document Upload",
                  "Upload supporting documents. Optional — you can skip.",
                )}
                {formData.documents.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-end",
                      marginBottom: 14,
                      padding: 16,
                      background: "#fafafa",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: 14,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <WizardField label="Document Name">
                        <WizardInput
                          value={doc.document_name}
                          onChange={(e) =>
                            updateDoc(i, "document_name", e.target.value)
                          }
                          placeholder="e.g. bank_statement_2024"
                        />
                      </WizardField>
                    </div>
                    <div style={{ flex: 2 }}>
                      <WizardField label="File">
                        <input
                          type="file"
                          onChange={(e) =>
                            updateDoc(i, "document_file", e.target.files[0])
                          }
                          style={{ ...inputBase, padding: "8px 14px" }}
                        />
                      </WizardField>
                    </div>
                    <button
                      onClick={() => removeDoc(i)}
                      style={{
                        marginBottom: 2,
                        padding: 8,
                        border: "none",
                        background: "#fef2f2",
                        color: "#ef4444",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      <Icon.Trash width={16} height={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addDoc}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#31694E",
                    background: "rgba(49,105,78,0.08)",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  <Icon.Plus width={16} height={16} /> Add Document
                </button>
                <div
                  style={{
                    marginTop: 20,
                    padding: 14,
                    background: "rgba(240,228,145,0.12)",
                    borderRadius: 10,
                    border: "1px solid #F0E491",
                    fontSize: 13,
                    color: "#658C58",
                  }}
                >
                  <strong>Note:</strong> Documents can also be uploaded later
                  from your application page.
                </div>
              </div>
            )}

            {/* STEP 5 — Terms & Signature */}
            {step === 5 && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    background: "rgba(49,105,78,0.08)",
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <Icon.Shield
                    width={36}
                    height={36}
                    style={{ color: "#31694E" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#31694E",
                    marginBottom: 6,
                  }}
                >
                  Terms & Signature
                </div>
                <div
                  style={{ fontSize: 14, color: "#658C58", marginBottom: 32 }}
                >
                  Please agree to our terms and sign below.
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    justifyContent: "center",
                    marginBottom: 28,
                  }}
                >
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={set}
                    style={{ width: 20, height: 20, accentColor: "#31694E" }}
                  />
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#31694E",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    I certify all provided information is accurate
                  </label>
                </div>
                <div
                  style={{
                    maxWidth: 480,
                    margin: "0 auto 20px",
                    textAlign: "left",
                  }}
                >
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Signature Style
                  </label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {SIG_FONTS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            signature_font: f.value,
                          }))
                        }
                        style={{
                          padding: "8px 16px",
                          borderRadius: 10,
                          border: `2px solid ${formData.signature_font === f.value ? "#31694E" : "#e5e7eb"}`,
                          background:
                            formData.signature_font === f.value
                              ? "rgba(49,105,78,0.08)"
                              : "#fff",
                          cursor: "pointer",
                          fontFamily: f.value,
                          fontSize: 15,
                          color: "#1a1a1a",
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Type Full Name to Sign
                  </label>
                  <div
                    style={{
                      border: "2px solid #31694E",
                      borderRadius: 12,
                      padding: "20px 24px",
                      background: "#FAFDF8",
                      minHeight: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      name="signature_name"
                      value={formData.signature_name}
                      onChange={set}
                      placeholder="Your full name"
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        textAlign: "center",
                        fontSize: 32,
                        fontFamily: formData.signature_font,
                        fontStyle: "italic",
                        color: "#1c3e2c",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>
                    This constitutes your digital signature — an image will be
                    generated automatically
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6 — Confirmation */}
            {step === 6 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "#dcfce7",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <Icon.CheckCircle
                    width={40}
                    height={40}
                    style={{ color: "#22c55e" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#31694E",
                    marginBottom: 8,
                  }}
                >
                  Application Submitted!
                </div>
                <div
                  style={{ fontSize: 14, color: "#658C58", marginBottom: 32 }}
                >
                  Your loan application has been submitted successfully. Your
                  agent will review it shortly.
                </div>
                <button
                  onClick={() => onComplete && onComplete()}
                  style={{
                    background: "#31694E",
                    color: "#F0E491",
                    padding: "14px 40px",
                    borderRadius: 12,
                    border: "none",
                    fontWeight: 800,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            )}

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  padding: "14px 16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                }}
              >
                {validationErrors.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      color: "#ef4444",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: i < validationErrors.length - 1 ? 4 : 0,
                    }}
                  >
                    • {e}
                  </div>
                ))}
              </div>
            )}

            {stepError && (
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ❌ {stepError}
              </div>
            )}
          </div>

          {/* Footer Nav */}
          {step < 6 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 24,
                padding: "0 4px",
              }}
            >
              <button
                onClick={() => {
                  setStepError(null);
                  setValidationErrors([]);
                  setStep((s) => s - 1);
                }}
                disabled={step === 1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  color: step === 1 ? "#ccc" : "#31694E",
                  background: "none",
                  border: "none",
                  cursor: step === 1 ? "not-allowed" : "pointer",
                }}
              >
                <Icon.ChevLeft width={18} height={18} /> Previous
              </button>
              <button
                onClick={handleStepContinue}
                disabled={submitting}
                style={{
                  background: "#31694E",
                  color: "#F0E491",
                  padding: "14px 40px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? (
                  <>
                    <Spinner size={16} color="#F0E491" />{" "}
                    {step === 5 ? "Submitting…" : "Saving…"}
                  </>
                ) : step === 5 ? (
                  <>
                    <Icon.Check width={16} height={16} /> Submit Application
                  </>
                ) : (
                  <>
                    Continue <Icon.ChevRight width={16} height={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT APPLICATION PAGE
// FIX 2: Added Signature and Documents sections
// ─────────────────────────────────────────────────────────────────────────────
const EditApplicationPage = ({ app, onClose, onComplete }) => {
  const uuid = app?.loan_application_uuid;
  const [activeSection, setActiveSection] = useState("business");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [errors, setErrors] = useState([]);

  const biz = app?.business_information || {};
  const fund = app?.funding_information || {};
  const owner = app?.owner_information?.[0] || {};
  const terms = app?.terms_and_conditions || {};
  const existingDocs = app?.documents || [];

  const [bizData, setBizData] = useState({
    business_legal_name: biz.business_legal_name || "",
    business_dba_name: biz.business_dba_name || "",
    business_email: biz.business_email || "",
    business_phone_number: biz.business_phone_number || "",
    business_website: biz.business_website || "",
    business_country: biz.business_country || "USA",
    business_state: biz.business_state || "",
    business_address: biz.business_address || "",
    business_city: biz.business_city || "",
    business_zip_code: biz.business_zip_code || "",
    business_industry_type: biz.business_industry_type || "",
    business_legal_entity_type: biz.business_legal_entity_type || "llc",
    business_length_of_ownership: biz.business_length_of_ownership || "",
    business_number: biz.business_number || "",
    business_estimated_start_date: biz.business_estimated_start_date || "",
    business_province_of_incorporation:
      biz.business_province_of_incorporation || "",
    business_average_gross_monthly_sales:
      biz.business_average_gross_monthly_sales || "",
    is_dba: biz.is_dba || false,
  });

  const [fundData, setFundData] = useState({
    loan_amount_requested: fund.loan_amount_requested || "",
    loan_purpose: fund.loan_purpose || "",
    loan_term_requested: fund.loan_term_requested || "",
    overdraft_protection: fund.overdraft_protection || false,
    overdraft_protection_limit: fund.overdraft_protection_limit || "",
    business_existing_loan: fund.business_existing_loan || false,
    business_lender_details: fund.business_lender_details || [],
  });

  const [ownerData, setOwnerData] = useState({
    owner_first_name: owner.owner_first_name || "",
    owner_last_name: owner.owner_last_name || "",
    owner_email: owner.owner_email || "",
    owner_phone_number: owner.owner_phone_number || "",
    owner_date_of_birth: owner.owner_date_of_birth || "",
    owner_ssn: owner.owner_ssn || "",
    owner_address: owner.owner_address || "",
    owner_city: owner.owner_city || "",
    owner_state: owner.owner_state || "",
    owner_zip_code: owner.owner_zip_code || "",
    owner_country: owner.owner_country || "USA",
    owner_percentage_of_ownership: owner.owner_percentage_of_ownership || "",
    owner_credit_score: owner.owner_credit_score || "",
  });

  // Signature section state
  const [sigData, setSigData] = useState({
    signature_name: terms.signature_name || "",
    signature_font: SIG_FONTS[0].value,
    terms_accepted: terms.terms_accepted || false,
  });

  // Documents section state — new uploads only
  const [newDocs, setNewDocs] = useState([]);

  const setField = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setErrors([]);
  };

  const flash = (msg, type = "success") => {
    setSaveMsg({ msg, type });
    setTimeout(() => setSaveMsg(null), 3500);
  };

  const saveBiz = async () => {
    if (!bizData.business_legal_name.trim()) {
      setErrors(["Legal Business Name is required"]);
      return;
    }
    setSaving(true);
    try {
      await apiPatch(`/application/business-information/${uuid}/update/`, {
        ...bizData,
        business_average_gross_monthly_sales:
          bizData.business_average_gross_monthly_sales
            ? parseFloat(bizData.business_average_gross_monthly_sales).toFixed(
                2,
              )
            : null,
      });
      flash("Business information updated");
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const saveFund = async () => {
    if (!fundData.loan_amount_requested) {
      setErrors(["Requested amount is required"]);
      return;
    }
    setSaving(true);
    try {
      await apiPatch(`/application/funding-information/${uuid}/update/`, {
        ...fundData,
        loan_amount_requested: parseFloat(
          fundData.loan_amount_requested,
        ).toFixed(2),
      });
      flash("Funding information updated");
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const saveOwner = async () => {
    setSaving(true);
    try {
      const ownerUuid = owner.owner_uuid;
      if (ownerUuid) {
        await apiPatch(`/application/owner-information/${ownerUuid}/update/`, {
          ...ownerData,
          loan_application_uuid: uuid,
          owner_percentage_of_ownership: ownerData.owner_percentage_of_ownership
            ? parseFloat(ownerData.owner_percentage_of_ownership).toFixed(2)
            : null,
          owner_credit_score: ownerData.owner_credit_score
            ? parseInt(ownerData.owner_credit_score, 10)
            : null,
        });
      } else {
        await apiPost(`/application/owner-information/create/`, {
          ...ownerData,
          loan_application_uuid: uuid,
          owner_percentage_of_ownership: ownerData.owner_percentage_of_ownership
            ? parseFloat(ownerData.owner_percentage_of_ownership).toFixed(2)
            : null,
          owner_credit_score: ownerData.owner_credit_score
            ? parseInt(ownerData.owner_credit_score, 10)
            : null,
        });
      }
      flash("Owner information updated");
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // FIX 2a: Save signature — generate canvas image and POST/PATCH terms
  const saveSignature = async () => {
    if (!sigData.signature_name.trim()) {
      setErrors(["Signature name is required"]);
      return;
    }
    if (!sigData.terms_accepted) {
      setErrors(["You must accept the terms"]);
      return;
    }
    setSaving(true);
    try {
      const sigBlob = await generateSignatureBlob(
        sigData.signature_name.trim(),
        sigData.signature_font,
      );
      const fd = new FormData();
      fd.append("loan_application_uuid", uuid);
      fd.append("signature_name", sigData.signature_name.trim());
      fd.append("terms_accepted", "true");
      fd.append("signature_image", sigBlob, "signature.png");
      // Use PATCH if terms already exist, POST if new
      if (terms.signature_name) {
        await apiMultipart(
          `/application/terms-and-conditions/${uuid}/update/`,
          fd,
          "PATCH",
        );
      } else {
        await apiMultipart(
          `/application/terms-and-conditions/create/`,
          fd,
          "POST",
        );
      }
      flash("Signature & terms saved");
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // FIX 2b: Upload new documents
  const saveDocs = async () => {
    const valid = newDocs.filter(
      (d) => d.document_file && d.document_name.trim(),
    );
    if (valid.length === 0) {
      setErrors(["Add at least one document with a name and file"]);
      return;
    }
    setSaving(true);
    try {
      for (const doc of valid) {
        const fd = new FormData();
        fd.append("loan_application_uuid", uuid);
        fd.append("document_name", doc.document_name.trim());
        fd.append("document_file", doc.document_file);
        await apiMultipart("/application/documents/create/", fd);
      }
      setNewDocs([]);
      flash(`${valid.length} document(s) uploaded`);
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const addNewDoc = () =>
    setNewDocs((p) => [...p, { document_name: "", document_file: null }]);
  const updateNewDoc = (i, f, v) => {
    const list = [...newDocs];
    list[i][f] = v;
    setNewDocs(list);
  };
  const removeNewDoc = (i) =>
    setNewDocs((p) => p.filter((_, idx) => idx !== i));

  const grid2 = {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 16,
  };

  const SECTIONS = [
    { id: "business", label: "Business Info", save: saveBiz },
    { id: "funding", label: "Funding", save: saveFund },
    { id: "owner", label: "Owner Details", save: saveOwner },
    { id: "signature", label: "Signature & Terms", save: saveSignature },
    { id: "documents", label: "Documents", save: saveDocs },
  ];

  const sectionTitle = (title) => (
    <div
      style={{
        fontSize: 18,
        fontWeight: 800,
        color: "#31694E",
        marginBottom: 24,
        borderLeft: "4px solid #31694E",
        paddingLeft: 12,
      }}
    >
      {title}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: "#31694E",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Icon.Back width={18} height={18} /> Back to Applications
          </button>
          <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>
            Edit Application
          </div>
        </div>
        {saveMsg && (
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              background: saveMsg.type === "error" ? "#fef2f2" : "#f0fdf4",
              color: saveMsg.type === "error" ? "#ef4444" : "#22c55e",
              fontSize: 13,
              fontWeight: 700,
              border: `1px solid ${saveMsg.type === "error" ? "#fecaca" : "#bbf7d0"}`,
            }}
          >
            {saveMsg.msg}
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 24,
          padding: "32px 24px",
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Section Nav */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #f0f0f0",
              overflow: "hidden",
            }}
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  setErrors([]);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "14px 20px",
                  background:
                    activeSection === s.id
                      ? "rgba(49,105,78,0.08)"
                      : "transparent",
                  color: activeSection === s.id ? "#31694E" : "#666",
                  fontWeight: activeSection === s.id ? 800 : 600,
                  fontSize: 13,
                  border: "none",
                  borderLeft:
                    activeSection === s.id
                      ? "3px solid #31694E"
                      : "3px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "36px 40px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0",
            }}
          >
            {/* Business Section */}
            {activeSection === "business" && (
              <div>
                {sectionTitle("Business Information")}
                <div style={grid2}>
                  <WizardField label="Legal Business Name" required>
                    <WizardInput
                      name="business_legal_name"
                      value={bizData.business_legal_name}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Business Email">
                    <WizardInput
                      name="business_email"
                      type="email"
                      value={bizData.business_email}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Phone Number">
                    <WizardInput
                      name="business_phone_number"
                      value={bizData.business_phone_number}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Website">
                    <WizardInput
                      name="business_website"
                      value={bizData.business_website}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Address" span={2}>
                    <WizardInput
                      name="business_address"
                      value={bizData.business_address}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="City">
                    <WizardInput
                      name="business_city"
                      value={bizData.business_city}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="State">
                    <WizardInput
                      name="business_state"
                      value={bizData.business_state}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Zip Code">
                    <WizardInput
                      name="business_zip_code"
                      value={bizData.business_zip_code}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Country">
                    <WizardInput
                      name="business_country"
                      value={bizData.business_country}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Industry Type">
                    <WizardInput
                      name="business_industry_type"
                      value={bizData.business_industry_type}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Legal Entity Type">
                    <WizardSelect
                      name="business_legal_entity_type"
                      value={bizData.business_legal_entity_type}
                      onChange={setField(setBizData)}
                    >
                      <option value="llc">LLC</option>
                      <option value="corporation">Corporation</option>
                      <option value="partnership">Partnership</option>
                      <option value="sole_proprietorship">
                        Sole Proprietorship
                      </option>
                      <option value="pllc">PLLC</option>
                      <option value="s_corporation">S-Corporation</option>
                      <option value="public">Public</option>
                    </WizardSelect>
                  </WizardField>
                  <WizardField label="EIN / Business Number">
                    <WizardInput
                      name="business_number"
                      value={bizData.business_number}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                  <WizardField label="Avg. Monthly Sales ($)" span={2}>
                    <WizardInput
                      name="business_average_gross_monthly_sales"
                      type="number"
                      value={bizData.business_average_gross_monthly_sales}
                      onChange={setField(setBizData)}
                    />
                  </WizardField>
                </div>
              </div>
            )}

            {/* Funding Section */}
            {activeSection === "funding" && (
              <div>
                {sectionTitle("Funding Information")}
                <div style={grid2}>
                  <WizardField label="Amount Requested ($)" required>
                    <WizardInput
                      name="loan_amount_requested"
                      type="number"
                      value={fundData.loan_amount_requested}
                      onChange={setField(setFundData)}
                    />
                  </WizardField>
                  <WizardField label="Loan Term">
                    <WizardInput
                      name="loan_term_requested"
                      value={fundData.loan_term_requested}
                      onChange={setField(setFundData)}
                      placeholder="e.g. 24 Months"
                    />
                  </WizardField>
                  <WizardField label="Purpose of Loan" span={2}>
                    <textarea
                      name="loan_purpose"
                      value={fundData.loan_purpose}
                      onChange={setField(setFundData)}
                      style={{ ...inputBase, height: 80, resize: "none" }}
                    />
                  </WizardField>
                </div>
              </div>
            )}

            {/* Owner Section */}
            {activeSection === "owner" && (
              <div>
                {sectionTitle("Owner Details")}
                {!owner.owner_uuid && (
                  <div
                    style={{
                      padding: "10px 14px",
                      background: "#fef3c7",
                      border: "1px solid #fbbf24",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#92400e",
                      marginBottom: 16,
                    }}
                  >
                    No owner on record — saving will create a new owner entry.
                  </div>
                )}
                <div style={grid2}>
                  <WizardField label="First Name">
                    <WizardInput
                      name="owner_first_name"
                      value={ownerData.owner_first_name}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="Last Name">
                    <WizardInput
                      name="owner_last_name"
                      value={ownerData.owner_last_name}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="Email">
                    <WizardInput
                      name="owner_email"
                      type="email"
                      value={ownerData.owner_email}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="Phone">
                    <WizardInput
                      name="owner_phone_number"
                      value={ownerData.owner_phone_number}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="Date of Birth">
                    <WizardInput
                      name="owner_date_of_birth"
                      type="date"
                      value={ownerData.owner_date_of_birth}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="Ownership %">
                    <WizardInput
                      name="owner_percentage_of_ownership"
                      type="number"
                      value={ownerData.owner_percentage_of_ownership}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="Credit Score">
                    <WizardInput
                      name="owner_credit_score"
                      type="number"
                      value={ownerData.owner_credit_score}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="SSN">
                    <WizardInput
                      name="owner_ssn"
                      value={ownerData.owner_ssn}
                      onChange={setField(setOwnerData)}
                      placeholder="XXX-XX-XXXX"
                    />
                  </WizardField>
                  <WizardField label="Address" span={2}>
                    <WizardInput
                      name="owner_address"
                      value={ownerData.owner_address}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="City">
                    <WizardInput
                      name="owner_city"
                      value={ownerData.owner_city}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="State">
                    <WizardInput
                      name="owner_state"
                      value={ownerData.owner_state}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="Zip Code">
                    <WizardInput
                      name="owner_zip_code"
                      value={ownerData.owner_zip_code}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                  <WizardField label="Country">
                    <WizardInput
                      name="owner_country"
                      value={ownerData.owner_country}
                      onChange={setField(setOwnerData)}
                    />
                  </WizardField>
                </div>
              </div>
            )}

            {/* FIX 2a — Signature & Terms Section */}
            {activeSection === "signature" && (
              <div>
                {sectionTitle("Signature & Terms")}
                {terms.signature_name && (
                  <div
                    style={{
                      padding: "10px 14px",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#166534",
                      marginBottom: 20,
                    }}
                  >
                    Terms previously accepted. Saving will update your
                    signature.
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                    padding: "14px 16px",
                    background: "rgba(240,228,145,0.15)",
                    borderRadius: 12,
                    border: "1.5px solid #F0E491",
                  }}
                >
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={sigData.terms_accepted}
                    onChange={setField(setSigData)}
                    style={{ width: 18, height: 18, accentColor: "#31694E" }}
                  />
                  <label
                    style={{ fontSize: 14, fontWeight: 700, color: "#31694E" }}
                  >
                    I certify all provided information is accurate
                  </label>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Signature Style
                  </label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {SIG_FONTS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() =>
                          setSigData((p) => ({ ...p, signature_font: f.value }))
                        }
                        style={{
                          padding: "8px 16px",
                          borderRadius: 10,
                          border: `2px solid ${sigData.signature_font === f.value ? "#31694E" : "#e5e7eb"}`,
                          background:
                            sigData.signature_font === f.value
                              ? "rgba(49,105,78,0.08)"
                              : "#fff",
                          cursor: "pointer",
                          fontFamily: f.value,
                          fontSize: 15,
                          color: "#1a1a1a",
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Type Full Name to Sign
                  </label>
                  <div
                    style={{
                      border: "2px solid #31694E",
                      borderRadius: 12,
                      padding: "20px 24px",
                      background: "#FAFDF8",
                      minHeight: 90,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      name="signature_name"
                      value={sigData.signature_name}
                      onChange={setField(setSigData)}
                      placeholder="Your full name"
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        textAlign: "center",
                        fontSize: 36,
                        fontFamily: sigData.signature_font,
                        fontStyle: "italic",
                        color: "#1c3e2c",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>
                    A signature image will be generated automatically from your
                    typed name
                  </div>
                </div>
              </div>
            )}

            {/* FIX 2b — Documents Section */}
            {activeSection === "documents" && (
              <div>
                {sectionTitle("Documents")}

                {/* Existing documents */}
                {existingDocs.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#888",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 12,
                      }}
                    >
                      Uploaded Documents
                    </div>
                    {existingDocs.map((doc) => (
                      <div
                        key={doc.document_uuid}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "#FAFDF8",
                          border: "1px solid #e5e7eb",
                          borderRadius: 10,
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Icon.File
                            width={16}
                            height={16}
                            style={{ color: "#31694E" }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#1a1a1a",
                            }}
                          >
                            {doc.document_name}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <span style={{ fontSize: 11, color: "#888" }}>
                            {doc.uploaded_at
                              ? new Date(doc.uploaded_at).toLocaleDateString()
                              : ""}
                          </span>
                          {doc.document_file && (
                            <a
                              href={doc.document_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#31694E",
                                textDecoration: "none",
                                padding: "5px 12px",
                                background: "rgba(49,105,78,0.08)",
                                borderRadius: 8,
                              }}
                            >
                              <Icon.ExternalLink width={12} height={12} /> View
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New document uploads */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  Add New Documents
                </div>
                {newDocs.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-end",
                      marginBottom: 14,
                      padding: 16,
                      background: "#fafafa",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: 14,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <WizardField label="Document Name">
                        <WizardInput
                          value={doc.document_name}
                          onChange={(e) =>
                            updateNewDoc(i, "document_name", e.target.value)
                          }
                          placeholder="e.g. bank_statement_2024"
                        />
                      </WizardField>
                    </div>
                    <div style={{ flex: 2 }}>
                      <WizardField label="File">
                        <input
                          type="file"
                          onChange={(e) =>
                            updateNewDoc(i, "document_file", e.target.files[0])
                          }
                          style={{ ...inputBase, padding: "8px 14px" }}
                        />
                      </WizardField>
                    </div>
                    <button
                      onClick={() => removeNewDoc(i)}
                      style={{
                        marginBottom: 2,
                        padding: 8,
                        border: "none",
                        background: "#fef2f2",
                        color: "#ef4444",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      <Icon.Trash width={16} height={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addNewDoc}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#31694E",
                    background: "rgba(49,105,78,0.08)",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  <Icon.Plus width={16} height={16} /> Add Document
                </button>
                {newDocs.length === 0 && existingDocs.length === 0 && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: 24,
                      textAlign: "center",
                      border: "2px dashed #e5e7eb",
                      borderRadius: 12,
                      color: "#bbb",
                      fontSize: 13,
                    }}
                  >
                    No documents uploaded yet. Click "Add Document" to upload
                    one.
                  </div>
                )}
              </div>
            )}

            {errors.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                }}
              >
                {errors.map((e, i) => (
                  <div
                    key={i}
                    style={{ color: "#ef4444", fontSize: 13, fontWeight: 600 }}
                  >
                    • {e}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: 28,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={SECTIONS.find((s) => s.id === activeSection)?.save}
                disabled={saving}
                style={{
                  background: "#31694E",
                  color: "#F0E491",
                  padding: "12px 32px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? (
                  <Spinner size={16} color="#F0E491" />
                ) : (
                  <Icon.Check width={16} height={16} />
                )}{" "}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW PAGE
// ─────────────────────────────────────────────────────────────────────────────
const ReviewApplicationPage = ({ app, onClose }) => {
  const status = STATUS_META[app?.status] || STATUS_META.draft;
  const biz = app?.business_information || {};
  const fund = app?.funding_information || {};
  const owner = app?.owner_information?.[0] || {};
  const terms = app?.terms_and_conditions || {};
  const docs = app?.documents || [];

  const stepIndex = STEPS_ORDER.indexOf(
    app?.current_step ?? "business_information",
  );
  const progress =
    app?.completion_percentage ??
    Math.round(((stepIndex + 1) / STEPS_ORDER.length) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 50,
          gap: 16,
        }}
      >
        <button
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "#31694E",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <Icon.Back width={18} height={18} /> Back to Applications
        </button>
        <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>
          Application Review
        </div>
      </div>

      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "32px 24px",
          width: "100%",
        }}
      >
        {/* Status Hero */}
        <div
          style={{
            background: "linear-gradient(135deg,#1c3e2c 0%,#31694E 100%)",
            borderRadius: 20,
            padding: "28px 32px",
            marginBottom: 24,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#BBC863",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 6,
              }}
            >
              Application Status
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
              {app?.loan_type_info?.name || "Loan Application"}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                [
                  "Submitted",
                  app?.submitted_at
                    ? new Date(app.submitted_at).toLocaleDateString()
                    : "Pending",
                ],
                [
                  "Created",
                  app?.created_at
                    ? new Date(app.created_at).toLocaleDateString()
                    : "—",
                ],
                ["Completion", `${progress}%`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {k}
                  </div>
                  <div
                    style={{ fontSize: 15, fontWeight: 800, color: "#F0E491" }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span
            style={{
              padding: "8px 20px",
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: status.color,
              background: status.bg,
            }}
          >
            {status.label}
          </span>
        </div>

        {/* Progress */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "20px 28px",
            marginBottom: 20,
            border: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
              fontSize: 12,
            }}
          >
            <span style={{ fontWeight: 700, color: "#31694E" }}>
              Application Progress
            </span>
            <span style={{ fontWeight: 800, color: "#31694E" }}>
              {progress}%
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: "#f0f0f0",
              borderRadius: 99,
              overflow: "hidden",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg,#31694E,#BBC863)",
                borderRadius: 99,
                transition: "width 0.8s ease",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {STEPS_ORDER.slice(0, 6).map((s, i) => (
              <span
                key={s}
                style={{
                  fontSize: 10,
                  padding: "4px 10px",
                  borderRadius: 99,
                  fontWeight: 700,
                  background:
                    i <= stepIndex ? "rgba(49,105,78,0.12)" : "#f5f5f5",
                  color: i <= stepIndex ? "#31694E" : "#bbb",
                }}
              >
                {LOAN_STEP_LABELS[s]}
              </span>
            ))}
          </div>
        </div>

        {biz.business_legal_name && (
          <ReviewSection title="Business Information">
            <ReviewField label="Legal Name" value={biz.business_legal_name} />
            <ReviewField label="DBA Name" value={biz.business_dba_name} />
            <ReviewField label="Email" value={biz.business_email} />
            <ReviewField label="Phone" value={biz.business_phone_number} />
            <ReviewField label="Website" value={biz.business_website} />
            <ReviewField label="Industry" value={biz.business_industry_type} />
            <ReviewField
              label="Entity Type"
              value={biz.business_legal_entity_type?.toUpperCase()}
            />
            <ReviewField label="EIN" value={biz.business_number} />
            <ReviewField label="Address" value={biz.business_address} />
            <ReviewField label="City" value={biz.business_city} />
            <ReviewField label="State" value={biz.business_state} />
            <ReviewField label="Zip Code" value={biz.business_zip_code} />
            <ReviewField label="Country" value={biz.business_country} />
            <ReviewField
              label="Est. Start Date"
              value={biz.business_estimated_start_date}
            />
            <ReviewField
              label="Length of Ownership"
              value={biz.business_length_of_ownership}
            />
            <ReviewField
              label="Avg. Monthly Sales"
              value={
                biz.business_average_gross_monthly_sales
                  ? `$${Number(biz.business_average_gross_monthly_sales).toLocaleString()}`
                  : ""
              }
            />
          </ReviewSection>
        )}

        {fund.loan_amount_requested && (
          <ReviewSection title="Funding Information">
            <ReviewField
              label="Amount Requested"
              value={`$${Number(fund.loan_amount_requested).toLocaleString()}`}
            />
            <ReviewField label="Term" value={fund.loan_term_requested} />
            <ReviewField label="Purpose" value={fund.loan_purpose} />
            <ReviewField
              label="Overdraft Protection"
              value={fund.overdraft_protection ? "Yes" : "No"}
            />
            {fund.overdraft_protection && (
              <ReviewField
                label="Overdraft Limit"
                value={
                  fund.overdraft_protection_limit
                    ? `$${Number(fund.overdraft_protection_limit).toLocaleString()}`
                    : ""
                }
              />
            )}
            <ReviewField
              label="Existing Loans"
              value={fund.business_existing_loan ? "Yes" : "No"}
            />
          </ReviewSection>
        )}

        {owner.owner_first_name && (
          <ReviewSection title="Owner Information">
            <ReviewField
              label="Full Name"
              value={`${owner.owner_first_name} ${owner.owner_last_name}`}
            />
            <ReviewField label="Email" value={owner.owner_email} />
            <ReviewField label="Phone" value={owner.owner_phone_number} />
            <ReviewField
              label="Date of Birth"
              value={owner.owner_date_of_birth}
            />
            <ReviewField
              label="SSN"
              value={
                owner.owner_ssn ? "•••–••–" + owner.owner_ssn.slice(-4) : ""
              }
            />
            <ReviewField
              label="Ownership %"
              value={
                owner.owner_percentage_of_ownership
                  ? `${owner.owner_percentage_of_ownership}%`
                  : ""
              }
            />
            <ReviewField
              label="Credit Score"
              value={owner.owner_credit_score}
            />
            <ReviewField label="Address" value={owner.owner_address} />
            <ReviewField label="City" value={owner.owner_city} />
            <ReviewField label="State" value={owner.owner_state} />
          </ReviewSection>
        )}

        {terms.signature_name && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 32px",
              border: "1px solid #f0f0f0",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#31694E",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: "2px solid #f0f0f0",
              }}
            >
              Terms & Conditions
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: 20,
                marginBottom: 24,
              }}
            >
              <ReviewField
                label="Terms Accepted"
                value={terms.terms_accepted ? "Yes" : "No"}
              />
              <ReviewField
                label="Accepted At"
                value={
                  terms.accepted_at
                    ? new Date(terms.accepted_at).toLocaleDateString()
                    : ""
                }
              />
            </div>
            <div
              style={{
                border: "2px solid #31694E",
                borderRadius: 12,
                padding: "24px 32px",
                background: "#FAFDF8",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 320,
                minHeight: 80,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontFamily: "'Dancing Script', cursive",
                  fontStyle: "italic",
                  color: "#1c3e2c",
                }}
              >
                {terms.signature_name}
              </span>
            </div>
          </div>
        )}

        {docs.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 32px",
              border: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#31694E",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "2px solid #f0f0f0",
              }}
            >
              Documents
            </div>
            {docs.map((doc) => (
              <div
                key={doc.document_uuid}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon.File
                    width={16}
                    height={16}
                    style={{ color: "#31694E" }}
                  />
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}
                  >
                    {doc.document_name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, color: "#888" }}>
                    {doc.uploaded_at
                      ? new Date(doc.uploaded_at).toLocaleDateString()
                      : ""}
                  </span>
                  {doc.document_file && (
                    <a
                      href={doc.document_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#31694E",
                        textDecoration: "none",
                        padding: "5px 12px",
                        background: "rgba(49,105,78,0.08)",
                        borderRadius: 8,
                      }}
                    >
                      <Icon.ExternalLink width={12} height={12} /> View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAT SECTION
// ─────────────────────────────────────────────────────────────────────────────
const ChatSection = ({ applications }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [attachFile, setAttachFile] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (applications.length > 0 && !selectedApp)
      setSelectedApp(applications[0]);
  }, [applications]);

  const fetchMessages = useCallback(async (app) => {
    if (!app?.loan_application_uuid) return;
    setChatLoading(true);
    try {
      const data = await apiGet(
        `/chat/application/${app.loan_application_uuid}/messages/`,
      );
      const arr = Array.isArray(data) ? data : data?.results || [];
      setMessages(arr);
    } catch (e) {
      logError("Chat fetch failed", e);
      setMessages([]);
    } finally {
      setChatLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedApp) fetchMessages(selectedApp);
  }, [selectedApp, fetchMessages]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim() && !attachFile) return;
    if (!selectedApp?.loan_application_uuid) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("content", newMsg.trim() || "");
      if (attachFile) fd.append("message_file", attachFile);
      await apiMultipart(
        `/chat/application/${selectedApp.loan_application_uuid}/messages/create/`,
        fd,
      );
      setNewMsg("");
      setAttachFile(null);
      await fetchMessages(selectedApp);
    } catch (e) {
      logError("Send failed", e);
    } finally {
      setSending(false);
    }
  };

  const appStatus = STATUS_META[selectedApp?.status] || STATUS_META.draft;
  const stepIndex = STEPS_ORDER.indexOf(
    selectedApp?.current_step ?? "business_information",
  );
  const completion =
    selectedApp?.completion_percentage ??
    Math.round(((stepIndex + 1) / STEPS_ORDER.length) * 100);
  const agentInfo = selectedApp?.assigned_agent_details;

  if (applications.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "#bbb" }}>
        <Icon.Chat
          width={48}
          height={48}
          style={{ marginBottom: 16, opacity: 0.3 }}
        />
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#aaa",
            marginBottom: 8,
          }}
        >
          No Applications Yet
        </div>
        <div style={{ fontSize: 13 }}>
          Start a loan application to open a dedicated chat thread.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        height: "calc(100vh - 120px)",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      {/* LEFT — Application Selector */}
      <div
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
        }}
      >
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 2,
            }}
          >
            Your Applications
          </div>
          <div style={{ fontSize: 13, color: "#555" }}>Select to view chat</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {applications.map((app) => {
            const st = STATUS_META[app.status] || STATUS_META.draft;
            const isActive =
              selectedApp?.loan_application_uuid === app.loan_application_uuid;
            return (
              <button
                key={app.loan_application_uuid}
                onClick={() => setSelectedApp(app)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "14px 20px",
                  background: isActive ? "rgba(49,105,78,0.08)" : "transparent",
                  border: "none",
                  borderLeft: isActive
                    ? "3px solid #31694E"
                    : "3px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: isActive ? "#31694E" : "#1a1a1a",
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {app.loan_type_info?.name || "Loan Application"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: st.bg,
                      color: st.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {st.label}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                  {app.loan_application_uuid?.slice(0, 8).toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MIDDLE — Chat Thread */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fff",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>
            {selectedApp?.loan_type_info?.name || "Chat"}
          </div>
          <div style={{ fontSize: 11, color: "#888" }}>
            Application #
            {selectedApp?.loan_application_uuid?.slice(0, 8).toUpperCase()} ·{" "}
            {selectedApp?.current_step
              ? LOAN_STEP_LABELS[selectedApp.current_step] ||
                selectedApp.current_step
              : "—"}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {chatLoading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 40 }}
            >
              <Spinner />
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
              <Icon.Chat
                width={40}
                height={40}
                style={{ marginBottom: 12, opacity: 0.3 }}
              />
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#bbb",
                  marginBottom: 4,
                }}
              >
                No messages yet
              </div>
              <div style={{ fontSize: 12 }}>
                Start the conversation with your agent about this application.
              </div>
            </div>
          ) : (
            messages.map((m, i) => {
              const isMe = m.sender_role === "applicant" || m.is_me === true;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 8,
                  }}
                >
                  {!isMe && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "linear-gradient(135deg,#31694E,#658C58)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#F0E491",
                        flexShrink: 0,
                      }}
                    >
                      {(m.sender_name || "A")[0]}
                    </div>
                  )}
                  <div style={{ maxWidth: "68%" }}>
                    {!isMe && (
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: "#BBC863",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 4,
                          paddingLeft: 4,
                        }}
                      >
                        {m.sender_name || "Agent"}
                      </div>
                    )}
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: isMe
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                        background: isMe ? "#31694E" : "#f5f6f8",
                        color: isMe ? "#F0E491" : "#1a1a1a",
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
                      {m.content || m.message}
                      {m.message_file && (
                        <a
                          href={m.message_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 6,
                            fontSize: 11,
                            color: isMe ? "#F0E491" : "#31694E",
                            opacity: 0.9,
                          }}
                        >
                          <Icon.Paperclip width={11} height={11} /> Attachment
                        </a>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#aaa",
                        marginTop: 4,
                        textAlign: isMe ? "right" : "left",
                        paddingLeft: isMe ? 0 : 4,
                      }}
                    >
                      {m.created_at
                        ? new Date(m.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #f0f0f0",
            background: "#fff",
          }}
        >
          {attachFile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                marginBottom: 8,
                fontSize: 12,
                color: "#166534",
              }}
            >
              <Icon.Paperclip width={12} height={12} />
              {attachFile.name}
              <button
                onClick={() => setAttachFile(null)}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#999",
                  display: "flex",
                }}
              >
                <Icon.X width={14} height={14} />
              </button>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <input
              type="file"
              ref={fileRef}
              style={{ display: "none" }}
              onChange={(e) => setAttachFile(e.target.files[0] || null)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                padding: 10,
                background: "#f5f6f8",
                border: "1.5px solid #e5e7eb",
                borderRadius: 10,
                cursor: "pointer",
                color: "#666",
                display: "flex",
                flexShrink: 0,
              }}
            >
              <Icon.Paperclip width={16} height={16} />
            </button>
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message…"
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                outline: "none",
                fontSize: 13,
                background: "#fafafa",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={(!newMsg.trim() && !attachFile) || sending}
              style={{
                padding: "10px 16px",
                background: newMsg.trim() || attachFile ? "#31694E" : "#f0f0f0",
                color: newMsg.trim() || attachFile ? "#F0E491" : "#ccc",
                border: "none",
                borderRadius: 10,
                cursor: newMsg.trim() || attachFile ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {sending ? (
                <Spinner size={14} color="#F0E491" />
              ) : (
                <Icon.Send width={14} height={14} />
              )}{" "}
              Send
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT — Application Context Panel */}
      {selectedApp && (
        <div
          style={{
            width: 240,
            flexShrink: 0,
            borderLeft: "1px solid #f0f0f0",
            overflowY: "auto",
            background: "#fafafa",
          }}
        >
          <div
            style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Application Info
            </div>
          </div>
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Application ID
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontFamily: "monospace",
                }}
              >
                {selectedApp.loan_application_uuid?.slice(0, 8).toUpperCase()}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Loan Type
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
                {selectedApp.loan_type_info?.name || "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                Status
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: 99,
                  background: appStatus.bg,
                  color: appStatus.color,
                  textTransform: "uppercase",
                }}
              >
                {appStatus.label}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Current Step
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
                {LOAN_STEP_LABELS[selectedApp.current_step] ||
                  selectedApp.current_step ||
                  "—"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                Completion
              </div>
              <div
                style={{
                  height: 6,
                  background: "#e5e7eb",
                  borderRadius: 99,
                  overflow: "hidden",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${completion}%`,
                    background: "linear-gradient(90deg,#31694E,#BBC863)",
                    borderRadius: 99,
                  }}
                />
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#31694E" }}>
                {completion}%
              </div>
            </div>
            {agentInfo && (
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#BBC863",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 8,
                  }}
                >
                  Assigned Agent
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "linear-gradient(135deg,#31694E,#658C58)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#F0E491",
                      flexShrink: 0,
                    }}
                  >
                    {agentInfo.first_name?.[0]}
                    {agentInfo.last_name?.[0]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#1a1a1a",
                      }}
                    >
                      {agentInfo.first_name} {agentInfo.last_name}
                    </div>
                    <div style={{ fontSize: 10, color: "#888" }}>
                      {agentInfo.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedApp.updated_at && (
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#BBC863",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                  }}
                >
                  Last Updated
                </div>
                <div
                  style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}
                >
                  {new Date(selectedApp.updated_at).toLocaleDateString()}
                </div>
              </div>
            )}
            {selectedApp.current_step &&
              selectedApp.current_step !== "completed" && (
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(240,228,145,0.15)",
                    border: "1px solid #F0E491",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#92400e",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 6,
                    }}
                  >
                    Next Action
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}
                  >
                    {selectedApp.current_step === "document_upload"
                      ? "Upload your required documents to continue."
                      : selectedApp.current_step === "terms_and_conditions"
                        ? "Review and sign your terms & conditions."
                        : selectedApp.current_step === "review_submission"
                          ? "Review your application and submit."
                          : `Complete your ${LOAN_STEP_LABELS[selectedApp.current_step] || "next step"} to progress.`}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW
// FIX 3: Added Edit button to active application card
// ─────────────────────────────────────────────────────────────────────────────
const DashboardView = ({
  user,
  loanTypes,
  loanTypesLoaded,
  onStartApplication,
  onViewApplication,
  onEditApplication,
}) => {
  const [loanSearch, setLoanSearch] = useState("");

  const isNew = user?.is_new === true;
  const agent = user?.assigned_agent_details;
  const prequal = user?.prequalification_loan_type_applied_for;
  const recentApp = user?.recent_active_loan_application;

  const filteredLoans = loanTypes.filter(
    (l) =>
      !loanSearch ||
      l.name?.toLowerCase().includes(loanSearch.toLowerCase()) ||
      l.description?.toLowerCase().includes(loanSearch.toLowerCase()),
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          {isNew
            ? `Welcome, ${user?.first_name}! 👋`
            : `Good to see you, ${user?.first_name}!`}
        </div>
        <div style={{ fontSize: 14, color: "#888" }}>
          {isNew
            ? "You're pre-qualified. Complete your application to get funded."
            : "Here's your current status."}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* PreQual Card — new users */}
        {isNew && prequal && (
          <div
            style={{
              background: "linear-gradient(135deg,#31694E 0%,#4a8c6a 100%)",
              borderRadius: 20,
              padding: "28px",
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(49,105,78,0.25)",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -40,
                top: -40,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#F0E491",
                  marginBottom: 6,
                }}
              >
                Pre-Qualified For
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                {prequal.name || "Loan Product"}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.75)",
                  marginBottom: 20,
                }}
              >
                {prequal.description}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Amount", value: prequal.amount },
                  { label: "Rate", value: `${prequal.rates}%` },
                  { label: "Decision", value: prequal.decision_time },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#F0E491",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onStartApplication(prequal)}
                style={{
                  background: "#F0E491",
                  color: "#31694E",
                  padding: "12px 28px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Start Application <Icon.Arrow width={16} height={16} />
              </button>
            </div>
          </div>
        )}

        {/* FIX 3: Returning user — active app card with Edit button */}
        {!isNew && recentApp && (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              border: "1.5px solid #f0f0f0",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              Active Application
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#1a1a1a",
                marginBottom: 8,
              }}
            >
              {recentApp.loan_type_info?.name || "Application"}
            </div>
            <div
              style={{
                height: 6,
                background: "#f0f0f0",
                borderRadius: 99,
                overflow: "hidden",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${recentApp.completion_percentage ?? 0}%`,
                  background: "linear-gradient(90deg,#31694E,#658C58)",
                  borderRadius: 99,
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>
              {recentApp.completion_percentage ?? 0}% complete
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => onViewApplication(recentApp)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  background: "rgba(49,105,78,0.08)",
                  border: "none",
                  color: "#31694E",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                <Icon.Eye width={14} height={14} /> View
              </button>
              {/* ── FIX 3: Edit button — only shown for draft applications ── */}
              {recentApp.status === "draft" && (
                <button
                  onClick={() => onEditApplication(recentApp)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    background: "none",
                    border: "1.5px solid #e5e7eb",
                    color: "#666",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  <Icon.Edit width={14} height={14} /> Edit
                </button>
              )}
            </div>
          </div>
        )}

        {/* Agent Card */}
        {agent && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              border: "1.5px solid #f0f0f0",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#BBC863",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 12,
              }}
            >
              Your Assigned Agent
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "linear-gradient(135deg,#31694E,#658C58)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F0E491",
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                {agent.first_name?.[0]}
                {agent.last_name?.[0]}
              </div>
              <div>
                <div
                  style={{ fontWeight: 800, color: "#1a1a1a", fontSize: 15 }}
                >
                  {agent.first_name} {agent.last_name}
                </div>
                <Badge color="#658C58" bg="rgba(101,140,88,0.1)">
                  {agent.role}
                </Badge>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#555" }}>📧 {agent.email}</div>
          </div>
        )}
      </div>

      {/* Loan Types */}
      <div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 16,
          }}
        >
          Explore Loan Types
        </div>
        {loanTypesLoaded && loanTypes.length > 0 && (
          <div style={{ marginBottom: 16, position: "relative" }}>
            <Icon.Search
              width={16}
              height={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
              }}
            />
            <input
              value={loanSearch}
              onChange={(e) => setLoanSearch(e.target.value)}
              placeholder="Search loan types…"
              style={{ ...inputBase, paddingLeft: 40 }}
            />
          </div>
        )}
        {!loanTypesLoaded && (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 40 }}
          >
            <Spinner />
          </div>
        )}
        {loanTypesLoaded && filteredLoans.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: 16,
            }}
          >
            {filteredLoans.map((loan) => (
              <div
                key={loan.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 20,
                  border: "1.5px solid #f0f0f0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#31694E";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(49,105,78,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#1a1a1a",
                    marginBottom: 6,
                  }}
                >
                  {loan.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#888",
                    marginBottom: 16,
                    minHeight: 32,
                  }}
                >
                  {loan.description}
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#BBC863",
                        textTransform: "uppercase",
                      }}
                    >
                      Rate
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#31694E",
                      }}
                    >
                      {loan.rates}%
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#BBC863",
                        textTransform: "uppercase",
                      }}
                    >
                      Amount
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#31694E",
                      }}
                    >
                      {loan.amount}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#888",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Icon.Clock width={12} height={12} /> {loan.decision_time}
                  </div>
                  <button
                    onClick={() => onStartApplication(loan)}
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#31694E",
                      background: "rgba(49,105,78,0.08)",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Apply <Icon.Arrow width={12} height={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {loanTypesLoaded && loanTypes.length === 0 && (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              border: "2px dashed #e5e7eb",
              borderRadius: 16,
              color: "#bbb",
              fontSize: 13,
            }}
          >
            No loan types available at this time.
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION LIST VIEW
// ─────────────────────────────────────────────────────────────────────────────
const ApplicationListView = ({
  apps,
  loading,
  onReview,
  onEdit,
  onChat,
  onNew,
}) => {
  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Spinner size={32} />
      </div>
    );

  if (!apps || apps.length === 0)
    return (
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 20,
          }}
        >
          My Applications
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 60,
            border: "2px dashed #e5e7eb",
            borderRadius: 20,
            color: "#ccc",
            textAlign: "center",
          }}
        >
          <Icon.File
            width={48}
            height={48}
            style={{ marginBottom: 16, opacity: 0.4 }}
          />
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#aaa",
              marginBottom: 8,
            }}
          >
            No Applications Yet
          </div>
          <div style={{ fontSize: 13, color: "#bbb", marginBottom: 20 }}>
            Complete the wizard on your dashboard to start an application.
          </div>
          <button
            onClick={onNew}
            style={{
              background: "#31694E",
              color: "#F0E491",
              padding: "12px 28px",
              borderRadius: 12,
              border: "none",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Start Application
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>
          My Applications
        </div>
        <button
          onClick={onNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#31694E",
            color: "#F0E491",
            padding: "10px 20px",
            borderRadius: 10,
            border: "none",
            fontWeight: 800,
            fontSize: 12,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <Icon.Plus width={14} height={14} /> New Application
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {apps.map((app) => {
          const status = STATUS_META[app?.status] || STATUS_META.draft;
          const stepIndex = STEPS_ORDER.indexOf(
            app?.current_step ?? "business_information",
          );
          const progress =
            app?.completion_percentage ??
            Math.round(((stepIndex + 1) / STEPS_ORDER.length) * 100);
          const canEdit = app?.status === "draft";
          return (
            <div
              key={app.loan_application_uuid}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 24px",
                border: "1.5px solid #f0f0f0",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#1a1a1a",
                      marginBottom: 4,
                    }}
                  >
                    {app?.loan_type_info?.name || "Loan Application"}
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>
                    #{app?.loan_application_uuid?.slice(0, 8).toUpperCase()} ·{" "}
                    {app?.submitted_at
                      ? "Submitted " +
                        new Date(app.submitted_at).toLocaleDateString()
                      : "Not yet submitted"}
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: status.color,
                    background: status.bg,
                  }}
                >
                  {status.label}
                </span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 11,
                    color: "#888",
                  }}
                >
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#f0f0f0",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "linear-gradient(90deg,#31694E,#BBC863)",
                      borderRadius: 99,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                {STEPS_ORDER.slice(0, 5).map((s, i) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 99,
                      fontWeight: 700,
                      background:
                        i <= stepIndex ? "rgba(49,105,78,0.12)" : "#f5f5f5",
                      color: i <= stepIndex ? "#31694E" : "#bbb",
                    }}
                  >
                    {LOAN_STEP_LABELS[s]}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => onReview(app)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    background: "rgba(49,105,78,0.08)",
                    border: "none",
                    color: "#31694E",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  <Icon.Eye width={14} height={14} /> Review
                </button>
                {canEdit && (
                  <button
                    onClick={() => onEdit(app)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      background: "none",
                      border: "1.5px solid #e5e7eb",
                      color: "#666",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    <Icon.Edit width={14} height={14} /> Edit
                  </button>
                )}
                <button
                  onClick={() => onChat(app)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    background: "none",
                    border: "1.5px solid #e5e7eb",
                    color: "#658C58",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  <Icon.Chat width={14} height={14} /> Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE VIEW
// ─────────────────────────────────────────────────────────────────────────────
const ProfileView = ({ user }) => {
  const fields = [
    { label: "Email Address", value: user?.email },
    { label: "Phone Number", value: user?.phone || "—" },
    { label: "Username", value: user?.username },
    {
      label: "Qualification",
      value: user?.is_qualified ? "✓ Fully Qualified" : "Pending",
    },
  ];
  return (
    <div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#1a1a1a",
          marginBottom: 20,
        }}
      >
        My Profile
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #f0f0f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 80,
            background: "linear-gradient(135deg,#31694E 0%,#658C58 100%)",
          }}
        />
        <div style={{ padding: "0 28px 28px", marginTop: -40 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "#F0E491",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#31694E",
              border: "4px solid #fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              marginBottom: 16,
            }}
          >
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 4,
            }}
          >
            {user?.first_name} {user?.last_name}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {user?.is_qualified && (
              <Badge color="#22c55e" bg="rgba(34,197,94,0.1)">
                Qualified
              </Badge>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: 20,
            }}
          >
            {fields.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: 16,
                  background: "#FAFDF8",
                  borderRadius: 12,
                  border: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#BBC863",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Icon.Home },
  { id: "application", label: "Applications", icon: Icon.File },
  { id: "chat", label: "Chat", icon: Icon.Chat },
  { id: "profile", label: "My Profile", icon: Icon.User },
];

const Sidebar = ({ activeTab, setActiveTab, user, onClose, isMobile }) => (
  <aside
    style={{
      width: 240,
      height: "100%",
      background: "#1c3e2c",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      position: isMobile ? "fixed" : "relative",
      zIndex: isMobile ? 100 : "auto",
      top: 0,
      left: 0,
      bottom: 0,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
        paddingLeft: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon.Leaf width={28} height={28} style={{ color: "#F0E491" }} />
        <span
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#F0E491",
            letterSpacing: "-0.04em",
          }}
        >
          Kacu
        </span>
      </div>
      {isMobile && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <Icon.X width={20} height={20} />
        </button>
      )}
    </div>
    <div
      style={{
        padding: "12px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: 12,
        marginBottom: 24,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
        {user?.first_name} {user?.last_name}
      </div>
      <div
        style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}
      >
        {user?.email}
      </div>
    </div>
    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
      {NAV_ITEMS.map(({ id, label, icon: NavIcon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              if (isMobile) onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 16px",
              borderRadius: 12,
              border: "none",
              background: active ? "rgba(240,228,145,0.15)" : "transparent",
              color: active ? "#F0E491" : "rgba(255,255,255,0.5)",
              fontWeight: active ? 800 : 600,
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              borderLeft: active
                ? "3px solid #F0E491"
                : "3px solid transparent",
            }}
          >
            <NavIcon width={18} height={18} /> {label}
          </button>
        );
      })}
    </nav>
    <button
      onClick={() => {
        document.cookie =
          "kacu_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict";
        document.cookie =
          "kacu_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict";
        window.location.href = "/login";
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 12,
        border: "none",
        background: "transparent",
        color: "#ef9494",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 13,
        width: "100%",
      }}
    >
      <Icon.Logout width={18} height={18} /> Sign Out
    </button>
  </aside>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [appList, setAppList] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loanTypesLoaded, setLoanTypesLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [pageView, setPageView] = useState(null);
  const [pageViewData, setPageViewData] = useState(null);

  const fetchUser = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const userData = await apiGet("/user-profile/me/");
      setUser(userData);
    } catch (e) {
      logError("fetchUser failed", e);
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchApps = useCallback(async () => {
    try {
      const apps = await apiGet("/application/");
      setAppList(Array.isArray(apps) ? apps : apps?.results || []);
    } catch (e) {
      logError("fetchApps failed", e);
    }
  }, []);

  const fetchLoanTypes = useCallback(async () => {
    if (loanTypesLoaded) return;
    try {
      const res = await apiGet("/loan-types/");
      setLoanTypes(res?.data || res || []);
    } catch (e) {
      logError("fetchLoanTypes failed", e);
    } finally {
      setLoanTypesLoaded(true);
    }
  }, [loanTypesLoaded]);

  const fetchAppDetail = async (app) => {
    try {
      return await apiGet(`/application/${app.loan_application_uuid}/`);
    } catch (e) {
      logError("fetchAppDetail failed", e);
      return app;
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  useEffect(() => {
    if (activeTab === "dashboard") fetchLoanTypes();
    if (activeTab === "application" || activeTab === "chat") fetchApps();
  }, [activeTab]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Dancing+Script:wght@700&family=Great+Vibes&family=Pacifico&display=swap');
      @keyframes kacu-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: #f5f6f8; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 99px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ── FULL-PAGE VIEW ROUTES
  if (pageView === "apply") {
    return (
      <ApplicationWizardPage
        onClose={() => setPageView(null)}
        onComplete={() => {
          setPageView(null);
          setActiveTab("application");
          fetchUser(true);
          fetchApps();
        }}
        prequalData={pageViewData}
        loanTypes={loanTypes}
      />
    );
  }

  if (pageView === "review") {
    return (
      <ReviewApplicationPage
        app={pageViewData}
        onClose={() => {
          setPageView(null);
          setActiveTab("application");
        }}
      />
    );
  }

  if (pageView === "edit") {
    return (
      <EditApplicationPage
        app={pageViewData}
        onClose={() => {
          setPageView(null);
          setActiveTab("application");
          fetchApps();
        }}
        onComplete={() => {
          setPageView(null);
          setActiveTab("application");
          fetchApps();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f6f8",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <Icon.Leaf width={32} height={32} style={{ color: "#31694E" }} />
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#31694E",
              letterSpacing: "-0.04em",
            }}
          >
            Kacu
          </span>
        </div>
        <Spinner size={36} color="#31694E" />
        <div style={{ fontSize: 13, color: "#888" }}>
          Loading your dashboard…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f6f8",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>
          Failed to load dashboard
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#888",
            maxWidth: 320,
            textAlign: "center",
          }}
        >
          {error}
        </div>
        <button
          onClick={() => fetchUser()}
          style={{
            padding: "10px 24px",
            background: "#31694E",
            color: "white",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f6f8",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Desktop Sidebar */}
      <div style={{ width: 240, flexShrink: 0 }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 240,
            height: "100vh",
          }}
        >
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            onClose={() => setSidebarOpen(false)}
            isMobile={false}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: 260,
            }}
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              user={user}
              onClose={() => setSidebarOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        style={{ flex: 1, minWidth: 0, padding: "24px", overflowX: "hidden" }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="kacu-menu-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              borderRadius: 10,
              cursor: "pointer",
              color: "#31694E",
            }}
          >
            <Icon.Menu width={20} height={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => fetchUser(true)}
              disabled={refreshing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                border: "1.5px solid #e5e7eb",
                background: "#fff",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                color: "#31694E",
                cursor: "pointer",
              }}
            >
              <Icon.Refresh
                width={14}
                height={14}
                style={{
                  animation: refreshing
                    ? "kacu-spin 0.8s linear infinite"
                    : "none",
                }}
              />{" "}
              Refresh
            </button>
            <div
              style={{
                width: 36,
                height: 36,
                background: "#F0E491",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#31694E",
              }}
            >
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ maxWidth: 1100 }}>
          {activeTab === "dashboard" && (
            <DashboardView
              user={user}
              loanTypes={loanTypes}
              loanTypesLoaded={loanTypesLoaded}
              onStartApplication={(loan) => {
                setPageViewData(loan);
                setPageView("apply");
              }}
              onViewApplication={async (app) => {
                const detail = await fetchAppDetail(app);
                setPageViewData(detail);
                setPageView("review");
              }}
              onEditApplication={async (app) => {
                const detail = await fetchAppDetail(app);
                setPageViewData(detail);
                setPageView("edit");
              }}
            />
          )}

          {activeTab === "application" && (
            <ApplicationListView
              apps={appList}
              loading={false}
              onReview={async (app) => {
                const detail = await fetchAppDetail(app);
                setPageViewData(detail);
                setPageView("review");
              }}
              onEdit={async (app) => {
                const detail = await fetchAppDetail(app);
                setPageViewData(detail);
                setPageView("edit");
              }}
              onNew={() => {
                setPageViewData(user?.prequalification_loan_type_applied_for);
                setPageView("apply");
              }}
              onChat={(app) => {
                setActiveTab("chat");
              }}
            />
          )}

          {activeTab === "chat" && <ChatSection applications={appList} />}
          {activeTab === "profile" && <ProfileView user={user} />}
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) { .kacu-menu-btn { display: flex !important; } main { padding: 16px !important; } }
        @media (min-width: 901px) { .kacu-menu-btn { display: none !important; } }
      `}</style>
    </div>
  );
}
