import React, { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const log = (label, data) => {
  console.log(
    `%c[KACU DEBUG] ${label}`,
    "color:#31694E;font-weight:bold;",
    data ?? "",
  );
};
const logError = (label, err) => {
  console.error(
    `%c[KACU ERROR] ${label}`,
    "color:#e53935;font-weight:bold;",
    err,
  );
};

const STATUS_META = {
  draft: { label: "Draft", color: "#BBC863", bg: "#F0E491" },
  submitted: { label: "Submitted", color: "#3b82f6", bg: "#dbeafe" },
  pending: { label: "Pending", color: "#f59e0b", bg: "#fef3c7" },
  approved: { label: "Approved", color: "#22c55e", bg: "#dcfce7" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "#fee2e2" },
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

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ children, color = "#31694E", bg = "#F0E491" }) => (
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
  Folder: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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
};

// ─────────────────────────────────────────────────────────────────────────────
// API LAYER
// ─────────────────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

const safeJson = async (res) => {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    log("Non-JSON response body", text.slice(0, 200));
    return null;
  }
  return res.json();
};

const apiGet = async (path) => {
  log(`GET ${path}`, null);
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  const data = await safeJson(res);
  log(`RESPONSE ${path}`, data);
  if (!res.ok)
    throw new Error(data?.detail || `HTTP ${res.status} on GET ${path}`);
  return data;
};

const apiPost = async (path, body) => {
  log(`POST ${path}`, body);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const data = await safeJson(res);
  log(`POST RESPONSE ${path}`, data);
  if (!res.ok)
    throw new Error(
      data?.detail ||
        JSON.stringify(data) ||
        `HTTP ${res.status} on POST ${path}`,
    );
  return data;
};

