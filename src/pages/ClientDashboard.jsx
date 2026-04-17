import React, { useState, useEffect, useCallback } from "react";

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
  draft: { label: "Draft", color: "#BBC863", bg: "#F0E491/20" },
  submitted: { label: "Submitted", color: "#3b82f6", bg: "#eff6ff" },
  pending: { label: "Pending", color: "#f59e0b", bg: "#fffbeb" },
  approved: { label: "Approved", color: "#22c55e", bg: "#f0fdf4" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "#fef2f2" },
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

// Icons (inline SVGs to avoid import issues)
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
  Percent: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// API LAYER
// ─────────────────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

const apiGet = async (path) => {
  log(`GET ${path}`, null);
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  const data = await res.json();
  log(`RESPONSE ${path}`, data);
  if (!res.ok) throw new Error(data?.detail || JSON.stringify(data));
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
  const data = await res.json();
  log(`POST RESPONSE ${path}`, data);
  if (!res.ok) throw new Error(data?.detail || JSON.stringify(data));
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION WIZARD COMPONENT
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

const WizardInput = (props) => (
  <input
    {...props}
    style={{
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
      ...props.style,
    }}
    onFocus={(e) => (e.target.style.borderColor = "#31694E")}
    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
  />
);

const WizardSelect = ({ children, ...props }) => (
  <select
    {...props}
    style={{
      width: "100%",
      padding: "10px 14px",
      borderRadius: 10,
      border: "1.5px solid #e5e7eb",
      background: "#fafafa",
      fontSize: 14,
      color: "#1a1a1a",
      outline: "none",
      appearance: "none",
      cursor: "pointer",
      boxSizing: "border-box",
    }}
  >
    {children}
  </select>
);

const ApplicationWizard = ({
  isOpen,
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

  if (!isOpen) return null;

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
    log("Wizard submit triggered", formData);
    try {
      await onComplete(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const gridStyle = (cols = 2) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 16,
  });

  const sectionHeader = (num, title, subtitle) => (
    <div
      style={{
        borderLeft: "4px solid #31694E",
        paddingLeft: 16,
        marginBottom: 24,
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
          fontSize: 20,
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
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(30,60,40,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 720,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid #f0f0f0",
            background: "#FAFDF8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#31694E" }}>
              Loan Application Wizard
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 4,
                    width: 40,
                    borderRadius: 99,
                    background: i <= step ? "#31694E" : "#e5e7eb",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "#fef2f2",
              color: "#ef4444",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon.X width={18} height={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {/* STEP 1 — Business Identity */}
          {step === 1 && (
            <div>
              {sectionHeader(
                1,
                "Business Identity",
                "Legal information as registered with the government.",
              )}
              <div style={gridStyle(2)}>
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
                  marginTop: 16,
                  padding: "12px 16px",
                  background: "#F0E491/10",
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
              <div style={gridStyle(2)}>
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
                <WizardField label="Avg. Gross Monthly Sales ($)" span={2}>
                  <WizardInput
                    name="business_average_gross_monthly_sales"
                    type="number"
                    value={formData.business_average_gross_monthly_sales}
                    onChange={set}
                    placeholder="50000"
                    style={{ fontSize: 18, fontWeight: 700, color: "#31694E" }}
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
              <div style={gridStyle(2)}>
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
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #e5e7eb",
                      background: "#fafafa",
                      fontSize: 14,
                      height: 80,
                      resize: "none",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </WizardField>
              </div>

              {/* Overdraft */}
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
                    style={{ fontWeight: 700, color: "#31694E", fontSize: 14 }}
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

              {/* Existing Loans */}
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
                    style={{ fontWeight: 700, color: "#31694E", fontSize: 14 }}
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
              <div style={gridStyle(2)}>
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
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#31694E",
                  marginBottom: 6,
                }}
              >
                Review & Sign
              </div>
              <div style={{ fontSize: 14, color: "#658C58", marginBottom: 28 }}>
                Please review your details before final submission.
              </div>

              <div
                style={{
                  maxWidth: 400,
                  margin: "0 auto 28px",
                  padding: 20,
                  background: "#FAFDF8",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 16,
                  textAlign: "left",
                }}
              >
                {[
                  ["Business", formData.business_legal_name || "—"],
                  [
                    "Amount",
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
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #f0f0f0",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#888" }}>{k}</span>
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
                  marginBottom: 20,
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

              <div style={{ maxWidth: 320, margin: "0 auto" }}>
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
                    fontSize: 18,
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 32px",
            borderTop: "1px solid #f0f0f0",
            background: "#FAFDF8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              transition: "transform 0.2s",
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
                padding: "12px 32px",
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
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
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
                padding: "12px 36px",
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
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PREQUAL CARD
// ─────────────────────────────────────────────────────────────────────────────
const PrequalCard = ({ prequal, isNew, onStartApp }) => (
  <div
    style={{
      background: "linear-gradient(135deg, #31694E 0%, #4a8c6a 100%)",
      borderRadius: 20,
      padding: "28px 28px",
      color: "white",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(49,105,78,0.25)",
    }}
  >
    {/* Decorative circle */}
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
    <div
      style={{
        position: "absolute",
        right: 20,
        bottom: -50,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
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
        style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}
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
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F0E491" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {isNew && (
        <button
          onClick={onStartApp}
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
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateX(4px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateX(0)")
          }
        >
          Finish Application <Icon.Arrow width={16} height={16} />
        </button>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOAN TYPE CARD (for "Other Loan Types" section)
// ─────────────────────────────────────────────────────────────────────────────
const LoanTypeCard = ({ loan, onApply }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      padding: "20px",
      border: "1.5px solid #f0f0f0",
      transition: "all 0.2s",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "#31694E";
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(49,105,78,0.12)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "#f0f0f0";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
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
      style={{ fontSize: 12, color: "#888", marginBottom: 16, minHeight: 32 }}
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
        <div style={{ fontSize: 16, fontWeight: 800, color: "#31694E" }}>
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
        <div style={{ fontSize: 16, fontWeight: 800, color: "#31694E" }}>
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
        onClick={() => onApply(loan)}
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
);

// ─────────────────────────────────────────────────────────────────────────────
// AGENT CARD
// ─────────────────────────────────────────────────────────────────────────────
const AgentCard = ({ agent }) => (
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
        <div style={{ fontWeight: 800, color: "#1a1a1a", fontSize: 15 }}>
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
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#31694E";
        e.currentTarget.style.color = "#F0E491";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#31694E";
      }}
    >
      Send Message
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION STATUS CARD
// ─────────────────────────────────────────────────────────────────────────────
const AppStatusCard = ({ app }) => {
  const status = STATUS_META[app?.status] || STATUS_META.draft;
  const stepIndex = STEPS_ORDER.indexOf(
    app?.current_step ?? "business_information",
  );
  const progress =
    app?.completion_percentage ??
    Math.round(((stepIndex + 1) / STEPS_ORDER.length) * 100);

  return (
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
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
            Recent Application
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>
            {app?.loan_type_info?.name || "Application"}
          </div>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
            {app?.loan_application_uuid?.slice(0, 8)}…
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
            background: `${status.color}18`,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 12 }}>
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
              background: "linear-gradient(90deg, #31694E, #658C58)",
              borderRadius: 99,
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>

      {/* Step pills */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {STEPS_ORDER.slice(0, 5).map((s, i) => (
          <span
            key={s}
            style={{
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 99,
              fontWeight: 700,
              background: i <= stepIndex ? "rgba(49,105,78,0.12)" : "#f5f5f5",
              color: i <= stepIndex ? "#31694E" : "#bbb",
            }}
          >
            {LOAN_STEP_LABELS[s]}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────────────
const DashboardView = ({ user, appData, loanTypes, onRefresh }) => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const isNew = user?.is_new === true || !appData;
  const agent = user?.assigned_agent_details;
  const prequal = user?.prequalification_loan_type_applied_for;

  const otherLoans = loanTypes?.filter((l) => l.id !== prequal?.id) || [];

  const handleApplyForLoan = (loan) => {
    log("Starting wizard for loan type", loan);
    setSelectedLoan(loan);
    setWizardOpen(true);
  };

  const handleFullSubmission = async (fullData) => {
    log("handleFullSubmission called with", fullData);
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };

    try {
      // 1. Create Application Core
      log("Step 1: Creating application core", {
        loan_type: fullData.loan_type,
      });
      const coreRes = await fetch(`${API_BASE}/application/create/`, {
        method: "POST",
        headers,
        body: JSON.stringify({ loan_type: fullData.loan_type }),
      });
      const core = await coreRes.json();
      log("Core application created", core);
      if (!coreRes.ok)
        throw new Error(core?.detail || "Failed to create application core");
      const uuid = core.loan_application_uuid;
      log("Got application UUID", uuid);

      // 2. Business Information
      log("Step 2: Submitting business information");
      const bizRes = await fetch(
        `${API_BASE}/loan-application/business-information/create/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ ...fullData, loan_application_uuid: uuid }),
        },
      );
      const bizData = await bizRes.json();
      log("Business info response", bizData);
      if (!bizRes.ok) logError("Business info failed", bizData);

      // 3. Funding Information
      log("Step 3: Submitting funding information");
      const fundRes = await fetch(
        `${API_BASE}/loan-application/funding-information/create/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ ...fullData, loan_application_uuid: uuid }),
        },
      );
      const fundData = await fundRes.json();
      log("Funding info response", fundData);
      if (!fundRes.ok) logError("Funding info failed", fundData);

      // 4. Owner Information
      log("Step 4: Submitting owner information");
      const ownerRes = await fetch(
        `${API_BASE}/loan-application/owner-information/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ ...fullData, loan_application_uuid: uuid }),
        },
      );
      const ownerData = await ownerRes.json();
      log("Owner info response", ownerData);
      if (!ownerRes.ok) logError("Owner info failed", ownerData);

      // 5. Terms & Conditions (finalizes the application)
      log("Step 5: Submitting terms and conditions");
      const termsRes = await fetch(
        `${API_BASE}/loan-application/terms-and-conditions/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            loan_application_uuid: uuid,
            signature_name: fullData.signature_name,
            terms_accepted: fullData.terms_accepted,
          }),
        },
      );
      const termsData = await termsRes.json();
      log("Terms response", termsData);
      if (!termsRes.ok) logError("Terms failed", termsData);

      setWizardOpen(false);
      log("Application submitted successfully!", { uuid });
      alert("✅ Application Submitted Successfully!");
      onRefresh();
    } catch (e) {
      logError("Submission failed", e);
      alert("❌ Submission Error: " + e.message);
    }
  };

  return (
    <div>
      {/* Welcome Header */}
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

      {/* Top Grid: PreQual + Agent */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <PrequalCard
          prequal={prequal}
          isNew={isNew}
          onStartApp={() => {
            setSelectedLoan(prequal);
            setWizardOpen(true);
          }}
        />
        <AgentCard agent={agent} />
      </div>

      {/* Application Status (if exists) */}
      {appData && (
        <div style={{ marginBottom: 24 }}>
          <AppStatusCard app={appData} />
        </div>
      )}

      {/* Other Loan Types */}
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
              <LoanTypeCard
                key={loan.id}
                loan={loan}
                onApply={handleApplyForLoan}
              />
            ))}
          </div>
        </div>
      )}

      {/* Wizard */}
      <ApplicationWizard
        isOpen={wizardOpen}
        onClose={() => {
          log("Wizard closed");
          setWizardOpen(false);
        }}
        onComplete={handleFullSubmission}
        prequalData={selectedLoan || prequal}
        loanTypes={loanTypes}
      />
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
    { label: "Role", value: user?.role },
    { label: "User ID", value: `#${user?.id}` },
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
        {/* Banner */}
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
            <Badge color="#31694E" bg="rgba(49,105,78,0.1)">
              {user?.role}
            </Badge>
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
// PLACEHOLDER VIEWS
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
// SIDEBAR NAV
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Icon.Home },
  { id: "application", label: "Application", icon: Icon.File },
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
    {/* Logo */}
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

    {/* User mini-card */}
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
              transition: "all 0.2s",
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
      <Icon.Logout width={18} height={18} />
      Sign Out
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
  const [appData, setAppData] = useState(null);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (silent = false) => {
    log("fetchAll called", { silent });
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        log("No token found, redirecting to login");
        window.location.href = "/login";
        return;
      }
      log("Token found", token.slice(0, 10) + "...");

      // Fetch user profile
      log("Fetching user profile...");
      const userData = await apiGet("/user-profile/me/");
      log("User profile loaded", userData);
      setUser(userData);

      // Fetch applications
      log("Fetching applications...");
      const apps = await apiGet("/application/");
      log("Applications loaded", apps);
      const appList = Array.isArray(apps) ? apps : apps?.results || [];
      if (appList.length > 0) {
        setAppData(appList[0]);
        log("Using first application", appList[0]);
      } else {
        log("No applications found");
        setAppData(null);
      }

      // Fetch loan types
      log("Fetching loan types...");
      const ltRes = await apiGet("/loan-types/");
      log("Loan types loaded", ltRes);
      setLoanTypes(ltRes?.data || []);
    } catch (e) {
      logError("fetchAll failed", e);
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    log("ClientDashboard mounted");
    fetchAll();
  }, [fetchAll]);

  // Inject CSS
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
      @media (max-width: 768px) {
        .kacu-grid-top { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f6f8",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99,
            display: "none",
          }}
          className="kacu-mobile-overlay"
        />
      )}

      {/* Desktop Sidebar */}
      <div
        style={{ width: 240, flexShrink: 0, display: "block" }}
        className="kacu-sidebar-desktop"
      >
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
              isMobile={true}
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
              />
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
              onRefresh={() => fetchAll(true)}
            />
          )}
          {activeTab === "profile" && <ProfileView user={user} />}
          {activeTab === "application" &&
            (appData ? (
              <AppStatusCard app={appData} />
            ) : (
              <PlaceholderView
                icon={Icon.File}
                title="No Applications Yet"
                desc="Complete the wizard on your dashboard to start an application."
              />
            ))}
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

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          .kacu-sidebar-desktop { display: none !important; }
          .kacu-menu-btn { display: flex !important; }
          main { padding: 16px !important; }
        }
        @media (min-width: 901px) {
          .kacu-menu-btn { display: none !important; }
          .kacu-mobile-overlay { display: none !important; }
        }
        @media (max-width: 640px) {
          .kacu-grid-top { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
