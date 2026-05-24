import React, { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG & API HELPERS
// Mirrors the agent page pattern exactly — each call uses .catch(() => [])
// so a single failing endpoint (e.g. /admin/users/ returning 503) doesn't
// crash the whole dashboard.
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem("token");

const handle401 = (res) => {
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return true;
  }
  return false;
};

const apiFetch = async (path, opts = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getToken()}`,
      ...opts.headers,
    },
  });
  if (handle401(res)) return;
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.detail || data?.message || JSON.stringify(data));
  return data;
};

const apiGet = (path) => apiFetch(path);
const apiPost = (path, body) =>
  apiFetch(path, { method: "POST", body: JSON.stringify(body) });
const apiPatch = (path, body) =>
  apiFetch(path, { method: "PATCH", body: JSON.stringify(body) });
const apiDelete = (path) => apiFetch(path, { method: "DELETE" });

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_META = {
  draft: { label: "Draft", color: "#BBC863", bg: "rgba(187,200,99,0.12)" },
  submitted: {
    label: "Submitted",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.10)",
  },
  pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  approved: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.10)" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.10)" },
};

const ROLE_META = {
  ADMIN: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", label: "Admin" },
  AGENT: { color: "#31694E", bg: "rgba(49,105,78,0.1)", label: "Agent" },
  PARTNER: { color: "#BBC863", bg: "rgba(187,200,99,0.12)", label: "Partner" },
  APPLICANT: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", label: "Client" },
};

const INVITE_STATUS = {
  active: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Active" },
  accepted: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", label: "Accepted" },
  expired: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Expired" },
  revoked: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Revoked" },
};

const LOAN_TYPE_COLORS = [
  "#31694E",
  "#BBC863",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
];

const STEPS_ORDER = [
  "business_information",
  "funding_information",
  "business_ownership_information",
  "terms_and_conditions",
  "document_upload",
  "review_submission",
  "completed",
];
const STEP_LABELS = {
  business_information: "Business Info",
  funding_information: "Funding",
  business_ownership_information: "Ownership",
  terms_and_conditions: "Terms",
  document_upload: "Documents",
  review_submission: "Review",
  completed: "Complete",
};

// ─────────────────────────────────────────────────────────────────────────────
// ICONS  (identical set to agent page, using "Ic" namespace)
// ─────────────────────────────────────────────────────────────────────────────
const Ic = {
  Leaf: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 6-8 6z" />
    </svg>
  ),
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
  Users: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
  Check: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Check2: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  XCircle: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
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
  Building: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M3 9h6" />
      <path d="M3 15h6" />
      <path d="M15 3v18" />
      <path d="M15 9h6" />
      <path d="M15 15h6" />
    </svg>
  ),
  Alert: (p) => (
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
  Megaphone: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  ),
  Invite: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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
  Trash: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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
  Sort: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Filter: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Hash: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  Star: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES  (identical style to agent page — green brand)
// ─────────────────────────────────────────────────────────────────────────────
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

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.draft;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: m.color,
        background: m.bg,
        display: "inline-block",
      }}
    >
      {m.label}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const m = ROLE_META[role] || ROLE_META.APPLICANT;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: m.color,
        background: m.bg,
        display: "inline-block",
      }}
    >
      {m.label}
    </span>
  );
};

const Avatar = ({ first, last, size = 40, radius = 12, bg }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: bg || "linear-gradient(135deg,#31694E,#658C58)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#F0E491",
      fontSize: size * 0.35,
      fontWeight: 800,
      flexShrink: 0,
    }}
  >
    {(first?.[0] || "").toUpperCase()}
    {(last?.[0] || "").toUpperCase()}
  </div>
);

const FieldRow = ({ label, value, highlight }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "8px 0",
      borderBottom: "1px solid #f5f5f5",
    }}
  >
    <span
      style={{ fontSize: 12, color: "#888", fontWeight: 600, minWidth: 140 }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: highlight ? "#31694E" : "#1a1a1a",
        textAlign: "right",
      }}
    >
      {value || "—"}
    </span>
  </div>
);

const SectionCard = ({ title, icon: I, children, accent, action }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      border: "1.5px solid #f0f0f0",
      overflow: "hidden",
      marginBottom: 16,
    }}
  >
    <div
      style={{
        padding: "14px 20px",
        borderBottom: "1.5px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#FAFDF8",
      }}
    >
      {I && <I width={16} height={16} style={{ color: accent || "#31694E" }} />}
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: accent || "#31694E",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          flex: 1,
        }}
      >
        {title}
      </span>
      {action}
    </div>
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

const EmptyState = ({ label }) => (
  <div
    style={{
      padding: 48,
      textAlign: "center",
      color: "#bbb",
      fontSize: 13,
      border: "2px dashed #f0f0f0",
      borderRadius: 12,
    }}
  >
    {label}
  </div>
);

// Toast — same as agent page
const Toast = ({ msg, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: type === "error" ? "#ef4444" : "#31694E",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 700,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        maxWidth: 340,
      }}
    >
      {type === "error" ? (
        <Ic.Alert width={16} height={16} />
      ) : (
        <Ic.Check width={16} height={16} />
      )}{" "}
      {msg}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
const ConfirmModal = ({
  title,
  message,
  danger,
  onConfirm,
  onCancel,
  loading,
}) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 500,
      background: "rgba(20,40,30,0.7)",
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
        borderRadius: 20,
        width: "100%",
        maxWidth: 420,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1.5px solid #f0f0f0",
          background: "#FAFDF8",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: danger ? "#ef4444" : "#31694E",
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <p style={{ margin: 0, fontSize: 14, color: "#444", lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1.5px solid #f0f0f0",
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            background: "transparent",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            color: "#888",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 800,
            fontSize: 13,
            background: danger ? "#ef4444" : "#31694E",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <Spinner size={16} color="#fff" />
          ) : danger ? (
            <Ic.Trash width={16} height={16} />
          ) : (
            <Ic.Check width={16} height={16} />
          )}
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DECISION MODAL
// ─────────────────────────────────────────────────────────────────────────────
const DecisionModal = ({ app, onClose, onSuccess }) => {
  const [decision, setDecision] = useState("approved");
  const [approvedFunds, setApprovedFunds] = useState("");
  const [partnerCommission, setPartnerCommission] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const hasPartner = !!app?.user?.partner;

  const handleSubmit = async () => {
    setError("");
    if (decision === "approved" && !approvedFunds) {
      setError("Approved funds amount is required.");
      return;
    }
    if (decision === "approved" && hasPartner && !partnerCommission) {
      setError("Partner commission is required.");
      return;
    }
    if (decision === "rejected" && !rejectionReason.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { status: decision.toUpperCase() };
      if (decision === "approved") {
        payload.approved_funds = parseFloat(approvedFunds);
        if (hasPartner)
          payload.partner_commision = parseFloat(partnerCommission);
      } else payload.rejection_reason = rejectionReason;
      await apiPatch(
        `/application/${app.loan_application_uuid}/decision/`,
        payload,
      );
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "rgba(20,40,30,0.75)",
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
          maxWidth: 520,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            background: "#FAFDF8",
            borderBottom: "1.5px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#31694E" }}>
              Make a Decision
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {app?.user?.first_name} {app?.user?.last_name} ·{" "}
              {app?.loan_type_info?.name || "—"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#fef2f2",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ic.X width={16} height={16} />
          </button>
        </div>
        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              padding: 4,
              background: "#f5f5f5",
              borderRadius: 12,
            }}
          >
            {["approved", "rejected"].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDecision(d);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background:
                    decision === d
                      ? d === "approved"
                        ? "#22c55e"
                        : "#ef4444"
                      : "transparent",
                  color: decision === d ? "#fff" : "#888",
                }}
              >
                {d === "approved" ? "✓ Approve" : "✗ Reject"}
              </button>
            ))}
          </div>
          {decision === "approved" ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Approved Amount ($) *
                </label>
                <input
                  type="number"
                  value={approvedFunds}
                  onChange={(e) => setApprovedFunds(e.target.value)}
                  placeholder="e.g. 50000"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #e5e7eb",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#31694E",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#31694E")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              {hasPartner && (
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#BBC863",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Partner Commission ($) *
                  </label>
                  <div
                    style={{
                      background: "rgba(187,200,99,0.08)",
                      border: "1px solid rgba(187,200,99,0.3)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      marginBottom: 8,
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    Referred by:{" "}
                    <strong style={{ color: "#1a1a1a" }}>
                      {app?.user?.partner?.first_name}{" "}
                      {app?.user?.partner?.last_name}
                    </strong>
                  </div>
                  <input
                    type="number"
                    value={partnerCommission}
                    onChange={(e) => setPartnerCommission(e.target.value)}
                    placeholder="e.g. 1500"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #e5e7eb",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#BBC863")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder="Explain why this application is being rejected..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#ef4444")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          )}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                borderRadius: 10,
                padding: "10px 14px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Ic.Alert
                width={16}
                height={16}
                style={{ color: "#ef4444", flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: "#ef4444" }}>{error}</span>
            </div>
          )}
        </div>
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1.5px solid #f0f0f0",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "transparent",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              color: "#888",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "10px 28px",
              borderRadius: 10,
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 800,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              background: decision === "approved" ? "#22c55e" : "#ef4444",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <Spinner size={16} color="#fff" />
            ) : decision === "approved" ? (
              <Ic.Check2 width={16} height={16} />
            ) : (
              <Ic.XCircle width={16} height={16} />
            )}
            {submitting
              ? "Processing..."
              : decision === "approved"
                ? "Approve Application"
                : "Reject Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APP DETAIL DRAWER  (same style as agent page)
// ─────────────────────────────────────────────────────────────────────────────
const AppDetailDrawer = ({ uuid, onClose, onDecisionMade }) => {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDecision, setShowDecision] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!uuid) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setActiveTab("overview");
      try {
        const d = await apiGet(`/application/${uuid}/`);
        if (!cancelled) setApp(d);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [uuid]);

  const canDecide = app?.status === "submitted" || app?.status === "pending";
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "business", label: "Business" },
    { id: "funding", label: "Funding" },
    { id: "owner", label: "Owner" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 199,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(620px,100vw)",
          background: "#fff",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1.5px solid #f0f0f0",
            background: "#FAFDF8",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Application Detail
              </div>
              {app && (
                <>
                  <div
                    style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}
                  >
                    {app.user?.first_name} {app.user?.last_name}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                    {app.loan_type_info?.name || "—"} ·{" "}
                    {app.loan_application_uuid?.slice(0, 8)}…
                    {app.user?.assigned_agent_details && (
                      <span
                        style={{
                          marginLeft: 8,
                          background: "rgba(49,105,78,0.1)",
                          color: "#31694E",
                          padding: "2px 8px",
                          borderRadius: 99,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        Agent: {app.user.assigned_agent_details.first_name}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {app && <StatusBadge status={app.status} />}
              <button
                onClick={onClose}
                style={{
                  background: "#f5f5f5",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                <Ic.X width={16} height={16} />
              </button>
            </div>
          </div>
          {canDecide && !loading && (
            <button
              onClick={() => setShowDecision(true)}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "10px",
                borderRadius: 10,
                background: "linear-gradient(135deg,#31694E,#4a8c6a)",
                border: "none",
                color: "#F0E491",
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ic.Check2 width={14} height={14} /> Make Decision
            </button>
          )}
        </div>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1.5px solid #f0f0f0",
            flexShrink: 0,
            overflowX: "auto",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "12px 18px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: activeTab === t.id ? 800 : 600,
                fontSize: 12,
                color: activeTab === t.id ? "#31694E" : "#888",
                borderBottom:
                  activeTab === t.id
                    ? "2.5px solid #31694E"
                    : "2.5px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {loading && (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 40 }}
            >
              <Spinner size={32} />
            </div>
          )}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                borderRadius: 12,
                padding: 16,
                color: "#ef4444",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}
          {app && !loading && (
            <>
              {activeTab === "overview" && (
                <div>
                  <SectionCard title="Progress" icon={Ic.Clock}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        color: "#888",
                        marginBottom: 6,
                      }}
                    >
                      <span>Completion</span>
                      <span>{app.completion_percentage}%</span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#f0f0f0",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${app.completion_percentage}%`,
                          background: "linear-gradient(90deg,#31694E,#658C58)",
                          borderRadius: 99,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginTop: 12,
                      }}
                    >
                      {STEPS_ORDER.slice(0, 6).map((s, i) => {
                        const idx = STEPS_ORDER.indexOf(
                          app.current_step ?? "business_information",
                        );
                        const done = i <= idx;
                        return (
                          <span
                            key={s}
                            style={{
                              fontSize: 10,
                              padding: "4px 10px",
                              borderRadius: 99,
                              fontWeight: 700,
                              background: done
                                ? "rgba(49,105,78,0.12)"
                                : "#f5f5f5",
                              color: done ? "#31694E" : "#bbb",
                            }}
                          >
                            {STEP_LABELS[s]}
                          </span>
                        );
                      })}
                    </div>
                  </SectionCard>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    {[
                      {
                        label: "Loan Type",
                        value: app.loan_type_info?.name || "—",
                      },
                      {
                        label: "Status",
                        value: <StatusBadge status={app.status} />,
                      },
                      {
                        label: "Submitted",
                        value: app.submitted_at
                          ? new Date(app.submitted_at).toLocaleDateString()
                          : "Not yet",
                      },
                      {
                        label: "Approved Funds",
                        value: app.approved_funds
                          ? `$${Number(app.approved_funds).toLocaleString()}`
                          : "—",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          background: "#FAFDF8",
                          borderRadius: 12,
                          padding: 14,
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#BBC863",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 6,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                  {app.user?.partner && (
                    <div
                      style={{
                        background: "rgba(187,200,99,0.08)",
                        border: "1.5px solid rgba(187,200,99,0.3)",
                        borderRadius: 12,
                        padding: "12px 16px",
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Avatar
                        first={app.user.partner.first_name}
                        last={app.user.partner.last_name}
                        size={36}
                        bg="#BBC863"
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#BBC863",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          Referred by Partner
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {app.user.partner.first_name}{" "}
                          {app.user.partner.last_name}
                        </div>
                      </div>
                      {app.partner_commision && (
                        <div style={{ marginLeft: "auto" }}>
                          <div
                            style={{
                              fontSize: 10,
                              color: "#888",
                              textTransform: "uppercase",
                              fontWeight: 800,
                            }}
                          >
                            Commission
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: "#31694E",
                            }}
                          >
                            ${Number(app.partner_commision).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <SectionCard title="Applicant" icon={Ic.User}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <Avatar
                        first={app.user?.first_name}
                        last={app.user?.last_name}
                        size={44}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>
                          {app.user?.first_name} {app.user?.last_name}
                        </div>
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {app.user?.email}
                        </div>
                      </div>
                    </div>
                    <FieldRow label="Phone" value={app.user?.phone} />
                    <FieldRow
                      label="Qualified"
                      value={app.user?.is_qualified ? "✅ Yes" : "❌ No"}
                    />
                    {app.user?.assigned_agent_details && (
                      <FieldRow
                        label="Assigned Agent"
                        value={`${app.user.assigned_agent_details.first_name} ${app.user.assigned_agent_details.last_name}`}
                        highlight
                      />
                    )}
                  </SectionCard>
                  {app.status === "rejected" && app.rejection_reason && (
                    <div
                      style={{
                        background: "#fef2f2",
                        border: "1.5px solid #fecaca",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#ef4444",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 6,
                        }}
                      >
                        Rejection Reason
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}
                      >
                        {app.rejection_reason}
                      </div>
                    </div>
                  )}
                  {app.status === "approved" && (
                    <div
                      style={{
                        background: "#f0fdf4",
                        border: "1.5px solid #bbf7d0",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#22c55e",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 6,
                        }}
                      >
                        Approved
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#22c55e",
                        }}
                      >
                        ${Number(app.approved_funds || 0).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "business" &&
                (app.business_information ? (
                  <SectionCard title="Business Information" icon={Ic.Building}>
                    <FieldRow
                      label="Legal Name"
                      value={app.business_information.business_legal_name}
                      highlight
                    />
                    <FieldRow
                      label="DBA Name"
                      value={app.business_information.business_dba_name}
                    />
                    <FieldRow
                      label="Email"
                      value={app.business_information.business_email}
                    />
                    <FieldRow
                      label="Phone"
                      value={app.business_information.business_phone_number}
                    />
                    <FieldRow
                      label="Address"
                      value={app.business_information.business_address}
                    />
                    <FieldRow
                      label="City"
                      value={app.business_information.business_city}
                    />
                    <FieldRow
                      label="State"
                      value={app.business_information.business_state}
                    />
                    <FieldRow
                      label="Industry"
                      value={app.business_information.business_industry_type}
                    />
                    <FieldRow
                      label="Entity Type"
                      value={app.business_information.business_legal_entity_type?.toUpperCase()}
                    />
                    <FieldRow
                      label="Monthly Sales"
                      value={
                        app.business_information
                          .business_average_gross_monthly_sales
                          ? `$${Number(app.business_information.business_average_gross_monthly_sales).toLocaleString()}`
                          : null
                      }
                      highlight
                    />
                  </SectionCard>
                ) : (
                  <EmptyState label="Business information not submitted yet." />
                ))}
              {activeTab === "funding" &&
                (app.funding_information ? (
                  <SectionCard title="Funding Information" icon={Ic.Dollar}>
                    <FieldRow
                      label="Amount Requested"
                      value={`$${Number(app.funding_information.loan_amount_requested).toLocaleString()}`}
                      highlight
                    />
                    <FieldRow
                      label="Term Requested"
                      value={app.funding_information.loan_term_requested}
                    />
                    <FieldRow
                      label="Purpose"
                      value={app.funding_information.loan_purpose}
                    />
                    <FieldRow
                      label="Existing Loans"
                      value={
                        app.funding_information.business_existing_loan
                          ? "Yes"
                          : "No"
                      }
                    />
                  </SectionCard>
                ) : (
                  <EmptyState label="Funding information not submitted yet." />
                ))}
              {activeTab === "owner" &&
                (app.owner_information ? (
                  <SectionCard title="Owner Information" icon={Ic.User}>
                    <FieldRow
                      label="Full Name"
                      value={`${app.owner_information.owner_first_name} ${app.owner_information.owner_last_name}`}
                      highlight
                    />
                    <FieldRow
                      label="Email"
                      value={app.owner_information.owner_email}
                    />
                    <FieldRow
                      label="Phone"
                      value={app.owner_information.owner_phone_number}
                    />
                    <FieldRow
                      label="Date of Birth"
                      value={app.owner_information.owner_date_of_birth}
                    />
                    <FieldRow
                      label="SSN"
                      value={
                        app.owner_information.owner_ssn
                          ? "•••-••-" +
                            app.owner_information.owner_ssn.slice(-4)
                          : null
                      }
                    />
                    <FieldRow
                      label="Ownership %"
                      value={
                        app.owner_information.owner_percentage_of_ownership
                          ? `${app.owner_information.owner_percentage_of_ownership}%`
                          : null
                      }
                    />
                    <FieldRow
                      label="Credit Score"
                      value={app.owner_information.owner_credit_score}
                      highlight
                    />
                  </SectionCard>
                ) : (
                  <EmptyState label="Owner information not submitted yet." />
                ))}
              {activeTab === "documents" &&
                (app.documents?.length > 0 ? (
                  <SectionCard title="Documents" icon={Ic.Folder}>
                    {app.documents.map((doc) => (
                      <div
                        key={doc.document_uuid}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          background: "#FAFDF8",
                          borderRadius: 10,
                          marginBottom: 8,
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: "rgba(49,105,78,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ic.File
                              width={16}
                              height={16}
                              style={{ color: "#31694E" }}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#1a1a1a",
                              }}
                            >
                              {doc.document_name}
                            </div>
                            <div style={{ fontSize: 11, color: "#888" }}>
                              {new Date(doc.uploaded_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {doc.document_file && (
                          <a
                            href={doc.document_file}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "6px 12px",
                              borderRadius: 8,
                              background: "rgba(49,105,78,0.1)",
                              color: "#31694E",
                              fontSize: 11,
                              fontWeight: 700,
                              textDecoration: "none",
                            }}
                          >
                            View
                          </a>
                        )}
                      </div>
                    ))}
                  </SectionCard>
                ) : (
                  <EmptyState label="No documents uploaded yet." />
                ))}
            </>
          )}
        </div>
      </div>
      {showDecision && (
        <DecisionModal
          app={app}
          onClose={() => setShowDecision(false)}
          onSuccess={() => {
            setShowDecision(false);
            onDecisionMade();
            onClose();
          }}
        />
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS VIEW
// ─────────────────────────────────────────────────────────────────────────────
const ApplicationsView = ({ applications, loanTypes, onSelectApp }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLoanType, setFilterLoanType] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = applications
    .filter((app) => {
      const name =
        `${app.user?.first_name} ${app.user?.last_name}`.toLowerCase();
      const biz = (
        app.business_information?.business_legal_name || ""
      ).toLowerCase();
      const ok1 =
        !search ||
        name.includes(search.toLowerCase()) ||
        biz.includes(search.toLowerCase()) ||
        app.loan_application_uuid?.includes(search);
      const ok2 = filterStatus === "all" || app.status === filterStatus;
      const lt = app.loan_type_info?.name || app.loan_type?.name || "";
      const ok3 = filterLoanType === "all" || lt === filterLoanType;
      return ok1 && ok2 && ok3;
    })
    .sort((a, b) => {
      if (sortBy === "created_desc")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "created_asc")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name_asc")
        return `${a.user?.first_name}${a.user?.last_name}`.localeCompare(
          `${b.user?.first_name}${b.user?.last_name}`,
        );
      if (sortBy === "loan_type")
        return (a.loan_type_info?.name || "").localeCompare(
          b.loan_type_info?.name || "",
        );
      return 0;
    });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          All Applications
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          {applications.length} total · {filtered.length} shown
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "8px 14px",
          }}
        >
          <Ic.Search width={16} height={16} style={{ color: "#aaa" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, business, UUID..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              background: "transparent",
              flex: 1,
              color: "#1a1a1a",
            }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 36px 8px 14px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              fontSize: 12,
              fontWeight: 700,
              color: "#31694E",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
            }}
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="name_asc">Name A→Z</option>
            <option value="loan_type">By Loan Type</option>
          </select>
          <Ic.Sort
            width={14}
            height={14}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#31694E",
              pointerEvents: "none",
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            color: "#888",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ic.Filter width={14} height={14} /> Filters
        </button>
      </div>
      {showFilters && (
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #f0f0f0",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 16,
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Status
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                "all",
                "submitted",
                "pending",
                "approved",
                "rejected",
                "draft",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "1.5px solid",
                    borderColor: filterStatus === s ? "#31694E" : "#e5e7eb",
                    background:
                      filterStatus === s ? "rgba(49,105,78,0.08)" : "#fff",
                    color: filterStatus === s ? "#31694E" : "#888",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {s === "all" ? "All" : STATUS_META[s]?.label || s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Loan Type
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all", ...(loanTypes || []).map((lt) => lt.name)].map((lt) => (
                <button
                  key={lt}
                  onClick={() => setFilterLoanType(lt)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "1.5px solid",
                    borderColor: filterLoanType === lt ? "#31694E" : "#e5e7eb",
                    background:
                      filterLoanType === lt ? "rgba(49,105,78,0.08)" : "#fff",
                    color: filterLoanType === lt ? "#31694E" : "#888",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {lt === "all" ? "All Types" : lt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {filtered.map((app) => {
        const progress =
          app.completion_percentage ??
          Math.round(
            ((STEPS_ORDER.indexOf(app.current_step ?? "business_information") +
              1) /
              STEPS_ORDER.length) *
              100,
          );
        return (
          <div
            key={app.loan_application_uuid}
            onClick={() => onSelectApp(app.loan_application_uuid)}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "16px 20px",
              border: "1.5px solid #f0f0f0",
              cursor: "pointer",
              transition: "all 0.18s",
              marginBottom: 10,
              display: "grid",
              gridTemplateColumns: "44px 1fr 1fr auto 80px auto auto",
              gap: 14,
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#31694E";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(49,105,78,0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#f0f0f0";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Avatar
              first={app.user?.first_name}
              last={app.user?.last_name}
              size={44}
              radius={12}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#1a1a1a",
                  marginBottom: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {app.user?.first_name} {app.user?.last_name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#888",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {app.user?.email}
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#31694E",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {app.loan_type_info?.name || "—"}
              </div>
              {app.business_information?.business_legal_name && (
                <div style={{ fontSize: 11, color: "#aaa" }}>
                  {app.business_information.business_legal_name}
                </div>
              )}
            </div>
            <div style={{ width: 90 }}>
              {app.user?.partner ? (
                <span
                  style={{
                    background: "rgba(187,200,99,0.15)",
                    color: "#868a30",
                    padding: "3px 8px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  Referred
                </span>
              ) : (
                <span style={{ fontSize: 11, color: "#ddd" }}>—</span>
              )}
            </div>
            <div
              style={{
                width: 80,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ fontSize: 10, color: "#888", textAlign: "right" }}>
                {progress}%
              </div>
              <div
                style={{
                  height: 5,
                  background: "#f0f0f0",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#31694E,#658C58)",
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
            <StatusBadge status={app.status} />
            <Ic.ChevRight width={16} height={16} style={{ color: "#ccc" }} />
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div
          style={{
            padding: 60,
            textAlign: "center",
            color: "#bbb",
            border: "2px dashed #f0f0f0",
            borderRadius: 16,
            fontSize: 14,
          }}
        >
          No applications match your filters.
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS VIEW
// KEY FIX: uses the local `users` prop instead of a separate /admin/users/ call
// at render-time, so a 503 on that endpoint doesn't break the whole page.
// ─────────────────────────────────────────────────────────────────────────────
const ClientsView = ({
  users,
  applications,
  onRefresh,
  onSelectApp,
  showToast,
}) => {
  const [search, setSearch] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const clients = (users || []).filter((u) => u.role === "APPLICANT");
  const filtered = clients.filter((c) => {
    const name = `${c.first_name} ${c.last_name}`.toLowerCase();
    return (
      !search ||
      name.includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await apiPatch(`/admin/users/${confirmRemove.id}/`, { is_active: false });
      showToast("Client deactivated successfully", "success");
      onRefresh();
      setConfirmRemove(null);
      setSelectedClient(null);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          Clients
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          {clients.length} total clients
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "8px 14px",
          }}
        >
          <Ic.Search width={16} height={16} style={{ color: "#aaa" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              background: "transparent",
              flex: 1,
              color: "#1a1a1a",
            }}
          />
        </div>
      </div>

      {/* Show a banner if users list is empty (server down) */}
      {(users || []).length === 0 && (
        <div
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1.5px solid rgba(245,158,11,0.3)",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Ic.Alert
            width={16}
            height={16}
            style={{ color: "#f59e0b", flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, color: "#92400e" }}>
            User data could not be loaded (server may be starting up). Try
            refreshing in a moment.
          </span>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
          gap: 14,
        }}
      >
        {filtered.map((client) => {
          const clientApps = (applications || []).filter(
            (a) => a.user?.id === client.id,
          );
          return (
            <div
              key={client.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1.5px solid #f0f0f0",
                padding: 18,
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#31694E";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(49,105,78,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#f0f0f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <Avatar
                  first={client.first_name}
                  last={client.last_name}
                  size={44}
                  radius={12}
                  bg={client.is_active ? undefined : "#ccc"}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#1a1a1a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {client.first_name} {client.last_name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#888",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {client.email}
                  </div>
                </div>
                {!client.is_active && (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 99,
                      fontSize: 10,
                      fontWeight: 800,
                      background: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                    }}
                  >
                    Inactive
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[
                  { val: clientApps.length, label: "Apps", col: "#31694E" },
                  {
                    val: clientApps.filter((a) => a.status === "approved")
                      .length,
                    label: "Approved",
                    col: "#22c55e",
                  },
                  {
                    val: clientApps.filter(
                      (a) => a.status === "pending" || a.status === "submitted",
                    ).length,
                    label: "Pending",
                    col: "#f59e0b",
                  },
                ].map(({ val, label, col }) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      background: "#FAFDF8",
                      borderRadius: 8,
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 800, color: col }}>
                      {val}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#888", fontWeight: 600 }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              {client.partner_details && (
                <div
                  style={{
                    background: "rgba(187,200,99,0.08)",
                    border: "1px solid rgba(187,200,99,0.25)",
                    borderRadius: 8,
                    padding: "6px 10px",
                    marginBottom: 12,
                    fontSize: 12,
                    color: "#888",
                  }}
                >
                  Referred by{" "}
                  <strong style={{ color: "#31694E" }}>
                    {client.partner_details.first_name}{" "}
                    {client.partner_details.last_name}
                  </strong>
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setSelectedClient(client)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 9,
                    border: "1.5px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#31694E",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
                {client.is_active && (
                  <button
                    onClick={() => setConfirmRemove(client)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 9,
                      border: "1.5px solid #fecaca",
                      background: "#fef2f2",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    <Ic.Trash width={14} height={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && !((users || []).length === 0) && (
        <EmptyState label="No clients found." />
      )}

      {/* Client detail drawer */}
      {selectedClient && (
        <>
          <div
            onClick={() => setSelectedClient(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 199,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: "min(560px,100vw)",
              background: "#fff",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1.5px solid #f0f0f0",
                background: "#FAFDF8",
                flexShrink: 0,
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
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                  }}
                >
                  Client Profile
                </div>
                <div
                  style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}
                >
                  {selectedClient.first_name} {selectedClient.last_name}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {selectedClient.email}
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                style={{
                  background: "#f5f5f5",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                <Ic.X width={16} height={16} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <SectionCard title="Contact Info" icon={Ic.User}>
                <FieldRow label="Email" value={selectedClient.email} />
                <FieldRow label="Phone" value={selectedClient.phone} />
                <FieldRow label="Username" value={selectedClient.username} />
                <FieldRow
                  label="Qualified"
                  value={selectedClient.is_qualified ? "✅ Yes" : "❌ No"}
                />
                <FieldRow
                  label="Active"
                  value={selectedClient.is_active ? "✅ Yes" : "❌ No"}
                />
                {selectedClient.partner_details && (
                  <FieldRow
                    label="Referred By"
                    value={`${selectedClient.partner_details.first_name} ${selectedClient.partner_details.last_name}`}
                    highlight
                  />
                )}
                {selectedClient.assigned_agent_details && (
                  <FieldRow
                    label="Assigned Agent"
                    value={`${selectedClient.assigned_agent_details.first_name} ${selectedClient.assigned_agent_details.last_name}`}
                  />
                )}
              </SectionCard>
              <SectionCard
                title={`Applications (${(applications || []).filter((a) => a.user?.id === selectedClient.id).length})`}
                icon={Ic.File}
              >
                {(applications || [])
                  .filter((a) => a.user?.id === selectedClient.id)
                  .map((app) => (
                    <div
                      key={app.loan_application_uuid}
                      onClick={() => {
                        setSelectedClient(null);
                        onSelectApp(app.loan_application_uuid);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        background: "#FAFDF8",
                        borderRadius: 10,
                        marginBottom: 8,
                        cursor: "pointer",
                        border: "1px solid #f0f0f0",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f0fdf4";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#FAFDF8";
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {app.loan_type_info?.name || "—"}
                        </div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>
                          {app.loan_application_uuid?.slice(0, 8)}…
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                      <Ic.ChevRight
                        width={14}
                        height={14}
                        style={{ color: "#ccc" }}
                      />
                    </div>
                  ))}
                {(applications || []).filter(
                  (a) => a.user?.id === selectedClient.id,
                ).length === 0 && <EmptyState label="No applications yet." />}
              </SectionCard>
            </div>
            {selectedClient.is_active && (
              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1.5px solid #f0f0f0",
                }}
              >
                <button
                  onClick={() => setConfirmRemove(selectedClient)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 10,
                    border: "1.5px solid #fecaca",
                    background: "#fef2f2",
                    color: "#ef4444",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Ic.Trash width={16} height={16} /> Deactivate Client
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {confirmRemove && (
        <ConfirmModal
          title="Deactivate Client"
          message={`Are you sure you want to deactivate ${confirmRemove.first_name} ${confirmRemove.last_name}? They will no longer be able to access their account.`}
          danger
          onConfirm={handleRemove}
          onCancel={() => setConfirmRemove(null)}
          loading={removing}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INVITATIONS VIEW
// ─────────────────────────────────────────────────────────────────────────────
const InvitationsView = ({ showToast }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", role: "AGENT" });
  const [sending, setSending] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(null);
  const [revoking, setRevoking] = useState(false);

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiGet("/invite-users/list/");
      setInvitations(Array.isArray(d) ? d : d?.results || []);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const sendInvite = async () => {
    if (!form.email || !form.role) {
      showToast("Email and role are required", "error");
      return;
    }
    setSending(true);
    try {
      await apiPost("/invite-users/create/", form);
      showToast(`Invitation sent to ${form.email}`, "success");
      setForm({ email: "", role: "AGENT" });
      setShowForm(false);
      fetchInvitations();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSending(false);
    }
  };

  const revokeInvite = async () => {
    setRevoking(true);
    try {
      await apiPost(`/invite-users/revoke/${confirmRevoke.uuid}/`, {});
      showToast("Invitation revoked", "success");
      fetchInvitations();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setRevoking(false);
      setConfirmRevoke(null);
    }
  };

  const getInviteStatus = (inv) => {
    if (inv.accepted_at) return "accepted";
    if (inv.revoked_at) return "revoked";
    if (inv.is_expired) return "expired";
    return "active";
  };

  const filtered = invitations.filter((inv) => {
    const st = getInviteStatus(inv);
    return (
      (filterRole === "all" || inv.role === filterRole) &&
      (filterStatus === "all" || st === filterStatus)
    );
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 4,
            }}
          >
            Invitations
          </div>
          <div style={{ fontSize: 13, color: "#888" }}>
            {invitations.length} total invitations sent
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#31694E,#4a8c6a)",
            border: "none",
            color: "#F0E491",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ic.Plus width={16} height={16} /> Send Invite
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: "20px 24px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#31694E",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            New Invitation
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 12,
              alignItems: "flex-end",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="user@example.com"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#31694E")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Role *
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 14,
                  fontWeight: 700,
                  outline: "none",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <option value="AGENT">Agent</option>
                <option value="ADMIN">Admin</option>
                <option value="PARTNER">Partner</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={sendInvite}
                disabled={sending || !form.email}
                style={{
                  padding: "11px 20px",
                  borderRadius: 10,
                  background: "#31694E",
                  border: "none",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: sending || !form.email ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: sending || !form.email ? 0.6 : 1,
                }}
              >
                {sending ? (
                  <Spinner size={16} color="#fff" />
                ) : (
                  <Ic.Send width={16} height={16} />
                )}
                {sending ? "Sending..." : "Send"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  background: "transparent",
                  color: "#888",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "AGENT", "ADMIN", "PARTNER"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              style={{
                padding: "7px 14px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: filterRole === r ? "#31694E" : "#e5e7eb",
                background: filterRole === r ? "rgba(49,105,78,0.08)" : "#fff",
                color: filterRole === r ? "#31694E" : "#888",
                fontWeight: 700,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {r === "all" ? "All Roles" : ROLE_META[r]?.label || r}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "active", "accepted", "expired", "revoked"].map((s) => {
            const meta = INVITE_STATUS[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  border: "1.5px solid",
                  borderColor:
                    filterStatus === s ? meta?.color || "#31694E" : "#e5e7eb",
                  background:
                    filterStatus === s
                      ? meta?.bg || "rgba(49,105,78,0.08)"
                      : "#fff",
                  color: filterStatus === s ? meta?.color || "#31694E" : "#888",
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {s === "all" ? "All Status" : meta?.label || s}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spinner size={32} />
        </div>
      ) : (
        <div>
          {filtered.map((inv) => {
            const st = getInviteStatus(inv);
            const m = INVITE_STATUS[st];
            const roleMeta = ROLE_META[inv.role] || ROLE_META.AGENT;
            return (
              <div
                key={inv.uuid}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "16px 20px",
                  border: "1.5px solid #f0f0f0",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: roleMeta.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Ic.Invite
                    width={18}
                    height={18}
                    style={{ color: roleMeta.color }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#1a1a1a",
                      marginBottom: 2,
                    }}
                  >
                    {inv.email}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    Invited by {inv.invited_by_email} ·{" "}
                    {new Date(inv.created_at).toLocaleDateString()}
                    {inv.expires_at &&
                      ` · Expires ${new Date(inv.expires_at).toLocaleDateString()}`}
                  </div>
                </div>
                <RoleBadge role={inv.role} />
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: m.color,
                    background: m.bg,
                  }}
                >
                  {m.label}
                </span>
                {st === "active" && (
                  <button
                    onClick={() => setConfirmRevoke(inv)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 9,
                      border: "1.5px solid #fecaca",
                      background: "#fef2f2",
                      color: "#ef4444",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <EmptyState label="No invitations match your filters." />
          )}
        </div>
      )}

      {confirmRevoke && (
        <ConfirmModal
          title="Revoke Invitation"
          message={`Revoke the invitation sent to ${confirmRevoke.email}? They will no longer be able to use the invite link.`}
          danger
          onConfirm={revokeInvite}
          onCancel={() => setConfirmRevoke(null)}
          loading={revoking}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOAN TYPES VIEW
// ─────────────────────────────────────────────────────────────────────────────
const LoanTypesView = ({ loanTypes, onRefresh, showToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    rates: "",
    decision_time: "",
    amount: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setForm({
      name: "",
      rates: "",
      decision_time: "",
      amount: "",
      description: "",
    });
    setEditItem(null);
    setShowForm(true);
  };
  const openEdit = (lt) => {
    setForm({
      name: lt.name,
      rates: lt.rates,
      decision_time: lt.decision_time,
      amount: lt.amount,
      description: lt.description || "",
    });
    setEditItem(lt);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.rates || !form.decision_time || !form.amount) {
      showToast("Name, rates, decision time, and amount are required", "error");
      return;
    }
    setSaving(true);
    try {
      if (editItem) await apiPatch(`/loan-types/${editItem.id}/update/`, form);
      else await apiPost("/loan-types/create/", form);
      showToast(
        editItem ? "Loan type updated" : "Loan type created",
        "success",
      );
      setShowForm(false);
      onRefresh();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(`/loan-types/${confirmDelete.id}/delete/`);
      showToast(`"${confirmDelete.name}" deleted`, "success");
      setConfirmDelete(null);
      onRefresh();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 4,
            }}
          >
            Loan Types
          </div>
          <div style={{ fontSize: 13, color: "#888" }}>
            {loanTypes.length} loan products configured
          </div>
        </div>
        <button
          onClick={openCreate}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#31694E,#4a8c6a)",
            border: "none",
            color: "#F0E491",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ic.Plus width={16} height={16} /> New Loan Type
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1.5px solid #f0f0f0",
              background: "#FAFDF8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#31694E",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {editItem ? "Edit Loan Type" : "Create New Loan Type"}
            </span>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#888",
              }}
            >
              <Ic.X width={18} height={18} />
            </button>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[
                {
                  key: "name",
                  label: "Name *",
                  placeholder: "e.g. Working Capital Loan",
                },
                {
                  key: "rates",
                  label: "Interest Rate (%) *",
                  placeholder: "e.g. 12.5",
                  type: "number",
                },
                {
                  key: "decision_time",
                  label: "Decision Time *",
                  placeholder: "e.g. 24-48 hours",
                },
                {
                  key: "amount",
                  label: "Loan Amount Range *",
                  placeholder: "e.g. $10,000 - $100,000",
                },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type || "text"}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #e5e7eb",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#31694E")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description of this loan type..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#31694E")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 20,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  background: "transparent",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  background: "#31694E",
                  border: "none",
                  color: "#fff",
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
                  <Spinner size={16} color="#fff" />
                ) : (
                  <Ic.Check width={16} height={16} />
                )}
                {saving
                  ? "Saving..."
                  : editItem
                    ? "Update Loan Type"
                    : "Create Loan Type"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
          gap: 16,
        }}
      >
        {loanTypes.map((lt, i) => (
          <div
            key={lt.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #f0f0f0",
              overflow: "hidden",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(49,105,78,0.08)";
              e.currentTarget.style.borderColor = "#e0e0e0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#f0f0f0";
            }}
          >
            <div
              style={{
                height: 6,
                background: LOAN_TYPE_COLORS[i % LOAN_TYPE_COLORS.length],
              }}
            />
            <div style={{ padding: "18px 20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#1a1a1a",
                    flex: 1,
                    marginRight: 12,
                  }}
                >
                  {lt.name}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(lt)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1.5px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#31694E",
                    }}
                  >
                    <Ic.Edit width={14} height={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(lt)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1.5px solid #fecaca",
                      background: "#fef2f2",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ef4444",
                    }}
                  >
                    <Ic.Trash width={14} height={14} />
                  </button>
                </div>
              </div>
              {lt.description && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#888",
                    lineHeight: 1.6,
                    marginBottom: 14,
                  }}
                >
                  {lt.description}
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  { label: "Rate", value: `${lt.rates}%` },
                  { label: "Decision Time", value: lt.decision_time },
                  { label: "Amount Range", value: lt.amount },
                  {
                    label: "Created",
                    value: new Date(lt.created_at).toLocaleDateString(),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "#FAFDF8",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#BBC863",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1a1a1a",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {loanTypes.length === 0 && (
          <div style={{ gridColumn: "1/-1" }}>
            <EmptyState label="No loan types configured yet." />
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Delete Loan Type"
          message={`Delete "${confirmDelete.name}"? This action cannot be undone and may affect existing applications.`}
          danger
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYEES VIEW
// ─────────────────────────────────────────────────────────────────────────────
const EmployeesView = ({ users, applications, onRefresh, showToast }) => {
  const [empTab, setEmpTab] = useState("AGENT");
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const roles = [
    { id: "AGENT", label: "Agents", icon: Ic.Users, color: "#31694E" },
    { id: "PARTNER", label: "Partners", icon: Ic.Star, color: "#BBC863" },
    { id: "ADMIN", label: "Admins", icon: Ic.Shield, color: "#8b5cf6" },
  ];

  const filtered = (users || []).filter((u) => {
    const name = `${u.first_name} ${u.last_name}`.toLowerCase();
    return (
      u.role === empTab &&
      (!search ||
        name.includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({
      first_name: u.first_name,
      last_name: u.last_name,
      phone: u.phone,
      is_active: u.is_active,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPatch(`/admin/users/${editUser.id}/`, editForm);
      showToast("User updated successfully", "success");
      setEditUser(null);
      onRefresh();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await apiPatch(`/admin/users/${confirmRemove.id}/`, { is_active: false });
      showToast("User deactivated successfully", "success");
      setConfirmRemove(null);
      setEditUser(null);
      onRefresh();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setRemoving(false);
    }
  };

  const getPartnerStats = (partner) => {
    const clientsReferred = (users || []).filter(
      (u) => u.partner === partner.id || u.partner_details?.id === partner.id,
    ).length;
    const appsThrough = (applications || []).filter(
      (a) => a.user?.partner?.id === partner.id,
    ).length;
    const appsApproved = (applications || []).filter(
      (a) => a.user?.partner?.id === partner.id && a.status === "approved",
    ).length;
    const totalCommission = (applications || [])
      .filter((a) => a.user?.partner?.id === partner.id && a.partner_commision)
      .reduce((s, a) => s + Number(a.partner_commision || 0), 0);
    return { clientsReferred, appsThrough, appsApproved, totalCommission };
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          Team & Partners
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          Manage agents, admins and partners
        </div>
      </div>

      {/* Role tabs — green active style matching agent page */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          padding: 4,
          background: "#fff",
          borderRadius: 14,
          border: "1.5px solid #f0f0f0",
          width: "fit-content",
        }}
      >
        {roles.map(({ id, label, icon: RIcon, color }) => {
          const cnt = (users || []).filter((u) => u.role === id).length;
          const active = empTab === id;
          return (
            <button
              key={id}
              onClick={() => {
                setEmpTab(id);
                setSearch("");
              }}
              style={{
                padding: "10px 20px",
                borderRadius: 11,
                border: "none",
                cursor: "pointer",
                background: active ? "#fff" : "transparent",
                fontWeight: active ? 800 : 600,
                fontSize: 13,
                color: active ? color : "#888",
                boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : undefined,
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
            >
              <RIcon width={16} height={16} />
              {label}
              <span
                style={{
                  background: active ? color : "#e5e7eb",
                  color: active ? "#fff" : "#888",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "1px 7px",
                }}
              >
                {cnt}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "8px 14px",
          }}
        >
          <Ic.Search width={16} height={16} style={{ color: "#aaa" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${empTab.toLowerCase()}s by name or email...`}
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              background: "transparent",
              flex: 1,
              color: "#1a1a1a",
            }}
          />
        </div>
      </div>

      {/* Agents & Admins */}
      {empTab !== "PARTNER" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {filtered.map((u) => (
            <div
              key={u.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1.5px solid #f0f0f0",
                padding: 18,
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#31694E";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(49,105,78,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#f0f0f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <Avatar
                  first={u.first_name}
                  last={u.last_name}
                  size={44}
                  radius={12}
                  bg={u.is_active ? undefined : "#ccc"}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#1a1a1a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u.first_name} {u.last_name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#888",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u.email}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <RoleBadge role={u.role} />
                  {!u.is_active && (
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 99,
                        fontSize: 9,
                        fontWeight: 800,
                        background: "rgba(239,68,68,0.1)",
                        color: "#ef4444",
                      }}
                    >
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <FieldRow label="Phone" value={u.phone || "—"} />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button
                  onClick={() => openEdit(u)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 9,
                    border: "1.5px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#31694E",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Ic.Edit width={13} height={13} /> Edit
                </button>
                {u.is_active && (
                  <button
                    onClick={() => setConfirmRemove(u)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 9,
                      border: "1.5px solid #fecaca",
                      background: "#fef2f2",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    <Ic.Trash width={14} height={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1" }}>
              <EmptyState label={`No ${empTab.toLowerCase()}s found.`} />
            </div>
          )}
        </div>
      )}

      {/* Partners */}
      {empTab === "PARTNER" && (
        <div>
          {filtered.map((partner) => {
            const stats = getPartnerStats(partner);
            return (
              <div
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: "1.5px solid #f0f0f0",
                  marginBottom: 12,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  display: "grid",
                  gridTemplateColumns: "48px 1fr auto auto auto auto auto",
                  gap: 16,
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#BBC863";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(187,200,99,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Avatar
                  first={partner.first_name}
                  last={partner.last_name}
                  size={48}
                  radius={14}
                  bg="linear-gradient(135deg,#BBC863,#9aaa3a)"
                />
                <div>
                  <div
                    style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a" }}
                  >
                    {partner.first_name} {partner.last_name}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    {partner.email}
                  </div>
                  {partner.reference_code && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "#BBC863",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      Ref: {partner.reference_code}
                    </div>
                  )}
                </div>
                {[
                  {
                    label: "Clients",
                    val: stats.clientsReferred,
                    col: "#31694E",
                  },
                  {
                    label: "Applications",
                    val: stats.appsThrough,
                    col: "#3b82f6",
                  },
                  {
                    label: "Approved",
                    val: stats.appsApproved,
                    col: "#22c55e",
                  },
                  {
                    label: "Commission",
                    val: `$${stats.totalCommission.toLocaleString()}`,
                    col: "#BBC863",
                  },
                ].map(({ label, val, col }) => (
                  <div
                    key={label}
                    style={{
                      textAlign: "center",
                      background: "#FAFDF8",
                      borderRadius: 10,
                      padding: "8px 14px",
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 800, color: col }}>
                      {val}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#888", fontWeight: 600 }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
                <Ic.ChevRight
                  width={16}
                  height={16}
                  style={{ color: "#ccc" }}
                />
              </div>
            );
          })}
          {filtered.length === 0 && <EmptyState label="No partners found." />}
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(20,40,30,0.7)",
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
              maxWidth: 480,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                background: "#FAFDF8",
                borderBottom: "1.5px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: "#31694E" }}
                >
                  Edit User
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {editUser.email}
                </div>
              </div>
              <button
                onClick={() => setEditUser(null)}
                style={{
                  background: "#f5f5f5",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                <Ic.X width={16} height={16} />
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {[
                  { key: "first_name", label: "First Name" },
                  { key: "last_name", label: "Last Name" },
                  { key: "phone", label: "Phone" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    style={{ gridColumn: key === "phone" ? "1/-1" : undefined }}
                  >
                    <label
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#888",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      value={editForm[key] || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: 10,
                        border: "1.5px solid #e5e7eb",
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#31694E")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: "#FAFDF8",
                  borderRadius: 10,
                  border: "1px solid #f0f0f0",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    flex: 1,
                  }}
                >
                  Account Active
                </span>
                <button
                  onClick={() =>
                    setEditForm((f) => ({ ...f, is_active: !f.is_active }))
                  }
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 99,
                    border: "none",
                    cursor: "pointer",
                    background: editForm.is_active ? "#31694E" : "#e5e7eb",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: editForm.is_active ? 23 : 3,
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              </div>
            </div>
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1.5px solid #f0f0f0",
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setEditUser(null)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  background: "transparent",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  background: "#31694E",
                  border: "none",
                  color: "#fff",
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
                  <Spinner size={16} color="#fff" />
                ) : (
                  <Ic.Check width={16} height={16} />
                )}{" "}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Detail Drawer */}
      {selectedPartner && (
        <>
          <div
            onClick={() => setSelectedPartner(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 199,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: "min(560px,100vw)",
              background: "#fff",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1.5px solid #f0f0f0",
                background: "rgba(187,200,99,0.06)",
                flexShrink: 0,
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
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                  }}
                >
                  Partner Profile
                </div>
                <div
                  style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}
                >
                  {selectedPartner.first_name} {selectedPartner.last_name}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {selectedPartner.email}
                </div>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                style={{
                  background: "#f5f5f5",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                <Ic.X width={16} height={16} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {(() => {
                const stats = getPartnerStats(selectedPartner);
                const partnerApps = (applications || []).filter(
                  (a) => a.user?.partner?.id === selectedPartner.id,
                );
                return (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2,1fr)",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      {[
                        {
                          label: "Clients Referred",
                          val: stats.clientsReferred,
                          col: "#31694E",
                        },
                        {
                          label: "Applications",
                          val: stats.appsThrough,
                          col: "#3b82f6",
                        },
                        {
                          label: "Approved",
                          val: stats.appsApproved,
                          col: "#22c55e",
                        },
                        {
                          label: "Total Commission",
                          val: `$${stats.totalCommission.toLocaleString()}`,
                          col: "#BBC863",
                        },
                      ].map(({ label, val, col }) => (
                        <div
                          key={label}
                          style={{
                            background: "#FAFDF8",
                            borderRadius: 12,
                            padding: "16px",
                            border: "1px solid #f0f0f0",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 24,
                              fontWeight: 900,
                              color: col,
                            }}
                          >
                            {val}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#888",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <SectionCard title="Partner Info" icon={Ic.User}>
                      <FieldRow label="Email" value={selectedPartner.email} />
                      <FieldRow
                        label="Phone"
                        value={selectedPartner.phone || "—"}
                      />
                      <FieldRow
                        label="Reference Code"
                        value={selectedPartner.reference_code}
                        highlight
                      />
                      <FieldRow
                        label="Active"
                        value={selectedPartner.is_active ? "✅ Yes" : "❌ No"}
                      />
                    </SectionCard>
                    <SectionCard
                      title={`Applications Referred (${partnerApps.length})`}
                      icon={Ic.File}
                    >
                      {partnerApps.map((app) => (
                        <div
                          key={app.loan_application_uuid}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "10px 12px",
                            background: "#FAFDF8",
                            borderRadius: 10,
                            marginBottom: 8,
                            border: "1px solid #f0f0f0",
                          }}
                        >
                          <Avatar
                            first={app.user?.first_name}
                            last={app.user?.last_name}
                            size={34}
                            radius={8}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>
                              {app.user?.first_name} {app.user?.last_name}
                            </div>
                            <div style={{ fontSize: 11, color: "#888" }}>
                              {app.loan_type_info?.name || "—"}
                            </div>
                          </div>
                          {app.partner_commision && (
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: "#22c55e",
                              }}
                            >
                              ${Number(app.partner_commision).toLocaleString()}
                            </div>
                          )}
                          <StatusBadge status={app.status} />
                        </div>
                      ))}
                      {partnerApps.length === 0 && (
                        <EmptyState label="No applications referred yet." />
                      )}
                    </SectionCard>
                  </>
                );
              })()}
            </div>
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1.5px solid #f0f0f0",
                display: "flex",
                gap: 10,
              }}
            >
              <button
                onClick={() => {
                  openEdit(selectedPartner);
                  setSelectedPartner(null);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  background: "#fff",
                  color: "#31694E",
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Ic.Edit width={14} height={14} /> Edit Partner
              </button>
              {selectedPartner.is_active && (
                <button
                  onClick={() => setConfirmRemove(selectedPartner)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1.5px solid #fecaca",
                    background: "#fef2f2",
                    color: "#ef4444",
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Ic.Trash width={14} height={14} /> Deactivate
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {confirmRemove && (
        <ConfirmModal
          title="Deactivate User"
          message={`Deactivate ${confirmRemove.first_name} ${confirmRemove.last_name}? They will lose access to their account.`}
          danger
          onConfirm={handleRemove}
          onCancel={() => setConfirmRemove(null)}
          loading={removing}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GROUP CHAT (admin channel)
// ─────────────────────────────────────────────────────────────────────────────
const GroupChatView = ({ currentUser }) => {
  const [input, setInput] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const bottomRef = useRef(null);

  // useEffect(() => {
  //   const stored = localStorage.getItem("group_chat_admin");
  //   if (stored) {
  //     try {
  //       setMessages(JSON.parse(stored));
  //     } catch {}
  //   } else
  //     setMessages([
  //       {
  //         id: 1,
  //         from: { id: 0, name: "System", role: "ADMIN" },
  //         text: "Welcome to the admin channel.",
  //         time: new Date(Date.now() - 86400000).toISOString(),
  //         isAnnouncement: true,
  //       },
  //     ]);
  // }, []);

  // FIXED MESSAGE STATE

  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("groupChat");

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error("Failed to parse groupChat:", err);
      }
    }

    return [
      {
        id: 1,
        sender: "System",
        text: "Welcome to KACU Group Chat",
        time: new Date().toISOString(),
      },
    ];
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      id: Date.now(),
      from: {
        id: currentUser?.id,
        name: `${currentUser?.first_name} ${currentUser?.last_name}`,
        role: currentUser?.role,
      },
      text: input.trim(),
      time: new Date().toISOString(),
      isAnnouncement,
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem("group_chat_admin", JSON.stringify(updated));
    setInput("");
  };

  const fmt = (iso) => {
    const d = new Date(iso),
      now = new Date();
    if (now - d < 86400000)
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return (
      d.toLocaleDateString([], { month: "short", day: "numeric" }) +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        maxHeight: 700,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          Admin Channel
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#888",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ic.Hash width={14} height={14} /> kacu-admin · Announcements &amp;
          team chat
        </div>
      </div>
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 16,
          border: "1.5px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {messages.map((msg) => {
            const isMe = msg.from.id === currentUser?.id;
            if (msg.isAnnouncement)
              return (
                <div
                  key={msg.id}
                  style={{
                    margin: "12px 0",
                    background:
                      "linear-gradient(135deg,rgba(187,200,99,0.1),rgba(49,105,78,0.08))",
                    border: "1.5px solid rgba(187,200,99,0.3)",
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: "#31694E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ic.Megaphone
                        width={12}
                        height={12}
                        style={{ color: "#F0E491" }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#31694E",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      📢 Announcement · {msg.from.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#aaa",
                        marginLeft: "auto",
                      }}
                    >
                      {fmt(msg.time)}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.6 }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  marginBottom: 12,
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                {!isMe && (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "linear-gradient(135deg,#31694E,#658C58)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {msg.from.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div style={{ maxWidth: "70%" }}>
                  {!isMe && (
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#888",
                        marginBottom: 4,
                        paddingLeft: 2,
                      }}
                    >
                      {msg.from.name} · {msg.from.role}
                    </div>
                  )}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: isMe
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                      background: isMe ? "#31694E" : "#f5f5f5",
                      color: isMe ? "#fff" : "#1a1a1a",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#aaa",
                      marginTop: 3,
                      textAlign: isMe ? "right" : "left",
                    }}
                  >
                    {fmt(msg.time)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1.5px solid #f0f0f0",
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          <button
            onClick={() => setIsAnnouncement(!isAnnouncement)}
            title={isAnnouncement ? "Announcement mode" : "Regular message"}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1.5px solid",
              borderColor: isAnnouncement ? "#BBC863" : "#e5e7eb",
              background: isAnnouncement ? "rgba(187,200,99,0.15)" : "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isAnnouncement ? "#BBC863" : "#ccc",
              flexShrink: 0,
            }}
          >
            <Ic.Megaphone width={18} height={18} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={
              isAnnouncement
                ? "📢 Type an announcement..."
                : "Message the team... (Enter to send)"
            }
            rows={2}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${isAnnouncement ? "#BBC863" : "#e5e7eb"}`,
              outline: "none",
              fontSize: 13,
              resize: "none",
              fontFamily: "inherit",
              lineHeight: 1.4,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: isAnnouncement ? "#BBC863" : "#31694E",
              border: "none",
              cursor: !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: !input.trim() ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            <Ic.Send width={18} height={18} style={{ color: "#fff" }} />
          </button>
        </div>
        {isAnnouncement && (
          <div
            style={{
              padding: "6px 16px 10px",
              fontSize: 11,
              color: "#BBC863",
              fontWeight: 700,
            }}
          >
            📢 Announcement mode — visible to all team members
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MINI BAR CHART
// ─────────────────────────────────────────────────────────────────────────────
const MiniBar = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              height: Math.max(4, (d.value / max) * 48),
              background: d.color || "#31694E",
              borderRadius: "4px 4px 0 0",
              opacity: 0.85,
            }}
          />
          <div
            style={{
              fontSize: 9,
              color: "#aaa",
              fontWeight: 600,
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW — green brand, matching agent page style
// ─────────────────────────────────────────────────────────────────────────────
const DashboardView = ({ users, applications, loanTypes, user }) => {
  const counts = {
    clients: (users || []).filter((u) => u.role === "APPLICANT").length,
    agents: (users || []).filter((u) => u.role === "AGENT").length,
    admins: (users || []).filter((u) => u.role === "ADMIN").length,
    partners: (users || []).filter((u) => u.role === "PARTNER").length,
    apps: (applications || []).length,
    approved: (applications || []).filter((a) => a.status === "approved")
      .length,
    pending: (applications || []).filter(
      (a) => a.status === "pending" || a.status === "submitted",
    ).length,
    rejected: (applications || []).filter((a) => a.status === "rejected")
      .length,
    referred: (applications || []).filter((a) => !!a.user?.partner).length,
    totalFunds: (applications || [])
      .filter((a) => a.status === "approved")
      .reduce((s, a) => s + Number(a.approved_funds || 0), 0),
  };
  const conversion =
    counts.apps > 0 ? Math.round((counts.approved / counts.apps) * 100) : 0;
  const loanTypeData = (loanTypes || []).slice(0, 7).map((lt, i) => ({
    label: lt.name?.split(" ")[0] || lt.name,
    value: (applications || []).filter(
      (a) => (a.loan_type_info?.name || a.loan_type?.name) === lt.name,
    ).length,
    color: LOAN_TYPE_COLORS[i % LOAN_TYPE_COLORS.length],
  }));
  const recent = [...(applications || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);

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
          Admin Overview 🛡️
        </div>
        <div style={{ fontSize: 14, color: "#888" }}>
          Welcome back, {user?.first_name}! Platform-wide analytics.
        </div>
      </div>

      {/* Team stats */}
      <div
        style={{
          marginBottom: 10,
          fontSize: 11,
          fontWeight: 800,
          color: "#BBC863",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Team
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Clients",
            val: counts.clients,
            col: "#3b82f6",
            bg: "rgba(59,130,246,0.08)",
            icon: Ic.Users,
          },
          {
            label: "Agents",
            val: counts.agents,
            col: "#31694E",
            bg: "rgba(49,105,78,0.08)",
            icon: Ic.Shield,
          },
          {
            label: "Partners",
            val: counts.partners,
            col: "#BBC863",
            bg: "rgba(187,200,99,0.12)",
            icon: Ic.Star,
          },
          {
            label: "Admins",
            val: counts.admins,
            col: "#8b5cf6",
            bg: "rgba(139,92,246,0.1)",
            icon: Ic.Shield,
          },
        ].map(({ label, val, col, bg, icon: I }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 18,
              border: "1.5px solid #f0f0f0",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <I width={18} height={18} style={{ color: col }} />
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: col,
                marginBottom: 4,
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* App stats */}
      <div
        style={{
          marginBottom: 10,
          fontSize: 11,
          fontWeight: 800,
          color: "#BBC863",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Applications
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Total",
            val: counts.apps,
            col: "#31694E",
            bg: "rgba(49,105,78,0.08)",
            icon: Ic.File,
          },
          {
            label: "Needs Review",
            val: counts.pending,
            col: "#f59e0b",
            bg: "rgba(245,158,11,0.08)",
            icon: Ic.Clock,
          },
          {
            label: "Approved",
            val: counts.approved,
            col: "#22c55e",
            bg: "rgba(34,197,94,0.08)",
            icon: Ic.Check,
          },
          {
            label: "Rejected",
            val: counts.rejected,
            col: "#ef4444",
            bg: "rgba(239,68,68,0.08)",
            icon: Ic.XCircle,
          },
          {
            label: "Referred",
            val: counts.referred,
            col: "#BBC863",
            bg: "rgba(187,200,99,0.08)",
            icon: Ic.Star,
          },
        ].map(({ label, val, col, bg, icon: I }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 18,
              border: "1.5px solid #f0f0f0",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <I width={18} height={18} style={{ color: col }} />
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: col,
                marginBottom: 4,
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Conversion Rate
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#31694E",
              marginBottom: 6,
            }}
          >
            {conversion}%
          </div>
          <div
            style={{
              height: 8,
              background: "#f0f0f0",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${conversion}%`,
                background: "linear-gradient(90deg,#31694E,#658C58)",
                borderRadius: 99,
              }}
            />
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Total Funds Approved
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e" }}>
            ${counts.totalFunds.toLocaleString()}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Referral Rate
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#BBC863",
              marginBottom: 6,
            }}
          >
            {counts.apps > 0
              ? Math.round((counts.referred / counts.apps) * 100)
              : 0}
            %
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {counts.referred} via partners
          </div>
        </div>
      </div>

      {loanTypeData.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            Applications by Loan Type
          </div>
          <MiniBar data={loanTypeData} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 12,
            }}
          >
            {loanTypeData.map((d) => (
              <div
                key={d.label}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: d.color,
                  }}
                />
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>
                  {d.label}: {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: "#1a1a1a",
          marginBottom: 14,
        }}
      >
        Recent Applications
      </div>
      {recent.map((app) => (
        <div
          key={app.loan_application_uuid}
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "14px 18px",
            border: "1.5px solid #f0f0f0",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Avatar
            first={app.user?.first_name}
            last={app.user?.last_name}
            size={38}
            radius={10}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>
              {app.user?.first_name} {app.user?.last_name}
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>
              {app.loan_type_info?.name || "—"} ·{" "}
              {app.user?.assigned_agent_details
                ? `Agent: ${app.user.assigned_agent_details.first_name}`
                : "Unassigned"}
            </div>
          </div>
          {app.user?.partner && (
            <span
              style={{
                background: "rgba(187,200,99,0.15)",
                color: "#868a30",
                padding: "2px 8px",
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              Referred
            </span>
          )}
          <StatusBadge status={app.status} />
        </div>
      ))}
      {recent.length === 0 && <EmptyState label="No applications yet." />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR  — green brand (matching agent page, not dark navy)
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Ic.Home },
  { id: "applications", label: "Applications", icon: Ic.File },
  { id: "clients", label: "Clients", icon: Ic.Users },
  { id: "employees", label: "Team & Partners", icon: Ic.Shield },
  { id: "invitations", label: "Invitations", icon: Ic.Invite },
  { id: "loan-types", label: "Loan Types", icon: Ic.Dollar },
  { id: "group-chat", label: "Admin Channel", icon: Ic.Chat },
];

const Sidebar = ({ active, setActive, user, onClose, isMobile, counts }) => (
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
        <Ic.Leaf width={28} height={28} style={{ color: "#F0E491" }} />
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
          }}
        >
          <Ic.X width={20} height={20} />
        </button>
      )}
    </div>

    <div
      style={{
        padding: "10px 12px",
        background: "rgba(240,228,145,0.12)",
        borderRadius: 10,
        marginBottom: 20,
        border: "1px solid rgba(240,228,145,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#BBC863",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 2,
        }}
      >
        Admin Portal
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
        {user?.first_name} {user?.last_name}
      </div>
      <div
        style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1 }}
      >
        {user?.email}
      </div>
    </div>

    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
      {NAV.map(({ id, label, icon: NavIcon }) => {
        const isActive = active === id;
        const badge = counts?.[id];
        return (
          <button
            key={id}
            onClick={() => {
              setActive(id);
              if (isMobile) onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 16px",
              borderRadius: 12,
              border: "none",
              background: isActive ? "rgba(240,228,145,0.15)" : "transparent",
              color: isActive ? "#F0E491" : "rgba(255,255,255,0.5)",
              fontWeight: isActive ? 800 : 600,
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.2s",
              borderLeft: isActive
                ? "3px solid #F0E491"
                : "3px solid transparent",
            }}
          >
            <NavIcon width={18} height={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge > 0 && (
              <span
                style={{
                  background: "#BBC863",
                  color: "#1c3e2c",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "1px 7px",
                }}
              >
                {badge}
              </span>
            )}
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
      <Ic.Logout width={18} height={18} /> Sign Out
    </button>
  </aside>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// KEY FIXES:
//  1. Each API call wrapped in .catch(()=>[]) — mirrors agent page pattern
//  2. /admin/users/ failure no longer crashes the entire dashboard
//  3. Green brand sidebar instead of dark navy
//  4. Friendly "server starting up" banner when users data is empty
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppUuid, setSelectedAppUuid] = useState(null);
  const [toast, setToast] = useState(null);
  const [usersError, setUsersError] = useState(false);

  const showToast = (msg, type = "success") => setToast({ msg, type });

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

      // ── CRITICAL FIX: each call has its own .catch() ──────────────────────
      // This mirrors the agent page pattern. If /admin/users/ returns 503,
      // we get an empty array and show a banner — the rest of the page works.
      const [me, usersData, appsData, ltData] = await Promise.all([
        apiGet("/user-profile/me/"),
        apiGet("/admin/users/").catch(() => {
          setUsersError(true);
          return [];
        }),
        apiGet("/application/").catch(() => []),
        apiGet("/loan-types/").catch(() => []),
      ]);

      setAdminUser(me);
      setUsers(Array.isArray(usersData) ? usersData : usersData?.results || []);
      setApplications(
        Array.isArray(appsData) ? appsData : appsData?.results || [],
      );
      const lt = ltData?.data || ltData?.results || ltData;
      setLoanTypes(Array.isArray(lt) ? lt : []);
    } catch (e) {
      // Only hits here if /user-profile/me/ fails (which means auth issue)
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
      @keyframes kacu-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      *{box-sizing:border-box}
      body{margin:0;font-family:'Plus Jakarta Sans',sans-serif;background:#f5f6f8}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#e0e0e0;border-radius:99px}
      select,textarea{font-family:'Plus Jakarta Sans',sans-serif}
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const pendingApps = applications.filter(
    (a) => a.status === "pending" || a.status === "submitted",
  ).length;
  const navCounts = { applications: pendingApps };

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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Ic.Leaf width={32} height={32} style={{ color: "#31694E" }} />
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
        <Spinner size={36} />
        <div style={{ fontSize: 13, color: "#888" }}>Loading admin portal…</div>
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
          Failed to load
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
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {/* Desktop sidebar */}
      <div
        style={{ width: 240, flexShrink: 0 }}
        className="admin-sidebar-desktop"
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
            active={activeTab}
            setActive={setActiveTab}
            user={adminUser}
            onClose={() => {}}
            isMobile={false}
            counts={navCounts}
          />
        </div>
      </div>

      {/* Mobile sidebar */}
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
              active={activeTab}
              setActive={setActiveTab}
              user={adminUser}
              onClose={() => setSidebarOpen(false)}
              isMobile
              counts={navCounts}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, padding: 24, overflowX: "hidden" }}>
        {/* Topbar */}
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
            className="admin-menu-btn"
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
            <Ic.Menu width={20} height={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {usersError && (
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  background: "rgba(245,158,11,0.1)",
                  border: "1.5px solid rgba(245,158,11,0.3)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#92400e",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Ic.Alert width={12} height={12} style={{ color: "#f59e0b" }} />
                User data unavailable
              </div>
            )}
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
              <Ic.Refresh
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
                background: "#BBC863",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#31694E",
              }}
            >
              {adminUser?.first_name?.[0]}
              {adminUser?.last_name?.[0]}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1200 }}>
          {activeTab === "dashboard" && (
            <DashboardView
              users={users}
              applications={applications}
              loanTypes={loanTypes}
              user={adminUser}
            />
          )}
          {activeTab === "applications" && (
            <ApplicationsView
              applications={applications}
              loanTypes={loanTypes}
              onSelectApp={(uuid) => setSelectedAppUuid(uuid)}
            />
          )}
          {activeTab === "clients" && (
            <ClientsView
              users={users}
              applications={applications}
              onRefresh={() => fetchAll(true)}
              onSelectApp={(uuid) => setSelectedAppUuid(uuid)}
              showToast={showToast}
            />
          )}
          {activeTab === "employees" && (
            <EmployeesView
              users={users}
              applications={applications}
              onRefresh={() => fetchAll(true)}
              showToast={showToast}
            />
          )}
          {activeTab === "invitations" && (
            <InvitationsView showToast={showToast} />
          )}
          {activeTab === "loan-types" && (
            <LoanTypesView
              loanTypes={loanTypes}
              onRefresh={() => fetchAll(true)}
              showToast={showToast}
            />
          )}
          {activeTab === "group-chat" && (
            <GroupChatView currentUser={adminUser} />
          )}
        </div>
      </main>

      {selectedAppUuid && (
        <AppDetailDrawer
          uuid={selectedAppUuid}
          onClose={() => setSelectedAppUuid(null)}
          onDecisionMade={() => fetchAll(true)}
        />
      )}

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      <style>{`
        @media(max-width:900px){.admin-sidebar-desktop{display:none!important}.admin-menu-btn{display:flex!important}main{padding:16px!important}}
        @media(min-width:901px){.admin-menu-btn{display:none!important}}
      `}</style>
    </div>
  );
}