const apiPatch = async (path, body) => {
  log(`PATCH ${path}`, body);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const data = await safeJson(res);
  log(`PATCH RESPONSE ${path}`, data);
  if (!res.ok)
    throw new Error(
      data?.detail ||
        JSON.stringify(data) ||
        `HTTP ${res.status} on PATCH ${path}`,
    );
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD FORM PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 5;

const WizardField = ({ label, children, span = 1 }) => (
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
    </label>
    {children}
  </div>
);

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

const WizardInput = (props) => (
  <input
    {...props}
    style={{ ...inputBase, ...props.style }}
    onFocus={(e) => (e.target.style.borderColor = "#31694E")}
    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
  />
);

const WizardSelect = ({ children, ...props }) => (
  <select
    {...props}
    style={{ ...inputBase, appearance: "none", cursor: "pointer" }}
  >
    {children}
  </select>
);

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW PAGE PRIMITIVES — hoisted to module level to fix ESLint errors
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
// APPLICATION WIZARD — FULL PAGE (not modal)
// ─────────────────────────────────────────────────────────────────────────────
const ApplicationWizardPage = ({
  onClose,
  onComplete,
  prequalData,
  loanTypes,
}) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    loan_type: prequalData?.id || loanTypes?.[0]?.id || 1,
    is_dba: false,
    business_legal_name: "",
    business_dba_name: "",
    business_email: "",
    business_phone_number: "",
    business_website: "",
    business_country: "US",
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
    loan_amount_requested: prequalData?.amount?.replace(/[^0-9]/g, "") || "",
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
    owner_country: "US",
    owner_percentage_of_ownership: "",
    owner_credit_score: "",
    signature_name: "",
    terms_accepted: false,
  });

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onComplete(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const grid2 = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
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
              padding: "6px 0",
            }}
          >
            <Icon.Back width={18} height={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>
            Loan Application
          </div>
        </div>
        {/* Step Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
                onClick={() => i < step && setStep(i)}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background:
                      i < step ? "#31694E" : i === step ? "#31694E" : "#f0f0f0",
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
              </div>
              {i < 5 && (
                <div
                  style={{
                    width: 32,
                    height: 2,
                    background: i < step ? "#31694E" : "#f0f0f0",
                    borderRadius: 99,
                    transition: "background 0.3s",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
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
                  <WizardField label="Legal Business Name">
                    <WizardInput
                      name="business_legal_name"
                      value={formData.business_legal_name}
                      onChange={set}
                      placeholder="Acme Corp LLC"
                    />
                  </WizardField>
                  <WizardField label="Business Email">
                    <WizardInput
                      name="business_email"
                      type="email"
                      value={formData.business_email}
                      onChange={set}
                      placeholder="contact@business.com"
                    />
                  </WizardField>
                  <WizardField label="Phone Number">
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
                    <WizardField label="DBA Name">
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

            {/* STEP 2 — Operational Data */}
            {step === 2 && (
              <div>
                {sectionHeader(
                  2,
                  "Operational Data",
                  "Physical location, legal structure, and financials.",
                )}
                <div style={grid2}>
                  <WizardField label="Street Address" span={2}>
                    <WizardInput
                      name="business_address"
                      value={formData.business_address}
                      onChange={set}
                      placeholder="123 Main St"
                    />
                  </WizardField>
                  <WizardField label="City">
                    <WizardInput
                      name="business_city"
                      value={formData.business_city}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="State / Province">
                    <WizardInput
                      name="business_state"
                      value={formData.business_state}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Zip Code">
                    <WizardInput
                      name="business_zip_code"
                      value={formData.business_zip_code}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Industry Type">
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
                  <WizardField label="Avg. Gross Monthly Sales ($)" span={2}>
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
              </div>
            )}

            {/* STEP 3 — Funding */}
            {step === 3 && (
              <div>
                {sectionHeader(
                  3,
                  "Funding & Financials",
                  "Tell us how much you need and current debt obligations.",
                )}
                <div style={grid2}>
                  <WizardField label="Requested Amount ($)">
                    <WizardInput
                      name="loan_amount_requested"
                      type="number"
                      value={formData.loan_amount_requested}
                      onChange={set}
                      style={{ fontWeight: 700 }}
                    />
                  </WizardField>
                  <WizardField label="Requested Term">
                    <WizardInput
                      name="loan_term_requested"
                      value={formData.loan_term_requested}
                      onChange={set}
                      placeholder="e.g. 24 Months"
                    />
                  </WizardField>
                  <WizardField label="Purpose of Loan" span={2}>
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

            {/* STEP 4 — Owner Info */}
            {step === 4 && (
              <div>
                {sectionHeader(
                  4,
                  "Primary Owner Details",
                  "Personal information required for credit assessment.",
                )}
                <div style={grid2}>
                  <WizardField label="First Name">
                    <WizardInput
                      name="owner_first_name"
                      value={formData.owner_first_name}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Last Name">
                    <WizardInput
                      name="owner_last_name"
                      value={formData.owner_last_name}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Email">
                    <WizardInput
                      name="owner_email"
                      type="email"
                      value={formData.owner_email}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Phone">
                    <WizardInput
                      name="owner_phone_number"
                      value={formData.owner_phone_number}
                      onChange={set}
                      placeholder="+1 234 567 8900"
                    />
                  </WizardField>
                  <WizardField label="SSN">
                    <WizardInput
                      name="owner_ssn"
                      value={formData.owner_ssn}
                      onChange={set}
                      placeholder="XXX-XX-XXXX"
                    />
                  </WizardField>
                  <WizardField label="Date of Birth">
                    <WizardInput
                      name="owner_date_of_birth"
                      type="date"
                      value={formData.owner_date_of_birth}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Ownership %">
                    <WizardInput
                      name="owner_percentage_of_ownership"
                      type="number"
                      value={formData.owner_percentage_of_ownership}
                      onChange={set}
                      placeholder="51"
                    />
                  </WizardField>
                  <WizardField label="Credit Score (Est.)">
                    <WizardInput
                      name="owner_credit_score"
                      type="number"
                      value={formData.owner_credit_score}
                      onChange={set}
                      placeholder="700"
                    />
                  </WizardField>
                  <WizardField label="Home Address" span={2}>
                    <WizardInput
                      name="owner_address"
                      value={formData.owner_address}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="City">
                    <WizardInput
                      name="owner_city"
                      value={formData.owner_city}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="State">
                    <WizardInput
                      name="owner_state"
                      value={formData.owner_state}
                      onChange={set}
                    />
                  </WizardField>
                  <WizardField label="Zip Code">
                    <WizardInput
                      name="owner_zip_code"
                      value={formData.owner_zip_code}
                      onChange={set}
                    />
                  </WizardField>
                </div>
              </div>
            )}

            {/* STEP 5 — Review & Sign */}
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
                  Review & Sign
                </div>
                <div
                  style={{ fontSize: 14, color: "#658C58", marginBottom: 32 }}
                >
                  Please review your details before final submission.
                </div>
                <div
                  style={{
                    maxWidth: 480,
                    margin: "0 auto 28px",
                    padding: 24,
                    background: "#FAFDF8",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 16,
                    textAlign: "left",
                  }}
                >
                  {[
                    ["Business", formData.business_legal_name || "—"],
                    ["Email", formData.business_email || "—"],
                    ["Industry", formData.business_industry_type || "—"],
                    [
                      "Amount Requested",
                      formData.loan_amount_requested
                        ? `$${Number(formData.loan_amount_requested).toLocaleString()}`
                        : "—",
                    ],
                    ["Term", formData.loan_term_requested || "—"],
                    [
                      "Owner",
                      `${formData.owner_first_name} ${formData.owner_last_name}`.trim() ||
                        "—",
                    ],
                    ["Owner Email", formData.owner_email || "—"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: "1px solid #f0f0f0",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#888" }}>
                        {k}
                      </span>
                      <span style={{ fontWeight: 700, color: "#31694E" }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    justifyContent: "center",
                    marginBottom: 24,
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
                <div style={{ maxWidth: 340, margin: "0 auto" }}>
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
                  <WizardInput
                    name="signature_name"
                    value={formData.signature_name}
                    onChange={set}
                    placeholder="John Doe"
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Nav */}
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
              onClick={() => setStep((s) => s - 1)}
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
            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep((s) => s + 1)}
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
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Continue <Icon.ChevRight width={16} height={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.terms_accepted ||
                  !formData.signature_name ||
                  submitting
                }
                style={{
                  background:
                    !formData.terms_accepted || !formData.signature_name
                      ? "#ccc"
                      : "#22c55e",
                  color: "white",
                  padding: "14px 44px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor:
                    !formData.terms_accepted || !formData.signature_name
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {submitting ? (
                  <>
                    <Spinner size={16} color="#fff" /> Submitting…
                  </>
                ) : (
                  <>
                    <Icon.Check width={16} height={16} /> Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT WIZARD — pre-fills existing data for updating sections
// ─────────────────────────────────────────────────────────────────────────────
const EditApplicationPage = ({ app, onClose, onComplete }) => {
  const uuid = app?.loan_application_uuid;
  const [activeSection, setActiveSection] = useState("business");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const biz = app?.business_information || {};
  const fund = app?.funding_information || {};
  const owner = app?.owner_information?.[0] || {};

  const [bizData, setBizData] = useState({
    business_legal_name: biz.business_legal_name || "",
    business_dba_name: biz.business_dba_name || "",
    business_email: biz.business_email || "",
    business_phone_number: biz.business_phone_number || "",
    business_website: biz.business_website || "",
    business_country: biz.business_country || "US",
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
    owner_country: owner.owner_country || "US",
    owner_percentage_of_ownership: owner.owner_percentage_of_ownership || "",
    owner_credit_score: owner.owner_credit_score || "",
  });

  const setField = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const flash = (msg, type = "success") => {
    setSaveMsg({ msg, type });
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const saveBiz = async () => {
    setSaving(true);
    try {
      await apiPatch(`/application/business-information/${uuid}/update/`, {
        ...bizData,
        loan_application_uuid: uuid,
      });
      flash("Business information updated");
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const saveFund = async () => {
    setSaving(true);
    try {
      await apiPatch(`/application/funding-information/${uuid}/update/`, {
        ...fundData,
        loan_application_uuid: uuid,
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
        });
      } else {
        await apiPost(`/application/owner-information/create`, {
          ...ownerData,
          loan_application_uuid: uuid,
        });
      }
      flash("Owner information updated");
    } catch (e) {
      flash(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const grid2 = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  };
  const SECTIONS = [
    { id: "business", label: "Business Info" },
    { id: "funding", label: "Funding" },
    { id: "owner", label: "Owner Details" },
  ];

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
        {/* Sidebar */}
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
                onClick={() => setActiveSection(s.id)}
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
                  transition: "all 0.15s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Area */}
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
            {activeSection === "business" && (
              <div>
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
                  Business Information
                </div>
                <div style={grid2}>
                  <WizardField label="Legal Business Name">
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
                <div
                  style={{
                    marginTop: 28,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={saveBiz}
                    disabled={saving}
                    style={{
                      background: "#31694E",
                      color: "#F0E491",
                      padding: "12px 32px",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
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
            )}

            {activeSection === "funding" && (
              <div>
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
                  Funding Information
                </div>
                <div style={grid2}>
                  <WizardField label="Amount Requested ($)">
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
                <div
                  style={{
                    marginTop: 28,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={saveFund}
                    disabled={saving}
                    style={{
                      background: "#31694E",
                      color: "#F0E491",
                      padding: "12px 32px",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
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
            )}

            {activeSection === "owner" && (
              <div>
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
                  Owner Details
                </div>
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
                </div>
                <div
                  style={{
                    marginTop: 28,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={saveOwner}
                    disabled={saving}
                    style={{
                      background: "#31694E",
                      color: "#F0E491",
                      padding: "12px 32px",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW PAGE — full page detail view for an application
// NOTE: Section and Field are now ReviewSection and ReviewField above (module-level)
// ─────────────────────────────────────────────────────────────────────────────
const ReviewApplicationPage = ({ app, onClose, onEdit }) => {
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
            <Icon.Back width={18} height={18} /> Back to Applications
          </button>
          <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>
            Application Review
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onEdit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 20px",
              background: "none",
              border: "1.5px solid #31694E",
              color: "#31694E",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Icon.Edit width={14} height={14} /> Edit Application
          </button>
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
            background: "linear-gradient(135deg, #1c3e2c 0%, #31694E 100%)",
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
              {app?.loan_type?.name || "Loan Application"}
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
          <div>
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
                background: "linear-gradient(90deg, #31694E, #BBC863)",
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

        {/* Sections — using ReviewSection and ReviewField (module-level) */}
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
          <ReviewSection title="Terms & Conditions">
            <ReviewField label="Signature" value={terms.signature_name} />
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
          </ReviewSection>
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
                <span style={{ fontSize: 11, color: "#888" }}>
                  {doc.uploaded_at
                    ? new Date(doc.uploaded_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────────────
const DashboardView = ({ user, appData, loanTypes, onStartApplication }) => {
  const isNew = user?.is_new === true || !appData;
  const agent = user?.assigned_agent_details;
  const prequal = user?.prequalification_loan_type_applied_for;
  const otherLoans = loanTypes?.filter((l) => l.id !== prequal?.id) || [];

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
          You are very close to getting funded. Complete your application below.
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
        {/* Prequal Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #31694E 0%, #4a8c6a 100%)",
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
              {prequal?.name || "Loan Product"}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
                marginBottom: 20,
              }}
            >
              {prequal?.description}
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
                { label: "Amount", value: prequal?.amount },
                { label: "Rate", value: `${prequal?.rates}%` },
                { label: "Decision", value: prequal?.decision_time },
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
                    style={{ fontSize: 20, fontWeight: 800, color: "#F0E491" }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
            {isNew && (
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
            )}
          </div>
        </div>

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
                {agent?.first_name?.[0]}
                {agent?.last_name?.[0]}
              </div>
              <div>
                <div
                  style={{ fontWeight: 800, color: "#1a1a1a", fontSize: 15 }}
                >
                  {agent?.first_name} {agent?.last_name}
                </div>
                <Badge color="#658C58" bg="rgba(101,140,88,0.1)">
                  {agent?.role}
                </Badge>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
              📧 {agent?.email}
            </div>
            <button
              style={{
                marginTop: 12,
                width: "100%",
                padding: "10px",
                borderRadius: 10,
                border: "1.5px solid #31694E",
                background: "transparent",
                color: "#31694E",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Send Message
            </button>
          </div>
        )}
      </div>

      {appData && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            border: "1.5px solid #f0f0f0",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Active Application
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>
                {appData?.loan_type_info?.name || "Application"}
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
                color: STATUS_META[appData?.status]?.color || "#888",
                background: `${STATUS_META[appData?.status]?.color || "#888"}18`,
              }}
            >
              {STATUS_META[appData?.status]?.label || appData?.status}
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "#f0f0f0",
              borderRadius: 99,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${appData?.completion_percentage ?? 0}%`,
                background: "linear-gradient(90deg, #31694E, #658C58)",
                borderRadius: 99,
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: "#888" }}>
            {appData?.completion_percentage ?? 0}% complete
          </div>
        </div>
      )}

      {otherLoans.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 14,
            }}
          >
            Other Loan Types
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {otherLoans.map((loan) => (
              <div
                key={loan.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "20px",
                  border: "1.5px solid #f0f0f0",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#31694E";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(49,105,78,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.04)";
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
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION LIST VIEW
// ─────────────────────────────────────────────────────────────────────────────
const ApplicationListView = ({ apps, loading, onReview, onEdit, onNew }) => {
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
                    Submitted:{" "}
                    {app?.submitted_at
                      ? new Date(app.submitted_at).toLocaleDateString()
                      : "Not yet submitted"}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: status.color,
                      background: `${status.color}18`,
                    }}
                  >
                    {status.label}
                  </span>
                </div>
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
                      background: "linear-gradient(90deg, #31694E, #BBC863)",
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
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => onReview(app)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 18px",
                    background: "rgba(49,105,78,0.08)",
                    border: "none",
                    color: "#31694E",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  <Icon.Eye width={14} height={14} /> Review
                </button>
                {app?.status === "draft" && (
                  <button
                    onClick={() => onEdit(app)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 18px",
                      background: "none",
                      border: "1.5px solid #e5e7eb",
                      color: "#666",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <Icon.Edit width={14} height={14} /> Edit
                  </button>
                )}
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
            background: "linear-gradient(135deg, #31694E 0%, #658C58 100%)",
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
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {fields.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: "16px",
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
// PLACEHOLDER VIEW
// ─────────────────────────────────────────────────────────────────────────────
const PlaceholderView = ({ icon: IconComp, title, desc }) => (
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
      minHeight: 300,
    }}
  >
    <IconComp
      width={48}
      height={48}
      style={{ marginBottom: 16, opacity: 0.4 }}
    />
    <div
      style={{ fontSize: 18, fontWeight: 800, color: "#aaa", marginBottom: 8 }}
    >
      {title}
    </div>
    <div style={{ fontSize: 13, color: "#bbb" }}>{desc}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Icon.Home },
  { id: "application", label: "Applications", icon: Icon.File },
  { id: "documents", label: "Documents", icon: Icon.Folder },
  { id: "messages", label: "Messages", icon: Icon.Chat },
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
        padding: "12px 12px",
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
            <NavIcon width={18} height={18} />
            {label}
          </button>
        );
      })}
    </nav>
    <button
      onClick={() => {
        localStorage.clear();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [pageView, setPageView] = useState(null);
  const [pageViewData, setPageViewData] = useState(null);

  // suppress unused warning — ref kept for future use
  const _bottomRef = useRef(null);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const [userData, apps, ltRes] = await Promise.all([
        apiGet("/user-profile/me/"),
        apiGet("/application/"),
        apiGet("/loan-types/"),
      ]);
      setUser(userData);
      const appArr = Array.isArray(apps) ? apps : apps?.results || [];
      setAppList(appArr);
      setLoanTypes(ltRes?.data || []);
    } catch (e) {
      logError("fetchAll failed", e);
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchAppDetail = async (app) => {
    try {
      const detail = await apiGet(`/application/${app.loan_application_uuid}/`);
      return detail;
    } catch (e) {
      logError("fetchAppDetail failed", e);
      return app;
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
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

  const handleSubmitApplication = async (formData) => {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    try {
      const coreRes = await fetch(`${API_BASE}/application/create/`, {
        method: "POST",
        headers,
        body: JSON.stringify({ loan_type: formData.loan_type }),
      });
      const core = await coreRes.json();
      if (!coreRes.ok)
        throw new Error(core?.detail || "Failed to create application");
      const uuid = core.loan_application_uuid;

      const bizRes = await fetch(
        `${API_BASE}/application/business-information/create/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ ...formData, loan_application_uuid: uuid }),
        },
      );
      const bizData = await bizRes.json();
      if (!bizRes.ok) logError("Business info failed", bizData);

      const fundRes = await fetch(
        `${API_BASE}/application/funding-information/create/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ ...formData, loan_application_uuid: uuid }),
        },
      );
      const fundData = await fundRes.json();
      if (!fundRes.ok) logError("Funding info failed", fundData);

      const ownerRes = await fetch(
        `${API_BASE}/application/owner-information/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ ...formData, loan_application_uuid: uuid }),
        },
      );
      const ownerData = await ownerRes.json();
      if (!ownerRes.ok) logError("Owner info failed", ownerData);

      const termsRes = await fetch(
        `${API_BASE}/application/terms-and-conditions/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            loan_application_uuid: uuid,
            signature_name: formData.signature_name,
            terms_accepted: formData.terms_accepted,
          }),
        },
      );
      const termsData = await termsRes.json();
      if (!termsRes.ok) logError("Terms failed", termsData);

      setPageView(null);
      alert("✅ Application Submitted Successfully!");
      fetchAll(true);
    } catch (e) {
      logError("Submission failed", e);
      alert("❌ " + e.message);
    }
  };

  // ── FULL-PAGE VIEWS
  if (pageView === "apply") {
    return (
      <ApplicationWizardPage
        onClose={() => setPageView(null)}
        onComplete={handleSubmitApplication}
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
        onEdit={async () => {
          const detail = await fetchAppDetail(pageViewData);
          setPageViewData(detail);
          setPageView("edit");
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
          fetchAll(true);
        }}
        onComplete={() => {
          setPageView(null);
          setActiveTab("application");
          fetchAll(true);
        }}
      />
    );
  }

  if (loading)
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

  if (error)
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
          onClick={() => fetchAll()}
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

  const appData = appList[0] || null;

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

      {/* Mobile Sidebar */}
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
            className="kacu-menu-btn"
          >
            <Icon.Menu width={20} height={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => fetchAll(true)}
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
              appData={appData}
              loanTypes={loanTypes}
              onStartApplication={(loan) => {
                setPageViewData(loan);
                setPageView("apply");
              }}
            />
          )}
          {activeTab === "profile" && <ProfileView user={user} />}
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
            />
          )}
          {activeTab === "documents" && (
            <PlaceholderView
              icon={Icon.Upload}
              title="Document Portal"
              desc="Upload and manage your application documents here. Coming soon."
            />
          )}
          {activeTab === "messages" && (
            <PlaceholderView
              icon={Icon.Chat}
              title="Agent Messaging"
              desc="Chat directly with your assigned agent. Coming soon."
            />
          )}
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .kacu-sidebar-desktop { display: none !important; }
          .kacu-menu-btn { display: flex !important; }
          main { padding: 16px !important; }
        }
        @media (min-width: 901px) {
          .kacu-menu-btn { display: none !important; }
        }
        @media (max-width: 640px) {
          .kacu-grid-top { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
